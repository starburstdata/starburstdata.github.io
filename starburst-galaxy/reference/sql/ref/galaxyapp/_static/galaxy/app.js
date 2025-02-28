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

window.onmessage = (messageEvent) => {
    if (messageEvent.data?.type === "applyStyles") {
        const isDarkModeApplied = document.documentElement.classList.contains("dark-mode");

        if (messageEvent.data?.mode === "dark" && !isDarkModeApplied) {
            document.documentElement.classList.add("dark-mode");
        } else if (messageEvent.data?.mode === "light") {
            document.documentElement.classList.remove("dark-mode");
        }
    }
};