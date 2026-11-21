/**
 * Serien nur für Lernweg "fr", ab der Punkt-Sprosse bis zum Ende des
 * Lernwegs - Altersstufe Jugendliche (11-14, `teens`) - E9-ende-teens, 26.09.2026
 * (Bauplan `BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md` §6, Befund
 * `BEFUND-2026-09-26-E9-TEENS-ENDE.md`).
 *
 * Acht Geschichten mit Anfang, Mitte und Schluss, je EINE Etappe mit 12-14
 * Zeilen, jetzt mit Satzzeichen und wörtlicher Rede (gerades `"`, Leerzeichen
 * vor `: ; ! ?` in der Form FR/BE/CH). Eine Serie öffnet an der Sprosse ihrer
 * „spätesten" Zeile; vorher erscheinen ihre Zeilen nicht (die Serie als Ganzes
 * ist erst tippbar, wenn jede Zeile passt - Satzzeichen werden bis dahin
 * weggelassen). Kein `œ` (die allgemeinen Serien-Wächter rechnen mit der
 * Tastatur „de").
 *
 * Alles eigenes Werk, auf Französisch verfasst.
 */
import type { Serie } from "./serie";

const EIGEN = {
  quelle: "Sensorik",
  lizenz: "Eigenes Werk (selbst verfasst, französisches Original)",
  autor: "Sensorik-Lernplattform",
} as const;

export const SERIEN_FR_ENDE_TEENS: Serie[] = [
  // ── Québec (Beauce, cabane à sucre) ──
  {
    slug: "fr-weg-teens-le-temps-des-sucres",
    titel: "Le temps des sucres",
    kind: "geschichte",
    lang: "fr",
    stufen: ["teens"],
    minTier: 5,
    topic: "natur",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Au printemps, Félix rejoint son grand-père à la cabane à sucre, en Beauce.",
          "Cette année, Rosalie, sa correspondante belge, découvre l'endroit avec lui.",
          "Dans l'érablière, des centaines de tubes bleus relient les arbres les uns aux autres.",
          "La sève coule lentement vers la cabane, où elle bout dans un grand évaporateur.",
          "\"Il faut environ 40 litres de sève pour obtenir 1 litre de sirop\", explique le grand-père.",
          "Rosalie n'en revient pas : \"Tout ce travail pour une seule bouteille ?\"",
          "Le soir, la cabane se remplit de voisins, de violons et d'odeurs sucrées.",
          "Sur la table, on sert des crêpes et des pommes de terre, le tout arrosé de sirop.",
          "Puis vient le moment préféré de Félix : la tire sur la neige.",
          "On verse le sirop bouillant sur un lit de neige propre, en longues bandes dorées.",
          "Avec un bâtonnet, Rosalie enroule la tire avant qu'elle ne durcisse.",
          "\"C'est encore meilleur que le chocolat belge !\" avoue-t-elle en riant.",
          "Le lendemain, elle envoie à sa famille une photo de ses doigts collés au bâtonnet.",
        ],
      },
    ],
  },
  // ── Belgien (Binche, Karneval) ──
  {
    slug: "fr-weg-teens-les-gilles-de-binche",
    titel: "Les Gilles de Binche",
    kind: "geschichte",
    lang: "fr",
    stufen: ["teens"],
    minTier: 5,
    topic: "feste",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "À Binche, en Belgique, le carnaval dure 3 jours, du dimanche au mardi gras.",
          "Cette année, Arnaud, le grand frère de Maxime, devient Gille à son tour.",
          "Le mardi, dès l'aube, on l'aide à enfiler son costume et ses sabots de bois.",
          "Autour de sa taille, une ceinture de grelots tinte au moindre pas.",
          "Le matin, Arnaud porte un masque de cire, comme tous les Gilles du cortège.",
          "\"Ce masque, c'est pour dire que tout le monde est égal\", explique sa grand-mère.",
          "Dans les rues, les tambours battent sans s'arrêter, et les sabots frappent les pavés.",
          "Arnaud tient à la main un ramon, qu'il agite en dansant.",
          "L'après-midi, il remplace le masque par un immense chapeau de plumes d'autruche.",
          "Puis les Gilles offrent des oranges à la foule, sur la Grand-Place.",
          "\"Attrape !\" crie Arnaud, et une orange atterrit droit dans les mains de Maxime.",
          "Le soir, Maxime a les oreilles qui bourdonnent et les jambes en compote.",
          "\"L'an prochain, je défile avec toi\", promet-il à Arnaud, les yeux brillants.",
        ],
      },
    ],
  },
  // ── Schweiz (Valais, cabane de Moiry) ──
  {
    slug: "fr-weg-teens-la-cabane-au-bord-du-glacier",
    titel: "La cabane au bord du glacier",
    kind: "geschichte",
    lang: "fr",
    stufen: ["teens"],
    minTier: 5,
    topic: "natur",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Au départ du barrage de Moiry, dans le Valais, Noémie resserre les lacets de ses chaussures.",
          "Avec son école de Sion, elle monte ce matin à la cabane de Moiry.",
          "\"Comptez un peu plus de 2 h de marche\", annonce le guide en montrant le sentier.",
          "Timéo, lui, n'a jamais marché aussi haut et regarde souvent son altimètre.",
          "Au-dessus du lac de barrage, le paysage devient gris et blanc.",
          "Soudain, le glacier apparait, immense, entre les sommets pointus.",
          "\"Il a raccourci de plus de 650 m en un peu plus d'un siècle\", explique le guide.",
          "Timéo fronce les sourcils : \"Et quand j'aurai l'âge de mon grand-père, il en restera quoi ?\"",
          "Personne ne répond, mais chacun prend une photo du glacier.",
          "Enfin, la cabane se dresse sur son rocher, à 2 825 m d'altitude.",
          "Dans le dortoir, les élèves étalent leurs sacs de couchage en riant.",
          "À table, on sert une soupe chaude et du fromage à raclette.",
          "La nuit, Noémie sort voir les étoiles : jamais elle n'en a vu autant.",
        ],
      },
    ],
  },
  // ── Senegal (Pikine, Lutte) ──
  {
    slug: "fr-weg-teens-le-bakk-de-modou",
    titel: "Le bàkk de Modou",
    kind: "geschichte",
    lang: "fr",
    stufen: ["teens"],
    minTier: 5,
    topic: "sport",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "À Pikine, au Sénégal, tout le monde parle de la grande finale de lutte.",
          "Modou, lui, rêve de monter un jour dans l'arène.",
          "Après l'école, il s'entraine sur la plage avec les grands du quartier.",
          "Ici, la lutte s'appelle le laamb, et elle se pratique à mains nues, dans le sable.",
          "Pour gagner, il faut faire toucher le sol au dos de son adversaire.",
          "Mais avant le combat, il y a le bàkk : on chante ses exploits en dansant.",
          "Modou, lui, a le trac : il ne sait pas chanter du tout.",
          "\"Invente tes paroles, c'est tout !\" lui conseille sa cousine Ndèye.",
          "Pendant la fête du quartier, les jeunes organisent une compétition amicale.",
          "Modou entre dans le cercle et improvise un bàkk sur les poissons de Yoff.",
          "Le public éclate de rire, et son adversaire aussi.",
          "Modou perd le combat en moins de 2 min.",
          "Mais le lendemain, tout Pikine fredonne le bàkk des poissons.",
        ],
      },
    ],
  },
  // ── Côte d'Ivoire (Abidjan) ──
  {
    slug: "fr-weg-teens-le-defi-coupe-decale",
    titel: "Le défi coupé-décalé",
    kind: "geschichte",
    lang: "fr",
    stufen: ["teens"],
    minTier: 5,
    topic: "musik",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "À Abidjan, Aya et ses amies préparent une chorégraphie pour le spectacle du lycée.",
          "Elles ont choisi un morceau de coupé-décalé, le son préféré de la cour.",
          "Tous les pas doivent tomber pile sur le rythme, sinon tout s'écroule.",
          "Aya filme les répétitions avec la tablette de sa mère.",
          "Sur l'écran, Grâce rate encore le demi-tour, et les autres rigolent.",
          "\"Ce n'est pas grave, on recommence !\" dit Aya en relançant le son.",
          "La veille de la fête, la vidéo est parfaite.",
          "Kévine propose de la publier tout de suite sur les réseaux.",
          "Aya hésite : \"On demande d'abord à chacune si elle est d'accord.\"",
          "Grâce préfère attendre : elle veut garder la surprise pour ses parents.",
          "Le jour J, sous les lampions de la cour, les filles dansent sans une erreur.",
          "Les applaudissements couvrent presque les enceintes.",
          "Le lendemain, avec l'accord de toutes, la vidéo est en ligne.",
        ],
      },
    ],
  },
  // ── Madagaskar (Morondava) ──
  {
    slug: "fr-weg-teens-l-allee-des-baobabs",
    titel: "L'allée des baobabs",
    kind: "geschichte",
    lang: "fr",
    stufen: ["teens"],
    minTier: 5,
    topic: "natur",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Pendant les vacances, Hery et sa cadette Fara quittent Antananarivo pour Morondava.",
          "Le trajet en taxi-brousse semble interminable.",
          "Fara colle son front à la vitre et compte les zébus au bord de la route.",
          "Leur tante Voahangy les attend à la gare routière.",
          "Avant le crépuscule, elle les emmène sur une piste de terre rouge.",
          "Soudain, ils apparaissent : des baobabs immenses, alignés le long de la piste.",
          "\"On dirait des arbres plantés à l'envers !\" s'écrie Fara.",
          "\"Ils mesurent environ 30 m\", explique Voahangy, \"et certains ont plus de huit siècles.\"",
          "Ici, on les appelle renala, la mère de la forêt, en malgache.",
          "Hery apprend qu'il n'en reste qu'une douzaine le long de cette route.",
          "Les feux de brousse et les champs menacent les arbres qui les entourent.",
          "Au coucher du soleil, les troncs deviennent orange, puis violets.",
          "Fara murmure : \"Je veux revenir quand je serai grande, pour voir s'ils sont encore là.\"",
        ],
      },
    ],
  },
  // ── Frankreich (Nantes) ──
  {
    slug: "fr-weg-teens-la-grande-panne",
    titel: "La grande panne",
    kind: "geschichte",
    lang: "fr",
    stufen: ["teens"],
    minTier: 5,
    topic: "verantwortung",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Un mardi de novembre, à 20 h 45, tout le quartier plonge dans le noir, à Nantes.",
          "Plus de wifi, plus de télé, plus de console : Jules croit vivre une catastrophe.",
          "Manon, sa jumelle, allume une bougie et sort une vieille boite de dominos.",
          "\"Des dominos ? Sérieusement ?\" soupire Jules.",
          "Leur mère rit : \"On y jouait déjà quand j'avais votre âge.\"",
          "Au bout d'une heure, Jules a perdu cinq parties et refuse d'abandonner.",
          "Dans l'immeuble d'en face, on voit des lampes de poche danser aux fenêtres.",
          "Le voisin du dessus descend avec une guitare et quelques chansons.",
          "Bientôt, tout l'escalier chante à la lueur des bougies.",
          "Personne ne pense plus à son écran.",
          "À minuit, la lumière revient d'un coup, avec un grand \"Oh !\" déçu.",
          "Jules éteint la télé sans réfléchir et reprend les dominos.",
          "\"Une dernière partie, et je vais gagner\", annonce-t-il.",
        ],
      },
    ],
  },
  // ── Haïti (Jacmel, Karneval) ──
  {
    slug: "fr-weg-teens-les-masques-de-jacmel",
    titel: "Les masques de Jacmel",
    kind: "geschichte",
    lang: "fr",
    stufen: ["teens"],
    minTier: 5,
    topic: "kunst",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "À Jacmel, en Haïti, les ateliers de masques tournent à plein régime avant le carnaval.",
          "Nadège aide son voisin Ricardo, un artisan réputé dans toute la ville.",
          "Le masque se fabrique en papier mâché, couche après couche, sur un moule.",
          "Pour ce masque géant, Ricardo prévoit 3 semaines de travail.",
          "Cette année, ils fabriquent une énorme tête de lion, crinière comprise.",
          "Nadège découpe des bandes de journal et les trempe dans la colle.",
          "\"Doucement, sinon il aura des bosses partout\", rit Ricardo.",
          "Quand le papier sèche, elle peint la crinière en jaune, en rouge et en or.",
          "La nuit, le lion attend dans la cour, sous une bâche.",
          "Le jour du défilé, la rue se remplit de tambours et de couleurs.",
          "Nadège avance sous le masque, un peu aveuglée, en suivant les pas de Ricardo.",
          "Des enfants crient en la voyant, puis tendent la main pour toucher la crinière.",
          "Ce soir-là, Nadège se promet d'ouvrir un jour son propre atelier.",
        ],
      },
    ],
  },
];
