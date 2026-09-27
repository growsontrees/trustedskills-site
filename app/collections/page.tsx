import type { Metadata } from "next";
import { getAllCollections } from "../../lib/collections";
import { formatDate } from "../../lib/skill-config";
import { ListChecks } from "../../components/icons";
import { CardLink, Chip, cx } from "../../components/ui";

export const metadata: Metadata = {
  title: "Curated Skill Collections | TrustedSkills",
  description:
    "Hand-made themed lists of AI agent skills worth installing — chosen and ordered by the job they do, not by download count.",
  alternates: { canonical: "https://trustedskills.dev/collections" },
  openGraph: {
    title: "Curated Skill Collections | TrustedSkills",
    description:
      "Hand-made themed lists of AI agent skills worth installing, chosen by the job they do.",
    url: "https://trustedskills.dev/collections",
  },
};

export default function CollectionsPage() {
  const collections = getAllCollections();

  return (
    <div className="mx-auto max-w-page px-4 py-10 sm:px-6 lg:px-8">
      <header className="border-b border-ink-800 pb-6">
        <h1 className="text-3xl font-semibold text-ink-50">Collections</h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-400">
          There are tens of thousands of skills in this index. A collection is the short list: a
          themed set chosen by hand, ordered by the stage of the work you&apos;d use each one at,
          with the reasoning written down.
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-500">
          Every collection states what its picks are based on and which of them we&apos;ve actually
          run. We don&apos;t imply testing we haven&apos;t done.
        </p>
      </header>

      {collections.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-ink-750 py-20 text-center">
          <h2 className="text-base font-semibold text-ink-200">No collections yet</h2>
          <p className="mt-2 text-sm text-ink-500">The first ones are in progress.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
          {collections.map((collection) => {
            const updated = formatDate(collection.lastUpdated);
            return (
              <CardLink
                key={collection.slug}
                href={`/collections/${collection.slug}`}
                className="p-gutter-lg"
              >
                <div className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-ink-750 bg-ink-850 text-ink-450 transition-colors duration-fast group-hover:border-ink-700 group-hover:text-accent-400">
                    <ListChecks className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Chip>{collection.entries.length} skills</Chip>
                      {collection.status === "draft" && (
                        <span
                          className={cx(
                            "inline-flex items-center rounded-sm border px-2 py-0.5 text-2xs font-medium",
                            "border-accent-800 bg-accent-950 text-accent-300"
                          )}
                        >
                          Draft
                        </span>
                      )}
                    </div>
                    <h2 className="mt-2.5 text-lg font-semibold text-ink-50">{collection.title}</h2>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-400">
                      {collection.description}
                    </p>
                    {updated ? (
                      <p className="mt-3 text-2xs text-ink-500">Updated {updated}</p>
                    ) : null}
                  </div>
                </div>
              </CardLink>
            );
          })}
        </div>
      )}
    </div>
  );
}
