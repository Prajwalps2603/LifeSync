/**
 * Firebase Admin SDK Configuration
 * 
 * LifeSync is ready to connect to Firebase Firestore and Authentication.
 * When you are ready to integrate Firebase:
 * 
 * 1. Install Firebase Admin SDK:
 *    npm install firebase-admin
 * 
 * 2. Get your Service Account Key:
 *    - Go to Firebase Console -> Project Settings -> Service accounts
 *    - Click "Generate new private key"
 *    - Save it as `serviceAccountKey.json` in the `server/firebase/` directory
 *    OR provide credentials via environment variables in `.env`:
 *      FIREBASE_PROJECT_ID=your-project-id
 *      FIREBASE_CLIENT_EMAIL=your-service-account-email
 *      FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
 * 
 * 3. Flip `FIREBASE_ENABLED=true` in your `.env` file.
 */

import dotenv from 'dotenv';
dotenv.config();

export interface FirebaseStatus {
  enabled: boolean;
  initialized: boolean;
  message: string;
}

let dbInstance: any = null;
let authInstance: any = null;

export const getFirebaseStatus = (): FirebaseStatus => {
  const isEnabled = process.env.FIREBASE_ENABLED === 'true';
  const hasKey = !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY || 
                 !!(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY);

  if (!isEnabled) {
    return {
      enabled: false,
      initialized: false,
      message: 'Firebase is in standby mode. Data is handled by the Node.js in-memory store. Set FIREBASE_ENABLED=true in .env to connect.'
    };
  }

  if (!hasKey) {
    return {
      enabled: true,
      initialized: false,
      message: 'Firebase is enabled, but credentials were not found. Provide FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_PROJECT_ID in .env.'
    };
  }

  return {
    enabled: true,
    initialized: dbInstance !== null,
    message: dbInstance !== null ? 'Firebase Firestore connected.' : 'Firebase initializing...'
  };
};

export const initFirebase = async () => {
  if (process.env.FIREBASE_ENABLED !== 'true') {
    return null;
  }

  try {
    // Dynamic import to allow running even before user installs firebase-admin
    const admin = await import('firebase-admin');
    
    if (!admin.default.apps.length) {
      if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        admin.default.initializeApp({
          credential: admin.default.credential.cert(serviceAccount)
        });
      } else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
        admin.default.initializeApp({
          credential: admin.default.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          })
        });
      } else {
        console.warn('⚠️ [Firebase] Credentials missing in environment variables.');
        return null;
      }
    }

    dbInstance = admin.default.firestore();
    authInstance = admin.default.auth();
    console.log('🔥 [Firebase] Successfully initialized Firebase Admin SDK!');
    return { db: dbInstance, auth: authInstance };
  } catch (error: any) {
    console.warn(`⚠️ [Firebase] Could not initialize Firebase: ${error.message}`);
    console.warn('ℹ️ [Firebase] Falling back to Node.js in-memory store.');
    return null;
  }
};

export const getFirestoreDb = () => dbInstance;
export const getFirebaseAuth = () => authInstance;
