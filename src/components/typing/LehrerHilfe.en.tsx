/**
 * ★★★ DIE HILFE FÜR LEHRKRÄFTE AUF ENGLISCH (EN6b, 19.09.2026).
 * ===========================================================================
 * Übersetzung von `LehrerHilfe.tsx` (Stand 19.09.2026: „Monat" und Excel aus
 * K4, der Rundgang-Knopf aus Z4, das umbenannte Häkchen aus L5). Zu sehen nur
 * in der englischen Bedienung von Tastenflow; sonst zeigt `LehrerHilfe` die
 * deutsche Fassung.
 *
 * ── WARUM EINE EIGENE DATEI ────────────────────────────────────────────────
 * Dasselbe Muster wie `TippenHilfe.en.tsx` (EN7): Die Hilfe ist Fliesstext
 * mit Tasten und Hervorhebungen; in eine Texttabelle zerlegt, änderte jeder
 * zerteilte Satz die Textknoten der DEUTSCHEN Hilfe. Diese Datei steht
 * Abschnitt für Abschnitt (1 bis 12, samt 4a, 8a, 8b) in derselben Reihenfolge
 * wie die deutsche - wer eine Stelle prüft, findet sie in beiden. Fokus-Falle,
 * Schliessen und Rundgang sind dieselben Bauteile wie dort.
 *
 * ── WÖRTER ─────────────────────────────────────────────────────────────────
 * Glossar §3 und das englische Handbuch (`L` in
 * `scripts/tastenflow-handbuch-en.mts`) - die Knöpfe heissen hier genau so,
 * wie die englische Bedienung sie anschreibt: *My classes · Pupils and logins
 * · Create a new class · Create a class · Edit · Class settings · Custom
 * exercise · Start the custom exercise · My texts · Templates · Weekly goal ·
 * Apply to the class · Pause goal for 1 hour · Download as Excel · Class
 * overview · Key range · Start now · Past Typing Challenges*. Kind
 * (Lehrkraft-Sicht) ⇒ *pupil*, Leistungsstufe ⇒ *difficulty level* (nie
 * *level* allein), Schulstufe ⇒ *year group* mit Alter („Age 12-13" für die
 * 7. Schulstufe, Glossar §3.15), Tempo zählt nicht ⇒ *Take your time*,
 * Prüfung (Tippchallenge) ⇒ *test* bzw. *challenge*, nie *exam*.
 *
 * ── WAS BEWUSST ANDERS IST ALS IM DEUTSCHEN ────────────────────────────────
 *  · „übt automatisch die schwächsten" ⇒ *the keys that most need practice* -
 *    nie *weakest* (Glossar §1.4, §3.2).
 *  · „Satzanfang und Nomen groß" ⇒ *at the start of a sentence and, in German,
 *    for nouns*: Die Übungssprache kann Englisch sein.
 *  · Die Seite „Ausgleichende Maßnahmen" gibt es nur deutsch - ihr Name steht
 *    in `lang="de"`, und der Satz sagt es dazu.
 *  · Nur Bindestrich, keine Maus-Wörter (Glossar §1.3), Person zuerst.
 */
import { BrailleTabellenPunkte } from "./ScreenreaderHinweis";
import { AltText, Kbd } from "./TippenHilfeTeile";
import { useRef } from "react";
import {
  EINSTIEGSFENSTER_MIN,
  MIND_ZEICHEN,
  PROBEN_JE_NIVEAU,
  PRUEFUNG_WORT_EN,
  PRUEFUNG_WORT_MEHRZAHL_EN,
} from "@/lib/typing/schreibprobe";
import { SCORE_ERKLAERUNG_SIE_EN } from "@/lib/typing/score";
import { STEIGERUNG_HINWEIS_EN } from "@/lib/typing/schreibprobeHinweise";
import { FEHLER_GEWICHT, FEHLER_GEWICHT_FREI } from "@/lib/typing/schreibprobeWertung";
import { zahl } from "@/lib/bedienSprache";
import { useFocusTrap } from "./useFocusTrap";
import { DidaktikInhalt, didaktikAbschnittTitel } from "./DidaktikHinweise";
import { HandbuchKnopf } from "@/components/lernwerkstatt/HandbuchKnopf";
import { handbuecherFuer, tastenflowPlakat } from "@/lib/lernwerkstatt/handbuecher";
import { EN_LESSONS } from "@/lib/typing/curriculum";
// ★ E8 (24.09.2026, Bauplan §7/§10): die Reihenfolge des englischen Weges -
// für die Erklärung, dass eine Klasse auf Weg „en" eine ANDERE Folge lernt.
import { LERNWEGE } from "@/lib/typing/lernweg";
import { DreiWerteHilfe, LeistungsstufeHilfe } from "./TastenflowZahlenHilfe";
import { RundgangLehrkraftKnoepfe } from "./Rundgang";

/** Das Tastenflow-Handbuch - `HandbuchKnopf` bietet in der englischen Bedienung die englische Ausgabe an (EN7). */
function HandbuchLaden() {
  const h = handbuecherFuer("tippen")[0];
  if (!h) throw new Error("Kein Tastenflow-Handbuch in HANDBUECHER");
  return (
    <p className="m-0">
      <HandbuchKnopf alsLink handbuch={h} />
    </p>
  );
}

/**
 * The poster for hanging up at school (19.09.2026) - same button as the guide.
 * ★ Public since the same evening (advertising, not teaching material): the
 * button loads it without a permission. ★ Since 21.09.2026 the English screen
 * gets the English edition, `/tastenflow-plakat-en.pdf`.
 */
function PlakatLaden() {
  const h = tastenflowPlakat();
  // `div` instead of `p`: on an error the button shows its own paragraph (`role="alert"`).
  return (
    <div className="m-0">
      <HandbuchKnopf alsLink handbuch={h} />
    </div>
  );
}

// ★ 18.10.2026 (Johannes: „passe mac an Wahl-taste an"): `Kbd` und `AltText` aus
//   der Kinder-Hilfe - am Mac heißt die Taste „Wahl" (Option, Opción …), im
//   Kästchen wie im Satz. Vorher stand hier ein eigenes `Kbd`, das immer „Alt" zeigte.

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-hairline bg-surface-sunken p-4">
      <h3 className="m-0 mb-1 text-lg font-semibold text-ink">{title}</h3>
      <div className="space-y-2 text-ink-soft">{children}</div>
    </section>
  );
}

export function LehrerHilfeEnglisch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  // Wie in der deutschen Fassung: Fokus in den Dialog, Tab darin halten, KEIN
  // `restoreFocus` (Nr 14 der Fokusziele) - Escape schliesst über die Seite.
  useFocusTrap(open, cardRef, { initialFocus: closeRef });
  if (!open) return null;
  const W = PRUEFUNG_WORT_EN;
  const WM = PRUEFUNG_WORT_MEHRZAHL_EN;
  // ★ E8: die Reihenfolge des englischen Weges, nur für die Erklärung unten -
  // kein zweiter Zahlenblock, nur die Buchstaben.
  const enWeg = LERNWEGE.en;
  const enHomeRow = enWeg.letterOrder.slice(0, 8).map((c) => c.toUpperCase()).join(" ");
  const enNachGrundreihe = enWeg.letterOrder
    .slice(8, enWeg.lettersBeforeShift)
    .map((c) => c.toUpperCase())
    .join(" ");

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Help for teachers on Tastenflow"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        className="card my-8 w-full max-w-3xl space-y-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="m-0 text-xl font-semibold text-ink">
            Help for teachers: all the features of “Tastenflow”
          </h2>
          <button
            ref={closeRef}
            type="button"
            className="btn-secondary btn-toggle"
            onClick={onClose}
            aria-label="Close help"
          >
            ✕ Close
          </button>
        </div>
        <RundgangLehrkraftKnoepfe onStart={onClose} />

        <p className="m-0 text-ink-soft">
          “Tastenflow” has its <strong>own account system</strong>, completely separate
          from the LMS sign-in. Being signed in here doesn't affect the LMS session -
          and vice versa.
        </p>

        <Section title="1 · Creating classes and accounts">
          <p className="m-0">
            As a teacher, opening Tastenflow always takes you to{" "}
            <strong>“My classes”</strong>; “Practise yourself” (<Kbd>Alt</Kbd> +{" "}
            <Kbd>U</Kbd>) takes you to your own practice. With{" "}
            <strong>“Pupils and logins”</strong> at the top right you create a
            class - in the expandable section <strong>“Create a new class”</strong>. The{" "}
            <strong>class code</strong> is required: while you type the name, the app
            suggests a matching one (“MS-Wein” becomes “MSWEIN”); you can change it, for
            example to <code>3.MS</code>. The code applies to the whole class. In the same
            section you choose the <strong>year group</strong> and the{" "}
            <strong>starting point</strong> and check the language (with its lock) and
            Class Match - the same fields as under “Class settings”.{" "}
            <strong>“Create a class”</strong> only works once everything is filled in;
            otherwise a sentence says what is still missing, and the focus is in the
            first missing field.
          </p>
          <p className="m-0">
            Then you add learners with <strong>name + password</strong>. They can then
            sign in on <strong>any device</strong> with{" "}
            <em>class code + name + password</em>. The device remembers the class code,
            so the pupils only need to enter their name and password.
          </p>
          <p className="m-0">
            You can change the class name and class code later with{" "}
            <strong>“✏️ Edit”</strong> - a new code then applies to every pupil in the
            class (from then on they sign in with the new code).
          </p>
          <p className="m-0">
            <strong>New:</strong> since 9 August 2026, anyone who doesn't belong to a
            class can also <strong>create an account themselves</strong> - in the
            sign-in window, with the tick box “I'm practising on my own …” and an email
            address. Nothing changes for you: such accounts don't belong to any class,
            don't appear in any of your lists and receive their weekly report
            themselves. For your class everything stays as before - you add the pupils.
          </p>
        </Section>

        <Section title="2 · Class settings and settings for each pupil">
          <p className="m-0">
            <strong>For the whole class</strong> (the button “Class settings” in the
            task row above the table, next to {W}, Custom exercise, Weekly goal and
            Pause goal for 1 hour - even when collapsed, the button itself already shows
            the year group, language and Class Match):
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Year group:</strong> from this the app works out the text age
              group - the vocabulary, the kind of jokes and the tone of the practice
              texts. “Age 12-13” (the 7th year of school in Austria) means pupils of
              about 13, so texts for ages 11-15. <strong>It grows with the class:</strong>{" "}
              the app remembers the school year in which you entered it and moves up one
              year group every year, without you having to change anything. For groups
              of adults there is the year group <strong>“Adults”</strong> - it does not
              move up. A year of birth is no longer collected for pupils in a class.
            </li>
            <li>
              <strong>Language and lock:</strong> German or English for the practice
              words and texts of the whole class; with the lock next to it, the pupils
              can no longer change it themselves. Every pupil has the round{" "}
              <strong>EN</strong>/<strong>DE</strong> language button in the header: it
              switches buttons and menus and the practice texts along with them - with
              the lock, only buttons and menus.
              {/* ★ 19.09.2026: Sprachschalter für alle (Johannes). */}
            </li>
            <li>
              <strong>Starting point for the class:</strong> “where to start” as a
              default for the whole class - it also applies to every pupil who joins
              later, and it only ever adds: a pupil who is already further on loses
              nothing. When you choose it, the app enters the stage for the existing
              pupils at the same time; if some are already further on, it asks first and
              offers three options: set everyone, only those who aren't that far yet, or
              cancel. It takes effect as soon as a pupil next opens Tastenflow;
              statistics and badges are kept in every case.
            </li>
            <li>
              <strong>Allow Class Match:</strong> pupils can invite each other to a
              5-minute match. Under “Practice times” in the expanded row you can see how
              often a pupil played each week - no placing, no times.
            </li>
            <li>
              {/* ★ 23.09.2026: new class setting, prompted by a 3rd-year business
                  school class. */}
              <strong>Finish each line with Enter:</strong> ticked, every pupil in the
              class finishes every practice line with the Enter key - just like typing
              in an office. Applies to “My training”, stories, the custom exercise, the
              word games with lines, the Typing Challenge and Class Match; not to
              puzzles, the letter-jumble game, the one-key dictation, the expedition
              game or “Explore the keys”. Default: off.
            </li>
          </ul>
          <p className="m-0">
            <strong>For each pupil</strong> (behind the arrow in their row):
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Keyboard:</strong> can be chosen in Settings under “Keyboard” -
              German/Austrian, Swiss, US or UK keyboard. The setting applies to this
              device (not to the account) and controls the on-screen keyboard, the
              finger announcements and which characters are practised. On the Swiss
              keyboard there is no ß (you write “ss” there); on English keyboards there
              is no ä ö ü ß - German texts then appear with the substitute spellings
              (ä → ae).
            </li>
            <li>
              <strong>Where to start:</strong> the same list of stages as the class's
              starting point (see above) - here for the one pupil who needs an
              exception. More experienced pupils skip the basics and start further on
              (e.g. only from the numbers); moving a pupil back asks first.
            </li>
            <li>
              <strong>One-handed typing:</strong> removes the opposite-hand Shift rule
              for this pupil - capital letters and symbols then count with either Shift
              key.
            </li>
            <li>
              <strong>Take your time:</strong> speed isn't judged anywhere for this pupil
              - no time limit in the game, no speed goal for the stars, no moving up or
              down the difficulty level because of speed. For pupils who type carefully
              but very slowly.
            </li>
            <li>
              <strong>Wide letter spacing (CVI):</strong> more space between every
              character while copying, in three steps (double, triple, four times) - for
              pupils with cerebral visual impairment (CVI), for whom characters that
              stand close together run into each other. The pupil can also change the
              spacing in their own settings (the cog, <AltText>Alt + O</AltText>) - and you can change it
              back here at any time. Whichever was chosen last applies.
            </li>
          </ul>
          <p className="m-0">
            Everything can be changed at any time - the four class settings in the panel
            “Class settings” above the table, the settings for each pupil in their
            expanded row.
          </p>
        </Section>

        <Section title="3 · The difficulty level (1-50): the heart of it all">
          <LeistungsstufeHilfe />
          <p className="m-0">
            The <strong>current difficulty level</strong> is shown in the table (column{" "}
            <strong>“Difficulty level”</strong>) and at the top of the practice screen.
            You don't need to set anything - only switch on “Take your time” if needed.
          </p>
        </Section>

        <Section title="4 · “My training”: adaptive, by letter frequency">
          <p className="m-0">
            “Tastenflow” has <strong>one</strong> practice path that each pupil follows
            for themselves - and it <strong>adapts</strong>: the app measures every key
            separately, automatically practises the keys that most need it and only
            unlocks a new key once the previous ones are secure.
          </p>
          <div className="rounded-xl border border-accent bg-accent-soft p-3">
            <p className="m-0 font-semibold text-ink">Order by letter frequency</p>
            <ul className="m-0 mt-1 list-disc space-y-1 pl-5">
              <li>
                After the home position, the <strong>most common</strong> letters come
                first - so after just a few keys there are <strong>real words</strong>{" "}
                (the same principle as the online trainer keybr).
              </li>
              <li>
                <strong>Every learning path is different</strong> - which key comes next
                depends on the pupil, not on a fixed list.
              </li>
              <li>
                <strong>No fixed end</strong> - ideal for daily, independent practice.
              </li>
            </ul>
          </div>
          <p className="m-0 rounded-xl border border-warning/40 bg-warning/10 p-3">
            <strong>What you should know for your planning:</strong> the underlying
            course follows the rows of the keyboard (“from the middle outwards”: home
            position → top/bottom row → umlauts → punctuation → numbers → symbols →
            whole texts, much as in Typewriter, used by many Swiss cantons; “My
            training” itself follows almost the same order as TIPP10). In it, the{" "}
            <strong>most common German consonant, n, only comes late</strong> (as the
            very last letter) - “My training” makes up for this by practising n as one of
            the first letters after the home position (with e, i, r, t): real sentences
            come almost at once, the first stories from 13 keys.
          </p>
          <p className="m-0 rounded-xl border border-hairline bg-surface-raised p-3">
            <strong>A class on the English course order:</strong> a class that
            starts under an English interface follows a DIFFERENT order from the
            one above. After the home row (<strong>{enHomeRow}</strong>) come
            the most common English letters as one block (
            <strong>{enNachGrundreihe}</strong>), so words such as “the”, “and”,
            “you” are typable far earlier than under the German order. This
            course has its own {EN_LESSONS.length} lessons.{" "}
            <strong>A class run with a German interface keeps the German order
            above</strong>, even where it practises English words - the order
            is decided once, by the interface language at the very first
            practice line, and never changes afterwards.
          </p>
          <p className="m-0">
            <strong>The same text for the whole class:</strong> the curated texts of the
            course (home position, rows of letters, umlauts, punctuation, numbers,
            symbols, whole texts) are available to you as <strong>templates</strong> in
            the area <strong>“Custom exercise”</strong> in “My classes” - choose one, and
            the whole class practises the same text, whatever stage each pupil has
            reached (just as with an uploaded file, it counts as practice time, and no
            new keys are unlocked by it).
          </p>
          {/* ★ 21.09.2026: two more kinds of templates. */}
          <p className="m-0">
            <strong>Foreign words and program code:</strong> for classes practising in
            German, the most common <strong>foreign words</strong> are there as well - each
            line gives the German word or a short description first, then the foreign
            word, and the pupils simply copy both. The words suit the age group of the
            class and are grouped by topic. For the <strong>Typing Challenge</strong>
            with your own file there are the same words again, but in different files and
            in alphabetical order. There is also <strong>program code</strong> to copy
            (ten languages, real source code from open projects, different extracts from
            those in the Typing Challenge) - in “Custom exercise” only.
          </p>
        </Section>

        <Section title="4a · “Custom exercise”: one text for the whole class">
          <p className="m-0">
            With the button <strong>“Custom exercise”</strong> in the task row of the
            class statistics you set a text that the whole class practises - whatever
            stage each pupil has reached. There are three ways to the text:{" "}
            <strong>upload a file</strong> (.txt or .docx), choose a text you saved
            earlier from <strong>“My texts”</strong>, or use one of the{" "}
            <strong>templates</strong> from the course (see point 4).
          </p>
          <p className="m-0">
            <strong>“My texts”</strong> is your own permanent store - it belongs to your
            account, not to the class, and only you can see it. When you upload a file,{" "}
            <strong>“Save in My texts”</strong> (on by default) automatically keeps a
            copy there, so that you can use the same text again later without uploading
            the file again.
          </p>
          <p className="m-0">
            If the file contains characters that can't be typed, the panel lists them
            before the start - you decide whether to correct the file or start anyway
            (the remaining characters are then left out of the lines, never counted as a
            required keystroke).
          </p>
          <p className="m-0">
            <strong>“Start the custom exercise”:</strong> every pupil immediately gets a
            window <em>“Next up: an exercise from your teacher.”</em> - they can only
            press <strong>“Continue”</strong>, not decline it. For each pupil the
            exercise ends by itself as soon as they have typed the text once; after that
            they carry on practising as normal.
            <strong> “End the exercise”</strong> ends it early for the whole class.
          </p>
          <p className="m-0">
            The exercise counts as practice time and is measured like any other round,
            including the wobbly keys - but it <strong>doesn't unlock any new key</strong>:
            which keys come up is decided by the file alone.
          </p>
        </Section>

        {/* ★ D-9 (28.09.2026): Didaktik - Sätze aus `lib/typing/didaktikHinweise.ts`. */}
        <Section title={didaktikAbschnittTitel("en")}>
          <DidaktikInhalt lang="en" />
        </Section>

        <Section title="5 · Meaningful texts from the start">
          <p className="m-0">
            The trainer shows real, age-appropriate texts{" "}
            <strong>as early as possible</strong> - jokes, proverbs, sayings,
            non-fiction and facts, tongue twisters, wordplay and whole sentences. A text
            appears as soon as its <strong>letters</strong> have been learnt; pure “word
            salad” is the exception (only to practise a brand-new key on purpose).
          </p>
          <p className="m-0">
            <strong>Capital letters:</strong> the{" "}
            <strong>spelling is always correct</strong> (capitals at the start of a
            sentence and, in German, for nouns) - the pupils never see a wrongly spelt
            word. At first the <strong>small</strong> letter is enough for this; the
            capital appears automatically (“auto-capitals”, for{" "}
            <strong>all age groups</strong>, because correct spelling matters at every
            age).
          </p>
          <p className="m-0">
            In <strong>“My training”, the real Shift key comes early</strong> - right
            after the first common letters, as soon as there are enough real nouns to
            practise (not only after the whole alphabet). From then on, capitals are
            typed “for real” with Shift. That way the pupils soon learn real
            capitalisation <strong>themselves</strong>, instead of relying on the
            automatic help for a long time.
          </p>
          <p className="m-0">
            <strong>Punctuation</strong> (full stop, comma, question mark …) only appears
            once it has been learnt - before that the sentence is shown “without full
            stops and commas”. A <em>letter</em> or <em>digit</em> key that hasn't been
            learnt yet, on the other hand, is <strong>never</strong> required.
          </p>
        </Section>

        <Section title="6 · Stars, badges and sounds (important for pupils who are blind)">
          <p className="m-0">
            Every round gives <strong>1-3 stars</strong> for accuracy and speed -{" "}
            <strong>accuracy counts three times as much</strong>: 3 stars always require
            about 96% correct (fast, sloppy typing isn't rewarded); a round without a
            mistake, on the other hand, gets 2 stars for certain, even at the slowest
            speed. Each number of stars has its <strong>own sound</strong>; when a pupil{" "}
            <strong>moves up a level</strong>, a special cheering sound plays. These
            sounds are the main feedback for pupils with a visual impairment. The{" "}
            <strong>🔇 button</strong> switches the sound off in a quiet classroom.
          </p>
          <p className="m-0">
            On top of that there are <strong>badges</strong> with child-friendly names
            (“Bullseye”, “Precision Penguin”, “Marathon Mouse” …) - in families with
            rising stages and a “next goal” that can always be announced. Only the 7- to
            10-year-olds see the mascot names; from the text age group 11-15 onwards, the
            neutral second name (“Clean hat-trick”) appears everywhere. The badges
            themselves are the same - earned stays earned, even when the text age group
            changes. Almost all of them reward <strong>accuracy and sticking with it</strong>;
            the only speed badge requires 95% accuracy. A new badge brings its own
            “ta-dah” sound with an announcement and then appears at the very top of the
            statistics (for the pupil and for you - the same view). Every medal can be{" "}
            <strong>selected</strong> and then appears in the large view with an effect.
          </p>
          <p className="m-0">
            The <strong>Ice Floe game 🐧</strong> is the reward after a new key in “My
            training”: the penguin crosses a course made of the pupil's{" "}
            <strong>wobbliest characters</strong> (sometimes floes across the water,
            sometimes also a letter mountain with a belly slide).{" "}
            <strong>The key is already unlocked before that</strong> - since 14 August
            2026, progress no longer depends on any game (before, it was a gate, and it
            invisibly penalised exactly the slow, careful pupils). Any number of tries,
            no game over; where only accuracy is required (and at difficulty level 1)
            there is <strong>no time pressure</strong> (a time limit that can be switched
            off, as WCAG requires). In addition, learners in the text age groups{" "}
            <strong>7-10 and 11-15</strong> can start the game voluntarily at any time
            with the <strong>Play</strong> button - as a “daily adventure” with{" "}
            <strong>bonus fish</strong> (a fish call and an announcement of the
            character; missing one isn't a mistake) and the <strong>Echo Cave</strong>,
            where each key is only announced (there the app speaks even when read aloud
            is switched off - pupils who are blind and pupils who can see play in
            exactly the same way; the cave deliberately NEVER appears in the reward
            round). A run without a mistake ends with the northern lights; completed
            adventures, fish and runs without mistakes earn the badge family{" "}
            <strong>“Adventures”</strong>. Important for your assessment: the game does{" "}
            <strong>not count as practice time</strong> and not towards the weekly goal -
            it is purely for motivation.
          </p>
          <p className="m-0">
            <strong>Two different ways into the game - please don't mix them up:</strong>{" "}
            the <strong>Play</strong> button is the free way in that the learners press
            themselves; it is there for <strong>7-10 and 11-15</strong>, not from 16.
            The round <strong>after a new key</strong>, on the other hand, comes by
            itself: always for 7-10, never from 16, and for 11-15 only if the Ice Floe
            game is selected in Settings under <strong>“Reward game”</strong> instead of{" "}
            <strong>None</strong> (the default). The setting belongs to the{" "}
            <strong>device</strong>, not to the account - like the keyboard layout. On a
            class computer it therefore applies to everyone who practises there.
          </p>
          <p className="m-0">
            <strong>Dropped on 22 August 2026:</strong> the <em>typing sprint</em> - three
            lines of groups of three of the wobbliest characters, until then the default
            for 11-15. It duplicated practice without adding any fun: “My training”
            already favours the keys that need work, so the pupil only practised the same
            thing again, just in a window. <strong>Reversed on 31 August 2026:</strong> on
            22 August the free way into the game from 11 had also been removed - the{" "}
            <strong>Play</strong> button is back there. What 11- to 15-year-olds still do
            NOT get is the interruption after every new key.
          </p>
        </Section>

        <Section title="7 · Weekly goal">
          <p className="m-0">
            For each pupil you set <strong>minutes per week</strong> - without units.
            “Apply to the class” writes the same value for all the pupils in the class
            at once, and it also applies to pupils who join later.
          </p>
          <p className="m-0">
            A change always applies <strong>from 8am on the next Monday</strong> - the
            current week keeps its previous goal. A pop-up names the exact date before
            saving.
          </p>
          <p className="m-0">
            <strong>Catching up:</strong> if “Catch up on missed minutes from previous
            weeks” is ticked, minutes missed in earlier weeks may all be made up at once.
          </p>
          <p className="m-0">
            <strong>Excuse a week</strong> (e.g. in case of illness) and{" "}
            <strong>Clear overdue minutes</strong> stay as before - for each pupil,
            without changing the time practised.
          </p>
          <p className="m-0">
            <strong>Pause goal for 1 hour:</strong> a separate button for the whole
            class, for 60 minutes. The pupils still practise - practice time and
            statistics keep counting, just not towards the weekly goal for that hour.
            Pressing the same button a second time ends the pause early.
          </p>
        </Section>

        <Section title="8 · Statistics and progress over time (expandable for each pupil)">
          <p className="m-0">
            With the round arrow button<span aria-hidden="true"> ▸</span> in front of the
            name you open six rows that can each be collapsed, from top to bottom:{" "}
            <strong>Settings</strong> (the settings from point 2, for this one pupil),{" "}
            <strong>{WM}</strong> (only if at least one was done),{" "}
            <strong>Practice times</strong> (for each week, with the state of the weekly
            goal that week and - if they played - the number of Class Matches, plus the
            year summary for the whole school year), <strong>Wobbly keys</strong>,{" "}
            <strong>Badges</strong> and - only if a value stands out -{" "}
            <strong>Independent work</strong> (see point 9).
          </p>
          <p className="m-0">
            At the top of “Practice times” you see how many Class Matches the pupil has
            taken part in (counted in this class; the hint on the counter says how far back
            the count goes); press Enter on a week to open its individual practice times -
            day, start and end time, pure typing time and what was practised.
          </p>
          <p className="m-0">
            What is no longer shown separately here - figures at a glance, progress over
            time, key progress, stories &amp; non-fiction - isn't lost: it is all in the
            pupil's <strong>“My statistics”</strong>, and there you see exactly the same
            view as the pupil.
          </p>
          <p className="m-0">
            <strong>The score:</strong> {SCORE_ERKLAERUNG_SIE_EN}
          </p>
          <p className="m-0">
            <strong>In the class table</strong>, three columns stand together under the
            heading <strong>“Practice”</strong>: accuracy, keystrokes/min and score. All
            three come from practice in the chosen period, and the score combines the
            other two. That is why they are lightly shaded and framed by a thin line;
            speech announces “Practice” before the column heading. The column{" "}
            <strong>“{W}”</strong> on the far right deliberately stands outside this
            group - under the heading “Challenge”: it is a test on one particular day,
            not daily practice.
          </p>
          <p className="m-0">
            In the column <strong>“Score”</strong>: anyone who has typed fewer than 200
            characters in the chosen period gets no score, just a dash - below that, a
            single wrong key decides several points.
          </p>
          <p className="m-0">
            <strong>“Download as Excel”</strong> is above the table, to the right of “All
            time”. The button downloads the table as the file{" "}
            <strong>classname_date.xlsx</strong> (for example “3a_2026-09-12.xlsx”) -
            whichever period is currently chosen. At the front there is an overview with
            links to the four periods and a key that explains every column and shows how
            the score is worked out. Then come four sheets: the current school year, all
            time, the month (the last 4 weeks) and this week. The values are stored as
            numbers, so that you can carry on calculating in Excel; where the table shows
            a dash, the file shows a dash too.
          </p>
          <p className="m-0">
            <strong>The class overview</strong> above the table shows the class as a
            whole. “Month” (the last 4 weeks) is preselected, “School year” is next to
            it. One line gives keystrokes/min, accuracy and weekly goals, each with a
            small trend - for the month compared with the 4 weeks before, for the school
            year the first compared with the last practice weeks. The hint shows the
            whole sentence when the pointer rests on it; speech reads it out at the
            number, together with the pupils who didn't practise in the period.
          </p>
          <p className="m-0">
            <strong>The dot bar “Scores across the class”</strong> shows one dot per
            pupil. Use the Tab key to jump onto the bar and the arrow keys to go from one
            pupil to the next - each stop is announced (“Mia, 78 points”). How many
            pupils are under 50, between 50 and 70, between 70 and 85 and over 85 points,
            and who has typed too little, is in the hint on its heading.
          </p>
          <p className="m-0">
            <strong>The line chart “Class score across the school year”</strong> shows,
            for each week, the average of the pupils with at least 5 lines; a gap means
            that the week had too little practice. Use the Tab key to jump onto the chart
            and the arrow keys to go from week to week; for speech, all the weeks are
            also in a table. When the Shift key, numbers or symbols are newly added, the
            line drops for a short time - that is to be expected and no reason to worry.
          </p>
          <p className="m-0">
            <strong>The curve:</strong> {STEIGERUNG_HINWEIS_EN}
          </p>
          <p className="m-0">
            <strong>Transparency:</strong> every pupil sees exactly the same figures about
            themselves under “My statistics” - you never see more than the pupil does.
          </p>
        </Section>

        <Section title="8a · The figures you can base a mark on">
          <DreiWerteHilfe />
        </Section>

        <Section title={`8b · The ${W}: a test for the whole class`}>
          <p className="m-0">
            In the teacher area <strong>“My classes”</strong>, at the very top of
            Tastenflow's <strong>class statistics</strong>, in the task row, is the
            button <strong>“{W}”</strong>. It opens the form with which you start a test
            for the whole class - <strong>all the pupils get the same text</strong>,
            however far they have got in the course.
          </p>
          <p className="m-0">
            <strong>There are three things to set:</strong> the{" "}
            <strong>key range</strong> (from “Home row” to “All keys”), right
            next to it the <strong>type</strong>, and the{" "}
            <strong>time limit</strong> in minutes. <strong>“Start now”</strong> starts
            it straight away.
          </p>
          {/* ★ 23.09.2026 („Freies Schreiben", E6): siehe die deutsche Fassung. */}
          <p className="m-0">
            <strong>Strict</strong> (the default) is as before: a wrong key
            does not move on, every wrong key counts - even one put right
            straight away. <strong>Free writing</strong> matches a dictation,
            the kind pupils know from the Typewriter test: mistakes stay as
            typed and are not marked, and Backspace only corrects within the
            current line. What is scored is only worked out at the end, from
            what is still wrong - at most one mistake per word, the last,
            unfinished word does not count, and corrected spots do not count
            at all. Because a mistake left standing has not cost any typing
            time of its own, it weighs more: {FEHLER_GEWICHT_FREI} instead of{" "}
            {FEHLER_GEWICHT} characters (8a). Choose “Free writing” when the
            class should practise a dictation without a wrong key holding up
            their typing; choose “Strict” to test the key presses
            themselves.
          </p>
          <p className="m-0">
            <strong>Three clocks you need to keep apart:</strong>
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              The <strong>start</strong> - the moment you press “Start now”. From then
              on, the class may begin.
            </li>
            <li>
              The <strong>window for starting</strong>: {EINSTIEGSFENSTER_MIN} minutes
              from the start. Until then a pupil can still begin; anyone who comes later
              is too late.
            </li>
            <li>
              The <strong>time limit</strong> runs <strong>separately for each pupil</strong>,
              and only from their <strong>first keystroke</strong>. So two pupils in the
              same class finish at different times - that is intended: anyone who first
              has to find their place loses no time.
            </li>
          </ul>
          <p className="m-0">
            <strong>The texts:</strong> for each key range there are{" "}
            <strong>{PROBEN_JE_NIVEAU} challenge texts</strong> of at least{" "}
            {zahl(MIND_ZEICHEN, "en")} characters each - so long that the text never
            runs out, even at high speed. They <strong>don't appear in the course</strong>,
            so no pupil can have practised them beforehand. The next {W} with a key range
            starts where the pupil who got furthest last time stopped: at the next line,
            or for texts with sentences, at the start of the next sentence. If a text
            runs out during the {W}, the pupils carry on in the next one without a break.
          </p>
          <p className="m-0">
            <strong>Pupils who are blind:</strong> they do the {W} with the app's{" "}
            <strong>read aloud</strong> (<Kbd>Alt</Kbd> + <Kbd>V</Kbd>) - just as when
            practising, without a separate tick box for the teacher. The time a pupil
            spends waiting for the voice is taken off by the challenge clock itself; a
            pupil who can see the text and still has it read aloud gets the same time
            taken off.
          </p>
          <p className="m-0">
            <strong>The results</strong> are in the expanded panel under “Past {WM}” -
            the button “{W}” at the front of the row expands it: for each pupil the place,
            the <strong>score</strong>, whether the app read aloud, speed, accuracy and
            the wobbly keys. How the score is worked out is explained in 8a. As soon as
            the {W} is over for the <strong>whole class</strong>, a{" "}
            <strong>summary email</strong> with the same figures arrives as well. Only
            then - an email while someone is still typing would be incomplete, and nobody
            wants a second one saying “this time really everyone”.
          </p>
          <p className="m-0">
            A pupil can choose <strong>“I'll sit this one out”</strong>. They then carry
            on practising as normal and appear in the results as{" "}
            <strong>“did not take part”</strong>. Every pupil later sees their own {WM}{" "}
            under <strong>“My statistics”</strong> - the same figures that you see.
          </p>
        </Section>

        <Section title="9 · Independent work / AI check (only for you)">
          <p className="m-0">
            The column <strong>“Independent work”</strong> shows a value from{" "}
            <strong>1-10</strong>. It rises with indicators that something was not typed
            by the pupil themselves: <em>pasting</em>, frequent switching of windows or
            focus, implausibly high speed or flawless accuracy without any learning
            history. <strong>Only you</strong> see this value, not the pupils.
          </p>
        </Section>

        <Section title="10 · Accessibility">
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Contrast and text size:</strong> via the bar at the top (light,
              dark, high contrast); <Kbd>Alt</Kbd> + <Kbd>+</Kbd> / <Kbd>-</Kbd> makes the
              typing field bigger or smaller.
            </li>
            <li>
              <strong>Read aloud</strong> (self-voicing) with <Kbd>Alt</Kbd> +{" "}
              <Kbd>V</Kbd> - for pupils who don't have a screen reader set up (with
              NVDA/JAWS/VoiceOver it is better left off). You can choose whether{" "}
              <em>letters / words / sentences</em> are read aloud, the speech rate and{" "}
              <strong>which voice</strong>. With the language set to English, the app
              automatically switches to an English voice; if there isn't one,
              installation instructions appear. The{" "}
              <strong>read-aloud time is taken out of the speed</strong> - braille
              learners who need read aloud are therefore not at a disadvantage in
              keystroke rate and statistics.
            </li>
            <BrailleTabellenPunkte weg="en" />
            <li>
              <strong>Finger announcement:</strong> pressing the <Kbd>Shift</Kbd> key
              twice quickly announces the right finger.
            </li>
            <li>
              <strong>Focus management (22 August 2026):</strong> every button has a
              defined target - whoever presses it knows afterwards where the typing
              cursor is. For pupils who work with a braille display, that is the
              difference between carrying on and searching. Three rules from this that
              you will notice in class: <Kbd>Esc</Kbd> closes every window and always
              leads <strong>back to the typing field</strong>; a change of view
              (statistics, library, sign-in) lands on the{" "}
              <strong>heading of the new view</strong> and announces it; and{" "}
              <strong>nothing disappears by itself</strong> - even the unlock celebration
              waits until the pupil presses “Continue”.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>E</Kbd> jumps into the typing field, <Kbd>Alt</Kbd> +{" "}
              <Kbd>H</Kbd> opens the help.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>U</Kbd> switches to practice, <Kbd>Alt</Kbd> +{" "}
              <Kbd>S</Kbd> to <strong>“My classes”</strong> (while practising: to your
              own statistics); <Kbd>Alt</Kbd> + <Kbd>Z</Kbd> announces which line you
              are on.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>D</Kbd> gives the practice time - on the braille
              display and (with read aloud) as an announcement.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>T</Kbd> opens or closes the{" "}
              <strong>list of keyboard shortcuts</strong>.
            </li>
          </ul>
        </Section>

        <Section title="11 · Deleting">
          <p className="m-0">
            Individual learners or a whole class can be deleted permanently (with their
            account, progress and results). This can't be undone - you are asked to
            confirm first.
          </p>
        </Section>

        <Section title="12 · Downloads: the guide and the poster (PDF)">
          <p className="m-0">
            Everything in this help, and a lot more, is in the{" "}
            <strong>guide for teachers</strong>: both learning worlds with all learning
            steps and their order (every lesson, the complete order of introduction), all
            stories and non-fiction series with the points at which they open, all badges
            and reward systems, plus a <strong>checklist “Is your class ready to go?”</strong>{" "}
            and a <strong>photocopiable: progress per pupil</strong>.
          </p>
          <HandbuchLaden />
          <p className="m-0 text-sm text-ink-muted">
            The guide is generated directly from the app's contents - a guard in the
            source code makes sure it is updated with every change to the content. So it
            is always complete and up to date.
          </p>
          <p className="m-0">
            For the wall of a classroom or staff room there is the{" "}
            <strong>Tastenflow poster for hanging up at school</strong>: A3, portrait, ready
            to print - what Tastenflow can do at a glance, with a QR code to tastenflow.org.
            Unlike the guide, the poster is open to everyone, no sign-in needed: pupils
            find it in their help, and you can pass the address
            tastenflow.org/tastenflow-plakat-en.pdf on to any school or organisation.
            The German edition is at tastenflow.org/tastenflow-plakat.pdf.
          </p>
          <PlakatLaden />
          <p className="m-0 text-sm text-ink-muted">
            You also find both in “My classes” under “Downloads”.
          </p>
        </Section>
      </div>
    </div>
  );
}
