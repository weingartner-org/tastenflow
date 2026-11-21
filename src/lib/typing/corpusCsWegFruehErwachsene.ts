/**
 * Korpus nur für Lernweg "cs", frühe Sprossen 7-17 - Altersstufe Erwachsene (erwachsen, CS-T3, 09.10.2026; Bauplan
 * `BAUPLAN-2026-10-02-VIER-SPRACHEN-IT-PL-TR-CS.md` §4 Etappe T; Befund `BEFUND-2026-10-09-CS-T3-ERWACHSENE-FRUEH.md`).
 * Vorgehen wie CS-T1/CS-T2 (Befund CS-T1 §6); Form der Erwachsenen-Charge wie PL-T3/TR-T3.
 *
 * Johannes' Regeln, wörtlich: „keine texte werden übersetzt, Texte aus den regionen, altersgemäß und zeitgemäß" und
 * „die texte sollen einen bezug zum land und sprache haben". ALLES NEU AUF TSCHECHISCH VERFASST - keine Text-Datei einer
 * anderen Sprache als Inhalt geöffnet, nichts übersetzt, kein Tatoeba-Satz (darum kein `herkunft`). Tatoeba (Tom und Mary
 * gestrichen) diente nur als WORTLISTE je Sprosse.
 *
 * ZEICHENSATZ wie CS-T1/T2: `f j d k s l a ů | e m i n o t v ě u | ⇧` - EINE Folge für `cs` UND `cs-qwerty`; jede Zeile hat
 * auf beiden dieselbe Sprosse (der Wächter rechnet beide). `minTier` rechnet `minTierFor(text, "cs")`, nicht die Hand.
 *
 * VOR ⇧ (Regel D-2): Erwachsene bekommen klein geschriebene Zeilen ohne Satzzeichen, ohne Namen, ohne Frage. Es fehlen
 * noch `í p c h á r z b y ž š ř č é ý` - und damit fast der ganze Amts-, Arzt- und Arbeitswortschatz: kein „práce",
 * „úřad", „doktor", „nemocnice", „byt", „nájem", „peníze", „plat", „hypotéka", „chata", „dobrý den". Die Charge lebt darum
 * von dem, was auf Schildern, in Mails und Formularen steht (`smlouvu dostanete mailem`, `doklad dodejte do deseti dnů`,
 * `volejte od osmi`, `sleva jen dnes`) und von kurzen Sätzen im Alltagston (`kotel nejede`, `jsme v koloně`).
 *
 * Geschlecht: keine l-Form und kein hartes Adjektiv in der 1. oder 2. Person Einzahl; neutral sind Mehrzahl
 * (`malovali jsme sami`), Befehle und Höflichkeitsform (`odemkni dole`, `omluvte mě`), unpersönliche Formen
 * (`nedalo se odolat`, `kolem města se dolovalo`) und die 3. Person über Dinge (`loket otekl`, `tlak klesl`).
 *
 * ERWACHSENENWELT: Arbeit (Schicht, Lager, Lieferung, Kunde, Team, Vertrag), Wohnen (Heizkessel, Wasser, Nachbarn,
 * selbst ausmalen), Ämter und Geld (Steuern online, Datenbox, Lastschrift, Kontostand, Frist), Gesundheit (Blutdruck,
 * Salbe, Diät, einmal täglich), Familie (Kinder, Enkel, Krippe, „nur noch zu zweit"), Reisen und Verkehr (Stau, Abflug,
 * Diesel, Linie, Fahrrad).
 *
 * BEZUG ZU LAND UND SPRACHE (Namen erst nach ⇧; die Zuordnung ist eigenes Wissen [G], vor dem Einschalten belegen):
 *  · Böhmen: `sada skla` (Glas aus Nordböhmen), `kolem města se dolovalo` (auch Kladno und Most).
 *  · Mähren und Schlesien: `mandloně kvetou` (Mandelbäume um Hustopeče [G]), `domek v kolonii` (Arbeiterkolonien in Ostrava
 *    und Karviná [G]), `důl a sklad`, `kolem města se dolovalo` (Ostrava).
 *  · Ganz Tschechien: `odeslat datovkou` (datová schránka), `jelita od souseda` (zabijačka), `jednu sekanou` (Kantine),
 *    `jsme v koloně` (Autobahnstau), `kalamita v lese` (Borkenkäfer), `jesle`, `inkaso`, `esemeska`, `na venkově je levněji`.
 *  · Die Sprache selbst: `jistota je jistota`, `domov je domov`, `jsme na koni`, `jak kdo`, `nutno dodat`, `na viděnou`.
 * Sperrliste `sperrlisteCs.ts`: kein Wort aus Kern ODER Wortbasis.
 *
 * Wächter: `tests/tastenflow-texte-cs-erwachsene-frueh.test.ts` (Sprosse je Zeile AUSGERECHNET auf `cs` UND `cs-qwerty`,
 * Kleinschreibung, Auslieferung mit `umschalt: false`, Wortbudget, Sperrliste, Belegliste, Diakritik-Falle, keine
 * Kopien/Paare/„fast gleich" gegen die ROHE Sammelliste `corpusCs.ts`, alle Korpora, Serien und Prüfungsbanken). Nur
 * anhängen - Korpus-Anker im selben Commit (`npx tsx scripts/erzeuge-korpus-anker.mts`).
 */
import type { CorpusItem } from "./corpus";

export const CORPUS_CS_WEG_FRUEH_ERWACHSENE: CorpusItem[] = [
  // Sprosse 7 (`a`)
  { text: "sada skla", kind: "satz", stufen: ["erwachsen"], minTier: 0, nurWeg: "cs" },
  // Sprosse 8 (`ů`)
  { text: "důl a sklad", kind: "satz", stufen: ["erwachsen"], minTier: 0, nurWeg: "cs" },
  // Sprosse 9 (`e`)
  { text: "lak se leskl", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "důsledek", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  // Sprosse 10 (`m`)
  { text: "sedm sedadel", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  // Sprosse 11 (`i`)
  { text: "mail sedmi lidem", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  // Sprosse 12 (`n`)
  { text: "jen klid", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "linka nejede", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "jsme jen lidi", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "nalij mi kafe", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "jinde je jinak", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  // Sprosse 13 (`o`)
  { text: "mail jsme odeslali", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "odemkni dole", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "komise se sejde", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "kamion nedojel", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "jsme na koni", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "jak kdo", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "sedm kil dolů", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "dole je sklad", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "nikde nikdo", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  // Sprosse 14 (`t`)
  { text: "tlak klesl", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "loket otekl", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "nafta klesla", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "nesolit a nesladit", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "mast na koleno", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "kontakt na klienta", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "fotka na doklad", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "kotel nejede", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "doklad dodejte do deseti dnů", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "jistota je jistota", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "nedalo se odolat", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "letos jen online", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  // Sprosse 15 (`v`)
  { text: "kolektiv je fajn", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "odlet je v deset", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "doma jsme jen dva", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "malovali jsme sami", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "domek v kolonii", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "kalamita v lese", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "sklo a kov", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "volejte od osmi", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "vlevo dole", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "den volna", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "sleva jen dnes", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "nastavit inkaso", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "domov je domov", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "stav konta", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  // Sprosse 16 (`ě`)
  { text: "daně online", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "tak se mějte", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "jsme v koloně", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "jsme tam v devět", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "na venkově je levněji", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "směna od deseti", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "doma s dětmi", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "kolem města se dolovalo", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "led na mostě", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "do města na kole", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "stejně jako loni", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "klidně v deset", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  // Sprosse 17 (`u`)
  { text: "odstavili vodu", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "sousedka od vedle", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "smlouvu dostanete mailem", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "manko ve skladu", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "v autě je dusno", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "dostanete esemesku", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "doklad o studiu", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "odeslat datovkou", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "vnukovi je deset", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "jesle jsou daleko", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "jelita od souseda", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "mandloně kvetou", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "jen jednu sklenku", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "mouka a smetana", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "jednu sekanou", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "fitko a sauna", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "děkuji", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "na viděnou", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "omluvte mě", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "vodu a klid", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "jednou denně", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "volali sanitku", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "sjednali jsme slevu", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "domluvili jsme se", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "nutno dodat", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "doufejme", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
  { text: "deset let ve skladu", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "cs" },
];
