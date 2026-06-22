import React, { useEffect, useState } from "react";
import {
  ScrollView,
  TextInput,
  Text,
  TouchableOpacity,
  View,
  Image,
  Animated,
  StatusBar,
  useColorScheme,
} from "react-native";
import { router, Stack } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/authContext";
import ImageResizer from "react-native-image-resizer";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ImagePickerResult {
  canceled: boolean;
  assets: Array<{ uri: string }> | null;
}

const AskForum = () => {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const { accessToken, getUser } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const slideAnim = useState(new Animated.Value(0))[0];
  const scheme = useColorScheme();

  useEffect(() => {
    const fetchUserData = async () => {
      const dataUser = await getUser();
      const storedUser = await AsyncStorage.getItem("user");

      if (!dataUser?.uid) {
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } else setUser(dataUser);
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (successMessage) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(() => setSuccessMessage(""));
        }, 2000);
      });
    }
  }, [successMessage]);

  const resizeImage = async (uri: string) => {
    try {
      const resizedImage = await ImageResizer.createResizedImage(
        uri,
        1024, // width
        1024, // height
        "JPEG", // format
        80 // quality
      );
      return resizedImage.uri;
    } catch (error) {
      console.error("Error resizing image:", error);
      return uri; // Return original if resizing fails
    }
  };

  const pickImage = async () => {
    let result: ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      if (result.assets) {
        const selectedUri = result.assets[0].uri;

        // Check if the format is supported
        const allowedFormats = [
          "jpeg",
          "jpg",
          "png",
          "heic",
          "heif",
          "webp",
          "gif",
          "bmp",
          "tiff",
          "tif",
          "svg",
          "raw",
          "cr2",
          "nef",
          "pdf",
        ];
        const fileExtension = selectedUri.split(".").pop()?.toLowerCase();

        if (allowedFormats.includes(fileExtension || "")) {
          setImage(selectedUri);
          setImages([...images, selectedUri]);
        } else {
          setSuccessMessage("Format file tidak didukung.");
        }
      }
    }
  };

  const submitQuestion = async () => {
    if (!topic || !description) {
      setSuccessMessage("Topik dan deskripsi wajib diisi.");
      return;
    }

    try {
      const formData: any = new FormData();
      formData.append("topics", description);
      formData.append("title", topic);
      formData.append("uid", user?.uid);
      images.forEach((imgUri, index) => {
        formData.append(`images`, {
          uri: imgUri,
          name: `image${index + 1}.jpg`,
          type: "image/jpeg",
        });
      });

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080"}/api/forum/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        setSuccessMessage("Pertanyaan telah dikirim.");
        setTopic("");
        setDescription("");
        setImages([]);
        setImage(null);
      } else {
        setSuccessMessage("Terjadi kesalahan saat mengirim pertanyaan.");
      }
    } catch (error) {
      console.error("Error submitting question:", error);
      setSuccessMessage("Terjadi kesalahan saat mengirim pertanyaan.");
    }
  };

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
      <Stack.Screen
        options={{
          title: "Tanyakan Sesuatu",
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
      <ScrollView className="flex-1 p-4 bg-white">
        <Text className="mb-1 text-base text-black font-poppinsSemiBold">
          Judul Topik
        </Text>

        <TextInput
          className="p-2 mb-4 border border-gray-300 rounded-md font-poppins"
          placeholder="Berikan informasi yang spesifik..."
          placeholderTextColor={"#9e9e9e"}
          value={topic}
          onChangeText={setTopic}
          style={{ textAlignVertical: "center" }}
        />

        <Text className="text-base text-black font-poppinsSemiBold">
          Deskripsi Penjelasan
        </Text>
        <TextInput
          className="p-2 mb-4 border border-gray-300 rounded-md font-poppins"
          placeholder="Jelaskan masalah anda sesuai dengan judul..."
          placeholderTextColor={"#9e9e9e"}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
          style={{ textAlignVertical: "top" }}
        />

        <TouchableOpacity
          className="flex flex-row items-center justify-center p-4 mb-6 border border-gray-300 rounded-md bg-softgray font-poppins"
          onPress={pickImage}
        >
          <Ionicons name="image-outline" size={24} color="#00726B" />
          <Text className="ml-2 text-primary font-poppinsSemiBold">
            Tambahkan Foto Dari Galeri
          </Text>
        </TouchableOpacity>

        {image && (
          <View style={{ width: "100%", aspectRatio: 1, position: "relative" }}>
            <Image
              source={{ uri: image }}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 5,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
              }}
              resizeMode="contain"
            />

            <TouchableOpacity
              onPress={() => {
                setImage(null);
                setImages(images.filter((imgUri) => imgUri !== image));
              }}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                backgroundColor: "#00726B",
                borderRadius: 5,
                borderColor: "#00726B",
                padding: 5,
              }}
            >
              <Ionicons name="close" size={30} color="white" />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          className="bg-[#00726B] rounded-md p-4 items-center mt-2"
          onPress={submitQuestion}
        >
          <Text className="text-white font-poppinsSemiBold">Tanyakan</Text>
        </TouchableOpacity>
      </ScrollView>

      {successMessage && (
        <Animated.View
          style={{
            position: "absolute",
            bottom: 40,
            alignSelf: "center",
            paddingVertical: 10,
            paddingHorizontal: 20,
            backgroundColor: "#00726B",
            borderRadius: 5,
            opacity: slideAnim,
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          }}
        >
          <Text
            style={{
              color: "white",
              fontFamily: "poppinsSemiBold",
              textAlign: "center",
            }}
          >
            {successMessage}
          </Text>
        </Animated.View>
      )}
    </>
  );
};

export default AskForum;
