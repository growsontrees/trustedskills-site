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

function ScoreBar({ label, score, icon }: { label: string; score: number; icon: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-lg w-6 shrink-0">{icon}</span>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-300">{label}</span>
          <span className="text-sm font-semibold text-white">{score}/5</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1.5">
          <div
            className="bg-emerald-500 h-1.5 rounded-full"
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
        <span
          key={i}
          className={
            i <= full ? "text-yellow-400" : i === full + 1 && half ? "text-yellow-400/60" : "text-gray-600"
          }
        >
          ★
        </span>
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
          className={`bg-gray-800 rounded-xl p-5 border-l-4 ${accent}`}
        >
          <h3 className="font-semibold text-white mb-2">{point.title}</h3>
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
          <div className="mb-8 bg-purple-950 border border-purple-700 rounded-xl p-4 text-sm text-purple-200">
            <strong>Draft — not published.</strong> This review is awaiting editorial approval and is
            not served in production.
          </div>
        )}

        <nav className="mb-8 text-sm text-gray-500 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/reviews" className="hover:text-gray-300 transition-colors">Reviews</Link>
          <span>/</span>
          <span className="text-gray-400 truncate">{review.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${verdictClass}`}>
                  {review.verdict}
                </span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${basis.badge}`}>
                  {basis.icon} {basis.label}
                </span>
                <span className="text-xs text-gray-500">
                  Updated{" "}
                  {new Date(review.lastUpdated).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                {review.title}
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed">{review.description}</p>

              <div className="mt-6 flex items-start gap-3 text-sm text-gray-500 border-t border-gray-800 pt-4">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-base shrink-0">
                  🛡️
                </div>
                <div>
                  <span className="text-gray-300 font-medium">{review.author.name}</span>
                  <p className="text-xs mt-0.5 text-gray-500">{review.author.bio}</p>
                </div>
              </div>
            </div>

            {/* How we know — the honesty block, deliberately above the verdict */}
            <div
              className={`mb-10 rounded-2xl p-5 border ${
                review.evidenceBasis === "hands-on"
                  ? "bg-emerald-950/50 border-emerald-800"
                  : "bg-amber-950/40 border-amber-800"
              }`}
            >
              <h2 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <span>{basis.icon}</span> How we know
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed">{basis.blurb}</p>
              {review.basisNote && (
                <div className="mt-3 text-sm [&_p:last-child]:mb-0">
                  <Md>{review.basisNote}</Md>
                </div>
              )}
            </div>

            {/* Quick verdict */}
            <section className="mb-10">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">⚡</span>
                  <h2 className="text-lg font-bold text-white">Quick verdict</h2>
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
                <h2 className="text-2xl font-bold text-white mb-4">What we ran it on</h2>
                <div className="space-y-4">
                  {review.runs.map((run, i) => (
                    <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                      <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
                        <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded-full font-mono">
                          {run.platform}
                        </span>
                        {run.skillVersion && (
                          <span className="bg-gray-800 text-gray-400 px-2 py-1 rounded-full font-mono">
                            {run.skillVersion}
                          </span>
                        )}
                        <span className="text-gray-500">
                          {new Date(run.testedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-200 mb-1">The task</h3>
                      <div className="text-sm mb-3 [&_p:last-child]:mb-0">
                        <Md>{run.task}</Md>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-200 mb-1">What happened</h3>
                      <div className="text-sm [&_p:last-child]:mb-0">
                        <Md>{run.outcome}</Md>
                      </div>
                      {run.environment && (
                        <p className="mt-3 text-xs text-gray-500">
                          <span className="text-gray-400 font-medium">Environment:</span> {run.environment}
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
                <h2 className="text-2xl font-bold text-white mb-4">{section.heading}</h2>
                <Md>{section.body}</Md>
              </section>
            ))}

            {/* Strengths */}
            {review.strengths.length > 0 && (
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4">What it does well</h2>
                <PointList points={review.strengths} accent="border-green-500" />
              </section>
            )}

            {/* Limitations */}
            {review.limitations.length > 0 && (
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4">Where it stops</h2>
                <PointList points={review.limitations} accent="border-red-500" />
              </section>
            )}

            {/* Who it's for */}
            {review.bestFor && review.bestFor.length > 0 && (
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4">Who should use it</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {review.bestFor.map((point) => (
                    <div key={point.title} className="bg-gray-800 rounded-xl p-5">
                      <h3 className="font-semibold text-white mb-2">{point.title}</h3>
                      <div className="text-sm [&_p:last-child]:mb-0">
                        <Md>{point.body}</Md>
                      </div>
                    </div>
                  ))}
                </div>
                {review.notFor && (
                  <div className="bg-gray-800 rounded-xl p-5 mt-4 border border-red-800">
                    <h3 className="font-semibold text-white mb-2">🙅 Probably not for you if…</h3>
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
                <h2 className="text-2xl font-bold text-white mb-6">Frequently asked questions</h2>
                <div className="space-y-4">
                  {review.faq.map((item) => (
                    <details key={item.question} className="bg-gray-800 rounded-xl p-5 group">
                      <summary className="font-semibold text-white cursor-pointer list-none flex items-center justify-between gap-4">
                        {item.question}
                        <span className="text-gray-400 group-open:rotate-180 transition-transform shrink-0">▼</span>
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
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-white mb-1">
                    {review.overallScore.toFixed(1)}
                    <span className="text-gray-600 text-2xl">/5</span>
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
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-gray-300 mb-4">Quick links</h3>
                <div className="space-y-2 text-sm">
                  {skill && (
                    <Link
                      href={`/skills/${skill.slug}`}
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
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
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <span>↗</span> {link.label}
                    </a>
                  ))}
                </div>
              </div>

              {collections.length > 0 && (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <h3 className="text-sm font-semibold text-gray-300 mb-4">Featured in</h3>
                  <div className="space-y-2 text-sm">
                    {collections.map((collection) => (
                      <Link
                        key={collection.slug}
                        href={`/collections/${collection.slug}`}
                        className="flex items-start gap-2 text-gray-400 hover:text-white transition-colors"
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
                className="flex items-center justify-center gap-2 w-full py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm text-gray-300 hover:text-white transition-all"
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
