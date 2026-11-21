/**
 * Erkennung „vielleicht ohne Tastatur" (20.09.2026).
 *
 * Auftrag Johannes, wörtlich: *„kannst du erkennen ob ein mobiles gerät
 * tastenflow öffnet und eine meldung ausgeben, bitte eine tastatur
 * anschließen, sonst versuchen menschen am touchbildschirm des iPads zu
 * schreiben?"* Der Hintergrund steht schon in der Barrierefreiheitserklärung
 * (`src/features/legal/Barrierefreiheit.tsx`): „an Tablet und Smartphone wird
 * eine Tastatur angeschlossen" - nur sagte die Oberfläche selbst das bisher
 * nirgends.
 *
 * ★★★ EHRLICH BLEIBEN: Es gibt KEINE Abfrage „ist eine Tastatur
 * angeschlossen" - kein Browser bietet sie an
 * ([[reference_screenreader_nicht_abfragbar]] gilt hier sinngemäss für jedes
 * angeschlossene Gerät, nicht nur für Screenreader). Messbar ist nur, WIE das
 * Gerät sich meldet:
 *
 *  • `matchMedia("(pointer: coarse)")` - das HAUPT-Zeigegerät ist grob (Finger),
 *    nicht fein (Maus/Trackpad).
 *  • `navigator.maxTouchPoints` - das Gerät kennt Berührungspunkte.
 *  • die Bildschirmbreite - ein Zusatz-Indiz, kein Filter: Ein iPad Pro quer
 *    ist mit 1366 px so breit wie manches Notebook, darum schliesst eine
 *    grosse Breite hier nichts aus.
 *
 * ⚠️ **Ein iPad MIT angeschlossener Tastatur sieht dabei GENAUSO aus wie eines
 * OHNE** - `pointer: coarse` und `maxTouchPoints` ändern sich durch eine
 * angesteckte Tastatur nicht. Genau deshalb bittet der Hinweis nur, er
 * behauptet nie „es fehlt eine Tastatur", und er sperrt nichts.
 *
 * ★ DER BESTE BELEG KOMMT VOM TIPPEN SELBST: Ein `keydown` einer echten
 * Tastatur trägt ein `event.code` und ein `event.key`, das nicht
 * „Unidentified" heisst - die Bildschirmtastatur von iOS/Android liefert das
 * meist NICHT (dasselbe Wissen steht schon in `tastenErklaerung.ts`, Fall „4.
 * Keine Auskunft vom Browser"). `istEchteTastatureingabe` prüft genau das -
 * sobald sie einmal zutrifft, ist die Frage für DIESES Gerät beantwortet.
 */

/**
 * Sieht das Gerät nach Tablet/Handy aus? Ein Indiz, keine Gewissheit (siehe
 * Dateikopf) - darum nie mehr als eine BITTE daraus machen.
 *
 * Beide Signale müssen zutreffen: ein grobes Zeigegerät ALLEIN träfe auch auf
 * manchen Windows-Rechner mit Touch-Monitor UND Maus zu; Berührungspunkte
 * ALLEIN träfe auch auf ein Notebook mit Touchscreen UND Tastatur zu. Erst
 * beides zusammen - kein feiner Zeiger UND Berührungspunkte - grenzt auf
 * Tablet/Handy ein, wie es Johannes' Sorge („touchbildschirm des iPads")
 * beschreibt.
 */
export function moeglicherweiseOhneTastatur(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  let grob = false;
  try {
    grob = window.matchMedia("(pointer: coarse)").matches;
  } catch {
    return false; // privates Fenster/altes Testgerät: im Zweifel keine Bitte
  }
  const beruehrung = (navigator.maxTouchPoints ?? 0) > 0;
  return grob && beruehrung;
}

/**
 * Trägt dieser Anschlag die Auskunft einer ECHTEN Tastatur? `code` fehlt der
 * Bildschirmtastatur meist ganz, `key` heisst dort „Unidentified" - beides
 * zusammen ist derselbe Massstab wie in `tastenErklaerung.ts` (dort umgekehrt:
 * „keine Auskunft vom Browser").
 */
export function istEchteTastatureingabe(e: KeyboardEvent): boolean {
  return !!e.code && !!e.key && e.key !== "Unidentified";
}
