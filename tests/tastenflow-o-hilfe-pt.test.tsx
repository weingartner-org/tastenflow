/**
 * ★★★ O-HILFE-PT (25.10.2026): WÄCHTER ÜBER DIE HILFEN UND RECHTSTEXTE AUF
 * PORTUGIESISCH (PORTUGAL) - Glossar `recherche-portugiesisch-2026-10-25/GLOSSAR-pt.md`.
 *
 * Gebaut nach den Abschnitten Hilfen/Rechtliches in `tastenflow-tschechisch-alles.test.tsx`.
 * Die portugiesische Bedienung ist noch NICHT eingeschaltet; der Test setzt die
 * Sprache über einen ersetzten `useBedienSprache` (ohne Wert läuft der echte Haken).
 *
 *  (a) Jede der sechs Seiten rendert mit `spracheGewaehlt = "pt"` portugiesisch:
 *      Probe (typische Wörter Portugals vorhanden) und Fänger (kein Textstück der
 *      deutschen oder englischen Grundfassung - statisch aus deren Quelltext
 *      gelesen, damit gemeinsame Bauteile mit englischem Rückfall, z. B.
 *      `DreiWerteHilfe`, nicht mitzählen - und kein brasilianisches Wort).
 *  (b) Dieselben Kürzel (Alt + …) wie die deutsche Fassung.
 *  (c) Hausregeln über die sechs pt-Dateien: kein Gedankenstrich, keine
 *      Maus-Wörter, kein Adjektiv an „tu", Prozent ohne Leerzeichen, Datum
 *      portugiesisch. Jede Regel mit Gegenprobe.
 *  (d) Ohne Schalter bleibt alles deutsch.
 */
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { createRequire } from "node:module";
import { act, cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";

const bedien = vi.hoisted(() => ({ sprache: null as null | string }));

vi.mock("@/lib/bedienSprache", async () => {
  const actual = await vi.importActual<typeof import("@/lib/bedienSprache")>("@/lib/bedienSprache");
  return {
    ...actual,
    useBedienSprache: () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      if (bedien.sprache === null) return actual.useBedienSprache();
      return {
        sprache: bedien.sprache,
        spracheGewaehlt: bedien.sprache,
        setzeSprache: () => {},
        bereichAktiv: true,
        wechsle: () => {},
        beimSchalter: () => () => {},
        spracheOptionen: ["de", "en", "pt"],
      };
    },
  };
});

vi.mock("../src/lib/typing/voice", async (importOriginal) => {
  const echt = await importOriginal<typeof import("../src/lib/typing/voice")>();
  return { ...echt, speakUi: vi.fn(), speakUiAlways: vi.fn(), speak: vi.fn() };
});

import { ladeKuerzelKatalog } from "../src/lib/typing/kuerzelKatalog";
import { HINWEIS_DEUTSCH_VERBINDLICH_PT } from "../src/features/legal/LegalShell";
import { TippenHilfe } from "../src/components/typing/TippenHilfe";
import { LehrerHilfe } from "../src/components/typing/LehrerHilfe";
import { MeineKlasseHilfe } from "../src/components/lernwerkstatt/klasse/MeineKlasseHilfe";
import { useTypingAuth } from "../src/components/typing/useTypingAuth";
import { BedienSpracheProvider } from "../src/lib/bedienSprache";
import { AnnounceProvider } from "../src/lib/a11y";
import { useVoice } from "../src/lib/typing";
import { useContrast } from "../src/lib/contrast";
import { ohneBildschirmTastatur } from "./_typing-probelauf";

const ts = createRequire(resolve(process.cwd(), "package.json"))("typescript") as typeof import("typescript");

// ---------------------------------------------------------------------------
// Aufbau
// ---------------------------------------------------------------------------

function zeige(knoten: ReactNode, adresse = "/programme/tastenflow") {
  window.history.replaceState(null, "", adresse);
  return render(
    <AnnounceProvider>
      <MemoryRouter initialEntries={[adresse]}>
        <BedienSpracheProvider spanischAn>{knoten}</BedienSpracheProvider>
      </MemoryRouter>
    </AnnounceProvider>,
  );
}

const warte = (ms: number) => act(() => new Promise<void>((r) => window.setTimeout(r, ms)));

beforeEach(() => {
  localStorage.clear();
  bedien.sprache = null;
  document.documentElement.setAttribute("lang", "de");
  ohneBildschirmTastatur();
  useTypingAuth.setState({ account: null });
  useContrast.getState().setMode("hell");
  useVoice.getState().setEnabled(false);
  Element.prototype.scrollIntoView = () => {};
});
afterEach(() => {
  cleanup();
  bedien.sprache = null;
  vi.restoreAllMocks();
});
beforeAll(() => ladeKuerzelKatalog());

const norm = (s: string) => s.replace(/\s+/g, " ").trim();

/**
 * Ganzes Wort (oder Wortfolge). `\b` kennt in JavaScript nur ASCII-Buchstaben, auch mit `u`:
 * „ecrã\b" und „\bés" treffen darum NIE, „\bvocê\b" auch nicht. Darum die Grenzen
 * `(?<!\p{L})` / `(?!\p{L})` mit Schalter `u` (O2-WAECHTER 29.10.).
 */
const ganz = (muster: string, schalter = "u") => new RegExp(`(?<!\\p{L})${muster}(?!\\p{L})`, schalter);

interface Seite {
  name: string;
  /** Die pt-Datei (Hausregeln) und die Grundfassungen (Fänger). */
  pt: string;
  grund: string[];
  /** Typische Wörter Portugals, die auf der Seite stehen müssen. */
  probe: RegExp[];
  lauf: () => Promise<void>;
  /** Wo der eigene Text steht (Rechtsseiten: ohne Kopf/Fuss der gemeinsamen Hülle). */
  bereich: () => string;
}

/** Text eines Knotens, Textknoten mit Leerzeichen getrennt (textContent klebt Absätze zusammen). */
function textVon(k: Node | null | undefined): string {
  if (!k) return "";
  const w = document.createTreeWalker(k, NodeFilter.SHOW_TEXT);
  const teile: string[] = [];
  for (let n = w.nextNode(); n; n = w.nextNode()) teile.push(n.nodeValue ?? "");
  return teile.join(" ");
}
const dialogText = () => norm([...document.querySelectorAll('[role="dialog"]')].map(textVon).join(" "));
const rechtsText = () => {
  const h1 = textVon(document.querySelector("h1"));
  const hinweis = textVon(document.querySelector("main")?.querySelector("p"));
  const inhalt = textVon(document.querySelector(".ce-content"));
  return norm(`${h1} ${hinweis} ${inhalt}`);
};

const C = "src/components/typing/";
const K = "src/components/lernwerkstatt/klasse/";

const SEITEN: Seite[] = [
  {
    name: "Ajuda (Alt + H), crianças",
    pt: `${C}TippenHilfe.pt.tsx`,
    grund: [`${C}TippenHilfe.tsx`, `${C}TippenHilfe.en.tsx`],
    probe: [ganz("teclado"), ganz("campo de escrita"), ganz("prime"), ganz("Desafio"), ganz("Corrida da turma"), ganz("Blocos de gelo")],
    lauf: async () => {
      zeige(<TippenHilfe open onClose={() => {}} stufe="kids" />);
      await warte(10);
    },
    bereich: dialogText,
  },
  {
    name: "Ajuda (Alt + H), 11-15 anos",
    pt: `${C}TippenHilfe.pt.tsx`,
    grund: [`${C}TippenHilfe.tsx`, `${C}TippenHilfe.en.tsx`],
    probe: [ganz("Jogo-prémio"), ganz("nível de dificuldade"), ganz("Definições")],
    lauf: async () => {
      zeige(<TippenHilfe open onClose={() => {}} stufe="teens" />);
      await warte(10);
    },
    bereich: dialogText,
  },
  {
    name: "Ajuda (Alt + H), pessoas adultas",
    pt: `${C}TippenHilfe.pt.tsx`,
    grund: [`${C}TippenHilfe.tsx`, `${C}TippenHilfe.en.tsx`],
    probe: [ganz("leitor de ecrã"), ganz("conta pessoal"), ganz("cartaz")],
    lauf: async () => {
      zeige(<TippenHilfe open onClose={() => {}} stufe="erwachsen" />);
      await warte(10);
    },
    bereich: dialogText,
  },
  {
    name: "Ajuda para docentes",
    pt: `${C}LehrerHilfe.pt.tsx`,
    grund: [`${C}LehrerHilfe.tsx`, `${C}LehrerHilfe.en.tsx`],
    probe: [ganz("turma"), ganz("palavra-passe"), ganz("ano letivo"), ganz("(?:Selecione|Escolha)"), ganz("ficheiro")],
    lauf: async () => {
      zeige(<LehrerHilfe open onClose={() => {}} />);
      await warte(10);
    },
    bereich: dialogText,
  },
  {
    name: "Ajuda: As minhas turmas (Tastenflow)",
    pt: `${K}MeineKlasseHilfe.pt.tsx`,
    grund: [`${K}MeineKlasseHilfe.tsx`, `${K}MeineKlasseHilfe.en.tsx`],
    probe: [ganz("As minhas turmas"), ganz("código da turma"), /(?<!\p{L})Prontos: 12 de 14(?!\d)/u],
    lauf: async () => {
      zeige(<MeineKlasseHilfe onClose={() => {}} programmName="Tastenflow" />);
      await warte(10);
    },
    bereich: dialogText,
  },
];

/**
 * Alle Textstücke (JSX-Text und Zeichenketten) einer Grundfassung mit mindestens
 * vier Wörtern - ohne Kommentare, Importe und Klassennamen. Was davon in der pt-Seite
 * steht, ist ein vergessener Satz.
 */
function textstuecke(pfad: string): string[] {
  const quelle = readFileSync(resolve(process.cwd(), pfad), "utf8");
  const sf = ts.createSourceFile(pfad, quelle, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const out: string[] = [];
  const besuche = (n: import("typescript").Node) => {
    if (ts.isImportDeclaration(n)) return;
    if (ts.isJsxAttribute(n) && n.name.getText(sf) === "className") return;
    let t: string | null = null;
    if (ts.isJsxText(n)) t = n.text;
    else if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) t = n.text;
    else if (ts.isTemplateHead(n) || ts.isTemplateMiddle(n) || ts.isTemplateTail(n)) t = n.text;
    if (t !== null) {
      const s = norm(t);
      const woerter = s.split(" ").filter((w) => /\p{L}{2,}/u.test(w));
      if (woerter.length >= 4) out.push(s);
    }
    ts.forEachChild(n, besuche);
  };
  besuche(sf);
  return out;
}

/**
 * Begründete Ausnahmen: Textstücke, die in der Grundfassung UND (gewollt unverändert)
 * in der pt-Fassung stehen - Namen österreichischer Behörden und Gesetze (lang="de").
 */
const AUSNAHMEN = new Set<string>([
  "Sozialministeriumservice, Landesstelle Oberösterreich",
  "Marktüberwachungsbehörde Digitale Barrierefreiheit",
  // Der deutsche Name eines Häkchens der Plattform, zitiert mit Übersetzung dahinter.
  "Erinnerungs-Mails zu Aufgaben, Lektionen und Ankündigungen",
]);

/**
 * Textstücke, die AUCH in einer anderen Quelldatei stehen (gemeinsame Bauteile wie
 * `DreiWerteHilfe`, `HandbuchKnopf`, Kürzel-Liste), zeigt ein gemeinsames Bauteil - deren
 * Übersetzung ist nicht Teil dieser Etappe (englischer Rückfall `RÜCKFALL-EN`).
 */
let gemeinsamerQuelltext: Map<string, string> | null = null;
function inGemeinsamemQuelltext(stueck: string, eigene: string[]): boolean {
  if (gemeinsamerQuelltext === null) {
    const karte = new Map<string, string>();
    const lauf = (dir: string) => {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, e.name);
        if (e.isDirectory()) lauf(p);
        else if (/\.tsx?$/.test(e.name)) karte.set(p.split("\\").join("/"), norm(readFileSync(p, "utf8")));
      }
    };
    lauf(resolve(process.cwd(), "src"));
    gemeinsamerQuelltext = karte;
  }
  for (const [pfad, inhalt] of gemeinsamerQuelltext) {
    if (eigene.some((g) => pfad.endsWith(g))) continue;
    // Andere Übersetzungen derselben Seite zählen nicht als gemeinsamer Teil.
    if (/\.(en|fr|es|it|pl|tr|cs|pt|br|bg|el|hu|nl|ro|sv|uk)\.tsx$/.test(pfad)) continue;
    if (inhalt.includes(stueck)) return true;
  }
  return false;
}

/** Wörter Brasiliens (Glossar §4 Nr. 1, Spalte „pt-BR anders"), Ganzwort. */
// ⚠️ Mit `\b` trafen „você", „vocês", „ônibus", „bônus" NIE (gemessen 29.10., O2-WAECHTER).
const BRASILIEN = /(?<!\p{L})(você|vocês|tela|arquivos?|usuários?|senhas?|baixar|digitar|digite|Configurações|Carregando|rodada|ônibus|bônus|prêmio|gêmeos|aba|equipe|Meus textos|Minha conta|Minhas turmas)(?!\p{L})/u;

/** Maus- und Fingerwörter (Glossar Regel 8). „toca" allein heisst auch „spielt" (eine Note). */
const MAUS = /(?<!\p{L})(clic\p{L}*|cliqu\p{L}*|rato|arrast\p{L}*|toca (?:no|na|em)|toque (?:no|na) ecrã|passa o cursor)(?!\p{L})/iu;

/** Adjektiv/Partizip an „tu" oder an der Leserschaft (Glossar Regel 2, §4 Nr. 5). Mit `\b` traf „és pronto" nie. */
const GESCHLECHT = /(?<!\p{L})(est[áa]s|és|foste|ficaste|ficar|estiver|for)\s+(pront|cansad|sozinh|lig?ad|satisfeit|bem-vind|obrigad|preparad|convidad)[oa]s?(?!\p{L})|(?<!é )(?<!\p{L})bem-vind[oa]s?(?!\p{L})|(?<!\p{L})sozinh[oa]s?(?!\p{L})/iu;

describe("★★★★★ (a) die sechs Seiten auf Portugiesisch (Portugal)", () => {
  it.each(SEITEN.map((s) => [s.name, s] as const))("%s", async (_name, seite) => {
    bedien.sprache = "pt";
    await seite.lauf();
    const text = seite.bereich();
    // Probe: die Seite ist wirklich portugiesisch.
    expect(text.length, "die Seite hat Text").toBeGreaterThan(500);
    for (const p of seite.probe) expect(text, `Probe ${p}`).toMatch(p);
    expect(text, "europäisch-portugiesische Zeichen").toMatch(/[ãõçáéêó]/);
    // Fänger: kein Textstück der deutschen oder englischen Grundfassung.
    const stuecke = seite.grund
      .flatMap(textstuecke)
      .filter((s) => !AUSNAHMEN.has(s) && !inGemeinsamemQuelltext(s, seite.grund));
    expect(stuecke.length, "GEGENPROBE: die Grundfassungen tragen viele Textstücke").toBeGreaterThan(30);
    const funde = [...new Set(stuecke.filter((s) => text.includes(s)))];
    expect(funde, "Satz der Grundfassung in der pt-Seite").toEqual([]);
    // Kein brasilianisches Wort.
    expect(text.match(BRASILIEN)?.[0] ?? null, "brasilianisches Wort").toBeNull();
  });

  it("GEGENPROBE: dieselbe Seite deutsch trägt die Sätze der Grundfassung (der Fänger fängt wirklich)", async () => {
    await SEITEN[0].lauf();
    const text = SEITEN[0].bereich();
    const funde = textstuecke(`${C}TippenHilfe.tsx`).filter((s) => text.includes(s));
    expect(funde.length).toBeGreaterThan(20);
    expect(text).not.toMatch(ganz("campo de escrita"));
  });

  it("der Pflichtsatz steht unter der Überschrift jeder Rechtsseite", async () => {
    bedien.sprache = "pt";
    for (const s of SEITEN.filter((x) => x.bereich === rechtsText)) {
      await s.lauf();
      expect(document.querySelector("main")?.textContent ?? "").toContain(HINWEIS_DEUTSCH_VERBINDLICH_PT);
      cleanup();
    }
    expect(HINWEIS_DEUTSCH_VERBINDLICH_PT).toBe("Esta tradução é meramente informativa. Faz fé a versão alemã.");
  });
});

// ---------------------------------------------------------------------------
// (b) Dieselben Kürzel wie die deutsche Fassung
// ---------------------------------------------------------------------------

function kuerzel(): string[] {
  // Textknoten getrennt lesen: `textContent` klebt „…weingartner.org" an „Alt + H".
  const text = norm(textVon(document.body));
  return [...new Set([...text.matchAll(/(?<!\p{L})Alt \+ ([0-9A-Z+])/gu)].map((m) => m[1]))].sort();
}

describe("★★★★ (b) dieselben Kürzel (Alt + …) wie die deutsche Fassung", () => {
  it.each(SEITEN.map((s) => [s.name, s] as const))("%s", async (_name, seite) => {
    await seite.lauf();
    const de = kuerzel();
    cleanup();
    bedien.sprache = "pt";
    await seite.lauf();
    const pt = kuerzel();
    expect(pt).toEqual(de);
    if (seite.bereich === dialogText) expect(de.length, "GEGENPROBE: die Hilfe nennt Kürzel").toBeGreaterThan(2);
  });
});

// ---------------------------------------------------------------------------
// (c) Hausregeln über die sechs pt-Dateien
// ---------------------------------------------------------------------------

const PT_DATEIEN = [...new Set(SEITEN.map((s) => s.pt))];

/** Nur die Texte, ohne den deutschen Kopfkommentar der Datei. */
function ptText(pfad: string): string {
  return textstuecke(pfad).join("\n") + "\n" + readFileSync(resolve(process.cwd(), pfad), "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

describe("★★★ (c) Hausregeln in den pt-Dateien (mit Gegenprobe)", () => {
  it.each(PT_DATEIEN.map((p) => [p] as const))("%s", (pfad) => {
    const t = ptText(pfad);
    expect(t.match(/[–—]/)?.[0] ?? null, "Gedankenstrich").toBeNull();
    expect(t.match(MAUS)?.[0] ?? null, "Maus-Wort").toBeNull();
    expect(t.match(GESCHLECHT)?.[0] ?? null, "Adjektiv an der Person").toBeNull();
    expect(t.match(BRASILIEN)?.[0] ?? null, "brasilianisches Wort").toBeNull();
    expect(t.match(/\d %/)?.[0] ?? null, "Prozent mit Leerzeichen (pt-PT: 95%)").toBeNull();
    expect(t.match(/\d{1,2}\. (Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember)/)?.[0] ?? null, "deutsches Datum").toBeNull();
    expect(t.match(/(?<!\p{L})o\s+\$\{|(?<!\p{L})(do|da)\s+\$\{name/u)?.[0] ?? null, "Artikel vor Platzhalter-Namen").toBeNull();
  });

  it("GEGENPROBE: jede Regel schlägt an einem Gegenbeispiel an", () => {
    expect("um traço – aqui").toMatch(/[–—]/);
    expect("Clica no botão").toMatch(MAUS);
    expect("Passa o rato por cima").toMatch(MAUS);
    expect("toca no ecrã").toMatch(MAUS);
    expect("Cada tecla certa toca a nota seguinte").not.toMatch(MAUS);
    expect("Estás pronto?").toMatch(GESCHLECHT);
    expect("Bem-vindo!").toMatch(GESCHLECHT);
    expect("a reutilização é bem-vinda").not.toMatch(GESCHLECHT);
    expect("Pratico sozinha").toMatch(GESCHLECHT);
    expect("Se não ficar satisfeito").toMatch(GESCHLECHT);
    expect("O que estás a praticar?").not.toMatch(GESCHLECHT);
    expect("Digite a senha na tela").toMatch(BRASILIEN);
    expect("Escreve a palavra-passe no ecrã").not.toMatch(BRASILIEN);
    // Mit `\b` schwiegen diese vier (Wort beginnt/endet mit Akzent):
    expect("Agora você escreve.").toMatch(BRASILIEN);
    expect("um bônus").toMatch(BRASILIEN);
    expect("Tu és pronta?").toMatch(GESCHLECHT);
    expect("o ecrã").toMatch(ganz("(?:não|ecrã|turma|tecla)"));
    // ... und ein Wortteil an einem Akzent-Buchstaben ist kein Wort.
    expect("Ótela").not.toMatch(BRASILIEN);
    expect("95 %").toMatch(/\d %/);
    expect("26. September 2026").toMatch(/\d{1,2}\. (September)/);
  });
});

// ---------------------------------------------------------------------------
// (d) Ohne Schalter bleibt alles deutsch
// ---------------------------------------------------------------------------

describe("★★★ (d) ohne portugiesischen Schalter bleibt alles deutsch", () => {
  it.each(SEITEN.map((s) => [s.name, s] as const))("%s", async (_name, seite) => {
    localStorage.setItem("tastenflow-bedienung", "pt");
    await seite.lauf();
    const text = seite.bereich();
    expect(text).not.toMatch(ganz("(?:não|ecrã|turma|tecla)"));
    const funde = textstuecke(seite.grund[0]).filter((s) => text.includes(s));
    expect(funde.length, "deutsche Sätze der Grundfassung").toBeGreaterThan(3);
  });
});
