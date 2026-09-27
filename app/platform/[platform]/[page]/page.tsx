import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Pagination } from "../../../../components/Pagination";
import { ListingPage } from "../../../../components/ListingPage";
import { platformIcon } from "../../../../components/icons";
import { getAllSkills, PLATFORM_CONFIG, sortByScore } from "../../../../lib/skills";

const DEFAULT_SKILLS_PER_PAGE = 25;
const SITE_URL = "https://trustedskills.dev";

const VALID_PLATFORMS = ["claudecode", "openclaw", "claude", "mcp", "cursor", "openai"] as const;
type PlatformSlug = typeof VALID_PLATFORMS[number];

interface PageProps {
  params: Promise<{
    platform: string;
    page: string;
  }>;
}

function getPlatformPageData(platformSlug: string, pageNum: number) {
  if (!VALID_PLATFORMS.includes(platformSlug as PlatformSlug)) {
    return null;
  }

  const platform = platformSlug as PlatformSlug;
  const platformConfig = PLATFORM_CONFIG[platform];

  const skills = sortByScore(getAllSkills().filter((skill) => skill.platforms?.includes(platform)));

  const totalPages = Math.max(1, Math.ceil(skills.length / DEFAULT_SKILLS_PER_PAGE));
  
  if (pageNum < 1 || pageNum > totalPages) {
    return null;
  }
  
  const startIndex = (pageNum - 1) * DEFAULT_SKILLS_PER_PAGE;
  const paginatedSkills = skills.slice(startIndex, startIndex + DEFAULT_SKILLS_PER_PAGE);

  return {
    platform,
    platformConfig,
    skills,
    paginatedSkills,
    totalPages,
    currentPage: pageNum,
    pageSize: DEFAULT_SKILLS_PER_PAGE,
    totalSkills: skills.length,
    basePath: `/platform/${platform}`,
  };
}

export function generateStaticParams() {
  const params: { platform: string; page: string }[] = [];
  
  for (const platform of VALID_PLATFORMS) {
    const skills = getAllSkills().filter((s) => s.platforms?.includes(platform));
    const totalPages = Math.max(1, Math.ceil(skills.length / DEFAULT_SKILLS_PER_PAGE));
    
    for (let page = 2; page <= totalPages; page++) {
      params.push({ platform, page: String(page) });
    }
  }
  
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { platform, page } = await params;
  const platformSlug = platform;
  const pageNum = parseInt(page, 10) || 1;
  const data = getPlatformPageData(platformSlug, pageNum);

  if (!data) {
    return {};
  }

  return {
    title: `${data.platformConfig.label} Skills - Page ${pageNum}`,
    description: `Browse agent skills compatible with ${data.platformConfig.label} on TrustedSkills. Page ${pageNum} of ${data.totalPages}.`,
    alternates: {
      canonical: `${SITE_URL}${data.basePath}/page/${pageNum}/`,
    },
    openGraph: {
      title: `${data.platformConfig.label} Agent Skills - Page ${pageNum} | TrustedSkills`,
      description: `Browse ${data.totalSkills} agent skills compatible with ${data.platformConfig.label} on TrustedSkills.`,
      url: `${SITE_URL}${data.basePath}/page/${pageNum}/`,
    },
  };
}

export default async function PlatformPagePaginated({ params }: PageProps) {
  const { platform, page } = await params;
  const platformSlug = platform;
  const pageNum = parseInt(page, 10) || 1;
  const pageSize = DEFAULT_SKILLS_PER_PAGE;
      
  const data = getPlatformPageData(platformSlug, pageNum);

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
