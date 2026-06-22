import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "@/context/authContext";

const ProfileLayout = () => {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: true,
        }}
      />
    </AuthProvider>
  );
};

export default ProfileLayout;
