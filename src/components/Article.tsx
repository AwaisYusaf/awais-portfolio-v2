import Link from "next/link";

import { Mdx } from "@/components/mdx";

// Layout for a blog post.
export function Article({
  back,
  title,
  meta,
  source,
}: {
  back: { href: string; label: string };
  title: string;
  meta: string;
  source: string;
}) {
  return (
    <article className="pt-10 pb-16">
      <Link href={back.href} className="py-2.5 text-[13px] text-muted transition-colors hover:text-fg">
        ← {back.label}
      </Link>

      <header className="mt-10 mb-10 flex flex-col gap-1">
        <h1 className="text-[22px] leading-[1.35] font-medium tracking-[-0.02em] lowercase">{title}</h1>
        <p className="mt-3 text-[13px] text-muted lowercase">{meta}</p>
      </header>

      <Mdx source={source} />
    </article>
  );
}
