import type { ReactNode } from "react";

// The top of an inner page (about, work, contact): optional image, small
// label, one-line heading, optional muted text under it.
export function PageHeader({
  label,
  title,
  media,
  children,
}: {
  label: string;
  title: ReactNode;
  media?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 pt-18 pb-10">
      {media}
      <p className="text-[13px] text-muted">{label}</p>
      <h1 className="text-[22px] leading-[1.4] font-medium tracking-[-0.02em]">{title}</h1>
      {children}
    </section>
  );
}
