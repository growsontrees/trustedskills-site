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
import { formatCount, formatDate, tierOf } from "../../../lib/skill-config";
import { ArrowLeft, ExternalLink, Flask, ListChecks, Search } from "../../../components/icons";
import { Eyebrow, Panel, TierChip } from "../../../components/ui";

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

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {collection.status === "draft" && (
          <div className="mb-8 rounded-lg border border-accent-800 bg-accent-950 p-4 text-sm text-accent-200">
            <strong className="font-semibold">Draft — not published.</strong> This collection is
            awaiting editorial approval and is not served in production.
          </div>
        )}

        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-ink-500">
          <Link href="/" className="transition-colors hover:text-ink-200">Home</Link>
          <span className="text-ink-700">/</span>
          <Link href="/collections" className="transition-colors hover:text-ink-200">Collections</Link>
          <span className="text-ink-700">/</span>
          <span className="truncate text-ink-300">{collection.title}</span>
        </nav>

        {/* Header */}
        <header className="mt-6 border-b border-ink-800 pb-6">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-ink-750 bg-ink-850 text-ink-400">
            <ListChecks className="h-5 w-5" />
          </span>
          <h1 className="mt-4 text-3xl font-semibold leading-tight text-ink-50 sm:text-4xl">
            {collection.title}
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-ink-400">{collection.description}</p>
          <div className="tabular mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-500">
            <span>
              <span className="text-ink-200">{entries.length}</span> skills
            </span>
            <span>
              Curated by <span className="text-ink-200">{collection.curator.name}</span>
            </span>
            {formatDate(collection.lastUpdated) ? (
              <span>Updated {formatDate(collection.lastUpdated)}</span>
            ) : null}
          </div>
        </header>

        {/* Intro */}
        <section className="doc-content mt-8">
          <Md>{collection.intro}</Md>
        </section>

        {/* Evidence note — above the list, deliberately */}
        <section className="mt-8">
          <div className="rounded-xl border border-warn-800 bg-warn-950 p-gutter">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-warn-300">
              <Search className="h-4 w-4" />
              What this list is based on
            </h2>
            <div className="doc-content mt-2.5 text-sm [&_p:last-child]:mb-0">
              <Md>{collection.evidenceNote}</Md>
            </div>
          </div>
        </section>

        {/* The list */}
        <section className="mt-section">
          <h2 className="text-xl font-semibold text-ink-50">The list</h2>
          <ol className="mt-stack-lg space-y-3">
            {entries.map((entry, i) => {
              const tier = tierOf(entry.skill);
              const installs = formatCount(entry.skill.installs);
              const review = reviewed.has(entry.skill.slug)
                ? getReviewForSkill(entry.skill.slug)
                : undefined;
              return (
                <li
                  key={entry.skill.slug}
                  className="rounded-xl border border-ink-750 bg-ink-900 p-gutter-lg shadow-e1"
                >
                  <div className="flex items-start gap-4">
                    <span className="tabular flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-ink-750 bg-ink-850 text-sm font-semibold text-ink-400">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      {entry.role && <Eyebrow className="mb-1.5">{entry.role}</Eyebrow>}
                      <h3 className="text-lg font-semibold text-ink-50">
                        <Link
                          href={`/skills/${entry.skill.slug}`}
                          className="transition-colors hover:text-accent-300"
                        >
                          {entry.skill.name}
                        </Link>
                      </h3>
                      <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs text-ink-500">
                        <span className="font-mono">{entry.skill.author}</span>
                        <span className="text-ink-700">·</span>
                        <TierChip tier={entry.skill.verified} />
                        {installs && (
                          <>
                            <span className="text-ink-700">·</span>
                            <span className="tabular">{installs} installs</span>
                          </>
                        )}
                        {review && (
                          <Link
                            href={`/reviews/${review.slug}`}
                            className="inline-flex items-center gap-1 font-medium text-ok-400 transition-colors hover:text-ok-300"
                          >
                            <Flask className="h-3 w-3" />
                            Reviewed
                          </Link>
                        )}
                      </div>

                      <div className="doc-content mt-3 text-sm [&_p:last-child]:mb-0">
                        <Md>{entry.note}</Md>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                        <Link
                          href={`/skills/${entry.skill.slug}`}
                          className="text-accent-400 transition-colors hover:text-accent-300"
                        >
                          Install instructions →
                        </Link>
                        {entry.skill.repoUrl && (
                          <a
                            href={entry.skill.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-ink-500 transition-colors hover:text-ink-200"
                          >
                            Source
                            <ExternalLink className="h-3 w-3" />
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
        <section className="mt-section">
          <h2 className="text-xl font-semibold text-ink-50">How this list was built</h2>
          <div className="doc-content mt-stack-lg">
            <Md>{collection.criteria}</Md>
          </div>
        </section>

        {/* Curator */}
        <section className="mt-section">
          <Panel>
            <Eyebrow>About the curator</Eyebrow>
            <p className="mt-2 text-sm font-medium text-ink-100">{collection.curator.name}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-450">{collection.curator.bio}</p>
          </Panel>
        </section>

        <Link
          href="/collections"
          className="group mt-section inline-flex h-10 items-center gap-2 rounded-md border border-ink-700 bg-ink-850 px-4 text-sm font-medium text-ink-200 transition duration-fast ease-out hover:border-ink-650 hover:bg-ink-800 hover:text-ink-50"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-fast ease-out group-hover:-translate-x-0.5" />
          All collections
        </Link>
      </div>
    </>
  );
}
