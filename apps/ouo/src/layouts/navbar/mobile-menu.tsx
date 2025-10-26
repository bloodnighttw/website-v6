"use client";

import { useEffect, useRef, useState } from "react";
import Link from "rpress/link";
import { cn } from "@/utils/cn";
import { HiMenu, HiX } from "react-icons/hi";
import type { Lang } from "@/utils/i18n/config";
import LangButton from "./lang-button";
import ThemeButton from "./theme-button";
import { createPortal } from "react-dom";

const NAV_LINKS = [
  { href: "/friends", label: "friends link" },
  { href: "/blog", label: "blog" },
] as const;

const MENU_STYLES = {
  button:
    "md:hidden w-6 cursor-pointer mr-2 relative h-6 flex items-center justify-center rounded transition-transform hover:scale-110",
  icon: "absolute inset-0",
  container: cn(
    "absolute top-full left-0 my-4 right-0 mx-4",
    "card bg-primary-500/10 backdrop-blur-2xl rounded-2xl shadow-xl",
    "flex flex-col p-2 md:hidden",
    "animate-in fade-in slide-in-from-top-2 duration-200",
  ),
  link: "text-lg px-4 py-2 hover:bg-primary-500/20 rounded-lg active:scale-95",
  divider: "border-primary-500/20 my-2",
  controls: "flex items-center gap-4 mt-2 px-2 py-2",
  controlsLabel: "text-sm opacity-70 font-medium",
} as const;

export default function MobileMenu({ lang }: { lang: Lang }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Check if we're on the client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={toggleMenu}
        className={MENU_STYLES.button}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        type="button"
      >
        <HiMenu
          size={24}
          className={cn(
            MENU_STYLES.icon,
            isOpen
              ? "opacity-0 rotate-90 scale-0"
              : "opacity-100 rotate-0 scale-100",
          )}
          aria-hidden="true"
        />
        <HiX
          size={24}
          className={cn(
            MENU_STYLES.icon,
            isOpen
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-90 scale-0",
          )}
          aria-hidden="true"
        />
      </button>

      {isMounted &&
        isOpen &&
        createPortal(
          <div
            id="mobile-menu"
            className={MENU_STYLES.container}
            ref={ref}
            onClick={(e) => e.stopPropagation()}
            role="menu"
            aria-label="Mobile navigation menu"
          >
            <nav role="navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={`/${lang}${link.href}`}
                  className={MENU_STYLES.link}
                  onClick={closeMenu}
                  role="menuitem"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <hr className={MENU_STYLES.divider} />

            <div className={MENU_STYLES.controls}>
              <span className={MENU_STYLES.controlsLabel}>Settings:</span>
              <LangButton />
              <ThemeButton />
            </div>
          </div>,
          document.getElementById("menu")!,
        )}
    </>
  );
}
