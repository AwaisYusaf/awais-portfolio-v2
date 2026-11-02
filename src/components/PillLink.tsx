import type { ReactNode } from "react";

const styles = {
  solid: "bg-fg text-bg transition-opacity hover:opacity-85",
  outline: "border border-line text-fg hover:border-fg",
};

export function PillLink({
  href,
  variant = "solid",
  children,
}: {
  href: string;
  variant?: keyof typeof styles;
  children: ReactNode;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      className={`inline-flex min-h-11 items-center rounded-full px-5 ${styles[variant]}`}
    >
      {children}
    </a>
  );
}
