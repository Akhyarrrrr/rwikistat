import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  RefreshControl,
  Modal,
  Dimensions,
  Pressable,
  StatusBar,
  useColorScheme,
} from "react-native";
import { MaterialIcons, Feather, Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useAuth } from "@/context/authContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/id";
import ButtonLike from "../../main/Forum/components/ButtonLike";
import ButtonBookmark from "../../main/Forum/components/ButtonBookmark";
import config from "@/config";

dayjs.extend(relativeTime);
dayjs.locale("id");

const nodata = require("../../../assets/images/nodata.png");

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
  bookmarkCount,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const handleCopyPress = async () => {
    try {
      const contentToCopy = `${question}\n\n${description}`;
      await Share.share({
        message: contentToCopy,
      });
    } catch (error) {
      console.error("Error sharing content:", error);
    }
  };

  const formattedTime = dayjs(time).isBefore(dayjs().subtract(7, "day"))
    ? dayjs(time).format("MMM D, YYYY [at] h:mm A")
    : dayjs(time).fromNow();

  const ImageModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <Pressable
        style={{ flex: 1 }}
        onPress={() => setModalVisible(false)}
        className="items-center justify-center bg-black/80"
      >
        <View className="items-center justify-center w-full h-full">
          <Pressable onPress={(e) => e.stopPropagation()}>
            <Image
              source={{ uri: image }}
              style={{
                width: screenWidth * 0.9,
                height: screenHeight * 0.6,
                resizeMode: "contain",
              }}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="absolute top-[-40] right-0 p-2 bg-white rounded-md"
            >
              <Ionicons name="close" size={24} color="#00726B" />
            </TouchableOpacity>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );

  return (
    <View className="p-6 mx-6 my-4 bg-white rounded-md shadow">
      <ImageModal />
      <View className="flex-row items-center">
        <View className="border-2 rounded-md border-primary">
          <Image source={{ uri: photo }} className="w-10 h-10 rounded-md" />
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
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: image }}
            className="w-full h-56 mt-4 bg-gray-200 rounded-md"
          />
        </TouchableOpacity>
      )}

      <View className="flex-row items-center mt-4">
        <TouchableOpacity
          className="flex-row items-center mr-4"
          activeOpacity={0.6}
        >
          <ButtonLike itemId={id} />
          <Text className="ml-1 text-primary font-poppins">{likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center mr-4"
          activeOpacity={0.6}
        >
          <ButtonBookmark itemId={id} />
          <Text className="ml-1 text-primary font-poppins">
            {bookmarkCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleCopyPress}
          className="flex-row items-center"
          activeOpacity={0.6}
        >
          <Feather name="copy" size={20} color="#00726B" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const MyBookmark: React.FC = () => {
  const [posts, setPosts] = useState<ForumPostProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { getAccessToken, getUser } = useAuth();
  const [user, setUser] = useState<any>({});
  const scheme = useColorScheme();

  useEffect(() => {
    const fetchUser = async () => {
      const userData: any = await getUser();
      setUser(userData);
    };
    fetchUser();
  }, []);

  const fetchForumData = async () => {
    const accessToken = await getAccessToken();
    try {
      const response = await fetch(
        `${config.API_URL}/api/forum/bookmarks/${user?.uid}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      const forumData = data.bookmarks;

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
    if (user.uid) {
      fetchForumData();
    }
  }, [user]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchForumData();
  }, [user.uid]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f5f5f5]">
        <ActivityIndicator size="large" color="#00726B" />
        <Text className="mt-4 text-gray-600 font-poppins">
          Memuat Tersimpan...
        </Text>
      </View>
    );
  }

  const handleBack = () => {
    router.replace("../../../main/Profile");
  };

  return (
    <>
      <StatusBar
        barStyle={scheme === "dark" ? "dark-content" : "dark-content"}
        backgroundColor="#ffffff"
        translucent
      />
      <Stack.Screen
        options={{
          title: "Postingan Tersimpan",
          headerStyle: { backgroundColor: "#00726B" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontFamily: "poppinsSemiBold", fontSize: 18 },
          headerBackTitle: "Pengaturan",
          headerLeft: () => (
            <TouchableOpacity onPress={handleBack} className="mr-8">
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      <View className="flex-1 bg-softgray">
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
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <ForumPost key={index} {...post} userId={user?.uid || ""} />
            ))
          ) : (
            <View className="items-center justify-center flex-1 mt-10">
              <Image
                source={nodata}
                className="object-contain w-full"
                resizeMode="contain"
              />
              <Text className="text-black font-poppins">
                Belum ada postingan tersimpan
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
};

export default MyBookmark;
