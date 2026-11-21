/**
 * ★ G3c-VERTEILER (25.10.2026): DIE FREISCHALT-FEIER IN GRIECHISCH.
 * ★ O-INHALT-EL (29.10.2026): gefüllt - Vorbild `freischaltungCs.ts`: Karte (`unlockInfoEl`), Braillezeilen-Meldung
 * (`unlockBrailleLabelEl`) und gesprochene Ansage (`unlockSpeechAlleEl`, ALLE neuen Einheiten).
 *
 * Glossar `recherche-griechisch-2026-10-25/GLOSSAR-el.md` §2.4/§2.12: „Μπράβο!" · „Νέο γράμμα: ρ" · „Νέο πλήκτρο: Shift" · „Νέο νεκρό
 * πλήκτρο: τόνος" · „Ξεκλειδώθηκε: …"; sichtbar „Κάτι νέο για σένα". Regeln:
 *  · Das Lob trägt kein Geschlecht des Kindes (kein „Είσαι φοβερός"): ein Ausruf und die Neuheit als Hauptwort mit Doppelpunkt. Alle
 *    Gattungswörter sind sächlich (γράμμα, ψηφίο, σημείο στίξης, σύμβολο, πλήκτρο) - darum immer „Νέο".
 *  · Höchstens ein Ausrufezeichen je Meldung (Regel 1). Ziffern in der Ansage als Wort („Νέο ψηφίο: πέντε.").
 *  · Tastennamen lateinisch, sächlich, ungebeugt („το Shift", Regel 11); griechische Kappen gross („το πλήκτρο Φ"), Gross mit
 *    `toUpperCase()` ohne Sprache (Regel 7: der Tonos bleibt).
 *  · Finger und Reihen griechisch (Glossar §2.1: μικρό δάχτυλο, παράμεσος, μέσος, δείκτης, αντίχειρας; βασική σειρά, πάνω σειρά,
 *    κάτω σειρά, σειρά αριθμών). `fingers.ts` kennt sie für „el" noch nicht (Etappe O4) - die Zwillinge stehen hier.
 *  · Die Totasten des Weges (΄ ¨ ΅) lehren das Vokal-Paar: „Πάτησε πρώτα το νεκρό πλήκτρο …, μετά το φωνήεν: ά, έ, ή …".
 * Verteiler: `components/typing/UnlockCelebration.tsx`. Wächter: `tests/tastenflow-freischalt-feier-el.test.tsx`.
 * ⚠️ [G]: von einer Person mit Griechisch als Erstsprache gegenzulesen.
 */
import { baseKeyForChar, charAccess, fingerForChar, rowForChar, type FingerId } from "./fingers";
import { activeLayout, bottomLabelsFuer, layoutSprache } from "./layouts";
import { SHIFT_UNIT, istTotastenEinheit, totastenVokale, unitGlyph, unitKindImWeg, type UnlockInfo } from "./letters";
import type { Lernweg } from "./lernweg";
import { istBuchstabe, kappeFuer } from "./sprachRegister";
import { unitLabelEl, zeichenNameEl } from "./tastenErklaerungEl";

/** Die Ziffern als Wort - für die Ansage. Sächliche Zählform (wie `zahlwortEl`). */
const ZIFFERN_EL: Record<string, string> = {
  "0": "μηδέν", "1": "ένα", "2": "δύο", "3": "τρία", "4": "τέσσερα",
  "5": "πέντε", "6": "έξι", "7": "επτά", "8": "οκτώ", "9": "εννέα",
};

/** Die Fingernamen griechisch, ohne Artikel (sie stehen nach einem Doppelpunkt) - Glossar §2.1. */
const FINGER_EL: Record<FingerId, string> = {
  "kleiner-links": "αριστερό μικρό δάχτυλο",
  "ring-links": "αριστερός παράμεσος",
  "mittel-links": "αριστερός μέσος",
  "zeige-links": "αριστερός δείκτης",
  daumen: "αντίχειρας",
  "zeige-rechts": "δεξιός δείκτης",
  "mittel-rechts": "δεξιός μέσος",
  "ring-rechts": "δεξιός παράμεσος",
  "kleiner-rechts": "δεξί μικρό δάχτυλο",
};

/** Die Reihen griechisch - dieselbe Reihenfolge wie `ROW_NAMES` (Ziffernreihe, obere, Grundreihe, untere). */
const REIHEN_EL = ["σειρά αριθμών", "πάνω σειρά", "βασική σειρά", "κάτω σειρά"];

/** Das Gattungswort - im Griechischen sind alle sächlich. */
function gattungEl(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT) return "πλήκτρο";
  if (lernweg && istTotastenEinheit(unit, lernweg)) return "νεκρό πλήκτρο";
  switch (unitKindImWeg(unit, lernweg)) {
    case "ziffer":
      return "ψηφίο";
    case "satzzeichen":
      return "σημείο στίξης";
    case "sonderzeichen":
      return "σύμβολο";
    default:
      return "γράμμα";
  }
}

/** Wie eine Taste nach „το πλήκτρο" heisst: Buchstaben gross wie auf der Kappe, die Leertaste „διαστήματος", sonst ihr Name. */
export function kappeEl(key: string): string {
  if (key === " ") return "διαστήματος";
  if (/^[0-9]$/.test(key)) return key;
  // Nur BUCHSTABEN gross wie auf der Kappe - der Tonos `΄` ist auch „griechische Schrift", aber eine Totaste mit Namen.
  if (istBuchstabe(key)) return kappeFuer(key, layoutSprache(), activeLayout().kleineKappen);
  return zeichenNameEl(key);
}

/** Die Taste rechts neben der Leertaste: am Mac „Option", sonst „Alt Gr" (Glossar §2.9). */
function altGrKappeEl(): string {
  return bottomLabelsFuer(activeLayout())[2] === "Option" ? "Option" : "Alt Gr";
}

/** „Γράφεται με το πλήκτρο Φ: αριστερός δείκτης, βασική σειρά." - so wird die Einheit getippt. */
export function unitHowToTypeEl(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT) {
    const ziffernMitShift = charAccess("2")?.mod === "shift";
    return (
      "Τα κεφαλαία τα γράφεις κρατώντας πατημένο το Shift με το άλλο χέρι." +
      (ziffernMitShift ? " Στη σειρά αριθμών το Shift δίνει τα ψηφία." : "")
    );
  }
  const acc = charAccess(unit);
  const vokale = lernweg && acc?.dead && istTotastenEinheit(unit, lernweg) ? totastenVokale(unit, lernweg) : [];
  if (acc && vokale.length > 0) {
    const zuerst =
      acc.mod === "shift"
        ? `Κράτα πατημένο το Shift και πάτησε πρώτα το νεκρό πλήκτρο ${kappeEl(acc.base)}`
        : `Πάτησε πρώτα το νεκρό πλήκτρο ${kappeEl(acc.base)}`;
    return `${zuerst}, μετά το φωνήεν: ${vokale.join(", ")}.`;
  }
  if (acc?.mod === "shift" && !acc.dead) return `Κράτα πατημένο το Shift και πάτησε το πλήκτρο ${kappeEl(acc.base)}.`;
  if (acc?.mod === "altgr" && !acc.dead) {
    const alt = altGrKappeEl();
    return acc.mitUmschalt
      ? `Κράτα πατημένα το ${alt} και το Shift και πάτησε το πλήκτρο ${kappeEl(acc.base)}.`
      : `Κράτα πατημένο το ${alt} και πάτησε το πλήκτρο ${kappeEl(acc.base)}.`;
  }
  if (acc?.dead) {
    if (acc.mod === "shift") return `Κράτα πατημένο το Shift, πάτησε το πλήκτρο ${kappeEl(acc.base)} και μετά το πλήκτρο διαστήματος.`;
    if (acc.mod === "altgr") return `Κράτα πατημένο το ${altGrKappeEl()}, πάτησε το πλήκτρο ${kappeEl(acc.base)} και μετά το πλήκτρο διαστήματος.`;
    return `Πάτησε το πλήκτρο ${kappeEl(acc.base)} και μετά το πλήκτρο διαστήματος.`;
  }
  const f = fingerForChar(unit, lernweg);
  const key = kappeEl(baseKeyForChar(unit, lernweg));
  const r = rowForChar(unit);
  const reihe = r === null ? null : REIHEN_EL[r];
  return f ? `Γράφεται με το πλήκτρο ${key}: ${FINGER_EL[f.id]}${reihe ? `, ${reihe}` : ""}.` : `Γράφεται με το πλήκτρο ${key}.`;
}

/** Die Karte der Feier: „γράμμα Φ", „ψηφίο 5", „πλήκτρο Shift". */
export function unlockInfoEl(unit: string, lernweg?: Lernweg): UnlockInfo {
  const k = unitKindImWeg(unit, lernweg);
  const name = unit === SHIFT_UNIT ? "Shift" : k === "ziffer" ? unit : unitLabelEl(unit, lernweg);
  return { glyph: unitGlyph(unit, true, lernweg), article: "", noun: gattungEl(unit, lernweg), name, howTo: unitHowToTypeEl(unit, lernweg) };
}

/** Die Braillezeilen-Meldung - „Νέο γράμμα: Φ", „Νέο σύμβολο: τοις εκατό %", „Νέο πλήκτρο: Shift". */
export function unlockBrailleLabelEl(unit: string, lernweg?: Lernweg): string {
  const i = unlockInfoEl(unit, lernweg);
  const nomen = gattungEl(unit, lernweg);
  if (lernweg && istTotastenEinheit(unit, lernweg)) return `Νέο ${nomen}: ${i.name} ${unit}`;
  const k = unitKindImWeg(unit, lernweg);
  const zeichen = k === "satzzeichen" || k === "sonderzeichen" ? ` ${unitGlyph(unit)}` : "";
  return `Νέο ${nomen}: ${i.name}${zeichen}`;
}

/** „γράμμα φι", „ψηφίο πέντε", „πλήκτρο Shift" - der Kopf der GESPROCHENEN Ansage (ς als „τελικό σίγμα"). */
function gesprochenerName(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT) return "Shift";
  if (unitKindImWeg(unit, lernweg) === "ziffer") return ZIFFERN_EL[unit] ?? unit;
  const name = zeichenNameEl(unit);
  return name !== unit ? name : unitLabelEl(unit, lernweg);
}

function grossAnfang(s: string): string {
  return s ? `${s[0].toUpperCase()}${s.slice(1)}` : s;
}

/**
 * Die gesprochene Ansage - eine oder mehrere Einheiten: „Μπράβο! Νέο γράμμα: Φ. Γράφεται με το πλήκτρο Φ: αριστερός δείκτης, βασική
 * σειρά." Mehrere Einheiten im Passiv mit Doppelpunkt („Μπράβο! Ξεκλειδώθηκαν: σύμβολο άνοιγμα παρένθεσης και σύμβολο …").
 */
export function unlockSpeechAlleEl(units: readonly string[], sober: boolean, lernweg?: Lernweg): string {
  const kopf = (u: string) => `${gattungEl(u, lernweg)} ${gesprochenerName(u, lernweg)}`;
  if (units.length <= 1) {
    const unit = units[0] ?? "";
    const lead = sober ? `Κάτι νέο για σένα: ${kopf(unit)}.` : `Μπράβο! Νέο ${gattungEl(unit, lernweg)}: ${gesprochenerName(unit, lernweg)}.`;
    return `${lead} ${unitHowToTypeEl(unit, lernweg)}`;
  }
  const koepfe = units.map(kopf);
  const liste = `${koepfe.slice(0, -1).join(", ")} και ${koepfe[koepfe.length - 1]}`;
  const lead = sober ? `Κάτι νέο για σένα: ${liste}.` : `Μπράβο! Ξεκλειδώθηκαν: ${liste}.`;
  const griffe = units.map((u) => `${grossAnfang(kopf(u))}. ${unitHowToTypeEl(u, lernweg)}`);
  return [lead, ...griffe].join(" ");
}
