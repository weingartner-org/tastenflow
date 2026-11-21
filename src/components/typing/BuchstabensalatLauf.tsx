/**
 * Der BUCHSTABENSALAT - aus einem langen Wort (`Weihnachtsbaum`) so viele neue
 * Wörter machen wie möglich.
 *
 * Die einzige Form der ganzen Liste mit einer wirklich NEUEN Interaktion: frei
 * eingeben statt nachschreiben. Es gibt keine Vorlage, also auch keine
 * Zeichen-für-Zeichen-Rückmeldung - geprüft wird erst die fertige Eingabe, und
 * zwar dreifach: Buchstabenvorrat (Mengenrechnung), Lexikon, und ob das Wort
 * schon dabei war.
 *
 * ★★★ Nie etwas gegen ein Kind. Keine Rückmeldung heisst hier „falsch". Sie
 * sagt, WAS gerade nicht passt - „die Buchstaben reichen dafür nicht" oder
 * „das hattest du schon" -, und das ist eine Auskunft, keine Wertung. Wer die
 * Zahl nicht erreicht, hat trotzdem geübt: Die Runde endet, wann das Kind will.
 *
 * Fokus-Führung (R1-R6): Nach jeder Eingabe geht der Fokus ausdrücklich zurück
 * ins Feld (`setTimeout(0)`), ESC führt ebenfalls dorthin, nichts ist je
 * `disabled`. Die Liste der gefundenen Wörter steht in einer `aria-live`-Region,
 * damit eine Sprachausgabe den Zuwachs meldet, ohne den Fokus zu bewegen.
 */
import { feinesLangAttribut } from "@/lib/typing/schreibweise";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  notePracticeActivity,
  speakUi,
  takePracticeDelta,
  type Lang,
  type TaskEvent,
} from "@/lib/typing";
import {
  pruefeSalatwort,
  SALAT_ZIEL,
  salatBuchstaben,
  salatFeldbeschriftung,
  type SalatUrteil,
} from "@/lib/typing/uebungsformen/buchstabensalat";
import {
  ausTeilen,
  inTeile,
  inhalt,
  type TextTeil,
} from "@/lib/typing/uebungsformen/bedienung";
import { formName } from "@/lib/typing/uebungsformen/namen";
import { texte, type BedienSprache } from "@/lib/bedienSprache";
import {
  laufweiteFeld,
  laufweiteText,
  type ZeichenabstandFaktor,
} from "@/lib/typing/zeichenabstand";
import {
  TeileText,
  sprechStuecke,
  useNacheinanderSprechen,
  useWortspielSprache,
} from "./wortspielSprache";
import { CviAbdunkeln } from "./CviAbdunkeln";

/**
 * Die Texte des Buchstabensalats in beiden Bedienungssprachen (EN4,
 * 18.09.2026). Deutsch wortgleich wie vorher.
 *
 * ⚠️ Vor EN4 wählte `lang === "en"` (die ÜBUNGSSPRACHE) die Sprache der
 * Knöpfe. Ohne aktiven Sprachbereich bleibt das so (`useWortspielSprache`).
 */
const SALAT_TEXTE = texte({
  de: {
    gefundenVon: (n: number, ziel: number) => `${n} von ${ziel} Wörtern`,
    neuesWort: "Ein neues Wort",
    deineWoerter: "Deine Wörter",
    pruefen: "Prüfen",
    fertig: "Fertig",
    zurueck: "Zurück zum Üben",
    ja: (wort: string) => `Ja: ${wort}`,
    // ★ 20.09.2026: zwei Buchstaben zählen jetzt („Ei"), der Satz zog mit.
    zuKurz: "Etwas länger - mindestens zwei Buchstaben.",
    nichtImVorrat: "Diese Buchstaben stecken nicht alle im Wort.",
    schonGehabt: "Das hattest du schon.",
    dasQuellwort: "Das ist das Wort selbst - finde ein neues.",
    keinWort: "Dieses Wort kenne ich nicht.",
    // ★ 25.09.2026 (Johannes): Namen zählen nicht.
    name: "Namen zählen hier nicht - such ein anderes Wort.",
    // ★ 25.09.2026 (Testerin): erst das Wort, dann die Buchstaben.
    wortHeisst: "Das Wort heißt:",
    buchstaben: "Die Buchstaben:",
  },
  en: {
    gefundenVon: (n: number, ziel: number) => `${n} of ${ziel} words`,
    neuesWort: "A new word",
    deineWoerter: "Your words",
    pruefen: "Check",
    fertig: "Done",
    zurueck: "Back to practice",
    ja: (wort: string) => `Yes: ${wort}`,
    zuKurz: "A bit longer - at least two letters.",
    nichtImVorrat: "Not all of those letters are in the word.",
    schonGehabt: "You've already got that one.",
    dasQuellwort: "That's the word itself - find a new one.",
    keinWort: "I don't know that word.",
    name: "Names don't count here - find another word.",
    wortHeisst: "The word is:",
    buchstaben: "The letters:",
  },
  fr: {
    gefundenVon: (n: number, ziel: number) => `${n} sur ${ziel} mots`,
    neuesWort: "Un nouveau mot",
    deineWoerter: "Tes mots",
    pruefen: "Vérifier",
    fertig: "Terminé",
    zurueck: "Retour à l'exercice",
    ja: (wort: string) => `Oui : ${wort}`,
    zuKurz: "Un peu plus long - deux lettres minimum.",
    nichtImVorrat: "Ces lettres ne sont pas toutes dans le mot.",
    schonGehabt: "Tu l'avais déjà trouvé.",
    dasQuellwort: "C'est le mot lui-même - trouve-en un nouveau.",
    keinWort: "Je ne connais pas ce mot.",
    name: "Les prénoms ne comptent pas ici - cherche un autre mot.",
    wortHeisst: "Le mot est :",
    buchstaben: "Les lettres :",
  },
  es: {
    gefundenVon: (n: number, ziel: number) => `${n} de ${ziel} palabras`,
    neuesWort: "Una palabra nueva",
    deineWoerter: "Tus palabras",
    pruefen: "Comprobar",
    fertig: "Terminado",
    zurueck: "Volver a practicar",
    ja: (wort: string) => `Sí: ${wort}`,
    zuKurz: "Un poco más larga - dos letras como mínimo.",
    nichtImVorrat: "No todas estas letras están en la palabra.",
    schonGehabt: "Esa ya la habías encontrado.",
    dasQuellwort: "Esa es la palabra misma - busca una nueva.",
    keinWort: "No conozco esa palabra.",
    name: "Los nombres de persona no cuentan aquí - busca otra palabra.",
    wortHeisst: "La palabra es:",
    buchstaben: "Las letras:",
  },
  // ★ O-IT (02.10.2026): „Lettere mescolate" (Glossar §2.2), das Kind liest „tu".
  it: {
    gefundenVon: (n: number, ziel: number) => `${n} di ${ziel} parole`,
    neuesWort: "Una parola nuova",
    deineWoerter: "Le tue parole",
    pruefen: "Controlla",
    fertig: "Fatto",
    zurueck: "Torna all'esercizio",
    ja: (wort: string) => `Sì: ${wort}`,
    zuKurz: "Un po' più lunga - almeno due lettere.",
    nichtImVorrat: "Non tutte queste lettere sono nella parola.",
    schonGehabt: "Questa l'avevi già trovata.",
    dasQuellwort: "Questa è la parola stessa - cercane una nuova.",
    keinWort: "Non conosco questa parola.",
    name: "Qui i nomi di persona non contano - cerca un'altra parola.",
    wortHeisst: "La parola è:",
    buchstaben: "Le lettere:",
  },
  // ★ O-PL (02.10.2026): „Pomieszane litery" (Glossar §2.2), ty; Zahl nach Doppelpunkt
  // („Słowa: 3 z 8"), damit keine Mehrzahlform an der Zahl hängt.
  pl: {
    gefundenVon: (n: number, ziel: number) => `Słowa: ${n} z ${ziel}`,
    neuesWort: "Nowe słowo",
    deineWoerter: "Twoje słowa",
    pruefen: "Sprawdź",
    fertig: "Gotowe",
    zurueck: "Wróć do ćwiczeń",
    ja: (wort: string) => `Tak: ${wort}`,
    zuKurz: "Trochę dłuższe - co najmniej dwie litery.",
    nichtImVorrat: "Nie wszystkie te litery są w słowie.",
    schonGehabt: "To słowo już masz.",
    dasQuellwort: "To jest słowo wyjściowe - znajdź nowe.",
    keinWort: "Nie znam tego słowa.",
    name: "Imiona się tu nie liczą - poszukaj innego słowa.",
    wortHeisst: "Słowo to:",
    buchstaben: "Litery:",
  },
  // ★ O-TR (02.10.2026): "Karışık harfler" (Glossar §2.2), sen; Zahl ohne Endung
  // ("Bulunan kelime: 3, toplam 8", Regel 6).
  tr: {
    gefundenVon: (n: number, ziel: number) => `Bulunan kelime: ${n}, toplam ${ziel}`,
    neuesWort: "Yeni bir kelime",
    deineWoerter: "Kelimelerin",
    pruefen: "Kontrol et",
    fertig: "Bitti",
    zurueck: "Alıştırmaya dön",
    ja: (wort: string) => `Evet: ${wort}`,
    zuKurz: "Biraz daha uzun olsun - en az iki harf.",
    nichtImVorrat: "Bu harflerin hepsi kelimede yok.",
    schonGehabt: "Bu kelimeyi zaten buldun.",
    dasQuellwort: "Bu, kelimenin kendisi - yeni bir kelime bul.",
    keinWort: "Bu kelimeyi tanımıyorum.",
    name: "Adlar burada sayılmaz - başka bir kelime ara.",
    wortHeisst: "Kelime:",
    buchstaben: "Harfler:",
  },
  // ★ O-CS (03.10.2026): „Přeházená písmena" (Glossar §2.2), ty; Zahl nach Doppelpunkt
  // mit Schrägstrich („Slova: 3/8", Regel 13), Knöpfe im Infinitiv.
  cs: {
    gefundenVon: (n: number, ziel: number) => `Slova: ${n}/${ziel}`,
    neuesWort: "Nové slovo",
    deineWoerter: "Tvoje slova",
    pruefen: "Zkontrolovat",
    fertig: "Hotovo",
    zurueck: "Zpět ke cvičení",
    ja: (wort: string) => `Ano: ${wort}`,
    zuKurz: "Trochu delší - aspoň dvě písmena.",
    nichtImVorrat: "Tahle písmena nejsou všechna ve slově.",
    schonGehabt: "Tohle slovo už máš.",
    dasQuellwort: "To je výchozí slovo - najdi nové.",
    keinWort: "Tohle slovo neznám.",
    name: "Jména se tu nepočítají - hledej jiné slovo.",
    wortHeisst: "Slovo je:",
    buchstaben: "Písmena:",
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      gefundenVon: (n: number, ziel: number) => `Думи: ${n}/${ziel}`,
      neuesWort: "Нова дума",
      deineWoerter: "Твоите думи",
      pruefen: "Провери",
      fertig: "Готово",
      zurueck: "Обратно към упражненията",
      ja: (wort: string) => `Да: ${wort}`,
      zuKurz: "Малко по-дълга - поне две букви.",
      nichtImVorrat: "Не всички от тези букви ги има в думата.",
      schonGehabt: "Тази дума вече я имаш.",
      dasQuellwort: "Това е самата дума - намери нова.",
      keinWort: "Не познавам тази дума.",
      name: "Имената не се броят тук - потърси друга дума.",
      wortHeisst: "Думата е:",
      buchstaben: "Буквите:",
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      // Zahl nach Doppelpunkt: „από 1 λέξεις" wäre falsch (Glossar Regel 13).
      gefundenVon: (n: number, ziel: number) => `Λέξεις: ${n} από ${ziel}`,
      neuesWort: "Νέα λέξη",
      deineWoerter: "Οι λέξεις σου",
      pruefen: "Έλεγχος",
      fertig: "Τέλος",
      zurueck: "Πίσω στην εξάσκηση",
      ja: (wort: string) => `Ναι: ${wort}`,
      zuKurz: "Λίγο μεγαλύτερη - τουλάχιστον δύο γράμματα.",
      nichtImVorrat: "Δεν υπάρχουν όλα αυτά τα γράμματα στη λέξη.",
      schonGehabt: "Αυτή την έχεις ήδη.",
      dasQuellwort: "Αυτή είναι η ίδια η λέξη - βρες μια καινούργια.",
      keinWort: "Αυτή τη λέξη δεν την ξέρω.",
      name: "Τα ονόματα δεν μετράνε εδώ - βρες άλλη λέξη.",
      wortHeisst: "Η λέξη είναι:",
      buchstaben: "Τα γράμματα:",
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      gefundenVon: (n: number, ziel: number) => `Szavak: ${n}/${ziel}`,
      neuesWort: "Új szó",
      deineWoerter: "A szavaid",
      pruefen: "Ellenőrzés",
      fertig: "Kész",
      zurueck: "Vissza a gyakorláshoz",
      ja: (wort: string) => `Igen: ${wort}`,
      zuKurz: "Kicsit hosszabbat - legalább két betűt.",
      nichtImVorrat: "Ezek a betűk nincsenek mind benne a szóban.",
      schonGehabt: "Ez már megvolt.",
      dasQuellwort: "Ez maga a szó - keress egy újat.",
      keinWort: "Ezt a szót nem ismerem.",
      name: "A nevek itt nem számítanak - keress egy másik szót.",
      wortHeisst: "A szó:",
      buchstaben: "A betűk:",
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      gefundenVon: (n: number, ziel: number) => `${n} van ${ziel} woorden`,
      neuesWort: "Een nieuw woord",
      deineWoerter: "Jouw woorden",
      pruefen: "Controleren",
      fertig: "Klaar",
      zurueck: "Terug naar het oefenen",
      ja: (wort: string) => `Ja: ${wort}`,
      zuKurz: "Iets langer - minstens twee letters.",
      nichtImVorrat: "Niet al die letters zitten in het woord.",
      schonGehabt: "Dat woord had je al.",
      dasQuellwort: "Dat is het woord zelf - zoek een nieuw woord.",
      keinWort: "Dat woord ken ik niet.",
      name: "Namen tellen hier niet - zoek een ander woord.",
      wortHeisst: "Het woord is:",
      buchstaben: "De letters:",
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      gefundenVon: (n: number, ziel: number) => `${n} de ${ziel} palavras`,
      neuesWort: "Uma palavra nova",
      deineWoerter: "As tuas palavras",
      pruefen: "Verificar",
      fertig: "Concluído",
      zurueck: "Voltar a praticar",
      ja: (wort: string) => `Sim: ${wort}`,
      zuKurz: "Um pouco mais longa - pelo menos duas letras.",
      nichtImVorrat: "Nem todas estas letras estão na palavra.",
      schonGehabt: "Essa já a tinhas.",
      dasQuellwort: "Essa é a própria palavra - encontra uma nova.",
      keinWort: "Não conheço essa palavra.",
      name: "Os nomes não contam aqui - procura outra palavra.",
      wortHeisst: "A palavra é:",
      buchstaben: "As letras:",
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      gefundenVon: (n: number, ziel: number) => `${n} de ${ziel} palavras`,
      neuesWort: "Uma palavra nova",
      deineWoerter: "Suas palavras",
      pruefen: "Verificar",
      fertig: "Concluir",
      zurueck: "Voltar a praticar",
      ja: (wort: string) => `Sim: ${wort}`,
      zuKurz: "Um pouco mais longa - pelo menos duas letras.",
      nichtImVorrat: "Nem todas essas letras estão na palavra.",
      schonGehabt: "Essa você já encontrou.",
      dasQuellwort: "Essa é a própria palavra - encontre uma nova.",
      keinWort: "Não conheço essa palavra.",
      name: "Nomes não valem aqui - procure outra palavra.",
      wortHeisst: "A palavra é:",
      buchstaben: "As letras:",
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      gefundenVon: (n: number, ziel: number) => `Cuvinte: ${n} din ${ziel}`,
      neuesWort: "Un cuvânt nou",
      deineWoerter: "Cuvintele tale",
      pruefen: "Verificați",
      fertig: "Gata",
      zurueck: "Înapoi la exersare",
      ja: (wort: string) => `Da: ${wort}`,
      zuKurz: "Puțin mai lung - cel puțin două litere.",
      nichtImVorrat: "Nu toate aceste litere sunt în cuvânt.",
      schonGehabt: "Pe acesta l-ai găsit deja.",
      dasQuellwort: "Acesta este chiar cuvântul dat - găsește unul nou.",
      keinWort: "Nu cunosc acest cuvânt.",
      name: "Numele nu se pun aici - caută alt cuvânt.",
      wortHeisst: "Cuvântul este:",
      buchstaben: "Literele:",
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      gefundenVon: (n: number, ziel: number) => `${n} av ${ziel} ord`,
      neuesWort: "Ett nytt ord",
      deineWoerter: "Dina ord",
      pruefen: "Kontrollera",
      fertig: "Klar",
      zurueck: "Tillbaka till övningen",
      ja: (wort: string) => `Ja: ${wort}`,
      zuKurz: "Lite längre - minst två bokstäver.",
      nichtImVorrat: "Alla de bokstäverna finns inte i ordet.",
      schonGehabt: "Det ordet har du redan.",
      dasQuellwort: "Det är själva ordet - hitta ett nytt.",
      keinWort: "Det ordet känner jag inte till.",
      name: "Namn räknas inte här - hitta ett annat ord.",
      wortHeisst: "Ordet är:",
      buchstaben: "Bokstäverna:",
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      gefundenVon: (n: number, ziel: number) => `Слова: ${n}/${ziel}`,
      neuesWort: "Нове слово",
      deineWoerter: "Твої слова",
      pruefen: "Перевірити",
      fertig: "Готово",
      zurueck: "Назад до тренування",
      ja: (wort: string) => `Так: ${wort}`,
      zuKurz: "Трохи довше - щонайменше дві літери.",
      nichtImVorrat: "Не всі ці літери є в слові.",
      schonGehabt: "Це слово вже є.",
      dasQuellwort: "Це саме вихідне слово - знайди нове.",
      keinWort: "Такого слова я не знаю.",
      name: "Імена тут не враховуються - пошукай інше слово.",
      wortHeisst: "Слово:",
      buchstaben: "Літери:",
    },
});

/**
 * Was die App zu einem Urteil SAGT - Auskunft, nie Wertung. In Teilen: Das
 * gefundene Wort ist INHALT (Übungssprache), der Rest Bedienung.
 */
function satzZu(urteil: SalatUrteil, ui: BedienSprache): TextTeil[] {
  const t = SALAT_TEXTE[ui];
  if (urteil.ok) return inTeile(t.ja(inhalt(urteil.wort)));
  switch (urteil.grund) {
    case "zu-kurz":
      return [{ text: t.zuKurz }];
    case "nicht-im-vorrat":
      return [{ text: t.nichtImVorrat }];
    case "schon-gehabt":
      return [{ text: t.schonGehabt }];
    case "das-quellwort":
      return [{ text: t.dasQuellwort }];
    case "name":
      return [{ text: t.name }];
    case "kein-wort":
    default:
      return [{ text: t.keinWort }];
  }
}

export function BuchstabensalatLauf({
  quellwort,
  ankuendigung,
  contextId,
  onAufgabeFertig,
  lang = "de",
  ziel = SALAT_ZIEL,
  zeichenabstand = 1,
  onFertig,
  onAbbruch,
}: {
  quellwort: string;
  ankuendigung: string;
  /** Kennung für die Telemetrie - wie `contextId` in der Übungssitzung. */
  contextId: string;
  /**
   * ★★★★ Jede geprüfte Eingabe melden - genau wie eine getippte Zeile.
   *
   * ⚠️ Ohne das ginge Übezeit VERLOREN: Der Zuwachs der Übezeit-Uhr wird nur
   * dort abgeholt, wo ein Ereignis geschrieben wird (`takePracticeDelta`), und
   * dieser Bildschirm schreibt keine Zeilen. Wer einen Buchstabensalat macht
   * und danach aufhört, hätte seine Minuten nie gespeichert.
   */
  onAufgabeFertig?: (e: Omit<TaskEvent, "ts">) => void;
  lang?: Lang;
  ziel?: number;
  /**
   * „Zeichenabstand groß (CVI)" - DERSELBE Wert wie in `TypingSession`
   * (19.09.2026, „überall"): Quellwort, Buchstabenvorrat, Eingabefeld und die
   * gefundenen Wörter bekommen die Laufweite; beim Schreiben dunkelt alles
   * ausser dieser Karte ab. Siehe `laufweiteText` in `zeichenabstand.ts`.
   */
  zeichenabstand?: ZeichenabstandFaktor;
  /** Beendet - mit der Zahl der gefundenen Wörter. */
  onFertig: (gefunden: number, ziel: number) => void;
  onAbbruch: () => void;
}) {
  const [eingabe, setEingabe] = useState("");
  const [gefunden, setGefunden] = useState<string[]>([]);
  const [rueckmeldung, setRueckmeldung] = useState<TextTeil[]>([]);
  const feldRef = useRef<HTMLInputElement>(null);
  /** Die Karte - beim CVI-Abdunkeln bleibt sie hell. */
  const karteRef = useRef<HTMLDivElement>(null);
  const feldId = useId();
  /** Wann die letzte Eingabe abgeschickt wurde - für die Dauer im Ereignis. */
  const beginnRef = useRef(Date.now());

  const insFeld = useCallback(() => {
    window.setTimeout(() => feldRef.current?.focus(), 0);
  }, []);

  /*
   * ★ EN4 (18.09.2026): Bedienung und Inhalt - siehe `wortspielSprache.tsx`.
   * Nicht gemischt läuft jede Zeile wie vor EN4 (ein Satz, eine `speakUi`).
   */
  const { ui, gemischt, bereichAktiv } = useWortspielSprache(lang);
  const t = SALAT_TEXTE[ui];
  const sprichTeile = useNacheinanderSprechen();
  /** Der Inhalt in seiner Sprache - ausgezeichnet, sobald der Sprachbereich aktiv ist. */
  const inhaltLang = bereichAktiv ? feinesLangAttribut(lang) : undefined;

  useEffect(() => {
    // Die Ankündigung ist Bedienung, das Quellwort Inhalt.
    // ★ 25.09.2026 (Testerin): „Baue aus dem Wort INSEL neue Wörter - und dann
    // noch mal die Buchstaben." Die Buchstaben nach dem Abc, wie im Feld.
    // ★ ES-W (27.09.2026): mit der Sprache - sonst fiele das ñ still weg.
    const buchstaben = [...salatBuchstaben(quellwort, lang)].join(", ");
    if (gemischt)
      sprichTeile([
        { text: `${ankuendigung} ${t.wortHeisst}`, lang: ui },
        { text: `${quellwort}.`, lang },
        { text: t.buchstaben, lang: ui },
        { text: `${buchstaben}.`, lang },
      ]);
    else speakUi(`${ankuendigung} ${t.wortHeisst} ${quellwort}. ${t.buchstaben} ${buchstaben}.`);
    insFeld();
    // Nur beim Aufbau - sonst spräche die Ankündigung bei jedem Fund erneut.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pruefen = useCallback(() => {
    notePracticeActivity();
    const urteil = pruefeSalatwort(eingabe, quellwort, gefunden, lang);
    const satz = satzZu(urteil, ui);
    setRueckmeldung(satz);
    if (gemischt) sprichTeile(sprechStuecke(satz, ui, lang));
    else speakUi(ausTeilen(satz));
    if (urteil.ok) setGefunden((g) => [...g, urteil.wort]);
    // Jede geprüfte Eingabe ist Übung - auch eine, die nicht gezählt hat.
    const jetzt = Date.now();
    onAufgabeFertig?.({
      lesson: contextId,
      chars: eingabe.trim().length,
      errors: urteil.ok ? 0 : 1,
      ms: Math.max(0, jetzt - beginnRef.current),
      activeMs: Math.round(takePracticeDelta(jetzt)),
      lang,
    });
    beginnRef.current = jetzt;
    setEingabe("");
    insFeld();
  }, [
    eingabe,
    quellwort,
    gefunden,
    lang,
    ui,
    gemischt,
    sprichTeile,
    insFeld,
    contextId,
    onAufgabeFertig,
  ]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        insFeld();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [insFeld]);

  return (
    <div ref={karteRef} className="card space-y-4 p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-xl font-semibold text-ink">{formName("buchstabensalat", ui)}</h2>
        <p className="text-base text-ink">{t.gefundenVon(gefunden.length, ziel)}</p>
      </div>

      {/* AUSNAHME (E7, §2.7): Das Quellwort ist der Übungsinhalt, nicht
          Beschriftung - bis `text-2xl` bleibt hier erlaubt.
          ★ CVI (19.09.2026): Quellwort, Vorrat, Feld und Fundliste tragen die
          Laufweite - nur sichtbar, kein Zeichen kommt dazu. */}
      <p
        lang={inhaltLang}
        className="text-2xl font-medium leading-snug text-ink"
        style={laufweiteText(zeichenabstand)}
      >
        {quellwort}
      </p>

      <div className="space-y-2">
        {/* Was das Feld ist, steht SICHTBAR darüber - nicht in der
            Beschriftung: Dort würde es vor dem Buchstabenvorrat stehen und ihn
            auf der Braillezeile nach rechts schieben. */}
        <p className="text-base text-ink" aria-hidden="true">
          {t.neuesWort}
        </p>
        {/* Die BESCHRIFTUNG ist der Buchstabenvorrat plus vier Leerzellen -
            Johannes' Vorgabe vom 02.09.2026. Eine Braillezeile zeigt sie
            unmittelbar vor dem Feldinhalt, das Kind hat den Vorrat also beim
            Schreiben unter den Fingern. `font-mono` + `tracking-wider`, damit
            auch ein sehendes Kind die einzelnen Buchstaben auseinanderhält. */}
        <label
          htmlFor={feldId}
          lang={inhaltLang}
          className="block font-mono text-base tracking-wider text-ink"
          style={laufweiteText(zeichenabstand)}
        >
          {salatFeldbeschriftung(quellwort, lang)}
        </label>
        <input
          ref={feldRef}
          id={feldId}
          lang={inhaltLang}
          type="text"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className="w-full rounded-xl border border-hairline bg-surface px-4 py-3 text-xl text-ink"
          // ★ CVI, 20.09.2026: Laufweite ja, Zeilenabstand nein - ein
          // einzeiliges Feld würde davon nur höher.
          style={laufweiteFeld(zeichenabstand)}
          value={eingabe}
          onChange={(e) => {
            notePracticeActivity();
            setEingabe(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              pruefen();
            }
          }}
        />
      </div>

      <p aria-live="polite" className="min-h-[1.5rem] text-base text-ink">
        <TeileText teile={rueckmeldung} lang={lang} gemischt={gemischt} />
      </p>

      {/* Die gefundenen Wörter als LISTE - eine Braillezeile liest sie Zeile
          für Zeile ab, und die Sprachausgabe meldet jeden Zuwachs. */}
      <div>
        <h3 className="text-base text-ink">{t.deineWoerter}</h3>
        <ul
          lang={inhaltLang}
          aria-live="polite"
          className="mt-1 flex flex-wrap gap-2"
          style={laufweiteText(zeichenabstand)}
        >
          {gefunden.map((w) => (
            <li
              key={w}
              className="rounded-lg border border-hairline px-2 py-1 text-base text-ink"
            >
              {w}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn-primary" onClick={pruefen}>
          {t.pruefen}
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => onFertig(gefunden.length, ziel)}
        >
          {t.fertig}
        </button>
        <button type="button" className="btn-secondary" onClick={onAbbruch}>
          {t.zurueck}
        </button>
      </div>

      {/* ★ CVI (19.09.2026, „überall"): beim Schreiben bleibt diese Karte
          hell - wie die Übungskarte in `TypingSession`. */}
      <CviAbdunkeln aktiv={zeichenabstand > 1} zielRef={karteRef} />
    </div>
  );
}
