import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableNetwork, disableNetwork } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6l6BnzgnGHKHN33ROuaERwg5JLzu_GXE",
  authDomain: "loomix-cbb48.firebaseapp.com",
  projectId: "loomix-cbb48",
  storageBucket: "loomix-cbb48.firebasestorage.app",
  messagingSenderId: "530756654370",
  appId: "1:530756654370:web:b99163759826ce9e90017b",
  measurementId: "G-J4B9KLMZZ9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Test Firestore connection
enableNetwork(db).catch((error) => {
  console.error('Firestore network connection failed:', error);
});

// Initialize analytics only in production
let analytics;
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Analytics initialization failed:', error);
  }
}

