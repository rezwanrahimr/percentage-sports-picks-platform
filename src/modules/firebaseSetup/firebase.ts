import admin from 'firebase-admin';
import * as serviceAccount from './richboymarquis-2f430-firebase-adminsdk-fbsvc-315c35fb18.json';

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