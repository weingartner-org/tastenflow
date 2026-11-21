/**
 * ★★★ STRUKTUR-FINGERABDRUCK - für den Vergleich „ist die MECHANIK auf Weg
 * ‚de' und Weg ‚en' dieselbe, nur Sprache/Inhalt anders?" (Nachtlauf 24.09.2026,
 * `BEFUND-2026-09-24-MECHANIK-DEUTSCH-ENGLISCH.md`).
 *
 * Anders als `tests/helfer/deutschFaenger.ts` (der nach DEUTSCHEN WÖRTERN in
 * einer eigentlich englischen Umgebung sucht) geht es hier um die FORM: Tags,
 * Rollen, ARIA-Zustände, Tastenwege, Live-Regionen, `disabled`, Tipp-Hinweise -
 * alles, was für Braillezeile, Screenreader und Tastatur zählt. Der TEXT wird
 * bewusst nirgends verglichen (er ist ja Inhalt/Übersetzung).
 *
 * ── DIE DREI ENTSCHEIDUNGEN, DIE DAS ERGEBNIS LESBAR MACHEN ─────────────────
 *
 * 1. **Text- und Id-Werte werden durch Platzhalter ersetzt, ihre BLOSSE
 *    ANWESENHEIT bleibt sichtbar.** `aria-label`, `title`, `alt` … sind
 *    Übersetzungen - ihr Wortlaut ist erwartet verschieden, ihr Fehlen wäre
 *    ein Fund. `id`/`aria-describedby`/… tragen `useId()`-Werte, die von der
 *    Position im Baum abhängen, nicht vom Inhalt - sie werden je Durchlauf neu
 *    durchnummeriert (»id1«, »id2«, …), damit zwei strukturell gleiche Bäume
 *    dieselbe Nummerierung bekommen, auch wenn Reacts echte Zähler
 *    auseinanderlaufen.
 * 2. **`aria-hidden="true"`-Teilbäume werden NICHT weiter abgestiegen.** Diese
 *    App versteckt das rein optische Overlay (farbige Buchstaben-Kette in
 *    `TypingSession.tsx`, „Rein optisches Overlay … MUSS vor Screenreader/
 *    Braillezeile verborgen sein") ausdrücklich vor Screenreader und
 *    Braillezeile - für die MECHANIK zählt nur, was ein Screenreader sieht.
 *    Genau das löst auch das Problem, dass deutsche und englische Wörter
 *    verschieden lang sind und sonst verschieden viele Zeichen-`<span>`s
 *    erzeugten: Der zugängliche Inhalt kommt aus dem `<textarea>` darunter,
 *    das IMMER genau ein Element ist, gleich lang der Text auch ist.
 * 3. **`class`/`style` zählen nicht.** Farbe, Abstand, Umbruch sind Aussehen,
 *    keine Mechanik - und Klassen wie `text-success` hängen ohnehin oft am
 *    ZEICHEN-INDEX, der bei verschiedener Textlänge verschieden ist.
 *
 * Was NICHT hier hineingehört: ob etwas rein optisch gut aussieht (Umbruch,
 * Abstand, Fokus-Ring-Farbe) - jsdom rechnet kein Layout, siehe die Hinweise
 * im Befund.
 */
import { expect } from "vitest";

/** Attribute, deren WERT Text/Übersetzung ist - nur ihre Anwesenheit zählt. */
const TEXT_WERT_ATTRIBUTE = new Set([
  "aria-label",
  "aria-description",
  "aria-roledescription",
  "aria-placeholder",
  "aria-valuetext",
  "title",
  "alt",
  "placeholder",
]);

/** Attribute, deren Wert eine (oder mehrere) `id`s referenziert. */
const ID_LISTEN_ATTRIBUTE = new Set([
  "id",
  "for",
  "htmlFor",
  "list",
  "aria-describedby",
  "aria-labelledby",
  "aria-owns",
  "aria-controls",
  "aria-activedescendant",
  "aria-details",
  "aria-errormessage",
  "aria-flowto",
  // `Tipp`/`Zeigerhinweis` tragen denselben `useId()`-Wert auch hier - ohne
  // Umnummerierung wäre das eine falsche Abweichung (verschiedene React-Zähler).
  "data-hinweis-anker",
]);

/** Nie strukturell relevant - reines Aussehen oder React-Interna. */
function relevantesAttribut(name: string): boolean {
  if (name === "class" || name === "style") return false;
  if (name.startsWith("on")) return false;
  if (name === "value") return false; // Feldinhalt - siehe Sonderbehandlung der Formelemente unten
  return true;
}

/** Ersetzt jede `id` (roh) im Durchlauf durch eine neue, durchgezählte Marke. */
function neueMarke(roh: string, karte: Map<string, string>): string {
  let marke = karte.get(roh);
  if (!marke) {
    marke = `id${karte.size + 1}`;
    karte.set(roh, marke);
  }
  return marke;
}

function idListenWert(roh: string, karte: Map<string, string>): string {
  const teile = roh.split(/\s+/).filter(Boolean);
  if (!teile.length) return "";
  return teile.map((t) => neueMarke(t, karte)).join(" ");
}

/**
 * React vergibt `useId()`-Werte in der Form `:r9:`/`:r2b:` - auch dort, wo sie
 * NICHT über `id`/`aria-*` laufen, sondern z. B. als `name` einer Radio-Gruppe
 * (`KlassenEinstellungsFelder.tsx`: `name={useId()}`). Ihr WERT hängt an der
 * Position im Hook-Baum: Ein einziges zusätzliches Bauteil VOR dieser Stelle
 * (wie das Schreibweise-Feld nur auf Weg „en") verschiebt jeden folgenden
 * Zähler - eine Abweichung, die nichts mit der Mechanik zu tun hat. Erkannt
 * wird darum am MUSTER, nicht an der Attribut-Liste.
 */
const REACT_ID_MUSTER = /^:[a-z0-9]+:$/i;

function attributWert(name: string, roh: string, karte: Map<string, string>): string {
  if (TEXT_WERT_ATTRIBUTE.has(name)) return roh ? "•" : "";
  if (name === "lang") return roh ? "‹sprache›" : "";
  if (ID_LISTEN_ATTRIBUTE.has(name) || REACT_ID_MUSTER.test(roh)) return idListenWert(roh, karte);
  return roh;
}

/** Eine Zeile für ein Element: Tag, sortierte Attribute, Formular-Eigenarten. */
function beschreibeElement(el: Element, karte: Map<string, string>): string {
  const stuecke: string[] = [el.tagName.toLowerCase()];
  const namen = Array.from(el.attributes)
    .map((a) => a.name)
    .filter(relevantesAttribut)
    .sort((a, b) => a.localeCompare(b));
  for (const name of namen) {
    const wert = attributWert(name, el.getAttribute(name) ?? "", karte);
    stuecke.push(wert === "" ? name : `${name}=${wert}`);
  }
  // Formular-Eigenarten stehen oft nur als IDL-Eigenschaft (React setzt sie so),
  // nicht als HTML-Attribut - darum eigens gelesen, nicht aus `el.attributes`.
  if (el instanceof HTMLInputElement) {
    stuecke.push(`ktyp=${el.type}`);
    if (el.type === "checkbox" || el.type === "radio") stuecke.push(`markiert=${el.checked}`);
    if (el.disabled) stuecke.push("GESPERRT");
    if (el.readOnly) stuecke.push("nurLesen");
    if (el.required) stuecke.push("pflicht");
  } else if (el instanceof HTMLTextAreaElement) {
    stuecke.push("mehrzeilig=true", `zeilen=${el.rows}`, `umbruch=${el.wrap || "soft"}`);
    if (el.disabled) stuecke.push("GESPERRT");
    if (el.readOnly) stuecke.push("nurLesen");
  } else if (el instanceof HTMLSelectElement) {
    stuecke.push(`mehrfach=${el.multiple}`);
    if (el.disabled) stuecke.push("GESPERRT");
  } else if (el instanceof HTMLButtonElement) {
    stuecke.push(`ktyp=${el.type}`);
    if (el.disabled) stuecke.push("GESPERRT");
  } else if ((el as HTMLElement).isContentEditable) {
    stuecke.push("mehrzeilig=contenteditable");
  }
  return stuecke.join(" ");
}

function geheAb(el: Element, tiefe: number, karte: Map<string, string>, zeilen: string[]): void {
  const tag = el.tagName;
  if (tag === "SCRIPT" || tag === "STYLE") return;
  const versteckt = el.getAttribute("aria-hidden") === "true";
  zeilen.push(
    "  ".repeat(tiefe) + beschreibeElement(el, karte) + (versteckt ? " [Inhalt für AT verborgen]" : ""),
  );
  if (versteckt) return; // Screenreader/Braillezeile steigen hier nicht ab - wir auch nicht
  for (const kind of Array.from(el.children)) geheAb(kind, tiefe + 1, karte, zeilen);
}

/**
 * Ist dieses Element NUR eine Hülle für Tipp-Hinweise (`Hinweiskasten`,
 * `role="tooltip"`)? Diese Portale hängen als eigenständige Geschwister
 * unter `<body>`, unabhängig vom eigentlichen Baum - IN WELCHER REIHENFOLGE
 * der Browser sie einhängt, hängt vom Zufall der Portal-Einhänge-Reihenfolge
 * ab, nicht von der Mechanik. Ohne diese Erkennung würde ein Lauf, bei dem
 * das Portal vor dem Inhalt steht, als „Struktur anders" gemeldet, obwohl
 * beide Bäume identisch sind (gemessen 24.09.2026 am Praxis-Bildschirm).
 */
function istReineTippHuelle(el: Element): boolean {
  return el.children.length > 0 && Array.from(el.children).every((k) => k.getAttribute("role") === "tooltip");
}

/**
 * Der Struktur-Fingerabdruck eines Teilbaums (Vorgabe: der ganze `<body>`,
 * damit auch Portale - Tipp-Hinweise, Fenster - erfasst sind).
 *
 * Die direkten Geschwister der Wurzel werden VOR dem Ablaufen in eine
 * feste Reihenfolge gebracht (echter Inhalt zuerst, reine Tipp-Portale
 * zuletzt) - sonst hinge die Id-Umnummerierung (`neueMarke`) an der
 * zufälligen Portal-Reihenfolge und träfe beide Wege verschieden, obwohl
 * ihre Referenzen (`aria-describedby` ↔ `id`) dieselben sind.
 */
export function strukturAbdruck(wurzel: Element | Document = document.body): string {
  const start: Element = wurzel instanceof Document ? (wurzel.body as Element) : wurzel;
  const karte = new Map<string, string>();
  const zeilen: string[] = [];
  const geordnet = Array.from(start.children).sort(
    (a, b) => Number(istReineTippHuelle(a)) - Number(istReineTippHuelle(b)),
  );
  for (const kind of geordnet) geheAb(kind, 0, karte, zeilen);
  return zeilen.join("\n");
}

/** Vergleicht zwei Fingerabdrücke - bei Abweichung zeigt vitest den vollen Zeilen-Diff. */
export function pruefeGleicheStruktur(deAbdruck: string, enAbdruck: string, meldung: string): void {
  expect(enAbdruck, meldung).toBe(deAbdruck);
}

/** R5: Nirgends darf `disabled` erscheinen. */
export function pruefeNichtsGesperrt(abdruck: string): void {
  expect(abdruck).not.toMatch(/\bGESPERRT\b/);
}

/** Wie viele Tipp-Hinweise (`role="tooltip"`, siehe `components/Tipp.tsx`) im Baum stehen. */
export function zaehleTippHinweise(wurzel: ParentNode = document.body): number {
  return wurzel.querySelectorAll('[role="tooltip"]').length;
}

// ---------------------------------------------------------------------------
// Sprachausgabe: die FOLGE der Aufruf-Arten, ohne Wortlaut
// ---------------------------------------------------------------------------

export interface SprachAufruf {
  /** Welche Funktion aus `lib/typing/voice.ts` gerufen wurde. */
  quelle: "speakUi" | "speakUiAlways" | "speak";
  /** Die Ansage-Klasse ("sofort" | "ersetzbar" | "ereignis") - bei `speak` immer "-". */
  art: string;
}

interface MockMitAufrufen {
  mock: { calls: unknown[][]; invocationCallOrder: number[] };
}

/**
 * Baut aus den drei möglichen Spionen die FOLGE der Aufrufe, über alle drei
 * hinweg in echter Reihenfolge (`invocationCallOrder`) - der Wortlaut (immer
 * Argument 0) und die Sprache werden bewusst nicht mitgenommen.
 *
 * ⚠️ `speakUi(text, pitch?, art?, lang?)` und `speakUiAlways(text, pitch?,
 * lang?, art?)` tauschen die Stellen von `art` und `lang` - siehe die
 * Signaturen in `voice.ts`. Wer hier vertauscht, vergleicht eine Sprache
 * gegen eine Ansage-Klasse.
 */
export function sprachAufrufFolge(mocks: {
  speakUi?: MockMitAufrufen;
  speakUiAlways?: MockMitAufrufen;
  speak?: MockMitAufrufen;
}): SprachAufruf[] {
  const gesammelt: { reihenfolge: number; aufruf: SprachAufruf }[] = [];
  const speakUi = mocks.speakUi;
  if (speakUi) {
    speakUi.mock.calls.forEach((c, i) => {
      if (!String(c[0] ?? "")) return; // leerer Text - keine echte Ansage
      gesammelt.push({
        reihenfolge: speakUi.mock.invocationCallOrder[i],
        aufruf: { quelle: "speakUi", art: String(c[2] ?? "ersetzbar") },
      });
    });
  }
  const speakUiAlways = mocks.speakUiAlways;
  if (speakUiAlways) {
    speakUiAlways.mock.calls.forEach((c, i) => {
      if (!String(c[0] ?? "")) return;
      gesammelt.push({
        reihenfolge: speakUiAlways.mock.invocationCallOrder[i],
        aufruf: { quelle: "speakUiAlways", art: String(c[3] ?? "ereignis") },
      });
    });
  }
  const speak = mocks.speak;
  if (speak) {
    speak.mock.calls.forEach((c, i) => {
      if (!String(c[0] ?? "")) return;
      gesammelt.push({
        reihenfolge: speak.mock.invocationCallOrder[i],
        aufruf: { quelle: "speak", art: "-" },
      });
    });
  }
  gesammelt.sort((a, b) => a.reihenfolge - b.reihenfolge);
  return gesammelt.map((g) => g.aufruf);
}

/** Kurzform für den Vergleich: `"speakUi:sofort"`, `"speak:-"`, … */
export function sprachAufrufKurz(folge: SprachAufruf[]): string[] {
  return folge.map((a) => `${a.quelle}:${a.art}`);
}
