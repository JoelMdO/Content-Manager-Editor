import { initializeApp } from "firebase/app";
import { getDatabase} from "firebase/database";
import { getAuth } from "firebase/auth";
import {
    initializeFirestore,
    persistentLocalCache,
  } from "firebase/firestore";

const firebaseConfigDecav = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_DeCav_apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_DeCav_authDomain,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DeCav_databaseURL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_DeCav_projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_DeCav_storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_DeCav_messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_DeCav_appId,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_DeCav_measurementId
};

// Initialize Firebaseconst 
const appDecav = initializeApp(firebaseConfigDecav, "appDecav");
//
// Get a reference to the database service
const databaseDecav = getDatabase(appDecav);
const authDecav = getAuth(appDecav);
//
export { databaseDecav, authDecav };
