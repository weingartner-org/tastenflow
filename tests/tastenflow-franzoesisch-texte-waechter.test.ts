/**
 * ★★★ E11a (25.09.2026, Bauplan Auftrag Punkt 4): DER FRANZÖSISCH-WÄCHTER.
 *
 * Liest - wie der Fr-Lücken-Wächter (`tastenflow-texte-ohne-fr.test.ts`) und
 * der Weichen-Zähler (`tastenflow-sprach-weichen.test.ts`) - den QUELLTEXT
 * selbst, balanciert über die geschweiften Klammern jeder `fr: { … }`-Tabelle
 * innerhalb eines echten `texte()`-Aufrufs. Geprüft wird der GANZE
 * Rohtext dieser Tabellen auf einmal gegen vier Regeln aus dem Auftrag
 * (§1, F7, F10):
 *
 *  1. Kein Point médian (`·`) - Gender-Schreibweise wie „invité·e". Der
 *     Zähler-Trennpunkt in Kopfzeilen-Tabellen („3 · 5") ist KEIN Point
 *     médian; er steht in de/en-Tabellen und wurde für fr durchgehend durch
 *     `-` ersetzt (Hausregel „nur Bindestrich") - darum reicht ein Verbot
 *     jedes `·` innerhalb der fr-Tabellen selbst.
 *  2. Kein Gedankenstrich (`—`/`–`) - Hausregel „nur Bindestrich".
 *  3. Keine Guillemets (`«`/`»`) - F7: Ersatz ist das gerade Anführungszeichen.
 *  4. Nie „faute" für einen Tippfehler - F: *erreur de frappe*, nie *faute*
 *     (Hausregel „nie etwas gegen ein Kind"). Eine einfache Wortgrenzen-Suche;
 *     „défaut"/„défauts" enthalten die Buchstabenfolge „faute" NICHT, brauchen
 *     also keine Ausnahme.
 *
 * ★ Nur ECHTE `fr`-Tabellen auf oberster Ebene eines `texte({de, …})`-Aufrufs
 * zählen (derselbe balancierte Parser wie im Fr-Lücken-Wächter) - ein blosses
 * Vorkommen des Wortes „fr" wäre kein Beleg.
 *
 * ⚠️ „aveugle"/„non-voyant" ohne Person-zuerst-Form (F11) ist HIER bewusst
 * NICHT automatisiert geprüft: Im Französischen steht das Adjektiv ohnehin
 * hinter dem Nomen („élève aveugle"), die Regel ist also durch die normale
 * Wortstellung weitgehend erfüllt - eine zuverlässige Heuristik dafür bräuchte
 * eine Grammatik, keinen Wächter. Von Hand geprüft (25.09.2026): kein
 * „aveugle“/„non-voyant“ kommt in den neu geschriebenen fr-Tabellen vor -
 * durchgehend „déficience visuelle“ (Person zuerst durch Wortstellung).
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";
import { describe, expect, it } from "vitest";

const WURZEL = resolve(__dirname, "..");
const ORDNER = ["src"];
const ENDUNGEN = [".ts", ".tsx"];

function sammleDateien(pfad: string): string[] {
  const out: string[] = [];
  for (const eintrag of readdirSync(pfad)) {
    if (eintrag === "node_modules" || eintrag === "dist") continue;
    const voll = join(pfad, eintrag);
    const st = statSync(voll);
    if (st.isDirectory()) out.push(...sammleDateien(voll));
    else if (ENDUNGEN.some((e) => voll.endsWith(e))) out.push(voll);
  }
  return out;
}

function importiertTexte(inhalt: string): boolean {
  const re = /import\s*\{[^}]*\btexte\b[^}]*\}\s*from\s*["'][^"']*bedienSprache[^"']*["']/;
  return re.test(inhalt);
}

/** Die Textstellen `texte({ … })` - balanciert über die geschweiften Klammern gesucht. */
function findeTexteAufrufe(inhalt: string): string[] {
  const aufrufe: string[] = [];
  const oeffner = /\btexte\s*\(\s*\{/g;
  let treffer: RegExpExecArray | null;
  while ((treffer = oeffner.exec(inhalt))) {
    const start = treffer.index + treffer[0].lastIndexOf("{");
    let tiefe = 0;
    let i = start;
    for (; i < inhalt.length; i++) {
      if (inhalt[i] === "{") tiefe++;
      else if (inhalt[i] === "}") {
        tiefe--;
        if (tiefe === 0) {
          i++;
          break;
        }
      }
    }
    aufrufe.push(inhalt.slice(start, i));
  }
  return aufrufe;
}

function tiefeAn(text: string, index: number): number {
  let tiefe = 0;
  for (let i = 0; i < index; i++) {
    if (text[i] === "{") tiefe++;
    else if (text[i] === "}") tiefe--;
  }
  return tiefe;
}

/** Der Rohtext der `fr: { … }`-Tabelle EINES Aufrufs - `null`, wenn es keine gibt. */
function frTabelle(objektText: string): string | null {
  const re = /(^|[,{\s])fr\s*:\s*\{/g;
  let treffer: RegExpExecArray | null;
  while ((treffer = re.exec(objektText))) {
    const oeffnerPos = treffer.index + treffer[0].lastIndexOf("{");
    if (tiefeAn(objektText, treffer.index + treffer[0].indexOf("fr")) !== 1) continue;
    let tiefe = 0;
    let i = oeffnerPos;
    for (; i < objektText.length; i++) {
      if (objektText[i] === "{") tiefe++;
      else if (objektText[i] === "}") {
        tiefe--;
        if (tiefe === 0) {
          i++;
          break;
        }
      }
    }
    return objektText.slice(oeffnerPos, i);
  }
  return null;
}

interface Fund {
  datei: string;
  regel: string;
  ausschnitt: string;
}

function sammleAlleFrTabellen(): { datei: string; text: string }[] {
  const gefunden: { datei: string; text: string }[] = [];
  for (const ordner of ORDNER) {
    for (const datei of sammleDateien(resolve(WURZEL, ordner))) {
      const inhalt = readFileSync(datei, "utf8");
      if (!importiertTexte(inhalt)) continue;
      for (const aufruf of findeTexteAufrufe(inhalt)) {
        const fr = frTabelle(aufruf);
        if (fr) gefunden.push({ datei: datei.slice(WURZEL.length + 1), text: fr });
      }
    }
  }
  return gefunden;
}

function ausschnittUm(text: string, index: number, laenge = 40): string {
  const von = Math.max(0, index - laenge);
  const bis = Math.min(text.length, index + laenge);
  return text.slice(von, bis).replace(/\s+/g, " ");
}

describe("Französisch-Wächter: Point médian, Gedankenstrich, Guillemets, „faute“", () => {
  const tabellen = sammleAlleFrTabellen();

  it("findet überhaupt fr-Tabellen (Gegenprobe gegen einen leeren/kaputten Wächter)", () => {
    expect(tabellen.length).toBeGreaterThan(50);
  });

  it("keine der vier verbotenen Formen kommt in einer fr-Tabelle vor", () => {
    const funde: Fund[] = [];
    for (const { datei, text } of tabellen) {
      const punktMedian = text.indexOf("·");
      if (punktMedian !== -1) {
        funde.push({ datei, regel: "Point médian (·)", ausschnitt: ausschnittUm(text, punktMedian) });
      }
      const gedankenstrich = text.search(/[—–]/);
      if (gedankenstrich !== -1) {
        funde.push({
          datei,
          regel: "Gedankenstrich (—/–)",
          ausschnitt: ausschnittUm(text, gedankenstrich),
        });
      }
      const guillemet = text.search(/[«»]/);
      if (guillemet !== -1) {
        funde.push({ datei, regel: "Guillemets (« »)", ausschnitt: ausschnittUm(text, guillemet) });
      }
      const fauteRe = /\bfautes?\b/gi;
      let fauteTreffer: RegExpExecArray | null;
      while ((fauteTreffer = fauteRe.exec(text))) {
        funde.push({ datei, regel: '„faute" statt „erreur de frappe"', ausschnitt: ausschnittUm(text, fauteTreffer.index) });
      }
    }
    if (funde.length > 0) {
      const liste = funde.map((f) => `${f.datei}: ${f.regel} - „${f.ausschnitt}“`).join("\n");
      throw new Error(`${funde.length} verbotene Form(en) in fr-Tabellen gefunden:\n${liste}`);
    }
    expect(funde).toHaveLength(0);
  });

  it("erkennt einen Point médian (Gegenprobe gegen einen leeren Wächter)", () => {
    const beispiel = `texte({ de: { a: "x" }, en: { a: "x" }, fr: { a: "invité·e" } })`;
    const aufrufe = findeTexteAufrufe(beispiel);
    expect(aufrufe).toHaveLength(1);
    const fr = frTabelle(aufrufe[0]);
    expect(fr).not.toBeNull();
    expect(fr).toContain("·");
  });

  it('erkennt „faute" als eigenes Wort, aber nicht als Teil von „défaut" (Gegenprobe)', () => {
    const beispiel = `texte({ de: { a: "x" }, en: { a: "x" }, fr: { a: "une faute", b: "par défaut" } })`;
    const aufrufe = findeTexteAufrufe(beispiel);
    const fr = frTabelle(aufrufe[0])!;
    expect(/\bfautes?\b/i.test(fr)).toBe(true);
    expect(/\bfautes?\b/i.test("par défaut")).toBe(false);
  });
});
