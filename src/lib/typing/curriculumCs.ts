/**
 * ★★★ DIE LEKTIONEN DES WEGES „cs" (CS-W, 09.10.2026).
 *
 * Vorbild: `curriculumIt.ts` (Bauart, Griffe aus den Daten der Tastatur) und `curriculumEs.ts`. Neu auf
 * Tschechisch geschrieben, nichts übersetzt (Johannes: *„keine texte werden übersetzt"*, *„denke wie die
 * menschen in den jeweiligen ländern"*). Kinder und Selbstlernende werden geduzt (Glossar Regel 1);
 * Begriffe aus `recherche-tschechisch-2026-10-02/GLOSSAR-cs.md` §1/§2.1 (základní řada, základní postavení,
 * hmatové výstupky na F a J, Shift, mrtvá klávesa, háček, čárka nad písmenem, mezerník, ukazováček,
 * prostředníček, prsteníček, malíček); Tastenwege statt Maus; Tastennamen nie gebeugt, immer nach dem
 * Kopfwort „klávesa" (Regel 11); keine Vergangenheit der 2. Person und kein Geschlecht der tippenden Person
 * (Regel 2); nur der Bindestrich `-` (Regel 7); Beispielwörter in „…“ (U+201E/U+201C, Regel 7).
 *
 * ── DIE REGEL, AN DER ALLES HÄNGT (wie `curriculumIt.ts`/`curriculumEs.ts`) ─────────────────────
 * Jede Lektion führt NUR Tasten ein, die in der Reihenfolge des Weges (`lernweg.ts#CS_LETTER_ORDER`,
 * Befund F4-cs) bis dahin dran sind: Die Tasten aller Lektionen hintereinander SIND `introOrder("cs")` -
 * auf JEDER Tastatur. Wächter: `tests/tastenflow-lektionen-cs.test.ts`.
 *
 * ── ZWEI TASTATUREN, EINE FOLGE ──────────────────────────────────────────────────────────────────
 * `cs` (QWERTZ) und `cs-qwerty` haben dieselbe Grundreihe `a s d f | j k l ů` (die achte Heimtaste ist `ů`),
 * dieselbe Zahlenreihe mit `ě š č ř ž ý á í é` und dieselben Totasten; nur `y` und `z` tauschen die Plätze,
 * und die AltGr-Ebene der Sonderzeichen liegt auf anderen Tasten. Die Folge zählt den Tastenwert, darum gilt
 * EINE Liste von Lektionen; verschieden sind die GRIFFE - sie werden aus den Daten der Tastatur gerechnet
 * (`layouts.ts`), nie geschrieben. Die IDs bleiben auf jeder Tastatur gleich (der Fortschritt hängt an der ID).
 *
 * ★★★ Tschechische Besonderheiten, die hier ausgesprochen werden:
 *  · die Zahlenreihe trägt BUCHSTABEN (`ě š č ř ž ý á í é`); die Ziffern kommen nur mit Umschalt (Lektion
 *    „Číselná řada");
 *  · Umschalt gibt auf diesen Tasten nie den Grossbuchstaben - Č Š Ř Ž Ě Ď Ť Ň und Á É Í Ó Ú Ý entstehen mit
 *    der Totaste (Háček `ˇ` bzw. Čárka `´`), dann Umschalt und Buchstabe;
 *  · `ď ť ň` und `ó` haben keine eigene Taste: Háček bzw. Čárka + Buchstabe;
 *  · das grosse `Ů` gibt es nur mit der Feststelltaste - kein Beispielwort und keine Übungszeile trägt es.
 *
 * ── WAS GERECHNET IST UND WAS GESCHRIEBEN ────────────────────────────────────────────────────────
 * Geschrieben: Titel und der erste Absatz (was die Lektion bringt, Beispielwörter). Gerechnet: die GRIFFE -
 * Finger, Reihe, Lage zur Grundstellung, Shift/AltGr (am Mac Option) - aus den Daten der Tastatur. Ein Griff,
 * den die Tastatur nicht kennt, wird nicht geraten.
 */
import type { Lesson, LessonKind } from "./curriculum";
import { SHIFT_UNIT, achteGrundtasteFuerLayout } from "./letters";
import { lernwegDef } from "./lernweg";
import { layoutById, layoutIndex, type KeyboardLayout, type LayoutId } from "./layouts";
import { FINGERS, fingerName, kappeCs, spokenLabel, type FingerId, type KeyAccess } from "./fingers";
// ★ G2b-1: Gross-/Klein ausdrücklich in der Sprache dieser Lektionen ("cs").
import { kleinFuer } from "./sprachRegister";

interface CsLektionsBauplan {
  id: string;
  kind: LessonKind;
  /** Die neuen Einheiten, genau in der Reihenfolge des Weges. */
  einheiten: readonly string[];
  enablesShift?: boolean;
  corpusKinds?: Lesson["corpusKinds"];
  /** Der Titel aus den Tasten, die auf DIESER Tastatur ankommen. */
  titel: (tasten: readonly string[], layout: KeyboardLayout) => string;
  /** Der geschriebene erste Absatz - aus den Tasten, die auf DIESER Tastatur ankommen. */
  vorspann: (tasten: readonly string[]) => string;
  /** Statt der gerechneten Griffe ein eigener Teil (Shift, Ziffern, Schluss). */
  griffe?: (tasten: readonly string[], layout: KeyboardLayout) => string;
}

// ── Tastennamen ───────────────────────────────────────────────────────────────

/** Buchstaben a-z gross (wie auf der Kappe); Buchstaben mit Zeichen bleiben so, wie sie auf der Kappe stehen. */
function kappe(k: string): string {
  return /^[a-z]$/.test(k) ? k.toUpperCase() : k;
}

/** Aufzählung mit „a": „F a J", „A, B a C". */
function aufzaehlen(teile: readonly string[]): string {
  if (teile.length <= 1) return teile.join("");
  return `${teile.slice(0, -1).join(", ")} a ${teile[teile.length - 1]}`;
}

function kappen(tasten: readonly string[]): string {
  return aufzaehlen(tasten.map(kappe));
}

/**
 * Der Anfang eines Griff-Satzes: Buchstaben und Ziffern „Klávesa F", „Klávesa ě (e s háčkem)", Totasten „Mrtvá klávesa
 * háček", sonst „Znak procento (%)" - der Name steht vor dem Zeichen (Glossar §2.8, `SPOKEN_CS`).
 */
function satzAnfang(u: string): string {
  if (u === "ˇ" || u === "´" || u === "¨") return `Mrtvá klávesa ${spokenLabel(u, "cs")}`;
  if (/^[a-z0-9]$/.test(u)) return `Klávesa ${kappe(u)}`;
  if (/^\p{L}$/u.test(u)) return `Klávesa ${u} (${spokenLabel(u, "cs")})`;
  const name = spokenLabel(u, "cs");
  return name === u ? `Znak ${u}` : `Znak ${name} (${u})`;
}

// ── Die Folge des Weges auf einer Tastatur ───────────────────────────────────

/** Die Reihenfolge des Weges „cs" auf dieser Tastatur (wie `introOrder`, aber für ein beliebiges Layout). */
function reihenfolgeAuf(layout: KeyboardLayout): string[] {
  const fehlt = layoutIndex(layout).missing;
  const vorhanden = lernwegDef("cs").introOrder.filter((u) => !fehlt.has(kleinFuer(u, "cs")));
  return achteGrundtasteFuerLayout(vorhanden, "cs", layout.id);
}

// ── Griffe aus den Daten der Tastatur ────────────────────────────────────────

const RADY = ["číselná řada", "horní řada", "základní řada", "dolní řada"];

function platz(layout: KeyboardLayout, taste: string): { reihe: number; spalte: number } | null {
  for (let r = 0; r < layout.rows.length; r++) {
    const s = layout.rows[r].keys.indexOf(taste);
    if (s >= 0) return { reihe: r, spalte: s };
  }
  return null;
}

/** Finger → seine Taste in der Grundstellung auf DIESER Tastatur (`a s d f | j k l ů`, soweit sie in der Grundreihe liegen). */
function heimTasten(layout: KeyboardLayout): ReadonlyMap<FingerId, string> {
  const m = new Map<FingerId, string>();
  for (const k of lernwegDef("cs").homeKeys) {
    const f = layoutIndex(layout).finger.get(k);
    const p = platz(layout, k);
    if (f && p && p.reihe === 2) m.set(f, k);
  }
  return m;
}

/** Die Spalte in der Zählung der Grundreihe (Zahlenreihe und ISO-Unterreihe beginnen eine Taste weiter links). */
function grundreihenSpalte(layout: KeyboardLayout, reihe: number, spalte: number): number {
  if (reihe === 0) return spalte - 1;
  if (reihe === 3 && layout.rows[3].keys.length === 11) return spalte - 1;
  return spalte;
}

/** „levý ukazováček, vpravo od klávesy F" - Finger und Lage einer Taste. */
function lage(layout: KeyboardLayout, taste: string): string | null {
  const p = platz(layout, taste);
  const fingerId = layoutIndex(layout).finger.get(taste);
  if (!p || !fingerId || fingerId === "daumen") return null;
  const finger = fingerName(FINGERS[fingerId], "cs");
  const h = heimTasten(layout).get(fingerId);
  const hp = h ? platz(layout, h) : null;
  if (!h || !hp) return `${finger}, ${RADY[p.reihe]}`;
  const H = kappeCs(h);
  const s = grundreihenSpalte(layout, p.reihe, p.spalte);
  const abstand = Math.abs(s - hp.spalte);
  const richtung = s < hp.spalte ? "vlevo" : "vpravo";
  const weit = abstand >= 3 ? "o tři klávesy " : abstand === 2 ? "o dvě klávesy " : "";
  if (p.reihe === 2) return taste === h ? `${finger}, základní postavení` : `${finger}, ${weit}${richtung} od klávesy ${H}`;
  const vorne = p.reihe === 0 ? "v číselné řadě, " : "";
  if (abstand === 0) return `${finger}, ${vorne}${p.reihe === 3 ? "přímo pod klávesou" : "přímo nad klávesou"} ${H}`;
  // In der Zahlenreihe sagt die Reihe schon „oben" - „nahoře" stünde doppelt.
  if (vorne) return `${finger}, ${vorne}${weit}${richtung} od klávesy ${H}`;
  return `${finger}, ${p.reihe === 3 ? "dole" : "nahoře"}, ${weit}${richtung} od klávesy ${H}`;
}

const MRTVA =
  "Je to mrtvá klávesa: sama nic nenapíše, dá své znaménko písmenu, které stiskneš hned potom.";

/** Das Halten einer Zusatztaste mit der anderen Hand (Shift) oder AltGr (am Mac Option). */
function zusatz(zugang: KeyAccess, layout: KeyboardLayout): string {
  if (zugang.mod === "shift") return "podrž klávesu Shift druhé ruky a stiskni ";
  if (zugang.mod === "altgr") return `podrž klávesu ${bottomAltgr(layout)} a stiskni `;
  return "stiskni ";
}

/** Die dritte Ebene heisst unter Windows „AltGr", am Mac „Option" (Glossar §2.9). */
function bottomAltgr(_layout: KeyboardLayout): string {
  return "AltGr";
}

/** Der Zusatz für den Mac, wo die dritte Ebene (Option) anders liegt als unter Windows (`accessMac`). */
function macHinweis(layout: KeyboardLayout, u: string): string {
  const m = layout.accessMac?.[u];
  const w = layout.access[u];
  if (!m || m.dead) return "";
  // Dieselbe Taste, nur heisst die dritte Ebene am Mac „Option" statt „AltGr".
  if (w && w.base === m.base && w.mod === m.mod) return m.mod === "altgr" ? " Na Macu místo AltGr klávesa Option." : "";
  const wie =
    m.mod === "altgr"
      ? "podrž klávesu Option a stiskni "
      : m.mod === "shift"
        ? "podrž klávesu Shift druhé ruky a stiskni "
        : "stiskni ";
  return ` Na Macu: ${wie}klávesu ${kappeCs(m.base)}.`;
}

/** Ein Satz: wie wird diese Einheit auf dieser Tastatur getippt? */
function griffSatz(layout: KeyboardLayout, u: string): string {
  const zugang = layout.access[u];
  const anfang = satzAnfang(u);
  const mac = macHinweis(layout, u);
  if (zugang?.dead) {
    const wo = lage(layout, zugang.base);
    if (zugang.base === u && !zugang.mod) return `${anfang}: ${wo ?? "vlastní klávesa"}. ${MRTVA}${mac}`;
    return `${anfang}: ${zusatz(zugang, layout)}klávesu ${kappeCs(zugang.base)}${wo ? ` (${wo})` : ""}. ${MRTVA}${mac}`;
  }
  if (zugang?.mod) {
    const wo = lage(layout, zugang.base);
    return `${anfang}: ${zusatz(zugang, layout)}klávesu ${kappeCs(zugang.base)}${wo ? ` (${wo})` : ""}.${mac}`;
  }
  const wo = lage(layout, u);
  if (wo) return `${anfang}: ${wo}.${mac}`;
  // Nicht geraten: Die Daten dieser Tastatur zeigen keinen Griff.
  return `${anfang}: její místo na této klávesnici zatím není popsáno.`;
}

function griffeGerechnet(tasten: readonly string[], layout: KeyboardLayout): string {
  return tasten.map((u) => griffSatz(layout, u)).join(" ");
}

// ── Die Sonderteile ──────────────────────────────────────────────────────────

function shiftTeil(): string {
  return (
    "Velké písmeno píšeš tak, že druhou rukou podržíš klávesu Shift: písmeno z levé poloviny klávesnice chce " +
    "pravý Shift, písmeno z pravé poloviny levý Shift. Obsluhují je oba malíčky. Počítá se jen Shift druhé ruky. " +
    "Pozor: na klávesách v číselné řadě píše Shift číslici, ne velké písmeno - velká písmena s háčkem a čárkou " +
    "přijdou později s mrtvými klávesami."
  );
}

function cislaTeil(_t: readonly string[], layout: KeyboardLayout): string {
  const cifry = "1234567890".split("");
  if (cifry.every((z) => layout.access[z]?.mod === "shift")) {
    const pary = cifry.map((z) => `${z} = Shift + ${kappeCs(layout.access[z].base)}`).join(", ");
    return (
      "Na české klávesnici se číslice píšou s klávesou Shift druhé ruky: bez ní píšou tytéž klávesy písmena " +
      `ě š č ř ž ý á í é. ${pary}. Každý prst zůstává ve svém sloupci.`
    );
  }
  return "Číslice jsou v číselné řadě. Každý prst jde ve svém sloupci nahoru: 1 2 3 4 5 levá ruka, 6 7 8 9 0 pravá ruka.";
}

function velkaPismenaTeil(): string {
  return (
    "Velké písmeno s háčkem nebo čárkou píšeš takhle: nejdřív mrtvá klávesa (háček ˇ nebo čárka nad písmenem ´), " +
    "potom podrž Shift druhé ruky a stiskni písmeno. Samotný Shift na klávesách v číselné řadě píše číslici, ne " +
    "velké písmeno. Velké Ů jde napsat jen s klávesou Caps Lock, proto ho Tastenflow v textech nepoužívá."
  );
}

// ── Die Folge ────────────────────────────────────────────────────────────────

const RADA = (t: readonly string[]) => `Základní řada: ${kappen(t)}`;
const fisso = (testo: string) => () => testo;

const BAUPLAENE: readonly CsLektionsBauplan[] = [
  {
    id: "cs-zaklad-1", kind: "home", einheiten: ["f", "j"], titel: RADA,
    vorspann: fisso(
      "Polož prsty na základní řadu - je to základní postavení. Hmatové výstupky na klávesách F a J ti pomůžou " +
        "najít ho bez dívání na klávesnici. Začínáš těmito dvěma klávesami, oběma ukazováčky. Každý prst z nich " +
        "vychází a po každé klávese se sem vrací.",
    ),
  },
  {
    id: "cs-zaklad-2", kind: "home", einheiten: ["d", "k"], titel: RADA,
    vorspann: fisso("K ukazováčkům se přidávají prostředníčky: D vlevo, K vpravo. Ukazováčky zůstávají na hmatových výstupcích."),
  },
  {
    id: "cs-zaklad-3", kind: "home", einheiten: ["s", "l"], titel: RADA,
    vorspann: fisso("Přicházejí prsteníčky: S vlevo, L vpravo. Prsty zůstávají uvolněné a lehké."),
  },
  {
    id: "cs-zaklad-4", kind: "home", einheiten: ["a", "ů"],
    titel: (t) => `Celá základní řada: ${kappen(t)}`,
    vorspann: fisso(
      "Levý malíček patří na A, pravý malíček na ů (u s kroužkem), vpravo vedle L. Základní řada je teď celá: " +
        "osm prstů na osmi klávesách a palce na mezerníku. Přicházejí první slova: „sada“, „kasa“, „klas“, „sůl“, " +
        "„kůl“ a „jak“.",
    ),
  },
  {
    id: "cs-caste-1", kind: "letters", einheiten: ["e", "m"],
    titel: (t) => `Nejčastější písmena: ${kappen(t)}`,
    vorspann: fisso(
      "E a M patří k písmenům, která v češtině potkáš nejčastěji. S nimi napíšeš „led“, „les“, „med“, „dům“, " +
        "„sedm“, „mama“, „deska“ a „deka“.",
    ),
  },
  {
    id: "cs-caste-2", kind: "letters", einheiten: ["i", "n"],
    titel: (t) => `Nejčastější písmena: ${kappen(t)}`,
    vorspann: fisso(
      "S I a N přibývají krátká slova: „lid“, „klid“, „film“, „den“, „dnes“, „jeden“, „linka“, „klima“ a „mail“.",
    ),
  },
  {
    id: "cs-caste-3", kind: "letters", einheiten: ["o", "t"],
    titel: (t) => `Nejčastější písmena: ${kappen(t)}`,
    vorspann: fisso(
      "S O a T napíšeš „oko“, „okno“, „kolo“, „stan“, „list“, „most“, „stůl“, „teta“ a „atlas“.",
    ),
  },
  {
    id: "cs-caste-4", kind: "letters", einheiten: ["v", "ě", "u"],
    titel: (t) => `Další častá písmena: ${kappen(t)}`,
    vorspann: fisso(
      "Přibývá V, U a první písmeno z číselné řady: ě (e s háčkem). Ě má vlastní klávesu úplně nahoře, háček se " +
        "u něj nepíše zvlášť. Už napíšeš „vlak“, „voda“, „slovo“, „věta“, „svět“, „děti“, „děda“, „mouka“, " +
        "„louka“, „nudle“ a „tunel“.",
    ),
  },
  {
    id: "cs-velka", kind: "shift", einheiten: [], enablesShift: true,
    titel: () => "Velká písmena s klávesou Shift",
    vorspann: fisso(
      "Dosud dělal velká písmena Tastenflow za tebe. Od teď je píšou tvoje ruce: „Anna“, „Adam“, „Emil“, " +
        "„Ivan“, „Matěj“, „Eva“, „Ota“, „Dana“ a „Most“. S velkým písmenem na začátku napíšeš i celé věty: " +
        "„Děda jede do lesa“ a „Louka je u lesa“.",
    ),
    griffe: shiftTeil,
  },
  // ★ D-1 (Didaktik-Synthese 28.09.2026, gilt für jeden Weg): Punkt und Komma direkt nach Shift; im Tschechischen dazu das Fragezeichen.
  {
    id: "cs-tecka-carka", kind: "punctuation", einheiten: [".", ",", "?"],
    titel: () => "Tečka, čárka a otazník: . , ?",
    vorspann: fisso(
      "Věta začíná velkým písmenem a končí tečkou. Čárka ji dělí na části, otazník končí otázku. Před těmito znaky " +
        "mezera nepatří, za nimi ano. Zkus: „Kdo je to?“, „Eva, Ema a Ota.“",
    ),
  },
  {
    id: "cs-i-p", kind: "letters", einheiten: ["í", "p"],
    titel: (t) => `Další písmena: ${kappen(t)}`,
    vorspann: fisso(
      "Dlouhé í je z číselné řady, P leží nahoře. Čárka nad písmenem mění slovo: „ji“ není „jí“. Napíšeš " +
        "„jídlo“, „mísa“, „víla“, „dítě“, „stín“, „dílna“, „pes“, „pole“, „plot“, „lampa“, „stopa“ a „dopis“.",
    ),
  },
  {
    id: "cs-c-h", kind: "letters", einheiten: ["c", "h"],
    titel: (t) => `Další písmena: ${kappen(t)}`,
    vorspann: fisso(
      "C a H: „cesta“, „ocas“, „mince“, „vejce“, „slunce“, „ulice“, „chata“, „chodit“, „mlha“, „duha“, „noha“ " +
        "a „sníh“. Ch se píše dvěma klávesami: C a H.",
    ),
  },
  {
    id: "cs-a-r", kind: "letters", einheiten: ["á", "r"],
    titel: (t) => `Další písmena: ${kappen(t)}`,
    vorspann: fisso(
      "Dlouhé á je z číselné řady, R leží nahoře. Přibývají „máma“, „táta“, „dálka“, „kámen“, „strom“, „hora“, " +
        "„ruka“, „tráva“, „rádio“, „hrad“, „orel“, „vítr“ a „ráno“.",
    ),
  },
  {
    id: "cs-z-b-y", kind: "letters", einheiten: ["z", "b", "y"],
    titel: (t) => `Další písmena: ${kappen(t)}`,
    vorspann: fisso(
      "Z, B a Y: „zima“, „zlato“, „zámek“, „bota“, „brod“, „bouda“, „sob“, „oběd“, „byt“, „ryba“, „hory“, " +
        "„bydlet“ a „rybník“. I a Y se čtou stejně, ale píšou se různě - ve slovech výše se píše Y.",
    ),
  },
  {
    id: "cs-haceky-1", kind: "letters", einheiten: ["ž", "š", "ř"],
    titel: (t) => `Písmena s háčkem: ${kappen(t)}`,
    vorspann: fisso(
      "Ž, š a ř jsou další písmena z číselné řady, každé má vlastní klávesu. Pozor: Shift na těchto klávesách píše " +
        "číslici, ne velké písmeno. Napíšeš „lyže“, „žába“, „život“, „mrož“, „škola“, „šest“, „liška“, „šátek“, " +
        "„řeka“, „moře“, „tři“, „dveře“, „dřevo“ a „hřiště“.",
    ),
  },
  {
    id: "cs-haceky-2", kind: "letters", einheiten: ["č", "é", "ý"],
    titel: (t) => `Poslední písmena číselné řady: ${kappen(t)}`,
    vorspann: fisso(
      "Teď znáš všechna písmena číselné řady: ě š č ř ž ý á í é. Přibývají „čaj“, „čepice“, „kočka“, „oči“, " +
        "„počasí“, „mléko“, „léto“, „chléb“, „sladké“, „dým“, „sýr“, „rýže“, „zlatý“, „týden“ a „výlet“. Dlouhé ý " +
        "a krátké y jsou různá písmena: „byt“ a „být“ jsou dvě různá slova.",
    ),
  },
  {
    id: "cs-hacek", kind: "letters", einheiten: ["ˇ"],
    titel: () => "Háček: mrtvá klávesa ˇ",
    vorspann: fisso(
      "Háček ˇ je mrtvá klávesa. Píšou se jím ď, ť a ň, které nemají vlastní klávesu: nejdřív háček, potom d, t " +
        "nebo n. Píšou se jím také velká písmena s háčkem Č, Š, Ř, Ž, Ě, Ď, Ť a Ň: nejdřív háček, potom Shift druhé " +
        "ruky a písmeno. Zkus: „teď“, „loď“, „zeď“, „kůň“, „loďka“, „šňůra“, „ťapka“ a velká písmena „Česko“, " +
        "„Šumava“, „Říp“ a „Žatec“.",
    ),
  },
  {
    id: "cs-g-u-x", kind: "letters", einheiten: ["g", "ú", "x"],
    titel: (t) => `Další písmena: ${kappen(t)}`,
    vorspann: fisso(
      "G, ú a X. Ú má vlastní klávesu vpravo od P. Napíšeš „guma“, „globus“, „garáž“, „magnet“, „tygr“, " +
        "„údolí“, „úsvit“, „únor“, „úterý“, „taxi“, „text“, „mix“, „relax“ a „expres“.",
    ),
  },
  {
    id: "cs-carka", kind: "letters", einheiten: ["´", "w", "q", "¨"],
    titel: () => "Čárka nad písmenem a poslední písmena: ´ W Q ¨",
    vorspann: fisso(
      "Čárka nad písmenem ´ je druhá mrtvá klávesa: píše se jí ó, které nemá vlastní klávesu, a velká písmena Á, É, " +
        "Í, Ó, Ú a Ý. Zkus: „gól“, „tón“, „kód“, „móda“, „fólie“, „sólo“ a „Ústí“. W a Q se v češtině vyskytují " +
        "hlavně v cizích slovech: „web“, „wifi“, „kiwi“, „show“, „squash“ a „quad“. Poslední je trema ¨ (dvě tečky " +
        "nad písmenem), další mrtvá klávesa - v češtině ji skoro nepotřebuješ.",
    ),
  },
  {
    id: "cs-interpunkce", kind: "punctuation", einheiten: ["!", '"', ":", ";", "'", "-", "(", ")"],
    titel: (t) => `Další znaky: ${t.join(" ")}`,
    vorspann: fisso(
      "Vykřičník končí zvolání, uvozovky obklopují přímou řeč, dvojtečka a středník uvádějí výčty a vysvětlení, " +
        "spojovník spojuje slova a závorky obklopují poznámku. Zkus: „Pozor!“, „Hurá!“, „česko-německý“ a " +
        "„(poznámka)“.",
    ),
  },
  {
    id: "cs-cisla", kind: "numbers", einheiten: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    titel: () => "Číselná řada",
    vorspann: fisso(
      "Data, časy, ceny a výsledky: teď přicházejí číslice. V češtině se tisíce oddělují mezerou a desetinná část " +
        "čárkou, třeba 1 250 a 2,50.",
    ),
    griffe: cislaTeil,
  },
  {
    id: "cs-symboly-1", kind: "symbols", einheiten: ["%", "/", "+", "=", "_", "*", "&", "<", ">", "$"],
    titel: (t) => `Symboly: ${t.join(" ")}`,
    vorspann: fisso(
      "Tyto znaky se hodí pro počítání, pro procenta a pro práci s počítačem. Dej si na čas: tady záleží víc na " +
        "přesnosti než na rychlosti.",
    ),
  },
  {
    id: "cs-symboly-2", kind: "symbols", einheiten: ["|", "@", "#", "€", "[", "]"],
    titel: (t) => `Další symboly: ${t.join(" ")}`,
    vorspann: fisso(
      "Znaky pro e-mailové adresy, ceny a programový kód. Jsou na klávesnici nejtěžší, a proto přicházejí úplně " +
        "naposled.",
    ),
  },
  {
    id: "cs-texty", kind: "text", einheiten: [], corpusKinds: ["satz"],
    titel: () => "Velká písmena s háčkem a čárkou a texty",
    vorspann: fisso(
      "Teď máš celou klávesnici a píšeš celé texty: od Šumavy po Krkonoše, od Moravy po Slezsko, příběhy o škole, " +
        "o sportu, o zvířatech a o obyčejném dni.",
    ),
    griffe: velkaPismenaTeil,
  },
];

// ── Bauen je Tastatur ────────────────────────────────────────────────────────

/** Die Folge der Bauplan-IDs, zum Nachprüfen im Wächter. */
export const CS_LEKTIONS_IDS: readonly string[] = BAUPLAENE.map((b) => b.id);

/**
 * Der GESCHRIEBENE erste Absatz einer Lektion, wie er auf einer Tastatur mit DIESEN Tasten der Lektion erscheint -
 * für den Beispielwort-Wächter je Tastatur.
 */
export function csLektionsVorspannFuer(id: string, tasten: readonly string[]): string {
  return BAUPLAENE.find((b) => b.id === id)?.vorspann(tasten) ?? "";
}

/**
 * Die Tasten jeder Lektion auf dieser Tastatur: die Folge der Tastatur durchgehen (wie `curriculumIt.ts#tastenJeLektion`) -
 *  · eine Einheit kommt in ihre geplante Lektion;
 *  · ist deren Lektion schon VORBEI, in die laufende;
 *  · kommt sie FRÜHER als geplant, ebenso;
 *  · kennt der Plan sie gar nicht, ebenso.
 * „⇧" ist der feste Anker seiner Lektion.
 */
function tastenJeLektion(layout: KeyboardLayout): Map<string, string[]> {
  const reihenfolge = reihenfolgeAuf(layout);
  const geplant = new Map<string, number>();
  BAUPLAENE.forEach((b, i) => {
    for (const u of b.einheiten) geplant.set(u, i);
    if (b.enablesShift) geplant.set(SHIFT_UNIT, i);
  });
  const neu = new Map<string, string[]>(BAUPLAENE.map((b) => [b.id, []]));
  let jetzt = 0;
  /** Die geplante Lektion der nächsten Einheit, die REGULÄR kommt (Nachzügler und Einheiten ohne Plan zählen nicht). */
  const naechsteRegulaer = (k: number): number => {
    for (let j = k + 1; j < reihenfolge.length; j++) {
      const q = geplant.get(reihenfolge[j]);
      if (q !== undefined && q >= jetzt) return q;
    }
    return Infinity;
  };
  reihenfolge.forEach((u, k) => {
    const p = geplant.get(u);
    const naechste = naechsteRegulaer(k);
    let l: number;
    if (p === undefined) l = jetzt;
    else if (p < jetzt) l = jetzt;
    else if (u !== SHIFT_UNIT && p > jetzt && naechste < p) l = jetzt;
    else l = p;
    jetzt = l;
    if (u !== SHIFT_UNIT) neu.get(BAUPLAENE[l].id)!.push(u);
  });
  return neu;
}

function baueLektionen(layout: KeyboardLayout): Lesson[] {
  const tastenJe = tastenJeLektion(layout);
  return BAUPLAENE.map((b) => {
    const tasten = tastenJe.get(b.id) ?? [];
    const griffe = b.griffe ? b.griffe(tasten, layout) : griffeGerechnet(tasten, layout);
    const vorspann = b.vorspann(tasten);
    const lektion: Lesson = {
      id: b.id,
      title: b.titel(tasten, layout),
      kind: b.kind,
      newKeys: tasten,
      intro: griffe ? `${vorspann} ${griffe}` : vorspann,
    };
    if (b.enablesShift) lektion.enablesShift = true;
    if (b.corpusKinds) lektion.corpusKinds = b.corpusKinds;
    return lektion;
  });
}

/** Die tschechischen Pflicht-Tastaturen (Bauplan, F3-cs): QWERTZ und QWERTY. */
const CS_LAYOUTS: readonly LayoutId[] = ["cs", "cs-qwerty"];

const CACHE = new Map<LayoutId, readonly Lesson[]>();

/**
 * Die Lektionen des Weges „cs" auf dieser Tastatur - gecacht, damit `lektionenFuer("cs")` bei gleicher Tastatur immer
 * DIESELBE Liste liefert. Gerechnet wird mit der Tastatur, die eingestellt ist; jede Lektion trägt in
 * {@link Lesson.introByLayout} die Einführung der anderen tschechischen Pflicht-Tastatur, wo sie abweicht.
 */
export function csLektionenFuerLayout(layoutId: LayoutId): readonly Lesson[] {
  const cached = CACHE.get(layoutId);
  if (cached) return cached;
  const eigene = baueLektionen(layoutById(layoutId));
  const andere = CS_LAYOUTS.filter((id) => id !== layoutId).map(
    (id) => [id, new Map(baueLektionen(layoutById(id)).map((l) => [l.id, l.intro]))] as const,
  );
  for (const l of eigene) {
    const je: Partial<Record<LayoutId, string>> = {};
    for (const [id, intros] of andere) {
      const text = intros.get(l.id);
      if (text !== undefined && text !== l.intro) je[id] = text;
    }
    if (Object.keys(je).length > 0) l.introByLayout = je;
  }
  const fertig = Object.freeze(eigene);
  CACHE.set(layoutId, fertig);
  return fertig;
}
