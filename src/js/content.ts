import {Button, FilterButton} from "./buttons";
import {loadCodeownersContent, getFilterPatterns} from "./codeowners";
import getTeamNames from "./getTeamNames";
import {getCurrentUsername, getPrInfo} from "./uiHelpers";

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
    const {organization, repo, baseBranch} = getPrInfo();
    const codeownersContent = await loadCodeownersContent({
      organization,
      repo,
      baseBranch,
    });
    if (codeownersContent.length > 0) {
      const teamNames = await getTeamNames(organization, username);
      const owners = toOwners(organization, username, teamNames);
      const filterPatterns = getFilterPatterns(codeownersContent, owners);
      if (curButton) {
        curButton.unmount();
      }
      curButton = new FilterButton(filterPatterns);
      curButton.mount();
    }
  }
}

function isPrFilesPage(): boolean {
  return window.location.href.replace(/\?.*/i, "").endsWith("/files");
}

function toOwners(
  organization: string,
  username: string,
  teamNames: Array<string>,
): Array<string> {
  const teamOwners = teamNames.map(name => `@${organization}/${name}`);
  return [`@${username}`, ...teamOwners];
}

// In case we are starting on the PR files page
injectButton();
