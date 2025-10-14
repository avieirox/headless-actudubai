import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }
  const path = req.nextUrl.searchParams.get("path") || "/";
  revalidatePath(path);
  return NextResponse.json({ revalidated: true, path });
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-revalidate-secret") || req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const unique = new Set<string>();
  // Siempre revalidar Home
  unique.add("/");

  const { slug, category, paths } = body || {};
  if (slug && category) unique.add(`/${category}/${slug}`);
  if (category) {
    unique.add(`/${category}`); // nueva ruta de categoría sin prefijo
    unique.add(`/categoria/${category}`); // compatibilidad hacia atrás
  }
  if (Array.isArray(paths)) {
    for (const p of paths) if (typeof p === "string" && p.startsWith("/")) unique.add(p);
  }

  for (const p of unique) revalidatePath(p);

  return NextResponse.json({ revalidated: true, paths: Array.from(unique) });
}
