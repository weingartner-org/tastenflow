/**
 * Das Erklär-Fenster von „Tastenflow" (31.08.2026) - EIN Bauteil für die drei
 * Anlässe aus `merkfenster.ts`: falsche Umschalttaste, Grossschreibung,
 * „heute darfst du mehr als eine Aufgabe".
 *
 * ── Warum ein Fenster und nicht nur eine Ansage ──────────────────────────────
 * Die Erklärung zur falschen Umschalttaste GAB es schon (`TypingSession.tsx`),
 * sie hatte nur keinen sichtbaren Kanal: `announce()` schweigt, sobald das
 * App-Vorlesen an ist, und schreibt sonst in einen `sr-only`-Bereich. Wer
 * sehend ohne Screenreader übt und das Vorlesen aus hat, bekam **nur den
 * Fehlerton** - und wusste nicht, warum. Das ist Lehre §7.5 des Audits vom
 * 30.08.: „Die App hat zwei Kanäle, und niemand regelt welcher."
 *
 * ── Was dieses Fenster anders macht als `Modal.tsx` ──────────────────────────
 * `Modal.tsx` gehört FÜNF Programmen (`apps/GEMEINSAM.md`). Es hier zu ändern
 * hiesse, an Programmen zu bauen, die man gerade nicht vor sich hat. Darum
 * benutzt dieses Bauteil es unverändert und legt nur obendrauf, was Tastenflow
 * braucht:
 *  • den Haken „Diese Meldung nicht mehr anzeigen" (nur wo er gewollt ist),
 *  • den Fokus, der beim Schliessen IMMER in die Eingabezeile zurückgeht
 *    (Hausregel: Escape holt die Eingabezeile - `focusPracticeField`),
 *  • den Text als BESCHREIBUNG des Dialogs (`aria-describedby`), damit der
 *    Screenreader ihn beim Öffnen liest (W2a, F2 - siehe unten),
 *  • die eigene Stimme nur bei „Vorlesen an".
 *
 * Escape und der Schalter schliessen; die Tabulatortaste bleibt im Fenster (das
 * kann `Modal.tsx` schon). Genau so hat Johannes es beschrieben: „das man mit
 * Esc oder Weiter wieder schließen kann (Festhalten: Man kommt mit Tab nicht
 * raus)".
 *
 * ★★★ DER SCHALTER HEISST „VERSTANDEN", NICHT „WEITER" - und das ist eine
 * bewusste Abweichung von Johannes' Wort (31.08.2026, gemessen).
 *
 * Grund: „Weiter" heisst schon der Schalter der ABSCHLUSS-KARTE (`retryLabel`
 * in AdaptiveTrainer). Zwei Schalter mit demselben sichtbaren
 * Namen, die Verschiedenes tun, sind für eine Sprachausgabe nicht
 * auseinanderzuhalten - man hört „Weiter, Schalter" und weiss nicht, ob man
 * gerade eine Erklärung wegklickt oder eine Runde beendet.
 *
 * Aufgefallen ist es, weil `tests/typing-textwelt-buecherei.test.tsx` genau
 * darüber gestolpert ist: Der Test sucht den Schalter „Weiter", fand meinen
 * und beendete die Etappe nie. Der Test hatte recht - der Name war
 * mehrdeutig, nicht die Prüfung.
 *
 * ── Der Ton ──────────────────────────────────────────────────────────────────
 * Kein Fenster sagt, was ein Kind falsch gemacht hat - es sagt, wie es geht.
 * „Fast!" statt „Falsch." ([[feedback_nie_gegen_das_kind]]).
 */
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Modal } from "@/components/Modal";
import { focusPracticeField } from "@/lib/typing/focusField";
import { speakUi } from "@/lib/typing";
import { texte, useBedienSprache } from "@/lib/bedienSprache";

/**
 * Die zwei festen Texte des Fensters (EN1, 19.09.2026). Deutsch wortgleich
 * wie vorher; die Sätze selbst kommen fertig in der Bedienungssprache vom
 * Aufrufer (`merkfensterTexte.ts`).
 */
const FENSTER_TEXTE = texte({
  de: { nichtMehr: "Diese Meldung nicht mehr anzeigen", verstanden: "Verstanden" },
  en: { nichtMehr: "Don't show this message again", verstanden: "Got it" },
  fr: { nichtMehr: "Ne plus afficher ce message", verstanden: "Compris" },
  es: { nichtMehr: "No volver a mostrar este mensaje", verstanden: "Entendido" },
  it: { nichtMehr: "Non mostrare più questo messaggio", verstanden: "Ho capito" },
  // ★ O-PL (02.10.2026): Knopf „Rozumiem" (Glossar Regel 12).
  pl: { nichtMehr: "Nie pokazuj więcej tego komunikatu", verstanden: "Rozumiem" },
  // ★ O-TR (02.10.2026): Knöpfe im Stamm, "Anladım" (Glossar Regel 10).
  tr: { nichtMehr: "Bu mesajı bir daha gösterme", verstanden: "Anladım" },
  // ★ O-CS (03.10.2026): Knöpfe im Infinitiv, „Rozumím" (Glossar Regel 10).
  cs: { nichtMehr: "Tuto zprávu už nezobrazovat", verstanden: "Rozumím" },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: { nichtMehr: "Не показвай повече това съобщение", verstanden: "Разбрах" },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: { nichtMehr: "Να μην εμφανιστεί ξανά αυτό το μήνυμα", verstanden: "Κατάλαβα" },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: { nichtMehr: "Ne jelenjen meg többé ez az üzenet", verstanden: "Értem" },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: { nichtMehr: "Deze melding niet meer tonen", verstanden: "Begrepen" },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: { nichtMehr: "Não voltar a mostrar esta mensagem", verstanden: "Entendido" },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: { nichtMehr: "Não mostrar esta mensagem de novo", verstanden: "Entendi" },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: { nichtMehr: "Nu mai afișa acest mesaj", verstanden: "Am înțeles" },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: { nichtMehr: "Visa inte det här meddelandet igen", verstanden: "Jag förstår" },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: { nichtMehr: "Більше не показувати це повідомлення", verstanden: "Зрозуміло" },
});

export interface MerkfensterProps {
  /** Überschrift, z. B. „Fast!" */
  titel: string;
  /**
   * Der erklärende Text. Absätze werden als eigene `<p>` gesetzt, damit eine
   * Sprachausgabe sie einzeln ansteuern kann.
   */
  absaetze: string[];
  /**
   * Haken „Diese Meldung nicht mehr anzeigen" anbieten? Nur das Umschalt-Fenster
   * bekommt ihn. Der Grossschreibungs-Hinweis kommt ohnehin nur einmal, und das
   * Wochenziel-Fenster ändert sich täglich (Johannes 31.08., Frage F25).
   */
  mitHaken?: boolean;
  /** Eigene Beschriftung des Schalters (sonst „Verstanden"), z. B. „Weiter". */
  knopf?: string;
  /** Wird beim Schliessen mit dem Stand des Hakens gerufen. */
  onSchliessen: (nichtMehrZeigen: boolean) => void;
}

export function Merkfenster({
  titel,
  absaetze,
  mitHaken = false,
  knopf,
  onSchliessen,
}: MerkfensterProps) {
  const [nichtMehr, setNichtMehr] = useState(false);
  const weiterRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const textId = useId();
  // ★ EN1: In Tastenflow (`bereichAktiv`) spricht das Fenster in der
  // Bedienungssprache und mit ihrer Stimme - sonst genau der Aufruf von vorher.
  const { sprache, bereichAktiv } = useBedienSprache();
  const t = FENSTER_TEXTE[sprache];

  /*
   * ★ Der Fokus geht auf „Weiter", nicht auf den Fensterrahmen.
   *
   * Grund: Das ist der Weg hinaus. Wer mit Braillezeile arbeitet, steht damit
   * sofort auf dem einen Knopf, der ihn zurück ins Üben bringt - und die
   * Tabulatortaste führt von dort zum Haken, nicht umgekehrt. `Modal.tsx`
   * nimmt dafür `initialFocus` entgegen.
   */

  /*
   * ★★★★ W2a (28.09.2026, BEFUND-2026-09-27-WINDOWS-MESSUNG F2): DER TEXT
   * GEHÖRT AN DEN DIALOG, NICHT IN EINE ZWEITE STIMME.
   *
   * Gemessen mit NVDA 2026.2: Beim Öffnen sagte NVDA nur „Presque !
   * Dialogfeld - Compris Schalter" - der Erklärungstext hing nirgends am
   * Dialog. Stattdessen sprach ihn die App mit `speakUiAlways`, auch bei
   * „Vorlesen aus" - mit NVDA sprachen dann ZWEI Stimmen.
   *
   * Jetzt: `aria-describedby` am Dialog zeigt auf die Absätze - der
   * Screenreader liest Titel UND Text, wenn der Fokus hineinkommt. `Modal.tsx`
   * gehört fünf Programmen und nimmt keine Beschreibung entgegen; das Attribut
   * wird darum hier an das umgebende `role="dialog"` gesetzt - im
   * Layout-Effekt, also BEVOR `Modal` den Fokus hineinsetzt (die Effekte des
   * Kindes laufen vor denen der Eltern). Die eigene Stimme spricht nur noch bei
   * „Vorlesen an" (`speakUi`) - die Regel „wo ein Screenreader liest, gehört
   * `speakUi` daneben, nie `speakUiAlways`" gilt auch hier. Der Preis, benannt:
   * Wer ohne Screenreader und ohne Vorlesen übt, LIEST das Fenster - es steht
   * sichtbar da.
   */
  useLayoutEffect(() => {
    const dialog = textRef.current?.closest('[role="dialog"]');
    if (!dialog) return;
    dialog.setAttribute("aria-describedby", textId);
    return () => dialog.removeAttribute("aria-describedby");
  }, [textId]);

  /* Genau EINMAL beim Öffnen - deshalb die leere Abhängigkeitsliste. */
  useEffect(() => {
    const satz = `${titel} ${absaetze.join(" ")}`;
    if (bereichAktiv) speakUi(satz, undefined, undefined, sprache);
    else speakUi(satz);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const schliessen = () => {
    onSchliessen(nichtMehr);
    // Hausregel: zurück in die Eingabezeile, nicht auf den Auslöser - der
    // Auslöser war ein Tastendruck und hat keinen Ort.
    window.setTimeout(() => focusPracticeField(), 0);
  };

  return (
    <Modal title={titel} onClose={schliessen} initialFocus={weiterRef}>
      <div className="space-y-3">
        <div id={textId} ref={textRef} className="space-y-3">
          {absaetze.map((a, i) => (
            <p key={i} className="m-0 text-base leading-relaxed text-ink">
              {a}
            </p>
          ))}
        </div>

        {mitHaken && (
          <label className="flex items-center gap-2 text-base text-ink">
            <input
              type="checkbox"
              className="h-5 w-5 accent-[rgb(var(--c-accent))]"
              checked={nichtMehr}
              onChange={(e) => setNichtMehr(e.target.checked)}
            />
            {t.nichtMehr}
          </label>
        )}

        <div className="flex justify-end">
          {/*
            ★ NIE `disabled` (Regel R5): Der Knopf ist der einzige Weg hinaus
            und muss in der Fokus-Ordnung bleiben, was auch immer der Haken sagt.
          */}
          <button
            type="button"
            ref={weiterRef}
            className="btn-primary"
            onClick={schliessen}
          >
            {knopf ?? t.verstanden}
          </button>
        </div>
      </div>
    </Modal>
  );
}
