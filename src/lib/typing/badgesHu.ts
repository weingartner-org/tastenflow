/**
 * ★★★ DER ABZEICHEN-KATALOG UNGARISCH (O-HU, 29.10.2026).
 *
 * Gegenstück zu `badgesCs.ts` - dieselbe Bauart, dieselben Schlüssel, NEU AUF UNGARISCH GESCHRIEBEN, nicht übersetzt (Glossar
 * `recherche-ungarisch-2026-10-25/GLOSSAR-hu.md` §2.4): übertragen ist die IDEE des Namens. Wo das Ungarische eine eigene
 * Wendung zum Motiv hat, steht sie da („Telitalálat" zur Zielscheibe, „Hangyaszorgalom", „Mint az óramű", „Könyvmoly",
 * „Sziklaszilárd", „Tiszta lap", „Vörös fonal", „Egy ültő helyében", „Az én házam az én váram", „Teljes gőzzel előre!");
 * sonst ein Stabreim wie im Deutschen („Pontos pingvin", „Lelkes leopárd", „Nyargaló nyúl", „Szökellő szarvas", „Ráérős
 * lajhár").
 *
 * ★ Ungarisch hat kein grammatisches Geschlecht (Glossar Regel 2) - trotzdem Tiere und Dinge statt Personenwörtern (kein
 * „bajnok", „mester", „hős" für das Kind). Die Beschreibungen sind Sätze über die Sache („5 befejezett lecke.", „Feloldva:
 * …", „Gyakorlás 7 különböző napon.") und gelten für Kinder und Erwachsene.
 *
 * ★ Mehrzahl (Glossar §2.11, Regel 13): nach einer Zahl steht das Hauptwort in der EINZAHL („5 kör", „3 történet"). Wo eine
 * Zahl von aussen kommt (`z.fische` usw.), geht sie trotzdem über {@link hu} (`Intl.PluralRules("hu-HU")`, one/other - beide
 * Formen gleich). Zahlen mit `toLocaleString("hu-HU")`: vierstellig ohne Trenner („1000"), ab fünf Stellen mit U+00A0
 * („10 000"); Prozent „95%" ohne Leerzeichen (Regel 5), Dezimalkomma („0,5%").
 *
 * ★ Keine Zahl mit Punkt am Satzende (Glossar §4 Falle 4): Uhrzeiten in Worten („este kilenc óra után"), Summen in Klammern
 * („(összesen 30 lecke)"). Keine Endung an einer Zahl von aussen (Regel 12): „egy 7 napnál hosszabb szünet" hängt die
 * Endung an „nap", nie an die Zahl. Ordnungszahlen nur als „5. szint" mitten im Satz.
 *
 * Grossschreibung: nur das erste Wort und Eigennamen (Regel 9: „Visszhangbarlang", „Hóvihar", „Sarki állomás", „Sarki
 * expedíció", „Jégtáblák"). Die trockenen Zweitnamen (`nameNeutral`, ab 11 Jahren) genau dort, wo das Englische einen hat.
 * Glossar: jelvény, kör, leütés, pontosság, hiba, alapállás, alapsor, alapbillentyűk, számsor, rész (Etappe einer
 * Geschichte), pontkör, nehézségi szint, kiindulópont, történet, Jégtáblák, Sarki expedíció; „biztos" für „sitzt".
 *
 * ⚠️ Wer ein Abzeichen anlegt, trägt es HIER mit ein - jede ID aus `ABZEICHEN_EN` braucht einen ungarischen Eintrag und einen
 * Zweitnamen genau dort, wo das Englische einen hat (Wächter `tests/tastenflow-abzeichen-hu.test.ts`).
 * ⚠️ Alles [G] im Sinne des Glossars: von einer Person mit Ungarisch als Erstsprache noch nicht gelesen.
 */
import { lernwegDef } from "./lernweg";
import { lektionenFuer } from "./curriculum";
import type { AbzeichenTextEn, AbzeichenZahlen } from "./badgesEn";

/** Dieselbe Form wie der englische Eintrag. */
export type AbzeichenTextHu = AbzeichenTextEn;

/** Die Mehrzahl-Regel des Ungarischen (CLDR): one · other (Glossar §2.11). */
const PLURAL_HU = new Intl.PluralRules("hu-HU");

/** Eine Zahl wie in Ungarn geschrieben - „1000", „10 000" (U+00A0 erst ab fünf Stellen, Glossar Regel 5). */
function zahl(n: number): string {
  return n.toLocaleString("hu-HU");
}

/**
 * Zahl mit der passenden Form: `hu(5, "nap", "nap")`. Nach einer Zahl ist das ungarische Hauptwort Einzahl (Regel 13) - die
 * beiden Formen sind darum meist gleich; die Funktion steht trotzdem da (einheitlicher Code, Glossar §2.11).
 */
function hu(n: number, one: string, other: string): string {
  return `${zahl(n)} ${PLURAL_HU.select(n) === "one" ? one : other}`;
}

/** Die Zeichen von „alltags-ass", die es auf dem Weg des Kindes wirklich gibt (wie `badgesCs.ts`) - „@, € és $". */
function alltagsZeichen(z: AbzeichenZahlen): string {
  const reihe = new Set(lernwegDef(z.lernweg).introOrder);
  const da = ["@", "€", "$", "§"].filter((c) => reihe.has(c));
  if (da.length <= 1) return da.join("");
  return `${da.slice(0, -1).join(", ")} és ${da[da.length - 1]}`;
}

/** Die Familien (Überschriften im Regal) - Schlüssel ist der deutsche `group`-Name (Glossar §2.4). */
export const ABZEICHEN_GRUPPEN_HU: Readonly<Record<string, string>> = {
  Fehlerfrei: "Hibátlanul",
  "Saubere Serie": "Tiszta körök",
  Fleiß: "Szorgalom",
  Anschläge: "Leütések",
  Dranbleiben: "Kitartás",
  Übungswochen: "Gyakorlóhetek",
  Sterne: "Csillagok",
  Lektionen: "Leckék",
  Stufen: "Szintek",
  Tastenwelt: "Billentyűvilág",
  "Sitzt!": "Megy már!",
  Tempo: "Sebesség",
  "Am Stück": "Egy szuszra",
  Meisterprüfung: "Mesterfokon",
  Abenteuer: "Kaland",
  "Abenteuer-Kunststücke": "Kalandos mutatványok",
  Expedition: "Expedíció",
  Geschichten: "Történetek",
  Lesestunde: "Olvasóóra",
  "Lese-Kunststücke": "Olvasási mutatványok",
  Geheim: "Titkos",
};

/** Der ganze Katalog ungarisch, je Abzeichen-ID. */
export const ABZEICHEN_HU: Readonly<Record<string, AbzeichenTextHu>> = {
  // ── Hibátlanul ───────────────────────────────────────────────────────────
  volltreffer: { name: "Telitalálat", description: "Egy teljes kör egyetlen hiba nélkül.", bildbeschreibung: "céltábla, a közepén egy nyíllal" },
  "null-fehler-ninja": { name: "Hibátlan nindzsa", description: "5 kör egyetlen hiba nélkül.", bildbeschreibung: "nindzsa" },
  "makellos-meister": { name: "Ragyogó csillagok", description: "15 kör egyetlen hiba nélkül.", bildbeschreibung: "három csillogó csillag" },
  "diamant-finger": { name: "Gyémántujjak", description: "40 kör egyetlen hiba nélkül.", bildbeschreibung: "kék drágakő" },
  // „tiszta lappal indul" - die weisse Weste des Ungarischen.
  "weisse-weste": { name: "Tiszta lap", description: "80 kör egyetlen hiba nélkül.", bildbeschreibung: "fehér galamb" },
  "einhorn-finger": { name: "Egyszarvú ujjak", nameNeutral: "150 hibátlan kör", description: "150 kör egyetlen hiba nélkül.", bildbeschreibung: "egyszarvú" },
  // ── Tiszta körök ─────────────────────────────────────────────────────────
  "praezisions-pinguin": { name: "Pontos pingvin", nameNeutral: "Háromszor tisztán", description: "3 tiszta kör egymás után (legalább 95% pontosság).", bildbeschreibung: "pingvin" },
  adlerauge: { name: "Sasszem", description: "7 tiszta kör egymás után (legalább 95% pontosság).", bildbeschreibung: "sas" },
  "laser-lama": { name: "Lézeres láma", nameNeutral: "Lézer üzemmód", description: "15 tiszta kör egymás után (legalább 95% pontosság).", bildbeschreibung: "láma" },
  "eiskalte-serie": { name: "Jéghideg nyugalom", description: "25 tiszta kör egymás után (legalább 95% pontosság).", bildbeschreibung: "jégkocka" },
  // ── Szorgalom ────────────────────────────────────────────────────────────
  "tasten-kueken": { name: "Billentyűcsibe", nameNeutral: "Első kör", description: "Az első kör kész.", bildbeschreibung: "tojásból kibújó csibe" },
  // „hangyaszorgalom" = Ameisenfleiss, eine feste Wendung.
  "ausdauer-ameise": { name: "Hangyaszorgalom", nameNeutral: "Bemelegítve", description: "25 kör gyakorlás.", bildbeschreibung: "hangya" },
  "marathon-maus": { name: "Maratoni egérke", nameNeutral: "Száz kör", description: "100 kör gyakorlás.", bildbeschreibung: "egér feje" },
  "munteres-murmeltier": { name: "Serény hód", nameNeutral: "Maraton", description: "250 kör gyakorlás.", bildbeschreibung: "hód" },
  dauerlaeufer: { name: "Hosszú táv", description: "500 kör gyakorlás.", bildbeschreibung: "futó ember" },
  // Wie „Ezeregy éjszaka".
  tausendsassa: { name: "Ezeregy kör", nameNeutral: "Ezer kör", description: `${zahl(1000)} kör gyakorlás.`, bildbeschreibung: "vizet fújó bálna" },
  // ── Leütések ─────────────────────────────────────────────────────────────
  "tausend-tasten-tiger": { name: "Ezerbillentyűs tigris", nameNeutral: "Ezer helyes leütés", description: `${zahl(1000)} helyes leütés.`, bildbeschreibung: "tigris feje" },
  "tasten-t-rex": { name: "Billentyűs T-rex", nameNeutral: "Tízezer helyes leütés", description: `${zahl(10000)} helyes leütés.`, bildbeschreibung: "T-rex" },
  "galaktische-fingerspitzen": { name: "Galaktikus ujjbegyek", description: `${zahl(50000)} helyes leütés.`, bildbeschreibung: "felszálló rakéta" },
  "hunderttausend-held": { name: "Százezer villám", nameNeutral: "Százezer helyes leütés", description: `${zahl(100000)} helyes leütés.`, bildbeschreibung: "sárga villám" },
  viertelmillion: { name: "Negyedmillió", description: `${zahl(250000)} helyes leütés - annyi betű, amennyi egy egész könyvben van.`, bildbeschreibung: "műhold" },
  // ── Kitartás ─────────────────────────────────────────────────────────────
  "dranbleib-dachs": { name: "Kitartó borz", nameNeutral: "Kitartás", description: "Gyakorlás 3 különböző napon.", bildbeschreibung: "borz" },
  gewohnheitstier: { name: "Hűséges teknős", description: "Gyakorlás 7 különböző napon.", bildbeschreibung: "teknős" },
  // „pontos, mint az óramű".
  "wie-ein-uhrwerk": { name: "Mint az óramű", description: "Gyakorlás 20 különböző napon.", bildbeschreibung: "piros ébresztőóra" },
  unaufhaltsam: { name: "Megállíthatatlanul", description: "Gyakorlás 50 különböző napon.", bildbeschreibung: "hegy havas csúccsal" },
  "tief-verwurzelt": { name: "Mély gyökerek", description: "Gyakorlás 100 különböző napon.", bildbeschreibung: "zöld lombos fa" },
  "fels-in-der-brandung": { name: "Sziklaszilárd", description: "Gyakorlás 200 különböző napon - majdnem egy egész tanév minden napján.", bildbeschreibung: "kőszobor a Húsvét-szigetről" },
  // ── Gyakorlóhetek ────────────────────────────────────────────────────────
  "vierteljahr-dabei": { name: "Már negyed éve", description: "Gyakorlás 12 különböző héten.", bildbeschreibung: "barna őszi falevél" },
  "halbes-jahr-dabei": { name: "Már fél éve", description: "Gyakorlás 26 különböző héten.", bildbeschreibung: "felhő, amelyből hó hull" },
  "ganzes-jahr-dabei": { name: "Egy egész év", description: "Gyakorlás 52 különböző héten.", bildbeschreibung: "születésnapi torta gyertyával" },
  // ── Csillagok ────────────────────────────────────────────────────────────
  sternschnuppe: { name: "Hullócsillag", description: "Az első kör 3 csillaggal.", bildbeschreibung: "hullócsillag az éjszakai égen" },
  "sternen-sammler": { name: "Egy marék csillag", description: "10 kör 3 csillaggal.", bildbeschreibung: "ragyogó sárga csillag" },
  sternenhimmel: { name: "Csillagos ég", description: "30 kör 3 csillaggal.", bildbeschreibung: "a Tejút az éjszakai égen" },
  sternenmeer: { name: "Csillagtenger", description: "75 kör 3 csillaggal.", bildbeschreibung: "narancssárga nyolcágú csillag" },
  // ── Leckék ───────────────────────────────────────────────────────────────
  "lektions-loewe": { name: "Leckefaló oroszlán", nameNeutral: "Öt lecke", description: "5 befejezett lecke.", bildbeschreibung: "oroszlán" },
  "kapitel-kaeptn": { name: "Teljes gőzzel előre!", description: "15 befejezett lecke.", bildbeschreibung: "horgony" },
  // Die Lektionszahl DES WEGES in Klammern - keine Zahl mit Punkt am Satzende (Falle 4).
  "lehrgangs-legende": { name: "Tanfolyamlegenda", description: (z) => `A tanfolyam minden leckéje befejezve (összesen ${hu(lektionenFuer(z.lernweg).length, "lecke", "lecke")}).`, bildbeschreibung: "arany kupa" },
  // ── Szintek (pontkör) ────────────────────────────────────────────────────
  "kletter-koala": { name: "Kapaszkodó koala", nameNeutral: "5. szint", description: "5. szint elérve a pontkörön.", bildbeschreibung: "koala" },
  "punkte-rakete": { name: "Pontrakéta", description: "10. szint elérve a pontkörön.", bildbeschreibung: "piros léggömb" },
  "gipfel-gaemse": { name: "Csúcsra törő kecske", nameNeutral: "20. szint", description: "20. szint elérve a pontkörön.", bildbeschreibung: "kecske" },
  hoehenflug: { name: "Magasan szállva", nameNeutral: "50. szint", description: "50. szint elérve a pontkörön.", bildbeschreibung: "helikopter" },
  "ueber-den-wolken": { name: "A felhők felett", nameNeutral: "100. szint", description: "100. szint elérve a pontkörön.", bildbeschreibung: "repülő csészealj" },
  sternenreise: { name: "Utazás a csillagokba", nameNeutral: "200. szint", description: "200. szint elérve a pontkörön.", bildbeschreibung: "üstökös hosszú csóvával" },
  // ── Billentyűvilág ───────────────────────────────────────────────────────
  // Die Grundreihe DES WEGES - auf Weg „hu": f j d k s l a é.
  "grundstellungs-gorilla": {
    name: "Alapsori gorilla",
    nameNeutral: "Kész az alapsor",
    description: (z) =>
      `Feloldva mind a nyolc alapbillentyű: ${lernwegDef(z.lernweg)
        .letterOrder.slice(0, lernwegDef(z.lernweg).homeRowLetters)
        .join(" ")}.`,
    bildbeschreibung: "gorilla",
  },
  "gross-baumeister": { name: "Nagybetűvár", nameNeutral: "Nagybetűk", description: "A Shift billentyű megy - igazi nagybetűk, saját kézzel.", bildbeschreibung: "négy nagybetű kék billentyűkön" },
  // ⚠️ „puenktchen-panda" und „schlangen-s" gibt es auf Weg „hu" nicht zu verdienen - der Eintrag steht trotzdem da, weil das
  // Regal jedes beschreibt (ungarisches ö und ü sind eigene Buchstaben; gemeint sind die deutschen).
  "puenktchen-panda": { name: "Pöttyös panda", nameNeutral: "Német pontos betűk", description: "Feloldott német betűk: ä, ö és ü.", bildbeschreibung: "panda" },
  "schlangen-s": { name: "Kígyózó S", nameNeutral: "A német sz", description: "Feloldott betű: ß, a német sz - a német billentyűzet utolsó betűje.", bildbeschreibung: "kígyó" },
  "alphabet-as": { name: "Az egész ábécé", description: "Feloldva az ábécé minden betűje.", bildbeschreibung: "kisbetűk kék billentyűkön" },
  "punkt-und-komma": { name: "Pont és vessző", description: "Feloldva a pont és a vessző - az első igazi írásjelek.", bildbeschreibung: "fekete töltőtoll" },
  "satzzeichen-sammler": { name: "Írásjelek gyűjteménye", nameNeutral: "Minden írásjel", description: "Feloldott írásjelek: . , - ? ! : ;", bildbeschreibung: "nagy piros felkiáltójel" },
  // „számos" = zahlreich - ein Wortspiel mit „szám" (Zahl).
  "zahlen-zebra": { name: "Számos zebra", nameNeutral: "A számsor fele", description: "Feloldva öt számjegy a számsorról.", bildbeschreibung: "zebra" },
  "zahlen-zauberer": { name: "Számvarázs", nameNeutral: "A teljes számsor", description: "Feloldva a teljes számsor, mind a tíz számjegy.", bildbeschreibung: "kék billentyű a tízes számmal" },
  "klammer-krokodil": { name: "Zárójeles krokodil", nameNeutral: "Nyitó és záró zárójel", description: "Feloldva a kerek zárójel ( ) - az első szimbólumok.", bildbeschreibung: "krokodil" },
  "alltags-ass": { name: "Mindennapi jelek", nameNeutral: "Hétköznapi jelek", description: (z) => `Feloldva: ${alltagsZeichen(z)} - jelek az e-mailekhez és a pénzhez.`, bildbeschreibung: "boríték" },
  "tastatur-krone": { name: "A billentyűzet koronája", nameNeutral: "Az egész billentyűzet", description: "Feloldva a billentyűzet MINDEN billentyűje - egészen az utolsó szimbólumig.", bildbeschreibung: "aranykorona" },
  // ── Megy már! ────────────────────────────────────────────────────────────
  "feste-burg": { name: "Az én házam az én váram", nameNeutral: "Biztos alapsor", description: "Mind a nyolc alapbillentyű biztos.", bildbeschreibung: "ház" },
  "buchstaben-baendiger": { name: "Megszelídített betűk", nameNeutral: "Minden betű biztos", description: "Minden egyes betű biztos - egyik sem bizonytalan már.", bildbeschreibung: "piros négyzet nagy A betűvel" },
  "zahlen-fels": { name: "Kőkemény számok", nameNeutral: "Minden számjegy biztos", description: "A teljes számsor biztos.", bildbeschreibung: "golyós számolótábla színes golyókkal" },
  "nichts-wackelt": { name: "Semmi sem inog", description: "A billentyűzet minden billentyűje biztos - az egész billentyűzet, nem csak a feloldott billentyűk.", bildbeschreibung: "kék rombusz, a közepén egy ponttal" },
  // ── Sebesség ─────────────────────────────────────────────────────────────
  "flinker-fuchs": { name: "Fürge róka", nameNeutral: "Gyorsan és pontosan", description: "Sebességcél teljesítve ÉS legalább 95% pontosság - a gyorsaság csak akkor számít, ha pontos.", bildbeschreibung: "róka" },
  "tempo-60": { name: "Nyargaló nyúl", nameNeutral: "Percenként 60, pontosan", description: "Egy kör percenként 60 leütéssel, legalább 95% pontossággal.", bildbeschreibung: "nyúl" },
  "tempo-90": { name: "Szökellő szarvas", nameNeutral: "Percenként 90, pontosan", description: "Egy kör percenként 90 leütéssel, legalább 95% pontossággal.", bildbeschreibung: "szarvas" },
  "tempo-120": { name: "Vágtató ló", nameNeutral: "Percenként 120, pontosan", description: "Egy kör percenként 120 leütéssel, legalább 98% pontossággal.", bildbeschreibung: "vágtató ló" },
  "tempo-160": { name: "Gőzmozdony", nameNeutral: "Percenként 160, pontosan", description: "Egy kör percenként 160 leütéssel, legalább 98% pontossággal.", bildbeschreibung: "gőzmozdony" },
  "tempo-200": { name: "Gyorsvonat", nameNeutral: "Percenként 200, pontosan", description: "Egy kör percenként 200 leütéssel, legalább 98% pontossággal - gyakorlott gépírók szintje.", bildbeschreibung: "nagy sebességű vonat" },
  "tempo-300": { name: "Sugárhajtású gép", nameNeutral: "Percenként 300, pontosan", description: "Egy kör percenként 300 leütéssel, legalább 99% pontossággal - profi szint.", bildbeschreibung: "kis repülőgép" },
  // ── Egy szuszra ──────────────────────────────────────────────────────────
  "kette-100": { name: "Láncreakció", nameNeutral: "100 egymás után", description: "100 helyes leütés egymás után, egyetlen hiba nélkül.", bildbeschreibung: "két láncszem" },
  "kette-250": { name: "Botlás nélkül", description: "250 helyes leütés egymás után.", bildbeschreibung: "több szemből álló lánc" },
  // „vörös fonal" = der rote Faden, auch im Ungarischen.
  "kette-500": { name: "Vörös fonal", nameNeutral: "500 egymás után", description: "500 helyes leütés egymás után - több mint egy egész kör.", bildbeschreibung: "cérnaorsó" },
  "kette-1000": { name: "Ezer hiba nélkül", description: `${zahl(1000)} helyes leütés egymás után.`, bildbeschreibung: "a Fudzsi hegy hósapkával" },
  "kette-2000": { name: "Vaslánc", nameNeutral: `${zahl(2000)} egymás után`, description: `${zahl(2000)} helyes leütés egymás után - négy-öt kör a legkisebb botlás nélkül.`, bildbeschreibung: "vulkán, amelyből láva folyik" },
  // ── Kaland (Jégtáblák, Glossar §2.3) ─────────────────────────────────────
  "erste-expedition": { name: "Első expedíció", description: "Az első kaland a Jégtáblák játékban, szabad játékban, egészen az igluig.", bildbeschreibung: "iránytű" },
  polarforscher: { name: "Sarki felfedezések", description: "10 befejezett kaland a Jégtáblák játékban, szabad játékban.", bildbeschreibung: "hópehely" },
  "eismeer-legende": { name: "A jeges tenger legendája", description: "30 befejezett kaland a Jégtáblák játékban, szabad játékban.", bildbeschreibung: "magas kék hullám" },
  "packeis-profi": { name: "Otthon a jégmezőn", nameNeutral: "60 kaland", description: "60 befejezett kaland a Jégtáblák játékban, szabad játékban.", bildbeschreibung: "bőrönd" },
  // ── Kalandos mutatványok ─────────────────────────────────────────────────
  // „Trockener Frack": der Frack ist der Pinguin selbst - ungarisch „frakk".
  "trockener-frack": { name: "Száraz frakk", description: "Egy egész kaland anélkül, hogy a pingvin egyszer is a vízbe vagy a hóba esne.", bildbeschreibung: "fekete cilinder" },
  "immer-trocken": { name: "Mindig szárazon", description: (z) => `${hu(z.trockeneAbenteuer, "kaland", "kaland")} egyetlen csobbanás nélkül.`, bildbeschreibung: "összecsukott esernyő" },
  fischfaenger: { name: "Jó fogás", description: (z) => `${hu(z.fische, "bónuszhal", "bónuszhal")} kifogva a Jégtáblák játékban.`, bildbeschreibung: "kék hal" },
  // ── Expedíció ────────────────────────────────────────────────────────────
  // Die Zonennamen wie im Spiel (Glossar §2.3): Visszhangbarlang, Hóvihar, Sarki állomás.
  "hoehlen-lauscher": { name: "Denevérfül", description: "Végig a Visszhangbarlangon a kijáratig - sötétben, csak hallás alapján.", bildbeschreibung: "denevér" },
  "sturm-trotzer": { name: "Dacolás a hóviharral", description: "Túl a Hóviharon - a jelcsoportok fejből begépelve.", bildbeschreibung: "szelet fújó arc" },
  "funker-freund": { name: "Rádiós barátság", description: "Egy egész rádióüzenet megfejtve és elküldve a Sarki állomáson.", bildbeschreibung: "rádió" },
  "polarlicht-entdecker": { name: "A sarki fény alatt", description: "Az egész Sarki expedíció egyetlen hiba nélkül - táncol a sarki fény.", bildbeschreibung: "csillag szikrázó csóvával" },
  // ── Történetek ───────────────────────────────────────────────────────────
  "lese-luchs": { name: "Lelkes leopárd", nameNeutral: "Első történet", description: "Az első történet elolvasva és begépelve a végéig.", bildbeschreibung: "leopárd" },
  buecherwurm: { name: "Könyvmoly", description: "3 történet elolvasva a végéig.", bildbeschreibung: "zöld hernyó" },
  "buecherei-baer": { name: "Könyvtári medve", nameNeutral: "Nyolc történet", description: "8 történet elolvasva a végéig.", bildbeschreibung: "medve" },
  vielleser: { name: "Könyvhegy", description: "15 történet elolvasva a végéig.", bildbeschreibung: "színes könyvek halma" },
  // ── Olvasóóra (rész = Etappe einer Geschichte) ───────────────────────────
  "seiten-spatz": { name: "Lapozó veréb", nameNeutral: "Első oldal", description: "Egy történet első része begépelve.", bildbeschreibung: "kis kék madár" },
  "kapitel-krake": { name: "Olvasott polip", nameNeutral: "Tíz rész", description: "10 rész elolvasva és begépelve.", bildbeschreibung: "polip" },
  "geschichten-gigant": { name: "Elefántnyi történet", description: "30 rész elolvasva és begépelve.", bildbeschreibung: "elefánt" },
  leseratte: { name: "Végtelen olvasás", nameNeutral: "75 rész", description: "75 rész elolvasva és begépelve.", bildbeschreibung: "pergamentekercs" },
  // ── Olvasási mutatványok ─────────────────────────────────────────────────
  federleicht: { name: "Pehelykönnyű", description: "Egy egész rész begépelve egyetlen hiba nélkül.", bildbeschreibung: "fehér madártoll" },
  // „egy ültő helyében" = in einem Rutsch, ohne aufzustehen.
  "in-einem-rutsch": { name: "Egy ültő helyében", description: "Egy egész történet elolvasva a végéig egyetlen nap alatt.", bildbeschreibung: "kék spirál" },
  "lesezeichen-held": { name: "Könyvjelző a helyén", description: "Egy másik napon az olvasás pontosan ott folytatódott, ahol legutóbb abbamaradt.", bildbeschreibung: "könyvjelző" },
  // ── Mesterfokon (Glossar §2.4: nie „vizsga") ────────────────────────────
  "zehn-minuten-abschrift": { name: "Tízperces másolás", description: "Tíz perc gépelés egyben, legfeljebb 0,5% hibával - pontosan, ahogy a hagyományos másolási verseny kéri.", bildbeschreibung: "stopperóra" },
  "lehrgangs-meister": { name: "A tanfolyam mesterfokon", description: (z) => `A tanfolyam minden leckéje befejezve, mindegyik három csillaggal (összesen ${hu(lektionenFuer(z.lernweg).length, "lecke", "lecke")}).`, bildbeschreibung: "fekete diplomasapka" },
  "goldene-tastatur": { name: "Az arany billentyűzet", description: "Minden billentyű feloldva és biztos - és egyszer percenként 160 leütés 98% pontossággal. Az utolsó jelvény.", bildbeschreibung: "sportérem szalagon" },
  // ── Titkos ───────────────────────────────────────────────────────────────
  "gemuetliches-faultier": { name: "Ráérős lajhár", description: "Szép lassan, de egyetlen hiba nélkül - a pontosság többet ér a gyorsaságnál!", bildbeschreibung: "lajhár" },
  "comeback-kaenguru": { name: "Kenguruugrás", description: "Egy 3 csillagos kör közvetlenül egy 1 csillagos kör után.", bildbeschreibung: "kenguru" },
  // Uhrzeiten in Worten - keine Zahl mit Punkt am Satzende (Falle 4).
  nachteule: { name: "Éjjeli bagoly", description: "Egy kör befejezve este kilenc óra után.", bildbeschreibung: "bagoly" },
  // „Ki korán kel, aranyat lel."
  "frueher-vogel": { name: "Korán kelő kakas", description: "Egy kör befejezve reggel hét óra előtt.", bildbeschreibung: "kakas" },
  nimmersatt: { name: "Olvasási étvágy", description: "3 rész elolvasva egyetlen nap alatt.", bildbeschreibung: "zöld alma" },
  "ferien-held": { name: "Nyári szünet a billentyűzetnél", description: "Gyakorlás a nyári szünet közepén - júliusban vagy augusztusban.", bildbeschreibung: "tengerpart napernyővel" },
  "wochenend-schreiber": { name: "Hétvégi gépelés", description: "Gyakorlás szombaton és vasárnap is.", bildbeschreibung: "naptárlap" },
  // Die Endung hängt an „nap", nie an der Zahl (Regel 12).
  "zurueck-im-sattel": { name: "Újra nyeregben", description: (z) => `Újra gyakorlás egy ${hu(z.pauseTage, "napnál", "napnál")} hosszabb szünet után - a visszatérés is számít.`, bildbeschreibung: "két nyíl körben" },
  "doppelt-genaeht": { name: "Dupla öltés", description: "Két hibátlan kör közvetlenül egymás után.", bildbeschreibung: "tű cérnával" },
  winterkind: { name: "Téli billentyűk", description: "Gyakorlás a tél közepén - decemberben vagy januárban.", bildbeschreibung: "hóember" },
  jahreswechsel: { name: "Szilveszter és újév", description: "Gyakorlás az év utolsó napján vagy az új év első napján.", bildbeschreibung: "tűzijáték az éjszakai égen" },
  "tages-marathon": { name: "Egynapos maraton", description: "Tíz kör egyetlen nap alatt.", bildbeschreibung: "zsoké versenylovon" },
  sternentag: { name: "Csillagos nap", description: "Három kör három csillaggal egyetlen nap alatt.", bildbeschreibung: "mosolygó arcú nap" },
  blitzsauber: { name: "Tisztára mosva", description: "Három hibátlan kör egyetlen nap alatt.", bildbeschreibung: "szappan habbal" },
  "volle-woche": { name: "Teljes hét", description: "Gyakorlás öt különböző napon EGY héten belül.", bildbeschreibung: "zöld könyv" },
  // „Blindflug" ⇒ „Kukucskálás nélkül": zum Affen, der sich die Augen zuhält. Glossar Regel 4: nie „vakon".
  blindflug: { name: "Kukucskálás nélkül", description: "Egy egész hibátlan kör - elrejtett képernyő-billentyűzettel. Erről szól a tízujjas gépelés.", bildbeschreibung: "majom, amely eltakarja a szemét" },
  sprachwechsler: { name: "Utazás a nyelvek között", description: "Gyakorlás két nyelven - például magyarul és angolul.", bildbeschreibung: "földgömb Európával és Afrikával" },
  lesenacht: { name: "Esti olvasás", description: "Egy történetrész elolvasva este nyolc óra után.", bildbeschreibung: "mosolygó arcú hold" },
  "zaehe-taste": { name: "Makacs billentyű", description: "Egy billentyű, amely sokáig nehéz volt, most már biztos.", bildbeschreibung: "csiga" },
  aufsteiger: { name: "Felfelé", description: "Öt nehézségi szinttel magasabban, mint a kiindulópont.", bildbeschreibung: "grafikon emelkedő vonallal" },
  // ── Nur auf Weg „fr" (`badgesNurFr.ts`) - für eine ungarische Bedienung auf diesem Weg; dieselben Gedanken wie dort.
  "akzente-ziffernreihe": { name: "Ékezetakrobatika", nameNeutral: "é, è, ç és à", description: "Feloldott betűk: é, è, ç és à - betűk, amelyek a számsoron laknak.", bildbeschreibung: "1 2 3 4 számjegy egy kék billentyűn" },
  "accent-circonflexe": { name: "Kis kalap", nameNeutral: "A francia kalap", description: "A ^ holtbillentyű biztos: ê, â, î, ô és û.", bildbeschreibung: "szalmakalap szalaggal" },
  trema: { name: "Kétpöttyös katica", nameNeutral: "Két pont", description: "A ¨ holtbillentyű biztos: ë, ï és ü.", bildbeschreibung: "katica" },
};
