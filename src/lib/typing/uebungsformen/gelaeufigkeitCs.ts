/**
 * ★ F6-cs (03.10.2026): die häufigen Buchstabenverbindungen des Tschechischen für das Geläufigkeitsschreiben (`gelaeufigkeit.ts`) -
 * neu gewählt, nicht übertragen. Bis hierher stand für `cs` das ENGLISCHE `VERBINDUNGEN_EN` (RÜCKFALL-EN, G2a): jede adaptive Runde
 * („Mein Training") hängt eine Geläufigkeits-Zeile an, ein Kind auf Weg „cs" hätte darin „education station action nation" geschrieben.
 *
 * Gewählt nach dem, was das Tschechische über seine Schreibung ausmacht und was Zehnfingerschreiben automatisiert:
 *  · die Mitlautgruppen am Wortanfang (*př tř kř dř sk st sp zv vz kd mn*: příběh, třída, křeslo, skok, strom, zvíře, vzít, kdo, mnoho) -
 *    dieselbe Fingerfolge mehrmals kurz hintereinander, und die Gruppen mit `ř` stehen auf der Zahlenreihe;
 *  · `ch` (ein Buchstabe der Schule, zwei Tasten: chleba, kuchyně) und `ou`/`au` (dlouhý, louka, auto);
 *  · die Verbindungen mit `ě` (*dě tě ně mě vě bě pě*: děti, tělo, někdo, město, věc, běh, pět) - `ě` steht nur hinter diesen Mitlauten -
 *    und mit `ř`/`ž`/`š`/`č` (*ře že ži šk čt*: řeka, žena, život, škola, čtyři);
 *  · die häufigen Endungen (*-ý -ost -ek -ka -ice -ní -ů -ovat -it*: velký, radost, dárek, matka, silnice, učení, domů, pracovat, mluvit) und
 *    die Vorsilbe *nej-* (nejlepší).
 *
 * Alle Wörter klein (tschechische Nomen werden nicht grossgeschrieben), echte Alltagswörter, jedes kommt in den Tatoeba-Sätzen vor
 * (bis auf wenige Alltagswörter: chodba, technika, křída, skříňka, louka, aula, mladost, domek, stolů, bodů, žehlička, škrabat, škrob,
 * bydlit - von Hand gelesen) und steht nicht auf der Sperrliste (`sperrlisteCs.ts`). `gelaeufigkeit.ts` prüft mit dem Weg (`fitText`)
 * und lässt ein Wort erst durch, wenn jede Einheit gelernt ist (`ě` ab Nr. 16, `ř` ab 29, `ž` ab 27 …) - nie vorher und nie ohne
 * Diakritik. Wächter: `tests/tastenflow-cs-woerter.test.ts`.
 */
import type { Verbindung } from "./gelaeufigkeit";

export const VERBINDUNGEN_CS: Verbindung[] = [
  { folge: "ch", stelle: "anfang", woerter: ["chleba", "chata", "chodit", "chvíle", "chuť", "chyba", "chytit", "chodba", "chovat", "chladný", "chtít", "chlapec"] },
  { folge: "ch", stelle: "mitte", woerter: ["kuchyně", "střecha", "strach", "ucho", "prach", "tichý", "sucho", "ticho", "mnich", "technika"] },
  { folge: "př", stelle: "anfang", woerter: ["příběh", "před", "přes", "příliš", "přítel", "příroda", "přání", "připravit", "přijít", "přesně", "příklad", "přeložit"] },
  { folge: "tř", stelle: "anfang", woerter: ["třída", "tři", "třeba", "třicet", "třešeň", "třetí", "třináct", "třikrát"] },
  { folge: "kř", stelle: "anfang", woerter: ["křik", "křeslo", "kříž", "křída", "křivý", "křoví", "křižovatka", "křehký"] },
  { folge: "dř", stelle: "anfang", woerter: ["dřevo", "dříve", "dřevěný", "dřina", "dřez", "dřevorubec"] },
  { folge: "sk", stelle: "anfang", woerter: ["skok", "skála", "skříň", "sklo", "skoro", "skříňka", "skupina", "skutečně"] },
  { folge: "st", stelle: "anfang", woerter: ["stůl", "strom", "stát", "stejný", "stanice", "starý", "stavba", "stolek"] },
  { folge: "sp", stelle: "anfang", woerter: ["spát", "spolu", "spoustu", "správně", "spokojený", "spěchat", "spojit"] },
  { folge: "zv", stelle: "anfang", woerter: ["zvíře", "zvuk", "zvon", "zvonek", "zvědavý", "zvyk", "zvedat", "zvýšit"] },
  { folge: "vz", stelle: "anfang", woerter: ["vzít", "vzduch", "vzdálený", "vzpomínka", "vzor", "vzdát"] },
  { folge: "kd", stelle: "anfang", woerter: ["kdo", "kdy", "kde", "kdyby", "kdysi", "kdokoliv"] },
  { folge: "mn", stelle: "anfang", woerter: ["mnoho", "mnou", "mně", "mnohem", "mnozí", "množství", "mnohokrát"] },
  { folge: "ou", stelle: "mitte", woerter: ["dlouhý", "kouzlo", "louka", "mouka", "houba", "soused", "koupit", "poušť"] },
  { folge: "au", stelle: "anfang", woerter: ["auto", "autobus", "aula", "autor", "autem", "autíčko"] },
  { folge: "nej", stelle: "anfang", woerter: ["nejlepší", "nejvíc", "nejen", "nejdřív", "nejlépe", "nejstarší", "nejmladší", "nejvyšší"] },
  { folge: "ý", stelle: "ende", woerter: ["velký", "malý", "nový", "starý", "krásný", "dobrý", "hezký", "rychlý"] },
  { folge: "ost", stelle: "ende", woerter: ["radost", "rychlost", "možnost", "mladost", "starost", "povinnost", "příležitost", "vzdálenost"] },
  { folge: "ek", stelle: "ende", woerter: ["dárek", "domek", "stromek", "zvonek", "svátek", "stolek"] },
  { folge: "ka", stelle: "ende", woerter: ["matka", "tužka", "kočka", "pohádka", "maminka", "babička", "holka", "taška"] },
  { folge: "ice", stelle: "ende", woerter: ["silnice", "vesnice", "ulice", "učebnice", "nemocnice", "pokladnice"] },
  { folge: "ní", stelle: "ende", woerter: ["učení", "cvičení", "psaní", "čtení", "bydlení", "vaření", "plavání"] },
  { folge: "ů", stelle: "ende", woerter: ["domů", "dolů", "stolů", "dnů", "kusů", "vlaků", "bodů"] },
  { folge: "dě", stelle: "mitte", woerter: ["děti", "dělat", "děkuji", "děda", "dědeček", "dětství"] },
  { folge: "tě", stelle: "mitte", woerter: ["tělo", "těšit", "těsto", "těžký", "těsný", "tělocvik"] },
  { folge: "ně", stelle: "mitte", woerter: ["někdo", "něco", "několik", "někde", "někdy", "nějak"] },
  { folge: "mě", stelle: "mitte", woerter: ["město", "měsíc", "měřit", "měkký", "měnit", "měl"] },
  { folge: "vě", stelle: "mitte", woerter: ["věc", "věta", "věřit", "věda", "věž", "vědět"] },
  { folge: "bě", stelle: "mitte", woerter: ["běh", "běžet", "běžný", "oběd", "během", "běhat"] },
  { folge: "pě", stelle: "mitte", woerter: ["pět", "pěkný", "pěna", "pěšky", "pěstovat", "zpěv"] },
  { folge: "ře", stelle: "mitte", woerter: ["řeka", "řekl", "řešit", "řezat", "řemeslo", "řetěz", "řeč"] },
  { folge: "že", stelle: "mitte", woerter: ["že", "žena", "žebřík", "železo", "žehlička", "ženy"] },
  { folge: "ži", stelle: "mitte", woerter: ["život", "živý", "žirafa", "živočich", "žije", "žijeme", "žijí"] },
  { folge: "šk", stelle: "mitte", woerter: ["škola", "školka", "škoda", "škrabat", "škrob", "školní"] },
  { folge: "čt", stelle: "mitte", woerter: ["čtyři", "čtvrtek", "čtení", "čtvrt", "čtvrtý", "čtverec", "čtyřicet"] },
  { folge: "ovat", stelle: "ende", woerter: ["pracovat", "cestovat", "tancovat", "studovat", "plánovat", "kupovat"] },
  { folge: "it", stelle: "ende", woerter: ["mluvit", "koupit", "vařit", "bydlit", "chodit", "nosit", "učit"] },
];
