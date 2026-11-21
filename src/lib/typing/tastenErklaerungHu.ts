/**
 * ★ G3c-VERTEILER (25.10.2026), ★ O-HU gefüllt (29.10.2026): DIE TASTEN IN UNGARISCH - „Billentyűk felfedezése" (Tasten
 * erkunden), Tastennamen, „Billentyűk keresése" (Suchrunde).
 *
 * Vorbild `tastenErklaerungCs.ts`, Inhalt Satz für Satz an `tastenErklaerungEn.ts` geprüft (dieselbe Information, NEU auf
 * Ungarisch geschrieben). Wortwahl nach `recherche-ungarisch-2026-10-25/GLOSSAR-hu.md` §1, §2.1, §2.8, §2.9, §2.12, §2.13, §4.
 * Was hier steht, liest der Verteiler `tastenErklaerung.ts` über {@link TASTEN_SATZ_HU} (Form: `tastenErklaerungSatz.ts`),
 * die Bauteile `LetterMap.tsx`, `PupilStatsPanel.tsx`, `TastenflowReiter.tsx` über {@link unitLabelHu} und `TastenErkunden.tsx`
 * über {@link suchSatzHu}.
 * Wächter: `tests/tastenflow-tasten-erklaerung-hu.test.ts`.
 * ⚠️ Alles [G] im Sinne des Glossars: von einer Person mit Ungarisch als Erstsprache noch nicht gelesen.
 *
 * ── Glossar (§2.9) ──────────────────────────────────────────────────────────
 *  Ungarische Tastaturen tragen die ENGLISCHEN Namen; ungarisch sind nur „szóköz" und die Pfeile (balra / jobbra / fel / le
 *  nyíl). Die Taste heisst wie auf der Kappe, im Satz IMMER mit dem Kopfwort „billentyű" (Regel 11), damit der Name nie eine
 *  Endung bekommt („a Shift billentyűvel", nie „Shifttel"). Artikel nach Aussprache: az Enter, az Esc, az Alt, az AltGr, az
 *  Insert, az End, az Option, az Fn · a Shift, a Caps Lock, a Backspace, a Tab, a Ctrl, a Delete, a Home, a szóköz.
 *
 * ── Die Regeln der Sätze ────────────────────────────────────────────────────
 *  · Ein Kind ist gemeint: **te** („Nyomd meg", „Keresd meg"), keine Maus-Wörter (nie „kattints", „koppints").
 *  · Der erste Satz von `was` beginnt klein - die Taste ist sein Subjekt („a következő elemre lép.").
 *  · Nur Bindestrich `-`; höchstens ein „!" je Meldung; kein Satz endet mit Zahl + Punkt (die Stimme läse eine Ordnungszahl,
 *    Glossar §4 Falle 4) - darum „Megtalált billentyűk: 20/20, szép munka." und „AltGr + U: euró.".
 *  · „sor" ist doppelt (Falle 3): Tastenreihen nur als alapsor / felső sor / alsó sor / számsor / billentyűsor.
 *  · Löschen heisst im Erkunden „eltávolít" (Regel 10: „Törlés" ist bei Microsoft auch die Entf-Funktion).
 *  · Keine Anführungszeichen in den Sätzen (sie sind Live-Ansagen, Regel 7).
 *  · `spokenLabel(…, "hu")` nennt heute noch die ENGLISCHEN Namen (`zeichenNamenHu.ts` ist leer) - darum stehen hier alle
 *    Zeichen- und Buchstabennamen selbst.
 */
import type { Plattform } from "../computer/model";
import type { TastenName } from "../computer/tastenNamen";
import { spokenLabel } from "./fingers";
import { unitKind } from "./letters";
import { layoutById, type LayoutId } from "./layouts";
import type { Lernweg } from "./lernweg";
import type { TastenErklaerung } from "./tastenErklaerung";
import type { TastenErklaerungSatz } from "./tastenErklaerungSatz";

/* ══ Namen der Zeichen und Buchstaben ════════════════════════════════════════ */

/** Die Zahlwörter - eine Ziffer allein mit Punkt läse die Stimme als Ordnungszahl (Falle 4). */
const ZAHLWORT_HU: Readonly<Record<string, string>> = {
  "0": "nulla", "1": "egy", "2": "kettő", "3": "három", "4": "négy",
  "5": "öt", "6": "hat", "7": "hét", "8": "nyolc", "9": "kilenc",
};

/** Die ungarischen Akzentbuchstaben (Glossar §2.8: „hosszú á"; ö und ü sind eigene Buchstaben, nie „o két ponttal"). */
const MAGYAR_BETU_HU: Readonly<Record<string, string>> = {
  á: "hosszú á", é: "hosszú é", í: "hosszú í", ó: "hosszú ó", ő: "hosszú ő", ú: "hosszú ú", ű: "hosszú ű",
  ö: "ö", ü: "ü",
};

/** Fremdbuchstaben (Glossar §2.13, Falle 12 für õ û). */
const IDEGEN_BETU_HU: Readonly<Record<string, string>> = {
  ä: "a két ponttal", ë: "e két ponttal", ï: "i két ponttal", ÿ: "y két ponttal",
  ß: "német sz", ñ: "n hullámvonallal", ç: "c cedillával", õ: "o hullámvonallal", û: "u kalappal",
};

/* ══ Sondertasten ═══════════════════════════════════════════════════════════ */

/**
 * Glossar §2.9: die deutsche Kappe („Strg", „Entf", „Pos 1") bleibt auf der Bildschirm-Tastatur - aber nur bei eingestellter
 * deutscher Tastatur (`de`) stimmt der Satz (wie Englisch). Die Aufschrift steht nicht am Satzende („Pos 1." wäre eine
 * Ordnungszahl, Falle 4).
 */
function nemetFelirat(layout: LayoutId, felirat: string): string[] {
  return layout === "de" ? [`A német billentyűzeten ${felirat} a felirata.`] : [];
}

/** Der Name einer Kappe nach „AltGr +" - Buchstaben gross, sonst wie auf der Kappe. */
function kappe(key: string): string {
  return /^[a-zäöüßáéíóőúű]$/.test(key) ? key.toLocaleUpperCase("hu-HU") : key;
}

/**
 * „AltGr + V: kukac. AltGr + U: euró." - die zwei häufigsten Zeichen des dritten Layers, gelesen aus der Tastatur selbst
 * (`hu`: V und U). Der Satz endet mit dem Namen, nie mit der Taste (`uk`: AltGr + 4). Leer, wenn die Tastatur sie nicht über
 * AltGr hat.
 */
function altGrPeldak(layout: LayoutId): string[] {
  const l = layoutById(layout);
  const at = l.access["@"];
  const euro = l.access["€"];
  if (at?.mod !== "altgr" || euro?.mod !== "altgr") return [];
  return [`AltGr + ${kappe(at.base)}: kukac. AltGr + ${kappe(euro.base)}: euró.`];
}

/** Ungarische Sondertaste nach der Kennung aus dem Tasten-Wörterbuch. */
export function sondertasteHu(
  id: string,
  plattform: Plattform,
  layout: LayoutId = "hu",
): TastenErklaerung | null {
  const mac = plattform === "macos";
  const nyilSzo = mac ? "Az Option billentyűvel" : "A Ctrl billentyűvel";
  const magyar = layout === "hu" || layout === "hu-101";
  switch (id) {
    case "tabulator":
      return {
        kurz: null,
        name: "Tab billentyű",
        was: [
          "a következő elemre lép, például egy hivatkozásra, egy szövegmezőre vagy egy gombra.",
          "A Shift billentyűvel együtt visszalép.",
        ],
      };
    case "eingabe":
    case "zeilenschalter":
      return mac
        ? {
            kurz: null,
            name: "Return billentyű",
            was: ["jóváhagy és elküld.", "Megnyitja a hivatkozásokat, és a szövegben új sort kezd."],
          }
        : {
            kurz: null,
            name: "Enter billentyű",
            was: [
              "jóváhagy és elküld.",
              "Megnyitja a hivatkozásokat, megnyomja a gombokat, és a szövegben új sort kezd.",
            ],
          };
    case "leertaste":
      return {
        kurz: null,
        name: "szóköz billentyű",
        was: ["szóközt tesz két szó közé.", "Megnyomja a gombokat is, és bejelöli a jelölőnégyzeteket."],
      };
    case "loeschtaste":
      return {
        kurz: null,
        name: mac ? "Delete billentyű" : "Backspace billentyű",
        was: ["eltávolítja a kurzortól balra álló karaktert.", "Így javítod ki az elgépelést."],
      };
    case "entf":
      return mac
        ? {
            kurz: null,
            name: "Delete billentyű",
            was: [
              "eltávolítja a kurzortól jobbra álló karaktert.",
              "Ha nincs ilyen billentyűd, nyomd meg együtt az Fn és a Delete billentyűt.",
            ],
          }
        : {
            kurz: "Del",
            name: "Delete billentyű",
            was: [
              "eltávolítja a kurzortól jobbra álló karaktert.",
              "A kijelölt fájlokat is eltávolítja.",
              ...nemetFelirat(layout, "Entf"),
            ],
          };
    case "esc":
      return {
        kurz: null,
        name: "Esc billentyű",
        was: [
          "megszakítja, ami éppen történik.",
          "Bezárja a menüket, az ablakokat és az üzeneteket.",
          "A Tastenflow programban visszavisz a gépelési mezőbe.",
        ],
      };
    case "umschalt":
      return {
        kurz: null,
        name: "Shift billentyű",
        was: [
          "amíg lenyomva tartod, nagybetűket ír.",
          "A billentyű felső jelét is ez adja, például a kérdőjelet.",
        ],
      };
    case "feststell":
      return {
        kurz: null,
        name: "Caps Lock billentyű",
        was: magyar
          ? [
              "mindent nagybetűvel ír, amíg újra meg nem nyomod.",
              // ★ Glossar §4 Falle 14: ein Weg, kein Fehler.
              "A magyar billentyűzeten így az ékezetes nagybetűket is írhatod, például Á, É és Ő.",
            ]
          : ["mindent nagybetűvel ír, amíg újra meg nem nyomod."],
      };
    case "pfeil-links":
      return {
        kurz: null,
        name: "balra nyíl billentyű",
        was: ["egy karakterrel balra viszi a kurzort.", `${nyilSzo} egy egész szót ugrik át.`],
      };
    case "pfeil-rechts":
      return {
        kurz: null,
        name: "jobbra nyíl billentyű",
        was: ["egy karakterrel jobbra viszi a kurzort.", `${nyilSzo} egy egész szót ugrik át.`],
      };
    case "pfeil-auf":
      return {
        kurz: null,
        name: "fel nyíl billentyű",
        was: [
          "egy sorral feljebb viszi a kurzort.",
          "Listákban és menükben egy elemmel feljebb lép.",
          `${nyilSzo} egy egész bekezdést ugrik felfelé.`,
        ],
      };
    case "pfeil-ab":
      return {
        kurz: null,
        name: "le nyíl billentyű",
        was: [
          "egy sorral lejjebb viszi a kurzort.",
          "Listákban és menükben egy elemmel lejjebb lép.",
          `${nyilSzo} egy egész bekezdést ugrik lefelé.`,
        ],
      };
    case "pos1":
      return {
        kurz: null,
        name: "Home billentyű",
        was: [
          "a sor elejére ugrik.",
          "Egy weboldalon egészen a tetejére ugrik.",
          "A Ctrl billentyűvel az egész szöveg elejére ugrik.",
          ...nemetFelirat(layout, "Pos 1"),
        ],
      };
    case "ende":
      return {
        kurz: null,
        name: "End billentyű",
        was: [
          "a sor végére ugrik.",
          "Egy weboldalon egészen az aljára ugrik.",
          "A Ctrl billentyűvel az egész szöveg végére ugrik.",
          ...nemetFelirat(layout, "Ende"),
        ],
      };
    case "bild-auf":
      return {
        kurz: "PgUp",
        name: "Page Up billentyű",
        was: ["egy képernyőnyit lép felfelé.", ...nemetFelirat(layout, "Bild ↑")],
      };
    case "bild-ab":
      return {
        kurz: "PgDn",
        name: "Page Down billentyű",
        was: ["egy képernyőnyit lép lefelé.", ...nemetFelirat(layout, "Bild ↓")],
      };
    case "einfg":
      return {
        kurz: "Ins",
        name: "Insert billentyű",
        was: [
          "az NVDA és a JAWS képernyőolvasó billentyűje.",
          "Majdnem minden képernyőolvasó-parancs ezzel a billentyűvel kezdődik.",
          ...nemetFelirat(layout, "Einfg"),
        ],
      };
    case "strg":
      return {
        kurz: null,
        name: "Ctrl billentyű",
        was: [
          "billentyűparancsokhoz kell.",
          "Ctrl + C: másolás, Ctrl + V: beillesztés, Ctrl + Z: visszavonás.",
          "Ha egyedül nyomod meg, elhallgattatja a felolvasó hangot.",
          ...nemetFelirat(layout, "Strg"),
        ],
      };
    case "alt":
      return {
        kurz: null,
        name: "Alt billentyű",
        was: [
          "billentyűparancsokhoz kell.",
          "Az Alt + Tab az ablakok között vált.",
          "A Tastenflow programban az Alt + H megnyitja a súgót.",
        ],
      };
    case "altgr":
      return {
        kurz: null,
        name: "AltGr billentyű",
        was: ["egy billentyű harmadik jelét írja, például a kukacot vagy az eurót.", ...altGrPeldak(layout)],
      };
    case "windows-taste":
      return {
        kurz: "Win",
        name: "Windows billentyű",
        was: [
          "megnyitja a Start menüt.",
          "Ha újra megnyomod, bezárja.",
          "Más billentyűkkel együtt többet is tud, például a Win + D megmutatja az asztalt.",
        ],
      };
    case "befehlstaste":
      return {
        kurz: "Cmd",
        name: "Command billentyű",
        was: ["billentyűparancsokhoz kell.", "Cmd + C: másolás, Cmd + V: beillesztés, Cmd + Z: visszavonás."],
      };
    case "wahltaste":
      return {
        kurz: null,
        name: "Option billentyű",
        was: ["jeleket ír, például a kukacot.", "A nyíl billentyűkkel egy egész szót ugrik át."],
      };
    case "ctrl":
      return {
        kurz: null,
        name: "Control billentyű",
        was: [
          "Mac gépen billentyűparancsokhoz kell.",
          "Ha egyedül nyomod meg, elhallgattatja a VoiceOver programot.",
        ],
      };
    case "fn":
      return {
        kurz: null,
        name: "Fn billentyű",
        was: ["más billentyűknek egy második feladatot ad, például a hangerő állítását."],
      };
    default:
      return null;
  }
}

/**
 * Wie die Taste in einer KOMBINATION und gross in der Mitte heisst - kurz, wie sie auf der Kappe steht („Ctrl + Home",
 * „Shift + Tab"); die ungarischen Kappen (szóköz, Pfeile) gross am Anfang.
 */
export const TASTE_KURZ_HU: Readonly<Record<string, string>> = {
  tabulator: "Tab",
  eingabe: "Enter",
  zeilenschalter: "Return",
  leertaste: "Szóköz",
  loeschtaste: "Backspace",
  entf: "Delete",
  esc: "Esc",
  umschalt: "Shift",
  feststell: "Caps Lock",
  "pfeil-links": "Balra nyíl",
  "pfeil-rechts": "Jobbra nyíl",
  "pfeil-auf": "Fel nyíl",
  "pfeil-ab": "Le nyíl",
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

const F_TASTEN_WINDOWS_HU: Readonly<Record<string, readonly string[]>> = {
  F1: ["sok programban megnyitja a súgót."],
  F2: ["átnevezi a kijelölt fájlt."],
  F3: ["elindítja a keresést."],
  F4: ["az Alt billentyűvel együtt bezárja az ablakot."],
  F5: ["újratölti a weboldalt.", "Itt nem történik semmi, nyugodtan felfedezhetsz tovább."],
  F6: ["a böngészőben a címsávra ugrik."],
  F7: ["a Word programban ellenőrzi a helyesírást."],
  F10: ["sok programban a menüsávra ugrik."],
  F11: ["a böngészőben be- és kikapcsolja a teljes képernyőt.", "Laptopon gyakran az Fn billentyűvel együtt."],
  F12: ["a Word programban megnyitja a Mentés másként ablakot."],
};

const KESOBB_JELENIK_MEG_HU = "Az ékezet csak a következő betűvel jelenik meg.";

/** Ungarisch zu `nachKey` - F-Tasten, Num Lock, Menü-Taste, Lautstärke, Totaste. */
export function nachKeyHu(
  key: string,
  plattform: Plattform,
  layout: LayoutId = "hu",
): TastenErklaerung | null {
  const f = /^F([1-9]|1[0-9]|2[0-4])$/.exec(key);
  if (f) {
    const was =
      plattform === "macos"
        ? ["néhány programban saját feladata van.", "Mac gépen ezek a billentyűk gyakran a fényerőt és a hangerőt állítják."]
        : (F_TASTEN_WINDOWS_HU[key] ?? ["néhány programban saját feladata van."]);
    return { kurz: key, name: "funkcióbillentyű", was };
  }
  switch (key) {
    case "Home":
      return sondertasteHu("pos1", "windows", layout);
    case "End":
      return sondertasteHu("ende", "windows", layout);
    case "PageUp":
      return sondertasteHu("bild-auf", "windows", layout);
    case "PageDown":
      return sondertasteHu("bild-ab", "windows", layout);
    case "Insert":
      return sondertasteHu("einfg", "windows", layout);
    case "NumLock":
      return {
        kurz: null,
        name: "Num Lock billentyű",
        was: ["be- és kikapcsolja a számjegyeket a numerikus billentyűzeten."],
      };
    // ★ Testerin 24.10.2026: Numpad 5 bei Num aus (`Clear`) - Vorgabe, ungeprüft von Muttersprachlern.
    case "Clear":
      return {
        kurz: "5",
        name: "középső billentyű a numerikus billentyűzeten",
        was: [
          "bekapcsolt Num Lock mellett az öt számjegyet írja.",
          "Most a Num Lock ki van kapcsolva, ezért nem csinál semmit.",
        ],
      };
    case "ContextMenu":
      return {
        kurz: null,
        name: "Menü billentyű",
        was: [
          "megnyit egy menüt a parancsokkal ahhoz a helyhez, ahol éppen vagy.",
          "A Shift + F10 ugyanezt csinálja.",
        ],
      };
    case "PrintScreen":
      return {
        kurz: null,
        name: "Print Screen billentyű",
        was: [
          "képet készít a képernyőről.",
          "Windows rendszerben gyakran megnyit egy képernyőkép-készítő eszközt.",
          "Az Esc billentyű bezárja.",
        ],
      };
    case "ScrollLock":
      return { kurz: null, name: "Scroll Lock billentyű", was: ["ma már szinte sosem kell."] };
    case "Pause":
      return { kurz: null, name: "Pause billentyű", was: ["ma már szinte sosem kell."] };
    case "AudioVolumeUp":
      return { kurz: null, name: "hangerő fel billentyű", was: ["hangosabbra állítja a hangot."] };
    case "AudioVolumeDown":
      return { kurz: null, name: "hangerő le billentyű", was: ["halkabbra állítja a hangot."] };
    case "AudioVolumeMute":
      return { kurz: null, name: "némítás billentyű", was: ["kikapcsolja a hangot, aztán újra bekapcsolja."] };
    case "Fn":
      return sondertasteHu("fn", plattform, layout);
    case "Dead":
      // Auf `hu` liegen zehn Totasten auf AltGr + Ziffer (Bauplan H8); die bekannten Akzente benennt `TOTASTEN` in
      // `tastenErklaerung.ts` selbst (AKZENTE_HU unten), hierher kommen die übrigen.
      return {
        kurz: null,
        name: "holtbillentyű",
        was: ["ékezetet tesz a következő betűre, például az e betűre.", KESOBB_JELENIK_MEG_HU],
      };
    default:
      return null;
  }
}

/* ══ Totasten mit Zusatzbezeichnung ═════════════════════════════════════════ */

/** Die vier bekannten Akzente - nach derselben Kennung wie die deutsche Tabelle; Namen nach Glossar §2.8. */
export const AKZENTE_HU: Readonly<Record<"zirkumflex" | "akut" | "gravis" | "trema", { name: string; was: readonly string[] }>> = {
  zirkumflex: {
    name: "kalap",
    was: ["kis kalapot tesz a következő betűre, például: ê.", KESOBB_JELENIK_MEG_HU],
  },
  akut: {
    name: "éles ékezet",
    was: ["jobbra felfelé álló vonalat tesz a következő betűre, például: é.", KESOBB_JELENIK_MEG_HU],
  },
  gravis: {
    name: "tompa ékezet",
    was: ["balra felfelé álló vonalat tesz a következő betűre, például: è.", KESOBB_JELENIK_MEG_HU],
  },
  trema: {
    name: "két pont",
    was: ["két pontot tesz a következő betűre, például: ë.", KESOBB_JELENIK_MEG_HU],
  },
};

/* ══ Zeichen ════════════════════════════════════════════════════════════════ */

const PROGRAMOZAS_HU = ["a programozásban használják."] as const;

/** „A magyar billentyűzeten …" - die Lage gilt für die ungarischen Tastaturen, darum steht sie dabei. */
const MAGYARON = "A magyar billentyűzeten";

/**
 * Dieselben Zeichen wie `ZEICHEN` in `tastenErklaerung.ts`, jedes mit eigenem ungarischen Namen (Glossar §2.8 - die
 * Sprachausgabe kennt sie noch nicht). Dazu die ungarischen Akzentbuchstaben: ein Beispiel, wo sie liegen, und - wo es eins
 * gibt - das Wortpaar, das ohne Akzent ein ANDERES Wort ergibt (Bauplan H4: kör/kor, kérek/kerek), ohne zu werten.
 */
export const ZEICHEN_HU: Readonly<Record<string, { name?: string; was: readonly string[] }>> = {
  ".": { name: "pont", was: ["a mondat végére kerül."] },
  ",": { name: "vessző", was: ["elválasztja a mondat részeit."] },
  "?": { name: "kérdőjel", was: ["a kérdés végére kerül."] },
  "!": { name: "felkiáltójel", was: ["a felkiáltás végére kerül."] },
  ":": { name: "kettőspont", was: ["bevezet valamit, például egy felsorolást."] },
  ";": { name: "pontosvessző", was: ["a vesszőnél erősebben választja el a mondat két részét."] },
  "-": { name: "kötőjel", was: ["szavakat kapcsol össze, például: magyar-angol szótár."] },
  "@": { name: "kukac", was: ["minden e-mail-címben benne van."] },
  "+": { name: "plusz", was: ["a számolásban összeadást jelent.", "A billentyűparancsokban azt jelenti: nyomd meg egyszerre."] },
  "*": { name: "csillag", was: ["a számítógépen szorzást jelent."] },
  "/": { name: "perjel", was: ["a számítógépen osztást jelent.", "Az internetes címekben is szerepel."] },
  "=": { name: "egyenlőségjel", was: ["a számolásban az eredmény elé kerül."] },
  "'": { name: "aposztróf", was: ["a magyar szövegekben szinte sosem fordul elő, inkább idegen nevekben."] },
  '"': { name: "idézőjel", was: ["az elé és a mögé kerül, amit valaki mond."] },
  "«": { name: "nyitó francia idézőjel", was: ["más országok szövegeiben azt nyitja meg, amit valaki mond."] },
  "»": { name: "záró francia idézőjel", was: ["más országok szövegeiben azt zárja le, amit valaki mond."] },
  "(": { name: "nyitó zárójel", was: ["egy kiegészítést kezd, amit hozzáteszel."] },
  ")": { name: "záró zárójel", was: ["lezárja a hozzátett kiegészítést."] },
  "%": { name: "százalékjel", was: ["azt jelenti: százból ennyi, például 50%."] },
  "&": { name: "és-jel", was: ["azt jelenti: és."] },
  "#": { name: "kettőskereszt", was: ["a hashtagekhez is használják."] },
  "€": { name: "euró", was: ["az euró pénznem jele."] },
  $: { name: "dollár", was: ["a dollár jele."] },
  "£": { name: "font", was: ["az angol font jele."] },
  "§": { name: "paragrafus", was: ["törvények és szabályok elé kerül."] },
  "°": { name: "fok", was: ["fokot jelöl, például a hőmérsékletnél."] },
  "<": { name: "kisebb, mint", was: ["két számot hasonlít össze: a bal oldali a kisebb."] },
  ">": { name: "nagyobb, mint", was: ["két számot hasonlít össze: a bal oldali a nagyobb."] },
  _: { name: "aláhúzásjel", was: ["gyakran szerepel e-mail-címekben és fájlnevekben."] },
  "^": { name: "kalap", was: ["a matematikában hatványt jelent, például 2 a harmadikon."] },
  "²": { name: "négyzet", was: ["területhez használják, például négyzetméter."] },
  "³": { name: "köb", was: ["térfogathoz használják, például köbméter."] },
  "[": { name: "nyitó szögletes zárójel", was: PROGRAMOZAS_HU },
  "]": { name: "záró szögletes zárójel", was: PROGRAMOZAS_HU },
  "{": { name: "nyitó kapcsos zárójel", was: PROGRAMOZAS_HU },
  "}": { name: "záró kapcsos zárójel", was: PROGRAMOZAS_HU },
  "\\": { name: "fordított perjel", was: PROGRAMOZAS_HU },
  "|": { name: "függőleges vonal", was: PROGRAMOZAS_HU },
  "~": { name: "hullámvonal", was: PROGRAMOZAS_HU },
  "´": { name: "éles ékezet", was: ["ékezetet tesz egy betűre."] },
  "`": { name: "tompa ékezet", was: ["ékezetet tesz egy betűre."] },
  "¨": { name: "két pont", was: ["két pontot tesz egy betűre."] },
  // ★★★ Glossar §4 Falle 1: auf `hu` liegt die 0 LINKS von der 1, auf ihrem gewohnten Platz das ö; auf `hu-101` ist sie AltGr.
  "0": {
    name: "nulla",
    was: [
      "a magyar billentyűzeten a számsor bal szélén van, az egyes előtt.",
      "A 101 billentyűs magyar billentyűzeten az AltGr billentyűvel írod, a bal szélső billentyűn.",
    ],
  },
  // ★★★ die ungarischen Akzentbuchstaben - jeder hat eine eigene Taste, mit Shift seinen Grossbuchstaben (H2, H3).
  á: { was: ["magyar betű, például ezekben a szavakban: ház, kád.", "Ékezet nélkül más szó lesz belőle: hát és hat.", `${MAGYARON} az alapsor jobb oldalán van.`] },
  é: { was: ["magyar betű, például ezekben a szavakban: kép, kés.", "Ékezet nélkül más szó lesz belőle: kérek és kerek.", `${MAGYARON} az alapsor jobb oldalán van, az L mellett.`] },
  í: {
    was: [
      "magyar betű, például ezekben a szavakban: víz, sín.",
      `${MAGYARON} az alsó sor bal szélén van.`,
      "A 101 billentyűs magyar billentyűzeten a számsor bal szélén van.",
    ],
  },
  ó: { was: ["magyar betű, például ezekben a szavakban: ló, hó.", `${MAGYARON} a számsor jobb oldalán van.`] },
  ö: {
    was: [
      "magyar betű, például ezekben a szavakban: öt, köd.",
      "Pontok nélkül más szó lesz belőle: kör és kor.",
      `${MAGYARON} a számsoron van, ott, ahol más billentyűzeten a nulla áll.`,
    ],
  },
  ő: { was: ["magyar betű, például ezekben a szavakban: kő, erdő.", "A rövid ö betűvel más szó lesz belőle: őt és öt.", `${MAGYARON} a felső sor jobb oldalán van.`] },
  ú: { was: ["magyar betű, például ezekben a szavakban: út, kút.", `${MAGYARON} a felső sor jobb oldalán van.`] },
  ü: { was: ["magyar betű, például ezekben a szavakban: ül, tükör.", `${MAGYARON} a számsor jobb oldalán van.`] },
  ű: { was: ["magyar betű, például ezekben a szavakban: tű, fű.", `${MAGYARON} a jobb szélen van.`] },
};

/**
 * Der ungarische Name eines Zeichens - aus der Tabelle, für Buchstaben nach Glossar §2.8 („hosszú á", Grossbuchstabe mit
 * „nagy" davor: „nagy hosszú Á", „nagy R"), für Ziffern das Zahlwort; sonst `spokenLabel`.
 */
export function zeichenNameHu(ch: string): string {
  const eigen = ZEICHEN_HU[ch]?.name ?? ZAHLWORT_HU[ch] ?? MAGYAR_BETU_HU[ch] ?? IDEGEN_BETU_HU[ch];
  if (eigen) return eigen;
  if (/^[a-z]$/.test(ch)) return ch;
  const klein = ch.toLocaleLowerCase("hu-HU");
  if (klein.length === 1 && klein !== ch) {
    if (/^[a-z]$/.test(klein)) return `nagy ${ch}`;
    // „hosszú á" ⇒ „nagy hosszú Á"; „ö" ⇒ „nagy Ö" - der Buchstabe am Ende gross, wie auf der Kappe.
    const magyar = MAGYAR_BETU_HU[klein];
    if (magyar) return `nagy ${magyar.slice(0, -1)}${ch}`;
    const idegen = IDEGEN_BETU_HU[klein];
    if (idegen) return `nagy ${idegen}`;
  }
  return spokenLabel(ch, "hu");
}

/* ══ Kombinationen ═════════════════════════════════════════════════════════ */

/** Wo eine Wirkung gilt - ungarisch, Programmnamen mit „program" dahinter (keine Endung am Namen, Regel 11/12). */
export const ORT_HU: Readonly<Record<string, string>> = {
  explorer: "a Fájlkezelőben",
  finder: "a Finder programban",
  word: "a Word programban",
  excel: "az Excel programban",
  browser: "a böngészőben",
  teams: "a Teams programban",
  powerpoint: "a PowerPoint programban",
  outlook: "az Outlook programban",
  bedienungshilfen: "a képernyőolvasóban",
};

/** Die kleine eigene Liste der deutschen Datei, ungarisch. */
export const EIGENE_KOMBINATIONEN_HU: Readonly<Record<Plattform, readonly { keys: string; was: string }[]>> = {
  windows: [
    { keys: "Umschalt+Tab", was: "visszalép az előző elemre." },
    { keys: "Strg+P", was: "megnyitja a nyomtatási ablakot." },
  ],
  macos: [
    { keys: "Umschalt+Tab", was: "visszalép az előző elemre." },
    { keys: "Cmd+P", was: "megnyitja a nyomtatási ablakot." },
  ],
};

/**
 * Was ein Kürzel BEWIRKT - ungarisch, nach der Kennung der Wirkung im Kürzel-Katalog von »Im Griff«
 * (`lib/computer/kuerzelWirkung.ts`, dort nur gelesen). Hauptwort auf -ás/-és wie in den Menüs von Windows und Office
 * (Glossar Regel 1: „Másolás", „Beillesztés", „Mentés másként"). Keine Wirkung endet mit einer Zahl (Falle 4).
 */
export function wirkungHu(id: string, plattform: Plattform): string | null {
  if (id === "papierkorb") return plattform === "macos" ? "Áthelyezés a Kukába" : "Áthelyezés a Lomtárba";
  return WIRKUNG_HU[id] ?? null;
}

const WIRKUNG_HU: Readonly<Record<string, string>> = {
  kopieren: "Másolás",
  einfuegen: "Beillesztés",
  ausschneiden: "Kivágás",
  rueckgaengig: "Visszavonás",
  wiederherstellen: "Ismétlés, a visszavont lépés visszahozása",
  "alles-markieren": "Az összes kijelölése",
  "markieren-zeichen": "Kijelölés karakterenként",
  "markieren-wort": "Kijelölés szavanként",
  "spalte-markieren": "A teljes oszlop kijelölése",
  "zeile-markieren": "A teljes sor kijelölése",
  oeffnen: "Megnyitás",
  umbenennen: "Átnevezés",
  "neuer-ordner": "Új mappa létrehozása",
  papierkorb: "Áthelyezés a Lomtárba",
  duplizieren: "Második másolat készítése ugyanarról a fájlról",
  "ebene-hoeher": "Egy szinttel feljebb lépés",
  adressleiste: "Ugrás a címsávra",
  eigenschaften: "A tulajdonságok megjelenítése",
  uebersicht: "Előnézet, gyors betekintés megnyitás nélkül",
  bewegen: "A fájl áthelyezése oda, ahová kell (a régi helyéről eltűnik)",
  "ansicht-details": "Váltás a Részletek nézetre",
  speichern: "Mentés",
  "speichern-unter": "Mentés másként, új névvel vagy új helyre",
  fett: "Félkövér",
  kursiv: "Dőlt",
  unterstreichen: "Aláhúzás",
  ueberschrift1: "A Címsor 1 stílus alkalmazása",
  ueberschrift2: "A Címsor 2 stílus alkalmazása",
  "standard-format": "A Normál stílus alkalmazása",
  links: "Balra igazítás",
  zentriert: "Középre igazítás",
  zeilenumbruch: "Sortörés ugyanabban a bekezdésben",
  rechtschreibung: "A helyesírás-ellenőrzés indítása",
  fensterbereiche: "Váltás az ablak részei között",
  suchen: "Keresés",
  ersetzen: "Keresés és csere",
  "gehe-zu-zelle": "Ugrás egy adott cellára",
  "zelle-bearbeiten": "A gépelés folytatása a cellában",
  "zelle-formatieren": "A Cellák formázása ablak megnyitása",
  "zum-rand": "Ugrás az adatok szélére",
  autosumme: "AutoSzum beszúrása",
  "ausfuellen-unten": "Kitöltés lefelé",
  "ausfuellen-rechts": "Kitöltés jobbra",
  "absoluter-bezug": "Hivatkozás rögzítése (abszolút hivatkozás dollárjelekkel)",
  datum: "A mai dátum beszúrása",
  uhrzeit: "A pontos idő beszúrása",
  kommentar: "Megjegyzés beszúrása",
  autofilter: "Az AutoSzűrő be- és kikapcsolása",
  blattwechsel: "Váltás másik munkalapra",
  "neues-blatt": "Új munkalap beszúrása",
  "neu-laden": "Az oldal újratöltése",
  lesezeichen: "Könyvjelző hozzáadása",
  verlauf: "Az előzmények megnyitása",
  senden: "Az üzenet elküldése",
  "nachricht-loeschen": "Az üzenet eltávolítása",
  "sr-stopp": "A felolvasás leállítása",
};

/** „a, b és c" - die ungarische Aufzählung (kein Komma vor „és"). */
export function aufzaehlungHu(teile: readonly string[]): string {
  if (teile.length <= 1) return teile[0] ?? "";
  return `${teile.slice(0, -1).join(", ")} és ${teile[teile.length - 1]}`;
}

/**
 * Die festen Wörter des Erkundens, ungarisch. `mit` steht vor dem Weg über den dritten Layer - mit Doppelpunkt, damit kein
 * Tastenname eine Endung braucht („Így írod: AltGr + V.", Regel 11). Die unbekannte Taste nach Doppelpunkt („Billentyű: F13").
 */
export const ERKUNDEN_WOERTER_HU = {
  kombination: "billentyűparancs",
  kombiUnbekannt: "hogy mit csinál, az a programtól függ.",
  mit: "Így írod:",
  akzentTaste: "holtbillentyű",
  unbekannt: "Ezt a billentyűt nem ismerem.",
  taste: (key: string) => `Billentyű: ${key}`,
} as const;

/* ══ „Billentyűk keresése" ══════════════════════════════════════════════════
 *
 * Die Sätze der Suchrunde (`lib/computer/tastenSuche.ts`) ungarisch - WAS geschieht, entscheidet weiter `suchSchritt`; hier
 * wird nur gesagt.
 * ═══════════════════════════════════════════════════════════════════════════ */

/** Der Fall, in dem eine Taste im Satz steht. */
export type EsetHu = "alanyeset" | "targyeset";

interface TasteHu {
  /** Als Subjekt, mit Artikel - „Ez a Tab billentyű.", „Ez a szóköz billentyű." */
  nom: string;
  /** Als Objekt, mit Artikel - „Keresd meg a Tab billentyűt." */
  akk: string;
  /** Wo sie liegt - als Weg für eine Hand, nie als Bild. */
  lage: string;
  /** Zusatz nach der Bestätigung (heute nur Caps Lock). */
  achtung?: string;
}

/** Eine Taste mit ihrer Kappe - „billentyű" dahinter, damit der Name keine Endung bekommt (Regel 11); Artikel nach Aussprache. */
function billentyu(nevelo: "a" | "az", kappeNev: string, lage: string, achtung?: string): TasteHu {
  const e = { nom: `${nevelo} ${kappeNev} billentyű`, akk: `${nevelo} ${kappeNev} billentyűt`, lage };
  return achtung ? { ...e, achtung } : e;
}

const HAT_BILLENTYU_HU = "A nyilak fölötti hat billentyűs blokkban";
const NYILAK_HU = "Jobbra lent, a nyilak között";
const LAPTOP_FN_HU = "Laptopon gyakran az Fn billentyűvel együtt.";

/** Die Tasten der Suchrunde, ungarisch - nach derselben Kennung wie das Wörterbuch. */
const TASTEN_HU: Readonly<Record<string, TasteHu | ((plattform: Plattform) => TasteHu)>> = {
  tabulator: billentyu("a", "Tab", "Bal kisujj: egy billentyűsorral feljebb, a szélen."),
  "pfeil-links": billentyu("a", "balra nyíl", `${NYILAK_HU}: a bal oldali.`),
  "pfeil-rechts": billentyu("a", "jobbra nyíl", `${NYILAK_HU}: a jobb oldali.`),
  "pfeil-auf": billentyu("a", "fel nyíl", `${NYILAK_HU}: a felső.`),
  "pfeil-ab": billentyu("a", "le nyíl", `${NYILAK_HU}: a fel nyíl billentyű alatt.`),
  pos1: billentyu("a", "Home", `${HAT_BILLENTYU_HU}, fent középen. ${LAPTOP_FN_HU}`),
  ende: billentyu("az", "End", `${HAT_BILLENTYU_HU}, lent középen. ${LAPTOP_FN_HU}`),
  "bild-auf": billentyu("a", "Page Up", `${HAT_BILLENTYU_HU}, fent jobbra. ${LAPTOP_FN_HU}`),
  "bild-ab": billentyu("a", "Page Down", `${HAT_BILLENTYU_HU}, lent jobbra. ${LAPTOP_FN_HU}`),
  leertaste: billentyu("a", "szóköz", "A hosszú billentyű a hüvelykujjaid alatt."),
  eingabe: billentyu("az", "Enter", "Jobb kéz, a szélen: a nagy billentyű."),
  zeilenschalter: billentyu("a", "Return", "Jobb kéz, a szélen: a nagy billentyű."),
  loeschtaste: (plattform) =>
    billentyu("a", plattform === "macos" ? "Delete" : "Backspace", "Jobb kéz, a szélen, két billentyűsorral feljebb."),
  entf: (plattform) =>
    plattform === "macos"
      ? billentyu(
          "a",
          "Delete",
          "Csak nagy billentyűzeten van, a Return billentyű mellett. Különben nyomd meg együtt az Fn és a Delete billentyűt.",
        )
      : billentyu("a", "Delete", `${HAT_BILLENTYU_HU}, lent balra. Laptopon fent jobbra.`),
  esc: billentyu("az", "Esc", "A bal felső sarokban."),
  umschalt: billentyu("a", "Shift", "Kettő van: az alsó sor bal és jobb szélén."),
  feststell: billentyu(
    "a",
    "Caps Lock",
    "Bal kisujj: egy lépés balra.",
    "Most csak nagybetűk jönnek? Nyomd meg még egyszer.",
  ),
  strg: billentyu("a", "Ctrl", "A bal alsó sarokban."),
  alt: billentyu("az", "Alt", "Lent, a szóköz billentyűtől balra."),
  altgr: billentyu("az", "AltGr", "Lent, a szóköz billentyűtől jobbra."),
  "windows-taste": billentyu("a", "Windows", "Lent balra, a Ctrl és az Alt billentyű között."),
  einfg: billentyu(
    "az",
    "Insert",
    `${HAT_BILLENTYU_HU}, fent balra, a Delete billentyű fölött. Laptopon gyakran hiányzik.`,
  ),
  befehlstaste: billentyu("a", "Command", "Lent balra, közvetlenül a szóköz billentyű mellett."),
  wahltaste: billentyu("az", "Option", "Lent balra, a széltől a harmadik billentyű."),
  ctrl: billentyu("a", "Control", "Lent balra, a széltől a második billentyű."),
  fn: billentyu("az", "Fn", "Lent balra, az első billentyű, egészen a sarokban. A MacBookon kisbetűvel fn áll rajta."),
};

function tasteHu(t: TastenName, plattform: Plattform): TasteHu {
  const e = TASTEN_HU[t.id];
  if (typeof e === "function") return e(plattform);
  // Sicherheitsnetz: eine neue Wörterbuch-Taste ohne ungarischen Eintrag - nach Doppelpunkt, damit weder Artikel noch Endung
  // geraten werden müssen (Regel 11/12).
  return e ?? { nom: `ez a billentyű: ${t.kurz ?? t.name}`, akk: `ezt a billentyűt: ${t.kurz ?? t.name}`, lage: "" };
}

/**
 * „a Tab billentyűt", „a balra nyíl billentyűt" - wie eine Taste im Satz heisst. Vorgabe Objekt (nach „Keresd meg",
 * „Nyomd meg"); „alanyeset" nach „Ez".
 */
export function tastenNennungHu(t: TastenName, plattform: Plattform, eset: EsetHu = "targyeset"): string {
  const e = tasteHu(t, plattform);
  return eset === "alanyeset" ? e.nom : e.akk;
}

/** Nur die Lage - oder "" (wie bei den anderen Sprachen). */
export function tastenLageHu(t: TastenName, plattform: Plattform): string {
  return tasteHu(t, plattform).lage;
}

/** Der Auftrag beim Suchen: „Keresd meg a Tab billentyűt. Bal kisujj: ..." */
export function ansageSuchauftragHu(t: TastenName, plattform: Plattform): string {
  const e = tasteHu(t, plattform);
  return e.lage ? `Keresd meg ${e.akk}. ${e.lage}` : `Keresd meg ${e.akk}.`;
}

/** Erster Treffer - erst die Wiederholung zählt („Megvan!" passt zu jeder Taste und jedem Kind). */
export function ansageGefundenHu(t: TastenName, plattform: Plattform): string {
  return `Megvan! Nyomj meg egy másik billentyűt, aztán újra ${tastenNennungHu(t, plattform)}.`;
}

/** Nach der Bestätigung - und, wo nötig, die Warnung (Caps Lock). */
export function ansageBestaetigtHu(t: TastenName, plattform: Plattform): string {
  const e = tasteHu(t, plattform);
  return e.achtung ? `Sikerült! ${e.achtung}` : "Sikerült!";
}

/** Eine Taste, die hier nicht geübt wird. */
export const ANSAGE_UNBEKANNT_HU = "Ezt a billentyűt itt nem gyakoroljuk.";

/** „Megtalált billentyűk: 20/20, szép munka." - die Zahl nach dem Doppelpunkt, nie am Satzende (Glossar §4 Falle 4). */
export function alleGefundenHu(anzahl: number): string {
  return `Megtalált billentyűk: ${anzahl}/${anzahl}, szép munka.`;
}

/**
 * Der Satz zu einem Schritt der Suchrunde - ungarisch. `art` und `naechste` kommen unverändert aus `suchSchritt`; nur die
 * Wörter sind neu.
 */
export function suchSatzHu(
  art: "daneben" | "gefunden" | "weiter" | "fertig",
  taste: TastenName | null,
  suchbar: readonly TastenName[],
  index: number,
  plattform: Plattform,
): string {
  const gesucht = suchbar[index]!;
  switch (art) {
    case "daneben": {
      const g = tasteHu(gesucht, plattform);
      if (!taste) return `${ANSAGE_UNBEKANNT_HU} Keresd meg ${g.akk}.`;
      return `Ez ${tastenNennungHu(taste, plattform, "alanyeset")}. Keresd meg ${g.akk}.${g.lage ? ` ${g.lage}` : ""}`;
    }
    case "gefunden":
      return ansageGefundenHu(gesucht, plattform);
    case "fertig":
      return `${ansageBestaetigtHu(gesucht, plattform)} ${alleGefundenHu(suchbar.length)}`;
    case "weiter":
      return `${ansageBestaetigtHu(gesucht, plattform)} ${ansageSuchauftragHu(suchbar[index + 1]!, plattform)}`;
  }
}

/* ══ Name einer Lerneinheit ═════════════════════════════════════════════════ */

/**
 * Der lesbare ungarische Name einer Lern-Einheit - für die Lehrkraft-Statistik, die Stand-Zeile und die Tastenkarte (Vorbild
 * `unitLabelCs`). Buchstaben gross wie auf der Kappe („R", „Ő" - jeder Akzentbuchstabe hat auf `hu` eine eigene Taste mit
 * seinem Grossbuchstaben), Ziffern nach Doppelpunkt (Regel 12), Satz- und Sonderzeichen mit ihrem ungarischen Namen.
 */
export function unitLabelHu(unit: string, _lernweg?: Lernweg): string {
  switch (unitKind(unit)) {
    case "shift":
      return "nagybetűk";
    case "ziffer":
      return `számjegy: ${unit}`;
    case "satzzeichen":
    case "sonderzeichen":
      return zeichenNameHu(unit);
    default: {
      if (unit === "ß") return "német sz (ß)";
      const gross = unit.toLocaleUpperCase("hu-HU");
      return gross !== unit && gross.length === 1 ? gross : zeichenNameHu(unit);
    }
  }
}

/* ══ Das Objekt für den Verteiler ═══════════════════════════════════════════ */

/** Alles, was „Billentyűk felfedezése" in dieser Sprache sagt. */
export const TASTEN_SATZ_HU: TastenErklaerungSatz = {
  sondertaste: sondertasteHu,
  nachKey: nachKeyHu,
  tasteKurz: TASTE_KURZ_HU,
  zeichen: ZEICHEN_HU,
  zeichenName: zeichenNameHu,
  akzente: AKZENTE_HU,
  erkundenWoerter: ERKUNDEN_WOERTER_HU,
  eigeneKombinationen: EIGENE_KOMBINATIONEN_HU,
  wirkung: wirkungHu,
  ort: ORT_HU,
  aufzaehlung: aufzaehlungHu,
  aufdruckGross: (key) => key.toLocaleUpperCase("hu-HU"),
};
