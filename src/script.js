const menuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");

menuButton.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");

  const isOpen = !mobileMenu.classList.contains("hidden");

  menuButton.setAttribute("aria-expanded", isOpen);
});
const mobileLinks = mobileMenu.querySelectorAll("a");

mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

const grabAndGoVideo = document.getElementById("grab-and-go-video");

if (grabAndGoVideo) {
  const source = grabAndGoVideo.querySelector("source[data-src]");

  const loadVideo = () => {
    source.src = source.dataset.src;
    grabAndGoVideo.load();
    grabAndGoVideo.play().catch(() => {});
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadVideo();
        observer.disconnect();
      }
    });

    observer.observe(grabAndGoVideo);
  } else {
    loadVideo();
  }
}
