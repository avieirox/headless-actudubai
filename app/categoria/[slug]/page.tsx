import Container from "@/components/Container";
import PostCard, { type Post as CardPost } from "@/components/PostCard";
import { wpRequest } from "@/lib/wpClient";
import { ALL_CATEGORY_SLUGS_QUERY, POSTS_BY_CATEGORY_SLUG_QUERY } from "@/lib/wpQueries";
import type { Metadata } from "next";

export const revalidate = 60;

type PostsByCategoryRes = { posts: { nodes: CardPost[] } };

export async function generateStaticParams() {
  const data = await wpRequest<{ categories: { nodes: { slug: string }[] } }>(ALL_CATEGORY_SLUGS_QUERY);
  return (data?.categories?.nodes ?? []).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Categoría: ${slug} | ACTU Dubai`,
    description: `Artículos de la categoría ${slug}`,
  };
}

export default async function CategoriaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await wpRequest<PostsByCategoryRes>(POSTS_BY_CATEGORY_SLUG_QUERY, { slug });
  const posts = data?.posts?.nodes ?? [];

  return (
    <Container>
      <h2 className="mb-6 text-xl font-semibold">Categoría: {slug}</h2>
      {posts.length === 0 ? (
        <p className="text-gray-600">No hay artículos en esta categoría.</p>
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
