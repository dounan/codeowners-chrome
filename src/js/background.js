chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
  if (isPrFilesPage(details.url)) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      tabs[0] && chrome.tabs.sendMessage(tabs[0].id, {type: "injectButton"});
    });
  }
});

function isPrFilesPage(url) {
  return (
    url &&
    url.indexOf("github.com") > 0 &&
    url.replace(/\?.*/i, "").endsWith("/files")
  );
}
