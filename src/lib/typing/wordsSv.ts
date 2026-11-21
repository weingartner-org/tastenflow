/**
 * ★ D-LERNDATEN (25.10.2026): DER ÜBUNGSWORTSCHATZ des Weges „sv" (Schwedisch) - gefüllt aus den vorbereiteten Lerndaten.
 *
 * Quelle: iCloud `sprachen-2026-10-25/tf-fest-neu/sv/tf-fest-sv.json`, Schlüssel `stufenWoerter` und `wortschatz` (Zuordnung: Rezept
 * Teil D). Geprüft vom unabhängigen Prüfer der PC-Sitzung: `PRUEFBERICHT.md` im selben Ordner (25.10.2026) - Urteil:
 * „Freigabefähig: ja, unter zwei Bedingungen: Die Punkte 1 und 5 aus §5 müssen technisch geklärt werden, und ein Mensch mit Schwedisch als Erstsprache sollte das Ganze gegenlesen.“
 * Übernommen vom Erzeuger-Skript der Etappe D-LERNDATEN im Format von `wordsCs.ts`, Eintrag für Eintrag in der Reihenfolge der
 * Quelle. Geändert wurde nur Typografie, die keine Tastatur hat (gezählt im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * ⚠️ Eine Lese-Abnahme durch eine Person mit Schwedisch als Erstsprache steht aus (Prüfbericht; Falle 59).
 *
 * ⚠️ REIHENFOLGE: Die Wörter stehen in der Reihenfolge der Quelle - sortiert nach der Lern-Folge des Bauplans
 * (`BAUPLAN-2026-10-25-SV.md`), Stufe für Stufe. Die endgültige `SV_LETTER_ORDER` kommt erst mit F4 (`lernweg.ts`); bis dahin ist
 * der Weg ein Alias von „en", und `filterWords` lässt nur durch, was mit den englischen Einheiten tippbar ist. Nach F4: neu nach
 * Sprosse sortieren und die Kontingente je Sprosse prüfen (der Wächter „jedes Wort einer Stufe ist tippbar" liest die Folge aus
 * `lernweg.ts` und läuft, sobald sie dort steht). Das Vorlese-Lexikon liest diese Liste noch nicht (eigenes Fach: F8).
 *
 * Verteiler: `geruestWoerter.ts` ⇒ `generator.ts` (`WORD_BASE`, `STUFE_VOCAB_TABLE`), `uebungsformen/hilfen.ts` (`wortquelle`), `uebungsformen/pyramide.ts` - liest diese Datei seit G3c; leer hiess Englisch, gefüllt gilt diese Liste (`geruestRueckfall.ts`).
 * Unsichtbar, bis der Schalter `?schwedisch-lehrgang=1` an ist (Vorgabe AUS). Wächter: `tests/tastenflow-lerndaten-sv.test.ts`
 * (Regeln je Sprache in `tests/helfer/lerndatenNeueWege.ts`).
 *
 * ⚠️ DATENBLATT (`scripts/buendel-aufteilung.ts`): nur `import type`, kein Code.
 */
import type { InhaltsStufe } from "./account";

/** Die Übungswörter des Weges „sv", klein, in der Lern-Folge der Quelle (1113 Wörter). */
export const WORDS_SV: string[] = [
  "ska", "ja", "alla", "sa", "sak", "fall", "all", "alls", "kalla", "skada", "skall", "skaffa", "kallas", "skadad", "klass",
  "kall", "flaska", "falla", "skaka", "ladda", "falsk", "kallad", "kaka", "sal", "aska", "sallad", "skala", "laddad", "skal",
  "ask", "dal", "kalas", "kassa", "lada", "kaj", "fasad", "fasa", "falk", "lass", "sjal", "sladd", "slask", "sölja", "fjöl",
  "följa", "lösa", "adjö", "föll", "dök", "söka", "dölja", "född", "lös", "föda", "öka", "slösa", "sök", "kö", "kök", "sjö",
  "lök", "följd", "sköld", "ödsla", "ödla", "skölja", "flöda", "slöja", "köa", "slöjd", "de", "se", "fel", "del", "dessa",
  "kaffe", "eld", "alldeles", "dela", "leka", "sade", "leda", "ske", "öde", "le", "lek", "elak", "led", "leksak", "kedja",
  "ökade", "sked", "delas", "födelse", "ek", "delad", "elda", "sekel", "kallelse", "sadel", "flöde", "eldade", "sedel", "kakel",
  "illa", "lika", "lilla", "kille", "sida", "fisk", "is", "ifall", "lida", "ilska", "skilja", "lila", "fiska", "skilda", "fil",
  "klassisk", "kika", "iskall", "diska", "ideal", "fika", "klia", "fiske", "dike", "disk", "silke", "idel", "sill", "skiss",
  "skida", "sila", "isflak", "läsa", "älska", "sälja", "själ", "skäl", "klä", "läs", "fälla", "källa", "klädd", "läsk", "älskad",
  "läka", "ädel", "klädsel", "säd", "fläsk", "släde", "säl", "fjäll", "kälke", "är", "för", "där", "er", "eller", "ser", "älskar",
  "saker", "försöker", "far", "kör", "deras", "därför", "säker", "rädd", "era", "klarar", "dra", "fler", "klara", "reda", "klar",
  "följer", "försöka", "flera", "försök", "lär", "lära", "kallar", "föräldrar", "före", "köra", "kärlek", "drar", "förklara",
  "förra", "kära", "resa", "söker", "läkare", "körde", "fri", "röra", "kläder", "fred", "lärde", "delar", "leder", "säljer",
  "sälar", "det", "att", "till", "ett", "ta", "allt", "lite", "efter", "tar", "ditt", "rätt", "detta", "alltid", "tid", "sätt",
  "tre", "titta", "första", "sett", "dit", "sitt", "först", "träffa", "säkert", "sista", "tills", "fast", "faktiskt", "klart",
  "tala", "sitter", "stället", "sätta", "lätt", "letar", "direkt", "talar", "tjej", "satt", "sätter", "ställe", "tittar", "äter",
  "sitta", "träffas", "större", "trött", "ställa", "särskilt", "största", "satte", "stark", "fart", "istället", "rakt", "litar",
  "tjejer", "fallet", "fest", "tredje", "träffar", "söt", "sist", "äkta", "stad", "kasta", "tittade", "röst", "läste", "talade",
  "kraft", "stilla", "te", "starta", "titt", "sköta", "letade", "köket", "lättare", "tälta", "inte", "en", "den", "kan", "ni",
  "nej", "din", "när", "in", "kanske", "finns", "än", "sen", "andra", "känner", "dina", "sin", "tänker", "innan", "ledsen",
  "snälla", "ens", "enda", "stanna", "annan", "redan", "snart", "tiden", "tänkte", "sedan", "annat", "sina", "nästa", "liten",
  "sant", "nästan", "inne", "denna", "känns", "senare", "nära", "kände", "tänka", "natt", "dörren", "känna", "fint", "stannar",
  "önskar", "fin", "sent", "nere", "natten", "sidan", "snäll", "saken", "resten", "saknar", "senaste", "tjänst", "enkelt", "land",
  "ansikte", "landet", "staden", "andas", "intressant", "ändra", "dansa", "intresserad", "tanke", "rena", "ren", "räkna", "tjäna",
  "tankar", "saffran", "kantarell", "insjö", "renskötsel", "jag", "gör", "göra", "sig", "ingen", "igen", "aldrig", "inget",
  "säger", "ge", "säga", "dag", "inga", "gillar", "länge", "ger", "längre", "ingenting", "riktigt", "tag", "sagt", "ligger",
  "idag", "ringer", "glad", "dagar", "gärna", "ringa", "dags", "egen", "ringde", "dagen", "galen", "tagit", "ganska", "tidigare",
  "gäller", "arg", "lägga", "enligt", "egentligen", "aning", "lägger", "eget", "riktig", "egna", "äntligen", "allting",
  "försiktig", "anledning", "tidigt", "steg", "gatan", "glas", "ingenstans", "sängen", "gissa", "äger", "gilla", "öga", "genast",
  "säng", "antingen", "engelska", "företag", "ärlig", "gratis", "ärligt", "regler", "gäng", "färdig", "glada", "förslag", "ägg",
  "tidningen", "laget", "födelsedag", "stänger", "energi", "dagarna", "färg", "fredag", "klänning", "stig", "lördag", "längs",
  "gäster", "ledigt", "längst", "signal", "ledig", "ögat", "stängt", "garn", "tangenter", "gardin", "älgar", "gädda", "riksdag",
  "tangent", "har", "han", "här", "ha", "hade", "henne", "hej", "hans", "hela", "hit", "hennes", "händer", "helt", "hör", "hitta",
  "heter", "hand", "hände", "hittade", "hörde", "höra", "helst", "haft", "hittar", "hänt", "hört", "heller", "handlar", "hända",
  "hjärta", "höll", "hälsa", "händerna", "hel", "höger", "högt", "hellre", "säkerhet", "närheten", "hinner", "lägenhet", "högre",
  "hjälte", "hälften", "hjärna", "hänga", "härligt", "häftigt", "häst", "frihet", "hindra", "högsta", "hittades", "höga", "hage",
  "hon", "oss", "okej", "tror", "gjorde", "nog", "gjort", "tog", "trodde", "folk", "fortfarande", "god", "tro", "jo", "hos",
  "son", "stor", "kolla", "redo", "stora", "fort", "tio", "gott", "ord", "oroa", "skolan", "roligt", "fortsätt", "konstigt",
  "ögon", "kort", "historia", "stod", "ofta", "jorden", "olika", "orolig", "telefon", "stolt", "kontor", "ordna", "kontakt",
  "känslor", "skogen", "kontroll", "folket", "historien", "solen", "skor", "dator", "skola", "hallon", "fors", "igelkott",
  "kakao", "orientering", "norrsken", "lingon", "hjortron", "nationaldag", "med", "som", "om", "mig", "men", "min", "kommer",
  "honom", "kom", "man", "dem", "mitt", "mer", "mina", "mamma", "mot", "komma", "hem", "menar", "samma", "morgon", "namn", "fram",
  "lämna", "genom", "minns", "fem", "människor", "hemma", "familj", "ensam", "hämta", "tillsammans", "mellan", "timmar", "gamla",
  "eftersom", "gammal", "mat", "mest", "stämmer", "medan", "imorgon", "mindre", "misstag", "familjen", "möjligt", "middag",
  "samtal", "glömde", "människa", "omkring", "meddelande", "film", "möte", "glömma", "meter", "dröm", "same", "strömming",
  "semla", "allemansrätten", "mosse", "skärmläsare", "holme", "midnattssol", "samer", "samisk", "samiska", "simhall", "vi", "var",
  "vad", "av", "vill", "vet", "vara", "varför", "vem", "över", "väl", "varit", "ville", "vänta", "vid", "själv", "liv",
  "verkligen", "visst", "veta", "visste", "vilken", "vän", "kvar", "väg", "väldigt", "vart", "kväll", "verkar", "varje", "visa",
  "vägen", "gav", "vänner", "vilket", "även", "livet", "världen", "väntar", "kvinna", "trevligt", "vilja", "varandra", "lever",
  "leva", "självklart", "iväg", "ikväll", "kvinnor", "vatten", "val", "vidare", "använda", "viktigt", "skriva", "sova", "visar",
  "svara", "välkommen", "skrev", "skriver", "överallt", "svar", "finlandssvenska", "finlandssvensk", "älv", "vindkraft",
  "vattenkraft", "vante", "höstlov", "du", "nu", "hur", "skulle", "ut", "ju", "kunde", "utan", "sluta", "under", "just",
  "ursäkta", "ute", "slut", "kunna", "minuter", "runt", "kul", "lugnt", "huset", "hus", "ännu", "rum", "förut", "utanför",
  "huvudet", "lugn", "nummer", "undrar", "grund", "sju", "fungerar", "stund", "huvud", "rummet", "hund", "djur", "duktig", "kung",
  "hungrig", "musik", "ungefär", "unga", "minut", "ljus", "dessutom", "utmärkt", "tusen", "jul", "ledarhund", "humla", "lodjur",
  "lussekatt", "lussekatter", "jullov", "så", "måste", "då", "får", "från", "gå", "få", "två", "något", "år", "någon", "några",
  "låt", "vår", "förstår", "många", "förlåt", "gång", "håll", "står", "håller", "våra", "mår", "hallå", "låter", "fått", "fråga",
  "åka", "hålla", "vårt", "ändå", "åker", "svårt", "långt", "gått", "ifrån", "gånger", "stå", "lång", "alltså", "igår", "förstå",
  "frågor", "låg", "hårt", "åkte", "små", "frågar", "dåligt", "åtta", "våffla", "skärgård", "majstång", "midsommarstång",
  "ladugård", "på", "upp", "pappa", "hjälpa", "hjälp", "pengar", "pratar", "hoppas", "ihop", "plats", "spelar", "öppna", "spela",
  "par", "pratade", "plan", "perfekt", "uppe", "köpa", "kompis", "pojke", "toppen", "hoppa", "kropp", "polis", "köpte", "passar",
  "plötsligt", "hjälpte", "spel", "spelade", "upptagen", "köper", "spår", "planen", "sällskap", "platsen", "respekt", "skapa",
  "prova", "öppnar", "grupp", "poäng", "springa", "spännande", "papper", "kämpa", "öppen", "pris", "spelet", "privat", "platser",
  "slippa", "öppet", "pass", "plus", "spara", "kopp", "språk", "paus", "park", "punkt", "torp", "påskägg", "pepparkaka", "pulka",
  "sportlov", "påsklov", "parasport", "punktskrift", "bara", "bra", "behöver", "blir", "bli", "tillbaka", "borde", "blev",
  "berätta", "barn", "bättre", "bort", "borta", "problem", "bästa", "börjar", "jobb", "bilen", "blivit", "jobbar", "båda",
  "börja", "bil", "bror", "be", "ibland", "bor", "ber", "började", "bäst", "bakom", "jobbet", "berättade", "ben", "blod",
  "betala", "snabbt", "absolut", "barnen", "bör", "brukar", "bo", "behöva", "förbi", "början", "arbete", "brukade", "barnet",
  "behövs", "bär", "arbetar", "beslut", "bland", "jättebra", "bok", "farbror", "både", "bild", "bevisa", "brev", "boken",
  "arbeta", "ombord", "underbar", "bredvid", "båten", "tangentbordet", "tangentbord", "busshållplats", "smörgåsbord", "abborre",
  "kanelbulle", "kanelbullar", "kobbe", "badstrand", "och", "tack", "fick", "också", "gick", "precis", "chans", "klockan",
  "räcker", "skicka", "flicka", "vacker", "veckor", "vecka", "tillräckligt", "ögonblick", "dricka", "skickade", "veckan", "chef",
  "flickan", "snäcka", "knäckebröd", "luciatåg", "vårdcentral", "mycket", "tycker", "nya", "betyder", "lyssna", "fyra", "ny",
  "bryr", "tyst", "syster", "flytta", "skynda", "tyvärr", "tyckte", "skydda", "lycka", "synd", "lyssnar", "lycklig", "nyheter",
  "tydligen", "byta", "nyss", "bygga", "flyga", "kyrkan", "nyckeln", "byn", "by", "lyssnade", "kyckling", "yrken", "gympa",
  "bandy", "innebandy", "fyrtorn", "cykelhjälm", "bygd", "talsyntes", "syntolkning", "exakt", "fixa", "strax", "extra", "exempel",
  "växte", "text", "taxi", "växer", "vuxen", "växa", "vuxna", "byxor", "examen", "häxa", "experiment", "expert", "läxa",
  "extremt", "axel", "explosion", "växt", "explodera", "läxor", "växter", "lax", "yxa", "kex", "växla", "sax", "blixt", "boxning",
  "blixtlås", "saxofon", "pixel", "dyslexi", "xylofon", "textil", "läxhjälp", "webb", "webbsida", "watt", "wienerbröd", "wifi",
  "wok", "webbläsare", "pizza", "zoo", "jazz", "zon", "zebra", "pizzeria", "mozzarella", "zucchini", "gazell", "quiz", "idé",
  "armé", "idéer", "succé", "turné", "entré", "kafé", "kaféet", "trofé", "kommitté", "gelé", "kliché", "orkidé", "matiné", "allé",
];

/** Der Themenwortschatz je Inhaltsstufe (Kinder 141, Jugend 77, Erwachsene 72). */
export const STUFE_VOCAB_SV: Record<InhaltsStufe, string[]> = {
  kids: [
    "skola", "klass", "lärare", "elev", "rast", "bänk", "penna", "sudd", "linjal", "sax", "bok", "läxa", "ryggsäck", "matsal",
    "skolgård", "lov", "sommarlov", "kompis", "lek", "leka", "boll", "hopprep", "gunga", "rutschkana", "sandlåda", "cykel", "pulka",
    "skidor", "skridskor", "snögubbe", "snöboll", "hund", "katt", "kanin", "häst", "ko", "får", "gris", "höna", "älg", "ren", "räv",
    "björn", "ekorre", "igelkott", "uggla", "säl", "fjäril", "myra", "mamma", "pappa", "syster", "bror", "mormor", "morfar",
    "farmor", "farfar", "familj", "hus", "rum", "säng", "kudde", "täcke", "lampa", "fönster", "dörr", "kök", "frukost", "lunch",
    "middag", "mellanmål", "mjölk", "saft", "vatten", "bröd", "smör", "ost", "gröt", "pannkaka", "äpple", "banan", "päron",
    "jordgubbe", "blåbär", "glass", "bulle", "fika", "kaka", "tårta", "sol", "regn", "snö", "vind", "moln", "himmel", "stjärna",
    "måne", "sommar", "vinter", "vår", "höst", "skog", "sjö", "hav", "strand", "fjäll", "berg", "sten", "blomma", "träd", "gräs",
    "bad", "simma", "båt", "tåg", "buss", "färja", "midsommar", "lucia", "jul", "påsk", "kalas", "present", "ljus", "sång", "dans",
    "glad", "ledsen", "arg", "rädd", "trött", "snäll", "rolig", "liten", "stor", "röd", "blå", "gul", "grön", "vit", "svart",
  ],
  teens: [
    "vänskap", "kompisar", "förtroende", "respekt", "hemlighet", "skämt", "gymnasiet", "gymnasieval", "betyg", "prov", "projekt",
    "praktik", "framtid", "yrke", "mobil", "app", "dator", "programmera", "lösenord", "nätet", "algoritm", "spel", "podd", "musik",
    "låt", "konsert", "band", "festival", "träning", "match", "lag", "tävling", "parasport", "medalj", "rekord", "klimat", "miljö",
    "återvinning", "skärgård", "vattenkraft", "vindkraft", "hållbar", "rättvisa", "minoritet", "samer", "samiska", "finlandssvensk",
    "tvåspråkig", "dialekt", "resa", "tåg", "färja", "vandring", "fjällvandring", "allemansrätten", "lägereld", "sommarjobb", "lön",
    "pengar", "spara", "drömmar", "känslor", "självkänsla", "kärlek", "föräldrar", "syskon", "fritid", "förening", "kör", "teater",
    "film", "serie", "bibliotek", "nyheter", "källkritik", "demokrati", "elevråd",
  ],
  erwachsen: [
    "arbete", "jobb", "kollega", "chef", "kontor", "möte", "lön", "skatt", "semester", "föräldraledighet", "försäkring", "ansökan",
    "blankett", "intyg", "myndighet", "kommun", "region", "personnummer", "legitimation", "bank", "konto", "räkning", "hyra",
    "lägenhet", "bostad", "hyresvärd", "bostadsrätt", "grannar", "vårdcentral", "läkare", "sjuksköterska", "recept", "apotek",
    "tandläkare", "hälsa", "sjukskriven", "förskola", "utbildning", "kurs", "komvux", "språkkurs", "medborgarskap",
    "uppehållstillstånd", "integration", "val", "riksdag", "regering", "demokrati", "nyheter", "tidning", "kultur", "museum",
    "teater", "bibliotek", "pension", "ekonomi", "budget", "elräkning", "kollektivtrafik", "pendla", "matbutik", "kvitto",
    "reklamation", "garanti", "avtal", "facket", "arbetstid", "deltid", "heltid", "distansarbete", "körkort", "hemförsäkring",
  ],
};
