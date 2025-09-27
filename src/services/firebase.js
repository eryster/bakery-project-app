import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth"; 
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_APP_ID,
    measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID,
};

if (!firebaseConfig.apiKey) {
    console.error('Firebase config is missing API Key.');
}

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

onAuthStateChanged(auth, (user) => {
  if (!user) {
    signInAnonymously(auth)
      .then(() => {
        console.log("Anonymous authentication successful!");
      })
      .catch((error) => {
        console.error("Anonymous authentication error:", error.message);
      });
  } else {
    console.log("User already authenticated. UID:", user.uid);
  }
});


export const db = getFirestore(app);