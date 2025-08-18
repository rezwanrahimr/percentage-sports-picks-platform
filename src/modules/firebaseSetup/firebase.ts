import admin from 'firebase-admin';
import * as serviceAccount from './inprep-ai-c0450-firebase-adminsdk-fbsvc-4ed953df39.json';

// Check if Firebase is already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key.replace(/\\n/g, '\n'),
    }),
  });
}

export default admin;