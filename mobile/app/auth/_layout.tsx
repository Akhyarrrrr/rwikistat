import { AuthProvider } from "@/context/authContext";
import { Slot } from "expo-router";
import React from "react";

export default function authLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
