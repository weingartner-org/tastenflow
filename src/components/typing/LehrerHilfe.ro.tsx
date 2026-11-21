/**
 * ★★★ O-HILFE-RO (25.10.2026): DAS HILFE-FENSTER FÜR LEHRKRÄFTE, RUMÄNISCH.
 * ===========================================================================
 * In derselben Reihenfolge wie die deutsche und die tschechische Fassung (1 bis
 * 12, samt 4a, Didaktik, 8a, 8b) - wer eine Stelle prüft, findet sie in allen.
 * Inhalt nach der deutschen `LehrerHilfeDeutsch`; wo sie den Weg „de" beschreibt
 * (Reihenfolge, Fremdwörter, Tastaturen), steht wie in der tschechischen Fassung
 * das, was für den Weg „ro" gilt. Sichtbar nur mit `spracheGewaehlt === "ro"`.
 *
 * ── ANREDE (Glossar `recherche-rumänisch-2026-10-25/GLOSSAR-ro.md`, Regel 1/2) ──
 * Höflichkeitsform = 2. Person Mehrzahl („Alegeți", „Apăsați"), ohne
 * „dumneavoastră/dvs." wo das Verb es sagt. Knöpfe im Imperativ Mehrzahl
 * („Creați clasa", „Începeți acum"), im Satz ohne Anführung; Bereichs- und
 * Optionsnamen in „…”. Lehrkraft = „cadru didactic", das einzelne Kind =
 * „persoana", Kinder = „elevii"/„copiii" (Mehrzahl). Kein Adjektiv/Partizip an
 * der Lehrkraft („conectat", „sigur"). Keine Ausrufezeichen.
 *
 * ── WAS RUMÄNISCH ANDERS IST ───────────────────────────────────────────────
 *  · Zahlen mit Nomen über `mehrzahl(n, "ro", { one, few, other })` - die
 *    `other`-Form (20 und mehr) mit „de" (Glossar Regel 13, §2.11). Prozent
 *    mit geschütztem Leerzeichen („96 %", Regel 5).
 *  · Die Tippchallenge heisst „Provocare" (Bauplan R13), nie „test", „examen",
 *    „lucrare" (Glossar §4 Falle 11) - auch nicht für die Spalte der Tabelle.
 *  · Abschnitt 4: der Weg „ro" hat eine eigene Reihenfolge nach rumänischer
 *    Buchstabenhäufigkeit (Bauplan R1, R3; F4 baut sie parallel) - die Hilfe
 *    nennt nur, was fest ist: ă â î ș ț sind gewöhnliche Buchstaben ohne
 *    Totaste und kommen mit, nicht am Ende. Keine Buchstabenliste.
 *  · Abschnitt 2: die zwei rumänischen Tastaturen (`layouts.ts`, `ro`,
 *    `ro-prog`, nur gelesen) und die Wortpaare sa/să, peste/pește (R5).
 *  · Abschnitt 4: statt der deutschen Fremdwörter die Vorlage „Rădăcini de
 *    cuvinte" des Weges „ro" (`vorlagenDaten/wurzelnRo.ts`, fünf Themen).
 *  · Abschnitt 12: eigenes Handbuch; das Plakat hat eine eigene Fassung in der Sprache (`tastenflowPlakat`).
 *
 * Fliesstext mit rumänischer Anführung „…” (U+201E/U+201D), nur Bindestrich,
 * keine Maus-Wörter, Person zuerst („copii cu deficiențe de vedere",
 * „copii nevăzători"); ș ț nur mit Komma.
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

/** Ghidul - același buton ca în celelalte versiuni. */
function HandbuchLaden() {
  const h = handbuecherFuer("tippen")[0];
  if (!h) throw new Error("Kein Tastenflow-Handbuch in HANDBUECHER");
  return (
    <p className="m-0">
      <HandbuchKnopf alsLink handbuch={h} />
    </p>
  );
}

/** Afișul - `div` statt `p` (der Knopf kann einen Fehler-Absatz zeigen). */
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

/** ★ O-HILFE-RO: Prozent mit geschütztem Leerzeichen (Glossar Regel 5). */
const prozent = (p: number) => `${p} %`;

export function LehrerHilfeRumaenisch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  useFocusTrap(open, cardRef, { initialFocus: closeRef });
  if (!open) return null;

  // Drei Formen (Glossar §2.11), „de" ab 20.
  const minute = (n: number) =>
    mehrzahl(n, "ro", { one: () => "un minut", few: (z) => `${z} minute`, other: (z) => `${z} de minute` });
  const caractere = (n: number) =>
    mehrzahl(n, "ro", { one: () => "un caracter", few: (z) => `${z} caractere`, other: (z) => `${z} de caractere` });
  const texteProvocare = mehrzahl(PROBEN_JE_NIVEAU, "ro", {
    one: () => "un text al Provocării",
    few: (z) => `${z} texte ale Provocării`,
    other: (z) => `${z} de texte ale Provocării`,
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Ajutor pentru cadre didactice - Tastenflow"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        className="card my-8 w-full max-w-3xl space-y-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="m-0 text-xl font-semibold text-ink">
            Ajutor pentru cadre didactice: toate funcțiile Tastenflow
          </h2>
          <button
            ref={closeRef}
            type="button"
            className="btn-secondary btn-toggle"
            onClick={onClose}
            aria-label="Închideți ajutorul"
          >
            ✕ Închideți
          </button>
        </div>
        <RundgangLehrkraftKnoepfe onStart={onClose} />

        <p className="m-0 text-ink-soft">
          Tastenflow are un <strong>sistem propriu de conturi</strong>, complet
          separat de conectarea la platforma de învățare. Conectarea aici nu
          influențează sesiunea din platformă - și invers.
        </p>

        <Section title="1 · Crearea claselor și a conturilor">
          <p className="m-0">
            Ca cadru didactic, la deschiderea aplicației Tastenflow ajungeți
            întotdeauna în <strong>„Clasele mele”</strong>; la exersarea proprie duce
            butonul Exersați (<Kbd>Alt</Kbd> + <Kbd>U</Kbd>). Prin{" "}
            <strong>„Elevi și conturi”</strong>, sus în dreapta, creați o clasă - în
            secțiunea care se deschide <strong>„Creați o clasă nouă”</strong>.{" "}
            <strong>Codul clasei</strong> este obligatoriu: în timp ce scrieți
            numele, programul propune un cod potrivit (din „4B Iași” rezultă
            „4BIASI”); îl puteți modifica, de exemplu în <code>4B-SC5</code>. Codul
            este valabil pentru toată clasa. În aceeași secțiune alegeți{" "}
            <strong>anul de studiu</strong> și <strong>punctul de plecare</strong>{" "}
            și verificați limba (cu lacăt) și Întrecerea clasei - aceleași câmpuri
            ca în „Setările clasei”. Butonul <strong>Creați clasa</strong> merge
            abia când totul este completat; altfel o propoziție spune ce lipsește,
            iar focalizarea stă în primul câmp necompletat.
          </p>
          <p className="m-0">
            Apoi, cu butonul <strong>Adăugați o persoană</strong>, adăugați elevii
            cu <strong>nume și parolă</strong>. După aceea se pot conecta de pe{" "}
            <strong>orice dispozitiv</strong> cu <em>codul clasei, numele și parola</em>.
            Dispozitivul ține minte codul clasei, așa că elevii introduc apoi doar
            numele și parola.
          </p>
          <p className="m-0">
            Numele și codul clasei se pot schimba mai târziu cu butonul{" "}
            <strong>✏️ Modificați</strong> - un cod nou este apoi valabil pentru toți
            elevii clasei (de atunci se conectează cu noul cod).
          </p>
          <p className="m-0">
            <strong>O altă posibilitate:</strong> cine nu face parte din nicio clasă
            își poate crea și un <strong>cont propriu</strong> - în fereastra de
            conectare, cu bifa „Exersez independent, fără clasă” și o adresă de
            e-mail. Pentru dumneavoastră nu se schimbă nimic: astfel de conturi nu
            aparțin niciunei clase, nu apar în listele dumneavoastră și își primesc
            raportul săptămânal direct. Pentru clasa dumneavoastră rămâne totul ca
            până acum - conturile elevilor le creați dumneavoastră.
          </p>
        </Section>

        <Section title="2 · Setările clasei și ale fiecărei persoane">
          <p className="m-0">
            <strong>Pentru toată clasa</strong> (butonul „Setările clasei” din lista
            de sarcini de deasupra tabelului, lângă Provocare, Exercițiu propriu,
            Obiectiv săptămânal și Suspendați o oră - închis, butonul arată deja
            anul de studiu, limba și Întrecerea clasei):
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Anul de studiu:</strong> din el aplicația calculează nivelul
              textelor - vocabularul, felul glumelor și tonul textelor de exersat.
              Clasa a VII-a înseamnă cam 13 ani, deci texte pentru 11-15 ani.{" "}
              <strong>Crește odată cu clasa:</strong> aplicația ține minte anul
              școlar al înregistrării și numără în fiecare an o treaptă mai departe,
              fără să mai reglați ceva. Pentru grupuri de adulți există treapta{" "}
              <strong>„Adulți”</strong> - ea nu mai crește. Anul nașterii nu se mai
              cere pentru elevii unei clase.
            </li>
            <li>
              <strong>Limba și blocarea:</strong> româna sau engleza pentru
              cuvintele și textele de exersat ale întregii clase; cu lacătul de
              alături, elevii nu o mai pot schimba singuri. Butonul rotund al limbii
              (cu globul pământesc) din partea de sus îl are fiecare elev: schimbă
              butoanele și meniurile și odată cu ele textele de exersat - cu lacăt,
              doar butoanele și meniurile.
            </li>
            <li>
              <strong>Punctul de plecare al clasei:</strong> răspunsul la „De unde
              începeți?” pentru toată clasa - este valabil și pentru fiecare
              persoană care vine mai târziu și doar adaugă: cine e deja mai departe
              nu pierde nimic. La alegere, aplicația trece treapta și la elevii care
              există deja; dacă unii sunt deja mai departe, întreabă mai întâi și
              oferă trei variante: toți, doar cei care nu au ajuns încă atât de
              departe, sau anulare. Schimbarea are efect imediat ce persoana
              deschide data viitoare Tastenflow; statistica și medaliile rămân în
              orice caz.
            </li>
            <li>
              <strong>Permiteți Întrecerea clasei:</strong> elevii se pot invita
              unii pe alții la o întrecere de cinci minute. În „Timpul de exersare”
              din rândul deschis vedeți de câte ori a participat persoana în fiecare
              săptămână - fără clasament și fără timpi.
            </li>
            <li>
              <strong>Sfârșit de rând cu tasta Enter:</strong> dacă e bifat, fiecare
              elev al clasei încheie fiecare rând de exersare cu tasta Enter - ca la
              scrisul de birou. Este valabil pentru „Antrenamentul meu”, Povești,
              Exercițiu propriu, jocurile cu cuvinte pe rânduri, Provocare și
              Întrecerea clasei; nu pentru ghicitori, Litere amestecate, Dictarea
              degetelor, Expediția polară și Explorarea tastelor. Inițial: oprit.
            </li>
          </ul>
          <p className="m-0">
            <strong>Pentru fiecare persoană</strong> (după săgeata din rândul ei):
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Tastatură:</strong> se alege în Setări (butonul ⚙), la
              „Tastatură” - pentru română <strong>Română (standard)</strong> sau{" "}
              <strong>Română (programatori)</strong>, după aspectul tastaturii setat
              în Windows. Setarea este valabilă pentru acest dispozitiv (nu pentru
              cont) și comandă tastatura de pe ecran, anunțurile pentru degete și
              caracterele care se exersează. Pe tastatura standard, ă și î sunt în
              dreapta tastei P, â deasupra tastei Enter, ș și ț în dreapta tastei L
              (cu virgulă dedesubt, cum e corect); pe tastatura de programatori,
              literele românești se scriu cu Alt Gr + A, Q, I, S sau T, iar în rest
              este tastatura engleză (SUA). O literă fără semn diacritic nu
              înlocuiește litera românească - s în loc de ș este altă tastă și
              adesea alt cuvânt (sa și să, peste și pește).
            </li>
            <li>
              <strong>De unde începeți?:</strong> aceeași listă de trepte ca
              punctul de plecare al clasei (vezi mai sus) - aici pentru persoana
              care are nevoie de o excepție. Cei mai exersați sar astfel peste
              bază și încep mai departe (de exemplu abia de la cifre); înainte de o
              trecere înapoi, aplicația întreabă.
            </li>
            <li>
              <strong>Scriere cu o mână:</strong> anulează pentru această persoană
              regula Shift cu cealaltă mână - literele mari și semnele speciale
              merg atunci cu oricare tastă Shift.
            </li>
            <li>
              <strong>În ritmul tău:</strong> viteza acestei persoane nu se
              evaluează nicăieri - fără limită de timp în joc, fără țintă de viteză
              la stele, fără urcare sau coborâre a nivelului de dificultate după
              viteză. Pentru cei care scriu cu grijă, dar foarte încet.
            </li>
            <li>
              <strong>Spațiere mare între caractere (CVI):</strong> spațiu mai mare
              între caractere la copiere, în trei trepte (dublă, triplă, cvadruplă)
              - pentru copiii cu deficiență de vedere de origine cerebrală (CVI),
              pentru care caracterele apropiate se contopesc. Persoana poate
              schimba spațierea și singură, în Setări (butonul ⚙,{" "}
              <AltText>Alt + O</AltText>) - iar dumneavoastră oricând înapoi aici.
              Contează ce s-a ales ultima dată.
            </li>
          </ul>
          <p className="m-0">
            Totul se poate schimba oricând - valorile clasei în „Setările clasei”
            de deasupra tabelului, valorile fiecărei persoane în rândul ei deschis.
          </p>
        </Section>

        <Section title="3 · Nivelul de dificultate (1-50): inima programului">
          <LeistungsstufeHilfe />
          <p className="m-0">
            <strong>Nivelul actual</strong> apare în tabel (coloana{" "}
            <strong>„Nivel de dificultate”</strong>) și sus, pe ecranul de exersare.
            Nu trebuie să reglați nimic - doar la nevoie activați „În ritmul tău”.
          </p>
        </Section>

        <Section title="4 · „Antrenamentul meu”: adaptiv, după frecvența literelor">
          <p className="m-0">
            Tastenflow are <strong>un singur</strong> drum de exersare, pe care
            fiecare persoană îl parcurge în ritmul ei - și el{" "}
            <strong>se adaptează</strong>: programul măsoară fiecare tastă separat,
            exersează automat tastele cele mai slabe și deblochează una nouă abia
            când cele de până acum sunt sigure.
          </p>
          <div className="rounded-xl border border-accent bg-accent-soft p-3">
            <p className="m-0 font-semibold text-ink">Ordinea după frecvența literelor</p>
            <ul className="m-0 mt-1 list-disc space-y-1 pl-5">
              <li>
                După poziția de bază vin mai întâi literele{" "}
                <strong>cele mai frecvente</strong> - astfel, după doar câteva taste
                apar <strong>cuvinte adevărate</strong>.
              </li>
              <li>
                <strong>Fiecare parcurs este altfel</strong> - ce tastă urmează
                depinde de persoană, nu de o listă fixă.
              </li>
              <li>
                <strong>Fără un sfârșit fix</strong> - potrivit pentru exersarea
                zilnică, independentă.
              </li>
            </ul>
          </div>
          <p className="m-0 rounded-xl border border-warning/40 bg-warning/10 p-3">
            <strong>Pentru planificarea dumneavoastră:</strong> parcursul românesc
            are o <strong>ordine proprie a tastelor</strong>, după frecvența
            literelor în textele românești. <strong>ă, â, î, ș și ț</strong> sunt
            litere obișnuite, cu tastele lor, fără taste moarte - ele vin în această
            ordine, printre celelalte litere, nu la sfârșit, pentru că apar în
            aproape fiecare propoziție românească.
          </p>
          <p className="m-0 rounded-xl border border-hairline bg-surface-raised p-3">
            <strong>Ordinea depinde de limba primului exercițiu:</strong> parcursul
            pe care îl urmează o persoană se stabilește după limba interfeței la
            primul exercițiu. Cine a început, de exemplu, în germană sau în engleză
            își păstrează acea ordine, chiar dacă limba interfeței se schimbă:
            ordinea se stabilește o dată și apoi nu se mai schimbă.
          </p>
          <p className="m-0">
            <strong>Același text pentru toată clasa:</strong> textele cursului (șirul
            de bază, șirurile de litere, semnele de punctuație, cifrele, semnele
            speciale, texte întregi) vă stau la dispoziție ca{" "}
            <strong>șabloane</strong> în secțiunea <strong>„Exercițiu propriu”</strong>{" "}
            din „Clasele mele” - alegeți unul și toată clasa exersează același text,
            indiferent unde se află fiecare (la fel ca la un fișier încărcat, se
            socotește la timpul de exersare, iar tastele noi nu se deblochează
            astfel).
          </p>
          <p className="m-0">
            <strong>Rădăcini de cuvinte și cod de program:</strong> pentru parcursul
            românesc, printre șabloane este grupul <strong>„Rădăcini de cuvinte”</strong>:
            cuvinte de copiat, fiecare cu o scurtă explicație a originii, în cinci
            teme (cuvinte moștenite din latină, cuvinte venite din slavă, din turcă
            și din franceză, cuvinte din maghiară și germană); elevii doar copiază
            ambele. Pentru Provocarea cu fișier propriu există aceleași cuvinte încă
            o dată, în alte fișiere și în ordine alfabetică. Pe lângă acestea există{" "}
            <strong>cod de program</strong> de copiat (zece limbaje de programare,
            cod sursă adevărat din proiecte deschise, alte fragmente decât în
            Provocare) - doar la „Exercițiu propriu”.
          </p>
        </Section>

        <Section title="4a · „Exercițiu propriu”: un text pentru toată clasa">
          <p className="m-0">
            Cu butonul <strong>Exercițiu propriu</strong> din lista de sarcini a
            statisticii clasei stabiliți un text pe care îl exersează toată clasa -
            indiferent unde se află fiecare. Trei drumuri spre text:{" "}
            <strong>încărcați un fișier</strong> (.txt sau .docx), alegeți un text
            salvat mai devreme din <strong>„Textele mele”</strong> sau preluați unul
            dintre <strong>șabloanele</strong> cursului (vezi punctul 4).
          </p>
          <p className="m-0">
            <strong>„Textele mele”</strong> este spațiul dumneavoastră de păstrare,
            permanent - aparține contului dumneavoastră, nu clasei, și doar
            dumneavoastră îl vedeți. La încărcare, bifa{" "}
            <strong>„Salvați în Textele mele”</strong> (bifată de la început) pune
            automat o copie acolo, ca să puteți folosi același text mai târziu fără
            să încărcați din nou fișierul.
          </p>
          <p className="m-0">
            Dacă fișierul conține caractere care nu se pot scrie, secțiunea le arată
            înainte de pornire ca listă - decideți dacă corectați fișierul sau
            porniți totuși (caracterele rămase dispar atunci din rânduri, nu devin
            niciodată o apăsare obligatorie).
          </p>
          <p className="m-0">
            <strong>Porniți exercițiul propriu:</strong> fiecare persoană primește
            imediat o fereastră care anunță un exercițiu de la școală - poate apăsa
            doar <strong>Mai departe</strong>, nu poate refuza. Pentru fiecare
            persoană, exercițiul se încheie de la sine după ce a scris textul o dată;
            apoi exersează din nou normal. Butonul{" "}
            <strong>Încheiați exercițiul</strong> îl încheie mai devreme pentru toată
            clasa.
          </p>
          <p className="m-0">
            Exercițiul se socotește la timpul de exersare și se măsoară ca orice
            altă rundă, inclusiv tastele nesigure - dar{" "}
            <strong>nu deblochează nicio tastă nouă</strong>: ce taste apar
            stabilește doar fișierul.
          </p>
        </Section>

        <Section title={didaktikAbschnittTitel("ro")}>
          <DidaktikInhalt lang="ro" />
        </Section>

        <Section title="5 · Texte cu sens de la început">
          <p className="m-0">
            Programul arată <strong>cât mai devreme</strong> texte adevărate,
            potrivite vârstei - glume, proverbe, zicători, texte cu informații și
            curiozități, frământări de limbă, jocuri cu cuvinte și propoziții
            întregi. Un text apare imediat ce <strong>literele</strong> lui au fost
            învățate; o simplă „salată de cuvinte” este excepția (doar pentru
            exersarea țintită a unei taste complet noi).
          </p>
          <p className="m-0">
            <strong>Literele mari:</strong>{" "}
            <strong>scrierea este întotdeauna corectă</strong> (literă mare la
            începutul propoziției și la nume proprii) - elevii nu văd niciodată un
            cuvânt scris greșit. La început ajunge pentru asta litera{" "}
            <strong>mică</strong>; cea mare apare automat („literă mare automată”,
            pentru <strong>toate vârstele</strong>, pentru că ortografia corectă
            contează la orice vârstă).
          </p>
          <p className="m-0">
            În <strong>„Antrenamentul meu” tasta Shift adevărată vine totuși
            devreme</strong> - imediat după primele litere frecvente, de îndată ce
            există destule cuvinte adevărate de exersat (nu abia după tot
            alfabetul). De atunci, literele mari se scriu „de-adevăratelea”, cu
            tasta Shift. Pe tastatura standard, Ă Î Â Ș Ț sunt toate în partea
            dreaptă, deci se scriu cu tasta Shift din stânga. Așa elevii învață
            curând să scrie literele mari cu degetele lor, în loc să se bazeze mult
            timp pe ajutorul automat.
          </p>
          <p className="m-0">
            <strong>Semnele de punctuație</strong> (punct, virgulă, semnul
            întrebării ...) apar abia după ce au fost învățate - până atunci
            propoziția stă „fără punct și virgulă”. O tastă de <em>literă</em> sau
            de <em>cifră</em> încă neînvățată, în schimb, nu se cere{" "}
            <strong>niciodată</strong>.
          </p>
        </Section>

        <Section title="6 · Stele, medalii și sunete (important pentru copiii cu deficiențe de vedere)">
          <p className="m-0">
            Fiecare rundă dă <strong>între una și trei stele</strong>, după precizie
            și viteză - <strong>precizia contează triplu</strong>: trei stele cer
            întotdeauna în jur de {prozent(96)} apăsări corecte (scrisul rapid și
            neglijent nu e răsplătit); o rundă fără greșeli are în schimb două stele
            sigure chiar și în cel mai lent ritm. Fiecare număr de stele are{" "}
            <strong>sunetul lui</strong>; la <strong>urcarea unui nivel</strong> se
            aude un sunet special de bucurie. Aceste sunete sunt principala
            reacție pentru copiii cu deficiențe de vedere. Cu butonul{" "}
            <strong>🔇</strong>, sunetul se poate opri într-o clasă liniștită.
          </p>
          <p className="m-0">
            Pe lângă acestea există <strong>medalii</strong> cu nume pentru copii -
            în familii cu trepte și cu o „țintă următoare” care se poate citi
            oricând. Numele cu animale le văd doar copiii de 7-10 ani; de la textele
            pentru 11-15 ani apare peste tot un nume neutru. Medaliile în sine sunt
            aceleași - o medalie obținută rămâne obținută, și la schimbarea
            nivelului textelor. Aproape toate răsplătesc{" "}
            <strong>precizia și perseverența</strong>; singura medalie pentru viteză
            cere {prozent(95)} precizie. O medalie nouă aduce un sunet „ta-daa” cu
            anunț și apare apoi sus, în statistică (la persoană ca și la
            dumneavoastră - aceeași vedere). Fiecare medalie se poate{" "}
            <strong>selecta</strong> - apare atunci mare, cu efect.
          </p>
          <p className="m-0">
            Jocul <strong>Sloiuri de gheață 🐧</strong> este recompensa după o tastă
            nouă în „Antrenamentul meu”: pinguinul trece un traseu din{" "}
            <strong>caracterele cele mai nesigure</strong> ale persoanei (o dată pe
            sloiuri peste apă, altă dată și pe muntele de litere, cu alunecare pe
            burtă). <strong>Tasta este deblocată deja dinainte</strong> - progresul
            nu depinde de niciun joc. Oricâte încercări, niciun sfârșit de joc; la
            cerința „doar precizie” (și pe nivelul de dificultate 1) nu există{" "}
            <strong>nicio presiune de timp</strong> (limită de timp care se poate
            opri, conform WCAG). În plus, persoanele cu texte pentru{" "}
            <strong>7-10 și 11-15 ani</strong> pot porni jocul oricând, de bunăvoie,
            cu butonul <strong>Jucați</strong> - ca „aventura zilei”, cu{" "}
            <strong>pești bonus</strong> (sunetul peștelui și anunțul caracterului;
            un pește scăpat nu e o greșeală) și cu <strong>Peștera ecoului</strong>,
            în care fiecare tastă doar se anunță (acolo aplicația vorbește și cu
            citirea cu voce tare oprită - copiii nevăzători și copiii văzători joacă
            exact la fel; peștera nu apare NICIODATĂ în runda de recompensă). O
            trecere fără greșeli se încheie cu aurora polară; aventurile reușite,
            peștii și trecerile fără greșeli aduc familia de medalii{" "}
            <strong>„Aventuri”</strong>. Important pentru evaluarea dumneavoastră:
            jocul <strong>nu se socotește la timpul de exersare</strong> și nici la
            obiectivul săptămânal - este doar motivație.
          </p>
          <p className="m-0">
            <strong>Două drumuri diferite spre joc - vă rugăm să nu le confundați:</strong>{" "}
            butonul <strong>Jucați</strong> este intrarea liberă, pe care elevii o
            apasă ei înșiși; există pentru <strong>7-10 și 11-15 ani</strong>, de la
            16 ani nu. Runda <strong>de după o tastă nouă</strong>, în schimb, vine
            de la sine: la 7-10 ani mereu, de la 16 ani niciodată, iar la 11-15 ani
            doar dacă în Setări, la <strong>„Joc-recompensă”</strong>, este ales
            jocul Sloiuri de gheață în loc de <strong>Niciunul</strong> (alegerea
            inițială). Setarea aparține <strong>dispozitivului</strong>, nu
            contului - ca aspectul tastaturii. Pe un calculator al clasei este deci
            valabilă pentru toți cei care exersează acolo.
          </p>
        </Section>

        <Section title="7 · Obiectivul săptămânal">
          <p className="m-0">
            Pentru fiecare persoană stabiliți <strong>minute pe săptămână</strong> -
            fără unități. Butonul <strong>Aplicați pentru toată clasa</strong> scrie
            aceeași valoare tuturor elevilor clasei deodată și este valabil și
            pentru cei care vin mai târziu.
          </p>
          <p className="m-0">
            O schimbare este valabilă întotdeauna{" "}
            <strong>de lunea următoare, de la ora 8:00</strong> - săptămâna în curs
            își păstrează obiectivul de până acum. Înainte de salvare, o fereastră
            arată data exactă.
          </p>
          <p className="m-0">
            <strong>Recuperarea:</strong> dacă este bifat „Recuperați minutele din
            săptămânile trecute”, minutele pierdute din săptămânile anterioare se
            pot recupera toate deodată.
          </p>
          <p className="m-0">
            <strong>Scutiți săptămâna</strong> (de exemplu la boală) și{" "}
            <strong>Resetați minutele restante</strong> rămân ca până acum - pentru
            fiecare persoană, fără a schimba timpul exersat.
          </p>
          <p className="m-0">
            <strong>Suspendați o oră:</strong> un buton separat pentru toată clasa,
            pentru 60 de minute. Se exersează mai departe - timpul de exersare și
            statistica se socotesc în continuare, doar obiectivul săptămânal din
            această oră nu. O a doua apăsare pe același buton (Reluați obiectivul)
            ridică suspendarea înainte de vreme.
          </p>
        </Section>

        <Section title="8 · Statistică și evoluție (de deschis pentru fiecare persoană)">
          <p className="m-0">
            Cu butonul rotund cu săgeată<span aria-hidden="true"> ▸</span> din fața
            numelui deschideți șase rânduri, fiecare de închis separat, de sus în
            jos: <strong>Setări</strong> (valorile de la punctul 2, pentru această
            persoană), <strong>Provocări</strong> (doar dacă s-a scris cel puțin una),{" "}
            <strong>Timpul de exersare</strong> (pe săptămâni, cu stadiul
            obiectivului săptămânal și - dacă s-a jucat - numărul de întreceri ale
            clasei, plus harta anului pentru tot anul școlar),{" "}
            <strong>Taste nesigure</strong>, <strong>Medalii</strong> și - doar la o
            valoare neobișnuită - <strong>Lucru independent</strong> (vezi punctul 9).
          </p>
          <p className="m-0">
            În „Timpul de exersare” apare sus la câte întreceri ale clasei a
            participat persoana (numărate în această clasă; cât de departe în urmă
            merge numărătoarea spune sfatul de la numărător); tasta Enter pe o
            săptămână deschide timpii ei de exersare unul câte unul - ziua, ora de
            la-până, timpul curat de scris și ce s-a exersat.
          </p>
          <p className="m-0">
            Ce nu mai apare aici separat - valorile pe scurt, evoluția în timp,
            starea tastelor, Povești și curiozități - nu se pierde: totul este
            complet în <strong>„Progresul meu”</strong> al persoanei, iar acolo
            vedeți exact aceeași vedere ca persoana însăși.
          </p>
          <p className="m-0">
            <strong>Scorul:</strong> adună precizia și viteza persoanei într-un
            singur număr de la 0 la 100; o tastă greșită contează cât 5 caractere,
            viteza dublă contează doar de 1,4 ori - precizia bate viteza.
          </p>
          <p className="m-0">
            <strong>În tabelul clasei</strong> trei coloane stau împreună sub
            titlul <strong>„Exersare”</strong>: precizia, car./min și scorul. Toate
            trei vin din exersarea din perioada aleasă, iar scorul le adună pe
            celelalte două. De aceea sunt ușor colorate și încadrate de o linie
            fină; un cititor de ecran anunță „Exersare” înaintea titlului coloanei.
            Coloana <strong>„Provocare”</strong> din dreapta stă intenționat în
            afara acestui grup, sub titlul ei: este o Provocare într-o anumită zi, nu
            exersarea de zi cu zi.
          </p>
          <p className="m-0">
            În coloana <strong>„Scor”</strong>: cine a scris în perioada aleasă mai
            puțin de 200 de caractere nu primește scor, ci o linie orizontală - sub
            această limită, o singură tastă greșită ar hotărî mai multe puncte.
          </p>
          <p className="m-0">
            Butonul <strong>Descărcați în format Excel</strong> stă deasupra
            tabelului, în dreapta, lângă „De la început”. Descarcă tabelul ca fișier{" "}
            <strong>numeleclasei_data.xlsx</strong> (de exemplu
            „4B_2026-09-14.xlsx”) - indiferent ce perioadă este aleasă. La început
            este o prezentare cu linkuri spre cele patru perioade și o legendă care
            explică fiecare coloană și arată cum se calculează scorul. Urmează patru
            foi: anul școlar în curs, De la început, luna (ultimele patru săptămâni)
            și săptămâna aceasta. Valorile sunt în fișier ca numere, ca să puteți
            calcula mai departe în Excel; unde tabelul arată o linie orizontală,
            și fișierul are o linie orizontală.
          </p>
          <p className="m-0">
            <strong>Prezentarea clasei</strong>, deasupra tabelului, arată clasa ca
            întreg. „Lună” (ultimele patru săptămâni) este aleasă de la început,
            alături este „An școlar”. Un rând arată caractere pe minut, precizia și
            obiectivele săptămânale, fiecare cu o mică tendință - la lună față de
            cele patru săptămâni dinainte, la anul școlar primele față de ultimele
            săptămâni de exersare. Propoziția întreagă o arată sfatul de la cifră;
            un cititor de ecran o citește la număr, împreună cu elevii care nu au
            exersat în perioada respectivă.
          </p>
          <p className="m-0">
            <strong>Bara scorului „Scorul în clasă”</strong> arată un punct pentru
            fiecare persoană. Cu tasta Tab ajungeți pe bară, cu săgețile de la o
            persoană la alta - fiecare oprire se anunță („Mia, 78 de puncte”). Câte
            persoane au sub 50, între 50 și 70, între 70 și 85 și peste 85 de puncte
            și cine a scris prea puțin arată sfatul de la titlul ei.
          </p>
          <p className="m-0">
            <strong>Graficul liniar „Scorul clasei în anul școlar”</strong> arată
            pentru fiecare săptămână media persoanelor cu cel puțin 5 rânduri; o
            întrerupere a liniei înseamnă că în acea săptămână s-a exersat prea
            puțin. Cu tasta Tab ajungeți pe grafic, cu săgețile de la o săptămână la
            alta; pentru cititorul de ecran, toate săptămânile stau și într-un
            tabel. Când apar nou tasta Shift, cifrele sau semnele speciale, linia
            coboară pentru scurt timp - este de așteptat și nu e un motiv de
            îngrijorare.
          </p>
          <p className="m-0">
            <strong>Curba:</strong> este normal ca această curbă să nu urce tot
            timpul. Când apar taste noi, de obicei coboară mai întâi - mai ales la
            tasta Shift și la cifre.
          </p>
          <p className="m-0">
            <strong>Transparența datelor:</strong> fiecare persoană vede în
            „Progresul meu” exact aceleași valori despre sine - nu vedeți niciodată
            mai mult decât persoana însăși.
          </p>
        </Section>

        <Section title="8a · Valorile pe care vă puteți sprijini nota">
          <DreiWerteHilfe />
        </Section>

        <Section title="8b · Provocarea: același text pentru toată clasa">
          <p className="m-0">
            În secțiunea pentru cadre didactice <strong>„Clasele mele”</strong>, chiar
            sus în <strong>statistica clasei</strong> din Tastenflow, în lista de
            sarcini, se află butonul <strong>„Provocare”</strong>. El deschide
            formularul cu care porniți o Provocare pentru toată clasa -{" "}
            <strong>toți elevii primesc același text</strong>, indiferent cât de
            departe au ajuns în curs.
          </p>
          <p className="m-0">
            <strong>Se reglează trei lucruri:</strong> <strong>tastele folosite</strong>{" "}
            (de la șirul de bază până la „Toate tastele”), imediat alături{" "}
            <strong>felul</strong> și <strong>durata Provocării</strong> în minute.
            Butonul <strong>Începeți acum</strong> o pornește imediat.
          </p>
          <p className="m-0">
            <strong>Strict</strong> (alegerea inițială) este ca până acum: o tastă
            greșită nu avansează, fiecare tastă greșită contează - și una corectată
            imediat. <strong>Scriere liberă</strong> se potrivește unei copieri de
            text, ca o copiere clasică după model: greșelile
            rămân în text în timpul scrisului și nu se marchează, tasta Backspace
            corectează doar în rândul curent. Se evaluează abia la sfârșit ce mai
            este greșit - cel mult o greșeală pe cuvânt, ultimul cuvânt început nu
            contează, iar locurile corectate nu contează deloc. Pentru că o greșeală
            rămasă nu a costat timp, ea cântărește mai mult:{" "}
            {caractere(FEHLER_GEWICHT_FREI)} în loc de {caractere(FEHLER_GEWICHT)}{" "}
            (8a). Alegeți „Scriere liberă” când clasa trebuie să exerseze o copiere
            fără ca o tastă greșită să oprească scrisul; „Strict” pentru o
            verificare a drumurilor pe taste.
          </p>
          <p className="m-0">
            <strong>Trei ceasuri care trebuie ținute separat:</strong>
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Momentul pornirii</strong> - clipa în care apăsați Începeți
              acum. De aici, clasa poate începe.
            </li>
            <li>
              <strong>Intervalul de intrare</strong>: {minute(EINSTIEGSFENSTER_MIN)}{" "}
              de la momentul pornirii. Atât timp o persoană mai poate intra; cine
              vine mai târziu a întârziat.
            </li>
            <li>
              <strong>Durata Provocării</strong> merge pentru{" "}
              <strong>fiecare persoană separat</strong>, și anume abia de la{" "}
              <strong>prima ei apăsare de tastă</strong>. Doi elevi din aceeași clasă
              se opresc deci la ore diferite - intenționat: cine își caută întâi
              locul nu pierde timp din Provocare.
            </li>
          </ul>
          <p className="m-0">
            <strong>Textele:</strong> pentru fiecare nivel există{" "}
            <strong>{texteProvocare}</strong>, fiecare de cel puțin{" "}
            {caractere(MIND_ZEICHEN)} - atât de lungi încât textul nu se termină
            nici la viteză mare. Ele <strong>nu apar în curs</strong>, deci nimeni nu a
            putut să le exerseze dinainte. Următoarea Provocare a unui nivel începe
            acolo unde s-a oprit persoana care a ajuns cel mai departe în cea
            precedentă: la rândul următor, la textele cu propoziții la începutul
            propoziției următoare. Dacă un text se termină în timpul Provocării,
            elevii scriu fără pauză mai departe în următorul.
          </p>
          <p className="m-0">
            <strong>Copiii nevăzători:</strong> scriu Provocarea cu{" "}
            <strong>citirea cu voce tare a aplicației</strong> (<Kbd>Alt</Kbd> +{" "}
            <Kbd>V</Kbd>) - exact ca la exersare, fără o bifă separată a cadrului
            didactic. Timpul în care o persoană așteaptă vocea este scăzut de la
            sine din ceasul Provocării; o persoană care vede textul și totuși
            folosește citirea cu voce tare primește scăzut același timp.
          </p>
          <p className="m-0">
            <strong>Rezultatele</strong> stau în secțiunea deschisă de la
            „Provocări anterioare” - butonul „Provocare” din fața rândului o
            deschide: pentru fiecare persoană locul, <strong>scorul Provocării</strong>,
            dacă s-a folosit citirea cu voce tare, viteza, precizia și tastele
            nesigure. Cum se calculează scorul Provocării scrie la 8a. Imediat ce
            Provocarea s-a încheiat pentru <strong>toată clasa</strong>, vine în plus
            un <strong>e-mail centralizator</strong> cu aceleași valori. Abia atunci
            - un e-mail cât timp cineva încă scrie ar fi incomplet, iar un al doilea
            „de data asta chiar toți” nu vrea nimeni.
          </p>
          <p className="m-0">
            O persoană poate alege <strong>„De data asta nu particip”</strong>.
            Exersează atunci mai departe normal și apare în evaluare cu{" "}
            <strong>„fără participare”</strong>. Fiecare persoană își vede mai
            târziu propriile Provocări în <strong>„Progresul meu”</strong> -
            aceleași valori pe care le vedeți și dumneavoastră.
          </p>
        </Section>

        <Section title="9 · Lucru independent / verificare IA (doar pentru cadrul didactic)">
          <p className="m-0">
            Coloana <strong>„Lucru independent”</strong> arată o valoare de suspiciune{" "}
            <strong>1-10</strong>. Ea crește la semne de text care nu a fost scris de
            persoana însăși: <em>lipire</em> (din clipboard), schimbări dese de
            fereastră sau de focalizare, viteză neplauzibil de mare sau precizie
            perfectă fără evoluție în timp. Această valoare o vedeți{" "}
            <strong>doar dumneavoastră</strong>, nu și elevii.
          </p>
        </Section>

        <Section title="10 · Accesibilitate">
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Contrast și mărimea scrisului:</strong> din bara de sus
              (luminos, întunecat, contrast puternic); <Kbd>Alt</Kbd> + <Kbd>+</Kbd>{" "}
              / <Kbd>-</Kbd> mărește câmpul de scriere.
            </li>
            <li>
              <strong>Citire cu voce tare</strong> (vocea proprie a aplicației) cu{" "}
              <Kbd>Alt</Kbd> + <Kbd>V</Kbd> - pentru copiii fără un cititor de ecran
              instalat (cu NVDA, JAWS sau VoiceOver e mai bine să rămână oprită). Se
              poate alege dacă se citesc <em>literele, cuvintele sau propozițiile</em>,
              viteza și <strong>ce voce</strong>. Când limba textelor este engleza,
              aplicația trece automat la o voce în engleză; dacă lipsește, apare un
              ghid de instalare. <strong>Timpul citirii nu se socotește la
              viteză</strong> - elevii care învață braille și au nevoie de citirea cu
              voce tare nu sunt astfel dezavantajați la numărul de apăsări și în
              statistică.
            </li>
            <BrailleTabellenPunkte weg="ro" />
            <li>
              <strong>Anunțul degetului:</strong> apăsarea scurtă, de două ori, a
              tastei <Kbd>Shift</Kbd> anunță degetul potrivit.
            </li>
            <li>
              <strong>Conducerea focalizării:</strong> fiecare buton are o țintă
              stabilită - cine îl apasă știe apoi unde stă cursorul. Pentru elevii
              care lucrează cu afișaj braille, asta e diferența dintre a lucra mai
              departe și a căuta. Trei reguli care se observă la oră:{" "}
              <Kbd>Esc</Kbd> închide orice fereastră și duce{" "}
              <strong>mereu înapoi în câmpul de scriere</strong>; o schimbare de
              vedere (statistică, bibliotecă, conectare) ajunge pe{" "}
              <strong>titlul noii vederi</strong> și îl anunță; și{" "}
              <strong>nimic nu dispare de la sine</strong> - nici sărbătoarea unei
              taste deblocate, care așteaptă până când persoana apasă Mai departe.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>E</Kbd> sare în câmpul de scriere,{" "}
              <Kbd>Alt</Kbd> + <Kbd>H</Kbd> deschide ajutorul.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>U</Kbd> trece la exersare, <Kbd>Alt</Kbd> +{" "}
              <Kbd>S</Kbd> la <strong>„Clasele mele”</strong> (la exersare: la
              statistica proprie); <Kbd>Alt</Kbd> + <Kbd>Z</Kbd> anunță al câtelea
              rând este acum.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>D</Kbd> spune timpul de exersare - pe afișajul
              braille și (cu citirea cu voce tare) ca anunț.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>T</Kbd> deschide sau închide{" "}
              <strong>lista de comenzi rapide</strong>.
            </li>
          </ul>
        </Section>

        <Section title="11 · Ștergere">
          <p className="m-0">
            Persoane individuale sau o clasă întreagă se pot șterge definitiv (cu
            cont, progres și evaluare). Acest lucru nu se poate anula - aplicația
            întreabă înainte.
          </p>
        </Section>

        <Section title="12 · Descărcări: ghid și afiș (PDF)">
          <p className="m-0">
            Tot ce este în acest ajutor, și mult mai mult, se află în{" "}
            <strong>ghidul pentru cadre didactice</strong>: parcursul de învățare cu
            toți pașii și toate ordinile, toate poveștile și seriile de curiozități
            cu momentul în care se deschid, toate medaliile și sistemele de
            recompense, plus o <strong>listă de verificare „Este clasa mea gata de
            pornire?”</strong> și un <strong>model de copiat pentru progresul
            fiecărei persoane</strong>.
          </p>
          <HandbuchLaden />
          <p className="m-0 text-sm text-ink-muted">
            Ghidul se generează direct din conținutul aplicației - un mecanism de
            control din codul sursă impune ca el să fie actualizat la fiecare
            schimbare de conținut. Astfel este mereu complet și actual.
          </p>
          <p className="m-0">
            Pentru peretele clasei sau al cancelariei există{" "}
            <strong>afișul Tastenflow de pus pe perete la școală</strong>: A3
            vertical, de imprimat - dintr-o privire ce poate Tastenflow, cu un cod QR
            spre tastenflow.org. Afișul este în limba română. Spre
            deosebire de ghid, este liber pentru toți, și fără conectare: elevii îl
            găsesc în ajutorul lor, iar adresa tastenflow.org/tastenflow-plakat-ro.pdf
            o puteți da mai departe oricărei școli și instituții.
          </p>
          <PlakatLaden />
          <p className="m-0 text-sm text-ink-muted">
            Ambele se află și în „Clasele mele”, la „Descărcări”.
          </p>
        </Section>
      </div>
    </div>
  );
}
