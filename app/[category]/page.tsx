import Container from "@/components/Container";
import PostCard, { type Post as CardPost } from "@/components/PostCard";
import { wpRequest, wpRequestWithSeoFallback } from "@/lib/wpClient";
import { ALL_CATEGORY_SLUGS_QUERY, POSTS_BY_CATEGORY_SLUG_QUERY, CATEGORY_BY_SLUG_QUERY, CATEGORY_BY_SLUG_WITH_SEO_QUERY } from "@/lib/wpQueries";
import type { Metadata } from "next";

export const revalidate = 60;

type PostsByCategoryRes = { posts: { nodes: CardPost[] } };

export async function generateStaticParams() {
  try {
    const data = await wpRequest<{ categories: { nodes: { slug: string }[] } }>(ALL_CATEGORY_SLUGS_QUERY);
    return (data?.categories?.nodes ?? []).map((c) => ({ category: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const details = await wpRequestWithSeoFallback<{
    category: { name?: string | null; description?: string | null; seo?: { title?: string | null; metaDesc?: string | null; opengraphTitle?: string | null; opengraphDescription?: string | null } | null } | null;
  }>(CATEGORY_BY_SLUG_WITH_SEO_QUERY, CATEGORY_BY_SLUG_QUERY, { slug: categorySlug });
  const cat = details?.category;
  const name = cat?.name || categorySlug;
  const seo = cat?.seo as any;
  const title = (seo?.title as string) || `${name} | ACTU Dubai`;
  const description = (seo?.metaDesc as string) || cat?.description || `Articles in the ${name} category`;
  return {
    title,
    description,
    openGraph: seo ? {
      title: (seo?.opengraphTitle as string) || (seo?.title as string) || title,
      description: (seo?.opengraphDescription as string) || (seo?.metaDesc as string) || description,
      type: "website",
    } : undefined,
  };
}

export default async function CategoryIndexPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = await params;
  const [{ category }, data] = await Promise.all([
    wpRequest<{ category: { name?: string | null } | null }>(CATEGORY_BY_SLUG_QUERY, { slug: categorySlug }),
    wpRequest<PostsByCategoryRes>(POSTS_BY_CATEGORY_SLUG_QUERY, { slug: categorySlug }),
  ]);
  const displayName = category?.name || categorySlug;
  const posts = data?.posts?.nodes ?? [];

  return (
    <Container>
      <h2 className="mb-6 text-xl font-semibold">{displayName}</h2>
      {posts.length === 0 ? (
        <p className="text-gray-600">No articles in this category.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      )}
    </Container>
  );
}
