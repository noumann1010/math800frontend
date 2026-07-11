import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type Auth,
  type User as FirebaseUser,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId,
  );
}

function ensureConfigured(): void {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase is not configured. Fill all VITE_FIREBASE_* values in your .env file.');
  }
}

let appSingleton: FirebaseApp | null = null;
let authSingleton: Auth | null = null;

export function getFirebaseApp(): FirebaseApp {
  ensureConfigured();

  if (appSingleton) {
    return appSingleton;
  }

  appSingleton = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return appSingleton;
}

export function getFirebaseAuth(): Auth {
  if (authSingleton) {
    return authSingleton;
  }

  authSingleton = getAuth(getFirebaseApp());
  return authSingleton;
}

export async function signInWithFirebaseEmail(email: string, password: string): Promise<FirebaseUser> {
  const auth = getFirebaseAuth();
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function registerWithFirebaseEmail(
  email: string,
  password: string,
  displayName?: string,
): Promise<FirebaseUser> {
  const auth = getFirebaseAuth();
  const result = await createUserWithEmailAndPassword(auth, email, password);

  if (displayName?.trim()) {
    await updateProfile(result.user, { displayName: displayName.trim() });
  }

  return result.user;
}

export async function signOutFromFirebase(): Promise<void> {
  const auth = getFirebaseAuth();
  await signOut(auth);
}

export function subscribeToFirebaseAuthState(
  callback: (user: FirebaseUser | null) => void,
  onError?: (error: Error) => void,
): () => void {
  const auth = getFirebaseAuth();

  return onAuthStateChanged(
    auth,
    callback,
    (error) => {
      if (onError) {
        onError(error as Error);
      }
    },
  );
}
