import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

const linkClass =
  "underline decoration-line underline-offset-4 transition-colors hover:decoration-fg";

function CustomLink({ href = "", children, ...props }: ComponentPropsWithoutRef<"a">) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={linkClass} {...props}>
        {children}
      </Link>
    );
  }

  if (href.startsWith("#")) {
    return (
      <a href={href} className={linkClass} {...props}>
        {children}
      </a>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass} {...props}>
      {children}
    </a>
  );
}

function slugify(str: string): string {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

// Headings stay body-sized: weight does the work, not size.
function createHeading(level: 2 | 3 | 4) {
  const Tag = `h${level}` as const;
  const CustomHeading = ({ children }: { children?: ReactNode }) => {
    const slug = slugify(String(children));
    return (
      <Tag id={slug} className="group mt-10 mb-3 scroll-mt-6 font-medium lowercase">
        <a href={`#${slug}`}>
          {children}
          <span className="ml-2 text-muted opacity-0 transition-opacity group-hover:opacity-100">#</span>
        </a>
      </Tag>
    );
  };
  CustomHeading.displayName = `Heading${level}`;
  return CustomHeading;
}

function Image({ src = "", alt = "" }: ComponentPropsWithoutRef<"img">) {
  return (
    // MDX images have unknown sizes, so a plain <img> is simpler than next/image here.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={String(src)} alt={alt} loading="lazy" className="my-8 w-full rounded-xl border border-line" />
  );
}

const components: MDXRemoteProps["components"] = {
  h1: createHeading(2),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  p: (props) => <p className="my-4" {...props} />,
  a: CustomLink,
  img: Image,
  strong: (props) => <strong className="font-medium" {...props} />,
  ul: (props) => <ul className="my-4 flex flex-col gap-2" {...props} />,
  ol: (props) => <ol className="my-4 flex list-decimal flex-col gap-2 pl-6 marker:text-muted" {...props} />,
  li: (props) => (
    <li
      className="[ul>&]:relative [ul>&]:pl-6 [ul>&]:before:absolute [ul>&]:before:left-0 [ul>&]:before:text-muted [ul>&]:before:content-['–']"
      {...props}
    />
  ),
  blockquote: (props) => <blockquote className="my-6 border-l border-line pl-4 text-muted" {...props} />,
  hr: () => <hr className="my-10 border-line" />,
  code: (props) => <code className="rounded bg-line px-1 py-0.5 text-[13px]" {...props} />,
  pre: (props) => (
    <pre
      className="my-6 overflow-x-auto rounded-xl border border-line p-4 text-[13px] [&>code]:bg-transparent [&>code]:p-0"
      {...props}
    />
  ),
};

export function Mdx({ source }: { source: string }) {
  return <MDXRemote source={source} components={components} />;
}
