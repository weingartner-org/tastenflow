/**
 * Korpus nur für Lernweg "cs", mittlere Sprossen 18-44 (⇧ bis ¨) - Altersstufe Jugend
 * (CS-T5, 09.10.2026, Bauplan `BAUPLAN-2026-10-02-VIER-SPRACHEN-IT-PL-TR-CS.md` §4
 * Etappe T; Befund `BEFUND-2026-10-09-CS-T5-TEENS-MITTE.md`). Form nach CS-T4
 * (Kinder, dieselben Sprossen), Wortbudget nach CS-T2 §4.
 *
 * Johannes' Regeln, wörtlich: „keine texte werden übersetzt, Texte aus den
 * regionen, altersgemäß und zeitgemäß", „die texte sollen einen bezug zum land
 * und sprache haben" und „denke wie die menschen in den jeweiligen ländern".
 * ALLES NEU AUF TSCHECHISCH VERFASST - keine Text-Datei einer anderen Sprache als
 * Inhalt geöffnet, nichts übersetzt, kein Tatoeba-Satz (darum auch kein `herkunft`).
 *
 * ZEICHENSATZ (`introOrder("cs")`, auf `cs` UND `cs-qwerty` dieselbe Folge):
 *   18 ⇧ · 19 . · 20 , · 21 ? (`punktNachShift`: alle drei direkt nach ⇧) ·
 *   22-36 í p c h á r z b y ž š ř č é ý · 37 ˇ (Totaste: ď ť ň, grosse Č Š Ř Ž …) ·
 *   38 g · 39 ú · 40 x · 41 ´ (Totaste: ó, grosse Á É Í Ú …) · 42 w · 43 q · 44 ¨.
 * Die Sprosse jeder Zeile rechnet der Wächter aus (`fitText`), `minTier`
 * rechnet `minTierFor(text, "cs")`, nicht die Hand.
 *
 * FORM: Satzanfang gross, Namen und Orte gross, jede Zeile endet mit Punkt oder
 * Fragezeichen, Komma bei Anrede, Einschub und zwischen Sätzen („Hele, co to je?",
 * „Nestíhám, mám toho moc."). Kein `! " : ; - '` und keine Ziffern (kommen ab 45).
 * ⚠️ Dieselben drei Mechaniken wie CS-T4, gemessen:
 *  · Auto-Grossschreibung: jede Zeile trägt mindestens einen Buchstaben ab `í`
 *    (22), sonst käme sie klein und ohne Punkt schon vor ⇧ in die Runden von CS-T2.
 *    Sprossen 18-21 haben keine eigene Zeile; geübt werden ⇧ . , ? in JEDER Zeile.
 *  · Grosse Akzentbuchstaben: Č Š Ř Ž erst ab `ˇ` (37), Á É Í Ú erst ab `´` (41) -
 *    „Čeština", „Škodovky", „Žádná panika", „Áčko", „Ústní maturita" liegen dort.
 *  · ď ť ň (37) und ó (41) nur über die Totaste. Wichtig für die Jugend:
 *    „gymnázium", „brigáda", „angličtina" haben ein `g` und kommen erst an 38.
 *
 * GESCHLECHT: Keine Zeile legt die tippende Person fest - keine Vergangenheit und
 * kein hartes Adjektiv mit „jsem/jsi"; 1. Person nur im Präsens oder in der
 * Mehrzahl („Málo spíme.", „Vyhráli jsme turnaj."). Vergangenheit bei benannten
 * Personen in der 3. Person, beide Geschlechter („Psala mi Lenka.", „Lukáš se učí …").
 *
 * JUGEND 14-17: 9. třída und Střední škola/Gymnázium (přijímačky, přihláška, den
 * otevřených dveří, maturita, povinná četba, slohovka, lyžák, adapťák, taneční,
 * prodloužená, stužkovák) · Sport (florbal, hokej, basketbal, požární sport,
 * lezení, biatlon) · Musik (kapela, Festivals) · Netz (chat, podcast, wifi, web) ·
 * Freundschaft · Brigáda · Ehrenamt (útulek, oddíl, tábor, Hilfe nach der
 * Überschwemmung) · die Sprache selbst (spisovně/hovorově, pády, ř, Hantec,
 * Ostravské „fajny").
 *
 * BEZUG ZU LAND UND SPRACHE, aus allen vierzehn Kraje (Böhmen UND Mähren/Schlesien),
 * mit anderen Orten als CS-T4: Praha (Petřín, Náplavka, Žižkov, metro) ·
 * Středočeský (Kolín, Kladno, Kutná Hora, Mladá Boleslav, Slapy) · Jihočeský
 * (Temelín, Tábor, Český Krumlov, Vltava) · Plzeňský (Techmania, Chodsko) ·
 * Karlovarský (Vary, Mariánské Lázně) · Ústecký (Most, Hřensko) · Liberecký
 * (Jizerská padesátka, Jablonec, Liberec) · Královéhradecký (Krkonoše, Adršpach,
 * Hradec, Hořice) · Pardubický (Velká pardubická, Česká Třebová, Polička) ·
 * Vysočina (Nové Město na Moravě, Pelhřimov, Třebíč) · Jihomoravský (Brno,
 * Pálava, Znojmo, Slavkov) · Olomoucký (Olomouc) · Zlínský (Zlín, Uherské
 * Hradiště, Valašsko) · Moravskoslezský (Ostrava, Opava, Třinec, Hukvaldy, Lysá hora).
 *
 * Sperrliste `sperrlisteCs.ts`: kein Wort aus Kern ODER Wortbasis.
 * Wächter: `tests/tastenflow-texte-cs-teens-mitte.test.ts`. Nur anhängen -
 * Korpus-Anker im selben Commit (`npx tsx scripts/erzeuge-korpus-anker.mts`).
 */
import type { CorpusItem } from "./corpus";

export const CORPUS_CS_WEG_MITTE_TEENS: CorpusItem[] = [
  // ── Sprosse 22 (+í - die erste Taste nach ⇧ . , ?: jede Zeile braucht sie (sonst käme sie über die Auto-Grossschreibung schon vor ⇧)) ──
  { text: "Kolik stojí lístek?", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Sedím ve vlaku a nudím se.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Vlak stojí v Kolíně.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Smíme si sednout ven?", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Mamka to dovolí, ne?", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Dominik studuje ve Vídni.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Ve dvě se vidíme online.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Musíme se nějak domluvit.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "To nesmí nikdo vidět.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Domů musíme do deseti.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  // ── Sprosse 23 (+p) ──
  { text: "Nikola kope penaltu.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Pustíme si video?", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Mamka mi koupila lístek.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Opět mi to spadlo.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Ples je v lednu.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Spíme u Kamila.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Psala mi Lenka.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Neptej se.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Podle mě je to fajn.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Pokud vím, je to tak.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Pípnu ti.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Odpoledne je volno.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  // ── Sprosse 24 (+c) ──
  { text: "Kluci, kde jste?", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Lekce tance je v pondělí.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Lucie studuje medicínu.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Nic se neděje.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Podcast si pustíme ve vlaku.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Nevíme, co se stalo.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Co dneska podnikneme?", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Co na to ostatní?", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Spolu s Lucií jsme to dodělali.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Cvak, fotka je venku.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Tak co, platí to?", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  // ── Sprosse 25 (+h - und damit ch) ──
  { text: "Nevím, kolik je hodin.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Test nikdo nestihl dopsat.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "V Kladně se hokej hodně sleduje.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Poslední hodina odpadla.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Dneska se mi nikam nechce.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Chci domů.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Chodíme spolu dva měsíce.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Hotovo, je to venku.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Hele, co to je?", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Chodíme na hip hop.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Mluvíme hodně nahlas.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Hele, nech toho.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Hlavně klid.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  // ── Sprosse 26 (+á - mám, máme, nás) ──
  { text: "Nemám nápad.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Kolik to stálo?", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Nestíhám, mám toho moc.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Hádej, kdo to psal.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Plavání máme v pondělí.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Mám to v hlavě.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Nevadí, dáme to.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Dáme si limonádu?", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Málem jsme to nestihli.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Málo spíme.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Taková náhoda.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  // ── Sprosse 27 (+r) ──
  { text: "Kapela ladí nástroje.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Colours of Ostrava jsou v Dolních Vítkovicích.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Poslouchám hlavně rap.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Hrajeme spolu hru po síti.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Chodsko je kraj dudáků.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Ráno nestíhám snídat.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Kamarádka mi poradila.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Po sportu nemám sílu.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Metro stojí, je porucha.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Dárek pro mamku schováme.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Pravda, nemá cenu se hádat.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Kreslíme komiks.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Opravdu, nekecám.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  // ── Sprosse 28 (+z) ──
  { text: "Kapela si dala pauzu.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Z chemie mám trojku, to se spraví.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Na lezeckou stěnu chodíme v zimě.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Kutná Hora je známá kostnicí.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Techmania je v Plzni.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Zítra je zápas.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Zase pozdě.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Zavolej mi pak.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Zkus to znovu.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Zahrajeme si to online.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Zvládneme to.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Zrovna jsem v metru.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Pizza je na cestě.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Moc mě to mrzí.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Zatím ahoj.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Za minutu jsem tam.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Zastávka je za rohem.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Za hodinu je konec.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  // ── Sprosse 29 (+b) ──
  { text: "Kolik ti dali bodů?", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Velká pardubická je dostih.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Zítra ti to vrátím, slibuju.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Basketbal hrajeme v hale.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Bára si koupila kolo.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Bude to bomba.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Bez mobilu ani krok.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Nebojte se.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "V sobotu máme turnaj.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Probudili jsme se pozdě.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Nebaví mě to.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Brácha hraje na bicí.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Obědváme v jídelně.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  // ── Sprosse 30 (+y - der Vokal (byl, ryby)) ──
  { text: "S oddílem sázíme stromy.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Baterie je skoro vybitá.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Trdelník je pro turisty.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Ve Znojmě se nakládají okurky.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Byli jsme na koncertě.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Kdyby něco, volej.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Vyhráli jsme turnaj.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Byla to pecka.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Kytara je po dědovi.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Vyfotíme se?", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Holky hrají florbal.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Myslíme na vás.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Kdy se uvidíme?", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Vyprávěj, jak to bylo.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  // ── Sprosse 31 (+ž) ──
  { text: "Jizerská padesátka je závod na běžkách.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Na kole objíždíme Pálavu.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Sjíždíme Vltavu na kánoích.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Smažák s hranolky je klasika.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Jablonec je město bižuterie.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Kdy už to bude?", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Už jsi doma?", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Možná, uvidíme.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Můžu ti zavolat?", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Užijte si to.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Na festivalu jsme si to užili.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Kdo může zítra?", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Snažíme se to stihnout.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Drž nám palce.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  // ── Sprosse 32 (+š) ──
  { text: "Ahoj, jak se máš?", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Ozvi se, až dorazíš domů.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Lyžák bude v lednu v Krkonoších.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Do chatu píšeme hovorově, do slohovky spisovně.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Volejbal na písku je nejlepší.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Podcast o historii posloucháme cestou do školy.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "S Bárou se známe od školky.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Na Lysou horu chodíme pěšky.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  // ── Sprosse 33 (+ř) ──
  { text: "Přihlášku na střední školu už máme hotovou.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "O přestávce mobily nesmíme používat.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Ve fyzice probíráme elektřinu.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "V Brně se tramvaji říká šalina.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Letos na táboře pomáháme jako instruktoři.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "V Třinci se fandí hokeji.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Skatepark u nás otevřeli loni.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "V Liberci běháme kolem přehrady.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Na kytaru hraju třetím rokem.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Dvořák složil Novosvětskou symfonii.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Z Petřína je vidět celá Praha.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Každou zprávu si ověřujeme.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Kdo přinese reproduktor?", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "V Pelhřimově je muzeum rekordů.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "V Táboře jsou podzemní chodby.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "U Slavkova se bojovalo v bitvě tří císařů.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  // ── Sprosse 34 (+č) ──
  { text: "Lukáš se učí na přijímačky.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Rodiče nás pustili na festival.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Přijímačky jsou v dubnu.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Učitelka nás pustila domů dřív.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Taneční začínají v září.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "V tanečních se učíme valčík a polku.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Hlásku ř má jen čeština.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Florbal hrajeme v tělocvičně.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Leoš Janáček se narodil v Hukvaldech.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Nabíječku si půjčíme od Báry.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "V Hořicích pečou trubičky.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Bohuslav Martinů se narodil ve věži kostela v Poličce.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Oksana je v prváku a mluví česky i ukrajinsky.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Eliška má na notebooku odečítač obrazovky.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Linh hraje na klavír a učí mladší děti.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  // ── Sprosse 35 (+é) ──
  { text: "Kytice od Erbena patří do povinné četby.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Opravné zkoušky jsou na konci srpna.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Na prodloužené hraje živá kapela.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Adršpašské skály jsou ráj lezců.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Biatlon v Novém Městě na Moravě sleduje celá rodina.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Rock for People je v Hradci Králové.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Letní filmová škola je v Uherském Hradišti.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Lístky na koncert byly vyprodané za hodinu.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Ve Zlíně se točily animované filmy.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Na Náplavce se v létě sedí u vody.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Pražské metro má tři linky.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Video má už sto tisíc zhlédnutí.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Olomouc je studentské město.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  // ── Sprosse 36 (+ý) ──
  { text: "Na přijímačky se učíme každý den.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Den otevřených dveří je v sobotu.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Didaktický test z češtiny píšeme ráno.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Stužkovák je za týden.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Ostravané říkají fajny místo pěkný.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Občanku musí mít každý od patnácti.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Na florbal chodíme dvakrát týdně.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Ve Varech je filmový festival.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Skupinový chat třídy pořád pípá.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "V Mostě přesunuli celý kostel.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "V Mariánských Lázních zpívá fontána.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  // ── Sprosse 37 (+ˇ (Totaste) - ď ť ň und die grossen Č Š Ř Ž am Satzanfang) ──
  { text: "Slovo robot vymyslel bratr Karla Čapka.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Na adapťáku se všichni poznáme.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Referát o Baťovi odevzdáváme ve středu.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Čeština má sedm pádů.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Šetříme na autoškolu už od jara.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Promiň, že píšu tak pozdě.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Lázeňské oplatky jsou z Karlových Varů.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Ve Zlíně stojí Baťův mrakodrap.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Škodovky se vyrábějí v Mladé Boleslavi.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Nejnižší místo Česka je u Hřenska.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "V Třebíči je židovská čtvrť.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Český Krumlov je plný turistů.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Česká Třebová je železniční uzel.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Žádná panika.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Že by?", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Na Žižkově je televizní věž.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Teď nemůžu, jsem na tréninku.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Zůstaň ještě chvíli.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Ať to dopadne dobře.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Tahle píseň je hit.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Přijďte na náš koncert.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Po tréninku mám žízeň.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  // ── Sprosse 38 (+g) ──
  { text: "Za pololetí mám z angličtiny jedničku.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Hantec je brněnský slang.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "O prázdninách mám brigádu v kavárně.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Na brigádě sbíráme jahody.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Na Mighty Sounds jezdíme do Tábora.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Naše kapela zkouší v garáži.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Na chatě nemáme signál.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Na Valašsku pečou frgály.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Ségra studuje v Olomouci.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Biologie je můj oblíbený předmět.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Na gymnáziu máme latinu.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Na téhle zdi je graffiti legální.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Grilujeme na zahradě.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Angličtina je třikrát týdně.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  // ── Sprosse 39 (+ú (Wortanfang)) ──
  { text: "V sobotu pomáháme v útulku.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Venčíme psy z útulku.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Požární sport trénujeme každé úterý.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Po povodni v Opavě jsme pomáhali s úklidem.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Vidím to úplně jinak.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "V úterý je trénink.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Pro nás je to úspěch.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Dostali jsme úkol z dějepisu.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  // ── Sprosse 40 (+x - Lehnwörter und Namen) ──
  { text: "Exkurze do Temelína byla zajímavá.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Kometa Brno hraje extraligu.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Text písně umíme nazpaměť.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Ve fyzice děláme experiment.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Na box chodíme do klubu.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Mixujeme hudbu na počítači.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  // ── Sprosse 41 (+´ (Totaste) - ó und die grossen Á É Í Ú) ──
  { text: "Ústní maturita je v květnu.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Na pódiu hraje kapela z Plzně.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Ve školní jídelně dávají buchtičky se šodó.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Hradec Králové je salón republiky.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Áčko vyhrálo turnaj.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Kód ke skříňce si nepamatuju.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Úplně jsme na to zapomněli.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  // ── Sprosse 42 (+w - Lehnwörter) ──
  { text: "Na Slapech se jezdí na wakeboardu.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Na webu školy je rozvrh.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Heslo k wifi je na lednici.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Workshop o robotice je v pátek.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  // ── Sprosse 43 (+q - Lehnwort) ──
  { text: "Squash hrajeme jednou týdně.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
];
