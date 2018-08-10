import ignore from 'ignore';

export async function loadCodeownersContent(owner, repo) {
    return new Promise(function(resolve) {
        chrome.storage.sync.get('default_codeowners', ({default_codeowners}) => {
            resolve(default_codeowners);
        });
    });
}

export function filterByCodeowners({
    allFilepaths,
    codeownersContent,
    owners,
}) {
    const parsed = parseCodeowners(codeownersContent);
    const ownedRows = filterRowsByOwned(parsed, owners);
    const ownedPatterns = ownedRows.map(row => row[0]);
    const ig = ignore().add(ownedPatterns);
    return allFilepaths.filter(path => ig.ignores(path));
}

// Return an array of [gitignorePattern, ...owners]
function parseCodeowners(codeownersContent) {
    if (!codeownersContent) {
        return [];
    }
    return codeownersContent.split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0 && line[0] !== "#")
      .map(line => line.split(/\s+/));
}

// Filters the parsed codeowners down to the rows that match owners
function filterRowsByOwned(codeownerRows, owners) {
    return codeownerRows.filter(row => row.slice(1).some(name => owners.includes(name)));
}
