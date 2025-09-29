import React, { useEffect, useState } from "react";

const App: React.FC = () => {
  const [idToken, setIdToken] = useState<string | null>(null);
  const [historyItems, setHistoryItems] = useState<chrome.history.HistoryItem[]>([]);

  useEffect(() => {
    // Ask background for Firebase ID token
    chrome.runtime.sendMessage({ type: "GET_ID_TOKEN" }, (response) => {
      if (response?.idToken) {
        setIdToken(response.idToken);
      } else {
        setIdToken(null);
      }
    });

    // Always fetch some history to display
    chrome.history.search({ text: "", maxResults: 20 }, (results) => {
      setHistoryItems(results);
    });
  }, []);

  async function handleSync() {
    if (!idToken) return alert("Not authenticated!");

    try {
      const res = await fetch("https://us-central1-YOUR_PROJECT.cloudfunctions.net/syncHistory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          history: historyItems.map((h) => ({
            url: h.url,
            title: h.title,
            visitTime: h.lastVisitTime,
            syncedByExtensionVersion: "1.0.0",
          })),
        }),
      });
      const data = await res.json();
      console.log("Sync result:", data);
      alert(`Synced ${data.count} history items!`);
    } catch (err) {
      console.error("Sync failed:", err);
    }
  }

  if (!idToken)
    return <p>Unable to authenticate. Make sure you’re signed into Chrome with Google.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>BrowseTrail</h1>
      <button onClick={handleSync} style={{ marginBottom: "20px" }}>
        Sync History
      </button>
      <ul>
        {historyItems.map((item) => (
          <li key={item.id}>
            {item.title} — <a href={item.url}>{item.url}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
