import type { Metadata } from "next";
import Link from "next/link";
import { getAllCollections } from "../../lib/collections";

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Collections</h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          There are tens of thousands of skills in this registry. A collection is the short list: a
          themed set chosen by hand, ordered by the stage of the work you&apos;d use each one at, with
          the reasoning written down.
        </p>
        <p className="text-gray-500 text-sm mt-4 max-w-2xl">
          Every collection states what its picks are based on and which of them we&apos;ve actually run.
          We don&apos;t imply testing we haven&apos;t done.
        </p>
      </div>

      {collections.length === 0 ? (
        <div className="text-center py-24 text-gray-500">
          <p className="text-xl mb-2">No collections yet</p>
          <p className="text-sm">The first ones are in progress.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collections.map((collection) => (
            <Link
              key={collection.slug}
              href={`/collections/${collection.slug}`}
              className="group block bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-600 hover:bg-gray-800/50 transition-all"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl shrink-0">{collection.emoji}</span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs text-gray-500">
                      {collection.entries.length} skills
                    </span>
                    {collection.status === "draft" && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full border bg-purple-900 text-purple-300 border-purple-700">
                        Draft
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                    {collection.title}
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed">{collection.description}</p>
                  <p className="text-xs text-gray-500 mt-3">
                    Updated{" "}
                    {new Date(collection.lastUpdated).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
