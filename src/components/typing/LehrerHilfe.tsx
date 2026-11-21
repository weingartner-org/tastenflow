/**
 * Ausführliche Hilfe für Lehrkräfte zu „Tastenflow" (Wunsch von Johannes: „eine
 * Hilfe für Lehrer, die alle Funktionen genau erklärt"). Anrede „Sie". Deckt
 * Konten/Klassen, die Einstellungen je Kind, die automatische Leistungsstufe,
 * Sterne/Töne, Wochenziel, Statistik samt Steigerung, den Eigenständigkeits-/
 * KI-Check und die Barrierefreiheit ab. Siehe [[project_zehnfinger_trainer]],
 * [[feedback_data_transparency]], [[feedback_security_first]].
 */
import { BrailleTabellenPunkte } from "./ScreenreaderHinweis";
import { AltText, Kbd } from "./TippenHilfeTeile";
import { useRef } from "react";
import {
  EINSTIEGSFENSTER_MIN,
  FEHLER_GEWICHT,
  FEHLER_GEWICHT_FREI,
  MIND_ZEICHEN,
  PROBEN_JE_NIVEAU,
  PRUEFUNG_WORT,
  PRUEFUNG_WORT_MEHRZAHL,
  SCORE_ERKLAERUNG_SIE,
  STEIGERUNG_HINWEIS_SIE,
} from "@/lib/typing";
import { useFocusTrap } from "./useFocusTrap";
import { HandbuchKnopf } from "@/components/lernwerkstatt/HandbuchKnopf";
import { handbuecherFuer, tastenflowPlakat } from "@/lib/lernwerkstatt/handbuecher";
import { DreiWerteHilfe, LeistungsstufeHilfe } from "./TastenflowZahlenHilfe";
import { RundgangLehrkraftKnoepfe } from "./Rundgang"; // ★ Z4 (19.09.2026)
import { useBedienSprache, waehleUebersetzung } from "@/lib/bedienSprache";
import { DidaktikInhalt, didaktikAbschnittTitel } from "./DidaktikHinweise";
import { LehrerHilfeEnglisch } from "./LehrerHilfe.en";
import { LehrerHilfeFranzoesisch } from "./LehrerHilfe.fr";
import { LehrerHilfeSpanisch } from "./LehrerHilfe.es";
import { LehrerHilfeItalienisch } from "./LehrerHilfe.it";
import { LehrerHilfePolnisch } from "./LehrerHilfe.pl";
import { LehrerHilfeTuerkisch } from "./LehrerHilfe.tr";
import { LehrerHilfeTschechisch } from "./LehrerHilfe.cs";
import { LehrerHilfeBulgarisch } from "./LehrerHilfe.bg"; // ★ O-BG (25.10.2026)
import { LehrerHilfeNiederlaendisch } from "./LehrerHilfe.nl"; // ★ O-NL (25.10.2026)
// ★ O-PT (25.10.2026): portugiesisch (Portugal, `LehrerHilfe.pt.tsx`).
import { LehrerHilfePortugiesisch } from "./LehrerHilfe.pt";
import { LehrerHilfeSchwedisch } from "./LehrerHilfe.sv"; // ★ O-SV (25.10.2026)
import { LehrerHilfeUkrainisch } from "./LehrerHilfe.uk"; // ★ O-UK (25.10.2026)
// ★ O-EL (25.10.2026): griechisch.
import { LehrerHilfeGriechisch } from "./LehrerHilfe.el";
// ★ O-BR (25.10.2026): portugiesisch (Brasilien), `LehrerHilfe.br.tsx`.
import { LehrerHilfeBrasilianisch } from "./LehrerHilfe.br";
// ★ O-HU (25.10.2026): ungarisch (`LehrerHilfe.hu.tsx`).
import { LehrerHilfeUngarisch } from "./LehrerHilfe.hu";
import { LehrerHilfeRumaenisch } from "./LehrerHilfe.ro"; // ★ O-RO (25.10.2026)

/**
 * ★★★★ 07.09.2026: Dieser Knopf stand hier als eigene Fassung - `HandbuchLaden`,
 * gebaut am 30.08. Er kannte den Datei-Ausweis, den die »Im Griff«-Seite nicht
 * kannte; ihre blanken `<a download>` liefen ins Leere. Beide Fassungen sind
 * jetzt EIN Bauteil (`components/lernwerkstatt/HandbuchKnopf`), und Dateiname,
 * Speichername und Größe kommen aus `lib/lernwerkstatt/handbuecher.ts`.
 * Der Weg zurück wäre eine dritte Fassung
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 */
function HandbuchLaden() {
  return (
    <p className="m-0">
      <HandbuchKnopf alsLink handbuch={handbuchTastenflow()} />
    </p>
  );
}

/**
 * ★ 19.09.2026: das Plakat zum Aufhängen in der Schule - derselbe Knopf wie
 * beim Handbuch (`HandbuchKnopf`), gefunden über den Dateinamen, nicht über
 * die Stelle in der Liste. ★ Noch am selben Abend ÖFFENTLICH (Werbematerial,
 * kein Lehrmaterial): Der Knopf lädt es ohne Ausweis aus `/tastenflow-plakat.pdf`.
 */
function PlakatLaden() {
  const h = tastenflowPlakat();
  // `div` statt `p`: Bei einem Fehler zeigt der Knopf einen eigenen Absatz
  // (`role="alert"`), und ein Absatz im Absatz ist kein gültiges HTML.
  return (
    <div className="m-0">
      <HandbuchKnopf alsLink handbuch={h} />
    </div>
  );
}

/** Das Tastenflow-Handbuch aus der gemeinsamen Liste (wirft bei Tippfehler). */
function handbuchTastenflow() {
  const h = handbuecherFuer("tippen")[0];
  if (!h) throw new Error("Kein Tastenflow-Handbuch in HANDBUECHER");
  return h;
}

// ★ 18.10.2026 (Johannes: „passe mac an Wahl-taste an"): `Kbd` und `AltText` aus
//   der Kinder-Hilfe - am Mac heißt die Taste „Wahl" (Option, Opción …), im
//   Kästchen wie im Satz. Vorher stand hier ein eigenes `Kbd`, das immer „Alt" zeigte.

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-hairline bg-surface-sunken p-4">
      <h3 className="m-0 mb-1 text-lg font-semibold text-ink">{title}</h3>
      <div className="space-y-2 text-ink-soft">{children}</div>
    </section>
  );
}

/**
 * ★★ EN6b (19.09.2026): Die Hilfe spricht die Bedienungssprache. Die englische
 * Fassung steht als eigene Datei daneben (`LehrerHilfe.en.tsx`) - dasselbe
 * Muster wie `TippenHilfe` (EN7): So bleibt die deutsche Fassung unten Zeichen
 * für Zeichen, wie sie war. Ohne aktiven Sprach-Anbieter liefert
 * `useBedienSprache` immer „de".
 *
 * ★ E11b (26.09.2026): seit heute auch französisch (`LehrerHilfe.fr.tsx`),
 * über `spracheGewaehlt` und `waehleUebersetzung` statt einer weiteren
 * einer Ternäre, die eigens gegen „en" prüft - siehe Kopf-Doku in `TippenHilfe.tsx` und
 * `src/lib/bedienSprache/uebersetzungsWahl.ts`.
 */
export function LehrerHilfe(props: { open: boolean; onClose: () => void }) {
  const { spracheGewaehlt } = useBedienSprache();
  const uebersetzung = waehleUebersetzung(spracheGewaehlt, {
    en: <LehrerHilfeEnglisch {...props} />,
    fr: <LehrerHilfeFranzoesisch {...props} />,
    // ★ ES-O (27.09.2026): spanisch (`LehrerHilfe.es.tsx`) - vorher Deutsch.
    es: <LehrerHilfeSpanisch {...props} />,
    // ★ O-IT (02.10.2026): italienisch (`LehrerHilfe.it.tsx`).
    it: <LehrerHilfeItalienisch {...props} />,
    // ★ O-PL (02.10.2026): polnisch (`LehrerHilfe.pl.tsx`).
    pl: <LehrerHilfePolnisch {...props} />,
    // ★ O-TR (02.10.2026): türkisch (`LehrerHilfe.tr.tsx`).
    tr: <LehrerHilfeTuerkisch {...props} />,
    // ★ O-CS (03.10.2026): tschechisch (`LehrerHilfe.cs.tsx`).
    cs: <LehrerHilfeTschechisch {...props} />,
    bg: <LehrerHilfeBulgarisch {...props} />, // ★ O-BG (25.10.2026): `LehrerHilfe.bg.tsx`
    // ★ O-NL (25.10.2026): niederländisch (`LehrerHilfe.nl.tsx`).
    nl: <LehrerHilfeNiederlaendisch {...props} />,
    // ★ O-PT (25.10.2026): portugiesisch (Portugal, `LehrerHilfe.pt.tsx`).
    pt: <LehrerHilfePortugiesisch {...props} />,
    // ★ O-SV (25.10.2026): schwedisch (`LehrerHilfe.sv.tsx`).
    sv: <LehrerHilfeSchwedisch {...props} />,
    // ★ O-UK (25.10.2026): ukrainisch (`LehrerHilfe.uk.tsx`).
    uk: <LehrerHilfeUkrainisch {...props} />,
    // ★ O-EL (25.10.2026): griechisch (`LehrerHilfe.el.tsx`).
    el: <LehrerHilfeGriechisch {...props} />,
    // ★ O-BR (25.10.2026): portugiesisch (Brasilien, `LehrerHilfe.br.tsx`).
    br: <LehrerHilfeBrasilianisch {...props} />,
    // ★ O-HU (25.10.2026): ungarisch (`LehrerHilfe.hu.tsx`).
    hu: <LehrerHilfeUngarisch {...props} />,
    ro: <LehrerHilfeRumaenisch {...props} />, // ★ O-RO (25.10.2026)
  });
  return uebersetzung ?? <LehrerHilfeDeutsch {...props} />;
}

function LehrerHilfeDeutsch({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  // Fokus in den Dialog setzen und Tab darin halten. Escape schließt über die
  // Seite (TippenTrainerPage).
  //
  // ★ Nr 14 der Fokusziele (22.08.2026): KEIN `restoreFocus`. Vorher gab es
  // hier zwei Fokus-Ziele nacheinander - erst zurück auf den ❓-Knopf, dann
  // (über `closeHelp` der Seite) ins Tippfeld. Zwei Meldungen für einen
  // Vorgang: Auf der Braillezeile springt die Zeile zweimal, und die zweite
  // löscht die erste, bevor jemand sie gelesen hat. Es gilt R2 für Dialoge:
  // EIN Ziel, und das ist die Eingabezeile. `TippenHilfe` machte es schon
  // immer so - jetzt machen es beide gleich.
  useFocusTrap(open, cardRef, { initialFocus: closeRef });
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Hilfe für Lehrkräfte zu Tastenflow"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        className="card my-8 w-full max-w-3xl space-y-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          {/* ★ E7 (11.09.2026): `text-xl` statt `text-2xl`. */}
          <h2 className="m-0 text-xl font-semibold text-ink">
            Hilfe für Lehrkräfte: alle Funktionen von „Tastenflow"
          </h2>
          <button
            ref={closeRef}
            type="button"
            className="btn-secondary btn-toggle"
            onClick={onClose}
            aria-label="Hilfe schließen"
          >
            ✕ Schließen
          </button>
        </div>
        <RundgangLehrkraftKnoepfe onStart={onClose} />

        <p className="m-0 text-ink-soft">
          „Tastenflow" hat ein <strong>eigenes Konto-System</strong>, komplett
          getrennt von der LMS-Anmeldung. Wer hier angemeldet ist, beeinflusst die
          LMS-Sitzung nicht - und umgekehrt.
        </p>

        <Section title="1 · Klassen & Konten anlegen">
          <p className="m-0">
            Als Lehrkraft landen Sie beim Öffnen von Tastenflow immer in{" "}
            <strong>„Meine Klassen"</strong>; ins eigene Üben führt „Selbst
            üben" (<Kbd>Alt</Kbd> + <Kbd>U</Kbd>). Über{" "}
            <strong>„Kinder und Zugänge"</strong> oben rechts legen Sie
            eine Klasse an - im aufklappbaren Abschnitt <strong>„Neue Klasse
            anlegen"</strong>. Der <strong>Klassencode</strong> ist Pflicht: Während Sie
            den Namen tippen, schlägt das Programm einen passenden vor (aus
            „MS-Wein" wird „MSWEIN"); Sie können ihn ändern, zum Beispiel auf{" "}
            <code>3.MS</code>. Der Code gilt für die ganze Klasse. Im selben
            Abschnitt wählen Sie <strong>Schulstufe</strong> und{" "}
            <strong>Startniveau</strong> und prüfen Sprache (mit Schloss) und
            Klassenmatch - dieselben Felder wie unter „Einstellungen der Klasse".{" "}
            <strong>„Klasse anlegen"</strong> geht erst, wenn alles ausgefüllt
            ist; sonst nennt ein Satz, was noch fehlt, und der Fokus steht im
            ersten fehlenden Feld.
          </p>
          <p className="m-0">
            Dann fügen Sie Lernende mit <strong>Name + Passwort</strong>{" "}
            hinzu. Anmelden können sie sich danach von{" "}
            <strong>jedem Gerät</strong> mit <em>Klassencode + Name + Passwort</em>.
            Das Gerät merkt sich den Klassencode, damit die Kinder nur noch Name und
            Passwort eingeben müssen.
          </p>
          <p className="m-0">
            Klassenname und Klassencode lassen sich später über{" "}
            <strong>„✏️ Bearbeiten"</strong> ändern - ein neuer Code gilt dann für
            alle Kinder der Klasse (sie melden sich ab dann mit dem neuen Code an).
          </p>
          {/* Selbstlernende (09.08.2026): Für Lehrkräfte ist die wichtigste
              Nachricht, dass sich am eigenen Weg NICHTS ändert — und dass solche
              Konten NICHT in ihrer Klassenliste auftauchen. */}
          <p className="m-0">
            <strong>Neu:</strong> Wer zu keiner Klasse gehört, kann sich seit dem
            09.08.2026 auch <strong>selbst ein Konto anlegen</strong> - im
            Anmelde-Fenster mit dem Häkchen „Ich übe allein …" und einer
            E-Mail-Adresse. An Ihrem Weg ändert das nichts:
            Solche Konten gehören zu keiner Klasse, erscheinen in keiner Ihrer
            Listen und bekommen ihren Wochenbericht selbst. Für Ihre Klasse bleibt
            alles wie bisher - Sie legen die Kinder an.
          </p>
        </Section>

        <Section title="2 · Einstellungen der Klasse und je Kind">
          {/*
            ★★★ B8-B11 (11.09.2026): Vier Einstellungen sind von „je Kind" auf
            „je Klasse" gewandert. Die Hilfe muss das zuerst sagen - sonst sucht
            eine Lehrkraft die Textstufe weiter in der aufgeklappten Zeile.
          */}
          <p className="m-0">
            <strong>Für die ganze Klasse</strong> (Schalter „Einstellungen der
            Klasse" in der Aufgaben-Zeile über der Tabelle, neben
            Tippchallenge, Eigene Übung, Wochenziel und Eine Stunde sperren -
            zugeklappt nennt der Schalter selbst schon Schulstufe, Sprache und
            Klassenmatch):
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Schulstufe:</strong> Daraus rechnet die App die Textstufe -
              Wortschatz, Witz-Niveau und Tonfall der Übungstexte. 7. Schulstufe
              heisst rund 13 Jahre, also Texte für 11-15 Jahre. <strong>Sie
              wächst mit:</strong> Die App merkt sich das Schuljahr des Eintrags
              und zählt jedes Jahr eine Stufe weiter, ohne dass Sie etwas
              nachstellen. Für Gruppen von Erwachsenen gibt es die Stufe{" "}
              <strong>„Erwachsen"</strong> - sie zählt nicht weiter. Ein
              Geburtsjahr wird für Kinder einer Klasse nicht mehr erhoben.
            </li>
            <li>
              <strong>Sprache und Sperre:</strong> Deutsch oder Englisch für die
              Übungswörter und -texte der ganzen Klasse; mit dem Schloss daneben
              können die Kinder sie nicht mehr selbst umstellen. Den runden
              Sprachschalter <strong>EN</strong>/<strong>DE</strong> in der
              Kopfzeile hat jedes Kind: Er stellt Knöpfe und Menüs um und die
              Übungstexte gleich mit - mit Schloss nur Knöpfe und Menüs.
              {/* ★ 19.09.2026: Sprachschalter für alle (Johannes). */}
            </li>
            <li>
              <strong>Startniveau der Klasse:</strong> „womit angefangen wird"
              als Vorgabe für die ganze Klasse - sie gilt auch für jedes Kind,
              das später dazukommt, und nimmt nur dazu: Ein Kind, das schon
              weiter ist, verliert nichts. Beim Wählen trägt die App die Stufe
              zugleich für die vorhandenen Kinder ein; sind welche schon weiter,
              fragt sie vorher nach und bietet drei Wege an: alle einstufen, nur
              die, die noch nicht so weit sind, oder abbrechen. Wirksam, sobald
              ein Kind Tastenflow das nächste Mal öffnet; Statistik und Abzeichen
              bleiben in jedem Fall erhalten.
            </li>
            <li>
              <strong>Klassenmatch erlauben:</strong> Die Kinder können einander
              zu einem 5-Minuten-Match einladen. In „Übungszeiten" der
              aufgeklappten Zeile sehen Sie, wie oft ein Kind je Woche
              mitgespielt hat - keine Platzierung, keine Zeit.
            </li>
            <li>
              {/* ★ 23.09.2026: neue Klassen-Einstellung, Anlass eine 3. Klasse
                  HAS, die für die Büroarbeit lernt. */}
              <strong>Zeilenende mit Enter:</strong> Angehakt schliesst jedes
              Kind der Klasse jede Übungszeile mit der Eingabetaste ab - wie
              beim Schreiben im Büro. Gilt für „Mein Training", Geschichten,
              Eigene Übung, die Zeilen-Wortspiele, Tippchallenge und
              Klassenmatch; nicht für Rätsel, Buchstabensalat, Fingerdiktat,
              die Expedition und „Tasten erkunden". Vorgabe: aus.
            </li>
          </ul>
          <p className="m-0">
            <strong>Je Kind</strong> (hinter dem Pfeil in seiner Zeile):
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Tastatur:</strong> im Zahnrad-Bereich unter „Tastatur"
              wählbar - deutsch/österreichisch, Schweizer, amerikanische oder
              britische Tastatur. Die Einstellung gilt für dieses Gerät (nicht
              fürs Konto) und steuert Bildschirm-Tastatur, Finger-Ansagen und
              welche Zeichen geübt werden. Auf der Schweizer Tastatur entfällt das
              ß (dort schreibt man „ss"), auf englischen Tastaturen entfallen
              ä ö ü ß - deutsche Texte erscheinen dann in der Ersatzschreibweise
              (ä → ae).
            </li>
            <li>
              <strong>Womit anfangen?:</strong> dieselbe Stufen-Liste wie das
              Startniveau der Klasse (siehe oben) - hier für das eine Kind,
              das eine Ausnahme braucht. Geübtere überspringen so die
              Grundlagen und beginnen weiter vorn (z. B. erst ab den Zahlen);
              ein Zurückstufen fragt vorher nach.
            </li>
            <li>
              <strong>Einhand schreiben:</strong> nimmt für dieses Kind die
              Umschalt-Gegenhand-Regel zurück - Großbuchstaben und
              Sonderzeichen gelten dann mit jeder Umschalttaste.
            </li>
            <li>
              <strong>Tempo zählt nicht:</strong> die Geschwindigkeit wird für
              dieses Kind nirgends bewertet - kein Zeitfenster im Spiel, kein
              Tempo-Ziel bei den Sternen, kein Auf- und Abstieg der
              Leistungsstufe nach Tempo. Für Kinder, die sorgfältig, aber sehr
              langsam tippen.
            </li>
            <li>
              <strong>Zeichenabstand groß (CVI):</strong> größerer Abstand
              zwischen jedem Zeichen beim Abschreiben, in drei Stufen (doppelt,
              dreifach, vierfach) - für Kinder mit zerebraler Sehbehinderung
              (CVI), bei denen eng stehende Zeichen ineinanderlaufen. Das Kind
              kann den Abstand auch selbst in seinen Einstellungen (Zahnrad,
              <AltText>Alt + O</AltText>) ändern - und Sie jederzeit wieder hier. Es gilt, was
              zuletzt gewählt wurde.
              {/* ★ 19.09.2026, Johannes: „die CVI-Einstellungen kann sich jedes
                  Kind immer auch selbst in den Einstellungen einstellen, aber
                  auch die Lehrkraft" */}
            </li>
          </ul>
          <p className="m-0">
            Alles lässt sich jederzeit ändern - die vier Klassen-Werte im
            Kasten „Einstellungen der Klasse" über der Tabelle, die Werte je
            Kind in seiner aufgeklappten Zeile.
          </p>
        </Section>

        <Section title="3 · Die Leistungsstufe (1-50): das Herzstück">
          {/*
            ⚠️ Der Text steht seit dem 01.09.2026 in
            `TastenflowZahlenHilfe.tsx` und wird von der Hilfe in „Meine
            Klassen" genauso benutzt. Zweimal geschrieben lief er beim ersten
            Zahlen-Umbau auseinander - hier stand eine Fassung, die die
            Tempo-Ziele der Stufen gar nicht nannte.
          */}
          <LeistungsstufeHilfe />
          <p className="m-0">
            Die <strong>aktuelle Stufe</strong> steht in der Tabelle (Spalte{" "}
            <strong>„Leistungsstufe"</strong>) und oben im Übungs-Bildschirm. Sie
            müssen nichts einstellen - nur bei Bedarf „Tempo zählt nicht"
            aktivieren.
          </p>
        </Section>

        {/* ★ E7 (19.09.2026, „Meine Klassen"-Umbau): Bis dahin hiess dieser
            Abschnitt „Zwei Lernsysteme" und erklärte einen Umschalter
            (Zahnrad/<AltText>Alt + B</AltText>) zwischen „Mein Training" und der Übungsart
            „Lektionen". Diese Übungsart ist entfallen (siehe `trainerMode.ts`
            - Kinder fanden den Weg dorthin ohnehin kaum, versteckt im
            Zahnrad). Der Lehrgang lebt weiter, aber als WERKZEUG DER
            LEHRKRAFT: seine Texte stehen jetzt als „Vorlagen" im Bereich
            „Eigene Übung" von „Meine Klassen" bereit, für eine ganze Klasse
            auf einmal - kein zweiter Weg mehr, den ein Kind selbst wählt. */}
        <Section title={'4 · „Mein Training": adaptiv, nach Häufigkeit'}>
          <p className="m-0">
            „Tastenflow" hat <strong>einen</strong> Übungsweg, den jedes Kind für
            sich selbst geht - er <strong>passt sich an</strong>: Das Programm
            misst jede Taste einzeln, übt automatisch die schwächsten und
            schaltet eine neue erst frei, wenn die bisherigen sitzen.
          </p>
          <div className="rounded-xl border border-accent bg-accent-soft p-3">
            <p className="m-0 font-semibold text-ink">
              Reihenfolge nach Buchstaben-Häufigkeit
            </p>
            <ul className="m-0 mt-1 list-disc space-y-1 pl-5">
              <li>
                Nach der Grundstellung kommen die <strong>häufigsten</strong>{" "}
                Buchstaben zuerst - so entstehen schon nach wenigen Tasten{" "}
                <strong>echte Wörter</strong> (Prinzip wie beim Online-Trainer
                keybr).
              </li>
              <li>
                <strong>Jeder Lernweg ist anders</strong> - welche Taste als
                Nächstes drankommt, hängt vom Kind ab, nicht von einer festen
                Liste.
              </li>
              <li>
                <strong>Kein festes Ende</strong> - ideal fürs tägliche,
                selbstständige Üben.
              </li>
            </ul>
          </div>
          <p className="m-0 rounded-xl border border-warning/40 bg-warning/10 p-3">
            <strong>Was Sie für Ihre Planung wissen sollten:</strong> Der
            zugrundeliegende Lehrgang folgt den Tastatur-Reihen („von der Mitte
            nach außen": Grundstellung → obere/untere Reihe → Umlaute →
            Satzzeichen → Zahlen → Sonderzeichen → ganze Texte, fast genau wie
            Typewriter, das viele Schweizer Kantone einsetzen; „Mein Training"
            folgt dagegen fast genau TIPP10). Darin kommt
            der <strong>häufigste deutsche Konsonant n erst spät</strong> (als
            letzter Buchstabe überhaupt) - „Mein Training" gleicht das aus, indem
            es n als einen der ersten Buchstaben nach der Grundstellung übt
            (mit e, i, r, t): echte Sätze gibt es fast sofort, die ersten
            Geschichten ab 13 Tasten.
          </p>
          <p className="m-0">
            <strong>Für die ganze Klasse denselben Text:</strong> Die kuratierten
            Texte des Lehrgangs (Grundstellung, Buchstaben-Reihen, Umlaute,
            Satzzeichen, Zahlen, Sonderzeichen, ganze Texte) stehen Ihnen als{" "}
            <strong>Vorlagen</strong> im Bereich <strong>„Eigene Übung"</strong>{" "}
            von „Meine Klassen" zur Verfügung - wählen Sie eine aus, und die
            ganze Klasse übt denselben Text, egal auf welchem eigenen Stand die
            Kinder gerade sind (genau wie bei einer hochgeladenen Datei zählt
            das zur Übezeit, und neue Tasten werden dabei nicht extra
            freigeschaltet).
          </p>
          {/* ★ 21.09.2026: zwei weitere Arten von Vorlagen. */}
          <p className="m-0">
            <strong>Fremdwörterkunde und Programmcode:</strong> Bei deutschen
            Klassen stehen dort auch die häufigsten <strong>Fremdwörter</strong>{" "}
            - je Zeile zuerst das deutsche Wort oder eine kurze Umschreibung,
            dann das Fremdwort; die Kinder tippen beides nur ab. Die Wörter sind
            auf die Altersstufe der Klasse abgestimmt und nach Themen geordnet.
            Für die <strong>Tippchallenge</strong> mit eigener Datei gibt es
            dieselben Wörter noch einmal, aber in anderen Dateien und
            alphabetisch geordnet. Dazu kommt <strong>Programmcode</strong>{" "}
            zum Abtippen (zehn Sprachen, echter Quelltext offener Projekte,
            andere Ausschnitte als in der Tippchallenge) - nur bei „Eigene
            Übung".
          </p>
        </Section>

        {/* ★ E6/E7/E8 (19.09.2026, „Meine Klassen"-Umbau): Der Schalter
            „Eigene Übung" stand bis dahin nirgends in dieser Hilfe erklärt -
            nur die Vorlagen-Seite davon (Abschnitt 4). Der Kasten selbst
            (Datei hochladen, „Meine Texte", das Fenster für die Kinder) fehlte
            ganz. */}
        <Section title={'4a · „Eigene Übung": ein Text für die ganze Klasse'}>
          <p className="m-0">
            Über den Schalter <strong>„Eigene Übung"</strong> in der
            Aufgaben-Zeile der Klassenstatistik legen Sie einen Text fest, den
            die ganze Klasse übt - unabhängig davon, auf welchem eigenen Stand
            die Kinder gerade sind. Drei Wege zum Text: eine{" "}
            <strong>Datei hochladen</strong> (.txt oder .docx), einen zuvor
            gespeicherten Text aus <strong>„Meine Texte"</strong> wählen, oder
            eine der <strong>Vorlagen</strong> aus dem Lehrgang übernehmen
            (siehe Punkt 4).
          </p>
          <p className="m-0">
            <strong>„Meine Texte"</strong> ist Ihre eigene, dauerhafte Ablage -
            sie gehört zu Ihrem Konto, nicht zur Klasse, und nur Sie sehen sie.
            Beim Hochladen legt <strong>„In Meine Texte speichern"</strong>{" "}
            (voreingestellt an) automatisch eine Kopie dort ab, damit Sie
            denselben Text später wieder verwenden können, ohne die Datei
            erneut hochzuladen.
          </p>
          <p className="m-0">
            Enthält die Datei Zeichen, die sich nicht tippen lassen, zeigt der
            Kasten sie vor dem Start als Liste - Sie entscheiden, ob Sie die
            Datei korrigieren oder trotzdem starten (die restlichen Zeichen
            fallen dann aus den Zeilen, nie als Pflicht-Anschlag).
          </p>
          <p className="m-0">
            <strong>„Eigene Übung starten":</strong> Jedes Kind bekommt sofort
            ein Fenster <em>„Weiter geht es mit einer Übung von deiner
            Lehrkraft"</em> - es kann nur <strong>„Weiter"</strong> drücken,
            nicht ablehnen. Für
            jedes Kind endet die Übung von selbst, sobald es den Text einmal
            geschrieben hat; danach übt es wieder normal weiter.
            <strong> „Übung beenden"</strong> beendet sie vorzeitig für die
            ganze Klasse.
          </p>
          <p className="m-0">
            Die Übung zählt zur Übezeit und wird gemessen wie jede andere
            Runde, auch die wackligen Tasten - sie schaltet aber{" "}
            <strong>keine neue Taste frei</strong>: Welche Tasten drankommen,
            bestimmt allein die Datei.
          </p>
        </Section>

        {/* ★ D-9 (28.09.2026): Didaktik - Sätze aus `lib/typing/didaktikHinweise.ts`. */}
        <Section title={didaktikAbschnittTitel("de")}>
          <DidaktikInhalt lang="de" />
        </Section>

        <Section title="5 · Sinnvolle Texte von Anfang an">
          <p className="m-0">
            Der Trainer zeigt <strong>so früh wie möglich</strong> echte,
            altersgerechte Texte - Witze, Sprichwörter, Sprüche, Wissens- und
            Faktentexte, Zungenbrecher, Wortspiele und ganze Sätze. Ein Text
            erscheint, sobald seine <strong>Buchstaben</strong> gelernt sind;
            reiner „Wortsalat" ist die Ausnahme (nur, um eine brandneue Taste
            gezielt zu üben).
          </p>
          <p className="m-0">
            <strong>Großschreibung:</strong> Die <strong>Schreibung ist immer
            korrekt</strong> (Satzanfang und Nomen groß) - die Kinder sehen nie ein
            falsch geschriebenes Wort. Am Anfang genügt dafür der{" "}
            <strong>kleine</strong> Buchstabe; der große erscheint automatisch
            („Auto-Großschreibung", für <strong>alle Altersstufen</strong>, weil
            korrekte Rechtschreibung in jedem Alter zählt).
          </p>
          <p className="m-0">
            In <strong>„Mein Training" kommt die echte Umschalttaste aber früh</strong>{" "}
            - schon nach den ersten häufigen Buchstaben, sobald genug echte Nomen
            zum Üben da sind (nicht erst nach dem ganzen Alphabet). Ab dann wird groß
            „echt" mit Umschalt getippt. So lernen die Kinder die echte
            Großschreibung bald <strong>selbst</strong>, statt lange nur die
            Auto-Hilfe zu nutzen.
          </p>
          <p className="m-0">
            <strong>Satzzeichen</strong> (Punkt, Komma, Fragezeichen …) erscheinen
            erst, wenn sie gelernt sind - vorher steht der Satz „ohne Punkt und
            Komma" da. Eine noch nicht gelernte <em>Buchstaben-</em> oder{" "}
            <em>Ziffern</em>-Taste wird dagegen <strong>nie</strong> verlangt.
          </p>
        </Section>

        <Section title="6 · Sterne, Abzeichen & Töne (wichtig für Kinder mit Blindheit)">
          <p className="m-0">
            Jede Runde gibt <strong>1-3 Sterne</strong> aus Treffsicherheit und
            Tempo - die <strong>Treffsicherheit zählt dreifach</strong>: 3 Sterne
            setzen immer rund 96 % Treffer voraus (schnelles, schludriges Tippen
            wird nicht belohnt); eine fehlerfreie Runde hat 2 Sterne dagegen auch
            im langsamsten Tempo sicher. Für jede Sternzahl gibt es einen{" "}
            <strong>eigenen Klang</strong>; bei einem <strong>Stufenaufstieg</strong>{" "}
            erklingt ein besonderer Jubel-Klang. Diese Töne sind die zentrale
            Rückmeldung für Kinder mit Sehbeeinträchtigung. Über die{" "}
            <strong>🔇-Schaltfläche</strong> lässt sich der Ton in einer ruhigen
            Klasse abschalten.
          </p>
          <p className="m-0">
            Dazu kommen <strong>Abzeichen</strong> mit kindgerechten Namen
            („Volltreffer", „Präzisions-Pinguin", „Marathon-Maus" …) - in
            Familien mit Steigerungs-Stufen und stets ansagbarem „nächstem Ziel".
            Die Maskottchen-Namen sehen nur die 7- bis 10-Jährigen; ab der
            Textstufe 11-15 steht überall der neutrale Zweitname („Dreimal
            sauber"). Die Abzeichen selbst sind dieselben - verdient bleibt
            verdient, auch beim Wechsel der Textstufe.
            Fast alle belohnen <strong>Genauigkeit und Dranbleiben</strong>; das
            einzige Tempo-Abzeichen setzt 95 % Treffsicherheit voraus. Ein neues
            Abzeichen bringt einen eigenen „Ta-daa"-Klang samt Ansage und steht
            danach in der Statistik ganz oben (beim Kind wie bei Ihnen -
            gleiche Ansicht). Jede Medaille lässt sich <strong>betätigen</strong>{" "}
            und erscheint dann groß mit Effekt.
          </p>
          <p className="m-0">
            Das <strong>Eisschollen-Spiel 🐧</strong> ist die Belohnung nach einer
            neuen Taste in „Mein Training": Der Pinguin überquert einen Parcours
            aus den <strong>wackligsten Zeichen</strong> des Kindes (mal Schollen
            übers Wasser, mal zusätzlich Buchstabenberg mit Bauchrutsche).{" "}
            <strong>Freigeschaltet ist die Taste schon vorher</strong> - seit
            14.08.2026 hängt der Lernfortschritt an keinem Spiel mehr (vorher war
            es ein Tor, und das bestrafte unsichtbar genau die langsamen,
            sorgfältigen Kinder). Beliebig viele Versuche, kein Game Over; bei der
            Anforderung „nur Genauigkeit" (und auf Leistungsstufe 1) gibt es{" "}
            <strong>keinen Zeitdruck</strong> (WCAG-konform abschaltbares
            Zeitlimit). Zusätzlich können Lernende der Textstufen{" "}
            <strong>7-10 und 11-15</strong> das Spiel über den Knopf{" "}
            <strong>Spielen</strong> jederzeit freiwillig
            starten - als „Tages-Abenteuer" mit <strong>Bonus-Fischen</strong>{" "}
            (Fisch-Ruf + Ansage des Zeichens; verpasst = kein Fehler) und der{" "}
            <strong>Echo-Höhle</strong>, in der jede Taste nur angesagt wird (dort
            spricht die App auch bei ausgeschaltetem Vorlesen - Kinder mit und ohne Blindheit
            spielen exakt gleich; die Höhle kommt bewusst NIE in der
            Belohnungs-Runde vor). Ein fehlerfreier Lauf endet mit Polarlicht;
            geschaffte Abenteuer, Fische und fehlerfreie Läufe bringen die
            Abzeichen-Familie <strong>„Abenteuer"</strong>. Wichtig für Ihre
            Wertung: Das Spiel zählt <strong>nicht als Übezeit</strong> und nicht
            ins Wochenziel - es ist reine Motivation.
          </p>
          <p className="m-0">
            <strong>
              Zwei verschiedene Wege ins Spiel - bitte nicht verwechseln:
            </strong>{" "}
            Der Knopf <strong>Spielen</strong> ist der freie Einstieg, den die
            Lernenden selbst drücken; er steht bei <strong>7-10 und 11-15</strong>
            , ab 16 nicht. Die Runde <strong>nach einer neuen Taste</strong>{" "}
            dagegen kommt von selbst: bei 7-10 immer, ab 16 nie, und bei 11-15
            nur, wenn im Zahnrad unter <strong>„Belohnungs-Spiel"</strong> statt{" "}
            <strong>Keins</strong> (Voreinstellung) das Eisschollen-Spiel
            eingestellt ist. Die Einstellung gehört zum <strong>Gerät</strong>,
            nicht zum Konto - wie das Tastatur-Layout. An einem Klassenrechner
            gilt sie also für alle, die dort üben.
          </p>
          <p className="m-0">
            <strong>Weggefallen am 22.08.2026:</strong> der <em>Tipp-Sprint</em> -
            drei Zeilen aus Dreiergruppen der wackligsten Zeichen, bis dahin die
            Voreinstellung für 11-15. Er war eine Dopplung ohne Spielwert: „Mein
            Training" bevorzugt die schwachen Tasten ohnehin, das Kind übte also
            dasselbe noch einmal, nur in einem Fenster.{" "}
            <strong>Zurückgenommen am 31.08.2026:</strong> Am 22.08. war auch der
            freie Spiel-Einstieg ab 11 gestrichen worden - den Knopf{" "}
            <strong>Spielen</strong> gibt es dort wieder. Was 11- bis
            15-Jährige weiterhin NICHT bekommen, ist die Unterbrechung nach jeder
            neuen Taste.
          </p>
        </Section>

        <Section title="7 · Wochenziel">
          {/*
            ★ 31.08.2026 (Johannes): „ob wir dieses System auch in die Hilfe
            bekommen, dass das wer versteht?" ★★★ W3b (18.09.2026): auf das
            neue Minuten-Modell umgeschrieben (`wochenziel.ts`) - keine
            Einheiten mehr, kein Unterrichtstag/-ende. Kurz und schlicht, wie
            der Kasten selbst (Johannes: „Halte die Seite extrem schlank").
          */}
          <p className="m-0">
            Pro Kind stellen Sie <strong>Minuten pro Woche</strong> ein - ohne
            Einheiten. „Für die Klasse übernehmen" schreibt denselben Wert
            allen Kindern der Klasse auf einmal und gilt auch für Kinder, die
            später dazukommen.
          </p>
          <p className="m-0">
            Eine Änderung gilt immer <strong>ab dem nächsten Montag, 8:00 Uhr</strong> -
            die laufende Woche behält ihr bisheriges Ziel. Ein Popup nennt vor
            dem Speichern das genaue Datum.
          </p>
          <p className="m-0">
            {/* ★ L5 (19.09.2026): Das Häkchen heisst seither „Verpasste Minuten
                der vergangenen Wochen nachholen" (Johannes). */}
            <strong>Nachholen:</strong> Ist „Verpasste Minuten der vergangenen
            Wochen nachholen" angehakt, dürfen versäumte Minuten früherer Wochen
            alle auf einmal nachgeholt werden.
          </p>
          <p className="m-0">
            <strong>Woche erlassen</strong> (z. B. bei Krankheit) und{" "}
            <strong>Überfällige zurücksetzen</strong> bleiben wie bisher - je
            Kind, ohne die geübte Zeit zu verändern.
          </p>
          <p className="m-0">
            <strong>Eine Stunde sperren:</strong> ein eigener Schalter für die
            ganze Klasse, 60 Minuten lang. Geübt wird trotzdem - Übezeit und
            Statistik zählen weiter, nur nicht das Wochenziel dieser Stunde.
            Ein zweiter Druck auf denselben Schalter hebt die Sperre vorzeitig
            wieder auf.
          </p>
        </Section>

        <Section title="8 · Statistik & Steigerung (pro Kind aufklappbar)">
          {/*
            ★ E4 (18./19.09.2026, „Meine Klassen"-Umbau): Bis dahin stand hier
            die ALTE Zeile („Werte im Überblick", „Steigerung im Verlauf" -
            beides direkt sichtbar). Johannes: „Alles, was oben in der
            Tabelle steht, gehört unten weg." Die aufgeklappte Zeile trägt
            jetzt sechs eigene, einzeln einklappbare Abschnitte; die früheren
            Werte fallen dort weg und stehen unverändert in „Meine Statistik"
            des Kindes (dieselbe Ansicht, die das Kind selbst sieht).
          */}
          <p className="m-0">
            Mit dem runden Pfeil-Knopf<span aria-hidden="true"> ▸</span> vor
            dem Namen öffnen Sie sechs einzeln einklappbare Zeilen, von oben
            nach unten: <strong>Einstellungen</strong> (die Werte aus Punkt 2,
            für dieses eine Kind), <strong>Tippchallenges</strong> (nur, wenn
            mindestens eine geschrieben wurde), <strong>Übungszeiten</strong>{" "}
            (je Woche, mit dem Wochenziel-Stand der Woche und - wurde gespielt
            - der Anzahl der Klassenmatches, dazu die Jahreskarte fürs ganze
            Schuljahr), <strong>Wacklige Tasten</strong>,{" "}
            <strong>Abzeichen</strong> und - nur bei einem auffälligen Wert -{" "}
            <strong>Eigenständigkeit</strong> (siehe Punkt 9).
          </p>
          <p className="m-0">
            {/* ★ M3 (19.09.2026): Zähler + einzelne Übungszeiten je Woche. Ohne
                Datum - seit wann gezählt wird, sagt der Hinweis am Zähler selbst
                (dieselbe Regel wie im Handbuch: keine Chronik im Text). */}
            In „Übungszeiten" steht oben, an wie vielen Klassenmatches das Kind
            teilgenommen hat (gezählt in dieser Klasse; wie weit die Zählung
            zurückreicht, sagt der Hinweis am Zähler); die Eingabetaste auf einer
            Woche öffnet deren einzelne Übungszeiten - Tag, Uhrzeit von-bis, reine
            Tippzeit und was geübt wurde.
          </p>
          <p className="m-0">
            Was hier nicht mehr einzeln steht - Werte im Überblick, Steigerung
            im Verlauf, Tasten-Stand, Geschichten &amp; Wissen - geht nicht
            verloren: Es steht vollständig in <strong>„Meine Statistik"</strong>{" "}
            des Kindes, und Sie sehen dort genau dieselbe Ansicht wie das Kind
            selbst.
          </p>
          <p className="m-0">
            <strong>Der Score:</strong> {SCORE_ERKLAERUNG_SIE}
          </p>
          {/*
            ★★★ B4 (11.09.2026): Der Score steht seit dem Umbau auch in der
            TABELLE und auf der Punktleiste der Klasse. E4 hat den Absatz
            darüber angelegt (Kind-Statistik); hier kommt dazu, was die
            Lehrkraft in der Klassenansicht davon sieht - erweitert, nicht
            gedoppelt.
          */}
          <p className="m-0">
            <strong>In der Tabelle der Klasse</strong> stehen drei Spalten
            zusammen unter der Überschrift <strong>„Üben"</strong>:
            Treffsicherheit, Anschl./Min und Score. Sie kommen alle drei aus dem
            Üben im gewählten Zeitraum, und der Score fasst die beiden anderen
            zusammen. Sie sind darum leicht getönt und von einer feinen Linie
            eingefasst; eine Sprachausgabe kündigt „Üben" vor der
            Spaltenüberschrift an. Die Spalte{" "}
            <strong>„{PRUEFUNG_WORT}"</strong> ganz rechts steht bewusst
            ausserhalb dieser Gruppe - unter der Überschrift „Prüfung": Sie ist
            eine Prüfung an einem bestimmten Tag, kein tägliches Üben.
          </p>
          <p className="m-0">
            In der Spalte <strong>„Score"</strong> gilt: Wer im gewählten
            Zeitraum weniger als 200 Zeichen geschrieben hat, bekommt keinen
            Score, sondern einen Strich - darunter entscheidet ein einzelner
            Fehlgriff über mehrere Punkte.
          </p>
          {/*
            ★ 12.09.2026: der Excel-Export der Tabelle (Johannes: „Ich brauche
            eine Exportmöglichkeit für die Leistungstabelle, in
            Klassenname_datum.xlsx"). ★ 13.09.2026 neu gestaltet: vorn eine
            Übersicht mit Links und Legende, dann Schuljahr, Gesamt, Woche
            (Johannes: „Woche ist bei der Bewertung die unwichtigste").
            ★ K4 (19.09.2026): „Monat" als viertes Blatt, direkt vor „Woche" -
            Wortlaut wie der Hinweis am Schalter (`TastenflowReiter.tsx`).
          */}
          <p className="m-0">
            <strong>„Als Excel herunterladen"</strong> steht über der Tabelle rechts
            neben „Gesamt". Der Schalter lädt die Tabelle als Datei{" "}
            <strong>Klassenname_Datum.xlsx</strong> (zum Beispiel
            „3a_2026-09-12.xlsx") herunter - egal, welcher Zeitraum gerade gewählt
            ist. Vorn steht eine Übersicht mit Links zu den vier Zeiträumen und
            einer Legende, die jede Spalte erklärt und zeigt, wie der Score
            berechnet wird. Danach folgen vier Blätter: das laufende Schuljahr,
            Gesamt, der Monat (die letzten 4 Wochen) und diese Woche. Die Werte
            stehen als Zahlen darin, damit Sie in Excel weiterrechnen können; wo
            die Tabelle einen Strich zeigt, steht auch in der Datei ein Strich.
          </p>
          {/*
            ★ K3 (19.09.2026): der Klassenüberblick steht schlank über der
            Tabelle, mit eigenem Zeitraum (Monat vorgewählt) und dem
            Liniendiagramm - die Töpfe und die Fussnote sind in Hinweise
            gewandert.
          */}
          <p className="m-0">
            <strong>Der Klassenüberblick</strong> über der Tabelle zeigt die
            Klasse als Ganzes. „Monat" (die letzten 4 Wochen) ist vorgewählt,
            „Schuljahr" steht daneben. Eine Zeile nennt Anschläge/Min,
            Treffsicherheit und Wochenaufgaben, jede mit einem kleinen Trend -
            beim Monat gegenüber den 4 Wochen davor, beim Schuljahr die ersten
            gegen die letzten Übungswochen. Den ganzen Satz dazu zeigt der
            Hinweis beim Überfahren; eine Sprachausgabe liest ihn an der Zahl
            mit, samt der Kinder, die im Zeitraum nicht geübt haben.
          </p>
          <p className="m-0">
            <strong>Die Punktleiste „Score in der Klasse"</strong> zeigt einen
            Punkt je Kind. Mit der Tabulatortaste springen Sie auf die Leiste,
            mit den Pfeiltasten von Kind zu Kind - jeder Halt wird angesagt
            („Mia, 78 Punkte"). Wie viele Kinder unter 50, zwischen 50 und 70,
            zwischen 70 und 85 und über 85 Punkten liegen und wer zu wenig
            geschrieben hat, steht im Hinweis ihrer Überschrift.
          </p>
          <p className="m-0">
            <strong>Das Liniendiagramm „Score der Klasse im Schuljahr"</strong>{" "}
            zeigt je Woche den Schnitt der Kinder mit mindestens 5 Zeilen; eine
            Lücke heißt, dass die Woche zu wenig Übung hatte. Mit der
            Tabulatortaste springen Sie auf das Diagramm, mit den Pfeiltasten
            von Woche zu Woche; für die Sprachausgabe stehen alle Wochen
            zusätzlich in einer Tabelle. Kommen Umschalttaste, Ziffern oder
            Sonderzeichen neu dazu, sinkt die Linie für kurze Zeit - das ist
            zu erwarten und kein Grund zur Sorge.
          </p>
          <p className="m-0">
            <strong>Die Kurve:</strong> {STEIGERUNG_HINWEIS_SIE}
          </p>
          <p className="m-0">
            <strong>Datentransparenz:</strong> Jedes Kind sieht unter „Meine
            Statistik" genau dieselben Werte über sich - Sie sehen nie mehr als das
            Kind selbst.
          </p>
        </Section>

        <Section title="8a · Die Werte, aus denen Sie eine Note bauen können">
          {/*
            ★★★ Johannes, 31.08.2026: „das sind Werte, auf die ein Lehrer dann
            seine Note bauen kann, nicht die App!" - und am 01.09.2026: die
            Hilfe müsse sagen, WIE gerechnet wird. Derselbe Text steht in der
            Hilfe von „Meine Klassen"; die Quelle ist
            `TastenflowZahlenHilfe.tsx`.
          */}
          <DreiWerteHilfe />
        </Section>

        {/*
          ★★★ 8b · DIE SCHREIBPROBE (09.09.2026). Auftrag Johannes: *„in der
          Klassenverwaltung »Meine Klasse« brauchen wir einen weiteren Bereich
          mit Prüfung … Gilt für die ganze Klasse … Alle texte für alle schüler
          müssen genau gleich sein!"*

          Sie steht bewusst genau hier: hinter den drei Werten, aus denen eine
          Lehrkraft eine Note baut. Das ist die Frage, mit der man in diesen
          Abschnitt kommt.

          ⚠️ Das Wort selbst kommt aus `PRUEFUNG_WORT` - es steht im ganzen
          Programm an GENAU EINER Stelle, und wer es hier abschreibt, baut die
          zweite ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
        */}
        <Section title={`8b · Die ${PRUEFUNG_WORT}: eine Prüfung für die ganze Klasse`}>
          <p className="m-0">
            Im Lehrkraft-Bereich <strong>„Meine Klassen"</strong> steht ganz
            oben in der <strong>Klassenstatistik</strong> von Tastenflow, in
            der Aufgaben-Zeile, der Schalter{" "}
            <strong>„{PRUEFUNG_WORT}"</strong>. Er öffnet das Formular, mit
            dem Sie eine Prüfung für die ganze Klasse starten -{" "}
            <strong>alle Kinder bekommen denselben Text</strong>, unabhängig
            davon, wie weit sie im Lehrgang sind.
          </p>
          <p className="m-0">
            <strong>Einzustellen sind drei Dinge:</strong> das{" "}
            <strong>Tastaturniveau</strong> (von der Grundreihe bis „Alles"),
            gleich daneben die <strong>Art</strong> und die{" "}
            <strong>Prüfungszeit</strong> in Minuten.{" "}
            <strong>„Jetzt starten"</strong> beginnt sie sofort.
          </p>
          {/*
            ★★★ 23.09.2026 („Freies Schreiben", E6, Bauplan §7): die Wahl
            zwischen den zwei Arten. Jede Zahl kommt aus
            `schreibprobeWertung.ts` (`FEHLER_GEWICHT`/`FEHLER_GEWICHT_FREI`),
            keine ist abgeschrieben.
          */}
          <p className="m-0">
            <strong>Streng</strong> (Vorgabe) ist wie bisher: Eine falsche
            Taste rückt nicht vor, jeder Fehlgriff zählt - auch ein sofort
            verbesserter. <strong>Freies Schreiben</strong> passt zu einer
            Abschrift, wie sie die Jugendlichen vom Typewriter-Test kennen:
            Fehler bleiben beim Tippen stehen und werden nicht markiert, die
            Rücktaste bessert nur in der aktuellen Zeile aus. Gewertet wird
            erst am Ende, was noch falsch dasteht - je Wort höchstens ein
            Fehler, das angefangene letzte Wort zählt nicht, und ausgebesserte
            Stellen zählen gar nicht. Weil ein stehender Fehler dabei keine
            eigene Zeit gekostet hat, wiegt er schwerer: {FEHLER_GEWICHT_FREI}{" "}
            statt {FEHLER_GEWICHT} Zeichen (8a). Wählen Sie „Freies
            Schreiben", wenn die Klasse eine Abschrift üben soll, ohne dass ein
            Fehlgriff das Weiterschreiben aufhält; „Streng" für eine Prüfung
            der Tastenwege selbst.
          </p>
          <p className="m-0">
            <strong>Drei Uhren, die man auseinanderhalten muss:</strong>
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              Der <strong>Startzeitpunkt</strong> - der Augenblick, in dem Sie
              „Jetzt starten" drücken. Ab hier darf die Klasse beginnen.
            </li>
            <li>
              Das <strong>Einstiegsfenster</strong>:{" "}
              {EINSTIEGSFENSTER_MIN} Minuten ab dem Startzeitpunkt. So lange
              kann ein Kind noch einsteigen; wer später kommt, ist zu spät.
            </li>
            <li>
              Die <strong>Prüfungszeit</strong> läuft für{" "}
              <strong>jedes Kind einzeln</strong>, und zwar erst ab seinem{" "}
              <strong>ersten Tastendruck</strong>. Zwei Kinder derselben Klasse
              hören darum zu verschiedenen Zeiten auf - das ist Absicht: Wer
              erst den Platz findet, verliert keine Prüfungszeit.
            </li>
          </ul>
          <p className="m-0">
            <strong>Die Texte:</strong> Je Niveau gibt es{" "}
            <strong>{PROBEN_JE_NIVEAU} Prüfungstexte</strong> mit jeweils
            mindestens {MIND_ZEICHEN} Zeichen - so lang, dass der Text auch bei
            hohem Tempo nie ausgeht. Sie <strong>kommen im Lehrgang nicht
            vor</strong>, kein Kind kann sie also vorher geübt haben. Die
            nächste {PRUEFUNG_WORT} eines Niveaus beginnt dort, wo das Kind
            aufgehört hat, das in der letzten am weitesten kam: an der nächsten
            Zeile, bei Texten mit Sätzen am nächsten Satzanfang. Geht ein Text
            während der {PRUEFUNG_WORT} aus, schreiben die Kinder ohne Pause im
            nächsten weiter.
          </p>
          <p className="m-0">
            <strong>Kinder mit Blindheit:</strong> Sie schreiben die{" "}
            {PRUEFUNG_WORT} mit dem <strong>Vorlesen der App</strong> (
            <Kbd>Alt</Kbd> + <Kbd>V</Kbd>) - genau wie beim Üben, ohne eigenes
            Häkchen der Lehrkraft. Die Zeit, in der ein Kind auf die Stimme
            wartet, zieht die Prüfungsuhr von selbst ab; ein Kind, das den
            Text sieht und trotzdem vorlesen lässt, bekommt dieselbe Zeit
            abgezogen.
          </p>
          <p className="m-0">
            <strong>Die Ergebnisse</strong> stehen im aufgeklappten Kasten unter
            „Vergangene {PRUEFUNG_WORT_MEHRZAHL}" - der Schalter „
            {PRUEFUNG_WORT}" vorne in der Zeile klappt ihn auf: je Kind
            Rang, <strong>Leistungswert</strong>,
            ob vorgelesen wurde, Geschwindigkeit, Treffsicherheit und die
            wackligen Tasten. Wie der Leistungswert entsteht, steht in 8a. Sobald
            die{" "}
            {PRUEFUNG_WORT} für die <strong>ganze Klasse</strong> vorbei ist,
            kommt dazu eine <strong>Sammel-Mail</strong> mit denselben Werten.
            Erst dann - eine Mail, solange noch jemand schreibt, wäre
            unvollständig, und eine zweite „diesmal wirklich alle" will niemand.
          </p>
          <p className="m-0">
            Ein Kind kann <strong>„ich schreibe nicht mit"</strong> wählen. Es
            übt dann normal weiter und steht in der Auswertung als{" "}
            <strong>„nicht angetreten"</strong>. Jedes Kind sieht seine eigenen{" "}
            {PRUEFUNG_WORT_MEHRZAHL} später unter{" "}
            <strong>„Meine Statistik"</strong> - dieselben Werte, die Sie sehen.
          </p>
        </Section>

        <Section title="9 · Eigenständigkeit / KI-Check (nur für Sie)">
          <p className="m-0">
            Die Spalte <strong>„Eigenständigkeit"</strong> zeigt einen Verdachtswert{" "}
            <strong>1-10</strong>. Hoch wird er bei Hinweisen auf nicht selbst
            Getipptes: <em>Einfügen</em> (Paste), häufiger Fenster-/Fokuswechsel,
            unplausibel hohes Tempo oder makellose Genauigkeit ohne Lernverlauf.
            Diesen Wert sehen <strong>nur Sie</strong>, nicht die Kinder.
          </p>
        </Section>

        <Section title="10 · Barrierefreiheit">
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Kontrast & Schriftgröße:</strong> über die Leiste oben (hell,
              dunkel, starker Kontrast); <Kbd>Alt</Kbd> + <Kbd>+</Kbd> /{" "}
              <Kbd>-</Kbd> vergrößert das Tippfeld.
            </li>
            <li>
              <strong>Vorlesen</strong> (Self-Voicing) mit <Kbd>Alt</Kbd> +{" "}
              <Kbd>V</Kbd> - für Kinder ohne eingerichteten Screenreader (mit
              NVDA/JAWS/VoiceOver besser aus lassen). Wählbar ist, ob{" "}
              <em>Buchstaben / Wörter / Sätze</em> vorgelesen werden, das Tempo und{" "}
              <strong>welche Stimme</strong>. Bei Sprache Englisch schaltet die App
              automatisch auf eine englische Stimme um; fehlt eine, erscheint eine
              Installationsanleitung. Die <strong>Vorlesezeit wird aus dem Tempo
              herausgerechnet</strong> - Braille-Lernende, die das Vorlesen
              brauchen, haben so keinen Nachteil bei Anschlagfrequenz und Statistik.
            </li>
            <BrailleTabellenPunkte weg="de" />
            <li>
              <strong>Finger-Ansage:</strong> die <Kbd>Umschalt</Kbd>-Taste zweimal
              kurz drücken sagt den richtigen Finger an.
            </li>
            <li>
              <strong>Fokus-Führung (22.08.2026):</strong> Jeder Schalter hat
              ein festgelegtes Ziel - wer ihn betätigt, weiß danach, wo der
              Schreibcursor steht. Das ist für Kinder, die mit Braillezeile
              arbeiten, der Unterschied zwischen Weiterarbeiten und Suchen.
              Drei Regeln daraus, die im Unterricht auffallen:{" "}
              <Kbd>Esc</Kbd> schließt jedes Fenster und führt{" "}
              <strong>immer ins Schreibfeld</strong> zurück; ein Ansichtswechsel
              (Statistik, Bücherei, Anmeldung) landet auf der{" "}
              <strong>Überschrift der neuen Ansicht</strong> und sagt sie an;
              und <strong>nichts verschwindet von selbst</strong> - auch die
              Freischalt-Feier wartet, bis das Kind „Weiter" drückt.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>E</Kbd> springt ins Schreibfeld,{" "}
              <Kbd>Alt</Kbd> + <Kbd>H</Kbd> öffnet die Hilfe.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>U</Kbd> wechselt zum Üben,{" "}
              <Kbd>Alt</Kbd> + <Kbd>S</Kbd> zu <strong>„Meine Klassen"</strong>{" "}
              (beim Üben: zur eigenen Statistik); <Kbd>Alt</Kbd> +{" "}
              <Kbd>Z</Kbd> sagt an, die wievielte Zeile gerade dran ist.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>D</Kbd> gibt die Übezeit aus - auf der
              Braillezeile und (mit Vorlesen) als Ansage.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>T</Kbd> öffnet oder schließt die{" "}
              <strong>Tastenkürzel-Liste</strong>.
            </li>
          </ul>
        </Section>

        <Section title="11 · Löschen">
          <p className="m-0">
            Einzelne Lernende oder eine ganze Klasse lassen sich endgültig
            löschen (mit Konto, Spielstand und Auswertung). Das lässt sich nicht
            rückgängig machen - es wird vorher nachgefragt.
          </p>
        </Section>

        <Section title="12 · Downloads: Handbuch und Plakat (PDF)">
          <p className="m-0">
            Alles aus dieser Hilfe, und deutlich mehr, steht im{" "}
            <strong>Handbuch für Pädagoginnen und Pädagogen</strong>: beide
            Lernwelten mit allen Lernschritten und Reihenfolgen (jede Lektion,
            die komplette Einführungs-Reihenfolge), sämtliche Geschichten und
            Wissens-Reihen mit ihren Öffnungs-Zeitpunkten, alle Abzeichen und
            Belohnungssysteme, dazu eine <strong>Checkliste „Ist meine Klasse
            startklar?"</strong> und eine <strong>Kopiervorlage für den
            Lernstand je Kind</strong>.
          </p>
          {/* Nur für Lehrkräfte - diese Hilfe sehen nur sie (Johannes
              30.08.2026: aus der Kinder-Hilfe ist der Download verschwunden).
              Das PDF liegt in pb_geschuetzt/handbuecher/ hinter dem
              Datei-Ausweis - der Knopf holt ihn sich vor dem Laden SELBST:
              Der Hintergrund-Effekt der Tastenflow-Seite läuft nicht überall,
              wo diese Hilfe geöffnet wird, und ohne Ausweis antwortete der
              Server mit 404 (Befund Johannes am selben Abend). */}
          <HandbuchLaden />
          <p className="m-0 text-sm text-ink-muted">
            Das Heft wird direkt aus den Inhalten der App erzeugt - ein Wächter
            im Quellcode erzwingt, dass es bei jeder inhaltlichen Änderung
            aktualisiert wird. Es ist damit immer vollständig und aktuell.
          </p>
          <p className="m-0">
            Für die Wand im Klassenzimmer oder im Lehrerzimmer gibt es das{" "}
            <strong>Tastenflow-Plakat zum Aufhängen in der Schule</strong>: A3
            hochkant, zum Ausdrucken - auf einen Blick, was Tastenflow kann,
            dazu ein QR-Code zu tastenflow.org. Anders als das Handbuch ist das
            Plakat für alle frei, auch ohne Anmeldung: Die Kinder finden es in
            ihrer Hilfe, und Sie können die Adresse tastenflow.org/tastenflow-plakat.pdf
            an jede Schule und Einrichtung weitergeben. Eine englische Ausgabe
            liegt unter tastenflow.org/tastenflow-plakat-en.pdf.
          </p>
          <PlakatLaden />
          <p className="m-0 text-sm text-ink-muted">
            Beides liegt auch in „Meine Klassen" unter „Downloads".
          </p>
        </Section>
      </div>
    </div>
  );
}
