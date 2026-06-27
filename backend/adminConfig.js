const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

let initialized = false;

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
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
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
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
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

const firestore = initialized ? admin.firestore() : null;
const storage = initialized ? admin.storage() : null;
const auth = initialized ? admin.auth() : null;

module.exports = { admin, firestore, storage, auth };
