function addArrowElementChild(element) {
  var arrowElement = document.createElement('span');
  arrowElement.className = 'arrow fa fa-angle-right';
  element.insertBefore(arrowElement, element.firstChild);
  arrowElement.addEventListener('click', function(event) {
    event.preventDefault(); 
    event.stopPropagation();
  });
}

// This list refers to all the first-level toc that has an arrow
const menuData = [
  "What is Starburst Enterprise?",
  "Try Starburst Enterprise",
  "Starburst AI",
  "Clients",
  "Data products",
  "Insights",
  "SQL language",
  "SQL statement syntax",
  "Functions and operators",
  "SQL UDFs",
  "Query optimizer",
  "Object storage connectors",
  "Object storage extensions",
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
  "Release notes",
  "Trino developer guide",
  "Version-specific notices and information",
  "Red Hat OpenShift",
]

// This list refers to all the headers that have the child pages underneath. Each header that has child page(s) need to be mentioned here to show it properly on the left-hand nav.
const excludedText = [
  'Functions by name',
  'Functions per topic',
  'Statements A-F',
  'Statements G-R',
  'Statements S-Z',
  'Object storage connectors',
  'Object storage extensions',
  'Starburst tools',
  'System information',
  'Benchmarking',
  'Other utility connectors',
  "Properties reference",
  "Performance-related properties and features",
  "Starburst Cached Views",
  "Data governance",
  "Platform features",
  "Other resources",
  "Built-in access control",
  "User authentication and client security",
  "Cluster security",
  "Third-party access control",
  "Miscellaneous security options",
  "Security topic areas"
];


document.addEventListener('DOMContentLoaded', function(){
  var selectors = ['.toctree-l1' , '.toctree-l2', '.toctree-l3'];

  var elements = document.querySelectorAll('.reference.internal');

  elements.forEach(function(element) {
    // var parent = element.closest('.toctree-l1');
    var parent = element.closest('.toctree-l1, .toctree-l2, .toctree-l3');
    var hrefValue = element.getAttribute('href');
    var textContent = element.textContent;

    // Check if the href attribute contains "#" and is not equal to "#"
    if (parent && hrefValue && hrefValue !== "#" 
    && hrefValue.includes('#') 
    && !parent.querySelector('a[href$=".html"]')
    && !excludedText.some(excluded => textContent.includes(excluded))
    ) {
      // Hide the element
      element.style.display = 'none';
    }
  });

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
        if (childLink && menuData.includes(childLink.firstChild.data) 
        && element.classList.contains('toctree-l1')
        ) {
          addArrowElementChild(childLink);
        }
      }
    });
  });

  // Simulate a click event on a specific element after the DOM content has loaded
  var targetElement1 = document.querySelector('.toctree-l1.current a');
  var targetElement2 = document.querySelector('.toctree-l2.current a');
  var targetElement3 = document.querySelector('.toctree-l3.current a');
  var targetElement4 = document.querySelector('.toctree-l4.current a');
  var clickEvent = new Event('click', {
      bubbles: true,
      cancelable: true
  });

  var clickEvent2 = new Event('click', {
    bubbles: true,
    cancelable: true
  });

  // This function is to keep the left bar scrolling to the top 
  var targetElement = targetElement2 || targetElement3 || targetElement1 || targetElement4;

  if(targetElement) {
    targetElement.addEventListener('click', function (event) {
      // var toctreeL1 = event.target.closest('.toctree-l1');  
      var toctree = event.target.closest('.toctree-l1, .toctree-l2, .toctree-l3');

      var arrowElement = toctree.querySelector('.arrow');
      var child = event.target.nextElementSibling;
      child.classList.add("current")
      // event.target.style.color = '#1A306E'; // Change color to '#1A306E' when clicked

      var toctreeL2Elements = document.querySelectorAll('.toctree-l2'); 

      toctreeL2Elements.forEach(function(toctreeL2) {
        toctreeL2.addEventListener('click', function(event) {
          // Inside the event listener, remove the "addBold" class from all 'toctree-l2' elements
          toctreeL2Elements.forEach(function(element) {
            element.classList.remove("addBold");
          });

          // Add the "addBold" class to the clicked 'toctree-l2' element
          var grandChild = event.target;

          grandChild.classList.add("bold");
        });

        toctreeL2.dispatchEvent(clickEvent2)
      });

      if (toctree && child) {
        // Toggle visibility of the child element
        child.classList.toggle('visible');

        // Check if the child element is now visible
        var isVisible = child.classList.contains('visible');
        
        if(event.target.baseURI.includes('#')){
          setTimeout(function(){
            // event.target.nextElementSibling.scrollIntoView({ behavior: 'smooth', inline: 'nearest', scrollMode: 'if-needed', block: 'end', inline: 'nearest' });
            // console.log(event.target.nextElementSibling, "clicked")
            if ('scrollBehavior' in document.documentElement.style) {
              event.target.nextElementSibling.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
              var scrollY = window.scrollY + event.target.nextElementSibling.getBoundingClientRect().top;
              window.scrollTo({ top: scrollY, behavior: 'smooth' });
            }
            arrowElement.classList.toggle('fa-angle-right', !isVisible);
            arrowElement.classList.toggle('fa-angle-down', isVisible);
          }, 100)
        } 
        else {
          setTimeout(function(){
            // event.target.scrollIntoView({ behavior: 'smooth', inline: 'nearest', scrollMode: 'if-needed', block: 'center', inline: 'nearest' });
            if ('scrollBehavior' in document.documentElement.style) {
              event.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {      
              var scrollY = window.scrollY + event.target.getBoundingClientRect().top;
              window.scrollTo({ top: scrollY, behavior: 'smooth' });
            }
            arrowElement.classList.toggle('fa-angle-right', !isVisible);
            arrowElement.classList.toggle('fa-angle-down', isVisible);
          }, 100)
        }

        // If the child is hidden, add visibility-none class to it
        if (!isVisible) {
            child.classList.add('visibility-none');
        } else {
            // If the child is visible, remove visibility-none class
            child.classList.remove('visibility-none');
        }
      }
      
      if (!child) {
        // Create a new <ul> element with the class "visible"
        const ulVisible = document.createElement('ul');
      
        // Append the new <ul> element to the parent of the event target
        event.target.parentNode.appendChild(ulVisible);
      
        // Log the updated value of child after appending the <ul> element
        child = event.target.nextElementSibling;
      }
    });
  
    // Dispatch the simulated click event
    targetElement.dispatchEvent(clickEvent);
  }

  if(targetElement3) {
    targetElement3.addEventListener('click', function (event) {
      // var toctreeL1 = event.target.closest('.toctree-l1');  
      var toctree = event.target.closest('.toctree-l1, .toctree-l2, .toctree-l3');

      var arrowElement = toctree.querySelector('.arrow');
      var child = event.target.nextElementSibling;
      child.classList.add("current")
      // event.target.style.color = '#1A306E'; // Change color to '#1A306E' when clicked

      var toctreeL2Elements = document.querySelectorAll('.toctree-l2'); 

      toctreeL2Elements.forEach(function(toctreeL2) {
        toctreeL2.addEventListener('click', function(event) {
          // Inside the event listener, remove the "addBold" class from all 'toctree-l2' elements
          toctreeL2Elements.forEach(function(element) {
            element.classList.remove("addBold");
          });

          // Add the "addBold" class to the clicked 'toctree-l2' element
          var grandChild = event.target;

          grandChild.classList.add("bold");
        });

        toctreeL2.dispatchEvent(clickEvent2)
      });

      if (toctree && child) {
        // Toggle visibility of the child element
        child.classList.toggle('visible');

        // Check if the child element is now visible
        var isVisible = child.classList.contains('visible');
        
        if(event.target.baseURI.includes('#')){
          setTimeout(function(){
            // event.target.nextElementSibling.scrollIntoView({ behavior: 'smooth', inline: 'nearest', scrollMode: 'if-needed', block: 'end', inline: 'nearest' });
            // console.log(event.target.nextElementSibling, "clicked")
            if ('scrollBehavior' in document.documentElement.style) {
              event.target.nextElementSibling.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
              var scrollY = window.scrollY + event.target.nextElementSibling.getBoundingClientRect().top;
              window.scrollTo({ top: scrollY, behavior: 'smooth' });
            }
            arrowElement.classList.toggle('fa-angle-right', !isVisible);
            arrowElement.classList.toggle('fa-angle-down', isVisible);
          }, 100)
        } 
        else {
          setTimeout(function(){
            // event.target.scrollIntoView({ behavior: 'smooth', inline: 'nearest', scrollMode: 'if-needed', block: 'center', inline: 'nearest' });
            if ('scrollBehavior' in document.documentElement.style) {
              event.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {      
              var scrollY = window.scrollY + event.target.getBoundingClientRect().top;
              window.scrollTo({ top: scrollY, behavior: 'smooth' });
            }
            arrowElement.classList.toggle('fa-angle-right', !isVisible);
            arrowElement.classList.toggle('fa-angle-down', isVisible);
          }, 100)
        }

        // If the child is hidden, add visibility-none class to it
        if (!isVisible) {
            child.classList.add('visibility-none');
        } else {
            // If the child is visible, remove visibility-none class
            child.classList.remove('visibility-none');
        }
      }
      
      if (!child) {
        // Create a new <ul> element with the class "visible"
        const ulVisible = document.createElement('ul');
      
        // Append the new <ul> element to the parent of the event target
        event.target.parentNode.appendChild(ulVisible);
      
        // Log the updated value of child after appending the <ul> element
        child = event.target.nextElementSibling;
      }
    });
  
    // Dispatch the simulated click event
    targetElement3.dispatchEvent(clickEvent);
  }

  if(targetElement4) {
    targetElement4.addEventListener('click', function (event) {
      // var toctreeL1 = event.target.closest('.toctree-l1');  
      var toctree = event.target.closest('.toctree-l1, .toctree-l2, .toctree-l3');

      var arrowElement = toctree.querySelector('.arrow');
      var child = event.target.nextElementSibling;
      child.classList.add("current")
      // event.target.style.color = '#1A306E'; // Change color to '#1A306E' when clicked

      var toctreeL2Elements = document.querySelectorAll('.toctree-l2'); 

      toctreeL2Elements.forEach(function(toctreeL2) {
        toctreeL2.addEventListener('click', function(event) {
          // Inside the event listener, remove the "addBold" class from all 'toctree-l2' elements
          toctreeL2Elements.forEach(function(element) {
            element.classList.remove("addBold");
          });

          // Add the "addBold" class to the clicked 'toctree-l2' element
          var grandChild = event.target;

          grandChild.classList.add("bold");
        });

        toctreeL2.dispatchEvent(clickEvent2)
      });

      if (toctree && child) {
        // Toggle visibility of the child element
        child.classList.toggle('visible');

        // Check if the child element is now visible
        var isVisible = child.classList.contains('visible');
        
        if(event.target.baseURI.includes('#')){
          setTimeout(function(){
            // event.target.nextElementSibling.scrollIntoView({ behavior: 'smooth', inline: 'nearest', scrollMode: 'if-needed', block: 'end', inline: 'nearest' });
            // console.log(event.target.nextElementSibling, "clicked")
            if ('scrollBehavior' in document.documentElement.style) {
              event.target.nextElementSibling.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
              var scrollY = window.scrollY + event.target.nextElementSibling.getBoundingClientRect().top;
              window.scrollTo({ top: scrollY, behavior: 'smooth' });
            }
            arrowElement.classList.toggle('fa-angle-right', !isVisible);
            arrowElement.classList.toggle('fa-angle-down', isVisible);
          }, 100)
        } 
        else {
          setTimeout(function(){
            // event.target.scrollIntoView({ behavior: 'smooth', inline: 'nearest', scrollMode: 'if-needed', block: 'center', inline: 'nearest' });
            if ('scrollBehavior' in document.documentElement.style) {
              event.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {      
              var scrollY = window.scrollY + event.target.getBoundingClientRect().top;
              window.scrollTo({ top: scrollY, behavior: 'smooth' });
            }
            arrowElement.classList.toggle('fa-angle-right', !isVisible);
            arrowElement.classList.toggle('fa-angle-down', isVisible);
          }, 100)
        }

        // If the child is hidden, add visibility-none class to it
        if (!isVisible) {
            child.classList.add('visibility-none');
        } else {
            // If the child is visible, remove visibility-none class
            child.classList.remove('visibility-none');
        }
      }
      
      if (!child) {
        // Create a new <ul> element with the class "visible"
        const ulVisible = document.createElement('ul');
      
        // Append the new <ul> element to the parent of the event target
        event.target.parentNode.appendChild(ulVisible);
      
        // Log the updated value of child after appending the <ul> element
        child = event.target.nextElementSibling;
      }
    });
  
    // Dispatch the simulated click event
    targetElement4.dispatchEvent(clickEvent);
  }

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
