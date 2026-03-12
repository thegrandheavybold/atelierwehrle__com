import "../sass/style.sass";

const screenshotMode = new URLSearchParams(window.location.search).has("screenshot");

if ("serviceWorker" in navigator && !screenshotMode) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Keep the page resilient even if SW registration fails.
    });
  });
}

function decodeNetlifyTransformToOriginal(urlValue) {
  if (!urlValue || !urlValue.includes("/.netlify/images")) {
    return urlValue;
  }

  try {
    const parsed = new URL(urlValue, window.location.origin);
    const source = parsed.searchParams.get("url");
    return source ? decodeURIComponent(source) : urlValue;
  } catch {
    return urlValue;
  }
}

function normalizeImagesForScreenshots() {
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    const rawSrc = img.getAttribute("src");
    const rawSrcset = img.getAttribute("srcset");

    const normalizedSrc = decodeNetlifyTransformToOriginal(rawSrc);
    if (normalizedSrc && normalizedSrc !== rawSrc) {
      img.setAttribute("src", normalizedSrc);
    }

    if (rawSrcset && rawSrcset.includes("/.netlify/images")) {
      const rewritten = rawSrcset
        .split(",")
        .map((entry) => {
          const trimmed = entry.trim();
          if (!trimmed) return trimmed;
          const [urlPart, descriptor] = trimmed.split(/\s+/, 2);
          const normalized = decodeNetlifyTransformToOriginal(urlPart);
          return descriptor ? `${normalized} ${descriptor}` : normalized;
        })
        .join(", ");
      img.setAttribute("srcset", rewritten);
    }

    img.loading = "eager";
    img.decoding = "sync";
  });
}

const html = document.querySelector("html");
if (html) {
  html.classList.remove("no-js");
  html.classList.add("js");
  html.classList.toggle("touch", "ontouchstart" in window);
  html.classList.toggle("screenshot-mode", screenshotMode);
}

if (screenshotMode) {
  normalizeImagesForScreenshots();
}

const parallaxTarget = document.querySelector(".parallax");
if (parallaxTarget && !screenshotMode) {
  let parallaxTicking = false;
  const updateParallax = () => {
    const rate = window.pageYOffset * 0.35;
    parallaxTarget.style.transform = `translate3D(0px, ${rate}px, 0px)`;
    parallaxTicking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (parallaxTicking) return;
      parallaxTicking = true;
      window.requestAnimationFrame(updateParallax);
    },
    { passive: true }
  );
}

const headerTarget = document.querySelector("header");
if (headerTarget && !screenshotMode) {
  const stickyOffset = headerTarget.offsetTop + 100;
  let stickyTicking = false;
  const updateStickyState = () => {
    headerTarget.classList.toggle("sticky", window.pageYOffset > stickyOffset);
    stickyTicking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (stickyTicking) return;
      stickyTicking = true;
      window.requestAnimationFrame(updateStickyState);
    },
    { passive: true }
  );
}

const mainElement = document.querySelector("main");
const footerElement = document.querySelector("footer");
const toggleButton = document.getElementById("menubutton");

if (toggleButton && mainElement && footerElement) {
  toggleButton.addEventListener("click", () => {
    const isOpen = mainElement.classList.contains("mm__isopen");
    mainElement.classList.toggle("mm__isopen", !isOpen);
    footerElement.classList.toggle("mm__isopen", !isOpen);
  });
}

document.querySelectorAll("ul.teasers.grd__gllry li").forEach((li) => {
  if (!li.classList.contains("video")) {
    li.querySelectorAll("article a figure video").forEach((video) => {
      video.controls = false;
    });
  }
});

function initVideoHover() {
  document.querySelectorAll("ul.teasers.grd__gllry li").forEach((li) => {
    const video = li.querySelector("article a figure div.vdo_fx video");

    if (video) {
      video.controls = false;
      li.addEventListener("mouseenter", () => video.play());
      li.addEventListener("mouseleave", () => video.pause());
      return;
    }

    const figure = li.querySelector("article a figure");
    if (figure) {
      figure.remove();
    }
  });

  const player = document.getElementById("player");
  if (player) {
    player.controls = false;
  }
}

function scheduleIdle(callback, timeout = 1500) {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(callback, { timeout });
    return;
  }
  window.setTimeout(callback, 1);
}

function loadOptionalModules() {
  if (document.querySelector(".menu-button-links")) {
    import("./navigation.js");
  }

  const swiperTarget = document.querySelector(".swiper, .hro__sldr");
  if (swiperTarget) {
    let swiperRequested = false;
    const requestSwiperModule = () => {
      if (swiperRequested) return;
      swiperRequested = true;
      import("./swiper-sliders.js");
    };

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          observer.disconnect();
          requestSwiperModule();
        },
        { rootMargin: "300px 0px" }
      );
      observer.observe(swiperTarget);
    } else {
      requestSwiperModule();
    }
  }

  if (!screenshotMode && document.querySelector(".oov, .lx")) {
    window.addEventListener(
      "load",
      () => {
        scheduleIdle(() => {
          import("./gsap-triggers.js");
        }, 2000);
      },
      { once: true }
    );
  }
}

function init() {
  initVideoHover();
  loadOptionalModules();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
