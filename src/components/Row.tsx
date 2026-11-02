import Link from "next/link";

// One line in a list: name, short description, date. Used for work and blog.
export function Row({
  href,
  name,
  detail,
  meta,
}: {
  href: string;
  name: string;
  detail?: string;
  meta: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-wrap items-baseline gap-x-4 gap-y-0.5 border-b border-line py-4"
    >
      <span className="flex-[1_1_160px] font-medium lowercase">{name}</span>
      {detail && <span className="flex-[2_1_260px] text-muted">{detail}</span>}
      <span className="text-muted lowercase transition-colors group-hover:text-fg">
        {meta}{" "}
        <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
      </span>
    </Link>
  );
}
