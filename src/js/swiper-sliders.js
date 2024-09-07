//SWIPER
import Swiper from 'swiper';

// import Swiper bundle with all modules installed
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

//Hero Slider
const heroSwiper = new Swiper('.hro__sldr', {
  
  // configure Swiper to use modules
  modules: [Autoplay, EffectFade],

  // Optional parameters
  loop: true,
  preloadImages: false,
  lazy: false,
  slidesPerView: 1,
  watchSlidesProgress: true,

  effect: 'fade',
  fadeEffect: {
    crossFade: true
  },

  speed: 2000,
  autoplay: {
    delay: 6000
  },

});


