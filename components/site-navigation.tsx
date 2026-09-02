"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Menu, X } from "lucide-react";

const navigation = [
  { href: "#concept", label: "Flight node" },
  { href: "#model", label: "Orbit model" },
  { href: "#roadmap", label: "Roadmap" },
  { href: "#evidence", label: "Evidence" },
  { href: "#documents", label: "Documents" },
  { href: "#contact", label: "Contact" },
];

export function SiteNavigation() {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenu = () => {
    setOpen(false);
    window.requestAnimationFrame(() => menuButtonRef.current?.focus());
  };

  useEffect(() => {
    document.documentElement.dataset.hydrated = "true";
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab") return;

      const menuItems = Array.from(
        menuRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [],
      );
      const focusableItems = [menuButtonRef.current, ...menuItems].filter(
        (item): item is HTMLElement => Boolean(item),
      );
      const firstItem = focusableItems[0];
      const lastItem = focusableItems.at(-1);

      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem?.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [open]);

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
        ref={menuButtonRef}
        type="button"
        className="menu-toggle"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>

      <div
        ref={menuRef}
        className={open ? "mobile-menu open" : "mobile-menu"}
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        aria-hidden={!open}
        inert={!open}
      >
        <nav aria-label="Mobile navigation">
          {navigation.map((item, index) => (
            <a href={item.href} key={item.href} onClick={closeMenu}>
              <span>{String(index + 1).padStart(2, "0")}</span>{item.label}
            </a>
          ))}
          <a className="mobile-menu-contact" href="mailto:partnerships@satelliteinference.com" onClick={closeMenu}>
            Start a technical conversation <ArrowUpRight aria-hidden="true" />
          </a>
        </nav>
        <p>Satellite Inference™ is currently operated by RFID INC, a Delaware corporation.</p>
      </div>
    </header>
  );
}
