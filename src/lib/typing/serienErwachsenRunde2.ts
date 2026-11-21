/**
 * ZWEITE RUNDE Bücherei-Serien für die Stufe `erwachsen`, deutsch
 * (Charge E2-DE, 22.08.2026).
 *
 * ANLASS (gemessen am 22.08. mit `scripts/_seroeffnung.mts`, Grundmenge 128
 * Serien / 6264 Zeilen - nicht geschätzt): Das deutsche Regal las sich über die
 * Öffnungspunkte 13 / 17 / 20 / 22 / 26 / 31 / 99 Einheiten so:
 *
 *   de/kids       [ 4, 12, 21, 30, 33, 47, 47]
 *   de/teens      [ 4, 10, 23, 26, 31, 50, 50]
 *   de/erwachsen  [ 2,  4,  8,  9, 12, 19, 19]   <- die dünnste deutsche Zelle
 *
 * Wer als erwachsener Mensch mit dreizehn Tasten einsteigt, fand zwei Serien;
 * mit siebzehn vier. Die Charge I1c (16.08.) hatte die Zelle von elf auf
 * neunzehn gehoben und dabei die erste eigene Treppe gebaut - diese Datei legt
 * die zweite darüber, mit dem Schwerpunkt genau dort, wo der Abstand zu
 * `kids`/`teens` am größten ist: an den frühen und mittleren Sprossen.
 *
 * DIE TREPPE, die diese Datei nachlegt (jede Zeile gemessen, `minTier`
 * deklariert == berechnet, `oeffnetBei` gegen die Zielsprosse geprüft mit
 * `scripts/_k2check.mts`):
 *
 *   n=13  Der Kai        (Geschichte, 4 x 12)   erwachsen      Welle 1
 *   n=13  Die Ernte      (Geschichte, 4 x 12)   erwachsen      Welle 1
 *   n=17  Der Notruf     (Geschichte, 4 x 12)   erwachsen      Welle 1
 *   n=17  Die Truhe      (Geschichte, 4 x 12)   erwachsen      Welle 1
 *   n=20  Die Turmuhr    (Geschichte, 4 x 12)   erwachsen      Welle 2
 *   n=20  Die Haltestelle(Geschichte, 4 x 12)   erwachsen      Welle 2
 *   n=22  Die Schleuse   (Geschichte, 4 x 12)   erwachsen      Welle 2
 *   n=22  Die Backstube  (Geschichte, 4 x 12)   erwachsen      Welle 2
 *   n=26  Der Dienstplan (Geschichte, 4 x 12)   erwachsen      Welle 3
 *   n=26  Der Chor       (Geschichte, 4 x 12)   erwachsen      Welle 3
 *   n=26  Die Wolle      (Wissen,     4 x 12)   teens+erwachsen Welle 3
 *
 * Die Datei wächst in Wellen; jede Welle ist für sich grün und einzeln
 * committet. Diese Liste nennt IMMER nur, was wirklich in der Datei steht.
 *
 * WARUM DIE ERZÄHLENDEN SERIEN NUR `erwachsen` TRAGEN: Regel 6 verbietet nur
 * die Paarung `kids` + `erwachsen`; `teens` + `erwachsen` wäre erlaubt. Der
 * Zweck dieser Charge ist aber gerade die eigene Zelle - das teens-Regal steht
 * an denselben Punkten auf 4/10/23/26/31, es braucht keinen Nachschub, und ein
 * geteilter Bestand hätte die Messung nur scheinbar verbessert. Wissens-Serien
 * werden anders entschieden: Sachkunde ohne Erwachsenen-Stoff verliert nichts,
 * wenn eine Fünfzehnjährige sie liest, und darf `teens` mittragen - »Die
 * Wolle« tut es darum als einzige Serie dieser Datei.
 *
 * WARUM NUR EINE WISSENS-SERIE: Von den neunzehn Serien, die `erwachsen`
 * vorher trugen, waren bereits fünf Wissens-Serien (Der Kalk, Das Papier,
 * Kaffee, Wie das Wasser in die Leitung kommt, Wie eine E-Mail reist) - was
 * dem Regal fehlte, waren Erzählungen mit einem erwachsenen Einsatz. Diese
 * Charge legt darum zehn Geschichten und eine Sachreihe nach.
 *
 * ★ DIE BUCHSTABENFOLGE seit Charge O1 (21.08.):
 *
 *     f j d k s l a ö e n i r t h o u c g m b w z v p ä ü x y q ß
 *
 * Sprossen: n=13 (13 Buchstaben) · ⇧ (14) · +h (15) · +o (16) · +u (17) ·
 * +c (18) · +g (19) · +m (20) · +b (21) · +w (22) · +z (23) · +v (24) ·
 * +p (25) · +ä (26). Messwerkzeug: `npx tsx scripts/_k2check.mts --budget`.
 *
 * WORTSCHATZ-GRENZEN - was beim Schreiben DIESER Charge aufgelaufen ist. Die
 * Listen in `serienFrueh.ts`, `serienTeensFrueh.ts`, `serienErwachsenFrueh.ts`
 * und `serienOFolge.ts` gelten unverändert; hier steht nur, was dort noch
 * nicht stand, jedes am Objekt geprüft:
 *
 *  • n=13 `a d e f i j k l n r s t ö` - **kein h**, und das ist die härteste
 *    Grenze dieser Sprosse: kein *haben*, kein *steht/sieht/geht*, kein *nach*,
 *    kein *ihn/ihm/ihr/ihre* (es bleiben *er, sie, es, sein, seine* und der
 *    Name), **kein *Jahr*** und damit keine Jahresangabe. Zeit läuft über
 *    *seit den Ferien*, *seit dieser Frist*, *erst - dann - am Ende*. Neu
 *    aufgelaufen: **kein *Ebene*** (b) - die Landschaft heißt *die Senke*;
 *    **kein *Deck*** (c) - am Kai sind es *die Latten*; **kein Schiffswort
 *    überhaupt** (Schiff, Kahn, Fähre, Boot, Frachter tragen alle einen
 *    gesperrten Buchstaben), darum lädt der Kran auf *Laster*; **kein *Halle***
 *    (h) - es bleibt *die Diele*; **kein *fehlt*** (h). Frei und tragend:
 *    *die Kette, die Niete, die Delle, der Riss, die Latte, die Leiter, die
 *    Frist, die Akte, die Liste, die Kiste, der Kies, der Sand, die Rinne, der
 *    Lein, die Linse, die Distel, der Klee, die Ernte, das Feld, die Insel, das
 *    Tal, die Reederei, der Statiker, die Leiterin*. Zahlwörter: nur *eins,
 *    drei, elf* (und *erste, dritte, elfte*) - alles andere trägt u, b, z, v
 *    oder h.
 *  • n=17 `+ h o u` - jetzt *und, auf, aus, unter, hinter, ohne, oder, oft,
 *    sofort, also, nur, nun, hier, dort, der Ort, die Not, die Luft, die Stunde,
 *    die Uhr, das Haus, der Flur, der Hof, der Hahn, das Foto, das Telefon, die
 *    Flut, das Ufer, die Leute, seit Jahren*. Neu aufgelaufen, weil `ä` noch
 *    fehlt: **kein *hält*** - die dritte Person von *halten* ist gesperrt, und
 *    zwar in JEDER Serie dieser Sprosse. Ersatz sind andere Verben (*trennt die
 *    Linie nie, fasst, stellt, tut, lässt sich nicht sagen*), der Plural
 *    (*Laute halten*) oder das Präteritum (*hielt, hielten*). Ebenso gesperrt
 *    bleiben **c** (*nicht, ich, sich, auch, nach, noch, sucht, leuchtet,
 *    Nacht, Licht, Schicht*), **g** (*sagt, fragt, Tag, Leitung, jung, ruhig*),
 *    **m** (*im, am, mit, dem, diesem, man, Name, Nummer, Zimmer*), **b, w, z,
 *    p, v**. *Nummer* fehlt in einer Notruf-Geschichte - erzählt wird über *die
 *    Linie*; *die Leitung* trägt ein g, *die Leitstelle* nicht.
 *  • n=20 `+ c g m` - jetzt *ich, nicht, sich, auch, nach, noch, schon, doch,
 *    durch, Nacht, Licht, Schicht, sagt, fragt, liegt, Tag, lange, jedes
 *    ge-Partizip, im, am, mit, dem, man, Morgen, Monat, Motor, Metall, Meter,
 *    Minute, Million, Maschine, Meister, Menge, Mitteilung*. **Die zwei
 *    wichtigsten Ersatzwörter dieser Sprosse**: *jedoch* und *sondern* für das
 *    gesperrte *aber* (b), und *damit* für das gesperrte *zu* - eine um-zu-Fügung
 *    ist unterhalb von n=23 gar nicht bildbar, auch keine indirekte Frage mit
 *    *ob* (b). Neu aufgelaufen: **kein *Gewicht*** (w) - der Antrieb einer
 *    Turmuhr heisst hier *ein Stein an einer Kette*; **kein *Pendel*, kein
 *    *Zifferblatt*, kein *Zahnrad*** (p, z) - es bleiben *die lange Stange, der
 *    Anker, die Hemmung, die Trommel, die Achse, die Nase, die Feder*; **kein
 *    *schreiben*, kein *gibt*, kein *halb*, kein *derselbe*** (b) - notiert
 *    wird, und *an der gleichen Stelle*; **kein *sitzen*, kein *Sitz*, kein
 *    *Anzahl*, kein *Platz*** (z, p). Monate: nur *Januar, Mai, Juni, Juli,
 *    August*; Wochentage: alle ausser *Mittwoch* (w). Zahlwörter: *eins, drei,
 *    sechs, acht, neun, elf, hundert, tausend, Million* - *zwei, vier, fünf,
 *    sieben, zehn, zwölf* tragen alle w, v, ü, b oder z.
 *  • n=22 `+ b w` - jetzt *aber, haben, bei, bis, bleibt, oben, neben, sieben,
 *    Arbeit, Betrieb, Brief, Bank, Geld, geben, wir, was, wie, wo, weil, wieder,
 *    Wasser, Wind, Wetter, warm, etwas*. Gesperrt bleiben **z v p ä ü ß**:
 *    weiterhin **kein *zu*** und **kein *von/vor/viel***, dazu **kein *Pumpe*,
 *    kein *Platz*, kein *Kopf*, kein *Treppe*, kein *Preis*, kein *Papier***
 *    (p) und **kein *Salz*** (z) - in einer Backstube fällt damit die
 *    Zutatenliste weg, es bleiben Mehl, Wasser und der Sauerteig. ⚠️ Die
 *    ss/ß-Falle des Bestands gilt hier besonders: *heisst, gross, schliesst,
 *    draussen* sind auf einer deutschen Tastatur schlicht falsch geschrieben
 *    und werden von `tests/typing-serien-frueh.test.ts` abgewiesen - die Wörter
 *    sind zu VERMEIDEN, nicht umzuschreiben.
 *  • n=26 `+ z v p ä` - fast alles. Es fehlen **ü x y q ß**, und das trifft
 *    wieder die Dienstwörter: **kein *für*, kein *über*, kein *müssen*** (das
 *    einzelne *muss* geht, der Infinitiv nicht), **kein *zurück*, kein
 *    *natürlich*, kein *Tür*, kein *Stück*, kein *früher*, kein *Frühjahr***,
 *    dazu **kein *gross*, kein *heisst*, kein *weiss*, kein *Strasse*** - und
 *    zwar auch nicht in der ss-Schreibung, siehe die Warnung oben. Zahlwörter:
 *    *eins, zwei, drei, vier, sechs, sieben, acht, neun, zehn, elf, zwölf,
 *    dreizehn, zwanzig, vierzig, sechzig, hundert, tausend* - es fehlt genau
 *    die *fünf* (ü) und die *dreissig* (ß). Neu aufgelaufen: *stürzt* (ü) wird
 *    zu *ist gefallen*, *Frühjahr* wird zu *Mai oder Juni*, *Gerüche* wird zu
 *    *Geruch*, *anfühlt* wird zu *man merkt es an ihr*.
 *
 * ZEITFORM: Alle erzählenden Serien stehen im Präsens; nur Rückblicke laufen
 * im Präteritum (*hielt, reiste, redeten*) - das Perfekt bräuchte unterhalb
 * von n=19 ein ge-Partizip und ist dort gar nicht bildbar.
 *
 * FORM: vier Etappen zu zwölf Zeilen, jede Zeile EIN Satz (Mehrsatz-Zeilen
 * bräuchten frühe Fassungen, Regel 8) und höchstens 85 Zeichen, wörtliche Rede
 * OHNE Anführungszeichen (Entscheidung Johannes 28.07.), keine Ziffern,
 * Satzzeichen nur . , - ? ! : ; und nur der einfache Bindestrich
 * ([[feedback_nur_bindestrich]]).
 *
 * TON: erwachsen und ernst, kein Maskottchen, kein sprechendes Tier, keine
 * Moral im Schlusssatz. Jede Serie endet auf ein Bild, nicht auf einen Satz,
 * der erklärt, was das Bild bedeutet.
 *
 * RECHTE: alle erzählenden Serien sind SELBST VERFASST - reale Texte, auch
 * gemeinfreie, halten sich nicht an eine Buchstaben-Freischaltung (Bauplan
 * 27.07. §10). Die Fakten der Wissens-Serien sind je an zwei unabhängigen
 * Stellen gegengeprüft; die Belege stehen am Objekt in `herkunft.fundstelle`
 * und im Kommentar darüber.
 */
import type { Serie } from "./serie";

/** Herkunft der erzählenden Serien dieser Datei (selbst verfasst, keine Fremdrechte). */
const EIGEN = {
  quelle: "Sensorik",
  lizenz: "Eigenes Werk (selbst verfasst)",
  autor: "Sensorik-Lernplattform",
} as const;

// ───────────────────────────────────────────────────────────────────────────────
// n=13 - Ein Umschlagkai an einem Fluss, ein alter Kran, eine Kette mit einem
// Riss. Ohne h/o/u/b/c/g/m gibt es kein einziges Schiffswort und keine
// Jahresangabe; erzählt wird über Laster, Kisten, Kies und die Kette selbst.
// Der Einsatz: Wer den Riss listet, macht die Frist unerfüllbar - wer ihn
// verschweigt, riskiert den Kran. Nadja listet ihn.
// ───────────────────────────────────────────────────────────────────────────────
const DER_KAI: Serie = {
  slug: "der-kai",
  titel: "Der Kai",
  kind: "geschichte",
  stufen: ["erwachsen"],
  minTier: 1,
  topic: "arbeit",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Nadja leitet den Kai in einer alten Stadt an der Elster.",
        "Der Kai ist klein, die Kante ist steil, die Latten sind alt.",
        "An der Kante ist ein eiserner Kran.",
        "Der Kran ist alt, er ist eisern, er ist stark.",
        "Nadja kennt jede Kette, jede Niete, jeden Riss an diesen Ketten.",
        "Sie leitet den Kai, seit die alte Leiterin ins Tal reiste.",
        "Ein Laster liefert Kisten, ein anderer liefert Sand, ein dritter Kies.",
        "In den Kisten sind Salat, Reis, Filets, Tee.",
        "Erst rasten die Laster an der Linie, dann fasst der Kran an.",
        "Er fasst, er kreist, er stellt die Last an das Feld.",
        "Seit den Ferien liest Nadja eine Akte, die eine Frist nennt.",
        "In dieser Frist testet ein Statiker den Kran; endet der Test elend, endet der Kai.",
      ],
    },
    {
      lines: [
        "Nadja tritt an den Kran, dann ist es still an der Kante.",
        "Sie tastet die Kette, Stelle an Stelle.",
        "Das Eisen ist kalt.",
        "An der elften Stelle findet sie eine Delle.",
        "In dieser Delle ist ein feiner Riss.",
        "Der Riss ist fein, er ist kalt, er ist real.",
        "Nadja listet den Riss in der Akte.",
        "Dann rastet sie an der Latte.",
        "Sie denkt an den Test, sie denkt an die Frist.",
        "Endet der Test elend, endet jede Stelle an dieser Kante.",
        "Ein Statiker liest Akten, ein Statiker tastet selten jede Stelle.",
        "Nadja faltet die Akte, dann tritt sie an die Leiter.",
      ],
    },
    {
      lines: [
        "Der Statiker trifft ein, als es kalt ist.",
        "Er nennt seinen Titel: Statiker der Landesstelle.",
        "Er liest die Akte, Seite an Seite.",
        "Nadja stellt die Leiter an den Kran.",
        "Sie tastet die Kette an der elften Stelle.",
        "Dann nennt sie den Riss.",
        "Der Statiker fasst die Delle, erst leise, dann fest.",
        "Er ist still, dann redet er.",
        "Er nennt es klar: Diese Kette endet als Alteisen.",
        "Der Kran rastet, die Laster reisen an die Kante der Stadt.",
        "Nadja rastet an der Latte, dann liest sie die Akte des Statikers.",
        "Darin ist eine Adresse in Trier.",
      ],
    },
    {
      lines: [
        "Nadja reist an die Adresse in Trier.",
        "An dieser Adresse ist eine alte Reederei.",
        "In einer Diele ist ein Kran, der seit den Ferien rastet.",
        "An seiner Kette ist keine Delle, an seinen Nieten ist kein Riss.",
        "Idris leitet diese Reederei.",
        "Er liest Nadjas Akte, Seite an Seite.",
        "Idris kennt keinen Laster, der Kies an seine Insel stellt.",
        "Nadjas Kai kennt Laster, Nadjas Kai kennt Kies.",
        "Nadja faltet eine Karte, Idris faltet eine andere.",
        "Die Kette reist an die Elster, der Kies reist an die Insel.",
        "Der Kran fasst, er kreist, er stellt die erste Last.",
        "Nadja tastet diese Kette, Stelle an Stelle.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────────
// n=13 - Drei kleine Felder in einer Senke, eine leere Rinne, eine Liste, die
// elf Kisten nennt. Ohne o/u/w/g/z gibt es weder Regen noch Wasser noch
// Trockenheit als Wort; die Dürre steht als Riss in der Erde und als starke
// Distel. Gelöst wird sie nicht durch Technik, sondern dadurch, dass vier
// Leute, die seit einem alten Streit nicht reden, in EINE Liste schreiben.
// ───────────────────────────────────────────────────────────────────────────────
const DIE_ERNTE: Serie = {
  slug: "die-ernte",
  titel: "Die Ernte",
  kind: "geschichte",
  stufen: ["erwachsen"],
  minTier: 1,
  topic: "arbeit",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Ilka leitet drei Felder an der Ill.",
        "In den Feldern sind Linsen, Lein, Klee.",
        "Sie ist die Dritte, die diese Felder leitet.",
        "Eine alte Rinne teilt das Land.",
        "Diese Rinne ist leer, seit den Ferien ist sie leer.",
        "In der Erde sind Risse, erst fein, dann tief.",
        "Die Linsen sind klein, die Distel ist stark.",
        "Ilka fasst in die Erde, sie fasst Sand.",
        "An der Diele ist eine Liste, alt in den Lettern.",
        "Diese Liste nennt eine Last: elf Kisten Linsen, in dieser Frist.",
        "Die Kisten reisen an eine Insel, die jede Kiste listet.",
        "Ilka liest die Liste, dann tritt sie in das erste Feld.",
      ],
    },
    {
      lines: [
        "Ilka streift die Linsen in eine Kiste.",
        "Sie streift, sie listet, sie stellt die Kiste an die Kante.",
        "Das erste Feld liefert eine Kiste.",
        "Das andere Feld liefert eine Kiste.",
        "Das dritte Feld liefert kein Drittel einer Kiste.",
        "Diese Ernte ist klein.",
        "Drei Kisten sind keine elf.",
        "Ilka rastet an der Rinne.",
        "Nils tritt an, er kennt jede Delle in dieser Rinne.",
        "Nils leitet ein Feld an der anderen Seite der Ill.",
        "Sein Lein ist fein, seine Ernte ist es nie.",
        "Er nennt eine Idee, die in dieser Senke keiner je nannte.",
      ],
    },
    {
      lines: [
        "Nils nennt es klar: Eine Liste kann alle Felder dieser Senke nennen.",
        "In dieser Senke sind Ilkas Felder, sein Feld, die Felder der alten Karin.",
        "Keiner an der Ill listet je in einer Liste.",
        "Als Ilkas Alte die Rinne teilten, stritten sie.",
        "Seit dieser Frist redet keiner an dieser Rinne.",
        "Ilka kennt diesen Streit, kein Detail dieses Streits kennt sie.",
        "Sie tritt an die Diele der alten Karin.",
        "Karin ist alt, sie ist steif, sie ist klar.",
        "Karin liest die Liste, dann nennt sie eine Kiste Linsen.",
        "Dann nennt sie eine andere.",
        "Dann nennt sie drei.",
        "Eine Diele in dieser Senke ist seit den Ferien leer.",
      ],
    },
    {
      lines: [
        "Diese Diele ist alt, die Latten sind fein, die Klinke ist steif.",
        "Das Feld an dieser Diele ist frei, es ist tief, es ist alt.",
        "Darin sind Linsen, sie sind fein, sie sind reif.",
        "In der Akte des Landes ist eine Adresse in Kiel.",
        "Ilka sendet eine Karte an diese Adresse.",
        "Erst ist es still.",
        "Dann trifft Elsa ein: alt, leise, feste Stiefel an den Fersen.",
        "Elsa kennt das Feld, sie kennt jede Linse darin.",
        "Sie nennt eine Kiste, dann nennt sie drei.",
        "Als alle listen, sind es elf Kisten.",
        "Die elf Kisten reisen an die Insel.",
        "An der leeren Rinne rasten Ilka, Nils, Karin, Elsa.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────────
// n=17 - Eine Nacht in der Leitstelle. Ein Anruf ohne Worte, und der Ort steht
// nur in den Geräuschen dahinter. Ohne c/g/m fehlen *nicht*, *Nacht*, *Licht*,
// *Leitung*, *Nummer* und *man*; ohne ä fehlt *hält* - Halina TRENNT die Linie
// nie, sie hält sie nicht. Der Einsatz ist eine Entscheidung unter Unsicherheit:
// drei Höfe, ein Laut als einziges Ja.
// ───────────────────────────────────────────────────────────────────────────────
const DER_NOTRUF: Serie = {
  slug: "der-notruf",
  titel: "Der Notruf",
  kind: "geschichte",
  stufen: ["erwachsen"],
  minTier: 2,
  topic: "arbeit",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Halina hat Dienst in der Leitstelle, allein, seit drei Uhr.",
        "Die Leitstelle ist ein heller Saal ohne Fenster.",
        "Auf den Tafeln stehen Orte, Linien, Fristen.",
        "Halina hört jeden Anruf, dann hört sie ihn erneut.",
        "Der erste Anruf ist eine Frau, die fiel.",
        "Der andere ist ein Alter, der keine Luft hat.",
        "Der dritte ist ein Sohn, der keinen Rat hat.",
        "Halina notiert, sie ordnet, sie sendet den Notdienst.",
        "Dann ist es still, sehr still.",
        "Dann tönt die Linie erneut.",
        "Halina hört Luft, sie hört ein Rasseln, sie hört kein Ja.",
        "Der Anrufer nennt keinen Ort, keinen Titel, keine Not.",
      ],
    },
    {
      lines: [
        "Halina trennt die Linie nie.",
        "Sie hört hin, so fest sie kann.",
        "Erst ist da nur Luft.",
        "Dann ist da ein Ton, hell und sehr fern.",
        "Halina notiert: ein Ton, hell, drei Laute.",
        "Hinter den Fenstern ist es hell.",
        "Dann ruft ein Hahn.",
        "Ein Hahn in dieser Stadt ist selten.",
        "Jonas tritt an ihre Seite und hört still hin.",
        "Er nennt eine Idee: Der Ton ist ein Silo.",
        "Ein Silo und ein Hahn, das ist kein Saal, das ist ein Hof.",
        "In dieser Stadt sind drei Höfe.",
      ],
    },
    {
      lines: [
        "Jonas ordnet die Akten der drei Höfe.",
        "Der erste Hof ist an der Furt.",
        "Der andere ist hinter der alten Halle.",
        "Der dritte ist auf einer Insel in der Enns.",
        "Halina redet in die Linie, leise und klar.",
        "Sie nennt es so: Ein Laut ist ein Ja, keiner ist ein Nein.",
        "Halina redet: Sind Sie an der Furt?",
        "Erst ist da nur Stille.",
        "Dann ist da ein Laut.",
        "Halina notiert: an der Furt.",
        "Jonas sendet den Notdienst an den Hof an der Furt.",
        "In der Linie ist die Luft nun leiser.",
      ],
    },
    {
      lines: [
        "Halina redet und redet.",
        "Sie nennt Orte, sie nennt Linien, sie nennt die Uhr.",
        "Sie redet, denn Laute halten einen Alten in dieser Stunde fest.",
        "Der Notdienst reist an die Furt.",
        "Sie finden das Tor offen, den Hof leer, den Hahn auf einer Latte.",
        "In der Halle ist ein Alter, hinter einer Tonne.",
        "Er hielt das Telefon in seiner Hand.",
        "Er fiel, als er den Ofen ausleerte.",
        "Die Helfer holen ihn aus der Halle.",
        "In der Linie ist ein Laut, dann ist die Linie tot.",
        "Halina ist still, dann notiert sie den Ort in der Akte.",
        "Dann tönt die andere Linie.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────────
// n=17 - Eine Frau, die Häuser leert, in denen niemand mehr ist. In einer Truhe
// liegt ein Foto mit drei Leuten und einem Ort auf der Kehrseite. Kein
// Familien-Rührstück: Rosa erklärt, was auf dem Foto steht, mehr nicht, und
// Ronja stellt keine Frage. Ohne b fehlt sogar das Wort *Erben* - das Haus
// gehört darum dem Land. ★ Der Titel heisst NICHT »Das Foto«: diesen Slug
// trägt seit Charge I1 eine teens-Serie in `serienTeensFrueh.ts`.
// ───────────────────────────────────────────────────────────────────────────────
const DIE_TRUHE: Serie = {
  slug: "die-truhe",
  titel: "Die Truhe",
  kind: "geschichte",
  stufen: ["erwachsen"],
  minTier: 2,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Ronja leert Haus und Halle, seit Jahren, allein.",
        "Sie holt alles heraus: Truhen, Tonnen, Sofas, Akten.",
        "Das Land ruft sie an, das Land nennt die Adresse, das Land nennt die Frist.",
        "Dieses Haus ist an der Ostseite, hinter einer Reihe alter Linden.",
        "Der Alte des Hauses ist tot, das Haus ist still, die Luft ist alt.",
        "Ronja öffnet die Fenster, dann tritt sie in den Flur.",
        "Auf den Fliesen ist Sand, an der Diele ist Rost.",
        "Sie sortiert: Akten in die Tonne, Sofas an das Tor.",
        "In einer Truhe unter einer Latte findet sie Fotos.",
        "Es sind alte Fotos, hell und hart, ohne Titel.",
        "Nur eines hat hinten Lettern.",
        "Die Lettern sind steil und alt: Rosa, an der Traun.",
      ],
    },
    {
      lines: [
        "Ronja stellt das Foto an das Fenster.",
        "Darauf sind drei Leute an einer Tonne, hinter einer Reihe Linden.",
        "Eine ist eine Frau, klein und hell.",
        "In ihrer Hand ist eine Rolle Draht.",
        "An ihrer Seite ist ein Alter, an der anderen ein Kind.",
        "Der Alte des Hauses ist keiner der drei.",
        "Ronja sortiert alles in die Tonne, nur das Foto nie.",
        "Sie hat keinen Titel und keine Akte, nur steile Lettern.",
        "Rosa an der Traun, das sind drei Laute und kein Ort.",
        "Ronja ruft die Auskunft an, dann das Land.",
        "Keiner kennt eine Rosa an der Traun.",
        "Dann findet Ronja unter den Fotos eine Karte, alt und hart.",
      ],
    },
    {
      lines: [
        "Die Karte nennt einen Kurort an der Traun.",
        "Ronja reist an diesen Ort.",
        "Der Ort ist klein: drei Linien, ein Kurhaus, ein Stift.",
        "Das Stift ist alt, hell und still: Hier sind Alte, die keiner holt.",
        "Ronja tritt ein, das Foto in ihrer Hand.",
        "Eine Helferin liest die Lettern hinten.",
        "Sie ruft: Rosa!",
        "Rosa ist in einer Diele hinter der Halle.",
        "Rosa ist alt, sehr alt, sie hört keinen Laut ohne ihre Hörhilfe.",
        "Ronja tut das Foto in Rosas Hand.",
        "Rosa sieht hin und ist still.",
        "Dann nennt Rosa einen Ort, den Ronja nie hörte.",
      ],
    },
    {
      lines: [
        "Rosa nennt es leise: Das ist die Stunde, in der die Flut das Ufer holte.",
        "Alle in dieser Reihe hielten Draht in der Hand.",
        "Der Alte des Hauses hielt Rosas Kind fest.",
        "Seit dieser Stunde redeten sie nie erneut.",
        "Rosa reiste an die Traun, der Alte in das Haus hinter den Linden.",
        "Ronja hört still hin.",
        "Rosa dreht das Foto und liest die Lettern.",
        "Die Lettern sind ihre, sie erkennt ihre Hand.",
        "Rosa fasst das Foto so fest, als sei es Draht.",
        "Ronja redet nie.",
        "Sie sortiert seit Jahren, sie sortiert alles, nur dieses eine nie.",
        "In der Halle hinter den Linden ist die Truhe leer.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────────
// n=20 - Eine Uhrmacherin steigt in einen Turm, dessen Uhr seit acht Jahren
// steht. Mit dem m wird Technik erzählbar (Meter, Motor, Metall, Minute), aber
// b/p/z/v/w fehlen weiter: kein *Gewicht* (w) - der Antrieb ist *ein Stein an
// einer Kette*; kein *Pendel* und kein *Zifferblatt* (p, z) - es bleiben *die
// lange Stange*, *die Glocke*, *der Anker*, *die Hemmung*, *die Trommel*; kein
// *aber* (b) - dafür *jedoch*, *sondern*, *doch*; kein *zu* - dafür *damit*.
// ───────────────────────────────────────────────────────────────────────────────
const DIE_TURMUHR: Serie = {
  slug: "die-turmuhr",
  titel: "Die Turmuhr",
  kind: "geschichte",
  stufen: ["erwachsen"],
  minTier: 2,
  topic: "technik",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Margit ist Uhrmacherin, sie ist es seit langem.",
        "Ihre Kammer ist eng: drei Tische, sechs Leuchten, tausend kleine Teile.",
        "Sie kann Uhren, die sonst niemand mehr kann.",
        "An einem Morgen im Sommer ruft die Gemeinde an.",
        "Die Turmuhr steht still, sie steht seit acht Jahren still.",
        "Die Gemeinde denkt an einen Motor, elektrisch, gesteuert aus der Ferne.",
        "Margit soll nur eines sagen: Taugt das Alte noch?",
        "Sie nimmt den Auftrag an.",
        "Anton, der Mesner, öffnet das Tor.",
        "Die Stufen sind eng und hoch, in der Mitte ausgetreten.",
        "Hoch hinauf ist es kalt und still.",
        "In der Kammer unter der Glocke steht die Uhr, und an ihr fehlt nichts.",
      ],
    },
    {
      lines: [
        "Margit legt die Hand an die Trommel.",
        "Der Stein an der Kette liegt am Grunde des Turms.",
        "Er ist tief unten, die Kette ist locker.",
        "Sie holt die Kette ein, Meter um Meter.",
        "Der Stein steigt, langsam, dann steht er still.",
        "Margit löst die Hemmung.",
        "Das Rad dreht sich, eine Achse singt, dann ist es still.",
        "Es ist nicht das Rad.",
        "Margit leuchtet auf den Anker.",
        "Der Anker hat acht Nasen, und eine ist rund.",
        "Eine runde Nase hat keinen Halt.",
        "Margit sucht das Teil, das die Nase halten soll, und es ist nicht da.",
      ],
    },
    {
      lines: [
        "Das Teil ist eine Feder aus Stahl, so lang, dass sie in eine Hand geht.",
        "In den Akten der Gemeinde steht nichts.",
        "Anton kennt eine alte Kiste im Turm.",
        "Darin sind Nadeln, Nieten, ein Hammer ohne Stiel.",
        "Die Feder ist nicht darin.",
        "Anton sagt, in schlechten Jahren hat man aus Turmuhren Metall geholt.",
        "Auch aus dieser.",
        "Margit misst die Achse, sie misst die Nase, sie misst den Halt.",
        "Dann geht sie heim.",
        "In ihrer Kammer legt sie einen Stahl in die Klammer.",
        "Sie feilt, sie misst, sie feilt erneut.",
        "Nach acht Stunden hat sie eine Feder, die sonst niemand mehr macht.",
      ],
    },
    {
      lines: [
        "Am Morgen darauf steigt Margit den Turm hinauf.",
        "Anton leuchtet.",
        "Margit legt die Feder an die Achse.",
        "Sie dreht die Nadel, sie hakt sie ein, sie löst die Hand.",
        "Der Anker fasst.",
        "Ein Ton, dann noch einer, dann ein dritter.",
        "Die Uhr geht.",
        "Um elf tönt die Glocke, elf Mal.",
        "Unten im Ort tritt niemand aus dem Tor.",
        "Acht Jahre lang hat hier nichts geschlagen.",
        "Nur eine alte Frau am Ende der Gasse steht still und sieht hinauf.",
        "Margit sieht es aus der Luke unter der Glocke.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────────
// n=20 - Ein Fahrer, eine Buslinie über acht Orte, eine Messung des Amtes, die
// nur im August lief. Kein Aufstand und kein Sieg: am Ende steht die Strecke
// nicht still, aber sie geht nur noch halb so oft. Ohne b fehlt *schreiben* -
// notiert wird; ohne z fehlen *sitzen*, *Anzahl*, *Zeit* und jedes Zahlwort
// ausser *eins, drei, sechs, acht, neun, elf, hundert, tausend*.
// ───────────────────────────────────────────────────────────────────────────────
const DIE_HALTESTELLE: Serie = {
  slug: "die-haltestelle",
  titel: "Die Haltestelle",
  kind: "geschichte",
  stufen: ["erwachsen"],
  minTier: 2,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Salih lenkt den Kurs drei, sechs Mal am Tag, seit neun Jahren.",
        "Der Kurs drei geht durch acht Orte und endet an einer Klinik.",
        "Es ist keine Strecke, die einen reich macht.",
        "Um sechs holt er die alten Leute aus dem Talort.",
        "Um acht holt er die Kinder aus dem Ort an der Kirche.",
        "Am Mittag ist er allein, das ist so, das ist immer so.",
        "Hilde steigt seit langem an der gleichen Stelle ein.",
        "Sie nennt ihn Herr Salih, er nennt sie Frau Hilde.",
        "An einem Montag im Januar kommt eine Mitteilung aus dem Amt.",
        "Das Amt hat gemessen, das Amt hat gerechnet, das Amt hat entschieden.",
        "Der Kurs drei kostet mehr, als er einnimmt.",
        "Am Ende des Jahres soll er stillstehen.",
      ],
    },
    {
      lines: [
        "Salih liest die Mitteilung in der Halle des Amtes.",
        "Hinten in der Akte stehen die Tage der Messung.",
        "Es sind acht Tage, alle im August.",
        "Im August ist die Schule leer.",
        "Im August hat die Klinik nur den Notdienst.",
        "Im August sind auch die alten Leute des Talortes nicht hier.",
        "Salih rechnet nach, mit einem Stift, an der Kante des Tisches.",
        "An einem Tag im August sind elf Leute in seinem Kurs.",
        "An einem Tag im Januar sind es hundertacht.",
        "Salih legt den Stift hin.",
        "Er kennt keinen Menschen im Amt, der das je gesehen hat.",
        "Also holt er ein leeres Heft aus dem Kasten unter dem Lenkrad.",
      ],
    },
    {
      lines: [
        "Am Morgen darauf notiert Salih die erste Fahrt.",
        "Er notiert die Stunde, den Ort, die Menge.",
        "Hilde sieht es und fragt, und Salih sagt es ihr.",
        "Am Mittag hat Hilde die Gasse gefragt.",
        "Sie kommen und nennen ihre Namen, und Hilde notiert.",
        "Der Fleischer notiert, dass er den Kurs drei am Freitag nimmt.",
        "Die Frau aus der Klinik notiert ihre Schicht.",
        "Ein Mann im Rollstuhl notiert, dass er sonst nicht heimkommt.",
        "Alle acht Orte stehen nach einem Monat in dem Heft.",
        "Es sind mehr als neunhundert Fahrten.",
        "Das Heft ist dick, und es riecht nach dem Kasten unter dem Lenkrad.",
        "Salih holt es nicht in das Amt, er sendet es an das Amt.",
      ],
    },
    {
      lines: [
        "Nach drei Monaten kommt eine andere Mitteilung.",
        "Der Kurs drei steht nicht still.",
        "Er geht nun drei Mal am Tag, nicht sechs.",
        "Das ist kein Ende, und es ist auch kein Anfang.",
        "Am Morgen darauf steht Salih an der gleichen Stelle.",
        "Es ist kalt, es ist dunkel, die Leuchte an der Halle ist rot.",
        "Hilde steht dort, den Kragen hoch.",
        "Sie steigt ein und nennt ihn Herr Salih.",
        "Salih nennt sie Frau Hilde.",
        "Hinter ihr steigen noch drei Leute ein.",
        "Salih lenkt hinaus in die Dunkelheit.",
        "Im Kasten unter dem Lenkrad liegt ein leeres Heft.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────────
// n=22 - Eine Schleusenmeisterin, ein Techniker, der ihren Dienst wegmisst, und
// eine Nacht ohne Strom, in der beide dasselbe Tor kurbeln. Mit b und w kommen
// *aber, haben, Arbeit, Wasser, Wind, Wetter, wir, wie, wieder*; gesperrt
// bleiben z, v, p: kein *zu* (also keine um-zu-Fügung), kein *von/vor*, keine
// *Pumpe* und kein *Platz*. Der Schluss lässt offen, was im Bericht steht.
// ───────────────────────────────────────────────────────────────────────────────
const DIE_SCHLEUSE: Serie = {
  slug: "die-schleuse",
  titel: "Die Schleuse",
  kind: "geschichte",
  stufen: ["erwachsen"],
  minTier: 2,
  topic: "technik",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Ida ist Schleusenmeisterin an einem Kanal, der kaum noch bekannt ist.",
        "Die Schleuse ist alt, aus Stein, mit Toren aus Eiche.",
        "Sie hebt die Schiffe an und senkt sie wieder.",
        "Ida wohnt im Haus daneben, seit sie ein Kind war.",
        "Sie kennt den Kanal bei Wind, bei Hochwasser, bei Frost.",
        "Am Morgen kommen die Frachter, am Abend die Boote der Leute.",
        "Ida öffnet die Tore und macht sie wieder dicht.",
        "Das macht sie mit einer Kurbel, mit einer Kette, mit ihren Armen.",
        "Im Mai kommt ein Brief des Amtes.",
        "Die Schleuse bekommt einen Antrieb, elektrisch, aus der Ferne gesteuert.",
        "Ein Techniker soll messen, was dabei nötig ist.",
        "Am Ende des Briefes steht, dass Idas Dienst im Sommer endet.",
      ],
    },
    {
      lines: [
        "Nuri ist der Techniker.",
        "Er ist jung, er ist still, und er ist genau.",
        "Er misst die Tore, er misst die Kammer, er misst die Kette.",
        "Ida macht Tee und sagt wenig.",
        "Am Abend kommt Wind auf, und danach kommt Regen.",
        "Der Regen bleibt, die Nacht kommt, das Wasser steigt.",
        "Nach neun geht das Licht aus.",
        "In der Kammer liegt ein Frachter, halb gehoben, halb im Dunkeln.",
        "Die Tore stehen still, das Rad bewegt sich nicht.",
        "Nuri holt sein Handbuch heraus.",
        "Ida holt eine Kurbel aus einer Nische in der Wand.",
        "Die Kurbel ist so lang wie ein Arm und schwer wie ein Kind.",
      ],
    },
    {
      lines: [
        "Ida hakt die Kurbel in die Achse des Tores ein.",
        "Sie dreht, und nichts kommt in Gang.",
        "Nuri fasst mit an, und dann kommt das Tor langsam in Gang.",
        "Sie drehen und drehen, und der Regen rinnt in ihre Kragen.",
        "Der Steuermann des Frachters kommt herunter und dreht mit.",
        "Sie drehen sich in eine Ordnung hinein, ohne dass es einer sagt.",
        "Nach einer Stunde ist das erste Tor offen.",
        "Das Wasser der Kammer sinkt, langsam, dann schneller.",
        "Der Frachter sinkt mit dem Wasser, und die Kette wird locker.",
        "Dann kommt das andere Tor an die Reihe.",
        "Nuri hat Blasen an der Hand und sagt nichts.",
        "Um drei ist der Frachter im Kanal.",
      ],
    },
    {
      lines: [
        "Der Regen hört auf, als es hell wird.",
        "Der Steuermann hebt die Hand, dann treibt der Frachter nach Norden.",
        "Ida macht Tee, und dieses Mal sagt Nuri etwas.",
        "Er fragt, wie lange die Kurbel schon in der Nische liegt.",
        "Ida sagt, dass ihre Mutter sie dort eingehakt hat.",
        "Nuri notiert nichts.",
        "Am Mittag misst er weiter, und am Abend ist er fertig.",
        "Was in seinem Bericht steht, sagt er nicht, und Ida fragt nicht.",
        "Im Sommer kommt der Antrieb, und im Herbst endet Idas Dienst.",
        "Nuri baut den Antrieb ein, mit einem Rad und einem Motor.",
        "Die Nische in der Wand macht er nicht dicht.",
        "Darin liegt die Kurbel, geölt, an ihrem Haken.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────────
// n=22 - Eine Nachtbäckerin übernimmt einen Betrieb, den sonst niemand will.
// Kaufmännisches ist hier eine Rechen-Szene am Küchentisch (Regel 9), keine
// Zahlenreihe: es geht sich nicht aus, zweimal nicht. Ohne z fehlt sogar das
// *Salz*; der Teig traegt darum Mehl, Wasser und den Sauerteig. Der Kredit am
// Ende ist kleiner als der erbetene - das gehört dazu.
// ───────────────────────────────────────────────────────────────────────────────
const DIE_BACKSTUBE: Serie = {
  slug: "die-backstube",
  titel: "Die Backstube",
  kind: "geschichte",
  stufen: ["erwachsen"],
  minTier: 2,
  topic: "arbeit",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Fatima kommt um eins in die Backstube, wie seit elf Jahren.",
        "Die Stube ist dunkel, der Ofen ist kalt, das Mehl ist kalt.",
        "Sie macht Licht, dann holt sie den Sauerteig aus dem Kasten.",
        "Der Sauerteig ist alt, so alt wie kein Mensch in dieser Gasse.",
        "Herr Kandler sagt, sein Ahne hat ihn gemacht, damals nach dem Krieg.",
        "Fatima riecht daran, dann nickt sie.",
        "Sie nimmt Mehl, sie nimmt Wasser, sie knetet.",
        "Ihre Arme kennen den Teig, ihre Finger kennen die Menge.",
        "Um drei liegen die Laibe in den Körben.",
        "Um sechs ist die Kruste dunkel und die Stube riecht nach Brot.",
        "Um sieben kommt Herr Kandler herunter, langsam, an einem Stock.",
        "An diesem Morgen sagt er, dass im Herbst Ende ist.",
      ],
    },
    {
      lines: [
        "Herr Kandler ist alt, und niemand in seinem Haus will die Stube.",
        "Sein Sohn ist Techniker in einer anderen Stadt.",
        "Die Bank hat ihm schon lange nichts mehr geliehen.",
        "Er hat kein Geld mehr in dem Ofen, sagt er, und er lacht dabei nicht.",
        "Fatima steht an der Waage und sagt nichts.",
        "Sie kann die Stube, sie kann den Ofen, sie kann den Sauerteig.",
        "Aber sie hat kein Geld.",
        "Am Abend rechnet sie an ihrem Tisch.",
        "Mehl, Strom, Miete, die Rate der Bank, ihre Kinder.",
        "Es geht sich nicht aus.",
        "Sie rechnet noch einmal, und es geht sich wieder nicht aus.",
        "Dann legt sie den Stift hin und geht schlafen.",
      ],
    },
    {
      lines: [
        "Am Montag fragt eine Kundin, was mit der Stube geschieht.",
        "Fatima sagt es ihr, weil sie nicht anders kann.",
        "Am Dienstag fragen drei, am Donnerstag acht.",
        "Frau Reiter, die Wirtin am Eck, kommt herein und legt einen Brief hin.",
        "In dem Brief steht, dass sie ein Jahr lang Brot im Haus abnimmt.",
        "Der Fleischer nebenan macht es ihr nach.",
        "Das Heim an der Kirche macht es nach.",
        "Mit acht Briefen geht Fatima in die Bank.",
        "Der Mann in der Bank liest lange.",
        "Er sagt, dass Briefe kein Geld sind.",
        "Dann liest er noch einmal und holt einen anderen Mann.",
        "Nach elf Tagen kommt ein Kredit, kleiner als der, den sie wollte.",
      ],
    },
    {
      lines: [
        "Im Herbst ist der Betrieb ihrer.",
        "Herr Kandler kommt am ersten Morgen herunter und sieht nach dem Ofen.",
        "Er sagt nichts, er nickt nur, dann geht er wieder hinauf.",
        "Fatima holt den Sauerteig aus dem Kasten.",
        "Sie nimmt einen Teil heraus, dem Rest gibt sie Mehl und Wasser.",
        "Der Rest arbeitet weiter, wie er seit dem Krieg arbeitet.",
        "Um drei liegen elf Laibe in den Körben.",
        "Um sechs ist die Kruste dunkel.",
        "Um sieben steht die erste Kundin an der Scheibe.",
        "Fatima macht das Tor auf und sagt guten Morgen.",
        "Die Gasse riecht nach Brot.",
        "Hinter dem Ofen, im Kasten, arbeitet der Sauerteig weiter.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────────
// n=26 - Eine Nachtwache in einem Pflegeheim, ein neuer Dienstplan, eine Liste
// statt eines Vorwurfs. Der Ausgang ist halb: Die Antwort der Zentrale ist
// nicht das, was auf dem Blatt stand, und mehr als nichts. Der Schluss nennt
// die Moral NICHT, er zeigt nur den schiefen Plan an der Wand.
// ★ Terminologie: Person zuerst - »ein Mann mit Demenz«, nie umgekehrt
// ([[feedback_terminologie_sehen_blindheit]]).
// ───────────────────────────────────────────────────────────────────────────────
const DER_DIENSTPLAN: Serie = {
  slug: "der-dienstplan",
  titel: "Der Dienstplan",
  kind: "geschichte",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "arbeit",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Amira hat Nachtdienst, seit sieben Jahren, im Haus an der Lend.",
        "Das Haus hat vier Etagen, und in jeder wohnen Menschen, die Hilfe brauchen.",
        "Amira kennt jeden Namen, jeden Gang, jedes Geräusch.",
        "Sie kennt den Mann im Zimmer elf, der um drei wach wird.",
        "Sie kennt die Frau im Zimmer sieben, die singt, wenn sie Angst hat.",
        "Um zehn macht Amira die erste Runde.",
        "Um eins macht sie die andere.",
        "Dazwischen notiert sie in das Buch, was in der Nacht geschieht.",
        "Am Ersten hängt der neue Plan an der Wand im Flur.",
        "Amira liest ihn und liest ihn noch einmal.",
        "In der Nacht steht nun nur noch ein Name in jeder Etage.",
        "In ihrer Etage wohnen vierundzwanzig Menschen.",
      ],
    },
    {
      lines: [
        "Amira rechnet, wie sie immer rechnet: in Minuten.",
        "Ein Mensch, der aufstehen will, braucht zwei Hände.",
        "Ein Mensch, der gefallen ist, braucht drei.",
        "Vierundzwanzig Menschen und eine Nachtwache: Das geht sich nicht aus.",
        "Amira redet mit der Leitung.",
        "Die Leitung sagt, der Plan komme aus der Zentrale, und die rechne anders.",
        "Die Zentrale rechnet in Punkten, nicht in Minuten.",
        "Ein Mann mit Demenz, der nachts wach ist, hat in dieser Rechnung keinen Punkt.",
        "Amira geht heim und schläft schlecht.",
        "Am Abend darauf redet sie mit Jelena, die in der dritten Etage Dienst hat.",
        "Jelena redet mit Tarik, Tarik redet mit den anderen.",
        "Am Freitag liegt ein Blatt in der Kantine, und alle elf setzen ihren Namen darauf.",
      ],
    },
    {
      lines: [
        "Auf dem Blatt steht kein Vorwurf, sondern eine Liste.",
        "Jede Zeile nennt eine Nacht, eine Etage, eine Stunde, einen Vorgang.",
        "Der Mann im Zimmer elf steht in dreizehn Zeilen.",
        "Die Frau im Zimmer sieben steht in neun.",
        "Am Ende steht eine Frage: Wer geht in dieser Stunde in die andere Etage?",
        "Amira gibt das Blatt der Leitung und behält eine Kopie.",
        "Die Leitung liest es im Stehen und dann noch einmal am Tisch.",
        "Drei Wochen geschieht nichts.",
        "Dann kommt eine Antwort aus der Zentrale, drei Seiten lang.",
        "Zwei Seiten erklären, dass der Plan richtig ist.",
        "Auf der dritten steht, dass in der Nacht eine Person das Haus durchgeht.",
        "Eine Person, vier Etagen, eine Runde in der Nacht.",
      ],
    },
    {
      lines: [
        "Es ist nicht das, was auf dem Blatt stand.",
        "Es ist mehr als nichts.",
        "Amira hängt die Antwort neben den Plan an die Wand.",
        "In der ersten Nacht danach kommt Tarik um halb drei in ihre Etage.",
        "Er sagt nichts, er sieht nur nach, dann geht er weiter.",
        "Um drei wird der Mann im Zimmer elf wach.",
        "Er sucht seine Mutter, und seine Mutter ist lange tot.",
        "Amira sagt ihm nicht, dass sie tot ist.",
        "Sie setzt sich an das Bett und lässt ihn reden.",
        "Er redet von einem Hof, von einem Hund, von einem Weg im Schnee.",
        "Nach einer halben Stunde schläft er.",
        "Im Flur brennt das Notlicht, und der Plan an der Wand hängt schief.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────────
// n=26 - Ein Dorfchor ohne seinen Chorleiter. Vera hat vierzig Jahre im Alt
// gesungen und nie vorne gestanden. Keine Rührung im Schlusssatz: Konrad hebt
// die linke Hand und nickt einmal - dasselbe Nicken, das in der ersten Etappe
// als sein einziges Lob eingeführt ist.
// ───────────────────────────────────────────────────────────────────────────────
const DER_CHOR: Serie = {
  slug: "der-chor",
  titel: "Der Chor",
  kind: "geschichte",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Der Chor probt am Dienstag, im Saal des Wirtshauses, seit dreiundvierzig Jahren.",
        "Er hat siebzehn Stimmen, und die meisten sind alt.",
        "Konrad leitet ihn, seit er aus der Schule kam.",
        "Konrad ist streng, Konrad ist genau, Konrad hat nie gelobt.",
        "Wer bei ihm eine Stelle sauber singt, sieht nur, dass er kurz nickt.",
        "Im Winter fehlt Konrad an einem Dienstag.",
        "Am anderen Dienstag fehlt er wieder.",
        "Dann kommt die Nachricht: ein Schlaganfall, die rechte Seite, das Reden.",
        "Der Saal ist am dritten Dienstag voll und still.",
        "Niemand macht das Klavier auf.",
        "Alle warten, dass jemand etwas sagt.",
        "Am Ende kommt der Wirt herein und fragt, ob er das Licht abdrehen soll.",
      ],
    },
    {
      lines: [
        "Vera hat vierzig Jahre im Alt gesungen und nie vorne gestanden.",
        "Sie kann Noten, denn sie hat als Kind Klavier gelernt.",
        "Am vierten Dienstag steht sie auf und geht nach vorne.",
        "Sie sagt, sie halte die Proben, bis Konrad wieder kommt.",
        "Niemand widerspricht, und niemand ist froh.",
        "Vera schlägt den ersten Ton an, und der Chor singt zu tief.",
        "Sie schlägt ihn noch einmal an, und er singt wieder zu tief.",
        "Konrad hätte an dieser Stelle geklopft und gewartet.",
        "Vera klopft nicht, sondern singt die Stelle allein vor.",
        "Dann singt der Alt sie, dann der Tenor.",
        "Es dauert die halbe Probe, und am Ende sitzt der Ton.",
        "Vera geht heim und weint im Auto, und am Dienstag darauf ist sie wieder da.",
      ],
    },
    {
      lines: [
        "Im Mai ist das Konzert in der Kirche, wie in jedem Jahr.",
        "Auf dem Blatt steht Konrads Name, denn es ist im Winter gedruckt worden.",
        "Vera lässt das Blatt, wie es ist.",
        "Sie probt die schweren Stellen und lässt die leichten liegen.",
        "Der Bass verliert im dritten Lied immer den Einsatz.",
        "Vera nimmt den Bass allein, an einem Donnerstag, im Saal.",
        "Sie zählt nicht, sondern lässt die Leute atmen.",
        "Am Ende kommt der Einsatz, und keiner kann sagen, warum.",
        "Eine Woche davor kommt Konrad aus der Klinik.",
        "Er sitzt im Rollstuhl und redet in kurzen Teilen.",
        "Er fragt nach dem dritten Lied.",
        "Vera sagt, der Bass sitze, und Konrad nickt kurz.",
      ],
    },
    {
      lines: [
        "Am Abend des Konzerts ist die Kirche kalt und voll.",
        "Konrad sitzt hinten, an der Seite, neben dem Ofen.",
        "Vera stellt sich vor den Chor und sieht nicht hinten hin.",
        "Das erste Lied ist alt und leicht.",
        "Das dritte ist das schwere.",
        "Der Bass kommt, und er kommt genau.",
        "Im Saal hustet niemand.",
        "Nach dem letzten Ton bleibt es lange still.",
        "Dann klatschen die Leute, und Vera dreht sich nicht um.",
        "Sie sieht auf die Noten und macht das Heft zu.",
        "Hinten, neben dem Ofen, hebt Konrad die linke Hand.",
        "Er nickt, einmal, kurz.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────────
// n=26 - Die einzige WISSENS-Serie dieser Charge, und die einzige, die `teens`
// mitträgt: Faserkunde hat keinen Erwachsenen-Stoff. Aufbau wie im Bestand -
// ein Kreislauf (Faser -> Filz -> Vlies -> Garn), Größenordnungen und eine
// Grenze statt einer Aufzählung.
//
// FAKTEN, jeder an ZWEI unabhängigen Stellen gegengeprüft (abgerufen
// 2026-08-22):
//  • Keratin, Kräuselung als Luftfalle, dachziegelartige Schuppen, Aufnahme
//    von Feuchtigkeit ohne Nässegefühl, schwere Entflammbarkeit ("Wolle
//    brennt nicht, sondern verkohlt nur"), Elastizität:
//    de.wikipedia.org/wiki/Wolle  UND  IWTO Wool Notes / British Wool
//    ("The structure of wool fibres").
//  • Filzen durch Wärme, Feuchtigkeit und Bewegung, irreversibel, Walken,
//    Verwendung für Mäntel, Decken und Jurten, Mottenfrass:
//    de.wikipedia.org/wiki/Filz  UND  British Wool (dieselbe Faserkunde).
//  • Wollwachs/Lanolin aus der Rohwolle, beim Waschen gewonnen, in Salben und
//    Cremes: de.wikipedia.org/wiki/Wollwachs  UND  IWTO Wool Notes.
//  • Schur meist einmal im Jahr, im Mai oder Juni: Landwirtschaftskammer
//    Niedersachsen (Grundlagen der Schafschur) UND schafe-halten.de /
//    agrarheute (Schur nach den Eisheiligen, mindestens einmal jährlich).
// BEWUSST OHNE ZAHL geschrieben: Die belegte Marke "bis zu dreiunddreissig
// Prozent des Trockengewichts" trägt ein ß und wäre unterhalb von n=31 gar
// nicht schreibbar; die Aussage steht darum qualitativ ("reichlich Wasser,
// ohne dass man es an ihr merkt").
// ───────────────────────────────────────────────────────────────────────────────
const DIE_WOLLE: Serie = {
  slug: "die-wolle",
  titel: "Die Wolle",
  kind: "wissen-serie",
  stufen: ["teens", "erwachsen"],
  minTier: 3,
  topic: "natur",
  herkunft: {
    quelle:
      "Eigene Verdichtung nach Wikipedia (Wolle, Filz, Wollwachs) und der Faserkunde von IWTO / British Wool",
    lizenz: "CC-BY-SA 4.0 (Ableitung; Danksagungs-Bereich)",
    autor:
      "Sensorik-Lernplattform; Grundlagen: Wikipedia-Autorinnen und -Autoren, International Wool Textile Organisation, British Wool",
    fundstelle:
      "https://de.wikipedia.org/wiki/Wolle und https://de.wikipedia.org/wiki/Filz und https://de.wikipedia.org/wiki/Wollwachs und https://shop.britishwool.org.uk/the-structure-of-wool/ und https://iwto.org/wp-content/uploads/2024/06/IWTO-Wool-Notes-2024.pdf und https://www.lwk-niedersachsen.de/lwk/news/28489_Demonstrationsvideos_Grundlagen_der_Schafschur (alle abgerufen 2026-08-22)",
  },
  etappen: [
    {
      lines: [
        "Wolle ist das Haar von Schafen.",
        "Ein Wollhaar ist aus Keratin, demselben Stoff, aus dem Nagel und Horn sind.",
        "Es ist ein Haar und doch anders als das Haar eines Menschen.",
        "Die Faser ist nicht gerade, sondern gekräuselt.",
        "Diese Kräuselung ist der Grund, warum Wolle wärmt.",
        "Denn zwischen den Kräuseln bleibt Luft stehen.",
        "Luft leitet Wärme schlecht und hält sie darum am Körper.",
        "Nicht die Wolle wärmt, sondern die Luft, die sie festhält.",
        "Die Oberfläche eines Wollhaares ist nicht glatt.",
        "Sie trägt Schuppen, die wie Dachziegel aufeinander liegen.",
        "Diese Schuppen sind winzig, und mit dem Auge sieht man sie nicht.",
        "Sie entscheiden, was mit der Wolle geschieht.",
      ],
    },
    {
      lines: [
        "Wird Wolle warm, nass und dabei bewegt, so verhaken sich die Schuppen.",
        "Die Fasern schieben sich ineinander und kommen nicht mehr los.",
        "Das ist Filz.",
        "Filz lässt sich nicht wieder in Fasern trennen.",
        "Darum wird ein Wollpullover in sehr warmem Wasser klein und hart.",
        "Wer das absichtlich macht, walkt die Wolle.",
        "Gewalkte Wolle ist dicht, sie hält Wind ab und nimmt kaum Wasser an.",
        "Aus ihr sind Mäntel, Decken und Pantoffeln.",
        "Auch der Filz einer Jurte in der Steppe ist gewalkte Wolle.",
        "Ohne Walken bleibt die Wolle weich und locker.",
        "Beides ist alt, und beides ist nur eine Frage von Wärme, Wasser und Bewegung.",
        "Die Schuppen entscheiden, nicht das Schaf.",
      ],
    },
    {
      lines: [
        "Geschoren wird meist einmal im Jahr, im Mai oder im Juni.",
        "Das Fell kommt in einem Teil vom Tier, und man nennt es Vlies.",
        "Im Vlies sind Fett, Staub und Sand.",
        "Das Fett ist das Wollwachs, und man nennt es auch Lanolin.",
        "Es wird ausgewaschen und kommt in Salben und in Creme.",
        "Die reine Wolle wird gekämmt, bis alle Fasern in eine Richtung liegen.",
        "Aus dem gekämmten Band wird beim Spinnen ein Faden.",
        "Beim Spinnen werden die Fasern gedreht.",
        "Die Drehung ist alles: Sie hält die Fasern aneinander.",
        "Ohne Drehung ist ein Faden kein Faden, sondern eine Reihe loser Haare.",
        "Wer eine Spindel dreht, macht dasselbe wie eine Maschine, nur langsamer.",
        "Aus dem Faden wird ein Garn, aus dem Garn ein Tuch.",
      ],
    },
    {
      lines: [
        "Wolle nimmt reichlich Wasser auf, ohne dass man es an ihr merkt.",
        "Das Wasser sitzt im Inneren der Faser, die Oberfläche bleibt trocken.",
        "Darum ist ein Wollmantel im Regen lange noch warm.",
        "Wolle brennt schlecht und verkohlt eher, als dass sie eine Flamme trägt.",
        "Sie riecht dabei nach verbranntem Haar, denn sie ist Haar.",
        "Wolle ist federnd, denn das Keratin liegt in ihr gedreht wie eine Feder.",
        "Darum kommt ein Wollstoff nach dem Tragen wieder in seine Form.",
        "Ihre Grenzen sind klar: Sie walkt, sie trocknet langsam, und Motten essen sie.",
        "Feine Wolle kommt oft von Merinoschafen.",
        "Je feiner die Faser, desto weicher liegt sie am Hals.",
        "Kratzt Wolle, so ist die Faser dick, nicht schlecht.",
        "Das Schaf steht im Regen und friert nicht, und daran hat sich nichts geändert.",
      ],
    },
  ],
};

/** Charge E2-DE, Wellen 1 bis 3 (append-only an SERIEN gehängt). */
export const SERIEN_ERWACHSEN_RUNDE2: readonly Serie[] = [
  DER_KAI,
  DIE_ERNTE,
  DER_NOTRUF,
  DIE_TRUHE,
  DIE_TURMUHR,
  DIE_HALTESTELLE,
  DIE_SCHLEUSE,
  DIE_BACKSTUBE,
  DER_DIENSTPLAN,
  DER_CHOR,
  DIE_WOLLE,
];
