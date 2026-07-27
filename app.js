const hero = document.querySelector(".hero");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (hero && !reduceMotion.matches) {
  hero.addEventListener("pointermove", (event) => {
    const bounds = hero.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;

    hero.style.setProperty("--glow-x", `${Math.max(8, Math.min(58, x))}%`);
    hero.style.setProperty("--glow-y", `${Math.max(12, Math.min(88, y))}%`);
  });
}
