import Image from "next/image";
import Link from "next/link";

import { CmsImage } from "@/components/CmsImage";
import { RichText } from "@/components/RichText";
import { ShareLinks } from "@/components/ShareLinks";
import { formatDate, type Post } from "@/lib/blog";
import { site, siteUrl } from "@/site.config";

const linkClass =
  "underline decoration-line underline-offset-4 transition-colors hover:decoration-fg";

// Editorial layout for a blog post, set in the site's monospace.
export function Article({ post, next }: { post: Post; next?: Post }) {
  const date = (value: string) => (
    <time dateTime={value}>{formatDate(value).toLowerCase()}</time>
  );

  return (
    <article className="pt-10 pb-6">
      <Link href="/blog" className="py-2.5 text-[13px] text-muted transition-colors hover:text-fg">
        ← blog
      </Link>

      <header className="mt-12 flex flex-col gap-5">
        {post.tags.length > 0 && (
          <p className="text-[13px] text-muted lowercase">{post.tags.join(" · ")}</p>
        )}
        <h1 className="text-[28px] leading-[1.15] font-medium tracking-[-0.04em] text-balance sm:text-[34px]">
          {post.title}
        </h1>
        {post.summary && <p className="text-[17px] leading-[1.6] text-muted">{post.summary}</p>}
        <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 border-y border-line py-4 text-[13px] text-muted">
          <Image
            src={site.person.avatar}
            alt=""
            width={32}
            height={32}
            className="size-8 rounded-full object-cover"
          />
          <span className="text-fg">{site.person.name.toLowerCase()}</span>
          <span>· {date(post.publishedAt)}</span>
          <span>· {post.readingTime} min read</span>
          {post.updatedAt && <span>· updated {date(post.updatedAt)}</span>}
          {post.draft && <span className="text-fg">· draft, not on the live site</span>}
        </div>
      </header>

      {post.cover && (
        <figure className="relative left-1/2 mt-12 w-[min(880px,calc(100vw-48px))] -translate-x-1/2">
          <CmsImage
            media={post.cover}
            priority
            sizes="(min-width: 928px) 880px, calc(100vw - 48px)"
            className="h-auto w-full rounded-2xl border border-line"
          />
          {post.cover.description && (
            <figcaption className="mt-2.5 text-center text-[13px] text-muted">
              {post.cover.description}
            </figcaption>
          )}
        </figure>
      )}

      <div className="mt-12 text-[16px] leading-[1.8] [&>p:first-child]:text-[18px] [&>p:first-child]:leading-[1.7]">
        <RichText document={post.body} />
      </div>
      <p className="mt-12 text-center text-muted" aria-hidden="true">
        ∎
      </p>

      <section className="mt-12 flex flex-wrap gap-4 border-y border-line py-7">
        <Image
          src={site.person.avatar}
          alt=""
          width={56}
          height={56}
          className="size-14 rounded-full object-cover"
        />
        <div className="flex flex-[1_1_280px] flex-col gap-1.5">
          <span className="text-[17px] font-medium">{site.person.name}</span>
          <span className="text-[13px] text-muted">
            {site.person.role.toLowerCase()} at mantaq. {site.hero.line}
          </span>
          <span className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-[13px]">
            <a href={`mailto:${site.email}`} className={linkClass}>
              {site.email}
            </a>
            <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
              book a meeting →
            </a>
          </span>
          <div className="pt-2">
            <ShareLinks url={`${siteUrl}/blog/${post.slug}`} title={post.title} />
          </div>
        </div>
      </section>

      {next ? (
        <Link href={`/blog/${next.slug}`} className="group flex flex-col gap-1.5 py-7">
          <span className="text-[13px] text-muted">next post · {next.readingTime} min read</span>
          <span className="text-[20px] leading-[1.35] font-medium tracking-[-0.02em]">
            {next.title}{" "}
            <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
          </span>
        </Link>
      ) : (
        <Link href="/blog" className="block py-7 text-[13px] text-muted transition-colors hover:text-fg">
          all posts →
        </Link>
      )}
    </article>
  );
}
