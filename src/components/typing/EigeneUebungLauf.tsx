/**
 * ★★★ „EIGENE ÜBUNG" AUS DER SICHT DES KINDES (17.09.2026).
 *
 * Auftrag Johannes, 17.09.2026: Die Lehrkraft lädt eine Datei hoch, die ganze
 * Klasse übt genau diesen Text - unabhängig vom Lernstand. Zählt zur Übezeit,
 * die Tasten werden gemessen, aber keine neue Taste wird dadurch freigeschaltet
 * (der Zeichenvorrat kommt aus der Datei, nicht aus dem Lehrplan).
 *
 * ── Warum keine Prüfungs-Markierung ─────────────────────────────────────────
 * Anders als die Tippchallenge (`SchreibprobeLauf`, gestrichelter Warn-Rahmen)
 * ist das hier eine gewöhnliche Übung mit vorgegebenem Text - keine Prüfung,
 * kein Zeitdruck, keine Rangliste. Eine Prüfungs-Optik wäre hier eine Wertung
 * gegen eine Übung, die keine ist.
 *
 * ── Warum echte Tastenstatistik, aber `wendeRundenendeAn` NIE aufgerufen ────
 * Genau wie in `SerienTrainer` fliesst jede Zeile über
 * `onLetters` in die echte Tastenstatistik (`mergeLetters`, über
 * `useEigeneUebung.meldeFortschritt`) - dieses Kind soll an SEINEN Buchstaben
 * gemessen werden, auch wenn der Text sie nicht in Lehrplan-Reihenfolge bringt.
 * Was hier NICHT passiert: `tastenfreischaltung.wendeRundenendeAn()` wird nie
 * importiert - eine Übung mit fremdem Zeichenvorrat darf das Tor zur nächsten
 * Taste weder öffnen noch zuschlagen.
 *
 * ── Wann „fertig" gilt: am Server nach der letzten Zeile, auf dem Bildschirm
 *    erst nach dem Schliessen der Karte ──
 * Dieselbe Regel wie bei der Tippchallenge (`KindStand.gesehen`): Die
 * Abschluss-Karte von `TypingSession` (Sterne, Rückmeldung) muss stehen
 * bleiben, bis das Kind sie schliesst - `meldeFortschritt({fertig: true})`
 * passiert darum erst in `onRetry`, nicht in `onSessionDone`. Sonst wechselte
 * die Ternäre in `TippenTrainerPage` mitten in der Feier weiter (zur nächsten
 * Übung der Reihe oder ins normale Training) und risse die Karte weg. Am
 * SERVER steht die Übung seit Z1 (19.09.2026) schon nach der letzten Zeile als
 * fertig - warum, steht in `useEigeneUebung.ts`.
 *
 * ── Die Zeile, die gemeldet wird (Z1, 19.09.2026) ───────────────────────────
 * Gezählt wird ab der Zeile, an der DIESER Lauf begann - einmal festgehalten,
 * nicht bei jedem Rendern neu aus `stand.startZeile` gelesen. Bis dahin las
 * die Meldung `startZeile` frisch, und die wuchs nach jeder Zeile mit: Zeile
 * 1 meldete 1, Zeile 2 meldete 1 + 2 = 3, Zeile 3 meldete 3 + 3 = 6. Wer die
 * Seite neu lud, sprang Zeilen weiter, als er geschrieben hatte.
 */
import { useMemo, useRef } from "react";
import {
  EIGENE_UEBUNG_WORT,
  zeichenabstandFaktor,
  type KeyEvent,
  type Lang,
  type Stufe,
  type TaskEvent,
  type TypingAccount,
  useVoice,
} from "@/lib/typing";
import type { EigeneUebungStand } from "@/lib/typing/useEigeneUebung";
import { lernwegVon } from "@/lib/typing/lernweg";
import { texte, useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";
import { woerterAusEigenemText } from "@/lib/typing/eigeneWoerter";
import { TypingSession } from "./TypingSession";

const KONTEXT_ID = "eigene-uebung";

/**
 * ★ Wie die Sache aus Sicht des KINDES heisst (EN1, 19.09.2026) - für die
 * Überschrift hier und für die Kopfzeile (`TippenTrainerPage`, `bereich`).
 *
 * Deutsch ist es {@link EIGENE_UEBUNG_WORT}, dasselbe Wort wie bei der
 * Lehrkraft. Englisch trennt das Glossar (§3.8, §5 Nr 9): Die Lehrkraft liest
 * „Custom exercise", das Kind „an exercise from your teacher" - ein Kind hat
 * die Übung nicht „angepasst", sie kommt von jemandem.
 * ⚠️ Bewusst HIER und nicht in `eigenerText.ts`: Das englische Lehrkraft-Wort
 * gehört dem Lehrkraft-Bereich (eigene Etappe).
 */
const EIGENE_UEBUNG_NAME: Record<BedienSprache, string> = {
  de: EIGENE_UEBUNG_WORT,
  en: "Exercise from your teacher",
  // ★ E11a: wie EN, aus Sicht des Kindes formuliert - Glossar §9.2.
  fr: "Un texte de la classe",
  // ★ ES-O (27.09.2026): aus Sicht des Kindes - „un texto de la clase".
  es: "Un texto de la clase",
  // ★ O-IT (02.10.2026): aus Sicht des Kindes - Glossar §2.3 „Esercizio dell'insegnante".
  it: "Esercizio dell'insegnante",
  // ★ O-PL (02.10.2026): aus Sicht des Kindes - Glossar §2.2 „Ćwiczenie dla
  // klasy" (nie „od nauczyciela", das wäre gegendert).
  pl: "Ćwiczenie dla klasy",
  // ★ O-TR (02.10.2026): aus Sicht des Kindes - Glossar §2.2 "Öğretmenden alıştırma".
  tr: "Öğretmenden alıştırma",
  // ★ O-CS (03.10.2026): aus Sicht des Kindes - Glossar §2.2 „Cvičení ze
  // školy" (nie „od učitele", das wäre gegendert).
  cs: "Cvičení ze školy",
  // ★ O2-COMP (30.10.2026): die neun Sprachen mit eigener Fassung.
  bg: "Упражнение от училище",
  el: "Άσκηση από το σχολείο",
  hu: "Iskolai gyakorlat",
  nl: "Oefening van de leerkracht",
  pt: "Exercício da escola",
  br: "Exercício da escola",
  ro: "Exercițiu de la școală",
  sv: "Från läraren",
  uk: "Шкільна вправа",
};
export function eigeneUebungName(sprache: BedienSprache): string {
  return EIGENE_UEBUNG_NAME[sprache];
}

/** Die übrigen Texte dieses Laufs (EN1). Deutsch wortgleich wie vorher. */
const LAUF_TEXTE = texte({
  de: { laedt: "Der zugewiesene Text wird geladen …", weiterUeben: "Weiter üben" },
  en: { laedt: "Loading the text from your teacher …", weiterUeben: "Keep practising" },
  fr: { laedt: "Chargement du texte attribué …", weiterUeben: "Continuer à s'exercer" },
  es: { laedt: "Cargando el texto asignado …", weiterUeben: "Seguir practicando" },
  it: { laedt: "Caricamento dell'esercizio...", weiterUeben: "Continua a esercitarti" },
  // ★ O-PL (02.10.2026).
  pl: { laedt: "Ładowanie ćwiczenia...", weiterUeben: "Ćwicz dalej" },
  // ★ O-TR (02.10.2026): sen, Knopf im Stamm.
  tr: { laedt: "Öğretmeninin metni yükleniyor...", weiterUeben: "Çalışmaya devam et" },
  // ★ O-CS (03.10.2026): „se"-Satz, Knopf im Infinitiv.
  cs: { laedt: "Načítá se cvičení...", weiterUeben: "Cvičit dál" },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: { laedt: "Зареждане на текста от училище...", weiterUeben: "Упражнявай се още" },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: { laedt: "Φόρτωση του κειμένου από το σχολείο...", weiterUeben: "Συνέχεια εξάσκησης" },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: { laedt: "A tanártól kapott szöveg betöltése…", weiterUeben: "Gyakorlás tovább" },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: { laedt: "De tekst van je leerkracht wordt geladen …", weiterUeben: "Verder oefenen" },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: { laedt: "A carregar o texto da escola...", weiterUeben: "Continuar a praticar" },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: { laedt: "Carregando o texto da escola...", weiterUeben: "Continuar praticando" },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: { laedt: "Se încarcă textul de la școală …", weiterUeben: "Exersați în continuare" },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: { laedt: "Läser in texten från läraren...", weiterUeben: "Öva vidare" },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: { laedt: "Завантаження шкільної вправи...", weiterUeben: "Тренуватися далі" },
});

export interface EigeneUebungLaufProps {
  /** Der ganze Stand aus `useEigeneUebung` - Text, Startzeile, meldeFortschritt. */
  stand: EigeneUebungStand;
  account: TypingAccount;
  stufe: Stufe;
  lang?: Lang;
  /** Dieselbe Übezeit-Buchung wie in jedem anderen Trainer. */
  onTask: (e: Omit<TaskEvent, "ts">) => void;
}

export function EigeneUebungLauf({ stand, account, stufe, lang, onTask }: EigeneUebungLaufProps) {
  const voiceEnabled = useVoice((s) => s.enabled);
  const { sprache } = useBedienSprache();
  const t = LAUF_TEXTE[sprache];
  const { zeiger, text, startZeile, unlocked, shiftLearned, meldeFortschritt, wackeligeTasten } =
    stand;

  /**
   * ★ Wo dieser Lauf begann und wie viele Zeilen dieses Kind in DIESER Sitzung
   * schon geschafft hat - unabhängig von `TypingSession`s eigener
   * Zeilen-Nummer (die bei jeder Sprach-/Geräteumschaltung neu zählen könnte).
   * `onLetters` feuert genau einmal je fertiger Zeile, in Reihenfolge - ein
   * einfacher Zähler genügt. Beides wird neu gesetzt, sobald eine ANDERE Übung
   * dran ist (neue `textId`) - noch im selben Rendern, nicht erst im Effekt
   * danach. ⚠️ Der Beginn wird FESTGEHALTEN: `startZeile` wächst nach jeder
   * gemeldeten Zeile mit (siehe Dateikopf, „Die Zeile, die gemeldet wird").
   */
  const laufRef = useRef<{ textId: string | undefined; beginn: number; fertigeZeilen: number }>({
    textId: undefined,
    beginn: 0,
    fertigeZeilen: 0,
  });
  if (laufRef.current.textId !== zeiger?.textId) {
    laufRef.current = { textId: zeiger?.textId, beginn: startZeile, fertigeZeilen: 0 };
  }
  const beginn = laufRef.current.beginn;
  const gesamtZeilen = text?.zeilen.length ?? 0;

  /**
   * ★★★★★ 21.09.2026 (Sarah): Die Wörter des Textes zählen als Wörter - sonst
   * buchstabiert die Stimme jedes Wort, das im Übungs-Korpus nie vorkam, auch
   * bei „Buchstabieren aus" (Fremdwörter: 91 % der Zeilen). Quelltext bekommt
   * keine Wörter. Begründung und Messung: `lib/typing/eigeneWoerter.ts`.
   * ⚠️ Vor dem frühen `return` unten - ein Hook danach ändert die Reihenfolge.
   */
  const textWoerter = useMemo(() => woerterAusEigenemText(text?.zeilen ?? [], lang), [text, lang]);

  if (!text || gesamtZeilen === 0) {
    return (
      <p role="status" className="text-sm text-ink-muted">
        {t.laedt}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-base font-semibold text-ink">
        {eigeneUebungName(sprache)} · {text.dateiname}
      </h2>
      <TypingSession
        key={zeiger?.textId}
        items={text.zeilen}
        zusatzWoerter={textWoerter}
        contextId={KONTEXT_ID}
        unlocked={unlocked}
        shiftLearned={shiftLearned}
        zeichenabstand={zeichenabstandFaktor(account.zeichenabstand)}
        // ★ Zeilenende mit Enter (23.09.2026), siehe TypingClass.zeilenEndeEnter.
        zeilenEnde={!!account.zeilenEndeEnter}
        stufe={stufe}
        lang={lang}
        lernweg={lernwegVon(account)}
        voiceEnabled={voiceEnabled}
        initialQi={Math.min(beginn, gesamtZeilen - 1)}
        onItemDone={(e) => onTask(e)}
        // Schritt M (19.09.2026): die wackligen Tasten - nur gemessen.
        wackeligeTasten={wackeligeTasten}
        onLetters={(events: KeyEvent[]) => {
          laufRef.current.fertigeZeilen += 1;
          meldeFortschritt({
            zeile: laufRef.current.beginn + laufRef.current.fertigeZeilen,
            anschlaege: events,
          });
        }}
        onRetry={() => {
          // Das Kind hat die Abschluss-Karte gesehen und weitergeklickt - erst
          // jetzt "fertig" melden (Begründung im Dateikopf).
          meldeFortschritt({ zeile: gesamtZeilen, anschlaege: [], fertig: true });
        }}
        retryLabel={t.weiterUeben}
      />
    </div>
  );
}
