/**
 * ★★★ DIE HILFE ZU „MEINE KLASSEN" AUF ENGLISCH (EN6b, 19.09.2026).
 * ===========================================================================
 * Übersetzung von `MeineKlasseHilfe.tsx` (Stand 19.09.2026, mit dem
 * Rundgang-Knopf aus Z4). Zu sehen nur in der englischen Bedienung von
 * Tastenflow; in deutscher Bedienung - und in den anderen Programmen, die
 * keinen aktiven Sprach-Anbieter haben - zeigt `MeineKlasseHilfe` die
 * deutsche Fassung.
 *
 * ── WARUM EINE EIGENE DATEI ────────────────────────────────────────────────
 * Dasselbe Muster wie die Kinder-Hilfe (`TippenHilfe.en.tsx`, EN7) und die
 * Rechtstexte (EN8): Eine Hilfe ist Fliesstext mit Tasten und Hervorhebungen;
 * in eine Texttabelle zerlegt, änderte jeder zerteilte Satz die Textknoten
 * der DEUTSCHEN Hilfe. Diese Datei steht Abschnitt für Abschnitt in derselben
 * Reihenfolge wie die deutsche - wer eine Stelle prüft, findet sie in beiden.
 *
 * ── WÖRTER ─────────────────────────────────────────────────────────────────
 * Glossar §3.8/§3.15 und das englische Handbuch (`L` in
 * `scripts/tastenflow-handbuch-en.mts`): *Progress | Pupils and logins ·
 * Class · Downloads · Practise yourself · Custom exercise · Weekly goal · Class
 * settings · Pause goal for 1 hour · Class overview · Message to the class ·
 * Key range · Min · Start now · Learners · Import pupils from Excel ·
 * Download template (Excel) · Print login details · Download class list ·
 * Move to another class · Class code of the new class · Edit*. Kind
 * (Lehrkraft-Sicht) ⇒ *pupil*, Lernprogramm ⇒ *app*, Schulstufe ⇒ *year
 * group*, Startniveau ⇒ *starting point*, Leistungsstufe ⇒ *difficulty
 * level*, Note ⇒ *mark*. Die Stufen von „Where to start" heissen wie in
 * `startPoints("en")`.
 *
 * ── WAS BEWUSST ANDERS IST ALS IM DEUTSCHEN ────────────────────────────────
 *  · „Der Lesepunkt steht im neuen Bereich" ⇒ *the focus is in the new area*
 *    - so heisst das, was eine Sprachausgabe von dort weiterliest.
 *  · Nur Bindestrich, keine Maus-Wörter (Glossar §1.3), Person zuerst.
 */
import { Modal } from "@/components/Modal";
import { RundgangMeineKlassenKnopf } from "@/components/typing/Rundgang";
import {
  DreiWerteHilfe,
  LeistungsstufeHilfe,
  SpaltenHilfe,
} from "@/components/typing/TastenflowZahlenHilfe";
import {
  EINSTIEGSFENSTER_MIN,
  PRUEFUNG_WORT_EN,
  PRUEFUNG_WORT_MEHRZAHL_EN,
} from "@/lib/typing/schreibprobe";

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

export function MeineKlasseHilfeEnglisch({
  onClose,
  programmName,
}: {
  onClose: () => void;
  /** Das offene Programm - davon hängt ab, welche Abschnitte dastehen. */
  programmName?: string;
}) {
  const tastenflow = programmName === "Tastenflow";
  const W = PRUEFUNG_WORT_EN;
  return (
    <Modal title="Help for “My classes”" onClose={onClose} size="lg">
      <div className="space-y-5">
        <RundgangMeineKlassenKnopf onStart={onClose} programmName={programmName} />
        <p className="m-0 text-sm leading-relaxed text-ink">
          This is where you work with your class. You create classes and accounts{" "}
          <strong>once</strong> - they apply in every app, with the same class code
          and the same password.
          {tastenflow && (
            <>
              {" "}
              As a teacher, opening Tastenflow always brings you here. “Practise
              yourself” (<Taste>Alt</Taste> + <Taste>U</Taste>) takes you to your own
              practice.
            </>
          )}
        </p>

        <Abschnitt titel="How the page is laid out">
          <p className="m-0">
            <strong>The class heading</strong> shows its name - if you have several
            classes, in the drop-down list “Class”, which you use to switch class -,
            the number of pupils and the class code. On the right of this row, just before “Downloads”, is the toggle{" "}
            <strong>“Progress | Pupils and logins”</strong> - in the same place on both
            of the screens it leads to.
          </p>
          <p className="m-0">
            Under <strong>“Pupils and logins”</strong> you create a new class, add
            pupils and move them, see passwords and login details, the class code and
            which apps the class uses. To add many pupils at once, use{" "}
            <strong>“Import pupils from Excel”</strong> under “Learners”: first
            “Download template (Excel)”, then one row per pupil with their name,
            password and - for Tastenflow - where they start. If a password is left
            empty, the app creates one; a preview shows what will be added, and
            afterwards all the imported pupils are listed under “Print login details”.
            With <strong>“Download class list”</strong> next to it you can download a
            Word file at any time with the name, password and class code of ALL the
            pupils in this class - to print.
            {!tastenflow && (
              <>
                {" "}
                You write a message to all the pupils there with “Message to the
                class”.
              </>
            )}
          </p>
          <p className="m-0">
            Under <strong>“Progress”</strong> - where you land when you open the page
            - you find the apps of this class, “Downloads” and, below them, the class
            statistics: how far each pupil has got.
            {tastenflow && (
              <>
                {" "}
                At the very top is a row of buttons: <strong>{W}</strong>,{" "}
                <strong>Custom exercise</strong>, <strong>Weekly goal</strong>,{" "}
                <strong>Class settings</strong> and <strong>Pause goal for 1 hour</strong>.
                Each button opens its own panel underneath - only one at a time, and{" "}
                <Taste>Esc</Taste> closes it again. “{W}” opens the form with “Key
                range”, “Min” and “Start now” as well as the past{" "}
                {PRUEFUNG_WORT_MEHRZAHL_EN}; “Custom exercise” sets a text for the whole
                class (upload a file, choose one from “My texts” or a template from the
                course - the pupils get a window with just “Continue”); “Weekly goal”
                sets the minutes per week; “Pause goal for 1 hour” sets 60 minutes in
                which the class keeps practising but nothing counts towards the weekly
                goal. Below that is the “Class overview” (month or school year, with
                the score bar and the line chart); on the right of its heading row is
                “Message to the class” - one message to all the pupils, each of whom
                gets it in a conversation of their own.
              </>
            )}
          </p>
          {tastenflow && (
            <p className="m-0">
              The button <strong>“Class settings”</strong> in the row opens: the year
              group (from this the app works out the kinds of text, and it moves up
              every school year; “Adults” does not move up), the language with its
              lock, the class's starting point (it also applies to pupils who join
              later) and Class Match. These four apply to the whole class and are
              already asked for when a class is created; for each pupil, “Where to
              start”, “One-handed typing” and “Take your time” stay in their expanded
              row.
            </p>
          )}
          {tastenflow && (
            <p className="m-0">
              The stages under <strong>“Where to start”</strong> are named after keys:
              “Beginner” is just F and J, “Home position” the whole home row (f j d k s
              l a ö). With <strong>“First letters + capitals”</strong>, the five most
              common further letters - e n i r t - are added, as well as the Shift key.
              “All letters”, “+ punctuation”, “+ numbers” and “Everything” then unlock
              the rest in turn.
            </p>
          )}
          <p className="m-0">
            Every button explains itself: its hint appears as soon as the pointer
            rests on it or the focus reaches it with the Tab key. <Taste>Esc</Taste>{" "}
            dismisses it.
          </p>
        </Abschnitt>

        {tastenflow && (
          <Abschnitt titel={`The ${W} step by step`}>
            <ol className="m-0 list-decimal space-y-1 pl-5">
              <li>
                At the very top of the class statistics, in the task row, the button
                “{W}” opens the form.
              </li>
              <li>
                Choose the <strong>key range</strong> - all the pupils get the same text
                with this key range.
              </li>
              <li>
                Enter the <strong>time limit</strong> in minutes - the field is right
                next to the key range.
              </li>
              <li>
                Tell the pupils: <em>The clock starts when you press your first key.</em>{" "}
                From the start they have {EINSTIEGSFENSTER_MIN} minutes to begin; the
                time limit runs separately for each pupil.
              </li>
              <li>
                <strong>“Start now”</strong> - the {W} starts straight away for the
                whole class.
              </li>
              <li>
                Straight afterwards you see, for example,{" "}
                <strong>“Ready: 12 of 14 - not yet: Said, Jano”</strong>: for 12 pupils
                the {W} has already reached their device. It appears there after about
                a second. If a pupil stays under “not yet” for longer, reloading the
                page once usually helps.
              </li>
              <li>While it is running, you see “Handed in: 3 of 18” with the names.</li>
              <li>
                Afterwards the results appear under the form: for each pupil the place,
                the <strong>score</strong>, whether the app read aloud, keystrokes per
                minute, accuracy, characters, mistakes and wobbly keys. A summary email
                comes as well.
              </li>
            </ol>
          </Abschnitt>
        )}

        {tastenflow && (
          <>
            <Abschnitt titel="What the columns of the table mean">
              <SpaltenHilfe />
            </Abschnitt>

            <Abschnitt titel="What the difficulty level means">
              <LeistungsstufeHilfe />
            </Abschnitt>

            <Abschnitt titel="The figures you can base a mark on">
              <DreiWerteHilfe />
            </Abschnitt>
          </>
        )}

        <Abschnitt titel="The class code">
          <p className="m-0">
            It is shown at the top next to the class name and applies to all the apps.
            To sign in, pupils enter the class code, their name and their password; the
            device remembers the code, and after that name and password are enough.
          </p>
          <p className="m-0">
            When you create a class, it is <strong>required</strong>. While you type the
            name, the app suggests a matching code - “MS-Wein” becomes “MSWEIN”. You can
            change it, but you can't leave it empty. You can change it later under
            “Pupils and logins” with “Edit”.
          </p>
          <p className="m-0">
            ⚠️ If you change the code, all the pupils in the class sign in with the new
            one from then on.
          </p>
        </Abschnitt>

        <Abschnitt titel="Moving a pupil to another class">
          <p className="m-0">
            Under “Pupils and logins”, every pupil has{" "}
            <strong>“Move to another class”</strong>. It opens the field “Class code of
            the new class”. This works for any class whose class code you know -
            including another teacher's class. Before the pupil is moved, the app asks
            you to confirm.
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>From then on, the pupil signs in with the new class code.</li>
            <li>The teachers of the new class can see the pupil and their progress.</li>
            <li>
              {/* Die Tippchallenge nur, wenn Tastenflow offen ist - wie im Deutschen. */}
              {tastenflow
                ? `The results of past ${PRUEFUNG_WORT_MEHRZAHL_EN} and the messages stay with the previous class.`
                : "The messages stay with the previous class."}
            </li>
          </ul>
        </Abschnitt>

        <Abschnitt titel="Keyboard shortcuts in this area">
          <p className="m-0">
            <Taste>Alt</Taste> + <Taste>H</Taste> opens and closes this help.{" "}
            <Taste>Alt</Taste> + <Taste>T</Taste> shows the list of all keyboard
            shortcuts. <Taste>Alt</Taste> + <Taste>U</Taste> takes you to your own
            practice. <Taste>Alt</Taste> + <Taste>N</Taste> opens the messages,{" "}
            <Taste>Alt</Taste> + <Taste>K</Taste> the colours and contrast menu and{" "}
            <Taste>Alt</Taste> + <Taste>J</Taste> the account menu.
          </p>
          <p className="m-0">
            Use the Tab key to move through the tabs; Enter switches. After a switch,
            the focus is in the new area - speech reads on from there.
          </p>
        </Abschnitt>

        <Abschnitt titel="More detail">
          <p className="m-0">
            You open the guide for teachers at the top with “Downloads” - that is
            also where you find the Tastenflow poster to print and put up (A3),
            which is open to everyone, no sign-in needed.
            {tastenflow && (
              <>
                {" "}
                The help inside the app itself is reached there with{" "}
                <Taste>Alt</Taste> + <Taste>H</Taste>.
              </>
            )}
          </p>
        </Abschnitt>
      </div>
    </Modal>
  );
}
