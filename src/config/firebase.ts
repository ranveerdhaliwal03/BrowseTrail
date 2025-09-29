import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, connectAuthEmulator, signInWithEmailAndPassword} from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBy0bwAXrERbIYnFeFnDL15leSAfYp7kns",
  authDomain: "browsetrail.firebaseapp.com",
  projectId: "browsetrail",
  storageBucket: "browsetrail.firebasestorage.app",
  messagingSenderId: "390326045491",
  appId: "1:390326045491:web:0d235ec29b52f4ec250c46",
  measurementId: "G-RKEW2G0PM1",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();
const db = getFirestore(app);

// Detect dev vs prod
const isDev = process.env.NODE_ENV === "development";

if (isDev) {
  connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "localhost", 8080);
}

// Helper login function
async function signInDev() {
  if (isDev) {
    // Logs into emulator using dummy credentials
    return signInWithEmailAndPassword(auth, "test@example.com", "password123");
  } else {
    // Logs into real Google in prod
    const { signInWithPopup } = await import("firebase/auth");
    return signInWithPopup(auth, googleAuthProvider);
  }
}

export { auth, db, googleAuthProvider, signInDev };
