/**
 * Serien nur für Lernweg "fr", Sprossen 25-34 - Altersstufe Jugendliche
 * (11-14, `teens`) - E9-teens, 26.09.2026 (Bauplan
 * `BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md` §6, Befund
 * `BEFUND-2026-09-26-E9-TEENS-MITTE.md`).
 *
 * Acht Geschichten mit Anfang, Mitte und Schluss, je EINE Etappe mit 13
 * Zeilen. Eine Serie öffnet an der Sprosse ihrer „spätesten" Zeile
 * (Zeichensatz siehe Kopf von `corpusFrMitteTeens.ts`) - hier je eine an
 * Sprosse 25, 26, 28, 29, 30, 31, 32 und 33. Keine Zeile hat ein
 * Satzzeichen, keine reiht zwei Hauptsätze ohne Bindewort aneinander, keine
 * trägt ein `œ` (die allgemeinen Serien-Wächter rechnen mit der Tastatur „de",
 * die keinen Ersatz für œ kennt).
 *
 * Sechs von acht spielen ausserhalb Frankreichs (Bauplan §6.5 Regel 8):
 * Schweiz (Austausch mit Lausanne, Fondue), Belgien (Zero Waste in einer
 * Brüsseler Kantine), Québec (Hockey cosom an der Polyvalente in Sherbrooke),
 * Senegal (Schulradio in Dakar), Marokko (Klingelton im Unterricht in
 * Casablanca) und Benin (Wax-Stand auf dem Dantokpa-Markt in Cotonou). Dazu
 * eine Geschichte über ein Video, das ohne Erlaubnis geteilt wird, und ein
 * Experiment im Imperativ (Wasserrakete; Vorbild nur die Gattung der Petits
 * Débrouillards). Alles eigenes Werk, auf Französisch verfasst.
 */
import type { Serie } from "./serie";

const EIGEN = {
  quelle: "Sensorik",
  lizenz: "Eigenes Werk (selbst verfasst, französisches Original)",
  autor: "Sensorik-Lernplattform",
} as const;

export const SERIEN_FR_MITTE_TEENS: Serie[] = [
  // ── Frankreich ──
  {
    slug: "fr-weg-teens-la-video-du-chat",
    titel: "La vidéo du chat",
    kind: "geschichte",
    lang: "fr",
    stufen: ["teens"],
    minTier: 3,
    topic: "verantwortung",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Samedi Léa filme son chat qui essaie d'attraper une mouche",
          "Le chat saute sur la table et renverse un grand bol de lait",
          "Léa rit tellement qu'elle a du mal à tenir son portable",
          "Elle envoie la vidéo à sa copine Manon",
          "Manon la partage à son tour dans le groupe de la classe",
          "Le lundi matin tout le monde parle du chat au lait",
          "Certains ont mis la vidéo sur internet sans demander à Léa",
          "Le soir la vidéo compte déjà mille vues",
          "Léa n'est pas contente car on voit aussi sa chambre et son visage",
          "Elle demande à tout le monde de retirer la vidéo",
          "La prof principale en parle en classe le lendemain",
          "On apprend qu'il faut toujours demander l'accord avant de publier une image",
          "Depuis ce jour Léa garde ses vidéos de chat pour sa famille",
        ],
      },
    ],
  },
  // ── Schweiz ──
  {
    slug: "fr-weg-teens-le-correspondant-de-lausanne",
    titel: "Le correspondant de Lausanne",
    kind: "geschichte",
    lang: "fr",
    stufen: ["teens"],
    minTier: 3,
    topic: "schule",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Cette année notre classe fait un échange avec une classe de Lausanne",
          "Mon correspondant s'appelle Noah et il adore le foot",
          "Au début on s'envoie des messages une fois par semaine",
          "En mai c'est notre tour de partir en Suisse",
          "Le trajet en train dure plus de quatre heures",
          "Noah et ses parents nous attendent sur le quai de la gare",
          "Le premier soir ses parents nous préparent une fondue",
          "Je fais tomber mon pain dans le caquelon",
          "Selon la tradition je dois chanter une chanson devant toute la table",
          "Tout le monde rit mais personne ne se moque de moi",
          "Le lendemain on fait du bateau sur le lac Léman",
          "Au retour Noah me donne une boite de chocolats",
          "J'ai hâte de l'accueillir à mon tour en juin",
        ],
      },
    ],
  },
  // ── Experiment ──
  {
    slug: "fr-weg-teens-la-fusee-a-eau",
    titel: "La fusée à eau",
    kind: "wissen-serie",
    lang: "fr",
    stufen: ["teens"],
    minTier: 3,
    topic: "wissenschaft",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Pour construire une fusée à eau il te faut une bouteille en plastique vide",
          "Prends aussi un bouchon de liège et une pompe à vélo",
          "Demande à un adulte de percer un trou dans le bouchon",
          "Enfonce l'aiguille de la pompe dans le trou du bouchon",
          "Colle quatre ailerons en carton autour de la bouteille",
          "Remplis la bouteille d'eau jusqu'au tiers",
          "Ferme bien la bouteille avec le bouchon",
          "Pose la fusée à l'envers sur un support au milieu d'un grand terrain",
          "Recule de deux mètres et pompe doucement",
          "La pression de l'air monte dans la bouteille",
          "D'un coup le bouchon saute et la fusée décolle",
          "L'eau part vers le bas et pousse la fusée vers le haut",
          "Recommence avec plus ou moins d'eau et compare les vols",
        ],
      },
    ],
  },
  // ── Belgien ──
  {
    slug: "fr-weg-teens-zero-dechet-a-la-cantine",
    titel: "Zéro déchet à la cantine",
    kind: "geschichte",
    lang: "fr",
    stufen: ["teens"],
    minTier: 3,
    topic: "natur",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Dans notre école à Bruxelles la cantine jette beaucoup de nourriture",
          "Notre classe décide de peser les restes pendant une semaine",
          "Le premier jour on trouve douze kilos de restes",
          "Ce chiffre nous choque vraiment",
          "On propose nos idées au conseil de l'école",
          "Les portions deviennent plus petites mais on peut se resservir",
          "Le pain en trop sert à faire du pudding le lendemain",
          "Les épluchures partent au compost du jardin de l'école",
          "Les bouteilles en plastique sont remplacées par des gourdes",
          "Un mois plus tard il ne reste que trois kilos par jour",
          "Le directeur nous félicite devant toute l'école",
          "Notre projet est même cité dans un journal de Bruxelles",
          "Maintenant d'autres écoles veulent faire comme nous",
        ],
      },
    ],
  },
  // ── Québec ──
  {
    slug: "fr-weg-teens-le-tournoi-de-hockey-cosom",
    titel: "Le tournoi de hockey cosom",
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
          "À Sherbrooke l'hiver est long et on joue au hockey partout",
          "Mais à la polyvalente on joue surtout au hockey cosom dans le gymnase",
          "Le hockey cosom se joue avec une balle et des bâtons en plastique",
          "Florence est la gardienne de notre équipe",
          "Cette année on s'inscrit au grand tournoi de la région",
          "Au premier match on perd sept à un",
          "Personne ne veut plus parler du tournoi dans l'autobus",
          "Le coach nous montre une vidéo de nos erreurs",
          "On s'entraine tous les midis pendant deux semaines",
          "Au deuxième tournoi Florence arrête presque tous les tirs",
          "En finale le score est de trois à trois",
          "Olivier marque le but gagnant à la dernière seconde",
          "Toute l'équipe saute sur Florence pour la remercier",
        ],
      },
    ],
  },
  // ── Senegal ──
  {
    slug: "fr-weg-teens-la-radio-du-college",
    titel: "La radio du collège",
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
          "Au collège de Khadija à Dakar il n'y a pas de radio",
          "Khadija et son ami Ousmane veulent en créer une",
          "Ils demandent la permission au principal qui accepte",
          "Un professeur de physique leur prête un vieux micro",
          "Le premier jour ils annoncent les résultats du match de basket",
          "Puis ils passent de la musique pendant la récréation",
          "Ousmane présente les nouvelles du collège avec beaucoup d'humour",
          "Khadija interroge les élèves sur leurs rêves",
          "Un garçon de sixième raconte qu'il veut devenir astronaute",
          "Tout le monde trouve ça génial",
          "Bientôt même les professeurs demandent leur chanson préférée",
          "Chaque midi toute la cour écoute l'émission",
          "À la fin de l'année Khadija et Ousmane forment deux nouveaux animateurs",
        ],
      },
    ],
  },
  // ── Marokko ──
  {
    slug: "fr-weg-teens-la-sonnerie-mystere",
    titel: "La sonnerie mystère",
    kind: "geschichte",
    lang: "fr",
    stufen: ["teens"],
    minTier: 3,
    topic: "schule",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Au collège de Yassine à Casablanca les portables restent dans les sacs",
          "Pendant le contrôle de maths une sonnerie retentit dans la classe",
          "La prof veut savoir d'où vient ce bruit",
          "Tout le monde regarde son voisin mais personne ne bouge",
          "La sonnerie recommence encore plus fort",
          "Yassine fouille son sac pour vérifier que ce n'est pas le sien",
          "Les élèves cherchent partout où l'appareil peut bien se cacher",
          "Soudain la prof devient toute rouge",
          "Elle sort de sa veste son propre téléphone qui sonne toujours",
          "C'est sa mère qui l'appelle pour lui souhaiter un bon anniversaire",
          "Tous les élèves rient et chantent joyeux anniversaire",
          "La prof rit aussi et donne dix minutes de plus pour le contrôle",
          "Depuis ce jour elle met son téléphone en mode avion",
        ],
      },
    ],
  },
  // ── Benin ──
  {
    slug: "fr-weg-teens-le-stand-de-tante-afi",
    titel: "Le stand de Tante Afi",
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
          "Pendant les vacances Sènami aide sa tante au grand marché de Dantokpa",
          "Tante Afi vend des tissus wax de toutes les couleurs",
          "Chaque matin elles installent le stand avant six heures",
          "Sènami apprend à plier les pagnes avec soin",
          "Elle apprend aussi à rendre la monnaie sans calculatrice",
          "Un jour une cliente demande un tissu avec des motifs de poissons",
          "Il n'en reste plus un seul sur le stand",
          "Sènami a une idée et prend une photo des autres motifs",
          "Elle crée une petite page web pour montrer tous les tissus",
          "La cliente choisit son tissu directement sur le téléphone de Sènami",
          "Bientôt des clients de Lomé et d'Abidjan passent commande",
          "Tante Afi est fière de sa nièce",
          "À la rentrée Sènami continue à gérer la page le soir après ses devoirs",
        ],
      },
    ],
  },
];
