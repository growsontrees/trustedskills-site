import { Suspense } from "react";
import { getAllSkills, getCategories, getStats } from "@/lib/skills";
import { SkillsListClient } from "@/components/SkillsListClient";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Agent Skills | TrustedSkills",
  description: "Browse all AI agent skills — humanizer, Obsidian, code runners, and more. Filter by platform, category, and verification tier.",
  alternates: {
    canonical: "https://trustedskills.dev/skills/",
  },
  openGraph: {
    title: "Browse Agent Skills | TrustedSkills",
    description: "Browse all AI agent skills — humanizer, Obsidian, code runners, and more. Filter by platform, category, and verification tier.",
    url: "https://trustedskills.dev/skills/",
  },
};

export default function SkillsPage() {
  const skills = getAllSkills();
  const categories = getCategories();
  const stats = getStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Browse Skills</h1>
        <p className="text-gray-400">
          {stats.total_skills} skills available · {(stats.total_installs / 1000).toFixed(1)}k total installs
        </p>
      </div>

      {/* Server-rendered skill links — crawlable by search engines, hidden visually */}
      <nav aria-label="All skills index" className="sr-only">
        <ul>
          {skills.map((skill) => (
            <li key={skill.slug}>
              <Link href={`/skills/${skill.slug}/`}>
                {skill.name} — {skill.description}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Suspense fallback={<div className="text-gray-500 py-12 text-center">Loading skills...</div>}>
        <SkillsListClient
          skills={skills}
          categories={categories}
        />
      </Suspense>
    </div>
  );
}
