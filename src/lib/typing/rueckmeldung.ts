/**
 * Rückmeldung nach einer Runde, die das Kind AUCH ANWENDEN KANN.
 *
 * Anlass (Johannes, 28.08.2026): „Es nützt nichts zu sagen, deine q-Taste
 * wackelt, deshalb bekommst du keine neuen Tasten - aber das Kind kommt nicht
 * zum Üben, weil q so selten vorkommt. Aber vielleicht: schreib beim nächsten
 * Durchgang etwas langsamer und achte darauf, weniger Fehler zu machen, dann
 * kommt schneller die nächste Taste dazu."
 *
 * Daraus die drei Regeln dieser Datei:
 *  1. Nie einen Tastennamen als Vorwurf. Ein Kind kann „q" nicht üben, indem es
 *     sich mehr Mühe gibt - es kommt schlicht nicht vor. Genannt wird eine
 *     HANDLUNG (ruhiger schreiben, auf die Großbuchstaben achten).
 *  2. Nie gegen das Kind ([[feedback_nie_gegen_das_kind]]): Der Satz sagt, was
 *     als Nächstes hilft, nie was es falsch macht.
 *  3. Immer mit Aussicht: wie nah die nächste Taste ist - sichtbar, nicht nur
 *     gefühlt.
 *
 * Sprache: „Du", einfache Sätze für Neunjährige, echte Umlaute, als Strich nur
 * der Bindestrich (Braillezeile) - siehe [[feedback_nur_bindestrich]].
 *
 * ⚠️ Beim Bauen aufgefallen und leicht zu übersehen: Die Geduld-Regel
 * (`Mastery.patienceSamples`) erklärt eine treffsichere Taste zu „sitzt", auch
 * wenn sie langsam ist. Eine ausreichend geübte OFFENE Baustelle ist damit
 * IMMER eine Frage der Treffsicherheit, nie des Tempos - der Tempo-Zweig unten
 * greift nur bei noch wenig geübten Tasten. Ein langsames, genaues Kind bekommt
 * folglich gar keine Ermahnung, weil es gar keine Baustelle hat. Genau so soll
 * es sein; der Wächter hält es fest.
 */
import {
  letterAccuracy,
  letterSamples,
  letterLevel,
  letterMs,
  personalBaseMs,
  nachgelassen,
  isExtraUnit,
  SHIFT_UNIT,
  type Mastery,
} from "./letters";
import type { LetterStat } from "./progress";
import type { Lang } from "./account";
import { mehrzahl } from "../bedienSprache/texte";
import { istGeruestSprache, type GeruestSprache } from "./sprachRegister";
import type { Lernweg } from "./lernweg";
import { waehle } from "./rundenAbwechslung";
import { RAT_DREI_STERNE } from "./rundenSaetze";

export interface Rueckmeldung {
  /** Ein Satz, der eine Handlung benennt - oder null, wenn gerade nichts nötig ist. */
  satz: string | null;
  /** Noch offene Baustellen. */
  offen: number;
  /** So viele sind gerade erlaubt (wächst mit der Geduld-Regel). */
  erlaubt: number;
  /** 0..1 - wie nah die nächste Taste ist (für den Balken). */
  naehe: number;
  /** Kommen in der nächsten Runde Pseudowort-Zeilen? Dann wird das erklärt. */
  pseudoHinweis: string | null;
}

/** ★ O5 (30.10.2026): die Erklärung der Pseudowort-Zeilen in den neun Sprachen, du-Form, „unsicher" am Ding, nie am Kind. */
const PSEUDO_NEUN: Readonly<Record<GeruestSprache, (n: number) => string>> = {
  bg: (n) =>
    `Сега ${n === 1 ? "идва един ред" : `идват ${n} реда`} с думи, които изобщо не съществуват. Нарочно са такива: ` +
    "в тях са точно клавишите, които още не са сигурни, много по-често, отколкото в обикновен текст.",
  el: (n) =>
    `Τώρα ${n === 1 ? "έρχεται μία γραμμή" : `έρχονται ${n} γραμμές`} με λέξεις που δεν υπάρχουν καθόλου. Είναι έτσι επίτηδες: ` +
    "έχουν ακριβώς τα πλήκτρα που είναι ακόμη αβέβαια, πολύ πιο συχνά από ένα κανονικό κείμενο.",
  hu: (n) =>
    `Most jön ${n === 1 ? "egy sor" : `${n} sor`} olyan szavakkal, amelyek nem is léteznek. Szándékosan ilyenek: ` +
    "pontosan azok a billentyűk vannak bennük, amelyek még bizonytalanok, sokkal gyakrabban, mint egy átlagos szövegben.",
  nl: (n) =>
    `Zo ${n === 1 ? "komt er één regel" : `komen er ${n} regels`} met woorden die helemaal niet bestaan. Dat is met opzet: ` +
    "daarin zitten precies de toetsen die nog onzeker zijn, veel vaker dan in een gewone tekst.",
  pt: (n) =>
    `A seguir ${n === 1 ? "vem uma linha" : `vêm ${n} linhas`} com palavras que não existem. São assim de propósito: ` +
    "têm exatamente as teclas que ainda estão inseguras, muito mais vezes do que um texto normal.",
  br: (n) =>
    `A seguir ${n === 1 ? "vem uma linha" : `vêm ${n} linhas`} com palavras que não existem. São assim de propósito: ` +
    "têm exatamente as teclas que ainda estão inseguras, com muito mais frequência do que um texto comum.",
  ro: (n) =>
    `Urmează ${mehrzahl(n, "ro", { one: () => "un rând", few: (z) => `${z} rânduri`, other: (z) => `${z} de rânduri` })} cu cuvinte care nu există deloc. Sunt așa intenționat: ` +
    "conțin exact tastele care sunt încă nesigure, mult mai des decât un text obișnuit.",
  sv: (n) =>
    `Nu kommer ${n === 1 ? "en rad" : `${n} rader`} med ord som inte alls finns. Det är med flit: ` +
    "de innehåller just de tangenter som fortfarande är osäkra, mycket oftare än en vanlig text.",
  uk: (n) =>
    `Зараз буде ${mehrzahl(n, "uk", { one: (z) => (n === 1 ? "один рядок" : `${z} рядок`), few: (z) => `${z} рядки`, many: (z) => `${z} рядків`, other: (z) => `${z} рядка` })} зі словами, яких зовсім не існує. Це навмисно: ` +
    "у них саме ті клавіші, які ще не закріпилися, набагато частіше, ніж у звичайному тексті.",
};

/**
 * Erklärung der Pseudowort-Zeilen. Sie steht bewusst VOR der Runde: Ein Kind,
 * das unerwartet Unsinnwörter vorgesetzt bekommt, hält sie sonst für einen
 * Fehler des Programms - oder für einen Test, den es nicht versteht.
 */
export function pseudoErklaerung(anzahl: number, lang: Lang = "de"): string | null {
  if (anzahl <= 0) return null;
  // ★ O5 (30.10.2026): die neun - bis dahin fielen sie auf den deutschen Satz unten (Falle 30).
  if (istGeruestSprache(lang)) return PSEUDO_NEUN[lang](anzahl);
  // ★ O-CS (03.10.2026): ty, „klávesy, které ještě nejsou jisté" (Glossar §2.2
  // „nejistá" - am Ding, nie am Kind); das Verb zieht mit der Zahl mit
  // (přijde 1 řádek · přijdou 2 řádky · přijde 5 řádků, §2.11) - darum der
  // ganze Satzanfang je Form.
  if (lang === "cs")
    return (
      mehrzahl(anzahl, "cs", {
        one: () => "Teď přijde řádek se slovy, ",
        few: (z) => `Teď přijdou ${z} řádky se slovy, `,
        many: (z) => `Teď přijde ${z} řádku se slovy, `,
        other: (z) => `Teď přijde ${z} řádků se slovy, `,
      }) +
      "která vůbec neexistují. Je to tak schválně: jsou v nich právě ty klávesy, " +
      "které ještě nejsou jisté, a to mnohem častěji než v běžném textu."
    );
  // ★ O-TR (02.10.2026): sen, "henüz oturmamış tuşlar" (Glossar §2.2); nach der
  // Zahl die Einzahl ("3 satır"), keine Endung an die Zahl (Regel 6).
  if (lang === "tr")
    return (
      `Birazdan gerçekte olmayan kelimelerden oluşan ${anzahl === 1 ? "bir satır" : `${anzahl} satır`} ` +
      "gelecek. Bunlar bilerek böyle: içlerinde henüz oturmamış tuşlar, normal bir " +
      "metinden çok daha sık geçiyor."
    );
  // ★ O-PL (02.10.2026): „ty", „niepewne klawisze" (Glossar §2.2); das Verb
  // beugt sich mit der Zahl - darum der ganze Satzanfang je Form (§2.10a).
  if (lang === "pl")
    return (
      mehrzahl(anzahl, "pl", {
        one: () => "Za chwilę pojawi się wiersz ze słowami, ",
        few: (z) => `Za chwilę pojawią się ${z} wiersze ze słowami, `,
        many: (z) => `Za chwilę pojawi się ${z} wierszy ze słowami, `,
        other: (z) => `Za chwilę pojawi się ${z} wiersza ze słowami, `,
      }) +
      "których w ogóle nie ma. Tak ma być: są w nich właśnie te klawisze, które " +
      "są jeszcze niepewne, i to dużo częściej niż w zwykłym tekście."
    );
  // ★ O-IT (02.10.2026): italienisch, tu - „tasti incerti" (Glossar §2.2).
  if (lang === "it")
    return (
      `Tra poco ${anzahl === 1 ? "arriva una riga" : `arrivano ${anzahl} righe`} con parole ` +
      "che non esistono. Sono fatte così apposta: contengono proprio i tasti ancora " +
      "incerti, molto più spesso di un testo normale."
    );
  // ★ E11a-5 (26.09.2026): französisch - bis dahin bekam „fr" hier den
  // DEUTSCHEN Satz (die Weiche prüfte nur „en", Falle 30).
  if (lang === "fr")
    return (
      `Dans un instant, ${anzahl === 1 ? "une ligne contient" : `${anzahl} lignes contiennent`} ` +
      "des mots qui n'existent pas du tout. C'est voulu : ils contiennent justement les " +
      "touches encore instables, bien plus souvent qu'un texte normal."
    );
  // ★ ES-O (27.09.2026): spanisch, tú - vorher still Deutsch (Falle 30).
  if (lang === "es")
    return (
      `Enseguida ${anzahl === 1 ? "viene una línea" : `vienen ${anzahl} líneas`} con palabras ` +
      "que no existen. Son así a propósito: llevan justo las teclas que todavía " +
      "se te escapan, mucho más a menudo que un texto normal."
    );
  if (lang === "en")
    return (
      `In a moment there ${anzahl === 1 ? "is one line" : `are ${anzahl} lines`} with words ` +
      "that do not exist at all. They are like that on purpose: they hold exactly the " +
      "keys that are still wobbly, far more often than a normal text does."
    );
  return (
    `Gleich kommen ${anzahl === 1 ? "eine Zeile" : `${anzahl} Zeilen`} mit Wörtern, ` +
    "die es gar nicht gibt. Die sind mit Absicht so: darin stecken genau die " +
    "Tasten, die noch wackeln, viel öfter als in einem normalen Text."
  );
}

/**
 * Die drei Rat-Sätze in beiden Sprachen. Der Ton ist in BEIDEN derselbe und
 * folgt derselben Regel: nie etwas gegen das Kind, immer eine HANDLUNG für die
 * nächste Runde, immer mit Aussicht ([[feedback_nie_gegen_das_kind]]).
 */
const RAT = {
  de: {
    ruhiger:
      "Dein Tempo passt schon. Schreib die nächste Runde ruhiger und achte auf " +
      "wenige Fehler - dann kommt die nächste Taste schneller.",
    ruhigerShift: " Achte besonders auf die großen Buchstaben.",
    zeitLassen:
      "Deine Treffer sitzen gut. Lass dir ruhig Zeit und such die Tasten ohne " +
      "hinzusehen - mit jeder Runde wird es schneller von allein.",
    nahDran: "Du bist nah dran. Noch ein paar Runden, dann kommt die nächste Taste.",
  },
  en: {
    ruhiger:
      "Your speed is already fine. Type the next round more calmly and watch out " +
      "for mistakes - then the next key comes sooner.",
    ruhigerShift: " Pay special attention to the capital letters.",
    zeitLassen:
      "Your hits are sitting well. Take your time and find the keys without " +
      "looking - it gets faster on its own with every round.",
    nahDran: "You are close. A few more rounds and the next key comes.",
  },
  // ★ E11a-5 (26.09.2026): französisch, „tu", neu aus der Funktion geschrieben
  // - derselbe Ton: eine Handlung für die nächste Série, immer mit Aussicht,
  // nie « faute » (Glossar §9.2: « erreur de frappe »).
  fr: {
    ruhiger:
      "Ta vitesse est déjà bonne. Tape la prochaine série plus calmement et vise " +
      "peu d'erreurs de frappe - la touche suivante arrivera plus vite.",
    ruhigerShift: " Fais surtout attention aux majuscules.",
    zeitLassen:
      "Tu vises juste. Prends ton temps et cherche les touches sans regarder - " +
      "à chaque série, ça ira plus vite tout seul.",
    nahDran: "Tu y es presque. Encore quelques séries, et la touche suivante arrive.",
  },
  // ★ ES-O (27.09.2026): spanisch, tú, derselbe Ton - eine Handlung für die
  // nächste Serie, immer mit Aussicht, nie « falta ».
  es: {
    ruhiger:
      "Tu velocidad ya está bien. Escribe la próxima serie con más calma e intenta " +
      "cometer pocos errores - así la tecla siguiente llega antes.",
    ruhigerShift: " Fíjate sobre todo en las mayúsculas.",
    zeitLassen:
      "Aciertas mucho. Tómate tu tiempo y busca las teclas sin mirar - " +
      "con cada serie irá más rápido por sí solo.",
    nahDran: "Ya casi lo tienes. Unas pocas series más y llega la tecla siguiente.",
  },
  // ★ O-IT (02.10.2026): italienisch, tu, derselbe Ton - „giro" (Glossar §2.2),
  // nie etwas gegen das Kind.
  it: {
    ruhiger:
      "La tua velocità va già bene. Scrivi il prossimo giro con più calma e cerca " +
      "di fare pochi errori - così il prossimo tasto arriva prima.",
    ruhigerShift: " Fai attenzione soprattutto alle maiuscole.",
    zeitLassen:
      "Colpisci molti tasti giusti. Prenditi il tuo tempo e cerca i tasti senza " +
      "guardare la tastiera - a ogni giro andrà più veloce da solo.",
    nahDran: "Ci sei quasi. Ancora qualche giro e arriva il prossimo tasto.",
  },
  // ★ O-PL (02.10.2026): „ty", „runda" (Glossar §2.2), derselbe Ton - eine
  // Handlung für następna runda, nie „źle"; nichts verrät das Geschlecht.
  pl: {
    ruhiger:
      "Twoje tempo jest już dobre. Następną rundę napisz spokojniej i uważaj, żeby " +
      "było mało pomyłek - wtedy następny klawisz przyjdzie szybciej.",
    ruhigerShift: " Zwróć szczególną uwagę na wielkie litery.",
    zeitLassen:
      "Dobrze trafiasz w klawisze. Nie spiesz się i szukaj klawiszy bez patrzenia - " +
      "z każdą rundą będzie szybciej.",
    nahDran: "Już blisko. Jeszcze kilka rund i przyjdzie następny klawisz.",
  },
  // ★ O-TR (02.10.2026): sen, "tur" (Glossar §2.2), derselbe Ton - eine Handlung
  // für den nächsten tur, immer mit Aussicht, nie "Yanlış"; "klavyeye bakmadan"
  // (Regel 4).
  tr: {
    ruhiger:
      "Hızın zaten iyi. Sonraki turu daha sakin yaz ve az hata yapmaya dikkat et - " +
      "böylece sıradaki tuş daha çabuk gelir.",
    ruhigerShift: " Özellikle büyük harflere dikkat et.",
    zeitLassen:
      "Tuşları iyi buluyorsun. Acele etme, tuşları klavyeye bakmadan ara - " +
      "her turda kendiliğinden hızlanacak.",
    nahDran: "Çok az kaldı. Birkaç tur daha, sonra sıradaki tuş geliyor.",
  },
  // ★ O-CS (03.10.2026): ty, „kolo" (Glossar §2.2), derselbe Ton - eine
  // Handlung für das nächste kolo, immer mit Aussicht, nie „špatně"; nur
  // Gegenwart und Zukunft, nichts verrät das Geschlecht (Regel 2); „bez dívání
  // na klávesnici" (Regel 4); „překlep" für den Fehlgriff.
  cs: {
    ruhiger:
      "Rychlost už máš dobrou. Další kolo piš klidněji a hlídej si, ať je málo " +
      "překlepů - pak přijde další klávesa dřív.",
    ruhigerShift: " Dávej pozor hlavně na velká písmena.",
    zeitLassen:
      "Klávesy trefuješ dobře. Klidně si dej na čas a hledej klávesy bez dívání " +
      "na klávesnici - s každým kolem to půjde rychleji samo.",
    nahDran: "Už to skoro máš. Ještě pár kol a přijde další klávesa.",
  },
  // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: {
    ruhiger:
      "Скоростта ти е добра. Напиши следващия кръг по-спокойно и внимавай за " +
      "грешките - тогава следващият клавиш идва по-бързо.",
    ruhigerShift: " Внимавай особено за главните букви.",
    zeitLassen:
      "Попаденията ти са точни. Не бързай и търси клавишите, без да гледаш " +
      "клавиатурата - с всеки кръг ще става по-бързо от само себе си.",
    nahDran: "Почти си там. Още няколко кръга и идва следващият клавиш.",
  },
  el: {
    ruhiger:
      "Η ταχύτητά σου είναι ήδη καλή. Γράψε τον επόμενο γύρο πιο ήρεμα και πρόσεχε να έχεις λίγα " +
      "λάθη - τότε το επόμενο πλήκτρο έρχεται πιο γρήγορα.",
    ruhigerShift: " Πρόσεχε ιδιαίτερα τα κεφαλαία γράμματα.",
    zeitLassen:
      "Βρίσκεις καλά τα πλήκτρα. Πάρε τον χρόνο σου και ψάξε τα πλήκτρα χωρίς να κοιτάς το " +
      "πληκτρολόγιο - με κάθε γύρο θα γίνεται πιο γρήγορο από μόνο του.",
    nahDran: "Είσαι κοντά. Λίγοι γύροι ακόμα και έρχεται το επόμενο πλήκτρο.",
  },
  hu: {
    ruhiger:
      "A sebességed már jó. A következő kört írd nyugodtabban, és figyelj arra, hogy kevés " +
      "legyen a hiba - akkor hamarabb jön a következő billentyű.",
    ruhigerShift: " Különösen a nagybetűkre figyelj.",
    zeitLassen:
      "A találataid jól ülnek. Nyugodtan hagyj magadnak időt, és keresd a billentyűket " +
      "a billentyűzet nézése nélkül - minden körrel magától gyorsabb lesz.",
    nahDran: "Már nagyon közel vagy. Még néhány kör, és jön a következő billentyű.",
  },
  nl: {
    ruhiger:
      "Je snelheid is al goed. Typ de volgende ronde rustiger en let op dat je weinig fouten maakt " +
      "- dan komt de volgende toets sneller.",
    ruhigerShift: " Let vooral op de hoofdletters.",
    zeitLassen:
      "Je raakt de toetsen goed. Neem gerust de tijd en zoek de toetsen zonder te kijken " +
      "- met elke ronde gaat het vanzelf sneller.",
    nahDran: "Je bent er bijna. Nog een paar rondes, dan komt de volgende toets.",
  },
  pt: {
    ruhiger:
      "A tua velocidade já é boa. Escreve a próxima ronda com mais calma e tem atenção " +
      "para haver poucos erros - assim a próxima tecla chega mais depressa.",
    ruhigerShift: " Tem especial atenção às letras maiúsculas.",
    zeitLassen:
      "Acertas bem nas teclas. Com calma, procura as teclas sem olhar para o " +
      "teclado - a cada ronda vai ficando mais rápido por si.",
    nahDran: "Estás quase lá. Mais algumas rondas e chega a próxima tecla.",
  },
  br: {
    ruhiger:
      "Sua velocidade já está boa. Digite a próxima rodada com mais calma e cuide para errar pouco " +
      "- assim a próxima tecla chega mais rápido.",
    ruhigerShift: " Preste atenção especial nas letras maiúsculas.",
    zeitLassen:
      "Os seus acertos estão firmes. Fique à vontade para ir com calma e procurar as teclas sem " +
      "olhar - a cada rodada fica mais rápido sozinho.",
    nahDran: "Falta pouco. Mais algumas rodadas e chega a próxima tecla.",
  },
  ro: {
    ruhiger:
      "Viteza ta este deja bună. Scrie runda următoare mai liniștit și ai grijă să faci puține " +
      "greșeli - atunci vine mai repede tasta următoare.",
    ruhigerShift: " Ai grijă mai ales la literele mari.",
    zeitLassen:
      "Tastele le nimerești bine. Ia-ți liniștit timp și caută tastele fără să te uiți " +
      "la tastatură - cu fiecare rundă merge mai repede de la sine.",
    nahDran: "Mai ai puțin. Încă câteva runde și vine tasta următoare.",
  },
  sv: {
    ruhiger:
      "Din hastighet är redan bra. Skriv nästa omgång lugnare och se till att få färre fel " +
      "- då kommer nästa tangent snabbare.",
    ruhigerShift: " Var extra noga med de stora bokstäverna.",
    zeitLassen:
      "Du träffar tangenterna bra. Ta det lugnt och leta efter tangenterna utan att titta " +
      "- med varje omgång går det snabbare av sig själv.",
    nahDran: "Du är nära. Några omgångar till, så kommer nästa tangent.",
  },
  uk: {
    ruhiger:
      "Швидкість уже добра. Наступний раунд друкуй спокійніше й стеж за тим, щоб помилок було мало - " +
      "тоді наступна клавіша прийде швидше.",
    ruhigerShift: " Звертай особливу увагу на великі літери.",
    zeitLassen:
      "Клавіші натискаєш точно. Не поспішай і шукай клавіші, не дивлячись на клавіатуру - " +
      "з кожним раундом це виходитиме швидше само собою.",
    nahDran: "Уже майже. Ще кілька раундів - і з'явиться наступна клавіша.",
  },
} as const;

/**
 * Welcher Rat hilft diesem Kind gerade? Entschieden wird an den offenen
 * Baustellen - und zwar daran, WORAN sie hängen: an der Treffsicherheit oder am
 * Tempo. Beides ist eine Handlung, die das Kind in der nächsten Runde ändern kann.
 */
export function rueckmeldungFuer(opts: {
  introduced: string[];
  letters: Record<string, LetterStat> | undefined;
  /** ★ E2 (24.09.2026): der Lernweg des Kindes - Pflicht, siehe `personalBaseMs`. */
  lernweg: Lernweg;
  m: Mastery;
  rundenOhneTaste: number | undefined;
  /** Wurde in dieser Runde eine Taste freigeschaltet? Dann gibt es keinen Rat. */
  freigeschaltet?: boolean;
  /** Wie viele Pseudowort-Zeilen kommen in der nächsten Runde? */
  uebungsZeilen?: number;
  /** Vorlese-/Inhaltssprache. Ohne Angabe deutsch (alle Alt-Aufrufer, alle Tests). */
  lang?: Lang;
  /**
   * ★ 25.09.2026 (Testerin): die Treffsicherheit DIESER Runde, 0..1. Die Karte zeigt
   * sie gerundet an; steht dort „100 %", gibt es keinen Satz über Fehler - Nele
   * hatte 100 % und las „achte auf wenige Fehler". Ohne Angabe wie bisher.
   */
  rundeAcc?: number;
  /**
   * ★ 29.10.2026 (Wunsch einer Lehrerin: „immer die gleiche Rückmeldung, auch
   * bei drei Sternen"): die Sterne DIESER Runde (bei „100 %" schon als 3 gezählt,
   * wie die Karte). Bei drei Sternen passt der Rat zur Karte - kein „Du bist
   * nah dran", kein „schreib ruhiger". Ohne Angabe wie bisher.
   */
  sterne?: number;
  /** Welcher der Sätze bei drei Sternen dran ist (`naechsteVariante("rat", 3)`). */
  variante?: number;
}): Rueckmeldung {
  const { introduced, letters, lernweg, m, rundenOhneTaste } = opts;
  // ★ E2a (25.09.2026): bis E11a-5 kannte `RAT` nur „de"/„en", und „fr" fiel
  // hier auf „en" zurück. ★ E11a-5: `RAT` hat eine französische Tabelle - die
  // Sprache geht unverändert durch.
  // ★ G2a (02.10.2026): it/pl/tr/cs bekommen den ENGLISCHEN Rat - nie den deutschen
  // Satz am Ende von `pseudoErklaerung` (Falle 30).
  // ★ O-CS (03.10.2026): `RAT` hat jetzt alle Sprachen - keine geht mehr auf Englisch.
  const lang = opts.lang ?? "de";
  // ★ O2-LIB (30.10.2026): `RAT` hat auch die neun Sprachen des Gerüsts - keine geht mehr auf Englisch.
  const rat = RAT[lang];
  const base = personalBaseMs(introduced, letters, lernweg, m);
  const nach = nachgelassen(m, introduced.length, rundenOhneTaste);

  const offeneUnits = introduced.filter(
    (c) => letterLevel(letters?.[c], m, lernweg, c, base) !== "sitzt",
  );
  const offen = offeneUnits.length;
  const erlaubt = nach.maxWobbly;
  // „Nähe" = wie weit der Weg von hier bis zum erlaubten Deckel geschafft ist.
  const naehe = offen <= erlaubt ? 1 : Math.max(0, Math.min(1, erlaubt / offen));
  const pseudoHinweis = pseudoErklaerung(opts.uebungsZeilen ?? 0, lang);

  if (opts.freigeschaltet) return { satz: null, offen, erlaubt, naehe, pseudoHinweis };
  if (offen === 0) return { satz: null, offen, erlaubt, naehe, pseudoHinweis };

  // ★ 29.10.2026: Drei Sterne - der Rat sagt weder „ruhiger" noch „nah dran",
  // sondern bestätigt den Takt. Wo es (noch) keine eigenen Sätze gibt (alle
  // Sprachen ausser Deutsch und Englisch), steht lieber KEIN Satz als einer,
  // der der Karte daneben widerspricht.
  if ((opts.sterne ?? 0) >= 3) {
    const drei = RAT_DREI_STERNE[lang as "de" | "en"];
    return { satz: drei ? waehle(drei, opts.variante) : null, offen, erlaubt, naehe, pseudoHinweis };
  }

  // Woran hängen die offenen Baustellen - an der Genauigkeit oder am Tempo?
  let zuUngenau = 0;
  let zuLangsam = 0;
  let shiftDabei = false;
  for (const c of offeneUnits) {
    if (c === SHIFT_UNIT) shiftDabei = true;
    // Eine Taste ohne einen einzigen Anschlag ist nicht UNGENAU, sondern
    // ungeübt (nach „Womit anfangen?" kommen viele davon auf einmal) -
    // `letterAccuracy` gibt dort 0 zurück.
    if (letterSamples(letters?.[c]) > 0 && letterAccuracy(letters?.[c]) < m.targetAcc) zuUngenau++;
    const ms = m.ignoreSpeed ? null : letterMs(letters?.[c]);
    if (ms !== null && ms > base * (isExtraUnit(c) ? 2 : 1.4)) zuLangsam++;
  }

  // Der wichtigste Fall (und Janos): schnell genug, aber zu viele Fehler. Genau
  // hier hilft „ruhiger" - und nur hier darf man es sagen, sonst treibt man ein
  // ohnehin langsames Kind noch weiter in die Langsamkeit.
  // ★ 25.09.2026: Die Vorgeschichte einer Taste reicht 60 Anschläge zurück, über
  // Runden hinweg. Eine fehlerfreie Runde (angezeigt „100 %") bekommt darum nie
  // den Fehler-Satz - er widerspräche der Zahl direkt darüber.
  const rundeFehlerfrei = opts.rundeAcc !== undefined && Math.round(opts.rundeAcc * 100) >= 100;
  if (zuUngenau > zuLangsam && !rundeFehlerfrei) {
    const zusatz = shiftDabei ? rat.ruhigerShift : "";
    return {
      satz: rat.ruhiger + zusatz,
      offen,
      erlaubt,
      naehe,
      pseudoHinweis,
    };
  }
  if (zuLangsam > 0) {
    return {
      satz: rat.zeitLassen,
      offen,
      erlaubt,
      naehe,
      pseudoHinweis,
    };
  }
  return {
    satz: rat.nahDran,
    offen,
    erlaubt,
    naehe,
    pseudoHinweis,
  };
}
