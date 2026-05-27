import { createClient } from "contentful";
import type { Entry, EntrySkeletonType } from "contentful";

export const contentfulClient = createClient({
  space: import.meta.env.PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.PUBLIC_CONTENTFUL_ACCESS_TOKEN,
});

interface GetEntriesOptions {
  filter?: Record<string, any>;
  limit?: number;
  skip?: number;
  order?: string;
  select?: string;
}

const cache: Record<
  string,
  { data: Entry<any, undefined, string>[]; timestamp: number }
> = {};

const MINUTOS_DE_CACHE = 5;
const CACHE_TTL = 1000 * 60 * MINUTOS_DE_CACHE;

function buildCacheKey(
  contentType: string,
  options: GetEntriesOptions,
): string {
  const normalizedOptions: Record<string, any> = { ...options };

  if (normalizedOptions.filter) {
    const normalizedFilter: Record<string, any> = {};
    Object.entries(normalizedOptions.filter).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        normalizedFilter[key] = [...value].sort().join(",");
      } else if (typeof value === "string" && value.includes(",")) {
        normalizedFilter[key] = value
          .split(",")
          .map((v) => v.trim())
          .sort()
          .join(",");
      } else {
        normalizedFilter[key] = value;
      }
    });
    normalizedOptions.filter = normalizedFilter;
  }

  return `${contentType}:${JSON.stringify(normalizedOptions)}`;
}

export async function getEntries<T extends Record<string, any> = any>(
  contentType: string,
  options: GetEntriesOptions = {},
): Promise<Entry<EntrySkeletonType<T>, undefined, string>[]> {
  const cacheKey = buildCacheKey(contentType, options);
  const now = Date.now();

  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_TTL) {
    return cache[cacheKey].data as unknown as Entry<
      EntrySkeletonType<T>,
      undefined,
      string
    >[];
  }

  const query: Record<string, any> = {
    content_type: contentType,
    ...(options.filter || {}),
  };

  if (options.limit !== undefined) query.limit = options.limit;
  if (options.skip !== undefined) query.skip = options.skip;
  if (options.order !== undefined) query.order = options.order;
  if (options.select !== undefined) query.select = options.select;

  const res = await contentfulClient.getEntries(query);

  cache[cacheKey] = { data: res.items, timestamp: now };

  return res.items as unknown as Entry<
    EntrySkeletonType<T>,
    undefined,
    string
  >[];
}
