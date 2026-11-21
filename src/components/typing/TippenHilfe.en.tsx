/**
 * ★★★ DIE KINDER-HILFE AUF ENGLISCH (EN7, 19.09.2026).
 * ===========================================================================
 * Übersetzung von `TippenHilfe.tsx` (Stand N15, 19.09.2026). Zu sehen nur in
 * der englischen Bedienung von Tastenflow; sonst zeigt `TippenHilfe` die
 * deutsche Fassung.
 *
 * ── WARUM EINE EIGENE DATEI ────────────────────────────────────────────────
 * Dasselbe Muster wie die Rechtstexte (EN8, `Datenschutz.en.tsx`): Die Hilfe
 * ist Fliesstext mit Tasten, Hervorhebungen und DREI Tonlagen. In
 * `texte({de, en})` zerlegt, änderte jeder zerteilte Satz die Textknoten der
 * deutschen Hilfe. Diese Datei steht Abschnitt für Abschnitt in derselben
 * Reihenfolge wie die deutsche - wer eine Stelle prüft, findet sie in beiden.
 *
 * ── DIE DREI TONLAGEN (Glossar §1.5) ───────────────────────────────────────
 * Englisch hat kein Du/Sie; der Unterschied liegt im Ton:
 *  · Kind (7-10, Detail 1): kurz, warm, ein Gedanke je Satz; höchstens EIN
 *    Ausrufezeichen je Absatz.
 *  · Jugend (11-15) und Erwachsen: dieselben Absätze wie im Deutschen
 *    (dort unterscheidet sich nur „du"/„Sie"), knapp und sachlich, ohne
 *    Ausrufezeichen.
 *
 * ── WAS BEWUSST ANDERS IST ALS IM DEUTSCHEN ────────────────────────────────
 *  · Der Abschnitt „Zum Anhören: die Einführung 🎧" fehlt: In der englischen
 *    Bedienung gibt es keinen Einführungs-Podcast (Johannes 12.09.2026,
 *    Glossar §4) - und im Zahnrad keinen Knopf „Einführung".
 *  · „Klick eine Medaille an" ⇒ *select a medal* (Glossar §1.3, ohne Maus).
 *  · „Deutsch braucht große Buchstaben … (Hund, Schule, Tisch)": Die Übungs-
 *    sprache kann Deutsch oder Englisch sein - der Satz sagt darum, dass
 *    DEUTSCH jedes Nomen gross schreibt; die Beispiele bleiben deutsch in
 *    `lang="de"`.
 *  · „rechts in der Leiste „Deine Tasten"": Diese Leiste gibt es seit dem
 *    25.08.2026 nicht mehr (`StandZeile.tsx`); die nächste Taste steht in der
 *    Zeile unter dem Übungsfeld (*Next key*). Die englische Fassung zeigt
 *    dorthin, und die deutsche Fassung wurde nachgezogen (N15d, 19.09.2026):
 *    „rechts in der Zeile unter dem Übungsfeld: „Nächste Taste"".
 *  · Knopfnamen stehen so, wie die englische Bedienung sie anschreibt
 *    (*Play*, *Class Match*, *Class Match in progress* - `StandZeile.tsx`,
 *    `klassenmatch.ts`), ohne die alten Emojis 🐧/⚔️ davor.
 *  · Der Absatz „Ohne Klasse üben" steht hier ausgeschrieben: Der deutsche
 *    Satz kommt aus der gemeinsamen Anmeldung (`OHNE_KLASSE_HILFE` in
 *    `SchuelerAnmeldung.tsx`, EN6) und nennt das Häkchen mit seinem deutschen
 *    Namen. Das Häkchen heisst englisch nach dem Glossar (§3.9).
 *
 * Nur Bindestrich, keine Maus-Wörter, Person zuerst, nichts gegen ein Kind.
 * Wächter: `tests/tastenflow-englisch-hilfe-handbuch.test.tsx`.
 */
import { JawsRueckweg } from "./ScreenreaderHinweis";
import { useRef } from "react";
import {
  EINSTIEGSFENSTER_MIN,
  PRUEFUNG_WORT_EN,
  PRUEFUNG_WORT_MEHRZAHL_EN,
  SCORE_ERKLAERUNG_EN,
  STEIGERUNG_HINWEIS_EN,
  activeLayout,
  bedienCopy,
  copyFor,
  lektionenFuer,
  layoutLetterOrder,
  layoutTexte,
  skinForStufe,
  unitGlyph,
  unitLabelEn,
  usesMascots,
} from "@/lib/typing";
import { lernwegDef } from "@/lib/typing/lernweg";
import { ABZEICHEN_EN } from "@/lib/typing/badgesEn";
import { downloadAdresse, groesse, handbuchInSprache, tastenflowPlakat } from "@/lib/lernwerkstatt/handbuecher";
import { useFocusTrap } from "./useFocusTrap";
import { Zeichenerklaerung } from "@/lib/arbeitsblatt/Zeichenerklaerung";
import { AltText, Kbd, Section, detailFor, type TippenHilfeProps } from "./TippenHilfeTeile";
import { AltOderWahl, WeitereTasten } from "./TippenHilfeTasten";
// ★ Z4 (19.09.2026): „Rundgang noch einmal" - der Rundgang beim ersten Betreten.
import { RundgangNochmalKnopf } from "./Rundgang";
import { hoehleHatWesen } from "@/lib/typing/expedition/texts";

/** Der Name eines Abzeichens, wie die englische Statistik ihn zeigt. */
function abzeichen(id: string, maskottchen: boolean): string {
  const a = ABZEICHEN_EN[id];
  if (!a) return id;
  return maskottchen ? a.name : (a.nameNeutral ?? a.name);
}

export function TippenHilfeEnglisch({ open, onClose, stufe, lernweg = "de" }: TippenHilfeProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  // Wie die deutsche Fassung: Fokus in den Dialog, Tab darin halten.
  useFocusTrap(open, cardRef, { initialFocus: closeRef });
  if (!open) return null;

  const skin = skinForStufe(stufe);
  const isAdult = skin === "erwachsen";
  // Die Kinder-Tonlage (7-10): warm, ein Ausrufezeichen darf sein.
  const kind = skin === "kind";
  const detail = detailFor(stufe);
  // ★ E2 (24.09.2026): die Reihenfolge DES WEGES, nicht mehr fest die
  // deutsche (Bauplan §6.3) - auf DE/CH-Tastatur mit der 8. Grundtaste des
  // Weges (siehe `layoutLetterOrder`).
  const letters = layoutLetterOrder(lernweg);
  // ★ 28.09.2026: das Höhlenwesen (deutsche Aufnahmen) gibt es nur auf Weg „de".
  const hoehleMitWesen = hoehleHatWesen(lernweg);
  const punctOrder = lernwegDef(lernweg).punctOrder;
  const layoutHinweis = layoutTexte(activeLayout(), "en").hinweis;
  // „Game level" (Kind) / „Level" (ab 11) - dieselben Wörter wie Ring und Ansage.
  const ringLabel = bedienCopy(stufe, "en").progressLabel;
  const ringWort = ringLabel.toLowerCase();
  const xp = copyFor(stufe).xpUnit === "XP";
  const maskottchen = usesMascots(skin);
  // ★ E6c (24.09.2026, Bauplan §6.3): die Lektionsfolge DES WEGES, nicht mehr
  // fest die deutsche - Weg „en" hat eine eigene, kürzere Folge ohne Umlaute.
  const lektionen = lektionenFuer(lernweg);
  // Die Lektion, in der das n kommt - gerechnet, nicht abgeschrieben.
  const lektionMitN = lektionen.findIndex((l) => l.newKeys.includes("n")) + 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Help for Tastenflow"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        className="card my-8 w-full max-w-2xl space-y-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="m-0 text-xl font-semibold text-ink">Help - how Tastenflow works</h2>
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

        {/* ★ Z4: der Rundgang durch die Übungsseite, noch einmal (schliesst die Hilfe). */}
        <RundgangNochmalKnopf onStart={onClose} />

        {/* 1) Sofort losschreiben - für alle */}
        <Section title="Just start typing">
          <p className="m-0">
            You don't need to select anything first. Just start typing - the first
            letter goes straight into the field. If you end up somewhere else,{" "}
            <Kbd>Alt</Kbd> + <Kbd>E</Kbd> takes you straight back to the typing field.
          </p>
          <JawsRueckweg weg="en" />
          {detail === 1 && (
            <p className="m-0">
              Always type with the right finger - the keyboard at the bottom shows
              you which key is next. Press the <Kbd>Shift</Kbd> key twice quickly,
              and you'll hear which finger to use.
            </p>
          )}
        </Section>

        {/* Die Zeichenerklärung (Bauart §7.1) - dieselben drei Zeichen. */}
        <Section title="Symbols in the text">
          <Zeichenerklaerung
            titel={null}
            zeichen={[
              { zeichen: "·", bedeutung: "separates two pieces of information that belong together - like a comma." },
              { zeichen: "→", bedeutung: "then, or: this is what it turns into." },
              { zeichen: "⏱", bedeutung: "the time you have practised." },
              // ★ Finish each line with Enter (23.09.2026): only shown at the
              // end of a line when the class has this setting on.
              {
                zeichen: "↵",
                bedeutung:
                  "appears at the end of a line when your class has this switched on - then you finish the line with the Enter key.",
              },
            ]}
          />
        </Section>

        {/* „Zum Anhören: die Einführung 🎧" fehlt mit Absicht: In der
            englischen Bedienung gibt es keinen Einführungs-Podcast. */}

        {/* 2) Sterne - für alle */}
        <Section title="Collecting stars 🌟">
          <p className="m-0">
            After every round you get <strong>1 to 3 stars</strong> - each with its
            own sound. <strong>Few mistakes count for far more than speed:</strong>{" "}
            typing calmly and carefully earns you stars reliably - rushing and
            hitting lots of wrong keys doesn't.
            {kind ? " Everyone can earn stars!" : ""}
          </p>
          {detail >= 2 && (
            <p className="m-0">
              You get 3 stars for a really good round - typed carefully and at a
              decent speed, and <strong>careful</strong> always matters more than{" "}
              <strong>fast</strong>. If you manage good rounds for a while, you can
              move up a <strong>difficulty level</strong> - and then the reward
              sounds a little different.
            </p>
          )}
        </Section>

        {/* 2b) Abzeichen - für alle */}
        <Section title="Collecting badges 🏅">
          <p className="m-0">
            For special achievements you earn <strong>badges</strong> - for example{" "}
            <strong>{abzeichen("volltreffer", maskottchen)}</strong> 🎯 for a round
            without a single mistake, or{" "}
            <strong>{abzeichen("praezisions-pinguin", maskottchen)}</strong>{" "}
            {maskottchen ? "🐧 " : ""}for three clean rounds in a row. When you earn
            a new badge, you hear its own <strong>“ta-dah”</strong> and its name is
            announced.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              All your badges are in <strong>“My statistics”</strong>, just after
              your weekly goals and figures - and that's also where you'll always
              find your{" "}
              <strong>next goal</strong> (for example: 2 more rounds without a
              mistake until the {abzeichen("null-fehler-ninja", maskottchen)} 🥷).
              Most badges are for <strong>typing carefully</strong> and for{" "}
              <strong>sticking with it</strong> - not for rushing. And a few are{" "}
              <strong>secret</strong>: what earns them isn't written anywhere - they
              just turn up.
            </p>
          )}
          {detail >= 2 && (
            <p className="m-0">
              That's also where you'll find your <strong>score</strong>:{" "}
              {SCORE_ERKLAERUNG_EN}
            </p>
          )}
          {detail >= 2 && (
            <p className="m-0">
              Further down, “Progress over time” (a line you can expand) shows a
              small curve.{" "}
              {STEIGERUNG_HINWEIS_EN}
            </p>
          )}
          <p className="m-0">
            Tip: select a medal in your statistics to open it in the{" "}
            <strong>large view</strong> - with a shine and confetti.
          </p>
        </Section>

        {/* 2b-2) Belohnung nach der neuen Taste - nur Jugend-Profil. */}
        {skin === "jugend" && (
          <Section title="After a new key">
            <p className="m-0">
              A <strong>new key</strong> is yours as soon as you've mastered the
              earlier ones - you don't have to win anything for it. It gets
              celebrated, and then you carry on. That's all.
            </p>
            <p className="m-0">
              If you like, a short game can follow: the <strong>Ice Floe game</strong>.
              You choose that yourself - in <strong>Settings</strong> (<AltText>Alt + O</AltText>), under{" "}
              <strong>Reward game</strong>. The default is <strong>None</strong>. The
              setting applies to this device.
            </p>
          </Section>
        )}

        {/* 2c) Eisschollen-Spiel - nicht für Erwachsene (wie im Deutschen). */}
        {!isAdult && (
          <Section title="The Ice Floe game 🐧">
            {skin === "jugend" ? (
              <>
                <p className="m-0">
                  You can <strong>start it yourself at any time</strong> - with the{" "}
                  <strong>Play</strong> button in the line below the typing field.
                  The penguin jumps across ice floes, climbs the letter mountain and
                  slides back down on its belly - always with the keys you find
                  hardest right now. Along the way, <strong>bonus fish</strong> leap
                  out of the water (type their key in time and you've caught one -
                  missing one is never a mistake), and in the{" "}
                  <strong>Echo Cave</strong> every key is only announced. The game
                  does <strong>not</strong> count as practice time and isn't needed to
                  unlock new keys - but it has badges of its own.
                </p>
                <p className="m-0">
                  After a new key it <strong>only</strong> starts by itself if you've
                  chosen it as your <strong>reward game</strong> in Settings.
                  Otherwise nothing interrupts you - you decide when to play.
                </p>
              </>
            ) : (
              <>
                <p className="m-0">
                  When you've got a <strong>new key</strong>, the Ice Floe game is
                  waiting to celebrate: help the penguin across the water - always
                  press the key on the next ice floe! Sometimes you even climb the{" "}
                  <strong>letter mountain</strong> afterwards and slide back down on
                  your belly. The new key is already yours before you play - the game
                  is the reward, not something you have to do.
                </p>
                <p className="m-0">
                  You can also <strong>start the game yourself at any time</strong> -
                  with the <strong>Play</strong> button at the top of your practice
                  card, right next to the ring. That's the big{" "}
                  <strong>adventure</strong>: it looks a bit different every day,{" "}
                  <strong>bonus fish</strong> jump out along the way (press their key
                  quickly to catch them), and in the <strong>Echo Cave</strong> you
                  can't see any letters -{" "}
                  {hoehleMitWesen ? (
                    <>
                      the cave <strong>tells</strong> you every key.
                    </>
                  ) : (
                    <>
                      each key sounds a tone, and your screen reader or braille
                      display <strong>tells</strong> you which one it is.
                    </>
                  )}{" "}
                  It's just for fun and does <strong>not</strong> count as
                  practice time - but it has badges of its own!
                </p>
                {detail >= 2 && (
                  <p className="m-0">
                    Don't worry: if a floe sinks or you slip on the mountain, the
                    penguin just swims back - you can have another go straight away,
                    as often as you like. And if you get through the whole adventure
                    without a single splash, you'll see the{" "}
                    <strong>northern lights</strong> dancing over the igloo!
                  </p>
                )}
              </>
            )}
          </Section>
        )}

        {/* 3) Die drei „Stufen" - Antwort auf den Ring mit der Zahl */}
        <Section title="What does the ring with the number mean?">
          <p className="m-0">
            The number in the ring is your <strong>{ringWort}</strong>.{" "}
            <strong>
              {xp ? "XP are the points you earn by practising:" : "Points are what you earn by practising:"}
            </strong>{" "}
            you get a few for every round, and the ring fills up. When it's full (100
            points), you go up one {ringWort}. It's only for collecting and does{" "}
            <strong>not</strong> make practising any harder - like points in a game.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Don't confuse it with the <strong>difficulty level (1-50)</strong>: that
              says how fast you should type, and it adjusts to you{" "}
              <strong>by itself</strong> - it goes up when things go well and gets
              easier when they get hard.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0">
              And the <strong>text age group</strong> only decides how hard the words
              and sentences are - to suit your age. In a class, your teacher sets it
              for everyone; without a class, you'll find it at the top in Settings ⚙.
              So, three different things: <em>{ringLabel}</em> = points,{" "}
              <em>difficulty level</em> = how fast you're expected to type,{" "}
              <em>text age group</em> = age.
            </p>
          )}
        </Section>

        {/* 4) Übezeit & Wochenziel */}
        <Section title={detail === 1 ? "How often should I practise?" : "Practice time & weekly goal"}>
          {detail === 1 ? (
            <p className="m-0">
              It's better to practise <strong>a little, often</strong> than once for
              a very long time - for example a few minutes on several days. In the
              line below the typing field, a clock counts how long you've typed
              today; that same time also fills the <strong>ring</strong> there - your
              weekly goal.
            </p>
          ) : (
            <p className="m-0">
              With an account, you can have a <strong>weekly goal</strong>: a number
              of <strong>minutes per week</strong>. In a class, your teacher sets it;
              without a class, you set it yourself in Settings ⚙ under “My weekly
              goal” - a new goal applies from next Monday. The week starts at{" "}
              <strong>8am on Monday</strong> and ends at 8am the following Monday. In
              the line below the typing field, your progress is shown as a{" "}
              <strong>ring</strong>, for example “25 of 60 min” - when the week's goal
              is reached, it's full and has a tick. Sometimes there are also missed
              minutes from an earlier week to <strong>catch up</strong> on; then it
              says how many next to it. When you reach your weekly goal, a short
              window pops up to congratulate you - after that you can keep practising
              whenever you like.
            </p>
          )}
        </Section>

        {/* 4a2) Die Einstellungen in der Kopfzeile */}
        <Section title="Settings ⚙ in the header">
          <p className="m-0">
            All the settings are behind the <strong>⚙ Settings</strong> button at the
            very top, just to the left of the round button with your initial:{" "}
            <strong>What are you practising?</strong>, <strong>Texts</strong> (age and
            language), <strong>Keyboard</strong>, <strong>Sound</strong> and{" "}
            <strong>Read aloud</strong>. Press it once to open them and again to close
            them - or use <Kbd>Alt</Kbd> + <Kbd>O</Kbd> (“options”), which also works
            in the middle of typing. When they open, the cursor jumps straight into
            them; when they close, it goes back to the typing field.
          </p>
          <p className="m-0">
            At the top of Settings is <strong>“What are you practising?”</strong>: the
            three ways to practise, <strong>My training</strong>,{" "}
            <strong>Stories</strong> and <strong>Word games</strong>.{" "}
            <Kbd>Alt</Kbd> + <Kbd>B</Kbd> moves on to the next one, and the new
            choice is announced.
          </p>
          {/* ★ 19.09.2026: der Sprachschalter in EINEM Satz (wie die deutsche Hilfe). */}
          <p className="m-0">
            The round <strong>DE</strong> button in the header switches Tastenflow to
            German - buttons, menus and your practice texts too (in German it is
            called <strong>EN</strong> and switches back); after that you can change
            the language of the texts on its own under <strong>Texts</strong>, unless
            your teacher has set it.
          </p>
          <p className="m-0">
            Under <strong>Keyboard</strong> you can choose which keyboard is actually
            in front of you: German/Austrian, Swiss, US or UK. After that, the
            on-screen keyboard and the spoken finger hints match it - and you only get
            characters that exist on that keyboard.
            {layoutHinweis ? " " + layoutHinweis : ""}
          </p>
          {/* ★ 19.09.2026: „Einhand schreiben" im Zahnrad, ausser in einer Klasse. */}
          <p className="m-0">
            That's also where you'll find <strong>“One-handed typing”</strong> - for
            everyone who types with one hand: capital letters and symbols then count
            with either Shift key. In a class, your teacher sets this.
          </p>
          {/* ★ L7 (19.09.2026): das Abdunkeln beim Schreiben - ein Satz.
              ★ Seit demselben Tag stellt JEDES Kind den Zeichenabstand selbst ein. */}
          <p className="m-0">
            With <strong>“Wide letter spacing (CVI)”</strong>, everything except the
            field you are typing in (the practice line or the game area) is dimmed
            while you type; after 5 seconds without typing it turns bright again.
            The practice line moves on at your own typing pace instead of jumping.
            You can set the letter spacing yourself in Settings ⚙ at any time - in a
            class, your teacher can set it too; whichever was chosen last applies.
          </p>
          <p className="m-0">
            With <strong>Targeted practice</strong> you can choose up to 8 keys or characters that appear especially often in the rounds - in the gear under <strong>What are you practising?</strong> or with <Kbd>Alt</Kbd> + <Kbd>2</Kbd>. In a class, your teacher sets this.
          </p>
        </Section>

        {/* 4b) Vorlesen + Stimme */}
        <Section title="Read aloud - the app reads to you">
          <p className="m-0">
            With <strong>🗣 Read aloud</strong> (or <Kbd>Alt</Kbd> + <Kbd>V</Kbd>) the
            app reads to you - for everyone who doesn't use a screen reader (yet). In
            Settings ⚙ at the top you can choose whether <strong>letters</strong>{" "}
            (“Spell out”), <strong>words</strong> and/or <strong>sentences</strong>{" "}
            are read aloud, and how fast.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Under <strong>“Voice”</strong> you can choose a different voice. If the
              language is <strong>English</strong>, the app automatically looks for an
              English voice; if none is installed, a short guide shows you how to add
              one.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0">
              Don't worry about your speed: the{" "}
              <strong>read-aloud time is taken out</strong> - waiting for an
              announcement doesn't make your speed any slower.
            </p>
          )}
        </Section>

        <Section title="Melody while you type 🎵">
          <p className="m-0">
            The <strong>melody while you type</strong> is there to help you practise a <strong>steady typing rhythm</strong> - and it is meant to be <strong>fun</strong>. Every correct key plays the next note of a tune; if you stay in time, a band even joins in.
          </p>
          <p className="m-0">
            People who type steadily also get smoother on their weaker keys: the rhythm carries you through the places where you would otherwise hesitate.
          </p>
          <p className="m-0">
            Switch it on with <Kbd>Alt</Kbd> + <Kbd>6</Kbd>, in the ⚙ settings, or in the menu under the round loudspeaker button at the top, where you can also set the volume of every sound with sliders. Change the sound with <Kbd>Alt</Kbd> + <Kbd>7</Kbd> and <Kbd>Alt</Kbd> + <Kbd>8</Kbd>.
          </p>
        </Section>

        {/* 4c) Grossbuchstaben (Umschalttaste) + Satzzeichen */}
        <Section title="Capital letters & punctuation">
          <p className="m-0">
            Texts need <strong>capital letters</strong> - at the start of a sentence
            and, in German, for every noun (
            <span lang="de">Hund, Schule, Tisch</span>). Tastenflow{" "}
            <strong>always gets them right</strong>, so you never see a wrongly
            spelt word.
          </p>
          <p className="m-0">
            <strong>Very easy at the start:</strong> just type the{" "}
            <strong>small</strong> letter - the <strong>capital</strong> appears by
            itself. You don't need to know the <Kbd>Shift</Kbd> key for that{" "}
            <strong>yet</strong>.
          </p>
          <p className="m-0">
            <strong>Soon</strong>, after the first few letters, you learn to use the{" "}
            <Kbd>Shift</Kbd> key “for real”: you hold it down with{" "}
            <strong>one</strong> hand and type the letter with the{" "}
            <strong>other</strong> - just as on any keyboard. That way you'll soon
            type capital letters <strong>yourself</strong> instead of relying on the
            automatic help.
          </p>
          <div className="rounded-lg border border-hairline bg-surface-raised p-3">
            <p className="m-0">
              <strong>Important - always use the Shift key on the OPPOSITE hand:</strong>{" "}
              there are two Shift keys, one on the left and one on the right. Type the
              letter with one hand and hold <Kbd>Shift</Kbd> with the{" "}
              <strong>other</strong> hand. That way one hand never has to press both
              keys.
            </p>
            <p className="m-0 mt-2">
              Example: capital <strong>A</strong> (left hand) →{" "}
              <strong>right</strong> <Kbd>Shift</Kbd> key. Capital <strong>K</strong>{" "}
              (right hand) → <strong>left</strong> <Kbd>Shift</Kbd> key.
            </p>
            <p className="m-0 mt-2">
              Tastenflow <strong>only accepts the right</strong> Shift key. If you use
              the <strong>wrong</strong> Shift key or <Kbd>Caps Lock</Kbd>, you get a{" "}
              <strong>small</strong> letter - that counts as a{" "}
              <strong>mistake</strong>, so that you practise with the right hand from
              the start.
            </p>
          </div>
          {detail >= 2 && (
            <p className="m-0 text-sm text-ink-muted">
              Tip: press <Kbd>Shift</Kbd> <strong>twice quickly</strong> and you'll
              hear which finger to hold it with.
            </p>
          )}
          <p className="m-0">
            <strong>Full stops, commas and question marks</strong> only appear once
            you've learnt them. Until then you simply read the sentence{" "}
            <strong>without them</strong> - that's on purpose, not a mistake.
          </p>
        </Section>

        {/* 4d) Reihenfolge der Buchstaben */}
        <Section title="In what order do the letters come?">
          <p className="m-0">
            New keys are always added in the same order: first the{" "}
            <strong>home position</strong>, then the other letters, the most common
            ones first. You can always see which key comes next at the right-hand end
            of the line below the typing field: <strong>“Next key”</strong>.
          </p>
          <div className="flex flex-wrap gap-1" aria-hidden="true">
            {letters.map((ch) => (
              <Kbd key={ch}>{unitGlyph(ch)}</Kbd>
            ))}
          </div>
          <p className="m-0 text-sm text-ink-muted">
            <strong>After just the first few letters</strong>,{" "}
            <strong>capitals</strong> (the Shift key) are added, and straight after
            them the <strong>full stop and comma</strong> - a sentence starts with a
            capital and ends with a full stop. Then the remaining letters. Last come
            the rest of the <strong>punctuation</strong> (
            {punctOrder.filter((c) => c !== "." && c !== ",").join(" ")}), the{" "}
            <strong>numbers</strong> and the <strong>symbols</strong>.
          </p>
          <span className="sr-only">
            Order: first letters, then capitals (Shift key), then full stop and
            comma, then the remaining letters, then the rest of the punctuation,
            numbers and symbols. Order of the letters:{" "}
            {letters.map((c) => unitLabelEn(c)).join(", ")}.
          </span>
        </Section>

        {/* 5) Wie „Mein Training" aufbaut - ab Detail 2 */}
        {detail >= 2 && (
          <Section title="How “My training” works">
            <p className="m-0">
              <strong>It adapts to you.</strong> The app remembers which keys are
              still wobbly and practises exactly those. A new key is only added once
              you've mastered the others. The <strong>most common</strong> letters
              come first - so after only a few keys you're already typing{" "}
              <strong>real words and sentences</strong>, and the first{" "}
              <strong>stories</strong> unlock early.
            </p>
            {detail >= 3 && (
              <p className="m-0 text-sm text-ink-muted">
                {/* ★ E6c (24.09.2026, Bauplan §6.3): Weg „en" hat eine eigene,
                    kürzere Lektionsfolge ohne Umlaute - nicht die deutsche
                    beschreiben, wenn das Kind auf dem englischen Weg lernt. */}
                {lernweg === "en" ? (
                  <>
                    Behind it is a fixed course of {lektionen.length} lessons
                    (home row, the most frequent letters, capitals, the rarer
                    letters, punctuation, numbers, symbols) - the same order in
                    which “My training” unlocks new keys.
                  </>
                ) : (
                  <>
                    Behind it is a fixed course of {lektionen.length} lessons (home
                    position, top and bottom rows, umlauts, punctuation, numbers, symbols,
                    whole texts) - the same order in which “My training” unlocks new
                    keys.
                  </>
                )}{" "}
                You don't see these lessons one by one: because the keyboard
                rows come first, the common letter <Kbd>n</Kbd> is missing for a long
                time (it only comes in lesson {lektionMitN}) - “My training” makes up
                for this by bringing the <strong>most common</strong> letters forward,
                so that real words appear quickly.
              </p>
            )}
          </Section>
        )}

        {/* Die Zeile unter dem Übungsfeld */}
        <Section title="The line below the typing field">
          <p className="m-0">
            Below the typing field there's a narrow line with four things: your{" "}
            <strong>{ringWort}</strong>, the <strong>time</strong> you've practised
            today, your <strong>weekly goal</strong> and the <strong>next key</strong>.
            For the weekly goal, the ring shows how many <strong>minutes</strong>{" "}
            you've practised this week - for example “25 of 60 min”; a{" "}
            <strong>tick</strong> means the week's goal is reached. The next key
            unlocks <strong>by itself</strong> as soon as you've mastered the earlier
            ones - just keep practising.
          </p>
          <p className="m-0">
            The line is <strong>always</strong> there - even while you're typing. That
            way nothing jumps about, and you can see at any time how long you've been
            practising.
          </p>
          <p className="m-0">
            <Kbd>Alt</Kbd> + <Kbd>D</Kbd> announces your practice time and weekly
            goal. Which keys you've mastered, which are not there yet and which one
            comes next is shown in <strong>“My statistics”</strong> under{" "}
            <strong>“Key progress”</strong> (<Kbd>Alt</Kbd> + <Kbd>S</Kbd>, with an
            account).
          </p>
        </Section>

        {/* 5b) Die Bücherei */}
        <Section title="The library: “Stories & non-fiction” 📖">
          <p className="m-0">
            Besides “My training” there's another way to practise:{" "}
            <strong>Stories</strong> - in Settings ⚙ under{" "}
            <strong>“What are you practising?”</strong>. There you'll find whole
            stories and non-fiction series - not single sentences, but{" "}
            <strong>one story over many rounds</strong>. Each stage is twelve lines;
            next time you carry on reading exactly where you left off.
          </p>
          <p className="m-0">
            Only what you can really type with the keys you've already learnt appears
            - that's why you still see padlocks at the start. They open by themselves
            once you've mastered enough keys. Every line comes{" "}
            <strong>only once</strong>: what you've typed doesn't come back as a
            repeat.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              <strong>The common thread:</strong> what you've read in a non-fiction
              series comes back later in your training - as a{" "}
              <strong>question in different words</strong>, then as a little extra
              detail, and finally as a joke that fits. That way what you've learnt
              sticks, without feeling like a test.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0 text-sm text-ink-muted">
              Below the list is “Sources &amp; thanks”: there you can see where the
              texts come from. Some were written specially for Tastenflow, others come
              from freely usable sources - those are named there, as they should be.
            </p>
          )}
        </Section>

        {/* 5b) KI-Transparenz (Art. 50 KI-VO) */}
        <Section title="Where do the texts come from? 🤖">
          <p className="m-0">
            The app's own texts - practice sentences, jokes and stories - were written
            by Johannes <strong>with the help of artificial intelligence (AI)</strong>,
            and he then read and checked them himself. Texts from other sources (for
            example Wikipedia or Klexikon) are credited by name under “Sources &amp;
            thanks”.
          </p>
          {/* ★ 28.09.2026: das murmelnde Monster (Höhlenwesen) gibt es nur auf
              Weg „de" (`hoehleHatWesen`) - sonst nur den Fisch nennen. */}
          <p className="m-0">
            {hoehleMitWesen ? (
              <>
                The singing fish and the murmuring monster in the Polar Expedition are{" "}
                <strong>computer voices</strong> too, not real people.
              </>
            ) : (
              <>
                The singing fish in the Polar Expedition is a{" "}
                <strong>computer voice</strong> too, not a real person.
              </>
            )}{" "}
            Read aloud (🗣) uses
            your device's own reading voice.
          </p>
        </Section>

        {/* 5c) Die Tippchallenge */}
        <Section title={`The ${PRUEFUNG_WORT_EN}`}>
          <p className="m-0">
            Sometimes your teacher starts a <strong>{PRUEFUNG_WORT_EN}</strong> - for
            the whole class. <strong>Everyone gets the same text</strong>, and
            everyone has the same amount of time.
          </p>
          <p className="m-0">
            <strong>The clock only starts with your first keystroke</strong> - not
            when your teacher starts the challenge. From the start you have{" "}
            <strong>{EINSTIEGSFENSTER_MIN} minutes</strong> to begin.
          </p>
          <p className="m-0">
            <strong>How to recognise it:</strong> above the typing field it says{" "}
            <strong>{PRUEFUNG_WORT_EN}</strong>, with the time next to it, and the
            whole area has a different, <strong>dashed border</strong>. As soon as the
            time is up, both disappear again.
          </p>
          <p className="m-0">
            <strong>How much time is left, without looking:</strong>{" "}
            <Kbd>Alt</Kbd> + <Kbd>X</Kbd> tells you. The clock only speaks up by
            itself a few times; otherwise it stays quiet.
          </p>
          <p className="m-0">
            <strong>The braille display stays still.</strong> The time does{" "}
            <strong>not</strong> tick on the line: it runs along at the top, but it
            never pushes into what you're reading.
          </p>
          {/* ★ 23.09.2026 („Freies Schreiben", E6): siehe die deutsche Fassung. */}
          <p className="m-0">
            <strong>Sometimes the {PRUEFUNG_WORT_EN} is “free writing”.</strong>{" "}
            Then a mistake simply stays where it was typed - nothing is
            marked, no sound points it out. Backspace only corrects within the
            current line; a finished line stays as it is. At the end of a
            line, press the space bar after the last word - or, if the class
            has switched on “Finish each line with Enter”, press Enter
            instead. What is still wrong at the end only shows up afterwards,
            in the results, as a list to read.
          </p>
          <p className="m-0">
            <strong>Stopping early:</strong> <Kbd>Esc</Kbd> asks you first.{" "}
            <strong>“Keep typing”</strong> (or <Kbd>Esc</Kbd>) takes you back to the
            line, <strong>“Hand in”</strong> hands it in - what you have typed so far
            is scored. The <strong>“Done - hand in”</strong> button below the field
            does the same, without asking.
          </p>
          <p className="m-0">
            <strong>When the time is up,</strong> your results appear straight away:
            keystrokes per minute, accuracy, characters, mistakes, lines and the keys
            that were wobbly. Every {PRUEFUNG_WORT_EN} then stays in{" "}
            <strong>“My statistics”</strong> under{" "}
            <strong>{PRUEFUNG_WORT_MEHRZAHL_EN}</strong> - you can look it up there
            again at any time.
          </p>
        </Section>

        {/* Das Klassenmatch */}
        <Section title="Class Match ⚔️">
          <p className="m-0">
            In a Class Match you <strong>race each other at typing for five
            minutes</strong> - with everyone else in your class. Class Match only
            exists in a class, and only if your teacher allows it.
          </p>
          <p className="m-0">
            <strong>Starting one:</strong> <Kbd>Alt</Kbd> + <Kbd>M</Kbd>, or the{" "}
            <strong>Class Match</strong> button in the line above the typing field -
            right next to <strong>Play</strong>. Everyone else then gets a window:{" "}
            <strong>“I'm in”</strong> or <strong>“Not now”</strong>. <Kbd>Esc</Kbd>{" "}
            takes you back to practising, and the same invitation doesn't come back
            by itself.
          </p>
          <p className="m-0">
            <strong>If someone is already inviting,</strong> <Kbd>Alt</Kbd> +{" "}
            <Kbd>M</Kbd> brings that invitation back up - a second match can only
            start once the first one is under way. If two people invite at almost the
            same moment, the invitation that arrived first counts.
          </p>
          <p className="m-0">
            <strong>When it's not possible right now:</strong> if you're already in a
            match yourself, the button says <strong>“Class Match in progress”</strong>{" "}
            - and <Kbd>Alt</Kbd> + <Kbd>M</Kbd> tells you the same. Other matches in
            your class don't get in the way: any number of them can run at the same
            time.
          </p>
          <p className="m-0">
            <strong>Everyone types with the keys they've learnt so far.</strong> If
            you've already learnt the numbers, you get numbers; if you're on the home
            row, you get the home row. Wrong keys cost you - one wrong key counts as
            much as five characters.
          </p>
          <p className="m-0">
            <strong>How things stand, without looking:</strong> at the very left of the
            typing line there are always eight cells: <strong>P2</strong> is your
            place, followed by the time that's left. <Kbd>Alt</Kbd> + <Kbd>X</Kbd>{" "}
            tells you your place, the time and the top three. Nothing speaks up by
            itself - the braille display stays still.
          </p>
          <p className="m-0">
            <strong>Stopping early:</strong> <Kbd>Esc</Kbd> or the{" "}
            <strong>“Leave”</strong> button asks you first.{" "}
            <strong>“Keep typing”</strong> (or <Kbd>Esc</Kbd>) takes you back to the
            line. <strong>“Leave”</strong> ends the match only for you - the others
            keep typing and can see what you've typed.
          </p>
          <p className="m-0">
            <strong>The match counts towards your practice time</strong>, and it can
            unlock a new key - just like an ordinary practice round.{" "}
            <strong>No place is saved.</strong> At the end you see the list: Trophy,
            Silver and Bronze for the top three, everyone else with their number.
            Then <strong>“Keep practising”</strong> or <Kbd>Esc</Kbd> takes you back.
          </p>
        </Section>

        {/* 6) Tasten und Tastenkürzel - vollständig, auf JEDER Stufe */}
        <Section title="Important keys">
          <p className="m-0 text-sm text-ink-muted">
            <AltOderWahl>
              On a Mac, <Kbd>Alt</Kbd> is the <Kbd>⌥</Kbd> key (Option).
            </AltOderWahl>
          </p>
          <ul className="m-0 list-none space-y-2 p-0">
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Esc</Kbd>
              </span>
              <span>
                <strong>The most important key:</strong> it closes any window, and
                afterwards the cursor is <strong>always in the typing field</strong>.
                Even when nothing is open, <Kbd>Esc</Kbd> brings it back there. The
                only exception is “Explore keys”: there, <Kbd>Esc</Kbd> is itself a
                key to explore, and only the second press takes you out.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Shift</Kbd> <Kbd>Shift</Kbd>
              </span>
              <span>Press twice quickly: the right finger is announced.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>E</Kbd>
              </span>
              <span>Jump to the typing field.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>U</Kbd>
              </span>
              <span>Go to practice.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>S</Kbd>
              </span>
              <span>
                Opens My statistics (teachers: My classes). You need to be signed in
                for this. Press it again to go back to the typing field.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>Z</Kbd>
              </span>
              <span>Announces which line you're on.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>D</Kbd>
              </span>
              <span>
                Tells you your practice time - on the braille display and (with read
                aloud) as an announcement.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>L</Kbd>
              </span>
              <span>Announces which {ringWort} you're on.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>3</Kbd>
              </span>
              <span>
                <strong>Explore keys:</strong> every key you press is announced and
                shown large - first the short name, then the full name, then what it
                does (for example “Tab - Tab key - moves from one thing to the next”).
                This works for all special keys and punctuation, for characters on
                AltGr (on a Mac: Option) including how to reach them, and for key
                combinations such as Ctrl + C - along with what they do. Tastenflow's
                own shortcuts (<AltText>Alt + H, Alt + V …</AltText>) keep working. The on-screen
                keyboard shows which key was pressed. If read aloud is off, the voice
                stays quiet. On the braille display, the explanation stays until the
                next key comes, and you can read all of it with the scroll keys; on
                screen it appears in a window. Nothing is typed, nothing is lost.{" "}
                <Kbd>Shift</Kbd> gives the top character on a key and <Kbd>AltGr</Kbd> (on a Mac: <Kbd>Option</Kbd>) the third one, so you can try every character one by one.{" "}<strong>To leave:</strong> <Kbd>Alt</Kbd> + <Kbd>3</Kbd> again,{" "}
                <Kbd>Esc</Kbd> twice - or simply reload the page.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>4</Kbd>
              </span>
              <span>
                <strong>Find keys:</strong> a key is named, and you look for it. When
                you first find it, you hear “Found it! Press another key, then … again” - only the
                second press counts, and only after another key in between. Then the
                next key comes. Any other key is just named. Inside the window, <Kbd>Alt</Kbd> + <Kbd>4</Kbd> switches
                between exploring and finding. <strong>To leave:</strong> the same as
                for exploring.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>K</Kbd>
              </span>
              <span>
                <strong>Colours and contrast:</strong> seven colour schemes - light,
                dark, black on yellow, yellow on blue and more. Each one is already
                shown in its own colours in the list, so you can see what it looks
                like beforehand.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>T</Kbd>
              </span>
              <span>Opens or closes the list of keyboard shortcuts.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>N</Kbd>
              </span>
              <span>Opens or closes messages from your teacher.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>+</Kbd> / <Kbd>-</Kbd>
              </span>
              <span>Makes the typing field bigger / smaller.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>V</Kbd>
              </span>
              <span>Turns read aloud on or off.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>H</Kbd>
              </span>
              <span>Opens or closes this help.</span>
            </li>
            <WeitereTasten />
          </ul>
        </Section>

        {/* 7) Wie das Lernsystem fördert - ab Detail 3 */}
        {detail >= 3 && (
          <Section title="How the app helps you improve">
            <p className="m-0">
              The app measures every letter separately - how accurately and how fast
              you type it. It automatically practises the ones that need it most and
              only unlocks a new letter once you've mastered the earlier ones. That
              way you get your own learning path.
            </p>
            <p className="m-0">
              The difficulty level (1-50) makes sure it always stays{" "}
              <strong>challenging but doable</strong>: when things go well, it goes
              up; when it gets too hard, it comes down again. In{" "}
              <strong>“My statistics”</strong> you can see everything about your
              progress - and how you're improving.
            </p>
          </Section>
        )}

        {/* 7b) Eigenes Konto ohne Klasse */}
        <Section title="Practising without a class - a personal account 🙋">
          <p className="m-0">
            If you don't belong to a class, you create an account yourself: open the
            round <strong>“Account”</strong> button and tick{" "}
            <strong>“I'm practising on my own, without a class or teacher”</strong>.
            For this you need an email address: that's where the weekly report goes
            on Mondays - but only in weeks in which there really was some practice.
            If Tastenflow is not opened for a whole year, a warning comes by
            email; if nobody signs in during the three weeks after that, the account
            is deleted with all its progress.
          </p>
          {/* ★ 28.09.2026 (Johannes): die anderen Apps gibt es nur auf Deutsch -
              die englische Hilfe nennt sie nicht mehr (hier stand „Your progress
              counts in all four apps …"). Siehe `programmInSprache`. */}
        </Section>

        {/* 7c) ★ 19.09.2026: das Plakat zum Aufhängen - öffentlich, ein
            schlichter Verweis auf `/tastenflow-plakat.pdf` wie in der deutschen
            Hilfe. ★ 21.09.2026: Die englische Bedienung bekommt das ENGLISCHE
            Plakat (`handbuchInSprache`). */}
        <PlakatAbschnitt />
      </div>
    </div>
  );
}

/** ★ 19.09.2026: The poster for hanging up - open to everyone; since 21.09.2026 in English. */
function PlakatAbschnitt() {
  const plakat = handbuchInSprache(tastenflowPlakat(), "en");
  return (
    <Section title="A poster to put up">
      <p className="m-0">
        Would you like to show Tastenflow at your school or organisation? Here is a{" "}
        <strong>poster to print and put up</strong>: A3, portrait, with what Tastenflow
        can do at a glance and a QR code to tastenflow.org.
      </p>
      <p className="m-0">
        <a
          href={downloadAdresse(plakat)}
          download={plakat.speicherName}
          type="application/pdf"
          className="text-accent underline underline-offset-2"
        >
          Download the poster (PDF, A3, {groesse(plakat.bytes, "en")})
        </a>
      </p>
    </Section>
  );
}
