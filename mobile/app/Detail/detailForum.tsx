import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Share,
  Modal,
  Dimensions,
  Pressable,
  Keyboard,
  StatusBar,
  useColorScheme,
} from "react-native";
import { MaterialIcons, Ionicons, Feather } from "@expo/vector-icons";
import { useLocalSearchParams, Stack, router } from "expo-router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/id";
import { useAuth } from "@/context/authContext";
import ButtonLike from "../main/Forum/components/ButtonLike";
import ButtonBookmark from "../main/Forum/components/ButtonBookmark";
import config from "@/config";

dayjs.extend(relativeTime);
dayjs.locale("id");

interface CommentType {
  name: string;
  verify: boolean;
  time: string;
  photo: string;
  text: string;
}

export default function DetailForum() {
  const params = useLocalSearchParams();
  const {
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
  } = params;

  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState<CommentType[]>([]);
  const { getAccessToken, getUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const scheme = useColorScheme();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const formatTime = (time: any) => {
    const parsedTime = dayjs(Array.isArray(time) ? time[0] : time);
    return parsedTime.isBefore(dayjs().subtract(7, "day"))
      ? parsedTime.format("MMM D, YYYY, h:mm A")
      : parsedTime.fromNow();
  };

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

  const fetchComment = useCallback(async () => {
    const accessToken = await getAccessToken();
    try {
      const response = await fetch(
        `${config.API_URL}/api/forum/${id}/comments`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      const mappedComment = data.map((item: any) => ({
        name: item.user.displayName,
        verify: item.user.verified,
        time: new Date(item.data.createdAt._seconds * 1000).toISOString(),
        photo: item.user.photoURL,
        text: item.data.text,
      }));
      mappedComment.sort(
        (a: any, b: any) =>
          new Date(b.time).getTime() - new Date(a.time).getTime()
      );
      setCommentList(mappedComment);
    } catch (error) {
      console.error("Error fetching forum data:", error);
    }
  }, [getAccessToken, id]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchComment();
    setRefreshing(false);
  }, [fetchComment]);

  useEffect(() => {
    fetchComment().finally(() => setIsLoading(false));
  }, [fetchComment]);

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;
    setIsSubmitting(true);
    try {
      const user = await getUser();
      const accessToken = await getAccessToken();

      if (!user?.uid) return;

      const requestBody = {
        text: comment,
        uid: user.uid,
      };
      const response = await fetch(
        `${config.API_URL}/api/forum/${id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        setComment("");
        await fetchComment();
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
      Keyboard.dismiss();
    }
  };

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
              source={{ uri: Array.isArray(image) ? image[0] : image }}
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

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f5f5f5]">
        <ActivityIndicator size="large" color="#00726B" />
        <Text className="mt-4 text-gray-600 font-poppins">
          Memuat Detail Forum...
        </Text>
      </View>
    );
  }

  const handleBack = () => {
    router.replace("../../main/Forum");
  };

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
            title: "Detail Forum",
            headerStyle: { backgroundColor: "#00726B" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontFamily: "poppinsSemiBold", fontSize: 18 },
            headerBackTitle: "Forum",
            headerLeft: () => (
              <TouchableOpacity onPress={handleBack} className="mr-8">
                <Ionicons name="chevron-back" size={24} color="#fff" />
              </TouchableOpacity>
            ),
          }}
        />
      )}

      <ImageModal />

      <ScrollView
        className="flex-1 p-6 bg-softgray"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#38B68D"]}
            tintColor="#38B68D"
          />
        }
      >
        <View className="p-4 bg-white rounded-md shadow">
          <View className="flex-row items-center mb-2">
            <View className="border-2 rounded-md border-primary">
              <Image
                source={{ uri: Array.isArray(photo) ? photo[0] : photo }}
                className="w-10 h-10 rounded-md"
              />
            </View>
            <View className="ml-3">
              <View className="flex-row items-center">
                <Text className="font-poppinsBold">{name}</Text>
                {verify ? (
                  <View className="pl-1">
                    <MaterialIcons name="verified" size={14} color="#00726B" />
                  </View>
                ) : null}
              </View>
              <Text className="text-xs text-gray-500 font-poppins">
                {formatTime(time)}
              </Text>
            </View>
          </View>

          <Text className="text-lg font-poppinsBold">{question}</Text>
          <Text className="mt-1 text-gray-600 font-poppins">{description}</Text>

          {image && (
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: Array.isArray(image) ? image[0] : image }}
                className="w-full h-56 mt-4 rounded-md"
              />
            </TouchableOpacity>
          )}

          <View className="flex-row items-center mt-4">
            <TouchableOpacity
              className="flex-row items-center mr-4"
              activeOpacity={0.6}
            >
              <ButtonLike itemId={id as string} />
              <Text className="ml-1 text-primary font-poppins">{likes}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center mr-4"
              activeOpacity={0.6}
            >
              <ButtonBookmark itemId={id as string} />
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

          <View className="flex-row items-center mt-4">
            <TouchableOpacity className="flex-1">
              <TextInput
                value={comment}
                onChangeText={setComment}
                placeholder="Tambahkan Komentar..."
                placeholderTextColor="#9e9e9e"
                className="flex-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded font-poppins"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleCommentSubmit();
              }}
              disabled={isSubmitting}
              activeOpacity={0.7}
              className={`bg-primary px-4 py-2 rounded ml-2 flex-row items-center justify-center ${
                isSubmitting ? "opacity-50" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <ActivityIndicator size="small" color="#ffffff" />
                  <Text className="ml-2 text-white font-poppinsBold">
                    Mengirim
                  </Text>
                </>
              ) : (
                <Text className="text-white font-poppinsBold">Kirim</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-4">
          {commentList.map((item, index) => (
            <View key={index} className="p-4 my-2 bg-white rounded-md shadow">
              <View className="flex-row items-center mb-2">
                <View className="border-2 rounded-md border-primary">
                  <Image
                    source={{ uri: item.photo }}
                    className="w-8 h-8 rounded-md"
                  />
                </View>
                <View className="ml-3">
                  <View className="flex-row items-center">
                    <Text className="font-poppinsBold">{item.name}</Text>
                    {item.verify && (
                      <View className="pl-1">
                        <MaterialIcons
                          name="verified"
                          size={12}
                          color="#00726B"
                        />
                      </View>
                    )}
                  </View>
                  <Text className="text-xs text-gray-500 font-poppins">
                    {formatTime(item.time)}
                  </Text>
                </View>
              </View>
              <Text className="text-gray-600 font-poppins">{item.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
}
