import ButtonManager from './ButtonManager';
import {loadCodeownersContent} from './codeowners';
import getTeamNames from './getTeamNames';
import {getCurrentUsername} from './uiHelpers';

injectButton();

chrome.runtime.onMessage.addListener(function(request, sender) {
    switch (request.type) {
        case 'injectButton':
            return injectButton();
    }
});

let curButtonManager = null;

async function injectButton() {
    if (!isPrFilesPage()) {
        return;
    }
    const username = getCurrentUsername();
    if (username) {
        const {owner, repo} = getPullRequestDetails();
        const teamNames = await getTeamNames(owner, username);
        const owners = toOwners(owner, username, teamNames);
        const codeownersContent = await loadCodeownersContent(owner, repo);
        ejectButton();
        curButtonManager = new ButtonManager(owners, codeownersContent);
        curButtonManager.mount();
    }
};

function ejectButton() {
    if (curButtonManager) {
        curButtonManager.unmount();
        curButtonManager = null;
    }
}

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
