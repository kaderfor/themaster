// ===== CONFIGURATION THE MASTER =====
const CONFIG = {
  marque: "THE MASTER",
  signature: "Transformer les habitudes pour construire l'excellence.",

  // Contacts
  whatsapp: "22671258183", // indicatif Burkina (226) + numéro, sans + ni espaces
  telephone: "+226 71 25 81 83",
    // Vidéos de témoignages (Cloudinary) : collez l'URL de chaque vidéo dans "url"
  temoignages: [
    { nom: "NAKELSI Desiré", detail: "Parcours B", url: "https://res.cloudinary.com/h4s2nxus/video/upload/v1792098246/temoignage-1.mp4.mp4" },
    { nom: "Nom du témoin 2", detail: "Formation suivie", url: "" },
    { nom: "Nom du témoin 3", detail: "Formation suivie", url: "" }
  ],
  email: "contact@themaster.com", // À REMPLACER par le vrai mail du client

  // Packs
  packs: {
    "pack-1": {
      parcours: "Formation",
      nom: "Pack 1 — Formation vente & création de contenu",
      prix: 25000
    },
    "pack-2": {
      parcours: "Formation",
      nom: "Pack 2 — Formation avec accompagnement pratique",
      prix: 50000 // PROVISOIRE, à confirmer avec le client
    },
    "pack-3": {
      parcours: "Formation",
      nom: "Pack 3 — Formation complète",
      prix: 100000
    },
    "pack-decouverte": {
      parcours: "Entreprendre",
      nom: "Pack découverte",
      prix: 50000
    },
    "pack-developpement": {
      parcours: "Entreprendre",
      nom: "Pack développement",
      prix: 150000
    },
    "pack-demarrage": {
      parcours: "Entreprendre",
      nom: "Pack démarrage",
      prix: 310000
    }
  },

  // Moyens de paiement
  paiements: {
    orange: {
      nom: "Orange Money",
      numero: "07341505",
      titulaire: "Ouedraogo Kader",
      ussd: "*144*10*07341505*{montant}#"
    },
    moov: {
      nom: "Moov Money",
      numero: "71258183",
      titulaire: "Ouedraogo Kader",
      ussd: "*555*2*1*71258183*{montant}#"
    },
    wave: {
      nom: "Wave",
      numero: "71258183",
      titulaire: "Ouedraogo Kader",
      ussd: null // Wave se fait depuis l'application
    }
  }
};

// Format : 25000 -> "25 000 FCFA"
function formatPrix(montant) {
  return montant.toLocaleString("fr-FR").replace(/\u202f|\u00a0/g, " ") + " FCFA";
}