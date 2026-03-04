import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  DOC_ARTICLES,
  DOC_CATEGORIES,
  getArticle,
  getArticlesByCategory,
  getPrevNext,
} from '../../../lib/docs-content';

interface Props {
  params: { slug: string[] };
}

export async function generateStaticParams() {
  return DOC_ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticle(params.slug);
  if (!article) return { title: 'Not Found' };
  return {
    title: article.title,
    description: article.description,
  };
}

const PERSONA_BADGE: Record<string, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: 'bg-emerald-900/40 text-emerald-300 border-emerald-800' },
  developer: { label: 'Developer', color: 'bg-blue-900/40 text-blue-300 border-blue-800' },
  advanced: { label: 'Advanced', color: 'bg-purple-900/40 text-purple-300 border-purple-800' },
};

// Scoped styles for all SEO + EEAT content elements
const DOC_CONTENT_STYLES = `
  /* ── TL;DR box ── */
  .doc-content .tldr-box {
    border-left: 4px solid #22c55e;
    background: rgba(34, 197, 94, 0.08);
    padding: 1rem 1.25rem;
    border-radius: 0 0.5rem 0.5rem 0;
    margin-bottom: 1.75rem;
    color: #d1fae5;
  }
  .doc-content .tldr-box .tldr-label {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #4ade80;
    margin-bottom: 0.5rem;
    display: block;
  }
  .doc-content .tldr-box p {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.6;
  }

  /* ── Tip / Warning callout boxes ── */
  .doc-content .tip-box {
    border-left: 4px solid #3b82f6;
    background: rgba(59, 130, 246, 0.08);
    padding: 0.875rem 1.125rem;
    border-radius: 0 0.5rem 0.5rem 0;
    margin: 1.25rem 0;
    color: #bfdbfe;
    font-size: 0.9rem;
    line-height: 1.6;
  }
  .doc-content .warning-box {
    border-left: 4px solid #f59e0b;
    background: rgba(245, 158, 11, 0.08);
    padding: 0.875rem 1.125rem;
    border-radius: 0 0.5rem 0.5rem 0;
    margin: 1.25rem 0;
    color: #fde68a;
    font-size: 0.9rem;
    line-height: 1.6;
  }

  /* ── Experience / From-the-field callout (EEAT) ── */
  .doc-content .experience-callout {
    border-left: 4px solid #a855f7;
    background: rgba(168, 85, 247, 0.07);
    padding: 0.875rem 1.125rem;
    border-radius: 0 0.5rem 0.5rem 0;
    margin: 1.5rem 0;
    color: #e9d5ff;
    font-size: 0.9rem;
    line-height: 1.65;
  }
  .doc-content .experience-callout .experience-label {
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #c084fc;
    margin-bottom: 0.5rem;
    display: block;
  }
  .doc-content .experience-callout p {
    margin: 0;
    color: #e9d5ff;
  }

  /* ── Article intro paragraph ── */
  .doc-content p.article-intro {
    font-size: 1rem;
    color: #94a3b8;
    line-height: 1.8;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid #1e293b;
    padding-bottom: 1.25rem;
  }

  /* ── Code blocks ── */
  .doc-content pre {
    background: #0f1117;
    border: 1px solid #1e293b;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1rem 0;
  }
  .doc-content pre code,
  .doc-content pre code[class*="language-"] {
    display: block;
    background: transparent;
    color: #e2e8f0;
    font-family: 'Fira Code', 'Cascadia Code', 'Consolas', 'Monaco', monospace;
    font-size: 0.85rem;
    line-height: 1.65;
    padding: 1rem 1.125rem;
    white-space: pre;
  }
  .doc-content :not(pre) > code {
    background: rgba(255,255,255,0.08);
    color: #c4b5fd;
    font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
    font-size: 0.82rem;
    padding: 0.15rem 0.4rem;
    border-radius: 0.25rem;
    border: 1px solid rgba(255,255,255,0.1);
  }

  /* ── Typography ── */
  .doc-content h2 {
    font-size: 1.35rem;
    font-weight: 700;
    color: #f1f5f9;
    margin-top: 2rem;
    margin-bottom: 0.75rem;
    padding-bottom: 0.375rem;
    border-bottom: 1px solid #1e293b;
  }
  .doc-content h3 {
    font-size: 1.05rem;
    font-weight: 600;
    color: #cbd5e1;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
  }
  .doc-content p { color: #94a3b8; line-height: 1.75; margin-bottom: 1rem; }
  .doc-content ul, .doc-content ol {
    color: #94a3b8;
    line-height: 1.75;
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }
  .doc-content li { margin-bottom: 0.25rem; }
  .doc-content strong { color: #e2e8f0; font-weight: 600; }
  .doc-content em { color: #a5b4fc; }
  .doc-content a { color: #818cf8; text-decoration: underline; text-underline-offset: 2px; }
  .doc-content a:hover { color: #a5b4fc; }
  .doc-content hr { border: none; border-top: 1px solid #1e293b; margin: 2rem 0; }

  /* ── Tables ── */
  .doc-content .table-container { overflow-x: auto; margin: 1.25rem 0; }
  .doc-content table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
  .doc-content th {
    background: #1e293b;
    color: #e2e8f0;
    font-weight: 600;
    text-align: left;
    padding: 0.625rem 0.875rem;
    border: 1px solid #334155;
  }
  .doc-content td {
    color: #94a3b8;
    padding: 0.5rem 0.875rem;
    border: 1px solid #1e293b;
    vertical-align: top;
  }
  .doc-content tr:nth-child(even) td { background: rgba(255,255,255,0.02); }

  /* ── Hide JSON-LD script tags (for crawlers only) ── */
  .doc-content script[type="application/ld+json"] { display: none; }
`;

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function DocArticlePage({ params }: Props) {
  const article = getArticle(params.slug);
  if (!article) notFound();

  const { prev, next } = getPrevNext(article);
  const persona = PERSONA_BADGE[article.persona];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Inject scoped styles for all doc content elements */}
      <style dangerouslySetInnerHTML={{ __html: DOC_CONTENT_STYLES }} />

      <div className="flex gap-8">
        {/* ── Sidebar ── */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            <Link
              href="/docs"
              className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1 transition-colors"
            >
              ← Docs home
            </Link>
            {DOC_CATEGORIES.map((cat) => {
              const articles = getArticlesByCategory(cat.slug);
              if (!articles.length) return null;
              return (
                <div key={cat.slug}>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span>{cat.icon}</span>
                    {cat.label}
                  </div>
                  <ul className="space-y-1">
                    {articles.map((a) => {
                      const isActive = a.slug.join('/') === params.slug.join('/');
                      return (
                        <li key={a.slug.join('/')}>
                          <Link
                            href={`/docs/${a.slug.join('/')}`}
                            className={`block text-sm px-3 py-1.5 rounded-lg transition-colors ${
                              isActive
                                ? 'bg-purple-900/40 text-purple-300 font-medium'
                                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                            }`}
                          >
                            {a.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 min-w-0">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/docs" className="hover:text-gray-300 transition-colors">Docs</Link>
            <span>→</span>
            <Link
              href={`/docs#${article.categorySlug}`}
              className="hover:text-gray-300 transition-colors"
            >
              {article.category}
            </Link>
            <span>→</span>
            <span className="text-gray-300">{article.title}</span>
          </nav>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-xs px-2 py-0.5 rounded border font-medium ${persona.color}`}>
                {persona.label}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">{article.title}</h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-4">{article.description}</p>

            {/* Last updated — EEAT signal */}
            {article.lastUpdated && (
              <p className="text-xs text-gray-500 flex items-center gap-1.5">
                <span>🕐</span>
                <span>Last updated {formatDate(article.lastUpdated)}</span>
              </p>
            )}
          </div>

          {/* Article Body */}
          <div
            className="doc-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Author / EEAT block */}
          {article.author && (
            <div className="mt-10 pt-6 border-t border-gray-800">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-900/60 border border-purple-800 flex items-center justify-center flex-shrink-0 text-purple-300 font-bold text-sm">
                  {article.author.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-200">{article.author.name}</p>
                  <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{article.author.bio}</p>
                </div>
              </div>
            </div>
          )}

          {/* Prev / Next Navigation */}
          <div className="mt-10 pt-8 border-t border-gray-800 flex justify-between gap-4">
            {prev ? (
              <Link
                href={`/docs/${prev.slug.join('/')}`}
                className="group flex flex-col max-w-xs p-4 rounded-xl border border-gray-800 hover:border-gray-700 hover:bg-gray-900/50 transition-all"
              >
                <span className="text-xs text-gray-500 mb-1">← Previous</span>
                <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`/docs/${next.slug.join('/')}`}
                className="group flex flex-col items-end max-w-xs p-4 rounded-xl border border-gray-800 hover:border-gray-700 hover:bg-gray-900/50 transition-all"
              >
                <span className="text-xs text-gray-500 mb-1">Next →</span>
                <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors text-right">
                  {next.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
