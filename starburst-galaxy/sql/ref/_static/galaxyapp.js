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
