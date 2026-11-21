/**
 * Serien nur für Lernweg "fr", frühe Sprossen 17-24 - Altersstufe
 * Jugendliche (11-14, `teens`) - E8b-2, 26.09.2026 (Bauplan
 * `BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md` §6, Befund
 * `BEFUND-2026-09-26-E8B-TEXTE-TEENS.md`).
 *
 * Acht Geschichten mit Anfang, Mitte und Schluss, je EINE Etappe mit 12-14
 * Zeilen (`ETAPPE_MIN_LINES`/`ETAPPE_MAX_LINES`). Jede Serie steht an der
 * Sprosse, deren Zeichensatz ALLE ihre Zeilen trägt (Zeichensatz siehe Kopf
 * von `corpusFrWegFruehTeens.ts`); keine Zeile hat ein Satzzeichen, keine
 * reiht zwei Hauptsätze ohne Bindewort aneinander.
 *
 * Sechs von acht spielen ausserhalb Frankreichs (Bauplan §6.5 Regel 8):
 * Schweiz (Skilager), Senegal (Dakar), Tunesien (Tunis), Mali (Bamako),
 * Belgien (Namur), Québec. Alles eigenes Werk, auf Französisch verfasst.
 */
import type { Serie } from "./serie";

const EIGEN = {
  quelle: "Sensorik",
  lizenz: "Eigenes Werk (selbst verfasst, französisches Original)",
  autor: "Sensorik-Lernplattform",
} as const;

export const SERIEN_FR_WEG_FRUEH_TEENS: Serie[] = [
  // ── Sprosse 17 - Frankreich ──
  {
    slug: "fr-weg-teens-le-tournoi-du-quartier",
    titel: "Le tournoi du quartier",
    kind: "geschichte",
    lang: "fr",
    stufen: ["teens"],
    minTier: 2,
    topic: "sport",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Le tournoi de foot du quartier a lieu samedi",
          "Jules a quatre joueurs",
          "Mais il en faut un de plus",
          "Kadi demande si elle peut jouer",
          "Les autres rient un peu",
          "Kadi ne dit rien et part sur le terrain",
          "Au premier tour elle marque trois fois",
          "Plus personne ne rit",
          "En finale il reste une minute",
          "Jules lui fait une passe parfaite",
          "Elle tire et elle marque",
          "Tout le quartier saute de joie",
          "Maintenant personne ne doute de Kadi",
        ],
      },
    ],
  },
  // ── Sprosse 18 - Schweiz ──
  {
    slug: "fr-weg-teens-le-camp-de-ski",
    titel: "Le camp de ski",
    kind: "geschichte",
    lang: "fr",
    stufen: ["teens"],
    minTier: 2,
    topic: "sport",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "En mars toute la classe part en camp de ski",
          "Le camp est dans les Alpes suisses",
          "Coralie ne sait pas skier",
          "Elle a peur que les autres se moquent",
          "Le premier matin Coralie suit un cours de ski",
          "Son moniteur est patient et marrant",
          "Il lui montre comment freiner",
          "Puis il lui montre comment tourner",
          "Le soir elle a mal partout",
          "Mais elle ne renonce pas",
          "Le dernier jour elle descend la piste du sommet",
          "Ses copains crient son nom",
          "Coralie rit et remonte tout de suite",
        ],
      },
    ],
  },
  // ── Sprosse 19 - Senegal ──
  {
    slug: "fr-weg-teens-le-jus-de-tamarin",
    titel: "Le jus de tamarin",
    kind: "geschichte",
    lang: "fr",
    stufen: ["teens"],
    minTier: 2,
    topic: "verantwortung",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Fatou vit dans un quartier de Dakar",
          "Pendant les vacances sa tante vend du jus de tamarin",
          "Un matin sa tante se sent mal",
          "Fatou propose de tenir le stand",
          "Elle filtre le tamarin avec son cousin",
          "Puis ils remplissent trente petits pots",
          "Au coin de la rue les clients arrivent vite",
          "Le soleil tape fort",
          "Avant midi tout est vendu",
          "Fatou compte les sous",
          "Au retour elle remet toute la caisse",
          "Sa tante sourit et lui offre une partie",
          "Fatou met sa part dans sa tirelire",
        ],
      },
    ],
  },
  // ── Sprosse 20 - Frankreich ──
  {
    slug: "fr-weg-teens-un-samedi-sans-internet",
    titel: "Un samedi sans internet",
    kind: "geschichte",
    lang: "fr",
    stufen: ["teens"],
    minTier: 2,
    topic: "familie",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Samedi matin le routeur de la maison ne fonctionne plus",
          "Personne ne peut venir avant lundi",
          "Nour et Adam tournent en rond dans le salon",
          "Adam propose de sortir mais il pleut",
          "Nour trouve un jeu de cartes dans un placard",
          "La notice est perdue",
          "Ils inventent alors leur propre jeu",
          "Adam tente un coup en douce et Nour le voit tout de suite",
          "Ils rient comme ils n'ont pas ri depuis des mois",
          "Le soir leur maman rentre du travail",
          "Elle s'assoit et apprend leur jeu",
          "Internet revient vers minuit",
          "Mais personne ne veut quitter la partie",
        ],
      },
    ],
  },
  // ── Sprosse 21 - Tunesien ──
  {
    slug: "fr-weg-teens-le-slam-de-salma",
    titel: "Le slam de Salma",
    kind: "geschichte",
    lang: "fr",
    stufen: ["teens"],
    minTier: 2,
    topic: "musik",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Salma vit dans la médina de Tunis",
          "Son école lance un concours de slam",
          "Salma écrit tous les soirs dans son carnet",
          "Elle écrit sur sa ville et sur la mer",
          "Le jour du concours elle a le trac",
          "Ses mains sont moites",
          "Son amie Amira lui dit de respirer",
          "Salma monte sur l'estrade",
          "Elle commence tout doucement",
          "Puis les mots arrivent tout seuls",
          "La salle écoute en silence",
          "Quand elle se tait la salle applaudit",
          "Salma ne remporte pas le concours",
          "Mais le soir elle écrit un nouveau slam",
        ],
      },
    ],
  },
  // ── Sprosse 22 - Mali ──
  {
    slug: "fr-weg-teens-bintou-et-le-basket",
    titel: "Bintou et le basket",
    kind: "geschichte",
    lang: "fr",
    stufen: ["teens"],
    minTier: 2,
    topic: "sport",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Bintou est de Bamako et elle adore le basket",
          "Elle joue dans l'équipe de son quartier",
          "Son objectif est de jouer pour le Mali",
          "Un samedi un entraineur vient voir leur tournoi",
          "Bintou est trop nerveuse et rate ses premiers tirs",
          "Sa capitaine lui dit de rester calme",
          "Bintou se concentre sur le ballon",
          "En fin de partie elle marque trois paniers",
          "Son équipe remporte le tournoi",
          "L'entraineur note son nom dans un carnet",
          "Il invite Bintou au camp de l'équipe nationale",
          "Le lendemain toute la famille est au courant",
          "Son petit cousin veut devenir basketteur lui aussi",
        ],
      },
    ],
  },
  // ── Sprosse 23 - Belgien ──
  {
    slug: "fr-weg-teens-la-vente-de-gaufres",
    titel: "La vente de gaufres",
    kind: "geschichte",
    lang: "fr",
    stufen: ["teens"],
    minTier: 2,
    topic: "schule",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Dans une école de Namur la classe de Gabriel prépare une sortie",
          "Mais il manque de l'argent pour le car",
          "Toute la classe propose une vente de gaufres",
          "Gabriel et Margot font la liste des courses",
          "Le samedi ils cuisent les gaufres dans la cuisine de l'école",
          "La cuisine sent le sucre et la vanille",
          "Le lundi ils vendent tout devant la grille de l'école",
          "Les parents et les profs font la queue",
          "Margot rend la monnaie",
          "Gabriel surveille la caisse",
          "Vers midi il ne reste plus une seule gaufre",
          "Ils ont gagné l'argent du car",
          "En juin toute la classe voit enfin la mer du Nord",
        ],
      },
    ],
  },
  // ── Sprosse 24 - Québec ──
  {
    slug: "fr-weg-teens-une-journee-de-tempete",
    titel: "Une journée de tempête",
    kind: "geschichte",
    lang: "fr",
    stufen: ["teens"],
    minTier: 2,
    topic: "natur",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Ce matin Florence regarde par la vitre",
          "Tout est blanc dans la rue",
          "Il est tombé beaucoup de neige cette nuit",
          "La radio annonce que les écoles sont fermées",
          "Florence réveille son petit cousin Étienne",
          "Ils enfilent leurs habits de neige",
          "Dehors le froid pique les joues",
          "Ils construisent un fort dans la cour",
          "Les voisins sortent aussi avec leurs pelles",
          "Mais Monsieur Gagnon ne peut pas déneiger seul",
          "Florence et Étienne l'aident pendant une heure",
          "Pour les remercier il leur offre du chocolat chaud",
          "Le soir ils dorment comme des marmottes",
        ],
      },
    ],
  },
];
