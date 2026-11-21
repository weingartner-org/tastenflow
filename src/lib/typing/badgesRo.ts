/**
 * ★★★ DER ABZEICHEN-KATALOG RUMÄNISCH (G3c-VERTEILER 25.10.2026 als Einhängepunkt, gefüllt O-RO 29.10.2026).
 *
 * Gegenstück zu `badgesCs.ts` - dieselbe Bauart, dieselben Schlüssel, NEU AUF RUMÄNISCH GESCHRIEBEN, nicht übersetzt
 * (Glossar `recherche-rumänisch-2026-10-25/GLOSSAR-ro.md` §2.4): übertragen ist die IDEE des Namens. Wo das Rumänische
 * eine eigene Wendung zum Motiv hat, steht sie da („Drept la țintă", „Ca ceasul", „Șoarece de bibliotecă", „Tare ca
 * piatra", „Cine se scoală de dimineață", „Cu toate pânzele sus", „Pe nerăsuflate", „Casa mea, cetatea mea", „Firul
 * roșu", „Curățenie lună"); sonst ein Stabreim oder ein Bild wie im Deutschen („Pinguinul precis", „Vulpea vioaie",
 * „Tigrul celor o mie de taste").
 *
 * ★★★ Geschlecht nie raten (Glossar Regel 2): KEINE Personenwörter für das Kind („campion", „câștigător", „maestru",
 * „constructor", „explorator" wären gegendert), Adjektive nur an einem Tier oder Ding („Furnica harnică", „Degete de
 * diamant"), nie am Kind. „Tare ca piatra": „tare" ist in der Einzahl für beide Geschlechter gleich. Die Beschreibungen
 * sind Sätze über die Sache - Hauptwort mit Partizip am Ding („5 lecții terminate"), ein Hauptwort („Exersare în 3 zile
 * diferite") oder Zahl + Hauptwort („100 de runde exersate").
 *
 * ★ Mehrzahl (Glossar Regel 13, §2.11): one = 1 · few = 0, 2-19, 101-119 · other = 20-99, 100, 120 … ⇒ „de" zwischen
 * Zahl und Hauptwort („15 runde", aber „25 de runde", „1.000 de apăsări"). Die festen Zahlen stehen mit der Form, die zu
 * IHR gehört; wo eine Zahl von aussen kommt (`z.fische` usw.), wählt {@link ro} über `Intl.PluralRules("ro-RO")`.
 * Zahlen mit Tausenderpunkt („1.000", Regel 5), Prozent „95 %" mit geschütztem Leerzeichen U+00A0, Dezimalkomma („0,5 %").
 *
 * ★ Keine Zahl mit Punkt am Satzende (Falle 6): Uhrzeiten in Worten („după ora nouă seara"), Summen in Klammern
 * („(în total 19)"). „1" nie vor ein Hauptwort, das vorgelesen wird („după o rundă cu o stea").
 *
 * Grossschreibung: nur das erste Wort und Eigennamen („Peștera ecoului", „Viscolul", „Stația polară", „Expediția
 * polară", Glossar §2.3). Zweitnamen (`nameNeutral`, ab 11 Jahren) genau dort, wo das Englische einen hat. Glossar:
 * medalie, rundă, apăsare, precizie, greșeală, poziția de bază, șirul de bază, șirul de cifre, parte (einer Geschichte),
 * cercul de puncte, nivel de dificultate, punct de plecare, poveste, Sloiuri de gheață, Expediția polară. „rând" ist die
 * Übungszeile - darum „una după alta", nie „la rând".
 *
 * ⚠️ Wer ein Abzeichen anlegt, trägt es HIER mit ein - Wächter `tests/tastenflow-abzeichen-ro.test.ts`.
 */
import { lernwegDef } from "./lernweg";
import { lektionenFuer } from "./curriculum";
import type { AbzeichenTextEn, AbzeichenZahlen } from "./badgesEn";

/** Dieselbe Form wie der englische Eintrag. */
export type AbzeichenTextRo = AbzeichenTextEn;

/** Die Mehrzahl-Regel des Rumänischen (CLDR): one · few · other (Glossar §2.11). */
const PLURAL_RO = new Intl.PluralRules("ro-RO");

/**
 * Zahl mit der passenden Form: `ro(n, "zi", "zile", "de zile")` - die `other`-Form trägt das „de" selbst
 * (Glossar Regel 13: „20 de zile", aber „19 zile" und „101 zile").
 */
function ro(n: number, one: string, few: string, other: string): string {
  const k = PLURAL_RO.select(n);
  const form = k === "one" ? one : k === "few" ? few : other;
  return `${n.toLocaleString("ro-RO")} ${form}`;
}

/** Die Zeichen von „alltags-ass", die es auf dem Weg des Kindes wirklich gibt (wie `badgesCs.ts`). */
function alltagsZeichen(z: AbzeichenZahlen): string {
  const reihe = new Set(lernwegDef(z.lernweg).introOrder);
  const alle = ["@", "€", "$", "§"];
  const da = alle.filter((c) => reihe.has(c));
  const liste = da.length > 0 ? da : alle;
  if (liste.length === 1) return liste[0];
  return `${liste.slice(0, -1).join(", ")} și ${liste[liste.length - 1]}`;
}

/** Die Familien (Überschriften im Regal) - Schlüssel ist der deutsche `group`-Name (Glossar §2.4). */
export const ABZEICHEN_GRUPPEN_RO: Readonly<Record<string, string>> = {
  Fehlerfrei: "Fără greșeli",
  "Saubere Serie": "Runde perfecte",
  Fleiß: "Hărnicie",
  Anschläge: "Taste apăsate",
  Dranbleiben: "Perseverență",
  Übungswochen: "Săptămâni de exersare",
  Sterne: "Stele",
  Lektionen: "Lecții",
  Stufen: "Niveluri",
  Tastenwelt: "Lumea tastaturii",
  "Sitzt!": "Știu!",
  Tempo: "Viteză",
  "Am Stück": "Dintr-o suflare",
  Meisterprüfung: "Măiestrie",
  Abenteuer: "Aventuri",
  "Abenteuer-Kunststücke": "Isprăvi de aventură",
  Expedition: "Expediție",
  Geschichten: "Povești",
  Lesestunde: "Ora de lectură",
  "Lese-Kunststücke": "Isprăvi de lectură",
  Geheim: "Secrete",
};

/** Der ganze Katalog rumänisch, je Abzeichen-ID. */
export const ABZEICHEN_RO: Readonly<Record<string, AbzeichenTextRo>> = {
  // ── Fără greșeli ─────────────────────────────────────────────────────────
  volltreffer: { name: "Drept la țintă", description: "O rundă întreagă fără nicio greșeală.", bildbeschreibung: "o țintă cu o săgeată fix în mijloc" },
  "null-fehler-ninja": { name: "Ninja fără greșeli", description: "5 runde fără nicio greșeală.", bildbeschreibung: "un ninja" },
  "makellos-meister": { name: "Stele sclipitoare", description: "15 runde fără nicio greșeală.", bildbeschreibung: "trei stele strălucitoare" },
  "diamant-finger": { name: "Degete de diamant", description: "40 de runde fără nicio greșeală.", bildbeschreibung: "o piatră prețioasă albastră" },
  // „Weiße Weste" ⇒ „fără pată" (makellos) - als Wendung, ohne Adjektiv am Kind.
  "weisse-weste": { name: "Fără pată", description: "80 de runde fără nicio greșeală.", bildbeschreibung: "un porumbel alb" },
  "einhorn-finger": { name: "Degete de unicorn", nameNeutral: "150 de runde fără greșeli", description: "150 de runde fără nicio greșeală.", bildbeschreibung: "un unicorn" },
  // ── Runde perfecte ───────────────────────────────────────────────────────
  "praezisions-pinguin": { name: "Pinguinul precis", nameNeutral: "Trei runde curate", description: "3 runde curate una după alta (precizie de cel puțin 95 %).", bildbeschreibung: "un pinguin" },
  adlerauge: { name: "Ochi de vultur", description: "7 runde curate una după alta (precizie de cel puțin 95 %).", bildbeschreibung: "un vultur" },
  "laser-lama": { name: "Lama laser", nameNeutral: "Modul laser", description: "15 runde curate una după alta (precizie de cel puțin 95 %).", bildbeschreibung: "o lamă, animalul din Anzi" },
  "eiskalte-serie": { name: "Calm de gheață", description: "25 de runde curate una după alta (precizie de cel puțin 95 %).", bildbeschreibung: "un cub de gheață" },
  // ── Hărnicie ─────────────────────────────────────────────────────────────
  "tasten-kueken": { name: "Puiul tastaturii", nameNeutral: "Prima rundă", description: "Prima rundă terminată.", bildbeschreibung: "un pui care iese din ou" },
  "ausdauer-ameise": { name: "Furnica harnică", nameNeutral: "După încălzire", description: "25 de runde exersate.", bildbeschreibung: "o furnică" },
  "marathon-maus": { name: "Șoricelul maratonist", nameNeutral: "O sută de runde", description: "100 de runde exersate.", bildbeschreibung: "capul unui șoricel" },
  "munteres-murmeltier": { name: "Castorul neobosit", nameNeutral: "Maraton", description: "250 de runde exersate.", bildbeschreibung: "un castor" },
  dauerlaeufer: { name: "Distanță lungă", description: "500 de runde exersate.", bildbeschreibung: "o persoană care aleargă" },
  // Wie „O mie și una de nopți".
  tausendsassa: { name: "O mie și una de runde", nameNeutral: "O mie de runde", description: "1.000 de runde exersate.", bildbeschreibung: "o balenă care aruncă un jet de apă" },
  // ── Taste apăsate ────────────────────────────────────────────────────────
  "tausend-tasten-tiger": { name: "Tigrul celor o mie de taste", nameNeutral: "O mie de apăsări corecte", description: "1.000 de apăsări corecte.", bildbeschreibung: "capul unui tigru" },
  "tasten-t-rex": { name: "T-rexul tastaturii", nameNeutral: "Zece mii de apăsări corecte", description: "10.000 de apăsări corecte.", bildbeschreibung: "un tiranozaur" },
  "galaktische-fingerspitzen": { name: "Degete galactice", description: "50.000 de apăsări corecte.", bildbeschreibung: "o rachetă care decolează" },
  "hunderttausend-held": { name: "O sută de mii de fulgere", nameNeutral: "O sută de mii de apăsări corecte", description: "100.000 de apăsări corecte.", bildbeschreibung: "un fulger galben" },
  viertelmillion: { name: "Un sfert de milion", description: "250.000 de apăsări corecte - cam cât are o carte întreagă.", bildbeschreibung: "un satelit" },
  // ── Perseverență ─────────────────────────────────────────────────────────
  "dranbleib-dachs": { name: "Bursucul perseverent", nameNeutral: "Cu perseverență", description: "Exersare în 3 zile diferite.", bildbeschreibung: "un bursuc" },
  gewohnheitstier: { name: "Țestoasa statornică", description: "Exersare în 7 zile diferite.", bildbeschreibung: "o broască țestoasă" },
  // „Merge ca ceasul."
  "wie-ein-uhrwerk": { name: "Ca ceasul", description: "Exersare în 20 de zile diferite.", bildbeschreibung: "un ceas deșteptător roșu" },
  unaufhaltsam: { name: "De neoprit", description: "Exersare în 50 de zile diferite.", bildbeschreibung: "un munte cu vârful înzăpezit" },
  "tief-verwurzelt": { name: "Rădăcini adânci", description: "Exersare în 100 de zile diferite.", bildbeschreibung: "un copac mare cu frunze verzi" },
  // „tare" ist in der Einzahl für beide Geschlechter gleich (Glossar Regel 2).
  "fels-in-der-brandung": { name: "Tare ca piatra", description: "Exersare în 200 de zile diferite - aproape în fiecare zi a unui an școlar întreg.", bildbeschreibung: "o statuie de piatră din Insula Paștelui" },
  // ── Săptămâni de exersare ────────────────────────────────────────────────
  "vierteljahr-dabei": { name: "Deja trei luni", description: "Exersare în 12 săptămâni diferite.", bildbeschreibung: "o frunză maro de toamnă" },
  "halbes-jahr-dabei": { name: "Deja jumătate de an", description: "Exersare în 26 de săptămâni diferite.", bildbeschreibung: "un nor din care cade zăpadă" },
  "ganzes-jahr-dabei": { name: "Un an întreg", description: "Exersare în 52 de săptămâni diferite.", bildbeschreibung: "un tort aniversar cu o lumânare" },
  // ── Stele ────────────────────────────────────────────────────────────────
  sternschnuppe: { name: "Stea căzătoare", description: "Prima rundă cu 3 stele.", bildbeschreibung: "o stea căzătoare pe cerul nopții" },
  "sternen-sammler": { name: "O mână de stele", description: "10 runde cu 3 stele.", bildbeschreibung: "o stea galbenă strălucitoare" },
  sternenhimmel: { name: "Cer înstelat", description: "30 de runde cu 3 stele.", bildbeschreibung: "Calea Lactee pe cerul nopții" },
  sternenmeer: { name: "Mare de stele", description: "75 de runde cu 3 stele.", bildbeschreibung: "o stea portocalie cu opt colțuri" },
  // ── Lecții ───────────────────────────────────────────────────────────────
  "lektions-loewe": { name: "Leul lecțiilor", nameNeutral: "Cinci lecții", description: "5 lecții terminate.", bildbeschreibung: "un leu" },
  // „Cu toate pânzele sus" - mit vollen Segeln voraus, zum Anker auf der Medaille.
  "kapitel-kaeptn": { name: "Cu toate pânzele sus", description: "15 lecții terminate.", bildbeschreibung: "o ancoră" },
  // Die Lektionszahl DES WEGES in Klammern - keine Zahl mit Punkt am Satzende (Falle 6), kein Hauptwort hinter ihr.
  "lehrgangs-legende": { name: "Legenda cursului", description: (z) => `Toate lecțiile cursului terminate (în total ${lektionenFuer(z.lernweg).length}).`, bildbeschreibung: "o cupă de aur" },
  // ── Niveluri (cercul de puncte) ──────────────────────────────────────────
  "kletter-koala": { name: "Koala în copac", nameNeutral: "Nivelul 5", description: "Nivelul 5 atins pe cercul de puncte.", bildbeschreibung: "un koala" },
  "punkte-rakete": { name: "Racheta punctelor", description: "Nivelul 10 atins pe cercul de puncte.", bildbeschreibung: "un balon roșu" },
  "gipfel-gaemse": { name: "Capra de pe vârf", nameNeutral: "Nivelul 20", description: "Nivelul 20 atins pe cercul de puncte.", bildbeschreibung: "o capră" },
  hoehenflug: { name: "Zbor înalt", nameNeutral: "Nivelul 50", description: "Nivelul 50 atins pe cercul de puncte.", bildbeschreibung: "un elicopter" },
  "ueber-den-wolken": { name: "Deasupra norilor", nameNeutral: "Nivelul 100", description: "Nivelul 100 atins pe cercul de puncte.", bildbeschreibung: "o farfurie zburătoare" },
  sternenreise: { name: "Călătorie printre stele", nameNeutral: "Nivelul 200", description: "Nivelul 200 atins pe cercul de puncte.", bildbeschreibung: "o cometă cu o coadă lungă" },
  // ── Lumea tastaturii ─────────────────────────────────────────────────────
  // Die Grundreihe DES WEGES - auf Weg „ro": f j d k s l a ș.
  "grundstellungs-gorilla": {
    name: "Gorila șirului de bază",
    nameNeutral: "Șirul de bază la locul lui",
    description: (z) =>
      `Toate cele opt taste ale poziției de bază deblocate: ${lernwegDef(z.lernweg)
        .letterOrder.slice(0, lernwegDef(z.lernweg).homeRowLetters)
        .join(" ")}.`,
    bildbeschreibung: "o gorilă",
  },
  // Nicht „Constructorul" (Personenwort).
  "gross-baumeister": { name: "Construcție din majuscule", nameNeutral: "Litere mari", description: "Tasta Shift învățată - litere mari adevărate, scrise cu mâna ta.", bildbeschreibung: "patru majuscule pe taste albastre" },
  // ⚠️ „puenktchen-panda" und „schlangen-s" gibt es auf Weg „ro" nicht zu verdienen - der Eintrag steht trotzdem da,
  // weil das Regal jedes beschreibt.
  "puenktchen-panda": { name: "Panda cu puncte", nameNeutral: "Literele germane cu două puncte", description: "Literele ä, ö și ü deblocate - literele germane cu două puncte.", bildbeschreibung: "un panda" },
  "schlangen-s": { name: "Șarpele S", nameNeutral: "S dublu german", description: "Litera ß deblocată, s dublu german - ultima literă de pe tastatura germană.", bildbeschreibung: "un șarpe" },
  "alphabet-as": { name: "Tot alfabetul", description: "Toate literele de la A la Z deblocate.", bildbeschreibung: "litere mici pe taste albastre" },
  // Nicht „Punct și virgulă" - so heisst das Zeichen „;".
  "punkt-und-komma": { name: "Primul punct, prima virgulă", description: "Punctul și virgula deblocate - primele semne de punctuație adevărate.", bildbeschreibung: "o pană de scris neagră" },
  "satzzeichen-sammler": { name: "Colecția de semne", nameNeutral: "Toate semnele de punctuație", description: "Semnele de punctuație deblocate: . , - ? ! : ;", bildbeschreibung: "un semn al exclamării mare și roșu" },
  "zahlen-zebra": { name: "Zebra cifrelor", nameNeutral: "Jumătate din cifre", description: "Cinci cifre de pe șirul de cifre deblocate.", bildbeschreibung: "o zebră" },
  "zahlen-zauberer": { name: "Magia cifrelor", nameNeutral: "Șirul de cifre complet", description: "Toate cifrele de la 1 la 0 deblocate - tot șirul de cifre.", bildbeschreibung: "o tastă albastră cu numărul zece" },
  "klammer-krokodil": { name: "Crocodilul dintre paranteze", nameNeutral: "Paranteză deschisă, paranteză închisă", description: "Parantezele rotunde ( ) deblocate - primele simboluri.", bildbeschreibung: "un crocodil" },
  "alltags-ass": { name: "Semne de zi cu zi", nameNeutral: "Simboluri de zi cu zi", description: (z) => `Deblocate: ${alltagsZeichen(z)} - semnele din e-mailuri și din lumea banilor.`, bildbeschreibung: "un plic" },
  "tastatur-krone": { name: "Coroana tastaturii", nameNeutral: "Toată tastatura", description: "TOATE tastele de pe tastatură deblocate - până la ultimul simbol.", bildbeschreibung: "o coroană de aur" },
  // ── Știu! ────────────────────────────────────────────────────────────────
  // „Casa mea e cetatea mea."
  "feste-burg": { name: "Casa mea, cetatea mea", nameNeutral: "Șirul de bază e sigur", description: "Toate tastele poziției de bază sunt sigure.", bildbeschreibung: "o casă" },
  "buchstaben-baendiger": { name: "Literele îmblânzite", nameNeutral: "Toate literele sunt sigure", description: "Fiecare literă e sigură - nicio literă nu mai e nesigură.", bildbeschreibung: "un pătrat roșu cu un A mare" },
  "zahlen-fels": { name: "Cifre tari ca piatra", nameNeutral: "Toate cifrele sunt sigure", description: "Tot șirul de cifre e sigur.", bildbeschreibung: "un abac cu bile colorate" },
  "nichts-wackelt": { name: "Nimic nu se clatină", description: "Fiecare tastă de pe tastatură e sigură - toată tastatura, nu doar tastele deblocate.", bildbeschreibung: "un romb albastru cu un punct în mijloc" },
  // ── Viteză ───────────────────────────────────────────────────────────────
  "flinker-fuchs": { name: "Vulpea vioaie", nameNeutral: "Rapid și precis", description: "Viteza cerută ȘI o precizie de cel puțin 95 % - viteza contează doar când scrisul e precis.", bildbeschreibung: "o vulpe" },
  "tempo-60": { name: "Iepurele iute", nameNeutral: "60 pe minut, precis", description: "O rundă cu 60 de caractere pe minut și o precizie de cel puțin 95 %.", bildbeschreibung: "un iepure" },
  "tempo-90": { name: "Căprioara sprintenă", nameNeutral: "90 pe minut, precis", description: "O rundă cu 90 de caractere pe minut și o precizie de cel puțin 95 %.", bildbeschreibung: "o căprioară" },
  "tempo-120": { name: "Calul în galop", nameNeutral: "120 pe minut, precis", description: "O rundă cu 120 de caractere pe minut și o precizie de cel puțin 98 %.", bildbeschreibung: "un cal în galop" },
  "tempo-160": { name: "Locomotiva cu abur", nameNeutral: "160 pe minut, precis", description: "O rundă cu 160 de caractere pe minut și o precizie de cel puțin 98 %.", bildbeschreibung: "o locomotivă cu abur" },
  "tempo-200": { name: "Trenul expres", nameNeutral: "200 pe minut, precis", description: "O rundă cu 200 de caractere pe minut și o precizie de cel puțin 98 %.", bildbeschreibung: "un tren de mare viteză" },
  "tempo-300": { name: "Avionul cu reacție", nameNeutral: "300 pe minut, precis", description: "O rundă cu 300 de caractere pe minut și o precizie de cel puțin 99 % - nivel profesionist.", bildbeschreibung: "un avion mic" },
  // ── Dintr-o suflare ──────────────────────────────────────────────────────
  "kette-100": { name: "Reacție în lanț", nameNeutral: "100 una după alta", description: "100 de apăsări corecte una după alta, fără nicio greșeală.", bildbeschreibung: "două zale de lanț" },
  "kette-250": { name: "Fără poticneală", description: "250 de apăsări corecte una după alta.", bildbeschreibung: "un lanț din mai multe zale" },
  // „Firul roșu" - der rote Faden, auch im Rumänischen.
  "kette-500": { name: "Firul roșu", nameNeutral: "500 una după alta", description: "500 de apăsări corecte una după alta - mai mult decât o rundă întreagă.", bildbeschreibung: "un mosor cu ață" },
  "kette-1000": { name: "O mie fără greșeală", description: "1.000 de apăsări corecte una după alta.", bildbeschreibung: "muntele Fuji cu vârful înzăpezit" },
  "kette-2000": { name: "Lanțul de fier", nameNeutral: "2.000 una după alta", description: "2.000 de apăsări corecte una după alta - patru sau cinci runde fără nici cea mai mică greșeală.", bildbeschreibung: "un vulcan din care curge lavă" },
  // ── Aventuri (jocul „Sloiuri de gheață", Glossar §2.3) ──────────────────
  "erste-expedition": { name: "Prima expediție", description: "Prima aventură pe sloiuri de gheață în jocul liber - până la iglu.", bildbeschreibung: "o busolă" },
  // Nicht „Exploratorul polar" (Personenwort).
  polarforscher: { name: "Descoperiri polare", description: "10 aventuri pe sloiuri de gheață terminate în jocul liber.", bildbeschreibung: "un fulg de zăpadă" },
  "eismeer-legende": { name: "Legenda mării de gheață", description: "30 de aventuri pe sloiuri de gheață terminate în jocul liber.", bildbeschreibung: "un val albastru înalt" },
  "packeis-profi": { name: "Banchiza cucerită", nameNeutral: "60 de aventuri", description: "60 de aventuri pe sloiuri de gheață terminate în jocul liber.", bildbeschreibung: "o valiză" },
  // ── Isprăvi de aventură ──────────────────────────────────────────────────
  // „Trockener Frack": der Frack ist der Pinguin selbst - rumänisch „frac".
  "trockener-frack": { name: "Frac uscat", description: "O aventură întreagă fără nicio cădere în apă sau în zăpadă.", bildbeschreibung: "un joben negru" },
  "immer-trocken": { name: "Mereu la uscat", description: (z) => `${ro(z.trockeneAbenteuer, "aventură", "aventuri", "de aventuri")} fără nicio cădere în apă.`, bildbeschreibung: "o umbrelă închisă" },
  fischfaenger: { name: "Pescuit bogat", description: (z) => `${ro(z.fische, "pește bonus prins", "pești bonus prinși", "de pești bonus prinși")} în aventura pe sloiuri de gheață.`, bildbeschreibung: "un pește albastru" },
  // ── Expediție ────────────────────────────────────────────────────────────
  // Die Zonennamen wie im Spiel (Glossar §2.3): Peștera ecoului, Viscolul, Stația polară. Nie „orb" (Regel 3/4).
  "hoehlen-lauscher": { name: "Urechi de liliac", description: "Prin Peștera ecoului până la ieșire - pe întuneric, doar după auz.", bildbeschreibung: "un liliac" },
  "sturm-trotzer": { name: "Viscolul învins", description: "Prin Viscol până la capăt - grupurile de caractere scrise din memorie.", bildbeschreibung: "o față care suflă vânt" },
  "funker-freund": { name: "Prieteni prin stația radio", description: "Un mesaj radio întreg descifrat și trimis la Stația polară.", bildbeschreibung: "un aparat de radio" },
  "polarlicht-entdecker": { name: "Sub aurora polară", description: "Toată Expediția polară fără nicio greșeală - aurora polară dansează.", bildbeschreibung: "o stea cu o dâră de scântei" },
  // ── Povești ──────────────────────────────────────────────────────────────
  "lese-luchs": { name: "Râsul cititor", nameNeutral: "Prima poveste", description: "Prima poveste citită și scrisă până la capăt.", bildbeschreibung: "un leopard" },
  // „Șoarece de bibliotecă" = Bücherwurm.
  buecherwurm: { name: "Șoarece de bibliotecă", description: "3 povești citite până la capăt.", bildbeschreibung: "o omidă verde" },
  "buecherei-baer": { name: "Ursul din bibliotecă", nameNeutral: "Opt povești", description: "8 povești citite până la capăt.", bildbeschreibung: "un urs" },
  vielleser: { name: "Munte de cărți", description: "15 povești citite până la capăt.", bildbeschreibung: "un teanc de cărți colorate" },
  // ── Ora de lectură (parte = Etappe einer Geschichte, Glossar §2.2) ──────
  "seiten-spatz": { name: "Vrăbiuța primei pagini", nameNeutral: "Prima pagină", description: "Prima parte dintr-o poveste scrisă.", bildbeschreibung: "o pasăre mică albastră" },
  "kapitel-krake": { name: "Caracatița cititoare", nameNeutral: "Zece părți", description: "10 părți citite și scrise.", bildbeschreibung: "o caracatiță" },
  "geschichten-gigant": { name: "Porție de elefant", description: "30 de părți citite și scrise.", bildbeschreibung: "un elefant" },
  leseratte: { name: "Lectură fără sfârșit", nameNeutral: "75 de părți", description: "75 de părți citite și scrise.", bildbeschreibung: "un sul de pergament" },
  // ── Isprăvi de lectură ───────────────────────────────────────────────────
  // Nicht „Ușor ca fulgul": das Adjektiv hinge am Kind (Regel 2).
  federleicht: { name: "Ca un fulg", description: "O parte întreagă scrisă fără nicio greșeală.", bildbeschreibung: "o pană albă" },
  // Nicht „Dintr-o suflare" - so heisst schon die Familie „Am Stück".
  "in-einem-rutsch": { name: "Pe nerăsuflate", description: "O poveste întreagă citită până la capăt într-o singură zi.", bildbeschreibung: "o spirală albastră" },
  "lesezeichen-held": { name: "Semnul de carte la locul lui", description: "Lectura continuată în altă zi exact de unde s-a oprit data trecută.", bildbeschreibung: "un semn de carte" },
  // ── Măiestrie (Glossar §2.4: „Măiestrie", nie „examen") ─────────────────
  "zehn-minuten-abschrift": { name: "Copierea de zece minute", description: "Zece minute de scris fără pauză, cu cel mult 0,5 % greșeli - exact ca la proba clasică de copiere.", bildbeschreibung: "un cronometru" },
  "lehrgangs-meister": { name: "Cursul stăpânit", description: (z) => `Toate lecțiile cursului terminate, fiecare cu trei stele (în total ${lektionenFuer(z.lernweg).length}).`, bildbeschreibung: "o tocă neagră de absolvent" },
  "goldene-tastatur": { name: "Tastatura de aur", description: "Toate tastele deblocate, toate tastele sigure - și o dată 160 de caractere pe minut cu o precizie de 98 %. Ultima medalie.", bildbeschreibung: "o medalie sportivă pe o panglică" },
  // ── Secrete ──────────────────────────────────────────────────────────────
  "gemuetliches-faultier": { name: "Leneșul tihnit", description: "Încet și bine, fără nicio greșeală - precizia contează mai mult decât viteza!", bildbeschreibung: "un leneș, animalul care stă agățat în copac" },
  "comeback-kaenguru": { name: "Saltul cangurului", description: "O rundă cu 3 stele imediat după o rundă cu o stea.", bildbeschreibung: "un cangur" },
  // Uhrzeiten in Worten - keine Zahl mit Punkt am Satzende (Falle 6).
  nachteule: { name: "Bufnița de noapte", description: "O rundă terminată după ora nouă seara.", bildbeschreibung: "o bufniță" },
  // „Cine se scoală de dimineață departe ajunge."
  "frueher-vogel": { name: "Cine se scoală de dimineață", description: "O rundă terminată înainte de ora șapte dimineața.", bildbeschreibung: "un cocoș" },
  nimmersatt: { name: "Foame de lectură", description: "3 părți dintr-o poveste citite într-o singură zi.", bildbeschreibung: "un măr verde" },
  "ferien-held": { name: "Vacanță la tastatură", description: "Exersare în mijlocul vacanței de vară - în iulie sau în august.", bildbeschreibung: "o plajă cu o umbrelă de soare" },
  "wochenend-schreiber": { name: "Scris de weekend", description: "Exersare sâmbăta și duminica.", bildbeschreibung: "o filă de calendar" },
  "zurueck-im-sattel": { name: "Înapoi în șa", description: (z) => `Exersare din nou după o pauză de peste ${ro(z.pauseTage, "zi", "zile", "de zile")} - și revenirea contează.`, bildbeschreibung: "două săgeți care se rotesc în cerc" },
  "doppelt-genaeht": { name: "De două ori curat", description: "Două runde fără greșeli, una imediat după alta.", bildbeschreibung: "un ac cu ață" },
  winterkind: { name: "Taste de iarnă", description: "Exersare în miezul iernii - în decembrie sau în ianuarie.", bildbeschreibung: "un om de zăpadă" },
  jahreswechsel: { name: "Revelion", description: "Exersare în ultima zi a anului sau în prima zi a anului nou.", bildbeschreibung: "artificii pe cerul nopții" },
  "tages-marathon": { name: "Maratonul unei zile", description: "Zece runde într-o singură zi.", bildbeschreibung: "o persoană pe un cal de curse" },
  sternentag: { name: "Zi înstelată", description: "Trei runde cu trei stele într-o singură zi.", bildbeschreibung: "un soare cu chip" },
  // „curățenie lună" - blitzblank, eine Wendung über die Sache.
  blitzsauber: { name: "Curățenie lună", description: "Trei runde fără greșeli într-o singură zi.", bildbeschreibung: "un săpun cu bule" },
  "volle-woche": { name: "Săptămână plină", description: "Exersare în cinci zile diferite din ACEEAȘI săptămână.", bildbeschreibung: "o carte verde" },
  // „Blindflug" ⇒ „Fără să te uiți" (Glossar Regel 4): zur Maimuță, die sich die Augen zuhält; nie „orb".
  blindflug: { name: "Fără să te uiți", description: "O rundă întreagă fără greșeli - cu tastatura de pe ecran ascunsă. Exact despre asta e scrierea cu zece degete.", bildbeschreibung: "o maimuță care își acoperă ochii cu mâinile" },
  sprachwechsler: { name: "Drum între limbi", description: "Exersare în două limbi - de exemplu în română și în engleză.", bildbeschreibung: "globul pământesc cu Europa și Africa" },
  lesenacht: { name: "Lectură de noapte", description: "O parte dintr-o poveste citită după ora opt seara.", bildbeschreibung: "o lună cu chip" },
  "zaehe-taste": { name: "Tasta încăpățânată", description: "O tastă care a fost mult timp grea e acum sigură.", bildbeschreibung: "un melc" },
  aufsteiger: { name: "Tot mai sus", description: "Cu cinci niveluri de dificultate mai sus decât la punctul de plecare.", bildbeschreibung: "un grafic cu o linie care urcă" },
  // ── Nur auf Weg „fr" (`badgesNurFr.ts`) - für eine rumänische Bedienung auf diesem Weg; dieselben Gedanken wie dort.
  "akzente-ziffernreihe": { name: "Acrobația accentelor", nameNeutral: "é, è, ç și à", description: "Literele é, è, ç și à deblocate - literele care stau pe șirul de cifre.", bildbeschreibung: "cifrele 1 2 3 4 pe o tastă albastră" },
  "accent-circonflexe": { name: "Pălăria mică", nameNeutral: "Accentul circumflex francez", description: "Tasta moartă ^ e sigură: ê, â, î, ô și û.", bildbeschreibung: "o pălărie de paie cu o panglică" },
  trema: { name: "Buburuza cu două puncte", nameNeutral: "Două puncte", description: "Tasta moartă ¨ e sigură: ë, ï și ü.", bildbeschreibung: "o buburuză" },
};
