/**
 * Der Wortlaut der drei Erklär-Fenster - an EINER Stelle (31.08.2026).
 *
 * ★ WARUM NICHT IN DEN BAUTEILEN: Dieselben Sätze werden an drei Orten
 * gebraucht (Fenster, Hilfe, Prüfstand). Stünden sie dreimal da, drifteten sie
 * auseinander - das ist die Fehlerklasse „zwei Stellen, die voneinander nichts
 * wissen" ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]), die dieses
 * Programm im August sechsmal getroffen hat.
 *
 * ★ TON UND ANREDE: Die App hat drei Profile (`skin.ts`) - sie bestimmen den
 * TON. Die ANREDE hängt seit 19.09.2026 an der Rolle (`anredeFuer`): Alle
 * Lernenden lesen „du", auch ab 16; „Sie" liest nur die Lehrkraft, und nur im
 * Erwachsenen-Ton ({@link isFormal}). Wo ein Fenster eine Anrede trägt, nimmt
 * die Funktion darum zuletzt die Anrede entgegen - fehlt sie, gilt „du", die
 * Regel seit diesem Tag.
 *
 * ★ SPRACHE (EN1, 19.09.2026): Die Fenster folgen der BEDIENUNGSSPRACHE,
 * nicht der Übungssprache - sie sind Bedienung, kein Übungsinhalt. Frage F8
 * („bleibt das deutsch?") ist mit Johannes' Auftrag vom 18.09. beantwortet:
 * alles übersetzen. Jede Funktion nimmt darum zuletzt `sprache` (Vorgabe
 * Deutsch - ohne Angabe genau der Wortlaut von vorher). Wie bisher ist DIESE
 * Datei die einzige Stelle.
 *
 * Englisch nach `GLOSSAR-ENGLISCH.md`: Shift, Caps Lock, weekly goal, an
 * exercise from your teacher (§3.8). Ein Ausrufezeichen höchstens für Kinder
 * (§1.2) - darum hängt der englische Ton an `skin`, nicht nur am Du/Sie.
 */
import type { BedienSprache } from "../bedienSprache";
import { isFormal, type Anrede, type Skin } from "./skin";
import { grossFuer } from "./sprachRegister";

export interface Fenstertext {
  titel: string;
  absaetze: string[];
}

/**
 * Die falsche Umschalttaste.
 *
 * `seite` ist die Seite, die RICHTIG gewesen wäre - die der Gegenhand. Der
 * Fingername steht dabei, weil „linke Umschalttaste" allein noch nicht sagt,
 * womit man sie drückt; genau das ist der Punkt der Gegenhand-Regel.
 */
export function umschaltFenster(
  zeichen: string,
  seite: "links" | "rechts",
  skin: Skin,
  sprache: BedienSprache = "de",
): Fenstertext {
  return UMSCHALT_FENSTER[sprache](zeichen, seite, skin);
}

/**
 * ★ E11a-5 (26.09.2026): EINE Tabelle je Sprache statt `sprache === "en"` und
 * sonst Deutsch - „fr" bekam dieses Fenster bis dahin still deutsch
 * (Leitfaden Falle 30). Dasselbe Muster bei allen Fenstern dieser Datei.
 */
const UMSCHALT_FENSTER: Record<
  BedienSprache,
  (zeichen: string, seite: "links" | "rechts", skin: Skin) => Fenstertext
> = {
  de: umschaltFensterDe,
  en: umschaltFensterEn,
  fr: umschaltFensterFr,
  es: umschaltFensterEs,
  it: umschaltFensterIt,
  pl: umschaltFensterPl,
  tr: umschaltFensterTr,
  cs: umschaltFensterCs,
  // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: umschaltFensterBg,
  el: umschaltFensterEl,
  hu: umschaltFensterHu,
  nl: umschaltFensterNl,
  pt: umschaltFensterPt,
  br: umschaltFensterBr,
  ro: umschaltFensterRo,
  sv: umschaltFensterSv,
  uk: umschaltFensterUk,
};

/**
 * Französisch (E11a-5): Tastennamen wie auf der Kappe - « Maj », « Verr. Maj »
 * (Glossar §9.2); die Erwachsenen-Fassung ohne Anrede („se tape"), wie im
 * Deutschen.
 */
function umschaltFensterFr(zeichen: string, seite: "links" | "rechts", skin: Skin): Fenstertext {
  const hand = seite === "links" ? "gauche" : "droite";
  const taste = hand.toUpperCase();
  return {
    titel: "Presque !",
    absaetze: skin === "erwachsen"
      ? [
          `${zeichen} se tape avec la touche Maj ${taste} - avec l'auriculaire de la main ${hand}.`,
          "L'autre touche Maj et Verr. Maj donnent le même caractère, mais elles ne comptent pas ici : on exerce la main opposée.",
          "La règle vaut pour tous les caractères tapés avec Maj. Si le caractère est sur la moitié droite du clavier, la main gauche tient Maj - et inversement.",
        ]
      : [
          `Tu tapes ${zeichen} avec la touche Maj ${taste} - avec l'auriculaire de ta main ${hand}.`,
          "L'autre touche Maj et Verr. Maj donnent la même lettre, mais elles ne comptent pas ici.",
          "Pourquoi : une main tape la lettre, l'autre tient Maj. Comme ça, tes doigts restent à leur place.",
        ],
  };
}

/**
 * ★ ES-O (27.09.2026): Spanisch - Tastennamen wie auf der Kappe (« Mayús »,
 * « Bloq Mayús », Bauplan S13); Erwachsene ohne Anrede („se escribe").
 */
function umschaltFensterEs(zeichen: string, seite: "links" | "rechts", skin: Skin): Fenstertext {
  const hand = seite === "links" ? "izquierda" : "derecha";
  const taste = hand.toUpperCase();
  return {
    titel: "¡Casi!",
    absaetze: skin === "erwachsen"
      ? [
          `${zeichen} se escribe con la tecla Mayús ${taste} - con el meñique de la mano ${hand}.`,
          "La otra tecla Mayús y Bloq Mayús dan el mismo carácter, pero aquí no cuentan: se practica la mano contraria.",
          "La regla vale para todos los caracteres que se escriben con Mayús. Si el carácter está en la mitad derecha del teclado, la mano izquierda sujeta Mayús - y al revés.",
        ]
      : [
          `${zeichen} se escribe con la tecla Mayús ${taste} - con el meñique de tu mano ${hand}.`,
          "La otra tecla Mayús y Bloq Mayús dan la misma letra, pero aquí no cuentan.",
          "Por qué: una mano escribe la letra, la otra sujeta Mayús. Así tus dedos se quedan en su sitio.",
        ],
  };
}

/**
 * ★ O-IT (02.10.2026): Italienisch - „Maiusc", „Bloc Maiusc" wie auf der Kappe
 * (Glossar §2.9); Erwachsene ohne Anrede („si usa"), Kinder „tu".
 */
function umschaltFensterIt(zeichen: string, seite: "links" | "rechts", skin: Skin): Fenstertext {
  const hand = seite === "links" ? "sinistra" : "destra";
  const taste = seite === "links" ? "SINISTRO" : "DESTRO";
  return {
    titel: "Quasi!",
    absaetze: skin === "erwachsen"
      ? [
          `${zeichen} si scrive con il tasto Maiusc ${taste} - con il mignolo della mano ${hand}.`,
          "L'altro tasto Maiusc e Bloc Maiusc danno lo stesso carattere, ma qui non contano: si esercita la mano opposta.",
          "La regola vale per tutti i caratteri scritti con Maiusc. Se il carattere è nella metà destra della tastiera, la mano sinistra tiene premuto Maiusc - e viceversa.",
        ]
      : [
          `Tu scrivi ${zeichen} con il tasto Maiusc ${taste} - con il mignolo della tua mano ${hand}.`,
          "L'altro tasto Maiusc e Bloc Maiusc fanno la stessa lettera, ma qui non contano.",
          "Perché: una mano scrive la lettera, l'altra tiene premuto Maiusc. Così le tue dita restano al loro posto.",
        ],
  };
}

/**
 * ★ O-PL (02.10.2026): Polnisch - Kappe „Shift", „Caps Lock" (Glossar §2.9),
 * Gegenhand „druga ręka"; Erwachsene unpersönlich („używa się"), Kinder „ty".
 */
function umschaltFensterPl(zeichen: string, seite: "links" | "rechts", skin: Skin): Fenstertext {
  const hand = seite === "links" ? "lewej" : "prawej";
  return {
    titel: "Prawie!",
    absaetze: skin === "erwachsen"
      ? [
          `Znak ${zeichen} pisze się ${seite === "links" ? "LEWYM" : "PRAWYM"} klawiszem Shift - małym palcem ${hand} ręki.`,
          "Ten drugi klawisz Shift i Caps Lock dają ten sam znak, ale tutaj się nie liczą: ćwiczy się drugą rękę.",
          "Zasada dotyczy wszystkich znaków pisanych z klawiszem Shift. Jeśli znak jest na prawej połowie klawiatury, lewa ręka trzyma Shift - i odwrotnie.",
        ]
      : [
          `Znak ${zeichen} piszesz ${seite === "links" ? "LEWYM" : "PRAWYM"} klawiszem Shift - małym palcem twojej ${hand} ręki.`,
          "Ten drugi klawisz Shift i Caps Lock dają tę samą literę, ale tutaj się nie liczą.",
          "Dlaczego: jedna ręka pisze literę, druga trzyma Shift. Wtedy twoje palce zostają na swoich miejscach.",
        ],
  };
}

/**
 * ★ O-TR (02.10.2026): Türkisch - Kappe "Shift", "Caps Lock" (Glossar §2.9),
 * Gegenhand "diğer el"; die andere Umschalttaste "öbür Shift tuşu" (damit
 * "diğer" nur die Hand meint). Sen für Kinder und Erwachsene (Glossar Regel 1).
 * Keine Endung an `zeichen`: "${zeichen} karakteri" (Endung an "karakter").
 * Grossschreibung über `grossFuer(..., "tr")`, nie `toUpperCase()` (i/İ).
 */
function umschaltFensterTr(zeichen: string, seite: "links" | "rechts", skin: Skin): Fenstertext {
  const hand = seite === "links" ? "sol" : "sağ";
  const taste = grossFuer(hand, "tr");
  return {
    titel: "Neredeyse!",
    absaetze: skin === "erwachsen"
      ? [
          `${zeichen} karakteri ${taste} Shift tuşuyla yazılır - ${hand} elin serçe parmağıyla.`,
          "Öbür Shift tuşu ve Caps Lock da aynı karakteri verir, ama burada sayılmaz: karşı el çalışılır.",
          "Bu kural, Shift tuşuyla yazılan tüm karakterler için geçerlidir. Karakter klavyenin sağ yarısındaysa Shift tuşunu sol el tutar - tersi de geçerli.",
        ]
      : [
          `${zeichen} karakterini ${taste} Shift tuşuyla yazarsın - ${hand} elinin serçe parmağıyla.`,
          "Öbür Shift tuşu ve Caps Lock da aynı harfi yazar, ama burada sayılmaz.",
          "Neden mi? Bir el harfi yazar, diğer el Shift tuşunu tutar. Böylece parmakların yerinde kalır.",
        ],
  };
}

/**
 * ★ O-CS (03.10.2026): Tschechisch - Kappe „Shift", „Caps Lock" (Glossar §2.9),
 * Gegenhand „druhá ruka"; die Umschalttaste derselben Seite heisst „Shift na
 * stejné straně" (damit „druhá" nur die Hand meint). Erwachsene mit „se"
 * (wie de ohne Anrede), Kinder ty - ohne Vergangenheit. „LEVÝ Shift" über
 * `grossFuer(..., "cs")`.
 */
function umschaltFensterCs(zeichen: string, seite: "links" | "rechts", skin: Skin): Fenstertext {
  const hand = seite === "links" ? "levé" : "pravé";
  const taste = grossFuer(seite === "links" ? "levým" : "pravým", "cs");
  return {
    titel: "Skoro!",
    absaetze: skin === "erwachsen"
      ? [
          `Znak ${zeichen} se píše ${taste} Shiftem - malíčkem ${hand} ruky.`,
          "Shift na stejné straně i Caps Lock dají stejný znak, ale tady se nepočítají: cvičí se druhá ruka.",
          "Pravidlo platí pro všechny znaky, které se píšou s klávesou Shift. Když je znak na pravé polovině klávesnice, drží Shift levá ruka - a naopak.",
        ]
      : [
          `Znak ${zeichen} píšeš ${taste} Shiftem - malíčkem tvé ${hand} ruky.`,
          "Shift na stejné straně i Caps Lock dají stejné písmeno, ale tady se nepočítají.",
          "Proč? Jedna ruka píše písmeno, druhá drží Shift. Tak ti prsty zůstanou na svých místech.",
        ],
  };
}

/**
 * ★ O2-LIB (29.10.2026): Bulgarisch - Kappe „Shift", „Caps Lock" (Glossar Regel 11), Gegenhand
 * „другата ръка"; die Umschalttaste derselben Seite heisst „другият клавиш Shift". Erwachsene
 * unpersönlich („се пише"), Kinder ти - ohne Vergangenheit.
 */
function umschaltFensterBg(zeichen: string, seite: "links" | "rechts", skin: Skin): Fenstertext {
  const hand = seite === "links" ? "лявата" : "дясната";
  const taste = (seite === "links" ? "левия" : "десния").toLocaleUpperCase("bg");
  return {
    titel: "Почти!",
    absaetze: skin === "erwachsen"
      ? [
          `Знакът ${zeichen} се пише с ${taste} клавиш Shift - с кутрето на ${hand} ръка.`,
          "Другият клавиш Shift и Caps Lock дават същия знак, но тук не се броят: упражнява се другата ръка.",
          "Правилото важи за всички знаци, които се пишат с Shift. Когато знакът е в дясната половина на клавиатурата, Shift се държи с лявата ръка - и обратно.",
        ]
      : [
          `Знакът ${zeichen} пишеш с ${taste} клавиш Shift - с кутрето на ${hand} си ръка.`,
          "Другият клавиш Shift и Caps Lock дават същата буква, но тук не се броят.",
          "Защо? Едната ръка пише буквата, другата държи Shift. Така пръстите ти остават на местата си.",
        ],
  };
}

/**
 * ★ O-EL-LIB (30.10.2026): Griechisch - Kappe „Shift" und „Caps Lock" (Glossar §2.9, ungebeugt), Gegenhand „το άλλο
 * χέρι". Erwachsene und Kinder εσύ (Selbstlernende), Sätze ohne Vergangenheit der 2. Person (Regel 2). Kein Großschreiben
 * per Programm (Tonos, Glossar Regel 7): „αριστερό"/„δεξί" bleiben klein.
 */
function umschaltFensterEl(zeichen: string, seite: "links" | "rechts", skin: Skin): Fenstertext {
  const hand = seite === "links" ? "αριστερού" : "δεξιού";
  const taste = seite === "links" ? "αριστερό" : "δεξί";
  return {
    titel: "Σχεδόν!",
    absaetze: skin === "erwachsen"
      ? [
          `Το ${zeichen} γράφεται με το ${taste} πλήκτρο Shift - με το μικρό δάχτυλο του ${hand} χεριού.`,
          "Το άλλο πλήκτρο Shift και το Caps Lock δίνουν τον ίδιο χαρακτήρα, αλλά εδώ δεν μετρούν: εξασκείται το άλλο χέρι.",
          "Ο κανόνας ισχύει για όλους τους χαρακτήρες που γράφονται με Shift. Αν ο χαρακτήρας βρίσκεται στο δεξί μισό του πληκτρολογίου, το Shift το κρατά το αριστερό χέρι - και αντίστροφα.",
        ]
      : [
          `Το ${zeichen} το γράφεις με το ${taste} πλήκτρο Shift - με το μικρό δάχτυλο του ${hand} χεριού.`,
          "Το άλλο πλήκτρο Shift και το Caps Lock δίνουν το ίδιο γράμμα, αλλά εδώ δεν μετρούν.",
          "Ο λόγος: το ένα χέρι γράφει το γράμμα και το άλλο κρατά το Shift. Έτσι τα δάχτυλά σου μένουν στις θέσεις τους.",
        ],
  };
}

/**
 * ★ O2-LIB (29.10.2026): Ungarisch - Kappe „Shift", „Caps Lock" (Glossar §2.9), Tastennamen
 * immer mit „billentyű" und ohne Endung am Zeichen (Regel 11/12: Zeichen nach Doppelpunkt).
 * Erwachsene ohne Anrede (Infinitiv), Kinder te. „BAL/JOBB" gross wie im Deutschen.
 */
function umschaltFensterHu(zeichen: string, seite: "links" | "rechts", skin: Skin): Fenstertext {
  const hand = seite === "links" ? "bal" : "jobb";
  const taste = hand.toUpperCase();
  return {
    titel: "Majdnem!",
    absaetze: skin === "erwachsen"
      ? [
          `Ezt a jelet a ${taste} Shift billentyűvel kell írni: ${zeichen} - a ${hand} kéz kisujjával.`,
          "A másik Shift billentyű és a Caps Lock ugyanazt a jelet adja, de itt nem számít: a másik kezet kell gyakorolni.",
          "A szabály minden olyan jelre érvényes, amelyet Shift billentyűvel kell írni. Ha a jel a billentyűzet jobb felén van, a bal kéz tartja a Shift billentyűt - és fordítva.",
        ]
      : [
          `Ezt a jelet a ${taste} Shift billentyűvel írod: ${zeichen} - a ${hand} kezed kisujjával.`,
          "A másik Shift billentyű és a Caps Lock ugyanazt a betűt adja, de itt nem számít.",
          "Az ok: az egyik kéz írja a betűt, a másik lenyomva tartja a Shift billentyűt. Így az ujjaid a helyükön maradnak.",
        ],
  };
}

/**
 * ★ O2-LIB (29.10.2026): das Umschalt-Fenster niederländisch - "Shift-toets" (Glossar nl §1 Regel 12),
 * "de andere hand"; je/jouw, Erwachsene ohne Anrede-Wechsel. "LINKER" über `grossFuer(..., "nl")`.
 */
function umschaltFensterNl(zeichen: string, seite: "links" | "rechts", skin: Skin): Fenstertext {
  const hand = seite === "links" ? "linker" : "rechter";
  const taste = grossFuer(hand, "nl");
  return {
    titel: "Bijna!",
    absaetze: skin === "erwachsen"
      ? [
          `${zeichen} typ je met de ${taste} Shift-toets - met de pink van de ${hand}hand.`,
          "De andere Shift-toets en Caps Lock geven hetzelfde teken, maar tellen hier niet mee: je oefent met de andere hand.",
          "Deze regel geldt voor alle tekens die je met Shift typt. Staat het teken op de rechterhelft van het toetsenbord, dan houdt de linkerhand Shift vast - en andersom.",
        ]
      : [
          `${zeichen} typ je met de ${taste} Shift-toets - met de pink van je ${hand}hand.`,
          "De andere Shift-toets en Caps Lock geven wel dezelfde letter, maar tellen hier niet mee.",
          "Waarom? De ene hand typt de letter, de andere houdt Shift vast. Zo blijven je vingers op hun plek.",
        ],
  };
}

/**
 * ★ O-LIB (30.10.2026): die Umschalt-Meldung portugiesisch (Portugal) - Kappe „Shift", „Caps Lock"
 * (Glossar §2.9), „a outra mão" für die Gegenhand; Erwachsene ohne Anrede, Kinder tu.
 */
function umschaltFensterPt(zeichen: string, seite: "links" | "rechts", skin: Skin): Fenstertext {
  const lado = seite === "links" ? "esquerda" : "direita";
  const taste = lado.toUpperCase();
  return {
    titel: "Quase!",
    absaetze: skin === "erwachsen"
      ? [
          `${zeichen} escreve-se com a tecla Shift ${taste} - com o mindinho da mão ${lado}.`,
          "A outra tecla Shift e a tecla Caps Lock dão o mesmo caráter, mas aqui não contam: pratica-se a outra mão.",
          "A regra vale para todos os carateres escritos com Shift. Se o caráter está na metade direita do teclado, é a mão esquerda que prime Shift - e vice-versa.",
        ]
      : [
          `Escreves ${zeichen} com a tecla Shift ${taste} - com o mindinho da tua mão ${lado}.`,
          "A outra tecla Shift e a tecla Caps Lock dão a mesma letra, mas aqui não contam.",
          "O motivo: uma mão escreve a letra e a outra prime Shift. Assim os teus dedos ficam nos seus lugares.",
        ],
  };
}

/**
 * ★ O2-LIB (29.10.2026): das Umschalt-Fenster, Portugiesisch (Brasilien) - você;
 * "Para digitar ..." statt Partizip (kein Geschlecht), "Shift" wie auf der Kappe.
 */
function umschaltFensterBr(zeichen: string, seite: "links" | "rechts", skin: Skin): Fenstertext {
  const hand = seite === "links" ? "esquerda" : "direita";
  const lado = hand.toUpperCase();
  return {
    titel: "Quase!",
    absaetze: skin === "erwachsen"
      ? [
          `Para digitar ${zeichen}, use a tecla Shift da ${lado} - com o dedo mínimo da mão ${hand}.`,
          "O outro Shift e o Caps Lock geram o mesmo caractere, mas aqui não contam: o objetivo é treinar a outra mão.",
          "A regra vale para todos os caracteres digitados com Shift. Se o caractere fica na metade direita do teclado, a mão esquerda segura o Shift - e vice-versa.",
        ]
      : [
          `Para digitar ${zeichen}, use a tecla Shift da ${lado} - com o dedo mínimo da sua mão ${hand}.`,
          "O outro Shift e o Caps Lock fazem a mesma letra, mas aqui não contam.",
          "O motivo: uma mão digita a letra e a outra segura o Shift. Assim os seus dedos ficam nos lugares deles.",
        ],
  };
}

/**
 * ★ O2-LIB (29.10.2026): Rumänisch - tasta „Shift“ / „Caps Lock“, Gegenhand „cealaltă mână“;
 * Erwachsene ohne Anrede-Pronomen, Kinder tu - ohne Vergangenheit. „STÂNGĂ“ über `grossFuer(..., "ro")`.
 */
function umschaltFensterRo(zeichen: string, seite: "links" | "rechts", skin: Skin): Fenstertext {
  const hand = seite === "links" ? "stângi" : "drepte";
  const taste = grossFuer(seite === "links" ? "stângă" : "dreaptă", "ro");
  return {
    titel: "Aproape!",
    absaetze: skin === "erwachsen"
      ? [
          `${zeichen} se scrie cu tasta Shift ${taste} - cu degetul mic al mâinii ${hand}.`,
          "Cealaltă tastă Shift și Caps Lock dau același caracter, dar aici nu contează: se exersează cealaltă mână.",
          "Regula este valabilă pentru toate caracterele scrise cu Shift. Dacă un caracter se află pe jumătatea dreaptă a tastaturii, Shift este ținut cu mâna stângă - și invers.",
        ]
      : [
          `${zeichen} scrii cu tasta Shift ${taste} - cu degetul mic al mâinii tale ${hand}.`,
          "Cealaltă tastă Shift și Caps Lock fac aceeași literă, dar aici nu contează.",
          "De ce? O mână scrie litera, cealaltă ține Shift. Așa degetele tale rămân pe locurile lor.",
        ],
  };
}

/**
 * ★ O2-LIB (30.10.2026): das Umschalt-Fenster schwedisch - Kappe "Skift" (Glossar sv §2.9), "Caps Lock",
 * "andra handen"; du für alle, Erwachsene ohne Anrede-Wechsel. "VÄNSTER" über `grossFuer(..., "sv")`.
 */
function umschaltFensterSv(zeichen: string, seite: "links" | "rechts", skin: Skin): Fenstertext {
  const hand = seite === "links" ? "vänstra" : "högra";
  const taste = grossFuer(seite === "links" ? "vänster" : "höger", "sv");
  return {
    titel: "Nästan!",
    absaetze: skin === "erwachsen"
      ? [
          `${zeichen} skrivs med ${taste} Skift - med lillfingret på ${hand} handen.`,
          "Skift på samma sida som tecknet och Caps Lock ger visserligen samma tecken, men räknas inte här: det är andra handen som övas.",
          "Regeln gäller alla tecken som skrivs med Skift. Ligger tecknet på högra halvan av tangentbordet håller vänster hand ned Skift - och tvärtom.",
        ]
      : [
          `${zeichen} skriver du med ${taste} Skift - med lillfingret på din ${hand} hand.`,
          "Skift på samma sida som bokstaven och Caps Lock ger visserligen samma bokstav, men räknas inte här.",
          "Varför? Den ena handen skriver bokstaven, den andra håller ned Skift. Då stannar fingrarna på sina platser.",
        ],
  };
}

/**
 * ★ O2-LIB (30.10.2026): die Umschalttaste ukrainisch - Kappe „Shift", „Caps Lock" (Glossar §2.9), Tastenname mit
 * Kopfwort „клавіша" (Regel 11); Erwachsene ohne Anrede (wie de), Kinder ти - ohne Vergangenheit (Regel 2).
 */
function umschaltFensterUk(zeichen: string, seite: "links" | "rechts", skin: Skin): Fenstertext {
  const hand = seite === "links" ? "лівої" : "правої";
  const taste = grossFuer(seite === "links" ? "лівою" : "правою", "uk");
  return {
    titel: "Майже!",
    absaetze: skin === "erwachsen"
      ? [
          `Знак ${zeichen} друкується ${taste} клавішею Shift - мізинцем ${hand} руки.`,
          "Інша клавіша Shift і Caps Lock дають той самий знак, але тут не зараховуються: тренується друга рука.",
          "Правило стосується всіх знаків, що друкуються з клавішею Shift. Якщо знак на правій половині клавіатури, Shift тримає ліва рука - і навпаки.",
        ]
      : [
          `Знак ${zeichen} друкуєш ${taste} клавішею Shift - мізинцем ${hand} руки.`,
          "Інша клавіша Shift і Caps Lock дають ту саму літеру, але тут не зараховуються.",
          "Чому? Одна рука друкує літеру, друга тримає Shift. Так пальці залишаються на своїх місцях.",
        ],
  };
}

function umschaltFensterEn(zeichen: string, seite: "links" | "rechts", skin: Skin): Fenstertext {
    const hand = seite === "links" ? "left" : "right";
    const taste = hand.toUpperCase();
    return {
      titel: "Almost!",
      absaetze: skin === "erwachsen"
        ? [
            `${zeichen} is typed with the ${taste} Shift key - using the little finger of the ${hand} hand.`,
            "The other Shift key and Caps Lock produce the same character, but they don't count here: the point is to practise the opposite hand.",
            "This applies to every character you type with Shift. If it is on the right half of the keyboard, the left hand holds Shift - and the other way round.",
          ]
        : [
            `You type ${zeichen} with the ${taste} Shift key - using the little finger of your ${hand} hand.`,
            "The other Shift key and Caps Lock make the same letter, but they don't count here.",
            "Here's why: one hand types the letter, the other holds Shift. That way your fingers stay in their places.",
          ],
    };
}

function umschaltFensterDe(zeichen: string, seite: "links" | "rechts", skin: Skin): Fenstertext {
  const hand = seite === "links" ? "linken" : "rechten";
  const taste = seite === "links" ? "linke" : "rechte";
  // Die Erwachsenen-Fassung sagt „schreibt man" - sie kommt ohne Anrede aus
  // und gilt darum für Du und Sie gleich; sie hängt nur am Ton.
  return {
    titel: "Fast!",
    absaetze: skin === "erwachsen"
      ? [
          `${zeichen} schreibt man mit der ${taste.toUpperCase()} Umschalttaste - mit dem kleinen Finger der ${hand} Hand.`,
          "Die andere Umschalttaste und die Feststelltaste ergeben zwar dasselbe Zeichen, zählen hier aber nicht: Geübt wird die Gegenhand.",
          "Die Regel gilt für alle Grosszeichen. Steht das Zeichen auf der rechten Tastenhälfte, hält die linke Hand um - und umgekehrt.",
        ]
      : [
          `${zeichen} schreibst du mit der ${taste.toUpperCase()} Umschalttaste - mit dem kleinen Finger der ${hand} Hand.`,
          "Die andere Umschalttaste und die Feststelltaste machen zwar denselben Buchstaben, zählen hier aber nicht.",
          "Der Grund: Eine Hand tippt den Buchstaben, die andere hält um. So bleiben deine Finger auf ihren Plätzen.",
        ],
  };
}

/**
 * Die Grossschreibung, solange die Umschalttaste noch nicht freigeschaltet ist
 * (Auto-Grossschreibung, `useTypingItem.ts`). Kommt genau einmal.
 */
export function grossschreibungFenster(
  skin: Skin,
  sprache: BedienSprache = "de",
  anrede: Anrede = "du",
): Fenstertext {
  const fremd = GROSSSCHREIBUNG_FREMD[sprache];
  if (fremd) return fremd(skin, anrede);
  return {
    titel: "Gross geschrieben - ohne Umschalttaste",
    absaetze: isFormal(skin, anrede)
      ? [
          "Die Umschalttaste brauchen Sie noch nicht.",
          "Hauptwörter und Satzanfänge erscheinen trotzdem gross - tippen Sie einfach den kleinen Buchstaben, er zählt als richtig.",
          "Die Umschalttaste kommt später als eigene Taste dazu. Bis dahin bleibt die Schreibung im Text trotzdem korrekt.",
        ]
      : skin === "erwachsen"
        ? [
            "Die Umschalttaste brauchst du noch nicht.",
            "Hauptwörter und Satzanfänge erscheinen trotzdem gross - tippe einfach den kleinen Buchstaben, er zählt als richtig.",
            "Die Umschalttaste kommt später als eigene Taste dazu. Bis dahin bleibt die Schreibung im Text trotzdem korrekt.",
          ]
        : [
          "Die Umschalttaste brauchst du noch nicht.",
          "Hauptwörter und Satzanfänge werden trotzdem gross geschrieben - tippe einfach den kleinen Buchstaben, er zählt als richtig.",
          "Die Umschalttaste bekommst du später. Dann sagt dir die App Bescheid.",
        ],
  };
}

/** Die Grossschreibung englisch (EN1) - Wortlaut unverändert. */
function grossschreibungFensterEn(skin: Skin): Fenstertext {
  // ★ Nicht „Hauptwörter": Im Englischen gibt es sie als Regel nicht, und
  //   geübt werden kann auf Deutsch ODER Englisch - der Satz muss für beide
  //   Übungssprachen stimmen.
  return {
    titel: "Capital letters - without Shift",
    absaetze: skin === "erwachsen"
      ? [
          "You don't need the Shift key yet.",
          "Capital letters still appear in the text - just type the small letter; it counts as correct.",
          "Shift is added later as a key of its own. Until then, the text still shows the right capitals.",
        ]
      : [
          "You don't need the Shift key yet.",
          "Capital letters still appear in the text - just type the small letter, and it counts as right.",
          "You'll get the Shift key later. The app will tell you when.",
        ],
  };
}

/**
 * Die Grossschreibung französisch (E11a-5): Im Französischen sind es die
 * Satzanfänge und die Eigennamen (keine Hauptwörter). « vous » nur für die
 * Lehrkraft ({@link isFormal}), sonst « tu ».
 */
function grossschreibungFensterFr(skin: Skin, anrede: Anrede): Fenstertext {
  return {
    titel: "Les majuscules - sans la touche Maj",
    absaetze: isFormal(skin, anrede)
      ? [
          "Vous n'avez pas encore besoin de la touche Maj.",
          "Les débuts de phrase et les noms propres apparaissent quand même en majuscule - tapez simplement la lettre minuscule, elle compte comme juste.",
          "La touche Maj s'ajoutera plus tard comme une touche à part. D'ici là, le texte reste correctement écrit.",
        ]
      : skin === "erwachsen"
        ? [
            "Tu n'as pas encore besoin de la touche Maj.",
            "Les débuts de phrase et les noms propres apparaissent quand même en majuscule - tape simplement la lettre minuscule, elle compte comme juste.",
            "La touche Maj s'ajoutera plus tard comme une touche à part. D'ici là, le texte reste correctement écrit.",
          ]
        : [
            "Tu n'as pas encore besoin de la touche Maj.",
            "Les débuts de phrase et les noms propres s'écrivent quand même avec une majuscule - tape simplement la petite lettre, elle compte comme juste.",
            "Tu auras la touche Maj plus tard. L'application te le dira.",
          ],
  };
}

/**
 * ★ ES-O (27.09.2026): die Grossschreibung spanisch - wie im Französischen
 * Satzanfänge und Eigennamen; usted nur für die Lehrkraft ({@link isFormal}).
 */
function grossschreibungFensterEs(skin: Skin, anrede: Anrede): Fenstertext {
  return {
    titel: "Las mayúsculas - sin la tecla Mayús",
    absaetze: isFormal(skin, anrede)
      ? [
          "Todavía no necesita la tecla Mayús.",
          "Los comienzos de frase y los nombres propios aparecen igualmente en mayúscula - escriba simplemente la letra minúscula, cuenta como correcta.",
          "La tecla Mayús se añadirá más adelante como una tecla propia. Hasta entonces, el texto sigue bien escrito.",
        ]
      : skin === "erwachsen"
        ? [
            "Todavía no necesitas la tecla Mayús.",
            "Los comienzos de frase y los nombres propios aparecen igualmente en mayúscula - escribe simplemente la letra minúscula, cuenta como correcta.",
            "La tecla Mayús se añadirá más adelante como una tecla propia. Hasta entonces, el texto sigue bien escrito.",
          ]
        : [
            "Todavía no necesitas la tecla Mayús.",
            "Los comienzos de frase y los nombres propios se escriben igualmente con mayúscula - escribe simplemente la letra pequeña, cuenta como correcta.",
            "La tecla Mayús llegará más adelante. La aplicación te avisará.",
          ],
  };
}

/**
 * ★ O-IT (02.10.2026): die Grossschreibung italienisch - Satzanfänge und
 * Eigennamen; die Lehrkraft ({@link isFormal}) neutral, ohne „Lei".
 */
function grossschreibungFensterIt(skin: Skin, anrede: Anrede): Fenstertext {
  return {
    titel: "Le maiuscole - senza il tasto Maiusc",
    absaetze: isFormal(skin, anrede)
      ? [
          "Il tasto Maiusc non serve ancora.",
          "Gli inizi di frase e i nomi propri compaiono comunque in maiuscolo - basta scrivere la lettera minuscola, conta come giusta.",
          "Il tasto Maiusc arriverà più avanti come tasto a sé. Fino ad allora il testo resta scritto correttamente.",
        ]
      : skin === "erwachsen"
        ? [
            "Il tasto Maiusc non ti serve ancora.",
            "Gli inizi di frase e i nomi propri compaiono comunque in maiuscolo - scrivi semplicemente la lettera minuscola, conta come giusta.",
            "Il tasto Maiusc arriverà più avanti come tasto a sé. Fino ad allora il testo resta scritto correttamente.",
          ]
        : [
            "Il tasto Maiusc non ti serve ancora.",
            "Gli inizi di frase e i nomi propri si scrivono comunque con la maiuscola - scrivi semplicemente la lettera piccola, conta come giusta.",
            "Il tasto Maiusc arriverà più avanti. L'app te lo dirà.",
          ],
  };
}

/**
 * ★ O-PL (02.10.2026): die Grossschreibung polnisch - Satzanfänge und
 * Eigennamen („wielka litera", Glossar §2.1); die Lehrkraft ({@link isFormal})
 * unpersönlich, sonst „ty".
 */
function grossschreibungFensterPl(skin: Skin, anrede: Anrede): Fenstertext {
  return {
    titel: "Wielkie litery - bez klawisza Shift",
    absaetze: isFormal(skin, anrede)
      ? [
          "Klawisz Shift nie jest jeszcze potrzebny.",
          "Początki zdań i nazwy własne i tak pojawiają się wielką literą - wystarczy napisać małą literę, liczy się jako poprawna.",
          "Klawisz Shift dojdzie później jako osobny klawisz. Do tego czasu tekst i tak jest zapisany poprawnie.",
        ]
      : skin === "erwachsen"
        ? [
            "Klawisz Shift nie jest ci jeszcze potrzebny.",
            "Początki zdań i nazwy własne i tak pojawiają się wielką literą - po prostu napisz małą literę, liczy się jako poprawna.",
            "Klawisz Shift dojdzie później jako osobny klawisz. Do tego czasu tekst i tak jest zapisany poprawnie.",
          ]
        : [
            "Klawisz Shift nie jest ci jeszcze potrzebny.",
            "Początki zdań i imiona i tak piszemy wielką literą - po prostu napisz małą literę, liczy się jako poprawna.",
            "Klawisz Shift dostaniesz później. Program ci o tym powie.",
          ],
  };
}

/**
 * ★ O-TR (02.10.2026): die Grossschreibung türkisch - Satzanfänge und
 * Eigennamen ("büyük harf", Glossar §2.1); die Lehrkraft ({@link isFormal})
 * mit "siz", sonst "sen".
 */
function grossschreibungFensterTr(skin: Skin, anrede: Anrede): Fenstertext {
  return {
    titel: "Büyük harfler - Shift tuşu olmadan",
    absaetze: isFormal(skin, anrede)
      ? [
          "Shift tuşuna henüz ihtiyacınız yok.",
          "Cümle başları ve özel adlar yine de büyük harfle görünür - küçük harfi yazmanız yeter, doğru sayılır.",
          "Shift tuşu daha sonra ayrı bir tuş olarak eklenir. O zamana kadar metindeki yazım yine de doğru kalır.",
        ]
      : skin === "erwachsen"
        ? [
            "Shift tuşuna henüz ihtiyacın yok.",
            "Cümle başları ve özel adlar yine de büyük harfle görünür - küçük harfi yazman yeter, doğru sayılır.",
            "Shift tuşu daha sonra ayrı bir tuş olarak eklenir. O zamana kadar metindeki yazım yine de doğru kalır.",
          ]
        : [
            "Shift tuşuna henüz ihtiyacın yok.",
            "Cümle başları ve adlar yine de büyük harfle yazılır - sen küçük harfi yaz, doğru sayılır.",
            "Shift tuşunu daha sonra alacaksın. Program sana haber verir.",
          ],
  };
}

/**
 * ★ O-CS (03.10.2026): die Grossschreibung tschechisch - Satzanfänge und
 * Eigennamen („velké písmeno", Glossar §2.1); die Lehrkraft ({@link isFormal})
 * mit vy, sonst ty.
 */
function grossschreibungFensterCs(skin: Skin, anrede: Anrede): Fenstertext {
  return {
    titel: "Velká písmena - bez klávesy Shift",
    absaetze: isFormal(skin, anrede)
      ? [
          "Klávesu Shift zatím nepotřebujete.",
          "Začátky vět a vlastní jména se přesto zobrazí s velkým písmenem - stačí napsat malé písmeno, počítá se jako správné.",
          "Klávesa Shift přibude později jako samostatná klávesa. Do té doby zůstává text napsaný správně.",
        ]
      : skin === "erwachsen"
        ? [
            "Klávesu Shift zatím nepotřebuješ.",
            "Začátky vět a vlastní jména se přesto zobrazí s velkým písmenem - stačí napsat malé písmeno, počítá se jako správné.",
            "Klávesa Shift přibude později jako samostatná klávesa. Do té doby zůstává text napsaný správně.",
          ]
        : [
            "Klávesu Shift zatím nepotřebuješ.",
            "Začátky vět a jména se přesto píšou s velkým písmenem - ty napiš malé písmeno, počítá se jako správné.",
            "Klávesu Shift dostaneš později. Aplikace ti dá vědět.",
          ],
  };
}

/**
 * ★ O2-LIB (29.10.2026): die Grossschreibung bulgarisch - Satzanfänge und Eigennamen
 * („главна буква", Glossar §2.1); die Lehrkraft ({@link isFormal}) mit Вие, sonst ти.
 */
function grossschreibungFensterBg(skin: Skin, anrede: Anrede): Fenstertext {
  return {
    titel: "Главни букви - без клавиша Shift",
    absaetze: isFormal(skin, anrede)
      ? [
          "Клавишът Shift засега не ви е нужен.",
          "Началата на изреченията и собствените имена пак се показват с главна буква - достатъчно е да напишете малката буква, тя се брои за вярна.",
          "Клавишът Shift ще се добави по-късно като отделен клавиш. Дотогава текстът остава написан правилно.",
        ]
      : skin === "erwachsen"
        ? [
            "Клавишът Shift засега не ти е нужен.",
            "Началата на изреченията и собствените имена пак се показват с главна буква - достатъчно е да напишеш малката буква, тя се брои за вярна.",
            "Клавишът Shift ще се добави по-късно като отделен клавиш. Дотогава текстът остава написан правилно.",
          ]
        : [
            "Клавишът Shift засега не ти е нужен.",
            "Началата на изреченията и имената пак се пишат с главна буква - ти напиши малката буква, тя се брои за вярна.",
            "Клавишът Shift ще получиш по-късно. Приложението ще ти каже.",
          ],
  };
}

/**
 * ★ O-EL-LIB (30.10.2026): die Großschreibung griechisch - Satzanfänge und Eigennamen (κεφαλαίο, Glossar §2.1); die
 * Lehrkraft ({@link isFormal}) mit εσείς, sonst εσύ.
 */
function grossschreibungFensterEl(skin: Skin, anrede: Anrede): Fenstertext {
  return {
    titel: "Κεφαλαία γράμματα - χωρίς Shift",
    absaetze: isFormal(skin, anrede)
      ? [
          "Το πλήκτρο Shift δεν το χρειάζεστε ακόμα.",
          "Οι αρχές προτάσεων και τα κύρια ονόματα εμφανίζονται ωστόσο με κεφαλαίο γράμμα - αρκεί να γράψετε το πεζό γράμμα, μετράει ως σωστό.",
          "Το πλήκτρο Shift προστίθεται αργότερα ως ξεχωριστό πλήκτρο. Μέχρι τότε το κείμενο μένει γραμμένο σωστά.",
        ]
      : skin === "erwachsen"
        ? [
            "Το πλήκτρο Shift δεν το χρειάζεσαι ακόμα.",
            "Οι αρχές προτάσεων και τα κύρια ονόματα εμφανίζονται ωστόσο με κεφαλαίο γράμμα - αρκεί να γράψεις το πεζό γράμμα, μετράει ως σωστό.",
            "Το πλήκτρο Shift προστίθεται αργότερα ως ξεχωριστό πλήκτρο. Μέχρι τότε το κείμενο μένει γραμμένο σωστά.",
          ]
        : [
            "Το πλήκτρο Shift δεν το χρειάζεσαι ακόμα.",
            "Οι αρχές προτάσεων και τα ονόματα εμφανίζονται ωστόσο με κεφαλαίο γράμμα - εσύ γράψε το πεζό γράμμα, μετράει ως σωστό.",
            "Το πλήκτρο Shift θα το πάρεις αργότερα. Το πρόγραμμα θα σου πει πότε.",
          ],
  };
}

/**
 * ★ O2-LIB (29.10.2026): die Grossschreibung ungarisch - Satzanfänge und Eigennamen
 * („nagybetű", Glossar §2.1); die Lehrkraft ({@link isFormal}) ohne Anrede, sonst te.
 */
function grossschreibungFensterHu(skin: Skin, anrede: Anrede): Fenstertext {
  return {
    titel: "Nagybetűk - Shift billentyű nélkül",
    absaetze: isFormal(skin, anrede)
      ? [
          "A Shift billentyűre egyelőre nincs szükség.",
          "A mondatok eleje és a nevek a szövegben továbbra is nagybetűvel jelennek meg - elég a kisbetűt beírni, ez helyesnek számít.",
          "A Shift billentyű később külön billentyűként jön hozzá. Addig is helyesnek számít a szöveg.",
        ]
      : skin === "erwachsen"
        ? [
            "A Shift billentyűre egyelőre nincs szükséged.",
            "A mondatok eleje és a nevek a szövegben továbbra is nagybetűvel jelennek meg - elég a kisbetűt beírnod, ez helyesnek számít.",
            "A Shift billentyű később külön billentyűként jön hozzá. Addig is helyesnek számít a szöveg.",
          ]
        : [
            "A Shift billentyűre még nincs szükséged.",
            "A mondatok eleje és a nevek továbbra is nagybetűvel jelennek meg - te csak a kisbetűt írd be, az helyesnek számít.",
            "A Shift billentyűt később kapod meg. Az alkalmazás szól majd.",
          ],
  };
}

/**
 * ★ O-LIB (30.10.2026): a escrita com maiúsculas portuguesa - inícios de frase e nomes próprios
 * („letra maiúscula", Glossar §2.1); quem ensina ({@link isFormal}) sem pronome, os outros tu.
 */
function grossschreibungFensterPt(skin: Skin, anrede: Anrede): Fenstertext {
  return {
    titel: "Letras maiúsculas - sem Shift",
    absaetze: isFormal(skin, anrede)
      ? [
          "Ainda não precisa da tecla Shift.",
          "Os inícios de frase e os nomes próprios aparecem na mesma com letra maiúscula - basta escrever a letra minúscula, que conta como certa.",
          "A tecla Shift será acrescentada mais tarde, como tecla própria. Até lá, o texto continua a mostrar as maiúsculas certas.",
        ]
      : skin === "erwachsen"
        ? [
            "Ainda não precisas da tecla Shift.",
            "Os inícios de frase e os nomes próprios aparecem na mesma com letra maiúscula - basta escreveres a letra minúscula, que conta como certa.",
            "A tecla Shift será acrescentada mais tarde, como tecla própria. Até lá, o texto continua a mostrar as maiúsculas certas.",
          ]
        : [
            "Ainda não precisas da tecla Shift.",
            "As letras maiúsculas aparecem na mesma no texto - tu escreves a letra minúscula e conta como certa.",
            "A tecla Shift vem mais tarde. A aplicação avisa-te quando for a altura.",
          ],
  };
}

/** ★ O2-LIB (29.10.2026): die Grossschreibung, Portugiesisch (Brasilien) - você für alle. */
function grossschreibungFensterBr(skin: Skin): Fenstertext {
  return {
    titel: "Letras maiúsculas - sem Shift",
    absaetze: skin === "erwachsen"
      ? [
          "A tecla Shift ainda não é necessária.",
          "As letras maiúsculas continuam aparecendo no texto - basta digitar a letra minúscula, que conta como certa.",
          "O Shift entra mais tarde, como uma tecla própria. Até lá, o texto continua mostrando as maiúsculas corretas.",
        ]
      : [
          "Você ainda não precisa da tecla Shift.",
          "As letras maiúsculas continuam aparecendo no texto - basta digitar a letra minúscula, e ela conta como certa.",
          "A tecla Shift chega mais tarde. O aplicativo avisa quando for a hora.",
        ],
  };
}

/**
 * ★ O2-LIB (29.10.2026): die Grossschreibung rumänisch - Satzanfänge und Eigennamen
 * („literă mare“); die Lehrkraft ({@link isFormal}) mit Mehrzahl, sonst tu.
 */
function grossschreibungFensterRo(skin: Skin, anrede: Anrede): Fenstertext {
  return {
    titel: "Litere mari - fără Shift",
    absaetze: isFormal(skin, anrede)
      ? [
          "Încă nu aveți nevoie de tasta Shift.",
          "Începuturile de propoziție și numele proprii apar totuși cu literă mare - scrieți litera mică, se numără ca fiind corectă.",
          "Tasta Shift se adaugă mai târziu, ca tastă de sine stătătoare. Până atunci textul rămâne scris corect.",
        ]
      : skin === "erwachsen"
        ? [
            "Încă nu ai nevoie de tasta Shift.",
            "Începuturile de propoziție și numele proprii apar totuși cu literă mare - scrie litera mică, se numără ca fiind corectă.",
            "Tasta Shift se adaugă mai târziu, ca tastă de sine stătătoare. Până atunci textul rămâne scris corect.",
          ]
        : [
            "Încă nu ai nevoie de tasta Shift.",
            "Începuturile de propoziție și numele proprii apar totuși cu literă mare - tu scrie litera mică, se numără ca fiind corectă.",
            "Tasta Shift o primești mai târziu. Aplicația îți spune când.",
          ],
  };
}

/**
 * ★ O2-LIB (30.10.2026): die Grossschreibung ukrainisch - Satzanfänge und Eigennamen („велика літера", Glossar §2.1);
 * die Lehrkraft ({@link isFormal}) mit ви, sonst ти.
 */
function grossschreibungFensterUk(skin: Skin, anrede: Anrede): Fenstertext {
  return {
    titel: "Великі літери - без клавіші Shift",
    absaetze: isFormal(skin, anrede)
      ? [
          "Клавіша Shift вам поки не потрібна.",
          "Початки речень і власні назви все одно показуються з великої літери - достатньо надрукувати малу, це зараховується як правильно.",
          "Клавіша Shift з'явиться пізніше як окрема клавіша. До того часу в тексті все одно стоять правильні великі літери.",
        ]
      : skin === "erwachsen"
        ? [
            "Клавіша Shift тобі поки не потрібна.",
            "Початки речень і власні назви все одно показуються з великої літери - достатньо надрукувати малу, це зараховується як правильно.",
            "Клавіша Shift з'явиться пізніше як окрема клавіша. До того часу в тексті все одно стоять правильні великі літери.",
          ]
        : [
            "Клавіша Shift тобі поки не потрібна.",
            "Початки речень і імена все одно пишуться з великої літери - ти друкуй малу, це зараховується як правильно.",
            "Клавішу Shift отримаєш пізніше. Застосунок підкаже.",
          ],
  };
}

/** Deutsch steht im Rumpf von {@link grossschreibungFenster} (`null`). */
const GROSSSCHREIBUNG_FREMD: Record<BedienSprache, ((skin: Skin, anrede: Anrede) => Fenstertext) | null> = {
  de: null,
  en: (skin) => grossschreibungFensterEn(skin),
  fr: grossschreibungFensterFr,
  es: grossschreibungFensterEs,
  it: grossschreibungFensterIt,
  pl: grossschreibungFensterPl,
  tr: grossschreibungFensterTr,
  cs: grossschreibungFensterCs,
  // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: grossschreibungFensterBg,
  el: grossschreibungFensterEl,
  hu: grossschreibungFensterHu,
  nl: (skin) => ({
    titel: "Hoofdletters - zonder Shift",
    absaetze: skin === "erwachsen"
      ? [
          "Je hebt de Shift-toets nog niet nodig.",
          "Hoofdletters staan wel in de tekst - typ gewoon de kleine letter, die telt als goed.",
          "Shift komt later als aparte toets erbij. Tot dan staat de tekst gewoon met de juiste hoofdletters.",
        ]
      : [
          "Je hebt de Shift-toets nog niet nodig.",
          "Hoofdletters zie je wel in de tekst - typ gewoon de kleine letter, dan is het goed.",
          "De Shift-toets krijg je later. De app vertelt het je.",
        ],
  }),
  pt: grossschreibungFensterPt,
  br: grossschreibungFensterBr,
  ro: grossschreibungFensterRo,
  sv: (skin) => ({
    titel: "Stora bokstäver - utan Skift",
    absaetze: skin === "erwachsen"
      ? [
          "Du behöver inte Skift än.",
          "Stora bokstäver står ändå i texten - skriv bara den lilla bokstaven, den räknas som rätt.",
          "Skift kommer senare som en egen tangent. Till dess visas texten ändå med rätt stora bokstäver.",
        ]
      : [
          "Du behöver inte Skift än.",
          "Stora bokstäver ser du ändå i texten - skriv bara den lilla bokstaven, så är det rätt.",
          "Skift får du senare. Appen berättar när.",
        ],
  }),
  uk: grossschreibungFensterUk,
};

/**
 * „Gratulation, du hast dein Wochenziel erreicht."
 *
 * W4 (19.09.2026, Bauplan §„W4 Kind"): Ersetzt das frühere Tagesziel-Fenster
 * (16.09.-19.09.2026, das seinerseits ein noch früheres Wochenziel-Fenster
 * ersetzt hatte). Seit `wochenziel.ts` gibt es keine Einheiten und kein
 * Tageslimit mehr, nur noch Minuten je KALENDERWOCHE - darum feiert dieses
 * Fenster wieder das Wochenziel selbst, einmal je Ziel-Woche, ohne Haken (der
 * Merker sitzt in `merkfenster.ts`, `wochenzielFensterGezeigt`/
 * `merkeWochenzielFenster`, jetzt nach ISO-Wochenschlüssel statt Kalendertag).
 *
 * ★ DER TON IST ABSICHT: eine Feier, keine Grenze. „Du kannst gern
 * weiterüben" - nicht „mehr geht diese Woche nicht". Wer gleich weiterüben
 * will, darf das jederzeit ([[feedback_nie_gegen_das_kind]]).
 */
export function wochenzielFenster(
  skin: Skin,
  sprache: BedienSprache = "de",
  anrede: Anrede = "du",
): Fenstertext {
  const fremd = WOCHENZIEL_FREMD[sprache];
  if (fremd) return fremd(skin, anrede);
  return {
    titel: "Wochenziel geschafft!",
    absaetze: isFormal(skin, anrede)
      ? [
          "Gratulation, Sie haben Ihr Wochenziel erreicht.",
          "Sie können gern weiterüben - jede Minute zählt für Ihre Übungszeit.",
        ]
      : skin === "erwachsen"
        ? [
            // Ab 16 per Du, aber im Erwachsenen-Ton: der Satz endet ruhig.
            "Gratulation, du hast dein Wochenziel erreicht.",
            "Du kannst gern weiterüben - jede Minute zählt für deine Übungszeit.",
          ]
        : [
          "Gratulation, du hast dein Wochenziel erreicht!",
          "Du kannst gern weiterüben - jede Minute zählt für deine Übungszeit.",
        ],
  };
}

/** Das Wochenziel-Fenster englisch (EN1) - Wortlaut unverändert. */
function wochenzielFensterEn(skin: Skin): Fenstertext {
  // Ein Ausrufezeichen nur für Kinder (Glossar §1.2) - Jugend und
  // Erwachsene bekommen dieselbe Feier ohne.
  return {
    titel: skin === "kind" ? "Weekly goal reached!" : "Weekly goal reached",
    absaetze: [
      skin === "kind"
        ? "Well done - you've reached your weekly goal."
        : skin === "erwachsen"
          ? "Congratulations, you have reached your weekly goal."
          : "Congratulations, you've reached your weekly goal.",
      "You're welcome to keep practising - every minute counts towards your practice time.",
    ],
  };
}

/**
 * Das Wochenziel-Fenster französisch (E11a-5) - eine Feier, keine Grenze
 * („tu peux continuer"); das Ausrufezeichen nur für Kinder, wie im Englischen.
 * Glossar §9.2: « objectif de la semaine », « temps d'exercice ».
 */
function wochenzielFensterFr(skin: Skin, anrede: Anrede): Fenstertext {
  if (isFormal(skin, anrede))
    return {
      titel: "Objectif de la semaine atteint",
      absaetze: [
        "Bravo, vous avez atteint votre objectif de la semaine.",
        "Vous pouvez continuer à vous exercer - chaque minute compte pour votre temps d'exercice.",
      ],
    };
  return {
    titel: skin === "kind" ? "Objectif de la semaine atteint !" : "Objectif de la semaine atteint",
    absaetze: [
      skin === "kind"
        ? "Bravo, tu as atteint ton objectif de la semaine !"
        : "Bravo, tu as atteint ton objectif de la semaine.",
      "Tu peux continuer à t'exercer - chaque minute compte pour ton temps d'exercice.",
    ],
  };
}

/** ★ ES-O (27.09.2026): das Wochenziel-Fenster spanisch - eine Feier, keine Grenze. */
function wochenzielFensterEs(skin: Skin, anrede: Anrede): Fenstertext {
  if (isFormal(skin, anrede))
    return {
      titel: "Objetivo semanal alcanzado",
      absaetze: [
        "Enhorabuena, ha alcanzado su objetivo semanal.",
        "Puede seguir practicando - cada minuto cuenta para su tiempo de práctica.",
      ],
    };
  return {
    titel: skin === "kind" ? "¡Objetivo semanal alcanzado!" : "Objetivo semanal alcanzado",
    absaetze: [
      skin === "kind"
        ? "¡Enhorabuena, has alcanzado tu objetivo semanal!"
        : "Enhorabuena, has alcanzado tu objetivo semanal.",
      "Puedes seguir practicando - cada minuto cuenta para tu tiempo de práctica.",
    ],
  };
}

/**
 * ★ O-IT (02.10.2026): das Wochenziel-Fenster italienisch - eine Feier, keine
 * Grenze; höchstens ein Ausrufezeichen und nur für Kinder (Glossar Regel 1);
 * die Lehrkraft neutral.
 */
function wochenzielFensterIt(skin: Skin, anrede: Anrede): Fenstertext {
  if (isFormal(skin, anrede))
    return {
      titel: "Obiettivo settimanale raggiunto",
      absaetze: [
        "Complimenti, l'obiettivo settimanale è raggiunto.",
        "Si può continuare a esercitarsi - ogni minuto conta per il tempo di esercizio.",
      ],
    };
  return {
    titel: skin === "kind" ? "Obiettivo settimanale raggiunto!" : "Obiettivo settimanale raggiunto",
    absaetze: [
      "Complimenti, hai raggiunto il tuo obiettivo settimanale.",
      "Puoi continuare a esercitarti - ogni minuto conta per il tuo tempo di esercizio.",
    ],
  };
}

/**
 * ★ O-PL (02.10.2026): das Wochenziel-Fenster polnisch - eine Feier, keine
 * Grenze; Satz über die Sache („cel … osiągnięty"), nie „osiągnąłeś"
 * (Glossar Regel 2); ein Ausrufezeichen nur für Kinder.
 */
function wochenzielFensterPl(skin: Skin, anrede: Anrede): Fenstertext {
  if (isFormal(skin, anrede))
    return {
      titel: "Cel tygodniowy osiągnięty",
      absaetze: [
        "Gratulacje, cel tygodniowy jest osiągnięty.",
        "Można ćwiczyć dalej - każda minuta liczy się do czasu ćwiczeń.",
      ],
    };
  return {
    titel: skin === "kind" ? "Cel tygodniowy osiągnięty!" : "Cel tygodniowy osiągnięty",
    absaetze: [
      "Gratulacje, twój cel tygodniowy jest osiągnięty.",
      "Możesz ćwiczyć dalej - każda minuta liczy się do twojego czasu ćwiczeń.",
    ],
  };
}

/**
 * ★ O-TR (02.10.2026): das Wochenziel-Fenster türkisch - eine Feier, keine
 * Grenze; "Harika" für Kinder, "Tebrikler" ab der Jugend (Glossar §2.11);
 * ein Ausrufezeichen nur für Kinder, die Lehrkraft mit "siz".
 */
function wochenzielFensterTr(skin: Skin, anrede: Anrede): Fenstertext {
  if (isFormal(skin, anrede))
    return {
      titel: "Haftalık hedefe ulaşıldı",
      absaetze: [
        "Tebrikler, haftalık hedefinize ulaştınız.",
        "Çalışmaya devam edebilirsiniz - her dakika çalışma sürenize eklenir.",
      ],
    };
  return {
    titel: skin === "kind" ? "Haftalık hedefe ulaştın!" : "Haftalık hedefe ulaşıldı",
    absaetze: [
      skin === "kind" ? "Harika, haftalık hedefine ulaştın." : "Tebrikler, haftalık hedefine ulaştın.",
      "Çalışmaya devam edebilirsin - her dakika çalışma sürene eklenir.",
    ],
  };
}

/**
 * ★ O-CS (03.10.2026): das Wochenziel-Fenster tschechisch - eine Feier, keine
 * Grenze; der Satz spricht über den Cíl, nicht über das Kind („je splněný" -
 * keine Vergangenheit der 2. Person, Glossar §1 Regel 2); ein Ausrufezeichen
 * nur für Kinder, die Lehrkraft mit vy.
 */
function wochenzielFensterCs(skin: Skin, anrede: Anrede): Fenstertext {
  if (isFormal(skin, anrede))
    return {
      titel: "Týdenní cíl je splněný",
      absaetze: [
        "Gratulujeme, váš týdenní cíl je splněný.",
        "Můžete klidně cvičit dál - každá minuta se počítá do vašeho času procvičování.",
      ],
    };
  return {
    titel: skin === "kind" ? "Týdenní cíl je splněný!" : "Týdenní cíl je splněný",
    absaetze: [
      skin === "kind" ? "Paráda, tvůj týdenní cíl je splněný." : "Gratulujeme, tvůj týdenní cíl je splněný.",
      "Můžeš klidně cvičit dál - každá minuta se počítá do tvého času procvičování.",
    ],
  };
}

/**
 * ★ O2-LIB (29.10.2026): das Wochenziel-Fenster bulgarisch - eine Feier, keine Grenze; der Satz
 * spricht über die цел, nicht über das Kind (keine Vergangenheit der 2. Person, Glossar Regel 2);
 * ein Ausrufezeichen nur für Kinder, die Lehrkraft mit Вие.
 */
function wochenzielFensterBg(skin: Skin, anrede: Anrede): Fenstertext {
  if (isFormal(skin, anrede))
    return {
      titel: "Седмичната цел е изпълнена",
      absaetze: [
        "Поздравяваме ви, седмичната ви цел е изпълнена.",
        "Можете спокойно да упражнявате и по-нататък - всяка минута се брои във времето ви за упражнения.",
      ],
    };
  return {
    titel: skin === "kind" ? "Седмичната цел е изпълнена!" : "Седмичната цел е изпълнена",
    absaetze: [
      skin === "kind" ? "Браво, седмичната ти цел е изпълнена." : "Поздравяваме те, седмичната ти цел е изпълнена.",
      "Можеш спокойно да упражняваш и по-нататък - всяка минута се брои във времето ти за упражнения.",
    ],
  };
}

/**
 * ★ O-EL-LIB (30.10.2026): das Wochenziel-Fenster griechisch - eine Feier, keine Grenze; der Satz spricht über den Στόχο,
 * nicht über das Kind („ολοκληρώθηκε", Regel 2); ein Ausrufezeichen nur für Kinder, die Lehrkraft mit εσείς.
 */
function wochenzielFensterEl(skin: Skin, anrede: Anrede): Fenstertext {
  if (isFormal(skin, anrede))
    return {
      titel: "Ο εβδομαδιαίος στόχος ολοκληρώθηκε",
      absaetze: [
        "Συγχαρητήρια, ο εβδομαδιαίος στόχος σας ολοκληρώθηκε.",
        "Μπορείτε να συνεχίσετε την εξάσκηση - κάθε λεπτό μετράει στον χρόνο εξάσκησής σας.",
      ],
    };
  return {
    titel: skin === "kind" ? "Ο εβδομαδιαίος στόχος ολοκληρώθηκε!" : "Ο εβδομαδιαίος στόχος ολοκληρώθηκε",
    absaetze: [
      skin === "kind"
        ? "Μπράβο, ο εβδομαδιαίος στόχος σου ολοκληρώθηκε."
        : "Συγχαρητήρια, ο εβδομαδιαίος στόχος σου ολοκληρώθηκε.",
      "Μπορείς να συνεχίσεις την εξάσκηση - κάθε λεπτό μετράει στον χρόνο εξάσκησής σου.",
    ],
  };
}

/**
 * ★ O2-LIB (29.10.2026): das Wochenziel-Fenster ungarisch - eine Feier, keine Grenze;
 * ein Ausrufezeichen nur für Kinder, die Lehrkraft ohne Anrede.
 */
function wochenzielFensterHu(skin: Skin, anrede: Anrede): Fenstertext {
  if (isFormal(skin, anrede))
    return {
      titel: "Heti cél teljesítve",
      absaetze: [
        "Gratulálunk, a heti cél teljesítve.",
        "Nyugodtan lehet tovább gyakorolni - minden perc beleszámít a gyakorlási időbe.",
      ],
    };
  return {
    titel: skin === "kind" ? "Heti cél teljesítve!" : "Heti cél teljesítve",
    absaetze: [
      skin === "kind" ? "Szuper, teljesítetted a heti célodat." : "Gratulálunk, teljesítetted a heti célodat.",
      "Nyugodtan gyakorolj tovább - minden perc beleszámít a gyakorlási időbe.",
    ],
  };
}

/**
 * ★ O-LIB (30.10.2026): a janela do objetivo semanal portuguesa - uma festa, não um limite; a frase fala
 * do objetivo, não da pessoa; ponto de exclamação só para crianças, quem ensina sem pronome.
 */
function wochenzielFensterPt(skin: Skin, anrede: Anrede): Fenstertext {
  if (isFormal(skin, anrede))
    return {
      titel: "Objetivo semanal cumprido",
      absaetze: [
        "Parabéns, o objetivo semanal está cumprido.",
        "Pode continuar a praticar à vontade - cada minuto conta para o tempo de prática.",
      ],
    };
  return {
    titel: skin === "kind" ? "Objetivo semanal cumprido!" : "Objetivo semanal cumprido",
    absaetze: [
      skin === "kind" ? "Muito bem, o teu objetivo semanal está cumprido." : "Parabéns, o teu objetivo semanal está cumprido.",
      "Podes continuar a praticar à vontade - cada minuto conta para o teu tempo de prática.",
    ],
  };
}

/** ★ O2-LIB (29.10.2026): das Wochenziel-Fenster, Portugiesisch (Brasilien) - Sätze über die Meta, nicht über das Kind. */
function wochenzielFensterBr(skin: Skin): Fenstertext {
  return {
    titel: skin === "kind" ? "Meta semanal cumprida!" : "Meta semanal cumprida",
    absaetze: [
      skin === "kind"
        ? "Muito bem - a meta semanal foi cumprida."
        : "Parabéns, a meta semanal foi cumprida.",
      "Pode continuar praticando - cada minuto conta para o tempo de prática.",
    ],
  };
}

/**
 * ★ O2-LIB (29.10.2026): das Wochenziel-Fenster rumänisch - eine Feier, keine Grenze;
 * ein Ausrufezeichen nur für Kinder, die Lehrkraft mit Mehrzahl.
 */
function wochenzielFensterRo(skin: Skin, anrede: Anrede): Fenstertext {
  if (isFormal(skin, anrede))
    return {
      titel: "Obiectiv săptămânal atins",
      absaetze: [
        "Felicitări, obiectivul săptămânal este atins.",
        "Puteți continua liniștit să exersați - fiecare minut se adaugă la timpul de exersare.",
      ],
    };
  return {
    titel: skin === "kind" ? "Obiectiv săptămânal atins!" : "Obiectiv săptămânal atins",
    absaetze: [
      skin === "kind" ? "Bravo, obiectivul tău săptămânal este atins." : "Felicitări, obiectivul tău săptămânal este atins.",
      "Poți continua liniștit să exersezi - fiecare minut se adaugă la timpul tău de exersare.",
    ],
  };
}

/**
 * ★ O2-LIB (30.10.2026): das Wochenziel-Fenster ukrainisch - eine Feier, keine Grenze; der Satz spricht über die Мета,
 * nicht über das Kind („досягнуто" - keine Vergangenheit der 2. Person, Glossar §1 Regel 2); ein Ausrufezeichen nur für
 * Kinder, die Lehrkraft mit ви.
 */
function wochenzielFensterUk(skin: Skin, anrede: Anrede): Fenstertext {
  if (isFormal(skin, anrede))
    return {
      titel: "Тижневу мету досягнуто",
      absaetze: [
        "Вітаємо, вашу тижневу мету досягнуто.",
        "Можете спокійно тренуватися далі - кожна хвилина зараховується до вашого часу тренування.",
      ],
    };
  return {
    titel: skin === "kind" ? "Тижневу мету досягнуто!" : "Тижневу мету досягнуто",
    absaetze: [
      skin === "kind" ? "Чудово, твою тижневу мету досягнуто." : "Вітаємо, твою тижневу мету досягнуто.",
      "Можеш спокійно тренуватися далі - кожна хвилина зараховується до твого часу тренування.",
    ],
  };
}

/** Deutsch steht im Rumpf von {@link wochenzielFenster} (`null`). */
const WOCHENZIEL_FREMD: Record<BedienSprache, ((skin: Skin, anrede: Anrede) => Fenstertext) | null> = {
  de: null,
  en: (skin) => wochenzielFensterEn(skin),
  fr: wochenzielFensterFr,
  es: wochenzielFensterEs,
  it: wochenzielFensterIt,
  pl: wochenzielFensterPl,
  tr: wochenzielFensterTr,
  cs: wochenzielFensterCs,
  // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: wochenzielFensterBg,
  el: wochenzielFensterEl,
  hu: wochenzielFensterHu,
  nl: (skin) => ({
    titel: skin === "kind" ? "Weekdoel gehaald!" : "Weekdoel gehaald",
    absaetze: [
      skin === "kind"
        ? "Goed gedaan - het weekdoel is gehaald."
        : "Gefeliciteerd, het weekdoel is gehaald.",
      "Oefen gerust verder - elke minuut telt mee voor de oefentijd.",
    ],
  }),
  pt: wochenzielFensterPt,
  br: wochenzielFensterBr,
  ro: wochenzielFensterRo,
  sv: (skin) => ({
    titel: skin === "kind" ? "Veckomålet är uppnått!" : "Veckomålet är uppnått",
    absaetze: [
      skin === "kind"
        ? "Bra jobbat - veckomålet är uppnått."
        : "Grattis, veckomålet är uppnått.",
      "Du får gärna öva vidare - varje minut räknas till din övningstid.",
    ],
  }),
  uk: wochenzielFensterUk,
};

/**
 * „Weiter geht es mit einer Übung von deiner Lehrkraft."
 *
 * E6 (19.09.2026, „Meine Klassen" - Eigene Übung): Erscheint, sobald die
 * Klasse eine „Eigene Übung" zuweist und DIESES Kind noch dran ist
 * (`useEigeneUebung.ts`, `useEigeneUebungAnkuendigung.ts`). Johannes wörtlich
 * (18.09.2026 abends, Entwurf §7b): „bei der eigenen Übung soll unten stehen
 * 'Eigene Übung starten', dann bekommen alle ein Popup mit 'Weiter geht es
 * mit einer Übung von deiner Lehrkraft', Kinder können nur auf 'Weiter'
 * klicken, nicht ablehnen."
 *
 * ★ NUR EIN SATZ, kein zweiter Absatz und kein Haken - jede Übung der Reihe
 * ist ein neuer Anlass (Z1, 19.09.2026: je Kind und Text am Konto gemerkt,
 * `customTextProgress[textId].angekuendigt`, siehe `useEigeneUebung.ts`).
 * Der Satz steht als `titel`, `absaetze` bleibt leer -
 * `EigeneUebungAnkuendigung.tsx` sagt, warum das eine eigene, schlanke
 * Komponente ist und nicht `Merkfenster` mit seinem Schalter „Verstanden".
 */
export function eigeneUebungAnkuendigung(
  skin: Skin,
  sprache: BedienSprache = "de",
  anrede: Anrede = "du",
): Fenstertext {
  // ★ O-IT (02.10.2026): „Esercizio dell'insegnante" (Glossar §2.2) - „l'insegnante"
  // verrät kein Geschlecht, nie „il tuo/la tua insegnante" (Regel 2).
  if (sprache === "it") return { titel: "Si continua con un esercizio dell'insegnante.", absaetze: [] };
  // ★ O-PL (02.10.2026): „Ćwiczenie dla klasy" (Glossar §2.2) - nie „od
  // nauczyciela" (gegendert); Name nach Doppelpunkt im Nominativ (§2.2).
  if (sprache === "pl") return { titel: "Teraz kolej na: Ćwiczenie dla klasy.", absaetze: [] };
  // ★ O-TR (02.10.2026): "Öğretmenden alıştırma" (Glossar §2.2), nach
  // "Sırada:" (§2.2 "Jetzt kommen ..."); nur Kinder einer Klasse sehen es.
  if (sprache === "tr") return { titel: "Sırada: Öğretmenden alıştırma.", absaetze: [] };
  // ★ O-CS (03.10.2026): „Cvičení ze školy" (Glossar §2.2) - nie „od učitele"
  // (gegendert); nach „Teď:" (§2.2 Doppelpunkt-Muster); nur Kinder einer Klasse.
  // ★ O2-LIB (30.10.2026): die neun Sprachen des Gerüsts mit eigenem Zweig - nie Englisch, nie Deutsch.
  // ★ O2-LIB (30.10.2026, Glossar §2.2): „Упражнение от училище" - nie „от учителя" (gegendert); nur Kinder einer Klasse.
  if (sprache === "bg") return { titel: "Следва: Упражнение от училище.", absaetze: [] };
  if (sprache === "el") return { titel: "Τώρα: άσκηση για το τμήμα.", absaetze: [] };
  // ★ O2-LIB (30.10.2026): Ungarisch, Doppelpunkt-Muster (Glossar §2.2/§2.12), „Iskolai gyakorlat" - kein Name mit Endung.
  if (sprache === "hu") return { titel: "Most: iskolai gyakorlat.", absaetze: [] };
  // ★ O2-LIB (29.10.2026): niederländisch - "Oefening van de leerkracht" (Glossar nl §2.2), Doppelpunkt-Muster "Nu:".
  if (sprache === "nl") return { titel: "Nu: oefening van de leerkracht.", absaetze: [] };
  // ★ O-LIB (30.10.2026): „Exercício da escola" (Glossar §2.2) - nunca com professor/professora (Geschlecht);
  // nach „Agora:" (Doppelpunkt-Muster); nur Kinder einer Klasse sehen es.
  if (sprache === "pt") return { titel: "Agora: Exercício da escola.", absaetze: [] };
  // ★ O2-LIB (29.10.2026): "Exercício da escola" (Glossar), nach "Agora:"; nur Kinder einer Klasse sehen es.
  if (sprache === "br") return { titel: "Agora: Exercício da escola.", absaetze: [] };
  if (sprache === "ro") return { titel: "Acum: exercițiu de la școală.", absaetze: [] };
  // ★ O2-LIB (30.10.2026): schwedisch - "Från läraren" (Glossar sv §2.2), Doppelpunkt-Muster "Nu:"; "läraren" verrät kein Geschlecht.
  if (sprache === "sv") return { titel: "Nu: en övning från läraren.", absaetze: [] };
  // ★ O2-LIB (30.10.2026): „Шкільна вправа" (Glossar §2.2) - nie „від учителя" (gegendert); nach „Далі:" (Doppelpunkt-Muster); nur Kinder einer Klasse.
  if (sprache === "uk") return { titel: "Далі: Шкільна вправа.", absaetze: [] };
  if (sprache === "cs") return { titel: "Teď: Cvičení ze školy.", absaetze: [] };
  // Glossar §3.8/§5 Nr 9: Die Lehrkraft liest „Custom exercise", das Kind
  // „an exercise from your teacher" - für alle Tonlagen derselbe Satz.
  if (sprache === "en") return { titel: "Next up: an exercise from your teacher.", absaetze: [] };
  // ★ E11a-4 (26.09.2026): dritte Fassung statt der alten `=== "en"`-Weiche
  // (Falle 30) - sonst bekäme „fr" hier still Deutsch. Dieses Fenster
  // erreicht laut Dateikopf ohnehin nur Kinder einer Klasse ⇒ immer „tu"
  // (F9), keine Sie/vous-Fassung nötig - `isFormal` bleibt darum unbenutzt
  // für „fr". Epizän nach F10: „ton enseignant ou ton enseignante".
  if (sprache === "fr") {
    return {
      titel: "La suite : un exercice de ton enseignant ou ton enseignante.",
      absaetze: [],
    };
  }
  // ★ ES-O (27.09.2026): spanisch, tú (nur Kinder einer Klasse), „tu docente".
  if (sprache === "es") return { titel: "Ahora sigue un ejercicio de tu docente.", absaetze: [] };
  return {
    titel: isFormal(skin, anrede)
      ? "Weiter geht es mit einer Übung von Ihrer Lehrkraft."
      : "Weiter geht es mit einer Übung von deiner Lehrkraft.",
    absaetze: [],
  };
}

/**
 * „Die Lesezeile" - Erklärung beim ERSTEN Auftreten (E12, 20.09.2026).
 *
 * Testerin hat ein Bild vom Lückentext „Was fehlt hier?" geschickt: Bei grosser
 * Laufweite (CVI) lief die Frage über fünf Zeilen, und ihr Schüler verlor
 * beim Lesen die Zeile. Johannes, wörtlich: *„es wird nur eine 'Lesezeile'
 * hell und das eingabefeld. mit Pfeil ab kann man von zeile zu zeile springen
 * mit Pfeil auf wieder hinauf"* - und: *„dafür brauchen wir eine Erklärung
 * und ein kleines Popup"*.
 *
 * Kommt GENAU EINMAL, wenn die Lesezeile auf diesem Gerät zum ersten Mal
 * auftritt (Merker in `merkfenster.ts`: `lesezeileGesehen`/
 * `merkeLesezeileGesehen`) - dieselbe Bauart wie der Grossschreibungs-Hinweis
 * darüber: kein Haken, danach nie wieder.
 *
 * ★ KEIN `skin`-Parameter: Anders als die anderen Fenster braucht dieser Satz
 * keinen Tonfall-Unterschied zwischen Kind/Jugend/Erwachsen (es beschreibt
 * eine Bedienung, kein Lob und keine Regel) - nur die ANREDE ändert sich
 * (`isFormal` bräuchte dafür `skin`, den `RaetselLauf.tsx` nicht mitführt;
 * „Sie" gilt hier daher an der Rolle allein, wie `zeitLassenVonLehrkraftAn`
 * in `TypingSettings.tsx` es schon so hält).
 */
export function lesezeileFenster(
  anrede: Anrede = "du",
  sprache: BedienSprache = "de",
): Fenstertext {
  const fremd = LESEZEILE_FREMD[sprache];
  if (fremd) return fremd(anrede);
  return {
    titel: "Die Lesezeile",
    absaetze:
      anrede === "Sie"
        ? [
            "Wenn eine Frage über mehrere Zeilen umbricht, bleibt nur eine Zeile hell - die anderen sind verdunkelt, damit die Zeile nicht verloren geht.",
            "Mit Pfeil nach unten geht es eine Zeile weiter, mit Pfeil nach oben eine zurück. Das Eingabefeld bleibt dabei immer hell.",
          ]
        : [
            "Wenn eine Frage über mehrere Zeilen umbricht, bleibt nur eine Zeile hell - die anderen sind verdunkelt, damit du die Zeile nicht verlierst.",
            "Mit Pfeil ab kommst du zur nächsten Zeile, mit Pfeil auf zurück. Dein Eingabefeld bleibt dabei immer hell.",
          ],
  };
}

/**
 * Die Lesezeile französisch (E11a-5) - « ligne de lecture » und « flèche bas »/
 * « flèche haut » wie im Zahnrad (`TypingSettings.tsx`). « vous » an der Rolle
 * allein, wie im Deutschen.
 */
function lesezeileFensterEn(): Fenstertext {
  return {
    titel: "The reading line",
    absaetze: [
      "When a question wraps over several lines, only one line stays bright and the rest is dimmed - so the line is easier to keep.",
      "The Down arrow key moves to the next line, the Up arrow key back to the previous one. The answer field always stays bright.",
    ],
  };
}

/** ★ O2-LIB (29.10.2026): die Lesezeile, Portugiesisch (Brasilien) - você an der Rolle allein, für alle gleich. */
function lesezeileFensterBr(): Fenstertext {
  return {
    titel: "A linha de leitura",
    absaetze: [
      "Quando uma pergunta ocupa várias linhas, só uma linha fica clara e as outras ficam escurecidas - assim a linha não se perde.",
      "A seta para baixo vai para a próxima linha e a seta para cima volta para a anterior. O campo de resposta sempre fica claro.",
    ],
  };
}

const LESEZEILE_FREMD: Record<BedienSprache, ((anrede: Anrede) => Fenstertext) | null> = {
  de: null,
  en: lesezeileFensterEn,
  // ★ ES-O (27.09.2026): spanisch - usted an der Rolle allein, wie im Deutschen.
  es: (anrede) => ({
    titel: "La línea de lectura",
    absaetze:
      anrede === "Sie"
        ? [
            "Cuando una pregunta ocupa varias líneas, solo una línea se queda clara - las demás se oscurecen para que la línea no se pierda.",
            "La flecha abajo pasa a la línea siguiente, la flecha arriba vuelve a la anterior. El campo de respuesta siempre se queda claro.",
          ]
        : [
            "Cuando una pregunta ocupa varias líneas, solo una línea se queda clara - las demás se oscurecen para que no pierdas la línea.",
            "Con la flecha abajo pasas a la línea siguiente, con la flecha arriba vuelves atrás. Tu campo de respuesta siempre se queda claro.",
          ],
  }),
  fr: (anrede) => ({
    titel: "La ligne de lecture",
    absaetze:
      anrede === "Sie"
        ? [
            "Quand une question passe sur plusieurs lignes, une seule ligne reste claire - les autres sont assombries pour que la ligne ne se perde pas.",
            "La flèche bas passe à la ligne suivante, la flèche haut revient à la précédente. Le champ de réponse reste toujours clair.",
          ]
        : [
            "Quand une question passe sur plusieurs lignes, une seule ligne reste claire - les autres sont assombries pour que tu ne perdes pas la ligne.",
            "Avec la flèche bas, tu passes à la ligne suivante, avec la flèche haut, tu reviens en arrière. Ton champ de réponse reste toujours clair.",
          ],
  }),
  // ★ O-IT (02.10.2026): italienisch - „Sie" neutral, sonst „tu".
  it: (anrede) => ({
    titel: "La riga di lettura",
    absaetze:
      anrede === "Sie"
        ? [
            "Quando una domanda va su più righe, resta chiara una sola riga - le altre sono scurite, così la riga non si perde.",
            "La freccia giù passa alla riga successiva, la freccia su torna a quella precedente. Il campo di risposta resta sempre chiaro.",
          ]
        : [
            "Quando una domanda va su più righe, resta chiara una sola riga - le altre sono scurite, così non perdi la riga.",
            "Con la freccia giù passi alla riga successiva, con la freccia su torni indietro. Il tuo campo di risposta resta sempre chiaro.",
          ],
  }),
  // ★ O-PL (02.10.2026): „wiersz do czytania"; Lehrkraft unpersönlich, sonst „ty".
  pl: (anrede) => ({
    titel: "Wiersz do czytania",
    absaetze:
      anrede === "Sie"
        ? [
            "Gdy pytanie zajmuje kilka wierszy, jasny zostaje tylko jeden wiersz - pozostałe są przyciemnione, żeby wiersz się nie zgubił.",
            "Strzałka w dół przechodzi do następnego wiersza, strzałka w górę wraca do poprzedniego. Pole odpowiedzi zawsze zostaje jasne.",
          ]
        : [
            "Gdy pytanie zajmuje kilka wierszy, jasny zostaje tylko jeden wiersz - pozostałe są przyciemnione, żeby wiersz ci się nie zgubił.",
            "Strzałką w dół przechodzisz do następnego wiersza, strzałką w górę wracasz. Twoje pole odpowiedzi zawsze zostaje jasne.",
          ],
  }),
  // ★ O-TR (02.10.2026): "okuma satırı"; Lehrkraft ohne Anrede, sonst "sen";
  // Pfeiltasten "aşağı ok / yukarı ok" (Glossar §2.9).
  tr: (anrede) => ({
    titel: "Okuma satırı",
    absaetze:
      anrede === "Sie"
        ? [
            "Bir soru birkaç satıra yayıldığında yalnızca bir satır aydınlık kalır - satır kaybolmasın diye diğerleri karartılır.",
            "Aşağı ok tuşu bir sonraki satıra, yukarı ok tuşu bir önceki satıra geçer. Cevap alanı her zaman aydınlık kalır.",
          ]
        : [
            "Bir soru birkaç satıra yayıldığında yalnızca bir satır aydınlık kalır - satırı kaybetmeyesin diye diğerleri karartılır.",
            "Aşağı ok tuşuyla bir sonraki satıra geçersin, yukarı ok tuşuyla geri dönersin. Cevap alanın her zaman aydınlık kalır.",
          ],
  }),
  // ★ O-CS (03.10.2026): „Čtecí řádek"; Lehrkraft mit „se", sonst ty ohne
  // Vergangenheit („aby se ti řádek neztratil"); „šipka dolů/nahoru" (§2.9).
  cs: (anrede) => ({
    titel: "Čtecí řádek",
    absaetze:
      anrede === "Sie"
        ? [
            "Když se otázka zalomí na několik řádků, zůstane světlý jen jeden řádek - ostatní jsou ztmavené, aby se řádek neztratil.",
            "Šipkou dolů se přejde na další řádek, šipkou nahoru zpět. Pole pro odpověď zůstává vždy světlé.",
          ]
        : [
            "Když se otázka zalomí na několik řádků, zůstane světlý jen jeden řádek - ostatní jsou ztmavené, aby se ti řádek neztratil.",
            "Šipkou dolů přejdeš na další řádek, šipkou nahoru zpět. Tvoje pole pro odpověď zůstává vždy světlé.",
          ],
  }),
  // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: (anrede) => ({
    titel: "Ред за четене",
    absaetze:
      anrede === "Sie"
        ? [
            "Когато въпрос се пренася на няколко реда, остава светъл само един ред - останалите са затъмнени, за да не се губи редът.",
            "Със стрелката надолу се преминава към следващия ред, със стрелката нагоре - обратно към предишния. Полето за отговор винаги остава светло.",
          ]
        : [
            "Когато въпрос се пренася на няколко реда, остава светъл само един ред - останалите са затъмнени, за да не ти се губи редът.",
            "Със стрелката надолу преминаваш към следващия ред, със стрелката нагоре - обратно към предишния. Твоето поле за отговор винаги остава светло.",
          ],
  }),
  el: (anrede) => ({
    titel: "Η γραμμή ανάγνωσης",
    absaetze:
      anrede === "Sie"
        ? [
            "Όταν μια ερώτηση απλώνεται σε πολλές γραμμές, μένει φωτεινή μόνο μία γραμμή - οι υπόλοιπες σκουραίνουν, ώστε να μη χάνεται η γραμμή.",
            "Με το πλήκτρο Κάτω βέλος περνάτε στην επόμενη γραμμή, με το πλήκτρο Επάνω βέλος πίσω στην προηγούμενη. Το πεδίο απάντησης μένει πάντα φωτεινό.",
          ]
        : [
            "Όταν μια ερώτηση απλώνεται σε πολλές γραμμές, μένει φωτεινή μόνο μία γραμμή - οι υπόλοιπες σκουραίνουν, ώστε να μη χάνεις τη γραμμή.",
            "Με το πλήκτρο Κάτω βέλος πηγαίνεις στην επόμενη γραμμή, με το πλήκτρο Επάνω βέλος πίσω στην προηγούμενη. Το πεδίο απάντησής σου μένει πάντα φωτεινό.",
          ],
  }),
  hu: (anrede) => ({
    titel: "Olvasósor",
    absaetze:
      anrede === "Sie"
        ? [
            "Ha egy kérdés több sorba tördelődik, csak egy sor marad világos - a többi elsötétül, hogy a sor ne vesszen el.",
            "A le nyíl billentyűvel a következő sorra lehet lépni, a fel nyíl billentyűvel vissza az előzőre. A válasz mezője mindig világos marad.",
          ]
        : [
            "Ha egy kérdés több sorba tördelődik, csak egy sor marad világos - a többi elsötétül, hogy ne veszítsd el a sort.",
            "A le nyíl billentyűvel a következő sorra lépsz, a fel nyíl billentyűvel vissza az előzőre. A válaszmeződ mindig világos marad.",
          ],
  }),
  nl: () => ({
    titel: "De leesstrook",
    absaetze: [
      "Loopt een vraag over meerdere regels, dan blijft er maar één regel licht - de rest wordt donker, zodat je de regel niet kwijtraakt.",
      "Met pijl omlaag ga je naar de volgende regel, met pijl omhoog terug naar de vorige. Het antwoordveld blijft altijd licht.",
    ],
  }),
  pt: (anrede) => ({
    titel: "A linha de leitura",
    absaetze:
      anrede === "Sie"
        ? [
            "Quando uma pergunta ocupa várias linhas, só uma linha fica clara - as outras ficam escurecidas, para que a linha não se perca.",
            "A tecla de seta para baixo passa para a linha seguinte, a tecla de seta para cima volta à anterior. O campo de resposta fica sempre claro.",
          ]
        : [
            "Quando uma pergunta ocupa várias linhas, só uma linha fica clara - as outras ficam escurecidas, para que não percas a linha.",
            "A tecla de seta para baixo leva-te à linha seguinte, a tecla de seta para cima volta à anterior. O teu campo de resposta fica sempre claro.",
          ],
  }),
  br: lesezeileFensterBr,
  ro: (anrede) => ({
    titel: "Rândul de citire",
    absaetze:
      anrede === "Sie"
        ? [
            "Când o întrebare se întinde pe mai multe rânduri, rămâne luminos un singur rând - celelalte sunt întunecate, ca rândul să nu se piardă.",
            "Cu tasta săgeată în jos se trece la rândul următor, cu tasta săgeată în sus înapoi. Câmpul pentru răspuns rămâne mereu luminos.",
          ]
        : [
            "Când o întrebare se întinde pe mai multe rânduri, rămâne luminos un singur rând - celelalte sunt întunecate, ca să nu-ți piardă rândul.",
            "Cu tasta săgeată în jos treci la rândul următor, cu tasta săgeată în sus te întorci. Câmpul tău pentru răspuns rămâne mereu luminos.",
          ],
  }),
  sv: () => ({
    titel: "Läsraden",
    absaetze: [
      "När en fråga går över flera rader är bara en rad ljus och resten tonas ned - så att du inte tappar bort raden.",
      "Med Nedåtpil går du till nästa rad, med Uppåtpil tillbaka till föregående. Svarsfältet är alltid ljust.",
    ],
  }),
  uk: (anrede) => ({
    titel: "Рядок читання",
    absaetze:
      anrede === "Sie"
        ? [
            "Коли питання займає кілька рядків, світлим залишається лише один рядок - решта затемнюється, щоб рядок не загубився.",
            "Стрілка вниз переводить на наступний рядок, стрілка вгору - назад. Поле для відповіді завжди залишається світлим.",
          ]
        : [
            "Коли питання займає кілька рядків, світлим залишається лише один рядок - решта затемнюється, щоб рядок не загубився.",
            "Стрілка вниз переводить на наступний рядок, стрілка вгору - назад. Твоє поле для відповіді завжди залишається світлим.",
          ],
  }),
};

/**
 * Die Bitte um eine echte Tastatur (Auftrag Johannes, 20.09.2026, wörtlich:
 * *„bitte eine tastatur anschließen, sonst versuchen menschen am
 * touchbildschirm des iPads zu schreiben"*).
 *
 * Kommt GENAU EINMAL JE GERÄT, wie die Grossschreibung und die Lesezeile -
 * UND verschwindet zusätzlich von selbst beim ersten echten Tastendruck
 * (`geraeteHinweis.ts`, `istEchteTastatureingabe`, Merker in
 * `merkfenster.ts`: `tastaturHinweisGesehen`/`merkeTastaturHinweisGesehen`).
 *
 * ★ SIE BITTET, SIE BEHAUPTET NICHT: Ein Tablet MIT angeschlossener Tastatur
 * sieht für die Erkennung genauso aus wie eines ohne (Dateikopf
 * `geraeteHinweis.ts`) - der Satz darf darum nie „es fehlt eine Tastatur"
 * sagen, nur „damit lernst du es richtig". Sie sperrt nichts: Wer keine
 * Tastatur hat, übt trotzdem weiter.
 *
 * ★ KEIN `skin`-Parameter, wie bei `lesezeileFenster`: Der Satz beschreibt
 * eine Bedienungs-Voraussetzung, kein Lob und keine Regel - nur die ANREDE
 * ändert sich.
 */
export function tastaturHinweisFenster(
  anrede: Anrede = "du",
  sprache: BedienSprache = "de",
): Fenstertext {
  const fremd = TASTATUR_FREMD[sprache];
  if (fremd) return fremd(anrede);
  return {
    titel: "Tastatur anschließen?",
    absaetze:
      anrede === "Sie"
        ? [
            "Tastenflow bringt das Zehnfingersystem auf einer echten Tastatur bei - jeder Finger lernt seinen eigenen Platz.",
            "Ohne Tastatur kann trotzdem weiter geübt werden - auf der Bildschirmtastatur wird aber etwas anderes geübt als das Zehnfingersystem.",
          ]
        : [
            "Tastenflow bringt dir das Zehnfingersystem auf einer echten Tastatur bei - jeder Finger lernt seinen eigenen Platz.",
            "Ohne Tastatur kannst du trotzdem weiter üben - auf der Bildschirmtastatur übst du dann aber etwas anderes als das Zehnfingersystem.",
          ],
  };
}

/**
 * Die Bitte um eine Tastatur französisch (E11a-5) - sie bittet, sie behauptet
 * nicht (siehe oben), und sie sperrt nichts. « la frappe à dix doigts » für
 * das Zehnfingersystem.
 */
function tastaturFensterEn(): Fenstertext {
  return {
    titel: "Connect a keyboard?",
    absaetze: [
      "Tastenflow teaches ten-finger typing on a real keyboard - each finger learns its own place.",
      "Without a keyboard you can still keep practising, but typing on the screen keyboard is a different skill.",
    ],
  };
}

/** ★ O2-LIB (29.10.2026): die Bitte um eine Tastatur, Portugiesisch (Brasilien) - sie bittet, sie sperrt nichts. */
function tastaturFensterBr(): Fenstertext {
  return {
    titel: "Conectar um teclado?",
    absaetze: [
      "O Tastenflow ensina a digitar com os dez dedos em um teclado de verdade - cada dedo aprende o seu lugar.",
      "Sem teclado você pode continuar praticando, mas digitar no teclado da tela é outra habilidade.",
    ],
  };
}

const TASTATUR_FREMD: Record<BedienSprache, ((anrede: Anrede) => Fenstertext) | null> = {
  de: null,
  en: tastaturFensterEn,
  // ★ ES-O (27.09.2026): spanisch - bittet, behauptet nicht, sperrt nichts.
  es: (anrede) => ({
    titel: "¿Conectar un teclado?",
    absaetze:
      anrede === "Sie"
        ? [
            "Tastenflow enseña a escribir con diez dedos en un teclado de verdad - cada dedo aprende su propio sitio.",
            "Sin teclado se puede seguir practicando igualmente - pero en el teclado de la pantalla se practica otra cosa distinta de la escritura con diez dedos.",
          ]
        : [
            "Tastenflow te enseña a escribir con diez dedos en un teclado de verdad - cada dedo aprende su propio sitio.",
            "Sin teclado puedes seguir practicando igualmente - pero en el teclado de la pantalla practicas otra cosa distinta de la escritura con diez dedos.",
          ],
  }),
  fr: (anrede) => ({
    titel: "Brancher un clavier ?",
    absaetze:
      anrede === "Sie"
        ? [
            "Tastenflow enseigne la frappe à dix doigts sur un vrai clavier - chaque doigt apprend sa propre place.",
            "Sans clavier, on peut quand même continuer à s'exercer - mais sur le clavier de l'écran, on exerce autre chose que la frappe à dix doigts.",
          ]
        : [
            "Tastenflow t'apprend la frappe à dix doigts sur un vrai clavier - chaque doigt apprend sa propre place.",
            "Sans clavier, tu peux quand même continuer à t'exercer - mais sur le clavier de l'écran, tu exerces autre chose que la frappe à dix doigts.",
          ],
  }),
  // ★ O-IT (02.10.2026): bittet, behauptet nicht, sperrt nichts.
  it: (anrede) => ({
    titel: "Collegare una tastiera?",
    absaetze:
      anrede === "Sie"
        ? [
            "Tastenflow insegna la dattilografia a dieci dita su una tastiera vera - ogni dito impara il suo posto.",
            "Senza tastiera si può continuare a esercitarsi lo stesso - ma sulla tastiera dello schermo si esercita una cosa diversa dalla dattilografia a dieci dita.",
          ]
        : [
            "Tastenflow ti insegna la dattilografia a dieci dita su una tastiera vera - ogni dito impara il suo posto.",
            "Senza tastiera puoi continuare a esercitarti lo stesso - ma sulla tastiera dello schermo eserciti una cosa diversa dalla dattilografia a dieci dita.",
          ],
  }),
  // ★ O-PL (02.10.2026): bittet, behauptet nicht, sperrt nichts; „program
  // Tastenflow" (fremder Name mit beugbarem Nomen davor, Glossar Regel 11).
  pl: (anrede) => ({
    titel: "Podłączyć klawiaturę?",
    absaetze:
      anrede === "Sie"
        ? [
            "Program Tastenflow uczy pisania dziesięcioma palcami na prawdziwej klawiaturze - każdy palec poznaje swoje miejsce.",
            "Bez klawiatury można ćwiczyć dalej - ale na klawiaturze ekranowej ćwiczy się coś innego niż pisanie dziesięcioma palcami.",
          ]
        : [
            "Program Tastenflow uczy cię pisania dziesięcioma palcami na prawdziwej klawiaturze - każdy palec poznaje swoje miejsce.",
            "Bez klawiatury też możesz ćwiczyć dalej - ale na klawiaturze ekranowej ćwiczysz wtedy coś innego niż pisanie dziesięcioma palcami.",
          ],
  }),
  // ★ O-TR (02.10.2026): bittet, behauptet nicht, sperrt nichts; "Tastenflow
  // ile" (Name ohne Endung, Glossar Regel 6), "on parmak klavye" (Regel 4).
  tr: (anrede) => ({
    titel: "Klavye bağlansın mı?",
    absaetze:
      anrede === "Sie"
        ? [
            "Tastenflow ile on parmak klavye gerçek bir klavyede öğrenilir - her parmak kendi yerini öğrenir.",
            "Klavye olmadan da çalışmaya devam edilebilir - ama ekran klavyesinde on parmak klavyeden farklı bir şey çalışılır.",
          ]
        : [
            "Tastenflow ile on parmak klavyeyi gerçek bir klavyede öğrenirsin - her parmak kendi yerini öğrenir.",
            "Klavye olmadan da çalışmaya devam edebilirsin - ama ekran klavyesinde on parmak klavyeden farklı bir şey çalışırsın.",
          ],
  }),
  // ★ O-CS (03.10.2026): bittet, behauptet nicht, sperrt nichts; „aplikace
  // Tastenflow" (Name mit Kopfwort, Glossar Regel 12), „psaní všemi deseti" (Regel 4).
  cs: (anrede) => ({
    titel: "Připojit klávesnici?",
    absaetze:
      anrede === "Sie"
        ? [
            "Aplikace Tastenflow učí psaní všemi deseti na skutečné klávesnici - každý prst se naučí své vlastní místo.",
            "I bez klávesnice se dá cvičit dál - na klávesnici na obrazovce se ale cvičí něco jiného než psaní všemi deseti.",
          ]
        : [
            "Aplikace Tastenflow tě naučí psát všemi deseti na skutečné klávesnici - každý prst se naučí své vlastní místo.",
            "I bez klávesnice můžeš cvičit dál - na klávesnici na obrazovce ale cvičíš něco jiného než psaní všemi deseti.",
          ],
  }),
  // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: (anrede) => ({
    titel: "Свързване на клавиатура?",
    absaetze:
      anrede === "Sie"
        ? [
            "Tastenflow учи на писане с десет пръста на истинска клавиатура - всеки пръст научава собственото си място.",
            "И без клавиатура може да се упражнявате по-нататък, но на екранната клавиатура се упражнява нещо различно от писането с десет пръста.",
          ]
        : [
            "Tastenflow ще те научи да пишеш с десет пръста на истинска клавиатура - всеки пръст научава собственото си място.",
            "И без клавиатура можеш да продължиш да упражняваш, но на екранната клавиатура упражняваш нещо различно от писането с десет пръста.",
          ],
  }),
  el: (anrede) => ({
    titel: "Σύνδεση πληκτρολογίου;",
    absaetze:
      anrede === "Sie"
        ? [
            "Το Tastenflow διδάσκει δακτυλογράφηση με δέκα δάχτυλα σε πραγματικό πληκτρολόγιο - κάθε δάχτυλο μαθαίνει τη δική του θέση.",
            "Και χωρίς πληκτρολόγιο μπορείτε να συνεχίσετε την εξάσκηση - στο πληκτρολόγιο οθόνης όμως εξασκείται κάτι διαφορετικό από τη δακτυλογράφηση με δέκα δάχτυλα.",
          ]
        : [
            "Το Tastenflow διδάσκει δακτυλογράφηση με δέκα δάχτυλα σε πραγματικό πληκτρολόγιο - κάθε δάχτυλο μαθαίνει τη δική του θέση.",
            "Και χωρίς πληκτρολόγιο μπορείς να συνεχίσεις την εξάσκηση - στο πληκτρολόγιο οθόνης όμως εξασκείς κάτι διαφορετικό από τη δακτυλογράφηση με δέκα δάχτυλα.",
          ],
  }),
  hu: (anrede) => ({
    titel: "Billentyűzet csatlakoztatása?",
    absaetze:
      anrede === "Sie"
        ? [
            "A Tastenflow tízujjas gépelést tanít valódi billentyűzeten - minden ujj megtanulja a saját helyét.",
            "Billentyűzet nélkül is lehet tovább gyakorolni - de a képernyő-billentyűzeten más készséget gyakorol az ember, mint a tízujjas gépelés.",
          ]
        : [
            "A Tastenflow valódi billentyűzeten tanít tízujjas gépelésre - minden ujj megtanulja a saját helyét.",
            "Billentyűzet nélkül is gyakorolhatsz tovább - de a képernyő-billentyűzeten más dolgot gyakorolsz, mint a tízujjas gépelést.",
          ],
  }),
  nl: () => ({
    titel: "Een toetsenbord aansluiten?",
    absaetze: [
      "Tastenflow leert je typen met tien vingers op een echt toetsenbord - elke vinger leert zijn eigen plek.",
      "Zonder toetsenbord kun je gewoon verder oefenen, maar typen op het schermtoetsenbord is iets anders dan typen met tien vingers.",
    ],
  }),
  pt: (anrede) => ({
    titel: "Ligar um teclado?",
    absaetze:
      anrede === "Sie"
        ? [
            "O Tastenflow ensina a escrever com os dez dedos num teclado a sério - cada dedo aprende o seu lugar.",
            "Sem teclado também se pode continuar a praticar - mas com o teclado no ecrã pratica-se outra coisa que não a escrita com os dez dedos.",
          ]
        : [
            "O Tastenflow ensina-te a escrever com os dez dedos num teclado a sério - cada dedo aprende o seu lugar.",
            "Sem teclado podes continuar a praticar na mesma - mas com o teclado no ecrã praticas outra coisa que não a escrita com os dez dedos.",
          ],
  }),
  br: tastaturFensterBr,
  ro: (anrede) => ({
    titel: anrede === "Sie" ? "Conectați o tastatură?" : "Conectezi o tastatură?",
    absaetze:
      anrede === "Sie"
        ? [
            "Tastenflow vă învață să scrieți cu zece degete pe o tastatură adevărată - fiecare deget își învață propriul loc.",
            "Puteți exersa în continuare și fără tastatură - dar pe tastatura de pe ecran se exersează altceva decât scrierea cu zece degete.",
          ]
        : [
            "Tastenflow te învață să scrii cu zece degete pe o tastatură adevărată - fiecare deget își învață propriul loc.",
            "Poți exersa în continuare și fără tastatură - dar pe tastatura de pe ecran exersezi altceva decât scrierea cu zece degete.",
          ],
  }),
  sv: () => ({
    titel: "Anslut ett tangentbord?",
    absaetze: [
      "Tastenflow lär dig skriva med alla tio fingrar på ett riktigt tangentbord - varje finger lär sig sin egen plats.",
      "Utan tangentbord kan du öva ändå, men att skriva på skärmtangentbordet är något annat än att skriva med tio fingrar.",
    ],
  }),
  uk: (anrede) => ({
    titel: "Підключити клавіатуру?",
    absaetze:
      anrede === "Sie"
        ? [
            "Tastenflow вчить друкувати десятьма пальцями на справжній клавіатурі - кожен палець вивчає своє місце.",
            "Без клавіатури можна тренуватися й далі, але на екранній клавіатурі тренується щось інше, ніж десятипальцевий друк.",
          ]
        : [
            "Tastenflow навчить тебе друкувати десятьма пальцями на справжній клавіатурі - кожен палець вивчає своє місце.",
            "Без клавіатури можеш тренуватися й далі, але на екранній клавіатурі тренується щось інше, ніж десятипальцевий друк.",
          ],
  }),
};
