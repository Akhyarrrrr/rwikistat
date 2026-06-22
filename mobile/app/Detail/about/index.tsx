import { router, Stack, Tabs } from "expo-router";
import React from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  StatusBar,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const about = () => {
  const scheme = useColorScheme();

  const handleBack = () => {
      router.replace("../../../main/Profile");
    };
    
  return (
    <>
      <Tabs>
        <Tabs.Screen
          name="about"
          options={{ tabBarStyle: { display: "none" } }}
        />
      </Tabs>
      <StatusBar
        barStyle={scheme === "dark" ? "dark-content" : "dark-content"}
        backgroundColor="#ffffff"
        translucent
      />
      <Stack.Screen
        options={{
          title: "Tentang RWikiStat",
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

      <SafeAreaView className="flex-1 bg-white">
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <View className="items-center">
            <View className="px-4 mb-6 border-2 rounded-md border-primary">
              <Image
                source={require("../../../assets/images/logo-horizontal.png")}
                style={{
                  width: 150,
                  height: 80,
                  marginBottom: 10,
                }}
                resizeMode="contain"
              />
            </View>

            <Text className="text-2xl text-gray-800 font-poppinsBold">
              RWikiStat
            </Text>
            <Text className="px-2 mt-2 text-lg text-justify text-gray-700 font-poppins">
              RWikiStat adalah aplikasi pembelajaran interaktif yang dirancang
              untuk membantu pengguna memahami konsep-konsep statistika dengan
              mudah dan menyenangkan. Aplikasi ini menyediakan berbagai modul
              pembelajaran, Kompiler R, dan fitur diskusi untuk meningkatkan
              pengalaman belajar.
            </Text>

            <Text className="mt-8 text-xl font-semibold text-gray-800 font-poppinsSemiBold">
              Fitur Utama:
            </Text>
            <View className="w-full px-2 mt-2">
              <View className="flex-row items-center mt-1">
                <MaterialIcons name="check-circle" size={20} color="#00726B" />
                <Text className="px-4 text-gray-600 font-poppins text-medium ">
                  Pembelajaran interaktif dan menarik
                </Text>
              </View>
              <View className="flex-row items-center mt-2">
                <MaterialIcons name="check-circle" size={20} color="#00726B" />
                <Text className="px-4 text-gray-600 font-poppins text-medium">
                  Modul R dan Kompiler untuk menjalankan kode R
                </Text>
              </View>
              <View className="flex-row items-center mt-2">
                <MaterialIcons name="check-circle" size={20} color="#00726B" />
                <Text className="px-4 text-gray-600 font-poppins text-medium">
                  Forum diskusi untuk bertanya dan berbagi pengalaman
                </Text>
              </View>
              <View className="flex-row items-center mt-2">
                <MaterialIcons name="check-circle" size={20} color="#00726B" />
                <Text className="px-4 text-gray-600 font-poppins text-medium">
                  Tampilan yang responsif di berbagai perangkat
                </Text>
              </View>
            </View>
          </View>
          <View className="pt-4 mt-10 border-t border-gray-200">
            <Text className="text-base text-center text-gray-600 font-poppinsItalic">
              Copyright &copy; 2024 RWikiStat. All rights reserved.
            </Text>
            <Text className="mt-1 text-sm text-center text-gray-500 font-poppins">
              Dikembangkan oleh Tim RWikiStat. Semua hak dilindungi.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default about;
