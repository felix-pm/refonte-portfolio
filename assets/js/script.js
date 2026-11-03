document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const navLinks = document.querySelectorAll(".nav__link");

  // En-tête plus opaque dès qu'on défile
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Lien de navigation actif selon la section affichée
  const sections = document.querySelectorAll("main section[id]");
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const activeLink = document.querySelector(`.nav__link[href="#${entry.target.id}"]`);
        if (!activeLink) return;
        navLinks.forEach((link) => {
          link.classList.remove("active");
          link.removeAttribute("aria-current");
        });
        activeLink.classList.add("active");
        activeLink.setAttribute("aria-current", "true");
      });
    },
    { root: null, rootMargin: "-45% 0px -50% 0px", threshold: 0 },
  );
  sections.forEach((section) => sectionObserver.observe(section));

  // Apparition des blocs au défilement
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      let index = 0;
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = Math.min(index++ * 70, 350);
        el.style.transitionDelay = `${delay}ms`;
        el.classList.add("is-visible");
        observer.unobserve(el);
        // Une fois l'animation finie, on rend la main aux transitions de survol
        setTimeout(() => {
          el.classList.remove("reveal", "is-visible");
          el.style.transitionDelay = "";
        }, 800 + delay);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  // Copier l'adresse e-mail
  const copyButton = document.querySelector("[data-copy]");
  if (copyButton) {
    const label = copyButton.querySelector(".contact__copy-label");
    const icon = copyButton.querySelector("i");
    let resetTimer;

    copyButton.addEventListener("click", async () => {
      const text = copyButton.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const field = document.createElement("textarea");
        field.value = text;
        field.setAttribute("readonly", "");
        field.style.position = "absolute";
        field.style.left = "-9999px";
        document.body.appendChild(field);
        field.select();
        document.execCommand("copy");
        field.remove();
      }

      copyButton.classList.add("is-copied");
      icon.className = "fa-solid fa-check";
      label.textContent = "Copié !";

      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        copyButton.classList.remove("is-copied");
        icon.className = "fa-regular fa-copy";
        label.textContent = "Copier";
      }, 2000);
    });
  }
});
