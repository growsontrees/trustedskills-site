import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Pagination } from "../../../../components/Pagination";
import { ListingPage } from "../../../../components/ListingPage";
import { categoryIcon } from "../../../../components/icons";
import { getAllSkills, getCategories, getCategoryBySlug, sortByScore } from "../../../../lib/skills";

const DEFAULT_SKILLS_PER_PAGE = 25;
const SITE_URL = "https://trustedskills.dev";

interface PageProps {
  params: Promise<{
    category: string;
    page: string;
  }>;
}

function getCategoryPageData(categorySlug: string, pageNum: number) {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return null;

  const skills = sortByScore(getAllSkills().filter((skill) => skill.category === category.slug));

  const totalPages = Math.max(1, Math.ceil(skills.length / DEFAULT_SKILLS_PER_PAGE));
  
  if (pageNum < 1 || pageNum > totalPages) {
    return null;
  }
  
  const startIndex = (pageNum - 1) * DEFAULT_SKILLS_PER_PAGE;
  const paginatedSkills = skills.slice(startIndex, startIndex + DEFAULT_SKILLS_PER_PAGE);

  return {
    category,
    skills,
    paginatedSkills,
    totalPages,
    currentPage: pageNum,
    pageSize: DEFAULT_SKILLS_PER_PAGE,
    totalSkills: skills.length,
    basePath: `/category/${category.slug}`,
  };
}

export function generateStaticParams() {
  const categories = getCategories();
  const params: { category: string; page: string }[] = [];
  
  for (const category of categories) {
    const skills = getAllSkills().filter((s) => s.category === category.slug);
    const totalPages = Math.max(1, Math.ceil(skills.length / DEFAULT_SKILLS_PER_PAGE));
    
    for (let page = 2; page <= totalPages; page++) {
      params.push({ category: category.slug, page: String(page) });
    }
  }
  
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, page } = await params;
  const categorySlug = category;
  const pageNum = parseInt(page, 10) || 1;
  const data = getCategoryPageData(categorySlug, pageNum);

  if (!data) {
    return {};
  }

  return {
    title: `${data.category.name} Agent Skills - Page ${pageNum}`,
    description: `Browse ${data.category.name.toLowerCase()} agent skills on TrustedSkills. Page ${pageNum} of ${data.totalPages}.`,
    alternates: {
      canonical: `${SITE_URL}${data.basePath}/page/${pageNum}/`,
    },
    openGraph: {
      title: `${data.category.name} Agent Skills - Page ${pageNum} | TrustedSkills`,
      description: `Browse ${data.category.name.toLowerCase()} agent skills on TrustedSkills.`,
      url: `${SITE_URL}${data.basePath}/page/${pageNum}/`,
    },
  };
}

export default async function CategoryPagePaginated({ params }: PageProps) {
  const { category, page } = await params;
  const categorySlug = category;
  const pageNum = parseInt(page, 10) || 1;
  const pageSize = DEFAULT_SKILLS_PER_PAGE;
      
  const data = getCategoryPageData(categorySlug, pageNum);

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
        basePath={`${data.basePath}`}
        currentPageSize={pageSize}
        totalItems={data.totalSkills}
        pageSizeOptions={[25, 50, 100, { value: Infinity, label: "All" }]}
        categorySlug={categorySlug}
      />
    </ListingPage>
  );
}
