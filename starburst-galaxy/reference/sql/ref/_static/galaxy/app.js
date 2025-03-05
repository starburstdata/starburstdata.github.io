window.onload = () => {
  // Notify parent on load
  parent.postMessage(
    {
      eventName: "docs:onload",
      payload: {
        currentUrl: window.location.href,
        currentPath: window.location.pathname,
      },
    },
    "*"
  );
};

const DOCS_THEME_MODE_KEY = "DOCS_THEME_MODE";
const storedThemeMode = localStorage.getItem(DOCS_THEME_MODE_KEY);

if (storedThemeMode === "dark") {
    document.documentElement.classList.add("dark-mode");
}

window.onmessage = ({ data }) => {
  if (data?.type === "applyStyles") {
    const isDarkModeApplied = document.documentElement.classList.contains("dark-mode");
    const newThemeMode = data?.themeMode;

    localStorage.setItem(DOCS_THEME_MODE_KEY, newThemeMode);
    if (newThemeMode === "dark" && !isDarkModeApplied) {
        document.documentElement.classList.add("dark-mode");
    } else if (newThemeMode === "light") {
        document.documentElement.classList.remove("dark-mode");
    }
  }
};
