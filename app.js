const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const hero = document.querySelector(".hero");
const cards = document.querySelectorAll(".memory-card");
const progressItems = [...document.querySelectorAll(".hero__progress i")];
const revealItems = document.querySelectorAll(".reveal");

if (hero && !reduceMotion.matches) {
  hero.addEventListener("pointermove", (event) => {
    const bounds = hero.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;

    hero.style.setProperty("--glow-x", `${Math.max(8, Math.min(58, x))}%`);
    hero.style.setProperty("--glow-y", `${Math.max(12, Math.min(88, y))}%`);
  });

  for (const card of cards) {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;

      card.style.setProperty("--card-rx", `${(0.5 - y) * 2.4}deg`);
      card.style.setProperty("--card-ry", `${(x - 0.5) * 2.4}deg`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.removeProperty("--card-rx");
      card.style.removeProperty("--card-ry");
    });
  }

  if (progressItems.length > 1) {
    let activeProgress = 0;

    window.setInterval(() => {
      progressItems[activeProgress].classList.remove("is-active");
      activeProgress = (activeProgress + 1) % progressItems.length;
      progressItems[activeProgress].classList.add("is-active");
    }, 3200);
  }
}

if ("IntersectionObserver" in window && !reduceMotion.matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.08 }
  );

  for (const item of revealItems) observer.observe(item);
} else {
  for (const item of revealItems) item.classList.add("is-visible");
}

