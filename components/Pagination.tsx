import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

function getPageHref(basePath: string, page: number) {
  // SEO-optimized URLs: /category/slug/2/ instead of /category/slug/page/2/
  return page <= 1 ? `${basePath}/` : `${basePath}/${page}/`;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex flex-col gap-4 border-t border-gray-800 pt-6"
    >
      <div className="flex items-center justify-between gap-3">
        {prevPage ? (
          <Link
            href={getPageHref(basePath, prevPage)}
            rel="prev"
            className="inline-flex items-center rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm text-gray-300 transition-colors hover:border-gray-600 hover:text-white"
          >
            ← Previous
          </Link>
        ) : (
          <span className="inline-flex items-center rounded-lg border border-gray-800 bg-gray-950 px-4 py-2 text-sm text-gray-600">
            ← Previous
          </span>
        )}

        <span className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </span>

        {nextPage ? (
          <Link
            href={getPageHref(basePath, nextPage)}
            rel="next"
            className="inline-flex items-center rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm text-gray-300 transition-colors hover:border-gray-600 hover:text-white"
          >
            Next →
          </Link>
        ) : (
          <span className="inline-flex items-center rounded-lg border border-gray-800 bg-gray-950 px-4 py-2 text-sm text-gray-600">
            Next →
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {pageNumbers.map((pageNumber) => {
          const isActive = pageNumber === currentPage;
          return isActive ? (
            <span
              key={pageNumber}
              aria-current="page"
              className="inline-flex min-w-10 justify-center rounded-lg border border-purple-700 bg-purple-900/50 px-3 py-2 text-sm font-medium text-purple-200"
            >
              {pageNumber}
            </span>
          ) : (
            <Link
              key={pageNumber}
              href={getPageHref(basePath, pageNumber)}
              className="inline-flex min-w-10 justify-center rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-300 transition-colors hover:border-gray-600 hover:text-white"
            >
              {pageNumber}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}