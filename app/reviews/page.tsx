import type { Metadata } from "next";
import Link from "next/link";
import { getAllReviews } from "@/lib/reviews-content";

export const metadata: Metadata = {
  title: "Skill Reviews",
  description:
    "In-depth reviews of AI agent skills — tested on real sites, scored honestly. No sponsored content.",
  openGraph: {
    title: "Skill Reviews — TrustedSkills",
    description:
      "In-depth reviews of AI agent skills — tested on real sites, scored honestly.",
    url: "https://trustedskills.dev/reviews",
  },
};

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
        <span key={i} className={i <= full ? "text-yellow-400" : i === full + 1 && half ? "text-yellow-400/60" : "text-gray-600"}>
          ★
        </span>
      ))}
      <span className="ml-1 text-sm text-gray-400">{score.toFixed(1)}</span>
    </div>
  );
}

export default function ReviewsPage() {
  const reviews = getAllReviews();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Skill Reviews</h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          We install AI agent skills, run them against real sites, and tell you what we actually found.
          No sponsored content. No affiliate links. Just honest assessments.
        </p>
        <div className="flex items-center gap-6 mt-6 text-sm text-gray-500">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            {reviews.length} review{reviews.length !== 1 ? "s" : ""}
          </span>
          <span>Updated {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
        </div>
      </div>

      {/* Reviews grid */}
      {reviews.length === 0 ? (
        <div className="text-center py-24 text-gray-500">
          <p className="text-xl mb-2">No reviews yet</p>
          <p className="text-sm">Check back soon — we&apos;re reviewing skills every week.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {reviews.map((review) => {
            const verdictClass =
              VERDICT_COLORS[review.verdict] ??
              "bg-gray-800 text-gray-300 border-gray-700";
            return (
              <Link
                key={review.slug}
                href={`/reviews/${review.slug}`}
                className="group block bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-600 transition-all hover:bg-gray-800/50"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${verdictClass}`}
                      >
                        {review.verdict}
                      </span>
                      <span className="text-xs text-gray-500">
                        Updated {new Date(review.lastUpdated).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                      {review.title}
                    </h2>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                      {review.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                      <StarScore score={review.overallScore} />
                      <span>by {review.author.name}</span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-3xl font-bold text-white">
                      {review.overallScore.toFixed(1)}
                      <span className="text-gray-600 text-lg">/5</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Overall</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Methodology note */}
      <div className="mt-16 bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Our Methodology</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-400">
          <div>
            <div className="text-gray-200 font-medium mb-1">We install it</div>
            <p>Every skill we review is actually installed and run — not just read about. We test against real sites, including this one.</p>
          </div>
          <div>
            <div className="text-gray-200 font-medium mb-1">We score 5 dimensions</div>
            <p>Installation ease, documentation quality, feature depth, maintenance track record, and platform support. Each out of 5.</p>
          </div>
          <div>
            <div className="text-gray-200 font-medium mb-1">We&apos;re honest about gaps</div>
            <p>If we can&apos;t verify something without actually running the tool, we say so. No fabricated benchmark numbers or fake screenshots.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
