//gsap Magic
import  { gsap }  from 'gsap';
import  { ScrollTrigger }  from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

//gsap outofview imdb list items
const oov = gsap.utils.toArray('.oov');
oov.forEach(oov => {
  gsap.from(oov, {
  y: 150,
  opacity: 0,
    scrollTrigger: {
      markers: false,
      trigger: oov,
      scrub: 3,
      end: "bottom bottom"
    },
  })
});

// gsap quote soft parallax
const lax = gsap.utils.toArray('.lx');
lax.forEach(lx => {
  gsap.to(lx, {
  y: (i, target) => -ScrollTrigger.maxScroll(window) * target.dataset.speed,
    scrollTrigger: {
      trigger: lx,
      scrub: 5
    }
  })
});