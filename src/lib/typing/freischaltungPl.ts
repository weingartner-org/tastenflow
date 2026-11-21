/**
 * Tastenflow - die FREISCHALT-FEIER in der POLNISCHEN Bedienung
 * (★ O-PL, 02.10.2026, Glossar `recherche-polnisch-2026-10-02/GLOSSAR-pl.md`
 * §2.2 „odblokować", §2.11 „Nowość dla ciebie").
 *
 * Dieselben drei Stücke wie `freischaltungIt.ts` - die Karte, die Meldung für
 * die Braillezeile und die gesprochene Ansage. `letters.ts` bleibt in dieser
 * Etappe unberührt; darum stehen die polnischen Zwillinge hier und benutzen
 * nur, was `letters.ts` und `fingers.ts` schon ausführen.
 *
 * Regeln: das Kind liest „ty"; das Lob trägt kein Geschlecht des Kindes -
 * das Partizip gehört zur SACHE („Świetna robota! Litera ł jest
 * odblokowana.", Glossar Regel 2: nie die Vergangenheit der 2. Person); höchstens ein
 * Ausrufezeichen je Meldung; Tastennamen wie auf der Kappe („Shift", „prawy
 * Alt", „spacja", §2.9); Finger und Reihen aus `fingers.ts` („lewy
 * wskazujący", „rząd podstawowy"). Polnisch kennt keinen Artikel - `article`
 * bleibt leer, die Karte heisst „litera Ł", „cyfra 5", „znak interpunkcyjny
 * kropka".
 */
import {
  baseKeyForChar,
  charAccess,
  fingerForChar,
  fingerName,
  rowName,
  spokenLabel,
} from "./fingers";
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
import { unitLabelPl } from "./tastenErklaerungPl";

const ZIFFERN_PL: Record<string, string> = {
  "0": "zero", "1": "jeden", "2": "dwa", "3": "trzy", "4": "cztery",
  "5": "pięć", "6": "sześć", "7": "siedem", "8": "osiem", "9": "dziewięć",
};

/** Eine (Grund-)Taste als gut sprechbares polnisches Wort - nach „klawisz". */
function tastenWortPl(key: string): string {
  if (!key) return "";
  if (key === " ") return "spacja";
  if (ZIFFERN_PL[key]) return key;
  if (key.length === 1 && key.toUpperCase() !== key.toLowerCase()) return key === "ß" ? "ß" : key.toUpperCase();
  return spokenLabel(key, "pl");
}

/** Gattungswort und sein Geschlecht - „litera", „cyfra", „znak interpunkcyjny", „symbol", „klawisz". */
type GeschlechtPl = "m" | "f" | "plural";
function gattungPl(unit: string, lernweg?: Lernweg): { nomen: string; geschlecht: GeschlechtPl } {
  if (lernweg && istTotastenEinheit(unit, lernweg)) return { nomen: "klawisz", geschlecht: "m" };
  switch (unitKindImWeg(unit, lernweg)) {
    case "shift":
      return { nomen: "wielkie litery", geschlecht: "plural" };
    case "ziffer":
      return { nomen: "cyfra", geschlecht: "f" };
    case "satzzeichen":
      return { nomen: "znak interpunkcyjny", geschlecht: "m" };
    case "sonderzeichen":
      return { nomen: "symbol", geschlecht: "m" };
    default:
      return { nomen: "litera", geschlecht: "f" };
  }
}

/**
 * Die Taste rechts neben der Leertaste: unter Windows „prawy Alt" (auch wo die
 * Kappe „Alt Gr" heisst), am Mac „klawisz Option" (Glossar §2.9).
 */
function altGrNennungPl(): string {
  return bottomLabelsFuer(activeLayout())[2] === "Option" ? "klawisz Option" : "prawy Alt";
}

/**
 * „Leży na klawiszu F: lewy wskazujący, rząd podstawowy." - so wird die Einheit
 * getippt. Befehlsform, Tastennamen nach „klawisz" (Regel 11), Finger und Reihe
 * nach dem Doppelpunkt im Nominativ.
 */
export function unitHowToTypePl(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT)
    return "Tak piszesz wielkie litery: przytrzymaj klawisz Shift drugą ręką.";
  const acc = charAccess(unit);
  const vokale = lernweg && acc?.dead && istTotastenEinheit(unit, lernweg) ? totastenVokale(unit, lernweg) : [];
  if (acc && vokale.length > 0) {
    const taste = tastenWortPl(acc.base);
    const zuerst = acc.mod === "shift" ? `Shift i klawisz ${taste}` : `klawisz ${taste}`;
    return `Najpierw ${zuerst}, potem samogłoska: ${vokale.join(", ")}.`;
  }
  if (acc?.mod === "shift") return `Przytrzymaj klawisz Shift i naciśnij klawisz ${tastenWortPl(acc.base)}.`;
  if (acc?.mod === "altgr") {
    // ★ ą ć ę ł ń ó ś ź ż (R1 §2.2): prawy Alt + Grundbuchstabe; Grossbuchstabe mit Shift dazu.
    const alt = altGrNennungPl();
    return acc.mitUmschalt
      ? `Przytrzymaj ${alt} i klawisz Shift, a potem naciśnij klawisz ${tastenWortPl(acc.base)}.`
      : `Przytrzymaj ${alt} i naciśnij klawisz ${tastenWortPl(acc.base)}.`;
  }
  if (acc?.dead) return `Najpierw klawisz ${tastenWortPl(acc.base)}, potem spacja.`;
  const f = fingerForChar(unit, lernweg);
  const key = tastenWortPl(baseKeyForChar(unit, lernweg));
  const reihe = rowName(unit, "pl");
  return f
    ? `Leży na klawiszu ${key}: ${fingerName(f, "pl")}${reihe ? `, ${reihe}` : ""}.`
    : `Leży na klawiszu ${key}.`;
}

/** Die Karte der Feier: „litera Ł", „cyfra 5", „wielkie litery". */
export function unlockInfoPl(unit: string, lernweg?: Lernweg): UnlockInfo {
  const k = unitKindImWeg(unit, lernweg);
  const g = gattungPl(unit, lernweg);
  const name = k === "shift" ? "" : k === "ziffer" ? unit : unitLabelPl(unit);
  return {
    glyph: unitGlyph(unit),
    article: "",
    noun: g.nomen,
    name,
    howTo: unitHowToTypePl(unit, lernweg),
  };
}

/** „Nowy" / „Nowa" / „Nowe" - nach dem Geschlecht des Gattungsworts, nie des Kindes. */
function nowy(g: GeschlechtPl): string {
  return g === "f" ? "Nowa" : g === "plural" ? "Nowe" : "Nowy";
}

/** Die Braillezeilen-Meldung - „Nowa litera: Ł", „Nowy symbol: małpa @", „Nowość: wielkie litery". */
export function unlockBrailleLabelPl(unit: string, lernweg?: Lernweg): string {
  const i = unlockInfoPl(unit, lernweg);
  if (!i.name) return `Nowość: ${i.noun}`;
  if (lernweg && istTotastenEinheit(unit, lernweg)) return `Nowy klawisz: ${i.name} ${unit}`;
  const g = gattungPl(unit, lernweg);
  const k = unitKindImWeg(unit, lernweg);
  const zeichen = k === "satzzeichen" || k === "sonderzeichen" ? ` ${unitGlyph(unit)}` : "";
  return `${nowy(g.geschlecht)} ${g.nomen}: ${i.name}${zeichen}`;
}

/**
 * „litera a z ogonkiem", „cyfra pięć", „wielkie litery" - der Kopf der
 * GESPROCHENEN Ansage. Die neun polnischen Buchstaben mit ihrem Namen aus
 * `SPOKEN_PL` - „Ą" allein klänge wie „o" durch die Nase (Glossar §2.8).
 */
function unlockKopfPl(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT) return "wielkie litery";
  const g = gattungPl(unit, lernweg);
  const k = unitKindImWeg(unit, lernweg);
  if (k === "ziffer") return `${g.nomen} ${ZIFFERN_PL[unit] ?? unit}`;
  if (istBuchstabe(unit)) {
    const klein = kleinFuer(unit, "pl");
    const gesprochen = spokenLabel(klein, "pl");
    if (gesprochen !== klein) return `${g.nomen} ${gesprochen}`;
  }
  return `${g.nomen} ${unitLabelPl(unit)}`;
}

/** „jest odblokowana" / „jest odblokowany" / „są odblokowane" - nach dem Gattungswort. */
function odblokowany(g: GeschlechtPl): string {
  return g === "f" ? "jest odblokowana" : g === "plural" ? "są odblokowane" : "jest odblokowany";
}

function grossAnfang(s: string): string {
  return s ? `${s[0].toUpperCase()}${s.slice(1)}` : s;
}

function kleinAnfang(s: string): string {
  return s ? `${s[0].toLowerCase()}${s.slice(1)}` : s;
}

/**
 * Die gesprochene Ansage - eine oder mehrere Einheiten auf einmal, wie
 * `unlockSpeechAlle`: „Świetna robota! Litera eł jest odblokowana. Przytrzymaj
 * prawy Alt i naciśnij klawisz L." Bei mehreren Einheiten die -no-Form mit
 * Doppelpunkt („Odblokowano: litera a z ogonkiem i litera e z ogonkiem.") -
 * so braucht keine Aufzählung ein gemeinsames Geschlecht.
 */
export function unlockSpeechAllePl(units: readonly string[], sober: boolean, lernweg?: Lernweg): string {
  const koepfe = units.map((u) => unlockKopfPl(u, lernweg));
  if (units.length <= 1) {
    const unit = units[0] ?? "";
    const kopf = koepfe[0] ?? "";
    const lead = sober
      ? `Nowość dla ciebie: ${kopf}.`
      : `Świetna robota! ${grossAnfang(kopf)} ${odblokowany(gattungPl(unit, lernweg).geschlecht)}.`;
    return `${lead} ${unitHowToTypePl(unit, lernweg)}`;
  }
  const liste = `${koepfe.slice(0, -1).join(", ")} i ${koepfe[koepfe.length - 1]}`;
  const lead = sober ? `Nowość dla ciebie: ${liste}.` : `Świetna robota! Odblokowano: ${liste}.`;
  const griffe = units.map((u) => {
    const i = unlockInfoPl(u, lernweg);
    return `${grossAnfang(i.name || i.noun)}: ${kleinAnfang(i.howTo)}`;
  });
  return [lead, ...griffe].join(" ");
}
