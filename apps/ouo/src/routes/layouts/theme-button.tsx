"use client";

import { toggleTheme } from "@/utils/theme";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";

export default function ThemeButton() {
  const setAndToggleTheme = () => {
    toggleTheme();
  };

  return (
    <div className="w-6 cursor-pointer">
      <MdOutlineLightMode
        size={24}
        className="text-secondary-50 none size-0 dark:block dark:size-6"
        onClick={setAndToggleTheme}
      />
      <MdOutlineDarkMode
        size={24}
        className="text-secondary-900 dark:none dark:size-0"
        onClick={setAndToggleTheme}
      />
    </div>
  );
}
