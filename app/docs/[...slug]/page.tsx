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

export default function DocArticlePage({ params }: Props) {
  const article = getArticle(params.slug);
  if (!article) notFound();

  const { prev, next } = getPrevNext(article);
  const persona = PERSONA_BADGE[article.persona];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span
                className={`text-xs px-2 py-0.5 rounded border font-medium ${persona.color}`}
              >
                {persona.label}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">{article.title}</h1>
            <p className="text-gray-400 text-lg leading-relaxed">{article.description}</p>
          </div>

          {/* Article Body */}
          <div
            className="doc-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Prev / Next Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-800 flex justify-between gap-4">
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
