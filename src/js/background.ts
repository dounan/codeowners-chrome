chrome.webNavigation.onHistoryStateUpdated.addListener(
  function(details) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const tab = tabs[0];
      tab != null &&
        tab.id != null &&
        chrome.tabs.sendMessage(tab.id, {type: "injectButton"});
    });
  },
  {url: [{hostSuffix: "github.com", pathSuffix: "/files"}]},
);
