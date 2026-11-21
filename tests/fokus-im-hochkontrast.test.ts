/**
 * ★★★★★ WO MAN STEHT, MUSS MAN SEHEN - auch im Windows-Hochkontrastmodus.
 * ============================================================================
 * Johannes, 07.09.2026, im Unterricht:
 *
 * > „wir brauchen dickere textramen in der aktiven zelle/Schalter damit man
 * >  sieht wo man steht. im SW Kontrastmodus von Windows sieht man garnicht was
 * >  gerade aktiv ist. Diesen modus verwenden gerade viele kinder, der muss gut
 * >  bedienbar sein"
 *
 * ⚠️⚠️ WAS DER HOCHKONTRASTMODUS WEGNIMMT - und warum die App dort nichts zeigte:
 *   - Windows erzwingt ALLE Rahmenfarben. Ein Fokus, der nur `border-color`
 *     wechselt, ist unsichtbar. Genau das tat `.field-input`: `focus:border-accent`
 *     **und dazu `focus:outline-none`** - die Farbe war das einzige Zeichen, und
 *     das Betriebssystem nahm es weg.
 *   - `box-shadow` wird VOLLSTÄNDIG entfernt. Tailwinds `ring-*` ist ein
 *     `box-shadow` - jede `focus:outline-none focus-visible:ring-2`-Stelle ist
 *     dort ersatzlos blind. Am 07.09. gemessen: **81 solche Stellen** in `src/`.
 *   - `outline` bleibt - aber nur, wenn eine da ist.
 *
 * ★★★ Diese Proben lesen das Stilblatt, weil es in JSDOM keine Kaskade gibt,
 * die man messen könnte - dasselbe Vorgehen wie in
 * `seiten-uebergang-sperrt-kein-fixed.test.ts`.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const css = readFileSync(join(WURZEL, "src", "index.css"), "utf8");

/** Der Rumpf der ersten Regel, deren Auswahl `muster` enthält. */
function regel(muster: string): string {
  const i = css.indexOf(muster);
  expect(i, `Die Regel „${muster}" steht nicht mehr in index.css`).toBeGreaterThan(-1);
  const auf = css.indexOf("{", i);
  const zu = css.indexOf("}", auf);
  return css.slice(auf + 1, zu);
}

/** Alle `@media (forced-colors: active)`-Blöcke, aneinandergehängt. */
function hochkontrast(): string {
  const teile: string[] = [];
  const muster = /@media\s*\(forced-colors:\s*active\)\s*\{/g;
  let t: RegExpExecArray | null;
  while ((t = muster.exec(css))) {
    // Bis zur schliessenden Klammer des Blocks - Klammern werden mitgezählt.
    let tiefe = 1;
    let i = t.index + t[0].length;
    const start = i;
    while (i < css.length && tiefe > 0) {
      if (css[i] === "{") tiefe++;
      else if (css[i] === "}") tiefe--;
      i++;
    }
    teile.push(css.slice(start, i - 1));
  }
  expect(teile.length, "Es gibt keinen `forced-colors`-Block mehr").toBeGreaterThan(0);
  return teile.join("\n");
}

/**
 * ⚠️ OHNE KOMMENTARE MESSEN. Beim ersten Versuch schlug die Probe „fasst nicht
 * `[tabindex]`" an - auf meinem eigenen Kommentar, der genau das erklärt. Eine
 * Prüfung, die Prosa liest, misst die Begründung statt der Regel.
 */
function ohneKommentare(text: string): string {
  return text.replace(/\/\*[\s\S]*?\*\//g, "");
}

/**
 * ★★★★ ALLE Fokusregeln des Hochkontrastmodus, die einen Umriss SETZEN.
 *
 * ⚠️⚠️ HIER STAND „die erste Regel mit `!important`" - und dieser Griff ist am
 * 09.09.2026 falsch geworden, ohne dass sich an der Sache etwas geändert
 * hätte. An dem Abend kamen zwei weitere `!important`-Regeln in den Block
 * (die Arbeitsfläche `[role="application"]`, und das Tippfeld, das seinen
 * Umriss an die Karte abgibt). Seither las die Probe eine ANDERE Regel als die
 * gemeinte - und prüfte Aussagen über die allgemeine Fokusregel an einer
 * Regel, die nur für eine Arbeitsfläche gilt.
 *
 * ⇒ Gesucht wird jetzt über den INHALT, nicht über die Reihenfolge: jede Regel
 * des Blocks, deren Auswahl `:focus` enthält und die einen Umriss in
 * `Highlight` setzt. Das sind heute zwei; die Proben gelten für alle. Damit
 * trägt der Wächter auch die dritte, die morgen dazukommt.
 * ⚠️ `outline: none` fällt bewusst heraus - das ist der Fall des Tippfelds,
 * und den hält `fokus-waechter.test.ts` fest.
 */
function hcmFokusUmrisse(): { auswahl: string; rumpf: string }[] {
  const rein = ohneKommentare(hochkontrast());
  const raus: { auswahl: string; rumpf: string }[] = [];
  for (const t of rein.matchAll(/([^{}]*)\{([^{}]*)\}/g)) {
    const auswahl = t[1].trim();
    const rumpf = t[2];
    if (!/:focus/.test(auswahl)) continue;
    if (!/outline:\s*\d+(?:\.\d+)?px\s+solid\s+Highlight/.test(rumpf)) continue;
    raus.push({ auswahl, rumpf });
  }
  expect(raus.length, "Im `forced-colors`-Block setzt keine `:focus`-Regel mehr "
    + "einen Umriss in `Highlight`").toBeGreaterThan(0);
  return raus;
}

/** Die ALLGEMEINE davon - die, die die gewöhnlichen Bedienelemente fasst. */
function allgemeineHcmFokusregel(): { auswahl: string; rumpf: string } {
  const treffer = hcmFokusUmrisse().find((r) => /input:focus\b/.test(r.auswahl));
  expect(treffer, "Keine Regel im `forced-colors`-Block fasst `input:focus` - "
    + "dann hat ein Eingabefeld dort kein Fokuszeichen mehr").toBeTruthy();
  return treffer!;
}

describe("★★★★★ Der Fokusrahmen ist dick genug, um ihn zu sehen", () => {
  it("★★★★ mindestens 4px - auf einem 800% vergrösserten Blatt wäre weniger ein Haarstrich", () => {
    const rumpf = regel(':where(a, button, input, select, textarea, [tabindex], [role="button"]):focus-visible');
    const breite = /outline:\s*(\d+(?:\.\d+)?)px/.exec(rumpf);
    expect(breite, "Die Fokusregel hat keine Umriss-Breite mehr").toBeTruthy();
    expect(Number(breite![1])).toBeGreaterThanOrEqual(4);
  });

  it("und er steht ab vom Feld, statt darauf zu kleben", () => {
    expect(regel(':where(a, button, input, select, textarea, [tabindex], [role="button"]):focus-visible'))
      .toMatch(/outline-offset:\s*[1-9]/);
  });
});

describe("★★★★★ Das Eingabefeld nimmt seinen Umriss nicht mehr weg", () => {
  it("⚠️ DER BEFUND: `.field-input` enthält kein `outline-none` mehr", () => {
    // Es war die einzige Stelle, die den Umriss der Grundregel ausgeschaltet
    // hat - und damit im Hochkontrastmodus jedes Zeichen.
    expect(regel(".field-input {")).not.toMatch(/outline-none/);
  });

  it("★★★ die Rahmenfarbe bleibt - sie hilft im gewöhnlichen Modus weiter", () => {
    // Kein Entweder-Oder: Farbe UND Umriss. Ein Zeichen, das ein
    // Betriebssystem wegnehmen kann, darf nur nicht das einzige sein.
    expect(regel(".field-input {")).toMatch(/focus:border-accent/);
  });
});

describe("★★★★★ Im Hochkontrastmodus gibt es einen eigenen, kräftigeren Umriss", () => {
  it("⚠️ DER BEFUND: es gibt überhaupt eine Fokusregel für `forced-colors`", () => {
    expect(hochkontrast()).toMatch(/:focus(-visible)?/);
  });

  it("★★★★ sie benutzt die SYSTEMFARBE `Highlight` - eine eigene Farbe würde überschrieben", () => {
    expect(hochkontrast()).toMatch(/outline:\s*\d+(?:\.\d+)?px\s+solid\s+Highlight/);
  });

  it("★★★★★ und sie ist DICKER als der gewöhnliche Fokus - dort gibt es kein zweites Zeichen", () => {
    // ⚠️ Über ALLE diese Regeln, nicht nur über eine: Die dünnste zählt.
    const duennste = Math.min(...hcmFokusUmrisse().map(
      (r) => Number(/outline:\s*(\d+(?:\.\d+)?)px/.exec(r.rumpf)![1])));
    const normal = /outline:\s*(\d+(?:\.\d+)?)px/.exec(
      regel(':where(a, button, input, select, textarea, [tabindex], [role="button"]):focus-visible'),
    );
    expect(duennste).toBeGreaterThan(Number(normal![1]));
  });

  it("★★★★★ sie trägt `!important` - sonst verlöre sie gegen 81 `outline-none`-Stellen", () => {
    // Tailwinds `focus:outline-none` wiegt schwerer als eine `:where()`-Regel.
    // Im Hochkontrastmodus darf der Umriss aber nicht abschaltbar sein - und
    // das gilt für JEDE dieser Regeln, nicht nur für die allgemeine.
    for (const r of hcmFokusUmrisse()) {
      expect(r.rumpf, r.auswahl)
        .toMatch(/outline:\s*\d+(?:\.\d+)?px\s+solid\s+Highlight\s*!important/);
    }
  });

  it("★★★ sie fasst auch das FELD, nicht nur `:focus-visible` - ein Fingertipp löst das nicht aus", () => {
    const auswahl = allgemeineHcmFokusregel().auswahl;
    expect(auswahl).toMatch(/textarea:focus\b/);
    expect(auswahl).toMatch(/input:focus\b/);
  });

  it("⚠️ und sie fasst NICHT `[tabindex]` - dort ist ein 5px-Kasten Lärm, keine Auskunft", () => {
    // Container mit `tabIndex={-1}` bekommen den Fokus nur, damit eine
    // Sprachausgabe etwas vorliest (Punktgenau-Matrix, Tippfeld).
    for (const r of hcmFokusUmrisse()) expect(r.auswahl).not.toMatch(/\[tabindex\]/);
    // Gegenprobe: die Auswahl trifft sehr wohl die echten Bedienelemente.
    expect(allgemeineHcmFokusregel().auswahl).toMatch(/button:focus-visible/);
  });
});
