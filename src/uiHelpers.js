export function getCurrentUsername() {
    const elements = document.querySelectorAll('meta[name="user-login"]');
    if (elements.length === 0) {
        return null;
    } else if (elements.length > 1) {
        throw new Error(`Expected at most 1 element but found ${elements.length} elements`);
    }
    return elements[0].content;
}

export function getAllFilenames() {
    return [...document.querySelectorAll('.file-info a')].map(e => e.innerHTML);
}

export function showAllFiles() {
    document.querySelectorAll('#files > div > div').forEach(elem => {
        elem.style.display = 'block';
    });
}

export function showSelectedFiles(selectedFilenames) {
    document.querySelectorAll('#files > div > div').forEach(elem => {
        const filename = elem.querySelector('div.file-header.js-file-header > div.file-info > a').title;
        elem.style.display = selectedFilenames.includes(filename) ? 'block' : 'none';
    });
};
