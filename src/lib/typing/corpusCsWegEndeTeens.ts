/**
 * Korpus nur für Lernweg "cs", Ende-Sprossen 45-78 (`!` bis `]`) - Altersstufe Jugend
 * (CS-T8, 09.10.2026, Bauplan `BAUPLAN-2026-10-02-VIER-SPRACHEN-IT-PL-TR-CS.md` §4
 * Etappe T; Befund `BEFUND-2026-10-09-CS-T8-TEENS-ENDE.md`). Form nach CS-T5
 * (Jugend, mittlere Sprossen) und PL-T8 (Jugend, Ende mit Zeichen und Ziffern).
 *
 * Johannes' Regeln, wörtlich: „keine texte werden übersetzt, Texte aus den
 * regionen, altersgemäß und zeitgemäß", „die texte sollen einen bezug zum land
 * und sprache haben" und „denke wie die menschen in den jeweiligen ländern".
 * ALLES NEU AUF TSCHECHISCH VERFASST - keine Text-Datei einer anderen Sprache als
 * Inhalt geöffnet, nichts übersetzt, kein Tatoeba-Satz (darum auch kein `herkunft`).
 *
 * ZEICHENSATZ (`introOrder("cs")`, auf `cs` UND `cs-qwerty` dieselbe Folge, im Wächter
 * festgeschrieben): 45 ! · 46 " · 47 : · 48 ; · 49 ' · 50 - · 51 ( · 52 ) ·
 * 53-62 Ziffern 1 2 3 4 5 6 7 8 9 0 (auf der tschechischen Tastatur mit Umschalt) ·
 * 63 % · 64 / · 65 + · 66 = · 67 _ · 68 * · 69 & · 70 < · 71 > · 72 $ · 73 | ·
 * 74 @ · 75 # · 76 € · 77 [ · 78 ]. `(` und `[` haben keine eigenen Zeilen: eine
 * Klammer kommt nur ganz (`fitText`, festes Paar). Die Sprosse jeder Zeile rechnet
 * der Wächter aus (kleinstes n, an dem `fitText` sie UNGEKÜRZT liefert), `minTier`
 * rechnet `minTierFor(text, "cs")`, nicht die Hand. Datei nach Sprosse sortiert.
 *
 * MECHANIK (gemessen): `! " : ; - ( )` sind weglassbar - vor ihrer Sprosse kommt die
 * Zeile gekürzt an, frühestens an `í` (22), nie in die Runden von CS-T2. Weg „cs" hat
 * keine Frühfassungen (`scripts/_fruehfassung.mts` kennt ihn nicht; die gemeinsame
 * Datei bleibt unberührt): darum steht nach `! :` und am Anfang einer Anführung mitten
 * im Satz nur ein kleines Wort oder ein Name - gekürzt entsteht kein grosses Wort mitten
 * im Satz. Ziffern, `'` und alles ab `%` sind hart.
 *
 * FORM UND ZAHLEN TSCHECHISCH: Uhrzeit „v 7:15", „ve 20:30" (v/ve nach dem gesprochenen
 * Zahlwort, Glossar Regel 13), Dezimalkomma („1,2", „20,5 sekundy"), Tausender mit
 * EINEM normalen Leerzeichen („2 400 Kč", „116 111"), Jahreszahl ohne („2024"),
 * Ordnungszahl mit Punkt nur mitten im Satz („v 9. třídě", „4. B") - keine Zeile endet
 * mit Ziffer und Punkt (die Stimme läse eine Ordnungszahl). Prozent nur als Adjektiv
 * („20% sleva" = dvacetiprocentní), dort ohne Leerzeichen richtig; nie U+00A0. Kč,
 * € und $ nach der Zahl mit Leerzeichen; € nur im Ausland. Spielstände „2:1".
 *
 * GESCHLECHT: Keine Zeile legt die tippende Person fest - keine Vergangenheit und
 * kein hartes Adjektiv mit „jsem/jsi"; 1. Person nur im Präsens/Futur oder in der
 * Mehrzahl. Vergangenheit bei benannten Personen in der 3. Person, beide Geschlechter.
 *
 * JUGEND 14-17: přijímačky (Termine, Punkte, drei Schulen), maturita (stovka, stužkovák,
 * praktická), Bakaláři, nultá hodina, vyznamenání, SOČ, olympiády, ZUŠ, Junák, SDH,
 * Brigáda (Kč/h, Zuschlag), Sport (Florbal Vsetín, Házená Karviná, Oceláři Třinec,
 * Ledecká, Krejčíková), Musik, Netz und Technik dort, wo die Zeichen wirklich
 * getippt werden (Excel auf Tschechisch =SUMA/=POČET, Python, HTML, Markdown, Discord,
 * Hashtags, Seznam-Adresse), Erasmus+, Linka bezpečí 116 111, Notruf 155 im Erste-Hilfe-Kurs.
 * Die Sprache selbst: der Apostroph (im Tschechischen kaum), keine Háčky in E-Mail-Adressen,
 * „koule" für die Fünf, zavináč/svislítko/mřížka auf der tschechischen Tastatur (pravý Alt).
 * Keine Kopie und kein Fast-Duplikat der Schwester-Charge CS-T7 (Kinder, dieselben Sprossen).
 *
 * Alle vierzehn Kraje, Böhmen UND Mähren/Schlesien (Zählung im Wächter).
 * Sperrliste `sperrlisteCs.ts`: kein Wort aus Kern ODER Wortbasis.
 * Wächter: `tests/tastenflow-texte-cs-teens-ende.test.ts`. Nur anhängen -
 * Korpus-Anker im selben Commit (`npx tsx scripts/erzeuge-korpus-anker.mts`).
 */
import type { CorpusItem } from "./corpus";

export const CORPUS_CS_WEG_ENDE_TEENS: CorpusItem[] = [
  // ── Sprosse 45 (+!) ──
  { text: "Konečně pátek, odpoledne je volejbal na koupališti!", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Přijímačky máme za sebou, teď se čeká na výsledky!", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Držte nám palce, v sobotu hrajeme finále krajského přeboru!", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Pozor, v Bakalářích jsou nové známky z fyziky!", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Ten koncert v Lucerně byl fakt neskutečný!", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Ať žije letošní majáles v Hradci!", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Gratulujeme, Šimon vyhrál krajské kolo zeměpisné olympiády!", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Zvoní, rychle do třídy!", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Hurá, zítra odpadá tělocvik!", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Neuvěřitelné, Ledecká vyhrála na lyžích i na snowboardu!", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Tak tohle je trapas!", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Vypni konečně ten budík!", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Bacha, na zastávce v Jihlavě stojí revizoři!", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "V Karviné žije celé město házenou!", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Tak tomu říkám pořádná bouřka!", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Opakujeme do noci, zítra je písemka z chemie!", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Jakub dal v poslední vteřině gól a hala šílí!", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Nela udělala talentovky na konzervatoř v Plzni!", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Šťastnou cestu do Finska, Adélo!", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "To snad není pravda, zase spadla wifina!", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "To je ale výhled z Ještědu!", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Lyžák ve Špindlu, to bude jízda!", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Ticho, v knihovně se učí maturanti!", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Sláva, sbírka pro útulek v Berouně vynesla víc, než se čekalo!", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  // ── Sprosse 46 (+") ──
  { text: "\"Kdo má zítra čas na trénink?\" ptá se kapitánka v chatu.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "\"Dobrou, zítra ve škole,\" píše Ondra.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "\"Neboj, to dáš!\" povzbuzuje Viktor kamarádku před ústní maturitou.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Slovo \"brigáda\" znamená pro studenty letní práci.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Pětce se ve škole říká \"koule\".", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "\"Jak to dopadlo?\" ptá se mamka po přijímačkách.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "\"Hledáme bubeníka do kapely,\" píše se na nástěnce v Kolíně.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "\"Půjčíš mi nabíječku?\" šeptá Matěj v hodině.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "\"Mám to!\" volá Filip a ukazuje klíče od kola.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "\"Ještě chvilku,\" prosí Tereza a zase usíná.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "\"Dnes ven nemůžu, učím se,\" píše Adam do skupiny.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "\"Ahoj, jsem Mai a bydlím v Sokolově,\" představuje se nová spolužačka.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Učitelka dějepisu ráda říká \"historie se opakuje\".", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "\"Těším se na prázdniny,\" posílá Duc zprávu babičce do Hanoje.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "\"Kde přesně je ta zkušebna?\" ptá se nový basák.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "\"Bez helmy na kolo nesedej!\" připomíná táta Jonášovi.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  // ── Sprosse 47 (+:) ──
  { text: "Středa je nejhorší den: fyzika, chemie a hned po nich dvouhodinovka dějepisu.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Do batohu na vodu: plavky, pláštěnka, suchý pytel a hodně svačiny.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Náš plán na víkend: Sázava, kánoe a stany.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Vítěz ankety o nejlepší jídlo ve školní jídelně: svíčková.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Téma letošního stužkováku: Hollywood.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Úkol z češtiny: napsat úvahu o sociálních sítích.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Poslední zpráva od Lindy: dorazím pozdě, nečekejte.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Seznam věcí na tábor: spacák, baterka, ešus a repelent proti klíšťatům.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Večeře po tréninku: chleba se sýrem a velký hrnek čaje.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Tři věci, bez kterých Patrik nevyjde z domu: mobil, sluchátka a klíče.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Výsledek hlasování třídy: výlet bude do Českého ráje.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Plán na sobotu: brigáda v pekárně a večer koncert.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Naše třídní skupina se jmenuje prostě: deváťáci.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Téma debaty v hodině občanky: mobily o přestávkách ano, nebo ne?", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Pozor, změna: tělocvik bude dnes venku na hřišti.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Téma práce do SOČ: včely v Beskydech.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  // ── Sprosse 48 (+;) ──
  { text: "Venku prší; trénink se přesouvá do haly.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Kateřina miluje fyziku; její bratr zase dějepis.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Autobus z Vyškova měl poruchu; první hodinu jsme zmeškali.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Mobil se vybil; cestu k chatě hledáme podle mapy.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Někdo se učí ráno; Tobiáš zásadně po půlnoci.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "V kódu patří za příkaz středník; jinak program nefunguje.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Sobota patří brigádě; neděle odpočinku.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Polovina třídy chce na gympl; zbytek na průmyslovku.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Na Sněžce fouká; dole v Peci je skoro bezvětří.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Ondra čte učebnici dějepisu v Braillově písmu; mapy jsou hmatové.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  // ── Sprosse 49 (+') ──
  { text: "Ve hře Baldur's Gate tráví Vojta celé víkendy.", kind: "satz", stufen: ["teens"], minTier: 4, nurWeg: "cs" },
  { text: "V angličtině je don't běžné, čeština apostrof skoro nezná.", kind: "satz", stufen: ["teens"], minTier: 4, nurWeg: "cs" },
  { text: "Píseň Don't Stop Me Now zpívá na stužkováku celá třída.", kind: "satz", stufen: ["teens"], minTier: 4, nurWeg: "cs" },
  { text: "V Pythonu dáváme text do apostrofů, třeba 'ahoj'.", kind: "satz", stufen: ["teens"], minTier: 4, nurWeg: "cs" },
  { text: "Na výměně v Dublinu bydlí Dominika u rodiny O'Brienových.", kind: "satz", stufen: ["teens"], minTier: 4, nurWeg: "cs" },
  { text: "Ve hře Assassin's Creed ovládá Patrik historické postavy.", kind: "satz", stufen: ["teens"], minTier: 4, nurWeg: "cs" },
  { text: "Na hodině angličtiny probíráme rozdíl mezi it's a its.", kind: "satz", stufen: ["teens"], minTier: 4, nurWeg: "cs" },
  { text: "V SQL se text píše do apostrofů: 'Brno'.", kind: "satz", stufen: ["teens"], minTier: 4, nurWeg: "cs" },
  // ── Sprosse 50 (+-) ──
  { text: "Kapela Mirai pochází z Frýdku-Místku.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Na dějepise probíráme Rakousko-Uhersko.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Česko-slovenská hokejová utkání mají vždycky skvělou atmosféru.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Na brigádu do Brandýsa nad Labem-Staré Boleslavi jezdí Anežka autobusem.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Šárka posílá referát e-mailem až v noci.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Vojta trénuje e-sport ve školním klubu.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Na mapě hledáme nejkratší cestu Plzeň - Klatovy.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Zápas Sparta - Slavia sleduje půlka třídy.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Naše třídní - mimochodem fanynka Baníku - nás vzala na zápas.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Gymnázium v Ústí chystá česko-německý projekt se školou z Drážďan.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Nejlepší sci-fi knihy půjčuje knihovna v Kroměříži.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Wi-fi v knihovně funguje jen v přízemí.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Fanoušci Slovanu Liberec nosí modro-bílé šály.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Duc pochází z česko-vietnamské rodiny z Chebu.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Lednicko-valtický areál je kousek od Břeclavi.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Na hip-hopové soutěži v Olomouci tančí i Jindřich.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  // ── Sprosse 52 (+)) ──
  { text: "Ondra (basa) a Julie (bicí) zakládají kapelu.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "cs" },
  { text: "Klára se každý den učí na maturitu z angličtiny (hlavně slovíčka).", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Ve volném čase (a že ho moc není) hraje Radek šachy.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Letní kino v Písku (u řeky) promítá každý pátek.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Bratr Sabiny (sedmák) chodí na stejnou školu.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Spoj z Prahy do Liberce (přes Turnov) bývá v pátek plný.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Na Šumavě (u Kvildy) pramení Vltava.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Na brigádě (sběr jahod) si Barbora vydělá na nový mobil.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Na olympiádě z chemie (krajské kolo) skončila Veronika druhá.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Nová spolužačka (Darina z Kyjiva) mluví česky čím dál líp.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Žofie (sestra Vítka) zpívá ve sboru v Pardubicích.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Školní časopis (vychází i online) hledá nové redaktory.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  { text: "Kryštof hraje v Teplicích na housle (v orchestru ZUŠ).", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "cs" },
  // ── Sprosse 53 (+1) ──
  { text: "Derby v Liberci skončilo 1:1 a fanoušci odcházejí zklamaní.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Z matiky dostala Kristýna na vysvědčení 1, z fyziky taky.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Do finále zbývá jen 1 zápas, a to s Třincem.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Autobus číslo 11 jezdí na sídliště každých deset minut.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "V Brně jezdí tramvaj číslo 1 i kolem výstaviště.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Na tabuli svítí 11:1 pro domácí florbalisty.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Kateřina skončila na 1. místě v okresním kole recitace.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Každý 1. pátek v měsíci jsou v knihovně v Domažlicích deskovky.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Na 1. nástupišti v Olomouci čeká celá třída na rychlík.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 54 (+2) ──
  { text: "Mladá Boleslav vyhrála doma 2:1 až v prodloužení.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Do Hradce je to od nás na kole 12 kilometrů.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Na výlet se ze 22 lidí přihlásilo jen 12 odvážných.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Přijímací test se dělá ve 2 termínech a počítá se lepší výsledek.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Na 2. stupni přibývá Danielovi druhý cizí jazyk.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Matěj se učí na kytaru 2 roky a zvládne i sólo.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "S průměrem 1,2 získává Tereza na vysvědčení vyznamenání.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Ve 2 ráno ještě Kryštof ladí prezentaci.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "V tělocvičně visí 2 nové koše na basket.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Ve 12 hodin se v jídelně tvoří fronta až ke dveřím.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 55 (+3) ──
  { text: "Trénink florbalu je ve Vsetíně 3 dny v týdnu.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Jablonec prohrál 1:3, ale fanoušci zpívali dál.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Přihlášku na střední může každý podat až na 3 školy.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Ze 3. A se do soutěže přihlásili hned 3 lidé.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Ve 13 hodin končí vyučování a Linda spěchá na vlak.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Daniel ujel v sobotu na kole 33 kilometrů po Českém ráji.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Na zdravotce je ve třídě 31 lidí a jen 3 kluci.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Zkouška kapely trvá ve středu 3 hodiny.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Oceláři Třinec slavili titul 3 roky za sebou.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Za 3 dny odjíždí třída na výměnný pobyt do Polska.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Hrad Pernštejn stojí na skále od 13. století.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 56 (+4) ──
  { text: "Ve 14 hodin chodí Hana do ZUŠ na klavír.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Kristýně je 14 a na táboře letos pomáhá s mladšími dětmi.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Naše škola vede ve druhém setu 24:21 a soupeř bere oddechový čas.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Do bazénu v Ústí platí studenti 44 Kč.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Ve 4 ráno vyráží Vojta s dědou na ryby k Rožmberku.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Kurz první pomoci trvá 4 hodiny a je zdarma.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Na D1 u Jihlavy je kolona dlouhá 14 kilometrů.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Ve 4. ročníku zpracovává Matyáš seminárku o Táboritech.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Babička z Třeboně peče na stužkovák 144 koláčků.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 57 (+5) ──
  { text: "Řidičák na skútr (skupina AM) se dá udělat od 15 let.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Vyučovací hodina trvá 45 minut a velká přestávka 15 minut.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Na brigádě v kavárně v Telči dostává Sára 155 Kč na hodinu.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Na kurzu první pomoci se učíme volat 155 a mluvit klidně.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Při 35 stupních se v podkrovní třídě nedá vydržet.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Petr běží 5 kilometrů pod 25 minut.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Ve třídě 2. C je 25 lidí a 1 morče.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Od 15 let smí Natálie na brigádu do kina.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Ve 21:15 promítá zlínské kino poslední film.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "V 15:45 odjíždí Bára vlakem na trénink do Prostějova.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 58 (+6) ──
  { text: "Linka bezpečí na čísle 116 111 pomáhá zdarma a nonstop.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "V 6:45 odjíždí z Rožnova první školní autobus.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Rozálii je 16 a v sobotu tančí na prodloužené.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Po nájezdech vyhrál Vsetín 6:5 a slaví.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "V 16:15 začíná v Chomutově basketbalový trénink.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Plavecký bazén má 25 metrů a 6 drah.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Na chatě nás bude 6 a k tomu 2 psi.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Půlmaraton v Ústí uběhla Hana za 1 hodinu 56 minut.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Na Klínovci je o 6 stupňů chladněji než dole v Ostrově.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 59 (+7) ──
  { text: "V 7:15 začíná nultá hodina a Jonáš ještě spí.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Házenkáři z Karviné srovnali na 17:17 v poslední minutě.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Na brigádu do pekárny vstává Kuba ve 4 a v 7 ráno končí.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Za 7 dní je praktická maturita a Michal ladí program.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Rychlík do Pardubic odjíždí ve 12:47 z 1. nástupiště.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Notebook je 7 let starý a funguje pořád.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Na turnaj v malé kopané se přihlásilo 17 týmů z Vysočiny.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Karlův most se začal stavět v roce 1357 a hotový byl až o půl století později.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Univerzita v Olomouci vznikla v roce 1573 a je druhá nejstarší u nás.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Adamovi je 17 a ve sboru dobrovolných hasičů vede mladší děti.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 60 (+8) ──
  { text: "Na tréninku florbalu je 18 hráčů a 1 brankářka.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Volit může Klára až od 18 let.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Darovat krev se smí od 18 let.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "V 7:58 vbíhá Ema do třídy.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Za tričko na stužkovák se vybírá 285 korun.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Šachový turnaj v Klatovech má 8 kol.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Babičce z Písku je 78 a pořád jezdí na kole.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Za 18 dní se rozdává vysvědčení.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Univerzitu v Praze založil Karel IV. v roce 1348 jako první ve střední Evropě.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Seminárka z biologie je na 18 stran a Žofie ji odevzdává v pondělí.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 61 (+9) ──
  { text: "V 9. třídě se rozhoduje o střední škole.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "První set stolního tenisu skončil 11:9 pro Lindu.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "V 19:45 vystoupí v Jihlavě školní bigband.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Nová učebnice angličtiny vyjde na 299 Kč.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Za 9 měsíců je maturita a Rozálie si dělá plán opakování.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Duc ještě nečetl 39 zpráv ze skupiny.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Do 2. kola olympiády postoupilo 9 lidí z kraje.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Ve třídě bylo v červnu 29 stupňů.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Na Radhošť vyšlo 19 lidí z oddílu.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 62 (+0) ──
  { text: "Nová hokejka stojí 2 400 Kč a Petr na ni šetří z brigády.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Kurz v autoškole v Sokolově vyjde letos na 16 500 Kč.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Brigáda na festivalu: 10 hodin denně za 1 500 korun.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Derby v Olomouci skončilo 0:0 a nikdo nebyl spokojený.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Na koncertě v Hradci bylo přes 10 000 lidí.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "V roce 2024 vyhrála Barbora Krejčíková Wimbledon.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Přijímačky: čeština 60 minut, matematika 70 minut.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Z každého testu u přijímaček je maximum 50 bodů.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "V 8:00 začíná první hodina a ve 14:30 končí poslední.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Sraz před kinem je ve 20:15 a film běží od 20:30 do půlnoci.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Za doučování matiky si Vítek bere 200 korun na hodinu.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Na hokej v Pardubicích mají studenti lístky za 150 Kč.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Za 100 dní je maturita, a tak se slaví stovka.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Hana běží desítku pod 50 minut.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Na kole to máme z Brna do Vídně kolem 130 kilometrů.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Z Prahy do Ostravy je to po dálnici asi 370 kilometrů.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Ve 20:00 začíná stream oblíbeného youtubera.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Mladí hasiči z Polné vyhráli soutěž s časem 20,5 sekundy.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "V 10:05 zvoní na konec velké přestávky.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 63 (+%) ──
  { text: "Před maturitou je v čajovně 15% sleva pro studenty.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "S kartou ISIC dostane Sára v kině 30% slevu.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Že vyhrajeme, není 100% jisté.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Mikiny kapely jsou ze 100% bavlny.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Do kakaa dává Jakub 1,5% mléko.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Za víkendovou směnu je na brigádě 10% příplatek.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Na chemii připravujeme 5% roztok soli.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Členové Junáka mají na lezecké stěně v Berouně 50% slevu.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 64 (+/) ──
  { text: "Na brigádě v kavárně v Písku je mzda 160 Kč/h.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Na skútru smí Dan jezdit nejvýš 45 km/h.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Výsledky závodu jsou na adrese skola.example/vysledky.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Zlomek 1/2 je polovina a 1/3 je třetina.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Na večerku s provozem 24/7 je spoleh i po tréninku.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Kalendář na školní rok 2026/27 visí na webu školy.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Za projekt získal Kryštof 18/20 bodů.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 65 (++) ──
  { text: "Předvolba +420 patří Česku, +421 Slovensku.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Přes Erasmus+ jede Michaela na týden do Portugalska.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Nový tarif nabízí 10 GB + neomezené volání.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Za referát dostal Vítek 1+ a pochvalu.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Na průmyslovce v Kopřivnici se učí programovat v C++.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Ema sčítá v hlavě 47 + 38 rychleji než kalkulačka.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Nabídka v bufetu: rohlík + kakao za pětatřicet korun.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 66 (+=) ──
  { text: "V Excelu sečte sloupec vzorec =SUMA(B2:B30).", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Počet známek spočítá vzorec =POČET(C2:C9).", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "V Pythonu znamená = přiřazení a == porovnání.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Ohmův zákon na fyzice píšeme jako I = U / R.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Na matice řešíme rovnici 3x + 5 = 20 bez kalkulačky.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Převod si Linda pamatuje snadno: 1 km = 1 000 metrů.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "V Excelu začíná každý vzorec znakem =, jinak je to jen text.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 67 (+_) ──
  { text: "Do školní sítě se Matěj hlásí pod jménem matej_svoboda.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Referát ukládá Rozálie do souboru referat_dejepis_final.docx.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "V Pythonu se proměnné píšou s podtržítkem, třeba pocet_bodu.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Mezery v názvu souboru nahrazuje Adam podtržítkem: foto_vylet_beskydy.jpg.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Wifi pro hosty se ve škole jmenuje gymnazium_host.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Třída si založila skupinu 9b_vylet_jeseniky.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Kapelu najdeš na Instagramu pod účtem trojka_z_garaze.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 68 (+*) ──
  { text: "Hvězdička * znamená v Pythonu násobení.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Na Discordu se kurzíva píše mezi hvězdičky: *takhle*.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Bonusové úlohy v testu označuje učitelka hvězdičkou *.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Na letáku svítí cena 99,90* a dole malým písmem podmínky.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Druhý Newtonův zákon zapisujeme F = m * a.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Místo hesla ukazuje přihlašovací okno jen ******.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Pizzerii v Kroměříži dala Tereza na mapách ****.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 69 (+&) ──
  { text: "Na festivalu zpívá R&B zpěvačka z Brna.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "V sobotu dělá oblíbený youtuber živé Q&A.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "V HTML se znak & zapisuje jako &amp;.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Nad dveřmi staré pekárny v Lounech je nápis Pekař & syn.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Na stužkováku vystupuje dvojice Kuba & Nikola.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "V Excelu spojí znak & jméno a příjmení do jedné buňky.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Klub v Jihlavě pořádá večer Folk & Country.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 70 (+<) ──
  { text: "Pod fotku z výletu dává Nela srdíčko <3 a nic víc.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Podmínka x < 10 v programu hlídá počet pokusů.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Když je počet bodů < 25, test se opakuje.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Šipka <- znamená v aplikaci krok zpět.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Že 1/3 < 1/2, vidí Tobiáš na pizze.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Filtr v e-shopu ukazuje mikiny s cenou < 500 Kč.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Znaménko < ukazuje špičkou na menší číslo.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 71 (+>) ──
  { text: "V HTML začíná odstavec značkou <p> a končí </p>.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Na Discordu udělá znak > na začátku řádku citaci.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Na radaru u školy svítí rychlost > 50 km/h červeně.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Za > 45 bodů dává učitelka jedničku.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Do poznámek dává Šimon šipky -> místo slov.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Značka <b> udělá text v HTML tučný.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "V terminálu se výstup přesměruje znakem > do souboru.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 72 (+$) ──
  { text: "Na výměnném pobytu v Kanadě platí Lukáš za oběd 12 $.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "V Excelu zamkne znak $ odkaz na buňku, třeba $B$2 v tabulce známek.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "V Bashi začíná proměnná znakem $, třeba $HOME.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Proměnné v PHP poznáš podle $ na začátku.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Bratranec z Brna je na Work and Travel v USA a vydělává 15 $ na hodinu.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Vzorce v LaTeXu píše Daniel mezi dva znaky $.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Hra na Steamu se prodává za 20 $, v korunách kolem pěti stovek.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 73 (+|) ──
  { text: "Bio na Instagramu: Brno | florbal | foto.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Název videa: Vlog | Krkonoše | lyžák.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "V Linuxu spojuje svislítko | dva příkazy.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "V tabulce v Markdownu oddělují sloupce svislé čáry |.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "V Pythonu znamená | sjednocení množin.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Svislítko | vyvolá pravý Alt s klávesou W.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Hlavička webu školy: Gymnázium Cheb | aktuality | rozvrh.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 74 (+@) ──
  { text: "Adresa na Seznamu: jmeno@seznam.cz.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "V Messengeru upozorní Bára celou skupinu přes @všichni.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Úkoly se posílají na adresu ukoly@gymnazium.example.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Na Instagramu sleduje Ema účet @mladi_hasici_brno.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Zavináč @ se na české klávesnici píše přes pravý Alt a V.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Háčky a čárky do e-mailové adresy nepatří, třeba jmeno@post.cz.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Napiš mi na mail, adresa končí @email.cz.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Pod video označí Vojta kamaráda přes @duc_skate.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 75 (+#) ──
  { text: "Pod fotky z maturáku dává Viktorie #maturak.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Pod video z lyžáku přidává Patrik #lyzak a #krkonose.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "C# se učíme na průmyslovce ve Zlíně.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Křížek # je na telefonu vpravo dole.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Modrou barvu loga zapisuje Šimon v CSS jako #0033cc a bílou jako #ffffff.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Mřížku # dostaneme pravým Altem a písmenem X.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Píseň kapely z Ostravy je #1 v žebříčku rádia.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Fotky z úklidu dáváme pod #uklidmecesko.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 76 (+€) ──
  { text: "Na Slovensku stojí permanentka na vlek 40 €.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Ve Vídni dává Matyáš za kebab 8 €.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Na výměnném pobytu v Německu je kapesné 50 € na týden.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Jízdenka z Bratislavy do Vídně vyjde zhruba na 12 €.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "V Rakousku platíme v eurech, třeba 3 € za zmrzlinu.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Palačinka u moře v Chorvatsku je za 5 €.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Za lístek na koncert v Berlíně dá Rozálie 70 €.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 78 (+]) ──
  { text: "Seznam v Pythonu: [1, 2, 3].", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Na Wikipedii visí u věty bez zdroje [zdroj?].", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "V Markdownu je hotový úkol [x] a nehotový [ ].", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Odkaz v Markdownu vypadá takhle: [text](adresa).", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "V seminárce označuje Adéla zdroje čísly v hranatých závorkách, třeba [3].", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "První prvek seznamu je body[0].", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
  { text: "Hranaté závorky [ a ] dává pravý Alt s F a G.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "cs" },
];
