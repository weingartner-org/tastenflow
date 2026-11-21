/**
 * ★★★ DER ABZEICHEN-KATALOG FRANZÖSISCH (E11a-5, 26.09.2026).
 *
 * Gegenstück zu `badgesEn.ts` - dieselbe Bauart, dieselben Schlüssel, aber
 * NEU AUF FRANZÖSISCH GESCHRIEBEN, nicht übersetzt (Bauplan französischer
 * Lehrgang §6.2/§9.1): Übersetzt ist die IDEE des Namens, nicht das Wort. Wo
 * das Französische eine eigene Redewendung zum Motiv hat, steht sie da
 * („Blanc comme neige" zur weissen Taube, „Solide comme un roc", „Oiseau de
 * nuit" zur Eule, „Pêche miraculeuse" zum Fisch, „Propre comme un sou neuf"
 * zur Seife, „Rat de bibliothèque" zum Bücherstapel); sonst ein Stabreim wie
 * im Deutschen („Manchot minutieux", „Lapin leste").
 *
 * Grossschreibung wie im Französischen üblich: nur das erste Wort und
 * Eigennamen. Die trockenen Zweitnamen (`nameNeutral`, ab 11 Jahren) genau
 * dort, wo das Deutsche einen hat - trocken und kurz.
 *
 * Glossar §9.2: « badges », Runde ⇒ « série » (wie auf dem Regal,
 * `BadgeShelf.tsx`), Anschlag ⇒ « frappe », Treffsicherheit ⇒ « précision »,
 * Fehler ⇒ « erreur (de frappe) », nie « faute »; Grundstellung ⇒ « position
 * de départ », Grundreihe ⇒ « rangée de base »; Etappe (Geschichte) ⇒
 * « étape »; Eisschollen-Spiel ⇒ « jeu de la banquise » (wie die Hilfe);
 * Stufe am Punktering ⇒ « niveau » sur « l'anneau de points ». Zahlen mit
 * gewöhnlichem Leerzeichen als Tausender-Trenner („1 000", Bauplan §9.1) und
 * „95 %" mit Leerzeichen. Die Beschreibungen ohne Anrede, wie im Deutschen.
 *
 * ⚠️ Die Tempo-Abzeichen nennen im Deutschen einen Lehrplan (Bayern,
 * Österreich) oder die Wettbewerbsnorm - das trägt für ein Kind in Frankreich,
 * Belgien, der Schweiz oder Québec nichts. Die französische Beschreibung nennt
 * darum nur die Bedingung selbst; erfunden wird kein Bezug.
 *
 * `bildbeschreibung`: das Motiv in Worten für die Sprachausgabe. Metall und
 * Band setzt `medaillenBeschreibung` in `BadgeMedal.tsx` davor.
 *
 * ⚠️ Wer ein Abzeichen anlegt, trägt es HIER mit ein - der Wächter
 * `tests/tastenflow-franzoesisch-statistik-abzeichen.test.tsx` prüft, dass
 * jede ID einen französischen Eintrag hat und einen Zweitnamen genau dort,
 * wo es ihn im Deutschen gibt.
 */
import { lernwegDef } from "./lernweg";
import { lektionenFuer } from "./curriculum";
import type { AbzeichenTextEn, AbzeichenZahlen } from "./badgesEn";

/** Dieselbe Form wie der englische Eintrag. */
export type AbzeichenTextFr = AbzeichenTextEn;

/**
 * Die Zeichen von „alltags-ass" (`ALLTAGS_ZEICHEN` in `badges.ts`), die es auf
 * dem Weg des Kindes wirklich gibt - auf Weg „fr" fehlen `$` und `§` in der
 * Reihenfolge, die Beschreibung nennt darum nur, was das Kind wirklich
 * freischalten muss.
 */
function alltagsZeichen(z: AbzeichenZahlen): string {
  const reihe = new Set(lernwegDef(z.lernweg).introOrder);
  const da = ["@", "€", "$", "§"].filter((c) => reihe.has(c));
  if (da.length <= 1) return da.join("");
  return `${da.slice(0, -1).join(", ")} et ${da[da.length - 1]}`;
}

/** Die Familien (Überschriften im Regal) - Schlüssel ist der deutsche `group`-Name. */
export const ABZEICHEN_GRUPPEN_FR: Readonly<Record<string, string>> = {
  Fehlerfrei: "Sans erreur",
  "Saubere Serie": "Séries précises",
  Fleiß: "Assiduité",
  Anschläge: "Frappes",
  Dranbleiben: "Persévérance",
  Übungswochen: "Semaines d'entrainement",
  Sterne: "Étoiles",
  Lektionen: "Leçons",
  Stufen: "Niveaux",
  Tastenwelt: "Le monde du clavier",
  "Sitzt!": "Maitrisé !",
  Tempo: "Vitesse",
  "Am Stück": "D'affilée",
  Meisterprüfung: "Grande maitrise",
  Abenteuer: "Aventures",
  "Abenteuer-Kunststücke": "Exploits d'aventure",
  Expedition: "Expédition",
  Geschichten: "Histoires",
  Lesestunde: "Heure de lecture",
  "Lese-Kunststücke": "Exploits de lecture",
  Geheim: "Secret",
};

/** Der ganze Katalog französisch, je Abzeichen-ID. */
export const ABZEICHEN_FR: Readonly<Record<string, AbzeichenTextFr>> = {
  // ── Fehlerfrei ───────────────────────────────────────────────────────────
  volltreffer: { name: "En plein dans le mille", description: "Une série entière sans une seule erreur de frappe.", bildbeschreibung: "une cible avec une flèche au centre" },
  "null-fehler-ninja": { name: "Ninja zéro erreur", description: "5 séries sans aucune erreur de frappe.", bildbeschreibung: "un ninja" },
  "makellos-meister": { name: "Étoile impeccable", description: "15 séries sans aucune erreur de frappe.", bildbeschreibung: "trois étoiles scintillantes" },
  "diamant-finger": { name: "Doigts de diamant", description: "40 séries sans aucune erreur de frappe.", bildbeschreibung: "une pierre précieuse bleue" },
  "weisse-weste": { name: "Blanc comme neige", description: "80 séries sans aucune erreur de frappe.", bildbeschreibung: "une colombe blanche" },
  "einhorn-finger": { name: "Doigts de licorne", nameNeutral: "150 séries sans erreur", description: "150 séries sans aucune erreur de frappe.", bildbeschreibung: "une licorne" },
  // ── Saubere Serie ────────────────────────────────────────────────────────
  "praezisions-pinguin": { name: "Manchot minutieux", nameNeutral: "Trois fois précis", description: "3 séries précises d'affilée (au moins 95 % de précision).", bildbeschreibung: "un manchot" },
  adlerauge: { name: "Œil d'aigle", description: "7 séries précises d'affilée (au moins 95 % de précision).", bildbeschreibung: "un aigle" },
  "laser-lama": { name: "Lama laser", nameNeutral: "Mode laser", description: "15 séries précises d'affilée (au moins 95 % de précision).", bildbeschreibung: "un lama" },
  "eiskalte-serie": { name: "Sang-froid", description: "25 séries précises d'affilée (au moins 95 % de précision).", bildbeschreibung: "un glaçon" },
  // ── Fleiß ────────────────────────────────────────────────────────────────
  "tasten-kueken": { name: "Poussin du clavier", nameNeutral: "Première série", description: "La toute première série est terminée.", bildbeschreibung: "un poussin qui sort de l'œuf" },
  "ausdauer-ameise": { name: "Fourmi tenace", nameNeutral: "Échauffement réussi", description: "25 séries d'entrainement.", bildbeschreibung: "une fourmi" },
  "marathon-maus": { name: "Souris marathonienne", nameNeutral: "Cent séries", description: "100 séries d'entrainement.", bildbeschreibung: "une tête de souris" },
  "munteres-murmeltier": { name: "Castor courageux", nameNeutral: "Marathon", description: "250 séries d'entrainement.", bildbeschreibung: "un castor" },
  dauerlaeufer: { name: "Grand fond", description: "500 séries d'entrainement.", bildbeschreibung: "une personne qui court" },
  tausendsassa: { name: "Mille sabords", nameNeutral: "Mille séries", description: "1 000 séries d'entrainement.", bildbeschreibung: "une baleine qui souffle de l'eau" },
  // ── Anschläge ────────────────────────────────────────────────────────────
  "tausend-tasten-tiger": { name: "Tigre aux mille touches", nameNeutral: "Mille frappes justes", description: "1 000 frappes justes.", bildbeschreibung: "une tête de tigre" },
  "tasten-t-rex": { name: "T-Rex du clavier", nameNeutral: "Dix-mille frappes justes", description: "10 000 frappes justes.", bildbeschreibung: "un T-Rex" },
  "galaktische-fingerspitzen": { name: "Doigts galactiques", description: "50 000 frappes justes.", bildbeschreibung: "une fusée qui décolle" },
  "hunderttausend-held": { name: "As des cent-mille", nameNeutral: "Cent-mille frappes justes", description: "100 000 frappes justes.", bildbeschreibung: "un éclair jaune" },
  viertelmillion: { name: "Quart de million", description: "250 000 frappes justes - autant que dans un livre entier.", bildbeschreibung: "un satellite" },
  // ── Dranbleiben ──────────────────────────────────────────────────────────
  "dranbleib-dachs": { name: "Blaireau tenace", nameNeutral: "Persévérance", description: "Entrainement sur 3 jours différents.", bildbeschreibung: "un blaireau" },
  gewohnheitstier: { name: "Tortue fidèle", description: "Entrainement sur 7 jours différents.", bildbeschreibung: "une tortue" },
  "wie-ein-uhrwerk": { name: "Réglé comme une horloge", description: "Entrainement sur 20 jours différents.", bildbeschreibung: "un réveil rouge" },
  unaufhaltsam: { name: "Inarrêtable", description: "Entrainement sur 50 jours différents.", bildbeschreibung: "une montagne au sommet enneigé" },
  "tief-verwurzelt": { name: "Racines profondes", description: "Entrainement sur 100 jours différents.", bildbeschreibung: "un grand arbre vert et touffu" },
  "fels-in-der-brandung": { name: "Solide comme un roc", description: "Entrainement sur 200 jours différents - presque chaque jour d'une année scolaire entière.", bildbeschreibung: "une statue de pierre de l'ile de Pâques" },
  // ── Übungswochen ─────────────────────────────────────────────────────────
  "vierteljahr-dabei": { name: "Trois mois déjà", description: "Entrainement pendant 12 semaines différentes.", bildbeschreibung: "une feuille d'automne brune" },
  "halbes-jahr-dabei": { name: "Six mois déjà", description: "Entrainement pendant 26 semaines différentes.", bildbeschreibung: "un nuage d'où tombe la neige" },
  "ganzes-jahr-dabei": { name: "Une année entière", description: "Entrainement pendant 52 semaines différentes.", bildbeschreibung: "un gâteau d'anniversaire avec une bougie" },
  // ── Sterne ───────────────────────────────────────────────────────────────
  sternschnuppe: { name: "Étoile filante", description: "La première série à 3 étoiles.", bildbeschreibung: "une étoile filante dans le ciel de nuit" },
  "sternen-sammler": { name: "Collection d'étoiles", description: "10 séries à 3 étoiles.", bildbeschreibung: "une étoile jaune qui brille" },
  sternenhimmel: { name: "Ciel étoilé", description: "30 séries à 3 étoiles.", bildbeschreibung: "la Voie lactée dans le ciel de nuit" },
  sternenmeer: { name: "Mer d'étoiles", description: "75 séries à 3 étoiles.", bildbeschreibung: "une étoile orange à huit branches" },
  // ── Lektionen ────────────────────────────────────────────────────────────
  "lektions-loewe": { name: "Lion des leçons", nameNeutral: "Cinq leçons", description: "5 leçons terminées.", bildbeschreibung: "un lion" },
  "kapitel-kaeptn": { name: "Capitaine des chapitres", description: "15 leçons terminées.", bildbeschreibung: "une ancre" },
  // Wie im Englischen: die Lektionszahl DES WEGES (`lektionenFuer`), nicht die
  // deutschen 27 - sonst wäre die Höchststufe auf Weg „fr" falsch beschrieben.
  "lehrgangs-legende": { name: "Légende du cours", description: (z) => `Toutes les ${lektionenFuer(z.lernweg).length} leçons terminées.`, bildbeschreibung: "un trophée en or" },
  // ── Stufen (der Punktering) ──────────────────────────────────────────────
  "kletter-koala": { name: "Koala grimpeur", nameNeutral: "Niveau 5", description: "Niveau 5 atteint sur l'anneau de points.", bildbeschreibung: "un koala" },
  "punkte-rakete": { name: "Fusée à points", description: "Niveau 10 atteint sur l'anneau de points.", bildbeschreibung: "un ballon rouge" },
  "gipfel-gaemse": { name: "Chamois des sommets", nameNeutral: "Niveau 20", description: "Niveau 20 atteint sur l'anneau de points.", bildbeschreibung: "un chamois" },
  hoehenflug: { name: "Haut vol", nameNeutral: "Niveau 50", description: "Niveau 50 atteint sur l'anneau de points.", bildbeschreibung: "un hélicoptère" },
  "ueber-den-wolken": { name: "Au-dessus des nuages", nameNeutral: "Niveau 100", description: "Niveau 100 atteint sur l'anneau de points.", bildbeschreibung: "une soucoupe volante" },
  sternenreise: { name: "Voyage vers les étoiles", nameNeutral: "Niveau 200", description: "Niveau 200 atteint sur l'anneau de points.", bildbeschreibung: "une comète à longue queue" },
  // ── Tastenwelt ───────────────────────────────────────────────────────────
  // Die Grundreihe DES WEGES (Bauplan §6.3): „q s d f j k l m" auf Weg „fr".
  "grundstellungs-gorilla": {
    name: "Gorille de la rangée de base",
    nameNeutral: "Rangée de base en place",
    description: (z) =>
      `Les huit touches de la position de départ débloquées : ${lernwegDef(z.lernweg)
        .letterOrder.slice(0, lernwegDef(z.lernweg).homeRowLetters)
        .join(" ")}.`,
    bildbeschreibung: "un gorille",
  },
  "gross-baumeister": { name: "Maitre des majuscules", nameNeutral: "Majuscules", description: "La touche Maj est apprise - de vraies majuscules, tapées soi-même.", bildbeschreibung: "quatre lettres majuscules sur des touches bleues" },
  // ⚠️ „puenktchen-panda" und „schlangen-s" gibt es auf Weg „fr" nicht zu
  // verdienen (`KEIN_ABZEICHEN_AUF_WEG` in `badges.ts`) - der Eintrag steht
  // trotzdem da, weil das Regal jedes Abzeichen beschreibt.
  "puenktchen-panda": { name: "Panda à points", nameNeutral: "Les voyelles allemandes", description: "ä, ö et ü débloqués.", bildbeschreibung: "un panda" },
  "schlangen-s": { name: "S serpent", nameNeutral: "L'eszett", description: "ß, l'eszett allemand, débloqué - la dernière lettre du clavier allemand.", bildbeschreibung: "un serpent" },
  "alphabet-as": { name: "As de l'alphabet", description: "Toutes les lettres de A à Z débloquées.", bildbeschreibung: "des lettres minuscules sur des touches bleues" },
  "punkt-und-komma": { name: "Point et virgule", description: "Le point et la virgule débloqués - les premiers vrais signes de ponctuation.", bildbeschreibung: "une plume noire" },
  "satzzeichen-sammler": { name: "Collection de ponctuation", nameNeutral: "Toute la ponctuation", description: "Les sept signes de ponctuation débloqués : . , - ? ! : ;", bildbeschreibung: "un grand point d'exclamation rouge" },
  "zahlen-zebra": { name: "Zèbre des chiffres", nameNeutral: "La moitié des chiffres", description: "Cinq chiffres de la rangée des chiffres débloqués.", bildbeschreibung: "un zèbre" },
  "zahlen-zauberer": { name: "Magie des chiffres", nameNeutral: "Rangée des chiffres complète", description: "Toute la rangée des chiffres, de 1 à 0, débloquée.", bildbeschreibung: "une touche bleue avec le nombre 10" },
  "klammer-krokodil": { name: "Crocodile à parenthèses", nameNeutral: "Parenthèse ouverte, parenthèse fermée", description: "Les parenthèses ( ) débloquées - les premiers symboles.", bildbeschreibung: "un crocodile" },
  "alltags-ass": { name: "As du quotidien", nameNeutral: "Les signes du quotidien", description: (z) => `${alltagsZeichen(z)} débloqués - les signes de l'e-mail et de l'argent.`, bildbeschreibung: "une enveloppe" },
  "tastatur-krone": { name: "Reine du clavier", nameNeutral: "Tout le clavier", description: "TOUTES les touches du clavier débloquées - jusqu'au dernier symbole.", bildbeschreibung: "une couronne dorée" },
  // ── Sitzt! ───────────────────────────────────────────────────────────────
  "feste-burg": { name: "Maison solide", nameNeutral: "Rangée de base maitrisée", description: "Les huit touches de la position de départ sont maitrisées.", bildbeschreibung: "une maison" },
  "buchstaben-baendiger": { name: "Lettres domptées", nameNeutral: "Toutes les lettres maitrisées", description: "Chaque lettre est maitrisée - plus aucune n'hésite.", bildbeschreibung: "un carré rouge avec un grand A" },
  "zahlen-fels": { name: "Chiffres en béton", nameNeutral: "Tous les chiffres maitrisés", description: "Toute la rangée des chiffres est maitrisée.", bildbeschreibung: "un boulier aux perles colorées" },
  "nichts-wackelt": { name: "Rien ne bouge", description: "Chaque touche du clavier est maitrisée - tout le clavier, pas seulement débloqué.", bildbeschreibung: "un losange bleu avec un point au milieu" },
  // ── Tempo ────────────────────────────────────────────────────────────────
  "flinker-fuchs": { name: "Renard véloce", nameNeutral: "Rapide et précis", description: "Objectif de vitesse atteint ET au moins 95 % de précision - la vitesse ne compte que si la frappe est précise.", bildbeschreibung: "un renard" },
  "tempo-60": { name: "Lapin leste", nameNeutral: "60 par minute, précis", description: "Une série à 60 frappes par minute avec au moins 95 % de précision.", bildbeschreibung: "un lapin" },
  "tempo-90": { name: "Chevreuil fonceur", nameNeutral: "90 par minute, précis", description: "Une série à 90 frappes par minute avec au moins 95 % de précision.", bildbeschreibung: "un chevreuil" },
  "tempo-120": { name: "Cheval au galop", nameNeutral: "120 par minute, précis", description: "Une série à 120 frappes par minute avec au moins 98 % de précision.", bildbeschreibung: "un cheval au galop" },
  "tempo-160": { name: "Locomotive à vapeur", nameNeutral: "160 par minute, précis", description: "Une série à 160 frappes par minute avec au moins 98 % de précision.", bildbeschreibung: "une locomotive à vapeur" },
  "tempo-200": { name: "TGV", nameNeutral: "200 par minute, précis", description: "Une série à 200 frappes par minute avec au moins 98 % de précision.", bildbeschreibung: "un train à grande vitesse" },
  "tempo-300": { name: "Avion à réaction", nameNeutral: "300 par minute, précis", description: "Une série à 300 frappes par minute avec au moins 99 % de précision - un niveau professionnel.", bildbeschreibung: "un petit avion" },
  // ── Am Stück ─────────────────────────────────────────────────────────────
  "kette-100": { name: "Réaction en chaine", nameNeutral: "100 d'affilée", description: "100 frappes justes d'affilée, sans une seule erreur.", bildbeschreibung: "deux maillons de chaine" },
  "kette-250": { name: "Sans trébucher", description: "250 frappes justes d'affilée.", bildbeschreibung: "une chaine de plusieurs maillons" },
  "kette-500": { name: "Fil rouge", nameNeutral: "500 d'affilée", description: "500 frappes justes d'affilée - une série entière et plus.", bildbeschreibung: "une bobine de fil" },
  "kette-1000": { name: "Mille sans erreur", description: "1 000 frappes justes d'affilée.", bildbeschreibung: "le mont Fuji et son bonnet de neige" },
  "kette-2000": { name: "La chaine de fer", nameNeutral: "2 000 d'affilée", description: "2 000 frappes justes d'affilée - quatre ou cinq séries sans le moindre faux pas.", bildbeschreibung: "un volcan d'où coule la lave" },
  // ── Abenteuer (das Spiel heisst in der Hilfe « le jeu de la banquise ») ───
  "erste-expedition": { name: "Première expédition", description: "La première aventure de la banquise en jeu libre, jusqu'à l'igloo.", bildbeschreibung: "une boussole" },
  polarforscher: { name: "Exploration polaire", description: "10 aventures de la banquise terminées en jeu libre.", bildbeschreibung: "un flocon de neige" },
  "eismeer-legende": { name: "Légende des mers glacées", description: "30 aventures de la banquise terminées en jeu libre.", bildbeschreibung: "une haute vague bleue" },
  "packeis-profi": { name: "Pro de la banquise", nameNeutral: "60 aventures", description: "60 aventures de la banquise terminées en jeu libre.", bildbeschreibung: "une valise" },
  // ── Abenteuer-Kunststücke ────────────────────────────────────────────────
  // „Trockener Frack": Der Frack ist der Pinguin selbst - französisch die
  // « queue-de-pie ».
  "trockener-frack": { name: "Queue-de-pie au sec", description: "Une aventure entière sans tomber une seule fois dans l'eau ou dans la neige.", bildbeschreibung: "un haut-de-forme noir" },
  "immer-trocken": { name: "Toujours au sec", description: (z) => `${z.trockeneAbenteuer} aventures sans un seul plouf.`, bildbeschreibung: "un parapluie fermé" },
  fischfaenger: { name: "Pêche miraculeuse", description: (z) => `${z.fische} poissons bonus attrapés dans l'aventure de la banquise.`, bildbeschreibung: "un poisson bleu" },
  // ── Expedition ───────────────────────────────────────────────────────────
  // Die Zonennamen wie im Spiel (`course.ts`, E11a-5): la Grotte de l'écho,
  // la Tempête de neige, la Station polaire. Nie „aveugle" als Tipp-Wort.
  "hoehlen-lauscher": { name: "À l'écoute de la grotte", description: "La Grotte de l'écho traversée jusqu'à la sortie, dans le noir, rien qu'à l'oreille.", bildbeschreibung: "une chauve-souris" },
  "sturm-trotzer": { name: "Plus fort que la tempête", description: "La Tempête de neige traversée - les suites tapées de mémoire.", bildbeschreibung: "un visage qui souffle du vent" },
  "funker-freund": { name: "Ami des ondes", description: "Un message radio entier déchiffré et envoyé à la Station polaire.", bildbeschreibung: "une radio" },
  "polarlicht-entdecker": { name: "Sous l'aurore boréale", description: "Toute l'Expédition polaire sans une seule erreur - l'aurore boréale danse.", bildbeschreibung: "une étoile avec une trainée d'étincelles" },
  // ── Geschichten ──────────────────────────────────────────────────────────
  "lese-luchs": { name: "Léopard lecteur", nameNeutral: "Première histoire", description: "La première histoire lue et tapée jusqu'au bout.", bildbeschreibung: "un léopard" },
  buecherwurm: { name: "Chenille liseuse", description: "3 histoires lues jusqu'au bout.", bildbeschreibung: "une chenille verte" },
  "buecherei-baer": { name: "Ours de bibliothèque", nameNeutral: "Huit histoires", description: "8 histoires lues jusqu'au bout.", bildbeschreibung: "un ours" },
  vielleser: { name: "Rat de bibliothèque", description: "15 histoires lues jusqu'au bout.", bildbeschreibung: "une pile de livres colorés" },
  // ── Lesestunde ───────────────────────────────────────────────────────────
  "seiten-spatz": { name: "Moineau des pages", nameNeutral: "Première page", description: "La première étape d'une histoire tapée.", bildbeschreibung: "un petit oiseau bleu" },
  "kapitel-krake": { name: "Pieuvre des chapitres", nameNeutral: "Dix étapes", description: "10 étapes lues et tapées.", bildbeschreibung: "une pieuvre" },
  "geschichten-gigant": { name: "Géant des histoires", description: "30 étapes lues et tapées.", bildbeschreibung: "un éléphant" },
  leseratte: { name: "Tourne-pages", nameNeutral: "75 étapes", description: "75 étapes lues et tapées.", bildbeschreibung: "un parchemin" },
  // ── Lese-Kunststücke ─────────────────────────────────────────────────────
  federleicht: { name: "Léger comme une plume", description: "Une étape entière tapée sans une seule erreur.", bildbeschreibung: "une plume blanche" },
  "in-einem-rutsch": { name: "D'une traite", description: "Une histoire entière lue jusqu'au bout en une seule journée.", bildbeschreibung: "une spirale bleue" },
  "lesezeichen-held": { name: "As du marque-page", description: "Un autre jour, la lecture a repris exactement là où elle s'était arrêtée.", bildbeschreibung: "un marque-page" },
  // ── Meisterprüfung ───────────────────────────────────────────────────────
  "zehn-minuten-abschrift": { name: "La copie de 10 minutes", description: "Dix minutes de frappe d'affilée avec au plus 0,5 % d'erreurs de frappe - comme une vraie épreuve de copie.", bildbeschreibung: "un chronomètre" },
  "lehrgangs-meister": { name: "Cours maitrisé", description: (z) => `Toutes les ${lektionenFuer(z.lernweg).length} leçons terminées avec trois étoiles.`, bildbeschreibung: "une toque universitaire noire" },
  "goldene-tastatur": { name: "Le clavier d'or", description: "Toutes les touches débloquées, toutes maitrisées - et une fois 160 frappes par minute à 98 % de précision. Le dernier badge.", bildbeschreibung: "une médaille de sport avec un ruban" },
  // ── Geheim ───────────────────────────────────────────────────────────────
  "gemuetliches-faultier": { name: "Paresseux tranquille", description: "Tout doucement, et sans une seule erreur - la précision passe avant la vitesse !", bildbeschreibung: "un paresseux" },
  "comeback-kaenguru": { name: "Rebond du kangourou", description: "Une série à 3 étoiles juste après une série à 1 étoile.", bildbeschreibung: "un kangourou" },
  nachteule: { name: "Oiseau de nuit", description: "Une série terminée après 21 h.", bildbeschreibung: "un hibou" },
  "frueher-vogel": { name: "Lève-tôt", description: "Une série terminée avant 7 h.", bildbeschreibung: "un coq" },
  nimmersatt: { name: "Lecture gloutonne", description: "3 étapes dévorées en une seule journée.", bildbeschreibung: "une pomme verte" },
  "ferien-held": { name: "As des vacances", description: "Entrainement en plein milieu des grandes vacances - en juillet ou en aout.", bildbeschreibung: "une plage avec un parasol" },
  "wochenend-schreiber": { name: "Frappe du weekend", description: "Entrainement un samedi et un dimanche.", bildbeschreibung: "une page de calendrier" },
  "zurueck-im-sattel": { name: "De retour en selle", description: (z) => `Entrainement repris après une pause de plus de ${z.pauseTage} jours - revenir, ça compte.`, bildbeschreibung: "deux flèches qui tournent en rond" },
  "doppelt-genaeht": { name: "Double couture", description: "Deux séries sans erreur, l'une juste après l'autre.", bildbeschreibung: "une aiguille à coudre avec du fil" },
  winterkind: { name: "Enfant de l'hiver", description: "Entrainement au cœur de l'hiver - en décembre ou en janvier.", bildbeschreibung: "un bonhomme de neige" },
  jahreswechsel: { name: "Passage à la nouvelle année", description: "Entrainement le dernier jour de l'année ou le premier jour de la nouvelle.", bildbeschreibung: "un feu d'artifice dans le ciel de nuit" },
  "tages-marathon": { name: "Journée marathon", description: "Dix séries en une seule journée.", bildbeschreibung: "un jockey sur un cheval de course" },
  sternentag: { name: "Journée étoilée", description: "Trois séries à trois étoiles en une seule journée.", bildbeschreibung: "un soleil avec un visage" },
  blitzsauber: { name: "Propre comme un sou neuf", description: "Trois séries sans erreur en une seule journée.", bildbeschreibung: "un savon avec des bulles" },
  "volle-woche": { name: "Semaine complète", description: "Entrainement sur cinq jours différents en UNE semaine.", bildbeschreibung: "un livre vert" },
  // „Blindflug" ⇒ « Sans regarder »: zum Affen, der sich die Augen zuhält -
  // ohne das Wort „aveugle".
  blindflug: { name: "Sans regarder", description: "Une série entière sans erreur - avec le clavier à l'écran masqué. C'est tout l'art de taper à dix doigts.", bildbeschreibung: "un singe qui se cache les yeux avec les mains" },
  // ⚠️ Die Bedingung bleibt „Deutsch UND Englisch geübt" (`badges.ts`) - die
  // Beschreibung sagt genau das, auch in der französischen Bedienung.
  // ★ D1 Randfund (28.09.2026): deux langues différentes, quelles qu'elles soient.
  sprachwechsler: { name: "Voyage entre les langues", description: "Entrainement dans deux langues - par exemple en français et en anglais.", bildbeschreibung: "le globe terrestre avec l'Europe et l'Afrique" },
  lesenacht: { name: "Lecture du soir", description: "Une étape d'histoire lue après 20 h.", bildbeschreibung: "une lune avec un visage" },
  "zaehe-taste": { name: "Touche têtue", description: "Une touche longtemps difficile est maintenant maitrisée.", bildbeschreibung: "un escargot" },
  aufsteiger: { name: "En progrès", description: "Cinq niveaux de difficulté au-dessus du début.", bildbeschreibung: "un graphique avec une ligne qui monte" },
};
