/**
 * Serien nur für Lernweg "fr", Sprossen 25-34 - Altersstufe Erwachsene
 * (15+, `erwachsen`) - E9-erwachsen, 26.09.2026 (Bauplan
 * `BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md` §6, Befund
 * `BEFUND-2026-09-26-E9-ERWACHSEN-MITTE.md`).
 *
 * Acht Texte mit rotem Faden, je EINE Etappe mit 12-13 Zeilen: sechs
 * Geschichten, eine trockene Glosse aus dem Büro und ein Sachtext im Stil von
 * „INSEE Première" (Arbeitsweg, Zahlen aus Insee Première n° 1835, 1948,
 * 1975). Eine Serie öffnet an der Sprosse ihrer „spätesten" Zeile
 * (Zeichensatz siehe Kopf von `corpusFrMitteErwachsen.ts`) - hier an Sprosse
 * 29, 30, 29, 33, 31, 31, 32 und 34. Keine Zeile hat ein Satzzeichen, keine
 * reiht zwei Hauptsätze ohne Bindewort aneinander, keine trägt ein `œ` (die
 * allgemeinen Serien-Wächter rechnen mit der Tastatur „de", die keinen
 * Ersatz für œ kennt).
 *
 * Sechs von acht spielen ausserhalb Frankreichs (Bauplan §6.5 Regel 8):
 * Benin (ein Zémidjan-Fahrer in Cotonou wird Krankenpfleger), Rwanda (ein
 * Samstag Umuganda), Schweiz (eine Grenzgängerin lernt in Genf „natel",
 * „cheni", „poutzer"), Belgien (ein Kot in Lüttich), Québec (der erste Winter
 * eines Senegalesen in Montréal) und Libanon (eine Bäckerei in Beirut
 * während eines Stromausfalls). Sachangaben (Umuganda, Métro de Montréal,
 * Regionalwörter, INSEE) sind im Befund mit Quelle belegt. Alles eigenes
 * Werk, auf Französisch verfasst.
 */
import type { Serie } from "./serie";

const EIGEN = {
  quelle: "Sensorik",
  lizenz: "Eigenes Werk (selbst verfasst, französisches Original)",
  autor: "Sensorik-Lernplattform",
} as const;

export const SERIEN_FR_MITTE_ERWACHSEN: Serie[] = [
  // ── Frankreich ──
  {
    slug: "fr-weg-erwachsen-la-machine-a-cafe",
    titel: "La machine à café",
    kind: "geschichte",
    lang: "fr",
    stufen: ["erwachsen"],
    minTier: 3,
    topic: "arbeit",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Lundi matin la machine à café du bureau tombe en panne",
          "Un petit papier annonce que le technicien passera bientôt",
          "Personne ne sait ce que bientôt veut dire",
          "Dès le matin les premiers collègues errent dans le couloir",
          "La réunion d'équipe commence sans aucun enthousiasme",
          "Bernard propose de faire une collecte pour acheter une cafetière",
          "La comptable refuse car ce n'est pas prévu au budget",
          "Mardi chacun apporte son thermos de chez lui",
          "Le couloir sent le café de six maisons différentes",
          "Mercredi la direction envoie un mail sur la cohésion d'équipe",
          "Jeudi le technicien arrive enfin avec une pièce neuve",
          "Toute l'équipe l'applaudit comme un héros",
          "Vendredi la machine tombe de nouveau en panne",
        ],
      },
    ],
  },
  // ── Frankreich ──
  {
    slug: "fr-weg-erwachsen-aller-au-travail",
    titel: "Aller au travail",
    kind: "wissen-serie",
    lang: "fr",
    stufen: ["erwachsen"],
    minTier: 5,
    topic: "verkehr",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "En France la voiture reste le moyen le plus courant pour aller travailler",
          "Selon l'INSEE près de trois actifs sur quatre s'y rendent en voiture",
          "Les transports en commun arrivent loin derrière",
          "La marche et le vélo ne concernent qu'une petite minorité",
          "Même pour moins de cinq kilomètres la voiture l'emporte encore",
          "Même à moins d'un kilomètre plus d'un actif sur trois prend la voiture",
          "À la campagne c'est le cas de plus de huit actifs sur dix",
          "Dans la région de Paris plus de quatre actifs sur dix prennent les transports en commun",
          "Les transports en commun sont surtout utilisés dans les grandes villes",
          "Pour les habitants des campagnes le trajet médian a augmenté de moitié en vingt ans",
          "Les émissions de gaz à effet de serre de ces trajets varient beaucoup selon les territoires",
          "Le covoiturage et le télétravail offrent d'autres pistes",
        ],
      },
    ],
  },
  // ── Benin ──
  {
    slug: "fr-weg-erwachsen-le-zemidjan-de-rodrigue",
    titel: "Le zémidjan de Rodrigue",
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
          "À Cotonou Rodrigue conduit un zémidjan depuis cinq ans",
          "Chaque matin il attend ses clients au carrefour près du marché",
          "Il connait toutes les rues de la ville sans GPS",
          "Le soir il suit des cours pour devenir infirmier",
          "Ses clients le voient souvent réviser entre les courses",
          "Une vieille dame lui demande pourquoi il étudie autant",
          "Rodrigue explique qu'il veut soigner les gens de son quartier",
          "La dame lui donne le numéro de sa nièce qui travaille à l'hôpital",
          "La nièce l'aide à préparer le concours",
          "Le jour de l'examen Rodrigue gare sa moto devant l'école",
          "Trois semaines plus tard il apprend qu'il a réussi",
          "Il vend son zémidjan à son jeune cousin",
          "Aujourd'hui il soigne des patients dans une clinique de Cotonou",
        ],
      },
    ],
  },
  // ── Rwanda ──
  {
    slug: "fr-weg-erwachsen-un-samedi-d-umuganda",
    titel: "Un samedi d'umuganda",
    kind: "geschichte",
    lang: "fr",
    stufen: ["erwachsen"],
    minTier: 5,
    topic: "gesellschaft",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Au Rwanda le dernier samedi de chaque mois est un jour d'umuganda",
          "Ce samedi Claudine se lève très tôt",
          "De huit heures à onze heures tout le quartier travaille ensemble",
          "Tous les adultes en bonne santé doivent y participer",
          "Cette fois on répare le chemin qui mène à l'école",
          "Claudine porte des pierres avec ses voisines",
          "Son voisin Emmanuel creuse un fossé contre l'érosion",
          "Les plus jeunes ramassent les papiers au bord de la route",
          "À onze heures tout le monde se retrouve sous un grand arbre",
          "Le chef de quartier annonce les projets du mois suivant",
          "Chacun peut proposer une idée ou poser une question",
          "Claudine demande un nouveau point d'eau près de l'école",
          "En rentrant elle trouve que les rues n'ont jamais été aussi propres",
        ],
      },
    ],
  },
  // ── Schweiz ──
  {
    slug: "fr-weg-erwachsen-la-frontaliere",
    titel: "La frontalière",
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
          "Sandrine habite en France mais travaille à Genève",
          "Tous les matins elle traverse la frontière en train",
          "À l'hôpital ses collègues suisses emploient des mots qu'elle ne connait pas",
          "Le premier jour on lui demande son numéro de natel",
          "Elle ne comprend pas et donne son adresse mail",
          "Sa collègue Nathalie rit et lui explique qu'un natel est un portable",
          "Une semaine plus tard on lui dit que son bureau est un vrai cheni",
          "Elle range tout avant de demander ce que cheni veut dire",
          "Le vendredi l'équipe poutze la salle de pause ensemble",
          "Sandrine note chaque nouveau mot dans un petit carnet",
          "À la fin de l'année le carnet compte plus de cinquante mots",
          "Pour son anniversaire ses collègues lui offrent un livre sur le français de Suisse romande",
          "Maintenant c'est elle qui explique les mots suisses aux nouveaux venus",
        ],
      },
    ],
  },
  // ── Belgien ──
  {
    slug: "fr-weg-erwachsen-le-kot-de-maxime",
    titel: "Le kot de Maxime",
    kind: "geschichte",
    lang: "fr",
    stufen: ["erwachsen"],
    minTier: 3,
    topic: "wohnen",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "En septembre Maxime part étudier à l'université de Liège",
          "Ses parents vivent dans un petit village des Ardennes",
          "Il loue un kot dans une maison avec six autres étudiants",
          "Sa chambre est petite mais il aperçoit un jardin depuis la fenêtre",
          "La cuisine et la salle de bain sont communes",
          "Au début personne ne veut s'occuper de la vaisselle",
          "Les étudiants affichent un planning sur la porte du frigo",
          "Maxime découvre qu'il faut acheter son propre papier toilette",
          "Le vendredi soir il rentre chez ses parents avec son linge sale",
          "Son père lui prépare ses plats préférés pour la semaine",
          "Le lundi il repart avec des boites pleines de nourriture",
          "En décembre les examens approchent et le kot devient très calme",
          "Au printemps Maxime sait enfin cuire des pâtes qui ne collent pas",
        ],
      },
    ],
  },
  // ── Québec ──
  {
    slug: "fr-weg-erwachsen-le-premier-hiver-de-mamadou",
    titel: "Le premier hiver de Mamadou",
    kind: "geschichte",
    lang: "fr",
    stufen: ["erwachsen"],
    minTier: 3,
    topic: "alltag",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Mamadou arrive de Dakar à Montréal au mois de novembre",
          "Il trouve un emploi dans un entrepôt de l'est de la ville",
          "Ses collègues lui conseillent de magasiner un bon manteau avant le froid",
          "Il compare les boutiques pendant toute une fin de semaine",
          "En décembre la première tempête de neige paralyse la ville",
          "Mamadou découvre que le métro roule sous la terre sur des pneus",
          "Grâce au métro il arrive au travail sans trop souffrir du froid",
          "Au travail on lui montre où ranger ses bottes pleines de neige",
          "Le soir il appelle sa mère à Dakar par vidéo",
          "Quand il lui dit qu'il fait moins vingt dehors elle éclate de rire",
          "En février il apprend à patiner avec des collègues sur un lac gelé",
          "Il tombe souvent mais il se relève en riant",
          "Au printemps il écrit à sa mère que l'hiver ne lui fait plus peur",
        ],
      },
    ],
  },
  // ── Liban ──
  {
    slug: "fr-weg-erwachsen-le-four-de-wael",
    titel: "Le four de Waël",
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
          "À Beyrouth Waël se lève chaque jour à quatre heures du matin",
          "Il fait cuire des galettes au thym dans un four à bois",
          "Les premiers clients passent avant d'aller au travail",
          "Un chauffeur de taxi prend toujours sa galette au fromage",
          "Une étudiante révise ses cours en attendant sa commande",
          "Waël connait le prénom de presque tous ses habitués",
          "Un matin la coupure d'électricité dure jusqu'à midi",
          "Le four à bois continue de chauffer comme si de rien n'était",
          "Les voisins apportent leurs plats pour les faire cuire chez Waël",
          "La boulangerie sent le pain et les gâteaux dans toute la rue",
          "Le soir Waël compte sa caisse et sourit",
          "Il n'a jamais autant travaillé ni autant ri",
          "Le lendemain il ajoute une pancarte qui dit four ouvert à tous",
        ],
      },
    ],
  },
];
