const views = [...document.querySelectorAll("[data-view]")];
const particleBackground = document.querySelector(".particle-background");

if (particleBackground) {
  const colors = ["#ffd1df", "#f7a8c4", "#ee7fa5", "#e85e8d", "#d94778"];
  const particles = document.createDocumentFragment();

  for (let index = 0; index < 28; index += 1) {
    const particle = document.createElement("span");
    const kind = Math.random() < 0.5 ? "heart" : "square";
    particle.className = `particle particle--${kind}`;
    particle.setAttribute("aria-hidden", "true");
    particle.style.setProperty("--particle-left", `${Math.random() * 100}%`);
    particle.style.setProperty("--particle-size", `${8 + Math.random() * 13}px`);
    particle.style.setProperty("--particle-color", colors[Math.floor(Math.random() * colors.length)]);
    particle.style.setProperty("--particle-duration", `${9 + Math.random() * 10}s`);
    particle.style.setProperty("--particle-delay", `${-Math.random() * 19}s`);
    particle.style.setProperty("--particle-drift", `${Math.random() * 140 - 70}px`);
    particle.style.setProperty("--particle-static-top", `${Math.random() * 100}vh`);
    particles.append(particle);
  }

  particleBackground.append(particles);
}

function showView(name) {
  for (const view of views) {
    view.hidden = view.dataset.view !== name;
  }
}

const originalPositions = new WeakMap();

function dodgeButton(button) {
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
        if (window.matchMedia("(hover: none), (pointer: coarse)").matches) {
          dodgeButton(button);
          break;
        }
        showView("invitation");
        break;
    }
  });
});

if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  document.querySelectorAll(".hero-button--maybe").forEach((button) => {
    button.addEventListener("pointerenter", () => dodgeButton(button));
  });
}

document.querySelector(".answer-form")?.addEventListener("submit", (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  const answer = new FormData(form).get("favoriteThing").trim();
  const message = form.querySelector(".form-message");
  const recipient = document.querySelector(".invitation-page").dataset.recipientEmail.trim();

  if (!answer) {
    message.textContent = "Please write an answer before sending.";
    return;
  }

  if (!recipient) {
    message.textContent = "The email recipient hasn't been set up yet.";
    return;
  }

  const subject = "My answer for you";
  const body = `Hi Younes,\n\nHere's what I like most about you:\n\n${answer}\n\nLove,`;
  const emailLink = document.querySelector("[data-email-link]");
  emailLink.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  showView("thanks");
  window.location.href = emailLink.href;
});

showView("invitation");
