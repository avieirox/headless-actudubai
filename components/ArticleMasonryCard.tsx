import Link from "next/link";

type Img = { sourceUrl: string; altText?: string | null; mediaDetails?: { width?: number; height?: number } | null };
type Author = { node?: { name?: string | null; avatar?: { url?: string | null } | null } | null };

type TaxNode = { id?: string; name?: string; slug?: string };

export type MasonryPost = {
  slug: string;
  title: string;
  excerpt?: string | null;
  featuredImage?: { node?: Img | null } | null;
  author?: Author | null;
  categories?: { nodes?: TaxNode[] } | null;
};

function toPlain(text?: string | null) {
  if (!text) return "";
  // strip HTML tags and decode a few common entities
  const stripped = text.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  return stripped.replace(/\s+/g, " ").trim();
}

function shortSummary(html?: string | null, words = 24) {
  const plain = toPlain(html);
  if (!plain) return "";
  const parts = plain.split(" ");
  if (parts.length <= words) return plain;
  return parts.slice(0, words).join(" ") + "…";
}

export default function ArticleMasonryCard({ post }: { post: MasonryPost }) {
  const img = post.featuredImage?.node;
  const authorName = post.author?.node?.name ?? "";
  const authorAvatar = post.author?.node?.avatar?.url ?? "";
  const summary = shortSummary(post.excerpt, 28);
  const primaryCat = post.categories?.nodes?.[0]?.slug;
  const href = primaryCat ? `/${primaryCat}/${post.slug}` : `/blog/${post.slug}`;

  return (
    <article className="group h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm ring-1 ring-transparent transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:ring-sky-200 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:ring-sky-800">
      <Link href={href} className="block">
        <div className="relative aspect-[16/9] overflow-hidden">
          {img?.sourceUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img.sourceUrl} alt={img.altText || post.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700" />
          )}
        </div>
      </Link>
      <div className="flex h-full flex-col p-4">
        <h3 className="mb-1 text-base font-semibold leading-snug line-clamp-2">
          <Link href={href} className="hover:underline">
            {post.title}
          </Link>
        </h3>

        {summary ? (
          <p className="text-sm text-gray-700 dark:text-slate-300 line-clamp-3">{summary}</p>
        ) : null}

        <div className="mt-4 flex items-center gap-2">
          {authorAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={authorAvatar} alt={authorName || "Author"} className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-slate-700" />
          )}
          <span className="text-xs text-gray-600 dark:text-slate-400 truncate">{authorName}</span>
        </div>
      </div>
    </article>
  );
}
