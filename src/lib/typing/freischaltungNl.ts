/**
 * Tastenflow - die FREISCHALT-FEIER in der NIEDERLÄNDISCHEN Bedienung (★ O-NL, 29.10.2026, Glossar
 * `recherche-niederländisch-2026-10-25/GLOSSAR-nl.md` §2.2 „vrijspelen", §2.4 „Nieuw voor jou", §2.12 Freischalt-Feier).
 *
 * Dieselben drei Stücke wie `freischaltungCs.ts` - die Karte (`unlockInfoNl`), die Meldung für die Braillezeile
 * (`unlockBrailleLabelNl`) und die gesprochene Ansage (`unlockSpeechAlleNl`, ALLE neuen Einheiten, nicht nur die letzte).
 * Verteiler: `components/typing/UnlockCelebration.tsx` (`FEIER_INFO`, `FEIER_BRAILLE`, `FEIER_ANSAGE_GERUEST`).
 * Wächter: `tests/tastenflow-freischalt-nl.test.ts`.
 *
 * Regeln: das Kind liest „je"; das Lob ist ein Ausruf ohne Personenwort („Goed gedaan!"), die Neuheit ein Hauptwort
 * mit Doppelpunkt: „Nieuwe letter: r", „Nieuwe toets: Shift", „Nieuw cijfer: vijf." (Glossar §2.12). Das Adjektiv
 * richtet sich nach dem GATTUNGSWORT (de letter, de toets, de dode toets ⇒ „nieuwe"; het cijfer, het leesteken, het
 * teken ⇒ „nieuw"), nie nach dem Kind. Höchstens ein Ausrufezeichen je Meldung. Tastennamen wie auf der Kappe, im Satz
 * mit Kopfwort „de toets …" (Regel 12) - die Zeichen beim Namen aus `tastenErklaerungNl.ts` („de toets apostrof").
 *
 * ⚠️ `fingerName(f, "nl")`, `rowName(…, "nl")` und `spokenLabel(…, "nl")` aus `fingers.ts` antworten heute noch
 * ENGLISCH (RÜCKFALL-EN G2-NEUN). Darum stehen Finger- und Reihennamen hier in eigenen kleinen Tabellen (Glossar §2.1:
 * „linkerwijsvinger", „basisrij"), die Zeichennamen kommen aus `zeichenNameNl`. Sobald `fingers.ts` niederländisch
 * spricht, können die Tabellen dorthin wandern.
 *
 * ★ Keine Zahl mit Punkt am Satzende: Ziffern sagt die Ansage als Wort („Nieuw cijfer: vijf."), und eine Ziffern-Taste
 * im Satz heisst „de toets vijf". ★ Belgisch AZERTY (`be`): die Ziffern liegen auf Shift (Glossar §4 Falle 6) - das sagt
 * der Satz zur Shift-Einheit und der Weg jeder Ziffer selbst. ★ `ë` und `ï` haben auf keiner der beiden Tastaturen eine
 * eigene Taste: ihr Weg kommt über die Totaste (`kombizeichenFuerLayout`).
 */
import { baseKeyForChar, charAccess, fingerForChar, rowForChar, type FingerId } from "./fingers";
import { activeLayout, bottomLabelsFuer } from "./layouts";
import {
  SHIFT_UNIT,
  istTotastenEinheit,
  totastenVokale,
  unitGlyph,
  unitKindImWeg,
  type UnlockInfo,
} from "./letters";
import type { Lernweg } from "./lernweg";
import { aufzaehlungNl, zeichenNameNl } from "./tastenErklaerungNl";
import { kombizeichenFuerLayout } from "./totasten";

/** Die Ziffern als Wort - damit kein Satz mit „5." endet. „één" mit Akzenten (sonst liest man den Artikel, Glossar §2.10). */
const ZIFFERN_NL: Readonly<Record<string, string>> = {
  "0": "nul", "1": "één", "2": "twee", "3": "drie", "4": "vier",
  "5": "vijf", "6": "zes", "7": "zeven", "8": "acht", "9": "negen",
};

/** Die Finger, Glossar §2.1 („linkerwijsvinger", „rechterpink" - zusammengeschrieben). Schlüssel = `FingerInfo.id`. */
const VINGERS_NL: Readonly<Record<FingerId, string>> = {
  "kleiner-links": "linkerpink",
  "ring-links": "linkerringvinger",
  "mittel-links": "linkermiddelvinger",
  "zeige-links": "linkerwijsvinger",
  daumen: "duim",
  "zeige-rechts": "rechterwijsvinger",
  "mittel-rechts": "rechtermiddelvinger",
  "ring-rechts": "rechterringvinger",
  "kleiner-rechts": "rechterpink",
};

/** Die Tastenreihen, Glossar §2.1 - dieselbe Reihenfolge wie `ROW_NAMES` in `fingers.ts` (0 Ziffernreihe … 3 untere). */
const RIJEN_NL: readonly string[] = ["cijferrij", "bovenste rij", "basisrij", "onderste rij"];

/** Der Name eines Fingers, niederländisch. */
export function vingerNaamNl(id: FingerId): string {
  return VINGERS_NL[id];
}

/** Der Name der Reihe, auf der das Zeichen liegt - oder `null`, wenn es auf keiner liegt. */
export function rijNaamNl(ch: string): string | null {
  const r = rowForChar(ch);
  return r === null ? null : (RIJEN_NL[r] ?? null);
}

/**
 * Wie eine Taste im niederländischen Satz heisst - IMMER nach dem Kopfwort „de toets" (Regel 12): lateinische Buchstaben
 * gross wie auf der Kappe, Ziffern als Wort (keine Zahl mit Punkt am Satzende), alles andere beim Namen
 * („apostrof", „e met accent aigu", „dakje").
 */
export function kappeNl(key: string): string {
  if (/^[a-zA-Z]$/.test(key)) return key.toUpperCase();
  if (/^[0-9]$/.test(key)) return ZIFFERN_NL[key]!;
  return zeichenNameNl(key);
}

/** Die Taste rechts neben der Leertaste: unter Windows „Alt Gr" (Glossar §2.9), am Mac „Option". */
function altGrKappeNl(): string {
  return bottomLabelsFuer(activeLayout())[2] === "Option" ? "Option" : "Alt Gr";
}

/** Gattungswort und sein Artikel - „de letter", „het cijfer", „het leesteken", „het teken", „de toets", „de dode toets". */
type LidwoordNl = "de" | "het";
function gattungNl(unit: string, lernweg?: Lernweg): { nomen: string; lid: LidwoordNl } {
  if (unit === SHIFT_UNIT) return { nomen: "toets", lid: "de" };
  // Nur wo der Apostroph auf DIESER Tastatur wirklich eine Totaste ist (`nl-intl`); auf `be` ist er ein gewöhnliches Zeichen.
  if (lernweg && istTotastenEinheit(unit, lernweg) && charAccess(unit)?.dead) return { nomen: "dode toets", lid: "de" };
  switch (unitKindImWeg(unit, lernweg)) {
    case "ziffer":
      return { nomen: "cijfer", lid: "het" };
    case "satzzeichen":
      return { nomen: "leesteken", lid: "het" };
    case "sonderzeichen":
      return { nomen: "teken", lid: "het" };
    default:
      return { nomen: "letter", lid: "de" };
  }
}

/** „Nieuwe" (de-Wort) / „Nieuw" (het-Wort, unbestimmt) - nach dem Gattungswort, nie nach dem Kind. */
function nieuw(lid: LidwoordNl): string {
  return lid === "het" ? "Nieuw" : "Nieuwe";
}

/** „houd Shift ingedrukt en " / „houd Alt Gr ingedrukt en " - der Griff davor, oder leer. */
function griffDavor(mod: "shift" | "altgr" | undefined, mitUmschalt?: boolean): string {
  if (mod === "shift") return "houd Shift ingedrukt en ";
  if (mod === "altgr") return mitUmschalt ? `houd ${altGrKappeNl()} en Shift ingedrukt en ` : `houd ${altGrKappeNl()} ingedrukt en `;
  return "";
}

function grossAnfang(s: string): string {
  return s ? `${s[0]!.toUpperCase()}${s.slice(1)}` : s;
}

/**
 * So wird die Einheit getippt - Befehlsform ohne Pronomen („Druk op …", „Houd … ingedrukt"), Tastennamen nach
 * „de toets", Finger und Reihe nach dem Doppelpunkt: „Op de toets F: linkerwijsvinger, basisrij."
 */
export function unitHowToTypeNl(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT) {
    // ★ Glossar §2.9/§4 Falle 6: auf Belgisch AZERTY gibt Shift auf der Ziffernreihe die Ziffern.
    const ziffernMitShift = charAccess("2")?.mod === "shift";
    return (
      "Een hoofdletter typ je zo: houd met de andere hand de Shift-toets ingedrukt." +
      (ziffernMitShift ? " Op dit toetsenbord typ je ook de cijfers met Shift." : "")
    );
  }
  const acc = charAccess(unit);
  const vokale = lernweg && acc?.dead && istTotastenEinheit(unit, lernweg) ? totastenVokale(unit, lernweg) : [];
  if (acc && vokale.length > 0) {
    return (
      `Eerst ${griffDavor(acc.mod)}druk op de dode toets ${kappeNl(acc.base)}, daarna op de letter: ${aufzaehlungNl(vokale)}. ` +
      "Voor een hoofdletter met accent: eerst de dode toets, daarna Shift en de letter."
    );
  }
  if (acc?.dead) {
    return grossAnfang(`${griffDavor(acc.mod, acc.mitUmschalt)}druk op de toets ${kappeNl(acc.base)} en daarna op de spatiebalk.`);
  }
  if (acc?.mod) {
    return grossAnfang(`${griffDavor(acc.mod, acc.mitUmschalt)}druk op de toets ${kappeNl(acc.base)}.`);
  }
  // Ein Buchstabe ohne eigene Taste (ë, ï): über die Totaste der eingestellten Tastatur.
  const kombi = acc ? undefined : kombizeichenFuerLayout(activeLayout()).find((k) => k.zeichen === unit);
  if (kombi) {
    const tot = charAccess(kombi.tot);
    const totNaam = zeichenNameNl(kombi.tot);
    const totGriff = tot?.mod
      ? ` De dode toets ${totNaam}: ${griffDavor(tot.mod, tot.mitUmschalt)}druk op de toets ${kappeNl(tot.base)}.`
      : "";
    return `Druk eerst op de dode toets ${totNaam} en daarna op de toets ${kappeNl(kombi.dann)}.${totGriff}`;
  }
  const f = fingerForChar(unit, lernweg);
  const key = kappeNl(baseKeyForChar(unit, lernweg));
  const rij = rijNaamNl(unit);
  return f ? `Op de toets ${key}: ${vingerNaamNl(f.id)}${rij ? `, ${rij}` : ""}.` : `Op de toets ${key}.`;
}

/** Der sichtbare Name: Buchstaben wie im Glossar („Nieuwe letter: r"), Ziffern als Ziffer, Zeichen beim Namen. */
function sichtName(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT) return "Shift";
  const k = unitKindImWeg(unit, lernweg);
  if (k === "ziffer") return unit;
  if (k === "satzzeichen" || k === "sonderzeichen" || gattungNl(unit, lernweg).nomen === "dode toets") return zeichenNameNl(unit);
  // Ein Buchstabe (auch mit Zeichen, „é") sichtbar als er selbst; die Stimme sagt seinen Namen (`gesprochenerName`).
  return unit;
}

/** Die Karte der Feier: „letter r", „cijfer 5", „toets Shift", „dode toets apostrof". */
export function unlockInfoNl(unit: string, lernweg?: Lernweg): UnlockInfo {
  const g = gattungNl(unit, lernweg);
  return {
    glyph: unitGlyph(unit),
    article: "",
    noun: g.nomen,
    name: sichtName(unit, lernweg),
    howTo: unitHowToTypeNl(unit, lernweg),
  };
}

/** Die Braillezeilen-Meldung - „Nieuwe letter: r", „Nieuw teken: procent %", „Nieuwe toets: Shift". */
export function unlockBrailleLabelNl(unit: string, lernweg?: Lernweg): string {
  const g = gattungNl(unit, lernweg);
  const name = sichtName(unit, lernweg);
  const k = unitKindImWeg(unit, lernweg);
  const mitZeichen = unit !== SHIFT_UNIT && (k === "satzzeichen" || k === "sonderzeichen" || g.nomen === "dode toets");
  return `${nieuw(g.lid)} ${g.nomen}: ${name}${mitZeichen ? ` ${unit}` : ""}`;
}

/**
 * Der Name in der GESPROCHENEN Ansage: Ziffern als Wort, Buchstaben mit Zeichen beim Namen („e met trema" - ein Kind
 * muss e, é und ë unterscheiden, Glossar §2.8), Zeichen beim Namen.
 */
function gesprochenerName(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT) return "Shift";
  if (unitKindImWeg(unit, lernweg) === "ziffer") return ZIFFERN_NL[unit] ?? unit;
  return zeichenNameNl(unit);
}

/**
 * Die gesprochene Ansage - eine oder mehrere Einheiten auf einmal: „Goed gedaan! Nieuwe letter: r. Op de toets R:
 * linkerwijsvinger, bovenste rij." Bei mehreren Einheiten mit Doppelpunkt („Goed gedaan! Vrijgespeeld: teken haakje
 * openen en teken haakje sluiten."), danach je Einheit ihr Griff.
 */
export function unlockSpeechAlleNl(units: readonly string[], sober: boolean, lernweg?: Lernweg): string {
  const kopf = (u: string) => `${gattungNl(u, lernweg).nomen} ${gesprochenerName(u, lernweg)}`;
  if (units.length <= 1) {
    const unit = units[0] ?? "";
    const g = gattungNl(unit, lernweg);
    const lead = sober
      ? `Nieuw voor jou: ${kopf(unit)}.`
      : `Goed gedaan! ${nieuw(g.lid)} ${g.nomen}: ${gesprochenerName(unit, lernweg)}.`;
    return `${lead} ${unitHowToTypeNl(unit, lernweg)}`;
  }
  const liste = aufzaehlungNl(units.map(kopf));
  const lead = sober ? `Nieuw voor jou: ${liste}.` : `Goed gedaan! Vrijgespeeld: ${liste}.`;
  const griffe = units.map((u) => `${grossAnfang(kopf(u))}. ${unitHowToTypeNl(u, lernweg)}`);
  return [lead, ...griffe].join(" ");
}
