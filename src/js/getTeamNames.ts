async function getTeamNames(
  organization: string,
  username: string,
): Promise<Array<string>> {
  const result = await fetch(
    `https://github.com/orgs/${organization}/teams?query=%40${username}`,
    {
      credentials: "include",
    },
  );
  if (!result.ok) {
    throw new Error(`Failed to load teams (status: ${result.status})`);
  }
  const responseText = await result.text();
  const doc = new DOMParser().parseFromString(responseText, "text/html");
  // TODO: handle DOMParser failing silently and returning an error document
  const arr = Array.from(doc.querySelectorAll(".js-team-row"));
  return Array.from(doc.querySelectorAll(".js-team-row"))
    .map(e => e.getAttribute("data-bulk-actions-id"))
    .filter(notNull);
}

function notNull<T>(value: T | null | undefined): value is T {
  return value != null;
}

export default getTeamNames;
