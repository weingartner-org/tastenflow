/**
 * ★★★ O-HU (25.10.2026): DAS HILFE-FENSTER FÜR DIE LERNENDEN, UNGARISCH.
 * ===========================================================================
 * Aufbau wie `TippenHilfe.cs.tsx` (dieselben Abschnitte, `detail`-Stufen,
 * `isAdult`/`jugend`-Fälle), der INHALT nach der deutschen Grundfassung
 * `TippenHilfeDeutsch` - wo cs und de auseinandergehen, gilt de (Auftrag
 * O-HILFE). Ausnahmen, bewusst wie in allen Übersetzungen: kein
 * Einführungs-Podcast (es gibt keinen ungarischen), kein Absatz über die
 * deutschen Lektionen (Lektion 16 mit n), keine anderen Programme (die gibt
 * es nur auf Deutsch - Entscheidung Johannes 28.09.2026, siehe
 * `TippenHilfe.en.tsx`).
 *
 * ★ Gegenhand-Regel nach de: Die falsche Umschalttaste und die Feststelltaste
 * zählen als Fehler (`TypingSession.tsx`, „wrongShift", Rücknahme vom
 * 17.10.2026). cs/it/pl schreiben noch die ältere, mildere Fassung.
 *
 * ── ANREDE (Glossar `recherche-ungarisch-2026-10-25/GLOSSAR-hu.md`) ────────
 * Immer **te** - Kinder, Jugendliche UND Selbstlernende (Regel 1). Kein
 * grammatisches Geschlecht (Regel 2); die Lehrkraft heisst „tanár"
 * („a tanárod"). Tastennamen wie auf der Kappe (englisch, nur „szóköz" und
 * die Pfeile ungarisch), im Satz immer mit „billentyű" und ohne Endung am
 * Tastennamen (Regel 11). Keine Endung an Zahlen oder Namen (Regel 12), nach
 * einer Zahl Einzahl (Regel 13). Keine Zahl mit Punkt am Satzende (§4 Falle 4).
 *
 * ── DIE UNGARISCHE TASTATUR (`layouts.ts`, `hu`, `hu-101`, nur gelesen) ────
 *  · `hu` (Magyar, 105 Tasten, QWERTZ): Zahlenreihe `0 1 … 9 ö ü ó` - die 0
 *    links neben der 1, ö dort, wo sonst die 0 ist. ő ú rechts neben p,
 *    é á ű rechts neben l, í links neben y. Jeder Akzentbuchstabe hat eine
 *    eigene Taste, Grossform mit Shift. ; @ € und die Klammern über AltGr.
 *  · `hu-101` (QWERTY): í links neben der 1, die 0 ist AltGr + í; ű über der
 *    Eingabetaste.
 *
 * Fliesstext mit ungarischer Anführung „…” (U+201E/U+201D), nur Bindestrich,
 * keine Maus-Wörter.
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

// ★ O-HU (25.10.2026): das Wort der Tippchallenge (Glossar §2.3, Mehrzahl
// „Kihívások") - wie `VYZVA` in der tschechischen Hilfe. Steht hier, solange
// `schreibprobe.ts` kein ungarisches Wort hat.
const KIHIVAS = "Kihívás";
const KIHIVASOK = "Kihívások";

export function TippenHilfeUngarisch({ open, onClose, stufe, lernweg = "hu" }: TippenHilfeProps) {
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
  // Dasselbe Wort wie der Ring (Glossar §2.2: „játékszint" / „szint").
  const ringWort = kind ? "játékszint" : "szint";
  // Die gebeugten Formen ausgeschrieben (keine Endung an einer Variablen, Regel 12).
  const ringWortOn = kind ? "játékszinten" : "szinten";
  const ringWortVel = kind ? "játékszinttel" : "szinttel";
  // Nach einer Zahl Einzahl (Regel 13) - beide Formen gleich, der Aufruf bleibt (Glossar §2.11).
  const einstiegsMinuten = mehrzahl(EINSTIEGSFENSTER_MIN, "hu", {
    one: (z) => `${z} perc`,
    other: (z) => `${z} perc`,
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="A Tastenflow súgója"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        className="card my-8 w-full max-w-2xl space-y-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="m-0 text-xl font-semibold text-ink">Súgó - így működik a Tastenflow</h2>
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

        <RundgangNochmalKnopf onStart={onClose} />

        <Section title="Kezdj el gépelni">
          <p className="m-0">
            A gépelési mezőt nem kell előbb kiválasztanod. Egyszerűen kezdj el
            gépelni - az első betű már a mezőbe kerül. Ha éppen máshol vagy, az{" "}
            <Kbd>Alt</Kbd> + <Kbd>E</Kbd> billentyűparanccsal azonnal visszajutsz a
            gépelési mezőbe.
          </p>
          <JawsRueckweg weg="hu" />
          {detail === 1 && (
            <p className="m-0">
              Mindig a megfelelő ujjal gépelj - a lenti billentyűzet megmutatja,
              melyik billentyű következik. Ha kétszer gyorsan megnyomod a{" "}
              <Kbd>Shift</Kbd> billentyűt, meghallod, melyik ujjal kell gépelned.
            </p>
          )}
        </Section>

        <Section title="Ezek a jelek állnak a szövegben">
          <Zeichenerklaerung
            titel={null}
            zeichen={[
              { zeichen: "·", bedeutung: "két összetartozó adatot választ el - mint a vessző a mondatban." },
              { zeichen: "→", bedeutung: "utána, vagy: ez lesz belőle." },
              { zeichen: "⏱", bedeutung: "az idő, amennyit gyakoroltál." },
              {
                zeichen: "↵",
                bedeutung:
                  "a sor végén áll, ha az osztályod így állította be - ilyenkor a sort az Enter billentyűvel zárod le.",
              },
            ]}
          />
        </Section>

        <Section title="Gyűjts csillagokat 🌟">
          <p className="m-0">
            Minden kör után <strong>1-3 csillagot</strong> kapsz - és hozzá egy
            saját hangot.{" "}
            <strong>A kevés hiba sokkal többet számít, mint a sebesség:</strong> aki
            nyugodtan és pontosan gépel, biztosan kap csillagot - aki rohan és
            sokat elüt, az nem.
            {kind ? " Csillagot mindenki szerezhet!" : ""}
          </p>
          {detail >= 2 && (
            <p className="m-0">
              3 csillag egy igazán jó körért jár - pontosan és tisztes sebességgel
              gépelve, de a <strong>pontosság</strong> mindig fontosabb, mint a{" "}
              <strong>gyorsaság</strong>. Ha egy ideig jó köröket gépelsz, feljebb
              léphetsz egy <strong>nehézségi szintet</strong> - akkor a jutalom
              hangja is egy kicsit másképp szól.
            </p>
          )}
        </Section>

        <Section title="Gyűjts jelvényeket 🏅">
          <p className="m-0">
            Különleges sikerekért <strong>jelvényeket</strong> kapsz - például egy
            teljesen hibátlan körért vagy három egymás utáni tiszta körért. Új
            jelvénynél felcsendül egy saját <strong>„tadaa”</strong>, és
            elhangzik a jelvény neve.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Minden jelvény a <strong>„Fejlődésem”</strong> részben látható,
              közvetlenül a heti célok és az értékeid után - ott mindig látszik a{" "}
              <strong>következő cél</strong> is (például: még 2 hibátlan kör a
              következő jelvényig). A legtöbb jelvény a <strong>pontos
              gépelésért</strong> és a <strong>kitartásért</strong> jár - nem a
              rohanásért. Néhány pedig <strong>titkos</strong>: a feltételük sehol
              sincs leírva, egyszer csak megjelennek!
            </p>
          )}
          {detail >= 2 && (
            <p className="m-0">
              Ott látod a <strong>pontszámodat</strong> is: a pontosságot és a
              sebességet egyetlen számban foglalja össze 0 és 100 között - egy
              elütés annyit számít, mint 5 karakter, a kétszeres sebesség pedig
              csak 1,4-szer annyit. A pontosság tehát többet ér a sebességnél.
            </p>
          )}
          {detail >= 2 && (
            <p className="m-0">
              Lejjebb a „Fejlődés az időben” (lenyitható sor) egy kis görbét
              mutat. Teljesen rendben van, ha a görbe nem csak felfelé megy. Amikor
              új billentyűk jönnek, többnyire előbb lejjebb megy - főleg a Shift
              billentyűnél és a számjegyeknél.
            </p>
          )}
          <p className="m-0">
            Tipp: válassz ki egy jelvényt a Fejlődésem részben, és nyomd meg az{" "}
            <Kbd>Enter</Kbd> billentyűt - a jelvény <strong>nagyban</strong>{" "}
            jelenik meg, csillogással és konfettivel.
          </p>
        </Section>

        {skin === "jugend" && (
          <Section title="Egy új billentyű után">
            <p className="m-0">
              Egy <strong>új billentyű</strong> a tiéd, amint az eddigiek
              biztosan mennek - ehhez semmit sem kell megnyerned. Egy kis
              ünneplés jön, aztán folytatódik a gyakorlás. Más nem történik.
            </p>
            <p className="m-0">
              Ha szeretnéd, utána jöhet egy rövid játék: a{" "}
              <strong>Jégtáblák</strong>. Ezt te magad állítod be - a{" "}
              <strong>Beállítások</strong> között (<AltText>Alt + O</AltText>), a{" "}
              <strong>Jutalomjáték</strong> résznél. Alapból a{" "}
              <strong>Nincs</strong> van kiválasztva. A beállítás erre az eszközre
              érvényes.
            </p>
          </Section>
        )}

        {!isAdult && (
          <Section title="A Jégtáblák játék 🐧">
            {skin === "jugend" ? (
              <>
                <p className="m-0">
                  <strong>Bármikor elindíthatod</strong> - a gépelési mező alatti
                  állapotsorban lévő <strong>🐧 Játék</strong> gombbal. A pingvin
                  jégtábláról jégtáblára ugrik, felmászik a betűhegyre, és hason
                  csúszik le - mindig azokkal a billentyűkkel, amelyek most a
                  legnehezebbek neked. Útközben <strong>bónuszhalak</strong>{" "}
                  ugranak fel (időben megnyomott billentyű = elkapott hal; egy
                  elszalasztott hal sosem hiba), a{" "}
                  <strong>Visszhangbarlangban</strong> pedig minden billentyűt csak
                  bemond a program. A játék <strong>nem</strong> számít bele a
                  gyakorlási időbe, és nem feltétele az új billentyűknek - de saját
                  jelvényei vannak.
                </p>
                <p className="m-0">
                  Egy új billentyű után <strong>csak akkor</strong> indul el
                  magától, ha a Beállításokban{" "}
                  <strong>Jutalomjátéknak</strong> választottad. Egyébként semmi
                  sem szakít félbe - te döntöd el, mikor játszol.
                </p>
              </>
            ) : (
              <>
                <p className="m-0">
                  Ha sikerült egy <strong>új billentyű</strong>, ünneplésként a
                  Jégtáblák játék vár: segíts a pingvinnek átjutni a vízen - mindig
                  azt a billentyűt nyomd meg, amelyik a következő jégtáblán áll!
                  Néha utána még a <strong>betűhegyre</strong> is fel kell mászni,
                  és hason lecsúszni. Az új billentyű már előtte a tiéd - a játék
                  jutalom, nem kötelező.
                </p>
                <p className="m-0">
                  A játékot <strong>bármikor el is indíthatod</strong> - a{" "}
                  <strong>🐧 Játék</strong> gombbal fent a gyakorlókártyádon, közvetlenül
                  a kör mellett. Ez a nagy <strong>kaland</strong>: minden nap egy
                  kicsit másképp néz ki, útközben <strong>bónuszhalak</strong>{" "}
                  ugranak fel (gyorsan nyomd meg a billentyűjüket, és elkaptad
                  őket!), a <strong>Visszhangbarlangban</strong> pedig nem látsz
                  betűket -{" "}
                  {hoehleMitWesen ? (
                    <>
                      a barlang <strong>bemondja</strong> neked az összes billentyűt.
                    </>
                  ) : (
                    <>
                      minden billentyű hangként szól, és a képernyőolvasó vagy a
                      Braille-kijelző <strong>megmondja</strong>, melyik az.
                    </>
                  )}{" "}
                  A játék csak szórakozás, és <strong>nem</strong> számít bele a
                  gyakorlási időbe - de saját jelvényeket hoz!
                </p>
                {detail >= 2 && (
                  <p className="m-0">
                    Semmi baj: ha elsüllyed egy jégtábla, vagy megcsúszol a hegyen,
                    a pingvin egyszerűen visszaúszik - rögtön újra próbálhatod,
                    ahányszor csak akarod. Aki pedig az egész kalandot egyetlen
                    csobbanás nélkül végigjárja, az iglunál táncolni látja a{" "}
                    <strong>sarki fényt</strong>!
                  </p>
                )}
              </>
            )}
          </Section>
        )}

        <Section title="Mit jelent a kör a számmal?">
          <p className="m-0">
            A körben álló szám azt mutatja, melyik <strong>{ringWortOn}</strong> tartasz most.{" "}
            <strong>{kind ? "Az XP a gyakorlásért járó pont:" : "A pontokat a gyakorlásért kapod:"}</strong>{" "}
            minden körért kapsz néhányat, és a kör megtelik. Ha tele van (100 pont),
            feljebb lépsz egy {ringWortVel}. Ez csak gyűjtögetés, és a gyakorlást{" "}
            <strong>nem</strong> teszi nehezebbé - olyan, mint a pontok egy
            játékban.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Ne keverd össze a <strong>nehézségi szinttel (1-50)</strong>: az azt
              mutatja, milyen gyorsan kell gépelned, és{" "}
              <strong>magától</strong> igazodik hozzád - feljebb megy, ha jól
              megy, és könnyebb lesz, ha nehéz.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0">
              A <strong>„Szövegek”</strong> beállítás pedig csak azt határozza
              meg, milyen nehezek a szavak és a mondatok - az életkorhoz igazítva.
              Egy osztályban ezt a tanárod állítja be mindenkinek; osztály nélkül
              fent a Beállítások ⚙ között találod. Tehát három különböző dolog:{" "}
              <em>{ringWort}</em> = pontok, <em>nehézségi szint</em> = elvárt
              sebesség, <em>Szövegek</em> = életkor.
            </p>
          )}
        </Section>

        <Section title={detail === 1 ? "Milyen gyakran gyakorolj?" : "Gyakorlási idő és heti cél"}>
          {detail === 1 ? (
            <p className="m-0">
              Inkább <strong>gyakran egy keveset</strong> gyakorolj, mint egyszer
              nagyon sokáig - például több napon át néhány percet. A gépelési mező
              alatti állapotsorban egy óra méri, mennyit gépeltél ma; pontosan ez
              az idő tölti meg ott a <strong>kört</strong> is - ez a heti célod.
            </p>
          ) : (
            <p className="m-0">
              Fiókkal lehet <strong>heti célod</strong>: ennyi{" "}
              <strong>perc hetente</strong>. Egy osztályban a tanárod állítja be;
              osztály nélkül magad is megadhatod a Beállítások ⚙ között, a „Heti
              célom” résznél - az új cél a következő hétfőtől érvényes. A hét{" "}
              <strong>hétfőn 8:00-kor</strong> kezdődik, és a következő hétfőig
              tart. A gépelési mező alatti állapotsorban <strong>körként</strong>{" "}
              látod, hol tartasz, például „25/60 perc” - ha a hetet teljesítetted,
              a kör tele van, és egy pipa jelenik meg benne. Néha egy korábbi
              hétről elmaradt percek is vannak, amelyeket{" "}
              <strong>pótolni</strong> lehet; ilyenkor mellette áll, mennyi. Ha
              elérted a heti célt, egy rövid ablak gratulál - utána bármikor
              tovább gyakorolhatsz, ha kedved van.
            </p>
          )}
        </Section>

        <Section title="Beállítások: a fogaskerék ⚙ a fejlécben">
          <p className="m-0">
            Minden beállítás a <strong>⚙ Beállítások</strong> gomb mögött van,
            egészen fent, közvetlenül a neved kezdőbetűjét mutató kerek jel
            bal oldalán:{" "}
            <strong>Mit gyakorolsz?</strong>, <strong>Szövegek</strong> (életkor és
            nyelv), <strong>Billentyűzet</strong>, <strong>Hang</strong> és{" "}
            <strong>Felolvasás</strong>. Egy nyomásra kinyílik, még egyre bezárul -
            vagy az <Kbd>Alt</Kbd> + <Kbd>O</Kbd> billentyűparanccsal, ez gépelés
            közben is működik. Kinyitáskor a kurzor rögtön a beállításokhoz ugrik,
            bezáráskor vissza a gépelési mezőbe.
          </p>
          <p className="m-0">
            A Beállítások legtetején áll a <strong>„Mit gyakorolsz?”</strong>: a
            három út, a <strong>Saját gyakorlás</strong>, a{" "}
            <strong>Történetek</strong> és a <strong>Szójátékok</strong>. Az{" "}
            <Kbd>Alt</Kbd> + <Kbd>B</Kbd> billentyűparancs sorban a következő útra
            vált, és a program bemondja az új utat.
          </p>
          <p className="m-0">
            A fejlécben lévő kerek nyelvválasztó gomb a Tastenflow nyelvét
            állítja át - a gombokat, a menüket és rögtön a gyakorló szövegeket is.
            A szövegek nyelvét utána a <strong>Szövegek</strong> résznél külön is
            megváltoztathatod, kivéve, ha a tanárod rögzítette.
          </p>
          <p className="m-0">
            A <strong>Billentyűzet</strong> résznél azt a billentyűzetet
            választod ki, amelyik valóban előtted van. Magyarországon ez
            többnyire a <strong>Magyar (QWERTZ)</strong>; van, akinek{" "}
            <strong>Magyar (101 billentyűs, QWERTY)</strong> billentyűzete van,
            amelyen az Y és a Z úgy áll, mint az angol billentyűzeten. Ezután a
            képernyő-billentyűzet és az ujjakra vonatkozó bemondások is
            stimmelnek - és csak olyan jelek jönnek, amelyek ezen a billentyűzeten
            megvannak. A legfontosabb tudnivalók a magyar billentyűzetről:
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              A számsor bal szélén a <strong>0</strong> áll, az 1 előtt. Ahol más
              billentyűzeten a 0 van, ott az <strong>ö</strong> található, utána
              az <strong>ü</strong> és az <strong>ó</strong>. A 101 billentyűs
              változaton az 1 előtt az <strong>í</strong> áll, a 0-t pedig az{" "}
              <Kbd>AltGr</Kbd> billentyűvel és ezzel a billentyűvel írod.
            </li>
            <li>
              Minden ékezetes betűnek <strong>saját billentyűje</strong> van: az{" "}
              <strong>ő</strong> és az <strong>ú</strong> a P mellett jobbra, az{" "}
              <strong>é</strong>, az <strong>á</strong> és az <strong>ű</strong> az
              L mellett jobbra, az <strong>í</strong> az Y mellett balra. A
              nagybetűt a <Kbd>Shift</Kbd> billentyűvel kapod.
            </li>
            <li>
              Az <strong>o, ó, ö, ő</strong> és az <strong>u, ú, ü, ű</strong>{" "}
              mind különböző betűk - ezért a program pontosan azt várja, amelyik a
              szövegben áll. Ugyanez igaz például az a és az á betűre is.
            </li>
            <li>
              Az olyan jeleket, mint a ; @ € és a zárójelek, az <Kbd>AltGr</Kbd>{" "}
              billentyűvel (jobb oldali Alt) írod. Macen helyette az{" "}
              <Kbd>Option</Kbd> billentyűt nyomod meg.
            </li>
          </ul>
          <p className="m-0">
            Itt van a <strong>„Gépelés egy kézzel”</strong> is - mindenkinek, aki
            egy kézzel gépel: ilyenkor a nagybetűk és a különleges jelek bármelyik
            Shift billentyűvel érvényesek. Egy osztályban ezt a tanárod állítja be.
          </p>
          <p className="m-0">
            A <strong>„Nagyobb betűköz (CVI)”</strong> beállítással gépelés közben
            minden elsötétül, kivéve azt a mezőt, amelyben éppen gépelsz
            (gyakorlósor vagy játéktér); 5 másodperc gépelés nélkül újra
            világos lesz. A gyakorlósor közben a gépelésed ütemében siklik
            tovább, nem ugrál. A betűközt a Beállítások ⚙ között bármikor magad
            is beállíthatod - egy osztályban a tanárod is beállíthatja; az
            érvényes, amit utoljára választottak.
          </p>
          <p className="m-0">
            A <strong>Célzott gyakorlással</strong> legfeljebb 8 billentyűt vagy karaktert választhatsz, amelyek különösen gyakran szerepelnek a körökben - a beállításokban a <strong>Mit gyakorolsz?</strong> csoportban, vagy <Kbd>Alt</Kbd> + <Kbd>2</Kbd> billentyűkkel. Osztályban ezt a tanárod állítja be.
          </p>
        </Section>

        <Section title="Felolvasás - a program felolvas">
          <p className="m-0">
            A <strong>🗣 Felolvasás</strong> gombbal (vagy az <Kbd>Alt</Kbd> +{" "}
            <Kbd>V</Kbd> billentyűparanccsal) a program felolvas - mindenkinek,
            aki (még) nem használ képernyőolvasót. Fent a Beállítások ⚙ között
            kiválaszthatod, hogy a program a <strong>betűket</strong>, a{" "}
            <strong>szavakat</strong> és/vagy a <strong>mondatokat</strong> olvassa
            fel, és milyen gyorsan.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              A <strong>„Hang”</strong> résznél másik hangot választhatsz. Ha a
              nyelv <strong>magyar</strong>, a program magától magyar hangot keres;
              ha nincs ilyen telepítve, egy rövid útmutató mutatja meg, hogyan
              adhatsz hozzá egyet.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0">
              A sebesség miatt ne aggódj: a{" "}
              <strong>felolvasás idejét a program levonja</strong> - a
              bemondásra való várakozás nem lassítja a sebességedet.
            </p>
          )}
        </Section>

        <Section title="Dallam gépelés közben 🎵">
          <p className="m-0">
            A <strong>dallam gépelés közben</strong> arra való, hogy{" "}
            <strong>egyenletes gépelési ritmust</strong> gyakorolj - és{" "}
            <strong>szórakoztató</strong> is legyen. Minden helyes billentyű egy
            dal következő hangját szólaltatja meg; aki tartja az ütemet, még egy
            zenekart is kap hozzá.
          </p>
          <p className="m-0">
            Aki egyenletesen gépel, a gyengébb billentyűknél is folyékonyabb
            lesz: a ritmus átsegít azokon a helyeken, ahol egyébként megakadna.
          </p>
          <p className="m-0">
            Az <Kbd>Alt</Kbd> + <Kbd>6</Kbd> billentyűparanccsal, a Beállítások ⚙
            között vagy a fenti kerek hangszóró gomb menüjében kapcsolhatod be -
            ott csúszkákkal minden hang hangerejét is beállíthatod. A hangzást
            az <Kbd>Alt</Kbd> + <Kbd>7</Kbd> és az <Kbd>Alt</Kbd> + <Kbd>8</Kbd>{" "}
            billentyűparanccsal változtathatod.
          </p>
        </Section>

        <Section title="Nagybetűk és írásjelek">
          <p className="m-0">
            A magyarban <strong>nagybetűvel</strong> kezdjük a mondatot és a
            tulajdonneveket (Anna, Budapest, Balaton). A Tastenflow ezeket{" "}
            <strong>mindig helyesen</strong> írja, így soha nem látsz rosszul
            leírt szót.
          </p>
          <p className="m-0">
            <strong>Az elején egészen könnyű:</strong> egyszerűen gépeld be a{" "}
            <strong>kisbetűt</strong> - a <strong>nagybetű</strong> magától
            megjelenik. A <Kbd>Shift</Kbd> billentyűt ehhez még{" "}
            <strong>nem</strong> kell tudnod.
          </p>
          <p className="m-0">
            <strong>Hamarosan</strong>, az első betűk után{" "}
            <strong>igazából</strong> is megtanulod a <Kbd>Shift</Kbd>{" "}
            billentyűt: az <strong>egyik</strong> kezeddel lenyomva tartod, a
            betűt pedig a <strong>másikkal</strong> gépeled - ahogy minden
            billentyűzeten. Így hamarosan <strong>magad</strong> írod a
            nagybetűket, nem csak az automatikus segítséget használod.
          </p>
          <div className="rounded-lg border border-hairline bg-surface-raised p-3">
            <p className="m-0">
              <strong>Fontos - mindig a MÁSIK kéz Shift billentyűje:</strong> két
              Shift billentyű van, egy bal és egy jobb oldali. A betűt az egyik
              kezeddel gépeled, a <Kbd>Shift</Kbd> billentyűt a{" "}
              <strong>másik</strong> kezeddel tartod. Így egyik kéznek sem kell
              két billentyűt egyszerre lenyomnia.
            </p>
            <p className="m-0 mt-2">
              Példa: nagy <strong>A</strong> (bal kéz) →{" "}
              <strong>jobb oldali</strong> <Kbd>Shift</Kbd>. Nagy{" "}
              <strong>K</strong> (jobb kéz) → <strong>bal oldali</strong>{" "}
              <Kbd>Shift</Kbd>.
            </p>
            <p className="m-0 mt-2">
              A Tastenflow <strong>csak a helyes</strong> Shift billentyűt fogadja
              el. Ha a <strong>rossz oldali</strong> Shift billentyűt vagy a{" "}
              <Kbd>Caps Lock</Kbd> billentyűt használod, az{" "}
              <strong>hibának</strong> számít - így kezdettől a helyes kezet
              gyakorolod.
            </p>
          </div>
          {detail >= 2 && (
            <p className="m-0 text-sm text-ink-muted">
              Tipp: nyomd meg <strong>kétszer gyorsan</strong> a <Kbd>Shift</Kbd>{" "}
              billentyűt - a program bemondja, melyik ujjal tartsd.
            </p>
          )}
          <p className="m-0">
            <strong>A pont, a vessző és a kérdőjel</strong> csak akkor jelenik
            meg, amikor már megtanultad őket. Addig a mondatot egyszerűen{" "}
            <strong>nélkülük</strong> olvasod - ez szándékos, nem hiba.
          </p>
        </Section>

        <Section title="Milyen sorrendben jönnek a betűk?">
          <p className="m-0">
            Az új billentyűk mindig ugyanabban a sorrendben jönnek: először az{" "}
            <strong>alapállás</strong>, aztán gyakoriság szerint a többi betű.
            Hogy melyik billentyű következik, mindig látod jobb oldalt a gépelési
            mező alatti állapotsorban: <strong>„Következő billentyű”</strong>.
          </p>
          <div className="flex flex-wrap gap-1" aria-hidden="true">
            {letters.map((ch) => (
              <Kbd key={ch}>{unitGlyph(ch)}</Kbd>
            ))}
          </div>
          <p className="m-0 text-sm text-ink-muted">
            Már <strong>az első betűk után</strong> jönnek a{" "}
            <strong>nagybetűk</strong> (Shift billentyű), és rögtön utánuk a{" "}
            <strong>pont és a vessző</strong> - a mondat nagybetűvel kezdődik, és
            ponttal végződik. Aztán a többi betű. Végül jönnek a többi{" "}
            <strong>írásjelek</strong> (- ? ! : ;), a <strong>számjegyek</strong>{" "}
            és a <strong>szimbólumok</strong>.
          </p>
        </Section>

        {detail >= 2 && (
          <Section title="Így épül fel a „Saját gyakorlás”">
            <p className="m-0">
              <strong>Hozzád igazodik.</strong> A program megjegyzi, mely
              billentyűk bizonytalanok még, és éppen azokat gyakoroltatja. Új
              billentyű csak akkor jön, ha a többi már biztosan megy. A{" "}
              <strong>leggyakoribb</strong> betűk jönnek először - így már néhány
              billentyű után <strong>igazi szavakat és mondatokat</strong>{" "}
              gépelsz, és az első <strong>történetek</strong> is korán
              megnyílnak.
            </p>
          </Section>
        )}

        <Section title="Az állapotsor a gépelési mező alatt">
          <p className="m-0">
            A gépelési mező alatt egy keskeny állapotsor áll, négy adattal: a{" "}
            <strong>szinted</strong>, a ma gyakorolt <strong>idő</strong>, a{" "}
            <strong>heti cél</strong> és a <strong>következő billentyű</strong>. A
            heti célnál a kör azt mutatja, hány <strong>percet</strong>{" "}
            gyakoroltál már ezen a héten - például „25/60 perc”; egy{" "}
            <strong>pipa</strong> azt jelenti: a hét teljesítve. A következő
            billentyű <strong>magától</strong> megnyílik, amint az eddigiek
            biztosan mennek - egyszerűen gyakorolj tovább.
          </p>
          <p className="m-0">
            Az állapotsor <strong>mindig</strong> látható - gépelés közben is. Így
            semmi sem ugrál, és bármikor látod, mennyit gyakoroltál már.
          </p>
          <p className="m-0">
            Az <Kbd>Alt</Kbd> + <Kbd>D</Kbd> bemondja a gyakorlási időt és a heti
            célt. Hogy mely billentyűk mennek már biztosan, melyek még nem, és
            melyik következik, azt a <strong>„Fejlődésem”</strong> részben, a{" "}
            <strong>„Billentyűk állapota”</strong> alatt találod (<Kbd>Alt</Kbd> +{" "}
            <Kbd>S</Kbd>, fiókkal).
          </p>
        </Section>

        <Section title="A könyvtár: „Történetek és érdekességek” 📖">
          <p className="m-0">
            A Saját gyakorlás mellett van még egy út: a{" "}
            <strong>Történetek</strong> - a Beállítások ⚙ között, a{" "}
            <strong>„Mit gyakorolsz?”</strong> résznél. Ott egész történetek és
            ismeretterjesztő sorozatok várnak - nem egyes mondatok, hanem{" "}
            <strong>egy történet sok körön át</strong>. Minden rész tizenkét sor;
            utána legközelebb pontosan ott folytatod, ahol abbahagytad.
          </p>
          <p className="m-0">
            Csak az jelenik meg, amit a már megtanult billentyűkkel valóban le
            tudsz gépelni - ezért az elején még lakatok látszanak. Maguktól
            kinyílnak, amint elég billentyű biztosan megy. Minden sor{" "}
            <strong>csak egyszer</strong> jön: amit már begépeltél, az nem tér
            vissza ismétlésként.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              <strong>A vezérfonal:</strong> amit egy ismeretterjesztő sorozatban
              elolvastál, később a gyakorlásban még egyszer előkerül - előbb{" "}
              <strong>kérdésként, más szavakkal</strong>, aztán egy kis
              elmélyítésként, végül egy odaillő viccként. Így megmarad, amit
              megtanultál, anélkül hogy feleltetésnek tűnne.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0 text-sm text-ink-muted">
              A lista alatt áll a „Források és köszönet” rész: ott látod, honnan
              származnak a szövegek. Néhányat kifejezetten ehhez a programhoz
              írtak, mások szabadon felhasználható forrásokból származnak - ezeket
              ott név szerint feltüntetjük, ahogy illik.
            </p>
          )}
        </Section>

        <Section title="Honnan származnak a szövegek? 🤖">
          <p className="m-0">
            A program saját szövegeit, vagyis a gyakorló mondatokat, a vicceket
            és a történeteket Johannes <strong>mesterséges intelligencia (MI)
            segítségével írta</strong>, utána pedig maga olvasta el és
            ellenőrizte. A más forrásokból származó szövegek (például a
            Wikipédiából) a forrás nevével szerepelnek a „Források és köszönet”
            részben.
          </p>
          <p className="m-0">
            {hoehleMitWesen ? (
              <>
                A Sarki expedíció éneklő hala és dörmögő barlanglakója is{" "}
                <strong>számítógépes hang</strong>, nem igazi ember.
              </>
            ) : (
              <>
                A Sarki expedíció éneklő hala is <strong>számítógépes hang</strong>,
                nem igazi ember.
              </>
            )}{" "}
            A felolvasás (🗣) az eszközöd felolvasó hangját használja.
          </p>
        </Section>

        <Section title={KIHIVAS}>
          <p className="m-0">
            Néha a tanárod <strong>Kihívást</strong> indít - az egész osztálynak.{" "}
            <strong>Mindenki ugyanazt a szöveget kapja</strong>, és mindenkinek
            ugyanannyi ideje van.
          </p>
          <p className="m-0">
            <strong>Az idő csak az első billentyűleütésedtől fut</strong> - nem
            már akkor, amikor a tanárod elindítja. Az indítástól számítva{" "}
            <strong>{einstiegsMinuten}</strong> áll rendelkezésedre, hogy
            elkezdd.
          </p>
          <p className="m-0">
            <strong>Miről ismered fel:</strong> a gépelési mező fölött a{" "}
            <strong>{KIHIVAS}</strong> szó áll, mellette az idő, és az egész
            terület körül más, <strong>szaggatott keret</strong> van. Amint lejár
            az idő, mindkettő eltűnik.
          </p>
          <p className="m-0">
            <strong>Mennyi idő van még hátra, odanézés nélkül:</strong> az{" "}
            <Kbd>Alt</Kbd> + <Kbd>X</Kbd> megmondja. Az óra magától csak néhányszor
            szólal meg, egyébként csendben marad.
          </p>
          <p className="m-0">
            <strong>A Braille-kijelző nyugton marad.</strong> Az idő{" "}
            <strong>nem</strong> ketyeg a kijelzőn: fent fut, de soha nem csúszik
            bele abba, amit éppen olvasol.
          </p>
          <p className="m-0">
            <strong>Néha a Kihívás „Szabad gépelés”.</strong> Ilyenkor a gépelési
            hiba egyszerűen ott marad - semmi sem jelöli, és hang sem jelzi. A{" "}
            <Kbd>Backspace</Kbd> billentyű csak az aktuális sorban javít; a kész
            sor úgy marad, ahogy van. A sor végén az utolsó szó után megnyomhatod
            a szóköz billentyűt - vagy ha az osztálynál be van kapcsolva a „Sor
            vége az Enter billentyűvel”, az <Kbd>Enter</Kbd> billentyűt. Hogy a
            végén mi maradt hibás, azt csak az utána következő összesítés mutatja
            meg, olvasható listaként.
          </p>
          <p className="m-0">
            <strong>Korábbi befejezés:</strong> az <Kbd>Esc</Kbd> rákérdez. A{" "}
            <strong>„Gépelés tovább”</strong> (az <Kbd>Esc</Kbd> is) visszavisz a
            sorba, a <strong>„Beadás”</strong> beadja a Kihívást - az számít,
            amit addig begépeltél. Ugyanezt teszi rákérdezés nélkül a mező alatti{" "}
            <strong>„Kész - beadás”</strong> gomb.
          </p>
          <p className="m-0">
            <strong>Amikor lejár az idő,</strong> rögtön megjelenik az
            összesítésed: leütés percenként, pontosság, karakterek, hibák, sorok
            és a bizonytalan billentyűk. Minden Kihívás ezután megmarad a{" "}
            <strong>„Fejlődésem”</strong> részben, a <strong>{KIHIVASOK}</strong>{" "}
            alatt - ott bármikor újra elolvashatod.
          </p>
        </Section>

        <Section title="Az Osztályverseny ⚔️">
          <p className="m-0">
            Az Osztályversenyen <strong>öt percig versenyt gépelsz</strong> az
            osztálytársaiddal. Osztályverseny csak egy osztályban van,
            és csak akkor, ha a tanárod engedélyezte.
          </p>
          <p className="m-0">
            <strong>Meghirdetés:</strong> <Kbd>Alt</Kbd> + <Kbd>M</Kbd>, vagy a
            gépelési mező fölötti sorban az <strong>⚔️ Osztályverseny</strong>{" "}
            gomb - közvetlenül a <strong>🐧 Játék</strong> mellett. Ekkor a többieknél
            megnyílik egy ablak: <strong>„Benne vagyok!”</strong> vagy{" "}
            <strong>„Most nem”</strong>. Az <Kbd>Esc</Kbd> visszavisz a
            gyakorláshoz, és ugyanaz a meghívó magától nem jön vissza.
          </p>
          <p className="m-0">
            <strong>Ha valaki már meghívott,</strong> az <Kbd>Alt</Kbd> +{" "}
            <Kbd>M</Kbd> ezt a meghívót hozza újra elő - második verseny csak
            akkor indulhat, ha az első már fut. Ha ketten szinte egyszerre hívnak
            meg, az a meghívó érvényes, amelyik előbb érkezett.
          </p>
          <p className="m-0">
            <strong>Ha éppen nem lehet:</strong> ha már te magad is egy
            versenyben vagy, a gomb neve <strong>„⚔️ Osztályverseny folyamatban”</strong>{" "}
            - és az <Kbd>Alt</Kbd> + <Kbd>M</Kbd> is ugyanezt mondja. Az osztály
            más versenyei nem zavarnak: akárhány futhat egyszerre.
          </p>
          <p className="m-0">
            <strong>Mindenki a saját szintjén gépel.</strong> Aki már tanulta a
            számjegyeket, számjegyeket kap; aki az alapsornál tart, az alapsort
            kapja. Az elütésnek ára van - egy elütés öt karakternek számít.
          </p>
          <p className="m-0">
            <strong>Hogy áll a verseny, odanézés nélkül:</strong> a gépelési sor
            bal szélén mindig nyolc cella áll: a <strong>P2</strong> a helyezés,
            mellette a hátralévő idő. Az <Kbd>Alt</Kbd> + <Kbd>X</Kbd> megmondja
            a helyezést, az időt és az első hármat. Magától semmi sem szólal meg -
            a Braille-kijelző nyugton marad.
          </p>
          <p className="m-0">
            <strong>Korábbi befejezés:</strong> az <Kbd>Esc</Kbd> vagy a{" "}
            <strong>„Kilépés”</strong> gomb rákérdez. A{" "}
            <strong>„Gépelés tovább”</strong> (az <Kbd>Esc</Kbd> is) visszavisz a
            sorba. A <strong>„Kilépés”</strong> csak neked fejezi be a versenyt -
            a többiek tovább gépelnek, és látják, amit addig begépeltél.
          </p>
          <p className="m-0">
            <strong>A verseny beleszámít a gyakorlási idődbe</strong>, és új
            billentyűt is feloldhat - pont úgy, mint egy szokásos gyakorlókör.{" "}
            <strong>A helyezést a program nem menti.</strong> A végén megjelenik a
            lista: Kupa, Ezüst és Bronz az első háromnak, mindenki más a saját
            számával. Utána a <strong>„Gyakorlás tovább”</strong> gombbal vagy az{" "}
            <Kbd>Esc</Kbd> billentyűvel jutsz vissza.
          </p>
        </Section>

        <Section title="Fontos billentyűk">
          <p className="m-0 text-sm text-ink-muted">
            <AltOderWahl>
              Macen az <Kbd>Alt</Kbd> billentyű helyett az <Kbd>⌥</Kbd> (Option)
              billentyűt nyomod meg.
            </AltOderWahl>
          </p>
          <ul className="m-0 list-none space-y-2 p-0">
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Esc</Kbd>
              </span>
              <span>
                <strong>A legfontosabb billentyű:</strong> minden ablakot bezár, és
                a kurzor utána <strong>mindig a gépelési mezőben</strong> áll. Akkor
                is visszaviszi oda, ha semmi sincs megnyitva. Az egyetlen kivétel a
                Billentyűk felfedezése: ott az <Kbd>Esc</Kbd> is egy felfedezhető
                billentyű, és csak a második nyomásra lépsz ki.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Shift</Kbd> <Kbd>Shift</Kbd>
              </span>
              <span>Kétszer gyorsan megnyomva: a program bemondja a helyes ujjat.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>E</Kbd>
              </span>
              <span>Ugrás a gépelési mezőbe.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>U</Kbd>
              </span>
              <span>Váltás a gyakorlásra.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>S</Kbd>
              </span>
              <span>
                Megnyitja a Fejlődésem részt (tanároknál: Osztályaim). Ehhez be kell
                jelentkezned. Még egy nyomás visszavisz a gépelési mezőbe.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>Z</Kbd>
              </span>
              <span>Bemondja, hányadik sornál tartasz.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>D</Kbd>
              </span>
              <span>
                Megmondja a gyakorlási időt - a Braille-kijelzőn és (felolvasással)
                hangosan is.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>L</Kbd>
              </span>
              <span>Bemondja, melyik {ringWortOn} tartasz most.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>3</Kbd>
              </span>
              <span>
                <strong>Billentyűk felfedezése:</strong> minden billentyűt, amelyet
                megnyomsz, a program bemond és nagyban megmutat - először a
                rövidítést, aztán a nevet, aztán azt, hogy mit csinál (például „Tab -
                tabulátor - elemről elemre ugrik”). Ez minden különleges billentyűre
                és írásjelre is érvényes, az AltGr billentyűvel (Macen: Option)
                írható jelekre az odavezető úttal együtt, és az olyan
                billentyűparancsokra is, mint a Ctrl + C - azzal együtt, hogy mit
                csinálnak. A Tastenflow saját billentyűparancsai (<AltText>Alt + H, Alt + V ...</AltText>) továbbra is működnek. A képernyő-billentyűzet megmutatja,
                melyik billentyűt nyomtad meg. Ha a felolvasás ki van kapcsolva, a
                hang csendben marad. A Braille-kijelzőn a magyarázat a következő
                billentyűig ott marad, és a görgetőgombokkal végig elolvasható; a
                képernyőn egy ablakban áll. Nem íródik be semmi, és semmi sem
                vész el. <strong>Kilépés:</strong> még egyszer <Kbd>Alt</Kbd> +{" "}
                <Kbd>3</Kbd>, kétszer <Kbd>Esc</Kbd> - vagy egyszerűen töltsd újra
                az oldalt.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>4</Kbd>
              </span>
              <span>
                <strong>Billentyűk keresése:</strong> a program megnevez egy
                billentyűt, te pedig megkeresed. Az első találatnál a program
                megdicsér, és megkér, hogy nyomj meg egy másik billentyűt, aztán
                még egyszer ezt - csak a második nyomás számít, és csak akkor, ha
                közben egy másik billentyű volt. Aztán jön a következő billentyű.
                Egy másik billentyűt a program csak megnevez. Az ablakban az{" "}
                <Kbd>Alt</Kbd> + <Kbd>4</Kbd> vált a felfedezés és a keresés
                között. <strong>Kilépés:</strong> ugyanúgy, mint a felfedezésnél.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>K</Kbd>
              </span>
              <span>
                <strong>Színek és kontraszt:</strong> hét színvilág - világos,
                sötét, fekete sárgán, sárga kéken és még több. Mindegyik már a
                listában a saját színeiben jelenik meg, így előre látod, hogyan néz
                ki.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>T</Kbd>
              </span>
              <span>A billentyűparancsok listájának megnyitása vagy bezárása.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>N</Kbd>
              </span>
              <span>A tanár üzeneteinek megnyitása vagy bezárása.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>+</Kbd> / <Kbd>-</Kbd>
              </span>
              <span>A gépelési mező nagyítása vagy kicsinyítése.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>V</Kbd>
              </span>
              <span>A felolvasás be- vagy kikapcsolása.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>H</Kbd>
              </span>
              <span>Ennek a súgónak a megnyitása vagy bezárása.</span>
            </li>
            <WeitereTasten />
          </ul>
        </Section>

        {detail >= 3 && (
          <Section title="Így segít téged a program">
            <p className="m-0">
              A program minden betűt külön mér - milyen pontosan és milyen gyorsan
              gépeled. Magától a leggyengébbeket gyakoroltatja, és új betűt csak
              akkor old fel, ha az eddigiek már biztosan mennek. Így alakul ki a
              saját tanulási utad.
            </p>
            <p className="m-0">
              A nehézségi szint (1-50) gondoskodik róla, hogy a gyakorlás mindig{" "}
              <strong>kihívást jelentsen, de teljesíthető legyen</strong>: ha jól
              megy, feljebb megy; ha túl nehéz, újra lejjebb. A{" "}
              <strong>„Fejlődésem”</strong> részben mindent látsz a haladásodról -
              azt is, hogyan fejlődsz.
            </p>
          </Section>
        )}

        <Section title="Gyakorlás osztály nélkül - saját fiók 🙋">
          <p className="m-0">
            Ha nem tartozol egy osztályhoz sem, magad hozhatsz létre fiókot: nyomd
            meg a kerek <strong>Fiók</strong> gombot, és jelöld be az{" "}
            <strong>„Egyedül gyakorlok, osztály nélkül”</strong> lehetőséget. Ehhez
            e-mail-cím kell: oda érkezik hétfőnként a heti összesítő - de csak
            azokon a heteken, amikor valóban volt gyakorlás. Ha egy teljes évig
            senki sem nyitja meg a Tastenflow programot, figyelmeztető e-mail
            érkezik; ha utána három hétig senki sem jelentkezik be, a fiók minden
            eredménnyel együtt törlődik.
          </p>
        </Section>

        <PlakatAbschnitt />
      </div>
    </div>
  );
}

/** Plakát kifüggesztésre - magyarul (`handbuchInSprache`). */
function PlakatAbschnitt() {
  const plakat = handbuchInSprache(tastenflowPlakat(), "hu");
  return (
    <Section title="Plakát kifüggesztésre">
      <p className="m-0">
        Szeretnéd bemutatni a Tastenflow programot az iskoládban vagy az
        intézményedben? Itt találsz egy <strong>kinyomtatható, kifüggeszthető
        plakátot</strong>: A3-as, álló, egy pillantásra megmutatja, mit tud a
        Tastenflow, és egy QR-kód is van rajta a tastenflow.org oldalhoz.
      </p>
      <p className="m-0">
        <a
          href={downloadAdresse(plakat)}
          download={plakat.speicherName}
          type="application/pdf"
          className="text-accent underline underline-offset-2"
        >
          Plakát letöltése (magyar nyelvű PDF, A3, {groesse(plakat.bytes, "hu")})
        </a>
      </p>
    </Section>
  );
}
