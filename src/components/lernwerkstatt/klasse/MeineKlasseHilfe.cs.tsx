/**
 * ★★★ O-CS (03.10.2026): DIE HILFE ZU „MEINE KLASSEN" AUF TSCHECHISCH.
 * ===========================================================================
 * Massgeblich ist die deutsche Fassung (`MeineKlasseHilfe.tsx`): dieselben
 * Abschnitte, dieselben Tatsachen; der Aufbau folgt `MeineKlasseHilfe.pl.tsx`
 * und `MeineKlasseHilfe.tr.tsx`. Sichtbar nur mit `spracheGewaehlt === "cs"`;
 * jedes Programm ohne Sprach-Anbieter zeigt weiter die deutsche Fassung.
 *
 * Anrede (Glossar `recherche-tschechisch-2026-10-02/GLOSSAR-cs.md`, Regel 1
 * und 2): die Lehrkraft mit vy in der Mehrzahlform („Vyberte", „Zadejte",
 * „Stiskněte"), keine Vergangenheit der 2. Person, kein „vyučujícího".
 * Kinder heissen in dieser Sicht „žáci" (Mehrzahl) bzw. „osoba"; was die
 * Lehrkraft der Klasse sagt, steht in der vy-Form („Čas začne běžet, až
 * stisknete první klávesu."). Knopfnamen ohne Anführung (Regel 7),
 * Tastennamen mit „klávesa" davor (Regel 11), Namen nur nach Doppelpunkt
 * (Regel 12), Zähler mit Schrägstrich („Připraveno: 12/14"). Die Startpunkte
 * werden über ihre Tasten beschrieben (Weg „cs", `lernweg.ts`, nur gelesen):
 * f j d k s l a ů · e m i n o t v ě u + Shift.
 */
import { Modal } from "@/components/Modal";
import { RundgangMeineKlassenKnopf } from "@/components/typing/Rundgang";
import {
  DreiWerteHilfe,
  LeistungsstufeHilfe,
  SpaltenHilfe,
} from "@/components/typing/TastenflowZahlenHilfe";
import { EINSTIEGSFENSTER_MIN } from "@/lib/typing/schreibprobe";
import { mehrzahl } from "@/lib/bedienSprache";

function Abschnitt({ titel, children }: { titel: string; children: React.ReactNode }) {
  return (
    <section className="space-y-1.5">
      <h3 className="m-0 text-base font-semibold text-ink">{titel}</h3>
      <div className="space-y-1.5 text-sm leading-relaxed text-ink">{children}</div>
    </section>
  );
}

function Taste({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-hairline bg-surface-sunken px-1.5 py-0.5 text-sm text-ink">
      {children}
    </kbd>
  );
}

// ★ O-CS (03.10.2026): „Výzva" (Glossar §2.3) steht ausgeschrieben im Text -
// Tschechisch beugt das Wort (Výzva, Výzvu, Výzvy), eine Konstante passte nur
// in einem Fall.
export function MeineKlasseHilfeTschechisch({
  onClose,
  programmName,
}: {
  onClose: () => void;
  /** Das offene Programm - davon hängt ab, welche Abschnitte dastehen. */
  programmName?: string;
}) {
  const tastenflow = programmName === "Tastenflow";
  // Akkusativ („mají 10 minut"): die Einzahl heisst „minutu"; alle vier Formen (Glossar §2.11).
  const einstiegsMinuten = mehrzahl(EINSTIEGSFENSTER_MIN, "cs", {
    one: (z) => `${z} minutu`,
    few: (z) => `${z} minuty`,
    many: (z) => `${z} minuty`,
    other: (z) => `${z} minut`,
  });
  return (
    <Modal title="Nápověda: Moje třídy" onClose={onClose} size="lg">
      <div className="space-y-5">
        <RundgangMeineKlassenKnopf onStart={onClose} programmName={programmName} />
        <p className="m-0 text-sm leading-relaxed text-ink">
          Tady pracujete se svou třídou. Třídy a účty vytvoříte{" "}
          <strong>jen jednou</strong> - platí v každé výukové aplikaci, se
          stejným kódem třídy a stejným heslem.
          {tastenflow && (
            <>
              {" "}
              Když jako vyučující otevřete aplikaci Tastenflow, dostanete se vždy
              sem. K vlastnímu procvičování vede tlačítko Cvičit (
              <Taste>Alt</Taste> + <Taste>U</Taste>).
            </>
          )}
        </p>

        <Abschnitt titel="Jak je stránka uspořádaná">
          <p className="m-0">
            <strong>V záhlaví třídy</strong> je její název - u více tříd v
            rozevíracím seznamu Třída, kterým třídu přepnete -, počet žáků a kód
            třídy. Vpravo na tomto řádku, před tlačítkem Ke stažení, je přepínač{" "}
            <strong>Pokrok | Žáci a přístupy</strong> - na stejném místě na obou
            obrazovkách, na které vede.
          </p>
          <p className="m-0">
            V části <strong>Žáci a přístupy</strong> vytvoříte novou třídu,
            přidáte žáky a přesunete je do jiné třídy, uvidíte hesla a
            přihlašovací údaje, kód třídy a aplikace, které třída používá. Více
            žáků najednou přidáte tamtéž, v části Žáci, tlačítkem{" "}
            <strong>Přidat žáky ze souboru Excel</strong>: nejdřív Stáhnout šablonu
            (Excel), potom pro každou osobu jeden řádek se jménem, heslem a - pro
            aplikaci Tastenflow - výchozím bodem. Prázdné heslo vytvoří aplikace
            sama; náhled ukáže, co se převezme, a všechny importované osoby pak
            najdete pod tlačítkem Vytisknout přihlašovací údaje. Tlačítkem{" "}
            <strong>Stáhnout seznam třídy</strong> vedle si kdykoli stáhnete
            soubor Word se jménem, heslem a kódem třídy VŠECH žáků této třídy - k
            vytištění.
            {!tastenflow && (
              <>
                {" "}
                Zprávu všem žákům tam napíšete tlačítkem Zpráva pro třídu.
              </>
            )}
          </p>
          <p className="m-0">
            V části <strong>Pokrok</strong> - sem se dostanete po otevření
            stránky - jsou výukové aplikace této třídy, Ke stažení a pod nimi
            statistika třídy: jak daleko je každá osoba.
            {tastenflow && (
              <>
                {" "}
                Úplně nahoře v ní je řádek tlačítek: <strong>Výzva</strong>,{" "}
                <strong>Vlastní cvičení</strong>, <strong>Týdenní cíl</strong>,{" "}
                <strong>Nastavení třídy</strong> a{" "}
                <strong>Pozastavit na hodinu</strong>. Každé tlačítko otevře pod
                sebou vlastní oddíl - vždy jen jeden najednou, klávesa{" "}
                <Taste>Esc</Taste> ho zase zavře. Tlačítko Výzva otevře formulář s
                poli Použité klávesy a Min a s tlačítkem Začít hned, k tomu
                předchozí Výzvy; Vlastní cvičení určí text pro celou třídu
                (nahraný soubor, text ze složky Moje texty nebo šablona z kurzu -
                žáci k tomu dostanou okno jen s tlačítkem Další); Týdenní cíl
                nastaví minuty za týden; Pozastavit na hodinu spustí 60 minut,
                během kterých třída dál cvičí, ale do týdenního cíle se nic
                nepočítá. Pod tím je Přehled třídy (měsíc nebo školní rok, s
                pruhem skóre a spojnicovým grafem); vpravo v jeho záhlaví je
                tlačítko Zpráva pro třídu - jedna zpráva všem žákům, každá osoba
                ji dostane ve vlastní konverzaci.
              </>
            )}
          </p>
          {tastenflow && (
            <p className="m-0">
              Tlačítko <strong>Nastavení třídy</strong> v tomto řádku otevře:
              ročník (podle něj aplikace volí druhy textů a každý školní rok
              počítá o ročník dál; stupeň Dospělí se nemění), jazyk i se zámkem,
              výchozí bod třídy (platí i pro osoby, které do třídy přibudou
              později) a Třídní závod. Tato čtyři nastavení platí pro celou třídu
              a aplikace se na ně ptá už při vytváření třídy; u každé osoby
              zůstávají v jejím rozbaleném řádku „Kde začít?“, „Psaní jednou
              rukou“ a „V klidu“.
            </p>
          )}
          {tastenflow && (
            <p className="m-0">
              Stupně v nabídce <strong>„Kde začít?“</strong> jsou seřazené podle
              kláves: první je jen F a J, druhý celá základní řada (f j d k s l a
              ů). Třetí přidá další nejčastější písmena - e m i n o t v ě u - a
              klávesu Shift. Další stupně - všechna písmena, interpunkce, číslice
              a všechny klávesy - postupně odemknou zbytek.
            </p>
          )}
          <p className="m-0">
            Každé tlačítko se vysvětlí samo: tip se zobrazí, jakmile na něj
            přejde fokus klávesou Tabulátor. Klávesa <Taste>Esc</Taste> tip
            zavře.
          </p>
        </Abschnitt>

        {tastenflow && (
          <Abschnitt titel="Výzva krok za krokem">
            <ol className="m-0 list-decimal space-y-1 pl-5">
              <li>
                Úplně nahoře ve statistice třídy, v řádku úkolů, otevře formulář
                tlačítko Výzva.
              </li>
              <li>
                Vyberte <strong>použité klávesy</strong> - všichni žáci dostanou
                stejný text na této úrovni.
              </li>
              <li>
                Zadejte <strong>čas Výzvy</strong> v minutách - pole je hned
                vedle.
              </li>
              <li>
                Řekněte třídě: <em>Čas začne běžet, až stisknete první
                klávesu.</em> Od spuštění mají žáci {einstiegsMinuten} na to, aby
                začali; čas Výzvy běží každé osobě zvlášť.
              </li>
              <li>
                Stiskněte <strong>Začít hned</strong> - Výzva začne okamžitě pro
                celou třídu.
              </li>
              <li>
                Hned potom tam uvidíte například{" "}
                <strong>Připraveno: 12/14 - zatím ne: Said, Jano</strong>: u 12
                žáků už Výzva dorazila do zařízení. Řádek se objeví zhruba po
                sekundě. Zůstává-li někdo déle pod „zatím ne“, většinou pomůže
                jednou obnovit stránku.
              </li>
              <li>
                Dokud Výzva běží, vidíte řádek Odevzdáno: 3/18 a k němu jména.
              </li>
              <li>
                Potom se pod formulářem objeví výsledky: u každé osoby pořadí,{" "}
                <strong>skóre Výzvy</strong>, zda bylo zapnuté předčítání, úhozy
                za minutu, přesnost, znaky, chyby a nejisté klávesy. K tomu
                přijde souhrnný e-mail.
              </li>
            </ol>
          </Abschnitt>
        )}

        {tastenflow && (
          <>
            <Abschnitt titel="Co znamenají sloupce tabulky">
              <SpaltenHilfe />
            </Abschnitt>

            <Abschnitt titel="Co znamená úroveň obtížnosti">
              <LeistungsstufeHilfe />
            </Abschnitt>

            <Abschnitt titel="Hodnoty, ze kterých můžete sestavit známku">
              <DreiWerteHilfe />
            </Abschnitt>
          </>
        )}

        <Abschnitt titel="Kód třídy">
          <p className="m-0">
            Je nahoře vedle názvu třídy a platí pro všechny aplikace. Při
            přihlášení se zadává kód třídy, jméno a heslo; zařízení si kód
            zapamatuje, potom stačí jméno a heslo.
          </p>
          <p className="m-0">
            Při vytváření třídy je <strong>povinný</strong>. Zatímco píšete
            název, aplikace navrhne vhodný kód - z „4.B Říčany“ vznikne
            „4BRICANY“. Můžete ho změnit, ale nesmí zůstat prázdný. Později ho
            změníte v části Žáci a přístupy tlačítkem Upravit.
          </p>
          <p className="m-0">
            ⚠️ Když kód změníte, přihlašují se všichni žáci třídy od té chvíle
            novým kódem.
          </p>
        </Abschnitt>

        <Abschnitt titel="Přesunout osobu do jiné třídy">
          <p className="m-0">
            V části Žáci a přístupy je u každé osoby tlačítko{" "}
            <strong>Přesunout do jiné třídy</strong>. Otevře pole Kód nové třídy.
            Funguje to s každou třídou, jejíž kód znáte - i s třídou jiných
            vyučujících. Před přesunem se aplikace ještě jednou zeptá.
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>Osoba se potom přihlašuje novým kódem třídy.</li>
            <li>Vyučující nové třídy uvidí tuto osobu a její pokrok.</li>
            <li>
              {tastenflow
                ? "Výsledky Výzev a zprávy zůstávají v dosavadní třídě."
                : "Zprávy zůstávají v dosavadní třídě."}
            </li>
          </ul>
        </Abschnitt>

        <Abschnitt titel="Klávesové zkratky v této části">
          <p className="m-0">
            <Taste>Alt</Taste> + <Taste>H</Taste> otevře a zavře tuto nápovědu.{" "}
            <Taste>Alt</Taste> + <Taste>T</Taste> ukáže seznam všech klávesových
            zkratek. <Taste>Alt</Taste> + <Taste>U</Taste> vede k vlastnímu
            procvičování. <Taste>Alt</Taste> + <Taste>N</Taste> otevře zprávy,{" "}
            <Taste>Alt</Taste> + <Taste>K</Taste> výběr barev a kontrastu a{" "}
            <Taste>Alt</Taste> + <Taste>J</Taste> nabídku účtu.
          </p>
          <p className="m-0">
            Klávesou Tabulátor procházíte kartami; klávesa Enter kartu přepne. Po
            přepnutí je fokus v nové části - odečítač obrazovky odtud čte dál.
          </p>
        </Abschnitt>

        <Abschnitt titel="Podrobněji">
          <p className="m-0">
            Příručku pro vyučující (v angličtině) otevřete nahoře přes tlačítko Ke
            stažení - je tam také plakát Tastenflow k vytištění a vyvěšení (A3, v
            angličtině), který je volně dostupný všem, i bez přihlášení.
            {tastenflow && (
              <>
                {" "}
                Nápovědu v samotné aplikaci tam otevřete zkratkou{" "}
                <Taste>Alt</Taste> + <Taste>H</Taste>.
              </>
            )}
          </p>
        </Abschnitt>
      </div>
    </Modal>
  );
}
