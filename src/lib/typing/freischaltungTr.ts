/**
 * Tastenflow - die FREISCHALT-FEIER in der TÜRKISCHEN Bedienung
 * (★ O-TR, 02.10.2026, Glossar `recherche-tuerkisch-2026-10-02/GLOSSAR-tr.md`
 * §2.2 „kilidini açmak", §2.11 Freischalt-Jubel).
 *
 * Dieselben drei Stücke wie `freischaltungPl.ts` - die Karte, die Meldung für
 * die Braillezeile und die gesprochene Ansage. `letters.ts` bleibt in dieser
 * Etappe unberührt; darum stehen die türkischen Zwillinge hier und benutzen
 * nur, was `letters.ts` und `fingers.ts` schon ausführen.
 *
 * Regeln: das Kind liest „sen"; höchstens ein Ausrufezeichen je Meldung.
 * ★★★ Die Endung hängt NIE am Buchstaben, an der Ziffer oder am Tastennamen
 * (Glossar §1 Regel 6), sondern am Gattungswort dahinter: „Harika! R
 * harfinin kilidi açıldı." (nie „R'nin"), „5 rakamının", „nokta işaretinin",
 * „F tuşu: sol işaret parmağı, temel sıra.". Türkisch stellt das Gattungswort
 * HINTER den Namen („R harfi") - die Karte zeigt darum `name` vor `noun`
 * (`UnlockCelebration.tsx`, nur für tr). Kein Artikel: `article` bleibt leer.
 */
import {
  baseKeyForChar,
  charAccess,
  fingerForChar,
  fingerName,
  rowName,
  spokenLabel,
} from "./fingers";
import { activeLayout, bottomLabelsFuer, layoutSprache } from "./layouts";
import {
  SHIFT_UNIT,
  istTotastenEinheit,
  totastenVokale,
  unitGlyph,
  unitKindImWeg,
  type UnlockInfo,
} from "./letters";
import type { Lernweg } from "./lernweg";
import { grossFuer, istBuchstabe, kleinFuer } from "./sprachRegister";
import { grossAnfangTr, sprechformTr, unitLabelTr } from "./tastenErklaerungTr";

/**
 * Das Gattungswort HINTER dem Namen - mit Besitzendung („R harfi") und im
 * Genitiv („R harfinin kilidi"). `yeni` ist der Kopf der Braillezeilen-Meldung
 * („Yeni harf: R").
 */
interface GattungTr {
  nom: string;
  gen: string;
  yeni: string;
}

const HARF: GattungTr = { nom: "harfi", gen: "harfinin", yeni: "Yeni harf" };

function gattungTr(unit: string, lernweg?: Lernweg): GattungTr {
  if (lernweg && istTotastenEinheit(unit, lernweg)) return { nom: "tuşu", gen: "tuşunun", yeni: "Yeni tuş" };
  switch (unitKindImWeg(unit, lernweg)) {
    case "shift":
      return { nom: "büyük harfler", gen: "büyük harflerin", yeni: "Yeni" };
    case "ziffer":
      return { nom: "rakamı", gen: "rakamının", yeni: "Yeni rakam" };
    case "satzzeichen":
      return { nom: "işareti", gen: "işaretinin", yeni: "Yeni noktalama işareti" };
    case "sonderzeichen":
      return { nom: "simgesi", gen: "simgesinin", yeni: "Yeni simge" };
    default:
      return HARF;
  }
}

/**
 * „R harfi", „5 rakamı", „nokta işareti", „soru işareti" - Name und
 * Gattungswort. Ein Name, der schon auf „işareti" endet, bekommt kein zweites.
 */
function mitGattung(name: string, g: GattungTr, fall: "nom" | "gen"): string {
  if (!name) return g[fall];
  // Der Genitiv ersetzt das Gattungswort selbst („soru işareti" ⇒ „soru işaretinin") - keine Endung am Namen.
  if (name.endsWith(" işareti")) return fall === "nom" ? name : name.slice(0, -"işareti".length) + "işaretinin";
  return `${name} ${g[fall]}`;
}

/**
 * Eine Taste im Satz - die Endung an „tuş" („F tuşuna"), der Name wie auf der
 * Kappe DER Tastatur (`layoutSprache`: auf `tr-q` „İ" für die i-Taste, „I"
 * für die ı-Taste), Zeichen beim Namen („virgül tuşu").
 */
function tusTr(key: string): { nom: string; dat: string } {
  if (!key) return { nom: "", dat: "" };
  if (key === " ") return { nom: "boşluk çubuğu", dat: "boşluk çubuğuna" };
  const k = /^[\p{L}\p{N}]$/u.test(key)
    ? key === "ß"
      ? "ß"
      : grossFuer(key, layoutSprache())
    : spokenLabel(key, "tr");
  return { nom: `${k} tuşu`, dat: `${k} tuşuna` };
}

/**
 * Die Taste rechts neben der Leertaste: unter Windows „Alt Gr" (Kappe der
 * türkischen Tastaturen), am Mac „Option" (Glossar §2.9).
 */
function altGrKappeTr(): string {
  return bottomLabelsFuer(activeLayout())[2] === "Option" ? "Option" : "Alt Gr";
}

/**
 * „F tuşu: sol işaret parmağı, temel sıra." - so wird die Einheit getippt.
 * Befehlsform („basılı tut", „bas"), Finger und Reihe nach dem Doppelpunkt
 * ohne Endung (Glossar §2.1, Regel 6).
 */
export function unitHowToTypeTr(unit: string, lernweg?: Lernweg): string {
  // Ein eigener Satz - darum gross am Anfang („Virgül tuşu: …", türkisch gerechnet).
  return grossAnfangTr(wieTippen(unit, lernweg));
}

function wieTippen(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT) return "Büyük harf için diğer elinle Shift tuşunu basılı tut.";
  const acc = charAccess(unit);
  const vokale = lernweg && acc?.dead && istTotastenEinheit(unit, lernweg) ? totastenVokale(unit, lernweg) : [];
  if (acc && vokale.length > 0) {
    const taste = tusTr(acc.base);
    const zuerst = acc.mod === "shift" ? `Shift tuşunu basılı tutup ${taste.dat} bas` : `${taste.dat} bas`;
    return `Önce ${zuerst}, sonra ünlü harfe: ${vokale.join(", ")}.`;
  }
  if (acc?.mod === "shift") return `Shift tuşunu basılı tut ve ${tusTr(acc.base).dat} bas.`;
  if (acc?.mod === "altgr") {
    const alt = altGrKappeTr();
    return acc.mitUmschalt
      ? `${alt} ve Shift tuşlarını basılı tut, sonra ${tusTr(acc.base).dat} bas.`
      : `${alt} tuşunu basılı tut ve ${tusTr(acc.base).dat} bas.`;
  }
  if (acc?.dead) return `Önce ${tusTr(acc.base).dat} bas, sonra boşluk çubuğuna.`;
  const f = fingerForChar(unit, lernweg);
  const taste = tusTr(baseKeyForChar(unit, lernweg));
  const reihe = rowName(unit, "tr");
  return f ? `${taste.nom}: ${fingerName(f, "tr")}${reihe ? `, ${reihe}` : ""}.` : `${taste.nom}.`;
}

/** Die Karte der Feier: Name „R" + Gattungswort „harfi" (Türkisch: das Gattungswort hinten). */
export function unlockInfoTr(unit: string, lernweg?: Lernweg): UnlockInfo {
  const k = unitKindImWeg(unit, lernweg);
  const g = gattungTr(unit, lernweg);
  const name = k === "shift" ? "" : k === "ziffer" ? unit : unitLabelTr(unit);
  return {
    glyph: unitGlyph(unit),
    article: "",
    noun: name.endsWith(" işareti") ? "" : g.nom,
    name,
    howTo: unitHowToTypeTr(unit, lernweg),
  };
}

/** Die Braillezeilen-Meldung - „Yeni harf: R", „Yeni simge: yüzde %", „Yeni: büyük harfler". */
export function unlockBrailleLabelTr(unit: string, lernweg?: Lernweg): string {
  const i = unlockInfoTr(unit, lernweg);
  const g = gattungTr(unit, lernweg);
  if (!i.name) return `${g.yeni}: ${g.nom}`;
  if (lernweg && istTotastenEinheit(unit, lernweg)) return `${g.yeni}: ${i.name} ${unit}`;
  const k = unitKindImWeg(unit, lernweg);
  const zeichen = k === "satzzeichen" || k === "sonderzeichen" ? ` ${unitGlyph(unit)}` : "";
  return `${g.yeni}: ${i.name}${zeichen}`;
}

/**
 * Der GESPROCHENE Name einer Einheit - Buchstaben mit ihrem Namen aus
 * `SPOKEN_TR`, wo es einen gibt („noktasız ı", „yumuşak ge"), sonst wie auf
 * der Karte („R").
 */
function gesprochenerName(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT) return "";
  if (unitKindImWeg(unit, lernweg) === "ziffer") return unit;
  if (istBuchstabe(unit)) {
    const klein = kleinFuer(unit, "tr");
    const gesprochen = spokenLabel(klein, "tr");
    if (gesprochen !== klein) return gesprochen;
  }
  return unitLabelTr(unit);
}

/**
 * Die gesprochene Ansage - eine oder mehrere Einheiten auf einmal, wie
 * `unlockSpeechAlle`: „Harika! R harfinin kilidi açıldı. R tuşu: sol işaret
 * parmağı, üst sıra." (Glossar §2.11). Bei mehreren Einheiten ein
 * Doppelpunkt („Harika! Kilidi açılanlar: R harfi ve T harfi.") - so braucht
 * keine Aufzählung eine Endung. Die englischen Kappen sagt die Stimme
 * türkisch („şift", `sprechformTr`); auf der Karte steht „Shift".
 */
export function unlockSpeechAlleTr(units: readonly string[], sober: boolean, lernweg?: Lernweg): string {
  const kopf = (u: string, fall: "nom" | "gen") => mitGattung(gesprochenerName(u, lernweg), gattungTr(u, lernweg), fall);
  if (units.length <= 1) {
    const unit = units[0] ?? "";
    const lead = sober
      ? `Senin için yeni: ${kopf(unit, "nom")}.`
      : `Harika! ${grossAnfangTr(kopf(unit, "gen"))} kilidi açıldı.`;
    return sprechformTr(`${lead} ${unitHowToTypeTr(unit, lernweg)}`);
  }
  const koepfe = units.map((u) => kopf(u, "nom"));
  const liste = `${koepfe.slice(0, -1).join(", ")} ve ${koepfe[koepfe.length - 1]}`;
  const lead = sober ? `Senin için yeni: ${liste}.` : `Harika! Kilidi açılanlar: ${liste}.`;
  const griffe = units.map((u) => `${grossAnfangTr(kopf(u, "nom"))}. ${unitHowToTypeTr(u, lernweg)}`);
  return sprechformTr([lead, ...griffe].join(" "));
}
