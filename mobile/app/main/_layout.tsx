import React from "react";
import { Tabs } from "expo-router";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState, createContext, useContext } from "react";

export const TabVisibilityContext = createContext({
  setIsInputFocused: (focused: boolean) => {},
  isInputFocused: false,
});

export const useTabVisibility = () => {
  const context = useContext(TabVisibilityContext);
  if (!context) {
    throw new Error(
      "useTabVisibility must be used within TabVisibilityProvider"
    );
  }
  return context;
};

export default function MainLayout() {
  const [isInputFocused, setIsInputFocused] = useState(false);

  return (
    <TabVisibilityContext.Provider
      value={{ isInputFocused, setIsInputFocused }}
    >
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#00726B",
          tabBarInactiveTintColor: "#9e9e9e",
          tabBarStyle: {
            backgroundColor: "#ffffff",
            height: 75,
            paddingBottom: 20,
            paddingTop: 7,
            display: isInputFocused ? "none" : "flex",
          },
          tabBarLabelStyle: {
            fontFamily: "poppinsSemiBold",
            fontSize: 12,
            marginBottom: -5,
          },
        }}
      >
        <Tabs.Screen
          name="Materi"
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="book-open-variant"
                color={color}
                size={size}
              />
            ),
            title: "Materi",
          }}
        />

        <Tabs.Screen
          name="Compiler"
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="code-tags"
                color={color}
                size={size}
              />
            ),
            title: "Compiler",
          }}
        />

        <Tabs.Screen
          name="Chatbot"
          options={{
            tabBarIcon: ({ size }) => (
              <LinearGradient
                colors={["#38B68D", "#01736C"]}
                style={{
                  borderRadius: 50,
                  borderWidth: 10,
                  borderColor: "#EFEFEF",
                  height: 80,
                  width: 80,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 30,
                }}
              >
                <MaterialCommunityIcons
                  name="robot-outline"
                  color="#ffffff"
                  size={size}
                />
              </LinearGradient>
            ),
            title: "",
          }}
        />

        <Tabs.Screen
          name="Forum"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubbles-outline" color={color} size={size} />
            ),
            title: "Forum",
            headerTitle: "Forum Diskusi",
            headerStyle: {
              backgroundColor: "#ffffff",
            },
            headerTitleStyle: {
              fontFamily: "poppinsSemiBold",
              fontSize: 20,
              color: "#00726B",
            },
          }}
        />

        <Tabs.Screen
          name="Profile"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" color={color} size={size} />
            ),
            title: "Pengaturan",
          }}
        />
      </Tabs>
    </TabVisibilityContext.Provider>
  );
}
