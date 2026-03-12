import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  const oov = gsap.utils.toArray(".oov");
  oov.forEach((element) => {
    // Use fromTo + immediateRender:false so content does not stay hidden if trigger fails.
    gsap.fromTo(
      element,
      { y: 80, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.8,
        ease: "power2.out",
        immediateRender: false,
        scrollTrigger: {
          trigger: element,
          start: "top 92%",
          once: true,
        },
      }
    );
  });

  const lax = gsap.utils.toArray(".lx");
  lax.forEach((element) => {
    const speed = Number.parseFloat(element.dataset.speed || "0");
    if (!Number.isFinite(speed) || speed === 0) {
      return;
    }

    gsap.to(element, {
      y: () => -ScrollTrigger.maxScroll(window) * speed,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });
}
