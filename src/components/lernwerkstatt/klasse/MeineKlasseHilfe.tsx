/**
 * Hilfe für den Bereich „Meine Klassen" (T3, 01.09.2026 - neu geschrieben am
 * 10.09.2026).
 *
 * ── Warum neu ──────────────────────────────────────────────────────────────
 * Johannes, 10.09.2026: *„in der Lehrer-Hilfeseite fehlt die Tippchallenge
 * völlig"* - und *„gehört auch bei Note dazu"*. Dazu beschrieb diese Hilfe noch
 * den Aufbau von vor dem 09.09.: Reiter „Überblick" und „Klasse & Konten", die
 * es beide nicht mehr gibt. Sie folgt jetzt der Seite, wie sie ist: im
 * Klassenkopf der Umschalter „Lernstand | Kinder und Zugänge" (seit E2,
 * 18.09.2026 - bis dahin ein Knopf „Meine Klassen verwalten" oben in der
 * Kopfzeile), darunter die Klasse mit den Programmen und die Bereiche.
 *
 * ── Was hier steht ─────────────────────────────────────────────────────────
 * Was ALLEN Lernprogrammen gehört (Kopf, Verwalten, Klassencode),
 * steht immer. Was nur Tastenflow betrifft (Tippchallenge, Vorlesen bei
 * Prüfungen, die Spalten, die Werte für die Note), steht nur, wenn Tastenflow
 * offen ist - eine Tastenflow-Rechnung in der Hilfe von Punktgenau wäre eine
 * falsche Auskunft.
 *
 * ⚠️ Die Erklärung der Zahlen steht in `TastenflowZahlenHilfe.tsx` und wird von
 * der Programm-Hilfe (`LehrerHilfe`) genauso benutzt. Zweimal geschrieben liefe
 * sie beim ersten Zahlen-Umbau auseinander.
 *
 * ★ D1/D4 (Umbau 11.09.2026): Der Kasten „Kinder mit Blindheit …" (das
 * Häkchen „Vorlesen bei Prüfungen erlaubt") ist WEG - Johannes: „schaff das
 * Häkchen ab, es verwirrt nur." Die App liest in der Tippchallenge vor, wenn
 * das Kind sein eigenes Vorlesen eingeschaltet hat, genau wie beim Üben. Der
 * Unterreiter „Tippchallenge" ist ebenfalls WEG - das Formular steht jetzt
 * ganz oben in der Klassenstatistik selbst.
 *
 * Sprache: „Sie" (Lehrkraft-Oberfläche, [[feedback_du_ansprache]]), Person
 * zuerst, nur Tastenwege - keine Maus.
 */
import { Modal } from "@/components/Modal";
import { FilmeListe } from "@/components/FilmKnopf";
import { RundgangMeineKlassenKnopf } from "@/components/typing/Rundgang"; // ★ Z4 (19.09.2026)
import {
  DreiWerteHilfe,
  LeistungsstufeHilfe,
  SpaltenHilfe,
} from "@/components/typing/TastenflowZahlenHilfe";
import {
  EINSTIEGSFENSTER_MIN,
  PRUEFUNG_WORT,
  PRUEFUNG_WORT_MEHRZAHL,
} from "@/lib/typing/schreibprobe";
import { useBedienSprache, waehleUebersetzung } from "@/lib/bedienSprache";
import { MeineKlasseHilfeEnglisch } from "./MeineKlasseHilfe.en";
import { MeineKlasseHilfeFranzoesisch } from "./MeineKlasseHilfe.fr";
import { MeineKlasseHilfeSpanisch } from "./MeineKlasseHilfe.es";
import { MeineKlasseHilfeItalienisch } from "./MeineKlasseHilfe.it";
import { MeineKlasseHilfePolnisch } from "./MeineKlasseHilfe.pl";
import { MeineKlasseHilfeTuerkisch } from "./MeineKlasseHilfe.tr";
import { MeineKlasseHilfeTschechisch } from "./MeineKlasseHilfe.cs";
import { MeineKlasseHilfeBulgarisch } from "./MeineKlasseHilfe.bg"; // ★ O-BG (29.10.2026)
import { MeineKlasseHilfeNiederlaendisch } from "./MeineKlasseHilfe.nl"; // ★ O-NL (25.10.2026)
// ★ O-PT (25.10.2026): portugiesisch (Portugal, `MeineKlasseHilfe.pt.tsx`).
import { MeineKlasseHilfePortugiesisch } from "./MeineKlasseHilfe.pt";
import { MeineKlasseHilfeSchwedisch } from "./MeineKlasseHilfe.sv"; // ★ O-SV (25.10.2026)
import { MeineKlasseHilfeUkrainisch } from "./MeineKlasseHilfe.uk"; // ★ O-UK (25.10.2026)
// ★ O-EL (25.10.2026): griechisch.
import { MeineKlasseHilfeGriechisch } from "./MeineKlasseHilfe.el";
// ★ O-BR (25.10.2026): portugiesisch (Brasilien), `MeineKlasseHilfe.br.tsx`.
import { MeineKlasseHilfeBrasilianisch } from "./MeineKlasseHilfe.br";
// ★ O-HU (25.10.2026): ungarisch (`MeineKlasseHilfe.hu.tsx`).
import { MeineKlasseHilfeUngarisch } from "./MeineKlasseHilfe.hu";
import { MeineKlasseHilfeRumaenisch } from "./MeineKlasseHilfe.ro"; // ★ O-RO (25.10.2026)

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

/**
 * ★★ EN6b (19.09.2026): Die Hilfe spricht die Bedienungssprache. Die englische
 * Fassung steht als eigene Datei daneben (`MeineKlasseHilfe.en.tsx`) - dasselbe
 * Muster wie `TippenHilfe` (EN7): So bleibt die deutsche Fassung unten Zeichen
 * für Zeichen, wie sie war. ⚠️ GEMEINSAMER TEIL: Ohne aktiven Sprach-Anbieter
 * (Punktgenau, Klangpunkte, »im Griff«) liefert `useBedienSprache` immer
 * „de".
 *
 * ★ E11b (26.09.2026): seit heute auch französisch (`MeineKlasseHilfe.fr.tsx`),
 * über `spracheGewaehlt` und `waehleUebersetzung` statt einer weiteren
 * einer Ternäre, die eigens gegen „en" prüft - siehe Kopf-Doku in `TippenHilfe.tsx` und
 * `src/lib/bedienSprache/uebersetzungsWahl.ts`.
 */
export function MeineKlasseHilfe(props: { onClose: () => void; programmName?: string }) {
  const { spracheGewaehlt } = useBedienSprache();
  const uebersetzung = waehleUebersetzung(spracheGewaehlt, {
    en: <MeineKlasseHilfeEnglisch {...props} />,
    fr: <MeineKlasseHilfeFranzoesisch {...props} />,
    // ★ ES-O (27.09.2026): spanisch (`MeineKlasseHilfe.es.tsx`) - vorher Deutsch.
    es: <MeineKlasseHilfeSpanisch {...props} />,
    // ★ O-IT (02.10.2026): italienisch (`MeineKlasseHilfe.it.tsx`).
    it: <MeineKlasseHilfeItalienisch {...props} />,
    // ★ O-PL (02.10.2026): polnisch (`MeineKlasseHilfe.pl.tsx`).
    pl: <MeineKlasseHilfePolnisch {...props} />,
    // ★ O-TR (02.10.2026): türkisch (`MeineKlasseHilfe.tr.tsx`).
    tr: <MeineKlasseHilfeTuerkisch {...props} />,
    // ★ O-CS (03.10.2026): tschechisch (`MeineKlasseHilfe.cs.tsx`).
    cs: <MeineKlasseHilfeTschechisch {...props} />,
    bg: <MeineKlasseHilfeBulgarisch {...props} />, // ★ O-BG (29.10.2026): `MeineKlasseHilfe.bg.tsx`
    // ★ O-NL (25.10.2026): niederländisch (`MeineKlasseHilfe.nl.tsx`).
    nl: <MeineKlasseHilfeNiederlaendisch {...props} />,
    // ★ O-PT (25.10.2026): portugiesisch (Portugal, `MeineKlasseHilfe.pt.tsx`).
    pt: <MeineKlasseHilfePortugiesisch {...props} />,
    // ★ O-SV (25.10.2026): schwedisch (`MeineKlasseHilfe.sv.tsx`).
    sv: <MeineKlasseHilfeSchwedisch {...props} />,
    // ★ O-UK (25.10.2026): ukrainisch (`MeineKlasseHilfe.uk.tsx`).
    uk: <MeineKlasseHilfeUkrainisch {...props} />,
    // ★ O-EL (25.10.2026): griechisch (`MeineKlasseHilfe.el.tsx`).
    el: <MeineKlasseHilfeGriechisch {...props} />,
    // ★ O-BR (25.10.2026): portugiesisch (Brasilien, `MeineKlasseHilfe.br.tsx`).
    br: <MeineKlasseHilfeBrasilianisch {...props} />,
    // ★ O-HU (25.10.2026): ungarisch (`MeineKlasseHilfe.hu.tsx`).
    hu: <MeineKlasseHilfeUngarisch {...props} />,
    ro: <MeineKlasseHilfeRumaenisch {...props} />, // ★ O-RO (25.10.2026)
  });
  return uebersetzung ?? <MeineKlasseHilfeDeutsch {...props} />;
}

function MeineKlasseHilfeDeutsch({
  onClose,
  programmName,
}: {
  onClose: () => void;
  /** Das offene Programm - davon hängt ab, welche Abschnitte dastehen. */
  programmName?: string;
}) {
  const tastenflow = programmName === "Tastenflow";
  return (
    <Modal title="Hilfe zu „Meine Klassen&quot;" onClose={onClose} size="lg">
      <div className="space-y-5">
        <RundgangMeineKlassenKnopf onStart={onClose} programmName={programmName} />
        <p className="m-0 text-sm leading-relaxed text-ink">
          Hier arbeiten Sie mit Ihrer Klasse. Klassen und Konten legen Sie{" "}
          <strong>einmal</strong> an - sie gelten in jedem Lernprogramm, mit
          demselben Klassencode und demselben Passwort.
          {tastenflow && (
            <>
              {" "}
              Wer als Lehrkraft Tastenflow öffnet, landet immer hier. Ins eigene
              Üben führt „Selbst üben" (<Taste>Alt</Taste> + <Taste>U</Taste>).
            </>
          )}
        </p>

        <Abschnitt titel="So ist die Seite aufgebaut">
          <p className="m-0">
            <strong>Im Kopf der Klasse</strong> stehen ihr Name - bei mehreren
            Klassen in der Auswahlliste „Klasse", mit der Sie die Klasse
            wechseln -, die Zahl der Kinder und der Klassencode. Rechts in dieser Zeile,
            vor „Downloads", steht der Umschalter <strong>„Lernstand | Kinder und Zugänge"</strong>{" "}
            - an derselben Stelle auf beiden Bildschirmen, in die er führt.
          </p>
          <p className="m-0">
            Unter <strong>„Kinder und Zugänge"</strong> legen Sie eine neue
            Klasse an, legen Kinder an und verschieben sie, sehen Passwörter
            und Zugangsdaten, Klassencode und welche Programme die Klasse hat.
            {/* ★ 12.09.2026: der Excel-Import (Auftrag Johannes); Wortlaut
                „Teilnehmer" statt „Kinder" seit 14.09.2026. */} Viele
            Teilnehmer auf einmal legen Sie dort unter „Lernende" mit{" "}
            <strong>„Teilnehmer aus Excel importieren"</strong> an: Zuerst
            „Vorlage herunterladen (Excel)", je Teilnehmer eine Zeile mit
            Name, Passwort und - für Tastenflow - womit es anfängt. Ein
            leeres Passwort erzeugt das Programm; eine Vorschau zeigt, was
            übernommen wird, und alle importierten Kinder stehen danach unter
            „Zugangsdaten drucken". Mit{" "}
            <strong>„Teilnehmerliste herunterladen"</strong> daneben laden
            Sie jederzeit eine Word-Datei mit Name, Passwort und Klassencode
            ALLER Lernenden dieser Klasse herunter - zum Ausdrucken.
            {/* ★ 11.09.2026 (Nacht): „Nachricht an die Klasse" steht nur noch in
                der Klassen-Karte von Tastenflow (Satz weiter unten) - sonst in
                der Verwaltung. */}
            {!tastenflow && (
              <>
                {" "}
                Eine Nachricht an alle Kinder schreiben Sie dort mit „Nachricht
                an die Klasse".
              </>
            )}
          </p>
          <p className="m-0">
            Unter <strong>„Lernstand"</strong> - dort landen Sie, wenn Sie die
            Seite öffnen - stehen die Lernprogramme dieser Klasse, „Downloads"
            und darunter die Klassenstatistik: wie weit jedes Kind ist.
            {tastenflow && (
              <>
                {" "}
                Ganz oben darin steht eine Zeile mit Schaltern:{" "}
                <strong>{PRUEFUNG_WORT}</strong>, <strong>Eigene Übung</strong>,{" "}
                <strong>Wochenziel</strong>,{" "}
                <strong>Einstellungen der Klasse</strong> und{" "}
                <strong>Eine Stunde sperren</strong>. Jeder Schalter öffnet
                seinen eigenen Bereich darunter - immer nur einer auf einmal,
                mit <Taste>Esc</Taste> wieder zu. „{PRUEFUNG_WORT}" öffnet das
                Formular mit „Niveau", „Min" und „Jetzt starten" sowie die
                vergangenen {PRUEFUNG_WORT_MEHRZAHL}; „Eigene Übung" legt einen
                Text für die ganze Klasse fest (Datei hochladen, aus „Meine
                Texte" oder eine Vorlage aus dem Lehrgang - die Kinder bekommen
                dafür ein Fenster mit nur „Weiter"); „Wochenziel" stellt
                Minuten pro Woche ein; „Eine Stunde sperren" setzt 60 Minuten,
                in denen weiter geübt wird, aber nichts fürs Wochenziel zählt.
                Darunter der „Klassenüberblick" (Monat oder Schuljahr, mit
                Score-Leiste und Liniendiagramm); rechts in seiner Kopfzeile
                steht „Nachricht an die Klasse" - eine Nachricht an alle
                Kinder, jedes bekommt sie in einem eigenen Gespräch.
              </>
            )}
          </p>
          {/*
            ★ B8/B4 (11.09.2026): Der neue Kasten gehört in diese Wegbeschreibung
            - sonst sucht eine Lehrkraft die Textstufe weiter je Kind.
          */}
          {tastenflow && (
            <p className="m-0">
              Der Schalter <strong>„Einstellungen der Klasse"</strong> in der
              Zeile öffnet:
              Schulstufe (daraus rechnet die App die Textsorten und zählt jedes
              Schuljahr weiter; „Erwachsen" zählt nicht weiter), Sprache samt
              Sperre, das Startniveau der Klasse (es gilt auch für Kinder, die
              später dazukommen) und das Klassenmatch. Diese vier gelten für die
              ganze Klasse und werden schon beim Anlegen einer Klasse abgefragt;
              je Kind bleiben „Womit anfangen?", „Einhand schreiben" und „Tempo
              zählt nicht" in seiner aufgeklappten Zeile.
            </p>
          )}
          {tastenflow && (
            <p className="m-0">
              Die Stufen bei <strong>„Womit anfangen?"</strong> sind nach
              Tasten benannt: „Anfänger" ist nur F und J, „Grundstellung" die
              ganze Grundreihe (f j d k s l a ö). Bei <strong>„Erste
              Buchstaben + Großschreibung"</strong> kommen die fünf
              häufigsten weiteren Buchstaben dazu - e n i r t - sowie die
              Umschalttaste. „Alle Buchstaben", „+ Satzzeichen", „+ Zahlen"
              und „Alles" schalten danach der Reihe nach den Rest frei.
            </p>
          )}
          <p className="m-0">
            Jeder Schalter erklärt sich: Der Hinweis erscheint, sobald der Zeiger
            darauf steht oder der Fokus mit der Tabtaste hinkommt.{" "}
            <Taste>Esc</Taste> schickt ihn weg.
          </p>
        </Abschnitt>

        {tastenflow && (
          <Abschnitt titel={`Die ${PRUEFUNG_WORT} Schritt für Schritt`}>
            <ol className="m-0 list-decimal space-y-1 pl-5">
              <li>
                Ganz oben in der Klassenstatistik, in der Aufgaben-Zeile,
                öffnet der Schalter „{PRUEFUNG_WORT}" das Formular.
              </li>
              <li>
                <strong>Tastaturniveau</strong> wählen - alle Kinder bekommen
                denselben Text auf diesem Niveau.
              </li>
              <li>
                <strong>Prüfungszeit</strong> in Minuten eintragen - das Feld
                steht gleich neben dem Niveau.
              </li>
              <li>
                Den Kindern sagen: <em>Die Zeit läuft ab deinem ersten
                Tastendruck.</em> Ab dem Start haben sie{" "}
                {EINSTIEGSFENSTER_MIN} Minuten, um zu beginnen; die Prüfungszeit
                läuft für jedes Kind einzeln.
              </li>
              <li>
                <strong>„Jetzt starten"</strong> - die {PRUEFUNG_WORT} beginnt
                sofort für die ganze Klasse.
              </li>
              <li>
                Gleich danach steht dort zum Beispiel{" "}
                <strong>„Bereit: 12 von 14 - noch nicht: Said, Jano"</strong>:
                Bei 12 Kindern ist die {PRUEFUNG_WORT} schon auf dem Gerät
                angekommen. Sie erscheint dort nach etwa einer Sekunde. Steht ein
                Kind länger unter „noch nicht", hilft es meist, die Seite einmal
                neu zu laden.
              </li>
              <li>
                Solange sie läuft, sehen Sie „Abgegeben: 3 von 18" mit den Namen.
              </li>
              <li>
                Danach stehen die Ergebnisse unter dem Formular: je Kind Rang,{" "}
                <strong>Leistungswert</strong>, ob vorgelesen wurde, Anschläge je
                Minute, Treffsicherheit, Zeichen, Fehler und wacklige Tasten.
                Dazu kommt eine Sammel-Mail.
              </li>
            </ol>
          </Abschnitt>
        )}

        {tastenflow && (
          <>
            <Abschnitt titel="Was die Spalten der Tabelle bedeuten">
              <SpaltenHilfe />
            </Abschnitt>

            <Abschnitt titel="Was die Leistungsstufe bedeutet">
              <LeistungsstufeHilfe />
            </Abschnitt>

            <Abschnitt titel="Die Werte, aus denen Sie eine Note bauen können">
              <DreiWerteHilfe />
            </Abschnitt>
          </>
        )}

        <Abschnitt titel="Der Klassencode">
          <p className="m-0">
            Er steht oben neben dem Klassennamen und gilt für alle Programme. Wer
            sich anmeldet, gibt Klassencode, Namen und Passwort ein; das Gerät
            merkt sich den Code, danach genügen Name und Passwort.
          </p>
          <p className="m-0">
            Beim Anlegen einer Klasse ist er <strong>Pflicht</strong>. Während
            Sie den Namen tippen, schlägt das Programm einen passenden Code vor -
            aus „MS-Wein" wird „MSWEIN". Sie können ihn ändern, aber nicht leer
            lassen. Ändern lässt er sich später unter „Kinder und Zugänge" mit
            „Bearbeiten".
          </p>
          <p className="m-0">
            ⚠️ Ändern Sie den Code, melden sich alle Kinder der Klasse ab dann mit
            dem neuen an.
          </p>
        </Abschnitt>

        <Abschnitt titel="Ein Kind in eine andere Klasse verschieben">
          <p className="m-0">
            Unter „Kinder und Zugänge" steht bei jedem Kind{" "}
            <strong>„In andere Klasse verschieben"</strong>. Es öffnet das Feld
            „Klassencode der neuen Klasse". Das geht in jede Klasse, deren
            Klassencode Sie kennen - auch in die Klasse einer anderen Lehrkraft.
            Vor dem Verschieben fragt das Programm noch einmal nach.
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>Das Kind meldet sich danach mit dem neuen Klassencode an.</li>
            <li>
              Die Lehrkräfte der neuen Klasse sehen das Kind und seinen
              Lernstand.
            </li>
            <li>
              {/* Die Tippchallenge nur, wenn Tastenflow offen ist - in der
                  Hilfe eines anderen Programms wäre sie eine falsche Auskunft
                  (Dateikopf). */}
              {tastenflow
                ? `Die Ergebnisse der ${PRUEFUNG_WORT_MEHRZAHL} und die Nachrichten bleiben bei der bisherigen Klasse.`
                : "Die Nachrichten bleiben bei der bisherigen Klasse."}
            </li>
          </ul>
        </Abschnitt>

        {/* ★ Filme gibt es nur für Tastenflow und Lexami - bei anderen Programmen kein Abschnitt
            (Wächter tests/tastenflow-zahlen-hilfe.test.tsx, gefunden 18.11.2026). */}
        {(programmName === "Tastenflow" || programmName === "Lexami") && (
          <Abschnitt titel="Filme">
            <p className="m-0">
              Kurze Filme zeigen die wichtigsten Schritte. Jeder hat Untertitel,
              eine Hörfassung und den Text zum Nachlesen.
            </p>
            <FilmeListe app={programmName === "Lexami" ? "lexami" : "tastenflow"} fuer="lehrkraft" />
          </Abschnitt>
        )}

        <Abschnitt titel="Tastenwege in diesem Bereich">
          <p className="m-0">
            <Taste>Alt</Taste> + <Taste>H</Taste> öffnet und schließt diese
            Hilfe. <Taste>Alt</Taste> + <Taste>T</Taste> zeigt die Liste aller
            Tastenwege. <Taste>Alt</Taste> + <Taste>U</Taste> führt zum eigenen
            Üben. <Taste>Alt</Taste> + <Taste>N</Taste> öffnet die Nachrichten,{" "}
            <Taste>Alt</Taste> + <Taste>K</Taste> den Farbschalter und{" "}
            <Taste>Alt</Taste> + <Taste>J</Taste> das Konto-Menü.
          </p>
          <p className="m-0">
            Mit der Tabtaste gehen Sie durch die Reiter; die Eingabetaste
            wechselt. Nach einem Wechsel steht der Lesepunkt im neuen Bereich -
            eine Sprachausgabe liest ihn von dort aus weiter.
          </p>
        </Abschnitt>

        <Abschnitt titel="Noch ausführlicher">
          <p className="m-0">
            Das Handbuch für Lehrkräfte öffnen Sie oben über „Downloads" - dort
            liegt auch das Tastenflow-Plakat zum Ausdrucken und Aufhängen (A3),
            das es für alle gibt, auch ohne Anmeldung.
            {tastenflow && (
              <>
                {" "}
                Die Hilfe im Programm selbst erreichen Sie dort mit{" "}
                <Taste>Alt</Taste> + <Taste>H</Taste>.
              </>
            )}
          </p>
        </Abschnitt>
      </div>
    </Modal>
  );
}
