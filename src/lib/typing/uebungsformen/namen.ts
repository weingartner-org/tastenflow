/**
 * Die NAMEN der Übungsformen in allen Bedienungssprachen (EN4, 18.09.2026;
 * Französisch seit E11a-5, 26.09.2026).
 *
 * Der Name ist BEDIENUNG: Er ist die Beschriftung des Knopfes im Regal
 * „Wortspiele" und die Überschrift des Rätsel-Bildschirms. Die englischen
 * Namen stehen verbindlich im Glossar (`GLOSSAR-ENGLISCH.md` §3.6).
 *
 * ★ EINE Stelle: Jede Form holt ihren deutschen `name` von hier - so kann der
 * englische Name nicht fehlen (`tsc` meldet einen fehlenden Schlüssel, siehe
 * `texte`) und nicht neben dem deutschen auseinanderlaufen.
 *
 * ⚠️ Die Kennungen sind die aus `typen.ts` und stehen im Spielstand - sie
 * werden hier nur gelesen, nie umbenannt.
 */
import { texte } from "../../bedienSprache/texte";
import type { BedienSprache } from "../../bedienSprache/sprache";
import type { UebungsformId } from "./typen";

export const FORM_NAMEN = texte({
  de: {
    alphabetreihen: "Alphabet-Reihen",
    pyramide: "Pyramidenwörter",
    "wandernder-gross": "Wandernder Großbuchstabe",
    fingerdiktat: "Fingerdiktat",
    buchstabensalat: "Buchstabensalat",
    lueckentext: "Lückentext-Rätsel",
    handschwerpunkte: "Hand-Schwerpunkte",
    spiegelwoerter: "Spiegelwörter",
    zwillingsgriffe: "Zwillingsgriffe",
    zahlendiktat: "Zahlendiktat",
    wasfehlt: "Was fehlt hier?",
    langersatz: "Der lange Satz",
    korrekturlesen: "Korrekturlesen",
    iglu: "Iglu-Raten",
  } satisfies Record<UebungsformId, string>,
  en: {
    alphabetreihen: "Alphabet runs",
    pyramide: "Pyramid words",
    "wandernder-gross": "The wandering capital",
    fingerdiktat: "Finger dictation",
    buchstabensalat: "Letter jumble",
    lueckentext: "Gap-fill puzzles",
    handschwerpunkte: "Hand focus",
    spiegelwoerter: "Backwards words",
    zwillingsgriffe: "Twin moves",
    zahlendiktat: "Number dictation",
    wasfehlt: "What's missing?",
    langersatz: "The long sentence",
    korrekturlesen: "Proofreading",
    iglu: "Igloo guessing",
  },
  // ★ E11a-5 (26.09.2026): auf Französisch neu gedacht, nicht übersetzt -
  // Glossar im Bauplan französischer Lehrgang §9.2 (Buchstabensalat =
  // „Lettres mélangées", nie „mots mêlés"; Lückentext = „Texte à trous";
  // Diktat = „Dictée").
  fr: {
    alphabetreihen: "Suites de l'alphabet",
    pyramide: "Mots en pyramide",
    "wandernder-gross": "La majuscule qui voyage",
    fingerdiktat: "Dictée des doigts",
    buchstabensalat: "Lettres mélangées",
    lueckentext: "Texte à trous",
    handschwerpunkte: "Main gauche, main droite",
    spiegelwoerter: "Mots à l'envers",
    zwillingsgriffe: "Gestes jumeaux",
    zahlendiktat: "Dictée de nombres",
    wasfehlt: "Qu'est-ce qui manque ?",
    langersatz: "La longue phrase",
    korrekturlesen: "Relecture",
    iglu: "L'igloo à deviner",
  },
  // ★ ES-O (27.09.2026): die Namen der Wortspiele spanisch.
  es: {
    alphabetreihen: "Series del alfabeto",
    pyramide: "Palabras en pirámide",
    "wandernder-gross": "La mayúscula viajera",
    fingerdiktat: "Dictado de dedos",
    buchstabensalat: "Letras revueltas",
    lueckentext: "Texto con huecos",
    handschwerpunkte: "Mano izquierda, mano derecha",
    spiegelwoerter: "Palabras al revés",
    zwillingsgriffe: "Movimientos gemelos",
    zahlendiktat: "Dictado de números",
    wasfehlt: "¿Qué falta?",
    langersatz: "La frase larga",
    korrekturlesen: "Corrección",
    iglu: "El iglú de palabras",
  },
  // ★ O-IT (02.10.2026): die Namen aus dem Glossar §2.2 - neu gedacht, nicht übersetzt.
  it: {
    alphabetreihen: "Serie dell'alfabeto",
    pyramide: "Parole a piramide",
    "wandernder-gross": "La maiuscola in viaggio",
    fingerdiktat: "Dettato delle dita",
    buchstabensalat: "Lettere mescolate",
    lueckentext: "Frasi da completare",
    handschwerpunkte: "Mano sinistra, mano destra",
    spiegelwoerter: "Parole al contrario",
    zwillingsgriffe: "Movimenti gemelli",
    zahlendiktat: "Dettato di numeri",
    wasfehlt: "Che cosa manca?",
    langersatz: "La frase lunga",
    korrekturlesen: "Rilettura",
    iglu: "L'igloo delle parole",
  },
  // ★ O-PL (02.10.2026): die Namen aus dem Glossar §2.2 - neu gedacht, nicht übersetzt.
  pl: {
    alphabetreihen: "Ciągi alfabetu",
    pyramide: "Piramidy słów",
    "wandernder-gross": "Wędrująca wielka litera",
    fingerdiktat: "Dyktando palców",
    buchstabensalat: "Pomieszane litery",
    lueckentext: "Uzupełnij zdania",
    handschwerpunkte: "Lewa ręka, prawa ręka",
    spiegelwoerter: "Słowa wspak",
    zwillingsgriffe: "Bliźniacze ruchy",
    zahlendiktat: "Dyktando liczb",
    wasfehlt: "Czego tu brakuje?",
    langersatz: "Długie zdanie",
    korrekturlesen: "Korekta",
    iglu: "Słowo w igloo",
  },
  // ★ O-TR (02.10.2026): die Namen aus dem Glossar §2.2 - neu gedacht, nicht übersetzt.
  tr: {
    alphabetreihen: "Alfabe dizileri",
    pyramide: "Piramit kelimeler",
    "wandernder-gross": "Gezgin büyük harf",
    fingerdiktat: "Parmak dikte",
    buchstabensalat: "Karışık harfler",
    lueckentext: "Cümleyi tamamla",
    handschwerpunkte: "Sol el, sağ el",
    spiegelwoerter: "Ayna kelimeler",
    zwillingsgriffe: "İkiz hareketler",
    zahlendiktat: "Sayı dikte",
    wasfehlt: "Ne eksik?",
    langersatz: "Uzun cümle",
    korrekturlesen: "Okuyup düzelt",
    iglu: "İglu kelimesi",
  },
  // ★ O-CS (03.10.2026): die Namen aus dem Glossar §2.2 - neu gedacht, nicht übersetzt;
  // nur das erste Wort gross (Regel 9).
  cs: {
    alphabetreihen: "Abecední řady",
    pyramide: "Slovní pyramidy",
    "wandernder-gross": "Putující velké písmeno",
    fingerdiktat: "Diktát prstů",
    buchstabensalat: "Přeházená písmena",
    lueckentext: "Doplňovačka",
    handschwerpunkte: "Levá ruka, pravá ruka",
    spiegelwoerter: "Slova pozpátku",
    zwillingsgriffe: "Stejné pohyby",
    zahlendiktat: "Diktát čísel",
    wasfehlt: "Co tu chybí?",
    langersatz: "Dlouhá věta",
    korrekturlesen: "Korektura",
    iglu: "Slovo v iglú",
  },
  // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: {
    alphabetreihen: "Азбучни редици",
    pyramide: "Пирамиди от думи",
    "wandernder-gross": "Пътуващата главна буква",
    fingerdiktat: "Диктовка за пръстите",
    buchstabensalat: "Разбъркани букви",
    lueckentext: "Попълни пропуските",
    handschwerpunkte: "Лява ръка, дясна ръка",
    spiegelwoerter: "Думи наобратно",
    zwillingsgriffe: "Еднакви движения",
    zahlendiktat: "Диктовка на числа",
    wasfehlt: "Какво липсва?",
    langersatz: "Дългото изречение",
    korrekturlesen: "Коректура",
    iglu: "Познай думата за иглуто",
  },
  el: {
    alphabetreihen: "Γράμματα με τη σειρά",
    pyramide: "Πυραμίδες λέξεων",
    "wandernder-gross": "Το κεφαλαίο που ταξιδεύει",
    fingerdiktat: "Υπαγόρευση δαχτύλων",
    buchstabensalat: "Ανακατεμένα γράμματα",
    lueckentext: "Συμπλήρωσε την πρόταση",
    handschwerpunkte: "Αριστερό χέρι, δεξί χέρι",
    spiegelwoerter: "Λέξεις ανάποδα",
    zwillingsgriffe: "Δίδυμες κινήσεις",
    zahlendiktat: "Υπαγόρευση αριθμών",
    wasfehlt: "Τι λείπει;",
    langersatz: "Η μεγάλη πρόταση",
    korrekturlesen: "Διόρθωση κειμένου",
    iglu: "Μάντεψε τη λέξη για το ιγκλού",
  },
  hu: {
    alphabetreihen: "ABC-sorok",
    pyramide: "Szópiramis",
    "wandernder-gross": "Vándorló nagybetű",
    fingerdiktat: "Ujjtollbamondás",
    buchstabensalat: "Összekevert betűk",
    lueckentext: "Szövegkiegészítés",
    handschwerpunkte: "Bal kéz, jobb kéz",
    spiegelwoerter: "Szavak visszafelé",
    zwillingsgriffe: "Ikermozdulatok",
    zahlendiktat: "Számtollbamondás",
    wasfehlt: "Mi hiányzik?",
    langersatz: "A hosszú mondat",
    korrekturlesen: "Korrektúra",
    iglu: "Iglus találós",
  },
  nl: {
    alphabetreihen: "Alfabetreeksen",
    pyramide: "Woordpiramides",
    "wandernder-gross": "De zwervende hoofdletter",
    fingerdiktat: "Vingerdictee",
    buchstabensalat: "Husselwoorden",
    lueckentext: "Invulzinnen",
    handschwerpunkte: "Linkerhand, rechterhand",
    spiegelwoerter: "Achterstevoren",
    zwillingsgriffe: "Dezelfde bewegingen",
    zahlendiktat: "Getallendictee",
    wasfehlt: "Wat ontbreekt er?",
    langersatz: "De lange zin",
    korrekturlesen: "Nakijken",
    iglu: "Iglo raden",
  },
  pt: {
    alphabetreihen: "Sequências do alfabeto",
    pyramide: "Pirâmides de palavras",
    "wandernder-gross": "A maiúscula viajante",
    fingerdiktat: "Ditado dos dedos",
    buchstabensalat: "Letras baralhadas",
    lueckentext: "Frases para completar",
    handschwerpunkte: "Mão esquerda, mão direita",
    spiegelwoerter: "Palavras ao contrário",
    zwillingsgriffe: "Movimentos gémeos",
    zahlendiktat: "Ditado de números",
    wasfehlt: "O que falta aqui?",
    langersatz: "A frase longa",
    korrekturlesen: "Revisão",
    iglu: "Adivinha do iglu",
  },
  br: {
    alphabetreihen: "Sequências do alfabeto",
    pyramide: "Palavras em pirâmide",
    "wandernder-gross": "A maiúscula viajante",
    fingerdiktat: "Ditado dos dedos",
    buchstabensalat: "Letras embaralhadas",
    lueckentext: "Frases para completar",
    handschwerpunkte: "Mão esquerda, mão direita",
    spiegelwoerter: "Palavras ao contrário",
    zwillingsgriffe: "Movimentos gêmeos",
    zahlendiktat: "Ditado de números",
    wasfehlt: "O que está faltando?",
    langersatz: "A frase longa",
    korrekturlesen: "Revisão de texto",
    iglu: "Adivinhação do iglu",
  },
  ro: {
    alphabetreihen: "Seriile alfabetului",
    pyramide: "Piramide de cuvinte",
    "wandernder-gross": "Majuscula călătoare",
    fingerdiktat: "Dictarea degetelor",
    buchstabensalat: "Litere amestecate",
    lueckentext: "Propoziții de completat",
    handschwerpunkte: "Mâna stângă, mâna dreaptă",
    spiegelwoerter: "Cuvinte în oglindă",
    zwillingsgriffe: "Mișcări gemene",
    zahlendiktat: "Dictare de numere",
    wasfehlt: "Ce lipsește?",
    langersatz: "Propoziția lungă",
    korrekturlesen: "Corectură",
    iglu: "Ghicitoarea iglului",
  },
  sv: {
    alphabetreihen: "Alfabetet i ordning",
    pyramide: "Ordpyramider",
    "wandernder-gross": "Den vandrande stora bokstaven",
    fingerdiktat: "Fingerdiktamen",
    buchstabensalat: "Bokstavssallad",
    lueckentext: "Lucktext",
    handschwerpunkte: "Vänster hand, höger hand",
    spiegelwoerter: "Baklängesord",
    zwillingsgriffe: "Samma rörelser",
    zahlendiktat: "Sifferdiktamen",
    wasfehlt: "Vad saknas här?",
    langersatz: "Den långa meningen",
    korrekturlesen: "Korrekturläsning",
    iglu: "Gissa ordet till igloon",
  },
  uk: {
    alphabetreihen: "Абеткові ряди",
    pyramide: "Словесні піраміди",
    "wandernder-gross": "Велика літера в дорозі",
    fingerdiktat: "Диктант для пальців",
    buchstabensalat: "Переплутані літери",
    lueckentext: "Доповни речення",
    handschwerpunkte: "Ліва рука, права рука",
    spiegelwoerter: "Слова навпаки",
    zwillingsgriffe: "Однакові рухи",
    zahlendiktat: "Диктант чисел",
    wasfehlt: "Чого бракує?",
    langersatz: "Довге речення",
    korrekturlesen: "Коректура",
    iglu: "Слово в іглу",
  },
});

/** Der Name einer Form in der Bedienungssprache. */
export function formName(id: UebungsformId, sprache: BedienSprache): string {
  return FORM_NAMEN[sprache][id];
}

/**
 * ★ K2 (19.09.2026): Der Mouseover-Hinweis zum Knopf im Regal „Wortspiele" -
 * bis dahin trug keiner der 13 Knöpfe einen. Anders als der
 * ANKÜNDIGUNGSSATZ (siehe Kopf-Kommentar in `Wortspiele.tsx`, warum der NICHT
 * hier steht) verrät dieser Satz nichts, was die Runde erst beim Start
 * entscheidet - er sagt nur, WAS die Form überhaupt ist, damit man vorher
 * weiss, worauf man sich einlässt.
 */
export const FORM_HINWEISE = texte({
  de: {
    alphabetreihen:
      "Reiht die schon gelernten Tasten alphabetisch aneinander - reine Fingerbewegung, keine Wörter.",
    pyramide: "Ein Wort - oder ein Satz - wächst Zeile für Zeile um ein Zeichen.",
    "wandernder-gross":
      "Dasselbe Wort mehrmals - der große Buchstabe wandert dabei eine Stelle weiter nach rechts.",
    fingerdiktat: "Du hörst einen Finger genannt und tippst den Buchstaben, der auf ihm liegt.",
    buchstabensalat: "Aus einem langen Wort so viele kleinere Wörter wie möglich bilden.",
    lueckentext: "Ein Satz mit Lücke - getippt wird nur das fehlende Wort.",
    handschwerpunkte: "Wörter, die nur die linke oder nur die rechte Hand brauchen.",
    spiegelwoerter: "Ein Wort vorwärts, dann genau dasselbe Wort rückwärts.",
    zwillingsgriffe: "Derselbe Tastengriff immer wieder - erst allein, dann in echten Wörtern.",
    zahlendiktat: "Eine Zahl hören und in Ziffern schreiben - oder umgekehrt.",
    wasfehlt: "Zwei fast gleiche Zeilen vergleichen: Welches Wort fehlt in der zweiten?",
    langersatz: "Ein ganzer Satz über mehrere Zeilen, ohne Pause dazwischen.",
    korrekturlesen:
      "In einem Satz steckt ein falsches Wort - hörbar falsch, nicht nur vertauschte Buchstaben.",
    iglu: "Ein Wort ist versteckt: Tipp Buchstaben und decke es auf - jeder Buchstabe, der nicht im Wort steckt, legt einen Schneeblock für den Iglu.",
  } satisfies Record<UebungsformId, string>,
  en: {
    alphabetreihen:
      "Runs through the keys you already know in alphabetical order - pure finger movement, no words.",
    pyramide: "A word - or a sentence - grows by one character, line by line.",
    "wandernder-gross":
      "The same word several times - the capital letter moves one place to the right each time.",
    fingerdiktat: "You hear a finger named and type the letter that sits on it.",
    buchstabensalat: "Build as many smaller words as you can from one long word.",
    lueckentext: "A sentence with a gap - you type only the missing word.",
    handschwerpunkte: "Words that only need your left hand, or only your right.",
    spiegelwoerter: "A word forwards, then the very same word backwards.",
    zwillingsgriffe: "The same key move again and again - first alone, then inside real words.",
    zahlendiktat: "Hear a number and write it in digits - or the other way round.",
    wasfehlt: "Compare two almost identical lines: which word is missing from the second?",
    langersatz: "One whole sentence running over several lines, without a break.",
    korrekturlesen: "One word in a sentence is wrong - wrong enough to hear, not just swapped letters.",
    iglu: "A word is hidden: type letters to uncover it - every letter that is not in the word lays a snow block for the igloo.",
  },
  fr: {
    alphabetreihen:
      "Les touches que tu connais, dans l'ordre de l'alphabet - juste le mouvement des doigts, sans mots.",
    pyramide: "Un mot - ou une phrase - grandit un peu à chaque ligne.",
    "wandernder-gross":
      "Le même mot plusieurs fois - la majuscule avance d'une place vers la droite à chaque fois.",
    fingerdiktat: "Tu entends le nom d'un doigt et tu tapes la lettre qui est sous ce doigt.",
    buchstabensalat: "Avec les lettres d'un mot, forme le plus de mots possible.",
    lueckentext: "Une phrase avec un trou - tu tapes seulement le mot qui manque.",
    handschwerpunkte: "Des mots pour la main gauche seule, ou pour la main droite seule.",
    spiegelwoerter: "Un mot à l'endroit, puis le même mot à l'envers.",
    zwillingsgriffe: "Le même geste plusieurs fois - d'abord seul, puis dans de vrais mots.",
    zahlendiktat: "Tu entends un nombre et tu l'écris en chiffres - ou l'inverse.",
    wasfehlt: "Deux lignes presque pareilles : quel mot manque dans la deuxième ?",
    langersatz: "Une phrase entière sur plusieurs lignes, sans pause.",
    korrekturlesen:
      "Un mot de la phrase ne va pas - on l'entend bien, ce ne sont pas deux lettres inversées.",
    iglu: "Un mot est caché : tape des lettres pour le découvrir - chaque lettre absente du mot pose un bloc de neige pour l'igloo.",
  },
  // ★ ES-O (27.09.2026): tú.
  es: {
    alphabetreihen:
      "Las teclas que conoces, en el orden del alfabeto - solo el movimiento de los dedos, sin palabras.",
    pyramide: "Una palabra - o una frase - crece un poco en cada línea.",
    "wandernder-gross":
      "La misma palabra varias veces - la mayúscula avanza un puesto a la derecha cada vez.",
    fingerdiktat: "Oyes el nombre de un dedo y escribes la letra que está bajo ese dedo.",
    buchstabensalat: "Con las letras de una palabra, forma todas las palabras que puedas.",
    lueckentext: "Una frase con un hueco - solo escribes la palabra que falta.",
    handschwerpunkte: "Palabras solo para la mano izquierda, o solo para la mano derecha.",
    spiegelwoerter: "Una palabra al derecho y después la misma palabra al revés.",
    zwillingsgriffe: "El mismo movimiento varias veces - primero aislado, después en palabras de verdad.",
    zahlendiktat: "Oyes un número y lo escribes con cifras - o al revés.",
    wasfehlt: "Dos líneas casi iguales: ¿qué palabra falta en la segunda?",
    langersatz: "Una frase entera en varias líneas, sin pausa.",
    korrekturlesen:
      "Una palabra de la frase no encaja - se nota al oírla, no son dos letras cambiadas.",
    iglu: "Hay una palabra escondida: escribe letras para descubrirla - cada letra que no está en la palabra coloca un bloque de nieve para el iglú.",
  },
  it: {
    alphabetreihen:
      "I tasti che conosci, in ordine alfabetico - solo il movimento delle dita, senza parole.",
    pyramide: "Una parola - o una frase - cresce di un pezzo a ogni riga.",
    "wandernder-gross":
      "La stessa parola più volte - la maiuscola si sposta ogni volta di un posto a destra.",
    fingerdiktat: "Senti il nome di un dito e scrivi la lettera che sta sotto quel dito.",
    buchstabensalat: "Con le lettere di una parola lunga forma più parole possibili.",
    lueckentext: "Una frase con uno spazio vuoto - scrivi solo la parola che manca.",
    handschwerpunkte: "Parole solo per la mano sinistra, o solo per la mano destra.",
    spiegelwoerter: "Una parola dritta e poi la stessa parola al contrario.",
    zwillingsgriffe: "Lo stesso movimento più volte - prima da solo, poi in parole vere.",
    zahlendiktat: "Senti un numero e lo scrivi in cifre - o il contrario.",
    wasfehlt: "Due righe quasi uguali: quale parola manca nella seconda?",
    langersatz: "Una frase intera su più righe, senza pause.",
    korrekturlesen:
      "In una frase c'è una parola che non va - si sente, non sono solo lettere scambiate.",
    iglu: "C'è una parola nascosta: scrivi lettere per scoprirla - ogni lettera che non è nella parola mette un blocco di neve per l'igloo.",
  },
  // ★ O-PL (02.10.2026): ty, Präsens; „rząd", „ręka" wie im Glossar §2.1.
  pl: {
    alphabetreihen:
      "Klawisze, które już znasz, w kolejności alfabetu - tylko ruch palców, bez słów.",
    pyramide: "Słowo - albo zdanie - rośnie w każdym wierszu o jeden znak.",
    "wandernder-gross":
      "To samo słowo kilka razy - wielka litera za każdym razem przesuwa się o jedno miejsce w prawo.",
    fingerdiktat: "Słyszysz nazwę palca i piszesz literę, która leży pod tym palcem.",
    buchstabensalat: "Z liter jednego długiego słowa ułóż jak najwięcej krótszych słów.",
    lueckentext: "Zdanie z luką - piszesz tylko brakujące słowo.",
    handschwerpunkte: "Słowa tylko dla lewej ręki albo tylko dla prawej.",
    spiegelwoerter: "Słowo w przód, a potem to samo słowo wspak.",
    zwillingsgriffe: "Ten sam ruch palców raz za razem - najpierw osobno, potem w prawdziwych słowach.",
    zahlendiktat: "Słyszysz liczbę i zapisujesz ją cyframi - albo odwrotnie.",
    wasfehlt: "Dwa prawie takie same wiersze: którego słowa brakuje w drugim?",
    langersatz: "Całe zdanie na kilka wierszy, bez przerwy.",
    korrekturlesen:
      "W zdaniu jest jedno niepasujące słowo - słychać to, to nie tylko zamienione litery.",
    iglu: "Słowo jest ukryte: pisz litery i odkryj je - każda litera, której nie ma w słowie, kładzie blok śniegu na igloo.",
  },
  // ★ O-TR (02.10.2026): sen, Präsens ("yazarsın"); "temel sıra", "el" wie im Glossar §2.1;
  // nie "boşluk" für die Lücke (das ist die Leertaste, §4 Nr. 8).
  tr: {
    alphabetreihen:
      "Öğrendiğin tuşlar alfabe sırasıyla - yalnızca parmak hareketi, kelime yok.",
    pyramide: "Bir kelime - ya da bir cümle - her satırda bir karakter büyür.",
    "wandernder-gross":
      "Aynı kelime birkaç kez - büyük harf her seferinde bir yer sağa kayar.",
    fingerdiktat: "Bir parmağın adını duyarsın ve o parmağın üstündeki harfi yazarsın.",
    buchstabensalat: "Uzun bir kelimenin harflerinden olabildiğince çok kısa kelime yap.",
    lueckentext: "Bir kelimesi eksik bir cümle - yalnızca eksik kelimeyi yazarsın.",
    handschwerpunkte: "Yalnızca sol eli ya da yalnızca sağ eli kullanan kelimeler.",
    spiegelwoerter: "Bir kelime önce düz, sonra aynı kelime tersten.",
    zwillingsgriffe: "Aynı parmak hareketi tekrar tekrar - önce tek başına, sonra gerçek kelimelerde.",
    zahlendiktat: "Bir sayı duyarsın ve rakamla yazarsın - ya da tersi.",
    wasfehlt: "Neredeyse aynı iki satır: ikincisinde hangi kelime eksik?",
    langersatz: "Birkaç satıra yayılan bütün bir cümle, arada ara vermeden.",
    korrekturlesen:
      "Cümlede bir kelime uymuyor - bu duyulur, yalnızca yer değiştirmiş harfler değil.",
    iglu: "Bir kelime saklı: harf yazarak ortaya çıkar - kelimede olmayan her harf iglu için bir kar bloğu koyar.",
  },
  // ★ O-CS (03.10.2026): ty, Präsens und Zukunft („napíšeš"); „základní řada", „ruka" wie
  // im Glossar §2.1; „řádek" ist die Übungszeile; nie „mezera" für die Lücke (das ist das
  // Leerzeichen).
  cs: {
    alphabetreihen:
      "Klávesy, které už umíš, za sebou podle abecedy - jen pohyb prstů, žádná slova.",
    pyramide: "Slovo - nebo věta - roste řádek po řádku o jeden znak.",
    "wandernder-gross":
      "Stejné slovo několikrát - velké písmeno se pokaždé posune o jedno místo doprava.",
    fingerdiktat: "Uslyšíš název prstu a napíšeš písmeno, které na něm leží.",
    buchstabensalat: "Z jednoho dlouhého slova poskládej co nejvíc kratších slov.",
    lueckentext: "Věta, ve které chybí slovo - napíšeš jen to chybějící slovo.",
    handschwerpunkte: "Slova, která píše jen levá, nebo jen pravá ruka.",
    spiegelwoerter: "Slovo dopředu, pak úplně stejné slovo pozpátku.",
    zwillingsgriffe: "Stejný pohyb prstů pořád dokola - nejdřív samotný, pak ve skutečných slovech.",
    zahlendiktat: "Uslyšíš číslo a napíšeš ho číslicemi - nebo obráceně.",
    wasfehlt: "Dva skoro stejné řádky: které slovo chybí ve druhém?",
    langersatz: "Celá věta na několik řádků, bez přestávky mezi nimi.",
    korrekturlesen:
      "Ve větě je jedno slovo, které tam nepatří - je to slyšet, nejsou to jen prohozená písmena.",
    iglu: "Slovo je schované: piš písmena a odkryj ho - každé písmeno, které ve slově není, položí sněhový blok na iglú.",
  },
  // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: {
    alphabetreihen: "Редици през клавишите, които вече знаеш, по азбучен ред - само движение на пръстите, без думи.",
    pyramide: "Една дума - или изречение - расте с по един знак, ред по ред.",
    "wandernder-gross": "Една и съща дума няколко пъти - главната буква всеки път се мести с едно място надясно.",
    fingerdiktat: "Чуваш името на пръст и пишеш буквата, която е под него.",
    buchstabensalat: "От една дълга дума направи колкото можеш повече по-къси думи.",
    lueckentext: "Изречение с пропуск - пишеш само думата, която липсва.",
    handschwerpunkte: "Думи само за лявата ръка или само за дясната.",
    spiegelwoerter: "Една дума отпред назад, а после съвсем същата дума отзад напред.",
    zwillingsgriffe: "Едно и също движение отново и отново - първо само, после в истински думи.",
    zahlendiktat: "Чуваш число и го пишеш с цифри - или обратното.",
    wasfehlt: "Сравни два почти еднакви реда: коя дума липсва във втория?",
    langersatz: "Цяло изречение на няколко реда, без прекъсване.",
    korrekturlesen: "Една дума в изречението е грешна - толкова, че да се чуе, а не само разменени букви.",
    iglu: "Една дума е скрита: пиши букви, за да я откриеш - всяка буква, която я няма в думата, слага леден блок на иглуто.",
  },
  el: {
    alphabetreihen: "Σειρές με τα πλήκτρα που ήδη ξέρεις, με αλφαβητική σειρά - μόνο κίνηση των δαχτύλων, χωρίς λέξεις.",
    pyramide: "Μια λέξη - ή μια πρόταση - μεγαλώνει κατά έναν χαρακτήρα, γραμμή γραμμή.",
    "wandernder-gross": "Η ίδια λέξη πολλές φορές - το κεφαλαίο μετακινείται κάθε φορά μία θέση δεξιά.",
    fingerdiktat: "Ακούς το όνομα ενός δαχτύλου και γράφεις το γράμμα που βρίσκεται κάτω από αυτό.",
    buchstabensalat: "Φτιάξε από μια μεγάλη λέξη όσο περισσότερες μικρότερες λέξεις μπορείς.",
    lueckentext: "Μια πρόταση με ένα κενό - γράφεις μόνο τη λέξη που λείπει.",
    handschwerpunkte: "Λέξεις που θέλουν μόνο το αριστερό χέρι ή μόνο το δεξί.",
    spiegelwoerter: "Μια λέξη κανονικά και μετά η ίδια ακριβώς λέξη ανάποδα.",
    zwillingsgriffe: "Η ίδια κίνηση ξανά και ξανά - πρώτα μόνη της, μετά μέσα σε αληθινές λέξεις.",
    zahlendiktat: "Ακούς έναν αριθμό και τον γράφεις με ψηφία - ή αντίστροφα.",
    wasfehlt: "Σύγκρινε δύο σχεδόν ίδιες γραμμές: ποια λέξη λείπει από τη δεύτερη;",
    langersatz: "Μια ολόκληρη πρόταση σε πολλές γραμμές, χωρίς διακοπή.",
    korrekturlesen: "Μια λέξη στην πρόταση είναι λάθος - τόσο που ακούγεται, όχι απλώς αλλαγμένα γράμματα.",
    iglu: "Μια λέξη είναι κρυμμένη: γράψε γράμματα για να την ανακαλύψεις - κάθε γράμμα που δεν υπάρχει στη λέξη βάζει ένα τούβλο χιονιού στο ιγκλού.",
  },
  hu: {
    alphabetreihen: "Sorok az általad már ismert billentyűkön, ábécérendben - csak ujjmozgás, szavak nélkül.",
    pyramide: "Egy szó - vagy egy mondat - soronként egy karakterrel hosszabb lesz.",
    "wandernder-gross": "Ugyanaz a szó többször - a nagybetű minden alkalommal egy hellyel jobbra lép.",
    fingerdiktat: "Hallod egy ujj nevét, és leírod a betűt, amely rajta van.",
    buchstabensalat: "Egy hosszú szóból rakj ki minél több rövidebb szót.",
    lueckentext: "Egy mondat egy hiánnyal - csak a hiányzó szót írod be.",
    handschwerpunkte: "Szavak, amelyekhez csak a bal vagy csak a jobb kezed kell.",
    spiegelwoerter: "Egy szó előre, aztán pontosan ugyanaz a szó visszafelé.",
    zwillingsgriffe: "Ugyanaz a mozdulat újra és újra - először magában, aztán valódi szavakban.",
    zahlendiktat: "Hallasz egy számot, és számjegyekkel írod le - vagy fordítva.",
    wasfehlt: "Hasonlíts össze két majdnem egyforma sort: melyik szó hiányzik a másodikból?",
    langersatz: "Egy egész mondat több soron át, megszakítás nélkül.",
    korrekturlesen: "A mondatban egy szó hibás - annyira, hogy hallani lehessen, nem csak felcserélt betűk.",
    iglu: "Egy szó el van rejtve: írj betűket, hogy előbukkanjon - minden betű, amely nincs a szóban, egy hótéglát rak az igluhoz.",
  },
  nl: {
    alphabetreihen: "Reeksen door de toetsen die je al kent, in alfabetische volgorde - alleen vingerbeweging, geen woorden.",
    pyramide: "Een woord - of een zin - groeit regel voor regel met één teken.",
    "wandernder-gross": "Hetzelfde woord een paar keer - de hoofdletter schuift telkens één plaats naar rechts.",
    fingerdiktat: "Je hoort de naam van een vinger en typt de letter die bij die vinger hoort.",
    buchstabensalat: "Maak van één lang woord zoveel mogelijk kortere woorden.",
    lueckentext: "Een zin met een open plek - je typt alleen het woord dat ontbreekt.",
    handschwerpunkte: "Woorden waarvoor je alleen je linkerhand of alleen je rechterhand nodig hebt.",
    spiegelwoerter: "Een woord vooruit, daarna precies hetzelfde woord achterstevoren.",
    zwillingsgriffe: "Steeds dezelfde beweging - eerst los, dan in echte woorden.",
    zahlendiktat: "Je hoort een getal en schrijft het in cijfers - of andersom.",
    wasfehlt: "Vergelijk twee bijna gelijke regels: welk woord ontbreekt in de tweede?",
    langersatz: "Een hele zin over meerdere regels, zonder onderbreking.",
    korrekturlesen: "Eén woord in een zin is fout - zo fout dat je het hoort, niet alleen omgedraaide letters.",
    iglu: "Er is een woord verstopt: typ letters om het te ontdekken - elke letter die niet in het woord zit, legt een sneeuwblok voor de iglo.",
  },
  pt: {
    alphabetreihen: "Sequências pelas teclas que já conheces, por ordem alfabética - só movimento dos dedos, sem palavras.",
    pyramide: "Uma palavra - ou uma frase - cresce um caráter de cada vez, linha a linha.",
    "wandernder-gross": "A mesma palavra várias vezes - a maiúscula avança uma posição para a direita de cada vez.",
    fingerdiktat: "Ouves o nome de um dedo e escreves a letra que lhe pertence.",
    buchstabensalat: "Forma o maior número possível de palavras mais curtas a partir de uma palavra comprida.",
    lueckentext: "Uma frase com um espaço vazio - escreves só a palavra que falta.",
    handschwerpunkte: "Palavras que só precisam da mão esquerda, ou só da direita.",
    spiegelwoerter: "Uma palavra do princípio ao fim e depois exatamente a mesma palavra ao contrário.",
    zwillingsgriffe: "O mesmo movimento uma e outra vez - primeiro sozinho, depois em palavras verdadeiras.",
    zahlendiktat: "Ouves um número e escreve-lo em algarismos - ou ao contrário.",
    wasfehlt: "Compara duas linhas quase iguais: que palavra falta na segunda?",
    langersatz: "Uma frase inteira ao longo de várias linhas, sem interrupção.",
    korrekturlesen: "Uma palavra da frase está errada - tão errada que se ouve, não são só letras trocadas.",
    iglu: "Há uma palavra escondida: escreve letras para a descobrir - cada letra que não está na palavra põe um bloco de neve no iglu.",
  },
  br: {
    alphabetreihen: "Sequências pelas teclas que você já conhece, em ordem alfabética - só movimento dos dedos, sem palavras.",
    pyramide: "Uma palavra - ou uma frase - cresce um caractere de cada vez, linha por linha.",
    "wandernder-gross": "A mesma palavra várias vezes - a maiúscula anda uma posição para a direita a cada vez.",
    fingerdiktat: "Você ouve o nome de um dedo e digita a letra que fica com ele.",
    buchstabensalat: "Forme o maior número possível de palavras menores a partir de uma palavra comprida.",
    lueckentext: "Uma frase com uma lacuna - você digita só a palavra que falta.",
    handschwerpunkte: "Palavras que só usam a mão esquerda, ou só a direita.",
    spiegelwoerter: "Uma palavra do começo ao fim e depois exatamente a mesma palavra ao contrário.",
    zwillingsgriffe: "O mesmo movimento várias vezes - primeiro sozinho, depois em palavras de verdade.",
    zahlendiktat: "Você ouve um número e escreve em algarismos - ou o contrário.",
    wasfehlt: "Compare duas linhas quase iguais: que palavra está faltando na segunda?",
    langersatz: "Uma frase inteira em várias linhas, sem parar.",
    korrekturlesen: "Uma palavra da frase está errada - tanto que dá para ouvir, não são só letras trocadas.",
    iglu: "Tem uma palavra escondida: digite letras para descobrir - cada letra que não está na palavra coloca um bloco de neve no iglu.",
  },
  ro: {
    alphabetreihen: "Serii prin tastele pe care le știi deja, în ordine alfabetică - doar mișcarea degetelor, fără cuvinte.",
    pyramide: "Un cuvânt - sau o propoziție - crește cu câte un caracter, rând cu rând.",
    "wandernder-gross": "Același cuvânt de mai multe ori - majuscula se mută de fiecare dată cu un loc la dreapta.",
    fingerdiktat: "Auzi numele unui deget și scrii litera care îi aparține.",
    buchstabensalat: "Din literele unui cuvânt lung formează cât mai multe cuvinte mai scurte.",
    lueckentext: "O propoziție cu un gol - scrii doar cuvântul care lipsește.",
    handschwerpunkte: "Cuvinte pentru care îți trebuie doar mâna stângă sau doar mâna dreaptă.",
    spiegelwoerter: "Un cuvânt de la cap la coadă, apoi exact același cuvânt de la coadă la cap.",
    zwillingsgriffe: "Aceeași mișcare iar și iar - întâi singură, apoi în cuvinte adevărate.",
    zahlendiktat: "Auzi un număr și îl scrii cu cifre - sau invers.",
    wasfehlt: "Compară două rânduri aproape la fel: ce cuvânt lipsește din al doilea?",
    langersatz: "O propoziție întreagă pe mai multe rânduri, fără pauză.",
    korrekturlesen: "Un cuvânt din propoziție e greșit - atât de greșit încât se aude, nu doar litere inversate.",
    iglu: "Un cuvânt e ascuns: scrie litere ca să-l descoperi - fiecare literă care nu e în cuvânt pune un bloc de zăpadă la iglu.",
  },
  sv: {
    alphabetreihen: "Rader genom tangenterna du redan kan, i bokstavsordning - bara fingerrörelse, inga ord.",
    pyramide: "Ett ord - eller en mening - växer med ett tecken, rad för rad.",
    "wandernder-gross": "Samma ord flera gånger - den stora bokstaven flyttar ett steg åt höger varje gång.",
    fingerdiktat: "Du hör namnet på ett finger och skriver bokstaven som hör till det.",
    buchstabensalat: "Bilda så många kortare ord du kan av ett långt ord.",
    lueckentext: "En mening med en lucka - du skriver bara ordet som saknas.",
    handschwerpunkte: "Ord som bara behöver vänster hand, eller bara höger.",
    spiegelwoerter: "Ett ord framlänges, sedan exakt samma ord baklänges.",
    zwillingsgriffe: "Samma rörelse om och om igen - först för sig, sedan i riktiga ord.",
    zahlendiktat: "Du hör ett tal och skriver det med siffror - eller tvärtom.",
    wasfehlt: "Jämför två nästan likadana rader: vilket ord saknas i den andra?",
    langersatz: "En hel mening över flera rader, utan avbrott.",
    korrekturlesen: "Ett ord i en mening är fel - så fel att det hörs, inte bara bokstäver i fel ordning.",
    iglu: "Ett ord är gömt: skriv bokstäver för att ta fram det - varje bokstav som inte finns i ordet lägger ett snöblock till igloon.",
  },
  uk: {
    alphabetreihen: "Ряди клавішами, які ти вже знаєш, за абеткою - лише рух пальців, без слів.",
    pyramide: "Слово - або речення - росте на один знак, рядок за рядком.",
    "wandernder-gross": "Те саме слово кілька разів - велика літера щоразу зсувається на одне місце праворуч.",
    fingerdiktat: "Ти чуєш назву пальця і друкуєш літеру, яка йому належить.",
    buchstabensalat: "З одного довгого слова склади якомога більше коротших слів.",
    lueckentext: "Речення з пропуском - ти друкуєш лише слово, якого бракує.",
    handschwerpunkte: "Слова, для яких потрібна лише ліва рука або лише права.",
    spiegelwoerter: "Слово спочатку як є, а потім те саме слово задом наперед.",
    zwillingsgriffe: "Той самий рух знову і знову - спочатку окремо, потім у справжніх словах.",
    zahlendiktat: "Ти чуєш число і записуєш його цифрами - або навпаки.",
    wasfehlt: "Порівняй два майже однакові рядки: якого слова бракує в другому?",
    langersatz: "Ціле речення на кількох рядках, без перерви.",
    korrekturlesen: "Одне слово в реченні неправильне - настільки, що це чути, а не лише переставлені літери.",
    iglu: "Одне слово сховане: друкуй літери, щоб його відкрити - кожна літера, якої немає в слові, кладе сніжний блок для іглу.",
  },
});

/** Der Hinweis (Mouseover) zu einer Form in der Bedienungssprache. */
export function formHinweis(id: UebungsformId, sprache: BedienSprache): string {
  return FORM_HINWEISE[sprache][id];
}

/**
 * Der Name zu einer ÜBERSCHRIFT, die als deutscher Name hereingereicht wird.
 *
 * Wozu: Der Rätsel-Bildschirm bekommt seinen Titel von den Trainern
 * (`titel={lauf.form.name}`), und `name` ist der deutsche. Findet sich der
 * Titel unter den Namen, kommt die Fassung der Bedienungssprache zurück -
 * sonst der Titel, wie er ist (ein Test, ein künftiger Aufrufer).
 */
export function formNameZuTitel(titel: string, sprache: BedienSprache): string {
  if (sprache === "de") return titel;
  const id = (Object.keys(FORM_NAMEN.de) as UebungsformId[]).find(
    (k) => FORM_NAMEN.de[k] === titel,
  );
  return id ? FORM_NAMEN[sprache][id] : titel;
}
