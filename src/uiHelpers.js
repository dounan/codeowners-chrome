export function getCurrentUsername() {
    const elements = document.querySelectorAll('meta[name="user-login"]');
    if (elements.length === 0) {
        return null;
    } else if (elements.length > 1) {
        throw new Error(`Expected at most 1 element but found ${elements.length} elements`);
    }
    return elements[0].content;
}

export function getAllFilepaths() {
    return [...document.querySelectorAll('#files .file-info > a')].map(e => e.innerHTML);
}

export function showAllFiles() {
    document.querySelectorAll('#files > div > div').forEach(elem => {
        elem.style.display = 'block';
    });
}

export function showSelectedFiles(selectedFilenames) {
    document.querySelectorAll('#files .js-details-container').forEach(elem => {
        const nameElem = elem.querySelector('.file-info > a');
        if (nameElem) {
            elem.style.display = selectedFilenames.includes(nameElem.title) ? 'block' : 'none';
        }
    });
};
