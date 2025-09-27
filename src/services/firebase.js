import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth"; 

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
const auth = getAuth(app); 
export const db = getFirestore(app);

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