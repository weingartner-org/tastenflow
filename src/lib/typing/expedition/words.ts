/**
 * Wort-Generator der Polarstation (Bauplan §4.5, umgebaut 13.07. auf Wunsch Johannes:
 * die Station ist ein WORT-RATE-Spiel — „Funkspruch entschlüsseln"). Der Funker schickt
 * ein verdecktes Wort; das Kind rät Buchstaben (tippt sie), richtige erscheinen, mit
 * möglichst wenig Fehlgriffen. Kein Zeitdruck, kein Scheitern (Verschnaufzone).
 *
 * Der Generator zieht echte deutsche Wörter aus der bestehenden Übungs-Wortliste
 * ({@link WORDS} in `../words`, KEINE Datendopplung) und filtert sie auf die jeweils
 * FREIGESCHALTETEN Tasten — man kann nur raten, was man schon gelernt hat. Über einen
 * Besuch hinweg werden die Wörter LÄNGER/kniffliger (Johannes 13.07.: „darf schwerer
 * werden"): der erste Funkspruch ist kurz, der letzte am längsten.
 *
 * Groß-/Kleinschreibung: Nomen werden nach gelernter Umschalttaste groß angezeigt
 * ({@link isNoun}); geraten/verglichen wird ohnehin klein (der Trainer verlangt für den
 * Anzeige-Großbuchstaben keine Umschalttaste).
 */
import { SHIFT_UNIT } from "../letters";
import { WORDS, isNoun } from "../words";
import { lexikonWoerter } from "../lexicon";
import { beiSprachpaket } from "../sprachpakete";
import type { Lernweg } from "../lernweg";
import type { Lang } from "../account";
import { istGeruestSprache, kleinFuer } from "../sprachRegister";
import { totastenBuchstabeFrei } from "../corpus";
// ★ G3c-VERTEILER (25.10.2026): der Rate-Wortschatz der neun Gerüst-Wege (`expedition/words<Xx>.ts`, heute leer ⇒ englisch).
import { WORDS_BG_EXPEDITION } from "./wordsBg";
import { WORDS_EL_EXPEDITION } from "./wordsEl";
import { WORDS_HU_EXPEDITION } from "./wordsHu";
import { WORDS_NL_EXPEDITION } from "./wordsNl";
import { WORDS_PT_EXPEDITION } from "./wordsPt";
import { WORDS_BR_EXPEDITION } from "./wordsBr";
import { WORDS_RO_EXPEDITION } from "./wordsRo";
import { WORDS_SV_EXPEDITION } from "./wordsSv";
import { WORDS_UK_EXPEDITION } from "./wordsUk";

/**
 * ★ E6c (24.09.2026, Bauplan §6.3): der englische Rate-Wortschatz für Weg
 * „en" - dieselbe Bauart wie {@link WORDS} (kleingeschrieben, 3-6 Buchstaben,
 * alltagsnah, kindgerecht), aber eigenständig statt aus einer Korpus-Datei
 * (`corpusEn.ts` gehört der Tippchallenge-Baustelle dieser Nacht, nicht dieser
 * Etappe - keine gemeinsame Quelle also, um dort nicht hineinzuspielen).
 * Varianten-neutral (D4): kein Wort mit britisch/amerikanischer Doppelform.
 * Englische Nomen werden NICHT großgeschrieben (anders als im Deutschen gibt
 * es dafür keine Regel, ausserhalb eines Satzanfangs) - {@link wordPool} lässt
 * für Weg „en" darum {@link cased} aus.
 */
export const WORDS_EN: readonly string[] = [
  // sehr früh möglich (Grundreihe + e/i)
  "as", "ask", "sad", "fad", "add", "lass", "dad", "salad", "flask",
  "is", "sis", "kid", "did", "said", "aside", "idea", "slide", "file", "like",
  "see", "seed", "feel", "deal", "leak", "lake", "sale", "safe", "desk",
  "silk", "disk", "kiss", "seal", "lied", "ease", "leaf",
  // r u t z w o q p (obere Reihe)
  "run", "rain", "read", "ride", "near", "rope", "dear", "fair", "hair",
  "your", "tour", "hour", "true", "trust", "tree", "start", "first", "train",
  "the", "he", "she", "his", "her", "that", "this", "then", "there", "other",
  "how", "now", "yes", "you", "why", "way", "who", "what", "when", "many",
  // m v c , (untere Reihe teil 1)
  "man", "map", "moon", "milk", "mine", "must", "moment", "music",
  "van", "very", "voice", "video", "visit",
  "can", "cat", "care", "coat", "corn", "clean", "clock", "cool",
  "gate", "goat", "give", "green", "grow", "gold", "game", "grand",
  // x . y -
  "next", "exit", "fox", "six", "mix", "text", "extra", "expert",
  "your", "yes", "yell", "yolk", "typo", "party", "story",
  "boy", "toy", "joy",
  // n b
  "no", "not", "nose", "note", "north", "need", "nest", "name",
  "boy", "big", "book", "bell", "blue", "bread", "bird", "brave", "bring",
  "burn", "born", "bone", "bath", "bowl", "brown", "bunny",
  // allgemein, alltagsnah
  "friend", "school", "teacher", "children", "game", "computer",
  "finger", "hand", "sun", "moon", "water", "wind", "rain", "snow",
  "winter", "summer", "morning", "evening", "night", "hour", "week",
  "cat", "dog", "horse", "fish", "tiger", "lion", "bear", "duck",
  "apple", "bread", "soup", "cake", "honey", "milk", "juice",
  "red", "blue", "green", "black", "brown", "bright", "dark",
  "good", "great", "strong", "quick", "quiet", "loud", "warm",
];

/**
 * ★ E10b-2 (26.09.2026, Bauplan französischer Lehrgang §8.1): der
 * französische Rate-Wortschatz für Weg „fr" - neu gewählt, nicht übersetzt.
 * Grundlage ist die Häufigkeit in Schulbüchern (Manulex, CP + CE1, Blatt
 * „FORMES ORTHO", nur gemessen, nicht ausgeliefert): je Sprosse der
 * Reihenfolge (`lernweg.ts#FR_LETTER_ORDER`) die häufigsten Wörter, die mit
 * der neuen Taste erst tippbar werden - von Hand ausgelesen (keine Namen,
 * nichts gegen ein Kind, kulturell ruhig, §6.5) und ergänzt um Tiere, Pflanzen
 * und Orte der ganzen Frankophonie (*baobab, okapi, fennec, zébu, érable,
 * wapiti, manioc, igname*).
 *
 * Regeln (Wächter `tests/tastenflow-expedition-fr.test.ts`): klein, 2 bis 6
 * Buchstaben (die Station nimmt höchstens {@link MAX_LEN}), nur Buchstaben,
 * die im Weg „fr" EINE Taste sind (`é è à ç ù`, aber kein `ê ï`, die zwei
 * Anschläge brauchen - eine Rate-Kachel ist genau ein Anschlag), neue
 * Rechtschreibung (*boite*), kein Wort mit Landesunterschied (§10.1). Wie
 * Englisch: keine Grossschreibung von Nomen ({@link cased} nur für „de").
 */
export const WORDS_FR_EXPEDITION: readonly string[] = [
  // nach e (Grundreihe + e)
  "les", "des", "mes", "ses", "sel", "elle", "elles", "femme",
  // nach t
  "est", "tes", "test", "jet", "tel", "telle", "effet",
  // nach n
  "dent", "dents", "tente", "sens", "lent", "net", "fente",
  // nach u
  "une", "lune", "feu", "jeu", "jus", "menu", "mule", "sud", "dune", "tunnel", "jument", "neuf", "jeune",
  // nach i
  "nuit", "lit", "fil", "fille", "midi", "nid", "miel", "ski", "film", "lundi", "jeudi", "tissu", "dessin",
  // nach a
  "lait", "main", "eau", "matin", "maman", "ami", "animal", "salade", "jaune", "dame", "faim", "lama",
  "tasse", "ananas",
  // nach o
  "soleil", "maison", "monde", "oiseau", "moto", "lion", "mouton", "loto", "domino", "mot", "dos", "joie",
  "oasis", "koala",
  // nach r
  "jour", "rue", "roi", "renard", "tortue", "fleur", "rose", "train", "route", "mer", "terre", "ours",
  "jardin", "soir", "trois", "morse", "renne", "radis",
  // nach p
  "pain", "papa", "pomme", "pluie", "porte", "lapin", "loup", "pied", "poule", "papier", "panda", "sapin",
  "puma", "tapir", "okapi",
  // nach c
  "ciel", "sac", "cirque", "canard", "sucre", "carte", "cou", "coq", "cadeau", "coin", "cactus", "cacao",
  "fennec", "castor", "toucan", "manioc",
  // nach v
  "vent", "vert", "livre", "ville", "avion", "verre", "olive", "navire", "cave", "savane", "volcan",
  // nach é
  "école", "été", "vélo", "idée", "café", "fée", "étoile", "fusée", "numéro", "fumée", "clé", "météo",
  "récif",
  // nach b
  "arbre", "table", "bateau", "ballon", "bébé", "robe", "sable", "bain", "baobab", "bison", "boite", "bol",
  "robot", "bulle", "banane", "bambou", "érable",
  // nach g
  "neige", "rouge", "glace", "nuage", "dragon", "orange", "cage", "gare", "tigre", "girafe", "mangue",
  "igloo", "singe", "jaguar", "iguane", "lagon", "igname",
  // nach h
  "chat", "chien", "cheval", "vache", "hibou", "chaise", "photo", "poche", "herbe", "hiver", "cahier",
  "chemin", "niche", "hamac", "phoque", "mouche", "ruche", "chalet",
  // nach à
  "voilà", "déjà",
  // nach è
  "père", "mère", "frère", "chèvre", "crème", "lièvre", "pièce", "poème", "sirène", "trèfle", "fève", "cèdre",
  // nach x
  "deux", "six", "dix", "taxi", "prix", "noix", "voix", "choux", "bijoux", "hiboux", "boxe",
  // nach z
  "zoo", "nez", "riz", "zèbre", "lézard", "douze", "onze", "zéro", "gazon", "puzzle", "bazar", "zébu",
  // nach y
  "yeux", "pays", "crayon", "stylo", "tuyau", "rayon", "pyjama", "yaourt", "noyau", "poney", "cygne",
  "lynx", "hyène", "kayak", "yak",
  // nach ç
  "garçon", "leçon", "maçon", "glaçon", "reçu",
  // nach ù (das einzige Wort mit ù)
  "où",
  // nach w
  "wagon", "kiwi", "clown", "wapiti",
];

/**
 * ★ ES-S (27.09.2026, Bauplan spanischer Lehrgang §5.1 „Expedition ~260
 * Wörter"): der spanische Rate-Wortschatz für Weg „es" - neu gewählt, nicht
 * übersetzt. Je Sprosse der Reihenfolge (`lernweg.ts#ES_LETTER_ORDER`) die
 * Wörter, die mit der neuen Taste erst tippbar werden; Grundlage ist
 * `WORDS_ES` (gemessen an Tatoeba-Originalsätzen), ergänzt um Tiere, Pflanzen,
 * Essen und Orte der spanischsprachigen Welt (*llama, vicuña, iguana, jaguar,
 * coyote, tapir, quena, cacao, pampa, tango, hamaca, yuca, cayo*).
 *
 * Regeln (Wächter `tests/tastenflow-expedition-es.test.ts`): klein, 2 bis 6
 * Buchstaben, NUR Buchstaben mit EINER Taste auf ES und LatAm (a-z und ñ) -
 * á é í ó ú ü brauchen die Totaste, also zwei Anschläge, und eine Rate-Kachel
 * ist genau einer (wie `ê ï` in {@link WORDS_FR_EXPEDITION}). Darum fehlen hier
 * Wörter wie *mamá, ratón, árbol*. Variantenneutral: nichts, was nur in Spanien
 * oder nur in einem Teil Amerikas so heisst (*coche, zumo, papa, jugo, choclo*),
 * kein vosotros, RAE 2010, nichts aus der Sperrliste
 * (`scripts/messe-worthaeufigkeit-es.py`), nichts gegen ein Kind. Wie „fr":
 * keine Grossschreibung von Nomen.
 */
export const WORDS_ES_EXPEDITION: readonly string[] = [
  // nach e (Grundreihe f j d k s l a ñ + e)
  "sal", "fase", "jefe", "jefa", "sed", "sede", "seda", "falda", "sala", "alas", "ella", "leña", "salsa", "jalea",
  // nach o
  "sol", "oso", "ola", "dos", "ojo", "año", "olla", "koala", "lodo", "dedo", "sello", "leño", "lado", "jaleo",
  // nach n
  "nada", "lana", "lona", "onda", "fondo", "sonda", "senda", "lleno", "leones", "señal", "señas", "anda", "nadan", "sano",
  // nach t
  "tela", "todo", "lata", "nota", "total", "alto", "salto", "lento", "toldo", "teja", "atento", "jota", "tanto",
  // nach u
  "luna", "lunes", "uno", "junto", "suelo", "sueño", "dueño", "duende", "fuente", "nudo", "duna", "salud", "saludo", "jaula",
  // nach r
  "rosa", "rana", "rueda", "arena", "tren", "tres", "tarde", "tarea", "torre", "toro", "loro", "fresa", "flor", "oreja",
  "reno", "dorado",
  // nach c
  "casa", "cena", "cola", "cuna", "coco", "cacao", "cactus", "foca", "carta", "cesta", "coral", "cuerda", "orca", "cuatro",
  // nach i
  "isla", "nido", "niño", "niña", "idea", "silla", "tijera", "cine", "circo", "cielo", "fiesta", "tierra", "ciudad",
  "sirena", "tienda",
  // nach m (danach ´ und Mayús: keine neuen Rate-Buchstaben)
  "mano", "mesa", "mar", "moto", "museo", "miel", "mono", "mundo", "cama", "camino", "llama", "tomate", "mate", "animal",
  // nach p
  "pato", "perro", "pera", "piña", "puerta", "piano", "paloma", "sopa", "mapa", "papel", "piedra", "puma", "pulpo",
  "tapir", "pan", "planta",
  // nach q
  "queso", "quince", "parque", "equipo", "quena", "quieto", "toque", "dique",
  // nach b
  "barco", "bola", "boca", "bosque", "burro", "lobo", "cabra", "abeja", "nube", "libro", "cebra", "abuela", "tambor",
  "blanco",
  // nach g
  "gato", "gallo", "globo", "agua", "amigo", "lago", "juego", "fuego", "tigre", "gorila", "regalo", "iguana", "jaguar",
  "tango", "mango", "gusano",
  // nach h
  "hola", "hoja", "hielo", "hijo", "humo", "horno", "hilo", "hada", "noche", "leche", "ocho", "chicle", "hamaca", "helado",
  // nach v
  "vaca", "vela", "verde", "viento", "uva", "nieve", "llave", "huevo", "nueve", "viaje", "selva", "cueva", "lluvia",
  "vicuña",
  // nach y
  "rayo", "playa", "yema", "yegua", "mayo", "joya", "yuca", "payaso", "ayer", "arroyo", "yogur", "cayo", "yeso", "coyote",
  // nach z
  "zorro", "pez", "luz", "arroz", "taza", "tiza", "zapato", "azul", "nariz", "feliz", "cereza", "erizo", "plaza", "diez",
  // nach x
  "taxi", "examen", "texto", "extra", "saxo", "exacto", "sexto",
  // nach w (¨ bringt nur ü - zwei Anschläge)
  "kiwi", "wifi", "web",
];

/**
 * ★ IT-S (03.10.2026): der italienische Rate-Wortschatz für Weg „it" - neu gewählt, nicht übersetzt. Je Sprosse der
 * Reihenfolge (`lernweg.ts#IT_LETTER_ORDER`, Befund F4-it) die Wörter, die mit der neuen Taste erst tippbar werden;
 * Grundlage ist `WORDS_IT` (Tatoeba-Originalsätze, vom macOS-Wörterbuch bestätigt), ergänzt um die Szene der
 * Expedition (*neve, slitta, tenda, bufera, brina, vetta, picco, fiordo, igloo, kayak, nord, sud, est, ovest*), Tiere
 * der Alpen und der Meere (*orso, lupo, volpe, lince, alce, renna, ghiro, gufo, aquila, foca, orca, squalo, polpo*) und
 * Orte und Dinge des Landes (*malga, baita, lido, isola, piazza, olivo, città*).
 * Jedes Wort ist am 03.10.2026 vom macOS-Wörterbuch für Italienisch bestätigt (`scripts/woerterbuch-macos.js`, `it:`).
 *
 * Regeln (Wächter `tests/tastenflow-expedition-it.test.ts`): klein, 2 bis 6 Buchstaben, NUR Buchstaben mit EINER
 * Taste ohne Umschalt auf `it` UND `it-qzerty` - a-z und `à è ì ò ù` (eigene Tasten, keine Totaste); `é` ist auf `it`
 * Maiusc + è und bleibt draussen, ebenso Elisionen mit Apostroph (eine Rate-Kachel ist genau ein Anschlag). Nichts aus
 * der Sperrliste (`gesperrtIt`, Kern UND Wortbasis), nichts gegen ein Kind; keine Grossschreibung (wie „fr"/„es").
 * Auf der Mac-QZERTY kommt `ò` erst nach `ì` - *falò* und *comò* werden dort erst dann tippbar.
 */
export const WORDS_IT_EXPEDITION: readonly string[] = [
  // nach e (Grundreihe f j d k s l a ò + i e)
  "sale", "sedia", "sedie", "idea", "idee", "lei", "sei", "sfida", "sfide", "sella", "fede", "ali",
  // nach o (auf `it` mit ò: falò)
  "sole", "isola", "isole", "sasso", "koala", "olio", "oasi", "lido", "solo", "sola", "falò",
  // nach n
  "nonno", "nonna", "donna", "anno", "nido", "leone", "onda", "lana", "fieno", "dono", "lino", "naso", "sonno",
  // nach r
  "rana", "orso", "fiore", "arena", "oro", "rosa", "sera", "faro", "radio", "riso", "fiordo", "sirena", "nord", "rosso",
  "airone", "renna",
  // nach t
  "stella", "notte", "strada", "treno", "terra", "tenda", "tetto", "torre", "torta", "festa", "slitta", "teatro", "tesoro",
  "foto", "estate", "est", "tana", "trota",
  // nach c
  "casa", "cane", "cielo", "carta", "corda", "cena", "foca", "orca", "dolce", "riccio", "colore", "carro", "cesta", "cacao",
  "alce", "lince", "falco",
  // nach u
  "luna", "cuore", "scuola", "ruota", "tuono", "fuoco", "cuoco", "nuoto", "duna", "suono", "sud", "tuta", "tuffo", "fune",
  // nach m (auf der QZERTY schon in der Grundreihe)
  "mare", "mela", "monte", "mondo", "muro", "museo", "matita", "lumaca", "mucca", "fiume", "cima", "amico", "mamma", "marea",
  "cometa", "comò",
  // nach v
  "neve", "nave", "vento", "vela", "valle", "uovo", "nuvola", "ovest", "cervo", "corvo", "olivo", "uva", "favola", "tavolo",
  "vetta", "viola",
  // nach p (danach Maiusc und . , : keine neuen Rate-Buchstaben)
  "pane", "pesce", "porta", "ponte", "prato", "pietra", "palla", "lupo", "volpe", "pecora", "parco", "polpo", "pista", "ape",
  "mappa", "picco", "polo",
  // nach g
  "gatto", "gufo", "lago", "grotta", "gelato", "gioco", "regalo", "malga", "igloo", "gelo", "giorno", "gomma", "gru", "gregge",
  // nach h
  "ghiro", "chiave", "occhio", "ghiaia", "chiodo", "foche", "orche", "chilo", "fuochi", "chicco",
  // nach b
  "barca", "bosco", "balena", "albero", "libro", "nebbia", "nube", "ombra", "sabbia", "bruco", "baita", "bianco", "buio",
  "bufera", "brina",
  // nach z
  "zaino", "zebra", "zucca", "zuppa", "piazza", "razzo", "tazza", "pizza", "zampa", "pozzo", "zoo", "zero", "pozza", "zanna",
  // nach è
  "caffè", "tè", "bebè", "purè",
  // nach à (danach der Apostroph: keine neuen Rate-Buchstaben)
  "città", "papà", "età", "verità", "novità", "bontà",
  // nach q (danach é: Maiusc + è auf `it` - kein Rate-Buchstabe)
  "acqua", "aquila", "quadro", "cinque", "quarto", "squalo", "quota", "qui",
  // nach ì (auf der QZERTY danach ò)
  "lunedì", "così", "sì", "lì",
  // nach ù
  "bambù", "tribù", "più", "giù", "menù", "ragù",
  // nach y
  "yogurt", "yoga", "kayak", "pony", "hobby", "rugby",
  // nach w
  "kiwi", "web", "wafer", "wifi",
  // nach x
  "taxi", "extra", "sax", "box", "relax",
];

/**
 * ★ TR-S (09.10.2026): der türkische Rate-Wortschatz für Weg „tr" - neu gewählt, nicht übersetzt. Je Sprosse der
 * Reihenfolge (`lernweg.ts#TR_LETTER_ORDER`: f j d k s l a ş · e i n m b r ı t y o u · ⇧ · z ç h g ğ ü v · p c ö · ' ^ w x q)
 * die Wörter, die mit der neuen Taste erst tippbar werden. Die Szene der Expedition und das Land: Kälte und Reise (*kar, buz,
 * buzul, kuzey, güney, doğu, batı, rota, harita, kamp, ekip, kutup, donmuş, tipi, kürek, kayık, yelken, gemi*), Tiere (*kurt,
 * tilki, geyik, yunus, tavşan, kuğu, kaplan, deve*), Landschaft (*dağ, göl, vadi, mağara, ırmak, orman, çöl, nehir, deniz*)
 * und Dinge des Landes (*çay, zeytin, çorba, ceviz, kahve, pirinç, kavun*).
 * Jedes Wort steht im Vorlese-Lexikon des Weges (`isRealWord(w, "tr")`) - die Stimme sagt es ganz, statt es zu buchstabieren.
 * (Schöne Szenewörter wie *kızak, pusula, patika, vagon* fehlen dort und blieben darum draussen.)
 *
 * Regeln (Wächter `tests/tastenflow-expedition-tr.test.ts`): klein, 2 bis 6 Buchstaben, NUR Buchstaben mit EINER Taste ohne
 * Umschalt auf `tr-q` - a-z und `ç ğ ı ö ş ü` (alle sechs haben eine eigene Taste; keine Totaste, kein `â`, kein Apostroph);
 * nichts aus der Wortlisten-Sperre (`fuerWortlisteUngeeignetTr`: Kern, Wortbasis, gefaltet, unerwünscht), nichts gegen ein Kind,
 * keine Grossschreibung (wie „fr"/„es"/„it"). ⚠️ i und ı sind zwei Buchstaben auf zwei Tasten: `ılık` und `ilk` sind verschiedene
 * Wörter - die Liste steht klein, nie über `toUpperCase()`. `w x q` stehen am Ende der Reihenfolge; das Lexikon kennt dafür nur
 * `web, wifi, waffle, expo, quiz`.
 */
export const WORDS_TR_EXPEDITION: readonly string[] = [
  // nach e
  "sade", "sedef", "kese", "lale", "eşek", "kale", "dede", "kafes", "ekle", "leke", "defa", "esas", "kek",
  // nach i
  "kedi", "dil", "fil", "kil", "eski", "diş", "şişe", "dilek", "sis", "şekil", "dikiş",
  // nach n
  "nane", "nine", "inek", "sinek", "sene", "aslan", "şans", "dinle", "dene", "nefes",
  // nach m
  "şimşek", "iklim", "elma", "mide", "meşe", "maden", "damla", "masal", "elmas", "kemik", "ekmek",
  // nach b
  "baba", "bina", "kabak", "bal", "bebek", "beden", "baş", "akbaba", "elbise", "bilek", "bakkal",
  // nach r
  "sefer", "fener", "kar", "şeker", "dere", "kare", "nar", "bere", "derin", "karne", "demir",
  // nach ı
  "kış", "sıra", "sınıf", "kalın", "balık", "ışık", "ırmak", "sarı", "akıl", "fırın", "mısır", "fındık",
  // nach t
  "ateş", "batı", "tane", "tatlı", "tarla", "tabak", "tren", "bitki", "saat", "tilki", "bilet", "defter",
  // nach y
  "kaya", "ayı", "ayak", "yer", "yıl", "yarım", "yemek", "yatak", "kayık", "saray", "yayla", "yelken", "yeşil",
  // nach o
  "kol", "yol", "oda", "balon", "orman", "kolay", "robot", "sokak", "motor", "rota", "koala", "dost", "boya",
  // nach u
  "donmuş", "okul", "kutu", "uyku", "kuş", "kum", "bulut", "kurt", "usta", "duman", "yunus", "umut",
  // nach z
  "buzul", "kuzey", "yıldız", "yaz", "buz", "zil", "zebra", "uzak", "deniz", "tuz", "kazak", "uzun", "zeytin", "uzay",
  // nach ç
  "saç", "çay", "çam", "çiçek", "çanta", "açık", "uçak", "çorba", "çatı", "çadır", "çember", "keçi",
  // nach h
  "harita", "nehir", "hasta", "sabah", "bahar", "haber", "hazine", "hafta", "hamsi", "hindi", "hamur", "halka",
  // nach g
  "gemi", "gezi", "gitar", "gazete", "gol", "gizem", "geyik", "dergi", "çizgi", "genç",
  // nach ğ
  "mağara", "yağmur", "doğu", "dağ", "ağaç", "ağız", "doğa", "kuğu", "bağ", "çağrı", "sağlık", "ağır",
  // nach ü
  "güney", "güneş", "gül", "gün", "süt", "kürek", "düğme", "dünya", "küçük", "üzüm", "ülke", "gümüş", "büyük",
  // nach v
  "deve", "kavun", "ev", "havuz", "yavru", "tavuk", "tavşan", "vadi", "kahve", "elveda", "sevinç",
  // nach p
  "kamp", "ekip", "kitap", "kapı", "pembe", "pirinç", "kutup", "yaprak", "tepe", "pamuk", "piyano", "kaplan", "tipi",
  // nach c
  "macera", "gece", "çocuk", "ceviz", "cam", "ceket", "cümle", "bacak", "ocak", "sıcak", "içecek",
  // nach ö
  "yön", "göz", "göl", "köpek", "ördek", "ödül", "gömlek", "böcek", "kök", "öykü", "çöl", "dört", "görev",
  // nach w
  "web", "wifi", "waffle",
  // nach x
  "expo",
  // nach q
  "quiz",
];

/**
 * ★ PL-W (09.10.2026): der polnische Rate-Wortschatz für Weg „pl" - neu gewählt, nicht übersetzt. Je Sprosse der
 * Reihenfolge (`lernweg.ts#PL_LETTER_ORDER`, Befund F4-pl) die Wörter, die mit der neuen Taste erst tippbar werden:
 * `w o n t e i m z`, dann die AltGr-Griffe einzeln nach ihrem Nutzen (ę, ł, ż, ą, ś, ć, ó, ń, ź) zwischen den
 * einfachen Buchstaben, am Ende die Fremdwort-Buchstaben `x v q`. Grundlage ist der Alltag der Expedition und des Landes:
 * Schnee und Wetter (*śnieg, mróz, wiatr, burza, mgła, chmura*), Ausrüstung (*plecak, kompas, sprzęt, mapa, sanki, żagiel*),
 * Tiere der Wälder, Berge und Meere (*wilk, łoś, ryś, bóbr, żubr, łabędź, sokół, mors, koń, jeleń, ślimak*) und Orte und
 * Dinge Polens (*góra, wieś, chata, szkoła, chleb, żurek, pączek, rzeźba*).
 * Die Wörter stammen zum grössten Teil aus dem polnischen Vorlese-Lexikon (Tatoeba-Sätze, `lexicon`); die Ausnahmen
 * (gewöhnliche Wörter, die dort fehlen) stehen im Wächter `tests/tastenflow-expedition-pl.test.ts` mit Namen.
 * ⚠️ Das macOS-Wörterbuch für Polnisch nimmt JEDES Wort an (`NSSpellChecker`, am 09.10.2026 mit "Qwerty" gemessen) - es
 * bestätigt nichts; die Prüfung ist das Lexikon plus die Durchsicht durch eine Muttersprachlerin (Befund, Offenes).
 *
 * Regeln (Wächter): klein, 2 bis 6 Buchstaben, NUR Buchstaben der Reihenfolge - a-z und die neun polnischen Buchstaben
 * (je EIN Anschlag mit AltGr, Mac: Option; die Rate-Kachel nimmt den fertigen Buchstaben). Nichts aus der Sperrliste
 * (`gesperrtPl`, Kern UND Wortbasis), nichts gegen ein Kind; keine Grossschreibung (wie „it"/„fr"/„es").
 * Die Buchstabenpaare (rz, sz, cz, ch, dz) sind keine eigenen Rate-Buchstaben: jeder Buchstabe steht einzeln in der
 * Reihenfolge, ein Wort mit `sz` ist erst tippbar, wenn `s` und `z` da sind.
 */
export const WORDS_PL_EXPEDITION: readonly string[] = [
  // nach e (Grundreihe f j d k s l a ; + w o n t e)
  "sen", "las", "ten", "tak", "nos", "ona", "oko", "okno", "dno", "lot", "sok", "kot", "kto", "ale", "dla", "jest",
  "jedna", "kosa", "salon", "talent", "sad", "sto", "stan", "lato", "wola", "woda", "nowa", "kawa", "fala", "jeden",
  "sowa",
  // nach i
  "wilk", "kino", "kilo", "lina", "lista", "sanie", "siano", "silnik", "nitka", "sito", "kanion", "owies", "sanki",
  "idea",
  // nach m
  "mama", "mleko", "most", "mowa", "dom", "domek", "miasto", "mina", "mila", "mak",
  // nach z
  "zima", "zamek", "zlot", "znak", "zdanie", "zimno", "nazwa", "wazon", "koza", "ziemia",
  // nach ę (AltGr + e)
  "sęk", "kęs", "jęk", "mięso", "dzięki", "wędka", "mięta",
  // nach c
  "cena", "cel", "czas", "owca", "ocean", "taniec", "dzieci", "cienie",
  // nach y
  "dym", "syn", "lody", "kozy", "tyle", "dynia", "mysz", "tylko", "lasy", "nowy",
  // nach r
  "rok", "rano", "rower", "rzeka", "morze", "mors", "zorza", "drzwi", "serce", "wiatr", "trzy",
  // nach p
  "pies", "plac", "plecak", "pomoc", "koper", "kompas", "przy", "poczta", "stopa", "mapa", "lampa", "tropy", "sprzęt",
  "ptaki",
  // nach u (danach Umschalt und . , : keine neuen Rate-Buchstaben)
  "kula", "ulica", "lustro", "jutro", "mur", "kruk", "zupa", "pusty", "kuzyn", "wulkan",
  // nach ł (AltGr + l)
  "łapa", "łatwo", "ławka", "łuna", "pełna", "mały", "ciało", "mydło", "słowo", "szkoła", "jodła", "pływa",
  // nach b
  "buty", "brat", "bilet", "bułka", "biały", "babcia", "burza", "bajka", "basen", "balon", "kubek", "dobry",
  // nach g
  "gra", "gad", "grzyb", "igloo", "droga", "noga", "tygrys", "gitara", "jagoda", "mgła", "grota",
  // nach ż (AltGr + z)
  "żaba", "żyto", "żubr", "żagiel", "życie", "żyrafa", "żuraw", "jeż", "żart", "żurek",
  // nach ą (AltGr + a)
  "ząb", "łąka", "mąka", "dąb", "gołąb", "mądry", "rączka", "pączek", "piątek", "żądło", "kąpiel",
  // nach ś (AltGr + s)
  "świat", "śnieg", "ślad", "śpi", "łoś", "ryś", "świeca", "świerk", "ślimak", "wieś", "śpiew",
  // nach ć (AltGr + c)
  "ćma", "nić", "kość", "gość", "pić", "być", "stać", "mieć", "pięć", "sześć", "cześć", "lecieć",
  // nach h
  "hala", "herb", "chata", "chleb", "echo", "chmura", "ucho", "orzech", "hałas", "cichy", "hotel",
  // nach ó (AltGr + o)
  "mróz", "bóbr", "góra", "lód", "róża", "wróbel", "sokół", "ogród", "córka", "pióro", "skóra", "mówi",
  // nach ń (AltGr + n; unter Windows mit NVDA-Standardverknüpfung nicht tippbar, Falle 67)
  "koń", "dłoń", "dzień", "jeleń", "słoń", "ogień", "cień", "kamień", "jesień", "zieleń",
  // nach x (nur Fremdwörter)
  "taxi", "fax", "mix", "box",
  // nach ź (AltGr + x)
  "źródło", "łabędź", "dźwig", "dźwięk", "gałąź", "łódź", "rzeźba", "śledź", "mroźny", "koźle",
  // nach v
  "avatar", "vlog",
  // nach q
  "quiz", "quad", "quasi",
];

/**
 * ★ CS-W (09.10.2026): der tschechische Rate-Wortschatz für Weg „cs" - neu gewählt, nicht übersetzt. Je Sprosse der
 * Reihenfolge (`lernweg.ts#CS_LETTER_ORDER`, Befund F4-cs) die Wörter, die mit der neuen Taste erst tippbar werden; Grundlage
 * ist der Alltagswortschatz (`WORDS_CS`, Tatoeba-Originalsätze), ergänzt um die Szene der Expedition (*sníh, led, kra, sob,
 * mrož, stan, bunda, šála, čepice, lyže, vítr, mráz, mlha, hvězda, ozvěna, úplněk, počasí, iglú, kompas-Welt: magnet, globus,
 * šifra*), Tiere (*vlk, los, orel, liška, ježek, sýkora, tygr, žirafa*) und Dinge und Orte des Landes (*hrad, zámek, kámen,
 * rybník, údolí, hřiště, škola, pošta, knedlík-Welt: mouka, mléko, chléb, sýr*).
 *
 * ⚠️ KEIN WÖRTERBUCH-BELEG: Das macOS-Wörterbuch nimmt für Tschechisch JEDES Wort an (Falle 61). Jedes Wort ist deshalb ein
 * alltägliches Wort, das vom Vorlese-Lexikon des Weges (`isRealWord(w, "cs")`) bestätigt ist oder in
 * `tests/tastenflow-expedition-cs.test.ts` namentlich als Eigenwissen [G] geführt wird - die Lese-Abnahme durch eine Person
 * mit Tschechisch als Erstsprache (Prüfbericht P7, Falle 59) steht aus.
 *
 * Regeln (Wächter `tests/tastenflow-expedition-cs.test.ts`): klein, 2 bis 6 Buchstaben, NUR Buchstaben mit EINER Taste ohne
 * Umschalt auf `cs` UND `cs-qwerty` - a-z und `á č é ě í š ř ů ú ý ž` (eigene Tasten, keine Totaste); `ď ť ň ó` (nur über die
 * Totaste ˇ bzw. ´) bleiben draussen, ebenso Wörter mit Leerzeichen oder Strich (eine Rate-Kachel ist genau ein Anschlag).
 * Nichts aus der Sperrliste (`gesperrtCs`, Kern UND Wortbasis), nichts gegen ein Kind, kein Tier als Schimpfwort (*kráva, vůl,
 * osel, opice* fehlen); keine Grossschreibung (wie „fr"/„es"/„it"). Auf `cs-qwerty` stehen `y` und `z` auf anderen Tasten, die
 * Folge zählt den Wert - jedes Wort ist auf beiden Tastaturen mit denselben Einheiten tippbar.
 */
export const WORDS_CS_EXPEDITION: readonly string[] = [
  // nach e (Grundreihe f j d k s l a ů + e)
  "led", "les", "deska", "deka", "alej", "sele",
  // nach m
  "med", "dům", "sedm", "mama",
  // nach i
  "lid", "klid", "film", "mail", "disk", "klima",
  // nach n
  "len", "den", "sen", "dnes", "jeden", "leden", "fanda", "linka",
  // nach o
  "oko", "okno", "kolo", "slon", "los", "domino", "molo", "seno", "jelen",
  // nach t
  "stan", "tma", "teta", "stolek", "kotel", "list", "most", "stůl", "atlas",
  // nach v
  "vlk", "vana", "vosk", "vlak", "slovo", "voda", "veslo", "oves", "vidle", "sova",
  // nach ě
  "věta", "věk", "svět", "děti", "děda", "oděv", "vědět", "stěna",
  // nach u
  "kus", "sud", "mouka", "louka", "nudle", "tunel", "mluvit", "soused",
  // nach í
  "mísa", "dílna", "jídlo", "dítě", "stín", "víla", "lístek", "snídat", "okolí",
  // nach p
  "pes", "pole", "plot", "lampa", "stopa", "sopka", "dopis", "plavat", "pavouk", "plamen",
  // nach c
  "cesta", "ocas", "mince", "vejce", "slunce", "palec", "ocel", "ulice", "pocit",
  // nach h
  "sníh", "hlas", "hlava", "chata", "chodit", "mlha", "duha", "noha", "hodina", "hmat",
  // nach á
  "máma", "táta", "dálka", "kámen", "lávka", "látka", "stádo", "nápad", "hádat", "skála", "mládě",
  // nach r
  "ruka", "krk", "kra", "hora", "strom", "mrak", "tráva", "dráha", "rádio", "hrad", "orel", "vítr", "ráno", "karta",
  // nach z
  "zima", "zlato", "zámek", "mráz", "zvon", "zpěv", "ozvěna", "zvuk", "hvězda",
  // nach b
  "bota", "brod", "bouda", "buben", "balon", "brána", "sob", "obloha", "oběd", "obraz", "zebra", "bunda",
  // nach y
  "byt", "ryba", "hory", "stany", "vlny", "psy", "bydlet", "myslet", "rybník",
  // nach ž
  "lyže", "žába", "život", "mrož", "kůže", "ježek", "žirafa", "tužka",
  // nach š
  "šála", "škola", "myš", "liška", "šest", "košík", "pošta", "šátek", "šifra",
  // nach ř
  "řeka", "moře", "hřbet", "tři", "dveře", "řetěz", "hřiště", "hřeben", "kuře", "dřevo",
  // nach č
  "čaj", "čepice", "kočka", "čtyři", "ručník", "mlčet", "oči", "počasí", "červ",
  // nach é
  "mléko", "léto", "chléb", "sladké", "ledové", "tmavé", "zelené", "vlněné", "nové",
  // nach ý
  "dým", "sýr", "mýdlo", "rýže", "zlatý", "mlýn", "týden", "výlet", "výška", "ledový",
  // nach g (danach ú, x, w, q; ˇ und ´ bringen keine Rate-Buchstaben)
  "guma", "globus", "garáž", "magnet", "tygr", "gejzír", "dialog", "vagon", "jogurt", "figura",
  // nach ú
  "únor", "úl", "údolí", "úsvit", "úzký", "úspěch", "úterý", "úplněk", "iglú",
  // nach x
  "taxi", "text", "mix", "relax", "expres", "extra", "index", "pixel", "taxík", "expert",
  // nach w
  "web", "wifi", "kiwi", "show", "twist", "wok",
  // nach q
  "squash", "quad",
];

/** So viele Funksprüche entschlüsselt die Polarstation pro Besuch (Bauplan §4.5: „drei"). */
export const STATION_WORDS = 3;

const MIN_LEN = 3;
/**
 * Längstes Rätselwort. Von 8 auf 6 gesenkt (Johannes 14.07.): Ein 8-Buchstaben-Anagramm
 * ohne Zeitdruck zog die Station auf zwei Minuten — alle Zonen sollen etwa gleich lang
 * sein. Sechs Buchstaben bleiben knifflig genug.
 */
const MAX_LEN = 6;
/** Wird die Wortliste zu knapp (<10 Treffer), auch kürzere Wörter zulassen (§4.5). */
const RELAX_MIN_LEN = 2;
/**
 * PUNKT 5b (Testerin Durchgang 20.09.2026, Johannes wörtlich): „Da sollte etwas eindeutiges
 * hin oder mehrere Lösungen akzeptieren." Beides wurde gebaut - Punkt (a) im Hook
 * (`useExpedition.ts`, `stationSolutions`) akzeptiert jede echte Lösung; Punkt (b) hier:
 * WENN nach dem Wegfiltern mehrdeutiger Wörter noch mindestens so viele übrig bleiben,
 * werden nur eindeutige (kein anderes echtes Wort aus denselben Buchstaben) angeboten -
 * dann ist der Funkspruch von vornherein klar, nicht bloss nachträglich toleriert. Bleibt
 * dabei zu wenig übrig, gilt der volle (mehrdeutigkeits-tolerante) Vorrat weiter - lieber
 * ein mehrdeutiges Wort als ein zu kleiner/sich wiederholender.
 */
const MIN_EINDEUTIGE_WOERTER = 10;

export interface StationWordOpts {
  /** Wie viele Funksprüche (Standard {@link STATION_WORDS}). */
  count?: number;
  /** Deterministischer Versatz (Tages-Seed) — variiert die Auswahl, ohne Zufall. */
  seed?: number;
  /** Umschalttaste gelernt → Nomen groß schreiben (Anzeige, nur Weg „de", siehe {@link cased}). */
  shiftLearned?: boolean;
  /**
   * ★ E6c (24.09.2026): welcher Wortvorrat gilt - {@link WORDS} (Weg „de"),
   * {@link WORDS_EN} (Weg „en") oder ★ E10b-2 {@link WORDS_FR_EXPEDITION}
   * (Weg „fr"), ★ ES-S {@link WORDS_ES_EXPEDITION} (Weg „es"), ★ IT-S {@link WORDS_IT_EXPEDITION} (Weg „it"), ★ PL-W {@link WORDS_PL_EXPEDITION} (Weg „pl"), ★ TR-S {@link WORDS_TR_EXPEDITION} (Weg „tr"). Ohne Angabe
   * „de" (Alt-Verhalten unverändert).
   */
  lernweg?: Lernweg;
}

/** Die getippbaren Kleinbuchstaben aus den eingeführten Einheiten (ohne „⇧"). */
// ★ G2b-1: Gross-/Klein in der Sprache des Weges (türkisch I ≙ ı); ohne Weg Deutsch = `toLowerCase()`.
function allowedLetters(introduced: readonly string[], lernweg: Lernweg = "de"): Set<string> {
  const set = new Set<string>();
  for (const u of introduced) {
    if (u === SHIFT_UNIT) continue;
    const c = kleinFuer(u, lernweg);
    if (c.length === 1) set.add(c);
  }
  return set;
}

/**
 * Besteht das Wort NUR aus freigeschalteten Buchstaben?
 * ★ O2-TASTATUR (30.10.2026): auf den neun Wegen zählt auch ein Buchstabe, der über eine Totaste entsteht (griechisch ά = ΄ + α,
 * `totastenBuchstabeFrei`, dieselbe Regel wie Korpus und Generator). Die acht Wege davor bleiben bei einem Anschlag je Kachel:
 * ihre Wortlisten sind darauf gebaut, und ihr Stand ändert sich nicht.
 */
function typableWord(word: string, allowed: Set<string>, lernweg: Lernweg = "de"): boolean {
  const totastenWeg = istGeruestSprache(lernweg);
  for (const ch of word) {
    const klein = kleinFuer(ch, lernweg);
    if (!allowed.has(klein) && !(totastenWeg && totastenBuchstabeFrei(klein, allowed, lernweg))) return false;
  }
  return true;
}

/**
 * Nomen groß (erster Buchstabe), sonst klein — nur nach gelernter Umschalttaste.
 * ★ E6c: NUR Weg „de" - im Englischen werden Nomen ausserhalb des Satzanfangs
 * nicht großgeschrieben, „isNoun"/{@link WORDS}s Nicht-Nomen-Liste sind deutsche
 * Grammatik. {@link wordPool} ruft diese Funktion für Weg „en" darum gar nicht auf.
 */
function cased(word: string, shiftLearned: boolean): string {
  if (!shiftLearned || !isNoun(word)) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

const ANAGRAMM_INDEX = new Map<Lernweg, Map<string, number>>();
// ★ 28.09.2026: Das Lexikon wächst, sobald ein Sprachpaket kommt
// (`sprachpakete.ts`) - ein vorher gebauter Index wäre dann zu klein.
beiSprachpaket(() => ANAGRAMM_INDEX.clear());
/**
 * Signatur (sortierte Buchstaben) → wie viele ECHTE Wörter aus dem Lexikon sie ergibt.
 * Lazy + gecacht wie das Lexikon selbst (`lexikonWoerter` baut es beim ersten Aufruf) -
 * ★ E6c: JE Lernweg ein eigener Cache, das englische Lexikon ist ein anderes.
 */
function anagrammIndex(lernweg: Lernweg): Map<string, number> {
  const cached = ANAGRAMM_INDEX.get(lernweg);
  if (cached) return cached;
  const idx = new Map<string, number>();
  for (const w of lexikonWoerter(lernweg)) {
    const key = [...w].sort().join("");
    idx.set(key, (idx.get(key) ?? 0) + 1);
  }
  ANAGRAMM_INDEX.set(lernweg, idx);
  return idx;
}

/** Hat `word` noch ein ANDERES echtes Wort mit genau denselben Buchstaben (Punkt 5b)? */
function hatAndereLoesung(word: string, lernweg: Lernweg): boolean {
  const key = [...kleinFuer(word, lernweg)].sort().join("");
  return (anagrammIndex(lernweg).get(key) ?? 0) > 1;
}

/**
 * Der Rate-Wortschatz je Weg (★ E10b-2: „fr" hat seinen eigenen) - ★ ES-M2
 * (27.09.2026) samt der SPRACHE, in der seine Wörter stehen. Beides in EINER
 * Zeile, damit Vorrat und Stimme nicht auseinanderlaufen können: bis hierher
 * stand die Stimme für das gelöste Wort der Polarstation getrennt davon in
 * `stationWordLang` (useExpedition.ts) als `lernweg === "de" ? "de" : "en"` -
 * das spanische und das französische Wort las die ENGLISCHE Stimme.
 */
/** ★ G3c-VERTEILER (25.10.2026): der eigene Vorrat eines Gerüst-Weges mit seiner Stimme - leer ⇒ der englische mit englischer Stimme (wie vorher). */
function eigenerVorrat(woerter: readonly string[], sprache: Lang): { woerter: readonly string[]; sprache: Lang } {
  return woerter.length > 0 ? { woerter, sprache } : { woerter: WORDS_EN, sprache: "en" };
}

const RATE_VORRAT: Record<Lernweg, { woerter: readonly string[]; sprache: Lang }> = {
  de: { woerter: WORDS, sprache: "de" },
  en: { woerter: WORDS_EN, sprache: "en" },
  fr: { woerter: WORDS_FR_EXPEDITION, sprache: "fr" },
  // ★ ES-S (27.09.2026): „es" hat seinen eigenen Vorrat (vorher LEER seit ES-F2).
  es: { woerter: WORDS_ES_EXPEDITION, sprache: "es" },
  // ★ IT-S (03.10.2026): „it" hat seinen eigenen Vorrat (vorher der englische Rückfall seit G2a).
  it: { woerter: WORDS_IT_EXPEDITION, sprache: "it" },
  // ★ PL-W (09.10.2026): „pl" hat seinen eigenen Vorrat.
  pl: { woerter: WORDS_PL_EXPEDITION, sprache: "pl" },
  // ★ TR-S (09.10.2026): „tr" hat seinen eigenen Vorrat.
  tr: { woerter: WORDS_TR_EXPEDITION, sprache: "tr" },
    // ★ CS-W (09.10.2026): „cs" hat seinen eigenen Vorrat.
  cs: { woerter: WORDS_CS_EXPEDITION, sprache: "cs" },
  // ★ O-INHALT (29.10.2026): die neun Wege haben alle ihren eigenen Vorrat (`eigenerVorrat` greift nur bei einer leeren Liste).
  bg: eigenerVorrat(WORDS_BG_EXPEDITION, "bg"),
  el: eigenerVorrat(WORDS_EL_EXPEDITION, "el"),
  hu: eigenerVorrat(WORDS_HU_EXPEDITION, "hu"),
  nl: eigenerVorrat(WORDS_NL_EXPEDITION, "nl"),
  pt: eigenerVorrat(WORDS_PT_EXPEDITION, "pt"),
  br: eigenerVorrat(WORDS_BR_EXPEDITION, "br"),
  ro: eigenerVorrat(WORDS_RO_EXPEDITION, "ro"),
  sv: eigenerVorrat(WORDS_SV_EXPEDITION, "sv"),
  uk: eigenerVorrat(WORDS_UK_EXPEDITION, "uk"),
};

/** In welcher Sprache die Rate-Wörter dieses Weges stehen - die Stimme, die sie vorliest. */
export function rateWortSprache(lernweg: Lernweg): Lang {
  return RATE_VORRAT[lernweg].sprache;
}

/** Der Vorrat rat­barer Wörter (kuratierte Liste, Länge 3–8; bei <10 auch kürzere). */
function wordPool(allowed: Set<string>, shiftLearned: boolean, lernweg: Lernweg): string[] {
  // ★ E10b-2 (26.09.2026): je Weg ein eigener Vorrat - eine Tabelle statt der
  // Zwei-Wege-Ternäre, die „fr" auf den englischen Vorrat fallen liess.
  const quelle = RATE_VORRAT[lernweg].woerter;
  const seen = new Set<string>();
  const pool: string[] = [];
  const collect = (minLen: number) => {
    for (const w of quelle) {
      if (seen.has(w)) continue;
      if (w.length < minLen || w.length > MAX_LEN) continue;
      if (!typableWord(w, allowed, lernweg)) continue;
      seen.add(w);
      pool.push(w); // roh (klein) — die Eindeutigkeits-Prüfung braucht die Rohform
    }
  };
  collect(MIN_LEN);
  if (pool.length < 10) collect(RELAX_MIN_LEN);
  // Punkt 5b: nur eindeutige Wörter anbieten, wenn davon genug übrig bleiben - sonst der
  // volle (mehrdeutigkeits-tolerante) Vorrat, den auch `stationSolutions` im Hook trägt.
  const eindeutig = pool.filter((w) => !hatAndereLoesung(w, lernweg));
  const gewaehlt = eindeutig.length >= MIN_EINDEUTIGE_WOERTER ? eindeutig : pool;
  // „fr" wie „en": Nomen werden im Französischen nicht grossgeschrieben.
  return lernweg === "de" ? gewaehlt.map((w) => cased(w, shiftLearned)) : gewaehlt;
}

/**
 * Wählt `count` Wörter aus dem NACH LÄNGE SORTIERTEN Vorrat, mit ansteigender Länge:
 * Der Vorrat wird in `count` fortlaufende Abschnitte (kurz → lang) geteilt, aus jedem
 * kommt ein Wort. So ist der erste Funkspruch leicht, der letzte am schwersten
 * (Johannes 13.07.). `seed` wählt innerhalb eines Abschnitts ein anderes Wort → andere
 * Auswahl je Tag, ohne die Kurz-nach-lang-Ordnung zu brechen.
 */
function pickAscending(sorted: readonly string[], count: number, seed: number): string[] {
  const out: string[] = [];
  const n = sorted.length;
  for (let i = 0; i < count; i++) {
    const lo = Math.floor((i * n) / count);
    const hi = Math.max(lo + 1, Math.floor(((i + 1) * n) / count));
    const bucket = sorted.slice(lo, Math.min(n, hi));
    out.push(bucket[((seed % bucket.length) + bucket.length) % bucket.length]);
  }
  return out;
}

/**
 * `count` Rate-Wörter aus dem freigeschalteten Tastensatz, von kurz nach lang (Bauplan
 * §4.5, „darf schwerer werden"). `seed` variiert die Auswahl (Tages-Parcours); die
 * Umschalttaste schaltet die Großschreibung der Nomen frei. Ohne getippbares Wort kommt
 * eine leere Liste (die Zone entfällt dann) — sollte auf dieser Reise-Stufe nie passieren.
 */
export function stationGuessWords(
  introduced: readonly string[],
  opts: StationWordOpts = {},
): string[] {
  const { count = STATION_WORDS, seed = 0, shiftLearned = false, lernweg = "de" } = opts;
  const allowed = allowedLetters(introduced, lernweg);
  if (allowed.size === 0) return [];
  const pool = wordPool(allowed, shiftLearned, lernweg);
  if (pool.length === 0) return [];
  // Eindeutig + nach Länge sortiert (kurz → lang; bei gleicher Länge alphabetisch stabil).
  // Vergleich auf der KLEINform, damit die Reihenfolge NICHT davon abhängt, ob Nomen groß
  // geschrieben sind (Großbuchstaben sortieren sonst anders → andere Auswahl mit Shift).
  const sorted = [...new Set(pool)].sort(
    (a, b) => a.length - b.length || (kleinFuer(a, lernweg) < kleinFuer(b, lernweg) ? -1 : 1),
  );
  return pickAscending(sorted, count, seed);
}

/**
 * Die Buchstaben eines Wortes DURCHEINANDER (Bauplan §4.5, Scrabble-Stil, Johannes 13.07.):
 * Das Kind sieht alle Buchstaben — nur in falscher Reihenfolge — und muss das Wort erkennen
 * und richtig tippen. DETERMINISTISCH (reine Funktion des Wortes): dieselbe Mischung bei
 * jedem Render (keine springenden Kacheln, testbar, kein Zufall). Nie exakt das Lösungswort
 * (sonst kein Rätsel) — dann wird rotiert.
 */
export function scrambleLetters(word: string): string[] {
  const chars = [...word];
  if (chars.length <= 1) return chars;
  const base = chars.reduce((s, c) => s + c.charCodeAt(0), 0);
  const order = chars
    .map((c, i) => ({ c, k: ((i + 1) * 2654435761 + c.charCodeAt(0) * 40503 + base * 97) >>> 0 }))
    .sort((a, b) => a.k - b.k)
    .map((x) => x.c);
  if (order.join("") === word) return [...order.slice(1), order[0]];
  return order;
}
