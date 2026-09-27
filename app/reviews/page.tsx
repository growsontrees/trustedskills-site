import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllReviews,
  EVIDENCE_BASIS_CONFIG,
  VERDICT_CONFIG,
  NEUTRAL_BADGE,
} from "../../lib/reviews";
import { getAllCollections } from "../../lib/collections";

export const metadata: Metadata = {
  title: "Skill Reviews | TrustedSkills",
  description:
    "Independent assessments of AI agent skills. We say plainly which reviews are hands-on tests and which are source reviews — no sponsored content.",
  alternates: { canonical: "https://trustedskills.dev/reviews" },
  openGraph: {
    title: "Skill Reviews | TrustedSkills",
    description:
      "Independent assessments of AI agent skills — hands-on where we've run it, and labelled where we haven't.",
    url: "https://trustedskills.dev/reviews",
  },
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
            i <= full ? "text-yellow-400" : i === full + 1 && half ? "text-yellow-400/60" : "text-gray-600"
          }
        >
          ★
        </span>
      ))}
      <span className="ml-1 text-sm text-gray-400">{score.toFixed(1)}</span>
    </div>
  );
}

export default function ReviewsPage() {
  const reviews = getAllReviews();
  const collections = getAllCollections();
  const handsOn = reviews.filter((r) => r.evidenceBasis === "hands-on").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Skill Reviews</h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          Independent assessments of AI agent skills. No sponsored content, no affiliate links — and
          every review says up front whether we ran the skill or only read it.
        </p>
        <div className="flex flex-wrap items-center gap-6 mt-6 text-sm text-gray-500">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            {reviews.length} review{reviews.length !== 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-2">
            <span>🧪</span>
            {handsOn} hands-on tested
          </span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-24 text-gray-500">
          <p className="text-xl mb-2">No reviews yet</p>
          <p className="text-sm">Check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {reviews.map((review) => {
            const verdictClass = VERDICT_CONFIG[review.verdict]?.badge ?? NEUTRAL_BADGE;
            const basis = EVIDENCE_BASIS_CONFIG[review.evidenceBasis];
            return (
              <Link
                key={review.slug}
                href={`/reviews/${review.slug}`}
                className="group block bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-600 transition-all hover:bg-gray-800/50"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${verdictClass}`}>
                        {review.verdict}
                      </span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${basis.badge}`}>
                        {basis.icon} {basis.label}
                      </span>
                      {review.status === "draft" && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-purple-900 text-purple-300 border-purple-700">
                          Draft
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        Updated{" "}
                        {new Date(review.lastUpdated).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                      {review.title}
                    </h2>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">{review.description}</p>
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

      {/* Collections cross-link */}
      {collections.length > 0 && (
        <div className="mt-16">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Curated collections</h2>
            <Link href="/collections" className="text-sm text-blue-400 hover:text-blue-300">
              All collections →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {collections.slice(0, 4).map((collection) => (
              <Link
                key={collection.slug}
                href={`/collections/${collection.slug}`}
                className="group block bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-600 transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">{collection.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                      {collection.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">{collection.description}</p>
                    <p className="text-xs text-gray-500 mt-2">{collection.entries.length} skills</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Methodology */}
      <div className="mt-16 bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Our methodology</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-400">
          <div>
            <div className="text-gray-200 font-medium mb-1">🧪 Hands-on, or labelled</div>
            <p>
              A hands-on review means the skill was installed and pointed at real work, and the page
              lists the task and what happened. Where we&apos;ve only read the source, the review says
              so at the top and carries no measured results.
            </p>
          </div>
          <div>
            <div className="text-gray-200 font-medium mb-1">📊 Five scored dimensions</div>
            <p>
              Installation ease, documentation quality, feature depth, maintenance track record and
              platform support — each out of 5. The overall score is their mean, not a separate
              judgement.
            </p>
          </div>
          <div>
            <div className="text-gray-200 font-medium mb-1">🚫 No invented results</div>
            <p>
              We never publish a benchmark we didn&apos;t run, a screenshot we didn&apos;t take, or a
              testimonial we didn&apos;t receive. If we can&apos;t verify something, we write down that
              we can&apos;t.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
