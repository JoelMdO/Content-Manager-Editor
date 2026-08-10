import { initFirestore } from "@auth/firebase-adapter";
import admin from "firebase-admin";

let app: admin.app.App | undefined;

const projectId = process.env.SERVICE_ACCOUNT_project_id;
const clientEmail = process.env.SERVICE_ACCOUNT_client_email;
const privateKey = process.env.SERVICE_ACCOUNT_private_key?.replace(
  /\\n/g,
  "\n"
);

//in firebase from project settings, service account, generate new private key
if (!admin.apps.length && projectId && clientEmail && privateKey) {
  app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

// initFirestore is only called when credentials are available to prevent
// module-level throws during Next.js build when env vars are absent.
const adminDB =
  projectId && clientEmail && privateKey
    ? initFirestore({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      })
    : null;

const adminAuth = app ? admin.auth(app) : null;

//adminAuth for users token to log in
//adminDB modified or use the db.
export { adminDB, adminAuth };
