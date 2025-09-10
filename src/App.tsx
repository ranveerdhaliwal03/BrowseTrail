import React, { useEffect, useState } from "react";

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [historyItems, setHistoryItems] = useState<chrome.history.HistoryItem[]>([]);

  useEffect(() => {
    // 1. Try reading token from URL
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");

    if (t) {
      setToken(t);
      fetchHistory();
    } else {
      // 2. Fallback: ask background for token
      chrome.runtime.sendMessage({ type: "GET_TOKEN" }, (response) => {
        if (response?.token) {
          setToken(response.token);
          fetchHistory();
        } else {
          setToken(null);
        }
      });
    }

    function fetchHistory() {
      chrome.history.search({ text: "", maxResults: 50 }, (results) => {
        setHistoryItems(results);
      });
    }
  }, []);

  if (!token)
    return <p>Unable to authenticate. Make sure you’re signed into Chrome with Google.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome! You are signed in via Chrome account.</h1>
      <h2>Your Chrome History:</h2>
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
