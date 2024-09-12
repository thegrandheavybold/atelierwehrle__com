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
  
document.querySelectorAll('ul.teasers.grd__gllry li').forEach(function(li) {
    if (!li.classList.contains('video')) { 
        li.querySelectorAll('article a figure video').forEach(function(video) {
            video.controls = false;
        });
    }
});

//Import Navigation
import 'navigation.js'

//gsap magic
import 'gsap-triggers.js'

//Import Swiper Sliders
import 'swiper-sliders.js'


//Video Hover for Garden Teasers if has video
document.querySelectorAll('ul.teasers.grd__gllry li').forEach(function(li) {
  
        const video = li.querySelector('article a figure div.vdo_fx video');

        if (video) {
            video.controls = false;

            // Video starten, wenn die Maus über das Element fährt
            li.addEventListener('mouseenter', function() {
                video.play();
            });

            // Video pausieren, wenn die Maus das Element verlässt
            li.addEventListener('mouseleave', function() {
                video.pause();
            });
        }else {
        // Video-Element aus dem DOM entfernen, wenn es nicht vorhanden ist
        li.querySelector('article a figure').remove();
    }
    
});

document.getElementById("player").controls = false;