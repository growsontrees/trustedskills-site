import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllReviews,
  EVIDENCE_BASIS_CONFIG,
  VERDICT_CONFIG,
  NEUTRAL_BADGE,
} from "../../lib/reviews";
import { getAllCollections } from "../../lib/collections";
import { formatDate } from "../../lib/skill-config";
import { ArrowRight, BarChart, Flask, ListChecks, Shield, Star } from "../../components/icons";
import { CardLink, Chip, Eyebrow, Panel, SectionHeading, cx } from "../../components/ui";

export const metadata: Metadata = {
  title: "Skill Reviews",
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

const BADGE = "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-2xs font-medium";

function StarScore({ score }: { score: number }) {
  const full = Math.floor(score);
  const half = score % 1 >= 0.5;
  return (
    <div className="flex items-center gap-0.5" title={`${score.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cx(
            "h-3.5 w-3.5",
            i <= full ? "text-warn-400" : i === full + 1 && half ? "text-warn-600" : "text-ink-700"
          )}
        />
      ))}
      <span className="tabular ml-1.5 text-xs text-ink-450">{score.toFixed(1)}</span>
    </div>
  );
}

export default function ReviewsPage() {
  const reviews = getAllReviews();
  const collections = getAllCollections();
  const handsOn = reviews.filter((r) => r.evidenceBasis === "hands-on").length;

  return (
    <div className="mx-auto max-w-page px-4 py-10 sm:px-6 lg:px-8">
      <header className="border-b border-ink-800 pb-6">
        <h1 className="text-3xl font-semibold text-ink-50">Skill reviews</h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-400">
          Independent assessments of AI agent skills. No sponsored content, no affiliate links —
          and every review says up front whether we ran the skill or only read it.
        </p>
        <div className="tabular mt-5 flex flex-wrap items-center gap-5 text-sm text-ink-450">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-ok-500" />
            {reviews.length} review{reviews.length !== 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1.5">
            <Flask className="h-3.5 w-3.5" />
            {handsOn} hands-on tested
          </span>
        </div>
      </header>

      {reviews.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-ink-750 py-20 text-center">
          <h2 className="text-base font-semibold text-ink-200">No reviews yet</h2>
          <p className="mt-2 text-sm text-ink-500">Check back soon.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-3">
          {reviews.map((review) => {
            const verdictClass = VERDICT_CONFIG[review.verdict]?.badge ?? NEUTRAL_BADGE;
            const basis = EVIDENCE_BASIS_CONFIG[review.evidenceBasis];
            const BasisIcon = basis.icon;
            const updated = formatDate(review.lastUpdated);
            return (
              <CardLink key={review.slug} href={`/reviews/${review.slug}`} className="p-gutter-lg">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={cx(BADGE, verdictClass)}>{review.verdict}</span>
                      <span className={cx(BADGE, basis.badge)}>
                        <BasisIcon className="h-3 w-3" />
                        {basis.label}
                      </span>
                      {review.status === "draft" && (
                        <span className={cx(BADGE, "border-accent-800 bg-accent-950 text-accent-300")}>
                          Draft
                        </span>
                      )}
                      {updated ? (
                        <span className="text-2xs text-ink-500">Updated {updated}</span>
                      ) : null}
                    </div>

                    <h2 className="mt-2.5 text-lg font-semibold text-ink-50 transition-colors group-hover:text-ink-50">
                      {review.title}
                    </h2>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-400">
                      {review.description}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-5 text-xs text-ink-500">
                      <StarScore score={review.overallScore} />
                      <span>by {review.author.name}</span>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="tabular text-3xl font-semibold text-ink-50">
                      {review.overallScore.toFixed(1)}
                      <span className="text-lg text-ink-600">/5</span>
                    </div>
                    <div className="mt-0.5 text-2xs text-ink-500">Overall</div>
                  </div>
                </div>
              </CardLink>
            );
          })}
        </div>
      )}

      {collections.length > 0 && (
        <section className="mt-section">
          <SectionHeading
            icon={ListChecks}
            title="Curated collections"
            action={{ href: "/collections", label: "All collections" }}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {collections.slice(0, 4).map((collection) => (
              <CardLink key={collection.slug} href={`/collections/${collection.slug}`}>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-ink-750 bg-ink-850 text-ink-450 transition-colors duration-fast group-hover:text-accent-400">
                    <ListChecks className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-ink-100">{collection.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-450">
                      {collection.description}
                    </p>
                    <Chip className="mt-2.5">{collection.entries.length} skills</Chip>
                  </div>
                </div>
              </CardLink>
            ))}
          </div>
        </section>
      )}

      <section className="mt-section">
        <Panel>
          <h2 className="text-sm font-semibold text-ink-50">How we review</h2>
          <div className="mt-stack-lg grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                icon: Flask,
                title: "Hands-on, or labelled",
                body: "A hands-on review means the skill was installed and pointed at real work, and the page lists the task and what happened. Where we've only read the source, the review says so at the top and carries no measured results.",
              },
              {
                icon: BarChart,
                title: "Five scored dimensions",
                body: "Installation ease, documentation quality, feature depth, maintenance track record and platform support — each out of 5. The overall score is their mean, not a separate judgement.",
              },
              {
                icon: Shield,
                title: "No invented results",
                body: "We never publish a benchmark we didn't run, a screenshot we didn't take, or a testimonial we didn't receive. If we can't verify something, we write down that we can't.",
              },
            ].map((item) => (
              <div key={item.title}>
                <Eyebrow className="flex items-center gap-1.5">
                  <item.icon className="h-3.5 w-3.5" />
                  {item.title}
                </Eyebrow>
                <p className="mt-2 text-sm leading-relaxed text-ink-450">{item.body}</p>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <div className="mt-section flex justify-center">
        <Link
          href="/skills"
          className="group inline-flex items-center gap-1.5 text-sm text-ink-450 transition-colors hover:text-ink-100"
        >
          Browse every skill in the index
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-fast ease-out group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
