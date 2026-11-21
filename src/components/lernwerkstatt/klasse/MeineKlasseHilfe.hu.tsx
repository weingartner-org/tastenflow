/**
 * ★★★ O-HU (25.10.2026): DIE HILFE ZU „MEINE KLASSEN" AUF UNGARISCH.
 * ===========================================================================
 * Massgeblich ist die deutsche Fassung (`MeineKlasseHilfe.tsx`): dieselben
 * Abschnitte, dieselben Tatsachen; der Aufbau folgt `MeineKlasseHilfe.cs.tsx`.
 * Sichtbar nur mit `spracheGewaehlt === "hu"`; jedes Programm ohne
 * Sprach-Anbieter zeigt weiter die deutsche Fassung.
 *
 * Anrede (Glossar `recherche-ungarisch-2026-10-25/GLOSSAR-hu.md`, Regel 1):
 * ohne Anrede, wo es geht („-ható/-hető", Hauptwort-Sätze); sonst höfliche
 * Befehlsform ohne „Ön" („Válassza ki", „Adja meg"). Was die Lehrkraft der
 * Klasse sagt, steht in der ti-Form („Az idő az első billentyűleütésetektől
 * fut."). Kinder heissen in dieser Sicht „tanulók". Knopfnamen in „…”,
 * Tastennamen mit „billentyű" (Regel 11), Namen nur nach Doppelpunkt
 * (Regel 12), Zähler mit Schrägstrich („Készen: 12/14"). Die Startpunkte
 * mit den Namen aus Glossar §2.13; die Folge nach der Grundreihe entsteht in
 * F4 parallel - darum hier nur die Grundreihe (`layouts.ts`, `heimtasten`)
 * und keine Buchstabenliste danach.
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

// ★ O-HU (25.10.2026): „Kihívás" (Glossar §2.3) steht ausgeschrieben im Text -
// Ungarisch hängt Endungen an (Kihívást, Kihívások).
export function MeineKlasseHilfeUngarisch({
  onClose,
  programmName,
}: {
  onClose: () => void;
  /** Das offene Programm - davon hängt ab, welche Abschnitte dastehen. */
  programmName?: string;
}) {
  const tastenflow = programmName === "Tastenflow";
  // Nach einer Zahl Einzahl - beide Formen gleich (Glossar §2.11).
  const einstiegsMinuten = mehrzahl(EINSTIEGSFENSTER_MIN, "hu", {
    one: (z) => `${z} perc`,
    other: (z) => `${z} perc`,
  });
  return (
    <Modal title="Súgó: Osztályaim" onClose={onClose} size="lg">
      <div className="space-y-5">
        <RundgangMeineKlassenKnopf onStart={onClose} programmName={programmName} />
        <p className="m-0 text-sm leading-relaxed text-ink">
          Itt folyik a munka az osztállyal. Az osztályokat és a fiókokat{" "}
          <strong>egyszer</strong> kell létrehozni - minden tanulóprogramban
          érvényesek, ugyanazzal az osztálykóddal és ugyanazzal a jelszóval.
          {tastenflow && (
            <>
              {" "}
              Aki tanárként megnyitja a Tastenflow programot, mindig ide érkezik.
              A saját gyakorláshoz a „Gyakorlás” gomb vezet (<Taste>Alt</Taste> +{" "}
              <Taste>U</Taste>).
            </>
          )}
        </p>

        <Abschnitt titel="Így épül fel az oldal">
          <p className="m-0">
            <strong>Az osztály fejlécében</strong> áll az osztály neve - több
            osztálynál az „Osztály” legördülő listában, amellyel osztályt lehet
            váltani -, a tanulók száma és az osztálykód. Ennek a sornak a jobb
            oldalán, a „Letöltések” előtt áll a{" "}
            <strong>„Haladás | Tanulók és belépések”</strong> váltó - mindkét
            képernyőn ugyanott, ahová visz.
          </p>
          <p className="m-0">
            A <strong>„Tanulók és belépések”</strong> részben lehet új osztályt
            létrehozni, tanulókat felvenni és áthelyezni, ott láthatók a jelszavak
            és a belépési adatok, az osztálykód és az, hogy az osztály mely
            programokat használja. Sok tanuló egyszerre ugyanott, a „Tanulók”
            résznél vehető fel a <strong>„Tanulók felvétele Excel-fájlból”</strong>{" "}
            gombbal: először „Sablon letöltése (Excel)”, aztán tanulónként egy
            sor a névvel, a jelszóval és - a Tastenflow programhoz - azzal, hogy
            honnan induljon. Az üresen hagyott jelszót a program hozza létre; egy
            előnézet megmutatja, mi kerül át, és minden felvett tanuló utána a
            „Belépési adatok nyomtatása” alatt található. A mellette lévő{" "}
            <strong>„Osztálynévsor letöltése”</strong> gombbal bármikor letölthető
            egy Word-fájl az osztály ÖSSZES tanulójának nevével, jelszavával és
            osztálykódjával - nyomtatáshoz.
            {!tastenflow && (
              <>
                {" "}
                Üzenetet az összes tanulónak ott az „Üzenet az osztálynak” gombbal
                lehet írni.
              </>
            )}
          </p>
          <p className="m-0">
            A <strong>„Haladás”</strong> részben - ide érkezik, aki megnyitja az
            oldalt - állnak az osztály tanulóprogramjai, a „Letöltések”, alattuk
            pedig az osztálystatisztika: hol tart az egyes tanuló.
            {tastenflow && (
              <>
                {" "}
                Ennek legtetején egy gombsor áll: <strong>Kihívás</strong>,{" "}
                <strong>Saját gyakorlat</strong>, <strong>Heti cél</strong>,{" "}
                <strong>Osztály beállításai</strong> és{" "}
                <strong>Szünet 1 órára</strong>. Minden gomb a saját szakaszát
                nyitja meg alatta - egyszerre mindig csak egyet, az{" "}
                <Taste>Esc</Taste> billentyű újra bezárja. A „Kihívás” megnyitja
                az űrlapot a „Szint” és a „Perc” mezővel és a „Kezdés most”
                gombbal, valamint a korábbi Kihívásokat; a „Saját gyakorlat” egy
                szöveget ad meg az egész osztálynak (feltöltött fájl, szöveg a
                „Saját szövegeim” közül vagy egy sablon a tanfolyamból - a tanulók
                ehhez egy ablakot kapnak, amelyben csak a „Tovább” gomb van); a
                „Heti cél” heti perceket állít be; a „Szünet 1 órára” 60 percet
                indít, amely alatt az osztály tovább gyakorol, de semmi sem számít
                bele a heti célba. Alatta áll az „Osztályáttekintés” (hónap vagy
                tanév, pontsávval és vonaldiagrammal); a fejlécének jobb oldalán
                áll az „Üzenet az osztálynak” - egy üzenet az összes tanulónak,
                mindegyik a saját beszélgetésében kapja meg.
              </>
            )}
          </p>
          {tastenflow && (
            <p className="m-0">
              A sor <strong>„Osztály beállításai”</strong> gombja ezeket nyitja
              meg: az évfolyamot (ebből választja ki a program a szövegfajtákat,
              és minden tanévben továbblép; a „Felnőttek” fokozat nem lép
              tovább), a nyelvet a zárolással együtt, az osztály kiindulópontját
              (a később érkező tanulókra is érvényes) és az Osztályversenyt. Ez a
              négy az egész osztályra érvényes, és a program már az osztály
              létrehozásakor rákérdez; tanulónként a lenyitott sorában marad a
              „Honnan induljon?”, a „Gépelés egy kézzel” és a „Nyugodtan”.
            </p>
          )}
          {tastenflow && (
            <p className="m-0">
              A <strong>„Honnan induljon?”</strong> fokozatai a billentyűkről
              kapták a nevüket: a „Kezdő” csak az F és a J, az „Alapállás” a
              teljes alapsor (a s d f j k l é). Az <strong>„Első betűk +
              nagybetűk”</strong> fokozatnál a leggyakoribb további betűk és a
              Shift billentyű jönnek hozzá. A „Minden betű”, a „+ írásjelek”, a
              „+ számok” és a „Minden” ezután sorban feloldja a többit.
            </p>
          )}
          <p className="m-0">
            Minden gomb elmagyarázza magát: a tipp megjelenik, amint a fókusz a
            Tab billentyűvel odaér. Az <Taste>Esc</Taste> billentyű elküldi.
          </p>
        </Abschnitt>

        {tastenflow && (
          <Abschnitt titel="A Kihívás lépésről lépésre">
            <ol className="m-0 list-decimal space-y-1 pl-5">
              <li>
                Az osztálystatisztika legtetején, a feladatsávban a „Kihívás”
                gomb nyitja meg az űrlapot.
              </li>
              <li>
                Válassza ki a <strong>használt billentyűket</strong> - minden
                tanuló ugyanazt a szöveget kapja ezen a szinten.
              </li>
              <li>
                Adja meg a <strong>Kihívás idejét</strong> percben - a mező
                közvetlenül mellette áll.
              </li>
              <li>
                Mondja meg az osztálynak: <em>Az idő az első
                billentyűleütésetektől fut.</em> Az indítástól számítva a
                tanulóknak {einstiegsMinuten} áll rendelkezésükre, hogy elkezdjék;
                a Kihívás ideje minden tanulónak külön fut.
              </li>
              <li>
                Nyomja meg a <strong>„Kezdés most”</strong> gombot - a Kihívás
                azonnal elindul az egész osztálynak.
              </li>
              <li>
                Rögtön utána ott például ez áll:{" "}
                <strong>„Készen: 12/14 - még nem: Said, Jano”</strong>: 12
                tanulónál a Kihívás már megérkezett az eszközre. Nagyjából egy
                másodperc múlva jelenik meg ott. Ha egy tanuló hosszabban a „még
                nem” alatt marad, többnyire segít az oldal egyszeri újratöltése.
              </li>
              <li>
                Amíg fut, a „Beadva: 3/18” sor látható a nevekkel.
              </li>
              <li>
                Utána az űrlap alatt állnak az eredmények: tanulónként helyezés,{" "}
                <strong>a Kihívás pontszáma</strong>, volt-e felolvasás, leütés
                percenként, pontosság, karakterek, hibák és a bizonytalan
                billentyűk. Ehhez egy összesítő e-mail is érkezik.
              </li>
            </ol>
          </Abschnitt>
        )}

        {tastenflow && (
          <>
            <Abschnitt titel="Mit jelentenek a táblázat oszlopai">
              <SpaltenHilfe />
            </Abschnitt>

            <Abschnitt titel="Mit jelent a nehézségi szint">
              <LeistungsstufeHilfe />
            </Abschnitt>

            <Abschnitt titel="Az értékek, amelyekből érdemjegy állítható össze">
              <DreiWerteHilfe />
            </Abschnitt>
          </>
        )}

        <Abschnitt titel="Az osztálykód">
          <p className="m-0">
            Fent, az osztály neve mellett áll, és minden programra érvényes.
            Bejelentkezéskor az osztálykódot, a nevet és a jelszót kell megadni;
            az eszköz megjegyzi a kódot, utána elég a név és a jelszó.
          </p>
          <p className="m-0">
            Osztály létrehozásakor <strong>kötelező</strong>. A név gépelése
            közben a program megfelelő kódot javasol - a „3.b Szeged” névből
            „3BSZEGED” lesz. A kód módosítható, de üresen nem hagyható. Később a
            „Tanulók és belépések” részben a „Szerkesztés” gombbal változtatható
            meg.
          </p>
          <p className="m-0">
            ⚠️ Ha a kód megváltozik, az osztály minden tanulója attól kezdve az
            új kóddal jelentkezik be.
          </p>
        </Abschnitt>

        <Abschnitt titel="Tanuló áthelyezése másik osztályba">
          <p className="m-0">
            A „Tanulók és belépések” részben minden tanulónál ott áll az{" "}
            <strong>„Áthelyezés másik osztályba”</strong>. Ez megnyitja „Az új
            osztály kódja” mezőt. Minden olyan osztályba működik, amelynek a kódja
            ismert - egy másik tanár osztályába is. Az áthelyezés előtt a program
            még egyszer rákérdez.
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>A tanuló utána az új osztálykóddal jelentkezik be.</li>
            <li>Az új osztály tanárai látják a tanulót és a haladását.</li>
            <li>
              {tastenflow
                ? "A Kihívások eredményei és az üzenetek a korábbi osztálynál maradnak."
                : "Az üzenetek a korábbi osztálynál maradnak."}
            </li>
          </ul>
        </Abschnitt>

        <Abschnitt titel="Billentyűparancsok ebben a részben">
          <p className="m-0">
            Az <Taste>Alt</Taste> + <Taste>H</Taste> megnyitja és bezárja ezt a
            súgót. Az <Taste>Alt</Taste> + <Taste>T</Taste> megmutatja az összes
            billentyűparancs listáját. Az <Taste>Alt</Taste> + <Taste>U</Taste> a
            saját gyakorláshoz visz. Az <Taste>Alt</Taste> + <Taste>N</Taste>{" "}
            megnyitja az üzeneteket, az <Taste>Alt</Taste> + <Taste>K</Taste> a
            színek és a kontraszt választóját, az <Taste>Alt</Taste> +{" "}
            <Taste>J</Taste> pedig a fiók menüjét.
          </p>
          <p className="m-0">
            A Tab billentyűvel lehet a lapok között haladni; az Enter billentyű
            vált. Váltás után az olvasási pont az új részben áll - a
            képernyőolvasó onnan olvas tovább.
          </p>
        </Abschnitt>

        <Abschnitt titel="Még részletesebben">
          <p className="m-0">
            A tanári kézikönyv (angol nyelvű) fent a „Letöltések” alatt nyitható
            meg - ott van a kinyomtatható, kifüggeszthető Tastenflow-plakát is
            (A3, angol nyelvű), amely mindenkinek elérhető, bejelentkezés nélkül
            is.
            {tastenflow && (
              <>
                {" "}
                Magának a programnak a súgója ott az <Taste>Alt</Taste> +{" "}
                <Taste>H</Taste> billentyűparanccsal érhető el.
              </>
            )}
          </p>
        </Abschnitt>
      </div>
    </Modal>
  );
}
