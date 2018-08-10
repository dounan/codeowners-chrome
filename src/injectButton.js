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
            // TODO: add mutation observer for newly loaded files
            this._button.onclick = () => {
                this._isShowingMyFiles = !this._isShowingMyFiles;
                this._isShowingMyFiles ? showSelectedFiles(this._cachedMyFiles) : showAllFiles();
                this._button.innerHTML = getButtonText(this._isShowingMyFiles);
            }
        } else {
            this._button.onclick = () => {
                const url = chrome.extension.getURL('popup/popup.html');
                const w = window.open(url, '_blank', 'width=350,height=300,0,status=0');
            };
        }
    }

    unmount() {
        if (this._button) {
            this._button.remove();
            this._button = null;
        }
        // TODO: cleanup mutation observer
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
