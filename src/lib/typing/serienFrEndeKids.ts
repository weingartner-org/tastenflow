/**
 * Serien nur für Lernweg "fr", ab der Punkt-Sprosse bis zum Ende des
 * Lernwegs - Altersstufe Kinder (7-10, `kids`) - E9-ende-kids, 26.09.2026
 * (Bauplan `BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md` §6, Befund
 * `BEFUND-2026-09-26-E9-KIDS-ENDE.md`).
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

export const SERIEN_FR_ENDE_KIDS: Serie[] = [
  // ── Belgien (Brüssel, Comic-Wandbilder) ──
  {
    slug: "fr-weg-kids-les-murs-de-bruxelles",
    titel: "Les murs de Bruxelles",
    kind: "geschichte",
    lang: "fr",
    stufen: ["kids"],
    minTier: 4,
    topic: "kunst",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Pendant les vacances, Florence visite Bruxelles avec son oncle Olivier.",
          "\"Ici, les héros de bande dessinée vivent sur les murs !\" annonce-t-il.",
          "Sur une façade, un personnage géant regarde les passants.",
          "Un peu plus loin, une fusée orange semble décoller du toit.",
          "Florence coche les fresques une à une sur sa carte.",
          "\"Combien en as-tu trouvé ?\" lui lance Olivier.",
          "\"Déjà une douzaine !\" répond-elle, très fière.",
          "Devant une fresque, elle s'arrête longtemps.",
          "On y voit une jeune fille qui vole au-dessus des toits, accrochée à un parapluie.",
          "\"C'est ma préférée : elle me ressemble un peu !\" rit Florence.",
          "Le soir, à l'hôtel, elle sort ses crayons de couleur.",
          "Elle dessine sa propre fresque : un zèbre sur une planche à roulettes.",
          "\"Plus tard, peut-être, on la verra sur un mur de Bruxelles\", murmure-t-elle.",
        ],
      },
    ],
  },
  // ── Schweiz (Charmey, Kanton Freiburg) ──
  {
    slug: "fr-weg-kids-la-desalpe",
    titel: "La désalpe",
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
          "À la fin de septembre, les vaches redescendent de la montagne : c'est la désalpe.",
          "Ce samedi, Gabriel et Léonie, sa cadette, attendent au bord de la route, à Charmey.",
          "On entend les cloches bien avant de voir le troupeau.",
          "\"Les voilà !\" s'écrie Gabriel en montrant le virage.",
          "La première vache a une énorme couronne de fleurs sur la tête.",
          "Derrière elle, les armaillis marchent en veste bleue brodée.",
          "\"Pourquoi ces vaches sont-elles décorées ?\" s'étonne Léonie.",
          "Leur mamie explique : \"Pour fêter un bel été sans accident, là-haut sur les alpages.\"",
          "Tout l'été, le troupeau a brouté l'herbe des hauts pâturages.",
          "Là-haut, avec leur lait, on a fabriqué du fromage.",
          "Au village, on vend des meringues et de la crème double.",
          "Gabriel goute à tout ; Léonie préfère caresser les veaux.",
          "\"Vivement l'an prochain !\" disent-ils en rentrant à la maison.",
        ],
      },
    ],
  },
  // ── Madagaskar ──
  {
    slug: "fr-weg-kids-le-lemurien-gourmand",
    titel: "Le lémurien gourmand",
    kind: "geschichte",
    lang: "fr",
    stufen: ["kids"],
    minTier: 4,
    topic: "tiere",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Sur l'ile de Madagascar vivent des animaux qu'on ne voit dans aucun autre pays.",
          "Parmi eux, il y a les lémuriens, avec leurs grands yeux ronds.",
          "Hery et sa tante Voahirana visitent la forêt d'Andasibe avec un guide.",
          "Soudain, un cri puissant résonne entre les arbres.",
          "\"C'est l'indri, le plus imposant des lémuriens !\" explique le guide.",
          "Plus loin, une bande de lémuriens bruns saute de branche en branche.",
          "L'un d'eux descend jusqu'au sentier et s'approche de Hery.",
          "Hery sort une banane de son sac à dos.",
          "Hop ! Le lémurien l'attrape et remonte au-dessus du sentier.",
          "\"Il m'a volé mon gouter !\" s'écrie Hery, moitié fâché, moitié ravi.",
          "Le guide sourit : \"Ici, on ne donne rien aux animaux ; ils trouvent tout dans la forêt.\"",
          "Hery range son sac et promet d'être plus prudent.",
          "Sur le chemin du retour, il imite le cri de l'indri, et sa tante éclate de rire.",
        ],
      },
    ],
  },
  // ── Kanada (Québec, Sherbrooke) ──
  {
    slug: "fr-weg-kids-tempete-de-neige-a-sherbrooke",
    titel: "Tempête de neige à Sherbrooke",
    kind: "geschichte",
    lang: "fr",
    stufen: ["kids"],
    minTier: 5,
    topic: "winter",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "À 6 h, la radio annonce une tempête de neige sur Sherbrooke.",
          "\"Les cours sont annulés !\" crie Émilie en sautant de joie.",
          "Dehors, plus de 40 cm sont tombés cette nuit.",
          "Le thermomètre indique -20 degrés.",
          "Émilie enfile sa tuque, ses mitaines et son habit de neige.",
          "Avec son voisin Samuel, elle bâtit un fort avec des blocs bien tassés.",
          "Ils creusent un tunnel et une fenêtre ronde.",
          "Vers 11 h, le chasse-neige passe dans la rue en grondant.",
          "\"Attention, il va boucher notre entrée !\" s'inquiète Samuel.",
          "Trop tard : une montagne blanche recouvre le fort !",
          "Les enfants rient et recommencent un peu plus loin.",
          "À midi, la mère d'Émilie leur sert un chocolat chaud avec des guimauves.",
          "\"C'est la plus belle journée de l'hiver !\" déclare Émilie.",
        ],
      },
    ],
  },
  // ── Frankreich (Paris) ──
  {
    slug: "fr-weg-kids-toto-au-zoo",
    titel: "Toto au zoo",
    kind: "geschichte",
    lang: "fr",
    stufen: ["kids"],
    minTier: 4,
    topic: "schule",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Aujourd'hui, la classe de Toto visite le zoo de Vincennes.",
          "Devant l'enclos des girafes, la maitresse pose une question.",
          "\"Qui sait pourquoi la girafe a un si long cou ?\" demande-t-elle.",
          "Toto lève le doigt très haut.",
          "\"Parce que sa tête est trop loin de ses pieds !\" répond-il.",
          "Tout le groupe se tord de rire.",
          "Ensuite, le groupe s'arrête devant le bassin des manchots.",
          "\"Pourquoi ne volent-ils pas ?\" s'interroge Chloé.",
          "Le farceur a encore une idée : \"Ils ont oublié leur billet d'avion !\"",
          "Cette fois, même la maitresse sourit.",
          "Au moment de repartir, notre farceur a l'air triste.",
          "\"Qu'y a-t-il ?\" lui chuchote son ami Nassim.",
          "\"Je voulais rester avec les singes : eux, au moins, ils ont le droit de grimper partout !\"",
        ],
      },
    ],
  },
  // ── Experiment ──
  {
    slug: "fr-weg-kids-une-lampe-a-lave",
    titel: "Une lampe à lave maison",
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
          "Voici une expérience à réaliser avec un adulte.",
          "Prépare un verre transparent, de l'huile, du colorant et du sel.",
          "Verse de l'eau dans le verre jusqu'à 1/2 de sa hauteur.",
          "Ajoute 5 gouttes de colorant alimentaire bleu.",
          "Verse doucement de l'huile par-dessus, sur 3 cm d'épaisseur.",
          "Observe : l'huile reste en haut, car elle est plus légère.",
          "Maintenant, saupoudre 1 cuillère de sel sur l'huile.",
          "Attends quelques secondes et regarde attentivement !",
          "Des bulles d'huile descendent, puis remontent comme de la lave.",
          "Le sel entraine l'huile vers le fond.",
          "Quand le sel fond dans l'eau, l'huile est libérée et remonte.",
          "Tu peux rajouter du sel pour recommencer le spectacle.",
          "À la fin, range tout avec l'aide d'un adulte.",
        ],
      },
    ],
  },
  // ── Marokko (Marrakesch) ──
  {
    slug: "fr-weg-kids-au-souk-de-marrakech",
    titel: "Au souk de Marrakech",
    kind: "geschichte",
    lang: "fr",
    stufen: ["kids"],
    minTier: 5,
    topic: "reise",
    nurWeg: "fr",
    herkunft: EIGEN,
    etappen: [
      {
        lines: [
          "Pendant les vacances de printemps, Yasmine visite Marrakech avec ses parents.",
          "Au souk, les ruelles sont pleines de couleurs et d'odeurs.",
          "On y vend des épices, des lanternes, des tapis et des babouches.",
          "Yasmine s'arrête devant des babouches jaunes brodées d'or.",
          "\"Combien coutent-elles ?\" demande-t-elle au marchand.",
          "\"Pour toi, 120 dirhams\", répond-il en souriant.",
          "Son père lui a expliqué qu'ici, on discute le prix.",
          "\"Et pour 80 dirhams ?\" propose Yasmine, un peu timide.",
          "Le marchand se gratte le menton : \"Disons 100, et je t'offre un porte-clé !\"",
          "C'est d'accord ! Yasmine tend 100 dirhams au marchand.",
          "Le soir, sur la place Jemaa el-Fna, des musiciens jouent du tambour.",
          "Yasmine danse avec ses babouches neuves aux pieds.",
          "\"C'est mon plus beau souvenir de Marrakech !\" dit-elle.",
        ],
      },
    ],
  },
  // ── Kanada (Acadie, Caraquet) ──
  {
    slug: "fr-weg-kids-le-tintamarre",
    titel: "Le Tintamarre",
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
          "Le 15 aout, c'est la grande journée des Acadiens.",
          "À Caraquet, au Nouveau-Brunswick, tout le monde se prépare au Tintamarre.",
          "Le drapeau acadien est bleu, blanc et rouge, avec une étoile dorée.",
          "Sophie peint son visage aux couleurs du drapeau.",
          "Son grand-papa lui prête une vieille casserole et une cuillère en bois.",
          "\"À quoi ça sert ?\" s'étonne Sophie.",
          "\"Tu vas voir : aujourd'hui, le bruit est permis !\" rit-il.",
          "À 17 h 55, toute la ville sort dans les rues.",
          "On tape sur des casseroles, on souffle dans des trompettes, on chante.",
          "Le vacarme dure un bon moment.",
          "\"Ce bruit veut dire : nous sommes toujours là !\" explique Grand-papa.",
          "Sophie tape si énergiquement sur sa casserole qu'une bosse apparait.",
          "Épuisée, elle s'endort en souriant.",
        ],
      },
    ],
  },
];
