/**
 * ★ Die geprüften Lieder aus Klangpunkte - für die Melodie beim Tippen.
 *
 * Klangpunkte (Braille-Noten) hat in `lib/klangpunkte/songs.ts` eigene,
 * Ton für Ton geprüfte Transkriptionen gemeinfreier Lieder. Sie stehen hier
 * in der Notenschrift von `melodie.ts`: Haltebogen ⇒ ein Ton (Längen
 * addiert), Pause ⇒ `R` (stummer Anschlag; am Anfang und Ende entfallen sie).
 *
 * ⚠️ WARUM ABGESCHRIEBEN UND NICHT IMPORTIERT: `songs.ts` zieht über
 *   `notation.ts` den Braille-Code von Punktgenau mit ins Tastenflow-Bündel
 *   (Wächter `tests/buendel-fremdes-nachladen.test.ts`, 15.10.2026).
 *   Damit die Abschrift nicht still auseinanderläuft, rechnet
 *   `tests/tastenflow-melodie.test.ts` jedes Lied aus `songs.ts` neu um und
 *   vergleicht Ton für Ton. Ändert Klangpunkte ein Lied, wird der Test rot -
 *   dann hier nachziehen.
 */
import type { Melodie } from "./melodienListe";

export const MELODIEN_KLANGPUNKTE: readonly Melodie[] = [
  {
    id: "kp-haenschen",
    name: { de: "Hänschen klein", en: "Little Hans" },
    art: "kinderlied",
    noten: "G4:0.5 E4:0.5 E4 F4:0.5 D4:0.5 D4 C4:0.5 D4:0.5 E4:0.5 F4:0.5 G4:0.5 G4:0.5 G4 G4:0.5 E4:0.5 E4 F4:0.5 D4:0.5 D4 C4:0.5 E4:0.5 G4:0.5 G4:0.5 C4:2 D4:0.5 D4:0.5 D4:0.5 D4:0.5 D4:0.5 E4:0.5 F4 E4:0.5 E4:0.5 E4:0.5 E4:0.5 E4:0.5 F4:0.5 G4 G4:0.5 E4:0.5 E4 F4:0.5 D4:0.5 D4 C4:0.5 E4:0.5 G4:0.5 G4:0.5 C4:2",
  },
  {
    id: "kp-entchen",
    name: { de: "Alle meine Entchen", en: "All My Little Ducklings" },
    art: "kinderlied",
    noten: "C4:0.5 D4:0.5 E4:0.5 F4:0.5 G4 G4 A4:0.5 A4:0.5 A4:0.5 A4:0.5 G4 R A4:0.5 A4:0.5 A4:0.5 A4:0.5 G4 R F4:0.5 F4:0.5 F4:0.5 F4:0.5 E4 E4 D4:0.5 D4:0.5 D4:0.5 D4:0.5 C4:2",
  },
  {
    id: "kp-kuckuck",
    name: { de: "Kuckuck, Kuckuck, ruft's aus dem Wald", en: "Cuckoo, Cuckoo" },
    art: "kinderlied",
    noten: "G4 E4 R G4 E4 R D4 C4 D4 C4:3 D4 D4 E4 F4:2 D4 E4 E4 F4 G4:2 E4 G4:2 E4 G4:2 E4 F4 E4 D4 C4:3",
  },
  {
    id: "kp-summ",
    name: { de: "Summ, summ, summ", en: "Buzz, Buzz, Buzz" },
    art: "kinderlied",
    noten: "G4 F4 E4 R D4:0.5 E4:0.5 F4:0.5 D4:0.5 C4 R E4:0.5 F4:0.5 G4:0.5 E4:0.5 D4:0.5 E4:0.5 F4:0.5 D4:0.5 E4:0.5 F4:0.5 G4:0.5 E4:0.5 D4:0.5 E4:0.5 F4:0.5 D4:0.5 G4 F4 E4 R D4:0.5 E4:0.5 F4:0.5 D4:0.5 C4",
  },
  {
    id: "kp-fuchs",
    name: { de: "Fuchs, du hast die Gans gestohlen", en: "Fox, You Stole the Goose" },
    art: "kinderlied",
    noten: "C4:0.5 D4:0.5 E4:0.5 F4:0.5 G4:0.5 G4:0.5 G4:0.5 G4:0.5 A4:0.5 F4:0.5 C5:0.5 A4:0.5 G4 R A4:0.5 F4:0.5 C5:0.5 A4:0.5 G4 R G4:0.5 F4:0.5 F4:0.5 F4:0.5 F4:0.5 E4:0.5 E4:0.5 E4:0.5 E4:0.5 D4:0.5 E4:0.5 D4:0.5 C4:0.5 E4:0.5 G4 G4:0.5 F4:0.5 F4:0.5 F4:0.5 F4:0.5 E4:0.5 E4:0.5 E4:0.5 E4:0.5 D4:0.5 E4:0.5 D4:0.5 C4",
  },
  {
    id: "kp-hopp",
    name: { de: "Hopp, hopp, hopp", en: "Hop, Hop, Hop" },
    art: "kinderlied",
    noten: "C4 E4 G4 R G4:0.5 F4:0.5 E4:0.5 D4:0.5 C4 R D4:0.5 D4:0.5 B3:0.5 G3:0.5 G4:0.5 G4:0.5 E4:0.5 C4:0.5 D4:0.5 D4:0.5 B3:0.5 G3:0.5 G4:0.5 G4:0.5 E4:0.5 C4:0.5 C4:0.5 D4:0.5 E4:0.5 F4:0.5 G4 R G4:0.5 F4:0.5 E4:0.5 D4:0.5 C4",
  },
  {
    id: "kp-dumpa",
    name: { de: "Es wird scho glei dumpa", en: "It Is Getting Dark Soon" },
    art: "kinderlied",
    noten: "G3 C4 C4 D4 E4:0.75 G4:0.25 G4:1.5 F4:0.5 E4 E4 D4 C4:2 G3 C4 C4 D4 E4:0.75 G4:0.25 G4:1.5 F4:0.5 E4 E4 D4 C4:2 E4:0.5 F4:0.5 G4 E4 G4 G4:0.5 F4:0.5 D4:1.5 F4:0.5 E4 C4 E4 D4:2 G3 C4 C4 D4 E4:0.75 G4:0.25 G4:1.5 F4:0.5 E4 E4 D4 C4:2 E4:0.5 G3:0.5 C4:2 E4:0.5 G3:0.5 C4:1.5 G3:0.5 C4:0.5 E4:0.5 G4 E4:0.5 C4:0.5 D4:0.5 G3:0.5 C4:2",
  },
  {
    id: "kp-ode",
    name: { de: "Ode an die Freude", en: "Ode to Joy", fr: "Ode à la joie", es: "Oda a la alegría", it: "Inno alla gioia", pl: "Oda do radości", cs: "Óda na radost" },
    art: "klassik",
    noten: "E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 E4:1.5 D4:0.5 D4:2 E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 D4:1.5 C4:0.5 C4:2 D4 D4 E4 C4 D4 E4:0.5 F4:0.5 E4 C4 D4 E4:0.5 F4:0.5 E4 D4 C4 D4 G3 E4 E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 D4:1.5 C4:0.5 C4:2",
  },
  {
    id: "kp-nachtmusik",
    name: { de: "Eine kleine Nachtmusik", en: "A Little Night Music", fr: "Une petite musique de nuit", es: "Pequeña serenata nocturna", it: "Piccola serenata notturna", pl: "Mała serenada nocna", cs: "Malá noční hudba" },
    art: "klassik",
    noten: "C5 R:0.5 G4:0.5 C5 R:0.5 G4:0.5 C5:0.5 G4:0.5 C5:0.5 E5:0.5 G5 R F5 R:0.5 D5:0.5 F5 R:0.5 D5:0.5 F5:0.5 D5:0.5 B4:0.5 D5:0.5 G4 R C5:0.5 R:0.5 C5:1.5 E5:0.5 D5:0.5 C5:0.5 C5:0.5 B4:0.5 B4:1.5 D5:0.5 F5:0.5 B4:0.5 D5:0.5 C5:0.5 C5:1.5 E5:0.5 D5:0.5 C5:0.5 C5:0.5 B4:0.5 B4:1.5 D5:0.5 F5:0.5 B4:0.5 C5:0.5 C5:0.5 B4:0.5 A4:0.25 B4:0.25 C5:0.5 C5:0.5 D5:0.5 C5:0.25 D5:0.25 E5:0.5 E5:0.5 F5:0.5 E5:0.25 F5:0.25 G5",
  },
  {
    id: "kp-fuer-elise",
    name: { de: "Für Elise", en: "For Elise", fr: "Pour Élise", es: "Para Elisa", it: "Per Elisa", pl: "Dla Elizy", cs: "Pro Elišku", tr: "Elise için" },
    art: "klassik",
    noten: "E5:0.25 D#5:0.25 E5:0.25 D#5:0.25 E5:0.25 B4:0.25 D5:0.25 C5:0.25 A4:0.5 R:0.25 C4:0.25 E4:0.25 A4:0.25 B4:0.5 R:0.25 E4:0.25 G#4:0.25 B4:0.25 C5:0.5 R:0.25 E4:0.25 E5:0.25 D#5:0.25 E5:0.25 D#5:0.25 E5:0.25 B4:0.25 D5:0.25 C5:0.25 A4:0.5 R:0.25 C4:0.25 E4:0.25 A4:0.25 B4:0.5 R:0.25 E4:0.25 C5:0.25 B4:0.25 A4",
  },
  {
    id: "kp-donau",
    name: { de: "An der schönen blauen Donau", en: "The Blue Danube", fr: "Le Beau Danube bleu", es: "El Danubio azul", it: "Sul bel Danubio blu", pl: "Nad pięknym modrym Dunajem", cs: "Na krásném modrém Dunaji" },
    art: "klassik",
    noten: "C4 C4 E4 G4 G4:2 G5 G5:2 E5 E5:2 C4 C4 E4 G4 G4:2 G5 G5:2 F5 F5:2 B3 B3 D4 A4 A4:2 A5 A5:2 F5 F5:2 B3 B3 D4 A4 A4:2 A5 A5:2 E5 E5:2 C4 E5 C5 E4 E4:2 D4 A4:2 G4 C4:1.5 C5:0.5 C5 C5",
  },
  {
    id: "kp-morgenstimmung",
    name: { de: "Morgenstimmung", en: "Morning Mood", fr: "Au matin", es: "La mañana", it: "Il mattino", pl: "Poranek", cs: "Ráno" },
    art: "klassik",
    noten: "G4:0.5 E4:0.5 D4:0.5 C4:0.5 D4:0.5 E4:0.5 G4:0.5 E4:0.5 D4:0.5 C4:0.5 D4:0.25 E4:0.25 D4:0.25 E4:0.25 G4:0.5 E4:0.5 G4:0.5 A4:0.5 E4:0.5 A4:0.5 G4:0.5 E4:0.5 D4:0.5 C4",
  },
  {
    id: "kp-saints",
    name: { de: "Oh When the Saints", en: "Oh When the Saints" },
    art: "klassik",
    noten: "C4 E4 F4 G4:4 R C4 E4 F4 G4:4 R C4 E4 F4 G4:2 E4:2 C4:2 E4:2 D4:4 R E4 E4 D4 C4:4 E4:2 G4:2 G4 F4:3 R:2 E4 F4 G4:2 E4:2 C4:2 D4:2 C4:4",
  },
  {
    id: "kp-amazing-grace",
    name: { de: "Amazing Grace", en: "Amazing Grace" },
    art: "klassik",
    noten: "G3 C4:2 E4:0.5 C4:0.5 E4:2 D4 C4:2 A3 G3:2 G3 C4:2 E4:0.5 C4:0.5 E4:2 D4 G4:2 E4 G4:1.5 E4:0.5 G4:0.5 E4:0.5 C4:2 G3 A3:1.5 C4:0.5 C4:0.5 A3:0.5 G3:2 G3 C4:2 E4:0.5 C4:0.5 E4:2 D4 C4:3",
  },
  {
    id: "kp-greensleeves",
    name: { de: "Greensleeves", en: "Greensleeves" },
    art: "klassik",
    noten: "A4 C5:2 D5 E5:1.5 F5:0.5 E5 D5:2 B4 G4:1.5 A4:0.5 B4 C5:2 A4 A4:1.5 G#4:0.5 A4 B4:2 G#4 E4:2 A4 C5:2 D5 E5:1.5 F5:0.5 E5 D5:2 B4 G4:1.5 A4:0.5 B4 C5:1.5 B4:0.5 A4 G#4:1.5 F#4:0.5 G#4 A4:3 A4:2 R G5:3 G5:1.5 F5:0.5 E5 D5:2 B4 G4:1.5 A4:0.5 B4 C5:2 A4 A4:1.5 G#4:0.5 A4 B4:2 G#4 E4:2 R G5:3 G5:1.5 F5:0.5 E5 D5:2 B4 G4:1.5 A4:0.5 B4 C5:1.5 B4:0.5 A4 G#4:1.5 F#4:0.5 G#4 A4:3 A4:2",
  },
  {
    id: "kp-auld-lang-syne",
    name: { de: "Auld Lang Syne", en: "Auld Lang Syne" },
    art: "klassik",
    noten: "G3 C4:1.5 C4:0.5 C4 E4 D4:1.5 C4:0.5 D4 E4 C4:1.5 C4:0.5 E4 G4 A4:3 A4 G4:1.5 E4:0.5 E4 C4 D4:1.5 C4:0.5 D4 E4 C4:1.5 A3:0.5 A3 G3 C4:3 A4 G4:1.5 E4:0.5 E4 C4 D4:1.5 C4:0.5 D4 A4 G4:1.5 E4:0.5 E4 G4 A4:3 A4 G4:1.5 E4:0.5 E4 C4 D4:1.5 C4:0.5 D4 E4 C4:1.5 A3:0.5 A3 G3 C4:3",
  },
];
