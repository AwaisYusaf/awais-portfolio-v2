import Link from "next/link";

import { Label } from "@/components/Section";

export default function NotFound() {
  return (
    <section className="flex flex-col pt-24 pb-24">
      <Label>404</Label>
      <h1 className="mb-4 text-[22px] font-medium tracking-[-0.02em]">page not found.</h1>
      <p className="text-muted">
        {"nothing here. "}
        <Link
          href="/"
          className="text-fg underline decoration-line underline-offset-4 transition-colors hover:decoration-fg"
        >
          go home →
        </Link>
      </p>
    </section>
  );
}
