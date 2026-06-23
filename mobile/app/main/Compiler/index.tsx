import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  useColorScheme,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { Stack } from "expo-router";
import { useAuth } from "@/context/authContext";
import { WebView } from "react-native-webview";
import { useTabVisibility } from "../_layout";
import { Dropdown } from "react-native-element-dropdown";
import config from "@/config";

const Compiler = () => {
  const [code, setCode] = useState("");
  const [lines, setLines] = useState([""]);
  const [output, setOutput] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCopyModalVisible, setIsCopyModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [outputType, setOutputType] = useState<string | null>(null);
  const { getAccessToken } = useAuth();
  const [shinyUrl, setShinyUrl] = useState("");
  const { setIsInputFocused } = useTabVisibility();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const scheme = useColorScheme();
  const [isDropdownAlertVisible, setIsDropdownAlertVisible] = useState(false);

  const outputOptions = [
    { label: "String", value: "string" },
    { label: "Graph", value: "graph" },
  ];

  const handleRunString = async () => {
    try {
      setLoading(true);
      const accessToken = await getAccessToken();
      const response = await fetch(
        `${config.API_URL}/api/compiler/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            code,
            outputType,
          }),
        }
      );

      const data = await response.text();

      if (response.ok) {
        setOutput(data);
        setIsModalVisible(true);
      } else {
        setOutput(`Error: ${data}`);
        setIsModalVisible(true);
      }
    } catch (error) {
      console.error("Error executing R code:", error);
      setOutput("Error: Failed to execute R code. Please try again.");
      setIsModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRunGraph = async () => {
    try {
      setLoading(true);
      const accessToken = await getAccessToken();
      const response = await fetch(
        `${config.API_URL}/api/compiler/newshiny-web`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            code,
          }),
        }
      );

      const responseData = await response.text();
      if (response.ok) {
        try {
          const data = JSON.parse(responseData);
          if (data.success) {
            if (data.link) {
              setShinyUrl(data.link);
              setIsModalVisible(true);
            } else {
              setOutput("Error: Shiny URL not found in server response.");
              setIsModalVisible(true);
            }
          } else {
            setOutput(`Error: ${data.error || "Failed to start Shiny app"}`);
            setIsModalVisible(true);
          }
        } catch {
          setOutput("Error: Failed to parse JSON response.");
          setIsModalVisible(true);
        }
      } else {
        setOutput(`Error: ${responseData || "Failed to start Shiny app"}`);
        setIsModalVisible(true);
      }
    } catch (error) {
      console.error("Error executing R code for Shiny:", error);
      setOutput("Error: Failed to execute Shiny app. Please try again.");
      setIsModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (text: string) => {
    setCode(text);
    setLines(text.split("\n"));
  };

  const refreshPage = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const resetCode = () => {
    setCode("");
    setLines([""]);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setOutput("");
  };

  const copyToClipboard = async () => {
    try {
      const cleanedOutput = output
        .split("\n")
        .map((line) => line.replace(/^\[\d+\]\s*/, ""))
        .join("\n");

      await Clipboard.setStringAsync(cleanedOutput);
      setIsCopyModalVisible(true);
      setTimeout(() => {
        setIsCopyModalVisible(false);
      }, 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      Alert.alert("Error", "Failed to copy output to clipboard");
    }
  };

  const showDropdownAlert = () => {
    setIsDropdownAlertVisible(true);
  };

  const closeDropdownAlert = () => {
    setIsDropdownAlertVisible(false);
  };

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

  return (
    <>
      {!isKeyboardVisible && (
        <Stack.Screen
          options={{
            title: "Compiler R",
            headerStyle: { backgroundColor: "#ffffff" },
            headerTintColor: "#00726B",
            headerTitleStyle: { fontFamily: "poppinsSemiBold", fontSize: 20 },
          }}
        />
      )}
      <StatusBar
        barStyle={scheme === "dark" ? "dark-content" : "dark-content"}
        backgroundColor="#ffffff"
        translucent
      />
      <View className="flex-1">
        {refreshing && (
          <View className="flex-1 justify-center items-center bg-[#f5f5f5]">
            <ActivityIndicator size="large" color="#00726B" />
            <Text className="mt-4 text-gray-600 font-poppins">
              Memuat Compiler R...
            </Text>
          </View>
        )}

        {!refreshing && (
          <>
            <View className="flex-row justify-between p-6 bg-gray-800">
              <TouchableOpacity
                className="flex-row items-center px-4 py-2 bg-white border rounded border-primary"
                onPress={resetCode}
              >
                <MaterialIcons name="delete" size={20} color="#00726B" />
                <Text className="m-1 ml-2 text-primary font-poppins">
                  Hapus
                </Text>
              </TouchableOpacity>

              <View className="flex-row ml-2 space-x-2">
                <Dropdown
                  data={outputOptions}
                  labelField="label"
                  valueField="value"
                  value={outputType}
                  onChange={(item) => setOutputType(item.value)}
                  placeholder="Pilih Tipe"
                  style={{
                    backgroundColor: "white",
                    borderColor: "#00726B",
                    borderWidth: 1,
                    borderRadius: 5,
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                    width: 110,
                  }}
                  placeholderStyle={{
                    color: "#00726B",
                    fontFamily: "poppins",
                    fontSize: 14,
                    textAlign: "center",
                  }}
                  selectedTextStyle={{
                    color: "#00726B",
                    fontFamily: "poppins",
                    fontSize: 14,
                    textAlign: "center",
                  }}
                  containerStyle={{
                    borderRadius: 4,
                    borderColor: "#00726B",
                    borderWidth: 1,
                    width: 110,
                  }}
                  itemTextStyle={{
                    color: "#00726B",
                    fontFamily: "poppins",
                    fontSize: 14,
                    textAlign: "center",
                  }}
                  itemContainerStyle={{
                    borderBottomWidth: 1,
                    borderBottomColor: "#00726B",
                    height: 60,
                  }}
                />

                <TouchableOpacity
                  className="flex-row items-center px-4 py-2 ml-2 rounded bg-primary"
                  onPress={() => {
                    if (!outputType) {
                      showDropdownAlert();
                    } else if (outputType === "graph") {
                      handleRunGraph();
                    } else {
                      handleRunString();
                    }
                  }}
                  disabled={loading || !code.trim()}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <MaterialIcons name="play-circle" size={20} color="white" />
                  )}
                  <Text className="ml-2 text-white font-poppins">
                    {loading ? "Menjalankan..." : "Jalankan"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.select({
                ios: 80,
                android: 100,
              })}
            >
              <ScrollView
                className="flex-1 mt-4"
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={refreshPage}
                    colors={["#38B68D"]}
                    tintColor="#38B68D"
                  />
                }
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
                keyboardShouldPersistTaps="handled"
              >
                <View className="flex-row">
                  <View className="items-end w-10 pr-2">
                    {lines.map((_, index) => (
                      <Text
                        key={index}
                        className="text-base leading-6 text-primary font-poppins"
                      >
                        {index + 1}.
                      </Text>
                    ))}
                  </View>
                  <TextInput
                    className="flex-1 p-0 pr-2 text-base leading-6 text-gray-300 font-poppins"
                    multiline
                    value={code}
                    onChangeText={handleCodeChange}
                    placeholder="Silahkan masukkan Kode R..."
                    placeholderTextColor="#888"
                    style={{ flexGrow: 1 }}
                  />
                </View>
              </ScrollView>
            </KeyboardAvoidingView>

            {/* Modal output */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={isModalVisible}
              onRequestClose={closeModal}
            >
              <View className="items-center justify-center flex-1 bg-black/70">
                <View className="w-5/6 p-5 bg-white rounded-lg h-5/6">
                  <View className="flex-row items-center justify-center mb-4">
                    <Text className="text-xl font-poppinsSemiBold text-primary">
                      Output ({outputType})
                    </Text>
                  </View>

                  {outputType === "graph" && shinyUrl ? (
                    <WebView
                      className="bg-gray"
                      source={{ uri: shinyUrl }}
                      style={{ flex: 1 }}
                    />
                  ) : (
                    <ScrollView className="flex-1 p-4 rounded-lg">
                      <Text className="text-black font-poppins">{output}</Text>
                    </ScrollView>
                  )}

                  <View className="flex-row justify-center mt-6">
                    {outputType === "string" && (
                      <TouchableOpacity
                        onPress={copyToClipboard}
                        className="flex-row items-center justify-center px-4 py-2 mr-2 bg-white border rounded border-primary"
                      >
                        <MaterialIcons
                          name="content-copy"
                          size={20}
                          color="#00726B"
                        />
                        <Text className="ml-2 text-primary font-poppins">
                          Salin
                        </Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      onPress={closeModal}
                      className="flex-row items-center justify-center px-4 py-2 ml-2 rounded bg-primary"
                    >
                      <MaterialIcons
                        name="check-circle"
                        size={20}
                        color="white"
                      />
                      <Text className="ml-2 text-white font-poppins">
                        Selesai
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* Modal Copy Alert */}
            <Modal
              animationType="fade"
              transparent={true}
              visible={isCopyModalVisible}
              onRequestClose={() => setIsCopyModalVisible(false)}
            >
              <View className="items-center justify-center flex-1 bg-black/50">
                <View className="p-4 bg-white rounded-lg">
                  <Text className="text-primary font-poppins">
                    Output telah disalin!
                  </Text>
                </View>
              </View>
            </Modal>

            <Modal
              animationType="slide"
              transparent={true}
              visible={isDropdownAlertVisible}
              onRequestClose={closeDropdownAlert}
            >
              <View className="items-center justify-center flex-1 bg-black/60">
                <View className="w-5/6 p-5 bg-white rounded-lg">
                  <Text className="text-lg text-center text-primary font-poppinsSemiBold">
                    Pilih tipe Compiler terlebih dahulu!
                  </Text>
                  <TouchableOpacity
                    onPress={closeDropdownAlert}
                    className="flex-row items-center justify-center px-4 py-2 mt-4 rounded bg-primary"
                  >
                    <MaterialIcons
                      name="check-circle"
                      size={20}
                      color="white"
                    />
                    <Text className="ml-2 text-white font-poppins">OK</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </>
        )}
      </View>
    </>
  );
};

export default Compiler;
