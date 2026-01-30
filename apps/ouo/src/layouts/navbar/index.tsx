import Link from "rpress/link";
import Image from "rpress/image";
import setting from "@/config/config.json";
import "server-only";
import ThemeButton from "./theme-button";
import LangButton from "./lang-button";
import MobileMenu from "./mobile-menu";
import type { Lang } from "@/utils/i18n/config";
import * as stylex from "@stylexjs/stylex";
import { colors, spacing, radius, fontSize } from "@/styles/tokens.stylex";
import { styles as globalStyles } from "@/styles/styles";

const NAV_LINKS = [
  // { href: "/friends", label: "friends link" },
  // { href: "/blog", label: "blog" },
] as const;

const styles = stylex.create({
  container: {
    position: "sticky",
    top: "0.5rem",
    zIndex: 100,
    paddingLeft: {
      default: spacing.md,
      "@media (min-width: 768px)": "1.5rem",
    },
    paddingRight: {
      default: spacing.md,
      "@media (min-width: 768px)": "1.5rem",
    },
  },
  wrapper: {
    display: "flex",
    alignItems: "center",
    minHeight: "4rem",
    gap: spacing.md,
    marginTop: "0.5rem",
    backgroundColor: "rgba(113, 113, 122, 0.1)",
    borderRadius: radius.full,
    backdropFilter: "blur(20px)",
  },
  avatar: {
    borderRadius: radius.full,
    width: "2rem",
    height: "2rem",
    transitionProperty: "transform",
    transitionDuration: "300ms",
    transform: {
      ":hover": "scale(1.1)",
    },
  },
  navLinks: {
    marginLeft: "auto",
    marginRight: "auto",
    display: {
      default: "none",
      "@media (min-width: 768px)": "flex",
    },
    gap: spacing.md,
    fontSize: fontSize.sm,
    color: {
      default: colors.primary700,
      ":is(.dark *)": colors.primary300,
    },
  },
  navLink: {
    position: "relative",
    paddingTop: "0.25rem",
    paddingBottom: "0.25rem",
    transitionProperty: "color",
    transitionDuration: "200ms",
    color: {
      ":hover": {
        default: colors.primary900,
        ":is(.dark *)": colors.primary100,
      },
    },
    "::after": {
      content: "''",
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: "2px",
      backgroundColor: colors.primary500,
      transform: "scaleX(0)",
      transitionProperty: "transform",
      transitionDuration: "200ms",
    },
    ":hover::after": {
      transform: "scaleX(1)",
    },
  },
  controls: {
    marginLeft: "auto",
    marginRight: "auto",
    display: {
      default: "none",
      "@media (min-width: 768px)": "flex",
    },
    gap: "0.5rem",
    alignItems: "center",
    "@media (min-width: 768px)": {
      marginLeft: 0,
      marginRight: 0,
    },
  },
  mobileSpacer: {
    marginLeft: "auto",
    marginRight: "auto",
    display: {
      default: "block",
      "@media (min-width: 768px)": "none",
    },
  },
  menuPlaceholder: {
    position: "sticky",
    top: "4.5rem",
    width: "100%",
    zIndex: 100,
  },
});

export default function Navbar({ lang }: { lang: Lang }) {
  return (
    <>
      <nav
        {...stylex.props(styles.container)}
        role="navigation"
        aria-label="Main navigation"
      >
        <div {...stylex.props(styles.wrapper, globalStyles.card)}>
          <Link to={`/${lang}`} aria-label="Home">
            <Image
              src={setting.avatar}
              {...stylex.props(styles.avatar)}
              alt="Avatar"
            />
          </Link>

          <div {...stylex.props(styles.navLinks)}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={`/${lang}${link.href}`}
                {...stylex.props(styles.navLink)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div {...stylex.props(styles.controls)}>
            <LangButton />
            <ThemeButton />
          </div>

          <div {...stylex.props(styles.mobileSpacer)} />
          <MobileMenu lang={lang} />
        </div>
      </nav>
      <div
        id="menu"
        {...stylex.props(styles.menuPlaceholder)}
        aria-live="polite"
      />
    </>
  );
}
