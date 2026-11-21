/**
 * ENGLISCHE Deaktivierungs-Liste (Textwelt §9, englische Seite) — dieselbe
 * Mechanik wie DEACTIVATED (corpusDeactivated.ts): nicht löschen, nur beim
 * SERVIEREN überspringen, damit die Manifest-Indizes des No-Repeat-Ledgers
 * stabil bleiben.
 */
import type { DeactivatedEntry } from "./corpusDeactivated";

/**
 * ENGLISCHE Nachlage (Textwelt §9, englische Seite): Derselbe Befund wie im
 * deutschen TW-E4-Audit, nur größer — 18 Witz-Rätsel („Frage? Pointe") sind auf
 * der englischen Seite als `spruch`, `fakt` oder `satz` getaggt. Sie laufen damit
 * im Lese-Modul „Wissenswertes" und unter den Sprüchen mit, wo sie inhaltlich
 * nichts verloren haben — und derselbe Witz erscheint teils VIERFACH (einmal als
 * witz, dazu als spruch, fakt und satz).
 *
 * Gelöscht wird nichts (Ledger-Indizes bleiben stabil) — die Einträge werden nur
 * beim Servieren übersprungen. Sechs Witze, die es bisher NUR unter der falschen
 * Sorte gab, kommen in `corpusEnWitz.ts` sauber als `witz` zurück; drei weitere
 * sind Dubletten bzw. schwächere Varianten vorhandener Witze und fallen bewusst
 * weg (jeweils in `reason` vermerkt).
 */
const EN_WITZ_FEHLTAG = "Witz-Rätsel, keine Weisheit/kein Fakt — läuft sonst im falschen Modul mit.";

export const DEACTIVATED_EN: readonly DeactivatedEntry[] = [
  // --- als `spruch` getaggte Witz-Rätsel ---
  { kind: "spruch", text: "What did the cookie say at the doctor? I feel crummy!", reason: EN_WITZ_FEHLTAG + " Kommt als witz zurück." },
  { kind: "spruch", text: "What do you call a sleeping dinosaur? A dino-snore!", reason: EN_WITZ_FEHLTAG + " Existiert korrekt als witz." },
  { kind: "spruch", text: "What is orange and sounds like a parrot? A carrot!", reason: EN_WITZ_FEHLTAG + " Existiert korrekt als witz." },
  { kind: "spruch", text: "Why did the orange stop? It ran out of juice!", reason: EN_WITZ_FEHLTAG + " Kommt als witz zurück." },
  { kind: "spruch", text: "What has hands but cannot clap? A clock!", reason: EN_WITZ_FEHLTAG + " Existiert korrekt als witz." },
  { kind: "spruch", text: "What is a cat on ice? One cool cat!", reason: EN_WITZ_FEHLTAG + " Kommt als witz zurück." },
  { kind: "spruch", text: "Why was the math book sad? It had too many problems!", reason: EN_WITZ_FEHLTAG + " Existiert korrekt als witz." },
  { kind: "spruch", text: "What runs but never walks? A river!", reason: EN_WITZ_FEHLTAG + " Kommt als witz zurück." },
  { kind: "spruch", text: "Why did the bee get good grades? It loved the buzz of learning!", reason: EN_WITZ_FEHLTAG + " Zweiter Bienen-Schulwitz — die Variante mit der spelling bee bleibt." },

  // --- als `fakt` getaggte Witz-Rätsel (liefen im Modul „Wissenswertes" mit) ---
  { kind: "fakt", text: "What do you call a sleeping dinosaur? A dino-snore!", reason: EN_WITZ_FEHLTAG + " Existiert korrekt als witz." },
  { kind: "fakt", text: "Why did the banana go to the doctor? It was not peeling well!", reason: EN_WITZ_FEHLTAG + " Existiert korrekt als witz." },

  // --- als `satz` getaggte Witz-Rätsel ---
  { kind: "satz", text: "Why did the bee get good marks? It was a real spelling bee!", reason: EN_WITZ_FEHLTAG + " Kommt als witz zurück." },
  { kind: "satz", text: "What do you call a sleeping dinosaur? A dino-snore!", reason: EN_WITZ_FEHLTAG + " Existiert korrekt als witz." },
  { kind: "satz", text: "What is orange and sounds like a parrot? A carrot!", reason: EN_WITZ_FEHLTAG + " Existiert korrekt als witz." },
  { kind: "satz", text: "Why did the cookie visit the doctor? It felt crumby!", reason: EN_WITZ_FEHLTAG + " Zudem schwächere Variante mit Schreibfehler (crumby statt crummy) — die richtige Fassung bleibt. (Nachtrag R2: crumby ist seit 14.08. als Pointen-Schreibweise ENTSCHIEDEN und bleibt in den aktiven Zeilen)" },
  { kind: "satz", text: "How do trees get online? They simply log in!", reason: EN_WITZ_FEHLTAG + " Kommt als witz zurück." },
  { kind: "satz", text: "Why was the math book sad? It had too many problems!", reason: EN_WITZ_FEHLTAG + " Existiert korrekt als witz." },
  { kind: "satz", text: "What do clouds wear under their coats? Thunderwear!", reason: EN_WITZ_FEHLTAG + " Dublette zum vorhandenen Witz über den Regenmantel." },

  // --- P1-Inhaltsfehler (Prüfbericht 2026-07-27, „Priorisierte Empfehlungen") ---
  { kind: "fakt", text: "The tongue is the strongest muscle for its size in the body.", reason: "Verbreiteter Mythos, sachlich falsch (P1-Prüfbericht 2026-07-27) — die Zunge ist kein einzelner Muskel und in keiner gängigen Messgröße die stärkste." },
  { kind: "wortspiel", text: "The words save and vase are reverses of each other.", reason: "Sachlich falsch (P1-Prüfbericht 2026-07-27): save rückwärts ist evas — Anagramm, keine Umkehrung." },
  // --- TN-E9 Humor-Offensive: Pointen, die auch Muttersprachler ratlos lassen
  // bzw. für D-A-CH-Lernende kulturell unzugänglich sind (Prüfbericht 27.07.).
  { kind: "witz", text: "What is fast, loud and crunchy? A rocket chip.", reason: "Pointe ergibt kein bekanntes Objekt — verwirrt auch Muttersprachler (TN-E9)." },
  { kind: "witz", text: "Why can't your nose be twelve inches long? Because then it would be a foot.", reason: "Pointe setzt Zoll/Fuß voraus — für D-A-CH-Lernende unzugänglich (TN-E9)." },
  { kind: "witz", text: "Why did the bee get good marks? It was a real spelling bee!", reason: "Das Konzept spelling bee existiert im deutschen Sprachraum nicht — Pointe unzugänglich (TN-E9)." },
  { kind: "satz", text: "Why did the bee get good marks? It was a real spelling bee!", reason: "Dieselbe Zeile stand zusätzlich als satz im Bestand (Fehl-Sorte) — mit stillgelegt (TN-E9)." },

  // --- TN-E10 Aufräum-Charge: SORTEN-DUBLETTEN (siehe corpusDeactivated.ts) ---
  { kind: "wortspiel", text: "What do you call a bear with no teeth? A gummy bear!", reason: "Sorten-Dublette (TN-E10): läuft zusätzlich als witz — dort richtig, hier doppelt serviert." },
  { kind: "wortspiel", text: "What do you call a pig that does karate? A pork chop.", reason: "Sorten-Dublette (TN-E10): läuft zusätzlich als witz — dort richtig, hier doppelt serviert." },
  { kind: "wortspiel", text: "What do you call cheese that is not yours? Nacho cheese.", reason: "Sorten-Dublette (TN-E10): läuft zusätzlich als witz — dort richtig, hier doppelt serviert." },
  { kind: "wortspiel", text: "I am on a seafood diet: I see food and I eat it.", reason: "Sorten-Dublette (TN-E10): läuft zusätzlich als witz — dort richtig, hier doppelt serviert." },
  { kind: "wortspiel", text: "I used to be a banker, but I lost interest.", reason: "Sorten-Dublette (TN-E10): läuft zusätzlich als witz — dort richtig, hier doppelt serviert." },
  { kind: "spruch", text: "Slow and steady wins the race.", reason: "Sorten-Dublette (TN-E10): läuft zusätzlich als sprichwort — dort richtig, hier doppelt serviert." },
  { kind: "spruch", text: "The early bird catches the worm.", reason: "Sorten-Dublette (TN-E10): läuft zusätzlich als sprichwort — dort richtig, hier doppelt serviert." },
  { kind: "spruch", text: "Where there is a will, there is a way.", reason: "Sorten-Dublette (TN-E10): läuft zusätzlich als sprichwort — dort richtig, hier doppelt serviert." },
  { kind: "wortspiel", text: "How does the moon cut its hair? Eclipse it.", reason: "Sorten-Dublette (TN-E10): läuft zusätzlich als witz — dort richtig, hier doppelt serviert." },
  { kind: "wortspiel", text: "What do you call a belt made of watches? A waist of time.", reason: "Sorten-Dublette (TN-E10): läuft zusätzlich als witz — dort richtig, hier doppelt serviert." },
  { kind: "spruch", text: "Look before you leap.", reason: "Sorten-Dublette (TN-E10): läuft zusätzlich als sprichwort — dort richtig, hier doppelt serviert." },
  { kind: "spruch", text: "Honesty is the best policy.", reason: "Sorten-Dublette (TN-E10): läuft zusätzlich als sprichwort — dort richtig, hier doppelt serviert." },
  { kind: "wortspiel", text: "What do you call a fish with no eyes? A fsh.", reason: "Sorten-Dublette (TN-E10): läuft zusätzlich als witz — dort richtig, hier doppelt serviert." },
  { kind: "wortspiel", text: "What do you call a sleeping bull? A bulldozer!", reason: "Sorten-Dublette (TN-E10): läuft zusätzlich als witz — dort richtig, hier doppelt serviert." },
  { kind: "wortspiel", text: "What do you call a fake noodle? An impasta.", reason: "Sorten-Dublette (TN-E10): läuft zusätzlich als witz — dort richtig, hier doppelt serviert." },
  { kind: "wortspiel", text: "What is brown and sticky? A stick.", reason: "Sorten-Dublette (TN-E10): läuft zusätzlich als witz — dort richtig, hier doppelt serviert." },
  { kind: "wortspiel", text: "What do you call a dog that can do magic? A labracadabrador.", reason: "Sorten-Dublette (TN-E10): läuft zusätzlich als witz — dort richtig, hier doppelt serviert." },
  { kind: "wortspiel", text: "What did the big flower say to the little flower? Hi, bud!", reason: "Sorten-Dublette (TN-E10): läuft zusätzlich als witz — dort richtig, hier doppelt serviert." },
  // --- TN-E12 Nachzügler: Grammatik-/Sinnfehler (Prüfbericht 27.07., Teil 2) ---
  // Korrigierte Fassungen in corpusEnKorrekturen.ts.
  { kind: "satz", text: "A week feels short, an hour feels not.", reason: "Ungrammatisch (an hour feels not) - korrigiert in corpusEnKorrekturen.ts (TN-E12)." },
  { kind: "satz", text: "It looks a lot smaller once we started.", reason: "Zeitform-Bruch (Praesens + once we started); korrigiert (TN-E12)." },
  { kind: "satz", text: "The football rolls into the neighbour garden.", reason: "Fehlendes Genitiv-s (the neighbour garden); korrigiert (TN-E12)." },
  { kind: "satz", text: "The bread in the bag is a bit late.", reason: "Sinnleer - gemeint war stale, nicht late; korrigiert (TN-E12)." },
  { kind: "satz", text: "The oat cake broke and it was clean.", reason: "Unverstaendlich (broke and it was clean); korrigiert (TN-E12)." },
  { kind: "satz", text: "We are ten and we need one more.", reason: "Deutsche Struktur (We are ten) - klingt nach Altersangabe; korrigiert (TN-E12)." },
  { kind: "satz", text: "We hang a small torch in the front window.", reason: "BrE torch heisst Taschenlampe - gemeint war eine Laterne; korrigiert (TN-E12)." },
  { kind: "satz", text: "The class hut is cold, so we all sing.", reason: "class hut ist keine englische Fuegung; korrigiert (TN-E12)." },
  // --- TN-E13: Apostroph-Zeilen (erschienen erst ganz spät) und amerikanische
  // Schreibungen (§10-Leitvarietät ist britisches Englisch). Beides kommt
  // korrigiert in corpusEnKorrekturen2.ts zurück.
  { kind: "witz", text: "What is a snowman's favorite breakfast? Snowflakes.", reason: "Apostroph macht die Zeile erst ganz spaet tippbar (TN-E13)." },
  { kind: "witz", text: "Why don't skeletons fight each other? They don't have the guts.", reason: "Apostroph macht die Zeile erst ganz spaet tippbar (TN-E13)." },
  { kind: "witz", text: "Why did the gym close down? It just didn't work out.", reason: "Apostroph macht die Zeile erst ganz spaet tippbar (TN-E13)." },
  { kind: "witz", text: "Why can't you trust an atom? They make up everything.", reason: "Apostroph macht die Zeile erst ganz spaet tippbar (TN-E13)." },
  { kind: "witz", text: "Why don't scientists trust stairs? They are always up to something.", reason: "Apostroph macht die Zeile erst ganz spaet tippbar (TN-E13)." },
  { kind: "witz", text: "What is the best thing about Switzerland? I don't know, but the flag is a big plus.", reason: "Apostroph macht die Zeile erst ganz spaet tippbar (TN-E13)." },
  { kind: "witz", text: "I told my computer I needed a break, and now it won't stop sending me ads for holidays.", reason: "Apostroph macht die Zeile erst ganz spaet tippbar (TN-E13)." },
  { kind: "witz", text: "I would tell you a chemistry joke, but I know I wouldn't get a reaction.", reason: "Apostroph macht die Zeile erst ganz spaet tippbar (TN-E13)." },
  { kind: "witz", text: "My plants are very low maintenance. Plastic doesn't need water.", reason: "Apostroph macht die Zeile erst ganz spaet tippbar (TN-E13)." },
  { kind: "fakt", text: "The human brain uses about a fifth of the body's energy.", reason: "Apostroph macht die Zeile erst ganz spaet tippbar (TN-E13)." },
  { kind: "witz", text: "Why do cows wear bells? Because their horns don't work.", reason: "Apostroph macht die Zeile erst ganz spaet tippbar (TN-E13)." },
  { kind: "witz", text: "What is a tornado's favorite game? Twister.", reason: "Apostroph macht die Zeile erst ganz spaet tippbar (TN-E13)." },
  { kind: "witz", text: "Why don't eggs tell jokes? They would crack each other up.", reason: "Apostroph macht die Zeile erst ganz spaet tippbar (TN-E13)." },
  { kind: "witz", text: "What is a scarecrow's favorite fruit? Straw-berries.", reason: "Apostroph macht die Zeile erst ganz spaet tippbar (TN-E13)." },
  { kind: "witz", text: "My calendar said meeting at noon, and I still wasn't ready by then.", reason: "Apostroph macht die Zeile erst ganz spaet tippbar (TN-E13)." },
  { kind: "fakt", text: "A shrimp's heart is in its head.", reason: "Apostroph macht die Zeile erst ganz spaet tippbar (TN-E13)." },
  { kind: "witz", text: "What is brown, hairy and wears sunglasses? A coconut on vacation.", reason: "Amerikanische Schreibung; §10 legt britisches Englisch fest (TN-E13)." },
  { kind: "witz", text: "I have a lot of growing up to do. I realized this at the office today.", reason: "Amerikanische Schreibung; §10 legt britisches Englisch fest (TN-E13)." },
  { kind: "wissen", text: "A rainbow has many colors lined up next to each other.", reason: "Amerikanische Schreibung; §10 legt britisches Englisch fest (TN-E13)." },
  { kind: "rechnung", text: "100 centimeters make one meter.", reason: "Amerikanische Schreibung; §10 legt britisches Englisch fest (TN-E13)." },
  { kind: "rechnung", text: "1000 meters make one kilometer.", reason: "Amerikanische Schreibung; §10 legt britisches Englisch fest (TN-E13)." },
  { kind: "rechnung", text: "1000 milliliters make one liter.", reason: "Amerikanische Schreibung; §10 legt britisches Englisch fest (TN-E13)." },
  { kind: "witz", text: "What color does a cat like best? Purrple!", reason: "Amerikanische Schreibung; §10 legt britisches Englisch fest (TN-E13)." },
  { kind: "witz", text: "Why are elevator jokes so good? They work on many levels!", reason: "Amerikanische Schreibung; §10 legt britisches Englisch fest (TN-E13)." },
{ kind: "fakt", text: "The moon moves a few centimeters farther from Earth every year.", reason: "Amerikanische Schreibung; §10 legt britisches Englisch fest (TN-E13)." },
  { kind: "fakt", text: "The Eiffel Tower can be a few centimeters taller in summer heat.", reason: "Amerikanische Schreibung; §10 legt britisches Englisch fest (TN-E13)." },

  // --- Rechtschreib-Charge R1 (14.08.2026), englische Wortlaut-Änderungen ---
  // Korrigierte Fassungen: `corpusEnKorrekturen3.ts` (hinten angehängt).
  // Fehlender Genitiv-Apostroph. Der aktive Bestand ist seit TN-E13 bewusst
  // APOSTROPHFREI (sonst erst ganz spät tippbar) — darum nicht den Apostroph
  // einsetzen, sondern die Fügung umstellen.
  { kind: "wissen", text: "Earths moon is wider than the small far world Pluto.", reason: "Rechtschreib-Charge R1 14.08.2026: fehlender Genitiv-Apostroph (Fund E1); apostrophfrei umgestellt statt Apostroph gesetzt." },
  { kind: "wissen", text: "A baby kangaroo is called a joey, and it rides in its mothers pouch.", reason: "Rechtschreib-Charge R1 14.08.2026: fehlender Genitiv-Apostroph (Fund E2); apostrophfrei umgestellt statt Apostroph gesetzt." },
  { kind: "wortspiel", text: "What is a cats favourite colour? Purr-ple.", reason: "Rechtschreib-Charge R1 14.08.2026: fehlender Genitiv-Apostroph (Fund E3); apostrophfrei umgestellt statt Apostroph gesetzt." },
  { kind: "wortspiel", text: "What is a skeletons favourite instrument? The trombone.", reason: "Rechtschreib-Charge R1 14.08.2026: fehlender Genitiv-Apostroph (Fund E4); apostrophfrei umgestellt statt Apostroph gesetzt." },
  // Wortlaut- und Schreibungsfehler.
  { kind: "wissen", text: "The quick brown fox jumps over the lazy dog uses every letter once over.", reason: "Rechtschreib-Charge R1 14.08.2026: Pangramm nicht abgesetzt, »once over« ist kein Englisch (Fund E5); zusätzlich war die Aussage sachlich schief (der Satz nutzt Buchstaben mehrfach, aber alle 26 mindestens einmal)." },
  { kind: "witz", text: "I am reading a book on anti gravity. It is impossible to put down!", reason: "Rechtschreib-Charge R1 14.08.2026: »anti gravity« wird zusammengeschrieben (Fund E6) — corpusData2.ts macht es andernorts vor." },
  { kind: "witz", text: "Why was the broom late? It over swept!", reason: "Rechtschreib-Charge R1 14.08.2026: das Wortspiel bricht bei getrenntem »over swept« (Fund E7); richtig ist »overswept«. Ersatz eigenständig formuliert, weil der wörtlich korrigierte Satz zeichengleich mit der schon aktiven Fassung in corpusEn.ts wäre." },
  { kind: "witz", text: "What do you call a cold dog? A chili dog!", reason: "Rechtschreib-Charge R1 14.08.2026: britische Schreibung ist »chilli« (Fund E8; §10-Leitvarietät)." },
  { kind: "witz", text: "Why did the math book look sad? It had too many problems!", reason: "Rechtschreib-Charge R1 14.08.2026: britisch »maths« (Fund E9; §10-Leitvarietät)." },
  { kind: "witz", text: "Why was the math book sad? It had too many problems.", reason: "Rechtschreib-Charge R1 14.08.2026: britisch »maths« (Fund E16). Der wörtlich korrigierte Satz wäre zeichengleich mit dem schon aktiven wortspiel in corpusData2.ts (Sorten-Dublette, Lint-Gate steht auf 0) — darum ist der Ersatz eigenständig in Aussageform formuliert." },
  { kind: "witz", text: "How do you organize a space party? You planet.", reason: "Rechtschreib-Charge R1 14.08.2026: britisch »organise« (Fund E16; §10-Leitvarietät)." },
  { kind: "satz", text: "She practiced the same song until she knew it by heart.", reason: "Rechtschreib-Charge R1 14.08.2026: britisch »practised« (Fund E16; §10-Leitvarietät)." },

  // --- Rechtschreib-Charge R2 (14./15.08.2026), englische Wortlaut-Änderungen ---
  // Korrigierte Fassungen: `corpusEnKorrekturen3.ts` (hinten angehängt).
  // Prüfbericht 14.08. §3, Positionen 23-35. Die Positionen 24 (deep-sea),
  // 32 (Serien-Zeilen) und 34 (recorded) waren in-place erledigt und stehen
  // darum nicht hier.
  { kind: "wissen", text: "Cats can hear sounds that ears like ours can not.", reason: "R2 14.08.2026: »cannot« wird zusammengeschrieben (Position 23); 17 andere aktive Zeilen machen es vor." },
  { kind: "wissen", text: "A duck has soft feet. It can not feel the cold ice.", reason: "R2 14.08.2026: »cannot« wird zusammengeschrieben (Position 23)." },
  { kind: "fakt", text: "Two thirds of an octopus brain sits in its arms.", reason: "R2 14.08.2026: »its arms« bezog sich grammatisch auf das Gehirn, nicht auf den Oktopus (Position 25); apostrophfrei umgestellt." },
  { kind: "wortspiel", text: "The cat ran to the rat and sat, and the rat ran out the flat.", reason: "R2 14.08.2026: britisch »ran out of the flat« (Position 26); der Reim auf -at bleibt erhalten." },
  { kind: "witz", text: "Why did the kid throw butter out the window? To see a butterfly!", reason: "R2 14.08.2026: britisch »out of the window« (Position 26)." },
  { kind: "satz", text: "A tiny shrimp can snap its claw loud enough to stun a fish.", reason: "R2 14.08.2026: Das Verb braucht das Adverb »loudly« (Position 27)." },
  { kind: "wissen", text: "A hen sits on her eggs to keep the little chicks warm.", reason: "R2 14.08.2026: Im Ei sitzen noch keine Küken - die Henne wärmt die Eier (Position 29)." },
  { kind: "spruch", text: "A nut takes a tree some time.", reason: "R2 14.08.2026: Die Fügung ist verdreht - nicht die Nuss braucht einen Baum, sondern der Baum braucht Zeit (Position 29)." },
  { kind: "wissen", text: "A snail is so slow it likes to rest on a leaf.", reason: "R2 14.08.2026: »so slow … it likes« behauptet eine Ursache, die es nicht gibt (Position 29)." },
  { kind: "spruch", text: "A torch is one small flame.", reason: "R2 14.08.2026: Im britischen Englisch ist »torch« die Taschenlampe und hat keine Flamme (Position 31; die Falle war schon TN-E12-Thema)." },
  { kind: "satz", text: "Rain is late, said Tina.", reason: "R2 14.08.2026: Zeitform-Bruch - Aussage im Präsens, Redeeinleitung im Präteritum (Position 32). »says« braucht das späte y, »tells« nicht." },
  { kind: "satz", text: "Stars fade, Elsa said.", reason: "R2 14.08.2026: Zeitform-Bruch wie oben (Position 32)." },
  { kind: "satz", text: "A crowded train is a school in manners.", reason: "R2 14.08.2026: »a school in manners« ist keine englische Fügung (Position 33); »a lesson in manners« schon." },
  { kind: "satz", text: "The last one out cuts the light.", reason: "R2 14.08.2026: Licht wird nicht »geschnitten« (Position 33) - »turns off the light«." },
  { kind: "satz", text: "We wait at the bus stand in the cold.", reason: "R2 14.08.2026: »bus stand« ist keine britische Fügung (Position 33). »bus stop« scheitert am p (im T2-Zeichensatz gesperrt), darum ohne Haltestellen-Wort formuliert." },
  { kind: "satz", text: "My jumper shrank, or possibly I did not.", reason: "R2 14.08.2026: Die Pointe schließt nicht - das Gegenstück zum Schrumpfen ist das Wachsen (Position 35)." },
];

