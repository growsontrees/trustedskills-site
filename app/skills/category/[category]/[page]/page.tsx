import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Pagination } from "../../../../../components/Pagination";
import { ListingPage } from "../../../../../components/ListingPage";
import { categoryIcon } from "../../../../../components/icons";
import { getAllSkills, getCategories, getCategoryBySlug, sortByScore } from "../../../../../lib/skills";

const SKILLS_PER_PAGE = 24;
const SITE_URL = "https://trustedskills.dev";

interface PageProps {
  params: Promise<{ category: string; page: string }>;
}

function getCategoryPageData(categorySlug: string, pageNumber: number) {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return null;

  const skills = sortByScore(getAllSkills().filter((skill) => skill.category === category.slug));

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
    title: `${data.category.name} Agent Skills — Page ${pageNumber}`,
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
    <ListingPage
      icon={categoryIcon(data.category.slug)}
      title={`${data.category.name} skills`}
      count={data.skills.length}
      page={data.currentPage}
      totalPages={data.totalPages}
      description={`Skills in the ${data.category.name.toLowerCase()} category, ranked by install count, publisher and listing quality.`}
      skills={data.paginatedSkills}
    >
      <Pagination
        currentPage={data.currentPage}
        totalPages={data.totalPages}
        basePath={data.basePath}
      />
    </ListingPage>
  );
}