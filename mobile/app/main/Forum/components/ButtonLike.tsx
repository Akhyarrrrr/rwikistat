import React, { useCallback, useEffect, useState } from "react";
import { View, ActivityIndicator, ToastAndroid, Platform } from "react-native";
import { useAuth } from "@/context/authContext";
import { FontAwesome } from "@expo/vector-icons";
import config from "@/config";

const ButtonLike: React.FC<{ itemId: string }> = ({ itemId }) => {
  const [buttonLike, setLikedButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { getAccessToken, getUser } = useAuth();

  const handleIsLiked = useCallback(async () => {
    try {
      const user = await getUser();
      const userId = user?.uid;

      if (!userId) {
        setIsLoading(false);
        return;
      }

      const accessToken = await getAccessToken();
      const response = await fetch(
        `${config.API_URL}/api/forum/like/${itemId}/is-liked?uid=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const responseJson = await response.json();
      setLikedButton(responseJson.isLiked);
    } catch (error) {
      console.error("Gagal mengambil like:", error);
    } finally {
      setIsLoading(false);
    }
  }, [getAccessToken, getUser, itemId]);

  useEffect(() => {
    handleIsLiked();
  }, [handleIsLiked]);

  const handleLike = async (itemId: string) => {
    try {
      setIsLoading(true);
      const userData = await getUser();
      const userId = userData?.uid;

      if (!userId) return;

      const accessToken = await getAccessToken();
      await fetch(`${config.API_URL}/api/forum/like/${itemId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: userId }),
      });
      setLikedButton(true);
      showToast("Anda telah menyukai postingan ini");
    } catch (error) {
      console.error("Gagal menyukai postingan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlike = async (itemId: string) => {
    try {
      setIsLoading(true);
      const userData = await getUser();
      const userId = userData?.uid;

      if (!userId) return;

      const accessToken = await getAccessToken();
      await fetch(`${config.API_URL}/api/forum/unlike/${itemId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: userId }),
      });
      setLikedButton(false);
      showToast("Anda telah membatalkan like pada postingan ini");
    } catch (error) {
      console.error("Gagal unlike postingan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    }
  };

  const onPressHandler = buttonLike ? handleUnlike : handleLike;

  return (
    <View className="pb-1">
      {isLoading ? (
        <ActivityIndicator size="small" color="#00726B" />
      ) : (
        <FontAwesome
          onPress={() => onPressHandler(itemId)}
          name={buttonLike ? "thumbs-up" : "thumbs-o-up"}
          size={20}
          color="#00726B"
        />
      )}
    </View>
  );
};

export default ButtonLike;
