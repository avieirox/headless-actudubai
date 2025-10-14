import Container from "@/components/Container";
import { wpRequestWithSeoFallback } from "@/lib/wpClient";
import { ALL_POSTS_WITH_CATEGORY_SLUGS, POST_BY_SLUG_QUERY, POST_BY_SLUG_QUERY_NO_SEO } from "@/lib/wpQueries";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { renderShortcodes } from "@/lib/shortcodes";
import RichContent from "@/components/RichContent";

export const revalidate = 60;

type Img = { sourceUrl: string; altText?: string | null; mediaDetails?: { width?: number; height?: number } | null };
type TaxNode = { id: string; name: string; slug: string };
type PostDetail = {
  id: string;
  slug: string;
  title: string;
  content?: string | null;
  date: string;
  featuredImage?: { node?: Img | null } | null;
  categories?: { nodes: TaxNode[] };
  tags?: { nodes: TaxNode[] };
  seo?: {
    title?: string | null;
    metaDesc?: string | null;
    opengraphType?: string | null;
    opengraphTitle?: string | null;
    opengraphDescription?: string | null;
    opengraphImage?: { mediaItemUrl?: string | null } | null;
  } | null;
};

async function getPost(slug: string): Promise<PostDetail | null> {
  const data = await wpRequestWithSeoFallback<{ post: PostDetail | null }>(
    POST_BY_SLUG_QUERY,
    POST_BY_SLUG_QUERY_NO_SEO,
    { slug }
  );
  return data?.post ?? null;
}

export async function generateStaticParams() {
  const data = await wpRequestWithSeoFallback<{ posts: { nodes: { slug: string; categories?: { nodes?: { slug: string }[] } }[] } }>(
    ALL_POSTS_WITH_CATEGORY_SLUGS,
    ALL_POSTS_WITH_CATEGORY_SLUGS
  );
  const posts = data?.posts?.nodes ?? [];
  const params: Array<{ category: string; slug: string }> = [];
  for (const p of posts) {
    const cat = p.categories?.nodes?.[0]?.slug;
    if (cat) params.push({ category: cat, slug: p.slug });
  }
  return params;
}

export async function generateMetadata({ params }: { params: { category: string; slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return {};
  const seo = post.seo;
  const title = seo?.title ?? post.title;
  const description = seo?.metaDesc ?? undefined;
  const ogTitle = seo?.opengraphTitle ?? seo?.title ?? post.title;
  const ogDescription = seo?.opengraphDescription ?? seo?.metaDesc ?? undefined;
  const ogImage = seo?.opengraphImage?.mediaItemUrl;
  return {
    title,
    description,
    openGraph: {
      type: (seo?.opengraphType as any) ?? "article",
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function PostByCategoryPage({ params }: { params: { category: string; slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) return notFound();

  const img = post.featuredImage?.node;
  const date = new Date(post.date).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <Container>
      <article className="mx-auto max-w-3xl">
        <header className="mb-6">
          <h1 className="text-3xl font-bold leading-tight mb-2">{post.title}</h1>
          <p className="text-sm text-gray-500">{date}</p>
          {post.categories?.nodes?.length ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {post.categories.nodes.map((c) => (
                <span key={c.slug} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                  {c.name}
                </span>
              ))}
            </div>
          ) : null}
        </header>

        {img?.sourceUrl && (
          <div className="mb-6 overflow-hidden rounded-xl">
            <Image
              src={img.sourceUrl}
              alt={img.altText || post.title}
              width={img.mediaDetails?.width || 1200}
              height={img.mediaDetails?.height || 630}
              className="h-auto w-full object-cover"
              priority={false}
            />
          </div>
        )}

        {post.content ? (
          <RichContent
            className="article-content prose prose-slate dark:prose-invert lg:prose-lg max-w-none prose-headings:font-heading prose-img:rounded-xl prose-a:decoration-1 hover:prose-a:underline"
            html={renderShortcodes(post.content)}
          />
        ) : (
          <p className="text-gray-600">This article has no content available.</p>
        )}
      </article>
    </Container>
  );
}
