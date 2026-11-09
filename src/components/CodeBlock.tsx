"use client";

import { useRef, useState, type ComponentPropsWithoutRef } from "react";

// A code block with a copy button. Highlighting is done at build time.
export function CodeBlock({ className = "", ...props }: ComponentPropsWithoutRef<"pre">) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(ref.current?.textContent ?? "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be blocked; nothing else to do.
    }
  }

  return (
    <div className="group relative">
      <pre ref={ref} {...props} className={`overflow-x-auto p-4 text-[13px] leading-[1.7] ${className}`} />
      <button
        type="button"
        onClick={copy}
        className="absolute top-2 right-2 min-h-9 cursor-pointer rounded-md bg-bg px-3 text-[12px] text-muted transition-opacity hover:text-fg [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:focus-visible:opacity-100"
      >
        {copied ? "copied" : "copy"}
      </button>
    </div>
  );
}
