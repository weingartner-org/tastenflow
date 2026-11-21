/**
 * ★★★ O-CS (03.10.2026): DAS HILFE-FENSTER FÜR LEHRKRÄFTE, TSCHECHISCH.
 * ===========================================================================
 * Aus der Funktion geschrieben, in derselben Reihenfolge wie die deutsche,
 * englische, französische, spanische, italienische, polnische und türkische
 * Fassung (1 bis 12, samt 4a, 4b, 8a, 8b) - wer eine Stelle prüft, findet sie
 * in allen acht. Sichtbar nur mit `spracheGewaehlt === "cs"` (`LehrerHilfe.tsx`).
 * Titel nach Glossar §2.5/§2.6: „Nápověda pro vyučující" (Hilfe = Nápověda,
 * Lehrkraft = vyučující, Ez. und Mz.).
 *
 * ── ANREDE (Glossar `recherche-tschechisch-2026-10-02/GLOSSAR-cs.md`, Regel 1/2) ──
 * vy in der Mehrzahlform („Vyberte", „Stiskněte", „Otevřete"); Knöpfe im
 * Infinitiv („Vytvořit třídu", „Začít hned") und ohne Anführung (Regel 7).
 * KEINE Vergangenheit der 2. Person (auch nicht „jste vybrali"), kein
 * „vyučujícího/-mu" (männlich) - Sätze mit „osoba" (das einzelne Kind),
 * „žáci" (Mehrzahl) oder unpersönlich („lze", „se počítá"). Keine
 * Ausrufezeichen.
 *
 * ── WAS TSCHECHISCH ANDERS IST ───────────────────────────────────────────────
 *  · Zahlen mit Nomen über `mehrzahl(n, "cs", formen)` mit allen vier Formen
 *    (Glossar §2.11) - das Verb zieht mit. Kein Satz endet mit Zahl + Punkt
 *    (Regel 13, §4 Falle 4). Prozent mit geschütztem Leerzeichen („96 %").
 *  · Das Wort der Tippchallenge („Výzva") steht ausgeschrieben, weil es
 *    gebeugt wird (Výzvu, Výzvy, Výzev).
 *  · Score-Erklärung und Kurven-Hinweis stehen hier ausgeschrieben (wie in der
 *    polnischen und türkischen Fassung).
 *  · Abschnitt 4: der Weg „cs" hat seit F4 eine eigene, gemessene Reihenfolge
 *    (`lernweg.ts`, `CS_LETTER_ORDER`, nur gelesen) - die Zahlenreihe mit
 *    ě š č ř ž ý á í é gehört zum Alphabet, nicht ans Ende.
 *  · Tastatur: ě š č ř ž ý á í é auf der Zahlenreihe, Ziffern mit Shift;
 *    Shift gibt dort nie den Grossbuchstaben (Totasten Háček/Čárka oder Caps
 *    Lock); ď ť ň über den Háček, ó über die Čárka; kein Ersatzbuchstabe
 *    (`layouts.ts`, `CS`, `CS_QWERTY`, nur gelesen).
 *  · Schuljahr: im Programm ab 1. August, in Tschechien beginnt es am
 *    1. September (`schuljahrBeginn.ts`, Monat in „Nastavení třídy" wählbar).
 *  · Abschnitt 12: ★ CS-H (10.10.2026) das Handbuch gibt es auf Tschechisch
 *    (`tastenflow-handbuch-cs.pdf`, `HandbuchKnopf` lädt es für „cs"); das
 *    Plakat noch nicht (Bild der Oberfläche fehlt) - der Knopf lädt das
 *    englische, und der Text sagt das.
 *  · Abschnitt 4 (CS-H): „Původ slov" (Slovní kořeny) statt der deutschen
 *    Fremdwörter - die Šablony des Weges „cs".
 *
 * Fliesstext mit tschechischer Anführung (U+201E/U+201C) nur um Bereichs- und Optionsnamen,
 * nur Bindestrich, keine Maus-Wörter, Person zuerst („žáci se zrakovým
 * postižením", „žáci s těžkým zrakovým postižením").
 */
import { BrailleTabellenPunkte } from "./ScreenreaderHinweis";
import { AltText, Kbd } from "./TippenHilfeTeile";
import { useRef } from "react";
import { EINSTIEGSFENSTER_MIN, MIND_ZEICHEN, PROBEN_JE_NIVEAU } from "@/lib/typing/schreibprobe";
import { FEHLER_GEWICHT, FEHLER_GEWICHT_FREI } from "@/lib/typing/schreibprobeWertung";
import { mehrzahl } from "@/lib/bedienSprache";
import { useFocusTrap } from "./useFocusTrap";
import { DidaktikInhalt, didaktikAbschnittTitel } from "./DidaktikHinweise";
import { DreiWerteHilfe, LeistungsstufeHilfe } from "./TastenflowZahlenHilfe";
import { RundgangLehrkraftKnoepfe } from "./Rundgang";
import { HandbuchKnopf } from "@/components/lernwerkstatt/HandbuchKnopf";
import { handbuecherFuer, tastenflowPlakat } from "@/lib/lernwerkstatt/handbuecher";

/** Das Handbuch - derselbe Knopf wie in den anderen Fassungen. */
function HandbuchLaden() {
  const h = handbuecherFuer("tippen")[0];
  if (!h) throw new Error("Kein Tastenflow-Handbuch in HANDBUECHER");
  return (
    <p className="m-0">
      <HandbuchKnopf alsLink handbuch={h} />
    </p>
  );
}

/** Das Plakat - `div` statt `p` (der Knopf kann einen Fehler-Absatz zeigen). */
function PlakatLaden() {
  return (
    <div className="m-0">
      <HandbuchKnopf alsLink handbuch={tastenflowPlakat()} />
    </div>
  );
}

// ★ 18.10.2026 (Johannes: „passe mac an Wahl-taste an"): `Kbd` und `AltText` aus
//   der Kinder-Hilfe - am Mac heißt die Taste „Wahl" (Option, Opción …), im
//   Kästchen wie im Satz. Vorher stand hier ein eigenes `Kbd`, das immer „Alt" zeigte.

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-hairline bg-surface-sunken p-4">
      <h3 className="m-0 mb-1 text-lg font-semibold text-ink">{title}</h3>
      <div className="space-y-2 text-ink-soft">{children}</div>
    </section>
  );
}

/** ★ O-CS (03.10.2026): Prozent mit geschütztem Leerzeichen (Glossar Regel 5). */
const prozent = (p: number) => `${p} %`;

export function LehrerHilfeTschechisch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  useFocusTrap(open, cardRef, { initialFocus: closeRef });
  if (!open) return null;

  // Alle Zahlen mit Nomen mit vier Formen (Glossar §2.11), Nominativ/Akkusativ.
  const einstieg = mehrzahl(EINSTIEGSFENSTER_MIN, "cs", {
    one: (z) => `${z} minuta`,
    few: (z) => `${z} minuty`,
    many: (z) => `${z} minuty`,
    other: (z) => `${z} minut`,
  });
  const znaky = (n: number) =>
    mehrzahl(n, "cs", {
      one: (z) => `${z} znak`,
      few: (z) => `${z} znaky`,
      many: (z) => `${z} znaku`,
      other: (z) => `${z} znaků`,
    });
  // Das Verb zieht mit („je 15 textů", „jsou 2 texty").
  const probenSatz = mehrzahl(PROBEN_JE_NIVEAU, "cs", {
    one: (z) => `je ${z} text Výzvy`,
    few: (z) => `jsou ${z} texty Výzvy`,
    many: (z) => `je ${z} textu Výzvy`,
    other: (z) => `je ${z} textů Výzvy`,
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Nápověda pro vyučující k aplikaci Tastenflow"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        className="card my-8 w-full max-w-3xl space-y-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="m-0 text-xl font-semibold text-ink">
            Nápověda pro vyučující: všechny funkce aplikace Tastenflow
          </h2>
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
        <RundgangLehrkraftKnoepfe onStart={onClose} />

        <p className="m-0 text-ink-soft">
          Aplikace Tastenflow má <strong>vlastní systém účtů</strong>, zcela
          oddělený od přihlášení do výukové platformy. Přihlášení tady
          neovlivní relaci v platformě - a naopak.
        </p>

        <Section title="1 · Vytvoření tříd a účtů">
          <p className="m-0">
            Když jako vyučující otevřete aplikaci Tastenflow, dostanete se vždy do
            části <strong>Moje třídy</strong>; k vlastnímu procvičování vede
            tlačítko Cvičit (<Kbd>Alt</Kbd> + <Kbd>U</Kbd>). Třídu vytvoříte v
            části <strong>Žáci a přístupy</strong> vpravo nahoře - v
            rozbalovacím oddílu <strong>Vytvořit novou třídu</strong>.{" "}
            <strong>Kód třídy</strong> je povinný: zatímco píšete název, aplikace
            navrhne vhodný kód (z „4.B Říčany“ vznikne „4BRICANY“); můžete ho
            změnit, například na <code>4B-ZS</code>. Kód platí pro celou třídu.
            Ve stejném oddílu vyberte <strong>ročník</strong> a{" "}
            <strong>výchozí bod</strong> a zkontrolujte jazyk (se zámkem) a
            Třídní závod - jsou to stejná pole jako v Nastavení třídy. Tlačítko{" "}
            <strong>Vytvořit třídu</strong> funguje, až když je všechno vyplněné;
            jinak jedna věta řekne, co chybí, a fokus stojí v prvním chybějícím
            poli.
          </p>
          <p className="m-0">
            Potom tlačítkem <strong>Přidat osobu</strong> přidáte žáky se{" "}
            <strong>jménem a heslem</strong>. Přihlásit se pak mohou z{" "}
            <strong>jakéhokoli zařízení</strong> pomocí{" "}
            <em>kódu třídy, jména a hesla</em>. Zařízení si kód třídy zapamatuje,
            takže žáci potom zadávají už jen jméno a heslo.
          </p>
          <p className="m-0">
            Název a kód třídy můžete později změnit tlačítkem{" "}
            <strong>✏️ Upravit</strong> - nový kód pak platí pro všechny žáky
            třídy (od té chvíle se přihlašují novým kódem).
          </p>
          <p className="m-0">
            <strong>Další možnost:</strong> <strong>vlastní účet</strong> si může
            vytvořit i ten, kdo nepatří do žádné třídy - v okně přihlášení zaškrtnutím
            políčka „Cvičím samostatně, bez třídy“ a zadáním e-mailové adresy.
            Pro vás se nic nemění: takové účty nepatří do žádné třídy, neobjeví
            se v žádném z vašich seznamů a týdenní přehled se posílá přímo na
            jejich e-mailovou adresu. Ve vaší třídě zůstává všechno při starém -
            účty žáků vytváříte vy.
          </p>
        </Section>

        <Section title="2 · Nastavení třídy a jednotlivých osob">
          <p className="m-0">
            <strong>Pro celou třídu</strong> (tlačítko Nastavení třídy v řádku
            úkolů nad tabulkou, vedle tlačítek Výzva, Vlastní cvičení, Týdenní
            cíl a Pozastavit na hodinu - už zavřené ukazuje ročník, jazyk a
            Třídní závod):
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Ročník:</strong> podle něj aplikace určí úroveň textů -
              slovní zásobu, druh vtipů a tón cvičných textů. 7. ročník ZŠ znamená
              zhruba 13 let, tedy texty pro 11-15 let.{" "}
              <strong>Roste spolu s třídou:</strong> aplikace si zapamatuje školní
              rok zápisu a každý rok sama počítá o ročník dál, bez dalšího
              nastavování. V aplikaci <strong>školní rok začíná 1. srpna</strong>{" "}
              a končí 31. července, pokud v Nastavení třídy není vybraný jiný
              měsíc začátku (v Česku začíná školní rok 1. září): se začátkem roku
              třída postoupí do dalšího ročníku a statistika školního roku se
              řídí stejným kalendářem. Pro skupiny dospělých je stupeň{" "}
              <strong>Dospělí</strong> - ten se nemění. Rok narození se u žáků
              třídy nezjišťuje.
            </li>
            <li>
              <strong>Jazyk a zámek:</strong> jazyk cvičných slov a textů celé
              třídy - čeština nebo angličtina; zámkem vedle něj zajistíte, že ho
              žáci už sami nepřepnou. Kulaté tlačítko jazyka (se zeměkoulí)
              nahoře má každá osoba: přepne tlačítka a nabídky a zároveň i cvičné
              texty - se zámkem jen tlačítka a nabídky.
            </li>
            <li>
              <strong>Výchozí bod třídy:</strong> odpověď na „Kde začít?“ pro
              celou třídu - platí i pro každou osobu, která přibude později, a
              klávesy jen přidává: kdo už je dál, nic neztratí. Při výběru
              aplikace zapíše tento bod zároveň i stávajícím žákům; pokud už je
              někdo dál, nejdřív se zeptá a nabídne tři cesty: zařadit všechny,
              jen ty, kdo ještě tak daleko nejsou, nebo zrušit. Změna platí,
              jakmile osoba příště otevře aplikaci Tastenflow; statistika a
              odznaky v každém případě zůstávají.
            </li>
            <li>
              <strong>Povolit Třídní závod:</strong> žáci se mohou navzájem
              pozvat na pětiminutový závod. V části Časy procvičování v
              rozbaleném řádku uvidíte, kolikrát se osoba v každém týdnu
              zúčastnila - bez pořadí a bez časů.
            </li>
            <li>
              <strong>Konec řádku klávesou Enter:</strong> je-li zaškrtnuté,
              ukončí každá osoba ve třídě každý cvičný řádek klávesou Enter - jako
              při psaní v kanceláři. Platí pro Můj trénink, Příběhy, Vlastní
              cvičení, slovní hry s řádky, Výzvu a Třídní závod; neplatí pro
              hádanky, Přeházená písmena, Diktát prstů, Polární výpravu a Průzkum
              kláves. Výchozí nastavení: vypnuto.
            </li>
          </ul>
          <p className="m-0">
            <strong>Pro každou osobu</strong> (za šipkou v jejím řádku):
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Klávesnice:</strong> vybírá se v Nastavení (ozubené
              kolečko), v části Klávesnice - v Česku obvykle Česká (QWERTZ), někdy
              Česká (QWERTY), podle rozložení nastaveného ve Windows nebo na Macu.
              Nastavení platí pro toto zařízení (ne pro účet) a řídí klávesnici na
              obrazovce, hlášení prstů a to, které znaky se cvičí. Na české
              klávesnici: (1) <strong>na číselné řadě jsou písmena ě š č ř ž ý á
              í é</strong>, číslice se píšou s klávesou Shift; (2) klávesa Shift
              proto na těchto klávesách dá číslici, nikdy velké písmeno - velká Č
              Š Ř Ž Á É Í Ý Ě se píšou mrtvou klávesou (čárka nad písmenem vpravo
              vedle klávesy =, háček je Shift a tatáž klávesa), potom Shift a
              písmeno, nebo s klávesou Caps Lock - obojí platí; (3) ď ť ň vzniknou
              háčkem a písmenem d, t nebo n, ó čárkou nad písmenem a písmenem o; ú
              a ů mají vlastní klávesy, velké Ů jde jen s klávesou Caps Lock; (4)
              písmeno bez háčku nebo čárky české písmeno nenahrazuje - s místo š
              je jiná klávesa a často i jiné slovo (byt, být). Česká (QWERTY) má
              jen y a z na místech anglické klávesnice.
            </li>
            <li>
              <strong>Kde začít?</strong> stejný seznam stupňů jako výchozí bod
              třídy (viz výše) - zde pro jednu osobu, která potřebuje výjimku.
              Zkušenější tak přeskočí základy a začnou dál (např. až od číslic);
              před přeřazením zpět se aplikace zeptá.
            </li>
            <li>
              <strong>Psaní jednou rukou:</strong> zruší pro tuto osobu pravidlo
              Shift druhou rukou - velká písmena a speciální znaky pak platí s
              kteroukoli klávesou Shift.
            </li>
            <li>
              <strong>V klidu:</strong> rychlost této osoby se nikde nehodnotí -
              žádný časový limit ve hře, žádný cíl rychlosti u hvězdiček, žádný
              postup ani sestup úrovně obtížnosti podle rychlosti. Pro ty, kdo
              píšou pečlivě, ale velmi pomalu.
            </li>
            <li>
              <strong>Větší mezery mezi znaky (CVI):</strong> větší mezera mezi
              jednotlivými znaky při opisování, ve třech stupních (dvojnásobné,
              trojnásobné, čtyřnásobné) - pro osoby s cerebrálním zrakovým
              postižením (CVI), kterým těsně stojící znaky splývají. Osoba si
              mezery může změnit i sama ve svém Nastavení (ozubené kolečko, <AltText>Alt + O</AltText>) - a vy zde kdykoli zpět. Platí to, co bylo vybráno naposledy.
            </li>
          </ul>
          <p className="m-0">
            Všechno lze kdykoli změnit - hodnoty třídy v oddílu Nastavení třídy
            nad tabulkou, hodnoty jednotlivých osob v jejich rozbaleném řádku.
          </p>
        </Section>

        <Section title="3 · Úroveň obtížnosti (1-50): srdce aplikace">
          <LeistungsstufeHilfe />
          <p className="m-0">
            <strong>Aktuální úroveň</strong> je v tabulce (sloupec{" "}
            <strong>Úroveň obtížnosti</strong>) a nahoře na obrazovce cvičení.
            Nic nastavovat nemusíte - jen v případě potřeby zapněte V klidu.
          </p>
        </Section>

        <Section title="4 · „Můj trénink“: přizpůsobivý, podle četnosti písmen">
          <p className="m-0">
            Aplikace Tastenflow má <strong>jednu</strong> cestu cvičení, kterou
            každá osoba jde svým tempem - a ta se{" "}
            <strong>přizpůsobuje</strong>: aplikace měří každou klávesu zvlášť,
            sama procvičuje ty nejslabší a novou odemkne, až když jsou dosavadní
            klávesy jisté.
          </p>
          <div className="rounded-xl border border-accent bg-accent-soft p-3">
            <p className="m-0 font-semibold text-ink">Pořadí podle četnosti písmen</p>
            <ul className="m-0 mt-1 list-disc space-y-1 pl-5">
              <li>
                Po základním postavení přicházejí nejdřív{" "}
                <strong>nejčastější</strong> písmena - už po několika klávesách
                tak vznikají <strong>skutečná slova</strong>.
              </li>
              <li>
                <strong>Každá cesta je jiná</strong> - která klávesa přijde na
                řadu, záleží na osobě, ne na pevném seznamu.
              </li>
              <li>
                <strong>Bez pevného konce</strong> - ideální pro každodenní
                samostatné cvičení.
              </li>
            </ul>
          </div>
          <p className="m-0 rounded-xl border border-warning/40 bg-warning/10 p-3">
            <strong>Pro vaše plánování:</strong> česká cesta má{" "}
            <strong>vlastní pořadí kláves</strong>, změřené na českých textech, pro
            českou klávesnici QWERTZ i QWERTY. Začíná základní řadou f j d k s l a
            ů; potom přijdou e m i n o t v ě u, pak klávesa Shift s tečkou, čárkou
            a otazníkem - tak se brzy píšou skutečná slova a věty. Dál následují í
            p c h á r z b y ž, potom š ř č é ý, háček (pro ď ť ň a velká Č Š Ř Ž
            Ě), g, ú, x, čárka nad písmenem (pro ó a velká Á É Í Ý), w, q a dvě
            tečky; ostatní interpunkce, číslice a speciální znaky přijdou až na
            konec. <strong>Písmena z číselné
            řady</strong> (ě š č ř ž ý á í é) tedy nejsou pozdní řada, ale patří k
            abecedě od začátku - jsou skoro v každé české větě.
          </p>
          <p className="m-0 rounded-xl border border-hairline bg-surface-raised p-3">
            <strong>Pořadí závisí na jazyku prvního cvičení:</strong> kterou cestou
            třída jde, určuje jazyk ovládání při prvním cvičení. Třída, která
            začala například německy nebo anglicky, si toto pořadí ponechá, i když
            se jazyk ovládání změní: pořadí se určí jednou a pak se už nemění.
          </p>
          <p className="m-0">
            <strong>Stejný text pro celou třídu:</strong> texty kurzu (základní
            řada, řady písmen, interpunkce, číslice, speciální znaky, celé texty)
            máte k dispozici jako <strong>šablony</strong> v části{" "}
            <strong>Vlastní cvičení</strong> (Moje třídy) - vyberte jednu a celá
            třída cvičí stejný text, bez ohledu na to, kde je která osoba (stejně
            jako u nahraného souboru se to počítá do času procvičování a nové
            klávesy se přitom neodemykají).
          </p>
          <p className="m-0">
            <strong>Původ slov a programový kód:</strong> pro českou cestu je v
            šablonách skupina <strong>Slovní kořeny</strong> (Původ slov): slova k
            opisování, každé s krátkým popisem původu, v pěti tématech (řecké a
            latinské kořeny, slova z němčiny, z francouzštiny a italštiny, z
            angličtiny a z dalekých zemí, rodiny slov); žáci obojí jen opisují.
            Pro Výzvu s vlastním souborem jsou stejná slova ještě jednou, v jiných
            souborech a seřazená podle abecedy. K tomu je tam{" "}
            <strong>programový kód</strong> k opisování (deset programovacích
            jazyků, skutečný zdrojový kód otevřených projektů, jiné úryvky než ve
            Výzvě) - jen ve Vlastním cvičení.
          </p>
        </Section>

        <Section title="4a · „Vlastní cvičení“: jeden text pro celou třídu">
          <p className="m-0">
            Tlačítkem <strong>Vlastní cvičení</strong> v řádku úkolů statistiky
            třídy určíte text, který cvičí celá třída - bez ohledu na to, kde je
            která osoba. K textu vedou tři cesty: <strong>nahrát soubor</strong>{" "}
            (.txt nebo .docx), vybrat dříve uložený text ze složky{" "}
            <strong>Moje texty</strong>, nebo převzít jednu ze{" "}
            <strong>šablon</strong> kurzu (viz bod 4).
          </p>
          <p className="m-0">
            Složka <strong>Moje texty</strong> je vaše vlastní trvalé úložiště -
            patří k vašemu účtu, ne ke třídě, a vidíte ji jen vy. Při nahrávání
            uloží políčko <strong>Uložit do složky Moje texty</strong> (ve
            výchozím stavu zaškrtnuté) automaticky kopii tam, aby šlo stejný
            text později použít znovu bez opětovného nahrávání souboru.
          </p>
          <p className="m-0">
            Obsahuje-li soubor znaky, které nejde napsat, ukáže je oddíl před
            spuštěním jako seznam - rozhodnete, zda soubor opravíte, nebo přesto
            začnete (zbylé znaky pak z řádků vypadnou, nikdy nejsou povinným
            úhozem).
          </p>
          <p className="m-0">
            <strong>Začít cvičení:</strong> každá osoba hned dostane okno, které
            ohlásí cvičení ze školy - může jen stisknout <strong>Další</strong>,
            odmítnout nemůže. Pro každou osobu cvičení skončí samo, jakmile text
            jednou napíše; potom cvičí dál normálně. Tlačítko{" "}
            <strong>Ukončit cvičení</strong> ho ukončí předčasně pro celou třídu.
          </p>
          <p className="m-0">
            Cvičení se počítá do času procvičování a měří se jako každé jiné kolo,
            včetně nejistých kláves - <strong>neodemyká ale žádnou novou
            klávesu</strong>: které klávesy přijdou na řadu, určuje jen soubor.
          </p>
        </Section>

        <Section title={didaktikAbschnittTitel("cs")}>
          <DidaktikInhalt lang="cs" />
        </Section>

        <Section title="5 · Smysluplné texty od začátku">
          <p className="m-0">
            Aplikace ukazuje <strong>co nejdřív</strong> skutečné texty
            přiměřené věku - vtipy, přísloví, rčení, naučné texty a zajímavosti,
            jazykolamy, slovní hříčky a celé věty. Text se objeví, jakmile jsou
            jeho <strong>písmena</strong> naučená; pouhý „slovní salát“ je
            výjimka (jen k cílenému procvičení úplně nové klávesy).
          </p>
          <p className="m-0">
            <strong>Velká písmena:</strong>{" "}
            <strong>pravopis je vždy správný</strong> (velké písmeno na začátku
            věty a u vlastních jmen) - žáci nikdy neuvidí špatně napsané slovo.
            Na začátku k tomu stačí <strong>malé</strong> písmeno; velké se
            objeví samo (automatická velká písmena, pro{" "}
            <strong>všechny věkové skupiny</strong>, protože správný pravopis se
            počítá v každém věku).
          </p>
          <p className="m-0">
            V části Můj trénink ale{" "}
            <strong>skutečná klávesa Shift přichází brzy</strong> - hned po
            prvních častých písmenech, jakmile je dost skutečných slov k
            procvičování (ne až po celé abecedě). Od té chvíle se velká písmena
            píšou „doopravdy“ s klávesou Shift. Na české klávesnici to platí pro
            písmena bez háčku a čárky; velká Č Š Ř Ž Ě Á É Í Ý přijdou až s mrtvou
            klávesou háček nebo čárka nad písmenem, protože Shift na číselné řadě
            dává číslici. Žáci se tak brzy naučí psát velká písmena{" "}
            <strong>sami</strong>, místo aby se dlouho spoléhali na automatickou
            pomoc.
          </p>
          <p className="m-0">
            <strong>Interpunkce</strong> (tečka, čárka, otazník ...) se objeví,
            až když je naučená - předtím stojí věta „bez tečky a čárky“. Ještě
            nenaučená klávesa s <em>písmenem</em> nebo <em>číslicí</em> se naopak{" "}
            <strong>nikdy</strong> nevyžaduje.
          </p>
        </Section>

        <Section title="6 · Hvězdičky, odznaky a zvuky (důležité pro žáky se zrakovým postižením)">
          <p className="m-0">
            Každé kolo dá <strong>1-3 hvězdičky</strong> za přesnost a rychlost -{" "}
            <strong>přesnost se počítá trojnásobně</strong>: 3 hvězdičky vždy
            předpokládají zhruba {prozent(96)} správných úhozů (rychlé, ledabylé
            psaní se neodměňuje); kolo bez chyb má naopak 2 hvězdičky jisté i v
            nejpomalejším tempu. Každý počet hvězdiček má{" "}
            <strong>vlastní zvuk</strong>; při{" "}
            <strong>postupu na vyšší úroveň</strong> zazní zvláštní radostný
            zvuk. Tyto zvuky jsou hlavní zpětnou vazbou pro žáky se zrakovým
            postižením. Tlačítkem <strong>🔇</strong> lze v tiché třídě zvuk
            vypnout.
          </p>
          <p className="m-0">
            K tomu přibývají <strong>odznaky</strong> s názvy pro děti - v
            rodinách se stupni a s „další metou“, kterou si lze vždy nechat
            přečíst. Názvy se zvířátky vidí jen děti ve věku 7-10 let; od textů
            pro 11-15 let je všude neutrální název. Odznaky samy jsou stejné -
            získaný odznak zůstává, i když se úroveň textů změní. Skoro všechny
            odměňují <strong>přesnost a vytrvalost</strong>; jediný odznak za
            rychlost vyžaduje {prozent(95)} přesnosti. Nový odznak přinese vlastní
            zvuk „ta-dá“ s hlášením a potom je ve statistice úplně nahoře (u dané
            osoby i u vás - stejný pohled). Každý odznak lze{" "}
            <strong>vybrat</strong> - pak se zobrazí velký a s efektem.
          </p>
          <p className="m-0">
            Hra <strong>Ledové kry 🐧</strong> je odměna po nové klávese v části
            Můj trénink: tučňák přejde trasu z{" "}
            <strong>nejméně jistých znaků</strong> dané osoby (jednou po krách
            přes vodu, jindy navíc přes horu písmen se skluzavkou po břiše).{" "}
            <strong>Klávesa je odemčená už předtím</strong> - pokrok v učení
            nezávisí na žádné hře. Libovolně mnoho pokusů, žádný konec hry; při
            požadavku „jen přesnost“ (a na úrovni obtížnosti 1) není{" "}
            <strong>žádný časový tlak</strong> (časový limit, který lze vypnout, v
            souladu s WCAG). Navíc mohou osoby ve skupinách textů{" "}
            <strong>7-10 a 11-15 let</strong> hru kdykoli dobrovolně spustit
            tlačítkem <strong>Hrát</strong> - jako „dobrodružství dne“ s{" "}
            <strong>bonusovými rybkami</strong> (zvuk rybky a hlášení znaku;
            zmeškaná rybka není chyba) a s <strong>Jeskyní ozvěny</strong>, kde je
            každá klávesa jen ohlášená (tam aplikace mluví i při vypnutém
            předčítání - žáci s těžkým zrakovým postižením i bez něj hrají úplně
            stejně; jeskyně záměrně NIKDY nepřijde v odměnovém kole). Bezchybný
            průchod končí polární září; dokončená dobrodružství, rybky a
            bezchybné průchody přinášejí rodinu odznaků{" "}
            <strong>Dobrodružství</strong>. Důležité pro vaše hodnocení: hra se{" "}
            <strong>nepočítá do času procvičování</strong> ani do týdenního cíle -
            je to čistá motivace.
          </p>
          <p className="m-0">
            <strong>Dvě různé cesty do hry - prosím nezaměňujte je:</strong>{" "}
            tlačítko <strong>Hrát</strong> je volný vstup, který žáci stisknou
            sami; je u skupin <strong>7-10 a 11-15 let</strong>, od 16 let ne.
            Kolo <strong>po nové klávese</strong> naopak přijde samo: u 7-10 let
            vždy, od 16 let nikdy a u 11-15 let jen tehdy, když je v Nastavení v
            části <strong>Odměnová hra</strong> místo <strong>Žádná</strong>{" "}
            (výchozí nastavení) vybraná hra Ledové kry. Toto nastavení patří k{" "}
            <strong>zařízení</strong>, ne k účtu - stejně jako rozložení
            klávesnice. Na školním počítači tedy platí pro všechny, kdo na něm
            cvičí.
          </p>
        </Section>

        <Section title="7 · Týdenní cíl">
          <p className="m-0">
            Pro každou osobu nastavíte <strong>minuty za týden</strong> - bez
            vyučovacích hodin. Tlačítko <strong>Použít pro celou třídu</strong>{" "}
            zapíše stejnou hodnotu všem žákům třídy najednou a platí i pro ty, kdo
            přibudou později.
          </p>
          <p className="m-0">
            Změna platí vždy <strong>od příštího pondělí v 8:00</strong> - běžící
            týden si ponechá dosavadní cíl. Okno před uložením uvede přesné
            datum.
          </p>
          <p className="m-0">
            <strong>Dohánění:</strong> je-li zaškrtnuté políčko „Dohnat minuty z
            minulých týdnů“, lze zameškané minuty z dřívějších týdnů dohnat
            všechny najednou.
          </p>
          <p className="m-0">
            <strong>Prominout týden</strong> (např. při nemoci) a{" "}
            <strong>Vynulovat minuty k dohnání</strong> fungují jako dosud - pro
            každou osobu zvlášť, beze změny odcvičeného času.
          </p>
          <p className="m-0">
            <strong>Pozastavit cíl na hodinu:</strong> samostatné tlačítko pro
            celou třídu, na 60 minut. Cvičit se dá dál - čas procvičování a
            statistika se počítají dál, jen týdenní cíl v této hodině ne. Druhým
            stisknutím téhož tlačítka (Obnovit cíl) platí cíl znovu ještě před
            koncem hodiny.
          </p>
        </Section>

        <Section title="8 · Statistika a pokrok (u každé osoby k rozbalení)">
          <p className="m-0">
            Kulatým tlačítkem se šipkou<span aria-hidden="true"> ▸</span> před
            jménem otevřete šest řádků, každý zvlášť sbalitelný, shora dolů:{" "}
            <strong>Nastavení</strong> (hodnoty z bodu 2 pro tuto jednu osobu),{" "}
            <strong>Výzvy</strong> (jen když byla napsaná aspoň jedna),{" "}
            <strong>Časy procvičování</strong> (po týdnech, se stavem týdenního
            cíle a - pokud se hrálo - s počtem Třídních závodů, k tomu roční mapa
            celého školního roku), <strong>Nejisté klávesy</strong>,{" "}
            <strong>Odznaky</strong> a - jen při nápadné hodnotě -{" "}
            <strong>Samostatná práce</strong> (viz bod 9).
          </p>
          <p className="m-0">
            V části Časy procvičování je nahoře, kolika Třídních závodů se osoba
            zúčastnila (počítáno v této třídě; jak daleko zpět počítání sahá,
            říká tip u počítadla); klávesa Enter na týdnu otevře jednotlivé časy
            procvičování - den, čas od-do, čistý čas psaní a co se cvičilo.
          </p>
          <p className="m-0">
            Co tu už samostatně není - hodnoty v kostce, pokrok v čase, stav
            kláves, Příběhy a zajímavosti - se neztrácí: všechno je úplně v části{" "}
            <strong>Můj pokrok</strong> dané osoby a vy tam vidíte přesně stejný
            pohled jako ona sama.
          </p>
          <p className="m-0">
            <strong>Skóre:</strong> spojuje přesnost a rychlost psaní do jednoho
            čísla od 0 do 100; jeden překlep se počítá jako 5 znaků a dvakrát
            vyšší rychlost se počítá jen 1,4krát - přesnost má přednost před
            rychlostí.
          </p>
          <p className="m-0">
            <strong>V tabulce třídy</strong> stojí tři sloupce pohromadě pod
            nadpisem <strong>Cvičení</strong>: Přesnost, úhozů/min a Skóre.
            Všechny tři pocházejí z cvičení ve zvoleném období a skóre spojuje
            oba ostatní. Proto jsou lehce podbarvené a orámované tenkou čarou;
            odečítač obrazovky ohlásí Cvičení před nadpisem sloupce. Sloupec{" "}
            <strong>Výzva</strong> úplně vpravo stojí záměrně mimo tuto skupinu,
            pod vlastním nadpisem: je to jedna Výzva v určitý den, ne
            každodenní cvičení.
          </p>
          <p className="m-0">
            Ve sloupci <strong>Skóre</strong> platí: osoba, která ve zvoleném
            období napsala méně než 200 znaků, nedostane skóre, ale pomlčku - pod
            touto hranicí by jediný překlep rozhodoval o několika bodech.
          </p>
          <p className="m-0">
            Tlačítko <strong>Stáhnout jako Excel</strong> je nad tabulkou vpravo
            vedle možnosti Od začátku. Stáhne tabulku jako soubor{" "}
            <strong>nazevtridy_datum.xlsx</strong> (například
            „4B_2026-09-14.xlsx“) - bez ohledu na to, které období je právě
            vybrané. Na začátku je přehled s odkazy na čtyři období a legenda,
            která vysvětluje každý sloupec a ukazuje, jak se počítá skóre. Potom
            následují čtyři listy: běžící školní rok, Od začátku, měsíc (poslední
            4 týdny) a tento týden. Hodnoty jsou v souboru jako čísla, aby se s
            nimi dalo v Excelu dál počítat; kde tabulka ukazuje pomlčku, je
            pomlčka i v souboru.
          </p>
          <p className="m-0">
            <strong>Přehled třídy</strong> nad tabulkou ukazuje třídu jako celek.
            Předvybraný je Měsíc (poslední 4 týdny), vedle je Školní rok. Jeden
            řádek uvádí úhozy za minutu, přesnost a týdenní cíle, každý údaj s
            malým trendem - u měsíce oproti předchozím 4 týdnům, u školního roku
            první týdny cvičení oproti posledním. Celou větu k tomu ukáže tip;
            odečítač obrazovky ji přečte u čísla, včetně žáků, kteří v daném
            období necvičili.
          </p>
          <p className="m-0">
            <strong>Bodový pruh Skóre ve třídě</strong> ukazuje jeden bod za
            každou osobu. Klávesou Tabulátor přejdete na pruh, šipkami od osoby k
            osobě - každá zastávka se ohlásí („Ema, 78 bodů“). Kolik osob má pod
            50, mezi 50 a 70, mezi 70 a 85 a nad 85 bodů a u koho je napsaného
            textu příliš málo, uvádí tip u jeho nadpisu.
          </p>
          <p className="m-0">
            <strong>Spojnicový graf Skóre třídy ve školním roce</strong> ukazuje
            pro každý týden průměr osob, které napsaly nejméně 5 řádků; mezera v
            čáře znamená, že v tom týdnu bylo cvičení příliš málo. Klávesou
            Tabulátor přejdete na graf, šipkami od týdne k týdnu; pro odečítač
            obrazovky jsou všechny týdny navíc v tabulce. Když nově přibude
            klávesa Shift, číslice nebo speciální znaky, čára na krátkou dobu
            klesne - to se dá čekat a není to důvod k obavám.
          </p>
          <p className="m-0">
            <strong>Křivka:</strong> je normální, že křivka jen neroste. Když
            přibudou nové klávesy, většinou nejdřív klesne - hlavně u klávesy
            Shift a u číslic.
          </p>
          <p className="m-0">
            <strong>Transparentnost dat:</strong> každá osoba vidí v části Můj
            pokrok přesně stejné hodnoty o sobě - vy nikdy nevidíte víc než ona
            sama.
          </p>
        </Section>

        <Section title="8a · Hodnoty, ze kterých můžete sestavit známku">
          <DreiWerteHilfe />
        </Section>

        <Section title="8b · Výzva: jedno zadání pro celou třídu">
          <p className="m-0">
            V části pro vyučující <strong>Moje třídy</strong> je úplně nahoře ve{" "}
            <strong>statistice třídy</strong> aplikace Tastenflow, v řádku úkolů,
            tlačítko <strong>Výzva</strong>. Otevře formulář, kterým spustíte
            Výzvu pro celou třídu - <strong>všichni žáci dostanou stejný
            text</strong>, bez ohledu na to, jak daleko jsou v kurzu.
          </p>
          <p className="m-0">
            <strong>Nastavují se tři věci:</strong>{" "}
            <strong>použité klávesy</strong> (od Základní řady po Všechny
            klávesy), hned vedle <strong>druh</strong> a{" "}
            <strong>čas Výzvy</strong> v minutách. Tlačítko{" "}
            <strong>Začít hned</strong> ji spustí okamžitě.
          </p>
          <p className="m-0">
            <strong>Přísně</strong> (výchozí) funguje jako dosud: špatná klávesa
            neposune dál, každý překlep se počítá - i hned opravený.{" "}
            <strong>Volné psaní</strong> se hodí k opisu, jaký mladí lidé znají z
            testů psaní na čas: chyby při psaní zůstávají stát a nejsou
            označené, klávesa Backspace opravuje jen v aktuálním řádku. Hodnotí
            se až na konci to, co je ještě špatně - nejvýš jedna chyba na slovo,
            rozepsané poslední slovo se nepočítá a opravená místa se nepočítají
            vůbec. Protože ponechaná chyba přitom nestála žádný vlastní čas, váží
            víc: {znaky(FEHLER_GEWICHT_FREI)} místo {znaky(FEHLER_GEWICHT)} (8a).
            Volné psaní vyberte, když má třída cvičit opis a překlep nemá
            zastavovat další psaní; Přísně pro ověření samotných hmatových cest.
          </p>
          <p className="m-0">
            <strong>Tři časové údaje, které je třeba rozlišovat:</strong>
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Okamžik spuštění</strong> - chvíle, kdy stisknete Začít
              hned. Od ní může třída začít.
            </li>
            <li>
              <strong>Okno pro vstup</strong>: {einstieg} od okamžiku spuštění.
              Tak dlouho se osoba může ještě připojit; později už to nejde.
            </li>
            <li>
              <strong>Čas Výzvy</strong> běží <strong>každé osobě zvlášť</strong>,
              a to až od jejího <strong>prvního úhozu</strong>. Dvě osoby ze
              stejné třídy proto skončí v různou dobu - to je záměr: kdo nejdřív
              hledá své místo, neztratí čas Výzvy.
            </li>
          </ul>
          <p className="m-0">
            <strong>Texty:</strong> pro každou úroveň <strong>{probenSatz}</strong>,
            každý má nejméně {znaky(MIND_ZEICHEN)} - tak dlouhý, že text nedojde ani
            při vysoké rychlosti. <strong>V kurzu se nevyskytují</strong>, takže
            je předem nelze nacvičit. Další Výzva na stejné úrovni začne tam, kde
            v té předchozí skončila osoba, která došla nejdál: na dalším řádku, u
            textů s větami na začátku další věty. Když text během Výzvy dojde,
            žáci bez přestávky píšou dál v dalším. Na české cestě jsou texty Výzvy česky - každá úroveň
            má vlastní českou sadu. Vlastní text vyberete jako Vlastní soubor
            (poslední možnost v seznamu použitých kláves).
          </p>
          <p className="m-0">
            <strong>Žáci s těžkým zrakovým postižením</strong> píšou Výzvu s{" "}
            <strong>předčítáním aplikace</strong> (<Kbd>Alt</Kbd> +{" "}
            <Kbd>V</Kbd>) - stejně jako při cvičení, bez zvláštního políčka pro
            vyučující. Čas, kdy osoba čeká na hlas, se od času Výzvy odečítá
            automaticky; osobě, která text vidí, a přesto si ho nechá předčítat,
            se odečte stejný čas. Čas předčítání je tak už vyrovnaný; o dalších
            podpůrných opatřeních rozhodují vyučující podle pravidel své školy.
          </p>
          <p className="m-0">
            <strong>Výsledky</strong> jsou v rozbaleném oddílu pod Předchozí
            Výzvy - otevře ho tlačítko Výzva na začátku řádku: u každé osoby
            pořadí, <strong>skóre Výzvy</strong>, zda bylo zapnuté předčítání,
            rychlost, přesnost a nejisté klávesy. Jak skóre Výzvy vzniká, popisuje
            bod 8a. Jakmile Výzva skončí pro <strong>celou třídu</strong>, přijde k
            tomu <strong>souhrnný e-mail</strong> se stejnými hodnotami. Teprve
            tehdy - e-mail v době, kdy ještě někdo píše, by byl neúplný, a druhý
            „tentokrát opravdu všichni“ nikdo nechce.
          </p>
          <p className="m-0">
            Osoba může zvolit <strong>Tentokrát nepíšu</strong>. Pak normálně
            cvičí dál a ve vyhodnocení je uvedená jako{" "}
            <strong>bez účasti</strong>. Každá osoba později vidí své Výzvy v
            části <strong>Můj pokrok</strong> - stejné hodnoty, jaké vidíte vy.
          </p>
        </Section>

        <Section title="9 · Samostatná práce a kontrola AI (jen pro vás)">
          <p className="m-0">
            Sloupec <strong>Samostatná práce</strong> ukazuje ukazatel s hodnotou{" "}
            <strong>od 1 do 10</strong>: roste při náznacích textu, který osoba
            nenapsala sama: <em>vkládání</em> ze schránky, častá změna okna nebo
            fokusu, nepravděpodobně vysoká rychlost nebo bezchybná přesnost bez
            průběhu učení. Tuto hodnotu vidíte <strong>jen vy</strong>, ne žáci.
            Je to podnět ke klidnému pohledu - nikdy hodnocení osoby.
          </p>
        </Section>

        <Section title="10 · Přístupnost">
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Kontrast a velikost písma:</strong> na liště nahoře (světlý,
              tmavý, vysoký kontrast); <Kbd>Alt</Kbd> + <Kbd>+</Kbd> /{" "}
              <Kbd>-</Kbd> zvětší nebo zmenší pole pro psaní.
            </li>
            <li>
              <strong>Předčítání</strong> (vlastní hlas aplikace) zkratkou{" "}
              <Kbd>Alt</Kbd> + <Kbd>V</Kbd> - pro žáky bez nastaveného odečítače
              obrazovky (s NVDA, JAWS nebo VoiceOver ho raději nechte vypnuté).
              Lze zvolit, zda se předčítají <em>písmena, slova nebo věty</em>,
              rychlost řeči a <strong>hlas</strong>. Při češtině aplikace
              automaticky hledá český hlas; pokud chybí, zobrazí se návod k
              instalaci. <strong>Čas předčítání se z rychlosti odečítá</strong> -
              žáci, kteří se učí Braillovo písmo a předčítání potřebují, tak nejsou
              znevýhodnění v počtu úhozů ani ve statistice.
            </li>
            <BrailleTabellenPunkte weg="cs" />
            <li>
              <strong>Hlášení prstu:</strong> dvojí krátké stisknutí klávesy{" "}
              <Kbd>Shift</Kbd> ohlásí správný prst.
            </li>
            <li>
              <strong>Vedení fokusu:</strong> každé tlačítko má pevně daný cíl -
              kdo ho stiskne, ví potom, kde je kurzor. Pro žáky, kteří pracují s
              braillským řádkem, je to rozdíl mezi další prací a hledáním. Tři
              pravidla, kterých si ve výuce všimnete: <Kbd>Esc</Kbd> zavře každé
              okno a vede <strong>vždy zpět do pole pro psaní</strong>; změna
              pohledu (statistika, knihovna, přihlášení) skončí na{" "}
              <strong>nadpisu nového pohledu</strong> a ohlásí ho; a{" "}
              <strong>nic nezmizí samo</strong> - i oslava odemčení počká, až
              osoba stiskne Další.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>E</Kbd> skočí do pole pro psaní,{" "}
              <Kbd>Alt</Kbd> + <Kbd>H</Kbd> otevře nápovědu.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>U</Kbd> přepne na cvičení, <Kbd>Alt</Kbd> +{" "}
              <Kbd>S</Kbd> do části <strong>Moje třídy</strong> (při cvičení: do
              vlastní statistiky); <Kbd>Alt</Kbd> + <Kbd>Z</Kbd> ohlásí, kolikátý
              řádek je právě na řadě.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>D</Kbd> sdělí čas procvičování - na
              braillském řádku a (s předčítáním) jako hlášení.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>T</Kbd> otevře nebo zavře{" "}
              <strong>seznam klávesových zkratek</strong>.
            </li>
          </ul>
        </Section>

        <Section title="11 · Odstranění">
          <p className="m-0">
            Jednotlivé osoby nebo celou třídu lze trvale odstranit (i s účtem,
            stavem hry a vyhodnocením). To nejde vrátit zpět - aplikace se
            předtím zeptá.
          </p>
        </Section>

        <Section title="12 · Ke stažení: příručka a plakát (PDF)">
          <p className="m-0">
            Všechno z této nápovědy a mnohem víc najdete v{" "}
            <strong>příručce pro vyučující</strong>: cesta učení se všemi
            kroky, české klávesnice a písmena s háčkem a čárkou, panel třídy,
            Výzva krok za krokem, skóre a hodnoty, o které se lze při známkování
            opřít.
          </p>
          <HandbuchLaden />
          <p className="m-0">
            Na zeď ve třídě nebo ve sborovně je tu také{" "}
            <strong>plakát Tastenflow k vyvěšení ve škole</strong>: A3 na výšku,
            k vytištění - na první pohled, co Tastenflow umí, s QR kódem na
            tastenflow.org. Na rozdíl od příručky je
            volně dostupný všem, i bez přihlášení.
          </p>
          <PlakatLaden />
          <p className="m-0 text-sm text-ink-muted">
            Obojí najdete také v části Moje třídy pod tlačítkem Ke stažení.
          </p>
        </Section>
      </div>
    </div>
  );
}
