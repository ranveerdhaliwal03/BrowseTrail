import { auth, db } from "../config/firebase"; 
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";


// Listen for extension icon click
chrome.action.onClicked.addListener(() => {
  chrome.identity.getAuthToken({ interactive: true }, async (token) => {
    if (chrome.runtime.lastError || !token) {
      console.error("Failed to get Chrome auth token", chrome.runtime.lastError);
      return;
    }

    try {
      // 1. Create Firebase credential
      const credential = GoogleAuthProvider.credential(null, token);

      // 2. Sign in with Firebase
      // Convert OAuth Access token from google profile (curr signed in) to firebase cred.
      const result = await signInWithCredential(auth, credential);
      const user = result.user;

      console.log(result)
      
      // 3. Check Firestore for user doc
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          displayName: user.displayName,
          createdAt: serverTimestamp(),
        });
      }

      // 4. Open your React app
      chrome.tabs.create({
        url: chrome.runtime.getURL("index.html")
      });

    } catch (err) {
      console.error("Firebase sign-in failed:", err);
    }
  });
});
