/**
 * ★★★ Wächter CS-S Erwachsene (09.10.2026): die ersten TSCHECHISCHEN Serien dieser Stufe (`serienCsErwachsen1.ts`), eingehängt über
 * `serienCs.ts` → `SERIEN_CS` → `SERIEN` (nur Weg „cs", Tastaturen `cs` und `cs-qwerty`).
 *
 * Alle Prüfungen samt Gegenproben stehen EINMAL in `helfer/csSerienWaechter.ts` (Regeln: `helfer/csSerienRegeln.ts`);
 * hier steht nur, was je Stufe anders ist (die begründete Wortliste ist gemeinsam: `helfer/csSerienBelege.ts`). Vorbild: `tastenflow-serien-it-*-1.test.ts` (IT-S), Korpus-Regeln CS-T8/CS-T9.
 * Befund: `BEFUND-2026-10-09-CS-SERIEN-1.md`.
 */
import { SERIEN_CS_ERWACHSEN_1 } from "../src/lib/typing/serienCsErwachsen1";
import { csSerienWaechter } from "./helfer/csSerienWaechter";

/** Öffnungs-Einheit je Serie auf `cs` (= `cs-qwerty`), GEMESSEN - ändert sich eine Zeile, neu lesen und eintragen. */
const OEFFNET: Readonly<Record<string, string>> = {
  "cs-erwachsen-1-nocni-tramvaj": "0",
  "cs-erwachsen-1-cvakani-na-lince": "0",
  "cs-erwachsen-1-bourka-nad-lipnem": "g",
  "cs-erwachsen-1-zlato-z-otavy": "0",
  "cs-erwachsen-1-karafiaty-z-klatov": "0",
  "cs-erwachsen-1-zpivajici-fontana": "0",
  "cs-erwachsen-1-chmel-u-zatce": "/",
  "cs-erwachsen-1-caj-na-padesatce": "0",
  "cs-erwachsen-1-noc-u-ziraf": "g",
  "cs-erwachsen-1-velka-objednavka-perniku": "@",
  "cs-erwachsen-1-sala-pro-rekord": "0",
  "cs-erwachsen-1-snih-pod-pilinami": "´",
  "cs-erwachsen-1-mraziva-noc-na-palave": "ú",
  "cs-erwachsen-1-tlacitko-bez-jmena": "@",
  "cs-erwachsen-1-dron-nad-hanou": "0",
  "cs-erwachsen-1-novy-les-nad-jesenikem": "ú",
  "cs-erwachsen-1-boty-na-miru": "0",
  "cs-erwachsen-1-koseni-v-bilych-karpatech": "ˇ",
  "cs-erwachsen-1-z-dolu-na-strechy": "0",
  "cs-erwachsen-1-nocni-smena-u-pece": "0",
};

/** Diakritik-Verdachtsfälle, gelesen und richtig (Wort ⇒ warum). */
const DIAKRITIK_GELESEN: Readonly<Record<string, string>> = {
  zprava: "von rechts (Adv.) - nicht zpráva",
  party: "Gen. von parta (Clique) - nicht párty",
};

csSerienWaechter({
  stufe: "erwachsen",
  serien: SERIEN_CS_ERWACHSEN_1,
  form: { erlaubt: /^[A-Za-záčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚÝŽ0-9 .,;:?!"()%\/@#+=&€]+$/u, minWoerter: 5, maxWoerter: 18, maxZeichen: 90 },
  minZeilen: 14,
  maxZeilen: 16,
  ziffern: { mindestMit: 10, mindestOhne: 5, pflicht: ["h:mm", "@", "%", "Kč", "/"] },
  oeffnetGemessen: OEFFNET,
  diakritikGelesen: DIAKRITIK_GELESEN,
  guteZeile: 'Nájem za byt v Ostravě stojí 14 500 Kč.',
});
