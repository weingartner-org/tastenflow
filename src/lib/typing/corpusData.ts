/**
 * GENERIERTE Korpus-Daten für den Trainer „Tastenflow" (Witze, Zungenbrecher,
 * Wortspiele, Sprüche, Fakten, Sätze) — erzeugt und adversarisch geprüft
 * (Rechtschreibung, Alterseignung, Anti-Cringe, Faktencheck) durch den
 * Korpus-Workflow. NICHT von Hand editieren; bei Neulauf wird die Datei ersetzt.
 * Handgepflegte Ergänzungen + Wortschatz + Markov-Saat liegen in `corpusExtras.ts`.
 *
 * Zeichen-Invariante: nur tippbare Zeichen (a–z, ä ö ü ß, Großbuchstaben, 0–9,
 * Leerzeichen, , . - ? ! : ;).
 */
import type { CorpusItem } from "./corpus";

export const GENERATED_CORPUS: CorpusItem[] = [
  // ---- witz ----
  {
    text: "Mein Akku hält ewig. Genauer gesagt bis kurz vor dem wichtigen Anruf.",
    kind: "witz",
    stufen: ["erwachsen"],
  },
  {
    text: "Mein Chef sagt, ich sei unersetzlich. Vermutlich, weil keiner es will.",
    kind: "witz",
    stufen: ["erwachsen"],
  },
  {
    text: "Mein Garten ist pflegeleicht. Es lebt dort nur noch Unkraut.",
    kind: "witz",
    stufen: ["erwachsen"],
  },
  {
    text: "Mein Kalender ist voll. Leider nur mit Terminen, nicht mit Erfolgen.",
    kind: "witz",
    stufen: ["erwachsen"],
  },
  {
    text: "Mein Sparschwein ist bescheiden. Es lebt von Luft und guten Vorsätzen.",
    kind: "witz",
    stufen: ["erwachsen"],
  },
  {
    text: "Mein Wecker und ich haben ein gespanntes Verhältnis. Beide morgens stur.",
    kind: "witz",
    stufen: ["erwachsen"],
  },
  {
    text: "Meine Diät beginnt morgen. Sie beginnt seit Jahren zuverlässig morgen.",
    kind: "witz",
    stufen: ["erwachsen"],
  },
  {
    text: "Treffen sich zwei Kerzen. Sagt die eine: Ist Wasser gefährlich?",
    kind: "witz",
    stufen: ["teens"],
  },
  {
    text: "Treffen sich zwei Magneten. Sagt der eine: Ich finde dich anziehend.",
    kind: "witz",
    stufen: ["teens"],
  },
  {
    text: "Warum geht der Hase zur Schule? Er will Karotten zählen lernen.",
    kind: "witz",
    stufen: ["kids"],
  },
  {
    text: "Warum ging der Keks zum Arzt? Weil er sich elend krümelig fühlte.",
    kind: "witz",
    stufen: ["kids", "teens"],
  },
  {
    text: "Warum konnte der Pilz keine Freunde finden? Er war einfach zu schwammig.",
    kind: "witz",
    stufen: ["kids", "teens"],
  },
  {
    text: "Warum können Geister so schlecht lügen? Man sieht durch sie durch.",
    kind: "witz",
    stufen: ["teens"],
  },
  {
    text: "Warum lacht die Banane? Weil der Affe sie kitzelt.",
    kind: "witz",
    stufen: ["kids"],
  },
  {
    text: "Warum lacht die Uhr nie? Sie hat einfach keine Zeit dafür.",
    kind: "witz",
    stufen: ["erwachsen"],
  },
  {
    text: "Warum mag der Physiker Montag? Wegen der vielen Anfangsbedingungen.",
    kind: "witz",
    stufen: ["erwachsen"],
  },
  {
    text: "Warum mögen Buchhalter den Herbst? Da fallen endlich die Zahlen.",
    kind: "witz",
    stufen: ["erwachsen"],
  },
  {
    text: "Warum nehmen Bienen kein Handy mit? Sie haben schon ihren Stock.",
    kind: "witz",
    stufen: ["teens"],
  },
  {
    text: "Warum nehmen Skelette nie an einem Streit teil? Sie haben keine Nerven.",
    kind: "witz",
    stufen: ["kids", "teens"],
  },
  {
    text: "Warum singt der Vogel so früh? Er weckt die ganze Wiese auf.",
    kind: "witz",
    stufen: ["kids"],
  },
  {
    text: "Warum trinkt der Optimist Tee? Weil das Glas halb voll bleibt.",
    kind: "witz",
    stufen: ["erwachsen"],
  },
  {
    text: "Warum war das Mathebuch traurig? Es hatte zu viele Probleme.",
    kind: "witz",
    stufen: ["teens"],
  },
  {
    text: "Warum war der Computer im Winter krank? Er hatte einen fiesen Virus.",
    kind: "witz",
    stufen: ["kids", "teens"],
  },
  {
    text: "Was ist grün und steht vor der Tür? Ein Klopfsalat.",
    kind: "witz",
    stufen: ["kids", "teens"],
  },
  {
    text: "Was ist orange und klingt wie ein Papagei? Eine Karotte.",
    kind: "witz",
    stufen: ["teens"],
  },
  {
    text: "Was ist weiß und stört beim Frühstück? Eine Lawine.",
    kind: "witz",
    // Doppelt im Bestand (auch corpusExtras, dort a/b). mergeCorpus VEREINIGT die
    // Stufen von Dubletten — mit ["c"] wäre der Kinderwitz trotz Retag wieder bei
    // den 13–15-Jährigen gelandet. Angeglichen; Entdopplung selbst macht TN-E10.
    stufen: ["kids", "teens"],
  },
  {
    text: "Was macht der Fisch in der Schule? Er schwimmt von Buch zu Buch.",
    kind: "witz",
    stufen: ["kids"],
  },
  {
    text: "Was macht die Kuh auf dem Eis? Sie gibt kalte Milch.",
    kind: "witz",
    stufen: ["kids"],
  },
  {
    text: "Was macht ein Mathebuch beim Arzt? Es klagt über zu viele Probleme.",
    kind: "witz",
    stufen: ["kids", "teens"],
  },
  {
    text: "Was macht ein Mathematiker im Garten? Er zieht Wurzeln.",
    kind: "witz",
    stufen: ["teens"],
  },
  {
    text: "Was macht ein Pirat am Computer? Er drückt die Enter-Taste.",
    kind: "witz",
    stufen: ["teens"],
  },
  {
    text: "Was sagt der Große zum kleinen Stift? Wachs mal nach, du Knirps.",
    kind: "witz",
    stufen: ["teens"],
  },
  {
    text: "Was sagt der Pessimist im Aufzug? Es geht wohl wieder mal abwärts.",
    kind: "witz",
    stufen: ["erwachsen"],
  },
  {
    text: "Was sagt die Katze am Computer? Maus, ich habe dich!",
    kind: "witz",
    stufen: ["kids"],
  },
  {
    text: "Was sagt die Schnecke zur Eile? Immer langsam, ich komme schon!",
    kind: "witz",
    stufen: ["kids"],
  },
  {
    text: "Was sagt ein Stein zum anderen? Mensch, du rockst total!",
    kind: "witz",
    stufen: ["kids", "teens"],
  },
  {
    text: "Was trägt der Frosch beim Regen? Gar nichts, er wird gerne nass.",
    kind: "witz",
    stufen: ["kids"],
  },
  {
    text: "Welches Tier kann gut rechnen? Das Oktoplus.",
    kind: "witz",
    stufen: ["kids"],
  },
  {
    text: "Wie nennt man einen Bumerang, der nicht zurückkommt? Einen Stock.",
    kind: "witz",
    stufen: ["kids", "teens"],
  },
  {
    text: "Wie nennt man einen Bumerang, der nicht zurückkommt? Stock.",
    kind: "witz",
    stufen: ["teens"],
  },
  {
    text: "Wie nennt man einen Dinosaurier mit Schnupfen? Schniefosaurus.",
    kind: "witz",
    stufen: ["teens"],
  },
  {
    text: "Wie nennt man einen Kaffee ohne Koffein? Eine Enttäuschung in Braun.",
    kind: "witz",
    stufen: ["erwachsen"],
  },
  {
    text: "Wie nennt man einen lustigen Hund? Einen Spaßvogel auf vier Pfoten.",
    kind: "witz",
    stufen: ["kids"],
  },
  {
    text: "Wie zählt die Spinne? Mit acht Beinen geht das ganz fix.",
    kind: "witz",
    stufen: ["kids"],
  },
  // ---- zungenbrecher ----
  {
    text: "Acht alte Ameisen aßen am Abend appetitliche Apfelschalen.",
    kind: "zungenbrecher",
    stufen: ["erwachsen"],
  },
  {
    text: "Brautkleid bleibt Brautkleid und Blaukraut bleibt Blaukraut.",
    kind: "zungenbrecher",
    stufen: ["teens", "erwachsen"],
  },
  {
    text: "Brave Bienen brummen bei brauchbar braunem Brombeerbrei besonders brav.",
    kind: "zungenbrecher",
    stufen: ["kids", "teens"],
  },
  {
    text: "Bunte Bienen brummen brav um bunte Blumen im Beet.",
    kind: "zungenbrecher",
    stufen: ["kids"],
  },
  {
    text: "Bürokraten buchen brav blaue Büroklammern in breiten Boxen.",
    kind: "zungenbrecher",
    stufen: ["erwachsen"],
  },
  {
    text: "Bürsten mit weißen Borsten bürsten besser als die mit schwarzen Borsten.",
    kind: "zungenbrecher",
    stufen: ["teens"],
  },
  {
    text: "Der dicke Dachdecker deckt dir dein Dach, drum dankt dir der Dachdecker.",
    kind: "zungenbrecher",
    stufen: ["teens"],
  },
  {
    text: "Der dicke Direktor diktiert dreißig drollige Dokumente.",
    kind: "zungenbrecher",
    stufen: ["erwachsen"],
  },
  {
    text: "Drei dicke Drachen drehen draußen dreißig drollige Donnerrunden.",
    kind: "zungenbrecher",
    stufen: ["kids", "teens"],
  },
  {
    text: "Fischers flinker Florian fischt frische Forellen am frostigen Freitag.",
    kind: "zungenbrecher",
    stufen: ["kids", "teens"],
  },
  {
    text: "Fischers Fritz fischt frische Fische, frische Fische fischt Fischers Fritz.",
    kind: "zungenbrecher",
    stufen: ["kids"],
  },
  {
    text: "Fischers Fritze fischt frische Fische, frische Fische fischt Fritze.",
    kind: "zungenbrecher",
    stufen: ["erwachsen"],
  },
  {
    text: "Fischers Fritze fischt frische Fische, frische fischt Fischers Fritze.",
    kind: "zungenbrecher",
    stufen: ["teens"],
  },
  {
    text: "Freche Frösche fressen frische Fliegen am Flussufer.",
    kind: "zungenbrecher",
    stufen: ["kids"],
  },
  {
    text: "Genervte Gnus grasen gemütlich grüne Gräser am glitzernden Gebirgsbach.",
    kind: "zungenbrecher",
    stufen: ["kids", "teens"],
  },
  {
    text: "Kleine Katzen kichern kunterbunt im kuscheligen Korb.",
    kind: "zungenbrecher",
    stufen: ["kids"],
  },
  {
    text: "Klitzekleine Kletten kleben klebrig an Karins karierter Kapuze.",
    kind: "zungenbrecher",
    stufen: ["kids", "teens"],
  },
  {
    text: "Kluge kleine Katzen kratzen keine krummen Kratzbäume kaputt.",
    kind: "zungenbrecher",
    stufen: ["teens"],
  },
  {
    text: "Kritische Kassenkräfte kassieren konsequent korrekte Kupons.",
    kind: "zungenbrecher",
    stufen: ["erwachsen"],
  },
  {
    text: "Lustige Lurche lecken leise lila Lollis am Lagerfeuer.",
    kind: "zungenbrecher",
    stufen: ["kids"],
  },
  {
    text: "Maxi malt mit Mut viele murmelnde Mäuse an die Wand.",
    kind: "zungenbrecher",
    stufen: ["kids"],
  },
  {
    text: "Pfiffige Pfauen putzen prächtig prall ihr prunkvolles Prachtgefieder.",
    kind: "zungenbrecher",
    stufen: ["kids", "teens"],
  },
  {
    text: "Quietschende Quietscheenten quaken quer durch quirlige Quellen.",
    kind: "zungenbrecher",
    stufen: ["teens"],
  },
  {
    text: "Rote Raben rasten rasch auf runden roten Rohren.",
    kind: "zungenbrecher",
    stufen: ["kids"],
  },
  {
    text: "Schnecken schleichen sachte sieben schmale Sandstege schräg hinunter.",
    kind: "zungenbrecher",
    stufen: ["kids", "teens"],
  },
  {
    text: "Schneiders Schere schneidet scharf, scharf schneidet Schneiders Schere.",
    kind: "zungenbrecher",
    stufen: ["erwachsen"],
  },
  {
    text: "Schnelle Schnecken schleichen schräg durch sieben schmale Schächte.",
    kind: "zungenbrecher",
    stufen: ["teens"],
  },
  {
    text: "Sieben Schlangen schlafen sanft auf sieben sonnigen Steinen.",
    kind: "zungenbrecher",
    stufen: ["kids"],
  },
  {
    text: "Steuerberater Stefan streicht strittige Steuerstundungssätze.",
    kind: "zungenbrecher",
    stufen: ["erwachsen"],
  },
  {
    text: "Trockene Trompeten trommeln trotzdem traumhaft tiefe Tonleitern.",
    kind: "zungenbrecher",
    stufen: ["kids", "teens"],
  },
  {
    text: "Wenn Trauben raufen, raufen tausend triefend nasse Traubenrauferinnen.",
    kind: "zungenbrecher",
    stufen: ["teens"],
  },
  {
    text: "Wer wettert, während wir warten, wirkt wirklich wenig weise.",
    kind: "zungenbrecher",
    stufen: ["erwachsen"],
  },
  {
    text: "Wuschelige Walrossweibchen waten wankend westwärts durchs wilde Wasser.",
    kind: "zungenbrecher",
    stufen: ["kids", "teens"],
  },
  {
    text: "Wuschelige Welpen wackeln wild durch warmen weichen Wald.",
    kind: "zungenbrecher",
    stufen: ["kids"],
  },
  {
    text: "Zehn zahme Ziegen zogen zischend zum Zaun am Zoo.",
    kind: "zungenbrecher",
    stufen: ["kids"],
  },
  {
    text: "Zwischen zwei Zwetschgenzweigen zwitschern zwei Schwalben.",
    kind: "zungenbrecher",
    stufen: ["erwachsen"],
  },
  {
    text: "Zwischen zwei Zwetschgenzweigen zwitschern zwei zänkische Zwergspatzen.",
    kind: "zungenbrecher",
    stufen: ["teens"],
  },
  {
    text: "Zwischen zwei Zwetschgenzweigen zwitschern zwölf zerzauste Zaunkönige.",
    kind: "zungenbrecher",
    stufen: ["kids", "teens"],
  },
  // ---- wortspiel ----
  {
    text: "Anna liest gern. Anna ist ein Wort, das vorwärts wie rückwärts gleich ist.",
    kind: "wortspiel",
    stufen: ["kids"],
  },
  {
    text: "Anna, Otto und Hannah heißen rücklings genauso wie vorwärts.",
    kind: "wortspiel",
    stufen: ["erwachsen"],
  },
  {
    text: "Anna, Otto, Reliefpfeiler: alles Wörter, die rückwärts genau so klingen.",
    kind: "wortspiel",
    stufen: ["kids", "teens"],
  },
  {
    // R2-Doppelpunkt-Regel: Nach dem Doppelpunkt folgt ein ganzer Satz → groß.
    text: "Augenblick mal: Ein Blick dauert länger als so ein Augenblick.",
    kind: "wortspiel",
    stufen: ["erwachsen"],
  },
  {
    text: "Der Frühaufsteher trifft den Langschläfer genau in der Mittagspause.",
    kind: "wortspiel",
    stufen: ["kids", "teens"],
  },
  {
    text: "Der Tankwart bewacht keine Tanks, er füllt nur Tanks mit Sprit.",
    kind: "wortspiel",
    stufen: ["erwachsen"],
  },
  {
    text: "Die Brille hilft beim Sehen, doch sich selbst sieht sie nie an.",
    kind: "wortspiel",
    stufen: ["erwachsen"],
  },
  {
    text: "Donaudampfschifffahrt: drei f hintereinander, völlig korrekt.",
    kind: "wortspiel",
    stufen: ["teens"],
  },
  {
    text: "Donaudampfschifffahrt: ein Wort mit gleich drei f hintereinander, echt!",
    kind: "wortspiel",
    stufen: ["kids", "teens"],
  },
  {
    text: "Ein Faultier macht nie blau, dafür ist es einfach viel zu langsam.",
    kind: "wortspiel",
    stufen: ["kids", "teens"],
  },
  {
    text: "Ein Handschuh hat keine Hand, ein Fingerhut keinen einzigen Finger.",
    kind: "wortspiel",
    stufen: ["erwachsen"],
  },
  {
    text: "Ein Kummerkasten sammelt Kummer, doch tröstet niemanden zurück.",
    kind: "wortspiel",
    stufen: ["erwachsen"],
  },
  {
    text: "Ein Marienkäfer im Mathe-Unterricht zählt natürlich nur seine Punkte.",
    kind: "wortspiel",
    stufen: ["kids", "teens"],
  },
  {
    text: "Ein Nilpferd lebt am Nil. Steckt das Pferd im Nilpferd? Klar!",
    kind: "wortspiel",
    stufen: ["kids"],
  },
  {
    text: "Ein Pessimist sieht das Glas halb leer, ein Realist nur ein Glas.",
    kind: "wortspiel",
    stufen: ["teens"],
  },
  {
    text: "Ein Regenwurm liebt Regen. Steckt der Wurm im Regenwurm? Ja, hinten!",
    kind: "wortspiel",
    stufen: ["kids"],
  },
  {
    text: "Ein Rentier ist ein Tier. Steckt das Wort Tier in Rentier? Ja!",
    kind: "wortspiel",
    stufen: ["kids"],
  },
  {
    text: "Ein Schloss ist ein Prunkbau oder sichert deine Tür. Praktisch doppelt.",
    kind: "wortspiel",
    stufen: ["teens"],
  },
  {
    text: "Ein Skelett geht nicht zur Party: Es hat einfach niemanden dabei.",
    kind: "wortspiel",
    stufen: ["teens"],
  },
  {
    text: "Ein Staubsauger saugt Staub, aber niemand saugt je einen Sauger ab.",
    kind: "wortspiel",
    stufen: ["erwachsen"],
  },
  {
    text: "Ein Witz ist wie ein Schuh: Passt er nicht, lacht trotzdem keiner mit.",
    kind: "wortspiel",
    stufen: ["kids", "teens"],
  },
  {
    text: "Ein Wortspiel ist wie ein Sprung: Erst denkst du, dann landest du klüger.",
    kind: "wortspiel",
    stufen: ["kids", "teens"],
  },
  {
    text: "Eine Bank ist zum Sitzen oder fürs Geld. Hauptsache, du fällst nicht durch.",
    kind: "wortspiel",
    stufen: ["teens"],
  },
  {
    text: "Eine Brille hilft beim Sehen. In Brille steckt die kleine Rille.",
    kind: "wortspiel",
    stufen: ["kids"],
  },
  {
    text: "Eine Tigerente ist Quatsch: ein Tiger und eine Ente in einem Wort.",
    kind: "wortspiel",
    stufen: ["kids"],
  },
  {
    text: "Feierabend: ein Abend, der gefeiert wird, sobald die Arbeit ruht.",
    kind: "wortspiel",
    stufen: ["erwachsen"],
  },
  {
    text: "Gehwegplatten betreten Sie nur, wenn Sie wirklich gehen wollen.",
    kind: "wortspiel",
    stufen: ["erwachsen"],
  },
  {
    text: "Kabarett rückwärts: tterabak. Klingt wie ein Wikingerschwur.",
    kind: "wortspiel",
    stufen: ["teens"],
  },
  {
    text: "Lagertonnennotregal: ein langes Palindrom für die Mittagspause.",
    kind: "wortspiel",
    stufen: ["erwachsen"],
  },
  {
    text: "Lebensmittel sind Mittel zum Leben, kein Mittel gegen das Leben.",
    kind: "wortspiel",
    stufen: ["erwachsen"],
  },
  {
    text: "Lege das Wort Esel rückwärts: lese. Ein Esel kann doch nicht lesen!",
    kind: "wortspiel",
    stufen: ["kids"],
  },
  {
    text: "Lesezeichen lesen nie ein Zeichen, sie warten nur geduldig im Buch.",
    kind: "wortspiel",
    stufen: ["kids", "teens"],
  },
  {
    text: "Mein Bruder spielt Klavier so leise, dass er Tonleitern flüstert.",
    kind: "wortspiel",
    stufen: ["kids", "teens"],
  },
  {
    text: "Mein Hamster heißt Otto, weil das Wort von hinten gelesen gleich bleibt.",
    kind: "wortspiel",
    stufen: ["kids", "teens"],
  },
  {
    text: "Otto und Anna sind Namen, die man auch rückwärts lesen kann.",
    kind: "wortspiel",
    stufen: ["kids"],
  },
  {
    text: "Otto, Anna und Hannah grüßen: Alle drei sind Palindrome.",
    kind: "wortspiel",
    stufen: ["teens"],
  },
  {
    text: "Reliefpfeiler ist ein Palindrom, vorwärts wie rückwärts gleich.",
    kind: "wortspiel",
    stufen: ["erwachsen"],
  },
  {
    text: "Reliefpfeiler liest sich rückwärts genauso. Probier es ruhig aus.",
    kind: "wortspiel",
    stufen: ["teens"],
  },
  {
    text: "Rentner und Rentier klingen fast gleich. Ein Buchstabe macht den Spaß.",
    kind: "wortspiel",
    stufen: ["kids"],
  },
  {
    text: "Rentner: jemand, der früher Renten zahlte, nun selbst eine bezieht.",
    kind: "wortspiel",
    stufen: ["erwachsen"],
  },
  {
    text: "Rotor dreht sich, und das Wort dreht sich auch: vor wie zurück gleich.",
    kind: "wortspiel",
    stufen: ["erwachsen"],
  },
  {
    text: "Sag Lager rückwärts: Regal. Stell die Bücher gleich ins Regal!",
    kind: "wortspiel",
    stufen: ["kids"],
  },
  {
    text: "Schlafanzug fährt nirgendwo hin, trotzdem steckt ein Zug darin.",
    kind: "wortspiel",
    stufen: ["erwachsen"],
  },
  {
    text: "Schreibtischtäter ist ein Wort, das nach Krimi klingt und nach Büro riecht.",
    kind: "wortspiel",
    stufen: ["kids", "teens"],
  },
  {
    text: "Sonntags ist Sonne nicht garantiert, der Name verspricht zu viel.",
    kind: "wortspiel",
    stufen: ["erwachsen"],
  },
  {
    text: "Warum mag der Wal die Schule? Er taucht einfach gern tief in ein Thema ein.",
    kind: "wortspiel",
    stufen: ["kids", "teens"],
  },
  {
    text: "Warum weint das Mathebuch? Es hat zu viele Probleme.",
    kind: "wortspiel",
    stufen: ["teens"],
  },
  {
    text: "Was sagt der Bleistift zum Radiergummi? Ohne dich wäre ich verloren.",
    kind: "wortspiel",
    stufen: ["kids", "teens"],
  },
  // ---- spruch ----
  {
    text: "Bleib dran, deine Tastatur kennt dich bald besser als du.",
    kind: "spruch",
    stufen: ["teens"],
  },
  {
    text: "Das beste Werkzeug ist die ruhige Hand, die es führt.",
    kind: "spruch",
    stufen: ["erwachsen"],
  },
  {
    text: "Dein Kopf weiß den Weg, deine Finger lernen ihn auswendig.",
    kind: "spruch",
    stufen: ["kids", "teens"],
  },
  {
    text: "Deine Finger denken bald mit - gib ihnen nur genug zu tun.",
    kind: "spruch",
    stufen: ["kids", "teens"],
  },
  {
    text: "Deine Finger wissen mehr, als du gerade glaubst.",
    kind: "spruch",
    stufen: ["teens"],
  },
  {
    text: "Der Frosch macht quak, du machst klick, so wird das Tippen Stück für Stück.",
    kind: "spruch",
    stufen: ["kids"],
  },
  {
    text: "Die Katze tippt ganz langsam, doch sie gibt niemals auf.",
    kind: "spruch",
    stufen: ["kids"],
  },
  {
    text: "Die kurze Pause rettet oft den langen Text.",
    kind: "spruch",
    stufen: ["erwachsen"],
  },
  {
    text: "Die Maus piepst leise: Tipp doch heute noch ein bisschen weise.",
    kind: "spruch",
    stufen: ["kids"],
  },
  {
    text: "Du musst nicht perfekt starten, nur überhaupt starten.",
    kind: "spruch",
    stufen: ["teens"],
  },
  {
    text: "Du schaffst das, Schritt für Schritt wird jedes Wort ein bisschen leichter.",
    kind: "spruch",
    stufen: ["kids"],
  },
  {
    text: "Ein Affe lacht und klatscht: Du hast es fast geschafft!",
    kind: "spruch",
    stufen: ["kids"],
  },
  {
    text: "Ein klarer Satz ist höflicher als zehn unklare.",
    kind: "spruch",
    stufen: ["erwachsen"],
  },
  {
    text: "Ein kleiner Igel rollt sich ein und träumt vom nächsten Buchstaben.",
    kind: "spruch",
    stufen: ["kids"],
  },
  {
    text: "Ein Plan ohne Termin ist nur ein Wunsch.",
    kind: "spruch",
    stufen: ["erwachsen"],
  },
  {
    text: "Ein Tag ohne Üben ist ein Tag mit langsameren Fingern.",
    kind: "spruch",
    stufen: ["teens"],
  },
  {
    text: "Eine Liste vergisst nichts, der Kopf schon.",
    kind: "spruch",
    stufen: ["erwachsen"],
  },
  {
    text: "Fehler sind keine Niederlage, nur ein Hinweis aufs nächste Mal.",
    kind: "spruch",
    stufen: ["erwachsen"],
  },
  {
    text: "Fehler sind nur Tippversuche, die noch üben.",
    kind: "spruch",
    stufen: ["teens"],
  },
  {
    text: "Fehler sind okay, aus jedem Fehler lernst du dazu.",
    kind: "spruch",
    stufen: ["kids"],
  },
  {
    text: "Geduld ist die Kunst, nicht jeden Fehler sofort zu löschen.",
    kind: "spruch",
    stufen: ["erwachsen"],
  },
  {
    text: "Genauigkeit zuerst, das Tempo folgt von ganz allein.",
    kind: "spruch",
    stufen: ["erwachsen"],
  },
  {
    text: "Geschwindigkeit kommt von selbst, Genauigkeit musst du holen.",
    kind: "spruch",
    stufen: ["teens"],
  },
  {
    text: "Gut Ding will Weile haben, also bleib geduldig dran.",
    kind: "spruch",
    stufen: ["kids"],
  },
  {
    text: "Gut Ding will Weile haben, dein Highscore eben auch.",
    kind: "spruch",
    stufen: ["kids", "teens"],
  },
  {
    text: "Heute ein bisschen, morgen noch mehr, so fällt dir das Tippen nicht schwer.",
    kind: "spruch",
    stufen: ["kids"],
  },
  {
    text: "Heute holprig, morgen flüssig, übermorgen Routine.",
    kind: "spruch",
    stufen: ["teens"],
  },
  {
    text: "Heute zehn Finger, morgen zehnmal so schnell. Du schaffst das!",
    kind: "spruch",
    stufen: ["kids", "teens"],
  },
  {
    text: "Jeder Anfang ist schwer, doch du wirst immer besser.",
    kind: "spruch",
    stufen: ["kids"],
  },
  {
    text: "Jeder Profi hat mal mit dem Adlersuchsystem angefangen.",
    kind: "spruch",
    stufen: ["teens"],
  },
  {
    text: "Jeder Profi war mal Anfänger, der nicht aufgegeben hat.",
    kind: "spruch",
    stufen: ["kids", "teens"],
  },
  {
    text: "Kleine Schritte sind auch Schritte - und sie führen ans Ziel.",
    kind: "spruch",
    stufen: ["kids", "teens"],
  },
  {
    text: "Kleine Schritte sind auch Schritte, nur leiser.",
    kind: "spruch",
    stufen: ["teens"],
  },
  {
    text: "Kleine Schritte täglich schlagen den großen Vorsatz vom Montag.",
    kind: "spruch",
    stufen: ["erwachsen"],
  },
  {
    text: "Konzentration ist still und wirkt mehr als jeder Lärm.",
    kind: "spruch",
    stufen: ["erwachsen"],
  },
  {
    text: "Kopf hoch und lachen, du wirst das schon machen!",
    kind: "spruch",
    stufen: ["kids"],
  },
  {
    text: "Langsam und richtig schlägt schnell und falsch um Längen.",
    kind: "spruch",
    stufen: ["kids", "teens"],
  },
  {
    text: "Langsam und richtig schlägt schnell und voller Fehler.",
    kind: "spruch",
    stufen: ["teens"],
  },
  {
    text: "Langsam, aber sicher kommst du immer weiter voran.",
    kind: "spruch",
    stufen: ["kids"],
  },
  {
    text: "Morgenstund hat Gold im Mund, doch Mittagsübung hat es auch.",
    kind: "spruch",
    stufen: ["kids", "teens"],
  },
  {
    text: "Morgenstund hat Gold im Mund, sagt ein altes Sprichwort.",
    kind: "spruch",
    stufen: ["kids"],
  },
  {
    text: "Nicht aufgeben heißt: noch eine Zeile, dann noch eine.",
    kind: "spruch",
    stufen: ["teens"],
  },
  {
    text: "Nicht aufgeben heißt: nur einmal öfter aufstehen als hinfallen.",
    kind: "spruch",
    stufen: ["kids", "teens"],
  },
  {
    text: "Ordnung am Schreibtisch ersetzt keinen Gedanken, hilft ihm aber.",
    kind: "spruch",
    stufen: ["erwachsen"],
  },
  {
    text: "Routine entsteht nicht durch Reden, sondern durch Wiederholen.",
    kind: "spruch",
    stufen: ["erwachsen"],
  },
  {
    text: "Schau nicht auf die Tasten, schau auf dein Ziel.",
    kind: "spruch",
    stufen: ["teens"],
  },
  {
    text: "Sei mutig wie ein Löwe und tippe ganz genau.",
    kind: "spruch",
    stufen: ["kids"],
  },
  {
    text: "Tempo ohne Sicherheit ist nur schnelles Stolpern.",
    kind: "spruch",
    stufen: ["erwachsen"],
  },
  {
    text: "Tipp, tapp, Trab: heute holprig, bald im Galopp über die Tastatur.",
    kind: "spruch",
    // S3: Kinderreim-Ton („Tipp, tapp, Trab") - bleibt bei kids.
    stufen: ["kids"],
  },
  {
    text: "Tippen lernt man nicht im Kopf, sondern in den Fingern.",
    kind: "spruch",
    stufen: ["teens"],
  },
  {
    text: "Verschreiben ist kein Versagen, sondern nur eine neue Chance.",
    kind: "spruch",
    stufen: ["kids", "teens"],
  },
  {
    text: "Wer A sagt, muss auch das ganze Alphabet ertippen. Los geht es!",
    kind: "spruch",
    stufen: ["kids", "teens"],
  },
  {
    text: "Wer A sagt, muss B nicht suchen, sondern blind treffen.",
    kind: "spruch",
    stufen: ["teens"],
  },
  {
    text: "Wer alle zehn Finger nutzt, muss nicht mehr auf sie schauen.",
    kind: "spruch",
    stufen: ["erwachsen"],
  },
  {
    text: "Wer Fehler macht, übt einfach weiter - Tippen lernt sich nicht im Schlaf.",
    kind: "spruch",
    stufen: ["kids", "teens"],
  },
  {
    text: "Wer fragt, ist klug; wer übt, wird Meister. Mach beides!",
    kind: "spruch",
    stufen: ["kids", "teens"],
  },
  {
    text: "Wer fragt, verliert einen Moment. Wer nicht fragt, oft den Tag.",
    kind: "spruch",
    stufen: ["erwachsen"],
  },
  {
    text: "Wer rastet, der rostet - also Finger warm und ab auf die Tasten!",
    kind: "spruch",
    stufen: ["kids", "teens"],
  },
  {
    text: "Wer rastet, der rostet, drum bleib am Tippen dran!",
    kind: "spruch",
    stufen: ["kids"],
  },
  {
    text: "Wer rastet, der tippt auch nicht schneller.",
    kind: "spruch",
    stufen: ["teens"],
  },
  {
    text: "Wer regelmäßig übt, braucht keine großen Sprünge.",
    kind: "spruch",
    stufen: ["erwachsen"],
  },
  {
    text: "Wer schnell tippt, spart Zeit. Wer richtig tippt, spart Nerven.",
    kind: "spruch",
    stufen: ["erwachsen"],
  },
  {
    text: "Wer zuhört, schreibt meist die besseren Notizen.",
    kind: "spruch",
    stufen: ["erwachsen"],
  },
  {
    text: "Übung macht den Meister, aber die Pause macht die Pause.",
    kind: "spruch",
    stufen: ["kids", "teens"],
  },
  {
    text: "Übung macht den Meister, also tippe fröhlich weiter!",
    kind: "spruch",
    stufen: ["kids"],
  },
  {
    text: "Übung macht keinen Meister, aber verdammt nah dran.",
    kind: "spruch",
    stufen: ["teens"],
  },
  // ---- fakt ----
  {
    text: "Ameisen können das Vielfache ihres Körpergewichts tragen.",
    kind: "fakt",
    stufen: ["erwachsen"],
  },
  {
    text: "Auf dem Mond hinterlassene Fußabdrücke bleiben Millionen Jahre erhalten.",
    kind: "fakt",
    stufen: ["erwachsen"],
  },
  {
    text: "Bananen sind Beeren, Erdbeeren aber botanisch gar keine.",
    kind: "fakt",
    stufen: ["teens"],
  },
  {
    text: "Bananen sind Beeren, Erdbeeren aber botanisch gesehen keine.",
    kind: "fakt",
    stufen: ["kids", "teens"],
  },
  {
    text: "Bananen sind botanisch gesehen Beeren, Erdbeeren dagegen nicht.",
    kind: "fakt",
    stufen: ["erwachsen"],
  },
  {
    text: "Das menschliche Gehirn verbraucht etwa ein Fünftel der gesamten Energie.",
    kind: "fakt",
    stufen: ["erwachsen"],
  },
  {
    text: "Das schnellste Tier der Welt ist der Wanderfalke im Sturzflug.",
    kind: "fakt",
    stufen: ["kids", "teens"],
  },
  {
    text: "Dein Magen bekommt alle paar Tage eine neue Schleimhaut.",
    kind: "fakt",
    stufen: ["teens"],
  },
  {
    text: "Der Mond hat keine Luft, deshalb gibt es dort keinen Wind.",
    kind: "fakt",
    stufen: ["kids"],
  },
  {
    text: "Die Chinesische Mauer wuchs über fast 2000 Jahre lang weiter.",
    kind: "fakt",
    stufen: ["kids", "teens"],
  },
  {
    text: "Die Eiffelturm-Höhe schwankt um bis zu 15 Zentimeter mit der Wärme.",
    kind: "fakt",
    stufen: ["erwachsen"],
  },
  {
    text: "Die Eiffelturm-Spitze wächst im Sommer durch Hitze um 15 Zentimeter.",
    kind: "fakt",
    stufen: ["kids", "teens"],
  },
  {
    text: "Die Erde dreht sich an einem Tag einmal um sich selbst.",
    kind: "fakt",
    stufen: ["kids"],
  },
  {
    text: "Die Erde fängt Licht der Sonne erst nach gut acht Minuten ein.",
    kind: "fakt",
    stufen: ["teens"],
  },
  {
    text: "Die kürzeste je geführte Schlacht der Geschichte dauerte 38 Minuten.",
    kind: "fakt",
    stufen: ["erwachsen"],
  },
  {
    text: "Die kürzeste Schlacht der Geschichte dauerte rund 38 Minuten.",
    kind: "fakt",
    stufen: ["teens"],
  },
  {
    text: "Die meisten Landkarten zeigen den Norden oben erst seit der Neuzeit.",
    kind: "fakt",
    stufen: ["erwachsen"],
  },
  {
    text: "Die Zunge eines Blauwals wiegt etwa so viel wie ein Elefant.",
    kind: "fakt",
    stufen: ["erwachsen"],
  },
  {
    text: "Ein Baby hat mehr Knochen als ein erwachsener Mensch.",
    kind: "fakt",
    stufen: ["kids"],
  },
  {
    text: "Ein Blitz ist fünfmal heißer als die Oberfläche der Sonne.",
    kind: "fakt",
    stufen: ["kids", "teens"],
  },
  {
    text: "Ein Blitz ist kurz heißer als die Oberfläche der Sonne.",
    kind: "fakt",
    stufen: ["teens"],
  },
  {
    text: "Ein Blitz ist rund fünfmal heißer als die Oberfläche der Sonne.",
    kind: "fakt",
    stufen: ["erwachsen"],
  },
  {
    text: "Ein Eichhörnchen vergisst, wo es viele Nüsse vergräbt - und pflanzt Bäume.",
    kind: "fakt",
    stufen: ["teens"],
  },
  {
    text: "Ein Eisbär hat unter dem weißen Fell schwarze Haut.",
    kind: "fakt",
    stufen: ["kids"],
  },
  {
    text: "Ein Kolibri kann sogar rückwärts fliegen.",
    kind: "fakt",
    stufen: ["kids"],
  },
  {
    text: "Ein Kolibri schlägt bis zu 80-mal pro Sekunde mit den Flügeln.",
    kind: "fakt",
    stufen: ["erwachsen"],
  },
  {
    text: "Ein Krokodil kann seine Zunge nicht bewegen.",
    kind: "fakt",
    stufen: ["kids"],
  },
  {
    text: "Ein Pinguin kann nicht fliegen, aber sehr gut schwimmen.",
    kind: "fakt",
    stufen: ["kids"],
  },
  {
    text: "Ein Schmetterling schmeckt mit seinen Füßen.",
    kind: "fakt",
    stufen: ["kids"],
  },
  {
    text: "Ein Tag auf der Venus dauert länger als ein ganzes Jahr dort.",
    kind: "fakt",
    stufen: ["kids", "teens"],
  },
  {
    text: "Ein Tag auf der Venus dauert länger als ein Jahr auf der Venus.",
    kind: "fakt",
    stufen: ["erwachsen"],
  },
  {
    text: "Ein Tag auf der Venus ist länger als ihr ganzes Jahr.",
    kind: "fakt",
    stufen: ["teens"],
  },
  { text: "Ein Tintenfisch hat drei Herzen.", kind: "fakt", stufen: ["kids"] },
  {
    text: "Eine Schnecke kann auf einer scharfen Klinge kriechen.",
    kind: "fakt",
    stufen: ["kids"],
  },
  {
    text: "Es gibt mehr Sterne im All als Sandkörner an allen Stränden der Erde.",
    kind: "fakt",
    stufen: ["erwachsen"],
  },
  {
    text: "Faultiere können ihr Essen bis zu einem Monat lang verdauen.",
    kind: "fakt",
    stufen: ["teens"],
  },
  {
    text: "Honig verdirbt nicht. Funde aus alten Gräbern waren noch essbar.",
    kind: "fakt",
    stufen: ["teens"],
  },
  {
    text: "Honig verdirbt nicht; Funde aus Pharaonengräbern sind noch essbar.",
    kind: "fakt",
    stufen: ["erwachsen"],
  },
  {
    text: "Honig wird niemals schlecht: Selbst nach 3000 Jahren ist er essbar.",
    kind: "fakt",
    stufen: ["kids", "teens"],
  },
  {
    text: "Im All gibt es keinen Schall. Niemand hört dich brüllen.",
    kind: "fakt",
    stufen: ["teens"],
  },
  {
    text: "Im Weltall kannst du nicht weinen: Tränen kleben einfach am Auge.",
    kind: "fakt",
    stufen: ["kids", "teens"],
  },
  {
    text: "Kolibris sind die einzigen Vögel, die anhaltend rückwärts fliegen können.",
    kind: "fakt",
    stufen: ["teens"],
  },
  {
    text: "Krokodile gab es schon, als die Dinosaurier noch lebten.",
    kind: "fakt",
    stufen: ["kids", "teens"],
  },
  {
    text: "Oktopusse haben drei Herzen und blaues Blut.",
    kind: "fakt",
    stufen: ["erwachsen"],
  },
  {
    text: "Oktopusse haben drei Herzen und blaues Blut. Kein Witz.",
    kind: "fakt",
    stufen: ["teens"],
  },
  {
    text: "Pinguine machen Heiratsanträge mit einem hübschen Kieselstein.",
    kind: "fakt",
    stufen: ["kids", "teens"],
  },
  {
    text: "Pinguine machen ihrer Liebsten manchmal einen Stein zum Geschenk.",
    kind: "fakt",
    stufen: ["teens"],
  },
  {
    text: "Quallen gibt es schon länger als Dinosaurier und Bäume.",
    kind: "fakt",
    stufen: ["teens"],
  },
  {
    text: "Schnecken können je nach Art mehrere Tausend kleine Zähne haben.",
    kind: "fakt",
    stufen: ["kids", "teens"],
  },
  {
    text: "Schnecken können je nach Art viele Monate am Stück schlafen.",
    kind: "fakt",
    stufen: ["erwachsen"],
  },
  {
    text: "Schon gewusst? Ameisen schlafen sehr oft, aber nur ganz kurz.",
    kind: "fakt",
    stufen: ["kids"],
  },
  {
    text: "Schon gewusst? Bananen wachsen nach oben zur Sonne.",
    kind: "fakt",
    stufen: ["kids"],
  },
  {
    text: "Schon gewusst? Ein Elefant kann nicht springen.",
    kind: "fakt",
    stufen: ["kids"],
  },
  {
    text: "Schon gewusst? Ein Floh springt 100-mal so hoch wie er selbst.",
    kind: "fakt",
    stufen: ["kids"],
  },
  {
    text: "Schon gewusst? Ein Tintenfisch hat drei Herzen und blaues Blut.",
    kind: "fakt",
    stufen: ["kids", "teens"],
  },
  {
    text: "Schon gewusst? Eine Giraffe hat nur sieben Halsknochen.",
    kind: "fakt",
    stufen: ["kids"],
  },
  {
    text: "Schon gewusst? Eine Katze kann über 100 Laute machen.",
    kind: "fakt",
    stufen: ["kids"],
  },
  {
    text: "Schon gewusst? Eine Wolke kann mehrere Hundert Tonnen wiegen.",
    kind: "fakt",
    stufen: ["kids", "teens"],
  },
  {
    text: "Schon gewusst? Faultiere können ihre Nahrung wochenlang verdauen.",
    kind: "fakt",
    stufen: ["kids", "teens"],
  },
  {
    text: "Schon gewusst? Honig wird niemals schlecht.",
    kind: "fakt",
    stufen: ["kids"],
  },
  {
    text: "Schon gewusst? Oktopusse können ihre Hautfarbe blitzschnell ändern.",
    kind: "fakt",
    stufen: ["kids", "teens"],
  },
  {
    text: "Schon gewusst? Spinnenseide ist stärker als gleich dicker Stahl.",
    kind: "fakt",
    stufen: ["teens"],
  },
  {
    text: "Schon gewusst? Viele Spinnen haben acht Augen.",
    kind: "fakt",
    stufen: ["kids"],
  },
  {
    text: "Tintenfische haben acht Arme, aber auch noch zwei lange Fangarme.",
    kind: "fakt",
    stufen: ["teens"],
  },
  {
    text: "Wasser kann gleichzeitig kochen und gefrieren: am Tripelpunkt.",
    kind: "fakt",
    stufen: ["erwachsen"],
  },
  {
    text: "Wombats machen würfelförmigen Kot. Der rollt nicht so leicht weg.",
    kind: "fakt",
    stufen: ["teens"],
  },
  {
    text: "Wombats setzen tatsächlich würfelförmigen Kot ab.",
    kind: "fakt",
    stufen: ["kids", "teens"],
  },
  {
    text: "Wombats setzen würfelförmigen Kot ab; sonst kein Tier auf der Welt.",
    kind: "fakt",
    stufen: ["erwachsen"],
  },
  // ---- satz ----
  {
    text: "Am Bahnsteig 7 fuhr der Zug nach Hamburg pünktlich um 8 Uhr ab.",
    kind: "satz",
    stufen: ["erwachsen"],
  },
  {
    text: "Am Morgen putzt du dir die Zähne und ziehst die Schuhe an.",
    kind: "satz",
    stufen: ["kids"],
  },
  {
    text: "Am Morgen schleicht der Nebel leise über die nassen Wiesen.",
    kind: "satz",
    stufen: ["kids", "teens"],
  },
  {
    text: "Am See spiegeln sich die Wolken, und die Enten paddeln gemütlich los.",
    kind: "satz",
    stufen: ["kids", "teens"],
  },
  {
    text: "Auf dem Pausenhof tauschen wir Sticker, Witze und manchmal Geheimnisse.",
    kind: "satz",
    stufen: ["kids", "teens"],
  },
  {
    text: "Auf dem Schreibtisch lagen drei Stifte, doch keiner schrieb noch.",
    kind: "satz",
    stufen: ["erwachsen"],
  },
  {
    text: "Auf dem Schulhof tauschen alle Geschichten, die größer werden.",
    kind: "satz",
    stufen: ["teens"],
  },
  {
    text: "Das Gewitter zog vorbei und ließ die Luft endlich wieder atmen.",
    kind: "satz",
    stufen: ["erwachsen"],
  },
  {
    text: "Der Akku zeigte 1 Prozent und hielt dann noch eine halbe Stunde durch.",
    kind: "satz",
    stufen: ["erwachsen"],
  },
  {
    text: "Der alte Baum im Park kennt bestimmt mehr Geschichten als ich.",
    kind: "satz",
    stufen: ["kids", "teens"],
  },
  {
    text: "Der Bach plätschert leise zwischen den glatten Steinen.",
    kind: "satz",
    stufen: ["kids"],
  },
  {
    text: "Der Bus kommt heute pünktlich, was schon fast verdächtig wirkt.",
    kind: "satz",
    stufen: ["teens"],
  },
  {
    text: "Der Fahrstuhl war besetzt, also nahm sie die Treppe und kam früher an.",
    kind: "satz",
    stufen: ["erwachsen"],
  },
  {
    text: "Der Hund bellt laut, weil die Katze schnell wegrennt.",
    kind: "satz",
    stufen: ["kids"],
  },
  {
    text: "Der Hund versteht jedes Wort, hört aber nur das Wort Wurst.",
    kind: "satz",
    stufen: ["teens"],
  },
  {
    text: "Der Igel sucht im Herbst nach roten Beeren und Blättern.",
    kind: "satz",
    stufen: ["kids"],
  },
  {
    text: "Der letzte Keks in der Dose verschwindet immer auf rätselhafte Weise.",
    kind: "satz",
    stufen: ["teens"],
  },
  {
    text: "Der Mond hängt riesig über dem Dorf und der Hund bellt ihn an.",
    kind: "satz",
    stufen: ["kids", "teens"],
  },
  {
    text: "Der Papagei ruft laut und macht alle Kinder zum Lachen.",
    kind: "satz",
    stufen: ["kids"],
  },
  {
    text: "Der Wind dreht die Blätter um, als suche er nach einer guten Seite.",
    kind: "satz",
    stufen: ["kids", "teens"],
  },
  {
    text: "Der Zug hatte zwölf Minuten Verspätung, der Kaffee war trotzdem kalt.",
    kind: "satz",
    stufen: ["erwachsen"],
  },
  {
    text: "Die Bibliothek ist still, bis jemand eine Tüte Chips öffnet.",
    kind: "satz",
    stufen: ["erwachsen"],
  },
  {
    text: "Die Biene summt von Blüte zu Blüte und sammelt fleißig Pollen.",
    kind: "satz",
    stufen: ["kids", "teens"],
  },
  {
    text: "Die Katze sitzt auf dem Fensterbrett und beobachtet die Spatzen.",
    kind: "satz",
    stufen: ["kids", "teens"],
  },
  {
    text: "Die Katze sitzt im Karton und tut, als wäre das ihr Geheimversteck.",
    kind: "satz",
    stufen: ["teens"],
  },
  {
    text: "Die kleine Maus tanzt fröhlich auf dem grünen Gras.",
    kind: "satz",
    stufen: ["kids"],
  },
  {
    text: "Die Lampe flackert, als hätte sie selbst einen langen Tag gehabt.",
    kind: "satz",
    stufen: ["teens"],
  },
  {
    text: "Die Pflanze auf der Fensterbank lebt erstaunlich gut ohne mein Zutun.",
    kind: "satz",
    stufen: ["erwachsen"],
  },
  {
    text: "Die Quittung war länger als der Einkauf selbst, fand er amüsiert.",
    kind: "satz",
    stufen: ["erwachsen"],
  },
  {
    text: "Die Schnecke kriecht langsam über den nassen Gehweg.",
    kind: "satz",
    stufen: ["kids"],
  },
  {
    text: "Die Sonne geht auf, der Wecker klingelt, und ich bleibe trotzdem liegen.",
    kind: "satz",
    stufen: ["kids", "teens"],
  },
  {
    text: "Die Tastatur klappert leise, während draußen die Stadt langsam erwacht.",
    kind: "satz",
    stufen: ["erwachsen"],
  },
  {
    text: "Die Wolke da oben sieht aus wie ein Hund, der gerade gähnt.",
    kind: "satz",
    stufen: ["teens"],
  },
  {
    text: "Ein guter Plan beginnt oft mit der Frage: Wo ist mein Schlüssel?",
    kind: "satz",
    stufen: ["erwachsen"],
  },
  {
    text: "Ein gutes Buch frisst die Zeit, und ich merke es erst am Ende.",
    kind: "satz",
    stufen: ["teens"],
  },
  {
    text: "Ein leiser Regen tropft aufs Dach und macht das Zimmer gemütlich.",
    kind: "satz",
    stufen: ["kids", "teens"],
  },
  {
    text: "Ein Spaziergang am Abend ordnet die Gedanken besser als jede Liste.",
    kind: "satz",
    stufen: ["erwachsen"],
  },
  {
    text: "Frische Brötchen riechen am Sonntag intensiver als an jedem Werktag.",
    kind: "satz",
    stufen: ["erwachsen"],
  },
  {
    text: "Hausaufgaben haben eine seltsame Begabung, sich selbst zu vermehren.",
    kind: "satz",
    stufen: ["teens"],
  },
  {
    text: "Heute habe ich beschlossen, ab morgen produktiv zu werden.",
    kind: "satz",
    stufen: ["teens"],
  },
  {
    text: "Heute scheint die Sonne warm auf unseren Schulhof.",
    kind: "satz",
    stufen: ["kids"],
  },
  {
    text: "Ich habe 3 Pläne für heute und keinen davon ernst gemeint.",
    kind: "satz",
    stufen: ["teens"],
  },
  {
    text: "Ich habe meine Hausaufgaben gemacht; das Heft blieb leider zu Hause.",
    kind: "satz",
    stufen: ["kids", "teens"],
  },
  {
    text: "Ich übe das Tippen schon 20 Minuten und meine Finger fliegen fast.",
    kind: "satz",
    stufen: ["kids", "teens"],
  },
  {
    text: "Im Garten summen viele bunte Bienen von Blume zu Blume.",
    kind: "satz",
    stufen: ["kids"],
  },
  {
    text: "Im Herbst tanzen die bunten Blätter wie wild durch den Schulhof.",
    kind: "satz",
    stufen: ["kids", "teens"],
  },
  {
    text: "Im Regen riecht die Straße plötzlich nach frisch gewaschener Welt.",
    kind: "satz",
    stufen: ["teens"],
  },
  {
    text: "Im Sommer schmilzt das Eis schneller, als man es essen kann.",
    kind: "satz",
    stufen: ["teens"],
  },
  {
    text: "Im Sommer wird das Eis schneller flüssig als die Warteschlange kürzer.",
    kind: "satz",
    stufen: ["erwachsen"],
  },
  {
    text: "Im Winter bauen wir einen Schneemann mit einer Karotte.",
    kind: "satz",
    stufen: ["kids"],
  },
  {
    text: "In der Bibliothek ist es so still, dass man Gedanken hören kann.",
    kind: "satz",
    stufen: ["kids", "teens"],
  },
  {
    text: "Liest du mir bitte das lustige Buch über die Pinguine vor?",
    kind: "satz",
    stufen: ["kids"],
  },
  {
    text: "Magst du lieber Apfelsaft oder ein kühles Glas Wasser?",
    kind: "satz",
    stufen: ["kids"],
  },
  {
    text: "Manche Stille im Zimmer ist gemütlich, andere ist nur langweilig.",
    kind: "satz",
    stufen: ["teens"],
  },
  {
    text: "Manche Termine erscheinen erst im Kalender, wenn sie längst vorbei sind.",
    kind: "satz",
    stufen: ["erwachsen"],
  },
  {
    text: "Manchmal denke ich nach dem Aufstehen: Was würde ein Faultier tun?",
    kind: "satz",
    stufen: ["kids", "teens"],
  },
  {
    text: "Manchmal denke ich nach, manchmal starre ich nur an die Decke.",
    kind: "satz",
    stufen: ["teens"],
  },
  {
    text: "Mathe und ich verstehen uns meistens, nur nie zur selben Zeit.",
    kind: "satz",
    stufen: ["teens"],
  },
  {
    text: "Mein Bruder behauptet, er könne kochen; der Rauchmelder hat Zweifel.",
    kind: "satz",
    stufen: ["teens"],
  },
  {
    text: "Mein Bruder behauptet, er könne kochen; wir essen heute Brot.",
    kind: "satz",
    stufen: ["kids", "teens"],
  },
  {
    text: "Mein Lehrer sagt, Mathe sei einfach; ich finde das sehr mutig.",
    kind: "satz",
    stufen: ["kids", "teens"],
  },
  {
    text: "Mein Lieblingstier ist der Elefant mit dem langen Rüssel.",
    kind: "satz",
    stufen: ["kids"],
  },
  {
    text: "Mein Wecker und ich haben ein ziemlich angespanntes Verhältnis.",
    kind: "satz",
    stufen: ["teens"],
  },
  {
    text: "Montags wirkt sogar mein Kaffeebecher leicht beleidigt.",
    kind: "satz",
    stufen: ["teens"],
  },
  {
    text: "Nach der Schule spielen wir im Park mit dem roten Ball.",
    kind: "satz",
    stufen: ["kids"],
  },
  {
    text: "Notizen helfen nur, wenn man später noch weiß, wo sie liegen.",
    kind: "satz",
    stufen: ["erwachsen"],
  },
  {
    text: "Oma backt einen Kuchen, der nach Zimt und Äpfeln duftet.",
    kind: "satz",
    stufen: ["kids"],
  },
  {
    text: "Pass auf: Der Frosch springt gleich in den klaren Teich!",
    kind: "satz",
    stufen: ["kids"],
  },
  {
    text: "Regen am Montag ist kein Drama, nur eine sehr nasse Verabredung.",
    kind: "satz",
    stufen: ["erwachsen"],
  },
  {
    text: "Schau mal hoch: Am Himmel fliegen drei wilde Gänse!",
    kind: "satz",
    stufen: ["kids"],
  },
  {
    text: "Sie suchte die Brille und trug sie dabei die ganze Zeit auf der Nase.",
    kind: "satz",
    stufen: ["erwachsen"],
  },
  {
    text: "Was raschelt da im Busch? Ein kleines Eichhörnchen!",
    kind: "satz",
    stufen: ["kids"],
  },
  {
    text: "Wenn das WLAN ausfällt, lerne ich überraschend viel über Geduld.",
    kind: "satz",
    stufen: ["teens"],
  },
  {
    text: "Wenn es regnet, hüpfen wir mit Gummistiefeln durch Pfützen.",
    kind: "satz",
    stufen: ["kids"],
  },
  {
    text: "Wenn es schneit, wird selbst der graue Schulweg ein bisschen magisch.",
    kind: "satz",
    stufen: ["kids", "teens"],
  },
  {
    text: "Wer am Montag schon fröhlich ist, hat den Stundenplan nicht gelesen.",
    kind: "satz",
    stufen: ["kids", "teens"],
  },
  {
    text: "Wer früh aufsteht, hat den ganzen Tag Zeit, müde zu sein.",
    kind: "satz",
    stufen: ["erwachsen"],
  },
  {
    text: "Wer zwei Bildschirme hat, verlegt seine Maus auf doppelt so viel Fläche.",
    kind: "satz",
    stufen: ["erwachsen"],
  },
  {
    text: "Wir malen zusammen einen großen blauen Wal auf das Blatt.",
    kind: "satz",
    stufen: ["kids"],
  },
  {
    text: "Zwischen zwei Pausen passt erstaunlich viel langweiliger Unterricht.",
    kind: "satz",
    stufen: ["kids", "teens"],
  },
  // ---- wissen ----
  {
    text: "Alaska liegt sowohl am westlichsten als auch am östlichsten Längengrad der USA.",
    kind: "wissen",
    stufen: ["erwachsen"],
  },
  {
    text: "Bananen sind botanisch gesehen Beeren, Erdbeeren dagegen sind gar keine Beeren.",
    kind: "wissen",
    stufen: ["teens"],
  },
  {
    text: "Bananen sind leicht radioaktiv, weil sie das Element Kalium enthalten.",
    kind: "wissen",
    stufen: ["erwachsen"],
  },
  {
    text: "Beim Niesen schließen sich die Augen reflexhaft fast immer von ganz allein.",
    kind: "wissen",
    stufen: ["teens"],
  },
  {
    text: "Bärtierchen überleben sogar im Vakuum des Weltalls für einige Tage.",
    kind: "wissen",
    stufen: ["erwachsen"],
  },
  {
    text: "Das Klavier zählt physikalisch zu den Schlaginstrumenten, nicht zu den Saiten allein.",
    kind: "wissen",
    stufen: ["erwachsen"],
  },
  {
    text: "Das Licht der Sonne braucht rund acht Minuten bis zur Erde.",
    kind: "wissen",
    stufen: ["erwachsen"],
  },
  {
    text: "Das Licht der Sonne braucht rund acht Minuten, bis es die Erde erreicht hat.",
    kind: "wissen",
    stufen: ["teens"],
  },
  {
    text: "Das Wort Roboter stammt vom tschechischen robota und bedeutet so viel wie Fronarbeit.",
    kind: "wissen",
    stufen: ["teens"],
  },
  {
    text: "Das Wort Roboter stammt vom tschechischen Wort für Fronarbeit ab.",
    kind: "wissen",
    stufen: ["erwachsen"],
  },
  {
    text: "Der Buchstabe E ist mit Abstand der häufigste Buchstabe der deutschen Sprache.",
    kind: "wissen",
    stufen: ["teens"],
  },
  {
    text: "Der Eiffelturm dehnt sich im Sommer um gut fünfzehn Zentimeter aus.",
    kind: "wissen",
    stufen: ["erwachsen"],
  },
  {
    text: "Der höchste Berg im Sonnensystem ist der Olympus Mons auf dem Planeten Mars.",
    kind: "wissen",
    stufen: ["teens"],
  },
  {
    text: "Der Magen baut seine eigene Schleimhaut etwa alle paar Tage neu auf.",
    kind: "wissen",
    stufen: ["erwachsen"],
  },
  {
    text: "Der tiefste Punkt der Ozeane liegt tiefer, als der Everest hoch ragt.",
    kind: "wissen",
    stufen: ["erwachsen"],
  },
  {
    text: "Die Erde ist keine perfekte Kugel: Am Äquator ist sie messbar dicker als am Pol.",
    kind: "wissen",
    stufen: ["teens"],
  },
  {
    text: "Die meisten Karten zeigen Grönland viel zu groß im Vergleich zu Afrika.",
    kind: "wissen",
    stufen: ["erwachsen"],
  },
  {
    text: "Die Mona Lisa hat weder deutlich sichtbare Augenbrauen noch Wimpern.",
    kind: "wissen",
    stufen: ["erwachsen"],
  },
  {
    text: "Die Sahara war vor einigen tausend Jahren grün und von Seen durchzogen.",
    kind: "wissen",
    stufen: ["erwachsen"],
  },
  {
    text: "Die Universität Oxford ist älter als das Reich der Azteken.",
    kind: "wissen",
    stufen: ["erwachsen"],
  },
  {
    text: "Ein Blitz erhitzt die Luft kurz auf das Fünffache der Oberfläche der Sonne.",
    kind: "wissen",
    stufen: ["teens"],
  },
  {
    text: "Ein Kolibri kann als einziger Vogel anhaltend rückwärts fliegen.",
    kind: "wissen",
    stufen: ["erwachsen"],
  },
  {
    text: "Ein Tag auf der Venus dauert länger als ein ganzes Jahr auf der Venus.",
    kind: "wissen",
    stufen: ["erwachsen"],
  },
  {
    text: "Ein Tag auf der Venus dauert länger als ein ganzes Venusjahr um die Sonne.",
    kind: "wissen",
    stufen: ["teens"],
  },
  {
    text: "Eine Zahl ist durch drei teilbar, wenn ihre Ziffernsumme es ist.",
    kind: "wissen",
    stufen: ["erwachsen"],
  },
  {
    text: "Es gibt unendlich viele Primzahlen, das wusste schon Euklid in der Antike.",
    kind: "wissen",
    stufen: ["erwachsen"],
  },
  {
    text: "Faultiere bewegen sich im Wasser schwimmend schneller fort als am Boden kriechend.",
    kind: "wissen",
    stufen: ["teens"],
  },
  {
    text: "Glas ist kein träges Fluid; alte Fenster sind nicht nach unten geflossen.",
    kind: "wissen",
    stufen: ["erwachsen"],
  },
  {
    text: "Honig verdirbt praktisch nie und bleibt nach Jahrtausenden noch essbar.",
    kind: "wissen",
    stufen: ["erwachsen"],
  },
  {
    text: "Im All gibt es eine Wolke, die nach Himbeeren und Rum riechen könnte.",
    kind: "wissen",
    stufen: ["erwachsen"],
  },
  {
    text: "Im Deutschen kann man Wörter fast beliebig zu langen Komposita verketten.",
    kind: "wissen",
    stufen: ["erwachsen"],
  },
  {
    text: "Im Jahr 1816 fiel der Sommer aus, weil ein Vulkan den Himmel verdunkelte.",
    kind: "wissen",
    stufen: ["erwachsen"],
  },
  {
    text: "Im menschlichen Körper leben fast so viele Bakterien wie eigene Zellen.",
    kind: "wissen",
    stufen: ["erwachsen"],
  },
  {
    text: "Im menschlichen Körper stecken etwa so viele Bakterien wie eigene Zellen.",
    kind: "wissen",
    stufen: ["teens"],
  },
  {
    text: "Im Vakuum des Weltalls breitet sich kein Schall aus, denn er braucht Materie.",
    kind: "wissen",
    stufen: ["teens"],
  },
  {
    text: "Kleopatra lebte zeitlich näher am ersten iPhone als am Bau der großen Pyramide.",
    kind: "wissen",
    stufen: ["teens"],
  },
  {
    text: "Kleopatra lebte zeitlich näher an der Mondlandung als am Pyramidenbau.",
    kind: "wissen",
    stufen: ["erwachsen"],
  },
  {
    text: "Knochen sind Gewicht für Gewicht stabiler als so mancher Baustahl.",
    kind: "wissen",
    stufen: ["erwachsen"],
  },
  {
    text: "Mische 23 Menschen, und meist teilen zwei davon denselben Geburtstag.",
    kind: "wissen",
    stufen: ["erwachsen"],
  },
  {
    text: "Napoleon war für seine Zeit gar nicht klein, sondern eher durchschnittlich groß.",
    kind: "wissen",
    stufen: ["erwachsen"],
  },
  {
    text: "Neutronensterne sind so dicht, dass ein Teelöffel davon Milliarden Tonnen wiegt.",
    kind: "wissen",
    stufen: ["erwachsen"],
  },
  {
    text: "Null hoch null wird in der Mathematik meist als eins festgelegt, nicht als null.",
    kind: "wissen",
    stufen: ["teens"],
  },
  {
    text: "Null hoch null wird in der Mathematik meist als Eins festgelegt.",
    kind: "wissen",
    stufen: ["erwachsen"],
  },
  {
    text: "Oktopusse besitzen drei Herzen und blaues Blut auf Kupferbasis.",
    kind: "wissen",
    stufen: ["erwachsen"],
  },
  {
    text: "Oktopusse haben drei Herzen und blaues Blut auf Basis von Kupfer statt Eisen.",
    kind: "wissen",
    stufen: ["teens"],
  },
  {
    text: "Russland erstreckt sich über elf Zeitzonen von West nach Ost.",
    kind: "wissen",
    stufen: ["erwachsen"],
  },
  {
    text: "Wale stammen von landlebenden Säugetieren ab, die zurück ins Meer gingen.",
    kind: "wissen",
    stufen: ["teens"],
  },
];
