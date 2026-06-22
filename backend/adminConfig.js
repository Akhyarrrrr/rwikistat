const admin = require("firebase-admin");
require("dotenv").config();

const firebaseCred =
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY
    ? {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }
    : null;

admin.initializeApp({
  credential: firebaseCred
    ? admin.credential.cert(firebaseCred)
    : admin.credential.applicationDefault(),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const firestore = admin.firestore();
const storage = admin.storage();
const auth = admin.auth();

module.exports = { admin, firestore, storage, auth };
