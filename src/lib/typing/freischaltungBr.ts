/**
 * ★ G3c-VERTEILER (25.10.2026): DIE FREISCHALT-FEIER IN PORTUGIESISCH (BRASILIEN) - Einhängepunkt.
 *
 * ★ O-INHALT-BR (29.10.2026): eigene Fassung nach Vorbild `freischaltungCs.ts` - die Karte (`unlockInfoBr`), die Meldung für die
 * Braillezeile (`unlockBrailleLabelBr`) und die gesprochene Ansage (`unlockSpeechAlleBr`, ALLE neuen Einheiten). Glossar
 * `GLOSSAR-pt-BR.md` §2.12 („Muito bem!" · „Nova letra: r" · „Nova tecla: Shift" · „Nova tecla de acento: til" · „Desbloqueado: ..."),
 * §2.4 („Novidade para você"), §2.1 (Finger „dedo mínimo · anelar · médio · indicador · polegar", Reihe „fileira"), §2.9 (Kappen).
 *
 * Regeln: das Kind liest „você" (Imperativ „aperte", „segure"); kein Adjektiv/Partizip am Kind - „novo/nova" richtet sich nach dem
 * GATTUNGSWORT (letra f., algarismo m., sinal de pontuação m., símbolo m., tecla f., tecla de acento f.), „Desbloqueado:" ist
 * unpersönlich. Tastennamen wie auf der Kappe mit Kopfwort „a tecla", die Leertaste ist „a barra de espaço". Höchstens ein
 * „!" je Meldung; kein Satz endet mit Ziffer und Punkt.
 *
 * Finger- und Reihennamen stehen HIER (`fingers.ts` gibt für „br" heute die englischen - Etappe O4/G3b), ebenso die Zeichennamen über
 * `unitLabelBr` (`tastenErklaerungBr.ts`), weil `spokenLabel(…, "br")` heute Englisch liefert.
 * Verteiler: `components/typing/UnlockCelebration.tsx`. Wächter: `tests/tastenflow-freischaltung-pt-br-sv.test.ts`.
 */
import { baseKeyForChar, charAccess, fingerForChar, rowForChar, type FingerInfo } from "./fingers";
import { activeLayout, bottomLabelsFuer } from "./layouts";
import { SHIFT_UNIT, istTotastenEinheit, totastenVokale, unitGlyph, unitKindImWeg, type UnlockInfo } from "./letters";
import type { Lernweg } from "./lernweg";
import { unitLabelBr } from "./tastenErklaerungBr";
import { ZAHLWORT_BR } from "./zahlwortBr";

/** Die Fingernamen (Glossar §2.1 „dedo mínimo · anelar · médio · indicador · polegar", mit Seite „mínimo direito"). */
const FINGER_BR: Readonly<Record<string, string>> = {
  "kleiner-links": "mínimo esquerdo",
  "ring-links": "anelar esquerdo",
  "mittel-links": "médio esquerdo",
  "zeige-links": "indicador esquerdo",
  daumen: "polegar",
  "zeige-rechts": "indicador direito",
  "mittel-rechts": "médio direito",
  "ring-rechts": "anelar direito",
  "kleiner-rechts": "mínimo direito",
};

/** Die Reihen (Glossar §2.1: „fileira" - „fila" ist in Brasilien die Warteschlange, „linha" die Übungszeile). */
const REIHEN_BR = ["fileira dos números", "fileira de cima", "fileira central", "fileira de baixo"];

/** Die Buchstaben mit Zeichen beim Namen (Glossar §2.8) - „ç" allein könnte die Stimme verschlucken. */
const GESPROCHEN_BR: Readonly<Record<string, string>> = {
  ç: "c com cedilha", á: "a com acento agudo", à: "a com acento grave", â: "a com acento circunflexo", ã: "a com til",
  é: "e com acento agudo", ê: "e com acento circunflexo", í: "i com acento agudo", ó: "o com acento agudo",
  ô: "o com acento circunflexo", õ: "o com til", ú: "u com acento agudo",
};

type Genero = "m" | "f";

function gattungBr(unit: string, lernweg?: Lernweg): { nomen: string; genero: Genero } {
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

/** Rechts neben der Leertaste: Windows „Alt Gr", Mac „Option" (Glossar §2.9). */
function altGrKappe(): string {
  return bottomLabelsFuer(activeLayout())[2] === "Option" ? "Option" : "Alt Gr";
}

function fingerBr(f: FingerInfo): string {
  return FINGER_BR[f.id] ?? f.name;
}

/** „Fica na tecla F: indicador esquerdo, fileira central." - so wird die Einheit getippt. */
export function unitHowToTypeBr(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT) return "Para escrever uma letra maiúscula, segure a tecla Shift com a outra mão.";
  const acc = charAccess(unit);
  const vokale = lernweg && acc?.dead && istTotastenEinheit(unit, lernweg) ? totastenVokale(unit, lernweg) : [];
  if (acc && vokale.length > 0) {
    const zuerst =
      acc.mod === "shift"
        ? `segure a tecla Shift e aperte a tecla de acento ${kappe(acc.base)}`
        : `aperte a tecla de acento ${kappe(acc.base)}`;
    return (
      `Primeiro ${zuerst}, depois a vogal: ${vokale.join(", ")}. ` +
      "Letra maiúscula com acento: primeiro a tecla de acento, depois a tecla Shift e a vogal."
    );
  }
  if (acc?.mod === "shift" && !acc.dead) return `Aperte a tecla ${kappe(acc.base)} segurando a tecla Shift.`;
  if (acc?.mod === "altgr" && !acc.dead) {
    const alt = altGrKappe();
    return acc.mitUmschalt
      ? `Aperte a tecla ${kappe(acc.base)} segurando as teclas ${alt} e Shift.`
      : `Aperte a tecla ${kappe(acc.base)} segurando a tecla ${alt}.`;
  }
  if (acc?.dead) {
    const mit = acc.mod === "shift" ? "segure a tecla Shift e " : acc.mod === "altgr" ? `segure a tecla ${altGrKappe()} e ` : "";
    return `Primeiro ${mit}aperte a tecla ${kappe(acc.base)}, depois a barra de espaço.`;
  }
  const f = fingerForChar(unit, lernweg);
  const basis = baseKeyForChar(unit, lernweg);
  // Eine Taste ohne Buchstabe oder Ziffer heisst mit ihrem Namen (nicht „… .: …").
  const key = /[\p{L}\p{N}]/u.test(basis) ? kappe(basis) : unitLabelBr(basis);
  const r = rowForChar(unit);
  const reihe = r === null ? null : REIHEN_BR[r];
  return f ? `Fica na tecla ${key}: ${fingerBr(f)}${reihe ? `, ${reihe}` : ""}.` : `Fica na tecla ${key}.`;
}

/** Der sichtbare Name: Buchstabe gross wie auf der Kappe, Ziffer als Ziffer, sonst der Zeichenname. */
function sichtbarerName(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT) return "Shift";
  if (unitKindImWeg(unit, lernweg) === "ziffer") return unit;
  return unitLabelBr(unit);
}

/** Die Karte der Feier: „letra Ç", „algarismo 5", „tecla Shift". */
export function unlockInfoBr(unit: string, lernweg?: Lernweg): UnlockInfo {
  return {
    glyph: unitGlyph(unit),
    article: "",
    noun: gattungBr(unit, lernweg).nomen,
    name: sichtbarerName(unit, lernweg),
    howTo: unitHowToTypeBr(unit, lernweg),
  };
}

/** Die Braillezeilen-Meldung - „Nova letra: Ç", „Novo símbolo: por cento %", „Nova tecla: Shift". */
export function unlockBrailleLabelBr(unit: string, lernweg?: Lernweg): string {
  const g = gattungBr(unit, lernweg);
  const name = sichtbarerName(unit, lernweg);
  if (lernweg && istTotastenEinheit(unit, lernweg)) return `${novo(g.genero)} ${g.nomen}: ${name} ${unit}`;
  const k = unitKindImWeg(unit, lernweg);
  const zeichen = k === "satzzeichen" || k === "sonderzeichen" ? ` ${unitGlyph(unit)}` : "";
  return `${novo(g.genero)} ${g.nomen}: ${name}${zeichen}`;
}

/** Der Name in der Ansage: Ziffer als Wort (Glossar §2.12), Buchstaben mit Zeichen beim Namen. */
function gesprochenerName(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT) return "Shift";
  if (unitKindImWeg(unit, lernweg) === "ziffer" && ZAHLWORT_BR) return ZAHLWORT_BR(Number(unit));
  return GESPROCHEN_BR[unit.toLowerCase()] ?? unitLabelBr(unit);
}

function grossAnfang(s: string): string {
  return s ? `${s[0].toUpperCase()}${s.slice(1)}` : s;
}

/**
 * Die gesprochene Ansage - eine oder mehrere Einheiten: „Muito bem! Nova letra: c com cedilha. Fica na tecla Ç: mínimo direito,
 * fileira central." Mehrere: „Muito bem! Desbloqueado: letra C e letra P." Ruhige Fassung (ab 11 Jahren): „Novidade para você: …".
 */
export function unlockSpeechAlleBr(units: readonly string[], sober: boolean, lernweg?: Lernweg): string {
  const kopf = (u: string) => `${gattungBr(u, lernweg).nomen} ${gesprochenerName(u, lernweg)}`;
  if (units.length <= 1) {
    const unit = units[0] ?? "";
    const g = gattungBr(unit, lernweg);
    const lead = sober
      ? `Novidade para você: ${kopf(unit)}.`
      : `Muito bem! ${novo(g.genero)} ${g.nomen}: ${gesprochenerName(unit, lernweg)}.`;
    return `${lead} ${unitHowToTypeBr(unit, lernweg)}`;
  }
  const koepfe = units.map(kopf);
  const liste = `${koepfe.slice(0, -1).join(", ")} e ${koepfe[koepfe.length - 1]}`;
  const lead = sober ? `Novidade para você: ${liste}.` : `Muito bem! Desbloqueado: ${liste}.`;
  const griffe = units.map((u) => `${grossAnfang(kopf(u))}. ${unitHowToTypeBr(u, lernweg)}`);
  return [lead, ...griffe].join(" ");
}
