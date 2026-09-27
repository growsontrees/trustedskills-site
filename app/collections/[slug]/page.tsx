import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Metadata } from "next";
import {
  getAllCollections,
  getCollectionBySlug,
  resolveEntries,
} from "../../../lib/collections";
import { getReviewedSkillSlugs, getReviewForSkill } from "../../../lib/reviews";
import { formatCount, tierOf } from "../../../lib/skill-config";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 86400;

export async function generateStaticParams() {
  return getAllCollections().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return {};
  return {
    title: `${collection.title} | TrustedSkills`,
    description: collection.description,
    keywords: collection.targetKeyword,
    robots: collection.status === "draft" ? { index: false, follow: false } : undefined,
    alternates: { canonical: `https://trustedskills.dev/collections/${collection.slug}` },
    openGraph: {
      title: `${collection.title} | TrustedSkills`,
      description: collection.description,
      url: `https://trustedskills.dev/collections/${collection.slug}`,
      type: "article",
      publishedTime: collection.publishedAt,
      modifiedTime: collection.lastUpdated,
    },
    twitter: {
      card: "summary_large_image",
      title: `${collection.title} | TrustedSkills`,
      description: collection.description,
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

export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  const entries = resolveEntries(collection);
  const reviewed = getReviewedSkillSlugs();

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: collection.title,
    description: collection.description,
    numberOfItems: entries.length,
    itemListElement: entries.map((entry, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: entry.skill.name,
      url: `https://trustedskills.dev/skills/${entry.skill.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {collection.status === "draft" && (
          <div className="mb-8 bg-purple-950 border border-purple-700 rounded-xl p-4 text-sm text-purple-200">
            <strong>Draft — not published.</strong> This collection is awaiting editorial approval and
            is not served in production.
          </div>
        )}

        <nav className="mb-8 text-sm text-gray-500 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-gray-300 transition-colors">Collections</Link>
          <span>/</span>
          <span className="text-gray-400 truncate">{collection.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="text-5xl mb-4">{collection.emoji}</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            {collection.title}
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">{collection.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 border-t border-gray-800 pt-4">
            <span>
              <span className="text-gray-300">{entries.length}</span> skills
            </span>
            <span>
              Curated by <span className="text-gray-300">{collection.curator.name}</span>
            </span>
            <span>
              Updated{" "}
              {new Date(collection.lastUpdated).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </header>

        {/* Intro */}
        <section className="mb-10">
          <Md>{collection.intro}</Md>
        </section>

        {/* Evidence note — above the list, deliberately */}
        <section className="mb-10">
          <div className="bg-amber-950/40 border border-amber-800 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <span>🔎</span> What this list is based on
            </h2>
            <div className="text-sm [&_p:last-child]:mb-0">
              <Md>{collection.evidenceNote}</Md>
            </div>
          </div>
        </section>

        {/* The list */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">The list</h2>
          <ol className="space-y-5">
            {entries.map((entry, i) => {
              const tier = tierOf(entry.skill);
              const installs = formatCount(entry.skill.installs);
              const review = reviewed.has(entry.skill.slug)
                ? getReviewForSkill(entry.skill.slug)
                : undefined;
              return (
                <li
                  key={entry.skill.slug}
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <span className="shrink-0 w-8 h-8 rounded-lg bg-gray-800 text-gray-400 flex items-center justify-center text-sm font-semibold tabular-nums">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      {entry.role && (
                        <div className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-1">
                          {entry.role}
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-white mb-1">
                        <Link
                          href={`/skills/${entry.skill.slug}`}
                          className="hover:text-blue-300 transition-colors"
                        >
                          {entry.skill.name}
                        </Link>
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mb-4">
                        <span className="font-mono">{entry.skill.author}</span>
                        <span>·</span>
                        <span>{tier.label}</span>
                        {installs && (
                          <>
                            <span>·</span>
                            <span>{installs} installs</span>
                          </>
                        )}
                        {review && (
                          <Link
                            href={`/reviews/${review.slug}`}
                            className="text-emerald-400 hover:text-emerald-300 font-semibold"
                          >
                            🧪 Reviewed
                          </Link>
                        )}
                      </div>

                      <div className="text-sm [&_p:last-child]:mb-0">
                        <Md>{entry.note}</Md>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                        <Link
                          href={`/skills/${entry.skill.slug}`}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          Install instructions →
                        </Link>
                        {entry.skill.repoUrl && (
                          <a
                            href={entry.skill.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-gray-300 transition-colors"
                          >
                            Source ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* How the list was built */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">How this list was built</h2>
          <Md>{collection.criteria}</Md>
        </section>

        {/* Curator */}
        <section className="mb-12 bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-300 mb-2">About the curator</h2>
          <p className="text-gray-200 font-medium text-sm">{collection.curator.name}</p>
          <p className="text-gray-500 text-sm mt-1">{collection.curator.bio}</p>
        </section>

        <Link
          href="/collections"
          className="inline-flex items-center gap-2 px-5 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm text-gray-300 hover:text-white transition-all"
        >
          ← All collections
        </Link>
      </div>
    </>
  );
}
