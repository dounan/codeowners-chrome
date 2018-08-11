import {filterByCodeowners} from './codeowners';
import {getAllFilepaths, showAllFiles, showSelectedFiles} from './uiHelpers';

let globalBtnId = 1;

class ButtonManager {
    constructor(owners, codeownersContent) {
        this._owners = owners;
        this._codeownersContent = codeownersContent;

        // I think github does some weird things when switching between pages,
        // so need to use ids to find the button instead of direct button reference.
        this._buttonId = `codeowner-ext-btn-${globalBtnId}`;
        globalBtnId++;

        this._observer = null;
        this._isShowingMyFiles = false;
        this._cachedMyFiles = filterByCodeowners({
            allFilepaths: getAllFilepaths(),
            codeownersContent,
            owners,
        });
    }

    mount() {
        const button = document.createElement('button');
        button.id = this._buttonId;
        setButtonStyle(button, this._isShowingMyFiles);
        // Need to add button to DOM before setting events on it.
        injectButtonToDom(button);

        if (!!this._codeownersContent) {
            const observedElem = document.querySelector('#files');
            if (observedElem) {
                this._observer = new MutationObserver(this.handleMutation.bind(this));
                this._observer.observe(observedElem, {childList: true, subtree: true});
            }
            button.onclick = () => {
                this._isShowingMyFiles = !this._isShowingMyFiles;
                this.applyFilter();
                setButtonStyle(button, this._isShowingMyFiles);
            }
        } else {
            button.onclick = () => {
                const url = chrome.extension.getURL('popup/popup.html');
                const w = window.open(url, '_blank', 'width=500,height=400,0,status=0');
            };
        }
    }

    unmount() {
        const button = document.querySelector(`#${this._buttonId}`);
        if (button) {
            button.remove();
        }
        if (this._observer) {
            this._observer.disconnect();
        }
    }

    applyFilter() {
        this._isShowingMyFiles ? showSelectedFiles(this._cachedMyFiles) : showAllFiles();
    }

    handleMutation(mutationsList) {
        this._cachedMyFiles = filterByCodeowners({
            allFilepaths: getAllFilepaths(),
            codeownersContent: this._codeownersContent,
            owners: this._owners,
        });
        if (this._isShowingMyFiles) {
            this.applyFilter();
        }
    }
}

export default ButtonManager;

function setButtonStyle(button, isShowingMyFiles) {
    button.className = 'diffbar-item btn btn-sm btn-secondary tooltipped tooltipped-s codeowners-btn';
    button.innerHTML = isShowingMyFiles ? 'Show all files' : 'Show my files';
    button.setAttribute(
        'aria-label', isShowingMyFiles ? 'Remove CODEOWNERS filter' : 'Filter files based on CODEOWNERS'
    );
}

function getButtonText(isShowingMyFiles) {
    return isShowingMyFiles ? 'Show all files' : 'Show my files';
};

function injectButtonToDom(btn) {
    const container = document.querySelector(
        '#files_bucket > div.pr-toolbar.js-sticky.js-sticky-offset-scroll > div > div.float-right.pr-review-tools',
    );
    if (!container) {
        throw new Error("Could not find container to insert button");
    }
    container.insertBefore(btn, container.firstChild);
};
