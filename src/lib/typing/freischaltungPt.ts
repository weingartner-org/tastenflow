/**
 * ★ G3c-VERTEILER (25.10.2026): DIE FREISCHALT-FEIER IN PORTUGIESISCH (PORTUGAL) - Einhängepunkt.
 *
 * ★ O-INHALT-PT (29.10.2026): eigene Fassung nach Vorbild `freischaltungCs.ts` - die Karte (`unlockInfoPt`), die Meldung für die
 * Braillezeile (`unlockBrailleLabelPt`) und die gesprochene Ansage (`unlockSpeechAllePt`, ALLE neuen Einheiten). Glossar
 * `GLOSSAR-pt.md` §2.12 („Muito bem!" · „Nova letra: ç" · „Nova tecla: Shift" · „Nova tecla de acento: acento agudo" · Ziffer in der
 * Ansage als Wort „Novo algarismo: cinco."), §2.4 („Novidade para ti"), §2.1 (Finger, Reihen, „tecla de acento"), §2.9 (Kappen).
 *
 * Regeln: das Kind liest „tu" (Imperativ „prime", „mantém premida"); kein Adjektiv/Partizip am Kind - „novo/nova" richtet sich nach dem
 * GATTUNGSWORT (letra f., algarismo m., sinal de pontuação m., símbolo m., tecla f., tecla de acento f.), „Desbloqueado:" ist
 * unpersönlich. Tastennamen wie auf der Kappe mit Kopfwort „a tecla" (Regel 11), die Leertaste ist „a barra de espaço". Höchstens ein
 * „!" je Meldung; kein Satz endet mit Ziffer und Punkt.
 *
 * Finger- und Reihennamen stehen HIER (`fingers.ts` gibt für „pt" heute die englischen - Etappe O4/G3b), ebenso die Zeichennamen über
 * `unitLabelPt` (`tastenErklaerungPt.ts`), weil `spokenLabel(…, "pt")` heute Englisch liefert.
 * Verteiler: `components/typing/UnlockCelebration.tsx`. Wächter: `tests/tastenflow-freischaltung-pt-br-sv.test.ts`.
 */
import { baseKeyForChar, charAccess, fingerForChar, rowForChar, type FingerInfo } from "./fingers";
import { activeLayout, bottomLabelsFuer } from "./layouts";
import { SHIFT_UNIT, istTotastenEinheit, totastenVokale, unitGlyph, unitKindImWeg, type UnlockInfo } from "./letters";
import type { Lernweg } from "./lernweg";
import { unitLabelPt } from "./tastenErklaerungPt";
import { ZAHLWORT_PT } from "./zahlwortPt";

/** Die Fingernamen (Glossar §2.1 „mindinho · anelar · médio · indicador · polegar", mit Seite). */
const FINGER_PT: Readonly<Record<string, string>> = {
  "kleiner-links": "mindinho esquerdo",
  "ring-links": "anelar esquerdo",
  "mittel-links": "médio esquerdo",
  "zeige-links": "indicador esquerdo",
  daumen: "polegar",
  "zeige-rechts": "indicador direito",
  "mittel-rechts": "médio direito",
  "ring-rechts": "anelar direito",
  "kleiner-rechts": "mindinho direito",
};

/** Die Reihen (Glossar §2.1: „fila", nie „linha" - das ist die Übungszeile). */
const REIHEN_PT = ["fila dos números", "fila de cima", "fila de base", "fila de baixo"];

/** Die Buchstaben mit Zeichen beim Namen (Glossar §2.8) - „ç" allein könnte die Stimme verschlucken. */
const GESPROCHEN_PT: Readonly<Record<string, string>> = {
  ç: "c com cedilha", á: "a com acento agudo", à: "a com acento grave", â: "a com acento circunflexo", ã: "a com til",
  é: "e com acento agudo", ê: "e com acento circunflexo", í: "i com acento agudo", ó: "o com acento agudo",
  ô: "o com acento circunflexo", õ: "o com til", ú: "u com acento agudo",
};

type Genero = "m" | "f";

function gattungPt(unit: string, lernweg?: Lernweg): { nomen: string; genero: Genero } {
  if (unit === SHIFT_UNIT) return { nomen: "tecla", genero: "f" };
  if (lernweg && istTotastenEinheit(unit, lernweg)) return { nomen: "tecla de acento", genero: "f" };
  switch (unitKindImWeg(unit, lernweg)) {
    case "ziffer":
      return { nomen: "algarismo", genero: "m" };
    case "satzzeichen":
      return { nomen: "sinal de pontuação", genero: "m" };
    case "sonderzeichen":
      return { nomen: "símbolo", genero: "m" };
    default:
      return { nomen: "letra", genero: "f" };
  }
}

function novo(g: Genero): string {
  return g === "f" ? "Nova" : "Novo";
}

/** Die Kappe: lateinische Buchstaben gross wie auf der Taste („Ç"), sonst wie sie ist. */
function kappe(key: string): string {
  return /^[a-zç]$/.test(key) ? key.toUpperCase() : key;
}

/** Rechts neben der Leertaste: Windows „Alt Gr", Mac „Opção" (Glossar §2.9). */
function altGrKappe(): string {
  return bottomLabelsFuer(activeLayout())[2] === "Option" ? "Opção" : "Alt Gr";
}

function fingerPt(f: FingerInfo): string {
  return FINGER_PT[f.id] ?? f.name;
}

/** „Está na tecla F: indicador esquerdo, fila de base." - so wird die Einheit getippt. */
export function unitHowToTypePt(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT) return "Para escrever uma maiúscula, mantém premida a tecla Shift com a outra mão.";
  const acc = charAccess(unit);
  const vokale = lernweg && acc?.dead && istTotastenEinheit(unit, lernweg) ? totastenVokale(unit, lernweg) : [];
  if (acc && vokale.length > 0) {
    const zuerst =
      acc.mod === "shift"
        ? `mantém premida a tecla Shift e prime a tecla de acento ${kappe(acc.base)}`
        : `prime a tecla de acento ${kappe(acc.base)}`;
    return (
      `Primeiro ${zuerst}, depois a vogal: ${vokale.join(", ")}. ` +
      "Maiúscula com acento: primeiro a tecla de acento, depois a tecla Shift e a vogal."
    );
  }
  if (acc?.mod === "shift" && !acc.dead) return `Prime a tecla ${kappe(acc.base)} com a tecla Shift premida.`;
  if (acc?.mod === "altgr" && !acc.dead) {
    const alt = altGrKappe();
    return acc.mitUmschalt
      ? `Prime a tecla ${kappe(acc.base)} com as teclas ${alt} e Shift premidas.`
      : `Prime a tecla ${kappe(acc.base)} com a tecla ${alt} premida.`;
  }
  if (acc?.dead) {
    const mit = acc.mod === "shift" ? "mantém premida a tecla Shift e " : acc.mod === "altgr" ? `mantém premida a tecla ${altGrKappe()} e ` : "";
    return `Primeiro ${mit}prime a tecla ${kappe(acc.base)}, depois a barra de espaço.`;
  }
  const f = fingerForChar(unit, lernweg);
  const basis = baseKeyForChar(unit, lernweg);
  // Eine Taste ohne Buchstabe oder Ziffer heisst mit ihrem Namen (nicht „… .: …").
  const key = /[\p{L}\p{N}]/u.test(basis) ? kappe(basis) : unitLabelPt(basis);
  const r = rowForChar(unit);
  const reihe = r === null ? null : REIHEN_PT[r];
  return f ? `Está na tecla ${key}: ${fingerPt(f)}${reihe ? `, ${reihe}` : ""}.` : `Está na tecla ${key}.`;
}

/** Der sichtbare Name: Buchstabe gross wie auf der Kappe, Ziffer als Ziffer, sonst der Zeichenname. */
function sichtbarerName(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT) return "Shift";
  if (unitKindImWeg(unit, lernweg) === "ziffer") return unit;
  return unitLabelPt(unit);
}

/** Die Karte der Feier: „letra Ç", „algarismo 5", „tecla Shift". */
export function unlockInfoPt(unit: string, lernweg?: Lernweg): UnlockInfo {
  return {
    glyph: unitGlyph(unit),
    article: "",
    noun: gattungPt(unit, lernweg).nomen,
    name: sichtbarerName(unit, lernweg),
    howTo: unitHowToTypePt(unit, lernweg),
  };
}

/** Die Braillezeilen-Meldung - „Nova letra: Ç", „Novo símbolo: por cento %", „Nova tecla: Shift". */
export function unlockBrailleLabelPt(unit: string, lernweg?: Lernweg): string {
  const g = gattungPt(unit, lernweg);
  const name = sichtbarerName(unit, lernweg);
  if (lernweg && istTotastenEinheit(unit, lernweg)) return `${novo(g.genero)} ${g.nomen}: ${name} ${unit}`;
  const k = unitKindImWeg(unit, lernweg);
  const zeichen = k === "satzzeichen" || k === "sonderzeichen" ? ` ${unitGlyph(unit)}` : "";
  return `${novo(g.genero)} ${g.nomen}: ${name}${zeichen}`;
}

/** Der Name in der Ansage: Ziffer als Wort (Glossar §2.12), Buchstaben mit Zeichen beim Namen. */
function gesprochenerName(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT) return "Shift";
  if (unitKindImWeg(unit, lernweg) === "ziffer" && ZAHLWORT_PT) return ZAHLWORT_PT(Number(unit));
  return GESPROCHEN_PT[unit.toLowerCase()] ?? unitLabelPt(unit);
}

function grossAnfang(s: string): string {
  return s ? `${s[0].toUpperCase()}${s.slice(1)}` : s;
}

/**
 * Die gesprochene Ansage - eine oder mehrere Einheiten: „Muito bem! Nova letra: c com cedilha. Está na tecla Ç: mindinho direito,
 * fila de base." Mehrere: „Muito bem! Desbloqueado: letra C e letra P." Ruhige Fassung (ab 11 Jahren): „Novidade para ti: …".
 */
export function unlockSpeechAllePt(units: readonly string[], sober: boolean, lernweg?: Lernweg): string {
  const kopf = (u: string) => `${gattungPt(u, lernweg).nomen} ${gesprochenerName(u, lernweg)}`;
  if (units.length <= 1) {
    const unit = units[0] ?? "";
    const g = gattungPt(unit, lernweg);
    const lead = sober
      ? `Novidade para ti: ${kopf(unit)}.`
      : `Muito bem! ${novo(g.genero)} ${g.nomen}: ${gesprochenerName(unit, lernweg)}.`;
    return `${lead} ${unitHowToTypePt(unit, lernweg)}`;
  }
  const koepfe = units.map(kopf);
  const liste = `${koepfe.slice(0, -1).join(", ")} e ${koepfe[koepfe.length - 1]}`;
  const lead = sober ? `Novidade para ti: ${liste}.` : `Muito bem! Desbloqueado: ${liste}.`;
  const griffe = units.map((u) => `${grossAnfang(kopf(u))}. ${unitHowToTypePt(u, lernweg)}`);
  return [lead, ...griffe].join(" ");
}
