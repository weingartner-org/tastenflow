/**
 * Tastenflow - „Tasten erkunden" / „Tasten finden" in der FRANZÖSISCHEN
 * Bedienung (★ E12, 26.09.2026, Bauplan §4.3 Punkt 4, §9.2, §11).
 *
 * Dieselbe Logik wie bei Deutsch und Englisch: `erkundeTaste` in
 * `tastenErklaerung.ts` entscheidet weiter, WAS eine Taste ist (Sondertaste,
 * Zeichen, Kombination, dritter Layer, Totaste) und ob sie geschluckt wird.
 * Hier stehen nur die WÖRTER - dieselben Fächer wie in `tastenErklaerungEn.ts`,
 * Eintrag für Eintrag, NEU auf Französisch geschrieben (nicht übersetzt).
 *
 * ── Warum eine eigene Datei (wie bei Englisch) ──────────────────────────────
 *  · `tastenErklaerung.ts` ist ein gemeinsamer Teil (Tastenflow + »Im
 *    Griff«) und ohnehin 900+ Zeilen lang - eine dritte Sprache daneben
 *    machte alle drei schwerer lesbar.
 *  · Das Tasten-Wörterbuch von »Im Griff« (`lib/computer/tastenNamen.ts`)
 *    bleibt UNBERÜHRT - deutsch, gehört einer deutschsprachigen App. Für
 *    „Tasten finden"/„Tasten erkunden" stehen die französischen Namen und
 *    Lagen hier, nach derselben Kennung (`id`).
 *
 * ── Glossar (Bauplan §9.2, §4.3) ────────────────────────────────────────────
 *  Maj · Verr. Maj · Alt Gr · touche morte (accent circonflexe/tréma) ·
 *  Espace · Retour arrière · Entrée · Échap · Tab. Finger: index, majeur,
 *  annulaire, auriculaire, pouce, gauche/droit (siehe `fingers.ts`, `FINGER_FR`).
 *
 * ── Die Regeln der Sätze (wie bei Deutsch und Englisch) ─────────────────────
 *  · Einfache Sprache, kurze Sätze, ein Kind ist gemeint. **tu**, nicht
 *    **vous** (F9) - „Tasten erkunden" spricht direkt zum Kind.
 *  · Kein Point médian (F10).
 *  · Nur Bindestrich `-`. Keine Maus-Wörter. Jeder Satz endet mit einem Punkt.
 *  · Geübt wird oft auf einer AZERTY-Tastatur (Frankreich) - wo eine Taste auf
 *    Schweiz-Französisch oder Kanada anders liegt, bleibt der Satz allgemein
 *    (dieselbe Vorsicht wie bei Deutsch/Österreich/Schweiz und GB/US).
 */
import type { Plattform } from "../computer/model";
import type { TastenName } from "../computer/tastenNamen";
import { spokenLabel } from "./fingers";
import type { LayoutId } from "./layouts";
import type { TastenErklaerung } from "./tastenErklaerung";

/* ══ Sondertasten ═══════════════════════════════════════════════════════════ */

/** Französische Sondertaste nach der Kennung aus dem Tasten-Wörterbuch. */
export function sondertasteFr(
  id: string,
  plattform: Plattform,
  _layout: LayoutId = "fr",
): TastenErklaerung | null {
  const mac = plattform === "macos";
  const pfeilWord = mac ? "Option" : "Ctrl";
  switch (id) {
    case "tabulator":
      return {
        kurz: "Tab",
        name: "touche de tabulation",
        was: [
          "passe d'un élément à l'autre, par exemple à un lien, une case ou un bouton.",
          "Avec Maj, elle revient en arrière.",
        ],
      };
    case "eingabe":
    case "zeilenschalter":
      return mac
        ? {
            kurz: "Retour",
            name: "touche Retour",
            was: ["valide et envoie.", "Elle ouvre les liens et fait une nouvelle ligne dans un texte."],
          }
        : {
            kurz: "Entrée",
            name: "touche Entrée",
            was: [
              "valide et envoie.",
              "Elle ouvre les liens, active les boutons et fait une nouvelle ligne dans un texte.",
            ],
          };
    case "leertaste":
      return {
        kurz: null,
        name: "barre d'espace",
        was: ["fait un espace entre deux mots.", "Elle active aussi les boutons et coche les cases."],
      };
    case "loeschtaste":
      return {
        kurz: null,
        name: "touche Retour arrière",
        was: [
          "efface le caractère à gauche du curseur.",
          // ★ E11a-5: „erreur de frappe", nie „faute" (Glossar §9.2, nie gegen das Kind).
          "C'est comme ça qu'on corrige une erreur de frappe.",
        ],
      };
    case "entf":
      return mac
        ? {
            kurz: null,
            name: "touche Suppr avancée",
            was: [
              "efface le caractère à droite du curseur.",
              "Si ton clavier ne l'a pas, utilise fn et la touche Retour arrière.",
            ],
          }
        : {
            kurz: "Suppr",
            name: "touche Suppr",
            was: ["efface le caractère à droite du curseur.", "Elle efface aussi les fichiers sélectionnés."],
          };
    case "esc":
      return {
        kurz: "Échap",
        name: "touche Échap",
        was: [
          "annule.",
          "Elle ferme les menus, les fenêtres et les messages.",
          "Dans Tastenflow, elle te ramène dans la zone d'écriture.",
        ],
      };
    case "umschalt":
      return {
        kurz: "Maj",
        name: "touche Majuscule",
        was: [
          "écrit des lettres majuscules tant que tu la tiens.",
          "Elle donne aussi le caractère du haut d'une touche, par exemple le point d'interrogation.",
        ],
      };
    case "feststell":
      return {
        kurz: "Verr. Maj",
        name: "touche Verrouillage majuscule",
        was: ["écrit tout en majuscules jusqu'à ce que tu appuies à nouveau dessus."],
      };
    case "pfeil-links":
      return {
        kurz: null,
        name: "flèche gauche",
        was: [
          "déplace le curseur d'un caractère vers la gauche.",
          `Avec ${pfeilWord}, elle saute un mot entier.`,
        ],
      };
    case "pfeil-rechts":
      return {
        kurz: null,
        name: "flèche droite",
        was: [
          "déplace le curseur d'un caractère vers la droite.",
          `Avec ${pfeilWord}, elle saute un mot entier.`,
        ],
      };
    case "pfeil-auf":
      return {
        kurz: null,
        name: "flèche haut",
        was: ["déplace le curseur d'une ligne vers le haut.", "Dans les listes et les menus, elle monte d'un élément.", `Avec ${pfeilWord}, elle saute un paragraphe vers le haut.`],
      };
    case "pfeil-ab":
      return {
        kurz: null,
        name: "flèche bas",
        was: ["déplace le curseur d'une ligne vers le bas.", "Dans les listes et les menus, elle descend d'un élément.", `Avec ${pfeilWord}, elle saute un paragraphe vers le bas.`],
      };
    case "pos1":
      return {
        kurz: null,
        name: "touche Origine",
        was: ["va au début de la ligne.", "Sur une page web, elle va tout en haut.", "Avec Ctrl, elle va au début du texte entier."],
      };
    case "ende":
      return {
        kurz: null,
        name: "touche Fin",
        was: ["va à la fin de la ligne.", "Sur une page web, elle va tout en bas.", "Avec Ctrl, elle va à la fin du texte entier."],
      };
    case "bild-auf":
      return {
        kurz: "Page préc.",
        name: "touche Page précédente",
        was: ["remonte d'un écran."],
      };
    case "bild-ab":
      return {
        kurz: "Page suiv.",
        name: "touche Page suivante",
        was: ["descend d'un écran."],
      };
    case "einfg":
      return {
        kurz: "Inser.",
        name: "touche Insertion",
        was: [
          "est la touche du lecteur d'écran pour NVDA et JAWS.",
          "Presque toutes les commandes du lecteur d'écran commencent par elle.",
        ],
      };
    case "strg":
      return {
        kurz: "Ctrl",
        name: "touche Contrôle",
        was: [
          "sert pour les raccourcis clavier.",
          "Ctrl + C copie, Ctrl + V colle, Ctrl + Z annule.",
          "Seule, elle rend la synthèse vocale silencieuse.",
        ],
      };
    case "alt":
      return {
        kurz: null,
        name: "touche Alt",
        was: [
          "sert pour les raccourcis clavier.",
          "Alt + Tab change de fenêtre.",
          "Dans Tastenflow, Alt + H ouvre l'aide.",
        ],
      };
    case "altgr":
      return {
        kurz: "Alt Gr",
        name: "touche Alt Gr",
        was: ["écrit le troisième caractère d'une touche, par exemple le symbole euro avec Alt Gr + E."],
      };
    case "windows-taste":
      return {
        kurz: "Win",
        name: "touche Windows",
        was: [
          "ouvre le menu Démarrer.",
          "Appuie encore une fois pour le fermer.",
          "Avec d'autres touches, elle fait plus, par exemple Win + D affiche le bureau.",
        ],
      };
    case "befehlstaste":
      return {
        kurz: "cmd",
        name: "touche Commande",
        was: ["sert pour les raccourcis clavier.", "cmd + C copie, cmd + V colle, cmd + Z annule."],
      };
    case "wahltaste":
      return {
        kurz: "Option",
        name: "touche Option",
        was: ["écrit des symboles, par exemple l'arobase.", "Avec les flèches, elle saute un mot entier."],
      };
    case "ctrl":
      return {
        kurz: "ctrl",
        name: "touche Contrôle",
        was: ["fait partie des raccourcis clavier sur un Mac.", "Seule, elle rend VoiceOver silencieux."],
      };
    case "fn":
      return {
        kurz: "fn",
        name: "touche Fonction",
        was: ["donne une deuxième tâche à d'autres touches, par exemple monter et baisser le volume."],
      };
    default:
      return null;
  }
}

/**
 * Wie die Taste in einer KOMBINATION und gross in der Mitte heisst - kurz,
 * wie man sie schreibt („Ctrl + Origine", „Maj + Tab"). Ohne Eintrag gilt
 * `kurz ?? name` der Erklärung.
 */
export const TASTE_KURZ_FR: Readonly<Record<string, string>> = {
  tabulator: "Tab",
  eingabe: "Entrée",
  zeilenschalter: "Retour",
  leertaste: "Espace",
  loeschtaste: "Retour arrière",
  entf: "Suppr",
  esc: "Échap",
  umschalt: "Maj",
  feststell: "Verr. Maj",
  "pfeil-links": "Flèche gauche",
  "pfeil-rechts": "Flèche droite",
  "pfeil-auf": "Flèche haut",
  "pfeil-ab": "Flèche bas",
  pos1: "Origine",
  ende: "Fin",
  "bild-auf": "Page précédente",
  "bild-ab": "Page suivante",
  einfg: "Insertion",
  strg: "Ctrl",
  alt: "Alt",
  altgr: "Alt Gr",
  "windows-taste": "Win",
  befehlstaste: "cmd",
  wahltaste: "Option",
  ctrl: "ctrl",
  fn: "fn",
};

/* ══ Tasten ausserhalb des Wörterbuchs ═════════════════════════════════════ */

const F_TASTEN_WINDOWS_FR: Readonly<Record<string, readonly string[]>> = {
  F1: ["ouvre l'aide dans beaucoup de programmes."],
  F2: ["renomme un fichier sélectionné."],
  F3: ["lance une recherche."],
  F4: ["ferme la fenêtre avec Alt en plus."],
  F5: ["recharge une page web.", "Ici, il ne se passe rien, tu peux continuer à explorer."],
  F6: ["va dans la barre d'adresse du navigateur."],
  F7: ["vérifie l'orthographe dans Word."],
  F10: ["va dans la barre de menu de beaucoup de programmes."],
  F11: ["active et désactive le plein écran dans le navigateur.", "Sur un ordinateur portable, souvent avec la touche Fn."],
  F12: ["ouvre la fenêtre Enregistrer sous dans Word."],
};

/** Französisch zu `nachKey` - F-Tasten, Num, Menü-Taste, Lautstärke, Totaste. */
export function nachKeyFr(
  key: string,
  plattform: Plattform,
  layout: LayoutId = "fr",
): TastenErklaerung | null {
  const f = /^F([1-9]|1[0-9]|2[0-4])$/.exec(key);
  if (f) {
    const was =
      plattform === "macos"
        ? [
            "a sa propre tâche dans certains programmes.",
            "Sur un Mac, ces touches gèrent souvent la luminosité et le volume.",
          ]
        : (F_TASTEN_WINDOWS_FR[key] ?? ["a sa propre tâche dans certains programmes."]);
    return { kurz: key, name: "touche de fonction", was };
  }
  switch (key) {
    case "Home":
      return sondertasteFr("pos1", "windows", layout);
    case "End":
      return sondertasteFr("ende", "windows", layout);
    case "PageUp":
      return sondertasteFr("bild-auf", "windows", layout);
    case "PageDown":
      return sondertasteFr("bild-ab", "windows", layout);
    case "Insert":
      return sondertasteFr("einfg", "windows", layout);
    case "NumLock":
      return {
        kurz: null,
        name: "touche Verr. Num",
        was: ["active et désactive les chiffres du pavé numérique."],
      };
    // ★ Testerin 24.10.2026: Numpad 5 bei Num aus (`Clear`) - Vorgabe, ungeprüft von Muttersprachlern.
    case "Clear":
      return {
        kurz: "5",
        name: "touche 5 du pavé numérique",
        was: ["écrit 5 quand Verr. Num est activé.", "Verr. Num est désactivé, donc elle ne fait rien."],
      };
    case "ContextMenu":
      return {
        kurz: null,
        name: "touche Menu",
        was: [
          "ouvre un menu avec des commandes pour l'endroit où tu es.",
          "Maj + F10 fait la même chose.",
        ],
      };
    case "PrintScreen":
      return { kurz: null, name: "touche Impr. écran", was: ["fait une image de l'écran.", "Sous Windows, elle ouvre souvent un outil de capture d'écran.", "Échap le ferme."] };
    case "ScrollLock":
      return { kurz: null, name: "touche Arrêt défil.", was: ["n'est presque jamais utile aujourd'hui."] };
    case "Pause":
      return { kurz: null, name: "touche Pause", was: ["n'est presque jamais utile aujourd'hui."] };
    case "AudioVolumeUp":
      return { kurz: null, name: "touche Volume plus", was: ["augmente le son."] };
    case "AudioVolumeDown":
      return { kurz: null, name: "touche Volume moins", was: ["baisse le son."] };
    case "AudioVolumeMute":
      return { kurz: null, name: "touche Muet", was: ["coupe le son et le remet."] };
    case "Fn":
      return sondertasteFr("fn", plattform, layout);
    case "Dead":
      return {
        kurz: null,
        name: "touche morte",
        was: [
          "pose un signe sur la lettre suivante, par exemple un accent sur le e.",
          "Le signe n'apparait qu'avec la lettre suivante.",
        ],
      };
    default:
      return null;
  }
}

/* ══ Totasten mit Zusatzbezeichnung ═════════════════════════════════════════ */

const ERSCHEINT_SPAETER_FR = "Le signe n'apparait qu'avec la lettre suivante.";

/** Die vier bekannten Akzente - nach derselben Kennung wie die deutsche Tabelle. */
export const AKZENTE_FR: Readonly<Record<"zirkumflex" | "akut" | "gravis" | "trema", { name: string; was: readonly string[] }>> = {
  zirkumflex: {
    name: "accent circonflexe",
    was: ["pose un petit chapeau sur la lettre suivante, par exemple ê.", ERSCHEINT_SPAETER_FR],
  },
  akut: {
    name: "accent aigu",
    was: ["pose un trait montant vers la droite sur la lettre suivante, par exemple é.", ERSCHEINT_SPAETER_FR],
  },
  gravis: {
    name: "accent grave",
    was: ["pose un trait montant vers la gauche sur la lettre suivante, par exemple è.", ERSCHEINT_SPAETER_FR],
  },
  trema: {
    name: "tréma",
    was: ["pose deux points sur la lettre suivante, par exemple ë.", ERSCHEINT_SPAETER_FR],
  },
};

/* ══ Zeichen ════════════════════════════════════════════════════════════════ */

const PROGRAMMIEREN_FR = ["sert en programmation."] as const;

/**
 * Dieselben Zeichen wie `ZEICHEN` in `tastenErklaerung.ts`. Der Name kommt
 * aus `spokenLabel(ch, "fr")`; `name` steht nur, wo die französische Tabelle
 * dort keinen kennt. Dazu je zwei Zeichen, die es nur auf AZERTY gibt
 * (Guillemets, œ) - beide ausserhalb der deutschen/englischen Tabelle.
 */
export const ZEICHEN_FR: Readonly<Record<string, { name?: string; was: readonly string[] }>> = {
  ".": { was: ["se met à la fin d'une phrase."] },
  ",": { was: ["sépare des parties d'une phrase."] },
  "?": { was: ["se met à la fin d'une question."] },
  "!": { was: ["se met à la fin d'une exclamation."] },
  ":": { was: ["annonce quelque chose, par exemple une liste."] },
  ";": { was: ["sépare deux parties d'une phrase, plus fort qu'une virgule."] },
  "-": { was: ["relie des mots, par exemple dans arc-en-ciel."] },
  "@": { was: ["est dans chaque adresse e-mail."] },
  "+": { was: ["veut dire plus dans un calcul.", "Dans un raccourci clavier, il veut dire appuyer en même temps."] },
  "*": { was: ["veut dire fois sur un ordinateur."] },
  "/": { was: ["veut dire divisé sur un ordinateur.", "Il est aussi dans les adresses internet."] },
  "=": { was: ["se met avant le résultat d'un calcul."] },
  "'": { was: ["montre qu'une lettre manque, par exemple dans l'école."] },
  '"': { name: "guillemets droits", was: ["se mettent avant et après ce que dit quelqu'un."] },
  "«": { name: "guillemet ouvrant", was: ["ouvre ce que dit quelqu'un, à la française."] },
  "»": { name: "guillemet fermant", was: ["ferme ce que dit quelqu'un, à la française."] },
  "(": { name: "parenthèse ouvrante", was: ["commence quelque chose qu'on ajoute."] },
  ")": { name: "parenthèse fermante", was: ["termine ce qu'on a ajouté."] },
  "%": { name: "pour cent", was: ["veut dire sur cent, par exemple 50 pour cent."] },
  "&": { name: "esperluette", was: ["veut dire et."] },
  "#": { name: "dièse", was: ["sert aussi pour les hashtags."] },
  "€": { name: "euro", was: ["est le symbole de l'euro."] },
  $: { was: ["est le symbole du dollar."] },
  "£": { was: ["est le symbole de la livre anglaise."] },
  "§": { was: ["se met devant les lois et les règles."] },
  "°": { was: ["montre les degrés, par exemple pour la température."] },
  "<": { name: "plus petit que", was: ["compare deux nombres : celui de gauche est plus petit."] },
  ">": { name: "plus grand que", was: ["compare deux nombres : celui de gauche est plus grand."] },
  _: { name: "tiret bas", was: ["se met souvent dans les adresses e-mail et les noms de fichiers."] },
  "^": { was: ["veut dire puissance en calcul, par exemple 2 puissance 3."] },
  "²": { name: "au carré", was: ["sert pour les surfaces, par exemple les mètres carrés."] },
  "³": { name: "au cube", was: ["sert pour les volumes, par exemple les mètres cubes."] },
  "[": { was: PROGRAMMIEREN_FR },
  "]": { was: PROGRAMMIEREN_FR },
  "{": { was: PROGRAMMIEREN_FR },
  "}": { was: PROGRAMMIEREN_FR },
  "\\": { was: PROGRAMMIEREN_FR },
  "|": { was: PROGRAMMIEREN_FR },
  "~": { was: PROGRAMMIEREN_FR },
  "´": { was: ["pose un accent sur une lettre."] },
  "`": { was: ["pose un accent sur une lettre."] },
  "¨": { was: ["pose deux points sur une lettre."] },
  œ: { name: "e dans l'o", was: ["o et e collés, par exemple dans cœur ou sœur."] },
};

/** Der französische Name eines Zeichens - aus der Tabelle oder `spokenLabel`. */
export function zeichenNameFr(ch: string): string {
  return ZEICHEN_FR[ch]?.name ?? spokenLabel(ch, "fr");
}

/* ══ Kombinationen ═════════════════════════════════════════════════════════ */

/** Wo eine Wirkung gilt - französisch. */
export const ORT_FR: Readonly<Record<string, string>> = {
  explorer: "dans l'Explorateur",
  finder: "dans le Finder",
  word: "dans Word",
  excel: "dans Excel",
  browser: "dans le navigateur",
  teams: "dans Teams",
  powerpoint: "dans PowerPoint",
  outlook: "dans Outlook",
  bedienungshilfen: "dans le lecteur d'écran",
};

/** Die kleine eigene Liste der deutschen Datei, französisch. */
export const EIGENE_KOMBINATIONEN_FR: Readonly<Record<Plattform, readonly { keys: string; was: string }[]>> = {
  windows: [
    { keys: "Umschalt+Tab", was: "revient à l'élément précédent." },
    { keys: "Strg+P", was: "ouvre la fenêtre d'impression." },
  ],
  macos: [
    { keys: "Umschalt+Tab", was: "revient à l'élément précédent." },
    { keys: "Cmd+P", was: "ouvre la fenêtre d'impression." },
  ],
};

/**
 * Was ein Kürzel BEWIRKT - französisch, nach der Kennung der Wirkung im
 * Kürzel-Katalog von »Im Griff« (`lib/computer/kuerzelWirkung.ts`, dort nur
 * gelesen). Fehlt eine Kennung, sagt die Zeile ehrlich, dass es vom Programm
 * abhängt - lieber allgemein als ein deutsches Wort mitten im französischen Satz.
 */
export function wirkungFr(id: string, plattform: Plattform): string | null {
  const w = WIRKUNG_FR[id];
  if (id === "papierkorb") return plattform === "macos" ? "Mettre à la corbeille" : "Mettre à la corbeille";
  return w ?? null;
}

const WIRKUNG_FR: Readonly<Record<string, string>> = {
  kopieren: "Copier",
  einfuegen: "Coller",
  ausschneiden: "Couper",
  rueckgaengig: "Annuler",
  wiederherstellen: "Rétablir ce qui a été annulé",
  "alles-markieren": "Tout sélectionner",
  "markieren-zeichen": "Sélectionner caractère par caractère",
  "markieren-wort": "Sélectionner mot par mot",
  "spalte-markieren": "Sélectionner la colonne entière",
  "zeile-markieren": "Sélectionner la ligne entière",
  oeffnen: "Ouvrir",
  umbenennen: "Renommer",
  "neuer-ordner": "Créer un nouveau dossier",
  papierkorb: "Mettre à la corbeille",
  duplizieren: "Faire une deuxième copie du même fichier",
  "ebene-hoeher": "Remonter d'un niveau",
  adressleiste: "Aller à la barre d'adresse",
  eigenschaften: "Afficher les propriétés",
  uebersicht: "Ouvrir l'aperçu, un coup d'œil rapide sans ouvrir",
  bewegen: "Déplacer le fichier là où il doit aller (il disparait de l'ancien endroit)",
  "ansicht-details": "Passer à l'affichage \"Détails\"",
  speichern: "Enregistrer",
  "speichern-unter": "Enregistrer sous, avec un nouveau nom ou un nouvel endroit",
  fett: "Mettre en gras",
  kursiv: "Mettre en italique",
  unterstreichen: "Souligner",
  ueberschrift1: "Appliquer le titre 1",
  ueberschrift2: "Appliquer le titre 2",
  "standard-format": "Appliquer le style \"Normal\"",
  links: "Aligner à gauche",
  zentriert: "Centrer",
  zeilenumbruch: "Retour à la ligne dans le même paragraphe",
  rechtschreibung: "Lancer la vérification orthographique",
  fensterbereiche: "Changer entre les parties de la fenêtre",
  suchen: "Rechercher",
  ersetzen: "Rechercher et remplacer",
  "gehe-zu-zelle": "Aller à une cellule précise",
  "zelle-bearbeiten": "Continuer à écrire dans la cellule",
  "zelle-formatieren": "Ouvrir la fenêtre \"Format de cellule\"",
  "zum-rand": "Aller au bord des données",
  autosumme: "Insérer la somme automatique",
  "ausfuellen-unten": "Recopier vers le bas",
  "ausfuellen-rechts": "Recopier vers la droite",
  "absoluter-bezug": "Fixer une référence (référence absolue avec des signes dollar)",
  datum: "Insérer la date du jour",
  uhrzeit: "Insérer l'heure actuelle",
  kommentar: "Insérer un commentaire",
  autofilter: "Activer et désactiver le filtre automatique",
  blattwechsel: "Changer de feuille de calcul",
  "neues-blatt": "Insérer une nouvelle feuille de calcul",
  "neu-laden": "Recharger la page",
  lesezeichen: "Ajouter un signet",
  verlauf: "Ouvrir l'historique",
  senden: "Envoyer le message",
  "nachricht-loeschen": "Supprimer le message",
  "sr-stopp": "Arrêter la synthèse vocale",
};

/** „a, b et c" - die französische Aufzählung. */
export function aufzaehlungFr(teile: readonly string[]): string {
  if (teile.length <= 1) return teile[0] ?? "";
  return `${teile.slice(0, -1).join(", ")} et ${teile[teile.length - 1]}`;
}

/** Die festen Wörter des Erkundens, französisch. */
export const ERKUNDEN_WOERTER_FR = {
  kombination: "combinaison de touches",
  kombiUnbekannt: "ce qu'elle fait dépend du programme.",
  mit: "Avec",
  akzentTaste: "touche accent",
  unbekannt: "Je ne reconnais pas cette touche.",
  taste: (key: string) => `Touche ${key}`,
} as const;

/* ══ „Tasten finden" ════════════════════════════════════════════════════════
 *
 * Die Sätze der Suchrunde (`lib/computer/tastenSuche.ts`) französisch - WAS
 * geschieht, entscheidet weiter `suchSchritt`; hier wird nur gesagt.
 * ═══════════════════════════════════════════════════════════════════════════ */

interface TasteFr {
  /** Im Satz, mit Artikel: „Trouve la touche Tab." */
  nennung: string;
  /** Wo sie liegt - als Weg für eine Hand, nie als Bild. */
  lage: string;
  /** Zusatz nach der Bestätigung (heute nur die Feststelltaste). */
  achtung?: string;
}

const SECHSERBLOCK_FR = "Dans le bloc de six au-dessus des flèches";

/** Die Tasten der Suchrunde, französisch - nach derselben Kennung wie das Wörterbuch. */
const TASTEN_FR: Readonly<Record<string, TasteFr | ((plattform: Plattform) => TasteFr)>> = {
  tabulator: {
    nennung: "la touche Tab",
    lage: "Auriculaire gauche : une rangée plus haut, tout au bord.",
  },
  "pfeil-links": {
    nennung: "la flèche gauche",
    lage: "En bas à droite, près des flèches : celle de gauche.",
  },
  "pfeil-rechts": {
    nennung: "la flèche droite",
    lage: "En bas à droite, près des flèches : celle de droite.",
  },
  "pfeil-auf": {
    nennung: "la flèche haut",
    lage: "En bas à droite, près des flèches : celle du haut.",
  },
  "pfeil-ab": {
    nennung: "la flèche bas",
    lage: "En bas à droite, près des flèches : sous la flèche du haut.",
  },
  pos1: {
    nennung: "la touche Origine",
    lage: `${SECHSERBLOCK_FR}, en haut au milieu. Souvent avec fn sur un ordinateur portable.`,
  },
  ende: {
    nennung: "la touche Fin",
    lage: `${SECHSERBLOCK_FR}, en bas au milieu. Souvent avec fn sur un ordinateur portable.`,
  },
  "bild-auf": {
    nennung: "la touche Page précédente",
    lage: `${SECHSERBLOCK_FR}, en haut à droite. Souvent avec fn sur un ordinateur portable.`,
  },
  "bild-ab": {
    nennung: "la touche Page suivante",
    lage: `${SECHSERBLOCK_FR}, en bas à droite. Souvent avec fn sur un ordinateur portable.`,
  },
  leertaste: {
    nennung: "la barre d'espace",
    lage: "La longue touche sous tes pouces.",
  },
  eingabe: {
    nennung: "la touche Entrée",
    lage: "Main droite, tout au bord : la grande touche.",
  },
  zeilenschalter: {
    nennung: "la touche Retour",
    lage: "Main droite, tout au bord : la grande touche.",
  },
  loeschtaste: {
    nennung: "la touche Retour arrière",
    lage: "Main droite, tout au bord, deux rangées plus haut.",
  },
  entf: (plattform) =>
    plattform === "macos"
      ? {
          nennung: "la touche Suppr avancée",
          lage: "Seulement sur les grands claviers, à côté de Retour. Sinon fn et Retour arrière.",
        }
      : {
          nennung: "la touche Suppr",
          lage: `${SECHSERBLOCK_FR}, en bas à gauche. En haut à droite sur un ordinateur portable.`,
        },
  esc: {
    nennung: "la touche Échap",
    lage: "Dans le coin en haut à gauche.",
  },
  umschalt: {
    nennung: "la touche Maj",
    lage: "Deux fois : à gauche et à droite, sur la dernière rangée de lettres.",
  },
  feststell: {
    nennung: "la touche Verr. Maj",
    lage: "Auriculaire gauche : un pas vers la gauche.",
    achtung: "Tu écris en majuscules maintenant ? Appuie de nouveau dessus.",
  },
  strg: {
    nennung: "la touche Ctrl",
    lage: "Dans le coin en bas à gauche.",
  },
  alt: { nennung: "la touche Alt", lage: "En bas, à gauche de la barre d'espace." },
  altgr: {
    nennung: "la touche Alt Gr",
    lage: "En bas, à droite de la barre d'espace.",
  },
  "windows-taste": {
    nennung: "la touche Windows",
    lage: "En bas à gauche, entre Ctrl et Alt.",
  },
  einfg: {
    nennung: "la touche Insertion",
    lage: `${SECHSERBLOCK_FR}, en haut à gauche, au-dessus de Suppr. Souvent absente sur un ordinateur portable.`,
  },
  befehlstaste: {
    nennung: "la touche Commande",
    lage: "En bas à gauche, juste à côté de la barre d'espace.",
  },
  wahltaste: {
    nennung: "la touche Option",
    lage: "En bas à gauche, la troisième touche depuis le bord.",
  },
  ctrl: {
    nennung: "la touche Contrôle",
    lage: "En bas à gauche, la deuxième touche depuis le bord.",
  },
  fn: {
    nennung: "la touche fn",
    lage: "En bas à gauche, la première touche, tout dans le coin. Sur un MacBook, il y a écrit \"fn\" dessus.",
  },
};

function tasteFr(t: TastenName, plattform: Plattform): TasteFr {
  const e = TASTEN_FR[t.id];
  if (typeof e === "function") return e(plattform);
  // Sicherheitsnetz: eine neue Wörterbuch-Taste ohne französischen Eintrag.
  return e ?? { nennung: t.kurz ?? t.name, lage: "" };
}

/** „la touche Tab" - wie eine Taste im Satz heisst. */
export function tastenNennungFr(t: TastenName, plattform: Plattform): string {
  return tasteFr(t, plattform).nennung;
}

/** Nur die Lage - oder "" (wie bei Deutsch/Englisch). */
export function tastenLageFr(t: TastenName, plattform: Plattform): string {
  return tasteFr(t, plattform).lage;
}

/** Der Auftrag beim Suchen: „Trouve la touche Tab. Auriculaire gauche …" */
export function ansageSuchauftragFr(t: TastenName, plattform: Plattform): string {
  const e = tasteFr(t, plattform);
  return e.lage ? `Trouve ${e.nennung}. ${e.lage}` : `Trouve ${e.nennung}.`;
}

/** Erster Treffer - erst die Wiederholung zählt (wie bei Deutsch/Englisch). */
export function ansageGefundenFr(t: TastenName, plattform: Plattform): string {
  return `Trouvé ! Appuie sur une autre touche, puis encore sur ${tastenNennungFr(t, plattform)}.`;
}

/** Nach der Bestätigung - und, wo nötig, die Warnung (Feststelltaste). */
export function ansageBestaetigtFr(t: TastenName, plattform: Plattform): string {
  const e = tasteFr(t, plattform);
  return e.achtung ? `C'est ça ! ${e.achtung}` : "C'est ça !";
}

/** Eine Taste, die hier nicht unterrichtet wird. */
export const ANSAGE_UNBEKANNT_FR = "Ce n'est pas une touche qu'on apprend ici.";

/**
 * Der Satz zu einem Schritt der Suchrunde - französisch. `art` und `naechste`
 * kommen unverändert aus `suchSchritt`; nur die Wörter sind neu.
 */
export function suchSatzFr(
  art: "daneben" | "gefunden" | "weiter" | "fertig",
  taste: TastenName | null,
  suchbar: readonly TastenName[],
  index: number,
  plattform: Plattform,
): string {
  const gesucht = suchbar[index]!;
  switch (art) {
    case "daneben": {
      const g = tasteFr(gesucht, plattform);
      if (!taste) return `${ANSAGE_UNBEKANNT_FR} Trouve ${g.nennung}.`;
      return `Ça, c'est ${tastenNennungFr(taste, plattform)}. Trouve ${g.nennung}.${g.lage ? ` ${g.lage}` : ""}`;
    }
    case "gefunden":
      return ansageGefundenFr(gesucht, plattform);
    case "fertig":
      return `${ansageBestaetigtFr(gesucht, plattform)} Les ${suchbar.length} touches sont trouvées. Bravo !`;
    case "weiter":
      return `${ansageBestaetigtFr(gesucht, plattform)} ${ansageSuchauftragFr(suchbar[index + 1]!, plattform)}`;
  }
}
