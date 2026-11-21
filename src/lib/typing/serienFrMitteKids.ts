/**
 * Serien nur für Lernweg "fr", Sprossen 25-34 - Altersstufe Kinder (7-10,
 * `kids`) - E9-kids, 26.09.2026 (Bauplan
 * `BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md` §6, Befund
 * `BEFUND-2026-09-26-E9-KIDS-MITTE.md`).
 *
 * Acht Geschichten mit Anfang, Mitte und Schluss, je EINE Etappe mit 12-14
 * Zeilen. Eine Serie öffnet an der Sprosse ihrer „spätesten" Zeile
 * (Zeichensatz siehe Kopf von `corpusFrMitteKids.ts`); keine Zeile hat ein
 * Satzzeichen, keine reiht zwei Hauptsätze ohne Bindewort aneinander.
 *
 * Fünf von acht spielen ausserhalb Frankreichs (Bauplan §6.5 Regel 8):
 * Québec (Cabane à sucre), Schweiz (Escalade in Genf), Belgien (Gilles de
 * Binche), Senegal (Fabel vom schlauen Hasen, neue Handlung) und Haïti.
 * Dazu ein Experiment im Imperativ (Vorbild nur die Gattung der Petits
 * Débrouillards) und eine Blague de Toto mit eigener Pointe.
 * Alles eigenes Werk, auf Französisch verfasst.
 */
import type { Serie } from "./serie";

const EIGEN = {
  quelle: "Sensorik",
  lizenz: "Eigenes Werk (selbst verfasst, französisches Original)",
  autor: "Sensorik-Lernplattform",
} as const;

export const SERIEN_FR_MITTE_KIDS: Serie[] = [
  // ── Frankreich ──
  {
    slug: "fr-weg-kids-le-poisson-de-la-classe",
    titel: "Le poisson de la classe",
    kind: "geschichte",
    lang: "fr",
    stufen: ["kids"],
    minTier: 3,
    topic: "tiere",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Notre classe a un poisson rouge qui s'appelle Pistache",
          "Chaque matin un enfant lui donne à manger",
          "Lundi c'est le tour de Lucas",
          "Lucas met trop de nourriture dans le bocal",
          "Pistache mange tout et il devient tout rond",
          "Mardi Pistache ne bouge plus du tout",
          "Les enfants ont peur qu'il soit malade",
          "La maitresse regarde le bocal avec attention",
          "En réalité Pistache dort au fond de l'eau",
          "Il a trop mangé alors il fait une sieste",
          "Tout le monde rit de soulagement",
          "Maintenant Lucas donne juste une pincée à la fois",
          "Et Pistache nage à nouveau comme un champion",
        ],
      },
    ],
  },
  // ── Québec ──
  {
    slug: "fr-weg-kids-la-cabane-a-sucre",
    titel: "La cabane à sucre",
    kind: "geschichte",
    lang: "fr",
    stufen: ["kids"],
    minTier: 3,
    topic: "feste",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Au printemps Rosalie part à la cabane à sucre avec sa famille",
          "La cabane est au fond de la forêt",
          "Les érables donnent une eau un peu sucrée",
          "On fait bouillir cette eau pendant des heures",
          "Petit à petit elle devient du sirop d'érable",
          "Dehors le papa de Rosalie verse du sirop tout chaud sur la neige",
          "Le sirop durcit un peu sur la neige froide",
          "Rosalie roule la tire autour d'un bâton",
          "C'est collant mais c'est tellement bon",
          "Puis tout le monde mange des crêpes au sirop",
          "Un musicien joue du violon et on danse",
          "Le soir Rosalie rentre fatiguée mais contente",
          "Elle a hâte de revenir au printemps prochain",
        ],
      },
    ],
  },
  // ── Schweiz ──
  {
    slug: "fr-weg-kids-la-marmite-de-lescalade",
    titel: "La marmite de l'Escalade",
    kind: "geschichte",
    lang: "fr",
    stufen: ["kids"],
    minTier: 3,
    topic: "feste",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "En décembre Genève fête l'Escalade",
          "Dans les rues les enfants portent des costumes",
          "La mère de Léon a acheté une marmite en chocolat",
          "Elle est remplie de petits légumes en massepain",
          "La tradition dit que le plus jeune et le plus âgé la cassent ensemble",
          "Léon est le plus jeune de la famille",
          "Son papi est le plus âgé",
          "Ils tapent ensemble sur la marmite",
          "La marmite se casse en mille morceaux",
          "Toute la famille crie de joie",
          "Puis chacun choisit un légume en massepain",
          "Léon prend une petite carotte et Papi une pomme de terre",
          "Le chocolat est très bon et la fête dure toute la soirée",
        ],
      },
    ],
  },
  // ── ohne Ort ──
  {
    slug: "fr-weg-kids-un-volcan-dans-la-cuisine",
    titel: "Un volcan dans la cuisine",
    kind: "wissen-serie",
    lang: "fr",
    stufen: ["kids"],
    minTier: 5,
    topic: "wissenschaft",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Aujourd'hui on fabrique un petit volcan",
          "Demande d'abord la permission à un adulte",
          "Prends un pot de confiture vide et bien propre",
          "Pose le pot au milieu d'un grand plat",
          "Mets deux cuillères de bicarbonate dans le pot",
          "Ajoute trois gouttes de colorant rouge",
          "Ajoute aussi un peu de liquide vaisselle",
          "Maintenant verse doucement du vinaigre dans le pot",
          "Regarde bien ce qui se passe",
          "Une mousse rouge monte et déborde du pot",
          "Le mélange du vinaigre et du bicarbonate produit un gaz",
          "Et voilà ton volcan en éruption",
          "À la fin rince le plat et range tout",
        ],
      },
    ],
  },
  // ── Belgien ──
  {
    slug: "fr-weg-kids-les-gilles-de-binche",
    titel: "Les Gilles de Binche",
    kind: "geschichte",
    lang: "fr",
    stufen: ["kids"],
    minTier: 5,
    topic: "feste",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "En Belgique la ville de Binche fête un très grand carnaval",
          "Le mardi gras les Gilles dansent dans les rues",
          "Ils portent des sabots et un costume aux couleurs vives",
          "Sur leur tête ils ont un chapeau de grandes plumes blanches",
          "Chaque Gille porte un panier plein d'oranges",
          "Au son des tambours ils lancent les oranges à la foule",
          "Sofia est venue avec son papa pour voir le cortège",
          "Elle tend les mains très haut vers le ciel",
          "Un Gille lui lance une belle orange toute ronde",
          "Sofia l'attrape du premier coup",
          "À Binche une orange de Gille porte bonheur",
          "Il ne faut jamais la relancer",
          "Le soir Sofia mange son orange avec un grand sourire",
        ],
      },
    ],
  },
  // ── Senegal ──
  {
    slug: "fr-weg-kids-le-lievre-et-la-hyene",
    titel: "Le lièvre et la hyène",
    kind: "geschichte",
    lang: "fr",
    stufen: ["kids"],
    minTier: 3,
    topic: "tiere",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Dans la savane du Sénégal vit un petit lièvre très malin",
          "Un jour la hyène trouve un baobab plein de fruits",
          "Elle veut garder tous les fruits pour elle toute seule",
          "Le lièvre a faim lui aussi alors il réfléchit",
          "Il dit à la hyène que le lion arrive et qu'il a très faim",
          "La hyène a très peur et elle court se cacher dans un trou",
          "Le lièvre appelle vite tous les animaux de la savane",
          "Chacun cueille un fruit et tout le monde se régale",
          "Quand la hyène sort du trou il n'y a plus un seul fruit",
          "Elle se fâche mais le lièvre lui tend un fruit qu'il a gardé pour elle",
          "Le lièvre lui explique qu'on est plus heureux à plusieurs",
          "Depuis ce jour la hyène partage toujours sa nourriture",
          "Mais elle ne croit plus jamais les histoires du lièvre",
        ],
      },
    ],
  },
  // ── Frankreich ──
  {
    slug: "fr-weg-kids-toto-et-la-lecon-de-calcul",
    titel: "Toto et la leçon de calcul",
    kind: "geschichte",
    lang: "fr",
    stufen: ["kids"],
    minTier: 3,
    topic: "schule",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Ce matin la maitresse commence la leçon de calcul",
          "Elle regarde Toto qui dessine sur son cahier",
          "Elle lui pose un problème",
          "Toto a dix bonbons et il en donne la moitié à son frère",
          "La maitresse veut savoir combien de bonbons il lui reste",
          "Toto réfléchit très longtemps",
          "Puis il répond qu'il lui en reste dix",
          "La maitresse lui dit que ce n'est pas juste",
          "Toto explique que ce calcul ne marche pas chez lui",
          "Il n'a pas de frère alors il garde tous ses bonbons",
          "Toute la classe éclate de rire",
          "Même la maitresse ne peut pas garder son sérieux",
          "Toto a sa propre façon de compter",
        ],
      },
    ],
  },
  // ── Haïti ──
  {
    slug: "fr-weg-kids-les-mangues-de-loic",
    titel: "Les mangues de Loïc",
    kind: "geschichte",
    lang: "fr",
    stufen: ["kids"],
    minTier: 3,
    topic: "natur",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Loïc habite dans un petit village en Haïti",
          "Devant sa maison pousse un grand manguier",
          "En juin les mangues deviennent jaunes et sucrées",
          "Chaque matin Loïc regarde l'arbre avec envie",
          "Mais les mangues sont tout en haut des branches",
          "Loïc est trop petit pour les attraper",
          "Sa voisine Anaïs a une idée",
          "Elle pose un grand panier sous l'arbre",
          "Puis elle secoue doucement une branche avec un long bâton",
          "Une mangue tombe tout droit dans le panier",
          "Loïc applaudit et Anaïs recommence",
          "Bientôt le panier est plein de mangues",
          "Le soir ils partagent les fruits avec tout le village",
        ],
      },
    ],
  },
];
