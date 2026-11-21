/**
 * SVG-Medaille eines Abzeichens — jedes Abzeichen bekommt seinen eigenen
 * „Orden" (Wunsch Johannes 08.07.): Band in der Farbe der Abzeichen-Familie,
 * Medaillon in der Metall-Stufe der Steigerung (Bronze → Silber → Gold →
 * Diamant), Münz-Riffelung, Glanzlicht, kleine Stufen-Sterne und das
 * Motiv als Prägung in der Mitte.
 *
 * Rein dekorativ (aria-hidden) — die Semantik (Name, Bedingung, verdient am)
 * trägt weiterhin der Text daneben.
 * Noch nicht verdiente Medaillen hängen entsättigt („Silhouette") in der
 * Vitrine; Geheim-Abzeichen zeigen bis zum Verdienen eine graue „?"-Medaille.
 *
 * ── 22.08.2026: FESTE BILDER STATT SYSTEM-EMOJIS ──────────────────────
 *
 * Bis heute stand in der Mitte ein `<text>` mit dem Emoji. Wie die Medaille
 * aussah, entschied damit das GERÄT: Apple Color Emoji auf dem Mac, Segoe UI
 * Emoji unter Windows, Noto auf Android — und auf älteren Schul-Rechnern ein
 * leeres Rechteck, wo ein Ninja stehen sollte. Jetzt liegt in der Mitte ein
 * `<image>` auf ein festes Bild aus dem Motivpool
 * ([[src/lib/abzeichen/motivBild]], Fluent Emoji von Microsoft, MIT).
 *
 * ZWEI STILE, nicht einer (Entscheidung Johannes 22.08.2026):
 *   • Hell und Dunkel bekommen den Stil „Color" — das volle Bild.
 *   • Die fünf KONTRASTMODI bekommen „High Contrast", eine reine
 *     Strichzeichnung. Ein farbiges Bild auf einer goldenen Fläche ist genau
 *     das, was ein Auge mit geringem Kontrastsehen nicht mehr trennt.
 *
 * ⚠️ IN DEN KONTRASTMODI IST DIE GANZE MEDAILLE ZWEIFARBIG. Der Text daneben
 * trägt in diesen Modi Cremeweiß auf Schwarz oder Gelb auf Blau — eine bunte
 * Gold-Medaille daneben wäre ein Fleck, der genau die Trennschärfe frisst, die
 * der Modus herstellen soll. Sie wird darum aus den zwei Farben DES MODUS
 * gezeichnet (Grund + Strich, siehe {@link KONTRAST_MEDAILLE}), und auf
 * dunklem Grund wird die Strichzeichnung per `invert(1)` weiß.
 * Was dabei verloren geht — Familien-Band und Metall-Stufe als Farbe — stand
 * ohnehin nie im zugänglichen Teil: Beides steht als WORT im Text daneben, und
 * die Stufe zusätzlich als Zahl von Sternen, die bleiben.
 */
import { useId } from "react";
import { BADGES, BadgeDef, badgeBild } from "@/lib/typing";
import { GEBIET, type BedienSprache } from "@/lib/bedienSprache";
import { motivBild } from "@/lib/abzeichen/motivBild";
import { useContrast, type ContrastMode } from "@/lib/contrast";
import { grossFuer, type GeruestSprache } from "../../lib/typing/sprachRegister";

/**
 * Die Werkstoffe einer Medaille. Bis 09.08.2026 gab es vier (Bronze → Diamant)
 * und alles Geheime war Gold — bei zwölfstufigen Familien standen dadurch acht
 * gleiche Medaillen hintereinander, und die zwanzig Geheim-Abzeichen sahen aus
 * wie zwanzigmal dasselbe (Befund Johannes: „gibt es jetzt keine Farben mehr
 * sondern nur Gold?"). Jetzt kommen SIEBEN Edelsteine dazu.
 */
type Metal =
  | "bronze"
  | "silber"
  | "gold"
  | "diamant"
  | "platin"
  | "smaragd"
  | "saphir"
  | "rubin"
  | "amethyst"
  | "bernstein"
  | "tuerkis"
  | "obsidian"
  | "grau";

interface MetalColors {
  rim: string;
  rimDark: string;
  face: string;
  faceLight: string;
  detail: string;
  /**
   * Der Saum um das Motiv. Fehlt er, gilt {@link MetalColors.rimDark} — siehe
   * {@link SAUM_TON} für die fünf Metalle, bei denen das nicht reicht.
   */
  saum?: string;
}

const METALS: Record<Metal, MetalColors> = {
  bronze: { rim: "#c98a4b", rimDark: "#8a5a28", face: "#b87a3e", faceLight: "#eec092", detail: "#7a4d20" },
  silber: { rim: "#bfc7d2", rimDark: "#828e9d", face: "#aab4c0", faceLight: "#edf1f6", detail: "#6d7887" },
  // ★★ GOLD IST AM 22.08.2026 DUNKLER GEWORDEN — „Gold auf Gold".
  //    Alt: rim #e5b83a, face #d9a92c, faceLight #f9e196. Auf dieser fast weißen
  //    Goldfläche verschwanden die goldenen Motive des Motivpools (Pokal, Stern,
  //    Krone, Schlüssel, erste Medaille …). Gemessen an den Fluent-Bildern:
  //    26 Motive gingen auf dem hellen Goldton (#f0c64f) unter, auf dem dunklen
  //    (#966e14) nur noch 6. Die neuen Werte legen die Mitte der Prägefläche
  //    genau dorthin; `detail` (Sterne, „?") wandert mit nach unten, damit es
  //    auf dem dunkleren Grund lesbar bleibt.
  gold: { rim: "#a87d15", rimDark: "#6b4d09", face: "#8f6a12", faceLight: "#b8901f", detail: "#3d2c04" },
  // Diamant und Platin waren die beiden WEISSESTEN Flächen (faceLight #f2fbff
  // bzw. #fbf8ff). Weiße und blasse Motive (Gespenst, Schneeflocke, Taube, der
  // Diamant selbst) standen darauf als Umriss ohne Inhalt. Beide sind darum
  // einen Schritt gedeckter — die Hue bleibt, damit die Stufen weiter
  // auseinanderzuhalten sind.
  diamant: { rim: "#8cc4dc", rimDark: "#5e9cb5", face: "#a9d8ea", faceLight: "#cfeaf6", detail: "#2f6178" },
  // Über Diamant: perlmutt-violettes „Platin" — die LETZTE Stufe großer Familien.
  platin: { rim: "#b9a9dd", rimDark: "#7d6bb0", face: "#cbbfea", faceLight: "#e5ddf7", detail: "#4a3b7e" },
  // Die sieben EDELSTEINE (09.08.2026). Sie füllen die lange Mitte großer
  // Familien und geben jedem Geheim-Abzeichen sein eigenes Gesicht. Alle sind
  // hell genug, dass das Emoji-Motiv und die Sterne (Farbe `detail`) darauf
  // sicher lesbar bleiben — auch Obsidian, der bewusst der einzige dunkle ist.
  smaragd: { rim: "#5fbf8a", rimDark: "#2f7d55", face: "#7fd0a2", faceLight: "#ddf7ea", detail: "#1f5b3b" },
  saphir: { rim: "#6b8fd6", rimDark: "#35548f", face: "#86a6e2", faceLight: "#e0e9fb", detail: "#26406f" },
  rubin: { rim: "#d76a72", rimDark: "#94343c", face: "#e0838a", faceLight: "#fbe0e2", detail: "#78242d" },
  amethyst: { rim: "#a888d8", rimDark: "#6a4b9c", face: "#bb9ee4", faceLight: "#efe6fb", detail: "#4f357b" },
  bernstein: { rim: "#d98f2a", rimDark: "#94590f", face: "#e6a445", faceLight: "#fbe5bd", detail: "#7a4708" },
  tuerkis: { rim: "#4fbfc4", rimDark: "#237f83", face: "#74d2d6", faceLight: "#dcf6f7", detail: "#155b5f" },
  obsidian: { rim: "#5a5f6b", rimDark: "#2f3340", face: "#767c8a", faceLight: "#c2c7d1", detail: "#1d2029" },
  grau: { rim: "#b3b8bf", rimDark: "#878d95", face: "#c3c8ce", faceLight: "#e3e6ea", detail: "#7e848b" },
};

/** Bandfarben je Abzeichen-Familie (gedeckte, gut unterscheidbare Töne). */
const RIBBONS: Record<string, { base: string; dark: string }> = {
  Fehlerfrei: { base: "#d64d4d", dark: "#a83535" },
  "Saubere Serie": { base: "#3d76c2", dark: "#2b568f" },
  Fleiß: { base: "#4c9d52", dark: "#376f3b" },
  Anschläge: { base: "#e0812f", dark: "#a95e1f" },
  Dranbleiben: { base: "#2f8f8f", dark: "#206868" },
  Sterne: { base: "#7d5cbf", dark: "#5c418f" },
  Lektionen: { base: "#37568b", dark: "#263d63" },
  // ★ Der Schlüssel muss GENAU der `group`-Name aus badges.ts sein — sonst fällt
  //   die Familie still auf das violette Geheim-Band zurück. Bis 09.08.2026 stand
  //   hier „Spielstufe", die Gruppe heißt aber „Stufen": Die ganze XP-Familie trug
  //   jahrelang das falsche Band.
  Stufen: { base: "#c2538f", dark: "#933c6b" },
  Übungswochen: { base: "#1f6f8f", dark: "#155066" },
  Tastenwelt: { base: "#8aa63c", dark: "#65792b" },
  "Sitzt!": { base: "#2f6b3a", dark: "#204d29" },
  Tempo: { base: "#c25a2a", dark: "#8f411e" },
  "Am Stück": { base: "#566577", dark: "#3c4756" },
  Meisterprüfung: { base: "#cfa227", dark: "#96741a" },
  Abenteuer: { base: "#2f9bb5", dark: "#217086" },
  "Abenteuer-Kunststücke": { base: "#8a6fc0", dark: "#63508f" },
  Expedition: { base: "#6f86d6", dark: "#4d61a3" },
  // Lesen: warme Buch-Töne, damit sich die Lese-Familien vom kühlen Eis der
  // Abenteuer und den Übungs-Familien schon auf einen Blick abheben.
  Geschichten: { base: "#a8763c", dark: "#7a542a" },
  Lesestunde: { base: "#c09a3e", dark: "#8d702a" },
  "Lese-Kunststücke": { base: "#9d5b3c", dark: "#73402a" },
  Geheim: { base: "#5b4b8a", dark: "#413566" },
};

const RIBBON_HIDDEN = { base: "#9aa0a8", dark: "#7c828a" };

/**
 * Die Medaille in den fünf KONTRASTMODI — zwei Farben, sonst nichts.
 *
 * `grund` und `strich` sind exakt die `--c-surface`- und `--c-ink`-Werte aus
 * {@link ContrastMode} (siehe `src/lib/contrast.ts`); sie stehen hier als feste
 * Zeichenketten und nicht als `rgb(var(--c-ink))`, weil die Medaille auch
 * SERVERSEITIG gerendert wird (Prüfblatt `scripts/zeige-abzeichen-medaillen.mts`)
 * und dort keine CSS-Variablen gesetzt sind.
 *
 * `invertiert`: Auf schwarzem und dunkelblauem Grund wird die schwarze
 * Strichzeichnung des Motivs per `invert(1)` weiß. Weiß und nicht Gelb —
 * Weiß auf Schwarz ist der stärkste Kontrast, den es gibt, und das Motiv ist
 * ein Bild, kein Text (die Gelb-Regel gilt der Schrift).
 */
const KONTRAST_MEDAILLE: Record<
  Exclude<ContrastMode, "hell" | "dunkel">,
  { grund: string; strich: string; invertiert: boolean }
> = {
  sw: { grund: "#fffdf0", strich: "#000000", invertiert: false },
  sg: { grund: "#ffec8c", strich: "#000000", invertiert: false },
  ws: { grund: "#000000", strich: "#ffffff", invertiert: true },
  gs: { grund: "#000000", strich: "#ffd600", invertiert: true },
  gb: { grund: "#132e78", strich: "#ffd600", invertiert: true },
};

/**
 * Kantenlänge des Motivs im Medaillon (Prägefläche r = 20,5, Medaillon
 * d = 52). 28 sind rund 55 % des Medaillon-Durchmessers — groß genug, dass ein
 * Kind mit Sehbehinderung das Bild erkennt, und klein genug, dass der Bogen der
 * Stufen-Sterne darunter frei bleibt (Motiv-Unterkante 67, Sterne ab 68,4).
 */
const MOTIV_GROESSE = 28;

/* ══════════════════════════════════════════════════════════════════════════
   ★★★★ DER SAUM TRÄGT DIE FARBE DER MEDAILLE (Johannes 26.08.2026)
   ══════════════════════════════════════════════════════════════════════════
   Anlass - ein SEHENDER Schüler zu Johannes: „bei den Medaillen wird jetzt
   immer so ein schwarzer Schatten und so dunkles Design verwendet. Bei allen."

   Er hatte recht, und es war kein Versehen, sondern die Nebenwirkung von zwei
   richtigen Reparaturen am 22.08.: ein fast schwarzer Halo um JEDES Motiv, und
   ein abgedunkeltes Gold (#d9a92c → #8f6a12) - beides, damit ein helles Motiv
   auf heller Fläche nicht verschwindet. Gold ist zugleich das häufigste
   Metall: Es trägt jedes Einzel- und jedes Geheim-Abzeichen.

   ★★★ Der Grund bleibt gültig, die Mittel ändern sich. Kein Farbton der Welt
   trennt alle 1595 Motive des Pools sicher von ihrem Grund - auf Bronze
   verschwindet ein brauner Bär, auf Smaragd ein grüner Frosch. Der Saum muss
   also bleiben; in den Kontrastmodi entfällt er wie bisher, dort ist das Motiv
   ohnehin einfarbig und steht auf der Grundfarbe des Modus.
   Er ist nur nicht mehr SCHWARZ, sondern nimmt den dunklen Ton DER MEDAILLE
   an: Bronze bekommt einen warmbraunen Rand, Smaragd einen tiefgrünen,
   Saphir einen dunkelblauen. Er trennt genauso, liest sich aber als Kontur des
   Ordens statt als Schlagschatten - und weil er nicht mehr gegen die Farbe
   arbeitet, dürfen Gold, Diamant und Platin wieder hell sein.

   Drei Änderungen, mehr nicht:
     1. {@link MOTIV_SAUM} → {@link saumFarbe} (Farbe der Medaille statt Schwarz)
     2. {@link HELLERE_METALLE} - Gold zurück auf den Ton von vor dem 22.08.,
        Diamant, Platin, Bronze und Obsidian einen Schritt heller
     3. Der Verlauf der Prägefläche endet auf `face` statt auf `rim` - der
        dunkle Rand ringsum („Vignette") fällt weg

   Fest geblieben (Vorgabe Johannes): die Motive und die Sterne im Halbkreis.
   Die fünf Kontrastmodi sind ohnehin nicht berührt - sie zeichnen die Medaille
   aus genau zwei Farben und kennen weder Saum noch Metall. */

/**
 * Die aufgehellten Metalle. Nur die fünf, die am 22.08. gegen die Motive
 * abgedunkelt worden waren - die sieben Edelsteine und Silber waren nie das
 * Problem und bleiben unangetastet.
 *
 * ⚠️ `detail` (Sterne und das „?" der Geheim-Abzeichen) wird MITGEZOGEN, aber
 * nicht so weit wie die Fläche: Es muss auf dem helleren Grund weiterhin
 * lesbar sein. Bei Gold war es #3d2c04 - fast schwarz, und damit selbst ein
 * Teil des dunklen Eindrucks.
 */
const HELLERE_METALLE: Partial<Record<Metal, Partial<MetalColors>>> = {
  // Gold, wie es vor dem 22.08. war.
  gold: { rim: "#e5b83a", rimDark: "#a8801a", face: "#d9a92c", faceLight: "#f9e196", detail: "#6b4d09" },
  diamant: { rim: "#9ed3e8", rimDark: "#6ba9c2", face: "#c2e6f3", faceLight: "#eaf8fd" },
  platin: { rim: "#c9bce9", rimDark: "#8b78bd", face: "#ddd4f3", faceLight: "#f4f0fc" },
  bronze: { rim: "#d99a5c", rimDark: "#a06a34", face: "#c98c50", faceLight: "#f2cfa6" },
  // Der einzige bewusst dunkle Stein - er darf dunkel bleiben, aber nicht so
  // dunkel, dass ein schwarzes Motiv darauf verschwindet.
  obsidian: { rim: "#767c8a", rimDark: "#474c58", face: "#8f95a3", faceLight: "#d5d9e0", detail: "#22262f" },
};

/** Ein Metall in seiner ausgelieferten Fassung - samt geprüftem Saum. */
export function metallTon(name: Metal): MetalColors {
  return {
    ...METALS[name],
    ...(HELLERE_METALLE[name] ?? {}),
    saum: SAUM_TON[name],
  };
}

/** Alle Metalle - nur für den Wächter, der die Saum-Tabelle nachrechnet. */
export const ALLE_METALLE = Object.keys(METALS) as Metal[];
export { SAUM_ZIEL };
export type { Metal, MetalColors };

/**
 * ★★★★ WO `rimDark` ALS SAUM NICHT REICHT - gemessen, nicht geschätzt.
 *
 * Ein Saum, den man auf seiner eigenen Fläche nicht sieht, ist kein Saum. Der
 * Maßstab dafür ist **WCAG 1.4.11 (Nicht-Text-Kontrast): 3:1** - genau die
 * Regel für die Umrisse grafischer Objekte. Gemessen wird gegen `faceLight`,
 * die HELLSTE Stelle der Prägefläche (Mitte des Verlaufs): Dort ist die
 * Trennung am schwersten, und dort steht das Motiv.
 *
 * Fünf Metalle schafften die Marke mit ihrem `rimDark` nicht:
 *
 * | Metall  | `rimDark` | Saum      | vorher | jetzt |
 * |---------|-----------|-----------|-------:|------:|
 * | Bronze  | `#a06a34` | `#9c6733` |   3,09 |  3,24 |
 * | Silber  | `#828e9d` | `#7c8795` |   2,94 |  3,22 |
 * | Gold    | `#a8801a` | `#9c7718` |   2,82 |  3,21 |
 * | Diamant | `#6ba9c2` | `#5b90a6` |   2,39 |  3,23 |
 * | Grau    | `#878d95` | `#797f86` |   2,67 |  3,23 |
 *
 * ⚠️ Silber und Grau lagen schon VOR dem 26.08. unter 3:1 - das fiel nur nicht
 * auf, weil der Saum damals schwarz war und mit der Medaillenfarbe nichts zu
 * tun hatte. Wer den Saum einfärbt, erbt diese Schwäche.
 *
 * Nur der SAUM wird nachgedunkelt, nicht `rimDark` selbst: Der ist der
 * sichtbare Rand und die Riffelung der Medaille, und der soll bleiben, wie er
 * aussieht. Die Abweichung ist klein genug, dass niemand sie als zweite Farbe
 * bemerkt - `#a8801a` gegen `#9c7718`.
 *
 * Der Wächter `tests/typing-badge-medaille.test.tsx` rechnet die Tabelle nach;
 * wer ein Metall aufhellt, ohne den Saum mitzuziehen, bekommt einen roten Test
 * statt eines unsichtbaren Motivs.
 */
const SAUM_ZIEL = 3.2;
const SAUM_TON: Partial<Record<Metal, string>> = {
  bronze: "#9c6733",
  silber: "#7c8795",
  gold: "#9c7718",
  diamant: "#5b90a6",
  grau: "#797f86",
};

/**
 * Der Saum um das Motiv - in der Farbe der Medaille.
 *
 * Zwei Lagen wie bisher: eine harte, dünne Kante, die auch ein blasses Motiv
 * vom Grund abhebt, und darüber ein weicher Hauch, der die Kante nicht
 * schneidend wirken lässt. Er bringt keine neue Farbe ins Bild - es ist der
 * dunkle Ton, den die Medaille als Rand und Riffelung ohnehin trägt.
 */
export function saumFarbe(m: MetalColors): string {
  const ton = m.saum ?? m.rimDark;
  return `drop-shadow(0 0 0.9px ${ton}) drop-shadow(0 0 2.4px ${ton}88)`;
}

const TIER_METALS_3: Metal[] = ["bronze", "silber", "gold"];
const TIER_METALS_4: Metal[] = ["bronze", "silber", "gold", "diamant"];
/**
 * Die Mitte großer Familien (ab der fünften Stufe) — vorher durchgehend Diamant.
 * Die Reihenfolge ist Absicht: warm → kühl → warm, damit auch zwei Nachbarn in
 * der Vitrine nie verwechselt werden.
 */
const EDELSTEIN_METALS: Metal[] = [
  "smaragd",
  "saphir",
  "rubin",
  "amethyst",
  "bernstein",
  "tuerkis",
  "obsidian",
];
/** Die zwanzig geheimen Schätze — jeder in seinem eigenen Werkstoff. */
const SCHATZ_METALS: Metal[] = [
  "gold",
  "smaragd",
  "saphir",
  "rubin",
  "amethyst",
  "bernstein",
  "tuerkis",
  "obsidian",
  "diamant",
  "platin",
];

/** Position und Größe der Familie eines Abzeichens (Definitions-Reihenfolge). */
function familyOf(def: BadgeDef): { size: number; index: number } {
  const fam = BADGES.filter((b) => b.group === def.group);
  return { size: fam.length, index: Math.max(0, fam.findIndex((b) => b.id === def.id)) };
}

/**
 * Höchstzahl der Stufen-Sterne. Bis 09.08.2026 bekam jede Stufe einen eigenen
 * Stern (Stufe 4 = vier Sterne) — das ging gut, solange keine Familie mehr als
 * vier Mitglieder hatte. Mit dem Ausbau auf 105 Abzeichen hat „Tastenwelt"
 * ZWÖLF Stufen; zwölf Sterne in einer Reihe standen weit über den Rand der
 * Medaille hinaus (Befund Johannes). Jetzt zeigen große Familien den Stand
 * ANTEILIG: die erste Stufe einen Stern, die letzte immer fünf.
 */
const MAX_STARS = 5;
/** Mittelpunkt des Medaillons + Radius, auf dem die Sterne sitzen. */
const MEDAL_CX = 32;
const MEDAL_CY = 56;
const STAR_RADIUS = 15.4;
/** Winkelabstand zweier Sterne auf dem Bogen (Grad). */
const STAR_STEP = 22;

/**
 * Die Sterne sitzen auf einem BOGEN am unteren Rand der Innenfläche — wie der
 * Lorbeer eines Ordens. Der Bogen wächst nach außen, bleibt aber immer
 * innerhalb des Medaillons (Innenfläche r = 20,5; Sterne auf r = 15,4).
 */
function starPositions(famSize: number, index: number): Array<{ x: number; y: number }> {
  const count =
    famSize <= MAX_STARS
      ? index + 1
      : Math.max(1, Math.min(MAX_STARS, Math.round(((index + 1) * MAX_STARS) / famSize)));
  const mitte = (count - 1) / 2;
  return Array.from({ length: count }, (_, i) => {
    // 90° zeigt in SVG nach UNTEN — der Bogen liegt also unter dem Motiv.
    const grad = 90 + (i - mitte) * STAR_STEP;
    const bogen = (grad * Math.PI) / 180;
    return {
      x: MEDAL_CX + STAR_RADIUS * Math.cos(bogen),
      y: MEDAL_CY + STAR_RADIUS * Math.sin(bogen),
    };
  });
}

/**
 * Metall-Stufe: Steigerungs-Familien Bronze→…→Diamant, Einzel/Geheim = Gold.
 * Die LETZTE Stufe einer großen Familie (ab fünf Mitgliedern) trägt Platin —
 * sonst sähen bei „Tastenwelt" acht von zwölf Medaillen gleich aus. Die Stufen
 * davor bleiben unverändert: Kein Kind soll eine Medaille, die es schon hat,
 * plötzlich in einem schlechteren Metall vorfinden.
 */
function metalFor(def: BadgeDef): Metal {
  const { size, index } = familyOf(def);
  // ★ GEHEIM: Jedes Abzeichen bekommt seinen EIGENEN Stein — zwanzig geheime
  //   Schätze sollen wie zwanzig Schätze aussehen, nicht zwanzigmal wie Gold
  //   (Johannes 09.08.2026). Die Zuordnung hängt am Platz in der Familie und
  //   ist damit stabil: Ein Kind findet seine Medaille beim nächsten Mal in
  //   derselben Farbe wieder.
  if (def.group === "Geheim") return SCHATZ_METALS[index % SCHATZ_METALS.length];
  // Die Meisterprüfung ist das SCHWERSTE, was es gibt (10-Minuten-Abschrift,
  // Lehrgangs-Meister, goldene Tastatur). Als dreiköpfige Familie hätte sie
  // sonst Bronze–Silber–Gold getragen und damit ausgesehen wie ein Einstieg
  // (gesehen am Prüfblatt, 09.08.2026). Sie beginnt darum oben.
  if (def.group === "Meisterprüfung")
    return (["gold", "diamant", "platin"] as const)[Math.min(index, 2)];
  if (size >= 5 && index === size - 1) return "platin";
  // Die lange MITTE großer Familien (ab der fünften Stufe): Vorher trug sie
  // durchgehend Diamant — bei „Tastenwelt" acht gleiche Medaillen hintereinander.
  // Jetzt wandert sie durch die Edelsteine. Die Stufe selbst liest man weiter an
  // den Sternen ab; die Steine sind der Schmuck, nicht die Auskunft.
  if (size >= 5 && index >= 4)
    return EDELSTEIN_METALS[(index - 4) % EDELSTEIN_METALS.length];
  if (size >= 4) return TIER_METALS_4[Math.min(index, 3)];
  if (size === 3) return TIER_METALS_3[Math.min(index, 2)];
  return "gold";
}

/* ── Die Medaille in Worten ────────────────────────────────────────────────
 *
 * Die Medaille ist `aria-hidden` — für ein Kind mit Blindheit gab es sie bis
 * zum 22.08.2026 schlicht nicht. Das sehende Kind daneben sieht aber einen
 * Ninja auf einer goldenen Scheibe und redet darüber. Seither steht die
 * Medaille als SATZ im sr-only-Text hinter Name und Bedingung.
 *
 * ★ Metall und Bandfarbe kommen AUS DEMSELBEN Bauplan wie die Zeichnung
 *   ({@link metalFor}, {@link RIBBONS}) — in `badges.ts` steht nur das Motiv
 *   in Worten. Sonst wäre nach der nächsten Metall-Änderung die Hälfte der
 *   116 Sätze falsch, und niemandem fiele es auf: Wer den Satz hört, sieht
 *   das Bild nicht, und wer das Bild sieht, hört den Satz nicht.
 */
const METALL_WORT: Record<Metal, string> = {
  bronze: "Bronzene Medaille",
  silber: "Silberne Medaille",
  gold: "Goldene Medaille",
  diamant: "Diamantene Medaille",
  platin: "Platin-Medaille",
  smaragd: "Smaragdgrüne Medaille",
  saphir: "Saphirblaue Medaille",
  rubin: "Rubinrote Medaille",
  amethyst: "Violette Medaille",
  bernstein: "Bernsteingelbe Medaille",
  tuerkis: "Türkise Medaille",
  obsidian: "Obsidiangraue Medaille",
  grau: "Graue Medaille",
};

/**
 * Bandfarbe je Familie in Worten (Wemfall: „mit ROTEM Band").
 * ⚠️ Die Schlüssel müssen dieselben sein wie in {@link RIBBONS} — ein
 * Wächter-Test vergleicht die beiden Tafeln, damit keine Familie ein Band
 * angesagt bekommt, das sie gar nicht trägt.
 */
const BAND_WORT: Record<string, string> = {
  Fehlerfrei: "rotem",
  "Saubere Serie": "blauem",
  Fleiß: "grünem",
  Anschläge: "orangem",
  Dranbleiben: "blaugrünem",
  Sterne: "violettem",
  Lektionen: "dunkelblauem",
  Stufen: "pinkem",
  Übungswochen: "meerblauem",
  Tastenwelt: "olivgrünem",
  "Sitzt!": "dunkelgrünem",
  Tempo: "ziegelrotem",
  "Am Stück": "schiefergrauem",
  Meisterprüfung: "goldgelbem",
  Abenteuer: "eisblauem",
  "Abenteuer-Kunststücke": "hellviolettem",
  Expedition: "kornblumenblauem",
  Geschichten: "hellbraunem",
  Lesestunde: "ockergelbem",
  "Lese-Kunststücke": "rostbraunem",
  Geheim: "dunkelviolettem",
};

/**
 * Die Medaille als ein Satz für die Sprachausgabe.
 *
 * @param secretHidden Geheim-Abzeichen vor dem Verdienen: Dann darf der Satz
 *   das Motiv NICHT verraten — sonst wäre die Überraschung per Sprachausgabe
 *   gelüftet, und ausgerechnet das Kind mit Blindheit bekäme das Rätsel
 *   verdorben, das ein sehendes Kind noch vor sich hat.
 */
export function medaillenBeschreibung(
  def: BadgeDef,
  secretHidden = false,
  sprache: BedienSprache = "de",
): string {
  // ★ O-CS (03.10.2026): tschechisch eigene Fassung.
  if (sprache === "bg") return medaillenBeschreibungBg(def, secretHidden);
  if (sprache === "el") return medaillenBeschreibungEl(def, secretHidden);
  if (sprache === "hu") return medaillenBeschreibungHu(def, secretHidden);
  if (sprache === "nl") return medaillenBeschreibungNl(def, secretHidden);
  if (sprache === "pt") return medaillenBeschreibungPt(def, secretHidden);
  if (sprache === "br") return medaillenBeschreibungBr(def, secretHidden);
  if (sprache === "ro") return medaillenBeschreibungRo(def, secretHidden);
  if (sprache === "sv") return medaillenBeschreibungSv(def, secretHidden);
  if (sprache === "uk") return medaillenBeschreibungUk(def, secretHidden);
  if (sprache === "cs") return medaillenBeschreibungCs(def, secretHidden);
  // ★ O-TR (02.10.2026): türkisch eigene Fassung.
  if (sprache === "tr") return medaillenBeschreibungTr(def, secretHidden);
  // ★ O-IT (02.10.2026): italienisch eigene Fassung.
  if (sprache === "it") return medaillenBeschreibungIt(def, secretHidden);
  // ★ O-PL (02.10.2026): polnisch eigene Fassung.
  if (sprache === "pl") return medaillenBeschreibungPl(def, secretHidden);
  if (sprache === "en") return medaillenBeschreibungEn(def, secretHidden);
  // ★ E11a-5: französisch eigene Fassung - sonst bekäme „fr" hier still den
  // deutschen Satz (Leitfaden Falle 30).
  if (sprache === "fr") return medaillenBeschreibungFr(def, secretHidden);
  // ★ ES-O (27.09.2026): spanisch eigene Fassung - sonst still Deutsch (Falle 30).
  if (sprache === "es") return medaillenBeschreibungEs(def, secretHidden);
  if (secretHidden) return "Graue Medaille mit grauem Band und einem Fragezeichen.";
  const metall = METALL_WORT[metalFor(def)];
  const band = BAND_WORT[def.group] ?? BAND_WORT.Geheim;
  return `${metall} mit ${band} Band, darauf ${def.bildbeschreibung}.`;
}

/**
 * ★ Dieselbe Medaille englisch (EN3, 19.09.2026): „Gold medal on a red ribbon,
 * showing a ninja." Metall und Band aus demselben Bauplan wie die Zeichnung -
 * die Schlüssel sind dieselben wie in {@link METALL_WORT} und {@link BAND_WORT}
 * (der Wächter `tests/tastenflow-englisch-statistik.test.tsx` vergleicht sie).
 * Britisch: *colour*, *grey* (Glossar §1.1).
 */
const METALL_WORT_EN: Record<Metal, string> = {
  bronze: "Bronze medal",
  silber: "Silver medal",
  gold: "Gold medal",
  diamant: "Diamond medal",
  platin: "Platinum medal",
  smaragd: "Emerald green medal",
  saphir: "Sapphire blue medal",
  rubin: "Ruby red medal",
  amethyst: "Violet medal",
  bernstein: "Amber medal",
  tuerkis: "Turquoise medal",
  obsidian: "Obsidian grey medal",
  grau: "Grey medal",
};

/** Bandfarbe je Familie englisch - dieselben Schlüssel wie {@link BAND_WORT}. */
export const BAND_WORT_EN: Record<string, string> = {
  Fehlerfrei: "red",
  "Saubere Serie": "blue",
  Fleiß: "green",
  Anschläge: "orange",
  Dranbleiben: "teal",
  Sterne: "violet",
  Lektionen: "dark blue",
  Stufen: "pink",
  Übungswochen: "sea blue",
  Tastenwelt: "olive green",
  "Sitzt!": "dark green",
  Tempo: "brick red",
  "Am Stück": "slate grey",
  Meisterprüfung: "golden yellow",
  Abenteuer: "ice blue",
  "Abenteuer-Kunststücke": "light violet",
  Expedition: "cornflower blue",
  Geschichten: "light brown",
  Lesestunde: "ochre",
  "Lese-Kunststücke": "rust brown",
  Geheim: "dark violet",
};

function medaillenBeschreibungEn(def: BadgeDef, secretHidden: boolean): string {
  if (secretHidden) return "Grey medal on a grey ribbon, with a question mark.";
  const metall = METALL_WORT_EN[metalFor(def)];
  const band = BAND_WORT_EN[def.group] ?? BAND_WORT_EN.Geheim;
  // „an orange ribbon", „an ice blue ribbon" - der Artikel folgt dem Laut.
  const artikel = /^[aeiou]/i.test(band) ? "an" : "a";
  return `${metall} on ${artikel} ${band} ribbon, showing ${badgeBild(def, "en")}.`;
}

/**
 * ★ Dieselbe Medaille französisch (E11a-5, 26.09.2026): « Médaille d'or au
 * ruban rouge, avec un ninja. » - Metall und Band aus denselben Schlüsseln
 * wie {@link METALL_WORT}/{@link BAND_WORT}; das Motiv aus `badgesFr.ts`.
 * Die Bandfarbe steht nach dem Nomen und ist unveränderlich oder männlich
 * (« le ruban »), darum ohne Angleichung.
 */
const METALL_WORT_FR: Record<Metal, string> = {
  bronze: "Médaille de bronze",
  silber: "Médaille d'argent",
  gold: "Médaille d'or",
  diamant: "Médaille de diamant",
  platin: "Médaille de platine",
  smaragd: "Médaille vert émeraude",
  saphir: "Médaille bleu saphir",
  rubin: "Médaille rouge rubis",
  amethyst: "Médaille violette",
  bernstein: "Médaille ambre",
  tuerkis: "Médaille turquoise",
  obsidian: "Médaille gris obsidienne",
  grau: "Médaille grise",
};

/** Bandfarbe je Familie französisch - dieselben Schlüssel wie {@link BAND_WORT}. */
export const BAND_WORT_FR: Record<string, string> = {
  Fehlerfrei: "rouge",
  "Saubere Serie": "bleu",
  Fleiß: "vert",
  Anschläge: "orange",
  Dranbleiben: "bleu-vert",
  Sterne: "violet",
  Lektionen: "bleu foncé",
  Stufen: "rose",
  Übungswochen: "bleu océan",
  Tastenwelt: "vert olive",
  "Sitzt!": "vert foncé",
  Tempo: "rouge brique",
  "Am Stück": "gris ardoise",
  Meisterprüfung: "jaune doré",
  Abenteuer: "bleu glacier",
  "Abenteuer-Kunststücke": "violet clair",
  Expedition: "bleu bleuet",
  Geschichten: "brun clair",
  Lesestunde: "ocre",
  "Lese-Kunststücke": "brun rouille",
  Geheim: "violet foncé",
};

function medaillenBeschreibungFr(def: BadgeDef, secretHidden: boolean): string {
  if (secretHidden) return "Médaille grise au ruban gris, avec un point d'interrogation.";
  const metall = METALL_WORT_FR[metalFor(def)];
  const band = BAND_WORT_FR[def.group] ?? BAND_WORT_FR.Geheim;
  return `${metall} au ruban ${band}, avec ${badgeBild(def, "fr")}.`;
}

/**
 * ★ Dieselbe Medaille spanisch (ES-O, 27.09.2026): « Medalla de oro con cinta
 * roja, con un ninja. » - dieselben Schlüssel wie {@link METALL_WORT}/
 * {@link BAND_WORT}; das Motiv aus `badgesEs.ts`. Die Bandfarbe richtet sich
 * nach « la cinta » (weiblich); zusammengesetzte Farben bleiben unverändert.
 */
const METALL_WORT_ES: Record<Metal, string> = {
  bronze: "Medalla de bronce",
  silber: "Medalla de plata",
  gold: "Medalla de oro",
  diamant: "Medalla de diamante",
  platin: "Medalla de platino",
  smaragd: "Medalla verde esmeralda",
  saphir: "Medalla azul zafiro",
  rubin: "Medalla rojo rubí",
  amethyst: "Medalla violeta",
  bernstein: "Medalla ámbar",
  tuerkis: "Medalla turquesa",
  obsidian: "Medalla gris obsidiana",
  grau: "Medalla gris",
};

/** Bandfarbe je Familie spanisch - dieselben Schlüssel wie {@link BAND_WORT}. */
export const BAND_WORT_ES: Record<string, string> = {
  Fehlerfrei: "roja",
  "Saubere Serie": "azul",
  Fleiß: "verde",
  Anschläge: "naranja",
  Dranbleiben: "azul verdoso",
  Sterne: "violeta",
  Lektionen: "azul oscuro",
  Stufen: "rosa",
  Übungswochen: "azul océano",
  Tastenwelt: "verde oliva",
  "Sitzt!": "verde oscuro",
  Tempo: "rojo ladrillo",
  "Am Stück": "gris pizarra",
  Meisterprüfung: "amarillo dorado",
  Abenteuer: "azul glaciar",
  "Abenteuer-Kunststücke": "violeta claro",
  Expedition: "azul aciano",
  Geschichten: "marrón claro",
  Lesestunde: "ocre",
  "Lese-Kunststücke": "marrón óxido",
  Geheim: "violeta oscuro",
};

/**
 * ★ Dieselbe Medaille italienisch (O-IT, 02.10.2026): « Medaglia d'oro con
 * nastro rosso, con sopra un ninja. » - dieselben Schlüssel wie
 * {@link METALL_WORT}/{@link BAND_WORT}; das Motiv aus `badgesIt.ts`. Die
 * Bandfarbe richtet sich nach « il nastro » (männlich).
 */
const METALL_WORT_IT: Record<Metal, string> = {
  bronze: "Medaglia di bronzo",
  silber: "Medaglia d'argento",
  gold: "Medaglia d'oro",
  diamant: "Medaglia di diamante",
  platin: "Medaglia di platino",
  smaragd: "Medaglia verde smeraldo",
  saphir: "Medaglia blu zaffiro",
  rubin: "Medaglia rosso rubino",
  amethyst: "Medaglia viola",
  bernstein: "Medaglia color ambra",
  tuerkis: "Medaglia turchese",
  obsidian: "Medaglia grigio ossidiana",
  grau: "Medaglia grigia",
};

/** Bandfarbe je Familie italienisch - dieselben Schlüssel wie {@link BAND_WORT}. */
export const BAND_WORT_IT: Record<string, string> = {
  Fehlerfrei: "rosso",
  "Saubere Serie": "blu",
  Fleiß: "verde",
  Anschläge: "arancione",
  Dranbleiben: "verde acqua",
  Sterne: "viola",
  Lektionen: "blu scuro",
  Stufen: "rosa",
  Übungswochen: "blu oceano",
  Tastenwelt: "verde oliva",
  "Sitzt!": "verde scuro",
  Tempo: "rosso mattone",
  "Am Stück": "grigio ardesia",
  Meisterprüfung: "giallo oro",
  Abenteuer: "azzurro ghiaccio",
  "Abenteuer-Kunststücke": "viola chiaro",
  Expedition: "blu fiordaliso",
  Geschichten: "marrone chiaro",
  Lesestunde: "ocra",
  "Lese-Kunststücke": "color ruggine",
  Geheim: "viola scuro",
};

function medaillenBeschreibungIt(def: BadgeDef, secretHidden: boolean): string {
  if (secretHidden) return "Medaglia grigia con nastro grigio e un punto interrogativo.";
  const metall = METALL_WORT_IT[metalFor(def)];
  const band = BAND_WORT_IT[def.group] ?? BAND_WORT_IT.Geheim;
  return `${metall} con nastro ${band}, con sopra ${badgeBild(def, "it")}.`;
}

/**
 * ★ Dieselbe Medaille polnisch (O-PL, 02.10.2026): „Złoty medal na czerwonej
 * wstążce, a na nim ninja." - dieselben Schlüssel wie {@link METALL_WORT}/
 * {@link BAND_WORT}; das Motiv aus `badgesPl.ts`. Die Bandfarbe steht im
 * Lokativ und richtet sich nach „wstążka" (weiblich): „na czerwonej wstążce".
 * Das Motiv steht nach „a na nim" im Nominativ (Glossar Regel 11) - so muss
 * kein Motiv gebeugt werden.
 */
const METALL_WORT_PL: Record<Metal, string> = {
  bronze: "Brązowy medal",
  silber: "Srebrny medal",
  gold: "Złoty medal",
  diamant: "Diamentowy medal",
  platin: "Platynowy medal",
  smaragd: "Szmaragdowy medal",
  saphir: "Szafirowy medal",
  rubin: "Rubinowy medal",
  amethyst: "Fioletowy medal",
  bernstein: "Bursztynowy medal",
  tuerkis: "Turkusowy medal",
  obsidian: "Grafitowy medal",
  grau: "Szary medal",
};

/** Bandfarbe je Familie polnisch, Lokativ weiblich - dieselben Schlüssel wie {@link BAND_WORT}. */
export const BAND_WORT_PL: Record<string, string> = {
  Fehlerfrei: "czerwonej",
  "Saubere Serie": "niebieskiej",
  Fleiß: "zielonej",
  Anschläge: "pomarańczowej",
  Dranbleiben: "morskozielonej",
  Sterne: "fioletowej",
  Lektionen: "granatowej",
  Stufen: "różowej",
  Übungswochen: "morskiej",
  Tastenwelt: "oliwkowej",
  "Sitzt!": "ciemnozielonej",
  Tempo: "ceglastej",
  "Am Stück": "łupkowoszarej",
  Meisterprüfung: "złocistej",
  Abenteuer: "lodowobłękitnej",
  "Abenteuer-Kunststücke": "jasnofioletowej",
  Expedition: "chabrowej",
  Geschichten: "jasnobrązowej",
  Lesestunde: "ochrowej",
  "Lese-Kunststücke": "rdzawej",
  Geheim: "ciemnofioletowej",
};

/**
 * ★ O-PL (02.10.2026): das Datum einer Odznaka polnisch - „5 września 2026"
 * (Monat im Genitiv, wie Intl ihn liefert; Glossar §2.10: nie selbst
 * zusammensetzen). Für Regal und Gross-Ansicht, solange `fmtTagMonatJahr`
 * (`datum.ts`) kein „pl" kennt.
 */
export function datumOdznaki(ts: number): string {
  return new Date(ts).toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" });
}

function medaillenBeschreibungPl(def: BadgeDef, secretHidden: boolean): string {
  if (secretHidden) return "Szary medal na szarej wstążce, a na nim znak zapytania.";
  const metall = METALL_WORT_PL[metalFor(def)];
  const band = BAND_WORT_PL[def.group] ?? BAND_WORT_PL.Geheim;
  return `${metall} na ${band} wstążce, a na nim ${badgeBild(def, "pl")}.`;
}

/**
 * ★ Dieselbe Medaille türkisch (O-TR, 02.10.2026): "Kırmızı kurdeleli altın
 * rozet. Üzerindeki resim: ninja." - dieselben Schlüssel wie
 * {@link METALL_WORT}/{@link BAND_WORT}; das Motiv aus `badgesTr.ts`. Das
 * Motiv steht nach einem Doppelpunkt (Glossar Regel 6) - so braucht kein
 * Motiv eine Endung. "rozet" auch für die gezeichnete Medaille (Glossar §2.4:
 * EINE Form, nie "madalya").
 */
const METALL_WORT_TR: Record<Metal, string> = {
  bronze: "bronz rozet",
  silber: "gümüş rozet",
  gold: "altın rozet",
  diamant: "elmas rozet",
  platin: "platin rozet",
  smaragd: "zümrüt yeşili rozet",
  saphir: "safir mavisi rozet",
  rubin: "yakut kırmızısı rozet",
  amethyst: "mor rozet",
  bernstein: "kehribar rengi rozet",
  tuerkis: "turkuaz rozet",
  obsidian: "koyu gri rozet",
  grau: "gri rozet",
};

/** Bandfarbe je Familie türkisch - dieselben Schlüssel wie {@link BAND_WORT}. */
export const BAND_WORT_TR: Record<string, string> = {
  Fehlerfrei: "kırmızı",
  "Saubere Serie": "mavi",
  Fleiß: "yeşil",
  Anschläge: "turuncu",
  Dranbleiben: "camgöbeği",
  Sterne: "mor",
  Lektionen: "lacivert",
  Stufen: "pembe",
  Übungswochen: "deniz mavisi",
  Tastenwelt: "zeytin yeşili",
  "Sitzt!": "koyu yeşil",
  Tempo: "kiremit rengi",
  "Am Stück": "kurşun rengi",
  Meisterprüfung: "altın sarısı",
  Abenteuer: "buz mavisi",
  "Abenteuer-Kunststücke": "açık mor",
  Expedition: "peygamber çiçeği mavisi",
  Geschichten: "açık kahverengi",
  Lesestunde: "toprak sarısı",
  "Lese-Kunststücke": "pas rengi",
  Geheim: "koyu mor",
};

/**
 * ★ O-TR (02.10.2026): das Datum eines Rozet türkisch - "21 Eylül 2026"
 * (Monat gross, wie Intl "tr-TR" ihn liefert; Glossar §2.10). Für Regal und
 * Gross-Ansicht, solange `fmtTagMonatJahr` (`datum.ts`) kein "tr" kennt.
 */
export function datumRozet(ts: number): string {
  return new Date(ts).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

function medaillenBeschreibungTr(def: BadgeDef, secretHidden: boolean): string {
  if (secretHidden) return "Gri kurdeleli gri rozet. Üzerindeki resim: soru işareti.";
  const metall = METALL_WORT_TR[metalFor(def)];
  const band = BAND_WORT_TR[def.group] ?? BAND_WORT_TR.Geheim;
  // Satzanfang mit `grossFuer` (i/İ), nie `toUpperCase()` (Glossar Regel 9).
  const satz = `${band} kurdeleli ${metall}. Üzerindeki resim: ${badgeBild(def, "tr")}.`;
  return grossFuer(satz.charAt(0), "tr") + satz.slice(1);
}

/**
 * ★ Dieselbe Medaille tschechisch (O-CS, 03.10.2026): „Zlatý odznak na
 * červené stuze, na něm: nindža." - dieselben Schlüssel wie
 * {@link METALL_WORT}/{@link BAND_WORT}; das Motiv aus `badgesCs.ts`. Die
 * Bandfarbe steht im Lokativ und richtet sich nach „stuha" (weiblich): „na
 * červené stuze". Das Motiv steht nach einem Doppelpunkt im Nominativ
 * (Glossar Regel 12) - so muss kein Motiv gebeugt werden. „odznak" auch für
 * die gezeichnete Medaille (Glossar §2.4: EINE Form, nie „medaile").
 */
const METALL_WORT_CS: Record<Metal, string> = {
  bronze: "Bronzový odznak",
  silber: "Stříbrný odznak",
  gold: "Zlatý odznak",
  diamant: "Diamantový odznak",
  platin: "Platinový odznak",
  smaragd: "Smaragdový odznak",
  saphir: "Safírový odznak",
  rubin: "Rubínový odznak",
  amethyst: "Fialový odznak",
  bernstein: "Jantarový odznak",
  tuerkis: "Tyrkysový odznak",
  obsidian: "Grafitový odznak",
  grau: "Šedý odznak",
};

/** Bandfarbe je Familie tschechisch, Lokativ weiblich - dieselben Schlüssel wie {@link BAND_WORT}. */
export const BAND_WORT_CS: Record<string, string> = {
  Fehlerfrei: "červené",
  "Saubere Serie": "modré",
  Fleiß: "zelené",
  Anschläge: "oranžové",
  Dranbleiben: "modrozelené",
  Sterne: "fialové",
  Lektionen: "tmavě modré",
  Stufen: "růžové",
  Übungswochen: "azurové",
  Tastenwelt: "olivové",
  "Sitzt!": "tmavě zelené",
  Tempo: "cihlové",
  "Am Stück": "břidlicově šedé",
  Meisterprüfung: "zlatožluté",
  Abenteuer: "ledově modré",
  "Abenteuer-Kunststücke": "světle fialové",
  Expedition: "chrpově modré",
  Geschichten: "světle hnědé",
  Lesestunde: "okrové",
  "Lese-Kunststücke": "rezavé",
  Geheim: "tmavě fialové",
};

/**
 * ★ O-CS (03.10.2026): das Datum eines Odznak tschechisch - „21. září 2026"
 * (Monat im Genitiv, wie Intl „cs-CZ" ihn liefert; Glossar §4 Falle 7: nie
 * selbst bilden). Für Regal und Gross-Ansicht.
 */
export function datumOdznaku(ts: number): string {
  return new Date(ts).toLocaleDateString("cs-CZ", { day: "numeric", month: "long", year: "numeric" });
}

function medaillenBeschreibungCs(def: BadgeDef, secretHidden: boolean): string {
  if (secretHidden) return "Šedý odznak na šedé stuze, na něm: otazník.";
  const metall = METALL_WORT_CS[metalFor(def)];
  const band = BAND_WORT_CS[def.group] ?? BAND_WORT_CS.Geheim;
  return `${metall} na ${band} stuze, na něm: ${badgeBild(def, "cs")}.`;
}

function medaillenBeschreibungEs(def: BadgeDef, secretHidden: boolean): string {
  if (secretHidden) return "Medalla gris con cinta gris y un signo de interrogación.";
  const metall = METALL_WORT_ES[metalFor(def)];
  const band = BAND_WORT_ES[def.group] ?? BAND_WORT_ES.Geheim;
  return `${metall} con cinta ${band}, con ${badgeBild(def, "es")}.`;
}

export interface BadgeMedalProps {
  def: BadgeDef;
  /** Verdient? Sonst hängt die Medaille entsättigt in der Vitrine. */
  earned?: boolean;
  /** Geheim-Abzeichen vor dem Verdienen: graue „?"-Medaille. */
  secretHidden?: boolean;
  /** Höhe in px (Breite ergibt sich aus dem Seitenverhältnis 64:84). */
  size?: number;
  className?: string;
  /**
   * Farbmodus von außen vorgeben statt aus dem globalen Kontrast-Speicher zu
   * lesen. Nur für Prüfblatt und Wächter-Tests gedacht: Beide müssen alle
   * sieben Modi NEBENEINANDER zeigen können, und das geht mit einem globalen
   * Speicher nicht. In der App bleibt der Wert leer.
   */
  modus?: ContrastMode;
}

export function BadgeMedal({
  def,
  earned = true,
  secretHidden = false,
  size = 44,
  className,
  modus,
}: BadgeMedalProps) {
  // useId liefert „:r1:" — Doppelpunkte stören url(#…), daher säubern.
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  // ★ Kontrast = jeder Modus AUSSER Hell und Dunkel. Die beiden sind die
  //   Standard-Themen und steuern nur die Tailwind-dark-Klasse; die fünf
  //   anderen bringen eine eigene Zwei-Farben-Palette mit (contrast.ts).
  const gewaehlt = useContrast((s) => s.mode);
  const mode = modus ?? gewaehlt;
  const kontrast = mode !== "hell" && mode !== "dunkel" ? KONTRAST_MEDAILLE[mode] : null;

  const m = metallTon(secretHidden ? "grau" : metalFor(def));
  const ribbon = secretHidden ? RIBBON_HIDDEN : (RIBBONS[def.group] ?? RIBBONS.Geheim);
  const { size: famSize, index } = familyOf(def);
  const showStars = !secretHidden && def.group !== "Geheim" && famSize >= 3;
  const stars = starPositions(famSize, index);

  // Zwei Farbsätze, ein Bauplan: Im Kontrastmodus tritt überall dieselbe
  // Grund-/Strichfarbe an die Stelle der Metall- und Bandtöne.
  const grund = kontrast?.grund;
  const strich = kontrast?.strich;
  const randFarbe = strich ?? m.rimDark;
  const detailFarbe = strich ?? m.detail;
  const flaeche = kontrast ? kontrast.grund : `url(#${uid}-face)`;
  const randFlaeche = kontrast ? kontrast.grund : `url(#${uid}-rim)`;

  // Noch nicht verdient: entsättigte Silhouette. Im Kontrastmodus wäre
  // `grayscale` sinnlos (die Medaille IST schon zweifarbig) und schädlich —
  // es zöge genau den Kontrast heraus, den der Modus herstellen soll. Dort
  // bleibt nur die halbe Deckkraft; dass ein Abzeichen fehlt, sagt ohnehin der
  // Text daneben („noch nicht verdient").
  const nichtVerdient = kontrast ? { filter: "opacity(0.55)" } : { filter: "grayscale(0.9) opacity(0.5)" };

  return (
    <svg
      viewBox="0 0 64 84"
      width={(size * 64) / 84}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={className}
      style={earned ? undefined : nichtVerdient}
    >
      {!kontrast && (
        <defs>
          <radialGradient id={`${uid}-rim`} cx="35%" cy="28%" r="85%">
            <stop offset="0%" stopColor={m.faceLight} />
            <stop offset="55%" stopColor={m.rim} />
            <stop offset="100%" stopColor={m.rimDark} />
          </radialGradient>
          {/* ★ Der äußerste Halt war `m.rim` und damit der dunkelste Ton der
              Fläche - das ergab einen Schattenrand ringsum („Vignette"), einen
              zweiten Anteil am dunklen Eindruck. Der Verlauf endet jetzt auf
              `m.face`: hell in der Mitte, mittig am Rand, nirgends dunkel.
              Den Abschluss nach außen macht ohnehin der geprägte Ring. */}
          <radialGradient id={`${uid}-face`} cx="38%" cy="32%" r="78%">
            <stop offset="0%" stopColor={m.faceLight} />
            <stop offset="70%" stopColor={m.face} />
            <stop offset="100%" stopColor={m.face} />
          </radialGradient>
        </defs>
      )}

      {/* Ordensband (V-Form): links heller, rechts dunkler Ton + Lichtstreifen.
          Im Kontrastmodus: linke Hälfte voll, rechte Hälfte offen mit Kontur —
          die V-Form bleibt so auch in zwei Farben ablesbar. */}
      <path d="M15 0 L28 0 L32 25 L21 30 Z" fill={strich ?? ribbon.base} />
      <path
        d="M49 0 L36 0 L32 25 L43 30 Z"
        fill={grund ?? ribbon.dark}
        stroke={kontrast ? strich : undefined}
        strokeWidth={kontrast ? 1.2 : undefined}
      />
      {!kontrast && (
        <>
          <path d="M19.5 0 L23 0 L26.8 27.3 L23.6 28.8 Z" fill="#fff" opacity="0.22" />
          <path d="M44.5 0 L41 0 L37.2 27.3 L40.4 28.8 Z" fill="#fff" opacity="0.14" />
        </>
      )}
      {/* Öse zwischen Band und Medaillon */}
      <circle cx="32" cy="28.5" r="4" fill="none" stroke={randFarbe} strokeWidth="2.6" />

      {/* Medaillon: Metallrand mit Münz-Riffelung, geprägte Innenfläche, Glanz */}
      <circle cx="32" cy="56" r="26" fill={randFlaeche} stroke={randFarbe} strokeWidth={kontrast ? 1.6 : 1} />
      <circle
        cx="32"
        cy="56"
        r="24.2"
        fill="none"
        stroke={randFarbe}
        strokeWidth="1.5"
        strokeDasharray="2.1 1.7"
        opacity={kontrast ? 1 : 0.55}
      />
      <circle
        cx="32"
        cy="56"
        r="20.5"
        fill={flaeche}
        stroke={detailFarbe}
        strokeWidth={kontrast ? 1.2 : 0.8}
      />
      {/* Glanzlicht: im Kontrastmodus weggelassen — ein halbdurchsichtiger
          weißer Fleck trübt genau die Fläche, auf der das Motiv steht. */}
      {!kontrast && (
        <ellipse
          cx="24.5"
          cy="47"
          rx="10"
          ry="5.5"
          fill="#fff"
          opacity="0.32"
          transform="rotate(-24 24.5 47)"
        />
      )}

      {/* Motiv: festes Bild aus dem Motivpool (Fluent Emoji, MIT); bei
          verborgenen Geheim-Abzeichen stattdessen ein „?".
          ⚠️ Bewusst KEIN Nachladen erst beim Sichtbarwerden: Weder `<image>`
          noch ein IntersectionObserver wäre hier ein guter Handel. Die volle
          Abzeichen-Liste ist zugeklappt, solange niemand sie aufklappt — die
          116 Bilder (je ~21 kB, danach im Browser-Zwischenspeicher) fallen also
          nur bei einem ausdrücklichen Klick an. Ein Beobachter, der einmal
          nicht auslöst, hinterlässt dagegen eine LEERE Medaille, und weil das
          SVG `aria-hidden` ist, merkt das niemand mit Blindheit und ein
          sehendes Kind erst beim Hinsehen. */}
      {secretHidden ? (
        <text
          x="32"
          y="57"
          fontSize="24"
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="central"
          fill={detailFarbe}
        >
          ?
        </text>
      ) : (
        <image
          href={motivBild(def.emoji, !!kontrast)}
          x={32 - MOTIV_GROESSE / 2}
          y={(showStars ? 53 : 56) - MOTIV_GROESSE / 2}
          width={MOTIV_GROESSE}
          height={MOTIV_GROESSE}
          preserveAspectRatio="xMidYMid meet"
          style={
            kontrast
              ? kontrast.invertiert
                ? { filter: "invert(1)" }
                : undefined
              : { filter: saumFarbe(m) }
          }
        />
      )}

      {/* Stufen-Sterne der Steigerungs-Familie — als Bogen am unteren Rand */}
      {showStars &&
        stars.map((s, i) => (
          <text
            key={i}
            x={s.x}
            y={s.y}
            fontSize="6"
            textAnchor="middle"
            dominantBaseline="central"
            fill={detailFarbe}
          >
            ★
          </text>
        ))}
    </svg>
  );
}

// ★ O2-COMP (30.10.2026): bg eigene Fassung.
/**
 * ★ O2-COMP (29.10.2026): dieselbe Medaille bulgarisch - „Златна значка на червена лента,
 * на нея: нинджа." Das Motiv steht nach dem Doppelpunkt (wie cs), so muss nichts angepasst
 * werden. „значка" (f.) auch für die gezeichnete Medaille (Glossar §2.4: EINE Form);
 * Bandfarbe als Adjektiv weiblich, passend zu „лента" (f.).
 */
const METALL_WORT_BG: Record<Metal, string> = {
  bronze: "Бронзова значка",
  silber: "Сребърна значка",
  gold: "Златна значка",
  diamant: "Диамантена значка",
  platin: "Платинена значка",
  smaragd: "Изумруденозелена значка",
  saphir: "Сапфиреносиня значка",
  rubin: "Рубиненочервена значка",
  amethyst: "Виолетова значка",
  bernstein: "Кехлибарена значка",
  tuerkis: "Тюркоазена значка",
  obsidian: "Графитеносива значка",
  grau: "Сива значка",
};

/** Bandfarbe je Familie bulgarisch, weiblich (лента) - dieselben Schlüssel wie {@link BAND_WORT}. */
export const BAND_WORT_BG: Record<string, string> = {
  Fehlerfrei: "червена",
  "Saubere Serie": "синя",
  Fleiß: "зелена",
  Anschläge: "оранжева",
  Dranbleiben: "синьозелена",
  Sterne: "виолетова",
  Lektionen: "тъмносиня",
  Stufen: "розова",
  Übungswochen: "морскосиня",
  Tastenwelt: "маслиненозелена",
  "Sitzt!": "тъмнозелена",
  Tempo: "керемиденочервена",
  "Am Stück": "синкавосива",
  Meisterprüfung: "златистожълта",
  Abenteuer: "ледено синя",
  "Abenteuer-Kunststücke": "светловиолетова",
  Expedition: "метличиненосиня",
  Geschichten: "светлокафява",
  Lesestunde: "охрена",
  "Lese-Kunststücke": "ръждивокафява",
  Geheim: "тъмновиолетова",
};

function medaillenBeschreibungBg(def: BadgeDef, secretHidden: boolean): string {
  if (secretHidden) return "Сива значка на сива лента, на нея: въпросителен знак.";
  const metall = METALL_WORT_BG[metalFor(def)];
  const band = BAND_WORT_BG[def.group] ?? BAND_WORT_BG.Geheim;
  return `${metall} на ${band} лента, на нея: ${badgeBild(def, "bg")}.`;
}

// ★ O2-COMP (30.10.2026): el eigene Fassung.
/**
 * ★ O2-COMP el: dieselbe Medaille griechisch - „Χρυσό μετάλλιο σε κόκκινη κορδέλα. Πάνω του: ...".
 * μετάλλιο für Abzeichen UND Medaille (Glossar §2.4), sächlich ⇒ „Πάνω του". Das Motiv steht
 * nach dem Doppelpunkt im Nominativ - nichts muss gebeugt werden. Bandfarbe: Akkusativ weiblich
 * (κορδέλα f.); μπλε, μοβ, ροζ, γκρι, ώχρα sind unveränderlich.
 */
const METALL_WORT_EL: Record<Metal, string> = {
  bronze: "Χάλκινο μετάλλιο",
  silber: "Ασημένιο μετάλλιο",
  gold: "Χρυσό μετάλλιο",
  diamant: "Διαμαντένιο μετάλλιο",
  platin: "Πλατινένιο μετάλλιο",
  smaragd: "Σμαραγδένιο μετάλλιο",
  saphir: "Ζαφειρένιο μετάλλιο",
  rubin: "Ρουμπινένιο μετάλλιο",
  amethyst: "Μοβ μετάλλιο",
  bernstein: "Κεχριμπαρένιο μετάλλιο",
  tuerkis: "Τιρκουάζ μετάλλιο",
  obsidian: "Ανθρακί μετάλλιο",
  grau: "Γκρι μετάλλιο",
};

/** Bandfarbe je Familie griechisch, Akkusativ weiblich - dieselben Schlüssel wie {@link BAND_WORT}. */
export const BAND_WORT_EL: Record<string, string> = {
  Fehlerfrei: "κόκκινη",
  "Saubere Serie": "μπλε",
  Fleiß: "πράσινη",
  Anschläge: "πορτοκαλί",
  Dranbleiben: "γαλαζοπράσινη",
  Sterne: "μοβ",
  Lektionen: "σκούρα μπλε",
  Stufen: "ροζ",
  Übungswochen: "θαλασσιά",
  Tastenwelt: "λαδί",
  "Sitzt!": "σκούρα πράσινη",
  Tempo: "κεραμιδί",
  "Am Stück": "σκούρα γκρι",
  Meisterprüfung: "χρυσοκίτρινη",
  Abenteuer: "ανοιχτογάλαζη",
  "Abenteuer-Kunststücke": "ανοιχτή μοβ",
  Expedition: "κυανή",
  Geschichten: "ανοιχτή καφέ",
  Lesestunde: "ώχρα",
  "Lese-Kunststücke": "καφεκόκκινη",
  Geheim: "σκούρα μοβ",
};

function medaillenBeschreibungEl(def: BadgeDef, secretHidden: boolean): string {
  if (secretHidden) return "Γκρι μετάλλιο σε γκρι κορδέλα. Πάνω του: ερωτηματικό.";
  const metall = METALL_WORT_EL[metalFor(def)];
  const band = BAND_WORT_EL[def.group] ?? BAND_WORT_EL.Geheim;
  return `${metall} σε ${band} κορδέλα. Πάνω του: ${badgeBild(def, "el")}.`;
}

// ★ O2-COMP (30.10.2026): hu eigene Fassung.
/**
 * ★ O2-COMP hu: „Aranyjelvény piros szalagon, rajta: nindzsa." Das Motiv steht nach
 * einem Doppelpunkt im Nominativ (Glossar Regel 12) - so muss nichts gebeugt werden.
 * „jelvény" auch für die gezeichnete Medaille (Glossar §2.4).
 */
const METALL_WORT_HU: Record<Metal, string> = {
  bronze: "Bronzjelvény",
  silber: "Ezüstjelvény",
  gold: "Aranyjelvény",
  diamant: "Gyémántjelvény",
  platin: "Platinajelvény",
  smaragd: "Smaragdzöld jelvény",
  saphir: "Zafírkék jelvény",
  rubin: "Rubinvörös jelvény",
  amethyst: "Lila jelvény",
  bernstein: "Borostyánszínű jelvény",
  tuerkis: "Türkizkék jelvény",
  obsidian: "Grafitszürke jelvény",
  grau: "Szürke jelvény",
};

/** Bandfarbe je Familie ungarisch (Adjektiv vor „szalagon") - dieselben Schlüssel wie {@link BAND_WORT}. */
export const BAND_WORT_HU: Record<string, string> = {
  Fehlerfrei: "piros",
  "Saubere Serie": "kék",
  Fleiß: "zöld",
  Anschläge: "narancssárga",
  Dranbleiben: "kékeszöld",
  Sterne: "lila",
  Lektionen: "sötétkék",
  Stufen: "rózsaszín",
  Übungswochen: "tengerkék",
  Tastenwelt: "olívazöld",
  "Sitzt!": "sötétzöld",
  Tempo: "téglavörös",
  "Am Stück": "palaszürke",
  Meisterprüfung: "aranysárga",
  Abenteuer: "jégkék",
  "Abenteuer-Kunststücke": "világoslila",
  Expedition: "búzavirágkék",
  Geschichten: "világosbarna",
  Lesestunde: "okkersárga",
  "Lese-Kunststücke": "rozsdabarna",
  Geheim: "sötétlila",
};

function medaillenBeschreibungHu(def: BadgeDef, secretHidden: boolean): string {
  if (secretHidden) return "Szürke jelvény szürke szalagon, rajta: kérdőjel.";
  const metall = METALL_WORT_HU[metalFor(def)];
  const band = BAND_WORT_HU[def.group] ?? BAND_WORT_HU.Geheim;
  return `${metall} ${band} szalagon, rajta: ${badgeBild(def, "hu")}.`;
}

// ★ O2-COMP (30.10.2026): nl eigene Fassung.
/**
 * ★ Dieselbe Medaille niederländisch: „Gouden medaille aan een rood lint, met daarop: een ninja."
 * Glossar §2.4: „medaille" für Abzeichen UND Medaille. Das Motiv steht nach einem Doppelpunkt
 * (wie cs) - so muss nichts gebeugt werden. „lint" ist ein het-Wort: nach „een" bleibt die
 * Farbe ungebeugt („een rood lint"), darum stehen die Bandfarben hier in der Grundform.
 */
const METALL_WORT_NL: Record<Metal, string> = {
  bronze: "Bronzen medaille",
  silber: "Zilveren medaille",
  gold: "Gouden medaille",
  diamant: "Diamanten medaille",
  platin: "Platina medaille",
  smaragd: "Smaragdgroene medaille",
  saphir: "Saffierblauwe medaille",
  rubin: "Robijnrode medaille",
  amethyst: "Paarse medaille",
  bernstein: "Amberkleurige medaille",
  tuerkis: "Turquoise medaille",
  obsidian: "Antracietgrijze medaille",
  grau: "Grijze medaille",
};

/** Bandfarbe je Familie niederländisch (ungebeugt vor „lint") - dieselben Schlüssel wie {@link BAND_WORT}. */
export const BAND_WORT_NL: Record<string, string> = {
  Fehlerfrei: "rood",
  "Saubere Serie": "blauw",
  Fleiß: "groen",
  Anschläge: "oranje",
  Dranbleiben: "blauwgroen",
  Sterne: "paars",
  Lektionen: "donkerblauw",
  Stufen: "roze",
  Übungswochen: "zeeblauw",
  Tastenwelt: "olijfgroen",
  "Sitzt!": "donkergroen",
  Tempo: "steenrood",
  "Am Stück": "leigrijs",
  Meisterprüfung: "goudgeel",
  Abenteuer: "ijsblauw",
  "Abenteuer-Kunststücke": "lichtpaars",
  Expedition: "korenbloemblauw",
  Geschichten: "lichtbruin",
  Lesestunde: "okergeel",
  "Lese-Kunststücke": "roestbruin",
  Geheim: "donkerpaars",
};

function medaillenBeschreibungNl(def: BadgeDef, secretHidden: boolean): string {
  if (secretHidden) return "Grijze medaille aan een grijs lint, met daarop: een vraagteken.";
  const metall = METALL_WORT_NL[metalFor(def)];
  const band = BAND_WORT_NL[def.group] ?? BAND_WORT_NL.Geheim;
  return `${metall} aan een ${band} lint, met daarop: ${badgeBild(def, "nl")}.`;
}

// ★ O2-COMP (30.10.2026): pt eigene Fassung.
/**
 * ★ Dieselbe Medaille portugiesisch (Portugal): „Medalha de ouro numa fita
 * vermelha, com a imagem: …". Das Motiv steht nach dem Doppelpunkt (wie cs),
 * so muss nichts gebeugt werden; `badgeBild(def, "pt")` bringt den Artikel mit.
 * Bandfarben weiblich zur „fita"; zusammengesetzte Farbwörter beugen nur den
 * letzten Teil („azul-escura") oder bleiben fest („cor-de-rosa", „azul-gelo").
 */
const METALL_WORT_PT: Record<Metal, string> = {
  bronze: "Medalha de bronze",
  silber: "Medalha de prata",
  gold: "Medalha de ouro",
  diamant: "Medalha de diamante",
  platin: "Medalha de platina",
  smaragd: "Medalha verde-esmeralda",
  saphir: "Medalha azul-safira",
  rubin: "Medalha vermelho-rubi",
  amethyst: "Medalha violeta",
  bernstein: "Medalha cor de âmbar",
  tuerkis: "Medalha turquesa",
  obsidian: "Medalha cinzento-escura",
  grau: "Medalha cinzenta",
};

/** Bandfarbe je Familie portugiesisch, weiblich zur „fita" - dieselben Schlüssel wie {@link BAND_WORT}. */
export const BAND_WORT_PT: Record<string, string> = {
  Fehlerfrei: "vermelha",
  "Saubere Serie": "azul",
  Fleiß: "verde",
  Anschläge: "cor de laranja",
  Dranbleiben: "azul-petróleo",
  Sterne: "violeta",
  Lektionen: "azul-escura",
  Stufen: "cor-de-rosa",
  Übungswochen: "azul-mar",
  Tastenwelt: "verde-azeitona",
  "Sitzt!": "verde-escura",
  Tempo: "vermelho-tijolo",
  "Am Stück": "cinzento-ardósia",
  Meisterprüfung: "amarelo-ouro",
  Abenteuer: "azul-gelo",
  "Abenteuer-Kunststücke": "violeta-clara",
  Expedition: "azul-celeste",
  Geschichten: "castanha-clara",
  Lesestunde: "ocre",
  "Lese-Kunststücke": "cor de ferrugem",
  Geheim: "violeta-escura",
};

function medaillenBeschreibungPt(def: BadgeDef, secretHidden: boolean): string {
  if (secretHidden) return "Medalha cinzenta numa fita cinzenta, com a imagem: um ponto de interrogação.";
  const metall = METALL_WORT_PT[metalFor(def)];
  const band = BAND_WORT_PT[def.group] ?? BAND_WORT_PT.Geheim;
  return `${metall} numa fita ${band}, com a imagem: ${badgeBild(def, "pt")}.`;
}

// ★ O2-COMP (30.10.2026): br eigene Fassung.
/**
 * ★ O2-COMP (29.10.2026): dieselbe Medaille brasilianisch - „Medalha de ouro em
 * fita vermelha. Imagem: ninja." Das Motiv steht nach einem Doppelpunkt (wie cs),
 * so braucht es keinen Artikel (Glossar §2.4: „medalha" für Abzeichen und
 * Medaille). Bandfarben an „fita" (f.): einfache Farben gebeugt („vermelha"),
 * Farben mit Hauptwort unveränderlich („vermelho-tijolo").
 */
const METALL_WORT_BR: Record<Metal, string> = {
  bronze: "Medalha de bronze",
  silber: "Medalha de prata",
  gold: "Medalha de ouro",
  diamant: "Medalha de diamante",
  platin: "Medalha de platina",
  smaragd: "Medalha verde-esmeralda",
  saphir: "Medalha azul-safira",
  rubin: "Medalha vermelho-rubi",
  amethyst: "Medalha violeta",
  bernstein: "Medalha âmbar",
  tuerkis: "Medalha turquesa",
  obsidian: "Medalha cinza-obsidiana",
  grau: "Medalha cinza",
};

/** Bandfarbe je Familie brasilianisch, passend zu „fita" (f.) - dieselben Schlüssel wie {@link BAND_WORT}. */
export const BAND_WORT_BR: Record<string, string> = {
  Fehlerfrei: "vermelha",
  "Saubere Serie": "azul",
  Fleiß: "verde",
  Anschläge: "laranja",
  Dranbleiben: "verde-azulada",
  Sterne: "violeta",
  Lektionen: "azul-escura",
  Stufen: "rosa",
  Übungswochen: "azul-oceano",
  Tastenwelt: "verde-oliva",
  "Sitzt!": "verde-escura",
  Tempo: "vermelho-tijolo",
  "Am Stück": "cinza-ardósia",
  Meisterprüfung: "amarelo-ouro",
  Abenteuer: "azul-gelo",
  "Abenteuer-Kunststücke": "lilás",
  Expedition: "azul-celeste",
  Geschichten: "marrom-clara",
  Lesestunde: "ocre",
  "Lese-Kunststücke": "cor de ferrugem",
  Geheim: "roxa",
};

function medaillenBeschreibungBr(def: BadgeDef, secretHidden: boolean): string {
  if (secretHidden) return "Medalha cinza em fita cinza. Imagem: ponto de interrogação.";
  const metall = METALL_WORT_BR[metalFor(def)];
  const band = BAND_WORT_BR[def.group] ?? BAND_WORT_BR.Geheim;
  return `${metall} em fita ${band}. Imagem: ${badgeBild(def, "br")}.`;
}

// ★ O2-COMP (30.10.2026): ro eigene Fassung.
/**
 * ★ O2-COMP-RO: dieselbe Medaille rumänisch - „Medalie de aur pe o panglică roșie, pe ea: un ninja."
 * Das Motiv steht nach einem Doppelpunkt (wie cs) - so muss nichts gebeugt werden. Bandfarben
 * weiblich (panglică) oder unveränderliche Zusammensetzungen („albastru-închis").
 */
const METALL_WORT_RO: Record<Metal, string> = {
  bronze: "Medalie de bronz",
  silber: "Medalie de argint",
  gold: "Medalie de aur",
  diamant: "Medalie de diamant",
  platin: "Medalie de platină",
  smaragd: "Medalie verde ca smaraldul",
  saphir: "Medalie albastră ca safirul",
  rubin: "Medalie roșie ca rubinul",
  amethyst: "Medalie mov",
  bernstein: "Medalie de chihlimbar",
  tuerkis: "Medalie turcoaz",
  obsidian: "Medalie gri ca obsidianul",
  grau: "Medalie gri",
};

/** Bandfarbe je Familie rumänisch - dieselben Schlüssel wie {@link BAND_WORT}. */
export const BAND_WORT_RO: Record<string, string> = {
  Fehlerfrei: "roșie",
  "Saubere Serie": "albastră",
  Fleiß: "verde",
  Anschläge: "portocalie",
  Dranbleiben: "verde-albăstrui",
  Sterne: "mov",
  Lektionen: "albastru-închis",
  Stufen: "roz",
  Übungswochen: "albastru-marin",
  Tastenwelt: "verde-măsliniu",
  "Sitzt!": "verde-închis",
  Tempo: "roșu-cărămiziu",
  "Am Stück": "gri-albăstrui",
  Meisterprüfung: "galben-aurie",
  Abenteuer: "bleu",
  "Abenteuer-Kunststücke": "lila",
  Expedition: "albastru-azuriu",
  Geschichten: "maro-deschis",
  Lesestunde: "ocru",
  "Lese-Kunststücke": "ruginie",
  Geheim: "mov-închis",
};

function medaillenBeschreibungRo(def: BadgeDef, secretHidden: boolean): string {
  if (secretHidden) return "Medalie gri pe o panglică gri, pe ea: un semn al întrebării.";
  const metall = METALL_WORT_RO[metalFor(def)];
  const band = BAND_WORT_RO[def.group] ?? BAND_WORT_RO.Geheim;
  return `${metall} pe o panglică ${band}, pe ea: ${badgeBild(def, "ro")}.`;
}

// ★ O2-COMP (30.10.2026): sv eigene Fassung.
/**
 * ★ O2-COMP sv: dieselbe Medaille schwedisch - „Märke i guld på ett rött band, motiv: en ninja."
 * Das Motiv steht nach „motiv:" (badgeBild liefert es mit unbestimmtem Artikel, „en idrottsmedalj
 * med band") - so muss nichts gebeugt werden. „märke" für Abzeichen UND Medaille (Glossar §2.4).
 * „band" ist ett-Wort ⇒ Farbadjektive in der ett-Form (rött, blått ...).
 */
const METALL_WORT_SV: Record<Metal, string> = {
  bronze: "Märke i brons",
  silber: "Märke i silver",
  gold: "Märke i guld",
  diamant: "Märke i diamant",
  platin: "Märke i platina",
  smaragd: "Smaragdgrönt märke",
  saphir: "Safirblått märke",
  rubin: "Rubinrött märke",
  amethyst: "Violett märke",
  bernstein: "Bärnstensfärgat märke",
  tuerkis: "Turkost märke",
  obsidian: "Grafitgrått märke",
  grau: "Grått märke",
};

/** Bandfarbe je Familie schwedisch, ett-Form zu „band" - dieselben Schlüssel wie {@link BAND_WORT}. */
export const BAND_WORT_SV: Record<string, string> = {
  Fehlerfrei: "rött",
  "Saubere Serie": "blått",
  Fleiß: "grönt",
  Anschläge: "orange",
  Dranbleiben: "blågrönt",
  Sterne: "violett",
  Lektionen: "mörkblått",
  Stufen: "rosa",
  Übungswochen: "havsblått",
  Tastenwelt: "olivgrönt",
  "Sitzt!": "mörkgrönt",
  Tempo: "tegelrött",
  "Am Stück": "skiffergrått",
  Meisterprüfung: "guldgult",
  Abenteuer: "isblått",
  "Abenteuer-Kunststücke": "ljusviolett",
  Expedition: "kornblått",
  Geschichten: "ljusbrunt",
  Lesestunde: "ockrafärgat",
  "Lese-Kunststücke": "rostbrunt",
  Geheim: "mörkviolett",
};

function medaillenBeschreibungSv(def: BadgeDef, secretHidden: boolean): string {
  if (secretHidden) return "Grått märke på ett grått band, motiv: ett frågetecken.";
  const metall = METALL_WORT_SV[metalFor(def)];
  const band = BAND_WORT_SV[def.group] ?? BAND_WORT_SV.Geheim;
  return `${metall} på ett ${band} band, motiv: ${badgeBild(def, "sv")}.`;
}

// ★ O2-COMP (30.10.2026): uk eigene Fassung.
/**
 * ★ O2-COMP (30.10.2026): dieselbe Medaille ukrainisch - „Золота медаль на червоній стрічці,
 * на ній: ніндзя." Das Motiv steht nach dem Doppelpunkt im Nominativ (wie cs), so muss nichts
 * gebeugt werden. „медаль" (f.) für Abzeichen und Medaille (Glossar §2.4: EINE Form);
 * Bandfarbe als Adjektiv Lokativ weiblich, passend zu „на ... стрічці".
 */
const METALL_WORT_UK: Record<Metal, string> = {
  bronze: "Бронзова медаль",
  silber: "Срібна медаль",
  gold: "Золота медаль",
  diamant: "Діамантова медаль",
  platin: "Платинова медаль",
  smaragd: "Смарагдова медаль",
  saphir: "Сапфірова медаль",
  rubin: "Рубінова медаль",
  amethyst: "Фіолетова медаль",
  bernstein: "Бурштинова медаль",
  tuerkis: "Бірюзова медаль",
  obsidian: "Графітова медаль",
  grau: "Сіра медаль",
};

/** Bandfarbe je Familie ukrainisch, Lokativ weiblich (стрічці) - dieselben Schlüssel wie {@link BAND_WORT}. */
export const BAND_WORT_UK: Record<string, string> = {
  Fehlerfrei: "червоній",
  "Saubere Serie": "синій",
  Fleiß: "зеленій",
  Anschläge: "помаранчевій",
  Dranbleiben: "синьо-зеленій",
  Sterne: "фіолетовій",
  Lektionen: "темно-синій",
  Stufen: "рожевій",
  Übungswochen: "лазуровій",
  Tastenwelt: "оливковій",
  "Sitzt!": "темно-зеленій",
  Tempo: "цегляній",
  "Am Stück": "сланцево-сірій",
  Meisterprüfung: "золотисто-жовтій",
  Abenteuer: "крижано-блакитній",
  "Abenteuer-Kunststücke": "світло-фіолетовій",
  Expedition: "волошковій",
  Geschichten: "світло-коричневій",
  Lesestunde: "охристій",
  "Lese-Kunststücke": "іржаво-коричневій",
  Geheim: "темно-фіолетовій",
};

function medaillenBeschreibungUk(def: BadgeDef, secretHidden: boolean): string {
  if (secretHidden) return "Сіра медаль на сірій стрічці, на ній: знак питання.";
  const metall = METALL_WORT_UK[metalFor(def)];
  const band = BAND_WORT_UK[def.group] ?? BAND_WORT_UK.Geheim;
  return `${metall} на ${band} стрічці, на ній: ${badgeBild(def, "uk")}.`;
}

/**
 * ★ O2-COMP (30.10.2026): das Verdien-Datum eines Abzeichens für die neun Sprachen, ausgeschrieben
 * wie cs/pl/tr („21 септември 2026 г."). Über `GEBIET`: die Kennung „br" allein wäre als
 * Gebiet Bretonisch, „pt-BR" ist richtig.
 */
export function datumAbzeichenNeun(ts: number, sprache: GeruestSprache): string {
  return new Date(ts).toLocaleDateString(GEBIET[sprache], {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
