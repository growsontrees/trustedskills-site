import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Pagination } from "@/components/Pagination";
import { SkillCard } from "@/components/SkillCard";
import { getAllSkills, getCategories, getCategoryBySlug } from "@/lib/skills";

const SKILLS_PER_PAGE = 24;
const SITE_URL = "https://trustedskills.dev";

interface PageProps {
  params: Promise<{ category: string; page: string }>;
}

function getCategoryPageData(categorySlug: string, pageValue: string) {
  const category = getCategoryBySlug(categorySlug);
  const currentPage = Number.parseInt(pageValue, 10);

  if (!category || !Number.isInteger(currentPage) || currentPage < 2) {
    return null;
  }

  const skills = getAllSkills()
    .filter((skill) => skill.category === category.slug)
    .sort((a, b) => b.installs - a.installs);

  const totalPages = Math.max(1, Math.ceil(skills.length / SKILLS_PER_PAGE));
  if (currentPage > totalPages) {
    return null;
  }

  const start = (currentPage - 1) * SKILLS_PER_PAGE;
  const paginatedSkills = skills.slice(start, start + SKILLS_PER_PAGE);

  return {
    category,
    skills,
    paginatedSkills,
    totalPages,
    currentPage,
    basePath: `/skills/category/${category.slug}`,
  };
}

export async function generateStaticParams() {
  return getCategories().flatMap((category) => {
    const skillCount = getAllSkills().filter((skill) => skill.category === category.slug).length;
    const totalPages = Math.max(1, Math.ceil(skillCount / SKILLS_PER_PAGE));

    return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({
      category: category.slug,
      page: String(index + 2),
    }));
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categorySlug, page } = await params;
  const data = getCategoryPageData(categorySlug, page);

  if (!data) {
    return {};
  }

  return {
    title: `${data.category.name} Agent Skills | Page ${data.currentPage}`,
    description: `Browse ${data.category.count} ${data.category.name.toLowerCase()} agent skills on TrustedSkills. Page ${data.currentPage} of ${data.totalPages}.`,
    alternates: {
      canonical: `${SITE_URL}${data.basePath}/page/${data.currentPage}/`,
    },
    openGraph: {
      title: `${data.category.name} Agent Skills | Page ${data.currentPage} | TrustedSkills`,
      description: `Browse ${data.category.count} ${data.category.name.toLowerCase()} agent skills on TrustedSkills. Page ${data.currentPage} of ${data.totalPages}.`,
      url: `${SITE_URL}${data.basePath}/page/${data.currentPage}/`,
    },
  };
}

export default async function CategoryPaginatedPage({ params }: PageProps) {
  const { category: categorySlug, page } = await params;
  const data = getCategoryPageData(categorySlug, page);

  if (!data) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link
          href={`/skills/category/${data.category.slug}/`}
          className="text-sm text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1"
        >
          ← Back to {data.category.name}
        </Link>
      </div>

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{data.category.emoji}</span>
          <div>
            <h1 className="text-3xl font-bold text-white">{data.category.name} Skills — Page {data.currentPage}</h1>
            <p className="text-gray-400">
              {data.skills.length} skills in this category · Page {data.currentPage} of {data.totalPages}
            </p>
          </div>
        </div>
        <p className="text-gray-500 max-w-3xl">
          Continue browsing {data.category.name.toLowerCase()} skills on TrustedSkills.
        </p>
      </header>

      <nav aria-label={`${data.category.name} skills index page ${data.currentPage}`} className="sr-only">
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
