import { createClient } from "contentful";

export const contentfulClient = createClient({
  space: import.meta.env.PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.PUBLIC_CONTENTFUL_ACCESS_TOKEN,
});

const cache: Record<string, { data: any[]; timestamp: number }> = {};
const CACHE_TTL = 1000 * 60 * 5; // 5 minutos

export async function getEntries(contentType: string) {
  const now = Date.now();
  if (cache[contentType] && now - cache[contentType].timestamp < CACHE_TTL) {
    return cache[contentType].data;
  }

  const res = await contentfulClient.getEntries({ content_type: contentType });
  cache[contentType] = { data: res.items, timestamp: now };
  return res.items;
}
