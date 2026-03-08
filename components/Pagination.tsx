import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  currentPageSize?: number;
  totalItems?: number;
  pageSizeOptions?: (number | { value: number; label: string })[];
  categorySlug?: string;
}

const DEFAULT_PAGE_SIZE_OPTIONS = [
  { value: 25, label: "25" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
  { value: Infinity, label: "All" },
];

function getPageHref(basePath: string, page: number, pageSize: number) {
  const sizeParam = pageSize === Infinity ? 'all' : String(pageSize);
  const pageParam = page <= 1 ? '' : `/page/${page}`;
  const separator = basePath.includes('?') ? '&' : '?';
  return `${basePath.split('?')[0]}${pageParam}/${separator}per_page=${sizeParam}`;
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  basePath,
  currentPageSize = 25,
  totalItems,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
}: PaginationProps) {
  const hasMultiplePages = totalPages > 1;
  const showPageSelector = totalItems !== undefined && totalItems > 25;
  
  if (!hasMultiplePages && !showPageSelector) return null;

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;
  
  // Calculate which page numbers to show (max 10)
  let pageNumbers: number[] = [];
  if (hasMultiplePages) {
    const startPage = Math.max(1, currentPage - 4);
    const endPage = Math.min(totalPages, startPage + 9);
    pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  const getSizeHref = (size: number) => {
    const sizeParam = size === Infinity ? 'all' : String(size);
    const separator = basePath.includes('?') ? '&' : '?';
    const basePathWithoutSize = basePath.split('?')[0];
    // Reset to page 1 when changing page size
    return `${basePathWithoutSize}/${separator}per_page=${sizeParam}`;
  };

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex flex-col gap-4 border-t border-gray-800 pt-6"
    >
      {hasMultiplePages && (
        <>
          <div className="flex items-center justify-between gap-3">
            {prevPage ? (
              <Link
                href={getPageHref(basePath, prevPage, currentPageSize)}
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
                href={getPageHref(basePath, nextPage, currentPageSize)}
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

          {pageNumbers.length > 1 && (
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
                    href={getPageHref(basePath, pageNumber, currentPageSize)}
                    className="inline-flex min-w-10 justify-center rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-300 transition-colors hover:border-gray-600 hover:text-white"
                  >
                    {pageNumber}
                  </Link>
                );
              })}
            </div>
          )}
        </>
      )}

      {showPageSelector && (
        <div className="flex items-center justify-center gap-3 text-sm">
          <span className="text-gray-500">Skills per page:</span>
          <div className="flex items-center gap-1">
            {pageSizeOptions.map((option) => {
              const value = typeof option === 'number' ? option : option.value;
              const label = typeof option === 'number' ? String(option) : option.label;
              const isActive = value === currentPageSize || 
                (value === Infinity && currentPageSize === Infinity) ||
                (Number.isFinite(value) && Number.isFinite(currentPageSize) && value === currentPageSize);
              
              return isActive ? (
                <span
                  key={label}
                  className="px-3 py-1.5 rounded-lg border border-purple-700 bg-purple-900/50 text-purple-200 font-medium"
                >
                  {label}
                </span>
              ) : (
                <Link
                  key={label}
                  href={getSizeHref(value)}
                  className="px-3 py-1.5 rounded-lg border border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-600 hover:text-white transition-colors"
                >
                  {label}
                </Link>
              );
            })}
          </div>
          <span className="text-gray-500">of {totalItems} total</span>
        </div>
      )}
    </nav>
  );
}
