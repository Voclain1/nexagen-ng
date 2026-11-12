"use client";

import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

/** Desktop: inline links. Mobile: ☰ toggles the same links as a dropdown panel; closes on navigation. */
export function MobileMenu({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  return <>
    <nav className={`links${open ? " open" : ""}`} id="site-nav" aria-label="Primary">{children}</nav>
    <button className="menu" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="site-nav" onClick={() => setOpenOn(open ? null : pathname)}>{open ? "✕" : "☰"}</button>
  </>;
}
