/**
 * ★★★ DIE LEKTIONEN DES WEGES „nl" (Niederländisch, Niederlande und Flandern) - F4-NL (29.10.2026), vorher leerer Einhängepunkt.
 *
 * Bauart wie `curriculumHu.ts`; die Rechnung (Tasten je Lektion, Griffe aus den Daten der Tastatur, `introByLayout`) steht im
 * `lektionenBaukasten.ts`. Neu auf Niederländisch geschrieben, nichts übersetzt. Begriffe nach dem Glossar (`glossar/GLOSSAR-nl.md`
 * §2.1, §2.8, §2.9): *basisrij* (nie „regel" - das ist die Übungszeile), *basishouding*, *bovenste/onderste rij*, *cijferrij*,
 * *pink · ringvinger · middelvinger · wijsvinger · duim* (zusammengeschrieben: *linkerwijsvinger*), *de voelstreepjes op F en J*,
 * *Shift*, *Alt Gr*, *spatiebalk*, *dode toets*, *les*; Kinder werden geduzt (*je/jij*, Bauplan N11), nie *u*; Platzhalter mit
 * Kopfwort („de toets ;"); in NL und Flandern gleich verständliche Wörter (Regel 14); Tastenwege statt Maus; nur der Bindestrich `-`.
 * Beispielwörter in „…” (U+201E/U+201D) wie in hu/ro - nur als Markierung für den Wächter; das Kind tippt die Wörter ohne sie.
 *
 * ── DIE REGEL (wie hu/cs) ────────────────────────────────────────────────────────────────────────────────────────────
 * Jede Lektion führt NUR Tasten ein, die in der Reihenfolge des Weges (`lernweg.ts#NL_LETTER_ORDER`) bis dahin dran sind: die Tasten
 * aller Lektionen hintereinander SIND `introOrder("nl")` - auf `nl-intl` (US-International, Bezug Niederlande), `be` (Belgisch
 * AZERTY, Bezug Flandern) und `nl-dutch`. Am WERT (Bauplan N2): die achte Heimtaste ist `;` (nl-intl), `m` (be) bzw. `+` (nl-dutch);
 * das `m` kommt auf `be` darum schon in der vierten Lektion. Die Totasten-Lektion (N3) ist der Apostroph: auf `nl-intl` sind `'` und
 * `"` dode toetsen, auf `be`/`nl-dutch` kommen `ë ï` über die Trema-Totaste. Die Griffe werden gerechnet, nie geschrieben.
 * Wächter: `tests/tastenflow-lektionen-nl.test.ts`.
 */
import type { Lesson } from "./curriculum";
import type { FingerId, KeyAccess } from "./fingers";
import { heimZeichenDesWeges } from "./heimtasten";
import type { KeyboardLayout, LayoutId } from "./layouts";
import {
  fingerTeile,
  griffSatz,
  lektionenJeTastatur,
  type GriffSaetze,
  type Lage,
  type LektionsBauplan,
} from "./lektionenBaukasten";
import { kappeFuer } from "./sprachRegister";

// ── Namen ────────────────────────────────────────────────────────────────────

/** Was auf der Kappe steht: Buchstaben gross, sonst das Zeichen. */
const kappe = (k: string): string => kappeFuer(k, "nl");

/** „de toets F", „de toets ;" - das Kopfwort bleibt fest (Glossar Regel 12). */
const toets = (k: string): string => `de toets ${kappe(k)}`;

/** Die Akzentbuchstaben, wie das Kind sie in der Schule nennt (Glossar §2.8). */
const ACCENTEN: Readonly<Record<string, string>> = {
  ë: "e met trema", ï: "i met trema", é: "e met accent aigu", è: "e met accent grave", à: "a met accent grave",
};

/** „F en J", „A, B en C". */
function aufzaehlen(teile: readonly string[]): string {
  if (teile.length <= 1) return teile.join("");
  return `${teile.slice(0, -1).join(", ")} en ${teile[teile.length - 1]}`;
}
const kappen = (t: readonly string[]): string => aufzaehlen(t.map(kappe));

const VINGER: Record<"kleiner" | "ring" | "mittel" | "zeige" | "daumen", string> = {
  kleiner: "pink", ring: "ringvinger", mittel: "middelvinger", zeige: "wijsvinger", daumen: "duim",
};
function fingerName(f: FingerId): string {
  const { hand, art } = fingerTeile(f);
  return hand === null ? VINGER[art] : `${hand === "links" ? "linker" : "rechter"}${VINGER[art]}`;
}

const RIJEN = ["cijferrij", "bovenste rij", "basisrij", "onderste rij"];

/** „rechts van de toets F", „twee toetsen links van de toets J". */
function opzij(l: Lage): string {
  const kant = l.richtung === "links" ? "links" : "rechts";
  const weit = l.abstand >= 3 ? "drie toetsen " : l.abstand === 2 ? "twee toetsen " : "";
  return `${weit}${kant} van ${toets(l.heim ?? "")}`;
}

/** Finger und Lage, z. B. „linkerwijsvinger, rechts van de toets F". */
function lageText(l: Lage): string {
  const vinger = fingerName(l.finger);
  if (l.istHeim) return `${vinger}, basishouding`;
  if (!l.heim) return `${vinger}, ${RIJEN[l.reihe]}`;
  if (l.reihe === 2) return `${vinger}, ${opzij(l)}`;
  if (l.abstand === 0) return `${vinger}, ${RIJEN[l.reihe]}, recht ${l.reihe === 3 ? "onder" : "boven"} ${toets(l.heim)}`;
  return `${vinger}, ${RIJEN[l.reihe]}, ${opzij(l)}`;
}

function zusatz(z: KeyAccess): string {
  if (z.mod === "shift") return "houd met de andere hand Shift ingedrukt en druk op ";
  if (z.mod === "altgr") return "houd Alt Gr ingedrukt en druk op ";
  return "druk op ";
}

/** Der Totasten-Hinweis (Glossar §2.9, Hinweis `nl-intl`). */
const DODE = "Dat is een dode toets: eerst verschijnt er niets. Typ daarna de letter - of de spatiebalk voor het teken zelf.";

/** Zeichennamen nach dem Glossar (§2.8, `SPOKEN_NL`): der Name steht vor dem Zeichen. */
const TEKENS: Readonly<Record<string, string>> = {
  ".": "punt", ",": "komma", "?": "vraagteken", "!": "uitroepteken", "-": "koppelteken", ";": "puntkomma",
  ":": "dubbele punt", "\"": "aanhalingsteken", "'": "apostrof", "(": "haakje openen", ")": "haakje sluiten",
  "%": "procent", "/": "schuine streep", "+": "plus", "=": "is gelijk aan", "_": "liggend streepje", "*": "sterretje",
  "&": "ampersand", "<": "kleiner dan", ">": "groter dan", "$": "dollar", "@": "apenstaartje", "#": "hekje",
  "[": "vierkante haak openen", "]": "vierkante haak sluiten", "{": "accolade openen", "}": "accolade sluiten",
  "|": "verticale streep", "\\": "backslash", "€": "euro", "^": "dakje", "~": "tilde", "`": "accent grave",
  "´": "accent aigu", "¨": "trema", "§": "paragraaf",
};

/** Der Name, mit dem ein Griff-Satz beginnt: „Ë (e met trema)", „5", „puntkomma (;)". */
function satzNaam(u: string): string {
  if (ACCENTEN[u]) return `${kappe(u)} (${ACCENTEN[u]})`;
  if (/^\p{L}$/u.test(u) || /^\d$/.test(u)) return kappe(u);
  return TEKENS[u] ? `${TEKENS[u]} (${u})` : u;
}

const SAETZE: GriffSaetze = {
  griff(u, lage, zugang, _layout, kombi) {
    const naam = satzNaam(u);
    if (kombi) {
      const dood = TEKENS[kombi.tot] ?? kombi.tot;
      const hoe = kombi.totZugang?.mod === "shift" ? ["met Shift"] : kombi.totZugang?.mod === "altgr" ? ["met Alt Gr"] : [];
      const waar = [...hoe, ...(kombi.totLage ? [lageText(kombi.totLage)] : [])].join(", ");
      const basis = u.normalize("NFD")[0];
      return (
        `${naam}: druk eerst op de dode toets ${dood}${waar ? ` (${waar})` : ""} en daarna op ` +
        `${toets(basis)}${lage ? ` (${lageText(lage)})` : ""}. Na een dode toets verschijnt er eerst niets.`
      );
    }
    if (zugang?.dead) {
      if (zugang.base === u && !zugang.mod) return `${naam}: ${lage ? lageText(lage) : "een eigen toets"}. ${DODE}`;
      return `${naam}: ${zusatz(zugang)}${toets(zugang.base)}${lage ? ` (${lageText(lage)})` : ""}. ${DODE}`;
    }
    if (zugang && (zugang.mod || zugang.base !== u)) {
      return `${naam}: ${zusatz(zugang)}${toets(zugang.base)}${lage ? ` (${lageText(lage)})` : ""}.`;
    }
    if (lage) return `${naam}: ${lageText(lage)}.`;
    return `${naam}: de plaats op dit toetsenbord is nog niet beschreven.`;
  },
};

// ── Die Sonderteile ──────────────────────────────────────────────────────────

function shiftTeil(): string {
  return (
    "Een hoofdletter typ je door met de andere hand Shift ingedrukt te houden: voor een letter links op het toetsenbord de " +
    "rechter Shift, voor een letter rechts de linker Shift. Beide Shift-toetsen druk je in met je pink."
  );
}

/** Ziffern: auf `be` nur mit Shift (Glossar Falle 6, Bauplan N10) - der Hinweis zuerst, dann die gerechneten Griffe. */
function cijferTeil(t: readonly string[], layout: KeyboardLayout): string {
  const griffe = t.map((u) => griffSatz("nl", layout, u, SAETZE)).join(" ");
  if (t.length > 0 && t.every((z) => layout.access[z]?.mod === "shift")) {
    return (
      "Op een Belgisch toetsenbord typ je cijfers met Shift: zonder Shift geven dezelfde toetsen andere tekens. Caps Lock " +
      `werkt daar als Shift - zet hem uit. ${griffe}`
    );
  }
  return griffe;
}

// ── Die Folge ────────────────────────────────────────────────────────────────

const fix = (tekst: string) => () => tekst;
const RIJ = (t: readonly string[]) => `Basisrij: ${kappen(t)}`;

/** Der Satz zur achten Heimtaste - am Wert (N2): `;` (nl-intl), `m` (be), `+` (nl-dutch). */
function achtsteToets(t: readonly string[]): string {
  if (t.includes("m")) return "De rechterpink ligt op de toets naast de L: op jouw toetsenbord is dat de M.";
  if (t.includes("+")) return "De rechterpink ligt op de toets naast de L: op jouw toetsenbord is dat het plusteken.";
  return "De rechterpink ligt op de toets naast de L: op jouw toetsenbord is dat de puntkomma.";
}

const BAUPLAENE: readonly LektionsBauplan[] = [
  {
    id: "nl-basis-1", kind: "home",
    // Falle 41: die Zeichen auf KeyF/KeyJ der Haupttastatur (auf allen drei Tastaturen f und j) - erst beim Bauen gelesen.
    get einheiten() {
      return [...heimZeichenDesWeges("nl")];
    },
    titel: RIJ,
    vorspann: fix(
      "Leg je vingers op de basisrij - dat is de basishouding. Op de F en de J voel je kleine voelstreepjes: zo vind je ze " +
        "zonder naar het toetsenbord te kijken. Je begint met deze twee toetsen, met je twee wijsvingers. Elke vinger " +
        "vertrekt hiervandaan en komt hier weer terug.",
    ),
  },
  {
    id: "nl-basis-2", kind: "home", einheiten: ["d", "k"], titel: RIJ,
    vorspann: fix("Naast de wijsvingers komen de middelvingers: de D links, de K rechts. De wijsvingers blijven op de voelstreepjes."),
  },
  {
    id: "nl-basis-3", kind: "home", einheiten: ["s", "l"], titel: RIJ,
    vorspann: fix("Nu komen de ringvingers: de S links, de L rechts. Je vingers blijven los en licht."),
  },
  {
    // Bauplan N2: die achte Heimtaste am Wert - `;` auf nl-intl, `m` auf be, `+` auf nl-dutch.
    id: "nl-basis-4", kind: "home", einheiten: ["a", ";"],
    titel: (t) => `De hele basisrij: ${kappen(t)}`,
    vorspann: (t) =>
      `${t.includes("m") ? "Je linkerpink rust op de Q en typt de A, recht daarboven." : "De linkerpink gaat naar de A."} ` +
      `${achtsteToets(t)} Nu is de basisrij klaar: acht vingers op acht toetsen, je duimen op ` +
      "de spatiebalk. De eerste woorden: „jas”, „dak”, „las”, „sla” en „als”." +
      (t.includes("m") ? " Met de M erbij: „dam” en „maal”." : ""),
  },
  {
    id: "nl-vaak-1", kind: "letters", einheiten: ["e", "n"],
    titel: (t) => `Veelgebruikte letters: ${kappen(t)}`,
    vorspann: fix("De E is de letter die in het Nederlands het vaakst voorkomt, de N volgt. Daarmee typ je al: „een”, „nee”, „fles”, „deken” en „land”."),
  },
  {
    id: "nl-vaak-2", kind: "letters", einheiten: ["i", "t"],
    titel: (t) => `Veelgebruikte letters: ${kappen(t)}`,
    vorspann: fix("Met de I en de T: „is”, „dit”, „tien”, „stil”, „tafel” en „kat”."),
  },
  {
    id: "nl-vaak-3", kind: "letters", einheiten: ["o", "r"],
    titel: (t) => `Veelgebruikte letters: ${kappen(t)}`,
    vorspann: fix("Met de O en de R: „rood”, „door”, „oor”, „stoel”, „trein” en „oranje”."),
  },
  {
    id: "nl-vaak-4", kind: "letters", einheiten: ["h", "g"],
    titel: (t) => `Veelgebruikte letters: ${kappen(t)}`,
    vorspann: fix("Met de H en de G: „het”, „hond”, „goed”, „hier”, „graag” en „dag”."),
  },
  {
    id: "nl-hoofdletters", kind: "shift", einheiten: [], enablesShift: true,
    titel: () => "Hoofdletters met Shift",
    vorspann: fix(
      "Tot nu toe typte Tastenflow de hoofdletters voor je. Vanaf nu doet je hand het zelf: „Anna”, „Sanne”, „Daan”, " +
        "„Noor”, „Gent”, „Leiden” en „Den Haag”. Een IJ aan het begin van een woord krijgt twee hoofdletters: „IJsland”. " +
        "Met een hoofdletter vooraan typ je al een hele zin: „Het is goed”.",
    ),
    griffe: shiftTeil,
  },
  {
    id: "nl-leestekens-1", kind: "punctuation", einheiten: [".", ",", "?"],
    titel: () => "Punt, komma en vraagteken: . , ?",
    vorspann: fix(
      "Een zin begint met een hoofdletter en eindigt met een punt. De komma verdeelt de zin, het vraagteken sluit een vraag " +
        "af. Voor deze tekens komt geen spatie, erna wel. Probeer: „Hoe heet je?” en „Ja, dat is het.”",
    ),
  },
  {
    // Auf `be` kam das `m` schon mit der Basisrij - hier bleibt dort nur `w`.
    id: "nl-letters-1", kind: "letters", einheiten: ["m", "w"],
    titel: (t) => `Meer letters: ${kappen(t)}`,
    vorspann: fix("Met de M en de W: „met”, „mooi”, „water”, „wind”, „melk” en „wat”."),
  },
  {
    id: "nl-letters-2", kind: "letters", einheiten: ["u", "v"],
    titel: (t) => `Meer letters: ${kappen(t)}`,
    vorspann: fix("Met de U en de V: „uur”, „huis”, „vis”, „vader”, „vriend” en „ui”."),
  },
  {
    id: "nl-letters-3", kind: "letters", einheiten: ["b", "z"],
    titel: (t) => `Meer letters: ${kappen(t)}`,
    vorspann: fix("Met de B en de Z: „boek”, „boom”, „zon”, „zee” en „zwemmen”."),
  },
  {
    id: "nl-letters-4", kind: "letters", einheiten: ["p", "c"],
    titel: (t) => `Meer letters: ${kappen(t)}`,
    vorspann: fix("Met de P en de C: „pen”, „paard”, „appel”, „school”, „cadeau” en „computer”."),
  },
  {
    // Bauplan N3/N4: die Totasten-Lektion - nur sichere Folgen (nie `'` vor einem Klinker, W-NL1).
    id: "nl-apostrof", kind: "letters", einheiten: ["'"],
    titel: () => "De apostrof: '",
    vorspann: fix(
      "De apostrof staat in meervouden en korte woorden: „auto's”, „foto's”, „zo'n” en „'s avonds”. Op sommige " +
        "toetsenborden is de apostrof een dode toets - hieronder staat hoe het op jouw toetsenbord gaat.",
    ),
  },
  {
    id: "nl-trema", kind: "letters", einheiten: ["ë", "ï"],
    titel: (t) => `Letters met een trema: ${kappen(t)}`,
    vorspann: fix(
      "Het trema laat zien dat er een nieuwe klank begint: „ideeën”, „knieën”, „ruïne” en „drieëntwintig”. Het trema " +
        "hoort bij de spelling, daarom vraagt Tastenflow altijd de letter met trema.",
    ),
  },
  {
    id: "nl-accent", kind: "letters", einheiten: ["é"],
    titel: () => "De E met accent aigu: É",
    vorspann: fix("Met het accent aigu: „café”, „privé” en „één” - één met accenten alleen als het getal bedoeld is."),
  },
  {
    id: "nl-zeldzaam", kind: "letters", einheiten: ["y", "x", "q"],
    titel: (t) => `Zeldzame letters: ${kappen(t)}`,
    vorspann: fix("De Y, de X en de Q komen vooral voor in namen en in woorden uit andere talen: „yoga”, „hobby”, „taxi”, „xylofoon” en „quiz”."),
  },
  {
    id: "nl-leestekens-2", kind: "punctuation", einheiten: ["!", "-", "\"", ":", "(", ")"],
    titel: (t) => `Meer leestekens: ${t.join(" ")}`,
    vorspann: fix(
      "Het uitroepteken sluit een uitroep af, het koppelteken verbindt woorddelen, de dubbele punt kondigt een opsomming " +
        "of uitleg aan, aanhalingstekens zetten een woord of een uitspraak apart, en haakjes sluiten een opmerking in. " +
        "Probeer: „Kijk uit!”, „Let op:”, „e-mail” en „(tip)”.",
    ),
  },
  {
    id: "nl-cijfers", kind: "numbers", einheiten: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    titel: () => "Cijferrij",
    vorspann: fix("Data, tijden, prijzen en uitslagen: nu komen de cijfers. Elke vinger gaat in zijn eigen kolom omhoog."),
    griffe: cijferTeil,
  },
  {
    id: "nl-symbolen-1", kind: "symbols", einheiten: ["%", "/", "+", "=", "_", "*", "&", "<", ">", "$"],
    titel: (t) => `Speciale tekens: ${t.join(" ")}`,
    vorspann: fix("Deze tekens heb je nodig voor rekenen, procenten en werken op de computer. Hier is nauwkeurigheid belangrijker dan snelheid."),
  },
  {
    id: "nl-symbolen-2", kind: "symbols", einheiten: ["@", "#", "[", "]", "{", "}", "|", "\\", "€"],
    titel: (t) => `Meer speciale tekens: ${t.join(" ")}`,
    vorspann: fix("Tekens voor e-mailadressen, prijzen en programmacode. Dit zijn de moeilijkste, daarom komen ze als laatste."),
  },
  {
    id: "nl-teksten", kind: "text", einheiten: [], corpusKinds: ["satz"],
    titel: () => "Teksten",
    vorspann: fix(
      "Nu is het hele toetsenbord van jou en typ je hele teksten: van Groningen tot Gent, van Amsterdam tot Antwerpen, " +
        "verhalen over school, sport, dieren en een gewone dag.",
    ),
  },
];

// ── Bauen je Tastatur ────────────────────────────────────────────────────────

/** Die Folge der Bauplan-IDs, zum Nachprüfen im Wächter. */
export const NL_LEKTIONS_IDS: readonly string[] = BAUPLAENE.map((b) => b.id);

/** Der GESCHRIEBENE erste Absatz einer Lektion (für den Beispielwort-Wächter). */
export function nlLektionsVorspannFuer(id: string, tasten: readonly string[]): string {
  return BAUPLAENE.find((b) => b.id === id)?.vorspann(tasten) ?? "";
}

/** Die niederländischen Tastaturen des Weges (G3b): US-International (Bezug NL), Belgisch AZERTY (Bezug Flandern), Dutch. */
const NL_LAYOUTS: readonly LayoutId[] = ["nl-intl", "be", "nl-dutch"];

const bauen = lektionenJeTastatur("nl", NL_LAYOUTS, BAUPLAENE, SAETZE);

/** Die Lektionen des Weges „nl" auf dieser Tastatur (gecacht; `introByLayout` trägt die anderen Tastaturen des Weges). */
export function nlLektionenFuerLayout(layoutId: LayoutId): readonly Lesson[] {
  return bauen(layoutId);
}
