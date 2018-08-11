import ignore, {Ignore} from "ignore";
import {
  getAllFilepaths,
  injectButtonToDom,
  showAllFiles,
  showSelectedFiles,
} from "./uiHelpers";

export interface Button {
  mount(): void;
  unmount(): void;
}

let globalBtnId = 1;

export class AbstractButton implements Button {
  _buttonId: string;

  constructor() {
    // I think github does some weird things when switching between pages,
    // so need to use ids to find the button instead of direct button reference.
    this._buttonId = `codeowner-ext-btn-${globalBtnId}`;
    globalBtnId++;
  }

  mount() {
    const button = document.createElement("button");
    button.id = this._buttonId;
    // Need to add button to DOM before setting events on it.
    injectButtonToDom(button);
    this.initializeButton(button);
  }

  unmount() {
    const button = document.querySelector(`#${this._buttonId}`);
    if (button) {
      button.remove();
    }
  }

  initializeButton(button: HTMLButtonElement): void {
    throw new Error("Implement me!");
  }
}

export class FilterButton extends AbstractButton {
  _observer: MutationObserver | null;
  _isFiltering: boolean;
  _ignoreUtil: Ignore;
  _cachedFilteredFiles: Array<string> | null;

  constructor(filterPatterns: Array<string>) {
    super();
    this._observer = null;
    this._isFiltering = false;
    this._ignoreUtil = ignore().add(filterPatterns);
    this._cachedFilteredFiles = null;
  }

  mount(): void {
    super.mount();
    const observedElem = document.querySelector("#files");
    if (observedElem) {
      this._observer = new MutationObserver(this.handleMutation.bind(this));
      this._observer.observe(observedElem, {childList: true, subtree: true});
    }
  }

  unmount(): void {
    super.unmount();
    if (this._observer) {
      this._observer.disconnect();
    }
  }

  initializeButton(button: HTMLButtonElement): void {
    setFilterButtonStyle(button, this._isFiltering);
    button.onclick = () => {
      this._isFiltering = !this._isFiltering;
      this.applyFilter();
      setFilterButtonStyle(button, this._isFiltering);
    };
  }

  applyFilter(): void {
    this._isFiltering
      ? showSelectedFiles(this.getFilteredFiles())
      : showAllFiles();
  }

  getFilteredFiles(): Array<string> {
    if (this._cachedFilteredFiles == null) {
      this._cachedFilteredFiles = getAllFilepaths().filter(x =>
        this._ignoreUtil.ignores(x),
      );
    }
    return this._cachedFilteredFiles;
  }

  handleMutation(mutationsList: Array<MutationRecord>): void {
    this._cachedFilteredFiles = null;
    if (this._isFiltering) {
      this.applyFilter();
    }
  }
}

export class SetCodeownersButton extends AbstractButton {
  initializeButton(button: HTMLButtonElement): void {
    setFilterButtonStyle(button, false);
    button.onclick = () => {
      const url = chrome.extension.getURL("popup.html");
      const w = window.open(url, "_blank", "width=500,height=400,0,status=0");
    };
  }
}

function setFilterButtonStyle(button: Element, isFiltering: boolean): void {
  button.className =
    "diffbar-item btn btn-sm btn-secondary tooltipped tooltipped-s codeowners-btn";
  button.innerHTML = isFiltering ? "Show all files" : "Show my files";
  button.setAttribute(
    "aria-label",
    isFiltering ? "Clear CODEOWNERS filter" : "Filter by CODEOWNERS",
  );
}
