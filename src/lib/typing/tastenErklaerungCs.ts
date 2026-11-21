/**
 * Tastenflow - „Průzkum kláves" / „Hledání kláves" in der TSCHECHISCHEN
 * Bedienung (★ O-CS, 03.10.2026, Glossar `recherche-tschechisch-2026-10-02/GLOSSAR-cs.md`
 * §2.1, §2.8, §2.9, §4 Falle 1/2/14; Tastenlage nach R1 `tastaturen-und-zeichen.md` §2/§3
 * und `layouts.ts` `CS`/`CS_QWERTY`).
 *
 * Dieselbe Logik wie bei den anderen Sprachen: `erkundeTaste` in
 * `tastenErklaerung.ts` entscheidet weiter, WAS eine Taste ist (Sondertaste,
 * Zeichen, Kombination, dritter Layer, Totaste) und ob sie geschluckt wird.
 * Hier stehen nur die WÖRTER - dieselben Fächer wie in `tastenErklaerungPl.ts`,
 * Eintrag für Eintrag, NEU auf Tschechisch geschrieben (nicht übersetzt).
 *
 * ── Glossar (§2.9) ──────────────────────────────────────────────────────────
 *  Tschechische Tastaturen tragen die ENGLISCHEN Namen; die Taste heisst wie
 *  auf der Kappe, im Satz IMMER mit „klávesa" davor (Regel 11), damit der Name
 *  nie gebeugt wird („stiskni klávesu Shift", „s klávesou Shift"). Windows:
 *  Shift · Caps Lock · Enter · Backspace · Delete · Tab (im Satz Tabulátor) ·
 *  Ctrl · Alt · AltGr · Esc · mezerník · Home · End · Page Up · Page Down ·
 *  Insert · klávesa Windows · klávesa nabídky. Mac: Return · Delete (Rücktaste)
 *  · Fn + Delete (Entf) · Control · Option · Command · Fn. Pfeile: šipka
 *  vlevo / vpravo / nahoru / dolů. Finger in `fingers.ts` (`FINGER_CS`).
 *  Die deutsche Kappe („Strg", „Entf", „Pos 1") bleibt auf der
 *  Bildschirm-Tastatur - die Erklärung sagt dazu, was dort steht.
 *
 * ── Die Regeln der Sätze ────────────────────────────────────────────────────
 *  · Ein Kind ist gemeint: **ty**, Befehlsform („stiskni", „najdi"), keine
 *    Maus-Wörter (nie „klikni").
 *  · Geschlecht nie raten: keine Vergangenheit der 2. Person, kein Adjektiv über
 *    das Kind - Gegenwart, „se"-Sätze, Passiv der Sache („Stisknuto: ...").
 *  · Fälle: Tastennamen nur nach „klávesa" oder nach einem Doppelpunkt. Die
 *    Suchrunde hat für jede Taste ZWEI Formen: Nominativ („šipka vlevo",
 *    „klávesa Tab") und Akkusativ („šipku vlevo", „klávesu Tab").
 *  · Nur Bindestrich `-`; höchstens ein „!" je Meldung; kein Satz endet mit
 *    Zahl + Punkt (die Stimme läse eine Ordnungszahl, Glossar §4 Falle 4).
 *  · Der erste Satz von `was` beginnt klein - die Taste ist sein Subjekt
 *    („přejde na další prvek").
 *  · ★★★ Auf der tschechischen Tastatur trägt die číselná řada die Buchstaben
 *    ě š č ř ž ý á í é; Shift gibt dort die ZIFFER, nie den Grossbuchstaben
 *    (Glossar §4 Falle 1). Caps Lock gibt dort Ě Š Č usw. - das ist ein Weg, kein
 *    Fehler (Falle 14). „čárka" allein ist das Komma; der Akut heisst „čárka nad
 *    písmenem" (Falle 2).
 */
import type { Plattform } from "../computer/model";
import type { TastenName } from "../computer/tastenNamen";
import { spokenLabel } from "./fingers";
import { unitKind } from "./letters";
import { TSCHECHISCHE_LAYOUT_IDS, layoutById, type LayoutId } from "./layouts";
import type { TastenErklaerung } from "./tastenErklaerung";

/**
 * ★ O-CS (03.10.2026): der lesbare tschechische Name einer Lern-Einheit - für
 * die Lehrkraft-Statistik, die Stand-Zeile und die Tastenkarte, wie
 * `unitLabelPl` (`letters.ts` bleibt in dieser Etappe unberührt). Die
 * lateinischen Buchstaben gross wie auf der Kappe („R"), die Buchstaben mit
 * Zeichen klein wie auf der Kappe („ě", „ů") - auf der číselná řada steht kein
 * „Ě", und Shift gibt dort die Ziffer (Glossar §4 Falle 1). Zeichen und
 * Totasten über dieselbe Tabelle wie die Sprachausgabe (`SPOKEN_CS`).
 */
export function unitLabelCs(unit: string): string {
  switch (unitKind(unit)) {
    case "shift":
      return "velká písmena";
    case "ziffer":
      return `číslice ${unit}`;
    case "satzzeichen":
    case "sonderzeichen":
      return spokenLabel(unit, "cs");
    default:
      if (/^[a-z]$/.test(unit)) return unit.toUpperCase();
      return unit.toUpperCase() !== unit.toLowerCase() ? unit : spokenLabel(unit, "cs");
  }
}

/** Liegt diese Tastatur unter den tschechischen (`cs`, `cs-qwerty`)? */
function ceska(layout: LayoutId): boolean {
  return TSCHECHISCHE_LAYOUT_IDS.has(layout);
}

/** Der Name einer Kappe nach „AltGr +" - lateinische Buchstaben gross, sonst wie auf der Kappe. */
function kappe(key: string): string {
  return /^[a-z]$/.test(key) ? key.toUpperCase() : key;
}

/* ══ Sondertasten ═══════════════════════════════════════════════════════════ */

/**
 * Glossar §2.9: die deutsche Kappe („Strg", „Entf", „Pos 1") bleibt auf der
 * Bildschirm-Tastatur; „Průzkum kláves" sagt dazu, was darauf steht.
 */
const NEMECKA_KAPPE = (aufdruck: string) => `Na německé klávesnici je na ní napsáno ${aufdruck}.`;

/**
 * „Zavináč: AltGr + V. Euro: AltGr + E." - die zwei häufigsten Zeichen des
 * dritten Layers, gelesen aus der Tastatur selbst (`cs`: V und E, `cs-qwerty`:
 * 2 und E). Leer, wenn die Tastatur sie nicht über AltGr hat.
 */
function altGrBeispiele(layout: LayoutId, taste: string): string[] {
  const at = layoutById(layout).access["@"];
  const euro = layoutById(layout).access["€"];
  if (at?.mod !== "altgr" || euro?.mod !== "altgr") return [];
  return [`Zavináč: ${taste} + ${kappe(at.base)}. Euro: ${taste} + ${kappe(euro.base)}.`];
}

/** Tschechische Sondertaste nach der Kennung aus dem Tasten-Wörterbuch. */
export function sondertasteCs(
  id: string,
  plattform: Plattform,
  layout: LayoutId = "cs",
): TastenErklaerung | null {
  const mac = plattform === "macos";
  const pfeilWort = mac ? "Option" : "Ctrl";
  const cesky = ceska(layout);
  switch (id) {
    case "tabulator":
      return {
        kurz: "Tab",
        name: "klávesa Tabulátor",
        was: [
          "přejde na další prvek, například na odkaz, pole nebo tlačítko.",
          "S klávesou Shift se vrátí na předchozí.",
        ],
      };
    case "eingabe":
    case "zeilenschalter":
      return mac
        ? {
            kurz: "Return",
            name: "klávesa Return",
            was: ["potvrdí a odešle.", "Otevírá odkazy a v textu začne nový řádek."],
          }
        : {
            kurz: "Enter",
            name: "klávesa Enter",
            was: ["potvrdí a odešle.", "Otevírá odkazy, spouští tlačítka a v textu začne nový řádek."],
          };
    case "leertaste":
      return {
        kurz: null,
        name: "mezerník",
        was: ["vloží mezeru mezi dvě slova.", "Spouští také tlačítka a zaškrtává políčka."],
      };
    case "loeschtaste":
      return {
        kurz: null,
        name: mac ? "klávesa Delete" : "klávesa Backspace",
        was: ["smaže znak vlevo od kurzoru.", "Tak opravíš překlep."],
      };
    case "entf":
      return mac
        ? {
            kurz: null,
            name: "klávesa Delete",
            was: [
              "smaže znak vpravo od kurzoru.",
              "Když ji na klávesnici nemáš, stiskni spolu klávesy Fn a Delete.",
            ],
          }
        : {
            kurz: "Delete",
            name: "klávesa Delete",
            was: ["smaže znak vpravo od kurzoru.", "Maže také vybrané soubory.", NEMECKA_KAPPE("Entf")],
          };
    case "esc":
      return {
        kurz: "Esc",
        name: "klávesa Esc",
        was: [
          "zruší, co právě probíhá.",
          "Zavírá nabídky, okna a hlášení.",
          "V aplikaci Tastenflow tě vrátí do pole pro psaní.",
        ],
      };
    case "umschalt":
      return {
        kurz: "Shift",
        name: "klávesa Shift",
        was: cesky
          ? [
              "dokud ji držíš, píše velká písmena.",
              // ★★★ Glossar §4 Falle 1: auf der číselná řada gibt Shift die Ziffer.
              "Na číselné řadě dává číslice, ne velká písmena: klávesa ě s ní napíše 2, ne Ě.",
              "Dává také horní znak klávesy, například otazník.",
            ]
          : [
              "dokud ji držíš, píše velká písmena.",
              "Dává také horní znak klávesy, například otazník.",
            ],
      };
    case "feststell":
      return {
        kurz: "Caps Lock",
        name: "klávesa Caps Lock",
        was: cesky
          ? [
              "píše všechno velkými písmeny, dokud ji znovu nestiskneš.",
              // ★ Glossar §4 Falle 14: ein Weg, kein Fehler.
              "Na číselné řadě pak píše velká písmena Ě Š Č Ř Ž Ý Á Í É.",
            ]
          : ["píše všechno velkými písmeny, dokud ji znovu nestiskneš."],
      };
    case "pfeil-links":
      return {
        kurz: null,
        name: "šipka vlevo",
        was: ["posune kurzor o jeden znak doleva.", `S klávesou ${pfeilWort} přeskočí celé slovo.`],
      };
    case "pfeil-rechts":
      return {
        kurz: null,
        name: "šipka vpravo",
        was: ["posune kurzor o jeden znak doprava.", `S klávesou ${pfeilWort} přeskočí celé slovo.`],
      };
    case "pfeil-auf":
      return {
        kurz: null,
        name: "šipka nahoru",
        was: ["posune kurzor o jeden řádek nahoru.", "V seznamech a nabídkách přejde o položku výš.", `S klávesou ${pfeilWort} přeskočí o celý odstavec nahoru.`],
      };
    case "pfeil-ab":
      return {
        kurz: null,
        name: "šipka dolů",
        was: ["posune kurzor o jeden řádek dolů.", "V seznamech a nabídkách přejde o položku níž.", `S klávesou ${pfeilWort} přeskočí o celý odstavec dolů.`],
      };
    case "pos1":
      return {
        kurz: "Home",
        name: "klávesa Home",
        was: ["skočí na začátek řádku.", "Na webové stránce skočí úplně nahoru.", "S klávesou Ctrl skočí na začátek celého textu.", NEMECKA_KAPPE("Pos 1")],
      };
    case "ende":
      return {
        kurz: "End",
        name: "klávesa End",
        was: ["skočí na konec řádku.", "Na webové stránce skočí úplně dolů.", "S klávesou Ctrl skočí na konec celého textu."],
      };
    case "bild-auf":
      return {
        kurz: "Page Up",
        name: "klávesa Page Up",
        was: ["posune o jednu obrazovku nahoru."],
      };
    case "bild-ab":
      return {
        kurz: "Page Down",
        name: "klávesa Page Down",
        was: ["posune o jednu obrazovku dolů."],
      };
    case "einfg":
      return {
        kurz: "Insert",
        name: "klávesa Insert",
        was: [
          "je klávesa odečítače obrazovky v programech NVDA a JAWS.",
          "Mnoho příkazů odečítače obrazovky začíná právě jí.",
          NEMECKA_KAPPE("Einfg"),
        ],
      };
    case "strg":
      return {
        kurz: "Ctrl",
        name: "klávesa Ctrl",
        was: [
          "slouží ke klávesovým zkratkám.",
          "Ctrl + C kopíruje, Ctrl + V vkládá, Ctrl + Z vrací zpět.",
          "Když ji stiskneš samotnou, hned ztiší hlas.",
          NEMECKA_KAPPE("Strg"),
        ],
      };
    case "alt":
      return {
        kurz: null,
        name: "klávesa Alt",
        was: [
          "slouží ke klávesovým zkratkám.",
          "Alt + Tab přepíná mezi okny.",
          "V aplikaci Tastenflow otevře Alt + H nápovědu.",
        ],
      };
    case "altgr":
      // Ohne Kurzform: „AltGr, klávesa AltGr" sagte dasselbe zweimal.
      return {
        kurz: null,
        name: "klávesa AltGr",
        was: ["píše třetí znak klávesy, například zavináč nebo euro.", ...altGrBeispiele(layout, "AltGr")],
      };
    case "windows-taste":
      return {
        kurz: "Win",
        name: "klávesa Windows",
        was: [
          "otevře nabídku Start.",
          "Stiskni ji ještě jednou a nabídka se zavře.",
          "S jinými klávesami dělá jiné věci, například Win + D ukáže plochu.",
        ],
      };
    case "befehlstaste":
      return {
        kurz: "Cmd",
        name: "klávesa Command",
        was: ["slouží ke klávesovým zkratkám.", "Cmd + C kopíruje, Cmd + V vkládá, Cmd + Z vrací zpět."],
      };
    case "wahltaste":
      return {
        kurz: "Option",
        name: "klávesa Option",
        was: ["píše další znaky, například zavináč nebo euro.", "Se šipkami přeskakuje celá slova."],
      };
    case "ctrl":
      return {
        kurz: "Control",
        name: "klávesa Control",
        was: ["slouží na Macu ke klávesovým zkratkám.", "Když ji stiskneš samotnou, ztiší VoiceOver."],
      };
    case "fn":
      return {
        kurz: "Fn",
        name: "klávesa Fn",
        was: ["dává jiným klávesám druhý úkol, například změnu hlasitosti."],
      };
    default:
      return null;
  }
}

/**
 * Wie die Taste in einer KOMBINATION und gross in der Mitte heisst - kurz,
 * wie sie auf der Kappe steht („Ctrl + Home", „Shift + Tab").
 */
export const TASTE_KURZ_CS: Readonly<Record<string, string>> = {
  tabulator: "Tab",
  eingabe: "Enter",
  zeilenschalter: "Return",
  leertaste: "Mezerník",
  loeschtaste: "Backspace",
  entf: "Delete",
  esc: "Esc",
  umschalt: "Shift",
  feststell: "Caps Lock",
  "pfeil-links": "Šipka vlevo",
  "pfeil-rechts": "Šipka vpravo",
  "pfeil-auf": "Šipka nahoru",
  "pfeil-ab": "Šipka dolů",
  pos1: "Home",
  ende: "End",
  "bild-auf": "Page Up",
  "bild-ab": "Page Down",
  einfg: "Insert",
  strg: "Ctrl",
  alt: "Alt",
  altgr: "AltGr",
  "windows-taste": "Win",
  befehlstaste: "Cmd",
  wahltaste: "Option",
  ctrl: "Control",
  fn: "Fn",
};

/* ══ Tasten ausserhalb des Wörterbuchs ═════════════════════════════════════ */

const F_TASTEN_WINDOWS_CS: Readonly<Record<string, readonly string[]>> = {
  F1: ["v mnoha programech otevře nápovědu."],
  F2: ["přejmenuje vybraný soubor."],
  F3: ["spustí hledání."],
  F4: ["spolu s klávesou Alt zavře okno."],
  F5: ["obnoví webovou stránku.", "Tady se nic nestane, můžeš dál zkoumat."],
  F6: ["přejde do adresního řádku prohlížeče."],
  F7: ["v programu Word zkontroluje pravopis."],
  F10: ["v mnoha programech přejde na panel nabídek."],
  F11: ["zapne a vypne v prohlížeči celou obrazovku.", "Na notebooku často spolu s klávesou Fn."],
  F12: ["v programu Word otevře okno Uložit jako."],
};

const POJEVI_SE_CS = "Znaménko se objeví až s dalším písmenem.";

/** Tschechisch zu `nachKey` - F-Tasten, Num Lock, Menü-Taste, Lautstärke, Totaste. */
export function nachKeyCs(
  key: string,
  plattform: Plattform,
  layout: LayoutId = "cs",
): TastenErklaerung | null {
  const f = /^F([1-9]|1[0-9]|2[0-4])$/.exec(key);
  if (f) {
    const was =
      plattform === "macos"
        ? [
            "má v některých programech vlastní úkol.",
            "Na Macu tyto klávesy často mění jas a hlasitost.",
          ]
        : (F_TASTEN_WINDOWS_CS[key] ?? ["má v některých programech vlastní úkol."]);
    return { kurz: key, name: "funkční klávesa", was };
  }
  switch (key) {
    case "Home":
      return sondertasteCs("pos1", "windows", layout);
    case "End":
      return sondertasteCs("ende", "windows", layout);
    case "PageUp":
      return sondertasteCs("bild-auf", "windows", layout);
    case "PageDown":
      return sondertasteCs("bild-ab", "windows", layout);
    case "Insert":
      return sondertasteCs("einfg", "windows", layout);
    case "NumLock":
      return {
        kurz: null,
        name: "klávesa Num Lock",
        was: ["zapíná a vypíná číslice na numerické klávesnici."],
      };
    // ★ Testerin 24.10.2026: Numpad 5 bei Num aus (`Clear`) - Vorgabe, ungeprüft von Muttersprachlern.
    case "Clear":
      return {
        kurz: "5",
        name: "klávesa 5 na numerické klávesnici",
        was: ["píše 5, když je Num Lock zapnutý.", "Teď je Num Lock vypnutý, proto nic nedělá."],
      };
    case "ContextMenu":
      return {
        kurz: null,
        name: "klávesa nabídky",
        was: ["otevře nabídku s příkazy pro místo, kde právě jsi.", "Shift + F10 udělá totéž."],
      };
    case "PrintScreen":
      return { kurz: null, name: "klávesa Print Screen", was: ["vyfotí obrazovku.", "Ve Windows často otevře nástroj pro snímky obrazovky.", "Esc ho zavře."] };
    case "ScrollLock":
      return { kurz: null, name: "klávesa Scroll Lock", was: ["dnes se skoro nepoužívá."] };
    case "Pause":
      return { kurz: null, name: "klávesa Pause", was: ["dnes se skoro nepoužívá."] };
    case "AudioVolumeUp":
      return { kurz: null, name: "klávesa zesílení", was: ["zesílí zvuk."] };
    case "AudioVolumeDown":
      return { kurz: null, name: "klávesa zeslabení", was: ["zeslabí zvuk."] };
    case "AudioVolumeMute":
      return { kurz: null, name: "klávesa ztlumení", was: ["vypne zvuk a zase ho zapne."] };
    case "Fn":
      return sondertasteCs("fn", plattform, layout);
    case "Dead":
      // ★ R1 §2.1/§3: auf `cs`/`cs-qwerty` (Windows und Mac) sind Čárka (´) und Háček (Shift + dieselbe Taste
      // rechts neben „="), dazu der Kroužek und die dvě tečky Totasten. Die Čárka ohne Shift und die dvě tečky
      // benennt `TOTASTEN` in `tastenErklaerung.ts` selbst; hierher kommen der Háček und der Kroužek.
      return {
        kurz: null,
        name: "mrtvá klávesa",
        was: ceska(layout)
          ? [
              "přidá znaménko k dalšímu písmenu, například háček: nejdřív háček, potom d, a vznikne ď.",
              POJEVI_SE_CS,
            ]
          : ["přidá znaménko k dalšímu písmenu, například čárku nad písmenem e.", POJEVI_SE_CS],
      };
    default:
      return null;
  }
}

/* ══ Totasten mit Zusatzbezeichnung ═════════════════════════════════════════ */

/**
 * Die vier bekannten Akzente - nach derselben Kennung wie die deutsche Tabelle.
 * Auf der tschechischen Tastatur sind die čárka nad písmenem (´) und die dvě
 * tečky (¨) solche Totasten; Stříška und obrácený apostrof kommen auf
 * Tastaturen anderer Länder vor. Namen wie `SPOKEN_CS` (Glossar §2.8).
 */
export const AKZENTE_CS: Readonly<Record<"zirkumflex" | "akut" | "gravis" | "trema", { name: string; was: readonly string[] }>> = {
  zirkumflex: {
    name: "stříška",
    was: ["dá nad další písmeno stříšku, například ô.", POJEVI_SE_CS],
  },
  akut: {
    name: "čárka nad písmenem",
    was: ["dá nad další písmeno čárku, například ó.", POJEVI_SE_CS],
  },
  gravis: {
    name: "obrácený apostrof",
    was: ["dá nad další písmeno obrácenou čárku, například à.", POJEVI_SE_CS],
  },
  trema: {
    name: "dvě tečky",
    was: ["dá nad další písmeno dvě tečky, například ä.", POJEVI_SE_CS],
  },
};

/* ══ Zeichen ════════════════════════════════════════════════════════════════ */

const PROGRAMOVANI_CS = ["slouží k programování."] as const;

/**
 * Für die neun Buchstaben der číselná řada: wo sie liegen und was Shift dort
 * gibt (Glossar §4 Falle 1) - „Na české klávesnici je na číselné řadě. Se
 * stisknutou klávesou Shift píše tato klávesa číslici 2, ne velké písmeno."
 * Der Satz endet nicht mit der Ziffer (Falle 4).
 */
const NA_CISELNE_RADE = (ziffer: string) =>
  `Na české klávesnici je na číselné řadě. Se stisknutou klávesou Shift píše tato klávesa číslici ${ziffer}, ne velké písmeno.`;

/**
 * Dieselben Zeichen wie `ZEICHEN` in `tastenErklaerung.ts`. Der Name kommt
 * aus `spokenLabel(ch, "cs")` (`SPOKEN_CS`, Glossar §2.8); `name` steht nur, wo
 * er anders heissen soll. Dazu die tschechischen Buchstaben mit Zeichen: ein
 * Beispiel, wo sie liegen, und - wo es eins gibt - das Wortpaar, das ohne
 * Zeichen ein ANDERES Wort ergibt (R1 §5.1: být/byt, že/ze usw.), ohne zu werten.
 */
export const ZEICHEN_CS: Readonly<Record<string, { name?: string; was: readonly string[] }>> = {
  ".": { was: ["ukončí větu."] },
  ",": { was: ["odděluje části věty."] },
  "?": { was: ["ukončí otázku."] },
  "!": { was: ["ukončí zvolání."] },
  ":": { was: ["něco uvádí, například výčet."] },
  ";": { was: ["odděluje dvě části věty silněji než čárka."] },
  "-": { was: ["spojuje slova, například česko-německý.", "V počítání znamená minus."] },
  "@": { was: ["je v každé e-mailové adrese."] },
  "+": { was: ["v počítání znamená plus.", "V klávesové zkratce znamená: stiskni spolu."] },
  "*": { was: ["na počítači znamená krát."] },
  "/": { was: ["na počítači znamená děleno.", "Je také v internetových adresách."] },
  "=": { was: ["stojí před výsledkem příkladu."] },
  "'": { was: ["v češtině se skoro nepoužívá, najdeš ho v cizích jménech."] },
  '"': { was: ["stojí před tím, co někdo říká, a za tím."] },
  "«": { was: ["otevírají přímou řeč v textech z jiných zemí."] },
  "»": { was: ["zavírají přímou řeč v textech z jiných zemí."] },
  "(": { was: ["otevírá vsuvku."] },
  ")": { was: ["zavírá vsuvku."] },
  "%": { was: ["znamená ze sta, například 50 %."] },
  "&": { was: ["znamená a."] },
  "#": { was: ["označuje číslo, například #1, a slouží k hashtagům."] },
  "€": { was: ["je znak měny euro."] },
  $: { was: ["je znak dolaru."] },
  "£": { was: ["je znak libry."] },
  "§": { was: ["s číslem označuje paragraf zákona."] },
  "°": { was: ["označuje stupně, například u teploty."] },
  "<": { was: ["porovnává dvě čísla: to vlevo je menší."] },
  ">": { was: ["porovnává dvě čísla: to vlevo je větší."] },
  _: { was: ["často bývá v e-mailových adresách a v názvech souborů."] },
  "^": { was: ["v počítání znamená mocninu, například 2 na třetí."] },
  "²": { was: ["slouží k plochám, například metry čtvereční."] },
  "³": { was: ["slouží k objemům, například metry krychlové."] },
  "[": { was: PROGRAMOVANI_CS },
  "]": { was: PROGRAMOVANI_CS },
  "{": { was: PROGRAMOVANI_CS },
  "}": { was: PROGRAMOVANI_CS },
  "\\": { was: PROGRAMOVANI_CS },
  "|": { was: PROGRAMOVANI_CS },
  "~": { was: PROGRAMOVANI_CS },
  "´": { was: ["dá nad samohlásku čárku, například á."] },
  "ˇ": { was: ["dá nad písmeno háček, například ď."] },
  "`": { was: ["dá nad písmeno obrácenou čárku."] },
  "¨": { was: ["dá nad písmeno dvě tečky."] },
  // ★★★ die Ziffern (Glossar §4 Falle 1/4): ohne Eintrag sagte „Průzkum kláves" nur „2." - eine Ziffer mit Punkt am
  // Satzende liest die Stimme als Ordnungszahl. Mit Namen („číslice 2") und dem Weg auf der tschechischen Tastatur
  // (Shift + der Buchstabe der číselná řada) - „na české klávesnici" hält den Satz auch auf anderen Tastaturen wahr.
  ...Object.fromEntries(
    ["+", "ě", "š", "č", "ř", "ž", "ý", "á", "í", "é"].map((taste, i) => [
      String((i + 1) % 10),
      {
        name: `číslice ${(i + 1) % 10}`,
        was: [`na české klávesnici se píše s klávesou Shift a s klávesou ${spokenLabel(taste, "cs")}.`],
      },
    ]),
  ),
  // ★★★ die tschechischen Buchstaben mit Zeichen (Glossar §2.8, R1 §1-§2, §5.1).
  ě: { was: ["je české písmeno, například ve slovech děti a pět.", NA_CISELNE_RADE("2")] },
  š: { was: ["je české písmeno, například ve slovech škola a myš.", "Bez háčku vznikne jiné slovo: koš a kos.", NA_CISELNE_RADE("3")] },
  č: { was: ["je české písmeno, například ve slovech čaj a míč.", NA_CISELNE_RADE("4")] },
  ř: { was: ["je české písmeno, například ve slovech řeka a moře.", "Bez háčku vznikne jiné slovo: řada a rada.", NA_CISELNE_RADE("5")] },
  ž: { was: ["je české písmeno, například ve slovech žába a nůž.", "Bez háčku vznikne jiné slovo: že a ze.", NA_CISELNE_RADE("6")] },
  ý: { was: ["je české písmeno, například ve slovech mýdlo a malý.", "Bez čárky vznikne jiné slovo: být a byt.", NA_CISELNE_RADE("7")] },
  á: { was: ["je české písmeno, například ve slovech máma a táta.", "Bez čárky vznikne jiné slovo: pán a pan.", NA_CISELNE_RADE("8")] },
  í: { was: ["je české písmeno, například ve slovech míč a psí.", "Bez čárky vznikne jiné slovo: jí a ji.", NA_CISELNE_RADE("9")] },
  é: { was: ["je české písmeno, například ve slovech mléko a dobré.", NA_CISELNE_RADE("0")] },
  ú: {
    was: [
      "je české písmeno, například ve slovech úterý a úkol.",
      "Píše se hlavně na začátku slova. Na české klávesnici má vlastní klávesu vpravo od P.",
    ],
  },
  ů: {
    was: [
      "je české písmeno, například ve slovech dům a kůň.",
      "Bez kroužku vznikne jiné slovo: domů a domu.",
      "Na české klávesnici má vlastní klávesu na základní řadě, vpravo od L.",
    ],
  },
  ď: { was: ["je české písmeno, například ve slovech loď a ďobnout.", "Napíšeš ho s háčkem: nejdřív háček, potom d."] },
  ť: { was: ["je české písmeno, například ve slovech chuť a laťka.", "Napíšeš ho s háčkem: nejdřív háček, potom t."] },
  ň: { was: ["je české písmeno, například ve slovech kůň a píseň.", "Napíšeš ho s háčkem: nejdřív háček, potom n."] },
  ó: {
    was: [
      "je české písmeno, hlavně v cizích slovech, například móda a gól.",
      "Napíšeš ho s čárkou nad písmenem: nejdřív čárka nad písmenem, potom o.",
    ],
  },
};

/** Der tschechische Name eines Zeichens - aus der Tabelle oder `spokenLabel`. */
export function zeichenNameCs(ch: string): string {
  return ZEICHEN_CS[ch]?.name ?? spokenLabel(ch, "cs");
}

/* ══ Kombinationen ═════════════════════════════════════════════════════════ */

/** Wo eine Wirkung gilt - tschechisch, fremde Namen mit „v programu" davor (Regel 12). */
export const ORT_CS: Readonly<Record<string, string>> = {
  explorer: "v Průzkumníku souborů",
  finder: "v programu Finder",
  word: "v programu Word",
  excel: "v programu Excel",
  browser: "v prohlížeči",
  teams: "v programu Teams",
  powerpoint: "v programu PowerPoint",
  outlook: "v programu Outlook",
  bedienungshilfen: "v odečítači obrazovky",
};

/** Die kleine eigene Liste der deutschen Datei, tschechisch. */
export const EIGENE_KOMBINATIONEN_CS: Readonly<Record<Plattform, readonly { keys: string; was: string }[]>> = {
  windows: [
    { keys: "Umschalt+Tab", was: "vrátí se na předchozí prvek." },
    { keys: "Strg+P", was: "otevře okno pro tisk." },
  ],
  macos: [
    { keys: "Umschalt+Tab", was: "vrátí se na předchozí prvek." },
    { keys: "Cmd+P", was: "otevře okno pro tisk." },
  ],
};

/**
 * Was ein Kürzel BEWIRKT - tschechisch, nach der Kennung der Wirkung im
 * Kürzel-Katalog von »Im Griff« (`lib/computer/kuerzelWirkung.ts`, dort nur
 * gelesen). Infinitiv wie in den Menüs von Windows und Office („Kopírovat",
 * „Vložit", „Uložit jako", Glossar Regel 1). Keine Wirkung endet mit einer
 * Zahl (der Satz bekommt einen Punkt, Glossar §4 Falle 4).
 */
export function wirkungCs(id: string, _plattform: Plattform): string | null {
  return WIRKUNG_CS[id] ?? null;
}

const WIRKUNG_CS: Readonly<Record<string, string>> = {
  kopieren: "Kopírovat",
  einfuegen: "Vložit",
  ausschneiden: "Vyjmout",
  rueckgaengig: "Vrátit zpět",
  wiederherstellen: "Znovu provést to, co se vrátilo zpět",
  "alles-markieren": "Vybrat vše",
  "markieren-zeichen": "Vybírat po znacích",
  "markieren-wort": "Vybírat po slovech",
  "spalte-markieren": "Vybrat celý sloupec",
  "zeile-markieren": "Vybrat celý řádek",
  oeffnen: "Otevřít",
  umbenennen: "Přejmenovat",
  "neuer-ordner": "Vytvořit novou složku",
  papierkorb: "Přesunout do koše",
  duplizieren: "Vytvořit druhou kopii stejného souboru",
  "ebene-hoeher": "Přejít o úroveň výš",
  adressleiste: "Přejít do adresního řádku",
  eigenschaften: "Zobrazit vlastnosti",
  uebersicht: "Zobrazit náhled, tedy pohled do souboru bez otevření",
  bewegen: "Přesunout soubor tam, kam patří (z původního místa zmizí)",
  "ansicht-details": "Přepnout na zobrazení Podrobnosti",
  speichern: "Uložit",
  "speichern-unter": "Uložit jako, pod jiným názvem nebo na jiné místo",
  fett: "Tučné písmo",
  kursiv: "Kurzíva",
  unterstreichen: "Podtrhnout",
  ueberschrift1: "Použít styl Nadpis 1 pro hlavní nadpis",
  ueberschrift2: "Použít styl Nadpis 2 pro podnadpis",
  "standard-format": "Použít styl Normální",
  links: "Zarovnat doleva",
  zentriert: "Zarovnat na střed",
  zeilenumbruch: "Začít nový řádek ve stejném odstavci",
  rechtschreibung: "Zkontrolovat pravopis",
  fensterbereiche: "Přecházet mezi částmi okna",
  suchen: "Najít",
  ersetzen: "Najít a nahradit",
  "gehe-zu-zelle": "Přejít na vybranou buňku",
  "zelle-bearbeiten": "Psát dál v buňce",
  "zelle-formatieren": "Otevřít okno Formát buněk",
  "zum-rand": "Přejít na okraj dat",
  autosumme: "Vložit automatické shrnutí",
  "ausfuellen-unten": "Vyplnit dolů",
  "ausfuellen-rechts": "Vyplnit doprava",
  "absoluter-bezug": "Zamknout odkaz (absolutní odkaz se znakem dolaru)",
  datum: "Vložit dnešní datum",
  uhrzeit: "Vložit aktuální čas",
  kommentar: "Vložit komentář",
  autofilter: "Zapnout nebo vypnout automatický filtr",
  blattwechsel: "Přejít na jiný list",
  "neues-blatt": "Vložit nový list",
  "neu-laden": "Obnovit stránku",
  lesezeichen: "Přidat záložku",
  verlauf: "Otevřít historii",
  senden: "Odeslat zprávu",
  "nachricht-loeschen": "Odstranit zprávu",
  "sr-stopp": "Zastavit čtení",
};

/** „a, b a c" - die tschechische Aufzählung (kein Komma vor „a", Glossar §2.10). */
export function aufzaehlungCs(teile: readonly string[]): string {
  if (teile.length <= 1) return teile[0] ?? "";
  return `${teile.slice(0, -1).join(", ")} a ${teile[teile.length - 1]}`;
}

/**
 * Die festen Wörter des Erkundens, tschechisch. `mit` steht vor dem Weg über
 * den dritten Layer - als Passiv der Sache mit Doppelpunkt, damit kein
 * Tastenname gebeugt werden muss und nichts das Geschlecht des Kindes verrät
 * („Stisknuto: AltGr + V.", Glossar Regel 2/11).
 */
export const ERKUNDEN_WOERTER_CS = {
  kombination: "klávesová zkratka",
  kombiUnbekannt: "co dělá, záleží na programu.",
  mit: "Stisknuto:",
  akzentTaste: "mrtvá klávesa",
  unbekannt: "Tuto klávesu nepoznám.",
  taste: (key: string) => `Klávesa ${key}`,
} as const;

/* ══ „Hledání kláves" ═══════════════════════════════════════════════════════
 *
 * Die Sätze der Suchrunde (`lib/computer/tastenSuche.ts`) tschechisch - WAS
 * geschieht, entscheidet weiter `suchSchritt`; hier wird nur gesagt.
 * ═══════════════════════════════════════════════════════════════════════════ */

/** Der Fall, in dem eine Taste im Satz steht. */
export type FallCs = "nominativ" | "akkusativ";

interface TasteCs {
  /** Im Satz als Subjekt oder nach „Stisknuto:" - „šipka vlevo", „klávesa Tab". */
  nom: string;
  /** Nach „Najdi" / „Stiskni" - „šipku vlevo", „mezerník", „klávesu Tab". */
  akk: string;
  /** Wo sie liegt - als Weg für eine Hand, nie als Bild. */
  lage: string;
  /** Zusatz nach der Bestätigung (heute nur Caps Lock). */
  achtung?: string;
}

/** Eine Taste mit ihrer Kappe - „klávesa" davor, damit der Name ungebeugt bleibt (Regel 11). */
function klavesa(kappeName: string, lage: string, achtung?: string): TasteCs {
  const e = { nom: `klávesa ${kappeName}`, akk: `klávesu ${kappeName}`, lage };
  return achtung ? { ...e, achtung } : e;
}

const SEST_KLAVES_CS = "V bloku šesti kláves nad šipkami";
const SIPKY_CS = "Vpravo dole, mezi šipkami";
const NOTEBOOK_FN_CS = "Na notebooku často s klávesou Fn.";

/** Die Tasten der Suchrunde, tschechisch - nach derselben Kennung wie das Wörterbuch. */
const TASTEN_CS: Readonly<Record<string, TasteCs | ((plattform: Plattform) => TasteCs)>> = {
  tabulator: klavesa("Tabulátor", "Levý malíček: o řadu výš, u okraje."),
  "pfeil-links": { nom: "šipka vlevo", akk: "šipku vlevo", lage: `${SIPKY_CS}: ta vlevo.` },
  "pfeil-rechts": { nom: "šipka vpravo", akk: "šipku vpravo", lage: `${SIPKY_CS}: ta vpravo.` },
  "pfeil-auf": { nom: "šipka nahoru", akk: "šipku nahoru", lage: `${SIPKY_CS}: ta nahoře.` },
  "pfeil-ab": { nom: "šipka dolů", akk: "šipku dolů", lage: `${SIPKY_CS}: pod šipkou nahoru.` },
  pos1: klavesa("Home", `${SEST_KLAVES_CS}, nahoře uprostřed. ${NOTEBOOK_FN_CS}`),
  ende: klavesa("End", `${SEST_KLAVES_CS}, dole uprostřed. ${NOTEBOOK_FN_CS}`),
  "bild-auf": klavesa("Page Up", `${SEST_KLAVES_CS}, nahoře vpravo. ${NOTEBOOK_FN_CS}`),
  "bild-ab": klavesa("Page Down", `${SEST_KLAVES_CS}, dole vpravo. ${NOTEBOOK_FN_CS}`),
  leertaste: { nom: "mezerník", akk: "mezerník", lage: "Dlouhá klávesa pod tvými palci." },
  eingabe: klavesa("Enter", "Pravá ruka, u okraje: velká klávesa."),
  zeilenschalter: klavesa("Return", "Pravá ruka, u okraje: velká klávesa."),
  loeschtaste: (plattform) =>
    klavesa(plattform === "macos" ? "Delete" : "Backspace", "Pravá ruka, u okraje, o dvě řady výš."),
  entf: (plattform) =>
    plattform === "macos"
      ? klavesa("Delete", "Jen na velkých klávesnicích, vedle klávesy Return. Jinak Fn a Delete.")
      : klavesa("Delete", `${SEST_KLAVES_CS}, dole vlevo. Na notebooku nahoře vpravo.`),
  esc: klavesa("Esc", "V levém horním rohu."),
  umschalt: klavesa("Shift", "Jsou dvě: vlevo a vpravo na dolní řadě."),
  feststell: klavesa(
    "Caps Lock",
    "Levý malíček: o krok doleva.",
    "Teď se píšou jen velká písmena? Stiskni ji ještě jednou.",
  ),
  strg: klavesa("Ctrl", "V levém dolním rohu."),
  alt: klavesa("Alt", "Dole, vlevo od mezerníku."),
  altgr: klavesa("AltGr", "Dole, vpravo od mezerníku."),
  "windows-taste": klavesa("Windows", "Dole vlevo, mezi klávesami Ctrl a Alt."),
  einfg: klavesa(
    "Insert",
    `${SEST_KLAVES_CS}, nahoře vlevo, nad klávesou Delete. Na noteboocích často chybí.`,
  ),
  befehlstaste: klavesa("Command", "Dole vlevo, hned vedle mezerníku."),
  wahltaste: klavesa("Option", "Dole vlevo, třetí klávesa od okraje."),
  ctrl: klavesa("Control", "Dole vlevo, druhá klávesa od okraje."),
  fn: klavesa("Fn", "Dole vlevo, první klávesa v rohu. Na MacBooku je na ní napsáno fn."),
};

function tasteCs(t: TastenName, plattform: Plattform): TasteCs {
  const e = TASTEN_CS[t.id];
  if (typeof e === "function") return e(plattform);
  // Sicherheitsnetz: eine neue Wörterbuch-Taste ohne tschechischen Eintrag -
  // „klávesa" davor, damit der Name in keinem Fall gebeugt werden muss.
  return e ?? klavesa(t.kurz ?? t.name, "");
}

/**
 * „klávesu Tab", „šipku vlevo" - wie eine Taste im Satz heisst. Vorgabe
 * Akkusativ (nach „Najdi", „Stiskni"); „nominativ" nach „Stisknuto:".
 */
export function tastenNennungCs(t: TastenName, plattform: Plattform, fall: FallCs = "akkusativ"): string {
  const e = tasteCs(t, plattform);
  return fall === "nominativ" ? e.nom : e.akk;
}

/** Nur die Lage - oder "" (wie bei den anderen Sprachen). */
export function tastenLageCs(t: TastenName, plattform: Plattform): string {
  return tasteCs(t, plattform).lage;
}

/** Der Auftrag beim Suchen: „Najdi klávesu Tabulátor. Levý malíček: ..." */
export function ansageSuchauftragCs(t: TastenName, plattform: Plattform): string {
  const e = tasteCs(t, plattform);
  return e.lage ? `Najdi ${e.akk}. ${e.lage}` : `Najdi ${e.akk}.`;
}

/** Erster Treffer - erst die Wiederholung zählt („Tady je!" passt zu jeder Taste und jedem Kind). */
export function ansageGefundenCs(t: TastenName, plattform: Plattform): string {
  return `Tady je! Stiskni jinou klávesu, pak ještě jednou ${tastenNennungCs(t, plattform)}.`;
}

/** Nach der Bestätigung - und, wo nötig, die Warnung (Caps Lock). */
export function ansageBestaetigtCs(t: TastenName, plattform: Plattform): string {
  const e = tasteCs(t, plattform);
  return e.achtung ? `Správně! ${e.achtung}` : "Správně!";
}

/** Eine Taste, die hier nicht geübt wird. */
export const ANSAGE_UNBEKANNT_CS = "Tuto klávesu tady necvičíme.";

/** „Nalezené klávesy: 20/20. Skvělá práce." - die Zahl nach dem Doppelpunkt, nie am Satzende (Glossar §4 Falle 4). */
export function alleGefundenCs(anzahl: number): string {
  return `Nalezené klávesy: ${anzahl}/${anzahl}. Skvělá práce.`;
}

/**
 * Der Satz zu einem Schritt der Suchrunde - tschechisch. `art` und `naechste`
 * kommen unverändert aus `suchSchritt`; nur die Wörter sind neu.
 */
export function suchSatzCs(
  art: "daneben" | "gefunden" | "weiter" | "fertig",
  taste: TastenName | null,
  suchbar: readonly TastenName[],
  index: number,
  plattform: Plattform,
): string {
  const gesucht = suchbar[index]!;
  switch (art) {
    case "daneben": {
      const g = tasteCs(gesucht, plattform);
      if (!taste) return `${ANSAGE_UNBEKANNT_CS} Najdi ${g.akk}.`;
      return `Stisknuto: ${tastenNennungCs(taste, plattform, "nominativ")}. Najdi ${g.akk}.${g.lage ? ` ${g.lage}` : ""}`;
    }
    case "gefunden":
      return ansageGefundenCs(gesucht, plattform);
    case "fertig":
      return `${ansageBestaetigtCs(gesucht, plattform)} ${alleGefundenCs(suchbar.length)}`;
    case "weiter":
      return `${ansageBestaetigtCs(gesucht, plattform)} ${ansageSuchauftragCs(suchbar[index + 1]!, plattform)}`;
  }
}
