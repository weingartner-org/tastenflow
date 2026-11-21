import { activeLayout, zugangFuer, type KeyboardLayout } from "./layouts";
import { tasteFuerCode } from "./anschlagDeuten";

/**
 * ★★★★★ AltGr IST EIN ZEICHEN, KEIN KÜRZEL (23.09.2026).
 *
 * Gemessen beim Bau von „Freies Schreiben": Die Zeichensätze „alles" und
 * „Programmcode" der Tippchallenge enthalten `@ € { } [ ] | ~`. Auf einer
 * deutschen oder österreichischen Windows-Tastatur tippt man sie mit AltGr -
 * und der Browser meldet AltGr als **Strg + Alt** (`ctrlKey` UND `altKey`).
 * Jede Schreibzeile warf bis heute alles mit Strg oder Alt als „Kürzel der
 * Seite" hinaus. Nachgestellt: Die Zeile „a@b" wurde mit `@` über Strg + Alt
 * nie fertig, ohne Modifikator sofort. Unter Windows waren diese Zeichen in
 * Tastenflow also nicht tippbar - und in einer Handelsschule stehen `€` und
 * `@` in fast jedem eigenen Text.
 *
 * Dieselbe Erkenntnis steht schon in `lib/stummTaste.ts` (dort: Strg neben
 * Alt ist AltGr, kein Stummschalten).
 *
 * ★ GEMESSEN am 02.10.2026 (Windows 11 25H2, Edge 154 und Chrome 154, `SendInput` mit Scancodes,
 * BEFUND-2026-10-02-WINDOWS-MESSUNG §3.1): der Buchstaben-`keydown` mit AltGr trägt `ctrlKey` = false UND
 * `altKey` = false, nur `getModifierState("AltGraph")` = true und `key` = das fertige Zeichen. Nur der
 * `keydown` der Control-Taste davor hat `ctrlKey` = true. Das gilt auch für linke Strg + linke Alt.
 * Der Zweig „Strg + Alt" unten ist also für diese Browser nie nötig - er bleibt für ältere Browser und
 * Firefox (dort ungemessen). Wer Testereignisse für AltGr baut, nimmt die gemessene Form.
 * ⚠️ Polnisch (programisty), `ń` = AltGr + N: Strg + Alt + N ist das Tastenkürzel der NVDA-Verknüpfung
 * (`NVDA.lnk`, Öffentlicher Desktop): Windows verschluckt den Anschlag (kein `keydown`), NVDA startet
 * neu. Mit Umschalt (`Ń`) geht es. Ein Hinweis dazu gehört in die Hilfe der polnischen Tastatur.
 *
 * Erkannt wird AltGr so:
 *  1. `getModifierState("AltGraph")` - Chrome, Edge und Firefox unter Windows
 *     melden es verlässlich;
 *  2. sonst Strg + Alt mit einem Zeichen, das KEIN Buchstabe und KEINE Ziffer
 *     ist. Ein Strg + Alt + Buchstabe ist ein Kürzel (die Seite hat keine,
 *     aber andere Programme), AltGr erzeugt Sonderzeichen (`@ € { ² …`).
 *
 * ⚠️ NICHT gelöst (für Sonderzeichen): die Wahltaste (Option) am Mac. Dort ist `@`
 * Option + L und kommt als `altKey` OHNE Strg - genau wie die Alt-Kürzel der Seite
 * (Alt + L). Beides auseinanderzuhalten ist eine eigene Entscheidung (Johannes).
 *
 * ★★★★★ F3-pl (02.10.2026): GELÖST FÜR DIE POLNISCHEN BUCHSTABEN. Auf dem Mac „Polish -
 * Pro" liegen `ą ć ę ł ń ó ś ź ż` (und die Grossen) auf Option + Grundbuchstabe - dort ist
 * die Wahltaste der NORMALWEG von 18 Buchstaben, kein Randfall. Gelöst wird es an dem, was
 * der Anschlag nachweislich erzeugt hat: `event.key` ist ein Buchstabe, den die EINGESTELLTE
 * Tastatur als AltGr-Buchstaben führt (`KeyAccess.buchstabe`), und die gedrückte Taste
 * (`event.code`) ist genau die Taste seines Grundbuchstabens (Option + A ⇒ `key` „ą", `code`
 * `KeyA`). Dann ist es ein ZEICHEN ({@link istAltGrBuchstabe}), kein Kürzel - auch wenn der
 * Browser nur `altKey` meldet. Das Alt-Kürzel Alt + C (Weiter) bleibt davon unberührt, weil
 * dessen `key` das gewöhnliche „c" ist (ohne polnische Tastatur) bzw. - bei einem anderen
 * `code` (Option + K gibt `Ż`) - nicht auf der Taste des Buchstabens liegt.
 * ⚠️ Die Regel hängt an der EINGESTELLTEN Tastatur: auf de, en, fr, es, it ändert sich kein
 * Anschlag (dort trägt kein `access`-Eintrag `buchstabe`).
 */

/** Das Nötige eines Tastendrucks - passt auf React- und DOM-Ereignisse. */
export interface TastenEreignis {
  key: string;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  /**
   * Die physische Taste (`KeyboardEvent.code`). Nur für {@link istAltGrBuchstabe} gelesen - ohne
   * sie (ältere Testdaten) genügt dort das Zeichen allein.
   */
  code?: string;
  getModifierState?: (taste: "AltGraph") => boolean;
}

/**
 * Wurde dieses Zeichen mit AltGr getippt (Windows: Strg + Alt)?
 *
 * ★ W1 (27.09.2026, BEFUND-2026-09-27-WINDOWS-MESSUNG §3.2): auch eine
 * TOTASTE über AltGr zählt - Frankreich AltGr + 7 (Gravis, für À È Ù),
 * Belgien AltGr + ù (Akut, für É), Schweiz-Französisch AltGr + ' (Akut).
 * Ohne das galt ihr `Dead` unter Windows als Kürzel der Seite, wenn der
 * Browser AltGr als Strg + Alt meldet, und kam nie bei der Übungszeile an.
 */
export function istAltGr(e: TastenEreignis): boolean {
  if ((e.key.length !== 1 && e.key !== "Dead") || e.metaKey) return false;
  // ★ F3-pl: Option + Buchstabe am Mac (nur `altKey`) - siehe {@link istAltGrBuchstabe}.
  if (istAltGrBuchstabe(e)) return true;
  if (typeof e.getModifierState === "function" && e.getModifierState("AltGraph")) return true;
  return e.ctrlKey && e.altKey && !/^[a-z0-9]$/i.test(e.key);
}

/**
 * Tippt dieser Tastendruck ein Zeichen? Ein einzelnes Zeichen ohne Strg, Alt
 * und Befehlstaste - oder mit AltGr. Alles andere mit Alt/Strg/Befehl ist ein
 * Kürzel und gehört der Seite.
 */
export function istZeichenAnschlag(e: TastenEreignis): boolean {
  if (e.key.length !== 1) return false;
  if (!e.altKey && !e.ctrlKey && !e.metaKey) return true;
  return istAltGr(e);
}

/** Gehört dieser Tastendruck als Kürzel der Seite (nicht der Schreibzeile)? */
export function istKuerzel(e: TastenEreignis): boolean {
  return (e.altKey || e.ctrlKey || e.metaKey) && !istAltGr(e);
}

/**
 * ★★★★★ F3-pl (02.10.2026): hat DIESER Anschlag einen AltGr-BUCHSTABEN der eingestellten Tastatur
 * erzeugt, den der Browser nur als `altKey` (ohne Strg, ohne `AltGraph`) meldet - Option + Buchstabe am
 * Mac „Polish - Pro"? Dann ist er ein Zeichen und kein Alt-Kürzel (Kopf der Datei).
 *
 * Wahr nur, wenn ALLES stimmt:
 *  · `altKey` ohne Strg und Befehl (mit Strg ist es Windows-AltGr, das {@link istAltGr} ohnehin kennt;
 *    mit Befehl ist es ein Kürzel);
 *  · `key` ist EIN Zeichen, das die Tastatur mit `buchstabe: true` und `mod: "altgr"` führt (`ą`, `Ą` …);
 *  · die gedrückte Taste (`code`) ist die Taste seines Grundbuchstabens (`ą` ⇒ `KeyA`, `ź` ⇒ `KeyX`). Die
 *    Funde der Mac-Messung, bei denen Option + eine ANDERE Taste einen polnischen Buchstaben ergibt
 *    (Option + K ⇒ `Ż`, Option + F ⇒ `ń`, Option + Umschalt + H ⇒ `Ó`, Option + 1 ⇒ `Ń`), gelten deshalb
 *    weiter als Kürzel: die Seite behält ihre Alt-Tasten, und ein Kind lernt keinen Nebenweg. Fehlt `code`
 *    (reine Testdaten), genügt das Zeichen.
 * Auf jeder Tastatur ohne AltGr-Buchstaben (de, en, fr, es, it, ch …) ist das Ergebnis immer `false`.
 * ★ F3-tr: auf `tr-f` am Mac wahr für `â î û Â Î Û` (Option + a / i / u, ohne und mit Umschalt); unter Windows
 * (Totaste `^`) und auf `tr-q` nie.
 */
export function istAltGrBuchstabe(e: TastenEreignis, layout: KeyboardLayout = activeLayout()): boolean {
  if (!e.altKey || e.ctrlKey || e.metaKey) return false;
  if ([...e.key].length !== 1) return false;
  // ★ F3-tr: über `zugangFuer` - am Mac trägt `accessMac` die Option-Buchstaben, die Windows nicht hat (Mac
  // „Turkish - Standard": `â î û` = Option + a / i / u). Für `pl` (`accessMac` nur für `€`) und alle Tastaturen
  // ohne `accessMac` ist es dasselbe wie `layout.access[e.key]`.
  const zugang = zugangFuer(layout, e.key);
  if (zugang?.buchstabe !== true || zugang.mod !== "altgr") return false;
  if (e.code === undefined) return true;
  return tasteFuerCode(layout, e.code) === zugang.base;
}
