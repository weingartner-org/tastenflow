/**
 * ════════════════════════════════════════════════════════════════════════════
 * DER HINWEIS BEIM ÜBERFAHREN - groß, sofort, und auf der Braillezeile lesbar
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Herausgelöst am 01.09.2026 aus `Spaltenkopf.tsx`. Der Anlass: Die
 * Veränderungs-Pfeile in der Lernenden-Tabelle brauchen genau dasselbe
 * Verhalten, und eine zweite Umsetzung daneben wäre die Doppelung, bei der zwei
 * Stellen dasselbe verschieden beantworten
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]). Am Verhalten hat
 * sich beim Herauslösen nichts geändert; die Begründungen unten sind die
 * gemessenen aus dem Spaltenkopf.
 *
 * ── Warum der native `title` das nicht kann (gemessen 01.09.2026) ──────────
 * Der eingebaute `title` erscheint erst nach rund einer Sekunde, in der
 * Schriftgröße des Betriebssystems (auf einem Retina-Bildschirm winzig), und er
 * hört NICHT auf die Vergrösserung des Browsers. Johannes: *„die mouse over -
 * groß und schnell … funktionieren noch nicht."*
 *
 * ── ⚠️ KEIN neuer Tabstopp ─────────────────────────────────────────────────
 * Weder ein Spaltenkopf noch ein Pfeil ist etwas zum Bedienen. Wären es
 * Tabstopps, hätte eine Tabelle mit 25 Zeilen 50 neue Haltepunkte. Wer nicht
 * mit der Maus arbeitet, bekommt den Satz stattdessen über `aria-describedby`:
 * Die Sprachausgabe liest ihn mit, und auf der Braillezeile steht er ebenfalls.
 *
 * ★ Der Hinweis steht IMMER im Baum und wird nur sichtbar geschaltet
 * (`visibility`, nicht `display`) - `aria-describedby` zeigt damit immer auf ein
 * vorhandenes Element. Ein `visibility: hidden`-Ziel wird verlässlich
 * vorgelesen und taucht trotzdem in keinem Lesemodus-Fluss doppelt auf.
 *
 * ── ★ Escape schickt ihn weg (WCAG 1.4.13) ─────────────────────────────────
 * Was bei Zeigerkontakt erscheint, muss sich wegschicken lassen. Der Horcher
 * hängt NUR, solange der Hinweis offen ist - sonst verschluckte dieser Baustein
 * das Escape der ganzen Seite, und in Tastenflow holt Escape immer die
 * Eingabezeile zurück (Hausregel R6, Befund F15 an `Tipp.tsx`).
 *
 * ── Warum nicht `Tipp.tsx` ─────────────────────────────────────────────────
 * `Tipp` gehört fünf Apps (`apps/GEMEINSAM.md` §1) und hängt an einem
 * FOKUSSIERBAREN Knopf. Hier ist keiner. Eine Änderung dort hätte das
 * Tastaturverhalten von vier fremden Programmen berührt - dafür gibt es keinen
 * Anlass. (Den KASTEN teilen sich beide seit 10.09. - siehe unten, K1.)
 *
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★★★ K1 (19.09.2026): DER HINWEIS LIEGT IMMER OBEN - er hängt am <body>
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Johannes, mit Bildschirmfoto: *„dieses Problem gibt es ganz oft: die
 * Einblendung von Mouseover ist halb verdeckt, also nicht im Vordergrund"* -
 * der Hinweis von „Als Excel herunterladen" (`ZeitraumKopf.tsx`) lag UNTER
 * der blauen Gruppenzeile „Üben"/„Prüfung" der Tabelle darunter.
 *
 * Gemessen im Browser (Mock, 1280 px, `elementFromPoint` mit vorübergehend
 * `pointer-events: auto` am Kasten - OHNE das findet `elementFromPoint` einen
 * `pointer-events-none`-Kasten nie, und jede Messung sagt „verdeckt"):
 *  · Mitte des Kastens → die Kopfzelle „Score" (`th.sticky.z-30`), Oberkante
 *    der Gruppenzeile → „Üben" (`th.sticky.z-30`). Darüber und darunter
 *    (Kartenrand, Zeilen mit `z-10`) → der Kasten.
 *  · Die Ursache ist ein GLEICHSTAND: Kasten `z-30`, klebende Kopfzellen
 *    `z-30` (`TastenflowReiter.tsx`, B12) - bei Gleichstand gewinnt, wer im
 *    DOM später steht, und die Tabelle steht nach dem Kopf. Mit `z-31` am
 *    Kasten: überall der Kasten.
 *  · ⚠️ Die Vermutung „`container-type` (E1, `.zeitraum-kopf`) macht einen
 *    Stapelkontext" ist WIDERLEGT: `container-type` am Kopf abgeschaltet →
 *    dasselbe Ergebnis, `z-31` mit `container-type` → der Kasten gewinnt.
 *    (Chrome legt für eine Container-Abfrage keinen Stapelkontext mehr an.)
 *  · Dazu, auch gemessen: „Melden" in der Kopfzeile bei 375 px - der Kasten
 *    stand bei -61 px, also 61 px links aus dem Bild.
 *
 * Eine höhere Zahl an EINER Stelle hätte den einen Fall behoben und den
 * nächsten offen gelassen: Die Ecken der Tabelle stehen auf 35, die
 * Seiten-Kopfzeile auf 40, jeder Rollkasten schneidet ab, und jeder künftige
 * Stapelkontext (`transform`, `filter`, `isolation`, …) sperrt einen Kasten
 * in seine Ebene ein - egal, wie hoch dessen Zahl ist.
 *
 * ⇒ Der Kasten wird per Portal in EINE Ebene direkt unter `<body>` gehängt
 *   (`#hinweis-ebene`, ohne eigenen Stapelkontext) und dort `position:
 *   fixed` an den Anker gesetzt - beim Öffnen und, solange er offen ist, bei
 *   jedem Rollen (auch in Rollkästen: der Horcher lauscht in der
 *   Abfangphase) und jeder Grössenänderung. Kein Vorfahre kann ihn mehr
 *   abschneiden oder überdecken. Am Ort bleibt nur eine unsichtbare Marke
 *   (`data-hinweis-anker`), über die Messung und Anker ihn finden.
 *
 * Was sich NICHT geändert hat: `role="tooltip"`, die Id für
 * `aria-describedby`, der Kasten steht IMMER im Baum (nur unsichtbar
 * geschaltet), `pointer-events-none`, Escape, weniger Bewegung, `ausrichtung`,
 * `nachOben`, `maxBreite`. Die Wahl von Seite und Richtung (`lageMitPlatz`,
 * `passtUntenNicht`) bleibt die VORGABE; `platziereHinweis` prüft sie nur
 * noch gegen das Fenster und klemmt den Kasten waagrecht mit 8 px Rand
 * hinein - er ragt nie mehr aus dem Bild und macht die Seite nie breiter
 * (ein `fixed`-Kasten trägt nichts zur Scrollbreite bei).
 *
 * ── Die Stapelordnung (Zahlen aus dem Code, 19.09.2026) ─────────────────────
 *     Zeilen der Tabelle     z-10 / z-20   (`TastenflowReiter.tsx`)
 *     Kopfzellen             z-30, Ecken z-[35]
 *     Seiten-Kopfzeile       z-40          (`Layout.tsx`, klebt)
 *  →  HINWEIS                z-[45]        (`HINWEIS_EBENE`)
 *     Fenster (`Modal.tsx`)  z-50          und die anderen `fixed inset-0 z-50`
 *     Feier, Vollbild        z-60 · Einführung z-[70]/[71] · Sprungmarke 100
 *
 *   45, nicht 9999: Ein Hinweis, der noch offen ist, wenn ein Fenster
 *   aufgeht (die Maus steht noch auf dem Knopf, der es geöffnet hat), darf
 *   das Fenster nicht überdecken - er liegt unter dessen Abdunklung wie der
 *   Rest der Seite. Steht der Anker SELBST in einer solchen Ebene (ein Tipp
 *   im Fenster, im Einstellungsfenster der Übungsseite, in der Feier), liegt
 *   der Hinweis eine Stufe über dieser Ebene: `ebeneUeber()` sucht den
 *   äussersten Vorfahren mit `z-index` - er entscheidet, wo der Anker in der
 *   Wurzel-Stapelordnung steht - und nimmt dessen Zahl + 1.
 */
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

/** Unter allem, was als Fenster über der Seite liegt (`Modal.tsx`: 50), über allem anderen. */
export const HINWEIS_EBENE = 45;
/** So viel Abstand hält der Kasten mindestens zum Fensterrand. */
export const HINWEIS_RAND = 8;
/** Abstand zwischen Anker und Kasten - vorher `mt-1`/`mb-1`. */
export const HINWEIS_ABSTAND = 4;
/** Die Id der Ebene unter `<body>`, in der alle Kästen hängen. */
export const HINWEIS_EBENE_ID = "hinweis-ebene";

/**
 * Die Ebene, in die jeder Kasten per Portal gehängt wird - ein einfaches
 * `<div>` ohne Lage und ohne `z-index`, also OHNE eigenen Stapelkontext: Jeder
 * Kasten darin nimmt mit seiner eigenen Zahl an der Stapelordnung der Wurzel
 * teil.
 *
 * Eine eigene Ebene statt direkt `<body>`: Leert ein Test `body.innerHTML`,
 * bevor React abräumt, entfernt React die Kästen aus DIESER (dann losgelösten)
 * Ebene - aus `<body>` direkt geworfen, schlüge das mit „NotFoundError" fehl.
 * Wer danach rendert, bekommt eine neue Ebene.
 */
export function hinweisEbene(): HTMLElement | null {
  if (typeof document === "undefined" || !document.body) return null;
  let ebene = document.getElementById(HINWEIS_EBENE_ID);
  if (!ebene || !ebene.isConnected) {
    ebene = document.createElement("div");
    ebene.id = HINWEIS_EBENE_ID;
    document.body.appendChild(ebene);
  }
  return ebene;
}

/**
 * Der Kasten zu einer Hülle. Er steckt seit K1 nicht mehr IN ihr, sondern in
 * der Ebene unter `<body>` - in der Hülle steht nur seine Marke. Der zweite
 * Weg (ein `role="tooltip"` direkt darin) bleibt für Aufrufer, die ihren
 * Kasten selbst bauen (die Wächter mit von Hand gesetzten Massen).
 */
export function kastenZu(huelle: HTMLElement): HTMLElement | null {
  const id = huelle.querySelector("[data-hinweis-anker]")?.getAttribute("data-hinweis-anker");
  const kasten = id ? document.getElementById(id) : null;
  return kasten ?? (huelle.querySelector('[role="tooltip"]') as HTMLElement | null);
}

/**
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★★ WARUM DER HINWEIS UMKLAPPEN MUSS (gemessen am 01.09.2026, im BROWSER)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Die Lernenden-Tabelle steht in einem Kasten mit `overflow-x: auto` - nötig
 * für das seitliche Schieben und die klebende Namensspalte. **Und genau das
 * schneidet den Hinweis ab:** Setzt man `overflow-x` auf `auto`, macht der
 * Browser `overflow-y` automatisch mit (CSS Overflow 3, §3.5) - „sichtbar"
 * gibt es an dieser Stelle nicht mehr.
 *
 * Gemessen an der LETZTEN Tabellenzeile: Der Hinweis ragte **62 px** unter den
 * Kasten und wurde dort abgeschnitten. Für die untersten Kinder einer Klasse
 * war die Erklärung damit nicht lesbar - und in jsdom fällt das nie auf, dort
 * hat jedes Element die Grösse null ([[feedback_gruener_waechter_beweist_was]]).
 *
 * ⇒ Beim Überfahren wird gemessen, ob der Hinweis unten noch hinpasst. Passt
 *   er nicht, klappt er nach OBEN auf. Gemessen wird am nächsten scrollenden
 *   Vorfahren, nicht am Fenster: Der Kasten ist der, der abschneidet.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★★ UND WARUM ER AUCH SEITLICH MESSEN MUSS (gemessen am 11.09.2026, im BROWSER)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Schülerstatistik, Fenster 1024 px, die Lektionen-Kacheln in einer
 * umbrechenden Liste: `document.documentElement.scrollWidth` = 1136 px, die
 * Seite rollte seitlich (bei 112 px Verschiebung war die Kopfzeile links
 * abgeschnitten) - OHNE dass jemand einen Hinweis geöffnet hätte. Ursache:
 * Der Kasten steht IMMER im Baum (siehe oben, für `aria-describedby` so
 * gewollt) und trägt darum auch unsichtbar seine volle Breite (`w-max
 * max-w-80`, bis 320 px) zur Scrollbreite bei. Bei den sechs Kacheln am
 * rechten Rand (Lektion 22 bis 27) ragte er 10 bis 113 px über das Fenster,
 * alle sechs `visibility: hidden`. Ein zweiter Fall derselben Sorte stand
 * schon am 10.09. im Gedächtnis (831 statt 700 px, iPad hochkant) - dort
 * wurde die eine Stelle von Hand auf „rechts" gestellt. In einer
 * umbrechenden Liste geht das nicht: Welche Kachel am Rand steht, entscheidet
 * die Fensterbreite.
 *
 * Zwei Dinge, zwei Antworten:
 *  1. ZU: Der Kasten steckt in einer 0 × 0 px grossen Hülle mit
 *     `overflow: clip`. Was abgeschnitten ist, zählt in keinem Vorfahren zur
 *     Scrollbreite (gemessen: 1314 → 1024 px), bleibt aber messbar
 *     (`offsetWidth`/`offsetHeight` unverändert 320 × 40) - `passtUntenNicht`
 *     und `seiteMitPlatz` vermessen ihn also weiterhin, BEVOR er aufgeht.
 *     `clip` statt `hidden`: kein Rollkasten, kein neuer Formatierungskontext,
 *     nichts, was das Layout ringsum verändert. Beim Öffnen wird die Hülle
 *     `overflow: visible`.
 *  2. AUF: Beim Überfahren wird - wie für oben/unten - gemessen, ob der
 *     Kasten an der vorgegebenen Seite noch in den schneidenden Vorfahren
 *     (sonst: das Fenster) passt. Passt er nicht, dockt er an der anderen
 *     Seite an; passt er nirgends, an der Seite mit mehr Platz - und wird
 *     dort so schmal, dass er hineinpasst (gemessen bei 320 px: Lektion 27
 *     steht bei 95 px, der Kasten ist 263 px breit, links bleiben 225 px -
 *     ohne das ragte er 39 px über den Rand).
 *
 * ⚠️ Beides ist am `Hinweiskasten` OPT-IN (`ohneBreiteWennZu`, gemessene
 * `ausrichtung` aus dem Hook): `Tipp.tsx` gehört fünf Apps
 * (`apps/GEMEINSAM.md`) und benutzt den Kasten ebenfalls - er bekommt hier
 * unverändert dasselbe Markup wie bisher, bis Johannes das für alle fünf
 * Apps entscheidet. Die Tastenflow-eigenen Hüllen (`Hinweisflaeche`,
 * `Erklaert`, `Spaltenkopf`, `Veraenderungspfeil`) haben beides an.
 *
 * ★ Seit K1 (19.09.2026, Kopf dieser Datei) ist Punkt 1 für ALLE Kästen
 * erledigt, auch für `Tipp`: Ein `fixed`-Kasten unter `<body>` trägt zu
 * keiner Scrollbreite bei - die 0 × 0-Klipphülle ist damit weg,
 * `ohneBreiteWennZu` wird noch angenommen, ändert aber nichts mehr. Punkt 2
 * (Seite und Kappung messen) bleibt als Vorgabe; das Fenster hat das letzte
 * Wort (`platziereHinweis`).
 *
 * Wächter: `tests/tastenflow-zeigerhinweis-seitenrand.test.tsx` und
 * `tests/tipp-immer-oben.test.tsx` (die Ursache, in jsdom) und
 * `npm run pruefstand:seitenbreite` (die Wirkung, in echtem Chrome - jsdom
 * rechnet kein Layout).
 */

/** Der nächste Vorfahre, der abschneidet - oder `null` (dann gilt das Fenster). */
function schneidenderVorfahre(el: HTMLElement | null): HTMLElement | null {
  let p = el?.parentElement ?? null;
  while (p && p !== document.body) {
    const o = getComputedStyle(p);
    if (/(auto|scroll|hidden)/.test(o.overflowY + o.overflowX)) return p;
    p = p.parentElement;
  }
  return null;
}

/**
 * Passt der Hinweis unter dieses Element, oder muss er nach oben aufklappen?
 * `huelle` ist das Element mit `position: relative`, in dem der Kasten steht.
 *
 * Seit 10.09.2026 benutzt auch `Tipp.tsx` diese Messung (Johannes: *„mouse over
 * über jeden Schalter, aber das schnelle und große"*) - ein Knopf in einer
 * Tabelle mit Rollbalken hätte seinen Hinweis sonst genauso abgeschnitten.
 */
export function passtUntenNicht(huelle: HTMLElement): boolean {
  const tip = kastenZu(huelle);
  if (!tip) return false;
  const grenze = schneidenderVorfahre(huelle);
  const unten = grenze ? grenze.getBoundingClientRect().bottom : window.innerHeight;
  const platzUnten = unten - huelle.getBoundingClientRect().bottom;
  // 8 px Luft für den Abstand `mt-1` und den Rahmen.
  return tip.offsetHeight + 8 > platzUnten;
}

export type Seite = "links" | "rechts";

/**
 * An welcher Seite der Hinweis andockt, damit er seitlich im Bild bleibt -
 * das Gegenstück zu `passtUntenNicht` für links/rechts (siehe Kopf der Datei).
 *
 * „links" heisst: linke Kanten bündig, der Kasten läuft nach rechts über;
 * „rechts" umgekehrt. `vorgabe` ist die Seite, die der Aufrufer gewählt hat;
 * sie gilt, solange sie passt. Gemessen wird am nächsten schneidenden
 * Vorfahren, sonst am Dokument (`clientWidth`, ohne den senkrechten
 * Rollbalken - `innerWidth` zählte ihn mit).
 *
 * In jsdom ist jedes Mass null: Dann passt es nirgends, beide Seiten haben
 * gleich viel (keinen) Platz, und es bleibt bei der Vorgabe - ein Test, der
 * dort `right-0` erwartet, weil er es gesetzt hat, bleibt darum grün.
 */
export function seiteMitPlatz(huelle: HTMLElement, vorgabe: Seite): Seite {
  return lageMitPlatz(huelle, vorgabe).seite;
}

export interface Lage {
  seite: Seite;
  /**
   * Nur gesetzt, wenn der Kasten an KEINER Seite ganz hineinpasst: die
   * Breite, die an der gewählten Seite noch frei ist (mindestens 120 px,
   * darunter würde ein Satz zu Buchstabensalat). Der Kasten bricht dann
   * öfter um, statt über den Rand zu ragen.
   */
  maxBreite: number | null;
}

/** Seite UND Breitenkappung - `seiteMitPlatz` ist die kurze Form davon. */
export function lageMitPlatz(huelle: HTMLElement, vorgabe: Seite): Lage {
  const tip = kastenZu(huelle);
  if (!tip) return { seite: vorgabe, maxBreite: null };
  const grenze = schneidenderVorfahre(huelle);
  const g = grenze
    ? grenze.getBoundingClientRect()
    : { left: 0, right: document.documentElement.clientWidth };
  const h = huelle.getBoundingClientRect();
  // 8 px Luft wie bei `passtUntenNicht`: Rahmen und Schatten.
  const luft = 8;
  const breite = tip.offsetWidth + luft;
  const platz: Record<Seite, number> = { links: g.right - h.left, rechts: h.right - g.left };
  const andere: Seite = vorgabe === "links" ? "rechts" : "links";
  if (platz[vorgabe] >= breite) return { seite: vorgabe, maxBreite: null };
  if (platz[andere] >= breite) return { seite: andere, maxBreite: null };
  const seite = platz[andere] > platz[vorgabe] ? andere : vorgabe;
  // jsdom: alles null - dann keine Kappung, sonst würde jeder Test 120 px sehen.
  if (platz[seite] <= 0) return { seite, maxBreite: null };
  return { seite, maxBreite: Math.max(120, Math.floor(platz[seite] - luft)) };
}

/**
 * ★★ 28.09.2026: Kam der Fokus von der TASTATUR? Johannes: *„mouse over muss
 * wieder verschwinden, wenn du die Maus wegfährst"* - betrifft alle Apps.
 *
 * Ein Mausklick gibt einem Knopf ebenfalls den Fokus. Wer den Hinweis bei
 * jedem Fokus zeigt, lässt ihn nach einem Klick stehen, bis man woanders
 * hinklickt - das Wegfahren der Maus ändert daran nichts. `:focus-visible`
 * ist genau die Unterscheidung des Browsers: wahr nach Tab, falsch nach
 * Klick. Ohne `:focus-visible` (alter Browser) zählt jeder Fokus, wie bisher.
 */
export function fokusIstSichtbar(el: EventTarget | null): boolean {
  if (!(el instanceof Element)) return true;
  try {
    return el.matches(":focus-visible");
  } catch {
    return true;
  }
}

/**
 * ★★ 28.09.2026: Sicherheitsnetz, falls `mouseleave` ausbleibt.
 *
 * Reacts `onMouseLeave` folgt dem REACT-Baum, nicht dem Bildschirm: Öffnet ein
 * Knopf ein Fenster per Portal, liegt das Fenster für React IM Knopf - die Maus
 * kann über das ganze Fenster wandern, ohne dass der Knopf je „verlassen" wird.
 * Ebenso bleibt das Ereignis aus, wenn der Anker unter der stehenden Maus
 * wegrutscht. Darum: solange der Hinweis über den Zeiger offen ist, bei jeder
 * Mausbewegung nachsehen, ob der Zeiger im DOM noch im Anker steht. Der
 * Horcher hängt nur, solange `zeiger` wahr ist.
 */
export function useZeigerWeg(
  zeiger: boolean,
  huelle: { current: HTMLElement | null },
  weg: () => void,
) {
  const wegRef = useRef(weg);
  wegRef.current = weg;
  useEffect(() => {
    if (!zeiger) return;
    const beiBewegung = (e: PointerEvent) => {
      const el = huelle.current;
      if (el && e.target instanceof Node && !el.contains(e.target)) wegRef.current();
    };
    document.addEventListener("pointermove", beiBewegung, true);
    return () => document.removeEventListener("pointermove", beiBewegung, true);
  }, [zeiger, huelle]);
}

export function useZeigerhinweis(
  hilfe: string | undefined,
  ausrichtung: Seite = "links",
  /** Solange wahr, schliesst das Sicherheitsnetz nicht (Spaltenkopf: Tastaturfokus). */
  gehalten?: { current: boolean },
) {
  const roh = useId();
  const id = `zeigerhinweis-${roh.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [zeiger, setZeiger] = useState(false);
  const [abgewiesen, setAbgewiesen] = useState(false);
  const [nachOben, setNachOben] = useState(false);
  // Die zuletzt gemessene Lage; vor der ersten Messung gilt die Vorgabe.
  const [lage, setLage] = useState<Lage | null>(null);
  const seite: Seite = lage?.seite ?? ausrichtung;
  const maxBreite = lage?.maxBreite ?? null;
  const huelle = useRef<HTMLSpanElement | null>(null);
  const offen = !!hilfe && zeiger && !abgewiesen;

  useEffect(() => {
    if (!zeiger) setAbgewiesen(false);
  }, [zeiger]);

  useZeigerWeg(zeiger, huelle, () => {
    if (!gehalten?.current) setZeiger(false);
  });

  useEffect(() => {
    if (!offen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbgewiesen(true);
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [offen]);

  /**
   * Beim Betreten messen, ob der Hinweis unten hinpasst.
   *
   * ⚠️ Der Kasten steht IMMER im Baum (nur unsichtbar geschaltet) - er lässt
   * sich also messen, ohne ihn vorher zu zeigen. Genau dafür ist
   * `visibility: hidden` statt `display: none` gewählt.
   */
  const messen = useCallback(() => {
    const el = huelle.current;
    if (!el) return;
    setNachOben(passtUntenNicht(el));
    setLage(lageMitPlatz(el, ausrichtung));
  }, [ausrichtung]);

  const betreten = useCallback(() => {
    messen();
    setZeiger(true);
  }, [messen]);

  return { id, offen, nachOben, seite, maxBreite, huelle, setZeiger, betreten };
}

/**
 * ★ Eine FLÄCHE mit Hinweis beim Überfahren - für Kästchen, die selbst ein
 * Listeneintrag oder eine Anzeige sind (10.09.2026, Johannes: *„mouse over …
 * aber das schnelle und große, kontrolliere das auf jeder Seite"*). Bis dahin
 * trugen die Tasten- und Lektions-Kästchen der Klassenstatistik einen `title` -
 * langsam und winzig.
 *
 * Anders als `Erklaert` legt sie keine Hülle UM das Element, sondern IST es:
 * Ein Listeneintrag in einer zusätzlichen Hülle wäre kein Listeneintrag mehr.
 * Kein Tabstopp und keine Unterlinie. Der Hinweis ist `aria-hidden`: Diese
 * Kästchen tragen ihren Inhalt ohnehin als Text für die Sprachausgabe, ein
 * zweites Vorlesen desselben Satzes wäre auf der Braillezeile nur Lärm.
 */
export function Hinweisflaeche({
  hilfe,
  className = "",
  ausrichtung = "links",
  children,
  ...rest
}: {
  hilfe: string;
  className?: string;
  ausrichtung?: "links" | "rechts";
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLSpanElement>, "className" | "children">) {
  const { id, offen, nachOben, seite, maxBreite, huelle, setZeiger, betreten } =
    useZeigerhinweis(hilfe, ausrichtung);
  return (
    <span
      {...rest}
      ref={huelle}
      className={"relative " + className}
      onMouseEnter={betreten}
      onMouseLeave={() => setZeiger(false)}
    >
      {children}
      <span aria-hidden="true">
        <Hinweiskasten
          id={id}
          offen={offen}
          ausrichtung={seite}
          nachOben={nachOben}
          maxBreite={maxBreite}
          ohneBreiteWennZu
        >
          {hilfe}
        </Hinweiskasten>
      </span>
    </span>
  );
}


/** Ein Rechteck wie aus `getBoundingClientRect` - nur, was die Rechnung braucht. */
export interface Rechteck {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface HinweisPlatz {
  /** Linke Kante des Kastens im Fenster (`position: fixed`). */
  links: number;
  /** Oberkante des Kastens im Fenster. */
  oben: number;
  /** An welcher Kante des Ankers er tatsächlich bündig steht. */
  seite: Seite;
  /** Ob er tatsächlich über dem Anker steht. */
  nachOben: boolean;
}

function klemme(wert: number, min: number, max: number): number {
  // Breiter als der Platz (sollte wegen der Breitenkappung nie vorkommen):
  // dann an den linken/oberen Rand - der Anfang des Satzes bleibt lesbar.
  if (max < min) return min;
  return Math.max(min, Math.min(wert, max));
}

/**
 * ★ K1: WO DER KASTEN IM FENSTER STEHT - reine Rechnung, ohne DOM (darum
 * in jsdom prüfbar, `tests/tipp-immer-oben.test.tsx`).
 *
 * Waagrecht: an der gewünschten Kante des Ankers bündig („links" = linke
 * Kanten, der Kasten läuft nach rechts; „rechts" umgekehrt). Ragt er dort
 * aus dem Fenster (mit `rand` Luft), die andere Kante; passt auch die nicht,
 * wird er an der gewünschten Kante ins Fenster GEKLEMMT - er rückt so weit
 * herein, wie nötig. Nie aus dem Bild, nie über `rand` hinaus.
 *
 * Senkrecht: `nachOben` ist die Vorgabe des Aufrufers (`passtUntenNicht`).
 * Passt der Kasten dort nicht ins Fenster, die andere Richtung; passt er
 * nirgends, die Richtung mit mehr Platz, und - solange der Anker selbst im
 * Bild ist - ins Fenster geklemmt. Ist der Anker weggerollt, geht der Kasten
 * mit ihm (sonst klebte ein Hinweis am Fensterrand, dessen Knopf niemand
 * mehr sieht).
 */
export function platziereHinweis(o: {
  anker: Rechteck;
  kasten: { breite: number; hoehe: number };
  fenster: { breite: number; hoehe: number };
  ausrichtung: Seite;
  nachOben: boolean;
  rand?: number;
  abstand?: number;
}): HinweisPlatz {
  const rand = o.rand ?? HINWEIS_RAND;
  const abstand = o.abstand ?? HINWEIS_ABSTAND;
  const { anker, kasten, fenster } = o;

  const xBei = (s: Seite) => (s === "links" ? anker.left : anker.right - kasten.breite);
  const passtX = (x: number) => x >= rand && x + kasten.breite <= fenster.breite - rand;
  const andere: Seite = o.ausrichtung === "links" ? "rechts" : "links";
  let seite: Seite = o.ausrichtung;
  let links = xBei(seite);
  if (!passtX(links)) {
    if (passtX(xBei(andere))) {
      seite = andere;
      links = xBei(andere);
    } else {
      links = klemme(links, rand, fenster.breite - rand - kasten.breite);
    }
  }

  const yUnten = anker.bottom + abstand;
  const yOben = anker.top - abstand - kasten.hoehe;
  const passtUnten = yUnten + kasten.hoehe <= fenster.hoehe - rand;
  const passtOben = yOben >= rand;
  let nachOben = o.nachOben;
  if (!(nachOben ? passtOben : passtUnten)) {
    if (nachOben ? passtUnten : passtOben) nachOben = !nachOben;
    else nachOben = anker.top - rand > fenster.hoehe - rand - anker.bottom;
  }
  let oben = nachOben ? yOben : yUnten;
  const ankerImBild = anker.bottom > 0 && anker.top < fenster.hoehe;
  if (!passtUnten && !passtOben && ankerImBild) {
    oben = klemme(oben, rand, fenster.hoehe - rand - kasten.hoehe);
  }
  return { links: Math.round(links), oben: Math.round(oben), seite, nachOben };
}

/**
 * ★ WO DER KASTEN AUFGEHT (Johannes, 30.09.2026: „bei den mouse over einen
 * Effekt wie bei Google Mail, dass das Fenster von der Mausspitze aufgeht,
 * auch das hilft dem visuellen Verständnis").
 *
 * Der Kasten wächst aus einem Punkt auf - er ist sein `transform-origin`, in
 * Pixeln des Kastens (darf ausserhalb liegen: der Kasten steht UNTER dem
 * Knopf, die Mausspitze darauf). Das Auge folgt dem Aufgehen und weiss, zu
 * welchem Knopf der Hinweis gehört.
 *  · Steht die Maus auf dem Anker: aus der Mausspitze.
 *  · Sonst (Tastatur-Fokus, oder die Maus ist woanders): aus der Mitte des
 *    Ankers, an der Kante, die ihm zugewandt ist.
 */
export function aufgehPunkt(o: {
  zeiger: { x: number; y: number } | null;
  anker: Rechteck;
  platz: Pick<HinweisPlatz, "links" | "oben" | "nachOben">;
  kastenHoehe: number;
}): { x: number; y: number } {
  const { zeiger, anker, platz } = o;
  const aufAnker = !!zeiger
    && zeiger.x >= anker.left - 1 && zeiger.x <= anker.right + 1
    && zeiger.y >= anker.top - 1 && zeiger.y <= anker.bottom + 1;
  if (aufAnker && zeiger) {
    return { x: Math.round(zeiger.x - platz.links), y: Math.round(zeiger.y - platz.oben) };
  }
  return {
    x: Math.round((anker.left + anker.right) / 2 - platz.links),
    y: platz.nachOben ? Math.round(o.kastenHoehe) : 0,
  };
}

/**
 * ★ EINE Gestalt für jeden Hinweis der Plattform - `Hinweiskasten` UND der
 * `TitelHinweis`, der die alten `title` übernimmt. Wer hier etwas ändert,
 * ändert jeden Hinweis auf jeder Seite.
 */
export const HINWEIS_GESTALT =
  "pointer-events-none fixed left-0 top-0 z-[45] w-max max-w-80 whitespace-normal " +
  "rounded-lg border border-hairline bg-surface-raised px-3 py-2 " +
  "text-sm font-normal normal-case text-ink shadow-lg " +
  "transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none ";
export const HINWEIS_OFFEN = "visible scale-100 opacity-100";
export const HINWEIS_ZU = "invisible scale-75 opacity-0";

/**
 * Wo die Maus zuletzt war - EIN Horcher für alle Kästen, angehängt beim
 * ersten Kasten. Nur Maus und Stift: Ein Finger hinterlässt keine Spitze,
 * über der etwas aufgehen könnte.
 */
let zeigerPunkt: { x: number; y: number } | null = null;
/** Wo die Maus zuletzt war - für Kästen, die nicht über `Hinweiskasten` laufen (`TitelHinweis`). */
export function letzterZeiger(): { x: number; y: number } | null {
  return zeigerPunkt;
}
let zeigerHorcht = false;
export function horcheZeiger(): void {
  if (zeigerHorcht || typeof document === "undefined") return;
  zeigerHorcht = true;
  const merke = (e: PointerEvent | MouseEvent) => {
    const art = (e as PointerEvent).pointerType;
    if (art && art !== "mouse" && art !== "pen") return;
    zeigerPunkt = { x: e.clientX, y: e.clientY };
  };
  document.addEventListener("pointermove", merke, { capture: true, passive: true });
  document.addEventListener("mouseover", merke, { capture: true, passive: true });
}

/**
 * Die Breite, die ein Kasten höchstens haben darf: `max-w-80` (20 rem, bei
 * vergrösserter Schrift entsprechend mehr), schmaler, wenn der Aufrufer
 * gekappt hat (`maxBreite`), und nie breiter als das Fenster minus Rand.
 */
export function hoechstBreite(o: {
  fensterBreite: number;
  remPx: number;
  maxBreite: number | null;
  rand?: number;
}): number {
  const rand = o.rand ?? HINWEIS_RAND;
  const soll = o.maxBreite ?? 20 * o.remPx;
  return Math.max(0, Math.min(soll, o.fensterBreite - 2 * rand));
}

/**
 * Der Anker: das Element, an dem der Kasten bisher `absolute` hing - der
 * nächste Vorfahre der Marke mit einer Lage (`relative`, …). Bei
 * `Hinweisflaeche` liegt dazwischen die `aria-hidden`-Hülle, darum nicht
 * einfach `parentElement`. In jsdom (keine Stilregeln) bleibt es beim
 * Elternelement.
 */
function ankerVon(marke: HTMLElement): HTMLElement | null {
  let p = marke.parentElement;
  while (p && p !== document.body) {
    const lage = getComputedStyle(p).position;
    if (lage && lage !== "static") return p;
    p = p.parentElement;
  }
  return marke.parentElement;
}

/**
 * Die Ebene, über der der Kasten liegen muss (Kopf dieser Datei,
 * „Stapelordnung"): der `z-index` des ÄUSSERSTEN Vorfahren, der einen hat -
 * er bestimmt, wo der Anker in der Stapelordnung der Wurzel steht. Ein Tipp
 * im Fenster (`Modal.tsx`, `fixed z-50`) ergibt 51; ein Tipp in der
 * Kopfzeile (`sticky z-40`) oder im Tabellenkopf (`z-30`) bleibt bei
 * `HINWEIS_EBENE`.
 */
export function ebeneUeber(anker: HTMLElement): number {
  let aeusserste = 0;
  let p: HTMLElement | null = anker;
  while (p && p !== document.body && p !== document.documentElement) {
    const s = getComputedStyle(p);
    if (s.position && s.position !== "static" && s.zIndex && s.zIndex !== "auto") {
      const z = parseInt(s.zIndex, 10);
      if (!Number.isNaN(z)) aeusserste = z;
    }
    p = p.parentElement;
  }
  return Math.max(HINWEIS_EBENE, aeusserste + 1);
}

/**
 * Der Hinweis-Kasten selbst.
 *
 * ★ K1 (19.09.2026, Kopf dieser Datei): Er wird per Portal in die Ebene unter
 * `<body>` gehängt und `fixed` an seinen Anker gesetzt. Am Ort steht nur die
 * Marke; der Anker ist wie bisher das nächste Element mit `position:
 * relative` - das setzt die Hülle, die ihn benutzt.
 */
export function Hinweiskasten({
  id,
  offen,
  ausrichtung = "links",
  nachOben = false,
  maxBreite = null,
  children,
}: {
  id: string;
  offen: boolean;
  /** Nach oben aufklappen, weil unten kein Platz ist (siehe Kopf dieser Datei). */
  nachOben?: boolean;
  /**
   * Wo der Hinweis andockt. „links" (Vorgabe) läuft nach rechts über - richtig
   * für alles ausser der letzten Spalte. „rechts" für die Spalten am rechten
   * Rand, wo ein linksbündiger Hinweis aus dem Bild liefe. Wer die Seite
   * MESSEN will, gibt `seite` aus `useZeigerhinweis` herein. Seit K1 die
   * Vorgabe: passt sie nicht ins Fenster, entscheidet `platziereHinweis`.
   */
  ausrichtung?: Seite;
  /**
   * Zugeklappt keine Breite beitragen (Kopf dieser Datei, „ZU"). ⚠️ Seit K1
   * ohne Wirkung und nur noch angenommen, damit die Aufrufer unverändert
   * bleiben: Der `fixed`-Kasten unter `<body>` trägt IMMER keine Breite bei.
   */
  ohneBreiteWennZu?: boolean;
  /** Schmaler als `max-w-80`, weil an keiner Seite mehr Platz ist (`lageMitPlatz`). */
  maxBreite?: number | null;
  children: ReactNode;
}) {
  const markeRef = useRef<HTMLSpanElement>(null);
  const kastenRef = useRef<HTMLSpanElement>(null);
  const ebene = hinweisEbene();
  useEffect(horcheZeiger, []);

  const platzieren = useCallback(() => {
    const marke = markeRef.current;
    const kasten = kastenRef.current;
    if (!marke || !kasten) return;
    const anker = ankerVon(marke);
    if (!anker) return;
    const wurzel = document.documentElement;
    // `clientWidth`: ohne den senkrechten Rollbalken (`innerWidth` zählte ihn
    // mit). In jsdom ist er 0 - dann das Fenster.
    const fenster = {
      breite: wurzel.clientWidth || window.innerWidth,
      hoehe: wurzel.clientHeight || window.innerHeight,
    };
    const remPx = parseFloat(getComputedStyle(wurzel).fontSize) || 16;
    kasten.style.maxWidth = `${hoechstBreite({ fensterBreite: fenster.breite, remPx, maxBreite })}px`;
    // Der Hinweis stand bisher im Fluss seines Ankers und erbte dessen
    // Ausrichtung - in den (mittigen) Tabellenköpfen stand er mittig. So bleibt es.
    kasten.style.textAlign = getComputedStyle(anker).textAlign;
    kasten.style.zIndex = String(ebeneUeber(anker));
    const platz = platziereHinweis({
      anker: anker.getBoundingClientRect(),
      kasten: { breite: kasten.offsetWidth, hoehe: kasten.offsetHeight },
      fenster,
      ausrichtung,
      nachOben,
    });
    kasten.style.left = `${platz.links}px`;
    kasten.style.top = `${platz.oben}px`;
    const punkt = aufgehPunkt({
      zeiger: zeigerPunkt,
      anker: anker.getBoundingClientRect(),
      platz,
      kastenHoehe: kasten.offsetHeight,
    });
    kasten.style.transformOrigin = `${punkt.x}px ${punkt.y}px`;
    kasten.dataset.seite = platz.seite;
    kasten.dataset.oben = platz.nachOben ? "ja" : "nein";
  }, [ausrichtung, nachOben, maxBreite]);

  /*
    Nach JEDEM Rendern (kein Abhängigkeitsfeld, mit Absicht):
    · offen → neu setzen, bevor der Browser malt (`useLayoutEffect`) - der
      Text kann sich geändert haben, und ein Kasten, der erst am alten Ort
      aufblitzt, wäre ein Flackern.
    · zu → die Kappung zurücknehmen: `lageMitPlatz` misst den ZUGEKLAPPTEN
      Kasten und soll seine natürliche Breite sehen, nicht die vom letzten Mal.
    · Was der Kasten am alten Ort geerbt hätte und nicht über Klassen
      mitbringt: `aria-hidden` (die `Hinweisflaeche` hüllt ihn darin ein - am
      Ort hätte das auch den Kasten verborgen) und die Sprache (`lang` einer
      englischen Fusszeile oder eines Menüs, sonst läse die Sprachausgabe den
      Satz mit der Stimme der Seite).
  */
  useLayoutEffect(() => {
    const marke = markeRef.current;
    const kasten = kastenRef.current;
    if (!marke || !kasten) return;
    // Nur schreiben, was sich ändert: Die Übungsseite rendert bei jedem
    // Anschlag neu, und jedes gesetzte Attribut ist Arbeit für den Browser.
    const setze = (name: string, wert: string | null) => {
      if (kasten.getAttribute(name) === wert) return;
      if (wert === null) kasten.removeAttribute(name);
      else kasten.setAttribute(name, wert);
    };
    setze("aria-hidden", marke.closest('[aria-hidden="true"]') ? "true" : null);
    // Nur ein `lang` UNTERHALB von <html> wird mitgenommen: Das von <html>
    // erbt der Kasten ohnehin, und ein ausdrücklich gesetztes `lang="de"`
    // eines Bereichs (der Sprachschalter „Deutsch") muss ausdrücklich bleiben.
    const bereich = marke.parentElement?.closest("[lang]") ?? null;
    setze("lang", bereich && bereich !== document.documentElement ? bereich.getAttribute("lang") : null);
    if (offen) platzieren();
    else if (kasten.style.maxWidth) kasten.style.maxWidth = "";
  });

  /*
    Solange er offen ist, folgt er dem Anker: beim Rollen der Seite UND jedes
    Rollkastens (`scroll` steigt nicht auf - in der ABFANGPHASE am Fenster
    hört man trotzdem jeden) und bei jeder Grössenänderung. `passive`: Die
    Horcher verhindern nie das Rollen. Zu → abgehängt, es horcht nichts.
  */
  useEffect(() => {
    if (!offen) return;
    const nachziehen = () => platzieren();
    window.addEventListener("scroll", nachziehen, { capture: true, passive: true });
    window.addEventListener("resize", nachziehen, { passive: true });
    return () => {
      window.removeEventListener("scroll", nachziehen, { capture: true });
      window.removeEventListener("resize", nachziehen);
    };
  }, [offen, platzieren]);

  const kasten = (
    <span
      ref={kastenRef}
      id={id}
      role="tooltip"
      data-hinweis-kasten=""
      data-ausrichtung={ausrichtung}
      className={
        // „groß": Fließtextgröße statt der Winzschrift des `title`, und breit
        // genug für einen ganzen Satz.
        // `pointer-events-none`: Ein Hinweis darf nie den Knopf daneben
        // verdecken und schlucken, auf den man als Nächstes zeigt.
        // `fixed left-0 top-0`: der Platz, bis `platzieren` ihn beim Öffnen
        // setzt; zugeklappt ist er unsichtbar und trägt keine Breite bei.
        HINWEIS_GESTALT +
        // „schnell": keine Verzögerung. Aufgehen aus der Mausspitze
        // (`aufgehPunkt`, Johannes 30.09.2026): von drei Vierteln auf volle
        // Grösse, 150 ms. Zu geht er sofort (`invisible` wechselt ohne
        // Übergang). Wer „weniger Bewegung" eingestellt hat, bekommt ihn ohne
        // Aufgehen (WCAG 2.3.3; dazu die globale Regel in `index.css`).
        (offen ? HINWEIS_OFFEN : HINWEIS_ZU)
      }
    >
      {children}
    </span>
  );
  return (
    <>
      {/* Die Marke am Ort: Über sie finden Anker, Messung und Wächter den
          Kasten. `hidden` - sie nimmt keinen Platz ein und steht in keinem
          Lesefluss. */}
      <span ref={markeRef} data-hinweis-anker={id} hidden />
      {ebene ? createPortal(kasten, ebene) : kasten}
    </>
  );
}
