import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useAuth } from "@/context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "@/config";

const Profile = () => {
  const { logout, getUser, getAccessToken } = useAuth();
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const storedUser = await AsyncStorage.getItem("user");

      const userData: any = await getUser();
      if (!userData) {
        throw new Error("User data is null");
      }

      const accessToken = await getAccessToken();
      if (!accessToken) {
        throw new Error("Access token is missing");
      }

      const response = await fetch(
        `${config.API_URL}/api/user/${userData.uid}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.status}`);
      }

      const data = await response.json();

      if (!data.email) {
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } else setUser(data);

      setScore(data.score);
    } finally {
      setLoading(false);
    }
  }, [getUser, getAccessToken]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleLogout = async (e: any) => {
    e.preventDefault();
    try {
      await logout();
    } catch (error: any) {
      console.error("Error logout:", error.message);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUser().then(() => setRefreshing(false));
  }, [fetchUser]);

  const getStarCount = () => {
    if (score >= 0 && score <= 1) return 0;
    if (score > 1 && score <= 50) return 1;
    if (score > 50 && score <= 100) return 2;
    if (score > 100 && score <= 150) return 3;
    if (score > 150 && score <= 200) return 4;
    return 5;
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f5f5f5]">
        <ActivityIndicator size="large" color="#00726B" />
        <Text className="mt-4 text-gray-600 font-poppins">
          Loading Profile...
        </Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Pengaturan Akun",
          headerStyle: { backgroundColor: "#ffffff" },
          headerTintColor: "#00726B",
          headerTitleStyle: { fontFamily: "poppinsSemiBold", fontSize: 20 },
        }}
      />
      <ScrollView
        className="flex-1 bg-softgrey"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#38B68D"]}
            tintColor="#38B68D"
          />
        }
      >
        <View className="flex-row items-center px-4 py-6">
          <View className="ml-4 mr-6 border-2 rounded-md border-primary">
            <Image src={user.photoURL} className="w-20 h-20" />
          </View>
          <View>
            <View className="flex flex-row items-center">
              <Text className="text-2xl text-black font-poppinsBold">
                {user?.displayName}
              </Text>
              {user?.verified && (
                <View className="flex items-center justify-center pl-1">
                  <MaterialIcons name="verified" size={20} color={"#00726B"} />
                </View>
              )}
            </View>
            <Text className="text-black text-md font-poppins">
              {user?.email}
            </Text>
            <Text className="text-sm ">{"⭐".repeat(getStarCount())}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push("../../Detail/post")}
          className="flex-row items-center justify-between px-4 pt-6 pb-3 mx-6 border-t border-gray"
        >
          <View className="flex-row items-center">
            <MaterialIcons name="chat" size={28} color="#00726B" />
            <Text className="pl-5 text-lg text-black font-poppins">
              Postingan Saya
            </Text>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={25} color="grey" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("../../Detail/bookmark")}
          className="flex-row items-center justify-between px-4 pt-3 pb-6 mx-6 border-b border-gray"
        >
          <View className="flex-row items-center">
            <MaterialIcons name="bookmarks" size={28} color="#00726B" />
            <Text className="pl-5 text-lg text-black font-poppins">
              Tersimpan
            </Text>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={25} color="grey" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("../../Detail/about")}
          className="flex-row items-center justify-between px-4 pt-6 pb-3 mx-6"
        >
          <View className="flex-row items-center">
            <MaterialIcons name="info" size={28} color="#00726B" />
            <Text className="pl-5 text-lg text-gray-800 font-poppins">
              Tentang Rwikistat
            </Text>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={25} color="grey" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row justify-between items-center p-4 px-4 bg-[#dbdbdb] rounded-lg mx-6 mt-3"
        >
          <View className="flex-row items-center">
            <MaterialIcons name="logout" size={32} color="red" />
            <Text
              className="ml-4 text-lg font-poppins"
              style={{ color: "red" }}
            >
              Keluar
            </Text>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={28} color="red" />
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

export default Profile;
