import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { Mdx } from "@/components/mdx";

// Shared layout for a case study or a blog post.
export function Article({
  back,
  title,
  tagline,
  meta,
  images = [],
  source,
  children,
}: {
  back: { href: string; label: string };
  title: string;
  tagline?: string;
  meta: string;
  images?: string[];
  source: string;
  children?: ReactNode;
}) {
  return (
    <article className="pt-10 pb-16">
      <Link href={back.href} className="py-2.5 text-[13px] text-muted transition-colors hover:text-fg">
        ← {back.label}
      </Link>

      <header className="mt-10 mb-10 flex flex-col gap-1">
        <h1 className="text-[22px] leading-[1.35] font-medium tracking-[-0.02em] lowercase">{title}</h1>
        {tagline && <p className="text-muted">{tagline}</p>}
        <p className="mt-3 text-[13px] text-muted lowercase">{meta}</p>
      </header>

      {images.length > 0 && (
        <div className="mb-10 flex flex-col gap-4">
          {images.map((src, index) => (
            <Image
              key={src}
              src={src}
              alt={`${title} screenshot ${index + 1}`}
              width={1600}
              height={890}
              priority={index === 0}
              className="h-auto w-full rounded-xl border border-line"
            />
          ))}
        </div>
      )}

      <Mdx source={source} />
      {children}
    </article>
  );
}
