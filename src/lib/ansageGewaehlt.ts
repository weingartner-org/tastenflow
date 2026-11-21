/**
 * DER SATZ, DER EINE GETROFFENE WAHL BESTÄTIGT - für ALLE Apps.
 * ===========================================================================
 * Angelegt 31.08.2026, als die Farbwahl in Punktgenau, Klangpunkte und
 * »im Griff« ihre Ansage bekam (Zensus Nr 40 des Barrierefreiheits-Audits).
 *
 * ★★★ WARUM DIESE DATEI HIER LIEGT UND NICHT BEI EINER APP:
 *
 * Zuerst holten sich die drei Seiten den Wortlaut aus
 * `src/lib/typing/vorlesen.ts` - der Datei, die Tastenflow für seine
 * zweisprachige Vorlese-Schicht gebaut hat. Das übersetzte sich auf dem
 * Tastenflow-Zweig auch anstandslos. Auf den anderen Zweigen NICHT:
 *
 *     src/features/public/PunktgenauPage.tsx(23,32): error TS2307:
 *     Cannot find module '@/lib/typing/vorlesen'
 *
 * `vorlesen.ts` ist am 29./30.08.2026 auf `feat/tastenflow` entstanden, und
 * die Zweige stehen weit auseinander - `feat/punktgenau` fehlen 68 Commits
 * aus Tastenflow. **Ein Modul, das nur auf einem Zweig existiert, ist für die
 * anderen kein gemeinsames Modul, sondern eine Falle**, die erst beim
 * Übernehmen auffliegt.
 *
 * Eine neue, abhängigkeitsfreie Datei löst das: Sie wandert mit demselben
 * Commit auf jeden Zweig und kann dort nirgends anstossen.
 *
 * ⚠️ **Hier steht NUR der Wortlaut, nie die Stimme.** Jede App hat ihre
 * eigene Sprachausgabe mit eigenem An/Aus-Schalter (Tastenflow
 * `lib/typing/voice.ts`, Punktgenau und Klangpunkte `lib/braille/voice.ts`,
 * »im Griff« `lib/computer/announce.ts`). Wer hier eine Stimme einbaute,
 * liesse in Punktgenau den Tastenflow-Schalter mitreden - genau der Fehler,
 * den der Rückruf `onFarbeGewaehlt` in der gemeinsamen Kopfzeile vermeidet.
 *
 * `src/lib/typing/vorlesen.ts` reicht seinen `ansageGewaehlt` seit dem
 * 31.08.2026 hierher durch - es gibt den Satz also genau einmal.
 */

/**
 * Die Sprachen, in denen die Plattform spricht. ★ E11a-5 (26.09.2026, F18):
 * „fr" dazu - nur Tastenflow reicht es herein (`lib/typing/vorlesen.ts`); die
 * drei anderen Aufrufer (Punktgenau, Klangpunkte, »Im Griff«) rufen ohne
 * Sprache auf und bekommen weiter Deutsch.
 */
export type AnsageSprache = "de" | "en" | "fr" | "es" | "it" | "pt" | "br" | "pl" | "tr" | "cs";

/**
 * Der Satz je Sprache. Französisch als „Choix : …" - geschlechtsneutral, weil
 * das Etikett ein Wort jeder Art sein kann („Noir sur blanc", „Anglais").
 */
const GEWAEHLT: Record<AnsageSprache, (was: string) => string> = {
  de: (was) => `${was} gewählt.`,
  en: (was) => `${was} selected.`,
  fr: (was) => `Choix : ${was}.`,
  // ★ ES-O (27.09.2026, Bauplan D6): „Elegido: …" - wie „Choix" ohne
  // Geschlechtsendung am Etikett (es kann ein Wort jeder Art sein).
  es: (was) => `Elegido: ${was}.`,
  // ★ O-IT (02.10.2026): „Scelta: …" - ohne Geschlechtsendung wie „Choix",
  // das Etikett kann ein Wort jeder Art sein („Nero su bianco", „Inglese").
  it: (was) => `Scelta: ${was}.`,
  // ★ O-PL (02.10.2026): „Wybrano: ..." - unpersönliche -no-Form, verrät kein
  // Geschlecht und passt zu jedem Etikett („Czarny na białym", „Angielski").
  pl: (was) => `Wybrano: ${was}.`,
  // ★ O-TR (02.10.2026): "Seçildi: ..." - Doppelpunkt, KEINE Endung am Etikett
  // (Glossar Regel 6; "Beyaz üzerinde siyah", "İngilizce").
  tr: (was) => `Seçildi: ${was}.`,
  // ★ O-CS (03.10.2026): "Vybráno: ..." - unpersönliche Form, verrät kein
  // Geschlecht; das Etikett steht ungebeugt nach dem Doppelpunkt ("Bílá na černé").
  cs: (was) => `Vybráno: ${was}.`,
  // ★ Punktgenau pt/br (07.11.2026): „Escolha: …" (pt und br) - ohne Geschlechtsendung am Etikett wie „Choix".
  pt: (was) => `Escolha: ${was}.`,
  br: (was) => `Escolha: ${was}.`,
};

/**
 * „Schwarz auf Weiß gewählt." / „Black on white selected."
 *
 * @param was   Das Etikett der Wahl, genau so, wie es im Menü steht.
 * @param lang  Vorgabe Deutsch - die sichtbare Oberfläche ist deutsch, auch
 *              dort, wo ein Kind englische Inhalte übt.
 */
export function ansageGewaehlt(was: string, lang: AnsageSprache = "de"): string {
  return GEWAEHLT[lang](was);
}
