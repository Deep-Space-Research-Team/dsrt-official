// Browser-native visual effects retained in JavaScript.
(() => {
  const canvas = document.getElementById("stars-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width = 0, height = 0, stars = [];
    const count = 150;
    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      stars = Array.from({length: count}, () => ({
        x: Math.random() * width, y: Math.random() * height,
        size: Math.random() * 1.5 + .5, opacity: Math.random(),
        fadeSpeed: Math.random() * .02 + .005
      }));
    }
    function animate() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#fff";
      for (const star of stars) {
        star.opacity += star.fadeSpeed;
        if (star.opacity > 1 || star.opacity < .2) star.fadeSpeed *= -1;
        ctx.globalAlpha = star.opacity;
        ctx.beginPath(); ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    }
    window.addEventListener("resize", resize); resize(); animate();
  }

  let observer;
  window.initializeScrollAnimations = function() {
    const elements = document.querySelectorAll(".scroll-reveal:not(.visible)");
    if (!("IntersectionObserver" in window)) {
      elements.forEach(el => el.classList.add("visible"));
      return;
    }
    if (!observer) observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, {threshold: .1, rootMargin: "0px 0px -50px 0px"});
    elements.forEach(el => observer.observe(el));
  };
  document.addEventListener("DOMContentLoaded", window.initializeScrollAnimations);


  // Smooth same-site page changes with a short, low-cost fade.
  // External links, downloads, new tabs, modifier-clicks and in-page anchors
  // keep their normal browser behaviour.
  (() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const lowCoreCount = Number.isFinite(navigator.hardwareConcurrency) &&
                         navigator.hardwareConcurrency > 0 &&
                         navigator.hardwareConcurrency <= 2;
    const lowDataMode = Boolean(connection && (
      connection.saveData ||
      /(^|-)2g$/.test(connection.effectiveType || "")
    ));
    const lowPower = lowCoreCount || lowDataMode;

    if (lowPower) {
      document.documentElement.classList.add("dsrt-low-power");
    }

    if (motionPreference.matches) return;

    let navigationStarted = false;

    document.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.button !== 0 ||
          event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target instanceof Element
        ? event.target
        : event.target && event.target.parentElement;

      const link = target && target.closest("a[href]");
      if (!link || link.hasAttribute("download") ||
          link.dataset.noTransition === "true") {
        return;
      }

      const targetName = (link.getAttribute("target") || "").toLowerCase();
      if (targetName && targetName !== "_self") return;

      let destination;
      try {
        destination = new URL(link.href, window.location.href);
      } catch (_) {
        return;
      }

      if (destination.origin !== window.location.origin) return;

      // Do not animate same-page hash jumps or a link to the current URL.
      if (destination.pathname === window.location.pathname &&
          destination.search === window.location.search) {
        return;
      }

      if (navigationStarted) {
        event.preventDefault();
        return;
      }

      navigationStarted = true;
      event.preventDefault();
      document.body.classList.add("dsrt-page-leaving");

      // A shorter fade is used for constrained devices and slow connections.
      const delay = lowPower ? 90 : 130;
      window.setTimeout(() => {
        window.location.assign(destination.href);
      }, delay);
    });

    // If this page is restored from the back-forward cache, make it visible.
    window.addEventListener("pageshow", () => {
      document.body.classList.remove("dsrt-page-leaving");
      navigationStarted = false;
    });
  })();

})();
