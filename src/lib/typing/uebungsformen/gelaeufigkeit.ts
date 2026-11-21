/**
 * Geläufigkeitsschreiben - häufige Buchstabenverbindungen (`-er`, `-ung`,
 * `-lich`, `-keit` …) automatisieren.
 *
 * ⚠️ KEINE Übungsform: Aus der Bauanleitung
 * (`AUFTRAG-2026-09-02-UEBUNGSFORMEN-CHARGE-A-UND-B.md` §2, Punkt 1) - „Diese
 * eine gehört nicht auf die Angebots-Karte, sondern in den Generator - sie ist
 * kein Spiel, sondern der Kern des Zehnfingerschreibens." Alphabet-Reihen,
 * Pyramide & Co. sind ABWECHSLUNG, die man sich holt; dieselbe Fingerfolge
 * mehrmals kurz hintereinander zu tippen ist dagegen genau das, was
 * Zehnfingerschreiben automatisiert - das gehört in den GEWÖHNLICHEN
 * Übungslauf, nicht in eine Auswahl, die man auch überspringen kann.
 *
 * Deshalb liefert diese Datei keine `Uebungsform`, sondern reine Bausteine:
 * eine Liste häufiger Verbindungen mit echten Wörtern, die sie enthalten, und
 * eine Funktion, die daraus eine Zeile mit mehreren Wörtern DERSELBEN
 * Verbindung baut (der Übungswert liegt genau in der Wiederholung). Der
 * Einbau in `generator.ts` - wo im Übungslauf diese Zeilen erscheinen -
 * gehört nicht zu diesem Baustein.
 */
import { fitText, nurKleinschrift } from "../corpus";
import { kleinFuer } from "../sprachRegister";
import type { InhaltsStufe, Lang, Stufe } from "../account";
import { contentStufenFor } from "../account";
import { englischVariante, wandleSchreibweise } from "../schreibweise";
import { VERBINDUNGEN_FR } from "./gelaeufigkeitFr";
import { VERBINDUNGEN_ES } from "./gelaeufigkeitEs";
import { VERBINDUNGEN_IT } from "./gelaeufigkeitIt";
import { VERBINDUNGEN_PL } from "./gelaeufigkeitPl";
import { VERBINDUNGEN_TR } from "./gelaeufigkeitTr";
import { VERBINDUNGEN_CS } from "./gelaeufigkeitCs";
// ★ G3c-VERTEILER (25.10.2026): die neun Gerüst-Wege haben je eine eigene, noch leere Datei (`gelaeufigkeit<Xx>.ts`).
import { VERBINDUNGEN_BG } from "./gelaeufigkeitBg";
import { VERBINDUNGEN_EL } from "./gelaeufigkeitEl";
import { VERBINDUNGEN_HU } from "./gelaeufigkeitHu";
import { VERBINDUNGEN_NL } from "./gelaeufigkeitNl";
import { VERBINDUNGEN_PT } from "./gelaeufigkeitPt";
import { VERBINDUNGEN_BR } from "./gelaeufigkeitBr";
import { VERBINDUNGEN_RO } from "./gelaeufigkeitRo";
import { VERBINDUNGEN_SV } from "./gelaeufigkeitSv";
import { VERBINDUNGEN_UK } from "./gelaeufigkeitUk";
import { eigenOderEn } from "../geruestRueckfall";
import type { Lernweg } from "../lernweg";

/** Eine häufige Buchstabenverbindung mit den Wörtern, in denen sie steckt. */
export interface Verbindung {
  /** Die Verbindung selbst, z. B. `ung`. */
  folge: string;
  /** Wo sie steht - danach richtet sich, welche Wörter passen. */
  stelle: "anfang" | "mitte" | "ende";
  /** Wörter, die sie enthalten. Echte Wörter, kein Unsinn. */
  woerter: string[];
}

/**
 * Deutsche Verbindungen. Alle Wörter sind echte Alltagswörter, korrekt
 * geschrieben (Nomen groß, alles andere klein) - genau so, wie ein Kind sie
 * später in einem Satz antreffen würde.
 */
export const VERBINDUNGEN_DE: Verbindung[] = [
  { folge: "er", stelle: "ende", woerter: ["Wasser", "Finger", "Sommer", "Winter", "Feuer", "Lehrer", "Schüler", "Computer"] },
  { folge: "en", stelle: "ende", woerter: ["Regen", "Garten", "Wagen", "backen", "laufen", "Kuchen", "Drachen", "kochen"] },
  { folge: "ch", stelle: "mitte", woerter: ["Küche", "Kuchen", "Kirche", "Rachen", "Achtung", "Sprache"] },
  { folge: "ei", stelle: "mitte", woerter: ["Arbeit", "Freizeit", "Kleidung", "Feier", "Reise", "Meister", "Zeit"] },
  { folge: "ie", stelle: "mitte", woerter: ["Wiese", "Liebe", "Fliege", "Miete", "Biene", "Spiegel"] },
  { folge: "sch", stelle: "anfang", woerter: ["Schule", "Schwester", "Schnee", "Schiff", "Schaf", "Schlüssel", "Schrank"] },
  { folge: "ung", stelle: "ende", woerter: ["Übung", "Zeitung", "Meinung", "Ordnung", "Wohnung", "Achtung", "Rechnung"] },
  { folge: "lich", stelle: "ende", woerter: ["fröhlich", "möglich", "freundlich", "wirklich", "plötzlich", "endlich", "natürlich"] },
  { folge: "keit", stelle: "ende", woerter: ["Traurigkeit", "Höflichkeit", "Tapferkeit", "Neuigkeit", "Einigkeit", "Wichtigkeit"] },
  { folge: "heit", stelle: "ende", woerter: ["Freiheit", "Gesundheit", "Wahrheit", "Klarheit", "Dunkelheit", "Sicherheit", "Schönheit"] },
  { folge: "st", stelle: "mitte", woerter: ["Fenster", "Meister", "Ostern", "Kastanie", "Fastnacht", "Verstand"] },
  { folge: "nd", stelle: "mitte", woerter: ["Kinder", "Freunde", "Rinder", "Winde", "Wunder", "Kindergarten"] },
  { folge: "ge", stelle: "anfang", woerter: ["Geld", "Geschenk", "Gesicht", "Gemüse", "Geburtstag", "Gewitter", "Geschichte"] },
  { folge: "be", stelle: "anfang", woerter: ["Besuch", "Beruf", "Beispiel", "Bericht", "Becher", "Beere"] },
  { folge: "ver", stelle: "anfang", woerter: ["Verein", "Verkehr", "Versuch", "Verlust", "Verbot", "Verstand", "Vertrag"] },
  { folge: "te", stelle: "ende", woerter: ["Karte", "Torte", "Seite", "Wüste", "Kiste", "Liste", "Rakete"] },
  { folge: "in", stelle: "mitte", woerter: ["Kinder", "Finger", "Kind", "Winter", "Rinde", "Linde"] },
  { folge: "au", stelle: "mitte", woerter: ["Baum", "Haus", "Maus", "Pause", "sauber", "Zauber"] },
  { folge: "eu", stelle: "mitte", woerter: ["Freund", "Feuer", "Freude", "Beute", "heute", "Leute"] },
  { folge: "ss", stelle: "mitte", woerter: ["Wasser", "Kissen", "Schlüssel", "Nüsse", "Tasse", "Klasse"] },
  { folge: "tz", stelle: "mitte", woerter: ["Katze", "Mütze", "Sitzung", "trotzdem", "schwitzen", "blitzen"] },
  { folge: "ck", stelle: "mitte", woerter: ["Zucker", "Decke", "Ecke", "Backen", "Jacke", "Socke"] },

  // ── Charge 2 (02.09.2026): verdoppelt auf Johannes' Auftrag ──────────
  // Schwerpunkt hier: DOPPELKONSONANTEN (derselbe Finger zweimal - genau die
  // Bewegung, die am Anfang stockt) und die haeufigen Vor- und Nachsilben.
  { folge: "sp", stelle: "anfang", woerter: ["Spiel", "Sport", "Sprache", "Spinne", "Spaten", "Spatz", "Spiegel", "Sparen"] },
  { folge: "pf", stelle: "mitte", woerter: ["Apfel", "Zipfel", "Gipfel", "Tropfen", "Schnupfen", "Kupfer", "Töpfe", "Köpfe"] },
  { folge: "ng", stelle: "mitte", woerter: ["Finger", "Angel", "Hunger", "Zange", "Schlange", "Wange", "Sänger", "Ringe"] },
  { folge: "nk", stelle: "mitte", woerter: ["Danke", "denken", "trinken", "Onkel", "Funke", "Schranke", "Enkel", "winken"] },
  { folge: "ll", stelle: "mitte", woerter: ["alle", "Halle", "Quelle", "Stelle", "Welle", "Teller", "Keller", "voller"] },
  { folge: "mm", stelle: "mitte", woerter: ["Sommer", "Hammer", "Stimme", "immer", "Kammer", "sammeln", "Trommel", "Kummer"] },
  { folge: "tt", stelle: "mitte", woerter: ["Mutter", "Butter", "bitte", "Wetter", "Gitter", "Futter", "Retter", "Blatter"] },
  { folge: "ff", stelle: "mitte", woerter: ["Affe", "Koffer", "offen", "Waffel", "Löffel", "treffen", "schaffen", "Stoffe"] },
  { folge: "pp", stelle: "mitte", woerter: ["Puppe", "Suppe", "Treppe", "Lippe", "Kappe", "Mappe", "Klappe", "Rippe"] },
  { folge: "nn", stelle: "mitte", woerter: ["Sonne", "Tanne", "Kanne", "Wanne", "Brunnen", "Sinne", "rennen", "Spinne"] },
  { folge: "äu", stelle: "mitte", woerter: ["Bäume", "Häuser", "Mäuse", "Räume", "Träume", "läuft", "Verkäufer", "Gebäude"] },
  { folge: "ah", stelle: "mitte", woerter: ["Zahlen", "Fahrrad", "Bahnhof", "Sahne", "nahe", "Zahnarzt", "mahlen", "Wahrheit"] },
  { folge: "eh", stelle: "mitte", woerter: ["sehen", "gehen", "nehmen", "mehr", "Lehrer", "Zehen", "fehlen", "Mehl"] },
  { folge: "ent", stelle: "anfang", woerter: ["entdecken", "entlang", "entfernen", "entstehen", "entscheiden", "entweder"] },
  { folge: "vor", stelle: "anfang", woerter: ["vorne", "vorbei", "Vorhang", "vorlesen", "Vormittag", "Vorsicht", "vorsichtig"] },
  { folge: "zu", stelle: "anfang", woerter: ["Zucker", "zusammen", "zuerst", "zufrieden", "Zunge", "zuhören", "Zukunft"] },
  { folge: "aus", stelle: "anfang", woerter: ["Ausflug", "ausruhen", "Ausgang", "Auskunft", "ausmachen", "Ausweis", "auspacken"] },
  { folge: "üb", stelle: "anfang", woerter: ["üben", "über", "Übung", "überall", "übrig", "Überraschung", "überlegen"] },
  { folge: "chen", stelle: "ende", woerter: ["Mädchen", "Kaninchen", "Kätzchen", "Märchen", "Brötchen", "Häuschen", "Blümchen"] },
  { folge: "ig", stelle: "ende", woerter: ["richtig", "wichtig", "fertig", "lustig", "ruhig", "mutig", "traurig", "eilig"] },
  { folge: "bar", stelle: "ende", woerter: ["hörbar", "essbar", "machbar", "sichtbar", "dankbar", "wunderbar", "haltbar"] },
  { folge: "sam", stelle: "ende", woerter: ["langsam", "gemeinsam", "sparsam", "aufmerksam", "einsam", "seltsam", "wachsam"] },
];

/**
 * Englische Verbindungen. Wörter bleiben klein - im Englischen werden Nomen
 * nicht großgeschrieben (siehe `caseWord` in `generator.ts`).
 */
export const VERBINDUNGEN_EN: Verbindung[] = [
  { folge: "th", stelle: "anfang", woerter: ["think", "thanks", "three", "throw", "thumb", "thunder", "thick"] },
  { folge: "ing", stelle: "ende", woerter: ["running", "sleeping", "morning", "evening", "reading", "singing", "playing"] },
  { folge: "er", stelle: "ende", woerter: ["winter", "summer", "water", "paper", "finger", "teacher", "computer"] },
  { folge: "and", stelle: "mitte", woerter: ["candy", "grandma", "handsome", "bandage", "sandwich", "standard"] },
  { folge: "tion", stelle: "ende", woerter: ["station", "nation", "action", "motion", "question", "vacation", "education"] },
  { folge: "ent", stelle: "ende", woerter: ["student", "parent", "moment", "present", "silent", "different"] },
  { folge: "ould", stelle: "mitte", woerter: ["shoulder", "boulder", "smoulder", "wouldn't", "couldn't", "shouldn't"] },
  { folge: "ight", stelle: "ende", woerter: ["night", "light", "right", "sight", "bright", "flight", "knight"] },
  { folge: "ll", stelle: "mitte", woerter: ["pillow", "yellow", "balloon", "hello", "gallery", "village"] },
  { folge: "ck", stelle: "ende", woerter: ["black", "clock", "quick", "truck", "snack", "duck"] },
  { folge: "sh", stelle: "anfang", woerter: ["shoe", "shirt", "shark", "sheep", "shadow", "shower", "shelf"] },
  { folge: "ch", stelle: "anfang", woerter: ["chair", "cheese", "child", "choose", "chicken", "chocolate"] },

  // ── Batch 2 (02.09.2026): brought up to the German level -------------
  { folge: "ea", stelle: "mitte", woerter: ["bread", "dream", "teacher", "please", "weather", "breakfast", "season"] },
  { folge: "oo", stelle: "mitte", woerter: ["book", "food", "moon", "school", "spoon", "cool", "room", "wooden"] },
  { folge: "ee", stelle: "mitte", woerter: ["green", "between", "sleep", "street", "weekend", "cheese", "sweeter", "sweep"] },
  { folge: "ai", stelle: "mitte", woerter: ["rain", "train", "paint", "chair", "again", "waiting", "mountain"] },
  { folge: "ou", stelle: "mitte", woerter: ["house", "mouse", "round", "cloud", "mouth", "about", "sound", "ground"] },
  { folge: "ow", stelle: "ende", woerter: ["yellow", "follow", "snow", "know", "throw", "slow", "tomorrow", "window"] },
  { folge: "ar", stelle: "mitte", woerter: ["party", "garden", "market", "farmer", "carpet", "target", "started"] },
  { folge: "or", stelle: "mitte", woerter: ["morning", "story", "sorry", "forest", "corner", "important", "border"] },
  { folge: "ir", stelle: "mitte", woerter: ["bird", "girl", "first", "shirt", "thirty", "circle", "birthday"] },
  { folge: "ur", stelle: "mitte", woerter: ["turtle", "purple", "burger", "curtain", "Thursday", "hurry", "return"] },
  { folge: "wh", stelle: "anfang", woerter: ["what", "when", "where", "white", "wheel", "whisper", "whale", "wheat"] },
  { folge: "ph", stelle: "mitte", woerter: ["elephant", "dolphin", "alphabet", "telephone", "nephew", "orphan"] },
  { folge: "qu", stelle: "anfang", woerter: ["queen", "quick", "question", "quiet", "quarter", "quilt"] },
  { folge: "str", stelle: "anfang", woerter: ["street", "strong", "string", "strange", "straw", "stream", "stripe"] },
  { folge: "spr", stelle: "anfang", woerter: ["spring", "spray", "spread", "sprint", "sprout", "spruce"] },
  { folge: "scr", stelle: "anfang", woerter: ["screen", "scratch", "scream", "script", "screw", "scrub"] },
  { folge: "tch", stelle: "mitte", woerter: ["kitchen", "matches", "catching", "watching", "butcher", "pitcher"] },
  { folge: "dge", stelle: "ende", woerter: ["bridge", "fridge", "edge", "judge", "badge", "hedge"] },
  { folge: "ay", stelle: "ende", woerter: ["day", "play", "away", "today", "birthday", "holiday", "Monday"] },
  { folge: "ey", stelle: "ende", woerter: ["key", "money", "honey", "monkey", "journey", "valley", "turkey"] },
  { folge: "ly", stelle: "ende", woerter: ["slowly", "quickly", "friendly", "lovely", "really", "family", "lonely"] },
  { folge: "ful", stelle: "ende", woerter: ["beautiful", "careful", "helpful", "wonderful", "useful", "peaceful"] },
  { folge: "less", stelle: "ende", woerter: ["careless", "helpless", "endless", "useless", "homeless", "restless"] },
  { folge: "ness", stelle: "ende", woerter: ["happiness", "kindness", "darkness", "illness", "business", "sadness"] },
  { folge: "ment", stelle: "ende", woerter: ["moment", "movement", "agreement", "apartment", "equipment", "payment"] },
  { folge: "able", stelle: "ende", woerter: ["table", "comfortable", "available", "reasonable", "vegetable", "capable"] },
  { folge: "est", stelle: "ende", woerter: ["biggest", "fastest", "smallest", "longest", "nearest", "kindest"] },
  { folge: "ers", stelle: "ende", woerter: ["teachers", "fingers", "brothers", "letters", "numbers", "flowers"] },
  { folge: "ies", stelle: "ende", woerter: ["stories", "families", "cities", "babies", "countries", "berries"] },
  { folge: "nk", stelle: "mitte", woerter: ["thanks", "thinking", "drinking", "banker", "pinkish", "blanket"] },
  { folge: "mp", stelle: "mitte", woerter: ["simple", "important", "campfire", "temple", "empty", "jumping"] },
  { folge: "gh", stelle: "mitte", woerter: ["night", "light", "laughter", "daughter", "neighbour", "weight", "bright"] },
];

/**
 * Ab wie vielen Zeichen ein Wort für diese Inhalts-Stufe zu erwachsen ist.
 * Bewusst einfach gehalten (Zeichenlänge statt Wortschatz-Prüfung je Wort) -
 * aber sichtbar: „Kindergarten" (12) taugt nicht für `kids`, „Winter" (6)
 * schon. `erwachsen` bekommt keine Grenze.
 */
const MAX_WORTLAENGE: Record<InhaltsStufe, number> = {
  kids: 6,
  teens: 10,
  erwachsen: Infinity,
};

function stufeErlaubtWort(wort: string, etikett: InhaltsStufe): boolean {
  return wort.length <= MAX_WORTLAENGE[etikett];
}

/** Zufalls-Index 0..n-1, robust gegen `zufall() === 1`. */
function zufallIndex(zufall: () => number, n: number): number {
  return Math.min(n - 1, Math.max(0, Math.floor(zufall() * n)));
}

/**
 * ★ E10b (25.09.2026, Bauplan französischer Lehrgang §2.3 Punkt 4): eine
 * Tabelle statt der Zwei-Wege-Ternäre (nur „en" oder sonst Deutsch) - die
 * Ternäre gab für „fr" still den deutschen Vorrat zurück. ★ E10b-2
 * (26.09.2026): „fr" hat jetzt eigene Verbindungen (`gelaeufigkeitFr.ts`).
 */
// ★ ES-W (27.09.2026): „es" hat eigene Verbindungen (`gelaeufigkeitEs.ts`).
const VERBINDUNGEN: Record<Lang, Verbindung[]> = {
  de: VERBINDUNGEN_DE,
  en: VERBINDUNGEN_EN,
  fr: VERBINDUNGEN_FR,
  es: VERBINDUNGEN_ES,
  // ★ F5-F8 Italienisch (02.10.2026): „it" hat eigene Verbindungen (`gelaeufigkeitIt.ts`) - vorher das Englische.
  it: VERBINDUNGEN_IT,
  // ★ F5-F8 Polnisch (03.10.2026): „pl" hat eigene Verbindungen (`gelaeufigkeitPl.ts`) - vorher das Englische.
  pl: VERBINDUNGEN_PL,
  // ★ F5-F8 Türkisch (03.10.2026): „tr" hat eigene Verbindungen (`gelaeufigkeitTr.ts`) - vorher das Englische.
  tr: VERBINDUNGEN_TR,
  // ★ F6-cs (03.10.2026): „cs" hat eigene Verbindungen (`gelaeufigkeitCs.ts`) - vorher das Englische.
  cs: VERBINDUNGEN_CS,
  // RÜCKFALL-EN (G2-NEUN): bg, el, hu, nl, pt, br, ro, sv, uk zeigen vorerst Englisch.
  // ★ G3c-VERTEILER (25.10.2026): jede liest schon ihre eigene Datei (`gelaeufigkeit<Xx>.ts`) - leer ⇒ der englische Wert (`geruestRueckfall.ts`).
  bg: eigenOderEn(VERBINDUNGEN_BG, VERBINDUNGEN_EN),
  el: eigenOderEn(VERBINDUNGEN_EL, VERBINDUNGEN_EN),
  hu: eigenOderEn(VERBINDUNGEN_HU, VERBINDUNGEN_EN),
  nl: eigenOderEn(VERBINDUNGEN_NL, VERBINDUNGEN_EN),
  pt: eigenOderEn(VERBINDUNGEN_PT, VERBINDUNGEN_EN),
  br: eigenOderEn(VERBINDUNGEN_BR, VERBINDUNGEN_EN),
  ro: eigenOderEn(VERBINDUNGEN_RO, VERBINDUNGEN_EN),
  sv: eigenOderEn(VERBINDUNGEN_SV, VERBINDUNGEN_EN),
  uk: eigenOderEn(VERBINDUNGEN_UK, VERBINDUNGEN_EN),
};

function listeFuer(lang: Lang): Verbindung[] {
  return VERBINDUNGEN[lang];
}

/**
 * Welche Wörter einer Verbindung mit diesem Tastenstand UND dieser Stufe
 * tippbar sind (bereits durch `fitText` gebracht - fertig zum Anzeigen).
 * Mindestens 3 nötig, sonst fällt die Verbindung für diese Kombination aus.
 */
/**
 * ★ E10: wie überall über `englischVariante()` erkannt (kein `FormKontext`
 * hier - diese Datei liefert keine Übungsform, siehe Kopf-Kommentar, und
 * `generator.ts` reicht keine Klassen-Vorgabe durch). Ohne den Probe-Schalter
 * des englischen Lehrgangs bleibt es unbedingt bei „gb" (das Tor in
 * `schreibweise.ts`).
 */
function passendeWoerter(
  v: Verbindung,
  allowed: Set<string>,
  etikett: InhaltsStufe,
  lang: Lang,
  lernweg?: Lernweg,
  klein = false,
): string[] {
  const varianteAn = lang === "en" && englischVariante() === "us";
  return v.woerter
    .filter((w) => stufeErlaubtWort(w, etikett))
    .map((w) => (varianteAn ? wandleSchreibweise(w, "us") : w))
    // ★ D-2 (28.09.2026): Erwachsene vor ⇧ - Kleinschrift, auch Nomen (`nurKleinschrift`).
    .map((w) => (klein ? kleinFuer(w, lang) : w))
    // ★ ES-W (27.09.2026): mit dem Weg (wie `langersatz.ts`) - auf „es" zählen
    // Akzentbuchstaben (á é í ó ú), sobald `´` und der Grundbuchstabe gelernt
    // sind; ohne Weg fiele jedes Wort mit „-ción" still heraus. Für „de"/„en"
    // byte-gleich (fitText kennt dort keinen Weg-Zweig), für „fr" ebenso,
    // solange VERBINDUNGEN_FR kein ê/â/ï und keinen Bindestrich trägt
    // (Wächter wortspiele-fr).
    .map((w) => fitText(w, allowed, lernweg))
    .filter((w): w is string => w !== null);
}

/**
 * Eine Geläufigkeits-Zeile: mehrere Wörter mit DERSELBEN Verbindung.
 * `null`, wenn der Tastenstand (oder die Stufe) keine hergibt.
 */
export function gelaeufigkeitsZeile(
  allowed: Set<string>,
  opts: {
    stufe: Stufe;
    lang: Lang;
    zufall: () => number;
    woerter?: number;
    lernweg?: Lernweg;
    /** ★ D-2: Umschalttaste gelernt? Fehlt es, gilt „ja" (unverändert). */
    umschalt?: boolean;
  },
): { text: string; folge: string } | null {
  const etikett = contentStufenFor(opts.stufe)[0];
  const klein = nurKleinschrift(opts.stufe, opts.umschalt ?? true);
  const anzahl = Math.max(3, Math.min(5, opts.woerter ?? 4));

  const brauchbare = listeFuer(opts.lang)
    .map((v) => ({ verbindung: v, passend: passendeWoerter(v, allowed, etikett, opts.lang, opts.lernweg, klein) }))
    .filter((eintrag) => eintrag.passend.length >= 3);
  if (!brauchbare.length) return null;

  const wahl = brauchbare[zufallIndex(opts.zufall, brauchbare.length)];
  const pool = [...wahl.passend];
  const gewaehlt: string[] = [];
  const ziel = Math.min(anzahl, pool.length);
  for (let i = 0; i < ziel; i++) {
    const idx = zufallIndex(opts.zufall, pool.length);
    gewaehlt.push(pool.splice(idx, 1)[0]);
  }

  const text = fitText(gewaehlt.join(" "), allowed, opts.lernweg);
  if (!text) return null;
  return { text, folge: wahl.verbindung.folge };
}

/**
 * Gibt es mit diesem Tastenstand überhaupt Geläufigkeits-Zeilen? Bewusst OHNE
 * Stufe gefragt - „überhaupt" meint das Bestmögliche (wie `erwachsen`, die
 * Stufe ohne Längen-Grenze): Da die Stufen-Grenze eine Auswahl nur enger
 * machen kann, nie weiter, gilt: liefert diese Funktion `false`, liefert
 * `gelaeufigkeitsZeile` für JEDE Stufe `null`.
 */
export function gelaeufigkeitMoeglich(allowed: Set<string>, lang: Lang, lernweg?: Lernweg): boolean {
  return listeFuer(lang).some(
    (v) => passendeWoerter(v, allowed, "erwachsen", lang, lernweg).length >= 3,
  );
}
