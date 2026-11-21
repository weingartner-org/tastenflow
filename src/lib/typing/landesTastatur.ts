/**
 * ★ G2b-2 (02.10.2026): „die Tastatur seines Landes" - das Eigenschaftswort der Sprache
 * eines Lehrgangs, für den Satz „Dieser Lehrgang lehrt die Tastatur seines Landes - darum
 * stehen nur ___ Tastaturen zur Wahl" (Einrichtung, Zahnrad).
 *
 * Bis hierher stand dort `weg === "fr" ? "französische" : "spanische"`: eine Entscheidung
 * zwischen ZWEI Sprachen an der Kennung. Die dritte Hauptsprache hätte „spanische"
 * geheissen (Falle 50). Jetzt ist es eine Tabelle über ALLE Sprachen - `Record<Lang, …>`
 * zwingt `tsc`, bei jeder neuen Sprache einen Eintrag zu schreiben, und ein Wert, der
 * nicht darin steht, wirft (nie still „spanisch").
 *
 * Je Bedienungssprache die Form, die in den Satz passt (Mehrzahl, Fall der Sprache):
 * de „französische Tastaturen", en „French keyboards", fr „claviers français", es
 * „teclados franceses"; seit O2-TASTATUR hat jede der siebzehn Bedienungen ihre eigene Tabelle.
 */
import type { Lang } from "./account";

type Tabelle = Readonly<Record<Lang, string>>;

const DE: Tabelle = {
  de: "deutsche",
  en: "englische",
  fr: "französische",
  es: "spanische",
  it: "italienische",
  pl: "polnische",
  tr: "türkische",
  cs: "tschechische",
  // ★ G2-NEUN (25.10.2026): echte Werte.
  bg: "bulgarische",
  el: "griechische",
  hu: "ungarische",
  nl: "niederländische",
  pt: "portugiesische",
  br: "brasilianische",
  ro: "rumänische",
  sv: "schwedische",
  uk: "ukrainische",
};
const EN: Tabelle = {
  de: "German",
  en: "English",
  fr: "French",
  es: "Spanish",
  it: "Italian",
  pl: "Polish",
  tr: "Turkish",
  cs: "Czech",
  // ★ G2-NEUN (25.10.2026): echte Werte.
  bg: "Bulgarian",
  el: "Greek",
  hu: "Hungarian",
  nl: "Dutch",
  pt: "Portuguese",
  br: "Brazilian",
  ro: "Romanian",
  sv: "Swedish",
  uk: "Ukrainian",
};
const FR: Tabelle = {
  de: "allemands",
  en: "anglais",
  fr: "français",
  es: "espagnols",
  it: "italiens",
  pl: "polonais",
  tr: "turcs",
  cs: "tchèques",
  // ★ G2-NEUN (25.10.2026): echte Werte.
  bg: "bulgares",
  el: "grecs",
  hu: "hongrois",
  nl: "néerlandais",
  pt: "portugais",
  br: "brésiliens",
  ro: "roumains",
  sv: "suédois",
  uk: "ukrainiens",
};
const ES: Tabelle = {
  de: "alemanes",
  en: "ingleses",
  fr: "franceses",
  // Spanisch ist hier mehr als „españoles": der Weg lehrt Spanien UND Lateinamerika.
  es: "de España y de Latinoamérica",
  it: "italianos",
  pl: "polacos",
  tr: "turcos",
  cs: "checos",
  // ★ G2-NEUN (25.10.2026): echte Werte.
  bg: "búlgaros",
  el: "griegos",
  hu: "húngaros",
  nl: "neerlandeses",
  pt: "portugueses",
  br: "brasileños",
  ro: "rumanos",
  sv: "suecos",
  uk: "ucranianos",
};

// ★ O-IT (02.10.2026): „tastiere italiane" - weiblich Mehrzahl, nach „solo tastiere …".
const IT: Tabelle = {
  de: "tedesche",
  en: "inglesi",
  fr: "francesi",
  es: "spagnole e latinoamericane",
  it: "italiane",
  pl: "polacche",
  tr: "turche",
  cs: "ceche",
  // ★ G2-NEUN (25.10.2026): echte Werte.
  bg: "bulgare",
  el: "greche",
  hu: "ungheresi",
  nl: "olandesi",
  pt: "portoghesi",
  br: "brasiliane",
  ro: "rumene",
  sv: "svedesi",
  uk: "ucraine",
};

// ★ O-PL (02.10.2026): „klawiatury polskie" - Nominativ Mehrzahl, nach „tylko klawiatury …".
const PL: Tabelle = {
  de: "niemieckie",
  en: "angielskie",
  fr: "francuskie",
  es: "hiszpańskie i latynoamerykańskie",
  it: "włoskie",
  pl: "polskie",
  tr: "tureckie",
  cs: "czeskie",
  // ★ G2-NEUN (25.10.2026): echte Werte.
  bg: "bułgarskie",
  el: "greckie",
  hu: "węgierskie",
  nl: "niderlandzkie",
  pt: "portugalskie",
  br: "brazylijskie",
  ro: "rumuńskie",
  sv: "szwedzkie",
  uk: "ukraińskie",
};

// ★ O-TR (02.10.2026): "yalnızca Türkçe klavyeler" - Sprachname vor "klavyeler", ohne Endung.
const TR: Tabelle = {
  de: "Almanca",
  en: "İngilizce",
  fr: "Fransızca",
  es: "İspanyolca (İspanya ve Latin Amerika)",
  it: "İtalyanca",
  pl: "Lehçe",
  tr: "Türkçe",
  cs: "Çekçe",
  // ★ G2-NEUN (25.10.2026): echte Werte.
  bg: "Bulgarca",
  el: "Yunanca",
  hu: "Macarca",
  nl: "Felemenkçe",
  pt: "Portekizce (Portekiz)",
  br: "Portekizce (Brezilya)",
  ro: "Rumence",
  sv: "İsveççe",
  uk: "Ukraynaca",
};

// ★ O-CS (03.10.2026): „jen české klávesnice" - Nominativ Mehrzahl weiblich, vor „klávesnice".
const CS: Tabelle = {
  de: "německé",
  en: "anglické",
  fr: "francouzské",
  es: "španělské a latinskoamerické",
  it: "italské",
  pl: "polské",
  tr: "turecké",
  cs: "české",
  // ★ G2-NEUN (25.10.2026): echte Werte.
  bg: "bulharské",
  el: "řecké",
  hu: "maďarské",
  nl: "nizozemské",
  pt: "portugalské",
  br: "brazilské",
  ro: "rumunské",
  sv: "švédské",
  uk: "ukrajinské",
};

/**
 * ★ O2-TASTATUR (30.10.2026): die neun Bedienungen, je die Form für den Satz in `Einrichtung.tsx`/`TypingSettings.tsx`: bg Mehrzahl
 * („френски клавиатури"), el Neutrum Mehrzahl („γαλλικά πληκτρολόγια"), hu unverändert („francia billentyűzetek"), nl mit -e, pt/br
 * männlich Mehrzahl („teclados franceses"; pt polacos/checos/neerlandeses, br poloneses/tchecos/holandeses), ro weiblich Mehrzahl
 * („tastaturi franceze"), sv Mehrzahl („franska tangentbord"), uk Mehrzahl. Ohne Muttersprachler-Lesung.
 */
const BG: Tabelle = { de: "немски", en: "английски", fr: "френски", es: "испански", it: "италиански", pl: "полски", tr: "турски", cs: "чешки", bg: "български", el: "гръцки", hu: "унгарски", nl: "нидерландски", pt: "португалски", br: "бразилски", ro: "румънски", sv: "шведски", uk: "украински" };
const EL: Tabelle = { de: "γερμανικά", en: "αγγλικά", fr: "γαλλικά", es: "ισπανικά", it: "ιταλικά", pl: "πολωνικά", tr: "τουρκικά", cs: "τσεχικά", bg: "βουλγαρικά", el: "ελληνικά", hu: "ουγγρικά", nl: "ολλανδικά", pt: "πορτογαλικά", br: "βραζιλιάνικα", ro: "ρουμανικά", sv: "σουηδικά", uk: "ουκρανικά" };
const HU: Tabelle = { de: "német", en: "angol", fr: "francia", es: "spanyol", it: "olasz", pl: "lengyel", tr: "török", cs: "cseh", bg: "bolgár", el: "görög", hu: "magyar", nl: "holland", pt: "portugál", br: "brazil", ro: "román", sv: "svéd", uk: "ukrán" };
const NL: Tabelle = { de: "Duitse", en: "Engelse", fr: "Franse", es: "Spaanse", it: "Italiaanse", pl: "Poolse", tr: "Turkse", cs: "Tsjechische", bg: "Bulgaarse", el: "Griekse", hu: "Hongaarse", nl: "Nederlandse", pt: "Portugese", br: "Braziliaanse", ro: "Roemeense", sv: "Zweedse", uk: "Oekraïense" };
const PT: Tabelle = { de: "alemães", en: "ingleses", fr: "franceses", es: "espanhóis", it: "italianos", pl: "polacos", tr: "turcos", cs: "checos", bg: "búlgaros", el: "gregos", hu: "húngaros", nl: "neerlandeses", pt: "portugueses", br: "brasileiros", ro: "romenos", sv: "suecos", uk: "ucranianos" };
const BR: Tabelle = { de: "alemães", en: "ingleses", fr: "franceses", es: "espanhóis", it: "italianos", pl: "poloneses", tr: "turcos", cs: "tchecos", bg: "búlgaros", el: "gregos", hu: "húngaros", nl: "holandeses", pt: "portugueses", br: "brasileiros", ro: "romenos", sv: "suecos", uk: "ucranianos" };
const RO: Tabelle = { de: "germane", en: "englezești", fr: "franceze", es: "spaniole", it: "italiene", pl: "poloneze", tr: "turcești", cs: "cehe", bg: "bulgărești", el: "grecești", hu: "maghiare", nl: "olandeze", pt: "portugheze", br: "braziliene", ro: "românești", sv: "suedeze", uk: "ucrainene" };
const SV: Tabelle = { de: "tyska", en: "engelska", fr: "franska", es: "spanska", it: "italienska", pl: "polska", tr: "turkiska", cs: "tjeckiska", bg: "bulgariska", el: "grekiska", hu: "ungerska", nl: "nederländska", pt: "portugisiska", br: "brasilianska", ro: "rumänska", sv: "svenska", uk: "ukrainska" };
const UK: Tabelle = { de: "німецькі", en: "англійські", fr: "французькі", es: "іспанські", it: "італійські", pl: "польські", tr: "турецькі", cs: "чеські", bg: "болгарські", el: "грецькі", hu: "угорські", nl: "нідерландські", pt: "португальські", br: "бразильські", ro: "румунські", sv: "шведські", uk: "українські" };

export const TASTATUR_DES_LANDES: Readonly<Record<Lang, Tabelle>> = { de: DE, en: EN, fr: FR, es: ES, it: IT, pl: PL, tr: TR, cs: CS, bg: BG, el: EL, hu: HU, nl: NL, pt: PT, br: BR, ro: RO, sv: SV, uk: UK };

/**
 * Das Eigenschaftswort für die Tastaturen der Sprache `weg`, in der Sprache der Bedienung.
 * Wirft bei einem Wert, den es nicht gibt (Falle 50).
 */
export function tastaturDesLandes(bedienung: Lang, weg: Lang): string {
  const tabelle = TASTATUR_DES_LANDES[bedienung];
  if (!Object.hasOwn(tabelle, weg)) {
    throw new Error(`Keine Tastatur-Bezeichnung für die Sprache ${JSON.stringify(weg)}`);
  }
  return tabelle[weg];
}
