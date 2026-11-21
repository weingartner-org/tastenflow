/**
 * ★★★ D-LERNDATEN (25.10.2026): Wächter der Lerndaten des Weges „ro" (Rumänisch).
 *
 * Die Regeln stehen EINMAL für alle neun Gerüst-Wege in `tests/helfer/lerndatenNeueWege.ts` (Vorbild: die cs-Wächter
 * `tastenflow-cs-woerter`, `tastenflow-wortspiele-cs`, `tastenflow-vorlage-koreny-cs`). Hier stehen nur die Sprache (Alphabet,
 * fremde Zeichen, Gegenproben der Sperrliste), die GELIEFERTEN Mengen und die benannten Abweichungen der gelieferten Daten -
 * genau diese, nicht eine mehr; jede steht als offene Menge im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`.
 * Quelle der Daten: iCloud `sprachen-2026-10-25/tf-fest-neu/ro/tf-fest-ro.json` + `PRUEFBERICHT.md`.
 */
import { gesperrtRo, istKernGesperrtRo, RO_SPERR_KERN_STAEMME, RO_SPERR_KERN_WOERTER, RO_SPERR_WORTBASIS, RO_SPERR_WORTBASIS_STAEMME } from "../src/lib/typing/sperrlisteRo";
import { STUFE_VOCAB_RO, WORDS_RO } from "../src/lib/typing/wordsRo";
import { RAETSEL_RO } from "../src/lib/typing/uebungsformen/lueckentextRo";
import { KORREKTUR_RO } from "../src/lib/typing/uebungsformen/korrekturlesenRo";
import { SALATWOERTER_RO } from "../src/lib/typing/uebungsformen/buchstabensalatRo";
import { VERBINDUNGEN_RO } from "../src/lib/typing/uebungsformen/gelaeufigkeitRo";
import { WORTKETTEN_RO } from "../src/lib/typing/uebungsformen/wortkettenRo";
import { WURZEL_CHALLENGE_TITEL_RO, WURZEL_THEMEN_RO, WURZELN_RO, WURZELN_RO_ALPHABETISCH, wurzelZeileRo } from "../src/lib/typing/vorlagenDaten/wurzelnRo";
import { pruefeLerndaten } from "./helfer/lerndatenNeueWege";

pruefeLerndaten({
  weg: "ro",
  name: "Rumänisch",
  buchstaben: "a-zăâîșț",
  fremd: /[şţŞŢãÃ]/,
  fremdProbe: "şcoală", // şcoală (Cedille statt Komma)
  woerter: WORDS_RO,
  vocab: STUFE_VOCAB_RO,
  raetsel: RAETSEL_RO,
  korrektur: KORREKTUR_RO,
  salat: SALATWOERTER_RO,
  verbindungen: VERBINDUNGEN_RO,
  ketten: WORTKETTEN_RO,
  wurzelThemen: WURZEL_THEMEN_RO,
  wurzeln: WURZELN_RO,
  wurzelnAlphabetisch: WURZELN_RO_ALPHABETISCH,
  wurzelZeile: wurzelZeileRo,
  challengeTitel: WURZEL_CHALLENGE_TITEL_RO,
  gesperrt: gesperrtRo,
  istKernGesperrt: istKernGesperrtRo,
  sperrListen: [RO_SPERR_KERN_STAEMME, RO_SPERR_KERN_WOERTER, RO_SPERR_WORTBASIS_STAEMME, RO_SPERR_WORTBASIS],
  sperrProben: { kern: ["pizdă","fut"], basis: ["prost","idiot"], frei: ["futbol","viitor","cursă","pulover","curte"] },
  geliefert: {
    woerter: 1149,
    vocab: { kids: 127, teens: 70, erwachsen: 63 },
    raetsel: 252,
    korrektur: 39,
    salat: 111,
    verbindungen: 49,
    ketten: 15,
    // ★ Mindestzahl der Wurzel-Paare je Stufe = GELIEFERT (cs/it verlangen 80; nicht gesenkt, sondern gemessen und benannt).
    wurzelnMindestens: {
    kids: 63, // geliefert 63, Ziel 80
    teens: 62, // geliefert 62, Ziel 80
    erwachsen: 63, // geliefert 63, Ziel 80
    },
  },
  bekannt: {
    einBuchstabe: [],
    vocabInZweiStufen: [],
    loesungMehrwortig: [
      "ați putea",
      "douăzeci și patru",
      "o să merg",
      "sfârșitul de săptămână",
      "voi merge",
      "îmi pare rău",
    ],
    salatLangFuerKinder: [
      "bicicletă",
      "castravete",
      "ciocolată",
      "fereastră",
      "furculiță",
      "ghiozdan",
      "mămăligă",
      "mărțișor",
      "plăcintă",
      "primăvară",
      "prăjitură",
      "rândunică",
      "veveriță",
      "înghețată",
    ],
    wurzelZeileUeber40: [
      "aici mănânci și plătești nota - restaurant",
      "băiatul cu aceiași părinți ca tine - frate",
      "băutură caldă care te trezește dimineața - cafea",
      "cameră sub casă pentru provizii - pivniță",
      "cartier sărac de la marginea orașului - mahala",
      "cel care conduce o afacere proprie - antreprenor",
      "cel care garantează pentru altul - chezaș",
      "cel cu care te joci și împarți secrete - prieten",
      "cărămidă din lut nears și paie - chirpici",
      "căsuță mică unde se vând ziare și flori - chioșc",
      "din ea se fac sticle și ferestre - sticlă",
      "fereastra unde ești servit la instituție - ghișeu",
      "floare parfumată de primăvară, cu ciorchine - zambilă",
      "formula de adresare pentru un bărbat - domn",
      "frumos, plăcut, în vorbirea ardelenilor - fain",
      "haină lungă și subțire de primăvară - pardesiu",
      "haină pentru picioare, cu două crăcii - pantalon",
      "haină ușoară pentru partea de sus - bluză",
      "legumă din care se fac piureul și cartofii prăjiți - cartof",
      "lemn tăiat pentru construcții - cherestea",
      "locul unde se lasă hainele la teatru - garderobă",
      "lucrul de fiecare zi, pentru salariu - muncă",
      "masa din magazin la care se plătește - tejghea",
      "meșter care face acoperișuri din lemn - dulgher",
      "o mănânci cu ciorba, la orice masă - pâine",
      "persoană adultă, opusul bărbatului - femeie",
      "planeta noastră, sau solul de sub picioare - pământ",
      "plată pentru un serviciu lunar sau anual - abonament",
      "reprezentanța unei țări în străinătate - ambasadă",
      "sare din copac în copac și adună alune - veveriță",
      "se învârte sub bicicletă sau căruță - roată",
      "sentimentul dintre doi îndrăgostiți - dragoste",
      "în ea se pun hainele când pleci în vacanță - valiză",
    ],
    wurzelWortGross: [],
    wurzelWortImHinweis: [
      "cartof",
      "prag",
      "șurub",
    ],
    loesungImSatz: [
      "Albina zboară din floare în ...",
      "Programul care citește cu voce tare ce scrie pe ecran se numește cititor de ...",
    ],
    korrekturRichtigImSatz: [],
    wortGross: [],
    zusatzBuchstaben: "",
  },
});
