import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, ToastAndroid, Platform } from "react-native";
import { useAuth } from "@/context/authContext";
import { MaterialIcons } from "@expo/vector-icons";

const ButtonBookmark: React.FC<{ itemId: string }> = ({ itemId }) => {
  const [buttonBookmark, setBookmarkButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { getAccessToken, getUser } = useAuth();

  useEffect(() => {
    handleIsBookmarked(itemId);
  }, [itemId]);

  const handleIsBookmarked = async (itemId: string) => {
    try {
      const user = await getUser();
      const userId = user?.uid;
      if (userId) {
        const accessToken = await getAccessToken();
        fetch(
          `${process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080"}/api/forum/bookmark/${itemId}/is-bookmarked?uid=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
          .then((response) => response.json())
          .then((responJson) => {
            const { isBookmarked } = responJson;
            setBookmarkButton(isBookmarked);
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Gagal mengambil bookmark:", error);
      setIsLoading(false);
    }
  };

  const showToast = (message: string) => {
    if (Platform.OS === "android" || Platform.OS === "ios") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    }
  };

  const handleBookmark = async (itemId: string) => {
    try {
      setIsLoading(true);
      const userData: any = await getUser();
      const userId = userData?.uid;
      if (userId) {
        const accessToken = await getAccessToken();
        const requestBody = {
          uid: userId,
        };
        fetch(`${process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080"}/api/forum/bookmark/${itemId}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        })
          .then((response) => response.json())
          .then((responJson) => {
            setBookmarkButton(true);
            setIsLoading(false);
            showToast("Anda telah memberi bookmark pada postingan ini 🎉");
          });
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Gagal memberi bookmark postingan:", error);
      setIsLoading(false);
    }
  };

  const handleUnbookmark = async (itemId: string) => {
    try {
      setIsLoading(true);
      const userData: any = await getUser();
      const userId = userData?.uid;
      if (userId) {
        const accessToken = await getAccessToken();
        const requestBody = {
          uid: userId,
        };
        fetch(`${process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080"}/api/forum/unbookmark/${itemId}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        })
          .then((response) => response.json())
          .then((responJson) => {
            setBookmarkButton(false);
            setIsLoading(false);
            showToast("Anda telah membatalkan bookmark pada postingan ini 😢");
          });
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Gagal unbookmark postingan:", error);
      setIsLoading(false);
    }
  };

  const onPressHandler = buttonBookmark ? handleUnbookmark : handleBookmark;

  return (
    <View className="pb-1">
      {isLoading ? (
        <ActivityIndicator size="small" color="#00726B" />
      ) : (
        <MaterialIcons
          onPress={() => {
            onPressHandler(itemId);
          }}
          name={buttonBookmark ? "bookmark" : "bookmark-border"}
          size={20}
          color={buttonBookmark ? "#00726B" : "#00726B"}
          id={itemId}
        />
      )}
    </View>
  );
};

export default ButtonBookmark;
