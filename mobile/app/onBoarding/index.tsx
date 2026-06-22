import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const router = useRouter();

  return (
    <LinearGradient colors={["#38B68D", "#01736C"]} style={{ flex: 1 }}>
      <StatusBar style="light" />
      <View className="items-center flex-1">
        <View className="items-center w-full h-full">
          <Image
            source={require("../../assets/images/welcome/welcome-1.png")}
            className="w-[130] h-[130] absolute"
            style={{
              transform: [
                { translateX: -60 },
                { translateY: 100 },
                { rotate: "-14deg" },
              ],
            }}
          />
          <Image
            source={require("../../assets/images/welcome/welcome-2.png")}
            className="w-[80] h-[80] absolute"
            style={{
              transform: [{ translateX: 90 }, { translateY: 70 }],
            }}
          />
          <Image
            source={require("../../assets/images/welcome/welcome-3.png")}
            className="w-[110] h-[110] absolute"
            style={{
              transform: [
                { translateX: -140 },
                { translateY: 280 },
                { rotate: "18deg" },
              ],
            }}
          />
          <Image
            source={require("../../assets/images/welcome/welcome-4.png")}
            className="w-[180] h-[180] absolute"
            style={{
              transform: [
                { translateX: 110 },
                { translateY: 260 },
                { rotate: "-28deg" },
              ],
            }}
          />
        </View>

        <View className="absolute items-center justify-center p-4 bottom-28">
          <Text className="text-6xl py-3 leading-[45px] text-white font-poppinsSemiBold">
            Belajar Statistika Lebih Mudah Dengan RwikiStat
          </Text>
        </View>

        <View className="absolute bottom-0 w-full px-6 mb-20">
          <Pressable
            onPress={() => router.push("../auth")}
            className="w-full px-6 py-3 bg-white rounded-lg"
          >
            <Text className="text-[#00726B] font-poppinsSemiBold text-center text-xl">
              Belajar Sekarang
            </Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}
