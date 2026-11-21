/**
 * ★★ DER KLASSENCODE IST PFLICHT - und passt zum Namen (10.09.2026, Johannes).
 *
 * Bis zu diesem Tag hiess das Feld beim Anlegen „Beitritts-Code (optional)",
 * und wer es leer liess, bekam sechs Zufallszeichen wie „K7QX2M". Die Kinder
 * melden sich aber mit genau diesem Code an - ein Code, den sich niemand
 * merken kann, ist an der Tafel und am Telefon mit den Eltern eine Hürde.
 * Jetzt schlägt die Oberfläche beim Tippen des Namens einen Code VOR, der zum
 * Namen passt; die Lehrkraft kann ihn ändern, aber nicht weglassen.
 *
 * Johannes' Beispiel: „MS-Wein" → „MSWEIN". Darum nur Buchstaben und
 * Ziffern im Vorschlag, auch wenn der Code selbst Punkt und Bindestrich
 * erlaubt - ein Vorschlag soll sich diktieren lassen.
 */

import type { Lang } from "../typing/account";
import { fremdschriftUmschreiben, klassencodeUmschreiben } from "../typing/sprachRegister";

/** Dieselbe Zeichenregel wie `CLASS_CODE_RE` in `pbBackend.ts` und `account.ts`. */
export const KLASSENCODE_RE = /^[A-Z0-9.-]{2,12}$/;

/** So lang darf ein Klassencode höchstens sein. */
export const KLASSENCODE_MAX = 12;

/**
 * Ein Klassencode aus dem Klassennamen: gross, Umlaute ausgeschrieben, nur
 * Buchstaben und Ziffern, höchstens 12 Zeichen. Unter zwei Zeichen gibt es
 * keinen Vorschlag (leere Zeichenkette) - ein Code aus einem Zeichen wäre
 * ungültig.
 *
 * ★ D1 (28.09.2026, Entscheidung Johannes Nr. 16): Buchstaben anderer
 * Sprachen fielen bis hierher GANZ weg - „Año 5" wurde „AO5", „École"
 * „COLE". Jetzt:
 *  · „Ñ" → „NI" (nicht „N": aus „AÑO" würde „ANO", ein anstössiges Wort) -
 *    „Año 5" → „ANIO5".
 *  · Akzente und Cedille weg, der Grundbuchstabe bleibt („Á" → „A",
 *    „É" → „E", „Ç" → „C") - über die Unicode-Zerlegung (NFD), damit keine
 *    Liste einen Buchstaben vergisst.
 *  · Die deutschen Umlaute bleiben ausgeschrieben wie bisher (Ä → AE, vor
 *    der Zerlegung - sonst würde „Ä" zu „A").
 * Ein Name ohne solche Buchstaben ergibt denselben Code wie vorher.
 *
 * ★ G2a (02.10.2026): MIT `lang` gilt zuerst die Umschrift dieser Sprache aus
 * dem Sprachregister (`klassencodeUmschrift`: Polnisch ł → L, Türkisch ş → S,
 * Tschechisch ř → R, Italienisch ò → O …). OHNE `lang` ändert sich nichts -
 * kein heutiger Aufrufer übergibt eine Sprache.
 *
 * ★ G2-NEUN (25.10.2026): danach (mit und ohne `lang`) die Umschrift für
 * kyrillische und griechische Buchstaben (`fremdschriftUmschreiben`,
 * Sprachregister): „5б Клас" ⇒ „5BKLAS" statt nichts. Lateinische Namen
 * ergeben denselben Code wie vorher - die Umschrift fasst nur Buchstaben an,
 * die bisher ganz wegfielen.
 */
export function klassencodeVorschlag(name: string, lang?: Lang): string {
  const code = fremdschriftUmschreiben(lang ? klassencodeUmschreiben(name, lang) : name)
    .toUpperCase()
    .replace(/Ä/g, "AE")
    .replace(/Ö/g, "OE")
    .replace(/Ü/g, "UE")
    .replace(/ẞ/g, "SS")
    .replace(/Ñ/g, "NI")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, KLASSENCODE_MAX);
  return code.length >= 2 ? code : "";
}

/**
 * Was an einem eingegebenen Code nicht passt - oder `null`, wenn er gilt.
 * Der Satz ist so geschrieben, dass er in der Statuszeile allein verständlich
 * ist.
 */
export function klassencodeFehler(eingabe: string): string | null {
  const code = eingabe.trim().toUpperCase();
  if (!code)
    return "Bitte geben Sie einen Klassencode ein - mit ihm melden sich die Kinder an.";
  if (!KLASSENCODE_RE.test(code))
    return "Der Klassencode darf 2 bis 12 Zeichen haben: Buchstaben, Ziffern, Punkt oder Bindestrich.";
  return null;
}

/**
 * ★ Nachbesserung 20.09.2026 (Auftrag Testerin Punkt 1 - Johannes' Testklasse
 * „Test“, wörtlich: „Das Programm kann ja eine Nummer vergeben und damit
 * arbeiten“). Der VORGESCHLAGENE Klassencode ("TEST") kann bei einer ANDEREN
 * Lehrkraft schon vergeben sein, weil er global eindeutig sein muss (er ist
 * der Anmelde-Schlüssel der Kinder) - der Klassenname selbst ist das nicht.
 * Statt die Lehrkraft mit einer Absage aufzuhalten, weicht NUR der Vorschlag
 * von selbst aus: „TEST“ → „TEST2“ → „TEST3“ … Das gilt ausdrücklich NUR für
 * den Vorschlag - hat die Lehrkraft den Code selbst getippt, bleibt er stehen
 * (siehe `codeSelbst` in `KlasseUndKinder.tsx`).
 *
 * `versuch` beginnt bei 2 (Versuch 1 ist der unveränderte Vorschlag selbst,
 * den ruft niemand hierüber ab). Bleibt innerhalb `KLASSENCODE_MAX`: reicht
 * der Platz nicht, wird die BASIS VORNE gekürzt (das Ende trägt die Zahl, die
 * muss lesbar bleiben - sonst weiss niemand mehr, der wievielte Versuch das
 * ist).
 */
export function naechsterKlassencodeVersuch(basis: string, versuch: number): string {
  const zahl = String(versuch);
  const platzFuerBasis = Math.max(0, KLASSENCODE_MAX - zahl.length);
  const gekuerzteBasis = platzFuerBasis > 0 ? basis.slice(-platzFuerBasis) : "";
  return gekuerzteBasis + zahl;
}
