/**
 * ★★★ DIE AUSWERTUNG EINER SCHREIBPROBE - was ein Kind sofort danach liest.
 *
 * Auftrag Johannes, 09.09.2026 (wörtlich):
 * *„wenn die zeit abgelaufen ist bekommen die schüler sofort eine detaillierte
 * auflistung ihrer leistung und sie sehen eine liste ihrer prüfungen in ihrer
 * eigenen statistik."*
 *
 * ── Zwei Orte, EIN Bauteil ──────────────────────────────────────────────────
 * Dieselbe Karte steht unmittelbar nach dem Abgeben (siehe `SchreibprobeLauf`)
 * UND später in der eigenen Statistik. Sie macht darum KEINE Annahme über ihre
 * Umgebung: kein Fenster, keine Fokusfalle, kein Escape, kein Zugriff auf einen
 * Plan oder ein Konto - alles, was sie zeigt, steht im {@link Probenergebnis}.
 * Zwei Fassungen derselben Auflistung wären genau die Doppelung, die in diesem
 * Projekt schon mehrfach auseinandergelaufen ist
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 *
 * ── Was hier NICHT steht ────────────────────────────────────────────────────
 * ★★★★★ **Kein Wort über die Zahlen.** Kein „leider", kein „nur", kein „schon
 * wieder" - und auch kein beruhigendes „das zählt nicht gegen dich"
 * ([[feedback_nie_gegen_das_kind]]). Die Zahlen stehen da, das Kind liest sie.
 * Wer sie einordnet, ist die Lehrkraft, und die sitzt im selben Raum.
 *
 * ★★★★★ **UND KEIN RANG** (10.09.2026). Der eigene Leistungswert steht hier,
 * der Platz in der Klasse nicht. Ein Kind kennt die Ergebnisse der anderen
 * nicht und soll sie nicht kennen; „93 % vom Besten" wäre eine Aussage über
 * ein Kind, die es nicht selbst nachprüfen kann. Das Rangprozent gehört in den
 * Lehrbereich - so steht es auch in der Recherche
 * (`RECHERCHE-2026-09-10-TASTSCHREIB-WERTUNG.md` §4.6).
 *
 * ── Die Markierung ist WEG ──────────────────────────────────────────────────
 * Johannes: *„nach ablauf der zeit werden die farben wieder normal und das wort
 * ‚Prüfung' verschwindet."* Diese Karte trägt darum weder den abgesetzten
 * Rahmen noch das Wort als MARKIERUNG - sie ist eine gewöhnliche Karte. Im
 * Titel steht {@link PRUEFUNG_WORT} trotzdem, denn ohne es wüsste niemand,
 * wovon die Zahlen handeln; das ist eine Überschrift, kein Zustandsschild.
 *
 * ── Warum die Überschrift `h2` ist ──────────────────────────────────────────
 * Im Ablauf steht sie direkt unter der Seitenüberschrift, dort ist `h2` richtig.
 * In der Statistik sitzt sie unter deren eigener `h2` und liest sich als neuer
 * Abschnitt - jedes Ergebnis ist ein für sich abgeschlossener Block. Eine feste
 * Stufe ist an einer der beiden Stellen ein Kompromiss; ein Prop dafür wäre eine
 * zweite Vokabel für dieselbe Sache und stand nicht im Auftrag.
 */
import {
  MIND_ZEICHEN_WERTUNG,
  fehlerGewicht,
  hinweiseChallenge,
  mmss,
  niveauDef,
  niveauTexte,
  pruefungWort,
  stelleBezeichnung,
  tastenName,
  wertungVon,
  type FehlerStelle,
  type Probenergebnis,
} from "@/lib/typing";
import { dezimal, mehrzahl, texte, useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";
import { Erklaert } from "./Erklaert";
import { KennzahlKachel } from "./Kennzahl";
// ★ E1 (24.09.2026): das Niveau im Weg, aus dem die Challenge stammt.
import { lernwegVon } from "@/lib/typing/lernweg";

/**
 * ★★ DIE TEXTE DER ERGEBNIS-KARTE in beiden Bedienungssprachen (EN5,
 * 19.09.2026). Deutsch wortgleich wie vorher - wo das JSX mehrere Textknoten
 * erzeugte, stehen die Sätze in TEILEN (`Teil[]`), damit die deutsche Karte
 * Knoten für Knoten gleich bleibt.
 *
 * Englisch nach dem Glossar: Die Karte zeigt nur die Challenge, darum heisst
 * der Leistungswert hier schlicht *Score* (§3.2); Fehler ⇒ *Mistakes*,
 * wacklige Tasten ⇒ *Wobbly keys*, abgeben ⇒ *hand in*. Kein Wort über die
 * Zahlen - auch englisch nicht (Dateikopf).
 */
const ERGEBNIS_TEXTE = texte({
  de: {
    titel: (wort: string) => ["Deine ", wort],
    anschlaege: "Anschläge je Minute",
    treffsicherheit: "Treffsicherheit",
    leistungswert: "Leistungswert",
    gewertet: (gewicht: number) => [
      "Der Leistungswert fasst Treffsicherheit und Tempo in einer Zahl zusammen. Die Treffsicherheit wiegt dabei schwerer: Ein Fehlgriff zählt so viel wie ",
      gewicht,
      " Zeichen.",
    ],
    zuKurz: (mind: number) => [
      "Für eine Wertung war es zu kurz. Einen Leistungswert gibt es ab",
      " ",
      mind,
      " geschriebenen Zeichen.",
    ],
    zeichen: "Geschriebene Zeichen",
    fehler: "Fehler",
    // ★ 23.09.2026 („Freies Schreiben", E6): im freien Modus heisst „Fehler"
    // „Stehengebliebene Fehler" - siehe `istFreiesSchreiben`/`FEHLER_GEWICHT_FREI`
    // in `schreibprobeWertung.ts` und Bauplan §7.
    fehlerFrei: "Stehengebliebene Fehler",
    korrekturen: "Korrekturen (Rücktaste)",
    fehlerarten: "Fehlerarten",
    fehlerstellenAnsehen: (n: number) => `Fehlerstellen ansehen (${n})`,
    zeilen: "Zeilen",
    schreibzeit: "Schreibzeit",
    vorlesezeit: "Abgezogene Vorlesezeit",
    zuschlag: "Zeitzuschlag",
    prozent: (n: number) => `${n} %`,
    textZuEnde: "Du hast den ganzen Text geschrieben.",
    frueher: "Du hast selbst abgegeben.",
    wacklig: "Wacklige Tasten",
    richtig: (richtige: number, dran: number) => [richtige, " von ", dran, " richtig"],
    keineWacklig: "Keine einzelne Taste ist aufgefallen.",
    weiter: "Weiter üben",
    escape: "Escape bringt dich auch zurück zum Üben.",
  },
  en: {
    titel: (wort: string) => ["Your ", wort],
    anschlaege: "Keystrokes per minute",
    treffsicherheit: "Accuracy",
    leistungswert: "Score",
    gewertet: (gewicht: number) => [
      "Your score combines accuracy and speed in a single number. Accuracy counts for more: a wrong key counts as much as ",
      gewicht,
      " characters.",
    ],
    zuKurz: (mind: number) => [
      "That was too short to score. A score needs at least ",
      mind,
      " characters typed.",
    ],
    zeichen: "Characters typed",
    fehler: "Mistakes",
    fehlerFrei: "Mistakes left",
    korrekturen: "Corrections (Backspace)",
    fehlerarten: "Kinds of mistake",
    fehlerstellenAnsehen: (n: number) => `Show the mistakes (${n})`,
    zeilen: "Lines",
    schreibzeit: "Typing time",
    vorlesezeit: "Read-aloud time taken off",
    zuschlag: "Extra time",
    prozent: (n: number) => `${n}%`,
    textZuEnde: "You typed the whole text.",
    frueher: "You handed it in yourself.",
    wacklig: "Wobbly keys",
    richtig: (richtige: number, dran: number) => [richtige, " of ", dran, " correct"],
    keineWacklig: "No single key stood out.",
    weiter: "Keep practising",
    escape: "Escape also takes you back to practice.",
  },
  fr: {
    titel: (wort: string) => ["Ton ", wort],
    anschlaege: "Frappes par minute",
    treffsicherheit: "Précision",
    leistungswert: "Score",
    gewertet: (gewicht: number) => [
      "Le score réunit précision et vitesse en un seul nombre. La précision pèse plus lourd : une erreur de frappe compte comme ",
      gewicht,
      " caractères.",
    ],
    zuKurz: (mind: number) => [
      "C'était trop court pour un score. Un score demande au moins",
      " ",
      mind,
      " caractères tapés.",
    ],
    zeichen: "Caractères tapés",
    fehler: "Erreurs",
    fehlerFrei: "Erreurs restantes",
    korrekturen: "Corrections (Retour arrière)",
    fehlerarten: "Types d'erreurs",
    fehlerstellenAnsehen: (n: number) => `Voir les erreurs (${n})`,
    zeilen: "Lignes",
    schreibzeit: "Temps de frappe",
    vorlesezeit: "Temps de lecture à voix haute déduit",
    zuschlag: "Temps supplémentaire",
    prozent: (n: number) => `${n} %`,
    textZuEnde: "Tu as tapé tout le texte.",
    frueher: "Tu as rendu avant la fin du temps.",
    wacklig: "Touches instables",
    richtig: (richtige: number, dran: number) => [richtige, " sur ", dran, " correctes"],
    keineWacklig: "Aucune touche particulière ne s'est démarquée.",
    weiter: "Continuer à s'exercer",
    escape: "Échap te ramène aussi à l'exercice.",
  },
  // ★ ES-O (27.09.2026): tú (das Kind liest sein Ergebnis).
  es: {
    titel: (wort: string) => ["Tu ", wort],
    anschlaege: "Pulsaciones por minuto",
    treffsicherheit: "Precisión",
    leistungswert: "Puntuación",
    gewertet: (gewicht: number) => [
      "La puntuación combina precisión y velocidad en un solo número. La precisión pesa más: un error cuenta como ",
      gewicht,
      " caracteres.",
    ],
    zuKurz: (mind: number) => [
      "Fue demasiado corto para una puntuación. Una puntuación necesita al menos",
      " ",
      mind,
      " caracteres escritos.",
    ],
    zeichen: "Caracteres escritos",
    fehler: "Errores",
    fehlerFrei: "Errores que quedan",
    korrekturen: "Correcciones (Retroceso)",
    fehlerarten: "Tipos de errores",
    fehlerstellenAnsehen: (n: number) => `Ver los errores (${n})`,
    zeilen: "Líneas",
    schreibzeit: "Tiempo de escritura",
    vorlesezeit: "Tiempo de lectura en voz alta descontado",
    zuschlag: "Tiempo extra",
    prozent: (n: number) => `${n} %`,
    textZuEnde: "Has escrito todo el texto.",
    frueher: "Entregaste antes de que se acabara el tiempo.",
    wacklig: "Teclas inseguras",
    richtig: (richtige: number, dran: number) => [richtige, " de ", dran, " correctas"],
    keineWacklig: "No destacó ninguna tecla en especial.",
    weiter: "Seguir practicando",
    escape: "Esc también te lleva de vuelta a practicar.",
  },
  // ★ O-IT (02.10.2026): „la tua Sfida" (weiblich), „battute al minuto", „95%" (Glossar Regel 5/6).
  it: {
    titel: (wort: string) => ["La tua ", wort],
    anschlaege: "Battute al minuto",
    treffsicherheit: "Precisione",
    leistungswert: "Punteggio",
    gewertet: (gewicht: number) => [
      "Il punteggio unisce precisione e velocità in un solo numero. La precisione pesa di più: un errore conta come ",
      gewicht,
      " caratteri.",
    ],
    zuKurz: (mind: number) => [
      "Era troppo breve per un punteggio. Per un punteggio servono almeno",
      " ",
      mind,
      " caratteri scritti.",
    ],
    zeichen: "Caratteri scritti",
    fehler: "Errori",
    fehlerFrei: "Errori rimasti",
    korrekturen: "Correzioni (Backspace)",
    fehlerarten: "Tipi di errore",
    fehlerstellenAnsehen: (n: number) => `Guarda gli errori (${n})`,
    zeilen: "Righe",
    schreibzeit: "Tempo di scrittura",
    vorlesezeit: "Tempo di lettura ad alta voce tolto",
    zuschlag: "Tempo in più",
    prozent: (n: number) => `${n}%`,
    textZuEnde: "Hai scritto tutto il testo.",
    frueher: "Hai consegnato prima della fine del tempo.",
    wacklig: "Tasti incerti",
    richtig: (richtige: number, dran: number) => [richtige, " di ", dran, " giuste"],
    keineWacklig: "Nessun tasto si è notato in modo particolare.",
    weiter: "Continua a esercitarti",
    escape: "Anche Esc ti riporta all'esercizio.",
  },
  // ★ O-PL (02.10.2026): „Twoje Wyzwanie", „Uderzenia na minutę", „95%";
  // ohne Vergangenheit der 2. Person („Udało ci się…", „Oddane…"), Zahl +
  // Hauptwort über `mehrzahl` (Glossar §2.2, §2.3, §2.10a).
  pl: {
    titel: (wort: string) => ["Twoje ", wort],
    anschlaege: "Uderzenia na minutę",
    treffsicherheit: "Dokładność",
    leistungswert: "Wynik",
    gewertet: (gewicht: number) => [
      "Wynik łączy dokładność i tempo w jednej liczbie. Dokładność waży więcej: jedna pomyłka liczy się jak ",
      gewicht,
      mehrzahl(gewicht, "pl", { one: () => " znak.", few: () => " znaki.", many: () => " znaków.", other: () => " znaku." }),
    ],
    zuKurz: (mind: number) => [
      "To było za krótkie, żeby obliczyć wynik. Wynik jest od",
      " ",
      mind,
      mehrzahl(mind, "pl", {
        one: () => " napisanego znaku.",
        few: () => " napisanych znaków.",
        many: () => " napisanych znaków.",
        other: () => " napisanego znaku.",
      }),
    ],
    zeichen: "Napisane znaki",
    fehler: "Błędy",
    fehlerFrei: "Pozostawione błędy",
    korrekturen: "Poprawki (Backspace)",
    fehlerarten: "Rodzaje błędów",
    fehlerstellenAnsehen: (n: number) => `Pokaż błędy (${n})`,
    zeilen: "Wiersze",
    schreibzeit: "Czas pisania",
    vorlesezeit: "Odjęty czas czytania na głos",
    zuschlag: "Dodatkowy czas",
    prozent: (n: number) => `${n}%`,
    textZuEnde: "Udało ci się napisać cały tekst.",
    frueher: "Oddane przed końcem czasu.",
    wacklig: "Niepewne klawisze",
    richtig: (richtige: number, dran: number) => [richtige, " z ", dran, " poprawnie"],
    keineWacklig: "Żaden klawisz się nie wyróżnił.",
    weiter: "Ćwicz dalej",
    escape: "Klawisz Esc też przenosi cię z powrotem do ćwiczeń.",
  },
  // ★ O-TR (02.10.2026): sen; "Yarışma puanı", "Dakikada vuruş", "%95",
  // "7 doğru, toplam 12"; keine Endung an Zahl oder `wort` (Glossar §1, §2.2).
  tr: {
    titel: (wort: string) => [wort, " sonucun"],
    anschlaege: "Dakikada vuruş",
    treffsicherheit: "Doğruluk",
    leistungswert: "Yarışma puanı",
    gewertet: (gewicht: number) => [
      "Yarışma puanı doğruluğu ve hızı tek bir sayıda birleştirir. Doğruluk daha ağır basar: bir yanlış tuş ",
      gewicht,
      " karakter kadar sayılır.",
    ],
    zuKurz: (mind: number) => [
      "Puan hesaplamak için çok kısaydı. Yarışma puanı en az",
      " ",
      mind,
      " karakter yazınca verilir.",
    ],
    zeichen: "Yazılan karakterler",
    fehler: "Hatalar",
    fehlerFrei: "Kalan yanlışlar",
    korrekturen: "Düzeltmeler (Backspace)",
    fehlerarten: "Hata türleri",
    fehlerstellenAnsehen: (n: number) => `Hataları göster (${n})`,
    zeilen: "Satırlar",
    schreibzeit: "Yazma süresi",
    vorlesezeit: "Düşülen sesli okuma süresi",
    zuschlag: "Ek süre",
    prozent: (n: number) => `%${n}`,
    textZuEnde: "Metnin tamamını yazdın.",
    frueher: "Kendin teslim ettin.",
    wacklig: "Henüz oturmamış tuşlar",
    richtig: (richtige: number, dran: number) => [richtige, " doğru, toplam ", dran],
    keineWacklig: "Hiçbir tuş ayrıca göze çarpmadı.",
    weiter: "Çalışmaya devam et",
    escape: "Esc tuşu da seni alıştırmaya geri götürür.",
  },
  // ★ O-CS (03.10.2026): ty, ohne Vergangenheit der 2. Person („Povedlo se ti napsat",
  // „Odevzdáno před koncem"); „Skóre", „Úhozy za minutu", „95 %" mit geschütztem
  // Leerzeichen, „správně: 7/12"; Zahl + Hauptwort über `mehrzahl` (Glossar
  // §2.2, §2.3, §2.11).
  cs: {
    titel: (wort: string) => ["Tvoje ", wort],
    anschlaege: "Úhozy za minutu",
    treffsicherheit: "Přesnost",
    leistungswert: "Skóre",
    gewertet: (gewicht: number) => [
      "Skóre spojuje přesnost a rychlost do jednoho čísla. Přesnost přitom váží víc: jeden překlep se počítá jako ",
      gewicht,
      mehrzahl(gewicht, "cs", { one: () => " znak.", few: () => " znaky.", many: () => " znaku.", other: () => " znaků." }),
    ],
    zuKurz: (mind: number) => [
      "Na hodnocení to bylo moc krátké. Skóre se počítá od",
      " ",
      mind,
      mehrzahl(mind, "cs", {
        one: () => " napsaného znaku.",
        few: () => " napsaných znaků.",
        many: () => " napsaného znaku.",
        other: () => " napsaných znaků.",
      }),
    ],
    zeichen: "Napsané znaky",
    fehler: "Překlepy",
    fehlerFrei: "Ponechané chyby",
    korrekturen: "Opravy (Backspace)",
    fehlerarten: "Druhy chyb",
    fehlerstellenAnsehen: (n: number) => `Zobrazit chyby (${n})`,
    zeilen: "Řádky",
    schreibzeit: "Čas psaní",
    vorlesezeit: "Odečtený čas předčítání",
    zuschlag: "Prodloužení času",
    prozent: (n: number) => `${n}\u00A0%`,
    textZuEnde: "Povedlo se ti napsat celý text.",
    frueher: "Odevzdáno před koncem času.",
    wacklig: "Nejisté klávesy",
    richtig: (richtige: number, dran: number) => ["správně: ", richtige, "/", dran],
    keineWacklig: "Žádná klávesa zvlášť nevybočila.",
    weiter: "Cvičit dál",
    escape: "Klávesou Esc se taky vrátíš ke cvičení.",
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      titel: (wort: string) => ["Твоето ", wort],
      anschlaege: "Знаци в минута",
      treffsicherheit: "Точност",
      leistungswert: "Резултат",
      gewertet: (gewicht: number) => [
        "Резултатът събира точността и скоростта в едно число. Точността тежи повече: един погрешен клавиш струва колкото ",
        gewicht,
        " знака.",
      ],
      zuKurz: (mind: number) => [
        "Беше твърде кратко за резултат. Резултат се изчислява при поне ",
        mind,
        " написани знака.",
      ],
      zeichen: "Написани знаци",
      fehler: "Грешки",
      fehlerFrei: "Останали грешки",
      korrekturen: "Поправки (Backspace)",
      fehlerarten: "Видове грешки",
      fehlerstellenAnsehen: (n: number) => `Покажи грешките (${n})`,
      zeilen: "Редове",
      schreibzeit: "Време за писане",
      vorlesezeit: "Извадено време за четене на глас",
      zuschlag: "Допълнително време",
      prozent: (n: number) => `${n}%`,
      textZuEnde: "Написа целия текст.",
      // „Предаде сам" wäre männlich - darum ohne „сам".
      frueher: "Предаде преди края на времето.",
      wacklig: "Несигурни клавиши",
      richtig: (richtige: number, dran: number) => [richtige, " от ", dran, " верни"],
      keineWacklig: "Нито един клавиш не се открои.",
      weiter: "Упражнявай се още",
      escape: "Esc също те връща към упражненията.",
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      // nicht „Η ${wort} σου": „Πρόκληση" + „σου" braucht einen zweiten Akzent (Πρόκλησή σου).
      titel: (wort: string) => ["Αποτέλεσμα: ", wort],
      anschlaege: "Πατήματα ανά λεπτό",
      treffsicherheit: "Ακρίβεια",
      leistungswert: "Σκορ",
      gewertet: (gewicht: number) => [
        "Το σκορ συνδυάζει την ακρίβεια και την ταχύτητα σε έναν αριθμό. Η ακρίβεια μετράει περισσότερο: ένα λάθος πλήκτρο μετράει όσο ",
        gewicht,
        " χαρακτήρες.",
      ],
      zuKurz: (mind: number) => [
        "Ήταν πολύ σύντομο για σκορ. Για σκορ χρειάζονται τουλάχιστον ",
        mind,
        " γραμμένοι χαρακτήρες.",
      ],
      zeichen: "Γραμμένοι χαρακτήρες",
      fehler: "Λάθη",
      fehlerFrei: "Λάθη που έμειναν",
      korrekturen: "Διορθώσεις (Backspace)",
      fehlerarten: "Είδη λαθών",
      fehlerstellenAnsehen: (n: number) => `Εμφάνιση των λαθών (${n})`,
      zeilen: "Γραμμές",
      schreibzeit: "Χρόνος γραφής",
      vorlesezeit: "Χρόνος εκφώνησης που αφαιρέθηκε",
      zuschlag: "Επιπλέον χρόνος",
      prozent: (n: number) => `${n}%`,
      textZuEnde: "Έγραψες όλο το κείμενο.",
      frueher: "Την παρέδωσες εσύ.",
      wacklig: "Αβέβαια πλήκτρα",
      richtig: (richtige: number, dran: number) => [richtige, " από ", dran, " σωστά"],
      keineWacklig: "Κανένα πλήκτρο δεν ξεχώρισε.",
      weiter: "Συνέχεια εξάσκησης",
      escape: "Και με το Esc επιστρέφεις στην εξάσκηση.",
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      titel: (wort: string) => [wort, ": az eredményed"],
      anschlaege: "Leütés percenként",
      treffsicherheit: "Pontosság",
      leistungswert: "Pontszám",
      gewertet: (gewicht: number) => [
        "A pontszám egyetlen számban foglalja össze a pontosságot és a sebességet. A pontosság többet számít: egy elütés annyit számít, mint ",
        gewicht,
        " karakter.",
      ],
      zuKurz: (mind: number) => [
        "Ez túl rövid volt az értékeléshez. Pontszám legalább ",
        mind,
        " beírt karaktertől jár.",
      ],
      zeichen: "Beírt karakterek",
      fehler: "Hibák",
      fehlerFrei: "Bent maradt hibák",
      korrekturen: "Javítások (Backspace)",
      fehlerarten: "Hibafajták",
      fehlerstellenAnsehen: (n: number) => `Hibák megtekintése (${n})`,
      zeilen: "Sorok",
      schreibzeit: "Gépelési idő",
      vorlesezeit: "Levont felolvasási idő",
      zuschlag: "Időpótlék",
      prozent: (n: number) => `${n}%`,
      textZuEnde: "Az egész szöveget begépelted.",
      frueher: "Magad adtad be.",
      wacklig: "Bizonytalan billentyűk",
      richtig: (richtige: number, dran: number) => [richtige, "/", dran, " helyes"],
      keineWacklig: "Egyik billentyű sem tűnt ki.",
      weiter: "Gyakorlás tovább",
      escape: "Az Esc billentyű is visszavisz a gyakorláshoz.",
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      titel: (wort: string) => ["Jouw ", wort],
      anschlaege: "Aanslagen per minuut",
      treffsicherheit: "Nauwkeurigheid",
      leistungswert: "Score",
      gewertet: (gewicht: number) => [
        "De score vat nauwkeurigheid en snelheid samen in één getal. Nauwkeurigheid weegt daarbij zwaarder: een verkeerde toets telt even zwaar als ",
        gewicht,
        " tekens.",
      ],
      zuKurz: (mind: number) => [
        "Dat was te kort voor een score. Een score krijg je vanaf ",
        mind,
        " getypte tekens.",
      ],
      zeichen: "Getypte tekens",
      fehler: "Fouten",
      fehlerFrei: "Fouten die bleven staan",
      korrekturen: "Verbeteringen (Backspace)",
      fehlerarten: "Soorten fouten",
      fehlerstellenAnsehen: (n: number) => `Fouten bekijken (${n})`,
      zeilen: "Regels",
      schreibzeit: "Typtijd",
      vorlesezeit: "Afgetrokken voorleestijd",
      zuschlag: "Extra tijd",
      prozent: (n: number) => `${n}%`,
      textZuEnde: "Je hebt de hele tekst getypt.",
      frueher: "Je hebt zelf ingeleverd.",
      wacklig: "Onzekere toetsen",
      richtig: (richtige: number, dran: number) => [richtige, " van ", dran, " goed"],
      keineWacklig: "Er viel geen enkele toets op.",
      weiter: "Verder oefenen",
      escape: "Ook met Escape ga je terug naar het oefenen.",
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      titel: (wort: string) => ["O teu ", wort],
      anschlaege: "Toques por minuto",
      treffsicherheit: "Precisão",
      leistungswert: "Pontuação",
      gewertet: (gewicht: number) => [
        "A pontuação junta a precisão e a velocidade num só número. A precisão pesa mais: uma tecla errada conta tanto como ",
        gewicht,
        " carateres.",
      ],
      zuKurz: (mind: number) => [
        "Foi demasiado curto para dar pontuação. A pontuação só existe a partir de ",
        mind,
        " carateres escritos.",
      ],
      zeichen: "Carateres escritos",
      fehler: "Erros",
      fehlerFrei: "Erros que ficaram",
      korrekturen: "Correções (tecla de retrocesso)",
      fehlerarten: "Tipos de erro",
      fehlerstellenAnsehen: (n: number) => `Ver os erros (${n})`,
      zeilen: "Linhas",
      schreibzeit: "Tempo de escrita",
      vorlesezeit: "Tempo de leitura em voz alta descontado",
      zuschlag: "Tempo extra",
      prozent: (n: number) => `${n}%`,
      textZuEnde: "Escreveste o texto todo.",
      frueher: "Entregaste antes do fim do tempo.",
      wacklig: "Teclas em consolidação",
      richtig: (richtige: number, dran: number) => [richtige, " de ", dran, " certas"],
      keineWacklig: "Nenhuma tecla se destacou.",
      weiter: "Continuar a praticar",
      escape: "Esc também te leva de volta à prática.",
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      // „Desafio" ist männlich: „Seu Desafio".
      titel: (wort: string) => ["Seu ", wort],
      anschlaege: "Toques por minuto",
      treffsicherheit: "Precisão",
      leistungswert: "Pontuação",
      gewertet: (gewicht: number) => [
        "A pontuação junta precisão e velocidade em um só número. A precisão pesa mais: uma tecla errada vale tanto quanto ",
        gewicht,
        " caracteres.",
      ],
      zuKurz: (mind: number) => [
        "Foi curto demais para receber pontuação. A pontuação começa a partir de ",
        mind,
        " caracteres digitados.",
      ],
      zeichen: "Caracteres digitados",
      fehler: "Erros",
      fehlerFrei: "Erros que ficaram",
      korrekturen: "Correções (Backspace)",
      fehlerarten: "Tipos de erro",
      fehlerstellenAnsehen: (n: number) => `Ver os erros (${n})`,
      zeilen: "Linhas",
      schreibzeit: "Tempo de digitação",
      vorlesezeit: "Tempo de leitura em voz alta descontado",
      zuschlag: "Tempo extra",
      prozent: (n: number) => `${n}%`,
      textZuEnde: "Você digitou o texto inteiro.",
      frueher: "Você entregou antes do fim do tempo.",
      wacklig: "Teclas inseguras",
      richtig: (richtige: number, dran: number) => [richtige, " de ", dran, " certas"],
      keineWacklig: "Nenhuma tecla chamou atenção.",
      weiter: "Continuar praticando",
      escape: "Esc também leva você de volta à prática.",
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      // Das Wort der Tippchallenge steht nach Doppelpunkt (Name, ungebeugt - Glossar Regel 12).
      titel: (wort: string) => ["Rezultatul tău: ", wort],
      anschlaege: "Caractere pe minut",
      treffsicherheit: "Precizie",
      leistungswert: "Scor",
      gewertet: (gewicht: number) => [
        "Scorul reunește precizia și viteza într-un singur număr. Precizia contează mai mult: o tastă greșită contează cât ",
        mehrzahl(gewicht, "ro", {
          one: () => "un caracter.",
          few: (z) => `${z} caractere.`,
          other: (z) => `${z} de caractere.`,
        }),
      ],
      zuKurz: (mind: number) => [
        "A fost prea scurt pentru un scor. Un scor are nevoie de cel puțin ",
        mehrzahl(mind, "ro", {
          one: () => "un caracter scris.",
          few: (z) => `${z} caractere scrise.`,
          other: (z) => `${z} de caractere scrise.`,
        }),
      ],
      zeichen: "Caractere scrise",
      fehler: "Greșeli",
      fehlerFrei: "Greșeli rămase",
      korrekturen: "Corecturi (Backspace)",
      fehlerarten: "Tipuri de greșeli",
      fehlerstellenAnsehen: (n: number) => `Vezi greșelile (${n})`,
      zeilen: "Rânduri",
      schreibzeit: "Timp de scriere",
      vorlesezeit: "Timp de citire scăzut",
      zuschlag: "Timp suplimentar",
      prozent: (n: number) => `${n} %`,
      textZuEnde: "Ai scris tot textul.",
      frueher: "Ai predat înainte de final.",
      wacklig: "Taste nesigure",
      richtig: (richtige: number, dran: number) => [richtige, " din ", dran, " corecte"],
      keineWacklig: "Nicio tastă nu a ieșit în evidență.",
      weiter: "Exersați în continuare",
      escape: "Și tasta Esc te duce înapoi la exersare.",
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      titel: (wort: string) => ["Din ", wort],
      anschlaege: "Anslag per minut",
      treffsicherheit: "Träffsäkerhet",
      leistungswert: "Poäng",
      gewertet: (gewicht: number) => [
        "Poängen väger samman träffsäkerhet och hastighet i ett enda tal. Träffsäkerheten väger tyngre: ett felslag räknas lika mycket som ",
        gewicht,
        " tecken.",
      ],
      zuKurz: (mind: number) => [
        "Det var för kort för att ge poäng. Poäng får du från ",
        mind,
        " skrivna tecken.",
      ],
      zeichen: "Skrivna tecken",
      fehler: "Fel",
      fehlerFrei: "Fel som står kvar",
      korrekturen: "Rättningar (Backsteg)",
      fehlerarten: "Typer av fel",
      fehlerstellenAnsehen: (n: number) => `Visa felen (${n})`,
      zeilen: "Rader",
      schreibzeit: "Skrivtid",
      vorlesezeit: "Uppläsningstid som dragits av",
      zuschlag: "Extra tid",
      prozent: (n: number) => `${n} %`,
      textZuEnde: "Du skrev hela texten.",
      frueher: "Du lämnade in själv.",
      wacklig: "Osäkra tangenter",
      richtig: (richtige: number, dran: number) => [richtige, " av ", dran, " rätt"],
      keineWacklig: "Ingen enskild tangent stack ut.",
      weiter: "Öva vidare",
      escape: "Escape tar dig också tillbaka till övningen.",
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      titel: (wort: string) => ["Твій ", wort],
      anschlaege: "Знаків за хвилину",
      treffsicherheit: "Точність",
      leistungswert: "Бали Виклику",
      gewertet: (gewicht: number) => [
        "Бали Виклику поєднують точність і швидкість в одному числі. Точність важить більше: одне хибне натискання важить стільки, скільки ",
        gewicht,
        " знаків.",
      ],
      zuKurz: (mind: number) => [
        "Цього разу знаків було замало для оцінювання. Найменша кількість надрукованих знаків для балів Виклику: ",
        mind,
        " - зараз бали не виставлено.",
      ],
      zeichen: "Надруковані знаки",
      fehler: "Помилки",
      fehlerFrei: "Залишені помилки",
      korrekturen: "Виправлення (Backspace)",
      fehlerarten: "Види помилок",
      fehlerstellenAnsehen: (n: number) => `Показати помилки (${n})`,
      zeilen: "Рядки",
      schreibzeit: "Час друку",
      vorlesezeit: "Вирахуваний час читання вголос",
      zuschlag: "Додатковий час",
      prozent: (n: number) => `${n}%`,
      textZuEnde: "Увесь текст надруковано.",
      // Ohne „сам/сама" und ohne Vergangenheit am Kind (Glossar Regel 2).
      frueher: "Здано до кінця часу.",
      wacklig: "Непевні клавіші",
      richtig: (richtige: number, dran: number) => [richtige, " з ", dran, " правильно"],
      keineWacklig: "Жодна окрема клавіша не вирізнилася.",
      weiter: "Тренуватися далі",
      escape: "Esc також повертає до тренування.",
    },
});

/**
 * `wertungVon` steht seit dem 10.09.2026 in `lib/typing/schreibprobenUebersicht.ts`
 * (die Übersicht „3 / 82" braucht sie auch) und wird hier nur weitergereicht:
 * `SchreibprobeKasten` und `SchreibprobenListe` holen sie seit jeher hier.
 */
export { wertungVon };

/**
 * Eine Zahl mit EINER Nachkommastelle und deutschem Komma.
 *
 * Steht hier, weil alle drei Anzeigen der Wertung sie brauchen - diese Karte,
 * die eigene Statistik und die Rangliste im Lehrbereich. Zwei Fassungen
 * derselben Rundung wären genau die Doppelung, an der dieses Projekt schon
 * mehrfach hängen geblieben ist
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 */
export function eineStelle(n: number, sprache: BedienSprache = "de"): string {
  // ★ EN5: Englisch mit Dezimalpunkt („83.4"), Deutsch mit Komma - wie bisher.
  // ★ E11a-5: Französisch mit Komma („83,4", Bauplan §9.1) - als Tabelle, nicht
  // als Ternäre, die „fr" nur zufällig richtig traf.
  return DEZIMAL[sprache](n.toFixed(1));
}

const DEZIMAL: Record<BedienSprache, (punkt: string) => string> = {
  de: (p) => p.replace(".", ","),
  en: (p) => p,
  fr: (p) => p.replace(".", ","),
  // ★ ES-O (27.09.2026) stand hier der Dezimalpunkt für alle (RAE 2010).
  // ★ D1 (28.09.2026, Entscheidung Johannes Nr. 15): nach dem Land der
  // Browsersprache (CLDR) - Mexiko Punkt, Argentinien Komma, ohne Land das
  // Komma (`dezimal`, bedienSprache/texte.ts), wie die Übungszeilen.
  es: (p) => (dezimal("es") === "," ? p.replace(".", ",") : p),
  // ★ O-IT (02.10.2026): Dezimalkomma (Glossar Regel 5).
  it: (p) => p.replace(".", ","),
  // ★ O-PL (02.10.2026): Dezimalkomma (Glossar Regel 5).
  pl: (p) => p.replace(".", ","),
  // ★ O-TR (02.10.2026): Dezimalkomma (Glossar Regel 5, "1.234,5").
  tr: (p) => p.replace(".", ","),
  // ★ O-CS (03.10.2026): Dezimalkomma (Glossar Regel 5, „1 234,5").
  cs: (p) => p.replace(".", ","),
  // ★ O2-COMP (30.10.2026): die neun Sprachen mit eigener Fassung.
  bg: (p) => p.replace(".", ","),
  el: (p) => p.replace(".", ","),
  hu: (p) => p.replace(".", ","),
  nl: (p) => p.replace(".", ","),
  pt: (p) => p.replace(".", ","),
  br: (p) => p.replace(".", ","),
  ro: (p) => p.replace(".", ","),
  sv: (p) => p.replace(".", ","),
  uk: (p) => p.replace(".", ","),
};

/**
 * ★★★ 23.09.2026 („Freies Schreiben", E6) - „X Wörter falsch, Y fehlt, …":
 * die Fehlerarten des freien Modus (`Probenergebnis.fehlerArten`) als EIN
 * Satz, nur die Arten, die wirklich vorkommen. Feste Reihenfolge
 * falsch/fehlend/ueberzaehlig/leerzeichen - dieselbe wie in `freiVergleich.ts`
 * dokumentiert -, damit der Satz bei gleichem Befund immer gleich klingt.
 *
 * ⚠️ Sachlich, ohne Wertung ([[feedback_nie_gegen_das_kind]]): Die Sätze
 * zählen nur, was ist, ohne „leider" oder „nur".
 */
const FEHLER_ART_REIHENFOLGE = ["falsch", "fehlend", "ueberzaehlig", "leerzeichen"] as const;

type Formen = {
  one: (z: string) => string;
  // ★ O-PL (02.10.2026): Polnisch braucht vier Formen (Glossar §2.10a).
  few?: (z: string) => string;
  many?: (z: string) => string;
  other: (z: string) => string;
};

/**
 * ★ E11a-5 (26.09.2026, Falle 30): die Formen je Sprache als TABELLE - vorher
 * `sprache === "en" ? … : Deutsch` in jeder Form, für „fr" also still
 * „2 Wörter falsch". Französisch: „2 mots faux, 1 mot manquant, 1 mot en
 * trop, 1 espace" (die Espace ist typografisch weiblich, mit Zahl ohne Artikel).
 */
const FEHLER_ART_FORMEN: Record<BedienSprache, Record<(typeof FEHLER_ART_REIHENFOLGE)[number], Formen>> = {
  de: {
    falsch: { one: (z) => `${z} Wort falsch`, other: (z) => `${z} Wörter falsch` },
    fehlend: { one: (z) => `${z} fehlt`, other: (z) => `${z} fehlen` },
    ueberzaehlig: { one: (z) => `${z} zu viel`, other: (z) => `${z} zu viel` },
    leerzeichen: { one: (z) => `${z} Leerzeichen`, other: (z) => `${z} Leerzeichen` },
  },
  en: {
    falsch: { one: (z) => `${z} word wrong`, other: (z) => `${z} words wrong` },
    fehlend: { one: (z) => `${z} missing`, other: (z) => `${z} missing` },
    ueberzaehlig: { one: (z) => `${z} extra`, other: (z) => `${z} extra` },
    leerzeichen: { one: (z) => `${z} space`, other: (z) => `${z} spaces` },
  },
  fr: {
    falsch: { one: (z) => `${z} mot faux`, other: (z) => `${z} mots faux` },
    fehlend: { one: (z) => `${z} mot manquant`, other: (z) => `${z} mots manquants` },
    ueberzaehlig: { one: (z) => `${z} mot en trop`, other: (z) => `${z} mots en trop` },
    leerzeichen: { one: (z) => `${z} espace`, other: (z) => `${z} espaces` },
  },
  // ★ ES-O (27.09.2026): „2 palabras mal escritas, 1 palabra que falta …".
  es: {
    falsch: { one: (z) => `${z} palabra mal escrita`, other: (z) => `${z} palabras mal escritas` },
    fehlend: { one: (z) => `${z} palabra que falta`, other: (z) => `${z} palabras que faltan` },
    ueberzaehlig: { one: (z) => `${z} palabra de más`, other: (z) => `${z} palabras de más` },
    leerzeichen: { one: (z) => `${z} espacio`, other: (z) => `${z} espacios` },
  },
  // ★ O-IT (02.10.2026): „2 parole sbagliate, 1 parola mancante, 1 parola in più, 1 spazio".
  it: {
    falsch: { one: (z) => `${z} parola sbagliata`, other: (z) => `${z} parole sbagliate` },
    fehlend: { one: (z) => `${z} parola mancante`, other: (z) => `${z} parole mancanti` },
    ueberzaehlig: { one: (z) => `${z} parola in più`, other: (z) => `${z} parole in più` },
    leerzeichen: { one: (z) => `${z} spazio`, other: (z) => `${z} spazi` },
  },
  // ★ O-PL (02.10.2026): „2 błędne słowa, 1 brakujące słowo, 5 dodatkowych słów, 1 spacja".
  pl: {
    falsch: {
      one: (z) => `${z} błędne słowo`,
      few: (z) => `${z} błędne słowa`,
      many: (z) => `${z} błędnych słów`,
      other: (z) => `${z} błędnego słowa`,
    },
    fehlend: {
      one: (z) => `${z} brakujące słowo`,
      few: (z) => `${z} brakujące słowa`,
      many: (z) => `${z} brakujących słów`,
      other: (z) => `${z} brakującego słowa`,
    },
    ueberzaehlig: {
      one: (z) => `${z} dodatkowe słowo`,
      few: (z) => `${z} dodatkowe słowa`,
      many: (z) => `${z} dodatkowych słów`,
      other: (z) => `${z} dodatkowego słowa`,
    },
    leerzeichen: {
      one: (z) => `${z} spacja`,
      few: (z) => `${z} spacje`,
      many: (z) => `${z} spacji`,
      other: (z) => `${z} spacji`,
    },
  },
  // ★ O-TR (02.10.2026): nach der Zahl die Einzahl, one = other (Glossar
  // Regel 5): "2 yanlış kelime, 1 eksik kelime, 1 boşluk hatası".
  tr: {
    falsch: { one: (z) => `${z} yanlış kelime`, other: (z) => `${z} yanlış kelime` },
    fehlend: { one: (z) => `${z} eksik kelime`, other: (z) => `${z} eksik kelime` },
    ueberzaehlig: { one: (z) => `${z} fazla kelime`, other: (z) => `${z} fazla kelime` },
    leerzeichen: { one: (z) => `${z} boşluk hatası`, other: (z) => `${z} boşluk hatası` },
  },
  // ★ O-CS (03.10.2026): alle vier Formen (Glossar §2.11): „2 chybná slova,
  // 1 chybějící slovo, 5 přebývajících slov, 1 mezera".
  cs: {
    falsch: {
      one: (z) => `${z} chybné slovo`,
      few: (z) => `${z} chybná slova`,
      many: (z) => `${z} chybného slova`,
      other: (z) => `${z} chybných slov`,
    },
    fehlend: {
      one: (z) => `${z} chybějící slovo`,
      few: (z) => `${z} chybějící slova`,
      many: (z) => `${z} chybějícího slova`,
      other: (z) => `${z} chybějících slov`,
    },
    ueberzaehlig: {
      one: (z) => `${z} přebývající slovo`,
      few: (z) => `${z} přebývající slova`,
      many: (z) => `${z} přebývajícího slova`,
      other: (z) => `${z} přebývajících slov`,
    },
    leerzeichen: {
      one: (z) => `${z} mezera`,
      few: (z) => `${z} mezery`,
      many: (z) => `${z} mezery`,
      other: (z) => `${z} mezer`,
    },
  },
  // ★ O2-COMP (30.10.2026): bg eigene Fassung.
  bg: {
      falsch: { one: (z) => `${z} грешна дума`, other: (z) => `${z} грешни думи` },
      fehlend: { one: (z) => `${z} липсваща дума`, other: (z) => `${z} липсващи думи` },
      ueberzaehlig: { one: (z) => `${z} излишна дума`, other: (z) => `${z} излишни думи` },
      // интервал (m.) - Zählform „интервала" (Glossar §2.11).
      leerzeichen: { one: (z) => `${z} интервал`, other: (z) => `${z} интервала` },
    },
  // ★ O2-COMP (30.10.2026): el eigene Fassung.
  el: {
      falsch: { one: (z) => `${z} λανθασμένη λέξη`, other: (z) => `${z} λανθασμένες λέξεις` },
      fehlend: { one: (z) => `${z} λέξη λείπει`, other: (z) => `${z} λέξεις λείπουν` },
      ueberzaehlig: { one: (z) => `${z} λέξη περισσεύει`, other: (z) => `${z} λέξεις περισσεύουν` },
      leerzeichen: { one: (z) => `${z} διάστημα`, other: (z) => `${z} διαστήματα` },
    },
  // ★ O2-COMP (30.10.2026): hu eigene Fassung.
  hu: {
      // Glossar §2.11: nach einer Zahl Einzahl - one und other gleich.
      falsch: { one: (z) => `${z} hibás szó`, other: (z) => `${z} hibás szó` },
      fehlend: { one: (z) => `${z} hiányzó szó`, other: (z) => `${z} hiányzó szó` },
      ueberzaehlig: { one: (z) => `${z} fölösleges szó`, other: (z) => `${z} fölösleges szó` },
      leerzeichen: { one: (z) => `${z} szóköz`, other: (z) => `${z} szóköz` },
    },
  // ★ O2-COMP (30.10.2026): nl eigene Fassung.
  nl: {
      falsch: { one: (z) => `${z} woord fout`, other: (z) => `${z} woorden fout` },
      fehlend: { one: (z) => `${z} ontbreekt`, other: (z) => `${z} ontbreken` },
      ueberzaehlig: { one: (z) => `${z} te veel`, other: (z) => `${z} te veel` },
      leerzeichen: { one: (z) => `${z} spatie`, other: (z) => `${z} spaties` },
    },
  // ★ O2-COMP (30.10.2026): pt eigene Fassung.
  pt: {
      falsch: {
        one: (z) => `${z} palavra errada`,
        other: (z) => `${z} palavras erradas`,
        many: (z) => `${z} de palavras erradas`,
      },
      fehlend: {
        one: (z) => `${z} em falta`,
        other: (z) => `${z} em falta`,
        many: (z) => `${z} em falta`,
      },
      ueberzaehlig: {
        one: (z) => `${z} a mais`,
        other: (z) => `${z} a mais`,
        many: (z) => `${z} a mais`,
      },
      leerzeichen: {
        one: (z) => `${z} espaço`,
        other: (z) => `${z} espaços`,
        many: (z) => `${z} de espaços`,
      },
    },
  // ★ O2-COMP (30.10.2026): br eigene Fassung.
  br: {
      // pt-BR: 0 wäre „one" (Glossar Regel 13) - hier stehen nur Zahlen ab 1.
      falsch: { one: (z) => `${z} palavra errada`, other: (z) => `${z} palavras erradas` },
      fehlend: { one: (z) => `${z} faltando`, other: (z) => `${z} faltando` },
      ueberzaehlig: { one: (z) => `${z} a mais`, other: (z) => `${z} a mais` },
      leerzeichen: { one: (z) => `${z} espaço`, other: (z) => `${z} espaços` },
    },
  // ★ O2-COMP (30.10.2026): ro eigene Fassung.
  ro: {
      falsch: {
        one: (z) => `${z} cuvânt greșit`,
        few: (z) => `${z} cuvinte greșite`,
        other: (z) => `${z} de cuvinte greșite`,
      },
      fehlend: {
        one: (z) => `${z} cuvânt lipsă`,
        few: (z) => `${z} cuvinte lipsă`,
        other: (z) => `${z} de cuvinte lipsă`,
      },
      ueberzaehlig: {
        one: (z) => `${z} cuvânt în plus`,
        few: (z) => `${z} cuvinte în plus`,
        other: (z) => `${z} de cuvinte în plus`,
      },
      leerzeichen: {
        one: (z) => `${z} spațiu`,
        few: (z) => `${z} spații`,
        other: (z) => `${z} de spații`,
      },
    },
  // ★ O2-COMP (30.10.2026): sv eigene Fassung.
  sv: {
      falsch: { one: (z) => `${z} fel ord`, other: (z) => `${z} fel ord` },
      fehlend: { one: (z) => `${z} saknas`, other: (z) => `${z} saknas` },
      ueberzaehlig: { one: (z) => `${z} för mycket`, other: (z) => `${z} för mycket` },
      leerzeichen: { one: (z) => `${z} mellanslag`, other: (z) => `${z} mellanslag` },
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      falsch: {
        one: (z) => `${z} хибне слово`,
        few: (z) => `${z} хибні слова`,
        many: (z) => `${z} хибних слів`,
        other: (z) => `${z} хибного слова`,
      },
      fehlend: {
        one: (z) => `${z} пропущене слово`,
        few: (z) => `${z} пропущені слова`,
        many: (z) => `${z} пропущених слів`,
        other: (z) => `${z} пропущеного слова`,
      },
      ueberzaehlig: {
        one: (z) => `${z} зайве слово`,
        few: (z) => `${z} зайві слова`,
        many: (z) => `${z} зайвих слів`,
        other: (z) => `${z} зайвого слова`,
      },
      leerzeichen: {
        one: (z) => `${z} пробіл`,
        few: (z) => `${z} пробіли`,
        many: (z) => `${z} пробілів`,
        other: (z) => `${z} пробілу`,
      },
    },
};

function fehlerArtStueck(art: string, n: number, sprache: BedienSprache): string {
  const formen = FEHLER_ART_FORMEN[sprache][art as (typeof FEHLER_ART_REIHENFOLGE)[number]];
  return formen ? mehrzahl(n, sprache, formen) : "";
}

/** Nur die vorkommenden Fehlerarten, zu einem Satz zusammengefügt - oder „". */
function fehlerArtenSatz(
  arten: Record<string, number> | undefined,
  sprache: BedienSprache = "de",
): string {
  if (!arten) return "";
  return FEHLER_ART_REIHENFOLGE.filter((art) => (arten[art] ?? 0) > 0)
    .map((art) => fehlerArtStueck(art, arten[art], sprache))
    .join(", ");
}

/**
 * ★★★ Eine Fehlerstelle als EIN Satz, auch ohne Farbe auf der Braillezeile
 * lesbar (Bauplan §7, Entscheidung Johannes: „Soll-Wort / Ist-Wort je Fehler
 * als Liste, nicht nur als Farbe"). `zeile` ist 0-basiert ({@link FehlerStelle}),
 * die Anzeige zählt ab 1, wie im ganzen Programm.
 */
function fehlerstelleSatz(stelle: FehlerStelle, sprache: BedienSprache = "de"): string {
  const zeile = stelle.zeile + 1;
  const t = FEHLERSTELLE_SAETZE[sprache];
  switch (stelle.art) {
    case "falsch":
      return t.falsch(zeile, stelle.ist, stelle.soll);
    case "fehlend":
      return t.fehlend(zeile, stelle.soll);
    case "ueberzaehlig":
      return t.ueberzaehlig(zeile, stelle.ist);
    case "leerzeichen":
      return t.leerzeichen(zeile, stelle.ist, stelle.soll);
    default:
      return t.zeile(zeile);
  }
}

/**
 * ★ E11a-5 (26.09.2026, Falle 30): die Sätze je Sprache - vorher
 * `if (sprache === "en") … sonst Deutsch`. Französisch mit geraden
 * Anführungszeichen (Braillezeile) und Leerzeichen vor „:".
 */
const FEHLERSTELLE_SAETZE: Record<
  BedienSprache,
  {
    falsch: (zeile: number, ist: string, soll: string) => string;
    fehlend: (zeile: number, soll: string) => string;
    ueberzaehlig: (zeile: number, ist: string) => string;
    leerzeichen: (zeile: number, ist: string, soll: string) => string;
    zeile: (zeile: number) => string;
  }
> = {
  de: {
    falsch: (z, ist, soll) => `Zeile ${z}: „${ist}" statt „${soll}"`,
    fehlend: (z, soll) => `Zeile ${z}: „${soll}" fehlt`,
    ueberzaehlig: (z, ist) => `Zeile ${z}: „${ist}" zu viel`,
    leerzeichen: (z, ist, soll) => `Zeile ${z}: Leerzeichen - „${ist}" statt „${soll}"`,
    zeile: (z) => `Zeile ${z}`,
  },
  en: {
    falsch: (z, ist, soll) => `Line ${z}: "${ist}" instead of "${soll}"`,
    fehlend: (z, soll) => `Line ${z}: "${soll}" missing`,
    ueberzaehlig: (z, ist) => `Line ${z}: "${ist}" extra`,
    leerzeichen: (z, ist, soll) => `Line ${z}: space - "${ist}" instead of "${soll}"`,
    zeile: (z) => `Line ${z}`,
  },
  fr: {
    falsch: (z, ist, soll) => `Ligne ${z} : "${ist}" au lieu de "${soll}"`,
    fehlend: (z, soll) => `Ligne ${z} : "${soll}" manque`,
    ueberzaehlig: (z, ist) => `Ligne ${z} : "${ist}" en trop`,
    leerzeichen: (z, ist, soll) => `Ligne ${z} : espace - "${ist}" au lieu de "${soll}"`,
    zeile: (z) => `Ligne ${z}`,
  },
  // ★ ES-O (27.09.2026): spanisch, gerade Anführungszeichen (Bauplan S4).
  es: {
    falsch: (z, ist, soll) => `Línea ${z}: "${ist}" en lugar de "${soll}"`,
    fehlend: (z, soll) => `Línea ${z}: falta "${soll}"`,
    ueberzaehlig: (z, ist) => `Línea ${z}: "${ist}" sobra`,
    leerzeichen: (z, ist, soll) => `Línea ${z}: espacio - "${ist}" en lugar de "${soll}"`,
    zeile: (z) => `Línea ${z}`,
  },
  // ★ O-IT (02.10.2026): italienisch, gerade Anführungszeichen (Glossar Regel 7).
  it: {
    falsch: (z, ist, soll) => `Riga ${z}: "${ist}" invece di "${soll}"`,
    fehlend: (z, soll) => `Riga ${z}: manca "${soll}"`,
    ueberzaehlig: (z, ist) => `Riga ${z}: "${ist}" in più`,
    leerzeichen: (z, ist, soll) => `Riga ${z}: spazio - "${ist}" invece di "${soll}"`,
    zeile: (z) => `Riga ${z}`,
  },
  // ★ O-PL (02.10.2026): polnische Anführung „…” (Glossar Regel 8).
  pl: {
    falsch: (z, ist, soll) => `Wiersz ${z}: „${ist}” zamiast „${soll}”`,
    fehlend: (z, soll) => `Wiersz ${z}: brakuje „${soll}”`,
    ueberzaehlig: (z, ist) => `Wiersz ${z}: zbędne „${ist}”`,
    leerzeichen: (z, ist, soll) => `Wiersz ${z}: spacja - „${ist}” zamiast „${soll}”`,
    zeile: (z) => `Wiersz ${z}`,
  },
  // ★ O-TR (02.10.2026): gerade Anführung (Glossar Regel 7); "A yerine B" =
  // B statt A - darum steht das Soll-Wort vorn. Keine Endung an `ist`/`soll`.
  tr: {
    falsch: (z, ist, soll) => `Satır ${z}: "${soll}" yerine "${ist}"`,
    fehlend: (z, soll) => `Satır ${z}: "${soll}" eksik`,
    ueberzaehlig: (z, ist) => `Satır ${z}: fazladan "${ist}"`,
    leerzeichen: (z, ist, soll) => `Satır ${z}: boşluk - "${soll}" yerine "${ist}"`,
    zeile: (z) => `Satır ${z}`,
  },
  // ★ O-CS (03.10.2026): tschechische Anführung unten/oben (U+201E, U+201C, Glossar Regel 7) - eine
  // Liste, keine Live-Zeile; ohne Schlusspunkt nach der Zeilenzahl (Falle 4).
  cs: {
    falsch: (z, ist, soll) => `Řádek ${z}: „${ist}“ místo „${soll}“`,
    fehlend: (z, soll) => `Řádek ${z}: chybí „${soll}“`,
    ueberzaehlig: (z, ist) => `Řádek ${z}: navíc „${ist}“`,
    leerzeichen: (z, ist, soll) => `Řádek ${z}: mezera - „${ist}“ místo „${soll}“`,
    zeile: (z) => `Řádek ${z}`,
  },
  // ★ O2-COMP (30.10.2026): bg eigene Fassung.
  bg: {
      falsch: (z, ist, soll) => `Ред ${z}: „${ist}“ вместо „${soll}“`,
      fehlend: (z, soll) => `Ред ${z}: липсва „${soll}“`,
      ueberzaehlig: (z, ist) => `Ред ${z}: излишно „${ist}“`,
      leerzeichen: (z, ist, soll) => `Ред ${z}: интервал - „${ist}“ вместо „${soll}“`,
      zeile: (z) => `Ред ${z}`,
    },
  // ★ O2-COMP (30.10.2026): el eigene Fassung.
  el: {
      falsch: (z, ist, soll) => `Γραμμή ${z}: «${ist}» αντί για «${soll}»`,
      fehlend: (z, soll) => `Γραμμή ${z}: λείπει «${soll}»`,
      ueberzaehlig: (z, ist) => `Γραμμή ${z}: περισσεύει «${ist}»`,
      leerzeichen: (z, ist, soll) => `Γραμμή ${z}: διάστημα - «${ist}» αντί για «${soll}»`,
      zeile: (z) => `Γραμμή ${z}`,
    },
  // ★ O2-COMP (30.10.2026): hu eigene Fassung.
  hu: {
      falsch: (z, ist, soll) => `Sor: ${z} - „${ist}”, helyesen: „${soll}”`,
      fehlend: (z, soll) => `Sor: ${z} - hiányzik: „${soll}”`,
      ueberzaehlig: (z, ist) => `Sor: ${z} - fölösleges: „${ist}”`,
      leerzeichen: (z, ist, soll) => `Sor: ${z} - szóköz: „${ist}”, helyesen: „${soll}”`,
      zeile: (z) => `Sor: ${z}`,
    },
  // ★ O2-COMP (30.10.2026): nl eigene Fassung.
  nl: {
      falsch: (z, ist, soll) => `Regel ${z}: "${ist}" in plaats van "${soll}"`,
      fehlend: (z, soll) => `Regel ${z}: "${soll}" ontbreekt`,
      ueberzaehlig: (z, ist) => `Regel ${z}: "${ist}" te veel`,
      leerzeichen: (z, ist, soll) => `Regel ${z}: spatie - "${ist}" in plaats van "${soll}"`,
      zeile: (z) => `Regel ${z}`,
    },
  // ★ O2-COMP (30.10.2026): pt eigene Fassung.
  pt: {
      falsch: (z, ist, soll) => `Linha ${z}: "${ist}" em vez de "${soll}"`,
      fehlend: (z, soll) => `Linha ${z}: falta "${soll}"`,
      ueberzaehlig: (z, ist) => `Linha ${z}: "${ist}" a mais`,
      leerzeichen: (z, ist, soll) => `Linha ${z}: espaço - "${ist}" em vez de "${soll}"`,
      zeile: (z) => `Linha ${z}`,
    },
  // ★ O2-COMP (30.10.2026): br eigene Fassung.
  br: {
      falsch: (z, ist, soll) => `Linha ${z}: "${ist}" em vez de "${soll}"`,
      fehlend: (z, soll) => `Linha ${z}: falta "${soll}"`,
      ueberzaehlig: (z, ist) => `Linha ${z}: "${ist}" a mais`,
      leerzeichen: (z, ist, soll) => `Linha ${z}: espaço - "${ist}" em vez de "${soll}"`,
      zeile: (z) => `Linha ${z}`,
    },
  // ★ O2-COMP (30.10.2026): ro eigene Fassung.
  ro: {
      falsch: (z, ist, soll) => `Rândul ${z}: „${ist}” în loc de „${soll}”`,
      fehlend: (z, soll) => `Rândul ${z}: lipsește „${soll}”`,
      ueberzaehlig: (z, ist) => `Rândul ${z}: „${ist}” în plus`,
      leerzeichen: (z, ist, soll) => `Rândul ${z}: spațiu - „${ist}” în loc de „${soll}”`,
      zeile: (z) => `Rândul ${z}`,
    },
  // ★ O2-COMP (30.10.2026): sv eigene Fassung.
  sv: {
      falsch: (z, ist, soll) => `Rad ${z}: "${ist}" i stället för "${soll}"`,
      fehlend: (z, soll) => `Rad ${z}: "${soll}" saknas`,
      ueberzaehlig: (z, ist) => `Rad ${z}: "${ist}" för mycket`,
      leerzeichen: (z, ist, soll) => `Rad ${z}: mellanslag - "${ist}" i stället för "${soll}"`,
      zeile: (z) => `Rad ${z}`,
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      falsch: (z, ist, soll) => `Рядок ${z}: «${ist}» замість «${soll}»`,
      fehlend: (z, soll) => `Рядок ${z}: пропущено «${soll}»`,
      ueberzaehlig: (z, ist) => `Рядок ${z}: зайве «${ist}»`,
      leerzeichen: (z, ist, soll) => `Рядок ${z}: пробіл - «${ist}» замість «${soll}»`,
      zeile: (z) => `Рядок ${z}`,
    },
};

/**
 * Eine Zeile der Auflistung. Bewusst `<dt>`/`<dd>` in einer Beschreibungsliste:
 * Für eine Sprachausgabe und auf der Braillezeile kommt so immer erst die
 * Frage und dann die Zahl - in derselben Reihenfolge, in der sie auch auf dem
 * Bildschirm stehen.
 */
function Zeile({ was, wert, hilfe }: { was: string; wert: string; hilfe?: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 border-b border-hairline/60 py-1.5 last:border-b-0">
      <dt className="m-0 text-ink-soft">{hilfe ? <Erklaert hilfe={hilfe}>{was}</Erklaert> : was}</dt>
      <dd className="m-0 font-medium tabular-nums text-ink">{wert}</dd>
    </div>
  );
}

/**
 * Die auffälligen Zahlen ganz oben - seit E7 (11.09.2026) die geteilte Kachel
 * aus `Kennzahl.tsx` (Wert `text-xl` statt vorher `text-4xl`): Ein Kind, das
 * die Schrift stark vergrössert, sah die kleinste Beschriftung der Statistik
 * gerade noch, während diese Kachel schon den Bildschirm sprengte. Die
 * Kachel selbst ist jetzt EINE Bauart mit `PupilStatsPanel` und der
 * Abschlusskarte in `TypingSession`
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 */

export function SchreibprobeErgebnis({
  ergebnis,
  onWeiter,
  hinweis,
}: {
  ergebnis: Probenergebnis;
  /** „Weiter üben" - zurück in den normalen Trainer. */
  onWeiter?: () => void;
  /**
   * ★ 27.09.2026: ein ruhiger Satz direkt unter dem Titel - heute nur „wird
   * gesendet, sobald die Verbindung wieder da ist". Bewusst KEIN Live-Bereich:
   * er wird gelesen, wenn das Kind vom Titel weiterliest, und lässt die
   * Braillezeile stehen.
   */
  hinweis?: string;
}) {
  const { sprache } = useBedienSprache();
  const t = ERGEBNIS_TEXTE[sprache];
  const H = hinweiseChallenge(sprache);
  const def = niveauDef(ergebnis.niveau, lernwegVon(ergebnis));
  const niveau = def ? niveauTexte(def, sprache) : null;
  const richtige = (z: { dran: number; fehler: number }) => z.dran - z.fehler;
  const wertung = wertungVon(ergebnis);
  // ★ 23.09.2026 („Freies Schreiben", E6): „Fehler" heisst hier „stehengeblieben"
  // (siehe Dateikopf `schreibprobeAuswertung.ts`) und die Karte zeigt drei
  // zusätzliche Zeilen - streng bleibt die Karte UNVERÄNDERT (Bauplan §7).
  const frei = ergebnis.modus === "frei";
  const fehlerArtenText = frei ? fehlerArtenSatz(ergebnis.fehlerArten, sprache) : "";
  const fehlerStellen = frei ? (ergebnis.fehlerStellen ?? []) : [];
  /*
    ★ Der Titel des Textes ist INHALT, nicht Bedienung: Die Prüfungstexte des
    Lernwegs „de" sind deutsch (Glossar §4). In der englischen Bedienung steht
    er darum in `lang="de"`, damit eine Sprachausgabe ihn deutsch liest. Die
    eigene Datei („eigen") nicht - ihr Name ist ein Dateiname, dessen Sprache
    niemand kennt. Deutsch: genau der Textknoten von vorher.
    ★ E10 (24.09.2026): der englische Lehrgang (Lernweg „en") hat EIGENE,
    englische Prüfungstexte - deren Titel bekommt in der englischen Bedienung
    KEINE `lang="de"`-Auszeichnung, sonst läse eine Sprachausgabe einen echten
    englischen Titel mit deutscher Aussprache.
  */
  // ★ E11a-5 (26.09.2026): In der französischen Bedienung ist der Titel nur
  // dann deutsch, wenn der Text wirklich zum Weg „de" gehört - ein Titel aus
  // der französischen Bank (Weg „fr", E13b) ist französisch und bekommt kein
  // `lang="de"`. Englisch unverändert.
  const titelDeutsch =
    ergebnis.niveau !== "eigen" &&
    {
      de: false,
      en: lernwegVon(ergebnis) !== "en",
      fr: lernwegVon(ergebnis) === "de",
      // es: wie "en" (ES-F2: Weg "es" ist mechanisch ein Alias von "en") -
      // deutsch markiert, ausser der Text gehört wirklich zum Weg "es".
      es: lernwegVon(ergebnis) !== "es",
      // ★ O-IT (02.10.2026): wie „fr" - deutsch ist der Titel nur auf Weg „de".
      it: lernwegVon(ergebnis) === "de",
      // ★ O-PL (02.10.2026): wie „it" - deutsch ist der Titel nur auf Weg „de".
      pl: lernwegVon(ergebnis) === "de",
      // ★ O-TR (02.10.2026): wie "it" - deutsch ist der Titel nur auf Weg "de".
      tr: lernwegVon(ergebnis) === "de",
      // ★ O-CS (03.10.2026): wie "it" - deutsch ist der Titel nur auf Weg "de".
      cs: lernwegVon(ergebnis) === "de",
      // ★ G2-NEUN (25.10.2026): wie „cs" (die neun Wege haben noch keine eigene Bank).
      bg: lernwegVon(ergebnis) === "de",
      el: lernwegVon(ergebnis) === "de",
      hu: lernwegVon(ergebnis) === "de",
      nl: lernwegVon(ergebnis) === "de",
      pt: lernwegVon(ergebnis) === "de",
      br: lernwegVon(ergebnis) === "de",
      ro: lernwegVon(ergebnis) === "de",
      sv: lernwegVon(ergebnis) === "de",
      uk: lernwegVon(ergebnis) === "de",
    }[sprache];

  return (
    <div className="card mx-auto w-full max-w-prose p-5 sm:p-6">
      {/*
        ★ `tabIndex={-1}` und die Marke `data-probe-titel`: Nach dem Abgeben
        setzt `SchreibprobeLauf` den Fokus hierher (R1-R6, jeder Schalter hat
        ein Fokusziel). Die Marke steht am Bauteil selbst, nicht an einer festen
        `id` - in der Statistik stehen mehrere dieser Karten untereinander, und
        eine doppelte `id` wäre dort ein echter Fehler.
      */}
      <h2
        data-probe-titel
        tabIndex={-1}
        className="m-0 text-xl font-semibold text-ink outline-none"
      >
        {t.titel(pruefungWort(sprache))}
      </h2>
      {hinweis ? <p className="mb-0 mt-1 text-ink-soft">{hinweis}</p> : null}
      <p className="mb-4 mt-1 text-ink-soft">
        {niveau ? `${niveau.kurz} · ` : ""}
        {/* ★ „eigen" (17.09.2026): „Text 1 von 15" wäre hier Unsinn - es gibt
            keine Bank, nur die eine hochgeladene Datei (ihr Name steht schon
            in `textTitel`). */}
        {ergebnis.niveau !== "eigen" &&
          stelleBezeichnung(ergebnis.textNr, ergebnis.startZeile, sprache)}
        {ergebnis.textTitel ? (
          titelDeutsch ? (
            <>
              {" · "}
              <span lang="de">{ergebnis.textTitel}</span>
            </>
          ) : (
            ` · ${ergebnis.textTitel}`
          )
        ) : (
          ""
        )}
      </p>

      {/*
        ⚠️ Zwei Beschreibungslisten statt einer: Zwischen den grossen Zahlen und
        der Auflistung steht ein Satz, und ein `<p>` darf in keinem `<dl>`
        stehen. Zwei Listen sind hier ohnehin ehrlicher - oben der Überblick,
        unten die Einzelheiten.
      */}
      <dl className="m-0 flex flex-wrap gap-3">
        <KennzahlKachel
          was={t.anschlaege}
          wert={String(ergebnis.anschlaege)}
          hilfe={H.anschlaege}
        />
        <KennzahlKachel
          hilfe={H.treffsicherheit}
          was={t.treffsicherheit}
          wert={String(Math.round(ergebnis.genauigkeit * 100))}
          einheit="%"
        />
        {/* ★ Der eigene Leistungswert - kein Rang, siehe Dateikopf. Bei einer
            zu kurzen Arbeit steht hier gar keine Zahl: Sie wäre Rauschen, und
            Rauschen mit zwei Nachkommastellen sieht aus wie ein Ergebnis. */}
        {wertung.gewertet && (
          <KennzahlKachel
            was={t.leistungswert}
            wert={eineStelle(wertung.wert, sprache)}
            hilfe={H.leistungswert}
            ausrichtung="rechts"
          />
        )}
      </dl>

      {/*
        Die eine Zeile, die sagt, was die Zahl ist. Sie sagt NICHT, ob sie gut
        ist - das steht dem Programm nicht zu ([[feedback_nie_gegen_das_kind]]).
        Und bei einer zu kurzen Arbeit steht die Tatsache ruhig da: kein
        „leider", kein „nur", keine Entschuldigung.
      */}
      <p className="mb-4 mt-2 text-sm text-ink-soft">
        {wertung.gewertet
          ? t.gewertet(fehlerGewicht(ergebnis.modus))
          : t.zuKurz(MIND_ZEICHEN_WERTUNG)}
      </p>

      <dl className="m-0">
        <Zeile was={t.zeichen} wert={String(ergebnis.zeichen)} hilfe={H.zeichen} />
        {/* ★ 23.09.2026 („Freies Schreiben"): im freien Modus heisst „Fehler"
            „Stehengebliebene Fehler" (siehe Dateikopf `schreibprobeAuswertung.ts`
            zum Unterschied zu `fehlgriffe`). */}
        <Zeile
          was={frei ? t.fehlerFrei : t.fehler}
          wert={String(ergebnis.fehler)}
          hilfe={frei ? H.fehlerFrei : H.fehler}
        />
        {/* Nur im freien Modus - die Rücktaste gibt es im strengen gar nicht. */}
        {frei ? (
          <Zeile
            was={t.korrekturen}
            wert={String(ergebnis.korrekturen ?? 0)}
            hilfe={H.korrekturen}
          />
        ) : null}
        {/* Nur die Fehlerarten, die wirklich vorkommen - keine Zeile, wenn keine da sind. */}
        {frei && fehlerArtenText ? (
          <Zeile was={t.fehlerarten} wert={fehlerArtenText} />
        ) : null}
        <Zeile was={t.zeilen} wert={String(ergebnis.zeilen)} hilfe={H.zeilen} />
        <Zeile was={t.schreibzeit} wert={mmss(ergebnis.schreibMs)} hilfe={H.schreibzeit} />
        {/*
          Die beiden Nachteilsausgleiche stehen nur da, wenn sie gegriffen
          haben. Eine Zeile „Zeitzuschlag: 0 %" wäre eine Auskunft über etwas,
          das nicht stattgefunden hat - und bei jedem anderen Kind stünde sie
          mit einer Zahl daneben.
        */}
        {ergebnis.wartezeitMs > 0 ? (
          <Zeile
            was={t.vorlesezeit}
            wert={mmss(ergebnis.wartezeitMs)}
            hilfe={H.vorlesezeit}
          />
        ) : null}
        {ergebnis.zuschlagProzent > 0 ? (
          <Zeile
            was={t.zuschlag}
            wert={t.prozent(ergebnis.zuschlagProzent)}
            hilfe={H.zuschlagErgebnis}
          />
        ) : null}
      </dl>

      {/*
        ★★★ 23.09.2026 („Freies Schreiben", Bauplan §7 Punkt „Fehlerstellen"):
        Original gegen Eingabe, als LISTE - nicht nur als Farbe, damit sie auch
        auf der Braillezeile ohne Farbe verständlich ist. Ein `<details>`, weil
        eine lange Liste nicht ungefragt vor der Karte stehen soll; ohne
        Fehlerstellen (z. B. eine fehlerfreie Arbeit) zeigt die Karte nichts
        davon.
      */}
      {frei && fehlerStellen.length > 0 ? (
        <details className="mt-3">
          <summary className="cursor-pointer text-ink">
            {t.fehlerstellenAnsehen(fehlerStellen.length)}
          </summary>
          <ol className="m-0 mt-2 list-decimal space-y-1 pl-5 text-sm text-ink-soft">
            {fehlerStellen.map((stelle, i) => (
              // ★ Kein besserer Schlüssel vorhanden - die Stellen tragen keine
              // eigene Id, und die Reihenfolge steht schon in Textreihenfolge fest.
              <li key={i}>{fehlerstelleSatz(stelle, sprache)}</li>
            ))}
          </ol>
        </details>
      ) : null}

      {/*
        Was mit dem Text passiert ist - eine Tatsache, kein Urteil. „Du hast den
        ganzen Text geschrieben" und „Du hast selbst abgegeben" beschreiben, was
        geschehen ist; beides steht ohne Bewertung da.
      */}
      {ergebnis.textZuEnde || ergebnis.frueherAbgegeben ? (
        <p className="mt-3 text-ink-soft">
          {ergebnis.textZuEnde ? t.textZuEnde : t.frueher}
        </p>
      ) : null}

      {/*
        ★ 23.09.2026 (Abnahme im Browser): Beim freien Schreiben wird keine
        einzelne Taste gemessen (ohne Zeichen-für-Zeichen-Vergleich weiss
        niemand, welche Taste gemeint war). „Keine einzelne Taste ist
        aufgefallen" wäre dort wahr und trotzdem irreführend - der Abschnitt
        entfällt. Die Fehlerstellen oben sagen, was stehen geblieben ist.
      */}
      {!frei && (<>
      <h3 className="mb-1 mt-5 text-base font-semibold text-ink">
        <Erklaert hilfe={H.wacklig}>{t.wacklig}</Erklaert>
      </h3>
      {ergebnis.wacklig.length > 0 ? (
        <ul className="m-0 list-none space-y-1 p-0">
          {ergebnis.wacklig.map((z) => (
            <li
              key={z.zeichen}
              className="flex flex-wrap items-baseline justify-between gap-x-4 border-b border-hairline/60 py-1 last:border-b-0"
            >
              {/* ★ EN5: Ein Umlaut oder ß ist eine Taste der DEUTSCHEN Tastatur,
                  die geübt wird - in der englischen Bedienung in `lang="de"`,
                  damit die Stimme „ö" sagt und nicht rät. */}
              <span
                className="font-medium text-ink"
                lang={sprache !== "de" && /[äöüß]/i.test(z.zeichen) ? "de" : undefined}
              >
                {tastenName(z.zeichen, sprache)}
              </span>
              <span className="tabular-nums text-ink-soft">{t.richtig(richtige(z), z.dran)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="m-0 text-ink-soft">{t.keineWacklig}</p>
      )}
      </>)}

      {onWeiter ? (
        <div className="mt-6">
          <button type="button" className="btn-primary" onClick={onWeiter}>
            {t.weiter}
          </button>
          <p className="mb-0 mt-2 text-sm text-ink-muted">{t.escape}</p>
        </div>
      ) : null}
    </div>
  );
}
