/**
 * ★★★ DER DEUTSCH-FÄNGER - zum Wiederverwenden (EN0, 18.09.2026).
 *
 * Herausgelöst aus `tests/tastenflow-englische-bedienung.test.tsx` (Probestück
 * 12.09.2026, Bauplan §5 Nr 3), damit jede folgende Etappe der englischen
 * Bedienung EINEN Fänger-Test je Bereich schreiben kann - mit demselben Mass.
 *
 * Gemessen wird am GERENDERTEN DOM, nicht an einer Dateiliste: Eine Liste der
 * „übersetzten Dateien" sagt nichts darüber, ob ein Kind auf der Seite noch ein
 * deutsches Wort liest - der Text kann aus einer Bibliothek, einer Tabelle in
 * `lib/` oder einem gemeinsamen Bauteil kommen.
 *
 * ── Was er liest ───────────────────────────────────────────────────────────
 * Jeden Textknoten unter `root` (auch `sr-only` und die unsichtbaren
 * `Tipp`-Hinweise - die stehen immer im Baum, siehe `Tipp.tsx`), dazu die
 * Attribute in `GEPRUEFTE_ATTRIBUTE` und den `value` von Knöpfen aus
 * `<input>`. ⚠️ Fenster (`Modal`) zeichnen sich in ein Portal an `<body>` -
 * wer sie mitlesen will, gibt `document.body` als `root`.
 * Gesprochenes (`speakUi` …) liest er NICHT selbst - das kennt nur der Test,
 * der die Stimme ersetzt hat. Dafür gibt es `pruefeText`.
 *
 * ── Woran er Deutsch erkennt ───────────────────────────────────────────────
 * Umlaut oder ß in einem Wort, oder ein Wort aus `DEUTSCHE_WOERTER`. Die Liste
 * meidet Wörter, die es auch im Englischen gibt („die", „hell", „also",
 * „Finger", „Tempo", „kind", „gut", „spiel") - sonst schlüge er bei englischen
 * Übungszeilen und englischen Sätzen an.
 *
 * ── Was er ausnimmt, und warum ─────────────────────────────────────────────
 *  · Inhalte in einem Element mit `lang="de"` UNTERHALB von `<html>`: die
 *    deutsche Übungszeile eines Kontos mit deutscher Übungssprache, deutsche
 *    Inhalte, die bewusst deutsch bleiben, und der Sprachschalter
 *    „DE - Deutsch", der in der Zielsprache angeschrieben ist.
 *    (`<html lang>` selbst zählt nicht - in der deutschen Bedienung steht dort
 *    „de", und dann wäre alles ausgenommen.)
 *  · Die Texte des Sprachschalters (`SPRACHSCHALTER_TEXTE`) - er muss auch
 *    lesen können, wer die aktuelle Sprache nicht versteht; sein Hinweis ist
 *    darum zweisprachig und steht neben, nicht in seinem `lang="de"`.
 *
 * ★★★ DIE GEGENPROBE gehört in JEDEN Test, der diesen Fänger benutzt:
 * Derselbe Aufbau in der DEUTSCHEN Bedienung muss VIELE Funde liefern. Ein
 * Wächter, der beim ersten Lauf grün ist, beweist nichts - er könnte schlicht
 * nichts lesen (eine leere Seite ist auch „ohne Deutsch").
 */

/**
 * Häufige deutsche Wörter der Oberfläche. ⚠️ Nur Wörter, die es im Englischen
 * NICHT gibt - „die", „den", „hell", „also", „am", „an", „in", „was", „will",
 * „Finger", „Tempo", „Pause", „Training", „Alt", „Standard", „kind", „gut",
 * „spiel", „super", „ja", „code" fehlen darum mit Absicht - seit EN1
 * (19.09.2026) auch „still" und „alter": Beide sind englische Wörter („still
 * going", „alter the text") und erzwangen in EN3/EN5 holprige Sätze; die
 * Gegenprobe findet ohne sie genauso viel. Umlaute und ß fängt
 * die Zeichenprüfung ohnehin. Eigennamen, die in beiden Sprachen stehen
 * bleiben (Tastenflow, Sensorik, Lernwerkstatt), gehören NICHT hierher.
 */
export const DEUTSCHE_WOERTER: ReadonlySet<string> = new Set(
  (
    // Stand Probestück (12.09.2026)
    "und der das des dem ist nicht mit ein eine einen einer zu zum zur auf von vom " +
    "im ins bei beim wird werden sich noch auch oder wie bis dann wenn alle alles aus " +
    "oben unten weiter heute taste tasten zeile zeilen konto hilfe einstellungen farben " +
    "farbe kontrast vorlesen klasse abmelden anmelden nachrichten nachricht statistik " +
    "passwort meine mein meinen dein deine deinen du dich dir sie zeichen welle " +
    "werkzeuge lernplattform programm startseite sterne runde geschafft nochmal einmal " +
    "wochenziel spielstufe gelernt spielen tastatur anzeigen ausblenden daumen leertaste " +
    "zeigefinger mittelfinger ringfinger kleiner linker rechter linke rechte fertig " +
    "lieber lektionen geschichten wortspiele strg einfacher sprache liste funktion " +
    "schreibfeld fenster springen ansagen aktuelle aufgabe erneut geübte zeit jeder " +
    "kommt selbst sobald anderen sitzen statt minuten wette schreiben dunkel schwarz " +
    "gelb blau einschalten ausschalten neue neu keine kein sagt dazu treffsicherheit " +
    "achtung lehrkraft gespeichert verloren fortschritt dieser diese runden neues " +
    "tippfeld vergrößern verkleinern anzeige ansage sofort laufende endet bleibt " +
    "gliederung kreis einrichtung neu starten übungsart reihum mein " +
    "angemeldet unterrichten bereich erklärung große buchstaben umschalt nächste " +
    "richtig falsch wieder nur jetzt eingabezeile wechseln öffnen schließen " +
    "sauber getippt solide abschnitt gratulation freigeschaltet buchstabe ziffer " +
    "satzzeichen sonderzeichen liegt geschrieben halten gegenhand willkommen " +
    "verstanden lernstand geht aber " +
    // EN0 (18.09.2026): Lehrkraft-Bereich, Zahnrad, Wertung - für die folgenden Etappen
    "speichern abbrechen bearbeiten klassen woche wochen ziel ziele stunde stunden " +
    "sperren gesperrt freischalten anschlag fehler tippen lernen lernprogramm " +
    "zugang zugangsdaten klassencode schulstufe schuljahr einhand buchstabieren " +
    "spiele abzeichen stufe sekunden prozent ergebnis ergebnisse wertung " +
    "leistungswert genauigkeit verlauf hinweis hinweise schalter knopf bitte nein " +
    "schon immer sehr nachholen erlassen vorgabe einstellung kinder"
  ).split(/\s+/),
);

/** Die Attribute, die eine Sprachausgabe oder ein Hinweis vorliest. */
export const GEPRUEFTE_ATTRIBUTE = [
  "aria-label",
  "aria-description",
  "aria-roledescription",
  "aria-valuetext",
  "aria-placeholder",
  "title",
  "placeholder",
  "alt",
] as const;

/**
 * Der Sprachschalter der Kopfzeile schreibt in der ZIELSPRACHE (Bauplan §3.3,
 * `SPRACHSCHALTER_ZIEL` in `AppKopfzeile.tsx`): Name und zweisprachiger Hinweis.
 */
export const SPRACHSCHALTER_TEXTE: ReadonlySet<string> = new Set([
  "DE - Deutsch",
  "Deutsch - switch to German",
  // ★ 28.09.2026 (Freigabe fr/es): Bei mehr als zwei Sprachen steht statt des
  // Schalters der Sprachwähler mit Weltkugel - absichtlich in ALLEN Sprachen
  // beschriftet (`SPRACHWAHL_LABEL…` in `AppKopfzeile.tsx`), damit ihn jede
  // Person findet, egal welche Sprache gerade eingestellt ist.
  "Sprache - Language - Langue",
  "Sprache - Language - Langue - Idioma",
]);

// ★ 10.10.2026 (Freigabe it/pl/tr/cs): der Name des Wählers nennt zusätzlich je
// angebotene neue Sprache ihr Wort (Lingua, Język, Dil, Jazyk) - jede
// Kombination ist erlaubt (Not-Aus je Sprache).
for (const es of ["", " - Idioma"])
  for (const it of ["", " - Lingua"])
    for (const pl of ["", " - Język"])
      for (const tr of ["", " - Dil"])
        for (const cs of ["", " - Jazyk"])
          (SPRACHSCHALTER_TEXTE as Set<string>).add(
            `Sprache - Language - Langue${es}${it}${pl}${tr}${cs}`,
          );

// ★ 06.11.2026 (Freigabe der neun): bei allen 17 Sprachen nennt der Name das Wort „Sprache" in jeder Sprache.
(SPRACHSCHALTER_TEXTE as Set<string>).add(
  "Sprache - Language - Langue - Idioma - Lingua - Język - Dil - Jazyk - Език - Γλώσσα - Nyelv - Taal - Limbă - Språk - Мова",
);

/**
 * ★ 10.10.2026 (Freigabe it/pl/tr/cs): Namen einer Sprache in ihrer EIGENEN
 * Sprache, die einen Umlaut tragen und in jeder Bedienung stehen bleiben - sie
 * stehen als Klammerzusatz an den türkischen Tastaturen („Turkish Q (Türkçe Q)").
 * Kein deutsches Wort. Nur genau diese.
 */
const EIGENNAMEN_MIT_UMLAUT: ReadonlySet<string> = new Set(["türkçe"]);

/** Die deutschen Wörter in einem Text - leer, wenn keins darin steht. */
export function deutscheWoerter(text: string): string[] {
  const woerter = text.match(/\p{L}+/gu) ?? [];
  return woerter.filter(
    (w) =>
      !EIGENNAMEN_MIT_UMLAUT.has(w.toLowerCase()) &&
      (/[äöüÄÖÜß]/.test(w) || DEUTSCHE_WOERTER.has(w.toLowerCase())),
  );
}

/** Steht das Element (oder ein Vorfahr unterhalb von `<html>`) in `lang="de"`? */
export function inDeutsch(el: Element | null): boolean {
  const html = el?.ownerDocument?.documentElement ?? null;
  for (let e = el; e && e !== html; e = e.parentElement) {
    const l = e.getAttribute("lang");
    if (l && /^de(?:-|$)/i.test(l)) return true;
  }
  return false;
}

/**
 * Ein Text als Fundstelle - `null`, wenn er kein deutsches Wort trägt. Für
 * alles, was nicht im DOM steht (gesprochene Ansagen aus einem ersetzten
 * `speakUi`), in derselben Schreibweise wie `findeDeutsch`.
 */
export function pruefeText(quelle: string, text: string | null | undefined): string | null {
  if (!text || !text.trim()) return null;
  const knapp = text.trim().replace(/\s+/g, " ");
  if (SPRACHSCHALTER_TEXTE.has(knapp)) return null;
  const w = deutscheWoerter(text);
  if (!w.length) return null;
  return `${quelle}: „${knapp.slice(0, 140)}" [${[...new Set(w)].join(", ")}]`;
}

/**
 * ★★★ Alle deutschen Fundstellen unter `root` - je Fundstelle eine Zeile
 * („Text <button>: „Speichern" [speichern]"), jede nur einmal.
 */
export function findeDeutsch(root: Element): string[] {
  const funde = new Set<string>();
  const merke = (quelle: string, text: string | null | undefined) => {
    const f = pruefeText(quelle, text);
    if (f) funde.add(f);
  };
  // `root` selbst kann in `lang="de"` stehen - dann ist alles darunter ausgenommen.
  const doc = root.ownerDocument;
  const gehe = (wurzel: Element) => {
    const gang = doc.createTreeWalker(wurzel, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    for (let n: Node | null = gang.currentNode; n; n = gang.nextNode()) {
      if (n.nodeType === Node.TEXT_NODE) {
        const eltern = n.parentElement;
        if (!eltern || /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/.test(eltern.tagName) || inDeutsch(eltern))
          continue;
        merke(`Text <${eltern.tagName.toLowerCase()}>`, n.textContent);
        continue;
      }
      const el = n as Element;
      if (inDeutsch(el)) continue;
      const tag = el.tagName.toLowerCase();
      for (const a of GEPRUEFTE_ATTRIBUTE) merke(`${a} <${tag}>`, el.getAttribute(a));
      // Ein `<input type="button|submit|reset">` trägt seine Beschriftung im `value`.
      if (tag === "input" && /^(button|submit|reset)$/i.test(el.getAttribute("type") ?? ""))
        merke(`value <input>`, el.getAttribute("value"));
    }
  };
  gehe(root);
  /*
    ★ K1 (19.09.2026): Die Mouseover-Hinweise (`Tipp`, `Zeigerhinweis`) hängen
    nicht mehr im Bauteil, sondern per Portal in einer Ebene unter `<body>` -
    im Bauteil steht nur ihre Marke (`data-hinweis-anker` = Id des Kastens).
    Ohne diesen Schritt läse der Fänger STILL keinen einzigen Hinweis mehr
    (die Gegenprobe in `tests/deutsch-faenger.test.tsx` hat es gezeigt).
    Der Kasten trägt das `lang` seines Bereichs mit (`Zeigerhinweis.tsx`), also
    gilt `inDeutsch` für ihn wie vorher am Ort.
  */
  for (const marke of root.querySelectorAll("[data-hinweis-anker]")) {
    const kasten = doc.getElementById(marke.getAttribute("data-hinweis-anker") ?? "");
    if (kasten && !root.contains(kasten)) gehe(kasten);
  }
  return [...funde];
}
