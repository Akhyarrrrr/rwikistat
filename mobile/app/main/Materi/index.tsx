import React, { useEffect, useCallback, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  TextInput,
  Image,
  useColorScheme,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import { useAuth } from "@/context/authContext";
import { FontAwesome } from "@expo/vector-icons";

const logo = require("../../../assets/images/icon.png");
const notfound = require("../../../assets/images/notfound.png");

const Home = () => {
  const router = useRouter();
  const { getAccessToken } = useAuth();
  const [modules, setModules] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const scheme = useColorScheme();

  const fetchMateri = async () => {
    const accessToken = await getAccessToken();
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080"}/api/modul`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();

      const sortedModules = data.sort((a: any, b: any) => {
        const numA = parseInt(a.data.namaModul.replace(/\D/g, ""), 10);
        const numB = parseInt(b.data.namaModul.replace(/\D/g, ""), 10);
        return numA - numB;
      });

      setModules(sortedModules);
      setFilteredModules(sortedModules);
    } catch (error: any) {
      console.error("Error modul:", error.message);
    }
  };

  useEffect(() => {
    fetchMateri();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchMateri();
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const filtered = modules.filter(
      (mod: any) =>
        mod.data.namaModul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mod.data.judulModul.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredModules(filtered);
  }, [searchQuery, modules]);

  return (
    <>
      <StatusBar
        barStyle={scheme === "dark" ? "dark-content" : "dark-content"}
        backgroundColor="#ffffff"
        translucent
      />
      <Stack.Screen
        options={{
          title: "Belajar Statistika",
          headerStyle: { backgroundColor: "#ffffff" },
          headerTintColor: "#00726B",
          headerTitleStyle: { fontFamily: "poppinsSemiBold", fontSize: 20 },
        }}
      />

      <View className="flex-1 bg-gray-100">
        <View className="px-5 pt-4 pb-2 bg-white">
          <View className="flex-row items-center px-4 py-2 bg-gray-100 border rounded border-primary">
            <Image source={logo} className="w-8 h-8 rounded-full" />
            <TextInput
              placeholder="Cari Modul..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
              className="flex-1 ml-4 text-black font-poppins"
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <FontAwesome name="times" size={20} color="#00726B" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        <ScrollView
          className="flex-1 px-5 py-1"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#38B68D"]}
              tintColor="#38B68D"
            />
          }
        >
          {filteredModules.map((module: any) => (
            <TouchableOpacity
              key={module.id}
              className="m-3 mb-6 overflow-hidden rounded-xl"
              onPress={() => {
                router.push(`/Detail/${module.id}`);
              }}
            >
              <LinearGradient colors={["#38B68D", "#01736C"]}>
                <View className="flex flex-col items-start justify-end h-40 pb-6 mx-5">
                  <Text className="text-2xl mt-8 text-[#fff] font-poppinsBold">
                    {module.data.namaModul}
                  </Text>
                  <Text className="font-normal text-lg text-[#fff] font-poppins">
                    {module.data.judulModul}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

export default Home;
