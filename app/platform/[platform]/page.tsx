import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Pagination } from "../../../components/Pagination";
import { SkillCard } from "../../../components/SkillCard";
import { getAllSkills, PLATFORM_CONFIG } from "../../../lib/skills";

const DEFAULT_SKILLS_PER_PAGE = 25;
const SITE_URL = "https://trustedskills.dev";

const VALID_PLATFORMS = ["openclaw", "mcp", "openai", "claude", "cursor", "huggingface"] as const;
type PlatformSlug = typeof VALID_PLATFORMS[number];

function getPlatformPageData(platformSlug: string) {
  if (!VALID_PLATFORMS.includes(platformSlug as PlatformSlug)) {
    return null;
  }

  const platform = platformSlug as PlatformSlug;
  const platformConfig = PLATFORM_CONFIG[platform];

  const skills = getAllSkills()
    .filter((skill) => skill.platforms?.includes(platform))
    .sort((a, b) => b.installs - a.installs);

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

export async function generateMetadata({ params }: { params: { platform: string } }): Promise<Metadata> {
  const platformSlug = params.platform;
  const data = getPlatformPageData(platformSlug);

  if (!data) {
    return {};
  }

  return {
    title: `${data.platformConfig.label} Compatible Skills`,
    description: `Browse ${data.totalSkills} agent skills compatible with ${data.platformConfig.label} on TrustedSkills.`,
    alternates: {
      canonical: `${SITE_URL}${data.basePath}/`,
    },
    openGraph: {
      title: `${data.platformConfig.label} Agent Skills | TrustedSkills`,
      description: `Browse ${data.totalSkills} agent skills compatible with ${data.platformConfig.label} on TrustedSkills.`,
      url: `${SITE_URL}${data.basePath}/`,
    },
  };
}

export default function PlatformPage({ params }: { params: { platform: string } }) {
  const platformSlug = params.platform;
  const pageSize = DEFAULT_SKILLS_PER_PAGE;
      
  const data = getPlatformPageData(platformSlug);

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
