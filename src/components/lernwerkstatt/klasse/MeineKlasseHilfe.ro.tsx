/**
 * ★★★ O-HILFE-RO (25.10.2026): DIE HILFE ZU „MEINE KLASSEN" AUF RUMÄNISCH.
 * ===========================================================================
 * Massgeblich ist die deutsche Fassung (`MeineKlasseHilfe.tsx`): dieselben
 * Abschnitte, dieselben Tatsachen; der Aufbau folgt `MeineKlasseHilfe.cs.tsx`.
 * Sichtbar nur mit `spracheGewaehlt === "ro"`; jedes Programm ohne
 * Sprach-Anbieter zeigt weiter die deutsche Fassung.
 *
 * Anrede (Glossar `recherche-rumänisch-2026-10-25/GLOSSAR-ro.md`, Regel 1 und 2):
 * die Lehrkraft in der Höflichkeitsform = 2. Person Mehrzahl („Alegeți",
 * „Introduceți", „Apăsați"), ohne „dumneavoastră", wo das Verb es sagt. Kinder
 * heissen in dieser Sicht „elevii" (Mehrzahl) bzw. „persoana"; was die Lehrkraft
 * der Klasse sagt, steht in der 2. Person Mehrzahl („Timpul pornește de la
 * prima voastră apăsare de tastă."). Knopfnamen ohne Anführung (Regel 7),
 * Tastennamen mit „tasta" davor (Regel 11), Namen nur nach Doppelpunkt
 * (Regel 12), Zähler mit Schrägstrich („Pregătit: 12/14"). Die Startpunkte
 * mit den Namen aus Glossar §2.12; welche Buchstaben nach der Grundreihe
 * kommen, entsteht parallel (F4) und wird hier nicht genannt.
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

export function MeineKlasseHilfeRumaenisch({
  onClose,
  programmName,
}: {
  onClose: () => void;
  /** Das offene Programm - davon hängt ab, welche Abschnitte dastehen. */
  programmName?: string;
}) {
  const tastenflow = programmName === "Tastenflow";
  // Drei Formen (Glossar §2.11), „de" ab 20; die Einzahl als Wort (Regel 5).
  const einstiegsMinuten = mehrzahl(EINSTIEGSFENSTER_MIN, "ro", {
    one: () => "un minut",
    few: (z) => `${z} minute`,
    other: (z) => `${z} de minute`,
  });
  return (
    <Modal title="Ajutor: Clasele mele" onClose={onClose} size="lg">
      <div className="space-y-5">
        <RundgangMeineKlassenKnopf onStart={onClose} programmName={programmName} />
        <p className="m-0 text-sm leading-relaxed text-ink">
          Aici lucrați cu clasa dumneavoastră. Clasele și conturile le creați{" "}
          <strong>o singură dată</strong> - ele sunt valabile în fiecare program de
          învățare, cu același cod al clasei și aceeași parolă.
          {tastenflow && (
            <>
              {" "}
              Când deschideți Tastenflow ca cadru didactic, ajungeți întotdeauna
              aici. La exersarea proprie duce butonul Exersați (
              <Taste>Alt</Taste> + <Taste>U</Taste>).
            </>
          )}
        </p>

        <Abschnitt titel="Cum este organizată pagina">
          <p className="m-0">
            <strong>În antetul clasei</strong> stă numele ei - la mai multe clase,
            în lista „Clasa”, cu care schimbați clasa -, numărul elevilor și codul
            clasei. În dreapta acestui rând, înainte de Descărcări, se află
            comutatorul <strong>Progres | Elevi și conturi</strong> - în același loc
            pe ambele ecrane spre care duce.
          </p>
          <p className="m-0">
            La <strong>Elevi și conturi</strong> creați o clasă nouă, adăugați elevi
            și îi mutați în altă clasă, vedeți parolele și datele de conectare,
            codul clasei și programele pe care le are clasa. Mai mulți elevi
            deodată îi adăugați tot acolo, la „Elevi”, cu butonul{" "}
            <strong>Adăugați elevi dintr-un fișier Excel</strong>: mai întâi
            Descărcați șablonul (Excel), apoi câte un rând pentru fiecare persoană,
            cu nume, parolă și - pentru Tastenflow - punctul de plecare. O parolă
            goală o generează programul; o previzualizare arată ce se preia, iar
            toate persoanele importate apar apoi la Imprimați datele de conectare.
            Cu butonul <strong>Descărcați lista clasei</strong> de alături descărcați
            oricând un fișier Word cu numele, parola și codul clasei TUTUROR elevilor
            acestei clase - pentru imprimat.
            {!tastenflow && (
              <>
                {" "}
                Un mesaj pentru toți elevii îl scrieți acolo cu butonul Mesaj pentru
                clasă.
              </>
            )}
          </p>
          <p className="m-0">
            La <strong>Progres</strong> - aici ajungeți când deschideți pagina - se
            află programele de învățare ale acestei clase, Descărcări și, dedesubt,
            statistica clasei: cât de departe este fiecare persoană.
            {tastenflow && (
              <>
                {" "}
                Chiar sus în ea este un rând de butoane: <strong>Provocare</strong>,{" "}
                <strong>Exercițiu propriu</strong>, <strong>Obiectiv săptămânal</strong>,{" "}
                <strong>Setările clasei</strong> și <strong>Suspendați o oră</strong>.
                Fiecare buton deschide sub el secțiunea lui - mereu doar una o dată,
                iar tasta <Taste>Esc</Taste> o închide din nou. Butonul Provocare
                deschide formularul cu câmpurile Taste folosite și Min și cu butonul
                Începeți acum, plus Provocările anterioare; Exercițiu propriu
                stabilește un text pentru toată clasa (un fișier încărcat, un text
                din Textele mele sau un șablon din curs - elevii primesc pentru asta
                o fereastră doar cu butonul Mai departe); Obiectiv săptămânal
                stabilește minutele pe săptămână; Suspendați o oră pornește 60 de
                minute în care clasa exersează mai departe, dar nimic nu se socotește
                la obiectivul săptămânal. Dedesubt este Prezentarea clasei (lună sau
                an școlar, cu bara scorului și graficul liniar); în dreapta antetului
                ei se află butonul Mesaj pentru clasă - un mesaj pentru toți elevii,
                fiecare îl primește într-o conversație proprie.
              </>
            )}
          </p>
          {tastenflow && (
            <p className="m-0">
              Butonul <strong>Setările clasei</strong> din acest rând deschide: anul
              de studiu (după el aplicația alege felul textelor și numără în fiecare
              an școlar o treaptă mai departe; „Adulți” nu mai crește), limba
              împreună cu blocarea, punctul de plecare al clasei (valabil și pentru
              persoanele care vin mai târziu în clasă) și Întrecerea clasei. Aceste
              patru setări sunt valabile pentru toată clasa, iar aplicația le cere
              deja la crearea clasei; pentru fiecare persoană rămân în rândul ei
              deschis „De unde începeți?”, „Scriere cu o mână” și „În ritmul tău”.
            </p>
          )}
          {tastenflow && (
            <p className="m-0">
              Treptele din <strong>„De unde începeți?”</strong> sunt numite după
              taste: prima este „De la zero: doar F și J”, a doua „Șirul de bază”
              (tot șirul de bază). A treia, „Primele litere și majusculele”, adaugă
              cele mai frecvente litere următoare și tasta Shift. Treptele următoare
              - „Toate literele”, „+ punctuație”, „+ cifre” și „Tot” - deblochează pe
              rând restul.
            </p>
          )}
          <p className="m-0">
            Fiecare buton are propria explicație: sfatul apare imediat ce focalizarea
            ajunge pe el cu tasta Tab. Tasta <Taste>Esc</Taste> închide sfatul.
          </p>
        </Abschnitt>

        {tastenflow && (
          <Abschnitt titel="Provocarea pas cu pas">
            <ol className="m-0 list-decimal space-y-1 pl-5">
              <li>
                Chiar sus în statistica clasei, în lista de sarcini, butonul
                Provocare deschide formularul.
              </li>
              <li>
                Alegeți <strong>tastele folosite</strong> - toți elevii primesc
                același text la acest nivel.
              </li>
              <li>
                Introduceți <strong>durata Provocării</strong> în minute - câmpul
                este chiar alături.
              </li>
              <li>
                Spuneți clasei: <em>Timpul pornește de la prima voastră apăsare de
                tastă.</em> De la pornire, elevii au {einstiegsMinuten} ca să
                înceapă; durata Provocării merge pentru fiecare persoană separat.
              </li>
              <li>
                Apăsați <strong>Începeți acum</strong> - Provocarea începe imediat
                pentru toată clasa.
              </li>
              <li>
                Imediat după aceea vedeți acolo, de exemplu,{" "}
                <strong>Pregătit: 12/14 - încă nu: Said, Jano</strong>: la 12 elevi
                Provocarea a ajuns deja pe dispozitiv. Ea apare acolo după
                aproximativ o secundă. Dacă cineva rămâne mai mult timp la „încă nu”,
                de obicei ajută o reîncărcare a paginii.
              </li>
              <li>
                Cât timp merge, vedeți rândul Predat: 3/18, împreună cu numele.
              </li>
              <li>
                Apoi rezultatele apar sub formular: pentru fiecare persoană locul,{" "}
                <strong>scorul Provocării</strong>, dacă s-a folosit citirea cu voce
                tare, caractere pe minut, precizia, caracterele, greșelile și tastele
                nesigure. Pe lângă acestea vine un e-mail centralizator.
              </li>
            </ol>
          </Abschnitt>
        )}

        {tastenflow && (
          <>
            <Abschnitt titel="Ce înseamnă coloanele tabelului">
              <SpaltenHilfe />
            </Abschnitt>

            <Abschnitt titel="Ce înseamnă nivelul de dificultate">
              <LeistungsstufeHilfe />
            </Abschnitt>

            <Abschnitt titel="Valorile pe care vă puteți sprijini nota">
              <DreiWerteHilfe />
            </Abschnitt>
          </>
        )}

        <Abschnitt titel="Codul clasei">
          <p className="m-0">
            Se află sus, lângă numele clasei, și este valabil pentru toate
            programele. La conectare se introduc codul clasei, numele și parola;
            dispozitivul ține minte codul, apoi ajung numele și parola.
          </p>
          <p className="m-0">
            La crearea unei clase este <strong>obligatoriu</strong>. În timp ce
            scrieți numele, programul propune un cod potrivit - din „4B Iași”
            rezultă „4BIASI”. Îl puteți modifica, dar nu îl puteți lăsa gol. Mai
            târziu îl schimbați la Elevi și conturi, cu butonul Modificați.
          </p>
          <p className="m-0">
            ⚠️ Dacă schimbați codul, toți elevii clasei se conectează de atunci cu
            noul cod.
          </p>
        </Abschnitt>

        <Abschnitt titel="Mutarea unei persoane în altă clasă">
          <p className="m-0">
            La Elevi și conturi, la fiecare persoană este butonul{" "}
            <strong>Mutați în altă clasă</strong>. El deschide câmpul „Codul clasei
            noi”. Merge în orice clasă al cărei cod îl cunoașteți - și în clasa unui
            alt cadru didactic. Înainte de mutare, programul mai întreabă o dată.
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>Persoana se conectează apoi cu noul cod al clasei.</li>
            <li>Cadrele didactice ale clasei noi văd persoana și progresul ei.</li>
            <li>
              {tastenflow
                ? "Rezultatele Provocărilor și mesajele rămân la clasa de până acum."
                : "Mesajele rămân la clasa de până acum."}
            </li>
          </ul>
        </Abschnitt>

        <Abschnitt titel="Comenzi rapide în această secțiune">
          <p className="m-0">
            <Taste>Alt</Taste> + <Taste>H</Taste> deschide și închide acest ajutor.{" "}
            <Taste>Alt</Taste> + <Taste>T</Taste> arată lista tuturor comenzilor
            rapide. <Taste>Alt</Taste> + <Taste>U</Taste> duce la exersarea proprie.{" "}
            <Taste>Alt</Taste> + <Taste>N</Taste> deschide mesajele,{" "}
            <Taste>Alt</Taste> + <Taste>K</Taste> alegerea culorilor și a
            contrastului, iar <Taste>Alt</Taste> + <Taste>J</Taste> meniul contului.
          </p>
          <p className="m-0">
            Cu tasta Tab treceți prin file; tasta Enter schimbă fila. După schimbare,
            focalizarea stă în secțiunea nouă - un cititor de ecran citește mai
            departe de acolo.
          </p>
        </Abschnitt>

        <Abschnitt titel="Mai pe larg">
          <p className="m-0">
            Ghidul pentru cadre didactice (în limba engleză) îl deschideți sus, prin
            Descărcări - acolo este și afișul Tastenflow de imprimat și de pus pe
            perete (A3, în limba engleză), liber pentru toți, și fără conectare.
            {tastenflow && (
              <>
                {" "}
                Ajutorul din program îl deschideți acolo cu <Taste>Alt</Taste> +{" "}
                <Taste>H</Taste>.
              </>
            )}
          </p>
        </Abschnitt>
      </div>
    </Modal>
  );
}
