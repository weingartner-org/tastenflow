/**
 * ★★★ O-HILFE-SV (25.10.2026): DAS HILFE-FENSTER FÜR LEHRKRÄFTE, SCHWEDISCH.
 * ===========================================================================
 * In derselben Reihenfolge wie die deutsche, englische, französische,
 * spanische, italienische, polnische, türkische und tschechische Fassung
 * (1 bis 12, samt 4a, 4b, 8a, 8b) - wer eine Stelle prüft, findet sie in
 * allen neun. Inhalt nach der deutschen Grundfassung `LehrerHilfeDeutsch`;
 * Aufbau wie `LehrerHilfe.cs.tsx`. Sichtbar nur mit `spracheGewaehlt === "sv"`
 * (`LehrerHilfe.tsx`). Titel nach Glossar §2.5/§2.6: „Hjälp för lärare".
 *
 * ── ANREDE (Glossar `recherche-schwedisch-2026-10-25/GLOSSAR-sv.md`, Regel 1/2) ──
 * **du** auch für Lehrkräfte (Schweden hat die du-Kultur; Microsoft-Styleguide);
 * sachlich, nicht kumpelhaft, keine Ausrufezeichen, „vi" sparsam. Knöpfe im
 * Imperativ oder als Hauptwort, OHNE Anführungszeichen, hervorgehoben
 * (Regel 8). Keine Pronomen han/hon/hen (Regel 3): „eleven", „eleverna",
 * „barnet" oder Sätze über die Sache.
 *
 * ── WAS SCHWEDISCH ANDERS IST ───────────────────────────────────────────────
 *  · Zahlen mit Hauptwort über `mehrzahl(n, "sv", { one, other })`; das Verb
 *    ändert sich nicht (Glossar §2.11). Prozent mit geschütztem Leerzeichen
 *    („96 %", Regel 6). „tecken" und „fel" sind in Ein- und Mehrzahl gleich.
 *  · Die Tippchallenge heisst „Utmaningen" (gross, auch in der Mehrzahl
 *    „Utmaningar") - nie „prov/test" (Glossar §4 Falle 11).
 *  · Abschnitt 4: die Reihenfolge des Weges „sv" entsteht parallel (F4) - die
 *    Hilfe nennt nur, was feststeht: Grundreihe f j d k s l a ö, å ä ö sind
 *    gewöhnliche Buchstaben, é über die Totaste ´ ist eine späte Einheit
 *    (Bauplan sv S1-S3).
 *  · Abschnitt 4: „Ordens ursprung" (Wurzel-Vorlage, `vorlagenDaten/wurzelnSv.ts`,
 *    fünf Themen) statt der deutschen Fremdwörterkunde.
 *  · Abschnitt 8b: für den Weg „sv" gibt es noch keine eigenen Texte der
 *    Tippchallenge - er liest die englische Bank (`schreibproben/index.ts`,
 *    `BANK_JE_WEG`); die Hilfe sagt das ehrlich.
 *  · Abschnitt 12: eigenes Handbuch; das Plakat hat eine eigene Fassung in der Sprache (`tastenflowPlakat`).
 *  · Nachteilsausgleich: Schweden „extra anpassningar", Finnland „stöd för
 *    lärande" (Glossar §2.6) - statt des Verweises auf die deutsche Seite
 *    „Ausgleichende Maßnahmen".
 *
 * Fliesstext mit geraden Anführungszeichen nur in Zitaten, nur Bindestrich,
 * keine Maus-Wörter, Person zuerst („elever med synnedsättning", „elever som är blinda").
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

/** ★ O-HILFE-SV (25.10.2026): Prozent mit geschütztem Leerzeichen (Glossar Regel 6). */
const prozent = (p: number) => `${p} %`;

export function LehrerHilfeSchwedisch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  useFocusTrap(open, cardRef, { initialFocus: closeRef });
  if (!open) return null;

  // Zahl + Hauptwort mit one/other (Glossar §2.11).
  const einstieg = mehrzahl(EINSTIEGSFENSTER_MIN, "sv", {
    one: (z) => `${z} minut`,
    other: (z) => `${z} minuter`,
  });
  const tecken = (n: number) =>
    mehrzahl(n, "sv", {
      one: (z) => `${z} tecken`,
      other: (z) => `${z} tecken`,
    });
  const texter = mehrzahl(PROBEN_JE_NIVEAU, "sv", {
    one: (z) => `${z} text för Utmaningen`,
    other: (z) => `${z} texter för Utmaningen`,
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Hjälp för lärare i Tastenflow"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        className="card my-8 w-full max-w-3xl space-y-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="m-0 text-xl font-semibold text-ink">
            Hjälp för lärare: alla funktioner i Tastenflow
          </h2>
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
        <RundgangLehrkraftKnoepfe onStart={onClose} />

        <p className="m-0 text-ink-soft">
          Tastenflow har ett <strong>eget kontosystem</strong>, helt skilt från
          inloggningen till lärplattformen. Den som är inloggad här påverkar inte
          sessionen i lärplattformen - och tvärtom.
        </p>

        <Section title="1 · Skapa klasser och konton">
          <p className="m-0">
            Som lärare kommer du alltid till <strong>Mina klasser</strong> när du
            öppnar Tastenflow; till din egen övning leder <strong>Öva själv</strong>{" "}
            (<Kbd>Alt</Kbd> + <Kbd>U</Kbd>). Under <strong>Elever och
            inloggningar</strong> högst upp till höger skapar du en klass - i
            avsnittet <strong>Skapa en ny klass</strong>, som du kan fälla ut.{" "}
            <strong>Klasskoden</strong> är obligatorisk: medan du skriver namnet
            föreslår programmet en passande kod (av "4B Umeå" blir "4BUMEA"); du kan
            ändra den, till exempel till <code>4B-SKOLAN</code>. Koden gäller för hela
            klassen. I samma avsnitt väljer du <strong>årskurs</strong> och{" "}
            <strong>startpunkt</strong> och kontrollerar språket (med lås) och
            Klasstävlingen - samma fält som under Klassens inställningar.{" "}
            <strong>Skapa klass</strong> går först när allt är ifyllt; annars säger en
            mening vad som saknas, och fokus står i det första fältet som saknas.
          </p>
          <p className="m-0">
            Sedan lägger du till elever med <strong>namn och lösenord</strong>. De kan
            sedan logga in från <strong>vilken enhet som helst</strong> med{" "}
            <em>klasskod, namn och lösenord</em>. Enheten kommer ihåg klasskoden, så
            att eleverna bara behöver skriva namn och lösenord.
          </p>
          <p className="m-0">
            Klassens namn och klasskod kan du ändra senare med{" "}
            <strong>✏️ Redigera</strong> - en ny kod gäller då för alla elever i
            klassen (de loggar in med den nya koden från och med då).
          </p>
          <p className="m-0">
            <strong>Dessutom:</strong> den som inte hör till någon klass kan också{" "}
            <strong>skapa ett eget konto</strong> - i inloggningsfönstret med
            kryssrutan Jag övar på egen hand, utan klass och en e-postadress. För dig
            ändras ingenting: sådana konton hör inte till någon klass, syns inte i
            någon av dina listor och får sin veckorapport själva. För din klass är allt
            som förut - du lägger till eleverna.
          </p>
        </Section>

        <Section title="2 · Klassens inställningar och inställningar för varje elev">
          <p className="m-0">
            <strong>För hela klassen</strong> (knappen Klassens inställningar i
            uppgiftslistan ovanför tabellen, bredvid Utmaningen, Egna övningar,
            Veckomål och Pausa en timme - redan hopfälld visar knappen årskurs, språk
            och Klasstävlingen):
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Årskurs:</strong> utifrån den räknar appen ut textnivån -
              ordförråd, typ av skämt och tonen i övningstexterna. Årskurs 7 betyder
              ungefär 13 år, alltså texter för 11-15 år. <strong>Den växer
              med:</strong> appen kommer ihåg läsåret då klassen lades in och räknar
              upp en årskurs varje år, utan att du behöver ställa in något. För grupper
              med vuxna finns nivån <strong>Vuxna</strong> - den räknas inte upp. Ett
              födelseår frågas inte efter för elever i en klass.
            </li>
            <li>
              <strong>Språk och lås:</strong> svenska eller engelska för övningsorden
              och övningstexterna i hela klassen; med låset bredvid kan eleverna inte
              längre ändra det själva. Den runda språkknappen (med jordglob) högst upp
              har varje elev: den byter knappar och menyer och samtidigt
              övningstexterna - med lås bara knappar och menyer.
            </li>
            <li>
              <strong>Klassens startpunkt:</strong> svaret på Var vill du börja? för
              hela klassen - det gäller också för varje elev som kommer till senare, och
              lägger bara till: en elev som redan har kommit längre förlorar
              ingenting. När du väljer skriver appen samtidigt in nivån för eleverna som
              redan finns; om några redan har kommit längre frågar den först och
              erbjuder tre vägar: flytta alla, bara de som inte har kommit så långt än,
              eller avbryt. Det gäller så snart eleven öppnar Tastenflow nästa gång;
              statistik och märken finns kvar i vilket fall som helst.
            </li>
            <li>
              <strong>Tillåt Klasstävlingen:</strong> eleverna kan bjuda in varandra
              till en tävling på fem minuter. Under Övningstider i den utfällda raden
              ser du hur ofta en elev har varit med varje vecka - ingen placering,
              ingen tid.
            </li>
            <li>
              <strong>Radslut med Retur:</strong> när rutan är ikryssad avslutar varje
              elev i klassen varje övningsrad med Retur - som när man skriver på ett
              kontor. Det gäller för Min träning, Berättelser, Egna övningar, ordlekarna
              med rader, Utmaningen och Klasstävlingen; inte för gåtor,
              Bokstavssallad, Fingerdiktamen, Polarexpeditionen och Utforska
              tangenterna. Förinställt: av.
            </li>
          </ul>
          <p className="m-0">
            <strong>För varje elev</strong> (bakom pilen i elevens rad):
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Tangentbord:</strong> väljs i Inställningar (kugghjulet) under
              Tangentbord - i Sverige och Finland oftast det svenska tangentbordet; det
              svenska och det finska tangentbordet är likadana, tangent för tangent.
              Inställningen gäller för den här enheten (inte för kontot) och styr
              skärmtangentbordet, fingertipsen och vilka tecken som övas. På det
              svenska tangentbordet: (1) <strong>å, ä och ö är egna bokstäver med egna
              tangenter</strong> (å till höger om P, ö och ä till höger om L) - med
              Skift blir de stora; (2) ett a i stället för å eller ä är en annan
              tangent och ofta ett annat ord (får - far, är - ar), därför ersätts de
              aldrig; (3) é skrivs med den döda tangenten ´ till höger om +, sedan e;
              att trycka på den döda tangenten räknas inte som fel; (4) @ är Alt Gr +
              2, € är Alt Gr + E.
            </li>
            <li>
              <strong>Var vill du börja?</strong> samma lista med nivåer som klassens
              startpunkt (se ovan) - här för den enskilda elev som behöver ett
              undantag. Den som har övat mer hoppar så över grunderna och börjar längre
              fram (till exempel först vid siffrorna); innan eleven flyttas tillbaka
              frågar appen först.
            </li>
            <li>
              <strong>Skriva med en hand:</strong> tar för den här eleven bort regeln om
              Skift med andra handen - stora bokstäver och specialtecken gäller då med
              vilken Skift-tangent som helst.
            </li>
            <li>
              <strong>I lugn och ro:</strong> hastigheten bedöms inte någonstans för den
              här eleven - ingen tidsgräns i spelet, inget hastighetsmål för
              stjärnorna, ingen höjning eller sänkning av svårighetsnivån efter
              hastighet. För elever som skriver noggrant men mycket långsamt.
            </li>
            <li>
              <strong>Större avstånd mellan tecknen (CVI):</strong> större avstånd
              mellan varje tecken när eleven skriver av, i tre steg (dubbelt,
              tredubbelt, fyrdubbelt) - för barn med CVI (cerebral synnedsättning),
              för vilka tecken som står tätt flyter ihop. Eleven kan också ändra
              avståndet själv i sina inställningar (kugghjulet, <AltText>Alt + O</AltText>) - och du när som helst här igen. Det som valdes senast gäller.
            </li>
          </ul>
          <p className="m-0">
            Allt kan ändras när som helst - klassens värden i rutan Klassens
            inställningar ovanför tabellen, värdena för varje elev i elevens utfällda
            rad.
          </p>
        </Section>

        <Section title="3 · Svårighetsnivån (1-50): hjärtat i programmet">
          <LeistungsstufeHilfe />
          <p className="m-0">
            Den <strong>aktuella nivån</strong> står i tabellen (kolumnen{" "}
            <strong>Svårighetsnivå</strong>) och högst upp på övningsskärmen. Du behöver
            inte ställa in något - slå bara på I lugn och ro vid behov.
          </p>
        </Section>

        <Section title="4 · Min träning: anpassad, efter hur vanliga bokstäverna är">
          <p className="m-0">
            Tastenflow har <strong>en</strong> övningsväg som varje elev går i sin egen
            takt - och den <strong>anpassar sig</strong>: programmet mäter varje
            tangent för sig, övar automatiskt de svagaste och låser upp en ny först
            när de tidigare sitter säkert.
          </p>
          <div className="rounded-xl border border-accent bg-accent-soft p-3">
            <p className="m-0 font-semibold text-ink">Ordning efter hur vanliga bokstäverna är</p>
            <ul className="m-0 mt-1 list-disc space-y-1 pl-5">
              <li>
                Efter grundställningen kommer de <strong>vanligaste</strong>{" "}
                bokstäverna först - så blir det <strong>riktiga ord</strong> redan efter
                några få tangenter.
              </li>
              <li>
                <strong>Varje väg är olika</strong> - vilken tangent som kommer härnäst
                beror på eleven, inte på en fast lista.
              </li>
              <li>
                <strong>Inget fast slut</strong> - perfekt för daglig, självständig
                övning.
              </li>
            </ul>
          </div>
          <p className="m-0 rounded-xl border border-warning/40 bg-warning/10 p-3">
            <strong>Bra att veta för din planering:</strong> den svenska kursen har en{" "}
            <strong>egen ordning för tangenterna</strong>, för det svenska
            tangentbordet. Den börjar med grundraden f j d k s l a ö; sedan kommer de
            vanligaste bokstäverna i svenska texter. <strong>å, ä och ö</strong> hör
            till alfabetet från början och kommer efter hur vanliga de är - de är
            ingen sen extrarad. <strong>é</strong> med den döda tangenten ´ kommer
            senare som en egen del; ord med é förekommer inte innan dess.
          </p>
          <p className="m-0 rounded-xl border border-hairline bg-surface-raised p-3">
            <strong>Ordningen beror på språket vid den första övningen:</strong> vilken
            väg klassen går bestäms av visningsspråket vid den första övningen. En
            klass som till exempel började på tyska eller engelska behåller den
            ordningen även om visningsspråket ändras: ordningen bestäms en gång och
            ändras sedan inte.
          </p>
          <p className="m-0">
            <strong>Samma text för hela klassen:</strong> kursens texter (grundraden,
            bokstavsrader, skiljetecken, siffror, specialtecken, hela texter) finns som{" "}
            <strong>mallar</strong> under <strong>Egna övningar</strong> (Mina klasser)
            - välj en, så övar hela klassen samma text, oavsett var varje elev är just
            nu (precis som med en uppladdad fil räknas det som övningstid, och nya
            tangenter låses inte upp extra).
          </p>
          <p className="m-0">
            <strong>Ordens ursprung och programkod:</strong> för den svenska kursen
            finns gruppen <strong>Ordens ursprung</strong> bland mallarna: ord att
            skriva av, vart och ett med en kort beskrivning, i fem teman (grekiska och
            latinska rötter, ord från lågtyskan och tyskan, ord från franskan, ord från
            engelskan och fjärran länder, ord från Norden ut i världen och från finskan
            och samiskan); eleverna skriver bara av båda. För Utmaningen med egen fil
            finns samma ord en gång till, i andra filer och i bokstavsordning. Dessutom
            finns <strong>programkod</strong> att skriva av (tio programspråk, riktig
            källkod från öppna projekt, andra utdrag än i Utmaningen) - bara under Egna
            övningar.
          </p>
        </Section>

        <Section title="4a · Egna övningar: en text för hela klassen">
          <p className="m-0">
            Med knappen <strong>Egna övningar</strong> i uppgiftslistan i klassens
            statistik bestämmer du en text som hela klassen övar - oavsett var varje
            elev är just nu. Tre vägar till texten: <strong>ladda upp en fil</strong>{" "}
            (.txt eller .docx), välja en tidigare sparad text från{" "}
            <strong>Mina texter</strong>, eller ta en av kursens <strong>mallar</strong>{" "}
            (se punkt 4).
          </p>
          <p className="m-0">
            <strong>Mina texter</strong> är din egen, permanenta samling - den hör till
            ditt konto, inte till klassen, och bara du ser den. När du laddar upp
            sparar <strong>Spara i Mina texter</strong> (förinställt på) automatiskt en
            kopia där, så att du kan använda samma text igen senare utan att ladda upp
            filen på nytt.
          </p>
          <p className="m-0">
            Om filen innehåller tecken som inte går att skriva visar rutan dem som en
            lista innan du börjar - du bestämmer om du rättar filen eller börjar ändå
            (de övriga tecknen faller då bort från raderna, aldrig som ett
            obligatoriskt anslag).
          </p>
          <p className="m-0">
            <strong>Börja övningen:</strong> varje elev får direkt ett fönster som
            säger att det nu fortsätter med en övning från läraren - eleven kan bara
            trycka på <strong>Fortsätt</strong>, inte tacka nej. För varje elev slutar
            övningen av sig själv så snart texten har skrivits en gång; sedan övar
            eleven vidare som vanligt. <strong>Avsluta övningen</strong> avslutar den i
            förtid för hela klassen.
          </p>
          <p className="m-0">
            Övningen räknas som övningstid och mäts som varje annan omgång, även de
            osäkra tangenterna - men den <strong>låser inte upp någon ny
            tangent</strong>: vilka tangenter som kommer bestämmer bara filen.
          </p>
        </Section>

        <Section title={didaktikAbschnittTitel("sv")}>
          <DidaktikInhalt lang="sv" />
        </Section>

        <Section title="5 · Meningsfulla texter från början">
          <p className="m-0">
            Programmet visar <strong>så tidigt som möjligt</strong> riktiga texter som
            passar åldern - skämt, ordspråk, talesätt, faktatexter, tungvrickare,
            ordlekar och hela meningar. En text visas så snart dess{" "}
            <strong>bokstäver</strong> är inlärda; ren "ordsallad" är undantaget (bara
            för att öva en helt ny tangent).
          </p>
          <p className="m-0">
            <strong>Stora bokstäver:</strong> <strong>stavningen är alltid
            rätt</strong> (stor bokstav i början av meningen och i namn) - eleverna ser
            aldrig ett felstavat ord. I början räcker den <strong>lilla</strong>{" "}
            bokstaven för det; den stora kommer automatiskt (automatisk stor bokstav,
            för <strong>alla åldrar</strong>, eftersom rätt stavning räknas i alla
            åldrar).
          </p>
          <p className="m-0">
            I Min träning <strong>kommer den riktiga Skift-tangenten tidigt</strong> -
            redan efter de första vanliga bokstäverna, så snart det finns tillräckligt
            med riktiga ord att öva (inte först efter hela alfabetet). Från och med då
            skrivs stora bokstäver "på riktigt" med Skift. Så lär sig eleverna snart
            att skriva stora bokstäver <strong>själva</strong>, i stället för att länge
            bara använda den automatiska hjälpen.
          </p>
          <p className="m-0">
            <strong>Skiljetecken</strong> (punkt, komma, frågetecken ...) visas först
            när de är inlärda - innan dess står meningen där "utan punkt och komma".
            En tangent med en <em>bokstav</em> eller en <em>siffra</em> som inte är
            inlärd än krävs däremot <strong>aldrig</strong>.
          </p>
        </Section>

        <Section title="6 · Stjärnor, märken och ljud (viktigt för elever som är blinda)">
          <p className="m-0">
            Varje omgång ger <strong>1-3 stjärnor</strong> för träffsäkerhet och
            hastighet - <strong>träffsäkerheten räknas tre gånger</strong>: 3 stjärnor
            kräver alltid ungefär {prozent(96)} träffar (snabbt, slarvigt skrivande
            belönas inte); en omgång utan fel har däremot 2 stjärnor säkra även i den
            långsammaste takten. Varje antal stjärnor har ett{" "}
            <strong>eget ljud</strong>; när eleven <strong>går upp en nivå</strong> hörs
            ett särskilt glädjeljud. De här ljuden är den viktigaste återkopplingen för
            elever med synnedsättning. Med knappen <strong>🔇</strong> kan ljudet stängas
            av i en tyst klass.
          </p>
          <p className="m-0">
            Dessutom finns <strong>märken</strong> med barnvänliga namn - i familjer med
            steg och med ett "nästa mål" som alltid kan läsas upp. Namnen med djur ser
            bara barn i åldern 7-10 år; från texterna för 11-15 år står det överallt ett
            neutralt namn. Märkena är desamma - ett märke som eleven har tagit finns
            kvar, även när textnivån ändras. Nästan alla belönar{" "}
            <strong>noggrannhet och uthållighet</strong>; det enda märket för hastighet
            kräver {prozent(95)} träffsäkerhet. Ett nytt märke ger ett eget
            "ta-da"-ljud med meddelande och står sedan högst upp i statistiken (hos
            eleven och hos dig - samma vy). Varje märke kan <strong>väljas</strong> -
            då visas det stort och med effekt.
          </p>
          <p className="m-0">
            <strong>Isflaken 🐧</strong> är belöningen efter en ny tangent i Min
            träning: pingvinen tar sig över en bana av elevens{" "}
            <strong>osäkraste tecken</strong> (ibland isflak över vattnet, ibland också
            bokstavsberget med en åktur på magen).{" "}
            <strong>Tangenten är upplåst redan innan</strong> - framstegen hänger inte
            på något spel. Hur många försök som helst, inget "game over"; när kravet är
            "bara noggrannhet" (och på svårighetsnivå 1) finns det{" "}
            <strong>ingen tidspress</strong> (en tidsgräns som kan stängas av, enligt
            WCAG). Dessutom kan elever med texterna för <strong>7-10 och 11-15
            år</strong> när som helst starta spelet frivilligt med knappen{" "}
            <strong>Spela</strong> - som "dagens äventyr" med{" "}
            <strong>bonusfiskar</strong> (fiskljud och uppläsning av tecknet; en missad
            fisk är inget fel) och <strong>Ekogrottan</strong>, där varje tangent bara
            läses upp (där talar appen även när uppläsningen är avstängd - elever som
            är blinda och seende elever spelar exakt likadant; grottan kommer
            medvetet ALDRIG i belöningsomgången). En omgång utan fel slutar med
            norrsken; klarade äventyr, fiskar och omgångar utan fel ger märkesfamiljen{" "}
            <strong>Äventyr</strong>. Viktigt för din bedömning: spelet räknas{" "}
            <strong>inte som övningstid</strong> och inte in i veckomålet - det är ren
            motivation.
          </p>
          <p className="m-0">
            <strong>Två olika vägar in i spelet - blanda inte ihop dem:</strong>{" "}
            knappen <strong>Spela</strong> är den fria ingången som eleverna själva
            trycker på; den finns för <strong>7-10 och 11-15 år</strong>, inte från 16
            år. Omgången <strong>efter en ny tangent</strong> kommer däremot av sig
            själv: för 7-10 år alltid, från 16 år aldrig, och för 11-15 år bara om
            Isflaken är vald i Inställningar under <strong>Belöningsspel</strong> i
            stället för <strong>Inget</strong> (förinställt). Inställningen hör till{" "}
            <strong>enheten</strong>, inte till kontot - precis som
            tangentbordslayouten. På en dator i klassrummet gäller den alltså för alla
            som övar där.
          </p>
        </Section>

        <Section title="7 · Veckomål">
          <p className="m-0">
            För varje elev ställer du in <strong>minuter per vecka</strong> - utan
            lektioner. <strong>Använd för hela klassen</strong> skriver samma värde för
            alla elever i klassen på en gång och gäller också för elever som kommer
            till senare.
          </p>
          <p className="m-0">
            En ändring gäller alltid <strong>från nästa måndag klockan 08:00</strong> -
            den pågående veckan behåller sitt mål. Ett fönster nämner det exakta datumet
            innan du sparar.
          </p>
          <p className="m-0">
            <strong>Ta igen:</strong> om Ta igen minuter från tidigare veckor är
            ikryssad får missade minuter från tidigare veckor tas igen, alla på en gång.
          </p>
          <p className="m-0">
            <strong>Undanta veckan</strong> (till exempel vid sjukdom) och{" "}
            <strong>Nollställ minuter att ta igen</strong> fungerar som förut - för
            varje elev, utan att den övade tiden ändras.
          </p>
          <p className="m-0">
            <strong>Pausa målet i en timme:</strong> en egen knapp för hela klassen, i
            60 minuter. Eleverna övar ändå - övningstid och statistik räknas vidare,
            bara inte veckomålet under den timmen. Ett andra tryck på samma knapp
            (Återuppta målet) häver pausen i förtid.
          </p>
        </Section>

        <Section title="8 · Statistik och utveckling (kan fällas ut för varje elev)">
          <p className="m-0">
            Med den runda pilknappen<span aria-hidden="true"> ▸</span> framför namnet
            öppnar du sex rader som kan fällas ihop var för sig, uppifrån och ned:{" "}
            <strong>Inställningar</strong> (värdena från punkt 2, för den här eleven),{" "}
            <strong>Utmaningar</strong> (bara om minst en har skrivits),{" "}
            <strong>Övningstider</strong> (för varje vecka, med veckomålets läge och -
            om eleven har spelat - antalet klasstävlingar, dessutom årskartan för hela
            läsåret), <strong>Osäkra tangenter</strong>, <strong>Märken</strong> och -
            bara vid ett påfallande värde - <strong>Självständigt arbete</strong> (se
            punkt 9).
          </p>
          <p className="m-0">
            I Övningstider står högst upp hur många klasstävlingar eleven har varit med
            i (räknat i den här klassen; hur långt tillbaka räkningen går står i tipset
            vid räknaren); Retur på en vecka öppnar veckans enskilda övningstider - dag,
            klockslag från-till, ren skrivtid och vad som övades.
          </p>
          <p className="m-0">
            Det som inte längre står här för sig - värden i korthet, utveckling över
            tid, läget för tangenterna, Berättelser och fakta - går inte förlorat: allt
            står fullständigt i elevens <strong>Mina framsteg</strong>, och du ser där
            exakt samma vy som eleven själv.
          </p>
          <p className="m-0">
            <strong>Poäng:</strong> sammanfattar träffsäkerhet och hastighet i ett tal
            från 0 till 100; ett felslag räknas som 5 tecken, och dubbel hastighet
            räknas bara 1,4 gånger - noggrannhet går före hastighet.
          </p>
          <p className="m-0">
            <strong>I klassens tabell</strong> står tre kolumner tillsammans under
            rubriken <strong>Övning</strong>: Träffsäkerhet, anslag/min och Poäng. Alla
            tre kommer från övningen under den valda perioden, och poängen
            sammanfattar de två andra. De är därför lätt tonade och inramade med en tunn
            linje; en skärmläsare säger Övning före kolumnrubriken. Kolumnen{" "}
            <strong>Utmaningen</strong> längst till höger står medvetet utanför den här
            gruppen, under en egen rubrik: den är en Utmaning på en viss dag, ingen
            daglig övning.
          </p>
          <p className="m-0">
            I kolumnen <strong>Poäng</strong> gäller: den som har skrivit färre än 200
            tecken under den valda perioden får ingen poäng, utan ett streck - under
            den gränsen skulle ett enda felslag avgöra flera poäng.
          </p>
          <p className="m-0">
            <strong>Ladda ned som Excel-fil</strong> står ovanför tabellen till höger om
            Från början. Knappen laddar ned tabellen som filen{" "}
            <strong>klassnamn_datum.xlsx</strong> (till exempel "4B_2026-09-14.xlsx") -
            oavsett vilken period som är vald just nu. Först kommer en översikt med
            länkar till de fyra perioderna och en förklaring som beskriver varje kolumn
            och visar hur poängen räknas ut. Sedan följer fyra blad: det pågående
            läsåret, Från början, månaden (de senaste 4 veckorna) och den här veckan.
            Värdena står som tal i filen, så att du kan räkna vidare i Excel; där
            tabellen visar ett streck står det ett streck också i filen.
          </p>
          <p className="m-0">
            <strong>Klassöversikten</strong> ovanför tabellen visar klassen som helhet.
            Månad (de senaste 4 veckorna) är förvald, Läsår står bredvid. En rad nämner
            anslag per minut, träffsäkerhet och veckomål, var och en med en liten
            trend - för månaden jämfört med de 4 veckorna innan, för läsåret de första
            övningsveckorna jämfört med de senaste. Hela meningen till det visar
            tipset; en skärmläsare läser den vid talet, även med de elever som inte har
            övat under perioden.
          </p>
          <p className="m-0">
            <strong>Poängstapeln Poäng i klassen</strong> visar en punkt för varje elev.
            Med <Kbd>Tabb</Kbd> hoppar du till stapeln, med piltangenterna från elev
            till elev - varje stopp läses upp ("Mia, 78 poäng"). Hur många elever som
            ligger under 50, mellan 50 och 70, mellan 70 och 85 och över 85 poäng, och
            vem som har skrivit för lite, står i tipset vid rubriken.
          </p>
          <p className="m-0">
            <strong>Linjediagrammet Klassens poäng under läsåret</strong> visar för
            varje vecka genomsnittet för eleverna med minst 5 rader; en lucka betyder
            att veckan hade för lite övning. Med <Kbd>Tabb</Kbd> hoppar du till
            diagrammet, med piltangenterna från vecka till vecka; för skärmläsaren
            står alla veckor dessutom i en tabell. När Skift, siffror eller
            specialtecken kommer till sjunker linjen en kort tid - det är väntat och
            inget att oroa sig för.
          </p>
          <p className="m-0">
            <strong>Kurvan:</strong> det är normalt att kurvan inte bara stiger. När
            nya tangenter kommer till går den oftast ned först - särskilt vid Skift och
            siffrorna.
          </p>
          <p className="m-0">
            <strong>Öppenhet om data:</strong> varje elev ser i Mina framsteg exakt
            samma värden om sig själv - du ser aldrig mer än eleven själv.
          </p>
        </Section>

        <Section title="8a · Värdena som du kan bygga ett betyg på">
          <DreiWerteHilfe />
        </Section>

        <Section title="8b · Utmaningen: en uppgift för hela klassen">
          <p className="m-0">
            I lärardelen <strong>Mina klasser</strong> står knappen{" "}
            <strong>Utmaningen</strong> högst upp i <strong>klassens statistik</strong>{" "}
            för Tastenflow, i uppgiftslistan. Den öppnar formuläret som du startar
            Utmaningen för hela klassen med - <strong>alla elever får samma
            text</strong>, oavsett hur långt de har kommit i kursen.
          </p>
          <p className="m-0">
            <strong>Tre saker ställs in:</strong> <strong>tangenter som
            används</strong> (från Grundraden till Alla tangenter), bredvid{" "}
            <strong>sorten</strong> och <strong>tiden för Utmaningen</strong> i minuter.{" "}
            <strong>Börja nu</strong> startar den direkt.
          </p>
          <p className="m-0">
            <strong>Strikt</strong> (förinställt) fungerar som förut: en fel tangent
            flyttar inte vidare, varje felslag räknas - även ett som rättas direkt.{" "}
            <strong>Fri skrivning</strong> passar för en avskrift som ungdomar känner
            igen från skrivtest på tid: fel står kvar medan eleven skriver och markeras
            inte, Backsteg rättar bara på den aktuella raden. Bedömt blir först i slutet
            det som fortfarande är fel - högst ett fel per ord, det sista påbörjade
            ordet räknas inte, och rättade ställen räknas inte alls. Eftersom ett fel
            som står kvar inte har kostat någon egen tid väger det tyngre:{" "}
            {tecken(FEHLER_GEWICHT_FREI)} i stället för {tecken(FEHLER_GEWICHT)} (8a).
            Välj Fri skrivning när klassen ska öva avskrift utan att ett felslag hindrar
            det fortsatta skrivandet; Strikt när själva vägarna till tangenterna ska
            prövas.
          </p>
          <p className="m-0">
            <strong>Tre klockor som måste hållas isär:</strong>
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Starttiden</strong> - ögonblicket då du trycker på Börja nu. Från
              då får klassen börja.
            </li>
            <li>
              <strong>Tid för att gå med</strong>: {einstieg} från starttiden. Så länge
              kan en elev fortfarande gå med; den som kommer senare är för sent ute.
            </li>
            <li>
              <strong>Tiden för Utmaningen</strong> går <strong>för varje elev för
              sig</strong>, och först från elevens <strong>första tangenttryck</strong>.
              Två elever i samma klass slutar därför vid olika tider - det är meningen:
              den som först letar efter sin plats förlorar ingen tid i Utmaningen.
            </li>
          </ul>
          <p className="m-0">
            <strong>Texterna:</strong> för varje nivå finns <strong>{texter}</strong>,
            var och en med minst {tecken(MIND_ZEICHEN)} - så långa att texten aldrig tar
            slut, inte ens i hög hastighet. De <strong>förekommer inte i
            kursen</strong>, så ingen elev kan ha övat på dem innan. Nästa Utmaning på
            samma nivå börjar där den elev som kom längst i den förra slutade: på nästa
            rad, i texter med meningar vid början av nästa mening. Om en text tar slut
            under Utmaningen skriver eleverna vidare i nästa utan paus. På den svenska
            kursen finns det ännu inga egna svenska texter för Utmaningen - där kommer
            de engelska texterna. En egen text väljer du som Egen fil (det sista valet i
            listan med tangenter som används).
          </p>
          <p className="m-0">
            <strong>Elever som är blinda</strong> skriver Utmaningen med{" "}
            <strong>appens uppläsning</strong> (<Kbd>Alt</Kbd> + <Kbd>V</Kbd>) - precis
            som när de övar, utan någon särskild kryssruta för läraren. Tiden då en elev
            väntar på rösten dras automatiskt av från tiden för Utmaningen; en elev som
            ser texten men ändå låter den läsas upp får samma tid avdragen. Tiden för
            uppläsningen är alltså redan utjämnad; om ytterligare extra anpassningar (i
            Finland: stöd för lärande) beslutar du enligt skolans regler.
          </p>
          <p className="m-0">
            <strong>Resultaten</strong> står i den utfällda rutan under Tidigare
            Utmaningar - knappen Utmaningen först i raden fäller ut den: för varje elev
            placering, <strong>utmaningspoäng</strong>, om uppläsning användes,
            hastighet, träffsäkerhet och de osäkra tangenterna. Hur utmaningspoängen
            räknas ut står i 8a. Så snart Utmaningen är över för{" "}
            <strong>hela klassen</strong> kommer dessutom ett{" "}
            <strong>sammanfattande e-postmeddelande</strong> med samma värden. Först då -
            ett meddelande medan någon fortfarande skriver vore ofullständigt, och ett
            andra "nu verkligen alla" vill ingen ha.
          </p>
          <p className="m-0">
            En elev kan välja <strong>Jag står över den här gången</strong>. Eleven övar
            då vidare som vanligt och står i sammanställningen som{" "}
            <strong>deltog inte</strong>. Varje elev ser senare sina egna Utmaningar i{" "}
            <strong>Mina framsteg</strong> - samma värden som du ser.
          </p>
        </Section>

        <Section title="9 · Självständigt arbete och kontroll av AI (bara för dig)">
          <p className="m-0">
            Kolumnen <strong>Självständigt arbete</strong> visar ett misstankevärde{" "}
            <strong>1-10</strong>. Det blir högt vid tecken på text som eleven inte har
            skrivit själv: <em>inklistring</em>, ofta byte av fönster eller fokus,
            orimligt hög hastighet eller felfri noggrannhet utan någon inlärningskurva.
            Det här värdet ser <strong>bara du</strong>, inte eleverna.
          </p>
        </Section>

        <Section title="10 · Tillgänglighet">
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Kontrast och textstorlek:</strong> i raden högst upp (ljust,
              mörkt, hög kontrast); <Kbd>Alt</Kbd> + <Kbd>+</Kbd> / <Kbd>-</Kbd> gör
              skrivfältet större eller mindre.
            </li>
            <li>
              <strong>Uppläsning</strong> (appens egen röst) med <Kbd>Alt</Kbd> +{" "}
              <Kbd>V</Kbd> - för elever som inte har någon skärmläsare installerad (med
              NVDA, JAWS eller VoiceOver är det bättre att låta den vara avstängd). Du
              kan välja om <em>bokstäver, ord eller meningar</em> ska läsas upp,
              talhastigheten och <strong>vilken röst</strong>. När språket är svenska
              letar appen automatiskt efter en svensk röst; om det saknas en visas en
              anvisning för att installera en. <strong>Tiden för uppläsningen räknas
              bort från hastigheten</strong> - elever som lär sig punktskrift och
              behöver uppläsningen får alltså ingen nackdel i antal anslag eller i
              statistiken.
            </li>
            <BrailleTabellenPunkte weg="sv" />
            <li>
              <strong>Uppläsning av fingret:</strong> tryck två gånger snabbt på{" "}
              <Kbd>Skift</Kbd>, så läses rätt finger upp.
            </li>
            <li>
              <strong>Styrning av fokus:</strong> varje knapp har ett bestämt mål - den
              som trycker på den vet sedan var markören står. För elever som arbetar
              med punktskriftsdisplay är det skillnaden mellan att arbeta vidare och
              att leta. Tre regler som märks i undervisningen: <Kbd>Esc</Kbd> stänger
              varje fönster och leder <strong>alltid tillbaka till skrivfältet</strong>;
              ett byte av vy (statistik, biblioteket, inloggning) hamnar på{" "}
              <strong>rubriken för den nya vyn</strong> och läser upp den; och{" "}
              <strong>ingenting försvinner av sig självt</strong> - även firandet av en
              ny tangent väntar tills eleven trycker på Fortsätt.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>E</Kbd> hoppar till skrivfältet, <Kbd>Alt</Kbd> +{" "}
              <Kbd>H</Kbd> öppnar hjälpen.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>U</Kbd> byter till övningen, <Kbd>Alt</Kbd> +{" "}
              <Kbd>S</Kbd> till <strong>Mina klasser</strong> (under övningen: till den
              egna statistiken); <Kbd>Alt</Kbd> + <Kbd>Z</Kbd> läser upp vilken rad som
              är på tur.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>D</Kbd> visar övningstiden - på
              punktskriftsdisplayen och (med uppläsning) som meddelande.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>T</Kbd> öppnar eller stänger{" "}
              <strong>listan med kortkommandon</strong>.
            </li>
          </ul>
        </Section>

        <Section title="11 · Ta bort">
          <p className="m-0">
            Enskilda elever eller en hel klass kan tas bort för gott (med konto,
            spelläge och resultat). Det går inte att ångra - appen frågar först.
          </p>
        </Section>

        <Section title="12 · Att ladda ned: handbok och affisch (PDF)">
          <p className="m-0">
            Allt från den här hjälpen, och mycket mer, står i{" "}
            <strong>handboken för lärare</strong>: inlärningsvägen med alla steg,
            klassens översikt, Utmaningen steg för steg, poängen och värdena som du kan
            luta dig mot vid bedömningen.
          </p>
          <HandbuchLaden />
          <p className="m-0">
            För väggen i klassrummet eller i lärarrummet finns också{" "}
            <strong>Tastenflow-affischen att sätta upp i skolan</strong>: A3 på höjden,
            att skriva ut - med det Tastenflow kan på ett ögonblick och en QR-kod till
            tastenflow.org. Affischen finns på svenska (tastenflow.org/tastenflow-plakat-sv.pdf). Till skillnad från
            handboken är den fritt tillgänglig för alla, även utan inloggning.
          </p>
          <PlakatLaden />
          <p className="m-0 text-sm text-ink-muted">
            Båda finns också i Mina klasser under Att ladda ned.
          </p>
        </Section>
      </div>
    </div>
  );
}
