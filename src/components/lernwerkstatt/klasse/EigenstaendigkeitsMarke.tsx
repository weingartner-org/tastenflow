/**
 * ★★ E10 (19.09.2026): die Marke „prüfen" in der NAMENSZEILE der
 * Klassentabelle.
 *
 * Johannes 18.09.2026: *„Sollte der Verdacht auf KI-Arbeiten sein, dann
 * brauchen wir eine Warnung ganz oben in der Namenszeile mit rot."* - und am
 * Abend zur Check-Seite: *„mittel orange und rot für stark, aber beides
 * kennzeichnen"*.
 *
 * ── Die Stufen sind DIESELBEN wie am `SuspicionChip` ─────────────────────
 * (`PupilStatsPanel.tsx`): bis 3 unauffällig (keine Marke), 4-6 auffällig
 * (orange), ab 7 stark auffällig (rot). Eine zweite Schwelle hier wäre genau
 * die Doppelung, die einander nicht kennt
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]) - die Grenzen
 * stehen darum als {@link eigenstaendigkeitsStufe} an EINER Stelle, und die
 * Wörter kommen aus derselben Glossar-Zeile („auffällig" · „stark auffällig").
 *
 * ── Gemessen, bevor gebaut (MESSUNG-2026-09-18-EIGENSTAENDIGKEITS-CHECK.md §10/§11)
 * Mit der heutigen Formel stehen 126 von 128 Kindern bei 1, zwei bei 3,
 * niemand bei 4 oder mehr - die Marke erscheint heute bei KEINEM Kind. Die
 * neuen Regeln (B1-E, §11) fliessen noch NICHT in den Wert: Dort sind Kinder
 * mit Hilfsmittel auffällig übervertreten, und vor einer Schwelle gehört je
 * Hilfsmittel-Gruppe getrennt geprüft ([[feedback_nie_gegen_das_kind]]).
 *
 * ── Farbe trägt nicht allein (WCAG 1.4.1, Windows-Kontrastmodus) ─────────
 * Beide Stufen tragen das Wort „prüfen" und einen Rahmen (bleibt im
 * Kontrastmodus in der Systemfarbe stehen). Die starke Stufe hat dazu das
 * Zeichen „!" und einen doppelt so dicken Rahmen - Form und Zeichen
 * unterscheiden sie, nicht nur der Farbton. Rot als Schrift auf hellem Rot
 * statt Weiss auf Rot: Im dunklen Design ist `danger` ein helles Rot, weisse
 * Schrift darauf wäre kaum lesbar.
 *
 * ── Sprachausgabe ─────────────────────────────────────────────────────────
 * Die Marke steht in der Zeilenüberschrift (`<th scope="row">`) und wird
 * darum mit dem Namen angesagt: „Mia, Eigenständigkeit prüfen, auffällig".
 * Die sichtbare Kurzform ist `aria-hidden`; die Gründe stehen in der
 * aufgeklappten Zeile („Eigenständigkeit - 2 Hinweise") und im Hinweis beim
 * Zeigen. „prüfen" statt „Verdacht", ohne „KI" - eine Bitte an die
 * Lehrkraft, kein Urteil über das Kind (Entwurf 18.09., V4).
 *
 * Nur für die Lehrkraft: Kinder sehen die Hinweise nicht (Johannes 18.09.:
 * *„nein, vorerst nicht"*).
 */
import { texte, useBedienSprache } from "@/lib/bedienSprache";
import { Hinweisflaeche } from "@/components/typing/Zeigerhinweis";

/** Die Stufe zu einem Wert 0-10 - dieselben Grenzen wie `SuspicionChip`. */
export function eigenstaendigkeitsStufe(score: number): "keine" | "auffaellig" | "stark" {
  if (score <= 3) return "keine";
  if (score <= 6) return "auffaellig";
  return "stark";
}

const TEXTE = texte({
  de: {
    kurz: "prüfen",
    stufeAuffaellig: "auffällig",
    stufeStark: "stark auffällig",
    ansage: (stufe: string) => `, Eigenständigkeit prüfen: ${stufe}`,
    hilfe: (score: number, stufe: string, gruende: string[]) =>
      `Eigenständigkeit ${score} von 10, ${stufe}.` +
      (gruende.length ? ` ${gruende.join(" ")}` : "") +
      ` Die Gründe stehen auch in der aufgeklappten Zeile unter „Eigenständigkeit". Eine Bitte, genauer hinzusehen - kein Urteil über das Kind.`,
  },
  en: {
    kurz: "check",
    stufeAuffaellig: "unusual",
    stufeStark: "very unusual",
    ansage: (stufe: string) => `, please check independent work: ${stufe}`,
    hilfe: (score: number, stufe: string, gruende: string[]) =>
      `Independent work ${score} of 10, ${stufe}.` +
      (gruende.length ? ` ${gruende.join(" ")}` : "") +
      ` The reasons are also listed in the expanded row under "Independent work". A prompt to take a closer look - not a verdict on the child.`,
  },
  fr: {
    kurz: "vérifier",
    stufeAuffaellig: "atypique",
    stufeStark: "très atypique",
    ansage: (stufe: string) => `, autonomie à vérifier : ${stufe}`,
    hilfe: (score: number, stufe: string, gruende: string[]) =>
      `Autonomie ${score} sur 10, ${stufe}.` +
      (gruende.length ? ` ${gruende.join(" ")}` : "") +
      ` Les raisons figurent aussi dans la ligne dépliée sous "Autonomie". Une invitation à regarder de plus près - pas un jugement sur l'élève.`,
  },
  es: {
    kurz: "revisar",
    stufeAuffaellig: "poco habitual",
    stufeStark: "muy poco habitual",
    ansage: (stufe: string) => `, autonomía por revisar: ${stufe}`,
    hilfe: (score: number, stufe: string, gruende: string[]) =>
      `Autonomía ${score} de 10, ${stufe}.` +
      (gruende.length ? ` ${gruende.join(" ")}` : "") +
      ` Los motivos también están en la fila desplegada, en "Autonomía". Una invitación a mirar con más calma - no un juicio sobre la persona.`,
  },
  // ★ O-IT (02.10.2026): „lavoro autonomo", nie „imbroglio" (Glossar §2.6, Regel 7).
  it: {
    kurz: "da guardare",
    stufeAuffaellig: "insolito",
    stufeStark: "molto insolito",
    ansage: (stufe: string) => `, lavoro autonomo da guardare: ${stufe}`,
    hilfe: (score: number, stufe: string, gruende: string[]) =>
      `Lavoro autonomo ${score} su 10, ${stufe}.` +
      (gruende.length ? ` ${gruende.join(" ")}` : "") +
      ` I motivi sono anche nella riga aperta, sotto "Lavoro autonomo". Un invito a guardare con più calma - non un giudizio sulla persona.`,
  },
  // ★ O-PL (02.10.2026): „samodzielność pracy" (Glossar §2.6) - nie gegen das
  // Kind, kein „ściąganie"; „osoba" statt eines Wortes mit Geschlecht.
  pl: {
    kurz: "do sprawdzenia",
    stufeAuffaellig: "nietypowo",
    stufeStark: "bardzo nietypowo",
    ansage: (stufe: string) => `, samodzielność pracy do sprawdzenia: ${stufe}`,
    hilfe: (score: number, stufe: string, gruende: string[]) =>
      `Samodzielność pracy: ${score} z 10, ${stufe}.` +
      (gruende.length ? ` ${gruende.join(" ")}` : "") +
      " Powody są też w rozwiniętym wierszu, pod „Samodzielność pracy”. To prośba o dokładniejsze przyjrzenie się - nie ocena osoby.",
  },
  // ★ O-TR (02.10.2026): "bağımsız çalışma" (Glossar §2.6) - nie "kopya", nie
  // gegen das Kind; die Zahl ohne Endung und ohne "6 / 10" (Regel 6).
  tr: {
    kurz: "incelenmeli",
    stufeAuffaellig: "alışılmadık",
    stufeStark: "çok alışılmadık",
    ansage: (stufe: string) => `, bağımsız çalışma incelenmeli: ${stufe}`,
    hilfe: (score: number, stufe: string, gruende: string[]) =>
      `Bağımsız çalışma: ${score} (en çok 10), ${stufe}.` +
      (gruende.length ? ` ${gruende.join(" ")}` : "") +
      " Nedenler, açılan satırda \"Bağımsız çalışma\" başlığının altında da yazılı. Bu, daha yakından bakmak için bir davettir - öğrenci hakkında bir yargı değildir.",
  },
  // ★ O-CS (03.10.2026): „samostatná práce" / „kontrola samostatnosti" (Glossar
  // §2.6) - nie „podvádění", nie gegen das Kind; „osoba" statt eines Wortes mit
  // Geschlecht (Regel 2), die Zahl mit Schrägstrich (Regel 13).
  cs: {
    kurz: "ke kontrole",
    stufeAuffaellig: "neobvyklé",
    stufeStark: "velmi neobvyklé",
    ansage: (stufe: string) => `, kontrola samostatnosti: ${stufe}`,
    hilfe: (score: number, stufe: string, gruende: string[]) =>
      `Samostatná práce: ${score}/10, ${stufe}.` +
      (gruende.length ? ` ${gruende.join(" ")}` : "") +
      " Důvody jsou uvedené i v rozbaleném řádku, v části Samostatná práce. Je to podnět k bližšímu pohledu - ne hodnocení osoby.",
  },
  bg: {
    kurz: "за проверка",
    stufeAuffaellig: "необичайно",
    stufeStark: "много необичайно",
    ansage: (stufe: string) => `, проверка за самостоятелност: ${stufe}`,
    hilfe: (score: number, stufe: string, gruende: string[]) =>
      `Самостоятелна работа: ${score}/10, ${stufe}.` +
      (gruende.length ? ` ${gruende.join(" ")}` : "") +
      " Причините са посочени и в разгънатия ред, в частта Самостоятелна работа. Това е повод да се погледне по-отблизо - не е преценка за детето.",
  },
  el: {
    kurz: "για έλεγχο",
    stufeAuffaellig: "ασυνήθιστο",
    stufeStark: "πολύ ασυνήθιστο",
    ansage: (stufe: string) => `, έλεγχος αυτονομίας: ${stufe}`,
    hilfe: (score: number, stufe: string, gruende: string[]) =>
      `Αυτόνομη εργασία: ${score} από 10, ${stufe}.` +
      (gruende.length ? ` ${gruende.join(" ")}` : "") +
      " Οι λόγοι υπάρχουν και στην ανοιγμένη γραμμή, στο μέρος «Αυτόνομη εργασία». Είναι μια αφορμή για πιο προσεκτική ματιά - όχι κρίση για το παιδί.",
  },
  hu: {
    kurz: "ellenőrzésre",
    stufeAuffaellig: "szokatlan",
    stufeStark: "nagyon szokatlan",
    ansage: (stufe: string) => `, önálló munka ellenőrzése: ${stufe}`,
    hilfe: (score: number, stufe: string, gruende: string[]) =>
      `Önálló munka: ${score}/10, ${stufe}.` +
      (gruende.length ? ` ${gruende.join(" ")}` : "") +
      " Az okok a kinyitott sorban is olvashatók, az Önálló munka résznél. Ez felkérés a közelebbi vizsgálatra - nem ítélet a tanulóról.",
  },
  nl: {
    kurz: "controleren",
    stufeAuffaellig: "ongebruikelijk",
    stufeStark: "zeer ongebruikelijk",
    ansage: (stufe: string) => `, zelfstandig werk controleren: ${stufe}`,
    hilfe: (score: number, stufe: string, gruende: string[]) =>
      `Zelfstandig werk: ${score} van 10, ${stufe}.` +
      (gruende.length ? ` ${gruende.join(" ")}` : "") +
      " De redenen staan ook in de uitgeklapte regel, onder Zelfstandig werk. Dit is een verzoek om beter te kijken - geen oordeel over de leerling.",
  },
  pt: {
    kurz: "verificar",
    stufeAuffaellig: "invulgar",
    stufeStark: "muito invulgar",
    ansage: (stufe: string) => `, verificação do trabalho autónomo: ${stufe}`,
    hilfe: (score: number, stufe: string, gruende: string[]) =>
      `Trabalho autónomo: ${score} de 10, ${stufe}.` +
      (gruende.length ? ` ${gruende.join(" ")}` : "") +
      " Os motivos também estão na linha expandida, em \"Trabalho autónomo\". É um convite a observar melhor - não é uma avaliação da pessoa.",
  },
  br: {
    kurz: "verificar",
    stufeAuffaellig: "incomum",
    stufeStark: "muito incomum",
    ansage: (stufe: string) => `, verificação do trabalho autônomo: ${stufe}`,
    hilfe: (score: number, stufe: string, gruende: string[]) =>
      `Trabalho autônomo: ${score}/10, ${stufe}.` +
      (gruende.length ? ` ${gruende.join(" ")}` : "") +
      " Os motivos também aparecem na linha expandida, em Trabalho autônomo. É um convite para olhar com mais atenção - não um julgamento sobre a pessoa.",
  },
  ro: {
    kurz: "de verificat",
    stufeAuffaellig: "neobișnuit",
    stufeStark: "foarte neobișnuit",
    ansage: (stufe: string) => `, verificarea lucrului independent: ${stufe}`,
    hilfe: (score: number, stufe: string, gruende: string[]) =>
      `Lucru independent: ${score}/10, ${stufe}.` +
      (gruende.length ? ` ${gruende.join(" ")}` : "") +
      " Motivele apar și în rândul extins, la Lucru independent. Este o invitație la o privire mai atentă - nu o judecată despre persoană.",
  },
  sv: {
    kurz: "kontrollera",
    stufeAuffaellig: "ovanligt",
    stufeStark: "mycket ovanligt",
    ansage: (stufe: string) => `, kontrollera självständigt arbete: ${stufe}`,
    hilfe: (score: number, stufe: string, gruende: string[]) =>
      `Självständigt arbete: ${score}/10, ${stufe}.` +
      (gruende.length ? ` ${gruende.join(" ")}` : "") +
      " Skälen står också på den utfällda raden, under Självständigt arbete. Det är en uppmaning att titta närmare - inget omdöme om eleven.",
  },
  uk: {
    kurz: "перевірити",
    stufeAuffaellig: "незвично",
    stufeStark: "дуже незвично",
    ansage: (stufe: string) => `, перевірка самостійності: ${stufe}`,
    hilfe: (score: number, stufe: string, gruende: string[]) =>
      `Самостійна робота: ${score}/10, ${stufe}.` +
      (gruende.length ? ` ${gruende.join(" ")}` : "") +
      " Причини також указано в розгорнутому рядку, у частині Самостійна робота. Це привід придивитися уважніше - а не оцінка дитини.",
  },
});

export function EigenstaendigkeitsMarke({
  score,
  reasons,
}: {
  score: number;
  reasons: string[];
}) {
  const { sprache } = useBedienSprache();
  const stufe = eigenstaendigkeitsStufe(score);
  if (stufe === "keine") return null;
  const t = TEXTE[sprache];
  const wort = stufe === "stark" ? t.stufeStark : t.stufeAuffaellig;
  const stark = stufe === "stark";
  return (
    <Hinweisflaeche
      hilfe={t.hilfe(score, wort, reasons)}
      data-eigenstaendigkeit={stufe}
      className={
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-sm font-semibold " +
        (stark
          ? "border-2 border-danger bg-danger-soft text-danger"
          : "border border-warning bg-warning-soft text-ink")
      }
    >
      <span aria-hidden="true">
        {stark ? "! " : ""}
        {t.kurz}
      </span>
      <span className="sr-only">{t.ansage(wort)}</span>
    </Hinweisflaeche>
  );
}
