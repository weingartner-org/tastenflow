/**
 * Tastenflow - die FREISCHALT-FEIER in der TSCHECHISCHEN Bedienung
 * (★ O-CS, 03.10.2026, Glossar `recherche-tschechisch-2026-10-02/GLOSSAR-cs.md`
 * §2.2 „odemknout", §2.4 „Novinka pro tebe", §4 Falle 1/4).
 *
 * Dieselben drei Stücke wie `freischaltungPl.ts` - die Karte, die Meldung für
 * die Braillezeile und die gesprochene Ansage. `letters.ts` bleibt in dieser
 * Etappe unberührt; darum stehen die tschechischen Zwillinge hier und benutzen
 * nur, was `letters.ts` und `fingers.ts` schon ausführen.
 *
 * Regeln: das Kind liest „ty"; das Lob trägt kein Geschlecht des Kindes - keine
 * Vergangenheit der 2. Person, das Lob ist ein Ausruf („Výborně!") und die
 * Neuheit ein Hauptwort mit Doppelpunkt: „Nové písmeno: ř", „Nová klávesa:
 * Shift", „Novinka pro tebe" (Glossar §2.4). Das Adjektiv richtet sich nach dem
 * GATTUNGSWORT (písmeno, číslice, znaménko, znak, klávesa), nie nach dem Kind,
 * und das Zeichen selbst wird nie gebeugt. Höchstens ein Ausrufezeichen je
 * Meldung. Tastennamen wie auf der Kappe, im Satz mit „klávesa" (Regel 11);
 * Finger und Reihen aus `fingers.ts` („levý ukazováček", „základní řada").
 * Tschechisch kennt keinen Artikel - `article` bleibt leer, die Karte heisst
 * „písmeno ř", „číslice 5", „interpunkční znaménko tečka".
 * ★★★ Glossar §4 Falle 1: auf der tschechischen Tastatur gibt Shift auf der
 * číselná řada die Ziffer - „číslice 2: podrž klávesu Shift a stiskni klávesu
 * e s háčkem", und die grossen Č Š Ř Ž kommen über die Totaste.
 * ★ Falle 4: kein gesprochener Satz endet mit einer Ziffer und einem Punkt -
 * die Ansage sagt die Ziffer als Wort („Nová číslice: pět.").
 */
import {
  baseKeyForChar,
  charAccess,
  fingerForChar,
  fingerName,
  kappeCs,
  keyPlaceHintCs,
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
import { unitLabelCs } from "./tastenErklaerungCs";

/** Die Ziffern als Wort - für die Ansage, damit kein Satz mit „5." endet (Glossar §4 Falle 4). */
const ZIFFERN_CS: Record<string, string> = {
  "0": "nula", "1": "jedna", "2": "dvě", "3": "tři", "4": "čtyři",
  "5": "pět", "6": "šest", "7": "sedm", "8": "osm", "9": "devět",
};

/** Gattungswort und sein Geschlecht - „písmeno" (n.), „číslice" (f.), „interpunkční znaménko" (n.), „speciální znak" (m.), „klávesa" (f.). */
type RodCs = "m" | "f" | "n";
function gattungCs(unit: string, lernweg?: Lernweg): { nomen: string; rod: RodCs } {
  if (unit === SHIFT_UNIT) return { nomen: "klávesa", rod: "f" };
  if (lernweg && istTotastenEinheit(unit, lernweg)) return { nomen: "mrtvá klávesa", rod: "f" };
  switch (unitKindImWeg(unit, lernweg)) {
    case "ziffer":
      return { nomen: "číslice", rod: "f" };
    case "satzzeichen":
      return { nomen: "interpunkční znaménko", rod: "n" };
    case "sonderzeichen":
      return { nomen: "speciální znak", rod: "m" };
    default:
      return { nomen: "písmeno", rod: "n" };
  }
}

/** „Nový" / „Nová" / „Nové" - nach dem Geschlecht des Gattungsworts, nie des Kindes. */
function novy(rod: RodCs): string {
  return rod === "f" ? "Nová" : rod === "n" ? "Nové" : "Nový";
}

/** Die Taste rechts neben der Leertaste: unter Windows „AltGr", am Mac „Option" (Glossar §2.9). */
function altGrKappeCs(): string {
  return bottomLabelsFuer(activeLayout())[2] === "Option" ? "Option" : "AltGr";
}

/**
 * „Je na klávese F: levý ukazováček, základní řada." - so wird die Einheit
 * getippt. Befehlsform, Tastennamen nach „klávesa" (Regel 11), Finger und Reihe
 * nach dem Doppelpunkt im Nominativ.
 */
export function unitHowToTypeCs(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT) {
    // ★ Falle 1: wo die Ziffern Shift brauchen (tschechische und französische Tastatur), sagt es der zweite Satz.
    const ziffernMitShift = charAccess("2")?.mod === "shift";
    return (
      "Velké písmeno napíšeš tak, že druhou rukou držíš klávesu Shift." +
      (ziffernMitShift ? " Na číselné řadě dává klávesa Shift číslice." : "")
    );
  }
  const acc = charAccess(unit);
  const vokale = lernweg && acc?.dead && istTotastenEinheit(unit, lernweg) ? totastenVokale(unit, lernweg) : [];
  if (acc && vokale.length > 0) {
    const zuerst =
      acc.mod === "shift"
        ? `podrž klávesu Shift a stiskni mrtvou klávesu ${keyPlaceHintCs(acc.base)}`
        : `stiskni mrtvou klávesu ${keyPlaceHintCs(acc.base)}`;
    // ★ Falle 1: die Grossbuchstaben mit Zeichen kommen über die Totaste, nie über Shift + Buchstabe.
    return (
      `Nejdřív ${zuerst}, potom písmeno: ${vokale.join(", ")}. ` +
      `Velké písmeno se znaménkem: nejdřív ${spokenLabel(unit, "cs")}, potom klávesa Shift a písmeno.`
    );
  }
  if (acc?.mod === "shift" && !acc.dead) return `Podrž klávesu Shift a stiskni klávesu ${kappeCs(acc.base)}.`;
  if (acc?.mod === "altgr" && !acc.dead) {
    const alt = altGrKappeCs();
    return acc.mitUmschalt
      ? `Podrž klávesu ${alt} a klávesu Shift, potom stiskni klávesu ${kappeCs(acc.base)}.`
      : `Podrž klávesu ${alt} a stiskni klávesu ${kappeCs(acc.base)}.`;
  }
  if (acc?.dead) {
    const mit = acc.mod === "shift" ? "podrž klávesu Shift a " : acc.mod === "altgr" ? `podrž klávesu ${altGrKappeCs()} a ` : "";
    return `Nejdřív ${mit}stiskni klávesu ${kappeCs(acc.base)}, potom mezerník.`;
  }
  const f = fingerForChar(unit, lernweg);
  const key = kappeCs(baseKeyForChar(unit, lernweg));
  const reihe = rowName(unit, "cs");
  return f
    ? `Je na klávese ${key}: ${fingerName(f, "cs")}${reihe ? `, ${reihe}` : ""}.`
    : `Je na klávese ${key}.`;
}

/** Die Karte der Feier: „písmeno ř", „číslice 5", „klávesa Shift". */
export function unlockInfoCs(unit: string, lernweg?: Lernweg): UnlockInfo {
  const k = unitKindImWeg(unit, lernweg);
  const g = gattungCs(unit, lernweg);
  const name = unit === SHIFT_UNIT ? "Shift" : k === "ziffer" ? unit : unitLabelCs(unit);
  return {
    glyph: unitGlyph(unit),
    article: "",
    noun: g.nomen,
    name,
    howTo: unitHowToTypeCs(unit, lernweg),
  };
}

/** Die Braillezeilen-Meldung - „Nové písmeno: ř", „Nový speciální znak: procento %", „Nová klávesa: Shift". */
export function unlockBrailleLabelCs(unit: string, lernweg?: Lernweg): string {
  const i = unlockInfoCs(unit, lernweg);
  const g = gattungCs(unit, lernweg);
  if (lernweg && istTotastenEinheit(unit, lernweg)) return `${novy(g.rod)} ${g.nomen}: ${i.name} ${unit}`;
  const k = unitKindImWeg(unit, lernweg);
  const zeichen = k === "satzzeichen" || k === "sonderzeichen" ? ` ${unitGlyph(unit)}` : "";
  return `${novy(g.rod)} ${g.nomen}: ${i.name}${zeichen}`;
}

/**
 * „písmeno r s háčkem", „číslice pět", „klávesa Shift" - der Kopf der
 * GESPROCHENEN Ansage. Die Buchstaben mit Zeichen mit ihrem Namen aus
 * `SPOKEN_CS` - „ř" allein könnte die Stimme verschlucken, e/é/ě klingen
 * ähnlich (Glossar §2.8).
 */
function gesprochenerName(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT) return "Shift";
  if (unitKindImWeg(unit, lernweg) === "ziffer") return ZIFFERN_CS[unit] ?? unit;
  if (istBuchstabe(unit)) {
    const klein = kleinFuer(unit, "cs");
    const gesprochen = spokenLabel(klein, "cs");
    if (gesprochen !== klein) return gesprochen;
  }
  return unitLabelCs(unit);
}

function grossAnfang(s: string): string {
  return s ? `${s[0].toUpperCase()}${s.slice(1)}` : s;
}

/**
 * Die gesprochene Ansage - eine oder mehrere Einheiten auf einmal, wie
 * `unlockSpeechAlle`: „Výborně! Nové písmeno: r s háčkem. Je na klávese r s
 * háčkem: levý ukazováček, číselná řada." Bei mehreren Einheiten die Sache im
 * Passiv mit Doppelpunkt („Výborně! Odemčeno: písmeno r s háčkem a písmeno c s
 * háčkem.") - so braucht keine Aufzählung ein gemeinsames Geschlecht.
 */
export function unlockSpeechAlleCs(units: readonly string[], sober: boolean, lernweg?: Lernweg): string {
  const kopf = (u: string) => `${gattungCs(u, lernweg).nomen} ${gesprochenerName(u, lernweg)}`;
  if (units.length <= 1) {
    const unit = units[0] ?? "";
    const g = gattungCs(unit, lernweg);
    const lead = sober
      ? `Novinka pro tebe: ${kopf(unit)}.`
      : `Výborně! ${novy(g.rod)} ${g.nomen}: ${gesprochenerName(unit, lernweg)}.`;
    return `${lead} ${unitHowToTypeCs(unit, lernweg)}`;
  }
  const koepfe = units.map(kopf);
  const liste = `${koepfe.slice(0, -1).join(", ")} a ${koepfe[koepfe.length - 1]}`;
  const lead = sober ? `Novinka pro tebe: ${liste}.` : `Výborně! Odemčeno: ${liste}.`;
  const griffe = units.map((u) => `${grossAnfang(kopf(u))}. ${unitHowToTypeCs(u, lernweg)}`);
  return [lead, ...griffe].join(" ");
}
