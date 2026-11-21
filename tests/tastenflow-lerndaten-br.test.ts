/**
 * ★★★ D-LERNDATEN (25.10.2026): Wächter der Lerndaten des Weges „br" (Portugiesisch (Brasilien)).
 *
 * Die Regeln stehen EINMAL für alle neun Gerüst-Wege in `tests/helfer/lerndatenNeueWege.ts` (Vorbild: die cs-Wächter
 * `tastenflow-cs-woerter`, `tastenflow-wortspiele-cs`, `tastenflow-vorlage-koreny-cs`). Hier stehen nur die Sprache (Alphabet,
 * fremde Zeichen, Gegenproben der Sperrliste), die GELIEFERTEN Mengen und die benannten Abweichungen der gelieferten Daten -
 * genau diese, nicht eine mehr; jede steht als offene Menge im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`.
 * Quelle der Daten: iCloud `sprachen-2026-10-25/tf-fest-neu/pt-BR/tf-fest-pt-BR.json` + `PRUEFBERICHT.md`.
 */
import { gesperrtBr, istKernGesperrtBr, BR_SPERR_KERN_STAEMME, BR_SPERR_KERN_WOERTER, BR_SPERR_WORTBASIS, BR_SPERR_WORTBASIS_STAEMME } from "../src/lib/typing/sperrlisteBr";
import { STUFE_VOCAB_BR, WORDS_BR } from "../src/lib/typing/wordsBr";
import { RAETSEL_BR } from "../src/lib/typing/uebungsformen/lueckentextBr";
import { KORREKTUR_BR } from "../src/lib/typing/uebungsformen/korrekturlesenBr";
import { SALATWOERTER_BR } from "../src/lib/typing/uebungsformen/buchstabensalatBr";
import { VERBINDUNGEN_BR } from "../src/lib/typing/uebungsformen/gelaeufigkeitBr";
import { WORTKETTEN_BR } from "../src/lib/typing/uebungsformen/wortkettenBr";
import { WURZEL_CHALLENGE_TITEL_BR, WURZEL_THEMEN_BR, WURZELN_BR, WURZELN_BR_ALPHABETISCH, wurzelZeileBr } from "../src/lib/typing/vorlagenDaten/wurzelnBr";
import { pruefeLerndaten } from "./helfer/lerndatenNeueWege";

pruefeLerndaten({
  weg: "br",
  name: "Portugiesisch (Brasilien)",
  buchstaben: "a-záàâãçéêíóôõú",
  fremd: /[üñ]/,
  fremdProbe: "lingüiça", // lingüiça (Trema, vor AO90)
  woerter: WORDS_BR,
  vocab: STUFE_VOCAB_BR,
  raetsel: RAETSEL_BR,
  korrektur: KORREKTUR_BR,
  salat: SALATWOERTER_BR,
  verbindungen: VERBINDUNGEN_BR,
  ketten: WORTKETTEN_BR,
  wurzelThemen: WURZEL_THEMEN_BR,
  wurzeln: WURZELN_BR,
  wurzelnAlphabetisch: WURZELN_BR_ALPHABETISCH,
  wurzelZeile: wurzelZeileBr,
  challengeTitel: WURZEL_CHALLENGE_TITEL_BR,
  gesperrt: gesperrtBr,
  istKernGesperrt: istKernGesperrtBr,
  sperrListen: [BR_SPERR_KERN_STAEMME, BR_SPERR_KERN_WOERTER, BR_SPERR_WORTBASIS_STAEMME, BR_SPERR_WORTBASIS],
  sperrProben: { kern: ["merda","viado"], basis: ["idiota","bicha"], frei: ["cuidado","curso","pilha","bicho"] },
  geliefert: {
    woerter: 1151,
    vocab: { kids: 128, teens: 70, erwachsen: 59 },
    raetsel: 256,
    korrektur: 41,
    salat: 120,
    verbindungen: 55,
    ketten: 15,
    // ★ Mindestzahl der Wurzel-Paare je Stufe = GELIEFERT (cs/it verlangen 80; nicht gesenkt, sondern gemessen und benannt).
    wurzelnMindestens: {
    kids: 80, // geliefert 80, Ziel 80 (erreicht)
    teens: 80, // geliefert 80, Ziel 80 (erreicht)
    erwachsen: 78, // geliefert 78, Ziel 80
    },
  },
  bekannt: {
    einBuchstabe: [
      "à",
    ],
    vocabInZweiStufen: [
      "feira",
      "floresta",
      "história",
      "mochila",
      "trabalho",
      "turma",
    ],
    loesungMehrwortig: [
      "Porto Alegre",
      "Rio Branco",
      "com deficiência visual",
      "vinte e cinco",
      "vinte e quatro",
    ],
    salatLangFuerKinder: [
      "geladeira",
    ],
    wurzelZeileUeber40: [
      "animal que se alimenta de carne - carnívoro",
      "animal que se alimenta de plantas - herbívoro",
      "bebe leite da mãe quando filhote - mamífero",
      "bicho de casca dura que cava buracos - tatu",
      "bicho de língua comprida que pega formigas - tamanduá",
      "bolinho de feijão cozido na folha - abará",
      "brinquedo de penas jogado com a mão - peteca",
      "cada sinal que escreve um número - algarismo",
      "camada de ar em volta da Terra - atmosfera",
      "cavalinhos que giram no parque - carrossel",
      "comunidade de quem fugia da escravidão - quilombo",
      "conhecimento das técnicas e máquinas - tecnologia",
      "cortejo pernambucano com reis e rainhas - maracatu",
      "creme baiano com camarão e amendoim - vatapá",
      "escrita correta das palavras - ortografia",
      "estuda rios, montanhas e países - geografia",
      "estudo do ser humano e das culturas - antropologia",
      "fala de uma pessoa só no palco - monólogo",
      "fruta com a castanha do lado de fora - caju",
      "fruta preta que nasce no tronco - jabuticaba",
      "goma de mandioca feita na frigideira - tapioca",
      "grande recipiente de caminhão para entulho - caçamba",
      "ideia que ainda precisa ser testada - hipótese",
      "instrumento de corda tocado com arco - violino",
      "instrumento de teclas de madeira - marimba",
      "instrumento de teclas pretas e brancas - piano",
      "livro com o calendário do ano - almanaque",
      "moradia dos escravizados nas fazendas - senzala",
      "muitos livros para emprestar - biblioteca",
      "onda forte do rio contra o mar - pororoca",
      "quem viaja para conhecer lugares - turista",
      "religião de matriz africana da Bahia - candomblé",
      "repartição das mercadorias que entram no país - alfândega",
      "represa para guardar água no sertão - açude",
      "réptil gigante de antigamente - dinossauro",
      "segurança particular de um chefe - capanga",
      "ser protetor das matas no folclore - caipora",
      "subida dos peixes para desovar - piracema",
      "tensão e cansaço da vida corrida - estresse",
      "veículo elétrico sobre trilhos na cidade - bonde",
      "à mesma distância de dois pontos - equidistante",
    ],
    wurzelWortGross: [],
    wurzelWortImHinweis: [],
    loesungImSatz: [
      "O Brasil é o país que mais produz ... no mundo, a bebida preta do café da manhã.",
      "Para escovar os dentes, uso a escova e a pasta de ...",
      "Quando sente perigo, o tatu-bola se fecha como uma ...",
      "À noite dizemos: boa ...",
    ],
    korrekturRichtigImSatz: [],
    wortGross: [],
    zusatzBuchstaben: "",
  },
});
