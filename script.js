const views = [...document.querySelectorAll("[data-view]")];

function showView(name) {
  for (const view of views) {
    view.hidden = view.dataset.view !== name;
  }
}

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    switch (button.dataset.action) {
      case "yes":
        showView("confirmation");
        break;
      case "confirm":
        showView("question");
        break;
      case "no":
        showView("invitation");
        break;
    }
  });
});

if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  const originalPositions = new WeakMap();

  document.querySelectorAll(".hero-button--maybe").forEach((button) => {
    button.addEventListener("pointerenter", () => {
      const container = button.closest(".hero");
      if (!container) {
        return;
      }

      let originalPosition = originalPositions.get(button);
      if (!originalPosition) {
        const bounds = button.getBoundingClientRect();
        originalPosition = { left: bounds.left, top: bounds.top };
        originalPositions.set(button, originalPosition);
      }

      const containerBounds = container.getBoundingClientRect();
      const bounds = button.getBoundingClientRect();
      const minX = Math.max(-150, containerBounds.left + 12 - originalPosition.left);
      const maxX = Math.min(150, containerBounds.right - 12 - originalPosition.left - bounds.width);
      const minY = Math.max(-150, containerBounds.top + 12 - originalPosition.top);
      const maxY = Math.min(150, containerBounds.bottom - 12 - originalPosition.top - bounds.height);
      const randomOffset = (min, max) => min + Math.random() * Math.max(0, max - min);

      button.style.setProperty("--dodge-x", `${randomOffset(minX, maxX)}px`);
      button.style.setProperty("--dodge-y", `${randomOffset(minY, maxY)}px`);
    });
  });
}

document.querySelector(".answer-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  showView("thanks");
});

showView("invitation");
