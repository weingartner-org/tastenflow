/**
 * Serien nur für Lernweg "fr", ab der Punkt-Sprosse bis zum Ende des
 * Lernwegs - Altersstufe Erwachsene (15+, `erwachsen`) - E9-ende-erwachsen,
 * 26.09.2026 (Bauplan `BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md` §6,
 * Befund `BEFUND-2026-09-26-E9-ERWACHSEN-ENDE.md`).
 *
 * Acht Texte mit rotem Faden, je EINE Etappe mit 12-14 Zeilen, mit
 * wörtlicher Rede und Zahlen (gerades `"`, Leerzeichen vor `: ; ! ?` in der
 * Form FR/BE/CH). Eine Serie öffnet an der Sprosse ihrer „spätesten" Zeile;
 * jede trägt eine Ziffer oder einen Bindestrich, damit sie erst öffnet, wenn
 * jede Zeile VOLLSTÄNDIG erscheint. Kein `œ` (die allgemeinen
 * Serien-Wächter rechnen mit der Tastatur „de").
 *
 * Alles eigenes Werk, auf Französisch verfasst. Sachangaben sind im Befund
 * mit Quelle belegt; alle übrigen Zahlen gehören der erzählten Geschichte.
 */
import type { Serie } from "./serie";

const EIGEN = {
  quelle: "Sensorik",
  lizenz: "Eigenes Werk (selbst verfasst, französisches Original)",
  autor: "Sensorik-Lernplattform",
} as const;

export const SERIEN_FR_ENDE_ERWACHSEN: Serie[] = [
  // ── Frankreich (Sachtext nach dem Bilan démographique 2025 der Insee) ──
  {
    slug: "fr-weg-erwachsen-plus-de-deces-que-de-naissances",
    titel: "Plus de décès que de naissances",
    kind: "wissen-serie",
    lang: "fr",
    stufen: ["erwachsen"],
    minTier: 5,
    topic: "gesellschaft",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "En janvier, l'institut national de la statistique publie son bilan démographique.",
          "Au 1er janvier 2026, le pays atteint 69,1 millions d'habitants, soit 0,25 % de plus qu'un an auparavant.",
          "C'est une première dans l'histoire de l'après-guerre : les décès dépassent les naissances.",
          "Les maternités ont accueilli 645 000 nouveau-nés, 2,1 % de moins qu'en 2024.",
          "Par rapport à 2010, dernier pic des naissances, la baisse atteint 24 %.",
          "La fécondité recule à 1,56 enfant par femme : il faut remonter à la Première Guerre mondiale pour trouver moins.",
          "Côté décès, on en recense 651 000, soit 1,5 % de plus qu'en 2024.",
          "Pour 100 décès, il y a donc environ 99 naissances.",
          "Le solde naturel s'établit ainsi à -6 000 personnes.",
          "La population continue pourtant de croitre, grâce au solde migratoire.",
          "L'espérance de vie à la naissance progresse encore : 85,9 pour les femmes, 80,3 pour les hommes.",
          "Sur son blog, l'institut parle d'une \"nouvelle ère\".",
          "Les tableaux détaillés sont en ligne sur le site de l'institut.",
        ],
      },
    ],
  },
  // ── Québec (Montréal, Wortschatz der OQLF) ──
  {
    slug: "fr-weg-erwachsen-le-reseautage-de-thomas",
    titel: "Le réseautage de Thomas",
    kind: "geschichte",
    lang: "fr",
    stufen: ["erwachsen"],
    minTier: 5,
    topic: "sprache",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Thomas, ingénieur venu de Lyon, commence un nouveau poste à Montréal le 3 septembre.",
          "Dès 9 h, sa collègue Josée l'invite à un remue-méninges.",
          "\"Un brainstorming ?\" s'étonne Thomas.",
          "\"Ici, on parle de remue-méninges, c'est plus joli\", corrige Josée en souriant.",
          "À midi, l'équipe l'inscrit à une soirée de réseautage pour les nouveaux arrivants.",
          "\"Du networking, quoi\", lance Thomas.",
          "Josée rit : \"À Montréal, on préfère réseautage.\"",
          "Le vendredi, Thomas envoie 12 messages et reçoit 3 réponses sur son cellulaire.",
          "Il note dans un carnet : téléverser, clavarder, divulgâcher.",
          "Le 1er octobre, son carnet contient déjà 27 mots nouveaux.",
          "Un dimanche, son fils le supplie de ne pas \"divulgâcher\" la fin d'une série.",
          "\"Tu parles comme un vrai Montréalais\", s'amuse Josée le 1er décembre.",
          "Thomas sourit : il lui reste à apprivoiser l'hiver et ses -25 degrés.",
        ],
      },
    ],
  },
  // ── Belgien (Charleroi, Wohnen zwischen den Generationen) ──
  {
    slug: "fr-weg-erwachsen-la-chambre-d-helene",
    titel: "La chambre d'Hélène",
    kind: "geschichte",
    lang: "fr",
    stufen: ["erwachsen"],
    minTier: 5,
    topic: "wohnen",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Hélène, retraitée, vit seule dans une maison de 5 pièces à Charleroi.",
          "Ses enfants habitent à Gand et à Arlon, loin de chez elle.",
          "Par hasard, elle lit une annonce de l'université : \"Étudiants cherchent chambre chez l'habitant.\"",
          "Elle appelle le numéro et, peu après, Nassim sonne à sa porte.",
          "Nassim, en 2e bachelier en soins infirmiers, vient de Verviers.",
          "Le contrat est simple : 200 € de participation, et un peu de compagnie.",
          "\"Je ne cherche pas l'argent, je cherche de la conversation\", explique Hélène.",
          "Le mardi, Nassim cuisine des pâtes ; le jeudi, c'est Hélène qui prépare les frites.",
          "Elle lui apprend à jouer à la belote, il lui installe une application de visio.",
          "En février, Hélène appelle enfin ses petits-enfants en vidéo.",
          "\"Tu vois, mamie, ça marche !\" crie sa petite-fille à l'autre bout de l'écran.",
          "En juin, Nassim réussit ses examens avec 16 sur 20.",
          "\"Tu reviens en septembre ?\" s'inquiète Hélène. Il a déjà signé pour la rentrée suivante.",
        ],
      },
    ],
  },
  // ── Schweiz (Bienne, Uhrmacherlehre) ──
  {
    slug: "fr-weg-erwachsen-l-apprenti-de-bienne",
    titel: "L'apprenti de Bienne",
    kind: "geschichte",
    lang: "fr",
    stufen: ["erwachsen"],
    minTier: 5,
    topic: "arbeit",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Luca a terminé l'école obligatoire à Neuchâtel en juin.",
          "Le 4 aout, il commence un apprentissage d'horloger dans une manufacture de Bienne.",
          "À Bienne, on change de langue d'une phrase à l'autre.",
          "\"Grüessech !\" lance le chef d'atelier ; \"Bonjour !\" réplique Luca, un peu perdu.",
          "Sur son établi : une loupe, 14 tournevis et des pièces plus petites qu'un grain de riz.",
          "Tout l'automne, Luca démonte et remonte un vieux mouvement.",
          "\"La patience, c'est 90 % du métier\", répète son formateur, Monsieur Probst.",
          "À la pause, les collègues lui apprennent 20 mots d'allemand.",
          "Lui leur apprend à dire \"ça joue\" à la manière de Neuchâtel.",
          "En novembre, il répare seul sa première montre.",
          "\"Elle avance de 3 secondes toutes les 24 h\", constate le formateur.",
          "\"Pour un début, c'est très bien\", ajoute-t-il en souriant.",
          "Le soir, en rentrant à Neuchâtel, Luca écoute des podcasts en allemand.",
        ],
      },
    ],
  },
  // ── Senegal (Thiès, Bezahlen per Telefon) ──
  {
    slug: "fr-weg-erwachsen-le-telephone-de-mame-diarra",
    titel: "Le téléphone de Mame Diarra",
    kind: "geschichte",
    lang: "fr",
    stufen: ["erwachsen"],
    minTier: 5,
    topic: "alltag",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Mame Diarra tient un étal de tissus au marché de Thiès.",
          "Pendant longtemps, ses clientes payaient uniquement en billets et en pièces.",
          "Un lundi, sa nièce Khady arrive avec une idée.",
          "\"Tata, avec le paiement par téléphone, tu n'auras plus besoin de monnaie\", explique Khady.",
          "Mame Diarra hésite : elle n'a jamais aimé les écrans.",
          "Khady configure l'application en 10 min, pas une de plus.",
          "Dès le lendemain, 4 clientes paient avec leur portable.",
          "\"C'est plus rapide, et je ne cherche plus la monnaie !\" reconnait Mame Diarra.",
          "À la fermeture, elle vérifie le solde : 38 500 francs CFA.",
          "Par prudence, elle note aussi toutes les ventes dans un cahier.",
          "Bientôt, les paiements par téléphone représentent la moitié de ses ventes.",
          "\"Et si la batterie te lâche ?\" s'inquiète une voisine.",
          "Mame Diarra sourit et montre sa batterie de secours, chargée à 100 %.",
        ],
      },
    ],
  },
  // ── Tunesien (Sfax, Apotheke) ──
  {
    slug: "fr-weg-erwachsen-la-nuit-de-garde",
    titel: "La nuit de garde",
    kind: "geschichte",
    lang: "fr",
    stufen: ["erwachsen"],
    minTier: 5,
    topic: "alltag",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Ce samedi, Salma assure la garde de nuit dans sa pharmacie de Sfax, en Tunisie.",
          "À 22 h, le quartier est calme, et la rue sent le jasmin.",
          "À 23 h 10, un père arrive avec son bébé qui a 39 de fièvre.",
          "\"La fièvre a commencé quand ?\" interroge Salma.",
          "\"Ce soir, vers 20 h\", souffle le père, inquiet.",
          "Salma pèse le bébé : 8,4 kg. Elle calcule la dose de sirop avec soin.",
          "\"Et s'il ne va pas mieux ?\" s'inquiète le père.",
          "\"Appelez le médecin de garde, et revenez me voir\", conseille Salma.",
          "Vers 2 h, une étudiante vient chercher des pansements pour une coupure.",
          "À 4 h, Salma boit un thé et range les boites de médicaments.",
          "À 7 h 30, Ines prend la relève.",
          "Le père revient avec le bébé, qui ne pleure plus : \"La fièvre est tombée, merci !\"",
          "Salma rentre dormir, fatiguée mais contente.",
        ],
      },
    ],
  },
  // ── Frankreich (Glosse aus dem Büro) ──
  {
    slug: "fr-weg-erwachsen-les-notes-de-frais",
    titel: "Les notes de frais",
    kind: "geschichte",
    lang: "fr",
    stufen: ["erwachsen"],
    minTier: 5,
    topic: "arbeit",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Lundi, notre société a adopté un nouveau logiciel de notes de frais.",
          "Pour un café de 2,50 €, il faut désormais remplir 7 champs.",
          "Champ 1 : la date. Champ 2 : le motif. Champ 3 : le nom du client.",
          "\"Et le champ 7 ?\" s'étonne Odile, du service achats.",
          "\"Le numéro du ticket, écrit en tout petit\", soupire le comptable.",
          "Le logiciel refuse les photos floues, les tickets froissés et, semble-t-il, les lundis.",
          "Mardi, j'ai passé 25 min à déclarer un trajet de 12 km.",
          "Mercredi, une fenêtre apparait : \"Votre session a expiré.\"",
          "Jeudi, le service informatique envoie un tutoriel de 43 pages.",
          "Vendredi, Odile calcule : 3 h de saisie pour 18 € de remboursement.",
          "\"À ce tarif, je préfère payer mon café moi-même\", conclut-elle.",
          "Le lundi suivant, la direction annonce une formation obligatoire au logiciel.",
          "Elle dure 2 h, et le café y est offert (sans note de frais).",
        ],
      },
    ],
  },
  // ── Côte d'Ivoire (Abidjan - Bouaké) ──
  {
    slug: "fr-weg-erwachsen-le-car-pour-bouake",
    titel: "Le car pour Bouaké",
    kind: "geschichte",
    lang: "fr",
    stufen: ["erwachsen"],
    minTier: 5,
    topic: "reise",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Samedi, Adjoua prend le car à la gare routière d'Adjamé, à Abidjan.",
          "Direction Bouaké, où sa grand-mère fête son anniversaire.",
          "Le départ est prévu à 7 h, mais le car attend d'être plein.",
          "\"On y va quand ?\" s'impatiente un passager.",
          "\"Bientôt, bientôt\", promet le chauffeur en chargeant les bagages.",
          "Finalement, le car démarre à 8 h 40, avec 62 passagers à bord.",
          "Sur la route, des vendeuses proposent de l'eau, des arachides et de l'alloco.",
          "Vers midi, un pneu éclate à la sortie de Yamoussoukro.",
          "Plusieurs passagers descendent aider le chauffeur, dont Adjoua.",
          "En 45 min, la roue est changée, sous un soleil de plomb.",
          "\"Merci à tous, on repart !\" lance le chauffeur.",
          "Le car arrive à Bouaké à 15 h 20, juste à temps pour la fête.",
          "\"Le voyage s'est bien passé ?\" s'enquiert Mamie, et Adjoua rit.",
        ],
      },
    ],
  },
];
