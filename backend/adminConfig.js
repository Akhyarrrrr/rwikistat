const { cert, getApps, initializeApp } = require("firebase-admin/app");
const { FieldValue, getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");
const { getAuth } = require("firebase-admin/auth");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

let initialized = false;
let app = null;

function findServiceAccountFile() {
  const files = fs.readdirSync(__dirname);
  const match = files.find(
    (f) => f.endsWith(".json") && f.includes("firebase-adminsdk")
  );
  return match ? path.join(__dirname, match) : null;
}

const serviceAccountPath = findServiceAccountFile();

if (serviceAccountPath) {
  try {
    const serviceAccount = require(serviceAccountPath);
    app = getApps()[0] || initializeApp({
      credential: cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
    initialized = true;
    console.log(`Firebase Admin initialized using: ${path.basename(serviceAccountPath)}`);
  } catch (error) {
    console.error("Failed to init Firebase Admin from JSON file:", error.message);
  }
} else {
  const requiredVars = ["FIREBASE_PROJECT_ID", "FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY"];
  const missingVars = requiredVars.filter(
    (key) => !process.env[key] || process.env[key].trim() === ""
  );

  if (missingVars.length === 0) {
    try {
      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      };
      app = getApps()[0] || initializeApp({
        credential: cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
      initialized = true;
      console.log("Firebase Admin initialized from env vars");
    } catch (error) {
      console.error("Failed to init Firebase Admin from env vars:", error.message);
    }
  } else {
    console.warn(`Firebase Admin not initialized. Missing: ${missingVars.join(", ")}`);
  }
}

const firestore = initialized ? getFirestore(app) : null;
const storage = initialized ? getStorage(app) : null;
const auth = initialized ? getAuth(app) : null;
const admin = {
  auth: () => auth,
  firestore: { FieldValue },
};

module.exports = { admin, firestore, storage, auth };
