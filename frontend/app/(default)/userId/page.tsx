"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserAuth } from "@/app/context/authContext";

export default function UserIdPage() {
  const { user } = UserAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace(`/userId/${user.uid}`);
    } else {
      router.replace("/forum");
    }
  }, [user, router]);

  return null;
}
