/**
 * Übungsform „Wandernder Großbuchstabe" - trainiert die Umschalt-Gegenhand-
 * Regel: ein Wort wird mehrfach getippt, und in jeder Zeile sitzt der
 * zusätzliche Großbuchstabe eine Stelle weiter rechts.
 *
 * Herkunft: eine Mail von Testerin (Kollegin, dieselbe Zielgruppe), am
 * 01.09.2026 mit Johannes durchgesprochen (siehe `typen.ts`, Kopf-Kommentar).
 * Das Beispiel aus der Bauanleitung, wörtlich:
 *
 *   Zirkuszelt · ZIrkuszelt · ZiRkuszelt …
 *
 * „Zirkuszelt" ist ein Nomen und trägt deshalb schon in der ersten Zeile
 * seinen normalen Anfangs-Großbuchstaben (Z). Dieser bleibt über alle Zeilen
 * hinweg stehen - er ist nicht der Wanderer, sondern die gewöhnliche
 * Großschreibung des Wortanfangs. Der WANDERER ist der EINE zusätzliche
 * Großbuchstabe, der sich Zeile für Zeile um eine Stelle nach rechts bewegt
 * (nicht kumulativ: die vorige Wanderer-Stelle wird beim Weiterziehen wieder
 * klein). Bei einem Wort ohne diesen festen Anfangs-Großbuchstaben (kein
 * Nomen, oder Englisch - dort werden Wörter nie automatisch großgeschrieben)
 * beginnt der Wanderer schon an der ersten Stelle.
 */
import { fitText } from "../corpus";
import { grossFuer, kleinFuer } from "../sprachRegister";
import { isNoun } from "../words";
import { SHIFT_UNIT } from "../letters";
import { wandleSchreibweise } from "../schreibweise";
import type { Lang } from "../account";
import type { RoundLine } from "../generator";
import type { FormKontext, FormRunde, Uebungsform } from "./typen";
import { texte } from "../../bedienSprache/texte";
import { bedienSpracheVon } from "./bedienung";
import { FORM_NAMEN } from "./namen";
import { wortquelle } from "./hilfen";

/** Wortlänge, mit der die Form arbeitet - kurze Wörter üben zu wenig, lange ermüden. */
const MIN_WORTLAENGE = 5;
const MAX_WORTLAENGE = 10;

/**
 * Die Menge der freigeschalteten TASTEN (ohne die Umschalt-Einheit, die kein
 * Zeichen ist) - dieselbe Form, die `fitText` erwartet.
 */
function tastenstand(ctx: FormKontext): Set<string> {
  return new Set(ctx.introduced.filter((einheit) => einheit !== SHIFT_UNIT));
}

/**
 * Trägt dieses Wort schon in der normalen (ungewanderten) Zeile einen festen
 * Großbuchstaben an Stelle 1? Nur im Deutschen, und nur bei einem Nomen -
 * Englisch schreibt Übungswörter nie automatisch groß (siehe `caseWord` in
 * `generator.ts`). Rückgabe: der Index dieser festen Stelle (0), oder `-1`,
 * wenn es keine gibt.
 */
function festeGrossstelle(wort: string, lang: Lang): number {
  return lang === "de" && isNoun(wort) ? 0 : -1;
}

/**
 * Alle Zeilen EINES Wortes, vom normalen Anfang bis zum Wanderer an der
 * letzten Stelle - nie abgeschnitten. Zeile 1 trägt nur die feste
 * Groß-Stelle (falls vorhanden); jede weitere Zeile trägt zusätzlich GENAU
 * eine Wanderer-Stelle, die von links nach rechts durch das Wort zieht.
 */
function zeilenFuerWort(wort: string, lang: Lang): string[] {
  const buchstaben = [...wort];
  const fest = festeGrossstelle(wort, lang);
  const grossAn = (stellen: Set<number>) =>
    buchstaben.map((b, i) => (stellen.has(i) ? grossFuer(b, lang) : b)).join("");

  const zeilen: string[] = [
    grossAn(fest >= 0 ? new Set([fest]) : new Set<number>()),
  ];
  for (let wanderer = fest + 1; wanderer < buchstaben.length; wanderer++) {
    const stellen = fest >= 0 ? new Set([fest, wanderer]) : new Set([wanderer]);
    zeilen.push(grossAn(stellen));
  }
  return zeilen;
}

/**
 * Alle Wörter, die für diese Form taugen: die richtige Länge, nur
 * freigeschaltete Tasten, ohne ß. Einmalig (Quelllisten enthalten Dubletten).
 * Wörter mit ß bleiben aussen vor: ß hat keine gewöhnliche Großschreibung, und
 * der Wanderer soll nie auf so einer Sonderstelle stehen.
 *
 * ★ E10b (25.09.2026): der Wortschatz kommt aus `wortquelle()` (`hilfen.ts`)
 * statt aus einer eigenen Kopie - die gab für „fr" still die deutsche Liste
 * zurück. Und ein Wort taugt nur, wenn auch seine GROSSBUCHSTABEN tippbar
 * sind: Der Wanderer macht aus `é` ein `É`, und das hat Windows-AZERTY nicht
 * (Bauplan F5) - die Zeile fiele sonst mitten in der Wanderung weg. Für
 * Deutsch und Englisch ändert das nichts (`ä ö ü` und `a-z` sind als
 * Grossbuchstabe tippbar, sobald sie es klein sind).
 */
function wortpool(ctx: FormKontext): string[] {
  const allowed = tastenstand(ctx);
  const gesehen = new Set<string>();
  const out: string[] = [];
  for (const roh of wortquelle(ctx.lang)) {
    const wortGb = kleinFuer(roh, ctx.lang);
    // ★ E10: Schreibweise VOR der Längen-/Tastenprüfung (wie `wortpool` in
    // `hilfen.ts`) - der Wanderer läuft dann durch das WIRKLICH GEZEIGTE Wort.
    const wort =
      ctx.lang === "en" && ctx.variante === "us" ? wandleSchreibweise(wortGb, "us") : wortGb;
    if (wort.length < MIN_WORTLAENGE || wort.length > MAX_WORTLAENGE) continue;
    if (wort.includes("ß")) continue;
    if (gesehen.has(wort)) continue;
    if (fitText(wort, allowed, undefined, ctx.lang) === null) continue; // nicht alle Tasten frei
    // É, À … fehlen: Seit E8b Block 1a (26.09.2026) gilt „É" in `fitText` als
    // Grossform von „é" und wird auf Tastaturen ohne É-Taste per Ersatz zu „E"
    // - `fitText` sagt dann nicht mehr `null`, sondern liefert eine ANDERE
    // Zeile. Für den Wanderer zählt aber, dass genau das gezeigte Wort tippbar
    // ist. Nur für „fr" verglichen: Deutsch und Englisch bleiben, wie sie waren
    // (dort darf der Ersatz greifen, z. B. Ä auf Schweizer Tastaturen).
    // ★ G2b-1: in der Sprache des Wortes - türkisch „iş" ⇒ „İŞ" (nicht „IŞ").
    const gross = grossFuer(wort, ctx.lang);
    // ★ W1 (27.09.2026, Johannes §3.8): mit dem Weg - dort sind Grossbuchstaben
    // über eine Totaste (Windows-AZERTY À È Ù Ê …) die späte Lektion, É/Ç gibt
    // es gar nicht (`grossbuchstabeFrei`, corpus.ts). Bis W1 machte der Ersatz
    // aus „È" ein „E", und der Vergleich unten schloss das Wort aus.
    const grossGetippt = fitText(gross, allowed, ctx.lernweg, ctx.lang);
    if (grossGetippt === null) continue;
    if (ctx.lang === "fr" && grossGetippt !== gross) continue;
    gesehen.add(wort);
    out.push(wort);
  }
  return out;
}

/** Fisher-Yates - Zufall NUR über `ctx.zufall()`, nie `Math.random`. */
function mischen<T>(arr: T[], zufall: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(zufall() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Bedienung (EN4) - Deutsch wortgleich wie vorher. */
const TEXTE = texte({
  de: {
    ankuendigung:
      "Jetzt wandert ein großer Buchstabe durch das Wort. Achte auf die Umschalttaste der Gegenhand.",
  },
  en: {
    ankuendigung:
      "Now a capital letter wanders through the word. Use the Shift key on the opposite hand.",
  },
  // ★ E11a-5 (26.09.2026): Französisch aus der Funktion neu geschrieben (tu, kurz).
  fr: {
    ankuendigung:
      "Voici une majuscule qui voyage dans le mot. Pense à la touche Maj de l'autre main.",
  },
  es: {
    ankuendigung:
      "Aquí tienes una mayúscula que viaja por la palabra. Acuérdate de usar la tecla Mayús de la otra mano.",
  },
  it: {
    ankuendigung:
      "Ora c'è una maiuscola che viaggia nella parola. Usa il tasto Maiusc dell'altra mano.",
  },
  // ★ O-PL (02.10.2026): „Teraz kolej na: …" - der Name nach dem Doppelpunkt im Nominativ (Glossar §2.2).
  pl: {
    ankuendigung:
      "Teraz kolej na: Wędrująca wielka litera. Naciskaj klawisz Shift drugą ręką.",
  },
  // ★ O-TR (02.10.2026): "Sırada: ..." (Glossar §2.2); der Wanderer selbst wird schon mit
  // `grossFuer(..., "tr")` gross ("iş" ⇒ "İŞ"), siehe `zeilenFuerWort`.
  tr: {
    ankuendigung:
      "Sırada: Gezgin büyük harf. Shift tuşuna diğer elinle bas.",
  },
  // ★ O-CS (03.10.2026): „Teď: ..." - der Name nach dem Doppelpunkt im Nominativ, klein (Glossar §2.2).
  cs: {
    ankuendigung:
      "Teď: putující velké písmeno. Klávesu Shift stiskni druhou rukou.",
  },
  // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: {
    ankuendigung: "Сега: пътуващата главна буква минава през думата. Натискай Shift с другата ръка.",
  },
  el: {
    ankuendigung: "Τώρα: ένα κεφαλαίο ταξιδεύει μέσα στη λέξη. Πάτα το Shift με το άλλο χέρι.",
  },
  hu: {
    ankuendigung: "Most: egy nagybetű vándorol a szóban. A Shift billentyűt a másik kezeddel nyomd.",
  },
  nl: {
    ankuendigung: "Nu zwerft er een hoofdletter door het woord. Gebruik de Shift-toets van je andere hand.",
  },
  pt: {
    ankuendigung: "Agora: uma maiúscula viaja pela palavra. Usa a tecla Shift da outra mão.",
  },
  br: {
    ankuendigung: "Agora: uma maiúscula viaja pela palavra. Use a tecla Shift da outra mão.",
  },
  ro: {
    ankuendigung: "Acum: o majusculă călătorește prin cuvânt. Folosește tasta Shift de la cealaltă mână.",
  },
  sv: {
    ankuendigung: "Nu vandrar en stor bokstav genom ordet. Använd Skift-tangenten på andra handen.",
  },
  uk: {
    ankuendigung: "Далі: велика літера мандрує словом. Натискай Shift іншою рукою.",
  },
});

function ankuendigung(ctx: FormKontext): string {
  return TEXTE[bedienSpracheVon(ctx)].ankuendigung;
}

/**
 * Taugt nur, wenn die Umschalttaste echt gelernt ist (`ctx.shift`) - sonst
 * erscheinen Großbuchstaben in dieser App ohnehin automatisch, und die Form
 * würde nichts trainieren. Für Kinder mit dem Häkchen „Einhand schreiben"
 * gilt die Umschalt-GEGENHAND-Regel zwar nicht - die Form taugt für sie
 * trotzdem, denn die Übungssitzung nimmt bei ihnen jede Umschalttaste an
 * (`enforceShiftHand`, an anderer Stelle geregelt). Deshalb hier bewusst
 * KEINE eigene `oneHand`-Sonderbehandlung.
 */
function taugt(ctx: FormKontext): boolean {
  return ctx.shift && wortpool(ctx).length > 0;
}

function baue(ctx: FormKontext): FormRunde | null {
  const pool = taugt(ctx) ? wortpool(ctx) : [];
  if (pool.length === 0) return null;

  const allowed = tastenstand(ctx);
  const zeilen: RoundLine[] = [];
  let vorrat = mischen(pool, ctx.zufall);
  let cursor = 0;

  // Wörter werden ganz abgearbeitet (nie mitten in der Wanderung
  // abgeschnitten), bis die Runde etwa `ctx.count` Zeilen hat.
  while (zeilen.length < ctx.count) {
    if (cursor >= vorrat.length) {
      vorrat = mischen(pool, ctx.zufall);
      cursor = 0;
    }
    const wort = vorrat[cursor++];
    for (const text of zeilenFuerWort(wort, ctx.lang)) {
      const fertig = fitText(text, allowed, undefined, ctx.lang);
      if (fertig === null) continue; // defensiv: der Pool ist bereits geprüft
      zeilen.push({ text: fertig, source: null, art: "woerter" });
    }
  }
  return { zeilen };
}

export const wandernderGross: Uebungsform = {
  id: "wandernder-gross",
  name: FORM_NAMEN.de["wandernder-gross"],
  ankuendigung,
  taugt,
  baue,
};
