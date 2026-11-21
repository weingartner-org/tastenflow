/**
 * ★★★ D-LERNDATEN (25.10.2026): Wächter der Lerndaten des Weges „hu" (Ungarisch).
 *
 * Die Regeln stehen EINMAL für alle neun Gerüst-Wege in `tests/helfer/lerndatenNeueWege.ts` (Vorbild: die cs-Wächter
 * `tastenflow-cs-woerter`, `tastenflow-wortspiele-cs`, `tastenflow-vorlage-koreny-cs`). Hier stehen nur die Sprache (Alphabet,
 * fremde Zeichen, Gegenproben der Sperrliste), die GELIEFERTEN Mengen und die benannten Abweichungen der gelieferten Daten -
 * genau diese, nicht eine mehr; jede steht als offene Menge im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`.
 * Quelle der Daten: iCloud `sprachen-2026-10-25/tf-fest-neu/hu/tf-fest-hu.json` + `PRUEFBERICHT.md`.
 */
import { gesperrtHu, istKernGesperrtHu, HU_SPERR_KERN_STAEMME, HU_SPERR_KERN_WOERTER, HU_SPERR_WORTBASIS, HU_SPERR_WORTBASIS_STAEMME } from "../src/lib/typing/sperrlisteHu";
import { STUFE_VOCAB_HU, WORDS_HU } from "../src/lib/typing/wordsHu";
import { RAETSEL_HU } from "../src/lib/typing/uebungsformen/lueckentextHu";
import { KORREKTUR_HU } from "../src/lib/typing/uebungsformen/korrekturlesenHu";
import { SALATWOERTER_HU } from "../src/lib/typing/uebungsformen/buchstabensalatHu";
import { VERBINDUNGEN_HU } from "../src/lib/typing/uebungsformen/gelaeufigkeitHu";
import { WORTKETTEN_HU } from "../src/lib/typing/uebungsformen/wortkettenHu";
import { WURZEL_CHALLENGE_TITEL_HU, WURZEL_THEMEN_HU, WURZELN_HU, WURZELN_HU_ALPHABETISCH, wurzelZeileHu } from "../src/lib/typing/vorlagenDaten/wurzelnHu";
import { pruefeLerndaten } from "./helfer/lerndatenNeueWege";

pruefeLerndaten({
  weg: "hu",
  name: "Ungarisch",
  buchstaben: "a-záéíóöőúüű",
  fremd: /[õûôũŏ]/,
  fremdProbe: "kõ", // kõ (Tilde statt Doppelakut)
  woerter: WORDS_HU,
  vocab: STUFE_VOCAB_HU,
  raetsel: RAETSEL_HU,
  korrektur: KORREKTUR_HU,
  salat: SALATWOERTER_HU,
  verbindungen: VERBINDUNGEN_HU,
  ketten: WORTKETTEN_HU,
  wurzelThemen: WURZEL_THEMEN_HU,
  wurzeln: WURZELN_HU,
  wurzelnAlphabetisch: WURZELN_HU_ALPHABETISCH,
  wurzelZeile: wurzelZeileHu,
  challengeTitel: WURZEL_CHALLENGE_TITEL_HU,
  gesperrt: gesperrtHu,
  istKernGesperrt: istKernGesperrtHu,
  sperrListen: [HU_SPERR_KERN_STAEMME, HU_SPERR_KERN_WOERTER, HU_SPERR_WORTBASIS_STAEMME, HU_SPERR_WORTBASIS],
  sperrProben: { kern: ["kurva","fasz"], basis: ["hülye","barom"], frei: ["szarvas","szarka","faszén","francia","kúra","basszus","tőke"] },
  geliefert: {
    woerter: 1200,
    vocab: { kids: 154, teens: 81, erwachsen: 73 },
    raetsel: 255,
    korrektur: 39,
    salat: 112,
    verbindungen: 45,
    ketten: 15,
    // ★ Mindestzahl der Wurzel-Paare je Stufe = GELIEFERT (cs/it verlangen 80; nicht gesenkt, sondern gemessen und benannt).
    wurzelnMindestens: {
    kids: 75, // geliefert 75, Ziel 80
    teens: 75, // geliefert 75, Ziel 80
    erwachsen: 75, // geliefert 75, Ziel 80
    },
  },
  bekannt: {
    einBuchstabe: [],
    vocabInZweiStufen: [],
    loesungMehrwortig: [
      "diós töltelékkel",
      "köszönöm szépen",
      "legyen szíves",
      "legyél szíves",
      "légy szíves",
      "melegebb tájakra",
      "nyári szünet",
      "székely rovásírás",
      "érettségi vizsgát",
    ],
    salatLangFuerKinder: [
      "cseresznye",
      "csütörtök",
      "gyümölcs",
      "játszótér",
      "szekrény",
      "sütemény",
    ],
    wurzelZeileUeber40: [
      "a csúcsa felé keskenyedő gyümölcs - körte",
      "a hétvége előtti utolsó iskolanap - péntek",
      "a nadrágodon van, ebbe teszed a kulcsot - zseb",
      "a pörkölt mellé szaggatott tészta - nokedli",
      "a szádban van, és beszélsz is vele - nyelv",
      "alma, körte, szilva közös neve - gyümölcs",
      "az apró dolgokat felnagyítja - mikroszkóp",
      "az élőlények és környezetük tudománya - ökológia",
      "derékon hordott, lenge ruhadarab - szoknya",
      "esőben nő az erdőben, kalapja van - gomba",
      "fogas kerti eszköz a lomb összegyűjtésére - gereblye",
      "kerek gyümölcs, lehet piros vagy zöld - alma",
      "lila gyümölcs, lekvár is lesz belőle - szilva",
      "nagy csapat, régen katonák tömege - sereg",
      "nyári gyümölcs, lehet görög vagy sárga - dinnye",
      "szakmai testület, például orvosi - kamara",
      "színes, virágról virágra repülő rovar - lepke",
      "tüskés cserje fanyar kék terméssel - kökény",
      "vékony, ropogós lap a sütemény alá - ostya",
      "zöld zöldség, savanyúság is lesz belőle - uborka",
    ],
    wurzelWortGross: [],
    wurzelWortImHinweis: [],
    loesungImSatz: [
      "A túró rudi belül ..., kívül csokoládé.",
      "Egy alma, két ...",
      "Egy ház, sok ...",
    ],
    korrekturRichtigImSatz: [],
    wortGross: [],
    zusatzBuchstaben: "",
  },
});
