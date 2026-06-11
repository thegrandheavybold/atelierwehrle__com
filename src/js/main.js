import "../sass/style.sass";

const screenshotMode = new URLSearchParams(window.location.search).has("screenshot");
const localHostnames = new Set(["localhost", "127.0.0.1", "::1"]);
const localRuntime = localHostnames.has(window.location.hostname);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => registration.unregister());
  }).catch(() => {
    // Ignore SW cleanup failures.
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
  const rewriteSrcsetAttribute = (element, attrName) => {
    const rawValue = element.getAttribute(attrName);
    if (!rawValue || !rawValue.includes("/.netlify/images")) return;

    const rewritten = rawValue
      .split(",")
      .map((entry) => {
        const trimmed = entry.trim();
        if (!trimmed) return trimmed;
        const [urlPart, descriptor] = trimmed.split(/\s+/, 2);
        const normalized = decodeNetlifyTransformToOriginal(urlPart);
        return descriptor ? `${normalized} ${descriptor}` : normalized;
      })
      .join(", ");

    element.setAttribute(attrName, rewritten);
  };

  document.querySelectorAll("source").forEach((source) => {
    rewriteSrcsetAttribute(source, "srcset");
  });

  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    const rawSrc = img.getAttribute("src");

    const normalizedSrc = decodeNetlifyTransformToOriginal(rawSrc);
    if (normalizedSrc && normalizedSrc !== rawSrc) {
      img.setAttribute("src", normalizedSrc);
    }

    rewriteSrcsetAttribute(img, "srcset");

    img.loading = "eager";
    img.decoding = "sync";

    img.addEventListener("error", () => {
      const fallbackSrc = decodeNetlifyTransformToOriginal(img.currentSrc || img.src);
      if (!fallbackSrc || fallbackSrc === img.getAttribute("src")) return;
      img.setAttribute("src", fallbackSrc);
      img.removeAttribute("srcset");
      const pictureSources = img.closest("picture")?.querySelectorAll("source");
      pictureSources?.forEach((source) => source.removeAttribute("srcset"));
    }, { once: true });
  });

  document.querySelectorAll('link[rel="preload"][href*="/.netlify/images"]').forEach((link) => {
    const rawHref = link.getAttribute("href");
    const normalizedHref = decodeNetlifyTransformToOriginal(rawHref);
    if (normalizedHref && normalizedHref !== rawHref) {
      link.setAttribute("href", normalizedHref);
    }
    rewriteSrcsetAttribute(link, "imagesrcset");
  });
}

const html = document.querySelector("html");
if (html) {
  html.classList.remove("no-js");
  html.classList.add("js");
  html.classList.toggle("touch", "ontouchstart" in window);
  html.classList.toggle("screenshot-mode", screenshotMode);
}

if (screenshotMode || localRuntime) {
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
