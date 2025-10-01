const loadTheme = () => {
  const theme = localStorage.getItem("theme");
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  console.debug("Stored theme:", theme);
  console.debug("Prefers dark scheme:", prefersDarkScheme.matches);

  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  }
  // if theme is not set, use system preference, note it won't trigger when theme="light"
  if (!theme) {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    }
  }
};

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

export { loadTheme, getCurrentTheme, toggleTheme };
