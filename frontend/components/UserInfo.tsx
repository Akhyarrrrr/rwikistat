import React, { useState, useEffect } from "react";

const API_HOST = "https://rest-api-zzvthujxxq-as.a.run.app"; // Ganti dengan host Anda jika berbeda
const API_PORT = 3001;

interface UserData {
  uid: string;
  displayName: string;
  created: string;
  // Tambahkan properti pengguna lainnya sesuai kebutuhan
}

const UserInfo: React.FC<{ uid: string }> = ({ uid }) => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (uid) {
      // Lakukan permintaan ke endpoint API untuk mendapatkan data pengguna berdasarkan uid
      fetch(`${API_HOST}:${API_PORT}/api/user/${uid}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Gagal mengambil data pengguna.");
          }
          return response.json();
        })
        .then((data) => {
          setUserData(data); // Menyimpan data pengguna dalam state
        })
        .catch((error) => {
          console.error("Gagal mengambil data pengguna:", error);
        });
    }
  }, [uid]);

  return <span>{userData ? userData.displayName : ""}</span>;
};

export default UserInfo;
