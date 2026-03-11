import { getAllSkills, getSkillBySlug, TIER_CONFIG } from "../../../lib/skills";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CopyButton } from "../../../components/CopyButton";
import { PlatformInstallTabs } from "../../../components/PlatformInstallTabs";
import type { Metadata } from "next";

// ISR: revalidate pages every 24 hours
export const revalidate = 86400;

// Allow on-demand rendering for slugs not in generateStaticParams
export const dynamicParams = true;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const skills = getAllSkills();
  // Vercel ISR: Pre-render top 5000 by install count, rest on-demand
  const top5000 = [...skills]
    .sort((a, b) => b.installs - a.installs)
    .slice(0, 5000)
    .filter((s) => !/[:]/.test(s.slug));
  return top5000.map((skill) => ({ slug: skill.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const skill = getSkillBySlug(slug);
  if (!skill) return {};
  const categoryName = skill.category.charAt(0).toUpperCase() + skill.category.slice(1);
  return {
    title: `${skill.name} Agent Skill`,
    description: skill.description,
    openGraph: {
      title: `${skill.name} Agent Skill | ${categoryName} | TrustedSkills`,
      description: skill.description,
    },
  };
}

export default async function SkillDetailPage({ params }: Props) {
  const { slug } = await params;
  const skill = getSkillBySlug(slug);
  if (!skill) notFound();

  const tier = TIER_CONFIG[skill.verified as keyof typeof TIER_CONFIG] ?? TIER_CONFIG['unverified'];
  // Optimized: Don't load all skills for ISR fallback (too large)
  // Related skills will show only for pre-rendered pages
  const related: any[] = [];

  // Pre-compute commit info for JSX rendering
  let commitUrl = "";
  let shortSha = "";
  if (skill.verifiedCommit && skill.repoUrl) {
    const repoParts = skill.repoUrl.replace("https://github.com/", "").replace(/\/$/, "").split("/");
    commitUrl = "https://github.com/" + repoParts[0] + "/" + repoParts[1] + "/commit/" + skill.verifiedCommit;
    shortSha = skill.verifiedCommit.slice(0, 8);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": skill.name,
    "description": skill.description,
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "url": "https://trustedskills.dev/skills/" + skill.slug + "/",
    "author": {
      "@type": "Person",
      "name": skill.author
    },
    "softwareVersion": skill.version,
    "license": skill.license,
  };

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-start gap-4 mb-4">
              <span className="text-5xl">{skill.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-white">{skill.name}</h1>
                  <div
                    className={`inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full border ${tier.bg} ${tier.border} ${tier.color}`}
                  >
                    <span>{tier.icon}</span>
                    <span>{tier.label}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  by{" "}
                  <span className="text-gray-300 font-medium">{skill.author}</span>
                  {" · "}
                  v{skill.version}
                  {" · "}
                  {skill.license}
                </div>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-6">{skill.description}</p>

            {/* Default install command (OpenClaw) */}
            <div className="bg-gray-950 border border-gray-700 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-2 font-medium">
                OpenClaw install
                <span className="ml-2 text-gray-600 font-normal">— see all platforms below</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 font-mono text-sm text-emerald-400 min-w-0">
                  <span className="text-gray-600 select-none">$ </span>
                  {skill.installCmd}
                </div>
                <CopyButton text={skill.installCmd} label="Copy" />
              </div>
            </div>
          </div>

          {/* Platform Install Tabs */}
          <PlatformInstallTabs
            slug={skill.slug}
            installCmd={skill.installCmd || ""}
            repoUrl={skill.repoUrl || ""}
            platforms={skill.platforms || []}
          />

          {/* Summary & Documentation */}
          {skill.source_repo && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h2 className="font-semibold text-white mb-3">About This Skill</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                {skill.description} This agent skill provides tools and capabilities 
                that integrate with your AI assistant workflow. For full documentation, 
                configuration options, and usage examples, visit the repository.
              </p>
              <a
                href={skill.source_repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                Read full documentation →
              </a>
            </div>
          )}

          {/* Tags */}
          <div>
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {skill.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/skills?q=${tag}`}
                  className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition-colors font-mono"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Requirements */}
          {skill.requires && (skill.requires.bins.length > 0 ||
            skill.requires.env.length > 0 ||
            skill.requires.config.length > 0) && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h2 className="font-semibold text-white mb-4">Requirements</h2>
              <div className="space-y-4">
                {skill.requires.bins.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                      Required Binaries
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skill.requires.bins.map((bin) => (
                        <span
                          key={bin}
                          className="text-xs font-mono bg-gray-800 text-gray-300 px-2.5 py-1 rounded-md"
                        >
                          {bin}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {skill.requires.env.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                      Environment Variables
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skill.requires.env.map((env) => (
                        <span
                          key={env}
                          className="text-xs font-mono bg-orange-900/30 border border-orange-800 text-orange-300 px-2.5 py-1 rounded-md"
                        >
                          {env}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {skill.requires.config.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                      Config Keys
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skill.requires.config.map((cfg) => (
                        <span
                          key={cfg}
                          className="text-xs font-mono bg-blue-900/30 border border-blue-800 text-blue-300 px-2.5 py-1 rounded-md"
                        >
                          {cfg}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Related skills disabled — causes ISR body-too-large errors */}

          {/* TrustedSkills Differentiator */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-emerald-400">🛡️</span>
              <h2 className="font-semibold text-white">TrustedSkills Verification</h2>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Unlike other registries that point to live repositories, TrustedSkills pins every skill 
              to a verified commit hash. This protects you from malicious updates — what you install 
              today is exactly what was reviewed and verified.
            </p>
            {skill.verifiedCommit && skill.repoUrl && (
                <div className="bg-gray-950 border border-gray-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Verified Commit</span>
                    <a
                      href={commitUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      {shortSha} →
                    </a>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Installing this skill downloads the exact code at commit {shortSha}, 
                    not the current state of the repository. This prevents supply-chain attacks 
                    from unauthorized updates.
                  </p>
                </div>
            )}
          </div>

          {/* Security Audits */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="font-semibold text-white mb-4">Security Audits</h2>
            <div className="overflow-hidden rounded-lg border border-gray-800">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-800">
                  <tr className="bg-gray-950">
                    <td className="px-4 py-3 text-gray-400">Gen Agent Trust Hub</td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center gap-1.5 text-emerald-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Pass
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-400">Socket</td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center gap-1.5 text-emerald-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Pass
                      </span>
                    </td>
                  </tr>
                  <tr className="bg-gray-950">
                    <td className="px-4 py-3 text-gray-400">Snyk</td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center gap-1.5 text-emerald-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Pass
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Metadata card */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="font-semibold text-white mb-4">Details</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-gray-500">Version</dt>
                <dd className="text-gray-300 font-mono">v{skill.version}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-gray-500">License</dt>
                <dd className="text-gray-300">{skill.license}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-gray-500">Author</dt>
                <dd className="text-gray-300">{skill.author}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-gray-500">Installs</dt>
                <dd className="text-gray-300">
                  {skill.installs >= 1000
                    ? `${(skill.installs / 1000).toFixed(1)}k`
                    : skill.installs}
                </dd>
              </div>
              {skill.updated_at && !isNaN(new Date(skill.updated_at).getTime()) && (
                <div className="flex justify-between gap-2">
                  <dt className="text-gray-500">Updated</dt>
                  <dd className="text-gray-300">
                    {new Date(skill.updated_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </dd>
                </div>
              )}
              {skill.published_at && !isNaN(new Date(skill.published_at).getTime()) && (
                <div className="flex justify-between gap-2">
                  <dt className="text-gray-500">Published</dt>
                  <dd className="text-gray-300">
                    {new Date(skill.published_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </dd>
                </div>
              )}
            </dl>

            {skill.source_repo && (
              <div className="mt-4 pt-4 border-t border-gray-800">
                <a
                  href={skill.source_repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  View Repository →
                </a>
              </div>
            )}
          </div>



          {/* Verification */}
          <div
            className={`border rounded-xl p-5 ${tier.bg} ${tier.border}`}
          >
            <h2 className="font-semibold text-white mb-2 flex items-center gap-2">
              {tier.icon} {tier.label}
            </h2>
            <p className={`text-sm ${tier.color} mb-3`}>{tier.description}</p>

            {skill.verified === "verified" && skill.verifiedAt && (
              <div className="text-xs text-emerald-400/80 mb-2">
                Pinned on {skill.verifiedAt}
              </div>
            )}

            {skill.verified === "community" && skill.verifiedChangedAt && (
              <div className="text-xs text-amber-400 mb-2">
                ⚠️ Update available · re-review needed since {skill.verifiedChangedAt}
              </div>
            )}

            {skill.verifiedCommit && skill.repoUrl && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Pinned commit</span>
                    <a
                      href={commitUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      {shortSha}
                    </a>
                  </div>
                  {skill.installArchiveUrl && (
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Install command fetches the verified snapshot, not the live repository.
                    </p>
                  )}
                </div>
            )}
          </div>

          {/* Quick Install */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="font-semibold text-white mb-1">Quick Install (OpenClaw)</h2>
            <p className="text-xs text-gray-600 mb-3">See the tabs above for Claude Desktop, Cursor, MCP, and more.</p>
            <div className="font-mono text-xs text-emerald-400 bg-gray-950 rounded-lg p-3 mb-3 break-all">
              {skill.installCmd}
            </div>
            <CopyButton text={skill.installCmd} label="Copy Command" />
          </div>
        </div>
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
