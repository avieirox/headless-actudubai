import { NextRequest, NextResponse } from "next/server";
import { yahooRequest } from "@/lib/market/yahoo";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const path = searchParams.get("path");
  if (!path) return NextResponse.json({ error: "Missing path" }, { status: 400 });

  const params: Record<string, string> = {};
  for (const [k, v] of searchParams.entries()) {
    if (k === "path") continue;
    params[k] = v;
  }

  try {
    const data = await yahooRequest<any>(path, params);
    return NextResponse.json(data, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Request failed" }, { status: 500 });
  }
}

