/**
 * Korpus nur für Lernweg "cs", mittlere Sprossen 18-44 (⇧ bis ¨) - Altersstufe Kids
 * (CS-T4, 09.10.2026, Bauplan `BAUPLAN-2026-10-02-VIER-SPRACHEN-IT-PL-TR-CS.md` §4
 * Etappe T; Befund `BEFUND-2026-10-09-CS-T4-KIDS-MITTE.md`). Vorgehen nach CS-T1 §6,
 * Form (⇧, Satzzeichen, Auto-Grossschreibung) nach PL-T4.
 *
 * Johannes' Regeln, wörtlich: „keine texte werden übersetzt, Texte aus den
 * regionen, altersgemäß und zeitgemäß" und „die texte sollen einen bezug zum
 * land und sprache haben". ALLES NEU AUF TSCHECHISCH VERFASST - keine Text-Datei
 * einer anderen Sprache als Inhalt geöffnet, nichts übersetzt, kein Tatoeba-Satz
 * (darum auch kein `herkunft`).
 *
 * ZEICHENSATZ (`introOrder("cs")`, auf `cs` UND `cs-qwerty` dieselbe Folge):
 *   18 ⇧ · 19 . · 20 , · 21 ? (`punktNachShift`: alle drei direkt nach ⇧) ·
 *   22-36 í p c h á r z b y ž š ř č é ý · 37 ˇ (Totaste: ď ť ň, grosse Č Š Ř Ž …) ·
 *   38 g · 39 ú · 40 x · 41 ´ (Totaste: ó, grosse Á É Í Ú …) · 42 w · 43 q · 44 ¨.
 * Die Sprosse jeder Zeile rechnet der Wächter aus (`fitText`), `minTier`
 * rechnet `minTierFor(text, "cs")`, nicht die Hand.
 *
 * FORM: Satzanfang gross, Namen und Orte gross, jede Zeile endet mit Punkt oder
 * Fragezeichen, Komma bei Anrede und zwischen Sätzen („Dědo, smím ven?",
 * „Venku mrzne, je tu kluzko."). Kein `! " : ; - '` und keine Ziffern (kommen ab 45).
 * ⚠️ Drei Mechaniken, gemessen:
 *  · Auto-Grossschreibung: `fitText` lässt Grossbuchstaben und `. , ?` schon vor ⇧
 *    durch. Darum trägt JEDE Zeile mindestens einen Buchstaben ab `í` (22) - eine
 *    Zeile nur aus Buchstaben bis `u` käme klein und ohne Punkt schon an Sprosse 17
 *    in die Runden von CS-T1. Sprossen 18-21 haben darum keine eigene Zeile; geübt
 *    werden ⇧ . , ? in JEDER Zeile.
 *  · Grosse Akzentbuchstaben (`grossAkzentSpaet`): Č Š Ř Ž Ě Ď Ť Ň erst ab `ˇ` (37),
 *    Á É Í Ú Ý Ó erst ab `´` (41) - eine Zeile mit „Šumava", „Čechy", „Říp",
 *    „Ústí" liegt dort, auch mitten im Satz. `Ů` nie.
 *  · Totasten-Buchstaben ď ť ň (37) und ó (41) kommen nur über die Totaste.
 *
 * GESCHLECHT: Keine Zeile legt das Kind oder die tippende Person fest - keine
 * Vergangenheit und kein hartes Adjektiv mit „jsem/jsi"; 1. Person nur im Präsens
 * oder in der Mehrzahl („Mám hlad jako vlk.", „Byli jsme v Plzni."). Die
 * Vergangenheit steht bei benannten Personen in der 3. Person, beide Geschlechter
 * („Teta Lída upekla pecen.", „Tonda si sedl na lavici.").
 *
 * BEZUG ZU LAND UND SPRACHE, aus allen vierzehn Kraje (Böhmen UND Mähren/Schlesien):
 * Praha (metro) · Středočeský (Mělník, Říp, Sázava) · Jihočeský (Lipno, Zvíkov,
 * Rožmberk, Třeboň, Šumava) · Plzeňský · Karlovarský (prameny) · Ústecký (Ústí,
 * České Švýcarsko) · Liberecký (Ještěd, bílí tygři) · Královéhradecký (Sněžka,
 * Krakonoš, Dvůr Králové, Jičín) · Pardubický (perník, Litomyšl) · Vysočina
 * (Jihlava, Telč, Žďár) · Jihomoravský (Brněnský drak, Lednice, Macocha) ·
 * Olomoucký (Jeseník, Praděd, Bouzov, tvarůžky) · Zlínský (zoo na zámku, Kroměříž,
 * Valašsko) · Moravskoslezský (Ostrava, Opava, Štramberské uši, Radhošť).
 * Dazu Kinderkultur (Krtek, Pat a Mat, Večerníček, Rumcajs, Bob a Bobek, Mach a
 * Šebestová, Kocour Mikeš, Ferda Mravenec, Maková panenka, Maxipes Fík, Otesánek,
 * Dlouhý, Široký a Bystrozraký), Alltag (chalupa, panelák, houby, schovávaná,
 * guma, pouštění draků) und die Sprache selbst (háček a čárka, ď ť ň, der Satz
 * „Příliš žluťoučký kůň úpěl ďábelské ódy." mit allen Haken und Strichen).
 *
 * Sperrliste `sperrlisteCs.ts`: kein Wort aus Kern ODER Wortbasis.
 * Wächter: `tests/tastenflow-texte-cs-kids-mitte.test.ts`. Nur anhängen -
 * Korpus-Anker im selben Commit (`npx tsx scripts/erzeuge-korpus-anker.mts`).
 */
import type { CorpusItem } from "./corpus";

export const CORPUS_CS_WEG_MITTE_KIDS: CorpusItem[] = [
  // ── Sprosse 22 (+í - die erste Taste nach ⇧ . , ?: jede Zeile braucht sie (sonst käme sie über die Auto-Grossschreibung schon vor ⇧)) ──
  { text: "Ema vidí sovu.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Nikdo neví, kde je kotě.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Dědo, smím ven?", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Kam letí to letadlo?", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Ema dnes slaví deset let.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Lída si vede deník.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Vítku, kde je tvoje kolo?", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Kdo to ví?", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Dnes nemusíme nikam.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Lída a Ema se smějí.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Monika umí kotoul.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Dva kosi sedí na komíně.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  // ── Sprosse 23 (+p) ──
  { text: "V Jeseníku je dnes teplo.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Pes Alík spí u kamen.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "V pondělí plaveme.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "V koutě visí pavouk.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Pavel umí plavat.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Dnes je venku pěkně.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "V pokoji svítí lampa.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Pat a Mat malují pokoj.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Je tu plno lidí.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Pepa umí pískat.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  // ── Sprosse 24 (+c) ──
  { text: "V noci je vidět měsíc.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Na louce se pasou ovce.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Cesta vede kolem potoka.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Teta Lída upekla pecen.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Konec, uklidíme pokoj.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Lucie tancuje s Pavlem.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Maminka kupuje ovoce.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "V kapse cinkají mince.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Teta Iva je policistka.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Na konci ulice stojí kino.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Tonda si sedl na lavici.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  // ── Sprosse 25 (+h - und damit ch) ──
  { text: "O víkendu jsme na chalupě.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Matěj chce psa.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Kotě honí listí.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Nad loukou je mlha.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Tatínek chodí na hokej.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Pes umí hledat stopu.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Nad polem letí hejno hus.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Ticho, miminko spí.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Ahoj, kde jsi?", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Lucie hladí psa.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  // ── Sprosse 26 (+á - má, máme, máma, táta) ──
  { text: "Kdo uhádne hádanku?", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "V pátek dávají pohádku.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Táta táhne sáně do kopce.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Ptáci odletí na jih.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Mám hlad jako vlk.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Lucie pomáhá tatínkovi.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Venku hodně fouká.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Mám nápad, postavíme stan.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Na poli kvete mák.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Ve tmě houká sova.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  // ── Sprosse 27 (+r) ──
  { text: "Praha je hlavní město.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Krtek kope v trávě.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Ráno vstáváme v sedm.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Petr a Vítek jsou kamarádi.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Hana kreslí koně.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Pod smrkem roste muchomůrka.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Děda Milan má traktor.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Moje rodina je velká.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Paní doktorka je milá.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Máma je v práci.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Hrajeme na schovávanou.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Hana hraje na housle.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "V parku u Lednice stojí minaret.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Sněhulák má mrkev místo nosu.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "V Jeseníkách je Praděd.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  // ── Sprosse 28 (+z) ──
  { text: "Na zahradě roste mrkev.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "V zimě je mráz a sníh.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Zítra máme písemku.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Zvoní zvonek, hurá ven.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Ve Zlíně mají zoo na zámku.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Tráva je zelená.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Zajíc se schoval za kámen.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Venku mrzne, je tu kluzko.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Kdo chce zmrzlinu?", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Zapomněli jsme mapu.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Hrad Zvíkov stojí nad vodou.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Na Sázavě jezdí vodáci.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Pozdravuj tetu Ivu.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Opava je město ve Slezsku.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Táta je zdravotník.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "V Praze jezdí metro.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  // ── Sprosse 29 (+b) ──
  { text: "V Brně na radnici visí drak.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Kde je moje bota?", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Obloha je modrá.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Na obloze je duha.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Bobr si staví hráz.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Co je k obědu?", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Bolí mě v krku.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "V sobotu je na náměstí trh.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Bratr hraje fotbal.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Táta hrabe listí.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Budík zvoní, je ráno.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Je zima, vezmi si kabát.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Dobrou noc, maminko.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Ke snídani je chleba s máslem.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  // ── Sprosse 30 (+y - der Vokal (byl, ryby)) ──
  { text: "Krtek hledá kalhotky.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Byli jsme v Plzni.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Natrhali jsme mámě kytku.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "V rybníku plavou ryby.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "O prázdninách jezdíme na hrady a zámky.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Táta hraje na kytaru.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Bydlíme v paneláku.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Po obědě myjeme nádobí.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Kdy jsou prázdniny?", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Na rybníku bruslíme.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Z trouby voní bábovka.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Máme rádi pohádky.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Hrad Bouzov vypadá jako z pohádky.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Bob a Bobek bydlí v klobouku.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  // ── Sprosse 31 (+ž) ──
  { text: "Ježek spí pod listím.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Už tam budeme?", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Můžeme si hrát?", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "U rybníka kvákají žáby.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "V Ostravě se těžilo uhlí.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Ležíme v trávě a koukáme na mraky.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Když je teplo, jezdíme na kole.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Kdo mi může pomoct?", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  { text: "Pavla krmí želvu salátem.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "cs" },
  // ── Sprosse 32 (+š) ──
  { text: "Po škole jdu na kroužek.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Na kroužku hrajeme šachy.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "V Krkonoších je Sněžka.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Krakonoš hlídá hory.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Na stromě visí hrušky.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Houby dáváme do košíku.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Píšeme diktát.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Prší, vezmeme si deštník.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Vlaštovky se vrátily.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Do školy chodíme pěšky.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Rožmberk je největší rybník.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Kocour Mikeš umí mluvit.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Ferda Mravenec umí všechno.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Ještě chvilku, mami.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "V zimě lyžujeme na Ještědu.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  // ── Sprosse 33 (+ř) ──
  { text: "Ve třídě je dvacet žáků.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "O přestávce si hrajeme.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Vltava je dlouhá řeka.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Morava je řeka i země.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "V říjnu pouštíme draky.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Přijela teta z Prahy.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Zavři dveře, táhne tu.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Hřiště je za školou.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Dva a tři je pět.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Na tabuli píšeme křídou.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Bedřich Smetana se narodil v Litomyšli.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Otesánek má pořád hlad.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Křemílek a Vochomůrka bydlí v pařezu.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Máma řídí autobus.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Taras chodí do naší třídy.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "V Kroměříži je Květná zahrada.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Kolem Třeboně je hodně rybníků.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  // ── Sprosse 34 (+č) ──
  { text: "Paní učitelka nám čte.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Večer se díváme na Večerníček.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Kočka Micka přede.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Na svačinu máme rohlík.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Táta hledá klíče.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Rumcajs je loupežník z Jičína.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "V Pardubicích pečou perník.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Babička nám dala čokoládu.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Nad písmenem č je háček.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Rok má čtyři roční období.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Hračky patří do krabice.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Učíme se násobilku.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "V knihovně si půjčujeme knížky.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "V neděli je svíčková.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Minh mluví česky i vietnamsky.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Klára čte prsty, kniha je v Braillově písmu.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Babička jezdí na motorce.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Jihlava leží na Vysočině.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  // ── Sprosse 35 (+é) ──
  { text: "U Mělníka se Vltava vlévá do Labe.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "V létě se koupeme na Lipně.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Děda miluje olomoucké tvarůžky.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "V Moravském krasu je propast Macocha.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Karlovy Vary mají horké prameny.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Ve Dvoře Králové žijí žirafy.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Kráva dává mléko.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Dobré ráno, tati.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Ema má nové brusle.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Proč je nebe modré?", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Babička peče moravské koláče.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Kočka má zelené oči.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Máme malého křečka.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "V létě spíme ve stanu.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "V Telči je krásné náměstí.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  // ── Sprosse 36 (+ý) ──
  { text: "Zítra je školní výlet.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Dobrý den, paní učitelko.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Týden má sedm dní.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Ruce myjeme mýdlem.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Malý bratr ještě nechodí.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Na kytce sedí motýl.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Na řízek se těšíme celý týden.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Na podzim vyřezáváme dýně.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Ten koláč je výborný.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Maková panenka a motýl Emanuel.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  // ── Sprosse 37 (+ˇ (Totaste) - ď ť ň und die grossen Č Š Ř Ž am Satzanfang) ──
  { text: "Žlutou pastelkou malujeme slunce.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Šnek leze pomalu.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Teď jsi na řadě.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Pojď se podívat.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Po Vltavě pluje loď.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Kůň skáče přes překážku.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Plzeň je město v Čechách.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Na Valašsku je hora Radhošť.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Ťuk, ťuk, kdo je tam?", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Káťa a Škubánek jsou z Večerníčku.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Šťastnou cestu, babi.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Zpíváme lidovou píseň.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "V zoo plave tuleň.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Čeština má háčky a čárky.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Česko nemá moře.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Na Šumavě žijí rysi.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "V Českém Švýcarsku je Pravčická brána.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Ve Štramberku pečou uši.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Na Říp vylezl praotec Čech.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Žďár nad Sázavou je na Vysočině.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Dlouhý, Široký a Bystrozraký jsou z pohádky.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Mach a Šebestová mají kouzelné sluchátko.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Ať se ti daří.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Hoď mi míč.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  // ── Sprosse 38 (+g) ──
  { text: "Táta vaří guláš.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Kolo je v garáži.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Kočka spí na gauči.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Magda chodí na gymnastiku.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Ve škole se učíme angličtinu.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "V liberecké zoo žijí bílí tygři.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "O přestávce skáčeme gumu.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Dáme si jogurt s jahodami.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Na fotografii je celá rodina.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Lokomotiva táhne deset vagonů.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  // ── Sprosse 39 (+ú (Wortanfang)) ──
  { text: "V úterý máme tělocvik.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Nezapomeň na úkol.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "V únoru bývá hodně sněhu.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Včely bydlí v úlu.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "To je ale úžasné.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "V sobotu je velký úklid.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "V údolí teče potok.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Dnes v noci je úplněk.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  // ── Sprosse 40 (+x - Lehnwörter und Namen) ──
  { text: "Hrajeme pexeso.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Na nádraží čeká taxík.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Strýc hraje na saxofon.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Ve školce máme xylofon.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Maxipes Fík je velký pes.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  // ── Sprosse 41 (+´ (Totaste) - ó und die grossen Á É Í Ú) ──
  { text: "Matěj dal gól.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Nad městem letí balón.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Ústí nad Labem je v severních Čechách.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Úterý je druhý den v týdnu.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Ája jezdí na koni.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Příliš žluťoučký kůň úpěl ďábelské ódy.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Hana zpívá sólo.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Únor je krátký měsíc.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  // ── Sprosse 42 (+w - Lehnwörter) ──
  { text: "Na chalupě není wifi.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Fotky ze školy jsou na webu.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  { text: "Kiwi je zelené.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
  // ── Sprosse 43 (+q - Lehnwort) ──
  { text: "V aquaparku je tobogán.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "cs" },
];
