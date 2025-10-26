"use client";

import { toggleTheme } from "@/utils/theme";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";

export default function ThemeButton() {
  const handleToggleTheme = () => {
    toggleTheme();
  };

  return (
    <button
      onClick={handleToggleTheme}
      className="w-6 h-6 cursor-pointer relative flex items-center justify-center transition-transform duration-200 hover:scale-110 rounded"
      aria-label="Toggle theme"
      type="button"
    >
      <MdOutlineLightMode
        size={24}
        className="text-secondary-50 absolute inset-0 duration-300 dark:opacity-100 dark:rotate-0 opacity-0 -rotate-90"
        aria-hidden="true"
      />
      <MdOutlineDarkMode
        size={24}
        className="text-secondary-900 absolute inset-0 duration-300 dark:opacity-0 dark:rotate-90 opacity-100 rotate-0"
        aria-hidden="true"
      />
    </button>
  );
}
