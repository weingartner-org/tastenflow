/**
 * Datei-Vorschau-Helfer für den Abgaben-„Supereditor" (Bewertungen → Abgaben,
 * Moodle-Vorbild, 2026-06-08). Bestimmt anhand des DATEINAMENS, wie eine
 * abgegebene Datei in der Vorschau dargestellt wird, und extrahiert aus den
 * Office-Containern (Word/PowerPoint = ZIP mit XML) den reinen Text.
 *
 *  - Bilder/PDF/Audio/Video: nativer Browser (img/embed/audio/video).
 *  - Excel/CSV: bestehende `xlsx`-Abhängigkeit (dynamischer Import in der
 *    Vorschau-Komponente — bleibt aus dem Haupt-Bundle).
 *  - Word .docx: originalgetreues Rendering über `docx-preview` (dynamischer
 *    Import in der Vorschau-Komponente). Der hiesige Klartext-Extraktor bleibt
 *    als „Nur Text"-Ansicht und als Fallback, wenn das Rendering scheitert.
 *  - PowerPoint .pptx: dependency-frei entpackter Klartext über die native
 *    `DecompressionStream('deflate-raw')` + ZIP-Central-Directory-Parser hier.
 *  - Markdown: schlanker, sicherer Renderer (escape-first) — siehe
 *    `renderMarkdownLite`.
 *
 * Die reinen Funktionen (`previewKindForName`, `docxXmlToText`,
 * `pptxXmlToText`, `renderMarkdownLite`, `decodeXmlEntities`) sind ohne
 * Browser-APIs testbar; die async-Extraktoren nutzen `DecompressionStream`
 * (Browser + Node ≥ 18; bei Fehlen sauber als „nicht entpackbar" behandelt).
 */

export type PreviewKind =
  | "image"
  | "pdf"
  | "excel"
  | "word"
  | "powerpoint"
  | "markdown"
  | "text"
  | "audio"
  | "video"
  | "unknown";

/** Kleinschreib-Endung ohne Punkt (`"Foo.PDF"` → `"pdf"`), sonst "". */
export function fileExtension(fileName: string): string {
  const m = /\.([A-Za-z0-9]+)\s*$/.exec(fileName.trim());
  return m ? m[1].toLowerCase() : "";
}

const IMAGE_EXT = new Set([
  "png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "avif", "apng", "ico",
  "heic", "heif",
]);
// Von SheetJS (xlsx) lesbare Tabellen — inkl. Alt-Format .xls und Trennzeichen-
// Dateien (CSV/TSV), die als Tabelle viel lesbarer sind als roher Text.
const EXCEL_EXT = new Set(["xlsx", "xlsm", "xlsb", "xls", "csv", "tsv"]);
const MARKDOWN_EXT = new Set(["md", "markdown", "mdown", "mkd"]);
const AUDIO_EXT = new Set(["mp3", "wav", "m4a", "aac", "oga", "ogg", "flac", "opus"]);
const VIDEO_EXT = new Set(["mp4", "webm", "m4v", "mov", "ogv"]);
// Reiner Text/Quelltext — als Quelltext angezeigt (sicher, „nichts falsch").
const TEXT_EXT = new Set([
  "txt", "text", "log", "rtf", "json", "xml", "yml", "yaml", "ini", "conf",
  "tex", "bib", "srt", "vtt", "html", "htm", "css", "js", "ts", "jsx",
  "tsx", "py", "java", "c", "cpp", "h", "hpp", "cs", "rb", "go", "rs", "php",
  "sql", "sh", "bat", "r",
]);

/**
 * Wie wird eine Datei dieses Namens in der Vorschau dargestellt? Rein anhand
 * der Endung (Submissions tragen keinen verlässlichen MIME-Typ). `"unknown"`
 * ⇒ keine Inline-Vorschau, nur Download anbieten.
 */
export function previewKindForName(fileName: string): PreviewKind {
  const e = fileExtension(fileName);
  if (IMAGE_EXT.has(e)) return "image";
  if (e === "pdf") return "pdf";
  if (EXCEL_EXT.has(e)) return "excel";
  if (e === "docx") return "word";
  if (e === "pptx") return "powerpoint";
  if (MARKDOWN_EXT.has(e)) return "markdown";
  if (AUDIO_EXT.has(e)) return "audio";
  if (VIDEO_EXT.has(e)) return "video";
  if (TEXT_EXT.has(e)) return "text";
  return "unknown";
}

/** Menschlich lesbare Dateigröße (z. B. „2,4 MB"). */
export function formatFileSize(bytes: number | undefined | null): string {
  if (bytes == null || bytes < 0 || Number.isNaN(bytes)) return "";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(kb < 10 ? 1 : 0)} KB`.replace(".", ",");
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(mb < 10 ? 1 : 0)} MB`.replace(".", ",");
  const gb = mb / 1024;
  return `${gb.toFixed(1)} GB`.replace(".", ",");
}

// ---------------------------------------------------------------------------
// XML-Helfer
// ---------------------------------------------------------------------------

/** XML-/HTML-Entities zu Klartext. `&amp;` bewusst ZULETZT. */
export function decodeXmlEntities(s: string): string {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => safeCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => safeCodePoint(parseInt(d, 10)))
    .replace(/&amp;/g, "&");
}

function safeCodePoint(n: number): string {
  try {
    return Number.isFinite(n) && n >= 0 && n <= 0x10ffff
      ? String.fromCodePoint(n)
      : "";
  } catch {
    return "";
  }
}

function tidyText(s: string): string {
  return s
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

// Sentinel für „hier war ein Absatz-/Zeilenende" — übersteht das Tag-Strippen
// und wird zuletzt in echte Zeilenumbrüche verwandelt. Als Code definiert,
// damit KEIN rohes Steuerzeichen im Quelltext steht.
const NL_MARK = String.fromCharCode(1);

/**
 * WordprocessingML (`word/document.xml`) → Klartext. Absatzenden (`</w:p>`),
 * Zeilenumbrüche (`<w:br/>`) und Tabs (`<w:tab/>`) bleiben erhalten; Feldcodes
 * (`<w:instrText>`) werden verworfen. Bewusst KEINE Fett/Kursiv-Auszeichnung —
 * eine reine, verlässliche Text-Vorschau („nichts falsch darstellen").
 */
export function docxXmlToText(xml: string): string {
  let s = xml;
  // Feldcodes (HYPERLINK, PAGE …) raus — sie sind kein Lesetext.
  s = s.replace(/<w:instrText\b[\s\S]*?<\/w:instrText>/g, "");
  // Absatz-/Zeilen-/Tab-Grenzen sichern, BEVOR die Tags fallen.
  s = s.replace(/<\/w:p>/g, NL_MARK);
  s = s.replace(/<w:br\b[^>]*\/?>/g, NL_MARK);
  s = s.replace(/<w:cr\b[^>]*\/?>/g, NL_MARK);
  s = s.replace(/<w:tab\b[^>]*\/?>/g, "\t");
  // Alle übrigen Tags entfernen — Lesetext steckt nur in <w:t>…</w:t>.
  s = s.replace(/<[^>]+>/g, "");
  s = decodeXmlEntities(s);
  s = s.split(NL_MARK).join("\n");
  return tidyText(s);
}

/**
 * Text einer einzelnen PowerPoint-Folie (`ppt/slides/slideN.xml`) →
 * Klartext. Absätze (`</a:p>`) und Umbrüche (`<a:br/>`) werden zu Zeilen.
 */
export function pptxXmlToText(xml: string): string {
  let s = xml;
  s = s.replace(/<\/a:p>/g, NL_MARK);
  s = s.replace(/<a:br\b[^>]*\/?>/g, NL_MARK);
  s = s.replace(/<[^>]+>/g, "");
  s = decodeXmlEntities(s);
  s = s.split(NL_MARK).join("\n");
  return tidyText(s);
}

// ---------------------------------------------------------------------------
// Dependency-freier ZIP-Leser (nur Lesen einzelner Einträge)
// ---------------------------------------------------------------------------

function u16(v: Uint8Array, o: number): number {
  return (v[o] | (v[o + 1] << 8)) >>> 0;
}
function u32(v: Uint8Array, o: number): number {
  return (v[o] | (v[o + 1] << 8) | (v[o + 2] << 16) | (v[o + 3] << 24)) >>> 0;
}

export interface ZipEntryRef {
  name: string;
  method: number;
  compSize: number;
  /** Unkomprimierte Größe (aus dem Central Directory). */
  size: number;
  /** CRC32 des unkomprimierten Inhalts — identifiziert byte-gleiche Einträge
   *  (z. B. eingebettete Bilder) OHNE zu entpacken. */
  crc: number;
  localOff: number;
}

/** End-Of-Central-Directory-Signatur rückwärts suchen (Kommentar erlaubt). */
function findEocd(buf: Uint8Array): number {
  const min = Math.max(0, buf.length - 22 - 0xffff);
  for (let i = buf.length - 22; i >= min; i--) {
    if (
      buf[i] === 0x50 &&
      buf[i + 1] === 0x4b &&
      buf[i + 2] === 0x05 &&
      buf[i + 3] === 0x06
    )
      return i;
  }
  return -1;
}

/** Liest die Central-Directory-Einträge (verlässlich, inkl. korrekter Größen). */
export function listZipEntries(buf: Uint8Array): ZipEntryRef[] {
  const eocd = findEocd(buf);
  if (eocd < 0) return [];
  const count = u16(buf, eocd + 10);
  let off = u32(buf, eocd + 16);
  const dec = new TextDecoder("utf-8");
  const out: ZipEntryRef[] = [];
  for (let i = 0; i < count; i++) {
    if (off + 46 > buf.length || u32(buf, off) !== 0x02014b50) break;
    const method = u16(buf, off + 10);
    const crc = u32(buf, off + 16);
    const compSize = u32(buf, off + 20);
    const size = u32(buf, off + 24);
    const nameLen = u16(buf, off + 28);
    const extraLen = u16(buf, off + 30);
    const commentLen = u16(buf, off + 32);
    const localOff = u32(buf, off + 42);
    const name = dec.decode(buf.subarray(off + 46, off + 46 + nameLen));
    out.push({ name, method, compSize, size, crc, localOff });
    off += 46 + nameLen + extraLen + commentLen;
  }
  return out;
}

async function inflateRaw(bytes: Uint8Array): Promise<Uint8Array> {
  if (typeof DecompressionStream === "undefined")
    throw new Error("DecompressionStream nicht verfügbar");
  // In einen eindeutig ArrayBuffer-gestützten Puffer kopieren (subarray liefert
  // `Uint8Array<ArrayBufferLike>`).
  const copy = new Uint8Array(bytes.length);
  copy.set(bytes);
  const ds = new DecompressionStream("deflate-raw");
  // Schreiben + Lesen NEBENLÄUFIG: erst die readable-Seite drainen lassen,
  // damit das Schreiben großer Eingaben nicht blockiert (Deadlock-frei). Nutzt
  // direkt writable/readable des Streams — KEIN Blob.stream() (in jsdom/Tests
  // nicht vorhanden, in Browsern schon).
  const writer = ds.writable.getWriter();
  const pump = (async () => {
    await writer.write(copy);
    await writer.close();
  })();
  const ab = await new Response(ds.readable).arrayBuffer();
  await pump;
  return new Uint8Array(ab);
}

/** Rohe (komprimierte) Daten eines Eintrags über seinen Local-Header finden. */
function rawEntryData(buf: Uint8Array, e: ZipEntryRef): Uint8Array {
  const lo = e.localOff;
  if (u32(buf, lo) !== 0x04034b50) throw new Error("ZIP: Local-Header falsch");
  const nameLen = u16(buf, lo + 26);
  const extraLen = u16(buf, lo + 28);
  const start = lo + 30 + nameLen + extraLen;
  return buf.subarray(start, start + e.compSize);
}

export async function readZipEntryText(
  buf: Uint8Array,
  e: ZipEntryRef,
): Promise<string> {
  const raw = rawEntryData(buf, e);
  let bytes: Uint8Array;
  if (e.method === 0) bytes = raw; // STORE
  else if (e.method === 8) bytes = await inflateRaw(raw); // DEFLATE
  else throw new Error(`ZIP: Methode ${e.method} nicht unterstützt`);
  return new TextDecoder("utf-8").decode(bytes);
}

/** Word .docx (Bytes) → Klartext. Wirft, wenn kein document.xml lesbar ist. */
export async function extractDocxText(bytes: Uint8Array): Promise<string> {
  const entries = listZipEntries(bytes);
  const doc = entries.find((e) => e.name === "word/document.xml");
  if (!doc) throw new Error("Keine word/document.xml im Dokument gefunden.");
  return docxXmlToText(await readZipEntryText(bytes, doc));
}

/** PowerPoint .pptx (Bytes) → Klartext je Folie (mit „Folie N"-Überschrift). */
export async function extractPptxText(bytes: Uint8Array): Promise<string> {
  const entries = listZipEntries(bytes);
  const slides = entries
    .filter((e) => /^ppt\/slides\/slide\d+\.xml$/.test(e.name))
    .sort((a, b) => slideNo(a.name) - slideNo(b.name));
  if (slides.length === 0)
    throw new Error("Keine Folien in der Präsentation gefunden.");
  const parts: string[] = [];
  for (let i = 0; i < slides.length; i++) {
    const text = pptxXmlToText(await readZipEntryText(bytes, slides[i]));
    parts.push(`— Folie ${i + 1} —\n${text}`.trimEnd());
  }
  return parts.join("\n\n");
}

function slideNo(name: string): number {
  const m = /slide(\d+)\.xml$/.exec(name);
  return m ? parseInt(m[1], 10) : 0;
}

/**
 * Härtet die Links in einem fertig gerenderten Dokument (docx-preview-Ausgabe):
 * Hyperlinks stammen aus einer FREMDEN Datei (Studi-Abgabe). Interne Anker
 * (`#…`, z. B. Fußnoten/Verweise) bleiben; http(s)/mailto öffnen in neuem Tab
 * ohne `window.opener`; alles andere (`javascript:`, `data:`, `file:` …) wird
 * entschärft, der Linktext bleibt lesbar stehen.
 */
export function hardenRenderedDocLinks(root: ParentNode): void {
  root.querySelectorAll("a").forEach((a) => {
    const href = a.getAttribute("href") ?? "";
    if (href.startsWith("#")) return;
    if (/^(https?:|mailto:)/i.test(href.trim())) {
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
    } else {
      a.removeAttribute("href");
    }
  });
}

// ---------------------------------------------------------------------------
// Symbol-Schriften (Word-Aufzählungszeichen, w:sym) → echtes Unicode
// ---------------------------------------------------------------------------
//
// Word speichert Standard-Aufzählungszeichen und Symbole NICHT als Unicode,
// sondern als Zeichen der Schriften „Symbol"/„Wingdings" — meist in der
// Private Use Area (U+F0xx). Browser haben diese Schriften praktisch nie →
// es erscheinen leere Kästchen. Hier werden die Zeichen anhand der bekannten
// Schrift-Belegungen in echtes Unicode übersetzt.

/** Adobe-Symbol-Belegung: ASCII-Buchstabe → griechischer Buchstabe. */
const SYMBOL_LETTERS: Record<string, string> = (() => {
  const lat = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const upper = "ΑΒΧΔΕΦΓΗΙϑΚΛΜΝΟΠΘΡΣΤΥςΩΞΨΖ";
  const lower = "αβχδεφγηιϕκλμνοπθρστυϖωξψζ";
  const m: Record<string, string> = {};
  for (let i = 0; i < 26; i++) {
    m[lat[i]] = upper[i];
    m[lat[i].toLowerCase()] = lower[i];
  }
  return m;
})();

/** Symbol-Schrift, Nicht-Buchstaben (nur die verlässlich belegten). */
const SYMBOL_EXTRA: Record<number, string> = {
  0xa3: "≤", 0xa5: "∞", 0xab: "↔", 0xac: "←", 0xad: "↑", 0xae: "→",
  0xaf: "↓", 0xb1: "±", 0xb3: "≥", 0xb4: "×", 0xb6: "∂", 0xb7: "•",
  0xb8: "÷", 0xb9: "≠", 0xba: "≡", 0xbb: "≈", 0xd6: "√", 0xd7: "⋅",
};

/** Wingdings: die Word-Bullet-Galerie + Checklisten-Kästchen. */
const WINGDINGS: Record<number, string> = {
  0x6c: "●", 0x6e: "■", 0x75: "◆", 0x76: "❖",
  0xa7: "▪", 0xa8: "❑", 0xd8: "➢", 0xfc: "✔", 0xfd: "☒", 0xfe: "☑",
};

const SYMBOL_FONT_RX = /^\s*"?(symbol|wingdings(?:\s*[23])?|webdings|opensymbol)"?\s*(?:,|$)/i;

/** Ist die ERSTE Schrift der font-family eine bekannte Symbol-Schrift? */
export function isSymbolFont(fontFamily: string): boolean {
  return SYMBOL_FONT_RX.test(fontFamily);
}

/**
 * Übersetzt EIN Zeichen einer Symbol-Schrift nach Unicode. PUA-Zeichen
 * (U+F0xx) und rohe ASCII-Zeichen tragen dieselbe Belegung (Word schreibt
 * mal so, mal so). Unbekannte Zeichen → null (Aufrufer entscheidet).
 */
export function mapSymbolChar(ch: string, fontFamily: string): string | null {
  let cp = ch.codePointAt(0) ?? 0;
  if (cp >= 0xf000 && cp <= 0xf0ff) cp -= 0xf000; // PUA → Roh-Codepunkt
  const isPlain = cp >= 0x21 && cp <= 0xff; // druckbarer Bereich der Belegung
  if (!isPlain) return null;
  const c = String.fromCharCode(cp);
  if (/^\s*"?symbol/i.test(fontFamily) || /opensymbol/i.test(fontFamily)) {
    return SYMBOL_LETTERS[c] ?? SYMBOL_EXTRA[cp] ?? null;
  }
  // Wingdings/Webdings: nur die sicher belegten Zeichen.
  return WINGDINGS[cp] ?? null;
}

const PUA_RX = /[\uE000-\uF8FF]/; // Private Use Area (Symbol-Schrift-Zeichen)

/**
 * CSS-String-Escapes aufl\u00F6sen (`\F0B7 ` \u2192 Zeichen, `\\` \u2192 `\`). Browser
 * SERIALISIEREN content-Werte mit solchen Escapes (z. B. Tab als `\9 `) \u2014
 * gemappt wird aber auf den echten Zeichen.
 */
export function cssUnescape(s: string): string {
  return s.replace(
    /\\([0-9a-fA-F]{1,6})[ \t\n]?|\\([\s\S])/g,
    (_, hex: string | undefined, lit: string | undefined) =>
      hex ? safeCodePoint(parseInt(hex, 16)) : (lit ?? ""),
  );
}

/** Zeichenkette als zitierter CSS-String (Steuerzeichen als Hex-Escape). */
export function cssQuote(s: string): string {
  let out = '"';
  for (const ch of s) {
    const cp = ch.codePointAt(0) ?? 0;
    if (ch === '"' || ch === "\\") out += "\\" + ch;
    else if (cp < 0x20 || cp === 0x7f) out += "\\" + cp.toString(16) + " ";
    else out += ch;
  }
  return out + '"';
}

/**
 * Ersetzt in der docx-preview-Ausgabe Symbol-Schrift-Zeichen durch echtes
 * Unicode — sonst zeigen Browser ohne „Symbol"/„Wingdings" leere Kästchen:
 *  1. Listen-Aufzählungszeichen: die von docx-preview erzeugten
 *     `::before`-CSS-Regeln (content + font-family in den injizierten
 *     <style>-Blöcken). Unbekannte PUA-Zeichen werden zu „•" — ein
 *     generisches Aufzählungszeichen ist richtiger als ein Kästchen.
 *  2. Fließtext-Läufe, deren Schrift eine Symbol-Schrift ist (w:sym,
 *     griechische Buchstaben über die Symbol-Schrift etc.).
 * Nach der Übersetzung wird die Symbol-Schrift entfernt, damit die normale
 * Dokumentschrift greift.
 */
export function fixSymbolFonts(root: HTMLElement): void {
  // 1) Marker-Regeln in den injizierten Styles.
  root.querySelectorAll("style").forEach((styleEl) => {
    const sheet = styleEl.sheet;
    if (!sheet) return;
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      return;
    }
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      if (!(rule instanceof CSSStyleRule)) continue;
      const font = rule.style.getPropertyValue("font-family");
      const content = rule.style.getPropertyValue("content");
      if (!font || !content || !isSymbolFont(font)) continue;
      // content-Wert ist ein zitierter String — Anführungszeichen abstreifen
      // und Browser-Escapes (`\9 ` für Tab …) erst zu echten Zeichen machen.
      const m = /^\s*(['"])([\s\S]*)\1\s*$/.exec(content);
      if (!m) continue;
      const mapped = [...cssUnescape(m[2])]
        .map((ch) =>
          mapSymbolChar(ch, font) ?? (PUA_RX.test(ch) ? "•" : ch),
        )
        .join("");
      rule.style.setProperty("content", cssQuote(mapped));
      rule.style.removeProperty("font-family");
    }
  });

  // 2) Textläufe in Symbol-Schrift.
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const todo: Text[] = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    todo.push(n as Text);
  }
  for (const node of todo) {
    const parent = node.parentElement;
    const text = node.nodeValue ?? "";
    if (!parent || !text.trim()) continue;
    // style-/script-Knoten überspringen; nur echte Inhalte anfassen.
    if (parent.closest("style,script")) continue;
    const font = getComputedStyle(parent).fontFamily || "";
    if (!isSymbolFont(font)) continue;
    let changed = false;
    const mapped = [...text]
      .map((ch) => {
        const u = mapSymbolChar(ch, font);
        if (u !== null) changed = true;
        // Unbekannte PUA-Zeichen wären unsichtbare Kästchen → generisches •.
        if (u === null && PUA_RX.test(ch)) {
          changed = true;
          return "•";
        }
        return u ?? ch;
      })
      .join("");
    if (changed) {
      node.nodeValue = mapped;
      parent.style.setProperty("font-family", "inherit");
    }
  }
}

// ---------------------------------------------------------------------------
// Schlanker, sicherer Markdown-Renderer (escape-first → kein XSS)
// ---------------------------------------------------------------------------

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Nur sichere Link-Schemata zulassen (kein javascript:/data:). */
function safeHref(url: string): string | null {
  const u = url.trim();
  if (/^(https?:|mailto:)/i.test(u)) return u;
  if (u.startsWith("/") || u.startsWith("#")) return u;
  if (/^[^\s:]+\.[^\s:]/.test(u) && !u.includes(":")) return "https://" + u; // bare domain
  return null;
}

// Platzhalter für herausgelöste Inline-Code-Spans (kein rohes Steuerzeichen).
const CODE_MARK = String.fromCharCode(2);

/** Inline-Auszeichnungen NACHDEM der Text escaped ist (Reihenfolge wichtig). */
function inlineMd(escaped: string): string {
  let s = escaped;
  // Inline-Code zuerst herausnehmen, damit *…*/_…_ darin nicht greifen.
  const codes: string[] = [];
  s = s.replace(/`([^`]+)`/g, (_, c) => {
    codes.push(`<code>${c}</code>`);
    return `${CODE_MARK}${codes.length - 1}${CODE_MARK}`;
  });
  // Links [Text](url)
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, text, url) => {
    const href = safeHref(url);
    return href
      ? `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${text}</a>`
      : m;
  });
  // Fett **…** / __…__
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  // Kursiv *…* / _…_
  s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  s = s.replace(/(^|[^_])_([^_\n]+)_/g, "$1<em>$2</em>");
  // Durchgestrichen ~~…~~
  s = s.replace(/~~([^~]+)~~/g, "<del>$1</del>");
  // Code-Platzhalter zurück.
  s = s.replace(
    new RegExp(`${CODE_MARK}(\\d+)${CODE_MARK}`, "g"),
    (_, i) => codes[Number(i)] ?? "",
  );
  return s;
}

/**
 * Minimaler, sicherer Markdown→HTML-Renderer (Überschriften, Listen,
 * Blockzitate, Codeblöcke, horizontale Linien, Absätze + Inline-Stil). Der
 * Eingabetext wird ZUERST ge-escaped, daher ist die Ausgabe XSS-sicher und
 * kann direkt per `dangerouslySetInnerHTML` gerendert werden. Bewusst klein
 * gehalten — für eine Lese-Vorschau, nicht als vollwertiger CommonMark-Parser.
 */
export function renderMarkdownLite(md: string): string {
  const src = md.replace(/\r\n?/g, "\n").replace(/^﻿/, "");
  const lines = src.split("\n");
  const out: string[] = [];
  let i = 0;
  let para: string[] = [];

  const flushPara = () => {
    if (para.length === 0) return;
    out.push(
      `<p>${inlineMd(escapeHtml(para.join("\n"))).replace(/\n/g, "<br>")}</p>`,
    );
    para = [];
  };

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block ```…```
    const fence = /^\s*```/.test(line);
    if (fence) {
      flushPara();
      const body: string[] = [];
      i++;
      while (i < lines.length && !/^\s*```\s*$/.test(lines[i])) {
        body.push(lines[i]);
        i++;
      }
      i++; // closing fence
      out.push(`<pre><code>${escapeHtml(body.join("\n"))}</code></pre>`);
      continue;
    }

    // Leere Zeile → Absatzende
    if (/^\s*$/.test(line)) {
      flushPara();
      i++;
      continue;
    }

    // Horizontale Linie
    if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(line)) {
      flushPara();
      out.push("<hr>");
      i++;
      continue;
    }

    // Überschrift
    const h = /^\s*(#{1,6})\s+(.*?)\s*#*\s*$/.exec(line);
    if (h) {
      flushPara();
      const level = h[1].length;
      out.push(`<h${level}>${inlineMd(escapeHtml(h[2]))}</h${level}>`);
      i++;
      continue;
    }

    // Blockzitat (zusammenhängende > Zeilen)
    if (/^\s*>\s?/.test(line)) {
      flushPara();
      const quote: string[] = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        quote.push(lines[i].replace(/^\s*>\s?/, ""));
        i++;
      }
      out.push(
        `<blockquote>${inlineMd(escapeHtml(quote.join("\n"))).replace(/\n/g, "<br>")}</blockquote>`,
      );
      continue;
    }

    // Ungeordnete Liste
    if (/^\s*[-*+]\s+/.test(line)) {
      flushPara();
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*+]\s+/, ""));
        i++;
      }
      out.push(
        `<ul>${items.map((t) => `<li>${inlineMd(escapeHtml(t))}</li>`).join("")}</ul>`,
      );
      continue;
    }

    // Geordnete Liste
    if (/^\s*\d+[.)]\s+/.test(line)) {
      flushPara();
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+[.)]\s+/, ""));
        i++;
      }
      out.push(
        `<ol>${items.map((t) => `<li>${inlineMd(escapeHtml(t))}</li>`).join("")}</ol>`,
      );
      continue;
    }

    // Sonst: Absatztext sammeln
    para.push(line);
    i++;
  }
  flushPara();
  return out.join("\n");
}
