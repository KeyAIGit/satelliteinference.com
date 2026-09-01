"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Menu, X } from "lucide-react";

const navigation = [
  { href: "#concept", label: "Flight node" },
  { href: "#model", label: "Orbit model" },
  { href: "#roadmap", label: "Roadmap" },
  { href: "#evidence", label: "Evidence" },
  { href: "#documents", label: "Documents" },
];

export function SiteNavigation() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.hydrated = "true";
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <header className="site-header">
      <a className="brand-lockup" href="#top" aria-label="Satellite Inference home" onClick={() => setOpen(false)}>
        <Image src="./logo-mark.svg" alt="" className="brand-mark" width={37} height={37} priority />
        <span>
          <strong>Satellite Inference</strong>
          <small>Orbital Computing Infrastructure</small>
        </span>
      </a>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {navigation.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}
      </nav>

      <a className="header-cta" href="#documents">
        Whitepaper <ArrowUpRight aria-hidden="true" size={15} />
      </a>

      <button
        type="button"
        className="menu-toggle"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>

      <div className={open ? "mobile-menu open" : "mobile-menu"} id="mobile-navigation">
        <nav aria-label="Mobile navigation">
          {navigation.map((item, index) => (
            <a href={item.href} key={item.href} onClick={() => setOpen(false)}>
              <span>{String(index + 1).padStart(2, "0")}</span>{item.label}
            </a>
          ))}
          <a className="mobile-menu-contact" href="mailto:ceo@keyai.org" onClick={() => setOpen(false)}>
            Start a technical conversation <ArrowUpRight aria-hidden="true" />
          </a>
        </nav>
        <p>Satellite Inference™ is currently operated by RFID INC, a Delaware corporation.</p>
      </div>
    </header>
  );
}
