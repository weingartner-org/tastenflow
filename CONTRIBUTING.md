# Mitmachen

Danke, dass Sie helfen wollen. Tastenflow wird gemeinsam in **einer** Fassung
weitergebaut, die für alle Kinder und Lehrkräfte läuft (tastenflow.org). Verbesserungen
gehören deshalb in dieses Repository und nicht in eine eigene Abspaltung: So
haben alle etwas davon, und niemand pflegt dieselbe Arbeit zweimal.

## Wie Sie mitgestalten können

- **Fehler und Wünsche** als Fehlermeldung (Issue) - auch ohne Code.
- **Inhalte**: Übungstexte, Übersetzungen, Beschreibungen.
- **Testen** mit Screenreader und Braillezeile und berichten, was Sie erleben.
- **Code** als Pull-Request (siehe unten).

**Größere Änderungen bitte zuerst als Issue besprechen**, bevor Sie viel Arbeit
hineinstecken. Wir entscheiden, was ins Hauptprojekt kommt, und sagen Ihnen
offen, wenn etwas nicht passt - zum Beispiel, weil es die Bedienung ohne Maus
bricht oder Kinder-Daten gefährdet.

Zum Mitmachen brauchen Sie keinen eigenen Server: Ausprobieren ohne Server
(siehe README) genügt. Wenn Sie eine eigene Installation betreiben möchten,
sprechen Sie uns vorher an - oft lässt sich Ihr Wunsch im Hauptprojekt lösen,
etwa als Einstellung. Eine veränderte Fassung braucht einen eigenen Namen
([NAMEN-UND-MARKEN.md](NAMEN-UND-MARKEN.md)).

## Fehler melden

Bitte als Fehlermeldung (Issue): was Sie getan haben, was passiert ist, was
Sie erwartet hätten. Dazu Browser, Betriebssystem und - wenn benutzt -
Screenreader mit Version.

**Keine Namen oder Daten von Kindern** in Fehlermeldungen.

## Code beitragen

1. Jede Änderung bleibt ohne Maus bedienbar (Tastatur, Screenreader, Braillezeile).
2. `npm run build` und `npm test` laufen fehlerfrei.
3. Echte Umlaute, nur der Bindestrich `-` (Braillezeile).
4. Texte sagen die Person zuerst („Kind mit Blindheit", nicht „blindes Kind") und
   formulieren nie etwas gegen ein Kind.
5. Jeder Commit trägt die Zeile `Signed-off-by: Name <adresse>`
   (`git commit -s`). Damit bestätigen Sie das
   [Developer Certificate of Origin](https://developercertificate.org):
   Sie dürfen den Beitrag einreichen, und er steht unter der Lizenz dieses
   Repositorys (EUPL 1.2, Inhalte CC BY-SA 4.0).

Ihre Rechte an Ihrem Beitrag behalten Sie.
