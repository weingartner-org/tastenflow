/**
 * WÄCHTER-TEST Altersgerechtigkeit (AG-E4, 29.07.2026).
 *
 * Lehre vom 28.07.: nicht gegen Hand-Listen prüfen, sondern gegen REGELN.
 * Dieser Test hält die Regeln fest, die »zu kindlich für die Älteren«
 * strukturell beenden — als RATSCHE: Die eingefrorenen Baselines (Stand
 * 29.07.2026, gemessen am aktiven Korpus) dürfen nur SINKEN. Wer neuen
 * Inhalt einpflegt, der eine Baseline anhebt, bricht den Build — genau das
 * unbemerkte Zurückrutschen, das dieses Problem hat wachsen lassen.
 *
 * Die Gegenrichtung sichern die VERSORGUNGS-BÖDEN: Keine Stufe darf durch
 * Aussortieren weniger servierbare Zeilen haben als heute (»kein
 * Inhalts-Verlust ohne Ersatz«, Johannes — Weiche 4: erst schreiben, dann
 * aussortieren). Beim Absenken einer Baseline nach echtem Ersatz: Zahl hier
 * im Test nachziehen und die neue Messung in der Übergabe notieren.
 */
import { describe, it, expect } from "vitest";
import {
  BADGES,
  CORPUS,
  CORPUS_EN,
  SERIEN,
  UI_COPY,
  badgeName,
  fitText,
  gateModeFor,
  isDeactivated,
  showsConfetti,
  skinForStufe,
  usesMascots,
} from "../src/lib/typing";
import { TIER_CHARS } from "../src/lib/typing/tiers";
import { INTRO_ORDER, SHIFT_UNIT } from "../src/lib/typing/letters";
import { fitsKeys } from "../src/lib/typing/corpus";
import { serieLines } from "../src/lib/typing/serie";
import type { Serie } from "../src/lib/typing/serie";
import {
  STUFEN as KONTO_STUFEN,
  contentStufenFor,
} from "../src/lib/typing/account";
import type { KontoStufe, Stufe } from "../src/lib/typing/account";

/**
 * Ab wie vielen Einheiten aus `INTRO_ORDER` ist JEDE Zeile einer Serie
 * tippbar? Maßgeblich sind die TASTEN, nicht das grobe Tier — eine einzige
 * späte Zeile sperrt die ganze Serie (gleiche Rechnung wie
 * `scripts/_seroeffnung.mts` und `scripts/_zehnzwoelf.mts`).
 */
const ALLOWED_N = INTRO_ORDER.map((_, i) => {
  const s = new Set<string>();
  for (const u of INTRO_ORDER.slice(0, i + 1)) {
    if (u === SHIFT_UNIT) continue;
    s.add(u.toLowerCase());
  }
  return s;
});
function oeffnetBei(s: Serie): number {
  for (let n = 1; n <= INTRO_ORDER.length; n++) {
    if (serieLines(s).every((z) => fitsKeys(z, ALLOWED_N[n - 1]))) return n;
  }
  return 99;
}

/**
 * ── Doppel-Freigaben, nur SINKEND ───────────────────────────────────────────
 *
 * Die alte Frage war „steht diese Zeile gleichzeitig bei den Siebenjährigen und
 * bei den Fünfzehnjährigen?". Mit drei Stufen heißt sie: **kids UND erwachsen**
 * — 7-10 zusammen mit „ab 16". Die mittlere Stufe teilt sich naturgemäß mit
 * beiden Nachbarn (das ist keine Auffälligkeit, sondern der Zweck der
 * Einteilung), die beiden ÄUSSEREN nicht.
 *
 * Warum das keine Aufräum-Liste ist (die Lehre vom 30.07.): Ein Regex-Signal
 * ist eine Obergrenze, kein Befund. Von den 307 DE-Zeilen ist der Großteil
 * altersneutral (Sprichwörter, Naturfakten, Zungenbrecher) — „Steter Tropfen
 * höhlt den Stein." gehört wirklich allen. Wer die Zahl senken will, liest
 * ZEILE FÜR ZEILE gegen die Rahmung; ein Rundumschlag stürzte 10-12 bei den
 * ersten 13 Tasten einmal von 78 auf 3.
 *
 * Beide Sprachen sind redigiert (Charge S3, Phasen 1 und 2).
 */
const KIDS_MIT_ERWACHSEN_MAX_DE = 307;
const KIDS_MIT_ERWACHSEN_MAX_EN = 536;

/**
 * Serien, die kids UND erwachsen zugleich gehören — DE muss 0 sein, EN ebenso.
 * **Ziel erreicht: 0** (Charge I2b, 21.08.2026).
 *
 * Bis dahin standen hier 3: »Water and Weather«, »A Trip Through Space« und
 * »How Animals Sleep« trugen alle drei Stufen zugleich, also Siebenjährige und
 * Erwachsene an derselben Zeile. Warum sie so lange stehen blieben, steht
 * unten am Test — und warum sie jetzt gehen konnten, steht bei REGAL_BODEN.
 *
 * Ab hier ist die Zahl ein WÄCHTER, kein Ziel mehr: Wer eine englische Serie
 * wieder für beide äußeren Stufen freigibt, bricht den Build.
 */
const EN_KIDS_UND_ERWACHSEN_MAX = 0;

/**
 * DER WICHTIGSTE WÄCHTER — die Versorgungs-Ratsche der drei Stufen (S4).
 *
 * Servierbare, entdoppelte Zeilen je KONTO-STUFE × Tier (T0…T5) — dürfen nur
 * WACHSEN. Bis S1 hingen diese Böden an den Inhalts-Etiketten (a/b/c). Das
 * taugte nach S3 nicht mehr: die Redaktion hat diese Etiketten ERSETZT, jede
 * Zelle „a" wäre zwangsläufig auf 0 gefallen. Gemessen wird darum an dem, was
 * ein Mensch dieser Stufe wirklich bekommt (`contentStufenFor`) — eine Größe,
 * die vor, während und nach jeder Umetikettierung dieselbe Bedeutung hat.
 *
 * Die Zahlen sind der Stand NACH der Redaktion (`npx tsx
 * scripts/_dreistufen.mts`, Charge S3 Phase 3). Sie liegen in jeder Zelle
 * gleich hoch oder höher als der Stand davor (Commit `23a0835`) — kein Kind hat
 * durch den Umbau eine einzige Zeile verloren:
 *
 *   de/kids   1442 → 1442 · de/teens  1685 → 1690 · de/erw 896 → 896
 *   en/kids   1173 → 1174 · en/teens  1411 → 1419 · en/erw 863 → 867
 *
 * Wer beim Aussortieren eine Zelle ärmer macht, bricht den Build — dann gilt
 * Johannes' Weiche 4: ERST Ersatz schreiben, DANN aussortieren.
 *
 * ── Charge I3 (21.08.2026): das Ziffern- und Sonderzeichen-Portfolio ───────
 * 300 neue T5-Zeilen (151 deutsch, 149 englisch), Etikett `teens` +
 * `erwachsen`. Weil Ziffern die LETZTE Tastenstufe sind, wächst ausschließlich
 * die Spalte T5 — auf T0 bis T4 ist eine Ziffern-Zeile nicht servierbar, und
 * `kids` trägt keine einzige dieser Zeilen (Bauplan-Vorgabe). Gemessen:
 *
 *   de/kids   1442 → 1442 · de/teens  1690 → 1841 · de/erw  896 → 1047
 *   en/kids   1174 → 1174 · en/teens  1419 → 1568 · en/erw  867 → 1016
 *
 * Der Zuwachs ist in jeder betroffenen Zelle exakt die Zahl der neuen Zeilen
 * (+151 deutsch, +149 englisch). Das ist die Gegenprobe darauf, dass wirklich
 * JEDE Zeile ankommt: Eine Dublette gegen den Bestand oder eine Zeile, deren
 * Zeichensatz sie unservierbar macht, hätte die Differenz kleiner gemacht.
 * `REGAL_BODEN` bleibt unberührt — I3 schreibt Korpus-Zeilen, keine Serien.
 */
type BodenTafel = Record<"de" | "en", Record<KontoStufe, number[]>>;

const VERSORGUNGS_BODEN: BodenTafel = {
  de: {
    kids: [0, 90, 699, 1392, 1392, 1442],
    teens: [0, 98, 694, 1598, 1598, 1841],
    erwachsen: [0, 53, 242, 818, 818, 1047],
  },
  en: {
    kids: [0, 89, 554, 1131, 1131, 1174],
    teens: [0, 93, 619, 1352, 1352, 1568],
    erwachsen: [0, 44, 335, 831, 831, 1016],
  },
};

/**
 * Die Bücherei darf ebenfalls nicht ärmer werden: offene Serien je Konto-Stufe
 * und Öffnungspunkt (Einheiten aus INTRO_ORDER) — gemessen mit demselben
 * Skript. Die Redaktion hat hier keine einzige Zelle bewegt: Was an die eine
 * Stufe abgegeben wurde, ist der anderen vorher aufgemacht worden.
 *
 * Charge I1 (16.08.2026) hat den teens-Boden ANGEHOBEN: sechs eigene frühe
 * Serien kamen dazu (13/13/16/18/20/20), sechs geerbte Kinderserien gingen
 * dafür an `kids` zurück. Gemessener Stand danach — de/teens
 * [4, 7, 13, 20, 25, 45, 45] statt [3, 6, 10, 19, 24, 45, 45]; kids und
 * erwachsen unverändert. Neue Zahl = neuer Boden (Ratsche zieht nur an).
 *
 * Charge I1b (16.08.2026) hat den Rest geräumt: acht weitere eigene Serien
 * (17/17/20/20/20/22/22/22) kamen dazu, die letzten acht geerbten Kinderserien
 * gingen an `kids` (sieben davon öffnen bei n=22, eine bei n=31). Gemessen:
 * de/teens [4, 9, 18, 21, 26, 45, 45]. Zwei Punkte KONNTEN nicht wachsen und
 * das ist Arithmetik, kein Versäumnis: n≤13 nicht, weil die Charge bewusst die
 * mittleren Sprossen bedient hat, und n≤31/99 nicht, weil acht Serien herein-
 * und acht hinausgingen. kids und erwachsen wieder unverändert.
 *
 * Charge I1c (16.08.2026) hat dasselbe für die OBERSTE Stufe getan: sechs
 * eigene Erwachsenen-Serien (13/17/20/22/26/31, darunter zwei Wissens-Serien
 * und ein Sechs-Etappen-Bogen), NICHTS weggenommen. Gemessen: de/erwachsen
 * [2, 4, 6, 7, 10, 17, 17] statt [1, 2, 3, 3, 5, 11, 11] - jeder einzelne
 * Öffnungspunkt gewachsen; kids und teens unverändert.
 *
 * Charge I2 (21.08.2026) tut dasselbe für die ENGLISCHE Bücherei, in Wellen.
 * Ausgangslage waren sieben englische Serien, die alle spät aufgingen (eine
 * bei n=22, zwei bei n=29, vier bei n=30): en/kids [0, 0, 0, 1, 1, 6, 6],
 * en/teens [0, 0, 0, 1, 1, 7, 7], en/erwachsen [0, 0, 0, 0, 0, 4, 4]. Die
 * Spalte n=13 bleibt in allen drei englischen Stufen 0, und das ist eine
 * Entscheidung: bei dreizehn Einheiten fehlt das h und damit das englische
 * »the« - eine Serie ohne bestimmten Artikel, ohne to, of und not wäre kein
 * Englisch mehr (Begründung im Kopf von `src/lib/typing/serienEnFrueh.ts`).
 *
 * Welle 1 (fünf kids-Serien, Öffnungspunkte 15/16/17/19/20): en/kids gemessen
 * [0, 3, 5, 6, 6, 11, 11] statt [0, 0, 0, 1, 1, 6, 6]. teens und erwachsen
 * unverändert - die kommen in den Wellen danach.
 *
 * Welle 2 (kids 22 und 25, dazu die ersten drei teens-Serien 15/17/18):
 * en/kids [0, 3, 5, 7, 8, 13, 13] und en/teens [0, 2, 3, 4, 4, 10, 10].
 * Damit ist die kids-Treppe fertig; erwachsen steht noch aus.
 *
 * Welle 3 (teens 20/22/24/29 und die erste Erwachsenen-Serie bei 17):
 * en/teens [0, 2, 4, 6, 7, 14, 14] - die teens-Treppe ist damit fertig -,
 * en/erwachsen [0, 1, 1, 1, 1, 5, 5].
 *
 * Welle 4 (fünf weitere Erwachsenen-Serien, 19/20/22/25/29): en/erwachsen
 * [0, 1, 3, 4, 5, 10, 10]. Damit ist I2 vollständig - zwanzig eigene
 * englische Serien, und JEDER englische Regal-Punkt der drei Stufen ist
 * gewachsen, mit der einen begründeten Ausnahme n=13.
 *
 * Charge I2b (21.08.2026) räumt die letzte englische Doppel-Freigabe weg -
 * und zeigt dabei, warum diese Tafel eine Ratsche und keine Messung ist.
 * Nach I2 stand en/kids an den Punkten n=31 und n=99 bei genau 13 Serien,
 * und genau 13 war auch der Boden: KEIN Spielraum. Nimmt man den drei
 * geteilten Wissens-Serien `kids` weg (sie öffnen bei 29/30/30, zählen also
 * an beiden Punkten), fällt die Zelle auf 10 - der Build bricht, richtigerweise.
 * Also erst Ersatz schreiben (Johannes' Weiche 4): drei eigene kids-Serien an
 * Sprossen, die das kids-Regal noch nicht hatte - »The Red Hen at the School
 * Gate« (n=21) · »How Birds Build a Nest« (n=24) · »The Moon and the Month«
 * (n=29), siehe `src/lib/typing/serienEnKidsErsatz.ts`. DANACH konnten die
 * drei geteilten Serien an teens+erwachsen abgegeben werden.
 *
 * Gemessen nach dem Tausch: en/kids [0, 3, 5, 8, 10, 13, 13] statt
 * [0, 3, 5, 7, 8, 13, 13] - die beiden mittleren Punkte sind gewachsen (n≤22
 * von 7 auf 8, n≤26 von 8 auf 10), die beiden oberen gehalten. Drei raus,
 * drei rein, und dazu zwei Sprossen früher. teens und erwachsen unverändert:
 * die drei Serien bleiben dort stehen, es geht nichts verloren.
 *
 * ── Charge O1 (21.08.2026): das `o` rückt in `LETTER_ORDER` direkt hinter
 * das `h`. Der Grund steht in `letters.ts`: das `o` trägt im Deutschen 2,5,
 * im Englischen 7,5 Prozent, und an ihm hängen to, of, on, not, no, one, for.
 * Gemessene Schreibbarkeit EN: 16 Tasten 31 → 42 %, 17 Tasten 32 → 47 %,
 * 18 Tasten 33 → 49 %; DE 18 Tasten 53 → 62 %, 17 Tasten 52 → 51 %.
 *
 * Der PREIS ist genau EINE Stelle: das `c` rutscht von Einheit 17 auf 18.
 * Sechzehn Serien öffnen dadurch eine Sprosse später; dreizehn davon bleiben
 * in derselben Spanne zwischen zwei Regal-Punkten und kosten nichts. Acht
 * Serien aber gingen bei 17 auf und gehen jetzt bei 18 auf - sie fallen unter
 * dem Punkt 17 heraus: Die Nachtschicht · Die Uhr steht still · Die Kette ·
 * Der Strudel · Der Tunnel · The Cat in the Attic · The Cliff Trail · The
 * Fall in the Drain. Zusammen ZEHN Regal-Plätze (de/kids 1 · de/teens 4 ·
 * de/erwachsen 2 · en/kids 1 · en/teens 1 · en/erwachsen 1), und zwar
 * AUSSCHLIESSLICH am Punkt 17: an allen anderen sechs Punkten und in allen
 * sechs Versorgungs-Zellen bewegt sich nichts.
 *
 * Diesen acht Serien das `c` auszutreiben hätte im Deutschen bedeutet: kein
 * nicht, kein ich, kein sich, kein auch, kein Nacht/Licht, kein sch- und kein
 * ch-Wort - 265 Zeilen, und die Texte wären ruiniert. Also Weiche 4: ZWÖLF
 * neue Serien, auf den NEUEN Satz der Sprosse 17 getextet (a d e f h i j k l
 * n o r s t u ö - mit o und u, ohne c g m b w), geschrieben BEVOR die
 * Reihenfolge sich bewegt. Siehe `src/lib/typing/serienOFolge.ts` und
 * `serienOFolgeEn.ts`.
 *
 * Gemessen nach dem ganzen Zug (Welle 1 + 2 + Umbau), gegen den Stand vom
 * 21.08. vor der Charge - JEDE Zelle an JEDEM Punkt gleich hoch oder höher:
 *
 *   de/kids       [2, 4, 7, 16, 19, 33, 33] → [2, 5, 9, 18, 21, 35, 35]
 *   de/teens      [4, 9, 18, 21, 26, 45, 45] → [4, 10, 23, 26, 31, 50, 50]
 *   de/erwachsen  [2, 4, 6, 7, 10, 17, 17] → [2, 4, 8, 9, 12, 19, 19]
 *   en/kids       [0, 3, 5, 8, 10, 13, 13] → [0, 3, 6, 9, 11, 14, 14]
 *   en/teens      [0, 2, 4, 6, 7, 14, 14] → [0, 2, 5, 7, 8, 15, 15]
 *   en/erwachsen  [0, 1, 3, 4, 5, 10, 10] → [0, 1, 4, 5, 6, 11, 11]
 *
 * Der Punkt 17 hält in beiden erwachsenen Zellen genau (de 4 → 4, en 1 → 1)
 * und wächst in den vier anderen. Der VERSORGUNGS_BODEN darüber ist dabei in
 * keiner einzigen Zelle gewandert, und das ist kein Zufall: die T2-MENGE
 * bleibt gleich (alt `h u c g m o b w`, neu `h o u c g m b w`), also ändert
 * sich kein einziges `minTier`.
 *
 * ── Charge E16 (21.08.2026): die Sprosse 16 ist durch den Umbau von O1
 * überhaupt erst entstanden (das `o` steht seither hinter dem `h`) und war
 * leer. Sie ist strikt leichter als die Sprosse 15, auf der I2 schon
 * geschrieben hat. SECHS englische Serien, je zwei je Stufe, öffnen gemessen
 * alle bei n=16 (`npx tsx scripts/_seroeffnung.mts`) — sie wachsen den
 * englischen Zellen also an allen Punkten ab 17 zu, am Punkt 13 bewegt sich
 * nichts. Gemessen nach Welle 1 (drei Serien) und nach Welle 2 (sechs):
 *
 *   en/kids       [0, 3, 6, 9, 11, 14, 14] → [0, 4, 7, 10, 12, 15, 15] → [0, 5, 8, 11, 13, 16, 16]
 *   en/teens      [0, 2, 5, 7, 8, 15, 15] → [0, 3, 6, 8, 9, 16, 16] → [0, 4, 7, 9, 10, 17, 17]
 *   en/erwachsen  [0, 1, 4, 5, 6, 11, 11] → [0, 2, 5, 6, 7, 12, 12] → [0, 3, 6, 7, 8, 13, 13]
 *
 * Die deutschen Zellen und der VERSORGUNGS_BODEN bleiben unberührt: die
 * T2-Menge hat sich nicht bewegt, also wandert kein `minTier`.
 */
/*
 * ★ D-1 (28.09.2026): Punkt und Komma stehen jetzt direkt nach ⇧ (Einheit 14
 * des Weges „de"). Jeder Öffnungspunkt NACH ⇧ liegt darum zwei Einheiten
 * später - dieselben Buchstaben, dieselbe Menge, dieselben Böden
 * (vor D-1: 13, 17, 20, 22, 26, 31, 99).
 */
const REGAL_PUNKTE = [13, 19, 22, 24, 28, 33, 99] as const;
const REGAL_BODEN: BodenTafel = {
  de: {
    kids: [2, 5, 9, 18, 21, 35, 35],
    teens: [4, 10, 23, 26, 31, 50, 50],
    erwachsen: [2, 4, 8, 9, 12, 19, 19],
  },
  en: {
    kids: [0, 5, 8, 11, 13, 16, 16],
    teens: [0, 4, 7, 9, 10, 17, 17],
    erwachsen: [0, 3, 6, 7, 8, 13, 13],
  },
};

/**
 * Serien, die GEZIELT für die mittlere Stufe geschrieben sind (`stufen ===
 * ["teens"]`, DE) — nur ANHEBEN. Stand nach S3 waren es 4 (Die Martinswand ·
 * Was ein Quadratmeter Boden leistet · Die zweite Quelle · Die letzten zehn
 * Prozent); Charge I1 hat sechs frühe dazugeschrieben (Die Frist · Die Antenne ·
 * Die neunte Stufe · Die Halle in der Nacht · Der Schlaf · Der Mond) — 10.
 * Charge I1b legt acht weitere dazu (Die Kette · Der Strudel · Das Mikrofon ·
 * Der Fund im Moor · Das Foto · Der Schall · Der Wind · Der Stein) — 18.
 * Charge O1 legt fünf dazu, alle auf der neuen Sprosse 17 (Das Ruder · Der
 * Anrufer · Das Los · Die Halde · Die Insel in der Furt) — 23.
 */
const GEZIELT_TEENS_MIN = 23;

/**
 * Grundschul-Sachkunde- und Kindergarten-Titel, die die MITTLERE Stufe noch
 * sieht — nur ABSENKEN. **Ziel erreicht: 0** (Charge I1, 16.08.2026).
 *
 * Stand nach S3 waren es 3 (»Der kleine Schneemann«, »Lisas Laterne«, »Die
 * Spinne«); sie ließen sich damals nicht wegnehmen, weil das teens-Regal
 * dadurch unter den Boden gefallen wäre. I1 hat erst Ersatz geschrieben
 * (`serienTeensFrueh.ts`, sechs eigene Serien ab 13 Tasten) und die drei danach
 * an `kids` abgegeben — zusammen mit den drei Kinder-Fassungen der frühen
 * Treppe (Das Nest in der Tanne · Der Hund an der Tankstelle · Der Igel in der
 * Nacht), für die es jetzt sprossengenau eine teens-Fassung gibt.
 *
 * Ab hier ist die Zahl ein WÄCHTER, kein Ziel mehr: Wer einen Grundschul-Titel
 * wieder für teens freigibt, bricht den Build.
 */
const JUNGE_THEMEN_BEI_TEENS_MAX = 0;
const JUNGE_THEMEN =
  /\b(regenwurm|marienkäfer|ameise|schmetterling|biene|spinne|schneemann|laterne|teddy)\b/i;

/**
 * Der Befund vom 30.07., übersetzt auf die neuen Stufen: FRÜHE Serien (vor dem
 * vollen Alphabet) für die mittlere Stufe, die NICHT auch `kids` gehören.
 * Damals waren es 0 von 13 — die Bücherei der Zehn- bis Zwölfjährigen war
 * wörtlich die der Siebenjährigen.
 *
 * Stand nach S3: 6 (Die Terrasse n=13 · Die Nachtschicht n=17 · Der Garten
 * hinter dem Haus n=20 · Die letzte Kiste n=23 · Das alte Hotel n=23 · Der
 * Marmorsaal n=30). Charge I1 legt sechs dazu (Die Frist n=13 · Die Antenne
 * n=13 · Die neunte Stufe n=16 · Die Halle in der Nacht n=18 · Der Schlaf n=20 ·
 * Der Mond n=20) — 12. Charge I1b legt acht dazu (Die Kette n=17 · Der Strudel
 * n=17 · Das Mikrofon n=20 · Der Fund im Moor n=20 · Das Foto n=20 · Der Schall
 * n=22 · Der Wind n=22 · Der Stein n=22) — 20. Charge O1 legt fünf dazu, alle
 * auf der neuen Sprosse 17 (Das Ruder · Der Anrufer · Das Los · Die Halde ·
 * Die Insel in der Furt) — 25. Nur ANHEBEN.
 */
const FRUEHE_EIGENE_TEENS_MIN = 25;
/** Ab hier gilt eine Serie als „volles Alphabet" (INTRO_ORDER-Position). */
const VOLLES_ALPHABET_AB = 31;

/**
 * Dieselbe Frage für die OBERSTE Stufe, neu ab Charge I1c (16.08.2026). Bis
 * dahin gab es KEINE Ratsche dafür - und entsprechend sah es aus: Von den elf
 * deutschen Erwachsenen-Serien war keine einzige nur für Erwachsene
 * geschrieben, alle elf teilten sich `teens`. Vor dem vollen Alphabet standen
 * genau drei im Regal, und auch die drei gehörten der mittleren Stufe mit.
 *
 * I1c legt sechs eigene dazu (Der Laden n=13 · Der Tunnel n=17 · Der Sturm
 * n=20 · Der Kalk n=22 · Das Papier n=26 · Die Wand n=31); fünf davon öffnen
 * vor dem vollen Alphabet. Beide Zahlen nur ANHEBEN - und anders als bei teens
 * ist hier nichts weggenommen worden, die geteilten elf bleiben.
 *
 * Charge O1 legt zwei dazu, beide auf der neuen Sprosse 17 (Die Kantine ·
 * Der Kahn) - 8 gezielte, 7 frühe eigene. Sie sind zugleich der Ersatz für
 * »Der Tunnel« und »Die Nachtschicht«, die durch den Umbau von 17 auf 18
 * rutschen.
 *
 * Charge E2-DE (22.08.2026) legt zehn eigene Geschichten dazu (Der Kai n=13 ·
 * Die Ernte n=13 · Der Notruf n=17 · Die Truhe n=17 · Die Turmuhr n=20 · Die
 * Haltestelle n=20 · Die Schleuse n=22 · Die Backstube n=22 · Der Dienstplan
 * n=26 · Der Chor n=26) sowie eine Wissens-Serie, die `teens` mittraegt (Die
 * Wolle n=26). Damit sind es 18 gezielte und 17 fruehe eigene; die Ratsche
 * geht auf diese Werte, damit ein spaeterer Umbau sie nicht unbemerkt wieder
 * abraeumt.
 */
const GEZIELT_ERWACHSEN_MIN = 18;
const FRUEHE_EIGENE_ERWACHSEN_MIN = 17;

/**
 * Dieselbe Frage für die ENGLISCHE Bücherei, neu ab Charge I2 (21.08.2026).
 * Vorher gab es dafür keine Ratsche, und entsprechend sah die englische Seite
 * aus: sieben Serien, davon KEINE einzige für genau eine Stufe geschrieben -
 * drei trugen sogar alle drei Stufen zugleich. Vor dem vollen Alphabet stand
 * genau eine Serie im Regal (»Nell and the Harbour Cat«, n=22), und die war
 * mit kids und teens geteilt.
 *
 * I2 legt zwanzig eigene dazu, je für GENAU EINE Stufe geschrieben:
 * kids 15/16/17/19/20/22/25 · teens 15/17/18/20/22/24/29 ·
 * erwachsen 17/19/20/22/25/29. Alle zwanzig öffnen vor dem vollen Alphabet.
 * Beide Zahlen nur ANHEBEN.
 *
 * Charge I2b (21.08.2026) legt drei eigene kids-Serien nach (21/24/29) - der
 * Ersatz, der das Abgeben der drei geteilten Wissens-Serien erst möglich
 * gemacht hat. kids also 7 → 10, frühe eigene 20 → 23.
 *
 * Charge O1 (21.08.2026) legt je eine pro Stufe nach, alle drei auf der neuen
 * Sprosse 17 (The Tin on the Shelf · The Third Floor · The Salt Shed) -
 * kids 11, teens 8, erwachsen 7, frühe eigene 26. Erst mit dem vorgezogenen
 * `o` trägt eine englische Sprosse unter 20 überhaupt to, of, on und not.
 */
const GEZIELT_EN_MIN: Record<KontoStufe, number> = {
  kids: 11,
  teens: 8,
  erwachsen: 7,
};
const FRUEHE_EIGENE_EN_MIN = 26;

/**
 * Die früheste englische Sprosse. Dass hier 15 steht und nicht 13, ist eine
 * ENTSCHEIDUNG und keine Bequemlichkeit: Bei dreizehn Einheiten fehlt das h,
 * und damit fehlt dem Englischen das Wort »the«. Das Deutsche hat an derselben
 * Stelle der/die/das/den und kommt durch (»Die Terrasse«, »Der Riss«, »Der
 * Laden« stehen bei n=13 im Regal); das Englische hat dort weder einen
 * bestimmten Artikel noch to, of, on oder not. Der Kopf von
 * `src/lib/typing/serienEnFrueh.ts` führt die Grenze Sprosse für Sprosse aus.
 *
 * Diese Regel hält fest, dass die englische Treppe bei 15 WIRKLICH beginnt -
 * wer sie nach hinten schiebt, bricht den Build.
 */
const EN_TREPPE_SPAETESTENS_AB = 15;

/** Maskottchen-/Tiernamen, die Jugend + Erwachsene nie sehen dürfen. */
const MASKOTTCHEN =
  /pinguin|lama|küken|ameise|maus|murmeltier|tiger|t-rex|dachs|löwe|koala|gämse|fuchs|spatz|bär|hase|luchs|krake/i;

function allowedUpTo(tier: number): Set<string> {
  const s = new Set<string>();
  for (let t = 0; t <= tier; t++) for (const c of TIER_CHARS[t] ?? []) s.add(c);
  return s;
}

const AKTIV = {
  de: CORPUS.filter((e) => !isDeactivated(e.kind, e.text)),
  en: CORPUS_EN.filter((e) => !isDeactivated(e.kind, e.text)),
};

/** Bekommt diese KONTO-Stufe den Eintrag/die Serie serviert? */
function serviert(stufen: readonly Stufe[], stufe: Stufe): boolean {
  const etiketten = contentStufenFor(stufe);
  return etiketten.some((e) => stufen.includes(e));
}

/**
 * ZEILENWEISE servierte Menge — nicht die Zahl der Einträge: `fitText` zieht
 * unterschiedliche Einträge bei kleinem Tastenstand zur selben Zeile zusammen,
 * und genau die entdoppelte Zeile ist es, die ein Kind zu sehen bekommt.
 */
function servierbar(lang: "de" | "en", stufe: Stufe, tier: number): number {
  const allowed = allowedUpTo(tier);
  const seen = new Set<string>();
  for (const it of AKTIV[lang]) {
    if (!serviert(it.stufen, stufe)) continue;
    const f = fitText(it.text, allowed);
    if (f === null || seen.has(f)) continue;
    seen.add(f);
  }
  return seen.size;
}

/** Serien dieser Stufe, die bei `n` gelernten Einheiten schon offen sind. */
function serienOffen(lang: "de" | "en", stufe: Stufe, n: number): Serie[] {
  return SERIEN.filter(
    (s) => (s.lang ?? "de") === lang && serviert(s.stufen, stufe) && oeffnetBei(s) <= n,
  );
}

// Grundmengen IMMER ausgeben (Regel 12): ein leerer Treffer darf nie wie ein
// Erfolg aussehen.
console.log(
  `[altersgrenze] Grundlage: DE ${CORPUS.length} Einträge (${AKTIV.de.length} aktiv), ` +
    `EN ${CORPUS_EN.length} (${AKTIV.en.length} aktiv), ${SERIEN.length} Serien, ${BADGES.length} Abzeichen.`,
);

describe("Ratsche 1 — Doppel-Freigaben der beiden ÄUSSEREN Stufen sinken nur", () => {
  it(`de: kids∩erwachsen ≤ ${KIDS_MIT_ERWACHSEN_MAX_DE}`, () => {
    const treffer = AKTIV.de.filter(
      (e) => e.stufen.includes("kids") && e.stufen.includes("erwachsen"),
    );
    console.log(`[altersgrenze] de kids∩erwachsen: ${treffer.length}`);
    expect(
      treffer.length,
      `de: kids∩erwachsen gewachsen (${treffer.length})`,
    ).toBeLessThanOrEqual(KIDS_MIT_ERWACHSEN_MAX_DE);
  });

  it(`en: kids∩erwachsen ≤ ${KIDS_MIT_ERWACHSEN_MAX_EN}`, () => {
    const treffer = AKTIV.en.filter(
      (e) => e.stufen.includes("kids") && e.stufen.includes("erwachsen"),
    );
    console.log(`[altersgrenze] en kids∩erwachsen: ${treffer.length}`);
    expect(
      treffer.length,
      `en: kids∩erwachsen gewachsen (${treffer.length})`,
    ).toBeLessThanOrEqual(KIDS_MIT_ERWACHSEN_MAX_EN);
  });

  it("Bücherei DE: KEINE Serie ist gleichzeitig für kids und erwachsen freigegeben", () => {
    // Die Nachfolgerin der alten a∩c-Regel: Die beiden ÄUSSEREN Stufen teilen
    // sich keine Geschichte. Die mittlere darf mit beiden teilen - genau dafür
    // ist sie da.
    const verstoss = SERIEN.filter(
      (s) =>
        (s.lang ?? "de") === "de" &&
        s.stufen.includes("kids") &&
        s.stufen.includes("erwachsen"),
    );
    expect(
      verstoss.map((s) => s.titel),
      "DE-Serie gleichzeitig kids und erwachsen",
    ).toEqual([]);
  });

  it(`Bücherei EN: höchstens ${EN_KIDS_UND_ERWACHSEN_MAX} Serien gleichzeitig kids und erwachsen`, () => {
    // Hier stand bis zum 21.08.2026 eine Ausnahme (3 statt 0), und ihre
    // Begründung ist erledigt: Die englische Bücherei hatte ganze SIEBEN
    // Serien; drei davon (Water and Weather · A Trip Through Space · How
    // Animals Sleep) waren mit b+c+erwachsen für alle ab zehn gedacht und
    // trugen darum alle drei Stufen. Nahm man ihnen `kids`, fiel das
    // kids-Regal unter den Boden - der Weg heraus konnte nur über EIGENE
    // englische Serien je Stufe führen, nie über ein Umetikettieren.
    //
    // Charge I2 (20 eigene Serien) hat die Bücherei dafür groß genug gemacht,
    // Charge I2b hat den Ersatz für genau diese drei geschrieben (drei eigene
    // kids-Serien bei n=21/24/29) und die drei danach an teens+erwachsen
    // abgegeben. Sie bleiben dort vollständig stehen; verloren geht nichts.
    const verstoss = SERIEN.filter(
      (s) =>
        (s.lang ?? "de") === "en" &&
        s.stufen.includes("kids") &&
        s.stufen.includes("erwachsen"),
    );
    console.log(
      `[altersgrenze] EN-Serien kids UND erwachsen: ${verstoss.length} ` +
        `(${verstoss.map((s) => s.titel).join(" · ")})`,
    );
    expect(verstoss.length).toBeLessThanOrEqual(EN_KIDS_UND_ERWACHSEN_MAX);
  });
});

describe("Gegenprobe — Versorgungs-Böden: keine Stufe hat weniger als vor der S3-Redaktion", () => {
  for (const lang of ["de", "en"] as const) {
    for (const stufe of KONTO_STUFEN) {
      it(`${lang}/${stufe}: servierbare Zeilen je Tier ≥ Boden`, () => {
        const gemessen = [0, 1, 2, 3, 4, 5].map((t) => servierbar(lang, stufe, t));
        console.log(`[altersgrenze] ${lang}/${stufe} Zeilen: [${gemessen.join(", ")}]`);
        for (let tier = 0; tier <= 5; tier++) {
          const n = gemessen[tier];
          const boden = VERSORGUNGS_BODEN[lang][stufe][tier];
          expect(
            n,
            `${lang}/${stufe} T${tier}: ${n} < Boden ${boden} — Inhalt verloren ohne Ersatz`,
          ).toBeGreaterThanOrEqual(boden);
        }
      });

      it(`${lang}/${stufe}: offene Serien je Öffnungspunkt ≥ Boden (Bücherei)`, () => {
        const gemessen = REGAL_PUNKTE.map((n) => serienOffen(lang, stufe, n).length);
        console.log(`[altersgrenze] ${lang}/${stufe} Regal: [${gemessen.join(", ")}]`);
        REGAL_PUNKTE.forEach((punkt, i) => {
          const boden = REGAL_BODEN[lang][stufe][i];
          expect(
            gemessen[i],
            `${lang}/${stufe} bei n≤${punkt}: ${gemessen[i]} < Boden ${boden} — Regal leerer geworden`,
          ).toBeGreaterThanOrEqual(boden);
        });
      });
    }
  }
});

describe("Bücherei-Richtung für die mittlere Stufe (11-15)", () => {
  const DE_SERIEN = SERIEN.filter((s) => (s.lang ?? "de") === "de");

  it(`gezielt für teens geschriebene DE-Serien: mindestens ${GEZIELT_TEENS_MIN}`, () => {
    const gezielt = DE_SERIEN.filter(
      (s) => s.stufen.length === 1 && s.stufen[0] === "teens",
    );
    console.log(
      `[altersgrenze] ${DE_SERIEN.length} DE-Serien, davon gezielt für teens: ` +
        `${gezielt.length} (${gezielt.map((s) => s.titel).join(" · ")})`,
    );
    expect(gezielt.length).toBeGreaterThanOrEqual(GEZIELT_TEENS_MIN);
  });

  it(`Grundschul-Titel, die teens noch sieht: höchstens ${JUNGE_THEMEN_BEI_TEENS_MAX} (Ziel 0)`, () => {
    const jung = DE_SERIEN.filter(
      (s) => s.stufen.includes("teens") && JUNGE_THEMEN.test(s.titel),
    );
    console.log(
      `[altersgrenze] junge Themen bei teens: ${jung.length} ` +
        `(${jung.map((s) => s.titel).join(" · ")})`,
    );
    expect(jung.length).toBeLessThanOrEqual(JUNGE_THEMEN_BEI_TEENS_MAX);
  });

  it(`frühe Serien für teens, die NICHT auch kids gehören: mindestens ${FRUEHE_EIGENE_TEENS_MIN}`, () => {
    const fuerTeens = DE_SERIEN.filter((s) => s.stufen.includes("teens"));
    const frueh = fuerTeens.filter((s) => oeffnetBei(s) < VOLLES_ALPHABET_AB);
    const eigen = frueh.filter((s) => !s.stufen.includes("kids"));
    // Grundmenge IMMER ausgeben (Regel 12) — sonst sieht ein leerer Treffer
    // aus wie ein Erfolg.
    console.log(
      `[altersgrenze] teens: ${fuerTeens.length} Serien, davon ${frueh.length} vor dem vollen ` +
        `Alphabet, davon ${eigen.length} nicht mit kids geteilt ` +
        `(${eigen.map((s) => `${s.titel} n=${oeffnetBei(s)}`).join(" · ")})`,
    );
    expect(eigen.length).toBeGreaterThanOrEqual(FRUEHE_EIGENE_TEENS_MIN);
  });

  it("bei 13 Tasten hat teens etwas, das nicht für kids geschrieben ist", () => {
    // Das war der Kern des Befunds vom 30.07.: Die früheste Sprosse (n=13) war
    // für die Älteren dieselbe wie für Siebenjährige. Diese Regel hält sie offen.
    const frueheste = DE_SERIEN.filter(
      (s) => s.stufen.includes("teens") && !s.stufen.includes("kids") && oeffnetBei(s) <= 13,
    );
    console.log(
      `[altersgrenze] eigene teens-Serien ab 13 Tasten: ${frueheste.length} ` +
        `(${frueheste.map((s) => s.titel).join(" · ")})`,
    );
    expect(frueheste.length).toBeGreaterThanOrEqual(1);
  });
});

describe("Bücherei-Richtung für die oberste Stufe (ab 16)", () => {
  const DE_SERIEN = SERIEN.filter((s) => (s.lang ?? "de") === "de");

  it(`gezielt für erwachsen geschriebene DE-Serien: mindestens ${GEZIELT_ERWACHSEN_MIN}`, () => {
    const gezielt = DE_SERIEN.filter(
      (s) => s.stufen.length === 1 && s.stufen[0] === "erwachsen",
    );
    console.log(
      `[altersgrenze] ${DE_SERIEN.length} DE-Serien, davon gezielt für erwachsen: ` +
        `${gezielt.length} (${gezielt.map((s) => s.titel).join(" · ")})`,
    );
    expect(gezielt.length).toBeGreaterThanOrEqual(GEZIELT_ERWACHSEN_MIN);
  });

  it(`frühe Serien für erwachsen, die NICHT auch teens gehören: mindestens ${FRUEHE_EIGENE_ERWACHSEN_MIN}`, () => {
    const fuerErw = DE_SERIEN.filter((s) => s.stufen.includes("erwachsen"));
    const frueh = fuerErw.filter((s) => oeffnetBei(s) < VOLLES_ALPHABET_AB);
    const eigen = frueh.filter((s) => !s.stufen.includes("teens"));
    // Grundmenge IMMER ausgeben (Regel 12).
    console.log(
      `[altersgrenze] erwachsen: ${fuerErw.length} Serien, davon ${frueh.length} vor dem vollen ` +
        `Alphabet, davon ${eigen.length} nicht mit teens geteilt ` +
        `(${eigen.map((s) => `${s.titel} n=${oeffnetBei(s)}`).join(" · ")})`,
    );
    expect(eigen.length).toBeGreaterThanOrEqual(FRUEHE_EIGENE_ERWACHSEN_MIN);
  });

  it("bei 13 Tasten hat erwachsen etwas, das nicht auch für teens geschrieben ist", () => {
    // Das Gegenstück zur teens-Regel darüber: Wer als Erwachsener mit dreizehn
    // Tasten einsteigt, soll nicht ausschließlich Jugend-Stoff vorfinden.
    const frueheste = DE_SERIEN.filter(
      (s) =>
        s.stufen.includes("erwachsen") && !s.stufen.includes("teens") && oeffnetBei(s) <= 13,
    );
    console.log(
      `[altersgrenze] eigene erwachsen-Serien ab 13 Tasten: ${frueheste.length} ` +
        `(${frueheste.map((s) => s.titel).join(" · ")})`,
    );
    expect(frueheste.length).toBeGreaterThanOrEqual(1);
  });
});

describe("Bücherei-Richtung für die ENGLISCHE Seite (Charge I2)", () => {
  const EN_SERIEN = SERIEN.filter((s) => s.lang === "en");

  it("die englische Treppe beginnt bei 15 Einheiten - je Stufe mindestens eine Serie", () => {
    // Warum 15 und nicht 13: siehe EN_TREPPE_SPAETESTENS_AB oben. Diese Regel
    // prüft, dass jede der drei Stufen auf der frühesten erreichbaren Sprosse
    // wirklich etwas Eigenes hat - kids und teens ab 15, erwachsen ab 17.
    for (const stufe of KONTO_STUFEN) {
      const frueheste = EN_SERIEN.filter(
        (x) => x.stufen.length === 1 && x.stufen[0] === stufe,
      ).map(oeffnetBei);
      const min = Math.min(...frueheste);
      console.log(
        `[altersgrenze] en/${stufe}: ${frueheste.length} eigene Serien, ` +
          `früheste bei n=${min} (alle: ${frueheste.sort((a, b) => a - b).join(", ")})`,
      );
      expect(frueheste.length, `en/${stufe} ohne eigene Serie`).toBeGreaterThan(0);
      expect(
        min,
        `en/${stufe}: früheste eigene Serie erst bei n=${min} - die Treppe ist nach hinten gerutscht`,
      ).toBeLessThanOrEqual(EN_TREPPE_SPAETESTENS_AB + 2);
    }
  });

  for (const stufe of KONTO_STUFEN) {
    it(`gezielt für en/${stufe} geschriebene Serien: mindestens ${GEZIELT_EN_MIN[stufe]}`, () => {
      const gezielt = EN_SERIEN.filter(
        (x) => x.stufen.length === 1 && x.stufen[0] === stufe,
      );
      // Grundmenge IMMER ausgeben (Regel 12).
      console.log(
        `[altersgrenze] ${EN_SERIEN.length} EN-Serien, davon gezielt für ${stufe}: ` +
          `${gezielt.length} (${gezielt.map((x) => x.titel).join(" · ")})`,
      );
      expect(gezielt.length).toBeGreaterThanOrEqual(GEZIELT_EN_MIN[stufe]);
    });
  }

  it(`frühe eigene EN-Serien vor dem vollen Alphabet: mindestens ${FRUEHE_EIGENE_EN_MIN}`, () => {
    const frueh = EN_SERIEN.filter((x) => oeffnetBei(x) < VOLLES_ALPHABET_AB);
    const eigen = frueh.filter((x) => x.stufen.length === 1);
    console.log(
      `[altersgrenze] EN: ${EN_SERIEN.length} Serien, davon ${frueh.length} vor dem vollen ` +
        `Alphabet, davon ${eigen.length} für genau eine Stufe geschrieben`,
    );
    expect(eigen.length).toBeGreaterThanOrEqual(FRUEHE_EIGENE_EN_MIN);
  });
});

describe("Oberfläche — die Tonlage kann nicht zurückrutschen", () => {
  it("ab 11 gilt das Jugend-Profil, Erwachsene bekommen kein Spiel angeboten", () => {
    expect(skinForStufe("teens")).toBe("jugend");
    // Vorgabe ab 11 ist seit 22.08.2026 KEIN Spiel (davor der Tipp-Sprint).
    expect(gateModeFor(skinForStufe("teens"), "keins")).toBe("keins");
    expect(gateModeFor(skinForStufe("erwachsen"), "keins")).toBe("keins");
    expect(gateModeFor(skinForStufe("erwachsen"), "expedition")).toBe("keins");
  });

  it("die Elfjährigen behalten das Spiel — jetzt als WAHL statt als Profil", () => {
    // Weiche Johannes 30.07.: Mit 11 ist ein Spiel kein Kinderkram, sondern der
    // Grund weiterzumachen. Seit S2 (15.08.) trägt das nicht mehr ein eigenes
    // Profil, sondern die Einstellung im Zahnrad (Bauplan §0b.4) — beide Wege
    // bleiben erreichbar, und die Tonlage bleibt trotzdem trocken.
    expect(gateModeFor(skinForStufe("teens"), "expedition")).toBe("expedition");
    // Kinder bekommen die Expedition, egal was am Gerät eingestellt ist.
    expect(gateModeFor(skinForStufe("kids"), "keins")).toBe("expedition");
    // Der Jubel bleibt beim Kinder-Profil, ab 11 gibt es ihn nicht mehr.
    expect(usesMascots(skinForStufe("kids"))).toBe(true);
    expect(showsConfetti(skinForStufe("kids"))).toBe(true);
    expect(usesMascots(skinForStufe("teens"))).toBe(false);
    expect(showsConfetti(skinForStufe("teens"))).toBe(false);
    // Jede WÄHLBARE Stufe hat ihr eigenes Profil — keine teilt sich eines.
    // (`STUFEN` oben in dieser Datei sind die INHALTS-Etiketten a/b/c; hier
    // zählen die drei Konto-Stufen aus account.ts.)
    const profile = KONTO_STUFEN.map(skinForStufe);
    expect(new Set(profile).size).toBe(KONTO_STUFEN.length);
  });

  it("die alten Konto-Werte landen genau dort, wo die Migration sie hinschickt", () => {
    // a → kids → kind, b und c → teens → jugend (account.ts migriereStufe).
    expect(skinForStufe("a")).toBe("kind");
    expect(skinForStufe("b")).toBe("jugend");
    expect(skinForStufe("c")).toBe("jugend");
  });

  it("Jugend + Erwachsene sehen keinen Maskottchen-Namen auf Abzeichen", () => {
    for (const skin of ["jugend", "erwachsen"] as const) {
      const verstoss = BADGES.map((b) => badgeName(b, skin)).filter((n) =>
        MASKOTTCHEN.test(n),
      );
      expect(verstoss, `Maskottchen-Namen im ${skin}-Profil`).toEqual([]);
    }
  });

  it("die Jugend-Kopie jubelt nicht (kein Ausrufezeichen in Titeln und Ansagen)", () => {
    const j = UI_COPY.jugend;
    for (const n of [0, 1, 2, 3]) {
      expect(j.summaryTitle(n)).not.toContain("!");
      expect(j.summaryRemark(n)).not.toContain("!");
      expect(j.starsSpoken(n)).not.toContain("!");
    }
  });
});
