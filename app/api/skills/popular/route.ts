import { NextRequest, NextResponse } from "next/server";
import { getAllSkills } from "@/lib/skills";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(200, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));

  const allSkills = getAllSkills();

  const popular = [...allSkills]
    .sort((a, b) => b.installs - a.installs)
    .slice(0, limit)
    .map((s) => ({
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

  return NextResponse.json({ results: popular, limit, total: popular.length });
}
