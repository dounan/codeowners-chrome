async function getTeamNames(owner, username) {
    const result = await fetch(`https://github.com/orgs/${owner}/teams?query=%40${username}`, {
        credentials: 'include',
      });
    if (!result.ok) {
        throw new Error(`Failed to load teams (status: ${result.status})`);
    }
    const responseText = await result.text();;
    const doc = new DOMParser().parseFromString(responseText, "text/html");
    // NOTE: DOMParser fails silently and returns an error document. Just gonna ignore that for now...
    return [...doc.querySelectorAll('.js-team-row')].map(e => e.getAttribute('data-bulk-actions-id'));
}

export default getTeamNames;
