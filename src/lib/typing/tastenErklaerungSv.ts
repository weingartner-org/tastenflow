/**
 * Tastenflow - „Utforska tangenterna" / „Hitta tangenterna" in der SCHWEDISCHEN
 * Bedienung (★ O-INHALT-SV, 29.10.2026, Glossar `recherche-schwedisch-2026-10-25/GLOSSAR-sv.md`
 * §1 Regeln 3/8/9/11/12, §2.1, §2.8, §2.9, §4 Fallen 1/2/6/10/15; Tastenlage nach `layouts.ts` `SV`).
 * Bis hierher reichte diese Datei die englischen Teile weiter (G3c-VERTEILER, 25.10.2026).
 *
 * Dieselbe Logik wie bei den anderen Sprachen: `erkundeTaste` in
 * `tastenErklaerung.ts` entscheidet weiter, WAS eine Taste ist (Sondertaste,
 * Zeichen, Kombination, dritter Layer, Totaste) und ob sie geschluckt wird.
 * Hier stehen nur die WÖRTER - dieselben Fächer wie in `tastenErklaerungCs.ts`,
 * Eintrag für Eintrag, NEU auf Schwedisch geschrieben (nicht übersetzt). Der
 * Verteiler liest alles über {@link TASTEN_SATZ_SV} (Form: `tastenErklaerungSatz.ts`).
 *
 * ── Glossar (§2.9) ──────────────────────────────────────────────────────────
 *  Anders als Tschechisch ÜBERSETZT Schwedisch die Tastennamen (Microsoft-
 *  Styleguide 5.6.4, Apple-Hilfe sv-se). Windows: Skift · Caps Lock · Retur ·
 *  Backsteg · Delete (nie „Del" - heisst „Teil", Falle 6) · Mellanslag · Tabb ·
 *  Ctrl · Alt · Alt Gr · Esc · Home · End · Page Up · Page Down · Insert ·
 *  Windows-tangenten · Menytangenten · Uppåtpil / Nedåtpil / Vänsterpil /
 *  Högerpil. Mac: Skift · Skiftlås · Retur · Radera (Rücktaste) · Fn + Radera
 *  („Radera framåt") · Kontroll · Alternativ · Kommando (Kmd) · Fn.
 *  Die deutsche Kappe („Strg", „Entf", „Pos 1", „Einfg") bleibt auf der
 *  Bildschirm-Tastatur - die Erklärung sagt dazu, was dort steht.
 *
 * ── Die Regeln der Sätze ────────────────────────────────────────────────────
 *  · Ein Kind ist gemeint: **du**, Befehlsform („tryck", „hitta"), keine
 *    Maus-Wörter (nie „klicka", „dra", „peka" - Regel 9).
 *  · Tastennamen UNGEBEUGT (Regel 12): nie „Skiften", „Returen". Wo eine
 *    bestimmte Form nötig ist, das Muster mit Bindestrich („Skift-tangenten",
 *    „Windows-tangenten", MS-SG 5.6.4) oder das Kopfwort davor („tangenten Tabb").
 *  · Schwedisch verrät in Verb und Partizip kein Geschlecht der Person - die
 *    Sätze dürfen „du" ansprechen; nie han/hon (Regel 3).
 *  · Nur Bindestrich `-`; höchstens ein „!" je Meldung; keine Abkürzungen
 *    („till exempel", nie „t.ex.", Regel 8).
 *  · Der erste Satz von `was` beginnt klein - die Taste ist sein Subjekt
 *    („hoppar till nästa element").
 *  · ★★★ å ä ö sind EIGENE Buchstaben (Falle 1), nie „a med ring". Auf der
 *    schwedischen Tastatur hat jeder eine eigene Taste, mit Skift seinen
 *    Grossbuchstaben; Caps Lock gibt Å Ä Ö auch - ein Weg, kein Fehler (Falle 15).
 *    é ist die Totaste ´ (rechts neben +), dann e.
 *  · ⚠️ `spokenLabel(…, "sv")` liefert heute ENGLISCH (`zeichenNamenSv.ts` ist
 *    leer) - die Zeichennamen stehen darum hier in {@link NAMEN_SV} (Glossar §2.8).
 */
import type { Plattform } from "../computer/model";
import type { TastenName } from "../computer/tastenNamen";
import { unitKind } from "./letters";
import { SCHWEDISCHE_LAYOUT_IDS, layoutById, type LayoutId } from "./layouts";
import type { TastenErklaerung } from "./tastenErklaerung";
import type { TastenErklaerungSatz } from "./tastenErklaerungSatz";

/* ══ Zeichennamen (Glossar §2.8) ════════════════════════════════════════════ */

/**
 * Die schwedischen Namen der Satz- und Sonderzeichen - die Sprachausgabe hat
 * noch keine eigenen (`zeichenNamenSv.ts` leer). Bewusst anders als NVDA, wie
 * das Glossar §2.8 es festlegt: bindestreck, lodstreck, citattecken, och-tecken,
 * cirkumflex. `å ä ö` heissen wie ihr Laut; `é` heisst „e med accent".
 */
const NAMEN_SV: Readonly<Record<string, string>> = {
  " ": "mellanslag",
  ".": "punkt",
  ",": "komma",
  "-": "bindestreck",
  ":": "kolon",
  ";": "semikolon",
  "?": "frågetecken",
  "!": "utropstecken",
  "'": "apostrof",
  '"': "citattecken",
  "(": "vänster parentes",
  ")": "höger parentes",
  "[": "vänster hakparentes",
  "]": "höger hakparentes",
  "{": "vänster klammerparentes",
  "}": "höger klammerparentes",
  "/": "snedstreck",
  "\\": "omvänt snedstreck",
  "|": "lodstreck",
  "@": "snabel-a",
  "#": "nummer",
  "&": "och-tecken",
  "%": "procent",
  _: "understreck",
  "<": "mindre än",
  ">": "större än",
  "=": "likhetstecken",
  "+": "plus",
  "*": "stjärna",
  "€": "euro",
  $: "dollar",
  "£": "pund",
  "§": "paragraf",
  "°": "grader",
  "¤": "valutatecken",
  "^": "cirkumflex",
  "~": "tilde",
  "`": "grav accent",
  "´": "akut accent",
  "¨": "trema",
  "ˇ": "hake",
  "½": "en halv",
  "µ": "mikro",
  "«": "vänster vinkelcitattecken",
  "»": "höger vinkelcitattecken",
  "²": "upphöjt till två",
  "³": "upphöjt till tre",
  é: "e med accent",
};

/** Liegt diese Tastatur unter den schwedischen (`sv`)? */
function svensk(layout: LayoutId): boolean {
  return SCHWEDISCHE_LAYOUT_IDS.has(layout);
}

/** Der Name einer Kappe nach „Alt Gr +" - lateinische Buchstaben gross, sonst wie auf der Kappe. */
function kappe(key: string): string {
  return /^[a-z]$/.test(key) ? key.toUpperCase() : key;
}

/** Ein Grossbuchstabe in Schwedisch: „stort A", „stort Å", „stort E med accent" (Glossar §2.8). */
function grossName(ch: string): string | null {
  const klein = ch.toLocaleLowerCase("sv-SE");
  if (klein === ch || ch.toLocaleUpperCase("sv-SE") !== ch || klein.length !== 1) return null;
  return klein === "é" ? "stort E med accent" : `stort ${ch}`;
}

/**
 * ★ O-INHALT-SV (29.10.2026): der lesbare schwedische Name einer Lern-Einheit -
 * für die Lehrkraft-Statistik, die Stand-Zeile und die Tastenkarte, wie
 * `unitLabelCs`. Buchstaben gross wie auf der Kappe („R", „Å", „Ä", „Ö" - auf
 * der schwedischen Tastatur stehen sie gross auf der Taste); `é` hat keine eigene
 * Kappe und bleibt klein. Zeichen und Totasten über {@link zeichenNameSv},
 * NICHT über `spokenLabel(…, "sv")` (das liefert heute Englisch).
 */
export function unitLabelSv(unit: string): string {
  switch (unitKind(unit)) {
    case "shift":
      return "stora bokstäver";
    case "ziffer":
      return `siffran ${unit}`;
    case "satzzeichen":
    case "sonderzeichen":
      return zeichenNameSv(unit);
    default: {
      if (unit === "é") return unit;
      const gross = unit.toLocaleUpperCase("sv-SE");
      if (gross !== unit.toLocaleLowerCase("sv-SE")) return gross.length === unit.length ? gross : unit;
      return zeichenNameSv(unit);
    }
  }
}

/* ══ Sondertasten ═══════════════════════════════════════════════════════════ */

/**
 * Glossar §2.9: die deutsche Kappe („Strg", „Entf", „Pos 1") bleibt auf der
 * Bildschirm-Tastatur; „Utforska tangenterna" sagt dazu, was darauf steht.
 */
const TYSK_KAPPE = (aufdruck: string) => `På ett tyskt tangentbord står det ${aufdruck} på den.`;

/**
 * „Snabel-a: Alt Gr + 2. Euro: Alt Gr + E." - die zwei häufigsten Zeichen des
 * dritten Layers, gelesen aus der Tastatur selbst (`sv`: 2 und E). Leer, wenn
 * die Tastatur sie nicht über AltGr hat.
 */
function altGrBeispiele(layout: LayoutId, taste: string): string[] {
  const at = layoutById(layout).access["@"];
  const euro = layoutById(layout).access["€"];
  if (at?.mod !== "altgr" || euro?.mod !== "altgr") return [];
  return [`Snabel-a: ${taste} + ${kappe(at.base)}. Euro: ${taste} + ${kappe(euro.base)}.`];
}

/** Schwedische Sondertaste nach der Kennung aus dem Tasten-Wörterbuch. */
export function sondertasteSv(
  id: string,
  plattform: Plattform,
  layout: LayoutId = "sv",
): TastenErklaerung | null {
  const mac = plattform === "macos";
  const pfeilWort = mac ? "Alternativ" : "Ctrl";
  const sv = svensk(layout);
  switch (id) {
    case "tabulator":
      return {
        kurz: "Tabb",
        name: "Tabb-tangenten",
        was: [
          "hoppar till nästa element, till exempel en länk, ett fält eller en knapp.",
          "Med Skift hoppar den tillbaka till det förra.",
        ],
      };
    case "eingabe":
    case "zeilenschalter":
      return {
        kurz: "Retur",
        name: "Retur-tangenten",
        was: mac
          ? ["bekräftar och skickar.", "Den öppnar länkar och börjar en ny rad i en text."]
          : ["bekräftar och skickar.", "Den öppnar länkar, startar knappar och börjar en ny rad i en text."],
      };
    case "leertaste":
      return {
        kurz: null,
        name: "Mellanslag",
        was: ["gör ett mellanrum mellan två ord.", "Med den väljer du också knappar och kryssrutor."],
      };
    case "loeschtaste":
      return {
        kurz: null,
        name: mac ? "Radera-tangenten" : "Backsteg-tangenten",
        was: ["tar bort tecknet till vänster om markören.", "Så rättar du ett skrivfel."],
      };
    case "entf":
      return mac
        ? {
            kurz: null,
            name: "Radera framåt",
            was: [
              "tar bort tecknet till höger om markören.",
              "Om ditt tangentbord inte har den, trycker du på Fn och Radera samtidigt.",
            ],
          }
        : {
            kurz: "Delete",
            name: "Delete-tangenten",
            was: ["tar bort tecknet till höger om markören.", "Den tar också bort markerade filer.", TYSK_KAPPE("Entf")],
          };
    case "esc":
      return {
        kurz: "Esc",
        name: "Esc-tangenten",
        was: [
          "avbryter det som pågår just nu.",
          "Den stänger menyer, fönster och meddelanden.",
          "I Tastenflow tar den dig tillbaka till skrivfältet.",
        ],
      };
    case "umschalt":
      return {
        kurz: "Skift",
        name: "Skift-tangenten",
        was: sv
          ? [
              "så länge du håller ned den blir bokstäverna stora.",
              // ★ Glossar §4 Falle 1: å ä ö sind eigene Buchstaben mit eigener Taste.
              "På det svenska tangentbordet blir också å, ä och ö stora: Å, Ä och Ö.",
              "Den ger också det övre tecknet på en tangent, till exempel frågetecken.",
            ]
          : [
              "så länge du håller ned den blir bokstäverna stora.",
              "Den ger också det övre tecknet på en tangent, till exempel frågetecken.",
            ],
      };
    case "feststell": {
      const kurz = mac ? "Skiftlås" : "Caps Lock";
      return {
        kurz,
        name: `${kurz}-tangenten`,
        was: sv
          ? [
              "skriver allt med stora bokstäver tills du trycker på den igen.",
              // ★ Glossar §4 Falle 15: ein Weg, kein Fehler.
              "Då blir också å, ä och ö stora.",
            ]
          : ["skriver allt med stora bokstäver tills du trycker på den igen."],
      };
    }
    case "pfeil-links":
      return {
        kurz: null,
        name: "Vänsterpil",
        was: ["flyttar markören ett tecken åt vänster.", `Med ${pfeilWort} hoppar den över ett helt ord.`],
      };
    case "pfeil-rechts":
      return {
        kurz: null,
        name: "Högerpil",
        was: ["flyttar markören ett tecken åt höger.", `Med ${pfeilWort} hoppar den över ett helt ord.`],
      };
    case "pfeil-auf":
      return {
        kurz: null,
        name: "Uppåtpil",
        was: [
          "flyttar markören en rad uppåt.",
          "I listor och menyer går den till posten ovanför.",
          `Med ${pfeilWort} hoppar den ett helt stycke uppåt.`,
        ],
      };
    case "pfeil-ab":
      return {
        kurz: null,
        name: "Nedåtpil",
        was: [
          "flyttar markören en rad nedåt.",
          "I listor och menyer går den till posten nedanför.",
          `Med ${pfeilWort} hoppar den ett helt stycke nedåt.`,
        ],
      };
    case "pos1":
      return {
        kurz: "Home",
        name: "Home-tangenten",
        was: [
          "hoppar till början av raden.",
          "På en webbsida hoppar den högst upp.",
          "Med Ctrl hoppar den till början av hela texten.",
          TYSK_KAPPE("Pos 1"),
        ],
      };
    case "ende":
      return {
        kurz: "End",
        name: "End-tangenten",
        was: [
          "hoppar till slutet av raden.",
          "På en webbsida hoppar den längst ned.",
          "Med Ctrl hoppar den till slutet av hela texten.",
          TYSK_KAPPE("Ende"),
        ],
      };
    case "bild-auf":
      return {
        kurz: "Page Up",
        name: "Page Up-tangenten",
        was: ["rullar en skärmsida uppåt."],
      };
    case "bild-ab":
      return {
        kurz: "Page Down",
        name: "Page Down-tangenten",
        was: ["rullar en skärmsida nedåt."],
      };
    case "einfg":
      return {
        kurz: "Insert",
        name: "Insert-tangenten",
        was: [
          "är skärmläsarens tangent i NVDA och JAWS.",
          "Många kommandon för skärmläsaren börjar med den.",
          TYSK_KAPPE("Einfg"),
        ],
      };
    case "strg":
      return {
        kurz: "Ctrl",
        name: "Ctrl-tangenten",
        was: [
          "används för kortkommandon.",
          "Ctrl + C kopierar, Ctrl + V klistrar in, Ctrl + Z ångrar.",
          "När du trycker på den ensam tystnar rösten direkt.",
          TYSK_KAPPE("Strg"),
        ],
      };
    case "alt":
      return {
        kurz: null,
        name: "Alt-tangenten",
        was: [
          "används för kortkommandon.",
          "Alt + Tabb växlar mellan fönster.",
          "I Tastenflow öppnar Alt + H hjälpen.",
        ],
      };
    case "altgr":
      // Ohne Kurzform: „Alt Gr, Alt Gr-tangenten" sagte dasselbe zweimal.
      return {
        kurz: null,
        name: "Alt Gr-tangenten",
        was: ["skriver det tredje tecknet på en tangent, till exempel snabel-a eller euro.", ...altGrBeispiele(layout, "Alt Gr")],
      };
    case "windows-taste":
      return {
        kurz: "Win",
        name: "Windows-tangenten",
        was: [
          "öppnar Start-menyn.",
          "Tryck på den en gång till, så stängs menyn.",
          "Tillsammans med andra tangenter gör den andra saker, till exempel visar Win + D skrivbordet.",
        ],
      };
    case "befehlstaste":
      return {
        kurz: "Kmd",
        name: "Kommando-tangenten",
        was: ["används för kortkommandon.", "Kmd + C kopierar, Kmd + V klistrar in, Kmd + Z ångrar."],
      };
    case "wahltaste":
      return {
        kurz: "Alternativ",
        name: "Alternativ-tangenten",
        was: ["skriver fler tecken, till exempel snabel-a eller euro.", "Med piltangenterna hoppar den över hela ord."],
      };
    case "ctrl":
      return {
        kurz: "Kontroll",
        name: "Kontroll-tangenten",
        was: ["används på Mac för kortkommandon.", "När du trycker på den ensam tystnar VoiceOver."],
      };
    case "fn":
      return {
        kurz: "Fn",
        name: "Fn-tangenten",
        was: ["ger andra tangenter en extra uppgift, till exempel att ändra ljudvolymen."],
      };
    default:
      return null;
  }
}

/**
 * Wie die Taste in einer KOMBINATION und gross in der Mitte heisst - kurz,
 * wie sie auf der Kappe steht („Ctrl + Home", „Skift + Tabb"), Glossar §2.9.
 */
export const TASTE_KURZ_SV: Readonly<Record<string, string>> = {
  tabulator: "Tabb",
  eingabe: "Retur",
  zeilenschalter: "Retur",
  leertaste: "Mellanslag",
  loeschtaste: "Backsteg",
  entf: "Delete",
  esc: "Esc",
  umschalt: "Skift",
  feststell: "Caps Lock",
  "pfeil-links": "Vänsterpil",
  "pfeil-rechts": "Högerpil",
  "pfeil-auf": "Uppåtpil",
  "pfeil-ab": "Nedåtpil",
  pos1: "Home",
  ende: "End",
  "bild-auf": "Page Up",
  "bild-ab": "Page Down",
  einfg: "Insert",
  strg: "Ctrl",
  alt: "Alt",
  altgr: "Alt Gr",
  "windows-taste": "Win",
  befehlstaste: "Kmd",
  wahltaste: "Alternativ",
  ctrl: "Kontroll",
  fn: "Fn",
};

/* ══ Tasten ausserhalb des Wörterbuchs ═════════════════════════════════════ */

const F_TANGENTER_WINDOWS_SV: Readonly<Record<string, readonly string[]>> = {
  F1: ["öppnar hjälpen i många program."],
  F2: ["byter namn på den markerade filen."],
  F3: ["startar en sökning."],
  F4: ["stänger ett fönster tillsammans med Alt."],
  F5: ["läser in webbsidan igen.", "Här händer ingenting, du kan fortsätta utforska."],
  F6: ["går till webbläsarens adressfält."],
  F7: ["kontrollerar stavningen i Word."],
  F10: ["går till menyraden i många program."],
  F11: ["slår på och av helskärm i webbläsaren.", "På en bärbar dator ofta tillsammans med Fn."],
  F12: ["öppnar fönstret Spara som i Word."],
};

const SYNS_SEN_SV = "Tecknet syns först med nästa bokstav.";

/** Schwedisch zu `nachKey` - F-Tasten, Num Lock, Menü-Taste, Lautstärke, Totaste. */
export function nachKeySv(
  key: string,
  plattform: Plattform,
  layout: LayoutId = "sv",
): TastenErklaerung | null {
  const f = /^F([1-9]|1[0-9]|2[0-4])$/.exec(key);
  if (f) {
    const was =
      plattform === "macos"
        ? ["har en egen uppgift i vissa program.", "På Mac ändrar de här tangenterna ofta ljusstyrka och ljudvolym."]
        : (F_TANGENTER_WINDOWS_SV[key] ?? ["har en egen uppgift i vissa program."]);
    return { kurz: key, name: "funktionstangent", was };
  }
  switch (key) {
    case "Home":
      return sondertasteSv("pos1", "windows", layout);
    case "End":
      return sondertasteSv("ende", "windows", layout);
    case "PageUp":
      return sondertasteSv("bild-auf", "windows", layout);
    case "PageDown":
      return sondertasteSv("bild-ab", "windows", layout);
    case "Insert":
      return sondertasteSv("einfg", "windows", layout);
    case "NumLock":
      return {
        kurz: null,
        name: "Num Lock-tangenten",
        was: ["slår på och av siffrorna på det numeriska tangentbordet."],
      };
    // ★ Testerin 24.10.2026: Numpad 5 bei Num aus (`Clear`) - Vorgabe, ungeprüft von Muttersprachlern.
    case "Clear":
      return {
        kurz: "5",
        name: "tangenten 5 på det numeriska tangentbordet",
        was: ["skriver 5 när Num Lock är på.", "Just nu är Num Lock av, därför gör den ingenting."],
      };
    case "ContextMenu":
      return {
        kurz: null,
        name: "Menytangenten",
        was: ["öppnar en meny med kommandon för stället där du är just nu.", "Skift + F10 gör samma sak."],
      };
    case "PrintScreen":
      return {
        kurz: null,
        name: "Print Screen-tangenten",
        was: ["tar en bild av skärmen.", "I Windows öppnar den ofta ett verktyg för skärmbilder.", "Esc stänger det."],
      };
    case "ScrollLock":
      return { kurz: null, name: "Scroll Lock-tangenten", was: ["används nästan aldrig i dag."] };
    case "Pause":
      return { kurz: null, name: "Pause-tangenten", was: ["används nästan aldrig i dag."] };
    case "AudioVolumeUp":
      return { kurz: null, name: "tangenten för högre volym", was: ["höjer ljudet."] };
    case "AudioVolumeDown":
      return { kurz: null, name: "tangenten för lägre volym", was: ["sänker ljudet."] };
    case "AudioVolumeMute":
      return { kurz: null, name: "tangenten för ljud av", was: ["stänger av ljudet och sätter på det igen."] };
    case "Fn":
      return sondertasteSv("fn", plattform, layout);
    case "Dead":
      // ★ `layouts.ts` SV: ´ (rechts neben +, mit Skift `) und ¨ (rechts neben å, mit Skift ^, mit Alt Gr ~) sind
      // Totasten. `TOTASTEN` in `tastenErklaerung.ts` kennt `sv` (noch) nicht - darum kommt JEDE schwedische Totaste
      // hierher; der Satz nennt beide Tasten, ohne zu raten, welche gedrückt wurde (Glossar §2.9, Totasten-Hinweis).
      return {
        kurz: null,
        name: "död tangent",
        was: svensk(layout)
          ? [
              "sätter ett tecken på nästa bokstav: tryck på ´ och sedan på e, då blir det é.",
              "På det svenska tangentbordet är ´ till höger om plus och ¨ till höger om å döda tangenter.",
              SYNS_SEN_SV,
            ]
          : ["sätter ett tecken på nästa bokstav, till exempel en accent på e.", SYNS_SEN_SV],
      };
    default:
      return null;
  }
}

/* ══ Totasten mit Zusatzbezeichnung ═════════════════════════════════════════ */

/**
 * Die vier bekannten Akzente - nach derselben Kennung wie die deutsche Tabelle.
 * Auf der schwedischen Tastatur sind akut accent (´) und trema (¨) solche
 * Totasten (dazu mit Skift grav accent und cirkumflex). Namen wie §2.8.
 */
export const AKZENTE_SV: Readonly<Record<"zirkumflex" | "akut" | "gravis" | "trema", { name: string; was: readonly string[] }>> = {
  zirkumflex: {
    name: "cirkumflex",
    was: ["sätter en liten hatt på nästa bokstav, till exempel ê.", SYNS_SEN_SV],
  },
  akut: {
    name: "akut accent",
    was: ["sätter ett streck snett uppåt åt höger på nästa bokstav, till exempel é.", SYNS_SEN_SV],
  },
  gravis: {
    name: "grav accent",
    was: ["sätter ett streck snett uppåt åt vänster på nästa bokstav, till exempel è.", SYNS_SEN_SV],
  },
  trema: {
    name: "trema",
    was: ["sätter två prickar på nästa bokstav, till exempel ë.", SYNS_SEN_SV],
  },
};

/* ══ Zeichen ════════════════════════════════════════════════════════════════ */

const PROGRAMMERING_SV = ["behövs när du programmerar."] as const;

/** Die tschechischen Buchstaben (dieselben Schlüssel wie `ZEICHEN_CS`, ohne é): ein Wort, in dem sie stehen. */
const TJECKISKA: readonly (readonly [string, string])[] = [
  ["ě", "děti"],
  ["š", "škola"],
  ["č", "čaj"],
  ["ř", "řeka"],
  ["ž", "žába"],
  ["ý", "malý"],
  ["á", "máma"],
  ["í", "míč"],
  ["ú", "úkol"],
  ["ů", "dům"],
  ["ď", "loď"],
  ["ť", "chuť"],
  ["ň", "kůň"],
  ["ó", "móda"],
];

/**
 * Dieselben Zeichen wie `ZEICHEN_CS` (jeder Schlüssel), dazu die schwedischen
 * Buchstaben å ä ö: wo sie liegen und - ohne zu werten - das Wortpaar, das mit
 * einem a oder o ein ANDERES Wort ergibt (Glossar §4 Falle 1: får/far, är/ar).
 * Der Name kommt aus {@link NAMEN_SV}; `name` steht nur, wo er anders heissen soll.
 */
export const ZEICHEN_SV: Readonly<Record<string, { name?: string; was: readonly string[] }>> = {
  ".": { was: ["avslutar en mening."] },
  ",": { was: ["skiljer delar av en mening åt."] },
  "?": { was: ["avslutar en fråga."] },
  "!": { was: ["avslutar ett utrop."] },
  ":": { was: ["inleder något, till exempel en uppräkning."] },
  ";": { was: ["skiljer två delar av en mening åt, starkare än ett komma."] },
  "-": { was: ["binder ihop ord, till exempel i e-post.", "I räkning betyder det minus."] },
  "@": { was: ["finns i varje e-postadress."] },
  "+": { was: ["betyder plus i räkning.", "I ett kortkommando betyder det: tryck samtidigt."] },
  "*": { was: ["betyder gånger på datorn."] },
  "/": { was: ["betyder delat med på datorn.", "Det finns också i webbadresser."] },
  "=": { was: ["står före svaret i en uträkning."] },
  "'": { was: ["används sällan i svenska, du hittar den i engelska ord och i namn."] },
  '"': { was: ["står före och efter det som någon säger."] },
  "«": { was: ["inleder ett citat i texter från andra länder."] },
  "»": { was: ["avslutar ett citat i texter från andra länder."] },
  "(": { was: ["inleder en parentes."] },
  ")": { was: ["avslutar en parentes."] },
  "%": { was: ["betyder hundradelar, till exempel 50 %."] },
  "&": { was: ["betyder och."] },
  "#": { was: ["står före ett nummer, till exempel #1, och används för hashtaggar."] },
  "€": { was: ["är tecknet för valutan euro."] },
  $: { was: ["är tecknet för dollar."] },
  "£": { was: ["är tecknet för pund."] },
  "§": { was: ["står tillsammans med ett nummer för en paragraf i en lag."] },
  "°": { was: ["betyder grader, till exempel för temperatur."] },
  "<": { was: ["jämför två tal: det till vänster är mindre."] },
  ">": { was: ["jämför två tal: det till vänster är större."] },
  _: { was: ["finns ofta i e-postadresser och filnamn."] },
  "^": { was: ["betyder upphöjt till i matematik, till exempel 2 upphöjt till 3."] },
  "²": { was: ["används för ytor, till exempel kvadratmeter."] },
  "³": { was: ["används för volymer, till exempel kubikmeter."] },
  "[": { was: PROGRAMMERING_SV },
  "]": { was: PROGRAMMERING_SV },
  "{": { was: PROGRAMMERING_SV },
  "}": { was: PROGRAMMERING_SV },
  "\\": { was: PROGRAMMERING_SV },
  "|": { was: PROGRAMMERING_SV },
  "~": { was: PROGRAMMERING_SV },
  "´": { was: ["sätter en accent på nästa bokstav, till exempel é."] },
  "ˇ": { was: ["sätter en hake på nästa bokstav, till exempel č."] },
  "`": { was: ["sätter en grav accent på nästa bokstav, till exempel è."] },
  "¨": { was: ["sätter två prickar på nästa bokstav, till exempel ë."] },
  // Die Ziffern (wie `ZEICHEN_CS`): mit Namen „siffran 2", und wo sie liegen - auf der schwedischen Tastatur ohne
  // Skift (anders als Tschechisch); der Satz endet nicht mit der Ziffer.
  ...Object.fromEntries(
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].map((ziffer) => [
      ziffer,
      { name: `siffran ${ziffer}`, was: ["finns på sifferraden ovanför bokstäverna och på det numeriska tangentbordet."] },
    ]),
  ),
  // ★★★ å ä ö - eigene Buchstaben (Glossar §4 Falle 1), mit eigener Taste auf der schwedischen Tastatur (`layouts.ts` SV).
  å: {
    was: [
      "är en egen bokstav i svenska, till exempel i båt och på.",
      "Med a blir det ett annat ord: får och far.",
      "På det svenska tangentbordet har den en egen tangent till höger om P.",
    ],
  },
  ä: {
    was: [
      "är en egen bokstav i svenska, till exempel i äpple och här.",
      "Med a blir det ett annat ord: är och ar.",
      "På det svenska tangentbordet har den en egen tangent på grundraden, till höger om Ö.",
    ],
  },
  ö: {
    was: [
      "är en egen bokstav i svenska, till exempel i öga och snö.",
      "Med o blir det ett annat ord: för och for.",
      "På det svenska tangentbordet ligger den på grundraden till höger om L, under höger lillfinger.",
    ],
  },
  // é - Glossar §2.9 Totasten-Hinweis (Bauplan S19): Totaste ´, dann e. Ein Anschlag der Totaste ist nie ein Fehler.
  é: {
    was: [
      "finns i några svenska ord, till exempel idé och kafé.",
      "Du skriver den med den döda tangenten ´: tryck på ´ och sedan på e.",
    ],
  },
  // Die tschechischen Buchstaben mit Zeichen (dieselben Schlüssel wie `ZEICHEN_CS`).
  ...Object.fromEntries(TJECKISKA.map(([b, wort]) => [b, { was: [`är en bokstav i tjeckiska, till exempel i ordet ${wort}.`] }])),
};

/** Der schwedische Name eines Zeichens - aus der Tabelle, sonst der Grossbuchstabe („stort A") oder das Zeichen selbst. */
export function zeichenNameSv(ch: string): string {
  return ZEICHEN_SV[ch]?.name ?? NAMEN_SV[ch] ?? grossName(ch) ?? ch;
}

/* ══ Kombinationen ═════════════════════════════════════════════════════════ */

/** Wo eine Wirkung gilt - schwedisch, klein, mit „i" davor (Programmnamen wie bei Microsoft sv-se). */
export const ORT_SV: Readonly<Record<string, string>> = {
  explorer: "i Utforskaren",
  finder: "i Finder",
  word: "i Word",
  excel: "i Excel",
  browser: "i webbläsaren",
  teams: "i Teams",
  powerpoint: "i PowerPoint",
  outlook: "i Outlook",
  bedienungshilfen: "i skärmläsaren",
};

/** Die kleine eigene Liste der deutschen Datei, schwedisch (die Tasten bleiben in der Form des Parsers). */
export const EIGENE_KOMBINATIONEN_SV: Readonly<Record<Plattform, readonly { keys: string; was: string }[]>> = {
  windows: [
    { keys: "Umschalt+Tab", was: "hoppar tillbaka till det förra elementet." },
    { keys: "Strg+P", was: "öppnar fönstret för utskrift." },
  ],
  macos: [
    { keys: "Umschalt+Tab", was: "hoppar tillbaka till det förra elementet." },
    { keys: "Cmd+P", was: "öppnar fönstret för utskrift." },
  ],
};

/**
 * Was ein Kürzel BEWIRKT - schwedisch, nach der Kennung der Wirkung im
 * Kürzel-Katalog von »Im Griff« (`lib/computer/kuerzelWirkung.ts`, dort nur
 * gelesen). Imperativ wie in den Menüs von Windows und Office sv-se
 * („Kopiera", „Klistra in", „Spara som", Glossar Regel 2).
 */
export function wirkungSv(id: string, _plattform: Plattform): string | null {
  return WIRKUNG_SV[id] ?? null;
}

const WIRKUNG_SV: Readonly<Record<string, string>> = {
  kopieren: "Kopiera",
  einfuegen: "Klistra in",
  ausschneiden: "Klipp ut",
  rueckgaengig: "Ångra",
  wiederherstellen: "Gör om det som ångrades",
  "alles-markieren": "Markera allt",
  "markieren-zeichen": "Markera tecken för tecken",
  "markieren-wort": "Markera ord för ord",
  "spalte-markieren": "Markera hela kolumnen",
  "zeile-markieren": "Markera hela raden",
  oeffnen: "Öppna",
  umbenennen: "Byt namn",
  "neuer-ordner": "Skapa en ny mapp",
  papierkorb: "Flytta till papperskorgen",
  duplizieren: "Skapa en kopia av samma fil",
  "ebene-hoeher": "Gå upp en nivå",
  adressleiste: "Gå till adressfältet",
  eigenschaften: "Visa egenskaper",
  uebersicht: "Visa en förhandsgranskning, alltså en titt i filen utan att öppna den",
  bewegen: "Flytta filen dit den ska (den försvinner från den gamla platsen)",
  "ansicht-details": "Byt till vyn Detaljer",
  speichern: "Spara",
  "speichern-unter": "Spara som, med ett annat namn eller på en annan plats",
  fett: "Fetstil",
  kursiv: "Kursiv stil",
  unterstreichen: "Understrykning",
  ueberschrift1: "Använd formatet Rubrik 1 för huvudrubriken",
  ueberschrift2: "Använd formatet Rubrik 2 för en underrubrik",
  "standard-format": "Använd formatet Normal",
  links: "Vänsterjustera",
  zentriert: "Centrera",
  zeilenumbruch: "Börja en ny rad i samma stycke",
  rechtschreibung: "Kontrollera stavningen",
  fensterbereiche: "Växla mellan delarna i fönstret",
  suchen: "Sök",
  ersetzen: "Sök och ersätt",
  "gehe-zu-zelle": "Gå till en vald cell",
  "zelle-bearbeiten": "Fortsätt skriva i cellen",
  "zelle-formatieren": "Öppna fönstret Formatera celler",
  "zum-rand": "Gå till kanten av data",
  autosumme: "Infoga Autosumma",
  "ausfuellen-unten": "Fyll nedåt",
  "ausfuellen-rechts": "Fyll åt höger",
  "absoluter-bezug": "Lås referensen (absolut referens med dollartecken)",
  datum: "Infoga dagens datum",
  uhrzeit: "Infoga aktuell tid",
  kommentar: "Infoga en kommentar",
  autofilter: "Slå på eller av Autofilter",
  blattwechsel: "Gå till ett annat blad",
  "neues-blatt": "Infoga ett nytt blad",
  "neu-laden": "Uppdatera sidan",
  lesezeichen: "Lägg till ett bokmärke",
  verlauf: "Öppna historiken",
  senden: "Skicka meddelandet",
  "nachricht-loeschen": "Ta bort meddelandet",
  "sr-stopp": "Sluta läsa upp",
};

/** „a, b och c" - die schwedische Aufzählung (kein Komma vor „och", Glossar Regel 8, §2.10). */
export function aufzaehlungSv(teile: readonly string[]): string {
  if (teile.length <= 1) return teile[0] ?? "";
  return `${teile.slice(0, -1).join(", ")} och ${teile[teile.length - 1]}`;
}

/** Die Form der festen Wörter - die englische Tabelle ist `as const`, darum hier die breite Form. */
interface ErkundenWoerterSv {
  readonly kombination: string;
  readonly kombiUnbekannt: string;
  readonly mit: string;
  readonly akzentTaste: string;
  readonly unbekannt: string;
  readonly taste: (key: string) => string;
}

/**
 * Die festen Wörter des Erkundens, schwedisch. `mit` steht vor dem Weg über
 * den dritten Layer („Med Alt Gr + 2."); Schwedisch verrät dabei kein Geschlecht.
 */
export const ERKUNDEN_WOERTER_SV: ErkundenWoerterSv = {
  kombination: "kortkommando",
  kombiUnbekannt: "vad det gör beror på programmet.",
  mit: "Med",
  akzentTaste: "död tangent",
  unbekannt: "Den här tangenten känner jag inte igen.",
  taste: (key: string) => `Tangenten ${key}`,
};

/** Alles, was „Utforska tangenterna" auf Schwedisch sagt (Form: `tastenErklaerungSatz.ts`). */
export const TASTEN_SATZ_SV: TastenErklaerungSatz = {
  sondertaste: sondertasteSv,
  nachKey: nachKeySv,
  tasteKurz: TASTE_KURZ_SV,
  zeichen: ZEICHEN_SV,
  zeichenName: zeichenNameSv,
  akzente: AKZENTE_SV,
  erkundenWoerter: ERKUNDEN_WOERTER_SV,
  eigeneKombinationen: EIGENE_KOMBINATIONEN_SV,
  wirkung: wirkungSv,
  ort: ORT_SV,
  aufzaehlung: aufzaehlungSv,
  aufdruckGross: (key) => {
    const gross = key.toLocaleUpperCase("sv-SE");
    return gross.length === key.length ? gross : key;
  },
};

/* ══ „Hitta tangenterna" ═══════════════════════════════════════════════════
 *
 * Die Sätze der Suchrunde (`lib/computer/tastenSuche.ts`) schwedisch - WAS
 * geschieht, entscheidet weiter `suchSchritt`; hier wird nur gesagt.
 * Schwedisch kennt keine Fälle: EINE Form je Taste („tangenten Tabb",
 * „Vänsterpil") - das Kopfwort davor hält den Namen ungebeugt (Regel 12/13).
 * ═══════════════════════════════════════════════════════════════════════════ */

interface TangentSv {
  /** Im Satz - „tangenten Tabb", „Vänsterpil". */
  namn: string;
  /** Wo sie liegt - als Weg für eine Hand, nie als Bild. */
  lage: string;
  /** Zusatz nach der Bestätigung (heute nur Caps Lock). */
  achtung?: string;
}

/** Eine Taste mit ihrer Kappe - „tangenten" davor, damit der Name ungebeugt bleibt (Regel 12). */
function tangent(kappeName: string, lage: string, achtung?: string): TangentSv {
  const e = { namn: `tangenten ${kappeName}`, lage };
  return achtung ? { ...e, achtung } : e;
}

const SEX_TANGENTER_SV = "I blocket med sex tangenter ovanför piltangenterna";
const PILAR_SV = "Längst ned till höger, bland piltangenterna";
const BAERBAR_FN_SV = "På en bärbar dator ofta med Fn.";

/** Die Tasten der Suchrunde, schwedisch - nach derselben Kennung wie das Wörterbuch. */
const TANGENTER_SV: Readonly<Record<string, TangentSv | ((plattform: Plattform) => TangentSv)>> = {
  tabulator: tangent("Tabb", "Vänster lillfinger: en rad upp, längst ut."),
  "pfeil-links": { namn: "Vänsterpil", lage: `${PILAR_SV}: den till vänster.` },
  "pfeil-rechts": { namn: "Högerpil", lage: `${PILAR_SV}: den till höger.` },
  "pfeil-auf": { namn: "Uppåtpil", lage: `${PILAR_SV}: den översta.` },
  "pfeil-ab": { namn: "Nedåtpil", lage: `${PILAR_SV}: under Uppåtpil.` },
  pos1: tangent("Home", `${SEX_TANGENTER_SV}, överst i mitten. ${BAERBAR_FN_SV}`),
  ende: tangent("End", `${SEX_TANGENTER_SV}, nederst i mitten. ${BAERBAR_FN_SV}`),
  "bild-auf": tangent("Page Up", `${SEX_TANGENTER_SV}, överst till höger. ${BAERBAR_FN_SV}`),
  "bild-ab": tangent("Page Down", `${SEX_TANGENTER_SV}, nederst till höger. ${BAERBAR_FN_SV}`),
  leertaste: tangent("Mellanslag", "Den långa tangenten under dina tummar."),
  eingabe: tangent("Retur", "Höger hand, längst ut: den stora tangenten."),
  zeilenschalter: tangent("Retur", "Höger hand, längst ut: den stora tangenten."),
  loeschtaste: (plattform) =>
    tangent(plattform === "macos" ? "Radera" : "Backsteg", "Höger hand, längst ut, två rader upp."),
  entf: (plattform) =>
    plattform === "macos"
      ? tangent("Radera framåt", "Bara på stora tangentbord, bredvid Retur. Annars Fn och Radera.")
      : tangent("Delete", `${SEX_TANGENTER_SV}, nederst till vänster. På en bärbar dator överst till höger.`),
  esc: tangent("Esc", "Längst upp i vänstra hörnet."),
  umschalt: tangent("Skift", "Det finns två: till vänster och till höger på den nedersta raden."),
  feststell: (plattform) =>
    tangent(
      plattform === "macos" ? "Skiftlås" : "Caps Lock",
      "Vänster lillfinger: ett steg åt vänster.",
      "Blir allt bara stora bokstäver nu? Tryck på den en gång till.",
    ),
  strg: tangent("Ctrl", "Längst ned i vänstra hörnet."),
  alt: tangent("Alt", "Längst ned, till vänster om Mellanslag."),
  altgr: tangent("Alt Gr", "Längst ned, till höger om Mellanslag."),
  "windows-taste": { namn: "Windows-tangenten", lage: "Längst ned till vänster, mellan Ctrl och Alt." },
  einfg: tangent("Insert", `${SEX_TANGENTER_SV}, överst till vänster, ovanför Delete. Saknas ofta på bärbara datorer.`),
  befehlstaste: tangent("Kommando", "Längst ned till vänster, precis bredvid Mellanslag."),
  wahltaste: tangent("Alternativ", "Längst ned till vänster, den tredje tangenten från kanten."),
  ctrl: tangent("Kontroll", "Längst ned till vänster, den andra tangenten från kanten."),
  fn: tangent("Fn", "Längst ned till vänster, den första tangenten i hörnet. På en MacBook står det fn på den."),
};

function tangentSv(t: TastenName, plattform: Plattform): TangentSv {
  const e = TANGENTER_SV[t.id];
  if (typeof e === "function") return e(plattform);
  // Sicherheitsnetz: eine neue Wörterbuch-Taste ohne schwedischen Eintrag -
  // „tangenten" davor, damit der Name ungebeugt bleibt.
  return e ?? tangent(t.kurz ?? t.name, "");
}

/** „tangenten Tabb", „Vänsterpil" - wie eine Taste im Satz heisst. */
export function tastenNennungSv(t: TastenName, plattform: Plattform): string {
  return tangentSv(t, plattform).namn;
}

/** Nur die Lage - oder "" (wie bei den anderen Sprachen). */
export function tastenLageSv(t: TastenName, plattform: Plattform): string {
  return tangentSv(t, plattform).lage;
}

/** Der Auftrag beim Suchen: „Hitta tangenten Tabb. Vänster lillfinger: ..." */
export function ansageSuchauftragSv(t: TastenName, plattform: Plattform): string {
  const e = tangentSv(t, plattform);
  return e.lage ? `Hitta ${e.namn}. ${e.lage}` : `Hitta ${e.namn}.`;
}

/** Erster Treffer - erst die Wiederholung zählt („Där är den!" passt zu jeder Taste). */
export function ansageGefundenSv(t: TastenName, plattform: Plattform): string {
  return `Där är den! Tryck på en annan tangent och sedan på ${tastenNennungSv(t, plattform)} en gång till.`;
}

/** Nach der Bestätigung - und, wo nötig, die Warnung (Caps Lock). */
export function ansageBestaetigtSv(t: TastenName, plattform: Plattform): string {
  const e = tangentSv(t, plattform);
  return e.achtung ? `Rätt! ${e.achtung}` : "Rätt!";
}

/** Eine Taste, die hier nicht geübt wird. */
export const ANSAGE_UNBEKANNT_SV = "Den här tangenten ingår inte i övningen.";

/** „Hittade tangenter: 20/20. Bra jobbat." - die Zahl nach dem Doppelpunkt (Glossar Regel 6). */
export function alleGefundenSv(anzahl: number): string {
  return `Hittade tangenter: ${anzahl}/${anzahl}. Bra jobbat.`;
}

/**
 * Der Satz zu einem Schritt der Suchrunde - schwedisch. `art` und `naechste`
 * kommen unverändert aus `suchSchritt`; nur die Wörter sind neu.
 */
export function suchSatzSv(
  art: "daneben" | "gefunden" | "weiter" | "fertig",
  taste: TastenName | null,
  suchbar: readonly TastenName[],
  index: number,
  plattform: Plattform,
): string {
  const gesucht = suchbar[index]!;
  switch (art) {
    case "daneben": {
      const g = tangentSv(gesucht, plattform);
      if (!taste) return `${ANSAGE_UNBEKANNT_SV} Hitta ${g.namn}.`;
      return `Du tryckte på ${tastenNennungSv(taste, plattform)}. Hitta ${g.namn}.${g.lage ? ` ${g.lage}` : ""}`;
    }
    case "gefunden":
      return ansageGefundenSv(gesucht, plattform);
    case "fertig":
      return `${ansageBestaetigtSv(gesucht, plattform)} ${alleGefundenSv(suchbar.length)}`;
    case "weiter":
      return `${ansageBestaetigtSv(gesucht, plattform)} ${ansageSuchauftragSv(suchbar[index + 1]!, plattform)}`;
  }
}
