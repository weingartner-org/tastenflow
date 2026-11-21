import "@testing-library/jest-dom/vitest";

// jsdom has no matchMedia — provide a minimal, light-mode stub.
if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

/**
 * ★★ Node 26 bringt ein EIGENES globales `localStorage` mit — und es ist
 * `undefined`, solange der Node-Schalter `--localstorage-file` fehlt
 * (ExperimentalWarning: „localStorage is not available…"). Dieses Node-Global
 * überdeckt in der jsdom-Umgebung das echte `localStorage` des Fensters.
 *
 * Wirkung, als der Rechner am 07.08.2026 auf Node v26.6.0 hob: `localStorage`
 * war im Test schlagartig `undefined`, `localStorage.clear()` warf hier — und
 * damit fiel **die komplette Suite der ganzen Plattform** (auch Braille,
 * Tastenflow, Sehsimulation), ohne dass eine einzige Zeile Anwendungscode
 * falsch war. Der Befund kostet leicht eine halbe Nacht Fehlersuche am
 * falschen Ende, darum steht er hier so ausführlich.
 *
 * Die Reparatur setzt einen eigenen Speicher ein. Damit funktioniert auch
 * Anwendungscode weiter, der schlicht `localStorage` schreibt — und davon lebt
 * der ganze Fortschritts-Speicher der Lern-Apps.
 *
 * ── Was gemessen wurde (statt geraten) ─────────────────────────────────────
 *
 * In der Testumgebung gilt: `typeof window` = object · `typeof document` =
 * object · User-Agent = jsdom. jsdom LÄUFT also. Und trotzdem:
 * `'localStorage' in window` = **true**, `window.localStorage` = **undefined**.
 * Der Schlüssel ist da, der Wert ist weg — Node 26 legt sein eigenes, leeres
 * `localStorage` über jsdoms echtes, wenn vitest die Node-Globals auf das
 * jsdom-Fenster kopiert.
 *
 * Darum wird hier ein eigener Speicher eingesetzt statt einer zurechtgebogenen
 * Referenz. Er ist vollwertig (getItem/setItem/removeItem/clear/key/length),
 * lebt im Arbeitsspeicher und wird vor jeder Testdatei geleert — für Tests ist
 * das sogar sauberer als ein geteilter Browser-Speicher.
 */
/**
 * ★★★ DER ENGLISCHE LEHRGANG IST SEIT 25.09.2026 DIE GRUNDEINSTELLUNG
 * (`englischLehrgangProbeAn()` in `src/lib/typing/lernweg.ts` liefert ohne
 * jede Einstellung `true`, `?englisch-lehrgang=0` ist nur noch der Not-Aus).
 *
 * Rund 60 bestehende Testdateien sind für den GEGENTEILIGEN Grundzustand
 * geschrieben ("Schalter aus", `feedback_test_kennt_die_abwaegung`) - ohne
 * einen Vorbeleger würde die ganze Suite plötzlich mit eingeschaltetem
 * Lehrgang laufen. Der Vorbeleger gehört in `clear()` selbst, NICHT in einen
 * zusätzlichen `beforeEach` hier: sehr viele Testdateien rufen
 * `localStorage.clear()` in ihrem EIGENEN `beforeEach` auf, das NACH dem
 * hiesigen läuft - ein einfacher `beforeEach`-Vorbeleger wäre vom nächsten
 * `clear()` sofort wieder weg.
 *
 * Ein Test, der den WIRKLICHEN Grundzustand ohne diese Vorgabe braucht (siehe
 * `tests/tastenflow-englisch-lehrgang-freigabe.test.ts`), entfernt den
 * Schlüssel danach selbst mit `localStorage.removeItem("tastenflow-englisch-lehrgang")`.
 */
const LEHRGANG_SCHALTER_SCHLUESSEL = "tastenflow-englisch-lehrgang";

function baueSpeicher(): Storage {
  let daten = new Map<string, string>();
  const leeren = () => {
    daten = new Map();
    daten.set(LEHRGANG_SCHALTER_SCHLUESSEL, "0");
  };
  leeren();
  return {
    get length() { return daten.size; },
    clear: leeren,
    getItem: (k: string) => (daten.has(k) ? daten.get(k)! : null),
    key: (i: number) => Array.from(daten.keys())[i] ?? null,
    removeItem: (k: string) => { daten.delete(k); },
    setItem: (k: string, v: string) => { daten.set(k, String(v)); },
  } as Storage;
}

if (typeof window !== "undefined" && !window.localStorage) {
  const speicher = baueSpeicher();
  Object.defineProperty(window, "localStorage", {
    value: speicher, configurable: true, writable: true,
  });
  Object.defineProperty(globalThis, "localStorage", {
    value: speicher, configurable: true, writable: true,
  });
}

/**
 * ★★ jsdom kennt `Element.prototype.scrollIntoView` NICHT - im Browser gibt es
 * die Methode auf jedem Element, hier auf keinem. Anwendungscode, der eine
 * Stelle ins Bild rückt, wirft darum in Tests `… is not a function`, obwohl er
 * völlig richtig ist. Betroffen ist unter anderem das Tippfeld: Es scrollt beim
 * Fokus die KARTE ins Bild (`karteRef.current?.scrollIntoView`, seit
 * 25.08.2026) - das `?.` fängt nur ein fehlendes Element ab, nicht eine
 * fehlende Methode.
 *
 * ⚠️ Warum das hier steht und nicht in den einzelnen Dateien: Bis 25.08.2026
 * stopften drei Testdateien diese Lücke für sich selbst - und weil die Suite
 * Globals zwischen Dateien teilt, waren dadurch auch Dateien grün, die den
 * Stopfen gar nicht setzen. `typing-taste-vor-spiel` war so eine: Sie lief nur,
 * solange VOR ihr eine der drei Dateien an der Reihe war. Eine neue Testdatei
 * genügte, um die Reihenfolge zu verschieben, und sie fiel um - mit einem
 * Fehler, der nichts mit ihrem Gegenstand zu tun hat.
 *
 * Ein Test, dessen Ergebnis davon abhängt, welche Datei vorher lief, misst
 * nicht das, was er zu messen vorgibt. Die Lücke gehört darum EINMAL hierher.
 */
if (typeof Element !== "undefined" && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function () {};
}

// Sauberer Stand vor jeder Testdatei.
beforeEach(() => {
  localStorage.clear();
});

/**
 * ★★ `sendBeacon` gibt es in jsdom nicht - und ohne diesen Stummschalter fällt
 * die Reichweiten-Meldung (`src/lib/reichweite.ts`) im Test auf `fetch` mit
 * einer relativen Adresse zurück. Jede gerenderte Programmseite stiesse dann
 * eine Netzanfrage an, die ins Leere läuft: unnötige Arbeit in Tests, die
 * ohnehin an der 60-Sekunden-Grenze kratzen (`typing-runde-probelauf`), und
 * eine Fehlerquelle, die mit der geprüften Sache nichts zu tun hat.
 *
 * ⚠️ Der Stub ist bewusst KEIN `vi.fn()`: Wer die Meldungen prüfen will, setzt
 * sich in seinem Test einen eigenen Spion darauf (so macht es
 * `tests/statistik.test.ts` NICHT - dort wird die Nutzlast gegen die
 * Server-Regeln geprüft, nicht der Versand).
 */
if (typeof navigator !== "undefined" && !navigator.sendBeacon) {
  Object.defineProperty(navigator, "sendBeacon", {
    value: () => true,
    writable: true,
    configurable: true,
  });
}

/**
 * ★★★ DIE SPRACHLISTE DES BROWSERS IST IM TEST DEUTSCH (19.09.2026).
 *
 * jsdom meldet von sich aus `navigator.languages = ["en-US"]`. Seit der
 * Probe-Schalter der englischen Bedienung weg ist, erkennt Tastenflow auf
 * einem NEUEN Gerät die Sprache aus dieser Liste (`lib/bedienSprache/
 * sprache.ts`) - mit jsdoms Vorgabe wäre jeder Test, der die ganze App
 * zeigt, englisch, und rund 1.700 Abfragen über deutschen Wortlaut kippten
 * auf einmal.
 *
 * Darum hier eine österreichische Liste. Wer einen englischen Browser
 * braucht, stellt ihn in seinem Test selbst ein:
 *   `vi.spyOn(navigator, "languages", "get").mockReturnValue(["en-GB"])`
 * (ein Getter, damit `vi.spyOn` greift; `vi.restoreAllMocks()` holt die
 * deutsche Liste zurück). Englische Bedienung ohne Erkennung wählt ein Test
 * wie bisher über die gemerkte Wahl (`tastenflow-bedienung`) oder
 * `?bedienung=en`.
 */
if (typeof window !== "undefined" && typeof navigator !== "undefined") {
  const deutscheSprachen: readonly string[] = Object.freeze(["de-AT", "de"]);
  Object.defineProperty(navigator, "languages", {
    get: () => deutscheSprachen,
    configurable: true,
  });
  Object.defineProperty(navigator, "language", {
    get: () => deutscheSprachen[0],
    configurable: true,
  });
}

/**
 * ★★★ DIE SPRACHPAKETE SIND IM TEST SCHON DA (28.09.2026) - aber NICHT hier.
 *
 * Seit Tastenflow die Texte je Sprache nachlädt (`src/lib/typing/sprachpakete.ts`),
 * sind `CORPUS`, `SERIEN`, das Lexikon … leer, bis ein Paket geladen ist. Die
 * bestehenden Testdateien sind für „alles da" geschrieben. Vorgeladen wird
 * darum in `tests/sprachpakete-vorgeladen.ts`, eingehängt über `test.alias` in
 * vite.config.ts: Wer das Register importiert, bekommt es MIT allen Paketen.
 *
 * Warum nicht hier in setup.ts: gemessen am 28.09. kostete das Vorladen vor
 * JEDER Datei rund 0,3 s Rechenzeit - auch den ~800 Dateien, die gar keine
 * Tastenflow-Texte berühren (40 Braille-Dateien: Einrichtung 1,2 s → 12,1 s).
 */
