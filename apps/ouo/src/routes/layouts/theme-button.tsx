"use client";

import { getCurrentTheme, toggleTheme } from "@/utils/theme";
import { useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import NoSSR from "rpress/nossr";

export default function ThemeButton() {
  const [theme, setTheme] = useState(
    typeof window === undefined ? getCurrentTheme() : "light",
  );

  const setAndToggleTheme = () => {
    toggleTheme();
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const icon =
    theme === "dark" ? (
      <MdOutlineLightMode
        size={24}
        className="text-secondary-50"
        onClick={setAndToggleTheme}
      />
    ) : (
      <MdOutlineDarkMode
        size={24}
        className="text-secondary-900"
        onClick={setAndToggleTheme}
      />
    );

  const spinner = (
    <CgSpinner
      size={24}
      className="animate-spin dark:text-secondary-100 text-secondary-900"
    />
  );

  return (
    <div className="w-6 cursor-pointer">
      <NoSSR fallback={spinner}>{icon}</NoSSR>
    </div>
  );
}
