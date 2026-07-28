const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const mobileLayout = window.matchMedia("(max-width: 760px)");
const hero = document.querySelector(".hero");
const cards = document.querySelectorAll(".memory-card");
const progressItems = [...document.querySelectorAll(".hero__progress i")];
const revealItems = document.querySelectorAll(".reveal");
const mobileDock = document.querySelector(".mobile-dock");

function addFrameLimitedPointerEffect(element, update) {
  let frame = 0;
  let latestEvent;

  element.addEventListener(
    "pointermove",
    (event) => {
      latestEvent = event;
      if (frame) return;

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        update(latestEvent);
      });
    },
    { passive: true }
  );
}

if (!reduceMotion.matches && finePointer.matches) {
  if (hero) {
    addFrameLimitedPointerEffect(hero, (event) => {
      const bounds = hero.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * 100;
      const y = ((event.clientY - bounds.top) / bounds.height) * 100;

      hero.style.setProperty("--glow-x", `${Math.max(8, Math.min(58, x))}%`);
      hero.style.setProperty("--glow-y", `${Math.max(12, Math.min(88, y))}%`);
    });
  }

  for (const card of cards) {
    addFrameLimitedPointerEffect(card, (event) => {
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
}

if (!reduceMotion.matches && !mobileLayout.matches && progressItems.length > 1) {
  let activeProgress = 0;

  window.setInterval(() => {
    if (document.hidden) return;
    progressItems[activeProgress].classList.remove("is-active");
    activeProgress = (activeProgress + 1) % progressItems.length;
    progressItems[activeProgress].classList.add("is-active");
  }, 3600);
}

if (
  "IntersectionObserver" in window &&
  !reduceMotion.matches &&
  !mobileLayout.matches
) {
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

if (mobileDock && mobileLayout.matches) {
  let scrollFrame = 0;

  window.addEventListener(
    "scroll",
    () => {
      if (scrollFrame) return;

      scrollFrame = window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        if (currentScrollY < 120) {
          mobileDock.classList.remove("is-hidden");
        } else {
          mobileDock.classList.add("is-hidden");
        }
        scrollFrame = 0;
      });
    },
    { passive: true }
  );
}

