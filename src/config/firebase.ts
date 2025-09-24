import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBy0bwAXrERbIYnFeFnDL15leSAfYp7kns",
  authDomain: "browsetrail.firebaseapp.com",
  projectId: "browsetrail",
  storageBucket: "browsetrail.firebasestorage.app",
  messagingSenderId: "390326045491",
  appId: "1:390326045491:web:0d235ec29b52f4ec250c46",
  measurementId: "G-RKEW2G0PM1"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app); //used to check if user is logged in later 
export const googleAuthProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

