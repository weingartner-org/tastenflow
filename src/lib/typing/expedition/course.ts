/**
 * Reise-Gerüst der Polar-Expedition (Neubau, Bauplan §0/§2). Baut auf der
 * getesteten Etappen-Logik von `../iceFloe.ts` auf und ERWEITERT sie um die
 * neuen Zonen des Abenteuers — nur additiv, die alten Bausteine bleiben.
 *
 * Dramaturgie (Bauplan §0): eine Reise vom Morgen in die Nacht —
 *   Packeis → Steilwand → Echo-Höhle → Schneesturm → Polarstation →
 *   Heim-Bauchrutsche → Polarlicht-Finale (nur bei fehlerfreiem Lauf).
 *
 * In E1 liefert diese Datei die Zonen-STAMMDATEN (Name, Tageszeit, Lern-Kern)
 * für HUD/Reisekarte und die spätere Kurs-Erzeugung. Die zonen-spezifische
 * Spiel- und Kurslogik kommt in den Etappen E2–E7 dazu.
 */
import {
  FLOE_COUNT,
  buildFloeSequence,
  type FloeCourse,
  type FloeStage,
  type FloeStageKind,
} from "../iceFloe";
import { SHIFT_UNIT, type Mastery } from "../letters";
import type { LetterStat } from "../progress";
import type { Lernweg } from "../lernweg";
import type { BedienSprache } from "../../bedienSprache/sprache";
import { STATION_WORDS, stationGuessWords } from "./words";

/**
 * Etappen-Arten der Expedition — deckungsgleich mit {@link FloeStageKind}: die alten
 * Arten `water|climb|slide|cave` plus die neuen `storm` (Schneesturm — Vorauslesen &
 * Merken) und `station` (Polarstation — ganze Wörter funken, Verschnaufzone).
 */
export type ZoneKind = FloeStageKind;

/** Tageszeit-Stimmung einer Zone (steuert Licht/Palette der Szene). */
export type TimeOfDay =
  | "morning"
  | "golden"
  | "dark"
  | "twilight"
  | "evening"
  | "night";

export interface Zone {
  kind: ZoneKind;
  /** Anzeigename (Reisekarte/Tagebuch). */
  name: string;
  /** Derselbe Name englisch (EN3, 19.09.2026; Glossar §3.6 „Etappen-Namen"). */
  nameEn: string;
  /** Derselbe Name französisch (E11a-5, 26.09.2026; Glossar §9.2: la Banquise). */
  nameFr: string;
  /** ★ ES-O (27.09.2026): der Name spanisch. */
  nameEs: string;
  /** ★ O-IT (02.10.2026): der Name italienisch (Glossar §2.3). */
  nameIt: string;
  /** ★ O-PL (02.10.2026): der Name polnisch (Glossar §2.3). */
  namePl: string;
  /** ★ O-TR (02.10.2026): der Name türkisch (Glossar §2.3, Spielorte gross als Eigennamen). */
  nameTr: string;
  /** ★ O-CS (03.10.2026): der Name tschechisch (Glossar §2.3, nur das erste Wort gross). */
  nameCs: string;
  nameBg: string;
  nameEl: string;
  nameHu: string;
  nameNl: string;
  namePt: string;
  nameBr: string;
  nameRo: string;
  nameSv: string;
  nameUk: string;
  timeOfDay: TimeOfDay;
  /** Was diese Zone trainiert — ein Satz, kindgerecht (Details: texts.ts, E7). */
  trains: string;
  /** Derselbe Satz englisch (EN3). */
  trainsEn: string;
  /** Derselbe Satz französisch (E11a-5). */
  trainsFr: string;
  /** ★ ES-O: was die Zone übt, spanisch. */
  trainsEs: string;
  /** ★ O-IT: was die Zone übt, italienisch. */
  trainsIt: string;
  /** ★ O-PL: was die Zone übt, polnisch (Infinitiv, ohne Geschlecht). */
  trainsPl: string;
  /** ★ O-TR: was die Zone übt, türkisch (Infinitiv auf -mak/-mek). */
  trainsTr: string;
  /** ★ O-CS: was die Zone übt, tschechisch (Infinitiv, ohne Geschlecht). */
  trainsCs: string;
  trainsBg: string;
  trainsEl: string;
  trainsHu: string;
  trainsNl: string;
  trainsPt: string;
  trainsBr: string;
  trainsRo: string;
  trainsSv: string;
  trainsUk: string;
}

/**
 * Die sechs Zonen in Reihenfolge der Reise. Das Polarlicht ist kein eigener
 * Spiel-Abschnitt, sondern das Finale nach fehlerfreiem Lauf (Bauplan §4.6).
 */
export const EXPEDITION_ZONES: readonly Zone[] = [
  { kind: "water", name: "Das Packeis", nameEn: "The Pack Ice", nameFr: "La Banquise", nameEs: "La Banquisa", nameIt: "La Banchisa", namePl: "Pak lodowy", nameTr: "Buz Tabakası", nameCs: "Ledová pole", nameBg: "Ледено поле", nameEl: "Ο παγωμένος ωκεανός", nameHu: "Jégmező", nameNl: "Het pakijs", namePt: "A Banquisa", nameBr: "O campo de gelo", nameRo: "Banchiza", nameSv: "Packisen", nameUk: "Паковий лід", timeOfDay: "morning", trains: "Reaktion und Treffsicherheit bei einzelnen Zeichen.", trainsEn: "reacting quickly and accurately to single characters.", trainsFr: "réagir vite et juste à un seul caractère.", trainsEs: "reaccionar rápido y con precisión a un solo carácter.", trainsIt: "reagire in fretta e con precisione a un solo carattere.", trainsPl: "szybko i dokładnie reagować na pojedyncze znaki.", trainsTr: "tek tek karakterlere hızlı ve doğru tepki vermek.", trainsCs: "rychle a přesně reagovat na jednotlivé znaky.", trainsBg: "бързо и точно реагиране на единични знаци.", trainsEl: "γρήγορη και ακριβής αντίδραση σε μεμονωμένους χαρακτήρες.", trainsHu: "gyors és pontos reagálás egyes jelekre.", trainsNl: "snel en nauwkeurig reageren op losse tekens.", trainsPt: "reagir com rapidez e precisão a carateres isolados.", trainsBr: "reagir com rapidez e precisão a caracteres isolados.", trainsRo: "reacția rapidă și precisă la caractere izolate.", trainsSv: "att reagera snabbt och träffsäkert på enstaka tecken.", trainsUk: "швидко й точно реагувати на окремі знаки." },
  { kind: "climb", name: "Die Steilwand", nameEn: "The Ice Cliff", nameFr: "La Falaise de glace", nameEs: "El Acantilado de hielo", nameIt: "La Parete di ghiaccio", namePl: "Lodowa ściana", nameTr: "Buz Duvarı", nameCs: "Ledová stěna", nameBg: "Ледена стена", nameEl: "Ο παγωμένος γκρεμός", nameHu: "Jégfal", nameNl: "De ijswand", namePt: "A Parede de Gelo", nameBr: "O paredão de gelo", nameRo: "Peretele de gheață", nameSv: "Isväggen", nameUk: "Крижана стіна", timeOfDay: "golden", trains: "kurze Zeichenfolgen flüssig hintereinander.", trainsEn: "short sequences of characters, smoothly one after the other.", trainsFr: "de courtes suites de caractères, tapées avec fluidité.", trainsEs: "series cortas de caracteres, escritas con fluidez.", trainsIt: "brevi sequenze di caratteri, scritte con scioltezza.", trainsPl: "krótkie ciągi znaków, płynnie jeden po drugim.", trainsTr: "kısa karakter dizilerini art arda akıcı biçimde yazmak.", trainsCs: "plynule psát krátké skupiny znaků jednu za druhou.", trainsBg: "плавно писане на кратки групи от знаци една след друга.", trainsEl: "σύντομες ομάδες χαρακτήρων, άνετα η μία μετά την άλλη.", trainsHu: "rövid jelcsoportok gördülékeny egymás utáni beírása.", trainsNl: "korte reeksen tekens vlot na elkaar typen.", trainsPt: "escrever pequenas sequências de carateres, com fluidez, uma a seguir à outra.", trainsBr: "digitar sequências curtas de caracteres, uma depois da outra, com fluência.", trainsRo: "grupuri scurte de caractere, scrise fluent unul după altul.", trainsSv: "korta teckenföljder, flytande efter varandra.", trainsUk: "плавно друкувати короткі групи знаків одну за одною." },
  { kind: "cave", name: "Die Echo-Höhle", nameEn: "The Echo Cave", nameFr: "La Grotte de l'écho", nameEs: "La Cueva del Eco", nameIt: "La Grotta dell'eco", namePl: "Jaskinia echa", nameTr: "Yankı Mağarası", nameCs: "Jeskyně ozvěny", nameBg: "Пещера на ехото", nameEl: "Η σπηλιά της ηχούς", nameHu: "Visszhangbarlang", nameNl: "De echogrot", namePt: "A Gruta do Eco", nameBr: "A caverna do eco", nameRo: "Peștera ecoului", nameSv: "Ekogrottan", nameUk: "Печера відлуння", timeOfDay: "dark", trains: "Blindschreiben: nur nach Gehör.", trainsEn: "typing without looking: by ear alone.", trainsFr: "taper sans regarder : rien qu'à l'oreille.", trainsEs: "escribir sin mirar: solo de oído.", trainsIt: "scrivere senza guardare la tastiera: solo a orecchio.", trainsPl: "pisać bez patrzenia na klawiaturę: tylko ze słuchu.", trainsTr: "klavyeye bakmadan yazmak: yalnızca duyarak.", trainsCs: "psát bez dívání na klávesnici: jen podle sluchu.", trainsBg: "писане без поглед към клавиатурата: само по слух.", trainsEl: "γράψιμο χωρίς να κοιτάς: μόνο με το αυτί.", trainsHu: "gépelés nézés nélkül: csak hallás után.", trainsNl: "typen zonder te kijken: alleen op het gehoor.", trainsPt: "escrever sem olhar para o teclado: só de ouvido.", trainsBr: "digitar sem olhar para o teclado: só de ouvido.", trainsRo: "scrierea fără să te uiți la tastatură: numai după auz.", trainsSv: "att skriva utan att titta: bara med hörseln.", trainsUk: "друкувати, не дивлячись на клавіатуру: лише на слух." },
  { kind: "storm", name: "Der Schneesturm", nameEn: "The Blizzard", nameFr: "La Tempête de neige", nameEs: "La Tormenta de Nieve", nameIt: "La Bufera di neve", namePl: "Śnieżyca", nameTr: "Kar Fırtınası", nameCs: "Sněhová bouře", nameBg: "Снежна буря", nameEl: "Η χιονοθύελλα", nameHu: "Hóvihar", nameNl: "De sneeuwstorm", namePt: "A Tempestade de Neve", nameBr: "A nevasca", nameRo: "Viscolul", nameSv: "Snöstormen", nameUk: "Хуртовина", timeOfDay: "twilight", trains: "eine Folge merken und aus dem Gedächtnis tippen.", trainsEn: "remembering a sequence and typing it from memory.", trainsFr: "retenir une suite et la taper de mémoire.", trainsEs: "recordar una serie y escribirla de memoria.", trainsIt: "ricordare una sequenza e scriverla a memoria.", trainsPl: "zapamiętać ciąg znaków i napisać go z pamięci.", trainsTr: "bir diziyi aklında tutmak ve aklından yazmak.", trainsCs: "zapamatovat si skupinu znaků a napsat ji zpaměti.", trainsBg: "запомняне на група от знаци и писането ѝ по памет.", trainsEl: "απομνημόνευση μιας ομάδας χαρακτήρων και γράψιμο από μνήμης.", trainsHu: "egy jelcsoport megjegyzése és beírása emlékezetből.", trainsNl: "een reeks onthouden en uit het hoofd typen.", trainsPt: "memorizar uma sequência e escrevê-la de memória.", trainsBr: "memorizar uma sequência e digitá-la de memória.", trainsRo: "ținerea minte a unui grup de caractere și scrierea lui din memorie.", trainsSv: "att komma ihåg en följd och skriva den ur minnet.", trainsUk: "запам'ятати групу знаків і надрукувати її з пам'яті." },
  { kind: "station", name: "Die Polarstation", nameEn: "The Polar Station", nameFr: "La Station polaire", nameEs: "La Estación Polar", nameIt: "La Stazione polare", namePl: "Stacja polarna", nameTr: "Kutup İstasyonu", nameCs: "Polární stanice", nameBg: "Полярна станция", nameEl: "Ο πολικός σταθμός", nameHu: "Sarki állomás", nameNl: "Het poolstation", namePt: "A Estação Polar", nameBr: "A estação polar", nameRo: "Stația polară", nameSv: "Polarstationen", nameUk: "Полярна станція", timeOfDay: "evening", trains: "ganze Wörter funken, ohne Zeitdruck.", trainsEn: "sending whole words by radio, with no time pressure.", trainsFr: "envoyer des mots entiers par radio, sans limite de temps.", trainsEs: "enviar palabras enteras por radio, sin límite de tiempo.", trainsIt: "inviare parole intere via radio, senza fretta.", trainsPl: "wysyłać przez radio całe słowa, bez pośpiechu.", trainsTr: "acele etmeden bütün kelimeleri telsizle göndermek.", trainsCs: "posílat vysílačkou celá slova, bez spěchu.", trainsBg: "изпращане на цели думи по радиото, без бързане.", trainsEl: "μετάδοση ολόκληρων λέξεων με ασύρματο, χωρίς πίεση χρόνου.", trainsHu: "egész szavak elküldése rádión, időnyomás nélkül.", trainsNl: "hele woorden doorseinen, zonder tijdsdruk.", trainsPt: "enviar palavras inteiras por rádio, sem pressão de tempo.", trainsBr: "enviar palavras inteiras pelo rádio, sem pressa.", trainsRo: "trimiterea prin radio a unor cuvinte întregi, fără grabă.", trainsSv: "att sända hela ord på radio, utan tidspress.", trainsUk: "надсилати рацією цілі слова, без поспіху." },
  { kind: "slide", name: "Die Heim-Bauchrutsche", nameEn: "The Belly Slide Home", nameFr: "La Glissade du retour", nameEs: "El Tobogán de vuelta", nameIt: "La Scivolata verso casa", namePl: "Ślizgiem do domu", nameTr: "Eve Doğru Kayış", nameCs: "Skluzavka domů", nameBg: "Пързалка към дома", nameEl: "Η τσουλήθρα για το σπίτι", nameHu: "Hasoncsúszás haza", nameNl: "De buikglijbaan naar huis", namePt: "O Escorrega para Casa", nameBr: "Escorregando para casa", nameRo: "Pe burtă spre casă", nameSv: "Magåkning hem", nameUk: "Додому на животику", timeOfDay: "night", trains: "Timing: den Buchstaben im richtigen Moment treffen.", trainsEn: "timing: hitting the letter at exactly the right moment.", trainsFr: "le rythme : toucher la lettre au bon moment.", trainsEs: "el ritmo: acertar la letra en el momento justo.", trainsIt: "il ritmo: prendere la lettera nel momento giusto.", trainsPl: "rytm: trafić w literę we właściwym momencie.", trainsTr: "zamanlama: harfe tam doğru anda basmak.", trainsCs: "rytmus: stisknout písmeno přesně ve správnou chvíli.", trainsBg: "ритъм: натискане на буквата точно в правилния миг.", trainsEl: "ρυθμός: το γράμμα στη σωστή στιγμή.", trainsHu: "időzítés: a betű eltalálása pontosan a megfelelő pillanatban.", trainsNl: "timing: de letter precies op het juiste moment raken.", trainsPt: "ritmo: acertar na letra exatamente no momento certo.", trainsBr: "ritmo: acertar a letra exatamente no momento certo.", trainsRo: "ritmul: apăsarea literei exact la momentul potrivit.", trainsSv: "timing: att träffa bokstaven i precis rätt ögonblick.", trainsUk: "ритм: натиснути літеру точно у потрібну мить." },
] as const;

/**
 * ★ E11a-5: welches Feld einer Zone zu welcher Bedienungssprache gehört - EINE Tabelle
 * statt der früheren Weiche `sprache === "en" ? zone.nameEn : zone.name`, die „fr" still
 * auf Deutsch hätte fallen lassen (Leitfaden Falle 30).
 */
const ZONEN_FELD: Record<
  BedienSprache,
  { name: "name" | "nameEn" | "nameFr" | "nameEs" | "nameIt" | "namePl" | "nameTr" | "nameCs" | "nameBg" | "nameEl" | "nameHu" | "nameNl" | "namePt" | "nameBr" | "nameRo" | "nameSv" | "nameUk"; trains: "trains" | "trainsEn" | "trainsFr" | "trainsEs" | "trainsIt" | "trainsPl" | "trainsTr" | "trainsCs" | "trainsBg" | "trainsEl" | "trainsHu" | "trainsNl" | "trainsPt" | "trainsBr" | "trainsRo" | "trainsSv" | "trainsUk" }
> = {
  de: { name: "name", trains: "trains" },
  en: { name: "nameEn", trains: "trainsEn" },
  fr: { name: "nameFr", trains: "trainsFr" },
  es: { name: "nameEs", trains: "trainsEs" },
  it: { name: "nameIt", trains: "trainsIt" },
  // ★ O-PL (02.10.2026): polnisch.
  pl: { name: "namePl", trains: "trainsPl" },
  // ★ O-TR (02.10.2026): türkisch.
  tr: { name: "nameTr", trains: "trainsTr" },
  // ★ O-CS (03.10.2026): tschechisch.
  cs: { name: "nameCs", trains: "trainsCs" },
  // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: { name: "nameBg", trains: "trainsBg" },
  el: { name: "nameEl", trains: "trainsEl" },
  hu: { name: "nameHu", trains: "trainsHu" },
  nl: { name: "nameNl", trains: "trainsNl" },
  pt: { name: "namePt", trains: "trainsPt" },
  br: { name: "nameBr", trains: "trainsBr" },
  ro: { name: "nameRo", trains: "trainsRo" },
  sv: { name: "nameSv", trains: "trainsSv" },
  uk: { name: "nameUk", trains: "trainsUk" },
};

/** Der Name einer Zone in der Bedienungssprache (EN3) - ohne Angabe Deutsch. */
export function zoneName(zone: Zone, sprache: BedienSprache = "de"): string {
  return zone[ZONEN_FELD[sprache].name];
}

/** ★ E11a-5: Was eine Zone trainiert, in der Bedienungssprache - ohne Angabe Deutsch. */
export function zoneTrains(zone: Zone, sprache: BedienSprache = "de"): string {
  return zone[ZONEN_FELD[sprache].trains];
}

/** Zone zu einer Etappen-Art finden (erste passende). */
export function zoneOf(kind: ZoneKind): Zone | undefined {
  return EXPEDITION_ZONES.find((z) => z.kind === kind);
}

/**
 * So viele Schollen hat das freie Packeis mindestens. Länge so gewählt, dass die Zone
 * rund eine Minute dauert — alle sechs Zonen sind etwa GLEICH LANG (Johannes 14.07.:
 * „Die Level sollen ungefähr gleich lang sein"; der Sturm war mit 3–5 Minuten der
 * Ausreißer, die Höhle mit 30 s der Gegenpol).
 */
export const PACKEIS_FREE_MIN = 10;

/**
 * Ein reiner PACKEIS-Kurs (E2): eine Wasser-Etappe aus den gerade wackligsten
 * Zeichen (getestete Auswahl {@link buildFloeSequence}). Die übrigen Zonen der
 * Reise (Steilwand, Höhle, …) kommen erst ab E3 dazu — bis dahin spielt sich das
 * Packeis eigenständig.
 *
 *  • `free` (freies Spiel): länger (8–10 Schollen, `seed`-variiert) und mit
 *    Bonus-Fischen nach Scholle 2/5/8 (nie nach der letzten — dort gleitet der
 *    Pinguin schon ans Ufer). Wie im Altspiel (`buildFreePlayCourse`).
 *  • sonst (Tor vor einer neuen Taste): die klassische Überquerung
 *    ({@link FLOE_COUNT} Schollen, ohne Fische — im Pflicht-Tor kein Bonus).
 */
export function buildPackeisCourse(
  introduced: readonly string[],
  letters: Record<string, LetterStat> | undefined,
  mastery: Mastery,
  opts: { free?: boolean; seed?: number; lernweg?: Lernweg } = {},
): FloeCourse {
  const { free = false, seed = 0, lernweg = "de" } = opts;
  const count = free ? PACKEIS_FREE_MIN + (seed % 3) : FLOE_COUNT;
  const units = buildFloeSequence(introduced, letters, mastery, count, lernweg);
  if (units.length === 0) return { stages: [] };
  const stage: FloeStage = { kind: "water", units };
  if (free) stage.fish = [3, 6, 9].filter((s) => s < count);
  return { stages: [stage] };
}

// --- E3: Steilwand (climb) & Heim-Bauchrutsche (slide) — FOLGEN ----------------
//
// Kern-Unterschied zum Packeis (Bauplan §4.2): pro Tritt eine kurze ZEICHENFOLGE
// (2–4 Zeichen am Stück), nicht ein Einzelzeichen. Damit die getestete Etappen-/
// Spot-Struktur (`courseSpots`, `FloeSpot.unit`) NICHT angefasst werden muss, trägt
// jedes `units`-Element hier einen FOLGEN-String ("der" statt "d"); `courseSpots`
// macht daraus wie gewohnt eine Station, und der Spiel-Hook tippt sie Zeichen für
// Zeichen ab (`[...unit]`, `sequenceWindowMs`). Für Wasser (Folgenlänge 1) bleibt
// alles bit-identisch zu E2.

/**
 * Folgenlänge eines Steilwand-/Rutsch-Tritts (Bauplan §4.2: „2–4, wächst mit
 * Level"). Mehr gelernte Zeichen → längere Folgen; bei 4 gedeckelt, damit ein Tritt
 * nie zur Merkübung wird (das ist erst der Schneesturm, E5).
 */
export function seqLenFor(introduced: readonly string[]): number {
  return Math.max(2, Math.min(4, 2 + Math.floor(introduced.length / 10)));
}

/**
 * Gruppiert eine Zeichen-Liste in `steps` Folgen à `seqLen` Zeichen. Die Folgen
 * laufen mit ÜBERLAPPENDEM Fenster (Versatz +1 je Tritt), damit aufeinanderfolgende
 * Tritte verschiedene Reihenfolgen derselben schwachen Zeichen zeigen (nfj · fjn ·
 * jnf …) statt stumpf denselben Block — mehr Bigramm-Übung und weniger eintönig.
 * Zyklisch, falls die Liste kürzer ist. Jede Folge = eine Station in {@link FloeCourse}.
 */
function groupSequences(chars: readonly string[], steps: number, seqLen: number): string[] {
  if (chars.length === 0) return [];
  const seqs: string[] = [];
  for (let i = 0; i < steps; i++) {
    let s = "";
    for (let j = 0; j < seqLen; j++) s += chars[(i + j) % chars.length];
    seqs.push(s);
  }
  return seqs;
}

/** Zeichen-Vorrat für Folgen: die getestete Auswahl, ohne die Umschalt-Einheit. */
function seqChars(
  introduced: readonly string[],
  letters: Record<string, LetterStat> | undefined,
  mastery: Mastery,
  count: number,
  lernweg: Lernweg = "de",
): string[] {
  const pool = introduced.filter((u) => u !== SHIFT_UNIT);
  return buildFloeSequence(pool, letters, mastery, count, lernweg);
}

/**
 * Steilwand-Kurs (E3, Bauplan §4.2): eine climb-Etappe aus kurzen Folgen. `free`
 * (freies Spiel) ist etwas länger und seed-variiert; im Tor die feste Länge (wie
 * `buildGateCourse` climb = 4 Tritte).
 */
export function buildSteilwandCourse(
  introduced: readonly string[],
  letters: Record<string, LetterStat> | undefined,
  mastery: Mastery,
  opts: { free?: boolean; seed?: number; lernweg?: Lernweg } = {},
): FloeCourse {
  const { free = false, seed = 0, lernweg = "de" } = opts;
  const steps = free ? 5 + (seed % 3) : 4;
  const seqLen = seqLenFor(introduced);
  // ★ 29.10.2026: Das überlappende Fenster (`groupSequences`) liest nur die ersten
  // `steps + seqLen - 1` Zeichen - mehr zu bestellen verteilte die gelernten Tasten auf
  // Plätze, die nie drankommen (die Folge `spielFolge` stellt alle Tasten nach vorn).
  const seqs = groupSequences(
    seqChars(introduced, letters, mastery, steps + seqLen - 1, lernweg),
    steps,
    seqLen,
  );
  if (seqs.length === 0) return { stages: [] };
  return { stages: [{ kind: "climb", units: seqs }] };
}

/** So viele Buchstaben fliegen auf der freien Bauchrutsche heran (rund eine Minute). */
export const SLIDE_FREE_MIN = 12;

/**
 * Heim-Bauchrutsche — RHYTHMUS-SPIEL (umgebaut 14.07. auf Wunsch Johannes: „Die
 * Bauchrutsche wäre eher eine Bauchrutsche, wenn man Buchstaben schnell auf sich
 * zukommen sieht und sie im richtigen Moment drücken muss, sonst ist sie wie die
 * Steilwand sehr unkreativ").
 *
 * Darum liefert der Kurs hier EINZELZEICHEN (nicht mehr Folgen wie die Steilwand):
 * Jedes `units`-Element ist genau EIN Buchstabe = ein Hindernis, das heranfliegt. Es
 * ist immer nur eines sichtbar; getroffen wird im Moment der Ziellinie (Timing), nicht
 * bloß „irgendwann getippt" — die Mechanik dazu steckt im Spiel-Hook.
 */
export function buildSlideCourse(
  introduced: readonly string[],
  letters: Record<string, LetterStat> | undefined,
  mastery: Mastery,
  opts: { free?: boolean; seed?: number; lernweg?: Lernweg } = {},
): FloeCourse {
  const { free = false, seed = 0, lernweg = "de" } = opts;
  const count = free ? SLIDE_FREE_MIN + (seed % 3) : 8;
  const units = seqChars(introduced, letters, mastery, count, lernweg);
  if (units.length === 0) return { stages: [] };
  return { stages: [{ kind: "slide", units }] };
}

/**
 * DER TOR-KURS vor einer neuen Taste — genau EINE Zone.
 *
 * ⚠️ Warum das hier neu steht: Der Trainer fütterte bis 28.08.2026 den alten
 * `buildGateCourse` (iceFloe.ts) ins Spiel. Der baut bei UNGERADER Tastenzahl
 * DREI Etappen (Wasser → Steilwand → Rutsche) — die Expedition kann aber nur
 * eine Zone je Kurs zeigen (`zoneOfCourse` liest die Etappe der ersten Station),
 * und `hop` hielt den Rastplatz zwischen zwei Etappen für die Ziel-Insel. Ergebnis:
 * Bei JEDER ZWEITEN Freischaltung endete das Spiel nach der ersten Etappe, obwohl
 * noch Schollen zu sehen waren. Gemeldet von Testerin (Marburg) am 28.08.2026:
 * „Es sieht aber so aus, als würde es mit den Schollen eigentlich noch weiter
 * gehen … es geht einfach aus."
 *
 * Die Abwechslung (Wunsch Johannes 10.07.) bleibt — sie steckt jetzt in der ZONE
 * statt in mehreren Etappen: Wasser · Steilwand · Bauchrutsche im Wechsel,
 * deterministisch an der Tastenzahl, damit derselbe Anlauf dasselbe Tor zeigt.
 * Höhle, Schneesturm und Polarstation bleiben dem freien Spiel vorbehalten (die
 * Höhle darf kein Freischalt-Tor sein: ein gehörloses Kind ohne Braillezeile
 * könnte sie nicht lösen).
 */
export function buildTorCourse(
  introduced: readonly string[],
  letters: Record<string, LetterStat> | undefined,
  mastery: Mastery,
  // ★ E6a (24.09.2026, Bauplan §6.3): der Lernweg des Kindes - AdaptiveTrainer/
  // SerienTrainer reichen `lernwegVon(cur)`, kein stiller Rückfall dort.
  lernweg: Lernweg = "de",
): FloeCourse {
  switch (introduced.length % 3) {
    case 1:
      return buildSteilwandCourse(introduced, letters, mastery, { lernweg });
    case 2:
      return buildSlideCourse(introduced, letters, mastery, { lernweg });
    default:
      return buildPackeisCourse(introduced, letters, mastery, { lernweg });
  }
}

// --- E4: Echo-Höhle (cave) — BLINDSCHREIBEN, nur freies Spiel ------------------
//
// Die Höhle ist bewusst EINZELZEICHEN (Folgenlänge 1, wie das Wasser) — der Reiz
// liegt nicht in langen Folgen, sondern darin, dass KEIN Zeichen zu sehen ist: das
// Höhlenwesen sagt jede Taste an, das Kind tippt nur nach Gehör (Bauplan §4.3). Weil
// das ein Hörzwang ist, gehört die Höhle NIE ins Pflicht-Tor — nur ins freie Spiel
// (deshalb kein cave-Zweig in `buildGateCourse`). `courseSpots`/`FloeSpot` bleiben
// unberührt; die Blind-Inszenierung steckt allein in Szene + Hook (kein Glyph im DOM).

/**
 * Wie viele Echos die Höhle im freien Spiel hat. Von 4 auf 6 erhöht (14.07.): Die Höhle
 * war mit ~30 s die kürzeste Zone; alle Zonen sollen etwa gleich lang sein.
 */
export const CAVE_FREE_MIN = 6;

/**
 * Echo-Höhle-Kurs (E4, Bauplan §4.3): eine cave-Etappe aus Einzelzeichen (die gerade
 * wackligsten, wie das Packeis — {@link buildFloeSequence}). Nur fürs freie Spiel
 * gedacht; `seed` variiert die Länge leicht. Ohne Fische (die Höhle ist dunkel).
 */
export function buildCaveCourse(
  introduced: readonly string[],
  letters: Record<string, LetterStat> | undefined,
  mastery: Mastery,
  opts: { seed?: number; lernweg?: Lernweg } = {},
): FloeCourse {
  const { seed = 0, lernweg = "de" } = opts;
  const count = CAVE_FREE_MIN + (seed % 3); // 6–8 Echos
  const units = buildFloeSequence(introduced, letters, mastery, count, lernweg);
  if (units.length === 0) return { stages: [] };
  return { stages: [{ kind: "cave", units }] };
}

// --- E5: Schneesturm (storm) — VORAUSLESEN & MERKEN, nur freies Spiel ----------
//
// Der Kern-Unterschied zur Steilwand (climb, auch Folgen): die Folge wird gezeigt +
// angesagt, dann VERWEHT die Tafel (auch aus dem DOM) — getippt wird aus dem
// Gedächtnis (Bauplan §4.4). Kurs-seitig ist es wie climb eine Folgen-Etappe (jedes
// `units`-Element = ein Folgen-String, `courseSpots`/`seqPos` unberührt); der Merk-
// Zwang steckt allein in Szene + Hook (Tafel verwehen, kein Zeichen im DOM). Wie die
// Höhle ist der Sturm ein Zwang (Merken) → NIE ins Pflicht-Tor, nur freies Spiel.

/** Erste Merkfolge (Johannes 15.07.: „fange mit drei Zeichen an und steigere dich langsamer"). */
export const STORM_START_LEN = 3;
/**
 * Längste Merkfolge. Von 10 auf 7 gesenkt (Johannes 14.07.): Mit Länge 10 und 12
 * Stationen dauerte der Sturm 3–5 Minuten, während andere Zonen unter einer Minute
 * blieben — er war der Längen-Ausreißer der Reise.
 */
export const STORM_MAX_LEN = 7;
/**
 * Stationen des Sturms. Von 12 auf 5 gesenkt (Johannes 14.07., „Level ungefähr gleich
 * lang"): 5 Stationen × (Merkzeit + Tippzeit) ergeben rund eine Minute — wie die
 * übrigen Zonen. Die Steigerung 4 → 7 ist damit weiterhin erreichbar (je fehlerfreier
 * Station +1).
 */
export const STORM_STATIONS = 5;

/**
 * Schneesturm-Kurs (E5, Bauplan §4.4, verschärft 13.07.): VIELE Stationen. Die
 * tatsächliche Länge einer Merkfolge wächst NICHT starr, sondern LAUFZEIT-adaptiv im
 * Spiel-Hook — Start 4, hoch bis 10, aber nur nach einer FEHLERFREIEN Vorfolge (sonst
 * bleibt die Länge). Darum liefert der Kurs nur die Stations-ANZAHL und den Zeichen-
 * Vorrat (die wackligsten Zeichen); jede Station bekommt hier als Platzhalter eine
 * Start-Folge, die der Hook je Station frisch nach Können erzeugt. Nur freies Spiel.
 */
export function buildStormCourse(
  introduced: readonly string[],
  letters: Record<string, LetterStat> | undefined,
  mastery: Mastery,
  opts: { seed?: number; lernweg?: Lernweg } = {},
): FloeCourse {
  const { lernweg = "de" } = opts;
  const pool = introduced.filter((u) => u !== SHIFT_UNIT);
  if (pool.length === 0) return { stages: [] };
  // Genug wacklige Zeichen für Folgen bis Länge 10 (Wiederholung im Sturm ist ok).
  const weak = buildFloeSequence(pool, letters, mastery, Math.max(STORM_MAX_LEN, pool.length), lernweg);
  if (weak.length === 0) return { stages: [] };
  const units: string[] = [];
  for (let i = 0; i < STORM_STATIONS; i++) {
    let s = "";
    for (let j = 0; j < STORM_START_LEN; j++) s += weak[(i + j) % weak.length];
    units.push(s); // Platzhalter (trägt den Zeichen-Vorrat); echte Folge erzeugt der Hook
  }
  return { stages: [{ kind: "storm", units }] };
}

// --- E6: Polarstation (station) — WORT RATEN („Funkspruch entschlüsseln"), frei ---
//
// Verschnaufzone (Bauplan §4.5, umgebaut 13.07. auf Wunsch Johannes zum WORT-RATE-Spiel):
// KEIN Zeitdruck, KEIN Scheitern. Jede Station trägt ein VERDECKTES Wort; das Kind rät
// Buchstaben (tippt sie), richtige erscheinen — mit möglichst wenig Fehlgriffen (Bauplan
// §4.5). Über den Besuch hinweg werden die Wörter länger ({@link stationGuessWords}).
// `courseSpots`/`FloeSpot` bleiben unberührt (jede Station = ein Wort); die Rate-Logik
// und die verdeckte Anzeige stecken allein in Szene + Hook. Drei Funksprüche, dann
// weiter. Wie Höhle/Sturm eine freie Zone (nie im Pflicht-Tor), hier aber ohne Zwang.

/**
 * Polarstation-Kurs (E6, Bauplan §4.5): eine station-Etappe aus {@link STATION_WORDS}
 * Rate-Wörtern (von kurz nach lang) aus den freigeschalteten Tasten
 * ({@link stationGuessWords}). `seed` variiert die Auswahl (Tages-Parcours); die
 * Umschalttaste im Tastensatz schaltet die Großschreibung der Nomen frei. Gibt es kein
 * getippbares Wort, bleibt der Kurs leer (die Zone entfällt) — sollte auf dieser
 * Reise-Stufe aber nie vorkommen.
 */
export function buildStationCourse(
  introduced: readonly string[],
  _letters: Record<string, LetterStat> | undefined,
  _mastery: Mastery,
  opts: { seed?: number; lernweg?: Lernweg } = {},
): FloeCourse {
  const { seed = 0, lernweg = "de" } = opts;
  const words = stationGuessWords(introduced, {
    count: STATION_WORDS,
    seed,
    lernweg,
    shiftLearned: introduced.includes(SHIFT_UNIT),
  });
  if (words.length === 0) return { stages: [] };
  return { stages: [{ kind: "station", units: words }] };
}
