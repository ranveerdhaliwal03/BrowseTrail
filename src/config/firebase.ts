import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

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
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
