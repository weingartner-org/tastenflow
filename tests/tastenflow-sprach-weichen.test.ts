/**
 * ★★★ E2a (25.09.2026): DER WEICHEN-ZÄHLER.
 *
 * Bauplan `BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md` §2.3 Punkt 3 / §14
 * E2 / Auftrag E2a Punkt 6: die „201 stillen Weichen" der Form
 * `x === "en" ? A : B` (`recherche-französisch-2026-09-25/code-bestand.md`
 * §A.2) sind die GEFÄHRLICHSTE Stelle des ganzen Umbaus - für „fr" werden
 * sie NICHT rot, sie liefern still Deutsch.
 *
 * Dieser Wächter zählt sie im Quelltext (Client UND Server) und prüft eine
 * FESTE Obergrenze - **die Zahl darf künftig nur SINKEN**, nie steigen. Wird
 * eine neue Weiche dieser Form gebraucht, gehört sie über eine Tabelle
 * (`Record<Lernweg, T>`) oder eine kleine Hilfsfunktion gebaut, die
 * TypeScript alle Schlüssel abverlangt - nicht über eine weitere Ternäre.
 *
 * ★ Stand E2a (25.09.2026): 222 Treffer, gezählt ZEILENÜBERGREIFEND (`\s*`
 * schliesst den Zeilenumbruch eines mehrzeiligen `? :` mit ein - die
 * Recherche zählte nur EINZEILIGE Treffer und kam damit auf „201"; derselbe
 * zeilenübergreifende Zähler fand am Stand VOR E2a (`5605195b`) 233 Treffer -
 * das ist die echte Vergleichszahl). Siehe BEFUND-2026-09-25-E2A-GERUEST.md
 * für die Liste der umgebauten/bewusst gelassenen Stellen.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";
import { describe, expect, it } from "vitest";

const WURZEL = resolve(__dirname, "..");

/** Dieselben zwei Ordner wie in der Recherche (§A.2), rekursiv, dieselben Endungen. */
const ORDNER = ["src", "pocketbase"];
const ENDUNGEN = [".ts", ".tsx", ".js"];

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

/** Zählt `x === "en" ?` (mit optionalem Leerraum) - dieselbe Form wie die Recherche. */
const WEICHE = /===\s*"en"\s*\?/g;

function zaehleWeichen(): number {
  let summe = 0;
  for (const ordner of ORDNER) {
    for (const datei of sammleDateien(resolve(WURZEL, ordner))) {
      const inhalt = readFileSync(datei, "utf8");
      const treffer = inhalt.match(WEICHE);
      if (treffer) summe += treffer.length;
    }
  }
  return summe;
}

/**
 * ★★★ DIE OBERGRENZE - nach dem Umbau von E2a gemessen (25.09.2026: 222 mit
 * diesem zeilenübergreifenden Zähler; derselbe Zähler fand 233 am Stand VOR
 * E2a). Darf künftig NUR SINKEN. Steigt sie, ist irgendwo eine NEUE stille
 * Weiche der gefährlichen Form entstanden - genau die Falle, vor der der
 * Bauplan warnt.
 *
 * ★★★★★ E11a (25.09.2026): auf 216 gesenkt - beim Füllen der fr-Tabellen
 * wurden sechs Weichen dieser Form durch eine `Record<BedienSprache, …>`-
 * Tabelle oder eine `if`-Kette ersetzt (`BadgeShelf.fmtCount`,
 * `EigeneUebungLauf.eigeneUebungName`, `KontoErklaerung.aufzaehlung`,
 * `teilnehmerlisteDocx.listenDatum`, `schreibprobe.pruefungWort`/
 * `pruefungWortMehrzahl`), statt eine neue Weiche für „fr" anzuhängen.
 *
 * ★ E10b (25.09.2026): 220 ⇒ 209 - die elf Weichen der Übungsformen
 * (`wortquelle`, zwei Kopien davon, sechs Inhalts-Vorräte, Korpus, Stufen-
 * Wortschatz) sind Tabellen `Record<Lang, …>` geworden. Wächter dazu:
 * `tastenflow-wortquelle-fr.test.ts`. Beim Zusammenführen mit
 * `feat/tastenflow` kam eine neue Oberflächen-Weiche dazu (Schulstufen-Name in
 * `TastenflowReiter.tsx`/`KlassenEinstellungsFelder.tsx`, `67530ff2` - die
 * zweite Stelle war schon gezählt) ⇒ gemessen 210. Die gehört in E11.
 *
 * ★ Nach dem Zusammenführen von E10b und E11a gemessen: 204.
 *
 * ★ E11a-2 (26.09.2026): 194 ⇒ 186 - acht Ternären wurden durch Tabellen
 * ersetzt (`ThemeToggle.tsx`/`CONTRAST_NAMEN_JE_SPRACHE`, `prozentAnzeige`,
 * `fmtPercent`, `topfLabel`, `weekLabelJeSprache` an drei Aufrufstellen,
 * `RechtlichesFusszeile.tsx`/`LANG_ATTRIBUT`), siehe
 * BEFUND-2026-09-26-E11A2-OBERFLAECHE-AN.md.
 *
 * ★ E11a-3 (26.09.2026): 186 ⇒ 175 - „Meine Klassen" (`TastenflowReiter.tsx`)
 * auf `spracheGewaehlt` umgestellt, dabei elf echte Ternären durch Tabellen
 * ersetzt (`TASTEN_NAME_JE_SPRACHE`/`TASTE_NAME_JE_SPRACHE` an drei Stellen,
 * `DATUM_KURZ_JE_SPRACHE`, `LANG_LABELS_JE_SPRACHE`,
 * `STUFE_LABELS_JE_SPRACHE`, `TASTEN_NAME_JE_SPRACHE` in `startPoints`),
 * siehe BEFUND-2026-09-26-E11A3-OBERFLAECHE-BAUTEILE.md. Mehrere weitere
 * Stellen (`spaltenGrund`, `wochenzielHilfe`, `schulstufeText`, `langLabel`,
 * `klassenBezeichnung`, `legendenText`, `scoreErklaerung`,
 * `eigeneUebungKurzstand`) bekamen dabei eine echte dritte Fassung, blieben
 * aber als verschachtelte Ternäre `sprache === "fr" ? … : sprache === "en" ?
 * … : …` stehen - der Zähler sieht sie unverändert, weil `=== "en" ?` darin
 * weiterhin genau einmal vorkommt.
 *
 * ★ E10c (26.09.2026): 173 ⇒ 170 - drei Weichen im GENERATOR
 * (`generator.ts`: `wordBase`, `stufeVocab`, `punctItems`-Fallback) wurden
 * durch Tabellen (`Record<Lang, …>`) ersetzt (BEFUND-2026-09-26-E10C-
 * GENERATOR-FR.md). Die übrigen Generator-Weichen (`caseWord`, die
 * Pseudowort-Werkstatt, `charDrillLine`) standen als `if`/`===` OHNE `?`
 * da - der Zähler sah sie nie, wurden aber ebenfalls auf Tabellen umgestellt.
 *
 * ★ E11a-4 (26.09.2026): 170 ⇒ 168 - zwei echte Ternären zu Tabellen
 * (`ehrenplatz()` in `klassenmatch.ts`, die Schulstufen-Anzeige im
 * Startniveau-Auswahlfeld von `KlassenEinstellungsFelder.tsx`). Mehrere
 * weitere Falle-30-Funde (`bedienCopy()`, `eigeneUebungAnkuendigung()`,
 * `einrichtungTexte()`, `einrichtungAufzaehlung()`, `zusammenfassung()`,
 * die Zeichenabstand-/Belohnungsspiel-Labels) bekamen ebenfalls eine echte
 * dritte Fassung, blieben aber als verschachtelte Ternäre `sprache === "fr"
 * ? … : sprache === "en" ? … : …` bzw. `sprache === "en" ? … : sprache ===
 * "fr" ? … : …` stehen - der Zähler sieht sie unverändert, weil `=== "en" ?`
 * darin weiterhin genau einmal vorkommt (siehe BEFUND-2026-09-26-E11A4-
 * OBERFLAECHE-REST.md).
 *
 * ★★★★★ E11a-5 (26.09.2026, EINGESCHALTET): 168 ⇒ 98, gemessen nach dem
 * Zusammenführen aller drei Stränge (Chat-Agent, Übungsformen/Défi/Tasten
 * erkunden, Expedition/Abzeichen/Statistik). Seit „fr" wirklich durchgeht,
 * ist jede übrig gebliebene Weiche einzeln gelesen: sie prüft die
 * ÜBUNGSSPRACHE, den LERNWEG oder eine Variante (`variante === "us"`), oder
 * sie steht in einer Kette, deren „fr"-Zweig davor kommt (Befund E11a-5).
 *
 * ★ ES-F2 (27.09.2026): 98 ⇒ 93, gemessen nach dem Gerüst für „es" (Falle
 * 18: die Grenze wird nach jedem Zusammenführen NEU gemessen, nicht nur
 * abgesenkt, wenn zufällig etwas sinkt). Das Gerüst selbst hat KEINE neue
 * `=== "en" ?`-Weiche gebraucht - jede der rund 208 neuen „es"-Stellen ist
 * eine Tabelle (`Record<BedienSprache/Lang/Lernweg, …>`) oder ein eigener
 * `if`/`switch`-Zweig; ein paar bestehende Stellen sind dabei zu einer
 * Tabelle geworden statt einer weiteren Ternäre. Siehe
 * `BEFUND-2026-09-27-ES-F2-GERUEST.md`.
 */
// ★ G2a (02.10.2026): 93 ⇒ 79, GEMESSEN nach dem Gerüst für it/pl/tr/cs (Grenze 0
// gesetzt, Zahl aus der Fehlermeldung gelesen, Grenze darauf gesetzt). Das Gerüst
// hat keine neue `=== "en" ?`-Weiche gebraucht - jede neue Stelle ist ein
// Tabelleneintrag, ein `altSpracheOderEn`-Aufruf oder ein eigener `if`-Zweig.
// Siehe `BEFUND-2026-10-02-G2A-GERUEST-VIER-SPRACHEN.md`.
// ★ G2b-2 (02.10.2026): 79 ⇒ 76, GEMESSEN (derselbe Zähler als Skript über src/ und pocketbase/):
// drei `=== "en" ?`-Weichen sind Tabellen geworden (Admin-Statistik: zwei Sprach-Adjektive →
// `SPRACHE_ADJEKTIV`; Stimmenwahl/Tastatur-Sätze ohne Ternäre). Keine neue Weiche entstanden.
// Siehe `BEFUND-2026-10-02-G2B2-DATEN-SERVER-STIMMEN.md`.
// ★ G2-NEUN (25.10.2026): GEMESSEN nach dem Gerüst für die neun Wege (Grenze 0 gesetzt, Fehlermeldung „expected 76"):
// 76, unverändert - das Gerüst hat keine neue `=== "en" ?`-Weiche gebraucht (Tabelleneinträge, `mitRueckfallEn`,
// `geruestAufEn`, `istGeruestSprache`). Siehe `BEFUND-2026-10-25-G2-GERUEST-NEUN.md`.
// ★ 06.11.2026: 76 ⇒ 92, GEMESSEN nach dem Merge des Live-Stands 87d8a6f37 (feat/lernwerkstatt): alle 16 neuen Treffer
// stammen aus dessen Commits (git diff 96935acad..87d8a6f37), die Freigabe der neun Sprachen hat keine Weiche gebraucht.
const OBERGRENZE = 92;

describe("Weichen-Zähler: x === \"en\" ? A : B darf nur weniger werden", () => {
  it(`nicht mehr als ${OBERGRENZE} Treffer in src/ und pocketbase/`, () => {
    const n = zaehleWeichen();
    expect(n).toBeLessThanOrEqual(OBERGRENZE);
  });

  it("die Zählung selbst funktioniert (Gegenprobe: findet mindestens einen bekannten Rest)", () => {
    // ★ Gegenprobe gegen einen leeren/kaputten Wächter (Bauplan-Lehre
    // „Was beweist ein grüner Wächter?"): mindestens EINE bekannte, bewusst
    // gelassene Weiche muss der Zähler wirklich finden.
    const quelle = readFileSync(resolve(WURZEL, "src/lib/typing/schreibprobe.ts"), "utf8");
    expect(quelle).toMatch(WEICHE);
  });
});
