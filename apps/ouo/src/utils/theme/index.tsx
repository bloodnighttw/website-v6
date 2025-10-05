"use client";

const getCurrentTheme = () => {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
};

const toggleTheme = () => {
  const currentTheme = getCurrentTheme();
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  const systemTheme = prefersDarkScheme.matches ? "dark" : "light";

  if (currentTheme === "dark") {
    document.documentElement.classList.remove("dark");

    if (systemTheme !== "light") localStorage.setItem("theme", "light");
    else localStorage.removeItem("theme");
  } else {
    // currentTheme is light
    document.documentElement.classList.add("dark");
    if (systemTheme !== "dark") localStorage.setItem("theme", "dark");
    else localStorage.removeItem("theme");
  }
};

export { getCurrentTheme, toggleTheme };
