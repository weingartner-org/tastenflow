/**
 * ★★★★ KONTRAST IN DEN SPIELEN (29.10.2026) - Wünsche einer Lehrerin aus Zürich:
 * „Kontraste bei den Spielen" und „Nebeninformationen bei Spielen, z. B.
 * Pyramidenschreiben und Klassenmatch, größer und in schwarzer Schrift".
 *
 * Die Polar-Expedition hat feste Hex-Paletten (SVG-Szenen + `expedition.css`),
 * unabhängig vom Kontrastmodus der App. Dieser Wächter liest die Farbpaare
 * aus dem QUELLTEXT und rechnet sie nach WCAG nach:
 *   - TEXT mindestens 4,5 : 1 gegen seinen Grund,
 *   - wichtige GRAFIK (Tor, Pfosten, Reisepunkte, Zielmarken) mindestens 3 : 1,
 *   - „noch nicht" / „schon vorbei" steht in Form und Rand, NICHT in blasser
 *     Deckkraft,
 *   - Schrift in der Kopfzeile / im Tagebuch nicht unter 0,95 rem.
 * Die Nebeninfos von Pyramide und Klassenmatch sind `text-ink` (folgt dem
 * Kontrastmodus) und nicht kleiner als `text-base`.
 *
 * Die Quelle kann per Umgebungsvariable `KONTRAST_QUELLE` auf eine Kopie des
 * Baums (mit `src/...`) zeigen - so wird gezeigt, dass der Wächter am alten
 * Stand rot ist:  KONTRAST_QUELLE=/pfad/zur/kopie npx vitest run <diese Datei>
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const QUELLE = process.env.KONTRAST_QUELLE || WURZEL;
const lies = (rel: string) => readFileSync(join(QUELLE, rel), "utf8");

const EXP = "src/components/typing/expedition";
const css = lies(`${EXP}/expedition.css`);
const slide = lies(`${EXP}/scenes/SlideScene.tsx`);
const steilwand = lies(`${EXP}/scenes/SteilwandScene.tsx`);
const station = lies(`${EXP}/scenes/StationScene.tsx`);
const cave = lies(`${EXP}/scenes/CaveScene.tsx`);

// ── WCAG ────────────────────────────────────────────────────────────────────
type Rgb = [number, number, number];
const hex = (h: string): Rgb => {
  const s = h.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16)) as Rgb;
};
const lum = ([r, g, b]: Rgb) => {
  const f = (c: number) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const cr = (a: Rgb, b: Rgb) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const mix = (fg: Rgb, a: number, bg: Rgb): Rgb => fg.map((c, i) => c * a + bg[i] * (1 - a)) as Rgb;

// ── Quelltext lesen ─────────────────────────────────────────────────────────
function cssRegel(selektor: string): string {
  const esc = selektor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const m = new RegExp(`^${esc}\\s*\\{([^}]*)\\}`, "m").exec(css);
  if (!m) throw new Error(`CSS-Regel „${selektor}" nicht gefunden`);
  return m[1];
}
function eig(body: string, name: string): string | null {
  const m = new RegExp(`(?:^|[\\s;])${name}\\s*:\\s*([^;]+);`).exec(body);
  return m ? m[1].trim() : null;
}
function rem(body: string): number {
  const v = eig(body, "font-size");
  if (!v) throw new Error("kein font-size");
  return parseFloat(v);
}
function konst(text: string, name: string): string {
  const m = new RegExp(`const ${name}\\s*=\\s*"(#[0-9a-fA-F]{6})"`).exec(text);
  if (!m) throw new Error(`Konstante ${name} nicht gefunden`);
  return m[1];
}

// Grund der Kopfzeile: rgba(6,16,28,.72) über der hellsten Letterbox der Zonen.
const LETTERBOX = ["#16324f", "#3a2a1c", "#05070f", "#221d34", "#271a2b", "#060c19", "#0a1422"];
const hudGrund = (letter: string): Rgb => mix([6, 16, 28], 0.72, hex(letter));
const imHud = (fg: Rgb) => Math.min(...LETTERBOX.map((l) => cr(fg, hudGrund(l))));

describe("★★★★ Polar-Expedition: Kontraste (Text ≥ 4,5 : 1, Grafik ≥ 3 : 1)", () => {
  it("Kopfzeile: Zonen-Zähler ohne Abschwächung, mindestens 0,95 rem", () => {
    const b = cssRegel(".px-hud__step");
    expect(eig(b, "opacity"), "Deckkraft am Zonen-Zähler").toBeNull();
    expect(rem(b)).toBeGreaterThanOrEqual(0.95);
    expect(imHud(hex("#eaf3fa"))).toBeGreaterThanOrEqual(4.5);
    expect(eig(cssRegel(".px-status--soft"), "opacity"), "Deckkraft der weichen Statuszeile").toBeNull();
  });

  it("Reisepunkte: jeder Punkt hat einen hellen Rand (≥ 3 : 1), der Stand steht in der Form, nicht in der Deckkraft", () => {
    for (const sel of [".px-hud__dot", ".px-hud__dot--done", ".px-hud__dot--current", ".px-hud__dot--todo"]) {
      expect(eig(cssRegel(sel), "opacity"), `${sel}: Deckkraft`).toBeNull();
    }
    const rand = /border:\s*\d+px solid (#[0-9a-fA-F]{6})/.exec(cssRegel(".px-hud__dot"));
    expect(rand, "Rand am Reisepunkt").not.toBeNull();
    expect(imHud(hex(rand![1]))).toBeGreaterThanOrEqual(3);
    // offen = hohl
    expect(eig(cssRegel(".px-hud__dot--todo"), "background")).toBe("transparent");
  });

  it("Schalter und Knöpfe: Schrift ≥ 0,95 rem, Rand ≥ 3 : 1, gedrückt weiß auf ≥ 4,5 : 1", () => {
    for (const sel of [".px-hud__toggle", ".px-btn"]) {
      const b = cssRegel(sel);
      expect(rem(b), `${sel}: Schriftgröße`).toBeGreaterThanOrEqual(0.95);
      const rand = /border:\s*[\d.]+px solid (#[0-9a-fA-F]{6})/.exec(b);
      expect(rand, `${sel}: Rand als feste Farbe`).not.toBeNull();
      expect(imHud(hex(rand![1])), `${sel}: Rand`).toBeGreaterThanOrEqual(3);
    }
    for (const sel of ['.px-hud__toggle[aria-pressed="true"]', '.px-btn[aria-pressed="true"]']) {
      const bg = /^\s*background:\s*(#[0-9a-fA-F]{6})/m.exec(cssRegel(sel));
      expect(bg, sel).not.toBeNull();
      expect(cr(hex("#ffffff"), hex(bg![1])), `${sel}: weiße Schrift`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("Tagebuch: jede Schriftfarbe ≥ 4,5 : 1 auf dem Blatt, Schrift ≥ 0,95 rem", () => {
    const blatt = /linear-gradient\(180deg,\s*(#[0-9a-fA-F]{6}),\s*(#[0-9a-fA-F]{6})\)/.exec(cssRegel(".px-diary__page"));
    expect(blatt).not.toBeNull();
    const gründe = [hex(blatt![1]), hex(blatt![2])];
    for (const sel of [".px-diary__eyebrow", ".px-diary__example", ".px-diary__hint", ".px-diary__task", ".px-diary__zone"]) {
      const b = cssRegel(sel);
      const farbe = eig(b, "color") ?? eig(cssRegel(".px-diary__page"), "color")!;
      for (const g of gründe) expect(cr(hex(farbe), g), `${sel} ${farbe}`).toBeGreaterThanOrEqual(4.5);
      expect(rem(b), `${sel}: Schriftgröße`).toBeGreaterThanOrEqual(0.95);
    }
    const probe = cssRegel(".px-diary__probe");
    expect(cr(hex(eig(probe, "color")!), hex(eig(probe, "background")!)), "Probe").toBeGreaterThanOrEqual(4.5);
    expect(rem(cssRegel(".px-diary__hint kbd"))).toBeGreaterThanOrEqual(0.95);
  });

  it("Bauchrutsche: Tor und Taktpfosten ≥ 3 : 1 gegen Himmel UND Schnee, ohne blasse Deckkraft", () => {
    const rand = hex(konst(slide, "TOR_RAND"));
    const kerne = ["TOR_RUHIG", "TOR_HEISS", "POSTEN_OFFEN"].map((n) => hex(konst(slide, n)));
    const himmel = [...slide.matchAll(/id="slSky"[\s\S]*?<\/linearGradient>/g)][0][0].match(/#[0-9a-fA-F]{6}/g)!;
    const schnee = [...slide.matchAll(/id="slSnow"[\s\S]*?<\/linearGradient>/g)][0][0].match(/#[0-9a-fA-F]{6}/g)!;
    for (const k of kerne) for (const h of himmel) expect(cr(k, hex(h)), `Kern gegen Himmel ${h}`).toBeGreaterThanOrEqual(3);
    for (const h of schnee) expect(cr(rand, hex(h)), `Rand gegen Schnee ${h}`).toBeGreaterThanOrEqual(3);
    expect(slide, "Pfosten ohne Deckkraft für den Zustand vorbei").not.toMatch(/opacity=\{passed/);
    expect(slide, "Tor ohne feste Blassfarbe #8fb6d8").not.toContain("#8fb6d8");
    expect(slide, "Pfosten ohne #6f86ad").not.toContain("#6f86ad");
  });

  it("Steilwand: Zeichen auf dem Schild ≥ 4,5 : 1 und ohne Deckkraft", () => {
    const m = /const fill = done \? "(#[0-9a-fA-F]{6})" : active \? "(#[0-9a-fA-F]{6})" : "(#[0-9a-fA-F]{6})"/.exec(steilwand);
    expect(m, "fill-Auswahl").not.toBeNull();
    const [, erledigt, aktiv, kommend] = m!;
    expect(cr(hex(erledigt), hex("#fffaf0")), "erledigt").toBeGreaterThanOrEqual(4.5);
    expect(cr(hex(kommend), hex("#fffaf0")), "kommend").toBeGreaterThanOrEqual(4.5);
    expect(cr(hex(aktiv), hex("#bfe4f6")), "aktiv").toBeGreaterThanOrEqual(4.5);
    expect(steilwand).not.toMatch(/opacity=\{done/);
    expect(steilwand).not.toMatch(/fill="#fffaf0" opacity=/);
  });

  it("Polarstation: Kärtchen ≥ 4,5 : 1 (auch benutzt), Anzeige-Zellen ≥ 3 : 1", () => {
    const farbe = /fill="(#[0-9a-fA-F]{6})"\s+fontFamily="system-ui, sans-serif"\s+className="font-legible"\s*>\s*\{\/\*\s*\n\s*\* PUNKT 2/.exec(station);
    expect(farbe, "Kärtchen-Schriftfarbe").not.toBeNull();
    const schrift = hex(farbe![1]);
    expect(cr(schrift, hex("#f6e4c3")), "Kärtchen").toBeGreaterThanOrEqual(4.5);
    const dim = /opacity=\{used\[i\] \? ([\d.]+) : 1\}/.exec(station);
    expect(dim, "Deckkraft benutzter Kärtchen").not.toBeNull();
    const a = parseFloat(dim![1]);
    const holz = hex("#7a5232");
    expect(cr(mix(schrift, a, holz), mix(hex("#f6e4c3"), a, holz)), `benutztes Kärtchen bei Deckkraft ${a}`).toBeGreaterThanOrEqual(4.5);
    // leere Anzeige-Zelle: Rand und Strich gegen #12494a
    const leer = /next \? "#ffb454" : filled \? "#6fc499" : "(#[0-9a-fA-F]{6})"/.exec(station);
    expect(leer, "Rand leere Zelle").not.toBeNull();
    expect(cr(hex(leer![1]), hex("#12494a")), "Rand leere Zelle").toBeGreaterThanOrEqual(3);
    expect(station, "Strich der leeren Zelle ohne Deckkraft").not.toMatch(/fill="#7fe0a6" opacity=/);
  });

  it("Echo-Höhle: Ringe ≥ 3 : 1 auf ihrem Fleck (hell und dunkel), kommende Stelle ohne Deckkraft", () => {
    const ring = /const ringColor = bright \? "(#[0-9a-fA-F]{6})" : "(#[0-9a-fA-F]{6})"/.exec(cave);
    expect(ring, "ringColor").not.toBeNull();
    const fleck = /rx="52" ry="15" fill=\{bright \? "(#[0-9a-fA-F]{6})" : "(#[0-9a-fA-F]{6})"\} opacity=(?:\{bright \? ([\d.]+) : ([\d.]+)\}|"([\d.]+)")/.exec(cave);
    expect(fleck, "Boden-Fleck").not.toBeNull();
    const bodenHell = hex("#b0a6c6");
    const bodenDunkel = hex("#181322");
    const hellFleck = mix(hex(fleck![1]), parseFloat(fleck![3] ?? fleck![5]), bodenHell);
    const dunkelFleck = mix(hex(fleck![2]), parseFloat(fleck![4] ?? fleck![5]), bodenDunkel);
    expect(cr(hex(ring![1]), hellFleck), "helle Höhle").toBeGreaterThanOrEqual(3);
    expect(cr(hex(ring![2]), dunkelFleck), "dunkle Höhle").toBeGreaterThanOrEqual(3);
    const kommend = /rx="34" ry="11"[^>]*>/.exec(cave)![0];
    expect(kommend, "kommende Stelle ohne Deckkraft").not.toMatch(/opacity=/);
  });
});

describe("★★★★ Nebeninfos der Spiele: `text-ink`, nicht kleiner als `text-base`", () => {
  const DATEIEN = [
    "src/components/typing/PyramidenSchmuck.tsx",
    "src/components/typing/KlassenmatchLauf.tsx",
    "src/components/typing/KlassenmatchLobby.tsx",
    "src/components/typing/KlassenmatchWahl.tsx",
    "src/components/typing/KlassenmatchEinladung.tsx",
    "src/components/typing/KlassenmatchErgebnis.tsx",
    "src/components/typing/KlassenmatchRanking.tsx",
    "src/components/typing/IgluLauf.tsx",
    "src/components/typing/BuchstabensalatLauf.tsx",
    "src/components/typing/RaetselLauf.tsx",
  ];
  const ohneKommentare = (t: string) =>
    t
      .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
      .replace(/(^|[^:])\/\/[^\n]*/g, (m, v) => v + " ".repeat(m.length - v.length));

  it("keine Nebenzeile in `text-ink-soft` / `text-ink-muted` und keine Schrift unter `text-base`", () => {
    for (const rel of DATEIEN) {
      const zeilen = ohneKommentare(lies(rel)).split("\n");
      zeilen.forEach((z, i) => {
        expect(z, `${rel}:${i + 1}`).not.toMatch(/\btext-ink-(soft|muted)\b/);
        expect(z, `${rel}:${i + 1}`).not.toMatch(/\btext-sm\b/);
      });
    }
  });

  it("Pyramide: Steine ohne abschwächende Deckkraft", () => {
    const t = ohneKommentare(lies("src/components/typing/PyramidenSchmuck.tsx"));
    expect(t).not.toMatch(/\bopacity-\d+/);
  });

  it("`text-ink` gegen den Grund ≥ 4,5 : 1 in allen Kontrastmodi", () => {
    const palette = lies("src/lib/contrast.ts");
    const trio = (s: string): Rgb => s.trim().split(/\s+/).map(Number) as Rgb;
    const ink = [...palette.matchAll(/"--c-ink":\s*"([\d ]+)"/g)].map((m) => trio(m[1]));
    const raised = [...palette.matchAll(/"--c-surface-raised":\s*"([\d ]+)"/g)].map((m) => trio(m[1]));
    const surface = [...palette.matchAll(/"--c-surface":\s*"([\d ]+)"/g)].map((m) => trio(m[1]));
    expect(ink.length).toBeGreaterThanOrEqual(5);
    expect(raised.length).toBe(ink.length);
    ink.forEach((i, n) => {
      expect(cr(i, raised[n]), `Modus ${n} auf surface-raised`).toBeGreaterThanOrEqual(4.5);
      expect(cr(i, surface[n]), `Modus ${n} auf surface`).toBeGreaterThanOrEqual(4.5);
    });
  });
});
