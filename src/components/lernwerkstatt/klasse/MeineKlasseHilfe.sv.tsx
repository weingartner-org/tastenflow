/**
 * ★★★ O-HILFE-SV (25.10.2026): DIE HILFE ZU „MEINE KLASSEN" AUF SCHWEDISCH.
 * ===========================================================================
 * Massgeblich ist die deutsche Fassung (`MeineKlasseHilfe.tsx`): dieselben
 * Abschnitte, dieselben Tatsachen; der Aufbau folgt `MeineKlasseHilfe.cs.tsx`.
 * Sichtbar nur mit `spracheGewaehlt === "sv"`; jedes Programm ohne
 * Sprach-Anbieter zeigt weiter die deutsche Fassung.
 *
 * Anrede (Glossar `recherche-schwedisch-2026-10-25/GLOSSAR-sv.md`, Regel 1):
 * **du** auch für Lehrkräfte, sachlich. Kinder heissen in dieser Sicht
 * „elever" / „eleven" (Glossar §2.5); was die Lehrkraft der Klasse sagt, steht
 * in der du-Form. Knopfnamen ohne Anführungszeichen, hervorgehoben (Regel 8);
 * Namen nur als Subjekt oder nach Doppelpunkt (Regel 13); Zähler mit
 * Doppelpunkt und Schrägstrich („Redo: 12/14", Glossar §2.12).
 * Die Startpunkte werden nur grob beschrieben: die Reihenfolge des Weges „sv"
 * entsteht parallel (F4); fest steht nur die Grundreihe f j d k s l a ö.
 * Die Mouseover-Erwähnung („sobald der Zeiger darauf steht") fehlt bewusst -
 * ohne Maus-Vokabular, wie in der tschechischen Fassung.
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

// ★ O-HILFE-SV (25.10.2026): „Utmaningen" (Glossar §2.3) steht ausgeschrieben im
// Text - bestimmte Form, Mehrzahl „Utmaningar", immer gross.
export function MeineKlasseHilfeSchwedisch({
  onClose,
  programmName,
}: {
  onClose: () => void;
  /** Das offene Programm - davon hängt ab, welche Abschnitte dastehen. */
  programmName?: string;
}) {
  const tastenflow = programmName === "Tastenflow";
  const einstiegsMinuten = mehrzahl(EINSTIEGSFENSTER_MIN, "sv", {
    one: (z) => `${z} minut`,
    other: (z) => `${z} minuter`,
  });
  return (
    <Modal title="Hjälp: Mina klasser" onClose={onClose} size="lg">
      <div className="space-y-5">
        <RundgangMeineKlassenKnopf onStart={onClose} programmName={programmName} />
        <p className="m-0 text-sm leading-relaxed text-ink">
          Här arbetar du med din klass. Klasser och konton skapar du{" "}
          <strong>en gång</strong> - de gäller i alla program, med samma klasskod och
          samma lösenord.
          {tastenflow && (
            <>
              {" "}
              Den som öppnar Tastenflow som lärare kommer alltid hit. Till den egna
              övningen leder Öva själv (<Taste>Alt</Taste> + <Taste>U</Taste>).
            </>
          )}
        </p>

        <Abschnitt titel="Så är sidan uppbyggd">
          <p className="m-0">
            <strong>Högst upp för klassen</strong> står dess namn - om du har flera
            klasser i listan Klass, där du byter klass -, antalet elever och
            klasskoden. Till höger på den raden, före Att ladda ned, finns
            omkopplaren <strong>Framsteg | Elever och inloggningar</strong> - på samma
            ställe på båda skärmarna som den leder till.
          </p>
          <p className="m-0">
            Under <strong>Elever och inloggningar</strong> skapar du en ny klass,
            lägger till elever och flyttar dem, ser lösenord och
            inloggningsuppgifter, klasskoden och vilka program klassen har. Många
            elever på en gång lägger du till där, under Elever, med{" "}
            <strong>Lägg till elever från en Excel-fil</strong>: först Ladda ned mall
            (Excel), sedan en rad för varje elev med namn, lösenord och - för
            Tastenflow - var eleven ska börja. Ett tomt lösenord skapar programmet
            självt; en förhandsvisning visar vad som tas över, och alla elever som har
            lagts till står sedan under Skriv ut inloggningsuppgifter. Med{" "}
            <strong>Ladda ned klasslista</strong> bredvid laddar du när som helst ned
            en Word-fil med namn, lösenord och klasskod för ALLA elever i den här
            klassen - att skriva ut.
            {!tastenflow && (
              <>
                {" "}
                Ett meddelande till alla elever skriver du där med Meddelande till
                klassen.
              </>
            )}
          </p>
          <p className="m-0">
            Under <strong>Framsteg</strong> - där hamnar du när du öppnar sidan -
            står klassens program, Att ladda ned och under dem klassens statistik: hur
            långt varje elev har kommit.
            {tastenflow && (
              <>
                {" "}
                Högst upp i den finns en rad med knappar: <strong>Utmaningen</strong>,{" "}
                <strong>Egna övningar</strong>, <strong>Veckomål</strong>,{" "}
                <strong>Klassens inställningar</strong> och{" "}
                <strong>Pausa en timme</strong>. Varje knapp öppnar sitt eget avsnitt
                under sig - alltid bara ett i taget, och <Taste>Esc</Taste> stänger
                det igen. Utmaningen öppnar formuläret med fälten Tangenter som
                används och Min och knappen Börja nu, och dessutom tidigare
                Utmaningar; Egna övningar bestämmer en text för hela klassen (ladda
                upp en fil, en text från Mina texter eller en mall från kursen -
                eleverna får ett fönster med bara knappen Fortsätt); Veckomål ställer
                in minuter per vecka; Pausa en timme startar 60 minuter då klassen
                övar vidare men ingenting räknas till veckomålet. Under det finns
                Klassöversikt (månad eller läsår, med poängstapel och linjediagram);
                till höger i dess rubrikrad står Meddelande till klassen - ett
                meddelande till alla elever, var och en får det i en egen
                konversation.
              </>
            )}
          </p>
          {tastenflow && (
            <p className="m-0">
              Knappen <strong>Klassens inställningar</strong> på raden öppnar:
              årskurs (utifrån den väljer appen textsorter och räknar upp en årskurs
              varje läsår; Vuxna räknas inte upp), språk med lås, klassens
              startpunkt (den gäller även för elever som kommer till klassen senare)
              och Klasstävlingen. De här fyra gäller för hela klassen och frågas
              efter redan när en klass skapas; för varje elev finns Var vill du
              börja?, Skriva med en hand och I lugn och ro kvar i elevens utfällda
              rad.
            </p>
          )}
          {tastenflow && (
            <p className="m-0">
              Nivåerna i <strong>Var vill du börja?</strong> är ordnade efter
              tangenter: den första är bara F och J, den andra hela grundraden (f j d
              k s l a ö). Den tredje lägger till de vanligaste bokstäverna efter
              grundraden och Skift. De följande nivåerna - alla bokstäver,
              skiljetecken, siffror och allt - låser sedan upp resten i tur och
              ordning.
            </p>
          )}
          <p className="m-0">
            Varje knapp förklarar sig själv: tipset visas så snart fokus kommer dit
            med <Taste>Tabb</Taste>. <Taste>Esc</Taste> stänger tipset.
          </p>
        </Abschnitt>

        {tastenflow && (
          <Abschnitt titel="Utmaningen steg för steg">
            <ol className="m-0 list-decimal space-y-1 pl-5">
              <li>
                Högst upp i klassens statistik, i uppgiftslistan, öppnar knappen
                Utmaningen formuläret.
              </li>
              <li>
                Välj <strong>tangenter som används</strong> - alla elever får samma
                text på den här nivån.
              </li>
              <li>
                Skriv in <strong>tiden för Utmaningen</strong> i minuter - fältet står
                direkt bredvid.
              </li>
              <li>
                Säg till klassen: <em>Tiden börjar när du trycker på din första
                tangent.</em> Från starten har eleverna {einstiegsMinuten} på sig att
                börja; tiden för Utmaningen går för varje elev för sig.
              </li>
              <li>
                Tryck på <strong>Börja nu</strong> - Utmaningen börjar direkt för hela
                klassen.
              </li>
              <li>
                Direkt efteråt står det där till exempel{" "}
                <strong>Redo: 12/14 - inte än: Said, Jano</strong>: hos 12 elever har
                Utmaningen redan kommit fram till enheten. Raden visas efter ungefär en
                sekund. Om någon står kvar länge under inte än hjälper det oftast att
                ladda om sidan en gång.
              </li>
              <li>
                Så länge Utmaningen pågår ser du raden Inlämnat: 3/18 med namnen.
              </li>
              <li>
                Sedan visas resultaten under formuläret: för varje elev placering,{" "}
                <strong>utmaningspoäng</strong>, om uppläsning användes, anslag per
                minut, träffsäkerhet, tecken, fel och osäkra tangenter. Dessutom kommer
                ett sammanfattande e-postmeddelande.
              </li>
            </ol>
          </Abschnitt>
        )}

        {tastenflow && (
          <>
            <Abschnitt titel="Vad kolumnerna i tabellen betyder">
              <SpaltenHilfe />
            </Abschnitt>

            <Abschnitt titel="Vad svårighetsnivån betyder">
              <LeistungsstufeHilfe />
            </Abschnitt>

            <Abschnitt titel="Värdena som du kan bygga ett betyg på">
              <DreiWerteHilfe />
            </Abschnitt>
          </>
        )}

        <Abschnitt titel="Klasskoden">
          <p className="m-0">
            Den står högst upp bredvid klassens namn och gäller för alla program. Den
            som loggar in skriver klasskod, namn och lösenord; enheten kommer ihåg
            koden, sedan räcker namn och lösenord.
          </p>
          <p className="m-0">
            När du skapar en klass är den <strong>obligatorisk</strong>. Medan du
            skriver namnet föreslår programmet en passande kod - av "4B Umeå" blir
            "4BUMEA". Du kan ändra den, men inte lämna den tom. Senare ändrar du den
            under Elever och inloggningar med Redigera.
          </p>
          <p className="m-0">
            ⚠️ Om du ändrar koden loggar alla elever i klassen in med den nya koden
            från och med då.
          </p>
        </Abschnitt>

        <Abschnitt titel="Flytta en elev till en annan klass">
          <p className="m-0">
            Under Elever och inloggningar finns vid varje elev knappen{" "}
            <strong>Flytta till en annan klass</strong>. Den öppnar fältet Klasskod för
            den nya klassen. Det går till varje klass vars klasskod du känner till -
            även till en annan lärares klass. Innan eleven flyttas frågar programmet en
            gång till.
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>Eleven loggar sedan in med den nya klasskoden.</li>
            <li>Lärarna i den nya klassen ser eleven och elevens framsteg.</li>
            <li>
              {tastenflow
                ? "Resultaten från Utmaningarna och meddelandena stannar kvar i den tidigare klassen."
                : "Meddelandena stannar kvar i den tidigare klassen."}
            </li>
          </ul>
        </Abschnitt>

        <Abschnitt titel="Kortkommandon i den här delen">
          <p className="m-0">
            <Taste>Alt</Taste> + <Taste>H</Taste> öppnar och stänger den här hjälpen.{" "}
            <Taste>Alt</Taste> + <Taste>T</Taste> visar listan med alla kortkommandon.{" "}
            <Taste>Alt</Taste> + <Taste>U</Taste> leder till den egna övningen.{" "}
            <Taste>Alt</Taste> + <Taste>N</Taste> öppnar meddelandena,{" "}
            <Taste>Alt</Taste> + <Taste>K</Taste> färger och kontrast och{" "}
            <Taste>Alt</Taste> + <Taste>J</Taste> kontomenyn.
          </p>
          <p className="m-0">
            Med <Taste>Tabb</Taste> går du genom flikarna; <Taste>Retur</Taste> byter
            flik. Efter ett byte står fokus i den nya delen - en skärmläsare läser
            vidare därifrån.
          </p>
        </Abschnitt>

        <Abschnitt titel="Mer utförligt">
          <p className="m-0">
            Handboken för lärare (på engelska) öppnar du högst upp med Att ladda ned -
            där finns också Tastenflow-affischen att skriva ut och sätta upp (A3, på
            engelska), som finns för alla, även utan inloggning.
            {tastenflow && (
              <>
                {" "}
                Hjälpen i själva programmet når du där med <Taste>Alt</Taste> +{" "}
                <Taste>H</Taste>.
              </>
            )}
          </p>
        </Abschnitt>
      </div>
    </Modal>
  );
}
