# Tastenflow - Zehnfingersystem lernen

Tastenflow bringt Kindern und Jugendlichen das Zehnfingersystem bei - mit und
ohne Sehbeeinträchtigung. Alles ist mit der Tastatur bedienbar und mit
Screenreader und Braillezeile geprüft. Eine Lehrkraft legt eine Klasse an,
die Kinder melden sich mit Klassencode, Namen und Passwort an und üben.

Das Paket enthält:

- die App mit allen Übungen, Spielen und Klängen,
- Anmeldung, Lehrkraft-Konten und Kinder-Konten,
- „Meine Klasse": Klassen, Kinder, Co-Lehrkräfte, Lernstand, Klassenmatch,
  Schreibproben,
- die Schnittstelle zu [PocketBase](https://pocketbase.io): Sammlungen
  (`pocketbase/setup.mjs`) und Server-Regeln (`pocketbase/pb_hooks/`).

Sie ist ein eigenständiger Auszug aus der Lernplattform, in der Tastenflow
entsteht. Die anderen Programme der Plattform sind nicht Teil dieses Pakets.

## Ausprobieren (ohne Server)

```bash
npm ci
cp .env.example .env    # VITE_BACKEND=mock: Daten bleiben im Browser
npm run dev
```

Der Trainer öffnet sich auf der Startseite. Die Klassenverwaltung liegt unter
`/meine-klasse`.

## Mit eigenem PocketBase

Entwickelt und betrieben wird Tastenflow mit **PocketBase 0.38** (die Server-Regeln
sind JavaScript für PocketBase und nutzen dessen Hook-Schnittstelle). Neuere Versionen
bitte zuerst ausprobieren.

1. PocketBase herunterladen, starten, ein Superuser-Konto anlegen.
2. Server-Regeln einbinden: den Ordner `pocketbase/pb_hooks/` als
   `pb_hooks` der PocketBase verwenden (`pocketbase serve --hooksDir pocketbase/pb_hooks`).
3. Sammlungen anlegen. Das Skript ist wiederholbar:
   ```bash
   PB_URL=http://127.0.0.1:8090 PB_SU_EMAIL=<superuser> PB_SU_PASS=<passwort> node pocketbase/setup.mjs
   ```
   Gegen einen entfernten Server verweigert das Skript die eingebauten
   Entwickler-Zugangsdaten - eigene Werte setzen.
4. In den PocketBase-Einstellungen: **Application URL** (die Adresse, unter der
   die App läuft - Links in Mails zeigen darauf), **Mail-Server und Absender**
   (für Bestätigung, „Passwort vergessen" und Einladungen).
5. Für die Kinder-Passwörter, die die Lehrkraft in der Liste sieht, braucht der
   Dienst einen Schlüssel in seiner Umgebung (32 Zeichen, zum Beispiel
   `openssl rand -hex 16`):
   `TT_PASSWORT_SCHLUESSEL=...`. Er liegt nie in der Datenbank.
6. Die App bauen und ausliefern:
   ```bash
   cp .env.example .env.production   # VITE_BACKEND=pocketbase, VITE_POCKETBASE_URL=<Adresse der PocketBase>
   npm run build                     # Ergebnis: dist/
   ```
   `dist/` kann jeder Webserver ausliefern, der unbekannte Pfade auf
   `index.html` umleitet (Einzelseiten-App).

Danach: als Lehrkraft ein Konto anlegen (Anmeldefenster im Trainer), die
Adresse in der Bestätigungs-Mail öffnen, in „Meine Klasse" eine Klasse
anlegen, Kinder eintragen - die Kinder melden sich mit dem Klassencode an.

### Was die Server-Seite mitbringt

- **Sammlungen** (18): `tt_teachers`, `tt_class_teachers`, `tt_class_teacher_invites`,
  `tt_classes`, `tt_pupils`, `tt_progress`, `tt_events`, `lw_progress`, `lw_events`,
  `lw_messages`, `tt_schreibproben`, `tt_eigene_texte`, `tt_meine_texte`, `tt_matches`,
  `tt_match_stand`, `tt_match_verlauf`, `appSettings`, `mail_bremse`.
- **Server-Regeln**: Klassen und Kinder (Grenzen, Verschieben, Klassencode ändern),
  Co-Lehrkräfte, Klassenmatch, Schutz geschützter Felder, verschlüsselte
  Kinder-Passwörter, selbstlernende Konten, Konto-Mails in der Sprache des
  Kontos, Mail-Bremse. Warum jede Datei nötig ist, steht in
  `oeffentlich/pakete/tastenflow.mjs` des Ursprungs-Repositorys und im Kopf jeder Datei.

### Was bewusst fehlt

Wochenberichte und Erinnerungs-Mails, Meldefenster an die Entwicklung,
Spendenseite, Statistik und Verwaltung der Gesamtplattform, die Kürzel-Beschreibungen
des Programms „Tasten erkunden" (die Tasten werden benannt, die Wirkung von
Kombinationen nicht), Stimmen der Höhlenwesen und Tiere (sie waren mit
Sprachausgabe von Apple erzeugt), zwei Belohnungsklänge (Lizenz erlaubt keine
Weitergabe), die Schrift „MM Schuldruck" und die Podcasts (Tondateien, die nicht im
Repository liegen). Ohne diese Dateien spielt Tastenflow erzeugte Klänge, wählt eine
andere Schrift, und die Podcast-Karten bleiben ohne Ton.

**Impressum, Datenschutz und Barrierefreiheit** sind Platzhalter
(`src/features/legal/`): Wer die App betreibt, trägt dort die eigenen Angaben ein.

## Prüfen

```bash
npm run build   # Typ-Check, Prüfung der Übungstexte und Bau
npm test
```

## Lizenz

- **Code:** EUPL 1.2 (`LICENSE`).
- **Texte, Übungen und Bilder des Projekts:** CC BY-SA 4.0 (`LICENSES/CC-BY-SA-4.0.txt`).
- **Fremde Teile** behalten ihre Lizenz: Abzeichen-Bilder (Fluent Emoji, MIT),
  Schriften (SIL OFL, Luciole CC BY 4.0, **Primæ CC BY-NC-SA 4.0 - nur nicht
  kommerziell**), Klänge (freesound CC0, Instrumenten-Aufnahmen der University
  of Iowa). Welche Datei welche Lizenz hat, steht in `REUSE.toml` und
  `public/fonts/SCHRIFTEN-LIZENZEN.md`.
- **Namen und Logos** sind nicht freigegeben: [NAMEN-UND-MARKEN.md](NAMEN-UND-MARKEN.md).

## Mitmachen

Siehe [CONTRIBUTING.md](CONTRIBUTING.md).

---

## English

Tastenflow teaches touch typing (ten-finger system) to children with and
without visual impairment. It is fully keyboard operable and tested with
screen readers and braille displays. Teachers create classes, children sign in
with a class code, a name and a password.

This repository contains the app (exercises, games, sounds), accounts for
teachers and children, the class management ("Meine Klasse") and the
[PocketBase](https://pocketbase.io) backend (`pocketbase/setup.mjs` creates the
collections, `pocketbase/pb_hooks/` holds the server rules).

**Try it without a server:** `npm ci`, copy `.env.example` to `.env`
(`VITE_BACKEND=mock`), `npm run dev`.

**With your own PocketBase (developed and operated with 0.38):** run PocketBase with
`--hooksDir pocketbase/pb_hooks`, run `node pocketbase/setup.mjs` with your
superuser credentials (`PB_URL`, `PB_SU_EMAIL`, `PB_SU_PASS`), set the
application URL and mail settings in PocketBase, set `TT_PASSWORT_SCHLUESSEL`
(32 characters) in the service environment, then build with
`VITE_BACKEND=pocketbase` and `VITE_POCKETBASE_URL=<your server>`.

Imprint, privacy notice and accessibility statement are placeholders - the
operator fills them in (`src/features/legal/`). Code: EUPL-1.2. Project
content: CC BY-SA 4.0. Third-party parts keep their licenses (`REUSE.toml`);
the Primæ typeface is CC BY-NC-SA (non-commercial only). The names and logos
are not licensed - see NAMEN-UND-MARKEN.md.
