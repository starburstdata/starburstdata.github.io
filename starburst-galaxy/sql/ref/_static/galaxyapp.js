window.onload = () => {
  // Notify parent on close-button click
  document.querySelector("#docs--closebutton").onclick = function () {
    parent.postMessage("docs:close", "*");
  };

  // Notify parent on URL change
  window.onbeforeunload = function () {
    parent.postMessage("docs:beforeunload", "*");
  };
};
