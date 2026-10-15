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

  /* ---------- Boutons dépliants (présentation Forever) ---------- */
  document.querySelectorAll("[data-toggle]").forEach((btn) => {
    const target = document.getElementById(btn.dataset.toggle);
    if (!target) return;
    btn.addEventListener("click", () => {
      const open = target.classList.toggle("open");
      btn.textContent = open ? btn.dataset.closeText : btn.dataset.openText;
      if (open) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* ---------- Images manquantes : cadre de remplacement ---------- */
  document.querySelectorAll(".trainer-photo img, .pack-image img").forEach((img) => {
    const fallback = () => {
      const box = img.parentElement;
      box.classList.add("placeholder");
      box.textContent = "Image à ajouter : " + img.getAttribute("src");
    };
    if (img.complete && img.naturalWidth === 0) fallback();
    img.addEventListener("error", fallback);
  });

  /* ---------- Prix des packs (depuis config.js) ---------- */
  if (hasConfig) {
    document.querySelectorAll("[data-prix]").forEach((el) => {
      const pack = CONFIG.packs[el.dataset.prix];
      if (pack) el.textContent = formatPrix(pack.prix);
    });
  }

  /* ---------- Vues : « Voir les packs » ouvre comme une nouvelle page ---------- */
  const vues = document.querySelectorAll("[data-view]");
  if (vues.length) {
    let courante = null;
    const afficher = (premiere) => {
      const nom = location.hash === "#packs" ? "packs" : "intro";
      if (nom === courante) return;
      courante = nom;
      vues.forEach((el) => { el.hidden = el.dataset.view !== nom; });
      const haut = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      if (premiere) { if (nom === "packs") haut(); return; }
      const cible = nom === "intro" && location.hash.length > 1
        ? document.getElementById(location.hash.slice(1)) : null;
      if (cible) cible.scrollIntoView(); else haut();
    };
    afficher(true);
    window.addEventListener("hashchange", () => afficher(false));
  }

  /* ---------- Vidéos de témoignages (Cloudinary) ---------- */
  const liste = document.getElementById("temoignages-liste");
  if (liste && hasConfig && Array.isArray(CONFIG.temoignages)) {
    const estCloudinary = (u) => u.includes("res.cloudinary.com") && u.includes("/video/upload/");
    const optimiser = (u) =>
      estCloudinary(u) ? u.replace("/video/upload/", "/video/upload/q_auto/") : u;
    const couverture = (u) =>
      estCloudinary(u)
        ? u.replace("/video/upload/", "/video/upload/so_1,w_800,q_auto/").replace(/\.[a-z0-9]+(\?.*)?$/i, ".jpg")
        : "";

    CONFIG.temoignages.forEach((t) => {
      const carte = document.createElement("div");
      carte.className = "video-card reveal";

      let media;
      const url = (t.url || "").trim();
      if (url) {
        media = document.createElement("video");
        media.controls = true;
        media.preload = "none";
        media.setAttribute("playsinline", "");
        const poster = couverture(url);
        if (poster) media.poster = poster;
        media.src = optimiser(url);
      } else {
        media = document.createElement("div");
        media.className = "video-placeholder";
        media.textContent = "Vidéo bientôt disponible";
      }

      const info = document.createElement("div");
      info.className = "video-info";
      const nom = document.createElement("strong");
      nom.textContent = t.nom || "";
      const detail = document.createElement("span");
      detail.textContent = t.detail || "";
      info.append(nom, detail);

      carte.append(media, info);
      liste.appendChild(carte);
    });
  }

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

  /* ---------- Année du pied de page ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
});