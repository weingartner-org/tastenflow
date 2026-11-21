/**
 * ★ D-LERNDATEN (25.10.2026): DIE QUELLWÖRTER DES BUCHSTABENSALATS des Weges „bg" (Bulgarisch) - gefüllt aus den vorbereiteten Lerndaten.
 *
 * Quelle: iCloud `sprachen-2026-10-25/tf-fest-neu/bg/tf-fest-bg.json`, Schlüssel `schreibWoerter` (Zuordnung: Rezept
 * Teil D). Geprüft vom unabhängigen Prüfer der PC-Sitzung: `PRUEFBERICHT.md` im selben Ordner (25.10.2026) - Urteil:
 * „Freigabefähig: ja - 0 Verstöße bei Reihenfolge, Zeichen und Tippbarkeit, Sperrliste sauber, Mengen gehalten.“
 * Übernommen vom Erzeuger-Skript der Etappe D-LERNDATEN im Format von `buchstabensalatCs.ts`, Eintrag für Eintrag in der Reihenfolge der
 * Quelle. Geändert wurde nur Typografie, die keine Tastatur hat (gezählt im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * ⚠️ Eine Lese-Abnahme durch eine Person mit Bulgarisch als Erstsprache steht aus (Prüfbericht; Falle 59).
 *
 * ⚠️ Der Ertrag je Quellwort (mindestens `SALAT_ZIEL` echte Wörter) ist NICHT gemessen: er wird gegen das Lexikon der Sprache
 * gezählt (`lexikonWoerter("bg")`), und ein Fach für „bg" baut erst F8 (`lexicon.ts`). Bis dahin findet der Salat auf diesem
 * Weg keine Funde und bietet sich nicht an - die Daten liegen bereit.
 *
 * Verteiler: `buchstabensalat.ts` (Namen ausschliessen: `salatNamen${Xx}.ts`, noch leer) - liest diese Datei seit G3c; leer hiess Englisch, gefüllt gilt diese Liste (`geruestRueckfall.ts`).
 * Unsichtbar, bis der Schalter `?bulgarisch-lehrgang=1` an ist (Vorgabe AUS). Wächter: `tests/tastenflow-lerndaten-bg.test.ts`
 * (Regeln je Sprache in `tests/helfer/lerndatenNeueWege.ts`).
 *
 * ⚠️ DATENBLATT (`scripts/buendel-aufteilung.ts`): nur `import type`, kein Code.
 */
import type { Salatwort } from "./buchstabensalat";

const ALLE: Salatwort["stufen"] = ["kids", "teens", "erwachsen"];
const AB_TEENS: Salatwort["stufen"] = ["teens", "erwachsen"];

export const SALATWOERTER_BG: Salatwort[] = [
  { wort: "град", stufen: ALLE },
  { wort: "зъб", stufen: ALLE },
  { wort: "хляб", stufen: ALLE },
  { wort: "нож", stufen: ALLE },
  { wort: "рог", stufen: ALLE },
  { wort: "сняг", stufen: ALLE },
  { wort: "дъжд", stufen: ALLE },
  { wort: "лъв", stufen: ALLE },
  { wort: "гълъб", stufen: ALLE },
  { wort: "мед", stufen: ALLE },
  { wort: "плод", stufen: ALLE },
  { wort: "грозде", stufen: ALLE },
  { wort: "сърце", stufen: ALLE },
  { wort: "вълк", stufen: ALLE },
  { wort: "мъгла", stufen: ALLE },
  { wort: "ябълка", stufen: ALLE },
  { wort: "жълъд", stufen: ALLE },
  { wort: "ъгъл", stufen: ALLE },
  { wort: "бял", stufen: ALLE },
  { wort: "бели", stufen: ALLE },
  { wort: "хлебар", stufen: ALLE },
  { wort: "мляко", stufen: ALLE },
  { wort: "млечен", stufen: ALLE },
  { wort: "голям", stufen: ALLE },
  { wort: "големи", stufen: ALLE },
  { wort: "сладолед", stufen: ALLE },
  { wort: "зелен", stufen: ALLE },
  { wort: "зелени", stufen: ALLE },
  { wort: "пролет", stufen: ALLE },
  { wort: "пролетта", stufen: ALLE },
  { wort: "есен", stufen: ALLE },
  { wort: "есента", stufen: ALLE },
  { wort: "оттам", stufen: ALLE },
  { wort: "оттук", stufen: ALLE },
  { wort: "радостта", stufen: ALLE },
  { wort: "молив", stufen: ALLE },
  { wort: "тетрадка", stufen: ALLE },
  { wort: "училище", stufen: ALLE },
  { wort: "къща", stufen: ALLE },
  { wort: "вкъщи", stufen: ALLE },
  { wort: "шофьор", stufen: ALLE },
  { wort: "боксьор", stufen: ALLE },
  { wort: "юни", stufen: ALLE },
  { wort: "юли", stufen: ALLE },
  { wort: "история", stufen: ALLE },
  { wort: "историята", stufen: ALLE },
  { wort: "ваканция", stufen: ALLE },
  { wort: "пеперуда", stufen: ALLE },
  { wort: "ученик", stufen: ALLE },
  { wort: "ученикът", stufen: ALLE },
  { wort: "учителят", stufen: ALLE },
  { wort: "рибар", stufen: ALLE },
  { wort: "морето", stufen: ALLE },
  { wort: "вятър", stufen: ALLE },
  { wort: "вятърът", stufen: ALLE },
  { wort: "баница", stufen: ALLE },
  { wort: "кашкавал", stufen: ALLE },
  { wort: "мартеница", stufen: ALLE },
  { wort: "катерица", stufen: ALLE },
  { wort: "щъркел", stufen: ALLE },
  { wort: "таралеж", stufen: ALLE },
  { wort: "здравей", stufen: AB_TEENS },
  { wort: "здравейте", stufen: AB_TEENS },
  { wort: "вестник", stufen: AB_TEENS },
  { wort: "честно", stufen: AB_TEENS },
  { wort: "радостно", stufen: AB_TEENS },
  { wort: "извинете", stufen: AB_TEENS },
  { wort: "безопасност", stufen: AB_TEENS },
  { wort: "разходка", stufen: AB_TEENS },
  { wort: "вървя", stufen: AB_TEENS },
  { wort: "четат", stufen: AB_TEENS },
  { wort: "пишат", stufen: AB_TEENS },
  { wort: "искат", stufen: AB_TEENS },
  { wort: "четях", stufen: AB_TEENS },
  { wort: "идвахме", stufen: AB_TEENS },
  { wort: "поддържам", stufen: AB_TEENS },
  { wort: "поддръжка", stufen: AB_TEENS },
  { wort: "единствен", stufen: AB_TEENS },
  { wort: "временно", stufen: AB_TEENS },
  { wort: "странно", stufen: AB_TEENS },
  { wort: "младостта", stufen: AB_TEENS },
  { wort: "компютър", stufen: AB_TEENS },
  { wort: "компютърът", stufen: AB_TEENS },
  { wort: "клавиатура", stufen: AB_TEENS },
  { wort: "приключение", stufen: AB_TEENS },
  { wort: "партньор", stufen: AB_TEENS },
  { wort: "режисьор", stufen: AB_TEENS },
  { wort: "фризьор", stufen: AB_TEENS },
  { wort: "асансьор", stufen: AB_TEENS },
  { wort: "шампиньон", stufen: AB_TEENS },
  { wort: "павильон", stufen: AB_TEENS },
  { wort: "информация", stufen: AB_TEENS },
  { wort: "ситуация", stufen: AB_TEENS },
  { wort: "хиляда", stufen: AB_TEENS },
  { wort: "хиляди", stufen: AB_TEENS },
  { wort: "между", stufen: AB_TEENS },
  { wort: "надежда", stufen: AB_TEENS },
  { wort: "чужденец", stufen: AB_TEENS },
  { wort: "гражданин", stufen: AB_TEENS },
  { wort: "съобщение", stufen: AB_TEENS },
  { wort: "задължително", stufen: AB_TEENS },
  { wort: "възможност", stufen: AB_TEENS },
  { wort: "действие", stufen: AB_TEENS },
  { wort: "предложение", stufen: AB_TEENS },
  { wort: "разстояние", stufen: AB_TEENS },
];
