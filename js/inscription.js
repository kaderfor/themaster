document.addEventListener("DOMContentLoaded", () => {
  if (typeof CONFIG === "undefined") return;
  const form = document.getElementById("form-inscription");
  if (!form) return;

  const selPack = document.getElementById("pack");
  const recapNom = document.getElementById("recap-nom");
  const recapPrix = document.getElementById("recap-prix");
  const details = document.getElementById("payment-details");
  const confirmBlock = document.getElementById("confirm-block");

  /* ---------- 1. Liste des packs ---------- */
  const labels = {
    Formation: "Parcours A — Formation uniquement",
    Entreprendre: "Parcours B — Entreprendre avec nous"
  };
  const groupes = {};
  Object.entries(CONFIG.packs).forEach(([id, p]) => {
    (groupes[p.parcours] = groupes[p.parcours] || []).push([id, p]);
  });
  Object.keys(groupes).forEach((g) => {
    const og = document.createElement("optgroup");
    og.label = labels[g] || g;
    groupes[g].forEach(([id, p]) => {
      const o = document.createElement("option");
      o.value = id;
      o.textContent = `${p.nom} — ${formatPrix(p.prix)}`;
      og.appendChild(o);
    });
    selPack.appendChild(og);
  });

  const packUrl = new URLSearchParams(location.search).get("pack");
  if (packUrl && CONFIG.packs[packUrl]) selPack.value = packUrl;

  /* ---------- 2. Récapitulatif ---------- */
  function majRecap() {
    const pack = CONFIG.packs[selPack.value];
    recapNom.textContent = pack ? pack.nom : "Aucun pack sélectionné";
    recapPrix.textContent = pack ? formatPrix(pack.prix) : "—";
  }

  /* ---------- 3. Instructions de paiement ---------- */
  function renderPaiement() {
    const cle = form.elements["paiement"].value;
    const pack = CONFIG.packs[selPack.value];
    confirmBlock.classList.toggle("open", Boolean(cle && pack));

    if (!cle) {
      details.classList.remove("show");
      details.innerHTML = "";
      return;
    }
    details.classList.add("show");

    if (!pack) {
      details.innerHTML = "<p>Choisissez d'abord un pack pour afficher le montant à payer.</p>";
      return;
    }

    const p = CONFIG.paiements[cle];
    const montant = pack.prix;
    let html = `
      <div class="pay-line"><span>Montant à payer</span><strong>${formatPrix(montant)}</strong></div>
      <div class="pay-line"><span>Numéro de paiement</span><strong>${p.numero}</strong></div>
      <div class="pay-line"><span>Nom du bénéficiaire</span><strong>${p.titulaire}</strong></div>
      <div class="pay-actions" style="margin:12px 0;">
        <button type="button" class="btn btn-dark btn-small" data-copy="${p.numero}">Copier le numéro</button>
      </div>`;

    if (p.ussd) {
      const code = p.ussd.replace("{montant}", montant);
      html += `
        <div style="font-size:0.88rem; color:var(--muted);">Code à composer sur votre téléphone :</div>
        <div class="code-box">${code}</div>
        <div class="pay-actions">
          <a class="btn btn-primary btn-small" href="tel:${encodeURIComponent(code)}">Composer le code</a>
          <button type="button" class="btn btn-dark btn-small" data-copy="${code}">Copier le code</button>
        </div>
        <ol class="pay-steps">
          <li>Composez le code ci-dessus (ou ouvrez ${p.nom}).</li>
          <li>Vérifiez le nom du bénéficiaire et le montant de ${formatPrix(montant)}.</li>
          <li>Validez avec votre code secret.</li>
          <li>Conservez le SMS de confirmation, puis complétez l'étape 3 ci-dessous.</li>
        </ol>`;
    } else {
      html += `
        <ol class="pay-steps">
          <li>Ouvrez l'application ${p.nom}.</li>
          <li>Envoyez ${formatPrix(montant)} au numéro ${p.numero}.</li>
          <li>Vérifiez le nom du bénéficiaire avant de valider.</li>
          <li>Faites une capture d'écran de la confirmation, puis complétez l'étape 3 ci-dessous.</li>
        </ol>`;
    }
    details.innerHTML = html;
  }

  /* ---------- Copier dans le presse-papiers ---------- */
  details.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-copy]");
    if (!btn) return;
    const texte = btn.dataset.copy;
    const ok = () => {
      const ancien = btn.textContent;
      btn.textContent = "Copié ✓";
      setTimeout(() => (btn.textContent = ancien), 1800);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texte).then(ok).catch(() => {});
    } else {
      const t = document.createElement("textarea");
      t.value = texte;
      document.body.appendChild(t);
      t.select();
      try { document.execCommand("copy"); ok(); } catch (err) {}
      document.body.removeChild(t);
    }
  });

  selPack.addEventListener("change", () => { majRecap(); renderPaiement(); });
  form.querySelectorAll('input[name="paiement"]').forEach((r) => r.addEventListener("change", renderPaiement));

  /* ---------- 4. Validation ---------- */
  function erreur(id, invalide) {
    document.getElementById(id).classList.toggle("invalid", invalide);
    return invalide;
  }
  form.addEventListener("input", (e) => {
    const g = e.target.closest(".form-group");
    if (g) g.classList.remove("invalid");
  });
  form.addEventListener("change", (e) => {
    const g = e.target.closest(".form-group");
    if (g) g.classList.remove("invalid");
  });

  const chiffres = (s) => s.replace(/\D/g, "");

  function valider() {
    const v = (id) => document.getElementById(id).value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email"));

    const problemes = [
      erreur("g-nom", v("nom").length < 3),
      erreur("g-whatsapp", chiffres(v("whatsapp")).length < 8),
      erreur("g-email", !emailOk),
      erreur("g-pays", !v("pays")),
      erreur("g-pack", !selPack.value),
      erreur("g-mode", !v("mode")),
      erreur("g-paiement", !form.elements["paiement"].value),
      erreur("g-payeur", v("payeur").length < 3),
      erreur("g-numero", chiffres(v("numero")).length < 8),
      erreur("g-accord", !document.getElementById("accord").checked)
    ];

    const premier = form.querySelector(".form-group.invalid");
    if (premier) premier.scrollIntoView({ behavior: "smooth", block: "center" });
    return !problemes.some(Boolean);
  }

  /* ---------- 5. Envoi : WhatsApp + copie d'archive Netlify ---------- */
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!valider()) return;

    const v = (id) => document.getElementById(id).value.trim();
    const pack = CONFIG.packs[selPack.value];
    const paiement = CONFIG.paiements[form.elements["paiement"].value];

    const message = [
      "Bonjour THE MASTER, je viens de m'inscrire.",
      "",
      `Nom : ${v("nom")}`,
      `Téléphone : ${v("whatsapp")}`,
      `Email : ${v("email")}`,
      `Pays : ${v("pays")}`,
      `Formation : ${pack.nom}`,
      `Mode de formation : ${v("mode")}`,
      `Montant : ${formatPrix(pack.prix)}`,
      `Moyen de paiement : ${paiement.nom}`,
      `Nom du compte ayant payé : ${v("payeur")}`,
      `Numéro ayant effectué le transfert : ${v("numero")}`,
      "",
      "Je joins ma preuve de paiement."
    ].join("\n");

    // 1) Ouvre WhatsApp tout de suite (avant tout autre traitement)
    const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");

    // 2) Garde les infos pour la page de confirmation
    try {
      sessionStorage.setItem("themaster_commande", JSON.stringify({
        nom: v("nom"),
        pack: pack.nom,
        montant: formatPrix(pack.prix),
        paiement: paiement.nom,
        payeur: v("payeur"),
        numero: v("numero"),
        message: message
      }));
    } catch (err) {}

    // 3) Copie d'archive de l'inscription (Netlify Forms, ignorée si indisponible)
    const donnees = new URLSearchParams(new FormData(form));
    donnees.set("form-name", "inscription");
    donnees.set("pack_nom", pack.nom);
    donnees.set("montant", formatPrix(pack.prix));
    const envoi = fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: donnees.toString()
    }).catch(() => {});
    const delai = new Promise((r) => setTimeout(r, 1200));

    // 4) Page de confirmation
    Promise.race([envoi, delai]).then(() => { location.href = "confirmation.html"; });
  });

  majRecap();
  renderPaiement();
});