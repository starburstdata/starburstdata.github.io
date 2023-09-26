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

  // Notify parent on close-button click
  document.querySelector("#docs--closebutton").onclick = function () {
    parent.postMessage(
      {
        eventName: "docs:close",
      },
      "*"
    );
  };
};

window.goBack = () => {
  history.go(-1);
  setTimeout(() => {
    // If it stays on same page, then previous page doesn't exist in history
    document.querySelector('[data-nav="back"]').disabled = true;
  }, 100);
};

window.goForward = () => {
  history.go(1);
  setTimeout(() => {
    // If it stays on same page, then next page doesn't exist in history
    document.querySelector('[data-nav="forward"]').disabled = true;
  }, 100);
};
