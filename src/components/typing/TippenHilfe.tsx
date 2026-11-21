/**
 * Hilfe-Fenster für Lernende von „Tastenflow" — in einfacher Sprache und
 * ALTERSGERECHT abgestuft (Wunsch #5):
 *   • kids (7-10 Jahre): ganz kurz, nur das Wichtigste (losschreiben, Sterne,
 *     Übezeit, die wichtigsten Tasten) in Kindersprache.
 *   • teens (11-15): deutlich mehr Details zum Programm und zum Lernsystem.
 *   • Erwachsene: vollständige Erklärung, sachlich - seit 19.09.2026 per Du
 *     wie alle Lernenden (Johannes: „Schüler und Selbstlernende mit du", auch
 *     ab 16). Die Sie-Fassung bleibt im Text stehen, gilt aber nur, wo
 *     `isFormal` sie verlangt - und eine Lehrkraft bekommt ohnehin die
 *     LehrerHilfe.
 *
 * Erklärt ausdrücklich auch die DREI verschiedenen „Stufen", die leicht
 * verwechselt werden — vor allem die Spielstufe (der Ring mit der Zahl oben
 * rechts). Die Lehrer-Hilfe steckt in LehrerHilfe.tsx. Siehe
 * [[project_zehnfinger_trainer]].
 */
import { JawsRueckweg } from "./ScreenreaderHinweis";
import { useRef } from "react";
import {
  EINSTIEGSFENSTER_MIN,
  LESSONS,
  LETTER_ORDER,
  PRUEFUNG_WORT,
  PRUEFUNG_WORT_MEHRZAHL,
  SCORE_ERKLAERUNG,
  STEIGERUNG_HINWEIS,
  activeLayout,
  copyFor,
  isFormal,
  onlyExistingKeys,
  skinForStufe,
  unitGlyph,
  unitLabel,
  usesMascots,
} from "@/lib/typing";
import { OHNE_KLASSE_HILFE } from "@/components/lernwerkstatt/SchuelerAnmeldung";
import { downloadAdresse, groesse, tastenflowPlakat } from "@/lib/lernwerkstatt/handbuecher";
import { useFocusTrap } from "./useFocusTrap";
import { Zeichenerklaerung } from "@/lib/arbeitsblatt/Zeichenerklaerung";
import { useBedienSprache, waehleUebersetzung } from "@/lib/bedienSprache";
import { AltText, Kbd, Section, detailFor, type TippenHilfeProps } from "./TippenHilfeTeile";
import { AltOderWahl, WeitereTasten } from "./TippenHilfeTasten";
import { useAnrede } from "./useAnrede";
import { TippenHilfeEnglisch } from "./TippenHilfe.en";
import { TippenHilfeFranzoesisch } from "./TippenHilfe.fr";
import { TippenHilfeSpanisch } from "./TippenHilfe.es";
import { TippenHilfeItalienisch } from "./TippenHilfe.it";
import { TippenHilfePolnisch } from "./TippenHilfe.pl";
import { TippenHilfeTuerkisch } from "./TippenHilfe.tr";
import { TippenHilfeTschechisch } from "./TippenHilfe.cs";
import { TippenHilfeBulgarisch } from "./TippenHilfe.bg"; // ★ O-BG (25.10.2026)
import { TippenHilfeNiederlaendisch } from "./TippenHilfe.nl"; // ★ O-NL (25.10.2026)
// ★ O-PT (25.10.2026): portugiesisch (Portugal, `TippenHilfe.pt.tsx`).
import { TippenHilfePortugiesisch } from "./TippenHilfe.pt";
import { TippenHilfeSchwedisch } from "./TippenHilfe.sv"; // ★ O-SV (25.10.2026)
import { TippenHilfeUkrainisch } from "./TippenHilfe.uk"; // ★ O-UK (25.10.2026)
// ★ O-EL (25.10.2026): griechisch.
import { TippenHilfeGriechisch } from "./TippenHilfe.el";
// ★ O-BR (25.10.2026): portugiesisch (Brasilien), `TippenHilfe.br.tsx`.
import { TippenHilfeBrasilianisch } from "./TippenHilfe.br";
// ★ O-HU (25.10.2026): ungarisch (`TippenHilfe.hu.tsx`).
import { TippenHilfeUngarisch } from "./TippenHilfe.hu";
import { TippenHilfeRumaenisch } from "./TippenHilfe.ro"; // ★ O-RO (25.10.2026)
// ★ Z4 (19.09.2026): „Rundgang noch einmal" - der Rundgang beim ersten Betreten.
import { RundgangNochmalKnopf } from "./Rundgang";
import { FilmeListe } from "@/components/FilmKnopf";
import { hoehleHatWesen } from "@/lib/typing/expedition/texts";

/**
 * ★★ EN7 (19.09.2026): Die Hilfe spricht die Bedienungssprache. Die englische
 * Fassung steht als eigene Datei daneben (`TippenHilfe.en.tsx`) - dasselbe
 * Muster wie die Rechtstexte (EN8): Eine Hilfe ist Fliesstext mit Tasten,
 * Hervorhebungen und drei Tonlagen; in eine Texttabelle zerlegt, stünden
 * hundert Schlüssel zwischen den Absätzen, und jeder zerteilte Satz änderte
 * die Textknoten der DEUTSCHEN Hilfe. So bleibt die deutsche Fassung unten
 * unberührt. ⚠️ Ohne aktiven Sprach-Anbieter liefert `useBedienSprache` immer „de".
 *
 * Zwei Bauteile statt einer Weiche mitten im Rumpf: Wer die Sprache wechselt,
 * bekommt ein anderes Bauteil - die Haken (Fokus-Falle) hängen je Fassung
 * sauber an ihrem eigenen Fenster.
 *
 * ★ E11b (26.09.2026): seit heute auch französisch (`TippenHilfe.fr.tsx`),
 * über die WIRKLICHE Sprachwahl `spracheGewaehlt` (nicht die oberflächen-
 * sichere `sprache`, die „fr" weiterhin auf „en" abbildet) und die Tabelle
 * `waehleUebersetzung` statt einer weiteren Ternäre, die eigens gegen „en" prüft (Bauplan
 * §2.3, Auftrag E11b Punkt 2). Siehe `src/lib/bedienSprache/uebersetzungsWahl.ts`.
 */
export function TippenHilfe(props: TippenHilfeProps) {
  const { spracheGewaehlt } = useBedienSprache();
  const uebersetzung = waehleUebersetzung(spracheGewaehlt, {
    en: <TippenHilfeEnglisch {...props} />,
    fr: <TippenHilfeFranzoesisch {...props} />,
    // ★ ES-O (27.09.2026): spanisch (`TippenHilfe.es.tsx`) - vorher Deutsch.
    es: <TippenHilfeSpanisch {...props} />,
    // ★ O-IT (02.10.2026): italienisch (`TippenHilfe.it.tsx`).
    it: <TippenHilfeItalienisch {...props} />,
    // ★ O-PL (02.10.2026): polnisch (`TippenHilfe.pl.tsx`).
    pl: <TippenHilfePolnisch {...props} />,
    // ★ O-TR (02.10.2026): türkisch (`TippenHilfe.tr.tsx`).
    tr: <TippenHilfeTuerkisch {...props} />,
    // ★ O-CS (03.10.2026): tschechisch (`TippenHilfe.cs.tsx`).
    cs: <TippenHilfeTschechisch {...props} />,
    bg: <TippenHilfeBulgarisch {...props} />, // ★ O-BG (25.10.2026): `TippenHilfe.bg.tsx`
    // ★ O-NL (25.10.2026): niederländisch (`TippenHilfe.nl.tsx`).
    nl: <TippenHilfeNiederlaendisch {...props} />,
    // ★ O-PT (25.10.2026): portugiesisch (Portugal, `TippenHilfe.pt.tsx`).
    pt: <TippenHilfePortugiesisch {...props} />,
    // ★ O-SV (25.10.2026): schwedisch (`TippenHilfe.sv.tsx`).
    sv: <TippenHilfeSchwedisch {...props} />,
    // ★ O-UK (25.10.2026): ukrainisch (`TippenHilfe.uk.tsx`).
    uk: <TippenHilfeUkrainisch {...props} />,
    // ★ O-EL (25.10.2026): griechisch (`TippenHilfe.el.tsx`).
    el: <TippenHilfeGriechisch {...props} />,
    // ★ O-BR (25.10.2026): portugiesisch (Brasilien, `TippenHilfe.br.tsx`).
    br: <TippenHilfeBrasilianisch {...props} />,
    // ★ O-HU (25.10.2026): ungarisch (`TippenHilfe.hu.tsx`).
    hu: <TippenHilfeUngarisch {...props} />,
    ro: <TippenHilfeRumaenisch {...props} />, // ★ O-RO (25.10.2026)
  });
  return uebersetzung ?? <TippenHilfeDeutsch {...props} />;
}

function TippenHilfeDeutsch({ open, onClose, stufe, lernweg = "de" }: TippenHilfeProps) {
  // ★ E2: Die Buchstaben-Reihenfolge der deutschen Hilfe hängt nicht am Weg - sie
  // zeigt unverändert `LETTER_ORDER`.
  // ★ 28.09.2026: `lernweg` entscheidet aber über die Echo-Höhle: das Höhlenwesen
  // (deutsche Aufnahmen) gibt es nur auf Weg „de" (`hoehleHatWesen`).
  const hoehleMitWesen = hoehleHatWesen(lernweg);
  const closeRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  // Fokus beim Öffnen in den Dialog (Schließen-Knopf) und Tab darin halten. Der
  // Fokus nach dem Schließen geht über die Seite zurück ins Tippfeld (closeHelp).
  useFocusTrap(open, cardRef, { initialFocus: closeRef });
  // ★ Die Anrede (19.09.2026) - aus der EINEN Regel, nicht aus dem Alter.
  const anrede = useAnrede();
  if (!open) return null;

  const skin = skinForStufe(stufe);
  // `isAdult` ist der TON (Abschnitte, Spiel), `sie` die ANREDE - zwei Achsen.
  const isAdult = skin === "erwachsen";
  const sie = isFormal(skin, anrede);
  // Ruhige Fassung anrede-freier Passagen für alle außer dem Kinder-Profil
  // (jugend, erwachsen). Maskottchen-Namen laufen getrennt über `usesMascots`.
  const sober = skin !== "kind";
  const detail = detailFor(stufe);
  // Nur Buchstaben, die es auf der eingestellten Tastatur gibt (auf englischen
  // Tastaturen also ohne ä ö ü ß) — sonst verspricht die Hilfe Tasten, die fehlen.
  const letters = onlyExistingKeys(LETTER_ORDER);
  const layout = activeLayout();
  const du = sie ? "Sie" : "du";
  const dein = sie ? "Ihr" : "dein";
  const tippe = sie ? "Tippen Sie" : "Tippe";
  const kannst = sie ? "können Sie" : "kannst du";
  // Ring-Beschriftung und Punkte-Einheit kommen aus dem Profil (skin.ts:
  // „Spielstufe"/XP für Kinder, „Übungsstufe" für jugend + erwachsen) — die
  // Hilfe muss dieselben Bezeichnungen nutzen wie die Oberfläche.
  const ringLabel = copyFor(stufe).progressLabel;
  const xpLabel = copyFor(stufe).xpUnit;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Hilfe zu Tastenflow"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        className="card my-8 w-full max-w-2xl space-y-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          {/* ★ E7 (11.09.2026): `text-xl` statt `text-2xl`. */}
          <h2 className="m-0 text-xl font-semibold text-ink">
            Hilfe - so geht „Tastenflow"
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

        {/* ★ Z4: der Rundgang durch die Übungsseite, noch einmal (schliesst die Hilfe). */}
        <RundgangNochmalKnopf onStart={onClose} />

        <Section title="Filme">
          <FilmeListe app="tastenflow" fuer="lernende" />
        </Section>

        {/* 1) Sofort losschreiben — für alle */}
        <Section title="Einfach losschreiben">
          <p className="m-0">
            {du === "Sie" ? "Sie müssen" : "Du musst"} das Feld nicht erst auswählen.{" "}
            {tippe} einfach los - der erste Buchstabe landet schon im Feld.{" "}
            {du === "Sie" ? "Sind Sie" : "Bist du"} mal woanders,{" "}
            {du === "Sie" ? "kommen Sie" : "kommst du"} mit <Kbd>Alt</Kbd> +{" "}
            <Kbd>E</Kbd> sofort zurück ins Schreibfeld.
          </p>
          <JawsRueckweg weg="de" />
          {detail === 1 && (
            <p className="m-0">
              Tippe immer mit dem richtigen Finger - die Tastatur unten zeigt dir,
              welche Taste dran ist. Drücke die <Kbd>Umschalt</Kbd>-Taste zweimal
              kurz, dann wird dir der Finger angesagt.
            </p>
          )}
        </Section>

        {/* ★★ DIE ZEICHENERKLÄRUNG (Bauart §7.1) - kurz, und an EINER Stelle.
            Wer ein Zeichen benutzt, erklärt es; sonst übernimmt er die halbe
            Hälfte einer Vereinbarung. */}
        <Section title="Diese Zeichen stehen im Text">
          <Zeichenerklaerung
            titel={null}
            zeichen={[
              { zeichen: "·", bedeutung: "trennt zwei Angaben, die zusammengehören - wie ein Beistrich." },
              { zeichen: "→", bedeutung: "dann, oder: das wird daraus." },
              { zeichen: "⏱", bedeutung: "die Zeit, die du geübt hast." },
              // ★ Zeilenende mit Enter (23.09.2026): steht nur am Zeilenende, wenn
              // die Klasse das eingestellt hat - dann schliesst die Eingabetaste
              // jede Zeile ab.
              {
                zeichen: "↵",
                bedeutung:
                  "steht am Zeilenende, wenn deine Klasse das eingestellt hat - dann schliesst du die Zeile mit der Eingabetaste ab.",
              },
            ]}
          />
        </Section>

        {/* 1b) Der Einführungs-Podcast — steht beim ersten Start von selbst da
            und ist danach nur noch im Zahnrad zu finden (seit 09.08.2026). Darum
            hier eine Zeile: Wer die Karte weggeklickt hat, soll wissen, wo sie ist. */}
        <Section title="Zum Anhören: die Einführung 🎧">
          <p className="m-0">
            Oben im Zahnrad <strong>Einstellungen</strong> gibt es den Knopf{" "}
            <strong>Einführung</strong>.{" "}
            {du === "Sie" ? "Dahinter hören Sie" : "Dahinter hörst du"} in
            wenigen Minuten, wie das Programm aufgebaut ist und was die
            Grundstellung ist,{" "}
            {du === "Sie"
              ? "passend zur eingestellten Textstufe."
              : "passend zu deinem Alter."}
          </p>
        </Section>

        {/* 2) Sterne & Belohnung — für alle */}
        <Section title="Sterne sammeln 🌟">
          <p className="m-0">
            Nach jeder Runde {du === "Sie" ? "bekommen Sie" : "bekommst du"}{" "}
            <strong>1 bis 3 Sterne</strong> - und einen eigenen Klang dazu.{" "}
            <strong>Wenig Fehler zählt dabei viel mehr als Tempo:</strong> Wer
            ganz ruhig und genau tippt, holt sichere Sterne - wer rast und sich
            oft vertippt, nicht.{sober ? "" : " Jedes Kind kann Sterne holen!"}
          </p>
          {detail >= 2 && (
            <p className="m-0">
              3 Sterne gibt es für eine richtig gute Runde - genau getippt und
              ordentlich im Tempo, wobei <strong>genau</strong> immer wichtiger
              ist als <strong>schnell</strong>.{" "}
              {du === "Sie" ? "Schaffen Sie" : "Schaffst du"} eine Weile lang gute
              Runden, {kannst} eine <strong>Leistungsstufe</strong> aufsteigen -
              dann klingt die Belohnung noch ein bisschen anders.
            </p>
          )}
        </Section>

        {/* 2b) Abzeichen — für alle */}
        <Section title="Abzeichen sammeln 🏅">
          <p className="m-0">
            Für besondere Erfolge {du === "Sie" ? "verdienen Sie" : "verdienst du"}{" "}
            <strong>Abzeichen</strong> - zum Beispiel den{" "}
            <strong>Volltreffer</strong> 🎯 für eine Runde ganz ohne Fehler oder{" "}
            {/* Der Abzeichen-Name hängt am Maskottchen-Schalter, nicht an der
                Tonlage — eigene Achse, eigener Helfer (skin.ts). */}
            <strong>
              {usesMascots(skin) ? "den Präzisions-Pinguin" : "Dreimal sauber"}
            </strong>{" "}
            {usesMascots(skin) ? "🐧 " : ""}für drei saubere Runden hintereinander. Bei einem neuen Abzeichen erklingt ein eigenes{" "}
            <strong>„Ta-daa"</strong> und der Name wird angesagt.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              {/* ★ 19.09.2026: „ganz oben" stimmte seit dem Umbau vom 11.09.
                  nicht mehr - davor stehen die Wochenziele und die Werte. */}
              Alle Abzeichen stehen in <strong>„Meine Statistik"</strong>, gleich
              nach den Wochenzielen und {dein === "Ihr" ? "Ihren" : "deinen"} Werten -
              dort steht auch immer das <strong>nächste Ziel</strong> (zum
              Beispiel: noch 2 fehlerfreie Runden bis zum Null-Fehler-Ninja 🥷).
              Die meisten Abzeichen gibt es fürs <strong>genaue Tippen</strong>{" "}
              und fürs <strong>Dranbleiben</strong> - nicht fürs Rasen. Und ein
              paar sind <strong>geheim</strong>: Ihre Bedingung steht nirgends,
              sie tauchen einfach auf!
            </p>
          )}
          {detail >= 2 && (
            <p className="m-0">
              Dort steht auch {dein === "Ihr" ? "Ihr" : "dein"}{" "}
              <strong>Score</strong>: {SCORE_ERKLAERUNG}
            </p>
          )}
          {detail >= 2 && (
            <p className="m-0">
              Weiter unten zeigt „Steigerung im Verlauf" (eine Zeile zum
              Aufklappen) eine kleine Kurve.{" "}
              {STEIGERUNG_HINWEIS}
            </p>
          )}
          <p className="m-0">
            Tipp: {du === "Sie" ? "Wählen Sie" : "Wähl"} eine Medaille in der
            Statistik und {du === "Sie" ? "drücken Sie" : "drück"} die Eingabetaste - sie
            erscheint <strong>groß</strong>, mit Glanz und Konfetti.
          </p>
        </Section>

        {/* 2b-2) Belohnung nach der neuen Taste — nur Jugend-Profil, weil nur
            dort gewählt werden kann (Weiche 2, Johannes 29.07.; Wahl seit
            15.08., Bauplan §0b.4; seit 22.08. nur noch keins/Eisschollen). */}
        {skin === "jugend" && (
          <Section title="Nach einer neuen Taste">
            <p className="m-0">
              Eine <strong>neue Taste</strong> gehört dir, sobald die bisherigen
              sitzen - dafür musst du nichts gewinnen. Sie wird gefeiert, und
              danach geht es weiter. Mehr passiert nicht.
            </p>
            <p className="m-0">
              Wenn du magst, kann danach ein kurzes Spiel kommen: das{" "}
              <strong>Eisschollen-Spiel</strong>. Du stellst es selbst ein - im
              Zahnrad <strong>Einstellungen</strong> (<AltText>Alt + O</AltText>) unter{" "}
              <strong>Belohnungs-Spiel</strong>. Voreingestellt ist{" "}
              <strong>Keins</strong>. Die Einstellung gilt für dieses Gerät.
            </p>
          </Section>
        )}

        {/* 2c) Eisschollen-Spiel — Kinder haben es immer (samt eigenem Knopf).
            ★★ 31.08.2026 (Johannes): Der Knopf „🐧 Spielen" steht jetzt auch in
            der Jugend-Stufe - NUR die Runde NACH einer neuen Taste bleibt dort
            eine Zahnrad-Einstellung. Der Text unten trennt beides ausdrücklich,
            weil es zwei verschiedene Wege sind.
            ERWACHSENE bekommen den Abschnitt seit 22.08.2026 gar nicht mehr:
            Für sie gibt es weder eine Belohnungs-Runde noch einen freien
            Einstieg - eine Hilfe, die ein Spiel erklärt, das nirgends zu
            erreichen ist, ist keine Hilfe. */}
        {!isAdult && (
        <Section title="Das Eisschollen-Spiel 🐧">
          {skin === "jugend" ? (
            <>
              <p className="m-0">
                Du kannst es <strong>jederzeit selbst starten</strong> - mit dem
                Knopf <strong>🐧 Spielen</strong> in der Zeile unter dem
                Übungsfeld. Der Pinguin
                springt über Eisschollen, klettert den Buchstabenberg hinauf und
                rutscht auf dem Bauch hinunter - immer mit den Tasten, die dir
                gerade am schwersten fallen. Unterwegs springen{" "}
                <strong>Bonus-Fische</strong> (rechtzeitig getippt = gefangen,
                nie ein Fehler), und in der <strong>Echo-Höhle</strong> wird
                jede Taste nur angesagt. Das Spiel zählt <strong>nicht</strong>{" "}
                als Übezeit und ist keine Bedingung für neue Zeichen - es bringt
                aber eigene Abzeichen.
              </p>
              <p className="m-0">
                Nach einer neuen Taste kommt es <strong>nur dann</strong> von
                selbst, wenn du es im Zahnrad als{" "}
                <strong>Belohnungs-Spiel</strong> eingestellt hast. Sonst
                unterbricht dich nichts - du entscheidest, wann gespielt wird.
              </p>
            </>
          ) : (
            <>
              <p className="m-0">
                Hast du eine <strong>neue Taste</strong> geschafft, wartet zur
                Feier das Eisschollen-Spiel: Hilf dem Pinguin über das Wasser -
                drück immer die Taste, die auf der nächsten Eisscholle steht!
                Manchmal geht es danach sogar den <strong>Buchstabenberg</strong>{" "}
                hinauf und auf dem Bauch wieder hinunter. Die neue Taste gehört
                dir schon vorher - das Spiel ist die Belohnung, kein Muss.
              </p>
              <p className="m-0">
                Du kannst das Spiel auch <strong>jederzeit selbst starten</strong>{" "}
                - mit dem Knopf <strong>🐧 Spielen</strong> oben in deiner
                Übungskarte, gleich neben dem Ring. Das
                ist das große <strong>Abenteuer</strong>: Es sieht jeden Tag ein
                bisschen anders aus, unterwegs springen{" "}
                <strong>Bonus-Fische</strong> (schnell ihre Taste drücken =
                gefangen!), und in der <strong>Echo-Höhle</strong> siehst du
                keine Buchstaben -{" "}
                {hoehleMitWesen ? (
                  <>
                    die Höhle <strong>sagt</strong> dir jede Taste an.
                  </>
                ) : (
                  <>
                    jede Taste klingt als Ton, und der Screenreader oder die
                    Braillezeile <strong>sagt</strong> dir, welche es ist.
                  </>
                )}{" "}
                Es ist nur zum Spaß und zählt <strong>nicht</strong>{" "}
                zur Übezeit - aber es bringt eigene Abzeichen!
              </p>
              {detail >= 2 && (
                <p className="m-0">
                  Keine Sorge: Geht eine Scholle unter oder rutschst du am Berg
                  aus, schwimmt der Pinguin einfach zurück - du kannst es sofort
                  nochmal probieren, so oft du willst. Und wer das ganze
                  Abenteuer ohne einen einzigen Plumpser schafft, sieht am Iglu
                  das <strong>Polarlicht</strong> tanzen!
                </p>
              )}
            </>
          )}
        </Section>
        )}

        {/* 3) Die drei „Stufen" — Antwort auf den Ring mit der Zahl oben rechts */}
        <Section title="Was bedeutet der Ring mit der Zahl?">
          <p className="m-0">
            Die Zahl im Ring ist {dein === "Ihr" ? "Ihre" : "deine"}{" "}
            <strong>{ringLabel}</strong>.{" "}
            <strong>{xpLabel === "XP" ? "XP" : "Punkte"} sind Punkte fürs Üben:</strong>{" "}
            für jede Runde {du === "Sie" ? "bekommen Sie" : "bekommst du"} ein paar,
            und der Ring füllt sich. Ist er voll (100 Punkte),{" "}
            {du === "Sie" ? "steigen Sie" : "steigst du"} eine {ringLabel} auf. Das
            ist nur zum Sammeln und macht das Üben <strong>nicht</strong> schwerer -
            wie Punkte in einem Spiel.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              {du === "Sie" ? "Verwechseln Sie" : "Verwechsle"} das nicht mit der{" "}
              <strong>Leistungsstufe (1-50)</strong>: die sagt, wie schnell{" "}
              {du === "Sie" ? "Sie tippen sollen" : "du tippen sollst"}, und stellt
              sich <strong>von allein</strong> auf {dein === "Ihr" ? "Sie" : "dich"}{" "}
              ein
              - sie steigt, wenn es gut läuft, und wird leichter, wenn es schwer
              fällt.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0">
              {/* ★ B11 (11.09.2026): Für ein Kind in einer Klasse steht die
                  Textstufe NICHT mehr im Zahnrad - sie kommt aus der
                  Schulstufe der Klasse. Ein Satz, der ein Feld verspricht, das
                  es dort nicht gibt, schickt es suchen. */}
              Und die <strong>Textstufe</strong> bestimmt nur, wie
              schwer die Wörter und Sätze sind - passend zum Alter. In einer
              Klasse stellt sie deine Lehrkraft für alle ein; ohne Klasse
              findest du sie oben im Zahnrad ⚙. Drei
              verschiedene Dinge also: <em>{ringLabel}</em> = Punkte,{" "}
              <em>Leistungsstufe</em> = Tempo-Anspruch, <em>Textstufe</em> = Alter.
            </p>
          )}
        </Section>

        {/* 4) Übezeit & Wochenplan */}
        <Section title={detail === 1 ? "Wie oft üben?" : "Übezeit & Wochenplan"}>
          {detail === 1 ? (
            <p className="m-0">
              Übe lieber <strong>oft ein bisschen</strong> als einmal ganz lang -
              zum Beispiel an mehreren Tagen ein paar Minuten. In der Zeile
              unter dem Übungsfeld zählt eine Uhr, wie lange {du} heute schon
              getippt hast; genau diese Zeit füllt dort auch den{" "}
              <strong>Ring</strong> - {dein === "Ihr" ? "Ihr" : "dein"}{" "}
              Wochenziel.
            </p>
          ) : (
            /*
              ★ W4 (19.09.2026, Bauplan §„W4 Kind"): Wochenziel = Minuten pro
              Woche, OHNE Einheiten (`wochenziel.ts`) - der frühere Absatz zu
              „Übungseinheiten" und den Tagesringen ist damit gegenstandslos.
              Die Woche beginnt am Montag um 8 Uhr (dieselbe Grenze überall in
              der App, auch für die Lehrkraft und die Wochen-Mail).
            */
            <p className="m-0">
              {/* ★ 19.09.2026: Ohne Klasse setzt man das Wochenziel seither
                  selbst (Zahnrad, „Mein Wochenziel"). */}
              Mit einem Konto kann es ein <strong>Wochenziel</strong> geben: so
              viele <strong>Minuten pro Woche</strong>. In einer Klasse stellt
              es {dein === "Ihr" ? "Ihre" : "deine"} Lehrkraft ein; ohne Klasse{" "}
              {kannst} es im Zahnrad ⚙ unter „Mein Wochenziel" selbst setzen -
              ein neues Ziel gilt ab dem nächsten Montag. Die Woche beginnt am{" "}
              <strong>Montag um 8 Uhr</strong> und endet den Montag danach. In
              der Zeile unter dem Übungsfeld steht {dein === "Ihr" ? "Ihr" : "dein"} Stand als{" "}
              <strong>Ring</strong>, zum Beispiel „25 von 60 Min." - voll ist er
              mit einem Haken, wenn die Woche geschafft ist. Manchmal gibt es
              zusätzlich versäumte Minuten aus einer früheren Woche zum{" "}
              <strong>Nachholen</strong>; dann steht daneben, wie viele. Ist das
              Wochenziel erreicht, kommt ein kurzes Fenster mit Gratulation -
              danach {kannst} jederzeit weiterüben, wenn{" "}
              {dein === "Ihr" ? "Sie mögen" : "du magst"}.
            </p>
          )}
        </Section>

        {/* 4a2) Einstellungen hinter dem Zahnrad — seit 28.07.2026 eingeklappt,
            seit 22.08.2026 in der Kopfzeile und mit der Übungsart als erster
            Gruppe (Charge „SCHLANK"). */}
        <Section title="Einstellungen: das Zahnrad ⚙ in der Kopfzeile">
          <p className="m-0">
            Alle Einstellungen stecken hinter dem Knopf{" "}
            <strong>⚙ Einstellungen</strong> ganz oben, gleich links neben dem
            runden Zeichen mit {sie ? "Ihrem" : "deinem"} Anfangsbuchstaben:{" "}
            <strong>Was {du === "Sie" ? "üben Sie" : "übst du"}?</strong>,{" "}
            <strong>Texte</strong> (Alter und Sprache), <strong>Tastatur</strong>,{" "}
            <strong>Ton</strong> und{" "}
            <strong>Vorlesen</strong>. Einmal drücken klappt sie auf, noch
            einmal wieder zu - oder mit <Kbd>Alt</Kbd> + <Kbd>O</Kbd> („Optionen"),
            das geht auch mitten im Schreiben. Beim Aufklappen springt der Cursor
            gleich in den Bereich, beim Zuklappen zurück ins Schreibfeld.
          </p>
          <p className="m-0">
            Ganz oben im Zahnrad steht{" "}
            <strong>„Was {du === "Sie" ? "üben Sie" : "übst du"}?"</strong>: die
            drei Wege <strong>Mein Training</strong>, <strong>Geschichten</strong>{" "}
            und <strong>Wortspiele</strong>. Mit <Kbd>Alt</Kbd> + <Kbd>B</Kbd>{" "}
            geht es reihum weiter, und der neue Weg wird angesagt.
          </p>
          {/* ★ 19.09.2026 (Johannes: „der Sprache-umstellen-Schalter muss auch
              jedem zur Verfügung stehen"): der Sprachschalter in EINEM Satz -
              er zieht die Übungssprache mit, ausser sie ist gesperrt. */}
          <p className="m-0">
            Der runde Knopf <strong>EN</strong> in der Kopfzeile stellt
            Tastenflow auf Englisch um - Knöpfe, Menüs und gleich auch die
            Übungstexte (auf Englisch heißt er <strong>DE</strong> und stellt
            zurück); die Sprache der Texte {kannst} danach unter{" "}
            <strong>Texte</strong> wieder für sich ändern, außer{" "}
            {dein === "Ihr" ? "Ihre" : "deine"} Lehrkraft hat sie festgelegt.
          </p>
          <p className="m-0">
            Unter <strong>Tastatur</strong> {kannst} einstellen, welche Tastatur
            wirklich vor {sie ? "Ihnen" : "dir"} liegt: deutsch/österreichisch,
            Schweizer, amerikanische oder britische. Danach stimmen die
            Bildschirm-Tastatur und die Finger-Ansagen - und es kommen nur
            Zeichen dran, die es auf dieser Tastatur gibt.
            {layout.hinweis ? " " + layout.hinweis : ""}
          </p>
          {/* ★ 19.09.2026 (Johannes: „Selbstlernende sollen sich alles
              einstellen können" - „auch Leute ohne Anmeldung"): „Einhand
              schreiben" steht jetzt auch im Zahnrad, ausser in einer Klasse. */}
          <p className="m-0">
            Dort steht auch <strong>„Einhand schreiben"</strong> - für alle, die
            mit einer Hand tippen: Dann gelten Großbuchstaben und Sonderzeichen
            mit jeder Umschalttaste. In einer Klasse stellt das{" "}
            {dein === "Ihr" ? "Ihre" : "deine"} Lehrkraft ein.
          </p>
          {/* ★ L7 (19.09.2026): das Abdunkeln beim Schreiben - ein Satz.
              ★ Und seit demselben Tag: JEDES Kind stellt den Zeichenabstand
              selbst ein, auch in einer Klasse (Johannes: „die
              CVI-Einstellungen kann sich jedes Kind immer auch selbst in den
              Einstellungen einstellen, aber auch die Lehrkraft"). */}
          <p className="m-0">
            Mit <strong>„Zeichenabstand groß (CVI)"</strong> wird beim Schreiben
            alles außer dem Feld abgedunkelt, in dem gerade geschrieben wird
            (Übungszeile oder Spielfeld); nach 5 Sekunden ohne Tippen wird es
            wieder hell. Die Übungszeile gleitet dabei in{" "}
            {dein === "Ihr" ? "Ihrem" : "deinem"} Schreibtakt weiter, statt zu
            springen. Den Zeichenabstand {kannst} im Zahnrad ⚙ jederzeit selbst
            einstellen - in einer Klasse kann ihn auch{" "}
            {dein === "Ihr" ? "Ihre" : "deine"} Lehrkraft einstellen; es gilt,
            was zuletzt gewählt wurde.
          </p>
          <p className="m-0">
            Mit <strong>„Gezielt üben"</strong> {kannst} bis zu 8 Tasten oder Zeichen
            wählen, die in den Runden besonders oft vorkommen - im Zahnrad unter{" "}
            <strong>„Was {du === "Sie" ? "üben Sie" : "übst du"}?"</strong> oder mit{" "}
            <Kbd>Alt</Kbd> + <Kbd>2</Kbd>. In einer Klasse stellt das {dein === "Ihr" ? "Ihre" : "deine"} Lehrkraft ein.
          </p>
        </Section>

        {/* 4b) Vorlesen + Stimme — wichtig für Lernende mit Blindheit; auf jeder Stufe */}
        <Section title="Vorlesen - die App liest vor">
          <p className="m-0">
            Mit <strong>🗣 Vorlesen</strong> (oder <Kbd>Alt</Kbd> + <Kbd>V</Kbd>)
            liest die App vor - für alle, die (noch) keinen Screenreader nutzen.
            Im Zahnrad ⚙ oben {kannst} wählen, ob <strong>Buchstaben</strong>,{" "}
            <strong>Wörter</strong> und/oder <strong>Sätze</strong> vorgelesen
            werden, und wie schnell.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Unter <strong>„Stimme"</strong> {kannst} eine andere Stimme wählen.
              Bei Sprache <strong>Englisch</strong> sucht die App automatisch eine
              englische Stimme; ist keine installiert, kommt eine kurze Anleitung
              zum Hinzufügen.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0">
              Keine Sorge ums Tempo: Die{" "}
              <strong>Vorlesezeit wird herausgerechnet</strong> - das Warten auf die
              Ansage macht {dein === "Ihr" ? "Ihr" : "dein"} Tempo nicht langsamer.
            </p>
          )}
        </Section>

        <Section title="Melodie beim Tippen 🎵">
          <p className="m-0">
            Die <strong>Melodie beim Tippen</strong> ist dazu da, einen <strong>gleichmäßigen Tipprhythmus</strong> zu üben - und sie soll <strong>Spaß machen</strong>. Jede richtige Taste spielt den nächsten Ton eines Liedes; wer im Takt bleibt, bekommt sogar eine Band dazu.
          </p>
          <p className="m-0">
            Wer gleichmäßig tippt, wird auch bei den schwächeren Tasten flüssiger: Der Rhythmus trägt durch die Stellen, an denen man sonst zögert.
          </p>
          <p className="m-0">
            Eingeschaltet wird sie mit <Kbd>Alt</Kbd> + <Kbd>6</Kbd>, im Zahnrad ⚙ oder im Menü unter dem runden Lautsprecher-Schalter oben - dort lässt sich auch die Lautstärke aller Klänge mit Schiebereglern einstellen. Der Klang wechselt mit <Kbd>Alt</Kbd> + <Kbd>7</Kbd> und <Kbd>Alt</Kbd> + <Kbd>8</Kbd>.
          </p>
        </Section>

        {/* 4c) Große Buchstaben (Umschalttaste) + Satzzeichen — das Thema klar &
            einfach erklärt. Die ECHTE Umschalttaste kommt jetzt FRÜH (Mein
            Training, siehe LETTERS_BEFORE_SHIFT); davor hilft die Auto-Großschreibung. */}
        <Section title="Große Buchstaben & Satzzeichen">
          <p className="m-0">
            Deutsch braucht <strong>große Buchstaben</strong> - am Satzanfang und
            bei Namenwörtern (Hund, Schule, Tisch). „Tastenflow" schreibt sie{" "}
            <strong>immer richtig groß</strong>;{" "}
            {du === "Sie" ? "Sie sehen" : "du siehst"} also nie ein falsch
            geschriebenes Wort.
          </p>
          <p className="m-0">
            <strong>Am Anfang ganz leicht:</strong> {tippe} einfach den{" "}
            <strong>kleinen</strong> Buchstaben - der <strong>große</strong>{" "}
            erscheint von selbst. Die <Kbd>Umschalt</Kbd>-Taste{" "}
            {du === "Sie" ? "müssen Sie" : "musst du"} dafür noch{" "}
            <strong>nicht</strong> können.
          </p>
          <p className="m-0">
            <strong>Schon bald</strong>, nach den ersten Buchstaben,{" "}
            {du === "Sie" ? "lernen Sie" : "lernst du"} die{" "}
            <Kbd>Umschalt</Kbd>-Taste „echt":{" "}
            {du === "Sie" ? "Sie halten" : "du hältst"} sie mit der{" "}
            <strong>einen</strong> Hand und {du === "Sie" ? "tippen" : "tippst"} den
            Buchstaben mit der <strong>anderen</strong> - so wie auf jeder Tastatur.
            So {kannst} große Buchstaben bald <strong>selbst</strong> tippen, nicht
            nur die automatische Hilfe nutzen.
          </p>
          <div className="rounded-lg border border-hairline bg-surface-raised p-3">
            <p className="m-0">
              <strong>Wichtig - immer die Umschalttaste der GEGENHAND:</strong> Es
              gibt zwei Umschalttasten, links und rechts. {tippe} den Buchstaben mit
              der einen Hand, {du === "Sie" ? "halten Sie" : "halte"} die{" "}
              <Kbd>Umschalt</Kbd>-Taste mit der <strong>anderen</strong> Hand. So
              muss nie eine Hand beide Tasten drücken.
            </p>
            <p className="m-0 mt-2">
              Beispiel: großes <strong>A</strong> (linke Hand) →{" "}
              <strong>rechte</strong> <Kbd>Umschalt</Kbd>-Taste. Großes{" "}
              <strong>K</strong> (rechte Hand) → <strong>linke</strong>{" "}
              <Kbd>Umschalt</Kbd>-Taste.
            </p>
            <p className="m-0 mt-2">
              „Tastenflow" nimmt <strong>nur die richtige</strong> Umschalttaste
              an. {du === "Sie" ? "Nehmen Sie" : "Nimmst du"} die{" "}
              <strong>falsche</strong> Umschalttaste oder die{" "}
              <Kbd>Feststell</Kbd>-Taste (Caps Lock), entsteht ein{" "}
              <strong>kleiner</strong> Buchstabe - das{" "}
              {du === "Sie" ? "gilt als" : "ist ein"} <strong>Fehler</strong>, damit
              du die richtige Hand von Anfang an übst.
            </p>
          </div>
          {detail >= 2 && (
            <p className="m-0 text-sm text-ink-muted">
              Tipp: Drücke die <Kbd>Umschalt</Kbd>-Taste <strong>zweimal kurz</strong>{" "}
              - dann wird angesagt, mit welchem Finger {du} sie{" "}
              {du === "Sie" ? "halten" : "hältst"}.
            </p>
          )}
          <p className="m-0">
            <strong>Punkt, Komma und Fragezeichen</strong> erscheinen erst, wenn{" "}
            {du} sie gelernt {du === "Sie" ? "haben" : "hast"}. Vorher{" "}
            {du === "Sie" ? "lesen Sie" : "liest du"} den Satz einfach{" "}
            <strong>ohne sie</strong> - das ist Absicht und kein Fehler.
          </p>
        </Section>

        {/* 4d) Reihenfolge der Buchstaben-Freischaltung — auf jeder Stufe */}
        <Section title="In welcher Reihenfolge kommen die Buchstaben?">
          <p className="m-0">
            Neue Tasten kommen immer in derselben Reihenfolge dazu: zuerst die{" "}
            <strong>Grundstellung</strong>, dann nach Häufigkeit die übrigen
            Buchstaben. Welche Taste als Nächstes kommt, {du === "Sie" ? "sehen Sie" : "siehst du"}{" "}
            immer rechts in der Zeile unter dem Übungsfeld:{" "}
            <strong>„Nächste Taste"</strong>.
          </p>
          <div className="flex flex-wrap gap-1" aria-hidden="true">
            {letters.map((ch) => (
              <Kbd key={ch}>{unitGlyph(ch)}</Kbd>
            ))}
          </div>
          <p className="m-0 text-sm text-ink-muted">
            Schon <strong>nach den ersten Buchstaben</strong> kommt die{" "}
            <strong>Großschreibung</strong> (Umschalt-Taste) dazu und gleich
            danach <strong>Punkt und Komma</strong> - ein Satz beginnt groß und
            endet mit einem Punkt. Dann die übrigen Buchstaben. Zuletzt folgen
            die übrigen <strong>Satzzeichen</strong> (- ? ! : ;), die{" "}
            <strong>Zahlen</strong> und die <strong>Sonderzeichen</strong>.
          </p>
          <span className="sr-only">
            Reihenfolge: erste Buchstaben, dann die Großschreibung (Umschalttaste),
            dann Punkt und Komma, dann die übrigen Buchstaben, danach die übrigen
            Satzzeichen, Zahlen und Sonderzeichen. Buchstaben-Reihenfolge:{" "}
            {letters.map((c) => unitLabel(c)).join(", ")}.
          </span>
        </Section>

        {/* 5) „Mein Training": wie das Programm aufbaut — ab Detail 2.
            ★ E7 (19.09.2026): Bis dahin stand hier „Zwei Lernwege: 'Mein
            Training' und 'Lektionen'" mit einem Umschalt-Hinweis (Alt + B) auf
            eine Übungsart, die es nicht mehr gibt (siehe `trainerMode.ts`) -
            der feste Lehrgang lebt als „Vorlagen" in „Eigene Übung" weiter,
            aber als Werkzeug der LEHRKRAFT, nicht als zweiter Weg, den ein
            Kind selbst wählt. */}
        {detail >= 2 && (
          <Section title={'Wie „Mein Training" aufbaut'}>
            <p className="m-0">
              <strong>Es passt sich an {du === "Sie" ? "Sie" : "dich"} an.</strong>{" "}
              Das Programm merkt sich, welche Tasten noch wackeln, und übt genau
              die. Eine neue Taste kommt erst dazu, wenn die anderen sitzen. Die{" "}
              <strong>häufigsten</strong> Buchstaben kommen zuerst - so{" "}
              {du === "Sie" ? "schreiben Sie" : "schreibst du"} schon nach
              wenigen Tasten <strong>echte Wörter und Sätze</strong>, und die
              ersten <strong>Geschichten</strong> gehen früh auf.
            </p>
            {detail >= 3 && (
              <p className="m-0 text-sm text-ink-muted">
                Dahinter steht ein fester Lehrgang von {LESSONS.length}{" "}
                Lektionen (Grundstellung, obere und untere Reihe, Umlaute,
                Satzzeichen, Zahlen, Sonderzeichen, ganze Texte) - dieselbe
                Reihenfolge, in der „Mein Training" neue Tasten freischaltet.{" "}
                {du === "Sie" ? "Sie sehen" : "Du siehst"} diese Lektionen
                nicht einzeln: Weil die Tastatur-Reihen zuerst kommen, fehlt
                lange der häufige Buchstabe <Kbd>n</Kbd> (er kommt erst in
                Lektion 16) - „Mein Training" gleicht das aus, indem es die{" "}
                <strong>häufigsten</strong> Buchstaben vorzieht, damit schnell
                echte Wörter entstehen.
              </p>
            )}
          </Section>
        )}

        {/* 25.08.2026: Was bis dahin in zwei Karten ÜBER dem Übungsfeld stand
            (und dessen Erklärung hinter einem Dreieck versteckt war), steht
            jetzt in einer Zeile unter dem Feld - erklärt wird es hier. */}
        <Section title="Die Zeile unter dem Übungsfeld">
          <p className="m-0">
            Unter dem Übungsfeld steht eine schmale Zeile mit vier Dingen:{" "}
            {dein === "Ihr" ? "Ihre" : "deine"} <strong>Stufe</strong>, die
            heute geübte <strong>Zeit</strong>, das <strong>Wochenziel</strong>{" "}
            und die <strong>nächste Taste</strong>. Beim Wochenziel zeigt der
            Ring, wie viele <strong>Minuten</strong> {du === "Sie" ? "Sie" : "du"}{" "}
            diese Woche schon geübt {du === "Sie" ? "haben" : "hast"} - zum
            Beispiel „25 von 60 Min."; ein <strong>Haken</strong> heisst: die
            Woche ist geschafft. Die nächste Taste geht{" "}
            <strong>von selbst</strong> auf, sobald die bisherigen sitzen -
            einfach weiter üben.
          </p>
          <p className="m-0">
            Die Zeile steht <strong>immer</strong> - auch während du
            schreibst. So springt nichts, und du siehst jederzeit, wie lange
            du schon geübt hast.
          </p>
          <p className="m-0">
            <Kbd>Alt</Kbd> + <Kbd>D</Kbd> sagt Übezeit und Wochenziel an.
            Welche Tasten schon sitzen, welche noch haken und welche als
            Nächstes kommt, steht in <strong>„Meine Statistik"</strong> unter{" "}
            <strong>„Tasten-Stand"</strong> (<Kbd>Alt</Kbd> + <Kbd>S</Kbd>,
            mit Konto).
          </p>
        </Section>

        {/* 5b) Die Bücherei „Geschichten & Wissen" + der rote Faden (TN-E11).
            Bis dahin kam die Bücherei in der Hilfe gar nicht vor. */}
        <Section title={'Die Bücherei: „Geschichten & Wissen" \uD83D\uDCD6'}>
          <p className="m-0">
            Neben „Mein Training" gibt es einen weiteren Weg:{" "}
            <strong>Geschichten</strong> - im Zahnrad ⚙ unter{" "}
            <strong>„Was {du === "Sie" ? "üben Sie" : "übst du"}?"</strong>. Dort
            warten ganze Geschichten und Wissens-Reihen - nicht einzelne Sätze,
            sondern <strong>eine Geschichte über viele Runden</strong>. Jede Etappe
            sind zwölf Zeilen; danach {du === "Sie" ? "lesen Sie" : "liest du"} beim
            nächsten Mal weiter, genau an der Stelle, wo{" "}
            {du === "Sie" ? "Sie aufgehört haben" : "du aufgehört hast"}.
          </p>
          <p className="m-0">
            Es erscheint nur, was {du === "Sie" ? "Sie" : "du"} mit den schon
            gelernten Tasten wirklich schreiben{" "}
            {du === "Sie" ? "können" : "kannst"} - darum sind am Anfang noch
            Schlösser zu sehen. Sie gehen von selbst auf, sobald genug Tasten sitzen.
            Jede Zeile kommt <strong>nur einmal</strong>: Was{" "}
            {du === "Sie" ? "Sie" : "du"} getippt{" "}
            {du === "Sie" ? "haben" : "hast"}, kehrt nicht als Wiederholung zurück.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              <strong>Der rote Faden:</strong> Was{" "}
              {du === "Sie" ? "Sie" : "du"} in einer Wissens-Reihe{" "}
              {du === "Sie" ? "gelesen haben" : "gelesen hast"}, kommt später im
              Training noch einmal - als <strong>Frage in anderen Worten</strong>,
              dann als kleine Vertiefung und zuletzt als passender Witz. So bleibt
              das Gelernte hängen, ohne dass es sich anfühlt wie Abfragen.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0 text-sm text-ink-muted">
              Unter der Liste steht „Quellen &amp; Dank": Dort{" "}
              {du === "Sie" ? "sehen Sie" : "siehst du"}, woher die Texte kommen.
              Manche sind selbst geschrieben, andere stammen aus frei nutzbaren
              Quellen - die werden dort mit Namen genannt, so gehört sich das.
            </p>
          )}
        </Section>

        {/* 5b) KI-Transparenz (Art. 50 KI-VO, 2026-08-03): Herkunft der eigenen
            Texte + die synthetischen Expeditions-Stimmen offen benennen. */}
        <Section title="Woher kommen die Texte? 🤖">
          <p className="m-0">
            Die eigenen Texte in diesem Programm, also Übungssätze, Witze und
            Geschichten, hat Johannes <strong>mit Hilfe von künstlicher
            Intelligenz (KI) geschrieben</strong> und danach selbst gelesen und
            geprüft. Texte aus anderen Quellen (z.&nbsp;B. Wikipedia oder
            Klexikon) stehen mit Namensnennung unter „Quellen &amp; Dank".
          </p>
          {/* ★ 28.09.2026: das raunende Monster (Höhlenwesen) gibt es nur auf
              Weg „de" (`hoehleHatWesen`) - sonst nur den Fisch nennen. */}
          <p className="m-0">
            {hoehleMitWesen ? (
              <>
                Auch der singende Fisch und das raunende Monster in der
                Polar-Expedition sind{" "}
                <strong>Computerstimmen</strong>, keine echten Menschen.
              </>
            ) : (
              <>
                Auch der singende Fisch in der Polar-Expedition ist eine{" "}
                <strong>Computerstimme</strong>, kein echter Mensch.
              </>
            )}{" "}
            Das
            Vorlesen (🗣) nutzt die Vorlese-Stimme{" "}
            {du === "Sie" ? "Ihres" : "deines"} Geräts.
          </p>
        </Section>

        {/* 5c) DIE SCHREIBPROBE (09.09.2026). Sie kommt selten vor - und genau
            darum steht sie in der Hilfe: Wer sie zum ersten Mal vor sich hat,
            soll vorher gelesen haben können, was gleich passiert.

            ⚠️ Das Wort kommt aus `PRUEFUNG_WORT` - es steht im ganzen Programm
            an GENAU EINER Stelle. Das Tastenkürzel ist in
            `SchreibprobeLauf.tsx` nachgesehen (`RESTZEIT_KUERZEL` = Alt + X),
            nicht geraten.

            ★ Alt + X stand bis 18.10.2026 bewusst NICHT unten in „Wichtige
            Tasten": Die Taste wird nur eingehängt, solange wirklich eine
            Schreibprobe (oder ein Klassenmatch) läuft. Seit dem Auftrag
            „Kürzel einheitlich" nennen Liste und Hilfe dieselben Tasten - Alt + X
            steht darum dort, aber MIT seiner Bedingung im Text
            (`TippenHilfeTasten.tsx`). Ein Kürzel ohne Bedingung, das an 364 von
            365 Tagen nichts tut, wäre das Versprechen, das die App nicht hält. */}
        <Section title={`Die ${PRUEFUNG_WORT}`}>
          <p className="m-0">
            Manchmal startet {dein === "Ihr" ? "Ihre" : "deine"} Lehrkraft eine{" "}
            <strong>{PRUEFUNG_WORT}</strong> - für die ganze Klasse.{" "}
            <strong>Alle bekommen denselben Text</strong>, und alle haben gleich
            lang Zeit.
          </p>
          <p className="m-0">
            <strong>
              Die Zeit läuft erst ab {dein === "Ihr" ? "Ihrem" : "deinem"} ersten
              Tastendruck
            </strong>{" "}
            - nicht schon, wenn {dein === "Ihr" ? "Ihre" : "deine"} Lehrkraft
            sie startet. Ab dem Start{" "}
            {du === "Sie" ? "haben Sie" : "hast du"}{" "}
            <strong>{EINSTIEGSFENSTER_MIN} Minuten</strong> Zeit, um anzufangen.
          </p>
          <p className="m-0">
            <strong>
              Woran {du === "Sie" ? "Sie sie erkennen" : "du sie erkennst"}:
            </strong>{" "}
            Über dem Schreibfeld steht das Wort{" "}
            <strong>{PRUEFUNG_WORT}</strong>, daneben die Zeit, und um den
            ganzen Bereich liegt ein anderer, <strong>gestrichelter Rahmen</strong>.
            Sobald die Zeit um ist, ist beides wieder weg.
          </p>
          <p className="m-0">
            <strong>Wie viel Zeit noch bleibt, ohne hinzusehen:</strong>{" "}
            <Kbd>Alt</Kbd> + <Kbd>X</Kbd> sagt es{" "}
            {du === "Sie" ? "Ihnen" : "dir"}. Von selbst meldet sich die Uhr nur
            ein paar Mal, sonst bleibt sie still.
          </p>
          <p className="m-0">
            <strong>Die Braillezeile bleibt ruhig.</strong> Die Zeit tickt{" "}
            <strong>nicht</strong> auf die Zeile: Sie läuft oben mit, aber sie
            schiebt sich nie in das, was{" "}
            {du === "Sie" ? "Sie gerade lesen" : "du gerade liest"}.
          </p>
          {/*
            ★★★ 23.09.2026 („Freies Schreiben", E6, Bauplan §7): manche
            {PRUEFUNG_WORT} laufen anders - wie die 10-Minuten-Abschrift von
            Typewriter. Bewusst OHNE Konjugation von „bist"/„sind": Die Sätze
            bleiben unpersönlich, nur `{kannst}` ist die schon vorhandene
            Variable von weiter unten.
          */}
          <p className="m-0">
            <strong>Manchmal heisst die {PRUEFUNG_WORT} „Freies Schreiben".</strong>{" "}
            Dann bleibt ein Fehler beim Tippen einfach stehen - nichts wird
            markiert, kein Ton meldet ihn. Die Rücktaste bessert nur in der
            aktuellen Zeile aus; eine fertige Zeile bleibt, wie sie ist. Am
            Zeilenende {kannst} die Leertaste nach dem letzten Wort drücken -
            oder, wenn die Klasse „Zeilenende mit Enter" eingestellt hat, die
            Eingabetaste. Was am Ende noch falsch dasteht, zeigt erst die
            Auflistung danach, als Liste zum Nachlesen.
          </p>
          {/* ★ 23.09.2026 (3. Klasse HAS: „mit ESC abzubrechen, hat aber nicht
              funktioniert"): Escape fragt nach - wie im Klassenmatch. */}
          <p className="m-0">
            <strong>Vorher aufhören:</strong> <Kbd>Esc</Kbd> fragt nach.{" "}
            <strong>„Weiterschreiben"</strong> (auch <Kbd>Esc</Kbd>) führt zurück in
            die Zeile, <strong>„Abgeben"</strong> gibt ab - gewertet wird, was{" "}
            {du === "Sie" ? "Sie bis dahin geschrieben haben" : "du bis dahin geschrieben hast"}.
            Dasselbe tut der Schalter <strong>„Fertig - abgeben"</strong> unter dem
            Feld, ohne Nachfrage.
          </p>
          <p className="m-0">
            <strong>Wenn die Zeit um ist,</strong> steht sofort{" "}
            {dein === "Ihr" ? "Ihre" : "deine"} Auflistung da: Anschläge je
            Minute, Treffsicherheit, Zeichen, Fehler, Zeilen und die Tasten, die
            gewackelt haben. Jede {PRUEFUNG_WORT} bleibt danach in{" "}
            <strong>„Meine Statistik"</strong> unter{" "}
            <strong>{PRUEFUNG_WORT_MEHRZAHL}</strong> stehen - dort {kannst} sie
            jederzeit wieder nachlesen.
          </p>
        </Section>

        {/*
          ★★★ DAS KLASSENMATCH (11.09.2026, F1 bis F14).

          Es steht direkt nach der Tippchallenge, weil beide gleich aussehen
          (Uhr über dem Feld, Text im Feld) und sich in genau einem Punkt
          unterscheiden, den ein Kind kennen muss: Die Challenge ist eine
          Prüfung, das Match ein Spiel - und im Match schreibt jede und jeder
          mit den EIGENEN Tasten.

          Kein Maus-Vokabular (Hausregel): „drücken", nicht „klicken"; der Weg
          über die Tastatur steht zuerst.
        */}
        <Section title="Das Klassenmatch ⚔️">
          <p className="m-0">
            Im Klassenmatch {sie ? "schreiben Sie" : "schreibst du"}{" "}
            <strong>fünf Minuten um die Wette</strong> - mit den anderen Kindern{" "}
            {dein === "Ihr" ? "Ihrer" : "deiner"} Klasse. Es gibt das Match nur in
            einer Klasse, und nur, wenn {dein === "Ihr" ? "Ihre" : "deine"} Lehrkraft
            es erlaubt hat.
          </p>
          <p className="m-0">
            <strong>Ausschreiben:</strong> <Kbd>Alt</Kbd> + <Kbd>M</Kbd>, oder der
            Schalter <strong>⚔️ Klassenmatch</strong> in der Zeile über dem
            Übungsfeld - gleich neben <strong>🐧 Spielen</strong>. Bei allen anderen
            geht dann ein Fenster auf: <strong>„Bin dabei"</strong> oder{" "}
            <strong>„Jetzt nicht"</strong>. Mit <Kbd>Esc</Kbd> geht es zurück ins
            Üben, und dieselbe Einladung kommt nicht von selbst wieder.
          </p>
          {/* ★ 11.09.2026 abends, Johannes: ein zweites Match „erst … wenn das
              erste match schon läuft, vorher nicht". */}
          <p className="m-0">
            <strong>Lädt schon jemand ein,</strong> holt <Kbd>Alt</Kbd> +{" "}
            <Kbd>M</Kbd> diese Einladung wieder hervor - ein zweites Match geht
            erst, wenn das erste schon läuft. Laden zwei fast gleichzeitig ein,
            gilt die Einladung, die zuerst da war.
          </p>
          {/* ★ 11.09.2026: Der Schalter verschwindet nicht mehr wortlos, wenn
              gerade nicht eingeladen werden kann - er sagt, warum (R-A3).
              ★ 15.09.2026: die Grenze „höchstens zwei Matches je Klasse" ist
              weg (Johannes: „ich möchte dass mehr wie 2 match parallel
              laufen können") - übrig bleibt nur das EIGENE Match. */}
          <p className="m-0">
            {/* ★ 19.09.2026: „Steckt du" / „Steckt Sie" waren falsch gebeugt. */}
            <strong>Wenn es gerade nicht geht:</strong>{" "}
            {du === "Sie" ? "Stecken Sie" : "Steckst du"} schon selbst in einem Match, heisst der
            Schalter <strong>„⚔️ Klassenmatch läuft gerade"</strong> - und{" "}
            <Kbd>Alt</Kbd> + <Kbd>M</Kbd> sagt {du === "Sie" ? "Ihnen" : "dir"}{" "}
            dasselbe. Andere Matches der Klasse stören dabei nicht: Es dürfen
            beliebig viele gleichzeitig laufen.
          </p>
          <p className="m-0">
            <strong>Jede und jeder schreibt auf dem eigenen Stand.</strong> Wer schon
            Zahlen gelernt hat, bekommt Zahlen; wer bei der Grundreihe ist, bekommt
            die Grundreihe. Fehlgriffe kosten - ein Fehlgriff wiegt fünf Zeichen.
          </p>
          <p className="m-0">
            <strong>Wie es steht, ohne hinzusehen:</strong> Ganz links in der
            Schreibzeile stehen immer acht Zellen: <strong>P2</strong> ist der
            Platz, daneben die Zeit, die noch bleibt. <Kbd>Alt</Kbd> + <Kbd>X</Kbd>{" "}
            sagt {du === "Sie" ? "Ihnen" : "dir"} Platz, Zeit und die ersten drei.
            Von selbst meldet sich nichts - die Braillezeile bleibt ruhig.
          </p>
          {/* ★ 11.09.2026 abends, Johannes: „esc mit fragefenster, willst du
              wirklich abbrechen?" Erst die Taste, dann der Schalter. */}
          <p className="m-0">
            <strong>Vorher aufhören:</strong> <Kbd>Esc</Kbd> oder der Schalter{" "}
            <strong>„Verlassen"</strong> fragt nach. <strong>„Weiterschreiben"</strong>{" "}
            (auch <Kbd>Esc</Kbd>) führt zurück in die Zeile.{" "}
            <strong>„Verlassen"</strong> beendet das Match nur für{" "}
            {du === "Sie" ? "Sie" : "dich"} - die anderen schreiben weiter und sehen,
            was {sie ? "Sie geschrieben haben" : "du geschrieben hast"}.
          </p>
          <p className="m-0">
            <strong>Das Match zählt zu {dein === "Ihr" ? "Ihrer" : "deiner"}{" "}
            Übezeit</strong>, und es kann eine neue Taste freischalten - genau wie
            eine gewöhnliche Übungsrunde. <strong>Gespeichert wird kein Platz.</strong>{" "}
            Am Ende steht die Liste da: Pokal, Silber und Bronze für die ersten drei,
            alle anderen mit ihrer Zahl. Danach geht es mit{" "}
            <strong>„Weiter üben"</strong> oder <Kbd>Esc</Kbd> zurück.
          </p>
        </Section>

        {/* 6) Tasten / Tastenkürzel — vollständig, auf JEDER Stufe (auch für die
            Jüngsten): gerade Kinder mit Blindheit steuern alles über die Tastatur. */}
        <Section title="Wichtige Tasten">
          <p className="m-0 text-sm text-ink-muted">
            <AltOderWahl>
              <Kbd>Alt</Kbd> ist auf dem Mac die <Kbd>⌥</Kbd>-Taste (Wahltaste).
            </AltOderWahl>
          </p>
          <ul className="m-0 list-none space-y-2 p-0">
            {/* ★ Escape steht ZUERST (22.08.2026): Es ist die wichtigste Taste
                des Programms und fehlte in dieser Liste ganz - obwohl die
                Hausregel seit dem 14.08. an ihr hängt. */}
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Esc</Kbd>
              </span>
              <span>
                <strong>Die wichtigste Taste:</strong> Sie schließt jedes
                Fenster, und der Schreibcursor steht danach{" "}
                <strong>immer im Schreibfeld</strong>. Auch wenn gar nichts
                offen ist, holt <Kbd>Esc</Kbd> ihn dorthin zurück. Einzige
                Ausnahme ist „Tasten erkunden": Dort ist <Kbd>Esc</Kbd> selbst
                eine Taste zum Erkunden, und erst der zweite Druck steigt aus.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Umschalt</Kbd> <Kbd>Umschalt</Kbd>
              </span>
              <span>Zweimal kurz drücken: der richtige Finger wird angesagt.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>E</Kbd>
              </span>
              <span>Ins Schreibfeld springen.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>U</Kbd>
              </span>
              <span>Zum Üben wechseln.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>S</Kbd>
              </span>
              {/*
                ★ JW-16 (Befund des Audits vom 30.08., Wortlaut von Johannes
                  entschieden am 31.08.): Hier stand Alt + S OHNE die
                  Bedingung - und ohne Konto tut die Taste gar nichts. Wer sie
                  drückt und nichts passiert, sucht den Fehler bei sich.
              */}
              {/*
                ★ 18.10.2026 (Kürzel einheitlich): Hier stand „Zeigt deine
                  Abzeichen" - die Taste öffnet aber „Meine Statistik", bei
                  Lehrkräften „Meine Klassen" (Wortlaut `GEMEINSAME_KUERZEL.statistik`
                  in lib/shortcuts.ts, in allen Lern-Apps gleich).
              */}
              <span>
                {du === "Sie"
                  ? "Öffnet Meine Statistik (Lehrkräfte: Meine Klassen). Dafür müssen Sie angemeldet sein."
                  : "Öffnet Meine Statistik (Lehrkräfte: Meine Klassen). Dafür musst du angemeldet sein."}{" "}
                Noch einmal drücken führt zurück ins Schreibfeld.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>Z</Kbd>
              </span>
              <span>Ansagen, die wievielte Zeile gerade dran ist.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>D</Kbd>
              </span>
              <span>
                Übezeit ausgeben - auf der Braillezeile und (mit Vorlesen) als
                Ansage.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>L</Kbd>
              </span>
              <span>
                Ansagen, auf welcher {ringLabel}{" "}
                {du === "Sie" ? "Sie gerade sind" : "du gerade bist"}.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>3</Kbd>
              </span>
              <span>
                <strong>Tasten erkunden:</strong> Jede Taste, die{" "}
                {du === "Sie" ? "Sie drücken" : "du drückst"}, wird angesagt und
                groß angezeigt - zuerst die Abkürzung, dann der Name, dann was
                sie tut (zum Beispiel „Tab - Tabulatortaste - springt von
                Element zu Element"). Das gilt auch für alle Sondertasten und
                Satzzeichen, für Zeichen über AltGr (am Mac: Option) mit dem
                Weg dorthin, und für Tastenkombinationen wie Strg + C - samt
                dem, was sie tun. Die Kürzel von Tastenflow selbst (<AltText>Alt + H, Alt + V …</AltText>) funktionieren weiter. Die Bildschirmtastatur zeigt,
                welche Taste gedrückt wurde. Ist das Vorlesen aus, bleibt die
                Stimme still. Auf der Braillezeile bleibt die Erklärung stehen,
                bis die nächste Taste kommt, und lässt sich mit den
                Blättertasten ganz lesen; auf dem Bildschirm steht sie in einem
                Fenster. Nichts wird getippt, nichts geht verloren.{" "}
                Mit <Kbd>Shift</Kbd> kommt das obere Zeichen einer Taste, mit <Kbd>AltGr</Kbd> (am Mac: <Kbd>Option</Kbd>) das dritte - so lassen sich alle Zeichen der Reihe nach ausprobieren.{" "}<strong>Raus:</strong> noch einmal <Kbd>Alt</Kbd> +{" "}
                <Kbd>3</Kbd>, zweimal <Kbd>Esc</Kbd> - oder einfach die Seite
                neu laden.
              </span>
            </li>
            {/* ★ 13.09.2026 (Johannes): „oben einen schalter mit Tasten
                erkunden und einen mit Tasten finden" - dasselbe Fenster. */}
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>4</Kbd>
              </span>
              <span>
                <strong>Tasten finden:</strong> Eine Taste wird genannt, und{" "}
                {du === "Sie" ? "Sie suchen" : "du suchst"} sie. Beim ersten
                Treffer heißt es „Gefunden! Drück eine andere Taste, dann noch
                einmal …" - erst der zweite Druck zählt, und zwar erst nach
                einer anderen Taste dazwischen. Dann kommt die nächste Taste.
                Eine andere Taste wird nur benannt. Im Fenster wechselt <Kbd>Alt</Kbd> +{" "}
                <Kbd>4</Kbd> zwischen Erkunden und Finden.{" "}
                <strong>Raus:</strong> wie beim Erkunden.
              </span>
            </li>
            {/* ★ 30.08.2026: Diese zwei Einträge waren FALSCH bzw. fehlten -
                und der Fehler war live. „Tasten erkunden" stand hier auf
                Alt + K, war aber schon auf Alt + 3 gezogen; Alt + K gehört
                seither dem Farbschalter. Wer der Hilfe folgte, öffnete das
                Farbmenü - und ein Kind mit Blindheit merkte nicht, was
                geschah, weil der Farbschalter nichts ansagt.
                ⚠️ URSACHE, dreimal an einem Tag getroffen (Handbuch,
                Kürzel-Listen, hier): Beim Umbelegen wurde der sichtbare
                Oberflächentext gesucht, nicht die Texte, die den WEG erklären.
                Genau die liest jemand, der nicht weiterweiß.
                [[feedback_gruener_waechter_beweist_was]] */}
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>K</Kbd>
              </span>
              <span>
                <strong>Farben und Kontrast:</strong> sieben Farbwelten - hell,
                dunkel, Schwarz auf Gelb, Gelb auf Blau und mehr. Jede zeigt
                sich schon in der Liste in ihren eigenen Farben,{" "}
                {du === "Sie" ? "Sie sehen" : "du siehst"} also vorher, wie sie
                aussieht.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>T</Kbd>
              </span>
              <span>Tastenkürzel-Liste öffnen oder schließen.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>N</Kbd>
              </span>
              <span>Nachrichten der Lehrkraft öffnen oder schließen.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>+</Kbd> / <Kbd>-</Kbd>
              </span>
              <span>Schreibfeld größer / kleiner machen.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>V</Kbd>
              </span>
              <span>Vorlesen an- oder ausschalten.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>H</Kbd>
              </span>
              <span>Diese Hilfe öffnen oder schließen.</span>
            </li>
            {/* ★ 18.10.2026 (Kürzel einheitlich): die Tasten, die bis dahin nur die
              Kürzel-Liste nannte - in `TippenHilfeTasten.tsx`, alle Sprachen. */}
            <WeitereTasten />
          </ul>
        </Section>

        {/* 7) Wie das Lernsystem fördert — ab Detail 3 */}
        {detail >= 3 && (
          <Section
            title={`Wie das Programm ${du === "Sie" ? "Sie" : "dich"} fördert`}
          >
            <p className="m-0">
              Das Programm misst jeden Buchstaben einzeln - wie treffsicher und wie
              schnell. Es übt automatisch die schwächsten und schaltet einen neuen
              Buchstaben erst frei, wenn die bisherigen sitzen. So entsteht für{" "}
              {dein === "Ihr" ? "Sie" : "dich"} ein eigener Lernweg.
            </p>
            <p className="m-0">
              Die Leistungsstufe (1-50) sorgt dafür, dass es immer{" "}
              <strong>fordernd, aber machbar</strong> bleibt: Läuft es gut, steigt
              sie; wird es zu schwer, sinkt sie wieder. Unter{" "}
              <strong>„Meine Statistik"</strong> {du === "Sie" ? "sehen Sie" : "siehst du"}{" "}
              alles über {dein === "Ihr" ? "Ihren" : "deinen"} Fortschritt - und
              wie {du === "Sie" ? "Sie sich steigern" : "du dich steigerst"}.
            </p>
          </Section>
        )}

        {/* 7b) Eigenes Konto ohne Klasse (09.08.2026). Steht bewusst NICHT nur
            im Anmelde-Fenster: Wer schon drin ist und sich fragt, warum er Post
            bekommt (oder keine), sucht die Antwort in der Hilfe. Der Wortlaut
            kommt aus der gemeinsamen Anmeldung — vier Programme, ein Satz. */}
        <Section title="Ohne Klasse üben - ein eigenes Konto 🙋">
          <p className="m-0">{OHNE_KLASSE_HILFE}</p>
        </Section>

        {/* 7c) ★ 19.09.2026 (Johannes: „Ziel: dass es jemand in einer
            Einrichtung ausdruckt und aufhängt … und in der Hilfe bei den
            Schülern?"): das Plakat. Es ist ÖFFENTLICH (Werbematerial, kein
            Lehrmaterial - `oeffentlich: true` in `handbuecher.ts`), darum ein
            schlichter Verweis auf `/tastenflow-plakat.pdf` ohne Datei-Ausweis:
            Er lädt auch für Gäste ohne Anmeldung. Titel, Speichername und
            Größe kommen aus der EINEN Liste. Ein `<a href>` ist ein Tabstopp
            in der Fokus-Falle der Hilfe (`useFocusTrap`), Enter lädt. */}
        <PlakatAbschnitt du={du} dein={dein} />

        {/* ★ 30.08.2026 (Johannes): Der Handbuch-Download ist aus der
            KINDER-Hilfe verschwunden - „das sollen nur angemeldete
            Lehrpersonen sehen". Er wohnt jetzt allein in der LehrerHilfe
            (die sehen nur Lehrkräfte); dort holt sich der Knopf vor dem
            Laden selbst den Datei-Ausweis. */}
      </div>
    </div>
  );
}

/**
 * ★ 19.09.2026: Das Plakat zum Aufhängen - für alle, auch ohne Anmeldung.
 * Duzt wie die ganze Hilfe; die Sie-Fassung gilt nur, wo `isFormal` sie
 * verlangt (siehe Dateikopf).
 */
function PlakatAbschnitt({ du, dein }: { du: string; dein: string }) {
  const plakat = tastenflowPlakat();
  const sie = du === "Sie";
  return (
    <Section title="Ein Plakat zum Aufhängen">
      <p className="m-0">
        {sie ? "Möchten Sie" : "Möchtest du"} Tastenflow in{" "}
        {dein === "Ihr" ? "Ihrer" : "deiner"} Schule oder Einrichtung zeigen? Dann{" "}
        {sie ? "finden Sie" : "findest du"} hier ein <strong>Plakat zum Ausdrucken und
        Aufhängen</strong>: A3 hochkant, auf einen Blick, was Tastenflow kann, mit
        einem QR-Code zu tastenflow.org.
      </p>
      <p className="m-0">
        <a
          href={downloadAdresse(plakat)}
          download={plakat.speicherName}
          type="application/pdf"
          className="text-accent underline underline-offset-2"
        >
          Plakat herunterladen (PDF, A3, {groesse(plakat.bytes)})
        </a>
      </p>
    </Section>
  );
}
