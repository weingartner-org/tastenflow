/**
 * Tastenflow - die FREISCHALT-FEIER in der RUMÄNISCHEN Bedienung
 * (★ G3c-VERTEILER 25.10.2026 als Einhängepunkt angelegt, ★ O-RO 29.10.2026 gefüllt;
 * Glossar `recherche-rumänisch-2026-10-25/GLOSSAR-ro.md` §1 Regeln 2, 5, 7, 11, §2.1, §2.4, §2.8, §2.12, §4 Fallen 3/6).
 *
 * Dieselben drei Stücke wie `freischaltungCs.ts` - die Karte ({@link unlockInfoRo}), die Meldung für die Braillezeile
 * ({@link unlockBrailleLabelRo}) und die gesprochene Ansage ({@link unlockSpeechAlleRo}, ALLE neuen Einheiten).
 * Verteiler: `components/typing/UnlockCelebration.tsx` (`FEIER_INFO`, `FEIER_BRAILLE`, `FEIER_ANSAGE_GERUEST`).
 * Wächter: `tests/tastenflow-freischalt-ro.test.tsx`.
 *
 * Regeln:
 *  · Das Kind liest „tu"; das Lob trägt kein Geschlecht des Kindes - ein Ausruf („Foarte bine!") und die Neuheit als
 *    Hauptwort mit Doppelpunkt: „Literă nouă: ș", „Tastă nouă: Shift", „Noutate pentru tine" (Glossar §2.4, §2.12).
 *    Mehrere Einheiten im Perfekt mit „a avea" („Ai deblocat …") - das ist neutral (Regel 2).
 *  · Das Adjektiv richtet sich nach dem GATTUNGSWORT: literă f., cifră f., tastă f. ⇒ „nouă"; semn de punctuație n.,
 *    simbol n. ⇒ „nou". Das Zeichen selbst wird nie gebeugt.
 *  · Tastennamen wie auf der Kappe, im Satz IMMER nach „tasta" (Regel 11): „apasă tasta Shift", „tasta Alt Gr".
 *    Buchstaben mit Zeichen beim Namen („tasta s cu virgulă") - ein Kind muss s und ș unterscheiden (§2.8).
 *  · ★ Falle 6: kein gesprochener Satz endet mit einer Ziffer und einem Punkt - die Ansage sagt die Ziffer als Wort
 *    („Cifră nouă: cinci."), und eine Ziffern-TASTE am Satzende bekommt „de pe șirul de cifre" dazu.
 *  · ★ `fingerName(…, "ro")`, `rowName(…, "ro")` und `spokenLabel(…, "ro")` aus `fingers.ts` sind dort noch der englische
 *    Rückfall - darum stehen Finger- und Reihennamen HIER (Glossar §2.1: „șir" ist die Tastenreihe, „rând" die
 *    Übungszeile, Falle 3), die Zeichennamen kommen aus `tastenErklaerungRo.ts`.
 *  · Nur Komma-Formen ș ț, nur Bindestrich `-`, höchstens ein „!" je Meldung.
 */
import { baseKeyForChar, charAccess, fingerForChar, rowForChar, type FingerInfo } from "./fingers";
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
import { istBuchstabe } from "./sprachRegister";
import { unitLabelRo, zeichenNameRo } from "./tastenErklaerungRo";

/** Die Ziffern als Wort (Zählform, Glossar §2.10) - damit kein gesprochener Satz mit „5." endet (Falle 6). */
const ZIFFERN_RO: Readonly<Record<string, string>> = {
  "0": "zero", "1": "unu", "2": "doi", "3": "trei", "4": "patru",
  "5": "cinci", "6": "șase", "7": "șapte", "8": "opt", "9": "nouă",
};

/**
 * Die Finger nach `FingerInfo.id` (Glossar §2.1, `FINGER_RO`): „arătătorul stâng", „degetul mic drept". Alle Wörter sind
 * grammatisch Maskulinum/Neutrum und sagen nichts über das Kind.
 */
export const FINGER_RO: Readonly<Record<string, string>> = {
  "kleiner-links": "degetul mic stâng",
  "ring-links": "inelarul stâng",
  "mittel-links": "mijlociul stâng",
  "zeige-links": "arătătorul stâng",
  daumen: "degetul mare",
  "zeige-rechts": "arătătorul drept",
  "mittel-rechts": "mijlociul drept",
  "ring-rechts": "inelarul drept",
  "kleiner-rechts": "degetul mic drept",
};

/** Die vier Tastenreihen in der Reihenfolge von `ROW_NAMES` (Ziffernreihe … untere Reihe) - Glossar §2.1, nie „rând". */
export const ROW_NAMES_RO: readonly string[] = ["șirul de cifre", "șirul de sus", "șirul de bază", "șirul de jos"];

/** Der Fingername - fehlt eine id in der Tabelle, lieber nichts als ein deutscher oder englischer Rest. */
function fingerRo(f: FingerInfo): string | null {
  return FINGER_RO[f.id] ?? null;
}

/** Der Name der Reihe, auf der die Basistaste eines Zeichens liegt (wie `rowName`). */
function reiheRo(ch: string): string | null {
  const r = rowForChar(ch);
  return r === null ? null : (ROW_NAMES_RO[r] ?? null);
}

/**
 * Wie eine Taste im rumänischen Satz heisst - IMMER nach „tasta" (Regel 11): lateinische Buchstaben gross wie auf der
 * Kappe, Ziffern als Ziffer, alles andere beim Namen („s cu virgulă", „paranteză pătrată deschisă").
 */
export function kappeRo(key: string): string {
  if (/^[a-zA-Z]$/.test(key)) return key.toUpperCase();
  if (/^[0-9]$/.test(key)) return key;
  return zeichenNameRo(key);
}

/** „tasta X" am SATZENDE: eine Ziffer bekommt den Ort dazu, damit der Satz nicht auf „5." endet (Falle 6). */
function tastaAmEnde(key: string): string {
  return /^[0-9]$/.test(key) ? `tasta ${key} de pe șirul de cifre` : `tasta ${kappeRo(key)}`;
}

/** Die Taste rechts neben der Leertaste: unter Windows „Alt Gr", am Mac „Opțiune" (Glossar §2.9). */
function altGrKappeRo(): string {
  return bottomLabelsFuer(activeLayout())[2] === "Option" ? "Opțiune" : "Alt Gr";
}

/** Gattungswort - unbestimmt für „… nouă:", bestimmt für Aufzählung und Karte - und sein Geschlecht. */
interface GattungRo {
  /** „literă", „semn de punctuație" - für „Literă nouă: …". */
  nomen: string;
  /** „litera", „semnul de punctuație" - für die Karte und die Aufzählung. */
  bestimmt: string;
  /** f. ⇒ „nouă", n. ⇒ „nou". */
  rod: "f" | "n";
}

function gattungRo(unit: string, lernweg?: Lernweg): GattungRo {
  if (unit === SHIFT_UNIT) return { nomen: "tastă", bestimmt: "tasta", rod: "f" };
  if (lernweg && istTotastenEinheit(unit, lernweg)) return { nomen: "tastă moartă", bestimmt: "tasta moartă", rod: "f" };
  switch (unitKindImWeg(unit, lernweg)) {
    case "ziffer":
      return { nomen: "cifră", bestimmt: "cifra", rod: "f" };
    case "satzzeichen":
      return { nomen: "semn de punctuație", bestimmt: "semnul de punctuație", rod: "n" };
    case "sonderzeichen":
      return { nomen: "simbol", bestimmt: "simbolul", rod: "n" };
    default:
      return { nomen: "literă", bestimmt: "litera", rod: "f" };
  }
}

/** „Literă nouă", „Semn de punctuație nou" - das Adjektiv nach dem Gattungswort, nie nach dem Kind. */
function neuKopf(g: GattungRo): string {
  const satz = `${g.nomen} ${g.rod === "f" ? "nouă" : "nou"}`;
  return `${satz[0].toUpperCase()}${satz.slice(1)}`;
}

/**
 * „Se află pe tasta F: arătătorul stâng, șirul de bază." - so wird die Einheit getippt. Imperativ in der 2. Person
 * Einzahl (tu), Tastennamen nach „tasta", Finger und Reihe nach dem Doppelpunkt.
 */
export function unitHowToTypeRo(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT) {
    // Wo die Ziffern Shift brauchen (französische Tastaturen), sagt es der zweite Satz.
    const ziffernMitShift = charAccess("2")?.mod === "shift";
    return (
      "Pentru o literă mare, ține apăsată tasta Shift cu cealaltă mână și apasă litera." +
      (ziffernMitShift ? " Pe șirul de cifre, tasta Shift dă cifrele." : "")
    );
  }
  const acc = charAccess(unit);
  const vokale = lernweg && acc?.dead && istTotastenEinheit(unit, lernweg) ? totastenVokale(unit, lernweg) : [];
  if (acc && vokale.length > 0) {
    const zuerst =
      acc.mod === "shift"
        ? `ține apăsată tasta Shift și apasă tasta moartă ${kappeRo(acc.base)}`
        : `apasă tasta moartă ${kappeRo(acc.base)}`;
    return (
      `Mai întâi ${zuerst}, apoi litera: ${vokale.join(", ")}. ` +
      "Pentru o literă mare cu semn: mai întâi tasta moartă, apoi tasta Shift și litera."
    );
  }
  if (acc?.mod === "shift" && !acc.dead) return `Ține apăsată tasta Shift și apasă ${tastaAmEnde(acc.base)}.`;
  if (acc?.mod === "altgr" && !acc.dead) {
    const alt = altGrKappeRo();
    return acc.mitUmschalt
      ? `Ține apăsate tastele ${alt} și Shift, apoi apasă ${tastaAmEnde(acc.base)}.`
      : `Ține apăsată tasta ${alt} și apasă ${tastaAmEnde(acc.base)}.`;
  }
  if (acc?.dead) {
    const mit =
      acc.mod === "shift"
        ? "ține apăsată tasta Shift și "
        : acc.mod === "altgr"
          ? `ține apăsată tasta ${altGrKappeRo()} și `
          : "";
    return `Mai întâi ${mit}apasă tasta ${kappeRo(acc.base)}, apoi bara de spațiu.`;
  }
  const f = fingerForChar(unit, lernweg);
  const key = baseKeyForChar(unit, lernweg);
  const finger = f ? fingerRo(f) : null;
  const reihe = reiheRo(unit);
  if (!finger) return `Se află pe ${tastaAmEnde(key)}.`;
  return `Se află pe tasta ${kappeRo(key)}: ${finger}${reihe ? `, ${reihe}` : ""}.`;
}

/** Der Name auf der Karte und der Braillezeile: „Ș", „5", „punct", „Shift". */
function kartenName(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT) return "Shift";
  if (unitKindImWeg(unit, lernweg) === "ziffer") return unit;
  return unitLabelRo(unit, lernweg);
}

/** Die Karte der Feier: „litera Ș", „cifra 5", „semnul de punctuație punct", „tasta Shift". */
export function unlockInfoRo(unit: string, lernweg?: Lernweg): UnlockInfo {
  return {
    glyph: unitGlyph(unit),
    article: "",
    noun: gattungRo(unit, lernweg).bestimmt,
    name: kartenName(unit, lernweg),
    howTo: unitHowToTypeRo(unit, lernweg),
  };
}

/** Die Braillezeilen-Meldung - „Literă nouă: Ș", „Semn de punctuație nou: punct .", „Tastă nouă: Shift". */
export function unlockBrailleLabelRo(unit: string, lernweg?: Lernweg): string {
  const g = gattungRo(unit, lernweg);
  const name = kartenName(unit, lernweg);
  if (lernweg && istTotastenEinheit(unit, lernweg)) return `${neuKopf(g)}: ${name} ${unit}`;
  const k = unitKindImWeg(unit, lernweg);
  const zeichen = k === "satzzeichen" || k === "sonderzeichen" ? ` ${unitGlyph(unit)}` : "";
  return `${neuKopf(g)}: ${name}${zeichen}`;
}

/**
 * Der Name in der GESPROCHENEN Ansage: Ziffern als Wort, Buchstaben mit Zeichen beim Namen („s cu virgulă", „a cu
 * căciulă, mare"), Zeichen beim Namen der Sprachausgabe („cratimă", „ghilimele deschise").
 */
function gesprochenerName(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT) return "Shift";
  if (unitKindImWeg(unit, lernweg) === "ziffer") return ZIFFERN_RO[unit] ?? unit;
  if (istBuchstabe(unit)) return zeichenNameRo(unit);
  return unitLabelRo(unit, lernweg);
}

/** „litera s cu virgulă", „cifra cinci" - ohne doppeltes „semnul" („semnul întrebării" steht allein). */
function kopf(unit: string, lernweg?: Lernweg): string {
  const name = gesprochenerName(unit, lernweg);
  if (name.startsWith("semnul ")) return name;
  return `${gattungRo(unit, lernweg).bestimmt} ${name}`;
}

function grossAnfang(s: string): string {
  return s ? `${s[0].toUpperCase()}${s.slice(1)}` : s;
}

/** „a, b și c" (gemessen `Intl.ListFormat` ro: ohne Komma vor „și"). */
function liste(teile: readonly string[]): string {
  if (teile.length <= 1) return teile.join("");
  return `${teile.slice(0, -1).join(", ")} și ${teile[teile.length - 1]}`;
}

/**
 * Die gesprochene Ansage - eine oder mehrere Einheiten auf einmal, wie `unlockSpeechAlle`:
 * „Foarte bine! Literă nouă: s cu virgulă. Se află pe tasta s cu virgulă: degetul mic drept, șirul de bază."
 * Mehrere: „Foarte bine! Ai deblocat semnul de punctuație ghilimele deschise și semnul de punctuație ghilimele închise."
 * und danach jede Einheit mit ihrem Griff.
 */
export function unlockSpeechAlleRo(units: readonly string[], sober: boolean, lernweg?: Lernweg): string {
  if (units.length <= 1) {
    const unit = units[0] ?? "";
    const g = gattungRo(unit, lernweg);
    const lead = sober
      ? `Noutate pentru tine: ${kopf(unit, lernweg)}.`
      : `Foarte bine! ${neuKopf(g)}: ${gesprochenerName(unit, lernweg)}.`;
    return `${lead} ${unitHowToTypeRo(unit, lernweg)}`;
  }
  const koepfe = units.map((u) => kopf(u, lernweg));
  const lead = sober ? `Noutate pentru tine: ${liste(koepfe)}.` : `Foarte bine! Ai deblocat ${liste(koepfe)}.`;
  const griffe = units.map((u) => `${grossAnfang(kopf(u, lernweg))}. ${unitHowToTypeRo(u, lernweg)}`);
  return [lead, ...griffe].join(" ");
}
