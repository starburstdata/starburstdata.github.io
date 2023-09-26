document.addEventListener('DOMContentLoaded', function(){
  function copyToClipboard() {
    var titleAnchor = document.querySelectorAll('.headerlink');
    var url = window.location.href;

    titleAnchor.forEach(el => el.addEventListener('click', event => {
      navigator.clipboard.writeText(url + event.target.getAttribute('href'))
    }));
  }

  copyToClipboard();
});

function setupSearch(){
  document.addEventListener('click', event => {
    const searchClass = document.getElementById('algolia-search');

    if ((searchClass.contains(event.target) || event.target.classList.contains('ais-RefinementList-checkbox'))
    && document.querySelector('.ais-SearchBox-input').value) {
      document.getElementById('product-list').style.display = 'flex';
      document.getElementById('hits').style.display = 'block';
      document.getElementById('stats').style.display = 'flex';
    }
    else {
      document.getElementById('product-list').style.display = 'none';
      document.getElementById('hits').style.display = 'none';
      document.getElementById('stats').style.display = 'none';
    }
  })
}

setupSearch();
