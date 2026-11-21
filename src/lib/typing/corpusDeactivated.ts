/**
 * Kuratierte Deaktivierungs-Liste des Textwelt-Bestands-Audits (TW-E4; Bauplan
 * `Sensorik/BAUPLAN-2026-07-20-TASTENFLOW-TEXTWELT.md`,
 * [[project_tastenflow_textwelt_neuaufbau]]).
 *
 * WARUM eine separate Liste statt Löschen aus den Daten: Das No-Repeat-Ledger
 * (ledger.ts) hängt an STABILEN Manifest-Indizes. Würde man Einträge aus dem
 * Korpus entfernen, verschöben sich alle Folge-Indizes und das „schon getippt"-
 * Bitset einer Person kippte. Darum bleiben aussortierte Einträge im Korpus (und
 * im Manifest — Index stabil) und werden nur beim SERVIEREN übersprungen:
 * „append-only, deaktivieren statt löschen" (Bauplan §3.3 / §5-TW-E4).
 *
 * Gematcht wird über die stabile Baustein-ID (`bausteinId`, satzzeichen-/groß-
 * kleinschreibungs-unabhängig) — nicht über exakte Textgleichheit. Deaktivieren
 * verändert die Manifest-Version NICHT (die IDs bleiben) → kein Ledger-Reset.
 *
 * Jede Deaktivierung trägt eine Begründung (menschlich prüfbar). Neue Curation
 * (TW-E5+) hängt hier weitere Einträge an.
 */
import { bausteinId } from "./ledger";
import { DEACTIVATED_EN } from "./corpusDeactivatedEn";

export interface DeactivatedEntry {
  /** Sorte des deaktivierten Bausteins (Teil der stabilen ID). */
  kind: string;
  /** Der Text — reicht zur ID-Bildung; Satzzeichen/Groß-Klein egal. */
  text: string;
  /** Warum deaktiviert (Audit-Beleg). */
  reason: string;
}

/**
 * TW-E4-Befund: vier Witz-Rätsel („Frage? Pointe") waren fälschlich als `fakt`
 * getaggt und liefen so im Lese-Modul „Wissenswertes" mit — dort sollen aber nur
 * WAHRE Fakten stehen. Alle vier existieren korrekt auch als `witz` (dort bleiben
 * sie aktiv), es geht also kein Inhalt verloren; nur die Fehl-Kategorie fällt weg.
 */
export const DEACTIVATED: readonly DeactivatedEntry[] = [
  {
    kind: "fakt",
    text: "Wie nennt man einen Bären ohne Ohren? B.",
    reason:
      "Witz-Rätsel, kein Fakt (TW-E4-Audit) — existiert korrekt als witz, dort aktiv.",
  },
  {
    kind: "fakt",
    text: "Was sitzt auf dem Baum und ruft Aha? Ein Uhu mit Schnupfen.",
    reason:
      "Witz-Rätsel, kein Fakt (TW-E4-Audit) — existiert korrekt als witz, dort aktiv.",
  },
  {
    kind: "fakt",
    text: "Was ist orange und klingt wie ein Papagei? Eine Karotte.",
    reason:
      "Witz-Rätsel, kein Fakt (TW-E4-Audit) — existiert korrekt als witz, dort aktiv.",
  },
  {
    kind: "fakt",
    text: "Warum können Geister so schlecht lügen? Man sieht durch sie hindurch.",
    reason:
      "Witz-Rätsel, kein Fakt (TW-E4-Audit) — existiert korrekt als witz, dort aktiv.",
  },

  // --- P1-Inhaltsfehler (Prüfbericht 2026-07-27, „Priorisierte Empfehlungen") ---
  {
    kind: "fakt",
    text: "Tasten ist schneller als Sehen, wenn man es gut geübt hat.",
    reason:
      "Sachlich falsch (P1-Prüfbericht 2026-07-27): Braille-Lesen erreicht ~90–150 WpM, " +
      "visuelles Lesen 200–300 — auf dieser Plattform besonders heikel.",
  },
  {
    kind: "zungenbrecher",
    text: "Wenn der Benz bremst, brennt das Benz-Bremslicht.",
    reason:
      "Doppelte Markennennung (P1-Prüfbericht 2026-07-27) — markenfrei nicht sinnvoll umformulierbar.",
  },
  // --- TN-E9 Humor-Offensive: pointenlose bzw. nicht funktionierende Witze
  // (Prüfbericht 2026-07-27, „Die 5 schwächsten"). Ersatz liefert corpusHumor.ts.
  {
    kind: "witz",
    text: "Was ist klein, rund und lacht? Ein Kuller, der kichert!",
    reason:
      "Pointe existiert nicht: „Kuller\" ist kein Wort, es gibt kein Wortspiel (TN-E9).",
  },
  {
    kind: "witz",
    text: "Was liegt am Strand und hat Schnupfen? Eine Meerjungfrau!",
    reason:
      "Pointe zerstört: Das Wortspiel braucht „Nuschel\" (vgl. die funktionierende " +
      "Fassung im Bestand) — mit „Meerjungfrau\" bleibt keine Pointe (TN-E9).",
  },
  {
    kind: "witz",
    text: "Was macht der Fisch in der Schule? Er schwimmt von Buch zu Buch.",
    reason:
      "Wortspiel existiert nur im Englischen (school = Fischschwarm) — auf Deutsch " +
      "pointenlos (TN-E9).",
  },
  {
    kind: "witz",
    text: "Was hat Hörner und macht Krach? Ein Auto mit Kuh am Steuer!",
    reason: "Reine Absurdität ohne Doppeldeutigkeit, keine Pointe (TN-E9).",
  },
  {
    kind: "witz",
    text: "Wie zählt die Spinne? Mit acht Beinen geht das ganz fix.",
    reason: "Feststellung, keine Pointe (TN-E9).",
  },

  // --- TN-E10 Aufräum-Charge: SORTEN-DUBLETTEN ---------------------------------
  // `dedupKey` schlüsselt auf Sorte+Text, darum überlebte derselbe Text unter
  // zwei Sorten und wurde DOPPELT serviert (Prüfbericht 27.07., 19 Gruppen).
  // Es bleibt jeweils die inhaltlich richtige Sorte aktiv (Witz-Rätsel → witz,
  // Sachaussage → fakt, Sprichwort → sprichwort); nichts wird gelöscht.
  {
    kind: "wortspiel",
    text: "Was ist orange und klingt wie ein Papagei? Eine Karotte!",
    reason:
      "Sorten-Dublette (TN-E10): derselbe Text läuft zusätzlich als witz — dort " +
      "inhaltlich richtig, hier doppelt serviert.",
  },
  {
    kind: "satz",
    text: "Was ist orange und klingt wie ein Papagei? Eine Karotte.",
    reason:
      "Sorten-Dublette (TN-E10): derselbe Text läuft zusätzlich als witz — dort " +
      "inhaltlich richtig, hier doppelt serviert.",
  },
  {
    kind: "satz",
    text: "Was ist weiß und stört beim Frühstück? Eine Lawine.",
    reason:
      "Sorten-Dublette (TN-E10): derselbe Text läuft zusätzlich als witz — dort " +
      "inhaltlich richtig, hier doppelt serviert.",
  },
  {
    kind: "wissen",
    text: "Ein Kolibri schlägt bis zu 80 Mal pro Sekunde mit den Flügeln.",
    reason:
      "Sorten-Dublette (TN-E10): derselbe Text läuft zusätzlich als fakt — dort " +
      "inhaltlich richtig, hier doppelt serviert.",
  },
  {
    kind: "satz",
    text: "Ein Schmetterling schmeckt mit seinen Füßen.",
    reason:
      "Sorten-Dublette (TN-E10): derselbe Text läuft zusätzlich als fakt — dort " +
      "inhaltlich richtig, hier doppelt serviert.",
  },
  {
    kind: "satz",
    text: "Was ist gelb und kann nicht schwimmen? Ein Bagger.",
    reason:
      "Sorten-Dublette (TN-E10): derselbe Text läuft zusätzlich als witz — dort " +
      "inhaltlich richtig, hier doppelt serviert.",
  },
  {
    kind: "wortspiel",
    text: "Was ist grün und klopft an die Tür? Ein Klopfsalat!",
    reason:
      "Sorten-Dublette (TN-E10): derselbe Text läuft zusätzlich als witz — dort " +
      "inhaltlich richtig, hier doppelt serviert.",
  },
  {
    kind: "spruch",
    text: "Übung macht den Meister.",
    reason:
      "Sorten-Dublette (TN-E10): derselbe Text läuft zusätzlich als sprichwort — dort " +
      "inhaltlich richtig, hier doppelt serviert.",
  },
  {
    kind: "spruch",
    text: "Geduld bringt Rosen.",
    reason:
      "Sorten-Dublette (TN-E10): derselbe Text läuft zusätzlich als sprichwort — dort " +
      "inhaltlich richtig, hier doppelt serviert.",
  },
  {
    kind: "spruch",
    text: "Morgenstund hat Gold im Mund.",
    reason:
      "Sorten-Dublette (TN-E10): derselbe Text läuft zusätzlich als sprichwort — dort " +
      "inhaltlich richtig, hier doppelt serviert.",
  },
  {
    kind: "spruch",
    text: "Reden ist Silber, Schweigen ist Gold.",
    reason:
      "Sorten-Dublette (TN-E10): derselbe Text läuft zusätzlich als sprichwort — dort " +
      "inhaltlich richtig, hier doppelt serviert.",
  },
  {
    kind: "wissen",
    text: "Der Blauwal ist das größte Tier, das je gelebt hat.",
    reason:
      "Sorten-Dublette (TN-E10): derselbe Text läuft zusätzlich als fakt — dort " +
      "inhaltlich richtig, hier doppelt serviert.",
  },
  {
    kind: "wissen",
    text: "Schmetterlinge schmecken mit ihren Füßen.",
    reason:
      "Sorten-Dublette (TN-E10): derselbe Text läuft zusätzlich als fakt — dort " +
      "inhaltlich richtig, hier doppelt serviert.",
  },
  {
    kind: "wissen",
    text: "Auf der Venus dauert ein Tag länger als ein ganzes Jahr.",
    reason:
      "Sorten-Dublette (TN-E10): derselbe Text läuft zusätzlich als fakt — dort " +
      "inhaltlich richtig, hier doppelt serviert.",
  },
  {
    kind: "wortspiel",
    text: "Wie heißen die Muskeln einer Katze? Miezeps!",
    reason:
      "Sorten-Dublette (TN-E10): derselbe Text läuft zusätzlich als witz — dort " +
      "inhaltlich richtig, hier doppelt serviert.",
  },
  {
    kind: "wortspiel",
    text: "Egal wie dicht du bist, Goethe war Dichter.",
    reason:
      "Sorten-Dublette (TN-E10): derselbe Text läuft zusätzlich als witz — dort " +
      "inhaltlich richtig, hier doppelt serviert.",
  },
  {
    kind: "wissen",
    text: "Eine Katze schläft fast den halben Tag.",
    reason:
      "Sorten-Dublette (TN-E10): derselbe Text läuft zusätzlich als fakt — dort " +
      "inhaltlich richtig, hier doppelt serviert.",
  },
  {
    kind: "wortspiel",
    text: "Why did the banana go to the doctor? It was not peeling well.",
    reason:
      "Sorten-Dublette (TN-E10): derselbe Text läuft zusätzlich als witz — dort " +
      "inhaltlich richtig, hier doppelt serviert.",
  },
  {
    kind: "spruch",
    text: "Practice makes perfect.",
    reason:
      "Sorten-Dublette (TN-E10): derselbe Text läuft zusätzlich als sprichwort — dort " +
      "inhaltlich richtig, hier doppelt serviert.",
  },
  {
    kind: "spruch",
    text: "Actions speak louder than words.",
    reason:
      "Sorten-Dublette (TN-E10): derselbe Text läuft zusätzlich als sprichwort — dort " +
      "inhaltlich richtig, hier doppelt serviert.",
  },
  {
    kind: "satz",
    text: "Octopuses have three hearts and blue blood.",
    reason:
      "Sorten-Dublette (TN-E10): derselbe Text läuft zusätzlich als fakt — dort " +
      "inhaltlich richtig, hier doppelt serviert.",
  },
  {
    kind: "spruch",
    text: "Two heads are better than one.",
    reason:
      "Sorten-Dublette (TN-E10): derselbe Text läuft zusätzlich als sprichwort — dort " +
      "inhaltlich richtig, hier doppelt serviert.",
  },
  {
    kind: "spruch",
    text: "Better late than never.",
    reason:
      "Sorten-Dublette (TN-E10): derselbe Text läuft zusätzlich als sprichwort — dort " +
      "inhaltlich richtig, hier doppelt serviert.",
  },
  {
    kind: "wortspiel",
    text: "Why did the bicycle fall over? It was two tired.",
    reason:
      "Sorten-Dublette (TN-E10): derselbe Text läuft zusätzlich als witz — dort " +
      "inhaltlich richtig, hier doppelt serviert.",
  },
  // --- TN-E10: Varianten-Ketten, Zahl-Widerspruch, Präfix-Monotonie -----------
  {
    kind: "fakt",
    text: "Honig verdirbt nicht. Funde aus alten Gräbern waren noch essbar.",
    reason:
      "Varianten-Kette gekappt (TN-E10): dieselbe Aussage (Honig verdirbt nicht) stand mehrfach " +
      "im Bestand; zwei Fassungen bleiben aktiv.",
  },
  {
    kind: "fakt",
    text: "Honig verdirbt nicht; Funde aus Pharaonengräbern sind noch essbar.",
    reason:
      "Varianten-Kette gekappt (TN-E10): dieselbe Aussage (Honig verdirbt nicht) stand mehrfach " +
      "im Bestand; zwei Fassungen bleiben aktiv.",
  },
  {
    kind: "fakt",
    text: "Honig wird niemals schlecht: Selbst nach 3000 Jahren ist er essbar.",
    reason:
      "Varianten-Kette gekappt (TN-E10): dieselbe Aussage (Honig verdirbt nicht) stand mehrfach " +
      "im Bestand; zwei Fassungen bleiben aktiv.",
  },
  {
    kind: "fakt",
    text: "Schon gewusst? Honig wird niemals schlecht.",
    reason:
      "Varianten-Kette gekappt (TN-E10): dieselbe Aussage (Honig verdirbt nicht) stand mehrfach " +
      "im Bestand; zwei Fassungen bleiben aktiv.",
  },
  {
    kind: "wissen",
    text: "Honig verdirbt praktisch nie und bleibt nach Jahrtausenden noch essbar.",
    reason:
      "Varianten-Kette gekappt (TN-E10): dieselbe Aussage (Honig verdirbt nicht) stand mehrfach " +
      "im Bestand; zwei Fassungen bleiben aktiv.",
  },
  {
    kind: "wissen",
    text: "Honig wird nie schlecht. Nie!",
    reason:
      "Varianten-Kette gekappt (TN-E10): dieselbe Aussage (Honig verdirbt nicht) stand mehrfach " +
      "im Bestand; zwei Fassungen bleiben aktiv.",
  },
  {
    kind: "wissen",
    text: "Honig kann nach tausend Jahren noch essbar sein.",
    reason:
      "Varianten-Kette gekappt (TN-E10): dieselbe Aussage (Honig verdirbt nicht) stand mehrfach " +
      "im Bestand; zwei Fassungen bleiben aktiv.",
  },
  {
    kind: "fakt",
    text: "Honig ist eines der wenigen Lebensmittel, das kaum verdirbt.",
    reason:
      "Varianten-Kette gekappt (TN-E10): dieselbe Aussage (Honig verdirbt nicht) stand mehrfach " +
      "im Bestand; zwei Fassungen bleiben aktiv.",
  },
  {
    kind: "fakt",
    text: "Kolibris sind die einzigen Vögel, die anhaltend rückwärts fliegen können.",
    reason:
      "Varianten-Kette gekappt (TN-E10): dieselbe Aussage (Kolibri fliegt rückwärts) stand mehrfach " +
      "im Bestand; zwei Fassungen bleiben aktiv.",
  },
  {
    kind: "wissen",
    text: "Ein Kolibri kann als einziger Vogel anhaltend rückwärts fliegen.",
    reason:
      "Varianten-Kette gekappt (TN-E10): dieselbe Aussage (Kolibri fliegt rückwärts) stand mehrfach " +
      "im Bestand; zwei Fassungen bleiben aktiv.",
  },
  {
    kind: "fakt",
    text: "Ein Tintenfisch hat drei Herzen.",
    reason:
      "Varianten-Kette gekappt (TN-E10): dieselbe Aussage (Oktopus hat drei Herzen) stand mehrfach " +
      "im Bestand; zwei Fassungen bleiben aktiv.",
  },
  {
    kind: "fakt",
    text: "Oktopusse haben drei Herzen und blaues Blut.",
    reason:
      "Varianten-Kette gekappt (TN-E10): dieselbe Aussage (Oktopus hat drei Herzen) stand mehrfach " +
      "im Bestand; zwei Fassungen bleiben aktiv.",
  },
  {
    kind: "fakt",
    text: "Oktopusse haben drei Herzen und blaues Blut. Kein Witz.",
    reason:
      "Varianten-Kette gekappt (TN-E10): dieselbe Aussage (Oktopus hat drei Herzen) stand mehrfach " +
      "im Bestand; zwei Fassungen bleiben aktiv.",
  },
  {
    kind: "fakt",
    text: "Schon gewusst? Ein Tintenfisch hat drei Herzen und blaues Blut.",
    reason:
      "Varianten-Kette gekappt (TN-E10): dieselbe Aussage (Oktopus hat drei Herzen) stand mehrfach " +
      "im Bestand; zwei Fassungen bleiben aktiv.",
  },
  {
    kind: "wissen",
    text: "Oktopusse besitzen drei Herzen und blaues Blut auf Kupferbasis.",
    reason:
      "Varianten-Kette gekappt (TN-E10): dieselbe Aussage (Oktopus hat drei Herzen) stand mehrfach " +
      "im Bestand; zwei Fassungen bleiben aktiv.",
  },
  {
    kind: "wissen",
    text: "Oktopusse haben drei Herzen und blaues Blut auf Basis von Kupfer statt Eisen.",
    reason:
      "Varianten-Kette gekappt (TN-E10): dieselbe Aussage (Oktopus hat drei Herzen) stand mehrfach " +
      "im Bestand; zwei Fassungen bleiben aktiv.",
  },
  {
    kind: "witz",
    text: "Was macht ein Mathebuch beim Arzt? Es klagt über zu viele Probleme.",
    reason:
      "Varianten-Kette gekappt (TN-E10): dieselbe Aussage (Mathebuch mit zu vielen Problemen) stand mehrfach " +
      "im Bestand; zwei Fassungen bleiben aktiv.",
  },
  {
    kind: "wortspiel",
    text: "Warum weint das Mathebuch? Es hat zu viele Probleme.",
    reason:
      "Varianten-Kette gekappt (TN-E10): dieselbe Aussage (Mathebuch mit zu vielen Problemen) stand mehrfach " +
      "im Bestand; zwei Fassungen bleiben aktiv.",
  },
  {
    kind: "satz",
    text: "Was macht ein Mathelehrer im Garten? Wurzeln ziehen.",
    reason:
      "Varianten-Kette gekappt (TN-E10): dieselbe Aussage (Mathelehrer zieht Wurzeln) stand mehrfach " +
      "im Bestand; zwei Fassungen bleiben aktiv.",
  },
  {
    kind: "spruch",
    text: "Übung macht den Meister, aber die Pause macht die Pause.",
    reason:
      "Varianten-Kette gekappt (TN-E10): dieselbe Aussage (Übung macht den Meister) stand mehrfach " +
      "im Bestand; zwei Fassungen bleiben aktiv.",
  },
  {
    kind: "spruch",
    text: "Übung macht den Meister, also tippe fröhlich weiter!",
    reason:
      "Varianten-Kette gekappt (TN-E10): dieselbe Aussage (Übung macht den Meister) stand mehrfach " +
      "im Bestand; zwei Fassungen bleiben aktiv.",
  },
  {
    kind: "spruch",
    text: "Übung macht keinen Meister, aber verdammt nah dran.",
    reason:
      "Varianten-Kette gekappt (TN-E10): dieselbe Aussage (Übung macht den Meister) stand mehrfach " +
      "im Bestand; zwei Fassungen bleiben aktiv.",
  },
  {
    kind: "spruch",
    text: "Übung macht dich gut, nicht perfekt.",
    reason:
      "Varianten-Kette gekappt (TN-E10): dieselbe Aussage (Übung macht den Meister) stand mehrfach " +
      "im Bestand; zwei Fassungen bleiben aktiv.",
  },
  {
    kind: "spruch",
    text: "Übung macht den Meister, die Finger wissen das schon.",
    reason:
      "Varianten-Kette gekappt (TN-E10): dieselbe Aussage (Übung macht den Meister) stand mehrfach " +
      "im Bestand; zwei Fassungen bleiben aktiv.",
  },
  {
    kind: "fakt",
    text: "Schon gewusst? Faultiere können ihre Nahrung wochenlang verdauen.",
    reason:
      "Varianten-Kette gekappt (TN-E10): dieselbe Aussage (Faultier verdaut wochenlang) stand mehrfach " +
      "im Bestand; zwei Fassungen bleiben aktiv.",
  },
  {
    kind: "fakt",
    text: "Ein Tag auf der Venus dauert länger als ein Jahr auf der Venus.",
    reason:
      "Varianten-Kette gekappt (TN-E10): dieselbe Aussage (Venus-Tag länger als Venus-Jahr) stand mehrfach " +
      "im Bestand; zwei Fassungen bleiben aktiv.",
  },
  {
    kind: "fakt",
    text: "Ein Tag auf der Venus ist länger als ihr ganzes Jahr.",
    reason:
      "Varianten-Kette gekappt (TN-E10): dieselbe Aussage (Venus-Tag länger als Venus-Jahr) stand mehrfach " +
      "im Bestand; zwei Fassungen bleiben aktiv.",
  },
  {
    kind: "wissen",
    text: "Ein Tag auf der Venus dauert länger als ein ganzes Jahr auf der Venus.",
    reason:
      "Varianten-Kette gekappt (TN-E10): dieselbe Aussage (Venus-Tag länger als Venus-Jahr) stand mehrfach " +
      "im Bestand; zwei Fassungen bleiben aktiv.",
  },
  {
    kind: "wissen",
    text: "Ein Tag auf der Venus dauert länger als ein ganzes Venusjahr um die Sonne.",
    reason:
      "Varianten-Kette gekappt (TN-E10): dieselbe Aussage (Venus-Tag länger als Venus-Jahr) stand mehrfach " +
      "im Bestand; zwei Fassungen bleiben aktiv.",
  },
  {
    kind: "fakt",
    text: "Bananen sind botanisch gesehen Beeren, Erdbeeren dagegen nicht.",
    reason:
      "Varianten-Kette gekappt (TN-E10): dieselbe Aussage (Banane ist eine Beere) stand mehrfach " +
      "im Bestand; zwei Fassungen bleiben aktiv.",
  },
  {
    kind: "wissen",
    text: "Bananen sind botanisch gesehen Beeren, Erdbeeren dagegen sind gar keine Beeren.",
    reason:
      "Varianten-Kette gekappt (TN-E10): dieselbe Aussage (Banane ist eine Beere) stand mehrfach " +
      "im Bestand; zwei Fassungen bleiben aktiv.",
  },
  {
    kind: "fakt",
    text: "Ein Blitz ist fünfmal heißer als die Oberfläche der Sonne.",
    reason:
      "Varianten-Kette gekappt (TN-E10): dieselbe Aussage (Blitz heißer als Sonnenoberfläche) stand mehrfach " +
      "im Bestand; zwei Fassungen bleiben aktiv.",
  },
  {
    kind: "fakt",
    text: "Ein Blitz ist kurz heißer als die Oberfläche der Sonne.",
    reason:
      "Varianten-Kette gekappt (TN-E10): dieselbe Aussage (Blitz heißer als Sonnenoberfläche) stand mehrfach " +
      "im Bestand; zwei Fassungen bleiben aktiv.",
  },
  {
    kind: "fakt",
    text: "Ein Blitz ist rund fünfmal heißer als die Oberfläche der Sonne.",
    reason:
      "Varianten-Kette gekappt (TN-E10): dieselbe Aussage (Blitz heißer als Sonnenoberfläche) stand mehrfach " +
      "im Bestand; zwei Fassungen bleiben aktiv.",
  },
  {
    kind: "fakt",
    text: "Wombats setzen tatsächlich würfelförmigen Kot ab.",
    reason:
      "Varianten-Kette gekappt (TN-E10): dieselbe Aussage (Wombat-Kot in Würfelform) stand mehrfach " +
      "im Bestand; zwei Fassungen bleiben aktiv.",
  },
  {
    kind: "fakt",
    text: "Wombats setzen würfelförmigen Kot ab; sonst kein Tier auf der Welt.",
    reason:
      "Varianten-Kette gekappt (TN-E10): dieselbe Aussage (Wombat-Kot in Würfelform) stand mehrfach " +
      "im Bestand; zwei Fassungen bleiben aktiv.",
  },
  {
    kind: "satz",
    text: "Ein Kolibri schlägt mit den Flügeln fünfzig Mal pro Sekunde.",
    reason:
      "Widersprüchliche Zahl (TN-E10): der Bestand nennt an anderer Stelle „bis zu " +
      "80-mal pro Sekunde\" — die feste Fünfzig widerspricht; zudem Fehl-Sorte satz.",
  },
  {
    kind: "fakt",
    text: "Schon gewusst? Bananen wachsen nach oben zur Sonne.",
    reason:
      "Präfix-Monotonie (TN-E10): dreizehnmal derselbe Öffner „Schon gewusst?\" — " +
      "der Fakt kommt in corpusAufgeraeumt.ts mit variiertem Einstieg zurück.",
  },
  {
    kind: "fakt",
    text: "Schon gewusst? Ein Elefant kann nicht springen.",
    reason:
      "Präfix-Monotonie (TN-E10): dreizehnmal derselbe Öffner „Schon gewusst?\" — " +
      "der Fakt kommt in corpusAufgeraeumt.ts mit variiertem Einstieg zurück.",
  },
  {
    kind: "fakt",
    text: "Schon gewusst? Ein Floh springt 100-mal so hoch wie er selbst.",
    reason:
      "Präfix-Monotonie (TN-E10): dreizehnmal derselbe Öffner „Schon gewusst?\" — " +
      "der Fakt kommt in corpusAufgeraeumt.ts mit variiertem Einstieg zurück.",
  },
  {
    kind: "fakt",
    text: "Schon gewusst? Ein Tintenfisch hat drei Herzen und blaues Blut.",
    reason:
      "Präfix-Monotonie (TN-E10): dreizehnmal derselbe Öffner „Schon gewusst?\" — " +
      "der Fakt kommt in corpusAufgeraeumt.ts mit variiertem Einstieg zurück.",
  },
  {
    kind: "fakt",
    text: "Schon gewusst? Eine Giraffe hat nur sieben Halsknochen.",
    reason:
      "Präfix-Monotonie (TN-E10): dreizehnmal derselbe Öffner „Schon gewusst?\" — " +
      "der Fakt kommt in corpusAufgeraeumt.ts mit variiertem Einstieg zurück.",
  },
  {
    kind: "fakt",
    text: "Schon gewusst? Eine Katze kann über 100 Laute machen.",
    reason:
      "Präfix-Monotonie (TN-E10): dreizehnmal derselbe Öffner „Schon gewusst?\" — " +
      "der Fakt kommt in corpusAufgeraeumt.ts mit variiertem Einstieg zurück.",
  },
  {
    kind: "fakt",
    text: "Schon gewusst? Eine Wolke kann mehrere Hundert Tonnen wiegen.",
    reason:
      "Präfix-Monotonie (TN-E10): dreizehnmal derselbe Öffner „Schon gewusst?\" — " +
      "der Fakt kommt in corpusAufgeraeumt.ts mit variiertem Einstieg zurück.",
  },
  {
    kind: "fakt",
    text: "Schon gewusst? Faultiere können ihre Nahrung wochenlang verdauen.",
    reason:
      "Präfix-Monotonie (TN-E10): dreizehnmal derselbe Öffner „Schon gewusst?\" — " +
      "der Fakt kommt in corpusAufgeraeumt.ts mit variiertem Einstieg zurück.",
  },
  {
    kind: "fakt",
    text: "Schon gewusst? Honig wird niemals schlecht.",
    reason:
      "Präfix-Monotonie (TN-E10): dreizehnmal derselbe Öffner „Schon gewusst?\" — " +
      "der Fakt kommt in corpusAufgeraeumt.ts mit variiertem Einstieg zurück.",
  },
  {
    kind: "fakt",
    text: "Schon gewusst? Oktopusse können ihre Hautfarbe blitzschnell ändern.",
    reason:
      "Präfix-Monotonie (TN-E10): dreizehnmal derselbe Öffner „Schon gewusst?\" — " +
      "der Fakt kommt in corpusAufgeraeumt.ts mit variiertem Einstieg zurück.",
  },
  {
    kind: "fakt",
    text: "Schon gewusst? Viele Spinnen haben acht Augen.",
    reason:
      "Präfix-Monotonie (TN-E10): dreizehnmal derselbe Öffner „Schon gewusst?\" — " +
      "der Fakt kommt in corpusAufgeraeumt.ts mit variiertem Einstieg zurück.",
  },
  // --- TN-E12 Nachzügler: restliche Befunde des Prüfberichts 27.07. --------
  // Sachlich falsch/irreführend, Sprachfehler, Fehl-Sorte oder Fehlvorstellung.
  // Jede Zeile kommt korrigiert in corpusKorrekturen.ts zurück (append-only).
  {
    kind: "fakt",
    text: "Eine Schnecke kann zwei Jahre am Stück schlafen.",
    reason: "Trivia-Folklore ohne Beleg (Prüfbericht 27.07.); korrigiert in corpusKorrekturen.ts (TN-E12).",
  },
  {
    kind: "fakt",
    text: "Ein Hund riecht millionenfach besser als ein Mensch.",
    reason: "Ueberzeichnet (gaengig 10.000-100.000-fach, nicht millionenfach); korrigiert (TN-E12).",
  },
  {
    kind: "fakt",
    text: "Ein Marienkäfer kann an einem Tag hunderte Blattläuse fressen.",
    reason: "Hunderte gelten fuer die ganze Larvenzeit, nicht fuer einen Tag; korrigiert (TN-E12).",
  },
  {
    kind: "fakt",
    text: "Eine Sonnenblume dreht sich mit der Sonne mit.",
    reason: "Nur JUNGE Sonnenblumen wandern mit; bluehende stehen nach Osten; korrigiert (TN-E12).",
  },
  {
    kind: "wissen",
    text: "Das Klavier zählt physikalisch zu den Schlaginstrumenten, nicht zu den Saiten allein.",
    reason: "Nach Hornbostel-Sachs ist das Klavier ein Saiteninstrument; korrigiert (TN-E12).",
  },
  {
    kind: "fakt",
    text: "Bäume tauschen über ihre Wurzeln und Pilze Botschaften aus.",
    reason: "Wood-Wide-Web-Deutung gilt als ueberinterpretiert (Karst u.a. 2023); korrigiert (TN-E12).",
  },
  {
    kind: "fakt",
    text: "Die kürzeste je geführte Schlacht der Geschichte dauerte 38 Minuten.",
    reason: "Es war ein KRIEG (britisch-sansibarisch 1896), keine Schlacht; korrigiert (TN-E12).",
  },
  {
    kind: "fakt",
    text: "Die kürzeste Schlacht der Geschichte dauerte rund 38 Minuten.",
    reason: "Es war ein KRIEG (britisch-sansibarisch 1896), keine Schlacht; korrigiert (TN-E12).",
  },
  {
    kind: "wissen",
    text: "Mische 23 Menschen, und meist teilen zwei davon denselben Geburtstag.",
    reason: "50,7 Prozent - meist ueberzeichnet den knappen Vorsprung; korrigiert (TN-E12).",
  },
  {
    kind: "wortspiel",
    text: "Anna, Otto, Reliefpfeiler: alles Wörter, die rückwärts genau so klingen.",
    reason: "genau so (auf diese Weise) statt genauso (in gleicher Weise); korrigiert (TN-E12).",
  },
  {
    kind: "wortspiel",
    text: "Anna, Otto und Hannah heißen rücklings genauso wie vorwärts.",
    reason: "ruecklings heisst auf dem Ruecken, nicht rueckwaerts gelesen; korrigiert (TN-E12).",
  },
  {
    kind: "sprichwort",
    text: "Kater Karl mag warme Milch.",
    reason: "Kein Sprichwort, sondern ein einfacher Satz (zwei davon ohne Verb); als satz neu (TN-E12).",
  },
  {
    kind: "sprichwort",
    text: "Ente, Igel und Hund im Gras.",
    reason: "Kein Sprichwort, sondern ein einfacher Satz (zwei davon ohne Verb); als satz neu (TN-E12).",
  },
  {
    kind: "sprichwort",
    text: "Mein Hut ist im Garten.",
    reason: "Kein Sprichwort, sondern ein einfacher Satz (zwei davon ohne Verb); als satz neu (TN-E12).",
  },
  {
    kind: "sprichwort",
    text: "Eine Maus im alten Haus.",
    reason: "Kein Sprichwort, sondern ein einfacher Satz (zwei davon ohne Verb); als satz neu (TN-E12).",
  },
  {
    kind: "sprichwort",
    text: "Abendrot, gut Wetter bot.",
    reason: "Verungluecktes Zitat ohne Sinn; ueberlieferte Fassung in corpusKorrekturen.ts (TN-E12).",
  },
  {
    kind: "sprichwort",
    text: "Wie der Tag zu Lichtmess wird, sich das ganze Frühjahr ziert.",
    reason: "Verungluecktes Zitat ohne Sinn; ueberlieferte Fassung in corpusKorrekturen.ts (TN-E12).",
  },
  {
    kind: "wissen",
    text: "Ein Fisch lebt im Wasser und holt dort Luft.",
    reason: "Fische nehmen geloesten Sauerstoff auf, sie holen keine Luft; korrigiert (TN-E12).",
  },
  {
    kind: "wissen",
    text: "Eine Wolke ist nasse Luft. Daraus wird der Regen.",
    reason: "Wolken sind Troepfchen und Eiskristalle, nicht nasse Luft; korrigiert (TN-E12).",
  },
  {
    kind: "wissen",
    text: "Eine Ente hat an den Fingern eine Haut.",
    reason: "Schwimmhaeute sitzen zwischen den ZEHEN, nicht an Fingern; korrigiert (TN-E12).",
  },
  {
    kind: "wissen",
    text: "Ein Hai hat im Mund Reihe an Reihe.",
    reason: "Satz bricht mittendrin ab und sagt nichts aus; korrigiert (TN-E12).",
  },
// --- TN-E13 Rest-Charge (Johannes 27.07.: „lass den Dachdecker und ändere das
  // Wein-Wortspiel") ------------------------------------------------------------
  {
    kind: "wortspiel",
    text: "Aus Wein wird mit einem B ein Bein.",
    reason:
      "Alkohol in einem Wortspiel für 10- bis 15-Jährige (TN-E13). Dieselbe " +
      "Buchstaben-Pointe steht alkoholfrei in corpusKorrekturen2.ts.",
  },
  {
    kind: "wissen",
    text: "Kleopatra lebte zeitlich näher am ersten iPhone als am Bau der großen Pyramide.",
    reason:
      "Markenname im Schulmaterial (TN-E13) — der Fakt selbst ist stark und kommt " +
      "markenfrei mit „Smartphone\" zurück.",
  },
  {
    kind: "fakt",
    text: "Im All gibt es keinen Schall. Niemand hört dich brüllen.",
    reason:
      "Der zweite Satz ist die Werbezeile eines Horrorfilms und wirkt unnötig " +
      "bedrohlich (TN-E13); der Fakt bleibt, sachlich formuliert.",
  },

  // --- Nachprüfung 28.07.: Befunde, die trotz „alles behoben" offen waren ---
  // Fehl-Sorte: Rätsel als »satz« (Prüfbericht 1.1c nannte 8, TN-E12 erwischte 4).
  // Neu als »witz« in corpusNachpruefung.ts.
  {
    kind: "satz",
    text: "Was raschelt da im Busch? Ein kleines Eichhörnchen!",
    reason: "Rätsel, kein Aussagesatz; als witz neu (Nachprüfung 28.07.).",
  },
  {
    kind: "satz",
    text: "Was sitzt auf dem Baum und ruft Aha? Eine Meise mit Schnupfen.",
    reason: "Rätsel, kein Aussagesatz; als witz neu (Nachprüfung 28.07.).",
  },
  {
    kind: "satz",
    text: "Wo treffen sich viele Kühe? In einem Muuuuseum.",
    reason: "Rätsel, kein Aussagesatz; als witz neu (Nachprüfung 28.07.).",
  },
  {
    kind: "satz",
    text: "Warum kann ein Fahrrad nicht stehen? Es ist zu müde.",
    reason: "Rätsel, kein Aussagesatz; als witz neu (Nachprüfung 28.07.).",
  },
  {
    kind: "satz",
    text: "Welches Tier kann am besten rechnen? Die Addierschlange.",
    reason:
      "Rätsel, kein Aussagesatz — vom neuen REGEL-Gate gefunden, nicht von der " +
      "Hand-Liste des Prüfberichts; als witz neu (Nachprüfung 28.07.).",
  },

  // Fehl-Sorte: erfundene Sinnsprüche als »sprichwort« (Prüfbericht 1.1c nannte
  // ~21, TN-E12 erwischte 4). Ein »sprichwort« gibt sich als überliefertes Gut
  // aus — als „spruch" stimmt die Einordnung. Neu in corpusNachpruefung.ts.
  {
    kind: "sprichwort",
    text: "Wer rastet im Lernen, der rostet im Können.",
    reason: "Erfunden (Kalauer auf »Wer rastet, der rostet«), kein überliefertes Sprichwort; als spruch neu (Nachprüfung 28.07.).",
  },
  {
    kind: "sprichwort",
    text: "Übung macht den Punkt zur Linie.",
    reason: "Erfunden (Abwandlung von »Übung macht den Meister«); als spruch neu (Nachprüfung 28.07.).",
  },
  {
    kind: "sprichwort",
    text: "Wer tastet, der findet.",
    reason: "Erfunden (Abwandlung von »Wer sucht, der findet«); als spruch neu (Nachprüfung 28.07.).",
  },
  {
    kind: "sprichwort",
    text: "Auch unter den Fingern kann man lesen.",
    reason: "Erfundener Sinnspruch, kein Sprichwort; als spruch neu (Nachprüfung 28.07.).",
  },
  {
    kind: "sprichwort",
    text: "Der Wald ruft, und das Echo lacht.",
    reason: "Erfundener Sinnspruch, kein Sprichwort; als spruch neu (Nachprüfung 28.07.).",
  },
  {
    kind: "sprichwort",
    text: "Hund und Katze, alte Freunde im Streit.",
    reason: "Erfundener Sinnspruch, kein Sprichwort; als spruch neu (Nachprüfung 28.07.).",
  },
  {
    kind: "sprichwort",
    text: "Sonne im Herzen, Lieder im Mund.",
    reason: "Erfundener Sinnspruch, kein Sprichwort; als spruch neu (Nachprüfung 28.07.).",
  },
  {
    kind: "sprichwort",
    text: "Wer fragt, der lernt.",
    reason: "Erfundener Sinnspruch, kein Sprichwort; als spruch neu (Nachprüfung 28.07.).",
  },
  {
    kind: "sprichwort",
    text: "Reden ist gut, Tun ist besser.",
    reason: "Erfunden (Anklang an »Reden ist Silber, Schweigen ist Gold«); als spruch neu (Nachprüfung 28.07.).",
  },
  {
    kind: "sprichwort",
    text: "Klein anfangen, groß werden.",
    reason: "Erfundener Sinnspruch, kein Sprichwort; als spruch neu (Nachprüfung 28.07.).",
  },
  {
    kind: "sprichwort",
    text: "Wer lacht, hat mehr Luft.",
    reason: "Erfundener Sinnspruch, kein Sprichwort; als spruch neu (Nachprüfung 28.07.).",
  },
  {
    kind: "sprichwort",
    text: "Wer langsam tastet, liest auch gut.",
    reason: "Erfundener Sinnspruch, kein Sprichwort; als spruch neu (Nachprüfung 28.07.).",
  },
  {
    kind: "sprichwort",
    text: "Ein guter Tag fängt mit Lachen an.",
    reason: "Erfundener Sinnspruch, kein Sprichwort; als spruch neu (Nachprüfung 28.07.).",
  },
  {
    kind: "sprichwort",
    text: "Sechs Punkte sind ein ganzer Buchstabe.",
    reason: "Braille-Tatsache, kein Sprichwort; als fakt neu (Nachprüfung 28.07.).",
  },
  {
    kind: "sprichwort",
    text: "Der Hund mag warme Wurst.",
    reason: "Schlichter Satz, kein Sprichwort; als satz neu (Nachprüfung 28.07.).",
  },

  // Restliche Einzelbefunde des Prüfberichts.
  {
    kind: "satz",
    text: "Im Angebot gibt es 20 Prozent Rabatt.",
    reason:
      "Werbesprache im Schulmaterial (Prüfbericht 1.6, »klar zu korrigieren«); " +
      "die Prozent-Übung kommt werbefrei zurück (Nachprüfung 28.07.).",
  },
  {
    kind: "satz",
    text: "Der Wasserkocher braucht genau so lange wie meine Geduld am Morgen.",
    reason:
      "»genau so« (auf diese Weise) statt »genauso« (im gleichen Maße) — derselbe " +
      "Fehlertyp, den TN-E12 an anderer Stelle behoben hat (Nachprüfung 28.07.).",
  },

  // Inhaltsgleiche Doppelfassungen, die TN-E10 nicht erwischt hat, weil sich der
  // WORTLAUT unterscheidet (der Lint schlägt nur bei gleichem Text an). Es bleibt
  // jeweils die Fassung mit der größten Altersreichweite aktiv.
  {
    kind: "wissen",
    text: "Ein Krake hat drei Herzen, und sein Blut ist blau.",
    reason:
      "Sagt dasselbe wie der aktive Fakt »Ein Oktopus hat drei Herzen und blaues " +
      "Blut.« — Oktopus und Krake sind dasselbe Tier (Nachprüfung 28.07.).",
  },
  {
    kind: "fakt",
    text: "Faultiere können ihr Essen bis zu einem Monat lang verdauen.",
    reason:
      "Dritte Fassung derselben Aussage (Prüfbericht §5: Faultier 8×); aktiv bleibt " +
      "»Ein Faultier braucht für eine Mahlzeit wochenlang zum Verdauen.« (Nachprüfung 28.07.).",
  },
  {
    kind: "fakt",
    text: "Faultiere verdauen ihre Nahrung wochenlang.",
    reason:
      "Zweite Fassung derselben Aussage (Prüfbericht §5: Faultier 8×); aktiv bleibt " +
      "die Fassung mit der größeren Altersreichweite (Nachprüfung 28.07.).",
  },

  // --- Rechtschreib-Charge R1 (14.08.2026), deutsche Wortlaut-Änderungen ---
  // Korrigierte Fassungen: `corpusKorrekturen2.ts` (hinten angehängt).
  {
    kind: "satz",
    text: "Wer selber kocht, weiss immer, was darin ist.",
    reason:
      "Rechtschreib-Charge R1 14.08.2026: »weiss« ist eine ß-Ersatzschreibung (Fund D5). " +
      "Das ß ist im Zeichensatz der Stufe T2 gesperrt, die Zeile steht aber als T2-Satz — " +
      "darum ohne ß neu formuliert statt bloß korrigiert.",
  },
  {
    kind: "zungenbrecher",
    text: "Fischers Fritze fischt frische Fische, frische fischt Fischers Fritze.",
    reason:
      "Rechtschreib-Charge R1 14.08.2026: verstümmelter Zungenbrecher (Fund D14) — " +
      "»frische« steht ohne sein Bezugswort »Fische«.",
  },

  // --- Rechtschreib-Charge R2 (14./15.08.2026), deutsche Wortlaut-Änderungen ---
  // Korrigierte Fassungen: `corpusKorrekturen2.ts` (hinten angehängt).
  {
    kind: "fakt",
    text: "Instrumente teilt man in Saiten, Blas, Schlag und Tasten ein.",
    reason:
      "Rechtschreib-Charge R2 14.08.2026: Die Aufzählung braucht Ergänzungsstriche " +
      "(Prüfbericht §3 Position 1) — ohne sie teilt der Satz Instrumente »in Saiten« " +
      "und »in Tasten« ein statt in Saiten- und Tasteninstrumente.",
  },
  {
    kind: "sprichwort",
    text: "Abendrot, Gutwetterbote. Morgenrot, schlecht Wetter droht.",
    reason:
      "Rechtschreib-Charge R2 14.08.2026: unflektiert und ohne Reim (Prüfbericht §3 " +
      "Position 2) — die überlieferte Bauernregel reimt auf »-rot« (»Gutwetterbot«) " +
      "und schreibt »Schlechtwetter« zusammen.",
  },
  {
    kind: "fakt",
    text: "Ein Regenwurm hat fünf Herzschläuche statt einem Herzen.",
    reason:
      "Rechtschreib-Charge R2 14.08.2026: »statt« regiert den Genitiv (Prüfbericht §3 " +
      "Position 5) — »statt eines Herzens«.",
  },
  {
    kind: "wortspiel",
    text: "Welcher Kuchen kann gar nicht backen? Der Faulenzer.",
    reason:
      "R2 14.08.2026: Pointe setzt die österreichischen Faulenzer-Schnitten voraus - " +
      "Johannes: löschen, es gibt genug Witze.",
  },
  {
    kind: "wortspiel",
    text: "Anna, Otto, Reliefpfeiler: alles Wörter, die rückwärts genau so klingen.",
    reason:
      "Rechtschreib-Charge R2 15.08.2026: »genauso« ist ein Wort (Prüfbericht §3 " +
      "Position 4) - hier steht das vergleichende Adverb, nicht »genau« + »so«. " +
      "Korrigierte Fassung in corpusKorrekturen2.ts.",
  },
];
/** Stabile IDs der deaktivierten Bausteine (einmalig aufgebaut). */
const DEACTIVATED_IDS: ReadonlySet<string> = new Set(
  [...DEACTIVATED, ...DEACTIVATED_EN].map((d) => bausteinId(d.kind, d.text)),
);

/** Ist dieser Baustein (Sorte + Text) aussortiert → beim Servieren überspringen? */
export function isDeactivated(kind: string, text: string): boolean {
  return DEACTIVATED_IDS.has(bausteinId(kind, text));
}
