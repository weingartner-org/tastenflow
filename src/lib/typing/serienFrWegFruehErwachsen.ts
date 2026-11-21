/**
 * Serien nur für Lernweg "fr", frühe Sprossen 19-24 - Altersstufe
 * Erwachsene (15+, `erwachsen`) - E8c, 26.09.2026 (Bauplan
 * `BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md` §6, Befund
 * `BEFUND-2026-09-26-E8C-TEXTE-ERWACHSENE.md`).
 *
 * Acht Texte mit rotem Faden, je EINE Etappe mit 12-14 Zeilen
 * (`ETAPPE_MIN_LINES`/`ETAPPE_MAX_LINES`): fünf Geschichten (Glosse zum
 * Passwort, Lehrzeit in einer Schreinerei, Tontine, Umzugstag, Neujahrssuppe)
 * und drei Sachtexte (Telearbeit im INSEE-Stil, die Sprachen der Schweiz, der
 * Karneval von Binche). Jede Serie steht an der Sprosse, deren Zeichensatz
 * ALLE ihre Zeilen trägt (Zeichensatz siehe Kopf von
 * `corpusFrWegFruehErwachsen.ts`); keine Zeile hat ein Satzzeichen, keine
 * reiht zwei Hauptsätze ohne Bindewort aneinander.
 *
 * Sechs von acht spielen ausserhalb Frankreichs (Bauplan §6.5 Regel 8):
 * Marokko (Tétouan), Senegal (Dakar), Québec (Montréal), Haïti (Jacmel),
 * Schweiz, Belgien (Binche). Kein „septante", auch nicht in der belgischen
 * Serie (Bauplan §6.5 Regel 4 - bis 26.09.2026 stand es dort, Prüfbericht
 * M3). Alles eigenes Werk, auf Französisch verfasst.
 */
import type { Serie } from "./serie";

const EIGEN = {
  quelle: "Sensorik",
  lizenz: "Eigenes Werk (selbst verfasst, französisches Original)",
  autor: "Sensorik-Lernplattform",
} as const;

export const SERIEN_FR_WEG_FRUEH_ERWACHSEN: Serie[] = [
  // ── Sprosse 19 - Frankreich ──
  {
    slug: "fr-weg-erwachsen-le-mot-de-passe",
    titel: "Le mot de passe",
    kind: "geschichte",
    lang: "fr",
    stufen: ["erwachsen"],
    minTier: 2,
    topic: "alltag",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Pour se connecter le site demande un mot de passe",
          "Marc tape le nom de sa fille",
          "Le site refuse ce mot de passe trop simple",
          "Il faut au moins une majuscule",
          "Marc met une majuscule au nom de sa fille",
          "Le site veut aussi un tiret",
          "Marc ajoute un tiret",
          "Le site trouve le mot de passe trop court",
          "Marc ajoute le nom de sa rue",
          "Le site accepte enfin le mot de passe",
          "Marc respire et ferme son ordinateur",
          "Le lendemain le site lui demande son mot de passe",
          "Marc ne se souvient plus de rien",
          "Il demande un nouveau mot de passe",
        ],
      },
    ],
  },
  // ── Sprosse 21 - Marokko ──
  {
    slug: "fr-weg-erwachsen-l-apprenti-de-tetouan",
    titel: "L'apprenti de Tétouan",
    kind: "geschichte",
    lang: "fr",
    stufen: ["erwachsen"],
    minTier: 2,
    topic: "arbeit",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Soufiane a fini ses études en juin",
          "Il devient apprenti dans un atelier de menuiserie",
          "L'atelier se trouve dans un ancien quartier de Tétouan",
          "Son maitre s'appelle Monsieur Alami",
          "Les premiers jours Soufiane ramasse la sciure",
          "Il apprend le nom de tous les outils",
          "Puis Monsieur Alami lui montre comment poncer une latte de pin",
          "Un jour Soufiane coupe une latte trop courte",
          "Il a peur de se faire disputer",
          "Monsieur Alami sourit et lui dit que tout le monde se trompe",
          "Le soir Soufiane reste pour s'entrainer",
          "Un an plus tard il construit seul une petite armoire",
          "Sa famille la met au milieu du salon",
          "Et Monsieur Alami lui confie son premier client",
        ],
      },
    ],
  },
  // ── Sprosse 21 - Frankreich ──
  {
    slug: "fr-weg-erwachsen-le-teletravail",
    titel: "Le télétravail",
    kind: "wissen-serie",
    lang: "fr",
    stufen: ["erwachsen"],
    minTier: 2,
    topic: "arbeit",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Depuis la crise sanitaire le télétravail s'est installé",
          "En France environ un salarié sur cinq télétravaille au moins une fois par mois",
          "Plus de la moitié des cadres télétravaille",
          "Il reste rare pour les ouvriers",
          "Le télétravail réduit le temps de trajet",
          "Il permet aussi de concilier plus facilement travail et vie de famille",
          "Mais certains salariés se sentent isolés",
          "Le lien avec l'équipe peut se distendre",
          "Les entreprises tentent de trouver le juste milieu",
          "La plupart demandent des jours de présence sur place",
          "Dans certaines entreprises personne n'a plus de poste attitré",
          "Certaines familles quittent les métropoles",
          "De petites villes reliées par le train attirent de jeunes actifs",
        ],
      },
    ],
  },
  // ── Sprosse 22 - Senegal ──
  {
    slug: "fr-weg-erwachsen-la-tontine",
    titel: "La tontine",
    kind: "geschichte",
    lang: "fr",
    stufen: ["erwachsen"],
    minTier: 2,
    topic: "geld",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Astou vend du jus de bissap devant une école de Dakar",
          "Elle voudrait ouvrir une petite boutique",
          "Mais la banque refuse de lui accorder un crédit",
          "Sa voisine lui parle de la tontine des femmes du quartier",
          "Elles versent toutes une petite somme en commun",
          "Une fois par mois l'une d'elles emporte toute la caisse",
          "Astou entre dans la tontine en janvier",
          "Elle verse sa part sans jamais manquer",
          "En aout c'est enfin son tour",
          "Avec la caisse elle loue un petit local",
          "Elle ouvre sa boutique au bout de la rue",
          "Les clientes arrivent vite",
          "Astou reste dans la tontine pour aider les autres",
        ],
      },
    ],
  },
  // ── Sprosse 23 - Québec ──
  {
    slug: "fr-weg-erwachsen-le-premier-juillet",
    titel: "Le premier juillet",
    kind: "geschichte",
    lang: "fr",
    stufen: ["erwachsen"],
    minTier: 2,
    topic: "wohnen",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Au Québec le premier juillet est le jour des déménagements",
          "Josée et Sébastien quittent leur petit logement de Montréal",
          "Leur nouvel appartement est dans le quartier Rosemont",
          "Toute la ville semble en mouvement ce matin",
          "Les camions bloquent les rues",
          "Les amis arrivent avec du café et des beignes",
          "On descend le divan par l'escalier",
          "Le frigo ne passe pas la porte",
          "Il faut enlever la porte du frigo",
          "Vers midi tout le monde a faim",
          "Sébastien commande des poutines pour toute l'équipe",
          "Le soir les boites sont partout dans le salon",
          "Ils dorment sur un matelas au milieu des boites",
        ],
      },
    ],
  },
  // ── Sprosse 23 - Haïti ──
  {
    slug: "fr-weg-erwachsen-la-soupe-joumou",
    titel: "La soupe joumou",
    kind: "geschichte",
    lang: "fr",
    stufen: ["erwachsen"],
    minTier: 2,
    topic: "feste",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Le premier janvier Mirlande se réveille avant le soleil",
          "Dans sa famille de Jacmel ce jour compte beaucoup",
          "C'est le jour de l'indépendance",
          "Pour l'occasion on mange la soupe joumou",
          "Sa tante Rose coupe le giraumon",
          "Mirlande prépare les carottes et les navets",
          "La viande cuit doucement dans la grande marmite",
          "Toute la maison sent la soupe",
          "En fin de matinée les cousins arrivent du village",
          "Ils apportent du pain et des fruits",
          "On partage la soupe dans de grands bols",
          "Tante Rose raconte l'origine de cette soupe",
          "Autrefois seuls les colons avaient le droit d'en manger",
          "Depuis l'indépendance tout le monde la partage",
        ],
      },
    ],
  },
  // ── Sprosse 24 - Schweiz ──
  {
    slug: "fr-weg-erwachsen-quatre-langues",
    titel: "Quatre langues",
    kind: "wissen-serie",
    lang: "fr",
    stufen: ["erwachsen"],
    minTier: 2,
    topic: "sprache",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "La Suisse compte quatre langues nationales",
          "L'allemand est la langue la plus parlée",
          "La Suisse romande est la partie francophone du territoire",
          "L'italien se parle au Tessin",
          "Le romanche se parle dans les Grisons",
          "Le romanche compte peu de locuteurs",
          "Les billets de banque sont imprimés dans les quatre langues",
          "Beaucoup de Suisses parlent plus d'une langue",
          "Au bureau on change parfois de langue en pleine réunion",
          "Les enfants apprennent une autre langue nationale",
          "Bienne est une ville bilingue",
          "La signalisation de Bienne est bilingue",
          "Fribourg est aussi une ville bilingue",
        ],
      },
    ],
  },
  // ── Sprosse 24 - Belgien ──
  {
    slug: "fr-weg-erwachsen-le-carnaval-de-binche",
    titel: "Le carnaval de Binche",
    kind: "wissen-serie",
    lang: "fr",
    stufen: ["erwachsen"],
    minTier: 2,
    topic: "feste",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Chaque année le carnaval de Binche attire une grande foule",
          "Binche est une petite ville de Belgique",
          "Le carnaval dure trois jours et finit le Mardi gras",
          "Les vedettes du carnaval sont les Gilles",
          "Ils dansent en sabots au son des tambours",
          "Leur ceinture est couverte de grelots",
          "Le matin du Mardi gras ils portent un masque de cire",
          "Plus tard ils mettent un grand chapeau de plumes",
          "Puis ils lancent des oranges dans la foule",
          "On ne renvoie jamais une orange",
          "Lucien est retraité et il danse encore avec les Gilles",
          "L'UNESCO a inscrit ce carnaval sur sa liste du patrimoine culturel",
          "Pour les Binchois le carnaval est l'affaire de toute l'année",
        ],
      },
    ],
  },
];
