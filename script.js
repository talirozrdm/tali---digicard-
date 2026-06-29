const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const tips = document.querySelectorAll(".tip");
const modalButtons = document.querySelectorAll("[data-modal]");
const closeButtons = document.querySelectorAll(".dialog-close");

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
