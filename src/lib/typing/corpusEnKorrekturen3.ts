/**
 * R1 + R2 — Rechtschreib-Chargen vom 14./15.08.2026, ENGLISCHE Seite.
 *
 * Grundlage: `Sensorik/Pruefberichte/PRUEFBERICHT-2026-08-14-TASTENFLOW-RECHTSCHREIBUNG.md`
 * §2 (Funde E1-E9, E16) und `Sensorik/BAUPLAN-2026-08-14-TASTENFLOW-DREI-STUFEN-UND-INHALT.md`
 * §2. Reine Bindestrich-Korrekturen (E10-E14) wurden IN-PLACE gemacht — der
 * Bindestrich fällt aus `bausteinKey` heraus, die ID bleibt gleich. Hier stehen
 * die echten WORTLAUT-Änderungen; ihre Altfassungen sind in
 * `corpusDeactivatedEn.ts` stillgelegt.
 *
 * Zwei Leitplanken der englischen Seite bleiben gewahrt:
 *  1. APOSTROPHFREI (seit TN-E0c ist der Apostroph ein „hartes" Zeichen und
 *     macht eine Zeile erst ganz spät tippbar). Die vier fehlenden
 *     Genitiv-Apostrophe werden darum NICHT gesetzt, sondern die Fügung wird
 *     umgestellt („the pouch of its mother" statt „its mother's pouch").
 *  2. Britisches Englisch als Leitvarietät (Bauplan Text-Nachschub §10):
 *     maths, chilli, organise, practised.
 *
 * Jede Zeile wurde mit `minTierFor` gegen ihre Altfassung gemessen: alle bleiben
 * auf Tier 3, keine Korrektur hebt den Tier (Bauplan §2 Regel 2). `kind` und
 * `stufen` sind von den Altfassungen übernommen; die trugen keine `herkunft`.
 */
import type { CorpusItem } from "./corpus";

export const EN_KORREKTUR3_CORPUS: CorpusItem[] = [
  // --- E1-E4: Genitiv apostrophfrei umgestellt ---
  { text: "The moon of Earth is wider than the small far world Pluto.", kind: "wissen", stufen: ["kids", "teens"] },
  { text: "A baby kangaroo is called a joey, and it rides in the pouch of its mother.", kind: "wissen", stufen: ["kids", "teens"] },
  // Aussageform statt Rätsel-Schablone (TN-E9-Linie); „purrple" ohne Bindestrich,
  // damit die Pointe auch unterhalb T4 nicht als „purr ple" zerfällt.
  { text: "The favourite colour of a cat is purrple.", kind: "wortspiel", stufen: ["kids", "teens"] },
  { text: "The favourite instrument of a skeleton is the trombone.", kind: "wortspiel", stufen: ["kids", "teens", "erwachsen"] },

  // --- E5: Pangramm abgesetzt + Aussage sachlich richtig gestellt ---
  // Der Satz nutzt einzelne Buchstaben mehrfach; wahr ist, dass er alle 26
  // Buchstaben enthält. Doppelpunkt statt zweitem Satz, damit unterhalb T4
  // (wo Satzzeichen wegfallen) keine neue Mehrsatz-Zeile entsteht — die räumt
  // Charge R3 gerade ab.
  { text: "The quick brown fox jumps over the lazy dog: this sentence uses all twenty-six letters.", kind: "wissen", stufen: ["kids", "teens", "erwachsen"] },

  // --- E6-E9, E16: Wortspiel-Brüche und amerikanische Schreibungen ---
  { text: "I am reading a book on antigravity. It is impossible to put down!", kind: "witz", stufen: ["teens", "erwachsen"] },
  // E7 und E16 (Zeile „math book"): Hier deckt die Korrektur eine DUBLETTE auf —
  // der richtig geschriebene Wortlaut steht zeichengleich schon im aktiven
  // Bestand („Why was the broom late? It overswept." in corpusEn.ts,
  // „Why was the maths book sad? It had too many problems." in corpusData2.ts).
  // Ein wörtlicher Zwilling wäre eine Sorten-Dublette (Lint-Gate steht auf 0)
  // bzw. würde von `mergeCorpus` verschluckt und dabei die Stufen der jüngeren
  // Fassung mitziehen (dann stünde ein Witz gleichzeitig auf a und c — die
  // Doppel-Freigabe-Ratsche in typing-altersgrenze.test.ts darf nur sinken).
  // Darum ist der Ersatz jeweils EIGENSTÄNDIG formuliert, und zwar in der
  // Aussageform, die TN-E9 gegenüber der Frage-Antwort-Schablone bevorzugt.
  // So bleibt jede Stufe genau so gut versorgt wie vorher.
  { text: "The broom was late again. It overswept.", kind: "witz", stufen: ["kids", "teens"] },
  { text: "The maths book was unhappy. It had too many problems.", kind: "witz", stufen: ["kids", "teens"] },
  { text: "What do you call a cold dog? A chilli dog!", kind: "witz", stufen: ["kids", "teens"] },
  { text: "Why did the maths book look sad? It had too many problems!", kind: "witz", stufen: ["kids", "teens"] },
  { text: "How do you organise a space party? You planet.", kind: "witz", stufen: ["kids", "teens"] },
  { text: "She practised the same song until she knew it by heart.", kind: "satz", stufen: ["kids", "teens"] },

  // ==========================================================================
  // Charge R2 (14./15.08.2026) — Prüfbericht §3, „wahrscheinliche Funde"
  // (Positionen 23-35 der englischen Liste). Dieselben Leitplanken wie oben:
  // apostrophfrei, britisches Englisch als Leitvarietät — ABER: Johannes hat am
  // 14.08. entschieden, dass Witze, deren POINTE an der amerikanischen Fassung
  // hängt, amerikanisch BLEIBEN (cookie/truck/diner, »crumby«). Hier steht
  // darum kein einziger Wortschatz-Umbau, nur echte Fehler.
  // Jede Zeile mit `minTierFor` gegen ihre Altfassung gemessen — kein Tier
  // steigt (T1 bleibt T1, T2 bleibt T2, T3 bleibt T3).
  // ==========================================================================

  // Position 23 — »cannot« zusammengeschrieben (17 aktive Zeilen machen es vor).
  { text: "Cats can hear sounds that ears like ours cannot.", kind: "wissen", stufen: ["kids", "teens"] },
  { text: "A duck has soft feet. It cannot feel the cold ice.", kind: "wissen", stufen: ["kids"] },
  // Position 25 — »its arms« bezog sich auf das Gehirn; apostrophfrei umgestellt.
  { text: "An octopus keeps two thirds of its brain in its arms.", kind: "fakt", stufen: ["teens", "erwachsen"] },
  // Position 26 — britisch »out of«. Der Reim auf -at bleibt am Zeilenende.
  { text: "The cat ran to the rat and sat, and the rat ran out of the flat.", kind: "wortspiel", stufen: ["kids", "teens"] },
  { text: "Why did the kid throw butter out of the window? To see a butterfly!", kind: "witz", stufen: ["kids", "teens"] },
  // Position 27 — das Verb braucht das Adverb.
  { text: "A tiny shrimp can snap its claw loudly enough to stun a fish.", kind: "satz", stufen: ["kids", "teens"] },
  // Position 29 — drei Sinn-Reparaturen.
  { text: "A hen sits on her eggs to keep them warm.", kind: "wissen", stufen: ["kids"] },
  { text: "A nut takes time to become a tree.", kind: "spruch", stufen: ["kids", "teens"] },
  { text: "A snail is slow, and it likes to rest on a leaf.", kind: "wissen", stufen: ["kids"] },
  // Position 31 — im britischen Englisch ist »torch« die Taschenlampe.
  { text: "A candle is one small flame.", kind: "spruch", stufen: ["kids", "teens"] },
  // Position 32 — die beiden KORPUS-Zeilen mit »said« im Präsens-Kontext.
  // Beide bleiben im T1-Zeichensatz (a d e f i j k l n r s t ö): »tells« statt
  // »says«, weil das y erst spät kommt.
  { text: "Rain is late, Tina tells Ida.", kind: "satz", stufen: ["kids", "teens"] },
  { text: "Stars fade, Elsa tells Nils.", kind: "satz", stufen: ["kids", "teens"] },
  // Position 33 — drei Buchstabenbudget-Notlösungen, die kein Englisch sind.
  // »bus stop« scheitert am p (T2 kennt kein p q v x y z) — darum ohne
  // Haltestellen-Wort formuliert statt mit einem falschen Ersatz (Merksatz 5).
  { text: "A crowded train is a lesson in manners.", kind: "satz", stufen: ["teens", "erwachsen"] },
  { text: "The last one out turns off the light.", kind: "satz", stufen: ["teens", "erwachsen"] },
  { text: "We wait for the bus in the cold.", kind: "satz", stufen: ["kids", "teens", "erwachsen"] },
  // Position 35 — die Pointe schließt erst mit dem Gegenstück zum Schrumpfen.
  { text: "My jumper shrank, or possibly I grew.", kind: "satz", stufen: ["kids", "teens", "erwachsen"] },
];
