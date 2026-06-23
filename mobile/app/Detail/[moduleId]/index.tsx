import { useLocalSearchParams, Stack } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Image,
  StatusBar,
  useColorScheme,
  Alert,
  ToastAndroid,
  Platform,
  Linking,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { FloatingAction } from "react-native-floating-action";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import Markdown from "react-native-markdown-display";
import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";
import config from "@/config";
import * as Clipboard from "expo-clipboard";

const notfound = require("../../../assets/images/notfound.png");

const Module = () => {
  const { getAccessToken } = useAuth();
  const { moduleId } = useLocalSearchParams();
  const [modules, setModules] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [rawText, setRawText] = useState("");
  const [filteredText, setFilteredText] = useState("");
  const router = useRouter();
  const scheme = useColorScheme();

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);

    if (Platform.OS === "android") {
      ToastAndroid.show("Teks berhasil disalin!", ToastAndroid.SHORT);
    } else {
      Alert.alert("Berhasil", "Teks berhasil disalin!");
    }
  };

  const fetchModule = useCallback(async () => {
    const accessToken = await getAccessToken();
    try {
      const response = await fetch(`${config.API_URL}/api/modul/${moduleId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setModules(data);
      setRawText(data.data.textData);
      setFilteredText(data.data.textData);
      if (data) {
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Error modul:", error.message);
    }
  }, [getAccessToken, moduleId]);

  useEffect(() => {
    fetchModule();
  }, [fetchModule]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredText(rawText);
    } else {
      const lines = rawText
        .split("\n")
        .filter((line) =>
          line.toLowerCase().includes(searchQuery.toLowerCase())
        );
      setFilteredText(lines.join("\n\n"));
    }
  }, [searchQuery, rawText]);

  const handleBack = () => {
    router.replace("../../main/Materi");
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f5f5f5]">
        <ActivityIndicator size="large" color="#00726B" />
        <Text className="mt-4 text-gray-600 font-poppins">Memuat Modul...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar
        barStyle={scheme === "dark" ? "dark-content" : "dark-content"}
        backgroundColor="#ffffff"
        translucent
      />
      <Stack.Screen
        options={{
          title: modules?.data?.judulModul || "Module",
          headerStyle: { backgroundColor: "#00726B" },
          headerTintColor: "#ffffff",
          headerTitleStyle: { fontFamily: "poppinsSemiBold", fontSize: 18 },
          headerBackTitle: "Materi",
          headerLeft: () => (
            <TouchableOpacity onPress={handleBack} className="mr-8">
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <MaterialCommunityIcons
              name="download"
              size={24}
              color="#ffffff"
              onPress={() => {
                const pdfUrl = modules?.data?.pdfPath;
                if (pdfUrl) {
                  Linking.openURL(pdfUrl);
                } else {
                  Alert.alert("Error", "Link PDF tidak tersedia");
                }
              }}
              style={{ marginRight: 15 }}
            />
          ),
        }}
      />

      <SafeAreaView className="flex-1 bg-[#F7F7F7]">
        {modules ? (
          <>
            <ScrollView className="flex-1 p-4 mb-6">
              <View className="flex-row items-center px-4 py-2 mx-3 mb-4 bg-gray-100 border rounded border-primary">
                <TextInput
                  placeholder="Cari dalam modul..."
                  placeholderTextColor="#9CA3AF"
                  value={searchQuery}
                  onChangeText={(text) => setSearchQuery(text)}
                  className="flex-1 text-black font-poppins"
                />
                {searchQuery ? (
                  <TouchableOpacity onPress={() => setSearchQuery("")}>
                    <FontAwesome name="times" size={20} color="#00726B" />
                  </TouchableOpacity>
                ) : null}
              </View>

              <Markdown
                style={{
                  body: {
                    color: "#333",
                    fontSize: 16,
                    lineHeight: 28,
                    paddingHorizontal: 10,
                    textAlign: "justify",
                  },
                  paragraph: {
                    color: "#333",
                    fontSize: 16,
                    lineHeight: 28,
                    textAlign: "justify",
                  },
                  list_item: {
                    fontSize: 16,
                    marginVertical: 4,
                    color: "#333",
                    textAlign: "justify",
                  },
                  heading1: {
                    fontSize: 26,
                    fontWeight: "bold",
                    color: "#005F56",
                    paddingVertical: 8,
                    borderBottomWidth: 1,
                    borderColor: "#00726B",
                  },
                  heading2: {
                    fontSize: 22,
                    fontWeight: "bold",
                    color: "#00726B",
                    paddingVertical: 6,
                  },
                  link: { color: "#00726B", textDecorationLine: "underline" },
                  code: {
                    backgroundColor: "#EFEFEF",
                    padding: 12,
                    borderRadius: 8,
                    fontSize: 14,
                    color: "#D63384",
                    textAlign: "left",
                  },
                }}
                rules={{
                  code_block: (node, children) => (
                    <TouchableOpacity
                      onLongPress={() => {
                        copyToClipboard(node.content);
                      }}
                      style={{
                        backgroundColor: "#EFEFEF",
                        padding: 12,
                        borderRadius: 8,
                        marginBottom: 10,
                      }}
                    >
                      <Text
                        style={{
                          color: "#D63384",
                          fontFamily: "monospace",
                          fontSize: 14,
                        }}
                      >
                        {node.content}
                      </Text>
                    </TouchableOpacity>
                  ),
                }}
              >
                {filteredText}
              </Markdown>
            </ScrollView>

            {modules.data.codeSampel && (
              <FloatingAction
                onPressMain={() => {
                  router.push({
                    pathname: "/Detail/compilerModul",
                    params: { codeSample: modules.data.codeSampel },
                  });
                }}
                key={modules.data.id}
                color="#00726B"
                floatingIcon={
                  <MaterialCommunityIcons
                    name="code-tags"
                    size={26}
                    color="#fff"
                  />
                }
                overlayColor="rgba(0, 0, 0, 0.1)"
              />
            )}
          </>
        ) : (
          <View className="items-center justify-center flex-1 mt-10">
            <Image
              source={notfound}
              className="object-contain w-full"
              resizeMode="contain"
            />
            <Text className="text-black font-poppins">No data available</Text>
          </View>
        )}
      </SafeAreaView>
    </>
  );
};

export default Module;
