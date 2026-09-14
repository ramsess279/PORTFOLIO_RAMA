import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "@/hooks/useTheme";

const links = [
  { label: "Projets", href: "#projets" },
  { label: "Méthode", href: "#methode" },
  { label: "À propos", href: "#apropos" },
  { label: "Contact", href: "#contact" },
];

export const Navbar = () => {
  const { theme } = useTheme();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  const homeHref = (hash: string) => pathname === "/" ? hash : `/${hash}`;

  return (
    <header className={`site-nav ${scrolled ? "is-scrolled" : ""}`}>
      <div className="site-nav__inner">
        <Link to="/" className="brand-mark" aria-label="Accueil — Ramatoulaye Gueye">
          <img src={theme === "dark" ? "/branding/logo-a-lavishly-yours-dark.png" : "/branding/logo-a-lavishly-yours-light.png"} alt="" />
          <span>Ramatoulaye Gueye</span>
        </Link>

        <nav className="site-nav__links" aria-label="Navigation principale">
          {links.map((item) => <a key={item.href} href={homeHref(item.href)}>{item.label}</a>)}
        </nav>

        <div className="site-nav__actions">
          <ThemeToggle />
          <a href={homeHref("#contact")} className="nav-cta">Travaillons ensemble <ArrowUpRight aria-hidden="true" /></a>
          <button type="button" className="menu-toggle" aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
        {links.map((item, index) => (
          <a key={item.href} href={homeHref(item.href)} onClick={() => setOpen(false)}><span>0{index + 1}</span>{item.label}</a>
        ))}
      </div>
    </header>
  );
};
