/**
 * Serien nur für Lernweg "fr", frühe Sprossen 17-24 - Altersstufe Kids (E8a,
 * 25./26.09.2026, Bauplan `BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md` §6,
 * Auftrag E8a Punkt 2). **E8a-2 (26.09.2026):** jede Serie auf eine Etappe
 * mit 12-14 Zeilen verlängert (`ETAPPE_MIN_LINES`/`ETAPPE_MAX_LINES`,
 * `serie.ts`) - die volle Suite (`tests/typing-textwelt-serien.test.ts`)
 * verlangt das für JEDE Serie, unabhängig vom Lernweg. Jede Geschichte hat
 * jetzt Anfang, Mitte und Schluss statt nur einer Momentaufnahme.
 *
 * Regeln und Prüfweg: siehe Kopf von `corpusFrWegFruehKids.ts` (derselbe
 * Zeichensatz je Sprosse, keine Satzzeichen, kein Wort mit einem Buchstaben
 * ausserhalb der Sprosse - hier zusätzlich streng validiert gegen `fitText`
 * mit dem exakten kumulativen Alphabet der genannten Sprosse). Jede Serie
 * gehört zu GENAU einer Sprosse (17-24) - alle Zeilen einer Serie benutzen
 * nur deren Buchstaben, keine spätere Sprosse. Kein Satz reiht sich ohne
 * Bindewort an einen anderen (E8a, zweite Lese-Abnahme).
 *
 * Mindestens ein Drittel der Serien spielt ausserhalb Frankreichs (Bauplan
 * §6.5 Regel 8): Serie 2 (Senegal/Westafrika), Serie 4 (Maghreb), Serie 8
 * (Côte d'Ivoire/Westafrika), Serie 12 (Schweiz) - 4 von 12.
 *
 * Alles eigenes Werk, nichts aus den deutschen oder englischen Dateien
 * übertragen (Bauplan §6.2, D2). Nur neue Rechtschreibung (F4): „boite"
 * ohne Zirkumflex (wie „ile", „cout" - 1990-Rektifikation).
 */
import type { Serie } from "./serie";

const EIGEN = {
  quelle: "Sensorik",
  lizenz: "Eigenes Werk (selbst verfasst, französisches Original)",
  autor: "Sensorik-Lernplattform",
} as const;

export const SERIEN_FR_WEG_FRUEH_KIDS: Serie[] = [
  // ── Sprosse 17 (+p) - Frankreich: ein Panier voller Pommes ──────────────
  {
    slug: "fr-weg-kids-panier-de-pommes",
    titel: "Un panier de pommes",
    kind: "geschichte",
    lang: "fr",
    stufen: ["kids"],
    minTier: 2,
    topic: "freundschaft",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Omar porte un panier plein de pommes",
          "Il les ramasse au pied du pommier",
          "Karim tend la main pour en prendre une",
          "Il prend la plus ronde du panier",
          "Karim sourit et mord dans la pomme",
          "Elle est tendre et pleine de jus",
          "Soudain il pleut sur la rue",
          "Karim et Omar restent sous le pommier",
          "Ils attendent la fin de la pluie",
          "Pour attendre ils font un jeu de mots",
          "Puis la pluie part et le soleil sort",
          "Omar et Karim rapportent le panier",
          "En rentrant Omar en fait une tarte",
        ],
      },
    ],
  },
  // ── Sprosse 17 (+p) - Senegal/Westafrika: Fatou und ihre Schildkröte ────
  {
    slug: "fr-weg-kids-fatou-et-sa-tortue",
    titel: "Fatou et sa tortue",
    kind: "geschichte",
    lang: "fr",
    stufen: ["kids"],
    minTier: 2,
    topic: "tiere",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Fatou a une tortue qui se nomme Lola",
          "Le matin Fatou la met dans un panier",
          "Elle part se promener dans la rue",
          "Un ami la salue et admire la tortue",
          "Mais Fatou ne le ferme pas",
          "Lola sort tout lentement",
          "Elle part toute seule dans la rue",
          "Soudain Fatou tend la main pour la prendre",
          "Mais il ne reste plus rien dedans",
          "Fatou et son ami font le tour de la rue",
          "Lola dort sous une pierre plate",
          "Fatou sourit et la remet dedans",
          "Le soir Lola mord une feuille de laitue",
        ],
      },
    ],
  },
  // ── Sprosse 18 (+c) - Frankreich: ein Spiel in der Klasse ────────────────
  {
    slug: "fr-weg-kids-un-jeu-en-classe",
    titel: "Un jeu en classe",
    kind: "geschichte",
    lang: "fr",
    stufen: ["kids"],
    minTier: 2,
    topic: "schule",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Idris entre dans sa classe",
          "La maitresse propose un jeu de lettres",
          "Tous tirent sept lettres dans un sac",
          "Idris et sa copine Amina forment un mot",
          "Puis ils en forment un autre",
          "Ils comptent tous les points",
          "Idris et Amina remportent la partie",
          "Toute la classe applaudit",
          "Amina propose une autre partie",
          "Cette fois Lucas et Nora font le plus de points",
          "Idris sourit et serre la main de Lucas",
          "La maitresse remet le sac dans le placard",
          "Demain ils joueront encore",
        ],
      },
    ],
  },
  // ── Sprosse 18 (+c) - Maghreb: Karima und son oiseau ────────────────────
  {
    slug: "fr-weg-kids-karima-et-son-oiseau",
    titel: "Karima et son oiseau",
    kind: "geschichte",
    lang: "fr",
    stufen: ["kids"],
    minTier: 2,
    topic: "tiere",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Karima a un petit oiseau",
          "Son oiseau joue tout le temps",
          "Elle porte son oiseau dans un panier",
          "Sa copine porte un cadeau aussi",
          "Elles portent cet oiseau au parc",
          "Elles ont un coin calme",
          "Il sort du panier",
          "Il court un peu partout",
          "Karima le rattrape en courant",
          "Sa copine rit aussi",
          "Karima et sa copine sont contentes",
          "Elles rentrent toutes contentes",
        ],
      },
    ],
  },
  // ── Sprosse 19 (+v) - Frankreich: une course dans la cour ────────────────
  {
    slug: "fr-weg-kids-une-course-dans-la-cour",
    titel: "Une course dans la cour",
    kind: "geschichte",
    lang: "fr",
    stufen: ["kids"],
    minTier: 2,
    topic: "sport",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "David arrive vite dans la cour",
          "Il joue avec ses copains",
          "Ils courent tous vers la porte",
          "Olivier arrive le premier",
          "David arrive juste ensuite",
          "Ils reprennent leur souffle",
          "Il veut recommencer vite",
          "Ils courent une autre fois",
          "Cette fois David arrive premier",
          "Il saute de joie",
          "Olivier sourit avec joie",
          "Tous ses amis sont ravis",
        ],
      },
    ],
  },
  // ── Sprosse 20 (+') - Frankreich: l'aventure d'un oiseau ─────────────────
  {
    slug: "fr-weg-kids-laventure-dun-oiseau",
    titel: "L'aventure d'un oiseau",
    kind: "geschichte",
    lang: "fr",
    stufen: ["kids"],
    minTier: 2,
    topic: "tiere",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Florence dit qu'elle aime lire",
          "Elle prend un livre dans son sac",
          "C'est l'aventure d'un oiseau",
          "L'oiseau sort du nid",
          "Il veut voir le vaste monde",
          "Il vole vers un joli jardin",
          "Il avance tout doucement",
          "Il trouve un ami surpris",
          "L'ami lui montre la sortie",
          "Il rentre content",
          "Qu'il est calme cet oiseau",
          "Qu'il est fier de son aventure",
        ],
      },
    ],
  },
  // ── Sprosse 21 (+é) - Frankreich: un été à la ferme ─────────────────────
  {
    slug: "fr-weg-kids-un-ete-a-la-ferme",
    titel: "Un été à la ferme",
    kind: "geschichte",
    lang: "fr",
    stufen: ["kids"],
    minTier: 2,
    topic: "familie",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Marie a passé l'été dans une ferme",
          "Elle a trouvé un petit nid",
          "Elle a nourri les poules tous les matins",
          "Elle a cueilli des fruits",
          "Elle a joué avec un petit veau",
          "Elle a aidé sa tante et son oncle",
          "Elle a écouté sa musique",
          "Elle a dessiné sa ferme et sa maison",
          "Elle a passé un été parfait",
          "Elle a promis de revenir",
          "Elle a raconté son été dans sa classe",
          "Toute la classe a aimé son récit",
        ],
      },
    ],
  },
  // ── Sprosse 21 (+é) - Côte d'Ivoire/Westafrika: un jour de fête ──────────
  {
    slug: "fr-weg-kids-un-jour-de-fete",
    titel: "Un jour de fête",
    kind: "geschichte",
    lang: "fr",
    stufen: ["kids"],
    minTier: 2,
    topic: "feste",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "C'est l'anniversaire d'Adjoa",
          "Adjoa a préparé un repas pour tous",
          "Toute la famille est arrivée",
          "Ses amis sont venus du quartier",
          "Elle a dansé toute la journée",
          "Adama a apporté sa kora",
          "Adama a joué de sa kora",
          "Elle a écouté de la musique avec sa copine",
          "Tout le monde a dansé avec joie",
          "Les enfants ont ri toute la soirée",
          "Adjoa a remercié ses amis",
          "Quelle jolie journée",
        ],
      },
    ],
  },
  // ── Sprosse 22 (+b) - Frankreich: des billes dans une boite ─────────────
  {
    slug: "fr-weg-kids-des-billes-dans-une-boite",
    titel: "Des billes dans une boite",
    kind: "geschichte",
    lang: "fr",
    stufen: ["kids"],
    minTier: 2,
    topic: "spiele",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "David a mis ses billes dans une boite",
          "Ses billes sont belles et rondes",
          "Il a apporté sa boite pour ses amis",
          "Tous ont joué avec les billes",
          "Une bille est tombée sous la table",
          "Il a compté toutes ses billes",
          "Il en manque une",
          "Ils observent la table",
          "Enfin ils la retrouvent",
          "David a retrouvé sa bille sous la table",
          "David sourit tout content",
          "Ils remettent les billes dans la boite",
        ],
      },
    ],
  },
  // ── Sprosse 23 (+g) - Frankreich: le jardin de Gabriel ──────────────────
  {
    slug: "fr-weg-kids-le-jardin-de-gabriel",
    titel: "Le jardin de Gabriel",
    kind: "geschichte",
    lang: "fr",
    stufen: ["kids"],
    minTier: 2,
    topic: "natur",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Gabriel regarde son jardin",
          "Il a planté une graine",
          "Sa graine grandit tous les jours",
          "Il ajoute un peu d'eau tous les jours",
          "Gabriel arrose son jardin tous les matins",
          "Sa plante a vite grandi",
          "Des fleurs poussent autour",
          "Gabriel regarde sa belle plante avec joie",
          "Gabriel est bien fier de son jardin",
          "Il partage ses légumes avec ses voisins",
          "Ses voisins sont ravis du jardin",
          "Gabriel promet de planter encore plus",
        ],
      },
    ],
  },
  // ── Sprosse 24 (+h) - Frankreich: Hugo et son chat ──────────────────────
  {
    slug: "fr-weg-kids-hugo-et-son-chat",
    titel: "Hugo et son chat",
    kind: "geschichte",
    lang: "fr",
    stufen: ["kids"],
    minTier: 2,
    topic: "tiere",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Hugo a un chat qui joue chaque jour",
          "Son chat aime chasser les papillons",
          "Hugo habite avec sa tante et son chat",
          "Chaque matin il joue avec lui",
          "Un jour son chat part au loin",
          "Hugo cherche partout dans la maison",
          "Il trouve son chat sous un lit",
          "Il dort tranquillement",
          "Hugo sourit de soulagement",
          "Il le caresse doucement",
          "Plus tard il lui donne un nouveau jouet",
          "Son chat s'amuse avec toute la soirée",
        ],
      },
    ],
  },
  // ── Sprosse 24 (+h) - Schweiz: Chloé à la montagne ──────────────────────
  {
    slug: "fr-weg-kids-chloe-a-la-montagne",
    titel: "Chloé à la montagne",
    kind: "geschichte",
    lang: "fr",
    stufen: ["kids"],
    minTier: 2,
    topic: "natur",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Chloé habite un chalet dans la montagne",
          "Chaque hiver elle marche dans la neige",
          "Son chien court dans la neige avec elle",
          "Un jour ils grimpent tout en haut",
          "La vue est vraiment magnifique",
          "Le chien remue la queue de joie",
          "Ils redescendent avant la nuit",
          "Hugo vient chaque été avec sa tante",
          "Ils cherchent un endroit pour manger",
          "Chloé partage son chocolat avec Hugo",
          "Ils partagent un chocolat chaud",
          "Chloé et Hugo aiment beaucoup la montagne",
        ],
      },
    ],
  },
];
