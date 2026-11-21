/**
 * ENGLISCHE SERIEN FÜR DIE SPROSSE 26 der neuen Buchstabenfolge
 * (Charge I4, 28.08.2026).
 *
 * ── WARUM ES DIESE DATEI GIBT ─────────────────────────────────────────────
 *
 * Gemessen am 28.08. mit `npx tsx scripts/_i4regal.mts --lang en`, Grundmenge
 * 151 Serien / 7368 Zeilen (davon englisch 51 / 2532), gelesen über die
 * Öffnungspunkte 13 / 17 / 20 / 22 / 26 / 31 / 99 Einheiten:
 *
 *   en/kids       [ 0, 11, 14, 17, 19, 22, 22]
 *   en/teens      [ 0, 11, 14, 16, 17, 24, 24]
 *   en/erwachsen  [ 0,  7, 10, 11, 12, 17, 17]
 *
 * Die Sprosse 26 war die dünnste Stelle des englischen Regals: zwischen 22 und
 * 26 kamen für Kinder zwei Serien dazu, für Jugendliche eine, für Erwachsene
 * eine. Wer bei sechsundzwanzig Einheiten steht, hat also praktisch nichts
 * gewonnen, obwohl er drei Buchstaben mehr kann als bei zweiundzwanzig. Diese
 * Datei legt sechs Serien nach, und zwar alle sechs GEMESSEN bei genau 25 -
 * sie leben von `p`, das die Sprosse 26 mitbringt. Wer hier bei 20 oder 22
 * landet, doppelt nur die Dateien der Kollegen.
 *
 * ── DAS BUDGET (am Objekt gemessen, nicht zitiert) ────────────────────────
 *
 * Frei: **a b c d e f g h i j k l m n o p r s t u v w z** (23).
 * Gesperrt: **q x y**.
 *
 * ★ EIN BEFUND, DER IN KEINEM AUFTRAGSBUCH STAND UND DEN DER NÄCHSTE BRAUCHT:
 *   `INTRO_ORDER` gibt an den Positionen 23 / 24 / 25 / 26 die Einheiten
 *   **z / v / p / ä** aus. Das `ä` ist fürs Englische wertlos. **Auf der
 *   Sprosse 26 kann eine englische Serie also gar nicht bei 26 öffnen - 25
 *   ist der höchste erreichbare Öffnungspunkt.** Alle sechs Serien dieser
 *   Datei stehen darum auf 25, und das ist die volle Ausnutzung, nicht ein
 *   Unterschreiten des Auftrags. Wer 23 will, braucht ein `z` ohne `v` und
 *   ohne `p`; wer 24 will, ein `v` ohne `p`. Das kostet mehr, als es bringt:
 *   ohne `p` fehlen wieder *people, open, help, keep, up, stop, part, place*.
 *
 * ── WAS DIE SPROSSE 26 GEGENÜBER 22 NEU BRINGT ───────────────────────────
 *
 *  • **v - und damit endlich `have`.** Das ist der größte Einzelgewinn der
 *    ganzen Charge. Bis Sprosse 22 gab es nur *has* und *had*; kein *I have*,
 *    kein *to have*, kein *have got*, kein *have been*. Jetzt trägt der volle
 *    Bau: *she has to have it, the racks have labels, three of them have
 *    signed*. Dazu *give, love, live, leave, move, over, never, ever, five,
 *    seven, eleven, twelve, van, drive, driver, river, voice, visit, above,
 *    believe, receive, arrive, travel, event, save, serve, prove, develop,
 *    volunteer, valve, evening, several, cover, advice, adviser*.
 *    ⚠️ **Achtung: `every` ist NICHT frei** - e-v-e-r-y trägt ein y. Das
 *    Auftragsbuch führt es irrtümlich in der v-Liste. *ever* und *never*
 *    gehen, *every, everyone, everything* nicht. Ersatz: *all, each, all of
 *    it, the lot, each time*.
 *  • **p - der Alltag kommt zurück.** *people, person, place, part, open,
 *    help, keep, hope, up, stop, top, paper, please, phone, power, panel,
 *    plate, lamp, sleep, price, put, print, press, push, drop, jump, deep,
 *    group, complete, important, possible, spring, September, April, pitch,
 *    petition, plan, plaster, prosthetic, placement, appointment, photo,
 *    post, prize, press, pupil, public, purpose, perhaps*.
 *    ⚠️ **`pay` ist NICHT frei** (y) - *paid* schon. Ebenso: *play* trägt ein
 *    y und fällt aus, obwohl *p* frei ist. Für die Fußball-Serie hieß das:
 *    kein *play*, kein *player*, kein *playground*. Es trägt *a game, a
 *    match, a kick-about, the team, the keeper, the pitch, the ground*.
 *    **`perhaps` ist der Fund des Tages**: es ersetzt das gesperrte *maybe*
 *    sauber und klingt dabei besser.
 *  • **z - klein, aber es macht Wörter frei, die man nicht erwartet.**
 *    *prize, freeze, amazed, zone, zero, dozen, citizen, magazine, size*.
 *    Britisch bleibt *realise* mit s. In dieser Datei trägt davon genau EIN
 *    Wort: *prize* im Fotowettbewerb. *dozen, citizen, magazine, freeze*
 *    stehen hier als Vorrat für die nächste Charge - gebraucht habe ich sie
 *    nicht. Das `z` ist der schwächste der drei neuen Buchstaben; wer eine
 *    Serie bei 23 öffnen lassen will, muss sie um ein `z` herum bauen.
 *
 * ── ★ DER POSTEN, DER DIESE SPROSSE PRÄGT: DAS `y` FEHLT IMMER NOCH ───────
 *
 * Das `y` kommt erst bei Sprosse 29. Auf Sprosse 26 sieht der Bestand fast
 * vollständig aus - `have`, `people`, `open`, `over`, `give` sind da - und
 * genau darum schreibt man sich hier in Fallen, die man auf Sprosse 17 nie
 * gemacht hätte. **Das ist der häufigste Grund, warum eine fertige Serie im
 * Messlauf rot wird.** Die vollständige Liste dessen, was am `y` hängt:
 *
 *  • **Zweite Person: kein *you*, kein *your*, kein *yours*, kein *yes*.**
 *    ⇒ Jede wörtliche Rede in dieser Datei ist indirekt oder nennt den Namen.
 *    *yes* ⇒ **nods**, *he lets that stand*, *she signs*.
 *  • **Kein *they*** - und das ist die teuerste Einzelfalle der Sprosse, weil
 *    *them*, *their* und *theirs* frei sind und die Hand von selbst *they*
 *    schreibt. ⇒ *the others, all three, the group, the class, the two of
 *    them, Bekir and Lena, the lot*, oder Passiv.
 *  • **Kein *day*** - obwohl *have*, *people* und *open* jetzt gehen, fühlt
 *    sich das beim Schreiben falsch an. Tot sind *day, days, today,
 *    yesterday, birthday, holiday*, **alle sieben Wochentage** (Friday hat
 *    mich zweimal erwischt) und die Monate **January, February, May, July**.
 *    ⇒ *the morning, the afternoon, the evening, the hour, the week, the
 *    weekend, the shift, the round, at first light, tonight, tomorrow*(!).
 *    **`tomorrow` ist frei** und rettet jeden Vorgriff. Frei sind die Monate
 *    **March, April, June, August, September, October, November, December**.
 *  • **Kein einziges Adverb auf -ly.** ⇒ *at once, at last, at first, soon,
 *    then, again, still, hard, fast, just, in the end, for a moment, on
 *    purpose, in truth, in fact, with care, all at once, at a crawl*.
 *  • **Kein *very*** ⇒ *far, a lot, hard, most*. **Kein *only*** ⇒ *just,
 *    alone, no more than*. **Kein *any*** ⇒ *a, one, not one*. **Kein *yet***
 *    ⇒ *so far, still, up to now*. **Kein *already*** ⇒ *before now, by
 *    then*. **Kein *maybe*** ⇒ **perhaps**. **Kein *always*** ⇒ *each time,
 *    at all hours*. **Kein *away*** ⇒ *off, out, gone*.
 *  • **Kein *way*** - im Englischen fast unvermeidbar. ⇒ *the road, the
 *    route, the path*; *the way it works* ⇒ **how it works**; *the way she
 *    reads it* ⇒ *as she reads it*.
 *  • **Kein *say*, kein *says*** - *said* ist frei! ⇒ *tells, asks, adds,
 *    notes, insists, replies, answers, reads out*.
 *  • **Kein *pay*, kein *buy*, kein *lay*, kein *stay*, kein *play*, kein
 *    *try*, kein *carry*, kein *fly*** - die Vergangenheitsformen **paid,
 *    bought, laid** sind dagegen frei. ⇒ *stay* ⇒ **remains, keeps to**;
 *    *carry* ⇒ *takes, brings*; *try* ⇒ *has a go, sets out to*.
 *  • **Keine Abstrakta auf -y/-ty/-ry**: *city, story, family, money, energy,
 *    history, gallery, library, society, community, country, county,
 *    authority, security, identity, safety, activity, quality*(q auch).
 *    ⇒ *city* ⇒ **the town**; *story* ⇒ *the tale, the account*; *money* ⇒
 *    *the fare, the cost, the sum, the fee, the funds*; *family* ⇒ **the
 *    household**, *her mother and her brother*; *history* ⇒ *the past, the
 *    record*; *library* ⇒ *the reading room*; *gallery* ⇒ *the hall, the
 *    display*; *community* ⇒ **the neighbourhood**; *authority* ⇒ *the
 *    council, the office, the department*.
 *  • **Zahlen**: gesperrt sind *twenty, thirty, forty, fifty, sixty, seventy,
 *    eighty, ninety* (y) und *six, sixteen, sixth* (x). Frei: *one, two,
 *    three, four, five, seven, eight, nine, ten, eleven, twelve, thirteen,
 *    fourteen, fifteen, seventeen, eighteen, nineteen, hundred, thousand,
 *    million, half, dozen*. **Damit ist keine Jahreszahl schreibbar**, die
 *    ein Zwanziger- oder Dreißigerjahr nennt - die Museums-Serie datiert
 *    darum über *a hundred winters, the hour it came in, the old print house*.
 *  • **Gefühl ohne Auge**: *eye, eyes, young, happy, angry, hungry, busy,
 *    ready, early, easy, dry, grey*(!) sind tot. *grey* hat mich beim
 *    Schreiben der Taube erwischt - die Farbe schreibt sich im Britischen mit
 *    e und trägt trotzdem ein y. Ersatz: **ash, slate, dull, a bird of ash
 *    and white** - oder die Farbe fällt weg.
 *
 * ── AUCH TOT: q UND x ────────────────────────────────────────────────────
 *
 *  • **kein q** - *question, quick, quiet, quite, queue, quarter, square,
 *    require, request, equal, unique, antique*. ⇒ *question* ⇒ *he asks a
 *    second time, one thing more*; *quiet* ⇒ **still, without a sound,
 *    hushed**; *quick* ⇒ *fast, at speed*; *square* ⇒ *the market place*;
 *    *antique* ⇒ *old, from the old house*.
 *  • **kein x** - *next(!), box(!), six, mix, fix, exact, explain, example,
 *    text, experience, expert, extra, exit, expect, complex, index*.
 *    ⇒ *next* ⇒ **the one after this, the cast after that, the runner behind
 *    her, then**. *box* ist die stille Falle jeder Depot- und Lagergeschichte
 *    ⇒ **crate, case, rack, shelf**. *explain* ⇒ *sets it out, tells him how
 *    it works*; *experience* ⇒ *the work placement, the hours she has done*.
 *
 * ── WAS FEHLTE UND WAS STATTDESSEN TRUG (beim Schreiben mitgeschrieben) ───
 *
 * Jede Zeile hier ist an dieser Datei aufgelaufen, keine ist aus dem Kopf.
 *
 *  • *play* in der Bolzplatz-Serie ⇒ die Serie kommt ohne das Verb aus:
 *    *the pitch is in use from four to dusk, the first match, a kick-about,
 *    the team, the keeper*. Das liest sich schärfer als das Original mit
 *    *play* - und es ist der Beweis, dass ein gesperrtes Kernverb kein Grund
 *    ist, den Stoff zu wechseln.
 *  • *next* zweimal: *before the next runner* ⇒ **before the runner behind
 *    her**; *the next cast* ⇒ **the cast after that**.
 *  • *Friday* ⇒ **at the end of the week**. *yard* ⇒ **the ground**.
 *    *years* ⇒ **a long time, nine seasons, eleven seasons**.
 *  • *the way he reads it* ⇒ **as he reads a print**.
 *  • *grey* ⇒ die Taube ist **of ash and white**.
 *  • *forty names* ⇒ **a sheet full**; *twenty spaces* ⇒ **twelve spaces**.
 *  • *box* im Depot ⇒ **crate, case, rack**; *shelves* ⇒ **the shelf**,
 *    Einzahl, und einmal *the racks*.
 *  • *history* und *gallery* in der Museums-Serie ⇒ **the record, the file,
 *    the printed guide, the room about the print house**. Der Verlust ist
 *    keiner: die Serie redet über Belege statt über Geschichte.
 *  • *identity papers* in der Dolmetsch-Serie ⇒ **the folder, the file, the
 *    form, the order**. *authority* ⇒ **the council, the department**.
 *  • *survey/surveyor* ⇒ **an inspector**, und sie kommt **with a meter and
 *    a lamp** ins Haus.
 *  • *quality of the fit* ⇒ **the fit is true**; *adjust* ist frei und trägt.
 *  • *you* in der wörtlichen Rede ⇒ konsequent indirekt: *she tells him that
 *    she cannot cut four minutes to one line*. Das hat der Dolmetsch-Serie
 *    gutgetan: eine Dolmetscherin redet ohnehin in der dritten Person über
 *    das, was gesagt wurde.
 *  • Kein Apostroph ⇒ kein Genitiv-s: *the school paper*, *the name of the
 *    print house*, *the trouser leg*, *the note of the clerk*.
 *
 * ★ DIE DREI FUNDE DES MESSLAUFS - die schreibt man beim zweiten Mal wieder,
 *   darum stehen sie getrennt. Nach dem ersten Durchgang standen drei der
 *   sechs Serien auf grün und drei auf rot, und keiner der drei Fehler war
 *   beim Lesen zu sehen:
 *     · **relay**(y) im Sportfest ⇒ **the sprint**. Ein Sportfest ohne
 *       Staffel - das Wort ist auf jeder Sprosse unter 29 tot.
 *     · **mix / mixes**(x) in der Werkstatt ⇒ **stirs** und **the second one
 *       holds**. `mix` ist die stille Falle jeder Handwerks-Serie: Gips,
 *       Mörtel, Harz, Farbe - alles wird gemischt.
 *     · **tray**(y) im Depot ⇒ **the shelf**. Als Ersatz für das gesperrte
 *       *box* liegt *tray* am nächsten und ist genauso gesperrt; es bleiben
 *       **crate, case, rack, shelf**.
 *   Dazu eine Zeile mit vierundsiebzig Zeichen (Grenze siebzig) im
 *   Wohnungsamt: *...or comes from how the flat is used* ⇒ *...or comes from
 *   the use*. Länge misst man, man schätzt sie nicht.
 *
 * ── DIE SECHS SERIEN DIESER DATEI ────────────────────────────────────────
 *
 *   öffnet | Titel                            | Stufen           | Thema
 *   -------|----------------------------------|------------------|--------
 *     25   | The Pigeon and the Green Ring    | kids             | tiere
 *     25   | The Pitch Behind the Flats       | kids, teens      | alltag
 *     25   | The Photo She Did Not Post       | teens            | schule
 *     25   | The Placement in the Limb Shop   | teens            | technik
 *     25   | The Label in Store Three         | teens, erwachsen | kultur
 *     25   | The Interpreter at the Housing Desk | erwachsen     | arbeit
 *
 *  1. **The Pigeon and the Green Ring** (kids, tiere) - eine erschöpfte
 *     Brieftaube sitzt im Fahrradunterstand der Schule; am Ring steht ein
 *     Verein hundertzehn Meilen im Norden, und die Klasse lernt, dass eine
 *     müde Taube erst ruhen muss, bevor sie den Heimflug schafft.
 *  2. **The Pitch Behind the Flats** (kids + teens, alltag) - der kleine
 *     Hartplatz hinter drei Wohnblocks soll ein Parkplatz werden; die Kinder
 *     zählen die Nutzung, sammeln Unterschriften und nehmen ausgerechnet den
 *     Anwohner, der sich über den Lärm beschwert, in den Plan mit hinein.
 *  3. **The Photo She Did Not Post** (teens, schule) - Pia macht beim
 *     Sportfest das beste Foto ihres Lebens, und Fenna, die darauf zu sehen
 *     ist, will es nicht veröffentlicht haben; der Streit mit der
 *     Schülerzeitung geht über einen Wettbewerb und endet mit einem zweiten
 *     Bild, das Fenna selbst aussucht.
 *  4. **The Placement in the Limb Shop** (teens, technik) - Ivo macht ein
 *     Praktikum in einer Werkstatt für Prothetik; ein Schaft drückt trotz
 *     perfekter Abformung, und der Grund ist die Uhrzeit, zu der abgeformt
 *     wurde.
 *  5. **The Label in Store Three** (teens + erwachsen, kultur) - im
 *     Museumsdepot findet Vera unter einer Presse eine eingeschlagene Marke;
 *     das Stück ist keine Mostpresse, sondern eine Papierpresse aus der
 *     alten Druckerei - und es steht vorn auf dem gedruckten Museumsführer.
 *  6. **The Interpreter at the Housing Desk** (erwachsen, arbeit) - Selma
 *     dolmetscht bei einem Termin im Wohnungsamt; sie weigert sich, vier
 *     Minuten Amtsdeutsch zu einem Satz zusammenzufassen, und der Termin
 *     platzt - der zweite dauert eine Stunde und bringt einen Bescheid.
 *
 * ── FORM UND RECHTE (wie im ganzen englischen Bestand) ────────────────────
 *
 * Selbst verfasst (Bauplan 27.07. §10), britisches Englisch, KEINE
 * Apostrophe, wörtliche Rede OHNE Anführungszeichen, keine Ziffern, jede
 * Zeile EIN Satz, Satzzeichen nur . , - ? ! : ; und nur der einfache
 * Bindestrich. Vier Etappen zu zwölf Zeilen je Serie; jede Etappe endet auf
 * einen Zug, der weiterlesen lässt, die letzte schließt auf ein Bild und
 * nicht auf eine Lehre.
 *
 * TON: Gegenwart 2026. Auf der Kinder-Stufe nichts Bedrohliches, kein Tod,
 * keine Krankheit als Spannungsmittel: die Taube ist müde, nicht verletzt,
 * und sie fliegt heim. Person zuerst, wo Behinderung vorkommt - es heißt
 * *Renata uses a prosthetic leg*, nie umgekehrt. Vielfalt ist erzählt, nicht
 * erklärt.
 */
import type { Serie } from "./serie";

/** Herkunft der selbst verfassten englischen Serien dieser Datei. */
const EIGEN = {
  quelle: "Sensorik",
  lizenz: "Eigenes Werk (selbst verfasst, englisches Original)",
  autor: "Sensorik-Lernplattform",
  en: {
    quelle: "Sensorik",
    lizenz: "Own work (self-written, English original)",
    autor: "Sensorik learning platform",
  },
} as const;

// ───────────────────────────────────────────────────────────────────────────
// kids · Eine Brieftaube im Fahrradunterstand. Ohne `grey` ist sie von Asche
// und Weiß; ohne `day` misst die Serie in Morgen, Nachmittagen und Nächten.
// ───────────────────────────────────────────────────────────────────────────
const THE_PIGEON_AND_THE_GREEN_RING: Serie = {
  slug: "en-i4-the-pigeon-and-the-green-ring",
  titel: "The Pigeon and the Green Ring",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids"],
  minTier: 3,
  topic: "tiere",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "The bike shelter at the school keeps the rain off.",
        "On the third stand sits a pigeon, of ash and white.",
        "It does not lift off when Suri comes up to it.",
        "Rafa stops too, and the bird holds its place.",
        "Its feathers are in a mess, and it looks worn out.",
        "Suri sees a ring on the left leg of the pigeon.",
        "The ring is green, and it has letters cut into it.",
        "Rafa runs in and gets Mrs Palmer from the office.",
        "Mrs Palmer looks at the bird for a long moment.",
        "She tells them that a ring like that comes from a loft.",
        "This pigeon has an owner, and it has a home.",
        "Then it hops down onto the concrete and does not move.",
      ],
    },
    {
      lines: [
        "Suri sets a dish of water down under the shelter.",
        "The caretaker, Mr Rasch, brings a handful of corn.",
        "The pigeon drinks first, and it drinks for a long time.",
        "Then it eats, and the class watches from the door.",
        "Mr Rasch brings a crate and lines it with a cloth.",
        "The bird steps in as if it has done this before.",
        "Suri reads the ring out loud, letter for letter.",
        "There is the name of a club and a set of numbers.",
        "Mrs Palmer looks the club up on the school screen.",
        "The loft is a hundred and ten miles to the north.",
        "She sends a note to the club, and no answer comes back.",
        "In the morning the crate is open, and the pigeon is gone.",
      ],
    },
    {
      lines: [
        "Suri finds the pigeon on the ridge of the bike shelter.",
        "It sits there in the sun and does not come down.",
        "At noon a call comes back from the pigeon club.",
        "A woman named Petra keeps the loft in the north.",
        "Petra tells Mrs Palmer that a storm cut across the race.",
        "Half of the birds came home late, and three did not.",
        "This one is a hen, and it is three seasons old.",
        "Petra asks the class to feed it for three afternoons.",
        "A tired pigeon has to rest before it can make the run.",
        "So Suri and Rafa fill the dish each morning.",
        "On the third afternoon the hen preens in the sun.",
        "Petra rings again: the bird can be let go at first light.",
      ],
    },
    {
      lines: [
        "Half the class is at the shelter before the first bell.",
        "Mr Rasch lifts the crate onto the low brick wall.",
        "Suri opens the front of it and then steps back.",
        "The hen stands in the gap for what feels like an hour.",
        "Then it goes up, and the sound of the wings fills the air.",
        "It turns three times over the roof of the sports hall.",
        "On the third turn it heads north and is a dot, then nothing.",
        "Petra sends a note that afternoon: the hen is in the loft.",
        "It came in at ten past three, she tells the class.",
        "The crate goes back to the shed, and the dish remains out.",
        "In spring a pigeon sits on the shelter again, ash and white.",
        "Suri looks at the leg, and the ring on it is green.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// kids + teens · Hartplatz gegen Parkplatz. Ohne `play` (y!) kommt die ganze
// Serie ohne das Verb aus: es gibt Spiele, Teams und Anstoßzeiten, aber
// niemand spielt. Ohne `money` heißt es `the funds` und `the cost`.
// ───────────────────────────────────────────────────────────────────────────
const THE_PITCH_BEHIND_THE_FLATS: Serie = {
  slug: "en-i4-the-pitch-behind-the-flats",
  titel: "The Pitch Behind the Flats",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids", "teens"],
  minTier: 3,
  topic: "alltag",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "The pitch behind the three blocks is not much to look at.",
        "It is tarmac, one cage fence, and a net with a hole in it.",
        "All the same, it is in use from four to dusk most afternoons.",
        "On a wet morning a notice goes up on the fence.",
        "It is printed on stiff paper and sealed in plastic.",
        "The council plans to make the ground into a car park.",
        "Lena reads it twice and then reads it out to Nico.",
        "Twelve spaces for the tenants of the three blocks.",
        "Bekir comes down from the top floor with his coat open.",
        "He reads the notice through and does not speak.",
        "At the foot of the sheet there is a date and a room number.",
        "The council meets on that matter in three weeks.",
      ],
    },
    {
      lines: [
        "Bekir tells the others that a notice is not a plan.",
        "It is a plan that people can still speak against.",
        "Lena asks how the council can be shown that the pitch is in use.",
        "So Bekir prints a sheet and pins it inside the stair door.",
        "Each person who comes to the pitch puts a stroke on it.",
        "Nico stands at the fence and counts for the first hour.",
        "The strokes run past a hundred before the week is out.",
        "Most of them are from the three blocks, and some are not.",
        "Mrs Osei from the ground floor adds a note at the foot.",
        "She sits at the fence most afternoons and watches the games.",
        "At the council office a clerk tells Bekir how it works.",
        "A petition can go on the list, and it needs three hundred names.",
      ],
    },
    {
      lines: [
        "Three hundred names is a lot for three blocks of flats.",
        "So the group takes the sheets to the shops on the main road.",
        "Lena talks to people at the bread counter for three hours.",
        "Nico gets a sheet full outside the school gate at four.",
        "Mr Delgado from the top block will not sign at first.",
        "He tells Lena that the noise comes up his stair until late.",
        "Bekir asks him what he needs, and it is not the car park.",
        "He needs a fence with a soft rail and a close time at nine.",
        "So the group adds both to the petition and reads it to him.",
        "Mr Delgado signs, and he takes a sheet to his own floor.",
        "On the last afternoon the names come to three hundred and four.",
        "The council puts the matter on the list for the meeting.",
      ],
    },
    {
      lines: [
        "The room at the council office is warm and full.",
        "Three of them are down to speak, and each has three minutes.",
        "Bekir reads out the count and the hours of use.",
        "Lena tells the room what the pitch is for the small children.",
        "Mr Delgado speaks last, and he speaks about the noise.",
        "Then he asks the council to fund the fence and not the car park.",
        "A council member asks where the twelve spaces are to go.",
        "Mrs Osei stands up and names the strip beside the old depot.",
        "The vote is put off, and a joint plan is asked for in autumn.",
        "In September the soft rail goes up on the top side of the cage.",
        "The net comes off, and a fresh one goes on the same hooks.",
        "The first match after that runs until the close time at nine.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// teens · Ein Foto, ein Nein und ein Wettbewerb. Ohne `you` ist jede Rede
// indirekt; ohne `next` heißt es `the runner behind her`.
// ───────────────────────────────────────────────────────────────────────────
const THE_PHOTO_SHE_DID_NOT_POST: Serie = {
  slug: "en-i4-the-photo-she-did-not-post",
  titel: "The Photo She Did Not Post",
  kind: "geschichte",
  lang: "en",
  stufen: ["teens"],
  minTier: 3,
  topic: "schule",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "The school sports afternoon runs from one until five.",
        "Pia has the loan of a camera from the media room.",
        "She shoots the long jump, the sprint, and the shot.",
        "Most of the frames are the same frame three hundred times.",
        "In the last race Fenna is out in front at the bend.",
        "Then her foot catches, and she comes down on the track.",
        "She is up again before the runner behind her comes past.",
        "She finishes last, and the whole stand is on its feet.",
        "Pia holds the shutter down through all of it.",
        "That night she goes through the frames on the school screen.",
        "One of them stops her: Fenna, on one knee, on the line.",
        "It is the best photo Pia has ever made.",
      ],
    },
    {
      lines: [
        "Casper runs the school paper, and he wants it for the front.",
        "He wants it on the school feed as well, and at once.",
        "Pia sends him the frame and then sits with it open.",
        "In the morning she finds Fenna at the locker stand.",
        "Fenna looks at the photo on the screen for a long time.",
        "Then she hands the phone back and asks Pia not to post it.",
        "Pia asks her what is not right about the frame.",
        "Fenna tells her that it is the fall, and it is her face.",
        "The school will see it, and so will people she does not know.",
        "Pia tells Casper at first break, and Casper is not pleased.",
        "He tells her the photo is hers and the track is a public place.",
        "Ms Halden hears the last of it from the media room door.",
      ],
    },
    {
      lines: [
        "Ms Halden does not settle the matter for them.",
        "She tells Casper that the law is not the whole of it.",
        "A paper that people trust asks first, she tells him.",
        "Casper holds his ground: the frame is the best in three seasons.",
        "There is a contest as well, with a print prize in October.",
        "Pia has until the end of the month to send in one photo.",
        "For two nights she goes back and forth over it.",
        "Then she takes the whole set to Fenna at the track.",
        "The two of them go through four hundred frames on a laptop.",
        "Fenna stops at one: her hands on her knees, ten strides from home.",
        "Her face is half out of it, and the stand is a blur behind.",
        "Fenna tells Pia that this one can go on the front.",
      ],
    },
    {
      lines: [
        "Pia sends the second frame in to the contest in October.",
        "It takes a place, and the print comes back in a stiff case.",
        "The paper runs the same photo across three columns.",
        "Casper writes the report and does not name the fall.",
        "The first frame remains where it is, on one drive, in one folder.",
        "In November Fenna asks Pia for a print of that first one.",
        "Not for the paper and not for the feed: for her own room.",
        "Pia makes it at ten inches and hands it over in a flat case.",
        "Fenna pins it above her desk, where it faces the door.",
        "In spring there is a meet on the track at the far side of town.",
        "Fenna asks Pia to come and shoot her on purpose this time.",
        "Pia checks the light at the bend and sets her stand up.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// teens · Praktikum in einer Werkstatt für Prothetik. Person zuerst: Renata
// benutzt eine Beinprothese. Ohne `next` heißt es `the cast after that`,
// ohne `Friday` `at the end of the week`.
// ───────────────────────────────────────────────────────────────────────────
const THE_PLACEMENT_IN_THE_LIMB_SHOP: Serie = {
  slug: "en-i4-the-placement-in-the-limb-shop",
  titel: "The Placement in the Limb Shop",
  kind: "geschichte",
  lang: "en",
  stufen: ["teens"],
  minTier: 3,
  topic: "technik",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "The limb shop sits behind the health centre, on the ground floor.",
        "Ivo has three afternoons there and then the whole of the week.",
        "The first thing he meets at the door is the smell of resin.",
        "On the racks stand casts of legs and arms, each with a label.",
        "Mr Sandor hands him a broom and points at the floor.",
        "Ivo sweeps for an hour and thinks that this is the whole of it.",
        "Then Gita calls him over to hold a cast on the stand.",
        "It has to hold still while she cuts the line of the trim.",
        "At three a client comes in and sits down at the bench.",
        "Renata uses a prosthetic leg, and she has done so for nine seasons.",
        "She rolls the trouser leg up and shows a red mark on her limb.",
        "The socket rubs, and it has rubbed there for three weeks.",
      ],
    },
    {
      lines: [
        "Mr Sandor gets down on one knee and reads the mark with a thumb.",
        "He tells Ivo that a socket is not made for a limb alone.",
        "It is made for a person and for how that person stands.",
        "Renata is on her feet all morning at a sorting bench.",
        "In the afternoon she is on a ramp at the loading door.",
        "Gita takes a fresh cast in plaster and marks the trim line.",
        "Ivo stirs the plaster and gets it too thin the first time.",
        "The second one holds, and Gita lets him fill the mould.",
        "The new socket comes off the mould at the end of the week.",
        "Renata comes in and stands, and the fit looks true.",
        "She walks the length of the shop and back three times.",
        "Then she stops and puts her hand on the same red spot.",
      ],
    },
    {
      lines: [
        "Mr Sandor takes the socket back to the bench and is not pleased.",
        "The cast is good, the trim is good, and it rubs all the same.",
        "Gita goes over the line of the fit for the third time.",
        "Ivo remembers a thing Renata said in her first hour.",
        "She uses one sock in the morning and two after the break.",
        "A limb is not the same at ten as it is at four.",
        "It is fuller in the morning and it draws in over the hours.",
        "Ivo asks whether the cast is taken at the wrong hour.",
        "Mr Sandor stops, and then he asks Renata to come in at eight.",
        "The cast after that is taken at half past eight in the morning.",
        "Gita fits a thin liner and a valve at the foot of the socket.",
        "Renata puts the leg on and stands, and no one speaks.",
      ],
    },
    {
      lines: [
        "She walks the shop, and then she walks it again.",
        "Mr Sandor asks her to take the ramp at the loading door.",
        "Renata goes up and down it four times without a stop.",
        "The red mark is still there, and it is not fresh.",
        "She takes the leg home for a week and rings at the end of it.",
        "The spot has gone, and the sock in the afternoon is one, not two.",
        "Gita writes the hour of the cast into the file in red.",
        "From then on the shop notes the hour of each cast it takes.",
        "On his last afternoon Ivo sweeps the floor again.",
        "Mr Sandor asks him back for the autumn and means it.",
        "Ivo can read a cast on the rack now, as he reads a print.",
        "He takes the smell of resin home in his coat for three nights.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// teens + erwachsen · Museumsdepot, falsches Etikett. Ohne `box` gibt es
// Kisten, Kästen und Regale; ohne `history` reden alle über Belege.
// ───────────────────────────────────────────────────────────────────────────
const THE_LABEL_IN_STORE_THREE: Serie = {
  slug: "en-i4-the-label-in-store-three",
  titel: "The Label in Store Three",
  kind: "geschichte",
  lang: "en",
  stufen: ["teens", "erwachsen"],
  minTier: 3,
  topic: "kultur",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Store three is cold from October to March.",
        "The racks run from the door to the far end in three rows.",
        "Vera comes in on three afternoons a month as a volunteer.",
        "Her task is the shelf of tools: measure, photo, check the card.",
        "Most of it is what the card on the shelf tells her it is.",
        "Then she comes to a press of oak with a metal screw.",
        "The card names it a cider press from a farm to the north.",
        "Vera has seen a cider press, and this is not one.",
        "The bed is flat and the plate is smooth, with no run for juice.",
        "The thread of the screw is fine, far too fine for fruit.",
        "She turns the press onto its side under the lamp.",
        "Under the foot of it there is a mark, cut deep into the oak.",
      ],
    },
    {
      lines: [
        "The mark is under a hundred winters of grease and dust.",
        "Vera cleans it with a soft brush and no water at all.",
        "Letters come up: a name, and under it the name of the town.",
        "She photos the mark from three sides and prints one of them.",
        "Iona has run the museum for eleven seasons.",
        "She looks at the print and tells Vera that the card is old.",
        "The press is a cider press in the printed guide as well.",
        "It is on the front of that guide, and the guide is in print.",
        "Vera asks for the file that came in with the press.",
        "Iona tells her that the files are in the room at the top.",
        "That room is not open to a volunteer on her own.",
        "So Iona comes up the stair with her and turns the lamp on.",
      ],
    },
    {
      lines: [
        "The file is thin: one form, one note, and one slip.",
        "The form has the name of the donor and the street.",
        "The street is the one the museum stands on, at the far end.",
        "The note is from the clerk who took the press in.",
        "It reads: press, from the old print house, sort out later.",
        "Later did not come, and the card was made from that one line.",
        "Vera puts the mark and the street beside each other.",
        "The name cut into the oak is the name of the print house.",
        "This is a press for damp paper, and not for fruit at all.",
        "Iona sits down on the stair with the file open on her knee.",
        "The trust prints three thousand guides, and the front is wrong.",
        "She tells Vera that the trustees meet in the first week of March.",
      ],
    },
    {
      lines: [
        "Anton runs the trust, and he has held that guide up for a long time.",
        "Iona puts the file and the print of the mark on his desk.",
        "She does not soften it: the front of the guide is wrong.",
        "Anton reads the note of the clerk twice and then closes the file.",
        "He asks how much a fresh run of guides would cost.",
        "Iona tells him the cost, and then she tells him a second thing.",
        "A slip in the front is cheap, and it can be in this week.",
        "The press comes out of store three in the middle of March.",
        "It stands now in the print house room, beside the case of blocks.",
        "The card names the maker, the street, and the hour it came in.",
        "Iona asks Vera to go back over the rest of the shelf.",
        "Three cards in, there is a second one that does not hold.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// erwachsen · Dolmetschen im Wohnungsamt. Ohne `you` ist die ganze Rede
// indirekt - was zu einer Dolmetscherin ohnehin passt. Ohne `survey` kommt
// eine Prüferin `with a meter and a lamp`.
// ───────────────────────────────────────────────────────────────────────────
const THE_INTERPRETER_AT_THE_HOUSING_DESK: Serie = {
  slug: "en-i4-the-interpreter-at-the-housing-desk",
  titel: "The Interpreter at the Housing Desk",
  kind: "geschichte",
  lang: "en",
  stufen: ["erwachsen"],
  minTier: 3,
  topic: "arbeit",
  herkunft: EIGEN,
  etappen: [
    {
      lines: [
        "Selma is at the housing office at half past nine.",
        "The appointment is at ten, and it is down for half an hour.",
        "She sets her rules out at the door, as she does each time.",
        "She renders all of it, and she adds not one word of her own.",
        "She is not an adviser, and she does not take a side.",
        "Mr Ambro has three more appointments after this one.",
        "He hopes it can be done in half the hour, and he tells her so.",
        "Nadim comes in with a folder under his arm and sits down.",
        "He has photos of the mould in the small bedroom.",
        "The mould comes back each autumn, and this is the third.",
        "Mr Ambro opens the file and reads the last note in it.",
        "The note is from a man who has not been in the flat.",
      ],
    },
    {
      lines: [
        "Mr Ambro talks for four minutes without a stop.",
        "He talks about the order, the list, and the funds for the autumn.",
        "Then he stops and asks Selma to tell Nadim that it is all fine.",
        "Selma does not render that, and she does not stop the room.",
        "She tells Mr Ambro that she cannot cut four minutes to one line.",
        "She renders what he said, all of it, in the order he said it.",
        "It runs long, and Mr Ambro looks at the clock on the far wall.",
        "Nadim understands the list, and he asks where his flat is on it.",
        "Mr Ambro does not have the list open on his screen.",
        "He tells Selma that this is not a thing he can give out.",
        "Selma renders that too, and she renders it flat.",
        "Nadim asks a second time, and the room goes still.",
      ],
    },
    {
      lines: [
        "The form on the screen has one field that stops the room.",
        "It asks whether the damp is structural or comes from the use.",
        "In the other language there is no one word for the second half.",
        "Selma renders both halves and then does a thing she seldom does.",
        "She tells both sides that the term has no clean match.",
        "She asks Mr Ambro to define it in his own words for the file.",
        "He does, and it takes him three goes to get it out.",
        "Nadim listens and then tells him he opens the window each morning.",
        "He dries the sill, and the mould comes back on the north wall.",
        "The half hour is gone, and the room after this one is at eleven.",
        "Mr Ambro stands up and reaches for the file.",
        "Selma remains where she is and asks for a second appointment.",
      ],
    },
    {
      lines: [
        "The second appointment comes three weeks later and runs an hour.",
        "Mrs Brenner has been in the flat with a meter and a lamp.",
        "She has read the north wall at three heights and written it up.",
        "The wall is cold, and a cold wall is not the fault of a tenant.",
        "Mr Ambro reads the order out and does not talk about funds.",
        "The work is down for October: the wall, the vent, and the sill.",
        "Nadim reads the order himself in both languages, line for line.",
        "He asks one thing more: what to do if October comes and goes.",
        "Mr Ambro gives him the name of the officer and a number to ring.",
        "Selma renders it, and then she closes her notes and stands.",
        "In the lift she writes one term into the list at the back of her pad.",
        "It is the list of words she still has no match for, and it is long.",
      ],
    },
  ],
};

/** Die sechs englischen Serien der Sprosse 26 (Charge I4). */
export const SERIEN_EN_I4_SPROSSE26: Serie[] = [
  THE_PIGEON_AND_THE_GREEN_RING,
  THE_PITCH_BEHIND_THE_FLATS,
  THE_PHOTO_SHE_DID_NOT_POST,
  THE_PLACEMENT_IN_THE_LIMB_SHOP,
  THE_LABEL_IN_STORE_THREE,
  THE_INTERPRETER_AT_THE_HOUSING_DESK,
];
