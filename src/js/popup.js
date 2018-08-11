const codeownersInput = document.getElementById("codeowners_content");

document
  .getElementById("save_codeowners_content")
  .addEventListener("click", saveCodeownersContent);

chrome.storage.sync.get("default_codeowners", ({default_codeowners}) => {
  if (!default_codeowners) {
    return;
  }
  codeownersInput.value = default_codeowners;
});

function saveCodeownersContent() {
  const default_codeowners = codeownersInput.value;
  chrome.storage.sync.set({default_codeowners}, handleSaveSuccess);
}

function handleSaveSuccess() {
  chrome.tabs.query({active: true}, function(tabs) {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, {type: "injectButton"});
    });
    window.close();
  });
}
