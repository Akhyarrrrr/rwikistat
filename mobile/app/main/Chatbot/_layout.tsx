import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "@/context/authContext";

const ChatbotLayout = () => {
  return <Stack screenOptions={{ headerShown: true }} />;
};

export default ChatbotLayout;
