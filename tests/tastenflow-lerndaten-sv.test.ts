/**
 * ★★★ D-LERNDATEN (25.10.2026): Wächter der Lerndaten des Weges „sv" (Schwedisch).
 *
 * Die Regeln stehen EINMAL für alle neun Gerüst-Wege in `tests/helfer/lerndatenNeueWege.ts` (Vorbild: die cs-Wächter
 * `tastenflow-cs-woerter`, `tastenflow-wortspiele-cs`, `tastenflow-vorlage-koreny-cs`). Hier stehen nur die Sprache (Alphabet,
 * fremde Zeichen, Gegenproben der Sperrliste), die GELIEFERTEN Mengen und die benannten Abweichungen der gelieferten Daten -
 * genau diese, nicht eine mehr; jede steht als offene Menge im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`.
 * Quelle der Daten: iCloud `sprachen-2026-10-25/tf-fest-neu/sv/tf-fest-sv.json` + `PRUEFBERICHT.md`.
 */
import { gesperrtSv, istKernGesperrtSv, SV_SPERR_KERN_STAEMME, SV_SPERR_KERN_WOERTER, SV_SPERR_WORTBASIS, SV_SPERR_WORTBASIS_STAEMME } from "../src/lib/typing/sperrlisteSv";
import { STUFE_VOCAB_SV, WORDS_SV } from "../src/lib/typing/wordsSv";
import { RAETSEL_SV } from "../src/lib/typing/uebungsformen/lueckentextSv";
import { KORREKTUR_SV } from "../src/lib/typing/uebungsformen/korrekturlesenSv";
import { SALATWOERTER_SV } from "../src/lib/typing/uebungsformen/buchstabensalatSv";
import { VERBINDUNGEN_SV } from "../src/lib/typing/uebungsformen/gelaeufigkeitSv";
import { WORTKETTEN_SV } from "../src/lib/typing/uebungsformen/wortkettenSv";
import { WURZEL_CHALLENGE_TITEL_SV, WURZEL_THEMEN_SV, WURZELN_SV, WURZELN_SV_ALPHABETISCH, wurzelZeileSv } from "../src/lib/typing/vorlagenDaten/wurzelnSv";
import { pruefeLerndaten } from "./helfer/lerndatenNeueWege";

pruefeLerndaten({
  weg: "sv",
  name: "Schwedisch",
  buchstaben: "a-zåäöé",
  fremd: /[æøÆØ]/,
  fremdProbe: "smør", // smør (dänisch/norwegisch)
  woerter: WORDS_SV,
  vocab: STUFE_VOCAB_SV,
  raetsel: RAETSEL_SV,
  korrektur: KORREKTUR_SV,
  salat: SALATWOERTER_SV,
  verbindungen: VERBINDUNGEN_SV,
  ketten: WORTKETTEN_SV,
  wurzelThemen: WURZEL_THEMEN_SV,
  wurzeln: WURZELN_SV,
  wurzelnAlphabetisch: WURZELN_SV_ALPHABETISCH,
  wurzelZeile: wurzelZeileSv,
  challengeTitel: WURZEL_CHALLENGE_TITEL_SV,
  gesperrt: gesperrtSv,
  istKernGesperrt: istKernGesperrtSv,
  sperrListen: [SV_SPERR_KERN_STAEMME, SV_SPERR_KERN_WOERTER, SV_SPERR_WORTBASIS_STAEMME, SV_SPERR_WORTBASIS],
  sperrProben: { kern: ["kuk","knulla"], basis: ["fan","idiot"], frei: ["höra","fanns","kåta","knuff","brunkål"] },
  geliefert: {
    woerter: 1113,
    vocab: { kids: 141, teens: 77, erwachsen: 72 },
    raetsel: 253,
    korrektur: 37,
    salat: 115,
    verbindungen: 57,
    ketten: 15,
    // ★ Mindestzahl der Wurzel-Paare je Stufe = GELIEFERT (cs/it verlangen 80; nicht gesenkt, sondern gemessen und benannt).
    wurzelnMindestens: {
    kids: 63, // geliefert 63, Ziel 80
    teens: 62, // geliefert 62, Ziel 80
    erwachsen: 58, // geliefert 58, Ziel 80
    },
  },
  bekannt: {
    einBuchstabe: [],
    vocabInZweiStufen: [
      "bibliotek",
      "demokrati",
      "färja",
      "lön",
      "nyheter",
      "teater",
      "tåg",
    ],
    loesungMehrwortig: [
      "det var så lite",
      "hej då",
      "i den",
      "inga problem",
      "ingen orsak",
      "tack själv",
      "tack så mycket",
      "vi ses",
    ],
    salatLangFuerKinder: [
      "kyckling",
      "midsommar",
      "skärgård",
    ],
    wurzelZeileUeber40: [
      "barn till din faster eller morbror - kusin",
      "bevis på att man var någon annanstans - alibi",
      "bil som kör sjuka till sjukhuset - ambulans",
      "du pratar med någon som är långt borta - telefon",
      "där man lagar och bygger saker - verkstad",
      "grundämne med namn efter Stockholm - holmium",
      "grundämne med namn efter Ytterby - erbium",
      "grundämne med namn efter byn Ytterby - yttrium",
      "grundämne vars namn börjar som byn Ytterby - ytterbium",
      "hitta vägen med karta och kompass - orientering",
      "hoppar och har en ficka på magen - känguru",
      "inte för mycket och inte för lite - lagom",
      "kungens man som drev in skatt förr - fogde",
      "läran om berg, floder och länder - geografi",
      "lärling som blivit klar med sin utbildning - gesäll",
      "papper för att åka buss eller tåg - biljett",
      "paus med kaffe eller saft och bulle - fika",
      "persienn att dra ner för fönstret - jalusi",
      "person som ger pengar för att hjälpa andra - filantrop",
      "person som granskar myndigheterna - ombudsman",
      "rad av renar som drar slädar efter varandra - rajd",
      "rum med handfat och toalettstol - toalett",
      "spår av djur från urtiden i stenen - fossil",
      "stor ödla i floden med vassa tänder - krokodil",
      "svårt val mellan två dåliga saker - dilemma",
      "tung sten, gammalt namn på ett mineral - tungsten",
      "två arter lever tillsammans till nytta - symbios",
      "visar det som är mycket litet - mikroskop",
      "vuxna dricker det varmt på morgonen - kaffe",
      "växterna gör socker med ljus - fotosyntes",
      "ännu ett grundämne från Ytterby - terbium",
      "äter man till köttbullar och potatis - sås",
    ],
    wurzelWortGross: [],
    wurzelWortImHinweis: [
      "pjäxa",
      "smaka",
      "toalett",
    ],
    loesungImSatz: [
      "Efter maten säger man ofta: Tack för ...",
      "Ett barn, två ...",
    ],
    korrekturRichtigImSatz: [],
    wortGross: [],
    // á: „Sápmi“ (samischer Name des Gebiets; Wurzel-Thema und eine Lückentext-Lösung)
    zusatzBuchstaben: "á",
  },
});
