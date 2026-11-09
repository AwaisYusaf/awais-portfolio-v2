import { documentToReactComponents, type Options } from "@contentful/rich-text-react-renderer";
import {
  BLOCKS,
  INLINES,
  MARKS,
  type Block,
  type Document,
  type Inline,
  type Node,
  type Text,
} from "@contentful/rich-text-types";
import Link from "next/link";
import { Children, type ReactNode } from "react";

import { CmsImage } from "@/components/CmsImage";
import { Code } from "@/components/Code";
import { plainText, type Embed, type Media } from "@/lib/blog";
import { siteUrl } from "@/site.config";

const linkClass =
  "underline decoration-muted/60 underline-offset-4 transition-colors hover:decoration-fg";

function SmartLink({ href, children }: { href: string; children: ReactNode }) {
  // Links to this site written out in full stay in the same tab.
  const local = href.startsWith(siteUrl) ? href.slice(siteUrl.length) || "/" : href;

  if (local.startsWith("/")) {
    return (
      <Link href={local} className={linkClass}>
        {children}
      </Link>
    );
  }
  if (/^(#|mailto:|tel:)/.test(local)) {
    return (
      <a href={local} className={linkClass}>
        {children}
      </a>
    );
  }
  return (
    <a href={local} target="_blank" rel="noopener noreferrer" className={linkClass}>
      {children}
    </a>
  );
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-|-$/g, "");
}

const headingStyles = {
  2: "mt-14 mb-3 text-[20px] leading-[1.4] tracking-[-0.02em]",
  3: "mt-10 mb-2 text-[16px] leading-[1.5]",
  4: "mt-8 mb-2 text-[16px] leading-[1.5]",
};

// Headings get an id (unique within the post) and a # link to copy.
function headings(level: 2 | 3 | 4, used: Map<string, number>) {
  return function renderHeading(node: Block | Inline, children: ReactNode) {
    const base = slugify(plainText(node)) || "section";
    const count = used.get(base) ?? 0;
    used.set(base, count + 1);
    const id = count ? `${base}-${count}` : base;
    const Tag = `h${level}` as const;

    return (
      <Tag id={id} className={`group scroll-mt-6 font-medium ${headingStyles[level]}`}>
        <a href={`#${id}`}>
          {children}
          <span className="ml-2 text-muted opacity-0 transition-opacity group-hover:opacity-100">#</span>
        </a>
      </Tag>
    );
  };
}

const target = (node: Block | Inline) => node.data.target as Embed | null | undefined;

// Contentful's editor has no code block button, so lines marked as code
// (with shift+enter between them) are shown as a code block too.
function codeLines(node: Block | Inline) {
  const runs = node.content as Node[];
  const allCode =
    runs.length > 0 &&
    runs.every((n) => n.nodeType === "text" && (n as Text).marks.some((m) => m.type === MARKS.CODE));
  const text = runs.map((n) => (n as Text).value ?? "").join("");
  return allCode && text.includes("\n") ? text : null;
}

function MediaBlock({ media }: { media: Media }) {
  const caption = media.description && (
    <figcaption className="mt-2.5 text-[13px] text-muted">{media.description}</figcaption>
  );

  if (media.contentType.startsWith("image/")) {
    return (
      <figure className="my-10">
        <CmsImage
          media={media}
          sizes="(min-width: 728px) 680px, calc(100vw - 48px)"
          className="h-auto w-full rounded-xl border border-line"
        />
        {caption}
      </figure>
    );
  }
  if (media.contentType.startsWith("video/")) {
    return (
      <figure className="my-10">
        <video
          src={media.url}
          controls
          playsInline
          preload="metadata"
          className="w-full rounded-xl border border-line"
        />
        {caption}
      </figure>
    );
  }
  return (
    <p className="my-5">
      <SmartLink href={media.url}>{media.title || "download"} ↗</SmartLink>
    </p>
  );
}

function options(): Options {
  const used = new Map<string, number>();

  return {
    renderMark: {
      [MARKS.BOLD]: (text) => <strong className="font-semibold">{text}</strong>,
      [MARKS.ITALIC]: (text) => <em>{text}</em>,
      [MARKS.UNDERLINE]: (text) => <u className="underline-offset-4">{text}</u>,
      [MARKS.STRIKETHROUGH]: (text) => <s>{text}</s>,
      [MARKS.SUPERSCRIPT]: (text) => <sup>{text}</sup>,
      [MARKS.SUBSCRIPT]: (text) => <sub>{text}</sub>,
      [MARKS.CODE]: (text) => (
        <code className="rounded bg-line px-1 py-0.5 text-[0.875em]">{text}</code>
      ),
    },
    // shift+enter in the editor is a line break.
    renderText: (text) =>
      text.split("\n").flatMap((part, i) => (i ? [<br key={i} />, part] : [part])),
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node, children) => {
        const code = codeLines(node);
        if (code) return <Code code={code} language="plaintext" />;
        // The editor leaves empty paragraphs behind (e.g. after an image).
        if (!plainText(node).trim() && !(node.content as Node[]).some((n) => n.nodeType !== "text")) {
          return null;
        }
        return <p className="my-5">{children}</p>;
      },
      [BLOCKS.HEADING_1]: headings(2, used),
      [BLOCKS.HEADING_2]: headings(2, used),
      [BLOCKS.HEADING_3]: headings(3, used),
      [BLOCKS.HEADING_4]: headings(4, used),
      [BLOCKS.HEADING_5]: headings(4, used),
      [BLOCKS.HEADING_6]: headings(4, used),
      [BLOCKS.UL_LIST]: (_, children) => <ul className="my-5 flex flex-col gap-2">{children}</ul>,
      [BLOCKS.OL_LIST]: (_, children) => (
        <ol className="my-5 flex list-decimal flex-col gap-2 pl-6 marker:text-muted">{children}</ol>
      ),
      [BLOCKS.LIST_ITEM]: (_, children) => (
        <li className="[ul>&]:relative [ul>&]:pl-6 [ul>&]:before:absolute [ul>&]:before:left-0 [ul>&]:before:text-muted [ul>&]:before:content-['–'] [&>ol]:my-2 [&>p]:my-0 [&>p+p]:mt-2 [&>ul]:my-2">
          {children}
        </li>
      ),
      [BLOCKS.QUOTE]: (_, children) => (
        <blockquote className="my-12 text-center text-[19px] leading-[1.6] tracking-[-0.01em] [&>p]:my-0 [&>p+p]:mt-3">
          {children}
        </blockquote>
      ),
      [BLOCKS.HR]: () => <hr className="mx-auto my-12 w-16 border-line" />,
      [BLOCKS.TABLE]: (node, children) => {
        const rows = Children.toArray(children);
        const firstRow = (node.content as Block[])[0];
        const hasHeader = firstRow?.content.every((cell) => cell.nodeType === BLOCKS.TABLE_HEADER_CELL);
        return (
          <div className="my-8 overflow-x-auto">
            <table className="w-full border-collapse text-[14px]">
              {hasHeader && <thead>{rows[0]}</thead>}
              <tbody>{hasHeader ? rows.slice(1) : rows}</tbody>
            </table>
          </div>
        );
      },
      [BLOCKS.TABLE_ROW]: (_, children) => <tr>{children}</tr>,
      [BLOCKS.TABLE_HEADER_CELL]: (_, children) => (
        <th className="border-b border-line py-2 pr-4 text-left align-top font-medium [&>p]:my-0">
          {children}
        </th>
      ),
      [BLOCKS.TABLE_CELL]: (_, children) => (
        <td className="border-b border-line py-2 pr-4 align-top [&>p]:my-0">{children}</td>
      ),
      [BLOCKS.EMBEDDED_ENTRY]: (node) => {
        const embed = target(node);
        if (embed?.kind === "code") {
          return <Code code={embed.code} language={embed.language} filename={embed.filename} />;
        }
        if (embed?.kind === "post") {
          return (
            <p className="my-5">
              <SmartLink href={`/blog/${embed.slug}`}>{embed.title} →</SmartLink>
            </p>
          );
        }
        return null;
      },
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        const embed = target(node);
        return embed?.kind === "media" ? <MediaBlock media={embed} /> : null;
      },
      [INLINES.HYPERLINK]: (node, children) => (
        <SmartLink href={String(node.data.uri ?? "")}>{children}</SmartLink>
      ),
      [INLINES.ENTRY_HYPERLINK]: (node, children) => {
        const embed = target(node);
        return embed?.kind === "post" ? (
          <SmartLink href={`/blog/${embed.slug}`}>{children}</SmartLink>
        ) : (
          <>{children}</>
        );
      },
      [INLINES.ASSET_HYPERLINK]: (node, children) => {
        const embed = target(node);
        return embed?.kind === "media" ? (
          <SmartLink href={embed.url}>{children}</SmartLink>
        ) : (
          <>{children}</>
        );
      },
      [INLINES.EMBEDDED_ENTRY]: () => null,
      [BLOCKS.EMBEDDED_RESOURCE]: () => null,
      [INLINES.EMBEDDED_RESOURCE]: () => null,
    },
  };
}

// A post's body from Contentful, in the blog's type styles.
export function RichText({ document }: { document: Document }) {
  return <>{documentToReactComponents(document, options())}</>;
}
