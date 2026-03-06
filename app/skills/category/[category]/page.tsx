import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Pagination } from "@/components/Pagination";
import { SkillCard } from "@/components/SkillCard";
import { getAllSkills, getCategories, getCategoryBySlug } from "@/lib/skills";

const SKILLS_PER_PAGE = 24;
const SITE_URL = "https://trustedskills.dev";

interface PageProps {
  params: Promise<{ category: string }>;
}

function getCategoryPageData(categorySlug: string) {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return null;

  const skills = getAllSkills()
    .filter((skill) => skill.category === category.slug)
    .sort((a, b) => b.installs - a.installs);

  const totalPages = Math.max(1, Math.ceil(skills.length / SKILLS_PER_PAGE));
  const paginatedSkills = skills.slice(0, SKILLS_PER_PAGE);

  return {
    category,
    skills,
    paginatedSkills,
    totalPages,
    currentPage: 1,
    basePath: `/skills/category/${category.slug}`,
  };
}

export async function generateStaticParams() {
  return getCategories().map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const data = getCategoryPageData(categorySlug);

  if (!data) {
    return {};
  }

  return {
    title: `${data.category.name} Agent Skills`,
    description: `Browse ${data.category.count} ${data.category.name.toLowerCase()} agent skills on TrustedSkills. Page 1 of ${data.totalPages}.`,
    alternates: {
      canonical: `${SITE_URL}${data.basePath}/`,
    },
    openGraph: {
      title: `${data.category.name} Agent Skills | TrustedSkills`,
      description: `Browse ${data.category.count} ${data.category.name.toLowerCase()} agent skills on TrustedSkills.`,
      url: `${SITE_URL}${data.basePath}/`,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: categorySlug } = await params;
  const data = getCategoryPageData(categorySlug);

  if (!data) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link
          href="/skills"
          className="text-sm text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1"
        >
          ← Back to Skills
        </Link>
      </div>

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{data.category.emoji}</span>
          <div>
            <h1 className="text-3xl font-bold text-white">{data.category.name} Skills</h1>
            <p className="text-gray-400">
              {data.skills.length} skills in this category · Page {data.currentPage} of {data.totalPages}
            </p>
          </div>
        </div>
        <p className="text-gray-500 max-w-3xl">
          Browse the most popular {data.category.name.toLowerCase()} skills on TrustedSkills.
        </p>
      </header>

      <nav aria-label={`${data.category.name} skills index`} className="sr-only">
        <ul>
          {data.paginatedSkills.map((skill) => (
            <li key={skill.slug}>
              <Link href={`/skills/${skill.slug}/`}>
                {skill.name} — {skill.description}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {data.paginatedSkills.map((skill) => (
          <SkillCard key={skill.slug} skill={skill} />
        ))}
      </div>

      <Pagination
        currentPage={data.currentPage}
        totalPages={data.totalPages}
        basePath={data.basePath}
      />
    </div>
  );
}
