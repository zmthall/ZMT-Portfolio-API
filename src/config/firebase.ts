import 'dotenv/config';

import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const firebaseConfig = {
  projectId: requiredEnv('FB_PROJECT_ID'),
  clientEmail: requiredEnv('FB_CLIENT_EMAIL'),
  privateKey: requiredEnv('FB_PRIVATE_KEY').replace(/\\n/g, '\n'),
  storageBucket: requiredEnv('FB_STORAGE_BUCKET')
};

function getFirebaseApp(): App {
  const existingApp = getApps().at(0);

  if (existingApp) {
    return existingApp;
  }

  return initializeApp({
    credential: cert({
      projectId: firebaseConfig.projectId,
      clientEmail: firebaseConfig.clientEmail,
      privateKey: firebaseConfig.privateKey
    }),
    storageBucket: firebaseConfig.storageBucket
  });
}

const app = getFirebaseApp();

type FirebaseBucket = ReturnType<ReturnType<typeof getStorage>['bucket']>;

export const firebaseBucket: FirebaseBucket = getStorage(app).bucket();
export const firebaseDB = getFirestore(app);
export const firebaseAuth = getAuth(app);