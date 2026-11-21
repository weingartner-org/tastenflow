/**
 * Tastenflow - „Tasten erkunden" / „Tasten finden" in der ITALIENISCHEN
 * Bedienung (★ O-IT, 02.10.2026, Bauplan italienischer Lehrgang §1.2 I11-I15,
 * Glossar `recherche-italienisch-2026-10-02/GLOSSAR-it.md`).
 *
 * Dieselbe Logik wie bei Deutsch, Englisch, Französisch und Spanisch:
 * `erkundeTaste` in `tastenErklaerung.ts` entscheidet weiter, WAS eine Taste
 * ist (Sondertaste, Zeichen, Kombination, dritter Layer, Totaste) und ob sie
 * geschluckt wird. Hier stehen nur die WÖRTER - dieselben Fächer wie in
 * `tastenErklaerungEs.ts`, Eintrag für Eintrag, NEU auf Italienisch
 * geschrieben (nicht übersetzt).
 *
 * ── Glossar (§2.1, §2.9) ────────────────────────────────────────────────────
 *  Windows (Italiano 141/142): Maiusc · Bloc Maiusc · Invio · Backspace · Canc ·
 *  Tab · Ctrl · Alt · Alt Gr · Esc · barra spaziatrice · Home · Fine · PgSu ·
 *  PgGiù · Ins · tasto Windows · tasto Menu. Mac: Maiuscole · Blocco maiuscole ·
 *  Elimina (Rücktaste) · Fn + Elimina (Entf) · Tabulatore · Control · Opzione ·
 *  Comando · Fn. Finger: mignolo, anulare, medio, indice, pollice (`fingers.ts`).
 *
 * ── Die Regeln der Sätze ────────────────────────────────────────────────────
 *  · Einfache Sprache, kurze Sätze, ein Kind ist gemeint: **tu** (I11).
 *  · Kein Schwa, kein Sternchen (I12). Nur Bindestrich `-`. Keine Maus-Wörter
 *    (premi, scegli). Jeder Satz endet mit einem Punkt. Der erste Satz von
 *    `was` beginnt klein - die Taste ist sein Subjekt („passa da un elemento
 *    all'altro").
 *  · Höchstens ein Ausrufezeichen je Meldung (Glossar Regel 1).
 *  · Die sechs Akzentbuchstaben `à è é ì ò ù` liegen auf der italienischen
 *    Tastatur auf eigenen Tasten (Bauplan §0) - ihre Erklärung sagt, wo man sie
 *    braucht. „E'" statt „È" ist KEIN Fehler, sondern ein freundlicher Hinweis
 *    (Bauplan I5): {@link HINWEIS_E_APOSTROFO_IT}.
 */
import type { Plattform } from "../computer/model";
import type { TastenName } from "../computer/tastenNamen";
import { spokenLabel } from "./fingers";
import { unitKind } from "./letters";
import type { LayoutId } from "./layouts";
import type { TastenErklaerung } from "./tastenErklaerung";

/**
 * ★ O-IT (02.10.2026): der lesbare italienische Name einer Lern-Einheit - für
 * die Lehrkraft-Statistik (`TastenflowReiter.tsx`), wie `unitLabelEs` in
 * `letters.ts` (die Datei bleibt in dieser Etappe unberührt, darum steht der
 * Zwilling hier). Zeichen über dieselbe Tabelle wie die Sprachausgabe
 * (`SPOKEN_IT`). „ß" bleibt „ß" (`toUpperCase()` gäbe „SS").
 */
export function unitLabelIt(unit: string): string {
  switch (unitKind(unit)) {
    case "shift":
      return "maiuscole";
    case "ziffer":
      return `numero ${unit}`;
    case "satzzeichen":
    case "sonderzeichen":
      return spokenLabel(unit, "it");
    default:
      if (unit === "ß") return "ß";
      return unit.toUpperCase() !== unit.toLowerCase() ? unit.toUpperCase() : spokenLabel(unit, "it");
  }
}

/**
 * ★ Bauplan I5: Wer statt „È" „E'" schreibt, hat nichts falsch gemacht - auf
 * Windows (Italiano 141/142) gibt es für die grosse È keinen Tastenweg. Der Satz
 * erklärt, ohne zu werten (Hausregel: nie etwas gegen ein Kind).
 */
export const HINWEIS_E_APOSTROFO_IT =
  "Su molte tastiere italiane la È maiuscola non ha un tasto. Si vede spesso E' come ripiego: " +
  "va bene così, la forma giusta però è È.";

/* ══ Sondertasten ═══════════════════════════════════════════════════════════ */

/** Italienische Sondertaste nach der Kennung aus dem Tasten-Wörterbuch. */
export function sondertasteIt(
  id: string,
  plattform: Plattform,
  _layout: LayoutId = "it",
): TastenErklaerung | null {
  const mac = plattform === "macos";
  const pfeilWort = mac ? "Opzione" : "Ctrl";
  switch (id) {
    case "tabulator":
      return {
        kurz: "Tab",
        name: mac ? "tasto Tabulatore" : "tasto di tabulazione",
        was: [
          "passa da un elemento all'altro, per esempio a un link, a una casella o a un pulsante.",
          `Con ${mac ? "Maiuscole" : "Maiusc"} torna indietro.`,
        ],
      };
    case "eingabe":
    case "zeilenschalter":
      return mac
        ? {
            kurz: "Invio",
            name: "tasto Invio",
            was: ["conferma e invia.", "Apre i link e in un testo inizia una nuova riga."],
          }
        : {
            kurz: "Invio",
            name: "tasto Invio",
            was: [
              "conferma e invia.",
              "Apre i link, attiva i pulsanti e in un testo inizia una nuova riga.",
            ],
          };
    case "leertaste":
      return {
        kurz: null,
        name: "barra spaziatrice",
        was: ["mette uno spazio tra due parole.", "Attiva anche i pulsanti e seleziona le caselle."],
      };
    case "loeschtaste":
      return {
        kurz: null,
        name: mac ? "tasto Elimina" : "tasto Backspace",
        was: ["cancella il carattere a sinistra del cursore.", "Così si corregge un tasto sbagliato."],
      };
    case "entf":
      return mac
        ? {
            kurz: null,
            name: "tasto Canc",
            was: [
              "cancella il carattere a destra del cursore.",
              "Se la tua tastiera non ce l'ha, premi Fn ed Elimina insieme.",
            ],
          }
        : {
            kurz: "Canc",
            name: "tasto Canc",
            was: ["cancella il carattere a destra del cursore.", "Cancella anche i file selezionati."],
          };
    case "esc":
      return {
        kurz: "Esc",
        name: "tasto Esc",
        was: [
          "annulla.",
          "Chiude menu, finestre e messaggi.",
          "In Tastenflow ti riporta al campo di scrittura.",
        ],
      };
    case "umschalt":
      return {
        kurz: mac ? "Maiuscole" : "Maiusc",
        name: mac ? "tasto Maiuscole" : "tasto Maiusc",
        was: [
          "scrive le lettere maiuscole finché lo tieni premuto.",
          "Dà anche il carattere in alto su un tasto, per esempio il punto interrogativo.",
        ],
      };
    case "feststell":
      return {
        kurz: mac ? "Blocco maiuscole" : "Bloc Maiusc",
        name: mac ? "tasto Blocco maiuscole" : "tasto Bloc Maiusc",
        was: ["scrive tutto in maiuscolo finché non lo premi di nuovo."],
      };
    case "pfeil-links":
      return {
        kurz: null,
        name: "freccia sinistra",
        was: ["sposta il cursore di un carattere a sinistra.", `Con ${pfeilWort} salta una parola intera.`],
      };
    case "pfeil-rechts":
      return {
        kurz: null,
        name: "freccia destra",
        was: ["sposta il cursore di un carattere a destra.", `Con ${pfeilWort} salta una parola intera.`],
      };
    case "pfeil-auf":
      return {
        kurz: null,
        name: "freccia su",
        was: ["sposta il cursore di una riga in su.", "In elenchi e menu sale di una voce.", `Con ${pfeilWort} salta un paragrafo in su.`],
      };
    case "pfeil-ab":
      return {
        kurz: null,
        name: "freccia giù",
        was: ["sposta il cursore di una riga in giù.", "In elenchi e menu scende di una voce.", `Con ${pfeilWort} salta un paragrafo in giù.`],
      };
    case "pos1":
      return {
        kurz: "Home",
        name: "tasto Home",
        was: ["va all'inizio della riga.", "In una pagina web va in cima.", "Con Ctrl va all'inizio di tutto il testo."],
      };
    case "ende":
      return {
        kurz: "Fine",
        name: "tasto Fine",
        was: ["va alla fine della riga.", "In una pagina web va in fondo.", "Con Ctrl va alla fine di tutto il testo."],
      };
    case "bild-auf":
      return {
        kurz: "PgSu",
        name: "tasto Pagina su",
        was: ["sale di una schermata."],
      };
    case "bild-ab":
      return {
        kurz: "PgGiù",
        name: "tasto Pagina giù",
        was: ["scende di una schermata."],
      };
    case "einfg":
      return {
        kurz: "Ins",
        name: "tasto Ins",
        was: [
          "è il tasto del lettore di schermo in NVDA e JAWS.",
          "Molti comandi del lettore di schermo iniziano con questo tasto.",
        ],
      };
    case "strg":
      return {
        kurz: "Ctrl",
        name: "tasto Ctrl",
        was: [
          "serve per le scorciatoie da tastiera.",
          "Ctrl + C copia, Ctrl + V incolla, Ctrl + Z annulla.",
          "Da solo fa tacere la voce.",
        ],
      };
    case "alt":
      return {
        kurz: null,
        name: "tasto Alt",
        was: [
          "serve per le scorciatoie da tastiera.",
          "Alt + Tab passa da una finestra all'altra.",
          "In Tastenflow, Alt + H apre l'aiuto.",
        ],
      };
    case "altgr":
      return {
        kurz: "Alt Gr",
        name: "tasto Alt Gr",
        was: ["scrive il terzo carattere di un tasto, per esempio la chiocciola o il simbolo dell'euro."],
      };
    case "windows-taste":
      return {
        kurz: "Win",
        name: "tasto Windows",
        was: [
          "apre il menu Start.",
          "Premilo ancora una volta per chiuderlo.",
          "Con altri tasti fa altre cose, per esempio Win + D mostra il desktop.",
        ],
      };
    case "befehlstaste":
      return {
        kurz: "cmd",
        name: "tasto Comando",
        was: ["serve per le scorciatoie da tastiera.", "cmd + C copia, cmd + V incolla, cmd + Z annulla."],
      };
    case "wahltaste":
      return {
        kurz: "Opzione",
        name: "tasto Opzione",
        was: ["scrive simboli, per esempio la chiocciola.", "Con le frecce salta una parola intera."],
      };
    case "ctrl":
      return {
        kurz: "ctrl",
        name: "tasto Control",
        was: ["fa parte delle scorciatoie da tastiera sul Mac.", "Da solo fa tacere VoiceOver."],
      };
    case "fn":
      return {
        kurz: "fn",
        name: "tasto Fn",
        was: ["dà un secondo compito ad altri tasti, per esempio alzare e abbassare il volume."],
      };
    default:
      return null;
  }
}

/**
 * Wie die Taste in einer KOMBINATION und gross in der Mitte heisst - kurz,
 * wie sie auf der Kappe steht („Ctrl + Home", „Maiusc + Tab").
 */
export const TASTE_KURZ_IT: Readonly<Record<string, string>> = {
  tabulator: "Tab",
  eingabe: "Invio",
  zeilenschalter: "Invio",
  leertaste: "Barra spaziatrice",
  loeschtaste: "Backspace",
  entf: "Canc",
  esc: "Esc",
  umschalt: "Maiusc",
  feststell: "Bloc Maiusc",
  "pfeil-links": "Freccia sinistra",
  "pfeil-rechts": "Freccia destra",
  "pfeil-auf": "Freccia su",
  "pfeil-ab": "Freccia giù",
  pos1: "Home",
  ende: "Fine",
  "bild-auf": "PgSu",
  "bild-ab": "PgGiù",
  einfg: "Ins",
  strg: "Ctrl",
  alt: "Alt",
  altgr: "Alt Gr",
  "windows-taste": "Win",
  befehlstaste: "cmd",
  wahltaste: "Opzione",
  ctrl: "ctrl",
  fn: "fn",
};

/* ══ Tasten ausserhalb des Wörterbuchs ═════════════════════════════════════ */

const F_TASTEN_WINDOWS_IT: Readonly<Record<string, readonly string[]>> = {
  F1: ["apre l'aiuto in molti programmi."],
  F2: ["rinomina un file selezionato."],
  F3: ["avvia una ricerca."],
  F4: ["chiude la finestra se premi Alt insieme."],
  F5: ["ricarica una pagina web.", "Qui non succede niente, così puoi continuare a esplorare."],
  F6: ["va alla barra degli indirizzi del browser."],
  F7: ["controlla l'ortografia in Word."],
  F10: ["va alla barra dei menu in molti programmi."],
  F11: ["attiva e disattiva lo schermo intero nel browser.", "Sul portatile spesso insieme al tasto Fn."],
  F12: ["apre la finestra Salva con nome in Word."],
};

/** Italienisch zu `nachKey` - F-Tasten, Bloc Num, Menü-Taste, Lautstärke, Totaste. */
export function nachKeyIt(
  key: string,
  plattform: Plattform,
  layout: LayoutId = "it",
): TastenErklaerung | null {
  const f = /^F([1-9]|1[0-9]|2[0-4])$/.exec(key);
  if (f) {
    const was =
      plattform === "macos"
        ? [
            "ha un compito proprio in alcuni programmi.",
            "Sul Mac questi tasti regolano spesso la luminosità e il volume.",
          ]
        : (F_TASTEN_WINDOWS_IT[key] ?? ["ha un compito proprio in alcuni programmi."]);
    return { kurz: key, name: "tasto funzione", was };
  }
  switch (key) {
    case "Home":
      return sondertasteIt("pos1", "windows", layout);
    case "End":
      return sondertasteIt("ende", "windows", layout);
    case "PageUp":
      return sondertasteIt("bild-auf", "windows", layout);
    case "PageDown":
      return sondertasteIt("bild-ab", "windows", layout);
    case "Insert":
      return sondertasteIt("einfg", "windows", layout);
    case "NumLock":
      return {
        kurz: null,
        name: "tasto Bloc Num",
        was: ["attiva e disattiva i numeri del tastierino numerico."],
      };
    // ★ Testerin 24.10.2026: Numpad 5 bei Num aus (`Clear`) - Vorgabe, ungeprüft von Muttersprachlern.
    case "Clear":
      return {
        kurz: "5",
        name: "tasto 5 del tastierino numerico",
        was: ["scrive 5 quando Bloc Num è attivo.", "Ora Bloc Num è disattivato, quindi non fa niente."],
      };
    case "ContextMenu":
      return {
        kurz: null,
        name: "tasto Menu",
        was: ["apre un menu con i comandi per il punto in cui ti trovi.", "Maiusc + F10 fa lo stesso."],
      };
    case "PrintScreen":
      return { kurz: null, name: "tasto Stamp", was: ["fa un'immagine dello schermo.", "Su Windows spesso apre uno strumento per le schermate.", "Esc lo chiude."] };
    case "ScrollLock":
      return { kurz: null, name: "tasto Bloc Scorr", was: ["oggi non serve quasi mai."] };
    case "Pause":
      return { kurz: null, name: "tasto Pausa", was: ["oggi non serve quasi mai."] };
    case "AudioVolumeUp":
      return { kurz: null, name: "tasto Alza volume", was: ["alza il suono."] };
    case "AudioVolumeDown":
      return { kurz: null, name: "tasto Abbassa volume", was: ["abbassa il suono."] };
    case "AudioVolumeMute":
      return { kurz: null, name: "tasto Disattiva audio", was: ["toglie il suono e lo rimette."] };
    case "Fn":
      return sondertasteIt("fn", plattform, layout);
    case "Dead":
      return {
        kurz: null,
        name: "tasto morto",
        was: [
          "mette un segno sulla lettera successiva, per esempio l'accento sulla e.",
          "Il segno compare solo con la lettera successiva.",
        ],
      };
    default:
      return null;
  }
}

/* ══ Totasten mit Zusatzbezeichnung ═════════════════════════════════════════ */

const ERSCHEINT_SPAETER_IT = "Il segno compare solo con la lettera successiva.";

/**
 * Die vier bekannten Akzente - nach derselben Kennung wie die deutsche Tabelle.
 * Auf der italienischen Tastatur gibt es KEINE Totaste (Bauplan §0); sie
 * kommen auf den Schweizer Tastaturen vor (Tessin, Bauplan I10).
 */
export const AKZENTE_IT: Readonly<Record<"zirkumflex" | "akut" | "gravis" | "trema", { name: string; was: readonly string[] }>> = {
  zirkumflex: {
    name: "accento circonflesso",
    was: ["mette un piccolo cappello sulla lettera successiva, per esempio â.", ERSCHEINT_SPAETER_IT],
  },
  akut: {
    name: "accento acuto",
    was: ["mette l'accento acuto sulla lettera successiva, per esempio é.", ERSCHEINT_SPAETER_IT],
  },
  gravis: {
    name: "accento grave",
    was: ["mette l'accento grave sulla lettera successiva, per esempio à, ì o ò.", ERSCHEINT_SPAETER_IT],
  },
  trema: {
    name: "dieresi",
    was: ["mette due puntini sulla lettera successiva, per esempio ü.", ERSCHEINT_SPAETER_IT],
  },
};

/* ══ Zeichen ════════════════════════════════════════════════════════════════ */

const PROGRAMMIEREN_IT = ["serve per programmare."] as const;

/**
 * Dieselben Zeichen wie `ZEICHEN` in `tastenErklaerung.ts`. Der Name kommt
 * aus `spokenLabel(ch, "it")`; `name` steht nur, wo er anders heissen soll.
 * Dazu die sechs Akzentbuchstaben der italienischen Tastatur und `ç °  §`
 * (Maiusc + ò, à, ù auf Italiano 141).
 */
export const ZEICHEN_IT: Readonly<Record<string, { name?: string; was: readonly string[] }>> = {
  ".": { was: ["va alla fine di una frase."] },
  ",": { was: ["separa le parti di una frase."] },
  "?": { was: ["chiude una domanda."] },
  "!": { was: ["chiude un'esclamazione."] },
  ":": { was: ["annuncia qualcosa, per esempio un elenco."] },
  ";": { was: ["separa due parti di una frase, più di una virgola."] },
  "-": { was: ["unisce due parole, per esempio in italo-svizzero."] },
  "@": { was: ["c'è in tutti gli indirizzi email."] },
  "+": { was: ["significa più in un calcolo.", "In una scorciatoia da tastiera significa premere insieme."] },
  "*": { was: ["significa per in informatica, quando si moltiplica."] },
  "/": { was: ["significa diviso in informatica.", "Si trova anche negli indirizzi internet."] },
  "=": { was: ["va prima del risultato di un calcolo."] },
  "'": {
    name: "apostrofo",
    was: [
      "segna una lettera che manca, per esempio in l'amico, un'amica, dell'acqua.",
      "Sulla tastiera italiana ha un tasto suo, a destra dello 0.",
    ],
  },
  '"': { name: "virgolette", was: ["vanno prima e dopo quello che dice qualcuno."] },
  "«": { name: "virgolette basse aperte", was: ["aprono quello che dice qualcuno."] },
  "»": { name: "virgolette basse chiuse", was: ["chiudono quello che dice qualcuno."] },
  "(": { name: "parentesi aperta", was: ["inizia qualcosa che si aggiunge."] },
  ")": { name: "parentesi chiusa", was: ["chiude quello che si è aggiunto."] },
  "%": { name: "percento", was: ["significa su cento, per esempio 50%."] },
  "&": { name: "e commerciale", was: ["significa e."] },
  "#": {
    name: "cancelletto",
    was: ["indica un numero, per esempio #1, e serve per gli hashtag sui social."],
  },
  "€": { name: "euro", was: ["è il simbolo dell'euro."] },
  $: { was: ["è il simbolo del dollaro."] },
  "£": { was: ["è il simbolo della sterlina."] },
  "§": { was: ["seguito da un numero, indica un paragrafo di un testo, per esempio § 3."] },
  "°": { was: ["indica i gradi, per esempio della temperatura."] },
  "<": { name: "minore", was: ["confronta due numeri: quello a sinistra è più piccolo."] },
  ">": { name: "maggiore", was: ["confronta due numeri: quello a sinistra è più grande."] },
  _: { name: "trattino basso", was: ["compare spesso negli indirizzi email e nei nomi dei file."] },
  "^": { was: ["significa elevato a in un calcolo, per esempio 2 elevato a 3."] },
  "²": { name: "elevato al quadrato", was: ["serve per le superfici, per esempio i metri quadrati."] },
  "³": { name: "elevato al cubo", was: ["serve per i volumi, per esempio i metri cubi."] },
  "[": { was: PROGRAMMIEREN_IT },
  "]": { was: PROGRAMMIEREN_IT },
  "{": { was: PROGRAMMIEREN_IT },
  "}": { was: PROGRAMMIEREN_IT },
  "\\": { was: PROGRAMMIEREN_IT },
  "|": { was: PROGRAMMIEREN_IT },
  "~": { was: PROGRAMMIEREN_IT },
  "´": { name: "accento acuto", was: ["mette l'accento acuto su una vocale."] },
  "`": { name: "accento grave", was: ["mette l'accento grave su una lettera."] },
  "¨": { name: "dieresi", was: ["mette due puntini su una lettera."] },
  // ★★★ die sechs Akzentbuchstaben - Bauplan I3, I5, Falle 4: wo man sie braucht,
  // und dass ohne Akzent oft ein ANDERES Wort entsteht (è/e, sì/si, là/la).
  à: { was: ["si trova in fondo a molte parole, per esempio città, papà, già.", "Con o senza accento: là e la sono parole diverse."] },
  è: {
    was: [
      "è il verbo essere: il cielo è blu. Si trova anche in caffè e tè.",
      "Con o senza accento: è ed e sono parole diverse.",
      HINWEIS_E_APOSTROFO_IT,
    ],
  },
  é: { was: ["si trova in perché, poiché, né e sé.", "Ascolta bene: è ed é si dicono in modo diverso."] },
  ì: { was: ["si trova in fondo ad alcune parole, per esempio sì, così, lunedì.", "Con o senza accento: sì e si sono parole diverse."] },
  ò: { was: ["si trova in fondo ad alcune parole, per esempio però, può, andrò."] },
  ù: { was: ["si trova in fondo ad alcune parole, per esempio più, giù, virtù."] },
  ç: { name: "c con cediglia", was: ["si usa in parole di altre lingue, per esempio in francese o in portoghese."] },
};

/** Der italienische Name eines Zeichens - aus der Tabelle oder `spokenLabel`. */
export function zeichenNameIt(ch: string): string {
  return ZEICHEN_IT[ch]?.name ?? spokenLabel(ch, "it");
}

/* ══ Kombinationen ═════════════════════════════════════════════════════════ */

/** Wo eine Wirkung gilt - italienisch. */
export const ORT_IT: Readonly<Record<string, string>> = {
  explorer: "in Esplora file",
  finder: "nel Finder",
  word: "in Word",
  excel: "in Excel",
  browser: "nel browser",
  teams: "in Teams",
  powerpoint: "in PowerPoint",
  outlook: "in Outlook",
  bedienungshilfen: "nel lettore di schermo",
};

/** Die kleine eigene Liste der deutschen Datei, italienisch. */
export const EIGENE_KOMBINATIONEN_IT: Readonly<Record<Plattform, readonly { keys: string; was: string }[]>> = {
  windows: [
    { keys: "Umschalt+Tab", was: "torna all'elemento precedente." },
    { keys: "Strg+P", was: "apre la finestra di stampa." },
  ],
  macos: [
    { keys: "Umschalt+Tab", was: "torna all'elemento precedente." },
    { keys: "Cmd+P", was: "apre la finestra di stampa." },
  ],
};

/**
 * Was ein Kürzel BEWIRKT - italienisch, nach der Kennung der Wirkung im
 * Kürzel-Katalog von »Im Griff« (`lib/computer/kuerzelWirkung.ts`, dort nur
 * gelesen). Fehlt eine Kennung, sagt die Zeile, dass es vom Programm abhängt.
 */
export function wirkungIt(id: string, _plattform: Plattform): string | null {
  return WIRKUNG_IT[id] ?? null;
}

const WIRKUNG_IT: Readonly<Record<string, string>> = {
  kopieren: "Copia",
  einfuegen: "Incolla",
  ausschneiden: "Taglia",
  rueckgaengig: "Annulla",
  wiederherstellen: "Ripristina quello che è stato annullato",
  "alles-markieren": "Seleziona tutto",
  "markieren-zeichen": "Seleziona carattere per carattere",
  "markieren-wort": "Seleziona parola per parola",
  "spalte-markieren": "Seleziona tutta la colonna",
  "zeile-markieren": "Seleziona tutta la riga",
  oeffnen: "Apri",
  umbenennen: "Rinomina",
  "neuer-ordner": "Crea una nuova cartella",
  papierkorb: "Sposta nel cestino",
  duplizieren: "Fai una seconda copia dello stesso file",
  "ebene-hoeher": "Sali di un livello",
  adressleiste: "Vai alla barra degli indirizzi",
  eigenschaften: "Mostra le proprietà",
  uebersicht: "Apri l'anteprima, uno sguardo senza aprire il file",
  bewegen: "Sposta il file dove deve andare (sparisce dal posto di prima)",
  "ansicht-details": `Passa alla visualizzazione "Dettagli"`,
  speichern: "Salva",
  "speichern-unter": "Salva con nome, con un altro nome o in un altro posto",
  fett: "Metti in grassetto",
  kursiv: "Metti in corsivo",
  unterstreichen: "Sottolinea",
  ueberschrift1: "Applica il titolo 1",
  ueberschrift2: "Applica il titolo 2",
  "standard-format": `Applica lo stile "Normale"`,
  links: "Allinea a sinistra",
  zentriert: "Centra",
  zeilenumbruch: "Va a capo nello stesso paragrafo",
  rechtschreibung: "Avvia il controllo ortografico",
  fensterbereiche: "Passa da una parte all'altra della finestra",
  suchen: "Trova",
  ersetzen: "Trova e sostituisci",
  "gehe-zu-zelle": "Vai a una cella precisa",
  "zelle-bearbeiten": "Continua a scrivere nella cella",
  "zelle-formatieren": `Apri la finestra "Formato celle"`,
  "zum-rand": "Vai al bordo dei dati",
  autosumme: "Inserisci la somma automatica",
  "ausfuellen-unten": "Riempi verso il basso",
  "ausfuellen-rechts": "Riempi verso destra",
  "absoluter-bezug": "Blocca un riferimento (riferimento assoluto con il simbolo del dollaro)",
  datum: "Inserisci la data di oggi",
  uhrzeit: "Inserisci l'ora attuale",
  kommentar: "Inserisci un commento",
  autofilter: "Attiva e disattiva il filtro automatico",
  blattwechsel: "Passa a un altro foglio di lavoro",
  "neues-blatt": "Inserisci un nuovo foglio di lavoro",
  "neu-laden": "Ricarica la pagina",
  lesezeichen: "Aggiungi un segnalibro",
  verlauf: "Apri la cronologia",
  senden: "Invia il messaggio",
  "nachricht-loeschen": "Elimina il messaggio",
  "sr-stopp": "Ferma la voce",
};

/** „a, b e c" - die italienische Aufzählung. */
export function aufzaehlungIt(teile: readonly string[]): string {
  if (teile.length <= 1) return teile[0] ?? "";
  return `${teile.slice(0, -1).join(", ")} e ${teile[teile.length - 1]}`;
}

/** Die festen Wörter des Erkundens, italienisch. */
export const ERKUNDEN_WOERTER_IT = {
  kombination: "combinazione di tasti",
  kombiUnbekannt: "quello che fa dipende dal programma.",
  mit: "Con",
  akzentTaste: "tasto dell'accento",
  unbekannt: "Non riconosco questo tasto.",
  taste: (key: string) => `Tasto ${key}`,
} as const;

/* ══ „Tasten finden" ════════════════════════════════════════════════════════
 *
 * Die Sätze der Suchrunde (`lib/computer/tastenSuche.ts`) italienisch - WAS
 * geschieht, entscheidet weiter `suchSchritt`; hier wird nur gesagt.
 * ═══════════════════════════════════════════════════════════════════════════ */

interface TasteIt {
  /** Im Satz, mit Artikel: „Trova il tasto Tab." */
  nennung: string;
  /** Wo sie liegt - als Weg für eine Hand, nie als Bild. */
  lage: string;
  /** Zusatz nach der Bestätigung (heute nur die Feststelltaste). */
  achtung?: string;
}

const SECHSERBLOCK_IT = "Nel blocco di sei tasti sopra le frecce";

/** Die Tasten der Suchrunde, italienisch - nach derselben Kennung wie das Wörterbuch. */
const TASTEN_IT: Readonly<Record<string, TasteIt | ((plattform: Plattform) => TasteIt)>> = {
  tabulator: {
    nennung: "il tasto Tab",
    lage: "Mignolo sinistro: una riga più in alto, sul bordo.",
  },
  "pfeil-links": {
    nennung: "la freccia sinistra",
    lage: "In basso a destra, tra le frecce: quella a sinistra.",
  },
  "pfeil-rechts": {
    nennung: "la freccia destra",
    lage: "In basso a destra, tra le frecce: quella a destra.",
  },
  "pfeil-auf": {
    nennung: "la freccia su",
    lage: "In basso a destra, tra le frecce: quella in alto.",
  },
  "pfeil-ab": {
    nennung: "la freccia giù",
    lage: "In basso a destra, tra le frecce: sotto la freccia su.",
  },
  pos1: {
    nennung: "il tasto Home",
    lage: `${SECHSERBLOCK_IT}, in alto al centro. Su un portatile, spesso con Fn.`,
  },
  ende: {
    nennung: "il tasto Fine",
    lage: `${SECHSERBLOCK_IT}, in basso al centro. Su un portatile, spesso con Fn.`,
  },
  "bild-auf": {
    nennung: "il tasto PgSu",
    lage: `${SECHSERBLOCK_IT}, in alto a destra. Su un portatile, spesso con Fn.`,
  },
  "bild-ab": {
    nennung: "il tasto PgGiù",
    lage: `${SECHSERBLOCK_IT}, in basso a destra. Su un portatile, spesso con Fn.`,
  },
  leertaste: {
    nennung: "la barra spaziatrice",
    lage: "Il tasto lungo sotto i tuoi pollici.",
  },
  eingabe: {
    nennung: "il tasto Invio",
    lage: "Mano destra, sul bordo: il tasto grande.",
  },
  zeilenschalter: {
    nennung: "il tasto Invio",
    lage: "Mano destra, sul bordo: il tasto grande.",
  },
  loeschtaste: (plattform) => ({
    nennung: plattform === "macos" ? "il tasto Elimina" : "il tasto Backspace",
    lage: "Mano destra, sul bordo, due righe più in alto.",
  }),
  entf: (plattform) =>
    plattform === "macos"
      ? {
          nennung: "il tasto Canc",
          lage: "Solo sulle tastiere grandi, vicino a Invio. Altrimenti Fn ed Elimina.",
        }
      : {
          nennung: "il tasto Canc",
          lage: `${SECHSERBLOCK_IT}, in basso a sinistra. Su un portatile, in alto a destra.`,
        },
  esc: {
    nennung: "il tasto Esc",
    lage: "Nell'angolo in alto a sinistra.",
  },
  umschalt: (plattform) => ({
    nennung: plattform === "macos" ? "il tasto Maiuscole" : "il tasto Maiusc",
    lage: "Ce ne sono due: a sinistra e a destra, nell'ultima riga di lettere.",
  }),
  feststell: (plattform) => ({
    nennung: plattform === "macos" ? "il tasto Blocco maiuscole" : "il tasto Bloc Maiusc",
    lage: "Mignolo sinistro: un passo a sinistra.",
    achtung: "Ora scrivi in maiuscolo? Premilo di nuovo.",
  }),
  strg: {
    nennung: "il tasto Ctrl",
    lage: "Nell'angolo in basso a sinistra.",
  },
  alt: { nennung: "il tasto Alt", lage: "In basso, a sinistra della barra spaziatrice." },
  altgr: {
    nennung: "il tasto Alt Gr",
    lage: "In basso, a destra della barra spaziatrice.",
  },
  "windows-taste": {
    nennung: "il tasto Windows",
    lage: "In basso a sinistra, tra Ctrl e Alt.",
  },
  einfg: {
    nennung: "il tasto Ins",
    lage: `${SECHSERBLOCK_IT}, in alto a sinistra, sopra Canc. Sui portatili spesso manca.`,
  },
  befehlstaste: {
    nennung: "il tasto Comando",
    lage: "In basso a sinistra, proprio accanto alla barra spaziatrice.",
  },
  wahltaste: {
    nennung: "il tasto Opzione",
    lage: "In basso a sinistra, il terzo tasto dal bordo.",
  },
  ctrl: {
    nennung: "il tasto Control",
    lage: "In basso a sinistra, il secondo tasto dal bordo.",
  },
  fn: {
    nennung: "il tasto Fn",
    lage: `In basso a sinistra, il primo tasto, nell'angolo. Su un MacBook c'è scritto "fn".`,
  },
};

function tasteIt(t: TastenName, plattform: Plattform): TasteIt {
  const e = TASTEN_IT[t.id];
  if (typeof e === "function") return e(plattform);
  // Sicherheitsnetz: eine neue Wörterbuch-Taste ohne italienischen Eintrag.
  return e ?? { nennung: t.kurz ?? t.name, lage: "" };
}

/** „il tasto Tab" - wie eine Taste im Satz heisst. */
export function tastenNennungIt(t: TastenName, plattform: Plattform): string {
  return tasteIt(t, plattform).nennung;
}

/** Nur die Lage - oder "" (wie bei den anderen Sprachen). */
export function tastenLageIt(t: TastenName, plattform: Plattform): string {
  return tasteIt(t, plattform).lage;
}

/** Der Auftrag beim Suchen: „Trova il tasto Tab. Mignolo sinistro …" */
export function ansageSuchauftragIt(t: TastenName, plattform: Plattform): string {
  const e = tasteIt(t, plattform);
  return e.lage ? `Trova ${e.nennung}. ${e.lage}` : `Trova ${e.nennung}.`;
}

/** Erster Treffer - erst die Wiederholung zählt. „Ci sei" passt zu jedem Tasten-Geschlecht. */
export function ansageGefundenIt(t: TastenName, plattform: Plattform): string {
  return `Ci sei! Premi un altro tasto, poi di nuovo ${tastenNennungIt(t, plattform)}.`;
}

/** Nach der Bestätigung - und, wo nötig, die Warnung (Feststelltaste). */
export function ansageBestaetigtIt(t: TastenName, plattform: Plattform): string {
  const e = tasteIt(t, plattform);
  return e.achtung ? `Esatto! ${e.achtung}` : "Esatto!";
}

/** Eine Taste, die hier nicht unterrichtet wird. */
export const ANSAGE_UNBEKANNT_IT = "Questo non è un tasto che si impara qui.";

/**
 * Der Satz zu einem Schritt der Suchrunde - italienisch. `art` und `naechste`
 * kommen unverändert aus `suchSchritt`; nur die Wörter sind neu.
 */
export function suchSatzIt(
  art: "daneben" | "gefunden" | "weiter" | "fertig",
  taste: TastenName | null,
  suchbar: readonly TastenName[],
  index: number,
  plattform: Plattform,
): string {
  const gesucht = suchbar[index]!;
  switch (art) {
    case "daneben": {
      const g = tasteIt(gesucht, plattform);
      if (!taste) return `${ANSAGE_UNBEKANNT_IT} Trova ${g.nennung}.`;
      return `Questo è ${tastenNennungIt(taste, plattform)}. Trova ${g.nennung}.${g.lage ? ` ${g.lage}` : ""}`;
    }
    case "gefunden":
      return ansageGefundenIt(gesucht, plattform);
    case "fertig":
      return `${ansageBestaetigtIt(gesucht, plattform)} Hai trovato tutti i ${suchbar.length} tasti, ottimo lavoro.`;
    case "weiter":
      return `${ansageBestaetigtIt(gesucht, plattform)} ${ansageSuchauftragIt(suchbar[index + 1]!, plattform)}`;
  }
}
