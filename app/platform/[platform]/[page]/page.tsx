import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Pagination } from "../../../../components/Pagination";
import { PlatformPreferenceSync } from "../../../../components/PlatformPreferenceSync";
import { SkillCard } from "../../../../components/SkillCard";
import { getAllSkills, PLATFORM_CONFIG } from "../../../../lib/skills";
import {
  getBrowsablePlatformKey,
  getPlatformFilters,
  getPlatformQueryPath,
} from "../../../../lib/platforms";

const DEFAULT_SKILLS_PER_PAGE = 25;
const SITE_URL = "https://trustedskills.dev";

interface PageProps {
  params: Promise<{
    platform: string;
    page: string;
  }>;
}

function getPlatformPageData(platformSlug: string, pageNum: number) {
  const allSkills = getAllSkills();
  const platform = getBrowsablePlatformKey(platformSlug, allSkills);
  if (!platform) return null;
  const platformConfig = PLATFORM_CONFIG[platform];

  const skills = allSkills
    .filter((skill) => skill.platforms?.includes(platform))
    .sort((a, b) => b.installs - a.installs);

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
  
  for (const { key: platform } of getPlatformFilters(getAllSkills())) {
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
      canonical: `${SITE_URL}${data.basePath}/${pageNum}/`,
    },
    openGraph: {
      title: `${data.platformConfig.label} Agent Skills - Page ${pageNum} | TrustedSkills`,
      description: `Browse ${data.totalSkills} agent skills compatible with ${data.platformConfig.label} on TrustedSkills.`,
      url: `${SITE_URL}${data.basePath}/${pageNum}/`,
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

  if (platformSlug !== data.platform) {
    permanentRedirect(`${data.basePath}/${pageNum}/`);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PlatformPreferenceSync platform={data.platform} />
      <div className="mb-6">
        <Link
          href={getPlatformQueryPath(data.platform)}
          className="text-sm text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1"
        >
          ← Back to Skills
        </Link>
      </div>

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{data.platformConfig.label[0]}</span>
          <div>
            <h1 className="text-3xl font-bold text-white">{data.platformConfig.label} Skills</h1>
            <p className="text-gray-400">
              {data.skills.length} skills compatible with {data.platformConfig.label} · Page {data.currentPage} of {data.totalPages}
            </p>
          </div>
        </div>
        <p className="text-gray-500 max-w-3xl">
          Browse agent skills that work with {data.platformConfig.label}. 
          Install commands are automatically configured for this platform.
        </p>
      </header>

      <nav aria-label={`${data.platformConfig.label} skills index`} className="sr-only">
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
        basePath={`${data.basePath}`}
        currentPageSize={pageSize}
        totalItems={data.totalSkills}
        pageSizeOptions={[25, 50, 100, { value: Infinity, label: "All" }]}
      />
    </div>
  );
}
