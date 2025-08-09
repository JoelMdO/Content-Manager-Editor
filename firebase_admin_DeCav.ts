import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { getDatabase as getAdminDatabase } from "firebase-admin/database";

// Initialize Firebase Admin SDK for server-side operations
export const initializeFirebaseAdmin = () => {
  // Check if we already have an admin app initialized
  const existingApp = getApps().find((app) => app.name === "admin");

  if (!existingApp) {
    // Use your existing Firebase project configuration
    const serviceAccount = {
      type: process.env.FIREBASE_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url:
        process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
      universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
    };

    // Initialize with your existing Realtime Database URL
    const app = initializeApp(
      {
        credential: cert(serviceAccount as any),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DeCav_databaseURL,
      },
      "admin"
    );

    return {
      auth: getAdminAuth(app),
      database: getAdminDatabase(app),
    };
  }

  return {
    auth: getAdminAuth(existingApp),
    database: getAdminDatabase(existingApp),
  };
};
