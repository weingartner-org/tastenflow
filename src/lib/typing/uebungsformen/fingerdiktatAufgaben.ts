/**
 * FINGERDIKTAT - die blindenspezifischste Übungsform der ganzen Liste.
 *
 * Jede andere Form zeigt irgendetwas: einen Text zum Abschreiben, ein Wort,
 * eine Zeile. Ein Fingerdiktat zeigt NICHTS. Das Kind hört „rechter
 * Mittelfinger" und tippt den Buchstaben, der auf diesem Finger liegt - ganz
 * ohne Vorlage, nur über das Ohr (die Ansage) und den Griff (die gelernte
 * Fingerzuordnung). Wer schummeln wollte, könnte es nicht: Es gibt nichts
 * abzuschreiben. Aus Testerin Mail, mit Johannes am 01.09.2026 besprochen
 * (`AUFTRAG-2026-09-02-UEBUNGSFORMEN-CHARGE-A-UND-B.md`).
 *
 * ★★★★★ AUCH AUSSERHALB DER GRUNDREIHE (20.09.2026, Punkt 13 aus Testerin
 * Durchgang). Johannes wörtlich: *„Hier wäre es zum Einen nett, auch andere
 * Buchstaben als die Grundreihe abzufragen."* Bis dahin fragte die Form NUR
 * die zehn Grundreihen-Zeichen ab - mit genau der Begründung, die jetzt die
 * ERWEITERUNG trägt statt sie zu verhindern: Ausserhalb der Grundreihe meint
 * „rechter Mittelfinger" nicht mehr genau eine Taste (ein Finger bedient JEDE
 * seiner Reihen). Die Lösung ist nicht, die Reihe wegzulassen, sondern sie
 * MITZUSAGEN: „linker Mittelfinger, obere Reihe" (= e), „rechter
 * Zeigefinger, untere Reihe" (= irgendein Zeichen der unteren Reihe auf
 * diesem Finger). Innerhalb der Grundreihe bleibt die Ansage wortgleich wie
 * vorher - dort trägt der Finger allein schon die volle Information.
 *
 * Geübt werden jetzt alle freigeschalteten BUCHSTABEN (`../letters.ts`
 * `LETTER_ORDER`, gefiltert über `ctx.introduced`) - keine Umschaltung, keine
 * Satzzeichen, keine Ziffern: Für die brauchte es eine Zusatztaste oder eine
 * andere Fingerzuordnung, und genau darüber sagt diese Form nichts.
 *
 * ★★★ Der Fingername kommt IMMER aus `fingers.ts` (`fingerForChar` +
 * `fingerName`), die REIHE IMMER aus `fingers.ts` (`rowForChar` + `rowName`) -
 * nie von Hand geschrieben. Genau so eine Doppelung ist in diesem Projekt
 * schon mehrfach auseinandergelaufen (zwei Stellen, die dasselbe getrennt
 * wussten); `tests/tastenflow-form-fingerdiktat.test.ts` sichert das für jede
 * einzelne erzeugte Aufgabe ab.
 *
 * Diese Form bringt einen EIGENEN Bildschirm mit (`eigenerBildschirm:
 * "raetsel"` in `typen.ts`) - hier wird nur die Aufgaben-Liste und ihre
 * Auswahl-Logik gebaut, kein Bildschirm.
 */
import { FINGERS, fingerForChar, fingerName, homeKeyFor, rowForChar, rowName, GRUNDREIHE_INDEX, type FingerId, type FingerInfo } from "../fingers";
import { lernwegDef } from "../lernweg";
import type { FormKontext } from "./typen";
import type { Lang } from "../account";
import { texte } from "../../bedienSprache/texte";
import { bedienSpracheVon } from "./bedienung";

/** Eine einzelne Aufgabe: Ansage (Finger, ggf. + Reihe) → erwartetes Zeichen. */
export interface FingerAufgabe {
  /** Was angesagt und angezeigt wird, z. B. `rechter Mittelfinger` oder
   *  `linker Mittelfinger, obere Reihe` (ausserhalb der Grundreihe). */
  ansage: string;
  /** Das Zeichen, das dann getippt werden muss. */
  zeichen: string;
}

interface Kandidat {
  zeichen: string;
  finger: FingerId;
  /** Reihen-Index (0 Zahlenreihe … 3 untere Reihe, siehe `fingers.ts`). */
  reihe: number;
  ansage: string;
}

/**
 * Die ANSAGE zu einem Zeichen: innerhalb der Grundreihe nur der Finger
 * (wortgleich wie vor dem 20.09.2026), ausserhalb der Grundreihe Finger UND
 * Reihe - erst beide zusammen grenzen die Taste so weit ein, wie es das
 * Tastaturbild erlaubt.
 */
function ansageFuerZeichen(finger: FingerInfo, zeichen: string, reihe: number, lang: Lang): string {
  const name = fingerName(finger, lang);
  if (reihe === GRUNDREIHE_INDEX) return name;
  const reihenName = rowName(zeichen, lang);
  return reihenName ? `${name}, ${reihenName}` : name;
}

/**
 * Diese vier Buchstaben gibt es nur im Deutschen. Die Fingerdiktat-Ansage
 * „Die Antwort ist: ö." wäre in ENGLISCHER Übungssprache ein deutsches Wort
 * ohne `lang="de"` mitten in einem englischen Satz - unaussprechbar für eine
 * englische Stimme und ein Fund für den Deutsch-Fänger
 * (`tests/tastenflow-wortspiele-englisch.test.tsx`). Freigeschaltet sind sie
 * trotzdem (die Taste sitzt auf jeder deutschen/österreichischen Tastatur
 * unabhängig von der Übungssprache) - geübt wird sie nur im normalen Trainer,
 * nicht in DIESEM rein akustischen Rätsel.
 */
const NUR_DEUTSCHE_BUCHSTABEN: ReadonlySet<string> = new Set(["ä", "ö", "ü", "ß"]);

/** Freigeschaltete Buchstaben mit ihrem Finger, ihrer Reihe und ihrer Ansage. */
function kandidaten(ctx: FormKontext): Kandidat[] {
  const treffer: Kandidat[] = [];
  // ★ E6a (24.09.2026): die Buchstaben-Reihenfolge DES LERNWEGS - vorher
  // stand hier immer die deutsche `LETTER_ORDER`, ein Fingerdiktat auf Weg
  // „en" hätte darum nie einen englischen Buchstaben abgefragt.
  for (const zeichen of lernwegDef(ctx.lernweg).letterOrder) {
    if (!ctx.introduced.includes(zeichen)) continue;
    if (ctx.lang !== "de" && NUR_DEUTSCHE_BUCHSTABEN.has(zeichen)) continue;
    const finger = fingerForChar(zeichen);
    if (!finger) continue;
    const reihe = rowForChar(zeichen);
    if (reihe === null) continue;
    treffer.push({
      zeichen,
      finger: finger.id,
      reihe,
      ansage: ansageFuerZeichen(finger, zeichen, reihe, ctx.lang),
    });
  }
  return treffer;
}

/**
 * ★★★★★ ALLE ZEICHEN, DIE DIE ANSAGE MEINEN KANN - nicht nur eines.
 *
 * Testerin am 04.09.2026 nach ihrem Test: *„Beim Fingerdiktat meinte das
 * Programm bei ‚rechter Zeigefinger‘, es müsse ein K kommen."* Eine Woche
 * davor hatte sie dasselbe für die linke Hand gemeldet (*„Dopplung: linker
 * Zeigefinger ist f UND g"*) - damals als Wunsch verbucht, nicht als Fehler.
 * Es war einer, und er hat einen Zwilling auf der rechten Seite.
 *
 * Gemessen an `fingers.ts` über die zehn Grundreihen-Zeichen:
 *
 * | Ansage                | kann meinen |
 * |-----------------------|-------------|
 * | linker Zeigefinger    | **f** oder **g** |
 * | rechter Zeigefinger   | **h** oder **j** |
 * | die anderen sechs     | eindeutig |
 *
 * `g` und `h` liegen in der Grundreihe, haben aber keinen eigenen Finger. Die
 * ANSAGE kann sie nicht von der Heimattaste unterscheiden. Nahm die Aufgabe
 * nur ein Zeichen an, hörte ein Kind „rechter Zeigefinger", tippte `h` -
 * richtig, derselbe Finger - und bekam gesagt, es sei falsch. **Es hat recht
 * und lernt, dass es unrecht hat**; das ist die teuerste Sorte Fehler, die
 * eine Übung machen kann.
 *
 * ★ 20.09.2026 (Punkt 13): Dieselbe Zweideutigkeit gibt es AUSSERHALB der
 * Grundreihe genauso - die Zeigefinger bedienen in JEDER Reihe zwei Spalten
 * (in der oberen Reihe z. B. „r" UND „t", beide linker Zeigefinger). Die Reihe
 * in der Ansage grenzt darum auf FINGER + REIHE ein, löst die Zweideutigkeit
 * aber nicht restlos auf - genau wie in der Grundreihe zählen dann ALLE
 * gemeinten Zeichen als richtig.
 *
 * ⇒ Angenommen wird jedes freigeschaltete Zeichen dieses Fingers AUF
 * DERSELBEN REIHE. **Die Heimattaste steht vorn**, wenn sie zu den Geschwistern
 * gehört (nur innerhalb der Grundreihe möglich) - weil der Rätsel-Bildschirm
 * nach einem Fehlgriff `antworten[0]` nennt („Die Antwort ist: j."); ausserhalb
 * der Grundreihe (keine Heimattaste in der Reihe) steht das gefragte Zeichen
 * selbst vorn.
 *
 * ⏳ Was das NICHT löst: Testerin eigentlicher Wunsch, den Griff zu `g`/`h`
 * überhaupt ansagen zu können („Spreizgriff"). Das ist eine Benennung und
 * gehört zu Johannes - hier wird nur aufgehört, ein richtiges Kind für falsch
 * zu erklären.
 */
export function zeichenDerAnsage(zeichen: string, ctx: FormKontext): string[] {
  const finger = fingerForChar(zeichen);
  if (!finger) return [zeichen];
  const reihe = rowForChar(zeichen);
  const geschwister = kandidaten(ctx)
    .filter((k) => k.finger === finger.id && k.reihe === reihe)
    .map((k) => k.zeichen);
  // ★ E8 (24.09.2026): die Heimattaste DES WEGES - auf Weg „en" mit US/UK-
  // Tastatur ist die des rechten kleinen Fingers „;", nicht „ö" (`homeKeyFor`).
  const heim = homeKeyFor(FINGERS[finger.id], ctx.lernweg);
  const vorn = geschwister.includes(heim) ? heim : zeichen;
  return [vorn, ...geschwister.filter((z) => z !== vorn)];
}

/**
 * Taugt ein Fingerdiktat mit diesem Tastenstand? Erst ab vier verschiedenen
 * freigeschalteten Fingern - darunter wäre die Aufgabe geraten statt
 * gekonnt, weil zu wenige Möglichkeiten übrig bleiben.
 */
export function fingerdiktatTaugt(ctx: FormKontext): boolean {
  const finger = new Set(kandidaten(ctx).map((k) => k.finger));
  return finger.size >= 4;
}

/**
 * Baut die Aufgaben-Liste: ungefähr `ctx.count` Aufgaben aus den
 * freigeschalteten Buchstaben, gezogen über `ctx.zufall()`.
 * Derselbe Finger kommt nie zweimal direkt hintereinander dran (und damit
 * erst recht nie dreimal) - sonst hört ein Kind zwei Aufgaben mit demselben
 * Finger hintereinander und übt genau die Abwechslung nicht, um die es geht.
 */
export function fingerdiktatAufgaben(ctx: FormKontext): FingerAufgabe[] {
  const pool = kandidaten(ctx);
  if (pool.length === 0) return [];

  const aufgaben: FingerAufgabe[] = [];
  let letzterFinger: FingerId | null = null;
  // Sicherung gegen eine Endlosschleife, falls der Pool trotz
  // `fingerdiktatTaugt` zu wenige verschiedene Finger hergibt - dann bleibt
  // die Liste eben kürzer als `ctx.count`, statt hängenzubleiben.
  let versuche = 0;
  const maxVersuche = Math.max(ctx.count, 1) * 50;

  while (aufgaben.length < ctx.count && versuche < maxVersuche) {
    versuche++;
    const kandidat = pool[Math.floor(ctx.zufall() * pool.length)];
    if (kandidat.finger === letzterFinger) continue;
    aufgaben.push({ ansage: kandidat.ansage, zeichen: kandidat.zeichen });
    letzterFinger = kandidat.finger;
  }
  return aufgaben;
}

/** Bedienung (EN4) - Deutsch wortgleich wie vorher. */
const ANKUENDIGUNG = texte({
  de: { satz: "Jetzt kommt ein Fingerdiktat. Du hörst einen Finger und tippst seinen Buchstaben." },
  en: { satz: "Now for a finger dictation. You'll hear a finger - type its letter." },
  // ★ E11a-5 (26.09.2026): Französisch aus der Funktion neu geschrieben (tu, kurz).
  fr: { satz: "Voici une dictée des doigts. Tu entends un doigt et tu tapes sa lettre." },
  es: { satz: "Aquí tienes un dictado de dedos. Oyes un dedo y escribes su letra." },
  it: { satz: "Ora tocca al dettato delle dita. Senti un dito e scrivi la sua lettera." },
  // ★ O-PL (02.10.2026): „Teraz kolej na: …" - der Name nach dem Doppelpunkt im Nominativ (Glossar §2.2).
  pl: { satz: "Teraz kolej na: Dyktando palców. Słyszysz nazwę palca i piszesz jego literę." },
  // ★ O-TR (02.10.2026): "Sırada: ..." - der Name nach dem Doppelpunkt, ohne Endung (Glossar §2.2).
  tr: { satz: "Sırada: Parmak dikte. Bir parmağın adını duyarsın ve o parmağın harfini yazarsın." },
  // ★ O-CS (03.10.2026): „Teď: ..." - der Name nach dem Doppelpunkt im Nominativ, klein (Glossar §2.2).
  cs: { satz: "Teď: diktát prstů. Uslyšíš název prstu a napíšeš jeho písmeno." },
  // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: {
    satz: "Сега: диктовка за пръстите. Чуваш един пръст - напиши неговата буква.",
  },
  el: {
    satz: "Τώρα: υπαγόρευση δαχτύλων. Ακούς ένα δάχτυλο - γράψε το γράμμα του.",
  },
  hu: {
    satz: "Most: ujjtollbamondás. Hallasz egy ujjat - írd le a betűjét.",
  },
  nl: {
    satz: "Nu: vingerdictee. Je hoort een vinger - typ zijn letter.",
  },
  pt: {
    satz: "Agora: ditado dos dedos. Ouves um dedo - escreve a letra dele.",
  },
  br: {
    satz: "Agora: ditado dos dedos. Você ouve um dedo - digite a letra dele.",
  },
  ro: {
    satz: "Acum: dictarea degetelor. Auzi un deget - scrie litera lui.",
  },
  sv: {
    satz: "Nu: fingerdiktamen. Du hör ett finger - skriv dess bokstav.",
  },
  uk: {
    satz: "Далі: диктант для пальців. Ти чуєш палець - надрукуй його літеру.",
  },
});

/**
 * Die Ankündigung auf der Abschluss-Karte - für ein Kind mit Blindheit die
 * einzige Information über das, was kommt.
 */
export function fingerdiktatAnkuendigung(ctx: FormKontext): string {
  return ANKUENDIGUNG[bedienSpracheVon(ctx)].satz;
}
