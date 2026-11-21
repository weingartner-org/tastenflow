/**
 * Tastenflow - die FREISCHALT-FEIER in der UNGARISCHEN Bedienung (★ O-HU, 29.10.2026, Glossar
 * `recherche-ungarisch-2026-10-25/GLOSSAR-hu.md` §1 Regeln 11-13, §2.1, §2.9, §2.12 „Freischalt-Feier", §4 Falle 3/4).
 *
 * Vorbild `freischaltungCs.ts`: die Karte ({@link unlockInfoHu}), die Meldung für die Braillezeile
 * ({@link unlockBrailleLabelHu}) und die gesprochene Ansage ({@link unlockSpeechAlleHu}, ALLE neuen Einheiten). Verteiler:
 * `components/typing/UnlockCelebration.tsx` (`FEIER_INFO`, `FEIER_BRAILLE`, `FEIER_ANSAGE_GERUEST`).
 * Wächter: `tests/tastenflow-freischalt-hu.test.tsx`.
 *
 * Regeln: das Kind liest „te"; das Lob ist ein Ausruf („Nagyszerű!"), die Neuheit ein Hauptwort mit Doppelpunkt
 * („Új betű: hosszú ő", „Új billentyű: Shift", „Új számjegy: nulla", Glossar §2.12). Ungarisch hat kein grammatisches
 * Geschlecht (Regel 2) - nur das Gattungswort steht da (betű, számjegy, írásjel, szimbólum, billentyű, holtbillentyű).
 * ★ Regel 11/12: Tastennamen und Zeichen bekommen NIE eine Endung und keinen Artikel, der nach der Aussprache geraten werden
 * müsste - der Name steht nach einem Doppelpunkt („Billentyű: F, bal mutatóujj, alapsor."), die Zusatztaste mit dem Kopfwort
 * „billentyű" („a Shift billentyűvel együtt").
 * ★ Falle 4: kein gesprochener Satz endet mit einer Ziffer und einem Punkt - die Ansage sagt die Ziffer als Wort („Új számjegy:
 * öt."), und der Tastenweg stellt eine Ziffer nie ans Satzende.
 * ★ `fingerName(…, "hu")`, `rowName(…, "hu")` und `spokenLabel(…, "hu")` aus `fingers.ts` liefern heute noch ENGLISCH (Marke
 * RÜCKFALL-EN G2-NEUN) - darum stehen die Finger- und Reihennamen hier selbst, die Zeichennamen kommen aus
 * `tastenErklaerungHu.ts` ({@link zeichenNameHu}, {@link unitLabelHu}).
 * ⚠️ Alles [G] im Sinne des Glossars: von einer Person mit Ungarisch als Erstsprache noch nicht gelesen.
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
import { istBuchstabe, kleinFuer } from "./sprachRegister";
import { aufzaehlungHu, unitLabelHu, zeichenNameHu } from "./tastenErklaerungHu";

/** Die Ziffern als Wort - für die Ansage, damit kein Satz mit „5." endet (Glossar §4 Falle 4). */
const ZIFFERN_HU: Readonly<Record<string, string>> = {
  "0": "nulla", "1": "egy", "2": "kettő", "3": "három", "4": "négy",
  "5": "öt", "6": "hat", "7": "hét", "8": "nyolc", "9": "kilenc",
};

/** Die Ziffer als Eigenschaftswort vor „számjegy" („ötös számjegy") - feste Wörter, keine Endung an einem Platzhalter (Regel 12). */
const ZIFFER_ADJ_HU: Readonly<Record<string, string>> = {
  "0": "nullás", "1": "egyes", "2": "kettes", "3": "hármas", "4": "négyes",
  "5": "ötös", "6": "hatos", "7": "hetes", "8": "nyolcas", "9": "kilences",
};

/** Die Finger (Glossar §2.1: „bal mutatóujj", „jobb kisujj") - nach `FingerInfo.id`. */
const FINGER_HU: Readonly<Record<FingerId, string>> = {
  "kleiner-links": "bal kisujj",
  "ring-links": "bal gyűrűsujj",
  "mittel-links": "bal középső ujj",
  "zeige-links": "bal mutatóujj",
  daumen: "hüvelykujj",
  "zeige-rechts": "jobb mutatóujj",
  "mittel-rechts": "jobb középső ujj",
  "ring-rechts": "jobb gyűrűsujj",
  "kleiner-rechts": "jobb kisujj",
};

/**
 * Die Tastenreihen in der Reihenfolge von `rowForChar` (0 Zahlenreihe … 3 untere Reihe). ★ Falle 3: „sor" allein ist die
 * Übungszeile - darum immer mit Eigenschaftswort (alapsor, felső sor, alsó sor, számsor).
 */
const REIHEN_HU: readonly string[] = ["számsor", "felső sor", "alapsor", "alsó sor"];

/** Gattungswort - „betű", „számjegy", „írásjel", „szimbólum", „billentyű", „holtbillentyű". */
function gattungHu(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT) return "billentyű";
  if (lernweg && istTotastenEinheit(unit, lernweg)) return "holtbillentyű";
  switch (unitKindImWeg(unit, lernweg)) {
    case "ziffer":
      return "számjegy";
    case "satzzeichen":
      return "írásjel";
    case "sonderzeichen":
      return "szimbólum";
    default:
      return "betű";
  }
}

/** Die Taste rechts neben der Leertaste: unter Windows „AltGr", am Mac „Option" (Glossar §2.9) - beide mit Artikel „az". */
function altGrKappeHu(): string {
  return bottomLabelsFuer(activeLayout())[2] === "Option" ? "Option" : "AltGr";
}

/**
 * Wie eine Taste im ungarischen Satz heisst - immer nach einem Doppelpunkt, nie gebeugt. Lateinische Buchstaben gross wie auf
 * der Kappe, Ziffern als Ziffer, die Akzentbuchstaben und Zeichen mit ihrem gesprochenen Namen („hosszú ő", „vessző") - ö/ő
 * und ü/ű klängen sonst gleich (Falle 12).
 */
function kappeHu(key: string): string {
  if (/^[a-z]$/.test(key)) return key.toUpperCase();
  if (/^[0-9]$/.test(key)) return key;
  return zeichenNameHu(key);
}

/** Dasselbe für das Ende eines Satzes: eine Ziffer als Wort (Falle 4). */
function kappeAmEndeHu(key: string): string {
  return ZIFFERN_HU[key] ?? kappeHu(key);
}

/** Die Reihe einer Taste - „a jobb szélen" für ű (zwei Hardware-Lagen, Glossar §2.9), sonst der Reihenname. */
function reiheHu(unit: string, lernweg?: Lernweg): string | null {
  if (baseKeyForChar(unit, lernweg) === "ű") return "a jobb szélen";
  const r = rowForChar(unit);
  return r === null ? null : (REIHEN_HU[r] ?? null);
}

/** „, a Shift billentyűvel együtt" / „, az AltGr billentyűvel együtt" / "" - die Zusatztaste mit Kopfwort (Regel 11). */
function zusatzHu(mod: "shift" | "altgr" | undefined): string {
  if (mod === "shift") return ", a Shift billentyűvel együtt";
  if (mod === "altgr") return `, az ${altGrKappeHu()} billentyűvel együtt`;
  return "";
}

/**
 * „Billentyű: F, bal mutatóujj, alapsor." - so wird die Einheit getippt. Der Name nach dem Doppelpunkt (Regel 11/12), die
 * Zusatztaste mit dem Kopfwort „billentyű" („a Shift billentyűvel együtt"); kein Satz endet mit einer Ziffer.
 */
export function unitHowToTypeHu(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT) {
    // Auf den ungarischen Tastaturen gibt Shift auf dem számsor Satzzeichen (' " + ! …), nie die Ziffer - wo eine Tastatur
    // die Ziffern über Shift hat (französische), sagt es der zweite Satz.
    const ziffernMitShift = charAccess("2")?.mod === "shift";
    return (
      "Nagybetűt úgy írsz, hogy a másik kezeddel lenyomva tartod a Shift billentyűt." +
      (ziffernMitShift ? " A számsoron a Shift billentyűvel számjegyeket írsz." : "")
    );
  }
  const acc = charAccess(unit);
  const vokale = lernweg && acc?.dead && istTotastenEinheit(unit, lernweg) ? totastenVokale(unit, lernweg) : [];
  if (acc && vokale.length > 0) {
    return (
      `Először a holtbillentyű: ${kappeHu(acc.base)}${zusatzHu(acc.mod)}, utána a betű: ${aufzaehlungHu(vokale)}. ` +
      "Nagybetű ékezettel: először a holtbillentyű, utána a Shift billentyű és a betű."
    );
  }
  if (acc?.dead) return `Először a billentyű: ${kappeHu(acc.base)}${zusatzHu(acc.mod)}, utána a szóköz billentyű.`;
  if (acc?.mod === "altgr" && acc.mitUmschalt) {
    return `Billentyű: ${kappeHu(acc.base)}, az ${altGrKappeHu()} és a Shift billentyűvel együtt.`;
  }
  if (acc?.mod) return `Billentyű: ${kappeHu(acc.base)}${zusatzHu(acc.mod)}.`;
  const f = fingerForChar(unit, lernweg);
  const key = baseKeyForChar(unit, lernweg);
  if (!f) return `Billentyű: ${kappeAmEndeHu(key)}.`;
  const reihe = reiheHu(unit, lernweg);
  return `Billentyű: ${kappeHu(key)}, ${FINGER_HU[f.id]}${reihe ? `, ${reihe}` : ""}.`;
}

/** Die Karte der Feier: „betű Ő", „számjegy 5", „billentyű Shift" - ohne Artikel (Regel 12). */
export function unlockInfoHu(unit: string, lernweg?: Lernweg): UnlockInfo {
  const k = unitKindImWeg(unit, lernweg);
  const name = unit === SHIFT_UNIT ? "Shift" : k === "ziffer" ? unit : unitLabelHu(unit, lernweg);
  return {
    glyph: unitGlyph(unit),
    article: "",
    noun: gattungHu(unit, lernweg),
    name,
    howTo: unitHowToTypeHu(unit, lernweg),
  };
}

/** Die Braillezeilen-Meldung - „Új betű: Ő", „Új szimbólum: százalékjel %", „Új billentyű: Shift" (ohne Schlusspunkt). */
export function unlockBrailleLabelHu(unit: string, lernweg?: Lernweg): string {
  const i = unlockInfoHu(unit, lernweg);
  if (lernweg && istTotastenEinheit(unit, lernweg)) return `Új ${i.noun}: ${i.name} ${unit}`;
  const k = unitKindImWeg(unit, lernweg);
  const zeichen = k === "satzzeichen" || k === "sonderzeichen" ? ` ${unitGlyph(unit)}` : "";
  return `Új ${i.noun}: ${i.name}${zeichen}`;
}

/**
 * Der Name in der GESPROCHENEN Ansage - Ziffern als Wort, Buchstaben klein mit ihrem Namen („hosszú ő" - ö/ő klängen sonst
 * gleich, Falle 12), Zeichen mit ihrem ungarischen Namen.
 */
function gesprochenerName(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT) return "Shift";
  if (unitKindImWeg(unit, lernweg) === "ziffer") return ZIFFERN_HU[unit] ?? unit;
  if (istBuchstabe(unit)) return zeichenNameHu(kleinFuer(unit, "hu"));
  return zeichenNameHu(unit);
}

/** „hosszú ő betű", „Shift billentyű", „ötös számjegy", „vessző írásjel" - eine Einheit in einer Aufzählung. */
function kopf(unit: string, lernweg?: Lernweg): string {
  const g = gattungHu(unit, lernweg);
  if (unitKindImWeg(unit, lernweg) === "ziffer") return `${ZIFFER_ADJ_HU[unit] ?? gesprochenerName(unit, lernweg)} ${g}`;
  return `${gesprochenerName(unit, lernweg)} ${g}`;
}

function grossAnfang(s: string): string {
  return s ? `${s[0].toLocaleUpperCase("hu-HU")}${s.slice(1)}` : s;
}

/**
 * Die gesprochene Ansage - eine oder mehrere Einheiten auf einmal: „Nagyszerű! Új betű: hosszú ő. Billentyű: hosszú ő, jobb
 * kisujj, felső sor." Bei mehreren Einheiten „Nagyszerű! Feloldva: ö betű és hosszú ó betű." und danach je Einheit ihr Weg.
 * Ab 11 (`sober`) ohne Ausruf: „Újdonság neked: …".
 */
export function unlockSpeechAlleHu(units: readonly string[], sober: boolean, lernweg?: Lernweg): string {
  if (units.length <= 1) {
    const unit = units[0] ?? "";
    const lead = sober
      ? `Újdonság neked: ${kopf(unit, lernweg)}.`
      : `Nagyszerű! Új ${gattungHu(unit, lernweg)}: ${gesprochenerName(unit, lernweg)}.`;
    return `${lead} ${unitHowToTypeHu(unit, lernweg)}`;
  }
  const liste = aufzaehlungHu(units.map((u) => kopf(u, lernweg)));
  const lead = sober ? `Újdonság neked: ${liste}.` : `Nagyszerű! Feloldva: ${liste}.`;
  const griffe = units.map((u) => `${grossAnfang(kopf(u, lernweg))}. ${unitHowToTypeHu(u, lernweg)}`);
  return [lead, ...griffe].join(" ");
}
