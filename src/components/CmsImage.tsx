import type { Media } from "@/lib/blog";

const widths = [480, 680, 960, 1360, 1760, 2400];

// Contentful's Images API resizes and converts on its CDN; GIFs (animation)
// and SVGs are served as they are.
const resizable = (type: string) => /^image\/(jpeg|png|webp|avif)$/.test(type);
const resized = (url: string, width: number) => `${url}?w=${width}&q=80&fm=webp`;

// A Contentful image with a srcset, so phones download a small file.
// (next/image can't resize here because the site is a static export.)
export function CmsImage({
  media,
  sizes,
  priority = false,
  className,
}: {
  media: Media;
  sizes: string;
  // The first big image on the page: load it first.
  priority?: boolean;
  className?: string;
}) {
  // Never upscale: the original width (Contentful's limit is 4000) is the largest.
  const candidates = media.width
    ? [...widths.filter((w) => w < media.width!), Math.min(media.width, 4000)]
    : widths;
  const canResize = resizable(media.contentType);
  const fallback = Math.min(candidates.at(-1)!, 1360);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={canResize ? resized(media.url, fallback) : media.url}
      srcSet={canResize ? candidates.map((w) => `${resized(media.url, w)} ${w}w`).join(", ") : undefined}
      sizes={canResize ? sizes : undefined}
      width={media.width}
      height={media.height}
      alt={media.description || media.title}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={className}
    />
  );
}
