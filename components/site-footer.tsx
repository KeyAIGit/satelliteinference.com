import Image from "next/image";

export function SiteFooter() {
  return (
    <footer>
      <div className="footer-brand">
        <Image src="/logo-mark.svg" alt="" width={34} height={34} />
        <div><strong>Satellite Inference</strong><span>Orbital Computing Infrastructure</span></div>
      </div>
      <div className="footer-links">
        <a href="mailto:procurement@satelliteinference.com">Contact</a>
        <a href="/privacy">Privacy</a>
        <a href="/disclaimer">Disclaimer</a>
        <a href="/.well-known/security.txt">Security</a>
      </div>
      <p className="footer-legal">
        Satellite Inference™ is currently operated by RFID INC, a Delaware corporation. © 2026 RFID INC. All rights reserved.<br />
        Public working concept, 4 September 2026. Preliminary assumptions require supplier, regulatory and customer validation.
      </p>
    </footer>
  );
}
