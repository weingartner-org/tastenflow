/**
 * ★★ DIE TEXTTABELLEN - klein, selbst gebaut, von `tsc` bewacht (12.09.2026).
 *
 * Keine Bibliothek (kein i18next): Die App braucht zwei Sprachen und eine
 * Handvoll Helfer. Eine Tabelle steht NEBEN dem Bauteil, das sie benutzt - wer
 * übersetzt, soll sehen, was der Schalter tut, zu dem der Satz gehört.
 *
 * ★★★ Ein fehlender englischer Schlüssel ist ein ÜBERSETZUNGSFEHLER VON `tsc`,
 * kein leerer Knopf im Browser. `NoInfer` sorgt dafür, dass allein die deutsche
 * Tabelle die Schlüssel festlegt und die englische sich daran messen muss - ohne
 * `NoInfer` dürfte TypeScript den Typ auch aus der englischen ableiten, und der
 * Fehler landete an der falschen Tabelle. Beleg: der `@ts-expect-error` in
 * `tests/bedien-sprache-erkennung.test.ts` (der Build prüft die Tests mit).
 *
 * ★ GANZE SÄTZE MIT PLATZHALTERN, nie deutsche Satzstücke zusammensetzen: Ein
 * Wert darf eine Funktion sein (`neueNachrichten: (n: number) => …`). Wortstellung
 * und Mehrzahl sind in jeder Sprache anders; ein zusammengesetzter Satz lässt
 * sich nicht übersetzen, nur nachbauen.
 */
import { browserSprachen, dezimalzeichen, esZahlGebietAus, type BedienSprache } from "./sprache";
import { englischVariante, wandleUiSchreibweise } from "../typing/schreibweise";
import { ALLE_SPRACHEN, istSprache, sprachBeschreibung } from "../typing/sprachRegister";

/**
 * Ein Eintrag: ein fester Satz, ein Satz mit Platzhaltern - oder eine Tabelle
 * aus Zeilen (die Kurztasten-Liste: Taste und Satz je Zeile).
 */
type Eintrag =
  | string
  | readonly (readonly string[])[]
  | ((...werte: never[]) => string)
  | ((...werte: never[]) => readonly Teil[]);

/**
 * Ein Satz in TEILEN - fester Text und eingesetzte Werte nebeneinander, wie JSX
 * sie schreibt (`Zeile {n} von {gesamt}`).
 *
 * ⚠️ Wozu, wenn es doch ganze Sätze sein sollen: Die Reihenfolge der Teile legt
 * weiterhin jede Sprache selbst fest - es bleibt ein ganzer Satz je Sprache. Aber
 * React macht aus jedem Teil einen eigenen Textknoten, und der Prüfstand
 * (`pruefstand/protokolle/tastenflow-strecke.txt`) liest Textknoten einzeln.
 * Ein zusammengeklebter String hätte das Protokoll der DEUTSCHEN Bedienung
 * verändert - gemessen am 12.09.2026: 41 statt 37 Ansagen. Die deutsche
 * Bedienung bleibt durch die zweite Sprache unverändert, auch an der Zahl der
 * Textknoten.
 */
export type Teil = string | number;

/**
 * ⚠️ Die deutsche Tabelle wird BREIT gemacht: TypeScript leitet aus
 * `(sober) => sober ? "Weiter" : "Super, weiter!"` sonst den Rückgabetyp
 * `"Weiter" | "Super, weiter!"` ab - und jede englische Fassung wäre ein Fehler,
 * weil sie andere Wörter liefert. Verglichen werden Schlüssel, Platzhalter und
 * „liefert Text", nicht der Wortlaut.
 */
type Breit<T> = {
  [K in keyof T]: T[K] extends (...werte: infer A) => string
    ? (...werte: A) => string
    : T[K] extends (...werte: infer A) => readonly Teil[]
      ? (...werte: A) => readonly Teil[]
      : T[K] extends string
        ? string
        : T[K];
};

/**
 * ★★★ E9 (24.09.2026, Bauplan §8.3): DIE US-ÜBERLAGERUNG DER BEDIENUNG - eine
 * dünne Schicht über der fertigen englischen Tabelle, keine dritte Sprache.
 * Ein `Proxy` statt einer zweiten Tabelle: Jede Fassung von `texte()` bekommt
 * die Überlagerung automatisch, ohne dass ein einziger Aufrufer sie kennen
 * muss - genau die „zentrale Stelle", die der Bauplan verlangt.
 *
 * ⚠️ Wird bei JEDEM Zugriff neu geprüft ({@link englischVariante}), nicht
 * einmal beim Laden: Der Schalter für die Schreibweise darf mitten in der
 * Sitzung wirken (anders als der Lernweg, an dem eine Taste hängt - §8.1).
 *
 * Ein Wert, der nicht in {@link WOERTER_UI_GB_ZU_US} vorkommt, bleibt
 * unverändert = fällt auf Britisch zurück, nie auf leer (§8.3).
 */
function angewandterWert(wert: unknown): unknown {
  if (typeof wert === "string") return wandleUiSchreibweise(wert);
  if (typeof wert === "function") {
    return (...args: never[]) => {
      const ergebnis = (wert as (...a: never[]) => unknown)(...args);
      return angewandterWert(ergebnis);
    };
  }
  if (Array.isArray(wert)) {
    return wert.map((eintrag) =>
      Array.isArray(eintrag) || typeof eintrag === "string"
        ? angewandterWert(eintrag)
        : eintrag,
    );
  }
  return wert;
}

function ueberlagereSchreibweise<T extends object>(tabelle: T): T {
  return new Proxy(tabelle, {
    get(ziel, eigenschaft, empfaenger) {
      const wert = Reflect.get(ziel, eigenschaft, empfaenger);
      if (englischVariante() !== "us") return wert;
      return angewandterWert(wert);
    },
  }) as T;
}

/**
 * ★ E2a (25.09.2026, Gerüst französischer Lehrgang): bis E2b blieb diese
 * Funktion BEWUSST auf `{de, en}` - eine dritte Tabelle an allen 26
 * Aufrufstellen ist E11 (Oberfläche neu gedacht), nicht Teil des Gerüsts.
 *
 * ★★★ E2b (25.09.2026, Bauplan Auftrag Punkt 3): `fr` ist jetzt eine
 * OPTIONALE dritte Tabelle. Fehlt sie (heute an ALLEN Aufrufstellen - der
 * Wächter `tests/tastenflow-texte-ohne-fr.test.ts` zählt sie und darf nur
 * SINKEN), fällt `texte(...)["fr"]` auf die englische Tabelle zurück - NIE
 * auf `undefined`. Das macht `erkenneBedienSprache`/den Sprachwähler
 * (E2b Punkt 2/1) gefahrlos: JEDE der 26 bestehenden Aufrufstellen `texte(...)
 * [bedienSprache]` funktioniert unverändert weiter, auch wenn `bedienSprache`
 * jetzt wirklich „fr" sein kann - ohne dass eine einzige der 26 Stellen
 * angefasst werden musste (E11 füllt sie nach und nach mit echtem
 * Französisch, Tabelle für Tabelle).
 *
 * ⚠️ Die `fr`-Fassung bekommt NICHT die GB/US-Überlagerung
 * ({@link ueberlagereSchreibweise}) - die gehört zu Englisch, nicht zu
 * Französisch.
 *
 * ★ ES-F2 (27.09.2026): `es` ist GENAUSO eine optionale vierte Tabelle - fehlt
 * sie (heute an ALLEN Aufrufstellen), fällt `texte(...)["es"]` auf die
 * englische Tabelle zurück, NIE auf `undefined` und NIE auf Deutsch (Falle
 * 12/19). Das ist der EINE Grund, warum die rund 90 Aufrufstellen von
 * `texte(...)` selbst gar keinen eigenen `es`-Wert brauchten, um mit diesem
 * Gerüst zu kompilieren.
 */
export function texte<T extends Record<string, Eintrag>>(tabelle: {
  de: T;
  en: NoInfer<Breit<T>>;
  fr?: NoInfer<Breit<T>>;
  es?: NoInfer<Breit<T>>;
  it?: NoInfer<Breit<T>>;
  pl?: NoInfer<Breit<T>>;
  tr?: NoInfer<Breit<T>>;
  cs?: NoInfer<Breit<T>>;
  // ★ G2-NEUN (25.10.2026): die neun Sprachen des Gerüsts - ebenso optional; ohne eigene Tabelle die ROHE englische.
  bg?: NoInfer<Breit<T>>;
  el?: NoInfer<Breit<T>>;
  hu?: NoInfer<Breit<T>>;
  nl?: NoInfer<Breit<T>>;
  pt?: NoInfer<Breit<T>>;
  br?: NoInfer<Breit<T>>;
  ro?: NoInfer<Breit<T>>;
  sv?: NoInfer<Breit<T>>;
  uk?: NoInfer<Breit<T>>;
}): Readonly<Record<BedienSprache, Breit<T>>> {
  // ★ G2a (02.10.2026, G1c §3 Nr. 1): die Rückgabe wird aus der Liste ALLER
  // Sprachen gebaut ({@link ALLE_SPRACHEN}, Sprachregister), NICHT mehr aus
  // vier festen Schlüsseln mit einem `as`-Cast. Vorher hätte jede neue Sprache
  // `undefined` geliefert, und jede der ~118 Tabellen wäre beim ersten
  // Feldzugriff abgestürzt, ohne dass `tsc` etwas sagte. Jede Sprache ohne
  // eigene Tabelle fällt auf `en` (die ROHE englische Tabelle, ohne US-
  // Überlagerung - wie `fr`/`es` seit E2b) - nie auf `undefined`, nie auf Deutsch.
  const eigene = tabelle as unknown as Partial<Record<BedienSprache, Breit<T>>>;
  const aus: Partial<Record<BedienSprache, Breit<T>>> = {};
  for (const sprache of ALLE_SPRACHEN) {
    if (sprache === "de") {
      // ⚠️ `as`: `T` erfüllt `Breit<T>` strukturell zur Laufzeit (dieselbe
      // Tabelle, nur breiter GETIPPT), aber TypeScript kann die bedingte
      // Abbildung von `Breit<T>` nicht ausrechnen - derselbe Cast stand schon
      // vor E2b hier.
      aus.de = tabelle.de as unknown as Breit<T>;
    } else if (sprache === "en") {
      aus.en = ueberlagereSchreibweise(tabelle.en);
    } else {
      aus[sprache] = eigene[sprache] ?? tabelle.en;
    }
  }
  return aus as Record<BedienSprache, Breit<T>>;
}

/**
 * Die Region hinter jeder Sprache: österreichisches Deutsch, britisches
 * Englisch. „fr" (E2a): Frankreich als Platzhalter - TODO FR: E10 misst
 * gegen die vier Landesvarianten nach (Bauplan §10).
 *
 * ★ ES-F2 (27.09.2026): „es" analog - Spanien als Grundform (wie
 * `SPRACH_TAG.es` in `lib/typing/vorlesen.ts`), „es-419"/Lateinamerika kommt
 * erst mit ES-F6/F7.
 */
export const GEBIET: Record<BedienSprache, string> = {
  de: "de-AT",
  en: "en-GB",
  fr: "fr-FR",
  es: "es-ES",
  // G2a (02.10.2026): echte Gebiete (Sprachregister `locale`), kein Rückfall.
  it: "it-IT",
  pl: "pl-PL",
  tr: "tr-TR",
  cs: "cs-CZ",
  // ★ G2-NEUN (25.10.2026): echte Gebiete (Sprachregister `locale`), kein Rückfall.
  bg: "bg-BG",
  el: "el-GR",
  hu: "hu-HU",
  nl: "nl-NL",
  pt: "pt-PT",
  br: "pt-BR",
  ro: "ro-RO",
  sv: "sv-SE",
  uk: "uk-UA",
};

/**
 * ★ D1 (28.09.2026, Entscheidung Johannes Nr. 15): das Gebiet, nach dem eine
 * ZAHL geschrieben wird. Für Spanisch aus dem Land der Browsersprache
 * (`esZahlGebietAus`, sprache.ts - Mexiko „12.5", Argentinien „12,5", ohne
 * Land das Komma), für alle anderen Sprachen {@link GEBIET} wie bisher.
 * Dieselbe Regel gilt für erzeugte Übungszeilen (`wandleFormatoNumerico`,
 * esVariante.ts) - Oberfläche und Text schreiben eine Zahl gleich.
 */
export function zahlGebiet(sprache: BedienSprache): string {
  return sprache === "es" ? esZahlGebietAus(browserSprachen()) : GEBIET[sprache];
}

/** Das Dezimalzeichen der Sprache (Spanisch: nach dem Land, siehe {@link zahlGebiet}). */
export function dezimal(sprache: BedienSprache): "," | "." {
  return dezimalzeichen(zahlGebiet(sprache));
}

/**
 * ★ F8-it (02.10.2026, Glossar Italienisch §4 Nr. 9, §1 Nr. 5): Sprachen, die auch VIERSTELLIGE Zahlen mit dem Tausenderpunkt
 * schreiben (`1.234`). `Intl` „it-IT" schreibt sie nach der CLDR-Regel „mindestens zwei Gruppen" OHNE (`1234`, gemessen mit Node
 * am 02.10.) - dann stünden `1234` und `12.345` auf derselben Seite. Vorgabe des Glossars: `1.234`. Nur Italienisch; Spanisch
 * schreibt vierstellige Zahlen nach der RAE ohne Punkt und bleibt, wie es ist (`zahl(1234, "es")` ⇒ `1234`).
 */
const GRUPPIERUNG_IMMER: ReadonlySet<BedienSprache> = new Set<BedienSprache>(["it"]);

/** Eine Zahl in der Schreibweise der Sprache. */
export function zahl(n: number, sprache: BedienSprache): string {
  return new Intl.NumberFormat(
    zahlGebiet(sprache),
    // `true` = „always" (ECMA-402 NumberFormat v3, gemessen: Node 26 ⇒ `1.234`); ohne Option gilt „auto" (`1234`).
    GRUPPIERUNG_IMMER.has(sprache) ? { useGrouping: true } : undefined,
  ).format(n);
}

/**
 * Die Formen einer Mehrzahl-Zeichenkette. `one` und `other` braucht jeder Aufrufer (wie bisher);
 * `zero`, `two`, `few`, `many` sind frei und gelten nur für Sprachen, die diese Kategorie KENNEN
 * (CLDR, `Intl.PluralRules`, gemessen): Polnisch `one` (1) · `few` (2-4, 22-24 …) · `many`
 * (0, 5-21, 25-31 …) · `other` (Bruchzahlen); Tschechisch `one` (1) · `few` (2-4) · `many`
 * (Bruchzahlen) · `other` (0, 5 und mehr); Türkisch und Deutsch `one` (1) · `other`;
 * Italienisch, Französisch, Spanisch `one` · `many` (nur ab einer Million) · `other`.
 * Eine Kategorie ohne eigene Form fällt auf `other`.
 */
export interface MehrzahlFormen {
  zero?: (z: string) => string;
  one: (z: string) => string;
  two?: (z: string) => string;
  few?: (z: string) => string;
  many?: (z: string) => string;
  other: (z: string) => string;
}

/**
 * Einzahl oder Mehrzahl - über `Intl.PluralRules`, nicht über `n === 1`.
 * Für Deutsch und Englisch kommt dasselbe heraus; die Regel gehört trotzdem der
 * Sprache und nicht dem Aufrufer, sonst schreibt die nächste Sprache sie falsch.
 *
 * Die Formen bekommen die fertig geschriebene Zahl (`zahl`).
 *
 * ★ G2b-2 (02.10.2026): auch `few` und `many` (siehe {@link MehrzahlFormen}) - Polnisch
 * und Tschechisch schreiben „1 sekunda · 2 sekundy · 5 sekund" (pl), „1 sekunda · 2 sekundy ·
 * 5 sekund" (cs). Jeder bisherige Aufruf (`{ one, other }`) bleibt gültig und liefert für de,
 * en, fr, es dasselbe wie vorher: deren `many` (nur ab einer Million) und `zero` gibt es dort
 * ohne eigene Form nicht, die Kategorie fällt auf `other` - wie zuvor.
 */
export function mehrzahl(n: number, sprache: BedienSprache, formen: MehrzahlFormen): string {
  // ★ O-TR (02.10.2026): eine Sprache mit `einzahlNachZahl` (Türkisch: „5 hata",
  // nie „5 hatalar") nimmt nach JEDER Zahl die Form `one` - eine Eigenschaft
  // des Sprachregisters, keine Weiche auf eine Kennung. Alle anderen Sprachen
  // rechnen wie bisher.
  if (istSprache(sprache) && sprachBeschreibung(sprache).einzahlNachZahl) return formen.one(zahl(n, sprache));
  const regel = new Intl.PluralRules(GEBIET[sprache]).select(n);
  const form = Object.hasOwn(formen, regel) ? formen[regel] : undefined;
  return (form ?? formen.other)(zahl(n, sprache));
}
