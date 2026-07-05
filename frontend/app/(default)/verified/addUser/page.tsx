"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserAuth } from "@/app/context/authContext";

export default function AddUserRedirect() {
  const { isAdmin, loading } = UserAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    router.replace(isAdmin ? "/admin/add-user" : "/compiler");
  }, [isAdmin, loading, router]);

  return null;
}
