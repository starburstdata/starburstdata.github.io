function toggle_navigation_visibility(id) {
  var e = document.getElementById(id);
  var elementStyles = window.getComputedStyle(e);

  // finds the menu icon
  var icon = e.previousElementSibling.querySelector('i');


  if (elementStyles.getPropertyValue('display') == 'block') {
    e.style.display = 'none';
    icon.style.transform = 'rotate(0deg)';
  } else {
    e.style.display = 'block';
    icon.style.transform = 'rotate(-90deg)';
  }
}
