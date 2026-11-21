/**
 * Korpus des Weges „ro" (Rumänisch), Charge 1 - Erwachsene (K-RO, 29.10.2026, Befund `BEFUND-2026-10-29-K-KORPUS-NEUN.md`).
 *
 * Quelle: iCloud `sprachen-2026-10-25/texte-charge-1/ro.jsonl` (je Altersgruppe 30 Sätze und 10 Absätze, neu in der
 * Sprache verfasst, `quelle: "eigen"`), geprüft von einem zweiten Prüfer (`PRUEFBERICHT-ro.md`: freigabefähig).
 * Der Text ist unverändert übernommen. Zuordnung: `alter` ⇒ `stufen`, `thema` ⇒ `topic`, `weg` ⇒ `nurWeg`; die Kennung
 * der Quelle steht als Kommentar hinter jeder Zeile.
 *  · Absätze (`art: "absatz"`) sind an den Satzgrenzen in ihre Sätze geteilt (`<id>.1`, `<id>.2` …): Korpus-Zeilen sind einzelne
 *    Übungszeilen (die längste der acht Wege davor hat 130 Zeichen), mehrsätzige Geschichten sind Serien. Kein Wort geändert.
 *  · Selbst verfasst ⇒ ohne `herkunft` (wie die Chargen von it/pl/tr/cs; `herkunft` ist für ÜBERNOMMENE Texte).
 *  · `minTier` = `minTierFor(text, "ro")` nach der eigenen Lern-Folge des Weges (`lernweg.ts`, F4), Bezugstastatur `ro`.
 * Wächter: `tests/tastenflow-texte-ro-charge1.test.ts`. Nur HINTEN anhängen (Anker, `corpusRo.ts`).
 *
 * ⚠️ DATENBLATT: nur `import type` (`scripts/buendel-aufteilung.ts`).
 */
import type { CorpusItem } from "./corpus";

export const CORPUS_RO_WEG_CHARGE1_ERWACHSENE: CorpusItem[] = [
  { text: "Ședința de la sediul din București a fost mutată pe luni, la ora zece.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "muncă" }, // ro-c1-081
  { text: "La primăria din Chișinău, cererea pentru certificatul de urbanism se depune la ghișeul trei.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "administrație" }, // ro-c1-082
  { text: "Am găsit un apartament la Cluj, aproape de stația de tramvai, și ne mutăm luna viitoare.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "locuință" }, // ro-c1-083
  { text: "Lucrez în portul Constanța și încep tura în fiecare zi la șase dimineața.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "muncă" }, // ro-c1-084
  { text: "La policlinica din Râmnicu Vâlcea, programările se pot face acum și online.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "sănătate" }, // ro-c1-085
  { text: "Aseară am fost la un spectacol de teatru la Timișoara și am stat în primul rând.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "cultură" }, // ro-c1-086
  { text: "Vecinii noștri din Baia Mare ne aduc toamna mere din livada lor de la țară.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "viață de zi cu zi" }, // ro-c1-087
  { text: "La Suceava, o pensiune caută bucătar sau bucătăreasă pentru sezonul de iarnă.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "muncă" }, // ro-c1-088
  { text: "Azi am stat o oră în trafic la Iași, așa că mâine merg la birou cu bicicleta.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "viață de zi cu zi" }, // ro-c1-089
  { text: "Colega mea de la Bălți folosește la calculator un program care mărește textul.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "ro", topic: "muncă" }, // ro-c1-090
  { text: "Vă rugăm să completați formularul cu majuscule și să semnați pe ultima pagină.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "administrație" }, // ro-c1-091
  { text: "Trimit cererea de angajare și scrisoarea de intenție până vineri, la ora douăsprezece.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "muncă" }, // ro-c1-092
  { text: "Biblioteca din Soroca are în fiecare joi o seară de lectură pentru adulți.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "cultură" }, // ro-c1-093
  { text: "Asociația de proprietari din Ploiești anunță că mâine se oprește apa caldă.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "locuință" }, // ro-c1-094
  { text: "La piața din Sibiu cumpăr mereu brânză de la aceeași familie de fermieri.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "viață de zi cu zi" }, // ro-c1-095
  { text: "Un cititor de ecran bun și câteva scurtături de tastatură fac munca mai rapidă.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "muncă" }, // ro-c1-096
  { text: "La Tulcea, muzeul organizează ateliere de fotografie pentru toate vârstele.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "cultură" }, // ro-c1-097
  { text: "Am lăsat mașina în service la Craiova și mă întorc acasă cu autobuzul.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "viață de zi cu zi" }, // ro-c1-098
  { text: "În Reșița am renovat bucătăria și am pus geamuri noi, mai bine izolate.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "locuință" }, // ro-c1-099
  { text: "Am vizitat bisericile de lemn din Maramureș și am ascultat povestea fiecăreia.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "cultură" }, // ro-c1-100
  { text: "Medicul de familie din Rădăuți mă sfătuiește să merg mai des pe jos.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "sănătate" }, // ro-c1-101
  { text: "La fabrica din Bacău, colegii mei au primit calculatoare noi și o zi de instruire.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "muncă" }, // ro-c1-102
  { text: "În fiecare dimineață cumpăr pâine caldă de la brutăria din colț, la Siret.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "viață de zi cu zi" }, // ro-c1-103
  { text: "După o zi lungă la birou, o plimbare de douăzeci de minute îmi face bine.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "sănătate" }, // ro-c1-104
  { text: "La poșta din Orhei, un angajat ajută clienții cu deficiențe de vedere să completeze formularele.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "administrație" }, // ro-c1-105
  { text: "Robotul telefonic spune: „Lăsați un mesaj după semnal și vă sunăm înapoi.”", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "viață de zi cu zi" }, // ro-c1-106
  { text: "Firma noastră din Brașov angajează trei programatori și o persoană la contabilitate.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "muncă" }, // ro-c1-107
  { text: "Duminică, la Târgoviște, am ascultat cu familia un concert de muzică veche.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "cultură" }, // ro-c1-108
  { text: "Prietenii din Chișinău ne invită sâmbătă la o expoziție de covoare tradiționale.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "ro", topic: "cultură" }, // ro-c1-109
  { text: "Căutăm o casă cu grădină aproape de mare, undeva între Constanța și Mangalia.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "locuință" }, // ro-c1-110
  { text: "Asociația Nevăzătorilor din România a sărbătorit în septembrie 2026 împlinirea a 70 de ani.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "ro", topic: "comunitate" }, // ro-c1-111.1
  { text: "Pentru membrii ei, accesul la informație înseamnă astăzi cititoare de ecran, cărți audio și formulare online bine făcute.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "comunitate" }, // ro-c1-111.2
  { text: "Orice site public ar trebui să poată fi folosit și doar cu tastatura.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "comunitate" }, // ro-c1-111.3
  { text: "Pe 4 ianuarie este Ziua Mondială Braille.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "ro", topic: "cultură" }, // ro-c1-112.1
  { text: "Alfabetul Braille folosește puncte în relief, pe care persoanele nevăzătoare le citesc cu degetele.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "cultură" }, // ro-c1-112.2
  { text: "Există și afișaje Braille care se conectează la calculator.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "ro", topic: "cultură" }, // ro-c1-112.3
  { text: "Așa se pot citi mesaje, documente și pagini web.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "ro", topic: "cultură" }, // ro-c1-112.4
  { text: "Bună ziua, vă scriu în legătură cu cererea depusă săptămâna trecută la primăria din Ungheni.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "administrație" }, // ro-c1-113.1
  { text: "Vă rog să îmi spuneți dacă mai este nevoie de vreun document.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "administrație" }, // ro-c1-113.2
  { text: "Pot trimite actele și în format electronic, scanate.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "administrație" }, // ro-c1-113.3
  { text: "Vă mulțumesc anticipat.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "administrație" }, // ro-c1-113.4
  { text: "Cu stimă, Elena Ciobanu", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "administrație" }, // ro-c1-113.5
  { text: "Echipa noastră lucrează de doi ani în regim hibrid.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "muncă" }, // ro-c1-114.1
  { text: "Marțea și joia suntem toți la birou, în rest lucrăm de acasă.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "muncă" }, // ro-c1-114.2
  { text: "Ședințele scurte le ținem dimineața, iar după prânz rămâne timp liber pentru lucrul concentrat.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "muncă" }, // ro-c1-114.3
  { text: "Pentru colegii cu copii mici, programul flexibil contează mult.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "ro", topic: "muncă" }, // ro-c1-114.4
  { text: "La Timișoara se aud pe stradă româna, maghiara, germana și sârba.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "comunitate" }, // ro-c1-115.1
  { text: "La biblioteca din cartierul meu există cărți în mai multe limbi.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "ro", topic: "comunitate" }, // ro-c1-115.2
  { text: "Joia, un grup de pensionari se întâlnește acolo ca să citească ziarul și să discute.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "comunitate" }, // ro-c1-115.3
  { text: "Uneori se alătură și studenți străini care învață limba română.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "comunitate" }, // ro-c1-115.4
  { text: "Am cumpărat o casă veche lângă Târgu Jiu și o renovăm încet, cameră cu cameră.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "locuință" }, // ro-c1-116.1
  { text: "Am schimbat acoperișul, apoi instalația electrică.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "locuință" }, // ro-c1-116.2
  { text: "Anul acesta ne ocupăm de bucătărie și de baie.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "locuință" }, // ro-c1-116.3
  { text: "Vecinii ne dau sfaturi și ne împrumută scule, iar noi îi chemăm la masă în grădină.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "locuință" }, // ro-c1-116.4
  { text: "În satul nostru din Maramureș, vecinii încă se ajută la treburile mari.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "comunitate" }, // ro-c1-117.1
  { text: "Când cineva își repară acoperișul, se adună câte zece oameni cu scule.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "comunitate" }, // ro-c1-117.2
  { text: "Femeile și bărbații lucrează împreună, iar copiii aduc apă și cuie.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "comunitate" }, // ro-c1-117.3
  { text: "Seara se mănâncă la o masă lungă, în fața casei.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "comunitate" }, // ro-c1-117.4
  { text: "Am deschis o pensiune mică lângă Gura Humorului.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "muncă" }, // ro-c1-118.1
  { text: "Am lărgit ușile și am făcut o rampă, ca oaspeții care folosesc scaun rulant să intre ușor.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "muncă" }, // ro-c1-118.2
  { text: "Meniul îl avem și în format audio, și în Braille.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "muncă" }, // ro-c1-118.3
  { text: "Anul trecut am avut oaspeți din cinci țări.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "muncă" }, // ro-c1-118.4
  { text: "La Iași, mama mea a făcut o programare la medicul de familie cu ajutorul unei aplicații.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "sănătate" }, // ro-c1-119.1
  { text: "A primit un mesaj cu ora exactă și cu actele necesare.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "ro", topic: "sănătate" }, // ro-c1-119.2
  { text: "În sala de așteptare nu a stat mai mult de zece minute.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "sănătate" }, // ro-c1-119.3
  { text: "Data viitoare vrea să încerce și o consultație prin video.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "sănătate" }, // ro-c1-119.4
  { text: "Ieri am mers la primăria din Caracal pentru un certificat.", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "ro", topic: "administrație" }, // ro-c1-120.1
  { text: "La intrare, un aparat dă bonuri cu numere de ordine.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "administrație" }, // ro-c1-120.2
  { text: "Pe ecran apar numărul și ghișeul potrivit.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "administrație" }, // ro-c1-120.3
  { text: "Am așteptat cam un sfert de oră, iar funcționara a rezolvat totul repede și politicos.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "ro", topic: "administrație" }, // ro-c1-120.4
];
