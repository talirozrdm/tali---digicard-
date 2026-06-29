const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const siteHeader = document.querySelector(".site-header");
const tips = document.querySelectorAll(".tip");
const modalButtons = document.querySelectorAll("[data-modal]");
const closeButtons = document.querySelectorAll(".dialog-close");
const navLinks = document.querySelectorAll(".main-nav a[href^='#']");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const updateHeaderState = () => {
  if (!siteHeader) return;
  siteHeader.classList.toggle("is-scrolled", window.scrollY > 8);
};

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      mainNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const revealItems = [
  ...document.querySelectorAll(".hero-logo, .hero-title, .hero-line, .hero-text, .hero-clarity, .hero .button, .hero-media, .expertise-strip, section, .site-footer"),
];

document.querySelectorAll(".card, .process-list article, .contact-actions .button").forEach((item, index) => {
  item.classList.add("reveal", "stagger-item");
  item.style.setProperty("--stagger-delay", `${Math.min(index % 6, 5) * 90}ms`);
});

revealItems.forEach((item, index) => {
  item.classList.add("reveal");
  if (index < 8) item.style.setProperty("--stagger-delay", `${index * 80}ms`);
});

if (prefersReducedMotion) {
  document.querySelectorAll(".reveal").forEach((item) => item.classList.add("reveal-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
  );

  document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));
}

if (navLinks.length) {
  const sectionMap = new Map();

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    const target = href === "#home" ? document.querySelector(".hero") : document.querySelector(href);
    if (target) sectionMap.set(target, link);
  });

  if (sectionMap.size) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => link.classList.remove("is-active"));
            sectionMap.get(entry.target)?.classList.add("is-active");
          }
        });
      },
      { threshold: 0.36, rootMargin: "-28% 0px -50% 0px" },
    );

    sectionMap.forEach((link, section) => navObserver.observe(section));
  }
}

tips.forEach((tip) => {
  tip.addEventListener("click", () => {
    tips.forEach((item) => {
      if (item !== tip) item.classList.remove("is-active");
    });
    tip.classList.toggle("is-active");
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".tip")) {
    tips.forEach((tip) => tip.classList.remove("is-active"));
  }
});

modalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const dialog = document.getElementById(button.dataset.modal);
    if (dialog && typeof dialog.showModal === "function") {
      dialog.showModal();
    }
  });
});

closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const dialog = button.closest("dialog");
    if (dialog) dialog.close();
  });
});
