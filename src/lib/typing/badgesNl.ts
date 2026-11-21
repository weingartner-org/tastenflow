/**
 * ★★★ DER ABZEICHEN-KATALOG NIEDERLÄNDISCH (O-NL, 29.10.2026).
 *
 * Gegenstück zu `badgesCs.ts` - dieselbe Bauart, dieselben Schlüssel, NEU AUF NIEDERLÄNDISCH GESCHRIEBEN, nicht übersetzt
 * (Glossar `recherche-niederländisch-2026-10-25/GLOSSAR-nl.md` §2.4): übertragen ist die IDEE des Namens. Wo das
 * Niederländische eine eigene Wendung zum Motiv hat, die in NL UND Flandern lebt, steht sie da („In de roos" zur
 * Zielscheibe, „Arendsoog", „Als een klok", „Rots in de branding", „Zo vast als een huis", „De rode draad", „De vroege
 * vogel", „Spic en span", „Oud en nieuw", „Boekenwurm", „Lange adem"); sonst ein Stabreim wie im Deutschen („Precieze
 * pinguïn", „Bezige bever", „Doorzettende das", „Vlugge vos", „Huppelende haas").
 *
 * ★★★ Glossar Regel 2: KEINE Personenwörter für das Kind (kein „kampioen", „meester", „held", „lezer"), Adjektive nur
 * an einem Tier oder Ding. Die Beschreibungen sind Sätze über die Sache - Partizip am Ding („5 lessen afgerond"),
 * Zahl + Hauptwort („100 rondes geoefend") - nie „jij hebt …".
 *
 * ★ Mehrzahl (Glossar §2.11): `Intl.PluralRules("nl-NL")` kennt one · other. Die festen Zahlen stehen mit ihrer Form;
 * wo eine Zahl von aussen kommt (`z.fische` usw.), wählt {@link nl} die Form. Zahlen ab 1.000 mit Tausenderpunkt wie
 * `Intl` (Glossar Regel 5), Prozent ohne Leerzeichen („95%"), Dezimalkomma („0,5%").
 *
 * ★ Keine Zahl mit Punkt am Satzende: Uhrzeiten in Worten („na negen uur 's avonds"), Summen in Klammern
 * („(in totaal 42)"). „rij" ist die Tastenreihe - darum „na elkaar", nie „op rij" (Glossar §2.2). Medaille, nie „badge".
 * „Blind" nie (Regel 4): „Niet spieken" zum Affen, der sich die Augen zuhält.
 *
 * Grossschreibung wie im Niederländischen: nur das erste Wort und Eigennamen („IJsschotsenspel", „Poolexpeditie"),
 * IJ am Wortanfang beide gross. Die trockenen Zweitnamen (`nameNeutral`, ab 11 Jahren) genau dort, wo das Englische
 * (und damit das Deutsche) einen hat.
 *
 * ⚠️ Wer ein Abzeichen anlegt, trägt es HIER mit ein - Wächter `tests/tastenflow-abzeichen-nl.test.ts`.
 */
import { lernwegDef } from "./lernweg";
import { lektionenFuer } from "./curriculum";
import type { AbzeichenTextEn, AbzeichenZahlen } from "./badgesEn";

/** Dieselbe Form wie der englische Eintrag. */
export type AbzeichenTextNl = AbzeichenTextEn;

/** Die Mehrzahl-Regel des Niederländischen (CLDR): one · other (Glossar §2.11). */
const PLURAL_NL = new Intl.PluralRules("nl-NL");

/** Zahl mit der passenden Form: `nl(14, "dag", "dagen")` ⇒ „14 dagen". */
function nl(n: number, one: string, other: string): string {
  return `${n.toLocaleString("nl-NL")} ${PLURAL_NL.select(n) === "one" ? one : other}`;
}

/** Die Zeichen von „alltags-ass", die es auf dem Weg des Kindes wirklich gibt (wie `badgesCs.ts`). */
function alltagsZeichen(z: AbzeichenZahlen): string {
  const reihe = new Set(lernwegDef(z.lernweg).introOrder);
  const da = ["@", "€", "$", "§"].filter((c) => reihe.has(c));
  if (da.length <= 1) return da.join("");
  return `${da.slice(0, -1).join(", ")} en ${da[da.length - 1]}`;
}

/** Die Familien (Überschriften im Regal) - Schlüssel ist der deutsche `group`-Name (Glossar §2.4). */
export const ABZEICHEN_GRUPPEN_NL: Readonly<Record<string, string>> = {
  Fehlerfrei: "Foutloos",
  "Saubere Serie": "Foutloze rondes",
  Fleiß: "Inzet",
  Anschläge: "Aanslagen",
  Dranbleiben: "Volhouden",
  Übungswochen: "Oefenweken",
  Sterne: "Sterren",
  Lektionen: "Lessen",
  Stufen: "Niveaus",
  Tastenwelt: "Toetsenwereld",
  "Sitzt!": "Zit erin!",
  Tempo: "Snelheid",
  "Am Stück": "In één ruk",
  Meisterprüfung: "Meesterproef",
  Abenteuer: "Avonturen",
  "Abenteuer-Kunststücke": "Avonturenkunstjes",
  Expedition: "Expeditie",
  Geschichten: "Verhalen",
  Lesestunde: "Leesuurtje",
  "Lese-Kunststücke": "Leeskunstjes",
  Geheim: "Geheim",
};

/** Der ganze Katalog niederländisch, je Abzeichen-ID. */
export const ABZEICHEN_NL: Readonly<Record<string, AbzeichenTextNl>> = {
  // ── Foutloos ─────────────────────────────────────────────────────────────
  // „In de roos" = mitten ins Ziel getroffen.
  volltreffer: { name: "In de roos", description: "Een hele ronde zonder een enkele fout.", bildbeschreibung: "een schietschijf met een pijl precies in het midden" },
  "null-fehler-ninja": { name: "Ninja zonder fouten", description: "5 rondes zonder een enkele fout.", bildbeschreibung: "een ninja" },
  "makellos-meister": { name: "Smetteloze sterren", description: "15 rondes zonder een enkele fout.", bildbeschreibung: "drie fonkelende sterren" },
  "diamant-finger": { name: "Diamanten vingers", description: "40 rondes zonder een enkele fout.", bildbeschreibung: "een blauwe edelsteen" },
  // „Weisse Weste" ⇒ „Brandschoon" (durch und durch sauber).
  "weisse-weste": { name: "Brandschoon", description: "80 rondes zonder een enkele fout.", bildbeschreibung: "een witte duif" },
  "einhorn-finger": { name: "Eenhoornvingers", nameNeutral: "150 rondes zonder fouten", description: "150 rondes zonder een enkele fout.", bildbeschreibung: "een eenhoorn" },
  // ── Foutloze rondes (nette rondes: nauwkeurigheid minstens 95%) ─────────
  "praezisions-pinguin": { name: "Precieze pinguïn", nameNeutral: "Drie keer netjes", description: "3 nette rondes na elkaar (nauwkeurigheid minstens 95%).", bildbeschreibung: "een pinguïn" },
  adlerauge: { name: "Arendsoog", description: "7 nette rondes na elkaar (nauwkeurigheid minstens 95%).", bildbeschreibung: "een arend" },
  "laser-lama": { name: "Laserlama", nameNeutral: "Lasermodus", description: "15 nette rondes na elkaar (nauwkeurigheid minstens 95%).", bildbeschreibung: "een lama" },
  "eiskalte-serie": { name: "IJskoude reeks", description: "25 nette rondes na elkaar (nauwkeurigheid minstens 95%).", bildbeschreibung: "een ijsblokje" },
  // ── Inzet ────────────────────────────────────────────────────────────────
  "tasten-kueken": { name: "Toetsenkuiken", nameNeutral: "Eerste ronde", description: "De allereerste ronde is klaar.", bildbeschreibung: "een kuiken dat uit een ei komt" },
  "ausdauer-ameise": { name: "IJverige mier", nameNeutral: "Opgewarmd", description: "25 rondes geoefend.", bildbeschreibung: "een mier" },
  "marathon-maus": { name: "Marathonmuis", nameNeutral: "Honderd rondes", description: "100 rondes geoefend.", bildbeschreibung: "het kopje van een muis" },
  "munteres-murmeltier": { name: "Bezige bever", nameNeutral: "Marathon", description: "250 rondes geoefend.", bildbeschreibung: "een bever" },
  // „Een lange adem hebben" = Ausdauer haben.
  dauerlaeufer: { name: "Lange adem", description: "500 rondes geoefend.", bildbeschreibung: "iemand die hardloopt" },
  // Wie „Duizend-en-een-nacht".
  tausendsassa: { name: "Duizend-en-één ronde", nameNeutral: "Duizend rondes", description: "1.000 rondes geoefend.", bildbeschreibung: "een walvis die water spuit" },
  // ── Aanslagen ────────────────────────────────────────────────────────────
  "tausend-tasten-tiger": { name: "Tijger van duizend toetsen", nameNeutral: "Duizend juiste aanslagen", description: "1.000 juiste aanslagen.", bildbeschreibung: "het kopje van een tijger" },
  "tasten-t-rex": { name: "Toetsen-T-rex", nameNeutral: "Tienduizend juiste aanslagen", description: "10.000 juiste aanslagen.", bildbeschreibung: "een tyrannosaurus" },
  "galaktische-fingerspitzen": { name: "Galactische vingers", description: "50.000 juiste aanslagen.", bildbeschreibung: "een raket die opstijgt" },
  "hunderttausend-held": { name: "Honderdduizend bliksems", nameNeutral: "Honderdduizend juiste aanslagen", description: "100.000 juiste aanslagen.", bildbeschreibung: "een gele bliksemschicht" },
  viertelmillion: { name: "Een kwart miljoen", description: "250.000 juiste aanslagen - zoveel letters heeft een heel boek.", bildbeschreibung: "een satelliet" },
  // ── Volhouden ────────────────────────────────────────────────────────────
  "dranbleib-dachs": { name: "Doorzettende das", nameNeutral: "Volgehouden", description: "Op 3 verschillende dagen geoefend.", bildbeschreibung: "een das" },
  gewohnheitstier: { name: "Trouwe schildpad", description: "Op 7 verschillende dagen geoefend.", bildbeschreibung: "een schildpad" },
  // „Het loopt als een klok."
  "wie-ein-uhrwerk": { name: "Als een klok", description: "Op 20 verschillende dagen geoefend.", bildbeschreibung: "een rode wekker" },
  unaufhaltsam: { name: "Niet te stoppen", description: "Op 50 verschillende dagen geoefend.", bildbeschreibung: "een berg met een besneeuwde top" },
  "tief-verwurzelt": { name: "Diepe wortels", description: "Op 100 verschillende dagen geoefend.", bildbeschreibung: "een grote groene loofboom" },
  "fels-in-der-brandung": { name: "Rots in de branding", description: "Op 200 verschillende dagen geoefend - bijna elke dag van een heel schooljaar.", bildbeschreibung: "een stenen beeld van Paaseiland" },
  // ── Oefenweken ───────────────────────────────────────────────────────────
  "vierteljahr-dabei": { name: "Al een kwart jaar", description: "In 12 verschillende weken geoefend.", bildbeschreibung: "een bruin herfstblad" },
  "halbes-jahr-dabei": { name: "Al een half jaar", description: "In 26 verschillende weken geoefend.", bildbeschreibung: "een wolk waar sneeuw uit valt" },
  "ganzes-jahr-dabei": { name: "Een heel jaar", description: "In 52 verschillende weken geoefend.", bildbeschreibung: "een verjaardagstaart met een kaarsje" },
  // ── Sterren ──────────────────────────────────────────────────────────────
  sternschnuppe: { name: "Vallende ster", description: "De eerste ronde met 3 sterren.", bildbeschreibung: "een vallende ster aan de nachtelijke hemel" },
  "sternen-sammler": { name: "Een handvol sterren", description: "10 rondes met 3 sterren.", bildbeschreibung: "een stralende gele ster" },
  sternenhimmel: { name: "Sterrenhemel", description: "30 rondes met 3 sterren.", bildbeschreibung: "de Melkweg aan de nachtelijke hemel" },
  sternenmeer: { name: "Zee van sterren", description: "75 rondes met 3 sterren.", bildbeschreibung: "een oranje ster met acht punten" },
  // ── Lessen ───────────────────────────────────────────────────────────────
  "lektions-loewe": { name: "Lessenleeuw", nameNeutral: "Vijf lessen", description: "5 lessen afgerond.", bildbeschreibung: "een leeuw" },
  "kapitel-kaeptn": { name: "Volle kracht vooruit!", description: "15 lessen afgerond.", bildbeschreibung: "een anker" },
  // Die Lektionszahl DES WEGES in Klammern - keine Zahl mit Punkt am Satzende.
  "lehrgangs-legende": { name: "Legende van de cursus", description: (z) => `Alle lessen van de cursus afgerond (in totaal ${lektionenFuer(z.lernweg).length}).`, bildbeschreibung: "een gouden beker" },
  // ── Niveaus (level op de puntenring, Glossar §2.2) ──────────────────────
  "kletter-koala": { name: "Klimmende koala", nameNeutral: "Level 5", description: "Level 5 gehaald op de puntenring.", bildbeschreibung: "een koala" },
  "punkte-rakete": { name: "Puntenraket", description: "Level 10 gehaald op de puntenring.", bildbeschreibung: "een rode ballon" },
  "gipfel-gaemse": { name: "Gems op de top", nameNeutral: "Level 20", description: "Level 20 gehaald op de puntenring.", bildbeschreibung: "een geit" },
  hoehenflug: { name: "Hoge vlucht", nameNeutral: "Level 50", description: "Level 50 gehaald op de puntenring.", bildbeschreibung: "een helikopter" },
  "ueber-den-wolken": { name: "Boven de wolken", nameNeutral: "Level 100", description: "Level 100 gehaald op de puntenring.", bildbeschreibung: "een vliegende schotel" },
  sternenreise: { name: "Reis naar de sterren", nameNeutral: "Level 200", description: "Level 200 gehaald op de puntenring.", bildbeschreibung: "een komeet met een lange staart" },
  // ── Toetsenwereld ────────────────────────────────────────────────────────
  // Die Grundreihe DES WEGES - auf Weg „nl" (nl-intl): f j d k s l a ;.
  "grundstellungs-gorilla": {
    name: "Basisrijgorilla",
    nameNeutral: "Basisrij compleet",
    description: (z) =>
      `Alle acht toetsen van de basishouding vrijgespeeld: ${lernwegDef(z.lernweg)
        .letterOrder.slice(0, lernwegDef(z.lernweg).homeRowLetters)
        .join(" ")}.`,
    bildbeschreibung: "een gorilla",
  },
  "gross-baumeister": { name: "Bouwwerk van hoofdletters", nameNeutral: "Hoofdletters", description: "De Shift-toets onder de knie - echte hoofdletters, zelf getypt.", bildbeschreibung: "vier hoofdletters op blauwe toetsen" },
  // ⚠️ „puenktchen-panda" und „schlangen-s" gibt es auf Weg „nl" nicht zu verdienen - der Eintrag steht trotzdem da,
  // weil das Regal jedes beschreibt.
  "puenktchen-panda": { name: "Stippelpanda", nameNeutral: "Duitse umlauts", description: "ä, ö en ü vrijgespeeld - Duitse letters met puntjes.", bildbeschreibung: "een panda" },
  "schlangen-s": { name: "Slangen-S", nameNeutral: "De Duitse scherpe s", description: "ß vrijgespeeld, de Duitse scherpe s - de laatste letter van het Duitse toetsenbord.", bildbeschreibung: "een slang" },
  "alphabet-as": { name: "Het hele alfabet", description: "Alle letters van A tot Z vrijgespeeld.", bildbeschreibung: "kleine letters op blauwe toetsen" },
  "punkt-und-komma": { name: "Punt en komma", description: "Punt en komma vrijgespeeld - de eerste echte leestekens.", bildbeschreibung: "een zwarte vulpen" },
  "satzzeichen-sammler": { name: "Verzameling leestekens", nameNeutral: "Alle leestekens", description: "Leestekens vrijgespeeld: . , - ? ! : ;", bildbeschreibung: "een groot rood uitroepteken" },
  "zahlen-zebra": { name: "Cijferzebra", nameNeutral: "Halve cijferrij", description: "Vijf cijfers van de cijferrij vrijgespeeld.", bildbeschreibung: "een zebra" },
  "zahlen-zauberer": { name: "Cijfertoverij", nameNeutral: "Hele cijferrij", description: "Alle cijfers van 1 tot en met 0 vrijgespeeld - de hele cijferrij.", bildbeschreibung: "een blauwe toets met het getal tien" },
  "klammer-krokodil": { name: "Haakjeskrokodil", nameNeutral: "Haakje openen, haakje sluiten", description: "De ronde haakjes ( ) vrijgespeeld - de eerste speciale tekens.", bildbeschreibung: "een krokodil" },
  "alltags-ass": { name: "Tekens voor elke dag", nameNeutral: "Alledaagse tekens", description: (z) => `Vrijgespeeld: ${alltagsZeichen(z)} - tekens uit e-mails en uit de wereld van het geld.`, bildbeschreibung: "een envelop" },
  "tastatur-krone": { name: "Toetsenbordkroon", nameNeutral: "Het hele toetsenbord", description: "ALLE toetsen van het toetsenbord vrijgespeeld - tot en met het laatste teken.", bildbeschreibung: "een gouden kroon" },
  // ── Zit erin! (zeker = sitzt, Glossar §2.2) ─────────────────────────────
  // Glossar §2.4: „Zo vast als een huis" - zum Haus auf der Medaille.
  "feste-burg": { name: "Zo vast als een huis", nameNeutral: "Basisrij zeker", description: "Alle toetsen van de basishouding zijn zeker.", bildbeschreibung: "een huis" },
  "buchstaben-baendiger": { name: "Getemde letters", nameNeutral: "Alle letters zeker", description: "Elke letter is zeker - geen enkele is nog onzeker.", bildbeschreibung: "een rood vierkant met een grote A" },
  "zahlen-fels": { name: "Cijfers als een rots", nameNeutral: "Alle cijfers zeker", description: "De hele cijferrij is zeker.", bildbeschreibung: "een telraam met gekleurde kralen" },
  "nichts-wackelt": { name: "Niets wiebelt", description: "Elke toets van het toetsenbord is zeker - het hele toetsenbord, niet alleen de vrijgespeelde toetsen.", bildbeschreibung: "een blauwe ruit met een stip in het midden" },
  // ── Snelheid ─────────────────────────────────────────────────────────────
  "flinker-fuchs": { name: "Vlugge vos", nameNeutral: "Snel en netjes", description: "Snelheidsdoel gehaald EN minstens 95% nauwkeurigheid - snelheid telt alleen als het netjes is.", bildbeschreibung: "een vos" },
  "tempo-60": { name: "Huppelende haas", nameNeutral: "60 per minuut, netjes", description: "Een ronde met 60 aanslagen per minuut en minstens 95% nauwkeurigheid.", bildbeschreibung: "een haas" },
  "tempo-90": { name: "Dartel hert", nameNeutral: "90 per minuut, netjes", description: "Een ronde met 90 aanslagen per minuut en minstens 95% nauwkeurigheid.", bildbeschreibung: "een hert" },
  "tempo-120": { name: "Galopperend paard", nameNeutral: "120 per minuut, netjes", description: "Een ronde met 120 aanslagen per minuut en minstens 98% nauwkeurigheid.", bildbeschreibung: "een galopperend paard" },
  "tempo-160": { name: "Stoomlocomotief", nameNeutral: "160 per minuut, netjes", description: "Een ronde met 160 aanslagen per minuut en minstens 98% nauwkeurigheid.", bildbeschreibung: "een stoomlocomotief" },
  "tempo-200": { name: "Sneltrein", nameNeutral: "200 per minuut, netjes", description: "Een ronde met 200 aanslagen per minuut en minstens 98% nauwkeurigheid.", bildbeschreibung: "een hogesnelheidstrein" },
  "tempo-300": { name: "Straaljager", nameNeutral: "300 per minuut, netjes", description: "Een ronde met 300 aanslagen per minuut en minstens 99% nauwkeurigheid - professioneel niveau.", bildbeschreibung: "een klein vliegtuig" },
  // ── In één ruk ───────────────────────────────────────────────────────────
  "kette-100": { name: "Kettingreactie", nameNeutral: "100 na elkaar", description: "100 juiste aanslagen na elkaar, zonder een enkele fout.", bildbeschreibung: "twee schakels van een ketting" },
  "kette-250": { name: "Zonder struikelen", description: "250 juiste aanslagen na elkaar.", bildbeschreibung: "een ketting van een paar schakels" },
  // „De rode draad" - auch im Niederländischen.
  "kette-500": { name: "De rode draad", nameNeutral: "500 na elkaar", description: "500 juiste aanslagen na elkaar - meer dan een hele ronde.", bildbeschreibung: "een klosje garen" },
  "kette-1000": { name: "Duizend zonder fout", description: "1.000 juiste aanslagen na elkaar.", bildbeschreibung: "de berg Fuji met een besneeuwde top" },
  "kette-2000": { name: "IJzeren ketting", nameNeutral: "2.000 na elkaar", description: "2.000 juiste aanslagen na elkaar - vier tot vijf rondes zonder het kleinste foutje.", bildbeschreibung: "een vulkaan waar lava uit stroomt" },
  // ── Avonturen (IJsschotsenspel, Glossar §2.3) ───────────────────────────
  "erste-expedition": { name: "Eerste expeditie", description: "Het eerste avontuur in het IJsschotsenspel in vrij spel - helemaal tot aan de iglo.", bildbeschreibung: "een kompas" },
  polarforscher: { name: "Poolontdekkingen", description: "10 avonturen in het IJsschotsenspel afgerond in vrij spel.", bildbeschreibung: "een sneeuwvlok" },
  "eismeer-legende": { name: "Legende van de IJszee", description: "30 avonturen in het IJsschotsenspel afgerond in vrij spel.", bildbeschreibung: "een hoge blauwe golf" },
  "packeis-profi": { name: "Pakijs onder de knie", nameNeutral: "60 avonturen", description: "60 avonturen in het IJsschotsenspel afgerond in vrij spel.", bildbeschreibung: "een reiskoffer" },
  // ── Avonturenkunstjes ────────────────────────────────────────────────────
  // „Trockener Frack": der Frack ist der Pinguin selbst - niederländisch „slipjas".
  "trockener-frack": { name: "Droge slipjas", description: "Een heel avontuur zonder een keer in het water of in de sneeuw te vallen.", bildbeschreibung: "een zwarte hoge hoed" },
  "immer-trocken": { name: "Altijd droog", description: (z) => `${nl(z.trockeneAbenteuer, "avontuur", "avonturen")} zonder een keer in het water te vallen.`, bildbeschreibung: "een dichte paraplu" },
  fischfaenger: { name: "Goede vangst", description: (z) => `${nl(z.fische, "bonusvis", "bonusvissen")} gevangen in het IJsschotsenspel.`, bildbeschreibung: "een blauwe vis" },
  // ── Expeditie ────────────────────────────────────────────────────────────
  // Die Zonennamen wie im Spiel (Glossar §2.3): de echogrot, de sneeuwstorm, het poolstation, de Poolexpeditie.
  "hoehlen-lauscher": { name: "Vleermuisoren", description: "De hele echogrot tot aan de uitgang - in het donker, alleen op het gehoor.", bildbeschreibung: "een vleermuis" },
  "sturm-trotzer": { name: "Sneeuwstorm getrotseerd", description: "De sneeuwstorm doorstaan - tekenreeksen uit het hoofd getypt.", bildbeschreibung: "een gezicht dat wind blaast" },
  "funker-freund": { name: "Vrienden via de radio", description: "Een heel radiobericht ontcijferd en naar het poolstation verstuurd.", bildbeschreibung: "een radio" },
  "polarlicht-entdecker": { name: "Onder het poollicht", description: "De hele Poolexpeditie zonder een enkele fout - het poollicht danst.", bildbeschreibung: "een ster met een staart van vonken" },
  // ── Verhalen ─────────────────────────────────────────────────────────────
  "lese-luchs": { name: "Lezende luipaard", nameNeutral: "Eerste verhaal", description: "Het eerste verhaal tot het einde gelezen en getypt.", bildbeschreibung: "een luipaard" },
  buecherwurm: { name: "Boekenwurm", description: "3 verhalen tot het einde gelezen.", bildbeschreibung: "een groene rups" },
  "buecherei-baer": { name: "Bibliotheekbeer", nameNeutral: "Acht verhalen", description: "8 verhalen tot het einde gelezen.", bildbeschreibung: "een beer" },
  vielleser: { name: "Een berg boeken", description: "15 verhalen tot het einde gelezen.", bildbeschreibung: "een stapel gekleurde boeken" },
  // ── Leesuurtje (deel = Etappe einer Geschichte, Glossar §2.2) ───────────
  "seiten-spatz": { name: "Mus van de eerste bladzijde", nameNeutral: "Eerste bladzijde", description: "Het eerste deel van een verhaal getypt.", bildbeschreibung: "een klein blauw vogeltje" },
  "kapitel-krake": { name: "Belezen inktvis", nameNeutral: "Tien delen", description: "10 delen gelezen en getypt.", bildbeschreibung: "een inktvis" },
  "geschichten-gigant": { name: "Olifantenportie verhalen", description: "30 delen gelezen en getypt.", bildbeschreibung: "een olifant" },
  leseratte: { name: "Lezen zonder einde", nameNeutral: "75 delen", description: "75 delen gelezen en getypt.", bildbeschreibung: "een perkamentrol" },
  // ── Leeskunstjes ─────────────────────────────────────────────────────────
  federleicht: { name: "Vederlicht", description: "Een heel deel getypt zonder een enkele fout.", bildbeschreibung: "een witte veer" },
  // Nicht „In één ruk" - so heisst schon die Familie „Am Stück".
  "in-einem-rutsch": { name: "In één adem uit", description: "Een heel verhaal op één dag uitgelezen.", bildbeschreibung: "een blauwe spiraal" },
  "lesezeichen-held": { name: "Bladwijzer op de goede plek", description: "Op een andere dag verder gelezen, precies waar het de vorige keer stopte.", bildbeschreibung: "een bladwijzer" },
  // ── Meesterproef (nie „examen" oder „toets", Glossar §4 Falle 1) ────────
  "zehn-minuten-abschrift": { name: "Tien minuten overtypen", description: "Tien minuten lang een tekst overtypen zonder pauze en met hoogstens 0,5% fouten - zoals bij een echte typewedstrijd.", bildbeschreibung: "een stopwatch" },
  "lehrgangs-meister": { name: "Cursus voltooid", description: (z) => `Alle lessen van de cursus afgerond, elke les met drie sterren (in totaal ${lektionenFuer(z.lernweg).length}).`, bildbeschreibung: "een zwarte afstudeerhoed" },
  "goldene-tastatur": { name: "Het gouden toetsenbord", description: "Alle toetsen vrijgespeeld en zeker - en een keer 160 aanslagen per minuut met 98% nauwkeurigheid. De laatste medaille.", bildbeschreibung: "een sportmedaille aan een lint" },
  // ── Geheim ───────────────────────────────────────────────────────────────
  "gemuetliches-faultier": { name: "Rustige luiaard", description: "Lekker langzaam, maar zonder een enkele fout - nauwkeurigheid gaat voor snelheid!", bildbeschreibung: "een luiaard" },
  "comeback-kaenguru": { name: "Kangoeroesprong", description: "Een ronde met 3 sterren meteen na een ronde met 1 ster.", bildbeschreibung: "een kangoeroe" },
  // Uhrzeiten in Worten - keine Zahl mit Punkt am Satzende. Apostroph ASCII (Glossar Regel 7).
  nachteule: { name: "Nachtuil", description: "Een ronde afgerond na negen uur 's avonds.", bildbeschreibung: "een uil" },
  // „De vroege vogel vangt de worm."
  "frueher-vogel": { name: "De vroege vogel", description: "Een ronde afgerond voor zeven uur 's ochtends.", bildbeschreibung: "een haan" },
  nimmersatt: { name: "Leeshonger", description: "3 delen van een verhaal op één dag verslonden.", bildbeschreibung: "een groene appel" },
  "ferien-held": { name: "Vakantie aan het toetsenbord", description: "Geoefend midden in de zomervakantie - in juli of augustus.", bildbeschreibung: "een strand met een parasol" },
  "wochenend-schreiber": { name: "Weekendtypen", description: "Geoefend op zaterdag en op zondag.", bildbeschreibung: "een blad van een kalender" },
  "zurueck-im-sattel": { name: "Weer in het zadel", description: (z) => `Weer geoefend na een pauze van meer dan ${nl(z.pauseTage, "dag", "dagen")} - terugkomen telt ook.`, bildbeschreibung: "twee pijlen die in een cirkel rondgaan" },
  "doppelt-genaeht": { name: "Dubbele steek", description: "Twee rondes zonder fout, direct na elkaar.", bildbeschreibung: "een naald met draad" },
  winterkind: { name: "Wintertoetsen", description: "Geoefend midden in de winter - in december of januari.", bildbeschreibung: "een sneeuwpop" },
  jahreswechsel: { name: "Oud en nieuw", description: "Geoefend op de laatste dag van het jaar of op de eerste dag van het nieuwe jaar.", bildbeschreibung: "vuurwerk aan de nachtelijke hemel" },
  "tages-marathon": { name: "Marathondag", description: "Tien rondes op één dag.", bildbeschreibung: "iemand op een renpaard" },
  sternentag: { name: "Sterrendag", description: "Drie rondes met drie sterren op één dag.", bildbeschreibung: "een zon met een gezicht" },
  // „Spic en span" = blitzsauber.
  blitzsauber: { name: "Spic en span", description: "Drie rondes zonder fout op één dag.", bildbeschreibung: "een stuk zeep met schuim" },
  "volle-woche": { name: "Volle week", description: "Op vijf verschillende dagen geoefend in ÉÉN week.", bildbeschreibung: "een groen boek" },
  // „Blindflug" ⇒ „Niet spieken": zum Affen, der sich die Augen zuhält. Glossar Regel 4: nie „blind".
  blindflug: { name: "Niet spieken", description: "Een hele ronde zonder fout - met het schermtoetsenbord verborgen. Daar draait het om bij typen met tien vingers.", bildbeschreibung: "een aapje met de handen voor de ogen" },
  sprachwechsler: { name: "Reis tussen talen", description: "Geoefend in twee talen - bijvoorbeeld in het Nederlands en in het Engels.", bildbeschreibung: "de wereldbol met Europa en Afrika" },
  lesenacht: { name: "Lezen bij maanlicht", description: "Een deel van een verhaal gelezen na acht uur 's avonds.", bildbeschreibung: "een maan met een gezicht" },
  "zaehe-taste": { name: "Koppige toets", description: "Een toets die lang lastig was, is nu zeker.", bildbeschreibung: "een slak" },
  aufsteiger: { name: "Bergop", description: "Vijf moeilijkheidsniveaus hoger dan het startpunt.", bildbeschreibung: "een grafiek met een stijgende lijn" },
  // ── Nur auf Weg „fr" (`badgesNurFr.ts`) - für eine niederländische Bedienung auf diesem Weg; dieselben Gedanken wie dort.
  "akzente-ziffernreihe": { name: "Acrobatiek met accenten", nameNeutral: "é, è, ç en à", description: "é, è, ç en à vrijgespeeld - de letters die op de cijferrij wonen.", bildbeschreibung: "de cijfers 1 2 3 4 op een blauwe toets" },
  "accent-circonflexe": { name: "Het dakje", nameNeutral: "Het Franse dakje", description: "De dode toets ^ is zeker: ê, â, î, ô en û.", bildbeschreibung: "een strohoed met een lint" },
  trema: { name: "Lieveheersbeestje met twee stippen", nameNeutral: "Het trema", description: "De dode toets ¨ is zeker: ë, ï en ü.", bildbeschreibung: "een lieveheersbeestje" },
};
