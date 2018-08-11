const codeownersInput = <HTMLInputElement>(
  ensureElementById("codeowners_content")
);

ensureElementById("save_codeowners_content").addEventListener(
  "click",
  saveCodeownersContent,
);

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
      tab.id != null && chrome.tabs.sendMessage(tab.id, {type: "injectButton"});
    });
    window.close();
  });
}

function ensureElementById(id: string): HTMLElement {
  const elem = document.getElementById(id);
  if (elem == null) {
    throw new Error(`Could not find element "#${id}"`);
  }
  return elem;
}
