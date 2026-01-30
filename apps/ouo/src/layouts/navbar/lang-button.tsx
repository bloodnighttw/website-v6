"use client";

import useNavigate from "rpress/navigate";
import { useTranslation } from "react-i18next";
import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
  button: {
    width: "1.5rem",
    height: "1.5rem",
    cursor: "pointer",
    marginRight: "0.5rem",
    transitionProperty: "transform",
    transitionDuration: "200ms",
    transform: {
      ":hover": "scale(1.1)",
    },
  },
  svg: {
    transitionProperty: "transform",
    transitionDuration: "200ms",
    transform: {
      ":hover": "scale(1.05)",
    },
  },
});

const LANGUAGES = {
  en: { label: "EN", nextLang: "zh", ariaLabel: "Switch to Chinese" },
  zh: { label: "中", nextLang: "en", ariaLabel: "Switch to English" },
} as const;

export default function LangButton() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const currentLang = (i18n.language || "en") as keyof typeof LANGUAGES;
  const langConfig = LANGUAGES[currentLang];

  const toggleLang = () => {
    const pathParts = window.location.pathname.split("/");
    pathParts[1] = langConfig.nextLang;
    const newPath = pathParts.join("/");
    navigate(newPath);
  };

  return (
    <button
      onClick={toggleLang}
      {...stylex.props(styles.button)}
      aria-label={langConfig.ariaLabel}
      type="button"
      title={langConfig.ariaLabel}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        {...stylex.props(styles.svg)}
      >
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".35em"
          fontSize="16"
          fontWeight="bold"
        >
          {langConfig.label}
        </text>
      </svg>
    </button>
  );
}
