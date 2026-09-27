import Link from "next/link";
import { ChevronLeft, ChevronRight } from "./icons";
import { cx } from "./ui";

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

function getPageHref(basePath: string, page: number) {
  // No trailing slash: next.config.mjs sets trailingSlash: false, so "/x/2/" would 308.
  return page <= 1 ? basePath : `${basePath}/${page}`;
}

const STEP = "inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-sm font-medium transition duration-fast ease-out";
const STEP_ON = "border-ink-700 bg-ink-850 text-ink-200 hover:border-ink-650 hover:bg-ink-800 hover:text-ink-50";
const STEP_OFF = "cursor-default border-ink-800 bg-ink-950 text-ink-600";
const NUM = "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 text-sm tabular transition duration-fast ease-out";

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
    const sizeParam = size === Infinity ? "all" : String(size);
    const separator = basePath.includes("?") ? "&" : "?";
    const basePathWithoutSize = basePath.split("?")[0];
    // Reset to page 1 when changing page size
    return `${basePathWithoutSize}${separator}per_page=${sizeParam}`;
  };

  return (
    <nav aria-label="Pagination" className="mt-section flex flex-col gap-stack-lg border-t border-ink-800 pt-6">
      {hasMultiplePages && (
        <>
          <div className="flex items-center justify-between gap-3">
            {prevPage ? (
              <Link href={getPageHref(basePath, prevPage)} rel="prev" className={cx(STEP, STEP_ON)}>
                <ChevronLeft className="h-3.5 w-3.5" />
                Previous
              </Link>
            ) : (
              <span className={cx(STEP, STEP_OFF)} aria-hidden="true">
                <ChevronLeft className="h-3.5 w-3.5" />
                Previous
              </span>
            )}

            <span className="tabular text-sm text-ink-500">
              Page {currentPage.toLocaleString("en-GB")} of {totalPages.toLocaleString("en-GB")}
            </span>

            {nextPage ? (
              <Link href={getPageHref(basePath, nextPage)} rel="next" className={cx(STEP, STEP_ON)}>
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <span className={cx(STEP, STEP_OFF)} aria-hidden="true">
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </span>
            )}
          </div>

          {pageNumbers.length > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {pageNumbers.map((pageNumber) => {
                const isActive = pageNumber === currentPage;
                return isActive ? (
                  <span
                    key={pageNumber}
                    aria-current="page"
                    className={cx(NUM, "border-accent-700 bg-accent-950 font-medium text-accent-200")}
                  >
                    {pageNumber}
                  </span>
                ) : (
                  <Link
                    key={pageNumber}
                    href={getPageHref(basePath, pageNumber)}
                    className={cx(NUM, "border-ink-750 bg-ink-900 text-ink-400 hover:border-ink-650 hover:bg-ink-850 hover:text-ink-100")}
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
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
          <span className="text-ink-500">Per page</span>
          <div className="flex items-center gap-1">
            {pageSizeOptions.map((option) => {
              const value = typeof option === "number" ? option : option.value;
              const label = typeof option === "number" ? String(option) : option.label;
              const isActive = value === currentPageSize;

              return isActive ? (
                <span key={label} className={cx(NUM, "border-accent-700 bg-accent-950 font-medium text-accent-200")}>
                  {label}
                </span>
              ) : (
                <Link
                  key={label}
                  href={getSizeHref(value)}
                  className={cx(NUM, "border-ink-750 bg-ink-900 text-ink-400 hover:border-ink-650 hover:bg-ink-850 hover:text-ink-100")}
                >
                  {label}
                </Link>
              );
            })}
          </div>
          {totalItems !== undefined && (
            <span className="tabular text-ink-500">of {totalItems.toLocaleString("en-GB")}</span>
          )}
        </div>
      )}
    </nav>
  );
}
