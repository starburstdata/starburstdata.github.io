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

function copyToClipboard() {
  var titleAnchor = document.querySelectorAll('.titleAnchor');
  var url = window.location.href;

  titleAnchor.forEach((el) =>
    el.addEventListener('click', (event) => {
      navigator.clipboard.writeText(url + event.target.getAttribute('href'));
    })
  );
}

copyToClipboard();

function copyCode() {
  var codeblocks = document.querySelectorAll('pre.highlight');

  codeblocks.forEach(function (codeblock) {
    var cpBtn = document.createElement('button');
    cpBtn.className = 'copy';
    cpBtn.type = 'button';
    cpBtn.ariaLabel = 'Copy code to clipboard';
    cpBtn.innerText = 'Copy';
    cpBtn.style.position = 'relative';
    cpBtn.style.float = 'right';

    codeblock.prepend(cpBtn);

    cpBtn.addEventListener('click',
      function () {
        var code = codeblock.querySelector('code').innerText.trim();
        window.navigator.clipboard.writeText(code);
        cpBtn.innerText = 'Copied';
        setTimeout(function () { cpBtn.innerText = 'Copy';}, 2000);
      });
  });
}

copyCode();

function getVideoLength(time) {
  const videoLength = time;
  let [hours, minutes, seconds] = videoLength.split(':');
  hours = parseInt(hours);
  minutes = parseInt(minutes);
  seconds = parseInt(seconds);

  if (hours > 0){
    document.getElementById("videoLength").innerHTML = `${hours}h ${minutes}m`;
  }
  else{
    if (seconds >= 30){
      minutes++;
    }
    document.getElementById("videoLength").innerHTML = `${minutes}m`;
  }
}
