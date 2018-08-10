import {filterByCodeowners} from './codeowners';
import {getAllFilepaths, showAllFiles, showSelectedFiles} from './uiHelpers';

let curButtonManager = null;

function injectButton(owners, codeownersContent) {
    if (curButtonManager) {
        curButtonManager.unmount();
    }
    curButtonManager = new ButtonManager(owners, codeownersContent);
    curButtonManager.mount();
};

export default injectButton;

class ButtonManager {
    constructor(owners, codeownersContent) {
        this._owners = owners;
        this._codeownersContent = codeownersContent;

        this._button = null;
        this._observer = null;
        this._isShowingMyFiles = false;
        this._cachedMyFiles = filterByCodeowners({
            allFilepaths: getAllFilepaths(),
            codeownersContent,
            owners,
        });
    }

    mount() {
        this._button = createBaseButton(getButtonText(this._isShowingMyFiles), 'Filter files based on CODEOWNERS');
        // Need to add button to DOM before setting events on it.
        injectButtonToDom(this._button);

        if (!!this._codeownersContent) {
            const observedElem = document.querySelector('#files');
            if (observedElem) {
                this._observer = new MutationObserver(this.handleMutation.bind(this));
                this._observer.observe(observedElem, {childList: true, subtree: true});
            }
            this._button.onclick = () => {
                this._isShowingMyFiles = !this._isShowingMyFiles;
                this.applyFilter();
                this._button.innerHTML = getButtonText(this._isShowingMyFiles);
            }
        } else {
            this._button.onclick = () => {
                const url = chrome.extension.getURL('popup/popup.html');
                const w = window.open(url, '_blank', 'width=500,height=400,0,status=0');
            };
        }
    }

    unmount() {
        if (this._button) {
            this._button.remove();
            this._button = null;
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

function getButtonText(isShowingMyFiles) {
    return isShowingMyFiles ? 'Show all files' : 'Show my files';
};

function createBaseButton(text, tooltipText) {
    const button = document.createElement('button');
    button.className = 'diffbar-item btn btn-sm btn-secondary tooltipped tooltipped-s codeowners-btn';
    button.innerHTML = text;
    button.setAttribute('aria-label', tooltipText);
    return button;
};

function injectButtonToDom(btn) {
    const container = document.querySelector(
        '#files_bucket > div.pr-toolbar.js-sticky.js-sticky-offset-scroll > div > div.float-right.pr-review-tools',
    );
    container.insertBefore(btn, container.firstChild);
};
