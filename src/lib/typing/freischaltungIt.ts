/**
 * Tastenflow - die FREISCHALT-FEIER in der ITALIENISCHEN Bedienung
 * (★ O-IT, 02.10.2026, Glossar `recherche-italienisch-2026-10-02/GLOSSAR-it.md`).
 *
 * Dieselben drei Stücke wie `unlockInfoEs`, `unlockBrailleLabelEs` und
 * `unlockSpeechAlle(…, "es")` in `letters.ts` - die Karte, die Meldung für die
 * Braillezeile und die gesprochene Ansage. `letters.ts` bleibt in dieser
 * Etappe unberührt (sie gehört zu Reihenfolge und Stufen, Etappe F4); darum
 * stehen die italienischen Zwillinge hier und benutzen nur, was `letters.ts`
 * und `fingers.ts` schon ausführen.
 *
 * Regeln: das Kind liest „tu"; Lob ohne Adjektiv-Endung („Ottimo lavoro!",
 * nie „Bravo/Brava", Glossar Regel 2); höchstens ein Ausrufezeichen je
 * Meldung; Tastennamen wie auf der italienischen Kappe („Maiusc", „Alt Gr",
 * „barra spaziatrice", §2.9); Finger und Reihen aus `fingers.ts` („indice
 * sinistro", „riga di base").
 */
import {
  baseKeyForChar,
  charAccess,
  fingerForChar,
  fingerName,
  rowName,
  spokenLabel,
} from "./fingers";
import {
  SHIFT_UNIT,
  istTotastenEinheit,
  totastenVokale,
  unitGlyph,
  unitKindImWeg,
  type UnlockInfo,
} from "./letters";
import type { Lernweg } from "./lernweg";
import { activeLayout, bottomLabelsFuer } from "./layouts";
import { kombizeichenZu } from "./totasten";
import { unitLabelIt } from "./tastenErklaerungIt";

const ZIFFERN_IT: Record<string, string> = {
  "0": "zero", "1": "uno", "2": "due", "3": "tre", "4": "quattro",
  "5": "cinque", "6": "sei", "7": "sette", "8": "otto", "9": "nove",
};

/** Eine (Grund-)Taste als gut sprechbares italienisches Wort. */
function tastenWortIt(key: string): string {
  if (!key) return "";
  if (key === " ") return "barra spaziatrice";
  if (ZIFFERN_IT[key]) return ZIFFERN_IT[key];
  if (key.length === 1 && key.toUpperCase() !== key.toLowerCase()) return key === "ß" ? "ß" : key.toUpperCase();
  return spokenLabel(key, "it");
}

/** Artikel und Gattungswort - „la lettera", „il numero", „le maiuscole", „il tasto". */
function gattungIt(unit: string, lernweg?: Lernweg): { artikel: string; nomen: string; weiblich: boolean } {
  if (lernweg && istTotastenEinheit(unit, lernweg)) return { artikel: "il", nomen: "tasto", weiblich: false };
  switch (unitKindImWeg(unit, lernweg)) {
    case "shift":
      return { artikel: "le", nomen: "maiuscole", weiblich: true };
    case "ziffer":
      return { artikel: "il", nomen: "numero", weiblich: false };
    case "satzzeichen":
      return { artikel: "il", nomen: "segno di punteggiatura", weiblich: false };
    case "sonderzeichen":
      return { artikel: "il", nomen: "carattere speciale", weiblich: false };
    default:
      return { artikel: "la", nomen: "lettera", weiblich: true };
  }
}

/** „Si trova sul tasto F, indice sinistro, nella riga di base." - so wird die Einheit getippt. */
export function unitHowToTypeIt(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT)
    return "Così si scrivono le maiuscole: tieni premuto il tasto Maiusc con l'altra mano.";
  // ★ F8-it (02.10.2026, F4-Befund §10 Punkt 5): `ì ò ù` auf der Schweizer Belegung (Tessin, Graubünden) entstehen über die
  // Gravis-Totaste - „Si trova sul tasto Ì." wäre dort falsch (es gibt die Taste nicht). Zwei Schritte, wie die Finger-Ansage
  // (`fingerGuideIt`). Auf `it` und `it-qzerty` findet `kombizeichenZu` nichts - dort bleibt es bei der eigenen Taste.
  const kombi = kombizeichenZu(unit, activeLayout());
  if (kombi) {
    const fTot = fingerForChar(kombi.tot, lernweg);
    const mod = activeLayout().access[kombi.tot]?.mod;
    const zusatz = mod === "altgr" ? `, con ${bottomLabelsFuer(activeLayout())[2]}` : mod === "shift" ? ", con Maiusc" : "";
    return (
      `Si scrive in due passi: prima il tasto morto ${spokenLabel(kombi.tot, "it")} (${fTot ? fingerName(fTot, "it") : ""}${zusatz}), ` +
      `poi la lettera ${tastenWortIt(kombi.dann)}.`
    );
  }
  const acc = charAccess(unit);
  const vokale = lernweg && acc?.dead && istTotastenEinheit(unit, lernweg) ? totastenVokale(unit, lernweg) : [];
  if (acc && vokale.length > 0) {
    const taste = tastenWortIt(acc.base);
    const zuerst = acc.mod === "shift" ? `Maiusc e il tasto ${taste}` : `il tasto ${taste}`;
    return `Prima ${zuerst}, poi la vocale: ${vokale.join(", ")}.`;
  }
  if (acc?.mod === "shift") return `Si scrive con Maiusc e ${tastenWortIt(acc.base)}.`;
  if (acc?.mod === "altgr") return `Si scrive con Alt Gr e ${tastenWortIt(acc.base)}.`;
  if (acc?.dead) return `Prima il tasto ${tastenWortIt(acc.base)}, poi la barra spaziatrice.`;
  const f = fingerForChar(unit, lernweg);
  const key = tastenWortIt(baseKeyForChar(unit, lernweg));
  const reihe = rowName(unit, "it");
  return f
    ? `Si trova sul tasto ${key}, ${fingerName(f, "it")}${reihe ? `, nella ${reihe}` : ""}.`
    : `Si trova sul tasto ${key}.`;
}

/** Die Karte der Feier: „la lettera R", „il numero 5", „le maiuscole". */
export function unlockInfoIt(unit: string, lernweg?: Lernweg): UnlockInfo {
  const k = unitKindImWeg(unit, lernweg);
  const g = gattungIt(unit, lernweg);
  const name = k === "shift" ? "" : k === "ziffer" ? unit : unitLabelIt(unit);
  return {
    glyph: unitGlyph(unit),
    article: g.artikel,
    noun: k === "shift" ? "le maiuscole" : g.nomen,
    name,
    howTo: unitHowToTypeIt(unit, lernweg),
  };
}

/** Die Braillezeilen-Meldung - „Nuova lettera: R", „Nuovo carattere speciale: chiocciola @". */
export function unlockBrailleLabelIt(unit: string, lernweg?: Lernweg): string {
  const i = unlockInfoIt(unit, lernweg);
  if (!i.name) return `Novità: ${i.noun}`;
  if (lernweg && istTotastenEinheit(unit, lernweg)) return `Nuovo tasto: ${i.name} ${unit}`;
  const g = gattungIt(unit, lernweg);
  const k = unitKindImWeg(unit, lernweg);
  const zeichen = k === "satzzeichen" || k === "sonderzeichen" ? ` ${unitGlyph(unit)}` : "";
  return `${g.weiblich ? "Nuova" : "Nuovo"} ${g.nomen}: ${i.name}${zeichen}`;
}

/** „la lettera R", „il numero cinque", „le maiuscole" - der Kopf der Ansage. */
function unlockKopfIt(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT) return "le maiuscole";
  const g = gattungIt(unit, lernweg);
  const name = unitKindImWeg(unit, lernweg) === "ziffer" ? (ZIFFERN_IT[unit] ?? unit) : unitLabelIt(unit);
  return `${g.artikel} ${g.nomen} ${name}`;
}

function grossAnfang(s: string): string {
  return s ? `${s[0].toUpperCase()}${s.slice(1)}` : s;
}

function kleinAnfang(s: string): string {
  return s ? `${s[0].toLowerCase()}${s.slice(1)}` : s;
}

/**
 * Die gesprochene Ansage - eine oder mehrere Einheiten auf einmal, wie
 * `unlockSpeechAlle`: „Ottimo lavoro! Hai sbloccato la lettera R. Si trova sul
 * tasto R, indice sinistro, nella riga superiore." Mit „avere" bleibt das
 * Partizip ohne Geschlecht.
 */
export function unlockSpeechAlleIt(units: readonly string[], sober: boolean, lernweg?: Lernweg): string {
  const koepfe = units.map((u) => unlockKopfIt(u, lernweg));
  const liste =
    koepfe.length <= 1 ? (koepfe[0] ?? "") : `${koepfe.slice(0, -1).join(", ")} e ${koepfe[koepfe.length - 1]}`;
  const lead = sober ? `Nuovo per te: ${liste}.` : `Ottimo lavoro! Hai sbloccato ${liste}.`;
  if (units.length <= 1) return `${lead} ${unitHowToTypeIt(units[0] ?? "", lernweg)}`;
  const griffe = units.map((u) => {
    const i = unlockInfoIt(u, lernweg);
    return `${grossAnfang(i.name || i.noun)}: ${kleinAnfang(i.howTo)}`;
  });
  return [lead, ...griffe].join(" ");
}
