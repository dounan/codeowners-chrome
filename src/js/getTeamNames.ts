import {fetchDom} from "./dom";

export default async function getTeamNames(
  organization: string,
  username: string,
): Promise<Array<string>> {
  const doc = await fetchDom(
    `https://github.com/orgs/${organization}/teams?query=%40${username}`,
  );
  const arr = Array.from(doc.querySelectorAll(".js-team-row"));
  return Array.from(doc.querySelectorAll(".js-team-row"))
    .map(e => e.getAttribute("data-bulk-actions-id"))
    .filter(notNull);
}

function notNull<T>(value: T | null | undefined): value is T {
  return value != null;
}
