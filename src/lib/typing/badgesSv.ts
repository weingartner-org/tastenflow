/**
 * ★★★ DER ABZEICHEN-KATALOG SCHWEDISCH (O-INHALT-SV, 29.10.2026).
 *
 * Gegenstück zu `badgesCs.ts` - dieselbe Bauart, dieselben Schlüssel, NEU AUF
 * SCHWEDISCH GESCHRIEBEN, nicht übersetzt (Glossar Schwedisch §2.4, „märke"):
 * übertragen ist die IDEE des Namens. Wo das Schwedische eine eigene Wendung
 * zum Motiv hat, steht sie da („Mitt i prick" zur Zielscheibe, „Rent mjöl i
 * påsen" zur weissen Weste, „Is i magen", „Som ett urverk", „Som en klippa",
 * „Bokmal", „Den röda tråden", „Mitt hem är min borg", „Morgonstund har guld
 * i mund", „Full fart framåt!"); sonst ein Stabreim wie im Deutschen
 * („Pricksäker pingvin", „Lektionslejon", „Flink räv", „Busig bäver",
 * „Läslodjur", „Tangenttiger").
 *
 * ★★★ Kein Personenwort, das das Kind festlegt (Glossar Regel 3, §4 Falle 12):
 * nicht „mästare", „hjälte", „vinnare", „polarforskare" - der Name hängt an
 * einem Tier, einem Ding oder einer Wendung. Adjektive nur an einem Tier oder
 * Ding, nie die männliche e-Form. Keine Superlative mit Vergleich.
 * Die Beschreibungen sind Sätze über die Sache - Zahl + Hauptwort („5
 * avslutade lektioner"), Partizip am Ding („Upplåsta: ä, ö och ü") - nie ein
 * Urteil über das Kind.
 *
 * ★ Mehrzahl (Glossar §2.11): one · other. Die festen Zahlen stehen mit der
 * Form, die zu IHR gehört („1 000 rätta anslag"). Wo eine Zahl von aussen
 * kommt (`z.fische` usw.), wählt {@link sv} die Form über
 * `Intl.PluralRules("sv-SE")`. Zahlen ab 1 000 mit geschütztem Leerzeichen
 * (U+00A0, Glossar Regel 6, wie `toLocaleString("sv-SE")`), Prozent „95 %"
 * mit geschütztem Leerzeichen, Dezimalkomma („0,5 %").
 *
 * ★ „rad" ist die Übungszeile UND die Tastenreihe (Glossar §4 Falle 2) -
 * darum „i följd", nie „i rad"; Tastenreihen nur mit Namen („grundraden",
 * „sifferraden"). Keine Ordnungszahl mit Doppelpunkt („2:a", Falle 4);
 * Uhrzeiten in Worten („klockan nio på kvällen").
 *
 * Grossschreibung wie im Schwedischen: nur das erste Wort und Eigennamen
 * („Ekogrottan", „Snöstormen", „Polarstationen", „Polarexpeditionen",
 * „Isflaken"). Die trockenen Zweitnamen (`nameNeutral`, ab 11 Jahren) genau
 * dort, wo das Deutsche (und `badgesCs.ts`) einen hat. Glossar: märke,
 * omgång, anslag, träffsäkerhet, fel, grundställning, grundraden, sifferraden,
 * del (Etappe), poängring, svårighetsnivå, startpunkt, berättelse, säker /
 * osäker (an der Taste, nie am Kind), Isflaken, Polarexpeditionen.
 *
 * ⚠️ Wer ein Abzeichen anlegt, trägt es HIER mit ein - jede ID braucht einen
 * schwedischen Eintrag und einen Zweitnamen genau dort, wo es ihn im
 * Deutschen gibt. Verteiler: `badges.ts` (`ABZEICHEN_JE_SPRACHE`); ein
 * fehlender Schlüssel bliebe ENGLISCH (`eintraegeOderEn`).
 */
import { lernwegDef } from "./lernweg";
import { lektionenFuer } from "./curriculum";
import type { AbzeichenTextEn, AbzeichenZahlen } from "./badgesEn";

/** Dieselbe Form wie der englische Eintrag. */
export type AbzeichenTextSv = AbzeichenTextEn;

/** Die Mehrzahl-Regel des Schwedischen (CLDR): one · other (Glossar §2.11). */
const PLURAL_SV = new Intl.PluralRules("sv-SE");

/** Zahl mit der passenden Form: `sv(5, "dag", "dagar")` ⇒ „5 dagar"; Zahlen ab 1 000 mit U+00A0. */
function sv(n: number, one: string, other: string): string {
  return `${n.toLocaleString("sv-SE")} ${PLURAL_SV.select(n) === "one" ? one : other}`;
}

/** Die Zeichen von „alltags-ass", die es auf dem Weg des Kindes wirklich gibt (wie `badgesCs.ts`) - „a, b och c". */
function alltagsZeichen(z: AbzeichenZahlen): string {
  const reihe = new Set(lernwegDef(z.lernweg).introOrder);
  const da = ["@", "€", "$", "§"].filter((c) => reihe.has(c));
  if (da.length <= 1) return da.join("");
  return `${da.slice(0, -1).join(", ")} och ${da[da.length - 1]}`;
}

/** Die Familien (Überschriften im Regal) - Schlüssel ist der deutsche `group`-Name (Glossar §2.4). */
export const ABZEICHEN_GRUPPEN_SV: Readonly<Record<string, string>> = {
  Fehlerfrei: "Utan fel",
  "Saubere Serie": "Rena omgångar",
  Fleiß: "Flit",
  Anschläge: "Anslag",
  Dranbleiben: "Uthållighet",
  Übungswochen: "Övningsveckor",
  Sterne: "Stjärnor",
  Lektionen: "Lektioner",
  Stufen: "Nivåer",
  Tastenwelt: "Tangentvärlden",
  "Sitzt!": "Kan det!",
  Tempo: "Hastighet",
  "Am Stück": "I ett svep",
  Meisterprüfung: "Mästarnivå",
  Abenteuer: "Äventyr",
  "Abenteuer-Kunststücke": "Äventyrskonster",
  Expedition: "Expedition",
  Geschichten: "Berättelser",
  Lesestunde: "Lässtund",
  "Lese-Kunststücke": "Läskonster",
  Geheim: "Hemliga",
};

/** Der ganze Katalog schwedisch, je Abzeichen-ID. */
export const ABZEICHEN_SV: Readonly<Record<string, AbzeichenTextSv>> = {
  // ── Utan fel ─────────────────────────────────────────────────────────────
  volltreffer: { name: "Mitt i prick", description: "En hel omgång utan ett enda fel.", bildbeschreibung: "en måltavla med en pil mitt i prick" },
  "null-fehler-ninja": { name: "Felfri ninja", description: "5 omgångar utan ett enda fel.", bildbeschreibung: "en ninja" },
  "makellos-meister": { name: "Skinande stjärnor", description: "15 omgångar utan ett enda fel.", bildbeschreibung: "tre glittrande stjärnor" },
  "diamant-finger": { name: "Diamantfingrar", description: "40 omgångar utan ett enda fel.", bildbeschreibung: "en blå ädelsten" },
  // „ha rent mjöl i påsen" = eine weisse Weste haben.
  "weisse-weste": { name: "Rent mjöl i påsen", description: "80 omgångar utan ett enda fel.", bildbeschreibung: "en vit duva" },
  "einhorn-finger": { name: "Enhörningsfingrar", nameNeutral: "150 omgångar utan fel", description: "150 omgångar utan ett enda fel.", bildbeschreibung: "en enhörning" },
  // ── Rena omgångar ────────────────────────────────────────────────────────
  // „i följd", nie „i rad" (Glossar §4 Falle 2).
  "praezisions-pinguin": { name: "Pricksäker pingvin", nameNeutral: "Tre rena i följd", description: "3 rena omgångar i följd (träffsäkerhet minst 95 %).", bildbeschreibung: "en pingvin" },
  adlerauge: { name: "Örnöga", description: "7 rena omgångar i följd (träffsäkerhet minst 95 %).", bildbeschreibung: "en örn" },
  "laser-lama": { name: "Laserlama", nameNeutral: "Laserläge", description: "15 rena omgångar i följd (träffsäkerhet minst 95 %).", bildbeschreibung: "en lama" },
  // „ha is i magen" = kühlen Kopf bewahren.
  "eiskalte-serie": { name: "Is i magen", description: "25 rena omgångar i följd (träffsäkerhet minst 95 %).", bildbeschreibung: "en isbit" },
  // ── Flit ─────────────────────────────────────────────────────────────────
  "tasten-kueken": { name: "Tangentkyckling", nameNeutral: "Första omgången", description: "Den första avslutade omgången.", bildbeschreibung: "en kyckling som kläcks ur ett ägg" },
  "ausdauer-ameise": { name: "Arbetsam myra", nameNeutral: "Uppvärmd", description: "25 övningsomgångar.", bildbeschreibung: "en myra" },
  "marathon-maus": { name: "Maratonmus", nameNeutral: "Hundra omgångar", description: "100 övningsomgångar.", bildbeschreibung: "ett mushuvud" },
  "munteres-murmeltier": { name: "Busig bäver", nameNeutral: "Maraton", description: "250 övningsomgångar.", bildbeschreibung: "en bäver" },
  dauerlaeufer: { name: "Långa loppet", description: "500 övningsomgångar.", bildbeschreibung: "en person som springer" },
  // Wie „Tusen och en natt".
  tausendsassa: { name: "Tusen och en omgång", nameNeutral: "Tusen omgångar", description: "1 000 övningsomgångar.", bildbeschreibung: "en val som sprutar vatten" },
  // ── Anslag ───────────────────────────────────────────────────────────────
  "tausend-tasten-tiger": { name: "Tangenttiger", nameNeutral: "Tusen rätta anslag", description: "1 000 rätta anslag.", bildbeschreibung: "ett tigerhuvud" },
  "tasten-t-rex": { name: "Tangent-T-rex", nameNeutral: "Tiotusen rätta anslag", description: "10 000 rätta anslag.", bildbeschreibung: "en tyrannosaurus" },
  "galaktische-fingerspitzen": { name: "Galaktiska fingertoppar", description: "50 000 rätta anslag.", bildbeschreibung: "en raket som lyfter" },
  "hunderttausend-held": { name: "Hundratusen blixtar", nameNeutral: "Hundratusen rätta anslag", description: "100 000 rätta anslag.", bildbeschreibung: "en gul blixt" },
  viertelmillion: { name: "En kvarts miljon", description: "250 000 rätta anslag - så många bokstäver har en hel bok.", bildbeschreibung: "en satellit" },
  // ── Uthållighet ──────────────────────────────────────────────────────────
  "dranbleib-dachs": { name: "Envis grävling", nameNeutral: "Uthållighet", description: "3 olika övningsdagar.", bildbeschreibung: "en grävling" },
  gewohnheitstier: { name: "Trogen sköldpadda", description: "7 olika övningsdagar.", bildbeschreibung: "en sköldpadda" },
  // „Det går som ett urverk."
  "wie-ein-uhrwerk": { name: "Som ett urverk", description: "20 olika övningsdagar.", bildbeschreibung: "en röd väckarklocka" },
  unaufhaltsam: { name: "Hela vägen upp", description: "50 olika övningsdagar.", bildbeschreibung: "ett berg med snöklädd topp" },
  "tief-verwurzelt": { name: "Djupa rötter", description: "100 olika övningsdagar.", bildbeschreibung: "ett stort grönt lövträd" },
  // „stå som en klippa" - die Wendung, kein Adjektiv am Kind.
  "fels-in-der-brandung": { name: "Som en klippa", description: "200 olika övningsdagar - nästan varje dag under ett helt läsår.", bildbeschreibung: "en stenstaty från Påskön" },
  // ── Övningsveckor ────────────────────────────────────────────────────────
  "vierteljahr-dabei": { name: "Redan ett kvarts år", description: "12 olika övningsveckor.", bildbeschreibung: "ett brunt höstlöv" },
  "halbes-jahr-dabei": { name: "Redan ett halvår", description: "26 olika övningsveckor.", bildbeschreibung: "ett moln som det snöar ur" },
  "ganzes-jahr-dabei": { name: "Ett helt år", description: "52 olika övningsveckor.", bildbeschreibung: "en födelsedagstårta med ett ljus" },
  // ── Stjärnor ─────────────────────────────────────────────────────────────
  sternschnuppe: { name: "Stjärnfall", description: "Den första omgången med 3 stjärnor.", bildbeschreibung: "ett stjärnfall på natthimlen" },
  "sternen-sammler": { name: "En näve stjärnor", description: "10 omgångar med 3 stjärnor.", bildbeschreibung: "en lysande gul stjärna" },
  sternenhimmel: { name: "Stjärnhimmel", description: "30 omgångar med 3 stjärnor.", bildbeschreibung: "Vintergatan på natthimlen" },
  sternenmeer: { name: "Ett hav av stjärnor", description: "75 omgångar med 3 stjärnor.", bildbeschreibung: "en orange åttauddig stjärna" },
  // ── Lektioner ────────────────────────────────────────────────────────────
  "lektions-loewe": { name: "Lektionslejon", nameNeutral: "Fem lektioner", description: "5 avslutade lektioner.", bildbeschreibung: "ett lejon" },
  "kapitel-kaeptn": { name: "Full fart framåt!", description: "15 avslutade lektioner.", bildbeschreibung: "ett ankare" },
  // Die Lektionszahl DES WEGES in Klammern.
  "lehrgangs-legende": { name: "Kursens legend", description: (z) => `Alla lektioner i kursen avslutade (sammanlagt ${lektionenFuer(z.lernweg).length}).`, bildbeschreibung: "en guldpokal" },
  // ── Nivåer (poängring) ───────────────────────────────────────────────────
  "kletter-koala": { name: "Klättrande koala", nameNeutral: "Nivå 5", description: "Nivå 5 i poängringen nådd.", bildbeschreibung: "en koala" },
  "punkte-rakete": { name: "Poängraket", description: "Nivå 10 i poängringen nådd.", bildbeschreibung: "en röd ballong" },
  "gipfel-gaemse": { name: "Gems på toppen", nameNeutral: "Nivå 20", description: "Nivå 20 i poängringen nådd.", bildbeschreibung: "en get" },
  hoehenflug: { name: "Högt flyg", nameNeutral: "Nivå 50", description: "Nivå 50 i poängringen nådd.", bildbeschreibung: "en helikopter" },
  "ueber-den-wolken": { name: "Ovanför molnen", nameNeutral: "Nivå 100", description: "Nivå 100 i poängringen nådd.", bildbeschreibung: "ett flygande tefat" },
  sternenreise: { name: "Resan till stjärnorna", nameNeutral: "Nivå 200", description: "Nivå 200 i poängringen nådd.", bildbeschreibung: "en komet med lång svans" },
  // ── Tangentvärlden ───────────────────────────────────────────────────────
  // Die Grundreihe DES WEGES - auf Weg „sv": a s d f j k l ö.
  "grundstellungs-gorilla": {
    name: "Grundradsgorilla",
    nameNeutral: "Grundraden klar",
    description: (z) =>
      `Alla åtta tangenterna i grundställningen upplåsta: ${lernwegDef(z.lernweg)
        .letterOrder.slice(0, lernwegDef(z.lernweg).homeRowLetters)
        .join(" ")}.`,
    bildbeschreibung: "en gorilla",
  },
  "gross-baumeister": { name: "Bygge med stora bokstäver", nameNeutral: "Stora bokstäver", description: "Skift klarad - riktiga stora bokstäver med egen hand.", bildbeschreibung: "fyra stora bokstäver på blå tangenter" },
  // ⚠️ „puenktchen-panda" und „schlangen-s" gibt es auf Weg „sv" nicht zu
  // verdienen - der Eintrag steht trotzdem da, weil das Regal jedes beschreibt.
  // Für ein schwedisches Kind sind ä und ö eigene Buchstaben (Falle 1) - darum „på det tyska tangentbordet".
  "puenktchen-panda": { name: "Prickig panda", nameNeutral: "Tyska bokstäver med prickar", description: "Upplåsta: ä, ö och ü - bokstäverna med prickar på det tyska tangentbordet.", bildbeschreibung: "en panda" },
  "schlangen-s": { name: "Orm-S", nameNeutral: "Tyskt skarpt s", description: "Upplåst: ß, tyskt skarpt s - den sista bokstaven på det tyska tangentbordet.", bildbeschreibung: "en orm" },
  "alphabet-as": { name: "Hela alfabetet", description: "Alla bokstäver från A till Z upplåsta.", bildbeschreibung: "små bokstäver på blå tangenter" },
  "punkt-und-komma": { name: "Punkt och komma", description: "Punkt och komma upplåsta - de första riktiga skiljetecknen.", bildbeschreibung: "en svart reservoarpenna" },
  "satzzeichen-sammler": { name: "Samling skiljetecken", nameNeutral: "Alla skiljetecken", description: "Upplåsta skiljetecken: . , - ? ! : ;", bildbeschreibung: "ett stort rött utropstecken" },
  "zahlen-zebra": { name: "Sifferzebra", nameNeutral: "Halva sifferraden", description: "Fem siffror på sifferraden upplåsta.", bildbeschreibung: "en zebra" },
  "zahlen-zauberer": { name: "Siffertrolleri", nameNeutral: "Hela sifferraden", description: "Alla siffror från 1 till 0 upplåsta - hela sifferraden.", bildbeschreibung: "en blå tangent med talet tio" },
  "klammer-krokodil": { name: "Krokodil inom parentes", nameNeutral: "Vänster och höger parentes", description: "Parenteserna ( ) upplåsta - de första symbolerna.", bildbeschreibung: "en krokodil" },
  "alltags-ass": { name: "Vardagstecken", nameNeutral: "Tecken för varje dag", description: (z) => `Upplåst: ${alltagsZeichen(z)} - tecken från e-post och pengarnas värld.`, bildbeschreibung: "ett kuvert" },
  "tastatur-krone": { name: "Tangentbordets krona", nameNeutral: "Hela tangentbordet", description: "Alla tangenter på tangentbordet upplåsta - ända till den sista symbolen.", bildbeschreibung: "en guldkrona" },
  // ── Kan det! (säker = an der Taste, nie am Kind) ─────────────────────────
  // „Mitt hem är min borg."
  "feste-burg": { name: "Mitt hem är min borg", nameNeutral: "Grundraden sitter", description: "Alla tangenter i grundställningen är säkra.", bildbeschreibung: "ett hus" },
  "buchstaben-baendiger": { name: "Tämjda bokstäver", nameNeutral: "Alla bokstäver sitter", description: "Varje bokstav är säker - ingen är osäker längre.", bildbeschreibung: "en röd fyrkant med ett stort A" },
  "zahlen-fels": { name: "Stadiga siffror", nameNeutral: "Alla siffror sitter", description: "Hela sifferraden är säker.", bildbeschreibung: "en kulram med färgglada kulor" },
  "nichts-wackelt": { name: "Ingenting vinglar", description: "Varje tangent på tangentbordet är säker - hela tangentbordet, inte bara de upplåsta.", bildbeschreibung: "en blå romb med en prick i mitten" },
  // ── Hastighet ────────────────────────────────────────────────────────────
  "flinker-fuchs": { name: "Flink räv", nameNeutral: "Snabbt och träffsäkert", description: "Den önskade hastigheten och samtidigt minst 95 % träffsäkerhet - hastigheten räknas bara när skrivandet är träffsäkert.", bildbeschreibung: "en räv" },
  "tempo-60": { name: "Hoppande hare", nameNeutral: "60 i minuten, träffsäkert", description: "En omgång med 60 anslag per minut och minst 95 % träffsäkerhet.", bildbeschreibung: "en hare" },
  "tempo-90": { name: "Raskt rådjur", nameNeutral: "90 i minuten, träffsäkert", description: "En omgång med 90 anslag per minut och minst 95 % träffsäkerhet.", bildbeschreibung: "ett rådjur" },
  "tempo-120": { name: "Häst i galopp", nameNeutral: "120 i minuten, träffsäkert", description: "En omgång med 120 anslag per minut och minst 98 % träffsäkerhet.", bildbeschreibung: "en galopperande häst" },
  "tempo-160": { name: "Ånglok", nameNeutral: "160 i minuten, träffsäkert", description: "En omgång med 160 anslag per minut och minst 98 % träffsäkerhet.", bildbeschreibung: "ett ånglok" },
  "tempo-200": { name: "Snabbtåg", nameNeutral: "200 i minuten, träffsäkert", description: "En omgång med 200 anslag per minut och minst 98 % träffsäkerhet.", bildbeschreibung: "ett snabbtåg" },
  "tempo-300": { name: "Jetplan", nameNeutral: "300 i minuten, träffsäkert", description: "En omgång med 300 anslag per minut och minst 99 % träffsäkerhet - yrkesnivå.", bildbeschreibung: "ett litet flygplan" },
  // ── I ett svep ───────────────────────────────────────────────────────────
  "kette-100": { name: "Kedjereaktion", nameNeutral: "100 i följd", description: "100 rätta anslag i följd, utan ett enda fel.", bildbeschreibung: "två kedjelänkar" },
  "kette-250": { name: "Utan att snubbla", description: "250 rätta anslag i följd.", bildbeschreibung: "en kedja med flera länkar" },
  // „den röda tråden" - auch im Schwedischen.
  "kette-500": { name: "Den röda tråden", nameNeutral: "500 i följd", description: "500 rätta anslag i följd - mer än en hel omgång.", bildbeschreibung: "en trådrulle" },
  "kette-1000": { name: "Tusen utan fel", description: "1 000 rätta anslag i följd.", bildbeschreibung: "berget Fuji med snöklädd topp" },
  "kette-2000": { name: "Järnkedjan", nameNeutral: "2 000 i följd", description: "2 000 rätta anslag i följd - fyra till fem omgångar utan minsta tvekan.", bildbeschreibung: "en vulkan som det rinner lava ur" },
  // ── Äventyr (spelet „Isflaken", Glossar §2.3) ────────────────────────────
  // „äventyr" ist in beiden Formen gleich.
  "erste-expedition": { name: "Första färden", description: "Det första äventyret på Isflaken i fritt spel - ända fram till igloon.", bildbeschreibung: "en kompass" },
  // Nicht „Polarforskare" (Personenwort).
  polarforscher: { name: "Polarupptäckter", description: "10 avslutade äventyr på Isflaken i fritt spel.", bildbeschreibung: "en snöflinga" },
  "eismeer-legende": { name: "Ishavets legend", description: "30 avslutade äventyr på Isflaken i fritt spel.", bildbeschreibung: "en hög blå våg" },
  "packeis-profi": { name: "Packisen klarad", nameNeutral: "60 äventyr", description: "60 avslutade äventyr på Isflaken i fritt spel.", bildbeschreibung: "en resväska" },
  // ── Äventyrskonster ──────────────────────────────────────────────────────
  // „Trockener Frack": der Frack ist der Pinguin selbst.
  "trockener-frack": { name: "Torr frack", description: "Ett helt äventyr utan att plumsa i vattnet eller i snön en enda gång.", bildbeschreibung: "en svart hög hatt" },
  "immer-trocken": { name: "Torrskodd hela vägen", description: (z) => `${sv(z.trockeneAbenteuer, "äventyr", "äventyr")} utan att plumsa i vattnet en enda gång.`, bildbeschreibung: "ett hopfällt paraply" },
  fischfaenger: { name: "Fin fångst", description: (z) => `Fångat på Isflaken: ${sv(z.fische, "bonusfisk", "bonusfiskar")}.`, bildbeschreibung: "en blå fisk" },
  // ── Expedition ───────────────────────────────────────────────────────────
  // Die Zonennamen wie im Spiel (Glossar §2.3): Ekogrottan, Snöstormen, Polarstationen.
  "hoehlen-lauscher": { name: "Fladdermusöron", description: "Hela Ekogrottan ända till utgången - i mörkret, bara med hörseln.", bildbeschreibung: "en fladdermus" },
  "sturm-trotzer": { name: "Snöstormen besegrad", description: "Snöstormen klarad - teckenföljder skrivna ur minnet.", bildbeschreibung: "ett ansikte som blåser vind" },
  "funker-freund": { name: "Vänner via radion", description: "Hela radiomeddelandet tolkat och skickat till Polarstationen.", bildbeschreibung: "en radio" },
  "polarlicht-entdecker": { name: "Under norrskenet", description: "Hela Polarexpeditionen utan ett enda fel - norrskenet dansar.", bildbeschreibung: "en stjärna med en svans av gnistor" },
  // ── Berättelser ──────────────────────────────────────────────────────────
  "lese-luchs": { name: "Läslodjur", nameNeutral: "Första berättelsen", description: "Den första berättelsen läst och skriven ända till slutet.", bildbeschreibung: "en leopard" },
  buecherwurm: { name: "Bokmal", description: "3 berättelser lästa ända till slutet.", bildbeschreibung: "en grön larv" },
  "buecherei-baer": { name: "Biblioteksbjörn", nameNeutral: "Åtta berättelser", description: "8 berättelser lästa ända till slutet.", bildbeschreibung: "en björn" },
  vielleser: { name: "Ett berg av böcker", description: "15 berättelser lästa ända till slutet.", bildbeschreibung: "en hög färgglada böcker" },
  // ── Lässtund (del = Etappe einer Geschichte) ─────────────────────────────
  "seiten-spatz": { name: "Sidsparv", nameNeutral: "Första sidan", description: "Den första delen av en berättelse skriven.", bildbeschreibung: "en liten blå fågel" },
  "kapitel-krake": { name: "Läsande bläckfisk", nameNeutral: "Tio delar", description: "10 delar lästa och skrivna.", bildbeschreibung: "en bläckfisk" },
  "geschichten-gigant": { name: "Berättelser i elefantportion", description: "30 delar lästa och skrivna.", bildbeschreibung: "en elefant" },
  leseratte: { name: "Läsning utan slut", nameNeutral: "75 delar", description: "75 delar lästa och skrivna.", bildbeschreibung: "en pergamentrulle" },
  // ── Läskonster ───────────────────────────────────────────────────────────
  federleicht: { name: "Lätt som en fjäder", description: "En del av en berättelse skriven från början till slut utan ett enda fel.", bildbeschreibung: "en vit fjäder" },
  // Nicht „I ett svep" - so heisst schon die Familie „Am Stück".
  "in-einem-rutsch": { name: "I ett andetag", description: "En hel berättelse läst till slutet under en enda dag.", bildbeschreibung: "en blå spiral" },
  "lesezeichen-held": { name: "Bokmärket på sin plats", description: "Läsning en annan dag precis där den slutade förra gången.", bildbeschreibung: "ett bokmärke" },
  // ── Mästarnivå (Glossar §2.4: nie „prov") ────────────────────────────────
  "zehn-minuten-abschrift": { name: "Tio minuters avskrift", description: "Tio minuters avskrift av en text utan paus och högst 0,5 % fel - som i en riktig tävling.", bildbeschreibung: "ett stoppur" },
  "lehrgangs-meister": { name: "Kursen klarad", description: (z) => `Alla lektioner i kursen avslutade, var och en med tre stjärnor (sammanlagt ${lektionenFuer(z.lernweg).length}).`, bildbeschreibung: "en svart studentmössa" },
  "goldene-tastatur": { name: "Det gyllene tangentbordet", description: "Alla tangenter upplåsta och säkra - och dessutom en gång 160 anslag per minut med 98 % träffsäkerhet. Det sista märket.", bildbeschreibung: "en idrottsmedalj med band" },
  // ── Hemliga ──────────────────────────────────────────────────────────────
  "gemuetliches-faultier": { name: "Lugn sengångare", description: "Lugnt och sakta, men utan ett enda fel - träffsäkerhet går före hastighet!", bildbeschreibung: "en sengångare" },
  "comeback-kaenguru": { name: "Kängurusprång", description: "En omgång med 3 stjärnor direkt efter en omgång med 1 stjärna.", bildbeschreibung: "en känguru" },
  // Uhrzeiten in Worten.
  nachteule: { name: "Nattuggla", description: "En omgång avslutad efter klockan nio på kvällen.", bildbeschreibung: "en uggla" },
  // „Morgonstund har guld i mund."
  "frueher-vogel": { name: "Morgonstund har guld i mund", description: "En omgång avslutad före klockan sju på morgonen.", bildbeschreibung: "en tupp" },
  nimmersatt: { name: "Läshunger", description: "3 delar av en berättelse slukade under en enda dag.", bildbeschreibung: "ett grönt äpple" },
  "ferien-held": { name: "Sommarlov vid tangentbordet", description: "Övning under sommarlovet - i juli eller augusti.", bildbeschreibung: "en strand med ett parasoll" },
  "wochenend-schreiber": { name: "Helgskrivande", description: "Övning både på lördag och på söndag.", bildbeschreibung: "ett kalenderblad" },
  "zurueck-im-sattel": { name: "Tillbaka i sadeln", description: (z) => `Tillbaka till övningen efter en paus på mer än ${sv(z.pauseTage, "dag", "dagar")} - också att komma tillbaka räknas.`, bildbeschreibung: "två pilar i en cirkel" },
  "doppelt-genaeht": { name: "Dubbelt upp", description: "Två omgångar utan fel direkt efter varandra.", bildbeschreibung: "en nål med tråd" },
  winterkind: { name: "Vintertangenter", description: "Övning mitt i vintern - i december eller januari.", bildbeschreibung: "en snögubbe" },
  jahreswechsel: { name: "Nyår vid tangentbordet", description: "Övning på årets sista dag eller på det nya årets första dag.", bildbeschreibung: "fyrverkerier på natthimlen" },
  "tages-marathon": { name: "En dags maraton", description: "Tio omgångar under en enda dag.", bildbeschreibung: "en person på en kapplöpningshäst" },
  sternentag: { name: "Stjärnornas dag", description: "Tre omgångar med tre stjärnor under en enda dag.", bildbeschreibung: "en sol med ansikte" },
  blitzsauber: { name: "Skinande rent", description: "Tre omgångar utan fel under en enda dag.", bildbeschreibung: "en tvål med lödder" },
  "volle-woche": { name: "Full vecka", description: "Fem olika övningsdagar under en och samma vecka.", bildbeschreibung: "en grön bok" },
  // „Blindflug" ⇒ „Utan att titta": zum Äffchen, das sich die Augen zuhält.
  // Glossar Regel 4/5: nie „blint", nie „skriva blint".
  blindflug: { name: "Utan att titta", description: "En hel omgång utan fel - med skärmtangentbordet dolt. Det är just det som är att skriva med alla tio fingrar.", bildbeschreibung: "en apa som håller för ögonen" },
  sprachwechsler: { name: "Resan mellan språken", description: "Övning på två språk - till exempel på svenska och på engelska.", bildbeschreibung: "en jordglob med Europa och Afrika" },
  lesenacht: { name: "Läsning i natten", description: "En del av en berättelse läst efter klockan åtta på kvällen.", bildbeschreibung: "en måne med ansikte" },
  "zaehe-taste": { name: "Envis tangent", description: "En tangent som länge var svår är nu säker.", bildbeschreibung: "en snigel" },
  aufsteiger: { name: "Uppför backen", description: "Fem svårighetsnivåer högre än startpunkten.", bildbeschreibung: "ett diagram med en kurva som stiger" },
  // ── Nur auf Weg „fr" (`badgesNurFr.ts`) - für eine schwedische Bedienung auf
  // diesem Weg; dieselben Gedanken wie dort.
  "akzente-ziffernreihe": { name: "Akrobatiska accenter", nameNeutral: "é, è, ç och à", description: "Upplåsta: é, è, ç och à - bokstäverna som bor på sifferraden på det franska tangentbordet.", bildbeschreibung: "siffrorna 1 2 3 4 på en blå tangent" },
  "accent-circonflexe": { name: "Cirkumflex", nameNeutral: "Fransk cirkumflex", description: "Den döda tangenten ^ är säker: ê, â, î, ô och û.", bildbeschreibung: "en stråhatt med band" },
  trema: { name: "Nyckelpiga med två prickar", nameNeutral: "Trema", description: "Den döda tangenten ¨ är säker: ë, ï och ü.", bildbeschreibung: "en nyckelpiga" },
};
