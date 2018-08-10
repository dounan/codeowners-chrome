const codeownerFiles = {};

export async function loadCodeownersContent(owner, repo) {
    return new Promise(function(resolve) {
        chrome.storage.sync.get('default_codeowners', ({default_codeowners}) => {
            resolve(default_codeowners);
        });
    });
}

export function filterMyFilenames({
    allFilenames,
    codeownersContent,
    teamNames,
    username,
}) {
    // TODO
    return [];
}
