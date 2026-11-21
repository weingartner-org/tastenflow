/**
 * ★★★ O-NL (25.10.2026): DAS HILFE-FENSTER FÜR LEHRKRÄFTE, NIEDERLÄNDISCH.
 * ===========================================================================
 * Inhalt nach der deutschen `LehrerHilfeDeutsch` (`LehrerHilfe.tsx`), in
 * derselben Reihenfolge (1 bis 12, samt 4a, 4b, 8a, 8b) - wer eine Stelle
 * prüft, findet sie in allen Fassungen. Aufbau nach `LehrerHilfe.cs.tsx`.
 * Sichtbar nur mit `spracheGewaehlt === "nl"` (`LehrerHilfe.tsx`).
 *
 * ── ANREDE (Glossar `recherche-niederländisch-2026-10-25/GLOSSAR-nl.md`, Regel 1) ──
 * Lehrkraft-Bereich: Imperativ ohne Pronomen („Kies een klas", „Druk op …");
 * wo ein Pronomen nötig ist, **je** - nie „u", nie Wechsel. Lehrkraft heisst
 * „leerkracht", das Kind in dieser Sicht „leerling" (Regel 2, §2.5); kein
 * zijn/haar für eine unbekannte Person. Knopfnamen mit geraden
 * Anführungszeichen (Regel 7). Keine Ausrufezeichen.
 *
 * ── WAS NIEDERLÄNDISCH ANDERS IST ────────────────────────────────────────────
 *  · Zahlen: Prozent ohne Leerzeichen („96%", Regel 5), Mehrzahl über
 *    `mehrzahl(n, "nl", …)` (one/other, §2.11), Datum ausgeschrieben
 *    („9 augustus 2026", §2.10).
 *  · Das Wort der Tippchallenge („Uitdaging") steht ausgeschrieben, solange
 *    `pruefungWort("nl")` noch den englischen Rückfall liefert.
 *  · Score-Erklärung und Kurven-Hinweis stehen hier ausgeschrieben (wie in der
 *    tschechischen Fassung) - die deutschen Konstanten sind deutsch.
 *  · Tastatur: `nl-intl` (' und " sind Totasten) und `be` (AZERTY, Ziffern mit
 *    Shift, é è ç à auf der Ziffernreihe) - Befund G3b, nur gelesen. Die
 *    Reihenfolge des Weges „nl" (F4) war beim Schreiben noch nicht gemessen -
 *    Abschnitt 4 nennt darum nur das Prinzip, keine Buchstabenfolge.
 *  · Abschnitt 12: eigenes Handbuch; das Plakat hat eine eigene Fassung in der Sprache (`tastenflowPlakat`).
 *
 * Nur Bindestrich, keine Maus-Wörter, Person zuerst („leerlingen die blind of
 * slechtziend zijn").
 */
import { BrailleTabellenPunkte } from "./ScreenreaderHinweis";
import { AltText, Kbd } from "./TippenHilfeTeile";
import { useRef } from "react";
import { EINSTIEGSFENSTER_MIN, MIND_ZEICHEN, PROBEN_JE_NIVEAU } from "@/lib/typing/schreibprobe";
import { FEHLER_GEWICHT, FEHLER_GEWICHT_FREI } from "@/lib/typing/schreibprobeWertung";
import { mehrzahl, zahl } from "@/lib/bedienSprache";
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

/** ★ O-NL (25.10.2026): Prozent ohne Leerzeichen (Glossar Regel 5, gemessen `Intl` „95%"). */
const procent = (p: number) => `${p}%`;

export function LehrerHilfeNiederlaendisch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  useFocusTrap(open, cardRef, { initialFocus: closeRef });
  if (!open) return null;

  // Zahlen mit Nomen über die EINE Mehrzahl-Regel (Glossar §2.11).
  const minuten = mehrzahl(EINSTIEGSFENSTER_MIN, "nl", {
    one: (z) => `${z} minuut`,
    other: (z) => `${z} minuten`,
  });
  const tekens = (n: number) =>
    mehrzahl(n, "nl", {
      one: (z) => `${z} teken`,
      other: (z) => `${z} tekens`,
    });
  const teksten = mehrzahl(PROBEN_JE_NIVEAU, "nl", {
    one: (z) => `${z} tekst`,
    other: (z) => `${z} teksten`,
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Help voor leerkrachten bij Tastenflow"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        className="card my-8 w-full max-w-3xl space-y-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="m-0 text-xl font-semibold text-ink">
            Help voor leerkrachten: alle functies van Tastenflow
          </h2>
          <button
            ref={closeRef}
            type="button"
            className="btn-secondary btn-toggle"
            onClick={onClose}
            aria-label="Help sluiten"
          >
            ✕ Sluiten
          </button>
        </div>
        <RundgangLehrkraftKnoepfe onStart={onClose} />

        <p className="m-0 text-ink-soft">
          Tastenflow heeft een <strong>eigen systeem met accounts</strong>, helemaal
          los van het inloggen op het leerplatform (LMS). Wie hier is ingelogd, heeft
          geen invloed op de sessie in het leerplatform - en omgekeerd.
        </p>

        <Section title="1 · Klassen en accounts aanmaken">
          <p className="m-0">
            Als leerkracht kom je bij het openen van Tastenflow altijd in{" "}
            <strong>"Mijn klassen"</strong>; naar het eigen oefenen gaat "Oefenen" (
            <Kbd>Alt</Kbd> + <Kbd>U</Kbd>). Via <strong>"Leerlingen en toegang"</strong>{" "}
            rechtsboven maak je een klas aan - in het openklapbare onderdeel{" "}
            <strong>"Nieuwe klas aanmaken"</strong>. De <strong>klascode</strong> is
            verplicht: terwijl je de naam typt, stelt het programma een passende code
            voor (van "6B Zonnebloem" wordt "6BZONNEBLOEM"); je kunt hem veranderen,
            bijvoorbeeld in <code>6B-ZB</code>. De code geldt voor de hele klas. In
            hetzelfde onderdeel kies je het <strong>leerjaar</strong> en het{" "}
            <strong>startpunt</strong>, en controleer je de taal (met slot) en de
            klassenwedstrijd - dezelfde velden als bij "Klasinstellingen".{" "}
            <strong>"Klas aanmaken"</strong> lukt pas als alles is ingevuld; anders
            zegt een zin wat er nog ontbreekt, en de focus staat in het eerste veld
            dat nog leeg is.
          </p>
          <p className="m-0">
            Daarna voeg je leerlingen toe met <strong>naam en wachtwoord</strong>.
            Inloggen kunnen ze daarna op <strong>elk apparaat</strong> met{" "}
            <em>klascode, naam en wachtwoord</em>. Het apparaat onthoudt de klascode,
            zodat de leerlingen alleen nog naam en wachtwoord hoeven in te vullen.
          </p>
          <p className="m-0">
            Klasnaam en klascode kun je later veranderen met{" "}
            <strong>"✏️ Wijzigen"</strong> - een nieuwe code geldt dan voor alle
            leerlingen van de klas (ze loggen vanaf dan in met de nieuwe code).
          </p>
          <p className="m-0">
            <strong>Nieuw:</strong> wie bij geen klas hoort, kan sinds 9 augustus
            2026 ook <strong>zelf een account aanmaken</strong> - in het
            inlogvenster met het vinkje "Ik oefen zelfstandig, zonder klas" en een
            e-mailadres. Voor jou verandert er niets: zulke accounts horen bij geen
            klas, verschijnen in geen van je lijsten en krijgen hun weekverslag zelf.
            Voor je klas blijft alles zoals het was - jij maakt de accounts van de
            leerlingen aan.
          </p>
        </Section>

        <Section title="2 · Instellingen van de klas en per leerling">
          <p className="m-0">
            <strong>Voor de hele klas</strong> (de knop "Klasinstellingen" in de
            opdrachtenbalk boven de tabel, naast Uitdaging, Eigen oefening, Weekdoel
            en 1 uur pauzeren - dichtgeklapt noemt de knop zelf al het leerjaar, de
            taal en de klassenwedstrijd):
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Leerjaar:</strong> daaruit berekent de app het niveau van de
              teksten - woordenschat, soort grappen en toon van de oefenteksten. Een
              leerling van rond de 13 jaar krijgt teksten voor 11-15 jaar.{" "}
              <strong>Het groeit mee:</strong> de app onthoudt het schooljaar van de
              invoer en telt elk jaar een leerjaar verder, zonder dat je iets hoeft
              bij te stellen. Voor groepen volwassenen is er de stand{" "}
              <strong>"Volwassenen"</strong> - die telt niet verder. Een geboortejaar
              wordt voor leerlingen van een klas niet meer gevraagd.
            </li>
            <li>
              <strong>Taal en slot:</strong> de taal van de oefenwoorden en -teksten
              voor de hele klas; met het slot ernaast kunnen de leerlingen die niet
              meer zelf veranderen. De ronde taalknop met de wereldbol bovenaan heeft
              iedereen: die zet de knoppen en menu's in een andere taal en de
              oefenteksten meteen ook - met slot alleen de knoppen en menu's.
            </li>
            <li>
              <strong>Startpunt van de klas:</strong> het antwoord op "Waar
              beginnen?" voor de hele klas - het geldt ook voor elke leerling die er
              later bij komt, en het voegt alleen toe: een leerling die al verder is,
              verliest niets. Bij het kiezen zet de app het startpunt meteen ook bij
              de leerlingen die er al zijn; zijn er al verder, dan vraagt ze het
              eerst na en biedt ze drie wegen aan: iedereen indelen, alleen wie nog
              niet zo ver is, of annuleren. Het werkt zodra een leerling Tastenflow
              de volgende keer opent; statistiek en medailles blijven in elk geval
              bewaard.
            </li>
            <li>
              <strong>Klassenwedstrijd toestaan:</strong> de leerlingen kunnen
              elkaar uitnodigen voor een wedstrijd van 5 minuten. Bij
              "Oefentijden" in de opengeklapte regel zie je hoe vaak een leerling
              per week heeft meegedaan - geen plaats, geen tijd.
            </li>
            <li>
              <strong>Regel afsluiten met Enter:</strong> aangevinkt sluit elke
              leerling van de klas elke oefenregel af met Enter - zoals bij het
              typen op kantoor. Dat geldt voor "Mijn training", Verhalen, Eigen
              oefening, de woordspelletjes met regels, de Uitdaging en de
              klassenwedstrijd; niet voor raadsels, Husselwoorden, Vingerdictee, de
              Poolexpeditie en "Toetsen verkennen". Standaard: uit.
            </li>
          </ul>
          <p className="m-0">
            <strong>Per leerling</strong> (achter de pijl in de eigen regel):
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Toetsenbord:</strong> te kiezen in Instellingen (het tandwiel)
              bij "Toetsenbord" - in Nederland meestal Verenigde Staten
              (internationaal), in Vlaanderen Belgisch (punt). De instelling geldt
              voor dit apparaat (niet voor het account) en stuurt het
              schermtoetsenbord, de vingeraanwijzingen en welke tekens worden
              geoefend. Op Verenigde Staten (internationaal) zijn ' en " dode
              toetsen: er verschijnt pas iets na de volgende toets (' en e geeft é, "
              en e geeft ë, de spatiebalk geeft het teken zelf). Op Belgisch (punt)
              staan é, è, ç en à op de cijferrij en typ je cijfers met Shift.
            </li>
            <li>
              <strong>Waar beginnen?</strong> dezelfde lijst met standen als het
              startpunt van de klas (zie hierboven) - hier voor die ene leerling die
              een uitzondering nodig heeft. Wie meer ervaring heeft, slaat zo de
              basis over en begint verder (bijvoorbeeld pas bij de cijfers); bij
              terugzetten vraagt de app het eerst na.
            </li>
            <li>
              <strong>Met één hand typen:</strong> zet voor deze leerling de regel
              "Shift met de andere hand" uit - hoofdletters en speciale tekens gelden
              dan met elke Shift-toets.
            </li>
            <li>
              <strong>Snelheid telt niet:</strong> de snelheid van deze leerling
              wordt nergens beoordeeld - geen tijdslimiet in het spel, geen
              snelheidsdoel bij de sterren, geen stijgen of dalen van het
              moeilijkheidsniveau door snelheid. Voor leerlingen die zorgvuldig maar
              heel langzaam typen.
            </li>
            <li>
              <strong>Brede letterafstand (CVI):</strong> meer ruimte tussen de tekens
              bij het overtypen, in drie standen (twee keer, drie keer, vier keer) -
              voor kinderen met CVI (cerebrale visuele inperking), bij wie tekens die
              dicht op elkaar staan in elkaar overlopen. De leerling kan de afstand
              ook zelf veranderen in de eigen instellingen (het tandwiel,{" "}
              <AltText>Alt + O</AltText>) - en jij hier altijd weer terug. Wat het
              laatst is gekozen, geldt.
            </li>
          </ul>
          <p className="m-0">
            Alles kun je altijd veranderen - de vier waarden van de klas bij
            "Klasinstellingen" boven de tabel, de waarden per leerling in de
            opengeklapte regel van die leerling.
          </p>
        </Section>

        <Section title="3 · Het moeilijkheidsniveau (1-50): het hart van het programma">
          <LeistungsstufeHilfe />
          <p className="m-0">
            Het <strong>huidige niveau</strong> staat in de tabel (kolom{" "}
            <strong>"Moeilijkheidsniveau"</strong>) en bovenaan in het
            oefenscherm. Je hoeft niets in te stellen - alleen als het nodig is
            "Snelheid telt niet" aanzetten.
          </p>
        </Section>

        <Section title={'4 · "Mijn training": past zich aan, op volgorde van hoe vaak letters voorkomen'}>
          <p className="m-0">
            Tastenflow heeft <strong>één</strong> oefenroute, die elke leerling in
            het eigen tempo gaat - en die <strong>past zich aan</strong>: het
            programma meet elke toets apart, oefent vanzelf de zwakste en speelt een
            nieuwe toets pas vrij als de vorige zeker zijn.
          </p>
          <div className="rounded-xl border border-accent bg-accent-soft p-3">
            <p className="m-0 font-semibold text-ink">
              Volgorde naar hoe vaak letters voorkomen
            </p>
            <ul className="m-0 mt-1 list-disc space-y-1 pl-5">
              <li>
                Na de basishouding komen de letters die het <strong>vaakst</strong>{" "}
                voorkomen eerst - zo ontstaan al na een paar toetsen{" "}
                <strong>echte woorden</strong> (hetzelfde principe als bij de
                online trainer keybr).
              </li>
              <li>
                <strong>Elke leerroute is anders</strong> - welke toets als
                volgende aan de beurt komt, hangt af van de leerling, niet van een
                vaste lijst.
              </li>
              <li>
                <strong>Geen vast einde</strong> - ideaal om elke dag zelfstandig te
                oefenen.
              </li>
            </ul>
          </div>
          <p className="m-0 rounded-xl border border-warning/40 bg-warning/10 p-3">
            <strong>Goed om te weten voor je planning:</strong> de Nederlandse
            leerroute heeft een <strong>eigen volgorde van de toetsen</strong>,
            gemaakt voor Nederlandse teksten en voor de toetsenborden Verenigde
            Staten (internationaal) en Belgisch (punt). Na de basisrij komen de
            letters die in het Nederlands het vaakst voorkomen, zoals e en n - zo
            ontstaan er al snel echte woorden en zinnen. De andere leestekens, de
            cijfers en de speciale tekens komen pas aan het eind.
          </p>
          <p className="m-0 rounded-xl border border-hairline bg-surface-raised p-3">
            <strong>De volgorde hangt af van de taal van de eerste oefening:</strong>{" "}
            welke route een leerling volgt, bepaalt de taal van de knoppen en menu's
            bij het eerste oefenen. Wie bijvoorbeeld in het Duits of Engels is
            begonnen, houdt die volgorde, ook als de taal van de knoppen later
            verandert: de volgorde wordt één keer bepaald en verandert daarna niet
            meer.
          </p>
          <p className="m-0">
            <strong>Voor de hele klas dezelfde tekst:</strong> de teksten van de
            cursus (basisrij, letterrijen, leestekens, cijfers, speciale tekens, hele
            teksten) staan voor je klaar als <strong>sjablonen</strong> bij{" "}
            <strong>"Eigen oefening"</strong> in "Mijn klassen" - kies er een, en de
            hele klas oefent dezelfde tekst, hoe ver de leerlingen zelf ook zijn
            (net als bij een geüpload bestand telt dat als oefentijd, en er worden
            daarbij geen nieuwe toetsen vrijgespeeld).
          </p>
          <p className="m-0">
            <strong>Vreemde woorden en programmacode:</strong> bij Duitstalige klassen
            staan daar ook de meest gebruikte <strong>vreemde woorden</strong> - per
            regel eerst het Duitse woord of een korte omschrijving, dan het vreemde
            woord; de leerlingen typen allebei alleen over. Voor de{" "}
            <strong>Uitdaging</strong> met een eigen bestand zijn er dezelfde woorden
            nog een keer, maar in andere bestanden en op alfabet. Daarbij komt{" "}
            <strong>programmacode</strong> om over te typen (tien programmeertalen,
            echte broncode van open projecten, andere stukken dan in de Uitdaging) -
            alleen bij "Eigen oefening".
          </p>
        </Section>

        <Section title={'4a · "Eigen oefening": één tekst voor de hele klas'}>
          <p className="m-0">
            Met de knop <strong>"Eigen oefening"</strong> in de opdrachtenbalk van
            de klasstatistiek leg je een tekst vast die de hele klas oefent - hoe ver
            de leerlingen zelf ook zijn. Er zijn drie wegen naar de tekst: een{" "}
            <strong>bestand uploaden</strong> (.txt of .docx), een eerder opgeslagen
            tekst kiezen uit <strong>"Mijn teksten"</strong>, of een van de{" "}
            <strong>sjablonen</strong> uit de cursus overnemen (zie punt 4).
          </p>
          <p className="m-0">
            <strong>"Mijn teksten"</strong> is je eigen, blijvende opslag - die hoort
            bij je account, niet bij de klas, en alleen jij ziet hem. Bij het uploaden
            legt <strong>"Opslaan in Mijn teksten"</strong> (standaard aan)
            automatisch een kopie daar neer, zodat je dezelfde tekst later opnieuw
            kunt gebruiken zonder het bestand nog eens te uploaden.
          </p>
          <p className="m-0">
            Staan er in het bestand tekens die je niet kunt typen, dan laat het
            onderdeel ze vóór de start als lijst zien - jij beslist of je het bestand
            verbetert of toch begint (de overige tekens vallen dan uit de regels, en
            zijn nooit een verplichte aanslag).
          </p>
          <p className="m-0">
            <strong>"Eigen oefening starten":</strong> elke leerling krijgt meteen
            een venster <em>"We gaan verder met een oefening van je leerkracht"</em> -
            de leerling kan alleen op <strong>"Verder"</strong> drukken, niet
            weigeren. Voor elke leerling stopt de oefening vanzelf zodra de tekst één
            keer is getypt; daarna oefent de leerling weer gewoon verder.{" "}
            <strong>"Oefening stoppen"</strong> stopt haar eerder voor de hele klas.
          </p>
          <p className="m-0">
            De oefening telt als oefentijd en wordt gemeten zoals elke andere ronde,
            ook de onzekere toetsen - maar ze speelt <strong>geen nieuwe toets
            vrij</strong>: welke toetsen aan de beurt komen, bepaalt alleen het
            bestand.
          </p>
        </Section>

        <Section title={didaktikAbschnittTitel("nl")}>
          <DidaktikInhalt lang="nl" />
        </Section>

        <Section title="5 · Zinvolle teksten vanaf het begin">
          <p className="m-0">
            De trainer laat <strong>zo vroeg mogelijk</strong> echte teksten zien die
            bij de leeftijd passen - grappen, spreekwoorden, gezegden, weetjes en
            informatieve teksten, tongbrekers, woordgrappen en hele zinnen. Een tekst
            verschijnt zodra de <strong>letters</strong> ervan zijn geleerd; losse
            "woordsla" is de uitzondering (alleen om een gloednieuwe toets gericht te
            oefenen).
          </p>
          <p className="m-0">
            <strong>Hoofdletters:</strong> de <strong>spelling is altijd
            goed</strong> (hoofdletter aan het begin van een zin en bij namen) - de
            leerlingen zien nooit een fout geschreven woord. In het begin is daarvoor
            de <strong>kleine</strong> letter genoeg; de hoofdletter verschijnt
            vanzelf ("automatische hoofdletters", voor <strong>alle
            leeftijden</strong>, omdat goede spelling op elke leeftijd telt).
          </p>
          <p className="m-0">
            In <strong>"Mijn training" komt de echte Shift-toets wel vroeg</strong> -
            al na de eerste letters die vaak voorkomen, zodra er genoeg echte woorden
            met een hoofdletter zijn om te oefenen (niet pas na het hele alfabet).
            Vanaf dan wordt een hoofdletter "echt" met Shift getypt. Zo leren de
            leerlingen de echte hoofdletters al snel <strong>zelf</strong>, in plaats
            van lang alleen op de automatische hulp te leunen.
          </p>
          <p className="m-0">
            <strong>Leestekens</strong> (punt, komma, vraagteken ...) verschijnen pas
            als ze zijn geleerd - daarvoor staat de zin er "zonder punt en komma". Een
            nog niet geleerde <em>letter</em>- of <em>cijfer</em>toets wordt daarentegen{" "}
            <strong>nooit</strong> gevraagd.
          </p>
        </Section>

        <Section title="6 · Sterren, medailles en geluiden (belangrijk voor leerlingen die blind of slechtziend zijn)">
          <p className="m-0">
            Elke ronde geeft <strong>1-3 sterren</strong> voor nauwkeurigheid en
            snelheid - de <strong>nauwkeurigheid telt drie keer</strong>: voor 3
            sterren is altijd ongeveer {procent(96)} goede aanslagen nodig (snel,
            slordig typen wordt niet beloond); een foutloze ronde heeft daarentegen 2
            sterren zeker, ook in het langzaamste tempo. Elk aantal sterren heeft een{" "}
            <strong>eigen geluid</strong>; bij het <strong>stijgen van
            niveau</strong> klinkt een bijzonder juichgeluid. Deze geluiden zijn de
            belangrijkste terugmelding voor leerlingen die slechtziend of blind zijn.
            Met de <strong>knop 🔇</strong> zet je het geluid uit in een stille klas.
          </p>
          <p className="m-0">
            Daarbij komen <strong>medailles</strong> met namen voor kinderen - in
            families met trappen en altijd met een "volgende mijlpaal" die je kunt
            laten uitspreken. De namen met dieren zien alleen de 7- tot 10-jarigen;
            vanaf de teksten voor 11-15 jaar staat overal de neutrale tweede naam. De
            medailles zelf zijn dezelfde - behaald blijft behaald, ook als het niveau
            van de teksten verandert. Bijna alle belonen{" "}
            <strong>nauwkeurigheid en volhouden</strong>; de enige medaille voor
            snelheid vraagt {procent(95)} nauwkeurigheid. Een nieuwe medaille brengt
            een eigen "ta-daa"-geluid met een melding en staat daarna in de statistiek
            helemaal bovenaan (bij de leerling en bij jou - dezelfde weergave). Elke
            medaille kun je <strong>kiezen</strong> - dan verschijnt hij groot en met
            een effect.
          </p>
          <p className="m-0">
            Het <strong>IJsschotsenspel 🐧</strong> is de beloning na een nieuwe toets
            in "Mijn training": de pinguïn steekt een parcours over met de{" "}
            <strong>meest onzekere tekens</strong> van de leerling (soms ijsschotsen
            over het water, soms ook een letterberg met een buikglijbaan).{" "}
            <strong>De toets is daarvoor al vrijgespeeld</strong> - sinds 14 augustus
            2026 hangt de voortgang aan geen enkel spel meer (daarvoor was het een
            poort, en die strafte onzichtbaar precies de langzame, zorgvuldige
            leerlingen). Zoveel pogingen als je wilt, geen game-over; bij de
            instelling "alleen nauwkeurigheid" (en op moeilijkheidsniveau 1) is er{" "}
            <strong>geen tijdsdruk</strong> (een tijdslimiet die je volgens WCAG kunt
            uitzetten). Daarnaast kunnen leerlingen met de teksten voor{" "}
            <strong>7-10 en 11-15 jaar</strong> het spel met de knop{" "}
            <strong>Spelen</strong> altijd vrijwillig starten - als "avontuur van de
            dag" met <strong>bonusvissen</strong> (geroep van een vis en melding van
            het teken; gemist = geen fout) en met <strong>de echogrot</strong>, waar
            elke toets alleen wordt uitgesproken (daar praat de app ook als Voorlezen
            uit staat - leerlingen die blind zijn en leerlingen die zien, spelen
            precies hetzelfde; de grot komt bewust NOOIT in de beloningsronde voor).
            Een foutloze tocht eindigt met poollicht; gehaalde avonturen, vissen en
            foutloze tochten leveren de medaillefamilie <strong>"Avonturen"</strong>{" "}
            op. Belangrijk voor je beoordeling: het spel telt{" "}
            <strong>niet als oefentijd</strong> en niet voor het weekdoel - het is
            alleen motivatie.
          </p>
          <p className="m-0">
            <strong>Twee verschillende wegen naar het spel - haal ze niet door
            elkaar:</strong> de knop <strong>Spelen</strong> is de vrije ingang, die
            de leerlingen zelf indrukken; hij staat er bij <strong>7-10 en
            11-15</strong>, vanaf 16 niet. De ronde <strong>na een nieuwe
            toets</strong> komt daarentegen vanzelf: bij 7-10 altijd, vanaf 16 nooit,
            en bij 11-15 alleen als in Instellingen bij{" "}
            <strong>"Beloningsspel"</strong> in plaats van <strong>Geen</strong>{" "}
            (standaard) het IJsschotsenspel is gekozen. Deze instelling hoort bij het{" "}
            <strong>apparaat</strong>, niet bij het account - net als de
            toetsenbordindeling. Op een computer van de klas geldt ze dus voor
            iedereen die daar oefent.
          </p>
          <p className="m-0">
            <strong>Weggevallen op 22 augustus 2026:</strong> de <em>typsprint</em> -
            drie regels met groepjes van drie van de meest onzekere tekens, tot dan de
            standaard voor 11-15. Hij was dubbel werk zonder spelwaarde: "Mijn
            training" geeft de zwakke toetsen sowieso voorrang, de leerling oefende
            dus hetzelfde nog een keer, alleen in een venster.{" "}
            <strong>Teruggedraaid op 31 augustus 2026:</strong> op 22 augustus was ook
            de vrije ingang naar het spel vanaf 11 geschrapt - de knop{" "}
            <strong>Spelen</strong> is daar weer. Wat 11- tot 15-jarigen nog steeds
            NIET krijgen, is de onderbreking na elke nieuwe toets.
          </p>
        </Section>

        <Section title="7 · Weekdoel">
          <p className="m-0">
            Per leerling stel je <strong>minuten per week</strong> in - zonder
            lesuren. "Toepassen op de hele klas" schrijft dezelfde waarde in één keer
            bij alle leerlingen van de klas en geldt ook voor leerlingen die er later
            bij komen.
          </p>
          <p className="m-0">
            Een verandering geldt altijd <strong>vanaf de volgende maandag om 8.00
            uur</strong> - de lopende week houdt het doel dat ze had. Een venster
            noemt vóór het opslaan de precieze datum.
          </p>
          <p className="m-0">
            <strong>Inhalen:</strong> is "Gemiste minuten van vorige weken inhalen"
            aangevinkt, dan mogen gemiste minuten van eerdere weken allemaal in één
            keer worden ingehaald.
          </p>
          <p className="m-0">
            <strong>Vrijstellen van het weekdoel</strong> (bijvoorbeeld bij ziekte) en{" "}
            <strong>Achterstallige minuten wissen</strong> blijven zoals ze waren -
            per leerling, zonder de geoefende tijd te veranderen.
          </p>
          <p className="m-0">
            <strong>1 uur pauzeren:</strong> een eigen knop voor de hele klas, 60
            minuten lang. Er wordt toch geoefend - oefentijd en statistiek tellen
            door, alleen het weekdoel van dat uur niet. Nog een keer op dezelfde knop
            drukken heft de pauze eerder op.
          </p>
        </Section>

        <Section title="8 · Statistiek en verloop (per leerling open te klappen)">
          <p className="m-0">
            Met de ronde pijlknop<span aria-hidden="true"> ▸</span> voor de naam open
            je zes regels die je elk apart kunt dichtklappen, van boven naar beneden:{" "}
            <strong>Instellingen</strong> (de waarden uit punt 2, voor deze ene
            leerling), <strong>Uitdagingen</strong> (alleen als er minstens één is
            getypt), <strong>Oefentijden</strong> (per week, met de stand van het
            weekdoel van die week en - als er gespeeld is - het aantal
            klassenwedstrijden, plus de jaarkaart voor het hele schooljaar),{" "}
            <strong>Onzekere toetsen</strong>, <strong>Medailles</strong> en - alleen
            bij een opvallende waarde - <strong>Zelfstandig werk</strong> (zie punt
            9).
          </p>
          <p className="m-0">
            Bij "Oefentijden" staat bovenaan aan hoeveel klassenwedstrijden de
            leerling heeft meegedaan (geteld in deze klas; hoe ver de telling teruggaat,
            zegt de tip bij de teller); Enter op een week opent de afzonderlijke
            oefentijden van die week - dag, tijd van-tot, zuivere typtijd en wat er is
            geoefend.
          </p>
          <p className="m-0">
            Wat hier niet meer apart staat - Scores in de klas, Verloop, Stand van de
            toetsen, Verhalen en weetjes - gaat niet verloren: het staat volledig in{" "}
            <strong>"Mijn voortgang"</strong> van de leerling, en je ziet daar precies
            dezelfde weergave als de leerling zelf.
          </p>
          <p className="m-0">
            <strong>De score:</strong> die zet de nauwkeurigheid en de snelheid van
            de leerling samen in één getal van 0 tot 100; een verkeerde toets telt
            als 5 tekens, en dubbele snelheid telt maar 1,4 keer - nauwkeurigheid wint
            van snelheid.
          </p>
          <p className="m-0">
            <strong>In de tabel van de klas</strong> staan drie kolommen samen onder
            de kop <strong>"Oefenen"</strong>: Nauwkeurigheid, aanslagen/min en
            Score. Ze komen alle drie uit het oefenen in de gekozen periode, en de
            score vat de twee andere samen. Daarom zijn ze licht gekleurd en met een
            fijne lijn omrand; een schermlezer kondigt "Oefenen" aan vóór de kop van
            de kolom. De kolom <strong>"Uitdaging"</strong> helemaal rechts staat
            bewust buiten deze groep, onder een eigen kop: het is een Uitdaging op een
            bepaalde dag, geen dagelijks oefenen.
          </p>
          <p className="m-0">
            In de kolom <strong>"Score"</strong> geldt: wie in de gekozen periode
            minder dan 200 tekens heeft getypt, krijgt geen score maar het teken "-"
            - daaronder beslist één verkeerde toets over meerdere punten.
          </p>
          <p className="m-0">
            <strong>"Downloaden als Excel"</strong> staat boven de tabel, rechts naast
            "Vanaf het begin". De knop downloadt de tabel als bestand{" "}
            <strong>klasnaam_datum.xlsx</strong> (bijvoorbeeld "6B_2026-09-14.xlsx") -
            welke periode er ook is gekozen. Vooraan staat een overzicht met links
            naar de vier periodes en een legenda die elke kolom uitlegt en laat zien
            hoe de score wordt berekend. Daarna volgen vier werkbladen: het lopende
            schooljaar, Vanaf het begin, de maand (de laatste 4 weken) en deze week.
            De waarden staan erin als getallen, zodat je in Excel verder kunt rekenen;
            waar de tabel het teken "-" laat zien, staat dat ook in het bestand.
          </p>
          <p className="m-0">
            <strong>Het klasoverzicht</strong> boven de tabel laat de klas als geheel
            zien. "Maand" (de laatste 4 weken) is al gekozen, "Schooljaar" staat
            ernaast. Een regel noemt aanslagen/min, nauwkeurigheid en weekdoelen, elk
            met een kleine trend - bij de maand tegenover de 4 weken daarvoor, bij het
            schooljaar de eerste tegenover de laatste oefenweken. De hele zin daarbij
            laat de tip zien zodra de focus op het getal staat; een schermlezer leest
            hem bij het getal mee, met de leerlingen die in de periode niet hebben
            geoefend.
          </p>
          <p className="m-0">
            <strong>De scorebalk "Score in de klas"</strong> laat één punt per
            leerling zien. Met Tab spring je naar de balk, met de pijltoetsen van
            leerling naar leerling - elke stap wordt uitgesproken ("Mia, 78 punten").
            Hoeveel leerlingen onder 50, tussen 50 en 70, tussen 70 en 85 en boven 85
            punten zitten, en wie te weinig heeft getypt, staat in de tip bij de kop.
          </p>
          <p className="m-0">
            <strong>Het lijndiagram "Score van de klas in het schooljaar"</strong>{" "}
            laat per week het gemiddelde zien van de leerlingen met minstens 5
            regels; een gat betekent dat er die week te weinig is geoefend. Met Tab
            spring je naar het diagram, met de pijltoetsen van week naar week; voor de
            schermlezer staan alle weken ook in een tabel. Komen Shift, cijfers of
            speciale tekens er nieuw bij, dan daalt de lijn even - dat is te
            verwachten en geen reden tot zorg.
          </p>
          <p className="m-0">
            <strong>De lijn:</strong> het is normaal dat de lijn van de leerling niet
            alleen stijgt. Komen er nieuwe toetsen bij, dan daalt hij meestal eerst -
            vooral bij Shift en bij de cijfers.
          </p>
          <p className="m-0">
            <strong>Open over gegevens:</strong> elke leerling ziet in "Mijn
            voortgang" precies dezelfde waarden over zichzelf - jij ziet nooit meer
            dan de leerling zelf.
          </p>
        </Section>

        <Section title="8a · De waarden waarop je een beoordeling kunt baseren">
          <DreiWerteHilfe />
        </Section>

        <Section title="8b · De Uitdaging: één opdracht voor de hele klas">
          <p className="m-0">
            In het deel voor leerkrachten <strong>"Mijn klassen"</strong> staat
            helemaal bovenaan in de <strong>klasstatistiek</strong> van Tastenflow, in
            de opdrachtenbalk, de knop <strong>"Uitdaging"</strong>. Die opent het
            formulier waarmee je een Uitdaging voor de hele klas start -{" "}
            <strong>alle leerlingen krijgen dezelfde tekst</strong>, hoe ver ze ook
            zijn in de cursus.
          </p>
          <p className="m-0">
            <strong>Je stelt drie dingen in:</strong> de{" "}
            <strong>gebruikte toetsen</strong> (van "Basisrij" tot "Alle toetsen"),
            meteen daarnaast de <strong>soort</strong> en de{" "}
            <strong>duur van de Uitdaging</strong> in minuten.{" "}
            <strong>"Nu starten"</strong> laat haar meteen beginnen.
          </p>
          <p className="m-0">
            <strong>Streng</strong> (standaard) werkt zoals altijd: een verkeerde
            toets gaat niet verder, elke verkeerde toets telt - ook een die meteen is
            verbeterd. <strong>Vrij typen</strong> past bij het overtypen van een tekst,
            zoals jongeren dat kennen van de typtest van Typewriter: fouten blijven bij het typen
            staan en worden niet gemarkeerd, Backspace verbetert alleen in de regel
            waarin de leerling bezig is. Pas aan het eind telt wat er nog fout staat -
            per woord hoogstens één fout, het begonnen laatste woord telt niet, en
            verbeterde plekken tellen helemaal niet. Omdat een fout die blijft staan
            daarbij geen eigen tijd heeft gekost, weegt hij zwaarder:{" "}
            {tekens(FEHLER_GEWICHT_FREI)} in plaats van {tekens(FEHLER_GEWICHT)} (8a).
            Kies "Vrij typen" als de klas het overtypen van een tekst moet oefenen
            zonder dat een verkeerde toets het verder typen ophoudt; "Streng" voor
            een Uitdaging van de toetsenbordroutes zelf.
          </p>
          <p className="m-0">
            <strong>Drie klokken die je uit elkaar moet houden:</strong>
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              Het <strong>startmoment</strong> - het moment waarop je op "Nu starten"
              drukt. Vanaf dan mag de klas beginnen.
            </li>
            <li>
              De <strong>tijd om te beginnen</strong>: {minuten} vanaf het
              startmoment. Zo lang kan een leerling nog instappen; wie later komt, is
              te laat.
            </li>
            <li>
              De <strong>duur van de Uitdaging</strong> loopt voor{" "}
              <strong>elke leerling apart</strong>, en pas vanaf de{" "}
              <strong>eerste toetsaanslag</strong> van die leerling. Twee leerlingen
              uit dezelfde klas stoppen daarom op verschillende momenten - dat is zo
              bedoeld: wie eerst de plek nog moet vinden, verliest geen tijd.
            </li>
          </ul>
          <p className="m-0">
            <strong>De teksten:</strong> per niveau zijn er{" "}
            <strong>{teksten} voor de Uitdaging</strong>, elk minstens{" "}
            {zahl(MIND_ZEICHEN, "nl")} tekens lang - zo lang dat de tekst ook bij een
            hoge snelheid nooit opraakt. Ze <strong>komen in de cursus niet
            voor</strong>, dus geen leerling kan ze vooraf hebben geoefend. De
            volgende Uitdaging op een niveau begint waar de leerling die in de vorige
            het verst kwam, is gestopt: bij de volgende regel, bij teksten met zinnen
            aan het begin van de volgende zin. Raakt een tekst tijdens de Uitdaging op,
            dan typen de leerlingen zonder pauze verder in de volgende.
          </p>
          <p className="m-0">
            <strong>Leerlingen die blind zijn</strong> typen de Uitdaging met het{" "}
            <strong>voorlezen van de app</strong> (<Kbd>Alt</Kbd> + <Kbd>V</Kbd>) -
            net als bij het oefenen, zonder eigen vinkje van de leerkracht. De tijd
            waarin een leerling op de stem wacht, haalt de klok van de Uitdaging er
            vanzelf af; een leerling die de tekst ziet en toch laat voorlezen, krijgt
            dezelfde tijd eraf.
          </p>
          <p className="m-0">
            <strong>De resultaten</strong> staan in het opengeklapte onderdeel bij
            "Eerdere Uitdagingen" - de knop "Uitdaging" vooraan in de balk klapt het
            open: per leerling de plaats, de <strong>score van de Uitdaging</strong>,
            of er is voorgelezen, de snelheid, de nauwkeurigheid en de onzekere
            toetsen. Hoe de score van de Uitdaging ontstaat, staat in 8a. Zodra de
            Uitdaging voor de <strong>hele klas</strong> voorbij is, komt er een{" "}
            <strong>verzamelmail</strong> met dezelfde waarden. Pas dan - een mail
            terwijl er nog iemand typt, zou onvolledig zijn, en een tweede "deze keer
            echt iedereen" wil niemand.
          </p>
          <p className="m-0">
            Een leerling kan <strong>"Deze keer doe ik niet mee"</strong> kiezen. De
            leerling oefent dan gewoon verder en staat in de uitslag als{" "}
            <strong>"heeft niet meegedaan"</strong>. Elke leerling ziet de eigen
            Uitdagingen later in <strong>"Mijn voortgang"</strong> - dezelfde
            waarden die jij ziet.
          </p>
        </Section>

        <Section title="9 · Zelfstandig werk en AI-controle (alleen voor jou)">
          <p className="m-0">
            De kolom <strong>"Zelfstandig werk"</strong> laat een waarde van{" "}
            <strong>1 tot 10</strong> zien. Die wordt hoog bij aanwijzingen dat iets
            niet zelf is getypt: <em>plakken</em>, vaak wisselen van venster of focus,
            een onwaarschijnlijk hoge snelheid of een vlekkeloze nauwkeurigheid zonder
            leerverloop. Deze waarde zie <strong>alleen jij</strong>, niet de
            leerlingen.
          </p>
        </Section>

        <Section title="10 · Toegankelijkheid">
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Contrast en lettergrootte:</strong> via de balk bovenaan (licht,
              donker, sterk contrast); <Kbd>Alt</Kbd> + <Kbd>+</Kbd> / <Kbd>-</Kbd>{" "}
              maakt het typveld groter of kleiner.
            </li>
            <li>
              <strong>Voorlezen</strong> (de eigen stem van de app) met{" "}
              <Kbd>Alt</Kbd> + <Kbd>V</Kbd> - voor leerlingen zonder ingestelde
              schermlezer (met NVDA, JAWS of VoiceOver kun je het beter uit laten). Je
              kiest of <em>letters, woorden of zinnen</em> worden voorgelezen, de
              spreeksnelheid en <strong>welke stem</strong>. Bij de taal Nederlands
              zoekt de app vanzelf een Nederlandse stem; ontbreekt die, dan verschijnt
              een uitleg om er een te installeren. De{" "}
              <strong>voorleestijd wordt uit de snelheid gehaald</strong> - leerlingen
              die braille leren en het voorlezen nodig hebben, hebben zo geen nadeel
              bij het aantal aanslagen en in de statistiek.
            </li>
            <BrailleTabellenPunkte weg="nl" />
            <li>
              <strong>Vingermelding:</strong> twee keer kort op <Kbd>Shift</Kbd>{" "}
              drukken zegt de goede vinger.
            </li>
            <li>
              <strong>Focus leiden (sinds 22 augustus 2026):</strong> elke knop heeft
              een vast doel - wie hem gebruikt, weet daarna waar de cursor staat. Voor
              leerlingen die met een brailleleesregel werken, is dat het verschil
              tussen verder werken en zoeken. Drie regels die in de klas opvallen:{" "}
              <Kbd>Esc</Kbd> sluit elk venster en gaat <strong>altijd terug naar
              het typveld</strong>; een andere weergave (statistiek, bibliotheek,
              inloggen) komt uit op de <strong>kop van de nieuwe weergave</strong> en
              zegt die; en <strong>niets verdwijnt vanzelf</strong> - ook het feestje
              bij een nieuwe toets wacht tot de leerling op "Verder" drukt.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>E</Kbd> springt naar het typveld,{" "}
              <Kbd>Alt</Kbd> + <Kbd>H</Kbd> opent de help.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>U</Kbd> gaat naar het oefenen, <Kbd>Alt</Kbd> +{" "}
              <Kbd>S</Kbd> naar <strong>"Mijn klassen"</strong> (bij het oefenen:
              naar de eigen statistiek); <Kbd>Alt</Kbd> + <Kbd>Z</Kbd> zegt welke
              regel nu aan de beurt is.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>D</Kbd> geeft de oefentijd - op de
              brailleleesregel en (met Voorlezen) als melding.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>T</Kbd> opent of sluit de{" "}
              <strong>lijst met sneltoetsen</strong>.
            </li>
          </ul>
        </Section>

        <Section title="11 · Verwijderen">
          <p className="m-0">
            Losse leerlingen of een hele klas kun je definitief verwijderen (met
            account, voortgang en resultaten). Dat kan niet ongedaan worden gemaakt -
            de app vraagt het eerst na.
          </p>
        </Section>

        <Section title="12 · Downloads: handleiding en poster (pdf)">
          <p className="m-0">
            Alles uit deze help, en nog veel meer, staat in de{" "}
            <strong>handleiding voor leerkrachten</strong>:
            de leerroutes met alle stappen en volgordes, alle verhalen en
            weetjesreeksen met het moment waarop ze opengaan, alle medailles en
            beloningen, en daarbij een <strong>checklist "Is mijn klas klaar om te
            beginnen?"</strong> en een <strong>kopieerblad voor de voortgang per
            leerling</strong>.
          </p>
          <HandbuchLaden />
          <p className="m-0 text-sm text-ink-muted">
            De handleiding wordt rechtstreeks uit de inhoud van de app gemaakt - een
            controle in de broncode dwingt af dat ze bij elke inhoudelijke
            verandering wordt bijgewerkt. Ze is daardoor altijd volledig en actueel.
          </p>
          <p className="m-0">
            Voor aan de muur in de klas of in de lerarenkamer is er de{" "}
            <strong>poster van Tastenflow om op school op te hangen</strong>: A3
            staand, om af te drukken - in één oogopslag wat Tastenflow kan, met een
            QR-code naar tastenflow.org. Anders dan de handleiding is de poster vrij
            voor iedereen, ook zonder in te loggen: de leerlingen vinden hem in hun
            help, en je kunt het adres doorgeven aan elke school en instelling. De
            poster is er in het Nederlands (tastenflow.org/tastenflow-plakat-nl.pdf).
          </p>
          <PlakatLaden />
          <p className="m-0 text-sm text-ink-muted">
            Beide staan ook in "Mijn klassen" bij "Downloads".
          </p>
        </Section>
      </div>
    </div>
  );
}
