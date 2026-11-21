/**
 * DEUTSCHE GESCHICHTEN - Charge G2, 29.08.2026.
 * Vier für `kids`, sechs für `teens`, alle auf **Sprosse 27**.
 *
 * ── ZWEI QUELLEN, ZWEI RECHTSLAGEN ────────────────────────────────────────
 *
 * **kids:** Storybooks Deutschland (African Storybook), **CC BY 4.0**.
 * Namensnennung ist Pflicht und steht an jeder Serie. Die Originale sind sehr
 * kurz - 118 bis 155 Wörter -, eine Serie fasst rund 450. Hier wurde also
 * ausgebaut, nicht gekürzt: mehr Beobachtung, mehr Umgebung, derselbe Gang
 * der Handlung.
 *
 * **teens:** Johann Peter Hebel, »Schatzkästlein des rheinischen Hausfreundes«
 * (1811), **gemeinfrei** (gestorben 1826). Nacherzählt in heutiger Sprache -
 * Bauplan §10 erlaubt das Glätten alter Schreibweisen ausdrücklich, und hier
 * ist es nötig: das Original schreibt *Irrthum, Thür, seyn, vermuthlich*.
 * Nichts davon wäre für ein Kind von heute lesbar, und einiges davon ist gar
 * nicht tippbar.
 *
 * ── SPROSSE 27 ────────────────────────────────────────────────────────────
 *
 * Wie bei den deutschen Wissens-Serien: ohne `x`, `y`, `q` und ohne `ß`.
 * ⚠️ `ss` ist kein Ersatz für `ß` - wo ein Wort ein `ß` braucht, wird das Wort
 * ersetzt: *stark* statt gross, *sehr warm* statt heiss, *nennt man* statt
 * heisst. Die vollständige Liste steht im Kopf von `serienDeWissenKids.ts`.
 */
import type { Serie } from "./serie";

/**
 * Titel, Illustration, Übersetzung und LIZENZ je Vorlage, abgelesen am 23.09.2026
 * auf der jeweiligen Seite von Storybooks Deutschland („Geschrieben von /
 * Illustriert von / Übersetzt von / Quelle: … aus African Storybook").
 * ⚠️ Bis zu diesem Tag stand hier für alle vier „CC BY 4.0" - drei der vier
 * Vorlagen stehen aber unter CC BY 3.0. Die Lizenz verlangt die Nennung von
 * Text, Illustration und Übersetzung.
 */
const ASB_DE_ORIGINAL: Record<string, { titel: string; illustration: string; uebersetzung: string; lizenz: string; autorEn?: string }> = {
  "0089": { titel: "Khalai talks to plants", illustration: "Jesse Pietersen", uebersetzung: "Anna Westpfahl", lizenz: "CC BY 4.0" },
  "0004": { titel: "Goat, Dog and Cow", illustration: "Marleen Visser, Ingrid Schechter", uebersetzung: "Anna Westpfahl", lizenz: "CC BY 3.0" },
  "0337": { titel: "Children of wax", illustration: "Wiehan de Jager", uebersetzung: "Anna Westpfahl", lizenz: "CC BY 3.0", autorEn: "Southern African folktale" },
  "0095": { titel: "Zama is great!", illustration: "Vusi Malindi", uebersetzung: "Lisa Birkner", lizenz: "CC BY 3.0" },
};

function asbDe(autor: string, id: string) {
  const o = ASB_DE_ORIGINAL[id];
  return {
    quelle: `African Storybook („${o.titel}"), über Storybooks Deutschland`,
    lizenz: `${o.lizenz} (Nacherzählung: ausgebaut, in Tippzeilen zerlegt, ohne wörtliche Rede)`,
    autor: `${autor} (Original), Illustration ${o.illustration}, Übersetzung ${o.uebersetzung}; Nacherzählung: Sensorik-Lernplattform`,
    fundstelle: `https://global-asp.github.io/storybooks-deutschland/stories/de/${id}/`,
    en: {
      quelle: `African Storybook ("${o.titel}"), via Storybooks Deutschland`,
      lizenz: `${o.lizenz} (German retelling: expanded, split into typing lines, without direct speech)`,
      autor: o.autorEn
        ? `${o.autorEn}; illustrated by ${o.illustration}, translated by ${o.uebersetzung} (German version); retold for typing practice by Sensorik`
        : `Written by ${autor}, illustrated by ${o.illustration}, translated by ${o.uebersetzung} (German version); retold for typing practice by Sensorik`,
    },
  } as const;
}

const HEBEL = {
  quelle: "Johann Peter Hebel, Schatzkästlein des rheinischen Hausfreundes (1811), Nacherzählung",
  lizenz: "gemeinfrei",
  autor: "Johann Peter Hebel",
  fundstelle: "de.wikisource.org",
} as const;

// ───────────────────────────────────────────────────────────────────────────
const KHALAI_SPRICHT_MIT_PFLANZEN: Serie = {
  slug: "de-g2-khalai-spricht-mit-pflanzen",
  titel: "Khalai spricht mit den Pflanzen",
  kind: "geschichte",
  lang: "de",
  stufen: ["kids"],
  minTier: 3,
  topic: "natur",
  herkunft: asbDe("Ursula Nafula", "0089"),
  etappen: [
    {
      lines: [
        "Khalai ist sieben Jahre alt und wohnt am Rand des Dorfes.",
        "Ihr Name bedeutet in ihrer Sprache so viel wie die Gute.",
        "Khalai hat eine Gewohnheit, über die andere manchmal lachen.",
        "Sie spricht mit den Pflanzen, an denen sie vorbeikommt.",
        "Nicht im Spiel und nicht heimlich, sondern ganz laut.",
        "Am Morgen geht sie als Erstes in den Hof hinaus.",
        "Dort steht ein Orangenbaum, den ihr Vater gepflanzt hat.",
        "Sie legt eine Hand an den Stamm und wünscht ihm einen guten Tag.",
        "Sie bittet ihn, kräftig zu wachsen und Früchte zu tragen.",
        "Dann geht sie zurück ins Haus und isst ihr Frühstück.",
        "Der Baum antwortet ihr nicht, und das erwartet sie auch nicht.",
        "Sie sagt, dass ein Baum trotzdem hört, was man ihm sagt.",
      ],
    },
    {
      lines: [
        "Auf dem Weg zur Schule kommt sie an einer Wiese vorbei.",
        "Das Gras dort ist in der Trockenzeit hart und braun.",
        "Khalai bleibt stehen und redet auch mit dem Gras.",
        "Sie bittet es, grün zu bleiben und nicht ganz zu vertrocknen.",
        "Ein Stück weiter stehen Blumen am Rand des Pfades.",
        "Sie bittet die Blumen, weiter zu blühen.",
        "Dann kann sie sich eine davon ins Haar stecken.",
        "Sie nimmt aber nie mehr als eine einzige mit.",
        "Am Schulhof steht ein alter Baum mit weiten Ästen.",
        "Unter ihm sitzen die Kinder in der Mittagspause.",
        "Khalai bittet ihn, weiter so breite Äste zu machen.",
        "Dann bleibt der Schatten für alle weit genug.",
      ],
    },
    {
      lines: [
        "Um die Schule herum läuft eine dichte Hecke.",
        "Auch zu ihr sagt Khalai jeden Morgen etwas.",
        "Sie soll dicht bleiben und niemanden hereinlassen, der stört.",
        "Die anderen Kinder haben sich daran gewöhnt.",
        "Am Anfang haben manche über sie gelacht.",
        "Inzwischen lacht niemand mehr, und einige machen es nach.",
        "Die Lehrerin hat einmal gefragt, warum sie das tut.",
        "Khalai hat geantwortet, dass Pflanzen auch leben.",
        "Wer lebt, dem sagt man am Morgen etwas Freundliches.",
        "Die Lehrerin hat darauf nichts erwidert.",
        "Am nächsten Tag hat sie eine Pflanze mit in die Klasse gebracht.",
        "Seitdem steht sie am Fenster, und die Kinder pflegen sie.",
      ],
    },
    {
      lines: [
        "Am Nachmittag geht Khalai denselben Weg zurück.",
        "Sie schaut nach, ob die Blumen noch offen sind.",
        "Sie schaut, ob das Gras den harten Mittag überstanden hat.",
        "Zu Hause geht sie wieder zuerst zum Orangenbaum.",
        "Sie erzählt ihm, was in der Schule gewesen ist.",
        "Ihre Mutter hört das durch das offene Fenster.",
        "Sie hat aufgehört, sich darüber zu wundern.",
        "In diesem Jahr trägt der Orangenbaum zum ersten Mal.",
        "Es hängen nicht viele Früchte daran, aber es hängen welche.",
        "Khalai sagt, das komme vom Reden.",
        "Ihr Vater sagt, das komme vom Wasser und vom Mist.",
        "Die beiden sind sich darin bis heute nicht einig.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const ZIEGE_HUND_UND_KUH: Serie = {
  slug: "de-g2-ziege-hund-und-kuh",
  titel: "Ziege, Hund und Kuh",
  kind: "geschichte",
  lang: "de",
  stufen: ["kids"],
  minTier: 3,
  topic: "tiere",
  herkunft: asbDe("Fabian Wakholi", "0004"),
  etappen: [
    {
      lines: [
        "Ziege, Hund und Kuh waren einmal die besten Freunde.",
        "Sie machten alles gemeinsam und stritten nie lange.",
        "Eines Morgens beschlossen sie, einen Ausflug zu machen.",
        "Sie wollten in die Stadt fahren und den Markt ansehen.",
        "Zu weit war es zum Gehen, also nahmen sie einen Wagen.",
        "Der Fahrer sah die drei an und liess sie einsteigen.",
        "Die Kuh sass vorn, weil sie am breitesten war.",
        "Hund und Ziege sassen hinten und schauten hinaus.",
        "Die Fahrt war lang, und sie war schön.",
        "Sie sahen Felder, Hütten und einen Fluss.",
        "In der Stadt liefen sie über den Markt und staunten.",
        "Am Abend fuhren sie mit demselben Wagen zurück.",
      ],
    },
    {
      lines: [
        "Als sie ankamen, hielt der Fahrer die Hand auf.",
        "Er wollte den Fahrpreis haben, und das war sein gutes Recht.",
        "Die Kuh zahlte als Erste, und sie zahlte genau.",
        "Sie hatte den Betrag am Morgen schon abgezählt.",
        "Dann war der Hund an der Reihe.",
        "Er hatte das Geld nicht passend dabei.",
        "Also gab er mehr, als er zahlen musste.",
        "Der Fahrer nickte und griff nach seiner Tasche.",
        "Er wollte dem Hund das Wechselgeld herausgeben.",
        "In diesem Augenblick sprang die Ziege aus dem Wagen.",
        "Sie lief den Weg hinunter, so schnell sie konnte.",
        "Bezahlt hatte sie nichts.",
      ],
    },
    {
      lines: [
        "Der Fahrer sprang auf und rief hinter ihr her.",
        "Die Ziege war schon zwischen den Hütten verschwunden.",
        "Da wurde der Fahrer sehr zornig.",
        "Er stieg ein, schlug die Tür zu und fuhr davon.",
        "Das Wechselgeld für den Hund nahm er einfach mit.",
        "Der Hund stand auf dem Weg und schaute dem Wagen nach.",
        "Er hatte zu viel gezahlt und nichts zurückbekommen.",
        "Die Kuh stand daneben und hatte genau bezahlt.",
        "Ihr konnte nichts fehlen, und ihr fehlte auch nichts.",
        "Die drei waren an diesem Abend keine Freunde mehr.",
        "Jeder ging in eine andere Richtung nach Hause.",
        "Und dabei ist es geblieben, sagt die Geschichte.",
      ],
    },
    {
      lines: [
        "Darum läuft ein Hund noch heute zu jedem Auto hin.",
        "Er stellt sich davor und schaut den Fahrer an.",
        "Er will wissen, ob das der ist, der ihm noch Geld schuldet.",
        "Und darum rennt eine Ziege weg, wenn sie ein Auto hört.",
        "Sie hat Angst, dass man sie holt und zur Rede stellt.",
        "Sie hat ja damals nicht bezahlt und ist weggelaufen.",
        "Die Kuh dagegen bleibt einfach stehen.",
        "Sie schaut dem Auto ruhig hinterher und kaut weiter.",
        "Sie hat bezahlt, was sie schuldig war.",
        "Deshalb muss sie vor keinem Wagen davonlaufen.",
        "Man kann das an jedem Weg selbst nachsehen.",
        "Alle drei tun genau das, was die Geschichte sagt.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const KINDER_AUS_WACHS: Serie = {
  slug: "de-g2-kinder-aus-wachs",
  titel: "Die Kinder aus Wachs",
  kind: "geschichte",
  lang: "de",
  stufen: ["kids"],
  minTier: 3,
  topic: "sage",
  herkunft: asbDe("Südafrikanisches Volksmärchen", "0337"),
  etappen: [
    {
      lines: [
        "Es war einmal eine Familie, in der alle zufrieden waren.",
        "Die Kinder stritten nicht, und keiner musste sie antreiben.",
        "Sie halfen im Haus und drüben auf den Feldern.",
        "Sie taten es gern, und sie taten es ohne Klage.",
        "Eine einzige Regel gab es, und die war streng.",
        "Kein Kind durfte in die Nähe von Feuer kommen.",
        "Keines durfte am Tag hinaus in die Sonne.",
        "Alle Arbeit musste in der Nacht getan werden.",
        "Das klingt seltsam, und dafür gab es einen Grund.",
        "Diese Kinder waren nämlich aus Wachs gemacht.",
        "Am kühlen Abend waren sie fest und kräftig.",
        "In der Wärme wären sie weich geworden.",
      ],
    },
    {
      lines: [
        "Also arbeiteten sie unter dem Mond und schliefen am Tag.",
        "Sie kannten die Felder im Dunkeln besser als andere im Hellen.",
        "Sie wussten, wo jeder Stein lag und wo der Weg abbog.",
        "Einer der Brüder aber war nicht zufrieden damit.",
        "Er hatte die Sonne nur durch die Ritzen der Wand gesehen.",
        "Er hatte gehört, wie die anderen im Dorf von ihr redeten.",
        "Er wollte wissen, wie ein Tag aussieht.",
        "Er wollte einmal am Mittag über ein Feld gehen.",
        "Seine Brüder redeten lange auf ihn ein.",
        "Sie sagten ihm, was mit ihm geschehen würde.",
        "Er hörte zu, und die Sehnsucht blieb stärker.",
        "Eines Morgens ging er hinaus, bevor jemand wach war.",
      ],
    },
    {
      lines: [
        "Er stellte sich mitten auf das Feld und sah nach oben.",
        "Was er sah, war so hell, wie er es sich gedacht hatte.",
        "Er stand still und schaute, bis die Sonne höher stieg.",
        "Dann wurde ihm warm, und er ging nicht mehr weg.",
        "Als die Brüder ihn fanden, war es zu spät.",
        "Von dem Bruder war nur noch ein Klumpen Wachs übrig.",
        "Die Kinder standen um ihn herum und weinten.",
        "Sie hoben den Klumpen auf und trugen ihn nach Hause.",
        "Lange sassen sie beisammen und sprachen kein Wort.",
        "Dann fasste die älteste Schwester einen Plan.",
        "Sie sagte, der Bruder habe die Sonne sehen wollen.",
        "Also solle er ihr näher kommen, als sie alle es könnten.",
      ],
    },
    {
      lines: [
        "In der Nacht setzten sie sich zusammen an den Tisch.",
        "Sie nahmen das Wachs und formten es mit den Händen.",
        "Sie machten daraus einen Vogel mit weiten Flügeln.",
        "Sie arbeiteten bis kurz vor dem ersten Licht.",
        "Dann trugen sie den Vogel auf einen hohen Berg.",
        "Sie setzten ihn auf einen Stein, der nach Osten zeigte.",
        "Dann liefen sie den Berg hinunter in den Schatten.",
        "Von dort sahen sie zu, wie die Sonne über den Rand kam.",
        "Das Licht traf den Vogel auf dem Stein.",
        "Er hob die Flügel und flog davon, dem Licht entgegen.",
        "Dabei sang er, und die Kinder hörten es bis hinunter.",
        "Seitdem sehen sie ihn manchmal am Morgen über dem Feld.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const KANNITVERSTAN: Serie = {
  slug: "de-g2-kannitverstan",
  titel: "Kannitverstan",
  kind: "geschichte",
  lang: "de",
  stufen: ["teens"],
  minTier: 3,
  topic: "kultur",
  herkunft: HEBEL,
  etappen: [
    {
      lines: [
        "Ein junger Handwerker aus Deutschland kam nach Amsterdam.",
        "Er war viele Wochen lang gewandert, mit einem Bündel.",
        "Die Stadt war reich, und er hatte so etwas nie gesehen.",
        "Überall standen hohe Häuser mit Fenstern wie Türen.",
        "Im Hafen lagen die Schiffe dicht an dicht.",
        "Auf den Wegen drängten sich mehr Menschen als in seinem Dorf.",
        "Ein Haus fiel ihm besonders ins Auge.",
        "Es hatte sechs Kamine auf dem Dach und Blumen in den Fenstern.",
        "Er blieb davor stehen und betrachtete es lange.",
        "Dann sprach er einen Mann an, der vorbeiging.",
        "Er fragte ihn, wem dieses schöne Haus wohl gehöre.",
        "Der Mann hatte es eilig und verstand kein Deutsch.",
      ],
    },
    {
      lines: [
        "Er sagte nur ein Wort und ging weiter.",
        "Das Wort war: Kannitverstan.",
        "Auf Deutsch bedeutet es: ich kann Sie nicht verstehen.",
        "Der junge Mann wusste das nicht.",
        "Er hielt es für den Namen des Hausbesitzers.",
        "Das muss ein sehr reicher Herr sein, dachte er.",
        "Und er ging weiter durch die Gassen der Stadt.",
        "Nach einer Weile kam er an den Hafen hinunter.",
        "Dort lag ein Schiff, das eben aus Indien gekommen war.",
        "Man trug Kisten und Ballen die Planke hinunter.",
        "Zucker, Kaffee, Reis und Gewürze lagen in solchen Mengen da,",
        "Dass er nicht wusste, wo man das alles hinbringen sollte.",
      ],
    },
    {
      lines: [
        "Er fragte einen Mann, wem diese Ladung gehöre.",
        "Der Mann verstand ihn nicht und antwortete: Kannitverstan.",
        "Da dachte der junge Handwerker: nun sieh einer an.",
        "Dem gehört das schöne Haus, und dem gehört auch das Schiff.",
        "Es ist ein Elend, wie ungleich es zugeht auf der Welt.",
        "Er dachte an sein eigenes Bündel und an seine Schuhe.",
        "Er dachte daran, was er zu Hause besass.",
        "Es war nicht viel, und es passte in einen Sack.",
        "Er ging weiter und war nicht mehr so guter Laune.",
        "In einer stillen Gasse kam ihm ein Zug entgegen.",
        "Es war ein Begräbnis, mit vier Männern und einem Sarg.",
        "Dahinter gingen die Leute in schwarzen Mänteln.",
      ],
    },
    {
      lines: [
        "Der junge Mann blieb stehen und nahm die Mütze ab.",
        "Er ging ein Stück mit, wie es sich gehört.",
        "Dann fragte er den Letzten im Zug, wer da begraben werde.",
        "Der Mann verstand ihn nicht und sagte: Kannitverstan.",
        "Da stand der junge Handwerker still und liess sie ziehen.",
        "Also auch der Herr Kannitverstan, dachte er.",
        "Das Haus, das Schiff und die Kisten voll Gewürz.",
        "Und nun ein Sarg und vier Männer und ein Loch im Boden.",
        "Von allem, was ihm gehört hatte, nahm er nichts mit.",
        "Von dem, was ich habe, nehme ich am Ende auch nichts mit.",
        "Und er ging weiter, und es ging ihm leichter als vorher.",
        "So kam er auf einem Umweg zu einer richtigen Erkenntnis.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const DER_GEHEILTE_PATIENT: Serie = {
  slug: "de-g2-der-geheilte-patient",
  titel: "Der geheilte Kranke",
  kind: "geschichte",
  lang: "de",
  stufen: ["teens"],
  minTier: 3,
  topic: "koerper",
  herkunft: HEBEL,
  etappen: [
    {
      lines: [
        "Ein reicher Mann in Amsterdam ging es sehr schlecht.",
        "Er hatte alles, was ein Mensch sich wünschen kann.",
        "Er hatte ein Haus, Bedienstete und volle Truhen.",
        "Und trotzdem war ihm jeden Morgen elend zumute.",
        "Er hatte Schmerzen im Kopf und Druck im Magen.",
        "Er war müde, obwohl er nichts tat.",
        "Er war satt, obwohl ihm nichts schmeckte.",
        "Er liess einen Arzt nach dem anderen kommen.",
        "Jeder verschrieb ihm etwas anderes, und nichts half.",
        "Am Ende hörte er von einem Arzt weit weg im Land.",
        "Dieser Arzt hatte den Ruf, alles heilen zu können.",
        "Der Kranke schrieb ihm einen langen Brief.",
      ],
    },
    {
      lines: [
        "Er beschrieb darin jede Beschwerde, die er hatte.",
        "Der Arzt las den Brief und dachte eine Weile nach.",
        "Dann schrieb er zurück, und die Antwort war kurz.",
        "Es gebe ein Mittel, das sicher helfe, schrieb er.",
        "Es sei eine Wurzel, die weit im Süden wachse.",
        "Er könne sie nicht schicken, das gehe nicht.",
        "Der Kranke müsse sie selbst holen kommen.",
        "Und er dürfe dabei keinen Wagen benutzen.",
        "Er müsse den ganzen Weg selbst gehen, Schritt für Schritt.",
        "Sonst verliere das Mittel seine ganze Kraft.",
        "Der reiche Mann las das und war entsetzt.",
        "Aber er war krank genug, um es zu versuchen.",
      ],
    },
    {
      lines: [
        "Am nächsten Morgen brach er auf, mit einem Stock.",
        "Am ersten Tag kam er nicht weit und legte sich früh hin.",
        "Er schlief so tief wie seit Jahren nicht mehr.",
        "Am zweiten Tag ging er schon ein Stück weiter.",
        "Am dritten Tag bekam er Hunger, richtigen Hunger.",
        "Er ass Brot und Käse in einem Wirtshaus am Weg.",
        "Es schmeckte ihm besser als alles zu Hause.",
        "So ging es Woche um Woche weiter nach Süden.",
        "Er sah Felder, Berge, Flüsse und fremde Städte.",
        "Er sprach mit Bauern, Fuhrleuten und Handwerkern.",
        "Seine Kleider wurden weiter, und er merkte es kaum.",
        "Der Kopf tat nicht mehr weh, und der Magen war ruhig.",
      ],
    },
    {
      lines: [
        "Nach vielen Wochen kam er beim fremden Arzt an.",
        "Er trat in die Stube und wollte nach der Wurzel fragen.",
        "Der Arzt sah ihn an und fragte, wie es ihm gehe.",
        "Der Mann musste nachdenken, bevor er antworten konnte.",
        "Dann sagte er, es gehe ihm eigentlich sehr gut.",
        "Besser als seit vielen Jahren, sagte er.",
        "Da lächelte der Arzt und holte kein Mittel hervor.",
        "Er sagte, es gebe die Wurzel nicht.",
        "Es habe sie nie gegeben, und es brauche sie nicht.",
        "Was ihm gefehlt habe, sei der Weg gewesen.",
        "Er solle jetzt auf denselben Beinen wieder heimgehen.",
        "Und danach jeden Tag ein Stück davon wiederholen.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const SELTSAMER_SPAZIERRITT: Serie = {
  slug: "de-g2-seltsamer-spazierritt",
  titel: "Der seltsame Spazierritt",
  kind: "geschichte",
  lang: "de",
  stufen: ["teens"],
  minTier: 3,
  topic: "alltag",
  herkunft: HEBEL,
  etappen: [
    {
      lines: [
        "Ein Vater ging mit seinem Sohn über Land.",
        "Sie hatten einen Esel dabei, und der Weg war weit.",
        "Am Anfang liefen alle drei nebeneinander her.",
        "Der Esel trug nichts, und keiner sass auf ihm.",
        "So kamen sie durch das erste Dorf.",
        "Vor den Häusern standen Leute und sahen ihnen nach.",
        "Einer rief ihnen hinterher und lachte dabei.",
        "Da laufen zwei neben einem Esel her, sagte er.",
        "Wozu hat man denn ein Tier, wenn man selber geht?",
        "Der Vater dachte, dass da etwas dran sei.",
        "Er hob den Jungen hinauf und setzte ihn auf den Esel.",
        "So gingen sie weiter, und der Vater lief daneben.",
      ],
    },
    {
      lines: [
        "Im nächsten Dorf standen wieder Leute am Weg.",
        "Diesmal war es eine ältere Frau, die etwas sagte.",
        "Seht euch diesen Jungen an, sagte sie laut.",
        "Sitzt oben wie ein Herr, und der Vater läuft.",
        "So sind sie heute, sagte sie, und schüttelte den Kopf.",
        "Der Junge wurde rot und rutschte herunter.",
        "Er sagte, der Vater solle sich hinaufsetzen.",
        "Der Vater sträubte sich, und dann tat er es doch.",
        "So gingen sie weiter, und der Junge lief nebenher.",
        "Im dritten Dorf standen drei Männer an einem Zaun.",
        "Einer von ihnen zeigte auf sie und rief etwas.",
        "Der Alte reitet, und das Kind muss laufen, rief er.",
      ],
    },
    {
      lines: [
        "Da hielt der Vater an und dachte nach.",
        "Dann hob er den Jungen zu sich hinauf.",
        "Jetzt sassen beide auf dem Esel und ritten weiter.",
        "Das schien ihnen die vernünftigste Lösung zu sein.",
        "Im vierten Dorf kam ihnen ein Bauer entgegen.",
        "Er blieb stehen und sah sich das Tier genau an.",
        "Dann fragte er, ob der Esel ihnen gehöre.",
        "Der Vater sagte ja, das tue er.",
        "Da sagte der Bauer, das habe er sich gedacht.",
        "Ein fremdes Tier würde man nicht so behandeln.",
        "Zwei Personen auf einem Esel, sagte er, das sei zu viel.",
        "Die beiden stiegen ab und standen wieder auf dem Weg.",
      ],
    },
    {
      lines: [
        "Der Vater setzte sich an den Rand und dachte lange nach.",
        "Wir sind gelaufen, und man hat uns ausgelacht.",
        "Der Junge ist geritten, und man hat geschimpft.",
        "Ich bin geritten, und man hat auch geschimpft.",
        "Wir sind beide geritten, und es war wieder falsch.",
        "Es gibt keine Art, es allen recht zu machen.",
        "Der Junge fragte, was sie denn nun tun sollten.",
        "Der Vater sagte, sie würden es so machen wie zuerst.",
        "Nicht weil es richtiger sei als das andere.",
        "Sondern weil sie es selbst so am liebsten hätten.",
        "Und so gingen sie weiter, alle drei nebeneinander.",
        "Im nächsten Dorf lachte wieder jemand, und es war ihnen gleich.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const ZAMA_IST_TOLL: Serie = {
  slug: "de-g2-zama-ist-toll",
  titel: "Zama kann das schon",
  kind: "geschichte",
  lang: "de",
  stufen: ["kids"],
  minTier: 3,
  topic: "alltag",
  herkunft: asbDe("Michael Oguttu", "0095"),
  etappen: [
    {
      lines: [
        "Mein kleiner Bruder schläft am Morgen sehr lange.",
        "Ich wache früh auf, und dafür gibt es einen Grund.",
        "Ich bin nämlich diejenige, die die Sonne hereinlässt.",
        "Ich gehe zum Fenster und mache den Laden auf.",
        "Dann liegt ein heller Streifen mitten auf dem Boden.",
        "Meine Mutter nennt mich deswegen ihren Morgenstern.",
        "Danach wasche ich mich, und ich brauche keine Hilfe.",
        "Das Wasser ist kalt, und das macht mir nichts aus.",
        "Die Seife ist blau und riecht nach etwas Frischem.",
        "Meine Mutter ruft mir zu, die Zähne nicht zu vergessen.",
        "Ich rufe zurück, dass ich das ganz sicher nie tue.",
        "Danach bin ich fertig, und der Tag kann anfangen.",
      ],
    },
    {
      lines: [
        "Als Erstes gehe ich zu meinem Opa in den Hof.",
        "Er sitzt dort schon und trinkt seinen Tee.",
        "Ich wünsche ihm einen guten Tag, und er wünscht mir auch einen.",
        "Dann gehe ich zu meiner Tante in die Küche.",
        "Sie ist immer vor allen anderen wach.",
        "Auch ihr wünsche ich einen schönen Tag.",
        "Danach ziehe ich mich an, und auch das kann ich allein.",
        "Ich sage meiner Mutter, dass ich jetzt selber kann.",
        "Ich kann alle meine Knöpfe selber zumachen.",
        "Ich kann meine Schnürsenkel binden, mit einer Schlaufe.",
        "Am Anfang habe ich das lange geübt.",
        "Jetzt geht es schnell, und ich denke gar nicht mehr nach.",
      ],
    },
    {
      lines: [
        "Vor der Schule wecke ich meinen kleinen Bruder.",
        "Er ist noch klein und schafft vieles nicht allein.",
        "Ich helfe ihm beim Waschen und beim Anziehen.",
        "Dann sage ich ihm, was heute in der Schule ansteht.",
        "Er versteht das meiste noch nicht.",
        "Er hört trotzdem zu, und er stellt viele Fragen.",
        "In der Schule gebe ich mir Mühe, jeden Tag.",
        "Ich melde mich, auch wenn ich nicht ganz sicher bin.",
        "Manchmal ist die Antwort falsch, und das ist nicht schlimm.",
        "In der Pause spiele ich mit den anderen im Hof.",
        "Am Nachmittag helfe ich zu Hause, wo es nötig ist.",
        "Ich hole Wasser und ich fege den Hof.",
      ],
    },
    {
      lines: [
        "Wenn ich all das getan habe, bin ich zufrieden.",
        "Ich sage dann, dass ich toll bin, und ich sage es laut.",
        "Nicht damit die anderen es hören.",
        "Sondern damit ich es selber höre.",
        "Meine Mutter sagt, ich solle nicht übertreiben.",
        "Aber sie lächelt dabei, und das sehe ich genau.",
        "Am Abend zeige ich meinem Bruder, was ich gelernt habe.",
        "Er sitzt neben mir und schaut in mein Heft.",
        "Eines Tages wird er das alles auch können.",
        "Dann werde ich ihm sagen, dass er toll ist.",
        "Bis dahin sage ich es über mich selbst.",
        "Und morgen früh mache ich wieder den Laden auf.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const DAS_MITTAGESSEN_IM_HOF: Serie = {
  slug: "de-g2-das-mittagessen-im-hof",
  titel: "Das Mittagessen im Hof",
  kind: "geschichte",
  lang: "de",
  stufen: ["teens"],
  minTier: 3,
  topic: "gerechtigkeit",
  herkunft: HEBEL,
  etappen: [
    {
      lines: [
        "Ein Handwerksbursche war den ganzen Vormittag gewandert.",
        "Um Mittag kam er in eine Stadt und suchte einen Platz.",
        "Er hatte ein Stück Brot dabei und sonst nichts.",
        "Geld für ein Wirtshaus hatte er nicht.",
        "Im Hof eines Gasthauses stand eine Bank an der Wand.",
        "Dort setzte er sich hin und packte sein Brot aus.",
        "Aus dem Fenster der Küche kam der Dampf herüber.",
        "Es roch nach Braten, nach Zwiebeln und nach Suppe.",
        "Der Bursche ass sein trockenes Brot und roch dazu.",
        "Es schmeckte ihm besser als sonst, und er sagte es laut.",
        "Ein solches Mittagessen habe er lange nicht gehabt.",
        "Der Wirt stand hinter dem Fenster und hörte das.",
      ],
    },
    {
      lines: [
        "Er kam heraus in den Hof und stellte sich vor ihn hin.",
        "Er sagte, der Bursche habe von seiner Küche gegessen.",
        "Er habe den Duft genommen, und der gehöre ihm.",
        "Also solle er dafür bezahlen wie jeder andere Gast.",
        "Der Bursche sagte, er habe nur sein eigenes Brot gegessen.",
        "Der Wirt sagte, das Brot sei nicht die Sache.",
        "Die Sache sei der Geruch, und den habe er gemacht.",
        "Der Bursche zeigte ihm seinen Beutel, und der war leer.",
        "Da wurde der Wirt lauter, und Leute blieben stehen.",
        "Am Ende gingen die beiden vor den Richter.",
        "Der Richter liess sich alles der Reihe nach erzählen.",
        "Zuerst den Wirt, dann den Burschen, dann noch einmal beide.",
      ],
    },
    {
      lines: [
        "Der Richter dachte nach und fragte dann den Wirt.",
        "Ob er das Essen selbst gegeben habe, wollte er wissen.",
        "Der Wirt sagte nein, das Essen sei in der Küche geblieben.",
        "Ob der Bursche denn im Haus gesessen habe.",
        "Der Wirt sagte nein, er habe im Hof gesessen.",
        "Was er denn dann bekommen habe, fragte der Richter.",
        "Der Wirt sagte, er habe den Duft bekommen.",
        "Der Richter nickte und sagte, das sei klar.",
        "Dann wandte er sich an den Burschen mit einer Frage.",
        "Ob er irgendein Geldstück bei sich habe, ganz gleich welches.",
        "Der Bursche fand in einer Naht noch zwei Münzen.",
        "Er holte sie heraus und legte sie auf den Tisch.",
      ],
    },
    {
      lines: [
        "Der Richter nahm die beiden Münzen in die Hand.",
        "Er hielt sie hoch, damit alle im Raum sie sehen konnten.",
        "Dann liess er sie auf die Tischplatte fallen.",
        "Sie klangen hell, und der Klang stand kurz im Raum.",
        "Der Richter hob die Münzen wieder auf.",
        "Er gab sie dem Burschen zurück, in dessen Hand.",
        "Dann sagte er zum Wirt, damit sei die Sache erledigt.",
        "Für den Duft des Essens habe er den Klang des Geldes bekommen.",
        "Das eine sei so viel wert wie das andere.",
        "Die Leute im Raum lachten, und der Wirt ging hinaus.",
        "Der Bursche steckte seine zwei Münzen wieder ein.",
        "Dann wanderte er weiter, und es war noch früh am Tag.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const DER_KLUGE_RICHTER: Serie = {
  slug: "de-g2-der-kluge-richter",
  titel: "Der kluge Richter",
  kind: "geschichte",
  lang: "de",
  stufen: ["teens"],
  minTier: 3,
  topic: "gerechtigkeit",
  herkunft: HEBEL,
  etappen: [
    {
      lines: [
        "Ein reicher Kaufmann verlor auf dem Markt seinen Beutel.",
        "Darin lagen siebenhundert Taler in Silber.",
        "Er merkte es erst am Abend, als er zahlen wollte.",
        "Da griff er in die Tasche, und die Tasche war leer.",
        "Er lief zurück und suchte den ganzen Weg ab.",
        "Er fand nichts, und die Stände waren längst abgebaut.",
        "Also liess er in der Stadt ausrufen, was geschehen war.",
        "Wer den Beutel bringe, bekomme hundert Taler zur Belohnung.",
        "Am nächsten Morgen klopfte ein armer Mann an seine Tür.",
        "Er hatte den Beutel gefunden, und er brachte ihn.",
        "Er hatte ihn nicht geöffnet und nichts herausgenommen.",
        "Er legte ihn auf den Tisch und wartete.",
      ],
    },
    {
      lines: [
        "Der Kaufmann nahm den Beutel und zählte das Geld nach.",
        "Es waren siebenhundert Taler, keiner fehlte.",
        "Dann sah er den armen Mann an und überlegte.",
        "Hundert Taler waren eine hohe Summe.",
        "Er wollte sie nicht hergeben, und er hatte sie versprochen.",
        "Da sagte er, in dem Beutel seien achthundert gewesen.",
        "Jetzt seien nur noch siebenhundert darin.",
        "Der Finder habe seinen Lohn also bereits genommen.",
        "Damit sei die Sache erledigt und nichts mehr offen.",
        "Der arme Mann erschrak und sagte, das sei nicht wahr.",
        "Er habe den Beutel nicht einmal aufgemacht.",
        "Der Kaufmann blieb dabei, und keiner gab nach.",
      ],
    },
    {
      lines: [
        "Am Ende standen die beiden vor dem Richter.",
        "Der Richter liess sich zuerst den Kaufmann anhören.",
        "Der sagte, in seinem Beutel seien achthundert Taler gewesen.",
        "Dabei blieb er, und er wiederholte es dreimal.",
        "Dann liess der Richter den armen Mann sprechen.",
        "Der sagte, er habe den Beutel so gebracht, wie er ihn fand.",
        "Er habe ihn nicht geöffnet, und er habe nichts genommen.",
        "Auch dabei blieb er, so oft man ihn fragte.",
        "Der Richter liess sich den Beutel bringen und zählte selbst.",
        "Es waren siebenhundert Taler darin, das stand fest.",
        "Dann sass er eine Weile still und dachte nach.",
        "Danach sprach er sein Urteil, und es war kurz.",
      ],
    },
    {
      lines: [
        "Der Kaufmann habe achthundert Taler verloren, sagte er.",
        "Daran wolle er nicht zweifeln, das habe der Mann beschworen.",
        "Der Finder habe einen Beutel mit siebenhundert gebracht.",
        "Auch daran wolle er nicht zweifeln.",
        "Dann aber, sagte der Richter, sei das nicht derselbe Beutel.",
        "Der Beutel des Kaufmanns müsse noch irgendwo liegen.",
        "Er solle weiter danach suchen lassen.",
        "Dieser hier gehöre so lange dem, der ihn gefunden habe.",
        "Bis sich der rechte Besitzer melde, bleibe er bei ihm.",
        "Damit gab er dem armen Mann den ganzen Beutel.",
        "Der Kaufmann stand auf und sagte kein Wort mehr.",
        "Er hat sich nie wieder nach seinen achthundert Talern erkundigt.",
      ],
    },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
const DER_BARBIERJUNGE: Serie = {
  slug: "de-g2-der-barbierjunge",
  titel: "Der Barbierjunge von Segringen",
  kind: "geschichte",
  lang: "de",
  stufen: ["teens"],
  minTier: 3,
  topic: "mut",
  herkunft: HEBEL,
  etappen: [
    {
      lines: [
        "In Segringen gab es einen Barbier mit einem Lehrjungen.",
        "Der Junge war noch nicht lange dort und lernte erst.",
        "Er hatte bis dahin nur wenige Kunden rasiert.",
        "Der Meister sah ihm dabei über die Schulter.",
        "Eines Nachmittags kam ein fremder Mann in den Laden.",
        "Er war zu Pferd gekommen und hatte es eilig.",
        "Er setzte sich in den Stuhl und legte den Mantel ab.",
        "Der Meister war gerade nicht im Haus.",
        "Also musste der Junge die Arbeit übernehmen.",
        "Er band dem Fremden das Tuch um den Hals.",
        "Er rührte den Schaum an und strich ihn auf.",
        "Dann nahm er das Messer aus dem Kasten.",
      ],
    },
    {
      lines: [
        "In diesem Augenblick sprach der Fremde zum ersten Mal.",
        "Er sagte, er habe eine Gewohnheit, die man kennen müsse.",
        "Schneide ihn ein Barbier beim Rasieren, sagte er,",
        "Dann greife er nach dem Messer und tue dasselbe.",
        "Er sagte das ruhig, so wie man das Wetter nennt.",
        "Dann lehnte er sich zurück und schloss die Augen.",
        "Der Junge stand mit dem Messer in der Hand da.",
        "Er war allein im Laden, und der Meister kam nicht.",
        "Er hätte weglaufen können, und er lief nicht weg.",
        "Er dachte einen Augenblick nach, was zu tun sei.",
        "Dann setzte er das Messer an die Wange des Mannes.",
        "Und er begann zu rasieren, Zug um Zug.",
      ],
    },
    {
      lines: [
        "Seine Hand war ruhig, ruhiger als je zuvor.",
        "Er nahm sich mehr Zeit als sonst für jeden Zug.",
        "Er zog die Haut mit zwei Fingern glatt.",
        "Er hielt das Messer flach und drückte nicht.",
        "Um das Kinn herum ging er besonders langsam.",
        "Am Hals, wo es am schwierigsten ist, hielt er zweimal an.",
        "Dann setzte er neu an und führte den Zug zu Ende.",
        "Der Fremde sass still und sagte nichts mehr.",
        "Als der Junge fertig war, wischte er den Schaum ab.",
        "Er nahm das Tuch vom Hals und trat einen Schritt zurück.",
        "Nicht ein einziger Schnitt war zu sehen.",
        "Der Fremde stand auf und sah in den Spiegel.",
      ],
    },
    {
      lines: [
        "Er drehte den Kopf nach links und nach rechts.",
        "Dann fragte er den Jungen, ob er keine Angst gehabt habe.",
        "Der Junge sagte, er habe sehr wohl Angst gehabt.",
        "Er habe nur gewusst, dass Angst die Hand zittern lässt.",
        "Also habe er sich auf die Hand konzentriert.",
        "Der Fremde sah ihn eine Weile an und griff in die Tasche.",
        "Er legte ein Geldstück auf den Tisch, und es war viel.",
        "Er sagte, das sei nicht für die Rasur.",
        "Das sei dafür, dass der Junge geblieben sei.",
        "Dann nahm er seinen Mantel und ging hinaus zu seinem Pferd.",
        "Als der Meister zurückkam, erzählte ihm der Junge alles.",
        "Der Meister sagte, er hätte selbst das Messer fallen lassen.",
      ],
    },
  ],
};

/** Zehn deutsche Geschichten der Charge G2. */
export const SERIEN_DE_GESCHICHTEN: Serie[] = [
  KHALAI_SPRICHT_MIT_PFLANZEN,
  ZIEGE_HUND_UND_KUH,
  KINDER_AUS_WACHS,
  KANNITVERSTAN,
  DER_GEHEILTE_PATIENT,
  SELTSAMER_SPAZIERRITT,
  ZAMA_IST_TOLL,
  DAS_MITTAGESSEN_IM_HOF,
  DER_KLUGE_RICHTER,
  DER_BARBIERJUNGE,
];
