/**
 * ★★★ DIE LEKTIONEN DES WEGES „fr" (E10b-2, 26.09.2026).
 *
 * Bauplan `BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md` §8.2: eine eigene
 * Folge nach AZERTY-Reihen - Grundreihe in vier Schritten, die häufigen
 * Buchstaben, „la rangée des chiffres sans Maj" (`' é à è`), Maj, die Totasten
 * `^` und `¨`, Satzzeichen, Ziffern, Sonderzeichen und eine Lektion
 * „É, À, œ et « »". Neu auf Französisch geschrieben, nicht übersetzt; die
 * Kinder werden geduzt („tu").
 *
 * ── DIE REGEL, AN DER ALLES HÄNGT ───────────────────────────────────────────
 * Anders als {@link EN_LESSONS} (die innerhalb von „e i n r t h o" umsortiert)
 * führt jede französische Lektion NUR Tasten ein, die in der Reihenfolge des
 * Weges (`lernweg.ts#FR_LETTER_ORDER`, Fassung A2) bis dahin dran sind: Nach
 * jeder Lektion ist der Tastenstand ein ANFANGSSTÜCK der Einführungsreihenfolge.
 * So bekommt ein Kind im Lehrgang nie eine Taste, die „Mein Training" noch
 * nicht kennt, und `introducedThroughLesson` schreibt nie ein Loch in den Stand.
 * Wächter: `tests/tastenflow-lektionen-fr.test.ts`. Ändert sich die Reihenfolge
 * einmal, schlägt er an - die Lektionen werden dann neu geschnitten (die
 * Beispielwörter in den Einführungen hängen an den Tasten).
 *
 * ── JE TASTATUR EINE EIGENE LISTE ───────────────────────────────────────────
 * Auf Schweiz-Französisch und Kanada liegt die Grundreihe physisch anders
 * (`a … é` bzw. `a … ;`, siehe {@link achteGrundtasteFuerLayout}): „a" und
 * „é" sind dort von Anfang an da, „q" und „m" kommen erst nach „b g h". Die
 * Lektionen folgen dem mit DERSELBEN Abbildung wie die Reihenfolge - erste und
 * achte Grundtaste werden ersetzt, Doppelte fallen weg, und „q m" bekommen
 * dort eine eigene Lektion hinter „b g h" (auf AZERTY gibt es sie nicht). Die
 * IDs bleiben über alle Tastaturen gleich (der Fortschritt hängt an der ID).
 *
 * ── WAS GERECHNET IST UND WAS GESCHRIEBEN ───────────────────────────────────
 * Geschrieben: Titel und der erste Absatz jeder Einführung (was die Lektion
 * bringt, Beispielwörter in « »). Gerechnet: die GRIFFE - Finger, Reihe, Lage
 * zur Grundstellung, Maj/Alt Gr/Totaste - aus den Daten der Tastatur
 * (`layouts.ts`). Ein Griff, den die Tastatur nicht kennt, wird nicht geraten.
 *
 * ⚠️ Beispielwörter: nur, was an der Stelle der Lektion auf JEDER
 * französischen Tastatur tippbar ist (Wächter prüft jedes Wort zwischen « »),
 * neue Rechtschreibung (F4), nichts gegen ein Kind, kulturell ruhig (§6.5).
 */
import type { Lesson, LessonKind } from "./curriculum";
import { SHIFT_UNIT, achteGrundtasteFuerLayout } from "./letters";
import { lernwegDef } from "./lernweg";
import { capsUpperFuer, layoutById, layoutIndex, type KeyboardLayout, type LayoutId } from "./layouts";
import { FINGERS, fingerName, type FingerId } from "./fingers";
import { grossbuchstabeWeg, kombizeichenZu } from "./totasten";
// ★ G2b-1: Gross-/Klein ausdrücklich in der Sprache dieser Lektionen ("fr") - wer diese Datei
// als Vorlage für eine neue Sprache kopiert, ersetzt "fr" durch die Sprache (Falle: eine Kopie
// mit `toUpperCase()` rechnete für Türkisch still falsch).
import { grossFuer, kleinFuer } from "./sprachRegister";

/** Der Bauplan einer Lektion - Tasten in der AZERTY-Grundform (wie `FR_LETTER_ORDER`). */
interface FrLektionsBauplan {
  id: string;
  kind: LessonKind;
  /** Die neuen Einheiten in der AZERTY-Grundform, genau in der Reihenfolge des Weges. */
  einheiten: readonly string[];
  enablesShift?: boolean;
  /** Nur auf Tastaturen, auf denen die Abbildung Tasten übrig lässt (Schweiz, Kanada: „q m"). */
  fuerVerdraengte?: boolean;
  corpusKinds?: Lesson["corpusKinds"];
  /** Der Titel aus den Tasten, die auf DIESER Tastatur ankommen. */
  titel: (tasten: readonly string[], layout: KeyboardLayout) => string;
  /** Der geschriebene erste Absatz der Einführung - gilt auf jeder Tastatur. */
  vorspann: string;
  /**
   * ★ S1/S2 (26.09.2026): ein anderer erster Absatz, wenn auf DIESER Tastatur
   * nicht alle geplanten Tasten in der Lektion ankommen (Schweiz/Kanada: „m"
   * schon bei „p c v", Kanada: Apostroph erst bei Maj). Fehlt es, gilt `vorspann`.
   */
  vorspannFuer?: (tasten: readonly string[]) => string | undefined;
  /** Statt der gerechneten Griffe ein eigener Teil (Maj, Ziffern, É/À/œ/« »). */
  griffe?: (tasten: readonly string[], layout: KeyboardLayout, heim: HeimTasten) => string;
}

// ── Tastennamen ───────────────────────────────────────────────────────────────

/** So steht eine Taste im Text: Buchstaben a-z gross (wie auf der Kappe), sonst das Zeichen. */
function kappe(k: string): string {
  return /^[a-z]$/.test(k) ? grossFuer(k, "fr") : k;
}

/**
 * Satz- und Sonderzeichen haben im Satz einen NAMEN vor dem Zeichen - „. :"
 * liest sich nicht, „Le point (.) :" schon. Buchstaben stehen für sich.
 */
const ZEICHEN_NAMEN_FR: Readonly<Record<string, string>> = {
  ".": "le point", ",": "la virgule", ";": "le point-virgule", ":": "les deux-points",
  "!": "le point d'exclamation", "?": "le point d'interrogation", '"': "le guillemet droit",
  "-": "le trait d'union", "(": "la parenthèse ouvrante", ")": "la parenthèse fermante",
  "'": "l'apostrophe", "^": "l'accent circonflexe", "¨": "le tréma",
  "&": "l'esperluette", _: "le tiret bas", "/": "la barre oblique", "%": "le signe pour cent",
  "+": "le signe plus", "=": "le signe égal", "*": "l'astérisque", "<": "le signe inférieur",
  ">": "le signe supérieur", "@": "l'arobase", "€": "l'euro", "[": "le crochet ouvrant",
  "]": "le crochet fermant", "{": "l'accolade ouvrante", "}": "l'accolade fermante",
  "#": "le dièse", "|": "la barre verticale", "«": "le guillemet ouvrant",
  "»": "le guillemet fermant",
};

/** Der Anfang eines Griff-Satzes: „E", „é", „Le point « . »". */
function satzAnfang(u: string): string {
  const name = ZEICHEN_NAMEN_FR[u];
  if (!name) return kappe(u);
  return `${grossFuer(name.charAt(0), "fr")}${name.slice(1)} « ${u} »`;
}

/** Eine Grundtaste im Satz: Buchstaben und Ziffern für sich, Zeichen in « » („puis « , »"). */
function tasteImSatz(k: string): string {
  return /^[\p{L}\p{N}]$/u.test(k) ? kappe(k) : `« ${k} »`;
}

/** „Q et S", „P, C et V" - die Liste für Titel und Sätze. */
function aufzaehlen(teile: readonly string[]): string {
  if (teile.length === 0) return "";
  if (teile.length === 1) return teile[0];
  return `${teile.slice(0, -1).join(", ")} et ${teile[teile.length - 1]}`;
}

function kappen(tasten: readonly string[]): string {
  return aufzaehlen(tasten.map(kappe));
}

// ── Griffe aus den Daten der Tastatur ────────────────────────────────────────

/** Finger → seine Taste in der Grundstellung, auf DIESER Tastatur. */
type HeimTasten = ReadonlyMap<FingerId, string>;

const GRUNDREIHEN_FINGER: readonly FingerId[] = [
  "kleiner-links", "ring-links", "mittel-links", "zeige-links",
  "zeige-rechts", "mittel-rechts", "ring-rechts", "kleiner-rechts",
];

/** Die Reihenfolge des Weges „fr" auf dieser Tastatur (wie `introOrder`, aber für ein beliebiges Layout). */
function reihenfolgeAuf(layout: KeyboardLayout): string[] {
  const fehlt = layoutIndex(layout).missing;
  const vorhanden = lernwegDef("fr").introOrder.filter((u) => !fehlt.has(kleinFuer(u, "fr")));
  return achteGrundtasteFuerLayout(vorhanden, "fr", layout.id);
}

function heimTasten(reihenfolge: readonly string[]): HeimTasten {
  const m = new Map<FingerId, string>();
  GRUNDREIHEN_FINGER.forEach((f, i) => m.set(f, reihenfolge[i]));
  return m;
}

const REIHE_FR = ["rangée des chiffres", "rangée du haut", "rangée de base", "rangée du bas"];

/** Wo liegt diese (Grund-)Taste? Reihe, Spalte - oder `null`, wenn die Tastatur sie nicht zeigt. */
function platz(layout: KeyboardLayout, taste: string): { reihe: number; spalte: number } | null {
  for (let r = 0; r < layout.rows.length; r++) {
    const s = layout.rows[r].keys.indexOf(taste);
    if (s >= 0) return { reihe: r, spalte: s };
  }
  return null;
}

/**
 * Die Spalte in der Zählung der Grundreihe: Die Ziffernreihe und die untere
 * Reihe (ISO, mit der Extrataste links) beginnen eine Taste weiter links.
 */
function grundreihenSpalte(layout: KeyboardLayout, reihe: number, spalte: number): number {
  if (reihe === 0) return spalte - 1;
  if (reihe === 3 && layout.rows[3].keys.length === 11) return spalte - 1;
  return spalte;
}

/** „majeur gauche, juste au-dessus de D" - Finger und Lage einer Grundtaste. */
function lage(layout: KeyboardLayout, taste: string, heim: HeimTasten): string | null {
  const p = platz(layout, taste);
  const fingerId = layoutIndex(layout).finger.get(taste);
  if (!p || !fingerId || fingerId === "daumen") return null;
  const finger = fingerName(FINGERS[fingerId], "fr");
  const h = heim.get(fingerId);
  const hp = h ? platz(layout, h) : null;
  if (!h || !hp || hp.reihe !== 2) return `${finger}, ${REIHE_FR[p.reihe]}`;
  const H = kappe(h);
  const s = grundreihenSpalte(layout, p.reihe, p.spalte);
  const abstand = Math.abs(s - hp.spalte);
  const richtung = s < hp.spalte ? "à gauche" : "à droite";
  const weit = abstand >= 3 ? "trois touches " : abstand === 2 ? "deux touches " : "";
  if (p.reihe === 2) {
    if (taste === h) return `${finger}, en position de départ`;
    return `${finger}, ${weit}${richtung} de ${H}`;
  }
  const oben = p.reihe === 3 ? "en bas" : "en haut";
  const genau = p.reihe === 3 ? "juste en dessous de" : "juste au-dessus de";
  const vorne = p.reihe === 0 ? "dans la rangée des chiffres, " : "";
  if (abstand === 0) return `${finger}, ${vorne}${genau} ${H}`;
  return `${finger}, ${vorne}${oben}${weit ? `, ${weit}` : " "}${richtung} de ${H}`;
}

/** Ein Satz: wie wird diese Einheit auf dieser Tastatur getippt? */
function griffSatz(layout: KeyboardLayout, u: string, heim: HeimTasten): string {
  const zugang = layout.access[u];
  const anfang = satzAnfang(u);
  if (zugang?.dead) {
    const wo = lage(layout, zugang.base, heim);
    const beispiel = u === "¨" ? "¨ puis i donne ï" : u === "^" ? "^ puis e donne ê" : `${u} puis la voyelle`;
    const morte =
      "C'est une touche morte : elle n'écrit rien toute seule, elle pose l'accent sur la " +
      `voyelle suivante - ${beispiel}.`;
    if (zugang.base === u && !zugang.mod) return `${anfang} : ${wo ?? "sa propre touche"}. ${morte}`;
    const mod = zugang.mod === "shift" ? "Maj de l'autre main et " : zugang.mod === "altgr" ? "Alt Gr et " : "";
    return `${anfang} : ${mod}la touche ${tasteImSatz(zugang.base)}${wo ? ` (${wo})` : ""}. ${morte}`;
  }
  if (zugang?.mod) {
    const wo = lage(layout, zugang.base, heim);
    const mod = zugang.mod === "shift" ? "Maj de l'autre main" : "Alt Gr";
    return `${anfang} : garde ${mod} enfoncée, puis ${tasteImSatz(zugang.base)}${wo ? ` (${wo})` : ""}.`;
  }
  const wo = lage(layout, u, heim);
  if (wo) return `${anfang} : ${wo}.`;
  // Nicht geraten: Die Daten dieser Tastatur zeigen keinen Griff (siehe Befund E10b-2).
  return `${anfang} : sa place sur ce clavier n'est pas encore décrite ici.`;
}

function griffeGerechnet(tasten: readonly string[], layout: KeyboardLayout, heim: HeimTasten): string {
  return tasten.map((u) => griffSatz(layout, u, heim)).join(" ");
}

// ── Die Sonderteile ──────────────────────────────────────────────────────────

const MAJ_TEIL =
  "Pour une majuscule, garde la touche Maj enfoncée avec l'AUTRE main : une lettre de la " +
  "moitié gauche du clavier demande la touche Maj de droite, une lettre de la moitié droite " +
  "la touche Maj de gauche. Les deux auriculaires s'en chargent. Seule la touche Maj de " +
  "l'autre main compte.";

function ziffernTeil(_tasten: readonly string[], layout: KeyboardLayout, heim: HeimTasten): string {
  const mitMaj = "1234567890".split("").filter((z) => layout.access[z]?.mod === "shift");
  if (mitMaj.length === 10) {
    const paare = "1234567890"
      .split("")
      .map((z) => `${z} = Maj + ${layout.access[z].base}`)
      .join(", ");
    return (
      "Sur ton clavier, les chiffres sont sur la rangée des chiffres, mais AVEC Maj de " +
      `l'autre main - sans Maj, ces touches écrivent é, è, ç, à … : ${paare}. ` +
      "Chaque doigt garde sa colonne."
    );
  }
  const exemple = lage(layout, "1", heim);
  return (
    "Sur ton clavier, les chiffres s'écrivent sans Maj. Chaque doigt monte dans sa colonne " +
    `jusqu'à la rangée des chiffres : 1 2 3 4 5 pour la main gauche, 6 7 8 9 0 pour la main droite` +
    `${exemple ? ` (1 : ${exemple})` : ""}.`
  );
}

/** Die Namen der Totasten in dieser Lektion („la touche morte accent grave"). */
const TOTASTE_FR: Readonly<Record<string, string>> = {
  "^": "accent circonflexe", "¨": "tréma", "`": "accent grave", "´": "accent aigu", "¸": "cédille",
};

/**
 * ★★★ W1 (27.09.2026, BEFUND-2026-09-27-WINDOWS-MESSUNG §3.8 Punkt 2,
 * Johannes: „Grossbuchstaben mit Akzent lehren, was die Landestastatur kann -
 * Totaste + Umschalt der Gegenhand, eigene späte Lektion nach ^, ¨ und AltGr.
 * Was die Tastatur nicht kann: weder ersetzen noch üben, Texte so auswählen,
 * dass es nicht vorkommt."). Die Lektion steht am Ende des Weges und fasst
 * die Griffe zusammen. ★ W2a (28.09.2026): Sätze mit À È Ù Ê … kommen schon
 * VORHER, je Zeichen, sobald ihre Totaste bzw. ihr AltGr-Griff gelernt ist
 * (`grossAkzentEinheiten`, corpus.ts). Die Griffe stehen je Tastatur aus
 * ihren Daten (Windows-Belegung).
 */
function grossAkzentTeil(layout: KeyboardLayout): string {
  const saetze: string[] = [];
  const direkt: string[] = [];
  const jeTotaste = new Map<string, string[]>();
  const fehlen: string[] = [];
  for (const z of ["À", "É", "È", "Ù", "Ê", "Î", "Ô", "Û", "Ë", "Ï", "Ç"]) {
    const weg = grossbuchstabeWeg(z, layout);
    if (weg === "fehlt") fehlen.push(z);
    else if (weg === "direkt") direkt.push(z);
    else if (weg === "totaste") {
      const k = kombizeichenZu(z, layout)!;
      jeTotaste.set(k.tot, [...(jeTotaste.get(k.tot) ?? []), z]);
    }
  }
  if (direkt.length > 0) {
    const caps = capsUpperFuer(layout);
    const mitCaps = direkt.filter((z) => caps.includes(kleinFuer(z, "fr")));
    const mitMaj = direkt.filter((z) => !caps.includes(kleinFuer(z, "fr")));
    if (mitMaj.length > 0) saetze.push(`${aufzaehlen(mitMaj)} : Maj de l'autre main et la lettre.`);
    if (mitCaps.length > 0)
      saetze.push(`${aufzaehlen(mitCaps)} : active Verr. Maj, tape la lettre, puis désactive Verr. Maj.`);
  }
  for (const [tot, buchstaben] of jeTotaste) {
    const zugang = layout.access[tot];
    const mod = zugang?.mod === "altgr" ? "Alt Gr + " : zugang?.mod === "shift" ? "Maj + " : "";
    // Auf AZERTY heisst die Taste „è" für die Kinder „7" (so steht es auf der
    // Kappe oben und in jeder Anleitung: „Alt Gr + 7").
    const ziffer = zugang
      ? "1234567890".split("").find((d) => layout.access[d]?.mod === "shift" && layout.access[d].base === zugang.base)
      : undefined;
    const taste = zugang ? `${mod}${ziffer ?? kappe(zugang.base)}` : tot;
    saetze.push(
      `${aufzaehlen(buchstaben)} : la touche morte ${TOTASTE_FR[tot] ?? tot} (${taste}), ` +
        "puis Maj de l'autre main et la lettre.",
    );
  }
  if (fehlen.length > 0) {
    saetze.push(
      `${aufzaehlen(fehlen)} ${fehlen.length > 1 ? "n'existent" : "n'existe"} pas sur ce clavier : ` +
        "Tastenflow ne propose pas de texte qui en a besoin.",
    );
  }
  return saetze.join(" ");
}

/** Die Lektion „Les majuscules accentuées, œ et « »": aus den Daten der Tastatur, je Zeichen. */
function typografieTeil(_tasten: readonly string[], layout: KeyboardLayout, heim: HeimTasten): string {
  const saetze: string[] = [grossAkzentTeil(layout)];
  const fehlt = layoutIndex(layout).missing;
  // ★ W1: É und À stehen jetzt im Teil oben (je Tastatur mit ihrem Griff).
  for (const z of ["œ", "«", "»"]) {
    const zugang = layout.access[z];
    const ersatz = layout.ersatz[z];
    if (zugang?.mod === "shift") {
      saetze.push(`${z} : Maj de l'autre main et ${zugang.base}.`);
    } else if (zugang?.mod === "altgr") {
      saetze.push(`${z} : Alt Gr et ${kappe(zugang.base)}.`);
    } else if (z === grossFuer(z, "fr") && capsUpperFuer(layout).includes(kleinFuer(z, "fr"))) {
      saetze.push(`${z} : active Verr. Maj, tape ${kleinFuer(z, "fr")}, puis désactive Verr. Maj.`);
    } else if (platz(layout, z)) {
      const wo = lage(layout, z, heim);
      saetze.push(`${z} a sa propre touche${wo ? ` (${wo})` : ""}.`);
    } else if (ersatz !== undefined && (fehlt.has(kleinFuer(z, "fr")) || z !== kleinFuer(z, "fr"))) {
      const statt = ersatz === '"' ? 'le guillemet droit "' : ersatz;
      saetze.push(`${z} n'a pas de touche ici : Tastenflow écrit ${statt} à la place.`);
    }
  }
  return saetze.join(" ");
}

// ── Die Folge ────────────────────────────────────────────────────────────────

const REIHE_TITEL = (tasten: readonly string[]) => kappen(tasten);

const BAUPLAENE: readonly FrLektionsBauplan[] = [
  {
    id: "fr-base-1",
    kind: "home",
    einheiten: ["f", "j"],
    titel: (t) => `La rangée de base : ${REIHE_TITEL(t)}`,
    vorspann:
      "Pose tes doigts sur la rangée de base : c'est la position de départ. Les petits " +
      "repères sur F et J te permettent de la retrouver sans regarder. On commence par ces " +
      "deux touches : les deux index. Chaque doigt part d'ici et y revient après chaque touche.",
  },
  {
    id: "fr-base-2",
    kind: "home",
    einheiten: ["d", "k"],
    titel: (t) => `La rangée de base : ${REIHE_TITEL(t)}`,
    vorspann:
      "Les majeurs rejoignent les index : D à gauche, K à droite. Les index restent sur " +
      "leurs repères.",
  },
  {
    id: "fr-base-3",
    kind: "home",
    einheiten: ["s", "l"],
    titel: (t) => `La rangée de base : ${REIHE_TITEL(t)}`,
    vorspann: "Viennent les annulaires : S à gauche, L à droite.",
  },
  {
    id: "fr-base-4",
    kind: "home",
    einheiten: ["q", "m"],
    titel: (t) => `La rangée de base au complet : ${REIHE_TITEL(t)}`,
    vorspann:
      "La rangée de base est complète : huit doigts sur huit touches, et les pouces sur la " +
      "barre d'espace. D'ici, tu peux toujours retrouver ta place.",
  },
  {
    id: "fr-frequentes-1",
    kind: "letters",
    einheiten: ["e", "t"],
    titel: (t) => `Les lettres fréquentes : ${REIHE_TITEL(t)}`,
    vorspann:
      "E est la lettre la plus fréquente du français. Avec E et T, les premiers vrais mots " +
      "arrivent : « le », « de », « les », « des », « et », « est », « elle ».",
  },
  {
    id: "fr-frequentes-2",
    kind: "letters",
    einheiten: ["n", "u"],
    titel: (t) => `Les lettres fréquentes : ${REIHE_TITEL(t)}`,
    vorspann:
      "N et U ouvrent beaucoup de petits mots : « un », « une », « en », « du », « tu », " +
      "« lune », « dune ».",
  },
  {
    id: "fr-frequentes-3",
    kind: "letters",
    einheiten: ["i", "a"],
    titel: (t) => `Les lettres fréquentes : ${REIHE_TITEL(t)}`,
    vorspann:
      "Avec ces lettres, tu écris déjà « il », « la », « lit », « lundi », « salade », « ile ».",
  },
  {
    id: "fr-frequentes-4",
    kind: "letters",
    einheiten: ["o", "r"],
    titel: (t) => `Les lettres fréquentes : ${REIHE_TITEL(t)}`,
    vorspann:
      "O et R complètent les lettres les plus fréquentes. Presque tous les petits mots sont " +
      "là : « on », « rue », « roi », « trois », « route », « tortue », « dort ».",
  },
  {
    id: "fr-pcv",
    kind: "letters",
    einheiten: ["p", "c", "v"],
    titel: (t) => `Premières phrases : ${REIHE_TITEL(t)}`,
    vorspann:
      "Avec P, C et V, les premières vraies phrases deviennent possibles : « pour », " +
      "« avec », « voir », « cour », « porte », « lapin », « vite ».",
  },
  {
    id: "fr-elision",
    kind: "letters",
    einheiten: ["'", "é"],
    titel: (t) =>
      t.includes("é") && t.includes("'")
        ? "L'apostrophe et l'accent aigu : ' et é"
        : t.includes("é")
          ? "L'accent aigu : é"
          : "L'apostrophe : '",
    vorspann:
      "L'apostrophe relie deux mots quand le premier perd sa voyelle : « l'eau », « j'ai », " +
      "« c'est », « d'une », « s'il ». Avec é, tu écris « été », « idée », « café », « clé », " +
      "« étoile ».",
    // Kanada: der Apostroph braucht Maj und kommt erst mit der Lektion Maj.
    vorspannFuer: (t) =>
      t.includes("'") ? undefined : "Avec é, tu écris « été », « idée », « café », « clé », « étoile ».",
  },
  {
    id: "fr-maj",
    kind: "shift",
    einheiten: [],
    enablesShift: true,
    titel: () => "Les majuscules avec la touche Maj",
    vorspann:
      "Jusqu'ici, Tastenflow mettait les majuscules pour toi. Maintenant, c'est ta main qui " +
      "les écrit : « Léa », « Tu », « Il ».",
    // ★ S2 (26.09.2026): auf Kanada kommt hier auch der Apostroph (Maj + ,).
    griffe: (t, l, h) => (t.length ? `${MAJ_TEIL} ${griffeGerechnet(t, l, h)}` : MAJ_TEIL),
    vorspannFuer: (t) =>
      t.includes("'")
        ? "Jusqu'ici, Tastenflow mettait les majuscules pour toi. Maintenant, c'est ta main qui " +
          "les écrit : « Léa », « Tu », « Il ». Sur ton clavier, l'apostrophe se tape aussi avec " +
          "Maj : « l'eau », « j'ai », « c'est »."
        : undefined,
  },
  // ★★★ D-1 (28.09.2026, Didaktik-Synthese): Punkt und Komma direkt nach Maj
  // - „Les majuscules et le point" (Alpha et Oméga L8-L10, Pix Junior: Majuscule
  // und Satzschlusszeichen sind im Programm des CP die zwei Marker des
  // Satzes). Auf AZERTY liegt der Punkt selbst auf Maj + ; - er gehört genau
  // hierher. Die ID bleibt (Fortschritt der Kinder), nur der Platz und die
  // Tasten sind neu; „;" und „:" sind in `fr-ponctuation-2` gewandert.
  {
    id: "fr-ponctuation-1",
    kind: "punctuation",
    einheiten: [".", ","],
    titel: (t) => `Le point et la virgule : ${t.join(" ")}`,
    vorspann:
      "Une phrase commence par une majuscule et se termine par un point. La virgule la " +
      "découpe. Après le point et après la virgule vient une espace.",
  },
  {
    id: "fr-bgh",
    kind: "letters",
    einheiten: ["b", "g", "h"],
    titel: (t) => `D'autres lettres : ${REIHE_TITEL(t)}`,
    vorspann:
      "B, G et H : « bon », « bien », « grand », « gare », « chat », « chien », « heure », " +
      "« hibou ».",
  },
  {
    id: "fr-q-m",
    kind: "letters",
    einheiten: [],
    fuerVerdraengte: true,
    titel: (t) => `Deux lettres à leur place : ${REIHE_TITEL(t)}`,
    vorspann:
      "Sur ton clavier, Q et M ne sont pas sur la rangée de base : ils arrivent maintenant. " +
      "Avec eux : « que », « qui », « quand », « maman », « mer », « ami ».",
    // Schweiz/Kanada: „m" kam schon mit „p c v" (S1) - hier nur noch „q".
    vorspannFuer: (t) =>
      t.includes("m")
        ? undefined
        : "Sur ton clavier, Q n'est pas sur la rangée de base : il arrive maintenant. " +
          "Avec lui : « que », « qui », « quand », « quatre », « question ».",
  },
  {
    id: "fr-a-grave",
    kind: "letters",
    einheiten: ["à"],
    titel: () => "La lettre à",
    vorspann:
      "Le petit mot « à » est partout, et il se cache aussi dans d'autres : « là », " +
      "« voilà », « déjà ».",
  },
  {
    id: "fr-circonflexe",
    kind: "letters",
    einheiten: ["^"],
    titel: () => "L'accent circonflexe : ê, â, î, ô, û",
    vorspann:
      "L'accent circonflexe se pose sur la voyelle qui suit : « fête », « tête », « être », " +
      "« forêt », « gâteau », « côte », « hôpital ». Avec la nouvelle orthographe, i et u le " +
      "perdent presque toujours : « ile », « gout ».",
  },
  {
    id: "fr-e-grave",
    kind: "letters",
    einheiten: ["è"],
    titel: () => "La lettre è",
    vorspann:
      "L'accent grave sur le e : « père », « mère », « frère », « très », « après », « lèvre ».",
  },
  {
    id: "fr-rares-1",
    kind: "letters",
    einheiten: ["x", "z", "y"],
    titel: (t) => `Des lettres plus rares : ${REIHE_TITEL(t)}`,
    vorspann:
      "Plus rares, mais bien utiles : « deux », « dix », « taxi », « zéro », « zoo », " +
      "« yeux », « stylo », « pyjama ».",
  },
  {
    id: "fr-rares-2",
    kind: "letters",
    einheiten: ["ç", "ù", "w"],
    titel: (t) => `Des lettres plus rares : ${REIHE_TITEL(t)}`,
    vorspann:
      "La cédille garde au c le son « s » devant a, o et u : « ça », « garçon », « leçon », " +
      "« reçu ». Le ù ne sert que dans « où ». W vient souvent d'autres langues : « wagon », " +
      "« kiwi ».",
  },
  {
    id: "fr-trema",
    kind: "letters",
    einheiten: ["¨"],
    titel: () => "Le tréma : ë, ï, ü",
    vorspann:
      "Le tréma dit que deux voyelles se prononcent séparément : « maïs », « naïf », « aïe », " +
      "« ouïe », « Maëlle », « Loïc ». Comme l'accent circonflexe, c'est une touche morte.",
  },
  {
    id: "fr-ponctuation-2",
    kind: "punctuation",
    // ★ D-1 (28.09.2026): „;" und „:" aus `fr-ponctuation-1` hierher (dort
    // stehen seither nur Punkt und Komma, direkt nach Maj).
    einheiten: [";", ":", "!", "?", '"', "-", "(", ")"],
    titel: (t) => `La ponctuation : ${t.join(" ")}`,
    vorspann:
      "Le point-virgule et les deux-points découpent une phrase. Puis les signes pour une " +
      "question, une surprise, une parole rapportée, un mot composé comme « arc-en-ciel » " +
      "ou une précision entre parenthèses.",
  },
  {
    id: "fr-chiffres",
    kind: "numbers",
    einheiten: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    titel: () => "Les chiffres de 1 à 0",
    vorspann:
      "Les chiffres sont sur la rangée la plus haute, la plus loin de la position de départ : " +
      "c'est pour cela qu'ils viennent si tard.",
    griffe: ziffernTeil,
  },
  {
    id: "fr-speciaux-1",
    kind: "symbols",
    einheiten: ["&", "_", "/", "%", "+", "=", "*", "<", ">"],
    titel: (t) => `Les caractères spéciaux : ${t.join(" ")}`,
    vorspann:
      "Les caractères pour calculer et pour écrire à l'ordinateur. Prends ton temps : ici, " +
      "la précision compte plus que la vitesse.",
  },
  {
    id: "fr-speciaux-2",
    kind: "symbols",
    einheiten: ["@", "€", "[", "]", "{", "}", "#", "|"],
    titel: (t) => `D'autres caractères spéciaux : ${t.join(" ")}`,
    vorspann:
      "Les caractères des adresses e-mail, des prix et du code. Ce sont les plus difficiles " +
      "du clavier - ils viennent en dernier. Alt Gr est la touche à droite de la barre d'espace.",
  },
  {
    id: "fr-typographie",
    kind: "text",
    einheiten: [],
    corpusKinds: ["satz"],
    // ★ W1 (27.09.2026): die späte, eigene Lektion der Grossbuchstaben mit
    // Akzent (Johannes §3.8) - vorher „É, À, œ et « »" mit Ersatzschreibweise.
    titel: () => "Les majuscules accentuées, œ et « »",
    vorspann:
      "En français, l'accent reste sur la majuscule. Sur ton clavier, une majuscule " +
      "accentuée s'écrit souvent avec une touche morte : elle n'écrit rien toute seule, " +
      "puis tu tapes la lettre avec Maj de l'autre main. Les phrases de cette leçon en " +
      "contiennent. Voici comment ton clavier s'y prend, et ce qu'il ne sait pas faire.",
    griffe: typografieTeil,
  },
];

// ── Bauen je Tastatur ────────────────────────────────────────────────────────

/** Die Folge der Bauplan-IDs, zum Nachprüfen im Wächter. */
export const FR_LEKTIONS_IDS: readonly string[] = BAUPLAENE.map((b) => b.id);

/**
 * Der GESCHRIEBENE Teil jeder Einführung (ohne die gerechneten Griffe) - für
 * den Wächter, der jedes Beispielwort zwischen « » gegen den Tastenstand der
 * Lektion prüft.
 */
/**
 * ★ S1/S2 (26.09.2026): der erste Absatz, wie er auf einer Tastatur mit DIESEN
 * Tasten der Lektion wirklich erscheint (`vorspannFuer`, sonst `vorspann`) -
 * für den Beispielwort-Wächter je Tastatur.
 */
export function frLektionsVorspannFuer(id: string, tasten: readonly string[]): string {
  const b = BAUPLAENE.find((x) => x.id === id);
  if (!b) return "";
  return b.vorspannFuer?.(tasten) ?? b.vorspann;
}

export const FR_LEKTIONS_VORSPANN: Readonly<Record<string, string>> = Object.fromEntries(
  BAUPLAENE.map((b) => [b.id, b.vorspann]),
);

/**
 * Die Tasten jeder Lektion auf dieser Tastatur - mit derselben Abbildung wie
 * {@link achteGrundtasteFuerLayout}: erste und achte Grundtaste ersetzt,
 * Doppelte weg, Verdrängtes („q m") in die Lektion {@link FrLektionsBauplan.fuerVerdraengte}.
 */
function tastenJeLektion(layout: KeyboardLayout): Map<string, string[]> {
  const reihenfolge = reihenfolgeAuf(layout);
  const vorhanden = new Set(reihenfolge);
  const kanon = lernwegDef("fr").introOrder;
  // ★ 26.09.2026: erste Grundtaste am WERT („q"), nicht an Stelle 0 - die
  // Grundreihe steht jetzt in der Anker-Folge f j d k s l q m.
  const erste = "q";
  const achte = kanon[lernwegDef("fr").homeRowLetters - 1];
  const vergeben = new Set<string>();
  const out = new Map<string, string[]>();
  for (const b of BAUPLAENE) {
    const tasten: string[] = [];
    for (const u of b.einheiten) {
      const hier = u === erste ? reihenfolge[kanon.indexOf(erste)] : u === achte ? reihenfolge[lernwegDef("fr").homeRowLetters - 1] : u;
      if (!vorhanden.has(hier) || vergeben.has(hier)) continue;
      vergeben.add(hier);
      tasten.push(hier);
    }
    out.set(b.id, tasten);
  }
  // Was übrig ist (Schweiz/Kanada: „q m"), kommt in die eigene Lektion - in
  // der Reihenfolge dieser Tastatur.
  const rest = reihenfolge.filter((u) => u !== SHIFT_UNIT && !vergeben.has(u));
  const ziel = BAUPLAENE.find((b) => b.fuerVerdraengte);
  if (ziel) out.set(ziel.id, rest);
  return inFolgeDerTastatur(reihenfolge, out);
}

/**
 * ★ S1/S2 (Mechanik-Prüfung fr, 26.09.2026): Die Lektionen folgen der Folge
 * DIESER Tastatur, auch wo sie vom Bauplan abweicht - „m" steht auf
 * Schweiz/Kanada direkt nach „p" (E5 §8.2), der Apostroph auf Kanada nach
 * „⇧" (dort Umschalt + Komma). Regel beim Durchgehen der Folge:
 *  · eine Einheit, deren geplante Lektion schon VORBEI ist (Apostroph nach
 *    „⇧"), kommt in die gerade laufende Lektion;
 *  · eine Einheit, die FRÜHER kommt als geplant (die nächste Einheit gehört
 *    wieder zu einer früheren Lektion - „m" zwischen „p" und „c"), ebenso.
 * Auf AZERTY ist die Folge schon im Plan - dort ändert sich nichts.
 */
function inFolgeDerTastatur(
  reihenfolge: readonly string[],
  geplant: Map<string, string[]>,
): Map<string, string[]> {
  const index = new Map(BAUPLAENE.map((b, i) => [b.id, i] as const));
  const lektionVon = new Map<string, number>();
  for (const [id, tasten] of geplant) for (const u of tasten) lektionVon.set(u, index.get(id)!);
  const maj = BAUPLAENE.findIndex((b) => b.enablesShift);
  if (maj >= 0) lektionVon.set(SHIFT_UNIT, maj);
  const folge = reihenfolge.filter((u) => lektionVon.has(u));
  const neu = new Map<string, string[]>(BAUPLAENE.map((b) => [b.id, []]));
  let jetzt = 0;
  folge.forEach((u, k) => {
    const p = lektionVon.get(u)!;
    const naechste = k + 1 < folge.length ? lektionVon.get(folge[k + 1])! : Infinity;
    // „⇧" ist der feste Anker seiner Lektion - nie „zu früh".
    const zuFrueh = u !== SHIFT_UNIT && p > jetzt && naechste < p;
    const zuSpaet = p < jetzt;
    const l = zuFrueh || zuSpaet ? jetzt : p;
    jetzt = l;
    if (u !== SHIFT_UNIT) neu.get(BAUPLAENE[l].id)!.push(u);
  });
  return neu;
}

function baueLektionen(layout: KeyboardLayout): Lesson[] {
  const reihenfolge = reihenfolgeAuf(layout);
  const heim = heimTasten(reihenfolge);
  const tastenJe = tastenJeLektion(layout);
  const out: Lesson[] = [];
  for (const b of BAUPLAENE) {
    const tasten = tastenJe.get(b.id) ?? [];
    if (b.fuerVerdraengte && tasten.length === 0) continue; // auf AZERTY gibt es sie nicht
    const griffe = b.griffe ? b.griffe(tasten, layout, heim) : griffeGerechnet(tasten, layout, heim);
    const lektion: Lesson = {
      id: b.id,
      title: b.titel(tasten, layout),
      kind: b.kind,
      newKeys: tasten,
      intro: (() => {
        const vorspann = b.vorspannFuer?.(tasten) ?? b.vorspann;
        return griffe ? `${vorspann} ${griffe}` : vorspann;
      })(),
    };
    if (b.enablesShift) lektion.enablesShift = true;
    if (b.corpusKinds) lektion.corpusKinds = b.corpusKinds;
    out.push(lektion);
  }
  return out;
}

/** Die französischen Tastaturen, für die eine Einführung eigens gerechnet wird. */
const FR_LAYOUTS: readonly LayoutId[] = ["fr", "be", "ch-fr", "ca-csa", "ca-fr"];

const CACHE = new Map<LayoutId, readonly Lesson[]>();

/**
 * Die Lektionen des Weges „fr" auf dieser Tastatur. Gecacht, damit
 * `lektionenFuer("fr")` bei gleicher Tastatur immer DIESELBE Liste liefert.
 * Jede Lektion trägt in {@link Lesson.introByLayout} die Einführungen der
 * anderen französischen Tastaturen (für `lessonIntroText`), wo sie abweichen.
 */
export function frLektionenFuerLayout(layoutId: LayoutId): readonly Lesson[] {
  const cached = CACHE.get(layoutId);
  if (cached) return cached;
  const eigene = baueLektionen(layoutById(layoutId));
  const andere = FR_LAYOUTS.filter((id) => id !== layoutId).map(
    (id) => [id, new Map(baueLektionen(layoutById(id)).map((l) => [l.id, l.intro]))] as const,
  );
  for (const l of eigene) {
    const je: Partial<Record<LayoutId, string>> = {};
    for (const [id, intros] of andere) {
      const text = intros.get(l.id);
      if (text !== undefined && text !== l.intro) je[id] = text;
    }
    if (Object.keys(je).length > 0) l.introByLayout = je;
  }
  const fertig = Object.freeze(eigene);
  CACHE.set(layoutId, fertig);
  return fertig;
}
