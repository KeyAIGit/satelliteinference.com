import Image from "next/image";

export function SiteFooter() {
  return (
    <footer>
      <div className="footer-brand">
        <Image src="/logo-mark.svg" alt="" width={34} height={34} />
        <div><strong>Satellite Inference</strong><span>Orbital Computing Infrastructure</span></div>
      </div>
      <div className="footer-links">
        <a href="/contact">Contact</a>
        <a href="/progress">Progress</a>
        <a href="https://github.com/KeyAIGit/satelliteinference.com">GitHub</a>
        <a href="/privacy">Privacy</a>
        <a href="/disclaimer">Disclaimer</a>
        <a href="/.well-known/security.txt">Security</a>
      </div>
      <p className="footer-legal">
        Satellite Inference™ is currently operated by RFID INC, a Delaware corporation. © 2026 RFID INC. All rights reserved.<br />
        Ground-stage research program. Mission concepts remain subject to engineering and customer validation.
      </p>
    </footer>
  );
}
