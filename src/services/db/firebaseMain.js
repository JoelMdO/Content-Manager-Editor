import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { initializeFirestore, persistentLocalCache } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_appId,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_databaseURL,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_measurementId,
};

// Initialize Firebaseconst, check if any app is already initialized to avoid issues.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Get a reference to the database service
const database = getDatabase(app);
const auth = getAuth(app);
const dbFireStore = initializeFirestore(app, {
  localCache: persistentLocalCache({
    cacheSizeBytes: 200000000,
    useFetchStreams: true,
  }),
});
const functions = getFunctions(app);

export { database, auth, dbFireStore, functions };
