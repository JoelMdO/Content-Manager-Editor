import { initializeApp } from "firebase/app";
import { getDatabase} from "firebase/database";
import { getAuth } from "firebase/auth";
import {
    getFirestore,
    initializeFirestore,
    persistentLocalCache,
  } from "firebase/firestore";

// Replace with your Firebase project configuration
const firebaseConfig = {
apiKey: process.env.NEXT_PUBLIC_FIREBASE_apiKey,
authDomain: process.env.NEXT_PUBLIC_FIREBASE_authDomain,
projectId: process.env.NEXT_PUBLIC_FIREBASE_projectId,
storageBucket: process.env.NEXT_PUBLIC_FIREBASE_storageBucket,
messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_messagingSenderId,
appId: process.env.NEXT_PUBLIC_FIREBASE_appId,
databaseURL: process.env.NEXT_PUBLIC_FIREBASE_databaseURL,
measurementId: process.env.NEXT_PUBLIC_FIREBASE_measurementId
};

// Initialize Firebaseconst 
const app = initializeApp(firebaseConfig);

// Get a reference to the database service
const database = getDatabase(app);
const auth = getAuth(app);
const dbFireStore = initializeFirestore(app, {
  localCache: persistentLocalCache({
    cacheSizeBytes: 200000000,
    useFetchStreams: true
  }),
});

export { database, auth, dbFireStore };
