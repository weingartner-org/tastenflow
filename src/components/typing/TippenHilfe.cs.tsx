/**
 * ★★★ O-CS (03.10.2026): DAS HILFE-FENSTER FÜR DIE LERNENDEN, TSCHECHISCH.
 * ===========================================================================
 * Aus der Funktion geschrieben, nach dem Aufbau von `TippenHilfe.pl.tsx` und
 * `TippenHilfe.tr.tsx` (dieselben Abschnitte, `detail`-Stufen,
 * `isAdult`/`jugend`-Fälle), den Inhalt nach der deutschen
 * `TippenHilfeDeutsch` - nicht Satz für Satz übertragen. Wie die anderen
 * Übersetzungen ohne den Einführungs-Podcast (die tschechische Bedienung hat
 * keinen).
 *
 * ── ANREDE UND GESCHLECHT (Glossar `recherche-tschechisch-2026-10-02/GLOSSAR-cs.md`) ──
 * Immer **ty** - Kinder, Jugendliche UND Selbstlernende (Regel 1). Nie das
 * Geschlecht verraten (Regel 2): keine Vergangenheit in der 2. Person, kein
 * „sám/sama", kein hartes Adjektiv über das Kind - Präsens, Futur, „se"-Sätze,
 * Sätze über die Sache. Die Lehrkraft heisst „vyučující", nur im Nominativ
 * (Einzahl mit Präsens) oder in der Mehrzahl. Knopfnamen ohne Anführung mit
 * „tlačítko" davor; Tastennamen wie auf der Kappe, gebeugt nur mit „klávesa"
 * davor (Regel 11). Ausrufezeichen nur in Sätzen, die allein Kinder sehen
 * (`kind`), höchstens eines je Absatz - ausgenommen wörtlich zitierte
 * Knopfnamen („Jdu do toho!").
 *
 * ── WAS TSCHECHISCH ANDERS IST ─────────────────────────────────────────────
 *  · Die Tastatur: Česká (QWERTZ) und Česká (QWERTY) (`layouts.ts`, `cs`,
 *    `cs-qwerty`, nur gelesen). Die Ziffernreihe trägt ě š č ř ž ý á í é,
 *    Ziffern kommen mit Shift - und Shift auf diesen Tasten gibt nie den
 *    Grossbuchstaben (§4 Falle 1). Totaste rechts neben `=`: Čárka nad
 *    písmenem ´, mit Shift Háček ˇ; ď ť ň über Háček, ó über Čárka. ú und ů
 *    haben eigene Tasten, das grosse Ů gibt es nur mit Caps Lock.
 *  · Die Reihenfolge des Weges „cs" ist gemessen (`lernweg.ts`, F4-cs): die
 *    Hilfe zeigt die Buchstaben des Weges, auf dem das Kind wirklich übt
 *    (`layoutLetterOrder`), und nennt nur die Grobfolge - kein Absatz über
 *    die deutschen Lektionen.
 *  · Das Plakat gibt es auf Tschechisch noch nicht - der Abschnitt bietet das
 *    englische an (`handbuchInSprache`, „v angličtině").
 *  · Die Zeile unter dem Übungsfeld heisst „lišta" (nicht „řádek" - das ist
 *    die Übungszeile), der Ring „kruh", das Feld „pole pro psaní".
 *  · Keine Zahl mit Punkt am Satzende (§4 Falle 4), keine feste Präposition
 *    vor einer Zahl (Regel 13: „25/60 min").
 *
 * Fliesstext mit tschechischer Anführung (U+201E/U+201C), nur Bindestrich, keine Maus-Wörter.
 */
import { JawsRueckweg } from "./ScreenreaderHinweis";
import { useRef } from "react";
import { EINSTIEGSFENSTER_MIN, layoutLetterOrder, skinForStufe, unitGlyph } from "@/lib/typing";
import { mehrzahl } from "@/lib/bedienSprache";
import { useFocusTrap } from "./useFocusTrap";
import { Zeichenerklaerung } from "@/lib/arbeitsblatt/Zeichenerklaerung";
import { AltText, Kbd, Section, detailFor, type TippenHilfeProps } from "./TippenHilfeTeile";
import { AltOderWahl, WeitereTasten } from "./TippenHilfeTasten";
import { RundgangNochmalKnopf } from "./Rundgang";
import { hoehleHatWesen } from "@/lib/typing/expedition/texts";
import { downloadAdresse, groesse, handbuchInSprache, tastenflowPlakat } from "@/lib/lernwerkstatt/handbuecher";

// ★ O-CS (03.10.2026): das Wort der Tippchallenge (Glossar §2.3) - wie
// `WYZWANIE` in der polnischen Hilfe. Steht hier, solange `schreibprobe.ts`
// kein `PRUEFUNG_WORT_CS` hat; danach von dort holen. Im Fliesstext stehen
// die gebeugten Formen (Výzvu, Výzvy) ausgeschrieben.
const VYZVA = "Výzva";
const VYZVY = "Výzvy";

export function TippenHilfeTschechisch({ open, onClose, stufe, lernweg = "cs" }: TippenHilfeProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  useFocusTrap(open, cardRef, { initialFocus: closeRef });
  if (!open) return null;

  const skin = skinForStufe(stufe);
  const isAdult = skin === "erwachsen";
  const kind = skin === "kind";
  const detail = detailFor(stufe);
  const letters = layoutLetterOrder(lernweg);
  // Das Höhlenwesen (deutsche Aufnahmen) gibt es nur auf Weg „de".
  const hoehleMitWesen = hoehleHatWesen(lernweg);
  // Dasselbe Wort wie der Ring (Glossar §2.2: „úroveň hry" / „úroveň"),
  // Nominativ = Akkusativ; dazu der Lokativ für „na které úrovni jsi".
  const ringWort = kind ? "úroveň hry" : "úroveň";
  const ringWortLokal = kind ? "úrovni hry" : "úrovni";
  // Akkusativ („máš 10 minut"), alle vier Formen (Glossar §2.11).
  const einstiegsMinuten = mehrzahl(EINSTIEGSFENSTER_MIN, "cs", {
    one: (z) => `${z} minutu`,
    few: (z) => `${z} minuty`,
    many: (z) => `${z} minuty`,
    other: (z) => `${z} minut`,
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Nápověda k aplikaci Tastenflow"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        className="card my-8 w-full max-w-2xl space-y-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="m-0 text-xl font-semibold text-ink">Nápověda - jak funguje aplikace Tastenflow</h2>
          <button
            ref={closeRef}
            type="button"
            className="btn-secondary btn-toggle"
            onClick={onClose}
            aria-label="Zavřít nápovědu"
          >
            ✕ Zavřít
          </button>
        </div>

        <RundgangNochmalKnopf onStart={onClose} />

        <Section title="Prostě začni psát">
          <p className="m-0">
            Pole pro psaní nemusíš nejdřív vybírat. Prostě začni psát - první písmeno
            se hned objeví v poli. Když je kurzor jinde, stiskni <Kbd>Alt</Kbd> +{" "}
            <Kbd>E</Kbd> a jsi hned zpátky v poli pro psaní.
          </p>
          <JawsRueckweg weg="cs" />
          {detail === 1 && (
            <p className="m-0">
              Piš vždycky správným prstem - klávesnice dole ti ukáže, která klávesa
              přijde teď. Když dvakrát rychle stiskneš klávesu <Kbd>Shift</Kbd>,
              uslyšíš, kterým prstem psát.
            </p>
          )}
        </Section>

        <Section title="Tyhle značky jsou v textu">
          <Zeichenerklaerung
            titel={null}
            zeichen={[
              { zeichen: "·", bedeutung: "odděluje dva údaje, které patří k sobě - podobně jako čárka ve větě." },
              { zeichen: "→", bedeutung: "potom, nebo: z toho vznikne tohle." },
              { zeichen: "⏱", bedeutung: "tvůj čas procvičování." },
              {
                zeichen: "↵",
                bedeutung:
                  "stojí na konci řádku, když to má tvoje třída nastavené - pak řádek ukončíš klávesou Enter.",
              },
            ]}
          />
        </Section>

        <Section title="Sbírej hvězdičky 🌟">
          <p className="m-0">
            Po každém kole dostaneš <strong>1 až 3 hvězdičky</strong> - a k tomu
            vlastní zvuk.{" "}
            <strong>Málo chyb je mnohem důležitější než rychlost:</strong> klidné a
            přesné psaní přinese jisté hvězdičky - spěch a časté překlepy ne.
            {kind ? " Hvězdičky může získat každé dítě!" : ""}
          </p>
          {detail >= 2 && (
            <p className="m-0">
              3 hvězdičky jsou za opravdu dobré kolo - přesně napsané a ve slušné
              rychlosti, přičemž <strong>přesnost</strong> je vždycky důležitější než{" "}
              <strong>rychlost</strong>. Když se ti nějakou dobu daří dobrá kola,
              posuneš se o <strong>úroveň obtížnosti</strong> výš - pak odměna zní
              ještě trochu jinak.
            </p>
          )}
        </Section>

        <Section title="Sbírej odznaky 🏅">
          <p className="m-0">
            Za zvláštní úspěchy získáváš <strong>odznaky</strong> - třeba za kolo
            úplně bez chyb nebo za tři čistá kola za sebou. U nového odznaku zazní
            vlastní <strong>„ta-dá“</strong> a ozve se jeho název.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Všechny odznaky najdeš v části <strong>„Můj pokrok“</strong>, hned za
              týdenními cíli a tvými hodnotami - tam je vždycky vidět i{" "}
              <strong>další meta</strong> (třeba: ještě 2 kola bez chyb do dalšího
              odznaku). Nejvíc odznaků je za <strong>přesné psaní</strong> a za{" "}
              <strong>vytrvalost</strong> - ne za spěch. A několik jich je{" "}
              <strong>tajných</strong>: jejich podmínka není nikde napsaná, prostě se
              jednou objeví.
            </p>
          )}
          {detail >= 2 && (
            <p className="m-0">
              Tam je i tvoje <strong>skóre</strong>: spojuje přesnost a rychlost do
              jednoho čísla mezi 0 a 100 - jeden překlep se počítá jako 5 znaků,
              dvakrát vyšší rychlost jen 1,4krát. Přesnost tedy vítězí nad rychlostí.
            </p>
          )}
          {detail >= 2 && (
            <p className="m-0">
              Níž ukazuje „Vývoj v čase“ (řádek k rozbalení) malou křivku. Je
              normální, že křivka nejde jen nahoru. Když přibudou nové klávesy,
              většinou nejdřív klesne - hlavně u klávesy Shift a u číslic.
            </p>
          )}
          <p className="m-0">
            Tip: vyber odznak v části Můj pokrok a stiskni <Kbd>Enter</Kbd> - odznak
            se ukáže <strong>ve velkém</strong>, s třpytem a konfetami.
          </p>
        </Section>

        {skin === "jugend" && (
          <Section title="Po nové klávese">
            <p className="m-0">
              <strong>Nová klávesa</strong> je tvoje, jakmile jsou ty předchozí
              jisté - nemusíš nic vyhrávat. Krátce se oslaví a pak se cvičí dál. Nic
              víc se neděje.
            </p>
            <p className="m-0">
              Když chceš, může pak přijít krátká hra: <strong>Ledové kry</strong>.
              Rozhoduješ o tom ty - v <strong>Nastavení</strong> (<AltText>Alt + O</AltText>), v části{" "}
              <strong>Odměnová hra</strong>. Výchozí volba je <strong>Žádná</strong>.
              Toto nastavení platí pro toto zařízení.
            </p>
          </Section>
        )}

        {!isAdult && (
          <Section title="Ledové kry 🐧">
            {skin === "jugend" ? (
              <>
                <p className="m-0">
                  Hru můžeš <strong>spustit kdykoli</strong> - tlačítkem{" "}
                  <strong>🐧 Hrát</strong> na liště pod polem pro psaní. Tučňák skáče
                  po krách, šplhá na horu písmen a sjíždí po břiše dolů - vždycky s
                  klávesami, které ti teď dělají největší potíže. Cestou vyskakují{" "}
                  <strong>bonusové rybky</strong> (klávesa stisknutá včas = rybka
                  chycená; uniklá rybka nikdy není chyba) a v <strong>Jeskyni ozvěny</strong>{" "}
                  se každá klávesa jen ohlásí. Hra se <strong>nepočítá</strong> do
                  času procvičování a není podmínkou pro nové znaky - ale má vlastní
                  odznaky.
                </p>
                <p className="m-0">
                  Po nové klávese se spustí sama <strong>jen tehdy</strong>, když je v
                  Nastavení zvolená jako <strong>Odměnová hra</strong>. Jinak tě nic
                  nepřeruší - kdy se hraje, rozhoduješ ty.
                </p>
              </>
            ) : (
              <>
                <p className="m-0">
                  Když zvládneš <strong>novou klávesu</strong>, čeká tě na oslavu hra
                  Ledové kry: pomoz tučňákovi přes vodu - stiskni vždycky klávesu,
                  která je na další kře! Někdy cesta vede potom dokonce na{" "}
                  <strong>horu písmen</strong> a po břiše zase dolů. Nová klávesa je
                  tvoje už předtím - hra je odměna, ne povinnost.
                </p>
                <p className="m-0">
                  Hru můžeš taky <strong>spustit kdykoli</strong> - tlačítkem{" "}
                  <strong>🐧 Hrát</strong> nahoře na tvé kartě cvičení, hned vedle
                  kruhu. To je velké <strong>dobrodružství</strong>: každý den vypadá
                  trochu jinak, cestou vyskakují <strong>bonusové rybky</strong>{" "}
                  (rychle stiskni jejich klávesu a jsou tvoje) a v{" "}
                  <strong>Jeskyni ozvěny</strong> nevidíš žádná písmena -{" "}
                  {hoehleMitWesen ? (
                    <>
                      jeskyně ti každou klávesu <strong>řekne</strong>.
                    </>
                  ) : (
                    <>
                      každá klávesa zazní jako tón a odečítač obrazovky nebo braillský
                      řádek ti <strong>řekne</strong>, která to je.
                    </>
                  )}{" "}
                  Hra je jen pro zábavu a <strong>nepočítá se</strong> do času
                  procvičování - ale přináší vlastní odznaky!
                </p>
                {detail >= 2 && (
                  <p className="m-0">
                    Neboj: když se kra potopí nebo uklouzneš na hoře, tučňák prostě
                    připlave zpátky - hned to můžeš zkusit znovu, kolikrát chceš. A
                    kdo projde celé dobrodružství bez jediného šplouchnutí, uvidí nad
                    iglú tančit <strong>polární záři</strong>!
                  </p>
                )}
              </>
            )}
          </Section>
        )}

        <Section title="Co znamená kruh s číslem?">
          <p className="m-0">
            Číslo v kruhu je tvoje <strong>{ringWort}</strong>.{" "}
            <strong>{kind ? "XP jsou body za cvičení:" : "Body jsou za cvičení:"}</strong>{" "}
            za každé kolo jich pár dostaneš a kruh se plní. Když je plný (100 bodů),
            postoupíš na další {ringWort}. Je to jen na sbírání a cvičení to{" "}
            <strong>neztěžuje</strong> - jako body ve hře.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Nepleť si to s <strong>úrovní obtížnosti (1-50)</strong>: ta říká, jak
              rychle máš psát, a nastavuje se podle tebe{" "}
              <strong>automaticky</strong> - stoupá, když se daří, a klesá, když je
              to těžké.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0">
              A nastavení <strong>„Texty pro věk“</strong> určuje jen to, jak těžká
              jsou slova a věty - aby odpovídala věku. Ve třídě ho pro všechny
              nastavuje vyučující; bez třídy ho najdeš nahoře v Nastavení ⚙. Tři
              různé věci tedy: <em>{ringWort}</em> = body, <em>úroveň obtížnosti</em>{" "}
              = očekávaná rychlost, <em>Texty pro věk</em> = věk.
            </p>
          )}
        </Section>

        <Section title={detail === 1 ? "Jak často cvičit?" : "Čas procvičování a týdenní cíl"}>
          {detail === 1 ? (
            <p className="m-0">
              Cvič raději <strong>často a krátce</strong> než jednou hodně dlouho -
              třeba několik dní po pár minutách. Na liště pod polem pro psaní
              počítají hodiny, jak dlouho už dnes píšeš; stejný čas tam plní i{" "}
              <strong>kruh</strong> - tvůj týdenní cíl.
            </p>
          ) : (
            <p className="m-0">
              S účtem můžeš mít <strong>týdenní cíl</strong>: určitý počet{" "}
              <strong>minut za týden</strong>. Ve třídě ho nastavuje vyučující; bez
              třídy si ho můžeš nastavit v Nastavení ⚙ v části „Můj týdenní cíl“ -
              nový cíl platí od příštího pondělí. Týden začíná{" "}
              <strong>v pondělí v 8:00</strong> a trvá do dalšího pondělí do stejné
              hodiny. Na liště pod polem pro psaní vidíš svůj stav jako{" "}
              <strong>kruh</strong>, třeba „25/60 min“ - když je týden splněný, kruh
              je plný a objeví se v něm fajfka. Někdy jsou navíc minuty z dřívějšího
              týdne k <strong>dohnání</strong>; pak je vedle napsané, kolik jich je.
              Když je týdenní cíl splněný, objeví se krátké okno s gratulací - potom
              můžeš kdykoli cvičit dál, když budeš chtít.
            </p>
          )}
        </Section>

        <Section title="Nastavení: ozubené kolečko ⚙ nahoře">
          <p className="m-0">
            Všechna nastavení jsou za tlačítkem <strong>⚙ Nastavení</strong> úplně
            nahoře, hned vlevo od kulaté značky s prvním písmenem tvého jména:{" "}
            <strong>Co cvičíš?</strong>, <strong>Texty</strong> (věk a jazyk),{" "}
            <strong>Klávesnice</strong>, <strong>Zvuk</strong> a{" "}
            <strong>Předčítání</strong>. Jedno stisknutí je otevře, druhé zavře -
            nebo <Kbd>Alt</Kbd> + <Kbd>O</Kbd>, to jde i uprostřed psaní. Při
            otevření skočí kurzor hned do nastavení, při zavření zpátky do pole pro
            psaní.
          </p>
          <p className="m-0">
            Úplně nahoře v Nastavení je <strong>„Co cvičíš?“</strong>: tři cesty,{" "}
            <strong>Můj trénink</strong>, <strong>Příběhy</strong> a{" "}
            <strong>Slovní hry</strong>. <Kbd>Alt</Kbd> + <Kbd>B</Kbd> přepíná
            postupně na další cestu a nová cesta se ohlásí.
          </p>
          <p className="m-0">
            Kulaté tlačítko se zeměkoulí nahoře mění jazyk aplikace Tastenflow -
            tlačítka, nabídky a hned i texty na cvičení. Jazyk samotných textů pak
            můžeš změnit zvlášť v části <strong>Texty</strong>, pokud není pro
            třídu pevně nastavený.
          </p>
          <p className="m-0">
            V části <strong>Klávesnice</strong> vybíráš klávesnici, která před tebou
            opravdu leží. V Česku je to obvykle <strong>Česká (QWERTZ)</strong> - ve
            Windows „Čeština“, na Macu „Czech“; někdo má{" "}
            <strong>Českou (QWERTY)</strong>, kde jsou Y a Z jako na anglické
            klávesnici. Pak klávesnice na obrazovce i rady pro prsty odpovídají - a
            přijdou jen znaky, které na téhle klávesnici jsou. To nejdůležitější o
            české klávesnici:
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              Na číselné řadě jsou písmena <strong>ě š č ř ž ý á í é</strong>.
              Číslice napíšeš s klávesou <Kbd>Shift</Kbd>.
            </li>
            <li>
              <strong>Háček a čárka nad písmenem</strong> jsou na jedné mrtvé
              klávese vpravo vedle klávesy <Kbd>=</Kbd>: bez klávesy Shift je to
              čárka nad písmenem (´), s klávesou Shift háček (ˇ). Stiskni ji - na
              obrazovce se zatím nic neobjeví - a pak napiš písmeno. Háček a d dá{" "}
              <strong>ď</strong>, háček a t dá <strong>ť</strong>, háček a n dá{" "}
              <strong>ň</strong>, čárka nad písmenem a o dá <strong>ó</strong>.
            </li>
            <li>
              <strong>Velká písmena s háčkem nebo čárkou</strong> (Č Š Ř Ž Ě Á É Í
              Ý): klávesa Shift na číselné řadě dá číslici, nikdy velké písmeno.
              Proto nejdřív mrtvá klávesa, potom Shift a písmeno - třeba háček,
              potom <Kbd>Shift</Kbd> + <Kbd>C</Kbd> dá <strong>Č</strong>. Jde to i
              s klávesou <Kbd>Caps Lock</Kbd>; aplikace to vždycky uzná.
            </li>
            <li>
              <strong>ú</strong> a <strong>ů</strong> mají vlastní klávesy: ú vpravo
              vedle P, ů vpravo vedle L (ů je klávesa základní řady pro pravý
              malíček). Velké Ů jde napsat jen s klávesou Caps Lock.
            </li>
            <li>
              <strong>e</strong>, <strong>é</strong> a <strong>ě</strong> jsou tři
              různá písmena - proto aplikace čeká přesně na to, které je v textu.
              Totéž platí třeba pro a a á nebo pro s a š.
            </li>
            <li>
              Znaky jako @ # & € napíšeš s klávesou <Kbd>AltGr</Kbd> (pravý Alt). Na
              Macu místo ní stiskneš klávesu <Kbd>Option</Kbd>.
            </li>
          </ul>
          <p className="m-0">
            Je tam i <strong>„Psaní jednou rukou“</strong> - pro všechny, kdo píšou
            jednou rukou: velká písmena a speciální znaky pak platí s kteroukoli
            klávesou Shift. Ve třídě to nastavuje vyučující.
          </p>
          <p className="m-0">
            Když je zapnuté nastavení <strong>„Větší mezery mezi znaky (CVI)“</strong>,
            během psaní se ztmaví všechno kromě pole, ve kterém se právě píše (řádek
            cvičení nebo herní plocha); po 5 sekundách bez psaní se zase rozjasní.
            Řádek cvičení přitom plynule klouže v rytmu tvého psaní, místo aby
            skákal. Mezery mezi znaky si můžeš v Nastavení ⚙ kdykoli nastavit - ve
            třídě je může nastavit i vyučující; platí to, co se zvolilo naposledy.
          </p>
          <p className="m-0">
            V <strong>Cíleném procvičování</strong> můžeš vybrat až 8 kláves nebo znaků, které se v kolech objevují zvlášť často - v nastavení ve skupině <strong>Co cvičíš?</strong> nebo klávesami <Kbd>Alt</Kbd> + <Kbd>2</Kbd>. Ve třídě to nastavuje vyučující.
          </p>
        </Section>

        <Section title="Předčítání - aplikace čte nahlas">
          <p className="m-0">
            Tlačítkem <strong>🗣 Předčítání</strong> (nebo <Kbd>Alt</Kbd> +{" "}
            <Kbd>V</Kbd>) aplikace čte nahlas - pro všechny, kdo (zatím)
            nepoužívají odečítač obrazovky. Nahoře v Nastavení ⚙ si vybereš, co se
            má číst: <strong>klávesy</strong> (Klávesa po klávese),{" "}
            <strong>slova</strong>, <strong>věty</strong> - jedno, několik nebo
            všechno - a jak rychle.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              V části <strong>„Hlas“</strong> si můžeš vybrat jiný hlas. Když je
              jazykem <strong>čeština</strong>, aplikace sama hledá český hlas; když
              žádný není nainstalovaný, objeví se krátký návod, jak ho přidat.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0">
              O rychlost se neboj: <strong>čas předčítání se odečítá</strong> -
              čekání na hlášení tvoji rychlost nezpomalí.
            </p>
          )}
        </Section>

        <Section title="Melodie při psaní 🎵">
          <p className="m-0">
            <strong>Melodie při psaní</strong> slouží k nácviku <strong>rovnoměrného rytmu psaní</strong> a hlavně má být <strong>zábava</strong>. Každá správná klávesa zahraje další tón písničky; když držíš rytmus, přidá se i kapela.
          </p>
          <p className="m-0">
            Kdo píše rovnoměrně, je plynulejší i na slabších klávesách: rytmus pomáhá přes místa, kde se jinak váhá.
          </p>
          <p className="m-0">
            Zapneš ji klávesami <Kbd>Alt</Kbd> + <Kbd>6</Kbd>, v nastavení ⚙ nebo v nabídce pod kulatým tlačítkem reproduktoru nahoře - tam posuvníky nastavíš i hlasitost každého zvuku. Zvuk změníš klávesami <Kbd>Alt</Kbd> + <Kbd>7</Kbd> a <Kbd>Alt</Kbd> + <Kbd>8</Kbd>.
          </p>
        </Section>

        <Section title="Velká písmena a interpunkce">
          <p className="m-0">
            Čeština potřebuje <strong>velká písmena</strong> - na začátku věty a u
            vlastních jmen (Petr, Praha, Vltava). Aplikace Tastenflow je píše{" "}
            <strong>vždycky správně</strong>, takže nikdy neuvidíš špatně napsané
            slovo.
          </p>
          <p className="m-0">
            <strong>Na začátku úplně snadno:</strong> prostě napiš{" "}
            <strong>malé</strong> písmeno - <strong>velké</strong> se objeví samo.
            Klávesu <Kbd>Shift</Kbd> na to ještě umět <strong>nemusíš</strong>.
          </p>
          <p className="m-0">
            <strong>Už brzy</strong>, po prvních písmenech, se naučíš klávesu{" "}
            <Kbd>Shift</Kbd> „doopravdy“: držíš ji <strong>jednou</strong> rukou a
            písmeno píšeš <strong>druhou</strong> - jako na každé klávesnici. Tak
            brzy napíšeš velká písmena <strong>vlastními prsty</strong>, ne jen s
            automatickou pomocí.
          </p>
          <div className="rounded-lg border border-hairline bg-surface-raised p-3">
            <p className="m-0">
              <strong>Důležité - Shift vždycky DRUHOU rukou:</strong> klávesy Shift
              jsou dvě, vlevo a vpravo. Písmeno píšeš jednou rukou, klávesu{" "}
              <Kbd>Shift</Kbd> držíš <strong>druhou</strong>. Tak žádná ruka nemusí
              mačkat dvě klávesy najednou.
            </p>
            <p className="m-0 mt-2">
              Příklad: velké <strong>A</strong> (levá ruka) → <strong>pravý</strong>{" "}
              <Kbd>Shift</Kbd>. Velké <strong>K</strong> (pravá ruka) →{" "}
              <strong>levý</strong> <Kbd>Shift</Kbd>.
            </p>
            <p className="m-0 mt-2">
              Když použiješ Shift <strong>stejné</strong> ruky nebo klávesu{" "}
              <Kbd>Caps Lock</Kbd>, písmeno se stejně počítá - vždyť je správně.
              Aplikace Tastenflow pak občas dá <strong>tip</strong>, který Shift je
              pohodlnější. Vyučující ve statistice vidí, jak často se to stává; chyba
              to není.
            </p>
          </div>
          <p className="m-0">
            <strong>Pozor na české klávesnici:</strong> klávesa Shift na číselné
            řadě dá číslici, ne velké písmeno. Velká Ě Š Č Ř Ž Ý Á Í É se píšou
            přes háček nebo čárku nad písmenem (viz Klávesnice výše). Řádky s nimi
            proto přijdou, až se naučíš háček a čárku nad písmenem.
          </p>
          {detail >= 2 && (
            <p className="m-0 text-sm text-ink-muted">
              Tip: stiskni klávesu <Kbd>Shift</Kbd> <strong>dvakrát rychle</strong> -
              ohlásí se, kterým prstem ji máš držet.
            </p>
          )}
          <p className="m-0">
            <strong>Tečka, čárka a otazník</strong> se objeví teprve tehdy, až se je
            naučíš. Předtím čteš větu prostě <strong>bez nich</strong> - je to
            záměr, ne chyba.
          </p>
        </Section>

        <Section title="V jakém pořadí přicházejí písmena?">
          <p className="m-0">
            Nové klávesy přibývají vždycky ve stejném pořadí: nejdřív{" "}
            <strong>základní řada</strong>, potom ostatní písmena - ta nejčastější
            napřed. Která klávesa přijde jako další, vidíš vždycky vpravo na liště
            pod polem pro psaní: <strong>„Další klávesa“</strong>.
          </p>
          <div className="flex flex-wrap gap-1" aria-hidden="true">
            {letters.map((ch) => (
              <Kbd key={ch}>{unitGlyph(ch)}</Kbd>
            ))}
          </div>
          <p className="m-0 text-sm text-ink-muted">
            Už <strong>po prvních písmenech</strong> přibudou{" "}
            <strong>velká písmena</strong> (klávesa Shift) a hned potom{" "}
            <strong>tečka, čárka a otazník</strong> - věta začíná velkým písmenem a
            končí tečkou. Písmena z číselné řady (ě í á ž š ř č é ý) přicházejí
            brzy, protože jsou v češtině hodně častá. <strong>Háček</strong> a{" "}
            <strong>čárka nad písmenem</strong> přijdou později. Nakonec přijdou
            ostatní <strong>interpunkční znaménka</strong> (! : ; - a další),{" "}
            <strong>číslice</strong> a <strong>speciální znaky</strong>.
          </p>
        </Section>

        {detail >= 2 && (
          <Section title="Jak funguje „Můj trénink“">
            <p className="m-0">
              <strong>Přizpůsobuje se tobě.</strong> Aplikace si pamatuje, které
              klávesy jsou ještě nejisté, a procvičuje právě ty. Nová klávesa
              přibude teprve tehdy, když jsou ostatní jisté.{" "}
              <strong>Nejčastější</strong> písmena přicházejí jako první - takže už
              po několika klávesách píšeš <strong>skutečná slova a věty</strong> a
              první <strong>příběhy</strong> se otevřou brzy.
            </p>
          </Section>
        )}

        <Section title="Lišta pod polem pro psaní">
          <p className="m-0">
            Pod polem pro psaní je úzká lišta se čtyřmi údaji: tvoje{" "}
            <strong>{ringWort}</strong>, dnešní <strong>čas</strong> procvičování,{" "}
            <strong>týdenní cíl</strong> a <strong>další klávesa</strong>. U
            týdenního cíle ukazuje kruh, kolik <strong>minut</strong> cvičení je za
            tento týden hotovo - třeba „25/60 min“; <strong>fajfka</strong> znamená:
            týden je splněný. Další klávesa se otevře <strong>sama</strong>, jakmile
            jsou ty předchozí jisté - prostě cvič dál.
          </p>
          <p className="m-0">
            Lišta je vidět <strong>vždycky</strong> - i během psaní. Nic tedy
            neposkakuje a kdykoli vidíš, jak dlouho už cvičíš.
          </p>
          <p className="m-0">
            <Kbd>Alt</Kbd> + <Kbd>D</Kbd> ohlásí čas procvičování a týdenní cíl.
            Které klávesy už jsou jisté, které ještě ne a která přijde jako další,
            najdeš v části <strong>„Můj pokrok“</strong> pod nadpisem{" "}
            <strong>„Stav kláves“</strong> (<Kbd>Alt</Kbd> + <Kbd>S</Kbd>, s
            účtem).
          </p>
        </Section>

        <Section title="Knihovna: „Příběhy a zajímavosti“ 📖">
          <p className="m-0">
            Kromě cesty Můj trénink je tu ještě jedna: <strong>Příběhy</strong> - v
            Nastavení ⚙ v části <strong>„Co cvičíš?“</strong>. Čekají tam celé
            příběhy a řady zajímavostí - ne jednotlivé věty, ale{" "}
            <strong>jeden příběh na mnoho kol</strong>. Každý díl má dvanáct
            řádků; příště čteš dál přesně tam, kde se přestalo.
          </p>
          <p className="m-0">
            Objeví se jen to, co se dá s naučenými klávesami opravdu napsat - proto
            jsou na začátku ještě vidět zámky. Otevřou se samy, jakmile je jistých
            dost kláves. Každý řádek přijde <strong>jen jednou</strong>: co už je
            napsané, se jako opakování nevrací.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              <strong>Červená nit:</strong> co si přečteš v řadě zajímavostí, se
              později vrátí v tréninku - jako <strong>otázka jinými slovy</strong>,
              potom jako malé prohloubení a nakonec jako vtip k tématu. Tak naučené
              zůstane v hlavě, a vůbec to nepřipomíná zkoušení.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0 text-sm text-ink-muted">
              Pod seznamem je část „Zdroje a poděkování“: tam vidíš, odkud texty
              pocházejí. Některé jsou napsané přímo pro tuto aplikaci, jiné pocházejí
              z volně dostupných zdrojů - ty jsou tam uvedené jménem, jak se to
              patří.
            </p>
          )}
        </Section>

        <Section title="Odkud jsou texty? 🤖">
          <p className="m-0">
            Vlastní texty této aplikace, tedy věty na cvičení, vtipy a příběhy,
            napsal Johannes <strong>s pomocí umělé inteligence (AI)</strong> a
            potom je osobně přečetl a zkontroloval. Texty z jiných zdrojů (třeba z
            Wikipedie) jsou uvedené se jménem zdroje v části „Zdroje a poděkování“.
          </p>
          <p className="m-0">
            {hoehleMitWesen ? (
              <>
                Také zpívající ryba a mumlající jeskynní tvor ve hře Polární výprava
                jsou <strong>počítačové hlasy</strong>, ne skuteční lidé.
              </>
            ) : (
              <>
                Také zpívající ryba ve hře Polární výprava je{" "}
                <strong>počítačový hlas</strong>, ne skutečný člověk.
              </>
            )}{" "}
            Předčítání (🗣) používá hlas tvého zařízení.
          </p>
        </Section>

        <Section title={VYZVA}>
          <p className="m-0">
            Někdy spustí vyučující <strong>Výzvu</strong> - pro celou třídu.{" "}
            <strong>Všichni dostanou stejný text</strong> a všichni mají stejně
            dlouhý čas.
          </p>
          <p className="m-0">
            <strong>Čas běží až od tvého prvního stisku klávesy</strong> - ne už ve
            chvíli, kdy Výzva začne. Na začátek máš od spuštění{" "}
            <strong>{einstiegsMinuten}</strong>.
          </p>
          <p className="m-0">
            <strong>Jak ji poznáš:</strong> nad polem pro psaní je slovo{" "}
            <strong>{VYZVA}</strong>, vedle něj čas a kolem celé plochy je jiný,{" "}
            <strong>přerušovaný rámeček</strong>. Jakmile čas vyprší, obojí zase
            zmizí.
          </p>
          <p className="m-0">
            <strong>Kolik času zbývá, bez dívání na obrazovku:</strong>{" "}
            <Kbd>Alt</Kbd> + <Kbd>X</Kbd> ti to řekne. Samy od sebe se hodiny ozvou
            jen párkrát, jinak jsou zticha.
          </p>
          <p className="m-0">
            <strong>Braillský řádek zůstane v klidu.</strong> Čas na řádku{" "}
            <strong>netiká</strong>: běží nahoře, ale nikdy se nevsune do toho, co
            právě čteš.
          </p>
          <p className="m-0">
            <strong>Někdy je Výzva „Volné psaní“.</strong> Pak chyba při psaní
            prostě zůstane - nic se neoznačí, žádný zvuk ji nehlásí. Klávesa{" "}
            <Kbd>Backspace</Kbd> opravuje jen v aktuálním řádku; hotový řádek
            zůstane, jak je. Na konci řádku stiskneš po posledním slově mezerník -
            nebo, když má třída zapnutý „Konec řádku klávesou Enter“, klávesu{" "}
            <Kbd>Enter</Kbd>. Co je na konci ještě špatně, ukáže až přehled potom,
            jako seznam ke čtení.
          </p>
          <p className="m-0">
            <strong>Skončit dřív:</strong> <Kbd>Esc</Kbd> se zeptá, jestli opravdu.
            Tlačítko <strong>Psát dál</strong> (také <Kbd>Esc</Kbd>) vrátí do
            řádku, tlačítko <strong>Odevzdat</strong> Výzvu odevzdá - hodnotí se to,
            co je do té chvíle napsané. Totéž udělá tlačítko{" "}
            <strong>Hotovo - odevzdat</strong> pod polem, bez ptaní.
          </p>
          <p className="m-0">
            <strong>Když čas vyprší,</strong> hned uvidíš svůj přehled: úhozy za
            minutu, přesnost, znaky, chyby, řádky a klávesy, které byly nejisté.
            Každá Výzva pak zůstane v části <strong>„Můj pokrok“</strong> pod
            nadpisem <strong>{VYZVY}</strong> - tam si ji můžeš kdykoli znovu
            přečíst.
          </p>
        </Section>

        <Section title="Třídní závod ⚔️">
          <p className="m-0">
            V Třídním závodě píšeš <strong>pět minut o závod</strong> s ostatními
            dětmi ze své třídy. Závod je jen ve třídě, a jen když ho vyučující
            povolí.
          </p>
          <p className="m-0">
            <strong>Vyhlásit závod:</strong> <Kbd>Alt</Kbd> + <Kbd>M</Kbd> nebo
            tlačítko <strong>⚔️ Třídní závod</strong> na liště nad polem pro psaní -
            hned vedle tlačítka <strong>🐧 Hrát</strong>. U všech ostatních se pak
            otevře okno s tlačítky <strong>Jdu do toho!</strong> a{" "}
            <strong>Teď ne</strong>. <Kbd>Esc</Kbd> vrací ke cvičení a stejná
            pozvánka se sama znovu neobjeví.
          </p>
          <p className="m-0">
            <strong>Když už někdo zve,</strong> <Kbd>Alt</Kbd> + <Kbd>M</Kbd> tuhle
            pozvánku vyvolá znovu - druhý závod jde začít teprve tehdy, když první
            už běží. Když zvou dva skoro současně, platí pozvánka, která přišla
            dřív.
          </p>
          <p className="m-0">
            <strong>Když to zrovna nejde:</strong> když už jsi v jednom závodě,
            jmenuje se tlačítko <strong>⚔️ Třídní závod právě probíhá</strong> - a{" "}
            <Kbd>Alt</Kbd> + <Kbd>M</Kbd> ti řekne totéž. Další závody ve třídě
            nevadí: může jich běžet libovolně mnoho najednou.
          </p>
          <p className="m-0">
            <strong>Všichni píšou na své vlastní úrovni.</strong> Kdo už umí
            číslice, dostane číslice; kdo je u základní řady, dostane základní řadu.
            Překlepy něco stojí - jeden překlep váží jako pět znaků.
          </p>
          <p className="m-0">
            <strong>Jak to stojí, bez dívání na obrazovku:</strong> úplně vlevo na
            řádku pro psaní je vždycky osm buněk - <strong>P2</strong> je místo,
            vedle něj zbývající čas. <Kbd>Alt</Kbd> + <Kbd>X</Kbd> ti řekne místo,
            čas a první tři. Samo od sebe se nic neozve - braillský řádek zůstane v
            klidu.
          </p>
          <p className="m-0">
            <strong>Skončit dřív:</strong> <Kbd>Esc</Kbd> nebo tlačítko{" "}
            <strong>Odejít</strong> se zeptá, jestli opravdu. Tlačítko{" "}
            <strong>Psát dál</strong> (také <Kbd>Esc</Kbd>) vrátí do řádku.
            Tlačítko <strong>Odejít</strong> ukončí závod jen pro tebe - ostatní
            píšou dál a vidí, co je do té chvíle napsané.
          </p>
          <p className="m-0">
            <strong>Závod se počítá do tvého času procvičování</strong> a může
            odemknout novou klávesu - stejně jako obyčejné kolo.{" "}
            <strong>Místo se neukládá.</strong> Na konci se objeví seznam: Pohár,
            Stříbro a Bronz pro první tři, ostatní se svým číslem. Pak tě tlačítko{" "}
            <strong>Cvičit dál</strong> nebo <Kbd>Esc</Kbd> vrátí zpátky.
          </p>
        </Section>

        <Section title="Důležité klávesy">
          <p className="m-0 text-sm text-ink-muted">
            <AltOderWahl>
              Na Macu je místo klávesy <Kbd>Alt</Kbd> klávesa <Kbd>⌥</Kbd> (Option).
            </AltOderWahl>
          </p>
          <ul className="m-0 list-none space-y-2 p-0">
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Esc</Kbd>
              </span>
              <span>
                <strong>Nejdůležitější klávesa:</strong> zavře každé okno a kurzor
                potom stojí <strong>vždycky v poli pro psaní</strong>. I když není
                nic otevřené, <Kbd>Esc</Kbd> ho tam vrátí. Jedinou výjimkou je
                Průzkum kláves: tam je i klávesa <Kbd>Esc</Kbd> klávesou k
                prozkoumání a ven se dostaneš až druhým stisknutím.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Shift</Kbd> <Kbd>Shift</Kbd>
              </span>
              <span>Dvakrát rychle: ohlásí se správný prst.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>E</Kbd>
              </span>
              <span>Skok do pole pro psaní.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>U</Kbd>
              </span>
              <span>Přechod ke cvičení.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>S</Kbd>
              </span>
              <span>
                Otevře Můj pokrok (vyučující: Moje třídy). Funguje jen po
                přihlášení. Druhé stisknutí vrátí do pole pro psaní.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>Z</Kbd>
              </span>
              <span>Ohlásí, na kterém řádku právě jsi.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>D</Kbd>
              </span>
              <span>
                Řekne čas procvičování - na braillském řádku a (s předčítáním) jako
                hlášení.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>L</Kbd>
              </span>
              <span>Ohlásí, na které {ringWortLokal} právě jsi.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>3</Kbd>
              </span>
              <span>
                <strong>Průzkum kláves:</strong> každá klávesa, kterou stiskneš, se
                ohlásí a ukáže ve velkém - nejdřív zkratka, pak název, pak co dělá
                (třeba „Tab - Tabulátor - přeskočí na další prvek“). Platí to i pro
                všechny speciální klávesy a interpunkční znaménka, pro znaky přes
                AltGr (na Macu Option) i s cestou k nim a pro klávesové zkratky jako
                Ctrl + C - i s tím, co dělají. Zkratky aplikace Tastenflow (<AltText>Alt + H, Alt + V ...</AltText>) fungují dál. Klávesnice na obrazovce ukazuje, která
                klávesa byla stisknutá. Když je předčítání vypnuté, hlas mlčí. Na
                braillském řádku zůstane vysvětlení stát až do další klávesy a dá se
                celé přečíst posouvacími klávesami; na obrazovce je v okně. Nic se
                nenapíše, nic se neztratí. <Kbd>Shift</Kbd> dává horní znak klávesy a <Kbd>AltGr</Kbd> (na Macu: <Kbd>Option</Kbd>) třetí - tak můžeš postupně vyzkoušet všechny znaky.{" "}<strong>Ven:</strong> ještě jednou{" "}
                <Kbd>Alt</Kbd> + <Kbd>3</Kbd>, dvakrát <Kbd>Esc</Kbd> - nebo prostě
                obnov stránku.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>4</Kbd>
              </span>
              <span>
                <strong>Hledání kláves:</strong> aplikace řekne název klávesy a ty
                ji hledáš. Při prvním zásahu tě aplikace pochválí a požádá tě
                o jinou klávesu a pak o ještě jedno stisknutí - počítá se až to
                druhé, a to jen po jiné klávese mezi nimi. Pak přijde další klávesa.
                Jiná klávesa se jen pojmenuje. V okně přepíná <Kbd>Alt</Kbd> +{" "}
                <Kbd>4</Kbd> mezi průzkumem a hledáním. <strong>Ven:</strong> stejně
                jako u průzkumu.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>K</Kbd>
              </span>
              <span>
                <strong>Barvy a kontrast:</strong> sedm barevných motivů - světlý,
                tmavý, černá na žluté, žlutá na modré a další. Každý se už v seznamu
                ukazuje ve vlastních barvách, takže předem vidíš, jak vypadá.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>T</Kbd>
              </span>
              <span>Otevře nebo zavře seznam klávesových zkratek.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>N</Kbd>
              </span>
              <span>Otevře nebo zavře zprávy od vyučujících.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>+</Kbd> / <Kbd>-</Kbd>
              </span>
              <span>Zvětší nebo zmenší pole pro psaní.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>V</Kbd>
              </span>
              <span>Zapne nebo vypne předčítání.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>H</Kbd>
              </span>
              <span>Otevře nebo zavře tuto nápovědu.</span>
            </li>
            <WeitereTasten />
          </ul>
        </Section>

        {detail >= 3 && (
          <Section title="Jak tě aplikace podporuje">
            <p className="m-0">
              Aplikace měří každé písmeno zvlášť - jak přesně a jak rychle ho píšeš.
              Sama procvičuje ta nejslabší a nové písmeno odemkne teprve tehdy,
              když jsou ta předchozí jistá. Tak vzniká tvoje vlastní cesta učení.
            </p>
            <p className="m-0">
              Úroveň obtížnosti (1-50) se stará o to, aby to bylo vždycky{" "}
              <strong>náročné, ale zvládnutelné</strong>: když se daří, stoupá; když
              je to moc těžké, zase klesá. V části <strong>„Můj pokrok“</strong>{" "}
              vidíš všechno o svém pokroku - i to, jak se zlepšuješ.
            </p>
          </Section>
        )}

        <Section title="Cvičení bez třídy - vlastní účet 🙋">
          <p className="m-0">
            Když nepatříš do žádné třídy, můžeš si založit vlastní účet: stiskni
            kulaté tlačítko <strong>Účet</strong> a zaškrtni{" "}
            <strong>„Cvičím samostatně, bez třídy“</strong>. Potřebuješ k tomu
            e-mailovou adresu: tam každé pondělí přijde přehled týdne - ale jen v
            týdnech, kdy se opravdu cvičilo. Když aplikaci Tastenflow celý rok nikdo
            neotevře, přijde varovný e-mail; když se potom tři týdny nikdo
            nepřihlásí, účet se odstraní i s celým pokrokem.
          </p>
        </Section>

        <PlakatAbschnitt />
      </div>
    </div>
  );
}

/** Plakát k vyvěšení (`handbuchInSprache`). */
function PlakatAbschnitt() {
  const plakat = handbuchInSprache(tastenflowPlakat(), "cs");
  return (
    <Section title="Plakát k vyvěšení">
      <p className="m-0">
        Chceš ukázat aplikaci Tastenflow ve své škole nebo zařízení? Tady je{" "}
        <strong>plakát k vytištění a vyvěšení</strong>: A3 na výšku, na první
        pohled je vidět, co Tastenflow umí, a k tomu QR kód na tastenflow.org.
      </p>
      <p className="m-0">
        <a
          href={downloadAdresse(plakat)}
          download={plakat.speicherName}
          type="application/pdf"
          className="text-accent underline underline-offset-2"
        >
          Stáhnout plakát (PDF, A3, {groesse(plakat.bytes, "cs")})
        </a>
      </p>
    </Section>
  );
}
