import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
  useColorScheme,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import { useAuth } from "@/context/authContext";
import { useNavigation, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AppleAuthentication from "expo-apple-authentication";
import { doc, getDoc, setDoc, getFirestore } from "firebase/firestore";
import { app } from "../../firebase";

// Interface untuk tipe data pengguna
interface User {
  uid: string; // ID unik pengguna
  name: string; // Nama pengguna
  npm: string; // NIM/NPM pengguna
  profilePicture: string; // URL foto profil pengguna
  photoURL?: string; // URL opsional untuk foto pengguna
  displayName?: string; // Nama yang ditampilkan
  email?: string; // Email pengguna
  score?: number; // Skor pengguna (opsional)
}

// Inisialisasi database Firestore
const db = getFirestore(app);

// Komponen utama untuk halaman login
export default function Login() {
  // State untuk menyimpan data input dan status halaman
  const [passwordVisible, setPasswordVisible] = useState(false); // Status visibilitas password
  const [isLoading, setIsLoading] = useState(false); // Status loading
  const [isModalVisible, setModalVisible] = useState(false); // Status modal
  const [npm, setNpm] = useState(""); // NIM/NPM pengguna
  const [password, setPassword] = useState(""); // Kata sandi pengguna
  const [modalMessage, setModalMessage] = useState(""); // Pesan modal
  const scheme = useColorScheme(); // Skema warna aplikasi
  const router = useRouter(); // Router navigasi

  useEffect(() => {
    const checkIfAuthenticated = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        router.replace("/main/Materi");
      }
    };

    checkIfAuthenticated();
  }, []);

  // Context untuk otentikasi
  const {
    login,
    setUser,
    setIsAuth,
    handleAccessToken,
    errorMessage,
    setErrorMessage,
    sendUserDataToServer,
  } = useAuth();

  // Konfigurasi Google Sign-In saat halaman pertama kali dimuat
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "72157531364-9c72l1rst20td0704jfs20t9km8ois9a.apps.googleusercontent.com",
      iosClientId:
        "72157531364-jmiogtei3uqe61eqmtpm4q3v487udhke.apps.googleusercontent.com",
      offlineAccess: true, // Mengaktifkan offline access token
    });
  }, []);

  // Fungsi untuk login menggunakan Google
  const loginWithGoogle = async () => {
    try {
      setIsLoading(true); // Set status loading

      // Pastikan layanan Google Play tersedia
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const userInfo = await GoogleSignin.signIn(); // Proses login Google
      const idToken = userInfo?.data?.idToken; // Ambil ID token

      if (!idToken) throw new Error("Google Sign-In failed: Missing idToken");

      const googleCredential = auth.GoogleAuthProvider.credential(idToken); // Kredensial Firebase
      const userCredential = await auth().signInWithCredential(
        googleCredential
      );
      const googleUser = userCredential.user; // Data pengguna Google

      // Mapping data pengguna
      const mappedUser: User = {
        uid: googleUser.uid,
        name: googleUser.displayName || "",
        npm: "",
        profilePicture: googleUser.photoURL || "",
      };

      // Kirim data pengguna ke server backend
      const userData = {
        uid: googleUser.uid,
        displayName: googleUser.displayName,
        name: googleUser.displayName,
        email: googleUser.email || "",
        photoURL: googleUser.photoURL || "",
        role: "user",
      };
      await sendUserDataToServer(userData);

      // Simpan data pengguna ke AsyncStorage
      const token = await googleUser.getIdToken();
      await AsyncStorage.setItem("user", JSON.stringify(mappedUser));
      await handleAccessToken(token);

      // Set state aplikasi
      setUser(mappedUser);
      setIsAuth(true);

      // Navigasi ke halaman utama
      router.replace("/main/Materi");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      setErrorMessage(
        "Terjadi kesalahan saat login dengan Google. Silakan coba lagi."
      );
    } finally {
      setIsLoading(false); // Set loading selesai
    }
  };

  // Fungsi untuk login menggunakan Apple
  const loginWithApple = async () => {
    try {
      setIsLoading(true);

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        throw new Error("Apple Sign-In failed: Missing identityToken");
      }

      const fullName = credential.fullName
        ? `${credential.fullName.givenName || ""} ${
            credential.fullName.familyName || ""
          }`.trim()
        : "Pengguna iOS";

      const email = credential.email || "";

      // Data pengguna untuk Apple Sign-In
      const userData: User = {
        uid: credential.user,
        name: fullName,
        npm: "",
        photoURL:
          "https://lh3.googleusercontent.com/a/ACg8ocKAuEkaBrnfZeyNP1l1D4sv2XIrFOrOa5isqAvi8-93=s96-c",
        displayName: fullName,
        email,
        score: 0,
        profilePicture:
          "https://lh3.googleusercontent.com/a/ACg8ocKAuEkaBrnfZeyNP1l1D4sv2XIrFOrOa5isqAvi8-93=s96-c",
      };

      const userRef = doc(db, "appleUser", userData.uid); // Referensi Firestore
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const existingUserData = userDoc.data();
        await AsyncStorage.setItem("user", JSON.stringify(existingUserData));
        setUser(existingUserData as User);

        // Sinkronisasi data ke koleksi "users"
        const usersRef = doc(db, "users", userData.uid);
        await setDoc(usersRef, existingUserData, { merge: true });
      } else {
        await setDoc(userRef, userData, { merge: true });
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

        // Sinkronisasi data ke koleksi "users"
        const usersRef = doc(db, "users", userData.uid);
        await setDoc(usersRef, userData, { merge: true });
      }

      const token = credential.identityToken;
      await handleAccessToken(token);

      router.replace("/main/Materi");
    } catch (error) {
      console.error("Apple Sign-In Error:", error);
      setErrorMessage(
        "Terjadi kesalahan saat login dengan Apple. Silakan coba lagi."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk login manual dengan NPM dan password
  const handleOnClickLogin = async () => {
    if (!npm && !password) {
      showErrorMessage("Silakan isi NIM/NPM dan Kata Sandi terlebih dahulu.");
    } else if (!npm) {
      showErrorMessage("Silakan isi NIM/NPM sebelum melanjutkan.");
    } else if (!password) {
      showErrorMessage("Silakan isi Kata Sandi sebelum melanjutkan.");
    } else {
      setIsLoading(true);
      await login(npm, password);
      if (errorMessage) showErrorMessage(errorMessage);
      setIsLoading(false);
    }
  };

  // Toggle visibilitas password
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Fungsi untuk menampilkan modal error
  const showErrorMessage = (message: any) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  return (
    // Tampilan utama halaman login
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      {/* Status bar */}
      <StatusBar
        barStyle={scheme === "dark" ? "dark-content" : "dark-content"}
        backgroundColor="#ffffff"
        translucent
      />

      {/* ScrollView untuk konten */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="bg-white"
        keyboardShouldPersistTaps="handled"
      >
        {/* Konten login */}
        <View className="items-center justify-center flex-1 px-6 py-6">
          <Text className="pt-6 mb-2 text-4xl text-center font-poppinsBold text-primary">
            Selamat Datang Statiskawan
          </Text>
          <Text className="mb-10 text-base text-center text-gray-500 font-poppins">
            Halo 👋 semangat belajar!
          </Text>

          {/* Input NPM */}
          <View className="w-full mb-4">
            <Text className="mb-2 text-base text-gray-700 font-poppinsSemiBold">
              NIM/NPM
            </Text>
            <TextInput
              value={npm}
              onChangeText={setNpm}
              placeholder="Silahkan Masukkan NPM"
              placeholderTextColor="#9e9e9e"
              className="w-full px-4 text-base bg-white border border-gray-300 rounded-lg h-14 font-poppins"
              editable={!isLoading}
              keyboardType="numeric"
            />
          </View>

          {/* Input Password */}
          <View className="w-full mb-8">
            <Text className="mb-2 text-base text-gray-700 font-poppinsSemiBold">
              Kata Sandi
            </Text>
            <View className="relative">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Silahkan Masukkan Kata Sandi"
                placeholderTextColor="#9e9e9e"
                secureTextEntry={!passwordVisible}
                className="w-full px-4 text-base bg-white border border-gray-300 rounded-lg h-14 font-poppins"
                textContentType="oneTimeCode"
                editable={!isLoading}
                autoCapitalize="none"
              />
              <TouchableOpacity
                className="absolute right-4 top-4"
                onPress={togglePasswordVisibility}
                disabled={isLoading}
              >
                <MaterialIcons
                  name={passwordVisible ? "visibility" : "visibility-off"}
                  size={24}
                  color={isLoading ? "#9e9e9e" : "gray"}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Tombol Login */}
          <TouchableOpacity
            className={`w-full h-14 ${
              isLoading ? "bg-primary/70" : "bg-primary"
            } rounded-lg flex flex-row items-center justify-center`}
            onPress={handleOnClickLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <ActivityIndicator color="white" style={{ marginRight: 8 }} />
                <Text className="text-base text-white font-poppinsSemiBold">
                  Sedang Masuk...
                </Text>
              </>
            ) : (
              <Text className="text-base text-white font-poppinsSemiBold">
                Masuk Sebagai Mahasiswa USK
              </Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex flex-row items-center w-full my-6">
            <View className="flex-1 h-[1px] bg-black" />
            <Text className="mx-4 text-sm text-gray-500 font-poppins">
              Atau silahkan
            </Text>
            <View className="flex-1 h-[1px] bg-black" />
          </View>

          {/* Tombol Login Lainnya */}
          <View className="flex flex-row items-center justify-center w-full mb-6 space-x-4">
            {/* Tombol Google */}
            <TouchableOpacity
              className="flex flex-row items-center justify-center flex-1 bg-white border border-gray-300 rounded-lg h-14"
              onPress={loginWithGoogle}
              disabled={isLoading}
            >
              <Image
                source={require("../../assets/images/google-logo.png")}
                style={{ width: 24, height: 24, marginRight: 8 }}
              />
              <Text className="text-sm text-gray-700 font-poppinsSemiBold">
                Masuk Dengan Google
              </Text>
            </TouchableOpacity>

            {/* Tombol Apple */}
            {Platform.OS === "ios" && (
              <TouchableOpacity
                className="flex flex-row items-center justify-center flex-1 ml-4 bg-white border border-gray-300 rounded-lg h-14"
                onPress={loginWithApple}
                disabled={isLoading}
              >
                <Image
                  source={require("../../assets/images/apple-logo.png")}
                  style={{ width: 24, height: 24, marginRight: 8 }}
                />
                <Text className="text-sm text-gray-700 font-poppinsSemiBold">
                  Masuk Dengan Apple
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Modal Error */}
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={() => setModalVisible(false)}
        >
          <View className="items-center p-6 bg-white rounded-lg">
            <MaterialIcons name="error-outline" size={48} color="#FF6B6B" />
            <Text className="mt-4 mb-2 text-lg text-gray-800 font-poppinsBold">
              Peringatan!
            </Text>
            <Text className="text-center text-gray-600 font-poppins">
              {modalMessage}
            </Text>
            <TouchableOpacity
              className="px-4 py-2 mt-4 rounded-md bg-primary"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-white font-poppinsSemiBold">OK</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
