/**
 * ★★★ Wächter CS-S Jugendliche (12-16) (09.10.2026): die ersten TSCHECHISCHEN Serien dieser Stufe (`serienCsTeens1.ts`), eingehängt über
 * `serienCs.ts` → `SERIEN_CS` → `SERIEN` (nur Weg „cs", Tastaturen `cs` und `cs-qwerty`).
 *
 * Alle Prüfungen samt Gegenproben stehen EINMAL in `helfer/csSerienWaechter.ts` (Regeln: `helfer/csSerienRegeln.ts`);
 * hier steht nur, was je Stufe anders ist (die begründete Wortliste ist gemeinsam: `helfer/csSerienBelege.ts`). Vorbild: `tastenflow-serien-it-*-1.test.ts` (IT-S), Korpus-Regeln CS-T8/CS-T9.
 * Befund: `BEFUND-2026-10-09-CS-SERIEN-1.md`.
 */
import { SERIEN_CS_TEENS_1 } from "../src/lib/typing/serienCsTeens1";
import { csSerienWaechter } from "./helfer/csSerienWaechter";

/** Öffnungs-Einheit je Serie auf `cs` (= `cs-qwerty`), GEMESSEN - ändert sich eine Zeile, neu lesen und eintragen. */
const OEFFNET: Readonly<Record<string, string>> = {
  "cs-teens-1-robot-jmenem-kostka": "#",
  "cs-teens-1-stribro-pod-kutnou-horou": "%",
  "cs-teens-1-slajsna-u-krumlova": "ú",
  "cs-teens-1-brankarka-z-budejic": "0",
  "cs-teens-1-blesk-v-techmanii": "g",
  "cs-teens-1-brigada-na-medardu": "0",
  "cs-teens-1-kruh-na-piskovci": "g",
  "cs-teens-1-skok-pod-jestedem": "ˇ",
  "cs-teens-1-kapela-z-garaze": "#",
  "cs-teens-1-prach-na-ploche-draze": "8",
  "cs-teens-1-keska-na-orliku": "´",
  "cs-teens-1-hul-pro-zavodnici": "9",
  "cs-teens-1-salinou-na-prygl": "#",
  "cs-teens-1-kost-pod-palavou": "0",
  "cs-teens-1-unikova-hra-v-pevnosti": "ú",
  "cs-teens-1-mlha-na-rejvizu": "´",
  "cs-teens-1-bota-ve-vytahu": "@",
  "cs-teens-1-cimbal-a-beat": "ˇ",
  "cs-teens-1-fotka-od-vysoke-pece": "0",
  "cs-teens-1-gryfny-tyden": "#",
};

/** Diakritik-Verdachtsfälle, gelesen und richtig (Wort ⇒ warum). */
const DIAKRITIK_GELESEN: Readonly<Record<string, string>> = {
  dolu: "Gen. von důl (do dolu: ins Bergwerk) - nicht dolů",
  hezky: "Adverb (svítí hezky) - nicht hezký",
  stěně: "Lok. von stěna (na stěně: an der Wand) - nicht štěně",
  party: "Gen. von parta (Clique) - nicht párty",
};

csSerienWaechter({
  stufe: "teens",
  serien: SERIEN_CS_TEENS_1,
  form: { erlaubt: /^[A-Za-záčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚÝŽ0-9 .,;:?!"()%\/@#+=]+$/u, minWoerter: 4, maxWoerter: 18 },
  minZeilen: 14,
  maxZeilen: 16,
  ziffern: { mindestMit: 4, mindestOhne: 4, pflicht: ["h:mm", "@", "#", "%", "Kč"] },
  oeffnetGemessen: OEFFNET,
  diakritikGelesen: DIAKRITIK_GELESEN,
  guteZeile: 'Trénink začíná v 16:30, sraz je u haly.',
});
