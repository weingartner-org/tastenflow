/**
 * ★★★ DIE TIPPCHALLENGES EINES KINDES - für die Lehrkraft UND das Kind
 * (10.09.2026).
 *
 * Johannes, wörtlich: *„bei jedem schüler (wen man ausklappt) sieht man dann
 * genau an welchem Tag eine challenge war, wie viele minuten, welches Level
 * (tastatur), und alle 3 werte. das gleiche sehen auch die schüler in ihrer
 * Statistik"*.
 *
 * ── EIN Bauteil für beide Orte ──────────────────────────────────────────────
 * „Das gleiche" heisst hier wörtlich dasselbe: Die aufgeklappte Zeile in
 * „Meine Klassen" und „Meine Statistik" zeigen dieses Bauteil. Zwei Fassungen
 * einer Tabelle liefen beim ersten Nachbessern auseinander
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]). Kein Rang: Das
 * Kind sieht nur seine eigenen Zahlen, und ein Rang gilt ohnehin nur innerhalb
 * einer Runde.
 *
 * ★★ Nur die ANREDE der Mouseover-Hinweise unterscheidet die beiden Orte
 * (Johannes 10.09.2026: das Kind mit „du", die Lehrkraft mit „Sie"). Die
 * Sätze stehen in `HINWEIS_TABELLE`; wer die Tabelle einbaut, sagt, wer liest.
 *
 * ★ Alle Spalten mittig, Kopf und Zellen (Johannes 10.09.2026: nicht gemischt
 * links und rechts).
 *
 * Gerechnet wird nichts davon hier: Schnitt und Minuten kommen aus
 * `schreibprobenUebersicht.ts`.
 *
 * ── Warum kein waagrechter Rollbalken um die Tabelle ────────────────────────
 * Ein `overflow-x-auto` macht den Kasten auch SENKRECHT zum Rollkasten - und
 * schnitte dann die Mouseover-Hinweise der Überschriften ab, sobald die
 * Tabelle nur eine oder zwei Zeilen hat. Sechs kurze Spalten brechen lieber
 * um; das Datum darf zweizeilig werden.
 */
import {
  hinweisTabelle,
  minutenVon,
  niveauDef,
  niveauTexte,
  probenUebersicht,
  pruefungWort,
  startGeschrieben,
  uebersichtSatz,
  wertungVon,
  type Probenergebnis,
  type TabellenAnrede,
} from "@/lib/typing";
import { texte, useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";
import { Spaltenkopf } from "./Spaltenkopf";
import { eineStelle } from "./SchreibprobeErgebnis";
// ★ E1 (24.09.2026): das Niveau im Weg, aus dem die Challenge stammt.
import { lernwegVon } from "@/lib/typing/lernweg";

/**
 * ★ Die Tabelle in beiden Bedienungssprachen (EN3, 19.09.2026). Deutsch
 * wortgleich wie vorher. Die Hinweise an den Köpfen kommen aus
 * `hinweisTabelle` (EN5) - je Zielgruppe. Glossar §3.7: *key range*,
 * *Keystrokes/min* ★, *accuracy*, *score* (nur Challenge-Zahlen, §3.2),
 * *not scored*, Note ⇒ *mark*.
 */
const TABELLE_TEXTE = texte({
  de: {
    datum: "Datum",
    minuten: "Minuten",
    niveau: "Niveau",
    anschlaege: "Anschläge/Min",
    treffsicherheit: "Treffsicherheit",
    leistungswert: "Leistungswert",
    prozent: (n: number) => [n, " %"],
    ohneWertung: "ohne Wertung",
    keineNote: "Der Leistungswert ist keine Note. Wie er gerechnet wird, sagt der Hinweis an der Überschrift „Leistungswert“.",
    ende: (wort: string) => ["Ende der ", wort, "-Tabelle."],
    // ★ 23.09.2026 („Freies Schreiben", E6): nur ein KURZER Vermerk in der
    // Niveau-Zelle - „Freies Schreiben" ausgeschrieben sprengte die schmale
    // Spalte dieser Tabelle (anders als in `SchreibprobeKasten.tsx`, wo mehr
    // Platz ist).
    frei: "frei",
  },
  en: {
    datum: "Date",
    minuten: "Minutes",
    niveau: "Key range",
    anschlaege: "Keystrokes/min",
    treffsicherheit: "Accuracy",
    leistungswert: "Score",
    prozent: (n: number) => [n, "%"],
    ohneWertung: "not scored",
    keineNote: "The score is not a mark. How it is worked out is explained in the hint on the “Score” heading.",
    ende: (wort: string) => ["End of the ", wort, " table."],
    frei: "free typing",
  },
  fr: {
    datum: "Date",
    minuten: "Minutes",
    niveau: "Niveau",
    anschlaege: "Frappes/min",
    treffsicherheit: "Précision",
    leistungswert: "Score",
    prozent: (n: number) => [n, " %"],
    ohneWertung: "sans score",
    keineNote: "Le score n'est pas une note. Le mode de calcul est expliqué dans l'info-bulle du titre \"Score\".",
    ende: (wort: string) => ["Fin du tableau des ", wort, "."],
    frei: "libre",
  },
  es: {
    datum: "Fecha",
    minuten: "Minutos",
    niveau: "Nivel",
    anschlaege: "Pulsaciones por minuto",
    treffsicherheit: "Precisión",
    leistungswert: "Puntuación",
    prozent: (n: number) => [n, " %"],
    ohneWertung: "sin puntuación",
    keineNote: "La puntuación no es una nota. Cómo se calcula lo explica el texto de ayuda del título \"Puntuación\".",
    ende: (wort: string) => ["Fin de la tabla de ", wort, "."],
    frei: "libre",
  },
  it: {
    datum: "Data",
    minuten: "Minuti",
    niveau: "Livello",
    anschlaege: "Battute al minuto",
    treffsicherheit: "Precisione",
    leistungswert: "Punteggio",
    prozent: (n: number) => [n, "%"],
    ohneWertung: "senza punteggio",
    keineNote: `Il punteggio non è un voto. Come si calcola lo spiega il testo di aiuto del titolo "Punteggio".`,
    ende: (wort: string) => ["Fine della tabella della ", wort, "."],
    frei: "libera",
  },
  // ★ O-PL (02.10.2026): Spalte „Uderzenia/min", „Wynik", „95%" (Glossar
  // Regel 5/7); „tabeli Wyzwań" braucht den Genitiv - ausgeschrieben.
  pl: {
    datum: "Data",
    minuten: "Minuty",
    niveau: "Używane klawisze",
    anschlaege: "Uderzenia/min",
    treffsicherheit: "Dokładność",
    leistungswert: "Wynik",
    prozent: (n: number) => [n, "%"],
    ohneWertung: "bez wyniku",
    keineNote: "Wynik nie jest oceną. Jak się go oblicza, wyjaśnia podpowiedź przy nagłówku „Wynik”.",
    ende: () => ["Koniec tabeli Wyzwań."],
    frei: "swobodne",
  },
  // ★ O-TR (02.10.2026): Spalte "Vuruş/dk", "Yarışma puanı", "%95" (Glossar
  // §2.2, Regel 5); Hauptwörter, weil Kind und Lehrkraft die Tabelle sehen.
  tr: {
    datum: "Tarih",
    minuten: "Dakika",
    niveau: "Kullanılan tuşlar",
    anschlaege: "Vuruş/dk",
    treffsicherheit: "Doğruluk",
    leistungswert: "Yarışma puanı",
    prozent: (n: number) => ["%", n],
    ohneWertung: "puan yok",
    keineNote: `Yarışma puanı bir not değildir. Nasıl hesaplandığı, "Yarışma puanı" başlığındaki ipucunda yazar.`,
    ende: () => ["Yarışma tablosunun sonu."],
    frei: "serbest",
  },
  // ★ O-CS (03.10.2026): Spalte „Úhozů/min", „Skóre", „95 %" mit geschütztem
  // Leerzeichen (Glossar §1 Regel 5/6); „tabulky Výzev" braucht den Genitiv -
  // ausgeschrieben. Hauptwörter, weil Kind und Lehrkraft die Tabelle sehen.
  cs: {
    datum: "Datum",
    minuten: "Minuty",
    niveau: "Použité klávesy",
    anschlaege: "Úhozů/min",
    treffsicherheit: "Přesnost",
    leistungswert: "Skóre",
    prozent: (n: number) => [n, "\u00A0%"],
    ohneWertung: "bez skóre",
    keineNote: "Skóre není známka. Jak se počítá, vysvětluje tip u nadpisu Skóre.",
    ende: () => ["Konec tabulky Výzev."],
    frei: "volné",
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      datum: "Дата",
      minuten: "Минути",
      niveau: "Използвани клавиши",
      anschlaege: "Знаци/мин",
      treffsicherheit: "Точност",
      leistungswert: "Резултат",
      prozent: (n: number) => [n, "%"],
      ohneWertung: "без резултат",
      keineNote: "Резултатът не е оценка. Как се изчислява, пише в съвета към заглавието „Резултат“.",
      ende: (wort: string) => ["Край на таблицата: ", wort, "."],
      frei: "свободно",
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      datum: "Ημερομηνία",
      minuten: "Λεπτά",
      niveau: "Πλήκτρα",
      anschlaege: "Πατήματα/λεπτό",
      treffsicherheit: "Ακρίβεια",
      leistungswert: "Σκορ",
      prozent: (n: number) => [n, "%"],
      ohneWertung: "χωρίς σκορ",
      keineNote: "Το σκορ δεν είναι βαθμός. Πώς υπολογίζεται εξηγεί η συμβουλή στην επικεφαλίδα «Σκορ».",
      ende: (wort: string) => ["Τέλος του πίνακα: ", wort, "."],
      frei: "ελεύθερη",
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      datum: "Dátum",
      minuten: "Perc",
      niveau: "Billentyűk",
      anschlaege: "Leütés/perc",
      treffsicherheit: "Pontosság",
      leistungswert: "Pontszám",
      prozent: (n: number) => [n, "%"],
      ohneWertung: "értékelés nélkül",
      keineNote: "A pontszám nem érdemjegy. Hogy hogyan számoljuk, azt a „Pontszám” oszlopcím tippje mondja el.",
      ende: (wort: string) => ["Táblázat vége: ", wort, "."],
      frei: "szabad",
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      datum: "Datum",
      minuten: "Minuten",
      niveau: "Gebruikte toetsen",
      anschlaege: "Aanslagen/min",
      treffsicherheit: "Nauwkeurigheid",
      leistungswert: "Score",
      prozent: (n: number) => [n, "%"],
      ohneWertung: "zonder score",
      keineNote: "De score is geen beoordeling. Hoe de score wordt berekend, staat in de tip bij de kop \"Score\".",
      ende: (wort: string) => ["Einde van de tabel: ", wort, "."],
      frei: "vrij",
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      datum: "Data",
      minuten: "Minutos",
      niveau: "Teclas usadas",
      anschlaege: "Toques/min",
      treffsicherheit: "Precisão",
      leistungswert: "Pontuação",
      prozent: (n: number) => [n, "%"],
      ohneWertung: "sem pontuação",
      keineNote: "A pontuação não é uma nota. A forma de a calcular está explicada na dica do título \"Pontuação\".",
      ende: (wort: string) => ["Fim da tabela: ", wort, "."],
      frei: "livre",
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      datum: "Data",
      minuten: "Minutos",
      niveau: "Teclas usadas",
      anschlaege: "Toques/min",
      treffsicherheit: "Precisão",
      leistungswert: "Pontuação",
      prozent: (n: number) => [n, "%"],
      ohneWertung: "sem pontuação",
      keineNote: "A pontuação não é uma nota. Como ela é calculada está na dica do título Pontuação.",
      ende: (wort: string) => ["Fim da tabela: ", wort, "."],
      frei: "livre",
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      datum: "Data",
      minuten: "Minute",
      niveau: "Taste folosite",
      anschlaege: "Car./min",
      treffsicherheit: "Precizie",
      leistungswert: "Scor",
      prozent: (n: number) => [n, " %"],
      ohneWertung: "fără scor",
      keineNote: "Scorul nu este o notă. Cum se calculează explică sfatul de la titlul „Scor”.",
      ende: (wort: string) => ["Sfârșitul tabelului: ", wort, "."],
      frei: "liber",
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      datum: "Datum",
      minuten: "Minuter",
      niveau: "Tangenter",
      anschlaege: "Anslag/min",
      treffsicherheit: "Träffsäkerhet",
      leistungswert: "Poäng",
      prozent: (n: number) => [n, " %"],
      ohneWertung: "utan poäng",
      keineNote: "Poängen är inget betyg. Hur den räknas ut står i tipset vid rubriken Poäng.",
      ende: (wort: string) => ["Slut på tabellen: ", wort, "."],
      frei: "fri",
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      datum: "Дата",
      minuten: "Хвилини",
      niveau: "Клавіші тексту",
      anschlaege: "Знаків/хв",
      treffsicherheit: "Точність",
      leistungswert: "Бали Виклику",
      prozent: (n: number) => [n, "%"],
      ohneWertung: "без балів",
      keineNote: "Бали Виклику - це не оцінка. Як їх рахують, пояснює підказка до заголовка «Бали Виклику».",
      ende: (wort: string) => ["Кінець таблиці: ", wort, "."],
      frei: "вільне письмо",
    },
});

/** Eine Zahl mit höchstens einer Nachkommastelle und deutschem Komma (englisch mit Punkt). */
function zahl(n: number, sprache: BedienSprache = "de"): string {
  if (Number.isInteger(n)) return String(n);
  // ★ E11a-5: dieselbe Rundung wie überall - `eineStelle` kennt je Sprache
  // Komma oder Punkt (Französisch Komma, Bauplan §9.1).
  return eineStelle(n, sprache);
}

/**
 * „3 / 82" - die Zelle in „Meine Klassen".
 *
 * Sichtbar steht die kurze Form, für Sprachausgabe und Braillezeile der Satz:
 * „3 / 82" wäre dort ein Bruch ohne Bedeutung.
 */
export function SchreibprobenKennzahl({ ergebnisse }: { ergebnisse: readonly Probenergebnis[] }) {
  const { sprache } = useBedienSprache();
  const u = probenUebersicht(ergebnisse);
  const kurz =
    u.anzahl === 0 ? "-" : `${u.anzahl} / ${u.schnitt === null ? "-" : u.schnitt}`;
  return (
    <>
      <span aria-hidden="true" className="whitespace-nowrap tabular-nums text-ink">
        {kurz}
      </span>
      <span className="sr-only">{uebersichtSatz(u, sprache)}</span>
    </>
  );
}

export function SchreibprobenTabelle({
  ergebnisse,
  beschriftung,
  titel,
  anrede,
}: {
  ergebnisse: readonly Probenergebnis[];
  /** Die Beschriftung der Tabelle für die Sprachausgabe. */
  beschriftung: string;
  /** Eine sichtbare Überschrift darüber (in der aufgeklappten Zeile). */
  titel?: string;
  /** Wer liest: das Kind („du") oder die Lehrkraft („Sie"). */
  anrede: TabellenAnrede;
}) {
  const { sprache } = useBedienSprache();
  const t = TABELLE_TEXTE[sprache];
  if (ergebnisse.length === 0) return null;
  const H = hinweisTabelle(anrede, sprache);
  // Jüngste zuerst - hergestellt, nicht angenommen.
  const liste = [...ergebnisse].sort((a, b) => b.beginnMs - a.beginnMs);
  const u = probenUebersicht(liste);
  return (
    <div className="space-y-1" data-schreibproben-tabelle>
      {titel && <h4 className="m-0 text-sm font-semibold text-ink">{titel}</h4>}
      <p className="m-0 text-sm text-ink-muted">{uebersichtSatz(u, sprache)}.</p>
      <table className="w-full border-separate border-spacing-0 text-sm">
        <caption className="sr-only">{beschriftung}</caption>
        <thead>
          <tr className="text-center text-ink-muted">
            <Spaltenkopf className="px-2 py-1" hilfe={H.datum}>
              {t.datum}
            </Spaltenkopf>
            <Spaltenkopf className="px-2 py-1" hilfe={H.minuten}>
              {t.minuten}
            </Spaltenkopf>
            <Spaltenkopf className="px-2 py-1" hilfe={H.niveau}>
              {t.niveau}
            </Spaltenkopf>
            <Spaltenkopf className="px-2 py-1" hilfe={H.anschlaege}>
              {t.anschlaege}
            </Spaltenkopf>
            <Spaltenkopf className="px-2 py-1" hilfe={H.treffsicherheit} ausrichtung="rechts">
              {t.treffsicherheit}
            </Spaltenkopf>
            <Spaltenkopf className="px-2 py-1" hilfe={H.leistungswert} ausrichtung="rechts">
              {t.leistungswert}
            </Spaltenkopf>
          </tr>
        </thead>
        <tbody className="text-center [&_td]:border-t [&_td]:border-hairline/60 [&_td]:px-2 [&_td]:py-1 [&_th]:border-t [&_th]:border-hairline/60 [&_th]:px-2 [&_th]:py-1">
          {liste.map((e) => {
            const w = wertungVon(e);
            const niveau = niveauDef(e.niveau, lernwegVon(e));
            return (
              <tr key={`${e.probeId}#${e.beginnMs}`}>
                <th scope="row" className="font-normal text-ink">
                  {startGeschrieben(e.beginnMs, sprache)}
                </th>
                <td className="tabular-nums text-ink">{zahl(minutenVon(e), sprache)}</td>
                <td className="text-ink">
                  {niveau ? niveauTexte(niveau, sprache).kurz : e.niveau}
                  {/* ★ 23.09.2026 („Freies Schreiben"): kurzer Vermerk, damit
                      die Spalten schmal bleiben (Dateikopf, Zeile 136-187). */}
                  {e.modus === "frei" ? ` · ${t.frei}` : ""}
                </td>
                <td className="tabular-nums text-ink">{e.anschlaege}</td>
                <td className="tabular-nums text-ink">
                  {t.prozent(Math.round(Math.max(0, Math.min(1, e.genauigkeit)) * 100))}
                </td>
                <td className="tabular-nums text-ink">
                  {w.gewertet ? (
                    zahl(Math.round(w.wert * 10) / 10, sprache)
                  ) : (
                    // Eine Tatsache, kein Urteil: zu wenig Zeichen für eine Wertung.
                    <span className="text-ink-muted">{t.ohneWertung}</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="m-0 text-sm text-ink-muted">{t.keineNote}</p>
      {/* Der Satz nennt das Wort, damit ein Leser mit Braillezeile weiss, wovon
          die Zahlen handeln, auch wenn er direkt in die Tabelle springt. */}
      <span className="sr-only">{t.ende(pruefungWort(sprache))}</span>
    </div>
  );
}
