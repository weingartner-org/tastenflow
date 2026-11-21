/**
 * ★ E10b-2 (26.09.2026): die Lückentext-Rätsel des Weges „fr" - „Texte à
 * trous" (Glossar Bauplan §9.2). Neu auf Französisch geschrieben, nicht
 * übersetzt; Aufbau wie `RAETSEL_DE` (Satz mit Lücke `...`, alle gleich guten
 * Lösungen, Altersstufen).
 *
 * Regeln (Wächter `tests/tastenflow-wortspiele-fr.test.ts`):
 *  · Lösbar aus dem Satz, ohne Bild und ohne Wissen, das nur ein sehendes Kind
 *    hat (keine Farben ausser in festen Wendungen, keine „regarde").
 *  · Die Lösung ist mit einer Taste je Buchstabe tippbar - kein ê, â, ï, œ in
 *    einer Lösung (die Auswahl prüft mit `fitText` ohne Totasten-Regel), kein
 *    É am Wortanfang (auf Windows-AZERTY würde „Entrée" zu „Entree").
 *  · Neue Rechtschreibung (*gout, ile*), nichts gegen ein Kind, kulturell ruhig,
 *    Orte aus der ganzen Frankophonie (Dakar, Montréal, Genève, Madagascar).
 *  · Wörter mit Landesunterschied haben alle Formen als Lösung
 *    (*téléphone/portable/cellulaire*).
 */
import type { Raetsel } from "./lueckentext";

const ALLE: Raetsel["stufen"] = ["kids", "teens", "erwachsen"];
const AB_TEENS: Raetsel["stufen"] = ["teens", "erwachsen"];

export const RAETSEL_FR: Raetsel[] = [
  // --- Les animaux ---
  { satz: "La girafe a un très long ...", loesungen: ["cou"], stufen: ALLE },
  { satz: "L'éléphant attrape l'eau avec sa ...", loesungen: ["trompe"], stufen: ALLE },
  { satz: "Les abeilles fabriquent le ...", loesungen: ["miel"], stufen: ALLE },
  { satz: "Le hérisson a le dos couvert de ...", loesungen: ["piquants", "épines"], stufen: ALLE },
  { satz: "Le lapin a de longues ...", loesungen: ["oreilles"], stufen: ALLE },
  { satz: "L'escargot porte sa coquille sur son ...", loesungen: ["dos"], stufen: ALLE },
  { satz: "On dit que le lion est le roi des ...", loesungen: ["animaux"], stufen: ALLE },
  { satz: "La chouette ne chasse pas le jour, mais la ...", loesungen: ["nuit"], stufen: ALLE },
  { satz: "Le manchot ne vole pas, mais il sait très bien ...", loesungen: ["nager"], stufen: ALLE },
  { satz: "L'araignée a huit ...", loesungen: ["pattes"], stufen: ALLE },
  { satz: "La vache nous donne du ...", loesungen: ["lait"], stufen: ALLE },
  { satz: "Avec la toison des moutons, on fait de la ...", loesungen: ["laine"], stufen: ALLE },
  { satz: "Le chat aime attraper les ...", loesungen: ["souris"], stufen: ALLE },
  { satz: "La chenille deviendra un jour un ...", loesungen: ["papillon"], stufen: ALLE },
  { satz: "Le têtard deviendra une ...", loesungen: ["grenouille"], stufen: ALLE },
  { satz: "Le castor construit des barrages avec du ...", loesungen: ["bois"], stufen: ALLE },
  { satz: "Le chien remue la ... quand il est content.", loesungen: ["queue"], stufen: ALLE },
  { satz: "Le coq chante tôt le ...", loesungen: ["matin"], stufen: ALLE },
  { satz: "La tortue avance très ...", loesungen: ["lentement", "doucement"], stufen: ALLE },
  { satz: "Le baobab est un très grand ... d'Afrique.", loesungen: ["arbre"], stufen: ALLE },
  { satz: "Le kangourou porte son petit dans sa ...", loesungen: ["poche"], stufen: ALLE },
  { satz: "Les oiseaux construisent un ... pour leurs œufs.", loesungen: ["nid"], stufen: ALLE },
  { satz: "Le poisson respire sous l'eau avec ses ...", loesungen: ["branchies"], stufen: AB_TEENS },
  { satz: "Le chameau fait des réserves dans ses ...", loesungen: ["bosses"], stufen: AB_TEENS },
  { satz: "Au Québec, avec la sève de l'érable, on fait du ...", loesungen: ["sirop", "sucre"], stufen: AB_TEENS },
  { satz: "Le caméléon peut changer de ...", loesungen: ["couleur"], stufen: AB_TEENS },
  { satz: "La baleine n'est pas un poisson, c'est un ...", loesungen: ["mammifère"], stufen: AB_TEENS },

  // --- Le temps qu'il fait, la nature ---
  { satz: "En hiver, il tombe parfois de la ...", loesungen: ["neige"], stufen: ALLE },
  { satz: "En automne, les arbres perdent leurs ...", loesungen: ["feuilles"], stufen: ALLE },
  { satz: "Les plantes ont besoin d'eau et de ...", loesungen: ["soleil", "lumière"], stufen: ALLE },
  { satz: "Le soleil se lève le matin et se couche le ...", loesungen: ["soir"], stufen: ALLE },
  { satz: "La nuit, on voit la lune et les ...", loesungen: ["étoiles"], stufen: ALLE },
  { satz: "Quand le tonnerre gronde, c'est un ...", loesungen: ["orage"], stufen: ALLE },
  { satz: "La glace fond quand il fait ...", loesungen: ["chaud"], stufen: ALLE },
  { satz: "L'eau de la mer a un gout ...", loesungen: ["salé"], stufen: ALLE },
  { satz: "Les vers de terre vivent sous la ...", loesungen: ["terre"], stufen: ALLE },
  { satz: "Un volcan crache de la ...", loesungen: ["lave"], stufen: AB_TEENS },
  { satz: "Le plus grand désert chaud du monde s'appelle le ...", loesungen: ["Sahara"], stufen: AB_TEENS },
  { satz: "Quand l'eau gèle, elle devient de la ...", loesungen: ["glace"], stufen: ALLE },

  // --- Le corps ---
  { satz: "On sent les odeurs avec le ...", loesungen: ["nez"], stufen: ALLE },
  { satz: "On entend avec les ...", loesungen: ["oreilles"], stufen: ALLE },
  { satz: "On croque une pomme avec les ...", loesungen: ["dents"], stufen: ALLE },
  { satz: "Une main a cinq ...", loesungen: ["doigts"], stufen: ALLE },
  { satz: "On se brosse les dents avec une ...", loesungen: ["brosse"], stufen: ALLE },
  { satz: "On goute le sucré et le salé avec la ...", loesungen: ["langue"], stufen: ALLE },
  { satz: "Entre la main et le bras, il y a le ...", loesungen: ["poignet"], stufen: ALLE },
  { satz: "Le cœur bat dans la ...", loesungen: ["poitrine"], stufen: AB_TEENS },
  { satz: "Quand on a froid dehors, on met un ...", loesungen: ["manteau", "pull", "bonnet"], stufen: ALLE },

  // --- Manger ---
  { satz: "Le boulanger fait du ...", loesungen: ["pain"], stufen: ALLE },
  { satz: "On fait les frites avec des pommes de ...", loesungen: ["terre"], stufen: ALLE },
  { satz: "Le fromage est fait avec du ...", loesungen: ["lait"], stufen: ALLE },
  { satz: "Le citron a un gout très ...", loesungen: ["acide"], stufen: ALLE },
  { satz: "Le miel a un gout ...", loesungen: ["sucré", "doux"], stufen: ALLE },
  { satz: "On mange la soupe avec une ...", loesungen: ["cuillère", "cuiller"], stufen: ALLE },
  { satz: "La mangue et la banane sont des ...", loesungen: ["fruits"], stufen: ALLE },
  { satz: "La carotte et le poireau sont des ...", loesungen: ["légumes"], stufen: ALLE },
  { satz: "Le couscous est fait avec de la ...", loesungen: ["semoule"], stufen: AB_TEENS },
  { satz: "Pour garder le lait au froid, on le met dans le ...", loesungen: ["frigo", "réfrigérateur"], stufen: ALLE },
  { satz: "On achète le pain à la ...", loesungen: ["boulangerie"], stufen: ALLE },

  // --- Le temps qui passe ---
  { satz: "Une semaine a sept ...", loesungen: ["jours"], stufen: ALLE },
  { satz: "Une année a douze ...", loesungen: ["mois"], stufen: ALLE },
  { satz: "Une heure a soixante ...", loesungen: ["minutes"], stufen: ALLE },
  { satz: "Le jour qui vient après lundi, c'est ...", loesungen: ["mardi"], stufen: ALLE },
  { satz: "Le jour qui vient avant dimanche, c'est ...", loesungen: ["samedi"], stufen: ALLE },
  { satz: "Après l'hiver vient le ...", loesungen: ["printemps"], stufen: ALLE },
  { satz: "Le premier mois de l'année, c'est ...", loesungen: ["janvier"], stufen: ALLE },
  { satz: "Midi, c'est le milieu de la ...", loesungen: ["journée"], stufen: ALLE },
  { satz: "On fête son anniversaire une fois par ...", loesungen: ["an", "année"], stufen: ALLE },
  { satz: "Hier, aujourd'hui et ...", loesungen: ["demain"], stufen: ALLE },

  // --- L'école et la langue ---
  { satz: "À l'école, on écrit dans un ...", loesungen: ["cahier"], stufen: ALLE },
  { satz: "L'alphabet a vingt-six ...", loesungen: ["lettres"], stufen: ALLE },
  { satz: "Une phrase commence par une ...", loesungen: ["majuscule"], stufen: ALLE },
  { satz: "Le contraire de grand, c'est ...", loesungen: ["petit"], stufen: ALLE },
  { satz: "Le contraire de chaud, c'est ...", loesungen: ["froid"], stufen: ALLE },
  { satz: "Le contraire du jour, c'est la ...", loesungen: ["nuit"], stufen: ALLE },
  { satz: "Le contraire de plein, c'est ...", loesungen: ["vide"], stufen: ALLE },
  { satz: "Le contraire de haut, c'est ...", loesungen: ["bas"], stufen: ALLE },
  { satz: "Le contraire de toujours, c'est ...", loesungen: ["jamais"], stufen: ALLE },
  { satz: "Le féminin de lion, c'est ...", loesungen: ["lionne"], stufen: ALLE },
  { satz: "Le pluriel de cheval, c'est ...", loesungen: ["chevaux"], stufen: AB_TEENS },
  { satz: "Le pluriel de journal, c'est ...", loesungen: ["journaux"], stufen: AB_TEENS },
  { satz: "Dans un dictionnaire, les mots sont rangés dans l'ordre ...", loesungen: ["alphabétique"], stufen: AB_TEENS },
  { satz: "Un mot qui veut dire la même chose qu'un autre est un ...", loesungen: ["synonyme"], stufen: AB_TEENS },
  { satz: "Un petit mot comme il ou elle, qui remplace un nom, est un ...", loesungen: ["pronom"], stufen: AB_TEENS },
  { satz: "Dans le mot l'école, le petit signe après le l s'appelle une ...", loesungen: ["apostrophe"], stufen: AB_TEENS },

  // --- Le clavier, la plage braille ---
  { satz: "La plus longue touche du clavier, c'est la barre d'...", loesungen: ["espace"], stufen: ALLE },
  { satz: "Pour écrire une majuscule, on garde enfoncée la touche ...", loesungen: ["Maj"], stufen: ALLE },
  { satz: "Pour effacer la lettre avant le curseur, on appuie sur Retour ...", loesungen: ["arrière"], stufen: ALLE },
  { satz: "Sur les touches F et J, les doigts sentent de petits ...", loesungen: ["repères"], stufen: ALLE },
  { satz: "Une plage braille montre chaque lettre avec des ...", loesungen: ["points"], stufen: ALLE },
  { satz: "Un lecteur d'écran lit le texte à voix ...", loesungen: ["haute"], stufen: ALLE },
  { satz: "L'écriture en points pour les doigts a été inventée par Louis ...", loesungen: ["Braille"], stufen: AB_TEENS },
  { satz: "Une lettre en braille se fait avec six ... au plus.", loesungen: ["points"], stufen: AB_TEENS },

  // --- La musique, le sport ---
  { satz: "Au football, on essaie de marquer un ...", loesungen: ["but"], stufen: ALLE },
  { satz: "Au tennis, on frappe la balle avec une ...", loesungen: ["raquette"], stufen: ALLE },
  { satz: "On joue du tambour avec des ...", loesungen: ["baguettes", "mains"], stufen: ALLE },
  { satz: "Un groupe de personnes qui chantent ensemble, c'est une ...", loesungen: ["chorale"], stufen: AB_TEENS },
  { satz: "Le violon se joue avec un ...", loesungen: ["archet"], stufen: AB_TEENS },
  { satz: "Pour rouler à vélo sans tomber, il faut garder l'...", loesungen: ["équilibre"], stufen: AB_TEENS },

  // --- La vie de tous les jours ---
  { satz: "On ouvre une porte avec une ...", loesungen: ["clé", "clef"], stufen: ALLE },
  { satz: "Quand il pleut, on ouvre son ...", loesungen: ["parapluie"], stufen: ALLE },
  { satz: "Le soir, on dort dans son ...", loesungen: ["lit"], stufen: ALLE },
  { satz: "On appelle ses amis avec un ...", loesungen: ["téléphone", "portable", "cellulaire"], stufen: ALLE },
  { satz: "Les lettres arrivent dans la boite aux ...", loesungen: ["lettres"], stufen: ALLE },
  { satz: "Les pompiers éteignent le ...", loesungen: ["feu"], stufen: ALLE },
  { satz: "Le médecin soigne les ...", loesungen: ["malades"], stufen: ALLE },
  { satz: "Le train roule sur des ...", loesungen: ["rails"], stufen: ALLE },
  { satz: "L'avion vole dans le ...", loesungen: ["ciel"], stufen: ALLE },
  { satz: "Le bateau navigue sur la ...", loesungen: ["mer"], stufen: ALLE },
  { satz: "L'objet qui donne l'heure au poignet, c'est une ...", loesungen: ["montre"], stufen: ALLE },

  // --- La francophonie ---
  { satz: "La capitale de la France s'appelle ...", loesungen: ["Paris"], stufen: ALLE },
  { satz: "La capitale de la Belgique s'appelle ...", loesungen: ["Bruxelles"], stufen: AB_TEENS },
  { satz: "La capitale du Sénégal s'appelle ...", loesungen: ["Dakar"], stufen: AB_TEENS },
  { satz: "Au Québec, la grande ville sur une ile du fleuve Saint-Laurent s'appelle ...", loesungen: ["Montréal"], stufen: AB_TEENS },
  { satz: "En Suisse, la grande ville au bout du lac Léman s'appelle ...", loesungen: ["Genève"], stufen: AB_TEENS },
  { satz: "Le plus long fleuve de France s'appelle la ...", loesungen: ["Loire"], stufen: AB_TEENS },
  { satz: "Madagascar est une grande ...", loesungen: ["ile"], stufen: ALLE },
  { satz: "Le plus haut sommet des Alpes est le mont ...", loesungen: ["Blanc"], stufen: AB_TEENS },
  { satz: "Le grand fleuve qui traverse le Mali s'appelle le ...", loesungen: ["Niger"], stufen: AB_TEENS },
];
