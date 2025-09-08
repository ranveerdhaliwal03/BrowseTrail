chrome.action.onClicked.addListener(() => {
  chrome.identity.getAuthToken({ interactive: true }, (token) => {
    if (chrome.runtime.lastError || !token) {
      console.error("Failed to get Chrome auth token", chrome.runtime.lastError);
      return;
    }

    // Open React app and pass token in query string
    chrome.tabs.create({
      url: chrome.runtime.getURL(`index.html?token=${token}`)
    });
  });
});


