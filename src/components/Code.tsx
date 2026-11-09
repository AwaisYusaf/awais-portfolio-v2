import type { CSSProperties } from "react";
import { bundledLanguages, codeToTokens, type BundledLanguage } from "shiki";

import { CodeBlock } from "@/components/CodeBlock";
import { codeThemes } from "@/lib/code-theme";

const plain = ["plaintext", "text", "txt"];

// A highlighted code block, rendered at build time. Each token carries the
// light and dark theme colors as CSS variables (see globals.css).
export async function Code({
  code,
  language,
  filename,
}: {
  code: string;
  language: string;
  filename?: string;
}) {
  const lang = language.toLowerCase();
  const known = lang in bundledLanguages || plain.includes(lang);
  const { tokens } = await codeToTokens(code, {
    lang: (known ? lang : "text") as BundledLanguage,
    themes: codeThemes,
    defaultColor: false,
  });

  return (
    <figure data-code="" className="my-8 overflow-hidden rounded-xl border border-line">
      {filename && (
        <figcaption className="border-b border-line px-4 py-2.5 text-[12px] text-muted">
          {filename}
        </figcaption>
      )}
      <CodeBlock data-language={lang}>
        <code>
          {tokens.map((line, i) => (
            <span key={i}>
              {line.map((token, j) => (
                <span key={j} style={token.htmlStyle as CSSProperties}>
                  {token.content}
                </span>
              ))}
              {i < tokens.length - 1 && "\n"}
            </span>
          ))}
        </code>
      </CodeBlock>
    </figure>
  );
}
