/**
 * ════════════════════════════════════════════════════════════════════════════
 * DIE VERÄNDERUNG GEGENÜBER DEM ZEITRAUM DAVOR (01.09.2026)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Johannes: *„nimm die veränderung zur vorwoche in die tabelle einfach dabei,
 * nicht neue spalten, zB Treffsicherheit 95% und daneben einen Pfeil nach
 * schräg nach oben, gerade oder schräg nach unten. das gleiche auch bei geschw.
 * und wenn die maus darüber kommt kurze erklärung (auch für braille)."*
 *
 * Damit kommt zurück, was mit dem Wochenstreifen verloren ging - aber in der
 * Zeile, nicht in einer zweiten Tabelle.
 *
 * ── ★★★ WARUM ES EINE TOTZONE GIBT ─────────────────────────────────────────
 * Ohne sie zeigte die Tabelle bei 94,6 % gegen 94,4 % einen Pfeil nach oben.
 * Das ist kein Fortschritt, das ist Rauschen - und es ist schädlicher als kein
 * Pfeil: Wer jede Woche einen Pfeil sieht, liest bald keinen mehr. Die Grenzen
 * unten sind bewusst grob gewählt; sie sollen eine ENTWICKLUNG zeigen, keine
 * Messschwankung.
 *
 * ── ★★★ WARUM „WENIGER" NICHT „SCHLECHT" HEISST ────────────────────────────
 * Der Pfeil nach unten ist ein Hinweis, keine Bewertung, und er wird auch nicht
 * so eingefärbt. Wer in einer Woche schwierigere Texte bekommt, wird langsamer
 * und ungenauer - das ist Lernen, nicht Nachlassen. Farbe würde daraus ein
 * Urteil machen, und Urteile über ein Kind stehen dieser Tabelle nicht zu
 * ([[feedback_nie_gegen_das_kind]]). Der Pfeil trägt darum die Textfarbe des
 * Hauses; unterschieden wird an der RICHTUNG, nicht am Farbton (WCAG 1.4.1).
 *
 * ── ⚠️ Der Pfeil ist nie das einzige Zeichen ───────────────────────────────
 * „↗" allein ist auf einer Braillezeile ein unbekanntes Zeichen. Jeder Pfeil
 * trägt darum den ganzen Satz mit (siehe {@link veraenderungSatz}); das Zeichen
 * selbst ist `aria-hidden`.
 */

import type { TaskEvent } from "./account";
import { isoWeekKey } from "./goals";
import { zeilenTempoPlausibel } from "./zeilenzeit";
import {
  SCORE_ERKLAERUNG_SIE,
  SCORE_ERKLAERUNG_SIE_EN,
  SCORE_ERKLAERUNG_VOUS_FR,
  SCORE_ERKLAERUNG_USTED_ES,
  SCORE_ERKLAERUNG_IT_INSEGNANTE,
  SCORE_ERKLAERUNG_PL_NAUCZYCIELE,
  SCORE_ERKLAERUNG_TR_OGRETMEN,
  SCORE_ERKLAERUNG_CS_VYUCUJICI,
  scoreAusWerten,
} from "./score";
import type { BedienSprache } from "../bedienSprache/sprache";
import { MIND_ZEICHEN_WERTUNG } from "./schreibprobeWertung";
import { prozentMitZeichen } from "./sprachRegister";
import { mehrzahl } from "../bedienSprache/texte";
import { istGeruestSprache } from "./sprachRegister";
import { KETTEN_NEUN } from "./kettenNeun";
import { GEBIET } from "../bedienSprache/texte";

/** Um welche Zahl es geht - entscheidet über Totzone und Wortwahl. */
export type Groesse = "treffer" | "tempo" | "score";

export type Richtung = "hoch" | "gleich" | "runter";

export interface Veraenderung {
  richtung: Richtung;
  /** Der Unterschied in der Einheit der Grösse (Prozentpunkte bzw. Anschläge). */
  differenz: number;
}

/**
 * Ab hier ist es eine Entwicklung und keine Schwankung mehr.
 *
 * Treffsicherheit: 1 Prozentpunkt. Bei 40 geübten Zeilen sind das rund sechs
 * Anschläge Unterschied - darunter entscheidet der Zufall des Tages.
 *
 * Tempo: 5 Anschläge je Minute. Das ist etwa ein Wort mehr in der Minute; für
 * Lernende am Anfang, die zwischen 60 und 200 liegen, eine merkliche Stufe.
 *
 * ★ Score (B2, 11.09.2026): 2 Punkte. Er ist aus beiden Grössen zusammengesetzt
 * (`100 × Güte × Wurzel(Tempo/240)`), und die Totzonen darin schlagen auf ihn
 * durch: 1 Prozentpunkt Treffsicherheit bewegt ihn bei 95 % um rund 1,4 Punkte,
 * 5 Anschläge bei 120 um rund 1,6. Ein Punkt wäre also noch die Schwankung der
 * beiden Einzelwerte; zwei sind die erste Bewegung, die keiner von beiden
 * allein erklärt.
 */
const TOTZONE: Record<Groesse, number> = { treffer: 1, tempo: 5, score: 2 };

/**
 * Die Veränderung zweier Werte. `null`, wenn es keinen Vergleich GIBT - also
 * wenn im Zeitraum davor nicht geübt wurde oder es keinen Zeitraum davor gibt
 * („Gesamt").
 *
 * ⚠️ Ein fehlender Vorwert ist nicht null. Wer vorige Woche nicht da war, ist
 * nicht „von 0 auf 95 gestiegen" - er hat vorige Woche nicht geübt, und genau
 * das gehört dagestanden ([[feedback_zusammenfassung_ist_kein_beleg]]).
 */
export function veraenderung(
  jetzt: number | null,
  vorher: number | null,
  groesse: Groesse,
): Veraenderung | null {
  if (jetzt === null || vorher === null) return null;
  const d = jetzt - vorher;
  if (Math.abs(d) < TOTZONE[groesse]) return { richtung: "gleich", differenz: d };
  return { richtung: d > 0 ? "hoch" : "runter", differenz: d };
}

/** Das Zeichen - schräg hoch, gerade, schräg runter (Johannes' Beschreibung). */
export const PFEIL: Record<Richtung, string> = {
  hoch: "↗",
  gleich: "→",
  runter: "↘",
};

/**
 * Der Satz, den Maus-Hinweis und Braillezeile tragen. Er nennt IMMER drei
 * Dinge: was verglichen wird, womit, und wie gross der Unterschied ist. Ein
 * „besser" ohne Zahl wäre eine Wertung ohne Beleg.
 */
export function veraenderungSatz(
  v: Veraenderung,
  groesse: Groesse,
  vergleichsName: string,
  /**
   * ★ EN3 (19.09.2026): die Bedienungssprache. Ohne Angabe Deutsch. ⚠️ Der
   * `vergleichsName` kommt vom Aufrufer und muss in DERSELBEN Sprache sein -
   * englisch so, dass er hinter „than in …" / „compared with …" passt:
   * *the week before*, *school year 2025/26*, *the week of 10 Aug*.
   */
  sprache: BedienSprache = "de",
): string {
  // ★ O-CS (03.10.2026)
  // ★ O4 (30.10.2026): die neun eigen, Texte in `ketten<Xx>.ts`.
  if (istGeruestSprache(sprache)) {
    const k = KETTEN_NEUN[sprache];
    const roh = Math.abs(v.differenz);
    const n = groesse === "treffer" ? Math.round(roh * 10) / 10 : Math.round(roh);
    const zahl = `${n.toLocaleString(GEBIET[sprache])} ${k.einheit(groesse, n)}`;
    const satz = v.richtung === "gleich" ? k.satzGleich : v.richtung === "hoch" ? k.satzHoch : k.satzNiedrig;
    return punkt(satz(k.was[groesse], zahl, vergleichsName));
  }
  if (sprache === "cs") return veraenderungSatzCs(v, groesse, vergleichsName);
  if (sprache === "tr") return veraenderungSatzTr(v, groesse, vergleichsName);
  if (sprache === "pl") return veraenderungSatzPl(v, groesse, vergleichsName);
  if (sprache === "it") return veraenderungSatzIt(v, groesse, vergleichsName);
  if (sprache === "fr") return veraenderungSatzFr(v, groesse, vergleichsName);
  if (sprache === "es") return veraenderungSatzEs(v, groesse, vergleichsName);
  if (sprache === "en") return veraenderungSatzEn(v, groesse, vergleichsName);
  const einheit =
    groesse === "treffer"
      ? "Prozentpunkte"
      : groesse === "score"
        ? "Punkte"
        : "Anschläge je Minute";
  const einzahl =
    groesse === "treffer"
      ? "Prozentpunkt"
      : groesse === "score"
        ? "Punkt"
        : "Anschlag je Minute";
  const was =
    groesse === "treffer"
      ? "Die Treffsicherheit"
      : groesse === "score"
        ? "Der Score"
        : "Das Tempo";
  const betrag = Math.abs(v.differenz);
  const gerundet = groesse === "treffer" ? Math.round(betrag * 10) / 10 : Math.round(betrag);
  const zahl = `${gerundet.toLocaleString("de-AT")} ${gerundet === 1 ? einzahl : einheit}`;
  if (v.richtung === "gleich")
    return punkt(
      `${was} ist gegenüber ${vergleichsName} praktisch gleich geblieben (${zahl} Unterschied).`,
    );
  if (v.richtung === "hoch")
    return punkt(`${was} liegt ${zahl} höher als in ${vergleichsName}.`);
  return punkt(`${was} liegt ${zahl} niedriger als in ${vergleichsName}.`);
}

/**
 * ★ EIN Schlusspunkt, nicht zwei (Prüfer 11.09.2026, im Browser gemessen).
 *
 * Der Vergleichsname der langen Zeiträume endet auf ein Datum: „der Woche ab
 * 21.08." Daran noch einen Satzpunkt zu hängen ergab „… ab 21.08.." - im Duden
 * verschluckt der Abkürzungspunkt den Schlusspunkt, und eine Sprachausgabe
 * liest das zweite Zeichen mit.
 */
/**
 * Der Satz englisch. Glossar §3.2: Treffsicherheit ⇒ *accuracy*, Tempo ⇒
 * *speed*, Prozentpunkte ⇒ *percentage points*. Wie im Deutschen ohne Wertung:
 * *higher* / *lower*, nie *better* / *worse*.
 */
function veraenderungSatzEn(v: Veraenderung, groesse: Groesse, vergleichsName: string): string {
  const was = groesse === "treffer" ? "Accuracy" : groesse === "score" ? "The score" : "Speed";
  const betrag = Math.abs(v.differenz);
  const gerundet = groesse === "treffer" ? Math.round(betrag * 10) / 10 : Math.round(betrag);
  const einheit =
    groesse === "treffer"
      ? gerundet === 1
        ? "percentage point"
        : "percentage points"
      : groesse === "score"
        ? gerundet === 1
          ? "point"
          : "points"
        : gerundet === 1
          ? "keystroke per minute"
          : "keystrokes per minute";
  const zahl = `${gerundet.toLocaleString("en-GB")} ${einheit}`;
  if (v.richtung === "gleich")
    return punkt(
      `${was} has stayed about the same compared with ${vergleichsName} (a difference of ${zahl}).`,
    );
  if (v.richtung === "hoch") return punkt(`${was} is ${zahl} higher than in ${vergleichsName}.`);
  return punkt(`${was} is ${zahl} lower than in ${vergleichsName}.`);
}

/**
 * ★ E11a-3 (26.09.2026): dieselbe Rechnung französisch. `vergleichsName`
 * kommt vom Aufrufer und muss schon französisch sein (siehe Kopf-Doku oben).
 */
function veraenderungSatzFr(v: Veraenderung, groesse: Groesse, vergleichsName: string): string {
  // masculin (le score) vs. féminin (la précision, la vitesse) - für die
  // Endungen von "resté(e)", "pareil(le)", "élevé(e)", "bas(se)".
  const masc = groesse === "score";
  const was = groesse === "treffer" ? "La précision" : groesse === "score" ? "Le score" : "La vitesse";
  const betrag = Math.abs(v.differenz);
  const gerundet = groesse === "treffer" ? Math.round(betrag * 10) / 10 : Math.round(betrag);
  const einheit =
    groesse === "treffer"
      ? gerundet === 1
        ? "point de pourcentage"
        : "points de pourcentage"
      : groesse === "score"
        ? gerundet === 1
          ? "point"
          : "points"
        : gerundet === 1
          ? "frappe par minute"
          : "frappes par minute";
  const zahl = `${gerundet.toLocaleString("fr-FR")} ${einheit}`;
  // ★ E11a-5 (26.09.2026): „que …" statt „qu'en …"/„par rapport à …" - der
  // Vergleichsname (`vergleichsName`: „la semaine précédente", „les 4 semaines
  // précédentes", „l'année scolaire 2025/26", „les premières semaines
  // d'exercice …") trägt seinen Artikel selbst; „qu'en la semaine" oder „à les
  // 4 semaines" wären falsches Französisch.
  if (v.richtung === "gleich")
    return punkt(
      `${was} est à peu près ${masc ? "le même" : "la même"} que ` +
        `${vergleichsName} (différence de ${zahl}).`,
    );
  if (v.richtung === "hoch")
    return punkt(`${was} est ${zahl} plus élevé${masc ? "" : "e"} que ${vergleichsName}.`);
  return punkt(`${was} est ${zahl} plus bas${masc ? "" : "se"} que ${vergleichsName}.`);
}

/**
 * ★ ES-O (27.09.2026): dieselbe Rechnung spanisch. Alle drei Grössen sind im
 * Spanischen weiblich (la precisión, la puntuación, la velocidad) - eine
 * Endung für alle. `vergleichsName` trägt seinen Artikel selbst („la semana
 * anterior", „el curso escolar 2025/26").
 */
function veraenderungSatzEs(v: Veraenderung, groesse: Groesse, vergleichsName: string): string {
  const was = groesse === "treffer" ? "La precisión" : groesse === "score" ? "La puntuación" : "La velocidad";
  const betrag = Math.abs(v.differenz);
  const gerundet = groesse === "treffer" ? Math.round(betrag * 10) / 10 : Math.round(betrag);
  const einheit =
    groesse === "treffer"
      ? gerundet === 1
        ? "punto porcentual"
        : "puntos porcentuales"
      : groesse === "score"
        ? gerundet === 1
          ? "punto"
          : "puntos"
        : gerundet === 1
          ? "pulsación por minuto"
          : "pulsaciones por minuto";
  // Dezimalpunkt (RAE 2010) - variantenneutral.
  const zahl = `${gerundet} ${einheit}`;
  if (v.richtung === "gleich")
    return punkt(`${was} es más o menos igual que en ${vergleichsName} (diferencia de ${zahl}).`);
  if (v.richtung === "hoch") return punkt(`${was} es ${zahl} más alta que en ${vergleichsName}.`);
  return punkt(`${was} es ${zahl} más baja que en ${vergleichsName}.`);
}

/**
 * ★ O-IT (02.10.2026): italienisch - „in confronto con" + Name MIT Artikel
 * („la settimana precedente", `zeitraum.ts`), weil „con" nicht mit dem Artikel
 * verschmilzt (anders als „a" ⇒ alla/alle/all'). Tempo in „battute al minuto"
 * (Glossar Regel 6), Dezimalkomma.
 */
function veraenderungSatzIt(v: Veraenderung, groesse: Groesse, vergleichsName: string): string {
  const masc = groesse === "score";
  const was = groesse === "treffer" ? "La precisione" : groesse === "score" ? "Il punteggio" : "La velocità";
  const betrag = Math.abs(v.differenz);
  const gerundet = groesse === "treffer" ? Math.round(betrag * 10) / 10 : Math.round(betrag);
  const einheit =
    groesse === "treffer"
      ? gerundet === 1
        ? "punto percentuale"
        : "punti percentuali"
      : groesse === "score"
        ? gerundet === 1
          ? "punto"
          : "punti"
        : gerundet === 1
          ? "battuta al minuto"
          : "battute al minuto";
  const zahl = `${gerundet.toLocaleString("it-IT")} ${einheit}`;
  const o = masc ? "o" : "a";
  if (v.richtung === "gleich")
    return punkt(
      `${was} è rimast${o} quasi uguale in confronto con ${vergleichsName} (differenza di ${zahl}).`,
    );
  if (v.richtung === "hoch") return punkt(`${was} è più alt${o} di ${zahl} in confronto con ${vergleichsName}.`);
  return punkt(`${was} è più bass${o} di ${zahl} in confronto con ${vergleichsName}.`);
}

/**
 * ★ O-PL (02.10.2026): polnisch. `vergleichsName` trägt die Präposition „w"
 * und steht im Miejscownik („w poprzednim tygodniu", `zeitraum.ts`) - so passt
 * er hinter „niż …" und „jak …". Das Adjektiv richtet sich nach der SACHE
 * (dokładność f., wynik m., tempo n.), nie nach dem Kind. Die Zahl mit allen
 * vier Formen (Glossar §2.10a); nach „o" steht der Akkusativ, der bei „punkt"
 * und „uderzenie" gleich dem Nominativ ist.
 */
function veraenderungSatzPl(v: Veraenderung, groesse: Groesse, vergleichsName: string): string {
  const was = groesse === "treffer" ? "Dokładność" : groesse === "score" ? "Wynik" : "Tempo";
  // Endung der Adjektive: dokładność (f.) wyższa, wynik (m.) wyższy, tempo (n.) wyższe.
  const e = groesse === "treffer" ? "a" : groesse === "score" ? "y" : "e";
  const betrag = Math.abs(v.differenz);
  const gerundet = groesse === "treffer" ? Math.round(betrag * 10) / 10 : Math.round(betrag);
  const zahl =
    groesse === "treffer"
      ? mehrzahl(gerundet, "pl", {
          one: (z) => `${z} punkt procentowy`,
          few: (z) => `${z} punkty procentowe`,
          many: (z) => `${z} punktów procentowych`,
          other: (z) => `${z} punktu procentowego`,
        })
      : groesse === "score"
        ? mehrzahl(gerundet, "pl", {
            one: (z) => `${z} punkt`,
            few: (z) => `${z} punkty`,
            many: (z) => `${z} punktów`,
            other: (z) => `${z} punktu`,
          })
        : mehrzahl(gerundet, "pl", {
            one: (z) => `${z} uderzenie na minutę`,
            few: (z) => `${z} uderzenia na minutę`,
            many: (z) => `${z} uderzeń na minutę`,
            other: (z) => `${z} uderzenia na minutę`,
          });
  const sam = groesse === "treffer" ? "taka sama" : groesse === "score" ? "taki sam" : "takie samo";
  if (v.richtung === "gleich")
    return punkt(`${was} jest prawie ${sam} jak ${vergleichsName} (różnica: ${zahl}).`);
  if (v.richtung === "hoch") return punkt(`${was} jest o ${zahl} wyższ${e} niż ${vergleichsName}.`);
  return punkt(`${was} jest o ${zahl} niższ${e} niż ${vergleichsName}.`);
}

/**
 * ★ O-TR (02.10.2026): türkisch. ⚠️ KEINE Endung an `vergleichsName` (Glossar
 * Regel 6) - er steht vor dem eigenen Wort "ile" ("önceki hafta ile
 * karşılaştırıldığında"), so passt jeder Name ohne Fall-Endung: "önceki hafta",
 * "önceki 4 hafta", "öğretim yılı 2025/26", "10 Ağu haftası". Wer einen eigenen
 * Namen für tr übergibt, schreibt ihn genauso (blosses Hauptwort, keine Endung).
 * Nach der Zahl Einzahl ("3 yüzde puan", "dakikada 5 vuruş"); ohne Wertung:
 * daha yüksek / daha düşük, nie daha iyi / daha kötü.
 */
function veraenderungSatzTr(v: Veraenderung, groesse: Groesse, vergleichsName: string): string {
  const was = groesse === "treffer" ? "Doğruluk" : groesse === "score" ? "Puan" : "Hız";
  const betrag = Math.abs(v.differenz);
  const gerundet = groesse === "treffer" ? Math.round(betrag * 10) / 10 : Math.round(betrag);
  const n = gerundet.toLocaleString("tr-TR");
  const zahl =
    groesse === "treffer" ? `${n} yüzde puan` : groesse === "score" ? `${n} puan` : `dakikada ${n} vuruş`;
  const bezug = `${vergleichsName} ile karşılaştırıldığında`;
  if (v.richtung === "gleich") return punkt(`${was}, ${bezug} neredeyse aynı kaldı (fark: ${zahl}).`);
  if (v.richtung === "hoch") return punkt(`${was}, ${bezug} ${zahl} daha yüksek.`);
  return punkt(`${was}, ${bezug} ${zahl} daha düşük.`);
}

/**
 * ★ O-CS (03.10.2026): tschechisch. `vergleichsName` trägt die Präposition
 * „v"/„ve" und steht im 6. Fall („v předchozím týdnu", „ve školním roce
 * 2025/2026", `zeitraum.ts`) - so passt er hinter „než ..." und „jako ...". Wer einen
 * eigenen Namen für cs übergibt (z. B. die erste Übungswoche), schreibt ihn
 * genauso: „v prvním týdnu cvičení". Die Zahl steht HINTER einem Doppelpunkt
 * („rozdíl: 3 procentní body") - so endet der Satz nie auf einer Zahl mit Punkt
 * (Glossar §4 Falle 4, ein Name kann auf eine Jahreszahl enden), und alle vier
 * Formen kommen aus `mehrzahl` (Glossar §2.11; `many` = Bruchzahl, „0,5
 * procentního bodu"). Ohne Wertung: vyšší / nižší (weiche Adjektive, für
 * přesnost, skóre und rychlost gleich), nie lepší / horší.
 */
function veraenderungSatzCs(v: Veraenderung, groesse: Groesse, vergleichsName: string): string {
  const was = groesse === "treffer" ? "Přesnost" : groesse === "score" ? "Skóre" : "Rychlost";
  // přesnost (f.) stejná, skóre (n.) stejné, rychlost (f.) stejná.
  const sam = groesse === "score" ? "stejné" : "stejná";
  const betrag = Math.abs(v.differenz);
  const gerundet = groesse === "treffer" ? Math.round(betrag * 10) / 10 : Math.round(betrag);
  const zahl =
    groesse === "treffer"
      ? mehrzahl(gerundet, "cs", {
          one: (z) => `${z} procentní bod`,
          few: (z) => `${z} procentní body`,
          many: (z) => `${z} procentního bodu`,
          other: (z) => `${z} procentních bodů`,
        })
      : groesse === "score"
        ? mehrzahl(gerundet, "cs", {
            one: (z) => `${z} bod`,
            few: (z) => `${z} body`,
            many: (z) => `${z} bodu`,
            other: (z) => `${z} bodů`,
          })
        : mehrzahl(gerundet, "cs", {
            one: (z) => `${z} úhoz za minutu`,
            few: (z) => `${z} úhozy za minutu`,
            many: (z) => `${z} úhozu za minutu`,
            other: (z) => `${z} úhozů za minutu`,
          });
  if (v.richtung === "gleich") return punkt(`${was} je téměř ${sam} jako ${vergleichsName}, rozdíl: ${zahl}.`);
  if (v.richtung === "hoch") return punkt(`${was} je vyšší než ${vergleichsName}, rozdíl: ${zahl}.`);
  return punkt(`${was} je nižší než ${vergleichsName}, rozdíl: ${zahl}.`);
}

function punkt(satz: string): string {
  return satz.replace(/\.\.$/, ".");
}

/**
 * Der Satz, wenn es KEINEN Vergleich gibt. Auch das wird gesagt, statt die
 * Stelle leer zu lassen: Eine leere Stelle liest sich wie ein Fehler.
 */
export function ohneVergleichSatz(
  vergleichsName: string,
  sprache: BedienSprache = "de",
): string {
  // ★ O4 (30.10.2026): die neun - bis dahin fielen sie hier auf den deutschen Rest (Falle 30).
  if (istGeruestSprache(sprache))
    return vergleichsName === "" ? KETTEN_NEUN[sprache].ohneVergleichGesamt : KETTEN_NEUN[sprache].ohneVergleich(vergleichsName);
  // ★ O-CS (03.10.2026): „Od začátku" (Glossar §2.6); der Name trägt „v"/„ve"
  // selbst und steht darum vorn, mit grossem Anfangsbuchstaben („V předchozím
  // týdnu se necvičilo"). Ohne Anführung - der Satz steht auf der Braillezeile.
  if (sprache === "cs")
    return vergleichsName === ""
      ? `Zobrazení Od začátku nemá žádné předchozí období - není s čím srovnávat.`
      : `${vergleichsName.charAt(0).toUpperCase()}${vergleichsName.slice(1)} se necvičilo - není s čím srovnávat.`;
  // ★ O-TR (02.10.2026): "Başından beri" (Glossar §2.6); der Name ohne Endung
  // hinter einem Doppelpunkt (Glossar Regel 6).
  if (sprache === "tr")
    return vergleichsName === ""
      ? `"Başından beri" görünümünde önceki bir dönem yok - burada karşılaştırılacak bir şey yok.`
      : punkt(`Karşılaştırma dönemi: ${vergleichsName}. O dönemde alıştırma yapılmadı - karşılaştırılacak bir şey yok.`);
  // ★ O-PL (02.10.2026): „Od początku" (Glossar §2.6); der Name trägt „w" selbst.
  if (sprache === "pl")
    return vergleichsName === ""
      ? `„Od początku” nie ma wcześniejszego okresu - tu nie ma czego porównać.`
      : `Brak ćwiczeń ${vergleichsName} - nie ma czego porównać.`;
  // ★ E11a-3: „Gesamt" heisst französisch *Total* (Glossar §9.2).
  if (sprache === "it")
    return vergleichsName === ""
      ? `"Dall'inizio" non ha un periodo precedente - qui non c'è nulla da confrontare.`
      : `Durante ${vergleichsName} non ci sono stati esercizi - non c'è nulla da confrontare.`;
  if (sprache === "fr")
    return vergleichsName === ""
      ? `"Total" n'a pas de période précédente - il n'y a rien à comparer ici.`
      : `Rien n'a été exercé pendant ${vergleichsName} - il n'y a rien à comparer.`;
  // ★ ES-O (27.09.2026): „Gesamt" heisst spanisch *Total* - vorher still Deutsch.
  if (sprache === "es")
    return vergleichsName === ""
      ? `"Total" no tiene un periodo anterior - aquí no hay nada que comparar.`
      : `No se practicó en ${vergleichsName} - no hay nada que comparar.`;
  // ★ EN3: „Gesamt" heisst englisch *All time* (Glossar §3.2).
  if (sprache === "en")
    return vergleichsName === ""
      ? `“All time” has no earlier period - there is nothing to compare here.`
      : `There was no practice in ${vergleichsName} - there is nothing to compare.`;
  return vergleichsName === ""
    ? `„Gesamt" hat keinen Zeitraum davor - hier gibt es nichts zu vergleichen.`
    : `In ${vergleichsName} wurde nicht geübt - es gibt nichts zu vergleichen.`;
}


/**
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★ DIE ENTWICKLUNG INNERHALB EINES LANGEN ZEITRAUMS (01.09.2026)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Johannes: *„beim der Wochenübersicht mach Tendenz der Treffsicherheit und
 * Anschläge mit dem Pfeil, beim Schuljahr und Gesamt mach ihn mit Werten: zB
 * Treffsicherheit 92% +3%; Anschl./Min 154 +14."*
 *
 * ── ⚠️ Womit wird bei „Gesamt" verglichen? ────────────────────────────────
 * Eine Woche hat eine Vorwoche. „Gesamt" hat kein Davor - dort MUSS der
 * Vergleich aus dem Zeitraum selbst kommen: **erste Woche mit Übung gegen
 * letzte Woche mit Übung.** Das ist keine neue Erfindung, es ist genau der
 * Bezugspunkt „gegenüber Schuljahresbeginn", den die Jahreskarte seit F13
 * anbietet - hier nur auf den gewählten Ausschnitt angewandt.
 *
 * Damit steht bei „Schuljahr" und „Gesamt" dasselbe: **wie weit ist dieses
 * Kind in diesem Zeitraum gekommen.** Die Wochenansicht beantwortet die andere
 * Frage („wie war diese Woche gegenüber der letzten") und behält den Pfeil.
 *
 * ── ⚠️ Wochen mit ein paar Zeilen sind kein Ausgangspunkt ─────────────────
 * Wer in seiner ersten Woche drei Zeilen getippt hat, hat dort keinen
 * belastbaren Wert - eine Steigerung „von 40 auf 180" wäre eine Aussage über
 * die Stichprobe, nicht über das Kind. Wochen unter {@link MINDESTZEILEN}
 * bleiben darum als Ausgangspunkt aussen vor.
 */
export const MINDESTZEILEN = 5;

/**
 * ★★★ K4 (19.09.2026): AB WIE VIELEN ÜBUNGSWOCHEN WIRD IN BLÖCKEN VERGLICHEN?
 *
 * Johannes: *„auch bei den kleinen Zahlen neben dem Wert nimm einen längeren
 * Zeitraum für den Trend"* - eine einzelne Übungswoche gegen eine einzelne
 * andere ist Stichprobenrauschen, sobald es genug Wochen gibt, um es
 * wegzumitteln. Ab {@link MINDEST_WOCHEN_FUER_BLOCK} Übungswochen im Zeitraum
 * werden darum nicht mehr die ERSTE und die LETZTE Woche verglichen, sondern
 * die ERSTEN {@link BLOCK_WOCHEN} zusammen gegen die LETZTEN
 * {@link BLOCK_WOCHEN} zusammen (gepoolt wie überall sonst: Anschläge/Minute
 * aus Summe Zeichen ÷ Summe Zeit, nicht aus dem Schnitt der Einzelwochen-Tempi
 * - sonst zählte eine kurze, gute Woche gleich viel wie eine lange).
 * Mit weniger Wochen bleibt es bei „erste gegen letzte Woche" - genau das tat
 * diese Funktion schon vor K4.
 */
export const BLOCK_WOCHEN = 4;
export const MINDEST_WOCHEN_FUER_BLOCK = 5;

export interface Entwicklung {
  treffer: Veraenderung | null;
  tempo: Veraenderung | null;
  /**
   * ★ B2 (11.09.2026): Der Übungs-Score, gerechnet aus denselben Wochen wie
   * Treffsicherheit und Tempo - `scoreAusWerten` über die Zeichen, Fehlgriffe
   * und das Tempo der Woche. Keine zweite Formel: Sie steht in
   * `schreibprobeWertung.ts` und wird über `score.ts` geholt.
   */
  score: Veraenderung | null;
  /** Woher gerechnet wird - für die Erklärung („seit der Woche vom 10.08."). */
  ausgangswoche: number | null;
  /**
   * ★ B3 (11.09.2026): Wie viele Übungswochen mit mindestens
   * {@link MINDESTZEILEN} Zeilen im Zeitraum liegen. Zwei sind das Mindeste
   * für einen Vergleich - steht dort 0 oder 1, ist die leere Stelle kein
   * Fehler, und {@link entwicklungsGrund} sagt, warum.
   */
  wochen: number;
  /**
   * ★ K4 (19.09.2026): `true`, wenn ab {@link MINDEST_WOCHEN_FUER_BLOCK}
   * Wochen in {@link BLOCK_WOCHEN}er-Blöcken verglichen wurde statt Woche
   * gegen Woche - optional (`undefined` = `false`), damit ältere Aufrufer und
   * Testdaten ohne dieses Feld gültig bleiben. Die Sätze am Pfeil
   * (`bezugstext` in `TastenflowReiter.tsx`) brauchen dieses Feld, um zu
   * sagen, WELCHER Vergleich gemeint ist - „den ersten 4 Übungswochen" ist ein
   * anderer Satz als „der ersten Übungswoche".
   */
  vierWochenBlock?: boolean;
}

/**
 * ★★ B3: Warum steht bei „Schuljahr" und „Gesamt" keine Veränderung?
 *
 * Eine leere Stelle liest sich wie ein Fehler - besonders in einer Spalte, in
 * der bei den Nachbarkindern eine Zahl steht. Der Satz nennt den Grund, und er
 * nennt ihn als Tatsache über die DATENLAGE, nicht über das Kind
 * ([[feedback_nie_gegen_das_kind]]).
 *
 * `null` = es gibt eine Veränderung, hier ist nichts zu erklären.
 */
export function entwicklungsGrund(
  ent: Entwicklung | null,
  sprache: BedienSprache = "de",
): string | null {
  if (!ent) return null;
  if (ent.treffer || ent.tempo || ent.score) return null;
  // ★ O-CS (03.10.2026): eine Aussage über die Datenlage, nicht über das Kind;
  // die Mindestzahl in Klammern ohne Hauptwort - nichts zu beugen (Glossar §2.11).
  // ★ O4 (30.10.2026): die neun eigen.
  if (istGeruestSprache(sprache)) {
    if (ent.wochen === 0) return KETTEN_NEUN[sprache].grundKeineWoche(MINDESTZEILEN);
    if (ent.wochen === 1) return KETTEN_NEUN[sprache].grundEineWoche(MINDESTZEILEN);
    return null;
  }
  if (sprache === "cs") {
    if (ent.wochen === 0)
      return `V tomto období zatím není žádný týden cvičení s dostatkem řádků (nejméně ${MINDESTZEILEN} za týden) - není s čím srovnávat.`;
    if (ent.wochen === 1)
      return `Zatím je tu jen jeden týden cvičení s dostatkem řádků (nejméně ${MINDESTZEILEN} za týden) - pro srovnání jsou potřeba dva.`;
    return null;
  }
  // ★ O-TR (02.10.2026): eine Aussage über die Datenlage, nicht über das Kind.
  if (sprache === "tr") {
    if (ent.wochen === 0)
      return `Bu dönemde en az ${MINDESTZEILEN} satırlık bir çalışma haftası henüz yok - karşılaştırılacak bir şey yok.`;
    if (ent.wochen === 1)
      return `Şimdilik en az ${MINDESTZEILEN} satırlık yalnızca bir çalışma haftası var - karşılaştırma için iki hafta gerekir.`;
    return null;
  }
  // ★ O-PL (02.10.2026): eine Aussage über die Datenlage, nicht über das Kind.
  if (sprache === "pl") {
    if (ent.wochen === 0)
      return `W tym okresie nie ma jeszcze tygodnia ćwiczeń z co najmniej ${MINDESTZEILEN} wierszami - nie ma czego porównać.`;
    if (ent.wochen === 1)
      return `Na razie jest tylko jeden tydzień ćwiczeń z co najmniej ${MINDESTZEILEN} wierszami - do porównania potrzeba dwóch.`;
    return null;
  }
  if (sprache === "it") {
    if (ent.wochen === 0)
      return `In questo periodo non c'è ancora nessuna settimana di esercizio con almeno ${MINDESTZEILEN} righe - non c'è nulla da confrontare.`;
    if (ent.wochen === 1)
      return `Finora c'è una sola settimana di esercizio con almeno ${MINDESTZEILEN} righe - per un'evoluzione ne servono due.`;
    return null;
  }
  // ★ E11a-5 (26.09.2026): französisch eigene Fassung - vorher fiel „fr" hier
  // still auf den deutschen Satz (Falle 30). Wie im Deutschen eine Aussage
  // über die Datenlage, nicht über das Kind.
  if (sprache === "fr") {
    if (ent.wochen === 0)
      return `Il n'y a pas encore de semaine d'exercice avec au moins ${MINDESTZEILEN} lignes dans cette période - il n'y a rien à comparer.`;
    if (ent.wochen === 1)
      return `Une seule semaine d'exercice avec au moins ${MINDESTZEILEN} lignes pour l'instant - pour une évolution, il en faut deux.`;
    return null;
  }
  // ★ ES-O (27.09.2026): spanisch - vorher still Deutsch (Falle 30).
  if (sprache === "es") {
    if (ent.wochen === 0)
      return `En este periodo todavía no hay ninguna semana de práctica con al menos ${MINDESTZEILEN} líneas - no hay nada que comparar.`;
    if (ent.wochen === 1)
      return `Por ahora solo hay una semana de práctica con al menos ${MINDESTZEILEN} líneas - para una evolución hacen falta dos.`;
    return null;
  }
  if (sprache === "en") {
    if (ent.wochen === 0)
      return `There is no practice week with at least ${MINDESTZEILEN} lines in this period yet - there is nothing to compare.`;
    if (ent.wochen === 1)
      return `Only one practice week with at least ${MINDESTZEILEN} lines so far - a change needs two.`;
    return null;
  }
  if (ent.wochen === 0)
    return `In diesem Zeitraum gibt es noch keine Übungswoche mit mindestens ${MINDESTZEILEN} Zeilen - es gibt nichts zu vergleichen.`;
  if (ent.wochen === 1)
    return `Erst eine Übungswoche mit mindestens ${MINDESTZEILEN} Zeilen - für eine Veränderung braucht es zwei.`;
  return null;
}

/** Das kurze Wort für die Zelle, wenn {@link entwicklungsGrund} etwas zu sagen hat. */
export function entwicklungsGrundKurz(
  ent: Entwicklung | null,
  sprache: BedienSprache = "de",
): string | null {
  if (!entwicklungsGrund(ent)) return null;
  // ★ O-CS (03.10.2026)
  // ★ O4 (30.10.2026): die neun eigen.
  if (istGeruestSprache(sprache)) return ent!.wochen === 1 ? KETTEN_NEUN[sprache].grundKurzEine : KETTEN_NEUN[sprache].grundKurzKeine;
  if (sprache === "cs") return ent!.wochen === 1 ? "jen jeden týden cvičení" : "zatím žádný týden cvičení";
  // ★ O-TR (02.10.2026)
  if (sprache === "tr") return ent!.wochen === 1 ? "yalnızca bir çalışma haftası" : "henüz çalışma haftası yok";
  // ★ O-PL (02.10.2026)
  if (sprache === "pl") return ent!.wochen === 1 ? "tylko jeden tydzień ćwiczeń" : "na razie brak tygodnia ćwiczeń";
  if (sprache === "it") return ent!.wochen === 1 ? "una sola settimana di esercizio" : "ancora nessuna settimana di esercizio";
  if (sprache === "fr") return ent!.wochen === 1 ? "une seule semaine d'exercice" : "pas encore de semaine d'exercice";
  if (sprache === "es") return ent!.wochen === 1 ? "solo una semana de práctica" : "todavía ninguna semana de práctica";
  if (sprache === "en") return ent!.wochen === 1 ? "only one practice week" : "no practice week yet";
  return ent!.wochen === 1 ? "erst eine Übungswoche" : "noch keine Übungswoche";
}

export function entwicklungImZeitraum(
  events: readonly TaskEvent[],
  grenzen: { vonMs: number; bisMs: number } | null,
): Entwicklung {
  const leer: Entwicklung = {
    treffer: null,
    tempo: null,
    score: null,
    ausgangswoche: null,
    wochen: 0,
  };
  const nach = new Map<
    string,
    { chars: number; errors: number; tempoChars: number; ms: number; zeilen: number; startMs: number }
  >();
  // ★ 18.09.2026 (Bauplan F1/F1b): Tempo nur aus plausiblen Zeilen
  // (`zeilenTempoPlausibel`), Treffsicherheit weiter aus allen.
  for (const e of events) {
    if (grenzen && (e.ts < grenzen.vonMs || e.ts > grenzen.bisMs)) continue;
    if (e.chars <= 0 || e.ms <= 0) continue;
    const k = isoWeekKey(e.ts);
    const t =
      nach.get(k) ?? { chars: 0, errors: 0, tempoChars: 0, ms: 0, zeilen: 0, startMs: e.ts };
    t.chars += e.chars;
    t.errors += e.errors;
    if (zeilenTempoPlausibel(e)) {
      t.tempoChars += e.chars;
      t.ms += e.ms;
    }
    t.zeilen += 1;
    t.startMs = Math.min(t.startMs, e.ts);
    nach.set(k, t);
  }
  const wochen = [...nach.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, t]) => t)
    .filter((t) => t.zeilen >= MINDESTZEILEN);
  if (wochen.length < 2) return { ...leer, wochen: wochen.length };
  const werte = (t: (typeof wochen)[number]) => {
    const tempo = t.ms > 0 ? (t.tempoChars / t.ms) * 60000 : 0;
    return {
      treffer: (Math.max(0, t.chars - t.errors) / t.chars) * 100,
      tempo,
      /*
       * ⚠️ `scoreAusWerten` und nicht `scoreAusStats`: Hier liegen die
       * Rohgrössen einer WOCHE vor, keine `PupilStats`. Gerechnet wird
       * trotzdem mit derselben Funktion - die Formel steht nur in
       * `schreibprobeWertung.ts`.
       *
       * ⚠️ Die Mindestmenge von 200 Zeichen gilt auch hier - `scoreAusWerten`
       * liefert dann `null`, und `veraenderung(null, …)` ist `null`: kein
       * Vergleich statt eines Wertes aus Rechenrauschen. Bei fünf Zeilen ist
       * die Menge in aller Regel erreicht.
       */
      score: scoreAusWerten({
        zeichen: t.chars,
        fehler: t.errors,
        anschlaegeProMin: tempo,
      }).wert,
    };
  };
  /*
   * ★★★ K4 (19.09.2026): AB {@link MINDEST_WOCHEN_FUER_BLOCK} WOCHEN WIRD
   * GEPOOLT, NICHT MEHR EINZELN VERGLICHEN.
   *
   * `poolen` fasst mehrere Wochen zu EINER zusammen, bevor `werte()` daraus
   * Treffsicherheit, Tempo und Score rechnet - dieselbe Formel, nur mit den
   * SUMMEN mehrerer Wochen statt den Zahlen einer einzigen. Das ist keine
   * zweite Rechnung: `werte()` sieht am Ende wieder nur ein Bündel aus
   * Zeichen, Fehlgriffen, Tempo-Zeichen und Millisekunden, egal ob es aus
   * einer Woche oder aus vieren stammt.
   */
  const poolen = (ts: readonly (typeof wochen)[number][]): (typeof wochen)[number] => ({
    chars: ts.reduce((s, t) => s + t.chars, 0),
    errors: ts.reduce((s, t) => s + t.errors, 0),
    tempoChars: ts.reduce((s, t) => s + t.tempoChars, 0),
    ms: ts.reduce((s, t) => s + t.ms, 0),
    zeilen: ts.reduce((s, t) => s + t.zeilen, 0),
    startMs: Math.min(...ts.map((t) => t.startMs)),
  });
  const vierWochenBlock = wochen.length >= MINDEST_WOCHEN_FUER_BLOCK;
  const a = werte(vierWochenBlock ? poolen(wochen.slice(0, BLOCK_WOCHEN)) : wochen[0]);
  const b = werte(
    vierWochenBlock ? poolen(wochen.slice(-BLOCK_WOCHEN)) : wochen[wochen.length - 1],
  );
  return {
    treffer: veraenderung(b.treffer, a.treffer, "treffer"),
    tempo: veraenderung(b.tempo, a.tempo, "tempo"),
    score: veraenderung(b.score, a.score, "score"),
    // ★ Immer der Anfang der ERSTEN Übungswoche - auch bei einem Block sind
    // das die ersten vier, die mit dieser Woche beginnen.
    ausgangswoche: wochen[0].startMs,
    wochen: wochen.length,
    vierWochenBlock,
  };
}

/** „+3 %" bzw. „+14" - das Vorzeichen steht IMMER da, auch bei null. */
export function veraenderungWert(
  v: Veraenderung,
  groesse: Groesse,
  sprache: BedienSprache = "de",
): string {
  const gerundet =
    groesse === "treffer" ? Math.round(v.differenz) : Math.round(v.differenz);
  // ⚠️ Der gewöhnliche Bindestrich, NICHT das typografische Minus „−":
  // Der Strich-Wächter des Hauses verbietet es, und auf einer Braillezeile ist
  // es ein anderes Zeichen als das, das jedes Kind kennt.
  const vorzeichen = gerundet > 0 ? "+" : gerundet < 0 ? "-" : "±";
  const betrag = Math.abs(gerundet);
  // ★ Der Score trägt wie das Tempo keine Einheit in der Zelle - „78 | +4".
  // Was die Zahl bedeutet, sagt der Spaltenkopf und der Hinweis der Zelle.
  // ★ EN3: englisch ohne Leerzeichen vor dem Prozentzeichen („+3%", Glossar §1.2).
  // ★ E11a-5: Tabelle je Sprache statt Weiche - französisch MIT Leerzeichen
  // („+3 %", Bauplan §9.1), wie im Deutschen.
  // ★ O-TR (02.10.2026): `prozentMitZeichen` - Türkisch "+%3" (Zeichen VOR der
  // Zahl, wie Intl tr-TR mit signDisplay), alle anderen Byte für Byte wie vorher.
  return groesse === "treffer"
    ? `${vorzeichen}${prozentMitZeichen(betrag, PROZENT_JE_SPRACHE[sprache], sprache)}`
    : `${vorzeichen}${betrag}`;
}

/** Das Prozentzeichen je Sprache - englisch ohne Leerzeichen (Glossar §1.2). */
const PROZENT_JE_SPRACHE: Record<BedienSprache, string> = {
  de: " %",
  en: "%",
  fr: " %",
  // ★ ES-O (27.09.2026): RAE - „95 %" mit Leerzeichen, in Spanien und Amerika.
  es: " %",
  it: "%", // ★ O-IT: „+3%" ohne Leerzeichen (Glossar Regel 5).
  pl: "%", // ★ O-PL (02.10.2026): „+3%" ohne Leerzeichen (Intl und PWN, Glossar Regel 5).
  tr: "%", // ★ O-TR (02.10.2026): "+%3" - die Stellung setzt `prozentMitZeichen` (Glossar Regel 5).
  cs: " %", // ★ O-CS (03.10.2026): „+3 %" - das geschützte Leerzeichen setzt `prozentMitZeichen` (Glossar Regel 5).
  // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: "%",
  el: "%",
  hu: "%",
  nl: "%",
  pt: "%",
  br: "%",
  ro: "\u00A0%",
  sv: "\u00A0%",
  uk: "%",
};

/**
 * ★ T1 (19.09.2026): die SCHLANKE Veränderung der Klassentabelle - „↗ 3",
 * „→ 0", „↘ 5": die Richtung als Pfeil, der Betrag ohne Vorzeichen und ohne
 * Einheit (Johannes zum Entwurf „Meine Klassen": die Tabelle soll schlank
 * sein; statt „96 % | +3 %" steht „96 %" und klein daneben „↗ 3").
 *
 * ⚠️ Die Richtung kommt aus `richtung` (mit Totzone), nicht aus dem
 * gerundeten Betrag: „→ 1" heisst „innerhalb der Schwankung, 1 Punkt". Der
 * ganze Satz mit Einheit und Bezug steht weiter im Hinweis der Zelle
 * (`veraenderungSatz`) - die Kurzform ist `aria-hidden`.
 */
export function veraenderungKurz(v: Veraenderung): string {
  return `${PFEIL[v.richtung]} ${Math.abs(Math.round(v.differenz))}`;
}

/**
 * ★ 13.09.2026: Der ERSTE Teil der Erklärung am Spaltenkopf - WAS die Zahl ist,
 * ohne Pfeil und ohne Veränderung.
 *
 * Eigene Funktion, weil die Legende der Excel-Leistungstabelle
 * (`leistungExport.ts`) genau diesen Teil braucht: In der Datei steht nur der
 * Wert des Zeitraums, keine Veränderung. {@link spaltenHilfe} setzt ihn
 * unverändert vor ihren Zusatz - der Schirm zeigt Wort für Wort dasselbe wie
 * vorher, und Datei und Schirm können nicht auseinanderlaufen.
 */
export function spaltenGrund(groesse: Groesse, sprache: BedienSprache = "de"): string {
  // ★ O4 (30.10.2026): die neun eigen.
  if (istGeruestSprache(sprache)) {
    const k = KETTEN_NEUN[sprache];
    if (groesse === "score") return `${k.scoreLehrkraft} ${k.spalteScore(MIND_ZEICHEN_WERTUNG)}`;
    return groesse === "treffer" ? k.spalteTreffer : k.spalteTempo;
  }
  if (sprache === "cs") return spaltenGrundCs(groesse); // ★ O-CS (03.10.2026)
  if (sprache === "tr") return spaltenGrundTr(groesse);
  if (sprache === "pl") return spaltenGrundPl(groesse);
  if (sprache === "it") return spaltenGrundIt(groesse);
  if (sprache === "fr") return spaltenGrundFr(groesse);
  if (sprache === "es") return spaltenGrundEs(groesse);
  if (sprache === "en") return spaltenGrundEn(groesse);
  if (groesse === "score")
    /*
      ★ B2/B4 (11.09.2026): Der erklärende Satz kommt aus `score.ts` - dieselbe
      Erklärung, die das Kind in seiner eigenen Statistik liest, nur in der
      Sie-Fassung. Eine zweite Formulierung hier wäre eine zweite Wahrheit über
      dieselbe Zahl.
    */
    return (
      `${SCORE_ERKLAERUNG_SIE} Unter ${MIND_ZEICHEN_WERTUNG} geschriebenen ` +
      `Zeichen im Zeitraum steht ein Strich: Darunter entscheidet ein einzelner ` +
      `Fehlgriff über mehrere Punkte, und das wäre kein Ergebnis, sondern Rauschen.`
    );
  if (groesse === "treffer")
    return (
      "Der Anteil richtig getroffener Zeichen. Sie ist die wichtigere der " +
      "beiden Zahlen: Wer sicher schreibt, wird von selbst schneller - " +
      "umgekehrt fast nie."
    );
  // ⚠️ Backticks: Das deutsche Schlusszeichen ist ein ASCII-`"` und bräche
  // einen doppelt gequoteten String mitten im Satz auf.
  return (
    `Anschläge je Minute - das Tempo. Bei Kindern mit „Zeit lassen" steht die ` +
    `Zahl zwar da, zählt aber nirgends im Programm.`
  );
}


/**
 * ════════════════════════════════════════════════════════════════════════════
 * DIE ERKLÄRUNG AM SPALTENKOPF - sie muss BEIDE Zahlen nennen
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Johannes, 01.09.2026: *„der Mouse-over-Info bei den Spaltenüberschriften
 * Wochenziele, Treffsicherheit und Anschl. ist in der Jahresübersicht nicht
 * vollständig, erkläre beide Werte der Spalten."*
 *
 * In der Jahres- und Gesamtansicht steht in der Zelle „92 % | +3 %" - zwei
 * Zahlen. Eine Erklärung, die nur die erste nennt, ist nicht halb richtig,
 * sondern irreführend: Wer sie liest, ordnet den Satz der falschen Zahl zu.
 */
export function spaltenHilfe(
  groesse: Groesse,
  langerZeitraum: boolean,
  sprache: BedienSprache = "de",
): string {
  // ★ O4 (30.10.2026): die neun eigen.
  if (istGeruestSprache(sprache)) {
    const k = KETTEN_NEUN[sprache];
    const grund = spaltenGrund(groesse, sprache);
    if (groesse === "score") return `${grund} ${langerZeitraum ? k.hilfeLangScore : k.hilfeKurzScore}`;
    if (groesse === "treffer") return `${grund} ${langerZeitraum ? k.hilfeLangTreffer : k.hilfeKurzTreffer}`;
    return `${grund} ${langerZeitraum ? k.hilfeLangTempo : k.hilfeKurzTempo}`;
  }
  if (sprache === "cs") return spaltenHilfeCs(groesse, langerZeitraum); // ★ O-CS (03.10.2026)
  if (sprache === "tr") return spaltenHilfeTr(groesse, langerZeitraum);
  if (sprache === "pl") return spaltenHilfePl(groesse, langerZeitraum);
  if (sprache === "it") return spaltenHilfeIt(groesse, langerZeitraum);
  if (sprache === "fr") return spaltenHilfeFr(groesse, langerZeitraum);
  if (sprache === "es") return spaltenHilfeEs(groesse, langerZeitraum);
  if (sprache === "en") return spaltenHilfeEn(groesse, langerZeitraum);
  const grund = spaltenGrund(groesse);
  if (groesse === "score") {
    return langerZeitraum
      ? `${grund} Hier stehen ZWEI Angaben, getrennt durch einen senkrechten ` +
          `Strich: vorn der Score über den ganzen Zeitraum, dahinter die ` +
          `Veränderung darin - von der ersten Übungswoche bis zur letzten. ` +
          `„72 | +6" heisst also: im Schnitt 72 Punkte, und um 6 Punkte besser ` +
          `als am Anfang.`
      : `${grund} Der Pfeil daneben vergleicht mit dem Zeitraum davor: schräg ` +
          `hoch höher, gerade gleich, schräg runter niedriger. Er ist keine ` +
          `Wertung - schwerere Texte drücken den Score, das ist Lernen.`;
  }
  if (groesse === "treffer") {
    return langerZeitraum
      ? `${grund} Hier stehen ZWEI Angaben, getrennt durch einen senkrechten ` +
          `Strich: vorn die Treffsicherheit über den ganzen Zeitraum, dahinter ` +
          `die Veränderung darin - von der ersten Übungswoche bis zur letzten. ` +
          `„92 % | +3 %" heisst also: im Schnitt 92 Prozent, und um 3 ` +
          `Prozentpunkte besser als am Anfang. Steht dort nichts, gab es noch ` +
          `keine zwei Wochen mit genug Zeilen, um etwas zu vergleichen.`
      : `${grund} Der Pfeil daneben vergleicht mit dem Zeitraum davor: schräg ` +
          `hoch besser, gerade gleich, schräg runter niedriger. Er ist keine ` +
          `Wertung - schwerere Texte machen ungenauer, das ist Lernen.`;
  }
  return langerZeitraum
    ? `${grund} Hier stehen ZWEI Angaben, getrennt durch einen senkrechten ` +
        `Strich: vorn das Tempo über den ganzen Zeitraum, dahinter die ` +
        `Veränderung darin - von der ersten Übungswoche bis zur letzten. ` +
        `„185 | +7" heisst also: im Schnitt 185 Anschläge je Minute, und um 7 ` +
        `mehr als am Anfang.`
    : `${grund} Der Pfeil daneben vergleicht mit dem Zeitraum davor: schräg ` +
        `hoch schneller, gerade gleich, schräg runter langsamer.`;
}

/**
 * ★ EN3 (19.09.2026): die Spalten-Erklärungen englisch - Lehrkraft-Sicht
 * (Glossar §3.8: *pupils*). „Zeit lassen" ⇒ *Take your time* (§3.4).
 */
function spaltenGrundEn(groesse: Groesse): string {
  if (groesse === "score")
    return (
      `${SCORE_ERKLAERUNG_SIE_EN} With fewer than ${MIND_ZEICHEN_WERTUNG} characters ` +
      `typed in the period, a dash is shown instead: below that, a single wrong key ` +
      `would decide several points, and that would be noise, not a result.`
    );
  if (groesse === "treffer")
    return (
      "The proportion of characters typed correctly. It is the more important of " +
      "the two numbers: pupils who type accurately get faster by themselves - the " +
      "other way round hardly ever happens."
    );
  return (
    "Keystrokes per minute - the speed. For pupils with “Take your time” the " +
    "number is shown, but it does not count anywhere in the app."
  );
}

function spaltenHilfeEn(groesse: Groesse, langerZeitraum: boolean): string {
  const grund = spaltenGrundEn(groesse);
  const zwei = "There are TWO figures here, separated by a vertical bar: first";
  const verlauf = "then the change within it - from the first practice week to the last.";
  if (groesse === "score") {
    return langerZeitraum
      ? `${grund} ${zwei} the score over the whole period, ${verlauf} ` +
          `So “72 | +6” means: 72 points on average, and 6 points higher than at the start.`
      : `${grund} The arrow next to it compares with the period before: diagonally ` +
          `up is higher, straight across is the same, diagonally down is lower. It is ` +
          `not a judgement - harder texts push the score down, and that is learning.`;
  }
  if (groesse === "treffer") {
    return langerZeitraum
      ? `${grund} ${zwei} the accuracy over the whole period, ${verlauf} ` +
          `So “92% | +3%” means: 92 per cent on average, and 3 percentage points ` +
          `higher than at the start. If nothing is shown there, there were not yet two ` +
          `weeks with enough lines to compare.`
      : `${grund} The arrow next to it compares with the period before: diagonally ` +
          `up is better, straight across is the same, diagonally down is lower. It is ` +
          `not a judgement - harder texts make typing less accurate, and that is learning.`;
  }
  return langerZeitraum
    ? `${grund} ${zwei} the speed over the whole period, ${verlauf} ` +
        `So “185 | +7” means: 185 keystrokes per minute on average, and 7 more than ` +
        `at the start.`
    : `${grund} The arrow next to it compares with the period before: diagonally ` +
        `up is faster, straight across is the same, diagonally down is slower.`;
}

/**
 * ★ E11a-3 (26.09.2026): dieselben Sätze französisch - Glossar §9.2
 * (Treffsicherheit ⇒ précision, Anschläge pro Minute ⇒ frappes par minute,
 * Fehlgriff ⇒ erreur de frappe).
 */
function spaltenGrundFr(groesse: Groesse): string {
  if (groesse === "score")
    return (
      `${SCORE_ERKLAERUNG_VOUS_FR} En dessous de ${MIND_ZEICHEN_WERTUNG} caractères ` +
      `tapés pendant la période, un tiret s'affiche à la place : en dessous de ce ` +
      `seuil, une seule erreur de frappe déciderait de plusieurs points, ce qui ` +
      `serait du bruit, pas un résultat.`
    );
  if (groesse === "treffer")
    return (
      "La part des caractères tapés correctement. C'est le plus important des " +
      "deux nombres : qui tape avec précision devient plus rapide tout seul - " +
      "l'inverse n'arrive presque jamais."
    );
  return (
    "Frappes par minute - la vitesse. Pour les élèves avec \"La vitesse ne compte pas\", " +
    "le nombre s'affiche, mais ne compte nulle part dans l'application."
  );
}

function spaltenHilfeFr(groesse: Groesse, langerZeitraum: boolean): string {
  const grund = spaltenGrundFr(groesse);
  const zwei = "Il y a ici DEUX valeurs, séparées par une barre verticale : d'abord";
  const verlauf = "puis l'évolution depuis la première semaine d'exercice jusqu'à la dernière.";
  if (groesse === "score") {
    return langerZeitraum
      ? `${grund} ${zwei} le score sur toute la période, ${verlauf} ` +
          `"72 | +6" veut donc dire : 72 points en moyenne, et 6 points de plus qu'au début.`
      : `${grund} La flèche à côté compare avec la période précédente : en diagonale ` +
          `vers le haut = plus élevé, à l'horizontale = pareil, en diagonale vers le ` +
          `bas = plus bas. Ce n'est pas un jugement - des textes plus difficiles font ` +
          `baisser le score, et c'est ça, apprendre.`;
  }
  if (groesse === "treffer") {
    return langerZeitraum
      ? `${grund} ${zwei} la précision sur toute la période, ${verlauf} ` +
          `"92 % | +3 %" veut donc dire : 92 % en moyenne, et 3 points de pourcentage ` +
          `de plus qu'au début. Si rien ne s'affiche là, il n'y avait pas encore deux ` +
          `semaines avec assez de lignes pour comparer.`
      : `${grund} La flèche à côté compare avec la période précédente : en diagonale ` +
          `vers le haut = meilleur, à l'horizontale = pareil, en diagonale vers le bas ` +
          `= plus bas. Ce n'est pas un jugement - des textes plus difficiles font baisser ` +
          `la précision, et c'est ça, apprendre.`;
  }
  return langerZeitraum
    ? `${grund} ${zwei} la vitesse sur toute la période, ${verlauf} ` +
        `"185 | +7" veut donc dire : 185 frappes par minute en moyenne, et 7 de plus ` +
        `qu'au début.`
    : `${grund} La flèche à côté compare avec la période précédente : en diagonale ` +
        `vers le haut = plus rapide, à l'horizontale = pareil, en diagonale vers le bas ` +
        `= plus lent.`;
}

/**
 * ★ ES-O (27.09.2026): dieselben Sätze spanisch (Treffsicherheit ⇒ precisión,
 * Anschläge pro Minute ⇒ pulsaciones por minuto, Fehlgriff ⇒ error).
 */
/** ★ O-IT (02.10.2026): italienisch, für die Lehrkraft neutral (Glossar Regel 1). */
function spaltenGrundIt(groesse: Groesse): string {
  if (groesse === "score")
    return (
      `${SCORE_ERKLAERUNG_IT_INSEGNANTE} Con meno di ${MIND_ZEICHEN_WERTUNG} caratteri ` +
      `scritti nel periodo compare un trattino: sotto questa soglia un solo tasto ` +
      `sbagliato deciderebbe più punti, e non sarebbe un risultato, ma rumore.`
    );
  if (groesse === "treffer")
    return (
      "La quota di caratteri scritti correttamente. È il più importante dei due " +
      "numeri: chi scrive con precisione diventa più veloce da sé - il contrario " +
      "non succede quasi mai."
    );
  return (
    `Battute al minuto - la velocità. Per chi ha "Con calma" il numero compare, ` +
    `ma non conta da nessuna parte nel programma.`
  );
}

function spaltenHilfeIt(groesse: Groesse, langerZeitraum: boolean): string {
  const grund = spaltenGrundIt(groesse);
  const zwei = "Qui ci sono DUE valori, separati da una barra verticale: prima";
  const verlauf = "poi l'evoluzione al suo interno - dalla prima settimana di esercizio all'ultima.";
  if (groesse === "score") {
    return langerZeitraum
      ? `${grund} ${zwei} il punteggio dell'intero periodo, ${verlauf} ` +
          `"72 | +6" significa quindi: in media 72 punti, e 6 punti in più che all'inizio.`
      : `${grund} La freccia accanto confronta con il periodo precedente: in diagonale ` +
          `verso l'alto = più alto, orizzontale = uguale, in diagonale verso il basso = ` +
          `più basso. Non è un giudizio - i testi più difficili abbassano il punteggio, ` +
          `e questo è imparare.`;
  }
  if (groesse === "treffer") {
    return langerZeitraum
      ? `${grund} ${zwei} la precisione dell'intero periodo, ${verlauf} ` +
          `"92% | +3%" significa quindi: in media 92%, e 3 punti percentuali in più ` +
          `che all'inizio. Se lì non compare nulla, non c'erano ancora due settimane ` +
          `con abbastanza righe da confrontare.`
      : `${grund} La freccia accanto confronta con il periodo precedente: in diagonale ` +
          `verso l'alto = meglio, orizzontale = uguale, in diagonale verso il basso = ` +
          `più bassa. Non è un giudizio - i testi più difficili abbassano la precisione, ` +
          `e questo è imparare.`;
  }
  return langerZeitraum
    ? `${grund} ${zwei} la velocità dell'intero periodo, ${verlauf} ` +
        `"185 | +7" significa quindi: in media 185 battute al minuto, e 7 in più ` +
        `che all'inizio.`
    : `${grund} La freccia accanto confronta con il periodo precedente: in diagonale ` +
        `verso l'alto = più veloce, orizzontale = uguale, in diagonale verso il basso = ` +
        `più lenta.`;
}

/**
 * ★ O-PL (02.10.2026): polnisch für die Lehrkraft im unpersönlichen Stil
 * (Glossar Regel 1: „napisano", nie Pan/Pani); dokładność, uderzenia na
 * minutę, pomyłka, „Bez pośpiechu" (Glossar §2.2).
 */
function spaltenGrundPl(groesse: Groesse): string {
  if (groesse === "score")
    return (
      `${SCORE_ERKLAERUNG_PL_NAUCZYCIELE} Jeśli w tym okresie napisano mniej niż ` +
      `${MIND_ZEICHEN_WERTUNG} znaków, zamiast liczby widać kreskę: przy tak małej ` +
      `liczbie znaków jedna pomyłka decydowałaby o kilku punktach - to byłby szum, a nie wynik.`
    );
  if (groesse === "treffer")
    return (
      "Odsetek poprawnie napisanych znaków. To ważniejsza z dwóch liczb: przy " +
      "dokładnym pisaniu tempo z czasem rośnie samo - odwrotnie prawie nigdy."
    );
  return (
    `Uderzenia na minutę - tempo. Przy ustawieniu „Bez pośpiechu” liczba jest ` +
    `widoczna, ale nigdzie w programie się nie liczy.`
  );
}

function spaltenHilfePl(groesse: Groesse, langerZeitraum: boolean): string {
  const grund = spaltenGrundPl(groesse);
  const zwei = "Są tu DWIE wartości, oddzielone pionową kreską: najpierw";
  const verlauf = "potem zmiana w tym okresie - od pierwszego do ostatniego tygodnia ćwiczeń.";
  if (groesse === "score") {
    return langerZeitraum
      ? `${grund} ${zwei} wynik z całego okresu, ${verlauf} ` +
          `„72 | +6” oznacza więc: średnio 72 punkty i o 6 punktów więcej niż na początku.`
      : `${grund} Strzałka obok porównuje z poprzednim okresem: ukośnie w górę = wyżej, ` +
          `poziomo = bez zmian, ukośnie w dół = niżej. Strzałka niczego nie ocenia - ` +
          `trudniejsze teksty obniżają wynik, a to część nauki.`;
  }
  if (groesse === "treffer") {
    return langerZeitraum
      ? `${grund} ${zwei} dokładność z całego okresu, ${verlauf} ` +
          `„92% | +3%” oznacza więc: średnio 92% i o 3 punkty procentowe więcej ` +
          `niż na początku. Jeśli nic tam nie ma, nie było jeszcze dwóch tygodni ` +
          `z wystarczającą liczbą wierszy, żeby porównać.`
      : `${grund} Strzałka obok porównuje z poprzednim okresem: ukośnie w górę = lepiej, ` +
          `poziomo = bez zmian, ukośnie w dół = niżej. Strzałka niczego nie ocenia - ` +
          `przy trudniejszych tekstach dokładność spada, a to część nauki.`;
  }
  return langerZeitraum
    ? `${grund} ${zwei} tempo z całego okresu, ${verlauf} ` +
        `„185 | +7” oznacza więc: średnio 185 uderzeń na minutę i o 7 więcej ` +
        `niż na początku.`
    : `${grund} Strzałka obok porównuje z poprzednim okresem: ukośnie w górę = szybciej, ` +
        `poziomo = bez zmian, ukośnie w dół = wolniej.`;
}

/**
 * ★ O-CS (03.10.2026): tschechisch für die Lehrkraft - beschreibend, ohne
 * Befehlsform und ohne Personenwort im Einzel (Glossar Regel 2: „kdo píše",
 * „u žáků"); přesnost, úhozy za minutu, překlep, „V klidu" (Glossar §2.2),
 * Prozent „92 %" mit geschütztem Leerzeichen (Regel 5). Der Strich in der Zelle
 * heisst „vodorovná čára" - „čárka" wäre auch das Komma (Glossar §4 Falle 2).
 */
function spaltenGrundCs(groesse: Groesse): string {
  if (groesse === "score")
    return (
      `${SCORE_ERKLAERUNG_CS_VYUCUJICI} Pokud bylo v daném období napsáno méně než ` +
      `${MIND_ZEICHEN_WERTUNG} znaků, místo čísla se zobrazí vodorovná čára: při tak malém ` +
      `počtu znaků by o několika bodech rozhodl jediný překlep - nebyl by to výsledek, ale šum.`
    );
  if (groesse === "treffer")
    return (
      "Podíl správně napsaných znaků. Je to důležitější z obou čísel: kdo píše přesně, " +
      "časem sám od sebe zrychlí - naopak to téměř nikdy nefunguje."
    );
  return (
    "Úhozy za minutu - rychlost. U žáků s nastavením V klidu se číslo zobrazuje, " +
    "ale nikde v programu se nepočítá."
  );
}

function spaltenHilfeCs(groesse: Groesse, langerZeitraum: boolean): string {
  const grund = spaltenGrundCs(groesse);
  const zwei = "Jsou tu DVĚ hodnoty oddělené svislou čárou: nejprve";
  const verlauf = "potom změna během tohoto období - od prvního do posledního týdne cvičení.";
  const ok = "Šipka vedle porovnává s předchozím obdobím:";
  if (groesse === "score") {
    return langerZeitraum
      ? `${grund} ${zwei} skóre za celé období, ${verlauf} ` +
          `Zápis „72 | +6“ tedy znamená: v průměru 72 bodů a o 6 bodů víc než na začátku.`
      : `${grund} ${ok} šikmo nahoru = výš, vodorovně = beze změny, šikmo dolů = níž. ` +
          `Šipka nic nehodnotí - těžší texty skóre snižují, to patří k učení.`;
  }
  if (groesse === "treffer") {
    return langerZeitraum
      ? `${grund} ${zwei} přesnost za celé období, ${verlauf} ` +
          `Zápis „92\u00A0% | +3\u00A0%“ tedy znamená: v průměru 92\u00A0% a o 3 procentní body ` +
          `víc než na začátku. Pokud tam nic není, ještě nebyly dva týdny s dostatkem ` +
          `řádků, aby se dalo srovnávat.`
      : `${grund} ${ok} šikmo nahoru = lépe, vodorovně = beze změny, šikmo dolů = níž. ` +
          `Šipka nic nehodnotí - u těžších textů přesnost klesá, to patří k učení.`;
  }
  return langerZeitraum
    ? `${grund} ${zwei} rychlost za celé období, ${verlauf} ` +
        `Zápis „185 | +7“ tedy znamená: v průměru 185 úhozů za minutu a o 7 víc ` +
        `než na začátku.`
    : `${grund} ${ok} šikmo nahoru = rychleji, vodorovně = beze změny, šikmo dolů = pomaleji.`;
}

/**
 * ★ O-TR (02.10.2026): türkisch für die Lehrkraft - beschreibend, ohne
 * Befehlsform; doğruluk, dakikada vuruş, yanlış tuş, "Acele yok" (Glossar §2.2),
 * Prozent "%92", "+%3" (Regel 5), nach der Zahl Einzahl.
 */
function spaltenGrundTr(groesse: Groesse): string {
  if (groesse === "score")
    return (
      `${SCORE_ERKLAERUNG_TR_OGRETMEN} Dönem içinde ${MIND_ZEICHEN_WERTUNG} karakterden az ` +
      `yazıldıysa sayı yerine bir çizgi görünür: bu kadar az karakterde tek bir yanlış tuş ` +
      `birkaç puanı belirlerdi - bu bir sonuç değil, gürültü olurdu.`
    );
  if (groesse === "treffer")
    return (
      "Doğru yazılan karakterlerin oranı. İki sayıdan daha önemli olanı budur: doğru " +
      "yazan öğrenci zamanla kendiliğinden hızlanır - tersi neredeyse hiç olmaz."
    );
  return (
    `Dakikada vuruş - hız. "Acele yok" ayarı açık olan öğrencilerde sayı görünür, ` +
    `ama programda hiçbir yerde hesaba katılmaz.`
  );
}

function spaltenHilfeTr(groesse: Groesse, langerZeitraum: boolean): string {
  const grund = spaltenGrundTr(groesse);
  const zwei = "Burada dikey bir çizgiyle ayrılmış İKİ değer var: önce";
  const verlauf = "sonra bu dönem içindeki değişim - ilk çalışma haftasından sonuncusuna kadar.";
  const ok = "Yanındaki ok önceki dönemle karşılaştırır:";
  if (groesse === "score") {
    return langerZeitraum
      ? `${grund} ${zwei} tüm dönemin puanı, ${verlauf} ` +
          `Yani "72 | +6" şu anlama gelir: ortalama 72 puan ve başlangıca göre 6 puan daha yüksek.`
      : `${grund} ${ok} çapraz yukarı = daha yüksek, düz = aynı, çapraz aşağı = daha düşük. ` +
          `Ok bir değerlendirme değildir - daha zor metinler puanı düşürür, bu da öğrenmenin parçasıdır.`;
  }
  if (groesse === "treffer") {
    return langerZeitraum
      ? `${grund} ${zwei} tüm dönemin doğruluğu, ${verlauf} ` +
          `Yani "%92 | +%3" şu anlama gelir: ortalama %92 ve başlangıca göre 3 yüzde puan ` +
          `daha yüksek. Orada bir şey yoksa, karşılaştırma için yeterli satırı olan iki ` +
          `hafta henüz yok.`
      : `${grund} ${ok} çapraz yukarı = daha iyi, düz = aynı, çapraz aşağı = daha düşük. ` +
          `Ok bir değerlendirme değildir - daha zor metinler doğruluğu düşürür, bu da ` +
          `öğrenmenin parçasıdır.`;
  }
  return langerZeitraum
    ? `${grund} ${zwei} tüm dönemin hızı, ${verlauf} ` +
        `Yani "185 | +7" şu anlama gelir: ortalama dakikada 185 vuruş ve başlangıca göre ` +
        `7 vuruş daha fazla.`
    : `${grund} ${ok} çapraz yukarı = daha hızlı, düz = aynı, çapraz aşağı = daha yavaş.`;
}

function spaltenGrundEs(groesse: Groesse): string {
  if (groesse === "score")
    return (
      `${SCORE_ERKLAERUNG_USTED_ES} Con menos de ${MIND_ZEICHEN_WERTUNG} caracteres ` +
      `escritos en el periodo aparece un guion: por debajo de ese umbral, un solo ` +
      `error decidiría varios puntos, y eso no sería un resultado, sino ruido.`
    );
  if (groesse === "treffer")
    return (
      "El porcentaje de caracteres escritos correctamente. Es el más importante de los " +
      "dos números: quien escribe con precisión se vuelve más rápido solo - " +
      "al revés casi nunca."
    );
  return (
    "Pulsaciones por minuto - la velocidad. Para estudiantes con \"La velocidad no cuenta\", " +
    "el número aparece, pero no cuenta en ninguna parte del programa."
  );
}

function spaltenHilfeEs(groesse: Groesse, langerZeitraum: boolean): string {
  const grund = spaltenGrundEs(groesse);
  const zwei = "Aquí hay DOS valores, separados por una barra vertical: primero";
  const verlauf = "y después la evolución desde la primera semana de práctica hasta la última.";
  if (groesse === "score") {
    return langerZeitraum
      ? `${grund} ${zwei} la puntuación de todo el periodo, ${verlauf} ` +
          `"72 | +6" quiere decir: 72 puntos de media, y 6 puntos más que al principio.`
      : `${grund} La flecha de al lado compara con el periodo anterior: en diagonal ` +
          `hacia arriba = más alta, horizontal = igual, en diagonal hacia abajo = más ` +
          `baja. No es un juicio - los textos más difíciles bajan la puntuación, y eso ` +
          `es aprender.`;
  }
  if (groesse === "treffer") {
    return langerZeitraum
      ? `${grund} ${zwei} la precisión de todo el periodo, ${verlauf} ` +
          `"92 % | +3 %" quiere decir: 92 % de media, y 3 puntos porcentuales más ` +
          `que al principio. Si ahí no aparece nada, todavía no había dos semanas ` +
          `con suficientes líneas para comparar.`
      : `${grund} La flecha de al lado compara con el periodo anterior: en diagonal ` +
          `hacia arriba = mejor, horizontal = igual, en diagonal hacia abajo = más ` +
          `baja. No es un juicio - los textos más difíciles bajan la precisión, y eso ` +
          `es aprender.`;
  }
  return langerZeitraum
    ? `${grund} ${zwei} la velocidad de todo el periodo, ${verlauf} ` +
        `"185 | +7" quiere decir: 185 pulsaciones por minuto de media, y 7 más ` +
        `que al principio.`
    : `${grund} La flecha de al lado compara con el periodo anterior: en diagonal ` +
        `hacia arriba = más rápida, horizontal = igual, en diagonal hacia abajo = ` +
        `más lenta.`;
}
