import {Button, FilterButton, SetCodeownersButton} from "./buttons";
import {loadCodeownersContent, getFilterPatterns} from "./codeowners";
import getTeamNames from "./getTeamNames";
import {getCurrentUsername} from "./uiHelpers";

chrome.runtime.onMessage.addListener(function(request, sender) {
  switch (request.type) {
    case "injectButton":
      return injectButton();
  }
});

let curButton: Button | null = null;

async function injectButton(): Promise<void> {
  if (!isPrFilesPage()) {
    return;
  }
  const username = getCurrentUsername();
  if (username) {
    ejectButton();
    const {owner, repo} = getPullRequestDetails();
    const codeownersContent = await loadCodeownersContent(owner, repo);
    if (codeownersContent.length > 0) {
      const teamNames = await getTeamNames(owner, username);
      const owners = toOwners(owner, username, teamNames);
      const filterPatterns = getFilterPatterns(codeownersContent, owners);
      curButton = new FilterButton(filterPatterns);
    } else {
      curButton = new SetCodeownersButton();
    }
    curButton.mount();
  }
}

function ejectButton(): void {
  if (curButton) {
    curButton.unmount();
    curButton = null;
  }
}

function isPrFilesPage(): boolean {
  return window.location.href.replace(/\?.*/i, "").endsWith("/files");
}

function getPullRequestDetails(): {
  owner: string;
  repo: string;
  number: string;
} {
  const pathParts = window.location.pathname.split("/");
  return {
    owner: pathParts[1],
    repo: pathParts[2],
    number: pathParts[4],
  };
}

function toOwners(
  owner: string,
  username: string,
  teamNames: Array<string>,
): Array<string> {
  const teamOwners = teamNames.map(name => `@${owner}/${name}`);
  return [`@${username}`, ...teamOwners];
}

// In case we are starting on the PR files page
injectButton();