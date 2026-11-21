/**
 * ★★★ O-NL (25.10.2026): DIE HILFE ZU „MEINE KLASSEN" AUF NIEDERLÄNDISCH.
 * ===========================================================================
 * Massgeblich ist die deutsche Fassung (`MeineKlasseHilfe.tsx`): dieselben
 * Abschnitte, dieselben Tatsachen; der Aufbau folgt `MeineKlasseHilfe.cs.tsx`.
 * Sichtbar nur mit `spracheGewaehlt === "nl"`; jedes Programm ohne
 * Sprach-Anbieter zeigt weiter die deutsche Fassung.
 *
 * Anrede (Glossar `recherche-niederländisch-2026-10-25/GLOSSAR-nl.md`,
 * Regel 1 und 2): Imperativ ohne Pronomen, sonst „je"; Kinder heissen in
 * dieser Sicht „leerling/leerlingen", kein zijn/haar für eine unbekannte
 * Person. Was die Lehrkraft der Klasse sagt, steht in der je-Form der Kinder
 * („De tijd loopt vanaf je eerste toetsaanslag."). Knopfnamen mit geraden
 * Anführungszeichen (Regel 7), Zähler mit „van" („Klaar: 12 van 14").
 * Die Startpunkte werden über ihr Prinzip beschrieben, nicht über eine
 * Buchstabenfolge: die Folge des Weges „nl" (F4) war beim Schreiben noch
 * nicht gemessen - nur F und J und die Grundreihe der beiden Tastaturen
 * stehen fest (Bauplan nl N1: `nl-intl` f j d k s l a, `be` f j d k s l m,
 * q dort nur als Stütze).
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

// ★ O-NL (25.10.2026): „Uitdaging" (Glossar §2.3) steht ausgeschrieben im
// Text, solange `PRUEFUNG_WORT` für „nl" noch den englischen Rückfall liefert.
export function MeineKlasseHilfeNiederlaendisch({
  onClose,
  programmName,
}: {
  onClose: () => void;
  /** Das offene Programm - davon hängt ab, welche Abschnitte dastehen. */
  programmName?: string;
}) {
  const tastenflow = programmName === "Tastenflow";
  const einstiegsMinuten = mehrzahl(EINSTIEGSFENSTER_MIN, "nl", {
    one: (z) => `${z} minuut`,
    other: (z) => `${z} minuten`,
  });
  return (
    <Modal title='Help bij "Mijn klassen"' onClose={onClose} size="lg">
      <div className="space-y-5">
        <RundgangMeineKlassenKnopf onStart={onClose} programmName={programmName} />
        <p className="m-0 text-sm leading-relaxed text-ink">
          Hier werk je met je klas. Klassen en accounts maak je{" "}
          <strong>één keer</strong> aan - ze gelden in elk leerprogramma, met
          dezelfde klascode en hetzelfde wachtwoord.
          {tastenflow && (
            <>
              {" "}
              Wie als leerkracht Tastenflow opent, komt altijd hier. Naar het eigen
              oefenen gaat "Oefenen" (<Taste>Alt</Taste> + <Taste>U</Taste>).
            </>
          )}
        </p>

        <Abschnitt titel="Zo is de pagina opgebouwd">
          <p className="m-0">
            <strong>Bovenaan bij de klas</strong> staan de naam - bij meer klassen in
            de keuzelijst "Klas", waarmee je van klas wisselt -, het aantal
            leerlingen en de klascode. Rechts in die regel, vóór "Downloads", staat
            de schakelaar <strong>"Voortgang | Leerlingen en toegang"</strong> - op
            dezelfde plek op beide schermen waar hij naartoe leidt.
          </p>
          <p className="m-0">
            Bij <strong>"Leerlingen en toegang"</strong> maak je een nieuwe klas aan,
            voeg je leerlingen toe en verplaats je ze, zie je wachtwoorden en
            inloggegevens, de klascode en welke programma's de klas heeft. Veel
            leerlingen tegelijk voeg je daar toe bij "Leerlingen" met{" "}
            <strong>"Leerlingen importeren uit Excel"</strong>: eerst "Sjabloon
            downloaden (Excel)", dan per leerling een regel met naam, wachtwoord en -
            voor Tastenflow - waar de leerling begint. Een leeg wachtwoord maakt het
            programma zelf; een voorbeeld laat zien wat er wordt overgenomen, en alle
            geïmporteerde leerlingen staan daarna bij "Inloggegevens afdrukken". Met{" "}
            <strong>"Klassenlijst downloaden"</strong> ernaast download je altijd een
            Word-bestand met naam, wachtwoord en klascode van ALLE leerlingen van deze
            klas - om af te drukken.
            {!tastenflow && (
              <>
                {" "}
                Een bericht aan alle leerlingen schrijf je daar met "Bericht aan de
                klas".
              </>
            )}
          </p>
          <p className="m-0">
            Bij <strong>"Voortgang"</strong> - daar kom je uit als je de pagina opent
            - staan de leerprogramma's van deze klas, "Downloads" en daaronder de
            klasstatistiek: hoe ver elke leerling is.
            {tastenflow && (
              <>
                {" "}
                Helemaal bovenaan staat daarin een balk met knoppen:{" "}
                <strong>Uitdaging</strong>, <strong>Eigen oefening</strong>,{" "}
                <strong>Weekdoel</strong>, <strong>Klasinstellingen</strong> en{" "}
                <strong>1 uur pauzeren</strong>. Elke knop opent een eigen onderdeel
                eronder - altijd maar één tegelijk, met <Taste>Esc</Taste> weer
                dicht. "Uitdaging" opent het formulier met "Gebruikte toetsen", "Min"
                en "Nu starten", en de eerdere Uitdagingen; "Eigen oefening" legt een
                tekst vast voor de hele klas (bestand uploaden, uit "Mijn teksten" of
                een sjabloon uit de cursus - de leerlingen krijgen daarvoor een
                venster met alleen "Verder"); "Weekdoel" stelt minuten per week in;
                "1 uur pauzeren" zet 60 minuten waarin verder wordt geoefend, maar
                niets voor het weekdoel telt. Daaronder het "Klasoverzicht" (maand of
                schooljaar, met scorebalk en lijndiagram); rechts in de kop daarvan
                staat "Bericht aan de klas" - een bericht aan alle leerlingen, elke
                leerling krijgt het in een eigen gesprek.
              </>
            )}
          </p>
          {tastenflow && (
            <p className="m-0">
              De knop <strong>"Klasinstellingen"</strong> in de balk opent: het
              leerjaar (daaruit berekent de app de soorten teksten en telt elk
              schooljaar een leerjaar verder; "Volwassenen" telt niet verder), de taal
              met het slot, het startpunt van de klas (dat geldt ook voor leerlingen
              die er later bij komen) en de klassenwedstrijd. Deze vier gelden voor de
              hele klas en worden al bij het aanmaken van een klas gevraagd; per
              leerling blijven "Waar beginnen?", "Met één hand typen" en "Snelheid
              telt niet" in de opengeklapte regel van die leerling.
            </p>
          )}
          {tastenflow && (
            <p className="m-0">
              De standen bij <strong>"Waar beginnen?"</strong> zijn naar toetsen
              genoemd: "Beginner: alleen F en J" is alleen F en J, "Basishouding" de
              hele basisrij. Bij <strong>"Eerste letters + hoofdletters"</strong>{" "}
              komen de letters erbij die het vaakst voorkomen, en de toets Shift.
              "Alle letters", "+ leestekens", "+ cijfers" en "Alles" spelen daarna de
              rest vrij, op volgorde.
            </p>
          )}
          <p className="m-0">
            Elke knop legt zichzelf uit: de tip verschijnt zodra de focus er met Tab
            op komt. <Taste>Esc</Taste> stuurt hem weg.
          </p>
        </Abschnitt>

        {tastenflow && (
          <Abschnitt titel="De Uitdaging stap voor stap">
            <ol className="m-0 list-decimal space-y-1 pl-5">
              <li>
                Helemaal bovenaan in de klasstatistiek, in de opdrachtenbalk, opent de
                knop "Uitdaging" het formulier.
              </li>
              <li>
                Kies de <strong>gebruikte toetsen</strong> - alle leerlingen krijgen
                dezelfde tekst op dit niveau.
              </li>
              <li>
                Vul de <strong>duur van de Uitdaging</strong> in minuten in - het veld
                staat meteen naast het niveau.
              </li>
              <li>
                Zeg tegen de leerlingen: <em>De tijd loopt vanaf je eerste
                toetsaanslag.</em> Vanaf de start hebben ze {einstiegsMinuten} om te
                beginnen; de duur van de Uitdaging loopt voor elke leerling apart.
              </li>
              <li>
                <strong>"Nu starten"</strong> - de Uitdaging begint meteen voor de
                hele klas.
              </li>
              <li>
                Meteen daarna staat daar bijvoorbeeld{" "}
                <strong>"Klaar: 12 van 14 - nog niet: Said, Jano"</strong>: bij 12
                leerlingen is de Uitdaging al op het apparaat aangekomen. Ze
                verschijnt daar na ongeveer een seconde. Staat een leerling langer bij
                "nog niet", dan helpt het meestal om de pagina één keer opnieuw te
                laden.
              </li>
              <li>
                Zolang ze loopt, zie je "Ingeleverd: 3 van 18" met de namen.
              </li>
              <li>
                Daarna staan de resultaten onder het formulier: per leerling de plaats,
                de <strong>score van de Uitdaging</strong>, of er is voorgelezen,
                aanslagen per minuut, nauwkeurigheid, tekens, fouten en onzekere
                toetsen. Daarbij komt een verzamelmail.
              </li>
            </ol>
          </Abschnitt>
        )}

        {tastenflow && (
          <>
            <Abschnitt titel="Wat de kolommen van de tabel betekenen">
              <SpaltenHilfe />
            </Abschnitt>

            <Abschnitt titel="Wat het moeilijkheidsniveau betekent">
              <LeistungsstufeHilfe />
            </Abschnitt>

            <Abschnitt titel="De waarden waarop je een beoordeling kunt baseren">
              <DreiWerteHilfe />
            </Abschnitt>
          </>
        )}

        <Abschnitt titel="De klascode">
          <p className="m-0">
            Hij staat bovenaan naast de naam van de klas en geldt voor alle
            programma's. Wie inlogt, vult klascode, naam en wachtwoord in; het
            apparaat onthoudt de code, daarna zijn naam en wachtwoord genoeg.
          </p>
          <p className="m-0">
            Bij het aanmaken van een klas is hij <strong>verplicht</strong>. Terwijl
            je de naam typt, stelt het programma een passende code voor - van "6B
            Zonnebloem" wordt "6BZONNEBLOEM". Je kunt hem veranderen, maar niet leeg
            laten. Later verander je hem bij "Leerlingen en toegang" met "Wijzigen".
          </p>
          <p className="m-0">
            ⚠️ Verander je de code, dan loggen alle leerlingen van de klas vanaf dan
            in met de nieuwe.
          </p>
        </Abschnitt>

        <Abschnitt titel="Een leerling naar een andere klas verplaatsen">
          <p className="m-0">
            Bij "Leerlingen en toegang" staat bij elke leerling{" "}
            <strong>"Naar een andere klas verplaatsen"</strong>. Dat opent het veld
            "Klascode van de nieuwe klas". Dat kan naar elke klas waarvan je de
            klascode kent - ook naar de klas van een andere leerkracht. Vóór het
            verplaatsen vraagt het programma het nog een keer na.
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>De leerling logt daarna in met de nieuwe klascode.</li>
            <li>
              De leerkrachten van de nieuwe klas zien de leerling en de voortgang van
              de leerling.
            </li>
            <li>
              {tastenflow
                ? "De resultaten van de Uitdagingen en de berichten blijven bij de vorige klas."
                : "De berichten blijven bij de vorige klas."}
            </li>
          </ul>
        </Abschnitt>

        <Abschnitt titel="Sneltoetsen in dit deel">
          <p className="m-0">
            <Taste>Alt</Taste> + <Taste>H</Taste> opent en sluit deze help.{" "}
            <Taste>Alt</Taste> + <Taste>T</Taste> laat de lijst met alle sneltoetsen
            zien. <Taste>Alt</Taste> + <Taste>U</Taste> gaat naar het eigen oefenen.{" "}
            <Taste>Alt</Taste> + <Taste>N</Taste> opent de berichten,{" "}
            <Taste>Alt</Taste> + <Taste>K</Taste> de keuze voor kleuren en contrast
            en <Taste>Alt</Taste> + <Taste>J</Taste> het menu van je account.
          </p>
          <p className="m-0">
            Met Tab ga je langs de tabbladen; Enter wisselt. Na een wissel staat de
            leesplek in het nieuwe deel - een schermlezer leest vanaf daar verder.
          </p>
        </Abschnitt>

        <Abschnitt titel="Nog meer uitleg">
          <p className="m-0">
            De handleiding voor leerkrachten (voorlopig in het Engels) open je
            bovenaan via "Downloads" - daar staat ook de poster van Tastenflow om af
            te drukken en op te hangen (A3, voorlopig in het Engels), die er is voor
            iedereen, ook zonder in te loggen.
            {tastenflow && (
              <>
                {" "}
                De help in het programma zelf open je daar met{" "}
                <Taste>Alt</Taste> + <Taste>H</Taste>.
              </>
            )}
          </p>
        </Abschnitt>
      </div>
    </Modal>
  );
}
