import { wpRequest } from "@/lib/wpClient";
import { ALL_CATEGORIES_QUERY } from "@/lib/wpQueries";
import NavClient from "@/components/NavClient";

export type Cat = { id: string; name: string; slug: string; count?: number };
type CatsRes = { categories?: { nodes?: Cat[] } };

export default async function Nav({ cats: initialCats }: { cats?: Cat[] }) {
  let cats: Cat[] = initialCats ?? [];
  try {
    if (!cats.length) {
      const data = await wpRequest<CatsRes>(ALL_CATEGORIES_QUERY);
      cats = (data?.categories?.nodes || [])
        .filter((c) => (c.count ?? 0) > 0 && c.slug !== "uncategorized")
        .sort((a, b) => a.name.localeCompare(b.name));
    }
  } catch {
    cats = [];
  }

  return <NavClient cats={cats} />;
}
