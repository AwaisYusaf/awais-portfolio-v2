import { site } from "@/site.config";

const linkClass =
  "underline decoration-line underline-offset-4 transition-colors hover:decoration-fg";

// Email, phone (WhatsApp or call) and the booking link.
export function ContactDetails() {
  const phoneDigits = site.phone.replace(/\D/g, "");
  const tel = `tel:+${phoneDigits}`;
  const whatsapp = `https://wa.me/${phoneDigits}`;

  return (
    <div className="flex flex-col items-start gap-2">
      <a href={`mailto:${site.email}`} className={linkClass}>
        {site.email}
      </a>
      <p>
        <a href={tel} className={linkClass}>
          {site.phone}
        </a>
        <span className="text-muted">
          {" ("}
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-fg">
            whatsapp
          </a>
          {" / "}
          <a href={tel} className="transition-colors hover:text-fg">
            call
          </a>
          {")"}
        </span>
      </p>
      <a
        href={site.bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted transition-colors hover:text-fg"
      >
        or book a meeting →
      </a>
    </div>
  );
}
