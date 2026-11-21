/**
 * ★ DIE PROGRAMME IN DER ENGLISCHEN BEDIENUNG (EN6b, 19.09.2026).
 *
 * „Meine Klassen" nennt die Lernprogramme an zwei Stellen: als Reiter im
 * Klassenkopf (`MeineKlassePage.tsx`) und als Häkchen „Programme dieser
 * Klasse" (`KlasseUndKinder.tsx`). Beide zeigen den Namen und - als Hinweis -
 * seit 19.09.2026 eine ausführliche Beschreibung ({@link PROGRAMM_BESCHREIBUNG});
 * bis dahin nur einen Kurzsatz (`LwProgram.hint`, „10-Finger-Schreiben").
 *
 * ⚠️ Warum hier und nicht in `lib/lernwerkstatt/klassen.ts`: Die Liste dort
 * gehört allen Programmen (`apps/GEMEINSAM.md` §1). Die englischen Kurzsätze
 * braucht nur die englische Bedienung von Tastenflow - sie stehen darum neben
 * den zwei Bauteilen, die sie zeigen, EINMAL für beide.
 *
 * Die NAMEN bleiben (Glossar §2): Tastenflow, Punktgenau, Klangpunkte,
 * »im Griff«, Plus. Alle ausser Tastenflow sind deutschsprachig - ihre
 * Beschreibung sagt das dazu („in German", wie beim Handbuch-Knopf, Glossar §3.15), und
 * ihr Name steht in `lang="de"`, damit eine Sprachausgabe ihn deutsch spricht.
 */
import type { BedienSprache } from "@/lib/bedienSprache";
import { istGeruestSprache, type GeruestSprache } from "@/lib/typing/sprachRegister";
import type { LwProgram, LwProgramKey } from "@/lib/lernwerkstatt/klassen";

/**
 * ★ 19.09.2026, Johannes: „bei den App-Schaltern brauchen wir es
 * ausführlicher (was macht die App)". Was die App tut - in Anlehnung an die
 * Beschreibungen der Lernwerkstatt-Seite (`LernwerkstattPage.tsx`,
 * `LERNPROGRAMME`), für Lehrkräfte gefasst. Benutzt am Programm-Reiter in
 * „Meine Klassen" (dort mit dem Satz, was der Reiter zeigt) und an den
 * Programm-Häkchen unter „Kinder und Zugänge". Ohne den Namen vorn - der
 * steht schon auf dem Schalter (und „im Griff" wäre im englischen Satz ein
 * deutsches Wort ohne `lang`).
 */
export const PROGRAMM_BESCHREIBUNG: Readonly<
  Record<BedienSprache, Readonly<Record<LwProgramKey, string>>>
> = {
  de: {
    tippen:
      "Das 10-Fingersystem lernen: blind tippen Schritt für Schritt, von der Grundstellung bis zum ganzen Alphabet, mit Geschichten, Wortspielen, Tippchallenge und Klassenmatch. Stark vergrößerbar, mit Tönen und Sprachausgabe.",
    braille:
      "Brailleschrift lernen: die sechs Punkte Schritt für Schritt, von den ersten Buchstaben über die Vollschrift bis zu Kurzschrift und Computerbraille. Mit Tönen, großer Vergrößerung und Sprachausgabe.",
    klangpunkte:
      "Braille-Noten und Musik: die Braille-Notenschrift mit echten Tönen hören, fühlen und schreiben, von der ersten Note bis zum ganzen Lied, dazu Musiktheorie in eigenen Kapiteln.",
    computer:
      "Computer und Hilfsmittel: Tastenkürzel, Screenreader-Navigation und Computer-Wege, geübt mit dem eigenen Hilfsmittel - Bildschirmlupe, NVDA oder JAWS unter Windows, VoiceOver oder Zoomen am Mac - oder ganz ohne.",
    plus:
      "Rechnen im Kopf und auf der Zeile: 161 Übungen von der 1. bis zur 8. Schulstufe - Kopfrechnen, Größen, Brüche, Prozent, Gleichungen. Geschrieben wird linear wie in den adaptierten Schulbüchern, also auf einer Zeile statt untereinander, mit Braillezeile, Sprachausgabe und acht Spielen.",
    lexami:
      "Wörterbuch und Vokabeln: Deutsch mit Englisch, Französisch, Spanisch, Italienisch, Russisch, Latein, Türkisch, Polnisch, Kroatisch, Serbisch und Arabisch nachschlagen, Lernlisten anlegen und mit dem Quiz in drei Stufen üben - mit Tagesrunde, Vokabelprobe und Lernaufgabe für die Klasse. Mit Screenreader, Braillezeile und Sprachausgabe.",
  },
  en: {
    tippen:
      "Learn to touch type: typing without looking, step by step, from the home keys to the whole alphabet, with stories, word games, Typing Challenge and Class Match. Can be magnified a lot, with sounds and speech.",
    braille:
      "Learn braille: the six dots step by step, from the first letters through uncontracted braille to contracted and computer braille. With sounds, large magnification and speech. The app itself is in German.",
    klangpunkte:
      "Braille music: read, feel and write braille music notation with real sounds, from the first note to a whole song, plus music theory in chapters of its own. The app itself is in German.",
    computer:
      "Computers and assistive technology: keyboard shortcuts, screen reader navigation and ways around the computer, practised with the pupil's own tools - magnifier, NVDA or JAWS on Windows, VoiceOver or Zoom on a Mac - or with none. The app itself is in German.",
    plus:
      "Mental arithmetic and maths written on one line: 161 sets of exercises for the first eight school years - mental arithmetic, measures, fractions, percentages, equations. Sums are written linearly, as in the adapted textbooks, on a single line rather than in columns, with braille display, speech and eight games. The app itself is in German.",
    lexami:
      "Dictionary and vocabulary: look up German with English, French, Spanish, Italian, Russian, Latin, Turkish, Polish, Croatian, Serbian and Arabic, make word lists and practise them with a three-level quiz - with a daily round, vocabulary tests and class assignments. With screen reader, braille display and speech. The app itself is in German.",
  },
  // ★ Feinschliff fr (26.09.2026): die französischen Beschreibungen - bis
  // dahin standen hier die englischen Texte als Platzhalter (E2a). Die vier
  // deutschsprachigen Programme sagen es dazu („en allemand").
  fr: {
    tippen:
      "Apprendre la frappe à dix doigts : taper sans regarder, pas à pas, de la rangée de base à tout l'alphabet, avec des histoires, des jeux de lettres, le Défi et le Match de la classe. Fort agrandissement possible, avec des sons et la lecture à voix haute.",
    braille:
      "Apprendre le braille : les six points pas à pas, des premières lettres au braille intégral, puis au braille abrégé et au braille informatique. Avec des sons, un fort agrandissement et la lecture à voix haute. Le programme lui-même est en allemand.",
    klangpunkte:
      "Musique en braille : lire, sentir et écrire la notation musicale braille avec de vrais sons, de la première note à une chanson entière, et la théorie musicale dans des chapitres à part. Le programme lui-même est en allemand.",
    computer:
      "Ordinateur et aides techniques : raccourcis clavier, navigation avec un lecteur d'écran et chemins dans l'ordinateur, exercés avec l'aide technique de l'élève - loupe, NVDA ou JAWS sous Windows, VoiceOver ou Zoom sur Mac - ou sans aucune aide. Le programme lui-même est en allemand.",
    plus:
      "Calcul mental et calcul en ligne : 161 séries d'exercices pour les huit premières années d'école - calcul mental, grandeurs, fractions, pourcentages, équations. Les calculs s'écrivent en ligne, comme dans les manuels adaptés, sur une seule ligne plutôt qu'en colonnes, avec plage braille, lecture à voix haute et huit jeux. Le programme lui-même est en allemand.",
    lexami:
      "Dictionary and vocabulary: look up German with English, French, Spanish, Italian, Russian, Latin, Turkish, Polish, Croatian, Serbian and Arabic, make word lists and practise them with a three-level quiz - with a daily round, vocabulary tests and class assignments. With screen reader, braille display and speech. The app itself is in German.",
  },
  // ★ ES-O (27.09.2026): die spanischen Beschreibungen - wie bei „fr" sagen die
  // vier deutschsprachigen Programme es dazu („en alemán").
  es: {
    tippen:
      "Aprender mecanografía con diez dedos: escribir sin mirar, paso a paso, de la fila guía a todo el alfabeto, con cuentos, juegos de palabras, el Reto y la Competición de la clase. Se puede ampliar mucho, con sonidos y lectura en voz alta.",
    braille:
      "Aprender braille: los seis puntos paso a paso, de las primeras letras al braille integral, al braille abreviado y al braille informático. Con sonidos, gran ampliación y lectura en voz alta. El programa en sí está en alemán.",
    klangpunkte:
      "Música en braille: leer, sentir y escribir la musicografía braille con sonidos reales, de la primera nota a una canción entera, y teoría musical en capítulos propios. El programa en sí está en alemán.",
    computer:
      "El equipo y las ayudas técnicas: atajos de teclado, navegación con lector de pantalla y caminos por el sistema, practicados con la propia ayuda técnica - lupa, NVDA o JAWS en Windows, VoiceOver o Zoom en Mac - o sin ninguna. El programa en sí está en alemán.",
    plus:
      "Cálculo mental y cálculo en línea: 161 series de ejercicios para los ocho primeros cursos - cálculo mental, magnitudes, fracciones, porcentajes, ecuaciones. Las cuentas se escriben en línea, como en los libros adaptados, en una sola línea en lugar de en columnas, con línea braille, lectura en voz alta y ocho juegos. El programa en sí está en alemán.",
    lexami:
      "Dictionary and vocabulary: look up German with English, French, Spanish, Italian, Russian, Latin, Turkish, Polish, Croatian, Serbian and Arabic, make word lists and practise them with a three-level quiz - with a daily round, vocabulary tests and class assignments. With screen reader, braille display and speech. The app itself is in German.",
  },
  // ★ O-IT (02.10.2026): die italienischen Beschreibungen - die vier
  // deutschsprachigen Programme sagen es dazu („in tedesco").
  it: {
    tippen:
      "Imparare a scrivere con dieci dita: scrivere senza guardare la tastiera, passo per passo, dalla riga di base a tutto l'alfabeto, con storie, giochi di parole, la Sfida e la Gara di classe. Si può ingrandire molto, con suoni e lettura ad alta voce.",
    braille:
      "Imparare il braille: i sei punti passo per passo, dalle prime lettere al braille integrale, poi al braille abbreviato e al braille informatico. Con suoni, forte ingrandimento e lettura ad alta voce. Il programma stesso è in tedesco.",
    klangpunkte:
      "Musica in braille: leggere, sentire e scrivere la notazione musicale braille con suoni veri, dalla prima nota a una canzone intera, e la teoria musicale in capitoli a parte. Il programma stesso è in tedesco.",
    computer:
      "Computer e ausili: scorciatoie da tastiera, navigazione con il lettore di schermo e percorsi nel computer, esercitati con il proprio ausilio - lente di ingrandimento, NVDA o JAWS su Windows, VoiceOver o Zoom su Mac - o senza nessuno. Il programma stesso è in tedesco.",
    plus:
      "Calcolo a mente e calcolo in riga: 161 serie di esercizi per i primi otto anni di scuola - calcolo a mente, grandezze, frazioni, percentuali, equazioni. I calcoli si scrivono in riga, come nei libri adattati, su una sola riga invece che in colonna, con display braille, lettura ad alta voce e otto giochi. Il programma stesso è in tedesco.",
    lexami:
      "Dictionary and vocabulary: look up German with English, French, Spanish, Italian, Russian, Latin, Turkish, Polish, Croatian, Serbian and Arabic, make word lists and practise them with a three-level quiz - with a daily round, vocabulary tests and class assignments. With screen reader, braille display and speech. The app itself is in German.",
  },
  // ★ O-PL (02.10.2026): die polnischen Beschreibungen - die vier
  // deutschsprachigen Programme sagen es dazu („po niemiecku", Glossar §3);
  // „pisanie bezwzrokowe" ist das Normalwort für alle (Regel 4).
  pl: {
    tippen:
      "Nauka pisania dziesięcioma palcami: pisanie bezwzrokowe krok po kroku, od rzędu podstawowego do całego alfabetu, z opowiadaniami, grami słownymi, Wyzwaniem i Wyścigiem klasowym. Można mocno powiększać, są dźwięki i czytanie na głos.",
    braille:
      "Nauka pisma Braille'a: sześć punktów krok po kroku, od pierwszych liter przez brajl pełny po skróty i brajl komputerowy. Z dźwiękami, dużym powiększeniem i czytaniem na głos. Sam program jest po niemiecku.",
    klangpunkte:
      "Nuty brajlowskie i muzyka: czytanie, dotykanie i zapisywanie brajlowskiej notacji muzycznej z prawdziwymi dźwiękami, od pierwszej nuty do całej piosenki, a do tego teoria muzyki w osobnych rozdziałach. Sam program jest po niemiecku.",
    computer:
      "Komputer i technologie wspomagające: skróty klawiaturowe, nawigacja czytnikiem ekranu i sposoby obsługi komputera, ćwiczone z własnymi narzędziami - Lupa, NVDA albo JAWS w systemie Windows, VoiceOver albo Zoom na Macu - albo bez żadnych. Sam program jest po niemiecku.",
    plus:
      "Liczenie w pamięci i zapis w jednym wierszu: 161 zestawów ćwiczeń dla pierwszych ośmiu klas - liczenie w pamięci, jednostki, ułamki, procenty, równania. Działania zapisuje się w jednym wierszu, jak w podręcznikach dostosowanych, a nie w słupkach, z monitorem brajlowskim, czytaniem na głos i ośmioma grami. Sam program jest po niemiecku.",
    lexami:
      "Dictionary and vocabulary: look up German with English, French, Spanish, Italian, Russian, Latin, Turkish, Polish, Croatian, Serbian and Arabic, make word lists and practise them with a three-level quiz - with a daily round, vocabulary tests and class assignments. With screen reader, braille display and speech. The app itself is in German.",
  },
  // ★ O-TR (02.10.2026): die türkischen Beschreibungen - die vier
  // deutschsprachigen Programme sagen es dazu ("Programın kendisi Almancadır");
  // "on parmak klavye" (Glossar Regel 4), keine Endung an Windows/Mac (Regel 6).
  tr: {
    tippen:
      "On parmak klavyeyi öğrenmek: temel sıradan bütün alfabeye kadar adım adım klavyeye bakmadan yazmak; öyküler, kelime oyunları, Yarışma ve Sınıf Maçı ile. Ekran çok büyütülebilir, ses efektleri ve sesli okuma vardır.",
    braille:
      "Braille yazısını öğrenmek: altı nokta adım adım, ilk harflerden tam yazıya, oradan kısaltmalı yazıya ve bilgisayar Braille yazısına kadar. Ses efektleri, güçlü büyütme ve sesli okuma ile. Programın kendisi Almancadır.",
    klangpunkte:
      "Braille nota yazısı ve müzik: Braille nota yazısını gerçek seslerle dinlemek, parmaklarla okumak ve yazmak; ilk notadan bütün bir şarkıya kadar, ayrıca ayrı bölümlerde müzik bilgisi. Programın kendisi Almancadır.",
    computer:
      "Bilgisayar ve yardımcı teknolojiler: klavye kısayolları, ekran okuyucu ile gezinme ve bilgisayarda kullanılan yollar; öğrencinin kendi yardımcı teknolojisiyle çalışılır - Windows bilgisayarda Büyüteç, NVDA veya JAWS, Mac bilgisayarda VoiceOver veya Büyütme - ya da hiçbiri olmadan. Programın kendisi Almancadır.",
    plus:
      "Zihinden ve tek satırda hesap: ilk sekiz sınıf düzeyi için 161 alıştırma dizisi - zihinden hesap, ölçüler, kesirler, yüzdeler, denklemler. İşlemler, uyarlanmış ders kitaplarındaki gibi alt alta değil, tek satırda yazılır; Braille ekran, sesli okuma ve sekiz oyun ile. Programın kendisi Almancadır.",
    lexami:
      "Dictionary and vocabulary: look up German with English, French, Spanish, Italian, Russian, Latin, Turkish, Polish, Croatian, Serbian and Arabic, make word lists and practise them with a three-level quiz - with a daily round, vocabulary tests and class assignments. With screen reader, braille display and speech. The app itself is in German.",
  },
  // ★ O-CS (03.10.2026): die tschechischen Beschreibungen - die vier
  // deutschsprachigen Programme sagen es dazu („Samotný program je v němčině");
  // „psaní všemi deseti", „bez dívání na klávesnici" (Glossar Regel 4).
  cs: {
    tippen:
      "Naučit se psát všemi deseti: krok za krokem bez dívání na klávesnici, od základní řady až po celou abecedu, s příběhy, slovními hrami, Výzvou a Třídním závodem. Lze hodně zvětšit, se zvuky a hlasovým výstupem.",
    braille:
      "Naučit se Braillovo písmo: šest bodů krok za krokem, od prvních písmen přes plné písmo až ke zkratkám a počítačovému Braillovu písmu. Se zvuky, velkým zvětšením a předčítáním. Samotný program je v němčině.",
    klangpunkte:
      "Braillský notopis a hudba: poslouchat, číst hmatem a zapisovat noty v Braillově písmu s opravdovými zvuky, od první noty po celou píseň, k tomu hudební nauka v samostatných kapitolách. Samotný program je v němčině.",
    computer:
      "Počítač a kompenzační pomůcky: klávesové zkratky, ovládání s odečítačem obrazovky a cesty v počítači, procvičované s vlastní pomůckou - Lupa, NVDA nebo JAWS ve Windows, VoiceOver nebo Zvětšení na Macu - nebo úplně bez ní. Samotný program je v němčině.",
    plus:
      "Počítání zpaměti a zápis do jednoho řádku: 161 sad cvičení pro prvních osm ročníků - počítání zpaměti, jednotky, zlomky, procenta, rovnice. Příklady se zapisují do jednoho řádku jako v upravených učebnicích, ne pod sebe, s braillským řádkem, předčítáním a osmi hrami. Samotný program je v němčině.",
    lexami:
      "Dictionary and vocabulary: look up German with English, French, Spanish, Italian, Russian, Latin, Turkish, Polish, Croatian, Serbian and Arabic, make word lists and practise them with a three-level quiz - with a daily round, vocabulary tests and class assignments. With screen reader, braille display and speech. The app itself is in German.",
  },
  bg: {
    tippen:
      "Писане с десет пръста: стъпка по стъпка, без да гледаш клавиатурата, от основния ред до цялата азбука, с истории, игри с думи, Предизвикателство и Състезание в класа. Може силно да се увеличи, със звуци и синтезатор на реч.",
    braille:
      "Брайлово писмо: шестте точки стъпка по стъпка, от първите букви през пълното брайлово писмо до съкращенията и компютърното брайлово писмо. Със звуци, голямо увеличение и четене на глас. Самата програма е на немски език.",
    klangpunkte:
      "Брайлов нотопис и музика: слушане, четене с пръсти и писане на ноти на брайлово писмо с истински звуци, от първата нота до цяла песен, а също теория на музиката в отделни глави. Самата програма е на немски език.",
    computer:
      "Компютър и помощни средства: клавишни комбинации, работа с екранен четец и пътища в компютъра, упражнявани със собственото помощно средство - Лупа, NVDA или JAWS в Windows, VoiceOver или Увеличение на Mac - или без такова. Самата програма е на немски език.",
    plus:
      "Смятане наум и запис на един ред: 161 комплекта упражнения за първите осем класа - смятане наум, мерни единици, дроби, проценти, уравнения. Задачите се записват на един ред, както в адаптираните учебници, а не една под друга, с брайлов дисплей, четене на глас и осем игри. Самата програма е на немски език.",
    lexami:
      "Dictionary and vocabulary: look up German with English, French, Spanish, Italian, Russian, Latin, Turkish, Polish, Croatian, Serbian and Arabic, make word lists and practise them with a three-level quiz - with a daily round, vocabulary tests and class assignments. With screen reader, braille display and speech. The app itself is in German.",
  },
  el: {
    tippen:
      "Εκμάθηση δακτυλογράφησης με δέκα δάχτυλα: γραφή χωρίς ματιά στα πλήκτρα, βήμα βήμα, από τη βασική θέση ως όλο το αλφάβητο, με ιστορίες, Παιχνίδια λέξεων, Πρόκληση και Αγώνα τμήματος. Με μεγάλη μεγέθυνση, ήχους και σύνθεση ομιλίας.",
    braille:
      "Εκμάθηση της γραφής Braille: οι έξι κουκκίδες βήμα βήμα, από τα πρώτα γράμματα και την πλήρη γραφή ως τη συντομογραφία και το Braille υπολογιστή. Με ήχους, μεγάλη μεγέθυνση και σύνθεση ομιλίας. Το ίδιο το πρόγραμμα είναι στα Γερμανικά.",
    klangpunkte:
      "Μουσική σημειογραφία Braille και μουσική: ακρόαση, ανάγνωση με την αφή και γραφή νοτών σε Braille με πραγματικούς ήχους, από την πρώτη νότα ως ολόκληρο τραγούδι, και επιπλέον θεωρία της μουσικής σε δικά της κεφάλαια. Το ίδιο το πρόγραμμα είναι στα Γερμανικά.",
    computer:
      "Υπολογιστής και υποστηρικτική τεχνολογία: συντομεύσεις πληκτρολογίου, πλοήγηση με αναγνώστη οθόνης και δρόμοι στον υπολογιστή, με εξάσκηση στη δική του υποστηρικτική τεχνολογία κάθε ατόμου - Μεγεθυντικός φακός, NVDA ή JAWS στα Windows, VoiceOver ή Μεγέθυνση στο Mac - ή και χωρίς αυτήν. Το ίδιο το πρόγραμμα είναι στα Γερμανικά.",
    plus:
      "Υπολογισμοί με το μυαλό και σε μία γραμμή: 161 ενότητες ασκήσεων για τις πρώτες οκτώ τάξεις - νοεροί υπολογισμοί, μεγέθη, κλάσματα, ποσοστά, εξισώσεις. Οι πράξεις γράφονται σε μία γραμμή, όπως στα προσαρμοσμένα σχολικά βιβλία, όχι η μία κάτω από την άλλη, με οθόνη braille, σύνθεση ομιλίας και οκτώ παιχνίδια. Το ίδιο το πρόγραμμα είναι στα Γερμανικά.",
    lexami:
      "Dictionary and vocabulary: look up German with English, French, Spanish, Italian, Russian, Latin, Turkish, Polish, Croatian, Serbian and Arabic, make word lists and practise them with a three-level quiz - with a daily round, vocabulary tests and class assignments. With screen reader, braille display and speech. The app itself is in German.",
  },
  hu: {
    tippen:
      "Tízujjas gépelés tanulása: lépésről lépésre, a billentyűzet nézése nélkül, az alapállástól az egész ábécéig, történetekkel, szójátékokkal, Kihívással és Osztályversennyel. Erősen nagyítható, hangokkal és felolvasással.",
    braille:
      "Braille-írás tanulása: a hat pont lépésről lépésre, az első betűktől a teljes íráson át a rövidírásig és a számítógépes Braille-írásig. Hangokkal, nagy nagyítással és felolvasással. Maga a program német nyelvű.",
    klangpunkte:
      "Braille-kotta és zene: a Braille-kottaírást valódi hangokkal hallgatni, tapintással olvasni és írni, az első hangjegytől egy egész dalig, mellette zeneelmélet külön fejezetekben. Maga a program német nyelvű.",
    computer:
      "Számítógép és segédeszközök: billentyűparancsok, navigálás képernyőolvasóval és utak a számítógépen, a saját segédeszközzel gyakorolva - Nagyító, NVDA vagy JAWS Windows alatt, VoiceOver vagy Nagyítás Mac gépen - vagy teljesen anélkül. Maga a program német nyelvű.",
    plus:
      "Fejszámolás és írás egy sorban: 161 gyakorlatsor az első nyolc évfolyamra - fejszámolás, mértékegységek, törtek, százalékszámítás, egyenletek. A feladatokat egy sorba írjuk, mint az adaptált tankönyvekben, nem egymás alá, Braille-kijelzővel, felolvasással és nyolc játékkal. Maga a program német nyelvű.",
    lexami:
      "Dictionary and vocabulary: look up German with English, French, Spanish, Italian, Russian, Latin, Turkish, Polish, Croatian, Serbian and Arabic, make word lists and practise them with a three-level quiz - with a daily round, vocabulary tests and class assignments. With screen reader, braille display and speech. The app itself is in German.",
  },
  nl: {
    tippen:
      "Met tien vingers leren typen: stap voor stap zonder naar het toetsenbord te kijken, van de basisrij tot het hele alfabet, met verhalen, woordspelletjes, Uitdaging en Klassenwedstrijd. Sterk te vergroten, met geluiden en spraakuitvoer.",
    braille:
      "Braille leren: de zes punten stap voor stap, van de eerste letters via volschrift tot kortschrift en computerbraille. Met geluiden, sterke vergroting en spraakuitvoer. Het programma zelf is in het Duits.",
    klangpunkte:
      "Braillemuziek: het braillenotenschrift met echte klanken horen, voelen en schrijven, van de eerste noot tot een heel lied, plus muziektheorie in eigen hoofdstukken. Het programma zelf is in het Duits.",
    computer:
      "Computer en hulpmiddelen: sneltoetsen, navigeren met een schermlezer en routes op de computer, geoefend met het eigen hulpmiddel - Vergrootglas, NVDA of JAWS op Windows, VoiceOver of Zoomen op de Mac - of helemaal zonder. Het programma zelf is in het Duits.",
    plus:
      "Hoofdrekenen en rekenen op één regel: 161 oefenreeksen voor de eerste acht leerjaren - hoofdrekenen, maten, breuken, procenten, vergelijkingen. Er wordt lineair geschreven zoals in de aangepaste schoolboeken, dus op één regel in plaats van onder elkaar, met brailleleesregel, spraakuitvoer en acht spelletjes. Het programma zelf is in het Duits.",
    lexami:
      "Dictionary and vocabulary: look up German with English, French, Spanish, Italian, Russian, Latin, Turkish, Polish, Croatian, Serbian and Arabic, make word lists and practise them with a three-level quiz - with a daily round, vocabulary tests and class assignments. With screen reader, braille display and speech. The app itself is in German.",
  },
  pt: {
    tippen:
      "Aprender a escrever com os dez dedos: sem olhar para o teclado, passo a passo, da posição inicial ao alfabeto completo, com histórias, jogos de palavras, Desafio e Corrida da turma. Permite grande ampliação, com sons e síntese de voz.",
    braille:
      "Aprender braille: os seis pontos passo a passo, das primeiras letras ao braille integral, ao braille abreviado e ao braille informático. Com sons, grande ampliação e síntese de voz. O programa em si está em alemão.",
    klangpunkte:
      "Música em braille: ouvir, sentir e escrever a musicografia braille com sons reais, da primeira nota a uma canção completa, além de teoria musical em capítulos próprios. O programa em si está em alemão.",
    computer:
      "Computador e produtos de apoio: atalhos de teclado, navegação com leitor de ecrã e caminhos no computador, praticados com o próprio produto de apoio - Lupa, NVDA ou JAWS no Windows, VoiceOver ou Zoom no Mac - ou sem nenhum. O programa em si está em alemão.",
    plus:
      "Cálculo mental e escrita numa só linha: 161 conjuntos de exercícios para os primeiros oito anos de escolaridade - cálculo mental, grandezas, frações, percentagens, equações. As contas escrevem-se numa só linha, como nos manuais adaptados, e não em colunas, com linha braille, síntese de voz e oito jogos. O programa em si está em alemão.",
    lexami:
      "Dictionary and vocabulary: look up German with English, French, Spanish, Italian, Russian, Latin, Turkish, Polish, Croatian, Serbian and Arabic, make word lists and practise them with a three-level quiz - with a daily round, vocabulary tests and class assignments. With screen reader, braille display and speech. The app itself is in German.",
  },
  br: {
    tippen:
      "Aprender a digitação com os dez dedos: digitar sem olhar para o teclado, passo a passo, da posição inicial ao alfabeto inteiro, com histórias, jogos de palavras, Desafio e Competição da turma. Com muita ampliação, sons e síntese de voz.",
    braille:
      "Aprender braille: os seis pontos passo a passo, das primeiras letras ao braille por extenso, até o braille abreviado e o braille para computador. Com sons, muita ampliação e síntese de voz. O aplicativo em si está em alemão.",
    klangpunkte:
      "Musicografia braille: ouvir, ler com o tato e escrever notas em braille com sons de verdade, da primeira nota à música inteira, além de teoria musical em capítulos próprios. O aplicativo em si está em alemão.",
    computer:
      "Computador e tecnologia assistiva: atalhos de teclado, navegação com leitor de tela e caminhos pelo computador, praticados com a própria tecnologia assistiva - Lupa, NVDA ou JAWS no Windows, VoiceOver ou Zoom no Mac - ou sem nenhuma. O aplicativo em si está em alemão.",
    plus:
      "Cálculo mental e escrita em uma linha: 161 conjuntos de exercícios do 1º ao 8º ano - cálculo mental, medidas, frações, porcentagens, equações. As contas são escritas em uma só linha, como nos livros didáticos adaptados, e não uma embaixo da outra, com linha braille, síntese de voz e oito jogos. O aplicativo em si está em alemão.",
    lexami:
      "Dictionary and vocabulary: look up German with English, French, Spanish, Italian, Russian, Latin, Turkish, Polish, Croatian, Serbian and Arabic, make word lists and practise them with a three-level quiz - with a daily round, vocabulary tests and class assignments. With screen reader, braille display and speech. The app itself is in German.",
  },
  ro: {
    tippen:
      "Scrierea cu zece degete, pas cu pas și fără privirea pe tastatură: de la șirul de bază până la tot alfabetul, cu povești, jocuri cu cuvinte, Provocare și Întrecerea clasei. Se poate mări mult, cu sunete și sinteză vocală.",
    braille:
      "Scrierea braille: cele șase puncte, pas cu pas, de la primele litere, prin braille integral, până la braille prescurtat și braille pentru computer. Cu sunete, mărire puternică și sinteză vocală. Aplicația în sine este în limba germană.",
    klangpunkte:
      "Notația muzicală braille și muzica: note în braille ascultate, citite cu degetele și scrise, cu sunete reale, de la prima notă până la un cântec întreg, plus teorie muzicală în capitole proprii. Aplicația în sine este în limba germană.",
    computer:
      "Computerul și tehnologiile asistive: comenzi rapide de la tastatură, navigare cu cititorul de ecran și drumuri în computer, exersate cu propria tehnologie asistivă - Lupă, NVDA sau JAWS în Windows, VoiceOver sau Zoom pe Mac - sau complet fără. Aplicația în sine este în limba germană.",
    plus:
      "Calcul mintal și scriere pe un singur rând: 161 de exerciții pentru primii opt ani de studiu - calcul mintal, mărimi, fracții, procente, ecuații. Se scrie liniar, ca în manualele adaptate, adică pe un singur rând, nu unul sub altul, cu afișaj braille, sinteză vocală și opt jocuri. Aplicația în sine este în limba germană.",
    lexami:
      "Dictionary and vocabulary: look up German with English, French, Spanish, Italian, Russian, Latin, Turkish, Polish, Croatian, Serbian and Arabic, make word lists and practise them with a three-level quiz - with a daily round, vocabulary tests and class assignments. With screen reader, braille display and speech. The app itself is in German.",
  },
  sv: {
    tippen:
      "Lär dig skriva med alla tio fingrar: steg för steg utan att titta på tangentbordet, från grundraden till hela alfabetet, med berättelser, ordlekar, Utmaningen och Klasstävlingen. Kan förstoras mycket, med ljud och talsyntes.",
    braille:
      "Lär dig punktskrift: de sex punkterna steg för steg, från de första bokstäverna via fullskrift till kortskrift och datorpunktskrift. Med ljud, stor förstoring och talsyntes. Själva programmet är på tyska.",
    klangpunkte:
      "Musik i punktskrift: lyssna på, känn och skriv noter i punktskrift med riktiga toner, från den första noten till en hel sång, och dessutom musikteori i egna kapitel. Själva programmet är på tyska.",
    computer:
      "Dator och hjälpmedel: kortkommandon, navigering med skärmläsare och vägar i datorn, som övas med det egna hjälpmedlet - Förstoringsglaset, NVDA eller JAWS i Windows, VoiceOver eller Zoom på Mac - eller helt utan. Själva programmet är på tyska.",
    plus:
      "Huvudräkning och räkning på en rad: 161 övningar för de första åtta årskurserna - huvudräkning, storheter, bråk, procent, ekvationer. Talen skrivs på en rad som i anpassade läroböcker, inte under varandra, med punktskriftsdisplay, talsyntes och åtta spel. Själva programmet är på tyska.",
    lexami:
      "Dictionary and vocabulary: look up German with English, French, Spanish, Italian, Russian, Latin, Turkish, Polish, Croatian, Serbian and Arabic, make word lists and practise them with a three-level quiz - with a daily round, vocabulary tests and class assignments. With screen reader, braille display and speech. The app itself is in German.",
  },
  uk: {
    tippen:
      "Опанувати десятипальцевий метод: крок за кроком друк, не дивлячись на клавіатуру, від основного ряду до всієї абетки, з історіями, іграми зі словами, Викликом і Перегонами класу. Можна сильно збільшувати, зі звуками й синтезатором мовлення.",
    braille:
      "Вивчити шрифт Брайля: шість крапок крок за кроком, від перших літер через повне письмо до скорочень і комп'ютерного шрифту Брайля. Зі звуками, великим збільшенням і читанням уголос. Сама програма німецькою мовою.",
    klangpunkte:
      "Нотний шрифт Брайля і музика: слухати, читати дотиком і записувати ноти шрифтом Брайля зі справжніми звуками, від першої ноти до цілої пісні, а також теорія музики в окремих розділах. Сама програма німецькою мовою.",
    computer:
      "Комп'ютер і допоміжні засоби: сполучення клавіш, керування читачем екрана і шляхи в комп'ютері, тренування з власним допоміжним засобом - Екранна лупа, NVDA або JAWS у Windows, VoiceOver або Збільшення на Mac - або зовсім без нього. Сама програма німецькою мовою.",
    plus:
      "Усна лічба і запис в один рядок: 161 набір вправ для перших восьми років навчання - усна лічба, величини, дроби, відсотки, рівняння. Приклади записуються в один рядок, як в адаптованих підручниках, а не стовпчиком, з брайлівським дисплеєм, читанням уголос і вісьмома іграми. Сама програма німецькою мовою.",
    lexami:
      "Dictionary and vocabulary: look up German with English, French, Spanish, Italian, Russian, Latin, Turkish, Polish, Croatian, Serbian and Arabic, make word lists and practise them with a three-level quiz - with a daily round, vocabulary tests and class assignments. With screen reader, braille display and speech. The app itself is in German.",
  },
};

/** ★ O5 (30.10.2026): „Dieser Reiter zeigt …" für die neun (bis dahin Englisch); Wort für Reiter nach ihren Glossaren. */
const ZEIGT_NEUN: Readonly<Record<GeruestSprache, string>> = {
  bg: " Този раздел показва как класът упражнява в тази програма.",
  el: " Αυτή η καρτέλα δείχνει πώς εξασκείται το τμήμα σε αυτό το πρόγραμμα.",
  hu: " Ez a lap azt mutatja, hogyan gyakorol az osztály ebben a programban.",
  nl: " Dit tabblad laat zien hoe de klas in dit programma oefent.",
  pt: " Este separador mostra como a turma pratica neste programa.",
  br: " Esta guia mostra como a turma pratica neste programa.",
  ro: " Această filă arată cum exersează clasa în acest program.",
  sv: " Den här fliken visar hur klassen övar i programmet.",
  uk: " Ця вкладка показує, як клас тренується в цій програмі.",
};

/** Der Satz am Programm-Reiter in „Meine Klassen": was die App tut + was der Reiter zeigt. */
export function programmReiterHinweis(p: LwProgram, sprache: BedienSprache): string {
  // ★ E2a: „fr" wie „en" (englischer Satz) - sonst stünde der englische
  // Platzhalter aus `PROGRAMM_BESCHREIBUNG.fr` neben einem deutschen Satz.
  // ★ ES-O (27.09.2026): „es" bekommt den Satz spanisch (vorher englisch).
  const zeigt = istGeruestSprache(sprache)
    ? ZEIGT_NEUN[sprache]
    : sprache === "de"
      ? " Dieser Reiter zeigt, wie Ihre Klasse darin übt."
      : sprache === "es"
        ? " Esta pestaña muestra cómo practica su clase con él."
        : sprache === "it"
        ? " Questa scheda mostra come si esercita la classe con questo programma."
        : sprache === "pl"
        ? " Ta zakładka pokazuje, jak klasa ćwiczy w tym programie."
        : sprache === "tr"
        ? // ★ O-TR (02.10.2026): "bölüm" statt "sekme" (Glossar §4 Nr. 8: mehrdeutig).
          " Bu bölüm, sınıfınızın bu programla nasıl çalıştığını gösterir."
        : sprache === "cs"
        ? // ★ O-CS (03.10.2026): Reiter = „karta" (Glossar Regel 10).
          " Tato karta ukazuje, jak vaše třída v programu cvičí."
        : " This tab shows how your class is getting on with it.";
  return PROGRAMM_BESCHREIBUNG[sprache][p.key] + zeigt;
}

/**
 * Das `lang` für den NAMEN eines Programms: in der englischen Bedienung „de"
 * für die deutschsprachigen Programme, sonst nichts (auf Deutsch kommt kein
 * Attribut dazu - der DOM bleibt, wie er war).
 *
 * ★ „Plus" bekommt es ebenfalls. Das Wort gibt es im Englischen auch, aber es
 * ist hier der Name einer deutschen App - dieselbe Begründung wie bei den
 * Geschwistern, und eine englische Stimme spricht ihn dann so aus, wie das
 * Kind ihn in der Schule hört.
 */
export function programmNameLang(key: LwProgramKey, sprache: BedienSprache): "de" | undefined {
  // ★ E2a: „fr" wie „en" - eine nicht-deutsche Bedienung braucht das `lang`.
  return sprache !== "de" && key !== "tippen" ? "de" : undefined;
}
