import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, ToastAndroid, Platform } from "react-native";
import { useAuth } from "@/context/authContext";
import { FontAwesome } from "@expo/vector-icons";

const ButtonLike: React.FC<{ itemId: string }> = ({ itemId }) => {
  const [buttonLike, setLikedButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { getAccessToken, getUser } = useAuth();

  useEffect(() => {
    handleIsLiked(itemId);
  }, [itemId]);

  const handleIsLiked = async (itemId: string) => {
    try {
      const user = await getUser();
      const userId = user?.uid;
      if (userId) {
        const accessToken = await getAccessToken();
        fetch(
          `${process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080"}/api/forum/like/${itemId}/is-liked?uid=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
          .then((response) => response.json())
          .then((responJson) => {
            const { isLiked } = responJson;
            setLikedButton(isLiked);
            setIsLoading(false);
          }).then;
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Gagal mengambil like:", error);
      setIsLoading(false);
    }
  };

  const handleLike = async (itemId: string) => {
    try {
      setIsLoading(true);
      const userData: any = await getUser();
      const userId = userData?.uid;
      if (userId) {
        const accessToken = await getAccessToken();
        const requestBody = {
          uid: userId,
        };
        fetch(`${process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080"}/api/forum/like/${itemId}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        })
          .then((response) => response.json())
          .then((responJson) => {
            setLikedButton(true);
            setIsLoading(false);
            showToast("Anda telah menyukai postingan ini 🎉");
          });
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Gagal menyukai postingan:", error);
      setIsLoading(false);
    }
  };

  const handleUnlike = async (itemId: string) => {
    try {
      setIsLoading(true);
      const userData: any = await getUser();
      const userId = userData?.uid;
      if (userId) {
        const accessToken = await getAccessToken();
        const requestBody = {
          uid: userId,
        };
        fetch(`${process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080"}/api/forum/unlike/${itemId}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        })
          .then((response) => response.json())
          .then((responJson) => {
            setLikedButton(false);
            setIsLoading(false);
            showToast("Anda telah membatalkan like pada postingan ini 😢");
          });
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Gagal unlike postingan:", error);
      setIsLoading(false);
    }
  };

  const onPressHandler = buttonLike ? handleUnlike : handleLike;
  const showToast = (message: string) => {
    if (Platform.OS === "android" || Platform.OS === "ios") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    }
  };

  return (
    <View className="pb-1">
      {isLoading ? (
        <ActivityIndicator size="small" color="#00726B" />
      ) : (
        <FontAwesome
          onPress={() => {
            onPressHandler(itemId);
          }}
          name={buttonLike ? "thumbs-up" : "thumbs-o-up"}
          size={20}
          color={buttonLike ? "#00726B" : "#00726B"}
          id={itemId}
        />
      )}
    </View>
  );
};

export default ButtonLike;
