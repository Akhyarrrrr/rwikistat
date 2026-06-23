export function getFirebaseIdTokenHeaders(): Record<string, string> {
  const token =
    typeof window === "undefined" ? null : localStorage.getItem("customToken");

  return token ? { Authorization: `Bearer ${token}` } : {};
}
