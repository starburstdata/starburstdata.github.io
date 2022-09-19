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
    icon.style.transform = 'rotate(90deg)';
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

function setupSearch() {
  document.addEventListener('click', event => {
    const searchClass = document.getElementById('site-search');

    if ((searchClass.contains(event.target) || event.target.classList.contains('ais-RefinementList-checkbox'))
    && document.querySelector('.ais-SearchBox-input').value) {
      document.getElementById('refinement-list').style.display = 'flex';
      document.getElementById('hits').style.display = 'block';
      document.getElementById('stats').style.display = 'flex';
    }
    else {
      document.getElementById('refinement-list').style.display = 'none';
      document.getElementById('hits').style.display = 'none';
      document.getElementById('stats').style.display = 'none';
    }
  })
}

setupSearch();

document.addEventListener('keydown', event => {
  const searchInput = document.querySelector('.ais-SearchBox-input').value;

  if (searchInput && event.key == 'Enter'){
    if (document.activeElement == document.querySelector('.ais-SearchBox-input')){
      window.location.href =  "/searchresults?q=" + searchInput;
    }
  }
})

function getVideoLength(time) {
  const videoLength = time;
  let [hours, minutes, seconds] = videoLength.split(':');
  const videoElement = document.getElementsByClassName(time);
  let newTime;
  hours = parseInt(hours);
  minutes = parseInt(minutes);
  seconds = parseInt(seconds);

  if (hours > 0){
    newTime = `${hours}h ${minutes}m`;
  }
  else{
    if (seconds >= 30){
      minutes++;
    }
    newTime = `${minutes}m`;
  }
  for (let i = 0; i < videoElement.length; i++) {
    videoElement.item(i).innerHTML = newTime;
  }
}
