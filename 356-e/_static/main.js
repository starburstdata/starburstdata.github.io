document.addEventListener('DOMContentLoaded', function(){
  function checkSpanId() {
    var allSpan = document.getElementsByTagName("span");
    for(let i = 0;i < allSpan.length; i++) {
        if(allSpan[i].id) {
          allSpan[i].style.position = 'relative';
          allSpan[i].style.top = '-53px';
          allSpan[i].style.display = 'block';
        }
    }
  }

  function copyToClipboard() {
    var titleAnchor = document.querySelectorAll('.headerlink');
    var url = window.location.href;

    titleAnchor.forEach(el => el.addEventListener('click', event => {
      navigator.clipboard.writeText(url + event.target.getAttribute('href'))
    }));
  }

  checkSpanId();
  copyToClipboard();
});
