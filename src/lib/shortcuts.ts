/**
 * Gemeinsames Tastenkürzel-Konzept der Schüler-Apps (Tastenflow, Braille,
 * Hörbuch-Studio). Zwei feste Grundsätze:
 *   1. IMMER die Alt-Taste (auf dem Mac die Wahltaste ⌥). Kein Alt+Shift.
 *   2. Gleiche Funktion = gleiche Taste in ALLEN Apps.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * ⚠️⚠️ DIESE DATEI IST DAS VERZEICHNIS DER ENTSCHEIDUNGEN, NICHT DER ZUSTAND
 *      DES CODES. Stand 30.08.2026, abends.
 * ══════════════════════════════════════════════════════════════════════════
 * Was hier steht, hat Johannes entschieden und gilt plattformweit. WO es schon
 * im Code steht, ist eine andere Frage: Jede App hat ihren eigenen git-Zweig,
 * und eine Entscheidung wandert erst mit dem Zusammenführen dorthin.
 *
 * Wer eine Belegung hier liest, weiß darum noch nicht, dass sie in der App vor
 * ihm auch schon so ist. Nachsehen, nicht glauben.
 *
 * ★★ AUSNAHME VON GRUNDSATZ 1 (Johannes, 23.09.2026):
 *   Alt + Umschalt + P  Melden mit Bild - nimmt das Fenster auf und öffnet das
 *            Melde-Fenster mit dem Bild; Enter schickt ab. ✅ ÜBERALL, auf
 *            jeder Seite (hängt in `App.tsx` → `components/MeldenKuerzel.tsx`).
 *            Alt + Umschalt ist hier ABSICHT: Johannes wollte eine Taste, „die
 *            man nicht so leicht aus versehen drückt". Melden ist keine Übung
 *            und gehört darum NICHT in die Reihe der Alt-Tasten.
 *            ⚠️ Alt + P (ohne Umschalt) heisst im Mathecoach „Prüfen" - das
 *            Kürzel verschluckt seine Taste am `window`, bevor die Seite sie hört.
 *
 * Der Stand am 30.08.2026, gemessen an den Zweigen:
 *
 *   Alt + K  Farbschalter der Kopfzeile
 *            ✅ ÜBERALL. Gebaut auf `feat/tastenflow`, am 30.08.2026
 *               übernommen nach `feat/mathecoach-lehrerseite`, `feat/imgriff`,
 *               `feat/klangpunkte` und `feat/punktgenau`. Mit der Kopfzeile
 *               kommt die Taste von selbst mit - eine App muss nichts tun.
 *
 *   Alt + U  Kapitel- / Unit-Auswahl (Punktgenau, Klangpunkte)
 *            ✅ auf `feat/tastenflow`, `feat/klangpunkte` und
 *               `feat/punktgenau`.
 *            ⚠️ NICHT auf `feat/mathecoach-lehrerseite` und `feat/imgriff`:
 *               Dort haben `KlangpunktePage.tsx` und `PunktgenauPage.tsx` noch
 *               das alte Alt + K für die Kapitelwahl. Das ist KEINE Kollision -
 *               die Kopfzeile hört am `window`, hinter allen Seiten-Wächtern,
 *               und tritt zurück, wo eine Seite die Taste mit
 *               `preventDefault()` schon beansprucht hat. In diesen beiden
 *               Zweigen hat der Farbschalter für Punktgenau und Klangpunkte
 *               darum kein Kürzel; der Knopf ist da und tut dasselbe.
 *            ⚠️ In **Tastenflow** heißt Alt + U weiterhin „Zum Üben wechseln" -
 *               das ist ENTSCHIEDEN, nicht übersehen (Begründung unten).
 *
 *   Alt + 3  „Tasten erkunden"
 *            ✅ auf `feat/tastenflow` - und seit 12.09.2026 auch auf
 *               `feat/imgriff` (Johannes: „das feature ‚Tasten erkunden'
 *               ALT +3 von tastenflow soll auch hier zur verfügung stehen").
 *               Beide Apps hängen DIESELBE Komponente ein
 *               (`src/components/typing/TastenErkunden.tsx`, siehe
 *               `apps/GEMEINSAM.md`); jede behandelt die Taste in ihrer
 *               eigenen Seite. In »Im Griff« ersetzt der Modus die frühere
 *               Phase „frei erkunden" des Tasten-Dojos.
 *            ⚠️ In Punktgenau heißt Alt + 3 „Bereich Computerbraille" - eine
 *               bekannte, noch nicht entschiedene Abweichung von Grundsatz 2.
 *
 *   Alt + 4  „Tasten finden" - dasselbe Fenster, direkt im Modus Finden
 *            ✅ seit 13.09.2026 auf `feat/tastenflow`, in Tastenflow UND
 *               »Im Griff« (Johannes: „oben einen schalter mit Tasten erkunden
 *               und einen mit Tasten finden"). Im Fenster wechselt dieselbe
 *               Taste zwischen beiden Modi; Alt + 3 und zweimal Esc beenden
 *               immer. In »Im Griff« ist sie ein App-Kürzel
 *               (`istTastenFindenCode` in `useChordItem.ts`).
 *            ⚠️ In Punktgenau heißt Alt + 4 „Bereich Kurzschrift" - die zweite
 *               bekannte Abweichung dort, dieselbe Lage wie Alt + 3.
 *
 * Universeller Kern (in jeder App identisch belegt):
 *   Alt + H   Hilfe öffnen / schließen
 *   Alt + T   Tastenkürzel-Liste öffnen / schließen
 *   Alt + N   Nachrichten öffnen / schließen   (wo es Konten gibt)
 *   Alt + +   Größer (Text / Übungsfeld / Zoom)
 *   Alt + −   Kleiner
 *   Alt + V   Vorlesen / Ton an–aus            (wo es Sprachausgabe gibt)
 *   Alt + R   Rundgang / Tour                  (wo vorhanden)
 *   Alt + O   Einstellungen („Optionen") auf/zu   (wo es einen solchen Bereich
 *             gibt — bisher Tastenflow; für neue Apps reserviert, damit die
 *             Belegung nicht auseinanderläuft)
 *   Alt + K   Kontrast / Farbmodus auf/zu — der Farbschalter der Kopfzeile
 *             (Entscheidung Johannes 30.08.2026).
 *             ★★ Behandelt wird die Taste EINMAL, in
 *             `src/components/AppKopfzeile.tsx` — dort, wo der Knopf wohnt,
 *             genau wie Alt + J. Eine App, die sie selbst abfängt, löst sie
 *             doppelt aus.
 *             ★ WARUM K DIE RICHTIGE TASTE IST: Sie war es an einer Stelle
 *             schon. Das Hörbuch-Studio führte „Kontrast / Farbschema wechseln"
 *             auf Alt + K (`HoerbuchStudioPage.tsx`; seit 18.10.2026 öffnet
 *             Alt + K auch dort das Farbmenü der gemeinsamen Kopfzeile). Die Belegung
 *             erfindet also nichts, sondern räumt eine ABWEICHUNG auf: In
 *             Tastenflow saß auf Alt + K bis zum 30.08.2026 „Tasten erkunden".
 *             Der Modus zog auf Alt + 3 um - dort lag seit dem 07.08. ohnehin
 *             sein AUSGANG („eine Kombi, die beim Erkunden nie aus Versehen
 *             entsteht"), jetzt ist es auch der Eingang.
 *             ✅ ERLEDIGT am 30.08.2026: Klangpunkte und Punktgenau hatten auf
 *             Alt + K die Kapitelwahl. Johannes hat sie auf **Alt + U**
 *             umgelegt (siehe dort). Damit ist Alt + K in ALLEN Programmen der
 *             Farbschalter, ohne Ausnahme und ohne Vorbehalt.
 *   Alt + U   Kapitel- / Unit-Auswahl - die Lern-Landkarte des Programms
 *             (Entscheidung Johannes 30.08.2026).
 *             Belegt in **Punktgenau** („Zur Kapitel-Auswahl springen - dann
 *             mit Pfeil rauf/runter blättern") und in **Klangpunkte**
 *             („Kapitelwahl öffnen - alle Klangwelten und dein Sterne-Stand").
 *             Behandelt wird sie in der jeweiligen App, nicht in der Kopfzeile:
 *             Es gibt dort keinen gemeinsamen Knopf, an dem sie wohnen könnte.
 *             ★ Warum U: Der Buchstabe war in beiden Programmen frei, und er
 *             steht für die UNIT/Einheit, um die es geht. Die naheliegenden
 *             Buchstaben waren vergeben - K ist jetzt der Kontrast, L die
 *             Zeichenliste, E das Eingabefeld, M die Zeichen der Etappe.
 *             ⚠️⚠️ DER EHRLICHE PREIS, DEN JOHANNES GEKANNT UND ANGENOMMEN HAT:
 *             In **Tastenflow** heißt Alt + U seit jeher „Zum Üben wechseln
 *             (wenn angemeldet)" (`TippenTrainerPage.tsx`). Die Taste bedeutet
 *             dort also etwas anderes als in den beiden anderen Programmen -
 *             ein Verstoß gegen Grundsatz 2 dieser Datei, mit offenen Augen
 *             begangen. Der Gedanke dahinter: Beide Wege führen zur AUSWAHL
 *             dessen, was als Nächstes geübt wird; sie sind sich näher, als
 *             zwei fremde Funktionen es wären. **Tastenflows Alt + U bleibt,
 *             wie es ist.** Wer das hier später liest, soll wissen: Es ist
 *             nicht übersehen worden, es ist entschieden worden.
 *   Alt + G   Gliederung: zur nächsten Überschrift springen, zyklisch - mit
 *             eingeschaltetem Vorlesen liest die App-Stimme sie an (Wunsch
 *             Johannes 30.08.2026, „Überschriften-Sprungtaste für die
 *             Vorlese-Stimme"; das Gegenstück zur Screenreader-Taste „H").
 *             ★ Seit 11.09.2026 (Umbauplan P9a) AUCH IN MATHECOACH - der
 *             DOM-Kern wohnt jetzt geteilt in
 *             `lib/arbeitsblatt/ueberschriftSprung.ts`, Tastenflow ruft ihn
 *             von dort mit unverändertem Verhalten weiter auf.
 *             ★ Seit 12.09.2026 AUCH IN »IM GRIFF« (Johannes: „Wir brauchen
 *             auch hier die eine Tastenkombination, die zwischen
 *             Überschriften springen kann, auch wenn man keinen Screenreader
 *             verwendet"). Gemeldet wird über `sprichStatus`
 *             (`lib/computer/announce.ts`), gerollt wird wie in Mathecoach
 *             selbst in die Mitte (`mitteRollen: true`) - `fokusMitteStarten`
 *             hängt dort wie hier nur INNERHALB der Übungsfläche.
 *             `isAppShortcut` (`components/computer/useChordItem.ts`) kennt
 *             Alt + G (`APP_TASTEN`) - ein Druck in einer offenen
 *             Kürzel-Aufgabe zählt nicht als Fehlversuch.
 *             Seit 18.10.2026 auch in Punktgenau, Klangpunkte und Plus.
 *             Kein Alt + Shift + G für rückwärts - Grundsatz 1; Johannes hat
 *             nur den Sprung vorwärts beauftragt (11.09.2026). Der geteilte
 *             Kern kennt eine Rückwärts-Richtung als Parameter (kostet
 *             nichts, wird sonst nirgends benutzt), aber KEIN Empfänger ruft
 *             sie über Alt + Shift + G auf - der Kreis ist kurz genug.
 *   Alt + J   Mein Konto auf/zu — der Konto-Schalter der Kopfzeile
 *             (Wunsch Johannes 25.08.2026: „wir brauchen ein Tastenkürzel für
 *             den Accountschalter/Benutzerschalter").
 *             ★★ Behandelt wird die Taste EINMAL, in
 *             `src/components/AppKopfzeile.tsx` — dort, wo der Knopf wohnt.
 *             Eine App, die sie selbst abfängt, löst sie doppelt aus.
 *             Abgemeldet führt sie zur Anmeldung, angemeldet öffnet und
 *             schließt sie das Konto-Menü.
 *             ★ WARUM J UND NICHT DER MERKBUCHSTABE: „K" wie Konto ist in
 *             vier Programmen verschieden belegt (Kapitelwahl, Tasten
 *             erkunden, Kontrast), „A" wie Anmeldung gehört seit 24.08.2026
 *             der Angabe (siehe unten), „M" wie Mein ist die Zeichenliste,
 *             „N" die Nachrichten. Frei blieben nur G, J, Q, X, Y, C — und
 *             unter denen ist J die einzige mit einem echten Vorteil statt
 *             eines erfundenen Merksatzes:
 *               · Sie ist die GRUNDSTELLUNGSTASTE des rechten Zeigefingers —
 *                 die erste Taste, die ein Kind im Tastenflow lernt, und ohne
 *                 Handbewegung zu treffen.
 *               · Sie liegt auf QWERTZ und QWERTY an derselben Stelle (anders
 *                 als Y und Z) — und wir unterrichten beide Belegungen.
 *               · G („Geschichten"), Q („Quiz") und C („Kopieren", Strg + C
 *                 wird in »im Griff« unterrichtet) sind Anwärter für später
 *                 bzw. schon besetzte Begriffe.
 *             ⚠️ In Punktgenau ist „j" eine der sechs Braille-Tasten (Punkt 4).
 *             Das ist KEIN Zusammenstoß: Der Sechs-Tasten-Griff hört auf die
 *             blanke Taste, dieses Kürzel nur mit Alt.
 *
 * ★★★ NEU (Johannes, 01.09.2026) - DIE ERSTE PFEILTASTEN-BELEGUNG:
 *   Alt + ←   einen Zeitabschnitt zurück
 *   Alt + →   einen Zeitabschnitt vor
 *
 *             Wörtlich: *„wir brauchen keine eigenen kürzel für die reiter der
 *             tabelle, mit zeile soll man in der tabelle navigieren können wie
 *             in jeder anderen … mit alt pfeil links und rechts schaltet man
 *             die wochen vor und rückwärts."*
 *
 *             Gebaut in der Lehrkraft-Ansicht von Tastenflow (Wochen der
 *             Lernenden-Tabelle, `ZeitraumKopf.tsx`). Für jede andere App gilt
 *             sie ab sofort ebenso, wo es einen Zeitraum zum Blättern gibt.
 *
 *   ★★★ WARUM DIE BLANKE PFEILTASTE DAFÜR NICHT IN FRAGE KOMMT:
 *             In einer Tabelle gehören die Pfeiltasten der TABELLE. JAWS, NVDA
 *             und VoiceOver bewegen damit Zelle für Zelle und lesen die
 *             Spaltenüberschrift mit. Ein Kürzel auf der blanken Pfeiltaste
 *             nimmt genau diese Bewegung weg - und dasselbe gilt für den
 *             Lesemodus jeder Seite. Bis zum 01.09.2026 mittags lag das
 *             Wochen-Blättern in Tastenflow auf `←`/`→`; das ist behoben.
 *
 *   ⚠️⚠️ WAS ES KOSTET, UND ZWAR WISSENTLICH:
 *             Alt + ← ist in Chrome und Firefox unter Windows und Linux „eine
 *             Seite zurück". Die Belegung nimmt dem Browser die Taste ab
 *             (`preventDefault()`), solange der Lesepunkt in der Ansicht steht.
 *             Auf dem Mac gibt es den Zusammenstoß nicht (dort Cmd + [).
 *             ⇒ Wer die Ansicht verlassen will, nimmt die Rücktaste des
 *             Browsers oder Alt + Backspace; innerhalb der Ansicht blättert
 *             Alt + Pfeil.
 *             ★ Sollte sich das im Unterricht als Stolperstein zeigen, ist die
 *             Ausweichbelegung Alt + Bild-auf / Bild-ab - sie kollidiert mit
 *             nichts. Das ist ein VORSCHLAG, keine Entscheidung.
 *
 * ★ RESERVIERT - NICHT ANDERWEITIG VERGEBEN (Johannes, 23.08.2026):
 *   Alt + F   „Was fehlt" - die Liste der offenen Haus- und Schulübungen.
 *             Zuerst im Mathecoach-Bereich (Bauplan
 *             `Sensorik/BAUPLAN-2026-08-23-MATHECOACH.md` §8.1), danach in den
 *             übrigen Lernwerkstatt-Apps. Die Taste ist ab sofort belegt, auch
 *             wo der Schalter noch nicht gebaut ist - sonst läuft die Belegung
 *             wieder auseinander.
 *             Deshalb umbelegt: Im Hörbuch-Studio hörte die Lese-Mitverfolgung
 *             früher auf Alt + F, seit 23.08.2026 auf Alt + I.
 * ★ RESERVIERT - NICHT ANDERWEITIG VERGEBEN (Johannes, 24.08.2026, bestätigt
 *   am 25.08.2026 gegen den Konto-Schalter):
 *   Alt + A   „Zur Angabe" - HINGEHEN und Zeichen für Zeichen lesen: erst die
 *             Frage, dann die Angabe. Der Ausgang aus dem Eingabefeld, wenn ein
 *             Screenreader im Eingabemodus steht und die Pfeiltasten dem
 *             Feldinhalt gehören (§12 von
 *             `Sensorik/BAUART-ARBEITSBLATT-BARRIEREFREI.md`). Zuerst im
 *             Mathecoach gebaut; im Griff und Punktgenau ziehen nach.
 *             ⚠️ In Punktgenau und Klangpunkte hieß Alt + A bis 25.08.2026
 *             „Zur Anmeldung springen" - im angemeldeten Zustand eine
 *             Sackgasse („Du bist schon angemeldet als …"). Diese Bedeutung ist
 *             abgelöst; das Konto sitzt auf Alt + J. Entscheidung Johannes
 *             25.08.: Eine Kernfunktion beim Üben schlägt einen Schalter, den
 *             man selten braucht.
 * ★★★★ AUFGEHOBEN am 28.08.2026 - die Reservierung von Alt + L für „Lösung"
 *   (Johannes, 25.08.) hat sich als Irrtum herausgestellt und ist zurückgenommen.
 *
 *   **Johannes 28.08.: „In Tastenflow bleibt Übungsstufe, im Griff sucht neuen
 *   Buchstaben."**
 *
 *   Warum der Irrtum entstand: Am 25.08. sah es nach einer Kollision zwischen
 *   ZWEI Apps aus. Am 28.08. nachgezählt heißt Alt + L am Live-Stand aber
 *   VIER verschiedene Dinge:
 *
 *     Tastenflow      „Übungsstufe anzeigen"   ← bleibt (Entscheidung Johannes)
 *     Punktgenau      „Zeichenliste"           ┐ dieselbe Funktion in zwei Apps -
 *     Klangpunkte     „Zeichenliste"           ┘ genau so SOLL diese Datei wirken
 *     »im Griff«      „Lösung"                 ← weicht auf Alt + Q
 *     Hörbuch-Studio  „Aufnahme löschen"
 *
 *   ⚠️ Damit ist die Frage NICHT erledigt: „Übungsstufe" gegen „Zeichenliste"
 *   gegen „Löschen" stehen weiter nebeneinander. Das ist ein BEFUND, keine
 *   Entscheidung - er liegt bei Johannes.
 *
 *   ★ Was aus dem alten Eintrag gilt und darum hier bleibt: Ausdrücklich NICHT
 *   Alt + H. Die Hilfe ist in JEDER App die Hilfe; eine Taste, die in einem
 *   Programm zwei verschiedene Dinge tut, ist für ein Kind an der Braillezeile
 *   schlimmer als eine Taste mehr - es kann nicht sehen, in welchem Zustand es
 *   steht.
 *
 * ★ NEU (Johannes, 28.08.2026):
 *   Alt + Q   „Lösung" - verrät in einer Übung die gesuchte Antwort. Zuerst im
 *             Kürzel-Üben von »im Griff«.
 *             ★ Warum Q, obwohl es nichts bedeutet: Für „Lösung" ist kein
 *             Merkbuchstabe mehr frei - L, A, E, V, Z, M, R, H, T und S sind
 *             alle vergeben. Frei waren nur noch C, G, Q, X und Y. Entschieden
 *             hat dann, was »im Griff« den Kindern SELBST beibringt (gezählt in
 *             `src/`): Strg+C 87× · Strg+X 41× · Strg+Y 13× · Strg+G 11× ·
 *             Strg+Q 1× (und das nur in einem Code-Vermerk über Outlook).
 *             „Strg + C kopieren" und „Alt + C Lösung" auf demselben Bildschirm
 *             wäre genau die Verwechslung, die diese Datei verhindern soll.
 *             Q ist der einzige freie Buchstabe ohne diese Last - und er liegt
 *             auf QWERTZ und QWERTY an derselben Stelle (anders als Y und Z).
 *
 * ★ RESERVIERT - NICHT ANDERWEITIG VERGEBEN (Johannes, 28.08.2026):
 *   Alt + C   „Weiter" - der Schritt zur nächsten Aufgabe, zur nächsten Frage,
 *             zum nächsten Blatt. In JEDER App dieselbe Taste.
 *
 *             ⚠️ WARUM AUSGERECHNET C, das nichts bedeutet: Weil keine Taste
 *             mit deutschem Merkwert frei war. Gemessen am 28.08.2026 über die
 *             ganze Plattform:
 *               „Weiter"   -> Alt+W ist WIEDERHOLEN (Punktgenau, Klangpunkte,
 *                             Tippen - dort sagt es die Aufgabe erneut an)
 *               „Nächste"  -> Alt+N ist NACHRICHTEN (überall, wo es Konten gibt)
 *               „Fortfahren" -> Alt+F ist „WAS FEHLT" (reserviert 23.08.)
 *             Nirgends belegt waren nur C, J, Q, X und Y.
 *
 *             ⚠️ Alt+Y kam nicht in Frage: Y und Z liegen auf deutschen und
 *             amerikanischen Tastaturen VERTAUSCHT. Ein Kind, das an der
 *             Schule ein anderes Gerät bekommt, griffe ins Leere - und könnte
 *             es nicht sehen.
 *             (18.10.2026: X und Y sind seither im Hörbuch-Studio vergeben -
 *             Alt + X Vorhören, Alt + Y Speichern; Y wird dort nach dem
 *             AUFDRUCK erkannt, `istAltBuchstabe` in `lib/altTaste.ts`.)
 *
 *             ⚠️ C liegt auf JEDER Belegung an derselben Stelle: untere Reihe,
 *             dritte Taste von links. Wer sie blind sucht, findet sie von der
 *             linken Hand aus in einem Griff.
 *
 *             Die Taste steht als EINE Konstante hier - wer sie ändern will,
 *             ändert sie an dieser Stelle und nirgends sonst.
 *
 * ★ DIE EINE TASTE OHNE ALT (Johannes, 04.09.2026): *„egal an welcher Stelle
 *   gelesen wird, mit Strg muss es sofort leise werden"* - danach: *„mach das
 *   auch für die anderen Apps."*
 *
 *   Strg     Sofort still: die laufende Ansage endet. Das Vorlesen bleibt an.
 *            ✅ Tastenflow, Punktgenau, Klangpunkte, »im Griff« (04.09.2026,
 *               gebaut auf `feat/tastenflow`, dort gemessen).
 *
 *            ⚠️ Sie steht bewusst NICHT in {@link UNIVERSAL_SHORTCUTS}: Die
 *            Liste dort erscheint in JEDER App, auch in Mathecoach, das gar
 *            nichts vorliest. Ein beworbenes Kürzel ohne Funktion wirkt für ein
 *            Kind mit Blindheit wie eine kaputte App. Genannt wird die Taste
 *            deshalb in den Listen der Programme, die sprechen können - in
 *            »im Griff« sogar nur dann, wenn das Gerät wirklich eine deutsche
 *            Stimme hat.
 *
 *            ⚠️ Der Grundsatz oben („IMMER die Alt-Taste") gilt weiter. Diese
 *            Taste ist die Ausnahme, und sie ist keine Erfindung von uns: Strg
 *            ist die Stumm-Geste von JAWS, NVDA und VoiceOver. Eine eigene
 *            Alt-Belegung dafür hiesse, gegen das zu lehren, was ein Kind
 *            ausserhalb unserer Programme braucht.
 *
 *            Die Regel selbst steht einmal in `src/lib/stummTaste.ts`; die drei
 *            Vorlese-Motoren sagen nur, was bei ihnen „still" heisst.
 *
 * App-spezifische Funktionen verwenden zusätzlich klare Alt-Merktasten; ihre
 * Belegung steht in der jeweiligen Tastenkürzel-Liste der App.
 */

/** Der überall identische Kern — für die Anzeige in jeder Tastenkürzel-Liste. */
export const UNIVERSAL_SHORTCUTS: [string, string][] = [
  ["Alt + H", "Hilfe öffnen / schließen"],
  ["Alt + T", "Tastenkürzel-Liste öffnen / schließen"],
  ["Alt + N", "Nachrichten öffnen / schließen (wenn angemeldet)"],
  ["Alt + J", "Mein Konto öffnen / schließen (Anmelden, Statistik, Abmelden)"],
  // ★ 31.08.2026, Entscheidung Johannes: Alt + K gehört hierher, weil es seit
  // dem 30.08. in JEDEM Programm dasselbe tut - behandelt wird es einmal, in
  // AppKopfzeile.tsx, wo der Farbschalter wohnt. Es stand bis dahin nur in den
  // Listen von Tastenflow und Hörbuch-Studio; »im Griff«, Mathecoach,
  // Punktgenau und Klangpunkte nannten die Taste nicht. Eine Taste, die wirkt
  // und nirgends steht, findet ein Kind mit Blindheit nicht.
  ["Alt + K", "Farben und Kontrast öffnen / schließen"],
  ["Alt + +", "Größer (Text / Übungsfeld / Zoom)"],
  ["Alt + −", "Kleiner"],
  // ★ 18.10.2026 (Johannes, Vergleich der Kürzel aller Lern-Apps, Vorschlag 5):
  // Alt + 0 gab es nur in Plus - jetzt überall.
  ["Alt + 0", "Normale Größe"],
  // ★ 18.10.2026 (Vorschlag 7): wirkt seit dem 23.09. auf JEDER Seite, stand
  // aber in keiner Liste. Die Ausnahme von Grundsatz 1 ist Absicht (s. o.).
  ["Alt + Umschalt + P", "Fehler melden - mit einem Bild des Fensters"],
];

/**
 * ★★ DER GEMEINSAME WORTLAUT der Kürzel, die nur Apps mit dieser Funktion
 * haben (Johannes, 18.10.2026: „die Tastenkürzel sollen möglichst einheitlich
 * bei allen Lern-Apps sein"). Wer eines davon in seine Liste schreibt, nimmt
 * den Text von hier - dieselbe Taste heißt dann überall gleich.
 *
 * Sie stehen NICHT in {@link UNIVERSAL_SHORTCUTS}: Ein Kürzel, das in einer
 * App nichts tut, darf in deren Liste nicht stehen (Tiefentest 10.07.).
 */
export const GEMEINSAME_KUERZEL = {
  einstellungen: ["Alt + O", "Einstellungen öffnen / schließen"],
  vorlesen: ["Alt + V", "Vorlesen an / aus"],
  nochmal: ["Alt + W", "Die Aufgabe noch einmal ansagen"],
  eingabefeld: ["Alt + E", "Ins Eingabefeld"],
  ueberschrift: ["Alt + G", "Zur nächsten Überschrift"],
  statistik: ["Alt + S", "Meine Statistik (Lehrkräfte: Meine Klassen)"],
  umschaltZweimal: ["Umschalt zweimal", "Die Aufgabe noch einmal ansagen - wie Alt + W"],
  stand: ["Alt + Z", "Sagen, wo du gerade bist (Aufgabe, Zeile oder Runde)"],
  still: ["Strg", "Sofort still: die laufende Ansage endet. Das Vorlesen bleibt an"],
  zumFeld: ["Esc", "Fenster schließen - zurück ins Eingabefeld"],
} as const satisfies Record<string, readonly [string, string]>;

/** Alt + 0 - normale Größe. Über `e.code`: am Mac liefert die Wahltaste ein „º". */
export function istNormalgroesseTaste(e: KeyboardEvent): boolean {
  // Ohne Umschalt: Alt + Umschalt + 0 ist in »Im Griff« Lernstoff (Excel AutoSumme) -
  // gefunden am 18.10.2026, als die Taste in alle Apps kam.
  return e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey && (e.code === "Digit0" || e.code === "Numpad0");
}

/**
 * Erkennt Alt+Plus / Alt+Minus zuverlässig — auch auf dem Mac, wo die
 * Wahltaste (Option) bei „+"/„−" ein anderes `e.key` erzeugt, sodass zusätzlich
 * die physischen `e.code` der QWERTZ-Tasten und der Ziffernblock geprüft werden.
 * Liefert "in" (größer), "out" (kleiner) oder null (keine Zoom-Taste).
 */
export function zoomKeyDirection(e: KeyboardEvent): "in" | "out" | null {
  if (!e.altKey || e.ctrlKey || e.metaKey) return null;
  if (e.key === "+") return "in";
  if (e.key === "-") return "out";
  switch (e.code) {
    case "Equal":
    case "NumpadAdd":
    case "BracketRight": // QWERTZ-„+"
      return "in";
    case "Minus":
    case "NumpadSubtract":
    case "Slash": // QWERTZ-„−"
      return "out";
    default:
      return null;
  }
}


/**
 * ★★★★ „WEITER" - die eine Taste für den Schritt nach vorn (Johannes, 28.08.2026:
 * „wir brauchen eine Tastenkombination für den ‚weiter'-Schalter in allen Apps").
 *
 * ⚠️ SIE STEHT NUR HIER. Jede App liest die Konstante, keine schreibt „c" in
 * ihren eigenen Tastenwächter - sonst läuft die Belegung wieder auseinander,
 * und genau das ist der Grund, warum es diese Datei gibt.
 */
export const WEITER_TASTE = "c";
export const WEITER_KUERZEL = "Alt + C";

/**
 * Hört auf Alt+C und ruft `weiter`, wenn es gerade etwas zu tun gibt.
 *
 * ⚠️ NICHT AUS EINEM TEXTFELD HERAUS - dort tippt jemand gerade, und in manchen
 * Belegungen ist Alt+Buchstabe ein Sonderzeichen (auf dem Mac ⌥C = ç). Wer
 * schreibt, soll schreiben können.
 *
 * ⚠️ `weiter` darf `null` sein: Wo es gerade nicht weitergeht, tut die Taste
 * NICHTS - sie darf nicht raten. Eine Taste, die manchmal etwas anderes tut, ist
 * für ein Kind an der Braillezeile schlimmer als eine, die schweigt.
 */
export function hoertAufWeiter(weiter: (() => void) | null | undefined): () => void {
  const auf = (e: KeyboardEvent) => {
    if (!e.altKey || e.ctrlKey || e.metaKey) return;
    // Am Mac macht die Wahltaste aus C ein „ç" - darum auch die Lage der Taste
    // (18.10.2026: Alt + C war am Mac tot).
    if (e.key.toLowerCase() !== WEITER_TASTE && e.code !== "KeyC") return;
    const z = e.target as HTMLElement | null;
    if (z && (z.tagName === "TEXTAREA" || z.tagName === "INPUT" || z.isContentEditable)) return;
    if (!weiter) return;
    e.preventDefault();
    weiter();
  };
  window.addEventListener("keydown", auf);
  return () => window.removeEventListener("keydown", auf);
}
