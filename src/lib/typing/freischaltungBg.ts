/**
 * ★ G3c-VERTEILER (25.10.2026): DIE FREISCHALT-FEIER IN BULGARISCH.
 * ★ O-INHALT-BG (29.10.2026): gefüllt - Vorbild `freischaltungCs.ts`: Karte (`unlockInfoBg`), Braillezeilen-Meldung
 * (`unlockBrailleLabelBg`) und gesprochene Ansage (`unlockSpeechAlleBg`, ALLE neuen Einheiten).
 *
 * Glossar `recherche-bulgarisch-2026-10-25/GLOSSAR-bg.md` §2.4/§2.12: „Браво!" · „Нова буква: щ" · „Нов клавиш: Shift" ·
 * „Отключено: …"; sichtbar „Ново за теб". Regeln:
 *  · Das Lob trägt kein Geschlecht des Kindes: kein „Успял си" (l-Partizip), sondern ein Ausruf („Браво!") und die Neuheit als
 *    Hauptwort mit Doppelpunkt. Das Adjektiv richtet sich nach dem GATTUNGSWORT (буква f., цифра f., препинателен знак m., символ m.,
 *    клавиш m.), nie nach dem Kind; das Zeichen selbst steht ungebeugt nach dem Doppelpunkt.
 *  · Höchstens ein Ausrufezeichen je Meldung (Regel 1). Ziffern als Wort in der Ansage („Нова цифра: пет.") - kein Satz endet mit
 *    „5." (die Stimme läse eine Ordnungszahl).
 *  · Tastennamen lateinisch wie auf der Kappe, im Satz mit Kopfwort „клавиш" (Regel 11); kyrillische Kappen gross („клавиша Ж").
 *  · Finger und Reihen bulgarisch (Glossar §2.1: кутре, безименен пръст, среден пръст, показалец, палец; основен ред, горен ред,
 *    долен ред, ред с цифрите). `fingers.ts` kennt sie für „bg" noch nicht (dort Englisch, Etappe O4) - darum stehen die Zwillinge
 *    hier und lesen nur die Kennung des Fingers und den Index der Reihe.
 *  · BDS hat kein AltGr: die Taste rechts neben dem интервал heisst dort „Alt" ⇒ „десния Alt"; am Mac „Option".
 * Verteiler: `components/typing/UnlockCelebration.tsx` (`FEIER_INFO`, `FEIER_BRAILLE`, `FEIER_ANSAGE_GERUEST`).
 * Wächter: `tests/tastenflow-freischalt-feier-bg.test.tsx`; dazu `tastenflow-k3-feier-jede-bedienung-jeder-weg`,
 * `tastenflow-es-m2-freischalt-feier-alle`.
 * ⚠️ [G]: von einer Person mit Bulgarisch als Erstsprache gegenzulesen.
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
import { istBuchstabe, kappeFuer } from "./sprachRegister";
import { layoutSprache } from "./layouts";
import { unitLabelBg, zeichenNameBg } from "./tastenErklaerungBg";

/** Die Ziffern als Wort - für die Ansage, damit kein Satz mit „5." endet. Zählform ohne Hauptwort (wie `zahlwortBg`). */
const ZIFFERN_BG: Record<string, string> = {
  "0": "нула", "1": "едно", "2": "две", "3": "три", "4": "четири",
  "5": "пет", "6": "шест", "7": "седем", "8": "осем", "9": "девет",
};

/** Die Fingernamen bulgarisch, ohne Artikel (sie stehen nach einem Doppelpunkt) - Glossar §2.1. */
const FINGER_BG: Record<FingerId, string> = {
  "kleiner-links": "ляво кутре",
  "ring-links": "ляв безименен пръст",
  "mittel-links": "ляв среден пръст",
  "zeige-links": "ляв показалец",
  daumen: "палец",
  "zeige-rechts": "десен показалец",
  "mittel-rechts": "десен среден пръст",
  "ring-rechts": "десен безименен пръст",
  "kleiner-rechts": "дясно кутре",
};

/** Die Reihen bulgarisch - dieselbe Reihenfolge wie `ROW_NAMES` (Ziffernreihe, obere, Grundreihe, untere); immer mit Beiwort (Falle 4). */
const REIHEN_BG = ["ред с цифрите", "горен ред", "основен ред", "долен ред"];

/** Gattungswort und sein Geschlecht. */
type RodBg = "m" | "f";
function gattungBg(unit: string, lernweg?: Lernweg): { nomen: string; rod: RodBg } {
  if (unit === SHIFT_UNIT) return { nomen: "клавиш", rod: "m" };
  if (lernweg && istTotastenEinheit(unit, lernweg)) return { nomen: "мъртъв клавиш", rod: "m" };
  switch (unitKindImWeg(unit, lernweg)) {
    case "ziffer":
      return { nomen: "цифра", rod: "f" };
    case "satzzeichen":
      return { nomen: "препинателен знак", rod: "m" };
    case "sonderzeichen":
      return { nomen: "символ", rod: "m" };
    default:
      return { nomen: "буква", rod: "f" };
  }
}

/** „Нов" / „Нова" - nach dem Geschlecht des Gattungsworts, nie des Kindes. */
function nov(rod: RodBg): string {
  return rod === "f" ? "Нова" : "Нов";
}

/** Wie eine Taste im Satz heisst - IMMER nach „клавиша" (Regel 11): kyrillische Buchstaben gross wie auf der Kappe, sonst ihr Name. */
export function kappeBg(key: string): string {
  if (key === " ") return "за интервал";
  if (/^[0-9]$/.test(key)) return key;
  // Nur BUCHSTABEN gross wie auf der Kappe - der Tonos `΄` ist auch „griechische Schrift", aber eine Totaste mit Namen.
  if (istBuchstabe(key)) return kappeFuer(key, layoutSprache(), activeLayout().kleineKappen);
  return zeichenNameBg(key);
}

/** Die Taste rechts neben dem интервал: am Mac „Option", auf BDS „Alt" (dort gibt es kein AltGr), sonst „AltGr". */
function altGrKappeBg(): string {
  const rechts = bottomLabelsFuer(activeLayout())[2];
  if (rechts === "Option") return "Option";
  return rechts === "Alt" ? "десния Alt" : "AltGr";
}

/** „Пише се с клавиша Ж: десен показалец, основен ред." - so wird die Einheit getippt. Befehlsform, kein Geschlecht. */
export function unitHowToTypeBg(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT) {
    // Wo die Ziffern Shift brauchen (französische Tastatur), sagt es der zweite Satz.
    const ziffernMitShift = charAccess("2")?.mod === "shift";
    return (
      "Главна буква пишеш, като с другата ръка държиш клавиша Shift." +
      (ziffernMitShift ? " На реда с цифрите клавишът Shift дава цифрите." : "")
    );
  }
  const acc = charAccess(unit);
  const vokale = lernweg && acc?.dead && istTotastenEinheit(unit, lernweg) ? totastenVokale(unit, lernweg) : [];
  if (acc && vokale.length > 0) {
    const zuerst =
      acc.mod === "shift"
        ? `задръж клавиша Shift и натисни мъртвия клавиш ${kappeBg(acc.base)}`
        : `натисни мъртвия клавиш ${kappeBg(acc.base)}`;
    return `Първо ${zuerst}, после буквата: ${vokale.join(", ")}.`;
  }
  if (acc?.mod === "shift" && !acc.dead) return `Задръж клавиша Shift и натисни клавиша ${kappeBg(acc.base)}.`;
  if (acc?.mod === "altgr" && !acc.dead) {
    const alt = altGrKappeBg();
    return acc.mitUmschalt
      ? `Задръж ${alt} и клавиша Shift, после натисни клавиша ${kappeBg(acc.base)}.`
      : `Задръж ${alt} и натисни клавиша ${kappeBg(acc.base)}.`;
  }
  if (acc?.dead) {
    const mit = acc.mod === "shift" ? "задръж клавиша Shift и " : acc.mod === "altgr" ? `задръж ${altGrKappeBg()} и ` : "";
    return `Първо ${mit}натисни клавиша ${kappeBg(acc.base)}, после интервала.`;
  }
  const f = fingerForChar(unit, lernweg);
  const key = kappeBg(baseKeyForChar(unit, lernweg));
  const r = rowForChar(unit);
  const reihe = r === null ? null : REIHEN_BG[r];
  return f
    ? `Пише се с клавиша ${key}: ${FINGER_BG[f.id]}${reihe ? `, ${reihe}` : ""}.`
    : `Пише се с клавиша ${key}.`;
}

/** Die Karte der Feier: „буква Ж", „цифра 5", „клавиш Shift". */
export function unlockInfoBg(unit: string, lernweg?: Lernweg): UnlockInfo {
  const k = unitKindImWeg(unit, lernweg);
  const g = gattungBg(unit, lernweg);
  const name = unit === SHIFT_UNIT ? "Shift" : k === "ziffer" ? unit : unitLabelBg(unit, lernweg);
  return { glyph: unitGlyph(unit, true, lernweg), article: "", noun: g.nomen, name, howTo: unitHowToTypeBg(unit, lernweg) };
}

/** Die Braillezeilen-Meldung - „Нова буква: Ж", „Нов символ: процент %", „Нов клавиш: Shift". */
export function unlockBrailleLabelBg(unit: string, lernweg?: Lernweg): string {
  const i = unlockInfoBg(unit, lernweg);
  const g = gattungBg(unit, lernweg);
  if (lernweg && istTotastenEinheit(unit, lernweg)) return `${nov(g.rod)} ${g.nomen}: ${i.name} ${unit}`;
  const k = unitKindImWeg(unit, lernweg);
  const zeichen = k === "satzzeichen" || k === "sonderzeichen" ? ` ${unitGlyph(unit)}` : "";
  return `${nov(g.rod)} ${g.nomen}: ${i.name}${zeichen}`;
}

/** „буква ер голям", „цифра пет", „клавиш Shift" - der Kopf der GESPROCHENEN Ansage. */
function gesprochenerName(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT) return "Shift";
  if (unitKindImWeg(unit, lernweg) === "ziffer") return ZIFFERN_BG[unit] ?? unit;
  const name = zeichenNameBg(unit);
  // ъ ь й ѝ mit ihrem Schulnamen (allein verschluckt die Stimme sie leicht); sonst der Name der Einheit.
  return name !== unit ? name : unitLabelBg(unit, lernweg);
}

function grossAnfang(s: string): string {
  return s ? `${s[0].toLocaleUpperCase("bg-BG")}${s.slice(1)}` : s;
}

/**
 * Die gesprochene Ansage - eine oder mehrere Einheiten auf einmal, wie `unlockSpeechAlle`: „Браво! Нова буква: Ж. Пише се с клавиша
 * Ж: десен показалец, основен ред." Mehrere Einheiten im Passiv mit Doppelpunkt („Браво! Отключено: лява скоба и дясна скоба.") - so
 * braucht keine Aufzählung ein gemeinsames Geschlecht.
 */
export function unlockSpeechAlleBg(units: readonly string[], sober: boolean, lernweg?: Lernweg): string {
  const kopf = (u: string) => `${gattungBg(u, lernweg).nomen} ${gesprochenerName(u, lernweg)}`;
  if (units.length <= 1) {
    const unit = units[0] ?? "";
    const g = gattungBg(unit, lernweg);
    const lead = sober ? `Ново за теб: ${kopf(unit)}.` : `Браво! ${nov(g.rod)} ${g.nomen}: ${gesprochenerName(unit, lernweg)}.`;
    return `${lead} ${unitHowToTypeBg(unit, lernweg)}`;
  }
  const koepfe = units.map(kopf);
  const liste = `${koepfe.slice(0, -1).join(", ")} и ${koepfe[koepfe.length - 1]}`;
  const lead = sober ? `Ново за теб: ${liste}.` : `Браво! Отключено: ${liste}.`;
  const griffe = units.map((u) => `${grossAnfang(kopf(u))}. ${unitHowToTypeBg(u, lernweg)}`);
  return [lead, ...griffe].join(" ");
}
