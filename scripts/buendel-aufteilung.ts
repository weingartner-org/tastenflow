/**
 * ★★★ WIE DAS AUSGELIEFERTE BÜNDEL IN TEILE ZERFÄLLT (28.09.2026)
 * ============================================================================
 * Auftrag Johannes: *„nach jedem deploy lädt jeder wieder das ganze paket …
 * wenn spanisch geändert wird muss sich französisch nicht neu laden!"*
 *
 * GEMESSEN vorher (Live-Stand 3b197011): EIN Haupt-Chunk `assets/index-*.js`,
 * 12,3 MB roh, 3,5 MB gzip. Jeder Deploy änderte ihn - jeder Besucher lud nach
 * jedem Deploy alles neu, egal welches Programm er benutzt.
 *
 * Zwei Hebel, beide in `vite.config.ts` eingehängt:
 *  1. `App.tsx` lädt die Programmseiten erst, wenn ihre Adresse aufgerufen wird
 *     (`React.lazy`, `lib/seiteNachladen.tsx`). Das trennt die Programme.
 *  2. Diese Datei (`manualChunks`) legt fest, welche Teile STABILE eigene
 *     Dateien bekommen: die Bibliotheken (`vendor`), die Tastenflow-Texte je
 *     Sprache (`tf-daten-de|en|fr|es`, dazu der Korpus-Anker für sich) und der
 *     gemeinsame Kern aller Seiten (`app-kern`).
 *  3. ★ 28.09.2026: `tf-daten-<sprache>` wird erst geladen, wenn der Weg eines
 *     Kindes die Sprache braucht (`src/lib/typing/sprachpakete.ts`). Was der
 *     Code STATISCH braucht (Wortlisten, Frühfassungen, Vorlagen), liegt in
 *     `tf-fest-<sprache>` und kommt zu jedem Besucher.
 *
 * ── DIE KASKADE NACH OBEN (gemessen 28.09.2026) ─────────────────────────────
 * Ändert sich eine Datei, ändert sich auch der Name JEDER Datei, die sie
 * importiert (der alte Name steht ja in deren Text), und so weiter nach oben.
 * `App.tsx` nennt per `import()` alle Seiten - der Einstieg ändert sich also
 * bei fast jedem Deploy. Lägen gemeinsame Teile (Anmeldung, Fokus, Sprache) im
 * Einstieg, importierte JEDE Seite aus ihm und bekäme mit ihm jedes Mal einen
 * neuen Namen: gemessen 128 von 249 Dateien. Darum: Einstieg = nur `main.tsx` +
 * `App.tsx`, und niemand importiert aus ihm.
 * Die Grenze nach oben lässt sich mit statischen Importen NICHT ganz schliessen:
 * Ändert sich ein spanischer Text, bekommen auch die Tastenflow-Code-Dateien,
 * die ihn einbinden, neue Namen. Nicht aber die anderen Sprachen, die
 * Bibliotheken und die anderen Programme.
 *
 * ── WARUM „BLATT" DAS ENTSCHEIDENDE WORT IST ────────────────────────────────
 * Der Name einer Datei (`corpusFrEndeKids-<hash>.js`) hängt nicht nur an ihrem
 * eigenen Inhalt, sondern auch an den NAMEN der Dateien, die sie importiert -
 * die stehen ja in ihrem Text. Importiert ein Datenpaket auch nur eine Zeile
 * Code aus einem Teil, der sich oft ändert, bekommt es bei jeder Code-Änderung
 * einen neuen Namen und wird neu geladen: eine Kaskade. Darum kommt in ein
 * Datenpaket NUR, was ein Blatt ist - eine Datendatei, die nichts importiert
 * außer Typen und andere Datenblätter. Ist eine Datei kein Blatt, bleibt sie
 * draußen und reist mit dem Code (größer, aber nie falsch).
 * `tests/buendel-aufteilung.test.ts` hält fest, dass die Datendateien Blätter
 * bleiben.
 *
 * ⚠️ `vendor` enthält NUR Bibliotheken, die jede Seite ohnehin braucht. Eine
 *    Bibliothek, die nur eine Seite braucht (exceljs, mammoth, docx, jszip,
 *    pdfjs …), gehört NICHT hier hinein - sie würde sonst auf jeder Seite
 *    mitgeladen.
 */

/** Bibliotheken, die der Einstieg jeder Seite braucht - ändern sich nur mit `npm update`. */
export const VENDOR_PAKETE: ReadonlySet<string> = new Set([
  "react",
  "react-dom",
  "scheduler",
  "react-router",
  "react-router-dom",
  "@remix-run/router",
  "zustand",
  "use-sync-external-store",
  "pocketbase",
]);

/** Paketname aus einer Modul-Kennung (`…/node_modules/@scope/name/…`), sonst `null`. */
export function paketVon(id: string): string | null {
  const m = /\/node_modules\/((?:@[^/]+\/)?[^/]+)\//.exec(id.replace(/\\/g, "/"));
  return m ? m[1] : null;
}

const TYPING = "/src/lib/typing/";

/**
 * Welche Dateien unter `src/lib/typing/` Tastenflow-DATEN sind (Pfad relativ,
 * ohne `.ts`). Ob sie auch Blätter sind, prüft `chunkFuer` am echten Graphen.
 * ⚠️ `corpus.ts`, `serien.ts`, `lexicon.ts` sind CODE (sie sammeln und rechnen)
 *    und passen darum absichtlich nicht auf das Muster.
 */
export const TF_DATEN_MUSTER =
  /^(corpus[A-Z0-9]\w*|serien[A-Z0-9]\w*|words\w*|fruehFassungen|lexikonNachtrag\w*|vorlagenDaten\/\w+|expedition\/texts|uebungsformen\/\w+|sprachpaket[A-Z][a-z])$/;

/**
 * ★★★ Die Sprachpakete (28.09.2026, `src/lib/typing/sprachpakete.ts`): je
 * Sprache EIN Modul, das per `import()` geladen wird. Es selbst und alles, was
 * NUR über Sprachpakete erreichbar ist, bildet `tf-daten-<sprache>` - diese
 * Dateien lädt ein Besucher erst, wenn sein Weg die Sprache braucht.
 */
export const SPRACHPAKET_MUSTER = /^sprachpaket([A-Z][a-z])$/;

/** Dateien, deren Sprache nicht am Namen steht. */
const SPRACHE_AUSNAHMEN: Record<string, TfSprache> = {
  "vorlagenDaten/raices": "es",
  "vorlagenDaten/racines": "fr",
  "vorlagenDaten/wordRoots": "en",
};

// ★ G2-NEUN (25.10.2026): dazu die neun Sprachen des Gerüsts (Kürzel `Bg El Hu Nl Pt Br Ro Sv Uk`).
export type TfSprache = "de" | "en" | "fr" | "es" | "it" | "pl" | "tr" | "cs" | "bg" | "el" | "hu" | "nl" | "pt" | "br" | "ro" | "sv" | "uk";

/**
 * Die Sprache einer Datendatei am Namen: das ERSTE `En`/`Fr`/`Es`/`It`/`Pl`/`Tr`/`Cs` (★ G2-NEUN: und `Bg` … `Uk`), auf das ein
 * Großbuchstabe, eine Ziffer oder das Ende folgt (`corpusFrEndeKids` ⇒ fr, nicht
 * en - „Ende" ist kein Sprachkürzel; `serienEnFrueh` ⇒ en). Alles ohne
 * Kürzel ist Deutsch oder sprachübergreifend und liegt im Paket „de".
 */
export function spracheVon(name: string): TfSprache {
  if (name in SPRACHE_AUSNAHMEN) return SPRACHE_AUSNAHMEN[name];
  // Ein Sprachpaket trägt seine Sprache im Namen (`sprachpaketDe` ⇒ de) - auch
  // eine künftige (`sprachpaketIt` ⇒ it), ohne dass hier etwas nachzutragen ist.
  const paket = SPRACHPAKET_MUSTER.exec(name);
  if (paket) return paket[1].toLowerCase() as TfSprache;
  const basis = name.slice(name.lastIndexOf("/") + 1);
  // ★ F5-F8 Italienisch (02.10.2026): `It` dazu - `wordsIt` und `lexikonNachtragIt` sind Datenblätter der italienischen
  // Sprache; ohne das Kürzel landeten sie im deutschen Paket (und das italienische Lexikon bei jedem deutschen Kind).
  // ★ F5-F8 Polnisch (03.10.2026): `Pl` ebenso (`wordsPl`, `lexikonNachtragPl`, künftig `corpusPl<Charge>`).
  // ★ F5-F8 Türkisch (03.10.2026): `Tr` dazu - `wordsTr`, `lexikonNachtragTr` und `uebungsformen/gelaeufigkeitTr` sind Datenblätter der
  // türkischen Sprache (gleiche Begründung wie `It`).
  // ★ F5-F8 Tschechisch (03.10.2026): `Cs` ebenso (`wordsCs`, `lexikonNachtragCs`, künftig `corpusCs…`) - gemessen: kein bestehender
  // Dateiname im Baum trägt `Cs` vor einem Grossbuchstaben, einer Ziffer oder am Ende.
  // ★ G2-NEUN (25.10.2026): die neun Kürzel des Gerüsts. Falle „Ende": ein Kürzel zählt nur vor einem Grossbuchstaben,
  // einer Ziffer, `_` oder am Ende - „Eltern", „Brief", „Robot", „Hund" (Kleinbuchstabe danach) bleiben deutsch. GEMESSEN
  // am 25.10.2026 über alle Dateien unter `src/lib/typing/`: kein bestehender Name trägt eines der neun Kürzel so - die
  // einzigen Treffer sind die neun neuen `sprachpaket<Xx>` (die ohnehin `SPRACHPAKET_MUSTER` liest). `SPRACHE_AUSNAHMEN`
  // braucht darum (noch) keinen Eintrag; ein künftiger Name, der zufällig auf `El`, `Ro`, `Uk`, `Pt` … endet (etwa
  // `…Modell` ⇒ nein, `…ZielEl` ⇒ ja), gehört dorthin.
  const m = /(En|Fr|Es|It|Pl|Tr|Cs|Bg|El|Hu|Nl|Pt|Br|Ro|Sv|Uk)(?=[A-Z0-9_]|$)/.exec(basis);
  if (!m) return "de";
  return m[1].toLowerCase() as TfSprache;
}

/** Relativer Name unter `src/lib/typing/` ohne `.ts`, sonst `null`. */
export function typingName(id: string): string | null {
  const s = id.replace(/\\/g, "/");
  const i = s.indexOf(TYPING);
  if (i < 0 || !s.endsWith(".ts")) return null;
  return s.slice(i + TYPING.length, -3);
}

interface ModulInfo {
  importedIds: readonly string[];
  importers: readonly string[];
  isEntry?: boolean;
}

interface GraphApi {
  getModuleInfo: (id: string) => ModulInfo | null;
  getModuleIds?: () => IterableIterator<string> | Iterable<string>;
}

/** Hilfsmodule, die Vite selbst einfügt - ändern sich nur mit Vite. */
const VITE_HELFER = /^\0(vite\/preload-helper|commonjsHelpers)/;

/**
 * Module, die im EINSTIEG bleiben müssen: `App.tsx` nennt per `import()` die
 * Dateinamen aller Seiten und ändert sich darum bei jedem Deploy. Genau
 * deshalb darf niemand aus dem Einstieg importieren - alles andere, was der
 * Einstieg braucht, liegt im „app-kern".
 */
const IM_EINSTIEG = /\/src\/(App\.tsx|main\.tsx)$/;

/**
 * Der Kern für `build.rollupOptions.output.manualChunks`. Gibt den Paketnamen
 * zurück oder `undefined` (dann entscheidet Rollup).
 */
export function erzeugeChunkFuer() {
  const blattMerker = new Map<string, boolean>();

  function istDatenBlatt(id: string, info: (id: string) => ModulInfo | null): boolean {
    const bekannt = blattMerker.get(id);
    if (bekannt !== undefined) return bekannt;
    // Vorläufig „nein" - so endet ein Kreis sicher auf der vorsichtigen Seite.
    blattMerker.set(id, false);
    const name = typingName(id);
    const i = info(id);
    const ok =
      name !== null &&
      TF_DATEN_MUSTER.test(name) &&
      i !== null &&
      i.importedIds.every((x) => istDatenBlatt(x, info));
    blattMerker.set(id, ok);
    return ok;
  }

  /**
   * Nur über Sprachpakete erreichbar? Jeder, der die Datei importiert, ist
   * selbst ein Sprachpaket oder ebenfalls nur über Sprachpakete erreichbar.
   * Importiert irgendein CODE-Modul sie, lädt sie jeder Besucher ohnehin mit.
   */
  const paketMerker = new Map<string, boolean>();
  function nurImPaket(id: string, info: (id: string) => ModulInfo | null): boolean {
    const bekannt = paketMerker.get(id);
    if (bekannt !== undefined) return bekannt;
    paketMerker.set(id, false); // Kreis ⇒ vorsichtig „nein" (dann fest geladen, nie falsch)
    const name = typingName(id);
    const i = info(id);
    let ok: boolean;
    if (name !== null && SPRACHPAKET_MUSTER.test(name)) ok = true;
    else
      ok =
        i !== null &&
        i.importers.length > 0 &&
        i.importers.every((x) => istDatenBlatt(x, info) && nurImPaket(x, info));
    paketMerker.set(id, ok);
    return ok;
  }

  let kern: Set<string> | null = null;

  /** Alles, was der Einstieg STATISCH braucht (ohne die per `import()` geladenen Seiten). */
  function kernMenge(api: GraphApi): Set<string> {
    if (kern) return kern;
    kern = new Set();
    const ids = api.getModuleIds ? [...api.getModuleIds()] : [];
    const stapel = ids.filter((id) => api.getModuleInfo(id)?.isEntry);
    while (stapel.length > 0) {
      const id = stapel.pop()!;
      if (kern.has(id)) continue;
      kern.add(id);
      for (const i of api.getModuleInfo(id)?.importedIds ?? []) stapel.push(i);
    }
    return kern;
  }

  return function chunkFuer(id: string, api: GraphApi): string | undefined {
    if (VITE_HELFER.test(id)) return "vendor";
    const paket = paketVon(id);
    if (paket !== null) return VENDOR_PAKETE.has(paket) ? "vendor" : undefined;

    const name = typingName(id);
    if (name !== null && TF_DATEN_MUSTER.test(name)) {
      const info = api.getModuleInfo(id);
      const graph = (x: string) => api.getModuleInfo(x);
      // Das Sprachpaket selbst: nur per `import()` geladen, gehört aber in
      // SEIN Datenpaket - sonst bekäme es eine eigene Datei, die das Paket
      // nur weiterreicht (ein Umweg mehr beim Laden).
      if (SPRACHPAKET_MUSTER.test(name) && istDatenBlatt(id, graph)) return `tf-daten-${spracheVon(name)}`;
      // Nur per `import()` geladen (z. B. die Tippchallenge-Texte): Die hat Rollup
      // schon in eine eigene, stabile Datei gelegt - in ein Datenpaket gezogen,
      // würde sie früher geladen als nötig.
      if (info && info.importers.length > 0 && istDatenBlatt(id, graph)) {
        // Der Anker wächst mit JEDER Korpus-Charge, gleich welcher Sprache - im
        // Paket einer Sprache zöge er deren Neuladen bei jeder anderen nach sich.
        if (name === "corpusAnker") return "tf-korpus-anker";
        // ★★★ 28.09.2026: NUR über Sprachpakete erreichbar ⇒ `tf-daten-<sprache>`,
        // nachgeladen. Braucht der Code sie statisch (Wortlisten, Frühfassungen,
        // Vorlagen …), lädt sie jeder ⇒ `tf-fest-<sprache>` - weiter je Sprache
        // getrennt, damit eine spanische Änderung keine französische Datei neu
        // laden lässt.
        return nurImPaket(id, graph) ? `tf-daten-${spracheVon(name)}` : `tf-fest-${spracheVon(name)}`;
      }
    }

    // Der gemeinsame Kern: was der Einstieg braucht, ausser dem Einstieg selbst.
    // Die Seiten importieren von HIER, nicht aus dem Einstieg - sonst bekäme
    // jede Seite bei jedem Deploy einen neuen Namen (siehe `IM_EINSTIEG`).
    if (!id.startsWith("\0") && !IM_EINSTIEG.test(id.replace(/\\/g, "/")) && !/\.css($|\?)/.test(id)) {
      if (kernMenge(api).has(id) && !api.getModuleInfo(id)?.isEntry) return "app-kern";
    }
    return undefined;
  };
}

/**
 * Die Build-Kennung gehört an `<html>` in der index.html - NICHT in ein
 * JavaScript-Bündel. Stünde sie im Code (bis 28.09.2026 in `main.tsx`),
 * bekäme der Einstieg bei jedem Commit einen neuen Namen - und mit ihm jede
 * Datei, die etwas aus ihm importiert.
 * ⚠️ `lang` bleibt das ERSTE Attribut: Der Server-Hook
 *    (`pb_hooks/link_previews_lib.pb.js`) ersetzt `<html lang="…"`.
 */
export function setzeBuildKennung(html: string, kennung: string): string {
  const alt = '<html lang="de">';
  if (!html.includes(alt)) {
    throw new Error(`index.html: "${alt}" nicht gefunden - die Build-Kennung hätte keinen Platz.`);
  }
  const sicher = kennung.replace(/[^A-Za-z0-9+._-]/g, "");
  return html.replace(alt, `<html lang="de" data-build="${sicher}">`);
}
