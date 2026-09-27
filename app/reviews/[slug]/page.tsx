import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Metadata } from "next";
import {
  getAllReviews,
  getReviewBySlug,
  EVIDENCE_BASIS_CONFIG,
  SCORE_DIMENSIONS,
  VERDICT_CONFIG,
  NEUTRAL_BADGE,
  type Review,
} from "../../../lib/reviews";
import { getSkillBySlug } from "../../../lib/skills";
import { getCollectionsForSkill } from "../../../lib/collections";
import {
  ChevronDown,
  Shield,
  Star,
  Zap,
  type IconComponent,
} from "../../../components/icons";
import { cx } from "../../../components/ui";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 86400;

export async function generateStaticParams() {
  return getAllReviews().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const review = getReviewBySlug(slug);
  if (!review) return {};
  return {
    title: review.title,
    description: review.description,
    keywords: review.targetKeyword,
    robots: review.status === "draft" ? { index: false, follow: false } : undefined,
    alternates: { canonical: `https://trustedskills.dev/reviews/${review.slug}` },
    openGraph: {
      title: `${review.title} | TrustedSkills`,
      description: review.description,
      url: `https://trustedskills.dev/reviews/${review.slug}`,
      type: "article",
      publishedTime: review.publishedAt,
      modifiedTime: review.lastUpdated,
      authors: [review.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title: `${review.title} | TrustedSkills`,
      description: review.description,
    },
  };
}

function Md({ children }: { children: string }) {
  return (
    <div className="doc-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}

function ScoreBar({
  label,
  score,
  icon: Icon,
}: {
  label: string;
  score: number;
  icon: IconComponent;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 shrink-0 text-ink-450" />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-ink-300">{label}</span>
          <span className="text-sm font-semibold text-ink-50">{score}/5</span>
        </div>
        <div className="w-full bg-ink-800 rounded-full h-1.5">
          <div
            className="bg-ok-500 h-1.5 rounded-full"
            style={{ width: `${(score / 5) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function StarScore({ score }: { score: number }) {
  const full = Math.floor(score);
  const half = score % 1 >= 0.5;
  return (
    <div className="flex items-center justify-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cx(
            "h-4 w-4",
            i <= full ? "text-warn-400" : i === full + 1 && half ? "text-warn-600" : "text-ink-700"
          )}
        />
      ))}
    </div>
  );
}

/** Points with a title and a markdown body — strengths, limitations, best-for. */
function PointList({
  points,
  accent,
}: {
  points: Review["strengths"];
  accent: string;
}) {
  return (
    <div className="space-y-4">
      {points.map((point) => (
        <div
          key={point.title}
          className={`bg-ink-850 rounded-xl p-5 border-l-4 ${accent}`}
        >
          <h3 className="font-semibold text-ink-50 mb-2">{point.title}</h3>
          <div className="text-sm [&_p:last-child]:mb-0">
            <Md>{point.body}</Md>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function ReviewDetailPage({ params }: Props) {
  const { slug } = await params;
  const review = getReviewBySlug(slug);
  if (!review) notFound();

  const verdictClass = VERDICT_CONFIG[review.verdict]?.badge ?? NEUTRAL_BADGE;
  const basis = EVIDENCE_BASIS_CONFIG[review.evidenceBasis];
  const BasisIcon = basis.icon;
  const skill = getSkillBySlug(review.skillSlug);
  const collections = getCollectionsForSkill(review.skillSlug);

  // Only a review backed by a real run is marked up as a Review in structured
  // data. A source review is an Article about the skill, and saying so keeps
  // the rich-result claim honest.
  const schema =
    review.evidenceBasis === "hands-on"
      ? {
          "@context": "https://schema.org",
          "@type": "Review",
          name: review.title,
          reviewBody: review.description,
          datePublished: review.publishedAt,
          dateModified: review.lastUpdated,
          itemReviewed: {
            "@type": "SoftwareApplication",
            name: skill?.name ?? review.skillSlug,
            applicationCategory: "DeveloperApplication",
            url: skill?.repoUrl ?? `https://trustedskills.dev/skills/${review.skillSlug}`,
          },
          reviewRating: {
            "@type": "Rating",
            ratingValue: String(review.overallScore),
            bestRating: "5",
            worstRating: "1",
          },
          author: { "@type": "Organization", name: "TrustedSkills", url: "https://trustedskills.dev" },
        }
      : {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: review.title,
          description: review.description,
          datePublished: review.publishedAt,
          dateModified: review.lastUpdated,
          author: { "@type": "Organization", name: "TrustedSkills", url: "https://trustedskills.dev" },
          publisher: {
            "@type": "Organization",
            name: "TrustedSkills",
            url: "https://trustedskills.dev",
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://trustedskills.dev/reviews/${review.slug}`,
          },
        };

  const faqSchema =
    review.faq && review.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: review.faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {review.status === "draft" && (
          <div className="mb-8 bg-accent-950 border border-accent-800 rounded-xl p-4 text-sm text-accent-200">
            <strong>Draft — not published.</strong> This review is awaiting editorial approval and is
            not served in production.
          </div>
        )}

        <nav className="mb-8 text-sm text-ink-450 flex items-center gap-2">
          <Link href="/" className="hover:text-ink-300 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/reviews" className="hover:text-ink-300 transition-colors">Reviews</Link>
          <span>/</span>
          <span className="text-ink-400 truncate">{review.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span
                  className={`inline-flex items-center rounded-sm border px-2 py-0.5 text-2xs font-medium ${verdictClass}`}
                >
                  {review.verdict}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-2xs font-medium ${basis.badge}`}
                >
                  <BasisIcon className="h-3 w-3" />
                  {basis.label}
                </span>
                <span className="text-xs text-ink-450">
                  Updated{" "}
                  {new Date(review.lastUpdated).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-ink-50 mb-4 leading-tight">
                {review.title}
              </h1>
              <p className="text-ink-400 text-lg leading-relaxed">{review.description}</p>

              <div className="mt-6 flex items-start gap-3 text-sm text-ink-450 border-t border-ink-800 pt-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-ink-750 bg-ink-850 text-ink-450">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-ink-300 font-medium">{review.author.name}</span>
                  <p className="text-xs mt-0.5 text-ink-450">{review.author.bio}</p>
                </div>
              </div>
            </div>

            {/* How we know — the honesty block, deliberately above the verdict */}
            <div
              className={`mb-10 rounded-xl p-5 border ${
                review.evidenceBasis === "hands-on"
                  ? "bg-ok-950 border-ok-800"
                  : "bg-warn-950 border-warn-800"
              }`}
            >
              <h2 className="text-sm font-bold text-ink-50 mb-2 flex items-center gap-2">
                <BasisIcon className="h-4 w-4" /> How we know
              </h2>
              <p className="text-sm text-ink-300 leading-relaxed">{basis.blurb}</p>
              {review.basisNote && (
                <div className="mt-3 text-sm [&_p:last-child]:mb-0">
                  <Md>{review.basisNote}</Md>
                </div>
              )}
            </div>

            {/* Quick verdict */}
            <section className="mb-10">
              <div className="bg-ink-900 border border-ink-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="h-4 w-4 text-warn-400" />
                  <h2 className="text-lg font-bold text-ink-50">Quick verdict</h2>
                  <span className={`ml-auto text-xs font-semibold px-3 py-1 rounded-full border ${verdictClass}`}>
                    {review.verdict}
                  </span>
                </div>
                <div className="[&_p:last-child]:mb-0">
                  <Md>{review.summary}</Md>
                </div>
              </div>
            </section>

            {/* The runs */}
            {review.runs.length > 0 && (
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-ink-50 mb-4">What we ran it on</h2>
                <div className="space-y-4">
                  {review.runs.map((run, i) => (
                    <div key={i} className="bg-ink-900 border border-ink-800 rounded-xl p-5">
                      <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
                        <span className="bg-ink-850 text-ink-300 px-2 py-1 rounded-full font-mono">
                          {run.platform}
                        </span>
                        {run.skillVersion && (
                          <span className="bg-ink-850 text-ink-400 px-2 py-1 rounded-full font-mono">
                            {run.skillVersion}
                          </span>
                        )}
                        <span className="text-ink-450">
                          {new Date(run.testedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-ink-200 mb-1">The task</h3>
                      <div className="text-sm mb-3 [&_p:last-child]:mb-0">
                        <Md>{run.task}</Md>
                      </div>
                      <h3 className="text-sm font-semibold text-ink-200 mb-1">What happened</h3>
                      <div className="text-sm [&_p:last-child]:mb-0">
                        <Md>{run.outcome}</Md>
                      </div>
                      {run.environment && (
                        <p className="mt-3 text-xs text-ink-450">
                          <span className="text-ink-400 font-medium">Environment:</span> {run.environment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Free-form sections */}
            {review.sections?.map((section) => (
              <section key={section.heading} className="mb-10">
                <h2 className="text-2xl font-bold text-ink-50 mb-4">{section.heading}</h2>
                <Md>{section.body}</Md>
              </section>
            ))}

            {/* Strengths */}
            {review.strengths.length > 0 && (
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-ink-50 mb-4">What it does well</h2>
                <PointList points={review.strengths} accent="border-green-500" />
              </section>
            )}

            {/* Limitations */}
            {review.limitations.length > 0 && (
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-ink-50 mb-4">Where it stops</h2>
                <PointList points={review.limitations} accent="border-risk-500" />
              </section>
            )}

            {/* Who it's for */}
            {review.bestFor && review.bestFor.length > 0 && (
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-ink-50 mb-4">Who should use it</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {review.bestFor.map((point) => (
                    <div key={point.title} className="bg-ink-850 rounded-xl p-5">
                      <h3 className="font-semibold text-ink-50 mb-2">{point.title}</h3>
                      <div className="text-sm [&_p:last-child]:mb-0">
                        <Md>{point.body}</Md>
                      </div>
                    </div>
                  ))}
                </div>
                {review.notFor && (
                  <div className="bg-ink-850 rounded-xl p-5 mt-4 border border-risk-800">
                    <h3 className="mb-2 font-semibold text-ink-50">Probably not for you if…</h3>
                    <div className="text-sm [&_p:last-child]:mb-0">
                      <Md>{review.notFor}</Md>
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Legacy hand-written body, for reviews not yet migrated */}
            {review.legacyHtml && (
              <div
                className="review-body doc-content mb-10"
                dangerouslySetInnerHTML={{ __html: review.legacyHtml }}
              />
            )}

            {/* FAQ */}
            {review.faq && review.faq.length > 0 && (
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-ink-50 mb-6">Frequently asked questions</h2>
                <div className="space-y-4">
                  {review.faq.map((item) => (
                    <details key={item.question} className="bg-ink-850 rounded-xl p-5 group">
                      <summary className="font-semibold text-ink-50 cursor-pointer list-none flex items-center justify-between gap-4">
                        {item.question}
                        <ChevronDown className="h-4 w-4 shrink-0 text-ink-500 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="text-sm mt-3 [&_p:last-child]:mb-0">
                        <Md>{item.answer}</Md>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-ink-900 border border-ink-800 rounded-xl p-6">
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-ink-50 mb-1">
                    {review.overallScore.toFixed(1)}
                    <span className="text-ink-500 text-2xl">/5</span>
                  </div>
                  <StarScore score={review.overallScore} />
                  <div
                    className={`mt-3 text-sm font-semibold px-3 py-1 rounded-full border inline-block ${verdictClass}`}
                  >
                    {review.verdict}
                  </div>
                </div>
                <div className="space-y-4">
                  {SCORE_DIMENSIONS.map(({ key, label, icon }) => (
                    <ScoreBar key={key} label={label} icon={icon} score={review.scores[key]} />
                  ))}
                </div>
              </div>

              {/* Links come from the review, not from hardcoded markup */}
              <div className="bg-ink-900 border border-ink-800 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-ink-300 mb-4">Quick links</h3>
                <div className="space-y-2 text-sm">
                  {skill && (
                    <Link
                      href={`/skills/${skill.slug}`}
                      className="flex items-center gap-2 text-ink-400 hover:text-ink-50 transition-colors"
                    >
                      <span>↗</span> Registry entry
                    </Link>
                  )}
                  {review.links?.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-ink-400 hover:text-ink-50 transition-colors"
                    >
                      <span>↗</span> {link.label}
                    </a>
                  ))}
                </div>
              </div>

              {collections.length > 0 && (
                <div className="bg-ink-900 border border-ink-800 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-ink-300 mb-4">Featured in</h3>
                  <div className="space-y-2 text-sm">
                    {collections.map((collection) => (
                      <Link
                        key={collection.slug}
                        href={`/collections/${collection.slug}`}
                        className="flex items-start gap-2 text-ink-400 hover:text-ink-50 transition-colors"
                      >
                        <span>{collection.emoji}</span>
                        <span>{collection.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <Link
                href="/reviews"
                className="flex items-center justify-center gap-2 w-full py-3 bg-ink-850 hover:bg-ink-800 rounded-xl text-sm text-ink-300 hover:text-ink-50 transition-all"
              >
                ← All reviews
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
