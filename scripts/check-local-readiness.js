const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

function readEnv(file) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) return null;

  return fs.readFileSync(fullPath, "utf8").split(/\r?\n/).reduce((env, line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return env;

    const separator = trimmed.indexOf("=");
    if (separator === -1) return env;

    env[trimmed.slice(0, separator).trim()] = trimmed.slice(separator + 1).trim();
    return env;
  }, {});
}

function readJson(file) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) return null;
  return JSON.parse(fs.readFileSync(fullPath, "utf8"));
}

function readPlistValue(file, key) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) return null;

  const plist = fs.readFileSync(fullPath, "utf8");
  const match = plist.match(new RegExp(`<key>${key}</key>\\s*<string>([^<]+)</string>`));
  return match ? match[1] : null;
}

function requireKeys(label, env, keys, errors) {
  if (!env) {
    errors.push(`${label}: .env file is missing`);
    return;
  }

  for (const key of keys) {
    if (!env[key]) errors.push(`${label}: ${key} is empty`);
  }
}

const errors = [];
const warnings = [];

const backendEnv = readEnv("backend/.env");
const frontendEnv = readEnv("frontend/.env");
const mobileEnv = readEnv("mobile/.env");

requireKeys(
  "backend",
  backendEnv,
  [
    "PORT",
    "FIREBASE_PROJECT_ID",
    "FIREBASE_CLIENT_EMAIL",
    "FIREBASE_PRIVATE_KEY",
    "FIREBASE_DATABASE_URL",
    "FIREBASE_STORAGE_BUCKET",
    "PUBLIC_HOST",
  ],
  errors
);

requireKeys(
  "frontend",
  frontendEnv,
  [
    "NEXT_PUBLIC_API_URL",
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
  ],
  errors
);

requireKeys(
  "mobile",
  mobileEnv,
  [
    "EXPO_PUBLIC_API_URL",
    "EXPO_PUBLIC_FIREBASE_API_KEY",
    "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "EXPO_PUBLIC_FIREBASE_PROJECT_ID",
    "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "EXPO_PUBLIC_FIREBASE_APP_ID",
  ],
  errors
);

if (!backendEnv?.AI_API_KEY || !backendEnv?.AI_ASSISTANT_ID) {
  warnings.push("backend: chatbot smoke test will be skipped until AI_API_KEY and AI_ASSISTANT_ID are set");
}

if (!mobileEnv?.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID) {
  warnings.push("mobile: iOS Google Sign-In needs EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID before iOS login testing");
}

if (!mobileEnv?.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID) {
  warnings.push("mobile: Google Sign-In needs EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID before Google login testing");
}

const appJson = readJson("mobile/app.json");
const androidJson = readJson("mobile/google-services.json");
const iosBundleId = readPlistValue("mobile/GoogleService-Info.plist", "BUNDLE_ID");

const androidPackage = appJson?.expo?.android?.package;
const iosPackage = appJson?.expo?.ios?.bundleIdentifier;
const firebaseAndroidPackage = androidJson?.client?.[0]?.client_info?.android_client_info?.package_name;

if (!androidJson) errors.push("mobile: google-services.json is missing");
if (!iosBundleId) errors.push("mobile: GoogleService-Info.plist is missing or missing BUNDLE_ID");

if (androidPackage && firebaseAndroidPackage && androidPackage !== firebaseAndroidPackage) {
  errors.push(`mobile: app.json android.package (${androidPackage}) does not match google-services.json (${firebaseAndroidPackage})`);
}

if (iosPackage && iosBundleId && iosPackage !== iosBundleId) {
  errors.push(`mobile: app.json ios.bundleIdentifier (${iosPackage}) does not match GoogleService-Info.plist (${iosBundleId})`);
}

console.log("Local readiness check");
console.log("=====================");

if (warnings.length) {
  console.log("\nWarnings:");
  for (const warning of warnings) console.log(`- ${warning}`);
}

if (errors.length) {
  console.log("\nMissing or invalid:");
  for (const error of errors) console.log(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log("\nOK: env files and Firebase mobile app IDs are ready for local smoke tests.");
}
