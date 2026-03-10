import { getAllReviews, getReviewBySlug } from "../../../lib/reviews-content";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const reviews = getAllReviews();
  return reviews.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const review = getReviewBySlug(params.slug);
  if (!review) return {};
  return {
    title: review.title,
    description: review.description,
    keywords: review.targetKeyword,
    openGraph: {
      title: `${review.title} | TrustedSkills`,
      description: review.description,
      url: `https://trustedskills.dev/reviews/${review.slug}`,
      type: "article",
      publishedTime: review.lastUpdated,
      authors: [review.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title: `${review.title} | TrustedSkills`,
      description: review.description,
    },
  };
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
            className="bg-emerald-500 h-1.5 rounded-full transition-all"
            style={{ width: `${(score / 5) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

const VERDICT_COLORS: Record<string, string> = {
  "Highly Recommended": "bg-emerald-900 text-emerald-300 border-emerald-700",
  Recommended: "bg-blue-900 text-blue-300 border-blue-700",
  "Use With Caution": "bg-yellow-900 text-yellow-300 border-yellow-700",
  "Not Recommended": "bg-red-900 text-red-300 border-red-700",
};

function StarScore({ score }: { score: number }) {
  const full = Math.floor(score);
  const half = score % 1 >= 0.5;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={
            i <= full
              ? "text-yellow-400"
              : i === full + 1 && half
              ? "text-yellow-400/60"
              : "text-gray-600"
          }
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function ReviewDetailPage({ params }: Props) {
  const review = getReviewBySlug(params.slug);
  if (!review) notFound();

  const verdictClass =
    VERDICT_COLORS[review.verdict] ?? "bg-gray-800 text-gray-300 border-gray-700";

  const scoreEntries: { label: string; icon: string; key: keyof typeof review.scores }[] = [
    { label: "Ease of Install", icon: "🔧", key: "installation" },
    { label: "Documentation", icon: "📚", key: "documentation" },
    { label: "Depth", icon: "🔬", key: "depth" },
    { label: "Maintenance", icon: "🔄", key: "maintenance" },
    { label: "Platform Support", icon: "🖥️", key: "platformSupport" },
  ];

  // Article JSON-LD
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: review.title,
    description: review.description,
    author: {
      "@type": "Organization",
      name: review.author.name,
      url: "https://trustedskills.dev",
    },
    datePublished: review.lastUpdated,
    dateModified: review.lastUpdated,
    publisher: {
      "@type": "Organization",
      name: "TrustedSkills",
      url: "https://trustedskills.dev",
      logo: {
        "@type": "ImageObject",
        url: "https://trustedskills.dev/favicon.ico",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://trustedskills.dev/reviews/${review.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-500 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/reviews" className="hover:text-gray-300 transition-colors">Reviews</Link>
          <span>/</span>
          <span className="text-gray-400 truncate">{review.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${verdictClass}`}>
                  {review.verdict}
                </span>
                <span className="text-xs text-gray-500">
                  Last updated:{" "}
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

              {/* Author */}
              <div className="mt-6 flex items-start gap-3 text-sm text-gray-500 border-t border-gray-800 pt-4">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-base shrink-0">
                  🦀
                </div>
                <div>
                  <span className="text-gray-300 font-medium">{review.author.name}</span>
                  <p className="text-xs mt-0.5 text-gray-500">{review.author.bio}</p>
                </div>
              </div>
            </div>

            {/* Review body */}
            <div
              className="review-body prose-custom"
              dangerouslySetInnerHTML={{ __html: review.content }}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Score card */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-white mb-1">
                    {review.overallScore.toFixed(1)}
                    <span className="text-gray-600 text-2xl">/5</span>
                  </div>
                  <StarScore score={review.overallScore} />
                  <div className={`mt-3 text-sm font-semibold px-3 py-1 rounded-full border inline-block ${verdictClass}`}>
                    {review.verdict}
                  </div>
                </div>

                <div className="space-y-4">
                  {scoreEntries.map(({ label, icon, key }) => (
                    <ScoreBar
                      key={key}
                      label={label}
                      icon={icon}
                      score={review.scores[key]}
                    />
                  ))}
                </div>
              </div>

              {/* Quick links */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-gray-300 mb-4">Quick Links</h3>
                <div className="space-y-2 text-sm">
                  <a
                    href={`https://github.com/AgriciDaniel/claude-seo`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <span>↗</span> GitHub Repository
                  </a>
                  {review.skillSlug && (
                    <Link
                      href={`/skills/${review.skillSlug}`}
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <span>↗</span> Registry Entry
                    </Link>
                  )}
                  <a
                    href="https://github.com/AgriciDaniel/claude-seo/blob/main/docs/INSTALLATION.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <span>↗</span> Install Guide
                  </a>
                </div>
              </div>

              {/* Back to reviews */}
              <Link
                href="/reviews"
                className="flex items-center justify-center gap-2 w-full py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm text-gray-300 hover:text-white transition-all"
              >
                ← All Reviews
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
