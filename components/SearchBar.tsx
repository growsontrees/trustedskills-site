"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value.trim()) {
      router.push(`/skills?q=${encodeURIComponent(value.trim())}`);
    } else {
      router.push("/skills");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search skills — weather, image, search, code..."
          className="w-full bg-gray-900 border border-gray-700 hover:border-gray-600 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 rounded-xl pl-12 pr-4 py-3.5 text-gray-200 placeholder-gray-500 outline-none transition-all"
        />
        {value && (
          <button
            type="submit"
            className="absolute inset-y-0 right-3 my-2 px-4 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg transition-colors"
          >
            Search
          </button>
        )}
      </div>
    </form>
  );
}
