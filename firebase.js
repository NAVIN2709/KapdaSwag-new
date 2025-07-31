import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeFirestore, persistentLocalCache } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCD87_1MzXb6Kr1tA2fuWqHuMcnsthQiOI",
  authDomain: "kapdaswag.firebaseapp.com",
  databaseURL:
    "https://kapdaswag-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kapdaswag",
  storageBucket: "kapdaswag.firebasestorage.app",
  messagingSenderId: "519558713442",
  appId: "1:519558713442:web:f93bfc7b92e5e146d5413b",
  measurementId: "G-CRHHCL0K87",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = initializeFirestore(app, {
  localCache: persistentLocalCache()
});
const analytics = getAnalytics(app);
export { db, auth };
