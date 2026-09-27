import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Pagination } from "../../../../components/Pagination";
import { ListingPage } from "../../../../components/ListingPage";
import { getAllSkills, TIER_CONFIG, TIER_ORDER, VerificationTier, sortByScore } from "../../../../lib/skills";

const DEFAULT_SKILLS_PER_PAGE = 25;
const SITE_URL = "https://trustedskills.dev";

// Derived from the tier config so a new tier gets a route without a second edit.
const VALID_TIERS: VerificationTier[] = TIER_ORDER;

interface PageProps {
  params: Promise<{
    tier: string;
    page: string;
  }>;
}

function getTierPageData(tierSlug: string, pageNum: number) {
  if (!VALID_TIERS.includes(tierSlug as VerificationTier)) {
    return null;
  }

  const tier = tierSlug as VerificationTier;
  const tierConfig = TIER_CONFIG[tier];

  const skills = sortByScore(getAllSkills().filter((skill) => skill.verified === tier));

  const totalPages = Math.max(1, Math.ceil(skills.length / DEFAULT_SKILLS_PER_PAGE));
  
  if (pageNum < 1 || pageNum > totalPages) {
    return null;
  }
  
  const startIndex = (pageNum - 1) * DEFAULT_SKILLS_PER_PAGE;
  const paginatedSkills = skills.slice(startIndex, startIndex + DEFAULT_SKILLS_PER_PAGE);

  return {
    tier,
    tierConfig,
    skills,
    paginatedSkills,
    totalPages,
    currentPage: pageNum,
    pageSize: DEFAULT_SKILLS_PER_PAGE,
    totalSkills: skills.length,
    basePath: `/tier/${tier}`,
  };
}

export function generateStaticParams() {
  const params: { tier: string; page: string }[] = [];
  
  for (const tier of VALID_TIERS) {
    const skills = getAllSkills().filter((s) => s.verified === tier);
    const totalPages = Math.max(1, Math.ceil(skills.length / DEFAULT_SKILLS_PER_PAGE));
    
    for (let page = 2; page <= totalPages; page++) {
      params.push({ tier, page: String(page) });
    }
  }
  
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tier, page } = await params;
  const tierSlug = tier;
  const pageNum = parseInt(page, 10) || 1;
  const data = getTierPageData(tierSlug, pageNum);

  if (!data) {
    return {};
  }

  return {
    title: `${data.tierConfig.label} Skills - Page ${pageNum}`,
    description: `Browse ${data.tierConfig.label.toLowerCase()} agent skills on TrustedSkills. Page ${pageNum} of ${data.totalPages}.`,
    alternates: {
      canonical: `${SITE_URL}${data.basePath}/page/${pageNum}/`,
    },
    openGraph: {
      title: `${data.tierConfig.label} Agent Skills - Page ${pageNum} | TrustedSkills`,
      description: `Browse ${data.totalSkills} ${data.tierConfig.label.toLowerCase()} agent skills on TrustedSkills.`,
      url: `${SITE_URL}${data.basePath}/page/${pageNum}/`,
    },
  };
}

export default async function TierPagePaginated({ params }: PageProps) {
  const { tier, page } = await params;
  const tierSlug = tier;
  const pageNum = parseInt(page, 10) || 1;
  const pageSize = DEFAULT_SKILLS_PER_PAGE;
      
  const data = getTierPageData(tierSlug, pageNum);

  if (!data) {
    notFound();
  }

  return (
    <ListingPage
      icon={data.tierConfig.icon}
      tone={data.tierConfig.tone}
      title={`${data.tierConfig.label} skills`}
      count={data.totalSkills}
      page={data.currentPage}
      totalPages={data.totalPages}
      description={data.tierConfig.detail}
      skills={data.paginatedSkills}
    >
      <Pagination
        currentPage={data.currentPage}
        totalPages={data.totalPages}
        basePath={`${data.basePath}`}
        currentPageSize={pageSize}
        totalItems={data.totalSkills}
        pageSizeOptions={[25, 50, 100, { value: Infinity, label: "All" }]}
      />
    </ListingPage>
  );
}
