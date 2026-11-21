/**
 * Übungsform „Der lange Satz" - ein Satz über mehrere Zeilen, am Stück.
 *
 *   Der alte Leuchtturm steht seit hundert
 *   Jahren am Ende der Landzunge und
 *   zeigt den Schiffen den Weg nach Hause.
 *
 * Herkunft: Vorschlag vom 02.09.2026, von Johannes ausgewählt
 * (`VORSCHLAG-2026-09-02-NEUE-UEBUNGSFORMEN.md`, Nr. 5 - *„gut, aber erst nach
 * einem gewissen Niveau"*).
 *
 * ★★★ Warum die Form gebraucht wird: Alles, was der Lehrgang bisher kann, ist
 * ZEILENWEISE. Ein Kind, das sechs Wochen geübt hat, beherrscht jede Zeile -
 * aber noch keinen Absatz. Zwischen zwei Zeilen liegt hier keine Karte, kein
 * Lob, keine Pause: Der Satz läuft durch, und genau das ist beim Schreiben
 * eines Textes später der Normalfall.
 *
 * ★★★★ DIE SCHWELLE - Johannes' Auflage. Die Form kommt erst, wenn ein Kind
 * genug Tasten hat, dass ein ganzer Satz nicht zur Buchstabensuche wird:
 * {@link MIN_TASTEN} freigeschaltete Buchstaben UND die Umschalttaste
 * (ein Satz fängt groß an und endet mit einem Punkt - ohne beides wäre es
 * kein Satz, sondern eine Wortkette).
 *
 * ⚠️ Die Zahl unten ist mein Vorschlag, nicht Johannes' Entscheidung. Wer sie
 * ändert, ändert, ab wann ein Kind diese Form überhaupt zu sehen bekommt -
 * das gehört besprochen, nicht nachjustiert.
 */
import { fitText, passtLernweg } from "../corpus";
import { contentStufenFor } from "../account";
import { SHIFT_UNIT } from "../letters";
import type { RoundLine } from "../generator";
import type { FormKontext, FormRunde, Uebungsform } from "./typen";
import { korpusQuelle, mischen, tastenstand } from "./hilfen";
import { wandleSchreibweise } from "../schreibweise";
import { texte } from "../../bedienSprache/texte";
import { bedienSpracheVon } from "./bedienung";
import { FORM_NAMEN } from "./namen";

/**
 * So viele Buchstaben braucht ein Kind, bevor der lange Satz angeboten wird.
 *
 * 20 von 30: Damit sind die Grundreihe, die häufigen Buchstaben und ein Teil
 * der seltenen frei - genug, dass ein gewöhnlicher deutscher Satz durchläuft,
 * ohne dass ständig ein Wort an einer fehlenden Taste scheitert.
 */
export const MIN_TASTEN = 20;

/** So breit ist eine Zeile - dieselbe Größenordnung wie im gewöhnlichen Lauf. */
const ZEILENBREITE = 34;

/** Kürzere Sätze ergeben keine mehrzeilige Übung. */
const MIN_ZEICHEN = 60;

/** Bedienung (EN4) - Deutsch wortgleich wie vorher. */
const TEXTE = texte({
  de: { ankuendigung: `Jetzt kommt ein langer Satz. Er geht über mehrere Zeilen - schreib ihn am Stück.` },
  en: { ankuendigung: `Now for one long sentence. It runs over several lines - type it all in one go.` },
  // ★ E11a-5 (26.09.2026): Französisch aus der Funktion neu geschrieben (tu, kurz).
  fr: { ankuendigung: `Voici une longue phrase. Elle tient sur plusieurs lignes - écris-la d'un seul trait.` },
  es: { ankuendigung: `Aquí tienes una frase larga. Ocupa varias líneas - escríbela de un tirón.` },
  it: { ankuendigung: `Ora tocca alla frase lunga. Va su più righe - scrivila tutta d'un fiato.` },
  // ★ O-PL (02.10.2026): „Teraz kolej na: …" - der Name nach dem Doppelpunkt im Nominativ (Glossar §2.2).
  pl: { ankuendigung: `Teraz kolej na: Długie zdanie. Zajmuje kilka wierszy - napisz je w całości, bez przerwy.` },
  // ★ O-TR (02.10.2026): "Sırada: ..." - der Name nach dem Doppelpunkt, ohne Endung (Glossar §2.2).
  tr: { ankuendigung: `Sırada: Uzun cümle. Birkaç satır sürer - onu ara vermeden yaz.` },
  // ★ O-CS (03.10.2026): „Teď: ..." - der Name nach dem Doppelpunkt im Nominativ, klein (Glossar §2.2).
  cs: { ankuendigung: `Teď: dlouhá věta. Jde přes několik řádků - napiš ji vcelku, bez přestávky.` },
  // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: {
    ankuendigung: "Сега: дългото изречение. То е на няколко реда - напиши го наведнъж.",
  },
  el: {
    ankuendigung: "Τώρα: η μεγάλη πρόταση. Πιάνει πολλές γραμμές - γράψ' την όλη μονομιάς.",
  },
  hu: {
    ankuendigung: "Most: a hosszú mondat. Több soron át tart - írd le egyben.",
  },
  nl: {
    ankuendigung: "Nu: de lange zin. Hij loopt over meerdere regels - typ hem in één keer.",
  },
  pt: {
    ankuendigung: "Agora: a frase longa. Ocupa várias linhas - escreve-a toda de seguida.",
  },
  br: {
    ankuendigung: "Agora: a frase longa. Ela ocupa várias linhas - digite tudo de uma vez.",
  },
  ro: {
    ankuendigung: "Acum: propoziția lungă. Se întinde pe mai multe rânduri - scrie-o dintr-odată.",
  },
  sv: {
    ankuendigung: "Nu: den långa meningen. Den går över flera rader - skriv den i ett svep.",
  },
  uk: {
    ankuendigung: "Далі: довге речення. Воно займає кілька рядків - надрукуй його за один раз.",
  },
});

function ankuendigung(ctx: FormKontext): string {
  return TEXTE[bedienSpracheVon(ctx)].ankuendigung;
}

/**
 * Wie viele echte Buchstaben (ohne Umschalt-Einheit) schon frei sind.
 *
 * ★ 27.09.2026 (Fund ES-T9, Fehlerklasse Falle 4): vorher `[a-zäöüß]` - ñ,
 * é, è, à, ç … zählten nicht als Buchstaben. Jetzt jeder einzelne Buchstabe
 * (`\p{L}`); Totasten-Einheiten (´ ¨ ^ `) sind keine Buchstaben und zählen
 * weiter nicht.
 */
export function tastenZahl(ctx: FormKontext): number {
  return ctx.introduced.filter((e) => e !== SHIFT_UNIT && /^\p{L}$/u.test(e)).length;
}

/** Sätze, die lang genug und mit diesem Tastenstand vollständig tippbar sind. */
export function saetze(ctx: FormKontext): string[] {
  const allowed = tastenstand(ctx);
  // `CorpusItem.stufen` traegt den WEITEN Stufen-Typ (mit den Alt-Werten
  // a/b/c), `contentStufenFor` liefert den engen. Der Vergleich laeuft
  // deshalb ueber Zeichenketten - ein Cast wuerde nur verstecken, dass es
  // zwei Typen sind.
  const etiketten = new Set<string>(contentStufenFor(ctx.stufe));
  const out: string[] = [];
  // ★ Die Sprache entscheidet ueber den Korpus. Ohne das stuenden im
  // Englisch-Modus deutsche Saetze - gefunden am 02.09.2026 im Durchlauf
  // aller Formen, nicht von einem Test.
  for (const item of korpusQuelle(ctx.lang)) {
    if (!item.stufen.some((s) => etiketten.has(s))) continue;
    // ★ E6a (24.09.2026): nur der eigene Lernweg (wie `corpusItemsFor`) - sonst
    // liefen auf Weg „en" fremde nurWeg-„en"-Sätze durch den de-Filter leer
    // oder umgekehrt bekäme Weg „de" versehentlich nurWeg-„en"-Inhalt.
    if (!passtLernweg(item.nurWeg, ctx.lernweg)) continue;
    if (item.text.length < MIN_ZEICHEN) continue;
    // ★ E10: Schreibweise VOR der Tastenprüfung (wie `wortpool`/`corpus.ts`) -
    // die amerikanische Form muss ebenfalls vollständig tippbar sein.
    const text =
      ctx.lang === "en" && ctx.variante === "us" ? wandleSchreibweise(item.text, "us") : item.text;
    // ★ E10b-2: mit dem Weg - auf „fr" zählen Totasten-Buchstaben (ê, ï …)
    // und der Bindestrich ist „hart"; für „de"/„en" byte-gleich.
    if (fitText(text, allowed, ctx.lernweg) !== text) continue;
    out.push(text);
  }
  return out;
}

function taugt(ctx: FormKontext): boolean {
  if (!ctx.shift) return false;
  if (tastenZahl(ctx) < MIN_TASTEN) return false;
  return saetze(ctx).length > 0;
}

/**
 * Bricht einen Satz an WORTGRENZEN um.
 *
 * Nie mitten im Wort: Ein Kind, das die Zeile hört oder abtastet, bekäme sonst
 * ein halbes Wort vorgesetzt und müsste raten, wie es weitergeht - und für die
 * Sprachausgabe wäre die Silbe kein Wort mehr.
 */
export function umbrechen(satz: string, breite = ZEILENBREITE): string[] {
  const zeilen: string[] = [];
  let aktuell = "";
  for (const wort of satz.split(/\s+/).filter(Boolean)) {
    if (aktuell === "") aktuell = wort;
    else if (aktuell.length + 1 + wort.length <= breite) aktuell += ` ${wort}`;
    else {
      zeilen.push(aktuell);
      aktuell = wort;
    }
  }
  if (aktuell) zeilen.push(aktuell);
  return zeilen;
}

function baue(ctx: FormKontext): FormRunde | null {
  const pool = saetze(ctx);
  if (pool.length === 0) return null;

  const gemischt = mischen(pool, ctx.zufall);
  const zeilen: RoundLine[] = [];
  // So viele Sätze, bis die Runde voll ist - aber jeder Satz GANZ. Ein
  // abgeschnittener Satz wäre genau das, was diese Form abschaffen soll.
  for (const satz of gemischt) {
    if (zeilen.length >= ctx.count) break;
    for (const text of umbrechen(satz))
      zeilen.push({ text, source: null, art: "text" });
  }
  return zeilen.length > 0 ? { zeilen } : null;
}

export const langersatz: Uebungsform = {
  id: "langersatz",
  name: FORM_NAMEN.de.langersatz,
  ankuendigung,
  taugt,
  baue,
};
