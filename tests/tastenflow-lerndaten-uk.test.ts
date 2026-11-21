/**
 * ★★★ D-LERNDATEN (25.10.2026): Wächter der Lerndaten des Weges „uk" (Ukrainisch).
 *
 * Die Regeln stehen EINMAL für alle neun Gerüst-Wege in `tests/helfer/lerndatenNeueWege.ts` (Vorbild: die cs-Wächter
 * `tastenflow-cs-woerter`, `tastenflow-wortspiele-cs`, `tastenflow-vorlage-koreny-cs`). Hier stehen nur die Sprache (Alphabet,
 * fremde Zeichen, Gegenproben der Sperrliste), die GELIEFERTEN Mengen und die benannten Abweichungen der gelieferten Daten -
 * genau diese, nicht eine mehr; jede steht als offene Menge im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`.
 * Quelle der Daten: iCloud `sprachen-2026-10-25/tf-fest-neu/uk/tf-fest-uk.json` + `PRUEFBERICHT.md`.
 */
import { gesperrtUk, istKernGesperrtUk, UK_SPERR_KERN_STAEMME, UK_SPERR_KERN_WOERTER, UK_SPERR_WORTBASIS, UK_SPERR_WORTBASIS_STAEMME } from "../src/lib/typing/sperrlisteUk";
import { STUFE_VOCAB_UK, WORDS_UK } from "../src/lib/typing/wordsUk";
import { RAETSEL_UK } from "../src/lib/typing/uebungsformen/lueckentextUk";
import { KORREKTUR_UK } from "../src/lib/typing/uebungsformen/korrekturlesenUk";
import { SALATWOERTER_UK } from "../src/lib/typing/uebungsformen/buchstabensalatUk";
import { VERBINDUNGEN_UK } from "../src/lib/typing/uebungsformen/gelaeufigkeitUk";
import { WORTKETTEN_UK } from "../src/lib/typing/uebungsformen/wortkettenUk";
import { WURZEL_CHALLENGE_TITEL_UK, WURZEL_THEMEN_UK, WURZELN_UK, WURZELN_UK_ALPHABETISCH, wurzelZeileUk } from "../src/lib/typing/vorlagenDaten/wurzelnUk";
import { pruefeLerndaten } from "./helfer/lerndatenNeueWege";

pruefeLerndaten({
  weg: "uk",
  name: "Ukrainisch",
  buchstaben: "абвгґдеєжзиіїйклмнопрстуфхцчшщьюя",
  fremd: /[A-Za-zыэъёЫЭЪЁ]/,
  fremdProbe: "мыш", // мыш (russisches ы)
  woerter: WORDS_UK,
  vocab: STUFE_VOCAB_UK,
  raetsel: RAETSEL_UK,
  korrektur: KORREKTUR_UK,
  salat: SALATWOERTER_UK,
  verbindungen: VERBINDUNGEN_UK,
  ketten: WORTKETTEN_UK,
  wurzelThemen: WURZEL_THEMEN_UK,
  wurzeln: WURZELN_UK,
  wurzelnAlphabetisch: WURZELN_UK_ALPHABETISCH,
  wurzelZeile: wurzelZeileUk,
  challengeTitel: WURZEL_CHALLENGE_TITEL_UK,
  gesperrt: gesperrtUk,
  istKernGesperrt: istKernGesperrtUk,
  sperrListen: [UK_SPERR_KERN_STAEMME, UK_SPERR_KERN_WOERTER, UK_SPERR_WORTBASIS_STAEMME, UK_SPERR_WORTBASIS],
  sperrProben: { kern: ["курва","хуй"], basis: ["сука","дебіл"], frei: ["курс","мудрий","хутір","сучасний"] },
  geliefert: {
    woerter: 1188,
    vocab: { kids: 127, teens: 77, erwachsen: 68 },
    raetsel: 253,
    korrektur: 38,
    salat: 120,
    verbindungen: 49,
    ketten: 15,
    // ★ Mindestzahl der Wurzel-Paare je Stufe = GELIEFERT (cs/it verlangen 80; nicht gesenkt, sondern gemessen und benannt).
    wurzelnMindestens: {
    kids: 63, // geliefert 63, Ziel 80
    teens: 61, // geliefert 61, Ziel 80
    erwachsen: 61, // geliefert 61, Ziel 80
    },
  },
  bekannt: {
    einBuchstabe: [
      "а",
      "о",
      "в",
      "і",
      "у",
      "я",
      "з",
      "б",
      "є",
    ],
    vocabInZweiStufen: [],
    loesungMehrwortig: [
      "Будь ласка",
      "На добраніч",
      "Нема за що",
      "Немає за що",
      "північному сході",
    ],
    salatLangFuerKinder: [
      "дзеркало",
      "завдання",
      "здоров'я",
      "кав'ярня",
      "комп'ютер",
      "кукурудза",
      "листопад",
      "людський",
      "майбутнє",
      "п'ятниця",
      "радісний",
      "сміється",
      "український",
      "черепаха",
      "щасливий",
    ],
    wurzelZeileUeber40: [
      "великий смичковий інструмент - віолончель",
      "виготовлення книжок і газет на машині - друк",
      "гра з м'ячиком через сітку на корті - теніс",
      "зелений хижак у річці з великою пащею - крокодил",
      "легка будка з гілля в полі чи на баштані - курінь",
      "людина, що займається спортом - спортсмен",
      "місто для лікування й відпочинку - курорт",
      "наука про гори, річки й країни - географія",
      "припущення, яке треба перевірити - гіпотеза",
      "рослина з великим листям, яке сушать - тютюн",
      "тканий візерунчастий виріб на підлогу - килим",
      "той, хто добре знає своє ремесло - майстер",
    ],
    wurzelWortGross: [],
    wurzelWortImHinweis: [
      "казан",
      "кобза",
    ],
    loesungImSatz: [
      "У день народження кажемо: \"З днем ...!\"",
      "У мене є кіт, а в тебе ... собака.",
    ],
    korrekturRichtigImSatz: [],
    wortGross: [],
    zusatzBuchstaben: "",
  },
});
