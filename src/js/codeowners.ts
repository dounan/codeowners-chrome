import {fetchDom} from "./dom";

const POSSIBLE_DIRS = ["/", "/docs/", "/.github/"];

const codeownersCache: {[index: string]: string} = {};

export async function loadCodeownersContent(prInfo: {
  organization: string;
  repo: string;
  baseBranch: string;
}): Promise<string> {
  const {organization, repo, baseBranch} = prInfo;
  const key = `${organization}/${repo}/${baseBranch}`;
  if (codeownersCache[key] == null) {
    codeownersCache[key] = await POSSIBLE_DIRS.reduce(
      (promise, directory) =>
        promise.catch(() =>
          fetchCodeownersContent(
            `https://github.com/${organization}/${repo}/blob/${baseBranch}${directory}CODEOWNERS`,
          ),
        ),
      <Promise<string>>Promise.reject(""),
    ).catch(() => "");
  }
  return codeownersCache[key];
}

async function fetchCodeownersContent(url: string): Promise<string> {
  const doc = await fetchDom(url);
  return Array.from(
    doc.querySelectorAll("table.js-file-line-container td.js-file-line"),
  )
    .map(e => e.innerHTML)
    .join("\n");
}

export function getFilterPatterns(
  codeownersContent: string,
  owners: Array<string>,
): Array<string> {
  const parsed = parseCodeowners(codeownersContent);
  const ownedRows = filterRowsByOwned(parsed, owners);
  return ownedRows.map((row: Array<string>) => row[0]);
}

type ParsedCodeowners = Array<Array<string>>;

// Return an array of [gitignorePattern, ...owners]
function parseCodeowners(codeownersContent: string): ParsedCodeowners {
  if (!codeownersContent) {
    return [];
  }
  return codeownersContent
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0 && line[0] !== "#")
    .map(line => line.split(/\s+/));
}

// Filters the parsed codeowners down to the rows that match owners
function filterRowsByOwned(
  codeownerRows: ParsedCodeowners,
  owners: Array<string>,
): ParsedCodeowners {
  return codeownerRows.filter(row =>
    row.slice(1).some(name => owners.includes(name)),
  );
}
