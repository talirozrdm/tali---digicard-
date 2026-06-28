(function () {
  const items = Array.from(document.querySelectorAll(".expertise-item"));
  const tooltip = document.getElementById("expertiseTooltip");

  if (!items.length || !tooltip) {
    return;
  }

  let activeItem = null;
  let pinnedItem = null;

  function resetItems() {
    items.forEach((item) => item.setAttribute("aria-expanded", "false"));
  }

  function placeTooltip(item) {
    const itemRect = item.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const margin = 12;
    const top = itemRect.bottom + 12;
    let left = itemRect.left + itemRect.width / 2 - tooltipRect.width / 2;

    left = Math.max(margin, Math.min(left, window.innerWidth - tooltipRect.width - margin));

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  }

  function showTooltip(item) {
    const text = item.getAttribute("data-tooltip");
    if (!text) return;

    activeItem = item;
    tooltip.textContent = text;
    tooltip.hidden = false;
    resetItems();
    item.setAttribute("aria-expanded", "true");

    requestAnimationFrame(() => {
      placeTooltip(item);
      tooltip.classList.add("is-visible");
    });
  }

  function hideTooltip() {
    activeItem = null;
    pinnedItem = null;
    tooltip.classList.remove("is-visible");
    resetItems();

    window.setTimeout(() => {
      if (!activeItem) {
        tooltip.hidden = true;
      }
    }, 140);
  }

  items.forEach((item) => {
    item.addEventListener("mouseenter", () => showTooltip(item));
    item.addEventListener("focus", () => showTooltip(item));
    item.addEventListener("mouseleave", () => {
      if (pinnedItem !== item) hideTooltip();
    });
    item.addEventListener("blur", () => {
      if (pinnedItem !== item) hideTooltip();
    });

    item.addEventListener("click", (event) => {
      event.stopPropagation();
      if (pinnedItem === item && !tooltip.hidden) {
        hideTooltip();
        return;
      }
      pinnedItem = item;
      showTooltip(item);
    });
  });

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof HTMLElement)) return;
    if (!event.target.closest(".expertise-strip")) {
      hideTooltip();
    }
  });

  window.addEventListener("resize", () => {
    if (activeItem && !tooltip.hidden) {
      placeTooltip(activeItem);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && activeItem) {
      const itemToFocus = activeItem;
      hideTooltip();
      itemToFocus.focus();
    }
  });
})();

(function () {
  const STORAGE_KEY = "tali_accessibility_preferences_v1";
  const defaults = {
    fontScale: 1,
    highContrast: false,
    grayscale: false,
    highlightLinks: false,
    reduceMotion: false,
  };

  const root = document.documentElement;
  const body = document.body;
  const toggleButton = document.getElementById("a11yToggle");
  const panel = document.getElementById("a11yPanel");
  const closeButton = document.getElementById("a11yClose");

  if (!toggleButton || !panel || !closeButton) {
    return;
  }

  let isOpen = false;
  let state = { ...defaults };

  function clampScale(value) {
    return Math.min(1.35, Math.max(0.85, value));
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_err) {
      // Ignore storage issues gracefully.
    }
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      state = {
        ...defaults,
        ...parsed,
        fontScale: clampScale(Number(parsed.fontScale) || 1),
      };
    } catch (_err) {
      state = { ...defaults };
    }
  }

  function applyState() {
    root.style.setProperty("--user-font-scale", String(state.fontScale));
    body.classList.toggle("a11y-high-contrast", state.highContrast);
    body.classList.toggle("a11y-grayscale", state.grayscale);
    body.classList.toggle("a11y-links-highlight", state.highlightLinks);
    body.classList.toggle("a11y-reduce-motion", state.reduceMotion);
  }

  function setPanel(open) {
    isOpen = open;
    panel.hidden = !open;
    panel.setAttribute("aria-hidden", String(!open));
    toggleButton.setAttribute("aria-expanded", String(open));

    if (open) {
      const firstAction = panel.querySelector("button[data-action]");
      if (firstAction) firstAction.focus();
    }
  }

  function resetAll() {
    state = { ...defaults };
    applyState();
    saveState();
  }

  function handleAction(action) {
    switch (action) {
      case "increase-text":
        state.fontScale = clampScale(state.fontScale + 0.08);
        break;
      case "decrease-text":
        state.fontScale = clampScale(state.fontScale - 0.08);
        break;
      case "reset-text":
        state.fontScale = defaults.fontScale;
        break;
      case "toggle-contrast":
        state.highContrast = !state.highContrast;
        break;
      case "toggle-grayscale":
        state.grayscale = !state.grayscale;
        break;
      case "toggle-links":
        state.highlightLinks = !state.highlightLinks;
        break;
      case "toggle-motion":
        state.reduceMotion = !state.reduceMotion;
        break;
      case "reset-all":
        resetAll();
        return;
      default:
        return;
    }

    applyState();
    saveState();
  }

  toggleButton.addEventListener("click", function () {
    setPanel(!isOpen);
  });

  closeButton.addEventListener("click", function () {
    setPanel(false);
    toggleButton.focus();
  });

  panel.addEventListener("click", function (event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (!target.matches("button[data-action]")) return;
    handleAction(target.getAttribute("data-action"));
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isOpen) {
      setPanel(false);
      toggleButton.focus();
    }
  });

  loadState();
  applyState();
  setPanel(false);
})();
