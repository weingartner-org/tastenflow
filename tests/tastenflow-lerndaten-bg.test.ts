/**
 * ★★★ D-LERNDATEN (25.10.2026): Wächter der Lerndaten des Weges „bg" (Bulgarisch).
 *
 * Die Regeln stehen EINMAL für alle neun Gerüst-Wege in `tests/helfer/lerndatenNeueWege.ts` (Vorbild: die cs-Wächter
 * `tastenflow-cs-woerter`, `tastenflow-wortspiele-cs`, `tastenflow-vorlage-koreny-cs`). Hier stehen nur die Sprache (Alphabet,
 * fremde Zeichen, Gegenproben der Sperrliste), die GELIEFERTEN Mengen und die benannten Abweichungen der gelieferten Daten -
 * genau diese, nicht eine mehr; jede steht als offene Menge im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`.
 * Quelle der Daten: iCloud `sprachen-2026-10-25/tf-fest-neu/bg/tf-fest-bg.json` + `PRUEFBERICHT.md`.
 */
import { gesperrtBg, istKernGesperrtBg, BG_SPERR_KERN_STAEMME, BG_SPERR_KERN_WOERTER, BG_SPERR_WORTBASIS, BG_SPERR_WORTBASIS_STAEMME } from "../src/lib/typing/sperrlisteBg";
import { STUFE_VOCAB_BG, WORDS_BG } from "../src/lib/typing/wordsBg";
import { RAETSEL_BG } from "../src/lib/typing/uebungsformen/lueckentextBg";
import { KORREKTUR_BG } from "../src/lib/typing/uebungsformen/korrekturlesenBg";
import { SALATWOERTER_BG } from "../src/lib/typing/uebungsformen/buchstabensalatBg";
import { VERBINDUNGEN_BG } from "../src/lib/typing/uebungsformen/gelaeufigkeitBg";
import { WORTKETTEN_BG } from "../src/lib/typing/uebungsformen/wortkettenBg";
import { WURZEL_CHALLENGE_TITEL_BG, WURZEL_THEMEN_BG, WURZELN_BG, WURZELN_BG_ALPHABETISCH, wurzelZeileBg } from "../src/lib/typing/vorlagenDaten/wurzelnBg";
import { pruefeLerndaten } from "./helfer/lerndatenNeueWege";

pruefeLerndaten({
  weg: "bg",
  name: "Bulgarisch",
  buchstaben: "абвгдежзийклмнопрстуфхцчшщъьюя",
  fremd: /[A-Za-zыэёЫЭЁєіїґЄІЇҐ]/,
  fremdProbe: "кoт", // кoт (lateinisches o)
  woerter: WORDS_BG,
  vocab: STUFE_VOCAB_BG,
  raetsel: RAETSEL_BG,
  korrektur: KORREKTUR_BG,
  salat: SALATWOERTER_BG,
  verbindungen: VERBINDUNGEN_BG,
  ketten: WORTKETTEN_BG,
  wurzelThemen: WURZEL_THEMEN_BG,
  wurzeln: WURZELN_BG,
  wurzelnAlphabetisch: WURZELN_BG_ALPHABETISCH,
  wurzelZeile: wurzelZeileBg,
  challengeTitel: WURZEL_CHALLENGE_TITEL_BG,
  gesperrt: gesperrtBg,
  istKernGesperrt: istKernGesperrtBg,
  sperrListen: [BG_SPERR_KERN_STAEMME, BG_SPERR_KERN_WOERTER, BG_SPERR_WORTBASIS_STAEMME, BG_SPERR_WORTBASIS],
  sperrProben: { kern: ["курва","лайно"], basis: ["глупак","идиот"], frei: ["курс","култура","курорт","пътека"] },
  geliefert: {
    woerter: 1152,
    vocab: { kids: 135, teens: 73, erwachsen: 60 },
    raetsel: 256,
    korrektur: 37,
    salat: 105,
    verbindungen: 46,
    ketten: 15,
    // ★ Mindestzahl der Wurzel-Paare je Stufe = GELIEFERT (cs/it verlangen 80; nicht gesenkt, sondern gemessen und benannt).
    wurzelnMindestens: {
    kids: 80, // geliefert 80, Ziel 80 (erreicht)
    teens: 80, // geliefert 80, Ziel 80 (erreicht)
    erwachsen: 80, // geliefert 80, Ziel 80 (erreicht)
    },
  },
  bekannt: {
    einBuchstabe: [],
    vocabInZweiStufen: [],
    loesungMehrwortig: [
      "двадесет и четири",
      "двайсет и четири",
      "черупката си",
    ],
    salatLangFuerKinder: [
      "ваканция",
      "историята",
      "катерица",
      "кашкавал",
      "мартеница",
      "пеперуда",
      "пролетта",
      "радостта",
      "сладолед",
      "тетрадка",
      "ученикът",
      "учителят",
    ],
    wurzelZeileUeber40: [
      "бойно изкуство с удари с ръце и крака - карате",
      "висока тропическа трева с кухо стъбло - бамбук",
      "говориш чрез него с някого далече - телефон",
      "голям горски звяр, който обича мед - мечка",
      "голям музикален инструмент с черни и бели клавиши - пиано",
      "голяма сграда, в която машини правят неща - фабрика",
      "голямо животно, което живее в африканските реки - хипопотам",
      "голямо земеделско стопанство в миналото - чифлик",
      "градски влак по релси на улицата - трамвай",
      "доказателство, че не си бил на мястото - алиби",
      "дребни семенца за поръсване на хляба - сусам",
      "дъщеря на моите родители, но не съм аз - сестра",
      "дял от математиката с букви вместо числа - алгебра",
      "животно с кратък хобот от Южна Америка - тапир",
      "зелен зеленчук с остър връх, за яхния - бамя",
      "изкуството на отношенията между държавите - дипломация",
      "кръгло тесто с доматен сос и сирене - пица",
      "кутия в бюрото, която се издърпва - чекмедже",
      "линията, където небето среща земята - хоризонт",
      "лост с тежести, вдигат я спортисти - щанга",
      "малка чанта за документи и пари - портфейл",
      "машина, която работи вместо човека - робот",
      "машина, на която пишем и играем - компютър",
      "много малък причинител на болести - вирус",
      "много силен вятър, който се върти - ураган",
      "мрежата, която свързва компютрите по света - интернет",
      "място, където купуваме плодове и зеленчуци - пазар",
      "науката за природата и околната среда - екология",
      "науката за произхода на думите - етимология",
      "науката за растенията и животните - биология",
      "науката за старите неща под земята - археология",
      "нашата планета и почвата под краката - земя",
      "обичай, предаван от поколение на поколение - традиция",
      "обяснение, което учените проверяват - теория",
      "основният закон на държавата - конституция",
      "песен без думи, която си тананикаш - мелодия",
      "печено месо на шиш или на парчета - кебап",
      "плоско кръгче при винта или в хокея - шайба",
      "подреждане на събитията във времето - хронология",
      "правилата за думите и изреченията - граматика",
      "прозорче, на което се обслужват клиенти - гише",
      "пътека за пешеходците край улицата - тротоар",
      "растенията правят храна от светлина - фотосинтеза",
      "сила, която кара нещата да работят - енергия",
      "син на моите родители, но не съм аз - брат",
      "сладко желе на кубчета с пудра захар - локум",
      "служители и учреждения, които управляват - администрация",
      "смешен човек с червен нос в цирка - клоун",
      "стара приказка за герои и чудеса - легенда",
      "страх от чуждото и непознатото - ксенофобия",
      "тропически плод с корона от листа - ананас",
      "управлението на държавата и обществото - политика",
      "учи за планините, реките и държавите - география",
      "училищен предмет за силите и светлината - физика",
      "човек, който говори много езици - полиглот",
      "човек, който се явява на избор или изпит - кандидат",
    ],
    wurzelWortGross: [],
    wurzelWortImHinweis: [
      "рало",
    ],
    loesungImSatz: [
      "Когато се запознаем с някого, казваме: \"Приятно ми е да се ...\"",
      "На Коледа си казваме: \"Весела ...\"",
      "На Нова година си пожелаваме: \"Честита Нова ...\"",
      "На рождения ден казваме: \"Честит рожден ...\"",
      "Преди път казваме: \"Лек ...\"",
      "Сутрин ставам рано, а вечер си лягам ...",
    ],
    korrekturRichtigImSatz: [],
    wortGross: [],
    zusatzBuchstaben: "",
  },
});
