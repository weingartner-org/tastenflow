/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { erzeugeChunkFuer, setzeBuildKennung } from "./scripts/buendel-aufteilung";

const WURZEL = fileURLToPath(new URL(".", import.meta.url));

/**
 * Die Build-Kennung - der Git-Stand, NICHT die Uhrzeit.
 * Reihenfolge: gesetzte Umgebungsvariable > Git-Stand > "unbekannt".
 * Ein schmutziger Arbeitsbaum haengt "+lokal" an: Dann ist die Kennung
 * KEIN Beleg fuer einen Commit, und das soll man dem Live-Stand ansehen.
 */
function buildKennung(): string {
  const gesetzt = process.env.BUILD_KENNUNG?.trim();
  if (gesetzt) return gesetzt;
  const git = (...args: string[]) =>
    execFileSync("git", args, { cwd: WURZEL, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  try {
    const sha = git("rev-parse", "--short", "HEAD");
    // ★ 28.09.2026: Geänderte Dateien zählen überall; NEUE, nie
    // hinzugefügte Dateien nur dort, wo der Build sie lesen kann (src/,
    // public/, index.html). Bis dahin machten Johannes' eigene Dokumente im
    // App-Ordner (Antworten als .docx, Bilder, Entwürfe) jeden Build zu
    // „+lokal", obwohl der Build sie nie sieht.
    const schmutzig =
      git("status", "--porcelain", "--untracked-files=no") !== "" ||
      git("status", "--porcelain", "--untracked-files=all", "--", "src", "public", "index.html") !== "";
    return schmutzig ? `${sha}+lokal` : sha;
  } catch {
    return "unbekannt";
  }
}

/**
 * ★★★ Die schweren Medien NICHT in `dist/` kopieren (31.08.2026).
 * ============================================================================
 * GEMESSEN an diesem Tag: `public/` ist 1,0 GB gross, `dist/` wurde 816 MB und
 * enthielt 3.451 Dateien. Hochgeladen werden davon **13,7 MB** - der Rest wird
 * vom Deploy ausdruecklich ausgeschlossen (`deploy-frontend.sh`, `--exclude`)
 * und laeuft ueber `deploy-medien.sh`, das **aus `public/` liest, nicht aus
 * `dist/`** (dort steht der Grund ausfuehrlich).
 *
 * Der Ballast kam ueber `public/podcasts` - in jedem Worktree ein SYMLINK in
 * den Hauptbaum (681 MB). `du -sh` zeigt dafuer 0 B, Vite folgt ihm trotzdem.
 *
 * ⚠️ DEN SYMLINK ZU LOESCHEN WAERE FALSCH. `tests/typing-intro-podcast.test.tsx`
 * und `tests/computer-podcasts.test.tsx` pruefen `public/podcasts/` gegen die
 * Podcast-Karten und sagen einem sogar, wie man den Symlink anlegt. Der Ordner
 * MUSS da sein - er darf nur nicht mitkopiert werden.
 *
 * Was hier steht, ist deshalb: `publicDir` beim BAUEN abschalten und selbst
 * kopieren, ohne die vier schweren Ordner. Im Entwicklungsbetrieb (`npm run
 * dev`) bleibt `public/` unveraendert bedient - dort spielt jeder Podcast.
 *
 * ⚠️ `abzeichen/` und `sounds/` bleiben ABSICHTLICH drin (63 MB): `npm run
 * preview` soll die Medaillen zeigen. Sie sind klein genug.
 */
const OHNE_INS_BUENDEL = new Set(["podcasts", "media", "haus", "bruecke"]);

function publicOhneSchwereMedien() {
  return {
    name: "public-ohne-schwere-medien",
    apply: "build" as const,
    closeBundle() {
      const von = path.join(WURZEL, "public");
      const nach = path.join(WURZEL, "dist");
      if (!fs.existsSync(von)) return;
      let uebersprungen: string[] = [];
      for (const eintrag of fs.readdirSync(von)) {
        if (OHNE_INS_BUENDEL.has(eintrag)) {
          uebersprungen.push(eintrag);
          continue;
        }
        fs.cpSync(path.join(von, eintrag), path.join(nach, eintrag), {
          recursive: true,
          dereference: true,
        });
      }
      if (uebersprungen.length > 0) {
        // Sichtbar machen, was NICHT im Buendel liegt - ein stiller Ausschluss
        // waere genau die Art Pruefung, die gruen leuchtet und nichts misst.
        console.log(
          `  nicht ins Buendel kopiert (Deploy holt sie aus public/): ${uebersprungen.join(", ")}`,
        );
      }
    },
  };
}

/**
 * Die Build-Kennung an `<html data-build="…">` der index.html (seit 28.09.2026).
 * Sie beantwortet „welcher Stand laeuft?" - und steht bewusst NICHT mehr im
 * JavaScript (Begruendung bei `setzeBuildKennung` in scripts/buendel-aufteilung.ts).
 */
function buildKennungInsHtml() {
  const kennung = buildKennung();
  return {
    name: "build-kennung-ins-html",
    transformIndexHtml(html: string) {
      return setzeBuildKennung(html, kennung);
    },
  };
}

/**
 * Absichtliches Cache-Brechen: `BUENDEL_NEU=zwei npm run build` haengt „zwei"
 * an jeden Dateinamen unter assets/ - Caddy liefert /assets/* ein Jahr
 * `immutable` aus, ein neuer Name ist der einzige Weg an einer klebenden
 * Fehlantwort vorbei. Ohne die Variable bleibt alles bei den Vite-Vorgaben.
 */
const BUENDEL_NEU = (process.env.BUENDEL_NEU ?? "").replace(/[^A-Za-z0-9]/g, "");
const BUENDEL_NEU_NAMEN = BUENDEL_NEU
  ? {
      entryFileNames: `assets/[name]-[hash]${BUENDEL_NEU}.js`,
      chunkFileNames: `assets/[name]-[hash]${BUENDEL_NEU}.js`,
      assetFileNames: `assets/[name]-[hash]${BUENDEL_NEU}[extname]`,
    }
  : {};

/**
 * ★★★★★ EIN BAU FÜR DIE ECHTE SEITE SPRICHT IMMER MIT DEM SERVER (10.11.2026)
 * ============================================================================
 * Ohne `.env.production` fiel das Programm bis hierher STILL auf die lokale
 * Attrappe zurück (`VITE_BACKEND ?? "mock"` an zehn Stellen). Das sah gleich
 * aus, baute ohne Fehler - und keine Anmeldung kam je am Server an.
 * Zweimal live gegangen: 22./23.10. (15 Std. Schulzeit) und 10.11. (75 Min.),
 * beide Male aus einem frisch angelegten Arbeitsordner, dem die Datei fehlte
 * (sie liegt bewusst nicht in git und kommt in keinen neuen Worktree mit).
 *
 * Darum hängt der echte Bau nicht mehr an dieser Datei:
 *  - fehlt `VITE_BACKEND`, setzt der Bau `pocketbase` (+ die Server-Adresse);
 *  - steht dort ausdrücklich etwas anderes, BRICHT der Bau ab - laut.
 * Eine Attrappe für die Produktion nur noch bewusst: MOCK_BUILD=1.
 */
function sichereProduktionsUmgebung(command: string, mode: string) {
  if (command !== "build" || mode !== "production") return;
  if (process.env.MOCK_BUILD === "1") {
    console.warn("\n⚠️  MOCK_BUILD=1: Dieses Bündel spricht NICHT mit dem Server. Nie deployen.\n");
    return;
  }
  const env = loadEnv(mode, WURZEL, "VITE_");
  if (env.VITE_BACKEND && env.VITE_BACKEND !== "pocketbase") {
    throw new Error(
      `⛔ Bau abgebrochen: VITE_BACKEND="${env.VITE_BACKEND}" in einem Produktions-Bau. ` +
        `Das Bündel würde nicht mit dem Server sprechen (niemand könnte sich anmelden). ` +
        `Absichtlich? Dann MOCK_BUILD=1 voranstellen.`,
    );
  }
  if (!env.VITE_BACKEND) {
    process.env.VITE_BACKEND = "pocketbase";
    console.warn("ℹ️  .env.production fehlt - Produktions-Bau nimmt VITE_BACKEND=pocketbase.");
  }
  if (!env.VITE_POCKETBASE_URL) process.env.VITE_POCKETBASE_URL = "http://127.0.0.1:8090";
}

export default defineConfig(({ command, mode }) => (sichereProduktionsUmgebung(command, mode), {
  // Build-Kennung (22.08.2026, deterministisch seit 26.08.2026, seit 28.09.2026
  // in der index.html statt im Bündel): Sie steht als data-build am <html> und
  // beantwortet „welcher Stand laeuft?".
  //
  // Bis 26.08. stand hier `new Date().toISOString()`. Das war die EINZIGE
  // Ursache dafuer, dass `npm run build` desselben Commits jedes Mal andere
  // Bundle-Namen ergab. Seither: der Git-Stand. Gleicher Commit ⇒ gleiches
  // dist/, Byte fuer Byte (`npm run build:reproduzierbar`).
  //
  // ★★★ 28.09.2026: Die Kennung stand bis dahin als `__BUILD_KENNUNG__` in
  // main.tsx und damit im Einstiegs-Chunk - der bekam bei JEDEM Commit einen
  // neuen Namen, und jeder Chunk, der aus ihm importiert, erbte ihn. Jetzt steht
  // sie nur noch in der index.html (die Caddy ohnehin `no-cache` ausliefert);
  // die JavaScript-Dateien aendern ihren Namen nur noch, wenn sich ihr Inhalt
  // aendert. Der Frische-Waechter in pocketbase/deploy-frontend.sh liest sie
  // darum aus dist/index.html.
  //
  // Muss ein unveraenderter Commit doch einmal neue Dateinamen bekommen (etwa
  // weil im Cache eine FEHLANTWORT klebt - HTML statt JS), reicht die Kennung
  // dafuer seit 28.09. NICHT mehr (`BUILD_KENNUNG=<sha>-neu` aendert nur noch
  // die index.html). Dafuer gibt es jetzt `BUENDEL_NEU=<wort> npm run build`:
  // Es haengt <wort> an JEDEN Dateinamen unter assets/ (siehe unten).
  plugins: [react(), publicOhneSchwereMedien(), buildKennungInsHtml()],
  // Beim BAUEN kopiert das Plugin oben selbst (ohne die schweren Medien).
  // Im Entwicklungsbetrieb bleibt `public/` vollstaendig bedient.
  publicDir: command === "build" ? false : "public",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // ★ Stabile Teile des Bündels (28.09.2026): Bibliotheken und die
        // Tastenflow-Texte je Sprache bekommen eigene Dateien, deren Namen sich
        // nur aendern, wenn sich IHR Inhalt aendert. Regeln und Begruendung:
        // scripts/buendel-aufteilung.ts.
        manualChunks: erzeugeChunkFuer(),
        ...BUENDEL_NEU_NAMEN,
      },
    },
  },
  // sqlite-wasm (Wörterbuch) lädt sqlite3.wasm über `new URL(…, import.meta.url)`;
  // vorgebündelt fände der Entwicklungsserver die Datei nicht.
  optimizeDeps: { exclude: ["@sqlite.org/sqlite-wasm"] },
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: 5000,
    host: true,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    // ★ 28.09.2026: Im Test kommt das Register der Sprachpakete MIT allen
    // Paketen (tests/sprachpakete-vorgeladen.ts - Begründung dort und in
    // tests/setup.ts). Nur die kurzen Importpfade; der lange
    // („../src/lib/typing/sprachpakete") bleibt das echte Modul.
    alias: [
      {
        find: /^(?:(?:\.\.?\/)+|@\/lib\/typing\/)sprachpakete$/,
        replacement: fileURLToPath(new URL("./tests/sprachpakete-vorgeladen.ts", import.meta.url)),
      },
    ],
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
  },
}));
