/**
 * ★ O2-TASTATUR (30.10.2026): „TASTEN FINDEN" IN DEN NEUN SPRACHEN (bg el hu nl pt br ro sv uk).
 *
 * Die Tastennamen, Lagen und Treffer-Sätze der Sondertasten stehen schon in `tastenErklaerung<Xx>.ts`; hier kommen die Teile dazu,
 * die dort fehlen: der Auftrag zu einem ZEICHEN und die Nennung eines Zeichens im Satz. Dieselben Wörter wie in `suchSatz<Xx>`.
 * Bis hierher sagte die Runde auf diesen Wegen „Find A." (`mitRueckfallEn`).
 *
 * Regeln (Glossare, Regel 11): ein Zeichen steht hinter einem Kopfwort, das sich selbst beugt („буквата А", „літеру А"), damit der Name
 * ungebeugt bleibt. Eine Ziffer endet nie den Satz („цифрата 5 от реда с цифрите"), sonst läse die Stimme eine Ordnungszahl.
 * ⚠️ Ohne Muttersprachler-Lesung ([G]).
 */
import type { Plattform } from "../computer/model";
import type { TastenName } from "../computer/tastenNamen";
import type { GeruestSprache } from "./sprachRegister";
import { ANSAGE_UNBEKANNT_BG, ansageBestaetigtBg, ansageGefundenBg, ansageSuchauftragBg, tastenLageBg, tastenNennungBg } from "./tastenErklaerungBg";
import { ANSAGE_UNBEKANNT_EL, ansageBestaetigtEl, ansageGefundenEl, ansageSuchauftragEl, tastenLageEl, tastenNennungEl } from "./tastenErklaerungEl";
import { ANSAGE_UNBEKANNT_HU, alleGefundenHu, ansageBestaetigtHu, ansageGefundenHu, ansageSuchauftragHu, tastenLageHu, tastenNennungHu } from "./tastenErklaerungHu";
import { ANSAGE_UNBEKANNT_NL, alleGefundenNl, ansageBestaetigtNl, ansageGefundenNl, ansageSuchauftragNl, tastenLageNl, tastenNennungNl } from "./tastenErklaerungNl";
import { ANSAGE_UNBEKANNT_PT, alleGefundenPt, ansageBestaetigtPt, ansageGefundenPt, ansageSuchauftragPt, tastenLagePt, tastenNennungPt } from "./tastenErklaerungPt";
import { ANSAGE_UNBEKANNT_BR, alleGefundenBr, ansageBestaetigtBr, ansageGefundenBr, ansageSuchauftragBr, tastenLageBr, tastenNennungBr } from "./tastenErklaerungBr";
import { ANSAGE_UNBEKANNT_RO, alleGefundenRo, ansageBestaetigtRo, ansageGefundenRo, ansageSuchauftragRo, tastenLageRo, tastenNennungRo } from "./tastenErklaerungRo";
import { ANSAGE_UNBEKANNT_SV, alleGefundenSv, ansageBestaetigtSv, ansageGefundenSv, ansageSuchauftragSv, tastenLageSv, tastenNennungSv } from "./tastenErklaerungSv";
import { ANSAGE_UNBEKANNT_UK, ansageBestaetigtUk, ansageGefundenUk, ansageSuchauftragUk, tastenLageUk, tastenNennungUk } from "./tastenErklaerungUk";

type Fall = "akkusativ" | "nominativ" | "dativ";

/** Die Form der Tabelle `FINDEN_SAETZE` in `findenRunde.ts`. */
export interface FindenSaetzeNeun {
  finde: (ziel: string) => string;
  mit: (taste: string) => string;
  sonderNennung: (t: TastenName, fall: Fall, plattform: Plattform) => string;
  sonderNennungSchirm: (t: TastenName, plattform: Plattform) => string;
  sonderLage: (t: TastenName, plattform: Plattform) => string;
  sonderAuftrag: (t: TastenName, plattform: Plattform) => string;
  sonderGefunden: (t: TastenName, plattform: Plattform) => string;
  sonderBestaetigt: (t: TastenName, plattform: Plattform) => string;
  zeichenGefunden: (n: string) => string;
  zeichenBestaetigt: string;
  unbekannt: string;
  dasIst: (das: string, ziel: string, nachsatz: string) => string;
  fertig: (sitzt: string, anzahl: number) => string;
}

export const FINDEN_SAETZE_NEUN: Readonly<Record<GeruestSprache, FindenSaetzeNeun>> = {
  bg: {
    finde: (ziel) => `Намери ${ziel}.`,
    mit: (taste) => `Задръж клавиша ${taste}.`,
    sonderNennung: (t, _f, p) => tastenNennungBg(t, p),
    sonderNennungSchirm: (t, p) => tastenNennungBg(t, p),
    sonderLage: (t, p) => tastenLageBg(t, p),
    sonderAuftrag: (t, p) => ansageSuchauftragBg(t, p),
    sonderGefunden: (t, p) => ansageGefundenBg(t, p),
    sonderBestaetigt: (t, p) => ansageBestaetigtBg(t, p),
    zeichenGefunden: (n) => `Точно така! Натисни друг клавиш, после пак ${n}.`,
    zeichenBestaetigt: "Браво!",
    unbekannt: ANSAGE_UNBEKANNT_BG,
    dasIst: (das, ziel, nachsatz) => `Това е ${das}. Намери ${ziel}.${nachsatz}`,
    fertig: (sitzt, n) => `${sitzt} Намерени клавиши: ${n} от ${n}. Страхотно!`,
  },
  el: {
    finde: (ziel) => `Βρες ${ziel}.`,
    mit: (taste) => `Κράτα πατημένο το πλήκτρο ${taste}.`,
    sonderNennung: (t, _f, p) => tastenNennungEl(t, p),
    sonderNennungSchirm: (t, p) => tastenNennungEl(t, p),
    sonderLage: (t, p) => tastenLageEl(t, p),
    sonderAuftrag: (t, p) => ansageSuchauftragEl(t, p),
    sonderGefunden: (t, p) => ansageGefundenEl(t, p),
    sonderBestaetigt: (t, p) => ansageBestaetigtEl(t, p),
    zeichenGefunden: (n) => `Το βρήκες! Πάτησε ένα άλλο πλήκτρο και μετά ξανά ${n}.`,
    zeichenBestaetigt: "Μπράβο!",
    unbekannt: ANSAGE_UNBEKANNT_EL,
    dasIst: (das, ziel, nachsatz) => `Αυτό είναι ${das}. Βρες ${ziel}.${nachsatz}`,
    fertig: (sitzt, n) => `${sitzt} Βρέθηκαν όλα τα πλήκτρα: ${n} από ${n}.`,
  },
  hu: {
    finde: (ziel) => `Keresd meg ${ziel}.`,
    mit: (taste) => `Tartsd lenyomva ${/^[AEIOU]/.test(taste) ? "az" : "a"} ${taste} billentyűt.`,
    sonderNennung: (t, fall, p) => tastenNennungHu(t, p, fall === "nominativ" ? "alanyeset" : "targyeset"),
    sonderNennungSchirm: (t, p) => tastenNennungHu(t, p),
    sonderLage: (t, p) => tastenLageHu(t, p),
    sonderAuftrag: (t, p) => ansageSuchauftragHu(t, p),
    sonderGefunden: (t, p) => ansageGefundenHu(t, p),
    sonderBestaetigt: (t, p) => ansageBestaetigtHu(t, p),
    zeichenGefunden: (n) => `Megvan! Nyomj meg egy másik billentyűt, aztán újra ${n}.`,
    zeichenBestaetigt: "Sikerült!",
    unbekannt: ANSAGE_UNBEKANNT_HU,
    dasIst: (das, ziel, nachsatz) => `Ez ${das}. Keresd meg ${ziel}.${nachsatz}`,
    fertig: (sitzt, n) => `${sitzt} ${alleGefundenHu(n)}`,
  },
  nl: {
    finde: (ziel) => `Zoek ${ziel}.`,
    mit: (taste) => `Houd ${taste} ingedrukt.`,
    sonderNennung: (t, _f, p) => tastenNennungNl(t, p),
    sonderNennungSchirm: (t, p) => tastenNennungNl(t, p),
    sonderLage: (t, p) => tastenLageNl(t, p),
    sonderAuftrag: (t, p) => ansageSuchauftragNl(t, p),
    sonderGefunden: (t, p) => ansageGefundenNl(t, p),
    sonderBestaetigt: (t, p) => ansageBestaetigtNl(t, p),
    zeichenGefunden: (n) => `Gevonden! Druk op een andere toets en daarna nog eens op ${n}.`,
    zeichenBestaetigt: "Gelukt!",
    unbekannt: ANSAGE_UNBEKANNT_NL,
    dasIst: (das, ziel, nachsatz) => `Dat is ${das}. Zoek ${ziel}.${nachsatz}`,
    fertig: (sitzt, n) => `${sitzt} ${alleGefundenNl(n)}`,
  },
  pt: {
    finde: (ziel) => `Procura ${ziel}.`,
    mit: (taste) => `Mantém premida a tecla ${taste}.`,
    sonderNennung: (t, _f, p) => tastenNennungPt(t, p),
    sonderNennungSchirm: (t, p) => tastenNennungPt(t, p),
    sonderLage: (t, p) => tastenLagePt(t, p),
    sonderAuftrag: (t, p) => ansageSuchauftragPt(t, p),
    sonderGefunden: (t, p) => ansageGefundenPt(t, p),
    sonderBestaetigt: (t, p) => ansageBestaetigtPt(t, p),
    zeichenGefunden: (n) => `Está aqui! Prime outra tecla e depois, outra vez, ${n}.`,
    zeichenBestaetigt: "Certo!",
    unbekannt: ANSAGE_UNBEKANNT_PT,
    dasIst: (das, ziel, nachsatz) => `Premiste ${das}. Procura ${ziel}.${nachsatz}`,
    fertig: (sitzt, n) => `${sitzt} ${alleGefundenPt(n)}`,
  },
  br: {
    finde: (ziel) => `Encontre ${ziel}.`,
    mit: (taste) => `Mantenha pressionada a tecla ${taste}.`,
    sonderNennung: (t, _f, p) => tastenNennungBr(t, p),
    sonderNennungSchirm: (t, p) => tastenNennungBr(t, p),
    sonderLage: (t, p) => tastenLageBr(t, p),
    sonderAuftrag: (t, p) => ansageSuchauftragBr(t, p),
    sonderGefunden: (t, p) => ansageGefundenBr(t, p),
    sonderBestaetigt: (t, p) => ansageBestaetigtBr(t, p),
    zeichenGefunden: (n) => `Achou! Pressione outra tecla e depois ${n} de novo.`,
    zeichenBestaetigt: "Certo!",
    unbekannt: ANSAGE_UNBEKANNT_BR,
    dasIst: (das, ziel, nachsatz) => `Esta foi ${das}. Encontre ${ziel}.${nachsatz}`,
    fertig: (sitzt, n) => `${sitzt} ${alleGefundenBr(n)}`,
  },
  ro: {
    finde: (ziel) => `Caută ${ziel}.`,
    mit: (taste) => `Ține apăsată tasta ${taste}.`,
    sonderNennung: (t, _f, p) => tastenNennungRo(t, p),
    sonderNennungSchirm: (t, p) => tastenNennungRo(t, p),
    sonderLage: (t, p) => tastenLageRo(t, p),
    sonderAuftrag: (t, p) => ansageSuchauftragRo(t, p),
    sonderGefunden: (t, p) => ansageGefundenRo(t, p),
    sonderBestaetigt: (t, p) => ansageBestaetigtRo(t, p),
    zeichenGefunden: (n) => `Ai găsit-o! Apasă altă tastă, apoi din nou ${n}.`,
    zeichenBestaetigt: "Corect!",
    unbekannt: ANSAGE_UNBEKANNT_RO,
    dasIst: (das, ziel, nachsatz) => `Ai apăsat ${das}. Caută ${ziel}.${nachsatz}`,
    fertig: (sitzt, n) => `${sitzt} ${alleGefundenRo(n)}`,
  },
  sv: {
    finde: (ziel) => `Hitta ${ziel}.`,
    mit: (taste) => `Håll ned ${taste}.`,
    sonderNennung: (t, _f, p) => tastenNennungSv(t, p),
    sonderNennungSchirm: (t, p) => tastenNennungSv(t, p),
    sonderLage: (t, p) => tastenLageSv(t, p),
    sonderAuftrag: (t, p) => ansageSuchauftragSv(t, p),
    sonderGefunden: (t, p) => ansageGefundenSv(t, p),
    sonderBestaetigt: (t, p) => ansageBestaetigtSv(t, p),
    zeichenGefunden: (n) => `Där är den! Tryck på en annan tangent och sedan på ${n} en gång till.`,
    zeichenBestaetigt: "Rätt!",
    unbekannt: ANSAGE_UNBEKANNT_SV,
    dasIst: (das, ziel, nachsatz) => `Du tryckte på ${das}. Hitta ${ziel}.${nachsatz}`,
    fertig: (sitzt, n) => `${sitzt} ${alleGefundenSv(n)}`,
  },
  uk: {
    finde: (ziel) => `Знайди ${ziel}.`,
    mit: (taste) => `Утримуй клавішу ${taste}.`,
    sonderNennung: (t, _f, p) => tastenNennungUk(t, p),
    sonderNennungSchirm: (t, p) => tastenNennungUk(t, p),
    sonderLage: (t, p) => tastenLageUk(t, p),
    sonderAuftrag: (t, p) => ansageSuchauftragUk(t, p),
    sonderGefunden: (t, p) => ansageGefundenUk(t, p),
    sonderBestaetigt: (t, p) => ansageBestaetigtUk(t, p),
    zeichenGefunden: (n) => `Знайдено! Натисни іншу клавішу, а потім знову ${n}.`,
    zeichenBestaetigt: "Чудово!",
    unbekannt: ANSAGE_UNBEKANNT_UK,
    dasIst: (das, ziel, nachsatz) => `Це ${das}. Знайди ${ziel}.${nachsatz}`,
    fertig: (sitzt, n) => `${sitzt} Знайдено всі клавіші: ${n}/${n}.`,
  },
};

/** „az" oder „a" - nach der Aussprache des Namens oder der Ziffer (1 egy, 5 öt). */
const azHu = (k: string): string => (/^[AEIOUÁÉÍÓÖŐÚÜŰaeiouáéíóöőúüű15]/.test(k) ? "az" : "a");

/** Wie ein Zeichen im Satz heisst: Buchstabe (`n` = wie auf der Kappe), Ziffer (das Zeichen selbst), sonstiges Zeichen (`n` = sein Name). */
export const ZEICHEN_IM_SATZ_NEUN: Readonly<
  Record<GeruestSprache, { buchstabe: (n: string, nom: boolean) => string; ziffer: (z: string, nom: boolean) => string; zeichen: (n: string, nom: boolean) => string }>
> = {
  bg: {
    buchstabe: (n) => `буквата ${n}`,
    ziffer: (z) => `цифрата ${z} от реда с цифрите`,
    zeichen: (n) => (n.startsWith("знак") ? n : `знака ${n}`),
  },
  el: {
    buchstabe: (n) => `το γράμμα ${n}`,
    ziffer: (z) => `το ψηφίο ${z} στη σειρά αριθμών`,
    zeichen: (n) => `το σύμβολο ${n}`,
  },
  hu: {
    buchstabe: (n, nom) => `${azHu(n)} ${n} ${nom ? "betű" : "betűt"}`,
    ziffer: (z, nom) => `${azHu(z)} ${z} ${nom ? "számjegy" : "számjegyet"} a számsorban`,
    zeichen: (n, nom) => `${azHu(n)} ${n} ${nom ? "jel" : "jelet"}`,
  },
  nl: {
    buchstabe: (n) => `de letter ${n}`,
    ziffer: (z) => `het cijfer ${z} op de cijferrij`,
    zeichen: (n) => `het teken ${n}`,
  },
  pt: {
    buchstabe: (n) => `a letra ${n}`,
    ziffer: (z) => `o algarismo ${z} na fila dos números`,
    zeichen: (n) => `o sinal ${n}`,
  },
  br: {
    buchstabe: (n) => `a letra ${n}`,
    ziffer: (z) => `o algarismo ${z} na fileira dos números`,
    zeichen: (n) => `o sinal ${n}`,
  },
  ro: {
    buchstabe: (n) => `litera ${n}`,
    ziffer: (z) => `cifra ${z} de pe șirul de cifre`,
    zeichen: (n) => `semnul ${n}`,
  },
  sv: {
    buchstabe: (n) => `bokstaven ${n}`,
    ziffer: (z) => `siffran ${z} på sifferraden`,
    zeichen: (n) => `tecknet ${n}`,
  },
  uk: {
    buchstabe: (n, nom) => `${nom ? "літера" : "літеру"} ${n}`,
    ziffer: (z, nom) => `${nom ? "цифра" : "цифру"} ${z} у ряду цифр`,
    zeichen: (n) => (n.startsWith("знак") ? n : `знак ${n}`),
  },
};
