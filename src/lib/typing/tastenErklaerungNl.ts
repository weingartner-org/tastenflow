/**
 * ★ G3c-VERTEILER (25.10.2026), gefüllt 29.10.2026: DIE TASTEN IN NIEDERLÄNDISCH - „Toetsen verkennen", Tastennamen,
 * „Toetsen zoeken". Eigene niederländische Sätze, Satz für Satz an `tastenErklaerungEn.ts` geprüft (dieselbe
 * Information), Form wie `tastenErklaerungCs.ts`.
 *
 * Was hier steht, liest der Verteiler `tastenErklaerung.ts` über {@link TASTEN_SATZ_NL} (Form: `tastenErklaerungSatz.ts`),
 * die Bauteile `LetterMap.tsx`, `PupilStatsPanel.tsx`, `TastenflowReiter.tsx` über {@link unitLabelNl} und `TastenErkunden.tsx`
 * über {@link suchSatzNl}. Wächter: `tests/tastenflow-tasten-erklaerung-nl.test.ts`.
 *
 * ── Glossar `recherche-niederländisch-2026-10-25/GLOSSAR-nl.md` ─────────────
 *  · §1 Regel 1: das Kind wird mit **je** angesprochen, Befehlsform („druk op", „zoek").
 *  · §2.9: Kappen tragen in NL (US-International) und Flandern (Belgisch AZERTY) die ENGLISCHEN Namen - Shift, Caps Lock,
 *    Enter (Mac Return), Backspace (Mac Delete), Delete (Mac Fn + Delete), Tab, Ctrl (Mac Control), Alt, **Alt Gr**,
 *    Option, Command, Fn, Esc, Home, End, Page Up, Page Down, Insert. Niederländisch nur **spatiebalk**, die
 *    **pijltoetsen** (pijl naar links / naar rechts / omhoog / omlaag), **Windows-toets**, **menutoets**.
 *    Nie die Microsoft-nl-Namen „Startpagina" (Home) und „Invoegen" (Insert) - §4 Falle 5.
 *  · §1 Regel 12: zusammengesetzt mit Bindestrich („Shift-toets"), bei zwei Wörtern das Kopfwort davor („toets Caps Lock").
 *  · §2.8: die Zeichennamen der Sprachausgabe (punt, komma, koppelteken, apenstaartje …) und die Akzentbuchstaben
 *    („e met trema", „hoofdletter A"). `ZEICHENNAMEN_NL` ist heute leer und fiele auf Englisch zurück - darum stehen die
 *    Namen HIER ({@link NAMEN_NL}); ein späterer Eintrag dort gilt nur für Zeichen, die hier fehlen.
 *  · Nur Bindestrich `-`. Keine Maus-Wörter (klik, tik, muis). Kein „hij/ze" für eine Taste: „deze toets", „hiermee".
 *  · Kein Satz endet mit einer Ziffer und Punkt (Hausregel) - darum auch die Ziffern mit eigenem Satz.
 *  · `be` (Belgisch AZERTY): Ziffern nur mit Shift; Caps Lock gibt dort auf der Ziffernreihe die Ziffern (§4 Falle 6).
 *  · `nl-intl`: ' und " sind dode toetsen (§2.9 Totasten-Hinweis).
 */
import type { Plattform } from "../computer/model";
import type { TastenName } from "../computer/tastenNamen";
import { spokenLabel } from "./fingers";
import { unitKind, type unitLabelEn } from "./letters";
import { layoutById, type LayoutId } from "./layouts";
import type { TastenErklaerung } from "./tastenErklaerung";
import type { TastenErklaerungSatz } from "./tastenErklaerungSatz";
import { ZEICHENNAMEN_NL } from "./zeichenNamenNl";

/* ══ Sondertasten ═══════════════════════════════════════════════════════════ */

/** „Op een Duits toetsenbord staat er Strg op." - nur bei eingestellter deutscher Tastatur (wie Englisch). */
function duitseKap(layout: LayoutId, wort: string): string[] {
  return layout === "de" ? [`Op een Duits toetsenbord staat er ${wort} op.`] : [];
}

/** Der Name einer Kappe nach „Alt Gr +" - lateinische Buchstaben gross, sonst wie auf der Kappe. */
function kappe(key: string): string {
  return /^[a-z]$/.test(key) ? key.toUpperCase() : key;
}

/**
 * „Alt Gr + é typt het apenstaartje. Alt Gr + E typt de euro." - gelesen aus der Tastatur selbst (`be`: é und E,
 * `nl-intl`: nur die Euro auf 5). Die Sätze enden nie mit der Ziffer.
 */
function altGrVoorbeelden(layout: LayoutId): string[] {
  const access = layoutById(layout).access;
  const uit: string[] = [];
  const at = access["@"];
  const euro = access["€"];
  if (at?.mod === "altgr") uit.push(`Alt Gr + ${kappe(at.base)} typt het apenstaartje.`);
  if (euro?.mod === "altgr") uit.push(`Alt Gr + ${kappe(euro.base)} typt de euro.`);
  return uit;
}

/** Niederländische Sondertaste nach der Kennung aus dem Tasten-Wörterbuch. */
export function sondertasteNl(
  id: string,
  plattform: Plattform,
  layout: LayoutId = "nl-intl",
): TastenErklaerung | null {
  const mac = plattform === "macos";
  const pijlWoord = mac ? "Option" : "Ctrl";
  const belgisch = layout === "be";
  switch (id) {
    case "tabulator":
      return {
        kurz: null,
        name: "Tab-toets",
        was: [
          "gaat naar het volgende onderdeel, bijvoorbeeld naar een link, een tekstvak of een knop.",
          "Met Shift erbij ga je terug.",
        ],
      };
    case "eingabe":
    case "zeilenschalter":
      return mac
        ? {
            kurz: null,
            name: "Return-toets",
            was: ["bevestigt en verzendt.", "Hiermee open je links en begin je een nieuwe regel in een tekst."],
          }
        : {
            kurz: null,
            name: "Enter-toets",
            was: [
              "bevestigt en verzendt.",
              "Hiermee open je links, druk je op knoppen en begin je een nieuwe regel in een tekst.",
            ],
          };
    case "leertaste":
      return {
        kurz: null,
        name: "spatiebalk",
        was: ["zet een spatie tussen twee woorden.", "Hiermee druk je ook op knoppen en vink je vakjes aan."],
      };
    case "loeschtaste":
      return {
        kurz: null,
        name: mac ? "Delete-toets" : "Backspace-toets",
        was: ["wist het teken links van de cursor.", "Zo verbeter je een typfout."],
      };
    case "entf":
      return mac
        ? {
            kurz: null,
            name: "Delete-toets",
            was: [
              "wist het teken rechts van de cursor.",
              "Heeft je toetsenbord deze toets niet? Druk dan tegelijk op Fn en Delete.",
            ],
          }
        : {
            kurz: null,
            name: "Delete-toets",
            was: [
              "wist het teken rechts van de cursor.",
              "Hiermee verwijder je ook gekozen bestanden.",
              ...duitseKap(layout, "Entf"),
            ],
          };
    case "esc":
      return {
        kurz: null,
        name: "Esc-toets",
        was: [
          "breekt af wat er nu gebeurt.",
          "Hiermee sluit je menu's, vensters en meldingen.",
          "In Tastenflow brengt deze toets je terug naar het typveld.",
        ],
      };
    case "umschalt":
      return {
        kurz: null,
        name: "Shift-toets",
        was: [
          "typt hoofdletters zolang je de toets ingedrukt houdt.",
          "Ook geeft deze toets het bovenste teken op een toets, bijvoorbeeld het vraagteken.",
          ...(belgisch ? ["Op een Belgisch toetsenbord typ je cijfers met Shift."] : []),
        ],
      };
    case "feststell":
      return {
        kurz: null,
        name: "toets Caps Lock",
        was: [
          "typt alles in hoofdletters, tot je nog eens op deze toets drukt.",
          ...(belgisch ? ["Op een Belgisch toetsenbord typt de cijferrij dan cijfers, bijvoorbeeld 2 in plaats van é."] : []),
        ],
      };
    case "pfeil-links":
      return {
        kurz: null,
        name: "pijl naar links",
        was: ["zet de cursor een teken naar links.", `Met ${pijlWoord} erbij spring je een heel woord.`],
      };
    case "pfeil-rechts":
      return {
        kurz: null,
        name: "pijl naar rechts",
        was: ["zet de cursor een teken naar rechts.", `Met ${pijlWoord} erbij spring je een heel woord.`],
      };
    case "pfeil-auf":
      return {
        kurz: null,
        name: "pijl omhoog",
        was: [
          "zet de cursor een regel omhoog.",
          "In lijsten en menu's ga je een onderdeel omhoog.",
          `Met ${pijlWoord} erbij spring je een hele alinea omhoog.`,
        ],
      };
    case "pfeil-ab":
      return {
        kurz: null,
        name: "pijl omlaag",
        was: [
          "zet de cursor een regel omlaag.",
          "In lijsten en menu's ga je een onderdeel omlaag.",
          `Met ${pijlWoord} erbij spring je een hele alinea omlaag.`,
        ],
      };
    case "pos1":
      return {
        kurz: null,
        name: "Home-toets",
        was: [
          "springt naar het begin van de regel.",
          "Op een webpagina spring je hiermee helemaal naar boven.",
          "Met Ctrl erbij spring je naar het begin van de hele tekst.",
          ...duitseKap(layout, "Pos 1"),
        ],
      };
    case "ende":
      return {
        kurz: null,
        name: "End-toets",
        was: [
          "springt naar het einde van de regel.",
          "Op een webpagina spring je hiermee helemaal naar beneden.",
          "Met Ctrl erbij spring je naar het einde van de hele tekst.",
          ...duitseKap(layout, "Ende"),
        ],
      };
    case "bild-auf":
      return {
        kurz: "PgUp",
        name: "toets Page Up",
        was: ["gaat een scherm omhoog.", ...duitseKap(layout, "Bild ↑")],
      };
    case "bild-ab":
      return {
        kurz: "PgDn",
        name: "toets Page Down",
        was: ["gaat een scherm omlaag.", ...duitseKap(layout, "Bild ↓")],
      };
    case "einfg":
      return {
        kurz: null,
        name: "Insert-toets",
        was: [
          "is de toets van de schermlezer in NVDA en JAWS.",
          "Bijna elke opdracht van de schermlezer begint met deze toets.",
          ...duitseKap(layout, "Einfg"),
        ],
      };
    case "strg":
      return {
        kurz: null,
        name: "Ctrl-toets",
        was: [
          "is voor sneltoetsen.",
          "Ctrl + C kopieert, Ctrl + V plakt, Ctrl + Z maakt ongedaan.",
          "Druk je alleen op deze toets, dan zwijgt de stem meteen.",
          ...duitseKap(layout, "Strg"),
        ],
      };
    case "alt":
      return {
        kurz: null,
        name: "Alt-toets",
        was: [
          "is voor sneltoetsen.",
          "Alt + Tab wisselt tussen vensters.",
          "In Tastenflow opent Alt + H de hulp.",
        ],
      };
    case "altgr":
      // Ohne Kurzform: „Alt Gr, toets Alt Gr" sagte dasselbe zweimal.
      return {
        kurz: null,
        name: "toets Alt Gr",
        was: ["typt het derde teken op een toets, bijvoorbeeld het apenstaartje of de euro.", ...altGrVoorbeelden(layout)],
      };
    case "windows-taste":
      return {
        kurz: "Win",
        name: "Windows-toets",
        was: [
          "opent het menu Start.",
          "Druk nog eens om het menu te sluiten.",
          "Met andere toetsen erbij doet deze toets meer, bijvoorbeeld Win + D toont het bureaublad.",
        ],
      };
    case "befehlstaste":
      return {
        kurz: null,
        name: "Command-toets",
        was: ["is voor sneltoetsen.", "Command + C kopieert, Command + V plakt, Command + Z maakt ongedaan."],
      };
    case "wahltaste":
      return {
        kurz: null,
        name: "Option-toets",
        was: ["typt symbolen, bijvoorbeeld het apenstaartje.", "Met een pijltoets erbij spring je een heel woord."],
      };
    case "ctrl":
      return {
        kurz: null,
        name: "Control-toets",
        was: ["hoort op een Mac bij sneltoetsen.", "Druk je alleen op deze toets, dan zwijgt VoiceOver."],
      };
    case "fn":
      return {
        kurz: null,
        name: "Fn-toets",
        was: ["geeft andere toetsen een tweede taak, bijvoorbeeld het geluid harder en zachter zetten."],
      };
    default:
      return null;
  }
}

/**
 * Wie die Taste in einer KOMBINATION und gross in der Mitte heisst - kurz, wie auf der Kappe („Ctrl + Home",
 * „Shift + Tab"). Glossar §2.9.
 */
export const TASTE_KURZ_NL: Readonly<Record<string, string>> = {
  tabulator: "Tab",
  eingabe: "Enter",
  zeilenschalter: "Return",
  leertaste: "Spatiebalk",
  loeschtaste: "Backspace",
  entf: "Delete",
  esc: "Esc",
  umschalt: "Shift",
  feststell: "Caps Lock",
  "pfeil-links": "Pijl naar links",
  "pfeil-rechts": "Pijl naar rechts",
  "pfeil-auf": "Pijl omhoog",
  "pfeil-ab": "Pijl omlaag",
  pos1: "Home",
  ende: "End",
  "bild-auf": "Page Up",
  "bild-ab": "Page Down",
  einfg: "Insert",
  strg: "Ctrl",
  alt: "Alt",
  altgr: "Alt Gr",
  "windows-taste": "Win",
  befehlstaste: "Command",
  wahltaste: "Option",
  ctrl: "Control",
  fn: "Fn",
};

/* ══ Tasten ausserhalb des Wörterbuchs ═════════════════════════════════════ */

const F_TOETSEN_WINDOWS_NL: Readonly<Record<string, readonly string[]>> = {
  F1: ["opent in veel programma's de hulp."],
  F2: ["geeft een gekozen bestand een nieuwe naam."],
  F3: ["begint een zoekopdracht."],
  F4: ["sluit samen met Alt het venster."],
  F5: ["laadt een webpagina opnieuw.", "Hier gebeurt er niets, dus je kunt verder verkennen."],
  F6: ["springt naar de adresbalk van de browser."],
  F7: ["controleert in Word de spelling."],
  F10: ["springt in veel programma's naar de menubalk."],
  F11: ["zet in de browser het volledige scherm aan en uit.", "Op een laptop vaak samen met de Fn-toets."],
  F12: ["opent in Word het venster Opslaan als."],
};

const VERSCHIJNT_LATER_NL = "Het teken verschijnt pas met de volgende letter.";

/** Niederländisch zu `nachKey` - F-Tasten, Num Lock, Menü-Taste, Lautstärke, Totaste. */
export function nachKeyNl(
  key: string,
  plattform: Plattform,
  layout: LayoutId = "nl-intl",
): TastenErklaerung | null {
  const f = /^F([1-9]|1[0-9]|2[0-4])$/.exec(key);
  if (f) {
    const was =
      plattform === "macos"
        ? [
            "heeft in sommige programma's een eigen taak.",
            "Op een Mac regelen deze toetsen vaak de helderheid en het volume.",
          ]
        : (F_TOETSEN_WINDOWS_NL[key] ?? ["heeft in sommige programma's een eigen taak."]);
    return { kurz: key, name: "functietoets", was };
  }
  switch (key) {
    case "Home":
      return sondertasteNl("pos1", "windows", layout);
    case "End":
      return sondertasteNl("ende", "windows", layout);
    case "PageUp":
      return sondertasteNl("bild-auf", "windows", layout);
    case "PageDown":
      return sondertasteNl("bild-ab", "windows", layout);
    case "Insert":
      return sondertasteNl("einfg", "windows", layout);
    case "NumLock":
      return {
        kurz: null,
        name: "toets Num Lock",
        was: ["zet de cijfers op het numerieke toetsenblok aan en uit."],
      };
    // ★ Testerin 24.10.2026: Numpad 5 bei Num aus (`Clear`) - Vorgabe, ungeprüft von Muttersprachlern.
    case "Clear":
      return {
        kurz: "5",
        name: "toets 5 op het numerieke toetsenblok",
        was: ["typt een 5 als Num Lock aan staat.", "Num Lock staat nu uit, daarom doet deze toets niets."],
      };
    case "ContextMenu":
      return {
        kurz: null,
        name: "menutoets",
        was: ["opent een menu met opdrachten voor de plek waar je nu bent.", "Shift + F10 doet hetzelfde."],
      };
    case "PrintScreen":
      return {
        kurz: null,
        name: "toets Print Screen",
        was: [
          "maakt een foto van het scherm.",
          "In Windows opent er vaak een programma voor schermafbeeldingen.",
          "Esc sluit het weer.",
        ],
      };
    case "ScrollLock":
      return { kurz: null, name: "toets Scroll Lock", was: ["is tegenwoordig bijna nooit nodig."] };
    case "Pause":
      return { kurz: null, name: "toets Pause", was: ["is tegenwoordig bijna nooit nodig."] };
    case "AudioVolumeUp":
      return { kurz: null, name: "toets volume hoger", was: ["zet het geluid harder."] };
    case "AudioVolumeDown":
      return { kurz: null, name: "toets volume lager", was: ["zet het geluid zachter."] };
    case "AudioVolumeMute":
      return { kurz: null, name: "toets geluid uit", was: ["zet het geluid uit en weer aan."] };
    case "Fn":
      return sondertasteNl("fn", plattform, layout);
    case "Dead":
      // Glossar §2.9: auf `nl-intl` sind ' und " dode toetsen - erst die Taste, dann die Letter, oder die Leertaste.
      return {
        kurz: null,
        name: "dode toets",
        was:
          layout === "nl-intl"
            ? [
                "zet een teken op de volgende letter, bijvoorbeeld een trema: eerst \", dan e, en je krijgt ë.",
                "Na ' of \" verschijnt er eerst niets.",
                "Typ daarna de letter, of de spatiebalk voor het teken zelf.",
              ]
            : ["zet een teken op de volgende letter, bijvoorbeeld een accent aigu op de e.", VERSCHIJNT_LATER_NL],
      };
    default:
      return null;
  }
}

/* ══ Totasten mit Zusatzbezeichnung ═════════════════════════════════════════ */

/** Die vier bekannten Akzente - Namen nach Glossar §2.1 (Schulwörter). */
export const AKZENTE_NL: Readonly<Record<"zirkumflex" | "akut" | "gravis" | "trema", { name: string; was: readonly string[] }>> = {
  zirkumflex: {
    name: "accent circonflexe",
    was: ["zet een dakje op de volgende letter, bijvoorbeeld ê.", VERSCHIJNT_LATER_NL],
  },
  akut: {
    name: "accent aigu",
    was: ["zet een streepje schuin naar rechts omhoog op de volgende letter, bijvoorbeeld é.", VERSCHIJNT_LATER_NL],
  },
  gravis: {
    name: "accent grave",
    was: ["zet een streepje schuin naar links omhoog op de volgende letter, bijvoorbeeld è.", VERSCHIJNT_LATER_NL],
  },
  trema: {
    name: "trema",
    was: ["zet twee puntjes op de volgende letter, bijvoorbeeld ë.", VERSCHIJNT_LATER_NL],
  },
};

/* ══ Zeichen ════════════════════════════════════════════════════════════════ */

/**
 * Die Namen der Zeichen, Glossar §2.8 (Schulwörter: komma, puntkomma, koppelteken, apenstaartje). Steht hier, weil
 * `ZEICHENNAMEN_NL` noch leer ist und `spokenLabel(…, "nl")` sonst englisch antwortet.
 */
export const NAMEN_NL: Readonly<Record<string, string>> = {
  " ": "spatie",
  ".": "punt",
  ",": "komma",
  "?": "vraagteken",
  "!": "uitroepteken",
  ":": "dubbele punt",
  ";": "puntkomma",
  "-": "koppelteken",
  "@": "apenstaartje",
  "+": "plus",
  "*": "sterretje",
  "/": "schuine streep",
  "=": "is gelijk aan",
  "'": "apostrof",
  '"': "aanhalingsteken",
  "(": "haakje openen",
  ")": "haakje sluiten",
  "[": "vierkante haak openen",
  "]": "vierkante haak sluiten",
  "{": "accolade openen",
  "}": "accolade sluiten",
  "«": "Franse aanhalingstekens openen",
  "»": "Franse aanhalingstekens sluiten",
  "%": "procent",
  "&": "ampersand",
  "#": "hekje",
  "€": "euro",
  $: "dollar",
  "£": "pond",
  "§": "paragraaf",
  "°": "graden",
  "<": "kleiner dan",
  ">": "groter dan",
  _: "liggend streepje",
  "^": "dakje",
  "~": "tilde",
  "\\": "backslash",
  "|": "verticale streep",
  "²": "kwadraat",
  "³": "kubiek",
  "´": "accent aigu",
  "`": "accent grave",
  "¨": "trema",
  "µ": "mu",
  "ß": "scherpe s",
  "ĳ": "i, j",
  "Ĳ": "hoofdletter I, J",
};

/** Combining-Zeichen (nach NFD) ⇒ „met …" (Glossar §2.8: „e met trema", „c met cedille"). */
const TEKEN_OP_LETTER: Readonly<Record<string, string>> = {
  "́": "accent aigu",
  "̀": "accent grave",
  "̂": "accent circonflexe",
  "̈": "trema",
  "̧": "cedille",
  "̃": "tilde",
  "̊": "rondje",
  "̌": "haakje",
};

/** „e met accent aigu", „hoofdletter E met trema" - oder `null`, wenn es kein Buchstabe mit Zeichen ist. */
function letterMetTeken(ch: string): string | null {
  const nfd = ch.normalize("NFD");
  if (nfd.length !== 2) return null;
  const basis = nfd[0]!;
  const teken = TEKEN_OP_LETTER[nfd[1]!];
  if (!teken || !/^[a-zA-Z]$/.test(basis)) return null;
  return basis === basis.toUpperCase() ? `hoofdletter ${basis} met ${teken}` : `${basis} met ${teken}`;
}

const PROGRAMMEREN_NL = ["wordt gebruikt bij het programmeren."] as const;

/**
 * Dieselben Zeichen wie `ZEICHEN` in `tastenErklaerung.ts`, dazu die Ziffern: ohne Eintrag hiesse die Ansage „2." -
 * eine Zahl mit Punkt am Satzende (Hausregel). Der Ziffern-Satz ist auf jeder Tastatur wahr (er nennt `be` beim Namen).
 */
export const ZEICHEN_NL: Readonly<Record<string, { name?: string; was: readonly string[] }>> = {
  ".": { name: "punt", was: ["sluit een zin af."] },
  ",": { name: "komma", was: ["scheidt delen van een zin."] },
  "?": { name: "vraagteken", was: ["sluit een vraag af."] },
  "!": { name: "uitroepteken", was: ["sluit een uitroep af."] },
  ":": { name: "dubbele punt", was: ["kondigt iets aan, bijvoorbeeld een opsomming."] },
  ";": { name: "puntkomma", was: ["scheidt twee delen van een zin, sterker dan een komma."] },
  "-": { name: "koppelteken", was: ["verbindt woorden, bijvoorbeeld in zee-egel."] },
  "@": { name: "apenstaartje", was: ["staat in elk e-mailadres."] },
  "+": { name: "plus", was: ["betekent plus bij het rekenen.", "In een sneltoets betekent het: druk tegelijk."] },
  "*": { name: "sterretje", was: ["betekent keer op de computer."] },
  "/": { name: "schuine streep", was: ["betekent gedeeld door op de computer.", "Je vindt dit teken ook in internetadressen."] },
  "=": { name: "is gelijk aan", was: ["staat voor de uitkomst van een som."] },
  "'": { name: "apostrof", was: ["laat zien dat er letters wegvallen, bijvoorbeeld in zo'n en 's avonds."] },
  '"': { name: "aanhalingsteken", was: ["staat voor en na wat iemand zegt."] },
  "(": { name: "haakje openen", was: ["begint iets extra's dat je toevoegt."] },
  ")": { name: "haakje sluiten", was: ["sluit af wat je extra hebt toegevoegd."] },
  "%": { name: "procent", was: ["betekent van de honderd, bijvoorbeeld 50%."] },
  "&": { name: "ampersand", was: ["betekent en."] },
  "#": { name: "hekje", was: ["wordt ook gebruikt voor hashtags."] },
  "€": { name: "euro", was: ["is het teken voor de euro."] },
  $: { name: "dollar", was: ["is het teken voor de dollar."] },
  "£": { name: "pond", was: ["is het teken voor het Britse pond."] },
  "§": { name: "paragraaf", was: ["staat voor artikelen van wetten en regels."] },
  "°": { name: "graden", was: ["toont graden, bijvoorbeeld bij de temperatuur."] },
  "<": { name: "kleiner dan", was: ["vergelijkt twee getallen: het getal links is kleiner."] },
  ">": { name: "groter dan", was: ["vergelijkt twee getallen: het getal links is groter."] },
  _: { name: "liggend streepje", was: ["staat vaak in e-mailadressen en bestandsnamen."] },
  "^": { name: "dakje", was: ["betekent tot de macht bij het rekenen, bijvoorbeeld 2 tot de derde macht."] },
  "²": { name: "kwadraat", was: ["wordt gebruikt voor oppervlakte, bijvoorbeeld vierkante meter."] },
  "³": { name: "kubiek", was: ["wordt gebruikt voor inhoud, bijvoorbeeld kubieke meter."] },
  "[": { name: "vierkante haak openen", was: PROGRAMMEREN_NL },
  "]": { name: "vierkante haak sluiten", was: PROGRAMMEREN_NL },
  "{": { name: "accolade openen", was: PROGRAMMEREN_NL },
  "}": { name: "accolade sluiten", was: PROGRAMMEREN_NL },
  "\\": { name: "backslash", was: PROGRAMMEREN_NL },
  "|": { name: "verticale streep", was: PROGRAMMEREN_NL },
  "~": { name: "tilde", was: PROGRAMMEREN_NL },
  "´": { name: "accent aigu", was: ["zet een accent op een letter."] },
  "`": { name: "accent grave", was: ["zet een accent op een letter."] },
  "¨": { name: "trema", was: ["zet twee puntjes op een letter."] },
  ...Object.fromEntries(
    ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].map((cijfer) => [
      cijfer,
      { name: `cijfer ${cijfer}`, was: ["op een Belgisch toetsenbord typ je dit cijfer op de cijferrij met Shift."] },
    ]),
  ),
};

/** Der niederländische Name eines Zeichens - Tabelle, Buchstabe mit Zeichen, Grossbuchstabe, sonst wie es ist. */
export function zeichenNameNl(ch: string): string {
  const eigen = ZEICHEN_NL[ch]?.name ?? NAMEN_NL[ch];
  if (eigen) return eigen;
  const metTeken = letterMetTeken(ch);
  if (metTeken) return metTeken;
  if (/^[A-Z]$/.test(ch)) return `hoofdletter ${ch}`;
  if (/^[a-z]$/.test(ch)) return ch;
  return ZEICHENNAMEN_NL[ch] ?? spokenLabel(ch, "nl");
}

/* ══ Kombinationen ═════════════════════════════════════════════════════════ */

/** Wo eine Wirkung gilt - niederländisch, Programmnamen wie in Windows nl („Verkenner"). */
export const ORT_NL: Readonly<Record<string, string>> = {
  explorer: "in Verkenner",
  finder: "in Finder",
  word: "in Word",
  excel: "in Excel",
  browser: "in de browser",
  teams: "in Teams",
  powerpoint: "in PowerPoint",
  outlook: "in Outlook",
  bedienungshilfen: "in de schermlezer",
};

/** Die kleine eigene Liste der deutschen Datei, niederländisch (die `keys` sind Kennungen, kein Text). */
export const EIGENE_KOMBINATIONEN_NL: Readonly<Record<Plattform, readonly { keys: string; was: string }[]>> = {
  windows: [
    { keys: "Umschalt+Tab", was: "gaat terug naar het vorige onderdeel." },
    { keys: "Strg+P", was: "opent het venster Afdrukken." },
  ],
  macos: [
    { keys: "Umschalt+Tab", was: "gaat terug naar het vorige onderdeel." },
    { keys: "Cmd+P", was: "opent het venster Afdrukken." },
  ],
};

/**
 * Was ein Kürzel BEWIRKT - niederländisch, nach der Kennung der Wirkung im Kürzel-Katalog von »Im Griff«
 * (`lib/computer/kuerzelWirkung.ts`). Nie „Invoegen" als Wort (Glossar Regel 11, Name der Insert-Taste) - darum
 * „toevoegen". Keine Wirkung endet mit einer Zahl (der Satz bekommt einen Punkt).
 */
export function wirkungNl(id: string, plattform: Plattform): string | null {
  if (id === "papierkorb") return plattform === "macos" ? "Naar de prullenmand verplaatsen" : "Naar de Prullenbak verplaatsen";
  return WIRKUNG_NL[id] ?? null;
}

const WIRKUNG_NL: Readonly<Record<string, string>> = {
  kopieren: "Kopiëren",
  einfuegen: "Plakken",
  ausschneiden: "Knippen",
  rueckgaengig: "Ongedaan maken",
  wiederherstellen: "Opnieuw uitvoeren, terughalen wat ongedaan is gemaakt",
  "alles-markieren": "Alles selecteren",
  "markieren-zeichen": "Teken voor teken selecteren",
  "markieren-wort": "Woord voor woord selecteren",
  "spalte-markieren": "De hele kolom selecteren",
  "zeile-markieren": "De hele rij selecteren",
  oeffnen: "Openen",
  umbenennen: "Naam wijzigen",
  "neuer-ordner": "Een nieuwe map maken",
  papierkorb: "Naar de Prullenbak verplaatsen",
  duplizieren: "Een tweede kopie van hetzelfde bestand maken",
  "ebene-hoeher": "Een niveau omhoog gaan",
  adressleiste: "Naar de adresbalk springen",
  eigenschaften: "De eigenschappen tonen",
  uebersicht: "Het voorbeeld openen, een snelle blik zonder te openen",
  bewegen: "Het bestand verplaatsen naar waar het hoort (het verdwijnt van de oude plek)",
  "ansicht-details": "Overschakelen naar de weergave Details",
  speichern: "Opslaan",
  "speichern-unter": "Opslaan als, met een nieuwe naam of op een nieuwe plek",
  fett: "Vet maken",
  kursiv: "Cursief maken",
  unterstreichen: "Onderstrepen",
  ueberschrift1: "De stijl Kop 1 toepassen",
  ueberschrift2: "De stijl Kop 2 toepassen",
  "standard-format": "De stijl Standaard toepassen",
  links: "Links uitlijnen",
  zentriert: "Centreren",
  zeilenumbruch: "Een nieuwe regel in dezelfde alinea",
  rechtschreibung: "De spelling controleren",
  fensterbereiche: "Wisselen tussen de delen van het venster",
  suchen: "Zoeken",
  ersetzen: "Zoeken en vervangen",
  "gehe-zu-zelle": "Naar een bepaalde cel gaan",
  "zelle-bearbeiten": "Verder typen in de cel",
  "zelle-formatieren": "Het venster Cellen opmaken openen",
  "zum-rand": "Naar de rand van de gegevens springen",
  autosumme: "AutoSom toevoegen",
  "ausfuellen-unten": "Omlaag doorvoeren",
  "ausfuellen-rechts": "Naar rechts doorvoeren",
  "absoluter-bezug": "Een verwijzing vastzetten (absolute verwijzing met dollartekens)",
  datum: "De datum van vandaag toevoegen",
  uhrzeit: "De huidige tijd toevoegen",
  kommentar: "Een opmerking toevoegen",
  autofilter: "AutoFilter aan- en uitzetten",
  blattwechsel: "Naar een ander werkblad gaan",
  "neues-blatt": "Een nieuw werkblad toevoegen",
  "neu-laden": "De pagina opnieuw laden",
  lesezeichen: "Een bladwijzer toevoegen",
  verlauf: "De geschiedenis openen",
  senden: "Het bericht verzenden",
  "nachricht-loeschen": "Het bericht verwijderen",
  "sr-stopp": "De spraak stoppen",
};

/** „a, b en c" - die niederländische Aufzählung (kein Komma vor „en"). */
export function aufzaehlungNl(teile: readonly string[]): string {
  if (teile.length <= 1) return teile[0] ?? "";
  return `${teile.slice(0, -1).join(", ")} en ${teile[teile.length - 1]}`;
}

/** Die festen Wörter des Erkundens, niederländisch („Met Alt Gr + E."). */
export const ERKUNDEN_WOERTER_NL: {
  readonly kombination: string;
  readonly kombiUnbekannt: string;
  readonly mit: string;
  readonly akzentTaste: string;
  readonly unbekannt: string;
  readonly taste: (key: string) => string;
} = {
  kombination: "toetscombinatie",
  kombiUnbekannt: "wat deze combinatie doet, hangt af van het programma.",
  mit: "Met",
  akzentTaste: "dode toets",
  unbekannt: "Deze toets herken ik niet.",
  taste: (key: string) => `Toets ${key}`,
};

/* ══ Lerneinheit ════════════════════════════════════════════════════════════ */

/**
 * Der lesbare niederländische Name einer Lern-Einheit - für die Lehrkraft-Statistik, die Stand-Zeile und die
 * Tastenkarte (Vorbild `unitLabelCs`). Lateinische Buchstaben gross wie auf der Kappe („R"), Buchstaben mit Zeichen
 * klein wie auf der Kappe (`be`: é è à ç stehen klein auf der Ziffernreihe), Zeichen und Totasten mit Namen.
 */
export const unitLabelNl: typeof unitLabelEn = (unit) => {
  switch (unitKind(unit)) {
    case "shift":
      return "hoofdletters";
    case "ziffer":
      return `cijfer ${unit}`;
    case "satzzeichen":
    case "sonderzeichen":
      return zeichenNameNl(unit);
    default:
      if (/^[a-z]$/.test(unit)) return unit.toLocaleUpperCase("nl-NL");
      return unit.toUpperCase() !== unit.toLowerCase() ? unit : zeichenNameNl(unit);
  }
};

/* ══ „Toetsen zoeken" ═══════════════════════════════════════════════════════
 *
 * Die Sätze der Suchrunde (`lib/computer/tastenSuche.ts`) niederländisch - WAS geschieht, entscheidet weiter
 * `suchSchritt`; hier wird nur gesagt. Niederländisch beugt nicht: eine Form je Taste, mit Artikel („de Tab-toets").
 * ═══════════════════════════════════════════════════════════════════════════ */

interface TasteNl {
  /** Im Satz, mit Artikel: „Zoek de Tab-toets." */
  nennung: string;
  /** Wo sie liegt - als Weg für eine Hand, nie als Bild. */
  lage: string;
  /** Zusatz nach der Bestätigung (heute nur Caps Lock). */
  achtung?: string;
}

const ZESBLOK_NL = "In het blok van zes toetsen boven de pijltoetsen";
const PIJLEN_NL = "Rechtsonder, bij de pijltoetsen";
const LAPTOP_FN_NL = "Op een laptop vaak met Fn.";

/** Die Tasten der Suchrunde, niederländisch - nach derselben Kennung wie das Wörterbuch. */
const TOETSEN_NL: Readonly<Record<string, TasteNl | ((plattform: Plattform) => TasteNl)>> = {
  tabulator: { nennung: "de Tab-toets", lage: "Linkerpink: een rij hoger, helemaal aan de rand." },
  "pfeil-links": { nennung: "de pijl naar links", lage: `${PIJLEN_NL}: de linker.` },
  "pfeil-rechts": { nennung: "de pijl naar rechts", lage: `${PIJLEN_NL}: de rechter.` },
  "pfeil-auf": { nennung: "de pijl omhoog", lage: `${PIJLEN_NL}: de bovenste.` },
  "pfeil-ab": { nennung: "de pijl omlaag", lage: `${PIJLEN_NL}: onder de pijl omhoog.` },
  pos1: { nennung: "de Home-toets", lage: `${ZESBLOK_NL}, bovenaan in het midden. ${LAPTOP_FN_NL}` },
  ende: { nennung: "de End-toets", lage: `${ZESBLOK_NL}, onderaan in het midden. ${LAPTOP_FN_NL}` },
  "bild-auf": { nennung: "de toets Page Up", lage: `${ZESBLOK_NL}, rechtsboven. ${LAPTOP_FN_NL}` },
  "bild-ab": { nennung: "de toets Page Down", lage: `${ZESBLOK_NL}, rechtsonder. ${LAPTOP_FN_NL}` },
  leertaste: { nennung: "de spatiebalk", lage: "De lange toets onder je duimen." },
  eingabe: { nennung: "de Enter-toets", lage: "Rechterhand, helemaal aan de rand: de grote toets." },
  zeilenschalter: { nennung: "de Return-toets", lage: "Rechterhand, helemaal aan de rand: de grote toets." },
  loeschtaste: (plattform) => ({
    nennung: plattform === "macos" ? "de Delete-toets" : "de Backspace-toets",
    lage: "Rechterhand, helemaal aan de rand, twee rijen hoger.",
  }),
  entf: (plattform) =>
    plattform === "macos"
      ? { nennung: "de Delete-toets", lage: "Alleen op grote toetsenborden, naast Return. Anders Fn en Delete." }
      : { nennung: "de Delete-toets", lage: `${ZESBLOK_NL}, linksonder. Op een laptop rechtsboven.` },
  esc: { nennung: "de Esc-toets", lage: "Linksboven in de hoek." },
  umschalt: { nennung: "de Shift-toets", lage: "Er zijn er twee: links en rechts in de onderste letterrij." },
  feststell: {
    nennung: "de toets Caps Lock",
    lage: "Linkerpink: een stap naar links.",
    achtung: "Typ je nu alleen hoofdletters? Druk dan nog eens op deze toets.",
  },
  strg: { nennung: "de Ctrl-toets", lage: "Linksonder in de hoek." },
  alt: { nennung: "de Alt-toets", lage: "Onderaan, links van de spatiebalk." },
  altgr: { nennung: "de toets Alt Gr", lage: "Onderaan, rechts van de spatiebalk." },
  "windows-taste": { nennung: "de Windows-toets", lage: "Linksonder, tussen Ctrl en Alt." },
  einfg: { nennung: "de Insert-toets", lage: `${ZESBLOK_NL}, linksboven, boven Delete. Ontbreekt vaak op een laptop.` },
  befehlstaste: { nennung: "de Command-toets", lage: "Linksonder, vlak naast de spatiebalk." },
  wahltaste: { nennung: "de Option-toets", lage: "Linksonder, de derde toets vanaf de rand." },
  ctrl: { nennung: "de Control-toets", lage: "Linksonder, de tweede toets vanaf de rand." },
  fn: { nennung: "de Fn-toets", lage: "Linksonder, de eerste toets, helemaal in de hoek. Op een MacBook staat er fn op." },
};

function tasteNl(t: TastenName, plattform: Plattform): TasteNl {
  const e = TOETSEN_NL[t.id];
  if (typeof e === "function") return e(plattform);
  // Sicherheitsnetz: eine neue Wörterbuch-Taste ohne niederländischen Eintrag - der Kappenname mit Kopfwort.
  return e ?? { nennung: `de toets ${t.kurz ?? t.name}`, lage: "" };
}

/** „de Tab-toets" - wie eine Taste im Satz heisst. */
export function tastenNennungNl(t: TastenName, plattform: Plattform): string {
  return tasteNl(t, plattform).nennung;
}

/** Nur die Lage - oder "" (wie bei den anderen Sprachen). */
export function tastenLageNl(t: TastenName, plattform: Plattform): string {
  return tasteNl(t, plattform).lage;
}

/** Der Auftrag beim Suchen: „Zoek de Tab-toets. Linkerpink: …" */
export function ansageSuchauftragNl(t: TastenName, plattform: Plattform): string {
  const e = tasteNl(t, plattform);
  return e.lage ? `Zoek ${e.nennung}. ${e.lage}` : `Zoek ${e.nennung}.`;
}

/** Erster Treffer - erst die Wiederholung zählt (Glossar §2.12: „Gevonden! Druk nog eens …"). */
export function ansageGefundenNl(t: TastenName, plattform: Plattform): string {
  return `Gevonden! Druk op een andere toets en daarna nog eens op ${tastenNennungNl(t, plattform)}.`;
}

/** Nach der Bestätigung - und, wo nötig, die Warnung (Caps Lock). */
export function ansageBestaetigtNl(t: TastenName, plattform: Plattform): string {
  const e = tasteNl(t, plattform);
  return e.achtung ? `Gelukt! ${e.achtung}` : "Gelukt!";
}

/** Eine Taste, die hier nicht geübt wird. */
export const ANSAGE_UNBEKANNT_NL = "Deze toets oefenen we hier niet.";

/** „Alle 20 toetsen gevonden. Goed gedaan." - die Zahl nie am Satzende, höchstens ein Ausrufezeichen je Meldung. */
export function alleGefundenNl(anzahl: number): string {
  return `Alle ${anzahl} toetsen gevonden. Goed gedaan.`;
}

/**
 * Der Satz zu einem Schritt der Suchrunde - niederländisch. `art` und `naechste` kommen unverändert aus `suchSchritt`;
 * nur die Wörter sind neu.
 */
export function suchSatzNl(
  art: "daneben" | "gefunden" | "weiter" | "fertig",
  taste: TastenName | null,
  suchbar: readonly TastenName[],
  index: number,
  plattform: Plattform,
): string {
  const gesucht = suchbar[index]!;
  switch (art) {
    case "daneben": {
      const g = tasteNl(gesucht, plattform);
      if (!taste) return `${ANSAGE_UNBEKANNT_NL} Zoek ${g.nennung}.`;
      return `Dat is ${tastenNennungNl(taste, plattform)}. Zoek ${g.nennung}.${g.lage ? ` ${g.lage}` : ""}`;
    }
    case "gefunden":
      return ansageGefundenNl(gesucht, plattform);
    case "fertig":
      return `${ansageBestaetigtNl(gesucht, plattform)} ${alleGefundenNl(suchbar.length)}`;
    case "weiter":
      return `${ansageBestaetigtNl(gesucht, plattform)} ${ansageSuchauftragNl(suchbar[index + 1]!, plattform)}`;
  }
}

/* ══ Der Satz für den Verteiler ═════════════════════════════════════════════ */

/** Alles, was „Toetsen verkennen" auf Niederländisch sagt. */
export const TASTEN_SATZ_NL: TastenErklaerungSatz = {
  sondertaste: sondertasteNl,
  nachKey: nachKeyNl,
  tasteKurz: TASTE_KURZ_NL,
  zeichen: ZEICHEN_NL,
  zeichenName: zeichenNameNl,
  akzente: AKZENTE_NL,
  erkundenWoerter: ERKUNDEN_WOERTER_NL,
  eigeneKombinationen: EIGENE_KOMBINATIONEN_NL,
  wirkung: wirkungNl,
  ort: ORT_NL,
  aufzaehlung: aufzaehlungNl,
  aufdruckGross: (key) => key.toLocaleUpperCase("nl-NL"),
};
