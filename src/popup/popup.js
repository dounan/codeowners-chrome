const codeownersInput = document.getElementById('codeowners_content');

const handleSuccess = () => window.close();

const saveCodeownersContent = () => {
  const default_codeowners = codeownersInput.value;
  chrome.storage.sync.set({ default_codeowners }, handleSuccess);
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    tabs[0] && chrome.tabs.sendMessage(tabs[0].id, {type: 'injectButton'});
  });
}

document.getElementById('save_codeowners_content').addEventListener('click', saveCodeownersContent);

chrome.storage.sync.get('default_codeowners', ({default_codeowners}) => {
  if (!default_codeowners) {
    return;
  }

  codeownersInput.value = default_codeowners;
});
