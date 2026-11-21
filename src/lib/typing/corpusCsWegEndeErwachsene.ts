/**
 * Korpus nur für Lernweg "cs", Ende des Lernwegs: Sprossen 45-78 (`!` bis `]`) - Altersstufe ERWACHSENE
 * (CS-T9, 09.10.2026, Bauplan `BAUPLAN-2026-10-02-VIER-SPRACHEN-IT-PL-TR-CS.md` §4 Etappe T;
 * Befund `BEFUND-2026-10-09-CS-T9-ERWACHSENE-ENDE.md`). Form nach CS-T7 (gleiche Sprossen, Kinder),
 * CS-T6 (Erwachsene Mitte) und PL-T9 (Erwachsenen-Ende, nur als Form).
 *
 * Johannes' Regeln, wörtlich: „keine texte werden übersetzt, Texte aus den regionen, altersgemäß
 * und zeitgemäß" · „die texte sollen einen bezug zum land und sprache haben" · „denke wie die
 * menschen in den jeweiligen ländern". ALLES NEU AUF TSCHECHISCH VERFASST - keine Text-Datei einer
 * anderen Sprache als Inhalt geöffnet, nichts übersetzt, kein Tatoeba-Satz (darum kein `herkunft`).
 *
 * ZEICHENSATZ (`introOrder("cs")`, auf `cs` UND `cs-qwerty` dieselbe Folge, im Wächter festgeschrieben):
 *   45 ! · 46 " · 47 : · 48 ; · 49 ' · 50 - · 51/52 ( ) · 53-61 Ziffern 1-9 · 62 0 ·
 *   63 % · 64 / · 65 + · 66 = · 67 _ · 68 * · 69 & · 70 < · 71 > · 72 $ · 73 | · 74 @ · 75 # · 76 € ·
 *   77/78 [ ].
 * Die Sprosse einer Zeile ist das kleinste n, an dem `fitText` sie UNGEKÜRZT liefert; `minTier`
 * rechnet `minTierFor(text, "cs")`. `(` und `[` haben keine eigenen Zeilen (feste Paare).
 *
 * ⚠️ Mechanik, gemessen (wie CS-T7):
 *  · `! " : ; - ( )` sind weglassbar - vor ihrer Sprosse kommt die Zeile GEKÜRZT an. Jede Zeile trägt
 *    darum einen Buchstaben ab `í` (22); nach `! :` und am Anfang einer Anführung steht nur ein Name,
 *    ein Ort oder ein klein geschriebenes Wort (Naht-Regel, `scripts/_fruehfassung.mts` kennt Weg „cs"
 *    nicht und blieb unberührt). Der Wächter rechnet jede gekürzte Fassung aus.
 *  · `'`, Ziffern und die Zeichen ab `%` sind hart: die Zeile kommt erst an ihrer Sprosse.
 *  · D-2 (`nurKleinschrift`): jede Zeile beginnt gross und kommt für Erwachsene nie vor ⇧.
 *
 * ZAHLEN (Glossar §1 Nr. 5, §4 Falle 4/5): Uhrzeit „v 7:15", „ve 20:30" · Dezimalkomma „5,5 litru" ·
 * Tausender mit einem normalen Leerzeichen („18 500 Kč", „3 000 000 korun") · „4 €", „25 $" nach der
 * Zahl · Prozent nur als Adjektiv OHNE Leerzeichen („21% sazba DPH", „4,5% úrokem") · Ordnungszahl mit
 * Punkt nur mitten im Satz („do 31. května", „ve 3. patře") · NIE eine Zahl mit Punkt am Satzende ·
 * „ve" vor 2, 3, 4, 12-14, 20-29, „ze 40 uchazečů", „Z 11 uchazečů".
 *
 * GESCHLECHT der tippenden Person: keine Vergangenheit und kein hartes Adjektiv mit „jsem/jsi", kein
 * „rád/ráda", kein „bych" + l-Form, keine Ehe-Rolle; 1. Person nur Präsens/Futur oder Mehrzahl.
 * KEINE FEIERTAGE (brauchen Johannes' Ja; Wächter mit Sperrliste). E-Mail nur `.example`, keine
 * Kontonummer, kein rodné číslo, keine echte Telefonnummer (nur 112 und Vorwahlen).
 *
 * ERWACHSENENALLTAG mit Zeichen im Alltagssinn: Arbeit (šichta, směny R | O | N, přesčasy, BOZP,
 * zkušební doba, úřad práce, rekvalifikace) · Ämter (datová schránka, daňové přiznání, sleva na
 * poplatníka, ČSSZ, nemocenská, neschopenka, ošetřovné, mateřská, číslo jednací, podatelna) · Wohnen
 * (nájem, kauce, 2+kk, 3+1, SVJ, vyúčtování, revize plynu a komína) · Geld (hypotéka, 21% DPH,
 * spořicí účet, stravenky, faktury) · Büro (Excel =SUMA, $A$1, ###, Dateinamen mit _, Formularfelder
 * ______, [x], citace [3]) · Familie · Reisen (D1, D8, D46, €, Kanada $) · Sprache (rožni/rozsviť,
 * hokna, it's/don't, zavináč beim Diktieren, mřížka/křížek, # gegen č.) · Erblindung ohne Etikett
 * (hlasový výstup, odečítač) · Migration sachlich (Olena, pan Nguyen, kurz češtiny pro cizince).
 *
 * ORTE aus allen vierzehn Kraje, Böhmen UND Mähren/Schlesien (Wächter zählt). € nie mit einem Ort
 * in Tschechien. Sperrliste `sperrlisteCs.ts`: kein Wort aus Kern ODER Wortbasis.
 * Wächter: `tests/tastenflow-texte-cs-erwachsene-ende.test.ts`. Nur anhängen - Korpus-Anker im selben
 * Commit (`npx tsx scripts/erzeuge-korpus-anker.mts`).
 */
import type { CorpusItem } from "./corpus";

export const CORPUS_CS_WEG_ENDE_ERWACHSENE: CorpusItem[] = [
  // ── Sprosse 45 (! - Ausrufezeichen) ──
  { text: "Pozor, v garáži se natírá podlaha!", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "K volbám si vezměte občanku, jinak nedostanete lístky!", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Konečně pátek, šichta je za námi!", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Výplata dorazila, můžeme zaplatit nájem!", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Kotel zase stávkuje, volejte servis!", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Hlavně nezapomeň podepsat přihlášku!", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Gratulujeme, Jana složila státnice!", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Hurá, hypotéku nám schválili!", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "To je ale fronta na poště!", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Pozor na kapsáře v pražském metru!", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Šťastnou cestu a pozdravujte všechny v Brně!", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Neparkujte před vjezdem, odtahujeme!", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Pozor, v sobotu se odečítají vodoměry!", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Zítra v celé ulici nepoteče voda!", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Hlasování o novém výtahu skončilo, máme většinu!", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Revize plynu je povinná, nezapomeňte na ni!", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Vyřízeno, nový pas je hotový!", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Ještě že je v kuchyni hasicí přístroj!", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Rychle, ať stihneme poslední vlak do Ústí!", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Ten parkovací automat zase nebere karty!", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Smlouva podepsaná, od pondělí nastupuje Petra!", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Bacha, na Ještědu fouká!", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Zahrada je jako ze žurnálu, paráda!", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Paráda, v Luhačovicích mají volný pokoj!", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Na zubaře se v Kladně čeká měsíce!", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Pozor, na Vysočině klouže silnice!", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Konečně jsme splatili úvěr!", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Ať se daří v novém zaměstnání!", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Kolona na Pražském okruhu je nekonečná!", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Daňové přiznání je odeslané, uf!", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Neotvírejte přílohy z neznámých adres!", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Ostravo, ty jsi ale krásně zelená!", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  // ── Sprosse 46 (" - Anführungszeichen) ──
  { text: "\"Ukončete výstup a nástup, dveře se zavírají,\" ozve se v pražském metru.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "\"Platba kartou, nebo hotově?\" ptá se číšník v Olomouci.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "\"Dobrý den, tady finanční úřad,\" ozve se v telefonu.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Šéfová píše do zápisu z porady jen \"beze změn\".", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Na dveřích ordinace visí cedulka \"dnes neordinuji\".", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Na Moravě se říká \"rožni\", v Čechách \"rozsviť\".", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "\"Kdy bude kolaudace?\" ptají se sousedé z Kolína.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Ve smlouvě je napsáno \"na dobu neurčitou\".", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "\"Vyúčtování bude v březnu,\" slibuje správce domu.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Na úřadě zní nejčastěji \"to musíte doložit\".", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "\"Kdo ví, kde je klíč od kolárny?\" ptá se soused z prvního patra.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Dědeček nadává na \"ty moderní platby mobilem\".", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Firma z Pelhřimova používá heslo \"kvalita z Vysočiny\".", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "\"Kde je tady pošta?\" ptá se turistka v Českém Krumlově.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Oblíbená věta kolegů v Liberci zní \"to se nějak udělá\".", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Brňáci říkají práci \"hokna\".", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  // ── Sprosse 47 (: - Doppelpunkt) ──
  { text: "Na nákup: mléko, chleba, máslo a prášek na praní.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "K vyřízení pasu stačí jediné: platná občanka.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Na schůzi SVJ se řeší: výtah, střecha a fond oprav.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Úřední dny: pondělí a středa, v pátek zavřeno.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Do kufru k moři: plavky, krém a mapa dálnic.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Výhoda home office: žádné dojíždění.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Důvod absence: nemoc dítěte, tedy ošetřovné.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Podklady pro účetní: faktury, výpisy a pojistky.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Tři věci na chalupu v Beskydech: dřevo, svíčky a dobrá kniha.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Na segedín je potřeba: vepřové maso, kysané zelí a smetana.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Program porady: rozpočet, směny a dovolené na léto.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Na ceduli u Mácháče stojí: koupání na vlastní nebezpečí.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Moravské vinařské obce: Mikulov, Valtice a Velké Bílovice.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Termín u zubaře: úterý odpoledne.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Lékárnice radí: brát po jídle a zapít vodou.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Na úřadě chybí jediné: dopisy ve formátu pro hlasový výstup.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Hlavní obory v Kopřivnici: auta, stroje a logistika.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Nová kuchyň v Hradci stála hodně peněz: linka, deska a spotřebiče.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  // ── Sprosse 48 (; - Strichpunkt) ──
  { text: "Nájem odchází z účtu sám; zálohy na energie platíme zvlášť.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Ve Zlíně je volných míst dost; byty jsou ale drahé.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Petr pracuje na směny; Ivana sedí v kanceláři.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Babička hlídá v úterý; dědeček ve čtvrtek.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Krkonoše v zimě lákají lyžaře; v létě cyklisty.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Na úřadě je fronta; formulář jde podat i datovou schránkou.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Šéf chce zprávu do pátku; účetní ji chce dřív.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Výtah je zase porouchaný; nákup neseme pěšky.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  // ── Sprosse 49 (' - Apostroph) ──
  { text: "V angličtině se píše it's a don't, čeština apostrof skoro nepotřebuje.", kind: "satz", stufen: ["erwachsen"], minTier: 4, nurWeg: "cs" },
  { text: "Kolega Seán O'Brien učí v Plzni angličtinu.", kind: "satz", stufen: ["erwachsen"], minTier: 4, nurWeg: "cs" },
  { text: "Irský pub O'Reilly's je hned u nádraží v Pardubicích.", kind: "satz", stufen: ["erwachsen"], minTier: 4, nurWeg: "cs" },
  { text: "Kurz angličtiny pro dospělé: don't, doesn't a won't.", kind: "satz", stufen: ["erwachsen"], minTier: 4, nurWeg: "cs" },
  { text: "Ve francouzštině je apostrof častý, třeba c'est nebo l'amour.", kind: "satz", stufen: ["erwachsen"], minTier: 4, nurWeg: "cs" },
  { text: "Na konferenci do Brna přiletěl profesor D'Angelo z Říma.", kind: "satz", stufen: ["erwachsen"], minTier: 4, nurWeg: "cs" },
  // ── Sprosse 50 (- - Bindestrich) ──
  { text: "Pracovní porada - úterý, zasedačka ve třetím patře.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Do Sedlce-Prčice jezdí v neděli jen dva autobusy.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Rodiče se přestěhovali do okresu Praha-východ.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Byt v Ostravě-Porubě nabízí balkon a sklep.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Kolegyně z česko-slovenské rodiny mluví doma oběma jazyky.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Smlouva na dobu určitou - to je pro banku problém.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Pružná pracovní doba - hlavně aby byl úkol hotový.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Úřad práce v Chomutově - druhé patro, dveře vpravo.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Rychlík Praha-Ostrava staví v Zábřehu.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Zelenina z farmy u Žatce - jen v sobotu na trhu.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Červeno-bílá páska znamená, že se tu kope.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Firma hledá řidiče - nástup ihned, směny dle domluvy.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Lázně Jeseník - léčba dýchacích cest.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Okresní soud Plzeň-město sídlí v centru.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Kupujeme dvougenerační dům - dole rodiče, nahoře my.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Benzinka v Karlových Varech - otevřeno nonstop.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  // ── Sprosse 52 () - Klammer, mit () ──
  { text: "Neschopenka (pracovní neschopnost) se dnes posílá elektronicky.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "OSVČ (osoba samostatně výdělečně činná) odvádí zálohy na pojištění.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Kdo nemá datovou schránku (datovku), nosí papíry osobně.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "cs" },
  { text: "Výplata (bez prémií) se letos zvedla jen málo.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Sousedka (paní Králová) nám zalévá kytky.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Praktický lékař (ordinace v Kolíně) posílá na odběry.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Kotel na tuhá paliva (starý litinový) je třeba vyměnit.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Kolegyně Hana (účetní z Prostějova) odchází v létě do důchodu.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Chata v Beskydech (bez elektřiny) je k pronájmu.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Kolonáda v Mariánských Lázních (celá z litiny) láká fotografy.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Elektrárna v Mělníku (u soutoku Labe a Vltavy) vytápí i část Prahy.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Dolní Vítkovice (dříve hutě a doly) jsou dnes plné kultury.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  { text: "Program na čtení obrazovky (odečítač) čte Pavlovi i výplatní pásku.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "cs" },
  // ── Sprosse 53 (1) ──
  { text: "Formulář A1 vydává ČSSZ při vyslání do zahraničí.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Kamiony na D1 u Jihlavy blokují pravý pruh.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "V 11 hodin je porada v zasedačce.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Podatelna je v 1. patře vlevo.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Z 11 uchazečů vybrali jen Romana.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "V Karviné visí na nástěnce úřadu 111 nabídek.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Na operaci kolena se čeká přes 1 rok.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Rychlík z Olomouce nabírá zpoždění 11 minut.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Fixace hypotéky končí za 1 rok.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Číslo popisné 111 patří hospodě na návsi.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 54 (2) ──
  { text: "Na 112 se dovoláte i bez kreditu.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Ve 12 hodin se zavírá podatelna.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Kolegyně Iva vychovává 2 děti a pracuje na zkrácený úvazek.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Večerka pana Nguyena je otevřená do 22 hodin.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Ve 2. patře sídlí účetní firma.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Pojišťovna hradí 2 preventivní prohlídky u zubaře ročně.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "V Mostě čekáme na poště už 21 minut.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Kurz účetnictví trvá 12 týdnů.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Ze Sokolova do fabriky dojíždíme 22 kilometrů.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Radka čerpá 12 dní dovolené v kuse.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Autobus 221 staví u nemocnice v Jablonci.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 55 (3) ──
  { text: "Třídní schůzky ve 3. A jsou v Klatovech každé čtvrtletí.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Do 31. května musí majitelé zaplatit daň z nemovitostí.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Ve Škodovce v Mladé Boleslavi se pracuje ve 3 směnách.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Půjčku na auto splácíme ještě 3 roky.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Zkušební doba v nové práci trvá 3 měsíce.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Ve 13 hodin je schůzka s klientem z Olomouce.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Byt ve 3. patře je bez výtahu.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Na Šumavě je po nočním sněžení 13 centimetrů prašanu.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Program na bavlnu trvá u pračky 3 hodiny.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Řádek 13 v přiznání nechává Lenka prázdný.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 56 (4) ──
  { text: "Za 14 dní nastupuje Tomáš do nového zaměstnání.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Ve 4 ráno vstává pekař z Třebíče.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Rodina Horákových se 4 dětmi shání větší bydlení.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Ve firmě v Chrudimi se pracuje jen 4 dny v týdnu.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Ve 4. patře sídlí pobočka pojišťovny.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Kurz češtiny pro cizince trvá 24 lekcí.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Kolegyně Olena žije v Česku 4 roky.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Za hodinu parkování u nemocnice v Ústí dáváme 24 korun.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "K přiznání patří formulář o 4 stranách.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Zápis do školky v Pardubicích je 4. května.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 57 (5) ──
  { text: "V 5:45 vyjíždí první autobus z Mikulova.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Nemocenskou vyplácí ČSSZ až od 15. dne nemoci.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Auto spálí 5,5 litru na sto kilometrů.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Ve 13:45 začíná porada vedení.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Jirka dostává stravenky po 125 korunách.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Ve 14:15 střídá ranní směnu odpolední.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Za 15 minut zavírá pobočka banky v Písku.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "V 15:15 odjíždí rychlík do Žďáru nad Sázavou.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Na zápis do školky v Kroměříži je 45 míst.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Revize komína vyjde na 525 korun.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Jirka používá hlasový výstup už 15 let.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 58 (6) ──
  { text: "V 6:15 už stojíme v koloně na Pražském okruhu.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Zubní ordinace v Hodoníně ordinuje do 16 hodin.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Dálnice D46 vede z Vyškova do Olomouce.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Přesčasy za 16 hodin budou až v další výplatě.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Na schůzi SVJ dorazilo jen 6 vlastníků.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Při -6 stupních startuje auto v Ostravě jen ztěžka.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Karel dostal smlouvu na 6 měsíců.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Kurz první pomoci pro řidiče začíná v 16:15 v hasičárně.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Účetní chce podklady vždy do 16. dne v měsíci.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Děti do 6 let jezdí v MHD zdarma.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 59 (7) ──
  { text: "V 7:15 se před úřadem práce v Teplicích tvoří fronta.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "V 17:45 končí šichta ve slévárně.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "V 7 večer se zamyká vchod do domu.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Na Pradědu bývá o 7 stupňů méně než v Šumperku.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Vlak z Budějovic nabral zpoždění 17 minut.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Dceři Kristýně je 7 let a chodí do 1. třídy.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Od 7 do 15:15 sedí Alena v kanceláři.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "V 7:45 si sestry v jihlavské nemocnici předávají službu.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Kolega Marek šlape do firmy na kole 27 kilometrů.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Žádost se dá podat osobně do 17 hodin.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 60 (8) ──
  { text: "Peněžitá pomoc v mateřství se vyplácí 28 týdnů.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Řidičák skupiny B se dělá od 18 let.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "V 8:15 začíná školení BOZP.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "V sobotu se volí od 8 do 14 hodin.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Byt v Opavě má 78 metrů čtverečních.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Nájmy v Brně vzrostly o 8 procent.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "V 18:45 zavírá lékárna u nádraží v Přerově.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Kolega Libor dojíždí 38 kilometrů z Kutné Hory.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "V domě číslo 18 je výtah mimo provoz.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Kolona na D8 u Lovosic měří 8 kilometrů.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 61 (9) ──
  { text: "Od roku 1993 bydlí rodiče v jednom domě v Uherském Hradišti.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Sraz absolventů ročníku '96 bude v Jihlavě.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Za 9 měsíců se Petra vrací z rodičovské do práce.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Na Ještědu bylo ráno 19 stupňů pod nulou.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Dům z roku 1928 potřebuje novou střechu.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Za pojištění domácnosti platíme 199 korun měsíčně.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Prohlídka zámku v Lednici začíná v 9:45 a trvá hodinu.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Paní Krejčí v 89 letech ještě sama ryje zahradu.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Večerní kurz angličtiny v Lounech začíná 9. září.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Fakturu za internet platíme do 19. dne v měsíci.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "V Chomutově bydlíme v paneláku s 9 patry a 2 vchody.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 62 (0) ──
  { text: "Za nájem v Praze dáváme 18 500 Kč měsíčně.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Od 8:00 do 17:00 je podatelna otevřená.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "V 10:30 čeká Janu pohovor na úřadu práce.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Elektřina pro rodinu ze 4 lidí dělá zhruba 2 000 korun měsíčně.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Sleva na poplatníka činí 30 840 Kč ročně.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Lékař vypsal neschopenku na 10 dní.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Kauce za nový byt v Brně je 30 000 Kč.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Do roku 2050 splácí rodina Bartošových úvěr 3 000 000 korun na dům v Kolíně.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Vodné a stočné v Plzni je přes 100 korun za kubík.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Ve 20:30 končí odpolední směna v nemocnici.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Cestovní pas pro dospělé stojí 600 Kč.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Od roku 2020 se papírová neschopenka zaměstnavateli nenosí.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Od roku 2023 mají datovou schránku povinně všechny firmy.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Ze 40 uchazečů pozvali jen 5 na pohovor.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 63 (% - Prozent) ──
  { text: "Na většinu zboží se vztahuje 21% sazba DPH.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Banka nabízí spořicí účet s 3% úrokem.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "V supermarketu v Táboře je 25% sleva na kávu.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Banka v Liberci nabízí hypotéku s 4,5% úrokem.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Zaměstnanci v Prostějově dostali 10% navýšení mzdy.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Do kafe dáváme jen 1,5% mléko.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "S 15% slevou vyjde zájezd k moři levněji.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 64 (/ - Schrägstrich) ──
  { text: "Rychlost v obci je 50 km/h, na dálnici 130 km/h.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Na rozhodnutí je číslo jednací OD/456/2026 a podpis vedoucí.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Rohlík v pekárně v Náchodě stojí 4 Kč/kus.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Na pumpě u Klatov je nafta za 36 Kč/l.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Na adrese Lipová 125/7 v Jihlavě je nová ordinace.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Infolinka pojišťovny běží 24/7 i o víkendu.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Režim 12/12 znamená dvanáctihodinové směny.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Pekárna v Kutné Hoře upeče 600 rohlíků/hodinu.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 65 (+ - Plus) ──
  { text: "Byt 2+kk v Plzni se pronajímá od září.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Rodina hledá byt 3+1 se zahradou nebo balkonem.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "S předvolbou +421 se volá na Slovensko.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Mzda + prémie + stravenky: to je celý balíček.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Tarif pro celou rodinu: volání + SMS + 10 GB dat.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Pojištění auta: povinné ručení + havarijní.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Rodinné vstupné do aquaparku v Liberci je pro 2 dospělé + 2 děti.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 66 (= - Gleich) ──
  { text: "Rovnítko = na začátku buňky znamená vzorec.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Výplata za brigádu = odpracované hodiny x hodinová sazba.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Hrubá mzda - odvody = čistá mzda.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Účtenka z jídelny: 3 x 45 = 135 korun.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "V katastru platí: 1 ar = 100 metrů čtverečních.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Na plánku domu znamená 1 cm = 1 m.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 67 (_ - Unterstrich) ──
  { text: "Smlouvu ukládáme do souboru smlouva_najem_2026.pdf.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Uživatelské jméno: petra_ucetni.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Ve mzdové tabulce se sloupec jmenuje hruba_mzda.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Na formuláři je: podpis ______ a datum ______.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Heslo nesmí obsahovat mezery, místo nich dejte _.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Složka se jmenuje faktury_2026_brezen.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Fotky z dovolené mají názvy jako more_2026_01.jpg.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 68 (* - Stern) ──
  { text: "Hvězdička * u ceny odkazuje na drobné písmo.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Akce platí do vyprodání zásob*.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Na telefonu zmáčkněte * a pak číslo pobočky.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Povinné kolonky formuláře jsou označené *.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Vzorec =A1*B1 v Excelu násobí dvě buňky.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Hodnocení hotelu v Luhačovicích: ****.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 69 (& - Und-Zeichen) ──
  { text: "Advokátní kancelář Novák & partneři sídlí v Olomouci.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Firma Dvořák & syn opravuje střechy na Vysočině.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Na dveřích visí cedule Kadeřnictví Jana & Eva.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Kavárna Káva & dort je hned u radnice v Třeboni.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Pekárna Chléb & rohlík v Mostě peče od pěti ráno.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Vinný sklep Šebela & syn je ve Velkých Pavlovicích.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Autoservis Kovář & Pospíšil najdeme v Karviné.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 70 (< - kleiner als) ──
  { text: "V tabulce hledáme řádky s částkou < 1 000 CZK.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Teplota v serverovně musí být < 25 stupňů.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Hluk v kanceláři má být < 50 decibelů.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Tlak < 140/90 je podle doktorky v pořádku.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Zakázky s cenou < 500 000 zadává obec bez soutěže.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Saldo < 0 znamená, že dlužíme.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 71 (> - grösser als) ──
  { text: "Částky > 10 000 Kč schvaluje vedoucí.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "V mailu se citovaný text značí znakem >.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Pokud je spotřeba > 3 000 kWh, vyplatí se jiný tarif.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Teplota > 38 stupňů? Volejte lékaře.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Hodnocení > 4 hvězdy mají v Telči jen dva hotely.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Zakázky > 2 000 000 musí projít výběrovým řízením.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 72 ($ - Dollar) ──
  { text: "Firma z Brna fakturuje americkým klientům v $.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Bratranec v Kanadě bere 25 $ na hodinu.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Pevný odkaz $A$1 se při kopírování vzorce nemění.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Aplikace stojí 5 $ měsíčně, platí se kartou.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Ceny v USA se píšou se $ před číslem, u nás Kč za číslem.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Zpáteční letenka do New Yorku stála 700 $.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 73 (| - senkrechter Strich) ──
  { text: "Svislá čára | v příkazovém řádku spojuje dva příkazy.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Účtenka z večerky: rohlík 4 | máslo 52 | mléko 22 | celkem 78 korun.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Polední menu: svíčková | guláš | smažák.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Patička e-mailu: Jana Malá | účetní | Strakonice.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Směny tento týden: R | R | O | N | volno.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "V záhlaví faktury: dodavatel | odběratel | splatnost.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 74 (@ - zavináč) ──
  { text: "Žádost posíláme na podatelna@urad.example.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Fakturu pošlete na ucetni@firma.example.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Při diktování adresy říkáme místo @ zavináč.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Kolegu označíme v Teams přes @ a jméno.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Rezervace chaty v Krkonoších: info@chata-snezka.example.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Na rekvalifikaci se hlásíme přes kurzy@uradprace.example.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Potvrzení chodí z adresy noreply@banka.example.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 75 (# - mřížka) ──
  { text: "Hlas v telefonu říká: pro češtinu stiskněte 1, pak #.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Inzeráty na brigády najdete pod #brigada.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "V anglických tabulkách se pořadí značí #, česky č.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Znak # se na klávesnici jmenuje mřížka, v telefonu křížek.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Když Excel ukáže ###, je sloupec moc úzký.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Pekárna z Jičína sdílí fotky pod #kolace.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 76 (€ - Euro) ──
  { text: "Rakouská dálniční známka na 10 dní stojí asi 12 €.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Brigáda v Bavorsku: 15 € na hodinu.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Za kávu ve Vídni dáváme 4 €.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Kurz je zhruba 1 € = 25 CZK.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Hotel v Chorvatsku chce zálohu 200 €.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Kolegové, kteří jezdí do Německa, dostávají výplatu v €.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Na Slovensku zaplatíme oběd kolem 9 €.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  // ── Sprosse 78 (] - eckige Klammer, mit [) ──
  { text: "Ve formuláři zaškrtněte [x] souhlasím.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Citace v odborném textu končí odkazem [3].", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Ve smlouvě chybí jméno, místo něj je [doplnit].", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "V přepisu porady zůstalo [nesrozumitelné].", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "V zápisu z jednání je poznámka [viz příloha].", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
  { text: "Na seznamu úkolů znamená [ ] nevyřízeno a [x] hotovo.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "cs" },
];
