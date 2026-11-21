# Schriften in Tastenflow - Herkunft und Lizenz

Geladen am 09.10.2026 für die Schriftwahl in Tastenflow (`src/lib/typing/schriftart.ts`).
Alle Dateien sind mit `pyftsubset` (fontTools) auf Latein samt Erweiterung A/B
und die üblichen Satzzeichen gekürzt und als WOFF2 gespeichert. Sonst ist nichts
verändert.

| Datei | Schrift | Urheber | Lizenz | Quelle |
|---|---|---|---|---|
| `atkinson-*.woff2` | Atkinson Hyperlegible | Braille Institute of America | SIL OFL 1.1 | brailleinstitute.org |
| `primae-druck-*.woff2` | Primæ (Druckschrift), Regular/Semibold/Bold | Titus Nemeth, Martin Tiefenthaler; Wiener Bildungsserver | CC BY-NC-SA 4.0 | prima.wien (Materialpaket 03.12.2025, Primæ v2.0) |
| `primae-schreib-*.woff2` | Primæ (Schreibschrift, „Cursive"), Regular/Semibold/Bold | wie oben | CC BY-NC-SA 4.0 | wie oben |
| `andika-*.woff2` | Andika | SIL International | SIL OFL 1.1 | github.com/google/fonts (ofl/andika) |
| `lexend-variabel.woff2` | Lexend | Bonnie Shaver-Troup, Thomas Jockin u. a. | SIL OFL 1.1 | github.com/google/fonts (ofl/lexend) |
| `luciole-*.woff2` | Luciole | Centre Technique Régional pour la Déficience Visuelle, typographies.fr | CC BY 4.0 | CTAN `fonts/luciole` |
| `opendyslexic-*.woff2` | OpenDyslexic | Abbie Gonzalez | SIL OFL 1.1 | github.com/antijingoist/opendyslexic |
| `mm-schuldruck-regular.woff2` | MM Schuldruck (Datei `mm.ttf`, Familienname 'AaBbCc'), Regular | Judex (2001) | keine Lizenz in der Datei; die Seite sagt: kostenlos, nur nicht kommerziell im schulischen Kontext | lehrerweb.wien/service/downloads-1 (alte Schulschriften), geladen 11.10.2026; in WOFF2 umgewandelt, nicht gekürzt, und die Umrissmaße von 4 Zeichen (`-`, `:`, `"`, ein Zusatzglyph) neu berechnet - die Datei trug falsche Maße, der Browser schnitt die Zeichen ab |
| `inclusive-sans-variabel.woff2` | Inclusive Sans | Olivia King | SIL OFL 1.1 | github.com/google/fonts (ofl/inclusivesans) |
| `atkinson-mono-variabel.woff2` | Atkinson Hyperlegible Mono (variabel, Gewicht 200-800) | The Atkinson Hyperlegible Mono Project Authors (Braille Institute of America) | SIL OFL 1.1 | github.com/google/fonts (ofl/atkinsonhyperlegiblemono, `AtkinsonHyperlegibleMono[wght].ttf`), geladen 16.10.2026; nur in WOFF2 umgewandelt (`woff2_compress`), nicht gekürzt, sonst unverändert. Nur in Plus wählbar (jedes Zeichen gleich breit). Urheberhinweis: Copyright 2020-2024 The Atkinson Hyperlegible Mono Project Authors. |
| `fredoka-variabel.ttf` | Fredoka (variabel, Breite und Gewicht 300-700) | The Fredoka Project Authors (Milena Brandão, Hafontia) | SIL OFL 1.1 | github.com/google/fonts (ofl/fredoka, `Fredoka[wdth,wght].ttf`), geladen 14.11.2026; unverändert, nicht gekürzt und nicht umgewandelt (Johannes: „Ganze Datei nehmen"). Nur für den Schriftzug „Lexami" im Startbild (`index.html`), wie im gewählten Entwurf B. Urheberhinweis: Copyright 2016 The Fredoka Project Authors. |

## Primæ - die Bedingungen

Wortlaut auf prima.wien/lizenz: *„Im Schulbereich dürfen Sie: Teilen & Bearbeiten,
mit Lizenz- und Namensnennung"*, Creative Commons BY-NC-SA 4.0; bei gewerblicher
Nutzung Anfrage an info@wienerschriften.at.

- **Namensnennung:** „Schrift: Primæ von Titus Nemeth und Martin Tiefenthaler,
  Wiener Bildungsserver, CC BY-NC-SA 4.0 via prima.wien"; die Änderung ist das
  Kürzen auf Latein und die Umwandlung in WOFF2.
- **Nicht kommerziell:** Tastenflow ist kostenlos und für Schulen gedacht.
- **Weitergabe unter gleichen Bedingungen:** gilt für die gekürzten Dateien hier.

Die Datei, die ein Kollege verlinkt hat (`DRUCKSCH_07.ttf` von lehrerweb.wien), ist die
ältere „Druckschrift95" von ice-vienna (1997): 101 Zeichen, ohne Lizenzangabe in der
Datei. Primæ ist der Nachfolger desselben Herausgebers und deckt über 200 Sprachen ab.

## MM Schuldruck - die Bedingungen (11.10.2026)

Wortlaut auf lehrerweb.wien: *„Die Schriften dürfen ausschließlich im nicht-kommerziellen,
schulischen Kontext zur pädagogischen Arbeit genutzt werden."* Weitergabe in einer App steht
dort nicht ausdrücklich. Tastenflow ist kostenlos und für Schulen; **vor einer Verbreitung
über Schulen hinaus beim Wiener Bildungsserver nachfragen.** Der Schrift fehlt `°` (kommt aus
Atkinson) und alles außerhalb des Westeuropäischen.
