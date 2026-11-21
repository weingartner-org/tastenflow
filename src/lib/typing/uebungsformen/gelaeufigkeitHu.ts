/**
 * ★ D-LERNDATEN (25.10.2026): DIE BUCHSTABENVERBINDUNGEN FÜR DAS GELÄUFIGKEITSSCHREIBEN des Weges „hu" (Ungarisch) - gefüllt aus den vorbereiteten Lerndaten.
 *
 * Quelle: iCloud `sprachen-2026-10-25/tf-fest-neu/hu/tf-fest-hu.json`, Schlüssel `buchstabenFolgen` (Zuordnung: Rezept
 * Teil D). Geprüft vom unabhängigen Prüfer der PC-Sitzung: `PRUEFBERICHT.md` im selben Ordner (25.10.2026) - Urteil:
 * „Freigabefähig: ja - unter Vorbehalt der muttersprachlichen Abnahme und der Entscheidung zu Punkt 6.1“ (Alkohol bei der Jugend).
 * Übernommen vom Erzeuger-Skript der Etappe D-LERNDATEN im Format von `gelaeufigkeitCs.ts`, Eintrag für Eintrag in der Reihenfolge der
 * Quelle. Geändert wurde nur Typografie, die keine Tastatur hat (gezählt im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * ⚠️ Eine Lese-Abnahme durch eine Person mit Ungarisch als Erstsprache steht aus (Prüfbericht; Falle 59).
 *
 * Verteiler: `gelaeufigkeit.ts` (prüft jedes Wort mit dem Weg über `fitText`) - liest diese Datei seit G3c; leer hiess Englisch, gefüllt gilt diese Liste (`geruestRueckfall.ts`).
 * Unsichtbar, bis der Schalter `?ungarisch-lehrgang=1` an ist (Vorgabe AUS). Wächter: `tests/tastenflow-lerndaten-hu.test.ts`
 * (Regeln je Sprache in `tests/helfer/lerndatenNeueWege.ts`).
 *
 * ⚠️ DATENBLATT (`scripts/buendel-aufteilung.ts`): nur `import type`, kein Code.
 */
import type { Verbindung } from "./gelaeufigkeit";

export const VERBINDUNGEN_HU: Verbindung[] = [
  { folge: "sz", stelle: "anfang", woerter: ["szem", "szék", "száj", "szív", "szél", "szép", "szoba", "szilva", "szülő", "szőlő", "szürke", "szakács"] },
  { folge: "sz", stelle: "mitte", woerter: ["asztal", "tészta", "oroszlán", "puszta", "kesztyű", "beszél", "tiszta", "piszkos", "keszeg", "haszon"] },
  { folge: "sz", stelle: "ende", woerter: ["ősz", "rész", "kész", "egész", "tavasz", "húsz", "juhász", "halász", "vadász", "kalász", "tenisz", "busz"] },
  { folge: "cs", stelle: "anfang", woerter: ["csiga", "csillag", "csoki", "csend", "csésze", "csizma", "csomag", "csapat", "csütörtök", "csirke", "csónak", "csikó"] },
  { folge: "cs", stelle: "mitte", woerter: ["macska", "kacsa", "pogácsa", "palacsinta", "kecske", "szöcske", "fecske", "locsolkodás", "kocsi", "kicsi", "bocsánat", "lecsó"] },
  { folge: "cs", stelle: "ende", woerter: ["kulcs", "papucs", "kalács", "tanács", "lebbencs", "gyümölcs", "bölcs", "kovács", "kilincs", "nefelejcs"] },
  { folge: "gy", stelle: "anfang", woerter: ["gyerek", "gyík", "gyöngy", "gyümölcs", "gyertya", "gyár", "gyógyszer", "gyors", "gyalog", "gyapjú", "gyűrű", "gyufa"] },
  { folge: "gy", stelle: "mitte", woerter: ["nagyon", "hagyma", "nagyi", "egyetem", "fagyi", "magyar", "agyag", "ügyes", "hegyes", "vagyok"] },
  { folge: "gy", stelle: "ende", woerter: ["hegy", "egy", "nagy", "meggy", "ágy", "fagy", "jegy", "négy", "ügy", "vagy", "hogy", "lágy"] },
  { folge: "ny", stelle: "anfang", woerter: ["nyár", "nyúl", "nyak", "nyelv", "nyolc", "nyuszi", "nyereg", "nyit", "nyugat", "nyíl", "nyakkendő"] },
  { folge: "ny", stelle: "mitte", woerter: ["anya", "konyha", "tanya", "szoknya", "dinnye", "szőnyeg", "fenyő", "kenyér", "tenyér", "bánya", "kanyar"] },
  { folge: "ny", stelle: "ende", woerter: ["lány", "kormány", "fény", "tény", "szegény", "regény", "edény", "torony", "asszony", "verseny", "kemény", "irány"] },
  { folge: "ly", stelle: "mitte", woerter: ["gólya", "folyó", "golyó", "olyan", "milyen", "helyes", "fáklya", "pulyka", "gulyás", "folyosó", "királyi", "helyett"] },
  { folge: "ly", stelle: "ende", woerter: ["király", "hely", "mély", "bagoly", "osztály", "sirály", "harkály", "erkély", "szabály", "pehely", "akadály", "karvaly"] },
  { folge: "zs", stelle: "anfang", woerter: ["zsák", "zsiráf", "zseb", "zsemle", "zsír", "zsinór", "zsebkendő", "zsűri", "zsákmány", "zsebpénz"] },
  { folge: "zs", stelle: "mitte", woerter: ["rózsa", "pizsama", "varázslat", "varázsló", "mozsár", "rozsda", "pázsit", "tőzsde", "uzsonna", "mazsola"] },
  { folge: "zs", stelle: "ende", woerter: ["darázs", "garázs", "parázs", "varázs", "rizs", "törzs", "masszázs", "kollázs", "montázs"] },
  { folge: "ty", stelle: "mitte", woerter: ["kutya", "hattyú", "kesztyű", "batyu", "ostya", "potyog", "kotyog", "pöttyös", "kátyú", "pintyőke"] },
  { folge: "dz", stelle: "mitte", woerter: ["edző", "edzés", "edzőtábor", "bodza", "bodzaszörp", "madzag", "edzeni", "fogódzkodik", "edzett"] },
  { folge: "dzs", stelle: "anfang", woerter: ["dzsem", "dzsungel", "dzsessz", "dzsip", "dzsóker", "dzsúdó", "dzseki", "dzsinn"] },
  { folge: "ssz", stelle: "mitte", woerter: ["hosszú", "asszony", "messze", "esszé", "vissza", "össze", "rosszul", "hosszabb", "kisszék"] },
  { folge: "ggy", stelle: "mitte", woerter: ["meggyes", "meggyfa", "meggyőz", "meggyógyul", "meggyújt", "meggyorsul", "meggyleves", "meggyőződés"] },
  { folge: "nny", stelle: "mitte", woerter: ["könnyű", "könnyen", "könnyebb", "könnyes", "ennyi", "annyi", "mennyi", "mennyire", "ennyire", "annyira"] },
  { folge: "ll", stelle: "mitte", woerter: ["állat", "olló", "villamos", "csillag", "ballag", "hallgat", "kellemes", "pillangó", "szellő", "fellegek", "villa", "vállalat"] },
  { folge: "tt", stelle: "mitte", woerter: ["kettő", "itthon", "otthon", "kettes", "ettem", "ittam", "hetten", "mellette", "alatta", "fittség"] },
  { folge: "gg", stelle: "mitte", woerter: ["reggel", "reggeli", "függöny", "aggódik", "független", "függőleges", "szaggatott", "függő"] },
  { folge: "nn", stelle: "mitte", woerter: ["benne", "ennek", "annak", "enni", "inni", "uzsonna", "ennél", "tenni", "lenni", "innen"] },
  { folge: "ő", stelle: "ende", woerter: ["erdő", "mező", "tető", "felhő", "cipő", "fenyő", "kettő", "hétfő", "szőlő", "kő", "eső", "idő", "edző"] },
  { folge: "ű", stelle: "ende", woerter: ["gyűrű", "tű", "fű", "kesztyű", "egyszerű", "könnyű", "gyönyörű", "keserű", "betű", "hegedű", "csengettyű"] },
  { folge: "ó", stelle: "ende", woerter: ["folyó", "olló", "golyó", "tó", "ló", "dió", "só", "hó", "rádió", "autó", "kakaó", "lecsó", "pillangó"] },
  { folge: "ú", stelle: "ende", woerter: ["hosszú", "fiú", "szomorú", "lassú", "ifjú", "varjú", "kátyú", "tanú", "borjú", "gyapjú", "hattyú"] },
  { folge: "ö", stelle: "anfang", woerter: ["öröm", "ötös", "öt", "ölel", "öcs", "öreg", "ökör", "ösvény", "öböl", "öltözik", "örül", "ötlet"] },
  { folge: "ő", stelle: "anfang", woerter: ["ősz", "őz", "őr", "ők", "őszi", "őszinte", "ős", "őzike", "őrs", "ősi", "őriz"] },
  { folge: "ü", stelle: "anfang", woerter: ["ünnep", "üveg", "ül", "ügyes", "üres", "üdítő", "ügy", "üzenet", "üzlet", "ütő", "üdül"] },
  { folge: "ű", stelle: "mitte", woerter: ["hűtő", "fűzfa", "fűszer", "tűzoltó", "tűz", "hűvös", "szűk", "fűtés", "műsor", "betűk", "bűvész"] },
  { folge: "ság", stelle: "ende", woerter: ["barátság", "szabadság", "boldogság", "igazság", "jóság", "társaság", "valóság", "magasság", "gazdaság", "tisztaság", "fáradtság", "bátorság"] },
  { folge: "ség", stelle: "ende", woerter: ["egészség", "szépség", "mélység", "betegség", "ünnepség", "község", "lehetőség", "segítség", "ügyesség", "sebesség", "közösség", "nehézség"] },
  { folge: "ás", stelle: "ende", woerter: ["tanulás", "írás", "olvasás", "úszás", "futás", "ugrás", "mosás", "vásárlás", "utazás", "locsolkodás"] },
  { folge: "és", stelle: "ende", woerter: ["kérdés", "ébredés", "evés", "edzés", "ülés", "felelés", "nevetés", "fürdés", "festés", "étkezés", "érkezés"] },
  { folge: "ban", stelle: "ende", woerter: ["iskolában", "házban", "ágyban", "osztályban", "autóban", "parkban", "városban", "szobában", "boltban", "vonatban", "konyhában"] },
  { folge: "ben", stelle: "ende", woerter: ["kertben", "erdőben", "teremben", "füzetben", "könyvben", "hegyekben", "szekrényben", "ebben", "kezemben", "épületben"] },
  { folge: "ból", stelle: "ende", woerter: ["házból", "iskolából", "boltból", "városból", "szobából", "zsákból", "dobozból", "autóból", "pohárból", "kosárból", "ablakból"] },
  { folge: "ből", stelle: "ende", woerter: ["kertből", "erdőből", "füzetből", "kenyérből", "szívből", "ebből", "épületből", "teremből", "szekrényből", "könyvből"] },
  { folge: "nak", stelle: "ende", woerter: ["annak", "apának", "anyának", "mamának", "tanárnak", "barátnak", "osztálynak", "csapatnak", "kutyának", "lánynak"] },
  { folge: "nek", stelle: "ende", woerter: ["ennek", "embernek", "gyereknek", "testvérnek", "nővérnek", "edzőnek", "szüleimnek", "kedvesnek", "ügyesnek", "vendégnek"] },
];
