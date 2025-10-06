import "server-only";

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

export default loadTheme;
