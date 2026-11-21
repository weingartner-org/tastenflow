/**
 * Tastenflow — die drei Einführungs-Podcasts („Willkommen"-Folgen).
 *
 * Wunsch Johannes 07.08.2026: „max 4 min, soll das Programm Tastenflow kurz
 * erklären, wie es aufgebaut ist, und die grundstellung, passend für jede
 * altersstufe. Also 3 einfürungspodkasts! wenn man das Prog das erste mal
 * startet." Erzeugt am 08.08.2026 in der Werkstatt
 * `Sensorik/Podcasts-Werkstatt/` (Quellen `quellen/tf-intro-*.md`, Prompts
 * `prompts/tf-intro-*.md`, Manifest-Abschnitt „tf-").
 *
 * Diese Datei ist die EINE Stelle, an der steht, welche Folge zu welcher
 * Textstufe gehört. Sie ist rein: kein React, kein Dateisystem, kein Netz.
 *
 * ── Die fünf Regeln dieser Datei ────────────────────────────────────────────
 *
 * 1. **Nie ein toter Knopf.** Jeder Eintrag hat seine Datei in
 *    `public/podcasts/`, jede tf-Datei ihren Eintrag. Der Wächter
 *    `tests/typing-intro-podcast.test.tsx` prüft beide Richtungen — die
 *    Audio-Dateien liegen NICHT in git (`.gitignore`), ein Tippfehler im
 *    Dateinamen fiele sonst erst dem Kind auf.
 *
 * 2. **Drei Folgen, drei Stufen.** Seit dem Umbau auf kids · teens · erwachsen
 *    (Charge S3, 15.08.2026) ist das eine Eins-zu-eins-Zuordnung. Vorher gab es
 *    vier Textstufen und `b`+`c` teilten sich die Jugend-Folge; der Unterschied
 *    zwischen beiden — Eisschollen-Spiel bzw. kein Spiel — ist IN der Folge mit
 *    einem Halbsatz abgedeckt und passt weiter, weil die Spiel-Wahl seit S2 im
 *    Zahnrad steht.
 *
 * 3. **Derselbe Ordner wie bei »im Griff«** (`public/podcasts/`, ausgeliefert
 *    unter `/podcasts/`). Es gibt damit genau EINEN Medien-Weg für alle
 *    Podcast-Folgen der Plattform: `podcasts-sync.mjs` füllt den Ordner,
 *    `pocketbase/deploy-podcasts.sh` lädt ihn inkrementell hoch, und
 *    `deploy-frontend.sh` schließt ihn aus. Ein eigener Tastenflow-Ordner
 *    hätte ein zweites Deploy-Profil gebraucht, das irgendwann jemand
 *    vergisst. Die id-Vorsilbe `tf-` hält die beiden Programme auseinander.
 *
 * 4. **Maximal 4:00.** Strenger als die 3–6 Minuten der Im-Griff-Folgen —
 *    Johannes' Vorgabe für den ersten Start. Der Wächter zieht die Notbremse
 *    bei 5:00; wer darüber landet, erzeugt neu, statt es durchzuwinken.
 *
 * 5. **Anhören ist ein Angebot, keine Übung.** Kein Fortschritt, kein
 *    Abzeichen, keine Übezeit — und es funktioniert ohne Anmeldung genauso
 *    wie mit (die Dateien liegen öffentlich, wie das Programm selbst).
 */
import type { Stufe } from "./account";
import { contentStufenFor } from "./account";

export interface IntroPodcast {
  /** Kurzname aus dem Manifest; zugleich der Dateiname (ohne Endung). */
  id: string;
  /** Die Datei in `public/podcasts/` (ohne Ordner). */
  datei: string;
  /** Wie die Folge heißt — steht auf dem Knopf. */
  titel: string;
  /** Spielzeit als `m:ss`, wie sie ein Abspieler anzeigt. */
  dauer: string;
  /** Dieselbe Spielzeit in Sekunden (an der Datei gemessen). */
  sekunden: number;
  /** Für welche Inhalts-Etiketten diese Folge gilt (zusammen genau alle). */
  stufen: readonly Stufe[];
  /** Ein Satz darüber, was die Folge erzählt — steht in der Willkommens-Karte. */
  beschreibung: string;
}

/** Der öffentliche Ordner, in dem die Dateien liegen (Vite kopiert `public/`). */
export const PODCAST_ORDNER = "/podcasts";

/**
 * Die drei Folgen. Reihenfolge = Alter aufsteigend.
 *
 * ★ `dauer`/`sekunden` sind an der fertigen Datei gemessen (`mdls -name
 * kMDItemDurationSeconds`, auf die Sekunde abgerundet), nicht geschätzt — der
 * Wächter rechnet Text und Zahl gegeneinander.
 */
export const INTRO_PODCASTS: readonly IntroPodcast[] = [
  {
    id: "tf-intro-kinder",
    datei: "tf-intro-kinder.m4a",
    titel: "Willkommen: deine erste Runde",
    dauer: "1:49",
    sekunden: 109,
    stufen: ["kids"],
    beschreibung:
      "Wo deine Finger zu Hause sind und was dich hier erwartet - kurz " +
      "erklärt, bevor du losschreibst.",
  },
  {
    id: "tf-intro-schueler",
    datei: "tf-intro-schueler.m4a",
    titel: "Willkommen: der Start",
    dauer: "2:12",
    sekunden: 132,
    stufen: ["teens"],
    beschreibung:
      "Warum sich 10-Finger-Schreiben lohnt, was die Grundstellung ist und " +
      "wie das Programm aufgebaut ist.",
  },
  {
    id: "tf-intro-erwachsene",
    datei: "tf-intro-erwachsene.m4a",
    titel: "Willkommen: der Einstieg",
    dauer: "1:50",
    sekunden: 110,
    stufen: ["erwachsen"],
    // ★ 19.09.2026 ohne Anrede: Die Folge hören Erwachsene, die selbst üben
    // (seither „du"), UND Lehrkräfte („Sie") - ein Satz ohne Anrede passt
    // für beide (`anredeFuer`, skin.ts). Die Aufnahme selbst ist unverändert.
    beschreibung:
      "Der Einstieg ins Zehnfingersystem: Grundstellung, Aufbau des " +
      "Programms und die ersten Schritte.",
  },
];

/**
 * Die Folge zur Textstufe. Es gibt für JEDE Stufe eine — anonyme Besucher
 * stehen auf der Vorgabestufe `teens` und bekommen damit die Schüler-Folge.
 *
 * Die drei Folgen passen 1:1 auf die drei Stufen: kinder = kids,
 * schueler = teens, erwachsene = erwachsen (Bauplan §4 S5). Seit S3 Phase 3
 * ist das eine Eins-zu-eins-Zuordnung ohne Überschneidung.
 */
export function introPodcastFuerStufe(stufe: Stufe): IntroPodcast | undefined {
  const etiketten = contentStufenFor(stufe);
  return INTRO_PODCASTS.find((p) => etiketten.some((e) => p.stufen.includes(e)));
}

/** Der ausgelieferte Pfad einer Folge. */
export function introPodcastPfad(p: IntroPodcast): string {
  return `${PODCAST_ORDNER}/${p.datei}`;
}

/**
 * Die Beschriftung des Knopfes: Titel + Spielzeit, damit vor dem Klick klar
 * ist, worauf man sich einlässt.
 */
export function introPodcastKnopfText(p: IntroPodcast): string {
  return `${p.titel} (${p.dauer})`;
}
