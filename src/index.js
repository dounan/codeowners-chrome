import {loadCodeownersContent} from './codeowners';
import getTeamNames from './getTeamNames';
import injectButton from './injectButton';
import {getCurrentUsername} from './uiHelpers';

execute();

chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.type === 'injectButton') {
        execute()
    };
});

async function execute() {
    if (!isPrFilesPage()) {
        return;
    }
    const username = getCurrentUsername();
    if (username) {
        const {owner, repo} = getPullRequestDetails();
        const teamNames = await getTeamNames(owner, username);
        const codeownersContent = await loadCodeownersContent(owner, repo);
        injectButton(toOwners(owner, username, teamNames), codeownersContent);
    }
};

function isPrFilesPage() {
    return window.location.href.replace(/\?.*/i, '').endsWith('/files');
}

function getPullRequestDetails() {
    const pathParts = window.location.pathname.split('/');
    return {
        owner: pathParts[1],
        repo: pathParts[2],
        number: pathParts[4],
    };
};

function toOwners(owner, username, teamNames) {
    const teamOwners = teamNames.map(name => `@${owner}/${name}`);
    return [`@${username}`, ...teamOwners];
}
