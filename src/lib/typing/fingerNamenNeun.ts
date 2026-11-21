/**
 * ★ O2-TASTATUR (30.10.2026): FINGER, REIHEN UND DIE FINGER-ANSAGE DER NEUN SPRACHEN (bg el hu nl pt br ro sv uk).
 *
 * Nur Daten - ohne Laufzeit-Import, damit `fingers.ts` sie laden kann (`freischaltung<Xx>.ts` importieren `fingers.ts`; ein
 * Rückimport wäre ein Kreis, und die Tabellen wären beim Aufbau noch `undefined`).
 * Die Finger- und Reihennamen sind dieselben wie in `freischaltung<Xx>.ts` und in den Glossaren §2.1 (Wächter
 * `tests/tastenflow-fingernamen-neun.test.ts` vergleicht sie mit den Sätzen der Freischalt-Feier).
 *
 * Die Bausätze: jede Sprache schreibt ihre eigenen Satzteile, nichts wird übersetzt zusammengesetzt. Tasten immer mit Kopfwort
 * („клавиша F", „toets F"), damit der Name ungebeugt bleibt (Regel 11 der Glossare). Kein Satz spricht über das Geschlecht des
 * Kindes. ⚠️ Ohne Muttersprachler-Lesung ([G]).
 */
import type { FingerId } from "./fingers";
import type { GeruestSprache } from "./sprachRegister";

export const FINGER_NEUN: Readonly<Record<GeruestSprache, Readonly<Record<FingerId, string>>>> = {
  bg: {
    "kleiner-links": "ляво кутре",
    "ring-links": "ляв безименен пръст",
    "mittel-links": "ляв среден пръст",
    "zeige-links": "ляв показалец",
    daumen: "палец",
    "zeige-rechts": "десен показалец",
    "mittel-rechts": "десен среден пръст",
    "ring-rechts": "десен безименен пръст",
    "kleiner-rechts": "дясно кутре",
  },
  el: {
    "kleiner-links": "αριστερό μικρό δάχτυλο",
    "ring-links": "αριστερός παράμεσος",
    "mittel-links": "αριστερός μέσος",
    "zeige-links": "αριστερός δείκτης",
    daumen: "αντίχειρας",
    "zeige-rechts": "δεξιός δείκτης",
    "mittel-rechts": "δεξιός μέσος",
    "ring-rechts": "δεξιός παράμεσος",
    "kleiner-rechts": "δεξί μικρό δάχτυλο",
  },
  hu: {
    "kleiner-links": "bal kisujj",
    "ring-links": "bal gyűrűsujj",
    "mittel-links": "bal középső ujj",
    "zeige-links": "bal mutatóujj",
    daumen: "hüvelykujj",
    "zeige-rechts": "jobb mutatóujj",
    "mittel-rechts": "jobb középső ujj",
    "ring-rechts": "jobb gyűrűsujj",
    "kleiner-rechts": "jobb kisujj",
  },
  nl: {
    "kleiner-links": "linkerpink",
    "ring-links": "linkerringvinger",
    "mittel-links": "linkermiddelvinger",
    "zeige-links": "linkerwijsvinger",
    daumen: "duim",
    "zeige-rechts": "rechterwijsvinger",
    "mittel-rechts": "rechtermiddelvinger",
    "ring-rechts": "rechterringvinger",
    "kleiner-rechts": "rechterpink",
  },
  pt: {
    "kleiner-links": "mindinho esquerdo",
    "ring-links": "anelar esquerdo",
    "mittel-links": "médio esquerdo",
    "zeige-links": "indicador esquerdo",
    daumen: "polegar",
    "zeige-rechts": "indicador direito",
    "mittel-rechts": "médio direito",
    "ring-rechts": "anelar direito",
    "kleiner-rechts": "mindinho direito",
  },
  br: {
    "kleiner-links": "mínimo esquerdo",
    "ring-links": "anelar esquerdo",
    "mittel-links": "médio esquerdo",
    "zeige-links": "indicador esquerdo",
    daumen: "polegar",
    "zeige-rechts": "indicador direito",
    "mittel-rechts": "médio direito",
    "ring-rechts": "anelar direito",
    "kleiner-rechts": "mínimo direito",
  },
  ro: {
    "kleiner-links": "degetul mic stâng",
    "ring-links": "inelarul stâng",
    "mittel-links": "mijlociul stâng",
    "zeige-links": "arătătorul stâng",
    daumen: "degetul mare",
    "zeige-rechts": "arătătorul drept",
    "mittel-rechts": "mijlociul drept",
    "ring-rechts": "inelarul drept",
    "kleiner-rechts": "degetul mic drept",
  },
  sv: {
    "kleiner-links": "vänster lillfinger",
    "ring-links": "vänster ringfinger",
    "mittel-links": "vänster långfinger",
    "zeige-links": "vänster pekfinger",
    daumen: "tumme",
    "zeige-rechts": "höger pekfinger",
    "mittel-rechts": "höger långfinger",
    "ring-rechts": "höger ringfinger",
    "kleiner-rechts": "höger lillfinger",
  },
  uk: {
    "kleiner-links": "лівий мізинець",
    "ring-links": "лівий безіменний палець",
    "mittel-links": "лівий середній палець",
    "zeige-links": "лівий вказівний палець",
    daumen: "великий палець",
    "zeige-rechts": "правий вказівний палець",
    "mittel-rechts": "правий середній палець",
    "ring-rechts": "правий безіменний палець",
    "kleiner-rechts": "правий мізинець",
  },
};

/** Dieselbe Reihenfolge wie `ROW_NAMES` in `fingers.ts`: Ziffernreihe, obere Reihe, Grundreihe, untere Reihe. */
export const REIHEN_NEUN: Readonly<Record<GeruestSprache, readonly string[]>> = {
  bg: ["ред с цифрите", "горен ред", "основен ред", "долен ред"],
  el: ["σειρά αριθμών", "πάνω σειρά", "βασική σειρά", "κάτω σειρά"],
  hu: ["számsor", "felső sor", "alapsor", "alsó sor"],
  nl: ["cijferrij", "bovenste rij", "basisrij", "onderste rij"],
  pt: ["fila dos números", "fila de cima", "fila de base", "fila de baixo"],
  br: ["fileira dos números", "fileira de cima", "fileira central", "fileira de baixo"],
  ro: ["șirul de cifre", "șirul de sus", "șirul de bază", "șirul de jos"],
  sv: ["sifferraden", "övre raden", "grundraden", "nedre raden"],
  uk: ["ряд цифр", "верхній ряд", "основний ряд", "нижній ряд"],
};

export type ShiftSeite = "links" | "rechts" | null;

/** Die Satzteile der Finger-Ansage einer Sprache - Vorbild `fingerGuideCs`. */
export interface FingerAnsageTeile {
  /** „Mezerník" - am Satzanfang. */
  leer: string;
  /** Die Leertaste als Objekt („stiskni mezerník"). */
  leerObjekt: string;
  /** „z klávesy F" - woher der Finger kommt. */
  von: (kappe: string) => string;
  /** „v základním postavení" - der Finger bleibt liegen. */
  grundstellung: string;
  /** „k tomu pravá klávesa Shift". */
  mitShift: (seite: ShiftSeite) => string;
  /** „k tomu klávesa Caps Lock". */
  mitCaps: string;
  /** Eine Taste als Objekt: „klávesu F". */
  taste: (kappe: string) => string;
  /** Die Umschalttaste als Objekt: „pravou klávesu Shift". */
  shiftObjekt: (seite: ShiftSeite) => string;
  /** Der Zusatz an einer Totaste: „s klávesou AltGr". */
  zusatz: (kappe: string) => string;
  /** „nejdřív mrtvá klávesa ´" - zuerst die Totaste. */
  zuerstTot: (name: string) => string;
  /** „potom klávesa E" - danach der Buchstabe. */
  dann: (kappe: string) => string;
  /** „mrtvá klávesa ´" - ein Zeichen, das die Totaste selbst liefert. */
  tot: (kappe: string) => string;
  /** „potom mezerník". */
  dannLeer: string;
  /** „podrž A a stiskni B". */
  halte: (halten: string, druecken: string) => string;
  /** „podrž A a k tomu B, potom stiskni C". */
  halteZwei: (a: string, b: string, druecken: string) => string;
  /** Der Name der Umschalttaste auf der Kappe. */
  shift: string;
  /** Der Name der Taste rechts neben der Leertaste. */
  altGr: string;
}

/** „az" oder „a" vor einem Tastennamen (nach der Aussprache, Glossar hu §2.9). */
const azHu = (k: string): string => (/^[AEIOUÁÉÍÓÖŐÚÜŰaeiouáéíóöőúüű15]/.test(k) ? `az ${k}` : `a ${k}`);

export const FINGER_ANSAGE_TEILE: Readonly<Record<GeruestSprache, FingerAnsageTeile>> = {
  bg: {
    leer: "Интервал",
    leerObjekt: "интервала",
    von: (k) => `от клавиша ${k}`,
    grundstellung: "от изходна позиция",
    mitShift: (s) => `заедно с ${s === "links" ? "левия " : s === "rechts" ? "десния " : ""}клавиш Shift`,
    mitCaps: "заедно с клавиша Caps Lock",
    taste: (k) => `клавиша ${k}`,
    shiftObjekt: (s) => `${s === "links" ? "левия " : s === "rechts" ? "десния " : ""}клавиш Shift`,
    zusatz: (k) => `с клавиша ${k}`,
    zuerstTot: (n) => `първо мъртвия клавиш ${n}`,
    dann: (k) => `после клавиша ${k}`,
    tot: (k) => `мъртвия клавиш ${k}`,
    dannLeer: "после интервала",
    halte: (a, b) => `задръж ${a} и натисни ${b}`,
    halteZwei: (a, b, c) => `задръж ${a} и ${b}, после натисни ${c}`,
    shift: "Shift",
    altGr: "AltGr",
  },
  el: {
    leer: "Πλήκτρο διαστήματος",
    leerObjekt: "το πλήκτρο διαστήματος",
    von: (k) => `από το πλήκτρο ${k}`,
    grundstellung: "στη βασική θέση",
    mitShift: (s) => `μαζί με το ${s === "links" ? "αριστερό " : s === "rechts" ? "δεξί " : ""}πλήκτρο Shift`,
    mitCaps: "μαζί με το πλήκτρο Caps Lock",
    taste: (k) => `το πλήκτρο ${k}`,
    shiftObjekt: (s) => `το ${s === "links" ? "αριστερό " : s === "rechts" ? "δεξί " : ""}πλήκτρο Shift`,
    zusatz: (k) => `με το πλήκτρο ${k}`,
    zuerstTot: (n) => `πρώτα το νεκρό πλήκτρο ${n}`,
    dann: (k) => `μετά το πλήκτρο ${k}`,
    tot: (k) => `το νεκρό πλήκτρο ${k}`,
    dannLeer: "μετά το πλήκτρο διαστήματος",
    halte: (a, b) => `κράτα πατημένο ${a} και πάτα ${b}`,
    halteZwei: (a, b, c) => `κράτα πατημένα ${a} και ${b}, μετά πάτα ${c}`,
    shift: "Shift",
    altGr: "Alt Gr",
  },
  hu: {
    leer: "Szóköz",
    leerObjekt: "a szóközt",
    von: (k) => `${azHu(k)} billentyűről`,
    grundstellung: "alapállásban",
    mitShift: (s) => `${s === "links" ? "a bal " : s === "rechts" ? "a jobb " : "a "}Shift billentyűvel együtt`,
    mitCaps: "a Caps Lock billentyűvel együtt",
    taste: (k) => `${azHu(k)} billentyűt`,
    shiftObjekt: (s) => `${s === "links" ? "a bal " : s === "rechts" ? "a jobb " : "a "}Shift billentyűt`,
    zusatz: (k) => `${azHu(k)} billentyűvel`,
    zuerstTot: (n) => `először ${azHu(n)} holtbillentyű`,
    dann: (k) => `utána ${azHu(k)} billentyű`,
    tot: (k) => `${azHu(k)} holtbillentyű`,
    dannLeer: "utána a szóköz",
    halte: (a, b) => `tartsd lenyomva ${a}, és nyomd meg ${b}`,
    halteZwei: (a, b, c) => `tartsd lenyomva ${a} és ${b}, aztán nyomd meg ${c}`,
    shift: "Shift",
    altGr: "AltGr",
  },
  nl: {
    leer: "Spatiebalk",
    leerObjekt: "de spatiebalk",
    von: (k) => `vanaf toets ${k}`,
    grundstellung: "in de basishouding",
    mitShift: (s) => `samen met de ${s === "links" ? "linker " : s === "rechts" ? "rechter " : ""}Shift-toets`,
    mitCaps: "samen met de toets Caps Lock",
    taste: (k) => `toets ${k}`,
    shiftObjekt: (s) => `de ${s === "links" ? "linker " : s === "rechts" ? "rechter " : ""}Shift-toets`,
    zusatz: (k) => `met toets ${k}`,
    zuerstTot: (n) => `eerst de dode toets ${n}`,
    dann: (k) => `dan toets ${k}`,
    tot: (k) => `de dode toets ${k}`,
    dannLeer: "dan de spatiebalk",
    halte: (a, b) => `houd ${a} ingedrukt en druk op ${b}`,
    halteZwei: (a, b, c) => `houd ${a} en ${b} ingedrukt, druk dan op ${c}`,
    shift: "Shift",
    altGr: "Alt Gr",
  },
  pt: {
    leer: "Barra de espaço",
    leerObjekt: "a barra de espaço",
    von: (k) => `a partir da tecla ${k}`,
    grundstellung: "na posição inicial",
    mitShift: (s) => `com a tecla Shift${s === "links" ? " esquerda" : s === "rechts" ? " direita" : ""}`,
    mitCaps: "com a tecla Caps Lock",
    taste: (k) => `a tecla ${k}`,
    shiftObjekt: (s) => `a tecla Shift${s === "links" ? " esquerda" : s === "rechts" ? " direita" : ""}`,
    zusatz: (k) => `com a tecla ${k}`,
    zuerstTot: (n) => `primeiro a tecla de acento ${n}`,
    dann: (k) => `depois a tecla ${k}`,
    tot: (k) => `a tecla de acento ${k}`,
    dannLeer: "depois a barra de espaço",
    halte: (a, b) => `mantém premida ${a} e prime ${b}`,
    halteZwei: (a, b, c) => `mantém premidas ${a} e ${b}, depois prime ${c}`,
    shift: "Shift",
    altGr: "Alt Gr",
  },
  br: {
    leer: "Barra de espaço",
    leerObjekt: "a barra de espaço",
    von: (k) => `a partir da tecla ${k}`,
    grundstellung: "na posição inicial",
    mitShift: (s) => `com a tecla Shift${s === "links" ? " esquerda" : s === "rechts" ? " direita" : ""}`,
    mitCaps: "com a tecla Caps Lock",
    taste: (k) => `a tecla ${k}`,
    shiftObjekt: (s) => `a tecla Shift${s === "links" ? " esquerda" : s === "rechts" ? " direita" : ""}`,
    zusatz: (k) => `com a tecla ${k}`,
    zuerstTot: (n) => `primeiro a tecla de acento ${n}`,
    dann: (k) => `depois a tecla ${k}`,
    tot: (k) => `a tecla de acento ${k}`,
    dannLeer: "depois a barra de espaço",
    halte: (a, b) => `mantenha pressionada ${a} e pressione ${b}`,
    halteZwei: (a, b, c) => `mantenha pressionadas ${a} e ${b}, depois pressione ${c}`,
    shift: "Shift",
    altGr: "Alt Gr",
  },
  ro: {
    leer: "Bara de spațiu",
    leerObjekt: "bara de spațiu",
    von: (k) => `de pe tasta ${k}`,
    grundstellung: "în poziția de bază",
    mitShift: (s) => `împreună cu tasta Shift${s === "links" ? " din stânga" : s === "rechts" ? " din dreapta" : ""}`,
    mitCaps: "împreună cu tasta Caps Lock",
    taste: (k) => `tasta ${k}`,
    shiftObjekt: (s) => `tasta Shift${s === "links" ? " din stânga" : s === "rechts" ? " din dreapta" : ""}`,
    zusatz: (k) => `cu tasta ${k}`,
    zuerstTot: (n) => `mai întâi tasta moartă ${n}`,
    dann: (k) => `apoi tasta ${k}`,
    tot: (k) => `tasta moartă ${k}`,
    dannLeer: "apoi bara de spațiu",
    halte: (a, b) => `ține apăsată ${a} și apasă ${b}`,
    halteZwei: (a, b, c) => `ține apăsate ${a} și ${b}, apoi apasă ${c}`,
    shift: "Shift",
    altGr: "Alt Gr",
  },
  sv: {
    leer: "Mellanslag",
    leerObjekt: "mellanslag",
    von: (k) => `från tangenten ${k}`,
    grundstellung: "i grundställning",
    mitShift: (s) => `tillsammans med ${s === "links" ? "vänster " : s === "rechts" ? "höger " : ""}Skift`,
    mitCaps: "tillsammans med Caps Lock",
    taste: (k) => `tangenten ${k}`,
    shiftObjekt: (s) => `${s === "links" ? "vänster " : s === "rechts" ? "höger " : ""}Skift`,
    zusatz: (k) => `med tangenten ${k}`,
    zuerstTot: (n) => `först den döda tangenten ${n}`,
    dann: (k) => `sedan tangenten ${k}`,
    tot: (k) => `den döda tangenten ${k}`,
    dannLeer: "sedan mellanslag",
    halte: (a, b) => `håll ned ${a} och tryck på ${b}`,
    halteZwei: (a, b, c) => `håll ned ${a} och ${b}, tryck sedan på ${c}`,
    shift: "Skift",
    altGr: "Alt Gr",
  },
  uk: {
    leer: "Пробіл",
    leerObjekt: "пробіл",
    von: (k) => `від клавіші ${k}`,
    grundstellung: "в основному положенні",
    mitShift: (s) => `разом із ${s === "links" ? "лівою " : s === "rechts" ? "правою " : ""}клавішею Shift`,
    mitCaps: "разом із клавішею Caps Lock",
    taste: (k) => `клавішу ${k}`,
    shiftObjekt: (s) => `${s === "links" ? "ліву " : s === "rechts" ? "праву " : ""}клавішу Shift`,
    zusatz: (k) => `із клавішею ${k}`,
    zuerstTot: (n) => `спочатку мертву клавішу ${n}`,
    dann: (k) => `потім клавішу ${k}`,
    tot: (k) => `мертву клавішу ${k}`,
    dannLeer: "потім пробіл",
    halte: (a, b) => `утримуй ${a} і натисни ${b}`,
    halteZwei: (a, b, c) => `утримуй ${a} і ${b}, потім натисни ${c}`,
    shift: "Shift",
    altGr: "AltGr",
  },
};
