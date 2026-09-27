"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "./icons";
import { cx } from "./ui";

export function SearchBar({
  defaultValue = "",
  placeholder = "Search skills…",
  size = "md",
  autoFocus = false,
}: {
  defaultValue?: string;
  placeholder?: string;
  size?: "md" | "lg";
  autoFocus?: boolean;
}) {
  const [value, setValue] = useState(defaultValue);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    router.push(trimmed ? `/skills?q=${encodeURIComponent(trimmed)}` : "/skills");
  }

  return (
    <form onSubmit={handleSubmit} role="search">
      <div className="group relative">
        <Search
          className={cx(
            "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 transition-colors",
            "group-focus-within:text-ink-300",
            size === "lg" ? "h-[18px] w-[18px]" : "h-4 w-4"
          )}
        />
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          aria-label="Search skills"
          autoFocus={autoFocus}
          className={cx(
            "w-full rounded-lg border border-ink-750 bg-ink-900 pr-24 text-ink-100 shadow-e1",
            "placeholder:text-ink-600 outline-none",
            "transition duration-fast ease-out",
            "hover:border-ink-700",
            "focus:border-accent-600 focus:bg-ink-850",
            size === "lg" ? "h-12 pl-11 text-base" : "h-10 pl-10 text-sm"
          )}
        />
        <button
          type="submit"
          className={cx(
            "absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md border border-ink-700 bg-ink-850 px-3 font-medium text-ink-300",
            "transition duration-fast ease-out hover:border-ink-650 hover:bg-ink-800 hover:text-ink-50",
            size === "lg" ? "h-9 text-sm" : "h-7 text-xs"
          )}
        >
          Search
        </button>
      </div>
    </form>
  );
}
