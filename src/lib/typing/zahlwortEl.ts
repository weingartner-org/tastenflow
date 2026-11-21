/**
 * ★ G3c-VERTEILER (25.10.2026): DAS ZAHLWORT IN GRIECHISCH.
 * ★ O-INHALT-EL (29.10.2026): geschrieben - 0 bis 1.000.000, so wie ein Kind es in der Schule schreibt.
 *
 * Regeln (Glossar `recherche-griechisch-2026-10-25/GLOSSAR-el.md` §2.10, Bauplan E17) [G - von einer Person mit Griechisch als
 * Erstsprache gegenzulesen; die Tabelle im Wächter ist dafür da]:
 *  · Zählform OHNE Hauptwort ist sächlich: „ένα", „τρία", „τέσσερα", „δεκατρία", „διακόσια".
 *  · Die Tausender sind weiblich (η χιλιάδα): „τρεις χιλιάδες", „τέσσερις χιλιάδες", „είκοσι μία χιλιάδες", „διακόσιες χιλιάδες";
 *    1000 allein „χίλια" (sächlich), 1001 „χίλια ένα".
 *  · 100 „εκατό", vor einer weiteren Zahl „εκατόν" („εκατόν ένα", „εκατόν είκοσι").
 *  · Die Doppelformen επτά/εφτά, οκτώ/οχτώ, εννέα/εννιά: hier die Schulform „επτά, οκτώ, εννέα"; die Hunderter „επτακόσια,
 *    οκτακόσια, εννιακόσια" (Schriftform). Das Zahlendiktat nimmt seit O2-TASTATUR (30.10.2026) auch die Zweitform an (`zahlendiktat.ts`).
 *  · Getrennt geschrieben, ein Leerzeichen, kein Bindestrich; Tonos wie in der Schule („έξι", „δέκα", „είκοσι").
 *
 * `zahlwort(n, "el")` wirft absichtlich und bleibt so. Verteiler: `uebungsformen/zahlendiktat.ts` (`ZAHLWORT_GERUEST`).
 * Wächter: `tests/tastenflow-zahlwort-el.test.ts` (Vorbild `tastenflow-zahlwort-cs`).
 */

/** Die grösste Zahl, für die {@link zahlwortEl} ein Wort liefert. */
export const MAX_ZAHL_EL = 1_000_000;

/** Sächlich (Zählform). */
const EINER_N = ["μηδέν", "ένα", "δύο", "τρία", "τέσσερα", "πέντε", "έξι", "επτά", "οκτώ", "εννέα"];
/** Weiblich - vor „χιλιάδες". */
const EINER_F = ["μηδέν", "μία", "δύο", "τρεις", "τέσσερις", "πέντε", "έξι", "επτά", "οκτώ", "εννέα"];
const ZEHN_N = ["δέκα", "έντεκα", "δώδεκα", "δεκατρία", "δεκατέσσερα", "δεκαπέντε", "δεκαέξι", "δεκαεπτά", "δεκαοκτώ", "δεκαεννέα"];
const ZEHN_F = ["δέκα", "έντεκα", "δώδεκα", "δεκατρείς", "δεκατέσσερις", "δεκαπέντε", "δεκαέξι", "δεκαεπτά", "δεκαοκτώ", "δεκαεννέα"];
const ZEHNER = ["", "", "είκοσι", "τριάντα", "σαράντα", "πενήντα", "εξήντα", "εβδομήντα", "ογδόντα", "ενενήντα"];
const HUNDERTER_N = ["", "εκατό", "διακόσια", "τριακόσια", "τετρακόσια", "πεντακόσια", "εξακόσια", "επτακόσια", "οκτακόσια", "εννιακόσια"];
const HUNDERTER_F = ["", "εκατό", "διακόσιες", "τριακόσιες", "τετρακόσιες", "πεντακόσιες", "εξακόσιες", "επτακόσιες", "οκτακόσιες", "εννιακόσιες"];

/** 1-999 in der Form des Geschlechts (`f` vor „χιλιάδες"). */
function bisTausend(n: number, f: boolean): string {
  const h = Math.floor(n / 100);
  const rest = n % 100;
  const teile: string[] = [];
  if (h > 0) teile.push(h === 1 && rest > 0 ? "εκατόν" : (f ? HUNDERTER_F : HUNDERTER_N)[h]);
  if (rest >= 10 && rest < 20) teile.push((f ? ZEHN_F : ZEHN_N)[rest - 10]);
  else {
    const z = Math.floor(rest / 10);
    const e = rest % 10;
    if (z > 0) teile.push(ZEHNER[z]);
    if (e > 0) teile.push((f ? EINER_F : EINER_N)[e]);
  }
  return teile.join(" ");
}

/** Das griechische Zahlwort für 0 bis 1.000.000 (sächliche Zählform, Tausender weiblich). */
export function zahlwortEl(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > MAX_ZAHL_EL) {
    throw new RangeError(`zahlwortEl: ${n} liegt nicht zwischen 0 und ${MAX_ZAHL_EL} (ganze Zahl)`);
  }
  if (n === 0) return "μηδέν";
  if (n === MAX_ZAHL_EL) return "ένα εκατομμύριο";
  const tausend = Math.floor(n / 1000);
  const rest = n % 1000;
  const oben = tausend === 0 ? "" : tausend === 1 ? "χίλια" : `${bisTausend(tausend, true)} χιλιάδες`;
  const unten = rest === 0 ? "" : bisTausend(rest, false);
  return [oben, unten].filter(Boolean).join(" ");
}

/** Ein Zahlwort je Zahl (0 bis 1.000.000) - oder `null`, solange die Sprache keines hat. */
export const ZAHLWORT_EL: ((n: number) => string) | null = zahlwortEl;
