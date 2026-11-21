/**
 * Die PRÜFUNGSTEXTE der Schreibprobe - 15 je Niveau, jeder mindestens 6000
 * Zeichen (Vorgabe Johannes, 09.09.2026).
 *
 * ★★★★★ DIESE TEXTE KOMMEN IM LEHRGANG NICHT VOR.
 * Johannes: *„diese texte sind Prüfungen vorbehalten und kommen sonst nicht im
 * Lehrgang."* Sie stehen deshalb NICHT im Korpus, NICHT in den Serien und NICHT
 * im Korpus-Manifest - und der Wächter `npm run pruefstand:schreibproben`
 * beweist das, statt es zu behaupten. Wer einen dieser Texte in `corpus*.ts`
 * kopiert, macht die Schreibprobe wertlos: Ein Kind, das den Text schon
 * hundertmal geübt hat, schreibt eine andere Prüfung als seine Klasse.
 *
 * ── Warum nachgeladen wird ──────────────────────────────────────────────────
 * 6 Niveaus × 15 Texte × 6000 Zeichen sind gut 540 KB. Die dürfen nicht im
 * Start-Bündel jedes Kindes liegen, nur weil es die Schreibprobe GIBT. Geladen
 * wird über `import()` genau EIN Niveau, und nur dann, wenn wirklich eine
 * Schreibprobe läuft - Vite schneidet daraus je Niveau ein eigenes Stück.
 *
 * ── Warum Zeilen und kein Fließtext ─────────────────────────────────────────
 * Der Übungslauf (`TypingSession`) arbeitet zeilenweise: eine Zeile ist die
 * Einheit, die vorgelesen, auf die Braillezeile geschrieben und rückgemeldet
 * wird. Ein Fließtext müsste beim Laden umgebrochen werden - und ein Umbruch,
 * der von der Fensterbreite abhinge, gäbe zwei Kindern verschiedene Zeilen.
 * Die Zeilen stehen deshalb fest im Text.
 *
 * ── ★ E7a (24.09.2026): der LERNWEG entscheidet, welche Bank geladen wird ───
 * Bauplan `BAUPLAN-2026-09-24-ENGLISCHER-LEHRGANG.md` §5.3: Weg „en" hat seine
 * eigenen Dateien (`texteStartEn.ts` …), Weg „de" bleibt BYTE FÜR BYTE, wie er
 * war - `lernweg` ist darum ein optionales Argument, das fehlend „de" heisst
 * (dieselbe Regel wie überall im Lernweg-Umbau). Zwei Niveaus haben auf „en"
 * schon eine echte Bank (`start`, `gross` - erzeugt wie ihre deutschen
 * Geschwister, siehe die zwei `*-en.mts`-Erzeuger); `code` teilt sich sein
 * Niveau mit „de" (Programmcode ist schon englisch - siehe die Datei-Köpfe
 * dort für die offene Frage zur US/UK-Tastengriffigkeit). Die vier
 * geschriebenen Niveaus (`buchstaben`, `satz`, `zahlen`, `alles`) sind auf
 * „en" vorbereitete LEERE Dateien für E7b - siehe {@link EN_NIVEAUS_GEFUELLT}
 * in `schreibprobe.ts`.
 *
 * ── ★ E13a (26.09.2026): Weg „fr" - Bauplan
 * `BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md` §7.1, §14 Etappe E13 ────────
 * Dieselbe Bauart wie „en": zwei Niveaus sind ERZEUGT (`start` = „Rangée de
 * base + e", `gross` = „Premières lettres" - siehe die zwei `*-fr.mts`-
 * Erzeuger), die übrigen fünf (`buchstaben`, `satz`, `zahlen`, `alles`,
 * `code`) sind vorbereitete LEERE Dateien für eine spätere Etappe (E13b) -
 * siehe {@link FR_NIVEAUS_GEFUELLT} in `schreibprobe.ts`.
 * ★ E13b-1 bis E13b-5 (26.09.2026): alle fünf sind inzwischen gefüllt, als
 * letztes `code` - eine EIGENE französische Bank (`texteCodeFr.ts`), wie
 * „en" seit E9; „fr" teilt sich „code" mit keinem anderen Weg.
 */
import type { Lernweg } from "../lernweg";
import type { DefiGrundreihe, ProbenNiveau } from "../schreibprobe";
import { wandleTypografie, type FranzVariante } from "../franzVariante";
// ★ G3c-VERTEILER (25.10.2026): die eigenen Bänke der neun Gerüst-Wege (`bank<Xx>.ts`, heute leer ⇒ englische Bank).
import { geruestBank } from "./geruestBanken";

/** Ein Prüfungstext. */
export interface Probentext {
  /**
   * 0-basierte Nummer innerhalb des Niveaus (0 … 14) - sie ist der Schlüssel,
   * über den die Klasse sich merkt, welcher Text schon dran war.
   */
  nr: number;
  /**
   * Kurzer Titel. Kind und Lehrkraft sehen ihn im Ergebnis, damit man später
   * nicht nachschlagen muss, worum es ging - z. B. „Der Wind und die Sonne".
   */
  titel: string;
  /** Die Zeilen, in der Reihenfolge, in der sie geschrieben werden. */
  zeilen: string[];
}

/**
 * ★ E10d (26.09.2026, Bauplan §7.2 Punkt 3): „Leerzeichen vor `: ; ! ?` kommt
 * aus der KLASSEN-Variante - das Défi-Ergebnis vergleicht nur innerhalb einer
 * Klasse, also innerhalb einer Variante." Die geschriebenen Défi-Texte
 * (`texteStartFr.ts` u. a.) stehen fest in der FR/BE/CH-Grundform (Leerzeichen
 * vor allen vieren, wie die Lehrgangs-Texte) - dieselbe letzte Servierstufe
 * wie {@link wandleTypografie} im gewöhnlichen Übungslauf (`corpus.ts`
 * `wandleVariante`), nur hier auf einen ganzen {@link Probentext} statt auf
 * eine einzelne Zeile.
 *
 * ⚠️ NOCH NICHT VERDRAHTET: Der Bildschirm der Tippchallenge
 * (`components/typing/SchreibprobeLauf.tsx`) ruft `ladeTexte`/`ladeText`
 * bisher OHNE Landesvariante auf - er liegt ausserhalb des Bibliotheks-Auftrags
 * E10d (nur `src/lib`, siehe `BEFUND-2026-09-26-E10D-VARIANTEN.md`). Die
 * Bibliothek ist ab hier bereit; wer den Bildschirm anfasst, muss nur noch die
 * Klassen-Variante (`franzVariante(klassenVorgabe)`) an jeder `ladeText(e)`-
 * Stelle mitgeben, oder jeden geladenen {@link Probentext} durch diese
 * Funktion schicken.
 */
export function wandleProbentextTypografie(
  text: Probentext,
  variante: FranzVariante,
): Probentext {
  if (variante !== "fr-CA") return text; // FR/BE/CH: schon in der Grundform, wie wandleTypografie
  return { ...text, zeilen: text.zeilen.map((z) => wandleTypografie(z, variante)) };
}

/**
 * ★ G2b-2: die Sprache der Text-BANK, die ein Weg liest. de, en, fr, es, it: ihre eigene.
 * pl, cs: Englisch, solange ihre Texte nicht geschrieben sind (RÜCKFALL-EN, wie
 * `WEG_GRUNDSPRACHE` in account.ts) - die Etappe der Sprache setzt hier ihre eigene ein.
 * ★ IT-RETO (02.10.2026): „it" liest seine EIGENE Bank (`texte*It.ts`) - Niveaus, deren Bank noch fehlt, liefern
 * nichts (siehe {@link IT_NIVEAUS_GEFUELLT} in `schreibprobe.ts`), NIE die englische.
 * ★ PL-RETO (09.10.2026): „pl" ebenso - eigene Bank (`texte*Pl.ts`), siehe {@link PL_NIVEAUS_GEFUELLT}.
 */
const BANK_JE_WEG: Readonly<Record<Lernweg, "de" | "en" | "fr" | "es" | "it" | "pl" | "tr" | "cs">> = {
  de: "de",
  en: "en",
  fr: "fr",
  es: "es",
  it: "it",
  pl: "pl",
  tr: "tr", // ★ TR-RETO (10.10.2026): eigene Bank, kein Rückfall
  cs: "cs", // ★ CS-RETO (10.10.2026): eigene Bank
  // RÜCKFALL-EN (G2-NEUN): bg, el, hu, nl, pt, br, ro, sv, uk zeigen vorerst Englisch.
  bg: "en",
  el: "en",
  hu: "en",
  nl: "en",
  pt: "en",
  br: "en",
  ro: "en",
  sv: "en",
  uk: "en",
};

/**
 * Die Bank-Sprache eines Weges. Ein Wert, den es nicht gibt (umgangener Typ, kaputter Speicher),
 * wirft in Entwicklung und Tests; im ausgelieferten Programm wird er laut gemeldet und es gibt
 * KEINE Texte (`null`) - nie die deutschen.
 */
function bankSprache(lernweg: Lernweg): "de" | "en" | "fr" | "es" | "it" | "pl" | "tr" | "cs" | null {
  if (Object.hasOwn(BANK_JE_WEG, lernweg)) return BANK_JE_WEG[lernweg];
  const meldung = `ladeTexte: kein Weg "${String(lernweg)}" - niemals still auf die deutschen Texte zurückfallen.`;
  if (import.meta.env.PROD) {
    console.error(meldung);
    return null;
  }
  throw new Error(meldung);
}

/**
 * Alle Texte eines Niveaus nachladen.
 *
 * ⚠️ Die `import()`-Pfade stehen ABSICHTLICH ausgeschrieben in einem
 * `switch` und nicht als Vorlage (`./texte${niveau}.ts`). Vite kann einen
 * Vorlagen-Pfad nicht auflösen und packt im Zweifel ALLE Treffer in ein
 * einziges Stück - womit der Grund für das Nachladen weg wäre.
 */
export async function ladeTexte(
  niveau: ProbenNiveau,
  lernwegGewaehlt: Lernweg = "de",
  grundreihe?: DefiGrundreihe,
): Promise<Probentext[]> {
  // ★ G2b-2 (02.10.2026, G1c §1.1 Nr. 21): welche BANK ein Weg liest. Ein Weg ohne eigene
  // Bank (it, pl, tr, cs) liest ausdrücklich die ENGLISCHE - nie die deutsche (vorher lief er
  // in den deutschen `switch` am Ende: eine italienische Klasse hätte „skf döj akla jkslö"
  // geschrieben). Die Tabelle ist `Record<Lernweg, …>`: ein neuer Weg kompiliert erst mit Eintrag.
  // ★ G3c-VERTEILER (25.10.2026): ein Gerüst-Weg mit eigener Bank liest NUR sie (ein Niveau ohne Lader: nichts, nie Englisch/Deutsch).
  const geruest = geruestBank(lernwegGewaehlt);
  if (geruest) {
    const lader = geruest.texte[niveau];
    return lader ? await lader() : [];
  }
  const lernweg = bankSprache(lernwegGewaehlt);
  if (lernweg === null) return [];
  if (lernweg === "en") {
    switch (niveau) {
      case "start":
        return (await import("./texteStartEn")).TEXTE;
      case "gross":
        return (await import("./texteGrossEn")).TEXTE;
      case "buchstaben":
        return (await import("./texteBuchstabenEn")).TEXTE;
      case "satz":
        return (await import("./texteSatzEn")).TEXTE;
      case "zahlen":
        return (await import("./texteZahlenEn")).TEXTE;
      case "alles":
        return (await import("./texteAllesEn")).TEXTE;
      // ★ E9 (24.09.2026): „code" hat jetzt eine EIGENE englische Bank -
      // vorher teilte sich „en" die deutsche Bank (echte ä/ö/ü, Zeichen mit
      // unterschiedlichem Griff auf US/UK). Siehe den Dateikopf von
      // `texteCodeEnA.ts` für die Begründung.
      case "code":
        return (await import("./texteCodeEn")).TEXTE;
      default:
        return [];
    }
  }
  if (lernweg === "fr") {
    /*
     * ★★★ M4 (Mechanik-Prüfung fr, 27.09.2026): „Rangée de base + e" und
     * „Premières lettres" haben je Grundreihe eine EIGENE Bank - auf
     * Schweiz-Französisch/Luxemburg (`a … é`) und Kanada (`a … ;`) brauchte
     * die AZERTY-Bank `q m`, die dort erst 17 Sprossen später kommen. Die
     * übrigen Niveaus brauchen alle Buchstaben und teilen sich die Bank.
     * `grundreihe` kommt aus dem PLAN (`SchreibprobePlan.grundreihe`), nicht
     * vom Gerät des Kindes - die ganze Klasse schreibt denselben Text.
     */
    if (grundreihe === "ch" && niveau === "start") return (await import("./texteStartFrCh")).TEXTE;
    if (grundreihe === "ch" && niveau === "gross") return (await import("./texteGrossFrCh")).TEXTE;
    if (grundreihe === "ca" && niveau === "start") return (await import("./texteStartFrCa")).TEXTE;
    if (grundreihe === "ca" && niveau === "gross") return (await import("./texteGrossFrCa")).TEXTE;
    switch (niveau) {
      case "start":
        return (await import("./texteStartFr")).TEXTE;
      case "gross":
        return (await import("./texteGrossFr")).TEXTE;
      case "buchstaben":
        return (await import("./texteBuchstabenFr")).TEXTE;
      case "satz":
        return (await import("./texteSatzFr")).TEXTE;
      case "zahlen":
        return (await import("./texteZahlenFr")).TEXTE;
      case "alles":
        return (await import("./texteAllesFr")).TEXTE;
      // ★ E13b-5 (26.09.2026): eigene französische Bank - französische
      // Bezeichner und Kommentare, nur Zeichen mit Griff auf fr/be/ch-fr.
      case "code":
        return (await import("./texteCodeFr")).TEXTE;
      default:
        return [];
    }
  }
  // ★★★★★ ES-P7a-Behebung (27.09.2026, M7, Prüfbericht Fundament es): Weg
  // „es" fiel bisher OHNE eigene Weiche in den `default`-Zweig unten und
  // bekam damit die DEUTSCHEN Texte - eine spanische Klasse hätte eine
  // Tippchallenge mit „skf döj akla jkslö"/"Die kleinen Enkel ernten"
  // bekommen. NIE einen Rückfall auf eine andere Sprache (Bauplan §2.3
  // Punkt 4).
  // ★★★★★ ES-R0 (27.09.2026): `start`/`gross` bekommen jetzt ebenfalls eine
  // echte Bank - wie „en"/„fr" seit E7a/E13a, siehe die zwei
  // `*-start-es.mts`/`*-gross-es.mts`-Erzeuger und
  // {@link ES_NIVEAUS_GEFUELLT} in `schreibprobe.ts`.
  if (lernweg === "es") {
    switch (niveau) {
      case "start":
        return (await import("./texteStartEs")).TEXTE;
      case "gross":
        return (await import("./texteGrossEs")).TEXTE;
      case "buchstaben":
        return (await import("./texteBuchstabenEs")).TEXTE;
      case "satz":
        return (await import("./texteSatzEs")).TEXTE;
      case "zahlen":
        return (await import("./texteZahlenEs")).TEXTE;
      case "alles":
        return (await import("./texteAllesEs")).TEXTE;
      // ★ ES-Reto-Code (27.09.2026): eigene spanische Bank - spanische
      // Bezeichner und Kommentare, nur Zeichen mit Griff auf es UND latam.
      case "code":
        return (await import("./texteCodeEs")).TEXTE;
      default:
        return [];
    }
  }
  // ★★★★★ IT-RETO (02.10.2026): Weg „it" - wie „es": EIGENE Bank je Niveau, ein Niveau ohne Bank liefert `[]` (nie
  // Englisch, nie Deutsch). `start` und `gross` sind ERZEUGT (`scripts/erzeuge-schreibproben-start-it.mts`/
  // `-gross-it.mts`); die fünf anderen sind GESCHRIEBEN und seit IT-RETO-VERDRAHTEN (03.10.2026) eingehängt - jeder
  // `case` passt zu `IT_NIVEAUS_GEFUELLT` in `schreibprobe.ts` (der Wächter `tests/tastenflow-reto-it-start-gross.test.ts`
  // prüft, dass beide Stellen zusammenpassen).
  if (lernweg === "it") {
    switch (niveau) {
      case "start":
        return (await import("./texteStartIt")).TEXTE;
      case "gross":
        return (await import("./texteGrossIt")).TEXTE;
      // ★ IT-RETO-VERDRAHTEN (03.10.2026): die fünf geschriebenen Bänke (siehe `IT_NIVEAUS_GEFUELLT`).
      case "buchstaben":
        return (await import("./texteBuchstabenIt")).TEXTE;
      case "satz":
        return (await import("./texteSatzIt")).TEXTE;
      case "zahlen":
        return (await import("./texteZahlenIt")).TEXTE;
      case "alles":
        return (await import("./texteAllesIt")).TEXTE;
      // Eigene italienische Bank - italienische Bezeichner und Kommentare, nur Zeichen mit Griff auf it UND it-qzerty.
      case "code":
        return (await import("./texteCodeIt")).TEXTE;
      default:
        return [];
    }
  }
  // ★★★★★ CS-RETO (10.10.2026): Weg „cs" - wie „it": EIGENE Bank je Niveau, ein Niveau ohne Bank liefert `[]` (nie Englisch,
  // nie Deutsch). Jeder `case` wird zusammen mit `CS_NIVEAUS_GEFUELLT` in `schreibprobe.ts` freigeschaltet (Wächter
  // `tests/tastenflow-reto-cs-verdrahtet.test.ts` prüft, dass beide Stellen zusammenpassen).
  if (lernweg === "cs") {
    switch (niveau) {
      // CS-RETO-start: eingehängt (10.10.2026)
      case "start":
        return (await import("./texteStartCs")).TEXTE;
      // CS-RETO-gross: eingehängt (10.10.2026)
      case "gross":
        return (await import("./texteGrossCs")).TEXTE;
      // CS-RETO-buchstaben: eingehängt (10.10.2026)
      case "buchstaben":
        return (await import("./texteBuchstabenCs")).TEXTE;
      // CS-RETO-satz: eingehängt (10.10.2026)
      case "satz":
        return (await import("./texteSatzCs")).TEXTE;
      // CS-RETO-zahlen: eingehängt (10.10.2026)
      case "zahlen":
        return (await import("./texteZahlenCs")).TEXTE;
      // CS-RETO-alles: eingehängt (10.10.2026)
      case "alles":
        return (await import("./texteAllesCs")).TEXTE;
      // CS-RETO-code: eingehängt (10.10.2026)
      case "code":
        return (await import("./texteCodeCs")).TEXTE;
      default:
        return [];
    }
  }
  // ★★★★★ PL-RETO (09.10.2026): Weg „pl" - wie „it": EIGENE Bank je Niveau, ein Niveau ohne Bank liefert `[]` (nie
  // Englisch, nie Deutsch). `start`/`gross` ERZEUGT (`scripts/erzeuge-schreibproben-start-pl.mts`/`-gross-pl.mts`), die
  // fünf anderen GESCHRIEBEN; jeder `case` passt zu `PL_NIVEAUS_GEFUELLT` in `schreibprobe.ts` (Wächter
  // `tests/tastenflow-reto-pl-verdrahtet.test.ts`).
  if (lernweg === "pl") {
    switch (niveau) {
      case "start":
        return (await import("./texteStartPl")).TEXTE;
      case "gross":
        return (await import("./texteGrossPl")).TEXTE;
      case "buchstaben":
        return (await import("./texteBuchstabenPl")).TEXTE;
      case "satz":
        return (await import("./texteSatzPl")).TEXTE;
      case "zahlen":
        return (await import("./texteZahlenPl")).TEXTE;
      case "alles":
        return (await import("./texteAllesPl")).TEXTE;
      // Eigene polnische Bank - polnische Bezeichner und Kommentare, nur Zeichen mit Griff auf `pl`.
      case "code":
        return (await import("./texteCodePl")).TEXTE;
      default:
        return [];
    }
  }
  // ★★★★★ TR-RETO (10.10.2026): Weg „tr" - wie „it": EIGENE Bank je Niveau, ein Niveau ohne Bank liefert `[]` (nie
  // Englisch, nie Deutsch). Jeder `case` wird mit EINER Zeile freigeschaltet, zusammen mit `TR_NIVEAUS_GEFUELLT` in
  // `schreibprobe.ts` (der Wächter `tests/tastenflow-reto-tr-verdrahtet.test.ts` prüft, dass beide Stellen zusammenpassen).
  if (lernweg === "tr") {
    switch (niveau) {
      // TR-RETO: alle sieben Bänke eingehängt (10.10.2026).
      case "start":
        return (await import("./texteStartTr")).TEXTE;
      case "gross":
        return (await import("./texteGrossTr")).TEXTE;
      case "buchstaben":
        return (await import("./texteBuchstabenTr")).TEXTE;
      case "satz":
        return (await import("./texteSatzTr")).TEXTE;
      case "zahlen":
        return (await import("./texteZahlenTr")).TEXTE;
      case "alles":
        return (await import("./texteAllesTr")).TEXTE;
      case "code":
        return (await import("./texteCodeTr")).TEXTE;
      default:
        return [];
    }
  }
  switch (niveau) {
    case "start":
      return (await import("./texteStart")).TEXTE;
    case "gross":
      return (await import("./texteGross")).TEXTE;
    case "buchstaben":
      return (await import("./texteBuchstaben")).TEXTE;
    case "satz":
      return (await import("./texteSatz")).TEXTE;
    case "zahlen":
      return (await import("./texteZahlen")).TEXTE;
    case "alles":
      return (await import("./texteAlles")).TEXTE;
    case "code":
      return (await import("./texteCode")).TEXTE;
    default:
      return [];
  }
}

/**
 * Einen einzelnen Text nachladen. Gibt `null`, wenn es ihn nicht gibt - der
 * Aufrufer zeigt dann eine Meldung, statt eine leere Prüfung zu starten.
 */
export async function ladeText(
  niveau: ProbenNiveau,
  nr: number,
  lernweg: Lernweg = "de",
  grundreihe?: DefiGrundreihe,
): Promise<Probentext | null> {
  const alle = await ladeTexte(niveau, lernweg, grundreihe);
  return alle.find((t) => t.nr === nr) ?? alle[nr] ?? null;
}

/**
 * Die Wörter eines Niveaus, die das Lexikon nicht kennt, das Wörterbuch aber
 * schon - damit sie ganz gesprochen und nicht buchstabiert werden (Johannes
 * 10.09.2026). Erzeugt von `scripts/erzeuge-schreibproben-woerter.mts` (Weg
 * „de") bzw. `scripts/erzeuge-schreibproben-woerter-en.mts` (Weg „en", §5.2
 * Regel 5 - eigenes Lexikon statt macOS-Wörterbuch, siehe dort) bzw.
 * `scripts/erzeuge-schreibproben-woerter-es.mts` (Weg „es", 27.09.2026, wie
 * „de" gegen das Wörterbuch von macOS geprüft).
 *
 * Nachgeladen wie die Texte: Die Liste gehört nur in eine laufende Challenge.
 * Die Grundreihe hat keine - dort sollen Übungssilben buchstabiert werden.
 *
 * ★★★★★ (27.09.2026) Vorher fiel jeder Weg ohne eigenen Zweig hier still auf
 * die DEUTSCHE Liste zurück (`ladeWoerter(niveau, "es")` bekam die Wörter von
 * „de" - eine spanische Klasse hätte deutsche Wörter statt buchstabiert
 * bekommen, siehe `BEFUND-2026-09-27-ES-RETO-CODE.md` §9 Punkt 3). Die
 * Fehlerklasse ist jetzt geschlossen: ein `switch` über ALLE vier Wege von
 * {@link Lernweg}, mit einer `never`-Prüfung im `default` - ein fünfter Weg
 * ohne eigenen Zweig lässt `tsc --noEmit` fehlschlagen, UND wirft zur
 * Laufzeit laut, statt still deutsche Wörter zu liefern (Test:
 * `tests/tastenflow-schreibprobe-woerter-es.test.ts`).
 */
export async function ladeWoerter(
  niveau: ProbenNiveau,
  lernweg: Lernweg = "de",
): Promise<ReadonlySet<string>> {
  // ★ G3c-VERTEILER (25.10.2026): ein Gerüst-Weg mit eigener Bank liest seine eigenen Wörter (keine ⇒ leer, buchstabiert).
  const geruest = geruestBank(lernweg);
  if (geruest) return new Set((await geruest.woerter?.())?.[niveau] ?? []);
  switch (lernweg) {
    case "de": {
      const { WOERTER } = await import("./woerter");
      return new Set(WOERTER[niveau] ?? []);
    }
    case "en": {
      const { WOERTER_EN } = await import("./woerterEn");
      return new Set(WOERTER_EN[niveau] ?? []);
    }
    case "fr": {
      const { WOERTER_FR } = await import("./woerterFr");
      return new Set(WOERTER_FR[niveau] ?? []);
    }
    case "es": {
      const { WOERTER_ES } = await import("./woerterEs");
      return new Set(WOERTER_ES[niveau] ?? []);
    }
    // ★ IT-RETO (02.10.2026): „it" hat eine eigene Liste (`woerterIt.ts`, gegen das macOS-Wörterbuch für Italienisch
    // erzeugt, Vorsilbe `it:`). Sie ist nach Niveau geschlüsselt wie die anderen - ein Niveau, das noch keine Bank
    // (und damit keine Liste) hat, liefert die leere Menge, nie die englische.
    case "it": {
      const { WOERTER_IT } = await import("./woerterIt");
      return new Set(WOERTER_IT[niveau] ?? []);
    }
    // ★ CS-RETO (10.10.2026): „cs" hat eine eigene Liste (`woerterCs.ts`, aus einer BELEGLISTE - das macOS-Wörterbuch nimmt
    // für Tschechisch jedes Wort an). Ein Niveau ohne Bank liefert die leere Menge, nie die englische.
    case "cs": {
      const { WOERTER_CS } = await import("./woerterCs");
      return new Set(WOERTER_CS[niveau] ?? []);
    }
    // ★ PL-RETO (09.10.2026): „pl" hat eine eigene Liste (`woerterPl.ts`) - die Wörter der Wyzwanie-Bänke, die das
    // Vorlese-Lexikon nicht kennt (ohne Wörterbuch-Beleg: das macOS-Wörterbuch nimmt für Polnisch jedes Wort an,
    // Falle 61 - jede Form von Hand belegt, siehe den Kopf der Datei). Nie die englische.
    case "pl": {
      const { WOERTER_PL } = await import("./woerterPl");
      return new Set(WOERTER_PL[niveau] ?? []);
    }
    // ★ TR-RETO (10.10.2026): „tr" hat eine eigene Liste (`woerterTr.ts`, Belege aus Lexikon-Stamm + Endungen oder von Hand;
    // das macOS-Wörterbuch ist für Türkisch nur eine Ablehnung). Kein Weg fällt mehr auf die englische Liste zurück.
    case "tr": {
      const { WOERTER_TR } = await import("./woerterTr");
      return new Set(WOERTER_TR[niveau] ?? []);
    }
    // RÜCKFALL-EN (G2-NEUN): die neun Wege des Gerüsts lesen die englische Bank (`BANK_JE_WEG`) - also auch die
    // englische Liste. Mit der eigenen Bank der Sprache bekommt sie hier ihren eigenen Zweig.
    case "bg":
    case "el":
    case "hu":
    case "nl":
    case "pt":
    case "br":
    case "ro":
    case "sv":
    case "uk": {
      const { WOERTER_EN } = await import("./woerterEn");
      return new Set(WOERTER_EN[niveau] ?? []);
    }
    default: {
      // Erreicht `tsc --noEmit` diese Zeile mit einem neuen Lernweg, meldet
      // er einen Typfehler - die Laufzeit-Prüfung greift, wenn jemand den
      // Typ per `as Lernweg` umgeht (z. B. aus einer URL/Einstellung).
      const nieErreicht: never = lernweg;
      throw new Error(
        `ladeWoerter: kein eigener Zweig für Lernweg "${String(nieErreicht)}" - ` +
          "niemals still auf die deutsche Liste zurückfallen.",
      );
    }
  }
}

/** Zeichen eines Textes (Zeilen plus je ein Leerzeichen als Zeilentrenner). */
export function zeichenZahl(t: Probentext): number {
  if (t.zeilen.length === 0) return 0;
  let n = 0;
  for (const z of t.zeilen) n += z.length;
  return n + (t.zeilen.length - 1);
}
