import { createClient } from "contentful";

export const contentfulClient = createClient({
  space: import.meta.env.PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.PUBLIC_CONTENTFUL_ACCESS_TOKEN,
});

interface GetEntriesOptions {
  filter?: Record<string, any>;
  limit?: number;
  skip?: number;
  order?: string;
}

const cache: Record<string, { data: any[]; timestamp: number }> = {};
const CACHE_TTL = 1000 * 60 * 5; // 5 minutos

/**
 * Genera una clave única para la caché basada en el contentType
 * y todos los parámetros de la consulta.
 */
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

export async function getEntries<T = any>(
  contentType: string,
  options: GetEntriesOptions = {},
): Promise<T[]> {
  const cacheKey = buildCacheKey(contentType, options);
  const now = Date.now();

  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_TTL) {
    return cache[cacheKey].data as T[];
  }

  const query: Record<string, any> = {
    content_type: contentType,
    ...(options.filter || {}),
  };

  if (options.limit !== undefined) query.limit = options.limit;
  if (options.skip !== undefined) query.skip = options.skip;
  if (options.order !== undefined) query.order = options.order;

  const res = await contentfulClient.getEntries(query);
  cache[cacheKey] = { data: res.items, timestamp: now };

  return res.items as T[];
}
