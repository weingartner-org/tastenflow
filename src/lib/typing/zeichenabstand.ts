/**
 * „Zeichenabstand groß (CVI)" — grösserer Abstand zwischen JEDEM Zeichen, für
 * Kinder mit zerebraler Sehbehinderung (CVI - cerebral visual impairment), bei
 * denen eng stehende Zeichen ineinanderlaufen (Crowding). E11, 18./19.09.2026.
 *
 * Johannes, wörtlich: *„neben dem Schalter 'Zeit lassen' und 'Einhand'
 * brauchen wir noch 'Zeichenabstand groß (CVI)', und alle Abstände werden
 * dreimal so groß"* - dann: *„ja, der Abstand soll dann überall gelten, machen
 * wir vielleicht 3 Stufen: doppelt, dreifach, vierfache Laufweite"* - und:
 * *„die Laufweite muss zwischen jedem Zeichen größer werden, nicht nur bei
 * Leerzeichen"*.
 *
 * „Laufweite" = der Vorschub von einem Zeichen zum nächsten: doppelt = jedes
 * Zeichen nimmt die doppelte eigene Breite ein (der Zusatzabstand entspricht
 * einer Zeichenbreite), dreifach = die dreifache, vierfach = die vierfache.
 * Der FAKTOR trägt also direkt die Laufweite: 1 = aus (normale Laufweite),
 * 2 = doppelt, 3 = dreifach, 4 = vierfach.
 *
 * ★ 19.09.2026, Johannes nach dem Test mit Jano: *„mach die Abstände alle um
 * 25 % kleiner, das heißt doppelt ist um 1/4 weniger weit auseinander wie
 * jetzt, usw."* - der Zusatzabstand je Stufe ist seither 0,75 Zeichenbreiten
 * statt einer ({@link LAUFWEITE_CH_JE_STUFE}).
 *
 * ZWEI QUELLEN, eine Wahrheit — dieselbe Bauart wie „Zeit lassen"
 * (siehe `noTimePressure.ts`):
 *   • MIT Kind-Konto entscheidet das Konto (`TypingAccount.zeichenabstand`).
 *     ★ Seit 19.09.2026 stellt ihn JEDES Kind selbst im Zahnrad ein, auch
 *     eines einer Klasse - Johannes, wörtlich: *„die CVI-Einstellungen kann
 *     sich jedes Kind immer auch selbst in den Einstellungen einstellen, aber
 *     auch die Lehrkraft, Kinder dürfen es ändern wie sie möchten"*. Die
 *     Lehrkraft stellt ihn weiter je Kind in „Meine Klassen" um; wer zuletzt
 *     stellt, gilt, und das Kind sieht ihre Änderung sofort (Realtime-Abo
 *     `kontoBeobachten` in `useTypingAuth.ts`). Der Server-Guard
 *     `tt_pupils_field_guard` prüft nur den Wert (1-4).
 *   • OHNE Kind-Konto (Gäste, Lehrkräfte, die selbst üben) merkt ihn dieses
 *     Gerät.
 *
 * EIN Ort für die Rechnung: Die Klasse `tt-laufweite` UND die CSS-Variable
 * `--tt-laufweite` (siehe `index.css`) sind der einzige Mechanismus, der ihn
 * umsetzt - jeder Bildschirm, auf dem ein Kind Text abschreibt, bekommt
 * denselben Faktor über `TypingSession`. Siehe [[project_zehnfinger_trainer]].
 */
import type { CSSProperties } from "react";
import { create } from "zustand";
import type { Lang } from "./account";

/**
 * 1 = aus (normale Laufweite), 2 = doppelt, 3 = dreifach, 4 = vierfach,
 * 5 = „einfach" - siehe {@link laufweiteVergroessert}.
 */
export type ZeichenabstandFaktor = 1 | 2 | 3 | 4 | 5;

/**
 * Zusatzabstand je Stufe über „aus", in Zeichenbreiten (`ch`): doppelt = 1 ×,
 * dreifach = 2 ×, vierfach = 3 × dieser Wert. Seit 19.09.2026 0,75 statt 1
 * (Johannes: „alle um 25 % kleiner").
 *
 * ⚠️ ZWEI Stellen tragen ihn und müssen gleich bleiben, sonst sitzt der
 * Schreibzeiger neben dem sichtbaren Zeichen: `.tt-laufweite` in
 * `src/index.css` (gap der sichtbaren Zeile - CSS kann diese Konstante nicht
 * lesen, dort steht die Zahl) und das `letterSpacing` des unsichtbaren
 * Eingabefelds in `TypingSession.tsx` (liest sie von hier). Der Wächter
 * `tests/tastenflow-zeichenabstand.test.tsx` vergleicht beide.
 */
export const LAUFWEITE_CH_JE_STUFE = 0.75;

/**
 * ★★ DIE ZEILE GLEITET IM TAKT DES KINDES (Johannes 19.09.2026, wörtlich):
 * *„wer langsam schreibt, bei dem soll auch die Zeile langsam weitergehen,
 * beschleunigen und abbremsen, je schneller man schreibt, desto schneller muss
 * sich die Zeile bewegen, das Ruckartige ist für diese Kinder unnötiger
 * Stress - kann man das so bauen, dass es wenig Ressourcen braucht, nicht dass
 * es dann auf langsamen Rechnern erst ruckt"*.
 *
 * Bis dahin rückte die Zeile nach JEDEM Anschlag in festen 150 ms nach: Bei
 * einem Kind, das ein Zeichen in zwei Sekunden schreibt, ein kurzer Ruck und
 * danach Stillstand. Mit Zeichenabstand (CVI) dauert der Weg zum nächsten
 * Zeichen jetzt so lange wie der Takt des Kindes (85 % seines gleitenden
 * Anschlag-Abstands), mit Anfahren und Abbremsen. Wer gleichmässig schreibt,
 * sieht die Zeile fast ohne Halt laufen.
 *
 * Wenig Aufwand: Es ist ein CSS-Übergang auf `transform` - der Browser rechnet
 * ihn auf der Grafikkarte, ohne ein Programm, das jedes Bild neu zeichnet. Ein
 * langsamer Rechner, der gerade Sprache erzeugt oder speichert, bremst ihn
 * nicht. ★ Seit 28.09.2026 gleitet die Zeile mit CVI auch bei „weniger
 * Bewegung" im System (Klasse `tt-cvi-gleiten`, Ausnahme in `index.css`) -
 * an Schulrechnern setzt die IT das oft für alle, und die Zeile sprang.
 */
export const GLEIT_KURVE = "cubic-bezier(0.45, 0, 0.55, 1)";
export const GLEIT_MIN_MS = 150;
export const GLEIT_MAX_MS = 1000;
/** Ein längerer Abstand ist eine Pause, kein Takt - er zählt nicht mit. */
export const TAKT_PAUSE_MS = 4000;
/** Die Zeile ohne Zeichenabstand: wie seit jeher. */
export const ZEILE_UEBERGANG_NORMAL = "transform 150ms ease-out";

/** Gleitender Anschlag-Abstand: der neue Abstand zählt 40 %, der bisherige 60 %. */
export function naechsterTakt(bisher: number | null, abstandMs: number): number | null {
  if (!(abstandMs > 0) || abstandMs > TAKT_PAUSE_MS) return bisher;
  return bisher === null ? abstandMs : bisher * 0.6 + abstandMs * 0.4;
}

/** Wie lange die Zeile zum nächsten Zeichen gleitet (ohne Takt: 300 ms). */
export function gleitDauer(takt: number | null): number {
  const roh = takt === null ? 2 * GLEIT_MIN_MS : takt * 0.85;
  return Math.round(Math.min(GLEIT_MAX_MS, Math.max(GLEIT_MIN_MS, roh)));
}

/** Der Übergang für die Zeile und das unsichtbare Feld darüber. */
export function zeilenUebergang(zeichenabstand: ZeichenabstandFaktor, takt: number | null): string {
  if (zeichenabstand <= 1) return ZEILE_UEBERGANG_NORMAL;
  return `transform ${gleitDauer(takt)}ms ${GLEIT_KURVE}`;
}

/**
 * Die Reihenfolge im Auswahlfeld - von SCHMAL nach WEIT (22.09.2026,
 * Johannes: „einfach“ gehört nach oben, direkt nach „aus“, weil beide
 * dieselbe schmale Laufweite haben). Die ZAHLENWERTE selbst bleiben
 * unverändert (1 = aus … 5 = einfach) - nur diese Liste bestimmt, in
 * welcher Reihenfolge die Optionen im Zahnrad und in „Meine Klassen“
 * erscheinen.
 */
export const ZEICHENABSTAND_FAKTOREN: readonly ZeichenabstandFaktor[] = [1, 5, 2, 3, 4];

export const ZEICHENABSTAND_LABELS: Record<ZeichenabstandFaktor, string> = {
  1: "aus",
  2: "doppelt",
  3: "dreifach",
  4: "vierfach",
  5: "einfach",
};

/**
 * ★ EN2 (19.09.2026): dieselben Stufen in der englischen Bedienung (Glossar
 * §3.4, *Wide letter spacing (CVI)*). Wörter statt „2×": Eine Sprachausgabe
 * liest „2×" als „2 mal" oder „2 multipliziert" - „double" versteht jedes Kind.
 */
export const ZEICHENABSTAND_LABELS_EN: Record<ZeichenabstandFaktor, string> = {
  1: "off",
  2: "double",
  3: "triple",
  4: "four times",
  5: "simple",
};

/** ★ E11a-4 (26.09.2026): dieselben Stufen auf Französisch. */
export const ZEICHENABSTAND_LABELS_FR: Record<ZeichenabstandFaktor, string> = {
  1: "désactivé",
  2: "double",
  3: "triple",
  4: "quadruple",
  5: "simple",
};

/** ★ ES-O (27.09.2026): dieselben Stufen auf Spanisch. */
export const ZEICHENABSTAND_LABELS_ES: Record<ZeichenabstandFaktor, string> = {
  1: "desactivado",
  2: "doble",
  3: "triple",
  4: "cuádruple",
  5: "sencillo",
};

/** ★ O-IT (02.10.2026): „Spaziatura ampia (CVI): no · doppia · tripla · quadrupla" (Glossar §2.8). */
export const ZEICHENABSTAND_LABELS_IT: Record<ZeichenabstandFaktor, string> = {
  1: "no",
  2: "doppia",
  3: "tripla",
  4: "quadrupla",
  5: "semplice",
};

/**
 * ★ O-PL (02.10.2026): „Duże odstępy (CVI): wyłączone · podwójne · potrójne ·
 * poczwórne" (Glossar §2.8) - sächlich Mehrzahl, passend zu „odstępy"; Wörter
 * statt „2×".
 */
export const ZEICHENABSTAND_LABELS_PL: Record<ZeichenabstandFaktor, string> = {
  1: "wyłączone",
  2: "podwójne",
  3: "potrójne",
  4: "poczwórne",
  5: "pojedyncze",
};

/**
 * ★ O-TR (02.10.2026): "Geniş harf aralığı (CVI): kapalı · iki kat · üç kat ·
 * dört kat" (Glossar §2.8) - Wörter statt "2×".
 */
export const ZEICHENABSTAND_LABELS_TR: Record<ZeichenabstandFaktor, string> = {
  1: "kapalı",
  2: "iki kat",
  3: "üç kat",
  4: "dört kat",
  5: "tek kat",
};

/**
 * ★ O-CS (03.10.2026): „Větší mezery mezi znaky (CVI): vypnuto · dvojnásobné ·
 * trojnásobné · čtyřnásobné" (Glossar §2.8) - weiblich Mehrzahl, passend zu
 * „mezery"; Wörter statt „2×".
 */
export const ZEICHENABSTAND_LABELS_CS: Record<ZeichenabstandFaktor, string> = {
  1: "vypnuto",
  2: "dvojnásobné",
  3: "trojnásobné",
  4: "čtyřnásobné",
  5: "jednoduché",
};

/**
 * ★ O2-LIB (30.10.2026): „По-голямо разстояние между знаците (CVI): изкл. · двойно · тройно ·
 * четворно" (Glossar) - Wörter statt „2×"; „единично" für die einfache Stufe.
 */
export const ZEICHENABSTAND_LABELS_BG: Record<ZeichenabstandFaktor, string> = {
  1: "изкл.",
  2: "двойно",
  3: "тройно",
  4: "четворно",
  5: "единично",
};

/**
 * ★ O-EL-LIB (30.10.2026): «Μεγαλύτερη απόσταση γραμμάτων (CVI): όχι · διπλή · τριπλή · τετραπλή»
 * (Glossar §2.8) - weiblich, passend zu «απόσταση»; Wörter statt «2×».
 */
export const ZEICHENABSTAND_LABELS_EL: Record<ZeichenabstandFaktor, string> = {
  1: "όχι",
  2: "διπλή",
  3: "τριπλή",
  4: "τετραπλή",
  5: "απλή",
};

/**
 * ★ O2-LIB (30.10.2026): „Nagyobb betűköz (CVI): ki · kétszeres · háromszoros · négyszeres"
 * - Wörter statt „2×" (eine Sprachausgabe liest „2×" falsch).
 */
export const ZEICHENABSTAND_LABELS_HU: Record<ZeichenabstandFaktor, string> = {
  1: "ki",
  2: "kétszeres",
  3: "háromszoros",
  4: "négyszeres",
  5: "egyszeres",
};

/**
 * ★ O2-LIB (29.10.2026): "Brede letterafstand (CVI): uit · twee keer · drie keer · vier keer" (Glossar nl §2.8);
 * Wörter statt "2×" - eine Sprachausgabe liest "2×" falsch.
 */
export const ZEICHENABSTAND_LABELS_NL: Record<ZeichenabstandFaktor, string> = {
  1: "uit",
  2: "twee keer",
  3: "drie keer",
  4: "vier keer",
  5: "normaal",
};

/**
 * ★ O-LIB (30.10.2026): "Espaçamento largo (CVI): desligado · duplo · triplo · quádruplo" (Glossar §2.8) -
 * palavras em vez de "2×".
 */
export const ZEICHENABSTAND_LABELS_PT: Record<ZeichenabstandFaktor, string> = {
  1: "desligado",
  2: "duplo",
  3: "triplo",
  4: "quádruplo",
  5: "simples",
};

/**
 * ★ O2-LIB (29.10.2026): "Espaço maior entre letras (DVC): não · duplo · triplo · quádruplo"
 * (Glossar §2.8) - Wörter statt "2×".
 */
export const ZEICHENABSTAND_LABELS_BR: Record<ZeichenabstandFaktor, string> = {
  1: "não",
  2: "duplo",
  3: "triplo",
  4: "quádruplo",
  5: "simples",
};

/**
 * ★ O2-LIB (29.10.2026): „Spațiere mare între caractere (CVI): oprită · dublă · triplă · cvadruplă“
 * (Glossar §2.8) - weiblich, passend zu „spațiere“; Wörter statt „2×“.
 */
export const ZEICHENABSTAND_LABELS_RO: Record<ZeichenabstandFaktor, string> = {
  1: "oprită",
  2: "dublă",
  3: "triplă",
  4: "cvadruplă",
  5: "simplă",
};

/**
 * ★ O2-LIB (30.10.2026): "Större avstånd mellan tecknen (CVI): av · dubbelt · tredubbelt · fyrdubbelt" (Glossar sv §2.8);
 * Wörter statt "2×" - eine Sprachausgabe liest "2×" falsch.
 */
export const ZEICHENABSTAND_LABELS_SV: Record<ZeichenabstandFaktor, string> = {
  1: "av",
  2: "dubbelt",
  3: "tredubbelt",
  4: "fyrdubbelt",
  5: "enkelt",
};

/**
 * ★ O2-LIB (30.10.2026): „Широкі інтервали (CVI): вимкнено · удвічі · утричі · учетверо" (Glossar §2.8) - drei
 * Adverbien in einer Wortart; „звичайний" für einfach (§2.13); Wörter statt „2×".
 */
export const ZEICHENABSTAND_LABELS_UK: Record<ZeichenabstandFaktor, string> = {
  1: "вимкнено",
  2: "удвічі",
  3: "утричі",
  4: "учетверо",
  5: "звичайний",
};

/**
 * ★ ES-O: EINE Tabelle je Bedienungssprache statt der Weiche
 * `sprache === "en" ? … : sprache === "fr" ? … : Deutsch` - die lieferte für
 * „es" still Deutsch (Falle 30).
 */
export const ZEICHENABSTAND_LABELS_JE_SPRACHE: Record<Lang, Record<ZeichenabstandFaktor, string>> = {
  de: ZEICHENABSTAND_LABELS,
  en: ZEICHENABSTAND_LABELS_EN,
  fr: ZEICHENABSTAND_LABELS_FR,
  es: ZEICHENABSTAND_LABELS_ES,
  it: ZEICHENABSTAND_LABELS_IT,
  pl: ZEICHENABSTAND_LABELS_PL, // ★ O-PL
  tr: ZEICHENABSTAND_LABELS_TR, // ★ O-TR
  cs: ZEICHENABSTAND_LABELS_CS, // ★ O-CS (03.10.2026)
  // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: ZEICHENABSTAND_LABELS_BG,
  el: ZEICHENABSTAND_LABELS_EL,
  hu: ZEICHENABSTAND_LABELS_HU,
  nl: ZEICHENABSTAND_LABELS_NL,
  pt: ZEICHENABSTAND_LABELS_PT,
  br: ZEICHENABSTAND_LABELS_BR,
  ro: ZEICHENABSTAND_LABELS_RO,
  sv: ZEICHENABSTAND_LABELS_SV,
  uk: ZEICHENABSTAND_LABELS_UK,
};

/**
 * Rohwert (Konto, evtl. `undefined`/`0`/Alt-Konto ohne dieses Feld) auf einen
 * gültigen Faktor bringen. Alles ausser 2, 3, 4 oder 5 gilt als „aus".
 */
export function zeichenabstandFaktor(
  wert: number | null | undefined,
): ZeichenabstandFaktor {
  return wert === 2 || wert === 3 || wert === 4 || wert === 5 ? wert : 1;
}

/*
 * ★★★ ÜBERALL (19.09.2026). Johannes, wörtlich: *„wer CVI eingestellt hat,
 * sieht es überall so, bei Tippchallenges, Klassenmatch, Übungen und Spielen,
 * überall"*. Bis dahin trug nur `TypingSession` die Laufweite - die Wortspiele
 * mit eigenem Bildschirm (Rätsel, Buchstabensalat) und die Polar-Expedition
 * nicht.
 *
 * Es bleibt EINE Rechnung - `(Faktor − 1) × LAUFWEITE_CH_JE_STUFE`
 * Zeichenbreiten -, nur in drei Formen, je nachdem, wie ein Bildschirm seine
 * Zeichen setzt:
 *   • {@link laufweiteAttrs}: eine Zeichen-ZEILE aus Flex-Elementen (je Zeichen
 *     ein Element) - Klasse `tt-laufweite` + Variable, `gap` in `index.css`.
 *     So setzt `TypingSession` seine Übungszeile.
 *   • {@link laufweiteText}: FLIESSTEXT und EINGABEFELDER (ein Textknoten) -
 *     `letter-spacing`, dieselbe Zusatzstrecke, die `TypingSession` auf die
 *     Grundlaufweite seines Übungsfelds legt. Der Schreibzeiger eines
 *     sichtbaren Eingabefelds sitzt damit von selbst richtig: Der Browser setzt
 *     ihn nach der gesperrten Laufweite. ★ Seit 20.09.2026 trägt der
 *     FLIESSTEXT dazu einen mitgewachsenen Zeilenabstand; für ein
 *     einzeiliges Feld gibt es `laufweiteFeld` ohne ihn.
 *   • {@link laufweiteZusatzIn}: die SVG-Szenen der Spiele - dort steht jedes
 *     Zeichen einzeln in seinem Kästchen, es gibt weder `gap` noch `ch`. Die
 *     Zusatzstrecke kommt in Szenen-Einheiten zwischen die Kästchen.
 *
 * ⚠️ NUR SICHTBAR: Keine dieser Formen fügt ein Zeichen ein. Textinhalt, Wert
 * und zugänglicher Name bleiben Buchstabe für Buchstabe gleich - eine
 * Braillezeile und eine Sprachausgabe merken nichts davon, die Zeile springt
 * nie. Der Wächter: `tests/tastenflow-cvi-ueberall.test.tsx`.
 */

/**
 * ★★★★★ STUFE 5 „OHNE LAUFWEITE" (22.09.2026). Johannes, wörtlich: *„mach noch
 * eine einstellung bei der die Laufweite gar nicht vergrößert wird aber alles
 * andere: verdunkelung und zeilenschaltung trotzdem bleibt"*.
 *
 * Verdunkelung (`CviAbdunkeln`), das Gleiten der Zeile im Schreibtakt
 * ({@link zeilenUebergang}) und die Lesezeile (`CviLesezeile`) hängen
 * überall nur an `zeichenabstand > 1` - das bleibt bei Stufe 5 unverändert
 * wahr, es ist an dieser Rechnung nichts zu ändern.
 *
 * Nur die Zeichen- und Zeilenabstands-GRÖSSE selbst - `laufweiteZusatz`,
 * `laufweiteZeilenhoehe`, `laufweiteZusatzIn` und die Bedingung in
 * `laufweiteText`/`laufweiteFeld`/`laufweiteAttrs` - soll bei Stufe 5 so
 * bleiben wie bei „aus". Dafür EIN Ort: Stufe 5 rechnet mit dem
 * WIRKSAMEN Faktor 1 statt mit sich selbst.
 */
export function laufweiteVergroessert(faktor: ZeichenabstandFaktor): boolean {
  return faktor === 2 || faktor === 3 || faktor === 4;
}

/** Der wirksame Faktor für die Zeichen-/Zeilenabstands-Rechnung - siehe {@link laufweiteVergroessert}. */
export function laufweiteWirksamerFaktor(faktor: ZeichenabstandFaktor): ZeichenabstandFaktor {
  return laufweiteVergroessert(faktor) ? faktor : 1;
}

/** Die Zusatzstrecke als CSS-Länge: `calc((3 - 1) * 0.75ch)` bei „dreifach". */
export function laufweiteZusatz(faktor: ZeichenabstandFaktor): string {
  const wirksam = laufweiteWirksamerFaktor(faktor);
  return `calc((${wirksam} - 1) * ${LAUFWEITE_CH_JE_STUFE}ch)`;
}

/**
 * ★★ DER ZEILENABSTAND WÄCHST MIT (20.09.2026). Testerin hat den Lückentext
 * „Was fehlt hier?" mit ihrem Schüler (CVI) getestet und ein Bild geschickt:
 * Die ZEICHEN standen weit auseinander, die ZEILEN klebten unverändert eng
 * aufeinander - der Text zerfiel in Zeichen, statt in Zeilen zu ordnen.
 * Johannes, wörtlich: *„Kann man die Abstände zwischen den Zeilen im
 * Verhältnis zur Laufweite der Buchstaben auch anpassen? Je weiter
 * Einzelzeichen auseinander sind, umso größer werden die Zeilenabstände."* -
 * und über das Bild selbst: *„Ich habe kein CVI, aber das wäre mir zu krass."*
 *
 * 1,5 ist die Grundlinie: ein gut lesbarer Zeilenabstand für Fliesstext, den
 * auch WCAG 1.4.8 als Richtwert nennt. Je Stufe kommen 0,25 dazu - doppelt
 * 1,75, dreifach 2,0, vierfach 2,25. Die Zeilen folgen damit der Laufweite,
 * ohne dass die Seite auseinanderfällt.
 *
 * ⚠️ Bei „aus" wird der Zeilenabstand NICHT angefasst - dann bleibt das
 * `leading-*` des Elements stehen, wie es seit jeher war.
 */
export const LAUFWEITE_ZEILENHOEHE_NORMAL = 1.5;
export const LAUFWEITE_ZEILENHOEHE_ZUSCHLAG_JE_STUFE = 0.25;

/** Der Zeilenabstand zur Laufweite - siehe die beiden Konstanten darüber. */
export function laufweiteZeilenhoehe(faktor: ZeichenabstandFaktor): number {
  const wirksam = laufweiteWirksamerFaktor(faktor);
  return (
    LAUFWEITE_ZEILENHOEHE_NORMAL + (wirksam - 1) * LAUFWEITE_ZEILENHOEHE_ZUSCHLAG_JE_STUFE
  );
}

/**
 * Fliesstext: `letterSpacing` mit der Zusatzstrecke UND (seit 20.09.2026) der
 * mitgewachsene Zeilenabstand. Bei „aus" NICHTS - dann bleiben die gewohnte
 * Laufweite und der gewohnte Zeilenabstand des Elements stehen.
 *
 * ⚠️ `overflowWrap: "break-word"` gehört dazu (gemessen 19.09.2026, 375 px,
 * dreifach): Ein langes Wort („Weihnachtsbaumschmuck") ist gesperrt doppelt
 * so breit wie das Handy - ohne Umbruch rollte die ganze Seite seitlich. So
 * bricht nur ein Wort um, das sonst überliefe; alles andere bleibt, wie es
 * war. In einem Eingabefeld wirkt es nicht (das rollt ohnehin in sich).
 *
 * ⚠️ Für ein EINGABEFELD gibt es {@link laufweiteFeld}: Ein einzeiliges Feld
 * hat keinen Zeilenabstand zu vergrössern - ein `line-height` macht dort nur
 * das Feld höher, ohne dass eine einzige Zeile mehr Luft bekäme.
 */
export function laufweiteText(faktor: ZeichenabstandFaktor): CSSProperties | undefined {
  return laufweiteVergroessert(faktor)
    ? {
        letterSpacing: laufweiteZusatz(faktor),
        overflowWrap: "break-word",
        lineHeight: laufweiteZeilenhoehe(faktor),
      }
    : undefined;
}

/**
 * Einzeiliges EINGABEFELD: dieselbe Laufweite wie der Text daneben, aber ohne
 * Zeilenabstand - ein Feld mit einer Zeile wird davon nur höher (20.09.2026).
 * Der Schreibzeiger sitzt weiter von selbst richtig: Der Browser setzt ihn
 * nach der gesperrten Laufweite.
 */
export function laufweiteFeld(faktor: ZeichenabstandFaktor): CSSProperties | undefined {
  return laufweiteVergroessert(faktor) ? { letterSpacing: laufweiteZusatz(faktor) } : undefined;
}

/**
 * Zeichen-Zeile aus Flex-Elementen: die Klasse `tt-laufweite` und die Variable
 * `--tt-laufweite` (Faktor). Bei „aus" weder Klasse noch Variable - so wie
 * `TypingSession` es seit E11 hält.
 */
export function laufweiteAttrs(faktor: ZeichenabstandFaktor): {
  className: string;
  style: CSSProperties | undefined;
} {
  return laufweiteVergroessert(faktor)
    ? { className: "tt-laufweite", style: { "--tt-laufweite": faktor } as CSSProperties }
    : { className: "", style: undefined };
}

/**
 * „1ch" - die Breite der Ziffer 0 - in Schriftgrössen. SVG kennt kein `ch`;
 * für system-ui und die Lese-Schrift (`font-legible`) liegt sie bei rund 0,55.
 */
export const CH_JE_SCHRIFTGROESSE = 0.55;

/**
 * Die Zusatzstrecke in Szenen-Einheiten für Zeichen der Schriftgrösse
 * `schrift` (SVG-Spielszenen). Bei „aus" 0 - die Szene bleibt, wie sie war.
 */
export function laufweiteZusatzIn(faktor: ZeichenabstandFaktor, schrift: number): number {
  const wirksam = laufweiteWirksamerFaktor(faktor);
  return (wirksam - 1) * LAUFWEITE_CH_JE_STUFE * CH_JE_SCHRIFTGROESSE * schrift;
}

const KEY = "tippen-zeichenabstand";

function read(): ZeichenabstandFaktor {
  try {
    return zeichenabstandFaktor(Number(localStorage.getItem(KEY)));
  } catch {
    return 1;
  }
}

function write(faktor: ZeichenabstandFaktor): void {
  try {
    if (faktor > 1) localStorage.setItem(KEY, String(faktor));
    else localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

interface ZeichenabstandState {
  /** Der GERÄTE-Wert (gilt nur ohne Konto bzw. für Lehrkräfte/Gäste). */
  faktor: ZeichenabstandFaktor;
  setFaktor: (faktor: ZeichenabstandFaktor) => void;
}

export const useDeviceZeichenabstand = create<ZeichenabstandState>((set) => ({
  faktor: read(),
  setFaktor: (faktor: ZeichenabstandFaktor) => {
    write(faktor);
    set({ faktor });
  },
}));
