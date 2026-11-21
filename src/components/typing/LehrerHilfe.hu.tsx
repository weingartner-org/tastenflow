/**
 * ★★★ O-HU (25.10.2026): DAS HILFE-FENSTER FÜR LEHRKRÄFTE, UNGARISCH.
 * ===========================================================================
 * In derselben Reihenfolge wie die deutsche Fassung (1 bis 12, samt 4a, 4b,
 * 8a, 8b) - wer eine Stelle prüft, findet sie in allen Fassungen. Sichtbar nur
 * mit `spracheGewaehlt === "hu"` (`LehrerHilfe.tsx`). Inhalt nach der
 * deutschen `LehrerHilfeDeutsch`, Aufbau wie `LehrerHilfe.cs.tsx`.
 * Titel nach Glossar §2.5/§2.6: „Súgó tanároknak" (Hilfe = Súgó,
 * Lehrkraft = tanár).
 *
 * ── ANREDE (Glossar `recherche-ungarisch-2026-10-25/GLOSSAR-hu.md`, Regel 1) ──
 * OHNE Anrede, wo es geht (Hauptwort-Sätze, „-ható/-hető"); wo ein Auftrag
 * nötig ist, die höfliche Befehlsform ohne „Ön" („Válassza ki", „Nyomja
 * meg"). Nie „Ön" als Dauerton, nie „maga". Keine Ausrufezeichen. Kein
 * grammatisches Geschlecht; Wortschatz neutral („tanár", „tanuló", nie
 * „tanárnő"). Knopfnamen in „…” (U+201E/U+201D).
 *
 * ── WAS UNGARISCH ANDERS IST ───────────────────────────────────────────────
 *  · Nach einer Zahl Einzahl (Regel 13, `mehrzahl(n, "hu", …)` mit zwei
 *    gleichen Formen), keine Endung an einer Zahl oder einem Namen (Regel 12),
 *    keine Zahl mit Punkt am Satzende (§4 Falle 4). Prozent OHNE Leerzeichen
 *    („96%", gemessen `Intl` hu-HU).
 *  · Das Wort der Tippchallenge („Kihívás") steht ausgeschrieben, weil es
 *    gebeugt wird (Kihívást, Kihívások).
 *  · Score-Erklärung und Kurven-Hinweis stehen hier ausgeschrieben (wie cs).
 *  · Abschnitt 4: Die Reihenfolge des Weges „hu" entsteht parallel (F4) - die
 *    Hilfe nennt darum KEINE Buchstabenfolge, nur das Prinzip, und verweist
 *    auf die Hilfe der Lernenden (die zeigt die wirkliche Folge,
 *    `layoutLetterOrder`). Nach F4 die Folge hier nachtragen.
 *  · Abschnitt 4: statt der deutschen Fremdwörter die „Szótövek" (fünf Themen
 *    aus `vorlagenDaten/wurzelnHu.ts`).
 *  · Tastatur: Magyar (QWERTZ) und Magyar (101 billentyűs, QWERTY)
 *    (`layouts.ts`, `hu`, `hu-101`, nur gelesen).
 *  · Abschnitt 12: eigenes Handbuch; das Plakat gibt es nur englisch (`tastenflowPlakat`).
 *
 * Nur Bindestrich, keine Maus-Wörter, Person zuerst („látássérült
 * tanulók", „vak tanulók").
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-hairline bg-surface-sunken p-4">
      <h3 className="m-0 mb-1 text-lg font-semibold text-ink">{title}</h3>
      <div className="space-y-2 text-ink-soft">{children}</div>
    </section>
  );
}

/** ★ O-HU (25.10.2026): Prozent ohne Leerzeichen (Glossar Regel 5, gemessen). */
const prozent = (p: number) => `${p}%`;

export function LehrerHilfeUngarisch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  useFocusTrap(open, cardRef, { initialFocus: closeRef });
  if (!open) return null;

  // Nach einer Zahl Einzahl - beide Formen gleich (Glossar §2.11).
  const einstieg = mehrzahl(EINSTIEGSFENSTER_MIN, "hu", { one: (z) => `${z} perc`, other: (z) => `${z} perc` });
  const karakter = (n: number) => mehrzahl(n, "hu", { one: (z) => `${z} karakter`, other: (z) => `${z} karakter` });
  const probenSatz = mehrzahl(PROBEN_JE_NIVEAU, "hu", {
    one: (z) => `${z} Kihívás-szöveg`,
    other: (z) => `${z} Kihívás-szöveg`,
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Súgó tanároknak a Tastenflow programhoz"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        className="card my-8 w-full max-w-3xl space-y-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="m-0 text-xl font-semibold text-ink">
            Súgó tanároknak: a Tastenflow összes funkciója
          </h2>
          <button
            ref={closeRef}
            type="button"
            className="btn-secondary btn-toggle"
            onClick={onClose}
            aria-label="A súgó bezárása"
          >
            ✕ Bezárás
          </button>
        </div>
        <RundgangLehrkraftKnoepfe onStart={onClose} />

        <p className="m-0 text-ink-soft">
          A Tastenflow <strong>saját fiókrendszerrel</strong> működik, teljesen
          külön a tanulási platform bejelentkezésétől. Az itteni bejelentkezés
          nem befolyásolja a platform munkamenetét - és fordítva sem.
        </p>

        <Section title="1 · Osztályok és fiókok létrehozása">
          <p className="m-0">
            Tanárként a Tastenflow megnyitásakor mindig az{" "}
            <strong>„Osztályaim”</strong> részbe érkezik; a saját gyakorláshoz a
            „Gyakorlás” gomb vezet (<Kbd>Alt</Kbd> + <Kbd>U</Kbd>). Osztályt a
            jobb felső <strong>„Tanulók és belépések”</strong> részben lehet
            létrehozni - a lenyitható <strong>„Új osztály létrehozása”</strong>{" "}
            szakaszban. Az <strong>osztálykód</strong> kötelező: a név gépelése
            közben a program javasol egy megfelelőt (a „3.b Szeged” névből
            „3BSZEGED” lesz); ez módosítható, például <code>3B-ALT</code> kódra. A kód
            az egész osztályra érvényes. Ugyanebben a szakaszban kell kiválasztani
            az <strong>évfolyamot</strong> és a <strong>kiindulópontot</strong>,
            és ellenőrizni a nyelvet (lakattal) és az Osztályversenyt - ugyanazok
            a mezők, mint az „Osztály beállításai” alatt. Az{" "}
            <strong>„Osztály létrehozása”</strong> gomb csak akkor működik, ha
            minden ki van töltve; egyébként egy mondat megmondja, mi hiányzik, és
            a fókusz az első hiányzó mezőre kerül.
          </p>
          <p className="m-0">
            Ezután a tanulók <strong>névvel és jelszóval</strong> vehetők fel.
            Bejelentkezni ezután <strong>bármely eszközről</strong> tudnak, az{" "}
            <em>osztálykóddal, a névvel és a jelszóval</em>. Az eszköz megjegyzi
            az osztálykódot, így a tanulóknak már csak a nevet és a jelszót kell
            megadniuk.
          </p>
          <p className="m-0">
            Az osztály neve és kódja később a <strong>„✏️ Szerkesztés”</strong>{" "}
            gombbal módosítható - az új kód ezután az osztály minden tanulójára
            érvényes (attól kezdve az új kóddal jelentkeznek be).
          </p>
          <p className="m-0">
            <strong>Újdonság:</strong> aki egyetlen osztályhoz sem tartozik, 2026.
            augusztus 9. óta <strong>saját fiókot is létrehozhat</strong> - a
            bejelentkezési ablakban az „Egyedül gyakorlok, osztály nélkül”
            jelölőnégyzettel és egy e-mail-címmel. A tanári munkán ez semmit sem
            változtat: az ilyen fiókok nem tartoznak egyetlen osztályhoz sem, nem
            jelennek meg a tanári listákban, és a heti összesítőt maguk kapják. Az
            osztályokban minden marad a régiben - a tanulókat továbbra is a tanár
            veszi fel.
          </p>
        </Section>

        <Section title="2 · Az osztály és az egyes tanulók beállításai">
          <p className="m-0">
            <strong>Az egész osztályra</strong> („Osztály beállításai” gomb a
            táblázat fölötti feladatsávban, a Kihívás, a Saját gyakorlat, a Heti
            cél és a Szünet 1 órára mellett - becsukva a gomb maga is mutatja az
            évfolyamot, a nyelvet és az Osztályversenyt):
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Évfolyam:</strong> ebből számítja ki a program a szövegek
              szintjét - a gyakorló szövegek szókincsét, a viccek fajtáját és a
              hangnemet. A 7. évfolyam nagyjából 13 évet jelent, vagyis a 11-15
              éveseknek szóló szövegeket. <strong>Együtt nő az osztállyal:</strong>{" "}
              a program megjegyzi a beírás tanévét, és minden évben magától egy
              évfolyammal továbblép, utólagos állítás nélkül. Felnőtt csoportoknak
              a <strong>„Felnőttek”</strong> fokozat való - ez nem lép tovább. Az
              osztályba tartozó tanulóktól születési évet a program nem kér.
            </li>
            <li>
              <strong>Nyelv és zárolás:</strong> az egész osztály gyakorló
              szavainak és szövegeinek nyelve - magyar vagy angol; a mellette lévő
              lakattal a tanulók már nem állíthatják át maguk. A fejlécben lévő
              kerek nyelvválasztó gomb minden tanulónál ott van: átállítja a
              gombokat és a menüket, és velük együtt a gyakorló szövegeket is -
              lakattal csak a gombokat és a menüket.
            </li>
            <li>
              <strong>Az osztály kiindulópontja:</strong> a „Honnan induljon?”
              válasza az egész osztálynak - érvényes minden később érkező
              tanulóra is, és csak hozzáad: aki már előrébb tart, semmit sem
              veszít. Kiválasztáskor a program a meglévő tanulóknál is beírja ezt a
              pontot; ha valaki már előrébb jár, előbb rákérdez, és három utat
              kínál: mindenki besorolása, csak azoké, akik még nem tartanak ott,
              vagy a megszakítás. A változás akkor lép életbe, amikor a tanuló
              legközelebb megnyitja a Tastenflow programot; a statisztika és a
              jelvények minden esetben megmaradnak.
            </li>
            <li>
              <strong>Osztályverseny engedélyezése:</strong> a tanulók meghívhatják
              egymást egy ötperces versenyre. A lenyitott sor „Gyakorlási idők”
              részében látható, hogy egy tanuló hetente hányszor vett részt -
              helyezés és idő nélkül.
            </li>
            <li>
              <strong>Sor vége az Enter billentyűvel:</strong> bejelölve az
              osztály minden tanulója minden gyakorlósort az Enter billentyűvel
              zár le - mint az irodai gépelésnél. Érvényes a Saját gyakorlásra, a
              Történetekre, a Saját gyakorlatra, a soros szójátékokra, a Kihívásra
              és az Osztályversenyre; nem érvényes a rejtvényekre, az Összekevert
              betűkre, az Ujjtollbamondásra, az expedícióra és a Billentyűk
              felfedezésére. Alapértelmezés: ki.
            </li>
          </ul>
          <p className="m-0">
            <strong>Tanulónként</strong> (a sorában lévő nyíl mögött):
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Billentyűzet:</strong> a fogaskerék mögötti beállításokban,
              a „Billentyűzet” résznél választható - Magyarországon többnyire
              Magyar (QWERTZ), néha Magyar (101 billentyűs, QWERTY), a Windowsban
              vagy a Macen beállított kiosztás szerint. A beállítás erre az
              eszközre érvényes (nem a fiókra), és ez vezérli a
              képernyő-billentyűzetet, az ujjakra vonatkozó bemondásokat és azt,
              hogy mely jeleket gyakorolnak. A magyar billentyűzeten (1) a számsor
              bal szélén a <strong>0</strong> áll, az 1 előtt, és ahol más
              billentyűzeten a 0 van, ott az <strong>ö</strong>, utána az ü és az
              ó; (2) <strong>minden ékezetes betűnek saját billentyűje
              van</strong> (ő és ú a P mellett, é á ű az L mellett, í az Y
              mellett), a nagybetű a Shift billentyűvel jön; (3) az ékezet nélküli
              betű nem helyettesíti az ékezeteset - kor és kör, hat és hát más
              szó. A 101 billentyűs változaton az Y és a Z az angol billentyűzet
              helyén van, az 1 előtt az í áll, a 0 pedig az AltGr billentyűvel és
              ezzel a billentyűvel írható.
            </li>
            <li>
              <strong>Honnan induljon?:</strong> ugyanaz a fokozatlista, mint az
              osztály kiindulópontjánál (lásd fent) - itt annak az egy tanulónak,
              akinek kivétel kell. A gyakorlottabbak így átugorják az alapokat, és
              előrébb kezdenek (például csak a számjegyektől); visszasorolás előtt
              a program rákérdez.
            </li>
            <li>
              <strong>Gépelés egy kézzel:</strong> ennél a tanulónál feloldja a
              „Shift a másik kézzel” szabályt - a nagybetűk és a különleges jelek
              ilyenkor bármelyik Shift billentyűvel érvényesek.
            </li>
            <li>
              <strong>Nyugodtan:</strong> ennél a tanulónál a sebességet a
              program sehol sem értékeli - nincs időablak a játékban, nincs
              sebességcél a csillagoknál, és a nehézségi szint sem lép fel vagy le
              a sebesség miatt. Azoknak a tanulóknak, akik gondosan, de nagyon
              lassan gépelnek.
            </li>
            <li>
              <strong>Nagyobb betűköz (CVI):</strong> nagyobb köz minden jel
              között a másoláskor, három fokozatban (kétszeres, háromszoros,
              négyszeres) - cerebrális látássérüléssel (CVI) élő tanulóknak,
              akiknél a szorosan álló jelek összefolynak. A tanuló a betűközt a
              saját beállításaiban is módosíthatja (fogaskerék,{" "}
              <AltText>Alt + O</AltText>) - a tanár pedig itt bármikor újra. Az
              érvényes, amit utoljára választottak.
            </li>
          </ul>
          <p className="m-0">
            Minden bármikor módosítható - az osztály értékei a táblázat fölötti
            „Osztály beállításai” részben, az egyes tanulók értékei a lenyitott
            sorukban.
          </p>
        </Section>

        <Section title="3 · A nehézségi szint (1-50): a program szíve">
          <LeistungsstufeHilfe />
          <p className="m-0">
            Az <strong>aktuális szint</strong> a táblázatban (
            <strong>„Nehézségi szint”</strong> oszlop) és a gyakorlóképernyő
            tetején látható. Semmit sem kell beállítani - csak szükség esetén a
            „Nyugodtan” lehetőséget bekapcsolni.
          </p>
        </Section>

        <Section title="4 · „Saját gyakorlás”: alkalmazkodó, gyakoriság szerint">
          <p className="m-0">
            A Tastenflow <strong>egyetlen</strong> gyakorlóutat kínál, amelyet
            minden tanuló a saját tempójában jár be - és ez{" "}
            <strong>alkalmazkodik</strong>: a program minden billentyűt külön
            mér, magától a leggyengébbeket gyakoroltatja, és újat csak akkor old
            fel, ha az eddigiek már biztosan mennek.
          </p>
          <div className="rounded-xl border border-accent bg-accent-soft p-3">
            <p className="m-0 font-semibold text-ink">Sorrend a betűk gyakorisága szerint</p>
            <ul className="m-0 mt-1 list-disc space-y-1 pl-5">
              <li>
                Az alapállás után a <strong>leggyakoribb</strong> betűk jönnek
                először - így már néhány billentyű után{" "}
                <strong>igazi szavak</strong> születnek (ugyanaz az elv, mint a
                keybr online gyakorlóprogramnál).
              </li>
              <li>
                <strong>Minden tanulási út más</strong> - hogy melyik billentyű
                következik, a tanulótól függ, nem egy rögzített listától.
              </li>
              <li>
                <strong>Nincs rögzített vége</strong> - ideális a mindennapos,
                önálló gyakorláshoz.
              </li>
            </ul>
          </div>
          <p className="m-0 rounded-xl border border-warning/40 bg-warning/10 p-3">
            <strong>A tervezéshez:</strong> hogy pontosan milyen sorrendben jönnek
            a billentyűk, azt a tanulók súgója mutatja (<Kbd>Alt</Kbd> +{" "}
            <Kbd>H</Kbd>, „Milyen sorrendben jönnek a betűk?” rész) - mindig a
            tanuló saját tanulási útjának sorrendjével. Az ékezetes betűknek a
            magyar billentyűzeten saját billentyűjük van; ezek nem a lista végén,
            hanem a többi betűvel együtt jönnek.
          </p>
          <p className="m-0">
            <strong>Ugyanaz a szöveg az egész osztálynak:</strong> a tanfolyam
            válogatott szövegei (alapállás, betűsorok, írásjelek, számjegyek,
            szimbólumok, egész szövegek) <strong>sablonként</strong> állnak
            rendelkezésre az „Osztályaim” <strong>„Saját gyakorlat”</strong>{" "}
            részében - egy kiválasztásával az egész osztály ugyanazt a szöveget
            gyakorolja, akárhol tartanak is éppen a tanulók (ahogy egy feltöltött
            fájlnál, ez is beleszámít a gyakorlási időbe, és közben nem oldódnak
            fel új billentyűk).
          </p>
          <p className="m-0">
            <strong>Szótövek és programkód:</strong> a magyar útnál a sablonok
            között ott van a <strong>„Szótövek”</strong> csoport: szavak
            másolásra, mindegyik mellett egy rövid körülírás, öt témában (ősi
            szavaink az uráli időkből, régi török és iráni szavak, szláv
            szomszédaink szavai, német eredetű szavak, görög és latin gyökerek);
            a tanulók mindkettőt csak lemásolják. A szavakhoz a tanár a
            származásukat is látja. A <strong>Kihíváshoz</strong> saját fájllal
            ugyanezek a szavak még egyszer megvannak, más fájlokban és ábécérendben.
            Ezen kívül <strong>programkód</strong> is van másolásra (tíz
            programozási nyelv, nyílt projektek valódi forráskódja, más részletek,
            mint a Kihívásban) - csak a „Saját gyakorlat” részben.
          </p>
        </Section>

        <Section title="4a · „Saját gyakorlat”: egy szöveg az egész osztálynak">
          <p className="m-0">
            Az osztálystatisztika feladatsávjában lévő{" "}
            <strong>„Saját gyakorlat”</strong> gombbal olyan szöveg adható meg,
            amelyet az egész osztály gyakorol - függetlenül attól, hol tartanak
            éppen a tanulók. A szöveghez három út vezet:{" "}
            <strong>fájl feltöltése</strong> (.txt vagy .docx), egy korábban
            elmentett szöveg kiválasztása a <strong>„Saját szövegeim”</strong>{" "}
            közül, vagy a tanfolyam egyik <strong>sablonjának</strong> átvétele
            (lásd a 4. pontot).
          </p>
          <p className="m-0">
            A <strong>„Saját szövegeim”</strong> a tanár saját, tartós tárhelye -
            a fiókhoz tartozik, nem az osztályhoz, és csak a tanár látja.
            Feltöltéskor a <strong>„Mentés a Saját szövegeim közé”</strong>{" "}
            (alapból bejelölve) automatikusan elhelyez ott egy másolatot, így
            ugyanaz a szöveg később újra felhasználható a fájl ismételt
            feltöltése nélkül.
          </p>
          <p className="m-0">
            Ha a fájlban olyan jelek vannak, amelyek nem gépelhetők be, a
            szakasz az indítás előtt listában mutatja meg őket - a tanár dönti
            el, hogy kijavítja-e a fájlt, vagy mégis elindítja (a maradék jelek
            ilyenkor kimaradnak a sorokból, kötelező leütésként soha nem
            jelennek meg).
          </p>
          <p className="m-0">
            <strong>„Saját gyakorlat indítása”:</strong> minden tanuló azonnal
            kap egy ablakot, amely bejelenti a tanár gyakorlatát - csak a{" "}
            <strong>„Tovább”</strong> gombot nyomhatja meg, elutasítani nem
            tudja. A gyakorlat minden tanulónál magától véget ér, amint egyszer
            begépelte a szöveget; utána a szokásos módon gyakorol tovább. A{" "}
            <strong>„Gyakorlat befejezése”</strong> gomb idő előtt befejezi az
            egész osztálynak.
          </p>
          <p className="m-0">
            A gyakorlat beleszámít a gyakorlási időbe, és ugyanúgy méri a
            program, mint bármely más kört, a bizonytalan billentyűkkel együtt -{" "}
            <strong>új billentyűt azonban nem old fel</strong>: hogy mely
            billentyűk jönnek, azt egyedül a fájl határozza meg.
          </p>
        </Section>

        <Section title={didaktikAbschnittTitel("hu")}>
          <DidaktikInhalt lang="hu" />
        </Section>

        <Section title="5 · Értelmes szövegek kezdettől">
          <p className="m-0">
            A program <strong>a lehető legkorábban</strong> valódi, az
            életkornak megfelelő szövegeket mutat - vicceket, közmondásokat,
            szólásokat, ismeretterjesztő szövegeket és érdekességeket,
            nyelvtörőket, szójátékokat és egész mondatokat. Egy szöveg akkor
            jelenik meg, amikor a <strong>betűi</strong> már megvannak; a puszta
            „betűsaláta” kivétel (csak egy vadonatúj billentyű célzott
            gyakorlására).
          </p>
          <p className="m-0">
            <strong>Nagybetűk:</strong> a <strong>helyesírás mindig
            helyes</strong> (nagybetű a mondat elején és a tulajdonneveknél) - a
            tanulók soha nem látnak rosszul leírt szót. Az elején ehhez elég a{" "}
            <strong>kisbetű</strong>; a nagybetű magától megjelenik (automatikus
            nagybetű, <strong>minden korosztálynak</strong>, mert a helyes
            helyesírás minden életkorban számít).
          </p>
          <p className="m-0">
            A „Saját gyakorlásban” azonban{" "}
            <strong>a valódi Shift billentyű korán jön</strong> - már az első
            gyakori betűk után, amint van elég valódi szó a gyakorláshoz (nem
            csak az egész ábécé után). Ettől kezdve a nagybetűt „igazából”, a
            Shift billentyűvel gépelik. Így a tanulók hamar{" "}
            <strong>maguk</strong> írják a nagybetűket, ahelyett hogy sokáig
            csak az automatikus segítségre hagyatkoznának.
          </p>
          <p className="m-0">
            Az <strong>írásjelek</strong> (pont, vessző, kérdőjel és a többi) csak
            akkor jelennek meg, amikor már megtanulták őket - előtte a mondat
            „pont és vessző nélkül” áll. Egy még meg nem tanult{" "}
            <em>betű-</em> vagy <em>számjegybillentyűt</em> viszont a program{" "}
            <strong>soha</strong> nem kér.
          </p>
        </Section>

        <Section title="6 · Csillagok, jelvények és hangok (fontos a vak tanulóknak)">
          <p className="m-0">
            Minden kör <strong>1-3 csillagot</strong> ad a pontosság és a
            sebesség alapján - a <strong>pontosság háromszorosan számít</strong>:
            a 3 csillaghoz mindig nagyjából {prozent(96)} találat kell (a gyors,
            hanyag gépelést a program nem jutalmazza); egy hibátlan kör viszont a
            leglassabb tempóban is biztosan 2 csillagot ér. Minden csillagszámhoz{" "}
            <strong>saját hang</strong> tartozik; <strong>szintlépéskor</strong>{" "}
            külön ünneplő hang szól. Ezek a hangok a legfontosabb visszajelzések
            a látássérült tanulóknak. A <strong>🔇 gombbal</strong> egy csendes
            osztályban a hang kikapcsolható.
          </p>
          <p className="m-0">
            Ehhez jönnek a gyerekeknek szóló nevű <strong>jelvények</strong> -
            fokozatokkal rendelkező családokban, és a mindig bemondható
            „következő céllal”. Az állatos neveket csak a 7-10 évesek látják; a
            11-15 éveseknek szóló szövegektől kezdve mindenhol a semleges név áll.
            A jelvények maguk ugyanazok - a megszerzett jelvény megmarad, a
            szövegszint váltásakor is. Szinte mindegyik a{" "}
            <strong>pontosságot és a kitartást</strong> jutalmazza; az egyetlen
            sebességjelvényhez {prozent(95)} pontosság kell. Egy új jelvény saját
            „tadaa” hangot hoz bemondással, és utána a statisztika legtetején áll
            (a tanulónál és a tanárnál is - ugyanaz a nézet). Minden jelvény{" "}
            <strong>kiválasztható</strong>, és ilyenkor nagyban, effektussal
            jelenik meg.
          </p>
          <p className="m-0">
            A <strong>Jégtáblák 🐧</strong> játék a jutalom egy új billentyű után
            a „Saját gyakorlásban”: a pingvin a tanuló{" "}
            <strong>legbizonytalanabb jeleiből</strong> álló pályán halad át
            (hol jégtáblákon a víz fölött, hol ráadásul a betűhegyen hasoncsúszással).{" "}
            <strong>A billentyű már előtte fel van oldva</strong> - 2026.
            augusztus 14. óta a tanulási haladás egyetlen játéktól sem függ
            (előtte kapu volt, és ez láthatatlanul épp a lassú, gondos tanulókat
            büntette). Akárhány próbálkozás, nincs „game over”; a „csak
            pontosság” követelménynél (és az 1. nehézségi szinten) nincs{" "}
            <strong>időnyomás</strong> (a WCAG szerint kikapcsolható időkorlát).
            Ezen felül a <strong>7-10 és 11-15 évesek</strong> szövegszintjén a
            tanulók a <strong>„Játék”</strong> gombbal bármikor önként
            elindíthatják a játékot - „napi kalandként” <strong>bónuszhalakkal</strong>{" "}
            (halhang és a jel bemondása; az elszalasztott hal nem hiba) és a{" "}
            <strong>Visszhangbarlanggal</strong>, ahol minden billentyűt csak
            bemond a program (ott a program kikapcsolt felolvasásnál is beszél -
            a vak és a látó tanulók pontosan ugyanúgy játszanak; a barlang
            szándékosan SOHA nem fordul elő a jutalomkörben). A hibátlan
            végigjátszás sarki fénnyel ér véget; a teljesített kalandok, a halak
            és a hibátlan végigjátszások a <strong>„Kaland”</strong>{" "}
            jelvénycsaládot hozzák. Fontos az értékeléshez: a játék{" "}
            <strong>nem számít bele a gyakorlási időbe</strong>, sem a heti
            célba - tisztán motiváció.
          </p>
          <p className="m-0">
            <strong>Két különböző út a játékba - kérjük, ne keverje össze őket:</strong>{" "}
            a <strong>„Játék”</strong> gomb a szabad belépés, amelyet a tanulók
            maguk nyomnak meg; a <strong>7-10 és 11-15 évesek</strong> szintjén van
            meg, 16 éves kortól nincs. A kör <strong>egy új billentyű után</strong>{" "}
            viszont magától jön: a 7-10 éveseknél mindig, 16 éves kortól soha, a
            11-15 éveseknél pedig csak akkor, ha a fogaskerék mögött a{" "}
            <strong>„Jutalomjáték”</strong> résznél a <strong>„Nincs”</strong>{" "}
            (alapbeállítás) helyett a Jégtáblák van kiválasztva. Ez a beállítás az{" "}
            <strong>eszközhöz</strong> tartozik, nem a fiókhoz - ahogy a
            billentyűzetkiosztás is. Egy osztálytermi számítógépen tehát
            mindenkire érvényes, aki ott gyakorol.
          </p>
          <p className="m-0">
            <strong>2026. augusztus 22-én megszűnt</strong> a <em>gépelési sprint</em>{" "}
            - három sor a legbizonytalanabb jelek hármas csoportjaiból, addig a
            11-15 évesek alapbeállítása. Játékérték nélküli ismétlés volt: a
            „Saját gyakorlás” amúgy is a gyenge billentyűket részesíti előnyben,
            a tanuló tehát ugyanazt gyakorolta még egyszer, csak egy ablakban.{" "}
            <strong>2026. augusztus 31-én visszavonva:</strong> augusztus 22-én a
            szabad játékbelépés is megszűnt 11 éves kortól - a{" "}
            <strong>„Játék”</strong> gomb ott ismét megvan. Amit a 11-15 évesek
            továbbra SEM kapnak, az a megszakítás minden új billentyű után.
          </p>
        </Section>

        <Section title="7 · Heti cél">
          <p className="m-0">
            Tanulónként <strong>heti percszám</strong> állítható be - foglalkozási
            egységek nélkül. Az „Alkalmaz az egész osztályra” ugyanazt az értéket
            egyszerre beírja az osztály minden tanulójának, és a később érkező
            tanulókra is érvényes.
          </p>
          <p className="m-0">
            Egy módosítás mindig <strong>a következő hétfő 8:00 órától</strong>{" "}
            érvényes - a folyamatban lévő hét megtartja az eddigi célját. Egy
            felugró ablak mentés előtt megmondja a pontos dátumot.
          </p>
          <p className="m-0">
            <strong>Pótlás:</strong> ha az „Elmaradt percek pótlása az előző
            hetekről” be van jelölve, a korábbi hetek elmaradt percei egyszerre
            mind pótolhatók.
          </p>
          <p className="m-0">
            <strong>A hét elengedése</strong> (például betegség esetén) és a{" "}
            <strong>pótlandó percek nullázása</strong> a régi módon működik -
            tanulónként, a gyakorolt idő megváltoztatása nélkül.
          </p>
          <p className="m-0">
            <strong>Cél szüneteltetése egy órára:</strong> külön gomb az egész
            osztálynak, 60 percre. A gyakorlás közben folytatódik - a gyakorlási
            idő és a statisztika tovább számol, csak ennek az órának a heti célja
            nem. Ugyanannak a gombnak egy második megnyomása idő előtt feloldja a
            szüneteltetést.
          </p>
        </Section>

        <Section title="8 · Statisztika és fejlődés (tanulónként lenyitható)">
          <p className="m-0">
            A név előtti kerek nyíl gombbal<span aria-hidden="true"> ▸</span> hat,
            egyenként becsukható sor nyílik meg, felülről lefelé:{" "}
            <strong>Beállítások</strong> (a 2. pont értékei ennek az egy
            tanulónak), <strong>Kihívások</strong> (csak ha legalább egyet
            megírt), <strong>Gyakorlási idők</strong> (hetenként, a hét heti
            céljának állásával és - ha volt játék - az Osztályversenyek számával,
            hozzá az egész tanév éves térképe), <strong>Bizonytalan
            billentyűk</strong>, <strong>Jelvények</strong> és - csak feltűnő
            értéknél - <strong>Önálló munka</strong> (lásd a 9. pontot).
          </p>
          <p className="m-0">
            A „Gyakorlási idők” tetején áll, hány Osztályversenyen vett részt a
            tanuló (ebben az osztályban számolva; hogy a számlálás meddig nyúlik
            vissza, azt a számláló melletti tipp mondja meg); egy héten az Enter
            billentyű megnyitja a hét egyes gyakorlási idejeit - nap, időpont (mettől
            meddig), tiszta gépelési idő és hogy mit gyakorolt.
          </p>
          <p className="m-0">
            Ami itt már nem áll külön - értékek röviden, fejlődés az időben,
            billentyűk állapota, Történetek és érdekességek -, az nem vész el:
            teljes egészében megvan a tanuló <strong>„Fejlődésem”</strong>{" "}
            részében, és a tanár ott pontosan ugyanazt a nézetet látja, mint a
            tanuló maga.
          </p>
          <p className="m-0">
            <strong>A pontszám:</strong> a gépelés pontosságát és sebességét
            egyetlen számban foglalja össze 0 és 100 között; egy elütés annyit
            számít, mint 5 karakter, a kétszeres sebesség pedig csak 1,4-szer
            annyit - a pontosság előnyt élvez a sebességgel szemben.
          </p>
          <p className="m-0">
            <strong>Az osztály táblázatában</strong> három oszlop áll együtt a{" "}
            <strong>„Gyakorlás”</strong> fejléc alatt: Pontosság, leütés/perc és
            Pontszám. Mindhárom a választott időszak gyakorlásából származik, és a
            pontszám a másik kettőt foglalja össze. Ezért halványan színezettek,
            és vékony vonal keretezi őket; a képernyőolvasó az oszlopfejléc előtt
            bemondja: „Gyakorlás”. A jobb szélső <strong>„Kihívás”</strong> oszlop
            szándékosan ezen a csoporton kívül áll, saját fejléc alatt: egy adott napon megírt próba, nem mindennapos
            gyakorlás.
          </p>
          <p className="m-0">
            A <strong>„Pontszám”</strong> oszlopban: aki a választott időszakban
            200 karakternél kevesebbet gépelt, nem kap pontszámot, hanem egy
            vonást - ez alatt egyetlen elütés több pontról döntene.
          </p>
          <p className="m-0">
            A <strong>„Letöltés Excel-fájlként”</strong> gomb a táblázat fölött
            jobbra, a „Kezdettől” mellett áll. A táblázatot{" "}
            <strong>osztálynév_dátum.xlsx</strong> fájlként tölti le (például
            „3b_2026-09-12.xlsx”) - függetlenül attól, melyik időszak van éppen
            kiválasztva. Elöl áttekintés áll a négy időszakra mutató
            hivatkozásokkal és egy jelmagyarázattal, amely minden oszlopot
            elmagyaráz, és megmutatja, hogyan számítódik a pontszám. Utána négy
            munkalap következik: a folyó tanév, Kezdettől, a hónap (az utolsó 4
            hét) és ez a hét. Az értékek számként állnak benne, hogy az Excelben
            tovább lehessen számolni velük; ahol a táblázat vonást mutat, ott a
            fájlban is vonás áll.
          </p>
          <p className="m-0">
            <strong>Az osztályáttekintés</strong> a táblázat fölött az osztályt
            egészében mutatja. A „Hónap” (az utolsó 4 hét) van előre kiválasztva,
            mellette áll a „Tanév”. Egy sor megadja a leütés/perc értéket, a
            pontosságot és a heti feladatokat, mindegyiket egy kis trenddel - a
            hónapnál az előző 4 héthez képest, a tanévnél az első és az utolsó
            gyakorlóhetek összevetésével. A teljes mondatot hozzá a tipp mutatja;
            a képernyőolvasó a számnál felolvassa, azokkal a tanulókkal együtt,
            akik az időszakban nem gyakoroltak.
          </p>
          <p className="m-0">
            <strong>A „Pontszám az osztályban” pontsáv</strong> tanulónként egy
            pontot mutat. A Tab billentyűvel a sávra lehet ugrani, a
            nyílbillentyűkkel tanulóról tanulóra - minden megállót bemond a
            program („Anna, 78 pont”). Hogy hány tanuló van 50 pont alatt, 50 és
            70, 70 és 85 között és 85 pont fölött, és ki gépelt túl keveset, azt a
            fejléc tippje mondja meg.
          </p>
          <p className="m-0">
            <strong>A vonaldiagram („Az osztály pontszáma a tanévben”)</strong>{" "}
            hetenként azoknak a tanulóknak az átlagát mutatja, akik legalább 5
            sort gépeltek; egy hézag azt jelenti, hogy azon a héten túl kevés volt
            a gyakorlás. A Tab billentyűvel a diagramra lehet ugrani, a
            nyílbillentyűkkel hétről hétre; a képernyőolvasónak minden hét egy
            táblázatban is megvan. Ha a Shift billentyű, a számjegyek vagy a
            szimbólumok újonnan bekerülnek, a vonal rövid időre lejjebb megy - ez
            várható, és nem ok az aggodalomra.
          </p>
          <p className="m-0">
            <strong>A görbe:</strong> teljesen rendben van, ha a görbe nem csak
            felfelé megy. Amikor új billentyűk jönnek, többnyire előbb lejjebb
            megy - főleg a Shift billentyűnél és a számjegyeknél.
          </p>
          <p className="m-0">
            <strong>Átlátható adatok:</strong> minden tanuló a „Fejlődésem”
            részben pontosan ugyanazokat az értékeket látja magáról - a tanár
            soha nem lát többet, mint a tanuló maga.
          </p>
        </Section>

        <Section title="8a · Az értékek, amelyekből érdemjegy állítható össze">
          <DreiWerteHilfe />
        </Section>

        <Section title="8b · A Kihívás: egy próba az egész osztálynak">
          <p className="m-0">
            A tanári <strong>„Osztályaim”</strong> részben a Tastenflow{" "}
            <strong>osztálystatisztikájának</strong> legtetején, a feladatsávban
            áll a <strong>„Kihívás”</strong> gomb. Ez nyitja meg az űrlapot,
            amellyel az egész osztálynak próba indítható -{" "}
            <strong>minden tanuló ugyanazt a szöveget kapja</strong>, függetlenül
            attól, hol tart a tanfolyamban.
          </p>
          <p className="m-0">
            <strong>Három dolgot kell beállítani:</strong> a{" "}
            <strong>használt billentyűket</strong> (az Alapsortól a Minden
            billentyűig), mellette a <strong>fajtát</strong> és a{" "}
            <strong>Kihívás idejét</strong> percben. A{" "}
            <strong>„Kezdés most”</strong> azonnal elindítja.
          </p>
          <p className="m-0">
            A <strong>„Szigorú”</strong> (alapbeállítás) a régi módon működik: a
            rossz billentyű nem visz tovább, minden elütés számít - az azonnal
            kijavított is. A <strong>„Szabad gépelés”</strong> egy olyan
            másoláshoz illik, amilyet a fiatalok az időre gépelős tesztekből
            ismernek: a hibák gépelés közben ott maradnak, és nincsenek
            megjelölve, a Backspace billentyű csak az aktuális sorban javít. Csak
            a végén értékeli a program, ami még hibásan áll - szavanként
            legfeljebb egy hiba, az elkezdett utolsó szó nem számít, és a
            kijavított helyek egyáltalán nem számítanak. Mivel egy ott maradt
            hiba közben nem vett el saját időt, többet nyom a latban:{" "}
            elütésenként {karakter(FEHLER_GEWICHT_FREI)}, nem{" "}
            {karakter(FEHLER_GEWICHT)} (8a). A „Szabad gépelés” akkor jó választás, ha az osztálynak másolást
            kell gyakorolnia úgy, hogy egy elütés ne akassza meg a további
            gépelést; a „Szigorú” magának a billentyűutaknak a próbájához.
          </p>
          <p className="m-0">
            <strong>Három időadat, amelyet meg kell különböztetni:</strong>
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              Az <strong>indítás pillanata</strong> - amikor a tanár megnyomja a
              „Kezdés most” gombot. Ettől kezdve az osztály elkezdheti.
            </li>
            <li>
              A <strong>belépési időablak</strong>: {einstieg} az indítás
              pillanatától. Eddig egy tanuló még be tud lépni; aki később jön, az
              lekéste.
            </li>
            <li>
              A <strong>Kihívás ideje</strong> <strong>minden tanulónak
              külön</strong> fut, mégpedig csak az <strong>első
              billentyűleütésétől</strong>. Ugyanannak az osztálynak két tanulója
              ezért különböző időpontban fejezi be - ez szándékos: aki előbb a
              helyét keresi, nem veszít a Kihívás idejéből.
            </li>
          </ul>
          <p className="m-0">
            <strong>A szövegek:</strong> szintenként <strong>{probenSatz}</strong>{" "}
            van, mindegyik legalább {karakter(MIND_ZEICHEN)} hosszú - olyan hosszú,
            hogy nagy sebességnél se fogyjon el. <strong>A tanfolyamban nem
            fordulnak elő</strong>, így egyetlen tanuló sem gyakorolhatta őket
            előre. Egy szint következő Kihívása ott kezdődik, ahol az előzőben
            legmesszebb jutott tanuló abbahagyta: a következő sornál, mondatos
            szövegeknél a következő mondat elején. Ha egy szöveg a Kihívás közben
            elfogy, a tanulók szünet nélkül a következőben gépelnek tovább.
          </p>
          <p className="m-0">
            <strong>Vak tanulók</strong> a Kihívást a{" "}
            <strong>program felolvasásával</strong> (<Kbd>Alt</Kbd> +{" "}
            <Kbd>V</Kbd>) írják - pont úgy, mint a gyakorlásnál, külön tanári
            jelölőnégyzet nélkül. Azt az időt, amíg egy tanuló a hangra vár, a
            Kihívás órája magától levonja; annak a tanulónak, aki látja a
            szöveget, és mégis felolvastatja, ugyanannyi időt von le.
          </p>
          <p className="m-0">
            <strong>Az eredmények</strong> a lenyitott szakaszban, a „Korábbi
            Kihívások” alatt állnak - a sor elején lévő „Kihívás” gomb nyitja
            meg: tanulónként helyezés, <strong>a Kihívás pontszáma</strong>, volt-e
            felolvasás, sebesség, pontosság és a bizonytalan billentyűk. Hogy hogyan
            jön létre a Kihívás pontszáma, azt a 8a. pont írja le. Amint a
            Kihívás az <strong>egész osztálynak</strong> véget ért, ehhez egy{" "}
            <strong>összesítő e-mail</strong> is érkezik ugyanezekkel az
            értékekkel. Csak akkor - egy e-mail, amíg még valaki gépel, hiányos
            lenne, és egy második, „most már tényleg mindenki” levelet senki sem
            szeretne.
          </p>
          <p className="m-0">
            Egy tanuló választhatja a <strong>„Most nem gépelek”</strong>{" "}
            lehetőséget. Ilyenkor a szokásos módon gyakorol tovább, és az
            értékelésben <strong>„nem vett részt”</strong> áll mellette. Minden
            tanuló később a <strong>„Fejlődésem”</strong> részben látja a saját
            Kihívásait - ugyanazokat az értékeket, amelyeket a tanár.
          </p>
        </Section>

        <Section title="9 · Önálló munka és MI-ellenőrzés (csak a tanárnak)">
          <p className="m-0">
            Az <strong>„Önálló munka”</strong> oszlop egy{" "}
            <strong>1-10</strong> közötti jelzőértéket mutat. Akkor magas, ha
            jelek utalnak arra, hogy a szöveget nem a tanuló maga gépelte:{" "}
            <em>beillesztés</em> a vágólapról, gyakori ablak- vagy fókuszváltás,
            valószínűtlenül nagy sebesség vagy tanulási előzmény nélküli
            hibátlan pontosság. Ezt az értéket <strong>csak a tanár</strong>{" "}
            látja, a tanulók nem.
          </p>
        </Section>

        <Section title="10 · Akadálymentesség">
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Kontraszt és betűméret:</strong> a fenti sávban (világos,
              sötét, erős kontraszt); az <Kbd>Alt</Kbd> + <Kbd>+</Kbd> /{" "}
              <Kbd>-</Kbd> nagyítja vagy kicsinyíti a gépelési mezőt.
            </li>
            <li>
              <strong>Felolvasás</strong> (a program saját hangja) az{" "}
              <Kbd>Alt</Kbd> + <Kbd>V</Kbd> billentyűparanccsal - beállított
              képernyőolvasó nélküli tanulóknak (NVDA, JAWS vagy VoiceOver mellett
              jobb kikapcsolva hagyni). Választható, hogy{" "}
              <em>betűket, szavakat vagy mondatokat</em> olvasson-e fel, a
              beszédtempó és <strong>a hang</strong>. Magyar nyelvnél a program
              magától magyar hangot keres; ha nincs ilyen, telepítési útmutató
              jelenik meg. <strong>A felolvasás idejét a program kivonja a
              sebességből</strong> - így a Braille-írást tanuló, felolvasásra
              szoruló tanulók nincsenek hátrányban a leütésszámban és a
              statisztikában.
            </li>
            <BrailleTabellenPunkte weg="hu" />
            <li>
              <strong>Az ujj bemondása:</strong> a <Kbd>Shift</Kbd> billentyű
              kétszeri gyors megnyomására a program bemondja a helyes ujjat.
            </li>
            <li>
              <strong>Fókuszvezetés (2026. augusztus 22.):</strong> minden gombnak
              rögzített célja van - aki megnyomja, utána tudja, hol áll a kurzor.
              A Braille-kijelzővel dolgozó tanulóknak ez a különbség a
              továbbdolgozás és a keresgélés között. Három szabály, amely a
              tanórán feltűnik: az <Kbd>Esc</Kbd> minden ablakot bezár, és{" "}
              <strong>mindig a gépelési mezőbe</strong> visz vissza; a
              nézetváltás (statisztika, könyvtár, bejelentkezés) az{" "}
              <strong>új nézet címsorára</strong> kerül, és bemondja; és{" "}
              <strong>semmi sem tűnik el magától</strong> - a feloldás
              ünneplése is megvárja, amíg a tanuló megnyomja a „Tovább” gombot.
            </li>
            <li>
              Az <Kbd>Alt</Kbd> + <Kbd>E</Kbd> a gépelési mezőbe ugrik, az{" "}
              <Kbd>Alt</Kbd> + <Kbd>H</Kbd> megnyitja a súgót.
            </li>
            <li>
              Az <Kbd>Alt</Kbd> + <Kbd>U</Kbd> a gyakorlásra vált, az{" "}
              <Kbd>Alt</Kbd> + <Kbd>S</Kbd> az <strong>„Osztályaim”</strong>{" "}
              részre (gyakorlás közben: a saját statisztikára); az{" "}
              <Kbd>Alt</Kbd> + <Kbd>Z</Kbd> bemondja, hányadik sor következik
              éppen.
            </li>
            <li>
              Az <Kbd>Alt</Kbd> + <Kbd>D</Kbd> megadja a gyakorlási időt - a
              Braille-kijelzőn és (felolvasással) hangosan is.
            </li>
            <li>
              Az <Kbd>Alt</Kbd> + <Kbd>T</Kbd> megnyitja vagy bezárja a{" "}
              <strong>billentyűparancsok listáját</strong>.
            </li>
          </ul>
        </Section>

        <Section title="11 · Törlés">
          <p className="m-0">
            Egyes tanulók vagy egy egész osztály véglegesen törölhetők (fiókkal,
            játékállással és értékeléssel együtt). Ez nem vonható vissza - a
            program előtte rákérdez.
          </p>
        </Section>

        <Section title="12 · Letöltések: kézikönyv és plakát (PDF)">
          <p className="m-0">
            Mindaz, ami ebben a súgóban áll, és jóval több is, megtalálható a{" "}
            <strong>kézikönyvben tanároknak</strong>: mindkét tanulási világ az
            összes tanulási lépéssel és sorrenddel, az összes történet és
            ismeretterjesztő sorozat a megnyílásuk időpontjával, az összes
            jelvény és jutalmazási rendszer, hozzá egy{" "}
            <strong>„Kész az osztályom az indulásra?” ellenőrzőlista</strong> és
            egy <strong>másolható sablon a tanulók haladásához</strong>.
          </p>
          <HandbuchLaden />
          <p className="m-0 text-sm text-ink-muted">
            A füzet közvetlenül a program tartalmából készül - a forráskódban
            egy ellenőrző gondoskodik róla, hogy minden tartalmi változáskor
            frissüljön. Így mindig teljes és naprakész.
          </p>
          <p className="m-0">
            Az osztályterem vagy a tanári szoba falára ott van a{" "}
            <strong>Tastenflow-plakát kifüggesztésre az iskolában</strong>: A3-as,
            álló, kinyomtatható - egy pillantásra megmutatja, mit tud a
            Tastenflow, és egy QR-kód is van rajta a tastenflow.org oldalhoz. A
            plakát magyar nyelvű. A kézikönyvvel ellentétben a plakát
            mindenkinek szabadon elérhető, bejelentkezés nélkül is: a tanulók a
            saját súgójukban találják meg, a cím pedig bármely iskolának és
            intézménynek továbbadható.
          </p>
          <PlakatLaden />
          <p className="m-0 text-sm text-ink-muted">
            Mindkettő megtalálható az „Osztályaim” részben is, a „Letöltések”
            alatt.
          </p>
        </Section>
      </div>
    </div>
  );
}
