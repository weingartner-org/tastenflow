/**
 * ★★★ DIE LEKTIONEN DES WEGES „hu" (Ungarisch) - F4-HU (25.10.2026), vorher leerer Einhängepunkt (G3c-VERTEILER).
 *
 * Bauart wie `curriculumCs.ts`; die Rechnung (Tasten je Lektion, Griffe aus den Daten der Tastatur, `introByLayout`) steht im
 * `lektionenBaukasten.ts`. Neu auf Ungarisch geschrieben, nichts übersetzt. Begriffe nach dem Glossar (`glossar/GLOSSAR-hu.md` §2.1):
 * *alapsor*, *alapállás*, *felső sor*, *alsó sor*, *számsor*, *kisujj · gyűrűsujj · középső ujj · mutatóujj*, *Shift*, *AltGr*,
 * *szóköz*, *lecke*; Kinder werden geduzt (*te*: „Nyomd meg", Bauplan H12); Tastenwege statt Maus; nur der Bindestrich `-`;
 * Beispielwörter in „…” (U+201E/U+201D).
 *
 * ── DIE REGEL (wie cs) ───────────────────────────────────────────────────────────────────────────────────────────────
 * Jede Lektion führt NUR Tasten ein, die in der Reihenfolge des Weges (`lernweg.ts#HU_LETTER_ORDER`, Befund F4-HU-RO-NL §2) bis
 * dahin dran sind: die Tasten aller Lektionen hintereinander SIND `introOrder("hu")` - auf `hu` (QWERTZ) und `hu-101` (QWERTY).
 * Die Griffe (Finger, Reihe, Lage zur Grundstellung, Shift/AltGr) werden gerechnet, nie geschrieben. Die erste Lektion bringt die
 * Zeichen auf KeyF/KeyJ der Haupttastatur (`heimZeichenDesWeges`, Falle 41). Wächter: `tests/tastenflow-lektionen-hu.test.ts`.
 *
 * ★ Ungarische Besonderheiten, die hier ausgesprochen werden: alle neun Akzentbuchstaben haben eine eigene Taste (der Grossbuchstabe
 * kommt mit Shift); die `0` steht auf `hu` LINKS von der `1`, wo sonst die 0 ist, liegt `ö` (Bauplan H7); auf `hu-101` ist die 0
 * AltGr + í. Die Doppelbuchstaben (`sz`, `gy`, `ny` …) sind zwei Tasten.
 */
import type { Lesson } from "./curriculum";
import type { FingerId, KeyAccess } from "./fingers";
import { heimZeichenDesWeges } from "./heimtasten";
import type { KeyboardLayout, LayoutId } from "./layouts";
import { fingerTeile, lektionenJeTastatur, type GriffSaetze, type Lage, type LektionsBauplan } from "./lektionenBaukasten";
import { kappeFuer } from "./sprachRegister";

// ── Namen ────────────────────────────────────────────────────────────────────

/** Was auf der Kappe steht: Buchstaben gross (Ő, Ű), sonst das Zeichen; Komma, Punkt und Bindestrich mit Namen. */
function kappe(k: string): string {
  if (k === ",") return "vessző";
  if (k === ".") return "pont";
  if (k === "-") return "kötőjel";
  return kappeFuer(k, "hu");
}

/** Der ungarische Artikel vor dem gesprochenen Namen (az F = „az ef", a K = „a ká", az 1 = „az egy", az ö). */
function nevelo(name: string): string {
  return /^[AÁEÉIÍOÓÖŐUÚÜŰFLMNRSXY15aáeéiíoóöőuúüű]/.test(name) ? "az" : "a";
}

const mit = (k: string): string => `${nevelo(kappe(k))} ${kappe(k)}`;

/** „F és J", „A, B és C". */
function aufzaehlen(teile: readonly string[]): string {
  if (teile.length <= 1) return teile.join("");
  return `${teile.slice(0, -1).join(", ")} és ${teile[teile.length - 1]}`;
}
const kappen = (t: readonly string[]): string => aufzaehlen(t.map((k) => kappeFuer(k, "hu")));

const FINGER: Record<"kleiner" | "ring" | "mittel" | "zeige" | "daumen", string> = {
  kleiner: "kisujj", ring: "gyűrűsujj", mittel: "középső ujj", zeige: "mutatóujj", daumen: "hüvelykujj",
};
function fingerName(f: FingerId): string {
  const { hand, art } = fingerTeile(f);
  return hand === null ? FINGER[art] : `${hand === "links" ? "bal" : "jobb"} ${FINGER[art]}`;
}

const SOROK = ["számsor", "felső sor", "alapsor", "alsó sor"];

/** „bal mutatóujj, az F billentyűtől jobbra" - Finger und Lage. */
function lageText(l: Lage): string {
  const finger = fingerName(l.finger);
  if (l.istHeim) return `${finger}, alapállás`;
  if (!l.heim) return `${finger}, ${SOROK[l.reihe]}`;
  const irany = l.richtung === "links" ? "balra" : "jobbra";
  const weit = l.abstand >= 3 ? "három billentyűvel " : l.abstand === 2 ? "két billentyűvel " : "";
  const tol = `${mit(l.heim)} billentyűtől ${weit}${irany}`;
  if (l.reihe === 2) return `${finger}, ${tol}`;
  if (l.abstand === 0) return `${finger}, ${SOROK[l.reihe]}, közvetlenül ${mit(l.heim)} billentyű ${l.reihe === 3 ? "alatt" : "fölött"}`;
  return `${finger}, ${SOROK[l.reihe]}, ${tol}`;
}

function zusatz(z: KeyAccess): string {
  if (z.mod === "shift") return "tartsd lenyomva a másik kezeddel a Shiftet, és nyomd meg ";
  if (z.mod === "altgr") return "tartsd lenyomva az AltGr billentyűt, és nyomd meg ";
  return "nyomd meg ";
}

/** Zeichennamen nach dem Glossar (§2.8, `SPOKEN_HU`): der Name steht vor dem Zeichen. */
const ZEICHEN: Readonly<Record<string, string>> = {
  ".": "pont", ",": "vessző", "?": "kérdőjel", "!": "felkiáltójel", "-": "kötőjel", ";": "pontosvessző", ":": "kettőspont",
  "\"": "idézőjel", "'": "aposztróf", "(": "nyitó zárójel", ")": "záró zárójel", "%": "százalékjel", "/": "perjel", "+": "plusz",
  "=": "egyenlőségjel", "_": "aláhúzásjel", "*": "csillag", "&": "és-jel", "<": "kisebb, mint", ">": "nagyobb, mint", "$": "dollár",
  "@": "kukac", "#": "kettőskereszt", "[": "nyitó szögletes zárójel", "]": "záró szögletes zárójel", "{": "nyitó kapcsos zárójel",
  "}": "záró kapcsos zárójel", "|": "függőleges vonal", "\\": "fordított perjel", "€": "euró",
};

const SAETZE: GriffSaetze = {
  griff(u, lage, zugang) {
    const name = /^\p{L}$/u.test(u) || /^\d$/.test(u) ? kappeFuer(u, "hu") : ZEICHEN[u] ? `${ZEICHEN[u]} (${u})` : u;
    if (zugang && (zugang.mod || zugang.base !== u)) {
      return `${name}: ${zusatz(zugang)}${mit(zugang.base)} billentyűt${lage ? ` (${lageText(lage)})` : ""}.`;
    }
    if (lage) return `${name}: ${lageText(lage)}.`;
    return `${name}: a helye ezen a billentyűzeten még nincs leírva.`;
  },
};

// ── Die Sonderteile ──────────────────────────────────────────────────────────

function shiftTeil(): string {
  return (
    "Nagybetűt úgy írsz, hogy a másik kezeddel lenyomva tartod a Shiftet: a billentyűzet bal feléről jövő betűhöz a jobb " +
    "Shiftet, a jobb feléről jövőhöz a bal Shiftet. Mindkét Shiftet a kisujjad nyomja. Az ékezetes betűk nagybetűje is így " +
    "készül: Shift és a betű saját billentyűje."
  );
}

function szamTeil(_t: readonly string[], layout: KeyboardLayout): string {
  const nulla = layout.access["0"];
  if (nulla?.mod === "altgr") {
    return (
      "A számsor bal szélén az í áll, a 0-t az AltGr billentyűvel írod: tartsd lenyomva az AltGr billentyűt, és nyomd meg " +
      `${mit(nulla.base)} billentyűt. Ahol más billentyűzeten a 0 van, ott az ö áll. A többi számot minden ujj a saját oszlopában ` +
      "éri el."
    );
  }
  return (
    "A számsor bal szélén a 0 áll, az 1 előtt - ahol más billentyűzeten a 0 van, ott az ö áll, utána az ü és az ó. Minden ujj a " +
    "saját oszlopában megy fel: 0 1 2 3 4 5 a bal kéz, 6 7 8 9 a jobb kéz."
  );
}

// ── Die Folge ────────────────────────────────────────────────────────────────

const fix = (szoveg: string) => () => szoveg;
const SOR = (t: readonly string[]) => `Alapsor: ${kappen(t)}`;

const BAUPLAENE: readonly LektionsBauplan[] = [
  {
    id: "hu-alap-1", kind: "home",
    // Falle 41: die Zeichen auf KeyF/KeyJ der Haupttastatur (auf `hu` f und j) - erst beim Bauen gelesen, nie beim Laden.
    get einheiten() {
      return [...heimZeichenDesWeges("hu")];
    },
    titel: SOR,
    vorspann: fix(
      "Tedd az ujjaidat az alapsorra - ez az alapállás. Az F és a J billentyűn kis kiemelkedést érzel: így nézés nélkül is " +
        "megtalálod. Ezzel a két billentyűvel kezdesz, a két mutatóujjaddal. Minden ujj innen indul, és ide tér vissza.",
    ),
  },
  {
    id: "hu-alap-2", kind: "home", einheiten: ["d", "k"], titel: SOR,
    vorspann: fix("A mutatóujjak mellé jönnek a középső ujjak: a D bal oldalon, a K jobb oldalon. A mutatóujjak maradnak a helyükön."),
  },
  {
    id: "hu-alap-3", kind: "home", einheiten: ["s", "l"], titel: SOR,
    vorspann: fix("Most jönnek a gyűrűsujjak: az S bal oldalon, az L jobb oldalon. Az ujjaid lazák és könnyűek maradnak."),
  },
  {
    id: "hu-alap-4", kind: "home", einheiten: ["a", "é"],
    titel: (t) => `A teljes alapsor: ${kappen(t)}`,
    vorspann: fix(
      "A bal kisujjad az A-ra kerül, a jobb kisujjad az É-re, az L mellett jobbra. Az é-nek saját billentyűje van. Most már " +
        "kész az alapsor: nyolc ujj nyolc billentyűn, a hüvelykujjak a szóközön. Jönnek az első szavak: „fa”, „fal”, „dal”, " +
        "„kés” és „lakk”.",
    ),
  },
  {
    id: "hu-gyakori-1", kind: "letters", einheiten: ["e", "i"],
    titel: (t) => `Gyakori betűk: ${kappen(t)}`,
    vorspann: fix("Az E a magyar nyelv leggyakoribb betűje. Az E-vel és az I-vel már írhatod: „fej”, „kel”, „kis”, „ki” és „esik”."),
  },
  {
    id: "hu-gyakori-2", kind: "letters", einheiten: ["t", "n"],
    titel: (t) => `Gyakori betűk: ${kappen(t)}`,
    vorspann: fix("A T-vel és az N-nel: „tej”, „tea”, „test”, „kint”, „lent” és „fent”."),
  },
  {
    id: "hu-gyakori-3", kind: "letters", einheiten: ["z", "m"],
    titel: (t) => `Gyakori betűk: ${kappen(t)}`,
    vorspann: fix(
      "A Z és az M nagyon gyakori: a Z-vel jön „az” és „ez”, az M-mel „nem”, „mi”, „mese” és „mind”. Az sz két billentyű, " +
        "S és Z: „szem”.",
    ),
  },
  {
    id: "hu-gyakori-4", kind: "letters", einheiten: ["r", "o"],
    titel: (t) => `Gyakori betűk: ${kappen(t)}`,
    vorspann: fix("Az R-rel és az O-val: „orr”, „sor”, „ott”, „kert”, „okos”, „toll” és „rossz”."),
  },
  {
    id: "hu-gyakori-5", kind: "letters", einheiten: ["g", "á"],
    titel: (t) => `Gyakori betűk: ${kappen(t)}`,
    vorspann: fix(
      "A G és az á - az á-nak saját billentyűje van, az é mellett jobbra. Az ékezet más szót ad: a „kar” nem ugyanaz, mint a " +
        "„kár”. Írd: „fog”, „ág”, „tál”, „magas” és „régi”.",
    ),
  },
  {
    id: "hu-gyakori-6", kind: "letters", einheiten: ["y", "h"],
    titel: (t) => `Gyakori betűk: ${kappen(t)}`,
    vorspann: fix(
      "Az Y-nal jönnek a kettős betűk: gy, ny, ty, ly - mindegyik két billentyű. A H-val együtt már írhatod: „ház”, „hal”, " +
        "„haj”, „hegy”, „nagy” és „anya”.",
    ),
  },
  {
    id: "hu-nagybetu", kind: "shift", einheiten: [], enablesShift: true,
    titel: () => "Nagybetűk a Shift billentyűvel",
    vorspann: fix(
      "Eddig a Tastenflow írta helyetted a nagybetűket. Mostantól a kezed írja őket: „Anna”, „Ádám”, „Imre”, „Gergely”, " +
        "„Zsolt”, „Szeged” és „Eger”. Nagybetűvel az elején már egész mondatot is írsz: „Ez a ház nagy”.",
    ),
    griffe: shiftTeil,
  },
  {
    id: "hu-irasjel-1", kind: "punctuation", einheiten: [".", ",", "?"],
    titel: () => "Pont, vessző és kérdőjel: . , ?",
    vorspann: fix(
      "A mondat nagybetűvel kezdődik és ponttal végződik. A vessző részekre osztja, a kérdőjel lezárja a kérdést. Ezek elé " +
        "nem kell szóköz, utánuk igen. Próbáld: „Mi ez?” és „Igen, ez az.”",
    ),
  },
  {
    id: "hu-betuk-1", kind: "letters", einheiten: ["v", "b", "u"],
    titel: (t) => `További betűk: ${kappen(t)}`,
    vorspann: fix("V, B és U: „vers”, „baba”, „busz”, „kutya”, „levél” és „uborka”."),
  },
  {
    id: "hu-betuk-2", kind: "letters", einheiten: ["c", "p"],
    titel: (t) => `További betűk: ${kappen(t)}`,
    vorspann: fix("C és P: „cica”, „utca”, „ceruza”, „pad”, „pénz” és „lepke”. A cs két billentyű: C és S."),
  },
  {
    id: "hu-ekezet-1", kind: "letters", einheiten: ["ö", "ó", "ő"],
    titel: (t) => `Ékezetes betűk: ${kappen(t)}`,
    vorspann: fix(
      "Az ö és az ó a számsor jobb oldalán van, az ő a P mellett jobbra. Mindhárom más betű: „öt”, „kör”, „ló”, „óra”, „hó”, " +
        "„kő”, „erdő” és „cipő”.",
    ),
  },
  {
    id: "hu-ekezet-2", kind: "letters", einheiten: ["ü", "í", "ú", "ű"],
    titel: (t) => `Ékezetes betűk: ${kappen(t)}`,
    vorspann: fix(
      "Az utolsó ékezetes betűk: ü, í, ú és ű. Az ű és az ü más billentyű, és gyakran más szót is ad. Írd: „ül”, „fül”, „víz”, " +
        "„kíván”, „út”, „úszik”, „tűz”, „fű” és „gyűrű”.",
    ),
  },
  {
    id: "hu-ritka", kind: "letters", einheiten: ["w", "x", "q"],
    titel: (t) => `Ritka betűk: ${kappen(t)}`,
    vorspann: fix("A W, az X és a Q főleg nevekben és idegen szavakban fordul elő: „Wesselényi”, „Xénia”, „taxi” és „Aquincum”."),
  },
  {
    id: "hu-irasjel-2", kind: "punctuation", einheiten: ["!", "-", ";", ":", "\"", "'", "(", ")"],
    titel: (t) => `További írásjelek: ${t.join(" ")}`,
    vorspann: fix(
      "A felkiáltójel a felkiáltást zárja, a kötőjel szavakat köt össze, a kettőspont és a pontosvessző felsorolást és " +
        "magyarázatot vezet be, az idézőjel szavakat fog közre, a zárójel megjegyzést. Próbáld: „Vigyázz!”, „Hurrá!”, " +
        "„nagy-nagy” és „(megjegyzés)”.",
    ),
  },
  {
    id: "hu-szamok", kind: "numbers", einheiten: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    titel: () => "Számsor",
    vorspann: fix("Dátumok, idők, árak és eredmények: most jönnek a számok."),
    griffe: szamTeil,
  },
  {
    id: "hu-szimbolum-1", kind: "symbols", einheiten: ["%", "/", "+", "=", "_", "*", "&", "<", ">", "$"],
    titel: (t) => `Szimbólumok: ${t.join(" ")}`,
    vorspann: fix("Ezek a jelek a számoláshoz, a százalékhoz és a számítógépes munkához kellenek. Itt a pontosság fontosabb, mint a gyorsaság."),
  },
  {
    id: "hu-szimbolum-2", kind: "symbols", einheiten: ["@", "#", "[", "]", "{", "}", "|", "\\", "€"],
    titel: (t) => `További szimbólumok: ${t.join(" ")}`,
    vorspann: fix("Jelek e-mail-címekhez, árakhoz és programkódhoz. Ezek a legnehezebbek, ezért jönnek a végén."),
  },
  {
    id: "hu-szovegek", kind: "text", einheiten: [], corpusKinds: ["satz"],
    titel: () => "Szövegek",
    vorspann: fix(
      "Most már az egész billentyűzet a tiéd, és egész szövegeket írsz: a Balatontól a Dunáig, Kolozsvártól Szabadkáig, " +
        "történeteket az iskoláról, a sportról, az állatokról és egy hétköznapi napról.",
    ),
  },
];

// ── Bauen je Tastatur ────────────────────────────────────────────────────────

/** Die Folge der Bauplan-IDs, zum Nachprüfen im Wächter. */
export const HU_LEKTIONS_IDS: readonly string[] = BAUPLAENE.map((b) => b.id);

/** Der GESCHRIEBENE erste Absatz einer Lektion (für den Beispielwort-Wächter). */
export function huLektionsVorspannFuer(id: string, tasten: readonly string[]): string {
  return BAUPLAENE.find((b) => b.id === id)?.vorspann(tasten) ?? "";
}

/** Die ungarischen Pflicht-Tastaturen (G3b): QWERTZ (Bezug) und QWERTY 101. */
const HU_LAYOUTS: readonly LayoutId[] = ["hu", "hu-101"];

const bauen = lektionenJeTastatur("hu", HU_LAYOUTS, BAUPLAENE, SAETZE);

/** Die Lektionen des Weges „hu" auf dieser Tastatur (gecacht; `introByLayout` trägt die andere Pflicht-Tastatur). */
export function huLektionenFuerLayout(layoutId: LayoutId): readonly Lesson[] {
  return bauen(layoutId);
}
