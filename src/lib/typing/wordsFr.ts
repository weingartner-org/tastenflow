import type { InhaltsStufe } from "./account";

/**
 * Französische Wortliste (Kleinschreibung, nur Buchstaben) - das Gegenstück zu
 * `WORDS` (`words.ts`) und `WORDS_EN` (`corpusEn.ts`) für die Übungsformen, die
 * ihren Vorrat über `wortquelle()`/`wortpool()` (`uebungsformen/hilfen.ts`)
 * ziehen: Spiegelwörter, Zwillingsgriffe, Wandernder Großbuchstabe, Pyramide.
 *
 * ★ E10b (25.09.2026, Bauplan `BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md`
 * §2.3 Punkt 4): bis hierher gab `wortquelle("fr")` still die DEUTSCHE Liste
 * zurück - ein Kind auf Weg „fr" hätte deutsche Wörter als französische Übung
 * bekommen. Gefunden in E10a (BEFUND-2026-09-25-E10A-UEBUNGSFORMEN.md).
 *
 * Auf Französisch zusammengestellt, NICHT aus `WORDS`/`WORDS_EN` übertragen
 * (Bauplan §6.2). Die Regeln, die der Wächter
 * `tests/tastenflow-wortquelle-fr.test.ts` festhält:
 *
 * - **Nur neue Rechtschreibung** (F4, §6.8): *ile, boite, gout, flute, chaine,
 *   aout, huitre, connaitre, ognon* - kein `î`, kein `û` (ausser den vier
 *   Wörtern, wo er unterscheidet: *sûr, dû, mûr, jeûne*).
 * - **Kein Landeswort** (§10.1): keine Mahlzeiten-Namen (*déjeuner, diner,
 *   souper*), keine Zahlwörter 70/80/90, kein *courriel*, kein *week-end* -
 *   die Liste gilt für alle vier Varianten gleich.
 * - **Kein `œ`, kein Grossbuchstabe, kein Apostroph, kein Bindestrich**: Die
 *   Formen zeigen das Wort aus der Liste, nicht die Fassung nach dem Ersatz
 *   der Tastatur - `cœur` stünde auf Windows-AZERTY als nicht tippbares Wort da.
 * - **Kulturell ruhig** (§6.5 Punkt 6): kein Schweinefleisch, keine Religion,
 *   kein Alkohol; Tiere, Speisen und Orte aus der ganzen Frankophonie.
 *
 * Akzente sind Absicht: `fitText` lässt ein Wort mit `é`, `è`, `à`, `ç`, `ù`
 * erst durch, wenn die Taste freigeschaltet ist - vorher fällt es still aus
 * dem Vorrat, es wird nie ohne Akzent gezeigt. Wörter mit Totaste (`ê â ô ë ï`)
 * kommen erst, wenn die Totasten in der Eingabe stehen (E4).
 *
 * Grob geordnet nach der Tastenfolge von Fassung A (§5.3): Grundreihe mit
 * `e i u a n o t r`, dann `é`, dann `p c v h g b`, dann `à è`, dann der Rest.
 */
export const WORDS_FR: string[] = [
  // Grundreihe (q s d f j k l m) mit e i u a n o t r
  "la", "le", "les", "de", "des", "du", "un", "une", "et", "est", "il", "elle",
  "sa", "son", "sur", "sous", "mais", "ami", "amie", "mot", "lit", "lune", "rue",
  "roue", "sel", "sol", "mer", "lait", "miel", "jus", "nuit", "jour", "matin",
  "midi", "lundi", "mardi", "jeudi", "samedi", "mai", "mars", "juin", "juillet",
  "mois", "an", "tour", "train", "terre", "tante", "note", "nom", "non", "oui",
  "moi", "toi", "rose", "noir", "sud", "nord", "ouest", "fil", "fille", "fils",
  "dame", "monde", "radio", "judo", "moto", "stade", "fleur", "fraise", "froid",
  "jardin", "maison", "famille", "animal", "lion", "loup", "mouton", "tortue",
  "renard", "fourmi", "souris", "oiseau", "melon", "orange", "salade", "tomate",
  "limonade", "farine", "tarte", "sable", "domino", "safari", "saison", "semaine",
  "sortie", "trois", "sept", "huit", "neuf", "onze", "treize", "mille", "tu",
  "nous", "ils", "elles", "tout", "tous", "ton", "mon", "sans", "dans", "toujours",
  "ensemble", "encore", "aussi", "si", "ou", "rire", "dormir", "sauter", "aimer",
  "lire", "dire", "faire", "ranger", "marmotte", "fennec", "soleil", "lettre",
  "question", "quatre", "quinze", "qui", "que", "quoi", "quand",
  // é
  "été", "idée", "fée", "fumée", "journée", "année", "musée", "marée", "fusée",
  "désert", "météo", "numéro", "télé", "étoile", "étude", "entrée", "soirée",
  "idéal", "réussi", "rangée", "durée", "saluer",
  // p c v h g b
  "papa", "maman", "pomme", "poire", "poisson", "pain", "pluie", "plage", "place",
  "pont", "porte", "piano", "copain", "copine", "chat", "chien", "cheval", "vache",
  "chanson", "chocolat", "banane", "baobab", "bateau", "ballon", "bois", "bonjour",
  "bonsoir", "bravo", "bus", "vélo", "ville", "village", "vent", "vert", "violet",
  "cahier", "classe", "cinéma", "cirque", "citron", "coco", "carotte", "caribou",
  "castor", "chameau", "girafe", "gorille", "grenouille", "hibou", "hérisson",
  "herbe", "heure", "hiver", "histoire", "mangue", "manioc", "igname", "couscous",
  "tajine", "menthe", "datte", "ananas", "avocat", "haricot", "biscuit", "bonbon",
  "soupe", "sauce", "poulet", "légume", "fruit", "cerise", "prune", "abricot",
  "raisin", "noisette", "arachide", "lapin", "canard", "poule", "papillon",
  "abeille", "coccinelle", "escargot", "dauphin", "baleine", "requin", "phoque",
  "pingouin", "panda", "tigre", "singe", "gazelle", "crocodile", "chamois",
  "orignal", "érable", "sapin", "palmier", "savane", "oasis", "montagne",
  "colline", "vallée", "lac", "océan", "volcan", "nuage", "orage", "neige",
  "glace", "école", "livre", "stylo", "trousse", "cartable", "tableau", "dictée",
  "lecture", "calcul", "réponse", "page", "phrase", "clavier", "touche", "écran",
  "ordinateur", "tablette", "message", "musique", "dessin", "peinture", "danse",
  "sport", "tennis", "natation", "course", "jouet", "puzzle", "équipe", "match",
  "enfant", "bébé", "cousin", "cousine", "oncle", "voisin", "voisine", "personne",
  "main", "pied", "bras", "doigt", "pouce", "bouche", "oreille", "cou", "dos",
  "genou", "dent", "chambre", "cuisine", "salon", "table", "chaise", "lampe",
  "tapis", "boite", "clé", "sac", "avion", "pirogue", "métro", "route", "gare",
  "marché", "magasin", "beurre", "fromage", "confiture", "gaufre", "frites",
  "sirop", "repas", "café", "thé", "eau", "minute",
  "mercredi", "vendredi", "dimanche", "printemps", "automne", "janvier",
  "février", "avril", "septembre", "octobre", "novembre", "décembre", "cinq",
  "cent", "vingt", "trente", "douze", "grand", "petit", "joli", "beau", "belle",
  "bon", "bonne", "calme", "rapide", "lent", "chaud", "fort", "facile", "content",
  "gentil", "rouge", "bleu", "jaune", "blanc", "gris", "brun", "chanter",
  "danser", "jouer", "dessiner", "manger", "boire", "courir", "nager", "parler",
  "chercher", "trouver", "donner", "partir", "venir", "aller", "voir", "savoir",
  "pouvoir", "vouloir", "apprendre", "comprendre", "taper", "compter", "sourire",
  "merci", "salut", "ici", "avec", "pour", "chez", "entre", "comme", "souvent",
  "demain", "hier", "avant", "ligne", "espace", "index", "ile", "gout", "flute",
  "chaine", "huitre", "connaitre", "ognon", "djembé", "kora", "balafon",
  "leçon", "garçon", "façon", "glaçon", "maçon", "reçu", "ça",
  // à è
  "là", "voilà", "déjà", "mère", "père", "frère", "élève", "règle", "très",
  "après", "problème", "chèvre", "crème", "zèbre", "modèle", "planète", "rivière",
  "lumière", "première", "cuillère", "collègue", "sève",
  // x y z ç ù w k
  "deux", "six", "dix", "noix", "exemple", "heureux", "doux", "yeux", "crayon",
  "voyage", "zoo", "riz", "nez", "gazon", "douzaine", "kiwi", "koala",
  "kangourou", "kilo", "wagon", "où", "aout",
  // Totasten (ê â ô ë ï) - erst mit E4 tippbar
  "tête", "fête", "fenêtre", "forêt", "crêpe", "pêche", "rêve", "même", "âne",
  "gâteau", "château", "pâtes", "drôle", "hôpital", "hôtel", "côte", "tôt",
  "bientôt", "maïs", "canoë",
];

/**
 * Alters-gestufter Bonus-Wortschatz (Français) - das Gegenstück zu
 * `STUFE_VOCAB` (`corpusExtras.ts`, deutsch) und `STUFE_VOCAB_EN`
 * (`corpusEn.ts`) für `stufeVocab()` (`generator.ts`).
 *
 * ★ E10c (26.09.2026, Bauplan §2.3, Auftrag E10c Punkt 2): `stufeVocab("fr", …)`
 * gab bis hierher still den DEUTSCHEN Stufen-Wortschatz zurück (`STUFE_VOCAB`)
 * - ein Kind auf Weg „fr" bekam „Fluss", „Nudel", „Freundschaft" als „passende"
 * Wörter zum eigenen Tastenstand angeboten. Diese Liste ist neu auf Französisch
 * zusammengestellt (nicht aus `STUFE_VOCAB`/`STUFE_VOCAB_EN` übersetzt), nach
 * denselben Regeln wie `WORDS_FR`:
 *
 * - **Nur neue Rechtschreibung** (F4, §6.8): kein `î`/`û` ausser den vier
 *   Ausnahmen (*sûr, dû, mûr, jeûne*) - hier nicht gebraucht.
 * - **Kein Landeswort** (§10.1): keine Mahlzeiten-Namen, keine Zahlwörter
 *   70/80/90, kein *courriel*, kein *week-end*, kein *gomme* (CH/QC: *efface*).
 * - **Kein `œ`, kein Grossbuchstabe, kein Apostroph, kein Bindestrich.**
 * - **Kulturell ruhig** (§6.5 Punkt 6): kein Schweinefleisch, keine Religion,
 *   kein Alkohol.
 *
 * Drei Stufen wie überall seit Charge S3 (`InhaltsStufe`): `kids` (7-10,
 * Grundschule/école primaire), `teens` (11-15, collège), `erwachsen`.
 */
export const STUFE_VOCAB_FR: Record<InhaltsStufe, string[]> = {
  kids: [
    "chaton", "chiot", "poussin", "grenouille", "escargot", "papillon",
    "coccinelle", "abeille", "fourmi", "araignée", "hérisson", "écureuil",
    "biche", "faon", "hibou", "chouette", "corbeau", "pigeon", "moineau",
    "cygne", "étoile", "éclair", "brouillard", "givre", "gelée", "gouter",
    "glaçon", "flocon", "cartable", "trousse", "règle", "compas", "feutre",
    "classeur", "récréation", "cantine", "copain", "copine", "maitresse",
    "directeur", "directrice", "cour", "toboggan", "balançoire", "corde",
    "billes", "trottinette", "patin", "ballon", "raquette", "piscine",
    "plongeon", "cabane", "grenier", "placard", "tiroir", "couette",
    "oreiller", "pyjama", "chausson", "manteau", "écharpe", "bonnet", "gant",
    "parapluie", "valise", "sac", "gourde", "boite", "panier", "confiture",
    "yaourt", "céréale", "biscuit", "bonbon", "chocolat", "glace", "fraise",
    "framboise", "myrtille", "pastèque", "citrouille", "potiron",
  ],
  teens: [
    "collège", "matière", "professeur", "exposé", "contrôle", "devoir",
    "cahier", "stylo", "agenda", "correspondant", "correspondante",
    "échange", "séjour", "voyage", "réseau", "internet", "ordinateur",
    "tablette", "écran", "clavier", "application", "logiciel", "vidéo",
    "musique", "chanson", "playlist", "concert", "équipe", "entrainement",
    "compétition", "victoire", "défaite", "arbitre", "amitié", "confiance",
    "respect", "entraide", "partage", "émotion", "sentiment", "rêve",
    "avenir", "projet", "objectif", "effort", "progrès", "réussite",
    "échec", "nature", "environnement", "planète", "climat", "pollution",
    "recyclage", "énergie", "continent", "océan", "montagne", "rivière",
    "désert", "culture", "tradition", "danse", "théâtre", "histoire",
    "géographie", "science", "mathématiques", "littérature",
  ],
  erwachsen: [
    "travail", "bureau", "réunion", "projet", "budget", "contrat", "client",
    "collègue", "salaire", "facture", "impôt", "banque", "économie",
    "société", "entreprise", "marché", "commerce", "gouvernement",
    "élection", "citoyen", "citoyenne", "loi", "justice", "liberté",
    "égalité", "fraternité", "solidarité", "démocratie", "santé", "médecin",
    "hôpital", "traitement", "retraite", "logement", "loyer", "quartier",
    "transport", "circulation", "véhicule", "technologie", "innovation",
    "recherche", "université", "diplôme", "expérience", "compétence",
    "formation", "carrière", "famille", "génération", "tradition",
    "patrimoine", "langue", "dialecte", "immigration", "intégration",
    "diversité", "tolérance", "respect",
  ],
};
