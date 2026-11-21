/**
 * ★★★ DER ABZEICHEN-KATALOG TSCHECHISCH (O-CS, 03.10.2026).
 *
 * Gegenstück zu `badgesPl.ts`/`badgesTr.ts` - dieselbe Bauart, dieselben
 * Schlüssel, NEU AUF TSCHECHISCH GESCHRIEBEN, nicht übersetzt (Glossar
 * Tschechisch §2.4): übertragen ist die IDEE des Namens. Wo das Tschechische
 * eine eigene Wendung zum Motiv hat, steht sie da („Trefa do černého" zur
 * Zielscheibe, „Jako hodinky", „Knihomol", „Ranní ptáče", „Červená nit",
 * „Čistý štít", „Na jeden zátah", „Můj dům, můj hrad", „Jako ze škatulky",
 * „Plnou parou vpřed!"); sonst ein Stabreim wie im Deutschen („Trefný
 * tučňák", „Bystrý bobr", „Svižná srnka", „Loudavý lenochod", „Tygr tisíce
 * kláves").
 *
 * ★★★ Geschlecht nie raten (Glossar Regel 2): KEINE Personenwörter für das
 * Kind („Mistr", „Vítěz", „Šampion", „Krotitel", „Stavitel", „Polárník" wären
 * männlich), Adjektive nur an einem Tier oder Ding („Pilný mravenec",
 * „Diamantové prsty"), nie an „ty". Darum auch nicht „Pevný jako skála" (das
 * Adjektiv hinge am Kind) ⇒ „Jako skála". Die Beschreibungen sind Sätze über
 * die Sache - Hauptwort mit Partizip („5 dokončených lekcí"), kurzes Passiv
 * am Ding („Odemčena tečka a čárka") oder Zahl + Hauptwort („100 kol
 * cvičení") - nie Vergangenheit 2. Person („Napsal jsi ...").
 *
 * ★ Mehrzahl (Glossar §2.11): Die festen Zahlen stehen mit der Form, die zu
 * IHR gehört (3 čistá kola · 7 čistých kol · 52 různých týdnů - 52 ist im
 * Tschechischen „other", anders als im Polnischen). Wo eine Zahl von aussen
 * kommt (`z.fische` usw.), wählt {@link cs} die Form über
 * `Intl.PluralRules("cs-CZ")`. „dobrodružství" ist in allen Formen gleich.
 * Zahlen ab 1 000 mit geschütztem Leerzeichen (` `, Glossar Regel 5),
 * Prozent „95 %" mit geschütztem Leerzeichen, Dezimalkomma („0,5 %").
 *
 * ★ Keine Zahl mit Punkt am Satzende (Glossar §4 Falle 4): Uhrzeiten in
 * Worten („po deváté hodině večer"), Summen in Klammern („(celkem 30)").
 * Keine feste Präposition vor einer Zahl (Falle 5): „za 3 hvězdičky" statt
 * „se 3 hvězdičkami".
 *
 * Grossschreibung wie im Tschechischen: nur das erste Wort und Eigennamen
 * („Jeskyně ozvěny", „Sněhová bouře", „Polární stanice", „Polární výprava").
 * Die trockenen Zweitnamen (`nameNeutral`, ab 11 Jahren) genau dort, wo das
 * Deutsche einen hat. Glossar: odznak, kolo, úhoz, přesnost, chyba, základní
 * postavení, základní řada, číselná řada, díl (Etappe), kruh bodů, úroveň
 * obtížnosti, výchozí bod, příběh, Ledové kry, Polární výprava; „cíl" bleibt
 * dem Wochenziel, „meta" dem nächsten Ziel. „řada" ist die Tastenreihe -
 * darum „za sebou", nie „v řadě".
 *
 * ⚠️ Wer ein Abzeichen anlegt, trägt es HIER mit ein - jede ID braucht einen
 * tschechischen Eintrag und einen Zweitnamen genau dort, wo es ihn im
 * Deutschen gibt.
 */
import { lernwegDef } from "./lernweg";
import { lektionenFuer } from "./curriculum";
import type { AbzeichenTextEn, AbzeichenZahlen } from "./badgesEn";

/** Dieselbe Form wie der englische Eintrag. */
export type AbzeichenTextCs = AbzeichenTextEn;

/** Die Mehrzahl-Regel des Tschechischen (CLDR): one · few · many · other (Glossar §2.11). */
const PLURAL_CS = new Intl.PluralRules("cs-CZ");

/**
 * Zahl mit der passenden Form: `cs(5, "den", "dny", "dní", "dne")`. `many`
 * gilt nur für Bruchzahlen (Genitiv Einzahl) - die Zähler hier sind ganz,
 * die Form steht trotzdem da (Glossar §2.11: immer alle vier).
 */
function cs(n: number, one: string, few: string, other: string, many: string): string {
  const k = PLURAL_CS.select(n);
  const form = k === "one" ? one : k === "few" ? few : k === "many" ? many : other;
  return `${n.toLocaleString("cs-CZ")} ${form}`;
}

/** Die Zeichen von „alltags-ass", die es auf dem Weg des Kindes wirklich gibt (wie `badgesPl.ts`). */
function alltagsZeichen(z: AbzeichenZahlen): string {
  const reihe = new Set(lernwegDef(z.lernweg).introOrder);
  const da = ["@", "€", "$", "§"].filter((c) => reihe.has(c));
  if (da.length <= 1) return da.join("");
  return `${da.slice(0, -1).join(", ")} a ${da[da.length - 1]}`;
}

/** Die Familien (Überschriften im Regal) - Schlüssel ist der deutsche `group`-Name (Glossar §2.4). */
export const ABZEICHEN_GRUPPEN_CS: Readonly<Record<string, string>> = {
  Fehlerfrei: "Bez chyb",
  "Saubere Serie": "Čistá kola",
  Fleiß: "Píle",
  Anschläge: "Úhozy",
  Dranbleiben: "Vytrvalost",
  Übungswochen: "Týdny cvičení",
  Sterne: "Hvězdičky",
  Lektionen: "Lekce",
  Stufen: "Úrovně",
  Tastenwelt: "Svět klávesnice",
  "Sitzt!": "Umím!",
  Tempo: "Rychlost",
  "Am Stück": "Jedním dechem",
  Meisterprüfung: "Mistrovství",
  Abenteuer: "Dobrodružství",
  "Abenteuer-Kunststücke": "Dobrodružné kousky",
  Expedition: "Výprava",
  Geschichten: "Příběhy",
  Lesestunde: "Čas na čtení",
  "Lese-Kunststücke": "Čtenářské kousky",
  Geheim: "Tajné",
};

/** Der ganze Katalog tschechisch, je Abzeichen-ID. */
export const ABZEICHEN_CS: Readonly<Record<string, AbzeichenTextCs>> = {
  // ── Bez chyb ─────────────────────────────────────────────────────────────
  volltreffer: { name: "Trefa do černého", description: "Celé kolo bez jediné chyby.", bildbeschreibung: "terč se šípem přesně uprostřed" },
  "null-fehler-ninja": { name: "Nindža bez chyb", description: "5 kol bez jediné chyby.", bildbeschreibung: "nindža" },
  "makellos-meister": { name: "Hvězdy bez poskvrny", description: "15 kol bez jediné chyby.", bildbeschreibung: "tři třpytivé hvězdy" },
  "diamant-finger": { name: "Diamantové prsty", description: "40 kol bez jediné chyby.", bildbeschreibung: "modrý drahokam" },
  // „Čistý štít" = eine weisse Weste haben.
  "weisse-weste": { name: "Čistý štít", description: "80 kol bez jediné chyby.", bildbeschreibung: "bílá holubice" },
  "einhorn-finger": { name: "Jednorožčí prsty", nameNeutral: "150 kol bez chyb", description: "150 kol bez jediné chyby.", bildbeschreibung: "jednorožec" },
  // ── Čistá kola ───────────────────────────────────────────────────────────
  "praezisions-pinguin": { name: "Trefný tučňák", nameNeutral: "Třikrát čistě", description: "3 čistá kola za sebou (přesnost aspoň 95 %).", bildbeschreibung: "tučňák" },
  adlerauge: { name: "Orlí zrak", description: "7 čistých kol za sebou (přesnost aspoň 95 %).", bildbeschreibung: "orel" },
  "laser-lama": { name: "Laserová lama", nameNeutral: "Laserový režim", description: "15 čistých kol za sebou (přesnost aspoň 95 %).", bildbeschreibung: "lama" },
  "eiskalte-serie": { name: "Ledový klid", description: "25 čistých kol za sebou (přesnost aspoň 95 %).", bildbeschreibung: "kostka ledu" },
  // ── Píle ─────────────────────────────────────────────────────────────────
  "tasten-kueken": { name: "Klávesové kuřátko", nameNeutral: "První kolo", description: "První dokončené kolo.", bildbeschreibung: "kuřátko, které se líhne z vajíčka" },
  "ausdauer-ameise": { name: "Pilný mravenec", nameNeutral: "Po rozcvičce", description: "25 kol cvičení.", bildbeschreibung: "mravenec" },
  "marathon-maus": { name: "Maratonská myška", nameNeutral: "Sto kol", description: "100 kol cvičení.", bildbeschreibung: "hlava myšky" },
  "munteres-murmeltier": { name: "Bystrý bobr", nameNeutral: "Maraton", description: "250 kol cvičení.", bildbeschreibung: "bobr" },
  dauerlaeufer: { name: "Dlouhá trať", description: "500 kol cvičení.", bildbeschreibung: "běžící osoba" },
  // Wie „Tisíc a jedna noc".
  tausendsassa: { name: "Tisíc a jedno kolo", nameNeutral: "Tisíc kol", description: "1 000 kol cvičení.", bildbeschreibung: "velryba, která stříká vodu" },
  // ── Úhozy ────────────────────────────────────────────────────────────────
  "tausend-tasten-tiger": { name: "Tygr tisíce kláves", nameNeutral: "Tisíc správných úhozů", description: "1 000 správných úhozů.", bildbeschreibung: "hlava tygra" },
  "tasten-t-rex": { name: "Klávesový T-rex", nameNeutral: "Deset tisíc správných úhozů", description: "10 000 správných úhozů.", bildbeschreibung: "tyranosaurus" },
  "galaktische-fingerspitzen": { name: "Galaktické prsty", description: "50 000 správných úhozů.", bildbeschreibung: "startující raketa" },
  "hunderttausend-held": { name: "Sto tisíc blesků", nameNeutral: "Sto tisíc správných úhozů", description: "100 000 správných úhozů.", bildbeschreibung: "žlutý blesk" },
  viertelmillion: { name: "Čtvrt milionu", description: "250 000 správných úhozů - tolik písmen má celá kniha.", bildbeschreibung: "satelit" },
  // ── Vytrvalost ───────────────────────────────────────────────────────────
  "dranbleib-dachs": { name: "Vytrvalý jezevec", nameNeutral: "Vytrvalost", description: "3 různé dny cvičení.", bildbeschreibung: "jezevec" },
  gewohnheitstier: { name: "Věrná želva", description: "7 různých dní cvičení.", bildbeschreibung: "želva" },
  // „Jde to jako hodinky."
  "wie-ein-uhrwerk": { name: "Jako hodinky", description: "20 různých dní cvičení.", bildbeschreibung: "červený budík" },
  unaufhaltsam: { name: "Nezadržitelně", description: "50 různých dní cvičení.", bildbeschreibung: "hora se zasněženým vrcholem" },
  "tief-verwurzelt": { name: "Hluboké kořeny", description: "100 různých dní cvičení.", bildbeschreibung: "velký zelený listnatý strom" },
  // Nicht „Pevný jako skála": das Adjektiv hinge am Kind (Glossar Regel 2).
  "fels-in-der-brandung": { name: "Jako skála", description: "200 různých dní cvičení - skoro každý den celého školního roku.", bildbeschreibung: "kamenná socha z Velikonočního ostrova" },
  // ── Týdny cvičení ────────────────────────────────────────────────────────
  "vierteljahr-dabei": { name: "Už čtvrt roku", description: "12 různých týdnů cvičení.", bildbeschreibung: "hnědý podzimní list" },
  "halbes-jahr-dabei": { name: "Už půl roku", description: "26 různých týdnů cvičení.", bildbeschreibung: "mrak, ze kterého padá sníh" },
  // 52 ist „other" (Glossar §2.11) ⇒ „52 různých týdnů".
  "ganzes-jahr-dabei": { name: "Celý rok", description: "52 různých týdnů cvičení.", bildbeschreibung: "narozeninový dort se svíčkou" },
  // ── Hvězdičky ────────────────────────────────────────────────────────────
  // „za 3 hvězdičky" statt „se 3 hvězdičkami" - keine Präposition, die von der Zahl abhängt.
  sternschnuppe: { name: "Padající hvězda", description: "První kolo za 3 hvězdičky.", bildbeschreibung: "padající hvězda na noční obloze" },
  "sternen-sammler": { name: "Hrst hvězd", description: "10 kol za 3 hvězdičky.", bildbeschreibung: "zářící žlutá hvězda" },
  sternenhimmel: { name: "Hvězdná obloha", description: "30 kol za 3 hvězdičky.", bildbeschreibung: "Mléčná dráha na noční obloze" },
  sternenmeer: { name: "Moře hvězd", description: "75 kol za 3 hvězdičky.", bildbeschreibung: "oranžová osmicípá hvězda" },
  // ── Lekce ────────────────────────────────────────────────────────────────
  "lektions-loewe": { name: "Lev lekcí", nameNeutral: "Pět lekcí", description: "5 dokončených lekcí.", bildbeschreibung: "lev" },
  "kapitel-kaeptn": { name: "Plnou parou vpřed!", description: "15 dokončených lekcí.", bildbeschreibung: "kotva" },
  // Die Lektionszahl DES WEGES in Klammern - keine Zahl mit Punkt am Satzende (Falle 4).
  "lehrgangs-legende": { name: "Legenda kurzu", description: (z) => `Dokončeny všechny lekce kurzu (celkem ${lektionenFuer(z.lernweg).length}).`, bildbeschreibung: "zlatý pohár" },
  // ── Úrovně (kruh bodů) ───────────────────────────────────────────────────
  "kletter-koala": { name: "Šplhající koala", nameNeutral: "Úroveň 5", description: "Dosažena úroveň 5 v kruhu bodů.", bildbeschreibung: "koala" },
  "punkte-rakete": { name: "Bodová raketa", description: "Dosažena úroveň 10 v kruhu bodů.", bildbeschreibung: "červený balónek" },
  "gipfel-gaemse": { name: "Kamzík na vrcholu", nameNeutral: "Úroveň 20", description: "Dosažena úroveň 20 v kruhu bodů.", bildbeschreibung: "koza" },
  hoehenflug: { name: "Vysoký let", nameNeutral: "Úroveň 50", description: "Dosažena úroveň 50 v kruhu bodů.", bildbeschreibung: "vrtulník" },
  "ueber-den-wolken": { name: "Nad oblaky", nameNeutral: "Úroveň 100", description: "Dosažena úroveň 100 v kruhu bodů.", bildbeschreibung: "létající talíř" },
  sternenreise: { name: "Cesta ke hvězdám", nameNeutral: "Úroveň 200", description: "Dosažena úroveň 200 v kruhu bodů.", bildbeschreibung: "kometa s dlouhým ohonem" },
  // ── Svět klávesnice ──────────────────────────────────────────────────────
  // Die Grundreihe DES WEGES - auf Weg „cs": a s d f j k l ů.
  "grundstellungs-gorilla": {
    name: "Gorila základní řady",
    nameNeutral: "Základní řada hotová",
    description: (z) =>
      `Odemčeno všech osm kláves základního postavení: ${lernwegDef(z.lernweg)
        .letterOrder.slice(0, lernwegDef(z.lernweg).homeRowLetters)
        .join(" ")}.`,
    bildbeschreibung: "gorila",
  },
  "gross-baumeister": { name: "Stavba z velkých písmen", nameNeutral: "Velká písmena", description: "Klávesa Shift zvládnutá - opravdová velká písmena vlastní rukou.", bildbeschreibung: "čtyři velká písmena na modrých klávesách" },
  // ⚠️ „puenktchen-panda" und „schlangen-s" gibt es auf Weg „cs" nicht zu
  // verdienen - der Eintrag steht trotzdem da, weil das Regal jedes beschreibt.
  "puenktchen-panda": { name: "Tečkovaná panda", nameNeutral: "Německé přehlásky", description: "Odemčena písmena ä, ö a ü - německá písmena s tečkami.", bildbeschreibung: "panda" },
  "schlangen-s": { name: "Hadí S", nameNeutral: "Německé ostré s", description: "Odemčeno ß, německé ostré s - poslední písmeno německé klávesnice.", bildbeschreibung: "had" },
  "alphabet-as": { name: "Celá abeceda", description: "Odemčena všechna písmena od A do Z.", bildbeschreibung: "malá písmena na modrých klávesách" },
  "punkt-und-komma": { name: "Tečka a čárka", description: "Odemčena tečka a čárka - první opravdová interpunkční znaménka.", bildbeschreibung: "černé psací pero" },
  "satzzeichen-sammler": { name: "Sbírka znamének", nameNeutral: "Celá interpunkce", description: "Odemčena interpunkční znaménka: . , - ? ! : ;", bildbeschreibung: "velký červený vykřičník" },
  "zahlen-zebra": { name: "Číselná zebra", nameNeutral: "Polovina číslic", description: "Odemčeno pět číslic z číselné řady.", bildbeschreibung: "zebra" },
  "zahlen-zauberer": { name: "Kouzlo číslic", nameNeutral: "Celá číselná řada", description: "Odemčeny všechny číslice od 1 až po 0 - celá číselná řada.", bildbeschreibung: "modrá klávesa s číslem deset" },
  "klammer-krokodil": { name: "Krokodýl v závorkách", nameNeutral: "Levá a pravá závorka", description: "Odemčeny závorky ( ) - první symboly.", bildbeschreibung: "krokodýl" },
  "alltags-ass": { name: "Znaky na každý den", nameNeutral: "Každodenní znaky", description: (z) => `Odemčeno: ${alltagsZeichen(z)} - znaky z e-mailů a ze světa peněz.`, bildbeschreibung: "obálka" },
  "tastatur-krone": { name: "Koruna klávesnice", nameNeutral: "Celá klávesnice", description: "Odemčeny VŠECHNY klávesy klávesnice - až po poslední symbol.", bildbeschreibung: "zlatá koruna" },
  // ── Umím! ────────────────────────────────────────────────────────────────
  "feste-burg": { name: "Můj dům, můj hrad", nameNeutral: "Základní řada je jistá", description: "Všechny klávesy základního postavení jsou jisté.", bildbeschreibung: "dům" },
  "buchstaben-baendiger": { name: "Zkrocená písmena", nameNeutral: "Všechna písmena jsou jistá", description: "Každé písmeno je jisté - žádné už není nejisté.", bildbeschreibung: "červený čtverec s velkým A" },
  "zahlen-fels": { name: "Číslice jako skála", nameNeutral: "Všechny číslice jsou jisté", description: "Celá číselná řada je jistá.", bildbeschreibung: "počítadlo s barevnými kuličkami" },
  "nichts-wackelt": { name: "Nic se neviklá", description: "Každá klávesa klávesnice je jistá - celá klávesnice, nejen odemčené klávesy.", bildbeschreibung: "modrý kosočtverec s tečkou uprostřed" },
  // ── Rychlost ─────────────────────────────────────────────────────────────
  "flinker-fuchs": { name: "Mrštná liška", nameNeutral: "Rychle a přesně", description: "Požadovaná rychlost A k tomu přesnost aspoň 95 % - rychlost se počítá, jen když je psaní přesné.", bildbeschreibung: "liška" },
  "tempo-60": { name: "Hopsající zajíc", nameNeutral: "60 za minutu, přesně", description: "Kolo rychlostí 60 úhozů za minutu s přesností aspoň 95 %.", bildbeschreibung: "zajíc" },
  "tempo-90": { name: "Svižná srnka", nameNeutral: "90 za minutu, přesně", description: "Kolo rychlostí 90 úhozů za minutu s přesností aspoň 95 %.", bildbeschreibung: "srna" },
  "tempo-120": { name: "Kůň v trysku", nameNeutral: "120 za minutu, přesně", description: "Kolo rychlostí 120 úhozů za minutu s přesností aspoň 98 %.", bildbeschreibung: "cválající kůň" },
  "tempo-160": { name: "Parní lokomotiva", nameNeutral: "160 za minutu, přesně", description: "Kolo rychlostí 160 úhozů za minutu s přesností aspoň 98 %.", bildbeschreibung: "parní lokomotiva" },
  "tempo-200": { name: "Rychlík", nameNeutral: "200 za minutu, přesně", description: "Kolo rychlostí 200 úhozů za minutu s přesností aspoň 98 %.", bildbeschreibung: "rychlý vlak" },
  "tempo-300": { name: "Tryskáč", nameNeutral: "300 za minutu, přesně", description: "Kolo rychlostí 300 úhozů za minutu s přesností aspoň 99 % - profesionální úroveň.", bildbeschreibung: "malé letadlo" },
  // ── Jedním dechem ────────────────────────────────────────────────────────
  "kette-100": { name: "Řetězová reakce", nameNeutral: "100 za sebou", description: "100 správných úhozů za sebou, bez jediné chyby.", bildbeschreibung: "dva články řetězu" },
  "kette-250": { name: "Bez zakopnutí", description: "250 správných úhozů za sebou.", bildbeschreibung: "řetěz z několika článků" },
  // „Červená nit" = der rote Faden, auch im Tschechischen.
  "kette-500": { name: "Červená nit", nameNeutral: "500 za sebou", description: "500 správných úhozů za sebou - víc než celé kolo.", bildbeschreibung: "cívka s nití" },
  "kette-1000": { name: "Tisíc bez chyby", description: "1 000 správných úhozů za sebou.", bildbeschreibung: "hora Fudži se zasněženým vrcholem" },
  "kette-2000": { name: "Železný řetěz", nameNeutral: "2 000 za sebou", description: "2 000 správných úhozů za sebou - čtyři až pět kol bez nejmenšího zaváhání.", bildbeschreibung: "sopka, ze které teče láva" },
  // ── Dobrodružství (hra „Ledové kry", Glossar §2.3) ──────────────────────
  // „dobrodružství" ist in allen Mehrzahlformen gleich.
  "erste-expedition": { name: "První výprava", description: "První dobrodružství na ledových krách ve volné hře - až k iglú.", bildbeschreibung: "kompas" },
  // Nicht „Polárník" (Personenwort, männlich).
  polarforscher: { name: "Polární objevy", description: "10 dokončených dobrodružství na ledových krách ve volné hře.", bildbeschreibung: "sněhová vločka" },
  "eismeer-legende": { name: "Legenda ledového moře", description: "30 dokončených dobrodružství na ledových krách ve volné hře.", bildbeschreibung: "vysoká modrá vlna" },
  "packeis-profi": { name: "Ledová pole zvládnutá", nameNeutral: "60 dobrodružství", description: "60 dokončených dobrodružství na ledových krách ve volné hře.", bildbeschreibung: "cestovní kufr" },
  // ── Dobrodružné kousky ───────────────────────────────────────────────────
  // „Trockener Frack": Der Frack ist der Pinguin selbst - tschechisch „frak".
  "trockener-frack": { name: "Suchý frak", description: "Celé dobrodružství bez jediného pádu do vody nebo do sněhu.", bildbeschreibung: "černý cylindr" },
  "immer-trocken": { name: "Pořád v suchu", description: (z) => `${cs(z.trockeneAbenteuer, "dobrodružství", "dobrodružství", "dobrodružství", "dobrodružství")} bez jediného pádu do vody.`, bildbeschreibung: "složený deštník" },
  fischfaenger: { name: "Dobrý úlovek", description: (z) => `${cs(z.fische, "bonusová rybka ulovená", "bonusové rybky ulovené", "bonusových rybek ulovených", "bonusové rybky ulovené")} na ledových krách.`, bildbeschreibung: "modrá ryba" },
  // ── Výprava ──────────────────────────────────────────────────────────────
  // Die Zonennamen wie im Spiel (Glossar §2.3): Jeskyně ozvěny, Sněhová bouře,
  // Polární stanice.
  "hoehlen-lauscher": { name: "Netopýří sluch", description: "Celá Jeskyně ozvěny až k východu - potmě, jen podle sluchu.", bildbeschreibung: "netopýr" },
  "sturm-trotzer": { name: "Sněhová bouře zdolaná", description: "Sněhová bouře zvládnutá - sledy znaků napsané zpaměti.", bildbeschreibung: "obličej, který fouká vítr" },
  "funker-freund": { name: "Přátelé přes vysílačku", description: "Celá zpráva vysílačkou rozluštěná a odeslaná na Polární stanici.", bildbeschreibung: "rádio" },
  "polarlicht-entdecker": { name: "Pod polární září", description: "Celá Polární výprava bez jediné chyby - polární záře tančí.", bildbeschreibung: "hvězda s chvostem jisker" },
  // ── Příběhy ──────────────────────────────────────────────────────────────
  "lese-luchs": { name: "Čtenářský rys", nameNeutral: "První příběh", description: "První příběh přečtený a napsaný až do konce.", bildbeschreibung: "levhart" },
  buecherwurm: { name: "Knihomol", description: "3 příběhy přečtené až do konce.", bildbeschreibung: "zelená housenka" },
  "buecherei-baer": { name: "Medvěd z knihovny", nameNeutral: "Osm příběhů", description: "8 příběhů přečtených až do konce.", bildbeschreibung: "medvěd" },
  vielleser: { name: "Hora knih", description: "15 příběhů přečtených až do konce.", bildbeschreibung: "hromada barevných knih" },
  // ── Čas na čtení (díl = Etappe einer Geschichte) ─────────────────────────
  "seiten-spatz": { name: "Vrabčák z první stránky", nameNeutral: "První stránka", description: "První díl příběhu napsaný.", bildbeschreibung: "malý modrý pták" },
  "kapitel-krake": { name: "Sečtělá chobotnice", nameNeutral: "Deset dílů", description: "10 dílů přečtených a napsaných.", bildbeschreibung: "chobotnice" },
  "geschichten-gigant": { name: "Sloní porce příběhů", description: "30 dílů přečtených a napsaných.", bildbeschreibung: "slon" },
  leseratte: { name: "Čtení bez konce", nameNeutral: "75 dílů", description: "75 dílů přečtených a napsaných.", bildbeschreibung: "svitek pergamenu" },
  // ── Čtenářské kousky ─────────────────────────────────────────────────────
  federleicht: { name: "Lehké jako pírko", description: "Celý díl napsaný bez jediné chyby.", bildbeschreibung: "bílé pírko" },
  // Nicht „Jedním dechem" - so heisst schon die Familie „Am Stück".
  "in-einem-rutsch": { name: "Na jeden zátah", description: "Celý příběh přečtený do konce během jediného dne.", bildbeschreibung: "modrá spirála" },
  "lesezeichen-held": { name: "Záložka na svém místě", description: "Čtení jiný den přesně tam, kde minule skončilo.", bildbeschreibung: "záložka do knihy" },
  // ── Mistrovství (Glossar §2.4: „Mistrovství", nie „zkouška") ────────────
  // „opis" ist das Wort der Schreibwettbewerbe (ZAV).
  "zehn-minuten-abschrift": { name: "Desetiminutový opis", description: "Deset minut opisu textu bez přestávky a nejvýš 0,5 % chyb - jako v opravdové soutěži v opisu.", bildbeschreibung: "stopky" },
  "lehrgangs-meister": { name: "Kurz zvládnutý", description: (z) => `Dokončeny všechny lekce kurzu, každá za tři hvězdičky (celkem ${lektionenFuer(z.lernweg).length}).`, bildbeschreibung: "černá absolventská čapka" },
  "goldene-tastatur": { name: "Zlatá klávesnice", description: "Všechny klávesy odemčené a jisté - a k tomu jednou 160 úhozů za minutu s přesností 98 %. Poslední odznak.", bildbeschreibung: "sportovní medaile na stuze" },
  // ── Tajné ────────────────────────────────────────────────────────────────
  "gemuetliches-faultier": { name: "Loudavý lenochod", description: "Pěkně pomalu, ale bez jediné chyby - přesnost je víc než rychlost!", bildbeschreibung: "lenochod" },
  "comeback-kaenguru": { name: "Klokaní skok", description: "Kolo za 3 hvězdičky hned po kole za 1 hvězdičku.", bildbeschreibung: "klokan" },
  // Uhrzeiten in Worten - keine Zahl mit Punkt am Satzende (Falle 4).
  nachteule: { name: "Noční sova", description: "Kolo dokončené po deváté hodině večer.", bildbeschreibung: "sova" },
  // „Ranní ptáče dál doskáče."
  "frueher-vogel": { name: "Ranní ptáče", description: "Kolo dokončené před sedmou hodinou ráno.", bildbeschreibung: "kohout" },
  nimmersatt: { name: "Hlad po čtení", description: "3 díly příběhu zhltnuté během jediného dne.", bildbeschreibung: "zelené jablko" },
  "ferien-held": { name: "Prázdniny u klávesnice", description: "Cvičení o letních prázdninách - v červenci nebo v srpnu.", bildbeschreibung: "pláž se slunečníkem" },
  "wochenend-schreiber": { name: "Víkendové psaní", description: "Cvičení v sobotu i v neděli.", bildbeschreibung: "list z kalendáře" },
  "zurueck-im-sattel": { name: "Zpátky v sedle", description: (z) => `Návrat ke cvičení po přestávce delší než ${cs(z.pauseTage, "den", "dny", "dní", "dne")} - i návrat se počítá.`, bildbeschreibung: "dvě šipky v kruhu" },
  "doppelt-genaeht": { name: "Dvakrát čistě", description: "Dvě kola bez chyby hned po sobě.", bildbeschreibung: "jehla s nití" },
  winterkind: { name: "Zimní klávesy", description: "Cvičení uprostřed zimy - v prosinci nebo v lednu.", bildbeschreibung: "sněhulák" },
  jahreswechsel: { name: "Silvestr a Nový rok", description: "Cvičení v poslední den roku nebo v první den nového roku.", bildbeschreibung: "ohňostroj na noční obloze" },
  "tages-marathon": { name: "Maraton jednoho dne", description: "Deset kol během jediného dne.", bildbeschreibung: "osoba na závodním koni" },
  sternentag: { name: "Hvězdný den", description: "Tři kola za tři hvězdičky během jediného dne.", bildbeschreibung: "slunce s obličejem" },
  blitzsauber: { name: "Jako ze škatulky", description: "Tři kola bez chyby během jediného dne.", bildbeschreibung: "mýdlo s pěnou" },
  "volle-woche": { name: "Plný týden", description: "Pět různých dní cvičení v JEDNOM týdnu.", bildbeschreibung: "zelená kniha" },
  // „Blindflug" ⇒ „Bez dívání": zur Opička, die sich die Augen zuhält.
  // Glossar Regel 4: nie „naslepo", nie „slepý".
  blindflug: { name: "Bez dívání", description: "Celé kolo bez chyby - se skrytou klávesnicí na obrazovce. Právě o tom je psaní všemi deseti.", bildbeschreibung: "opička, která si zakrývá oči" },
  sprachwechsler: { name: "Cesta mezi jazyky", description: "Cvičení ve dvou jazycích - třeba v češtině a v angličtině.", bildbeschreibung: "zeměkoule s Evropou a Afrikou" },
  lesenacht: { name: "Čtení v noci", description: "Díl příběhu přečtený po osmé hodině večer.", bildbeschreibung: "měsíc s obličejem" },
  "zaehe-taste": { name: "Tvrdohlavá klávesa", description: "Klávesa, která dlouho zlobila, je teď jistá.", bildbeschreibung: "šnek" },
  aufsteiger: { name: "Do kopce", description: "O pět úrovní obtížnosti výš než výchozí bod.", bildbeschreibung: "graf s křivkou, která stoupá" },
  // ── Nur auf Weg „fr" (`badgesNurFr.ts`) - für eine tschechische Bedienung auf
  // diesem Weg; dieselben Gedanken wie dort.
  "akzente-ziffernreihe": { name: "Akrobacie akcentů", nameNeutral: "é, è, ç a à", description: "Odemčena písmena é, è, ç a à - písmena, která bydlí na číselné řadě.", bildbeschreibung: "číslice 1 2 3 4 na modré klávese" },
  "accent-circonflexe": { name: "Stříška", nameNeutral: "Francouzská stříška", description: "Mrtvá klávesa ^ je jistá: ê, â, î, ô a û.", bildbeschreibung: "slaměný klobouk se stuhou" },
  trema: { name: "Beruška se dvěma tečkami", nameNeutral: "Dvě tečky", description: "Mrtvá klávesa ¨ je jistá: ë, ï a ü.", bildbeschreibung: "beruška" },
};
