import { getAnalytics, isSupported } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let initialized = false;

export const initAnalytics = async () => {
  if (initialized || !import.meta.env.PROD) return;
  if (Object.values(firebaseConfig).some((value) => !value)) return;
  initialized = true;
  if (!(await isSupported())) return;
  getAnalytics(initializeApp(firebaseConfig));
};
