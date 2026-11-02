import Link from "next/link";
import { site } from "@/site.config";
import { ThemeToggle } from "@/components/ThemeToggle";

const links = [
  { href: "/#work", label: "work" },
  { href: "/#services", label: "services" },
  { href: "/blog", label: "blog" },
  { href: "/#contact", label: "contact" },
];

export function Header() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-6">
      <Link href="/" className="py-2.5 font-medium">
        {site.name}
      </Link>
      <nav aria-label="main" className="flex flex-wrap items-center gap-x-5">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="py-2.5 text-muted transition-colors hover:text-fg"
          >
            {link.label}
          </Link>
        ))}
        <ThemeToggle />
      </nav>
    </header>
  );
}
