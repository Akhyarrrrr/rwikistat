import React, { useEffect, useState } from "react";
import config from "@/config.js";

interface UserData {
  uid: string;
  displayName: string;
  created: string;
}

const UserInfo: React.FC<{ uid: string }> = ({ uid }) => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (!uid) return;

    fetch(`${config.API_URL}/api/user/${uid}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Gagal mengambil data pengguna.");
        }
        return response.json();
      })
      .then((data) => {
        setUserData(data);
      })
      .catch((error) => {
        console.error("Gagal mengambil data pengguna:", error);
      });
  }, [uid]);

  return <span>{userData ? userData.displayName : ""}</span>;
};

export default UserInfo;
