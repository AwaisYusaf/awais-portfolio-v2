import { site } from "@/site.config";

export function Footer() {
  return (
    <footer className="flex flex-wrap justify-between gap-x-4 gap-y-2 border-t border-line pt-5 pb-10 text-[13px] text-muted">
      <span>
        © {new Date().getFullYear()} {site.name}
      </span>
      <span className="flex gap-4">
        {site.socials.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-line underline-offset-4 transition-colors hover:text-fg hover:decoration-fg"
          >
            {social.label}
          </a>
        ))}
      </span>
    </footer>
  );
}
