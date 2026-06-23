"use client";
import React, {
  useContext,
  createContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  UserCredential,
  onAuthStateChanged,
  GoogleAuthProvider,
  IdTokenResult,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import config from "@/config.js";

interface User {
  uid: string | null;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  getIdTokenResult: () => Promise<IdTokenResult>;
}

interface AuthContextType {
  user: User | null;
  googleSignIn: () => Promise<void>;
  emailSignIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
}

interface UserData {
  uid: string;
  role: string;
  displayName: string;
  photoURL: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthContextProviderProps {
  children: ReactNode;
}

const AUTO_LOGOUT_TIME = 6 * 60 * 60 * 1000;
// const AUTO_LOGOUT_TIME = 6 * 60 * 60 * 1000; // 6 jam dalam milidetik

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result: UserCredential = await signInWithPopup(auth, provider);
      const signedInUser = result.user;

      // Set data yang ingin Anda kirimkan ke server
      const userData = {
        email: signedInUser.email || "",
        role: "user", // Ganti ini dengan cara Anda menentukan peran (role) pengguna
        uid: signedInUser.uid,
        displayName: signedInUser.displayName || "",
        photoURL: signedInUser.photoURL || "",
      };

      // Kirim data pengguna ke endpoint REST API
      await sendUserDataToServer(userData);

      // Mendapatkan token akses
      const customToken = await signedInUser.getIdToken();

      // Gunakan idToken sesuai kebutuhan, seperti menyertakannya dalam header permintaan API
      // atau menyimpannya di local storage untuk digunakan nanti

      // Set pengguna di aplikasi Anda, jika diperlukan
      setUser(signedInUser);

      if (typeof window !== "undefined") {
        // Simpan token di Local Storage
        localStorage.setItem("customToken", customToken);
      }

      window.location.href = "/compiler";
    } catch (error) {
      const authError = error as Error;
      console.error("Gagal masuk dengan Google:", authError.message);
    }
  };

  const sendUserDataToServer = async (userData: UserData) => {
    try {
      const response = await fetch(`${config.API_URL}/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
      } else {
        console.error("Gagal mengirim data pengguna ke server.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const emailSignIn = async (email: string, password: string) => {
    try {
      const result: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const signedInUser = result.user;
      setUser(signedInUser);
      const customToken = await signedInUser.getIdToken();

      if (typeof window !== "undefined") {
        // Simpan token di Local Storage
        localStorage.setItem("customToken", customToken);
      }

      window.location.href = "/compiler";
    } catch (error) {
      const authError = error as Error;
      console.error(
        "Gagal masuk dengan email dan password:",
        authError.message
      );
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      window.location.href = "/signin";
    } catch (error) {
      const authError = error as Error;
      console.error("Gagal keluar:", authError.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Fungsi untuk logout otomatis setelah waktu tertentu
    const autoLogoutTimeout = setTimeout(() => {
      logOut(); // Panggil fungsi logout
    }, AUTO_LOGOUT_TIME);

    return () => {
      unsubscribe();
      clearTimeout(autoLogoutTimeout);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, googleSignIn, emailSignIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
