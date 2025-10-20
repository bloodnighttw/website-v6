"use client";

import useNavigate from "rpress/navigate";
import { useTranslation } from "react-i18next";

export default function LangButton() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const currentLang = i18n.language || "en";

  const toggleLang = () => {
    const pathParts = window.location.pathname.split("/");
    const newLang = currentLang === "en" ? "zh" : "en";
    pathParts[1] = newLang;
    const newPath = pathParts.join("/");
    navigate(newPath);
  };

  return (
    <button
      onClick={toggleLang}
      className="w-6 cursor-pointer mr-2"
      aria-label="Toggle language"
    >
      {currentLang === "en" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dy=".35em"
            fontSize="16"
            fontWeight="bold"
          >
            中
          </text>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dy=".35em"
            fontSize="16"
            fontWeight="bold"
          >
            EN
          </text>
        </svg>
      )}
    </button>
  );
}
