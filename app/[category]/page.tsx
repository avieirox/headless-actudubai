import Container from "@/components/Container";
import PostCard, { type Post as CardPost } from "@/components/PostCard";
import { wpRequest } from "@/lib/wpClient";
import { ALL_CATEGORY_SLUGS_QUERY, POSTS_BY_CATEGORY_SLUG_QUERY, CATEGORY_BY_SLUG_QUERY } from "@/lib/wpQueries";
import type { Metadata } from "next";

export const revalidate = 60;

type PostsByCategoryRes = { posts: { nodes: CardPost[] } };

export async function generateStaticParams() {
  const data = await wpRequest<{ categories: { nodes: { slug: string }[] } }>(ALL_CATEGORY_SLUGS_QUERY);
  return (data?.categories?.nodes ?? []).map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const details = await wpRequest<{ category: { name?: string | null; description?: string | null } | null }>(
    CATEGORY_BY_SLUG_QUERY,
    { slug: params.category }
  );
  const name = details?.category?.name || params.category;
  const description = details?.category?.description || `Articles in the ${name} category`;
  return { title: `${name} | ACTU Dubai`, description };
}

export default async function CategoryIndexPage({ params }: { params: { category: string } }) {
  const [{ category }, data] = await Promise.all([
    wpRequest<{ category: { name?: string | null } | null }>(CATEGORY_BY_SLUG_QUERY, { slug: params.category }),
    wpRequest<PostsByCategoryRes>(POSTS_BY_CATEGORY_SLUG_QUERY, { slug: params.category }),
  ]);
  const displayName = category?.name || params.category;
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
