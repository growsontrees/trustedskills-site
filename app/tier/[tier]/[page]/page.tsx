import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Pagination } from "@/components/Pagination";
import { SkillCard } from "@/components/SkillCard";
import { getAllSkills, TIER_CONFIG, VerificationTier } from "@/lib/skills";

const DEFAULT_SKILLS_PER_PAGE = 25;
const SITE_URL = "https://trustedskills.dev";

const VALID_TIERS: VerificationTier[] = ["featured", "verified", "community", "unverified"];

interface PageProps {
  params: {
    tier: string;
    page: string;
  };
}

function getTierPageData(tierSlug: string, pageNum: number) {
  if (!VALID_TIERS.includes(tierSlug as VerificationTier)) {
    return null;
  }

  const tier = tierSlug as VerificationTier;
  const tierConfig = TIER_CONFIG[tier];

  const skills = getAllSkills()
    .filter((skill) => skill.verified === tier)
    .sort((a, b) => b.installs - a.installs);

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
  const tierSlug = params.tier;
  const pageNum = parseInt(params.page, 10) || 1;
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

export default function TierPagePaginated({ params }: PageProps) {
  const tierSlug = params.tier;
  const pageNum = parseInt(params.page, 10) || 1;
  const pageSize = DEFAULT_SKILLS_PER_PAGE;
      
  const data = getTierPageData(tierSlug, pageNum);

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
          <span className="text-4xl">{data.tierConfig.icon}</span>
          <div>
            <h1 className="text-3xl font-bold text-white">{data.tierConfig.label} Skills</h1>
            <p className="text-gray-400">
              {data.skills.length} {data.tierConfig.label.toLowerCase()} skills · Page {data.currentPage} of {data.totalPages}
            </p>
          </div>
        </div>
        <p className={`max-w-3xl ${data.tierConfig.color}`}>
          {data.tierConfig.description}
        </p>
      </header>

      <nav aria-label={`${data.tierConfig.label} skills index`} className="sr-only">
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
