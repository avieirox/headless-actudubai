import { GraphQLClient } from "graphql-request";

export const wpClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_WP_GRAPHQL_URL!,
  { fetch }
);

export async function wpRequest<T>(query: string, variables?: Record<string, any>) {
  return wpClient.request<T>(query, variables ?? {});
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
