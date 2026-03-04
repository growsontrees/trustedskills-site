import { getAllSkills, getCategories, getStats } from "@/lib/skills";
import { SkillsListClient } from "@/components/SkillsListClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Skills",
  description: "Browse all AI agent skills. Filter by platform, category, and verification tier.",
};

export default function SkillsPage({
  searchParams,
}: {
  searchParams: { q?: string; tier?: string; category?: string };
}) {
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
      <SkillsListClient
        skills={skills}
        categories={categories}
        initialQuery={searchParams.q ?? ""}
        initialTier={searchParams.tier ?? "all"}
        initialCategory={searchParams.category ?? "all"}
      />
    </div>
  );
}
