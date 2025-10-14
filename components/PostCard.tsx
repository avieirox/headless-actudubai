import Image from "next/image";
import Link from "next/link";

type Img = { sourceUrl: string; altText?: string; mediaDetails?: { width?: number; height?: number } };
type TaxNode = { id: string; name: string; slug: string };
export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  featuredImage?: { node?: Img | null } | null;
  categories?: { nodes: TaxNode[] };
};

export default function PostCard({ post }: { post: Post }) {
  const img = post.featuredImage?.node;
  const date = new Date(post.date).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <article className="rounded-2xl border p-4 shadow-sm hover:shadow-md transition">
      {img?.sourceUrl && (
        <div className="mb-3 overflow-hidden rounded-xl">
          <Image
            src={img.sourceUrl}
            alt={img.altText || post.title}
            width={img.mediaDetails?.width || 800}
            height={img.mediaDetails?.height || 450}
            className="h-auto w-full object-cover"
            priority={false}
          />
        </div>
      )}
      <header className="mb-2">
        <h3 className="text-lg font-semibold leading-snug">
          {(() => {
            const primaryCat = post.categories?.nodes?.[0]?.slug;
            const href = primaryCat ? `/${primaryCat}/${post.slug}` : `/blog/${post.slug}`;
            return (
              <Link href={href} className="hover:underline">{post.title}</Link>
            );
          })()}
        </h3>
        <p className="text-sm text-gray-500">{date}</p>
      </header>
      {post.categories?.nodes?.length ? (
        <div className="mb-3 flex flex-wrap gap-2">
          {post.categories.nodes.map((c) => (
            <Link key={c.id} href={`/${c.slug}`} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 hover:bg-gray-200">
              {c.name}
            </Link>
          ))}
        </div>
      ) : null}
      {post.excerpt && (
        <div
          className="prose prose-slate dark:prose-invert prose-sm max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: post.excerpt }}
        />
      )}
    </article>
  );
}
