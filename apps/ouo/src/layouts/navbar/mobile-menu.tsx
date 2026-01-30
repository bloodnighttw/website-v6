"use client";

import { useEffect, useRef, useState } from "react";
import Link from "rpress/link";
import * as stylex from "@stylexjs/stylex";
import { colors, spacing, radius, fontSize } from "@/styles/tokens.stylex";
import { styles as globalStyles } from "@/styles/styles";
import type { Lang } from "@/utils/i18n/config";
import LangButton from "./lang-button";
import ThemeButton from "./theme-button";
import { createPortal } from "react-dom";
import { HiMenu, HiX } from "react-icons/hi";

const NAV_LINKS = [
  { href: "/friends", label: "friends link" },
  { href: "/blog", label: "blog" },
] as const;

const styles = stylex.create({
  button: {
    display: {
      default: "flex",
      "@media (min-width: 768px)": "none",
    },
    width: "1.5rem",
    cursor: "pointer",
    marginRight: "0.5rem",
    position: "relative",
    height: "1.5rem",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    transitionProperty: "transform",
    transitionDuration: "200ms",
    transform: {
      ":hover": "scale(1.1)",
    },
  },
  icon: {
    position: "absolute",
    inset: 0,
    transitionProperty: "opacity, transform",
    transitionDuration: "300ms",
  },
  iconVisible: {
    opacity: 1,
    transform: "rotate(0deg) scale(1)",
  },
  iconHidden: {
    opacity: 0,
    transform: "rotate(90deg) scale(0)",
  },
  iconHiddenNegative: {
    opacity: 0,
    transform: "rotate(-90deg) scale(0)",
  },
  container: {
    position: "absolute",
    top: "100%",
    left: 0,
    marginTop: spacing.md,
    marginBottom: spacing.md,
    right: 0,
    marginLeft: spacing.md,
    marginRight: spacing.md,
    backgroundColor: "rgba(113, 113, 122, 0.1)",
    backdropFilter: "blur(20px)",
    borderRadius: radius.xl,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    padding: "0.5rem",
    animationName: "fadeInSlideDown",
    animationDuration: "200ms",
  },
  link: {
    fontSize: fontSize.lg,
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem",
    borderRadius: radius.lg,
    backgroundColor: {
      ":hover": "rgba(113, 113, 122, 0.2)",
    },
    transform: {
      ":active": "scale(0.95)",
    },
  },
  divider: {
    borderColor: "rgba(113, 113, 122, 0.2)",
    borderWidth: "1px 0 0 0",
    borderStyle: "solid",
    marginTop: "0.5rem",
    marginBottom: "0.5rem",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    gap: spacing.md,
    marginTop: "0.5rem",
    paddingLeft: "0.5rem",
    paddingRight: "0.5rem",
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem",
  },
  controlsLabel: {
    fontSize: fontSize.sm,
    opacity: 0.7,
    fontWeight: 500,
  },
  nav: {
    display: "flex",
    flexDirection: "column",
  },
});

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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
        {...stylex.props(styles.button)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        type="button"
      >
        <HiMenu
          size={24}
          {...stylex.props(
            styles.icon,
            isOpen ? styles.iconHiddenNegative : styles.iconVisible,
          )}
          aria-hidden="true"
        />
        <HiX
          size={24}
          {...stylex.props(
            styles.icon,
            isOpen ? styles.iconVisible : styles.iconHidden,
          )}
          aria-hidden="true"
        />
      </button>

      {isMounted &&
        isOpen &&
        createPortal(
          <div
            id="mobile-menu"
            {...stylex.props(styles.container, globalStyles.card)}
            ref={ref}
            onClick={(e) => e.stopPropagation()}
            role="menu"
            aria-label="Mobile navigation menu"
          >
            <nav {...stylex.props(styles.nav)} role="navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={`/${lang}${link.href}`}
                  {...stylex.props(styles.link)}
                  onClick={closeMenu}
                  role="menuitem"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <hr {...stylex.props(styles.divider)} />

            <div {...stylex.props(styles.controls)}>
              <span {...stylex.props(styles.controlsLabel)}>Settings:</span>
              <LangButton />
              <ThemeButton />
            </div>
          </div>,
          document.getElementById("menu")!,
        )}
    </>
  );
}
