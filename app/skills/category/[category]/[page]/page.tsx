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

function getCategoryPageData(categorySlug: string, pageNumber: number) {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return null;

  const skills = getAllSkills()
    .filter((skill) => skill.category === category.slug)
    .sort((a, b) => b.installs - a.installs);

  const totalPages = Math.max(1, Math.ceil(skills.length / SKILLS_PER_PAGE));
  
  // Validate page number (page 1 should use the base URL, not /1/)
  if (pageNumber < 2 || pageNumber > totalPages) return null;

  const startIndex = (pageNumber - 1) * SKILLS_PER_PAGE;
  const endIndex = startIndex + SKILLS_PER_PAGE;
  const paginatedSkills = skills.slice(startIndex, endIndex);

  return {
    category,
    skills,
    paginatedSkills,
    totalPages,
    currentPage: pageNumber,
    basePath: `/skills/category/${category.slug}`,
  };
}

export async function generateStaticParams() {
  const categories = getCategories();
  const params: { category: string; page: string }[] = [];
  
  for (const category of categories) {
    const skills = getAllSkills().filter((skill) => skill.category === category.slug);
    const totalPages = Math.max(1, Math.ceil(skills.length / SKILLS_PER_PAGE));
    
    // Generate pages 2 through totalPages (page 1 is handled by the parent route)
    for (let page = 2; page <= totalPages; page++) {
      params.push({
        category: category.slug,
        page: page.toString(),
      });
    }
  }
  
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categorySlug, page: pageStr } = await params;
  const pageNumber = parseInt(pageStr, 10);
  const data = getCategoryPageData(categorySlug, pageNumber);

  if (!data) {
    return {};
  }

  return {
    title: `${data.category.name} Agent Skills — Page ${pageNumber} | TrustedSkills`,
    description: `Browse ${data.category.count} ${data.category.name.toLowerCase()} agent skills on TrustedSkills. Page ${pageNumber} of ${data.totalPages}.`,
    alternates: {
      canonical: `${SITE_URL}${data.basePath}/${pageNumber}/`,
    },
    openGraph: {
      title: `${data.category.name} Agent Skills — Page ${pageNumber} | TrustedSkills`,
      description: `Browse ${data.category.count} ${data.category.name.toLowerCase()} agent skills on TrustedSkills.`,
      url: `${SITE_URL}${data.basePath}/${pageNumber}/`,
    },
  };
}

export default async function CategoryPagePaginated({ params }: PageProps) {
  const { category: categorySlug, page: pageStr } = await params;
  const pageNumber = parseInt(pageStr, 10);
  const data = getCategoryPageData(categorySlug, pageNumber);

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