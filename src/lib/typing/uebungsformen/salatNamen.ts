/**
 * Was der Buchstabensalat NICHT als Wort zählt, obwohl das Lexikon es kennt.
 *
 * ★ 25.09.2026 (Entscheidung Johannes): **Namen zählen im Buchstabensalat
 * nicht.** Das Lexikon baut sich aus den Übungstexten und Geschichten - und
 * dort stehen Nils, Selin, Ilse, Lena. Aus „Linde" liessen sich so „Nils"
 * oder „Elin" bilden; das ist keine Wortfindung, sondern Glück beim Raten.
 *
 * ⚠️ Nur HIER gefiltert, nicht im Lexikon: Beim Vorlesen muss „Nils" weiter
 * als Wort gesprochen werden, nicht buchstabiert.
 *
 * Wie die Listen entstanden: jedes Wort, das aus einem der 60 Quellwörter je
 * Sprache findbar ist (de 1.580, en 1.728), gegen `/usr/share/dict/propernames`
 * und das Hunspell- bzw. macOS-Wörterbuch gehalten; die Verdachtsfälle (de 523,
 * en 473) einzeln durchgesehen. **Bewusst ERLAUBT**, weil auch ein gewöhnliches
 * Wort: ernst, Ellen (Elle), Nadir, Kiel · dean, earl, grant, mason, martin,
 * dale, lord, rob, sue, roman, latin.
 *
 * Neue Geschichten bringen neue Namen - der Wächter
 * `tests/tastenflow-salat-namen.test.ts` schlägt dann an.
 */
import type { Lang } from "../account";
import { GERUEST_SPRACHEN, mitRueckfallEn, type GeruestSprache } from "../sprachRegister";
// ★ G3c-VERTEILER (25.10.2026): die Namen und Nicht-Wörter der neun Gerüst-Wege (`salatNamen<Xx>.ts`) - leer ⇒ die englische Menge.
import { SALAT_KEINE_WOERTER_BG, SALAT_NAMEN_BG } from "./salatNamenBg";
import { SALAT_KEINE_WOERTER_EL, SALAT_NAMEN_EL } from "./salatNamenEl";
import { SALAT_KEINE_WOERTER_HU, SALAT_NAMEN_HU } from "./salatNamenHu";
import { SALAT_KEINE_WOERTER_NL, SALAT_NAMEN_NL } from "./salatNamenNl";
import { SALAT_KEINE_WOERTER_PT, SALAT_NAMEN_PT } from "./salatNamenPt";
import { SALAT_KEINE_WOERTER_BR, SALAT_NAMEN_BR } from "./salatNamenBr";
import { SALAT_KEINE_WOERTER_RO, SALAT_NAMEN_RO } from "./salatNamenRo";
import { SALAT_KEINE_WOERTER_SV, SALAT_NAMEN_SV } from "./salatNamenSv";
import { SALAT_KEINE_WOERTER_UK, SALAT_NAMEN_UK } from "./salatNamenUk";
import { mengeOderEn } from "../geruestRueckfall";

/** ★ G3c-VERTEILER: die eigenen Listen der neun Gerüst-Wege (heute leer). */
const SALAT_NAMEN_GERUEST: Readonly<Record<GeruestSprache, readonly string[]>> = {
  bg: SALAT_NAMEN_BG,
  el: SALAT_NAMEN_EL,
  hu: SALAT_NAMEN_HU,
  nl: SALAT_NAMEN_NL,
  pt: SALAT_NAMEN_PT,
  br: SALAT_NAMEN_BR,
  ro: SALAT_NAMEN_RO,
  sv: SALAT_NAMEN_SV,
  uk: SALAT_NAMEN_UK,
};
const SALAT_KEINE_WOERTER_GERUEST: Readonly<Record<GeruestSprache, readonly string[]>> = {
  bg: SALAT_KEINE_WOERTER_BG,
  el: SALAT_KEINE_WOERTER_EL,
  hu: SALAT_KEINE_WOERTER_HU,
  nl: SALAT_KEINE_WOERTER_NL,
  pt: SALAT_KEINE_WOERTER_PT,
  br: SALAT_KEINE_WOERTER_BR,
  ro: SALAT_KEINE_WOERTER_RO,
  sv: SALAT_KEINE_WOERTER_SV,
  uk: SALAT_KEINE_WOERTER_UK,
};

/** ★ G3c-VERTEILER: trägt die eigene Liste eines Gerüst-Weges ein - leer ⇒ bleibt die englische Menge (dasselbe Objekt). */
function mitGeruestMengen(
  eigen: Readonly<Record<GeruestSprache, readonly string[]>>,
  t: Record<Lang, ReadonlySet<string>>,
): Record<Lang, ReadonlySet<string>> {
  for (const s of GERUEST_SPRACHEN) t[s] = mengeOderEn(eigen[s], t[s]);
  return t;
}

/** Vornamen, Nachnamen und Orte - „Namen zählen hier nicht". */
export const SALAT_NAMEN: Record<Lang, ReadonlySet<string>> = mitGeruestMengen(SALAT_NAMEN_GERUEST, mitRueckfallEn(/* RÜCKFALL-EN (G2a) */ {
  de: new Set([
    "ali", "amir", "anton", "antons", "anush", "ben", "cai", "cem", "dieter", "dilan",
    "drais", "duarte", "edgar", "elias", "elif", "elin", "ella", "elsa", "emil", "enns",
    "faris", "ferdi", "ferhat", "frieda", "greta", "hans", "heiner", "hela", "ida", "idas",
    "ilka", "ilkas", "ilse", "iman", "kemal", "lena", "leon", "lina", "lisa", "lun",
    "malik", "mia", "mila", "milo", "mira", "mo", "mona", "neda", "neil", "nele", "nils",
    "nora", "nuri", "regula", "renates", "rita", "ruth", "salih", "salim", "sanel",
    "selin", "selma", "sina", "stefan", "talin", "til", "tim", "timur", "toni", "traun",
    "zirl",
  ]),
  en: new Set([
    "ambro", "amira", "ansel", "aron", "asia", "astrid", "atri", "ben", "carter", "casper",
    "corin", "damon", "dan", "daniel", "delia", "dilan", "doris", "dorit", "efe", "elias",
    "elsa", "elsie", "emine", "erol", "estonia", "gita", "halit", "ida", "idris", "ilhan",
    "ilona", "ilse", "ines", "iona", "ireland", "kate", "leeson", "leia", "leith", "lena",
    "leo", "leonard", "marta", "mars", "mia", "milan", "nadim", "neil", "nico", "nile",
    "nora", "nour", "nuri", "odin", "ola", "osei", "paris", "petra", "pia", "rica",
    "robert", "rome", "rosa", "rustan", "ruth", "sadie", "sal", "salih", "sam", "sandor",
    "sara", "saturn", "sedat", "selin", "selma", "steiner", "suri", "talia", "ted",
    "thomas", "tina", "tom", "tomas", "toril",
  ]),
  // ★ E10b-2 (26.09.2026): aus allen Funden der 50 französischen Quellwörter
  // (`buchstabensalatFr.ts`) von Hand durchgesehen - Vornamen aus den Texten
  // und Geschichten, Länder, Städte und ein Fluss.
  fr: new Set([
    "ben", "chine", "dan", "mali", "manon", "marc", "mina", "nice", "nour", "oscar", "paris", "seine",
  ]),
  // ★ ES-W (27.09.2026): aus allen Funden der 52 spanischen Quellwörter
  // (`buchstabensalatEs.ts`) von Hand durchgesehen - Vornamen aus den Texten
  // und aus Tatoeba, Städte und Länder. Bewusst ERLAUBT, weil auch ein
  // gewöhnliches Wort: leo (ich lese), rosa, ecuador (der Äquator), inca.
  es: new Set([
    "arami", "camilo", "elba", "india", "isidro", "lara", "mario", "mateo", "nico", "nuria",
    "omar", "paco", "paola", "roma", "santi", "sara", "sula", "teresa",
  ]),
  // ★ IT-W (03.10.2026): aus allen Funden der 81 italienischen Quellwörter (`buchstabensalatIt.ts`) von Hand
  // durchgesehen - Vornamen aus den Texten und aus Tatoeba, Länder, Städte, Inseln, Berge und Flüsse. Bewusst ERLAUBT,
  // weil auch ein gewöhnliches Wort: remo (Ruder), pino, santa, croce, gaia (fröhlich), agata (Achat), chiara, regina,
  // lena (Schwung), rom.
  it: new Set([
    "ada", "aires", "anna", "asia", "cina", "ciro", "elba", "elena", "elia", "elsa", "enzo", "etna", "gian", "gina",
    "gino", "lara", "leo", "lia", "lisa", "livio", "lori", "luca", "mattia", "nicol", "nina", "nino", "noemi", "nola", "olga",
    "omar", "pina", "pisa", "recco", "reno", "roma", "sara", "siena", "sila", "tauro", "teo", "tito", "ugo", "zeno",
    "zoe",
  ]),
  // ★ PL-W (09.10.2026): aus allen Funden der polnischen Quellwörter (`buchstabensalatPl.ts`) von Hand durchgesehen - das
  // polnische Lexikon ist aus Tatoeba-Sätzen gebaut und trägt deren Vornamen (Tom heisst dort oft Adam, Ania, Marek) und
  // Orte klein. Vornamen, Länder, Städte, Inseln, Berge. Bewusst ERLAUBT, weil auch ein gewöhnliches Wort: hel (Helium),
  // maja (des Mais, Genitiv von „maj"), mila (Meile), odra (Masern), bali (sie hatten Angst), rabat (Rabatt), marka.
  pl: new Set([
    "ada", "adam", "adama", "akira", "ali", "amanda", "amy", "dan", "tomas", "ania", "anna", "antek", "aten", "beth", "bolek", "chin", "cypr",
    "daryna", "etna", "ewa", "ewo", "ewy", "gordon", "grek", "hiroko", "iga", "igor", "igora", "iraku", "iran", "iwona",
    "iza", "jan", "joan", "jocka", "juan", "kairu", "kanady", "karl", "karol", "kasi", "kazu", "keio", "kenia", "kepler",
    "klara", "korea", "kumi", "kyoko", "lars", "laura", "leon", "leona", "luna", "marek", "marika", "mark", "mona", "nadia", "nana",
    "narita", "natalia", "nika", "nino", "olek", "oli", "oliwer", "oskar", "oskara", "oslo", "pekin", "pete", "piotr",
    "polak", "polki", "ryoko", "san", "swan", "takeo", "tima", "tola", "tomaso", "tomi", "tomo", "tosi", "ula", "uli",
    "zenon",
  ]),
  // ★ CS-W (09.10.2026): aus allen Funden der tschechischen Quellwörter (`buchstabensalatCs.ts`) von Hand durchgesehen - das
  // tschechische Lexikon ist aus Tatoeba-Sätzen gebaut und trägt deren Vornamen und Orte klein (die Zählung strich Tom und
  // Mary, nicht Ivan, Lenka, Marek). Vornamen, Länder, Städte, Flüsse, Planeten. Bewusst ERLAUBT, weil auch ein gewöhnliches
  // Wort: tom (o tom), milá, linka, uran, leva (des Löwen), dan nicht - „daň" (Steuer) hat ein ň.
  cs: new Set([
    "adam", "alena", "ana", "david", "anička", "ann", "asie", "ben", "bell", "cheb", "dan", "dilma", "ema", "eva", "foma", "irka",
    "irska", "iva", "ivan", "ivana", "ivano", "ivu", "joe", "kate", "ken", "kena", "kim", "kolín", "kuba", "labe", "lenka",
    "linda", "lucie", "mai", "marek", "mars", "mia", "milan", "mája", "nela", "nil", "ondra", "oslo", "ota", "pepa", "pepík",
    "praze", "radka", "rick", "rio", "riu", "sára", "seán", "telči", "toki", "vítka", "ája", "írán", "čína", "karol",
  ]),
  // ★ TR-W (09.10.2026): aus allen Funden der türkischen Quellwörter (`buchstabensalatTr.ts`) von Hand durchgesehen - das
  // türkische Lexikon ist aus Tatoeba-Sätzen gebaut und trägt deren Vornamen und Orte klein (`kleinFuer(…, "tr")`). Vornamen,
  // Städte, Länder, Flüsse, Völker. Bewusst ERLAUBT, weil auch ein gewöhnliches Wort: can (Leben), nur (Licht), umut (Hoffnung),
  // onur (Ehre), murat (Wunsch), mert (tapfer), berk (fest), esin (Eingebung), efe, ece, ela, ozan (Dichter), yeşim (Jade),
  // lale, dalya, emir (Befehl), ağrı (Schmerz).
  tr: new Set([
    "abant", "adana", "adem", "aksu", "alman", "almanda", "antep", "aras", "asel", "asya", "atina", "azra", "bolu", "burak",
    "ceren", "dilan", "ecrin", "ege", "emre", "eren", "irem", "israil", "kaan", "kemal", "kerem", "kerim", "kilis", "konya",
    "mekke", "musa", "muş", "nail", "nil", "nisa", "okan", "racan", "rana", "rize", "rukiye", "rum", "sait", "sena", "van",
    "ırak", "ömer", "şam",
  ]),
}));

/**
 * Abkürzungen, Masseinheiten und Bruchstücke aus fremden Sprachen - kein Name,
 * aber auch kein Wort, das man im Salat „findet". Zählt als „kenne ich nicht".
 */
export const SALAT_KEINE_WOERTER: Record<Lang, ReadonlySet<string>> = mitGeruestMengen(SALAT_KEINE_WOERTER_GERUEST, mitRueckfallEn(/* RÜCKFALL-EN (G2a) */ {
  de: new Set(["dl", "mg", "ml", "tb", "lend", "ill", "hail", "wide", "bugs"]),
  en: new Set(["cm", "km", "kb", "mb", "mg", "ml", "tb", "dl", "mr", "mrs", "ms", "fsh", "dat", "tante", "rasch"]),
  // ★ E10b-2: Abkürzungen und zwei Bruchstücke aus dem Lexikon („afi", „cheni").
  fr: new Set(["afi", "cheni", "cm", "etc", "leu"]),
  // ★ ES-W (27.09.2026): Abkürzungen und Bruchstücke aus dem Lexikon (ad, co,
  // md …), englische und deutsche Wörter aus Tatoeba (call, out, und, von),
  // Umgangssprache einzelner Länder (chela, mae, parce, asere, illo) - und
  // die Funde, die auf der Sperrliste stehen
  // (`scripts/messe-worthaeufigkeit-es.py`: coche, fea, mola, os).
  es: new Set([
    "ab", "ad", "am", "api", "asere", "bo", "call", "chela", "co", "coche", "com", "cu", "dl",
    "fea", "guara", "guaras", "illo", "im", "in", "indias", "isn", "je", "ma", "mae", "md",
    "mola", "os", "out", "parce", "po", "rd", "set", "ta", "und", "von",
  ]),
  // ★ IT-W (03.10.2026): Abkürzungen und Buchstabenpaare, die das macOS-Wörterbuch annimmt (aa, pc, tv, cdr …),
  // englische und deutsche Wörter aus Tatoeba (call, man, team, von), Bruchstücke und Verkürzungen, die nur vor
  // einem anderen Wort stehen (bel, ben, gran, san, tal, qual, mal, far, fin, mar, amor, ciel, cuor, dar, pian, sin,
  // suol), seltene oder falsche Formen (agia, areni, glato, circi, pese, lea) - und Funde, die ein Kind nicht als Wort
  // finden soll: Vulgäres und Doppelsinn (caga, cagata, pene, seno), Wörter, die als Schimpfwort gegen ein Kind gehen
  // (asine, cagna, nano, nani, pingui, tipa), coca, satana, boia, nasa, abba.
  it: new Set([
    "aa", "bb", "bc", "cb", "cd", "de", "eo", "if", "ii", "it", "ls", "na", "on", "pc", "po", "rb", "tg", "tv",
    "abba", "agia", "agii", "all", "amor", "ana", "arei", "areni", "areo", "art", "asine", "ata", "bea", "bel", "ben",
    "boia", "bon", "bra", "caga", "cagata", "cagna", "call", "can", "canal", "cdr", "ciel", "circi", "clou", "coca",
    "color", "com", "cos", "cosi", "cuor", "dar", "dogano", "end", "eran", "far", "fast", "fin", "gena", "genia",
    "glato", "gran", "heu", "hoc", "insera", "late", "lea", "lineo", "loco", "luco", "mal", "man", "mar", "maro",
    "men", "nano", "nani", "nasa", "nasata", "noio", "noma", "novi", "ocre", "ombro", "ondo", "orte", "pan", "pene", "pese",
    "pian", "pingui", "pong", "qual", "reta", "reto", "san", "satana", "seno", "sin", "son", "sona", "sotti",
    "spiaggi", "stan", "sti", "stio", "suol", "tag", "tal", "team", "tipa", "top", "val", "van", "veno", "vent", "vio", "von",
    "vote", "zoni", "zono",
  ]),
  // ★ PL-W (09.10.2026): das polnische Lexikon (Tatoeba-Formen) trägt Abkürzungen und Buchstabenfolgen (kg, np, nr, tzw, zł,
  // pko, pln, zus, pesel), Ausrufe aus Chats (ah, hm, eh, ble, niam), englische Wörter (hot, sir, fair, drink, mail, nick,
  // note, ping, real), Schreibungen OHNE Ogonki, die als Wort falsch sind (sie, cie, sa, cos, byl, imie, tate, maka, krwii) -
  // ein Kind, das sie tippt, soll lernen, dass „się" ein `ę` hat - und Funde, die ein Kind nicht als Wort finden soll:
  // Vulgäres und Doppelsinn (suko, loda, pała, członek, łonie, naga, nago, bąk, mac), Schimpfwörter gegen Menschen (durnia,
  // lenia, sknera, kutwa, babo, pysk), Alkohol (piw, wino, sake, seta, kaca, drink), Schläge (lanie), Religion als Zufallswort
  // (biblia, koran, kain, maca, wiara) und Politik (hitler, putin, krym).
  pl: new Set([
    "aaa", "ab", "ah", "ai", "aki", "an", "aoi", "asa", "bc", "bi", "bin", "bio", "ble", "byl", "ch", "cha", "cie", "cna",
    "cos", "crp", "css", "cz", "de", "del", "di", "dr", "edo", "eh", "eks", "em", "fi", "ge", "hip", "hm", "ho", "hot",
    "id", "ido", "igi", "igo", "ito", "jaw", "ji", "jo", "jr", "kg", "kmh", "krl", "kwh", "lee", "mac", "mai", "mln", "ne",
    "net", "nil", "nip", "np", "nr", "oc", "owi", "per", "pi", "pin", "pit", "piw", "pko", "pln", "pta", "pu", "rb", "rie",
    "rna", "rz", "sa", "se", "si", "sie", "sir", "sor", "sz", "ti", "tys", "tzw", "un", "wal", "wi", "win", "won", "zus",
    "zł", "bąk",
    "babo", "biblia", "członek", "drink", "durnia", "ekopie", "epit", "ergo", "fair", "hetero", "hitler", "imie", "kaca",
    "kain", "kanea", "koran", "krwii", "krym", "kutwa", "lanie", "lenia", "loda", "maca", "mail", "maila", "maka", "maks",
    "naga", "nago", "nary", "niam", "nick", "note", "ogai", "pała", "pesel", "ping", "pona", "ponie", "prof", "prze",
    "putin", "pysk", "real", "sake", "seta", "sknera", "suko", "szie", "szneki", "tate", "wiara", "wino", "zawdi", "łonie",
  ]),
  // ★ CS-W (09.10.2026): das tschechische Lexikon (Tatoeba-Formen) trägt Abkürzungen und Masseinheiten (cm, km, dph, kč, eu,
  // usa), Ausrufe (ach, aha, hej, hop, pst, pšt, cvak, jo, né), englische Wörter (and, for, of, its, art, email, skype, link,
  // tube), Umgangsformen (tos, tys, vem, náma, inu), Schreibungen OHNE Háček/Čárka, die als Wort falsch sind (ja, ma, me, ted,
  // neni, sam) - ein Kind, das sie tippt, soll lernen, dass „já" eine Čárka hat - und Funde, die ein Kind nicht als Wort finden
  // soll: Tiernamen als Schimpfwort (husa, hus, koza, kozu, osel, tele, krav), Doppelsinn (panic, panice), gegen ein Kind
  // (drzá), Alkohol (rum, vína, chlast, opít), Tod und Verletzung (smrt, rakve, zranil, střeva), Religion als Zufallswort
  // (boha, pekla, modli, víra, víře) und die Sperrliste (prd).
  cs: new Set([
    "ab", "al", "am", "amp", "and", "ar", "art", "au", "bt", "cc", "cd", "cm", "de", "dm", "dph", "eu", "for", "ii", "ind",
    "inu", "ir", "its", "iv", "kk", "km", "kč", "kčh", "kčl", "kň", "la", "li", "lška", "ma", "me", "mp", "ms", "of", "oj",
    "ok", "ou", "rb", "sr", "st", "sv", "svt", "čt", "obd", "vzd", "hokna", "bohat", "nate", "san", "so", "te", "kom", "ku",
    "ach", "aha", "hej", "hop", "pst", "pšt", "cvak", "jo", "né", "ich", "tube", "trans", "email", "mail", "maily", "skype",
    "link", "bio", "aminy", "per", "tos", "tys", "vem", "náma", "ja", "ted", "neni", "sam", "pí", "usa", "taro",
    "husa", "hus", "koza", "kozu", "osel", "tele", "krav", "panic", "panice", "drzá", "binec", "chlast", "rum", "vína", "opít",
    "smrt", "rakve", "zranil", "střeva", "boha", "pekla", "modli", "víra", "víře", "prd",
  ]),
  // ★ TR-W (09.10.2026): das türkische Lexikon (Tatoeba-Formen) trägt Abkürzungen (lgs, tyt, ayt, rb, rh), Ausrufe aus Chats
  // (ah, aha, ee, of, oh, vay, yaa, tüh, oley), umgangssprachliche Kurzformen (bi, nere, nen, len, yav), Notennamen (fa, la, re,
  // si), englische Wörter (fair, like, mail, best), Bruchstücke (ahı, ayki, kalka, maka, pona) und falsche Schreibungen (tabi
  // statt tabii) - und Funde, die ein Kind nicht als Wort finden soll: Rangtitel (ağa, paşa; die Verwandtschafts- und
  // Höflichkeitswörter abi, abla, bey, bayan zählen - Glossar §1 Nr. 2 verbietet sie als ANREDE im Text, nicht als Wort), Vulgäres und Doppelsinn (karı, boka, nah, halt, işer, bakire, sikile, kuma; dazu
  // sık, sıktı, şık - gefaltet ein Sperrwort, Glossar §4 Nr. 2), Wörter gegen Menschen und Kinder (alık, bön, kel, kelle, keke,
  // kelek, köre, biti, anan), Alkohol (bira, rakı), Religion als Zufallswort (ezan, namaz, iman, kilise, noel, dua, din, hac, kul,
  // kadı, sela, yasin), Tod (ecel, kefen, cenaze, leş, idam), Politik und Gewalt (isyan, laik, reis, vatan, sancak, esir, köle,
  // kanlı, dayak, sanık, rant, şike) und die Wörter aus `TR_WORTLISTE_UNERWUENSCHT` (ata, ceza, kriz, ordu, sigara, yalan).
  tr: new Set([
    "aaa", "ah", "aha", "ahlı", "ahı", "alo", "aran", "aşa", "ayki", "ayt", "bala", "bam", "ban", "be", "best", "bi", "bili",
    "ca", "den", "dir", "duma", "ee", "ey", "fa", "fair", "fe", "fin", "ha", "he", "kah", "kaha", "kalka", "kem", "klas", "klem",
    "kmsa", "kora", "kös", "la", "lak", "le", "leb", "len", "lgs", "like", "mail", "maka", "maldan", "mara", "me", "neme",
    "nen", "nere", "of", "oh", "oley", "paklar", "pona", "ram", "rb", "re", "rh", "si", "stat", "tabi", "te", "tefe", "ti",
    "tin", "tir", "tüh", "tyt", "ula", "vah", "vay", "vole", "yaa", "yav", "yek", "yet", "çer", "şak", "şemsi",
    "ağa", "paşa",
    "anan", "bakire", "boka", "halt", "işer", "karı", "karım", "kuma", "nah", "sikile", "sık", "sıktı", "şık",
    "alık", "biti", "bön", "keke", "kel", "kelek", "kelle", "köre", "fıtık",
    "bira", "rakı",
    "cenaze", "din", "dine", "dua", "ecel", "ezan", "fani", "hac", "iman", "imandan", "kadı", "kadıya", "kefen", "kilise",
    "kul", "kula", "namaz", "noel", "put", "sela", "yasin",
    "dayak", "esir", "idam", "idama", "isyan", "kanlı", "köle", "laik", "leş", "rant", "reis", "sancak", "sanık", "vatan",
    "şike",
    "ata", "ceza", "kriz", "ordu", "sigara", "yalan",
  ]),
}));
