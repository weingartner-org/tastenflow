/**
 * ★★★ O-HILFE-RO (25.10.2026): DAS HILFE-FENSTER FÜR DIE LERNENDEN, RUMÄNISCH.
 * ===========================================================================
 * Aufbau wie `TippenHilfe.cs.tsx` (dieselben Abschnitte, `detail`-Stufen,
 * `isAdult`/`jugend`-Fälle), der INHALT nach der deutschen `TippenHilfeDeutsch`
 * - wo cs und de abweichen, gilt de (Auftrag O-HILFE Punkt 2). Darum steht hier
 * wie im Deutschen: die falsche Umschalttaste und die Feststelltaste geben einen
 * kleinen Buchstaben und zählen als Fehler (`merkfensterTexte.ts`, Gegenhand-Regel
 * in allen Sprachen). Wie die anderen Übersetzungen ohne den Einführungs-Podcast
 * (die rumänische Bedienung hat keinen) und ohne den Absatz über die 24 deutschen
 * Lektionen (er beschreibt den Weg „de").
 *
 * ── ANREDE UND GESCHLECHT (Glossar `recherche-rumänisch-2026-10-25/GLOSSAR-ro.md`) ──
 * Immer **tu** - Kinder, Jugendliche UND Selbstlernende (Regel 1). Knöpfe im
 * Imperativ Mehrzahl, wie sie in der Oberfläche heissen („Jucați", „Predați",
 * „Ieșiți"), im Satz ohne Anführung. Kein Adjektiv und kein Partizip am Kind
 * (Regel 2): kein „singur", „pregătit", „însuți"; das Perfekt mit „a avea" ist
 * frei („ai scris"). Die Lehrkraft heisst „cadrul didactic" (Regel 2), nur im
 * Nominativ/Akkusativ. Tastennamen wie auf der Kappe, immer mit „tasta" davor
 * (Regel 11); die Leertaste heisst „bara de spațiu". Ausrufezeichen nur in Sätzen,
 * die allein Kinder sehen, höchstens eines je Absatz.
 *
 * ── WAS RUMÄNISCH ANDERS IST ───────────────────────────────────────────────
 *  · Die Tastaturen (`layouts.ts`, `ro`, `ro-prog`, nur gelesen; Befund G3b):
 *    Standard - ă î rechts neben P, â über der Eingabetaste, ș ț rechts neben L;
 *    Programmierer - ă â î ș ț mit Alt Gr + A / Q / I / S / T. Mehr wird nicht
 *    behauptet (Mac und Legacy sind ungemessen bzw. kein Lernweg-Layout).
 *  · ă â î ș ț sind gewöhnliche Buchstaben, kein Ersatz (Bauplan R3, R5) - die
 *    Hilfe sagt es mit den Wortpaaren sa/să, si/și.
 *  · Die Reihenfolge des Weges „ro" entsteht parallel (F4): die Hilfe zeigt die
 *    Buchstaben des Weges (`layoutLetterOrder`) und nennt nur die Grobfolge.
 *  · Das Plakat gibt es seit 06.11.2026 auf Rumänisch (`handbuchInSprache`).
 *  · Keine „1"/„2" vor einem Hauptwort, das vorgelesen wird (Regel 5): „între una
 *    și trei stele", „două runde", „douăsprezece rânduri".
 *  · ș ț nur mit KOMMA (U+0219/U+021B), nie mit Cedille (Glossar Regel 7).
 *
 * Fliesstext mit rumänischer Anführung „…” (U+201E/U+201D), nur Bindestrich, keine Maus-Wörter.
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

// ★ O-HILFE-RO (25.10.2026): das Wort der Tippchallenge (Glossar §2.3, Bauplan R13) -
// wie `VYZVA` in der tschechischen Hilfe. Mehrzahl „Provocări".
const PROVOCARE = "Provocare";
const PROVOCARI = "Provocări";

export function TippenHilfeRumaenisch({ open, onClose, stufe, lernweg = "ro" }: TippenHilfeProps) {
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
  // Dasselbe Wort wie der Ring (Glossar §2.2: „nivel de joc" für Kinder, sonst „nivel").
  const ringWort = kind ? "nivel de joc" : "nivel";
  const ringWortDein = kind ? "nivelul tău de joc" : "nivelul tău";
  const ringWortNaechst = kind ? "nivelul de joc următor" : "nivelul următor";
  // Drei Formen (Glossar §2.11); die Einzahl als Wort (Regel 5, Prüfer 25.10.).
  const einstiegsMinuten = mehrzahl(EINSTIEGSFENSTER_MIN, "ro", {
    one: () => "un minut",
    few: (z) => `${z} minute`,
    other: (z) => `${z} de minute`,
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Ajutor pentru Tastenflow"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        className="card my-8 w-full max-w-2xl space-y-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="m-0 text-xl font-semibold text-ink">Ajutor - cum funcționează Tastenflow</h2>
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

        <RundgangNochmalKnopf onStart={onClose} />

        <Section title="Începe pur și simplu să scrii">
          <p className="m-0">
            Nu trebuie să alegi mai întâi câmpul de scriere. Începe pur și simplu să
            scrii - prima literă ajunge direct în câmp. Dacă ești în altă parte, cu{" "}
            <Kbd>Alt</Kbd> + <Kbd>E</Kbd> te întorci imediat în câmpul de scriere.
          </p>
          <JawsRueckweg weg="ro" />
          {detail === 1 && (
            <p className="m-0">
              Scrie mereu cu degetul potrivit - tastatura de jos îți arată ce tastă
              urmează. Apasă scurt de două ori tasta <Kbd>Shift</Kbd> și auzi cu ce
              deget se scrie.
            </p>
          )}
        </Section>

        <Section title="Aceste semne apar în text">
          <Zeichenerklaerung
            titel={null}
            zeichen={[
              { zeichen: "·", bedeutung: "desparte două informații care țin una de alta - ca o virgulă." },
              { zeichen: "→", bedeutung: "apoi, sau: din asta rezultă." },
              { zeichen: "⏱", bedeutung: "timpul în care ai exersat." },
              {
                zeichen: "↵",
                bedeutung:
                  "apare la sfârșitul rândului, dacă așa e setat în clasa ta - atunci închei rândul cu tasta Enter.",
              },
            ]}
          />
        </Section>

        <Section title="Adună stele 🌟">
          <p className="m-0">
            După fiecare rundă primești <strong>între una și trei stele</strong> - și un
            sunet doar al lor.{" "}
            <strong>Puține greșeli contează mult mai mult decât viteza:</strong> scrisul
            liniștit și precis aduce stele sigure - graba și greșelile dese, nu.
            {kind ? " Orice copil poate aduna stele!" : ""}
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Trei stele primești pentru o rundă cu adevărat bună - scrisă precis și
              într-un ritm bun, iar <strong>precizia</strong> e mereu mai importantă
              decât <strong>viteza</strong>. Când îți ies o vreme runde bune, urci un{" "}
              <strong>nivel de dificultate</strong> - atunci recompensa sună puțin
              altfel.
            </p>
          )}
        </Section>

        <Section title="Adună medalii 🏅">
          <p className="m-0">
            Pentru reușite deosebite primești <strong>medalii</strong> - de exemplu
            pentru o rundă fără nicio greșeală sau pentru trei runde curate la rând. La
            o medalie nouă se aude un <strong>„ta-daa”</strong> special, iar numele ei
            se anunță.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Toate medaliile sunt în <strong>„Progresul meu”</strong>, imediat după
              obiectivele săptămânale și valorile tale - acolo vezi mereu și{" "}
              <strong>următoarea țintă</strong> (de exemplu: încă două runde fără
              greșeli până la medalia următoare). Cele mai multe medalii sunt pentru{" "}
              <strong>scrisul precis</strong> și pentru <strong>perseverență</strong> -
              nu pentru grabă. Iar câteva sunt <strong>secrete</strong>: condiția lor
              nu e scrisă nicăieri, pur și simplu apar într-o zi.
            </p>
          )}
          {detail >= 2 && (
            <p className="m-0">
              Tot acolo este și <strong>scorul</strong> tău: el adună precizia și
              viteza într-un singur număr de la 0 la 100; o tastă greșită contează cât
              5 caractere, viteza dublă contează doar de 1,4 ori - precizia bate
              viteza.
            </p>
          )}
          {detail >= 2 && (
            <p className="m-0">
              Mai jos, „Evoluție în timp” (un rând care se deschide) arată o curbă
              mică. E normal ca această curbă să nu urce tot timpul. Când apar taste
              noi, de obicei coboară mai întâi - mai ales la tasta Shift și la cifre.
            </p>
          )}
          <p className="m-0">
            Sfat: selectează o medalie în Progresul meu și apasă tasta{" "}
            <Kbd>Enter</Kbd> - medalia apare <strong>mare</strong>, cu strălucire și
            confetti.
          </p>
        </Section>

        {skin === "jugend" && (
          <Section title="După o tastă nouă">
            <p className="m-0">
              O <strong>tastă nouă</strong> e a ta imediat ce tastele de până acum sunt
              sigure - nu trebuie să câștigi nimic pentru asta. Se sărbătorește puțin,
              apoi se exersează mai departe. Altceva nu se întâmplă.
            </p>
            <p className="m-0">
              Dacă vrei, după aceea poate urma un joc scurt: <strong>Sloiuri de gheață</strong>.
              Hotărăști tu - în <strong>Setări</strong> (<AltText>Alt + O</AltText>), la{" "}
              <strong>Joc-recompensă</strong>. La început este ales{" "}
              <strong>Niciunul</strong>. Setarea este valabilă pentru acest dispozitiv.
            </p>
          </Section>
        )}

        {!isAdult && (
          <Section title="Sloiuri de gheață 🐧">
            {skin === "jugend" ? (
              <>
                <p className="m-0">
                  Poți <strong>porni jocul oricând</strong> - cu butonul{" "}
                  <strong>🐧 Jucați</strong> din bara de sub câmpul de scriere.
                  Pinguinul sare peste sloiuri, urcă pe muntele de litere și alunecă pe
                  burtă la vale - mereu cu tastele care îți sunt acum cele mai grele. Pe
                  drum sar <strong>pești bonus</strong> (tasta apăsată la timp = pește
                  prins; un pește scăpat nu e niciodată o greșeală), iar în{" "}
                  <strong>Peștera ecoului</strong> fiecare tastă doar se anunță. Jocul{" "}
                  <strong>nu</strong> se socotește la timpul de exersare și nu e o
                  condiție pentru caractere noi - dar are medalii proprii.
                </p>
                <p className="m-0">
                  După o tastă nouă, jocul pornește de la sine <strong>doar</strong> dacă
                  l-ai ales în Setări ca <strong>Joc-recompensă</strong>. Altfel nu te
                  întrerupe nimic - tu hotărăști când se joacă.
                </p>
              </>
            ) : (
              <>
                <p className="m-0">
                  Când ai reușit o <strong>tastă nouă</strong>, te așteaptă la
                  sărbătoare jocul Sloiuri de gheață: ajută pinguinul să treacă apa -
                  apasă mereu tasta scrisă pe sloiul următor! Uneori drumul urcă apoi
                  chiar pe <strong>muntele de litere</strong> și coboară din nou pe
                  burtă. Tasta nouă e a ta încă dinainte - jocul e o recompensă, nu o
                  obligație.
                </p>
                <p className="m-0">
                  Poți și să <strong>pornești jocul oricând</strong> - cu butonul{" "}
                  <strong>🐧 Jucați</strong>, sus pe cartonașul tău de exersare, chiar
                  lângă cerc. Aceasta e marea <strong>aventură</strong>: arată în
                  fiecare zi puțin altfel, pe drum sar <strong>pești bonus</strong>{" "}
                  (apeși repede tasta lor = pește prins), iar în{" "}
                  <strong>Peștera ecoului</strong> nu vezi nicio literă -{" "}
                  {hoehleMitWesen ? (
                    <>
                      peștera îți <strong>spune</strong> fiecare tastă.
                    </>
                  ) : (
                    <>
                      fiecare tastă sună ca un ton, iar cititorul de ecran sau afișajul
                      braille îți <strong>spune</strong> care este.
                    </>
                  )}{" "}
                  Jocul e doar de distracție și <strong>nu</strong> se socotește la
                  timpul de exersare - dar aduce medalii proprii!
                </p>
                {detail >= 2 && (
                  <p className="m-0">
                    Nicio grijă: dacă un sloi se scufundă sau aluneci pe munte,
                    pinguinul înoată pur și simplu înapoi - poți încerca imediat din
                    nou, de câte ori vrei. Iar cine trece toată aventura fără nicio
                    cădere în apă vede la iglu cum dansează <strong>aurora polară</strong>!
                  </p>
                )}
              </>
            )}
          </Section>
        )}

        <Section title="Ce înseamnă cercul cu numărul?">
          <p className="m-0">
            Numărul din cerc este <strong>{ringWortDein}</strong>.{" "}
            <strong>{kind ? "XP sunt puncte pentru exersare:" : "Punctele sunt pentru exersare:"}</strong>{" "}
            pentru fiecare rundă primești câteva, iar cercul se umple. Când e plin (100
            de puncte), urci la {ringWortNaechst}. E doar de adunat și{" "}
            <strong>nu</strong> face exersarea mai grea - ca punctele dintr-un joc.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Nu confunda asta cu <strong>nivelul de dificultate (1-50)</strong>: el
              arată cât de repede ar trebui să scrii și se potrivește{" "}
              <strong>de la sine</strong> după tine - urcă atunci când merge bine și
              devine mai ușor atunci când e greu.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0">
              Iar setarea <strong>„Texte pentru”</strong> (7-10 ani, 11-15 ani, de la 16
              ani) arată doar cât de grele sunt cuvintele și propozițiile - potrivite
              cu vârsta. Într-o clasă o alege cadrul didactic pentru toți; fără clasă o
              găsești sus, în Setări ⚙. Deci trei lucruri diferite: <em>{ringWort}</em>{" "}
              = puncte, <em>nivel de dificultate</em> = viteza cerută,{" "}
              <em>Texte pentru</em> = vârsta.
            </p>
          )}
        </Section>

        <Section
          title={detail === 1 ? "Cât de des să exersezi?" : "Timpul de exersare și obiectivul săptămânal"}
        >
          {detail === 1 ? (
            <p className="m-0">
              Exersează mai bine <strong>des și puțin</strong> decât o dată foarte mult
              - de exemplu câteva minute în mai multe zile. În bara de sub câmpul de
              scriere, un ceas numără cât ai scris azi; exact acest timp umple acolo
              și <strong>cercul</strong> - obiectivul tău săptămânal.
            </p>
          ) : (
            <p className="m-0">
              Cu un cont poți avea un <strong>obiectiv săptămânal</strong>: un anumit
              număr de <strong>minute pe săptămână</strong>. Într-o clasă îl stabilește
              cadrul didactic; fără clasă îl poți stabili tu, în Setări ⚙, la
              „Obiectivul meu săptămânal” - un obiectiv nou e valabil de lunea
              următoare. Săptămâna începe <strong>luni la ora 8:00</strong> și ține
              până lunea următoare, la aceeași oră. În bara de sub câmpul de scriere
              vezi stadiul tău ca <strong>cerc</strong>, de exemplu „25/60 min” - când
              săptămâna e reușită, cercul e plin și are o bifă. Uneori mai sunt și
              minute dintr-o săptămână trecută de <strong>recuperat</strong>; atunci
              scrie alături câte. Când obiectivul săptămânal e atins, apare o fereastră
              scurtă cu felicitări - apoi poți exersa mai departe oricând, dacă vrei.
            </p>
          )}
        </Section>

        <Section title="Setări: butonul ⚙ din partea de sus">
          <p className="m-0">
            Toate setările sunt în spatele butonului <strong>⚙ Setări</strong>, chiar
            sus, imediat la stânga semnului rotund cu inițiala ta:{" "}
            <strong>Ce exersezi?</strong>, <strong>Texte</strong> (vârsta și limba),{" "}
            <strong>Tastatură</strong>, <strong>Sunet</strong> și{" "}
            <strong>Citire cu voce tare</strong>. O apăsare le deschide, încă una le
            închide - sau cu <Kbd>Alt</Kbd> + <Kbd>O</Kbd> (de la „Opțiuni”), merge și
            în mijlocul scrisului. La deschidere, cursorul sare direct în setări, la
            închidere înapoi în câmpul de scriere.
          </p>
          <p className="m-0">
            Chiar sus în Setări este <strong>„Ce exersezi?”</strong>: cele trei drumuri{" "}
            <strong>Antrenamentul meu</strong>, <strong>Povești</strong> și{" "}
            <strong>Jocuri cu cuvinte</strong>. Cu <Kbd>Alt</Kbd> + <Kbd>B</Kbd> treci pe
            rând la drumul următor, iar drumul nou se anunță.
          </p>
          <p className="m-0">
            Butonul rotund cu globul pământesc din partea de sus schimbă limba
            aplicației Tastenflow - butoanele, meniurile și imediat și textele de
            exersare. Limba textelor o poți schimba apoi separat, la{" "}
            <strong>Texte</strong>, dacă nu a fixat-o cadrul didactic.
          </p>
          <p className="m-0">
            La <strong>Tastatură</strong> alegi tastatura care stă cu adevărat în fața
            ta. Pentru română sunt două: <strong>Română (standard)</strong> și{" "}
            <strong>Română (programatori)</strong>. Apoi tastatura de pe ecran și
            indicațiile pentru degete se potrivesc - și apar doar caracterele care
            există pe acea tastatură. Cel mai important despre tastaturile românești:
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              Pe <strong>Română (standard)</strong>, ă și î sunt în dreapta tastei P, â
              deasupra tastei <Kbd>Enter</Kbd>, iar ș și ț în dreapta tastei L - cu
              virgula dedesubt, cum e corect. Ghilimelele „ și ” sunt în stânga tastei
              1 (” cu tasta Shift).
            </li>
            <li>
              Pe <strong>Română (programatori)</strong> scrii literele românești cu
              tasta <Kbd>Alt Gr</Kbd> (Alt din dreapta) și litera de bază: ă = Alt Gr +
              A, â = Alt Gr + Q, î = Alt Gr + I, ș = Alt Gr + S, ț = Alt Gr + T. Pentru
              literă mare se adaugă tasta Shift. În rest, este tastatura engleză (SUA).
            </li>
            <li>
              <strong>ă, â, î, ș și ț</strong> sunt litere obișnuite, nu un înlocuitor:
              „sa” și „să”, „si” și „și” sunt cuvinte diferite. De aceea aplicația
              așteaptă exact litera din text.
            </li>
            <li>
              Pe tastatura standard, Ă Î Â Ș Ț sunt toate în partea dreaptă - pentru
              literele mari ții tasta <Kbd>Shift</Kbd> din stânga.
            </li>
          </ul>
          <p className="m-0">
            Tot acolo este și <strong>„Scriere cu o mână”</strong> - pentru toți cei
            care scriu cu o mână: atunci literele mari și semnele speciale merg cu
            oricare tastă Shift. Într-o clasă, asta o stabilește cadrul didactic.
          </p>
          <p className="m-0">
            Cu <strong>„Spațiere mare între caractere (CVI)”</strong>, în timpul
            scrisului se întunecă tot în afară de câmpul în care se scrie acum (rândul
            de exersare sau terenul de joc); după 5 secunde fără scris, se luminează din
            nou. Rândul de exersare alunecă atunci lin, în ritmul tău de scris, în loc
            să sară. Spațierea dintre caractere o poți regla oricând în Setări ⚙ -
            într-o clasă o poate regla și cadrul didactic; contează ce s-a ales ultima
            dată.
          </p>
          <p className="m-0">
            Cu <strong>Exercițiu țintit</strong> poți alege cel mult 8 taste sau caractere care apar deosebit de des în runde - în setări, la <strong>Ce exersezi?</strong>, sau cu <Kbd>Alt</Kbd> + <Kbd>2</Kbd>. Într-o clasă, îl setează profesorul tău.
          </p>
        </Section>

        <Section title="Citire cu voce tare - aplicația citește">
          <p className="m-0">
            Cu <strong>🗣 Citire cu voce tare</strong> (sau <Kbd>Alt</Kbd> +{" "}
            <Kbd>V</Kbd>) aplicația citește cu voce tare - pentru toți cei care (încă)
            nu folosesc un cititor de ecran. Sus, în Setări ⚙, poți alege dacă se citesc{" "}
            <strong>literele</strong>, <strong>cuvintele</strong> sau{" "}
            <strong>propozițiile</strong> - una, mai multe sau toate - și cât de repede.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              La <strong>„Voce”</strong> poți alege altă voce. Când limba textelor este{" "}
              <strong>engleza</strong>, aplicația caută automat o voce în engleză; dacă
              nu e instalată niciuna, apare un ghid scurt pentru adăugarea ei.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0">
              Nicio grijă pentru viteză: <strong>timpul citirii nu se socotește</strong> -
              așteptarea anunțului nu îți încetinește viteza.
            </p>
          )}
        </Section>

        <Section title="Melodie la scriere 🎵">
          <p className="m-0">
            <strong>Melodia la scriere</strong> te ajută să exersezi un <strong>ritm de scris egal</strong> - și trebuie să fie <strong>distractivă</strong>. Fiecare tastă corectă cântă nota următoare dintr-un cântec; cine ține ritmul primește chiar și o formație care cântă alături.
          </p>
          <p className="m-0">
            Cine scrie într-un ritm egal devine mai fluent și la tastele mai slabe: ritmul te poartă peste locurile unde altfel ai ezita.
          </p>
          <p className="m-0">
            O pornești cu <Kbd>Alt</Kbd> + <Kbd>6</Kbd>, în Setări ⚙ sau în meniul de sub butonul rotund cu difuzorul, sus - acolo se reglează și volumul tuturor sunetelor, cu glisoare. Sunetul se schimbă cu <Kbd>Alt</Kbd> + <Kbd>7</Kbd> și <Kbd>Alt</Kbd> + <Kbd>8</Kbd>.
          </p>
        </Section>

        <Section title="Litere mari și semne de punctuație">
          <p className="m-0">
            Româna are nevoie de <strong>litere mari</strong> - la începutul propoziției
            și la nume proprii (Ana, Iași, Dunărea). Tastenflow le scrie în text{" "}
            <strong>mereu corect</strong>, așa că nu vezi niciodată un cuvânt scris
            greșit.
          </p>
          <p className="m-0">
            <strong>La început, foarte ușor:</strong> scrie pur și simplu litera{" "}
            <strong>mică</strong> - cea <strong>mare</strong> apare de la sine. Tasta{" "}
            <Kbd>Shift</Kbd> <strong>nu</strong> trebuie s-o știi încă.
          </p>
          <p className="m-0">
            <strong>Curând</strong>, după primele litere, înveți tasta <Kbd>Shift</Kbd>{" "}
            „de-adevăratelea”: o ții cu <strong>o</strong> mână și scrii litera cu{" "}
            <strong>cealaltă</strong> - ca pe orice tastatură. Așa poți scrie curând
            literele mari <strong>cu degetele tale</strong>, nu doar cu ajutorul
            automat.
          </p>
          <div className="rounded-lg border border-hairline bg-surface-raised p-3">
            <p className="m-0">
              <strong>Important - mereu tasta Shift a CELEILALTE mâini:</strong> sunt
              două taste Shift, la stânga și la dreapta. Scrii litera cu o mână și ții
              tasta <Kbd>Shift</Kbd> cu <strong>cealaltă</strong>. Așa nicio mână nu
              trebuie să apese ambele taste.
            </p>
            <p className="m-0 mt-2">
              Exemplu: <strong>A</strong> mare (mâna stângă) → tasta <Kbd>Shift</Kbd>{" "}
              din <strong>dreapta</strong>. <strong>K</strong> mare (mâna dreaptă) →
              tasta <Kbd>Shift</Kbd> din <strong>stânga</strong>.
            </p>
            <p className="m-0 mt-2">
              Tastenflow primește <strong>doar tasta Shift potrivită</strong>. Dacă
              folosești tasta Shift <strong>de pe aceeași parte</strong> sau tasta{" "}
              <Kbd>Caps Lock</Kbd>, apare o literă <strong>mică</strong> - asta
              contează ca <strong>greșeală</strong>, ca să exersezi mâna potrivită de la
              început.
            </p>
          </div>
          {detail >= 2 && (
            <p className="m-0 text-sm text-ink-muted">
              Sfat: apasă tasta <Kbd>Shift</Kbd> <strong>scurt, de două ori</strong> -
              atunci se anunță cu ce deget o ții.
            </p>
          )}
          <p className="m-0">
            <strong>Punctul, virgula și semnul întrebării</strong> apar abia după ce
            le-ai învățat. Până atunci citești propoziția pur și simplu{" "}
            <strong>fără ele</strong> - e intenționat, nu e o greșeală.
          </p>
        </Section>

        <Section title="În ce ordine vin literele?">
          <p className="m-0">
            Tastele noi se adaugă mereu în aceeași ordine: mai întâi{" "}
            <strong>poziția de bază</strong>, apoi celelalte litere, după cât de des
            apar. Ce tastă urmează vezi mereu în dreapta, în bara de sub câmpul de
            scriere: <strong>„Tasta următoare”</strong>.
          </p>
          <div className="flex flex-wrap gap-1" aria-hidden="true">
            {letters.map((ch) => (
              <Kbd key={ch}>{unitGlyph(ch)}</Kbd>
            ))}
          </div>
          <p className="m-0 text-sm text-ink-muted">
            Deja <strong>după primele litere</strong> vin <strong>literele mari</strong>{" "}
            (tasta Shift) și imediat după ele <strong>punctul și virgula</strong> - o
            propoziție începe cu literă mare și se termină cu punct. Apoi celelalte
            litere; ă, î, â, ș și ț vin printre ele, ca litere obișnuite. La sfârșit
            urmează celelalte <strong>semne de punctuație</strong> (- ? ! : ;),{" "}
            <strong>cifrele</strong> și <strong>simbolurile</strong>.
          </p>
          <span className="sr-only">
            Ordinea: primele litere, apoi literele mari (tasta Shift), apoi punctul și
            virgula, apoi celelalte litere, după aceea celelalte semne de punctuație,
            cifrele și simbolurile. Ordinea literelor:{" "}
            {letters.map((c) => unitGlyph(c)).join(", ")}.
          </span>
        </Section>

        {detail >= 2 && (
          <Section title="Cum funcționează „Antrenamentul meu”">
            <p className="m-0">
              <strong>Se potrivește cu tine.</strong> Programul ține minte ce taste mai
              sunt nesigure și le exersează exact pe acelea. O tastă nouă vine abia
              când celelalte sunt sigure. Literele <strong>cele mai frecvente</strong>{" "}
              vin primele - așa scrii după doar câteva taste{" "}
              <strong>cuvinte și propoziții adevărate</strong>, iar primele{" "}
              <strong>povești</strong> se deschid devreme.
            </p>
          </Section>
        )}

        <Section title="Bara de sub câmpul de scriere">
          <p className="m-0">
            Sub câmpul de scriere este o bară îngustă cu patru lucruri:{" "}
            <strong>{ringWortDein}</strong>, <strong>timpul</strong> exersat azi,{" "}
            <strong>obiectivul săptămânal</strong> și <strong>tasta următoare</strong>.
            La obiectivul săptămânal, cercul arată câte <strong>minute</strong> ai
            exersat săptămâna aceasta - de exemplu „25/60 min”; o <strong>bifă</strong>{" "}
            înseamnă: săptămâna e reușită. Tasta următoare se deschide{" "}
            <strong>de la sine</strong> imediat ce tastele de până acum sunt sigure -
            exersează pur și simplu mai departe.
          </p>
          <p className="m-0">
            Bara este <strong>mereu</strong> acolo - și în timp ce scrii. Așa nu sare
            nimic și vezi oricând cât ai exersat deja.
          </p>
          <p className="m-0">
            <Kbd>Alt</Kbd> + <Kbd>D</Kbd> anunță timpul de exersare și obiectivul
            săptămânal. Ce taste sunt deja sigure, care încă nu și care urmează vezi în{" "}
            <strong>„Progresul meu”</strong>, la <strong>„Starea tastelor”</strong>{" "}
            (<Kbd>Alt</Kbd> + <Kbd>S</Kbd>, cu cont).
          </p>
        </Section>

        <Section title="Biblioteca: „Povești și curiozități” 📖">
          <p className="m-0">
            Pe lângă „Antrenamentul meu” mai este un drum: <strong>Povești</strong> -
            în Setări ⚙, la <strong>„Ce exersezi?”</strong>. Acolo te așteaptă povești
            întregi și serii de curiozități - nu propoziții separate, ci{" "}
            <strong>o poveste pe parcursul multor runde</strong>. Fiecare parte are
            douăsprezece rânduri; data viitoare citești mai departe exact de unde ai
            rămas.
          </p>
          <p className="m-0">
            Apare doar ce poți scrie cu adevărat cu tastele învățate deja - de aceea la
            început se văd încă lacăte. Ele se deschid de la sine imediat ce destule
            taste sunt sigure. Fiecare rând vine <strong>o singură dată</strong>: ce ai
            scris nu se mai întoarce ca repetare.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              <strong>Firul roșu:</strong> ce ai citit într-o serie de curiozități
              revine mai târziu în antrenament - ca <strong>întrebare cu alte cuvinte</strong>,
              apoi ca mică aprofundare și la sfârșit ca o glumă potrivită. Așa ce ai
              învățat rămâne în minte, fără să pară o ascultare la lecție.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0 text-sm text-ink-muted">
              Sub listă este „Surse și mulțumiri”: acolo vezi de unde vin textele.
              Unele sunt scrise special pentru acest program, altele vin din surse
              libere - acestea sunt numite acolo, cum se cuvine.
            </p>
          )}
        </Section>

        <Section title="De unde vin textele? 🤖">
          <p className="m-0">
            Textele proprii ale acestui program, adică propozițiile de exersat, glumele
            și poveștile, le-a scris Johannes{" "}
            <strong>cu ajutorul inteligenței artificiale (IA)</strong>, apoi le-a citit
            și verificat personal. Textele din alte surse (de exemplu Wikipedia sau
            Klexikon) sunt trecute cu numele sursei la „Surse și mulțumiri”.
          </p>
          <p className="m-0">
            {hoehleMitWesen ? (
              <>
                Și peștele care cântă, și monstrul care murmură din Expediția polară
                sunt <strong>voci de calculator</strong>, nu oameni adevărați.
              </>
            ) : (
              <>
                Și peștele care cântă din Expediția polară este o{" "}
                <strong>voce de calculator</strong>, nu un om adevărat.
              </>
            )}{" "}
            Citirea cu voce tare (🗣) folosește vocea dispozitivului tău.
          </p>
        </Section>

        <Section title="Provocarea">
          <p className="m-0">
            Uneori, cadrul didactic pornește o <strong>{PROVOCARE}</strong> - pentru
            toată clasa. <strong>Toți primesc același text</strong> și toți au la fel de
            mult timp.
          </p>
          <p className="m-0">
            <strong>Timpul pornește abia de la prima ta apăsare de tastă</strong> - nu
            deja când cadrul didactic pornește Provocarea. De la pornire ai{" "}
            <strong>{einstiegsMinuten}</strong> ca să începi.
          </p>
          <p className="m-0">
            <strong>Cum o recunoști:</strong> deasupra câmpului de scriere scrie
            cuvântul <strong>{PROVOCARE}</strong>, alături timpul, iar în jurul întregii
            zone este alt chenar, <strong>cu linie întreruptă</strong>. Imediat ce
            timpul a expirat, amândouă dispar.
          </p>
          <p className="m-0">
            <strong>Cât timp a mai rămas, fără să te uiți:</strong> <Kbd>Alt</Kbd> +{" "}
            <Kbd>X</Kbd> îți spune. De la sine, ceasul se anunță doar de câteva ori,
            altfel tace.
          </p>
          <p className="m-0">
            <strong>Afișajul braille rămâne liniștit.</strong> Timpul{" "}
            <strong>nu</strong> ticăie pe afișaj: merge sus, dar nu intră niciodată în
            ce citești chiar acum.
          </p>
          <p className="m-0">
            <strong>Uneori Provocarea este „Scriere liberă”.</strong> Atunci o greșeală
            rămâne pur și simplu în text - nu se marchează nimic, niciun sunet nu o
            anunță. Tasta <Kbd>Backspace</Kbd> corectează doar în rândul curent; un
            rând terminat rămâne cum e. La sfârșitul rândului apeși bara de spațiu după
            ultimul cuvânt - sau, dacă în clasă e setat „Sfârșit de rând cu tasta
            Enter”, tasta <Kbd>Enter</Kbd>. Ce mai e greșit la sfârșit arată abia
            rezumatul de după, ca listă de citit.
          </p>
          <p className="m-0">
            <strong>Te oprești mai devreme:</strong> <Kbd>Esc</Kbd> te întreabă mai
            întâi. Butonul <strong>Scrieți mai departe</strong> (și <Kbd>Esc</Kbd>) te
            duce înapoi în rând, butonul <strong>Predați</strong> predă Provocarea - se
            evaluează ce ai scris până atunci. Același lucru face butonul{" "}
            <strong>Gata - predați</strong> de sub câmp, fără întrebare.
          </p>
          <p className="m-0">
            <strong>Când timpul a expirat,</strong> îți apare imediat rezumatul:
            caractere pe minut, precizia, caracterele, greșelile, rândurile și tastele
            care au fost nesigure. Fiecare Provocare rămâne apoi în{" "}
            <strong>„Progresul meu”</strong>, la <strong>{PROVOCARI}</strong> - acolo o
            poți reciti oricând.
          </p>
        </Section>

        <Section title="Întrecerea clasei ⚔️">
          <p className="m-0">
            În Întrecerea clasei scrii <strong>cinci minute, în întrecere</strong> cu
            ceilalți copii din clasa ta. Întrecerea există doar într-o clasă și doar
            dacă a permis-o cadrul didactic.
          </p>
          <p className="m-0">
            <strong>Cum inviți la o întrecere:</strong> <Kbd>Alt</Kbd> + <Kbd>M</Kbd> sau
            butonul <strong>⚔️ Întrecerea clasei</strong> din bara de deasupra
            câmpului de scriere - chiar lângă <strong>🐧 Jucați</strong>. La toți
            ceilalți se deschide atunci o fereastră cu butoanele <strong>Particip!</strong>{" "}
            și <strong>Nu acum</strong>. Cu <Kbd>Esc</Kbd> te întorci la exersare, iar
            aceeași invitație nu mai vine de la sine.
          </p>
          <p className="m-0">
            <strong>Dacă invită deja cineva,</strong> <Kbd>Alt</Kbd> + <Kbd>M</Kbd> aduce
            din nou invitația aceea - a doua întrecere se poate porni abia când prima a
            început deja. Dacă invită două persoane aproape în același timp, e valabilă
            invitația care a venit prima.
          </p>
          <p className="m-0">
            <strong>Când nu se poate chiar acum:</strong> dacă ești deja într-o
            întrecere, butonul se numește{" "}
            <strong>⚔️ Întrecerea clasei e în desfășurare</strong> - și <Kbd>Alt</Kbd> +{" "}
            <Kbd>M</Kbd> îți spune același lucru. Alte întreceri din clasă nu
            deranjează: pot rula oricâte în același timp.
          </p>
          <p className="m-0">
            <strong>Fiecare scrie la nivelul propriu.</strong> Cine a învățat deja
            cifrele primește cifre; cine e la șirul de bază primește șirul de bază.
            Tastele greșite costă - o tastă greșită cântărește cât cinci caractere.
          </p>
          <p className="m-0">
            <strong>Cum stai, fără să te uiți:</strong> chiar în stânga rândului de
            scris sunt mereu opt celule: <strong>P2</strong> este locul, alături timpul
            rămas. <Kbd>Alt</Kbd> + <Kbd>X</Kbd> îți spune locul, timpul și primii trei.
            De la sine nu se anunță nimic - afișajul braille rămâne liniștit.
          </p>
          <p className="m-0">
            <strong>Te oprești mai devreme:</strong> <Kbd>Esc</Kbd> sau butonul{" "}
            <strong>Ieșiți</strong> te întreabă mai întâi. Butonul{" "}
            <strong>Scrieți mai departe</strong> (și <Kbd>Esc</Kbd>) te duce înapoi în
            rând. Butonul <strong>Ieșiți</strong> încheie întrecerea doar pentru tine -
            ceilalți scriu mai departe și văd ce ai scris.
          </p>
          <p className="m-0">
            <strong>Întrecerea se socotește la timpul tău de exersare</strong> și poate
            debloca o tastă nouă - exact ca o rundă obișnuită de exersare.{" "}
            <strong>Locul nu se salvează.</strong> La sfârșit apare lista: Cupă, Argint
            și Bronz pentru primii trei, toți ceilalți cu numărul lor. Apoi te întorci
            cu butonul <strong>Exersați în continuare</strong> sau cu <Kbd>Esc</Kbd>.
          </p>
        </Section>

        <Section title="Taste importante">
          <p className="m-0 text-sm text-ink-muted">
            <AltOderWahl>
              Pe Mac, în locul tastei <Kbd>Alt</Kbd> se folosește tasta <Kbd>⌥</Kbd>{" "}
              (Opțiune).
            </AltOderWahl>
          </p>
          <ul className="m-0 list-none space-y-2 p-0">
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Esc</Kbd>
              </span>
              <span>
                <strong>Cea mai importantă tastă:</strong> închide orice fereastră, iar
                cursorul stă apoi <strong>mereu în câmpul de scriere</strong>. Chiar
                dacă nu e nimic deschis, <Kbd>Esc</Kbd> îl aduce înapoi acolo. Singura
                excepție este Explorarea tastelor: acolo și <Kbd>Esc</Kbd> e o tastă de
                explorat, iar abia a doua apăsare te scoate de acolo.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Shift</Kbd> <Kbd>Shift</Kbd>
              </span>
              <span>Apăsată scurt de două ori: se anunță degetul potrivit.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>E</Kbd>
              </span>
              <span>Salt în câmpul de scriere.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>U</Kbd>
              </span>
              <span>Trecere la exersare.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>S</Kbd>
              </span>
              <span>
                Deschide Progresul meu (cadre didactice: Clasele mele). Funcționează
                doar după conectare. Încă o apăsare te duce înapoi în câmpul de
                scriere.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>Z</Kbd>
              </span>
              <span>Anunță la al câtelea rând ești acum.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>D</Kbd>
              </span>
              <span>
                Spune timpul de exersare - pe afișajul braille și (cu citirea cu voce
                tare) ca anunț.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>L</Kbd>
              </span>
              <span>Anunță la ce {ringWort} ești acum.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>3</Kbd>
              </span>
              <span>
                <strong>Explorarea tastelor:</strong> fiecare tastă pe care o apeși se
                anunță și apare mare - mai întâi prescurtarea, apoi numele, apoi ce face
                (de exemplu „Tab - tasta Tab - sare de la un element la altul”). Asta
                merge și pentru toate tastele speciale și semnele de punctuație, pentru
                caracterele cu Alt Gr (pe Mac: Opțiune), împreună cu drumul până la
                ele, și pentru combinații de taste ca Ctrl + C - împreună cu ce fac.
                Comenzile rapide ale aplicației Tastenflow (<AltText>Alt + H, Alt + V ...</AltText>) funcționează mai departe. Tastatura de pe ecran arată ce tastă a
                fost apăsată. Dacă citirea cu voce tare e oprită, vocea tace. Pe
                afișajul braille explicația rămâne până vine tasta următoare și se poate
                citi toată cu tastele de derulare; pe ecran stă într-o fereastră. Nu se
                scrie nimic, nu se pierde nimic. <strong>Ieșire:</strong> încă o dată{" "}
                <Kbd>Alt</Kbd> + <Kbd>3</Kbd>, de două ori <Kbd>Esc</Kbd> - sau pur și
                simplu reîncarcă pagina.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>4</Kbd>
              </span>
              <span>
                <strong>Căutarea tastelor:</strong> aplicația spune numele unei taste,
                iar tu o cauți. La prima nimereală auzi „Ai găsit-o! Apasă altă tastă,
                apoi din nou ...” - abia a doua apăsare contează, și doar după o altă
                tastă apăsată între ele. Apoi vine tasta următoare. O altă tastă doar
                se numește. În fereastră, <Kbd>Alt</Kbd> + <Kbd>4</Kbd> trece între
                explorare și căutare. <strong>Ieșire:</strong> ca la explorare.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>K</Kbd>
              </span>
              <span>
                <strong>Culori și contrast:</strong> șapte teme de culori - luminos,
                întunecat, negru pe galben, galben pe albastru și altele. Fiecare se
                arată deja în listă în culorile ei, așa că vezi dinainte cum arată.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>T</Kbd>
              </span>
              <span>Deschide sau închide lista de comenzi rapide.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>N</Kbd>
              </span>
              <span>Deschide sau închide mesajele de la cadrul didactic.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>+</Kbd> / <Kbd>-</Kbd>
              </span>
              <span>Mărește sau micșorează câmpul de scriere.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>V</Kbd>
              </span>
              <span>Pornește sau oprește citirea cu voce tare.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>H</Kbd>
              </span>
              <span>Deschide sau închide acest ajutor.</span>
            </li>
            <WeitereTasten />
          </ul>
        </Section>

        {detail >= 3 && (
          <Section title="Cum te sprijină programul">
            <p className="m-0">
              Programul măsoară fiecare literă separat - cât de precis și cât de
              repede. Exersează automat literele cele mai slabe și deblochează o literă
              nouă abia când cele de până acum sunt sigure. Așa apare pentru tine un
              parcurs propriu.
            </p>
            <p className="m-0">
              Nivelul de dificultate (1-50) are grijă ca exersarea să rămână mereu{" "}
              <strong>solicitantă, dar realizabilă</strong>: când merge bine, urcă;
              când devine prea greu, coboară din nou. În{" "}
              <strong>„Progresul meu”</strong> vezi totul despre progresul tău - și
              cât de mult avansezi.
            </p>
          </Section>
        )}

        <Section title="Exersezi fără clasă - un cont propriu 🙋">
          <p className="m-0">
            Dacă nu faci parte din nicio clasă, îți poți crea un cont propriu: la
            butonul rotund <strong>Cont</strong>, bifează{" "}
            <strong>„Exersez independent, fără clasă”</strong>. Pentru asta e nevoie
            de o adresă de e-mail: acolo vine lunea raportul săptămânal, dar doar în
            săptămânile în care s-a exersat cu adevărat. Dacă un an întreg nu se
            deschide niciunul dintre cele patru programe, vine un e-mail de
            avertizare; dacă apoi timp de trei săptămâni nu se conectează nimeni,
            contul se șterge, cu tot progresul din el.
          </p>
        </Section>

        <PlakatAbschnitt />
      </div>
    </div>
  );
}

/** Afișul de pus pe perete, în limba română (`handbuchInSprache`). */
function PlakatAbschnitt() {
  const plakat = handbuchInSprache(tastenflowPlakat(), "ro");
  // ★ O-HILFE-RO: `groesse(…, "ro")` schreibt (noch, RÜCKFALL-EN in `handbuecher.ts`)
  // einen Dezimalpunkt; Rumänisch hat das Komma (Glossar Regel 5). Hier, nicht in der
  // gemeinsamen Tabelle (nicht Teil dieses Auftrags).
  const groesseRo = groesse(plakat.bytes, "ro").replace(".", ",");
  return (
    <Section title="Un afiș de pus pe perete">
      <p className="m-0">
        Vrei să arăți Tastenflow la școala ta sau în instituția ta? Aici găsești un{" "}
        <strong>afiș de imprimat și de pus pe perete</strong>: A3 vertical, arată
        dintr-o privire ce poate Tastenflow și are un cod QR spre tastenflow.org.
      </p>
      <p className="m-0">
        <a
          href={downloadAdresse(plakat)}
          download={plakat.speicherName}
          type="application/pdf"
          className="text-accent underline underline-offset-2"
        >
          Descărcați afișul (PDF, A3, {groesseRo})
        </a>
      </p>
    </Section>
  );
}
