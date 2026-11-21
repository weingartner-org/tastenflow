/**
 * ★★★ „Sarah lädt dich zu einem Klassenmatch ein" (F2, 11.09.2026).
 *
 * Das Fenster, das bei allen anderen Kindern der Klasse aufgeht - **in etwa
 * einer Sekunde** (Realtime, Sofort-Nachfrage und Takt, siehe
 * `useKlassenBeobachtung`).
 *
 * ── Zwei Wege, und beide sind gleichwertig ──────────────────────────────────
 * „Bin dabei" und „Jetzt nicht". Kein Vorwurf im Wortlaut, keine Rückfrage,
 * kein „Willst du wirklich nicht?" - wer nicht mitspielt, hat dafür einen
 * Grund, und der gehört ihm ([[feedback_nie_gegen_das_kind]]). **Escape ist
 * „Jetzt nicht"**, und die abgelehnte Einladung kommt nicht wieder; eine neue
 * (anderes Match) schon.
 *
 * ── Der Fokus ───────────────────────────────────────────────────────────────
 * Er steht auf „Bin dabei" - das ist der Knopf, um den es geht, und von dort
 * führt die Tabulatortaste zu „Jetzt nicht". Nach dem Schliessen geht er in
 * die Eingabezeile (Hausregel; `Modal` erledigt das, wenn der Öffner weg ist -
 * und der Öffner war hier ein Ereignis, kein Knopf).
 *
 * ⚠️ KEINE Live-Region: Das Fenster ist ein Dialog. `Modal` setzt
 * `role="dialog"` und beschriftet ihn mit der Überschrift; jeder Screenreader
 * liest ihn beim Öffnen von selbst vor. Eine zusätzliche Meldung wäre dieselbe
 * Auskunft zweimal - und auf der Braillezeile eine Blitzmeldung, die die
 * Überschrift verdrängt.
 */
import { htmlLang } from "./htmlLang";
import { useEffect, useRef } from "react";
import { Modal } from "@/components/Modal";
import { einladungSatz, speakUiAlways } from "@/lib/typing";
import { focusPracticeField } from "@/lib/typing/focusField";
import { texte, useBedienSprache } from "@/lib/bedienSprache";

/**
 * ★ Die Texte des Einladungsfensters in beiden Bedienungssprachen (EN5,
 * 19.09.2026). Deutsch wortgleich wie vorher. Englisch nach dem Glossar
 * (§1.6, §3.7): *Class Match*, *I'm in* / *Not now* - beide Wege gleich
 * freundlich, kein Vorwurf, auch englisch nicht.
 * ⚠️ Der Schliessen-Knopf des Fensters („Dialog schließen") gehört dem
 * gemeinsamen `Modal` und ist darum hier NICHT übersetzt - siehe Bericht EN5.
 */
export const EINLADUNG_TEXTE = texte({
  de: {
    titel: "Klassenmatch",
    erklaerung:
      "Fünf Minuten schreiben - jede und jeder mit den eigenen Tasten. Es zählt zu deiner Übezeit.",
    dabei: "Bin dabei",
    nichtJetzt: "Jetzt nicht",
    escape: "Escape bringt dich zurück zum Üben.",
  },
  en: {
    titel: "Class Match",
    erklaerung:
      "Five minutes of typing - everyone with the keys they already know. It counts towards your practice time.",
    dabei: "I'm in",
    nichtJetzt: "Not now",
    escape: "Escape takes you back to practice.",
  },
  fr: {
    titel: "Match de la classe",
    erklaerung:
      "Cinq minutes à écrire - chacune et chacun avec ses propres touches. Ça compte dans ton temps d'exercice.",
    dabei: "J'en suis",
    nichtJetzt: "Pas maintenant",
    escape: "Échap te ramène à l'exercice.",
  },
  es: {
    titel: "Competición de la clase",
    erklaerung:
      "Cinco minutos escribiendo - cada persona con sus propias teclas. Cuenta como tiempo de práctica.",
    dabei: "Participo",
    nichtJetzt: "Ahora no",
    escape: "Esc te lleva de vuelta a practicar.",
  },
  // ★ O-IT (02.10.2026): „Gara di classe" (Glossar §2.3); die ganze Klasse „voi" (Regel 1).
  it: {
    titel: "Gara di classe",
    erklaerung:
      "Scrivete per cinque minuti - ogni persona con i propri tasti. Conta come tempo di esercizio.",
    dabei: "Ci sono!",
    nichtJetzt: "Non ora",
    escape: "Esc ti riporta all'esercizio.",
  },
  // ★ O-PL (02.10.2026): „Wyścig klasowy", „Biorę udział!" (Glossar §2.3), „Nie teraz".
  pl: {
    titel: "Wyścig klasowy",
    erklaerung:
      "Pięć minut pisania - każda osoba swoimi klawiszami. Liczy się to do twojego czasu ćwiczeń.",
    dabei: "Biorę udział!",
    nichtJetzt: "Nie teraz",
    escape: "Klawisz Esc przenosi cię z powrotem do ćwiczeń.",
  },
  // ★ O-TR (02.10.2026): "Sınıf Maçı", "Varım!" (Glossar §2.3), "Şimdi değil".
  tr: {
    titel: "Sınıf Maçı",
    erklaerung: "Beş dakika yazma - herkes kendi tuşlarıyla. Çalışma sürene eklenir.",
    dabei: "Varım!",
    nichtJetzt: "Şimdi değil",
    escape: "Esc tuşu seni alıştırmaya geri götürür.",
  },
  // ★ O-CS (03.10.2026): „Třídní závod", „Jdu do toho!" (Glossar §2.3), „Teď ne";
  // „všichni" statt „každý" (Mehrzahl ist generisch, Glossar §1 Regel 2).
  cs: {
    titel: "Třídní závod",
    erklaerung: "Pět minut psaní - všichni se svými klávesami. Počítá se ti to do času procvičování.",
    dabei: "Jdu do toho!",
    nichtJetzt: "Teď ne",
    escape: "Klávesou Esc se vrátíš ke cvičení.",
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      titel: "Състезание в класа",
      erklaerung:
        "Пет минути писане - всеки със своите клавиши. Брои се към времето ти за упражнения.",
      dabei: "Участвам!",
      nichtJetzt: "Не сега",
      escape: "Esc те връща към упражненията.",
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      titel: "Αγώνας τμήματος",
      erklaerung:
        "Πέντε λεπτά γραφής - κάθε παιδί με τα πλήκτρα που ήδη ξέρει. Μετράει στον χρόνο εξάσκησής σου.",
      dabei: "Είμαι μέσα!",
      nichtJetzt: "Όχι τώρα",
      escape: "Με το Esc επιστρέφεις στην εξάσκηση.",
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      titel: "Osztályverseny",
      erklaerung:
        "Öt perc gépelés - mindenki a saját billentyűivel. Beleszámít a gyakorlási idődbe.",
      dabei: "Benne vagyok!",
      nichtJetzt: "Most nem",
      escape: "Az Esc billentyű visszavisz a gyakorláshoz.",
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      titel: "Klassenwedstrijd",
      erklaerung:
        "Vijf minuten typen - iedereen met de eigen toetsen. Het telt mee voor je oefentijd.",
      dabei: "Ik doe mee!",
      nichtJetzt: "Niet nu",
      escape: "Met Escape ga je terug naar het oefenen.",
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      titel: "Corrida da turma",
      erklaerung:
        "Cinco minutos de escrita - cada pessoa com as teclas que já conhece. Conta para o teu tempo de prática.",
      dabei: "Conta comigo",
      nichtJetzt: "Agora não",
      escape: "Esc leva-te de volta à prática.",
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      titel: "Competição da turma",
      erklaerung:
        "Cinco minutos de digitação - cada pessoa com as teclas que já conhece. Conta para o seu tempo de prática.",
      dabei: "Estou dentro!",
      nichtJetzt: "Agora não",
      escape: "Esc leva você de volta à prática.",
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      titel: "Întrecerea clasei",
      erklaerung:
        "Cinci minute de scris - fiecare cu tastele proprii. Se socotește la timpul tău de exersare.",
      dabei: "Particip!",
      nichtJetzt: "Nu acum",
      escape: "Tasta Esc te duce înapoi la exersare.",
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      titel: "Klasstävlingen",
      erklaerung:
        "Fem minuters skrivande - var och en med sina egna tangenter. Det räknas till din övningstid.",
      dabei: "Jag är med!",
      nichtJetzt: "Inte nu",
      escape: "Escape tar dig tillbaka till övningen.",
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      titel: "Перегони класу",
      erklaerung:
        "П'ять хвилин друку - кожна дитина своїми клавішами. Це зараховується до твого часу тренування.",
      dabei: "Я в грі!",
      nichtJetzt: "Не зараз",
      escape: "Esc повертає до тренування.",
    },
});

export interface KlassenmatchEinladungProps {
  /** Wer einlädt. */
  hostName: string;
  /**
   * ★ Was eben passiert ist, als ein Satz VOR der Einladung - oder leer.
   * „Sarah hat schon eingeladen." (das eigene, spätere Match wurde abgesagt)
   * oder „Franz hat das Klassenmatch abgesagt." (das Match, dem dieses Kind
   * beigetreten war). Gerechnet in `useKlassenmatch`.
   */
  vorsatz?: string;
  /** „Bin dabei". */
  onDabei: () => void;
  /** „Jetzt nicht" - und Escape. */
  onNichtJetzt: () => void;
  /**
   * ★ Das Fenster ist aufgegangen (02.10.2026) - einmal beim Öffnen. Der
   * Haken meldet die eigene Zeile dann auf `eingeladen`, damit die
   * Gastgeberin weiss, wer noch überlegt.
   */
  onGezeigt?: () => void;
  /**
   * ★ Wohin der Fokus nach „Jetzt nicht" geht (02.10.2026). Ohne Angabe in
   * die Eingabezeile (Hausregel). Steht das Fenster über der
   * Platzierungsliste, geht er dorthin zurück - dort gibt es keine Zeile.
   */
  fokusNachNein?: () => void;
}

export function KlassenmatchEinladung({
  hostName,
  vorsatz = "",
  onDabei,
  onNichtJetzt,
  onGezeigt,
  fokusNachNein,
}: KlassenmatchEinladungProps) {
  const dabeiRef = useRef<HTMLButtonElement>(null);
  // ★ E11a-2 (26.09.2026): `spracheGewaehlt` statt der oberflächen-sicheren
  // `sprache` - `EINLADUNG_TEXTE` und `einladungSatz` kennen seit E11a echtes
  // Französisch (Glossar §9.2), diese Stelle darf es zeigen, sobald „fr"
  // wirklich gewählt ist, unabhängig von der grossen Freischaltung der
  // übrigen Oberfläche (`oberflaechenSprache`, `sprache.ts`).
  const { spracheGewaehlt: sprache, bereichAktiv } = useBedienSprache();
  const t = EINLADUNG_TEXTE[sprache];

  /*
    ★ Gesprochen wird EINMAL beim Öffnen, und ausdrücklich auch dann, wenn das
    App-Vorlesen aus ist (`speakUiAlways`) - genau wie beim `Merkfenster`.
    Grund: Ein Kind, das gerade schreibt, sieht das Fenster vielleicht gar
    nicht; und wer es ohne Ton bekommt, verpasst die Einladung, ohne es zu
    merken. Dieselbe Entscheidung wie 31.08.2026 bei den Erklär-Fenstern.

    ★★ Der Vorsatz geht in DENSELBEN Satz (11.09.2026 abends): Zwei Ansagen
    hintereinander - erst „Sarah hat schon eingeladen", dann die Einladung -
    wären zwei Stimmen, von denen die zweite die erste abwürgen kann.
  */
  useEffect(() => {
    const satz = einladungSatz(hostName, sprache);
    const ganz = vorsatz ? `${vorsatz} ${satz}` : satz;
    // ★ EN5: in Tastenflow in der Bedienungssprache und mit ihrer Stimme;
    // ohne aktiven Sprachbereich genau der Aufruf von vorher.
    if (bereichAktiv) speakUiAlways(ganz, undefined, sprache);
    else speakUiAlways(ganz);
    onGezeigt?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nichtJetzt = () => {
    onNichtJetzt();
    // ⚠️ Nach dem Aufräumen des Fensters (`Modal` gibt den Fokus beim
    // Schliessen zurück) - darum im nächsten Takt.
    window.setTimeout(() => (fokusNachNein ?? focusPracticeField)(), 0);
  };

  return (
    <Modal title={t.titel} onClose={nichtJetzt} initialFocus={dabeiRef}>
      {
        /*
         * ★ E11a-2 (26.09.2026): `lang` auf dem Inhalt, NICHT auf `<html>` -
         * `sprache` ist hier `spracheGewaehlt` (siehe oben), aber die übrige
         * Oberfläche (Modal-Titelzeile, Schliessen-Knopf) folgt weiterhin der
         * gekappten, oberflächen-sicheren Sprache (`oberflaechenSprache`) und
         * bleibt für „fr" Englisch - GEMEINSAMER TEIL, `Modal.tsx` nimmt kein
         * `lang`-Prop an, vorher mit Johannes zu besprechen (siehe Befund).
         */
      }
      <div className="space-y-3" lang={htmlLang(sprache)}>

        {vorsatz ? <p className="m-0 text-lg text-ink">{vorsatz}</p> : null}
        <p className="m-0 text-lg text-ink">{einladungSatz(hostName, sprache)}</p>
        <p className="m-0 text-lg text-ink">{t.erklaerung}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            ref={dabeiRef}
            className="btn-primary"
            onClick={() => {
              onDabei();
              // Fokusziel: das Tippfeld. Es steht gleich da, wo jetzt das
              // Wartefenster ist - `focusPracticeField` hält die Anforderung
              // offen, bis es wirklich im Baum steht.
              focusPracticeField();
            }}
          >
            {t.dabei}
          </button>
          <button type="button" className="btn-ghost" onClick={nichtJetzt}>
            {t.nichtJetzt}
          </button>
        </div>
        <p className="m-0 text-base text-ink">{t.escape}</p>
      </div>
    </Modal>
  );
}
