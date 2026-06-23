import React, { useCallback, useEffect, useState } from "react";
import { View, ActivityIndicator, ToastAndroid, Platform } from "react-native";
import { useAuth } from "@/context/authContext";
import { MaterialIcons } from "@expo/vector-icons";
import config from "@/config";

const ButtonBookmark: React.FC<{ itemId: string }> = ({ itemId }) => {
  const [buttonBookmark, setBookmarkButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { getAccessToken, getUser } = useAuth();

  const handleIsBookmarked = useCallback(async () => {
    try {
      const user = await getUser();
      const userId = user?.uid;

      if (!userId) {
        setIsLoading(false);
        return;
      }

      const accessToken = await getAccessToken();
      const response = await fetch(
        `${config.API_URL}/api/forum/bookmark/${itemId}/is-bookmarked?uid=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const responseJson = await response.json();
      setBookmarkButton(responseJson.isBookmarked);
    } catch (error) {
      console.error("Gagal mengambil bookmark:", error);
    } finally {
      setIsLoading(false);
    }
  }, [getAccessToken, getUser, itemId]);

  useEffect(() => {
    handleIsBookmarked();
  }, [handleIsBookmarked]);

  const handleBookmark = async (itemId: string) => {
    try {
      setIsLoading(true);
      const userData = await getUser();
      const userId = userData?.uid;

      if (!userId) return;

      const accessToken = await getAccessToken();
      await fetch(`${config.API_URL}/api/forum/bookmark/${itemId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: userId }),
      });
      setBookmarkButton(true);
      showToast("Anda telah memberi bookmark pada postingan ini");
    } catch (error) {
      console.error("Gagal memberi bookmark postingan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnbookmark = async (itemId: string) => {
    try {
      setIsLoading(true);
      const userData = await getUser();
      const userId = userData?.uid;

      if (!userId) return;

      const accessToken = await getAccessToken();
      await fetch(`${config.API_URL}/api/forum/unbookmark/${itemId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: userId }),
      });
      setBookmarkButton(false);
      showToast("Anda telah membatalkan bookmark pada postingan ini");
    } catch (error) {
      console.error("Gagal unbookmark postingan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    }
  };

  const onPressHandler = buttonBookmark ? handleUnbookmark : handleBookmark;

  return (
    <View className="pb-1">
      {isLoading ? (
        <ActivityIndicator size="small" color="#00726B" />
      ) : (
        <MaterialIcons
          onPress={() => onPressHandler(itemId)}
          name={buttonBookmark ? "bookmark" : "bookmark-border"}
          size={20}
          color="#00726B"
        />
      )}
    </View>
  );
};

export default ButtonBookmark;
