# Polar-Expedition — Klang-Nachweise

Alle Umgebungs-/Effekt-Samples stammen von **freesound.org** unter **CC0** (Public
Domain, keine Namensnennung nötig — hier dennoch für die Rückverfolgbarkeit). Die
Stimmen sind mit der macOS-Sprachausgabe (`say`) erzeugt und mit `ffmpeg`
verfremdet (`scripts/expedition-voices.mjs`).

## Samples (freesound, CC0)

| Datei | Klang | freesound-ID | Verarbeitung |
|---|---|---|---|
| `meer.m4a` | Meeresrauschen & Möwen (Atmosphäre-Loop, Packeis) | 518637 | Schnitt/Fade → mono AAC 56k, 25 s |
| `eisknacken.m4a` | durchgehendes Eisknacken (Spannungs-Loop; Rate+Gain moduliert = Countdown) | 737896 | Schnitt → mono AAC 56k, 22 s |
| `blubbern.m4a` | Blubbern/Untergehen (Scheitern) | 554073 | Schnitt → mono AAC 60k, 10 s |
| `platsch.m4a` | Platscher (Scheitern) | 442773 | Schnitt → mono AAC 64k, 2,2 s |
| `bergwind.m4a` | Bergwind (Atmosphäre-Loop, Steilwand & Nacht-Rutsche) | 117136 | Schnitt/Fade → mono AAC, Preview |
| `steinschlag.m4a` | Steinschlag/Felsrutsch (Steilwand: Zögern leise, Absturz laut) | 608957 | Schnitt → mono AAC, Preview |
| `sturm.m4a` | Schneesturm (Atmosphäre-Loop, Schneesturm-Zone; Böen per Gain-Automation) | 505999 | Schnitt → mono AAC 64k, 25 s, Preview |

## Stimmen (macOS `say` + ffmpeg, gerendert)

| Ordner | Stimme | Basis | Verfremdung |
|---|---|---|---|
| `voices/fisch/` | Fischstimme (hell & verständlich, Johannes 12.07. abgenommen) | `say -v "Anna (Premium)" -r 82` je Lautname (Aussprache-Fix beh/deh/cee/eff/emm/enn/err/geh/peh/teh/weh/zett) | `rubberband pitch 1.18, formant=preserved, Präsenz-EQ, kein Vibrato` |
| `voices/monster/` | Monster „Variante D" (E4, Johannes 13.07. abgenommen) | `say -v "Markus (Enhanced)" -r 150` (Raunen `-r 85`) | `rubberband pitch 0.92 formant=preserved`, Präsenz-EQ, `loudnorm I=-16`; Raunen als eigene Datei (Bauplan §6.3) |

## Stand E9 (Audio-Feinschliff) — Lautheit angeglichen

**Lautheits-Angleichung erledigt** (`node scripts/expedition-normalize.mjs --write`,
13.07.): alle sieben Umgebungs-/Effekt-Samples auf einen gemeinsamen Zielpegel
(Median-RMS = `bergwind`, −20,4 dBFS) gebracht. Skript-Report:

- **Ambience-Loops** (meer, eisknacken, bergwind, sturm — laufen über EINEN
  gemeinsamen `baseGain` in `audio.ts`): RMS-Spanne **0,13 dB** (vorher 16 dB) → ✓ < 1 dB.
- **One-Shots** (blubbern, platsch, steinschlag — transiente Effekte, Lautheit
  peak-getrieben): auf den Peak-Deckel −1,5 dBFS gebracht, Peak-Spanne **0,40 dB** → ✓ < 1 dB.

Die Referenzzone (`bergwind`) bleibt dabei unverändert; nur die Ausreißer wandern
zur Mitte (`meer` war ~12 dB zu leise, `sturm`/`platsch` zu laut), darum bleiben die
festen Rollen-Gains in `audio.ts` gültig (kein Re-Tuning nötig). Ducking (−8 dB der
Atmo während der Ansage) liegt in `audio.ts` (`ambienceDuckTimer`).

### Noch OFFEN (braucht Johannes / echtes Gerät — nicht raten):
- **Voll-Qualität-Beschaffung** der Loops direkt von freesound (HQ, Login nötig; IDs
  oben). Die aktuellen Fassungen sind die zugeschnittenen Preview-Downloads —
  klanglich korrekt gewählt und jetzt lautheitsgeglichen, aber nicht Studio-HQ.
- **Noch nicht beschaffte Samples** (Bauplan §6.2): Rutsch-Wusch, Absturz-„Aaah"
  (comic), einzelne Möwenrufe → laufen derzeit über den **synthetischen Fallback**
  in `audio.ts` (`playSlideWush`/`playFall`) — spielbar, kein Blocker.
- **Live-Synthese bleibt** (bewusst, Bauplan §6.2): Höhlen-Atmo + Polarlicht-Pad
  (kein Sample).
- **iPad-Gegentest am Prod-Build** (K28) — nur auf echtem Gerät möglich.
