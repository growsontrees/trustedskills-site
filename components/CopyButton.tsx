"use client";

import { useState } from "react";
import { Check, Copy } from "./icons";
import { cx } from "./ui";

interface CopyButtonProps {
  text: string;
  label?: string;
  /** `bare` drops the border — for use inside a code block's header row. */
  variant?: "bare" | "outline";
}

export function CopyButton({ text, label = "Copy", variant = "bare" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-live="polite"
      className={cx(
        "inline-flex h-7 items-center gap-1.5 rounded-sm px-2 text-2xs font-medium",
        "transition duration-fast ease-out",
        variant === "outline" && "border",
        copied
          ? cx("text-ok-300", variant === "outline" && "border-ok-800 bg-ok-950")
          : cx(
              "text-ink-450 hover:bg-ink-800 hover:text-ink-100",
              variant === "outline" && "border-ink-700 bg-ink-850 hover:border-ink-650"
            )
      )}
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied" : label}
    </button>
  );
}
