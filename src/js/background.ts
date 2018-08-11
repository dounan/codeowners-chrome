chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
  if (isPrFilesPage(details.url)) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const tab = tabs[0];
      tab != null &&
        tab.id != null &&
        chrome.tabs.sendMessage(tab.id, {type: "injectButton"});
    });
  }
});

function isPrFilesPage(url: string) {
  return (
    url &&
    url.indexOf("github.com") > 0 &&
    url.replace(/\?.*/i, "").endsWith("/files")
  );
}
