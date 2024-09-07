//JS Support check and touch screen check
var html = document.querySelector("html");
  html.classList.remove("no-js");
  html.classList.add("js");

function is_touch_device() {
  return !!('ontouchstart' in window);
}

  if(is_touch_device()) {
    html.classList.add("touch");
  }
  else {
    html.classList.remove("touch");
  }

//Scroll & Parallax Function
window.addEventListener('scroll', function() {

  const target = document.querySelector('.parallax');

  var scrolled = window.pageYOffset;
  var rate = scrolled * .35;

    if (target){
      target.style.transform = 'translate3D(0px, '+rate+'px, 0px)';
    }

});

//Shrinking Header on Scroll
window.addEventListener('scroll', function(){

  const target = document.querySelector('header');
    var sticky = target.offsetTop + 100;

    if (window.pageYOffset > sticky) {
      target.classList.add('sticky');
    } else {
       target.classList.remove('sticky');
    }

});

// Get the main and footer elements by their ids
const mainElement = document.querySelector('main');
const footerElement = document.querySelector('footer');

 // Get the button element by its id
  const toggleButton = document.getElementById('menubutton');

  // Toggle the 'mm__isopen' class on the main and footer elements when the button is clicked
  toggleButton.addEventListener('click', function() {
      if (mainElement.classList.contains('mm__isopen')) {
          // If main is hidden, show it along with the footer
          mainElement.classList.remove('mm__isopen');
          footerElement.classList.remove('mm__isopen');
      } else {
          // If main is visible, mm__isopen it along with the footer
          mainElement.classList.add('mm__isopen');
          footerElement.classList.add('mm__isopen');
      }
  });
  

//Import Navigation
import 'navigation.js'

//gsap magic
import 'gsap-triggers.js'

//Import Swiper Sliders
import 'swiper-sliders.js'