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
import { auth } from "@/lib/firebase";
import config from "@/lib/config";

interface User {
  uid: string | null;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  getIdTokenResult: () => Promise<IdTokenResult>;
}

interface AuthContextType {
  user: User | null;
  userData: any;
  googleSignIn: () => Promise<void>;
  emailSignIn: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<{ uid: string } | null>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthContextProviderProps {
  children: ReactNode;
}

const AUTO_LOGOUT_TIME = 6 * 60 * 60 * 1000;

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);

  const fetchUserData = async (idToken: string) => {
    try {
      const res = await fetch(`${config.API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
        if (typeof window !== "undefined") {
          localStorage.setItem("userData", JSON.stringify(data));
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    try {
      const res = await fetch(`${config.API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, displayName }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal mendaftar");
      }
      return await res.json();
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result: UserCredential = await signInWithPopup(auth, provider);
      const signedInUser = result.user;
      setUser(signedInUser);

      const idToken = await signedInUser.getIdToken();
      if (typeof window !== "undefined") {
        localStorage.setItem("customToken", idToken);
      }

      await fetchUserData(idToken);
      window.location.href = "/compiler";
    } catch (error) {
      const authError = error as Error;
      console.error("Gagal masuk dengan Google:", authError.message);
    }
  };

  const emailSignIn = async (email: string, password: string) => {
    console.log("emailSignIn called with email:", JSON.stringify(email), "len:", email.length);
    try {
      const result: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const signedInUser = result.user;
      setUser(signedInUser);

      const idToken = await signedInUser.getIdToken();
      if (typeof window !== "undefined") {
        localStorage.setItem("customToken", idToken);
      }

      await fetchUserData(idToken);
      window.location.href = "/compiler";
    } catch (error) {
      const authError = error as Error;
      console.error("Gagal masuk:", authError.message);
      throw error;
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserData(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("customToken");
        localStorage.removeItem("userData");
      }
      window.location.href = "/signin";
    } catch (error) {
      const authError = error as Error;
      console.error("Gagal keluar:", authError.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const idToken = await currentUser.getIdToken();
        const stored = typeof window !== "undefined" ? localStorage.getItem("userData") : null;
        if (stored) {
          setUserData(JSON.parse(stored));
        } else {
          await fetchUserData(idToken);
        }
      } else {
        setUserData(null);
      }
    });

    const autoLogoutTimeout = setTimeout(() => {
      logOut();
    }, AUTO_LOGOUT_TIME);

    return () => {
      unsubscribe();
      clearTimeout(autoLogoutTimeout);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, googleSignIn, emailSignIn, register, logOut }}>
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
