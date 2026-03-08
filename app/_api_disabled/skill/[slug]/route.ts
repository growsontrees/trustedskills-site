import { NextRequest, NextResponse } from "next/server";
import { getSkillBySlug } from "@/lib/skills";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const skill = getSkillBySlug(params.slug);

  if (!skill) {
    return NextResponse.json({ error: "Skill not found" }, { status: 404 });
  }

  // Return only public fields — omit internal scoring/enrichment metadata
  return NextResponse.json({
    slug: skill.slug,
    name: skill.name,
    description: skill.description,
    category: skill.category,
    tags: skill.tags,
    emoji: skill.emoji,
    author: skill.author,
    version: skill.version,
    license: skill.license,
    homepage: skill.homepage,
    repoUrl: skill.repoUrl,
    installs: skill.installs,
    verified: skill.verified,
    verifiedAt: skill.verifiedAt,
    verifiedChangedAt: skill.verifiedChangedAt,
    verifiedCommit: skill.verifiedCommit,
    platforms: skill.platforms,
    installCmd: skill.installCmd,
    installArchiveUrl: skill.installArchiveUrl,
    requires: skill.requires,
    published_at: skill.published_at,
    updated_at: skill.updated_at,
  });
}
