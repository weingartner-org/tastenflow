// Texte der Lehrkraft-Tabelle auf Rumänisch (O4, 30.10.2026). Form: kettenNeun.ts.
import type { KettenTexte } from "./kettenNeun";

export const KETTEN_RO: KettenTexte = {
  was: { treffer: "Precizia", score: "Scorul", tempo: "Viteza" },
  // one (1) · few (0, 2-19, Bruchzahlen) · other (20+ ganze Zahlen, mit „de").
  einheit: (g, n) => {
    const k = n === 1 ? 0 : Number.isInteger(n) && n !== 0 && (n % 100 === 0 || n % 100 >= 20) ? 2 : 1;
    return g === "treffer"
      ? ["punct procentual", "puncte procentuale", "de puncte procentuale"][k]
      : g === "score"
        ? ["punct", "puncte", "de puncte"][k]
        : ["caracter pe minut", "caractere pe minut", "de caractere pe minut"][k];
  },
  satzGleich: (was, zahl, name) => `${was} a rămas aproximativ la fel față de ${name} (diferență: ${zahl}).`,
  satzHoch: (was, zahl, name) => `${was} este cu ${zahl} peste nivelul din ${name}.`,
  satzNiedrig: (was, zahl, name) => `${was} este cu ${zahl} sub nivelul din ${name}.`,
  ohneVergleichGesamt: "„De la început” nu are o perioadă anterioară - aici nu este nimic de comparat.",
  ohneVergleich: (name) => `Nu s-a exersat în ${name} - nu este nimic de comparat.`,
  grundKeineWoche: (m) => `În această perioadă nu există încă nicio săptămână de exersare cu numărul minim de rânduri (${m}) - nu este nimic de comparat.`,
  grundEineWoche: (m) => `Până acum există o singură săptămână de exersare cu numărul minim de rânduri (${m}) - pentru o schimbare sunt necesare două.`,
  grundKurzKeine: "încă nicio săptămână de exersare",
  grundKurzEine: "o singură săptămână de exersare",
  spalteScore: (m) => `Dacă numărul de caractere scrise în perioadă este sub ${m}, apare o liniuță în loc de scor: sub această limită o singură tastă greșită ar decide mai multe puncte, iar asta ar fi zgomot, nu un rezultat.`,
  spalteTreffer: "Ponderea caracterelor scrise corect. Este cel mai important dintre cele două numere: cine scrie precis devine singur mai rapid - invers se întâmplă aproape niciodată.",
  spalteTempo: "Caractere pe minut - viteza. La elevii cu „În ritmul tău” numărul este afișat, dar nu contează nicăieri în aplicație.",
  hilfeLangScore: "Aici sunt DOUĂ numere, separate printr-o linie verticală: mai întâi scorul pe toată perioada, apoi schimbarea în cadrul ei - de la prima până la ultima săptămână de exersare. „72 | +6” înseamnă deci: în medie 72 de puncte și cu 6 puncte mai mult decât la început.",
  hilfeLangTreffer: "Aici sunt DOUĂ numere, separate printr-o linie verticală: mai întâi precizia pe toată perioada, apoi schimbarea în cadrul ei - de la prima până la ultima săptămână de exersare. „92 % | +3 %” înseamnă deci: în medie 92 la sută și cu 3 puncte procentuale mai mult decât la început. Dacă acolo nu apare nimic, nu au existat încă două săptămâni cu suficiente rânduri pentru comparare.",
  hilfeLangTempo: "Aici sunt DOUĂ numere, separate printr-o linie verticală: mai întâi viteza pe toată perioada, apoi schimbarea în cadrul ei - de la prima până la ultima săptămână de exersare. „185 | +7” înseamnă deci: în medie 185 de caractere pe minut și cu 7 mai mult decât la început.",
  hilfeKurzScore: "Săgeata de lângă număr compară cu perioada dinainte: oblic în sus înseamnă mai mult, orizontal înseamnă la fel, oblic în jos înseamnă mai puțin. Nu este o judecată - textele mai grele coboară scorul, iar asta înseamnă învățare.",
  hilfeKurzTreffer: "Săgeata de lângă număr compară cu perioada dinainte: oblic în sus înseamnă mai precis, orizontal înseamnă la fel, oblic în jos înseamnă mai puțin precis. Nu este o judecată - textele mai grele fac scrierea mai puțin precisă, iar asta înseamnă învățare.",
  hilfeKurzTempo: "Săgeata de lângă număr compară cu perioada dinainte: oblic în sus înseamnă mai rapid, orizontal înseamnă la fel, oblic în jos înseamnă mai lent.",
  zeitraum: {
    gesamt: "De la început",
    schuljahr: (label) => `An școlar ${label}`,
    monat: { dieser: "Luna aceasta", voriger: "Luna trecută", naechster: "Luna viitoare", sonst: "Luna" },
    woche: { diese: "Săptămâna aceasta", vorige: "Săptămâna trecută", naechste: "Săptămâna viitoare", sonst: "Săptămâna" },
    mitSpanne: (wort, von, bis) => `${wort}, ${von} - ${bis}`,
    tag: (tag, monat) => `${tag} ${monat}`,
    kompaktGleich: (von, bis, monat) => `${von}-${bis} ${monat}`,
    kompaktUeber: (von, mVon, bis, mBis) => `${von} ${mVon}-${bis} ${mBis}`,
  },
  vergleich: { schuljahr: "anul școlar", monat: "cele 4 săptămâni dinainte", woche: "săptămâna dinainte" },
  wocheLabel: (nr, tag) => `Săptămâna ${nr} (${tag})`,
  scoreKind: "Scorul îmbină precizia și viteza într-un singur număr de la 0 la 100; o tastă greșită cântărește cât 5 caractere, iar viteza dublă contează doar de 1,4 ori - precizia contează mai mult decât viteza.",
  scoreLehrkraft: "Scorul îmbină precizia și viteza elevului într-un singur număr de la 0 la 100; o tastă greșită cântărește cât 5 caractere, iar viteza dublă contează doar de 1,4 ori - precizia contează mai mult decât viteza.",
  klasseWort: "clasa",
  klasseBezeichnung: (name) => (name ? `Clasa ${name}` : "Clasa"),
  eigeneNichtZugewiesen: "fără atribuire",
  eigeneEine: (d) => `atribuire: ${d}`,
  eigeneMehrere: (n) => `atribuiri: ${n}, în ordine`,
  wochenziel: {
    spalteErscheint: " Această coloană apare doar cât timp cel puțin o persoană din clasă are un obiectiv săptămânal.",
    haekchen: " Bifa apare imediat ce obiectivul a fost atins în întregime.",
    nichtGezaehlt: " Săptămânile care nu sunt săptămâni cu obiectiv, sau care au fost scutite ori resetate, nu se numără.",
    imZeitraum: (wo) => `Ponderea minutelor stabilite care au fost efectiv făcute, pe toate săptămânile cu obiectiv ÎNCHEIATE (${wo}) - săptămâna în curs nu contează încă, iar o săptămână care încă durează nu este „ratată”. După aceea: în câte dintre aceste săptămâni obiectivul a fost atins în întregime.`,
    woGesamt: "de la crearea acestui cont",
    woSchuljahr: "din acest an școlar",
    woMonat: "din ultimele 4 săptămâni",
    laufend: "Minutele exersate din minutele stabilite pentru această săptămână - starea de acum. Dacă „Recuperați minutele din săptămânile trecute” este pornit, minutele încă deschise din săptămânile de dinainte apar ca un număr separat.",
    andere: "Minutele atinse din minutele stabilite pentru săptămâna afișată mai sus - după recuperare, dacă este pornită. O săptămână care nu este săptămână cu obiectiv, sau care a fost scutită ori resetată, arată o liniuță.",
  },
};
