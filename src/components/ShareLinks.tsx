"use client";

import { useState } from "react";

const linkClass = "text-muted transition-colors hover:text-fg";

export function ShareLinks({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be blocked; the other share links still work.
    }
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted">
      <span>share:</span>
      <button type="button" onClick={copy} className={`cursor-pointer py-1 ${linkClass}`}>
        {copied ? "copied" : "copy link"}
      </button>
      <a
        href={`https://x.com/intent/post?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        x
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        linkedin
      </a>
    </p>
  );
}
