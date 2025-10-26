import Link from "rpress/link";
import Image from "rpress/image";
import setting from "@/config/config.json";
import "server-only";
import ThemeButton from "./theme-button";
import LangButton from "./lang-button";
import MobileMenu from "./mobile-menu";
import type { Lang } from "@/utils/i18n/config";
import { cn } from "@/utils/cn";

const NAV_LINKS = [
  { href: "/friends", label: "friends link" },
  { href: "/blog", label: "blog" },
] as const;

const NAVBAR_STYLES = {
  container: "container *:px-4 md:*:pr-6 sticky top-2 z-100",
  wrapper: cn(
    "flex items-center min-h-16 gap-4 card mt-2",
    "bg-primary-500/10 rounded-full backdrop-blur-2xl",
  ),
  avatar:
    "rounded-full size-8 transition-transform duration-300 hover:scale-110",
  navLinks: cn(
    "mx-auto flex gap-4 text-sm not-md:hidden",
    "text-primary-700 dark:text-primary-300",
  ),
  navLink: cn(
    "relative py-1 transition-all duration-200",
    "hover:text-primary-900 dark:hover:text-primary-100",
    "after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0",
    "after:h-0.5 after:bg-primary-500 after:scale-x-0 after:transition-transform",
    "hover:after:scale-x-100",
  ),
  controls: "mx-auto md:mx-0 flex not-md:hidden gap-2 items-center",
} as const;

export default function Navbar({ lang }: { lang: Lang }) {
  return (
    <>
      <nav
        className={NAVBAR_STYLES.container}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className={NAVBAR_STYLES.wrapper}>
          <Link to={`/${lang}`} aria-label="Home">
            <Image
              src={setting.avatar}
              className={NAVBAR_STYLES.avatar}
              alt="Avatar"
            />
          </Link>

          <div className={NAVBAR_STYLES.navLinks}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={`/${lang}${link.href}`}
                className={NAVBAR_STYLES.navLink}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className={NAVBAR_STYLES.controls}>
            <LangButton />
            <ThemeButton />
          </div>

          <div className="mx-auto md:hidden" />
          <MobileMenu lang={lang} />
        </div>
      </nav>
      <div
        id="menu"
        className="sticky top-18 w-full z-100"
        aria-live="polite"
      />
    </>
  );
}
