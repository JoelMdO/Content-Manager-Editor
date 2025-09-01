import { initFirestore } from "@auth/firebase-adapter";
import admin from "firebase-admin";

let app;

//in firebase from project settings, service account, generate new private key
if (!admin.apps.length) {
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
}
const adminDB = initFirestore({
  credential: admin.credential.cert({
    projectId: process.env.SERVICE_ACCOUNT_project_id,
    clientEmail: process.env.SERVICE_ACCOUNT_client_email,
    privateKey: process.env.SERVICE_ACCOUNT_private_key?.replace(/\\n/g, "\n"),
  }),
});

const adminAuth = admin.auth(app);

//adminAuth for users token to log in
//adminDB modified or use the db.
export { adminDB, adminAuth };
