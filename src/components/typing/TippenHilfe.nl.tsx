/**
 * ★★★ O-NL (25.10.2026): DAS HILFE-FENSTER FÜR DIE LERNENDEN, NIEDERLÄNDISCH.
 * ===========================================================================
 * Inhalt nach der deutschen `TippenHilfeDeutsch` (`TippenHilfe.tsx`), Aufbau
 * nach `TippenHilfe.cs.tsx` (dieselben Abschnitte, `detail`-Stufen,
 * `isAdult`/`jugend`-Fälle). Wo cs und de abweichen, gilt de - darum steht hier
 * z. B. wieder: die falsche Shift-Taste oder Caps Lock zählt als Fehler
 * (`useTypingItem` `correctShiftHeld`, nachgelesen), und der Abschnitt über das
 * eine Konto für die vier Programme. Wie die anderen Übersetzungen ohne den
 * Einführungs-Podcast (die niederländische Bedienung hat keinen) und ohne den
 * Absatz über die deutschen Lektionen (der Weg „nl" hat eine eigene Folge).
 *
 * ── ANREDE (Glossar `recherche-niederländisch-2026-10-25/GLOSSAR-nl.md`) ──
 * Kinder, Jugendliche und Selbstlernende: **je/jij/jouw** (Regel 1). Knöpfe im
 * Infinitiv oder als Hauptwort, in der Hilfe mit geraden Anführungszeichen
 * (Regel 7). Tastennamen wie auf der Kappe: Shift, Caps Lock, Enter,
 * Backspace, Esc, Alt Gr, spatiebalk (§2.9). Kein „klik/tik/sleep" (Regel 9),
 * kein „blind typen" (Regel 4), kein „toets" für die Prüfung (§4 Falle 1):
 * die Tippchallenge heisst „Uitdaging". Ausrufezeichen nur, wo allein Kinder
 * lesen (`kind`), höchstens eines je Absatz.
 *
 * ── WAS NIEDERLÄNDISCH ANDERS IST ───────────────────────────────────────────
 *  · Die Tastaturen des Weges „nl" (`layouts.ts`, Befund G3b): `nl-intl`
 *    („Verenigde Staten (internationaal)", NL) mit ' und " als Totasten,
 *    `be` („Belgisch (punt)", Flandern, AZERTY) mit Ziffern nur über Shift und
 *    é è ç à auf der Ziffernreihe, `nl-dutch` („Nederlands") als Nebenweg.
 *    Mac-Belegungen sind ungemessen - darum nur „Option statt Alt Gr".
 *  · Die Reihenfolge zeigt die Buchstaben des Weges, auf dem das Kind übt
 *    (`layoutLetterOrder`); der Text nennt nur die Grobfolge.
 *  · Das Plakat gibt es seit 06.11.2026 auf Niederländisch (`handbuchInSprache`).
 *  · Die Zeile unter dem Übungsfeld heisst „statusbalk" (nicht „regel" - das
 *    ist die Übungszeile, §4 Falle 3), das Feld „typveld".
 *
 * Nur Bindestrich, keine Maus-Wörter, keine Abkürzungen (Regel 8).
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

// ★ O-NL (25.10.2026): das Wort der Tippchallenge (Glossar §2.3), gross wie
// ein Name, auch in der Mehrzahl. Steht hier, solange `schreibprobe.ts` für
// „nl" noch das englische Wort liefert (Rückfall aus G2).
const UITDAGING = "Uitdaging";
const UITDAGINGEN = "Uitdagingen";

export function TippenHilfeNiederlaendisch({ open, onClose, stufe, lernweg = "nl" }: TippenHilfeProps) {
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
  // Dasselbe Wort wie der Ring (Glossar §2.2: Spielstufe „level",
  // Übungsstufe „niveau").
  const ringWort = kind ? "level" : "niveau";
  const einstiegsMinuten = mehrzahl(EINSTIEGSFENSTER_MIN, "nl", {
    one: (z) => `${z} minuut`,
    other: (z) => `${z} minuten`,
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Help bij Tastenflow"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        className="card my-8 w-full max-w-2xl space-y-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="m-0 text-xl font-semibold text-ink">Help - zo werkt Tastenflow</h2>
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

        <RundgangNochmalKnopf onStart={onClose} />

        <Section title="Begin gewoon te typen">
          <p className="m-0">
            Je hoeft het typveld niet eerst te kiezen. Typ gewoon - de eerste letter
            staat meteen in het veld. Ben je ergens anders, dan ben je met{" "}
            <Kbd>Alt</Kbd> + <Kbd>E</Kbd> meteen terug in het typveld.
          </p>
          <JawsRueckweg weg="nl" />
          {detail === 1 && (
            <p className="m-0">
              Typ altijd met de goede vinger - het toetsenbord onderaan laat zien
              welke toets aan de beurt is. Druk twee keer kort op <Kbd>Shift</Kbd>,
              dan hoor je welke vinger je gebruikt.
            </p>
          )}
        </Section>

        <Section title="Deze tekens staan in de tekst">
          <Zeichenerklaerung
            titel={null}
            zeichen={[
              { zeichen: "·", bedeutung: "scheidt twee gegevens die bij elkaar horen - zoals een komma." },
              { zeichen: "→", bedeutung: "daarna, of: dit wordt het." },
              { zeichen: "⏱", bedeutung: "de tijd die je hebt geoefend." },
              {
                zeichen: "↵",
                bedeutung:
                  "staat aan het eind van de regel als je klas dat zo heeft ingesteld - dan sluit je de regel af met Enter.",
              },
            ]}
          />
        </Section>

        <Section title="Sterren verzamelen 🌟">
          <p className="m-0">
            Na elke ronde krijg je <strong>1 tot 3 sterren</strong> - met een eigen
            geluid erbij.{" "}
            <strong>Weinig fouten telt veel meer dan snelheid:</strong> wie rustig en
            precies typt, haalt zeker sterren - wie raast en vaak een verkeerde toets
            raakt, niet.
            {kind ? " Iedereen kan sterren halen!" : ""}
          </p>
          {detail >= 2 && (
            <p className="m-0">
              3 sterren krijg je voor een echt goede ronde - precies getypt en met
              een behoorlijke snelheid, waarbij <strong>precies</strong> altijd
              belangrijker is dan <strong>snel</strong>. Typ je een tijdje goede
              rondes, dan ga je een <strong>moeilijkheidsniveau</strong> omhoog - dan
              klinkt de beloning nog een beetje anders.
            </p>
          )}
        </Section>

        <Section title="Medailles verzamelen 🏅">
          <p className="m-0">
            Voor bijzondere prestaties krijg je <strong>medailles</strong> -
            bijvoorbeeld voor een ronde helemaal zonder fouten of voor drie foutloze
            rondes na elkaar. Bij een nieuwe medaille klinkt er een eigen{" "}
            <strong>"ta-daa"</strong> en hoor je de naam.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Alle medailles staan in <strong>"Mijn voortgang"</strong>, meteen na
              de weekdoelen en jouw scores - daar staat ook altijd de{" "}
              <strong>volgende mijlpaal</strong> (bijvoorbeeld: nog 2 foutloze
              rondes tot de volgende medaille). De meeste medailles krijg je voor{" "}
              <strong>precies typen</strong> en voor <strong>volhouden</strong> -
              niet voor racen. En een paar zijn <strong>geheim</strong>: wat je
              ervoor moet doen, staat nergens, ze verschijnen gewoon.
            </p>
          )}
          {detail >= 2 && (
            <p className="m-0">
              Daar staat ook jouw <strong>score</strong>: die zet nauwkeurigheid en
              snelheid samen in één getal van 0 tot 100 - een verkeerde toets telt
              als 5 tekens, en dubbele snelheid telt maar 1,4 keer. Nauwkeurigheid
              wint dus van snelheid.
            </p>
          )}
          {detail >= 2 && (
            <p className="m-0">
              Verder naar onderen laat "Verloop" (een regel om open te klappen) een
              kleine lijn zien. Het is normaal dat die lijn niet alleen stijgt.
              Komen er nieuwe toetsen bij, dan daalt hij meestal eerst - vooral bij
              Shift en bij de cijfers.
            </p>
          )}
          <p className="m-0">
            Tip: kies een medaille in "Mijn voortgang" en druk op <Kbd>Enter</Kbd> -
            de medaille verschijnt dan <strong>groot</strong>, met glans en confetti.
          </p>
        </Section>

        {skin === "jugend" && (
          <Section title="Na een nieuwe toets">
            <p className="m-0">
              Een <strong>nieuwe toets</strong> is van jou zodra de vorige toetsen
              zeker zijn - daarvoor hoef je niets te winnen. Hij wordt kort gevierd,
              en daarna gaat het verder. Meer gebeurt er niet.
            </p>
            <p className="m-0">
              Als je wilt, kan daarna een kort spel komen: het{" "}
              <strong>IJsschotsenspel</strong>. Dat stel je zelf in - in{" "}
              <strong>Instellingen</strong> (<AltText>Alt + O</AltText>) bij{" "}
              <strong>Beloningsspel</strong>. Standaard staat daar{" "}
              <strong>Geen</strong>. Deze instelling geldt voor dit apparaat.
            </p>
          </Section>
        )}

        {!isAdult && (
          <Section title="Het IJsschotsenspel 🐧">
            {skin === "jugend" ? (
              <>
                <p className="m-0">
                  Je kunt het <strong>altijd zelf starten</strong> - met de knop{" "}
                  <strong>🐧 Spelen</strong> in de statusbalk onder het typveld. De
                  pinguïn springt over ijsschotsen, klimt de letterberg op en glijdt
                  op zijn buik naar beneden - altijd met de toetsen die je nu het
                  moeilijkst vindt. Onderweg springen er <strong>bonusvissen</strong>{" "}
                  op (op tijd getypt = gevangen, nooit een fout), en in{" "}
                  <strong>de echogrot</strong> wordt elke toets alleen uitgesproken.
                  Het spel telt <strong>niet</strong> als oefentijd en is geen
                  voorwaarde voor nieuwe tekens - maar het levert wel eigen medailles
                  op.
                </p>
                <p className="m-0">
                  Na een nieuwe toets komt het <strong>alleen</strong> vanzelf als
                  je het in Instellingen als <strong>Beloningsspel</strong> hebt
                  gekozen. Anders onderbreekt niets je - jij beslist wanneer er
                  gespeeld wordt.
                </p>
              </>
            ) : (
              <>
                <p className="m-0">
                  Heb je een <strong>nieuwe toets</strong> gehaald? Dan wacht als
                  feestje het IJsschotsenspel: help de pinguïn over het water - druk
                  steeds op de toets die op de volgende ijsschots staat! Soms gaat
                  het daarna zelfs de <strong>letterberg</strong> op en op de buik
                  weer naar beneden. De nieuwe toets is al van jou - het spel is de
                  beloning, geen moetje.
                </p>
                <p className="m-0">
                  Je kunt het spel ook <strong>altijd zelf starten</strong> - met de
                  knop <strong>🐧 Spelen</strong> bovenaan op je oefenkaart, naast de
                  ring. Dat is het grote <strong>avontuur</strong>: het ziet er elke
                  dag een beetje anders uit, onderweg springen er{" "}
                  <strong>bonusvissen</strong> op (druk snel op hun toets en ze zijn
                  gevangen), en in <strong>de echogrot</strong> zie je geen letters
                  -{" "}
                  {hoehleMitWesen ? (
                    <>
                      de grot <strong>zegt</strong> je elke toets.
                    </>
                  ) : (
                    <>
                      elke toets klinkt als een toon, en de schermlezer of de
                      brailleleesregel <strong>zegt</strong> je welke het is.
                    </>
                  )}{" "}
                  Het is alleen voor de lol en telt <strong>niet</strong> als
                  oefentijd - maar het levert wel eigen medailles op.
                </p>
                {detail >= 2 && (
                  <p className="m-0">
                    Geen zorgen: zakt een ijsschots weg of glijd je uit op de berg,
                    dan zwemt de pinguïn gewoon terug - je kunt het meteen opnieuw
                    proberen, zo vaak als je wilt. En wie het hele avontuur haalt
                    zonder één plons, ziet bij de iglo het{" "}
                    <strong>poollicht</strong> dansen!
                  </p>
                )}
              </>
            )}
          </Section>
        )}

        <Section title="Wat betekent de ring met het getal?">
          <p className="m-0">
            Het getal in de ring is jouw <strong>{ringWort}</strong>.{" "}
            <strong>{kind ? "XP zijn punten voor het oefenen:" : "Punten krijg je voor het oefenen:"}</strong>{" "}
            voor elke ronde krijg je er een paar, en de ring loopt vol. Is hij vol
            (100 punten), dan ga je een {ringWort} omhoog. Dat is alleen om te
            verzamelen en maakt het oefenen <strong>niet</strong> moeilijker - zoals
            punten in een spel.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Haal dat niet door elkaar met het{" "}
              <strong>moeilijkheidsniveau (1-50)</strong>: dat zegt hoe snel je moet
              typen, en het past zich <strong>vanzelf</strong> aan jou aan - het gaat
              omhoog als het goed gaat, en het wordt makkelijker als het moeilijk is.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0">
              En de instelling <strong>"Teksten voor"</strong> bepaalt alleen hoe
              moeilijk de woorden en zinnen zijn - passend bij je leeftijd. In een
              klas stelt je leerkracht dat voor iedereen in; zonder klas vind je het
              bovenaan in Instellingen ⚙. Drie verschillende dingen dus:{" "}
              <em>{ringWort}</em> = punten, <em>moeilijkheidsniveau</em> = hoe snel,{" "}
              <em>Teksten voor</em> = leeftijd.
            </p>
          )}
        </Section>

        <Section title={detail === 1 ? "Hoe vaak oefenen?" : "Oefentijd en weekdoel"}>
          {detail === 1 ? (
            <p className="m-0">
              Oefen liever <strong>vaak een beetje</strong> dan één keer heel lang -
              bijvoorbeeld op een paar dagen een paar minuten. In de statusbalk onder
              het typveld telt een klok hoe lang je vandaag al hebt getypt; precies
              die tijd vult daar ook de <strong>ring</strong> - jouw weekdoel.
            </p>
          ) : (
            <p className="m-0">
              Met een account kun je een <strong>weekdoel</strong> hebben: een aantal{" "}
              <strong>minuten per week</strong>. In een klas stelt je leerkracht het
              in; zonder klas kun je het zelf instellen in Instellingen ⚙ bij "Mijn
              weekdoel" - een nieuw doel geldt vanaf de volgende maandag. De week
              begint op <strong>maandag om 8.00 uur</strong> en loopt tot de maandag
              daarna. In de statusbalk onder het typveld staat jouw stand als{" "}
              <strong>ring</strong>, bijvoorbeeld "25 van 60 min" - is de week
              gehaald, dan is de ring vol en staat er een vinkje in. Soms zijn er
              ook gemiste minuten uit een eerdere week om <strong>in te halen</strong>;
              dan staat ernaast hoeveel. Is het weekdoel gehaald, dan verschijnt er
              een kort venster met een felicitatie - daarna kun je altijd verder
              oefenen als je wilt.
            </p>
          )}
        </Section>

        <Section title="Instellingen: het tandwiel ⚙ bovenaan">
          <p className="m-0">
            Alle instellingen zitten achter de knop <strong>⚙ Instellingen</strong>{" "}
            helemaal bovenaan, links naast het ronde teken met de eerste letter van
            je naam: <strong>Wat oefen je?</strong>, <strong>Teksten</strong>{" "}
            (leeftijd en taal), <strong>Toetsenbord</strong>, <strong>Geluid</strong>{" "}
            en <strong>Voorlezen</strong>. Eén keer drukken klapt ze open, nog een
            keer weer dicht - of met <Kbd>Alt</Kbd> + <Kbd>O</Kbd>, dat kan ook
            midden in het typen. Bij het openklappen springt de cursor meteen naar
            de instellingen, bij het dichtklappen terug naar het typveld.
          </p>
          <p className="m-0">
            Helemaal bovenaan in Instellingen staat <strong>"Wat oefen je?"</strong>:
            de drie routes <strong>Mijn training</strong>, <strong>Verhalen</strong>{" "}
            en <strong>Woordspelletjes</strong>. Met <Kbd>Alt</Kbd> + <Kbd>B</Kbd>{" "}
            ga je naar de volgende route, en de nieuwe route wordt uitgesproken.
          </p>
          <p className="m-0">
            De ronde knop met de wereldbol bovenaan zet Tastenflow in een andere
            taal - de knoppen, de menu's en meteen ook de oefenteksten. De taal van
            de teksten kun je daarna bij <strong>Teksten</strong> apart veranderen,
            behalve als je leerkracht die heeft vastgezet.
          </p>
          <p className="m-0">
            Bij <strong>Toetsenbord</strong> stel je in welk toetsenbord echt voor je
            ligt. In Nederland is dat meestal{" "}
            <strong>Verenigde Staten (internationaal)</strong>, in Vlaanderen{" "}
            <strong>Belgisch (punt)</strong>. Daarna kloppen het schermtoetsenbord en
            de vingeraanwijzingen - en komen alleen tekens aan de beurt die op dit
            toetsenbord bestaan. Het belangrijkste:
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              Op <strong>Verenigde Staten (internationaal)</strong> zijn{" "}
              <Kbd>'</Kbd> en <Kbd>"</Kbd> dode toetsen: na de toets verschijnt er
              eerst niets. Typ daarna de letter - ' en e geeft <strong>é</strong>, "
              en e geeft <strong>ë</strong> - of de spatiebalk voor het teken zelf.
            </li>
            <li>
              Op <strong>Belgisch (punt)</strong> staan é, è, ç en à op de
              cijferrij. Cijfers typ je daar met <Kbd>Shift</Kbd>. Let op met{" "}
              <Kbd>Caps Lock</Kbd>: dan geven die toetsen cijfers.
            </li>
            <li>
              <strong>e</strong>, <strong>é</strong> en <strong>ë</strong> zijn drie
              verschillende letters - daarom wacht Tastenflow precies op de letter
              die in de tekst staat.
            </li>
            <li>
              Tekens zoals € typ je met <Kbd>Alt Gr</Kbd> (de rechter Alt-toets). Op
              een Mac gebruik je daarvoor de toets <Kbd>Option</Kbd>.
            </li>
          </ul>
          <p className="m-0">
            Daar staat ook <strong>"Met één hand typen"</strong> - voor iedereen die
            met één hand typt: dan gelden hoofdletters en speciale tekens met elke
            Shift-toets. In een klas stelt je leerkracht dat in.
          </p>
          <p className="m-0">
            Met <strong>"Brede letterafstand (CVI)"</strong> wordt tijdens het typen
            alles donker, behalve het veld waarin je typt (de oefenregel of het
            speelveld); na 5 seconden zonder typen wordt het weer licht. De
            oefenregel schuift daarbij mee in jouw typritme, in plaats van te
            springen. De letterafstand kun je in Instellingen ⚙ altijd zelf
            instellen - in een klas kan je leerkracht hem ook instellen; wat het
            laatst is gekozen, geldt.
          </p>
          <p className="m-0">
            Met <strong>Gericht oefenen</strong> kun je maximaal 8 toetsen of tekens kiezen die extra vaak in de rondes voorkomen - in de instellingen bij <strong>Wat oefen je?</strong> of met <Kbd>Alt</Kbd> + <Kbd>2</Kbd>. In een klas stelt je leerkracht dit in.
          </p>
        </Section>

        <Section title="Voorlezen - de app leest voor">
          <p className="m-0">
            Met <strong>🗣 Voorlezen</strong> (of <Kbd>Alt</Kbd> + <Kbd>V</Kbd>) leest
            de app voor - voor iedereen die (nog) geen schermlezer gebruikt. In
            Instellingen ⚙ bovenaan kies je of <strong>letters</strong>,{" "}
            <strong>woorden</strong> of <strong>zinnen</strong> worden voorgelezen -
            één, een paar of alles - en hoe snel.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Bij <strong>"Stem"</strong> kun je een andere stem kiezen. Is de taal{" "}
              <strong>Nederlands</strong>, dan zoekt de app zelf een Nederlandse stem;
              is er geen geïnstalleerd, dan verschijnt er een korte uitleg hoe je er
              een toevoegt.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0">
              Geen zorgen over je snelheid: de{" "}
              <strong>voorleestijd wordt eraf gehaald</strong> - het wachten op de
              stem maakt jouw snelheid niet lager.
            </p>
          )}
        </Section>

        <Section title="Melodie bij het typen 🎵">
          <p className="m-0">
            De <strong>melodie bij het typen</strong> is er om een{" "}
            <strong>gelijkmatig typritme</strong> te oefenen - en ze moet{" "}
            <strong>leuk</strong> zijn. Elke goede toets speelt de volgende toon van
            een liedje; wie in de maat blijft, krijgt er zelfs een band bij.
          </p>
          <p className="m-0">
            Wie gelijkmatig typt, wordt ook bij de zwakkere toetsen vlotter: het
            ritme helpt over de plekken heen waar je anders aarzelt.
          </p>
          <p className="m-0">
            Je zet haar aan met <Kbd>Alt</Kbd> + <Kbd>6</Kbd>, in Instellingen ⚙ of
            in het menu onder de ronde luidsprekerknop bovenaan - daar stel je met
            schuifregelaars ook het volume van alle geluiden in. De klank verander
            je met <Kbd>Alt</Kbd> + <Kbd>7</Kbd> en <Kbd>Alt</Kbd> + <Kbd>8</Kbd>.
          </p>
        </Section>

        <Section title="Hoofdletters en leestekens">
          <p className="m-0">
            Ook het Nederlands heeft <strong>hoofdletters</strong> nodig - aan het
            begin van een zin en bij namen (Daan, Utrecht, Antwerpen). Tastenflow
            schrijft ze <strong>altijd goed</strong>; je ziet dus nooit een fout
            geschreven woord.
          </p>
          <p className="m-0">
            <strong>In het begin heel makkelijk:</strong> typ gewoon de{" "}
            <strong>kleine</strong> letter - de <strong>hoofdletter</strong>{" "}
            verschijnt vanzelf. <Kbd>Shift</Kbd> hoef je daarvoor nog{" "}
            <strong>niet</strong> te kunnen.
          </p>
          <p className="m-0">
            <strong>Al snel</strong>, na de eerste letters, leer je{" "}
            <Kbd>Shift</Kbd> "echt": je houdt de toets vast met de{" "}
            <strong>ene</strong> hand en typt de letter met de{" "}
            <strong>andere</strong> - zoals op elk toetsenbord. Zo typ je
            hoofdletters al snel <strong>zelf</strong>, en niet alleen met de
            automatische hulp.
          </p>
          <div className="rounded-lg border border-hairline bg-surface-raised p-3">
            <p className="m-0">
              <strong>Belangrijk - altijd de Shift-toets van de ANDERE hand:</strong>{" "}
              er zijn twee Shift-toetsen, links en rechts. Typ de letter met de ene
              hand en houd <Kbd>Shift</Kbd> vast met de <strong>andere</strong> hand.
              Zo hoeft één hand nooit twee toetsen tegelijk in te drukken.
            </p>
            <p className="m-0 mt-2">
              Voorbeeld: hoofdletter <strong>A</strong> (linkerhand) →{" "}
              <strong>rechter</strong> <Kbd>Shift</Kbd>. Hoofdletter{" "}
              <strong>K</strong> (rechterhand) → <strong>linker</strong>{" "}
              <Kbd>Shift</Kbd>.
            </p>
            <p className="m-0 mt-2">
              Tastenflow neemt <strong>alleen de goede</strong> Shift-toets aan. Neem
              je de <strong>verkeerde</strong> Shift-toets of <Kbd>Caps Lock</Kbd>,
              dan komt er een <strong>kleine</strong> letter - dat telt als een{" "}
              <strong>fout</strong>, zodat je de goede hand meteen vanaf het begin
              oefent.
            </p>
          </div>
          {detail >= 2 && (
            <p className="m-0 text-sm text-ink-muted">
              Tip: druk <strong>twee keer kort</strong> op <Kbd>Shift</Kbd> - dan hoor
              je met welke vinger je de toets vasthoudt.
            </p>
          )}
          <p className="m-0">
            <strong>Punt, komma en vraagteken</strong> verschijnen pas als je ze
            hebt geleerd. Daarvoor lees je de zin gewoon <strong>zonder</strong> -
            dat is zo bedoeld en geen fout.
          </p>
        </Section>

        <Section title="In welke volgorde komen de letters?">
          <p className="m-0">
            Nieuwe toetsen komen altijd in dezelfde volgorde erbij: eerst de{" "}
            <strong>basisrij</strong>, dan de andere letters - de letters die het
            vaakst voorkomen eerst. Welke toets als volgende komt, zie je altijd
            rechts in de statusbalk onder het typveld:{" "}
            <strong>"Volgende toets"</strong>.
          </p>
          <div className="flex flex-wrap gap-1" aria-hidden="true">
            {letters.map((ch) => (
              <Kbd key={ch}>{unitGlyph(ch)}</Kbd>
            ))}
          </div>
          <p className="m-0 text-sm text-ink-muted">
            Al <strong>na de eerste letters</strong> komen de{" "}
            <strong>hoofdletters</strong> (de toets Shift) erbij en meteen daarna{" "}
            <strong>punt en komma</strong> - een zin begint met een hoofdletter en
            eindigt met een punt. Dan de andere letters. Als laatste komen de andere{" "}
            <strong>leestekens</strong> (- ? ! : ;), de <strong>cijfers</strong> en de{" "}
            <strong>speciale tekens</strong>.
          </p>
          <span className="sr-only">
            Volgorde: eerste letters, dan de hoofdletters met Shift, dan punt en
            komma, dan de andere letters, daarna de andere leestekens, de cijfers en
            de speciale tekens. Volgorde van de letters:{" "}
            {letters.map((c) => unitGlyph(c)).join(", ")}.
          </span>
        </Section>

        {detail >= 2 && (
          <Section title={'Zo werkt "Mijn training"'}>
            <p className="m-0">
              <strong>Het past zich aan jou aan.</strong> Het programma onthoudt welke
              toetsen nog onzeker zijn, en oefent precies die. Een nieuwe toets komt
              er pas bij als de andere zeker zijn. De letters die het{" "}
              <strong>vaakst</strong> voorkomen, komen eerst - zo typ je al na een
              paar toetsen <strong>echte woorden en zinnen</strong>, en de eerste{" "}
              <strong>verhalen</strong> gaan al vroeg open.
            </p>
          </Section>
        )}

        <Section title="De statusbalk onder het typveld">
          <p className="m-0">
            Onder het typveld staat een smalle balk met vier dingen: jouw{" "}
            <strong>{ringWort}</strong>, de <strong>tijd</strong> die je vandaag hebt
            geoefend, het <strong>weekdoel</strong> en de{" "}
            <strong>volgende toets</strong>. Bij het weekdoel laat de ring zien
            hoeveel <strong>minuten</strong> je deze week al hebt geoefend -
            bijvoorbeeld "25 van 60 min"; een <strong>vinkje</strong> betekent: de
            week is gehaald. De volgende toets gaat <strong>vanzelf</strong> open,
            zodra de vorige zeker zijn - gewoon verder oefenen.
          </p>
          <p className="m-0">
            De balk staat er <strong>altijd</strong> - ook terwijl je typt. Zo springt
            er niets, en zie je altijd hoe lang je al hebt geoefend.
          </p>
          <p className="m-0">
            <Kbd>Alt</Kbd> + <Kbd>D</Kbd> zegt de oefentijd en het weekdoel. Welke
            toetsen al zeker zijn, welke nog niet en welke als volgende komt, staat in{" "}
            <strong>"Mijn voortgang"</strong> bij{" "}
            <strong>"Stand van de toetsen"</strong> (<Kbd>Alt</Kbd> + <Kbd>S</Kbd>,
            met een account).
          </p>
        </Section>

        <Section title={'De bibliotheek: "Verhalen en weetjes" 📖'}>
          <p className="m-0">
            Naast "Mijn training" is er nog een route: <strong>Verhalen</strong> - in
            Instellingen ⚙ bij <strong>"Wat oefen je?"</strong>. Daar wachten hele
            verhalen en weetjesreeksen - geen losse zinnen, maar{" "}
            <strong>één verhaal over veel rondes</strong>. Elk deel heeft twaalf
            regels; de volgende keer lees je verder, precies op de plek waar je bent
            gestopt.
          </p>
          <p className="m-0">
            Er verschijnt alleen wat je met de toetsen die je al kent echt kunt
            typen - daarom zie je in het begin nog sloten. Die gaan vanzelf open
            zodra er genoeg toetsen zeker zijn. Elke regel komt{" "}
            <strong>maar één keer</strong>: wat je hebt getypt, komt niet terug als
            herhaling.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              <strong>De rode draad:</strong> wat je in een weetjesreeks hebt gelezen,
              komt later in de training nog eens terug - als{" "}
              <strong>vraag in andere woorden</strong>, dan als kleine verdieping en
              tot slot als passende grap. Zo blijft wat je hebt geleerd hangen, zonder
              dat het voelt als overhoren.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0 text-sm text-ink-muted">
              Onder de lijst staat "Bronnen en dank": daar zie je waar de teksten
              vandaan komen. Sommige zijn zelf geschreven, andere komen uit vrij te
              gebruiken bronnen - die worden daar met naam genoemd, zoals het hoort.
            </p>
          )}
        </Section>

        <Section title="Waar komen de teksten vandaan? 🤖">
          <p className="m-0">
            De eigen teksten in dit programma, dus oefenzinnen, grappen en verhalen,
            heeft Johannes <strong>met hulp van kunstmatige intelligentie (AI)
            geschreven</strong> en daarna zelf gelezen en gecontroleerd. Teksten uit
            andere bronnen (bijvoorbeeld Wikipedia) staan met naamsvermelding bij
            "Bronnen en dank".
          </p>
          <p className="m-0">
            {hoehleMitWesen ? (
              <>
                Ook de zingende vis en het mompelende monster in de Poolexpeditie
                zijn <strong>computerstemmen</strong>, geen echte mensen.
              </>
            ) : (
              <>
                Ook de zingende vis in de Poolexpeditie is een{" "}
                <strong>computerstem</strong>, geen echt mens.
              </>
            )}{" "}
            Het voorlezen (🗣) gebruikt de voorleesstem van je apparaat.
          </p>
        </Section>

        <Section title={`De ${UITDAGING}`}>
          <p className="m-0">
            Soms start je leerkracht een <strong>{UITDAGING}</strong> - voor de hele
            klas. <strong>Iedereen krijgt dezelfde tekst</strong>, en iedereen heeft
            even lang de tijd.
          </p>
          <p className="m-0">
            <strong>De tijd loopt pas vanaf jouw eerste toetsaanslag</strong> - niet
            al als je leerkracht de {UITDAGING} start. Vanaf de start heb je{" "}
            <strong>{einstiegsMinuten}</strong> de tijd om te beginnen.
          </p>
          <p className="m-0">
            <strong>Hoe je haar herkent:</strong> boven het typveld staat het woord{" "}
            <strong>{UITDAGING}</strong>, daarnaast de tijd, en om het hele vlak ligt
            een andere, <strong>gestreepte rand</strong>. Zodra de tijd om is, zijn
            die allebei weer weg.
          </p>
          <p className="m-0">
            <strong>Hoeveel tijd er nog is, zonder te kijken:</strong>{" "}
            <Kbd>Alt</Kbd> + <Kbd>X</Kbd> zegt het je. Uit zichzelf meldt de klok
            zich maar een paar keer, verder blijft hij stil.
          </p>
          <p className="m-0">
            <strong>De brailleleesregel blijft rustig.</strong> De tijd tikt{" "}
            <strong>niet</strong> op de regel: hij loopt bovenaan mee, maar schuift
            nooit in wat je net leest.
          </p>
          <p className="m-0">
            <strong>Soms is de {UITDAGING} "Vrij typen".</strong> Dan blijft een fout
            bij het typen gewoon staan - er wordt niets gemarkeerd, geen geluid meldt
            hem. <Kbd>Backspace</Kbd> verbetert alleen in de regel waarin je bezig
            bent; een afgemaakte regel blijft zoals hij is. Aan het eind van de regel
            druk je na het laatste woord op de spatiebalk - of, als de klas "Regel
            afsluiten met Enter" heeft ingesteld, op <Kbd>Enter</Kbd>. Wat aan het
            eind nog fout staat, zie je pas in het overzicht daarna, als lijst om na
            te lezen.
          </p>
          <p className="m-0">
            <strong>Eerder stoppen:</strong> <Kbd>Esc</Kbd> vraagt het na.{" "}
            <strong>"Verder typen"</strong> (ook <Kbd>Esc</Kbd>) brengt je terug in
            de regel, <strong>"Inleveren"</strong> levert in - wat je tot dan toe hebt
            getypt, telt. Hetzelfde doet de knop <strong>"Klaar - inleveren"</strong>{" "}
            onder het veld, zonder vraag.
          </p>
          <p className="m-0">
            <strong>Als de tijd om is,</strong> staat meteen jouw overzicht er:
            aanslagen per minuut, nauwkeurigheid, tekens, fouten, regels en de toetsen
            die nog onzeker waren. Elke {UITDAGING} blijft daarna in{" "}
            <strong>"Mijn voortgang"</strong> bij <strong>{UITDAGINGEN}</strong> staan -
            daar kun je haar altijd opnieuw nalezen.
          </p>
        </Section>

        <Section title="De klassenwedstrijd ⚔️">
          <p className="m-0">
            In de klassenwedstrijd typ je <strong>vijf minuten om het hardst</strong> -
            met de anderen uit je klas. De wedstrijd bestaat alleen in een klas, en
            alleen als je leerkracht hem heeft toegestaan.
          </p>
          <p className="m-0">
            <strong>Een wedstrijd uitschrijven:</strong> <Kbd>Alt</Kbd> + <Kbd>M</Kbd>,
            of de knop <strong>⚔️ Klassenwedstrijd</strong> in de balk boven het
            typveld - vlak naast <strong>🐧 Spelen</strong>. Bij alle anderen gaat dan
            een venster open: <strong>"Ik doe mee!"</strong> of{" "}
            <strong>"Niet nu"</strong>. Met <Kbd>Esc</Kbd> ga je terug naar het
            oefenen, en dezelfde uitnodiging komt niet vanzelf terug.
          </p>
          <p className="m-0">
            <strong>Nodigt iemand al uit,</strong> dan haalt <Kbd>Alt</Kbd> +{" "}
            <Kbd>M</Kbd> die uitnodiging weer tevoorschijn - een tweede wedstrijd kan
            pas als de eerste al loopt. Nodigen twee mensen bijna tegelijk uit, dan
            geldt de uitnodiging die er het eerst was.
          </p>
          <p className="m-0">
            <strong>Als het even niet kan:</strong> zit je zelf al in een wedstrijd,
            dan heet de knop <strong>"⚔️ Klassenwedstrijd is bezig"</strong> - en{" "}
            <Kbd>Alt</Kbd> + <Kbd>M</Kbd> zegt je hetzelfde. Andere wedstrijden in de
            klas storen daarbij niet: er mogen er zoveel tegelijk lopen als je wilt.
          </p>
          <p className="m-0">
            <strong>Iedereen typt met de eigen toetsen.</strong> Wie al cijfers heeft
            geleerd, krijgt cijfers; wie bij de basisrij is, krijgt de basisrij. Een
            verkeerde toets kost iets - een verkeerde toets weegt als vijf tekens.
          </p>
          <p className="m-0">
            <strong>Hoe het ervoor staat, zonder te kijken:</strong> helemaal links in
            de typregel staan altijd acht cellen: <strong>P2</strong> is de plaats,
            daarnaast de tijd die nog over is. <Kbd>Alt</Kbd> + <Kbd>X</Kbd> zegt je
            plaats, tijd en de eerste drie. Uit zichzelf meldt zich niets - de
            brailleleesregel blijft rustig.
          </p>
          <p className="m-0">
            <strong>Eerder stoppen:</strong> <Kbd>Esc</Kbd> of de knop{" "}
            <strong>"Verlaten"</strong> vraagt het na. <strong>"Verder typen"</strong>{" "}
            (ook <Kbd>Esc</Kbd>) brengt je terug in de regel.{" "}
            <strong>"Verlaten"</strong> stopt de wedstrijd alleen voor jou - de
            anderen typen verder en zien wat je tot dan toe hebt getypt.
          </p>
          <p className="m-0">
            <strong>De wedstrijd telt als oefentijd</strong>, en hij kan een nieuwe
            toets vrijspelen - net als een gewone oefenronde.{" "}
            <strong>Er wordt geen plaats opgeslagen.</strong> Aan het eind staat de
            lijst er: Beker, Zilver en Brons voor de eerste drie, alle anderen met hun
            getal. Daarna ga je met <strong>"Verder oefenen"</strong> of{" "}
            <Kbd>Esc</Kbd> terug.
          </p>
        </Section>

        <Section title="Belangrijke toetsen">
          <p className="m-0 text-sm text-ink-muted">
            <AltOderWahl>
              Op een Mac is <Kbd>Alt</Kbd> de toets <Kbd>⌥</Kbd> (Option).
            </AltOderWahl>
          </p>
          <ul className="m-0 list-none space-y-2 p-0">
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Esc</Kbd>
              </span>
              <span>
                <strong>De belangrijkste toets:</strong> hij sluit elk venster, en de
                cursor staat daarna <strong>altijd in het typveld</strong>. Ook als
                er niets open is, haalt <Kbd>Esc</Kbd> hem daarheen terug. De enige
                uitzondering is "Toetsen verkennen": daar is <Kbd>Esc</Kbd> zelf een
                toets om te verkennen, en pas de tweede keer drukken stapt eruit.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Shift</Kbd> <Kbd>Shift</Kbd>
              </span>
              <span>Twee keer kort drukken: je hoort de goede vinger.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>E</Kbd>
              </span>
              <span>Naar het typveld springen.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>U</Kbd>
              </span>
              <span>Naar het oefenen gaan.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>S</Kbd>
              </span>
              <span>
                Opent Mijn voortgang (leerkrachten: Mijn klassen). Daarvoor moet je
                ingelogd zijn. Nog een keer drukken brengt je terug naar het typveld.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>Z</Kbd>
              </span>
              <span>Zeggen welke regel nu aan de beurt is.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>D</Kbd>
              </span>
              <span>
                De oefentijd geven - op de brailleleesregel en (met Voorlezen) als
                melding.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>L</Kbd>
              </span>
              <span>Zeggen op welk {ringWort} je nu bent.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>3</Kbd>
              </span>
              <span>
                <strong>Toetsen verkennen:</strong> elke toets die je indrukt, wordt
                uitgesproken en groot getoond - eerst de afkorting, dan de naam, dan
                wat hij doet (bijvoorbeeld "Tab - tabtoets - springt van onderdeel
                naar onderdeel"). Dat geldt ook voor alle speciale toetsen en
                leestekens, voor tekens via Alt Gr (op een Mac: Option) met de weg
                ernaartoe, en voor toetscombinaties zoals Ctrl + C - met wat ze doen.
                De sneltoetsen van Tastenflow zelf (<AltText>Alt + H, Alt + V ...</AltText>) blijven werken. Het
                schermtoetsenbord laat zien welke toets is ingedrukt. Staat Voorlezen
                uit, dan blijft de stem stil. Op de brailleleesregel blijft de uitleg
                staan tot de volgende toets komt, en je kunt hem met de
                bladertoetsen helemaal lezen; op het scherm staat hij in een venster.
                Er wordt niets getypt, er gaat niets verloren.{" "}
                <strong>Eruit:</strong> nog een keer <Kbd>Alt</Kbd> + <Kbd>3</Kbd>,
                twee keer <Kbd>Esc</Kbd> - of gewoon de pagina opnieuw laden.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>4</Kbd>
              </span>
              <span>
                <strong>Toetsen zoeken:</strong> er wordt een toets genoemd, en jij
                zoekt hem. Bij de eerste treffer hoor je "Gevonden! Druk op een andere
                toets, dan nog eens ..." - pas de tweede keer drukken telt, en pas na
                een andere toets ertussen. Dan komt de volgende toets. Een andere
                toets wordt alleen genoemd. In het venster wisselt <Kbd>Alt</Kbd> +{" "}
                <Kbd>4</Kbd> tussen verkennen en zoeken. <strong>Eruit:</strong> net
                als bij het verkennen.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>K</Kbd>
              </span>
              <span>
                <strong>Kleuren en contrast:</strong> zeven kleurenthema's - licht,
                donker, zwart op geel, geel op blauw en meer. Elk thema laat zich in
                de lijst al in zijn eigen kleuren zien, dus je ziet vooraf hoe het
                eruitziet.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>T</Kbd>
              </span>
              <span>De lijst met sneltoetsen openen of sluiten.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>N</Kbd>
              </span>
              <span>Berichten van de leerkracht openen of sluiten.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>+</Kbd> / <Kbd>-</Kbd>
              </span>
              <span>Het typveld groter of kleiner maken.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>V</Kbd>
              </span>
              <span>Voorlezen aan- of uitzetten.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>H</Kbd>
              </span>
              <span>Deze help openen of sluiten.</span>
            </li>
            <WeitereTasten />
          </ul>
        </Section>

        {detail >= 3 && (
          <Section title="Hoe het programma je helpt">
            <p className="m-0">
              Het programma meet elke letter apart - hoe nauwkeurig en hoe snel. Het
              oefent vanzelf de zwakste en speelt een nieuwe letter pas vrij als de
              vorige zeker zijn. Zo ontstaat er voor jou een eigen leerroute.
            </p>
            <p className="m-0">
              Het moeilijkheidsniveau (1-50) zorgt ervoor dat het altijd{" "}
              <strong>uitdagend, maar haalbaar</strong> blijft: gaat het goed, dan
              stijgt het; wordt het te moeilijk, dan daalt het weer. In{" "}
              <strong>"Mijn voortgang"</strong> zie je alles over je voortgang - en
              hoe je beter wordt.
            </p>
          </Section>
        )}

        <Section title="Oefenen zonder klas - een eigen account 🙋">
          <p className="m-0">
            Wie bij geen klas hoort, maakt zelf een account aan: bij de ronde knop{" "}
            <strong>Account</strong> het vinkje{" "}
            <strong>"Ik oefen zelfstandig, zonder klas"</strong> zetten. Daarvoor is
            een e-mailadres nodig: daar komt elke maandag het weekverslag, maar alleen
            in weken waarin echt is geoefend. Wie een heel jaar geen van de vier
            programma's opent, krijgt eerst een waarschuwing per e-mail; logt daarna
            drie weken lang niemand in, dan wordt het account met alle voortgang
            verwijderd.
          </p>
        </Section>

        <PlakatAbschnitt />
      </div>
    </div>
  );
}

/** De poster om op te hangen, in het Nederlands (`handbuchInSprache`). */
function PlakatAbschnitt() {
  const plakat = handbuchInSprache(tastenflowPlakat(), "nl");
  return (
    <Section title="Een poster om op te hangen">
      <p className="m-0">
        Wil je Tastenflow op je school of in je instelling laten zien? Hier vind je
        een <strong>poster om af te drukken en op te hangen</strong>: A3 staand, in
        één oogopslag wat Tastenflow kan, met een QR-code naar tastenflow.org.
      </p>
      <p className="m-0">
        <a
          href={downloadAdresse(plakat)}
          download={plakat.speicherName}
          type="application/pdf"
          className="text-accent underline underline-offset-2"
        >
          {/* ★ O-NL: Grösse mit Dezimalkomma (Glossar Regel 5) - `groesse(…, "nl")`
              schreibt bis O5 noch den englischen Punkt („1.2 MB" läse sich als 12);
              die deutsche Form ist Zeichen für Zeichen die niederländische. */}
          Poster downloaden (pdf, A3, {groesse(plakat.bytes, "de")})
        </a>
      </p>
    </Section>
  );
}
