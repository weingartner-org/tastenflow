/**
 * ★★★★★ „WEITER GEHT ES MIT EINER ÜBUNG VON DEINER LEHRKRAFT" (E6, 19.09.2026).
 *
 * Auftrag Johannes (18.09.2026 abends, Entwurf §7b, wörtlich): „bei der
 * eigenen Übung soll unten stehen 'Eigene Übung starten', dann bekommen alle
 * ein Popup mit 'Weiter geht es mit einer Übung von deiner Lehrkraft',
 * Kinder können nur auf 'Weiter' klicken, nicht ablehnen."
 *
 * `useEigeneUebungAnkuendigung.ts` entscheidet WANN (Realtime, wartet auf
 * Tippchallenge/Klassenmatch, einmal je Zuweisung); dieses Bauteil zeigt nur
 * noch das WIE.
 *
 * ── Warum ein eigenes Fenster und nicht `Merkfenster` ────────────────────────
 * `Merkfenster.tsx` nennt seinen Schalter absichtlich „Verstanden", nicht
 * „Weiter" - der Grund dort: „Weiter" heisst schon der Schalter der
 * Abschluss-Karte, und zwei gleich benannte Schalter mit verschiedener
 * Wirkung sind für eine Sprachausgabe nicht auseinanderzuhalten. Diese Regel
 * gilt für ein Fenster, das ÜBER einer laufenden Übung liegt. Hier ist es
 * umgekehrt: Dieses Fenster kommt VOR der Übung - sie ist noch gar nicht
 * aufgebaut, es gibt also keine zweite „Weiter" im selben Baum -, und
 * Johannes hat den Wortlaut „Weiter" für genau dieses Fenster ausdrücklich
 * verlangt. Eine Ausnahme in `Merkfenster.tsx` einzubauen hätte dessen eigene
 * Begründung („nie Weiter") widersprüchlich gemacht; ein eigenes, schlankes
 * Bauteil ist hier die klarere Lösung.
 *
 * ── Was hier wie bei `Merkfenster` bleibt ────────────────────────────────────
 *  • `Modal.tsx` unverändert: Escape, Klick aussen und ✕ schliessen alle
 *    gleich - es gibt nichts abzulehnen (siehe Auftrag oben), jeder Weg
 *    hinaus ist „Weiter".
 *  • Fokus beim Öffnen auf „Weiter" (`initialFocus`); beim Schliessen zurück
 *    in die Eingabezeile (`focusPracticeField`) - dort holt sich die frisch
 *    aufgebaute `TypingSession` der Übung den Fokus selbst ab
 *    (`takePracticeFocusRequest`, siehe `focusField.ts`).
 *  • Die Ansage über `speakUiAlways`, GENAU EINMAL beim Öffnen (leere
 *    Abhängigkeitsliste) - kein wiederholtes Blitzen der Braillezeile
 *    (Live-Region = Blitzmeldung, siehe die Merkregel dazu).
 *
 * ── Anrede ───────────────────────────────────────────────────────────────────
 * Wie die anderen Erklär-Fenster: Seit 19.09.2026 lesen alle Lernenden „du",
 * auch ab 16 (`anredeFuer`, `skin.ts`); „Sie" nur, wo `isFormal` es verlangt.
 * Das Fenster erreicht ohnehin nur Kinder einer Klasse. Der Wortlaut selbst
 * steht in `merkfensterTexte.ts`.
 */
import { useEffect, useRef } from "react";
import { Modal } from "@/components/Modal";
import { focusPracticeField } from "@/lib/typing/focusField";
import { speakUiAlways, type Skin } from "@/lib/typing";
import { eigeneUebungAnkuendigung } from "@/lib/typing/merkfensterTexte";
import { useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";
import { useAnrede } from "./useAnrede";

/**
 * Der Knopf (EN1, 19.09.2026) - Glossar §1.6: „Weiter" nach einem Fenster ⇒
 * „Continue". ★ E11a-4 (26.09.2026): fr ergänzt (echt fehlend, nicht
 * Platzhalter - tsc-Fehler beim Einzeiler-Probelauf), Glossar §9.2 „Continue"
 * ⇒ „Continuer".
 */
const WEITER: Record<BedienSprache, string> = {
  de: "Weiter",
  en: "Continue",
  fr: "Continuer",
  es: "Continuar",
  it: "Avanti",
  // ★ O-PL (02.10.2026): Knopf „Dalej" (Glossar Regel 12).
  pl: "Dalej",
  // ★ O-TR (02.10.2026): Knopf im Stamm, "Devam et" (Glossar Regel 10).
  tr: "Devam et",
  // ★ O-CS (03.10.2026): Knopf im Infinitiv, „Pokračovat" (Glossar Regel 10).
  cs: "Pokračovat",
  // ★ O2-COMP (30.10.2026): die neun Sprachen mit eigener Fassung.
  bg: "Продължи",
  el: "Συνέχεια",
  hu: "Tovább",
  nl: "Verder",
  pt: "Continuar",
  br: "Continuar",
  ro: "Mai departe",
  sv: "Fortsätt",
  uk: "Далі",
};

export interface EigeneUebungAnkuendigungProps {
  skin: Skin;
  /** Weiter, Escape, ✕ oder Klick aussen - alle bedeuten dasselbe: weiter. */
  onWeiter: () => void;
}

export function EigeneUebungAnkuendigung({ skin, onWeiter }: EigeneUebungAnkuendigungProps) {
  // ★ EN1: Satz und Stimme in der Bedienungssprache (bei aktivem Sprachbereich).
  // ★ E11a-4 (26.09.2026): `spracheGewaehlt` statt der oberflächen-sicheren
  // `sprache` - `eigeneUebungAnkuendigung()` bekam dabei eine echte
  // fr-Fassung (Falle 30: die alte `=== "en"`-Weiche hätte „fr" still
  // Deutsch gegeben).
  const { spracheGewaehlt: sprache, bereichAktiv } = useBedienSprache();
  const anrede = useAnrede();
  const { titel } = eigeneUebungAnkuendigung(skin, sprache, anrede);
  const weiterRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (bereichAktiv) speakUiAlways(titel, undefined, sprache);
    else speakUiAlways(titel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const weiter = () => {
    onWeiter();
    // Hausregel: zurück in die Eingabezeile - hier speziell die der Übung,
    // die erst jetzt aufgebaut wird (siehe Kopfkommentar).
    window.setTimeout(() => focusPracticeField(), 0);
  };

  return (
    <Modal title={titel} onClose={weiter} initialFocus={weiterRef}>
      <div className="flex justify-end">
        {/* ★ NIE `disabled` (Regel R5): der einzige, immer verfügbare Weg. */}
        <button type="button" ref={weiterRef} className="btn-primary" onClick={weiter}>
          {WEITER[sprache]}
        </button>
      </div>
    </Modal>
  );
}
