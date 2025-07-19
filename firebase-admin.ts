import { initFirestore } from "@auth/firebase-adapter";
import admin from "firebase-admin";

let app: admin.app.App | undefined;
let adminDBInstance: any;

// Single initialization with caching
const initializeFirebase = () => {
  if (!app) {
    try {
      app = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.SERVICE_ACCOUNT_project_id,
          clientEmail: process.env.SERVICE_ACCOUNT_client_email,
          privateKey: process.env.SERVICE_ACCOUNT_private_key?.replace(
            /\\n/g,
            "\n"
          ),
        }),
      });
    } catch (error) {
      // If already initialized, get the existing app
      app = admin.apps[0];
    }
  }
  
  if (!adminDBInstance) {
    adminDBInstance = initFirestore({
      credential: admin.credential.cert({
        projectId: process.env.SERVICE_ACCOUNT_project_id,
        clientEmail: process.env.SERVICE_ACCOUNT_client_email,
        privateKey: process.env.SERVICE_ACCOUNT_private_key?.replace(/\\n/g, "\n"),
      }),
    });
  }
  
  return { app, adminDB: adminDBInstance };
};

// Initialize once and export
const { app: firebaseApp, adminDB } = initializeFirebase();

const adminAuth = admin.auth(firebaseApp);

//adminAuth for users token to log in
//adminDB modified or use the db.
export { adminDB, adminAuth };
