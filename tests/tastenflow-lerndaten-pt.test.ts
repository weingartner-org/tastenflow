/**
 * ★★★ D-LERNDATEN (25.10.2026): Wächter der Lerndaten des Weges „pt" (Portugiesisch (Portugal)).
 *
 * Die Regeln stehen EINMAL für alle neun Gerüst-Wege in `tests/helfer/lerndatenNeueWege.ts` (Vorbild: die cs-Wächter
 * `tastenflow-cs-woerter`, `tastenflow-wortspiele-cs`, `tastenflow-vorlage-koreny-cs`). Hier stehen nur die Sprache (Alphabet,
 * fremde Zeichen, Gegenproben der Sperrliste), die GELIEFERTEN Mengen und die benannten Abweichungen der gelieferten Daten -
 * genau diese, nicht eine mehr; jede steht als offene Menge im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`.
 * Quelle der Daten: iCloud `sprachen-2026-10-25/tf-fest-neu/pt-PT/tf-fest-pt-PT.json` + `PRUEFBERICHT.md`.
 */
import { gesperrtPt, istKernGesperrtPt, PT_SPERR_KERN_STAEMME, PT_SPERR_KERN_WOERTER, PT_SPERR_WORTBASIS, PT_SPERR_WORTBASIS_STAEMME } from "../src/lib/typing/sperrlistePt";
import { STUFE_VOCAB_PT, WORDS_PT } from "../src/lib/typing/wordsPt";
import { RAETSEL_PT } from "../src/lib/typing/uebungsformen/lueckentextPt";
import { KORREKTUR_PT } from "../src/lib/typing/uebungsformen/korrekturlesenPt";
import { SALATWOERTER_PT } from "../src/lib/typing/uebungsformen/buchstabensalatPt";
import { VERBINDUNGEN_PT } from "../src/lib/typing/uebungsformen/gelaeufigkeitPt";
import { WORTKETTEN_PT } from "../src/lib/typing/uebungsformen/wortkettenPt";
import { WURZEL_CHALLENGE_TITEL_PT, WURZEL_THEMEN_PT, WURZELN_PT, WURZELN_PT_ALPHABETISCH, wurzelZeilePt } from "../src/lib/typing/vorlagenDaten/wurzelnPt";
import { pruefeLerndaten } from "./helfer/lerndatenNeueWege";

pruefeLerndaten({
  weg: "pt",
  name: "Portugiesisch (Portugal)",
  buchstaben: "a-záàâãçéêíóôõú",
  fremd: /[üñ]/,
  fremdProbe: "pingüim", // pingüim (Trema, vor AO90)
  woerter: WORDS_PT,
  vocab: STUFE_VOCAB_PT,
  raetsel: RAETSEL_PT,
  korrektur: KORREKTUR_PT,
  salat: SALATWOERTER_PT,
  verbindungen: VERBINDUNGEN_PT,
  ketten: WORTKETTEN_PT,
  wurzelThemen: WURZEL_THEMEN_PT,
  wurzeln: WURZELN_PT,
  wurzelnAlphabetisch: WURZELN_PT_ALPHABETISCH,
  wurzelZeile: wurzelZeilePt,
  challengeTitel: WURZEL_CHALLENGE_TITEL_PT,
  gesperrt: gesperrtPt,
  istKernGesperrt: istKernGesperrtPt,
  sperrListen: [PT_SPERR_KERN_STAEMME, PT_SPERR_KERN_WOERTER, PT_SPERR_WORTBASIS_STAEMME, PT_SPERR_WORTBASIS],
  sperrProben: { kern: ["merda","foda"], basis: ["idiota","rabo"], frei: ["cuidado","curso","pilha","bicho","pena"] },
  geliefert: {
    woerter: 1168,
    vocab: { kids: 140, teens: 71, erwachsen: 67 },
    raetsel: 256,
    korrektur: 43,
    salat: 113,
    verbindungen: 52,
    ketten: 15,
    // ★ Mindestzahl der Wurzel-Paare je Stufe = GELIEFERT (cs/it verlangen 80; nicht gesenkt, sondern gemessen und benannt).
    wurzelnMindestens: {
    kids: 68, // geliefert 68, Ziel 80
    teens: 59, // geliefert 59, Ziel 80
    erwachsen: 55, // geliefert 55, Ziel 80
    },
  },
  bekannt: {
    einBuchstabe: [
      "a",
      "o",
      "e",
      "é",
      "à",
    ],
    vocabInZweiStufen: [],
    loesungMehrwortig: [
      "Caps Lock",
      "chapéu de chuva",
    ],
    salatLangFuerKinder: [
      "golfinho",
      "guitarra",
      "sardinha",
    ],
    wurzelZeileUeber40: [
      "anda nos carris com muitas carruagens - comboio",
      "animal que se alimenta de carne - carnívoro",
      "animal que se alimenta de plantas - herbívoro",
      "antiga medida de peso, hoje o sinal @ - arroba",
      "antigo governador de um castelo - alcaide",
      "as plantas usam a luz para viver - fotossíntese",
      "barco de recreio à vela ou a motor - iate",
      "bolso da roupa, em linguagem antiga - algibeira",
      "controla as mercadorias na fronteira - alfândega",
      "desporto com bola e duas balizas - futebol",
      "espada ou faca grande de lâmina curva - catana",
      "forma das células dos favos de mel - hexágono",
      "fruto cor de laranja, mole e doce - caqui",
      "fruto seco que nasce debaixo da terra - amendoim",
      "grupo de favoritos à volta do poder - camarilha",
      "ladrilho pintado de azul e branco - azulejo",
      "legume verde em forma de flor - alcachofra",
      "luta de pequenos grupos armados - guerrilha",
      "massa redonda com tomate e queijo no forno - pizza",
      "mesa de iguarias onde cada um se serve - bufete",
      "nela encostas a cabeça na cama - almofada",
      "notícia longa feita no local - reportagem",
      "o leiloeiro vende a quem der mais - leilão",
      "onda gigante depois de um sismo - tsunami",
      "ovos batidos e fritos na frigideira - omelete",
      "paragem do trabalho como protesto - greve",
      "pinturas na cara para o teatro - maquilhagem",
      "planta de flor roxa e perfumada - alfazema",
      "refeição ligeira a meio da tarde - lanche",
      "réptil gigante de antigamente - dinossauro",
      "serpente grande que aperta as presas - jiboia",
      "sonhador e idealista, como Dom Quixote - quixotesco",
      "taça pequena com asa para o chá - chávena",
      "vestido de branco para pedir votos - candidato",
    ],
    wurzelWortGross: [],
    wurzelWortImHinweis: [],
    loesungImSatz: [
      "O plural de lápis é ...",
      "À noite, antes de dormir, digo boa ...",
    ],
    korrekturRichtigImSatz: [
      "Na Serra da Estrela, as crianças fazem bonecos de neve com a nave.",
    ],
    wortGross: [],
    zusatzBuchstaben: "",
  },
});
