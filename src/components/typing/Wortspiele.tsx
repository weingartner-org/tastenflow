/**
 * WORTSPIELE - der vierte Bereich neben „Mein Training", „Lektionen" und
 * „Geschichten" (Johannes, 01.09.2026).
 *
 * Sein Wortlaut: *„ich hab doch nur gesagt ich möchte sie AUCH in 'Mein
 * Training' - aber warum nicht ein eigener bereich. Die Frage ist, ob in
 * Lektionen oder ein bereich mit Wortspiele so wie Geschichten (mir vielleicht
 * lieber)."* - und danach das Ja.
 *
 * ★★★ Ein REGAL, kein Lehrgang. Ausdrücklich nicht unter „Lektionen": Die sind
 * ein Weg mit fester Reihenfolge. Hier nimmt man sich etwas heraus - dieselbe
 * Art Ort wie die Bücherei.
 *
 * ★★★ Was dieser Bereich NICHT tut: üben. Geübt wird im Lauf von „Mein
 * Training" (`AdaptiveTrainer` mit `startForm`). Ein eigener Übungslauf hiesse
 * Spielstand, Telemetrie, Buchstaben-Auswertung, Übezeit-Uhr und Abzeichen ein
 * zweites Mal - fünf Stellen, die von der ersten nichts wüssten.
 *
 * ★★ Was hier NICHT im Regal steht: das Geläufigkeitsschreiben. Es ist kein
 * Angebot, das man annehmen oder ablehnen kann, sondern eine Zeile je Runde im
 * gewöhnlichen Übungslauf. Ein Regalplatz dafür wäre ein Weg, der nirgends
 * hinführt.
 *
 * Barrierefreiheit:
 *  • Eine LISTE, kein Raster - eine Braillezeile liest sie Zeile für Zeile ab.
 *  • Jeder Platz trägt den ANKÜNDIGUNGSSATZ der Form, denselben Satz wie das
 *    Angebot auf der Abschluss-Karte. Für ein Kind mit Blindheit ist dieser
 *    Satz die ganze Information über das, was kommt - zwei verschiedene
 *    Fassungen desselben Angebots wären zwei Stellen, die auseinanderlaufen.
 *  • Der Anfangsfokus geht auf die Überschrift, nicht auf den ersten Knopf:
 *    So hört man zuerst, wo man ist (dieselbe Regel wie bei der
 *    Abschluss-Karte, F1 vom 31.08.).
 *  • Nichts ist je `disabled`. Formen, die der Tastenstand noch nicht hergibt,
 *    stehen gar nicht erst da - mit einem Satz, der sagt, warum.
 *
 * ★ D-8 (28.09.2026): Der erste Platz ist IMMER „Grundstellung prüfen" (alle
 * acht Grundtasten zugleich, `GrundstellungPruefen.tsx`) - auch bevor ein
 * Wortspiel offen ist, denn gerade ganz am Anfang wird es gebraucht. Esc oder
 * „Zurück" führen auf diesen Platz zurück.
 */
import { htmlLang } from "./htmlLang";
import { useEffect, useRef, useState } from "react";
import {
  UEBUNGSFORMEN,
  formHinweis,
  formName,
  type FormKontext,
  type UebungsformId,
} from "@/lib/typing/uebungsformen";
import { Tipp } from "@/components/Tipp";
import {
  SHIFT_UNIT,
  ensureIntroduced,
  type Lang,
  type Stufe,
  type TypingProgress,
} from "@/lib/typing";
import { texte, useBedienSprache } from "@/lib/bedienSprache";
// ★ E1 (24.09.2026): der Lernweg des Kindes steht in seinem Fortschritt.
import { lernwegVon, type Lernweg } from "@/lib/typing/lernweg";
import { franzVariante } from "@/lib/typing/franzVariante";
import { esVariante } from "@/lib/typing/esVariante";
import { grundstellungTitel } from "@/lib/typing/grundstellung";
import { GrundstellungPruefen } from "./GrundstellungPruefen";

/**
 * Die Texte des Regals in beiden Bedienungssprachen (EN4, 18.09.2026).
 * Deutsch wortgleich wie vorher.
 */
const REGAL_TEXTE = texte({
  de: {
    laedt: "Lädt …",
    titel: "Wortspiele",
    einleitung: "Nimm dir, was du magst. Alles hier kommt auch von selbst nach einer Übungsrunde.",
    nochLeer:
      "Die Wortspiele fangen an, sobald du ein paar Tasten mehr kannst. Üb weiter - sie warten hier.",
    // ★ D-8 (28.09.2026): „Grundstellung prüfen" steht immer im Regal.
    grundstellungTipp:
      "Alle acht Finger auf die Grundreihe, alle acht Tasten zugleich drücken - das Programm sagt dir, ob die Finger richtig liegen.",
  },
  en: {
    laedt: "Loading …",
    titel: "Word games",
    einleitung:
      "Pick whatever you like. Everything here also turns up by itself after a round of practice.",
    nochLeer:
      "The word games open up once you know a few more keys. Keep practising - they'll be waiting here.",
    grundstellungTipp:
      "All eight fingers on the home row, press all eight keys together - Tastenflow tells you whether your fingers are in the right place.",
  },
  fr: {
    laedt: "Chargement …",
    titel: "Jeux de lettres",
    einleitung: "Prends ce qui te plait. Tout ce qui est ici revient aussi tout seul après une série d'exercices.",
    nochLeer:
      "Les jeux de lettres s'ouvrent dès que tu sauras quelques touches de plus. Continue à t'exercer - ils t'attendent ici.",
    grundstellungTipp:
      "Les huit doigts sur la rangée de base, les huit touches en même temps - le programme te dit si tes doigts sont bien placés.",
  },
  es: {
    laedt: "Cargando …",
    titel: "Juegos de palabras",
    einleitung: "Toma lo que te guste. Todo lo que hay aquí también vuelve solo después de una serie de práctica.",
    nochLeer:
      "Los juegos de palabras se abren en cuanto domines algunas teclas más. Sigue practicando - aquí te esperan.",
    grundstellungTipp:
      "Los ocho dedos en la fila guía, las ocho teclas a la vez - el programa te dice si tus dedos están bien colocados.",
  },
  it: {
    laedt: "Caricamento in corso...",
    titel: "Giochi di parole",
    einleitung: "Prendi quello che ti piace. Tutto quello che c'è qui torna anche da solo dopo un giro di esercizio.",
    nochLeer:
      "I giochi di parole si aprono appena conosci alcuni tasti in più. Continua a esercitarti - qui ti aspettano.",
    grundstellungTipp:
      "Le otto dita sulla riga di base, gli otto tasti insieme - il programma ti dice se le tue dita sono al posto giusto.",
  },
  // ★ O-PL (02.10.2026): „Gry słowne", „rząd podstawowy" (Glossar §2.1/§2.3), ty.
  pl: {
    laedt: "Wczytywanie...",
    titel: "Gry słowne",
    einleitung: "Wybierz, co lubisz. Wszystko, co tu jest, pojawia się też samo po rundzie ćwiczeń.",
    nochLeer:
      "Gry słowne otwierają się, gdy znasz kilka klawiszy więcej. Ćwicz dalej - czekają tutaj.",
    grundstellungTipp:
      "Osiem palców na rzędzie podstawowym, osiem klawiszy naraz - program powie ci, czy palce są dobrze ułożone.",
  },
  // ★ O-TR (02.10.2026): "Kelime oyunları", "temel sıra" (Glossar §2.1/§2.3), sen.
  tr: {
    laedt: "Yükleniyor...",
    titel: "Kelime oyunları",
    einleitung: "Hangisini istersen seç. Buradakilerin hepsi bir alıştırma turundan sonra kendiliğinden de gelir.",
    nochLeer:
      "Kelime oyunları, birkaç tuş daha öğrendiğinde açılır. Çalışmaya devam et - burada seni bekliyorlar.",
    grundstellungTipp:
      "Sekiz parmağını temel sıraya koy, sekiz tuşa birlikte bas - program parmaklarının doğru yerde olup olmadığını söyler.",
  },
  // ★ O-CS (03.10.2026): „Slovní hry", „základní řada" (Glossar §2.1/§2.3), ty.
  cs: {
    laedt: "Načítá se...",
    titel: "Slovní hry",
    einleitung: "Vyber si, co tě baví. Všechno, co je tady, přijde i samo po kole cvičení.",
    nochLeer:
      "Slovní hry se otevřou, jakmile budeš umět pár dalších kláves. Cvič dál - čekají tady na tebe.",
    grundstellungTipp:
      "Všech osm prstů na základní řadu, všech osm kláves stisknout najednou - program ti řekne, jestli prsty leží správně.",
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      laedt: "Зареждане...",
      titel: "Игри с думи",
      einleitung:
        "Избери каквото ти харесва. Всичко тук идва и само след кръг упражнения.",
      nochLeer:
        "Игрите с думи започват, щом научиш още няколко клавиша. Упражнявай се още - те те чакат тук.",
      grundstellungTipp:
        "Всичките осем пръста на основния ред, натисни осемте клавиша едновременно - програмата ти казва дали пръстите са на място.",
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      laedt: "Φόρτωση...",
      titel: "Παιχνίδια λέξεων",
      einleitung:
        "Διάλεξε ό,τι σου αρέσει. Όλα αυτά έρχονται και από μόνα τους μετά από έναν γύρο εξάσκησης.",
      nochLeer:
        "Τα παιχνίδια λέξεων ανοίγουν μόλις μάθεις μερικά πλήκτρα ακόμα. Συνέχισε την εξάσκηση - σε περιμένουν εδώ.",
      grundstellungTipp:
        "Και τα οκτώ δάχτυλα στη βασική σειρά, πάτησε και τα οκτώ πλήκτρα μαζί - το Tastenflow σου λέει αν τα δάχτυλα είναι στη σωστή θέση.",
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      laedt: "Betöltés…",
      titel: "Szójátékok",
      einleitung: "Válassz, amit szeretnél. Minden, ami itt van, egy gyakorlókör után magától is előjön.",
      nochLeer:
        "A szójátékok akkor indulnak, amikor már néhány billentyűvel többet tudsz. Gyakorolj tovább - itt várnak rád.",
      grundstellungTipp:
        "Mind a nyolc ujjad az alapsorra, és nyomd meg egyszerre mind a nyolc billentyűt - a Tastenflow megmondja, jó helyen vannak-e az ujjaid.",
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      laedt: "Laden …",
      titel: "Woordspelletjes",
      einleitung: "Kies wat je leuk vindt. Alles hier komt ook vanzelf na een oefenronde.",
      nochLeer:
        "De woordspelletjes beginnen zodra je een paar toetsen meer kent. Oefen verder - ze wachten hier op je.",
      grundstellungTipp:
        "Alle acht vingers op de basisrij, alle acht toetsen tegelijk indrukken - Tastenflow vertelt je of je vingers goed liggen.",
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      laedt: "A carregar...",
      titel: "Jogos de palavras",
      einleitung:
        "Escolhe o que quiseres. Tudo o que está aqui também aparece por si depois de uma ronda de prática.",
      nochLeer:
        "Os jogos de palavras começam assim que souberes mais algumas teclas. Continua a praticar - ficam aqui à tua espera.",
      grundstellungTipp:
        "Os oito dedos na fila de base, prime as oito teclas ao mesmo tempo - o Tastenflow diz-te se os dedos estão no sítio certo.",
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      laedt: "Carregando...",
      titel: "Jogos de palavras",
      einleitung:
        "Escolha o que quiser. Tudo aqui também aparece automaticamente depois de uma rodada de prática.",
      nochLeer:
        "Os jogos de palavras começam quando você souber mais algumas teclas. Continue praticando - eles esperam por você aqui.",
      grundstellungTipp:
        "Os oito dedos na fileira central, pressione as oito teclas ao mesmo tempo - o Tastenflow diz se os dedos estão no lugar certo.",
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      laedt: "Se încarcă …",
      titel: "Jocuri cu cuvinte",
      einleitung:
        "Alege ce-ți place. Tot ce este aici apare și de la sine după o rundă de exersare.",
      nochLeer:
        "Jocurile cu cuvinte încep imediat ce știi încă câteva taste. Exersează mai departe - te așteaptă aici.",
      grundstellungTipp:
        "Toate cele opt degete pe șirul de bază, apasă toate cele opt taste deodată - Tastenflow îți spune dacă degetele sunt la locul lor.",
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      laedt: "Läser in...",
      titel: "Ordlekar",
      einleitung:
        "Välj det du vill. Allt här dyker också upp av sig självt efter en övningsomgång.",
      nochLeer:
        "Ordlekarna öppnas när du kan några fler tangenter. Fortsätt öva - de väntar här.",
      grundstellungTipp:
        "Alla åtta fingrar på grundraden, tryck på alla åtta tangenterna samtidigt - Tastenflow säger om fingrarna ligger rätt.",
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      laedt: "Завантаження...",
      titel: "Ігри зі словами",
      einleitung:
        "Бери, що подобається. Усе це з'являється й само після раунду тренування.",
      nochLeer:
        "Ігри зі словами почнуться, щойно ти знатимеш ще кілька клавіш. Тренуйся далі - вони чекають тут.",
      grundstellungTipp:
        "Усі вісім пальців на основний ряд, натисни всі вісім клавіш одночасно - програма скаже, чи правильно лежать пальці.",
    },
});

export function Wortspiele({
  loadFn,
  stufe,
  lang = "de",
  oneHand = false,
  onWaehlen,
  onZuMeinTraining,
  zuMeinTrainingName,
}: {
  /**
   * Der Spielstand - das Regal braucht den TASTENSTAND, denn er entscheidet,
   * welche Form überhaupt etwas bauen kann. Bewusst hier geladen und nicht von
   * der Seite hereingereicht: Sonst gäbe es zwei Stellen, die denselben Stand
   * kennen, und eine davon wäre irgendwann alt.
   */
  loadFn: () => Promise<TypingProgress>;
  stufe: Stufe;
  lang?: Lang;
  /** Kind mit dem Häkchen „Einhand schreiben". */
  oneHand?: boolean;
  onWaehlen: (id: UebungsformId) => void;
  /**
   * ★ 17.10.2026 (Johannes): Schalter OBEN im Regal zurück nach „Mein
   * Training" - mit der Beschriftung in der Bedienungssprache (die Seite
   * kennt die Wörter).
   */
  onZuMeinTraining?: () => void;
  zuMeinTrainingName?: string;
}) {
  /*
    ★ EN4 (18.09.2026): Welche Sprache spricht das Regal?
    · In Tastenflow (`bereichAktiv`): die Bedienung - alles.
    · Ohne aktiven Sprachbereich (ohne Provider): genau wie vor EN4.
      Überschrift und Sätze folgten der ÜBUNGSSPRACHE (`lang === "en"`), die
      Namen der Formen und „Lädt …" waren immer deutsch.
  */
  // ★ E11a-4 (26.09.2026): `spracheGewaehlt` statt der oberflächen-sicheren
  // `sprache` - REGAL_TEXTE, formName() und formHinweis() kennen „fr"
  // bereits seit E11a.
  const { spracheGewaehlt: sprache, bereichAktiv } = useBedienSprache();
  const saetze = REGAL_TEXTE[bereichAktiv ? sprache : lang];
  const namenSprache = bereichAktiv ? sprache : "de";
  const kopfRef = useRef<HTMLHeadingElement>(null);
  // ★ D-8 (28.09.2026): „Grundstellung prüfen" - offen oder nicht, und der
  // Platz, auf dem der Fokus danach wieder steht (Fokus-Ziel des Auswegs).
  const [grundstellungOffen, setGrundstellungOffen] = useState(false);
  const grundstellungKnopfRef = useRef<HTMLButtonElement>(null);
  const [introduced, setIntroduced] = useState<string[] | null>(null);
  // ★ E6a (24.09.2026): der Lernweg des Kindes - `taugt()` unten braucht ihn,
  // genau wie `introduced` (Bauplan §6.3 „Wortspiele: Gate über den Weg").
  const [lernweg, setLernweg] = useState<Lernweg>("de");
  useEffect(() => {
    let lebt = true;
    void loadFn().then((p) => {
      if (lebt) {
        setIntroduced(ensureIntroduced(p.introduced, lernwegVon(p)));
        setLernweg(lernwegVon(p));
      }
    });
    return () => {
      lebt = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    // Ausdrücklich per `setTimeout(0)`: Der auslösende Knopf (die Übungsart-
    // Auswahl) behält den Fokus sonst, und ein Wechsel im selben Takt kann von
    // ihm überschrieben werden.
    const t = window.setTimeout(() => kopfRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, []);

  if (introduced === null)
    return (
      <div className="card p-6 text-center text-ink-muted">{REGAL_TEXTE[namenSprache].laedt}</div>
    );

  if (grundstellungOffen)
    return (
      <GrundstellungPruefen
        lang={lang}
        onZurueck={() => {
          setGrundstellungOffen(false);
          // Zurück ins Regal, auf denselben Platz. Per `setTimeout(0)`: Der
          // Platz entsteht erst im nächsten Zeichnen.
          window.setTimeout(() => grundstellungKnopfRef.current?.focus(), 0);
        }}
      />
    );

  // ★ D-8: der erste Platz im Regal - immer da, auch vor dem ersten Wortspiel.
  const grundstellungPlatz = (
    <Tipp text={saetze.grundstellungTipp} className="w-full">
      {(hinweisId) => (
        <button
          ref={grundstellungKnopfRef}
          type="button"
          className="btn-secondary w-full justify-start text-left"
          aria-describedby={hinweisId}
          onClick={() => setGrundstellungOffen(true)}
        >
          {grundstellungTitel(namenSprache)}
        </button>
      )}
    </Tipp>
  );

  const ctx: FormKontext = {
    lernweg,
    introduced,
    shift: introduced.includes(SHIFT_UNIT),
    oneHand,
    stufe,
    lang,
    // ★ E11a-5 (aus E10d): die französische Landesvariante, nur auf Weg „fr".
    ...(lernweg === "fr" ? { franzVariante: franzVariante() } : {}),
    // ★ ES-F7 (27.09.2026): dieselbe Weitergabe für Weg „es".
    ...(lernweg === "es" ? { esVariante: esVariante() } : {}),
    count: 12,
    zufall: Math.random,
  };
  const offen = UEBUNGSFORMEN.filter((f) => f.taugt(ctx));

  return (
    // ★ 17.10.2026 (Johannes: „riesiges Fenster"): eine schlanke Spalte statt
    // der vollen Seitenbreite - dreizehn Knöpfe über 1150 px waren zu viel Weg
    // für die Augen.
    <div className="mx-auto w-full max-w-3xl space-y-3">
      {onZuMeinTraining && (
        <div lang={htmlLang(namenSprache)}>
          <button type="button" className="btn-secondary btn-umriss" onClick={onZuMeinTraining}>
            <span aria-hidden>{"\u2190 "}</span>
            {zuMeinTrainingName}
          </button>
        </div>
      )}
      <div className="card space-y-4 p-6" lang={htmlLang(namenSprache)}>
        <h2 ref={kopfRef} tabIndex={-1} className="m-0 text-xl font-semibold text-ink">
          {saetze.titel}
        </h2>
        <p className="m-0 text-sm text-ink-soft">{saetze.einleitung}</p>

        {offen.length === 0 ? (
          <>
            <p className="m-0 text-base text-ink-soft">{saetze.nochLeer}</p>
            {grundstellungPlatz}
          </>
        ) : (
          <ul className="m-0 list-none space-y-2 p-0">
            <li>{grundstellungPlatz}</li>
            {offen.map((f) => (
              <li key={f.id}>
                {/*
                  ★ Abnahme 02.09.2026 (Probelauf im Browser): Hier stand
                  zuerst der ANKÜNDIGUNGSSATZ der Form („Jetzt kommen
                  Alphabet-Reihen."). In einem Regal ist das falsch - es kommt
                  ja nichts, bevor man sich etwas nimmt.

                  ⚠️ Schwerer wog der zweite Grund: Manche Formen entscheiden
                  ihren Schwerpunkt beim Ankündigen („Jetzt kommen Wörter nur
                  für die rechte Hand"). Das Regal hätte damit etwas
                  versprochen, was die Runde danach nicht halten muss - sie
                  wird mit einem anderen Zufall gebaut. Angekündigt wird
                  deshalb erst beim Start, aus demselben Zusammenhang, aus dem
                  die Runde entsteht (siehe AdaptiveTrainer).

                  ★ K2 (19.09.2026): der NAME allein war für 13 kryptische
                  Knopfbeschriftungen („Zwillingsgriffe"? „Was fehlt hier?")
                  keine Erklärung - jetzt sagt ein Hinweis, WAS die Form ist
                  (nicht, was diese Runde konkret bringt - das bleibt der
                  Ankündigung vorbehalten, siehe oben).
                */}
                <Tipp text={formHinweis(f.id, namenSprache)} className="w-full">
                  {(hinweisId) => (
                    <button
                      type="button"
                      className="btn-secondary w-full justify-start text-left"
                      aria-describedby={hinweisId}
                      onClick={() => onWaehlen(f.id)}
                    >
                      {formName(f.id, namenSprache)}
                    </button>
                  )}
                </Tipp>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
