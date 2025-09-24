import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "./config/firebase";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [historyItems, setHistoryItems] = useState<chrome.history.HistoryItem[]>([]);

  useEffect(() => {
    // Watch for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);

      // If user logs in, fetch Chrome history
      if (firebaseUser) {
        chrome.history.search({ text: "", maxResults: 50 }, (results) => {
          setHistoryItems(results);
        });
      } else {
        setHistoryItems([]); // clear history if logged out
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      {user ? (
        <>
          <h1>Welcome! {user.displayName}</h1>
          <h2>Your Chrome History:</h2>
          <ul>
            {historyItems.map((item) => (
              <li key={item.id}>
                {item.title || "No title"} — <a href={item.url}>{item.url}</a>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Please sign in.</p>
      )}
    </div>
  );
}

export default App;
