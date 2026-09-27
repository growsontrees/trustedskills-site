import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Pagination } from "../../../components/Pagination";
import { ListingPage } from "../../../components/ListingPage";
import { getAllSkills, TIER_CONFIG, TIER_ORDER, VerificationTier, sortByScore } from "../../../lib/skills";

const DEFAULT_SKILLS_PER_PAGE = 25;
const SITE_URL = "https://trustedskills.dev";

// Derived from the tier config so a new tier gets a route without a second edit.
const VALID_TIERS: VerificationTier[] = TIER_ORDER;

function getTierPageData(tierSlug: string) {
  if (!VALID_TIERS.includes(tierSlug as VerificationTier)) {
    return null;
  }

  const tier = tierSlug as VerificationTier;
  const tierConfig = TIER_CONFIG[tier];

  const skills = sortByScore(getAllSkills().filter((skill) => skill.verified === tier));

  const totalPages = Math.max(1, Math.ceil(skills.length / DEFAULT_SKILLS_PER_PAGE));
  const paginatedSkills = skills.slice(0, DEFAULT_SKILLS_PER_PAGE);

  return {
    tier,
    tierConfig,
    skills,
    paginatedSkills,
    totalPages,
    currentPage: 1,
    pageSize: DEFAULT_SKILLS_PER_PAGE,
    totalSkills: skills.length,
    basePath: `/tier/${tier}`,
  };
}

export function generateStaticParams() {
  return VALID_TIERS.map((tier) => ({ tier }));
}

export async function generateMetadata({ params }: { params: Promise<{ tier: string }> }): Promise<Metadata> {
  const { tier } = await params;
  const tierSlug = tier;
  const data = getTierPageData(tierSlug);

  if (!data) {
    return {};
  }

  return {
    title: `${data.tierConfig.label} Skills`,
    description: `Browse ${data.totalSkills} ${data.tierConfig.label.toLowerCase()} agent skills on TrustedSkills. ${data.tierConfig.description}`,
    alternates: {
      canonical: `${SITE_URL}${data.basePath}/`,
    },
    openGraph: {
      title: `${data.tierConfig.label} Agent Skills | TrustedSkills`,
      description: `Browse ${data.totalSkills} ${data.tierConfig.label.toLowerCase()} agent skills on TrustedSkills.`,
      url: `${SITE_URL}${data.basePath}/`,
    },
  };
}

export default async function TierPage({ params }: { params: Promise<{ tier: string }> }) {
  const { tier } = await params;
  const tierSlug = tier;
  const pageSize = DEFAULT_SKILLS_PER_PAGE;
      
  const data = getTierPageData(tierSlug);

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
