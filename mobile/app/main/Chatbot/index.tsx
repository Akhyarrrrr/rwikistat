import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  Keyboard,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from "react-native";
import { Stack } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useTabVisibility } from "../_layout";
import Modal from "react-native-modal";
import { useAuth } from "@/context/authContext";
import config from "@/config";

const Chatbot: React.FC = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    {
      sender: string;
      text: string;
    }[]
  >([{ sender: "bot", text: "Halo, ada yang bisa saya bantu?" }]);
  const [loadingChat, setLoadingChat] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const logo = require("../../../assets/images/icon.png");
  const { setIsInputFocused } = useTabVisibility();
  const inputRef = useRef<TextInput>(null);
  const scheme = useColorScheme();
  const [isModalVisible, setModalVisible] = useState(false);
  const { getAccessToken, getUser } = useAuth();

  useEffect(() => {
    inputRef.current?.focus();
    setIsInputFocused(true);

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsInputFocused(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsInputFocused(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [setIsInputFocused]);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [chatHistory, loadingChat]);

  const fetchBotResponse = async (userMessage: string) => {
    setLoadingChat(true);
    try {
      const token = await getAccessToken();
      const user = await getUser();
      const response = await fetch(
        `${config.API_URL}/api/chatbot/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user?.uid || "mobile",
            userMessage,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      let botResponse = data.response || "Maaf, respons chatbot kosong.";

      // 1. Hapus tanda kutip awal/akhir jika ada
      if (botResponse.startsWith('"') && botResponse.endsWith('"')) {
        botResponse = botResponse.slice(1, -1);
      }

      // 2. Unescape karakter seperti \" dan \n
      botResponse = botResponse.replace(/\\"/g, '"').replace(/\\n/g, "\n");

      // 3. Bersihkan **** jadi ** (maksimal 2 bintang untuk bold)
      botResponse = botResponse.replace(/\*{3,}/g, "**");

      // 4. Bersihkan markdown miring tidak lengkap (*teks)
      botResponse = botResponse.replace(/(^|\s)\*(\S.*?)($|\s)/g, "$1$2$3");

      // 5. Tambahkan ** pada bullet list jika belum ada
      botResponse = botResponse.replace(
        /(\*\s*)(?!\*\*)(.+?)(?=\n|$)/g,
        (_: any, bullet: any, text: string) => {
          return `${bullet}**${text.trim()}**`;
        }
      );

      // 6. Trim whitespace di awal/akhir
      botResponse = botResponse.trim();

      setChatHistory((prev) => [...prev, { sender: "bot", text: botResponse }]);
    } catch (error) {
      console.error("Error fetching bot response:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Maaf, terjadi kesalahan. Silakan coba lagi nanti.",
        },
      ]);
      Alert.alert(
        "Error",
        "Terjadi kesalahan saat menghubungi chatbot."
      );
    }
    setLoadingChat(false);
  };

  const sendMessage = () => {
    if (message.trim()) {
      setChatHistory((prev) => [...prev, { sender: "user", text: message }]);
      const userMessage = message;
      setMessage("");
      fetchBotResponse(userMessage);
    }
  };

  const clearChat = () => {
    setChatHistory([
      { sender: "bot", text: "Halo, ada yang bisa saya bantu?" },
    ]);
  };

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    setModalVisible(true);
    setTimeout(() => setModalVisible(false), 2000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 95 : 100}
    >
      <StatusBar
        barStyle={scheme === "dark" ? "dark-content" : "dark-content"}
        backgroundColor="#ffffff"
        translucent
      />
      <Stack.Screen
        options={{
          title: "Chatbot",
          headerStyle: { backgroundColor: "#ffffff" },
          headerTintColor: "#00726B",
          headerTitleStyle: { fontFamily: "poppinsSemiBold", fontSize: 20 },
        }}
      />
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        className="bg-softgray"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 p-2">
          {chatHistory.map((chat, index) => (
            <View
              key={index}
              className={`flex-row items-start my-1 mx-2 ${
                chat.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {chat.sender === "bot" && (
                <View className="p-1 mr-2 border rounded-md border-primary">
                  <Image source={logo} className="w-8 h-8 " />
                </View>
              )}
              <View
                className={`max-w-[70%] p-2 rounded-lg ${
                  chat.sender === "user" ? "bg-white" : "bg-primary"
                }`}
              >
                <Text
                  className={
                    chat.sender === "user"
                      ? "text-green-500 font-poppins"
                      : "text-white font-poppins"
                  }
                >
                  {chat.text}
                </Text>
                {chat.sender === "bot" && (
                  <View className="flex-row mt-2">
                    <TouchableOpacity
                      onPress={() => copyToClipboard(chat.text)}
                      className="mr-2"
                    >
                      <MaterialIcons
                        name="content-copy"
                        size={20}
                        color="#fff"
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ))}
          {loadingChat && (
            <View className="flex-row items-start justify-start mx-2 my-2">
              <View className="p-1 mr-2 border rounded-md border-primary">
                <Image source={logo} className="w-8 h-8 " />
              </View>
              <View className="flex-row items-center rounded-lg p-2 bg-primary max-w-[70%]">
                <ActivityIndicator size="small" color="#fff" />
                <Text className="ml-2 text-white font-poppins">
                  Sedang memproses
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View className="flex-row items-center p-2 bg-white">
        <TextInput
          ref={inputRef}
          className="flex-1 p-3 border rounded-lg border-primary font-poppins"
          placeholder="Silahkan bertanya..."
          placeholderTextColor="#A4A4A4"
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={sendMessage}
          autoFocus={true}
          multiline
        />
        <TouchableOpacity
          onPress={sendMessage}
          className="items-center justify-center p-2 ml-2 rounded-md bg-primary"
        >
          <MaterialIcons name="send" size={25} color="#fff" />
        </TouchableOpacity>
        {chatHistory.length > 1 && (
          <TouchableOpacity
            onPress={clearChat}
            className="items-center justify-center p-2 ml-2 rounded-md bg-primary"
          >
            <Text className="py-1 text-white font-poppins">Hapus Chat</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
      >
        <View className="items-center p-6 bg-white rounded-lg">
          <MaterialIcons name="check-circle" size={48} color="#00726B" />
          <Text className="text-center text-gray-600 font-poppins">
            Teks berhasil disalin!
          </Text>
          <TouchableOpacity
            className="px-4 py-2 mt-4 rounded-md bg-primary"
            onPress={() => setModalVisible(false)}
          >
            <Text className="text-white font-poppinsSemiBold">OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default Chatbot;
