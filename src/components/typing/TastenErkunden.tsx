/**
 * Tastenflow — „Tasten erkunden" (Alt + 3), Wunsch Johannes 07.08.2026:
 * „eine tastenkombination zum Tasten erkunden … und dann wird jede Taste die
 * gedrückt wird angesagt und geschrieben, auch alle sondertasten. Raus kommt
 * man wieder mit ALT+3 oder Browser schließen und neu starten (wichtig wenn es
 * aus versehen passiert und man weiß nicht wie man wieder raus kommt)."
 *
 * Ein Vollbild-Modus zum freien Ertasten der Tastatur: Jede gedrückte Taste
 * wird GROSS angezeigt und angesagt.
 *
 * ★★ SEIT 12.09.2026 GEMEINSAM MIT »IM GRIFF« (Johannes: „das feature ‚Tasten
 * erkunden' ALT +3 von tastenflow soll auch hier zur verfügung stehen").
 * `ComputerTrainerPage.tsx` hängt dieselbe Komponente ein und übergibt
 * wahlweise Optionen (`TastenErkundenProps`): eigene Kürzel zum Durchreichen,
 * eigene Stimme, eigene Plattform, eigenes Fokus-Ziel, keine Finger-Farben.
 * Ohne Angabe bleibt alles wie in Tastenflow. ⚠️ Wer hier etwas ändert, ändert
 * beide Apps - `apps/GEMEINSAM.md`. Die gemessenen Teile (Feld statt
 * Live-Bereich, Schreibmarken-Umweg, `data-kuerzel`, Alt + 3 zum Schließen)
 * bleiben, wie sie sind.
 *
 * ── ★★ 13.09.2026: ZWEI MODI - „Tasten erkunden" und „Tasten finden" ──────
 * Johannes: „kannst du in dieses fenster etwas einbauen dass du schon gebaut
 * hast, oben einen schalter mit Tasten erkunden und einen mit Tasten finden."
 * „Schon gebaut" ist die Suchrunde des Tasten-Dojos von »Im Griff«: Eine Taste
 * wird genannt, der erste Treffer heißt „Gefunden! Drück eine andere Taste, dann noch
 * einmal …", erst der zweite zählt (nach einer anderen Taste dazwischen), dann kommt die nächste. Kein Tadel. Die Schritte kommen aus
 * `lib/computer/tastenSuche.ts` - DERSELBEN Funktion, die der Dojo benutzt -,
 * die Tasten aus `suchbareTasten(plattform)` (fn fällt heraus).
 *  · Oben neben dem Titel zwei schlanke Umschalter (`aria-pressed`, 36 px über
 *    `.bedien-schlank`, Hinweis als `Tipp`, kein `title`). Ein Klick bringt
 *    den Fokus sofort zurück ins Feld - sonst wäre die nächste Taste weg.
 *  · **Alt + 4** wechselt im Fenster zwischen beiden (über `event.code`, am Mac
 *    liefert Option + 4 ein Zeichen). Von außen öffnet Alt + 4 das Fenster
 *    direkt in „Tasten finden" (`startModus`, die Seiten reichen es herein).
 *  · **Alt + 3 und zweimal Esc beenden IMMER**, in beiden Modi.
 *  · Im Modus Finden bleibt alles, was gemessen ist: dieselbe Zeile im Feld,
 *    derselbe Schreibmarken-Umweg, kein Live-Bereich. Die Bildschirmtastatur
 *    markiert weiter die GEDRÜCKTE Taste - nie die gesuchte, die zu finden ist
 *    die Aufgabe. Geschluckt wird wie beim Erkunden; F-Tasten und die Kürzel
 *    der Seite laufen durch. Der Erfolgston wie im Dojo (`playSuccessSound`
 *    achtet „Ton aus").
 *  · Wird die Esc-Taste gesucht, beißen sich Aufgabe und Ausweg: Der zweite
 *    Druck binnen zwei Sekunden beendet das Fenster. Der erste Treffer sagt
 *    darum, dass man kurz warten muss (`FINDEN_ESC_WARTEN`).
 *  · Am Ende: „Alle N Tasten gefunden. Stark!" und die Wahl - noch einmal mit
 *    der Eingabetaste (oder dem Schalter), zurück zum Erkunden mit Alt + 4.
 *    ★ 23.09.2026 (Johannes: „halte dich kürzer"): die Sätze der Suchrunde
 *    nennen ab dann nur noch die Kurzform der Taste, nie mehr Artikel und
 *    Langname zugleich - `tastenNennungKurz()` in `tastenNamen.ts`.
 *
 * ★ 12.09.2026 (Johannes): Zu jeder Taste kommt zuerst die Abkürzung, dann der
 * Name, dann was sie tut - das Wichtigste zuerst, in einfacher Sprache:
 * „Tab - Tabulatortaste - springt von Element zu Element …". Die Sätze stehen
 * in `lib/typing/tastenErklaerung.ts`; welche Sondertaste es war, erkennt das
 * Tasten-Wörterbuch von »im Griff« (`tastenNamen.ts`).
 *
 * ── ★★★★★ DIE ZEILE STEHT IN EINEM FELD, NICHT IN EINEM LIVE-BEREICH ────────
 * Johannes, 12.09.2026: „wenn man die taste drückt soll die antwort auf der
 * zeile so lange bleiben bis man eine andere taste drückt, und man soll auch
 * mit der Braillezeile navigieren können (mehr wie 40 Zeichen)".
 *
 * Bis dahin stand die Zeile in einem `aria-live`-Bereich. NVDA und JAWS zeigen
 * so etwas als BLITZMELDUNG (etwa 4 s, danach springt die Zeile zurück;
 * UEBERGABE-2026-09-09-DIE-BRAILLEZEILE-BLEIBT-RUHIG §1). Jetzt steht sie im
 * Wert eines `<textarea rows={1} wrap="off">`, das den Fokus hat - dieselbe
 * Bauart wie das Übungsfeld (BEFUND-2026-09-10-BRAILLEZEILE-OHNE-KONTEXT.md):
 *  · ein MEHRZEILIGES Feld setzt NVDA hart links an die Zeile, ohne Kontext
 *    davor;
 *  · der Inhalt bleibt, bis sich der Wert ändert - also bis zur nächsten Taste;
 *  · `wrap="off"` hält die Erklärung auf EINER Zeile: Mit den Blättertasten der
 *    Braillezeile liest ein Kind sie über die 40 Zellen hinaus zu Ende;
 *  · die Schreibmarke steht nach jeder Taste auf Zelle 1, damit die Zeile
 *    vorne beginnt.
 * Das Feld ist für Sehende unsichtbar (`sr-only`); ihnen zeigt das Popup
 * darüber dieselben Wörter (Johannes 12.09.: „für sehende soll diese ausgabe
 * als Popup-Fenster erscheinen und sie können lesen was blinde auf die zeile
 * bekommen"). Das Popup ist `aria-hidden` - sonst stünde die Zeile doppelt.
 * Gemessen mit echtem NVDA: `pruefstand/nvda/erkunden-braille-lauf.mts`
 * (Protokoll `pruefstand/protokolle/erkunden-braille-nachher-3.txt`).
 *
 * ★ 12.09.2026 (Johannes): „die tastatur … lass bitte eingeblendet und markiere
 * die taste die gerade gedruckt wurde". Die Bildschirmtastatur des Trainers
 * steht darunter, immer offen (`immerOffen`, der gemerkte Ein/Aus-Zustand des
 * Übungsfelds bleibt unberührt), und markiert die physische Taste des letzten
 * Drucks (`gedrueckt`, nach `event.code`). Beim Erkunden ist jede Taste
 * „freigeschaltet" - nichts wird blass gezeichnet.
 *
 * ── ★★ Die Tastaturfalle, und warum sie hier erlaubt ist ────────────────────
 * Tab und die anderen Sondertasten sind hier LERNSTOFF und werden geschluckt —
 * sonst spränge der Fokus davon, während ein Kind die Tabulatortaste ertastet.
 * WCAG 2.1.2 erlaubt das, wenn ein Ausweg besteht UND angesagt wird (gleiche
 * Begründung wie im Explorier-Modus von »im Griff«, TastenDojo.tsx). Auswege:
 *  · **Alt + 3** (Johannes' Wunsch). ★ Seit 30.08.2026 ist dieselbe Taste auch
 *    der EINGANG (vorher Alt + K, heute plattformweit der Farbschalter).
 *  · **zweimal Esc** (Konsistenz mit »im Griff«; einmal Esc sagt den Namen der
 *    Esc-Taste an, erst der zweite Druck binnen zwei Sekunden steigt aus),
 *  · Neuladen: Der Modus wird NIE gespeichert (Johannes' Notausgang). ★ Seit
 *    27.10.2026 schluckt das Fenster F5 (Testerin 24.10.: wer F5 erkunden will,
 *    flog hinaus) - neu laden geht weiter über den Browser selbst.
 * Der Hinweis steht dauerhaft auf dem Schirm und wird beim Betreten angesagt.
 * ⚠️ Die zwei Schalter oben sind mit der Tastatur NICHT erreichbar (Tab ist
 * Lernstoff) - darum nennt die Begrüßung Alt + 4, und der Hinweis unten auch.
 *
 * ── ★★★ TASTENKOMBINATIONEN SIND LERNSTOFF (Johannes 12.09.2026) ───────────
 * „tastenkombinationen funktionieren nicht, du kennst von im Griff die tasten
 * die durchgereicht werden". Bis dahin liefen alle Kombinationen still zur
 * Seite durch. Jetzt gilt dieselbe Regel wie im Explorier-Modus von »im
 * Griff« (`isAppShortcut` in useChordItem.ts): NUR die eigenen Kürzel der App
 * werden durchgereicht - hier die von Tastenflow (`gehoertDerSeite` in
 * tastenErklaerung.ts, ein Wächter hält die Liste gegen die Seite). Jede
 * andere Kombination wird angesagt, samt dem, was sie laut Kürzel-Katalog von
 * »im Griff« tut („Strg + C - Tastenkombination - kopieren."). F-Tasten allein
 * werden seit 28.09.2026 angesagt UND geschluckt - seit 27.10.2026 auch F5
 * (vorher der dritte Ausweg). Das Feld trägt
 * `data-kuerzel="an"`: Die Kürzel-Wächter der Seite und der Kopfzeile lassen
 * Alt-Kombinationen aus Textfeldern sonst nicht durch.
 *
 * ★ AltGr ist KEINE Kombination, sondern der dritte Layer (€ @ { [ \ | ~ ²).
 * Unter Windows meldet der Browser AltGr als Strg + Alt; erkannt wird sie über
 * `getModifierState("AltGraph")`. Am Mac liegt der dritte Layer auf der
 * Wahltaste (Option + L = @) - das entscheidet `erkundeTaste`.
 *
 * ★ 12.09.2026 (Johannes): „wenn vorlesen aus ist dann lies auch beim tasten
 * erkunden nicht vor". Gesprochen wird darum über `speakUi`, das den
 * Vorlesen-Schalter achtet. Die Braillezeile und das Popup bekommen die Zeile
 * trotzdem immer.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Tipp } from "@/components/Tipp";
import { useTastaturArt } from "@/components/computer/useTastaturArt";
import { aktiveTastaturArt } from "@/lib/computer/tastaturArt";
import { useContrast } from "@/lib/contrast";
import type { KeyEventLike } from "@/lib/computer/chord";
import type { Plattform } from "@/lib/computer/model";
import {
  suchbareTasten,
  tasteFuerEreignis,
  tasteMitId,
  tastenNennungKurz,
} from "@/lib/computer/tastenNamen";
import type { TastenName } from "@/lib/computer/tastenNamen";
import { suchSchritt } from "@/lib/computer/tastenSuche";
import { erkundeTaste, gehoertDerSeite } from "@/lib/typing/tastenErklaerung";
import { ladeKuerzelKatalog } from "@/lib/typing/kuerzelKatalog";
import {
  findenAuftrag,
  findenAuftragKurz,
  findenGefunden,
  findenSchritt,
  findenZiele,
  seitenSatz,
  type FindenAuswahl,
  type FindenZiel,
  type Seite,
} from "@/lib/typing/findenRunde";
import {
  baueFragen,
  istPruefungsTaste,
  neuerStand,
  pruefSchritt,
  pruefungGibtEs,
  pruefungHinweis,
  pruefungKnopf,
  pruefungStart,
  pruefungZaehler,
  type PruefStand,
} from "@/lib/typing/findenPruefung";
import {
  suchSatzEn,
  tastenNennungEn,
} from "@/lib/typing/tastenErklaerungEn";
import { suchSatzFr, tastenNennungFr } from "@/lib/typing/tastenErklaerungFr";
import { suchSatzEs, tastenNennungEs } from "@/lib/typing/tastenErklaerungEs";
import { suchSatzIt, tastenNennungIt } from "@/lib/typing/tastenErklaerungIt";
import { suchSatzPl, tastenNennungPl } from "@/lib/typing/tastenErklaerungPl";
import { sprechformTr, suchSatzTr, tastenNennungTr } from "@/lib/typing/tastenErklaerungTr";
import { suchSatzCs, tastenNennungCs } from "@/lib/typing/tastenErklaerungCs";
// ★ G3c-VERTEILER (25.10.2026): die neun Gerüst-Sprachen aus ihrer eigenen Datei (heute die englischen Namen).
import { FENSTER_TEXTE_NEUN } from "./tastenErkundenTexteNeun";
import { suchSatzBg, tastenNennungBg } from "@/lib/typing/tastenErklaerungBg";
import { suchSatzEl, tastenNennungEl } from "@/lib/typing/tastenErklaerungEl";
import { suchSatzHu, tastenNennungHu } from "@/lib/typing/tastenErklaerungHu";
import { suchSatzNl, tastenNennungNl } from "@/lib/typing/tastenErklaerungNl";
import { suchSatzPt, tastenNennungPt } from "@/lib/typing/tastenErklaerungPt";
import { suchSatzBr, tastenNennungBr } from "@/lib/typing/tastenErklaerungBr";
import { suchSatzRo, tastenNennungRo } from "@/lib/typing/tastenErklaerungRo";
import { suchSatzSv, tastenNennungSv } from "@/lib/typing/tastenErklaerungSv";
import { suchSatzUk, tastenNennungUk } from "@/lib/typing/tastenErklaerungUk";
import { useTypingA11y } from "@/lib/typing/a11y";
import { focusPracticeField } from "@/lib/typing/focusField";
import { speakUi } from "@/lib/typing/voice";
// ★ 28.10.2026: dieselbe Wartezeit wie die Stumm-Regel - AltGr schickt vorher ein Strg links.
import { ALTGR_STRG_FENSTER_MS } from "@/lib/stummTaste";
import { texte, useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";
import { istMacSystem } from "@/lib/altTaste";
import { wahlTexte } from "@/lib/typing/wahltaste";
import { playSuccessSound, playUnlockFanfare } from "@/lib/typing/sound";
import type { GedrueckteTaste } from "./Keyboard";
import { KeyboardPanel } from "./KeyboardPanel";
import { useKeyboardLayout } from "./useKeyboardLayout";

/**
 * ★ Testerin 24.10.2026: „AltGr wird AltGri gesprochen." Nur für die deutsche
 * Stimme „Alt Gr" - Schirm und Braillezeile behalten die Aufschrift AltGr.
 */
export function sprechformDe(satz: string): string {
  return satz.replace(/\bAltGr\b/g, "Alt Gr");
}

/** Die zwei Modi des Fensters (13.09.2026). */
export type ErkundenModus = "erkunden" | "finden";

/** Zeitfenster, in dem der zweite Esc-Druck als „zweimal" zählt (wie im Griff). */
const ESC_FENSTER_MS = 2000;

/** Wie lange vor dem Verlassen des Fensters eine Taste als Ursache gilt (Win, Druck). */
const RUECKKEHR_FENSTER_MS = 5000;


/**
 * Der Satz, der die Tastaturfalle auflöst — auf dem Schirm UND in der Ansage.
 * ★ 23.09.2026, Johannes: „du schreibst bei den anweisungen zu viel Text,
 * halte dich kürzer".
 */
export const ERKUNDEN_AUSSTIEG = "Raus mit Alt + 3 oder zweimal Esc.";

/** Nach dem ersten Esc: wie der zweite Druck wirkt. */
export const ERKUNDEN_ESC_HINWEIS = "Noch einmal Esc beendet Tasten erkunden.";

/** Der Weg in den jeweils anderen Modus - in der Ansage und unten auf dem Schirm. */
const ZU_FINDEN = "Tasten finden mit Alt + 4.";
/** ★ 23.09.2026: kürzer - „Zurück zum Erkunden" wurde „Erkunden". */
const ZU_ERKUNDEN = "Erkunden mit Alt + 4.";

/**
 * Was beim Betreten auf der Zeile steht und gesagt wird.
 * ⚠️ „Tasten erkunden" und „Drück irgendeine Taste" am Anfang NICHT umformulieren:
 * Der VoiceOver-Prüfstand wartet auf genau diese Wörter
 * (`pruefstand/wege/mac/erkunden-voiceover-lauf.mts`, `BEGRUESSUNG_MUSTER`).
 */
export const ERKUNDEN_BEGRUESSUNG =
  "Tasten erkunden. Drück irgendeine Taste: Du hörst, wie sie heißt und was sie tut. " +
  `${ZU_FINDEN} ${ERKUNDEN_AUSSTIEG}`;

/**
 * ★ 28.09.2026 (Johannes: „gibt es einen Grund, warum es beim Tasten erkunden
 * keine F-Tasten gibt?"): Am Mac sind F1-F12 ab Werk Helligkeit, Lautstärke &
 * Co. - der Browser sieht den Tastendruck gar nicht, keine Seite kann ihn
 * abfangen. Erst mit fn kommt die F-Taste an. Nur am Mac an die Begrüßung
 * gehängt (die Braillezeile unter Windows bleibt so kurz wie bisher).
 */
export const ERKUNDEN_MAC_FN = "Am Mac die F-Tasten zusammen mit fn drücken.";

/** Die Begrüßung - am Mac mit dem fn-Hinweis. */
export function erkundenBegruessung(texte: { begruessung: string; macFn: string }, plattform: Plattform): string {
  return plattform === "macos" ? `${texte.begruessung} ${texte.macFn}` : texte.begruessung;
}

/**
 * Wird die Esc-Taste gesucht, beißen sich Aufgabe und Ausweg: Der zweite Druck
 * binnen zwei Sekunden beendet das Fenster. Das sagt der erste Treffer vorher.
 */
const FINDEN_ESC_WARTEN = "Warte zwei Sekunden, sonst schließt sich das Fenster.";

/** Die Hinweise an den zwei Schaltern (statt `title`, groß und sofort). */
const TIPP_ERKUNDEN = "Tasten erkunden: jede Taste sagt, wie sie heißt und was sie tut (Alt + 4 wechselt)";
const TIPP_FINDEN = "Tasten finden: eine Taste wird genannt, du suchst sie (Alt + 4 wechselt)";

/**
 * ★ 25.09.2026 (Johannes): „Meine Tasten" oder „Alle Tasten" - nur in
 * Tastenflow (`ladeGelernte`), Alt + 5 wechselt. Siehe `lib/typing/findenRunde.ts`.
 */
const ZU_ALLE = "Alle Tasten mit Alt + 5.";
const ZU_MEINE = "Meine Tasten mit Alt + 5.";

/**
 * ★ DAS FENSTER IN BEIDEN BEDIENUNGSSPRACHEN (EN1, 19.09.2026).
 *
 * Deutsch sind es genau die Sätze oben (die exportierten Konstanten bleiben,
 * Prüfstände warten auf sie). Englisch nach Glossar: *Explore keys* / *Find
 * keys* (★ Probestück), *braille display*, *Esc*. Die Sätze zu den TASTEN
 * stehen in `lib/typing/tastenErklaerungEn.ts`.
 * ⚠️ „Beenden" heisst englisch „Close", nicht „End": In diesem Fenster ist
 * „End" der Name einer Taste, die man gerade erkundet.
 * »Im Griff« zeigt das Fenster ohne aktiven Sprach-Anbieter - dort bleibt es
 * Zeichen für Zeichen deutsch.
 */
const FENSTER_TEXTE = texte({
  // ★ O2-TASTATUR (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen (`tastenErkundenTexteNeun.ts`).
  ...FENSTER_TEXTE_NEUN,
  de: {
    ausstieg: ERKUNDEN_AUSSTIEG,
    escHinweis: ERKUNDEN_ESC_HINWEIS,
    zuFinden: ZU_FINDEN,
    zuErkunden: ZU_ERKUNDEN,
    begruessung: ERKUNDEN_BEGRUESSUNG,
    macFn: ERKUNDEN_MAC_FN,
    escWarten: FINDEN_ESC_WARTEN,
    tippErkunden: TIPP_ERKUNDEN,
    tippFinden: TIPP_FINDEN,
    beendet: "Tasten erkunden beendet.",
    // ★ Testerin 24.10.2026: zurück nach Win, Druck oder einem anderen Fenster (`zurueck*`).
    zurueck: "Du bist wieder in Tasten erkunden.",
    zurueckWin: "Die Windows-Taste hat das Startmenü geöffnet. Du bist wieder in Tasten erkunden.",
    zurueckDruck: "Die Drucktaste hat ein Programm für Bildschirmfotos geöffnet. Du bist wieder in Tasten erkunden.",
    tastaturHinweis: "Deine Tastatur kann anders aussehen. Jede Taste wird erklärt, auch wenn sie hier fehlt.",
    belegung: "Mit Shift kommt das obere Zeichen einer Taste, mit AltGr das dritte. Probier es aus.",
    belegungMac: "Mit Shift kommt das obere Zeichen einer Taste, mit Option weitere Zeichen. Probier es aus.",
    melden: "Etwas melden: Alt + Umschalt + P.",
    fensterName: "Tasten erkunden",
    titel: "Tasten erkunden",
    modus: "Modus",
    erkunden: "Tasten erkunden",
    finden: "Tasten finden",
    beenden: "Beenden",
    alleGefunden: "Alle Tasten gefunden.",
    tasteVon: (n: number, gesamt: number) => ["Taste ", n, " von ", gesamt],
    drueck: "Drück irgendeine Taste …",
    nochEinmal: "Noch einmal suchen",
    auswahl: "Welche Tasten",
    meine: "Meine Tasten",
    alle: "Alle Tasten",
    zuAlle: ZU_ALLE,
    zuMeine: ZU_MEINE,
    tippMeine: "Meine Tasten: nur die, die du schon gelernt hast, und die Sondertasten (Alt + 5 wechselt)",
    tippAlle: "Alle Tasten: jede Taste der Tastatur (Alt + 5 wechselt)",
  },
  en: {
    // ★ 23.09.2026: dieselbe Kürze wie die deutschen Sätze.
    ausstieg: "Leave with Alt + 3 or Esc twice.",
    escHinweis: "Press Esc once more to close Explore keys.",
    zuFinden: "Find keys with Alt + 4.",
    zuErkunden: "Explore keys with Alt + 4.",
    begruessung:
      "Explore keys. Press any key: you'll hear what it's called and what it does. " +
      "Find keys with Alt + 4. Leave with Alt + 3 or Esc twice.",
    macFn: "On a Mac, press the F keys together with fn.",
    escWarten: "Wait two seconds, or the window closes.",
    tippErkunden: "Explore keys: every key tells you what it's called and what it does (Alt + 4 switches)",
    tippFinden: "Find keys: a key is named and you look for it (Alt + 4 switches)",
    beendet: "Explore keys closed.",
    zurueck: "You're back in Explore keys.",
    zurueckWin: "The Windows key opened the Start menu. You're back in Explore keys.",
    zurueckDruck: "The Print Screen key opened a screenshot tool. You're back in Explore keys.",
    tastaturHinweis: "Your keyboard may look different. Every key is explained, even if it is missing here.",
    belegung: "Shift gives the top character on a key, AltGr the third one if your keyboard has it. Try it.",
    belegungMac: "Shift gives the top character on a key, Option more characters. Try it.",
    melden: "Report something: Alt + Shift + P.",
    fensterName: "Explore keys",
    titel: "Explore keys",
    modus: "Mode",
    erkunden: "Explore keys",
    finden: "Find keys",
    beenden: "Close",
    alleGefunden: "All keys found.",
    tasteVon: (n: number, gesamt: number) => ["Key ", n, " of ", gesamt],
    drueck: "Press any key …",
    nochEinmal: "Search again",
    auswahl: "Which keys",
    meine: "My keys",
    alle: "All keys",
    zuAlle: "All keys with Alt + 5.",
    zuMeine: "My keys with Alt + 5.",
    tippMeine: "My keys: only the ones you have learned, plus the special keys (Alt + 5 switches)",
    tippAlle: "All keys: every key on the keyboard (Alt + 5 switches)",
  },
  // ★ E11a: „tu" - dieses Fenster spricht immer die lernende Person an (F9).
  fr: {
    ausstieg: "Pour sortir : Alt + 3 ou deux fois Échap.",
    escHinweis: "Encore une fois Échap pour quitter Explorer le clavier.",
    zuFinden: "Trouver les touches avec Alt + 4.",
    zuErkunden: "Explorer avec Alt + 4.",
    begruessung:
      "Explorer le clavier. Appuie sur n'importe quelle touche : tu entends comment elle s'appelle et ce qu'elle fait. " +
      "Trouver les touches avec Alt + 4. Pour sortir : Alt + 3 ou deux fois Échap.",
    macFn: "Sur Mac, appuie sur les touches F avec fn.",
    escWarten: "Attends deux secondes, sinon la fenêtre se ferme.",
    tippErkunden: "Explorer le clavier : chaque touche dit comment elle s'appelle et ce qu'elle fait (Alt + 4 change)",
    tippFinden: "Trouver les touches : une touche est nommée, tu la cherches (Alt + 4 change)",
    beendet: "Explorer le clavier est fermé.",
    zurueck: "Tu es de retour dans Explorer le clavier.",
    zurueckWin: "La touche Windows a ouvert le menu Démarrer. Tu es de retour dans Explorer le clavier.",
    zurueckDruck: "La touche Impr. écran a ouvert un outil de capture d'écran. Tu es de retour dans Explorer le clavier.",
    tastaturHinweis: "Ton clavier peut être différent. Chaque touche est expliquée, même si elle manque ici.",
    belegung: "Maj donne le caractère du haut d'une touche, AltGr le troisième. Essaie.",
    belegungMac: "Maj donne le caractère du haut d'une touche, Option d'autres caractères. Essaie.",
    melden: "Signaler un problème : Alt + Maj + P.",
    fensterName: "Explorer le clavier",
    titel: "Explorer le clavier",
    modus: "Mode",
    erkunden: "Explorer le clavier",
    finden: "Trouver les touches",
    beenden: "Fermer",
    alleGefunden: "Toutes les touches trouvées.",
    tasteVon: (n: number, gesamt: number) => ["Touche ", n, " sur ", gesamt],
    drueck: "Appuie sur n'importe quelle touche …",
    nochEinmal: "Chercher à nouveau",
    auswahl: "Quelles touches",
    meine: "Mes touches",
    alle: "Toutes les touches",
    zuAlle: "Toutes les touches avec Alt + 5.",
    zuMeine: "Mes touches avec Alt + 5.",
    tippMeine: "Mes touches : seulement celles que tu as déjà apprises, et les touches spéciales (Alt + 5 change)",
    tippAlle: "Toutes les touches : chaque touche du clavier (Alt + 5 change)",
  },
  // ★ ES-O (27.09.2026): „tú" - dieses Fenster spricht immer die lernende
  // Person an (Bauplan S9); Tastennamen nach Bauplan S13.
  es: {
    ausstieg: "Para salir: Alt + 3 o dos veces Esc.",
    escHinweis: "Pulsa Esc otra vez para cerrar Explorar el teclado.",
    zuFinden: "Buscar teclas con Alt + 4.",
    zuErkunden: "Explorar el teclado con Alt + 4.",
    begruessung:
      "Explorar el teclado. Pulsa cualquier tecla: oyes cómo se llama y para qué sirve. " +
      "Buscar teclas con Alt + 4. Para salir: Alt + 3 o dos veces Esc.",
    macFn: "En Mac, pulsa las teclas F junto con fn.",
    escWarten: "Espera dos segundos o la ventana se cierra.",
    tippErkunden: "Explorar el teclado: cada tecla dice cómo se llama y para qué sirve (Alt + 4 cambia)",
    tippFinden: "Buscar teclas: se nombra una tecla y tú la buscas (Alt + 4 cambia)",
    beendet: "Explorar el teclado se ha cerrado.",
    zurueck: "Has vuelto a Explorar el teclado.",
    zurueckWin: "La tecla Windows ha abierto el menú Inicio. Has vuelto a Explorar el teclado.",
    zurueckDruck: "La tecla Impr Pant ha abierto una herramienta de captura. Has vuelto a Explorar el teclado.",
    tastaturHinweis: "Tu teclado puede ser diferente. Se explica cada tecla, aunque aquí no aparezca.",
    belegung: "Mayús da el carácter de arriba de una tecla, AltGr el tercero. Pruébalo.",
    belegungMac: "Mayús da el carácter de arriba de una tecla, Opción otros caracteres. Pruébalo.",
    melden: "Informar de algo: Alt + Mayús + P.",
    fensterName: "Explorar el teclado",
    titel: "Explorar el teclado",
    modus: "Modo",
    erkunden: "Explorar el teclado",
    finden: "Buscar teclas",
    beenden: "Cerrar",
    alleGefunden: "Todas las teclas encontradas.",
    tasteVon: (n: number, gesamt: number) => ["Tecla ", n, " de ", gesamt],
    drueck: "Pulsa cualquier tecla …",
    nochEinmal: "Buscar otra vez",
    auswahl: "Qué teclas",
    meine: "Mis teclas",
    alle: "Todas las teclas",
    zuAlle: "Todas las teclas con Alt + 5.",
    zuMeine: "Mis teclas con Alt + 5.",
    tippMeine: "Mis teclas: solo las que ya has aprendido y las teclas especiales (Alt + 5 cambia)",
    tippAlle: "Todas las teclas: cada tecla del teclado (Alt + 5 cambia)",
  },
  // ★ O-IT (02.10.2026): „Esplora i tasti" / „Trova i tasti", tu; der
  // Schliessen-Knopf heisst „Chiudi" (Glossar §1 Nr. 10: „Fine" ist ein Tastenname).
  it: {
    ausstieg: "Per uscire: Alt + 3 oppure due volte Esc.",
    escHinweis: "Premi di nuovo Esc per chiudere Esplora i tasti.",
    zuFinden: "Trova i tasti con Alt + 4.",
    zuErkunden: "Esplora i tasti con Alt + 4.",
    begruessung:
      "Esplora i tasti. Premi un tasto qualsiasi: senti come si chiama e a che cosa serve. " +
      "Trova i tasti con Alt + 4. Per uscire: Alt + 3 oppure due volte Esc.",
    macFn: "Sul Mac premi i tasti F insieme a Fn.",
    escWarten: "Aspetta due secondi oppure la finestra si chiude.",
    tippErkunden: "Esplora i tasti: ogni tasto dice come si chiama e a che cosa serve (Alt + 4 cambia)",
    tippFinden: "Trova i tasti: viene detto un tasto e tu lo cerchi (Alt + 4 cambia)",
    beendet: "Esplora i tasti è chiuso.",
    zurueck: "Sei di nuovo in Esplora i tasti.",
    zurueckWin: "Il tasto Windows ha aperto il menu Start. Sei di nuovo in Esplora i tasti.",
    zurueckDruck: "Il tasto Stamp ha aperto uno strumento per le schermate. Sei di nuovo in Esplora i tasti.",
    tastaturHinweis: "La tua tastiera può essere diversa. Ogni tasto viene spiegato, anche se qui manca.",
    belegung: "Maiusc dà il carattere in alto su un tasto, AltGr il terzo. Prova.",
    belegungMac: "Maiusc dà il carattere in alto su un tasto, Opzione altri caratteri. Prova.",
    melden: "Segnalare qualcosa: Alt + Maiusc + P.",
    fensterName: "Esplora i tasti",
    titel: "Esplora i tasti",
    modus: "Modalità",
    erkunden: "Esplora i tasti",
    finden: "Trova i tasti",
    beenden: "Chiudi",
    alleGefunden: "Tutti i tasti trovati.",
    tasteVon: (n: number, gesamt: number) => ["Tasto ", n, " di ", gesamt],
    drueck: "Premi un tasto qualsiasi...",
    nochEinmal: "Cerca ancora",
    auswahl: "Quali tasti",
    meine: "I miei tasti",
    alle: "Tutti i tasti",
    zuAlle: "Tutti i tasti con Alt + 5.",
    zuMeine: "I miei tasti con Alt + 5.",
    tippMeine: "I miei tasti: solo quelli che hai già imparato e i tasti speciali (Alt + 5 cambia)",
    tippAlle: "Tutti i tasti: ogni tasto della tastiera (Alt + 5 cambia)",
  },
  // ★ O-PL (02.10.2026): „Odkrywaj klawisze" / „Znajdź klawisze" (Glossar
  // §2.11), ty. Der Schliessen-Knopf heisst „Zamknij" - „Usuń" ist die Taste
  // Delete, „Wstecz" sagen manche zur Rücktaste (Glossar Regel 12). Die
  // Tastenkürzel nach einem Doppelpunkt, damit nichts gebeugt werden muss.
  pl: {
    ausstieg: "Wyjście: Alt + 3 albo dwa razy Esc.",
    escHinweis: "Naciśnij Esc jeszcze raz, aby zamknąć okno Odkrywaj klawisze.",
    zuFinden: "Znajdź klawisze: Alt + 4.",
    zuErkunden: "Odkrywaj klawisze: Alt + 4.",
    begruessung:
      "Odkrywaj klawisze. Naciśnij dowolny klawisz: usłyszysz, jak się nazywa i do czego służy. " +
      "Znajdź klawisze: Alt + 4. Wyjście: Alt + 3 albo dwa razy Esc.",
    macFn: "Na Macu naciskaj klawisze F razem z klawiszem Fn.",
    escWarten: "Poczekaj dwie sekundy, bo inaczej okno się zamknie.",
    tippErkunden: "Odkrywaj klawisze: każdy klawisz mówi, jak się nazywa i do czego służy (Alt + 4 przełącza)",
    tippFinden: "Znajdź klawisze: program podaje klawisz, a ty go szukasz (Alt + 4 przełącza)",
    beendet: "Zamknięto okno Odkrywaj klawisze.",
    zurueck: "Wracasz do okna Odkrywaj klawisze.",
    zurueckWin: "Klawisz Windows otworzył menu Start. Wracasz do okna Odkrywaj klawisze.",
    zurueckDruck: "Klawisz Print Screen otworzył narzędzie do zrzutów ekranu. Wracasz do okna Odkrywaj klawisze.",
    tastaturHinweis: "Twoja klawiatura może wyglądać inaczej. Każdy klawisz zostanie objaśniony, nawet jeśli go tu brakuje.",
    belegung: "Shift daje górny znak klawisza, AltGr trzeci. Spróbuj.",
    belegungMac: "Shift daje górny znak klawisza, Option kolejne znaki. Spróbuj.",
    melden: "Zgłoś problem: Alt + Shift + P.",
    fensterName: "Odkrywaj klawisze",
    titel: "Odkrywaj klawisze",
    modus: "Tryb",
    erkunden: "Odkrywaj klawisze",
    finden: "Znajdź klawisze",
    beenden: "Zamknij",
    alleGefunden: "Wszystkie klawisze znalezione.",
    tasteVon: (n: number, gesamt: number) => ["Klawisz ", n, " z ", gesamt],
    drueck: "Naciśnij dowolny klawisz...",
    nochEinmal: "Szukaj jeszcze raz",
    auswahl: "Które klawisze",
    meine: "Moje klawisze",
    alle: "Wszystkie klawisze",
    zuAlle: "Wszystkie klawisze: Alt + 5.",
    zuMeine: "Moje klawisze: Alt + 5.",
    tippMeine: "Moje klawisze: tylko te, które już znasz, i klawisze specjalne (Alt + 5 przełącza)",
    tippAlle: "Wszystkie klawisze: każdy klawisz klawiatury (Alt + 5 przełącza)",
  },
  // ★ O-TR (02.10.2026): „Tuşları Keşfet" / „Tuşları Bul" (Glossar §2.11), sen.
  // Der Schliessen-Knopf heisst „Kapat" - „Geri" ist bei Microsoft die
  // Rücktaste, „Sil" die Taste Delete (Glossar Regel 10). Tastenkürzel nach
  // einem Doppelpunkt, damit keine Endung an „Alt + 4" hängt (Regel 6).
  tr: {
    ausstieg: "Çıkış: Alt + 3 ya da iki kez Esc.",
    escHinweis: "Tuşları Keşfet penceresini kapatmak için Esc tuşuna bir kez daha bas.",
    zuFinden: "Tuşları Bul: Alt + 4.",
    zuErkunden: "Tuşları Keşfet: Alt + 4.",
    begruessung:
      "Tuşları Keşfet. Herhangi bir tuşa bas: adını ve ne işe yaradığını duyacaksın. " +
      "Tuşları Bul: Alt + 4. Çıkış: Alt + 3 ya da iki kez Esc.",
    macFn: "Mac bilgisayarda F tuşlarına Fn tuşuyla birlikte bas.",
    escWarten: "İki saniye bekle, yoksa pencere kapanır.",
    tippErkunden: "Tuşları Keşfet: her tuş adını ve ne işe yaradığını söyler (Alt + 4 değiştirir)",
    tippFinden: "Tuşları Bul: program bir tuşun adını söyler, sen o tuşu bulursun (Alt + 4 değiştirir)",
    beendet: "Tuşları Keşfet kapandı.",
    zurueck: "Tuşları Keşfet penceresine geri döndün.",
    zurueckWin: "Windows tuşu Başlat menüsünü açtı. Tuşları Keşfet penceresine geri döndün.",
    zurueckDruck: "Print Screen tuşu bir ekran görüntüsü aracını açtı. Tuşları Keşfet penceresine geri döndün.",
    tastaturHinweis: "Klavyen farklı görünebilir. Burada olmasa da her tuş açıklanır.",
    belegung: "Shift bir tuşun üstteki işaretini verir, AltGr üçüncüsünü. Dene.",
    belegungMac: "Shift bir tuşun üstteki işaretini verir, Option başka işaretler. Dene.",
    melden: "Bir şey bildirmek için: Alt + Shift + P.",
    fensterName: "Tuşları Keşfet",
    titel: "Tuşları Keşfet",
    modus: "Mod",
    erkunden: "Tuşları Keşfet",
    finden: "Tuşları Bul",
    beenden: "Kapat",
    alleGefunden: "Tüm tuşlar bulundu.",
    tasteVon: (n: number, gesamt: number) => ["Tuş ", n, ", toplam ", gesamt],
    drueck: "Herhangi bir tuşa bas...",
    nochEinmal: "Tekrar ara",
    auswahl: "Hangi tuşlar",
    meine: "Tuşlarım",
    alle: "Tüm tuşlar",
    zuAlle: "Tüm tuşlar: Alt + 5.",
    zuMeine: "Tuşlarım: Alt + 5.",
    tippMeine: "Tuşlarım: sadece öğrendiğin tuşlar ve özel tuşlar (Alt + 5 değiştirir)",
    tippAlle: "Tüm tuşlar: klavyedeki her tuş (Alt + 5 değiştirir)",
  },
  // ★ O-CS (03.10.2026): „Průzkum kláves" (Glossar §2.9) / „Hledání kláves", ty.
  // Der Schliessen-Knopf heisst „Zavřít", der Ausstieg „Odejít" - „Konec" ist die
  // Taste End (Glossar Regel 10). Tastenkürzel nach einem Doppelpunkt, damit
  // nichts gebeugt werden muss; „Klávesa 3/20" mit Schrägstrich (Regel 13).
  cs: {
    ausstieg: "Odejít: Alt + 3 nebo dvakrát Esc.",
    escHinweis: "Stiskni Esc ještě jednou a Průzkum kláves se zavře.",
    zuFinden: "Hledání kláves: Alt + 4.",
    zuErkunden: "Průzkum kláves: Alt + 4.",
    begruessung:
      "Průzkum kláves. Stiskni libovolnou klávesu: uslyšíš, jak se jmenuje a k čemu slouží. " +
      "Hledání kláves: Alt + 4. Odejít: Alt + 3 nebo dvakrát Esc.",
    macFn: "Na Macu stiskni klávesy F spolu s klávesou Fn.",
    escWarten: "Počkej dvě sekundy, jinak se okno zavře.",
    tippErkunden: "Průzkum kláves: každá klávesa řekne, jak se jmenuje a k čemu slouží (Alt + 4 přepíná)",
    tippFinden: "Hledání kláves: program řekne název klávesy a ty ji hledáš (Alt + 4 přepíná)",
    beendet: "Průzkum kláves skončil.",
    zurueck: "Jsi zpátky v Průzkumu kláves.",
    zurueckWin: "Klávesa Windows otevřela nabídku Start. Jsi zpátky v Průzkumu kláves.",
    zurueckDruck: "Klávesa Print Screen otevřela nástroj pro snímky obrazovky. Jsi zpátky v Průzkumu kláves.",
    tastaturHinweis: "Tvoje klávesnice může vypadat jinak. Každá klávesa se vysvětlí, i když tu chybí.",
    belegung: "Shift dává horní znak klávesy, AltGr třetí. Zkus to.",
    belegungMac: "Shift dává horní znak klávesy, Option další znaky. Zkus to.",
    melden: "Nahlásit problém: Alt + Shift + P.",
    fensterName: "Průzkum kláves",
    titel: "Průzkum kláves",
    modus: "Režim",
    erkunden: "Průzkum kláves",
    finden: "Hledání kláves",
    beenden: "Zavřít",
    alleGefunden: "Všechny klávesy jsou nalezené.",
    tasteVon: (n: number, gesamt: number) => ["Klávesa ", n, "/", gesamt],
    drueck: "Stiskni libovolnou klávesu...",
    nochEinmal: "Hledat znovu",
    auswahl: "Které klávesy",
    meine: "Moje klávesy",
    alle: "Všechny klávesy",
    zuAlle: "Všechny klávesy: Alt + 5.",
    zuMeine: "Moje klávesy: Alt + 5.",
    tippMeine: "Moje klávesy: jen ty, které už umíš, a speciální klávesy (Alt + 5 přepíná)",
    tippAlle: "Všechny klávesy: každá klávesa na klávesnici (Alt + 5 přepíná)",
  },
});

/**
 * ★ 18.10.2026 (Johannes: „passe mac an Wahl-taste an"): die Sätze des Fensters
 * für DIESES Gerät - am Mac „Raus mit Wahl + 3" statt „Alt + 3" (in der Sprache:
 * Option, Opción …, `wahlTexte`). Nur die Sätze über die Kürzel des Fensters
 * gehen hier durch; die Namen der Tasten, die ein Kind erkundet (auch „Alt"),
 * kommen aus `tastenErklaerung*.ts` und bleiben, wie sie sind - das ist Lernstoff.
 * Gilt in beiden Programmen, die das Fenster zeigen (Tastenflow, »Im Griff«),
 * wie die Regel aus `lib/altTaste.ts` für alle Lern-Apps.
 */
function fensterTexte(sprache: BedienSprache): (typeof FENSTER_TEXTE)[BedienSprache] {
  // Kein Zwischenspeicher: die englische Tabelle liest GB/US beim Zugriff
  // (`texte`), und die Tabelle ist klein.
  return wahlTexte(FENSTER_TEXTE[sprache], sprache, istMacSystem());
}

/**
 * Die Klassen eines Modus-Schalters - dasselbe Muster wie `schalter(aktiv)` in
 * `RueckmeldungKnopf.tsx`: gewählt `btn-primary`, sonst `btn-secondary`.
 * ★ Abnahme 13.09.2026 (Design Dunkel, gemessen): Mit `btn-secondary` an beiden
 * sahen sie gleich aus - `aria-pressed` färbt nur in den Kontrast-Designs und
 * bei forced-colors (`index.css`), dort wirken diese Regeln weiter.
 * `btn-umriss` in BEIDEN Zuständen: derselbe Rahmen, die Höhe setzt
 * `.bedien-schlank` fest auf 36 px - beim Wechsel springt nichts.
 */
function schalterKlasse(aktiv: boolean): string {
  return `${aktiv ? "btn-primary" : "btn-secondary"} btn-toggle btn-umriss`;
}

/**
 * Der Anfang einer Suchrunde.
 * ★ 23.09.2026, Johannes: „du schreibst bei den anweisungen zu viel Text,
 * halte dich kürzer" - OHNE den Weg zurück zum Erkunden: Der steht unten
 * dauerhaft auf dem Schirm (Fußzeile), die Ansage muss ihn nicht wiederholen.
 */
function findenBeginn(erste: FindenZiel, sprache: BedienSprache = "de", plattform: Plattform = "windows"): string {
  // ★ E11a-5 (26.09.2026, Falle 30): für alle drei Sprachen derselbe Bau aus
  // der Fenster-Tabelle - vorher `sprache === "en" ? … : Deutsch`, für „fr"
  // also still „Tasten finden. Finde …". Deutsch und Englisch Zeichen für
  // Zeichen wie vorher („Tasten finden." / „Find keys." stehen dort als `finden`).
  const t = fensterTexte(sprache);
  return `${t.finden}. ${findenAuftrag(erste, plattform, sprache)} ${t.ausstieg}`;
}

/** Die bisherige Runde (»Im Griff«): alle suchbaren Sondertasten in Lehr-Reihenfolge. */
function sonderZiele(suchbar: readonly TastenName[]): FindenZiel[] {
  return suchbar.map((taste) => ({ art: "sonder", taste }));
}

/**
 * Am Ende der Runde: noch einmal oder zurück.
 * ★ 13.09.2026 (Nachtrag der Tastenflow-Sitzung): kurz dann lang, über die
 * neue Funktion - vorher stand hier „mit dem Zeilenschalter" fest im Text,
 * statt aus dem Wörterbuch zu kommen.
 * ★ 23.09.2026, Johannes: „halte dich kürzer" - jetzt nur noch die Kurzform
 * (`tastenNennungKurz`), „Noch einmal mit Enter." statt „…suchen mit Enter,
 * der Eingabetaste."
 */
function findenWahl(plattform: Plattform, sprache: BedienSprache = "de"): string {
  const t = tasteMitId(plattform === "macos" ? "zeilenschalter" : "eingabe", plattform)!;
  return FINDEN_WAHL[sprache](t, plattform);
}

/**
 * ★ E11a-5 (26.09.2026, Falle 30): je Sprache ein Satz statt `if (sprache ===
 * "en")` - „fr" bekam sonst „Noch einmal mit Enter.". Französisch mit „tu":
 * „Recommence avec la touche Entrée. Explorer avec Alt + 4."
 */
const FINDEN_WAHL: Record<BedienSprache, (t: TastenName, plattform: Plattform) => string> = {
  // ★ O2-TASTATUR (30.10.2026): die neun Sprachen, die Nennung aus `tastenErklaerung<Xx>.ts`.
  bg: (t, p) => `Още веднъж? Натисни ${tastenNennungBg(t, p)}. ${fensterTexte("bg").zuErkunden}`,
  el: (t, p) => `Άλλη μία φορά; Πάτα ${tastenNennungEl(t, p)}. ${fensterTexte("el").zuErkunden}`,
  hu: (t, p) => `Még egyszer? Nyomd meg ${tastenNennungHu(t, p)}. ${fensterTexte("hu").zuErkunden}`,
  nl: (t, p) => `Nog een keer? Druk op ${tastenNennungNl(t, p)}. ${fensterTexte("nl").zuErkunden}`,
  pt: (t, p) => `Mais uma vez? Prime ${tastenNennungPt(t, p)}. ${fensterTexte("pt").zuErkunden}`,
  br: (t, p) => `Mais uma vez? Pressione ${tastenNennungBr(t, p)}. ${fensterTexte("br").zuErkunden}`,
  ro: (t, p) => `Încă o dată? Apasă ${tastenNennungRo(t, p)}. ${fensterTexte("ro").zuErkunden}`,
  sv: (t, p) => `En gång till? Tryck på ${tastenNennungSv(t, p)}. ${fensterTexte("sv").zuErkunden}`,
  uk: (t, p) => `Ще раз? Натисни ${tastenNennungUk(t, p)}. ${fensterTexte("uk").zuErkunden}`,
  de: (t) => `Noch einmal mit ${tastenNennungKurz(t, "dativ")}. ${fensterTexte("de").zuErkunden}`,
  en: (t, p) => `Search again with ${tastenNennungEn(t, p)}. ${fensterTexte("en").zuErkunden}`,
  fr: (t, p) => `Recommence avec ${tastenNennungFr(t, p)}. ${fensterTexte("fr").zuErkunden}`,
  es: (t, p) => `Otra vez con ${tastenNennungEs(t, p)}. ${fensterTexte("es").zuErkunden}`,
  it: (t, p) => `Ancora una volta con ${tastenNennungIt(t, p)}. ${fensterTexte("it").zuErkunden}`,
  // ★ O-PL (02.10.2026): „Naciśnij" + Akkusativ (`tastenNennungPl`).
  pl: (t, p) => `Jeszcze raz? Naciśnij ${tastenNennungPl(t, p)}. ${fensterTexte("pl").zuErkunden}`,
  // ★ O-TR (02.10.2026): „… tuşuna bas" - die Endung an „tuş" (`tastenNennungTr`, Dativ).
  tr: (t, p) => `Bir tur daha için ${tastenNennungTr(t, p, "dat")} bas. ${fensterTexte("tr").zuErkunden}`,
  // ★ O-CS (03.10.2026): „Stiskni" + Akkusativ (`tastenNennungCs`: „klávesu Enter").
  cs: (t, p) => `Ještě jednou? Stiskni ${tastenNennungCs(t, p)}. ${fensterTexte("cs").zuErkunden}`,
};

/**
 * ★ E11a-5: die Wörter der Suchrunde OHNE `ladeGelernte` (»Im Griff«-Runde) je
 * Sprache. WAS geschieht, entscheidet weiter `suchSchritt` (deutsch, `null` =
 * dessen Satz bleibt); Englisch und Französisch setzen nur die Wörter neu.
 * »Im Griff« hat keinen Sprach-Anbieter und kommt nie hierher mit „en"/„fr".
 */
const SUCH_SATZ: Record<BedienSprache, typeof suchSatzEn | null> = {
  de: null,
  en: suchSatzEn,
  fr: suchSatzFr,
  es: suchSatzEs,
  it: suchSatzIt,
  pl: suchSatzPl, // ★ O-PL (02.10.2026)
  tr: suchSatzTr, // ★ O-TR (02.10.2026)
  cs: suchSatzCs, // ★ O-CS (03.10.2026)
  bg: suchSatzBg,
  el: suchSatzEl,
  hu: suchSatzHu,
  nl: suchSatzNl,
  pt: suchSatzPt,
  br: suchSatzBr,
  ro: suchSatzRo,
  sv: suchSatzSv,
  uk: suchSatzUk,
};

interface SuchStand {
  /** Welche Taste der Runde gerade gesucht wird. */
  index: number;
  /** Schon einmal getroffen - wartet auf die Wiederholung. */
  bestaetigt: boolean;
  /** Nach dem ersten Treffer kam eine andere Taste (D1) - erst dann zählt der zweite. */
  dazwischen: boolean;
  /** Alle Tasten gefunden - jetzt steht die Wahl an. */
  fertig: boolean;
  /** ★ Testerin 04.11.2026: bei Shift & Co. die Seite, die schon gefunden ist. */
  seite?: Seite;
}

const NEUE_RUNDE: SuchStand = { index: 0, bestaetigt: false, dazwischen: false, fertig: false };

/**
 * ★ 12.09.2026 - seit »Im Griff« den Modus mitbenutzt (Alt + 3). Alle Optionen
 * sind wahlweise; ohne Angabe verhält sich der Modus EXAKT wie in Tastenflow.
 * Abgestimmt zwischen beiden Apps, eingetragen in `apps/GEMEINSAM.md`.
 */
export interface TastenErkundenProps {
  /**
   * ★ Testerin 09.11.2026, Johannes 11.11.: In „Tasten finden" (Meine/Alle Tasten) gehört zu einem
   * Zeichen mit Umschalttaste die Umschalttaste der Gegenhand - wie im Schreibtrainer. Aus bei
   * „Einhand schreiben". Ohne die Angabe bleibt alles wie bisher (»Im Griff« übergibt sie nicht).
   */
  gegenhand?: boolean;
  open: boolean;
  onClose: () => void;
  /**
   * ★ 13.09.2026: In welchem Modus das Fenster aufgeht. Vorgabe „erkunden".
   * Alt + 3 öffnet „Tasten erkunden", Alt + 4 direkt „Tasten finden" - die
   * Seite reicht herein, womit geöffnet wurde. Gelesen wird die Angabe nur
   * beim Öffnen; im Fenster wechseln Alt + 4 und die Schalter selbst.
   */
  startModus?: ErkundenModus;
  /**
   * Gehört dieser Tastendruck der Seite (durchreichen, nicht ansagen)?
   * Vorgabe: `gehoertDerSeite` - die Alt-Kürzel von Tastenflow.
   */
  durchreichen?: (e: KeyEventLike, plattform: Plattform, altGr: boolean) => boolean;
  /**
   * Die Stimme. Vorgabe: `speakUi` (achtet den Vorlesen-Schalter von
   * Tastenflow). Das Feld für die Braillezeile bekommt den Text IMMER.
   */
  sprich?: (text: string) => void;
  /** Windows oder Mac. Vorgabe: aus dem Browser erkannt. */
  plattform?: Plattform;
  /** Wohin der Fokus nach dem Schließen geht. Vorgabe: `focusPracticeField`. */
  nachSchliessen?: () => void;
  /** Finger-Farben auf der Bildschirmtastatur. Vorgabe: wie am Übungsfeld. */
  zeigeFingerFarben?: boolean;
  /**
   * ★ E5/E6 (12.09.2026, »im Griff«-Umbau, mit NVDA gemessene Tastenflow-
   * Sitzung): Vorgabe `false` = Titel links, „Beenden" weit rechts über
   * `justify-between`. `true` (seit 13.09. beide Apps) rückt die Schalter und
   * „Beenden" ohne `justify-between` direkt neben den Titel, wie es die
   * Lupenprobe vom 12.09.2026 für Kopfzeilen verlangt. Die DOM-Reihenfolge
   * (h2 vor den Schaltern), der Fokus (bleibt im Feld), die Knopfklassen und
   * alles andere an dieser Zeile bleiben unverändert - nur die Klassen der
   * Anordnung wechseln.
   */
  kopfKompakt?: boolean;
  /**
   * ★ 25.09.2026 (Johannes, nur Tastenflow): Holt die Zeichen, die das Kind
   * schon gelernt hat (`introduced`). Mit dieser Angabe bekommt „Tasten
   * finden" den Umschalter „Meine Tasten / Alle Tasten" (Alt + 5) und sucht
   * auch Buchstaben und Zeichen, 20 zufällige je Runde
   * (`lib/typing/findenRunde.ts`). Ohne sie bleibt die Runde wie bisher:
   * nur Sondertasten, in Lehr-Reihenfolge (»Im Griff«).
   */
  ladeGelernte?: () => Promise<readonly string[]>;
}

export function TastenErkunden({
  open,
  onClose,
  startModus = "erkunden",
  durchreichen,
  sprich,
  plattform: plattformVorgabe,
  nachSchliessen,
  zeigeFingerFarben: fingerFarbenVorgabe,
  kopfKompakt = false,
  ladeGelernte,
  gegenhand = false,
}: TastenErkundenProps) {
  // Plattform fürs Tasten-Wörterbuch und den Kürzel-Katalog: am Mac heißen die
  // Sondertasten anders (Zeilenschalter, Befehlstaste …) und die Kürzel auch
  // (cmd + C). Automatisch erkannt — Tastenflow hat (anders als »im Griff«)
  // keinen Plattform-Schalter.
  // ⚠️ Die Erkennung läuft IMMER, auch wenn eine Plattform übergeben wird: Ein
  // Hook, der nur manchmal läuft, bringt die Reihenfolge der Hooks durcheinander.
  const erkannt: Plattform = useMemo(
    () =>
      /mac|iphone|ipad/i.test(
        `${navigator.platform ?? ""} ${navigator.userAgent ?? ""}`,
      )
        ? "macos"
        : "windows",
    [],
  );
  const plattform = plattformVorgabe ?? erkannt;

  // ★ EN1: die Bedienungssprache - ohne aktiven Anbieter (»Im Griff«) Deutsch.
  // Über einen Ref für die Rückrufe unten: Ein Sprachwechsel bei offenem
  // Fenster soll die Begrüßung nicht noch einmal auslösen.
  const { sprache, bereichAktiv } = useBedienSprache();
  const t = fensterTexte(sprache);
  const spracheRef = useRef({ sprache, bereichAktiv });
  spracheRef.current = { sprache, bereichAktiv };
  /**
   * Die Vorgabe-Stimme, wenn die Seite keine eigene gibt (Tastenflow): bei
   * aktivem Sprachbereich die Stimme der Bedienungssprache - die Sätze sind ja
   * in ihr geschrieben. Sonst genau der Aufruf von vorher.
   */
  const sprichVorgabe = useCallback((text: string) => {
    const b = spracheRef.current;
    if (b.bereichAktiv) speakUi(text, undefined, undefined, b.sprache);
    else speakUi(text);
  }, []);

  // Die Rückrufe über Refs: Übergibt eine Seite sie als neue Funktion bei jedem
  // Zeichnen, darf das weder die Begrüßung neu auslösen (hängt an `sag`) noch
  // den Tasten-Horcher neu anmelden.
  const durchreichenRef = useRef(durchreichen);
  durchreichenRef.current = durchreichen;
  const sprichRef = useRef(sprich);
  sprichRef.current = sprich;
  const nachSchliessenRef = useRef(nachSchliessen);
  nachSchliessenRef.current = nachSchliessen;
  const startModusRef = useRef(startModus);
  startModusRef.current = startModus;
  // Die eingestellte Tastatur (de, ch, us, uk): auf QWERTZ liegen Y und Z
  // vertauscht - „Strg + Z" muss die Taste mit dem Aufdruck Z meinen.
  const layout = useKeyboardLayout();
  const layoutRef = useRef(layout);
  layoutRef.current = layout;

  // Die Bildschirmtastatur: dieselben Finger-Farben wie am Übungsfeld
  // (TypingSession.tsx - nur in Hell/Dunkel, und abschaltbar), und beim
  // Erkunden gilt jede Taste als freigeschaltet.
  const kontrast = useContrast((s) => s.mode);
  const fingerFarben = useTypingA11y((z) => z.fingerFarben);
  const zeigeFingerFarben =
    fingerFarbenVorgabe ?? ((kontrast === "hell" || kontrast === "dunkel") && fingerFarben);
  const alleTasten = useMemo(() => new Set(layout.rows.flatMap((r) => r.keys)), [layout]);

  /** Die Tasten der Suchrunde - dieselben wie im Tasten-Dojo (fn fällt heraus). */
  // D2: am Laptop ohne die Tasten, die es dort nur mit Fn gibt (Einstellung in »Im Griff«).
  const tastaturArt = useTastaturArt();
  const suchbar = useMemo(() => suchbareTasten(plattform, tastaturArt), [plattform, tastaturArt]);
  const suchbarRef = useRef(suchbar);
  suchbarRef.current = suchbar;

  /**
   * ★ 25.09.2026: „Meine Tasten / Alle Tasten" - nur mit `ladeGelernte`.
   * Die gelernten Zeichen werden beim Öffnen geholt und gemerkt; die Wahl
   * bleibt, solange die Seite offen ist (Vorgabe „meine").
   */
  const mitAuswahl = ladeGelernte !== undefined;
  const gegenhandRef = useRef(gegenhand);
  gegenhandRef.current = gegenhand;
  const ladeGelernteRef = useRef(ladeGelernte);
  ladeGelernteRef.current = ladeGelernte;
  const gelerntRef = useRef<readonly string[] | null>(null);
  const [auswahl, setAuswahlState] = useState<FindenAuswahl>("meine");
  const auswahlRef = useRef(auswahl);
  /** Die Tasten der laufenden Runde - ohne Auswahl die Sondertasten wie bisher. */
  const [ziele, setZieleState] = useState<readonly FindenZiel[]>(() => sonderZiele(suchbar));
  const zieleRef = useRef(ziele);

  /** Welcher Modus gerade läuft. Der Ref ist für den Tasten-Horcher. */
  const [modus, setModusState] = useState<ErkundenModus>(startModus);
  const modusRef = useRef(modus);
  /** Der Stand der Suchrunde. Auch hier liest der Horcher den Ref. */
  const [suche, setSucheState] = useState<SuchStand>(NEUE_RUNDE);
  const sucheRef = useRef(suche);
  // Ref und Zustand zugleich setzen: Kommen zwei Tasten schneller, als React
  // zeichnet, liest der zweite Druck schon den neuen Stand.
  const setzeModus = useCallback((m: ErkundenModus) => {
    modusRef.current = m;
    setModusState(m);
  }, []);
  const setzeSuche = useCallback((s: SuchStand) => {
    sucheRef.current = s;
    setSucheState(s);
  }, []);

  /**
   * ★ 23.10.2026 (Testerin): die kleine Prüfung am Ende von „Tasten finden"
   * (`lib/typing/findenPruefung.ts`). `null` = keine läuft. Nur in Tastenflow
   * (`mitAuswahl`) und nur in Sprachen, in denen es sie gibt.
   */
  const [pruefung, setPruefungState] = useState<PruefStand | null>(null);
  const pruefungRef = useRef<PruefStand | null>(null);
  const setzePruefung = useCallback((p: PruefStand | null) => {
    pruefungRef.current = p;
    setPruefungState(p);
  }, []);

  /** Das große Zeichen bzw. der Tastenname in der Mitte (`null` = noch keine Taste). */
  const [gross, setGross] = useState<string | null>(null);
  /** Die zuletzt gedrückte Taste - für die Markierung auf der Bildschirmtastatur. */
  const [gedrueckt, setGedrueckt] = useState<GedrueckteTaste | undefined>(undefined);
  /** Die Zeile für die Braillezeile (Feld) und das Popup. */
  const [zeile, setZeile] = useState(() => erkundenBegruessung(t, plattform));
  const feldRef = useRef<HTMLTextAreaElement>(null);
  /** Das ganze Fenster - Tasten mit einem Ziel ausserhalb gehören einem anderen Fenster (Melden). */
  const wurzelRef = useRef<HTMLDivElement>(null);
  /** ★ `-Infinity` = „noch nie" — mit 0 gälte der ERSTE Esc-Druck als zweiter. */
  const escZeit = useRef(Number.NEGATIVE_INFINITY);
  /**
   * ★★★ 28.09.2026: Tastendrücke, die auf den Kürzel-Katalog von »Im Griff«
   * warten (siehe das Nachlade-`useEffect` unten), in der Reihenfolge, in der
   * sie kamen. Schliesst das Fenster (oder verschwindet die Seite), wird sie
   * geleert - eine Ansage nach dem Schliessen wäre eine Überraschung.
   */
  const wartend = useRef<{ modus: ErkundenModus; zeige: () => void }[]>([]);

  /** `text` geht aufs Feld (Braillezeile) und ins Popup, `ansage` an die Stimme. */
  const sag = useCallback((text: string, ansage: string = text) => {
    setZeile(text);
    (sprichRef.current ?? sprichVorgabe)(spracheRef.current.sprache === "de" ? sprechformDe(ansage) : ansage);
  }, [sprichVorgabe]);

  const schliesse = useCallback(() => {
    escZeit.current = Number.NEGATIVE_INFINITY;
    (sprichRef.current ?? sprichVorgabe)(fensterTexte(spracheRef.current.sprache).beendet);
    onClose();
  }, [onClose, sprichVorgabe]);

  /** In den Modus Erkunden - mit der Begrüßung. */
  const beginneErkunden = useCallback(() => {
    escZeit.current = Number.NEGATIVE_INFINITY;
    setzePruefung(null);
    setzeModus("erkunden");
    setGross(null);
    setGedrueckt(undefined);
    sag(erkundenBegruessung(fensterTexte(spracheRef.current.sprache), plattform));
  }, [sag, setzeModus, setzePruefung, plattform]);

  /** In den Modus Finden - immer eine neue Runde von der ersten Taste an. */
  const setzeZiele = useCallback((liste: readonly FindenZiel[]) => {
    zieleRef.current = liste;
    setZieleState(liste);
  }, []);

  /**
   * Eine Runde mit diesen Tasten beginnen. `vorsatz` (beim Wechsel mit
   * Alt + 5: „Alle Tasten.") ersetzt den Kopf „Tasten finden." samt Ausstieg -
   * das Kind ist ja schon drin.
   */
  const starteRunde = useCallback(
    (liste: readonly FindenZiel[], vorsatz?: string) => {
      const erste = liste[0];
      /* c8 ignore next */
      if (!erste) return;
      escZeit.current = Number.NEGATIVE_INFINITY;
      setzePruefung(null);
      setzeModus("finden");
      setzeZiele(liste);
      setzeSuche(NEUE_RUNDE);
      setGross(null);
      setGedrueckt(undefined);
      const sp = spracheRef.current.sprache;
      sag(vorsatz ? `${vorsatz} ${findenAuftrag(erste, plattform, sp)}` : findenBeginn(erste, sp, plattform));
    },
    [sag, setzeModus, setzeZiele, setzeSuche, setzePruefung, plattform],
  );

  /**
   * In den Modus Finden - immer eine neue Runde. Ohne `ladeGelernte` die
   * Sondertasten von der ersten an (wie bisher), mit ihr 20 zufällige aus
   * „Meine Tasten" bzw. „Alle Tasten". Sind die gelernten Zeichen noch nicht
   * da, wird kurz gewartet - solange ist die Runde leer und jede Taste stumm.
   */
  const beginneFinden = useCallback(
    (vorsatz?: string) => {
      const lade = ladeGelernteRef.current;
      if (!lade) {
        starteRunde(sonderZiele(suchbarRef.current), vorsatz);
        return;
      }
      const mit = (gelernt: readonly string[]) =>
        starteRunde(
          findenZiele({ auswahl: auswahlRef.current, gelernt, plattform, layout: layoutRef.current, tastaturArt: aktiveTastaturArt() }),
          vorsatz,
        );
      if (auswahlRef.current === "alle" || gelerntRef.current) {
        mit(gelerntRef.current ?? []);
        return;
      }
      setzeModus("finden");
      setzeZiele([]);
      setzeSuche(NEUE_RUNDE);
      const weiter = (g: readonly string[]) => {
        gelerntRef.current = g;
        if (modusRef.current === "finden") mit(g);
      };
      lade().then(weiter, () => weiter([]));
    },
    [starteRunde, setzeModus, setzeZiele, setzeSuche, plattform],
  );

  /** „Meine Tasten" ⇄ „Alle Tasten" (Alt + 5 oder die Schalter) - eine neue Runde. */
  const setzeAuswahl = useCallback(
    (neu: FindenAuswahl) => {
      auswahlRef.current = neu;
      setAuswahlState(neu);
      const w = fensterTexte(spracheRef.current.sprache);
      beginneFinden(`${neu === "alle" ? w.alle : w.meine}.`);
    },
    [beginneFinden],
  );

  /** Ein Schalter oben: wechseln (wenn nötig), der Fokus geht zurück ins Feld (R1-R6). */
  const waehle = (ziel: ErkundenModus) => {
    if (ziel !== modusRef.current) {
      if (ziel === "finden") beginneFinden();
      else beginneErkunden();
    }
    // setTimeout 0, nie rAF (Pflichtregel Fokus-Führung).
    window.setTimeout(() => feldRef.current?.focus(), 0);
  };

  /** Ein Schalter „Meine Tasten" / „Alle Tasten": wechseln, Fokus zurück ins Feld. */
  const waehleAuswahl = (neu: FindenAuswahl) => {
    if (neu !== auswahlRef.current || modusRef.current !== "finden") setzeAuswahl(neu);
    window.setTimeout(() => feldRef.current?.focus(), 0);
  };

  /** Die kleine Prüfung am Ende der Runde: vier Fragen, eine nach der anderen. */
  const beginnePruefung = useCallback(() => {
    const sp = spracheRef.current.sprache;
    const fragen = baueFragen({
      plattform,
      layoutId: layoutRef.current.id,
      sprache: sp,
      tastaturArt: aktiveTastaturArt(),
    });
    if (!fragen || fragen.length === 0) return;
    escZeit.current = Number.NEGATIVE_INFINITY;
    const stand = neuerStand(fragen);
    setzePruefung(stand);
    setGedrueckt(undefined);
    sag(pruefungStart(stand, sp));
  }, [plattform, sag, setzePruefung]);

  /** Der Schalter „Kleine Prüfung" am Ende der Runde. */
  const pruefungStarten = () => {
    beginnePruefung();
    window.setTimeout(() => feldRef.current?.focus(), 0);
  };

  /** Der Schalter „Noch einmal suchen" am Ende der Runde. */
  const nochEinmal = () => {
    beginneFinden();
    window.setTimeout(() => feldRef.current?.focus(), 0);
  };

  /**
   * ★ Nr 20 der Fokusziele (22.08.2026): Der Rückweg gehört DIESER Komponente,
   * und es gibt ihn genau einmal. Jeder Übergang offen → zu bringt den Fokus in
   * die Eingabezeile - egal über welchen Ausweg.
   */
  const warOffen = useRef(open);
  useEffect(() => {
    const vorher = warOffen.current;
    warOffen.current = open;
    if (open || !vorher) return;
    (nachSchliessenRef.current ?? focusPracticeField)();
  }, [open]);

  /**
   * ★★★ DER KÜRZEL-KATALOG KOMMT BEIM ÖFFNEN (28.09.2026, Entlastung der
   * Downloads). Was eine Kombination tut („Strg + C - … - kopieren."), steht im
   * Katalog von »Im Griff« - bis heute statisch importiert, damit lud JEDER
   * Tastenflow-Besucher alle Übungsdaten von »Im Griff« mit (`lib/typing/
   * kuerzelKatalog.ts` hat die Zahlen). Jetzt startet das Laden, sobald das
   * Fenster aufgeht.
   *
   * WARUM BEIM ÖFFNEN - UND NICHT IM LEERLAUF DER SEITE: Ein Vorladen im
   * Leerlauf nähme jedem Besucher die Datenmenge nicht ab, es verschöbe sie
   * nur. Beim Öffnen braucht es niemand sofort: Die Begrüßung („Tasten
   * erkunden. Drück irgendeine Taste …") braucht keinen Katalog, und bis sie
   * gesprochen ist, ist er da. Fokus und Begrüßung laufen genau wie vorher.
   *
   * DAS SELTENE DAZWISCHEN: Kommt eine Kombination, bevor der Katalog da ist,
   * wird sie wie immer SOFORT geschluckt (Strg + W darf das Fenster nicht
   * schliessen) - angesagt wird sie aber erst, wenn der Katalog da ist. Nie
   * eine unvollständige Ansage, nie eine verschluckte. Tasten, die danach
   * kommen, reihen sich dahinter ein, damit die Reihenfolge stimmt.
   * Scheitert das Laden (offline), wird mit dem angesagt, was ohne Katalog
   * bekannt ist - wie bei einer Kombination, die der Katalog nicht kennt.
   */
  const warteschlangeAbarbeiten = useCallback(() => {
    const liste = wartend.current;
    wartend.current = [];
    for (const w of liste) {
      // In den anderen Modus gewechselt: Die Ansage wäre überholt -
      // der Wechsel hat schon seine eigene gemacht.
      if (modusRef.current !== w.modus) continue;
      w.zeige();
    }
  }, []);
  useEffect(() => {
    if (!open) return;
    ladeKuerzelKatalog().then(warteschlangeAbarbeiten, warteschlangeAbarbeiten);
    return () => {
      wartend.current = []; // zu oder weg: nichts mehr nachsagen
    };
  }, [open, warteschlangeAbarbeiten]);

  // Betreten: ansagen, wie es geht UND wie man wieder herauskommt - im Modus,
  // mit dem die Seite geöffnet hat.
  useEffect(() => {
    if (!open) return;
    // Die gelernten Zeichen je Öffnen frisch - das Kind lernt dazwischen dazu.
    gelerntRef.current = null;
    if (startModusRef.current !== "finden" && ladeGelernteRef.current) {
      ladeGelernteRef.current().then(
        (g) => {
          gelerntRef.current = g;
        },
        () => undefined,
      );
    }
    if (startModusRef.current === "finden") beginneFinden();
    else beginneErkunden();
    // Fokus ins Feld (setTimeout 0, nie rAF — Pflichtregel Fokus-Führung).
    const t = window.setTimeout(() => feldRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [open, beginneErkunden, beginneFinden]);

  /*
   * Nach jeder neuen Zeile: Schreibmarke auf Zelle 1 - und zwar über einen
   * kleinen UMWEG.
   *
   * ★★★★ Gemessen mit echtem NVDA (12.09.2026, erkunden-braille-nachher-2):
   * NVDA liest das Feld nur neu, wenn sich die Schreibmarke BEWEGT. Beim Pfeil
   * nach links kam die neue Erklärung auf die Zeile (NVDA bewegt dort selbst),
   * bei Tab, Umschalt, Strg, Punkt, AltGr + E, Enter und Esc blieb die ALTE
   * stehen: Der Wert war neu, die Schreibmarke stand vorher wie nachher auf 0,
   * und NVDA bekam kein Zeichen, dass sich etwas geändert hat.
   * Darum erst auf 1, einen Augenblick später zurück auf 0 - zwei echte
   * Bewegungen. In EINEM Durchlauf fasst der Browser beide zu keiner zusammen.
   * Nachher gemessen (erkunden-braille-nachher-3): 8 von 8 Tasten.
   * ★ Gilt unverändert für beide Modi - auch „Tasten finden" schreibt nur `zeile`.
   */
  useEffect(() => {
    const f = feldRef.current;
    if (!f) return;
    f.setSelectionRange(Math.min(1, f.value.length), Math.min(1, f.value.length));
    const t = window.setTimeout(() => {
      f.setSelectionRange(0, 0);
      f.scrollLeft = 0;
    }, 30);
    return () => window.clearTimeout(t);
  }, [zeile, open]);

  useEffect(() => {
    if (!open) return;

    /** Ein Tastendruck im Modus Finden - die Schritte aus `tastenSuche.ts`. */
    const findenTaste = (e: KeyboardEvent, einmalEsc: boolean) => {
      const sp = spracheRef.current.sprache;
      const w = fensterTexte(sp);
      const escNachsatz = einmalEsc ? ` ${w.escHinweis}` : "";
      const taste = tasteFuerEreignis(e, plattform);
      const stand = sucheRef.current;

      // ★ 23.10.2026: Läuft die kleine Prüfung, gehören die Tasten ihr.
      const pStand = pruefungRef.current;
      if (pStand) {
        if (pStand.index >= pStand.fragen.length) {
          // Zu Ende: Eingabetaste = noch einmal suchen, sonst die Wahl nennen.
          if (taste && (taste.id === "eingabe" || taste.id === "zeilenschalter")) {
            beginneFinden();
            return;
          }
          sag(findenWahl(plattform, sp) + escNachsatz);
          return;
        }
        const p = pruefSchritt({ e, stand: pStand, plattform, sprache: sp });
        if (!p) return;
        setzePruefung(p.stand);
        if (p.art === "weiter") playSuccessSound();
        if (p.art === "fertig") playUnlockFanfare();
        sag(`${p.ansage}${p.art === "fertig" ? ` ${findenWahl(plattform, sp)}` : ""}${escNachsatz}`);
        return;
      }

      if (stand.fertig) {
        // Am Ende der Runde startet P die kleine Prüfung (nur Tastenflow).
        if (ladeGelernteRef.current && pruefungGibtEs(sp) && istPruefungsTaste(e)) {
          beginnePruefung();
          return;
        }
        // Die Wahl am Ende: Eingabetaste = noch einmal (Alt + 4 steht oben).
        if (taste && (taste.id === "eingabe" || taste.id === "zeilenschalter")) {
          beginneFinden();
          return;
        }
        sag(findenWahl(plattform, sp) + escNachsatz);
        return;
      }

      // ★ 25.09.2026: Mit „Meine/Alle Tasten" (Tastenflow) entscheidet
      // `findenSchritt` - dort stehen auch Zeichen in der Runde, und die Sätze
      // kommen schon in der Bedienungssprache.
      const schritt = ladeGelernteRef.current
        ? findenSchritt({
            e,
            ziele: zieleRef.current,
            index: stand.index,
            bestaetigt: stand.bestaetigt,
            dazwischen: stand.dazwischen,
            plattform,
            layout: layoutRef.current,
            sprache: sp,
            ...(stand.seite ? { seite: stand.seite } : {}),
            tastaturArt: aktiveTastaturArt(),
            gegenhand: gegenhandRef.current,
            // Nur wenn genau EINE Umschalttaste unten ist, ist die Seite bekannt.
            shiftGehalten: shiftLinks !== shiftRechts ? (shiftLinks ? "links" : "rechts") : null,
            ...(e.key === "CapsLock" ? { feststellAn: e.getModifierState?.("CapsLock") === true } : {}),
          })
        : (() => {
            const deutsch = suchSchritt(taste, suchbarRef.current, stand.index, stand.bestaetigt, stand.dazwischen);
            if (!deutsch) return null;
            // ★ EN1: WAS geschieht, entscheidet `suchSchritt` - englisch (★ E11a-5:
            // und französisch) werden nur die Wörter neu gesetzt (`SUCH_SATZ`).
            const satz = SUCH_SATZ[sp];
            return satz
              ? { ...deutsch, ansage: satz(deutsch.art, taste, suchbarRef.current, stand.index, plattform) }
              : deutsch;
          })();
      if (!schritt) return;
      switch (schritt.art) {
        case "daneben":
          // Kein Tadel - die Taste wird benannt, die Aufgabe bleibt.
          if (stand.bestaetigt && !stand.dazwischen) setzeSuche({ ...stand, dazwischen: true });
          sag(schritt.ansage + escNachsatz);
          return;
        case "seite":
          // Eine Seite von zweien (Shift, Strg …): gemerkt, die andere fehlt noch.
          setzeSuche({ ...stand, seite: schritt.seite });
          if (schritt.neu) playSuccessSound();
          sag(schritt.ansage + escNachsatz);
          return;
        case "gefunden":
          setzeSuche({ ...stand, bestaetigt: true });
          // Der Erfolgston nur beim ERSTEN Treffer - derselbe Druck noch einmal ist kein Fortschritt.
          if (!stand.bestaetigt) playSuccessSound();
          sag(schritt.ansage + (einmalEsc ? ` ${w.escWarten}` : ""));
          return;
        case "weiter":
          setzeSuche({ index: schritt.naechste, bestaetigt: false, dazwischen: false, fertig: false });
          playSuccessSound();
          sag(schritt.ansage + escNachsatz);
          return;
        case "fertig":
          setzeSuche({ index: stand.index, bestaetigt: false, dazwischen: false, fertig: true });
          playUnlockFanfare();
          sag(
            `${schritt.ansage} ${findenWahl(plattform, sp)}${
              ladeGelernteRef.current && pruefungGibtEs(sp) ? ` ${pruefungHinweis(sp)}` : ""
            }${escNachsatz}`,
          );
          return;
      }
    };

    // ★ Testerin 24.10.2026: „Win öffnet das Startmenü, Druck öffnet Snipping Tool
    // … Wenn solche Dinge passieren, bleibt die Sprache aus." Beide Tasten
    // gehören Windows - keine Seite kann sie aufhalten. Darum: die zuletzt
    // gedrückte Taste merken und bei der Rückkehr ins Fenster sagen, was war.
    let letzte = { key: "", zeit: Number.NEGATIVE_INFINITY };
    let draussen = false;
    // Druck meldet der Browser unter Windows oft NUR beim Loslassen.
    let druckUnten = false;

    // ★ 28.10.2026: Alt + Umschalt + P (Melden mit Bild) öffnet sein Fenster
    // ÜBER diesem - und bis dahin schluckte und erklärte das Erkunden auch jede
    // Taste, die dort ins Textfeld sollte (gemessen im Browser: Rücktaste ⇒
    // „Backspace - Löschtaste …", das Feld blieb gleich). Ein Tastendruck,
    // dessen Ziel ausserhalb dieses Fensters liegt, gehört dem anderen Fenster.
    // `body` zählt als „hier" - dorthin fällt der Fokus nach einem Klick ins Leere.
    const gehoertWoandershin = (e: Event) => {
      const ziel = e.target;
      const wurzel = wurzelRef.current;
      return (
        ziel instanceof Node &&
        !!wurzel &&
        !wurzel.contains(ziel) &&
        ziel !== document.body &&
        ziel !== document.documentElement &&
        ziel !== document
      );
    };

    // ★ 28.10.2026, gemessen am Windows-PC (Edge, deutsche Tastatur): AltGr
    // schickt 0,1 ms VOR AltRight ein eigenes keydown `Control`/`ControlLeft`.
    // Das Erkunden sagte darum erst „Steuerungstaste …" und dann AltGr; in
    // „Tasten finden" zählte dieses Strg sogar als „andere Taste dazwischen",
    // und zweimal AltGr hintereinander galt als gefunden. Strg links wartet
    // darum kurz - kommt AltRight, war es keins.
    let strgWartet: number | undefined;
    const nachgereicht = new WeakSet<KeyboardEvent>();

    // Welche Umschalttaste gerade unten ist - `shiftKey` sagt nur „eine".
    let shiftLinks = false;
    let shiftRechts = false;
    const merkeShift = (e: KeyboardEvent, unten: boolean) => {
      if (e.code === "ShiftLeft") shiftLinks = unten;
      else if (e.code === "ShiftRight") shiftRechts = unten;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      merkeShift(e, true);
      if (gehoertWoandershin(e)) return;
      if (plattform !== "macos" && e.code === "ControlLeft" && !nachgereicht.has(e)) {
        e.preventDefault();
        e.stopPropagation();
        window.clearTimeout(strgWartet);
        strgWartet = window.setTimeout(() => {
          strgWartet = undefined;
          nachgereicht.add(e);
          onKeyDown(e);
        }, ALTGR_STRG_FENSTER_MS);
        return;
      }
      if (e.code === "AltRight" && strgWartet !== undefined) {
        window.clearTimeout(strgWartet);
        strgWartet = undefined;
      }
      letzte = { key: e.key, zeit: performance.now() };
      if (e.key === "PrintScreen") druckUnten = true;

      // AltGr (unter Windows als Strg + Alt gemeldet) holt Zeichen - das ist
      // Lernstoff, keine App-Kombination.
      const altGr = e.getModifierState?.("AltGraph") === true;

      // Ausweg 1: Alt + 3 (Johannes' Wunsch) — vor allem anderen, in BEIDEN Modi.
      // AltGr + 3 ist „³" und KEIN Ausweg.
      if (e.altKey && !altGr && (e.code === "Digit3" || e.code === "Numpad3")) {
        e.preventDefault();
        e.stopPropagation();
        schliesse();
        return;
      }
      // ★ 13.09.2026: Alt + 4 wechselt zwischen Erkunden und Finden. Über den
      // Code wie Alt + 3 - am Mac liefert Option + 4 ein Zeichen.
      if (e.altKey && !altGr && (e.code === "Digit4" || e.code === "Numpad4")) {
        e.preventDefault();
        e.stopPropagation();
        if (modusRef.current === "finden") beginneErkunden();
        else beginneFinden();
        return;
      }
      // ★ 25.09.2026: Alt + 5 wechselt in „Tasten finden" zwischen „Meine
      // Tasten" und „Alle Tasten" - nur in Tastenflow, nur im Modus Finden.
      // Sonst bleibt es eine Kombination, die erklärt wird.
      if (
        ladeGelernteRef.current &&
        modusRef.current === "finden" &&
        e.altKey &&
        !altGr &&
        (e.code === "Digit5" || e.code === "Numpad5")
      ) {
        e.preventDefault();
        e.stopPropagation();
        setzeAuswahl(auswahlRef.current === "meine" ? "alle" : "meine");
        return;
      }
      // ★ Testerin 04.11.2026 (Meldung uk6ceu327wzkbaa): „Hier komme ich mit Tab
      // nicht zur Prüfung." Am Ende der Runde ist Tab kein Lernstoff mehr -
      // dann führt Tab durch die Schalter darunter („Noch einmal suchen",
      // „Kleine Prüfung") und wieder zurück ins Feld, Umschalt + Tab rückwärts.
      // Auf einem dieser Schalter gehören Eingabetaste und Leertaste dem
      // Schalter; Esc bringt in die Zeile zurück. Läuft die Prüfung, bleibt
      // Tab eine Antwort. Nur in Tastenflow (»Im Griff« hat dort keine Prüfung).
      const pLaeuft = pruefungRef.current !== null && pruefungRef.current.index < pruefungRef.current.fragen.length;
      const amEnde = ladeGelernteRef.current && modusRef.current === "finden" && sucheRef.current.fertig && !pLaeuft;
      const endeGruppe = wurzelRef.current?.querySelector<HTMLElement>("[data-finden-ende]") ?? null;
      if (amEnde && endeGruppe && e.key === "Tab" && !e.altKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        e.stopPropagation();
        const feld = feldRef.current;
        const reihe = [
          ...(feld ? [feld as HTMLElement] : []),
          ...Array.from(endeGruppe.querySelectorAll<HTMLElement>("button")),
        ];
        const jetzt = reihe.indexOf(document.activeElement as HTMLElement);
        const weiter = (jetzt < 0 ? 0 : jetzt + (e.shiftKey ? reihe.length - 1 : 1)) % reihe.length;
        reihe[weiter]?.focus();
        return;
      }
      if (amEnde && endeGruppe && e.target instanceof Node && endeGruppe.contains(e.target)) {
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          feldRef.current?.focus();
        }
        // Alles andere gehört dem Schalter (Eingabetaste, Leertaste).
        return;
      }

      // Die eigenen Kürzel von Tastenflow (Alt + H Hilfe, Alt + V Vorlesen …)
      // gehören der Seite - durchreichen, nicht ansagen. Wie in »im Griff«.
      // ★ »Im Griff« übergibt hier seine eigenen Kürzel (`durchreichen`).
      if ((durchreichenRef.current ?? gehoertDerSeite)(e, plattform, altGr)) return;

      // Ausweg 2: zweimal Esc. Einmal Esc ist Lernstoff und wird angesagt.
      let einmalEsc = false;
      if (e.key === "Escape" && !e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey) {
        // performance.now statt e.timeStamp — im Test stellbar (Lehre 07.08.).
        const jetzt = performance.now();
        if (jetzt - escZeit.current < ESC_FENSTER_MS) {
          e.preventDefault();
          e.stopPropagation();
          schliesse();
          return;
        }
        escZeit.current = jetzt;
        einmalEsc = true;
      }

      const optionen = {
        layout: layout.id,
        altGr,
        // ★ Testerin 24.10.2026: ob die Feststelltaste nach diesem Druck an ist.
        ...(e.key === "CapsLock" ? { feststellAn: e.getModifierState?.("CapsLock") === true } : {}),
        // Nur mit aktivem Sprach-Anbieter englisch oder (★ E11a-5) französisch -
        // »Im Griff« hat keinen Anbieter, bekommt „de" und damit KEINE Angabe,
        // genau wie vorher.
        ...(spracheRef.current.sprache !== "de" ? { sprache: spracheRef.current.sprache } : {}),
      };
      const aus = erkundeTaste(e, plattform, optionen);
      // Sondertasten, Zeichen, Kombinationen, F-Tasten und die Menü-Taste
      // werden geschluckt; Unbekanntes bleibt dem Browser. Im Modus Finden
      // genauso.
      if (aus.schlucken) {
        e.preventDefault();
        e.stopPropagation();
      }
      // Markiert wird immer die GEDRÜCKTE Taste - nie die gesuchte.
      setGedrueckt({ code: e.code, key: e.key });

      if (modusRef.current === "finden") {
        findenTaste(e, einmalEsc);
        return;
      }
      const escHinweis = einmalEsc ? ` ${fensterTexte(spracheRef.current.sprache).escHinweis}` : "";
      // ★ O-CS (03.10.2026): gilt auch für cs - die tschechische Stimme bekommt die Kappe unverändert („Shift",
      // „Ctrl"); ob Zuzana sie richtig spricht, ist UNGEMESSEN (Messliste cs) - keine Sprechform erfunden.
      const zeige = (a: typeof aus) => {
        setGross(a.gross);
        // ★ O-TR (02.10.2026, Glossar §6 Nr. 8): türkisch spricht die Stimme „şift"/„kontrol",
        // auf Feld und Braillezeile bleibt die Kappe („Shift", „Ctrl") - Vorgabe, ungemessen.
        const ansage = spracheRef.current.sprache === "tr" ? sprechformTr(a.ansage) : a.ansage;
        sag(a.zeile + escHinweis, ansage + escHinweis);
      };
      // ★★★ 28.09.2026: Kombination vor dem Katalog - oder es wartet schon
      // etwas: hinten anstellen (siehe `warteschlangeAbarbeiten`). Beim
      // Abarbeiten wird die Kombination NEU gefragt, jetzt mit Katalog.
      if (aus.katalogFehlt || wartend.current.length > 0) {
        wartend.current.push({
          modus: "erkunden",
          zeige: () => zeige(aus.katalogFehlt ? erkundeTaste(e, plattform, optionen) : aus),
        });
        ladeKuerzelKatalog().then(warteschlangeAbarbeiten, warteschlangeAbarbeiten);
        return;
      }
      zeige(aus);
    };

    // ★ Testerin 24.10.2026: „Kontexttaste öffnet Kontextmenü". Die Menü-Taste
    // schickt nach dem Tastendruck ein eigenes Ereignis `contextmenu` - das
    // Verhindern des Tastendrucks hält es nicht auf. Solange das Fenster offen
    // ist, braucht es kein Kontextmenü.
    const onContextMenu = (e: Event) => e.preventDefault();

    // Druck ohne eigenes keydown: beim Loslassen wie einen Druck behandeln.
    const onKeyUp = (e: KeyboardEvent) => {
      merkeShift(e, false);
      if (e.key !== "PrintScreen" || gehoertWoandershin(e)) return;
      if (!druckUnten) onKeyDown(e);
      druckUnten = false;
    };

    const onBlur = () => {
      shiftLinks = false;
      shiftRechts = false;
      draussen = true;
    };
    const onFocus = () => {
      if (!draussen) return;
      draussen = false;
      const w = fensterTexte(spracheRef.current.sprache);
      // Nur eine Taste kurz vor dem Verlassen zählt als Ursache.
      const taste = performance.now() - letzte.zeit < RUECKKEHR_FENSTER_MS ? letzte.key : "";
      sag(
        taste === "PrintScreen"
          ? w.zurueckDruck
          : (taste === "Meta" || taste === "OS") && plattform !== "macos"
            ? w.zurueckWin
            : w.zurueck,
      );
    };

    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("keyup", onKeyUp, true);
    document.addEventListener("contextmenu", onContextMenu, true);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("keyup", onKeyUp, true);
      document.removeEventListener("contextmenu", onContextMenu, true);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      window.clearTimeout(strgWartet);
    };
  }, [
    open,
    plattform,
    layout.id,
    sag,
    schliesse,
    beginneErkunden,
    beginneFinden,
    setzeSuche,
    setzeAuswahl,
    setzePruefung,
    beginnePruefung,
    warteschlangeAbarbeiten,
  ]);

  if (!open) return null;

  const gesucht = ziele[suche.index];
  const finden = modus === "finden";
  const kappe = !finden && gross !== null;
  const nurKappe = kappe && zeile.trim() === gross;

  return (
    <div
      ref={wurzelRef}
      className="fixed inset-0 z-50 flex flex-col bg-surface p-6"
      role="application"
      aria-label={t.fensterName}
    >
      <div
        className={
          // ★ 22.09.2026: `bedien-schlank` am GANZEN Kopf, nicht nur an der
          // Modus-Gruppe - sonst war „Beenden" 44 px hoch neben zwei 36-px-
          // Schaltern (Johannes: „größer wie die anderen, mach sie gleich").
          kopfKompakt
            ? "bedien-schlank flex flex-wrap items-start gap-3"
            : "bedien-schlank flex items-start justify-between gap-3"
        }
      >
        <h2 className="m-0 text-xl font-semibold text-ink">
          <span aria-hidden="true">🔎 </span>{t.titel}
        </h2>
        {/* ★ 13.09.2026: die zwei Modi. Mit der Tastatur wechselt Alt + 4 (Tab
            ist hier Lernstoff); nach einem Klick geht der Fokus ins Feld zurück. */}
        <div role="group" aria-label={t.modus} className="flex flex-wrap items-center gap-2">
          <Tipp text={t.tippErkunden} ausrichtung="links">
            {(hinweisId) => (
              <button
                type="button"
                className={schalterKlasse(!finden)}
                aria-pressed={!finden}
                aria-describedby={hinweisId}
                aria-keyshortcuts="Alt+4"
                onClick={() => waehle("erkunden")}
              >
                {t.erkunden}
              </button>
            )}
          </Tipp>
          <Tipp text={t.tippFinden} ausrichtung="links">
            {(hinweisId) => (
              <button
                type="button"
                className={schalterKlasse(finden)}
                aria-pressed={finden}
                aria-describedby={hinweisId}
                aria-keyshortcuts="Alt+4"
                onClick={() => waehle("finden")}
              >
                {t.finden}
              </button>
            )}
          </Tipp>
        </div>
        {/* ★ 25.09.2026: „Meine Tasten / Alle Tasten" - nur in Tastenflow und
            nur beim Finden. Mit der Tastatur wechselt Alt + 5. */}
        {mitAuswahl && finden && (
          <div role="group" aria-label={t.auswahl} className="flex flex-wrap items-center gap-2">
            <Tipp text={t.tippMeine} ausrichtung="links">
              {(hinweisId) => (
                <button
                  type="button"
                  className={schalterKlasse(auswahl === "meine")}
                  aria-pressed={auswahl === "meine"}
                  aria-describedby={hinweisId}
                  aria-keyshortcuts="Alt+5"
                  onClick={() => waehleAuswahl("meine")}
                >
                  {t.meine}
                </button>
              )}
            </Tipp>
            <Tipp text={t.tippAlle} ausrichtung="links">
              {(hinweisId) => (
                <button
                  type="button"
                  className={schalterKlasse(auswahl === "alle")}
                  aria-pressed={auswahl === "alle"}
                  aria-describedby={hinweisId}
                  aria-keyshortcuts="Alt+5"
                  onClick={() => waehleAuswahl("alle")}
                >
                  {t.alle}
                </button>
              )}
            </Tipp>
          </div>
        )}
        {/* Die MAUS-Tür hinaus — per Tastatur gelten Alt+3 / zweimal Esc. */}
        <button type="button" className="btn-secondary" onClick={schliesse}>
          {t.beenden}
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 overflow-y-auto">
        {finden ? (
          // Für Sehende: der Auftrag und der Stand. Gelesen wird die Zeile aus
          // dem Feld - darum `aria-hidden`, sonst stünde alles doppelt.
          <div aria-hidden="true" className="flex flex-col items-center gap-1 text-center">
            <p className="m-0 text-xl font-bold text-ink">
              {pruefung
                ? pruefungZaehler(pruefung, sprache)
                : suche.fertig
                ? t.alleGefunden
                : suche.seite
                  ? seitenSatz(suche.seite, sprache)
                  : suche.bestaetigt
                  ? gesucht
                    ? findenGefunden(gesucht, plattform, sprache)
                    : ""
                  : gesucht
                    ? // Ohne die Lage (die steht im Popup) - kurz dann lang, mit
                      // Artikel aus dem Wörterbuch.
                      findenAuftragKurz(gesucht, plattform, sprache)
                    : ""}
            </p>
            {!suche.fertig && ziele.length > 0 && (
              <p className="m-0 text-base text-ink-muted">
                {t.tasteVon(suche.index + 1, ziele.length)}
              </p>
            )}
          </div>
        ) : gross === null ? (
          <p aria-hidden="true" className="m-0 text-xl text-ink-soft">
            {t.drueck}
          </p>
        ) : null}

        {/* Am Ende der Runde: noch einmal (Eingabetaste) - zurück geht es oben. */}
        {finden && suche.fertig && (
          <div data-finden-ende className="flex flex-wrap items-center justify-center gap-3">
            <button type="button" className="btn-primary" onClick={nochEinmal}>
              {t.nochEinmal}
            </button>
            {mitAuswahl && pruefungGibtEs(sprache) && !pruefung && (
              <button
                type="button"
                className="btn-secondary"
                aria-keyshortcuts="P"
                onClick={pruefungStarten}
              >
                {pruefungKnopf(sprache)}
              </button>
            )}
          </div>
        )}

        {/* Das Popup für Sehende: genau die Wörter, die auf der Braillezeile
            stehen. `aria-hidden` - gelesen wird die Zeile aus dem Feld darunter.
            Im Modus Finden steht es von Anfang an da (der Auftrag).
            ★ 22.09.2026 (Johannes): EIN Fenster vorne statt Riesen-Buchstabe
            dahinter - der stand hinter dem Popup und war abgeschnitten. Die
            Taste steht jetzt als Tastenkappe IM Fenster, und der Vorspann
            „Auf der Braillezeile steht:" ist weg: Die Wörter kommen auf die
            Zeile, das Fenster muss es nicht dazuschreiben.
            AUSNAHME (E7, §2.7 des Umbauplans): die Kappe ist gross - sie ist
            hier der Inhalt der Übung, kein Schmuck. */}
        {(gross !== null || finden) && (
          <div
            aria-hidden="true"
            data-erkunden-popup
            className={
              "card flex w-full max-w-3xl items-center gap-5 rounded-2xl border-2 border-accent p-5 shadow-lg" +
              (nurKappe ? " justify-center" : "")
            }
          >
            {kappe && (
              <span className="text-5xl inline-flex h-24 min-w-24 max-w-[40%] shrink-0 items-center justify-center truncate rounded-xl border-2 border-hairline border-b-4 bg-surface-raised px-4 font-legible font-bold leading-none text-ink">
                {gross}
              </span>
            )}
            {/* Bei einem Buchstaben ist die Zeile nur das Zeichen - es stünde
                sonst zweimal da. */}
            {!nurKappe && <p className="m-0 text-xl font-semibold text-ink">{zeile}</p>}
          </div>
        )}

        {/* Die Bildschirmtastatur mit der gedrückten Taste (rein optisch,
            `aria-hidden` sitzt in `Keyboard`). ⚠️ Keine nächste Taste
            übergeben: Im Modus Finden wäre sie die Lösung. */}
        <div className="w-full max-w-4xl">
          <KeyboardPanel
            immerOffen
            gedrueckt={gedrueckt}
            unlocked={alleTasten}
            showFingerColors={zeigeFingerFarben}
            vollstaendig={plattform === "macos" ? "mac" : "windows"}
          />
          {/* ★ Testerin 24.10.2026: „Man könnte einen Hinweis schreiben, dass das
              ein Symbolbild ist, da sich Tastaturen unterscheiden können." */}
          <p className="m-0 mt-1.5 text-center text-sm text-ink-muted">
            {t.tastaturHinweis}{" "}
            {/* ★ Testerin 24.10.2026: „Das könnte man in einer Einführung auch erwähnen.
                Also, wie man Zweit- und Drittbelegung drückt" - auf dem Schirm, nicht
                in der Begrüßung (die soll kurz bleiben, Johannes 23.09.). */}
            {plattform === "macos" ? t.belegungMac : t.belegung}
          </p>
        </div>

        {/* Die Braillezeile: EIN Feld, eine Zeile, kein Umbruch. Siehe Kopf. */}
        <textarea
          ref={feldRef}
          data-erkunden-zeile
          data-kuerzel="an"
          aria-label={t.fensterName}
          className="sr-only"
          rows={1}
          wrap="off"
          tabIndex={-1}
          value={zeile}
          // Der Wert ist fest die Zeile - Eingaben ändern nichts, ohne das Feld
          // als „schreibgeschützt" zu kennzeichnen (wie das Übungsfeld).
          onChange={() => {}}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          style={{ whiteSpace: "pre", resize: "none" }}
        />
      </div>

      <p className="m-0 text-center text-sm font-medium text-ink-muted">
        {finden ? t.zuErkunden : t.zuFinden}{" "}
        {finden && mitAuswahl ? `${auswahl === "meine" ? t.zuAlle : t.zuMeine} ` : ""}
        {t.ausstieg}{" "}
        {/* ★ Testerin 24.10.2026: „Melde-Button auf die Seite???" - Tab ist hier Lernstoff,
            ein Schalter wäre nicht erreichbar. Das Kürzel wirkt überall (`MeldenKuerzel`). */}
        {t.melden}
      </p>
    </div>
  );
}
