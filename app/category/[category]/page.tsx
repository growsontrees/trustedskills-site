import type { Metadata } from "next";
import { canonicalUrl } from "../../../lib/site-url";
import { notFound } from "next/navigation";
import { Pagination } from "../../../components/Pagination";
import { ListingPage } from "../../../components/ListingPage";
import { categoryIcon } from "../../../components/icons";
import { getAllSkills, getCategories, getCategoryBySlug, sortByScore } from "../../../lib/skills";

const DEFAULT_SKILLS_PER_PAGE = 25;

function getCategoryPageData(categorySlug: string) {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return null;

  const skills = sortByScore(getAllSkills().filter((skill) => skill.category === category.slug));

  const totalPages = Math.max(1, Math.ceil(skills.length / DEFAULT_SKILLS_PER_PAGE));
  const paginatedSkills = skills.slice(0, DEFAULT_SKILLS_PER_PAGE);

  return {
    category,
    skills,
    paginatedSkills,
    totalPages,
    currentPage: 1,
    pageSize: DEFAULT_SKILLS_PER_PAGE,
    totalSkills: skills.length,
    basePath: `/category/${category.slug}`,
  };
}

export function generateStaticParams() {
  return getCategories().map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const categorySlug = category;
  const data = getCategoryPageData(categorySlug);

  if (!data) {
    return {};
  }

  return {
    title: `${data.category.name} Agent Skills`,
    description: `Browse ${data.category.count} ${data.category.name.toLowerCase()} agent skills on TrustedSkills. Page 1 of ${data.totalPages}.`,
    alternates: {
      canonical: canonicalUrl(`/skills/category/${data.category.slug}`),
    },
    openGraph: {
      title: `${data.category.name} Agent Skills | TrustedSkills`,
      description: `Browse ${data.category.count} ${data.category.name.toLowerCase()} agent skills on TrustedSkills.`,
      url: canonicalUrl(`/skills/category/${data.category.slug}`),
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const categorySlug = category;
  const pageSize = DEFAULT_SKILLS_PER_PAGE;
      
  const data = getCategoryPageData(categorySlug);

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
