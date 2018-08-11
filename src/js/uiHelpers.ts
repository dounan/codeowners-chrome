export function getCurrentUsername(): string | null {
  const elements = document.querySelectorAll('meta[name="user-login"]');
  if (elements.length === 0) {
    return null;
  } else if (elements.length > 1) {
    throw new Error(
      `Expected at most 1 element but found ${elements.length} elements`,
    );
  }
  return (<HTMLMetaElement>elements[0]).content;
}

export function getAllFilepaths(): Array<string> {
  return Array.from(document.querySelectorAll("#files .file-info > a")).map(
    e => e.innerHTML,
  );
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
