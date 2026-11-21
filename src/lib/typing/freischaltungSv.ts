/**
 * ★ G3c-VERTEILER (25.10.2026): DIE FREISCHALT-FEIER IN SCHWEDISCH - Einhängepunkt.
 *
 * ★ O-INHALT-SV (29.10.2026): eigene Fassung nach Vorbild `freischaltungCs.ts` - die Karte (`unlockInfoSv`), die Meldung für die
 * Braillezeile (`unlockBrailleLabelSv`) und die gesprochene Ansage (`unlockSpeechAlleSv`, ALLE neuen Einheiten). Glossar
 * `GLOSSAR-sv.md` §2.12 („Bra jobbat!" · „Ny bokstav: å" · „Ny tangent: Skift" · „Ny död tangent: akut accent" · „Upplåst: ..." ·
 * Ziffern in der Ansage als Wort „Ny siffra: fem."), §2.4 („Nytt för dig"), §2.1 (Finger, Reihen, „död tangent"), §2.9 (Kappen:
 * Skift, Alt Gr, Mac Alternativ).
 *
 * Regeln: das Kind liest „du" (Imperativ „tryck", „håll ned"); „ny/nytt" richtet sich nach dem GATTUNGSWORT (bokstav, siffra,
 * tangent, död tangent: en-Wörter ⇒ „Ny"; skiljetecken, specialtecken: ett-Wörter ⇒ „Nytt"), nie nach dem Kind. Die Karte nennt die
 * bestimmte Form („bokstaven Å", „siffran 5"). „rad" ist auch die Übungszeile - die Reihen heissen immer mit Vorwort
 * („grundraden", „sifferraden"). Höchstens ein „!" je Meldung; kein Satz endet mit Ziffer und Punkt.
 *
 * Finger- und Reihennamen stehen HIER (`fingers.ts` gibt für „sv" heute die englischen - Etappe O4/G3b), ebenso die Zeichennamen über
 * `unitLabelSv` (`tastenErklaerungSv.ts`), weil `spokenLabel(…, "sv")` heute Englisch liefert.
 * Verteiler: `components/typing/UnlockCelebration.tsx`. Wächter: `tests/tastenflow-freischaltung-pt-br-sv.test.ts`.
 */
import { baseKeyForChar, charAccess, fingerForChar, rowForChar, type FingerInfo } from "./fingers";
import { activeLayout, bottomLabelsFuer } from "./layouts";
import { SHIFT_UNIT, istTotastenEinheit, totastenVokale, unitGlyph, unitKindImWeg, type UnlockInfo } from "./letters";
import type { Lernweg } from "./lernweg";
import { unitLabelSv } from "./tastenErklaerungSv";
import { zahlwortSv } from "./zahlwortSv";

/** Die Fingernamen (Glossar §2.1 „lillfinger · ringfinger · långfinger · pekfinger · tumme", mit Seite). */
const FINGER_SV: Readonly<Record<string, string>> = {
  "kleiner-links": "vänster lillfinger",
  "ring-links": "vänster ringfinger",
  "mittel-links": "vänster långfinger",
  "zeige-links": "vänster pekfinger",
  daumen: "tumme",
  "zeige-rechts": "höger pekfinger",
  "mittel-rechts": "höger långfinger",
  "ring-rechts": "höger ringfinger",
  "kleiner-rechts": "höger lillfinger",
};

/** Die Reihen (Glossar §2.1: „grundraden", „sifferraden", „övre raden", „nedre raden"). */
const REIHEN_SV = ["sifferraden", "övre raden", "grundraden", "nedre raden"];

/** Gattungswort: Grundform (Meldung „Ny bokstav: å"), bestimmte Form (Karte „bokstaven Å") und ob es ein ett-Wort ist. */
function gattungSv(unit: string, lernweg?: Lernweg): { nomen: string; bestimmt: string; ett: boolean } {
  if (unit === SHIFT_UNIT) return { nomen: "tangent", bestimmt: "tangenten", ett: false };
  if (lernweg && istTotastenEinheit(unit, lernweg)) return { nomen: "död tangent", bestimmt: "den döda tangenten", ett: false };
  switch (unitKindImWeg(unit, lernweg)) {
    case "ziffer":
      return { nomen: "siffra", bestimmt: "siffran", ett: false };
    case "satzzeichen":
      return { nomen: "skiljetecken", bestimmt: "skiljetecknet", ett: true };
    case "sonderzeichen":
      return { nomen: "specialtecken", bestimmt: "specialtecknet", ett: true };
    default:
      return { nomen: "bokstav", bestimmt: "bokstaven", ett: false };
  }
}

function ny(ett: boolean): string {
  return ett ? "Nytt" : "Ny";
}

/** Die Kappe: Buchstaben gross wie auf der Taste („Å"), sonst wie sie ist. */
function kappe(key: string): string {
  return /^[a-zåäö]$/.test(key) ? key.toUpperCase() : key;
}

/** Rechts neben der Leertaste: Windows „Alt Gr", Mac „Alternativ" (Glossar §2.9). */
function altGrKappe(): string {
  return bottomLabelsFuer(activeLayout())[2] === "Option" ? "Alternativ" : "Alt Gr";
}

function fingerSv(f: FingerInfo): string {
  return FINGER_SV[f.id] ?? f.name;
}

/** „Den sitter på tangenten F: vänster pekfinger, grundraden." - so wird die Einheit getippt. */
export function unitHowToTypeSv(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT) return "Håll ned Skift med andra handen, så blir bokstaven stor.";
  const acc = charAccess(unit);
  const vokale = lernweg && acc?.dead && istTotastenEinheit(unit, lernweg) ? totastenVokale(unit, lernweg) : [];
  if (acc && vokale.length > 0) {
    const zuerst =
      acc.mod === "shift"
        ? `Håll ned Skift och tryck först på den döda tangenten ${kappe(acc.base)}`
        : `Tryck först på den döda tangenten ${kappe(acc.base)}`;
    return (
      `${zuerst}, sedan på vokalen: ${vokale.join(", ")}. ` +
      "Stor bokstav med accent: först den döda tangenten, sedan Skift och vokalen."
    );
  }
  if (acc?.mod === "shift" && !acc.dead) return `Tryck på tangenten ${kappe(acc.base)} medan du håller ned Skift.`;
  if (acc?.mod === "altgr" && !acc.dead) {
    const alt = altGrKappe();
    return acc.mitUmschalt
      ? `Tryck på tangenten ${kappe(acc.base)} medan du håller ned ${alt} och Skift.`
      : `Tryck på tangenten ${kappe(acc.base)} medan du håller ned ${alt}.`;
  }
  if (acc?.dead) {
    const mit = acc.mod === "shift" ? "Håll ned Skift och tryck" : acc.mod === "altgr" ? `Håll ned ${altGrKappe()} och tryck` : "Tryck";
    return `${mit} först på tangenten ${kappe(acc.base)}, sedan på mellanslag.`;
  }
  const f = fingerForChar(unit, lernweg);
  const basis = baseKeyForChar(unit, lernweg);
  // Eine Taste ohne Buchstabe oder Ziffer heisst mit ihrem Namen (nicht „… .: …").
  const key = /[\p{L}\p{N}]/u.test(basis) ? kappe(basis) : unitLabelSv(basis);
  const r = rowForChar(unit);
  const reihe = r === null ? null : REIHEN_SV[r];
  return f
    ? `Den sitter på tangenten ${key}: ${fingerSv(f)}${reihe ? `, ${reihe}` : ""}.`
    : `Den sitter på tangenten ${key}.`;
}

/** Der sichtbare Name: Buchstabe gross wie auf der Kappe, Ziffer als Ziffer, sonst der Zeichenname. */
function sichtbarerName(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT) return "Skift";
  if (unitKindImWeg(unit, lernweg) === "ziffer") return unit;
  return unitLabelSv(unit);
}

/** Die Karte der Feier: „bokstaven Å", „siffran 5", „tangenten Skift". */
export function unlockInfoSv(unit: string, lernweg?: Lernweg): UnlockInfo {
  return {
    glyph: unitGlyph(unit),
    article: "",
    noun: gattungSv(unit, lernweg).bestimmt,
    name: sichtbarerName(unit, lernweg),
    howTo: unitHowToTypeSv(unit, lernweg),
  };
}

/** Die Braillezeilen-Meldung - „Ny bokstav: Å", „Nytt specialtecken: procent %", „Ny tangent: Skift". */
export function unlockBrailleLabelSv(unit: string, lernweg?: Lernweg): string {
  const g = gattungSv(unit, lernweg);
  const name = sichtbarerName(unit, lernweg);
  if (lernweg && istTotastenEinheit(unit, lernweg)) return `${ny(g.ett)} ${g.nomen}: ${name} ${unit}`;
  const k = unitKindImWeg(unit, lernweg);
  const zeichen = k === "satzzeichen" || k === "sonderzeichen" ? ` ${unitGlyph(unit)}` : "";
  return `${ny(g.ett)} ${g.nomen}: ${name}${zeichen}`;
}

/** Der Name in der Ansage: Ziffer als Wort („fem"), sonst wie auf der Karte. */
function gesprochenerName(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT) return "Skift";
  if (unitKindImWeg(unit, lernweg) === "ziffer") return zahlwortSv(Number(unit));
  return unitLabelSv(unit);
}

function grossAnfang(s: string): string {
  return s ? `${s[0].toUpperCase()}${s.slice(1)}` : s;
}

/**
 * Die gesprochene Ansage - eine oder mehrere Einheiten: „Bra jobbat! Ny bokstav: Å. Den sitter på tangenten Å: höger lillfinger,
 * övre raden." Mehrere: „Bra jobbat! Upplåst: bokstaven C och bokstaven P." Ruhige Fassung (ab 11 Jahren): „Nytt för dig: …".
 */
export function unlockSpeechAlleSv(units: readonly string[], sober: boolean, lernweg?: Lernweg): string {
  const kopf = (u: string) => `${gattungSv(u, lernweg).bestimmt} ${gesprochenerName(u, lernweg)}`;
  if (units.length <= 1) {
    const unit = units[0] ?? "";
    const g = gattungSv(unit, lernweg);
    const lead = sober
      ? `Nytt för dig: ${kopf(unit)}.`
      : `Bra jobbat! ${ny(g.ett)} ${g.nomen}: ${gesprochenerName(unit, lernweg)}.`;
    return `${lead} ${unitHowToTypeSv(unit, lernweg)}`;
  }
  const koepfe = units.map(kopf);
  const liste = `${koepfe.slice(0, -1).join(", ")} och ${koepfe[koepfe.length - 1]}`;
  const lead = sober ? `Nytt för dig: ${liste}.` : `Bra jobbat! Upplåst: ${liste}.`;
  const griffe = units.map((u) => `${grossAnfang(kopf(u))}. ${unitHowToTypeSv(u, lernweg)}`);
  return [lead, ...griffe].join(" ");
}
