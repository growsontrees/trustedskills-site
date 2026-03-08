import { NextRequest, NextResponse } from "next/server";
import { getAllSkills } from "@/lib/skills";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").toLowerCase().trim();
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));

  const allSkills = getAllSkills();

  const filtered = q
    ? allSkills.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q)) ||
          s.category.toLowerCase().includes(q)
      )
    : allSkills;

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;

  const results = filtered.slice(offset, offset + limit).map((s) => ({
    slug: s.slug,
    name: s.name,
    description: s.description,
    category: s.category,
    tags: s.tags,
    emoji: s.emoji,
    author: s.author,
    installs: s.installs,
    verified: s.verified,
    platforms: s.platforms,
    installCmd: s.installCmd,
    repoUrl: s.repoUrl,
    version: s.version,
    updated_at: s.updated_at,
  }));

  return NextResponse.json({
    results,
    page,
    limit,
    total,
    totalPages,
    query: q || null,
  });
}
