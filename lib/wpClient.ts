import { GraphQLClient } from "graphql-request";

let _client: GraphQLClient | null = null;
function getClient(): GraphQLClient {
  if (_client) return _client;
  const endpoint = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL;
  if (!endpoint) {
    throw new Error("Missing NEXT_PUBLIC_WP_GRAPHQL_URL environment variable");
  }
  _client = new GraphQLClient(endpoint, { fetch });
  return _client;
}

export async function wpRequest<T>(query: string, variables?: Record<string, any>) {
  return getClient().request<T>(query, variables ?? {});
}

type GraphQLClientError = {
  response?: { errors?: Array<{ message?: string }> };
};

function isSeoFieldError(err: unknown): boolean {
  const e = err as GraphQLClientError;
  const msgs = e?.response?.errors?.map((x) => x.message || "") || [];
  return msgs.some((m) => m.includes('Cannot query field "seo"'));
}

// Intenta una query con campos SEO y cae en fallback si el esquema no los expone
export async function wpRequestWithSeoFallback<T>(
  queryWithSeo: string,
  queryNoSeo: string,
  variables?: Record<string, any>
) {
  try {
    return await wpRequest<T>(queryWithSeo, variables);
  } catch (err) {
    if (isSeoFieldError(err)) {
      return await wpRequest<T>(queryNoSeo, variables);
    }
    throw err;
  }
}

// Try multiple queries in order until one succeeds (useful for schema differences)
export async function wpTryQueries<T>(queries: string[], variables?: Record<string, any>) {
  let lastErr: any;
  for (const q of queries) {
    try {
      return await wpRequest<T>(q, variables);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}
