document.addEventListener("DOMContentLoaded", () => {
  const hasConfig = typeof CONFIG !== "undefined";

  /* ---------- Menu mobile ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }

  /* ---------- Lien actif dans le menu ---------- */
  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((a) => {
    if (a.getAttribute("href") === page) a.classList.add("active");
  });

  /* ---------- Liens de contact (depuis config.js) ---------- */
  if (hasConfig) {
    const msg = encodeURIComponent("Bonjour THE MASTER, j'aimerais avoir plus d'informations.");
    document.querySelectorAll("[data-wa]").forEach((el) => {
      el.href = `https://wa.me/${CONFIG.whatsapp}?text=${msg}`;
      el.target = "_blank";
      el.rel = "noopener";
    });
    document.querySelectorAll("[data-mail]").forEach((el) => {
      el.href = `mailto:${CONFIG.email}`;
    });
    document.querySelectorAll("[data-tel]").forEach((el) => {
      el.href = `tel:${CONFIG.telephone.replace(/\s/g, "")}`;
    });
    document.querySelectorAll("[data-mail-text]").forEach((el) => (el.textContent = CONFIG.email));
    document.querySelectorAll("[data-tel-text]").forEach((el) => (el.textContent = CONFIG.telephone));
  }

  /* ---------- Boutons dépliants (ex : présentation Forever) ---------- */
  document.querySelectorAll("[data-toggle]").forEach((btn) => {
    const target = document.getElementById(btn.dataset.toggle);
    if (!target) return;
    btn.addEventListener("click", () => {
      const open = target.classList.toggle("open");
      btn.textContent = open ? btn.dataset.closeText : btn.dataset.openText;
      if (open) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* ---------- Images manquantes : affiche un cadre de remplacement ---------- */
  document.querySelectorAll(".trainer-photo img").forEach((img) => {
    const fallback = () => {
      const box = img.parentElement;
      box.classList.add("placeholder");
      box.textContent = "Photo à ajouter : " + img.getAttribute("src");
    };
    if (img.complete && img.naturalWidth === 0) fallback();
    img.addEventListener("error", fallback);
  });

  /* ---------- Animation d'apparition au scroll ---------- */
  const items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    items.forEach((el) => obs.observe(el));
  } else {
    items.forEach((el) => el.classList.add("visible"));
  }
  /* ---------- Prix des packs (depuis config.js) ---------- */
  if (hasConfig) {
    document.querySelectorAll("[data-prix]").forEach((el) => {
      const pack = CONFIG.packs[el.dataset.prix];
      if (pack) el.textContent = formatPrix(pack.prix);
    });
  }
  /* ---------- Année du pied de page ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
});