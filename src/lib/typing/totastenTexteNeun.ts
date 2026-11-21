/**
 * ★ O2-TASTATUR (30.10.2026): DIE OBERFLÄCHENTEXTE RUND UM DIE TOTASTEN IN DEN NEUN SPRACHEN - dieselben Tabellen wie in
 * `totastenTexte.ts`, je Sprache eine Zeile dort. Die Namen wie in `zeichenNamen<Xx>.ts` (Glossare §2.8); „Totaste" nach Glossar §2.1
 * (мъртъв клавиш, νεκρό πλήκτρο, holtbillentyű, dode toets, tecla de acento, tastă moartă, död tangent, мертва клавіша).
 * Tastennamen mit Kopfwort (Regel 11). Bulgarisch, Ungarisch, Rumänisch und Ukrainisch lehren auf ihrer Heim-Tastatur keine Akzent-Totaste -
 * die Sätze gelten dort für fremde Tastaturen im selben Weg. ⚠️ Ohne Muttersprachler-Lesung ([G]).
 */
import type { GeruestSprache } from "./sprachRegister";

export const FESTSTELLTASTE_NEUN: Readonly<Record<GeruestSprache, { hinweis: string }>> = {
  bg: { hinweis: "Клавишът Caps Lock е включен." },
  el: { hinweis: "Το πλήκτρο Caps Lock είναι ενεργό." },
  hu: { hinweis: "A Caps Lock be van kapcsolva." },
  nl: { hinweis: "Caps Lock staat aan." },
  pt: { hinweis: "A tecla Caps Lock está ligada." },
  br: { hinweis: "A tecla Caps Lock está ligada." },
  ro: { hinweis: "Tasta Caps Lock este activată." },
  sv: { hinweis: "Caps Lock är på." },
  uk: { hinweis: "Клавіша Caps Lock увімкнена." },
};

export const UMSCHALT_VOR_TILDE_NEUN: Readonly<Record<GeruestSprache, { hinweis: string }>> = {
  bg: { hinweis: "Първо клавиша ´ без клавиша Shift, после буквата." },
  el: { hinweis: "Πρώτα το πλήκτρο ´ χωρίς το πλήκτρο Shift, μετά το γράμμα." },
  hu: { hinweis: "Először a ´ billentyű a Shift billentyű nélkül, utána a betű." },
  nl: { hinweis: "Eerst de toets ´ zonder Shift, daarna de letter." },
  pt: { hinweis: "Primeiro a tecla de acento ´ sem a tecla Shift, depois a letra." },
  br: { hinweis: "Primeiro a tecla de acento ´ sem a tecla Shift, depois a letra." },
  ro: { hinweis: "Mai întâi tasta ´ fără tasta Shift, apoi litera." },
  sv: { hinweis: "Först tangenten ´ utan Skift, sedan bokstaven." },
  uk: { hinweis: "Спочатку клавіша ´ без клавіші Shift, потім літера." },
};

/** Die Totasten-Namen (`^ ¨ \` ¸ ˇ`) - Form wie `T_TOTASTE_NAME`. */
export const TOTASTE_NAME_NEUN: Readonly<Record<GeruestSprache, { "^": string; "¨": string; "`": string; "¸": string; "ˇ": string }>> = {
  bg: { "^": "колибка", "¨": "две точки", "`": "обратен апостроф", "¸": "седила", "ˇ": "карон" },
  el: { "^": "καπελάκι", "¨": "διαλυτικά", "`": "βαρεία", "¸": "υπογεγραμμένη", "ˇ": "ανάποδο καπελάκι" },
  hu: { "^": "kalap", "¨": "két pont", "`": "tompa ékezet", "¸": "cedille", "ˇ": "hacsek" },
  nl: { "^": "dakje", "¨": "trema", "`": "accent grave", "¸": "cedille", "ˇ": "haček" },
  pt: { "^": "acento circunflexo", "¨": "trema", "`": "acento grave", "¸": "cedilha", "ˇ": "caron" },
  br: { "^": "acento circunflexo", "¨": "trema", "`": "acento grave", "¸": "cedilha", "ˇ": "caron" },
  ro: { "^": "accent circumflex", "¨": "două puncte deasupra", "`": "accent grav", "¸": "sedilă", "ˇ": "caron" },
  sv: { "^": "cirkumflex", "¨": "trema", "`": "grav accent", "¸": "cedilj", "ˇ": "hake" },
  uk: { "^": "циркумфлекс", "¨": "дві крапки", "`": "гравіс", "¸": "седиль", "ˇ": "гачек" },
};

/** Die Totasten, die erst mit den neun Sprachen kamen, in deren eigener Bedienung - Form wie `T_TOTASTE_NAME_NEU`. */
export const TOTASTE_NAME_NEU_NEUN: Readonly<
  Record<GeruestSprache, { "΄": string; "΅": string; "'": string; "\"": string; "˘": string; "˝": string; "˛": string; "˙": string }>
> = {
  bg: { "΄": "тонос", "΅": "диалитика с тонос", "'": "клавиш за остро ударение апостроф", "\"": "клавиш за две точки кавички", "˘": "бреве", "˝": "двойно остро ударение", "˛": "огонек", "˙": "точка отгоре" },
  el: { "΄": "τόνος", "΅": "διαλυτικά και τόνος", "'": "πλήκτρο οξείας απόστροφος", "\"": "πλήκτρο διαλυτικών εισαγωγικά", "˘": "βραχεία", "˝": "διπλή οξεία", "˛": "ογκόνεκ", "˙": "τελεία πάνω" },
  hu: { "΄": "tonosz", "΅": "dialütika tonosszal", "'": "éles ékezet billentyű, aposztróf", "\"": "két pont billentyű, idézőjel", "˘": "rövidségjel", "˝": "kettős éles ékezet", "˛": "ogonek", "˙": "pont felül" },
  nl: { "΄": "tonos", "΅": "dialytika met tonos", "'": "dode toets apostrof", "\"": "dode toets aanhalingsteken", "˘": "boogje", "˝": "dubbel accent aigu", "˛": "ogonek", "˙": "punt erboven" },
  pt: { "΄": "tonos", "΅": "dialitika com tonos", "'": "tecla de acento apóstrofo", "\"": "tecla de acento aspas", "˘": "bráquia", "˝": "duplo agudo", "˛": "ogonek", "˙": "ponto em cima" },
  br: { "΄": "tonos", "΅": "dialitika com tonos", "'": "tecla de acento apóstrofo", "\"": "tecla de acento aspas", "˘": "bráquia", "˝": "duplo agudo", "˛": "ogonek", "˙": "ponto em cima" },
  ro: { "΄": "tonos", "΅": "dialitika cu tonos", "'": "tastă moartă apostrof", "\"": "tastă moartă ghilimele", "˘": "căciulă", "˝": "accent ascuțit dublu", "˛": "ogonek", "˙": "punct deasupra" },
  sv: { "΄": "tonos", "΅": "dialytika med tonos", "'": "död tangent apostrof", "\"": "död tangent citattecken", "˘": "breve", "˝": "dubbel akut", "˛": "ogonek", "˙": "punkt över" },
  uk: { "΄": "тонос", "΅": "діалітика з тоносом", "'": "мертва клавіша апостроф", "\"": "мертва клавіша лапки", "˘": "бреве", "˝": "подвійний акут", "˛": "огонек", "˙": "крапка вгорі" },
};

export const ZWEI_SCHRITTE_NEUN: Readonly<Record<GeruestSprache, { satz: (totName: string, dann: string) => string }>> = {
  bg: { satz: (t, d) => `${t}, после ${d}` },
  el: { satz: (t, d) => `${t}, μετά ${d}` },
  hu: { satz: (t, d) => `${t}, utána ${d}` },
  nl: { satz: (t, d) => `${t}, dan ${d}` },
  pt: { satz: (t, d) => `${t}, depois ${d}` },
  br: { satz: (t, d) => `${t}, depois ${d}` },
  ro: { satz: (t, d) => `${t}, apoi ${d}` },
  sv: { satz: (t, d) => `${t}, sedan ${d}` },
  uk: { satz: (t, d) => `${t}, потім ${d}` },
};

/** „Tonos wartet" - gemessen: Windows und NVDA sagen beim Drücken einer Totaste nichts. Der Name als Subjekt, das Verb im Präsens. */
export const TOTASTE_WARTET_NEUN: Readonly<Record<GeruestSprache, { akut: string; unbekannt: string; satz: (name: string) => string }>> = {
  bg: { akut: "остро ударение", unbekannt: "ударение", satz: (n) => `${n} чака` },
  el: { akut: "τόνος", unbekannt: "σημάδι", satz: (n) => `${n}: σε αναμονή` },
  hu: { akut: "éles ékezet", unbekannt: "ékezet", satz: (n) => `${n}: várakozik` },
  nl: { akut: "accent aigu", unbekannt: "accent", satz: (n) => `${n} wacht` },
  pt: { akut: "acento agudo", unbekannt: "acento", satz: (n) => `${n} à espera` },
  br: { akut: "acento agudo", unbekannt: "acento", satz: (n) => `${n} aguardando` },
  ro: { akut: "accent ascuțit", unbekannt: "accent", satz: (n) => `${n} așteaptă` },
  sv: { akut: "akut accent", unbekannt: "accent", satz: (n) => `${n} väntar` },
  uk: { akut: "акут", unbekannt: "знак", satz: (n) => `${n}: очікує` },
};

export const TILDE_NEUN: Readonly<Record<GeruestSprache, { name: string }>> = {
  bg: { name: "вълничка" },
  el: { name: "περισπωμένη" },
  hu: { name: "hullámvonal" },
  nl: { name: "tilde" },
  pt: { name: "til" },
  br: { name: "til" },
  ro: { name: "tildă" },
  sv: { name: "tilde" },
  uk: { name: "тильда" },
};

/** Der Hinweis zum Weg eines AltGr-Buchstabens - Form wie `T_ALTGR_BUCHSTABE`. */
export const ALTGR_BUCHSTABE_NEUN: Readonly<
  Record<GeruestSprache, { hinweis: (zeichen: string, alt: string, taste: string) => string; alt: string; option: string; shift: string }>
> = {
  bg: { hinweis: (z, a, t) => `Буквата ${z}: ${a} + клавиш ${t}.`, alt: "десен Alt (AltGr)", option: "клавиш Option", shift: "Shift" },
  el: { hinweis: (z, a, t) => `Το γράμμα ${z}: ${a} + πλήκτρο ${t}.`, alt: "δεξί Alt (Alt Gr)", option: "πλήκτρο Option", shift: "Shift" },
  hu: { hinweis: (z, a, t) => `${z} betű: ${a} + ${t} billentyű.`, alt: "jobb Alt (AltGr)", option: "Option billentyű", shift: "Shift" },
  nl: { hinweis: (z, a, t) => `Letter ${z}: ${a} + toets ${t}.`, alt: "rechter Alt (Alt Gr)", option: "Option-toets", shift: "Shift" },
  pt: { hinweis: (z, a, t) => `Letra ${z}: ${a} + tecla ${t}.`, alt: "Alt direita (Alt Gr)", option: "tecla Option", shift: "Shift" },
  br: { hinweis: (z, a, t) => `Letra ${z}: ${a} + tecla ${t}.`, alt: "Alt direita (Alt Gr)", option: "tecla Option", shift: "Shift" },
  ro: { hinweis: (z, a, t) => `Litera ${z}: ${a} + tasta ${t}.`, alt: "Alt din dreapta (Alt Gr)", option: "tasta Option", shift: "Shift" },
  sv: { hinweis: (z, a, t) => `Bokstaven ${z}: ${a} + tangenten ${t}.`, alt: "höger Alt (Alt Gr)", option: "Option-tangenten", shift: "Skift" },
  uk: { hinweis: (z, a, t) => `Літера ${z}: ${a} + клавіша ${t}.`, alt: "правий Alt (AltGr)", option: "клавіша Option", shift: "Shift" },
};
