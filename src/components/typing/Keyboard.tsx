/**
 * Bildschirm-Tastatur als visuelle Lern-Hilfe: zeigt die Finger-Tasten-Zuordnung
 * über Farben und hebt die NÄCHSTE zu drückende Taste stark hervor (Rahmen +
 * Füllung über Theme-Variablen, also auch im reinen Schwarz-Weiß-Kontrast
 * erkennbar). F und J tragen die Tasthöcker-Markierung (türkisch F: a und k, `KeyboardLayout.heimtasten`).
 *
 * WELCHE Tastatur gezeichnet wird, entscheidet das eingestellte Layout
 * (src/lib/typing/layouts.ts): deutsch/österreichisch, Schweizer, amerikanische
 * oder britische Tastatur. Reihen, Zusatztasten und Breiten kommen von dort —
 * hier steht keine zweite Tastenliste.
 *
 * Seit 12.09.2026 kann sie außerdem die Taste markieren, die GERADE GEDRÜCKT
 * wurde (`gedrueckt`, für „Tasten erkunden" - Wunsch Johannes). Siehe
 * `stelleFuer` unten.
 *
 * Seit 25.09.2026 kann sie zusätzlich die VOLLE Tastatur zeichnen: Ziffernblock
 * rechts, dazwischen (wenn Platz ist) der Pfeil-/Sprungtasten-Block. Ob das
 * sein soll, steht in `useGrosseTastatur` (`lib/typing/grosseTastatur.ts`) -
 * ein eigener, kleiner Zustand nach dem Muster von `useTypingA11y`, den DIESE
 * Komponente selbst liest. Keine Seite reicht dafür eine Eigenschaft durch;
 * `KeyboardPanel.tsx` darf die Anzeige nur per `ohneZiffernblock` UNTERDRÜCKEN,
 * wenn der Ziffernblock nicht mehr in die verfügbare Breite passt (siehe dort).
 * Der Ziffernblock markiert seine eigenen Tasten unabhängig von `stelleFuer` -
 * er ist nie die „nächste" Taste, der Lehrgang lehrt die Zahlenreihe.
 *
 * Rein dekorativ/visuell (aria-hidden): blinde Nutzer:innen erhalten den
 * Aufgabentext + Sprach-/Live-Feedback, nicht diese Grafik.
 */
import { baseKeyForChar, FINGERS, fingerForChar, needsAltGr, shiftHandFor } from "@/lib/typing/fingers";
import { useGrosseTastatur } from "@/lib/typing/grosseTastatur";
import { bottomLabelsFuer, FRANZOESISCHE_LAYOUT_IDS, ITALIENISCHE_EIGENE_LAYOUT_IDS, layoutSprache, TSCHECHISCHE_LAYOUT_IDS, zugangFuer, ziffernNurMitUmschalt } from "@/lib/typing/layouts";
import { grossbuchstabeWeg, kombizeichenZu } from "@/lib/typing/totasten";
import { grossFuer } from "@/lib/typing/sprachRegister";
import type { EdgeKey, KeyboardLayout } from "@/lib/typing/layouts";
import { useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";
import { stelleFuerCode } from "@/lib/typing/anschlagDeuten";

/**
 * ★ Die Beschriftung der Leertaste (EN1, 19.09.2026) - die einzige Kappe, auf
 * der ein ERKLÄRENDES Wort steht (auf der echten Taste steht keins).
 * Glossar §3.5: *space bar*, klein wie in britischen Tastschreib-Kursen.
 * ★ E11a-5 (26.09.2026): „espace" - Glossar Französisch §9.2, klein wie die
 * beiden anderen. Ohne aktiven Sprachbereich (»Im Griff«) bleibt es „de".
 */
const LEERTASTE: Record<BedienSprache, string> = {
  de: "Leertaste",
  en: "space bar",
  fr: "espace",
  es: "barra espaciadora",
  it: "barra spaziatrice",
  pl: "spacja", // ★ O-PL (02.10.2026): die einzige polnische Kappe (Glossar §2.9), klein wie die anderen.
  tr: "boşluk çubuğu", // ★ O-TR (02.10.2026): Glossar §2.9, klein wie die anderen.
  cs: "mezerník", // ★ O-CS (03.10.2026): Glossar §2.9 (die Taste, nicht „mezera" = das Zeichen), klein wie die anderen.
  // ★ O2-COMP (30.10.2026): die neun Sprachen mit eigener Fassung.
  bg: "интервал",
  el: "πλήκτρο διαστήματος",
  hu: "szóköz",
  nl: "spatiebalk",
  pt: "barra de espaço",
  br: "barra de espaço",
  ro: "bara de spațiu",
  sv: "Mellanslag",
  uk: "пробіл",
};

/** Das zuletzt gedrückte KeyboardEvent - nur die zwei Felder, die hier zählen. */
export interface GedrueckteTaste {
  /** Die PHYSISCHE Taste (`KeyboardEvent.code`) - danach wird markiert. */
  code: string;
  /** Das erzeugte Zeichen (`KeyboardEvent.key`) - nur Ersatz, wenn `code` fehlt. */
  key: string;
}

// --- Welche gezeichnete Taste gehört zu welchem `code`? ----------------------
// ★ Markiert wird über `code`, NIE über `key`: Am Mac ergibt Option + L ein „@",
// gedrückt ist aber L; auf QWERTZ heißt die Taste mit dem Aufdruck „Z" `KeyY`,
// weil `code` die Stelle auf einer US-Tastatur benennt. `key` sagt, was
// herauskam - die Tastatur soll zeigen, WO der Finger war.
//
// ★ W1 (27.09.2026): Die Tabelle `code` → Reihe/Spalte steht seither in
// `lib/typing/anschlagDeuten.ts` (`REIHEN_CODES`) - die Übungszeile braucht
// sie auch, um eine Totaste zu benennen und eine leere AltGr-Ebene zu
// erkennen. EINE Tabelle, nicht zwei; hier unverändert benutzt.
// ⚠️ UNGEMESSEN: Chrome/Safari am Mac mit ISO-Tastatur sollen `Backquote` und
// `IntlBackslash` vertauscht melden (Taste „^" gegen „<"). Nicht nachgebaut,
// solange es niemand an einem echten Gerät gesehen hat.

/**
 * Leertastenreihe von links nach rechts: Strg · Alt · (Leertaste) · AltGr · Strg.
 * Die Befehlstaste am Mac (`Meta`) sitzt dort, wo auf der gezeichneten
 * Tastatur Alt bzw. AltGr steht - neben der Leertaste.
 */
const UNTEN_CODES: Readonly<Record<string, 0 | 1 | 2 | 3>> = {
  ControlLeft: 0,
  AltLeft: 1,
  MetaLeft: 1,
  AltRight: 2,
  MetaRight: 2,
  ControlRight: 3,
};

type Stelle =
  | { art: "zeichen"; reihe: number; spalte: number }
  | { art: "rand"; code: string }
  | { art: "unten"; nr: 0 | 1 | 2 | 3 }
  | { art: "leertaste" };

/**
 * Wo auf der gezeichneten Tastatur liegt die gedrückte Taste? `null` heißt:
 * Diese Taste hat die Zeichnung nicht (F-Tasten, Pfeile, Entf, Pos1, Ziffernblock
 * außer Enter …) - dann wird nichts markiert, und das ist kein Fehler.
 */
function stelleFuer(layout: KeyboardLayout, g: GedrueckteTaste): Stelle | null {
  const { code } = g;
  if (code && code !== "Unidentified") {
    if (code === "Space") return { art: "leertaste" };
    const nr = UNTEN_CODES[code];
    if (nr !== undefined) return { art: "unten", nr };
    // ★ G4-NAHT (25.10.2026): dieselbe Rechnung wie die Übungszeile (`stelleFuerCode`) - seither auch die Zusatztaste
    // `IntlRo` (brasilianisch ABNT2). Für jede bisherige Tastatur Zeichen für Zeichen die Schleife von vorher.
    const s = stelleFuerCode(layout, code);
    if (s) return { art: "zeichen", reihe: s.reihe, spalte: s.spalte };
    // Randtasten tragen ihren `code` selbst (layouts.ts). Der Enter des
    // Ziffernblocks ist für ein Kind dieselbe Taste wie der große Enter.
    // Ein unbekannter Code (Pfeil, F-Taste) trifft hier keine Randtaste.
    return { art: "rand", code: code === "NumpadEnter" ? "Enter" : code };
  }

  // Ohne `code` (manche Bildschirm- und Hilfstastaturen melden ihn leer) bleibt
  // nur das erzeugte Zeichen. Umschalt/Strg/Alt lassen sich daraus nicht einer
  // SEITE zuordnen - die bleiben dann unmarkiert, statt geraten zu werden.
  const { key } = g;
  if (key === " ") return { art: "leertaste" };
  if (key === "Enter" || key === "Tab" || key === "Backspace" || key === "CapsLock") {
    return { art: "rand", code: key };
  }
  if ([...key].length !== 1) return null;
  const basis = baseKeyForChar(key);
  for (let r = 0; r < layout.rows.length; r++) {
    const spalte = layout.rows[r].keys.indexOf(basis);
    if (spalte >= 0) return { art: "zeichen", reihe: r, spalte };
  }
  return null;
}

/**
 * ★ Wie „gedrückt" aussieht - und warum so.
 * Die NÄCHSTE Taste trägt einen dicken Rahmen in ihrer Fingerfarbe (bzw. im
 * Akzent). Die GEDRÜCKTE trägt denselben dicken Rahmen in der TEXTFARBE
 * (`--c-ink`, dunkel im hellen Design, hell im dunklen) - so bleibt die
 * Fingerfarbe der Taste als Füllung erhalten (das Kind sieht auch, welcher
 * Finger zuständig ist), und beides lässt sich nebeneinander unterscheiden.
 *
 * Im Windows-Kontrastmodus tragen beide die Klasse `tt-taste-ziel`: Dort wird
 * jede Farbe erzwungen, `ring-*` (ein box-shadow) verschwindet, und nur
 * `tt-taste-ziel` setzt in `src/index.css` einen dicken `Highlight`-Rahmen mit
 * `!important` - der schlägt auch den Inline-Rahmen der Fingerfarben. Der
 * Rahmen sitzt an der TASTE, nicht eng am Zeichen, also stanzt die Backplate
 * hinter dem Text ihn nicht heraus (UEBERGABE-2026-09-09-ABEND §2); der
 * Prüfstand `npm run pruefstand:kontrast` misst genau diese Klasse.
 * ⇒ Dort sehen „nächste" und „gedrückt" GLEICH aus. Das ist hingenommen, weil
 * sie in „Tasten erkunden" nie zusammen vorkommen (dort gibt es keine nächste
 * Taste). Unterscheiden lassen sie sich dort nur am Attribut
 * `data-gedrueckt="an"` - dem Griff für Tests. Fällt beides auf dieselbe
 * Taste, gewinnt „gedrückt".
 */
const TINTE = "rgb(var(--c-ink))";

export function Keyboard({
  layout,
  nextChar,
  unlocked,
  showFingerColors,
  gedrueckt,
  ohneZiffernblock,
  vollstaendig,
  totasteOffen,
}: {
  /** Das zu zeichnende Tastatur-Layout (kommt aus der Einstellung). */
  layout: KeyboardLayout;
  nextChar?: string;
  unlocked: Set<string>;
  showFingerColors: boolean;
  /** Die zuletzt gedrückte Taste - wird markiert (Tasten erkunden). */
  gedrueckt?: GedrueckteTaste;
  /**
   * ★ Nur für `KeyboardPanel.tsx`: Der Ziffernblock passt bei dieser
   * Fensterbreite nicht mehr daneben - dann lieber unterdrücken als
   * horizontal aufreissen (siehe Dateikopf). Die EINSTELLUNG selbst
   * (`useGrosseTastatur`) bleibt davon unberührt; nur DIESE Zeichnung
   * verzichtet auf den Ziffernblock.
   */
  ohneZiffernblock?: boolean;
  /**
   * ★ Testerin 24.10.2026 (nur „Tasten erkunden"): „In der Darstellung fehlen die
   * Win-Taste(n), die ganze Reihe F-Tasten und Kontext … so entsteht der
   * Eindruck, man könne nur die dargestellten testen." Dann kommen Esc und die
   * F-Reihe obendrüber, unter Windows auch Win und die Menü-Taste in die
   * Leertastenreihe. Das Üben zeigt weiter die schlanke Tastatur.
   */
  vollstaendig?: "windows" | "mac";
  /**
   * ★ 05.11.2026 (Meldung w0tt7egy6eqnr4x): die Totaste des nächsten
   * Zwei-Schritt-Zeichens ist schon gedrückt - jetzt leuchtet der zweite
   * Schritt (der Buchstabe, mit Umschalt der Gegenhand).
   */
  totasteOffen?: boolean;
}) {
  // Hervorgehoben wird die physische Grund-Taste — auch bei Sonderzeichen, die
  // über Umschalt/AltGr/Totaste erreicht werden (z. B. „{" → Taste 7).
  // ★ F3-cs (02.10.2026, Falle 15): auf den tschechischen Tastaturen liegt die Grundtaste vieler Grossbuchstaben (Č Š Ř Ž Ě Ý Á Í É Ú)
  // in der Zahlenreihe bzw. auf ú - dort gibt Umschalt aber die ZIFFER (Umschalt + č = 4). „Č" über die Taste „4č" mit Umschalt
  // zu zeigen, schickte das Kind auf die falsche Taste. Ist das nächste Zeichen ein Zwei-Schritt-Zeichen (Č ď ó ...),
  // leuchtet darum der ERSTE Schritt: die Totaste (Háček: Umschalt + letzte Taste der Zahlenreihe, Čárka: dieselbe Taste ohne
  // Umschalt). Der zweite Schritt (der Buchstabe) steht in der Ansage; ihn nach dem Anschlag der Totaste zu zeigen, braucht
  // einen Zustand, den die Zeichnung nicht hat (wie bei fr und es, Befund F3-cs). Alle anderen Tastaturen: unverändert.
  // ★★ G3b (25.10.2026, Falle 50): an der Eigenschaft der Tastatur (`zweiSchrittZeigen`: cs, cs-qwerty und die neuen
  // Tastaturen mit Lehrgangs-Totasten), nicht mehr an `TSCHECHISCHE_LAYOUT_IDS`.
  // ★★ 05.11.2026 (Meldung w0tt7egy6eqnr4x, /fr AZERTY): „A avec accent grave ne fonctionne pas". Für „À" leuchtete die
  // Taste 0/à - dort gibt Umschalt aber „0", nicht „À". Die Anleitung sagte richtig „accent grave (AltGr + 7), puis
  // majuscule a". Darum gilt die Zwei-Schritt-Zeichnung jetzt für jeden GROSSBUCHSTABEN über eine Totaste, auf jeder
  // Tastatur (À È Ù Ê Î Ô Û Ë Ï, Schweiz Ä Ö Ü): seine Kleinbuchstaben-Taste gibt mit Umschalt etwas anderes. Kleine
  // Zwei-Schritt-Zeichen (ê) bleiben ausserhalb von cs wie vorher (Wächter `tastenflow-tastaturen-cs-anzeige`, Gegenprobe).
  // Ist die Totaste gedrückt
  // (`totasteOffen`), leuchtet der zweite Schritt: der Buchstabe mit Umschalt der Gegenhand.
  const kombiNaechste =
    nextChar &&
    (layout.zweiSchrittZeigen === true || grossbuchstabeWeg(nextChar, layout) === "totaste")
      ? kombizeichenZu(nextChar, layout)
      : undefined;
  const ersterSchritt = kombiNaechste && !totasteOffen ? kombiNaechste : undefined;
  const zweiterSchritt = kombiNaechste && totasteOffen ? kombiNaechste.dann : undefined;
  const totasteMod = ersterSchritt ? zugangFuer(layout, ersterSchritt.tot)?.mod : undefined;
  const totasteHand = ersterSchritt ? fingerForChar(ersterSchritt.tot)?.hand : undefined;
  const target = ersterSchritt
    ? baseKeyForChar(ersterSchritt.tot)
    : zweiterSchritt
      ? baseKeyForChar(zweiterSchritt)
      : nextChar
        ? baseKeyForChar(nextChar)
        : "";
  const shiftSide = ersterSchritt
    ? totasteMod === "shift" && totasteHand
      ? totasteHand === "links"
        ? "rechts"
        : "links"
      : null
    : zweiterSchritt
      ? shiftHandFor(zweiterSchritt)
      : nextChar
        ? shiftHandFor(nextChar)
        : null;
  const altGrNext = ersterSchritt
    ? totasteMod === "altgr"
    : zweiterSchritt
      ? needsAltGr(zweiterSchritt)
      : nextChar
        ? needsAltGr(nextChar)
        : false;
  const spaceNext = nextChar === " ";
  /*
    ★ EN1: Die übrigen Kappen zeigen, was AUF der Taste steht - auf einer
    deutschen Tastatur also „Strg", auch in englischer Bedienung (wer mit
    deutscher Tastatur übt, sucht genau dieses Wort). In englischer Bedienung
    trägt diese Kappe darum `lang="de"`, damit sie als deutsche Aufschrift gilt.
  */
  const { sprache } = useBedienSprache();
  const deutscheKappe = (label: string) =>
    sprache !== "de" && label === "Strg" ? "de" : undefined;
  // ★ F3-pl: die Leertastenreihe je Plattform (Alt unter Windows, Option am Mac); alle bisherigen Tastaturen unverändert.
  const untenLabels = bottomLabelsFuer(layout);
  // ★ F3-tr: die zwei Tasten mit den Tastmarken (Stelle 4 und 5 der Heimtasten); ohne eigene Liste F und J.
  const tastmarken: readonly [string, string] = layout.heimtasten
    ? [layout.heimtasten[3], layout.heimtasten[4]]
    : ["f", "j"];
  const stelle = gedrueckt ? stelleFuer(layout, gedrueckt) : null;
  const spaceGedrueckt = stelle?.art === "leertaste";
  // ★ Testerin 24.10.2026: Mit eigenen Win-Tasten markiert die Windows-Taste NUR
  // sich selbst - ohne sie (Üben, Mac) sitzt `Meta` weiter auf Alt/AltGr.
  const mitWin = vollstaendig === "windows";
  const untenGedrueckt = (nr: 0 | 1 | 2 | 3) =>
    stelle?.art === "unten" && stelle.nr === nr && !(mitWin && gedrueckt?.code.startsWith("Meta"))
      ? ("an" as const)
      : undefined;
  const codeGedrueckt = (code: string) => (gedrueckt?.code === code ? ("an" as const) : undefined);

  // ★ Ziffernblock + Pfeil-/Sprungtasten-Block (25.09.2026, siehe Dateikopf).
  const grosseTastaturEinstellung = useGrosseTastatur((s) => s.aktiv);
  const zeigeVoll = grosseTastaturEinstellung && !ohneZiffernblock;
  // Deutsche/Schweizer Ziffernblöcke tragen ein Komma als Dezimaltrenner,
  // englische einen Punkt - wie auf der jeweiligen echten Tastatur. ★ E3
  // (25.09.2026): Frankreich/Belgien/Schweiz-Französisch schreiben Dezimalzahlen
  // ebenfalls mit Komma (wie Deutsch); Kanada bleibt beim nordamerikanischen
  // Punkt (Bauplan nennt keine Abweichung - dieselbe Hardware-Konvention wie US).
  // ★ F3-it (02.10.2026): Italien schreibt Dezimalzahlen mit Komma (R1 §1.5) - der Ziffernblock der
  // italienischen Tastaturen trägt wie der deutsche ein Komma.
  // ★ F3-tr (02.10.2026): auch die Türkei schreibt Dezimalzahlen mit Komma (TDK, R1 §1.8) - der Ziffernblock
  // der türkischen Tastaturen trägt ein Komma.
  // ★ F3-cs (02.10.2026): auch Tschechien schreibt Dezimalzahlen mit Komma (IJP, R1 §1.4) - der Ziffernblock der
  // tschechischen Tastaturen trägt ein Komma.
  const KOMMA_LAYOUTS = new Set(["de", "ch", "fr", "be", "ch-fr", "it", "it-qzerty", "tr-q", "tr-f", "cs", "cs-qwerty"]);
  // ★★ G3b (25.10.2026): die neuen Tastaturen tragen es als Eigenschaft (`ziffernblockKomma`); die Liste bleibt für die bisherigen.
  const ziffernblockKomma = KOMMA_LAYOUTS.has(layout.id) || layout.ziffernblockKomma === true ? "," : ".";
  /**
   * Eine Taste des Ziffernblocks oder des Pfeil-/Sprungtasten-Blocks.
   * MARKIERT SICH SELBST über den rohen `code` - unabhängig von `stelleFuer`
   * (die Tabelle dort kennt diese Tasten bewusst nicht, siehe deren
   * Dateikopf). Nie die „nächste" Taste: Der Lehrgang lehrt die Zahlenreihe,
   * nicht den Ziffernblock.
   */
  const ExtraKey = ({
    label,
    code,
    fs = "0.6em",
    rowSpan,
    colSpan,
    gridRow,
    gridColumn,
  }: {
    label: string;
    code: string;
    fs?: string;
    rowSpan?: number;
    colSpan?: number;
    gridRow?: number;
    gridColumn?: number;
  }) => {
    const istGedrueckt = gedrueckt?.code === code;
    return (
      <div
        data-gedrueckt={istGedrueckt ? "an" : undefined}
        className={
          "relative grid place-items-center rounded-[0.35em] border font-semibold " +
          (istGedrueckt
            ? "tt-taste-ziel border-ink ring-2 ring-ink text-ink"
            : "border-hairline bg-surface-sunken text-ink-muted")
        }
        style={{
          gridRow: gridRow ?? (rowSpan ? `span ${rowSpan}` : undefined),
          gridColumn: gridColumn ?? (colSpan ? `span ${colSpan}` : undefined),
          background: istGedrueckt ? "rgb(var(--c-accent-soft))" : undefined,
        }}
      >
        <span style={{ fontSize: fs }}>{label}</span>
        {/* ★ Testerin 24.10.2026: die 5 im Ziffernblock trägt wie F und J eine Tastmarke. */}
        {code === "Numpad5" && (
          <span
            aria-hidden
            data-tastmarke="an"
            className="absolute bottom-[0.28em] h-[0.12em] w-[0.7em] rounded-full bg-current opacity-70"
          />
        )}
      </div>
    );
  };
  // 4 Spalten × 5 Zeilen, dieselbe Zeilenhöhe (2.1em) und derselbe Abstand
  // (0.3em) wie die vier Tastenreihen + Leertastenreihe links - der
  // Ziffernblock fluchtet dadurch OHNE weitere Rechnung mit dem Hauptblock.
  // Auto-Platzierung (Zeile für Zeile) reicht: „+" und die Eingabetaste
  // spannen je zwei Zeilen, „0" zwei Spalten - genau wie auf der echten Taste.
  const numpadBlock = (
    <div
      data-ziffernblock="an"
      className="grid gap-[0.3em]"
      style={{ gridTemplateColumns: "repeat(4, 2.1em)", gridTemplateRows: "repeat(5, 2.1em)" }}
    >
      <ExtraKey label="Num" code="NumLock" fs="0.5em" />
      <ExtraKey label="/" code="NumpadDivide" />
      <ExtraKey label="*" code="NumpadMultiply" />
      <ExtraKey label="-" code="NumpadSubtract" />
      <ExtraKey label="7" code="Numpad7" />
      <ExtraKey label="8" code="Numpad8" />
      <ExtraKey label="9" code="Numpad9" />
      <ExtraKey label="+" code="NumpadAdd" rowSpan={2} />
      <ExtraKey label="4" code="Numpad4" />
      <ExtraKey label="5" code="Numpad5" />
      <ExtraKey label="6" code="Numpad6" />
      <ExtraKey label="1" code="Numpad1" />
      <ExtraKey label="2" code="Numpad2" />
      <ExtraKey label="3" code="Numpad3" />
      <ExtraKey label="↵" code="NumpadEnter" fs="0.7em" rowSpan={2} />
      <ExtraKey label="0" code="Numpad0" colSpan={2} />
      <ExtraKey label={ziffernblockKomma} code="NumpadDecimal" />
    </div>
  );
  // 3 Spalten × 5 Zeilen, dieselben Zeilenhöhen wie links - Einfg/Pos1/Bild↑
  // auf Höhe der Zahlenreihe, Entf/Ende/Bild↓ auf Höhe der oberen Reihe, die
  // Pfeile ganz unten auf Höhe der Leertastenreihe (wie auf der echten
  // Tastatur eine Lücke dazwischen).
  const navBlock = (
    <div
      data-navblock="an"
      className="grid gap-[0.3em]"
      style={{ gridTemplateColumns: "repeat(3, 2.1em)", gridTemplateRows: "repeat(5, 2.1em)" }}
    >
      <ExtraKey label="Einfg" code="Insert" fs="0.5em" gridRow={1} gridColumn={1} />
      <ExtraKey label="Pos1" code="Home" fs="0.5em" gridRow={1} gridColumn={2} />
      <ExtraKey label="Bild↑" code="PageUp" fs="0.5em" gridRow={1} gridColumn={3} />
      <ExtraKey label="Entf" code="Delete" fs="0.5em" gridRow={2} gridColumn={1} />
      <ExtraKey label="Ende" code="End" fs="0.5em" gridRow={2} gridColumn={2} />
      <ExtraKey label="Bild↓" code="PageDown" fs="0.5em" gridRow={2} gridColumn={3} />
      <ExtraKey label="↑" code="ArrowUp" fs="0.8em" gridRow={4} gridColumn={2} />
      <ExtraKey label="←" code="ArrowLeft" fs="0.8em" gridRow={5} gridColumn={1} />
      <ExtraKey label="↓" code="ArrowDown" fs="0.8em" gridRow={5} gridColumn={2} />
      <ExtraKey label="→" code="ArrowRight" fs="0.8em" gridRow={5} gridColumn={3} />
    </div>
  );

  // AUSNAHME (E7, §2.7): Jede Taste steht in `text-[1em]`, alle Masse in `em`.
  // Das ist KEINE feste Schriftgrösse - die Bildschirmtastatur misst sich
  // selbst (`KeyboardPanel.tsx` rechnet aus der verfügbaren Breite die em-Grösse
  // der ganzen Tastatur aus). Eine Zahl aus dem Revier (14-20 px) einzusetzen
  // hiesse, die Tastatur bei schmalem Fenster über den Rand laufen zu lassen.
  const Key = ({ ch, istGedrueckt }: { ch: string; istGedrueckt: boolean }) => {
    const finger = fingerForChar(ch);
    const isNext = !!target && ch === target;
    const isAvail = unlocked.has(ch);
    // ★ F3-tr: die Tasten mit den Tastmarken sind die Zeigefinger-Heimtasten der Tastatur - auf allen bisherigen F und J,
    // auf türkisch F a und k (dieselbe Stelle, nicht derselbe Buchstabe).
    const isHome = ch === tastmarken[0] || ch === tastmarken[1];
    const farbe = finger?.farbe ?? "#8d99ae";
    const dot = isHome && (
      <span
        aria-hidden
        className="absolute bottom-[0.28em] h-[0.12em] w-[0.7em] rounded-full bg-current opacity-70"
      />
    );
    // ★ E4 (25.09.2026, Bauplan §14 E4 Punkt 6): AZERTY-Ziffernreihe zweistufig
    // wie auf der echten Kappe - oben klein die Ziffer (Maj), unten das
    // Grundzeichen. `null` auf jedem anderen Layout/jeder anderen Taste
    // (einstufige Kappe wie bisher).
    const ziffer = azertyZifferFuer(ch, layout);
    // ★ Schriftgrösse über INLINE STYLE, nicht `text-[...]` (wie `ModKey`s
    // `fs`-Zusatztasten-Beschriftung in dieser Datei) - der Schriftgrössen-
    // Wächter (`tests/tastenflow-schriftgroessen.test.ts`) im Tastenflow-
    // Revier prüft nur Tailwind-Klassen, keine Inline-Stile; eine zweite,
    // kleinere Stufe INNERHALB einer `1em`-Taste braucht trotzdem eine
    // Grössenangabe - das folgt hier demselben Weg wie überall sonst in
    // dieser Datei.
    const kappe = ziffer ? (
      <span className="flex flex-col items-center leading-[1.05]" data-zweistufig="an">
        <span style={{ fontSize: "0.55em" }}>{ziffer}</span>
        <span>{keyLabel(ch, layout)}</span>
      </span>
    ) : (
      keyLabel(ch, layout)
    );

    if (showFingerColors) {
      // GANZE Tastatur in Fingerfarben (nicht nur freigeschaltete Tasten). Die
      // nächste Taste BEHÄLT ihre Fingerfarbe — sie wird nur kräftiger gefüllt und
      // bekommt einen dickeren Rahmen derselben Farbe (kein Akzent-Blau mehr).
      // Die gedrückte ebenso, nur mit dem Rahmen in der Textfarbe (siehe TINTE).
      const hervor = isNext || istGedrueckt;
      return (
        <div
          className={
            "relative grid place-items-center rounded-[0.35em] text-[1em] text-ink transition-transform " +
            (hervor ? "tt-taste-ziel z-10 scale-110 font-bold" : "font-semibold")
          }
          data-gedrueckt={istGedrueckt ? "an" : undefined}
          style={{
            width: "2.1em",
            height: "2.1em",
            borderStyle: "solid",
            borderColor: istGedrueckt ? TINTE : farbe,
            borderWidth: hervor ? "0.22em" : "0.1em",
            background: farbe + (hervor ? "aa" : "55"),
          }}
        >
          {kappe}
          {dot}
        </div>
      );
    }

    // Ohne Finger-Farben: schlichte Tasten, nächste per Akzent hervorgehoben,
    // gedrückte per Textfarbe.
    return (
      <div
        className={
          "relative grid place-items-center rounded-[0.35em] border text-[1em] font-semibold transition-transform " +
          (istGedrueckt
            ? "tt-taste-ziel border-2 border-ink ring-2 ring-ink text-ink scale-110 font-bold"
            : isNext
              ? "tt-taste-ziel border-2 border-accent ring-2 ring-accent text-ink scale-110 font-bold"
              : "border-hairline " + (isAvail ? "text-ink" : "text-ink-muted opacity-40"))
        }
        data-gedrueckt={istGedrueckt ? "an" : undefined}
        style={{
          width: "2.1em",
          height: "2.1em",
          background: isNext || istGedrueckt ? "rgb(var(--c-accent-soft))" : undefined,
        }}
      >
        {kappe}
        {dot}
      </div>
    );
  };

  // Struktur-/Modifikatortaste (Tab, Feststell, Umschalt, Enter, Rück, Strg, Alt,
  // AltGr): bewusst NEUTRAL-grau gehalten, damit sie sich von den Fingerfarb-
  // Buchstaben abhebt und die Tastatur wie eine echte aussieht. `active` (nur
  // Umschalt/AltGr) hebt die gerade zu haltende Zusatztaste per Akzent hervor.
  // WICHTIG: Die Schriftgröße sitzt auf dem inneren <span>, nicht auf der Taste
  // selbst. Sonst würde `width: 3em` in der KLEINEREN Schrift gemessen (3 × 0.55em)
  // — die Zusatztasten fielen zu schmal aus und die rechten Kanten der Reihen
  // fluchteten nicht mehr (am deutlichsten an der viel zu kurzen Leertastenreihe).
  const ModKey = ({
    label,
    w,
    fs = "0.55em",
    active = false,
    gedrueckt: markiert,
    iso,
  }: {
    label: string;
    w: string;
    fs?: string;
    active?: boolean;
    /** „unterteil": der untere Teil des ISO-Enters (siehe Edge). */
    gedrueckt?: "an" | "unterteil";
    /** Teil des zweiteiligen ISO-Enters - die zwei Teile werden zu EINER Taste verbunden. */
    iso?: "oben" | "unten";
  }) => (
    <div
      className={
        (iso === "unten" ? "relative z-10 " : "") +
        "grid place-items-center rounded-[0.35em] border font-semibold " +
        (markiert
          ? "tt-taste-ziel border-ink ring-2 ring-ink text-ink"
          : active
            ? "tt-taste-ziel border-accent ring-2 ring-accent text-ink"
            : "border-hairline bg-surface-sunken text-ink-muted")
      }
      data-gedrueckt={markiert}
      data-iso-enter={iso}
      style={{
        width: w,
        height: iso === "unten" ? "calc(2.4em + 1px)" : "2.1em",
        background: active || markiert ? "rgb(var(--c-accent-soft))" : undefined,
        // ★ Testerin 24.10.2026: Der untere Teil sah aus wie eine eigene Taste
        // ohne Aufschrift. Jetzt reicht er über die Lücke nach oben, deckt dort
        // den Rand des oberen Teils ab und hat oben keine Rundung - beide
        // Teile lesen sich als eine L-förmige Eingabetaste.
        ...(iso === "unten"
          ? {
              marginTop: "calc(-0.3em - 1px)",
              borderTopWidth: 0,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              ...(active || markiert ? {} : { background: "rgb(var(--c-surface-sunken))" }),
            }
          : iso === "oben"
            ? { borderBottomRightRadius: 0 }
            : {}),
      }}
    >
      <span style={{ fontSize: fs }} lang={deutscheKappe(label)}>{label}</span>
    </div>
  );

  // ★ ISO-Enter (zweiteilig): BEIDE Teile werden markiert. Es ist EINE Taste;
  // wer nur den oberen Teil markiert, zeichnet ein Kind hin, das zwei Tasten
  // sieht und nur eine davon gedrückt hat. Das Attribut unterscheidet die
  // Teile trotzdem: oben „an", unten „unterteil" - so bleibt
  // `[data-gedrueckt="an"]` bei JEDER Taste genau ein Element.
  const isoEnter = layout.rows.some((r) => r.right?.unterteil === true);
  const Edge = ({ k }: { k: EdgeKey }) => {
    const an = stelle?.art === "rand" && stelle.code === k.code;
    /*
      ★ Zeilenende mit Enter (23.09.2026): Ist die Eingabetaste die nächste zu
      drückende „Taste" (`nextChar === "\n"`, siehe `TypingSession.tsx`), wird
      sie genauso hervorgehoben wie jede andere nächste Taste (`active`, schon
      vorhanden für Umschalt/AltGr) - beide Teile des ISO-Enters (oben UND
      unten, `k.unterteil`) tragen denselben `code === "Enter"` und werden
      darum beide markiert, wie beim wirklich GEDRÜCKTEN Enter oben (`an`).
      Im Windows-Kontrastmodus trägt `ModKey` bei `active` dieselbe Klasse
      `tt-taste-ziel` wie jede andere hervorgehobene Taste.
    */
    const istNaechste = k.code === "Enter" && nextChar === "\n";
    return (
      <ModKey
        label={k.label}
        w={k.w}
        fs={k.fs}
        iso={k.code === "Enter" && isoEnter ? (k.unterteil ? "unten" : "oben") : undefined}
        active={(!!k.shift && shiftSide === k.shift) || istNaechste}
        gedrueckt={an ? (k.unterteil ? "unterteil" : "an") : undefined}
      />
    );
  };

  // Alle Reihen sind exakt gleich breit (~34 em) → die rechten Kanten fluchten;
  // der wachsende Links-Versatz der Zusatztasten (Tab < Feststell) erzeugt den
  // typischen Tastatur-Treppenversatz. Bei ISO-Tastaturen (Deutschland, Schweiz,
  // Großbritannien) ist der Enter zweiteilig (oben breiter, unten schmaler), bei
  // der amerikanischen ANSI-Tastatur ein einzelner breiter Enter in der Grundreihe.
  return (
    <div
      aria-hidden
      // ★ 25.09.2026: `flex` statt `block` - damit der Ziffernblock (und der
      // Pfeil-/Sprungtasten-Block) als GLEICHRANGIGE SPALTE neben die
      // bestehende Spalte tritt, OHNE eine neue Verschachtelungsebene um sie
      // zu legen. `container.firstElementChild!.firstElementChild!.children`
      // (bestehende Prüfstücke, z. B. `tests/typing-tastatur-gedrueckt.test.tsx`)
      // bleibt dadurch unverändert die Spalte mit den vier Tastenreihen + der
      // Leertastenreihe - der Ziffernblock ist nur ein WEITERES Kind daneben.
      className="select-none rounded-2xl border border-hairline bg-surface-raised p-[0.5em] flex items-start gap-[0.5em]"
    >
      <div className="flex flex-col items-center gap-[0.3em]">
        {/* ★ Testerin 24.10.2026: Esc und F1-F12 (nur „Tasten erkunden"). Esc links,
            die F-Tasten in drei Vierergruppen bis an den rechten Rand. */}
        {vollstaendig && (
          <div data-f-reihe="an" className="flex self-stretch gap-[0.3em]">
            <ModKey label="Esc" w="2.1em" fs="0.5em" gedrueckt={gedrueckt?.code === "Escape" ? "an" : undefined} />
            <div className="flex-1" />
            {[0, 1, 2].map((gruppe) => (
              <div key={gruppe} className="flex gap-[0.3em]" style={{ marginLeft: gruppe ? "0.3em" : undefined }}>
                {[1, 2, 3, 4].map((n) => {
                  const f = `F${gruppe * 4 + n}`;
                  return <ModKey key={f} label={f} w="2.1em" fs="0.5em" gedrueckt={gedrueckt?.code === f ? "an" : undefined} />;
                })}
              </div>
            ))}
          </div>
        )}
        {layout.rows.map((row, i) => (
          <div key={i} className="flex gap-[0.3em]">
            {row.left && <Edge k={row.left} />}
            {row.keys.map((ch, j) => (
              <Key
                // ★ E4 (25.09.2026): Spalten-Index statt Zeichen als React-Key -
                // gefunden beim Bau der Ziffernreihen-Kappe (Belgien, AZERTY):
                // `rows[0]` trägt „-" zweimal (BEFUND-2026-09-25-E3-TASTATUREN.md
                // erwähnt diese Taste nicht einzeln), und ein Zeichen als Key
                // liess React warnen „two children with the same key" - mit dem
                // dokumentierten Risiko doppelter/fehlender Kinder. Der
                // Spalten-Index ist je Reihe immer eindeutig, unabhängig davon,
                // was auf der Taste steht.
                key={j}
                ch={ch}
                istGedrueckt={stelle?.art === "zeichen" && stelle.reihe === i && stelle.spalte === j}
              />
            ))}
            {row.right && <Edge k={row.right} />}
          </div>
        ))}
        {/* Leertastenreihe: Strg · Alt · Leertaste · AltGr · Strg (englische
            Tastaturen: Ctrl, und statt AltGr ein zweites Alt). */}
        <div className="flex gap-[0.3em]">
          <ModKey label={untenLabels[0]} w={mitWin ? "2.6em" : "3em"} gedrueckt={untenGedrueckt(0)} />
          {/* ★ Testerin 24.10.2026: die Windows-Taste links (nur „Tasten erkunden", Windows). */}
          {mitWin && <ModKey label="Win" w="2.6em" fs="0.5em" gedrueckt={codeGedrueckt("MetaLeft")} />}
          <ModKey label={untenLabels[1]} w={mitWin ? "2.6em" : "3em"} gedrueckt={untenGedrueckt(1)} />
          <div
            className={
              "grid place-items-center rounded-[0.35em] " +
              (showFingerColors
                ? "text-ink " + (spaceNext || spaceGedrueckt ? "tt-taste-ziel font-semibold" : "font-medium")
                : spaceGedrueckt
                  ? "tt-taste-ziel border-2 border-ink ring-2 ring-ink text-ink font-medium"
                  : spaceNext
                    ? "tt-taste-ziel border-2 border-accent ring-2 ring-accent text-ink font-medium"
                    : "border border-hairline text-ink-soft font-medium")
            }
            data-gedrueckt={spaceGedrueckt ? "an" : undefined}
            style={{
              // Mit Win, Win und Menü-Taste (je 2.6em statt 3em) bleibt die Reihe gleich breit.
              width: mitWin ? "13.7em" : "20.8em",
              height: "2.1em",
              // Leertaste = Daumen (neutral-grau); als Nächste kräftiger + dicker
              // umrandet, aber in DERSELBEN Farbe (kein Akzent-Blau). Gedrückt:
              // Rahmen in der Textfarbe (siehe TINTE).
              ...(showFingerColors
                ? {
                    borderStyle: "solid",
                    borderColor: spaceGedrueckt ? TINTE : FINGERS.daumen.farbe,
                    borderWidth: spaceNext || spaceGedrueckt ? "0.22em" : "0.1em",
                    background: FINGERS.daumen.farbe + (spaceNext || spaceGedrueckt ? "aa" : "55"),
                  }
                : {
                    background: spaceNext || spaceGedrueckt ? "rgb(var(--c-accent-soft))" : undefined,
                  }),
            }}
          >
            {/* AUSNAHME (E7, §2.7): Teil der Bildschirmtastatur, die sich
                selbst misst (`KeyboardPanel.tsx`) - `0.6em` ist relativ zur
                dynamisch berechneten Tastengrösse, keine feste Schriftgrösse. */}
            <span className="text-[0.6em]">{LEERTASTE[sprache]}</span>
          </div>
          <ModKey
            label={untenLabels[2]}
            w={mitWin ? "2.6em" : "3em"}
            active={altGrNext}
            gedrueckt={untenGedrueckt(2)}
          />
          {mitWin && <ModKey label="Win" w="2.6em" fs="0.5em" gedrueckt={codeGedrueckt("MetaRight")} />}
          {/* Die Menü-Taste trägt auf echten Tastaturen ein Listen-Zeichen, kein Wort. */}
          {mitWin && <ModKey label="☰" w="2.6em" fs="0.7em" gedrueckt={codeGedrueckt("ContextMenu")} />}
          <ModKey label={untenLabels[3]} w={mitWin ? "2.6em" : "3em"} gedrueckt={untenGedrueckt(3)} />
        </div>
      </div>
      {zeigeVoll && (
        // Mit der F-Reihe steht über dem Hauptblock eine Reihe mehr - Ziffernblock
        // und Pfeilblock rücken mit, damit sie weiter mit den Reihen fluchten.
        <div className="flex items-start gap-[0.4em]" style={{ marginTop: vollstaendig ? "2.4em" : undefined }}>
          {navBlock}
          {numpadBlock}
        </div>
      )}
    </div>
  );
}

/**
 * ★ E4 (25.09.2026, Bauplan §14 E4 Punkt 6): akzentuierte Buchstaben, die auf
 * den fünf französischen Tastaturen als LITERALE Tastenkappe (`rows`) stehen
 * (`é è ç à ù` - FR/BE/CH_FR/CA_CSA/CA_FR, `layouts.ts`) - dort bleiben sie
 * KLEIN, genau wie auf der echten Kappe. Eine Grossform gibt es auf den
 * meisten dieser Tastaturen für diese Zeichen gar nicht direkt (F5-F7).
 */
const FR_KLEIN_KAPPEN = new Set(["é", "è", "ç", "à", "ù"]);

/**
 * ★ F3-it (02.10.2026, Falle 15): dasselbe für die zwei italienischen Tastaturen. Auf der echten
 * Kappe stehen `è é ì ò à ù` klein (die Grossform gibt es unter Windows auf keinem Weg, Bauplan
 * italienischer Lehrgang §2); `ç` liegt auf `it` auf Umschalt + ò und auf `it-qzerty` auf der Taste 5.
 */
const IT_KLEIN_KAPPEN = new Set(["è", "é", "ì", "ò", "à", "ù", "ç"]);

/**
 * ★ F3-cs (02.10.2026, Falle 15): dasselbe für die zwei tschechischen Tastaturen. Auf der echten Kappe stehen die elf
 * Buchstaben mit eigener Taste klein - die Zahlenreihe `ě š č ř ž ý á í é` UNTEN, die Ziffer oben (Umschalt), und `ú ů`:
 * Umschalt auf diesen Tasten gibt nie den Grossbuchstaben (Umschalt + š = 3, Umschalt + ú = `/`, Umschalt + ů = `"`),
 * eine Kappe „Š" wäre eine falsche Auskunft.
 */
const CS_KLEIN_KAPPEN = new Set(["ě", "š", "č", "ř", "ž", "ý", "á", "í", "é", "ú", "ů"]);

/**
 * Beschriftung einer Taste. Buchstaben groß (so stehen sie auf echten Tastaturen),
 * ß und die Sonderzeichen unverändert.
 *
 * ★ E4: NUR auf den fünf französischen Layouts (`FRANZOESISCHE_LAYOUT_IDS`)
 * bleiben `é è ç à ù` klein (siehe {@link FR_KLEIN_KAPPEN}) - de/ch/us/uk
 * bleiben Byte für Byte wie bisher (Schnappschuss-Test).
 */
function keyLabel(ch: string, layout: KeyboardLayout): string {
  if (ch === "ß") return "ß"; // Großform wäre „SS"
  if (FRANZOESISCHE_LAYOUT_IDS.has(layout.id) && FR_KLEIN_KAPPEN.has(ch)) return ch;
  if (ITALIENISCHE_EIGENE_LAYOUT_IDS.has(layout.id) && IT_KLEIN_KAPPEN.has(ch)) return ch;
  if (TSCHECHISCHE_LAYOUT_IDS.has(layout.id) && CS_KLEIN_KAPPEN.has(ch)) return ch;
  // ★★ G3b (25.10.2026, Falle 15): die neuen Tastaturen tragen ihre kleinen Kappen als Eigenschaft (`kleineKappen`).
  if (layout.kleineKappen?.includes(ch)) return ch;
  // ★ G2b-1: die Kappe in der Sprache der Tastatur (türkisch: Taste „i" trägt „İ", Taste „ı" trägt „I").
  return grossFuer(ch, layoutSprache(layout));
}

/**
 * ★ E4 (25.09.2026, Bauplan §14 E4 Punkt 6): auf den AZERTY-Tastaturen (fr/be)
 * (★ F3-it: und auf der italienischen QZERTY) trägt jede Taste der Ziffernreihe ZWEI Zeichen wie auf der echten Kappe -
 * oben klein die Ziffer (kommt mit Umschalt), unten das Grundzeichen (`ch`,
 * das ohne Umschalt entsteht). Gesucht wird über `access`: welche Ziffer hat
 * `base === ch` UND `mod === "shift"`? `null` für jede andere Taste/jedes
 * andere Layout (einstufige Kappe wie bisher).
 */
function azertyZifferFuer(ch: string, layout: KeyboardLayout): string | null {
  // ★ F3-it: auch die italienische Mac-Tastatur „Italiano" (QZERTY) braucht für die Ziffern die
  // Umschalttaste - ihre Ziffernreihe zeigt oben die Ziffer, unten das Grundzeichen (& " ' ( ç è ) £ à é).
  // ★ F3-cs (02.10.2026): ebenso die zwei tschechischen Tastaturen (unten `+ ě š č ř ž ý á í é`). Seit heute an der
  // EIGENSCHAFT festgemacht (Falle 50): „jede Ziffer braucht die Umschalttaste" - das sind genau fr, be, it-qzerty, cs und
  // cs-qwerty (Wächter `tastenflow-tastaturen-cs.test.ts`), also dieselben drei wie vorher plus die tschechischen.
  if (!ziffernNurMitUmschalt(layout)) return null;
  for (const ziffer of "0123456789") {
    const acc = layout.access[ziffer];
    if (acc?.base === ch && acc.mod === "shift") return ziffer;
  }
  return null;
}
