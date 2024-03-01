// Function to scroll the nav automatically
function addArrowElementChild(element) {
  // Create checkbox element
  var arrowElement = document.createElement('span');
  arrowElement.className = 'arrow fa fa-angle-right';
  // Insert the <span> before the existing content of the <a> tag
  element.insertBefore(arrowElement, element.firstChild);
}

const menuData = [
  "Features, use cases, and support",
  "Try Starburst Enterprise",
  "Clients",
  "Data products",
  "Insights",
  "SQL language",
  "SQL statement syntax",
  "Functions and operators",
  "SQL routines",
  "Query optimizer",
  "Developer guide",
  "Object storage connectors",
  "Non-object storage connectors",
  "Utilities",
  "Community-supported connectors",
  "Administration topics",
  "Performance, logging, and governance features",
  "Security",
  "AWS ecosystem",
  "Google Cloud",
  "Microsoft Azure",
  "Deploy with Kubernetes",
  "Deploy with Starburst Admin",
  "Deploy with CFT on AWS",
  "Local installation",
  "Version-specific notices and information"
]

// Add arrow and remove section navbar on the left side
document.addEventListener('DOMContentLoaded', function(){
  // Define an array of selector strings
  var selectors = ['.toctree-l1', '.toctree-l2', '.toctree-l3'];
  // Get all elements with the class "reference internal"
  var elements = document.querySelectorAll('.reference.internal');

  // Loop through each element and check if its href contains "#" and it has a parent with class "toctree-l1"
  elements.forEach(function(element) {
    var parent = element.closest('.toctree-l1');
    var hrefValue = element.getAttribute('href');

    // Check if the href attribute contains "#" and is not equal to "#"
    if (parent && hrefValue && hrefValue !== "#" && hrefValue.includes('#')) {
      // Hide the element
      element.style.display = 'none';
    }
  });

  // Iterate through each selector and apply the function
  selectors.forEach(function (selector) {
    // Select all elements matching the current selector
    var elements = document.querySelectorAll(selector);

    // Iterate through each matching element and apply the function
    elements.forEach(function (element) {
      // Check if the 'toctree-l1' element has children
      if (element.children.length > 0) {
        // If it has children, select the 'a' element and apply the function
        var childLink = element.querySelector('a');
         // Check if the text content of the element is in the menuData array
        if (childLink && menuData.includes(childLink.firstChild.data)) {
          addArrowElementChild(childLink);
        }
      }
    });
  });

  //what happens when the left side bar is being clicked
  document.body.addEventListener('click', function (event) {
    // Check if the clicked element or its parent has the class 'toctree-l1'
    var toctreeL1 = event.target.closest('.toctree-l1');

    // Check if the clicked element has the class 'current'
    var isCurrent = event.target.classList.contains('current');
    console.log(isCurrent)

    if (toctreeL1 && true) {


        // Toggle the class on the clicked element
        var arrowElement = toctreeL1.querySelector('.arrow');

        // Toggle between 'fa-angle-right' and 'fa-angle-down'
        arrowElement.classList.toggle('fa-angle-right');
        arrowElement.classList.toggle('fa-angle-down');

        // Get the ul child element of the clicked element
        var child = event.target.nextElementSibling;

        // Toggle the visibility classes on the child element based on its current state
        if (child) {
            child.classList.toggle('visibility-none');
        }
    }
  });

  // Simulate a click event on a specific element after the DOM content has loaded
  var targetElement = document.querySelector('.toctree-l1.current a');
  var clickEvent = new Event('click', {
      bubbles: true,
      cancelable: true
  });

  // Below is the original code
  // This function is to keep the left bar scrolling to the top 
  targetElement.addEventListener('click', function (event) {
      // Scroll to the clicked element
      event.target.scrollIntoView({ behavior: 'smooth', inline: 'nearest', scrollMode: 'if-needed', block: 'center', inline: 'nearest' });

      var child = event.target.nextElementSibling;
      if (child) {
        child.classList.toggle('visibility-none');
    }
  });

  // Dispatch the simulated click event
  targetElement.dispatchEvent(clickEvent);
});

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

function toggleDropdown(){
  document.addEventListener('click', event => {
    const searchClass = document.getElementById('algolia-search');
    if ((searchClass.contains(event.target) || event.target.classList.contains('refinement-list-checkbox'))
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

toggleDropdown();
