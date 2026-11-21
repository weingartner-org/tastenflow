/**
 * TN-E10 (Text-Nachschub §7) — Ersatz für die aufgeräumten Zeilen.
 *
 * Die Aufräum-Charge hat drei Dinge stillgelegt (corpusDeactivated.ts):
 *  1. Sorten-Dubletten (derselbe Text unter zwei Sorten → doppelt serviert),
 *  2. Varianten-Ketten (dieselbe Aussage in bis zu zehn Fassungen),
 *  3. die Präfix-Monotonie „Schon gewusst?" — dreizehnmal derselbe Einstieg.
 *
 * Punkt 3 durfte kein Wissensverlust werden: Die Fakten kommen hier mit
 * VARIIERTEM Einstieg zurück (und wo der Prüfbericht sie beanstandet hat, gleich
 * fachlich präzisiert — Giraffen-„Halsknochen" heißen Halswirbel).
 *
 * Warum neue Einträge statt Textänderung am alten Platz: Ein In-Place-Edit
 * ändert die `bausteinId` an bestehender Manifest-POSITION und bricht damit die
 * Präfix-Validierung des No-Repeat-Ledgers — alle Kinder verlören ihren Stand.
 * Deaktivieren + hinten anhängen ist der einzige ledger-sichere Weg.
 *
 * Append-only. Fakten unverändert in der Sache (nur Einstieg + Präzisierung).
 */
import type { CorpusItem, Herkunft } from "./corpus";
import type { Stufe } from "./account";

const NUR_KIDS: Stufe[] = ["kids"];
const KIDS_TEENS: Stufe[] = ["kids", "teens"];
const NUR_TEENS: Stufe[] = ["teens"];
const EIGEN: Herkunft = {
  quelle: "Sensorik",
  lizenz: "Eigenes Werk (selbst verfasst)",
  autor: "Sensorik-Lernplattform",
};

const f = (text: string, stufen: Stufe[]): CorpusItem => ({
  text,
  kind: "fakt",
  stufen,
  herkunft: EIGEN,
});

/**
 * Dieselben Fakten wie zuvor, aber jeder mit eigenem Einstieg — kein Eintrag
 * beginnt mehr wie der Nachbar.
 */
export const AUFGERAEUMT_CORPUS: CorpusItem[] = [
  f("Bananen wachsen nach oben, der Sonne entgegen.", NUR_KIDS),
  f("Ein Elefant kann alles, nur nicht springen.", NUR_KIDS),
  f("Ein Floh springt hundertmal so hoch wie er selbst.", NUR_KIDS),
  f("Erstaunlich: Ein Tintenfisch hat drei Herzen und blaues Blut.", KIDS_TEENS),
  // Präzisiert (Prüfbericht 27.07.): Halswirbel, nicht Halsknochen.
  f("Eine Giraffe hat sieben Halswirbel, genau wie wir.", NUR_KIDS),
  f("Katzen beherrschen über hundert verschiedene Laute.", NUR_KIDS),
  f("Eine einzige Wolke kann mehrere Hundert Tonnen wiegen.", KIDS_TEENS),
  f("Faultiere verdauen ihre Nahrung wochenlang.", KIDS_TEENS),
  f("Kaum zu glauben: Honig wird niemals schlecht.", NUR_KIDS),
  f("Oktopusse ändern ihre Hautfarbe blitzschnell.", KIDS_TEENS),
  f("Viele Spinnen sehen die Welt durch acht Augen.", NUR_KIDS),
  // Der Spinnenseide-Fakt bleibt aktiv (Stufe c), braucht also keinen Ersatz —
  // dafür hier die Ameisen-Zeile mit neuem Einstieg als zweite Fassung:
  f("Ameisen schlafen sehr oft, dafür jedes Mal nur ganz kurz.", NUR_TEENS),
];
