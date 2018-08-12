export async function fetchDom(url: string): Promise<Document> {
  const result = await fetch(url, {credentials: "include"});
  if (!result.ok) {
    throw new Error(`Failed to fetch DOM at ${url} (status: ${result.status})`);
  }
  return parseDom(await result.text());
}

export function parseDom(text: string): Document {
  const doc = new DOMParser().parseFromString(text, "text/html");
  // TODO: handle DOMParser failing silently and returning an error document
  return doc;
}
