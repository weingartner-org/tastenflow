/**
 * R1 + R2 — Rechtschreib-Chargen vom 14./15.08.2026, DEUTSCHE Seite.
 *
 * Grundlage: `Sensorik/Pruefberichte/PRUEFBERICHT-2026-08-14-TASTENFLOW-RECHTSCHREIBUNG.md`
 * §2 (sichere Funde) und `Sensorik/BAUPLAN-2026-08-14-TASTENFLOW-DREI-STUFEN-UND-INHALT.md`
 * §2/§3. Reine Groß-/Klein- und Satzzeichen-Korrekturen wurden IN-PLACE gemacht
 * (`bausteinKey` normalisiert beides weg → die ID bleibt gleich, das No-Repeat-
 * Ledger der Kinder bleibt gültig). Hier stehen nur die beiden echten
 * WORTLAUT-Änderungen: Ihre Altfassungen sind in `corpusDeactivated.ts`
 * stillgelegt, die korrigierten Fassungen hängen hier HINTEN am Korpus.
 *
 * Beide Fassungen wurden mit `minTierFor` gegen ihre Altfassung gemessen — die
 * Korrektur darf den Tier nicht anheben (Bauplan §2 Regel 2):
 *   D5  alt T2 → neu T2   (ohne ß, das im T2-Zeichensatz gesperrt ist)
 *   D14 alt T3 → neu T3
 *
 * `stufen`, `kind` und `herkunft` sind unverändert von der Altfassung
 * übernommen. Wo die Altfassung keine `herkunft` trug (D5, D14, R2-5), steht
 * auch hier keine.
 */
import type { CorpusItem, Herkunft } from "./corpus";

/** Quelle der Instrumenten-Zeile, unverändert von der Altfassung übernommen. */
const KLEXIKON_MUSIK: Herkunft = {
  quelle: "Klexikon",
  lizenz: "CC BY-SA 4.0",
  autor: "Klexikon-Autorinnen und -Autoren",
  fundstelle: "https://klexikon.zum.de/wiki/Musikinstrument",
};

/** Herkunft der TN-E12-Korrekturzeilen (dieselbe wie in corpusKorrekturen.ts). */
const EIGEN: Herkunft = {
  quelle: "Sensorik",
  lizenz: "Eigenes Werk (selbst verfasst)",
  autor: "Sensorik-Lernplattform",
};

export const KORREKTUR2_CORPUS: CorpusItem[] = [
  // D5 — corpusMittel.ts: „weiss" war eine ß-Ersatzschreibung. Weil das ß im
  // T2-Zeichensatz gesperrt ist, wird der Satz ohne ß neu gefasst statt bloß
  // „weiß" geschrieben (das hätte die Zeile von T2 auf T3 gehoben).
  { text: "Wer selber kocht, kennt alles darin.", kind: "satz", stufen: ["kids", "teens"] },
  // D14 — corpusData.ts: „frische fischt Fischers Fritze" stand ohne das
  // Bezugswort „Fische"; der Zungenbrecher ist damit wieder vollständig.
  {
    text: "Fischers Fritze fischt frische Fische, frische Fische fischt Fischers Fritze.",
    kind: "zungenbrecher",
    stufen: ["teens"],
  },

  // --- Charge R2 (14./15.08.2026), Prüfbericht §3 „wahrscheinliche Funde" ---
  // Auch hier gilt: nur echte WORTLAUT-Änderungen stehen hier; alles, was reine
  // Groß-/Klein- oder Satzzeichen-Korrektur war (Position 3, Doppelpunkt-Sweep),
  // ist in-place erledigt. Jede Zeile mit `minTierFor` gegen ihre Altfassung
  // gemessen — kein Tier steigt:
  //   R2-1  alt T2 → neu T2
  //   R2-2  alt T2 → neu T2
  //   R2-5  alt T3 → neu T3

  // R2-1 — corpusJugend.ts: Die Aufzählung braucht Ergänzungsstriche, sonst
  // teilt man Instrumente „in Saiten" und „in Tasten" ein.
  {
    text: "Instrumente teilt man in Saiten-, Blas-, Schlag- und Tasteninstrumente ein.",
    kind: "fakt",
    stufen: ["teens"],
    herkunft: KLEXIKON_MUSIK,
  },
  // R2-2 — corpusKorrekturen.ts: Die überlieferte Bauernregel reimt auf „-rot";
  // „Gutwetterbote" bricht den Reim, „schlecht Wetter" ist unflektiert.
  {
    text: "Abendrot, Gutwetterbot. Morgenrot, Schlechtwetter droht.",
    kind: "sprichwort",
    stufen: ["kids", "teens", "erwachsen"],
    herkunft: EIGEN,
  },
  // R2-5 — corpusData2.ts: „statt" regiert den Genitiv.
  {
    text: "Ein Regenwurm hat fünf Herzschläuche statt eines Herzens.",
    kind: "fakt",
    stufen: ["kids", "teens", "erwachsen"],
  },
  // R2-4 — corpusData.ts: „genauso" ist ein Wort. Wortgrenze = Wortlaut-
  // Änderung, darum wie Position 23 („can not") stilllegen und anhängen,
  // nicht in-place. Alt T3 → neu T3 (kein Zeichen kommt hinzu).
  {
    text: "Anna, Otto, Reliefpfeiler: alles Wörter, die rückwärts genauso klingen.",
    kind: "wortspiel",
    stufen: ["kids", "teens"],
  },
];
