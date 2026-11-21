/**
 * ★ G3c-VERTEILER (25.10.2026), gefüllt O-RO (29.10.2026): DIE TASTEN IN RUMÄNISCH - „Explorarea tastelor",
 * Tastennamen, „Căutarea tastelor".
 *
 * Vorbild `tastenErklaerungCs.ts`, Inhalt Satz für Satz an `tastenErklaerungEn.ts` geprüft (dieselbe Information,
 * NEU auf Rumänisch geschrieben). Was hier steht, liest der Verteiler `tastenErklaerung.ts` über {@link TASTEN_SATZ_RO}
 * (Form: `tastenErklaerungSatz.ts`), die Bauteile `LetterMap.tsx`, `PupilStatsPanel.tsx`, `TastenflowReiter.tsx` über
 * {@link unitLabelRo} und `TastenErkunden.tsx` über {@link suchSatzRo}. Wer ein Feld ändert, ändert nur DIESE Datei.
 * Noch NICHT angeschlossen (eigene Zeilen der Etappe O): `findenRunde.ts`, `StandZeile.tsx` und die Rahmensätze in
 * `TastenErkunden.tsx` - die Bausteine dafür stehen unten bereit ({@link tastenNennungRo}, {@link ansageSuchauftragRo} …).
 * Wächter: `tests/tastenflow-tasten-erklaerung-ro.test.ts`.
 *
 * ── Glossar (`recherche-rumänisch-2026-10-25/GLOSSAR-ro.md` §1, §2.1, §2.8, §2.9, §2.12, §4) ─────────────────────
 *  · Tastennamen wie auf der Kappe (Hardware vor Ort ist US-bedruckt): Shift · Caps Lock · Enter · Backspace · Delete ·
 *    Tab · Ctrl · Alt · Alt Gr · Esc · Home · End · Page Up · Page Down · Insert · tasta Windows · tasta Meniu.
 *    Rumänisch sind nur **bara de spațiu** und die **săgeți** („săgeată la stânga"). Mac nach Apple-Hilfe ro:
 *    Retur · Ștergere (Rücktaste) · Ștergere înainte (Fn + Ștergere) · Blocare majuscule · Control · Opțiune · Comandă · Fn.
 *  · Regel 11: Tastennamen nie beugen - im Satz IMMER „tasta" davor („cu tasta Shift", „deasupra tastei Delete").
 *    Darum braucht die Suchrunde nur EINE Form je Taste (Nominativ = Akkusativ bei „tasta …").
 *  · Regel 1: Kind = **tu** (Johannes 29.10.: auch für Erwachsene). Regel 2: kein Adjektiv/Partizip am Kind - Perfekt
 *    mit „a avea" ist neutral („Ai apăsat", „Ai găsit-o!"). Regel 8: keine Maus-Wörter (apasă, alege - nie clic/atinge).
 *  · Regel 7: nur Komma-Formen ș ț (U+0219/U+021B); die Cedille-Formen kommen hier nur als Zeichencode vor.
 *    Nur Bindestrich `-`. Höchstens ein „!" je Meldung. Kein Satz endet mit Zahl + Punkt (Falle 6, Ordnungszahl).
 *  · Der erste Satz von `was` beginnt klein - die Taste ist sein Subjekt („trece la elementul următor.").
 *  · Die deutsche Kappe („Strg", „Entf", „Pos 1") nennt ein Satz nur bei eingestellter deutscher Tastatur (wie en).
 */
import type { Plattform } from "../computer/model";
import type { TastenName } from "../computer/tastenNamen";
import { spokenLabel } from "./fingers";
import { unitKind } from "./letters";
import type { Lernweg } from "./lernweg";
import { layoutById, type LayoutId } from "./layouts";
import type { TastenErklaerung } from "./tastenErklaerung";
import type { TastenErklaerungSatz } from "./tastenErklaerungSatz";
import type { AKZENTE_EN } from "./tastenErklaerungEn";

/** Die Cedille-Formen (Altform von ș ț) - nur als Zeichencode, damit sie nirgends als Text im Quelltext stehen. */
const S_CEDILLE = String.fromCharCode(0x015f);
const T_CEDILLE = String.fromCharCode(0x0163);

/* ══ Sondertasten ═══════════════════════════════════════════════════════════ */

/** „Pe tastatura germană are scris Strg pe ea." (nie mit der Aufschrift am Satzende: „Pos 1.") - nur bei eingestellter deutscher Tastatur, sonst stimmt der Satz nicht. */
function deutscheAufschrift(layout: LayoutId, wort: string): string[] {
  return layout === "de" ? [`Pe tastatura germană are scris ${wort} pe ea.`] : [];
}

/** Der Name einer Kappe nach „Alt Gr +" - lateinische Buchstaben gross, sonst wie auf der Kappe. */
function kappe(key: string): string {
  return /^[a-z]$/.test(key) ? key.toUpperCase() : key;
}

/** „… de exemplu Alt Gr + E dă semnul euro." - gelesen aus der Tastatur selbst (britisch: 4, darum nie am Satzende). */
function altGrSaetze(layout: LayoutId): string[] {
  const euro = layoutById(layout).access["€"];
  const taste = euro?.mod === "altgr" ? kappe(euro.base) : "E";
  const saetze = [`scrie al treilea caracter al unei taste, de exemplu Alt Gr + ${taste} dă semnul euro.`];
  if (layout === "ro-prog") {
    saetze.push("Pe tastatura pentru programatori scrie și literele ă, â, î, ș și ț.");
  }
  return saetze;
}

/** Rumänische Sondertaste nach der Kennung aus dem Tasten-Wörterbuch. */
export function sondertasteRo(
  id: string,
  plattform: Plattform,
  layout: LayoutId = "ro",
): TastenErklaerung | null {
  const mac = plattform === "macos";
  const pfeilWort = mac ? "Opțiune" : "Ctrl";
  switch (id) {
    case "tabulator":
      return {
        kurz: null,
        name: "tasta Tab",
        was: [
          "trece la elementul următor, de exemplu la un link, un câmp sau un buton.",
          "Cu tasta Shift se întoarce la elementul anterior.",
        ],
      };
    case "eingabe":
    case "zeilenschalter":
      return mac
        ? {
            kurz: null,
            name: "tasta Retur",
            was: ["confirmă și trimite.", "Deschide linkuri și începe un rând nou în text."],
          }
        : {
            kurz: null,
            name: "tasta Enter",
            was: ["confirmă și trimite.", "Deschide linkuri, activează butoane și începe un rând nou în text."],
          };
    case "leertaste":
      return {
        kurz: null,
        name: "bara de spațiu",
        was: ["pune un spațiu între două cuvinte.", "Activează și butoane și bifează casete."],
      };
    case "loeschtaste":
      return {
        kurz: null,
        name: mac ? "tasta Ștergere" : "tasta Backspace",
        was: ["șterge caracterul din stânga cursorului.", "Așa corectezi o greșeală de scriere."],
      };
    case "entf":
      return mac
        ? {
            kurz: null,
            name: "tasta Ștergere înainte",
            was: [
              "șterge caracterul din dreapta cursorului.",
              "Dacă tastatura ta nu o are, apasă împreună tastele Fn și Ștergere.",
            ],
          }
        : {
            kurz: null,
            name: "tasta Delete",
            was: [
              "șterge caracterul din dreapta cursorului.",
              "Șterge și fișierele selectate.",
              ...deutscheAufschrift(layout, "Entf"),
            ],
          };
    case "esc":
      return {
        kurz: null,
        name: "tasta Esc",
        was: [
          "anulează ce se întâmplă acum.",
          "Închide meniuri, ferestre și mesaje.",
          "În Tastenflow te duce înapoi în câmpul de scriere.",
        ],
      };
    case "umschalt":
      return {
        kurz: null,
        name: "tasta Shift",
        was: [
          "scrie litere mari cât timp o ții apăsată.",
          "Dă și caracterul de sus al unei taste, de exemplu semnul întrebării.",
        ],
      };
    case "feststell":
      return {
        kurz: null,
        name: mac ? "tasta Blocare majuscule" : "tasta Caps Lock",
        was: ["scrie totul cu litere mari, până o apeși din nou."],
      };
    case "pfeil-links":
      return {
        kurz: null,
        name: "tasta săgeată la stânga",
        was: ["mută cursorul cu un caracter la stânga.", `Cu tasta ${pfeilWort} sare peste un cuvânt întreg.`],
      };
    case "pfeil-rechts":
      return {
        kurz: null,
        name: "tasta săgeată la dreapta",
        was: ["mută cursorul cu un caracter la dreapta.", `Cu tasta ${pfeilWort} sare peste un cuvânt întreg.`],
      };
    case "pfeil-auf":
      return {
        kurz: null,
        name: "tasta săgeată în sus",
        was: [
          "mută cursorul cu un rând mai sus.",
          "În liste și meniuri urcă cu un element.",
          `Cu tasta ${pfeilWort} sare cu un paragraf întreg în sus.`,
        ],
      };
    case "pfeil-ab":
      return {
        kurz: null,
        name: "tasta săgeată în jos",
        was: [
          "mută cursorul cu un rând mai jos.",
          "În liste și meniuri coboară cu un element.",
          `Cu tasta ${pfeilWort} sare cu un paragraf întreg în jos.`,
        ],
      };
    case "pos1":
      return {
        kurz: null,
        name: "tasta Home",
        was: [
          "sare la începutul rândului.",
          "Pe o pagină web sare chiar sus.",
          "Cu tasta Ctrl sare la începutul întregului text.",
          ...deutscheAufschrift(layout, "Pos 1"),
        ],
      };
    case "ende":
      return {
        kurz: null,
        name: "tasta End",
        was: [
          "sare la sfârșitul rândului.",
          "Pe o pagină web sare chiar jos.",
          "Cu tasta Ctrl sare la sfârșitul întregului text.",
          ...deutscheAufschrift(layout, "Ende"),
        ],
      };
    case "bild-auf":
      return {
        kurz: null,
        name: "tasta Page Up",
        was: ["urcă cu un ecran întreg.", ...deutscheAufschrift(layout, "Bild ↑")],
      };
    case "bild-ab":
      return {
        kurz: null,
        name: "tasta Page Down",
        was: ["coboară cu un ecran întreg.", ...deutscheAufschrift(layout, "Bild ↓")],
      };
    case "einfg":
      return {
        kurz: null,
        name: "tasta Insert",
        was: [
          "este tasta cititorului de ecran în NVDA și JAWS.",
          "Aproape fiecare comandă a cititorului de ecran începe cu ea.",
          ...deutscheAufschrift(layout, "Einfg"),
        ],
      };
    case "strg":
      return {
        kurz: null,
        name: "tasta Ctrl",
        was: [
          "servește la comenzi rapide de la tastatură.",
          "Ctrl + C copiază, Ctrl + V lipește, Ctrl + Z anulează.",
          "Apăsată singură, oprește imediat vocea.",
          ...deutscheAufschrift(layout, "Strg"),
        ],
      };
    case "alt":
      return {
        kurz: null,
        name: "tasta Alt",
        was: [
          "servește la comenzi rapide de la tastatură.",
          "Alt + Tab trece de la o fereastră la alta.",
          "În Tastenflow, Alt + H deschide ajutorul.",
        ],
      };
    case "altgr":
      return { kurz: null, name: "tasta Alt Gr", was: altGrSaetze(layout) };
    case "windows-taste":
      return {
        kurz: "Win",
        name: "tasta Windows",
        was: [
          "deschide meniul Start.",
          "Apasă-o din nou ca să îl închizi.",
          "Cu alte taste face mai mult, de exemplu Win + D arată desktopul.",
        ],
      };
    case "befehlstaste":
      return {
        kurz: "Cmd",
        name: "tasta Comandă",
        was: ["servește la comenzi rapide de la tastatură.", "Cmd + C copiază, Cmd + V lipește, Cmd + Z anulează."],
      };
    case "wahltaste":
      return {
        kurz: null,
        name: "tasta Opțiune",
        was: ["scrie simboluri, de exemplu a rond.", "Cu săgețile sare peste un cuvânt întreg."],
      };
    case "ctrl":
      return {
        kurz: null,
        name: "tasta Control",
        was: ["face parte din comenzile rapide pe Mac.", "Apăsată singură, oprește vocea VoiceOver."],
      };
    case "fn":
      return {
        kurz: null,
        name: "tasta Fn",
        was: ["dă altor taste o a doua sarcină, de exemplu reglarea volumului."],
      };
    default:
      return null;
  }
}

/**
 * Wie die Taste in einer KOMBINATION und gross in der Mitte heisst - kurz, wie auf der Kappe
 * („Ctrl + Home", „Shift + Tab").
 */
export const TASTE_KURZ_RO: Readonly<Record<string, string>> = {
  tabulator: "Tab",
  eingabe: "Enter",
  zeilenschalter: "Retur",
  leertaste: "Bara de spațiu",
  loeschtaste: "Backspace",
  entf: "Delete",
  esc: "Esc",
  umschalt: "Shift",
  feststell: "Caps Lock",
  "pfeil-links": "Săgeată la stânga",
  "pfeil-rechts": "Săgeată la dreapta",
  "pfeil-auf": "Săgeată în sus",
  "pfeil-ab": "Săgeată în jos",
  pos1: "Home",
  ende: "End",
  "bild-auf": "Page Up",
  "bild-ab": "Page Down",
  einfg: "Insert",
  strg: "Ctrl",
  alt: "Alt",
  altgr: "Alt Gr",
  "windows-taste": "Win",
  befehlstaste: "Cmd",
  wahltaste: "Opțiune",
  ctrl: "Control",
  fn: "Fn",
};

/* ══ Tasten ausserhalb des Wörterbuchs ═════════════════════════════════════ */

const F_TASTEN_WINDOWS_RO: Readonly<Record<string, readonly string[]>> = {
  F1: ["deschide ajutorul în multe programe."],
  F2: ["redenumește fișierul selectat."],
  F3: ["pornește o căutare."],
  F4: ["închide fereastra, împreună cu tasta Alt."],
  F5: ["reîncarcă o pagină web.", "Aici nu se întâmplă nimic, poți explora mai departe."],
  F6: ["sare în bara de adrese a browserului."],
  F7: ["verifică ortografia în Word."],
  F10: ["sare la bara de meniuri în multe programe."],
  F11: ["pornește și oprește ecranul complet în browser.", "Pe laptop, des împreună cu tasta Fn."],
  F12: ["deschide fereastra Salvare ca în Word."],
};

const APARE_DUPA_RO = "Semnul apare abia cu litera următoare.";

/** Rumänisch zu `nachKey` - F-Tasten, Num Lock, Menü-Taste, Lautstärke, Totaste. */
export function nachKeyRo(
  key: string,
  plattform: Plattform,
  layout: LayoutId = "ro",
): TastenErklaerung | null {
  const f = /^F([1-9]|1[0-9]|2[0-4])$/.exec(key);
  if (f) {
    const was =
      plattform === "macos"
        ? ["are o sarcină proprie în unele programe.", "Pe Mac, aceste taste schimbă des luminozitatea și volumul."]
        : (F_TASTEN_WINDOWS_RO[key] ?? ["are o sarcină proprie în unele programe."]);
    return { kurz: key, name: "tastă funcțională", was };
  }
  switch (key) {
    case "Home":
      return sondertasteRo("pos1", "windows", layout);
    case "End":
      return sondertasteRo("ende", "windows", layout);
    case "PageUp":
      return sondertasteRo("bild-auf", "windows", layout);
    case "PageDown":
      return sondertasteRo("bild-ab", "windows", layout);
    case "Insert":
      return sondertasteRo("einfg", "windows", layout);
    case "NumLock":
      return {
        kurz: null,
        name: "tasta Num Lock",
        was: ["pornește și oprește cifrele de pe tastatura numerică."],
      };
    // ★ Testerin 24.10.2026: Numpad 5 bei Num aus (`Clear`) - Vorgabe, ungeprüft von Muttersprachlern.
    case "Clear":
      return {
        kurz: "5",
        name: "tasta 5 de pe tastatura numerică",
        was: ["scrie cifra 5 când Num Lock este pornit.", "Acum Num Lock este oprit, deci nu face nimic."],
      };
    case "ContextMenu":
      return {
        kurz: null,
        name: "tasta Meniu",
        was: ["deschide un meniu cu comenzi pentru locul unde ești.", "Shift + F10 face același lucru."],
      };
    case "PrintScreen":
      return {
        kurz: null,
        name: "tasta Print Screen",
        was: [
          "face o fotografie a ecranului.",
          "În Windows deschide des un instrument de captură de ecran.",
          "Tasta Esc îl închide din nou.",
        ],
      };
    case "ScrollLock":
      return { kurz: null, name: "tasta Scroll Lock", was: ["azi aproape nu se mai folosește."] };
    case "Pause":
      return { kurz: null, name: "tasta Pause", was: ["azi aproape nu se mai folosește."] };
    case "AudioVolumeUp":
      return { kurz: null, name: "tasta pentru volum mai tare", was: ["face sunetul mai tare."] };
    case "AudioVolumeDown":
      return { kurz: null, name: "tasta pentru volum mai încet", was: ["face sunetul mai încet."] };
    case "AudioVolumeMute":
      return { kurz: null, name: "tasta pentru oprirea sunetului", was: ["oprește sunetul și îl pornește din nou."] };
    case "Fn":
      return sondertasteRo("fn", plattform, layout);
    case "Dead":
      return {
        kurz: null,
        name: "tastă moartă",
        was: ["pune un semn pe litera următoare, de exemplu un accent pe litera e.", APARE_DUPA_RO],
      };
    default:
      return null;
  }
}

/* ══ Totasten mit Zusatzbezeichnung ═════════════════════════════════════════ */

/**
 * Die vier bekannten Akzente - nach derselben Kennung wie die deutsche Tabelle. Namen nach Glossar §2.8
 * („accent ascuțit / grav / circumflex"; die Tremapunkte heissen dort „două puncte", nie „tremă").
 */
export const AKZENTE_RO: typeof AKZENTE_EN = {
  zirkumflex: {
    name: "accent circumflex",
    was: ["pune un accent circumflex pe litera următoare, de exemplu ê.", APARE_DUPA_RO],
  },
  akut: {
    name: "accent ascuțit",
    was: ["pune o liniuță urcând spre dreapta pe litera următoare, de exemplu é.", APARE_DUPA_RO],
  },
  gravis: {
    name: "accent grav",
    was: ["pune o liniuță urcând spre stânga pe litera următoare, de exemplu è.", APARE_DUPA_RO],
  },
  trema: {
    name: "două puncte deasupra",
    was: ["pune două puncte pe litera următoare, de exemplu ë.", APARE_DUPA_RO],
  },
};

/* ══ Zeichen ════════════════════════════════════════════════════════════════ */

const PROGRAMARE_RO = ["se folosește în programare."] as const;

/** Wo die rumänischen Buchstaben auf den zwei rumänischen Tastaturen liegen (Standard: eigene Taste; Programmers: Alt Gr). */
const LITERA_RO = (beispiel: string, lage: string, prog: string): readonly string[] => [
  `este o literă românească, de exemplu în cuvintele ${beispiel}.`,
  `Pe tastatura română standard are tasta ei, ${lage}.`,
  `Pe tastatura pentru programatori se scrie cu Alt Gr + ${prog}.`,
];

/**
 * Dieselben Zeichen wie `ZEICHEN` in `tastenErklaerung.ts`, dazu Ziffern, rumänische Anführungszeichen und die Buchstaben
 * ă â î ș ț. JEDER Eintrag trägt seinen rumänischen Namen (Glossar §2.8, so wie NVDA rumänisch spricht) - die
 * Zeichennamen der Sprachausgabe (`zeichenNamenRo.ts`) sind noch leer und fielen sonst auf Englisch zurück.
 */
export const ZEICHEN_RO: Readonly<Record<string, { name?: string; was: readonly string[] }>> = {
  ".": { name: "punct", was: ["încheie o propoziție."] },
  ",": { name: "virgulă", was: ["desparte părți ale propoziției."] },
  "?": { name: "semnul întrebării", was: ["încheie o întrebare."] },
  "!": { name: "semnul exclamării", was: ["încheie o exclamație."] },
  ":": { name: "două puncte", was: ["anunță ceva, de exemplu o enumerare."] },
  ";": { name: "punct și virgulă", was: ["desparte două părți ale propoziției, mai tare decât virgula."] },
  "-": { name: "cratimă", was: ["leagă cuvinte, de exemplu în într-o și dă-mi."] },
  "@": { name: "a rond", was: ["este în fiecare adresă de e-mail."] },
  "+": { name: "plus", was: ["înseamnă plus în calcule.", "Într-o combinație de taste înseamnă: apasă în același timp."] },
  "*": { name: "asterisc", was: ["înseamnă ori pe calculator."] },
  "/": { name: "bară oblică", was: ["înseamnă împărțit la pe calculator.", "Apare și în adresele web."] },
  "=": { name: "egal", was: ["stă înaintea rezultatului unui calcul."] },
  "'": { name: "apostrof", was: ["arată că lipsește o literă.", "În română aproape nu se folosește, apare în nume străine."] },
  '"': { name: "ghilimele", was: ["stau înainte și după ce spune cineva."] },
  "„": { name: "ghilimele deschise", was: ["stau jos, înainte de ce spune cineva."] },
  "”": { name: "ghilimele închise", was: ["stau sus, după ce spune cineva."] },
  "«": { name: "ghilimele unghiulare deschise", was: ["deschid un citat în interiorul altui citat."] },
  "»": { name: "ghilimele unghiulare închise", was: ["închid un citat în interiorul altui citat."] },
  "(": { name: "paranteză rotundă deschisă", was: ["începe ceva ce adaugi în plus."] },
  ")": { name: "paranteză rotundă închisă", was: ["încheie partea adăugată în plus."] },
  "%": { name: "procent", was: ["înseamnă din o sută, de exemplu 50 %."] },
  "&": { name: "ampersand", was: ["înseamnă și."] },
  "#": { name: "diez", was: ["se folosește și pentru hashtaguri."] },
  "€": { name: "euro", was: ["este semnul monedei euro."] },
  $: { name: "dolar", was: ["este semnul pentru dolari."] },
  "£": { name: "liră sterlină", was: ["este semnul pentru lire sterline."] },
  "§": { name: "secțiune", was: ["stă în fața articolelor din legi și regulamente."] },
  "°": { name: "grade", was: ["arată gradele, de exemplu la temperatură."] },
  "<": { name: "mai mic", was: ["compară două numere: cel din stânga este mai mic."] },
  ">": { name: "mai mare", was: ["compară două numere: cel din stânga este mai mare."] },
  _: { name: "liniuță joasă", was: ["apare des în adrese de e-mail și în nume de fișiere."] },
  "^": { name: "circumflex", was: ["înseamnă la puterea în matematică, de exemplu 2 la puterea a treia."] },
  "²": { name: "la pătrat", was: ["se folosește la suprafețe, de exemplu metri pătrați."] },
  "³": { name: "la cub", was: ["se folosește la volume, de exemplu metri cubi."] },
  "[": { name: "paranteză pătrată deschisă", was: PROGRAMARE_RO },
  "]": { name: "paranteză pătrată închisă", was: PROGRAMARE_RO },
  "{": { name: "acoladă deschisă", was: PROGRAMARE_RO },
  "}": { name: "acoladă închisă", was: PROGRAMARE_RO },
  "\\": { name: "bară oblică inversă", was: PROGRAMARE_RO },
  "|": { name: "bară verticală", was: PROGRAMARE_RO },
  "~": { name: "tildă", was: PROGRAMARE_RO },
  "´": { name: "accent ascuțit", was: ["pune un accent pe o literă."] },
  "`": { name: "accent grav", was: ["pune un accent pe o literă."] },
  "¨": { name: "două puncte deasupra", was: ["pune două puncte pe o literă."] },
  // Ziffern: ohne Eintrag sagte „Explorarea tastelor" nur „2." - eine Ziffer mit Punkt am Satzende liest die Stimme
  // als Ordnungszahl (Glossar §4 Falle 6). Mit Namen („cifra 2") endet die Ansage auf einem Wort.
  ...Object.fromEntries(
    ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].map((z) => [
      z,
      { name: `cifra ${z}`, was: ["se scrie pe șirul de cifre sau pe tastatura numerică."] },
    ]),
  ),
  // ★★★ die rumänischen Buchstaben (Glossar §2.8 Schulsprache; Lage nach `layouts.ts` `RO`/`RO_PROG`).
  ă: { name: "a cu căciulă", was: LITERA_RO("mă și casă", "în dreapta literei P", "A") },
  â: { name: "â din a", was: LITERA_RO("câine și mâine", "deasupra tastei Enter", "Q") },
  î: { name: "î din i", was: LITERA_RO("în și înot", "în dreapta literei ă", "I") },
  ș: { name: "s cu virgulă", was: LITERA_RO("școală și șase", "în dreapta literei L", "S") },
  ț: { name: "t cu virgulă", was: LITERA_RO("țară și roată", "în dreapta literei ș", "T") },
  // Die Altform mit Cedille (Tastatur „Romanian (Legacy)"): kein Fehler (Bauplan R4), nur die alte Form.
  [S_CEDILLE]: { name: "s cu sedilă", was: ["este forma veche a literei s cu virgulă.", "Azi se scrie de obicei s cu virgulă."] },
  [T_CEDILLE]: { name: "t cu sedilă", was: ["este forma veche a literei t cu virgulă.", "Azi se scrie de obicei t cu virgulă."] },
};

/** Namen weiterer Buchstaben mit Zeichen (Glossar §2.8 „Weitere Zeichen"), ohne eigenen Satz. */
const BUCHSTABEN_NAMEN_RO: Readonly<Record<string, string>> = {
  ä: "a cu două puncte",
  ö: "o cu două puncte",
  ü: "u cu două puncte",
  ë: "e cu două puncte",
  ï: "i cu două puncte",
  ÿ: "y cu două puncte",
  ß: "s dublu german",
  ñ: "n cu tildă",
  ç: "c cu sedilă",
  é: "e cu accent ascuțit",
  è: "e cu accent grav",
  ê: "e cu accent circumflex",
};

/** Der Name eines kleinen Buchstabens - mit Zeichen sein Name aus den Tabellen, sonst der Buchstabe selbst. */
function buchstabenName(klein: string): string {
  return ZEICHEN_RO[klein]?.name ?? BUCHSTABEN_NAMEN_RO[klein] ?? klein;
}

/**
 * Der rumänische Name eines Zeichens - aus der Tabelle; Grossbuchstaben „A mare", mit Zeichen „a cu căciulă, mare"
 * (Glossar §2.8). Was keine Tabelle kennt, geht an `spokenLabel(…, "ro")` (die Zeichennamen der Sprachausgabe).
 */
export function zeichenNameRo(ch: string): string {
  const eigen = ZEICHEN_RO[ch]?.name ?? BUCHSTABEN_NAMEN_RO[ch];
  if (eigen) return eigen;
  const klein = ch.toLocaleLowerCase("ro-RO");
  const istBuchstabe = ch.toLocaleUpperCase("ro-RO") !== klein;
  if (istBuchstabe && ch !== klein && klein.length === 1) {
    const name = buchstabenName(klein);
    return name === klein ? `${ch} mare` : `${name}, mare`;
  }
  if (istBuchstabe) return ch;
  return spokenLabel(ch, "ro");
}

/* ══ Kombinationen ═════════════════════════════════════════════════════════ */

/** Wo eine Wirkung gilt - rumänisch, Produktnamen ohne Artikel (Glossar §3). */
export const ORT_RO: Readonly<Record<string, string>> = {
  explorer: "în Explorer",
  finder: "în Finder",
  word: "în Word",
  excel: "în Excel",
  browser: "în browser",
  teams: "în Teams",
  powerpoint: "în PowerPoint",
  outlook: "în Outlook",
  bedienungshilfen: "în cititorul de ecran",
};

/** Die kleine eigene Liste der deutschen Datei, rumänisch (`keys` ist die Schreibweise des Kürzels, kein Lesetext). */
export const EIGENE_KOMBINATIONEN_RO: Readonly<Record<Plattform, readonly { keys: string; was: string }[]>> = {
  windows: [
    { keys: "Umschalt+Tab", was: "se întoarce la elementul anterior." },
    { keys: "Strg+P", was: "deschide fereastra de imprimare." },
  ],
  macos: [
    { keys: "Umschalt+Tab", was: "se întoarce la elementul anterior." },
    { keys: "Cmd+P", was: "deschide fereastra de imprimare." },
  ],
};

/**
 * Was ein Kürzel BEWIRKT - rumänisch, nach der Kennung der Wirkung im Kürzel-Katalog von »Im Griff«
 * (`lib/computer/kuerzelWirkung.ts`, dort nur gelesen). Als Hauptwort der Handlung („Copiere", „Salvare ca"), damit
 * der Satz keine Anrede braucht - Vorgabe, die Namen der rumänischen Office-Menüs sind am Gerät nicht abgelesen.
 * Keine Wirkung endet mit einer Zahl (der Satz bekommt einen Punkt, Glossar §4 Falle 6).
 */
export function wirkungRo(id: string, plattform: Plattform): string | null {
  if (id === "papierkorb") return plattform === "macos" ? "Mutare în Coșul de gunoi" : "Mutare în Coșul de reciclare";
  return WIRKUNG_RO[id] ?? null;
}

const WIRKUNG_RO: Readonly<Record<string, string>> = {
  kopieren: "Copiere",
  einfuegen: "Lipire",
  ausschneiden: "Decupare",
  rueckgaengig: "Anulare",
  wiederherstellen: "Refacere, aduce înapoi ce s-a anulat",
  "alles-markieren": "Selectarea întregului conținut",
  "markieren-zeichen": "Selectare caracter cu caracter",
  "markieren-wort": "Selectare cuvânt cu cuvânt",
  "spalte-markieren": "Selectarea întregii coloane",
  "zeile-markieren": "Selectarea întregului rând",
  oeffnen: "Deschidere",
  umbenennen: "Redenumire",
  "neuer-ordner": "Crearea unui folder nou",
  papierkorb: "Mutare în Coșul de reciclare",
  duplizieren: "O a doua copie a aceluiași fișier",
  "ebene-hoeher": "Urcare cu un nivel",
  adressleiste: "Salt în bara de adrese",
  eigenschaften: "Afișarea proprietăților",
  uebersicht: "Previzualizare, o privire în fișier fără a-l deschide",
  bewegen: "Mutarea fișierului unde trebuie (dispare din locul vechi)",
  "ansicht-details": "Trecere la vizualizarea Detalii",
  speichern: "Salvare",
  "speichern-unter": "Salvare ca, cu alt nume sau în alt loc",
  fett: "Aldin",
  kursiv: "Cursiv",
  unterstreichen: "Subliniere",
  ueberschrift1: "Aplicarea stilului Titlu 1 pentru titlul principal",
  ueberschrift2: "Aplicarea stilului Titlu 2 pentru un subtitlu",
  "standard-format": "Aplicarea stilului Normal",
  "formatvorlagen-bereich": "Deschiderea panoului Stiluri",
  links: "Aliniere la stânga",
  zentriert: "Centrare",
  zeilenumbruch: "Rând nou în același paragraf",
  rechtschreibung: "Verificarea ortografiei",
  fensterbereiche: "Trecere între părțile ferestrei",
  suchen: "Găsire",
  ersetzen: "Găsire și înlocuire",
  "gehe-zu-zelle": "Salt la o anumită celulă",
  "zelle-bearbeiten": "Scriere mai departe în celulă",
  "zelle-formatieren": "Deschiderea ferestrei Formatare celule",
  "zum-rand": "Salt la marginea datelor",
  autosumme: "Inserarea Însumării automate",
  "ausfuellen-unten": "Umplere în jos",
  "ausfuellen-rechts": "Umplere la dreapta",
  "absoluter-bezug": "Fixarea unei referințe (referință absolută cu semnul dolar)",
  datum: "Inserarea datei de azi",
  uhrzeit: "Inserarea orei de acum",
  kommentar: "Inserarea unui comentariu",
  autofilter: "Pornirea și oprirea Filtrului automat",
  blattwechsel: "Trecere la altă foaie de lucru",
  "neues-blatt": "Inserarea unei foi de lucru noi",
  "neu-laden": "Reîncărcarea paginii",
  lesezeichen: "Adăugarea unui marcaj",
  verlauf: "Deschiderea istoricului",
  senden: "Trimiterea mesajului",
  "nachricht-loeschen": "Ștergerea mesajului",
  "sr-stopp": "Oprirea vocii",
};

/** „a, b și c" - die rumänische Aufzählung (kein Komma vor „și"). */
export function aufzaehlungRo(teile: readonly string[]): string {
  if (teile.length <= 1) return teile[0] ?? "";
  return `${teile.slice(0, -1).join(", ")} și ${teile[teile.length - 1]}`;
}

/**
 * Die festen Wörter des Erkundens, rumänisch. `mit` steht vor dem Weg über den dritten Layer („Cu Alt Gr + E.").
 */
export const ERKUNDEN_WOERTER_RO = {
  kombination: "combinație de taste",
  kombiUnbekannt: "ce face depinde de program.",
  mit: "Cu",
  akzentTaste: "tastă moartă",
  unbekannt: "Nu recunosc această tastă.",
  taste: (key: string) => `Tasta ${key}`,
} as const;

/* ══ „Căutarea tastelor" ════════════════════════════════════════════════════
 *
 * Die Sätze der Suchrunde (`lib/computer/tastenSuche.ts`) rumänisch - WAS geschieht, entscheidet weiter `suchSchritt`;
 * hier wird nur gesagt. Mit „tasta" davor ist Nominativ = Akkusativ, also EINE Form je Taste (Regel 11).
 * ═══════════════════════════════════════════════════════════════════════════ */

interface TasteRo {
  /** Im Satz: „tasta Tab", „bara de spațiu" - nach „Caută" und nach „Ai apăsat" dieselbe Form. */
  nennung: string;
  /** Wo sie liegt - als Weg für eine Hand, nie als Bild. */
  lage: string;
  /** Zusatz nach der Bestätigung (heute nur Caps Lock). */
  achtung?: string;
}

/** Eine Taste mit ihrer Kappe - „tasta" davor, damit der Name ungebeugt bleibt. */
function tasta(kappeName: string, lage: string, achtung?: string): TasteRo {
  const e = { nennung: `tasta ${kappeName}`, lage };
  return achtung ? { ...e, achtung } : e;
}

const BLOC_SASE_RO = "În blocul de șase taste de deasupra săgeților";
const SAGETI_RO = "Jos în dreapta, la săgeți";
const LAPTOP_FN_RO = "Pe laptop, des cu tasta Fn.";

/** Die Tasten der Suchrunde, rumänisch - nach derselben Kennung wie das Wörterbuch. */
const TASTEN_RO: Readonly<Record<string, TasteRo | ((plattform: Plattform) => TasteRo)>> = {
  tabulator: tasta("Tab", "Degetul mic stâng: un șir mai sus, la margine."),
  "pfeil-links": tasta("săgeată la stânga", `${SAGETI_RO}: cea din stânga.`),
  "pfeil-rechts": tasta("săgeată la dreapta", `${SAGETI_RO}: cea din dreapta.`),
  "pfeil-auf": tasta("săgeată în sus", `${SAGETI_RO}: cea de sus.`),
  "pfeil-ab": tasta("săgeată în jos", `${SAGETI_RO}: sub săgeata în sus.`),
  pos1: tasta("Home", `${BLOC_SASE_RO}, sus la mijloc. ${LAPTOP_FN_RO}`),
  ende: tasta("End", `${BLOC_SASE_RO}, jos la mijloc. ${LAPTOP_FN_RO}`),
  "bild-auf": tasta("Page Up", `${BLOC_SASE_RO}, sus în dreapta. ${LAPTOP_FN_RO}`),
  "bild-ab": tasta("Page Down", `${BLOC_SASE_RO}, jos în dreapta. ${LAPTOP_FN_RO}`),
  leertaste: { nennung: "bara de spațiu", lage: "Tasta lungă de sub degetele mari." },
  eingabe: tasta("Enter", "Mâna dreaptă, la margine: tasta mare."),
  zeilenschalter: tasta("Retur", "Mâna dreaptă, la margine: tasta mare."),
  loeschtaste: (plattform) =>
    tasta(plattform === "macos" ? "Ștergere" : "Backspace", "Mâna dreaptă, la margine, două șiruri mai sus."),
  entf: (plattform) =>
    plattform === "macos"
      ? tasta("Ștergere înainte", "Doar pe tastaturile mari, lângă tasta Retur. Altfel Fn și Ștergere.")
      : tasta("Delete", `${BLOC_SASE_RO}, jos în stânga. Pe laptop, sus în dreapta.`),
  esc: tasta("Esc", "În colțul din stânga sus."),
  umschalt: tasta("Shift", "Sunt două: în stânga și în dreapta, pe șirul de jos."),
  feststell: (plattform) =>
    tasta(
      plattform === "macos" ? "Blocare majuscule" : "Caps Lock",
      "Degetul mic stâng: un pas spre stânga.",
      "Acum se scrie doar cu litere mari? Apasă-o încă o dată.",
    ),
  strg: tasta("Ctrl", "În colțul din stânga jos."),
  alt: tasta("Alt", "Jos, în stânga barei de spațiu."),
  altgr: tasta("Alt Gr", "Jos, în dreapta barei de spațiu."),
  "windows-taste": tasta("Windows", "Jos în stânga, între tastele Ctrl și Alt."),
  einfg: tasta("Insert", `${BLOC_SASE_RO}, sus în stânga, deasupra tastei Delete. Pe laptop lipsește des.`),
  befehlstaste: tasta("Comandă", "Jos în stânga, chiar lângă bara de spațiu."),
  wahltaste: tasta("Opțiune", "Jos în stânga, a treia tastă de la margine."),
  ctrl: tasta("Control", "Jos în stânga, a doua tastă de la margine."),
  fn: tasta("Fn", "Jos în stânga, prima tastă, chiar în colț. Pe MacBook scrie fn pe ea."),
};

function tasteRo(t: TastenName, plattform: Plattform): TasteRo {
  const e = TASTEN_RO[t.id];
  if (typeof e === "function") return e(plattform);
  // Sicherheitsnetz: eine neue Wörterbuch-Taste ohne rumänischen Eintrag - „tasta" davor, ungebeugt.
  return e ?? tasta(t.kurz ?? t.name, "");
}

/** „tasta Tab", „bara de spațiu" - wie eine Taste im Satz heisst. */
export function tastenNennungRo(t: TastenName, plattform: Plattform): string {
  return tasteRo(t, plattform).nennung;
}

/** Nur die Lage - oder "" (wie bei den anderen Sprachen). */
export function tastenLageRo(t: TastenName, plattform: Plattform): string {
  return tasteRo(t, plattform).lage;
}

/** Der Auftrag beim Suchen: „Caută tasta Tab. Degetul mic stâng: …" */
export function ansageSuchauftragRo(t: TastenName, plattform: Plattform): string {
  const e = tasteRo(t, plattform);
  return e.lage ? `Caută ${e.nennung}. ${e.lage}` : `Caută ${e.nennung}.`;
}

/** Erster Treffer - erst die Wiederholung zählt (Glossar §2.12: „Ai găsit-o! Apasă din nou …", Perfekt = neutral). */
export function ansageGefundenRo(t: TastenName, plattform: Plattform): string {
  return `Ai găsit-o! Apasă altă tastă, apoi din nou ${tastenNennungRo(t, plattform)}.`;
}

/** Nach der Bestätigung - und, wo nötig, die Warnung (Caps Lock). Ohne Tastennamen: das Kind hat sie gerade zweimal gedrückt. */
export function ansageBestaetigtRo(t: TastenName, plattform: Plattform): string {
  const e = tasteRo(t, plattform);
  return e.achtung ? `Corect! ${e.achtung}` : "Corect!";
}

/** Eine Taste, die hier nicht geübt wird. */
export const ANSAGE_UNBEKANNT_RO = "Această tastă nu se exersează aici.";

/** „Toate tastele sunt găsite: 20 din 20, foarte bine." - die Zahl nie am Satzende (Glossar §4 Falle 6), nur ein „!". */
export function alleGefundenRo(anzahl: number): string {
  return `Toate tastele sunt găsite: ${anzahl} din ${anzahl}, foarte bine.`;
}

/**
 * Der Satz zu einem Schritt der Suchrunde - rumänisch. `art` und `naechste` kommen unverändert aus `suchSchritt`;
 * nur die Wörter sind neu.
 */
export function suchSatzRo(
  art: "daneben" | "gefunden" | "weiter" | "fertig",
  taste: TastenName | null,
  suchbar: readonly TastenName[],
  index: number,
  plattform: Plattform,
): string {
  const gesucht = suchbar[index]!;
  switch (art) {
    case "daneben": {
      const g = tasteRo(gesucht, plattform);
      if (!taste) return `${ANSAGE_UNBEKANNT_RO} Caută ${g.nennung}.`;
      return `Ai apăsat ${tastenNennungRo(taste, plattform)}. Caută ${g.nennung}.${g.lage ? ` ${g.lage}` : ""}`;
    }
    case "gefunden":
      return ansageGefundenRo(gesucht, plattform);
    case "fertig":
      return `${ansageBestaetigtRo(gesucht, plattform)} ${alleGefundenRo(suchbar.length)}`;
    case "weiter":
      return `${ansageBestaetigtRo(gesucht, plattform)} ${ansageSuchauftragRo(suchbar[index + 1]!, plattform)}`;
  }
}

/* ══ Name einer Lerneinheit ═════════════════════════════════════════════════ */

/**
 * Der lesbare rumänische Name einer Lern-Einheit - für die Lehrkraft-Statistik, die Stand-Zeile und die Tastenkarte
 * (Vorbild `unitLabelCs`). Buchstaben gross wie auf der Kappe („R", „Ș"), Ziffern „cifra 2", Satz- und Sonderzeichen
 * mit ihrem Namen aus {@link zeichenNameRo}.
 */
export function unitLabelRo(unit: string, _lernweg?: Lernweg): string {
  switch (unitKind(unit)) {
    case "shift":
      return "litere mari";
    case "ziffer":
      return `cifra ${unit}`;
    case "satzzeichen":
    case "sonderzeichen":
      return zeichenNameRo(unit);
    default: {
      const gross = unit.toLocaleUpperCase("ro-RO");
      if (gross === unit.toLocaleLowerCase("ro-RO")) return zeichenNameRo(unit);
      // „ß".toUpperCase() ist „SS" - dann der Name statt einer falschen Kappe.
      return gross.length === unit.length ? gross : zeichenNameRo(unit);
    }
  }
}

/* ══ Das Objekt für den Verteiler ═══════════════════════════════════════════ */

/** Alles, was „Explorarea tastelor" auf Rumänisch sagt. */
export const TASTEN_SATZ_RO: TastenErklaerungSatz = {
  sondertaste: sondertasteRo,
  nachKey: nachKeyRo,
  tasteKurz: TASTE_KURZ_RO,
  zeichen: ZEICHEN_RO,
  zeichenName: zeichenNameRo,
  akzente: AKZENTE_RO,
  erkundenWoerter: ERKUNDEN_WOERTER_RO,
  eigeneKombinationen: EIGENE_KOMBINATIONEN_RO,
  wirkung: wirkungRo,
  ort: ORT_RO,
  aufzaehlung: aufzaehlungRo,
  aufdruckGross: (key) => key.toLocaleUpperCase("ro-RO"),
};
