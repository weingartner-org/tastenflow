/**
 * ★★★ DAS ENDE DES MATCHS - die Platzierungsliste (F13, 11.09.2026).
 *
 * *„Pokal für 1, Silber für 2, Bronze für 3 - jeweils Zeichen PLUS Text."*
 *
 * ── Nichts gegen ein Kind ───────────────────────────────────────────────────
 * Es gibt hier **kein „letzter Platz"**, keine rote Zeile, keinen Vergleich in
 * Worten. Wer unten steht, steht unten mit seiner Zahl - mehr sagt die Liste
 * nicht ([[feedback_nie_gegen_das_kind]]). Auch der Leistungswert steht bewusst
 * NICHT dabei: Das Match ist ein Spiel, keine Messung, und eine Zahl neben dem
 * Namen lädt zum Nachrechnen ein.
 *
 * ── Zeichen UND Wort ────────────────────────────────────────────────────────
 * 🏆 steht neben dem Wort „Pokal", 🥈 neben „Silber", 🥉 neben „Bronze". Ein
 * Pokal, den nur sieht, wer Farben und Formen sieht, ist für ein Kind mit
 * Blindheit kein Platz 1. Das Zeichen selbst ist `aria-hidden` - sonst läse
 * ein Screenreader „Pokal Pokal".
 *
 * ── Gespeichert wird NICHTS ─────────────────────────────────────────────────
 * Kein Rang, kein Wert, keine Zeile in `tt_schreibproben`, nichts in
 * `progress.rounds` als „Match" markiert (F10). Was das Match am Lernstand
 * geändert hat - Übezeit und die Vormerkung einer neuen Taste -, ist im Lauf
 * selbst passiert. Eine neue Taste wird NICHT hier und nicht im Match
 * freigeschaltet, sondern im Training vorgestellt (02.10.2026).
 *
 * ── Der Fokus ───────────────────────────────────────────────────────────────
 * Auf der Überschrift (Regel: jede Karte, die den Bildschirm übernimmt, setzt
 * den Fokus auf ihren Anfang). „Weiter üben" und Escape führen zurück in die
 * Eingabezeile.
 */
import { htmlLang } from "./htmlLang";
import { useEffect, useRef } from "react";
import { ehrenplatz, type RanglistenEintrag } from "@/lib/typing";
import { istGelistet, sichtbareRangliste } from "@/lib/klassenmatch/obereHaelfte";
import { texte, useBedienSprache } from "@/lib/bedienSprache";

/**
 * ★ Die Texte der Platzierungsliste in beiden Bedienungssprachen (EN5,
 * 19.09.2026). Deutsch wortgleich wie vorher. Englisch: *The Class Match is
 * over*, die Ehrenplätze *Trophy* / *Silver* / *Bronze* (`ehrenplatz` in
 * `klassenmatch.ts`). Auch englisch kein „last place", kein Vergleich in
 * Worten (Dateikopf).
 */
export const ERGEBNIS_TEXTE = texte({
  de: {
    titel: "Das Klassenmatch ist vorbei",
    weiter: "Weiter üben",
    escape: "Escape bringt dich auch zurück zum Üben.",
    neueTaste: "Eine neue Taste wartet in deinem Training.",
    lob: "Gut gemacht - du warst dabei!",
  },
  en: {
    titel: "The Class Match is over",
    weiter: "Keep practising",
    escape: "Escape also takes you back to practice.",
    neueTaste: "A new key is waiting in your training.",
    lob: "Well done - you took part!",
  },
  fr: {
    titel: "Le Match de la classe est terminé",
    weiter: "Continuer à s'exercer",
    escape: "Échap te ramène aussi à l'exercice.",
    neueTaste: "Une nouvelle touche t'attend dans ton entrainement.",
    lob: "Bravo - tu as participé !",
  },
  es: {
    titel: "La Competición de la clase ha terminado",
    weiter: "Seguir practicando",
    escape: "Esc también te lleva de vuelta a practicar.",
    neueTaste: "Una tecla nueva te espera en tu entrenamiento.",
    lob: "¡Bien hecho - has participado!",
  },
  it: {
    titel: "La Gara di classe è finita",
    weiter: "Continua a esercitarti",
    escape: "Anche Esc ti riporta all'esercizio.",
    neueTaste: "Un nuovo tasto ti aspetta nel tuo allenamento.",
    lob: "Bravo - hai partecipato!",
  },
  // ★ O-PL (02.10.2026): Satz über die Sache, nicht über die Person.
  pl: {
    titel: "Wyścig klasowy zakończony",
    weiter: "Ćwicz dalej",
    escape: "Klawisz Esc też przenosi cię z powrotem do ćwiczeń.",
    neueTaste: "Nowy klawisz czeka na ciebie w twoim treningu.",
    lob: "Dobra robota - dzięki za udział!",
  },
  // ★ O-TR (02.10.2026): Satz über die Sache; "Antrenmanım" (Glossar §2.2).
  tr: {
    titel: "Sınıf Maçı bitti",
    weiter: "Çalışmaya devam et",
    escape: "Esc tuşu da seni alıştırmaya geri götürür.",
    neueTaste: "Antrenmanında yeni bir tuş seni bekliyor.",
    lob: "Aferin - yarışa katıldın!",
  },
  // ★ O-CS (03.10.2026): Satz über die Sache, nicht über die Person; „Můj trénink" (Glossar §2.2).
  cs: {
    titel: "Třídní závod skončil",
    weiter: "Cvičit dál",
    escape: "Klávesou Esc se taky vrátíš ke cvičení.",
    neueTaste: "Ve tvém tréninku na tebe čeká nová klávesa.",
    lob: "Výborně - díky za účast!",
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      titel: "Състезанието в класа свърши",
      weiter: "Упражнявай се още",
      escape: "Esc също те връща към упражненията.",
      neueTaste: "В тренировката те чака нов клавиш.",
      lob: "Браво - ти участва!",
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      titel: "Ο αγώνας τμήματος τελείωσε",
      weiter: "Συνέχεια εξάσκησης",
      escape: "Και με το Esc επιστρέφεις στην εξάσκηση.",
      neueTaste: "Ένα νέο πλήκτρο σε περιμένει στην εξάσκησή σου.",
      lob: "Μπράβο - πήρες μέρος!",
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      titel: "Vége az Osztályversenynek",
      weiter: "Gyakorlás tovább",
      escape: "Az Esc billentyű is visszavisz a gyakorláshoz.",
      neueTaste: "Új billentyű vár rád a Saját gyakorlásban.",
      lob: "Ügyes voltál - részt vettél!",
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      titel: "De klassenwedstrijd is afgelopen",
      weiter: "Verder oefenen",
      escape: "Ook met Escape ga je terug naar het oefenen.",
      neueTaste: "Er wacht een nieuwe toets in je training.",
      lob: "Goed gedaan - je deed mee!",
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      titel: "A Corrida da turma terminou",
      weiter: "Continuar a praticar",
      escape: "Esc também te leva de volta à prática.",
      neueTaste: "Há uma tecla nova à tua espera no teu treino.",
      lob: "Muito bem - participaste!",
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      titel: "A Competição da turma terminou",
      weiter: "Continuar praticando",
      escape: "Esc também leva você de volta à prática.",
      neueTaste: "Uma tecla nova está esperando por você no seu treino.",
      lob: "Muito bem - você participou!",
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      titel: "Întrecerea clasei s-a încheiat",
      weiter: "Exersați în continuare",
      escape: "Și tasta Esc te duce înapoi la exersare.",
      neueTaste: "O tastă nouă te așteaptă în antrenament.",
      lob: "Bravo - ai participat!",
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      titel: "Klasstävlingen är slut",
      weiter: "Öva vidare",
      escape: "Escape tar dig också tillbaka till övningen.",
      neueTaste: "En ny tangent väntar i din träning.",
      lob: "Bra jobbat - du var med!",
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      titel: "Перегони класу завершено",
      weiter: "Тренуватися далі",
      escape: "Esc теж повертає до тренування.",
      neueTaste: "У твоєму тренуванні чекає нова клавіша.",
      lob: "Молодець - дякуємо за участь!",
    },
});

export interface KlassenmatchErgebnisProps {
  liste: readonly RanglistenEintrag[];
  /** Die eigene Konto-Kennung - die eigene Zeile steht hervorgehoben da. */
  eigeneUid: string;
  /** „Weiter üben" (und Escape). */
  onWeiter: () => void;
  /**
   * ★ 02.10.2026: Das Match hat eine neue Taste VORGEMERKT
   * (`progress.freischaltungAusMatch`) - sie wird im Training vorgestellt,
   * nicht hier. Ein kurzer Satz, welche Taste es ist, steht bewusst NICHT
   * da: Die Vorstellung gehört dem Training. Gewöhnlicher Absatz, KEINE
   * Live-Region (Braillezeile): Wer die Karte liest, findet ihn; er wird nicht
   * ausgerufen.
   */
  neueTasteWartet?: boolean;
}

export function KlassenmatchErgebnis({
  liste,
  eigeneUid,
  onWeiter,
  neueTasteWartet = false,
}: KlassenmatchErgebnisProps) {
  const titelRef = useRef<HTMLHeadingElement>(null);
  // ★ E11a-4 (26.09.2026): `spracheGewaehlt` statt der oberflächen-sicheren
  // `sprache` (Muster aus E11a-2/-3) - ERGEBNIS_TEXTE kennt „fr" bereits seit
  // E11a; `ehrenplatz` bekam dabei eine echte `EHRENPLAETZE_FR` (vorher
  // Falle 30: `=== "en"`-Weiche hätte „fr" still Deutsch gegeben).
  const { spracheGewaehlt: sprache } = useBedienSprache();
  const t = ERGEBNIS_TEXTE[sprache];
  // ★★★★★ Nach dem Match nur die obere Hälfte (Johannes 18.11.2026,
  // `obereHaelfte.ts`). Wer nicht gelistet ist, bekommt `t.lob`, keinen Platz.
  const sichtbar = sichtbareRangliste(liste);
  useEffect(() => {
    titelRef.current?.focus();
  }, []);

  // Escape führt zurück ins Üben - dieselbe Regel wie überall sonst.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onWeiter();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onWeiter]);

  return (
    <div
      className="card mx-auto w-full max-w-prose p-5 sm:p-6"
      lang={htmlLang(sprache)}
    >
      <h2
        ref={titelRef}
        tabIndex={-1}
        data-match-titel
        className="m-0 text-xl font-semibold text-ink outline-none"
      >
        {t.titel}
      </h2>
      <ol className="m-0 mt-4 list-none space-y-1 p-0">
        {sichtbar.map((e) => {
          const ehre = ehrenplatz(e.platz, sprache);
          const eigen = e.stand.pupilUid === eigeneUid;
          return (
            <li
              key={e.stand.pupilUid}
              className={
                "flex flex-wrap items-baseline gap-x-3 rounded-xl px-3 py-1.5 " +
                (eigen ? "border border-hairline bg-surface-sunken font-semibold text-ink" : "text-ink")
              }
            >
              <span className="w-8 shrink-0 text-right tabular-nums">{e.platz}.</span>
              <span className="min-w-0 flex-1 truncate">{e.stand.name}</span>
              {ehre ? (
                <span className="shrink-0 whitespace-nowrap">
                  {/* Das Zeichen darf grösser sein - es ist Schmuck und
                      `aria-hidden`, also von der Schriftgrössen-Regel des
                      Reviers ausdrücklich ausgenommen. */}
                  <span aria-hidden="true" className="text-2xl align-middle">
                    {ehre.zeichen}
                  </span>{" "}
                  {ehre.wort}
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
      {!istGelistet(sichtbar, eigeneUid) ? (
        <p data-match-lob className="m-0 mt-4 text-lg font-semibold text-ink">
          {t.lob}
        </p>
      ) : null}
      {neueTasteWartet ? (
        <p data-match-neue-taste className="m-0 mt-4 text-ink">
          {t.neueTaste}
        </p>
      ) : null}
      <div className="mt-6">
        <button type="button" className="btn-primary" onClick={onWeiter}>
          {t.weiter}
        </button>
        <p className="mb-0 mt-2 text-base text-ink">{t.escape}</p>
      </div>
    </div>
  );
}
