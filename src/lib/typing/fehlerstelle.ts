/**
 * WO GENAU DER FEHLER SITZT - die Ansage, die einem Kind die Stelle nennt.
 *
 * ★★★★★ Johannes am 02.09.2026: *„Kannst du bei den Fehlern die Stimme hoch
 * machen, dass du buchstabierst und die vertauschten Buchstaben hoch sprichst?
 * Macht das Sinn?"* - Ja, und die App macht es für Großbuchstaben längst
 * (`GROSS_PITCH`, Testerin Wunsch vom 28.08.2026, so wie JAWS es tut).
 *
 * ⚠️ ABER: **Eine Äußerung hat genau eine Tonhöhe.** Die Vorlese-Schicht fasst
 * eine Lese-Reihe bewusst zu EINER Äußerung zusammen, weil mehrere in der
 * Warteschlange auf WebKit/iPad unzuverlässig sind - nach einem `cancel`
 * verschluckt die Engine sie (siehe `voice.ts`, Kommentar zu `GROSS_PITCH`).
 * „H-u-a-s" mit einem hohen „u" bräuchte vier getrennte Äußerungen, also genau
 * die Bauart, die auf dem iPad aussetzt. Dazu kommt: Systemstimmen setzen
 * `pitch` unterschiedlich stark um.
 *
 * ⇒ **Die Information trägt das WORT, die Tonhöhe ist die Zugabe.** Die Ansage
 * nennt die Stelle in Worten und spricht die beiden Buchstaben EINZELN - und
 * nur ein allein gesprochener Buchstabe bekommt seine eigene Tonhöhe:
 *
 * ```
 *   „Dritter Buchstabe: u.  Richtig wäre a."
 *                       ↑ hoch            ↑ hoch
 * ```
 *
 * Wer die Tonhöhe nicht hört, versteht den Satz trotzdem vollständig.
 *
 * ★★ Nie etwas gegen ein Kind: Die Ansage sagt, WO es hakt - sie bewertet
 * nicht. Kein „falsch", kein „leider". Wer die Stelle kennt, kann sie beheben.
 */
import type { Lang } from "./account";

/**
 * Die Fundstelle: an welcher Stelle sich Eingabe und Lösung zuerst
 * unterscheiden, und welche zwei Zeichen dort stehen.
 *
 * `null`, wenn es keine sinnvolle EINE Stelle gibt - dann ist die Eingabe
 * etwas ganz anderes, und eine Buchstabenstelle zu nennen wäre irreführend.
 */
export interface Fehlerstelle {
  /** 1-basiert, wie ein Kind zählt. */
  stelle: number;
  /** Was das Kind geschrieben hat (leer, wenn dort nichts mehr stand). */
  getippt: string;
  /** Was dort hingehört (leer, wenn das Wort dort schon zu Ende war). */
  richtig: string;
}

/** An wie vielen Stellen sich zwei Wörter unterscheiden (Längenunterschied zählt mit). */
function unterschiede(a: readonly string[], b: readonly string[]): number {
  let n = Math.abs(a.length - b.length);
  const kurz = Math.min(a.length, b.length);
  for (let i = 0; i < kurz; i += 1) if (a[i] !== b[i]) n += 1;
  return n;
}

/**
 * Sind genau zwei NEBENEINANDERLIEGENDE Zeichen vertauscht? („Huas" / „Haus")
 *
 * ★★★★ Warum diese Frage eine eigene Funktion verdient: Eine Vertauschung
 * ergibt ZWEI Unterschiede - genauso viele wie „Baum" gegen „Haus". Eine
 * Grenze, die nur zählt, kann beides nicht auseinanderhalten und würde bei
 * „Baum" eine Buchstabenstelle nennen, die gar nichts erklärt. Die
 * Vertauschung ist aber genau der Fehler, um den es Johannes ging - sie muss
 * durch, „Baum" nicht.
 */
export function istVertauschung(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false;
  const abweichend: number[] = [];
  for (let i = 0; i < a.length; i += 1) if (a[i] !== b[i]) abweichend.push(i);
  if (abweichend.length !== 2) return false;
  const [i, j] = abweichend;
  return j === i + 1 && a[i] === b[j] && a[j] === b[i];
}

/**
 * Die erste abweichende Stelle - oder `null`, wenn die Ansage einer Stelle
 * nicht mehr weiterhilft.
 *
 * Durchgelassen wird: **ein** abweichendes Zeichen (das ist ein Vertipper)
 * oder eine **Vertauschung** zweier Nachbarn. Alles andere ist kein Vertipper,
 * sondern ein anderes Wort - dort ist die gewöhnliche Rückmeldung ehrlicher
 * als eine Stelle, die in die Irre führt.
 */
export function findeFehlerstelle(eingabe: string, richtig: string): Fehlerstelle | null {
  const e = [...eingabe.trim()];
  const r = [...richtig.trim()];
  if (e.length === 0) return null;
  if (e.join("") === r.join("")) return null;
  if (unterschiede(e, r) > 1 && !istVertauschung(e, r)) return null;

  let i = 0;
  while (i < e.length && i < r.length && e[i] === r[i]) i += 1;
  return { stelle: i + 1, getippt: e[i] ?? "", richtig: r[i] ?? "" };
}

const ORDNUNGSZAHL_DE = [
  "",
  "Erster",
  "Zweiter",
  "Dritter",
  "Vierter",
  "Fünfter",
  "Sechster",
  "Siebter",
  "Achter",
  "Neunter",
  "Zehnter",
];

const ORDNUNGSZAHL_EN = [
  "",
  "First",
  "Second",
  "Third",
  "Fourth",
  "Fifth",
  "Sixth",
  "Seventh",
  "Eighth",
  "Ninth",
  "Tenth",
];

/**
 * ★ E11a-5 (26.09.2026): die französischen Ordnungszahlen - weiblich
 * („la première lettre"), weil „lettre" weiblich ist.
 */
const ORDNUNGSZAHL_FR = [
  "",
  "Première",
  "Deuxième",
  "Troisième",
  "Quatrième",
  "Cinquième",
  "Sixième",
  "Septième",
  "Huitième",
  "Neuvième",
  "Dixième",
];

/**
 * ★ ES-O (27.09.2026): die spanischen Ordnungszahlen - weiblich („la primera
 * letra"), weil „letra" weiblich ist.
 */
const ORDNUNGSZAHL_ES = [
  "",
  "Primera",
  "Segunda",
  "Tercera",
  "Cuarta",
  "Quinta",
  "Sexta",
  "Séptima",
  "Octava",
  "Novena",
  "Décima",
];

/**
 * ★ O-IT (02.10.2026): die italienischen Ordnungszahlen - weiblich („la prima
 * lettera"), ausgeschrieben (Bauplan I9).
 */
const ORDNUNGSZAHL_IT = [
  "",
  "Prima",
  "Seconda",
  "Terza",
  "Quarta",
  "Quinta",
  "Sesta",
  "Settima",
  "Ottava",
  "Nona",
  "Decima",
];

/**
 * ★ O-PL (02.10.2026): die polnischen Ordnungszahlen - weiblich („druga
 * litera"), weil „litera" weiblich ist; dazu der Genitiv für „Brakuje ...
 * litery" (nach „brakuje" steht der Genitiv - eine Ordnungszahl wird hier nie
 * aus Ziffern gebildet, Glossar Regel 5).
 */
const ORDNUNGSZAHL_PL = [
  "",
  "Pierwsza",
  "Druga",
  "Trzecia",
  "Czwarta",
  "Piąta",
  "Szósta",
  "Siódma",
  "Ósma",
  "Dziewiąta",
  "Dziesiąta",
];
const ORDNUNGSZAHL_PL_GENITIV = [
  "",
  "pierwszej",
  "drugiej",
  "trzeciej",
  "czwartej",
  "piątej",
  "szóstej",
  "siódmej",
  "ósmej",
  "dziewiątej",
  "dziesiątej",
];

/**
 * ★ O-TR (02.10.2026): die türkischen Ordnungszahlen, AUSGESCHRIEBEN - nie
 * "3'üncü" (Endung an einer Zahl, Glossar Regel 6) und nie "3." (die Stimme
 * soll das Wort sprechen). Fertig gross geschrieben ("İkinci" mit İ), kein
 * toUpperCase (Glossar Regel 9).
 */
const ORDNUNGSZAHL_TR = [
  "",
  "Birinci",
  "İkinci",
  "Üçüncü",
  "Dördüncü",
  "Beşinci",
  "Altıncı",
  "Yedinci",
  "Sekizinci",
  "Dokuzuncu",
  "Onuncu",
];

/**
 * ★ O-CS (03.10.2026): die tschechische Ordnungszahl als ZIFFER MIT PUNKT
 * („3. písmeno", Glossar Regel 5) - die Stimme liest sie mitten im Satz als
 * „třetí". Sie steht nie am Satzende (§4 Falle 4): immer folgt „písmeno".
 * Die Liste geht bis zehn wie die anderen; ab elf zählt `stelle` selbst weiter
 * („14. písmeno") - mit Ziffern gibt es kein Wort, das ausgeht.
 */
const ORDNUNGSZAHL_CS = ["", "1.", "2.", "3.", "4.", "5.", "6.", "7.", "8.", "9.", "10."];

/**
 * ★★★ E11a-5 (26.09.2026, Leitfaden neue Sprache, Falle 30): EINE TABELLE je
 * Bedienungssprache statt der Ternären `lang === "en" ? … : …`. Die Ternären
 * lieferten für „fr" still DEUTSCH („Dritter Buchstabe: … Richtig wäre …") -
 * `tsc` sah es nicht (der Typ war schon breit), der Weichen-Zähler zählte es
 * nur als „en"-Weiche. Jetzt meldet `tsc` eine fehlende Sprache.
 *
 * Deutsch und Englisch sind Zeichen für Zeichen die Sätze von vorher - auch
 * das deutsche „Der vierter buchstabe fehlt." (Kleinschreibung und Endung aus
 * `toLowerCase()`), das hier bewusst NICHT mitrepariert ist: Es ist eine
 * eigene Frage an Johannes, dieser Umbau ändert nur Französisch.
 */
interface FehlerTexte {
  /** „Dritter Buchstabe" bzw. „Buchstabe 14". */
  stelle: (ordnung: string | null, stelle: number) => string;
  /** Der Kopf vor dem getippten Buchstaben („Dritter Buchstabe:"). */
  kopf: (name: string) => string;
  /** Die Eingabe war an dieser Stelle schon zu Ende. */
  fehlt: (name: string, ordnung: string | null, stelle: number) => string;
  /** Vor dem richtigen Buchstaben. */
  richtig: string;
  /** Dort gehört gar nichts mehr hin. */
  zuEnde: string;
}

/**
 * ★ O2-LIB (30.10.2026): die bulgarischen Ordnungszahlen - AUSGESCHRIEBEN und weiblich
 * („първа буква"), weil „буква" weiblich ist und die Sprachausgabe Ziffern mit Endung unsicher liest
 * (Glossar §4 Falle 8). Ab elf zählt `stelle` selbst weiter („Буква 14").
 */
const ORDNUNGSZAHL_BG = [
  "",
  "Първа",
  "Втора",
  "Трета",
  "Четвърта",
  "Пета",
  "Шеста",
  "Седма",
  "Осма",
  "Девета",
  "Десета",
];

/**
 * ★ O-EL-LIB (30.10.2026): die griechische Ordnungszahl als ZIFFER + Endung des Hauptworts
 * (Glossar Regel 5): «γράμμα» ist sächlich ⇒ «3ο γράμμα». Kein Punkt, keine Satzende-Falle.
 * Die Liste geht bis zehn wie die anderen; ab elf zählt `stelle` selbst weiter («14ο γράμμα»).
 */
const ORDNUNGSZAHL_EL = ["", "1ο", "2ο", "3ο", "4ο", "5ο", "6ο", "7ο", "8ο", "9ο", "10ο"];

/**
 * ★ O2-LIB (30.10.2026): die ungarische Ordnungszahl als ZIFFER MIT PUNKT („3. betű",
 * Glossar Regel 5) - sie steht nie am Satzende (§4 Falle 4): immer folgt „betű".
 * Ab elf zählt `stelle` selbst weiter - mit Ziffern geht kein Wort aus.
 */
const ORDNUNGSZAHL_HU = ["", "1.", "2.", "3.", "4.", "5.", "6.", "7.", "8.", "9.", "10."];

/** ★ O2-LIB (29.10.2026): Ordnungszahlen niederländisch (Wortform, groß am Satzanfang; Glossar nl §1 Regel 5). */
const ORDNUNGSZAHL_NL = [
  "",
  "Eerste",
  "Tweede",
  "Derde",
  "Vierde",
  "Vijfde",
  "Zesde",
  "Zevende",
  "Achtste",
  "Negende",
  "Tiende",
];

/**
 * ★ O-LIB (30.10.2026): a ordem em português - "letra" é feminino: Primeira letra, Segunda letra ...
 * Até dez; a partir de onze, `stelle` usa "Letra 14" (com algarismo, sem ordinal).
 */
const ORDNUNGSZAHL_PT = [
  "",
  "Primeira",
  "Segunda",
  "Terceira",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sétima",
  "Oitava",
  "Nona",
  "Décima",
];

/**
 * ★ O2-LIB (29.10.2026): die Ordnungszahl als Ziffer mit "ª" (weiblich, passend zu "letra"),
 * Portugiesisch (Brasilien). "ª" = U+00AA, kein Grad-Zeichen. Sie steht nie am Satzende:
 * immer folgt "letra".
 */
const ORDNUNGSZAHL_BR = ["", "1ª", "2ª", "3ª", "4ª", "5ª", "6ª", "7ª", "8ª", "9ª", "10ª"];

/**
 * ★ O2-LIB (29.10.2026): die rumänische Ordnungszahl als Wort („Prima literă“, „A doua literă“);
 * ab elf zählt `stelle` selbst weiter („Litera 14“) - mit Ziffern gibt es kein Wort, das ausgeht.
 */
const ORDNUNGSZAHL_RO = [
  "",
  "Prima",
  "A doua",
  "A treia",
  "A patra",
  "A cincea",
  "A șasea",
  "A șaptea",
  "A opta",
  "A noua",
  "A zecea",
];

/** ★ O2-LIB (30.10.2026): Ordnungszahlen schwedisch (Wortform, groß am Satzanfang; Glossar sv Regel 6: nie "2:a"). */
const ORDNUNGSZAHL_SV = [
  "",
  "Första",
  "Andra",
  "Tredje",
  "Fjärde",
  "Femte",
  "Sjätte",
  "Sjunde",
  "Åttonde",
  "Nionde",
  "Tionde",
];

/**
 * ★ O2-LIB (30.10.2026): die ukrainischen Ordnungszahlen, AUSGESCHRIEBEN (weiblich, passend zu „літера"; Glossar
 * Regel 5: nie „3-я", die Stimme soll das Wort sprechen), fertig gross geschrieben; dazu der Genitiv für
 * „Бракує … літери". Ab elf zählt `stelle` mit „Літера 14" weiter.
 */
const ORDNUNGSZAHL_UK = [
  "",
  "Перша",
  "Друга",
  "Третя",
  "Четверта",
  "П'ята",
  "Шоста",
  "Сьома",
  "Восьма",
  "Дев'ята",
  "Десята",
];

const ORDNUNGSZAHL_UK_GENITIV = [
  "",
  "першої",
  "другої",
  "третьої",
  "четвертої",
  "п'ятої",
  "шостої",
  "сьомої",
  "восьмої",
  "дев'ятої",
  "десятої",
];

const FEHLER_TEXTE: Record<Lang, { ordnung: readonly string[]; t: FehlerTexte }> = {
  de: {
    ordnung: ORDNUNGSZAHL_DE,
    t: {
      stelle: (o, n) => (o ? `${o} Buchstabe` : `Buchstabe ${n}`),
      kopf: (name) => `${name}:`,
      fehlt: (name) => `Der ${name.toLowerCase()} fehlt.`,
      richtig: "Richtig wäre",
      zuEnde: "Da ist das Wort schon zu Ende.",
    },
  },
  en: {
    ordnung: ORDNUNGSZAHL_EN,
    t: {
      stelle: (o, n) => (o ? `${o} letter` : `Letter ${n}`),
      kopf: (name) => `${name}:`,
      fehlt: (name) => `${name} is missing.`,
      richtig: "It should be",
      zuEnde: "The word ends before that.",
    },
  },
  // Französisch neu geschrieben: „Deuxième lettre : u. Ici, il faut a." -
  // gewöhnliches Leerzeichen vor „:" wie im übrigen französischen Code
  // (Bauplan F8). Neutral wie das Deutsche: sagt WO, nicht „faux".
  fr: {
    ordnung: ORDNUNGSZAHL_FR,
    t: {
      stelle: (o, n) => (o ? `${o} lettre` : `Lettre ${n}`),
      kopf: (name) => `${name} :`,
      fehlt: (_name, o, n) =>
        o ? `Il manque la ${o.toLowerCase()} lettre.` : `Il manque la lettre ${n}.`,
      richtig: "Ici, il faut",
      zuEnde: "Le mot s'arrête avant.",
    },
  },
  // ★ ES-O (27.09.2026): „Segunda letra: u. Aquí va a." - neutral wie das
  // Deutsche: sagt WO, nicht „mal".
  es: {
    ordnung: ORDNUNGSZAHL_ES,
    t: {
      stelle: (o, n) => (o ? `${o} letra` : `Letra ${n}`),
      kopf: (name) => `${name}:`,
      fehlt: (_name, o, n) => (o ? `Falta la ${o.toLowerCase()} letra.` : `Falta la letra ${n}.`),
      richtig: "Aquí va",
      zuEnde: "La palabra termina antes.",
    },
  },
  // ★ O-IT (02.10.2026): „Seconda lettera: u. Qui va a." - neutral, sagt WO,
  // nie „sbagliato" (Glossar §2.2).
  it: {
    ordnung: ORDNUNGSZAHL_IT,
    t: {
      stelle: (o, n) => (o ? `${o} lettera` : `Lettera ${n}`),
      kopf: (name) => `${name}:`,
      fehlt: (_name, o, n) => (o ? `Manca la ${o.toLowerCase()} lettera.` : `Manca la lettera ${n}.`),
      richtig: "Qui va",
      zuEnde: "La parola finisce prima.",
    },
  },
  // ★ O-PL (02.10.2026): „Druga litera: u. Tu powinno być: a." - neutral, sagt
  // WO, nie „źle" (Glossar §2.2).
  pl: {
    ordnung: ORDNUNGSZAHL_PL,
    t: {
      stelle: (o, n) => (o ? `${o} litera` : `Litera numer ${n}`),
      kopf: (name) => `${name}:`,
      fehlt: (_name, o, n) =>
        o ? `Brakuje ${ORDNUNGSZAHL_PL_GENITIV[n]} litery.` : `Brakuje litery numer ${n}.`,
      richtig: "Tu powinno być",
      zuEnde: "Tu słowo już się kończy.",
    },
  },
  // ★ O-TR (02.10.2026): "Üçüncü harf: u Doğrusu: a" - neutral, sagt WO, nie
  // "Yanlış" (Glossar §2.2); ab elf "Harf 14" (keine Endung an der Zahl).
  tr: {
    ordnung: ORDNUNGSZAHL_TR,
    t: {
      stelle: (o, n) => (o ? `${o} harf` : `Harf ${n}`),
      kopf: (name) => `${name}:`,
      fehlt: (name) => `${name} eksik.`,
      richtig: "Doğrusu:",
      zuEnde: "Kelime burada zaten bitiyor.",
    },
  },
  // ★ O-CS (03.10.2026): „3. písmeno: u Správně: a" - neutral, sagt WO, nie
  // „špatně" (Glossar §2.2); die Ordnungszahl steht mitten im Satz, nie am Ende
  // (§4 Falle 4). Kein Komma vor „Správně": die Stücke werden im gemischten
  // Fall mit Leerzeichen verbunden („u , správně"), darum wie de/tr ohne.
  cs: {
    ordnung: ORDNUNGSZAHL_CS,
    t: {
      stelle: (_o, n) => `${n}. písmeno`,
      kopf: (name) => `${name}:`,
      fehlt: (_name, _o, n) => `Chybí ${n}. písmeno.`,
      richtig: "Správně:",
      zuEnde: "Tady už slovo končí.",
    },
  },
  // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: {
    ordnung: ORDNUNGSZAHL_BG,
    t: {
      stelle: (o, n) => (o ? `${o} буква` : `Буква ${n}`),
      kopf: (name) => `${name}:`,
      fehlt: (name) => `${name} липсва.`,
      richtig: "Правилно е:",
      zuEnde: "Тук думата вече свършва.",
    },
  },
  el: {
    ordnung: ORDNUNGSZAHL_EL,
    t: {
      stelle: (_o, n) => `${n}ο γράμμα`,
      kopf: (name) => `${name}:`,
      fehlt: (_name, _o, n) => `Λείπει το ${n}ο γράμμα.`,
      richtig: "Σωστό:",
      zuEnde: "Εδώ η λέξη τελειώνει ήδη.",
    },
  },
  hu: {
    ordnung: ORDNUNGSZAHL_HU,
    t: {
      stelle: (_o, n) => `${n}. betű`,
      kopf: (name) => `${name}:`,
      fehlt: (_name, _o, n) => `Hiányzik: ${n}. betű.`,
      richtig: "Helyesen:",
      zuEnde: "Itt a szó már véget ér.",
    },
  },
  nl: {
    ordnung: ORDNUNGSZAHL_NL,
    t: {
      stelle: (o, n) => (o ? `${o} letter` : `Letter ${n}`),
      kopf: (name) => `${name}:`,
      fehlt: (name) => `${name} ontbreekt.`,
      richtig: "Het moet zijn",
      zuEnde: "Daar is het woord al afgelopen.",
    },
  },
  pt: {
    ordnung: ORDNUNGSZAHL_PT,
    t: {
      stelle: (o, n) => (o ? `${o} letra` : `Letra ${n}`),
      kopf: (name) => `${name}:`,
      fehlt: (name) => `Falta a ${name.toLowerCase()}.`,
      richtig: "O correto seria",
      zuEnde: "Aqui a palavra já acabou.",
    },
  },
  br: {
    ordnung: ORDNUNGSZAHL_BR,
    t: {
      stelle: (_o, n) => `${n}ª letra`,
      kopf: (name) => `${name}:`,
      fehlt: (_name, _o, n) => `Está faltando a ${n}ª letra.`,
      richtig: "O correto seria",
      zuEnde: "Aí a palavra já terminou.",
    },
  },
  ro: {
    ordnung: ORDNUNGSZAHL_RO,
    t: {
      stelle: (o, n) => (o ? `${o} literă` : `Litera ${n}`),
      kopf: (name) => `${name}:`,
      fehlt: (name) => `Lipsește ${name.toLowerCase()}.`,
      richtig: "Corect:",
      zuEnde: "Aici cuvântul se termină deja.",
    },
  },
  sv: {
    ordnung: ORDNUNGSZAHL_SV,
    t: {
      stelle: (o, n) => (o ? `${o} bokstaven` : `Bokstav ${n}`),
      kopf: (name) => `${name}:`,
      fehlt: (name) => `${name} saknas.`,
      richtig: "Rätt vore",
      zuEnde: "Där tar ordet redan slut.",
    },
  },
  uk: {
    ordnung: ORDNUNGSZAHL_UK,
    t: {
      stelle: (o, n) => (o ? `${o} літера` : `Літера ${n}`),
      kopf: (name) => `${name}:`,
      fehlt: (_name, o, n) =>
        o ? `Бракує ${ORDNUNGSZAHL_UK_GENITIV[n]} літери.` : `Бракує літери ${n}.`,
      richtig: "Тут має бути",
      zuEnde: "Тут слово вже закінчується.",
    },
  },
};

/** Die Ordnungszahl der Stelle - `null` ab elf (dann wird gezählt statt benannt). */
function ordnungFuer(stelle: number, lang: Lang): string | null {
  const liste = FEHLER_TEXTE[lang].ordnung;
  return stelle >= 1 && stelle < liste.length ? liste[stelle] : null;
}

/** „Dritter Buchstabe" bzw. „Buchstabe 14" - ab elf wird gezählt statt benannt. */
export function stellenName(stelle: number, lang: Lang): string {
  return FEHLER_TEXTE[lang].t.stelle(ordnungFuer(stelle, lang), stelle);
}

/**
 * Ein Stück der Ansage: Text und die Tonhöhe, mit der es gesprochen wird.
 *
 * Warum Stücke statt eines Satzes: Nur ein ALLEIN gesprochener Buchstabe kann
 * seine eigene Tonhöhe haben (siehe Kopf dieser Datei). Der Aufrufer spricht
 * die Stücke nacheinander - und wer die Tonhöhe verschluckt, hört trotzdem
 * jedes Wort.
 */
export interface AnsageStueck {
  text: string;
  /** `undefined` = gewöhnliche Stimmlage. */
  pitch?: number;
}

/**
 * Höhere Stimmlage für den Buchstaben, um den es geht.
 *
 * Derselbe Wert wie `GROSS_PITCH` in `voice.ts`, und aus demselben Grund: 1.5
 * ist bei den gängigen Systemstimmen deutlich hörbar, ohne zu quietschen. Eine
 * Verwechslung mit „großes A" ist nicht zu befürchten - dort steht das Wort
 * „großes" davor, hier „Buchstabe" bzw. „Richtig wäre".
 */
export const FEHLER_PITCH = 1.5;

/**
 * Die vollständige Ansage zu einer Fehlerstelle, in Stücken.
 *
 * Beispiel (deutsch, `getippt: "u"`, `richtig: "a"`, dritte Stelle):
 * `Dritter Buchstabe:` · `u` (hoch) · `Richtig wäre` · `a` (hoch)
 *
 * ⚠️ `lang` ist hier die BEDIENUNGSSPRACHE (`RaetselLauf.tsx` reicht `ui`
 * herein), nicht die Übungssprache.
 */
export function fehlerAnsage(f: Fehlerstelle, lang: Lang): AnsageStueck[] {
  const stuecke: AnsageStueck[] = [];
  const t = FEHLER_TEXTE[lang].t;
  const name = stellenName(f.stelle, lang);

  if (f.getippt) {
    stuecke.push({ text: t.kopf(name) });
    stuecke.push({ text: f.getippt, pitch: FEHLER_PITCH });
  } else {
    // Die Eingabe war an dieser Stelle schon zu Ende - dann fehlt dort etwas.
    stuecke.push({ text: t.fehlt(name, ordnungFuer(f.stelle, lang), f.stelle) });
  }

  if (f.richtig) {
    stuecke.push({ text: t.richtig });
    stuecke.push({ text: f.richtig, pitch: FEHLER_PITCH });
  } else {
    // Dort gehört gar nichts mehr hin - das Wort war schon fertig.
    stuecke.push({ text: t.zuEnde });
  }
  return stuecke;
}

/** Dieselbe Ansage als EIN Satz - für die Anzeige und die Braillezeile. */
export function fehlerSatz(f: Fehlerstelle, lang: Lang): string {
  return fehlerAnsage(f, lang)
    .map((s) => s.text)
    .join(" ")
    .replace(/\s+([.,])/g, "$1");
}
