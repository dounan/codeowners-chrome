export function getCurrentUsername(): string | null {
  const elements = document.querySelectorAll('meta[name="user-login"]');
  if (elements.length === 0) {
    return null;
  } else if (elements.length > 1) {
    throw new Error(
      `Expected at most 1 user-login but found ${elements.length}`,
    );
  }
  return (<HTMLMetaElement>elements[0]).content;
}

export function getAllFilepaths(): Array<string> {
  return Array.from(document.querySelectorAll("#files .file-info > a")).map(
    e => e.innerHTML,
  );
}

const PR_INFO_REGEX = /^([a-zA-Z0-9-_]+?)\/([a-zA-Z0-9-_]+?):(.+)$/;

export function getPrInfo(): {
  organization: string;
  repo: string;
  baseBranch: string;
} {
  const elements = document.querySelectorAll(".base-ref");
  if (elements.length !== 1) {
    throw new Error(
      `Expected exactly 1 .base-ref but found ${elements.length}`,
    );
  }
  const infoStr = (<HTMLElement>elements[0]).title;
  const m = infoStr.match(PR_INFO_REGEX);
  if (m == null) {
    throw new Error(`Unexpected PR info ${infoStr}`);
  }
  return {
    organization: m[1],
    repo: m[2],
    baseBranch: m[3],
  };
}

export function injectButtonToDom(button: Element): void {
  const container = document.querySelector(
    "#files_bucket > div.pr-toolbar.js-sticky.js-sticky-offset-scroll > div > div.float-right.pr-review-tools",
  );
  if (!container) {
    throw new Error("Could not find container to insert button");
  }
  container.insertBefore(button, container.firstChild);
}

export function showAllFiles(): void {
  Array.from(document.querySelectorAll("#files > div > div")).forEach(elem => {
    (<HTMLElement>elem).style.display = "block";
  });
}

export function showSelectedFiles(selectedFilenames: Array<string>): void {
  Array.from(document.querySelectorAll("#files .js-details-container")).forEach(
    elem => {
      const nameElem: HTMLElement | null = elem.querySelector(".file-info > a");
      if (nameElem != null) {
        (<HTMLElement>elem).style.display = selectedFilenames.includes(
          nameElem.title,
        )
          ? "block"
          : "none";
      }
    },
  );
}
