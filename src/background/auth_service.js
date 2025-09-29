import { auth, db } from "../config/firebase";
import {GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

// Detect dev vs prod
const isEmulator = process.env.NODE_ENV === "development";

// Helper: Ensure Firestore user doc exists
async function ensureUserDoc(user) {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      email: user.email,
      displayName: user.displayName ?? "Test User",
      createdAt: serverTimestamp(),
    });
  }
}

// Background click handler
chrome.action.onClicked.addListener(() => {
  if (isEmulator) {
    // 🔹 Emulator mode → dummy user
    signInWithEmailAndPassword(auth, "test@example.com", "password123")
      .then(async (result) => {
        await ensureUserDoc(result.user);

        chrome.tabs.create({
          url: chrome.runtime.getURL("index.html"),
        });
      })
      .catch((err) => {
        console.error("Emulator login failed:", err);
      });
  } else {
    // 🔹 Production mode → Chrome OAuth flow
    chrome.identity.getAuthToken({ interactive: true }, async (token) => {
      if (chrome.runtime.lastError || !token) {
        console.error("Failed to get Chrome auth token", chrome.runtime.lastError);
        return;
      }

      const credential = GoogleAuthProvider.credential(null, token);

      try {
        const result = await signInWithCredential(auth, credential);
        await ensureUserDoc(result.user);

        chrome.tabs.create({
          url: chrome.runtime.getURL("index.html"),
        });
      } catch (err) {
        console.error("Firebase sign-in failed:", err);
      }
    });
  }
});

// Respond to token requests from React app
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "GET_ID_TOKEN") {
    auth.currentUser?.getIdToken().then((idToken) => {
      sendResponse({ idToken });
    });
    return true; // keeps channel open for async response
  }
});
