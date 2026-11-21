/**
 * ★★★ O-HILFE-SV (25.10.2026): DAS HILFE-FENSTER FÜR DIE LERNENDEN, SCHWEDISCH.
 * ===========================================================================
 * Aufbau wie `TippenHilfe.cs.tsx` (dieselben Abschnitte, `detail`-Stufen,
 * `isAdult`/`jugend`-Fälle), der Inhalt nach der deutschen Grundfassung
 * `TippenHilfeDeutsch` - wo cs und de abweichen, gilt de (so die strenge
 * Umschalt-Gegenhand-Regel seit 17.10.2026: die falsche Umschalttaste und die
 * Feststelltaste zählen NICHT; cs beschreibt noch den alten Stand). Wie die
 * anderen Übersetzungen ohne den Einführungs-Podcast (die schwedische
 * Bedienung hat keinen).
 *
 * ── ANREDE UND GESCHLECHT (Glossar `recherche-schwedisch-2026-10-25/GLOSSAR-sv.md`) ──
 * Immer **du** (Regel 1) - Kinder, Jugendliche UND Selbstlernende. Keine
 * Pronomen han/hon/hen in allgemeinen Sätzen (Regel 3): Rolle („läraren"),
 * Mehrzahl oder Sätze über die Sache. Knopf- und Menünamen OHNE
 * Anführungszeichen, hervorgehoben (Regel 8); Tastennamen übersetzt und
 * ungebeugt (Regel 12, §2.9: Skift, Retur, Backsteg, Mellanslag, Tabb,
 * Alt Gr). Ausrufezeichen höchstens eines je Absatz, nur wo Kinder lesen.
 *
 * ── WAS SCHWEDISCH ANDERS IST ─────────────────────────────────────────────
 *  · Die Tastatur: EINE für Schweden und Finnland (`layouts.ts` `sv`, nur
 *    gelesen; Windows „Swedish" = „Finnish", Taste für Taste). å rechts von p,
 *    ö und ä rechts von l - eigene Buchstaben, keine „a mit Zeichen"
 *    (Glossar §4 Falle 1). é über die Totaste ´ rechts neben +.
 *    Mac ist ungemessen (G3b) - die Hilfe sagt darüber nichts Eigenes.
 *  · Die Reihenfolge des Weges „sv" entsteht parallel (F4): die Hilfe zeigt
 *    die Buchstaben des Weges (`layoutLetterOrder`) und nennt nur die
 *    Grobfolge.
 *  · Das Plakat gibt es seit 06.11.2026 auf Schwedisch (`handbuchInSprache`).
 *  · Die Zeile unter dem Übungsfeld heisst „statusraden" (nicht „rad" allein -
 *    das ist die Übungszeile, §4 Falle 2), das Feld „skrivfältet".
 *  · Die Punkte am Ring heissen auf allen Stufen „XP" (Glossar §2.4/§2.12):
 *    „poäng" ist auf Schwedisch schon der Score.
 *
 * Fliesstext mit geraden Anführungszeichen (Glossar Regel 8), nur Bindestrich, keine Maus-Wörter.
 */
import { JawsRueckweg } from "./ScreenreaderHinweis";
import { useRef } from "react";
import { EINSTIEGSFENSTER_MIN, layoutLetterOrder, skinForStufe, unitGlyph, unitKind } from "@/lib/typing";
import { useFocusTrap } from "./useFocusTrap";
import { Zeichenerklaerung } from "@/lib/arbeitsblatt/Zeichenerklaerung";
import { AltText, Kbd, Section, detailFor, type TippenHilfeProps } from "./TippenHilfeTeile";
import { AltOderWahl, WeitereTasten } from "./TippenHilfeTasten";
import { RundgangNochmalKnopf } from "./Rundgang";
import { hoehleHatWesen } from "@/lib/typing/expedition/texts";
import { downloadAdresse, groesse, handbuchInSprache, tastenflowPlakat } from "@/lib/lernwerkstatt/handbuecher";

// ★ O-HILFE-SV (25.10.2026): das Wort der Tippchallenge (Glossar §2.3, „Utmaningen",
// immer gross) - wie `VYZVA` in der tschechischen Hilfe. Steht hier, solange
// `schreibprobe.ts` kein eigenes sv-Wort hat.
const UTMANINGEN = "Utmaningen";
const UTMANINGAR = "Utmaningar";

/** Die Namen der Lerneinheiten für die Bildschirmleser-Zeile (Glossar §2.8). */
function einheitSv(unit: string): string {
  switch (unitKind(unit)) {
    case "shift":
      return "stora bokstäver";
    case "ziffer":
      return `siffran ${unit}`;
    case "satzzeichen": {
      const namen: Record<string, string> = {
        ".": "punkt", ",": "komma", "-": "bindestreck", "?": "frågetecken",
        "!": "utropstecken", ":": "kolon", ";": "semikolon",
      };
      return namen[unit] ?? unit;
    }
    default:
      return unit;
  }
}

export function TippenHilfeSchwedisch({ open, onClose, stufe, lernweg = "sv" }: TippenHilfeProps) {
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
  // Dasselbe Wort wie der Ring (Glossar §2.2: „spelnivå" / „nivå").
  const ringWort = kind ? "spelnivå" : "nivå";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Hjälp för Tastenflow"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        className="card my-8 w-full max-w-2xl space-y-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="m-0 text-xl font-semibold text-ink">Hjälp - så fungerar Tastenflow</h2>
          <button
            ref={closeRef}
            type="button"
            className="btn-secondary btn-toggle"
            onClick={onClose}
            aria-label="Stäng hjälpen"
          >
            ✕ Stäng
          </button>
        </div>

        <RundgangNochmalKnopf onStart={onClose} />

        <Section title="Börja skriva direkt">
          <p className="m-0">
            Du behöver inte välja skrivfältet först. Börja bara skriva - den första
            bokstaven hamnar direkt i fältet. Om du är någon annanstans på sidan kommer
            du direkt tillbaka till skrivfältet med <Kbd>Alt</Kbd> + <Kbd>E</Kbd>.
          </p>
          <JawsRueckweg weg="sv" />
          {detail === 1 && (
            <p className="m-0">
              Skriv alltid med rätt finger - tangentbordet längst ned visar vilken
              tangent som är på tur. Tryck två gånger snabbt på <Kbd>Skift</Kbd>, så
              får du höra vilket finger du ska använda.
            </p>
          )}
        </Section>

        <Section title="De här tecknen finns i texten">
          <Zeichenerklaerung
            titel={null}
            zeichen={[
              { zeichen: "·", bedeutung: "skiljer två uppgifter som hör ihop - ungefär som ett komma." },
              { zeichen: "→", bedeutung: "sedan, eller: det blir så här." },
              { zeichen: "⏱", bedeutung: "tiden du har övat." },
              {
                zeichen: "↵",
                bedeutung:
                  "står i slutet av raden när din klass har ställt in det - då avslutar du raden med Retur.",
              },
            ]}
          />
        </Section>

        <Section title="Samla stjärnor 🌟">
          <p className="m-0">
            Efter varje omgång får du <strong>1 till 3 stjärnor</strong> - och ett eget
            ljud till det.{" "}
            <strong>Få fel betyder mycket mer än hastighet:</strong> den som skriver lugnt
            och noga får säkra stjärnor - den som stressar och ofta slår fel får det inte.
            {kind ? " Alla barn kan få stjärnor!" : ""}
          </p>
          {detail >= 2 && (
            <p className="m-0">
              3 stjärnor får du för en riktigt bra omgång - noga skriven och i bra fart,
              men <strong>noga</strong> är alltid viktigare än <strong>snabbt</strong>.
              Om du klarar bra omgångar en tid kan du gå upp en{" "}
              <strong>svårighetsnivå</strong> - då låter belöningen lite annorlunda.
            </p>
          )}
        </Section>

        <Section title="Samla märken 🏅">
          <p className="m-0">
            För särskilda framgångar får du <strong>märken</strong> - till exempel för en
            omgång helt utan fel eller för tre rena omgångar i rad. När du får ett nytt
            märke hörs ett eget <strong>"ta-da"</strong> och märkets namn läses upp.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Alla märken finns i <strong>Mina framsteg</strong>, direkt efter veckomålen
              och dina värden - där står också alltid ditt <strong>nästa mål</strong>{" "}
              (till exempel: 2 omgångar till utan fel, sedan kommer nästa märke). De
              flesta märken får du för att <strong>skriva noga</strong> och för att{" "}
              <strong>hålla i</strong> - inte för att skriva fort. Och några är{" "}
              <strong>hemliga</strong>: villkoret står ingenstans, de dyker bara upp.
            </p>
          )}
          {detail >= 2 && (
            <p className="m-0">
              Där står också dina <strong>poäng</strong>: de sammanfattar träffsäkerhet och
              hastighet i ett tal från 0 till 100. Ett felslag räknas som 5 tecken, och
              dubbel hastighet räknas bara 1,4 gånger - noggrannhet vinner över fart.
            </p>
          )}
          {detail >= 2 && (
            <p className="m-0">
              Längre ned visar Utveckling över tid (en rad som du kan fälla ut) en liten
              kurva. Det är normalt att kurvan inte bara går uppåt. När nya tangenter
              kommer till går den oftast ned först - särskilt vid Skift och siffrorna.
            </p>
          )}
          <p className="m-0">
            Tips: välj ett märke i Mina framsteg och tryck på <Kbd>Retur</Kbd> - märket
            visas <strong>stort</strong>, med glans och konfetti.
          </p>
        </Section>

        {skin === "jugend" && (
          <Section title="Efter en ny tangent">
            <p className="m-0">
              En <strong>ny tangent</strong> är din så snart de tidigare sitter säkert -
              du behöver inte vinna något för den. Den firas kort, och sedan fortsätter
              övningen. Mer händer inte.
            </p>
            <p className="m-0">
              Om du vill kan ett kort spel komma efteråt: <strong>Isflaken</strong>. Det
              bestämmer du själv - i <strong>Inställningar</strong> (<AltText>Alt + O</AltText>) under{" "}
              <strong>Belöningsspel</strong>. Förinställt är <strong>Inget</strong>.
              Inställningen gäller för den här enheten.
            </p>
          </Section>
        )}

        {!isAdult && (
          <Section title="Isflaken 🐧">
            {skin === "jugend" ? (
              <>
                <p className="m-0">
                  Du kan <strong>starta spelet när du vill</strong> - med knappen{" "}
                  <strong>🐧 Spela</strong> på statusraden under skrivfältet. Pingvinen
                  hoppar över isflak, klättrar upp för bokstavsberget och åker kana på
                  magen ned - alltid med de tangenter som är svårast för dig just nu.
                  På vägen hoppar <strong>bonusfiskar</strong> fram (tangenten i tid =
                  fångad fisk, en fisk som slipper undan är aldrig ett fel), och i{" "}
                  <strong>Ekogrottan</strong> läses varje tangent bara upp. Spelet räknas{" "}
                  <strong>inte</strong> som övningstid och är inget villkor för nya
                  tecken - men det har egna märken.
                </p>
                <p className="m-0">
                  Efter en ny tangent startar det av sig självt <strong>bara</strong> om
                  du har valt det som <strong>Belöningsspel</strong> i Inställningar.
                  Annars avbryter ingenting dig - du bestämmer när du spelar.
                </p>
              </>
            ) : (
              <>
                <p className="m-0">
                  När du har klarat en <strong>ny tangent</strong> väntar Isflaken som
                  fest: hjälp pingvinen över vattnet - tryck alltid på tangenten som står
                  på nästa isflak! Ibland går det sedan till och med upp för{" "}
                  <strong>bokstavsberget</strong> och på magen ned igen. Den nya
                  tangenten är din redan innan - spelet är en belöning, inget måste.
                </p>
                <p className="m-0">
                  Du kan också <strong>starta spelet när du vill</strong> - med knappen{" "}
                  <strong>🐧 Spela</strong> högst upp på ditt övningskort, bredvid
                  ringen. Det är det stora <strong>äventyret</strong>: det ser lite
                  annorlunda ut varje dag, på vägen hoppar <strong>bonusfiskar</strong>{" "}
                  fram (tryck snabbt på deras tangent, så är de dina), och i{" "}
                  <strong>Ekogrottan</strong> ser du inga bokstäver -{" "}
                  {hoehleMitWesen ? (
                    <>
                      grottan <strong>säger</strong> varje tangent till dig.
                    </>
                  ) : (
                    <>
                      varje tangent hörs som en ton, och skärmläsaren eller
                      punktskriftsdisplayen <strong>säger</strong> vilken det är.
                    </>
                  )}{" "}
                  Spelet är bara för skojs skull och räknas <strong>inte</strong> som
                  övningstid - men det ger egna märken.
                </p>
                {detail >= 2 && (
                  <p className="m-0">
                    Ingen fara: om ett isflak sjunker eller du halkar på berget simmar
                    pingvinen bara tillbaka - du kan försöka igen direkt, så många gånger
                    du vill. Och den som klarar hela äventyret utan ett enda plask får se{" "}
                    <strong>norrskenet</strong> dansa över igloon!
                  </p>
                )}
              </>
            )}
          </Section>
        )}

        <Section title="Vad betyder ringen med siffran?">
          <p className="m-0">
            Siffran i ringen är din <strong>{ringWort}</strong>.{" "}
            <strong>XP är poäng för att öva:</strong> för varje omgång får du några, och
            ringen fylls. När den är full (100 XP) går du upp en {ringWort}. Det är bara
            för att samla och gör övningen <strong>inte</strong> svårare - som poäng i
            ett spel.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Blanda inte ihop det med <strong>svårighetsnivån (1-50)</strong>: den säger
              hur snabbt du ska skriva och ställer in sig{" "}
              <strong>av sig själv</strong> efter dig - den stiger när det går bra och
              blir lättare när det är svårt.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0">
              Och inställningen <strong>Texter för</strong> (ålder) bestämmer bara hur
              svåra orden och meningarna är - så att de passar åldern. I en klass ställer
              läraren in den för alla; utan klass hittar du den högst upp i Inställningar
              ⚙. Alltså tre olika saker: <em>{ringWort}</em> = XP,{" "}
              <em>svårighetsnivå</em> = förväntad hastighet, <em>Texter för</em> = ålder.
            </p>
          )}
        </Section>

        <Section title={detail === 1 ? "Hur ofta ska du öva?" : "Övningstid och veckomål"}>
          {detail === 1 ? (
            <p className="m-0">
              Öva hellre <strong>ofta och lite</strong> än en gång väldigt länge - till
              exempel några minuter flera dagar. På statusraden under skrivfältet räknar
              en klocka hur länge du har skrivit i dag; samma tid fyller också{" "}
              <strong>ringen</strong> där - ditt veckomål.
            </p>
          ) : (
            <p className="m-0">
              Med ett konto kan du ha ett <strong>veckomål</strong>: ett visst antal{" "}
              <strong>minuter per vecka</strong>. I en klass ställer din lärare in det;
              utan klass kan du själv ställa in det i Inställningar ⚙ under Mitt veckomål
              - ett nytt mål gäller från nästa måndag. Veckan börjar{" "}
              <strong>på måndag klockan 08:00</strong> och slutar måndagen efter. På
              statusraden under skrivfältet ser du ditt läge som en{" "}
              <strong>ring</strong>, till exempel 25/60 min - när veckan är klar är ringen
              full och har en bock. Ibland finns det också minuter från en tidigare vecka
              att <strong>ta igen</strong>; då står det bredvid hur många. När veckomålet
              är uppnått kommer ett kort fönster med ett grattis - sedan kan du öva vidare
              när du vill.
            </p>
          )}
        </Section>

        <Section title="Inställningar: kugghjulet ⚙ högst upp">
          <p className="m-0">
            Alla inställningar finns bakom knappen <strong>⚙ Inställningar</strong> allra
            högst upp, direkt till vänster om den runda symbolen med din första bokstav:{" "}
            <strong>Vad övar du?</strong>, <strong>Texter</strong> (ålder och språk),{" "}
            <strong>Tangentbord</strong>, <strong>Ljud</strong> och{" "}
            <strong>Uppläsning</strong>. Tryck en gång så öppnas de, en gång till så
            stängs de - eller använd <Kbd>Alt</Kbd> + <Kbd>O</Kbd>, det går även mitt i
            skrivandet. När de öppnas hoppar markören direkt dit, när de stängs tillbaka
            till skrivfältet.
          </p>
          <p className="m-0">
            Allra högst upp i Inställningar står <strong>Vad övar du?</strong>: de tre
            vägarna <strong>Min träning</strong>, <strong>Berättelser</strong> och{" "}
            <strong>Ordlekar</strong>. Med <Kbd>Alt</Kbd> + <Kbd>B</Kbd> byter du i tur
            och ordning, och den nya vägen läses upp.
          </p>
          <p className="m-0">
            Den runda knappen med jordgloben högst upp byter språk i Tastenflow -
            knappar, menyer och direkt även övningstexterna. Språket i texterna kan du
            sedan ändra för sig under <strong>Texter</strong>, om inte din lärare har
            låst det.
          </p>
          <p className="m-0">
            Under <strong>Tangentbord</strong> väljer du det tangentbord som faktiskt
            ligger framför dig. I Sverige och Finland är det oftast det{" "}
            <strong>svenska tangentbordet</strong> - det svenska och det finska
            tangentbordet ser likadana ut, tangent för tangent. Då stämmer
            skärmtangentbordet och fingertipsen - och det kommer bara tecken som finns
            på det här tangentbordet. Det viktigaste om det svenska tangentbordet:
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>å</strong>, <strong>ä</strong> och <strong>ö</strong> är egna
              bokstäver med egna tangenter: å till höger om P, ö och ä till höger om L
              (ö är grundradens tangent för höger lillfinger). Med <Kbd>Skift</Kbd> blir
              de stora: Å, Ä, Ö.
            </li>
            <li>
              <strong>a</strong> och <strong>å</strong>, <strong>a</strong> och{" "}
              <strong>ä</strong>, <strong>o</strong> och <strong>ö</strong> är olika
              bokstäver - därför väntar programmet på exakt den bokstav som står i
              texten.
            </li>
            <li>
              <strong>é</strong> skrivs med en död tangent: tangenten <Kbd>´</Kbd> till
              höger om <Kbd>+</Kbd>. Tryck på den - på skärmen syns ingenting än - och
              sedan på e. Då blir det é. Att trycka på den döda tangenten är aldrig ett
              fel.
            </li>
            <li>
              Tecken som @ $ € {"{"} [ ] {"}"} skriver du med <Kbd>Alt Gr</Kbd> (höger
              Alt): @ är Alt Gr + 2, € är Alt Gr + E.
            </li>
          </ul>
          <p className="m-0">
            Där finns också <strong>Skriva med en hand</strong> - för alla som skriver
            med en hand: då gäller stora bokstäver och specialtecken med vilken
            Skift-tangent som helst. I en klass ställer din lärare in det.
          </p>
          <p className="m-0">
            Med <strong>Större avstånd mellan tecknen (CVI)</strong> blir allt utom
            fältet där du just skriver mörkare medan du skriver (övningsraden eller
            spelplanen); efter 5 sekunder utan att du skriver blir det ljust igen.
            Övningsraden glider då vidare i din skrivtakt i stället för att hoppa.
            Avståndet mellan tecknen kan du själv ställa in när som helst i Inställningar
            ⚙ - i en klass kan även din lärare ställa in det; det som valdes senast
            gäller.
          </p>
          <p className="m-0">
            Med <strong>Riktad övning</strong> kan du välja högst 8 tangenter eller tecken som förekommer extra ofta i omgångarna - i inställningarna under <strong>Vad övar du?</strong> eller med <Kbd>Alt</Kbd> + <Kbd>2</Kbd>. I en klass ställer din lärare in det.
          </p>
        </Section>

        <Section title="Uppläsning - appen läser upp">
          <p className="m-0">
            Med <strong>🗣 Uppläsning</strong> (eller <Kbd>Alt</Kbd> + <Kbd>V</Kbd>) läser
            appen upp - för alla som (ännu) inte använder någon skärmläsare. Högst upp i
            Inställningar ⚙ väljer du om <strong>tangenter</strong> (Tangent för
            tangent), <strong>ord</strong> och <strong>meningar</strong> ska läsas upp -
            en sak, flera eller alla - och hur snabbt.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Under <strong>Röst</strong> kan du välja en annan röst. När språket är{" "}
              <strong>svenska</strong> letar appen själv efter en svensk röst; om ingen
              är installerad kommer en kort anvisning om hur du lägger till en.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0">
              Oroa dig inte för hastigheten: <strong>tiden för uppläsningen räknas
              bort</strong> - att vänta på meddelandet gör inte din hastighet lägre.
            </p>
          )}
        </Section>

        <Section title="Melodi när du skriver 🎵">
          <p className="m-0">
            <strong>Melodin när du skriver</strong> finns till för att öva en <strong>jämn skrivrytm</strong> - och den ska vara <strong>rolig</strong>. Varje rätt tangent spelar nästa ton i en låt; den som håller takten får till och med ett band till det.
          </p>
          <p className="m-0">
            Den som skriver jämnt blir också säkrare på de svagare tangenterna: rytmen bär en förbi ställena där man annars tvekar.
          </p>
          <p className="m-0">
            Du slår på den med <Kbd>Alt</Kbd> + <Kbd>6</Kbd>, i Inställningar ⚙ eller i menyn under den runda högtalarknappen högst upp - där kan du också ställa in volymen för alla ljud med reglage. Ljudet byter du med <Kbd>Alt</Kbd> + <Kbd>7</Kbd> och <Kbd>Alt</Kbd> + <Kbd>8</Kbd>.
          </p>
        </Section>

        <Section title="Stora bokstäver och skiljetecken">
          <p className="m-0">
            Svenska behöver <strong>stora bokstäver</strong> - i början av en mening och
            i namn (Anna, Umeå, Vänern). Tastenflow skriver dem{" "}
            <strong>alltid rätt</strong>, så du ser aldrig ett felstavat ord.
          </p>
          <p className="m-0">
            <strong>I början är det enkelt:</strong> skriv bara den{" "}
            <strong>lilla</strong> bokstaven - den <strong>stora</strong> kommer av sig
            själv. <Kbd>Skift</Kbd> behöver du <strong>inte</strong> kunna än.
          </p>
          <p className="m-0">
            <strong>Snart</strong>, efter de första bokstäverna, lär du dig{" "}
            <Kbd>Skift</Kbd> "på riktigt": du håller den med <strong>ena</strong> handen
            och skriver bokstaven med den <strong>andra</strong> - precis som på alla
            tangentbord. Då kan du snart skriva stora bokstäver <strong>själv</strong>,
            inte bara med den automatiska hjälpen.
          </p>
          <div className="rounded-lg border border-hairline bg-surface-raised p-3">
            <p className="m-0">
              <strong>Viktigt - alltid Skift med ANDRA handen:</strong> det finns två
              Skift-tangenter, till vänster och till höger. Skriv bokstaven med ena
              handen och håll <Kbd>Skift</Kbd> med den <strong>andra</strong> handen. Då
              behöver en hand aldrig trycka på båda tangenterna.
            </p>
            <p className="m-0 mt-2">
              Exempel: stort <strong>A</strong> (vänster hand) → <strong>höger</strong>{" "}
              <Kbd>Skift</Kbd>. Stort <strong>K</strong> (höger hand) →{" "}
              <strong>vänster</strong> <Kbd>Skift</Kbd>.
            </p>
            <p className="m-0 mt-2">
              Tastenflow tar <strong>bara emot rätt</strong> Skift-tangent. Om du
              använder <strong>fel</strong> Skift-tangent eller <Kbd>Caps Lock</Kbd>{" "}
              räknas bokstaven inte - det blir ett <strong>felslag</strong>, så att du
              övar rätt hand från början.
            </p>
          </div>
          {detail >= 2 && (
            <p className="m-0 text-sm text-ink-muted">
              Tips: tryck <strong>två gånger snabbt</strong> på <Kbd>Skift</Kbd> - då
              läses det upp vilket finger du ska hålla den med.
            </p>
          )}
          <p className="m-0">
            <strong>Punkt, komma och frågetecken</strong> kommer först när du har lärt
            dig dem. Innan dess läser du meningen helt enkelt <strong>utan dem</strong>{" "}
            - det är meningen så och inget fel.
          </p>
        </Section>

        <Section title="I vilken ordning kommer bokstäverna?">
          <p className="m-0">
            Nya tangenter kommer alltid i samma ordning: först{" "}
            <strong>grundraden</strong>, sedan de andra bokstäverna - de vanligaste
            först. Vilken tangent som kommer härnäst ser du alltid till höger på
            statusraden under skrivfältet: <strong>Nästa tangent</strong>.
          </p>
          <div className="flex flex-wrap gap-1" aria-hidden="true">
            {letters.map((ch) => (
              <Kbd key={ch}>{unitGlyph(ch)}</Kbd>
            ))}
          </div>
          <p className="m-0 text-sm text-ink-muted">
            Redan <strong>efter de första bokstäverna</strong> kommer{" "}
            <strong>stora bokstäver</strong> (Skift) och strax efter{" "}
            <strong>punkt och komma</strong> - en mening börjar med stor bokstav och
            slutar med punkt. Sedan kommer de andra bokstäverna; å, ä och ö kommer som
            alla andra bokstäver, efter hur vanliga de är. <strong>é</strong> med den
            döda tangenten kommer senare. Sist kommer de andra{" "}
            <strong>skiljetecknen</strong> (- ? ! : ;), <strong>siffrorna</strong> och{" "}
            <strong>specialtecknen</strong>.
          </p>
          <span className="sr-only">
            Ordning: de första bokstäverna, sedan stora bokstäver (Skift), sedan punkt
            och komma, sedan de andra bokstäverna, efter det de andra skiljetecknen,
            siffrorna och specialtecknen. Bokstävernas ordning:{" "}
            {letters.map((c) => einheitSv(c)).join(", ")}.
          </span>
        </Section>

        {detail >= 2 && (
          <Section title="Så fungerar Min träning">
            <p className="m-0">
              <strong>Den anpassar sig efter dig.</strong> Programmet kommer ihåg vilka
              tangenter som fortfarande är osäkra och övar just dem. En ny tangent
              kommer först när de andra sitter säkert. De{" "}
              <strong>vanligaste</strong> bokstäverna kommer först - så skriver du redan
              efter några få tangenter <strong>riktiga ord och meningar</strong>, och de
              första <strong>berättelserna</strong> öppnas tidigt.
            </p>
          </Section>
        )}

        <Section title="Statusraden under skrivfältet">
          <p className="m-0">
            Under skrivfältet finns en smal rad med fyra saker: din{" "}
            <strong>{ringWort}</strong>, dagens övnings<strong>tid</strong>,{" "}
            <strong>veckomålet</strong> och <strong>nästa tangent</strong>. Vid
            veckomålet visar ringen hur många <strong>minuter</strong> du redan har övat
            den här veckan - till exempel 25/60 min; en <strong>bock</strong> betyder:
            veckan är klar. Nästa tangent öppnas <strong>av sig själv</strong> så snart
            de tidigare sitter säkert - öva bara vidare.
          </p>
          <p className="m-0">
            Statusraden syns <strong>alltid</strong> - även medan du skriver. Så hoppar
            ingenting, och du ser hela tiden hur länge du har övat.
          </p>
          <p className="m-0">
            <Kbd>Alt</Kbd> + <Kbd>D</Kbd> läser upp övningstid och veckomål. Vilka
            tangenter som redan sitter, vilka som inte sitter än och vilken som kommer
            härnäst står i <strong>Mina framsteg</strong> under{" "}
            <strong>Läget för tangenterna</strong> (<Kbd>Alt</Kbd> + <Kbd>S</Kbd>, med
            konto).
          </p>
        </Section>

        <Section title="Biblioteket: Berättelser och fakta 📖">
          <p className="m-0">
            Förutom Min träning finns det en väg till: <strong>Berättelser</strong> - i
            Inställningar ⚙ under <strong>Vad övar du?</strong>. Där väntar hela
            berättelser och faktatexter i flera delar - inte enstaka meningar, utan{" "}
            <strong>en berättelse över många omgångar</strong>. Varje del är tolv rader;
            nästa gång läser du vidare precis där du slutade.
          </p>
          <p className="m-0">
            Det visas bara det som du verkligen kan skriva med de tangenter du redan har
            lärt dig - därför syns det lås i början. De öppnas av sig själva så snart
            tillräckligt många tangenter sitter. Varje rad kommer <strong>bara en
            gång</strong>: det du har skrivit kommer inte tillbaka som repetition.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              <strong>Den röda tråden:</strong> det du har läst i en faktatext kommer
              tillbaka senare i träningen - som en <strong>fråga med andra ord</strong>,
              sedan som en liten fördjupning och sist som ett skämt som passar. Så sitter
              det du har lärt dig kvar, utan att det känns som förhör.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0 text-sm text-ink-muted">
              Under listan står Källor och tack: där ser du var texterna kommer ifrån.
              En del är skrivna för programmet, andra kommer från fritt tillgängliga
              källor - de nämns där med namn, som sig bör.
            </p>
          )}
        </Section>

        <Section title="Var kommer texterna ifrån? 🤖">
          <p className="m-0">
            Programmets egna texter, alltså övningsmeningar, skämt och berättelser, har
            Johannes skrivit <strong>med hjälp av artificiell intelligens (AI)</strong>{" "}
            och sedan själv läst och granskat. Texter från andra källor (till exempel
            Wikipedia) står med namn under Källor och tack.
          </p>
          <p className="m-0">
            {hoehleMitWesen ? (
              <>
                Även den sjungande fisken och det mumlande grottmonstret i
                Polarexpeditionen är <strong>datorröster</strong>, inga riktiga
                människor.
              </>
            ) : (
              <>
                Även den sjungande fisken i Polarexpeditionen är en{" "}
                <strong>datorröst</strong>, ingen riktig människa.
              </>
            )}{" "}
            Uppläsningen (🗣) använder rösten i din enhet.
          </p>
        </Section>

        <Section title={UTMANINGEN}>
          <p className="m-0">
            Ibland startar din lärare <strong>{UTMANINGEN}</strong> - för hela klassen.{" "}
            <strong>Alla får samma text</strong>, och alla har lika lång tid.
          </p>
          <p className="m-0">
            <strong>Tiden börjar först när du trycker på din första tangent</strong> -
            inte redan när läraren startar. Från starten har du{" "}
            <strong>{EINSTIEGSFENSTER_MIN} minuter</strong> på dig att börja.
          </p>
          <p className="m-0">
            <strong>Så känner du igen den:</strong> ovanför skrivfältet står ordet{" "}
            <strong>{UTMANINGEN}</strong>, bredvid tiden, och runt hela ytan finns en
            annan, <strong>streckad ram</strong>. Så snart tiden är ute försvinner båda.
          </p>
          <p className="m-0">
            <strong>Hur mycket tid som är kvar, utan att titta:</strong>{" "}
            <Kbd>Alt</Kbd> + <Kbd>X</Kbd> säger det till dig. Av sig själv hörs klockan
            bara några gånger, annars är den tyst.
          </p>
          <p className="m-0">
            <strong>Punktskriftsdisplayen förblir lugn.</strong> Tiden tickar{" "}
            <strong>inte</strong> på displayen: den går högst upp, men den tränger sig
            aldrig in i det du läser just nu.
          </p>
          <p className="m-0">
            <strong>Ibland är {UTMANINGEN} Fri skrivning.</strong> Då står ett fel helt
            enkelt kvar - ingenting markeras, inget ljud säger till. <Kbd>Backsteg</Kbd>{" "}
            rättar bara på den aktuella raden; en färdig rad stannar som den är. I slutet
            av raden trycker du på <Kbd>Mellanslag</Kbd> efter det sista ordet - eller,
            om klassen har ställt in Radslut med Retur, på <Kbd>Retur</Kbd>. Det som
            fortfarande är fel i slutet visas först i sammanställningen efteråt, som en
            lista att läsa.
          </p>
          <p className="m-0">
            <strong>Sluta tidigare:</strong> <Kbd>Esc</Kbd> frågar först.{" "}
            <strong>Skriv vidare</strong> (även <Kbd>Esc</Kbd>) tar dig tillbaka till
            raden, <strong>Lämna in</strong> lämnar in - det som du har skrivit fram
            till dess räknas. Samma sak gör knappen <strong>Klar - lämna in</strong>{" "}
            under fältet, utan att fråga.
          </p>
          <p className="m-0">
            <strong>När tiden är ute</strong> ser du direkt din sammanställning: anslag
            per minut, träffsäkerhet, tecken, fel, rader och de tangenter som var
            osäkra. Varje Utmaning finns sedan kvar i <strong>Mina framsteg</strong>{" "}
            under <strong>{UTMANINGAR}</strong> - där kan du läsa den igen när du vill.
          </p>
        </Section>

        <Section title="Klasstävlingen ⚔️">
          <p className="m-0">
            I Klasstävlingen skriver du <strong>i fem minuter i kapp</strong> med de
            andra barnen i din klass. Klasstävlingen finns bara i en klass, och bara om
            din lärare har tillåtit den.
          </p>
          <p className="m-0">
            <strong>Bjuda in:</strong> <Kbd>Alt</Kbd> + <Kbd>M</Kbd>, eller knappen{" "}
            <strong>⚔️ Klasstävlingen</strong> på raden ovanför skrivfältet - bredvid{" "}
            <strong>🐧 Spela</strong>. Hos alla andra öppnas då ett fönster:{" "}
            <strong>Jag är med!</strong> eller <strong>Inte nu</strong>. Med{" "}
            <Kbd>Esc</Kbd> kommer du tillbaka till övningen, och samma inbjudan kommer
            inte tillbaka av sig själv.
          </p>
          <p className="m-0">
            <strong>Om någon redan bjuder in</strong> tar <Kbd>Alt</Kbd> + <Kbd>M</Kbd>{" "}
            fram den inbjudan igen - en andra tävling går först när den första redan är
            igång. Om två bjuder in nästan samtidigt gäller den inbjudan som kom först.
          </p>
          <p className="m-0">
            <strong>När det inte går just nu:</strong> om du redan är med i en tävling
            heter knappen <strong>⚔️ Klasstävlingen pågår</strong> - och{" "}
            <Kbd>Alt</Kbd> + <Kbd>M</Kbd> säger samma sak. Andra tävlingar i klassen stör
            inte: hur många som helst får pågå samtidigt.
          </p>
          <p className="m-0">
            <strong>Alla skriver på sin egen nivå.</strong> Den som redan har lärt sig
            siffror får siffror; den som är vid grundraden får grundraden. Felslag
            kostar - ett felslag väger lika mycket som fem tecken.
          </p>
          <p className="m-0">
            <strong>Hur det står till, utan att titta:</strong> längst till vänster på
            skrivraden finns alltid åtta celler: <strong>P2</strong> är placeringen,
            bredvid den tiden som är kvar. <Kbd>Alt</Kbd> + <Kbd>X</Kbd> säger
            placeringen, tiden och de tre första. Av sig själv hörs ingenting -
            punktskriftsdisplayen förblir lugn.
          </p>
          <p className="m-0">
            <strong>Sluta tidigare:</strong> <Kbd>Esc</Kbd> eller knappen{" "}
            <strong>Lämna</strong> frågar först. <strong>Skriv vidare</strong> (även{" "}
            <Kbd>Esc</Kbd>) tar dig tillbaka till raden. <strong>Lämna</strong> avslutar
            tävlingen bara för dig - de andra skriver vidare och ser det du har skrivit.
          </p>
          <p className="m-0">
            <strong>Tävlingen räknas som övningstid</strong>, och den kan låsa upp en ny
            tangent - precis som en vanlig omgång. <strong>Ingen placering
            sparas.</strong> I slutet visas listan: Pokal, Silver och Brons för de tre
            första, alla andra med sin siffra. Sedan kommer du tillbaka med{" "}
            <strong>Öva vidare</strong> eller <Kbd>Esc</Kbd>.
          </p>
        </Section>

        <Section title="Viktiga tangenter">
          <p className="m-0 text-sm text-ink-muted">
            <AltOderWahl>
              På Mac motsvaras <Kbd>Alt</Kbd> av tangenten <Kbd>⌥</Kbd> (Alternativ).
            </AltOderWahl>
          </p>
          <ul className="m-0 list-none space-y-2 p-0">
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Esc</Kbd>
              </span>
              <span>
                <strong>Den viktigaste tangenten:</strong> den stänger alla fönster, och
                markören står sedan <strong>alltid i skrivfältet</strong>. Även när
                ingenting är öppet tar <Kbd>Esc</Kbd> den dit. Enda undantaget är
                Utforska tangenterna: där är <Kbd>Esc</Kbd> själv en tangent att
                utforska, och först det andra trycket tar dig ut.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Skift</Kbd> <Kbd>Skift</Kbd>
              </span>
              <span>Två gånger snabbt: rätt finger läses upp.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>E</Kbd>
              </span>
              <span>Hoppa till skrivfältet.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>U</Kbd>
              </span>
              <span>Gå till övningen.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>S</Kbd>
              </span>
              <span>
                Öppnar Mina framsteg (lärare: Mina klasser). Då måste du vara inloggad.
                Tryck en gång till så kommer du tillbaka till skrivfältet.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>Z</Kbd>
              </span>
              <span>Läser upp vilken rad som är på tur.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>D</Kbd>
              </span>
              <span>
                Visar övningstiden - på punktskriftsdisplayen och (med uppläsning) som
                meddelande.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>L</Kbd>
              </span>
              <span>Läser upp vilken {ringWort} du är på just nu.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>3</Kbd>
              </span>
              <span>
                <strong>Utforska tangenterna:</strong> varje tangent du trycker på läses
                upp och visas stort - först förkortningen, sedan namnet, sedan vad den
                gör (till exempel "Tabb - tabbtangenten - hoppar från element till
                element"). Det gäller också alla specialtangenter och skiljetecken,
                tecken med Alt Gr (på Mac: Alternativ) med vägen dit, och kortkommandon
                som Ctrl + C - med det de gör. Tastenflows egna kortkommandon (<AltText>Alt + H, Alt + V ...</AltText>) fungerar som vanligt. Skärmtangentbordet visar
                vilken tangent som trycktes. Om uppläsningen är avstängd är rösten tyst.
                På punktskriftsdisplayen står förklaringen kvar tills nästa tangent
                kommer och kan läsas helt med bläddringstangenterna; på skärmen står den
                i ett fönster. Ingenting skrivs, ingenting går förlorat.{" "}
                <strong>Ut:</strong> <Kbd>Alt</Kbd> + <Kbd>3</Kbd> en gång till, två
                gånger <Kbd>Esc</Kbd> - eller ladda bara om sidan.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>4</Kbd>
              </span>
              <span>
                <strong>Hitta tangenterna:</strong> en tangent nämns, och du letar efter
                den. Vid första träffen får du beröm och ombeds trycka på en annan tangent
                och sedan en gång till - först det andra trycket räknas, och bara efter en
                annan tangent emellan. Sedan kommer nästa tangent. En annan tangent nämns
                bara. I fönstret växlar <Kbd>Alt</Kbd> + <Kbd>4</Kbd> mellan att utforska
                och att hitta. <strong>Ut:</strong> som när du utforskar.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>K</Kbd>
              </span>
              <span>
                <strong>Färger och kontrast:</strong> sju färgteman - ljust, mörkt, svart
                på gult, gult på blått och fler. Vart och ett visas redan i listan i sina
                egna färger, så du ser i förväg hur det ser ut.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>T</Kbd>
              </span>
              <span>Öppnar eller stänger listan med kortkommandon.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>N</Kbd>
              </span>
              <span>Öppnar eller stänger meddelanden från läraren.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>+</Kbd> / <Kbd>-</Kbd>
              </span>
              <span>Gör skrivfältet större eller mindre.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>V</Kbd>
              </span>
              <span>Slår på eller stänger av uppläsningen.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>H</Kbd>
              </span>
              <span>Öppnar eller stänger den här hjälpen.</span>
            </li>
            <WeitereTasten />
          </ul>
        </Section>

        {detail >= 3 && (
          <Section title="Så stöttar programmet dig">
            <p className="m-0">
              Programmet mäter varje bokstav för sig - hur träffsäkert och hur snabbt du
              skriver den. Det övar automatiskt de svagaste och låser upp en ny bokstav
              först när de tidigare sitter säkert. Så får du en egen väg att lära dig.
            </p>
            <p className="m-0">
              Svårighetsnivån (1-50) ser till att det alltid är{" "}
              <strong>utmanande, men möjligt</strong>: när det går bra stiger den; när det
              blir för svårt sjunker den igen. I <strong>Mina framsteg</strong> ser du
              allt om dina framsteg - och hur du blir bättre.
            </p>
          </Section>
        )}

        <Section title="Öva utan klass - ett eget konto 🙋">
          <p className="m-0">
            Den som inte hör till någon klass skapar ett eget konto: tryck på den runda
            knappen <strong>Konto</strong> och kryssa i{" "}
            <strong>Jag övar på egen hand, utan klass</strong>. Då behövs en
            e-postadress: dit kommer veckorapporten på måndagar, men bara de veckor då
            det verkligen har övats. Om ingen öppnar något av de fyra programmen på ett
            helt år kommer en förvarning via e-post; om ingen loggar in under tre veckor
            efter det tas kontot bort med alla framsteg.
          </p>
        </Section>

        <PlakatAbschnitt />
      </div>
    </div>
  );
}

/** Affischen att sätta upp, på svenska (`handbuchInSprache`). */
function PlakatAbschnitt() {
  const plakat = handbuchInSprache(tastenflowPlakat(), "sv");
  return (
    <Section title="En affisch att sätta upp">
      <p className="m-0">
        Vill du visa Tastenflow på din skola eller i din verksamhet? Här finns en{" "}
        <strong>affisch att skriva ut och sätta upp</strong>: A3 på höjden, med det
        Tastenflow kan på ett ögonblick och en QR-kod till tastenflow.org.
      </p>
      <p className="m-0">
        <a
          href={downloadAdresse(plakat)}
          download={plakat.speicherName}
          type="application/pdf"
          className="text-accent underline underline-offset-2"
        >
          Ladda ned affischen (PDF, A3, {groesse(plakat.bytes, "sv")})
        </a>
      </p>
    </Section>
  );
}
