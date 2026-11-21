/**
 * „Tasten finden" - die kleine Prüfung am Ende einer Runde.
 *
 * ★ 23.10.2026, Testerin: „Auch hier kann man am Ende eine kleine Prüfung
 * einbauen: Tasten richtig drücken, Funktionen kennen und kleine Aufgabe - du
 * willst die Abkürzung AGB schreiben, welche Taste musst du zusätzlich
 * drücken." Johannes: „das bauen wir gleich."
 *
 * Vier Fragen, in dieser Reihenfolge:
 *  1. Eine Funktion wird beschrieben, die Taste wird gedrückt (Funktion → Taste).
 *  2. Eine Taste wird genannt, die Funktion wird mit 1, 2 oder 3 gewählt
 *     (Taste → Funktion).
 *  3. Eine kleine Aufgabe („Du hast dich vertippt …"), die Taste wird gedrückt.
 *  4. Die Aufgabe mit AGB: Umschalt (oder die Feststelltaste) zusätzlich.
 *
 * ── Regeln ──────────────────────────────────────────────────────────────────
 *  · Die Funktionssätze sind die von „Tasten erkunden" (`erklaerungFuerSprache`),
 *    nichts Neues. Nur die Fragen drumherum stehen hier.
 *  · Ein falscher Versuch ist nie ein Scheitern: Die Taste wird benannt, die
 *    Frage bleibt. Nach dem zweiten Versuch sagt die Prüfung die Lösung dazu,
 *    und das Kind drückt sie - es geht immer weiter. Am Ende zählt nichts gegen
 *    das Kind; die Rückmeldung nennt nur, was gleich beim ersten Mal saß.
 *  · Gefragt werden nur Tasten der laufenden Tastatur (`suchbareTasten`, also
 *    am Laptop ohne Pos1 & Co.) - und nie Esc als Antwort: Esc ist der Ausweg
 *    des Fensters.
 *  · Ein Tastendruck ohne Antwort wäre eine kaputte Tastatur: Auch Umschalt,
 *    Strg & Co. bekommen eine sanfte Antwort (sie zählen nicht als Versuch).
 *  · Nur Deutsch und Englisch: Die Fragen sind dort geschrieben. In den
 *    anderen Sprachen wird die Prüfung nicht angeboten (`pruefungGibtEs`).
 */
import type { KeyEventLike } from "../computer/chord";
import type { Plattform } from "../computer/model";
import { suchbareTasten, tasteFuerEreignis, tasteMitId } from "../computer/tastenNamen";
import type { BedienSprache } from "../bedienSprache";
import { nennungKurz, zeichenNennung } from "./findenRunde";
import { erklaerungFuerSprache } from "./tastenErklaerung";
import type { LayoutId } from "./layouts";

/** Eine Frage der Prüfung. */
export type PruefFrage =
  | { art: "taste"; frage: string; ids: readonly string[] }
  | { art: "wahl"; frage: string; optionen: readonly string[]; richtig: number };

/** Der Stand: welche Frage, wie viele Fehlversuche in ihr, wie viele gleich richtig. */
export interface PruefStand {
  fragen: readonly PruefFrage[];
  index: number;
  fehlversuche: number;
  beimErstenMal: number;
}

export type PruefSchritt = {
  art: "richtig" | "falsch" | "weiter" | "fertig";
  stand: PruefStand;
  ansage: string;
} | null;

/** Alles, was ein Satz in der Prüfung braucht - je Sprache. */
interface Texte {
  start: string;
  hinweis: string;
  frageNr: (n: number, von: number) => string;
  funktionFrage: (was: string) => string;
  wahlFrage: (taste: string) => string;
  wahlHinweis: string;
  richtig: string;
  dasIst: (das: string) => string;
  nochMal: string;
  loesung: (taste: string) => string;
  fertig: (n: number, erstes: number) => string;
  aufgabeTippfehler: string;
  aufgabeAbschicken: string;
  aufgabeAgb: string;
}

const TEXTE: Partial<Record<BedienSprache, Texte>> = {
  de: {
    start: "Kleine Prüfung.",
    hinweis: "Kleine Prüfung mit P.",
    frageNr: (n, von) => `Frage ${n} von ${von}.`,
    funktionFrage: (was) => `Eine Taste ${was} Welche Taste ist das?`,
    wahlFrage: (taste) => `Was macht ${taste}?`,
    wahlHinweis: "Drück 1, 2 oder 3.",
    richtig: "Richtig!",
    dasIst: (das) => `Das ist ${das}.`,
    nochMal: "Probier es noch einmal.",
    loesung: (taste) => `Es ist ${taste}. Drück sie.`,
    fertig: (n, erstes) => `Geschafft! Alle ${n} Fragen gelöst, ${erstes} davon gleich beim ersten Mal.`,
    aufgabeTippfehler:
      "Du hast gerade einen Buchstaben falsch getippt. Welche Taste löscht ihn, wenn die Schreibmarke dahinter steht?",
    aufgabeAbschicken: "Du hast ein Formular ausgefüllt und willst es abschicken. Welche Taste drückst du?",
    aufgabeAgb: "Du willst die Abkürzung AGB schreiben. Welche Taste drückst du zusätzlich zu den Buchstaben?",
  },
  en: {
    start: "Quick quiz.",
    hinweis: "Quick quiz with P.",
    frageNr: (n, von) => `Question ${n} of ${von}.`,
    funktionFrage: (was) => `One key ${was} Which key is it?`,
    wahlFrage: (taste) => `What does ${taste} do?`,
    wahlHinweis: "Press 1, 2 or 3.",
    richtig: "Correct!",
    dasIst: (das) => `That is ${das}.`,
    nochMal: "Try again.",
    loesung: (taste) => `It is ${taste}. Press it.`,
    fertig: (n, erstes) => `Done! All ${n} questions solved, ${erstes} of them first time.`,
    aufgabeTippfehler: "You just typed a wrong letter. Which key deletes it when the cursor is right after it?",
    aufgabeAbschicken: "You have filled in a form and want to send it. Which key do you press?",
    aufgabeAgb: "You want to type the abbreviation AGB. Which key do you press as well as the letters?",
  },
};

/** Gibt es die Prüfung in dieser Sprache? */
export function pruefungGibtEs(sprache: BedienSprache): boolean {
  return TEXTE[sprache] !== undefined;
}

/** „Kleine Prüfung mit P." - der Hinweis am Ende der Runde (leer ohne Prüfung). */
export function pruefungHinweis(sprache: BedienSprache): string {
  return TEXTE[sprache]?.hinweis ?? "";
}

/** Am Ende der Runde startet P die Prüfung (ohne Strg, Alt, Befehl). */
export function istPruefungsTaste(e: KeyEventLike): boolean {
  return e.key.toLowerCase() === "p" && !e.ctrlKey && !e.altKey && !e.metaKey;
}

const gross1 = (s: string) => (s ? s[0]!.toUpperCase() + s.slice(1) : s);

function mische<T>(liste: readonly T[], zufall: () => number): T[] {
  const a = [...liste];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(zufall() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

/** Tasten, die eine Funktionsfrage tragen (Esc fehlt mit Absicht - der Ausweg). */
const FUNKTIONS_TASTEN = ["loeschtaste", "entf", "eingabe", "zeilenschalter", "tabulator", "leertaste"];
/** Tasten, bei denen eine Wahlfrage („Was macht …?") sinnvoll ist. */
const WAHL_TASTEN = ["esc", "tabulator", "entf", "loeschtaste", "leertaste"];
/**
 * ★ Testerin 04.11.2026 (Meldung bc38onv5ly43uwf): „Tab macht auch einen Abstand
 * zwischen zwei Wörtern (anders als Leerzeichen, wäre aber nicht falsch).
 * Inhaltlich sind Antwort 2 und 3 richtig." In der Prüfung muss GENAU eine
 * Antwort stimmen. Zwei Wege dafür:
 *  · Ein schärferer Satz für die Leertaste: sie schreibt ein LEERZEICHEN - das
 *    tut die Tabulatortaste nicht. Gilt für Frage 1 und 2.
 *  · Tasten, deren Sätze sich trotzdem berühren, stehen nie zusammen in einer
 *    Wahlfrage ({@link VERWECHSELBAR}).
 * Durchgesehen am selben Tag: Löschtaste/Entf (links/rechts), Eingabe/Esc
 * (bestätigt/bricht ab) schliessen einander aus; Leertaste/Eingabe nicht
 * (beide drücken Schalter) - darum stehen sie im Paar.
 */
const PRUEF_SATZ: Partial<Record<BedienSprache, Readonly<Record<string, string>>>> = {
  de: { leertaste: "schreibt ein Leerzeichen zwischen zwei Wörter." },
  en: { leertaste: "types a space character between two words." },
};
/** Paare, die nie Frage und falsche Antwort derselben Wahlfrage sind. */
// Leertaste und Eingabetaste: beide drücken einen Schalter („bestätigt" träfe auch die Leertaste).
const VERWECHSELBAR: readonly (readonly [string, string])[] = [
  ["tabulator", "leertaste"],
  ["leertaste", "eingabe"],
  ["leertaste", "zeilenschalter"],
];
const verwechselbar = (a: string, b: string) =>
  VERWECHSELBAR.some(([x, y]) => (x === a && y === b) || (x === b && y === a));

/** Beide Eingabe-Tasten zählen - am Mac heißt sie Zeilenschalter. */
const EINGABE = ["eingabe", "zeilenschalter"];

/**
 * Die vier Fragen. `null`, wenn die Sprache keine Prüfung hat.
 * Nur Tasten, die auf dieser Tastatur gefragt werden (`suchbareTasten`).
 */
export function baueFragen(opts: {
  plattform: Plattform;
  layoutId: LayoutId;
  sprache: BedienSprache;
  tastaturArt?: "computer" | "laptop";
  zufall?: () => number;
}): PruefFrage[] | null {
  const { plattform, layoutId, sprache, tastaturArt = "computer", zufall = Math.random } = opts;
  const t = TEXTE[sprache];
  if (!t) return null;
  const da = new Set(suchbareTasten(plattform, tastaturArt).map((x) => x.id));
  const was = (id: string) =>
    PRUEF_SATZ[sprache]?.[id] ?? erklaerungFuerSprache(id, plattform, layoutId, sprache)?.was[0] ?? null;
  const nenne = (id: string) => {
    const taste = tasteMitId(id, plattform);
    return taste ? nennungKurz({ art: "sonder", taste }, "nominativ", plattform, sprache) : id;
  };

  // 1. Funktion → Taste. Die Eingabe-Taste zählt als EINE Möglichkeit.
  const eins = mische(FUNKTIONS_TASTEN, zufall).find((id) => da.has(id) && was(id));
  const einsIds = eins && EINGABE.includes(eins) ? EINGABE : eins ? [eins] : [];
  const frage1: PruefFrage | null = eins
    ? { art: "taste", frage: t.funktionFrage(was(eins)!), ids: einsIds }
    : null;

  // 2. Taste → Funktion, drei Antworten, eine richtig.
  const zwei = mische(
    WAHL_TASTEN.filter((id) => da.has(id) && was(id) && !einsIds.includes(id)),
    zufall,
  )[0];
  let frage2: PruefFrage | null = null;
  if (zwei) {
    // Drei VERSCHIEDENE Sätze: Eingabe- und Zeilenschalter-Taste teilen sich einen.
    const falsche = [
      ...new Set(
        mische(
          FUNKTIONS_TASTEN.concat("esc").filter(
            (id) => id !== zwei && was(id) && was(id) !== was(zwei) && !verwechselbar(id, zwei),
          ),
          zufall,
        ).map((id) => gross1(was(id)!)),
      ),
    ].slice(0, 2);
    const richtig = gross1(was(zwei)!);
    const alle = mische([richtig, ...falsche], zufall);
    frage2 = { art: "wahl", frage: t.wahlFrage(nenne(zwei)), optionen: alle, richtig: alle.indexOf(richtig) };
  }

  // 3. Eine kleine Aufgabe, die eine Taste verlangt - eine, die in 1 nicht schon dran war.
  const aufgaben: PruefFrage[] = (
    [
      { art: "taste", frage: t.aufgabeTippfehler, ids: ["loeschtaste"] },
      { art: "taste", frage: t.aufgabeAbschicken, ids: EINGABE },
    ] as const
  ).filter((f) => f.ids.some((id) => da.has(id)) && !f.ids.some((id) => einsIds.includes(id)));
  const drei = mische(aufgaben, zufall)[0] ?? null;

  // 4. AGB: Umschalt - oder die Feststelltaste, auch sie schreibt Großbuchstaben.
  const vier: PruefFrage = { art: "taste", frage: t.aufgabeAgb, ids: ["umschalt", "feststell"] };

  return [frage1, frage2, drei, vier].filter((f): f is PruefFrage => f !== null);
}

/** Der Wortlaut einer Frage für Zeile und Stimme - bei einer Wahl mit den Antworten. */
export function frageText(f: PruefFrage, sprache: BedienSprache): string {
  if (f.art === "taste") return f.frage;
  const t = TEXTE[sprache]!;
  const num = f.optionen.map((o, i) => `${i + 1}: ${o}`).join(" ");
  return `${f.frage} ${num} ${t.wahlHinweis}`;
}

export function neuerStand(fragen: readonly PruefFrage[]): PruefStand {
  return { fragen, index: 0, fehlversuche: 0, beimErstenMal: 0 };
}

/** Kopf und erste Frage. */
export function pruefungStart(stand: PruefStand, sprache: BedienSprache): string {
  const t = TEXTE[sprache]!;
  return `${t.start} ${t.frageNr(1, stand.fragen.length)} ${frageText(stand.fragen[0]!, sprache)}`;
}

/** Tasten, die andere verändern - ihr Druck zählt nie als Fehlversuch. */
const VERAENDERER = new Set(["umschalt", "strg", "ctrl", "alt", "altgr", "befehlstaste", "wahltaste", "fn", "windows-taste"]);

/**
 * Ein Tastendruck in der Prüfung. Immer eine Antwort - nie Stille.
 * `null` nur, wenn die Prüfung schon zu Ende ist.
 */
export function pruefSchritt(opts: {
  e: KeyEventLike;
  stand: PruefStand;
  plattform: Plattform;
  sprache: BedienSprache;
}): PruefSchritt {
  const { e, stand, plattform, sprache } = opts;
  const t = TEXTE[sprache];
  const frage = stand.fragen[stand.index];
  if (!t || !frage) return null;

  const taste = tasteFuerEreignis(e, plattform);
  let richtig: boolean;
  let veraendert = false;
  if (frage.art === "taste") {
    richtig = !!taste && frage.ids.includes(taste.id);
    veraendert = !!taste && VERAENDERER.has(taste.id) && !richtig;
  } else {
    const ziffer = /^[1-3]$/.test(e.key) ? Number(e.key) - 1 : -1;
    richtig = ziffer === frage.richtig;
  }

  if (richtig) {
    const erstes = stand.beimErstenMal + (stand.fehlversuche === 0 ? 1 : 0);
    const weiter = stand.index + 1;
    const neu = { ...stand, index: weiter, fehlversuche: 0, beimErstenMal: erstes };
    if (weiter >= stand.fragen.length) {
      return { art: "fertig", stand: neu, ansage: `${t.richtig} ${t.fertig(stand.fragen.length, erstes)}` };
    }
    return {
      art: "weiter",
      stand: neu,
      ansage: `${t.richtig} ${t.frageNr(weiter + 1, stand.fragen.length)} ${frageText(stand.fragen[weiter]!, sprache)}`,
    };
  }

  // Falsch - sanft: die gedrückte Taste benennen, die Frage bleibt.
  const fehl = veraendert ? stand.fehlversuche : stand.fehlversuche + 1;
  const neu = { ...stand, fehlversuche: fehl };
  if (frage.art === "wahl") {
    return { art: "falsch", stand: neu, ansage: `${t.nochMal} ${t.wahlHinweis}` };
  }
  const das = taste
    ? nennungKurz({ art: "sonder", taste }, "nominativ", plattform, sprache)
    : e.key.length === 1
      ? zeichenNennung(e.key, sprache)
      : e.key;
  if (fehl >= 2) {
    // Die erste Taste dieser Frage, die es auf dieser Plattform gibt (Mac: Zeilenschalter statt Eingabetaste).
    const loesung = frage.ids.map((id) => tasteMitId(id, plattform)).find((x) => x !== null) ?? null;
    const name = loesung ? nennungKurz({ art: "sonder", taste: loesung }, "nominativ", plattform, sprache) : "";
    return { art: "falsch", stand: neu, ansage: `${t.dasIst(das)} ${t.loesung(name)}` };
  }
  return { art: "falsch", stand: neu, ansage: `${t.dasIst(das)} ${t.nochMal}` };
}

/** Die Aufschrift des Schalters am Ende der Runde. */
export function pruefungKnopf(sprache: BedienSprache): string {
  return sprache === "en" ? "Quick quiz" : "Kleine Prüfung";
}

/** Der Fensterkopf der Prüfung - für den Schirm (Sehende). */
export function pruefungZaehler(stand: PruefStand, sprache: BedienSprache): string {
  const t = TEXTE[sprache]!;
  return t.frageNr(Math.min(stand.index + 1, stand.fragen.length), stand.fragen.length);
}
