import admin from "firebase-admin";

// Optimized Firebase Admin initialization with proper singleton pattern
let adminApp: admin.app.App | undefined;
let adminAuthInstance: admin.auth.Auth | undefined;

const initializeAdminApp = () => {
  if (!adminApp) {
    try {
      // Try to get existing app first
      if (admin.apps.length > 0) {
        adminApp = admin.apps[0];
      } else {
        // Create new app only if none exists
        const serviceAccount = {
          type: process.env.SERVICE_ACCOUNT_type,
          project_id: process.env.SERVICE_ACCOUNT_project_id,
          private_key_id: process.env.SERVICE_ACCOUNT_private_key_id,
          private_key: process.env.SERVICE_ACCOUNT_private_key!.replace(/\\n/g, "\n"),
          client_email: process.env.SERVICE_ACCOUNT_client_email,
          client_id: process.env.SERVICE_ACCOUNT_client_id,
          auth_uri: process.env.SERVICE_ACCOUNT_auth_uri,
          token_uri: process.env.SERVICE_ACCOUNT_token_uri,
          auth_provider_x509_cert_url:
            process.env.SERVICE_ACCOUNT_auth_provider_x509_cert_url,
          client_x509_cert_url: process.env.SERVICE_ACCOUNT_client_x509_cert_url,
          universe_domain: process.env.SERVICE_ACCOUNT_universe_domain,
        };
        
        adminApp = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: process.env.FIREBASE_databaseURL,
        });
      }
    } catch {
      // If initialization fails, try to get the default app
      adminApp = admin.app();
    }
  }
  
  if (!adminAuthInstance && adminApp) {
    adminAuthInstance = admin.auth(adminApp);
  }
  
  return { app: adminApp, auth: adminAuthInstance };
};

// Initialize once
const { app: adminAppInstance, auth: adminAuth } = initializeAdminApp();

export { adminAppInstance as admin, adminAuth };
