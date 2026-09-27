import {
  getAllSkills,
  getSkillBySlug,
  TIER_CONFIG,
  formatCount,
  formatDate,
  formatLicense,
  isoDate,
  tierOf,
  PLATFORM_CONFIG,
} from "../../../lib/skills";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PlatformInstallTabs } from "../../../components/PlatformInstallTabs";
import { SafetyPanel } from "../../../components/SafetyPanel";
import { getSafetyCheckList, getSafetyReport } from "../../../lib/safety";
import { getReviewForSkill } from "../../../lib/reviews";
import { getCollectionsForSkill } from "../../../lib/collections";
import { installIsBroken } from "../../../lib/skill-config";
import type { PlatformKey } from "../../../hooks/usePlatform";
import type { Metadata } from "next";
import { canonicalUrl } from "../../../lib/site-url";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Clock,
  Code,
  Download,
  ExternalLink,
  Flask,
  GitCommit,
  Github,
  Info,
  ListChecks,
  Package,
  Scale,
  Star,
  Tag as TagIcon,
  User,
  categoryIcon,
} from "../../../components/icons";
import {
  ButtonLink,
  Chip,
  Eyebrow,
  Field,
  FieldList,
  Note,
  Panel,
  TierChip,
  cx,
} from "../../../components/ui";

/** Returns a short human-readable label for any source URL, e.g. "skills.sh", "github.com", "npm" */
function sourceLabel(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (host === "skills.sh") return "skills.sh";
    if (host === "npmjs.com" || host === "npm.im") return "npm";
    if (host === "github.com") return "GitHub";
    if (host === "gitlab.com") return "GitLab";
    if (host === "huggingface.co") return "HuggingFace";
    if (host === "clawhub.com") return "ClawHub";
    // strip common TLDs for everything else: vercel.com → vercel
    return host.replace(/\.(com|io|dev|ai|org|net|co)$/, "");
  } catch {
    return "Source";
  }
}

// ISR: revalidate pages every 24 hours
export const revalidate = 86400;

// Allow on-demand rendering for slugs not in generateStaticParams
export const dynamicParams = true;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const skills = getAllSkills();
  // ISR: Pre-render top 1000 by install count, rest on-demand
  // Reduced from 5000 — enriched longDescriptions make each page ~3x larger on disk
  const top5000 = [...skills]
    .sort((a, b) => b.installs - a.installs)
    .slice(0, 1000)
    .filter((s) => !/[:]/.test(s.slug));
  return top5000.map((skill) => ({ slug: skill.slug }));
}

// Same encoding as the sitemap, so canonical, JSON-LD and sitemap agree.
function skillUrl(slug: string) {
  return canonicalUrl(`/skills/${encodeURIComponent(slug)}`);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const skill = getSkillBySlug(slug);
  if (!skill) return {};
  const categoryName = skill.category.charAt(0).toUpperCase() + skill.category.slice(1);
  return {
    title: `${skill.name} Agent Skill`,
    description: skill.description || undefined,
    alternates: { canonical: skillUrl(skill.slug) },
    openGraph: {
      title: `${skill.name} Agent Skill | ${categoryName} | TrustedSkills`,
      description: skill.description || undefined,
      url: skillUrl(skill.slug),
    },
  };
}

export default async function SkillDetailPage({ params }: Props) {
  const { slug } = await params;
  const skill = getSkillBySlug(slug);
  if (!skill) notFound();

  const tier = tierOf(skill);
  const TierIcon = tier.icon;
  const Glyph = categoryIcon(skill.category);

  // The automated safety pass. Absent until a scan has reached this skill.
  const safety = getSafetyReport(skill.slug);
  const safetyChecks = getSafetyCheckList(safety);

  // Editorial. The Reviewed badge is earned only by a hands-on review — a
  // source review still links from here, but it is labelled as not run.
  const review = getReviewForSkill(skill.slug);
  const handsOn = review?.evidenceBasis === "hands-on";
  const collections = getCollectionsForSkill(skill.slug);

  const hasRepoLink = !!skill.repoUrl;
  const hasSourceLink =
    !!skill.sourceUrl &&
    !skill.sourceUrl.includes("trustedskills.dev") &&
    skill.sourceUrl !== skill.repoUrl;

  // Facts we actually hold. Each is null when the index has nothing, so the
  // row is omitted rather than rendered as "undefined" — which is what the
  // previous sidebar did for the ~98% of listings with no licence.
  const license = formatLicense(skill.license);
  const installs = formatCount(skill.installs);
  const stars = formatCount(skill.stars);
  const updated = formatDate(skill.updated_at);
  const published = formatDate(skill.published_at);

  // Pre-compute commit info for JSX rendering
  let commitUrl = "";
  let shortSha = "";
  if (skill.verifiedCommit && skill.repoUrl) {
    const repoParts = skill.repoUrl.replace("https://github.com/", "").replace(/\/$/, "").split("/");
    commitUrl = "https://github.com/" + repoParts[0] + "/" + repoParts[1] + "/commit/" + skill.verifiedCommit;
    shortSha = skill.verifiedCommit.slice(0, 8);
  }
  const isPinned = !!skill.verifiedCommit;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: skill.name,
    ...(skill.description ? { description: skill.description } : {}),
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    url: skillUrl(skill.slug),
    author: { "@type": "Person", name: skill.author },
    softwareVersion: skill.version,
    ...(license ? { license } : {}),
  };

  return (
    <div className="mx-auto max-w-page px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/skills"
        className="group inline-flex items-center gap-1.5 text-sm text-ink-500 transition-colors hover:text-ink-200"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-fast ease-out group-hover:-translate-x-0.5" />
        Back to all skills
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ── Main column ─────────────────────────────────────────────── */}
        <div className="space-y-6 lg:col-span-2">
          <Panel>
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-ink-750 bg-ink-850 text-ink-400">
                <Glyph className="h-5 w-5" />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <h1 className="text-2xl font-semibold text-ink-50">{skill.name}</h1>
                  <TierChip tier={skill.verified} size="md" />
                  {handsOn && review ? (
                    <Link
                      href={`/reviews/${review.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-sm border border-ok-800 bg-ok-950 px-2.5 py-1 text-xs font-medium text-ok-300 transition-colors hover:border-ok-700 hover:text-ok-200"
                    >
                      <Flask className="h-3.5 w-3.5" />
                      Reviewed
                    </Link>
                  ) : null}
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-500">
                  <span className="inline-flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    <span className="font-medium text-ink-300">{skill.author}</span>
                  </span>
                  <span className="text-ink-700">·</span>
                  <span className="font-mono text-xs">v{skill.version}</span>
                  <span className="text-ink-700">·</span>
                  <Link
                    href={`/skills/category/${skill.category}`}
                    className="transition-colors hover:text-ink-200"
                  >
                    {skill.category}
                  </Link>
                  {license ? (
                    <>
                      <span className="text-ink-700">·</span>
                      <span>{license}</span>
                    </>
                  ) : null}
                </div>
              </div>
            </div>

            {skill.description ? (
              <p className="mt-stack-lg whitespace-pre-line text-base leading-relaxed text-ink-300">
                {skill.description.trim()}
              </p>
            ) : null}

            {(hasRepoLink || hasSourceLink) && (
              <div className="mt-stack-lg flex flex-wrap gap-2">
                {hasRepoLink && (
                  <ButtonLink href={skill.repoUrl} external variant="secondary" size="sm">
                    <Github className="h-3.5 w-3.5" />
                    Repository
                    <ExternalLink className="h-3 w-3 text-ink-500" />
                  </ButtonLink>
                )}
                {hasSourceLink && (
                  <ButtonLink href={skill.sourceUrl!} external variant="ghost" size="sm">
                    {sourceLabel(skill.sourceUrl!)}
                    <ExternalLink className="h-3 w-3 text-ink-500" />
                  </ButtonLink>
                )}
              </div>
            )}
          </Panel>

          <PlatformInstallTabs
            slug={skill.slug}
            installCmd={skill.installCmd || ""}
            repoUrl={skill.repoUrl || ""}
            platforms={skill.platforms || []}
            preferredPlatform={skill.preferredPlatform as PlatformKey | undefined}
            installOverrides={skill.installOverrides}
            installStatus={skill.install_status}
            installName={skill.install_name}
            installReason={skill.install_reason}
            installCheckedAt={skill.install_checked_at}
          />

          {/* ── Provenance ──────────────────────────────────────────────
              Replaces the old "Security Audits" panel, which printed a
              hard-coded "Pass" from three scanners against every one of the
              26,001 listings regardless of whether any scan had run. Nothing
              here is asserted that the index cannot back. */}
          <Panel>
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-ink-450" />
              <h2 className="text-sm font-semibold text-ink-50">What we know about this skill</h2>
            </div>

            <div className="mt-stack-lg grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-ink-750 bg-ink-950 p-3.5">
                <Eyebrow>Publisher</Eyebrow>
                <p className="mt-1.5 text-sm text-ink-200">{skill.author}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-500">
                  {skill.verified === "official"
                    ? "Matched to the vendor's own GitHub organisation."
                    : "Taken from the source listing. We haven't verified who controls this account."}
                </p>
              </div>

              <div
                className={cx(
                  "rounded-lg border p-3.5",
                  isPinned ? "border-ok-800/60 bg-ok-950/40" : "border-ink-750 bg-ink-950"
                )}
              >
                <Eyebrow>Install target</Eyebrow>
                {isPinned ? (
                  <>
                    <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-ok-300">
                      <GitCommit className="h-3.5 w-3.5" />
                      Pinned to{" "}
                      {commitUrl ? (
                        <a
                          href={commitUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono underline decoration-ok-800 underline-offset-2 hover:decoration-ok-500"
                        >
                          {shortSha}
                        </a>
                      ) : (
                        <span className="font-mono">{shortSha || "a recorded commit"}</span>
                      )}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-500">
                      {skill.installArchiveUrl
                        ? "Installs fetch a stored snapshot of that commit, so the code can't change after the fact."
                        : "We recorded this commit, but the install still resolves against the live repository."}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="mt-1.5 text-sm text-ink-300">Live repository</p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-500">
                      Not pinned. Installing fetches whatever the repository holds at the time you
                      run the command.
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="mt-3">
              {handsOn ? (
                <Note tone="warn" icon={AlertTriangle}>
                  <span className="font-medium">Nobody has audited this code.</span> Our review
                  covers what the skill does when run, not whether its code is safe. A skill runs
                  with whatever access you give your agent — read the source before you install it.
                </Note>
              ) : safety && safety.verdict !== "unscannable" ? (
                <Note tone="warn" icon={AlertTriangle}>
                  <span className="font-medium">No human has reviewed this code.</span> The checks
                  below are a static scan of the files at one commit — nobody has run this skill or
                  judged whether it works. A skill runs with whatever access you give your agent, so
                  read the source before you install it.
                </Note>
              ) : (
                <Note tone="warn" icon={AlertTriangle}>
                  <span className="font-medium">Nobody has reviewed this code.</span> TrustedSkills
                  indexes and links skills; it does not audit, run or scan them. A skill runs with
                  whatever access you give your agent — read the source before you install it.
                </Note>
              )}
            </div>
          </Panel>

          {/* ── Automated safety pass ────────────────────────────────────
              Renders nothing until the scan has reached this skill, so the
              page never implies a check that has not run. */}
          <SafetyPanel report={safety} checks={safetyChecks} />

          {/* ── About ──────────────────────────────────────────────────
              Only for a long description. The short one is already in the
              header, and repeating it here would pad the page. */}
          {skill.longDescription && (
            <Panel>
              <h2 className="text-sm font-semibold text-ink-50">About this skill</h2>
              <div className="mt-stack-lg doc-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{skill.longDescription}</ReactMarkdown>
              </div>
            </Panel>
          )}

          {/* ── Requirements ─────────────────────────────────────────── */}
          {skill.requires &&
            (skill.requires.bins.length > 0 ||
              skill.requires.env.length > 0 ||
              skill.requires.config.length > 0) && (
              <Panel>
                <h2 className="text-sm font-semibold text-ink-50">Requirements</h2>
                <div className="mt-stack-lg space-y-stack-lg">
                  {skill.requires.bins.length > 0 && (
                    <div>
                      <Eyebrow>Required binaries</Eyebrow>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {skill.requires.bins.map((bin) => (
                          <Chip key={bin} mono className="text-ink-300">
                            {bin}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  )}
                  {skill.requires.env.length > 0 && (
                    <div>
                      <Eyebrow>Environment variables</Eyebrow>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {skill.requires.env.map((env) => (
                          <Chip key={env} mono className="border-warn-800 bg-warn-950 text-warn-300">
                            {env}
                          </Chip>
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-ink-500">
                        This skill expects these to be set in its environment — it will have
                        access to their values.
                      </p>
                    </div>
                  )}
                  {skill.requires.config.length > 0 && (
                    <div>
                      <Eyebrow>Config keys</Eyebrow>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {skill.requires.config.map((cfg) => (
                          <Chip key={cfg} mono className="text-ink-300">
                            {cfg}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Panel>
            )}

          {/* ── Tags ─────────────────────────────────────────────────── */}
          {skill.tags?.length > 0 && (
            <div>
              <Eyebrow className="flex items-center gap-1.5">
                <TagIcon className="h-3 w-3" />
                Tags
              </Eyebrow>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {skill.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/skills?q=${encodeURIComponent(tag)}`}
                    className="inline-flex items-center rounded-sm border border-ink-750 bg-ink-900 px-2 py-1 font-mono text-2xs text-ink-400 transition duration-fast ease-out hover:border-ink-650 hover:bg-ink-850 hover:text-ink-100"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Sidebar ─────────────────────────────────────────────────── */}
        <aside className="space-y-6">
          {/* ── Editorial ────────────────────────────────────────────────
              Links out to our own review and any collection featuring this
              skill. Both render nothing when there is none, which is the
              case for almost every listing. */}
          {review ? (
            <Panel>
              <div className="flex items-center gap-2">
                {handsOn ? (
                  <Flask className="h-4 w-4 text-ok-400" />
                ) : (
                  <BookOpen className="h-4 w-4 text-ink-450" />
                )}
                <h2 className="text-sm font-semibold text-ink-50">Our review</h2>
              </div>
              <p className="mt-2.5 text-sm text-ink-200">
                {review.verdict} <span className="text-ink-600">·</span>{" "}
                <span className="tabular">{review.overallScore.toFixed(1)}</span>
                <span className="text-ink-500">/5</span>
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-500">
                {handsOn
                  ? "We ran this skill against real work."
                  : "Based on reading the source and documentation. We have not run it yet."}
              </p>
              <Link
                href={`/reviews/${review.slug}`}
                className="mt-3 inline-block text-xs text-accent-400 transition-colors hover:text-accent-300"
              >
                Read the review →
              </Link>
            </Panel>
          ) : null}

          {collections.length > 0 ? (
            <Panel>
              <div className="flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-ink-450" />
                <h2 className="text-sm font-semibold text-ink-50">Featured in</h2>
              </div>
              <ul className="mt-2.5 space-y-2">
                {collections.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/collections/${c.slug}`}
                      className="text-sm leading-snug text-ink-300 transition-colors hover:text-accent-300"
                    >
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
          ) : null}

          <Panel>
            <h2 className="text-sm font-semibold text-ink-50">Details</h2>
            <div className="mt-2">
              <FieldList>
                <Field label="Version" value={<span className="font-mono">v{skill.version}</span>} icon={Package} />
                <Field label="Publisher" value={skill.author} icon={User} />
                <Field label="Licence" value={license} icon={Scale} />
                <Field label="Language" value={skill.language} icon={Code} />
                <Field label="Stars" value={stars} icon={Star} />
                <Field label="Installs" value={installs} icon={Download} />
                <Field
                  label="Updated"
                  icon={Clock}
                  value={
                    updated ? <time dateTime={isoDate(skill.updated_at) ?? undefined}>{updated}</time> : null
                  }
                />
                <Field
                  label="Published"
                  icon={Clock}
                  value={
                    published ? (
                      <time dateTime={isoDate(skill.published_at) ?? undefined}>{published}</time>
                    ) : null
                  }
                />
              </FieldList>
            </div>

            {!updated && !published ? (
              <p className="mt-3 border-t border-ink-800 pt-3 text-xs leading-relaxed text-ink-600">
                The source listing carries no date for this skill, so we don&apos;t show one.
              </p>
            ) : null}
          </Panel>

          {skill.platforms?.length > 0 && !installIsBroken(skill) && (
            <Panel>
              <Eyebrow>Install snippets available for</Eyebrow>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {skill.platforms.map((key) => (
                  <Link key={key} href={`/platform/${key}`}>
                    <Chip className="transition-colors hover:border-ink-650 hover:text-ink-100">
                      {PLATFORM_CONFIG[key]?.label ?? key}
                    </Chip>
                  </Link>
                ))}
              </div>
            </Panel>
          )}

          {/* Tier explainer. The text comes from TIER_CONFIG so a change to
              what a badge means can only be made in one place. */}
          <Panel>
            <div className="flex items-center gap-2">
              <TierIcon
                className={cx(
                  "h-4 w-4",
                  tier.tone === "accent"
                    ? "text-accent-400"
                    : tier.tone === "ok"
                    ? "text-ok-400"
                    : tier.tone === "warn"
                    ? "text-warn-400"
                    : "text-ink-450"
                )}
              />
              <h2 className="text-sm font-semibold text-ink-50">{tier.label}</h2>
            </div>
            <p className="mt-2.5 text-sm leading-relaxed text-ink-400">{tier.detail}</p>
            <Link
              href={`/tier/${skill.verified in TIER_CONFIG ? skill.verified : "community"}`}
              className="mt-3 inline-block text-xs text-accent-400 transition-colors hover:text-accent-300"
            >
              See all {tier.label.toLowerCase()} skills →
            </Link>
          </Panel>
        </aside>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
