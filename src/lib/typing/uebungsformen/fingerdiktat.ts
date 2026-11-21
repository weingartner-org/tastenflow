/**
 * Das FINGERDIKTAT als Übungsform - die Klammer um `fingerdiktatAufgaben.ts`.
 *
 * Die blindenspezifischste Form der ganzen Liste: Das Kind hört einen Finger
 * („rechter Mittelfinger") und tippt den Buchstaben, der auf ihm liegt. Es gibt
 * keine Vorlage - deshalb läuft sie über den Rätsel-Bildschirm, auf dem Frage
 * und Antwort auseinanderfallen, und nicht über die gewohnte Tippzeile.
 *
 * Die Zuordnung Finger → Buchstabe kommt aus `fingers.ts`, nirgends sonst.
 */
import type { RaetselAufgabe, Uebungsform } from "./typen";
import { nurInhalt } from "./bedienung";
import { FORM_NAMEN } from "./namen";
import {
  fingerdiktatAnkuendigung,
  fingerdiktatAufgaben,
  fingerdiktatTaugt,
  zeichenDerAnsage,
} from "./fingerdiktatAufgaben";

export const fingerdiktat: Uebungsform = {
  id: "fingerdiktat",
  name: FORM_NAMEN.de.fingerdiktat,
  // Testerin 03.09.2026: „hier wäre es schön, wenn die Eingabe auch angesagt
  // würde." Die Antwort ist EIN Zeichen - ohne Echo weiss ein Kind mit
  // Blindheit nicht, ob im Feld steht, was es tippen wollte.
  eingabeAnsagen: true,
  // ★ Punkt 15 (20.09.2026): Die Antwort ist EIN Zeichen - sobald es getippt
  // ist, gilt es. Kein Prüfen-Knopf, kein Enter nötig (siehe `typen.ts`).
  einzeichigeAntwort: true,
  ankuendigung: fingerdiktatAnkuendigung,
  taugt: fingerdiktatTaugt,
  eigenerBildschirm: "raetsel",
  fragen: (ctx): RaetselAufgabe[] =>
    fingerdiktatAufgaben(ctx).map((a) => ({
      frage: a.ansage,
      // ★ EN4: Der Fingername ist INHALT - er folgt der Übungssprache, wie
      // jeder Fingerhinweis beim Üben (`fingerName(finger, ctx.lang)`). Genau
      // diese Wörter hört das Kind sonst vor jeder neuen Taste; das Diktat
      // prüft, ob sie sitzen. In englischer Bedienung mit deutscher
      // Übungssprache steht er darum in `lang="de"` und spricht deutsch.
      frageTeile: nurInhalt(a.ansage),
      // Testerin 04.09.2026: „rechter Zeigefinger" kann h ODER j meinen, „linker
      // Zeigefinger" f ODER g. Beide zählen - siehe `zeichenDerAnsage`.
      antworten: zeichenDerAnsage(a.zeichen, ctx),
      // KEINE eigene Auflösung: Der Rätsel-Bildschirm nennt die Antwort schon
      // selbst („Die Antwort ist: f."). Ein zweiter Satz mit demselben Inhalt
      // wäre für ein Kind mit Blindheit nur doppelter Text.
    })),
};
