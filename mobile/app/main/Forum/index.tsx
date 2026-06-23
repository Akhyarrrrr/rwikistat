import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  RefreshControl,
  Keyboard,
  StatusBar,
  useColorScheme,
} from "react-native";
import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useAuth } from "@/context/authContext";
import { FloatingAction } from "react-native-floating-action";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/id";
import ButtonLike from "./components/ButtonLike";
import ButtonBookmark from "./components/ButtonBookmark";
import Feather from "@expo/vector-icons/Feather";
import { useTabVisibility } from "../_layout";
import * as Clipboard from "expo-clipboard";
import config from "@/config";

dayjs.extend(relativeTime);
dayjs.locale("id");

const logo = require("../../../assets/images/icon.png");
const notfound = require("../../../assets/images/notfound.png");

interface ForumPostProps {
  id: string;
  name: string;
  email: string;
  verify: boolean;
  time: string;
  question: string;
  description: string;
  likes: number;
  image?: string;
  photo: string;
  bookmarkCount: number;
  bookmark: string[];
  userId: string;
}

type SortOption = "newest" | "oldest" | "mostLiked" | "mostBookmarked";

const Forum: React.FC = () => {
  const [posts, setPosts] = useState<ForumPostProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const { getAccessToken, user } = useAuth();
  const { setIsInputFocused } = useTabVisibility();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const scheme = useColorScheme();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
        setIsInputFocused(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
        setIsInputFocused(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const fetchForumData = async () => {
    const accessToken = await getAccessToken();
    try {
      const response = await fetch(
        `${config.API_URL}/api/forum/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      const forumData = data.forumData;
      const mappedPosts = forumData.map((item: any) => ({
        id: item.id,
        name: item.user.displayName,
        email: item.user.email,
        verify: item.user.verified,
        time: new Date(item.data.createdAt._seconds * 1000).toISOString(),
        question: item.data.title,
        description: item.data.topics || "",
        likes: item.data.likes || 0,
        image: item.data.images[0] || null,
        photo: item.user.photoURL,
        bookmarkCount: item.data.bookmarks?.length || 0,
        bookmark: item.data.bookmarks || [],
        userId: user?.uid,
      }));
      setPosts(mappedPosts);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error("Error fetching forum data:", error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchForumData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchForumData();
  }, []);

  const getSortedPosts = (posts: ForumPostProps[]) => {
    switch (sortBy) {
      case "mostLiked":
        return [...posts].sort((a, b) => b.likes - a.likes);
      case "mostBookmarked":
        return [...posts].sort((a, b) => b.bookmarkCount - a.bookmarkCount);
      case "newest":
        return [...posts].sort(
          (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
        );
      case "oldest":
        return [...posts].sort(
          (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
        );
      default:
        return posts;
    }
  };

  const filteredPosts = getSortedPosts(
    posts.filter(
      (post) =>
        post.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const FilterButton: React.FC<{
    title: string;
    isActive: boolean;
    onPress: () => void;
  }> = ({ title, isActive, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 rounded-full mr-2 ${
        isActive ? "bg-primary" : "border-primary border"
      }`}
    >
      <Text
        className={`font-poppins ${isActive ? "text-white" : "text-primary"}`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar
        barStyle={scheme === "dark" ? "dark-content" : "dark-content"}
        backgroundColor="#ffffff"
        translucent
      />
      {!isKeyboardVisible && (
        <Stack.Screen
          options={{
            title: "Forum diskusi",
            headerStyle: { backgroundColor: "#ffffff" },
            headerTintColor: "#00726B",
            headerTitleStyle: { fontFamily: "poppinsSemiBold", fontSize: 20 },
          }}
        />
      )}
      <View className="flex-1 bg-softgray">
        <View className="px-6 py-4 bg-white shadow">
          <TouchableOpacity
            onPress={() => setIsInputFocused(true)}
            className="flex-row items-center px-4 py-2 bg-gray-100 border rounded border-primary"
          >
            <Image source={logo} className="w-8 h-8 rounded-full" />
            <TextInput
              placeholder="Cari Pertanyaan di Forum..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
              onFocus={() => setIsInputFocused(true)}
              className="flex-1 ml-4 text-black font-poppins"
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <FontAwesome name="times" size={20} color="#00726B" />
              </TouchableOpacity>
            ) : null}
          </TouchableOpacity>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-4"
          >
            <FilterButton
              title="Terbaru"
              isActive={sortBy === "newest"}
              onPress={() => setSortBy("newest")}
            />
            <FilterButton
              title="Terlama"
              isActive={sortBy === "oldest"}
              onPress={() => setSortBy("oldest")}
            />
            <FilterButton
              title="Like Terbanyak"
              isActive={sortBy === "mostLiked"}
              onPress={() => setSortBy("mostLiked")}
            />
            <FilterButton
              title="Bookmark Terbanyak"
              isActive={sortBy === "mostBookmarked"}
              onPress={() => setSortBy("mostBookmarked")}
            />
          </ScrollView>
        </View>

        {loading ? (
          <View className="flex-1 justify-center items-center bg-[#f5f5f5]">
            <ActivityIndicator size="large" color="#00726B" />
            <Text className="mt-4 text-gray-600 font-poppins">
              Memuat Forum...
            </Text>
          </View>
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#38B68D"]}
                tintColor="#38B68D"
              />
            }
          >
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, index) => (
                <ForumPost key={index} {...post} userId={user?.uid || ""} />
              ))
            ) : (
              <View className="items-center justify-center flex-1 mt-10">
                <Image
                  source={notfound}
                  className="object-contain w-full"
                  resizeMode="contain"
                />
              </View>
            )}
          </ScrollView>
        )}

        <FloatingAction
          onPressMain={() => router.push("../../Detail/askForum")}
          color="#00726B"
          floatingIcon={
            <MaterialCommunityIcons
              name="message-plus"
              size={26}
              color="#fff"
            />
          }
          overlayColor="none"
        />
      </View>
    </>
  );
};

const ForumPost: React.FC<ForumPostProps> = ({
  id,
  name,
  verify,
  time,
  question,
  description,
  likes,
  image,
  photo,
  bookmark,
  bookmarkCount,
  userId,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const { getUser, getAccessToken } = useAuth();

  const handleBookmarkPress = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleCopyPress = async () => {
    const contentToCopy = `${question}\n\n${description}`;
    await Clipboard.setStringAsync(contentToCopy);
  };

  const formattedTime = dayjs(time).isBefore(dayjs().subtract(7, "day"))
    ? dayjs(time).format("MMM D, YYYY [at] h:mm A")
    : dayjs(time).fromNow();

  const handlePress = () => {
    router.push({
      pathname: "/Detail/detailForum",
      params: {
        id,
        name,
        time,
        question,
        description,
        likes: likeCount,
        image,
        photo,
        bookmark,
      },
    });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="p-6 mx-6 my-4 bg-white rounded-md shadow"
    >
      <View className="flex-row items-center">
        <View className="border-2 rounded-md border-primary">
          <Image src={photo} className="w-10 h-10" />
        </View>
        <View className="ml-3">
          <View className="flex-row items-center">
            <Text className="font-poppinsBold">{name}</Text>
            {verify ? (
              <View className="pl-1">
                <MaterialIcons name="verified" size={14} color={"#00726B"} />
              </View>
            ) : null}
          </View>
          <Text className="text-xs text-gray-500 font-poppins">
            {formattedTime}
          </Text>
        </View>
      </View>

      <Text className="mt-4 text-lg font-poppinsBold">{question}</Text>
      <Text className="mt-1 text-gray-600 font-poppins">{description}</Text>

      {image && (
        <Image
          source={{ uri: image }}
          className="w-full h-24 mt-4 bg-gray-200"
        />
      )}

      <View className="flex-row items-center justify-between mt-4">
        <View className="flex-row items-center">
          <TouchableOpacity className="flex-row items-center mr-4">
            <ButtonLike itemId={id} />
            <Text className="ml-1 text-primary font-poppins">{likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center mr-4">
            <ButtonBookmark itemId={id} />
            <Text className="ml-1 text-primary font-poppins">
              {bookmarkCount}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleCopyPress}
          className="flex-row items-center"
        >
          <Feather name="copy" size={20} color="#00726B" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default Forum;
