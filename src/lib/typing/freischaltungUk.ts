/**
 * ★ G3c-VERTEILER (25.10.2026): DIE FREISCHALT-FEIER IN UKRAINISCH.
 * ★ O-INHALT-UK (29.10.2026): gefüllt - Vorbild `freischaltungCs.ts`: Karte (`unlockInfoUk`), Braillezeilen-Meldung
 * (`unlockBrailleLabelUk`) und gesprochene Ansage (`unlockSpeechAlleUk`, ALLE neuen Einheiten).
 *
 * Glossar `recherche-ukrainisch-2026-10-25/GLOSSAR-uk.md` §2.4/§2.12: „Чудово!" · „Нова літера: ї" · „Нова клавіша: Shift" ·
 * „Відкрито: …"; sichtbar „Нове для тебе". Regeln:
 *  · Das Lob trägt kein Geschlecht des Kindes (kein „Ти відкрив"): ein Ausruf, die Neuheit als Hauptwort mit Doppelpunkt, mehrere
 *    Einheiten unpersönlich auf -но („Відкрито: …"). Das Adjektiv richtet sich nach dem GATTUNGSWORT (літера f., цифра f., клавіша
 *    f., розділовий знак m., символ m.) - „Нова" / „Новий", nie nach dem Kind.
 *  · Höchstens ein Ausrufezeichen je Meldung. Ziffern in der Ansage als Wort („Нова цифра: п'ять.").
 *  · Tastennamen lateinisch, nie gebeugt, mit Kopfwort „клавіша" in dem Fall, den der Satz braucht („клавішею Ї", „клавішу Shift",
 *    Regel 11); „пробіл" wird gebeugt.
 *  · Finger und Reihen ukrainisch (Glossar §2.1: мізинець, безіменний, середній, вказівний, великий палець; основний ряд, верхній ряд,
 *    нижній ряд, ряд цифр). `fingers.ts` kennt sie für „uk" noch nicht (Etappe O4) - die Zwillinge stehen hier.
 * Verteiler: `components/typing/UnlockCelebration.tsx`. Wächter: `tests/tastenflow-freischalt-feier-uk.test.tsx`.
 * ⚠️ [G]: von einer Person mit Ukrainisch als Erstsprache gegenzulesen.
 */
import { baseKeyForChar, charAccess, fingerForChar, rowForChar, type FingerId } from "./fingers";
import { activeLayout, bottomLabelsFuer, layoutSprache } from "./layouts";
import { SHIFT_UNIT, istTotastenEinheit, totastenVokale, unitGlyph, unitKindImWeg, type UnlockInfo } from "./letters";
import type { Lernweg } from "./lernweg";
import { istBuchstabe, kappeFuer } from "./sprachRegister";
import { unitLabelUk, zeichenNameUk } from "./tastenErklaerungUk";

/** Die Ziffern als Wort - für die Ansage. Grundform (wie `zahlwortUk`). */
const ZIFFERN_UK: Record<string, string> = {
  "0": "нуль", "1": "один", "2": "два", "3": "три", "4": "чотири",
  "5": "п'ять", "6": "шість", "7": "сім", "8": "вісім", "9": "дев'ять",
};

/** Die Fingernamen ukrainisch (Nominativ, sie stehen nach einem Doppelpunkt) - Glossar §2.1. */
const FINGER_UK: Record<FingerId, string> = {
  "kleiner-links": "лівий мізинець",
  "ring-links": "лівий безіменний палець",
  "mittel-links": "лівий середній палець",
  "zeige-links": "лівий вказівний палець",
  daumen: "великий палець",
  "zeige-rechts": "правий вказівний палець",
  "mittel-rechts": "правий середній палець",
  "ring-rechts": "правий безіменний палець",
  "kleiner-rechts": "правий мізинець",
};

/** Die Reihen ukrainisch - dieselbe Reihenfolge wie `ROW_NAMES` (Ziffernreihe, obere, Grundreihe, untere); nie „рядок" (Zeile). */
const REIHEN_UK = ["ряд цифр", "верхній ряд", "основний ряд", "нижній ряд"];

/** Gattungswort und sein Geschlecht. */
type RodUk = "m" | "f";
function gattungUk(unit: string, lernweg?: Lernweg): { nomen: string; rod: RodUk } {
  if (unit === SHIFT_UNIT) return { nomen: "клавіша", rod: "f" };
  if (lernweg && istTotastenEinheit(unit, lernweg)) return { nomen: "мертва клавіша", rod: "f" };
  switch (unitKindImWeg(unit, lernweg)) {
    case "ziffer":
      return { nomen: "цифра", rod: "f" };
    case "satzzeichen":
      return { nomen: "розділовий знак", rod: "m" };
    case "sonderzeichen":
      return { nomen: "символ", rod: "m" };
    default:
      return { nomen: "літера", rod: "f" };
  }
}

/** „Новий" / „Нова" - nach dem Geschlecht des Gattungsworts, nie des Kindes. */
function novyj(rod: RodUk): string {
  return rod === "f" ? "Нова" : "Новий";
}

/** Wie eine Taste nach „клавіша" heisst: Buchstaben gross wie auf der Kappe, sonst ihr Name (die Leertaste steht für sich). */
export function kappeUk(key: string): string {
  if (/^[0-9]$/.test(key)) return key;
  if (istBuchstabe(key)) return kappeFuer(key, layoutSprache(), activeLayout().kleineKappen);
  return zeichenNameUk(key);
}

/** Die Taste rechts neben dem Leerzeichen: am Mac „Option", sonst „AltGr" (Glossar §2.9). */
function altGrKappeUk(): string {
  return bottomLabelsFuer(activeLayout())[2] === "Option" ? "Option" : "AltGr";
}

/** „Друкується клавішею О: правий вказівний палець, основний ряд." - so wird die Einheit getippt. */
export function unitHowToTypeUk(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT) {
    const ziffernMitShift = charAccess("2")?.mod === "shift";
    return (
      "Велику літеру друкуєш, коли другою рукою тримаєш клавішу Shift." +
      (ziffernMitShift ? " На ряду цифр клавіша Shift дає цифри." : "")
    );
  }
  const acc = charAccess(unit);
  const vokale = lernweg && acc?.dead && istTotastenEinheit(unit, lernweg) ? totastenVokale(unit, lernweg) : [];
  if (acc && vokale.length > 0) {
    const zuerst =
      acc.mod === "shift"
        ? `затисни клавішу Shift і натисни мертву клавішу ${kappeUk(acc.base)}`
        : `натисни мертву клавішу ${kappeUk(acc.base)}`;
    return `Спершу ${zuerst}, потім голосну: ${vokale.join(", ")}.`;
  }
  if (acc?.mod === "shift" && !acc.dead) return `Затисни клавішу Shift і натисни клавішу ${kappeUk(acc.base)}.`;
  if (acc?.mod === "altgr" && !acc.dead) {
    const alt = altGrKappeUk();
    return acc.mitUmschalt
      ? `Затисни клавіші ${alt} і Shift, потім натисни клавішу ${kappeUk(acc.base)}.`
      : `Затисни клавішу ${alt} і натисни клавішу ${kappeUk(acc.base)}.`;
  }
  if (acc?.dead) {
    const mit = acc.mod === "shift" ? "затисни клавішу Shift і " : acc.mod === "altgr" ? `затисни клавішу ${altGrKappeUk()} і ` : "";
    return `Спершу ${mit}натисни клавішу ${kappeUk(acc.base)}, потім пробіл.`;
  }
  const f = fingerForChar(unit, lernweg);
  const basis = baseKeyForChar(unit, lernweg);
  // „пробіл" wird gebeugt und braucht kein Kopfwort (Regel 11).
  const mitTaste = basis === " " ? "пробілом" : `клавішею ${kappeUk(basis)}`;
  const r = rowForChar(unit);
  const reihe = r === null ? null : REIHEN_UK[r];
  return f ? `Друкується ${mitTaste}: ${FINGER_UK[f.id]}${reihe ? `, ${reihe}` : ""}.` : `Друкується ${mitTaste}.`;
}

/** Die Karte der Feier: „літера Ї", „цифра 5", „клавіша Shift". */
export function unlockInfoUk(unit: string, lernweg?: Lernweg): UnlockInfo {
  const k = unitKindImWeg(unit, lernweg);
  const g = gattungUk(unit, lernweg);
  const name = unit === SHIFT_UNIT ? "Shift" : k === "ziffer" ? unit : unitLabelUk(unit, lernweg);
  return { glyph: unitGlyph(unit, true, lernweg), article: "", noun: g.nomen, name, howTo: unitHowToTypeUk(unit, lernweg) };
}

/** Die Braillezeilen-Meldung - „Нова літера: Ї", „Новий символ: відсоток %", „Нова клавіша: Shift". */
export function unlockBrailleLabelUk(unit: string, lernweg?: Lernweg): string {
  const i = unlockInfoUk(unit, lernweg);
  const g = gattungUk(unit, lernweg);
  if (lernweg && istTotastenEinheit(unit, lernweg)) return `${novyj(g.rod)} ${g.nomen}: ${i.name} ${unit}`;
  const k = unitKindImWeg(unit, lernweg);
  const zeichen = k === "satzzeichen" || k === "sonderzeichen" ? ` ${unitGlyph(unit)}` : "";
  return `${novyj(g.rod)} ${g.nomen}: ${i.name}${zeichen}`;
}

/** „літера м'який знак", „цифра п'ять", „клавіша Shift" - der Kopf der GESPROCHENEN Ansage. */
function gesprochenerName(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT) return "Shift";
  if (unitKindImWeg(unit, lernweg) === "ziffer") return ZIFFERN_UK[unit] ?? unit;
  const name = zeichenNameUk(unit);
  return name !== unit ? name : unitLabelUk(unit, lernweg);
}

function grossAnfang(s: string): string {
  return s ? `${s[0].toLocaleUpperCase("uk-UA")}${s.slice(1)}` : s;
}

/**
 * Die gesprochene Ansage - eine oder mehrere Einheiten: „Чудово! Нова літера: Ї. Друкується клавішею Ї: правий мізинець, верхній
 * ряд." Mehrere Einheiten unpersönlich mit Doppelpunkt („Чудово! Відкрито: символ ліва дужка і символ права дужка.").
 */
export function unlockSpeechAlleUk(units: readonly string[], sober: boolean, lernweg?: Lernweg): string {
  const kopf = (u: string) => `${gattungUk(u, lernweg).nomen} ${gesprochenerName(u, lernweg)}`;
  if (units.length <= 1) {
    const unit = units[0] ?? "";
    const g = gattungUk(unit, lernweg);
    const lead = sober ? `Нове для тебе: ${kopf(unit)}.` : `Чудово! ${novyj(g.rod)} ${g.nomen}: ${gesprochenerName(unit, lernweg)}.`;
    return `${lead} ${unitHowToTypeUk(unit, lernweg)}`;
  }
  const koepfe = units.map(kopf);
  const liste = `${koepfe.slice(0, -1).join(", ")} і ${koepfe[koepfe.length - 1]}`;
  const lead = sober ? `Нове для тебе: ${liste}.` : `Чудово! Відкрито: ${liste}.`;
  const griffe = units.map((u) => `${grossAnfang(kopf(u))}. ${unitHowToTypeUk(u, lernweg)}`);
  return [lead, ...griffe].join(" ");
}
