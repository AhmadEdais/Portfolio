const header = document.querySelector(".site-header");
const menuToggle = header.querySelector(".menu-toggle");

const menuIsOpen = () => menuToggle.getAttribute("aria-expanded") === "true";

function closeMenu(returnFocus = false) {
  if (!menuIsOpen()) return;
  menuToggle.setAttribute("aria-expanded", "false");

  if (returnFocus) menuToggle.focus();
}

header.dataset.enhanced = "";
menuToggle.hidden = false;

menuToggle.addEventListener("click", () => {
  menuToggle.setAttribute("aria-expanded", String(!menuIsOpen()));
});

header.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu(true);
});

document.addEventListener("pointerdown", (event) => {
  if (!header.contains(event.target)) closeMenu();
});

document.addEventListener("focusin", (event) => {
  if (!header.contains(event.target)) closeMenu();
});

const mobileNavigation = window.matchMedia("(max-width: 44rem)");
mobileNavigation.addEventListener("change", () => closeMenu());

if ("IntersectionObserver" in window) {
  const reveals = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;

      // A focused section should stay immediately visible during anchor navigation.
      if (!entry.target.matches(":focus-within")) entry.target.classList.add("is-revealed");
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.08 });

  document.querySelectorAll("[data-reveal]").forEach((section) => reveals.observe(section));

  const grabPreview = document.getElementById("grab-preview");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let previewInView = false;

  function updatePreviewPlayback() {
    if (!previewInView || reducedMotion.matches || document.hidden) {
      grabPreview.pause();
      return;
    }

    if (grabPreview.ended) return;
    if (!grabPreview.hasAttribute("src")) grabPreview.src = grabPreview.dataset.src;
    grabPreview.play().catch(() => {
      // The walkthrough link remains available if the browser blocks playback.
    });
  }

  const previewVisibility = new IntersectionObserver(([entry]) => {
    previewInView = entry.intersectionRatio >= 0.15;
    updatePreviewPlayback();
  }, { threshold: 0.15 });

  previewVisibility.observe(grabPreview);
  reducedMotion.addEventListener("change", updatePreviewPlayback);
  document.addEventListener("visibilitychange", updatePreviewPlayback);
}
