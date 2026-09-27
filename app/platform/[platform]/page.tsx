import type { Metadata } from "next";
import { canonicalUrl } from "../../../lib/site-url";
import { notFound } from "next/navigation";
import { Pagination } from "../../../components/Pagination";
import { ListingPage } from "../../../components/ListingPage";
import { platformIcon } from "../../../components/icons";
import { getAllSkills, PLATFORM_CONFIG, sortByScore } from "../../../lib/skills";

const DEFAULT_SKILLS_PER_PAGE = 25;

const VALID_PLATFORMS = ["claudecode", "openclaw", "claude", "mcp", "cursor", "openai"] as const;
type PlatformSlug = typeof VALID_PLATFORMS[number];

function getPlatformPageData(platformSlug: string) {
  if (!VALID_PLATFORMS.includes(platformSlug as PlatformSlug)) {
    return null;
  }

  const platform = platformSlug as PlatformSlug;
  const platformConfig = PLATFORM_CONFIG[platform];

  const skills = sortByScore(getAllSkills().filter((skill) => skill.platforms?.includes(platform)));

  const totalPages = Math.max(1, Math.ceil(skills.length / DEFAULT_SKILLS_PER_PAGE));
  const paginatedSkills = skills.slice(0, DEFAULT_SKILLS_PER_PAGE);

  return {
    platform,
    platformConfig,
    skills,
    paginatedSkills,
    totalPages,
    currentPage: 1,
    pageSize: DEFAULT_SKILLS_PER_PAGE,
    totalSkills: skills.length,
    basePath: `/platform/${platform}`,
  };
}

export function generateStaticParams() {
  return VALID_PLATFORMS.map((platform) => ({ platform }));
}

export async function generateMetadata({ params }: { params: Promise<{ platform: string }> }): Promise<Metadata> {
  const { platform } = await params;
  const platformSlug = platform;
  const data = getPlatformPageData(platformSlug);

  if (!data) {
    return {};
  }

  return {
    title: `${data.platformConfig.label} Compatible Skills`,
    description: `Browse ${data.totalSkills} agent skills compatible with ${data.platformConfig.label} on TrustedSkills.`,
    alternates: {
      canonical: canonicalUrl(data.basePath),
    },
    openGraph: {
      title: `${data.platformConfig.label} Agent Skills | TrustedSkills`,
      description: `Browse ${data.totalSkills} agent skills compatible with ${data.platformConfig.label} on TrustedSkills.`,
      url: canonicalUrl(data.basePath),
    },
  };
}

export default async function PlatformPage({ params }: { params: Promise<{ platform: string }> }) {
  const { platform } = await params;
  const platformSlug = platform;
  const pageSize = DEFAULT_SKILLS_PER_PAGE;
      
  const data = getPlatformPageData(platformSlug);

  if (!data) {
    notFound();
  }

  return (
    <ListingPage
      icon={platformIcon(data.platform)}
      title={`${data.platformConfig.label} skills`}
      count={data.totalSkills}
      countNoun={`skills with a ${data.platformConfig.label} install snippet`}
      page={data.currentPage}
      totalPages={data.totalPages}
      description={`Every listing here records ${data.platformConfig.label} among its supported platforms, so the install snippet on each page defaults to it.`}
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
