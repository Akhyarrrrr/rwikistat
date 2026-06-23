import React, { createContext, useState, useContext, useEffect } from "react";
import { signOut, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { auth } from "../firebase";
import config from "@/config";

// Tipe data untuk user
// Berisi informasi pengguna seperti uid, nama, npm, dan foto profil
type User = {
  uid: string;
  name: string;
  npm: string;
  profilePicture: string;
};

// Interface untuk AuthContext
// Menentukan fungsi dan state yang dapat digunakan di dalam context
interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuth: boolean;
  setIsAuth: (value: boolean) => void;
  accessToken: string | null;
  setAccessToken: (value: string) => void;
  handleAccessToken: (token: string) => Promise<void>;
  getAccessToken: () => Promise<string | null>;
  login: (npm: any, password: any) => Promise<void>;
  logout: () => Promise<void>;
  getUser: () => Promise<User | null>;
  errorMessage: string | null;
  setErrorMessage: (message: string | null) => void;
  sendUserDataToServer: (userData: any) => Promise<void>;
}

// Inisialisasi AuthContext dengan nilai default
const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isAuth: false,
  setIsAuth: () => {},
  accessToken: null,
  setAccessToken: () => {},
  handleAccessToken: async () => {},
  getAccessToken: async () => null,
  login: async () => {},
  logout: async () => {},
  getUser: async () => null,
  errorMessage: null,
  setErrorMessage: () => {},
  sendUserDataToServer: async () => {},
});

// AuthProvider: Komponen penyedia context untuk otentikasi
export const AuthProvider = ({ children }: any) => {
  // State untuk menyimpan informasi pengguna
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false); // Status otentikasi
  const [accessToken, setAccessToken] = useState<string | null>(null); // Token akses
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Pesan error
  const router = useRouter();

  // Fungsi untuk mendapatkan token akses dari penyimpanan lokal
  const getAccessToken = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (token) {
        setAccessToken(token);
      }
      return token;
    } catch (error) {
      console.error("Error getting access token:", error);
      return null;
    }
  };

  // Fungsi untuk menyimpan token akses ke penyimpanan lokal
  const handleAccessToken = async (token: string) => {
    try {
      await AsyncStorage.setItem("accessToken", token);
      setAccessToken(token);
    } catch (error) {
      console.error("Error saving access token:", error);
    }
  };

  // Fungsi untuk login menggunakan npm dan password
  const login = async (npm: any, password: any) => {
    try {
      const email = `${npm}@example.com`;
      const result = await signInWithEmailAndPassword(auth, email, password);
      const signedInUser: any = result.user;

      // Set informasi pengguna dan status otentikasi
      setUser(signedInUser);
      setIsAuth(true);
      setErrorMessage(null);

      // Tambahkan informasi pengguna tambahan
      signedInUser.uid = result.user.uid;

      // Kirim data pengguna ke server
      sendUserDataToServer({
        email: signedInUser.email || "",
        role: "user",
        uid: signedInUser.uid,
        displayName: signedInUser.displayName || "",
        photoURL: signedInUser.photoURL || "",
      });

      // Ambil token akses dan simpan ke penyimpanan lokal
      const accessToken = await signedInUser.getIdToken();
      const userData = {
        uid: signedInUser.uid,
        name: signedInUser.displayName,
        email: signedInUser.email,
        profilePicture: signedInUser.photoURL,
      };
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      await handleAccessToken(accessToken);

      router.replace("/main/Materi");
    } catch {
      setErrorMessage("Akun atau kata sandi salah. Silakan coba lagi.");
    }
  };

  // Fungsi untuk mengirim data pengguna ke server backend
  const sendUserDataToServer = async (userData: any) => {
    try {
      const response = await fetch(
        `${config.API_URL}/google-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );
      if (!response.ok) {
        console.error("Gagal mengirim data pengguna ke server.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Fungsi untuk logout pengguna
  const logout = async () => {
    try {
      await signOut(auth); // Logout dari Firebase
      await GoogleSignin.signOut(); // Logout dari Google
      await AsyncStorage.removeItem("user"); // Hapus data pengguna dari penyimpanan lokal
      await AsyncStorage.clear(); // Bersihkan penyimpanan lokal
      setUser(null);
      setIsAuth(false);
      router.replace("/auth"); // Redirect ke halaman login
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Fungsi untuk mendapatkan data pengguna dari penyimpanan lokal
  const getUser = async () => {
    try {
      const pUser: any = await AsyncStorage.getItem("user");
      return JSON.parse(pUser);
    } catch (error) {
      console.error("Error getting user:", error);
      return null;
    }
  };

  // Efek untuk memuat data pengguna saat pertama kali aplikasi dijalankan
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuth(true);
        }
      } catch (error) {
        console.error("Error loading user from storage:", error);
      }
    };
    loadUser();
  }, []);

  // Menyediakan nilai dan fungsi yang dapat digunakan di dalam komponen lain
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuth,
        setIsAuth,
        accessToken,
        setAccessToken,
        handleAccessToken,
        getAccessToken,
        login,
        logout,
        getUser,
        errorMessage,
        setErrorMessage,
        sendUserDataToServer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook untuk menggunakan AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
