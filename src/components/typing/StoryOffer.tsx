/**
 * Der angekündigte GESCHICHTEN-HAUPTWEG auf der Abschluss-Karte — nach jeder
 * Runde in „Mein Training" und nach jeder Lektion (Wunsch Johannes 28.07.2026:
 * „Wer immer darauf klickt, hat am Ende alle Geschichten und alle anderen
 * Inhalte gemacht").
 *
 * Bewusst als ANKÜNDIGUNG statt als beiläufiges Angebot: „Jetzt kommt eine
 * Geschichte: <Titel>". Der Knopf ist der Hauptknopf der Karte und ihr ERSTER
 * Tabstopp — ein Tab und eine Eingabetaste genügen, auch mit Screenreader und
 * Braillezeile. Wer gerade lieber Tasten übt, geht mit dem kleinen „lieber
 * weiter üben" daneben weiter; erzwungen wird nichts.
 *
 * ★ 31.08.2026 (F1): Bis dahin holte sich dieser Knopf den Fokus SELBST. Seit
 * die Abschluss-Karte eine Fokus-Falle hat, setzt SIE den Anfangsfokus — auf
 * ihre Überschrift, damit ein Kind mit Blindheit zuerst hört, was es geschafft
 * hat, und erst danach das Angebot (Entscheidung Johannes). Zwei Stellen, die
 * denselben Fokus setzen, wären genau die Doppelung, die einander nicht kennt:
 * Wer zuletzt fertig wird, gewinnt — und das Angebot mountete oft später,
 * weil es am frisch gespeicherten Lesestand hängt.
 *
 * Eine Etappe ist 12 Zeilen — genauso lang wie eine Übungsrunde — und zählt
 * seit 28.07. auch genauso viel (Tasten-Freischaltung + Abzeichen, siehe
 * SerienTrainer). Der Lesestand wird nach jeder Zeile gespeichert, also kann
 * man am nächsten Tag genau dort weiterschreiben.
 */
import { feinesLangAttribut } from "@/lib/typing/schreibweise";
import type { Serie, Skin } from "@/lib/typing";
import { texte, useBedienSprache } from "@/lib/bedienSprache";

/**
 * ★ Die sechs Ankündigungen in beiden Bedienungssprachen (EN1, 19.09.2026).
 * Deutsch wortgleich wie vorher. Englisch: *story* und *non-fiction* (Glossar
 * §3.6); die Kinder-Fassung warm und kurz, ab 11 trocken und anrede-frei.
 */
const ANGEBOT_TEXTE = texte({
  de: {
    weiterKind: "Weiter mit deiner Geschichte:",
    weiterWissen: "Weiter im Text:",
    weiterGeschichte: "Weiter in der Geschichte:",
    neuKindWissen: "Jetzt kommt etwas zum Staunen:",
    neuGeschichte: "Jetzt kommt eine Geschichte:",
    neuWissen: "Jetzt kommt ein Wissenstext:",
  },
  en: {
    weiterKind: "Carry on with your story:",
    weiterWissen: "Carry on reading:",
    weiterGeschichte: "Carry on with the story:",
    neuKindWissen: "Now for something amazing:",
    neuGeschichte: "Now for a story:",
    neuWissen: "Now for a non-fiction text:",
  },
  fr: {
    weiterKind: "Continue ton histoire :",
    weiterWissen: "Continue ta lecture :",
    weiterGeschichte: "Continue l'histoire :",
    neuKindWissen: "Voici quelque chose d'étonnant :",
    neuGeschichte: "Voici une histoire :",
    neuWissen: "Voici un texte documentaire :",
  },
  es: {
    weiterKind: "Sigue con tu cuento:",
    weiterWissen: "Sigue leyendo:",
    weiterGeschichte: "Sigue con el cuento:",
    neuKindWissen: "Aquí tienes algo sorprendente:",
    neuGeschichte: "Aquí tienes un cuento:",
    neuWissen: "Aquí tienes un texto de divulgación:",
  },
  it: {
    weiterKind: "Continua la tua storia:",
    weiterWissen: "Continua a leggere:",
    weiterGeschichte: "Continua la storia:",
    neuKindWissen: "Ecco una cosa sorprendente:",
    neuGeschichte: "Ecco una storia:",
    neuWissen: "Ecco un testo di divulgazione:",
  },
  // ★ O-PL (02.10.2026): „opowiadanie", „tekst z ciekawostkami" (Glossar §2.2).
  pl: {
    weiterKind: "Ciąg dalszy twojego opowiadania:",
    weiterWissen: "Czytaj dalej:",
    weiterGeschichte: "Ciąg dalszy opowiadania:",
    neuKindWissen: "A teraz coś niesamowitego:",
    neuGeschichte: "Teraz opowiadanie:",
    neuWissen: "Teraz tekst z ciekawostkami:",
  },
  // ★ O-TR (02.10.2026): "öykü", "bilgi metni" (Glossar §2.2), sen.
  tr: {
    weiterKind: "Öykün devam ediyor:",
    weiterWissen: "Okumaya devam:",
    weiterGeschichte: "Öykü devam ediyor:",
    neuKindWissen: "Şimdi seni şaşırtacak bir şey var:",
    neuGeschichte: "Sırada bir öykü var:",
    neuWissen: "Sırada bir bilgi metni var:",
  },
  // ★ O-CS (03.10.2026): „příběh", „text se zajímavostmi" (Glossar §2.2), ty.
  cs: {
    weiterKind: "Pokračuje tvůj příběh:",
    weiterWissen: "Čti dál:",
    weiterGeschichte: "Pokračování příběhu:",
    neuKindWissen: "A teď něco úžasného:",
    neuGeschichte: "Teď příběh:",
    neuWissen: "Teď text se zajímavostmi:",
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      weiterKind: "Продължение на твоята история:",
      weiterWissen: "Продължение на текста:",
      weiterGeschichte: "Продължение на историята:",
      neuKindWissen: "А сега нещо удивително:",
      neuGeschichte: "А сега една история:",
      neuWissen: "А сега текст с любопитни факти:",
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      weiterKind: "Συνέχεια της ιστορίας σου:",
      weiterWissen: "Συνέχεια του κειμένου:",
      weiterGeschichte: "Συνέχεια της ιστορίας:",
      neuKindWissen: "Και τώρα κάτι εντυπωσιακό:",
      neuGeschichte: "Και τώρα μια ιστορία:",
      neuWissen: "Και τώρα ένα κείμενο γνώσεων:",
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      weiterKind: "Folytasd a történetedet:",
      weiterWissen: "Olvass tovább:",
      weiterGeschichte: "Folytasd a történetet:",
      neuKindWissen: "Most valami csodálatos jön:",
      neuGeschichte: "Most egy történet jön:",
      neuWissen: "Most egy ismeretterjesztő szöveg jön:",
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      weiterKind: "Verder met je verhaal:",
      weiterWissen: "Verder met de tekst:",
      weiterGeschichte: "Verder met het verhaal:",
      neuKindWissen: "Nu iets om je over te verbazen:",
      neuGeschichte: "Nu komt er een verhaal:",
      neuWissen: "Nu komt er een weetjestekst:",
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      weiterKind: "Continua a tua história:",
      weiterWissen: "Continua a leitura:",
      weiterGeschichte: "Continua a história:",
      neuKindWissen: "Agora, uma coisa espantosa:",
      neuGeschichte: "Agora, uma história:",
      neuWissen: "Agora, um texto de curiosidades:",
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      weiterKind: "Continue a sua história:",
      weiterWissen: "Continue a leitura:",
      weiterGeschichte: "Continue a história:",
      neuKindWissen: "Agora, uma curiosidade incrível:",
      neuGeschichte: "Agora, uma história:",
      neuWissen: "Agora, um texto de curiosidades:",
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      weiterKind: "Continuă povestea ta:",
      weiterWissen: "Continuă lectura:",
      weiterGeschichte: "Continuă povestea:",
      neuKindWissen: "Acum urmează ceva uimitor:",
      neuGeschichte: "Acum urmează o poveste:",
      neuWissen: "Acum urmează un text cu curiozități:",
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      weiterKind: "Fortsätt med din berättelse:",
      weiterWissen: "Fortsätt läsa:",
      weiterGeschichte: "Fortsätt med berättelsen:",
      neuKindWissen: "Nu kommer något att häpna över:",
      neuGeschichte: "Nu kommer en berättelse:",
      neuWissen: "Nu kommer en faktatext:",
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      weiterKind: "Продовжуй свою історію:",
      weiterWissen: "Читай текст далі:",
      weiterGeschichte: "Продовжуй історію:",
      neuKindWissen: "А тепер щось дивовижне:",
      neuGeschichte: "А тепер історія:",
      neuWissen: "А тепер пізнавальний текст:",
    },
});

export function StoryOffer({
  serie,
  weiter,
  skin,
  onOpen,
}: {
  serie: Serie;
  /** Läuft die Geschichte schon (dann „Weiter mit …" statt „Jetzt kommt …")? */
  weiter: boolean;
  skin: Skin;
  onOpen: () => void;
}) {
  const { sprache, bereichAktiv } = useBedienSprache();
  const t = ANGEBOT_TEXTE[sprache];
  const wissen = serie.kind === "wissen-serie";
  // Zwei Fassungen (S2, 15.08.2026): Das Kinder-Profil bekommt „deine
  // Geschichte" und „etwas zum Staunen", ab 11 die trockene, anrede-freie
  // Ankündigung. Eine Geschichte heißt dabei weiter GESCHICHTE — „ein Text"
  // klingt nach Schulaufgabe und wäre nüchtern statt ernst genommen (Johannes'
  // Maßstab). Trocken ist der TON, nicht die Sache: Nur die Wissens-Reihen
  // heißen sachlich „Wissenstext".
  const kid = skin === "kind";
  const anrede = weiter
    ? kid
      ? t.weiterKind
      : wissen
        ? t.weiterWissen
        : t.weiterGeschichte
    : kid
      ? wissen
        ? t.neuKindWissen
        : t.neuGeschichte
      : wissen
        ? t.neuWissen
        : t.neuGeschichte;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <button type="button" className="btn-primary" onClick={onOpen}>
        <span aria-hidden>{wissen ? "💡 " : "📖 "}</span>
        {anrede}{" "}
        {/* Der Titel ist INHALT in der Sprache der Geschichte - bei aktivem
            Sprachbereich darum als solcher ausgezeichnet, damit eine
            Sprachausgabe einen deutschen Titel in englischer Bedienung deutsch
            liest. Ohne Provider: derselbe Textknoten wie vorher. */}
        {bereichAktiv ? <span lang={feinesLangAttribut(serie.lang ?? "de")}>{serie.titel}</span> : serie.titel}
      </button>
    </div>
  );
}
