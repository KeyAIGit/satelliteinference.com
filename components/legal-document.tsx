import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

type LegalDocumentProps = {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
};

export function LegalDocument({ eyebrow, title, updated, children }: LegalDocumentProps) {
  return (
    <main className="legal-page">
      <header className="legal-header">
        <Link className="legal-brand" href="/" aria-label="Back to Satellite Inference">
          <Image src="/logo-mark.svg" alt="" width={37} height={37} priority />
          <span><strong>Satellite Inference</strong><small>Orbital Computing Infrastructure</small></span>
        </Link>
        <Link className="legal-back" href="/"><ArrowLeft aria-hidden="true" size={16} /> Back to site</Link>
      </header>

      <article className="legal-document">
        <p className="kicker">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="legal-updated">Last updated: {updated}</p>
        <div className="legal-content">{children}</div>
      </article>

      <footer className="legal-footer">
        <span>Satellite Inference™ is currently operated by RFID INC, a Delaware corporation.</span>
        <a href="mailto:procurement@satelliteinference.com">procurement@satelliteinference.com</a>
      </footer>
    </main>
  );
}
