"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Close, Menu } from "../../components/icons";
import { buttonClass } from "../../components/ui";

const LINKS = [
  { href: "/skills", label: "Browse" },
  { href: "/collections", label: "Collections" },
  { href: "/reviews", label: "Reviews" },
  { href: "/docs", label: "Docs" },
  { href: "/submit", label: "Submit a skill" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  // A fixed panel over a scrollable page: lock the body while it's up, and
  // let Escape close it.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-ink-750 bg-ink-900 text-ink-300 transition duration-fast ease-out hover:border-ink-650 hover:text-ink-50 md:hidden"
        aria-label="Open menu"
        aria-expanded={open}
      >
        <Menu className="h-4 w-4" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-[90] bg-ink-1000/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed right-0 top-0 z-[100] flex h-dvh w-72 flex-col border-l border-ink-800 bg-ink-950 shadow-e4"
          >
            <div className="flex h-14 items-center justify-between border-b border-ink-800 px-4">
              <span className="text-sm font-semibold text-ink-50">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-ink-450 transition duration-fast ease-out hover:bg-ink-900 hover:text-ink-50"
                aria-label="Close menu"
              >
                <Close className="h-4 w-4" />
              </button>
            </div>

            <nav aria-label="Mobile" className="flex flex-col gap-1 p-3">
              {/* Everything but the last entry, which is promoted to the
                  button below — so adding a nav link can't drop one silently. */}
              {LINKS.slice(0, -1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm text-ink-300 transition duration-fast ease-out hover:bg-ink-900 hover:text-ink-50"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/submit"
                onClick={() => setOpen(false)}
                className={`${buttonClass("secondary", "md")} mt-3 w-full`}
              >
                Submit a skill
              </Link>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
