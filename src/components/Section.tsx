import type { ReactNode } from "react";

export function Label({ children }: { children: ReactNode }) {
  return <p className="mb-4 text-[13px] text-muted">{children}</p>;
}

// A block of the page: thin top rule, small muted label, content.
export function Section({
  id,
  label,
  className = "py-10",
  children,
}: {
  id?: string;
  label: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`scroll-mt-6 border-t border-line ${className}`}>
      <Label>{label}</Label>
      {children}
    </section>
  );
}
