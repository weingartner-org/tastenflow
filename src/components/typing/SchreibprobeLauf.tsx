/**
 * ★★★★★ DIE SCHREIBPROBE AUS DER SICHT DES KINDES - der ganze Ablauf.
 *
 * Auftrag Johannes, 09.09.2026 (wörtlich):
 * *„Die schüler dieser Klasse sehen eine andere Farbe und Markierung ‚Prüfung'.
 * Sobald sie die erste taste schreiben läuft oben die vom lehrer eingegebene
 * prüfungszeit ab, bei braillelesern wird die lesezeit abgezogen. wenn die zeit
 * abgelaufen ist bekommen die schüler sofort eine detaillierte auflistung ihrer
 * leistung und sie sehen eine liste ihrer prüfungen in ihrer eigenen statistik.
 * … nach ablauf der zeit werden die farben wieder normal und das wort ‚Prüfung'
 * verschwindet."*
 *
 * Dieses Bauteil zeigt je nach Phase EINE Karte und sonst nichts. Die Frage
 * „muss dieses Kind gerade eine Schreibprobe schreiben" beantwortet nicht es,
 * sondern `useSchreibprobe` - hier wird nur dargestellt, was dort schon steht.
 *
 * ── Geübt wird WIRKLICH, also zählt es ──────────────────────────────────────
 * Jede fertige Zeile geht über {@link SchreibprobeLaufProps.onTask} denselben
 * Weg wie eine Zeile in „Mein Training": Die Übezeit-Uhr läuft weiter, das
 * Wochenziel füllt sich, die Tage zählen. Was NICHT passiert, steht im Kopf von
 * `schreibprobeAuswertung.ts`: In die Anschlags-Statistik (`progress.letters`)
 * schreibt die Schreibprobe nichts - eine Prüfung darf das Tor zur nächsten
 * Taste weder öffnen noch zuschlagen. Deshalb wird hier auch KEIN `onLetters`
 * an den Trainer weitergereicht; die Anschläge bleiben in dieser Datei und
 * enden in der Auswertung dieser einen Probe.
 *
 * ── ⚠️⚠️⚠️ DER ZEITSTAND STEHT IN KEINER `aria-live`-REGION ─────────────────
 * An der NVDA-Quelle belegt (`UEBERGABE-2026-09-09-DIE-BRAILLEZEILE-BLEIBT-
 * RUHIG.md`, §1): Jede Live-Meldung erscheint als BLITZMELDUNG auf der
 * Braillezeile und verdrängt sie **vier Sekunden lang**; JAWS ebenso. Eine Uhr,
 * die jede Sekunde meldet, macht das Lesen der Zeile unmöglich - und genau auf
 * diese Zeile schreibt das Kind gerade ab. Der Zeitstand ist darum sichtbar und
 * `aria-hidden`; er ändert sich in einem gewöhnlichen Textknoten, und der löst
 * bei keinem Screenreader eine Meldung aus.
 *
 * Drei Wege bleiben, und sie genügen:
 *  1. **Sehen:** die Uhr über dem Feld, neben den Minutenstrichen
 *     ({@link MinutenLeiste}).
 *  2. **Hören:** {@link ANSAGE_BEI_SEKUNDEN} - fünf Minuten, eine Minute, zehn
 *     Sekunden, sonst nie. Über `speakUi`, das von sich aus schweigt, wenn das
 *     App-Vorlesen aus ist.
 *  3. **Fragen:** {@link RESTZEIT_TASTE} (Alt + X). Wer fragt, will eine
 *     Antwort - diese eine geht ausdrücklich AUCH in den Live-Bereich, genau
 *     wie Alt + Z und Alt + D es in `TypingSession` seit jeher tun. Eine
 *     Blitzmeldung auf ausdrückliche Bitte ist keine Störung.
 *
 * ── Warum Alt + X ───────────────────────────────────────────────────────────
 * Belegt sind in Tastenflow O J B H E V W Z D K G R T L N U S und Alt + 3;
 * plattformweit dazu A („Zur Angabe"), F („Was fehlt"), C („Weiter"), Q
 * („Lösung"), I (Hörbuch-Studio), P („Pause" in vier Programmen) und J. Y
 * scheidet aus, weil Y und Z auf deutschen und amerikanischen Tastaturen
 * vertauscht liegen (`src/lib/shortcuts.ts`). Übrig bleibt X - ohne Merkwert,
 * dafür ohne zweite Bedeutung, und auf jeder Belegung an derselben Stelle
 * (untere Reihe, zweite Taste von links). Die Taste steht am Kopf der Karte
 * geschrieben; sie wird nur eingehängt, solange eine Probe wirklich läuft, und
 * es gibt sie also nirgends, wo sie stillschweigend nichts täte (R-A3).
 *
 * ── Die Markierung muss auch OHNE Farbe erkennbar sein ──────────────────────
 * Im Windows-Kontrastmodus ersetzt der Browser jede Farbe durch vier
 * Systemfarben (`UEBERGABE-2026-09-09-ABEND-DER-KONTRASTMODUS.md`, §3: es gibt
 * keine dritte Farbe). Die Markierung hängt darum an der FORM: ein doppelt
 * starker, GESTRICHELTER Rahmen um den ganzen Arbeitsbereich - `border-style`
 * ersetzt der Kontrastmodus nicht - und das Wort {@link PRUEFUNG_WORT} als
 * Text im Kopf. Farben kommen ausschliesslich aus vorhandenen Klassen des
 * Projekts (`border-warning`, `bg-warning-soft`), kein einziger Hex-Wert.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ANSAGE_BEI_SEKUNDEN,
  activeLayout,
  dauerMsFuer,
  einstiegRestMs,
  focusPracticeField,
  mmss,
  zeilenZeitstand,
  VORRAT_ANSCHLAEGE_JE_MIN,
  baueFolge,
  defiGrundreihe,
  istFreiesSchreiben,
  niveauDef,
  niveauTexte,
  pruefungWort,
  ratVorlesen,
  restGesprochen,
  restMs,
  speakUi,
  typingBackend,
  useVoice,
  textWegFuerKind,
  werteAus,
  zeichenVorrat,
  zeichenabstandFaktor,
  type KeyEvent,
  type Fortschritt,
  type Probenergebnis,
  type SchreibprobeStand,
  type Stufe,
  type TaskEvent,
  type TypingAccount,
} from "@/lib/typing";
import { istZeichenAnschlag } from "@/lib/typing/zeichenTaste";
import { woerterAusEigenemText } from "@/lib/typing/eigeneWoerter";
import { toLayoutText } from "@/lib/typing/layouts";
import {
  ladeTexte,
  ladeWoerter,
  wandleProbentextTypografie,
  zeichenZahl,
  type Probentext,
} from "@/lib/typing/schreibproben";
import { franzVariante } from "@/lib/typing/franzVariante";
import { pruefungsUhrMs, schreibzeitNachUhr } from "@/lib/typing/eineMessart";
// ★ 23.09.2026 („Freies Schreiben"): NICHT über die `@/lib/typing`-Sammlung -
// `freiVergleich.ts` entstand parallel dazu und ist bewusst nicht dort
// gebündelt (die Sammlung wächst mit jeder Datei, die niemand einzeln
// braucht - dieses eine Rechenwerk hat genau EINEN Aufrufer, hier).
import { vergleicheFrei } from "@/lib/typing/freiVergleich";
import { Modal } from "@/components/Modal";
import { MinutenLeiste } from "./MinutenLeiste";
import { SchreibprobeErgebnis } from "./SchreibprobeErgebnis";
import { TypingSession } from "./TypingSession";
import { FreieSchreibzeile, type FreieZeileFertig } from "./FreieSchreibzeile";
import { ensureIntroduced } from "@/lib/typing/letters";
import { wackeligeTastenAus } from "@/lib/typing/zeilenMessung";
import { mehrzahl, texte, useBedienSprache } from "@/lib/bedienSprache";
// ★ E1 (24.09.2026): der Lernweg des Kindes (Konto vor Fortschritts-Kopie).
import { lernwegAus, lernwegVon } from "@/lib/typing/lernweg";
import { wahlText } from "@/lib/typing/wahltaste";

/**
 * ★★ DIE TEXTE DES ABLAUFS in beiden Bedienungssprachen (EN5, 19.09.2026).
 * Deutsch wortgleich wie vorher; wo das JSX mehrere Textknoten erzeugte, in
 * TEILEN (`Teil[]`). Der Prüfungstext selbst ist INHALT und bleibt deutsch in
 * `lang="de"` (Glossar §4, Johannes 12.09.: keine englischen Challenge-Texte).
 *
 * Englisch nach dem Glossar §3.7: *Typing Challenge*, Niveau ⇒ *key range*,
 * Prüfungszeit ⇒ *time limit*, „Ich schreibe nicht mit" ⇒ *I'll sit this one
 * out*, abgeben ⇒ *hand in*, „Weiter üben" ⇒ *Keep practising*.
 * ⚠️ Der Zeitstand links im Feld (`zeilenZeitstand`, „07:04   ") hat keine
 * Wörter und bleibt in beiden Sprachen Zeichen für Zeichen gleich - er steht
 * auf der Braillezeile, und seine Breite ist fest.
 */
const LAUF_TEXTE = texte({
  de: {
    abgegebenTitel: (wort: string) => ["Deine ", wort, " ist abgegeben."],
    abgegebenText: "Deine Zahlen stehen in deiner Statistik. Du kannst weiterüben.",
    // ★ 27.09.2026: das Ergebnis liegt noch im Gerät (kein Netz) - ruhig, ohne
    // Vorhalt, ohne Live-Bereich (die Braillezeile springt nicht).
    unterwegs: "Dein Ergebnis wird gesendet, sobald die Verbindung wieder da ist.",
    unterwegsText:
      "Dein Ergebnis wird gesendet, sobald die Verbindung wieder da ist. Du kannst weiterüben.",
    weiterUeben: "Weiter üben",
    escapeAuch: "Escape bringt dich auch zurück zum Üben.",
    zeitAbErstem: "Die Zeit läuft ab deinem ersten Tastendruck.",
    dauer: "Dauer:",
    niveau: "Niveau:",
    zumBeginnen: "Zum Beginnen hast du noch:",
    dauerMinuten: (min: number) => `${min} Minuten`,
    beginnen: "Beginnen",
    nichtMit: "Ich schreibe nicht mit",
    textFehlt: "Der Text steht gerade nicht bereit. Sag es deiner Lehrkraft.",
    textLaedt: "Der Text wird geladen …",
    restzeitKuerzel: (kuerzel: string) => [kuerzel, " sagt dir, wie viel Zeit noch bleibt."],
    schonAusgewertet: (wort: string) => `Deine ${wort} wird schon ausgewertet.`,
    abgeben: "Fertig - abgeben",
    // ★ 23.09.2026: Escape mitten im Schreiben (Rückfrage wie im Klassenmatch).
    escapeKopf: "Escape: abgeben.",
    frageTitel: (wort: string) => `${wort} abgeben?`,
    frage: (wort: string) =>
      `Willst du deine ${wort} jetzt abgeben? Gewertet wird, was du bis jetzt geschrieben hast.`,
    weiterschreiben: "Weiterschreiben",
    jetztAbgeben: "Abgeben",
    escapeZeile: "Escape bringt dich zurück in die Zeile.",
    // ★ 23.09.2026 („Freies Schreiben", Bauplan §7): auf dem Startbildschirm,
    // damit ein Kind weiss, dass hier NICHT „erst richtig, dann weiter" gilt.
    freiHinweis:
      "Art: Freies Schreiben - Fehler bleiben stehen, mit der Rücktaste bessert du in der Zeile aus.",
  },
  en: {
    abgegebenTitel: (wort: string) => ["Your ", wort, " has been handed in."],
    abgegebenText: "Your results are in My statistics. You can keep practising.",
    unterwegs: "Your result will be sent as soon as the connection is back.",
    unterwegsText:
      "Your result will be sent as soon as the connection is back. You can keep practising.",
    weiterUeben: "Keep practising",
    escapeAuch: "Escape also takes you back to practice.",
    zeitAbErstem: "The clock starts when you press your first key.",
    dauer: "Time limit:",
    niveau: "Key range:",
    zumBeginnen: "Time left to start:",
    dauerMinuten: (min: number) =>
      mehrzahl(min, "en", { one: (z) => `${z} minute`, other: (z) => `${z} minutes` }),
    beginnen: "Start",
    nichtMit: "I'll sit this one out",
    textFehlt: "The text isn't ready right now. Let your teacher know.",
    textLaedt: "Loading the text …",
    restzeitKuerzel: (kuerzel: string) => [kuerzel, " tells you how much time is left."],
    schonAusgewertet: (wort: string) => `Your ${wort} is already being scored.`,
    abgeben: "Done - hand in",
    escapeKopf: "Escape: hand in.",
    frageTitel: (wort: string) => `Hand in your ${wort}?`,
    frage: (wort: string) =>
      `Do you want to hand in your ${wort} now? What you have typed so far will be scored.`,
    weiterschreiben: "Keep typing",
    jetztAbgeben: "Hand in",
    escapeZeile: "Escape takes you back to your line.",
    freiHinweis:
      "Type freely - mistakes stay, use Backspace to fix them in the current line.",
  },
  fr: {
    abgegebenTitel: (wort: string) => ["Ton ", wort, " est rendu."],
    abgegebenText: "Tes chiffres sont dans Mes progrès. Tu peux continuer à t'exercer.",
    unterwegs: "Ton résultat sera envoyé dès que la connexion sera rétablie.",
    unterwegsText:
      "Ton résultat sera envoyé dès que la connexion sera rétablie. Tu peux continuer à t'exercer.",
    weiterUeben: "Continuer à s'exercer",
    escapeAuch: "Échap te ramène aussi à l'exercice.",
    zeitAbErstem: "Le temps démarre à ta première frappe.",
    dauer: "Durée :",
    niveau: "Niveau :",
    zumBeginnen: "Temps restant pour commencer :",
    dauerMinuten: (min: number) =>
      mehrzahl(min, "fr", { one: (z) => `${z} minute`, other: (z) => `${z} minutes` }),
    beginnen: "Commencer",
    nichtMit: "Je ne participe pas",
    textFehlt: "Le texte n'est pas prêt pour l'instant. Dis-le à ton enseignant ou ton enseignante.",
    textLaedt: "Chargement du texte …",
    restzeitKuerzel: (kuerzel: string) => [kuerzel, " te dit combien de temps il reste."],
    schonAusgewertet: (wort: string) => `Ton ${wort} est déjà en cours d'évaluation.`,
    abgeben: "Terminé - rendre",
    escapeKopf: "Échap : rendre.",
    frageTitel: (wort: string) => `Rendre ton ${wort} ?`,
    frage: (wort: string) =>
      `Veux-tu rendre ton ${wort} maintenant ? Ce que tu as écrit jusqu'ici sera évalué.`,
    weiterschreiben: "Continuer à écrire",
    jetztAbgeben: "Rendre",
    escapeZeile: "Échap te ramène à la ligne.",
    freiHinweis:
      "Écris librement - les erreurs restent, corrige-les dans la ligne avec Retour arrière.",
  },
  // ★ ES-O (27.09.2026): tú.
  es: {
    abgegebenTitel: (wort: string) => ["Tu ", wort, " está entregado."],
    abgegebenText: "Tus cifras están en Mi progreso. Puedes seguir practicando.",
    unterwegs: "Tu resultado se enviará en cuanto vuelva la conexión.",
    unterwegsText:
      "Tu resultado se enviará en cuanto vuelva la conexión. Puedes seguir practicando.",
    weiterUeben: "Seguir practicando",
    escapeAuch: "Esc también te lleva de vuelta a practicar.",
    zeitAbErstem: "El tiempo empieza con tu primera pulsación.",
    dauer: "Duración:",
    niveau: "Nivel:",
    zumBeginnen: "Tiempo que queda para empezar:",
    dauerMinuten: (min: number) =>
      mehrzahl(min, "es", { one: (z) => `${z} minuto`, other: (z) => `${z} minutos` }),
    beginnen: "Empezar",
    nichtMit: "No participo",
    textFehlt: "El texto todavía no está listo. Díselo a tu docente.",
    textLaedt: "Cargando el texto …",
    restzeitKuerzel: (kuerzel: string) => [kuerzel, " te dice cuánto tiempo queda."],
    schonAusgewertet: (wort: string) => `Tu ${wort} ya se está valorando.`,
    abgeben: "Terminado - entregar",
    escapeKopf: "Esc: entregar.",
    frageTitel: (wort: string) => `¿Entregar tu ${wort}?`,
    frage: (wort: string) =>
      `¿Quieres entregar ahora tu ${wort}? Se valorará lo que has escrito hasta aquí.`,
    weiterschreiben: "Seguir escribiendo",
    jetztAbgeben: "Entregar",
    escapeZeile: "Esc te lleva de vuelta a la línea.",
    freiHinweis:
      "Escribe libremente - los errores se quedan; corrígelos en la línea con Retroceso.",
  },
  // ★ O-IT (02.10.2026): das Kind liest „tu"; „Sfida" ist weiblich; „l'insegnante" (Regel 2).
  it: {
    abgegebenTitel: (wort: string) => ["La tua ", wort, " è consegnata."],
    abgegebenText: "I tuoi numeri sono in I miei progressi. Puoi continuare a esercitarti.",
    unterwegs: "Il tuo risultato verrà inviato appena torna la connessione.",
    unterwegsText:
      "Il tuo risultato verrà inviato appena torna la connessione. Puoi continuare a esercitarti.",
    weiterUeben: "Continua a esercitarti",
    escapeAuch: "Anche Esc ti riporta all'esercizio.",
    zeitAbErstem: "Il tempo parte dalla tua prima battuta.",
    dauer: "Durata:",
    niveau: "Livello:",
    zumBeginnen: "Tempo che resta per iniziare:",
    dauerMinuten: (min: number) =>
      mehrzahl(min, "it", { one: (z) => `${z} minuto`, other: (z) => `${z} minuti` }),
    beginnen: "Inizia",
    nichtMit: "Questa volta non partecipo",
    textFehlt: "Il testo non è ancora pronto. Dillo all'insegnante.",
    textLaedt: "Caricamento del testo...",
    restzeitKuerzel: (kuerzel: string) => [kuerzel, " ti dice quanto tempo resta."],
    schonAusgewertet: (wort: string) => `La tua ${wort} è già in valutazione.`,
    abgeben: "Finito - consegna",
    escapeKopf: "Esc: consegnare.",
    frageTitel: (wort: string) => `Consegnare la tua ${wort}?`,
    frage: (wort: string) =>
      `Vuoi consegnare adesso la tua ${wort}? Si valuta quello che hai scritto finora.`,
    weiterschreiben: "Continua a scrivere",
    jetztAbgeben: "Consegna",
    escapeZeile: "Esc ti riporta alla riga.",
    freiHinweis:
      "Scrivi liberamente - gli errori restano; correggili nella riga con Backspace.",
  },
  // ★ O-PL (02.10.2026): ty, ohne Vergangenheit der 2. Person; „Wyzwanie" nur
  // im Nominativ/Akkusativ (gleiche Form); „oddać", „Tym razem nie piszę",
  // Knopf „Zacznij" (Glossar §2.3, Regel 12).
  pl: {
    abgegebenTitel: (wort: string) => ["Twoje ", wort, " jest oddane."],
    abgegebenText: "Twoje wyniki są w zakładce „Moje postępy”. Możesz ćwiczyć dalej.",
    unterwegs: "Twój wynik zostanie wysłany, gdy tylko wróci połączenie.",
    unterwegsText:
      "Twój wynik zostanie wysłany, gdy tylko wróci połączenie. Możesz ćwiczyć dalej.",
    weiterUeben: "Ćwicz dalej",
    escapeAuch: "Klawisz Esc też przenosi cię z powrotem do ćwiczeń.",
    zeitAbErstem: "Czas biegnie od pierwszego naciśnięcia klawisza.",
    dauer: "Czas:",
    niveau: "Używane klawisze:",
    zumBeginnen: "Czas na rozpoczęcie:",
    dauerMinuten: (min: number) =>
      mehrzahl(min, "pl", {
        one: (z) => `${z} minuta`,
        few: (z) => `${z} minuty`,
        many: (z) => `${z} minut`,
        other: (z) => `${z} minuty`,
      }),
    beginnen: "Zacznij",
    nichtMit: "Tym razem nie piszę",
    textFehlt: "Tekst nie jest teraz gotowy. Powiedz o tym nauczycielowi lub nauczycielce.",
    textLaedt: "Ładowanie tekstu...",
    restzeitKuerzel: (kuerzel: string) => [kuerzel, " mówi ci, ile czasu zostało."],
    schonAusgewertet: (wort: string) => `Twoje ${wort} jest już podliczane.`,
    abgeben: "Gotowe - oddaj",
    escapeKopf: "Esc: oddaj.",
    frageTitel: (wort: string) => `Oddać ${wort}?`,
    frage: (wort: string) =>
      `Czy chcesz teraz oddać swoje ${wort}? Liczy się to, co już jest napisane.`,
    weiterschreiben: "Pisz dalej",
    jetztAbgeben: "Oddaj",
    escapeZeile: "Klawisz Esc przenosi cię z powrotem do wiersza.",
    freiHinweis:
      "Swobodne pisanie - błędy zostają, klawiszem Backspace poprawiasz je w bieżącym wierszu.",
  },
  // ★ O-TR (02.10.2026): sen, Knöpfe Stamm; "teslim et / teslim edildi",
  // "Bu sefer katılmıyorum", "Başla" (Glossar §2.3). Keine Endung an `wort`
  // oder am Kürzel - die Endung steht am festen Wort daneben (Regel 6).
  tr: {
    abgegebenTitel: (wort: string) => [wort, " teslim edildi."],
    abgegebenText: `Sonuçların "İlerlemem" bölümünde. Çalışmaya devam edebilirsin.`,
    unterwegs: "Bağlantı geri gelir gelmez sonucun gönderilecek.",
    unterwegsText:
      "Bağlantı geri gelir gelmez sonucun gönderilecek. Çalışmaya devam edebilirsin.",
    weiterUeben: "Çalışmaya devam et",
    escapeAuch: "Esc tuşu da seni alıştırmaya geri götürür.",
    zeitAbErstem: "Süre, ilk tuşa bastığın anda başlar.",
    dauer: "Yarışma süresi:",
    niveau: "Kullanılan tuşlar:",
    zumBeginnen: "Başlamak için kalan süre:",
    dauerMinuten: (min: number) => `${min} dakika`,
    beginnen: "Başla",
    nichtMit: "Bu sefer katılmıyorum",
    textFehlt: "Metin şu anda hazır değil. Öğretmenine söyle.",
    textLaedt: "Metin yükleniyor...",
    restzeitKuerzel: (kuerzel: string) => [kuerzel, " kısayolu kalan süreyi söyler."],
    schonAusgewertet: () => "Sonucun şu anda hesaplanıyor.",
    abgeben: "Bitti - teslim et",
    escapeKopf: "Esc: teslim et.",
    frageTitel: (wort: string) => `${wort} teslim edilsin mi?`,
    frage: () =>
      "Yarışmanı şimdi teslim etmek istiyor musun? Şimdiye kadar yazdıkların puanlanır.",
    weiterschreiben: "Yazmaya devam et",
    jetztAbgeben: "Teslim et",
    escapeZeile: "Esc tuşu seni satıra geri götürür.",
    freiHinweis:
      "Tür: Serbest yazma - yanlışlar kalır, satırdaki yanlışları Backspace tuşuyla düzeltirsin.",
  },
  // ★ O-CS (03.10.2026): ty, ohne Vergangenheit der 2. Person; „Výzva" im
  // Nominativ aus `wort`, andere Fälle („Odevzdat Výzvu?") ausgeschrieben;
  // „odevzdat", „Tentokrát nepíšu", Knopf „Začít" (Glossar §2.3, Regel 10);
  // Tastennamen mit Kopfwort („klávesou Esc", Regel 11).
  cs: {
    abgegebenTitel: (wort: string) => [wort, " je odevzdaná."],
    abgegebenText: "Výsledky najdeš v části Můj pokrok. Můžeš cvičit dál.",
    unterwegs: "Tvůj výsledek se odešle, jakmile bude zase připojení.",
    unterwegsText:
      "Tvůj výsledek se odešle, jakmile bude zase připojení. Můžeš cvičit dál.",
    weiterUeben: "Cvičit dál",
    escapeAuch: "Klávesou Esc se taky vrátíš ke cvičení.",
    zeitAbErstem: "Čas běží od prvního stisku klávesy.",
    dauer: "Délka:",
    niveau: "Použité klávesy:",
    zumBeginnen: "Na začátek zbývá:",
    dauerMinuten: (min: number) =>
      mehrzahl(min, "cs", {
        one: (z) => `${z} minuta`,
        few: (z) => `${z} minuty`,
        many: (z) => `${z} minuty`,
        other: (z) => `${z} minut`,
      }),
    beginnen: "Začít",
    nichtMit: "Tentokrát nepíšu",
    textFehlt: "Text teď není k dispozici. Zeptej se ve třídě.",
    textLaedt: "Načítá se text...",
    restzeitKuerzel: (kuerzel: string) => ["Klávesová zkratka ", kuerzel, " ti řekne, kolik času zbývá."],
    schonAusgewertet: (wort: string) => `Tvoje ${wort} se už vyhodnocuje.`,
    abgeben: "Hotovo - odevzdat",
    escapeKopf: "Esc: odevzdat.",
    frageTitel: () => "Odevzdat Výzvu?",
    frage: () => "Chceš teď Výzvu odevzdat? Hodnotí se to, co je zatím napsané.",
    weiterschreiben: "Psát dál",
    jetztAbgeben: "Odevzdat",
    escapeZeile: "Klávesou Esc se vrátíš do řádku.",
    freiHinweis:
      "Způsob: volné psaní - chyby zůstávají, klávesou Backspace je opravíš v aktuálním řádku.",
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      abgegebenTitel: (wort: string) => ["Готово - предаде своето ", wort, "."],
      abgegebenText: "Стойностите ти са в „Моят напредък“. Можеш да продължиш да се упражняваш.",
      unterwegs: "Резултатът ти ще се изпрати, щом връзката се върне.",
      unterwegsText:
        "Резултатът ти ще се изпрати, щом връзката се върне. Можеш да продължиш да се упражняваш.",
      weiterUeben: "Упражнявай се още",
      escapeAuch: "Esc също те връща към упражненията.",
      zeitAbErstem: "Времето тече от първия клавиш, който натиснеш.",
      dauer: "Продължителност:",
      niveau: "Използвани клавиши:",
      zumBeginnen: "Остава време за започване:",
      dauerMinuten: (min: number) =>
        mehrzahl(min, "bg", { one: (z) => `${z} минута`, other: (z) => `${z} минути` }),
      beginnen: "Започни",
      nichtMit: "Този път не участвам",
      // Glossar §2.5: zum Kind nie „твоят учител" ⇒ „Кажи го в клас."
      textFehlt: "Текстът в момента не е готов. Кажи го в клас.",
      textLaedt: "Зареждане на текста …",
      restzeitKuerzel: (kuerzel: string) => [kuerzel, " ти казва колко време остава."],
      schonAusgewertet: (wort: string) => `Твоето ${wort} вече се оценява.`,
      abgeben: "Готово - предай",
      escapeKopf: "Esc: предай.",
      frageTitel: (wort: string) => `Да предадеш ли своето ${wort}?`,
      frage: (wort: string) =>
        `Искаш ли да предадеш своето ${wort} сега? Оценява се написаното досега.`,
      weiterschreiben: "Пиши нататък",
      jetztAbgeben: "Предай",
      escapeZeile: "Esc те връща в реда.",
      freiHinweis:
        "Вид: Свободно писане - грешките остават, с Backspace поправяш в реда.",
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      abgegebenTitel: (wort: string) => ["Η ", wort, " παραδόθηκε."],
      abgegebenText: "Τα αποτελέσματά σου φαίνονται στην ενότητα «Η πρόοδός μου». Μπορείς να συνεχίσεις την εξάσκηση.",
      unterwegs: "Το αποτέλεσμά σου θα σταλεί μόλις επανέλθει η σύνδεση.",
      unterwegsText:
        "Το αποτέλεσμά σου θα σταλεί μόλις επανέλθει η σύνδεση. Μπορείς να συνεχίσεις την εξάσκηση.",
      weiterUeben: "Συνέχεια εξάσκησης",
      escapeAuch: "Και με το Esc επιστρέφεις στην εξάσκηση.",
      zeitAbErstem: "Ο χρόνος ξεκινά με το πρώτο σου πάτημα.",
      dauer: "Διάρκεια:",
      niveau: "Πλήκτρα που χρησιμοποιούνται:",
      zumBeginnen: "Χρόνος για να ξεκινήσεις:",
      dauerMinuten: (min: number) =>
        mehrzahl(min, "el", { one: (z) => `${z} λεπτό`, other: (z) => `${z} λεπτά` }),
      beginnen: "Έναρξη",
      nichtMit: "Αυτή τη φορά δεν γράφω",
      textFehlt: "Το κείμενο δεν είναι έτοιμο αυτή τη στιγμή. Ρώτα στην τάξη.",
      textLaedt: "Φόρτωση του κειμένου...",
      restzeitKuerzel: (kuerzel: string) => [kuerzel, " σου λέει πόσος χρόνος απομένει."],
      schonAusgewertet: (wort: string) => `Η ${wort} αξιολογείται ήδη.`,
      abgeben: "Τέλος - παράδοση",
      escapeKopf: "Esc: παράδοση.",
      frageTitel: (wort: string) => `Θα παραδώσεις την ${wort};`,
      frage: (wort: string) =>
        `Θέλεις να παραδώσεις την ${wort} τώρα; Θα αξιολογηθεί ό,τι έχεις γράψει μέχρι τώρα.`,
      weiterschreiben: "Συνέχεια γραφής",
      jetztAbgeben: "Παράδοση",
      escapeZeile: "Με το Esc επιστρέφεις στη γραμμή.",
      freiHinweis:
        "Ελεύθερη γραφή - τα λάθη μένουν, με το Backspace διορθώνεις στη γραμμή που γράφεις.",
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      abgegebenTitel: (wort: string) => [wort, ": beadva."],
      abgegebenText: "Az eredményeid a Fejlődésem oldalon vannak. Gyakorolhatsz tovább.",
      unterwegs: "Az eredményedet elküldjük, amint újra van kapcsolat.",
      unterwegsText:
        "Az eredményedet elküldjük, amint újra van kapcsolat. Gyakorolhatsz tovább.",
      weiterUeben: "Gyakorlás tovább",
      escapeAuch: "Az Esc billentyű is visszavisz a gyakorláshoz.",
      zeitAbErstem: "Az idő az első leütéseddel indul.",
      dauer: "Időtartam:",
      niveau: "Használt billentyűk:",
      zumBeginnen: "Ennyi időd van elkezdeni:",
      dauerMinuten: (min: number) =>
        mehrzahl(min, "hu", { one: (z) => `${z} perc`, other: (z) => `${z} perc` }),
      beginnen: "Kezdés",
      nichtMit: "Most nem gépelek",
      textFehlt: "A szöveg most nem érhető el. Szólj a tanárodnak.",
      textLaedt: "A szöveg betöltése…",
      restzeitKuerzel: (kuerzel: string) => [kuerzel, ": megmondja, mennyi időd van még."],
      schonAusgewertet: (wort: string) => `${wort}: az értékelés már folyik.`,
      abgeben: "Kész - beadás",
      escapeKopf: "Esc billentyű: beadás.",
      frageTitel: (wort: string) => `${wort} beadása?`,
      frage: (wort: string) =>
        `${wort}: biztosan beadod most? Az számít, amit eddig begépeltél.`,
      weiterschreiben: "Gépelés tovább",
      jetztAbgeben: "Beadás",
      escapeZeile: "Az Esc billentyű visszavisz a sorodhoz.",
      freiHinweis:
        "Szabad gépelés - a hibák bent maradnak, a Backspace billentyűvel javíthatsz az aktuális sorban.",
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      abgegebenTitel: (wort: string) => ["Je ", wort, " is ingeleverd."],
      abgegebenText: "Je resultaten staan in Mijn voortgang. Je kunt verder oefenen.",
      unterwegs: "Je resultaat wordt verstuurd zodra de verbinding er weer is.",
      unterwegsText:
        "Je resultaat wordt verstuurd zodra de verbinding er weer is. Je kunt verder oefenen.",
      weiterUeben: "Verder oefenen",
      escapeAuch: "Ook met Escape ga je terug naar het oefenen.",
      zeitAbErstem: "De tijd loopt vanaf je eerste aanslag.",
      dauer: "Duur:",
      niveau: "Gebruikte toetsen:",
      zumBeginnen: "Tijd om te beginnen:",
      dauerMinuten: (min: number) =>
        mehrzahl(min, "nl", { one: (z) => `${z} minuut`, other: (z) => `${z} minuten` }),
      beginnen: "Beginnen",
      nichtMit: "Deze keer doe ik niet mee",
      textFehlt: "De tekst staat nu niet klaar. Zeg het tegen je leerkracht.",
      textLaedt: "De tekst wordt geladen …",
      restzeitKuerzel: (kuerzel: string) => [kuerzel, " vertelt je hoeveel tijd je nog hebt."],
      schonAusgewertet: (wort: string) => `Je ${wort} wordt al beoordeeld.`,
      abgeben: "Klaar - inleveren",
      escapeKopf: "Escape: inleveren.",
      frageTitel: (wort: string) => `${wort} inleveren?`,
      frage: (wort: string) =>
        `Wil je je ${wort} nu inleveren? Wat je tot nu toe hebt getypt, telt mee.`,
      weiterschreiben: "Verder typen",
      jetztAbgeben: "Inleveren",
      escapeZeile: "Met Escape ga je terug naar je regel.",
      freiHinweis:
        "Soort: Vrij typen - fouten blijven staan, met Backspace verbeter je ze in de regel.",
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      abgegebenTitel: (wort: string) => ["O teu ", wort, " foi entregue."],
      abgegebenText: "Os teus resultados estão em Os meus progressos. Podes continuar a praticar.",
      unterwegs: "O teu resultado vai ser enviado assim que a ligação voltar.",
      unterwegsText:
        "O teu resultado vai ser enviado assim que a ligação voltar. Podes continuar a praticar.",
      weiterUeben: "Continuar a praticar",
      escapeAuch: "Esc também te leva de volta à prática.",
      zeitAbErstem: "O tempo começa a contar quando premires a primeira tecla.",
      dauer: "Duração:",
      niveau: "Teclas usadas:",
      zumBeginnen: "Tempo para começar:",
      dauerMinuten: (min: number) =>
        mehrzahl(min, "pt", {
          one: (z) => `${z} minuto`,
          other: (z) => `${z} minutos`,
          many: (z) => `${z} de minutos`,
        }),
      beginnen: "Começar",
      nichtMit: "Desta vez não participo",
      textFehlt: "O texto não está disponível neste momento. Avisa quem te ensina.",
      textLaedt: "A carregar o texto...",
      restzeitKuerzel: (kuerzel: string) => [kuerzel, " diz-te quanto tempo falta."],
      schonAusgewertet: (wort: string) => `O teu ${wort} já está a ser avaliado.`,
      abgeben: "Concluído - entregar",
      escapeKopf: "Esc: entregar.",
      frageTitel: (wort: string) => `Entregar o ${wort}?`,
      frage: (wort: string) =>
        `Queres entregar o teu ${wort} agora? Conta o que escreveste até aqui.`,
      weiterschreiben: "Continuar a escrever",
      jetztAbgeben: "Entregar",
      escapeZeile: "Esc leva-te de volta à tua linha.",
      freiHinweis:
        "Escrita livre - os erros ficam, e com a tecla de retrocesso corriges na linha atual.",
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      abgegebenTitel: (wort: string) => ["Seu ", wort, " foi entregue."],
      abgegebenText: "Seus números estão em Meu progresso. Você pode continuar praticando.",
      unterwegs: "Seu resultado será enviado assim que a conexão voltar.",
      unterwegsText:
        "Seu resultado será enviado assim que a conexão voltar. Você pode continuar praticando.",
      weiterUeben: "Continuar praticando",
      escapeAuch: "Esc também leva você de volta à prática.",
      zeitAbErstem: "O tempo começa a contar na sua primeira tecla.",
      dauer: "Duração:",
      niveau: "Teclas usadas:",
      zumBeginnen: "Tempo para começar:",
      dauerMinuten: (min: number) =>
        mehrzahl(min, "br", { one: (z) => `${z} minuto`, other: (z) => `${z} minutos` }),
      beginnen: "Começar",
      nichtMit: "Desta vez não vou participar",
      textFehlt: "O texto não está disponível agora. Avise quem dá aula.",
      textLaedt: "Carregando o texto...",
      restzeitKuerzel: (kuerzel: string) => [kuerzel, " diz quanto tempo ainda falta."],
      schonAusgewertet: (wort: string) => `Seu ${wort} já está sendo avaliado.`,
      abgeben: "Concluir e entregar",
      escapeKopf: "Esc: entregar.",
      frageTitel: (wort: string) => `Entregar o seu ${wort}?`,
      frage: (wort: string) =>
        `Quer entregar o seu ${wort} agora? Vale o que você digitou até aqui.`,
      weiterschreiben: "Continuar digitando",
      jetztAbgeben: "Entregar",
      escapeZeile: "Esc leva você de volta à linha.",
      freiHinweis:
        "Tipo: Escrita livre - os erros ficam, e com Backspace você corrige na linha atual.",
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      abgegebenTitel: (wort: string) => ["Ai predat: ", wort, "."],
      abgegebenText: "Rezultatele tale sunt în Progresul meu. Poți exersa mai departe.",
      unterwegs: "Rezultatul tău se trimite imediat ce revine conexiunea.",
      unterwegsText:
        "Rezultatul tău se trimite imediat ce revine conexiunea. Poți exersa mai departe.",
      weiterUeben: "Exersați în continuare",
      escapeAuch: "Și tasta Esc te duce înapoi la exersare.",
      zeitAbErstem: "Timpul pornește la prima ta apăsare de tastă.",
      dauer: "Durata:",
      niveau: "Taste folosite:",
      zumBeginnen: "Timp rămas pentru început:",
      dauerMinuten: (min: number) =>
        mehrzahl(min, "ro", { one: () => "un minut", few: (z) => `${z} minute`, other: (z) => `${z} de minute` }),
      beginnen: "Începeți",
      nichtMit: "De data asta nu particip",
      textFehlt: "Textul nu este pregătit acum. Anunță cadrul didactic.",
      textLaedt: "Se încarcă textul …",
      restzeitKuerzel: (kuerzel: string) => [kuerzel, " îți spune cât timp a mai rămas."],
      schonAusgewertet: (wort: string) => `Se calculează deja rezultatul: ${wort}.`,
      abgeben: "Gata - predați",
      escapeKopf: "Esc: predați.",
      frageTitel: (wort: string) => `${wort}: predai acum?`,
      frage: (wort: string) =>
        `${wort}: vrei să predai acum? Se punctează ce ai scris până acum.`,
      weiterschreiben: "Scrieți mai departe",
      jetztAbgeben: "Predați",
      escapeZeile: "Tasta Esc te duce înapoi în rând.",
      freiHinweis:
        "Scriere liberă - greșelile rămân, cu tasta Backspace corectezi în rândul curent.",
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      abgegebenTitel: (wort: string) => ["Din ", wort, " är inlämnad."],
      abgegebenText: "Dina resultat finns i Mina framsteg. Du kan öva vidare.",
      unterwegs: "Ditt resultat skickas så snart anslutningen är tillbaka.",
      unterwegsText:
        "Ditt resultat skickas så snart anslutningen är tillbaka. Du kan öva vidare.",
      weiterUeben: "Öva vidare",
      escapeAuch: "Escape tar dig också tillbaka till övningen.",
      zeitAbErstem: "Tiden börjar när du trycker på din första tangent.",
      dauer: "Tid:",
      niveau: "Tangenter:",
      zumBeginnen: "Tid kvar att börja:",
      dauerMinuten: (min: number) =>
        mehrzahl(min, "sv", { one: (z) => `${z} minut`, other: (z) => `${z} minuter` }),
      beginnen: "Börja",
      nichtMit: "Jag står över den här gången",
      textFehlt: "Texten är inte klar just nu. Säg till din lärare.",
      textLaedt: "Läser in texten...",
      restzeitKuerzel: (kuerzel: string) => [kuerzel, " säger hur mycket tid som är kvar."],
      schonAusgewertet: (wort: string) => `Poängen för din ${wort} räknas redan ut.`,
      abgeben: "Klar - lämna in",
      escapeKopf: "Escape: lämna in.",
      frageTitel: (wort: string) => `Lämna in din ${wort}?`,
      frage: (wort: string) =>
        `Vill du lämna in din ${wort} nu? Det du har skrivit hittills räknas.`,
      weiterschreiben: "Skriv vidare",
      jetztAbgeben: "Lämna in",
      escapeZeile: "Escape tar dig tillbaka till raden.",
      freiHinweis:
        "Fri skrivning - fel står kvar, med Backsteg rättar du i raden.",
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      abgegebenTitel: (wort: string) => ["Твій ", wort, " здано."],
      abgegebenText: "Твої показники є в розділі «Мій поступ». Можеш тренуватися далі.",
      unterwegs: "Твій результат буде надіслано, щойно повернеться зв'язок.",
      unterwegsText:
        "Твій результат буде надіслано, щойно повернеться зв'язок. Можеш тренуватися далі.",
      weiterUeben: "Тренуватися далі",
      escapeAuch: "Esc також повертає до тренування.",
      zeitAbErstem: "Час починається з першого натискання клавіші.",
      dauer: "Тривалість:",
      niveau: "Клавіші тексту:",
      zumBeginnen: "Час, що лишився на початок:",
      dauerMinuten: (min: number) =>
        mehrzahl(min, "uk", {
          one: (z) => `${z} хвилина`,
          few: (z) => `${z} хвилини`,
          many: (z) => `${z} хвилин`,
          other: (z) => `${z} хвилини`,
        }),
      beginnen: "Почати",
      nichtMit: "Цього разу не беру участі",
      textFehlt: "Текст зараз не готовий. Скажи про це педагогові.",
      textLaedt: "Завантаження тексту...",
      restzeitKuerzel: (kuerzel: string) => [kuerzel, " каже, скільки часу залишилося."],
      schonAusgewertet: (wort: string) => `Твій ${wort} уже оцінюється.`,
      abgeben: "Готово - здати",
      escapeKopf: "Esc: здати.",
      frageTitel: (wort: string) => `Здати ${wort}?`,
      frage: (wort: string) =>
        `Хочеш здати ${wort} зараз? Буде оцінено те, що вже надруковано.`,
      weiterschreiben: "Друкувати далі",
      jetztAbgeben: "Здати",
      escapeZeile: "Esc повертає в рядок.",
      freiHinweis:
        "Вид: Вільне письмо - помилки залишаються, клавішею Backspace можна виправити їх у рядку.",
    },
});

/**
 * Die Lektions-Kennung der Telemetrie.
 *
 * ⚠️ Sie darf NICHT mit `form:` beginnen: `istWortspiel()` in `account.ts`
 * erkennt Wortspiele genau an diesem Präfix und nimmt sie aus der Tempo-
 * Rechnung heraus. Eine Schreibprobe ist eine Abschrift - ihr Tempo ist die
 * Sache, um die es geht, und es soll zählen. Nachgesehen am 09.09.2026, nicht
 * angenommen.
 */
const KONTEXT_ID = "schreibprobe";

/**
 * Pause zwischen zwei Zeilen (ms). Der Standard von 550 ms deckt den
 * Erfolgsklang ab; bei rund 170 Zeilen wären das anderthalb Minuten, in denen
 * die Prüfungsuhr läuft und niemand schreiben kann.
 */
const ZEILEN_PAUSE_MS = 220;

/** Alt + X - die Restzeit auf Nachfrage. Begründung im Dateikopf. */
const RESTZEIT_TASTE = "KeyX";
const RESTZEIT_KUERZEL = "Alt + X";

export interface SchreibprobeLaufProps {
  /** Der ganze Stand aus `useSchreibprobe` - Plan, Phase, beginne, gibAb. */
  probe: SchreibprobeStand;
  account: TypingAccount;
  stufe: Stufe;
  /**
   * Die Übungs-Telemetrie einer fertigen ZEILE, damit die Übezeit-Uhr und das
   * Wochenziel weiterlaufen - genau wie in AdaptiveTrainer. Geschrieben wird
   * WIRKLICH getippt, also zählt es als Übezeit.
   */
  onTask: (e: Omit<TaskEvent, "ts">) => void;
}

/**
 * Der abgesetzte Rahmen samt Kopfzeile - die „andere Farbe und Markierung".
 *
 * ★ Er umschliesst den ganzen Arbeitsbereich und nicht nur eine Überschrift:
 * Ein Kind soll auf den ersten Blick sehen, dass hier gerade etwas anderes
 * läuft als sonst. Gestrichelt und doppelt stark, damit die Aussage auch dann
 * ankommt, wenn der Kontrastmodus alle Farben ersetzt.
 */
function Markierung({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border-2 border-dashed border-warning p-3 sm:p-4">
      {children}
    </div>
  );
}

/*
  ★ Die Minutenleiste über dem Feld steht seit 11.09.2026 in einer eigenen
  Datei ({@link MinutenLeiste}) - das Klassenmatch zeigt über seinem Feld
  dieselbe (F12), und eine Kopie wäre die zweite Fassung einer Anzeige, deren
  ganze Begründung an einer Messung hängt.
*/

export function SchreibprobeLauf({ probe, account, stufe, onTask }: SchreibprobeLaufProps) {
  const {
    plan,
    phase,
    stand,
    beginne,
    melde,
    schliesseErgebnis,
    gibAb,
    fortschritt,
    merkeFortschritt,
    ergebnisUnterwegs,
  } = probe;
  const voiceEnabled = useVoice((s) => s.enabled);
  /*
    ★ EN5: Die Bedienungssprache. Gesprochenes der BEDIENUNG (Restzeit,
    Alt + X) kommt in Tastenflow (`bereichAktiv`) in dieser Sprache und mit
    ihrer Stimme - ohne aktiven Sprachbereich genau der Aufruf von vorher
    (`speakUi(text)`). Der Prüfungstext selbst bleibt deutsch (`lang="de"` unten).
  */
  const { sprache, bereichAktiv } = useBedienSprache();
  const t = LAUF_TEXTE[sprache];
  const wort = pruefungWort(sprache);
  const sprachRef = useRef({ sprache, bereichAktiv });
  sprachRef.current = { sprache, bereichAktiv };
  const sagBedienung = useCallback((text: string) => {
    const b = sprachRef.current;
    if (b.bereichAktiv) speakUi(text, undefined, undefined, b.sprache);
    else speakUi(text);
  }, []);

  /** Alle Texte des Niveaus - die Challenge kann über ein Textende hinweg laufen. */
  const [texte, setTexte] = useState<Probentext[] | null>(null);
  const [textFehlt, setTextFehlt] = useState(false);
  /**
   * Die Wörter dieses Niveaus, die das Lexikon nicht kennt, das Wörterbuch aber
   * schon - damit sie ganz gesprochen und nicht buchstabiert werden (Johannes
   * 10.09.2026). Fehlt die Liste (Netz), gilt das Lexikon allein: Es wird dann
   * mehr buchstabiert, geschrieben wird gleich.
   */
  const [woerter, setWoerter] = useState<ReadonlySet<string> | undefined>(undefined);
  /** „Beginnen" gedrückt - die Session hängt, die Uhr wartet auf den Anschlag. */
  const [gestartet, setGestartet] = useState(false);
  const [ergebnis, setErgebnis] = useState<Probenergebnis | null>(null);
  const [stoppSignal, setStoppSignal] = useState(0);
  const [jetzt, setJetzt] = useState(() => Date.now());
  /** Die Antwort auf Alt + X - der EINZIGE Text, der hier je live gemeldet wird. */
  const [nachfrage, setNachfrage] = useState("");
  /*
   * ★ Schritt M (19.09.2026): die wackligen Tasten dieses Kindes, EINMAL aus
   * seinem Lernstand gelesen - die Challenge schreibt ihre Anschläge nicht in
   * die Tastenstatistik, sie bleiben also die ganze Probe über dieselben. Die
   * Session zählt je Zeile, wie sie gingen (nur gemessen, nie bewertet).
   * Gelingt das Lesen nicht, wird eben nichts gezählt - die Probe läuft gleich.
   */
  const [wackelig, setWackelig] = useState<readonly string[] | undefined>(undefined);
  useEffect(() => {
    let lebt = true;
    Promise.resolve()
      .then(() => typingBackend().getProgress(account.id))
      .then((p) => {
        if (lebt)
          setWackelig(
            // ★ D-5: Weg und Stufe des Kindes bestimmen die Schwelle.
            wackeligeTastenAus(p.letters, ensureIntroduced(p.introduced, lernwegAus(account, p)), {
              lernweg: lernwegAus(account, p),
              stufe,
            }),
          );
      })
      .catch(() => undefined);
    return () => {
      lebt = false;
    };
  }, [account.id]);

  const wartezeitRef = useRef(0);
  /** ★ F1c: die Zeilenwechsel-Pausen - Zeit der App, siehe `eineMessart.ts`. */
  const zeilenwechselRef = useRef(0);
  const anschlaege = useRef<KeyEvent[]>([]);
  /**
   * `schreibMs` ist hier die Summe der Zeilenzeiten - sie wird weiter geführt
   * (Gerätestand, Siegel), ist seit F1c aber NICHT mehr der Nenner des Tempos:
   * Der ist die Prüfungsuhr minus Zuhören minus Zeilenwechsel (`beenden`).
   */
  const summe = useRef({ zeichen: 0, fehler: 0, zeilen: 0, schreibMs: 0 });
  /**
   * ★ 23.09.2026 („Freies Schreiben"): die fertigen Ist-Zeilen bisher - die
   * Grundlage für `vergleicheFrei` in {@link beendenFrei}. Im strengen Modus
   * bleibt sie leer und ungenutzt (siehe {@link Fortschritt.getippt}).
   */
  const getipptRef = useRef<string[]>([]);
  /** ★ 23.09.2026: wirksame Rücktasten bisher - nur zur Auskunft, keine Wertung. */
  const korrekturenRef = useRef(0);
  /** Zeilen, die in DIESER Sitzung fertig wurden - siehe die Übernahme unten. */
  const eigeneZeilen = useRef(0);
  const fertig = useRef(false);
  const stoppGesendet = useRef(false);
  /** Steht die Session im Baum? (Für den Escape-Zuhörer, der VOR ihrer Berechnung steht.) */
  const sessionSichtbarRef = useRef(false);
  const grund = useRef<"zeit" | "frueher">("zeit");
  const angesagt = useRef(new Set<number>());
  const pendel = useRef(false);
  const fokusGesetzt = useRef(false);
  const ergebnisKasten = useRef<HTMLDivElement>(null);

  /**
   * ★★★★★ WAS SCHON GESCHRIEBEN WURDE, ÜBERLEBT EIN NEULADEN.
   *
   * `useSchreibprobe` merkt sich Zeichen, Fehler, Zeilen, Schreibzeit,
   * Vorlesezeit und Anschläge im Gerät (siehe `Fortschritt` dort - ein
   * Neuladen in Minute neun gab vorher ein Ergebnis mit lauter Nullen). Hier
   * werden diese Zahlen übernommen, sobald sie da sind.
   *
   * ⚠️ Die Übernahme hört auf, sobald in DIESER Sitzung die erste Zeile fertig
   * ist: Ab dann führen die Refs hier die Zahlen, und `merkeFortschritt`
   * schreibt sie ins Gerät zurück. Ohne diesen Riegel könnte ein später
   * eintreffender Gerätestand eine gerade geschriebene Zeile überschreiben.
   * Ein einfaches „einmal beim Aufbauen" genügt nicht: React führt die Effekte
   * der Kinder VOR denen der Eltern aus, und der Gerätestand kommt aus einem
   * Eltern-Effekt - beim ersten Lauf wäre er also noch leer.
   */
  useEffect(() => {
    if (eigeneZeilen.current > 0) return;
    summe.current = {
      zeichen: fortschritt.zeichen,
      fehler: fortschritt.fehler,
      zeilen: fortschritt.zeilen,
      schreibMs: fortschritt.schreibMs,
    };
    anschlaege.current = [...fortschritt.anschlaege];
    wartezeitRef.current = fortschritt.wartezeitMs;
    zeilenwechselRef.current = fortschritt.zeilenwechselMs ?? 0;
    // ★ 23.09.2026 („Freies Schreiben"): dieselbe Übernahme für die schon
    // fertigen Ist-Zeilen und die Korrekturen - ein Neuladen mitten in einer
    // freien Tippchallenge darf beides so wenig verlieren wie Zeichen/Fehler.
    getipptRef.current = [...(fortschritt.getippt ?? [])];
    korrekturenRef.current = fortschritt.korrekturen ?? 0;
  }, [fortschritt]);

  /**
   * ★★★ DIE ZEILEN DIESER CHALLENGE (Texte sparen, Johannes 10.09.2026): ab
   * der Startstelle des Plans bis zum Textende, danach nahtlos der nächste
   * Text (`baueFolge`). Für die Session ist das EINE Liste - es gibt keinen
   * „Text zu Ende", keine Pause, die Uhr läuft weiter, und das Kind merkt den
   * Wechsel nicht.
   *
   * ⚠️ Nur an den einfachen Werten des Plans hängen: Eine neue Liste setzt die
   * Session auf ihre erste Zeile zurück, und `useSchreibprobe` liefert bei
   * jeder Nachfrage einen neuen Plan.
   */
  /*
   * ★★★ W2b (28.09.2026, Weg je Kind): in einer GEMISCHTEN Klasse schreibt ein
   * Kind auf einem anderen Weg als der Plan dasselbe Niveau aus der Bank
   * SEINES Weges (`textWegFuerKind`, dort die Begründung). Es beginnt dann am
   * Anfang des Textes mit derselben Nummer - die Startzeile des Plans ist eine
   * Stelle in der Bank der Klasse und hiesse in seiner Bank etwas anderes.
   * Kinder auf dem Weg der Klasse: alles wie bisher.
   */
  const planWeg = lernwegVon(plan);
  const probenWeg = textWegFuerKind(planWeg, lernwegVon(account), plan?.niveau);
  const eigenerWeg = probenWeg !== planWeg;
  const planTextNr = plan?.textNr ?? -1;
  const planStartZeile = eigenerWeg ? 0 : (plan?.startZeile ?? 0);
  const planDauerMin = plan?.dauerMin ?? 0;
  const planEigeneDateiId = plan?.eigeneDateiId ?? null;
  const folge = useMemo(() => {
    if (!texte || planTextNr < 0) return null;
    const mindZeichen = planDauerMin * VORRAT_ANSCHLAEGE_JE_MIN;
    if (!planEigeneDateiId) {
      return baueFolge(texte, { textNr: planTextNr, zeile: planStartZeile }, mindZeichen);
    }
    // ★★★★★ EIN einzelner Text (Tippchallenge mit eigener Datei, 17.09.2026):
    // `anzahlTexte=1` (Modulo), `maxLaeufe` grosszügig genug, dass sich der
    // eine Text so oft wiederholt, wie es die Prüfungszeit braucht - siehe
    // den Kopfkommentar von `baueFolge` in `schreibprobe.ts`. Ohne diese zwei
    // Parameter bräche die Folge nach genau einem Durchlauf ab, lange bevor
    // `mindZeichen` erreicht ist (mechanisch geprüft in
    // `tests/tastenflow-schreibprobe-logik.test.ts`).
    const zeichenJeDurchlauf = zeichenZahl(texte[0] ?? { nr: 0, titel: "", zeilen: [] }) || 1;
    const maxLaeufe = Math.ceil(mindZeichen / zeichenJeDurchlauf) + 1;
    return baueFolge(texte, { textNr: 0, zeile: planStartZeile }, mindZeichen, 1, maxLaeufe);
  }, [texte, planTextNr, planStartZeile, planDauerMin, planEigeneDateiId]);
  const hatZeilen = folge !== null && folge.zeilen.length > 0;
  /** Der Titel des Textes, in dem die Challenge beginnt - er steht im Ergebnis. */
  const startTitel =
    hatZeilen && texte ? (texte.find((t) => t.nr === folge.stellen[0].textNr)?.titel ?? "") : "";

  /**
   * ★★★★★ BEI WELCHER ZEILE GEHT ES NACH EINEM NEULADEN WEITER?
   *
   * Bei der, die als nächste dran ist - also `fortschritt.zeilen`, gezählt ab
   * der Startstelle (die Liste beginnt dort). Das ist NICHT nur bequem,
   * sondern die Bedingung dafür, dass die Zahlen stimmen: Die schon fertigen
   * Zeilen sind bereits gezählt (Zeichen, Fehler, Anschläge). Begänne die
   * Session wieder an der Startstelle, schriebe das Kind dieselben Zeilen ein
   * zweites Mal, und alles davon käme **ein zweites Mal** dazu - ein Neuladen
   * würde die eigene Leistung verdoppeln.
   *
   * ⚠️ EINMAL festgehalten, beim Aufbauen. Ein Wert, der mit jeder fertigen
   * Zeile mitwächst, wäre eine Startzeile, die während des Laufs wandert.
   */
  const startQi = useRef<number | null>(null);
  if (startQi.current === null && fortschritt.zeilen >= 0 && hatZeilen) {
    startQi.current = Math.min(
      Math.max(0, Math.round(fortschritt.zeilen)),
      folge.zeilen.length - 1,
    );
  }

  /** Der Stand der Refs als Datensatz - so, wie ihn das Gerät merkt. */
  const standJetzt = useCallback(
    (): Fortschritt => ({
      ...summe.current,
      wartezeitMs: wartezeitRef.current,
      zeilenwechselMs: zeilenwechselRef.current,
      anschlaege: anschlaege.current,
    }),
    [],
  );

  const niveau = plan?.niveau ?? null;
  // ★ E7a (24.09.2026): der Weg DES PLANS - die ganze Klasse schreibt denselben
  // Text (Bauplan §5.3). `unlocked`/`niveauInfo` weiter unten lesen denselben
  // Wert noch einmal. ★ W2b: `probenWeg` steht jetzt oben (bei `planStartZeile`)
  // - ein Kind auf einem anderen Weg bekommt die Bank seines Weges.
  // ★ M4 (27.09.2026): die Grundreihe der Défi-Bank steht im PLAN (Tastatur
  // der Lehrkraft beim Start) - nie aus dem Gerät des Kindes. ★ W2b: AUSSER
  // das Kind schreibt aus seinem eigenen Weg - dann aus seiner Tastatur.
  const probenGrundreihe = eigenerWeg
    ? defiGrundreihe(probenWeg, activeLayout().id)
    : plan?.grundreihe;
  const laeuftGerade = phase === "offen" || phase === "laeuft";

  /*
    ★★★ VORLESEN WIE BEIM ÜBEN (Umbau 11.09.2026, D4).

    Bis dahin blieb die Stimme in der Tippchallenge stumm, solange die
    Lehrkraft nicht das Häkchen „Vorlesen bei Prüfungen erlaubt" gesetzt
    hatte - Johannes: „schaff das Häkchen ab, es verwirrt nur." Jetzt liest
    die App genau dann vor, wenn das Kind sein eigenes Vorlesen eingeschaltet
    hat (`voiceEnabled`) - keine zweite Einstellung, keine Stummschaltung
    mehr. Die gemessene Wartezeit auf die Stimme bleibt von der Prüfungsuhr
    abgezogen (siehe `onZeilenWartezeit` unten) - das war nie an das Häkchen
    gebunden, sondern an das tatsächliche Warten.
  */

  // ── Den Prüfungstext nachladen ────────────────────────────────────────────
  // Erst ab „offen": 6000 Zeichen gehören nicht ins Bündel eines Kindes, das
  // gerade übt und von keiner Challenge betroffen ist. Die
  // Abhängigkeiten sind bewusst die EINFACHEN Werte und nicht `plan` selbst -
  // `useSchreibprobe` fragt die Klasse im Takt nach und beobachtet sie seit
  // 10.09.2026 auch per Realtime; jede Änderung an der Klasse (auch eine, die
  // die Challenge nicht betrifft) darf hier kein Nachladen auslösen.
  useEffect(() => {
    if (!niveau || !laeuftGerade) return;
    // Ein ANDERES Niveau darf keine Sekunde lang die Texte des vorigen zeigen.
    // Die Abhängigkeiten wechseln während einer laufenden Probe nicht - der
    // Übergang „offen" ⇒ „läuft" lässt `laeuftGerade` wahr, die Session bleibt
    // also stehen. Eine andere Startstelle desselben Niveaus baut `folge` neu.
    setTexte(null);
    setTextFehlt(false);
    let lebt = true;
    // ★★★★★ Niveau „eigen" (17.09.2026): `ladeTexte("eigen")` gäbe `[]` -
    // die Bank kennt kein solches Niveau. Der Text liegt stattdessen in
    // `tt_eigene_texte`, referenziert über `plan.eigeneDateiId`. OHNE diesen
    // Zweig sähe das Kind eine Fehlermeldung statt seiner Prüfung, obwohl die
    // Lehrkraft-Seite (`SchreibprobeKasten`) längst korrekt gestartet hat.
    if (niveau === "eigen") {
      if (!planEigeneDateiId) {
        setTextFehlt(true);
        return;
      }
      void typingBackend()
        .leseEigenenText(planEigeneDateiId)
        .then((t) => {
          if (!lebt) return;
          if (!t || t.zeilen.length === 0) {
            setTextFehlt(true);
            return;
          }
          // ★ Johannes, 12.11.2026 (Christina, „dreiig"): Das ß BLEIBT im Text. Nur wo die Tastatur
          // des Kindes kein ß hat (Schweiz), wird es dort zu „ss" - `toLayoutText` kennt die
          // Ersatzschreibweise je Tastatur. Auf einer deutschen Tastatur ändert sich nichts.
          const zeilen = t.zeilen.map((z) => toLayoutText(z));
          setTexte([{ nr: 0, titel: t.dateiname, zeilen }]);
          // ★ 21.09.2026 (Sarah): Wörter der eigenen Datei zählen als Wörter -
          // sonst würden sie beim Vorlesen buchstabiert (`lib/typing/eigeneWoerter.ts`).
          setWoerter(woerterAusEigenemText(zeilen));
        })
        .catch(() => {
          if (lebt) setTextFehlt(true);
        });
      return () => {
        lebt = false;
      };
    }
    // ★ E7a (24.09.2026): die Bank des PLANWEGES - eine „en"-Challenge lädt
    // nie die deutsche Bank (`probenWeg`, oben aus `lernwegVon(plan)`).
    void ladeTexte(niveau, probenWeg, probenGrundreihe)
      .then((t) => {
        if (!lebt) return;
        // ★ E11a-5 (aus E10d): auf Weg „fr" die Typografie der Landesvariante
        // (Kanada: kein Leerzeichen vor ; ! ?) - sonst unverändert.
        const variante = probenWeg === "fr" ? franzVariante() : null;
        setTexte(variante ? t.map((x) => wandleProbentextTypografie(x, variante)) : t);
        setTextFehlt(t.length === 0);
      })
      .catch(() => {
        if (!lebt) return;
        setTextFehlt(true);
      });
    void ladeWoerter(niveau, probenWeg)
      .then((w) => {
        if (lebt) setWoerter(w);
      })
      .catch(() => {
        // Ohne Liste gilt das Lexikon allein - siehe `woerter` oben.
      });
    return () => {
      lebt = false;
    };
  }, [niveau, laeuftGerade, planEigeneDateiId, probenWeg, probenGrundreihe]);

  // ── Die Uhr ───────────────────────────────────────────────────────────────
  // Sie tickt nur, solange eine Probe wirklich ansteht. Ein Takt, der immer
  // läuft, weckt jedes Gerät jede Sekunde - für nichts.
  useEffect(() => {
    if (!laeuftGerade) return;
    const t = window.setInterval(() => setJetzt(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [laeuftGerade]);

  /**
   * Wie viel Zeit bleibt.
   *
   * Gerechnet wird in `restMs`, nicht hier: gewährte Zeit (Prüfungszeit plus
   * Zeitzuschlag, falls dieses Kind einen hat) minus der Zeit seit dem ERSTEN
   * TASTENDRUCK. Vor dem ersten Anschlag steht die volle Zeit da - die Uhr
   * läuft dann noch nicht. ★ Seit 15.09.2026 pausiert das Vorlesen diese Uhr
   * NICHT mehr (siehe `restMs`) - `wartezeitMs` wirkt nur noch auf die
   * Wertung, nicht auf die Dauer.
   */
  const rest = plan ? restMs(plan, stand, jetzt) : 0;
  const restRef = useRef(rest);
  restRef.current = rest;
  const gesamtMs = plan ? dauerMsFuer(plan, stand) : 0;

  // ── Ansagen: fünf Minuten, eine Minute, zehn Sekunden ─────────────────────
  useEffect(() => {
    if (phase !== "laeuft" || stand.beginnMs <= 0) return;
    const restSek = Math.round(rest / 1000);
    for (const schwelle of ANSAGE_BEI_SEKUNDEN) {
      if (angesagt.current.has(schwelle) || restSek > schwelle) continue;
      angesagt.current.add(schwelle);
      // Eine Schwelle, die schon zu Beginn erreicht war (Probe über fünf
      // Minuten ⇒ „Noch 5 Minuten." im ersten Takt), ist keine Vorwarnung,
      // sondern Lärm. Sie gilt als erledigt und wird nicht gesprochen.
      if (schwelle * 1000 >= gesamtMs) continue;
      sagBedienung(restGesprochen(rest, sprachRef.current.sprache));
    }
  }, [phase, rest, stand.beginnMs, gesamtMs, sagBedienung]);

  /**
   * Eine Meldung in den Live-Bereich geben - NUR auf ausdrückliche Nachfrage.
   *
   * Der Wechsel zwischen `text` und `text + " "` ist derselbe Kniff wie in
   * `TypingSession`: Ein Live-Bereich meldet nur, was sich ÄNDERT. Zweimal
   * dieselbe Restzeit hintereinander bliebe sonst stumm, und ein Kind, das
   * zweimal fragt, hielte die Taste für kaputt.
   */
  const antworte = useCallback(
    (satz: string) => {
      pendel.current = !pendel.current;
      setNachfrage(pendel.current ? satz : `${satz} `);
      // Dieselbe Auskunft zusätzlich als Stimme. `speakUi` schweigt von sich aus,
      // wenn das App-Vorlesen aus ist - der Live-Bereich trägt sie dann allein.
      sagBedienung(satz);
    },
    [sagBedienung],
  );

  // ── Alt + X: „wie viel Zeit habe ich noch?" ───────────────────────────────
  useEffect(() => {
    if (phase !== "laeuft") return;
    const onKey = (e: KeyboardEvent) => {
      if (!e.altKey || e.ctrlKey || e.metaKey) return;
      // ⚠️ `e.code`, NIE `e.key`: Am Mac erzeugt die Wahltaste ein
      // Sonderzeichen (aus Alt + X wird „≈"), der Buchstabenvergleich könnte
      // dort nie zutreffen. Dieselbe Falle hat in »Meine Klasse« drei Kürzel
      // still getötet (09.09.2026); der Wächter `tests/kuerzel-alt-t.test.tsx`
      // §1 sieht seither in ganz `src/` danach.
      if (e.code !== RESTZEIT_TASTE) return;
      e.preventDefault();
      antworte(restGesprochen(restRef.current, sprachRef.current.sprache));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, antworte]);

  /**
   * ★★★ NACH DEM ABGEBEN: „Weiter üben" oder Escape - zurück ins normale Üben
   * (Johannes 10.09.2026: *„nach der abgegebenen tippchallenge kommt man mit
   * weiter oder esc wieder zum normalen modus und kann weiterüben"*).
   *
   * Bis dahin gab es keinen Weg hinaus: Die Auswertung blieb stehen, bis die
   * Lehrkraft die Challenge aus der Klasse nahm, und der Knopf „Weiter üben"
   * der Ergebnis-Karte bekam nie eine Aufgabe. Gemerkt wird es im Gerät
   * (`schliesseErgebnis`); die Zahlen stehen in der eigenen Statistik.
   *
   * Der Fokus geht in die Eingabezeile (Regel „Escape holt immer die
   * Eingabezeile"). `focusPracticeField` hält die Anforderung offen, bis der
   * Trainer wieder im Baum steht.
   */
  const weiterUeben = useCallback(() => {
    schliesseErgebnis();
    focusPracticeField();
  }, [schliesseErgebnis]);
  useEffect(() => {
    if (phase !== "abgegeben") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") weiterUeben();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, weiterUeben]);

  /*
   * ★★★★★ ESCAPE MITTEN IM SCHREIBEN: RÜCKFRAGE (23.09.2026, 3. Klasse HAS:
   * *„Haben auch probiert die Tippchallenge bei einer Schülerin mit ESC
   * abzubrechen, hat aber nicht funktioniert"* - Johannes: Rückfrage öffnen).
   *
   * Dasselbe Muster wie im Klassenmatch (`KlassenmatchLauf`, 11.09.2026):
   * Escape öffnet ein Fenster, der ERSTE Knopf ist „Weiterschreiben" und hat
   * den Fokus - ein Kind, das aus Gewohnheit Escape und danach Enter drückt,
   * schreibt einfach weiter. Escape im Fenster heisst ebenfalls
   * „Weiterschreiben". „Abgeben" ist derselbe Weg wie „Fertig - abgeben"
   * (die angefangene Zeile kommt über `stoppSignal` mit). Die Uhr läuft dabei
   * weiter - so wie die Lehrkraft sie eingestellt hat.
   *
   * Nur solange die Uhr des Kindes LÄUFT (`phase === "laeuft"`, also nach dem
   * ersten Anschlag): Davor gibt es nichts abzugeben, und Escape holt dort wie
   * überall die Eingabezeile. Der seitenweite Escape-Weg läuft vor diesem
   * Zuhörer (Dokument vor Fenster); `TypingSession` holt den Fokus nicht,
   * solange ein modaler Dialog offen ist.
   */
  const [frageOffen, setFrageOffen] = useState(false);
  const weiterschreibenRef = useRef<HTMLButtonElement>(null);
  const frueherAbgeben = useCallback(() => {
    if (stoppGesendet.current || fertig.current) {
      antworte(LAUF_TEXTE[sprachRef.current.sprache].schonAusgewertet(pruefungWort(sprachRef.current.sprache)));
      return;
    }
    grund.current = "frueher";
    stoppGesendet.current = true;
    setStoppSignal((n) => n + 1);
  }, [antworte]);
  const weiterschreiben = useCallback(() => {
    setFrageOffen(false);
    focusPracticeField();
  }, []);
  const abgebenBestaetigt = useCallback(() => {
    setFrageOffen(false);
    frueherAbgeben();
  }, [frueherAbgeben]);
  useEffect(() => {
    if (phase !== "laeuft" || frageOffen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || fertig.current || stoppGesendet.current) return;
      // Erst gefragt, wenn es etwas abzugeben gibt: die Session steht im Baum.
      if (!sessionSichtbarRef.current) return;
      e.preventDefault();
      setFrageOffen(true);
      const sp = sprachRef.current.sprache;
      sagBedienung(LAUF_TEXTE[sp].frage(pruefungWort(sp)));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, frageOffen, sagBedienung]);

  /**
   * ★★★★★ DER ERSTE TASTENDRUCK - hier startet die Prüfungsuhr.
   *
   * Johannes: *„Sobald sie die erste taste schreiben läuft oben die … zeit ab."*
   *
   * ── Warum ein Zuhörer am `document` in der EINFANG-Phase ─────────────────
   * Drei Wege wären denkbar, zwei davon sind gemessen falsch:
   *
   *  · `onLetters` feuert erst am ZEILENENDE. Eine Zeile hat 20 bis 40 Zeichen;
   *    das Kind hätte zehn bis zwanzig Sekunden geschrieben, bevor die Uhr
   *    anspringt - und zwar das schnelle Kind länger als das langsame.
   *  · Ein `onKeyDown` an der Karte sieht nur, was im Fokus INNERHALB der Karte
   *    passiert. `TypingSession` nimmt aber auch den Anschlag an, wenn der
   *    Fokus noch irgendwo auf der Seite steht („Einfach losschreiben" holt das
   *    Feld und reicht genau diesen ersten Anschlag durch). Der erste Buchstabe
   *    zählte dann schon, ohne die Uhr zu starten.
   *  · Am `document` in der Einfang-Phase kommt jeder Anschlag an, bevor ihn
   *    irgendein Handler behandeln oder aufhalten kann - zur selben Zeit, zu
   *    der er wirklich fällt. Das ist der Weg.
   *
   * Gezählt wird nur ein ECHTES Zeichen: Alt/Strg/Cmd-Kombinationen sind
   * Kürzel (Alt + X darf die Prüfung nicht starten), und alles mit einem
   * längeren Namen ist Tab, Escape, Umschalt, eine Pfeil- oder eine F-Taste.
   * Eine allein gedrückte Umschalttaste startet die Uhr also nicht; der
   * Buchstabe dahinter tut es Millisekunden später.
   */
  const sessionSichtbar = plan !== null && hatZeilen && (phase === "laeuft" || (phase === "offen" && gestartet));
  sessionSichtbarRef.current = sessionSichtbar;
  useEffect(() => {
    if (!sessionSichtbar || stand.beginnMs > 0) return;
    const onKey = (e: KeyboardEvent) => {
      // ★ 23.09.2026: auch ein AltGr-Zeichen startet die Uhr (`zeichenTaste.ts`).
      if (!istZeichenAnschlag(e)) return;
      beginne();
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [sessionSichtbar, stand.beginnMs, beginne]);

  // ── Abgeben: auswerten, speichern, zeigen ─────────────────────────────────
  const beenden = useCallback(
    (
      restZeile: {
        chars: number;
        errors: number;
        ms: number;
        letters: KeyEvent[];
        wartezeitMs?: number;
        zeilenwechselMs?: number;
      } | null,
      art: { textZuEnde?: boolean; frueherAbgegeben?: boolean },
    ) => {
      if (!plan || fertig.current) return;
      fertig.current = true;
      const s = summe.current;
      /*
        ★★★★★ DAS TEMPO NACH DER PRÜFUNGSUHR (Bauplan F1c, `eineMessart.ts`).
        Bis 18.09.2026 war der Nenner die SUMME DER ZEILENZEITEN - ohne die Zeit
        vor dem ersten Anschlag jeder Zeile, ohne das erste Zeichen, gekappt an
        der Pausentoleranz. Jetzt: die Uhr vom ersten Anschlag bis zur Abgabe
        (höchstens die gewährte Zeit), minus Zuhören (auch der Zeilenansagen und
        der angefangenen Zeile) und minus Zeilenwechsel. Überlegen zählt voll.
      */
      const endeMs = Date.now();
      const zeitMs = dauerMsFuer(plan, stand);
      const wartezeitMs = wartezeitRef.current + Math.max(0, restZeile?.wartezeitMs ?? 0);
      const zeilenwechselMs =
        zeilenwechselRef.current + Math.max(0, restZeile?.zeilenwechselMs ?? 0);
      const schreibMs = schreibzeitNachUhr({
        uhrMs: pruefungsUhrMs(stand.beginnMs, endeMs, zeitMs),
        zuhoerMs: wartezeitMs,
        zeilenwechselMs,
      });
      /*
        ★★ Wo das Kind aufgehört hat: die Zeile, an der es zuletzt stand - auch
        wenn sie schon im nächsten Text liegt. Die Lehrkraft-Seite lässt die
        nächste Challenge an der Zeile danach beginnen.
        Steht keine Liste bereit (Neuladen nach Ablauf der Zeit), wird ab der
        Startstelle gezählt; über ein Textende hinaus rechnet `normiereStelle`
        beim Lesen richtig weiter.
      */
      const ende = hatZeilen
        ? folge.stellen[Math.min(s.zeilen, folge.stellen.length - 1)]
        : { textNr: plan.textNr, zeile: planStartZeile + s.zeilen };
      const fertigesErgebnis = werteAus({
        probeId: plan.id,
        niveau: plan.niveau,
        // ★ W2b: der Weg des TEXTES (bei einem Kind auf anderem Weg seiner) -
        // die Lehrkraft-Seite rechnet die nächste Startstelle nur aus Kindern
        // desselben Weges (`SchreibprobeKasten`, `alleEnden`).
        lernweg: probenWeg,
        textNr: plan.textNr,
        textTitel: startTitel,
        startZeile: planStartZeile,
        endeTextNr: ende.textNr,
        endeZeile: ende.zeile,
        beginnMs: stand.beginnMs,
        endeMs,
        zeitMs,
        // Der GEWÄHRTE Zuschlag, nicht der eingestellte: Wer keinen hat,
        // bekommt in seiner Auswertung auch keine Zeile darüber.
        zuschlagProzent: stand.zuschlag ? plan.zuschlagProzent : 0,
        wartezeitMs,
        zeilenwechselMs,
        zeichen: s.zeichen + (restZeile?.chars ?? 0),
        fehler: s.fehler + (restZeile?.errors ?? 0),
        zeilen: s.zeilen,
        schreibMs,
        anschlaege: [...anschlaege.current, ...(restZeile?.letters ?? [])],
        layout: activeLayout().id,
        textZuEnde: art.textZuEnde === true,
        frueherAbgegeben: art.frueherAbgegeben === true,
      });
      setErgebnis(fertigesErgebnis);
      void gibAb(fertigesErgebnis);
    },
    [plan, folge, hatZeilen, startTitel, stand, gibAb, probenWeg, planStartZeile],
  );

  /**
   * ★★★★★ „FREIES SCHREIBEN" ABGEBEN (23.09.2026, Bauplan §7) - der Zwilling
   * von {@link beenden}, für den freien Modus. Anders als dort wird HIER
   * nicht Zeichen für Zeichen mitgezählt: Die ganze Wertung entsteht erst
   * jetzt, auf einen Schlag, über den WORTSTROM (`vergleicheFrei`,
   * `freiVergleich.ts`) - Soll-Zeilen gegen Ist-Zeilen, ab der Startstelle
   * des Plans, so viele wie es fertige (plus die angefangene) Ist-Zeilen
   * gibt. `folge.zeilen`/`folge.stellen` sind dieselbe STABILE Liste über
   * die ganze Probe (auch über ein Neuladen hinweg, siehe `beenden` oben) -
   * `zeilenFertig` zeigt darum immer auf die richtige Stelle.
   *
   * `restIst`: die angefangene Zeile, wie sie bei einem Stopp mitten im
   * Schreiben stand (`FreieSchreibzeile.onStopp`) - oder `null`/leer, wenn
   * nichts mehr offen ist (`onSessionDone`, ein Stopp GENAU an einer
   * Zeilengrenze, oder ein Neuladen nach Ablauf der Zeit ohne Session im
   * Baum, siehe unten). ⚠️ Eine LEERE Zeile wird NICHT angehängt - sonst
   * trüge `getippt` nach jedem Stopp, der eine Zeile sauber zu Ende schreibt,
   * einen sinnlosen leeren Eintrag mehr (die Zeile stand ja schon da, als
   * `stoppSignal` kam, aber niemand hat sie angefangen).
   */
  const beendenFrei = useCallback(
    (restIst: string | null, art: { textZuEnde?: boolean; frueherAbgegeben?: boolean }) => {
      if (!plan || fertig.current) return;
      fertig.current = true;
      const zeilenFertig = getipptRef.current.length;
      const istZeilen = restIst ? [...getipptRef.current, restIst] : [...getipptRef.current];
      const sollZeilen = hatZeilen ? folge.zeilen.slice(0, istZeilen.length) : [];
      // Gross/klein ist nur ein Fehler, wenn die Umschalttaste in diesem
      // Niveau schon gelernt ist (Bauplan §3) - dieselbe Bedingung, mit der
      // TypingSession `shiftLearned` an dieses Niveau bindet.
      const grossKleinEgal = niveauDef(plan.niveau, probenWeg)?.shift !== true;
      const v = vergleicheFrei(sollZeilen, istZeilen, { grossKleinEgal, sprache: probenWeg });
      const endeMs = Date.now();
      const zeitMs = dauerMsFuer(plan, stand);
      // ★ Kein `restZeile.wartezeitMs`/`zeilenwechselMs` wie in `beenden`:
      // `FreieSchreibzeile` meldet ihre Wartezeit schon LAUFEND über
      // `onZeilenWartezeit` (siehe unten) - dort steckt sie also schon in
      // `wartezeitRef`. Der Zeilenwechsel ist im freien Modus immer 0 (der
      // Wechsel geschieht sofort, ohne Pause - Bauplan §7).
      const wartezeitMs = wartezeitRef.current;
      const zeilenwechselMs = zeilenwechselRef.current;
      const schreibMs = schreibzeitNachUhr({
        uhrMs: pruefungsUhrMs(stand.beginnMs, endeMs, zeitMs),
        zuhoerMs: wartezeitMs,
        zeilenwechselMs,
      });
      const ende = hatZeilen
        ? folge.stellen[Math.min(zeilenFertig, folge.stellen.length - 1)]
        : { textNr: plan.textNr, zeile: planStartZeile + zeilenFertig };
      const fertigesErgebnis = werteAus({
        probeId: plan.id,
        niveau: plan.niveau,
        // ★ W2b: der Weg des TEXTES (bei einem Kind auf anderem Weg seiner) -
        // die Lehrkraft-Seite rechnet die nächste Startstelle nur aus Kindern
        // desselben Weges (`SchreibprobeKasten`, `alleEnden`).
        lernweg: probenWeg,
        textNr: plan.textNr,
        textTitel: startTitel,
        startZeile: planStartZeile,
        endeTextNr: ende.textNr,
        endeZeile: ende.zeile,
        beginnMs: stand.beginnMs,
        endeMs,
        zeitMs,
        zuschlagProzent: stand.zuschlag ? plan.zuschlagProzent : 0,
        wartezeitMs,
        zeilenwechselMs,
        zeichen: v.zeichen,
        fehler: v.fehler,
        zeilen: zeilenFertig,
        schreibMs,
        // ★ Keine Tasten-Statistik im freien Modus: Ohne Zeichen-für-Zeichen-
        // Vergleich gibt es keine Zuordnung Taste↔Soll - jede Taste wäre
        // „dran" und nie „falsch". Siehe Bauplan §7.
        anschlaege: [],
        layout: activeLayout().id,
        textZuEnde: art.textZuEnde === true,
        frueherAbgegeben: art.frueherAbgegeben === true,
        modus: "frei",
        korrekturen: korrekturenRef.current,
        fehlerArten: v.fehlerArten,
        fehlerStellen: v.stellen,
        getippt: istZeilen,
      });
      setErgebnis(fertigesErgebnis);
      void gibAb(fertigesErgebnis);
    },
    [plan, folge, hatZeilen, startTitel, stand, gibAb, probenWeg, planStartZeile],
  );

  /**
   * ── Zeit um ⇒ Schluss ─────────────────────────────────────────────────────
   *
   * `stoppSignal` ist ein ZÄHLER (siehe TypingSession): Die ANGEFANGENE Zeile
   * wird gemeldet, statt beim Aushängen verloren zu gehen - bei zehn Minuten
   * Prüfungszeit sind das bis zu 40 Zeichen, und sie fehlen ausgerechnet dem
   * Kind, das gerade am schnellsten schrieb. `stoppGesendet` verhindert, dass
   * der nächste Takt ein zweites Signal schickt.
   *
   * ⚠️⚠️ **Steht gar keine Session im Baum, wird DIREKT ausgewertet.** Das ist
   * kein Randfall: Wer die Seite neu lädt, nachdem seine Zeit abgelaufen ist,
   * hat `phase === "laeuft"` und `rest === 0`, aber noch keinen Text geladen.
   * Das Stopp-Signal ginge dann an niemanden - und `TypingSession` merkt sich
   * beim Einhängen den Zählerstand, den sie vorfindet, meldet also auch später
   * nichts mehr. Die Probe liefe ewig weiter und käme nie bei der Lehrkraft an.
   * Eine angefangene Zeile gibt es in diesem Fall ohnehin nicht.
   * (Im Rauchtest gefunden, nicht im Kopf.)
   */
  useEffect(() => {
    if (phase !== "laeuft" || fertig.current || stoppGesendet.current) return;
    if (rest > 0) return;
    grund.current = "zeit";
    stoppGesendet.current = true;
    if (!sessionSichtbar) {
      // ★ 23.09.2026: derselbe Randfall gilt für „Freies Schreiben" -
      // `istFreiesSchreiben(plan)` entscheidet, welcher der beiden Zwillinge
      // ruft (siehe {@link beendenFrei}).
      if (istFreiesSchreiben(plan)) beendenFrei(null, {});
      else beenden(null, {});
      return;
    }
    setStoppSignal((n) => n + 1);
  }, [phase, rest, sessionSichtbar, plan, beenden, beendenFrei]);

  // Nach dem Abgeben steht der Fokus auf der Ergebnis-Überschrift (R1-R6).
  // Gesucht wird IM eigenen Kasten, nicht über eine feste `id`: Dieselbe Karte
  // steht in der Statistik mehrfach untereinander.
  useEffect(() => {
    if (!ergebnis || fokusGesetzt.current) return;
    // ⚠️ Nicht nur an `ergebnis` hängen: Gezeigt wird die Karte erst, wenn
    // AUCH die Phase auf „abgegeben" steht. Fällt das in denselben Takt
    // (der Normalfall), greift der erste Lauf; sonst der Lauf danach. Der
    // Riegel verhindert, dass der Fokus später noch einmal hierher springt -
    // ein Kind, das schon weitergegangen ist, verlöre ihn sonst.
    const titel = ergebnisKasten.current?.querySelector<HTMLElement>("[data-probe-titel]");
    if (!titel) return;
    fokusGesetzt.current = true;
    titel.focus();
  }, [ergebnis, phase]);

  // ★ E1 (24.09.2026): Niveau und Zeichenvorrat aus dem Weg des PLANS - die
  // ganze Klasse schreibt denselben Text (Bauplan §5.3). `probenWeg` ist
  // schon oben (beim Nachladen der Bank) berechnet - hier nur weiterverwendet.
  const unlocked = useMemo(
    () => (niveau ? zeichenVorrat(niveau, probenWeg, probenGrundreihe) : new Set<string>()),
    [niveau, probenWeg, probenGrundreihe],
  );
  const niveauInfo = niveau ? niveauDef(niveau, probenWeg, probenGrundreihe) : null;
  const niveauText = niveauInfo ? niveauTexte(niveauInfo, sprache) : null;
  const rat = ratVorlesen(sprache);
  const dauerSatz = plan
    ? // Einen Zeitzuschlag je Kind gibt es seit 10.09.2026 nicht mehr.
      t.dauerMinuten(plan.dauerMin)
    : "";

  /**
   * Der Live-Bereich für die eine ausdrückliche Nachfrage. Er steht in JEDER
   * Phase im Baum: Ein Live-Bereich, der erst mit seiner ersten Meldung
   * entsteht, verschluckt genau diese Meldung.
   */
  const nachfrageBereich = (
    <div className="sr-only" role="status" aria-live="assertive">
      {nachfrage}
    </div>
  );

  // ── Was gezeigt wird ──────────────────────────────────────────────────────

  if (!plan) return null;

  // ★ „verpasst" zeigt BEWUSST nichts. Das Einstiegsfenster ist zu und dieses
  // Kind hat nie begonnen; eine Karte darüber wäre ein Vorhalt, und wir
  // schreiben nie etwas gegen ein Kind ([[feedback_nie_gegen_das_kind]]). Das
  // Kind übt normal weiter, die Lehrkraft sieht es in ihrer Liste.
  if (phase === "keine" || phase === "verpasst") return null;

  // ── Abgegeben ─────────────────────────────────────────────────────────────
  if (phase === "abgegeben") {
    return (
      <div ref={ergebnisKasten}>
        {nachfrageBereich}
        {ergebnis ? (
          <SchreibprobeErgebnis
            ergebnis={ergebnis}
            onWeiter={weiterUeben}
            hinweis={ergebnisUnterwegs ? t.unterwegs : undefined}
          />
        ) : (
          // Kein Ergebnis im Speicher: Das Kind hat die Seite neu geladen oder
          // an einem anderen Gerät abgegeben. Die Zahlen liegen am Server und
          // stehen in der eigenen Statistik - hier bleibt die Feststellung.
          <div className="card mx-auto w-full max-w-prose p-5">
            <h2
              data-probe-titel
              tabIndex={-1}
              className="m-0 text-xl font-semibold text-ink outline-none"
            >
              {t.abgegebenTitel(wort)}
            </h2>
            <p className="mb-0 mt-2 text-ink-soft">
              {ergebnisUnterwegs ? t.unterwegsText : t.abgegebenText}
            </p>
            <div className="mt-6">
              <button type="button" className="btn-primary" onClick={weiterUeben}>
                {t.weiterUeben}
              </button>
              <p className="mb-0 mt-2 text-sm text-ink-muted">{t.escapeAuch}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Phase „offen": der Startbildschirm ────────────────────────────────────
  //
  // ⚠️ Er steht VOR dem Lade-Zweig, und das ist eine Reparatur: In der ersten
  // Fassung kam „Der Text wird geladen …" zuerst - ein Kind sah dann weder
  // „Beginnen" noch den zweiten Weg, solange der Text unterwegs war. Der
  // Startbildschirm braucht den Text gar nicht; gebraucht wird er erst, wenn
  // wirklich geschrieben wird. Gefunden im Rauchtest, nicht im Kopf.
  if (phase === "offen" && !gestartet) {
    return (
      <>
        {nachfrageBereich}
        <Markierung>
          <div className="card mx-auto w-full max-w-prose p-5 sm:p-6">
            {/* ★ E7 (11.09.2026): `text-xl` statt `text-3xl`. */}
            <p className="m-0 rounded-xl bg-warning-soft px-3 py-1 text-center text-xl font-bold tracking-wide text-ink">
              {wort}
            </p>
            <p className="mt-4 text-lg text-ink">{t.zeitAbErstem}</p>
            <dl className="m-0 mt-2">
              <div className="flex flex-wrap gap-x-2 py-1">
                <dt className="m-0 text-ink-soft">{t.dauer}</dt>
                <dd className="m-0 font-medium text-ink">{dauerSatz}</dd>
              </div>
              <div className="flex flex-wrap gap-x-2 py-1">
                <dt className="m-0 text-ink-soft">{t.niveau}</dt>
                <dd className="m-0 font-medium text-ink">{niveauText?.label ?? plan.niveau}</dd>
              </div>
              <div className="flex flex-wrap gap-x-2 py-1">
                {/* Diese Uhr steht NICHT in einem Live-Bereich und meldet
                    darum nichts - sie darf gelesen werden. Sie zählt das
                    Einstiegsfenster herunter, nicht die Prüfungszeit. */}
                <dt className="m-0 text-ink-soft">{t.zumBeginnen}</dt>
                <dd className="m-0 font-medium tabular-nums text-ink">
                  {mmss(einstiegRestMs(plan, jetzt))}
                </dd>
              </div>
            </dl>
            {/* ★ 23.09.2026 („Freies Schreiben", Bauplan §7): nur in diesem
                Modus - ein Kind soll VOR dem Start wissen, dass hier nicht
                „erst richtig, dann weiter" gilt. */}
            {istFreiesSchreiben(plan) && <p className="mt-3 text-ink-soft">{t.freiHinweis}</p>}
            {/*
              ★★★ DIE ZWEI SÄTZE ZUM VORLESEN (Johannes 10.09.2026).

              Sie stehen hier und nicht in der Hilfe, weil sie GENAU JETZT
              gebraucht werden: Wer gleich anfängt, kann sein Vorlesen noch
              einschalten. Eine Minute später ist es zu spät.

              Warum sie stimmen, steht in
              `BEFUND-2026-09-10-VORLESEZEIT-GEMESSEN.md`: Sarah wartet je
              Zeichen 102 ms auf die Ansage, Tester 13,8 - die App zieht beiden
              genau ihre eigene Zeit ab. Wer statt der Vorlesefunktion den
              Screenreader benutzt, erzeugt nichts Messbares und bekommt darum
              nichts abgezogen.
            */}
            <div className="mt-4 rounded-xl bg-surface-sunken px-3 py-2 text-sm text-ink-soft">
              {/* ★ Seit 11.09.2026 (D4) ohne Häkchen: Vorlesen richtet sich
                  nach der eigenen Einstellung des Kindes, wie beim Üben. */}
              <p className="m-0">{rat.stattScreenreader}</p>
              <p className="m-0 mt-1">{rat.tempoBringtNichts}</p>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setGestartet(true);
                  // Fokusziel des Schalters: das Tippfeld. Es entsteht erst
                  // mit dieser Handlung - `focusPracticeField` hält die
                  // Anforderung offen, bis das Feld da ist.
                  focusPracticeField();
                }}
              >
                {t.beginnen}
              </button>
              {/*
                ★★★ DER ZWEITE WEG - er muss da sein. Eine versehentlich
                gestartete Schreibprobe darf ein Kind nicht vom Üben aussperren.
                Zurückhaltend im Aussehen, ohne Vorwurf im Wortlaut, ohne
                Rückfrage: Wer nicht mitschreibt, hat dafür einen Grund, und der
                gehört ihm.
              */}
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  melde();
                  focusPracticeField();
                }}
              >
                {t.nichtMit}
              </button>
            </div>
          </div>
        </Markierung>
      </>
    );
  }

  // Der Text ist unterwegs oder es gibt ihn nicht. Beides ist harmlos für die
  // Uhr: Sie beginnt mit dem ersten Anschlag, und ohne Text gibt es keinen.
  // ⚠️ Fehlt er dauerhaft, MUSS der zweite Weg hier stehen - sonst sperrt eine
  // Schreibprobe, deren Text nicht lädt, ein Kind vom Üben aus.
  // Geladen, aber ohne eine einzige Zeile (Starttext fehlt) zählt wie „fehlt".
  const ohneText = textFehlt || (texte !== null && !hatZeilen);
  if (!hatZeilen) {
    return (
      <>
        {nachfrageBereich}
        <Markierung>
          <div className="card mx-auto w-full max-w-prose p-5">
            <h2 className="m-0 text-xl font-semibold text-ink">{wort}</h2>
            <p className="mb-0 mt-2 text-ink-soft">{ohneText ? t.textFehlt : t.textLaedt}</p>
            {ohneText ? (
              <div className="mt-4">
                <button
                  type="button"
                  className="btn-secondary btn-umriss"
                  onClick={() => {
                    melde();
                    focusPracticeField();
                  }}
                >
                  {t.weiterUeben}
                </button>
              </div>
            ) : null}
          </div>
        </Markierung>
      </>
    );
  }

  // ── Phase „laeuft": geschrieben wird ──────────────────────────────────────
  const kopf = (
    <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-2xl bg-warning-soft px-4 py-2">
      <p className="m-0 text-lg font-bold tracking-wide text-ink">{wort}</p>
      {/* Die Uhr steht seit dem 10.09.2026 NICHT mehr hier, sondern neben den
          Minutenstrichen über dem Feld - Uhr und Striche auf einer Zeile
          ({@link MinutenLeiste}). */}
      <div className="flex flex-wrap gap-x-3">
        <p className="m-0 text-sm text-ink-muted">{t.restzeitKuerzel(wahlText(RESTZEIT_KUERZEL, sprache))}</p>
        {/* ★ 23.09.2026: eigener Absatz - der Satz zu Alt + X bleibt Wort für Wort. */}
        <p className="m-0 text-sm text-ink-muted">{t.escapeKopf}</p>
      </div>
    </div>
  );

  // ★ 23.09.2026 („Freies Schreiben", Bauplan §7): EINMAL entschieden, welche
  // der beiden Zeilen-Komponenten diese Challenge zeigt - nie beide, nie im
  // selben Baum. `istFreiesSchreiben` ist wehrhaft (siehe `schreibprobe.ts`):
  // fehlt der Modus oder ist er kaputt, gilt STRENG, wie bisher.
  const frei = istFreiesSchreiben(plan);

  return (
    <>
      {nachfrageBereich}
      <Markierung>
        {frei ? (
          <FreieSchreibzeile
            items={folge.zeilen}
            stufe={stufe}
            voiceEnabled={voiceEnabled}
            // ★ E7a (24.09.2026): der Prüfungstext folgt dem WEG DES PLANS, nicht
            // mehr fest „de" (Bauplan §5.3: „lang=\"de\" fest an zwei Stellen ⇒
            // aus dem Weg"). Auf Weg „de" unverändert deutsch - das gilt auch für
            // eine deutsche Klasse mit englischer Übungssprache (D1): Die
            // eingebauten Bank-Texte sind dort weiterhin die deutschen.
            lang={probenWeg}
            sprache={sprache}
            zeichenabstand={zeichenabstandFaktor(account.zeichenabstand)}
            zeilenEnde={!!account.zeilenEndeEnter}
            zeilenPraefix={zeilenZeitstand(rest)}
            initialQi={startQi.current ?? 0}
            topSlot={kopf}
            fortschrittSlot={<MinutenLeiste gesamtMs={gesamtMs} restMs={rest} />}
            stoppSignal={stoppSignal}
            onZeileFertig={(e: FreieZeileFertig) => {
              getipptRef.current = [...getipptRef.current, e.ist];
              korrekturenRef.current += e.korrekturen;
              summe.current.zeilen += 1;
              eigeneZeilen.current += 1;
              // ★ Übezeit-Uhr und Wochenziel: geschrieben wurde wirklich -
              // chars = Ist-Länge, errors = 0 (im freien Modus kennt eine
              // Zeile ihre Fehler erst am Ende der ganzen Probe, über den
              // Wortstrom-Vergleich - siehe `beendenFrei`; ein Fehlgriff, der
              // mit der Rücktaste ausgebessert wurde, ist hier ohnehin keiner
              // mehr).
              onTask({
                lesson: KONTEXT_ID,
                chars: e.ist.length,
                errors: 0,
                ms: e.ms,
                activeMs: e.activeMs,
                // ★ E7a: die Übungssprache DIESER Zeile ist die des Prüfungstexts
                // (`probenWeg`), nicht mehr fest „de" - siehe `lang` an
                // FreieSchreibzeile oben. Sonst zählte englisch geschriebene
                // Übezeit in der Statistik als Deutsch (`account.ts`, `totalMsEn`).
                lang: probenWeg,
              });
              merkeFortschritt({
                ...standJetzt(),
                getippt: getipptRef.current,
                korrekturen: korrekturenRef.current,
              });
            }}
            onZeilenWartezeit={(ms, zeilenwechsel) => {
              wartezeitRef.current += ms;
              zeilenwechselRef.current += zeilenwechsel;
              merkeFortschritt({
                ...standJetzt(),
                getippt: getipptRef.current,
                korrekturen: korrekturenRef.current,
              });
            }}
            onStopp={(angefangen) => {
              korrekturenRef.current += angefangen.korrekturen;
              beendenFrei(angefangen.ist, { frueherAbgegeben: grund.current === "frueher" });
            }}
            onSessionDone={() => beendenFrei(null, { textZuEnde: true })}
          />
        ) : (
        <TypingSession
          items={folge.zeilen}
          contextId={KONTEXT_ID}
          // Alle Zeichen des NIVEAUS - nicht der Stand dieses Kindes. Die ganze
          // Klasse schreibt denselben Text (Johannes: „Alle texte für alle
          // schüler müssen genau gleich sein!").
          unlocked={unlocked}
          shiftLearned={niveauInfo?.shift === true}
          // „Einhand schreiben" ist ein Ausgleich für dieses Kind und ändert am
          // Text nichts - er gilt in der Probe genauso wie im Lehrgang.
          enforceShiftHand={!account.oneHand}
          zeichenabstand={zeichenabstandFaktor(account.zeichenabstand)}
          // ★ Zeilenende mit Enter (23.09.2026) - Klassen-Einstellung, siehe
          // TypingClass.zeilenEndeEnter. Eine Schreibprobe zählt zu den
          // Übungsarten, die die Pflicht mitbekommen (TypingSession).
          zeilenEnde={!!account.zeilenEndeEnter}
          lernweg={probenWeg}
          stufe={stufe}
          voiceEnabled={voiceEnabled}
          // Kein `speedTarget`: In einer Prüfung gibt es keine Sterne. Und kein
          // `hinweis`/`naechsteRundeHinweis` - eine Probe misst, sie unterrichtet
          // nicht.
          zeilenPauseMs={ZEILEN_PAUSE_MS}
          /*
            ★★★ DER ZEITSTAND LINKS AUF DER BRAILLEZEILE (Johannes 10.09.2026:
            „kann man den zeitstand links auf der zeile mitlaufen lassen und dann
            3 leerzeichen machen und dann beginnt der text").

            Er steht damit VOR dem Text im Eingabefeld - ein Kind mit Blindheit
            liest ihn mit dem Finger, ohne eine Taste zu drücken und ohne dass
            eine Meldung die Zeile verdrängt. `zeilenZeitstand` hält die Breite
            fest bei acht Zellen; sonst wanderte der Text beim Sprung von 10:00
            auf 9:59 um eine Stelle.

            ⏳ Mit echter Braillezeile NICHT nachgemessen - siehe die Übergabe.
          */
          zeilenPraefix={zeilenZeitstand(rest)}
          // Nach einem Neuladen dort weiter, wo es aufhörte - siehe
          // `startQi` oben. Ohne das zählte ein Neuladen die schon
          // geschriebenen Zeilen ein zweites Mal.
          initialQi={startQi.current ?? 0}
          // ★ F1c: Die Zeilen-Uhr ab der Anzeige (`eineMessart.ts`). Läuft
          // die Prüfungsuhr schon (Neuladen mitten in der Challenge), misst
          // auch die erste Zeile ab ihrem Erscheinen. Sonst startet die Uhr
          // mit dem ersten Anschlag - und die Zeile mit ihr.
          zeilenuhrAbAnzeige
          uhrLaeuftSchon={stand.beginnMs > 0}
          onItemDone={(e) => {
            summe.current.zeichen += e.chars;
            summe.current.fehler += e.errors;
            summe.current.schreibMs += e.ms;
            summe.current.zeilen += 1;
            eigeneZeilen.current += 1;
            // Übezeit-Uhr und Wochenziel: geschrieben wurde wirklich.
            onTask(e);
          }}
          wackeligeTasten={wackelig}
          onLetters={(events) => {
            anschlaege.current.push(...events);
          }}
          // Die vorgelesene Zeit einer fertigen Zeile - EINMAL gemessen, dort,
          // wo die Session sie ohnehin ausrechnet. Ein zweiter Zähler für
          // dieselbe Sache liefe unweigerlich auseinander. ★ Seit 15.09.2026
          // wirkt sie NICHT mehr auf `restMs` (die Prüfungsuhr bleibt starr,
          // wie beim Klassenmatch) - sie steckt nur noch in `schreibMs`
          // (`onItemDone` oben zieht sie je Zeile schon ab) und damit in der
          // Wertung.
          onZeilenWartezeit={(ms, zeilenwechsel) => {
            // ★ D4 (11.09.2026): kein Häkchen mehr, das den Abzug sperrt -
            // gemessen wird, wo tatsächlich auf die Stimme gewartet wurde.
            // Nur noch ein Ref, kein State: Seit 15.09.2026 hängt kein Render
            // mehr an dieser Zahl - `rest` liest sie nicht mehr (siehe oben).
            wartezeitRef.current += ms;
            zeilenwechselRef.current += zeilenwechsel; // F1c, Zeit der App
            // ⚠️ HIER und nicht in `onItemDone`: Die Session meldet je fertiger
            // Zeile in dieser Reihenfolge `onItemDone` (Zeichen, Fehler, Zeit),
            // dann `onLetters` (die Anschläge), dann diese Wartezeit. Erst
            // jetzt ist die Zeile vollständig - wer früher merkt, merkt sie
            // ohne ihre Anschläge, und die wackligen Tasten fehlten nach einem
            // Neuladen.
            merkeFortschritt(standJetzt());
          }}
          stoppSignal={stoppSignal}
          onStopp={(restZeile) =>
            beenden(restZeile, { frueherAbgegeben: grund.current === "frueher" })
          }
          onSessionDone={() => beenden(null, { textZuEnde: true })}
          // Es gibt kein „Nochmal" in einer Prüfung. Die Abschluss-Karte der
          // Session wird nie sichtbar: Sobald `beenden` gelaufen ist, steht hier
          // das Ergebnis, und die Session ist aus dem Baum.
          onRetry={() => {}}
          topSlot={kopf}
          // Ein Strich je MINUTE statt je Zeile, die Uhr daneben.
          fortschrittSlot={<MinutenLeiste gesamtMs={gesamtMs} restMs={rest} />}
          // ★ E7a (24.09.2026): der Weg des PLANS entscheidet, nicht mehr fest
          // „de" (Bauplan §5.3) - auf Weg „de" bleibt es dabei: Die Bank-Texte
          // sind deutsch, auch wenn das Kind sonst englisch übt (D1).
          lang={probenWeg}
          // ★ Johannes 10.09.2026: „Sprachausgabe soll weitersprechen, wenn
          // schon getippt wird." Die Fairness bleibt: Wer tippt, während die
          // Stimme spricht, bekommt dafür keine Zeit abgezogen (`typingGapMs`).
          satzAusreden
          // ★ Wörter, die das Wörterbuch kennt, werden nicht buchstabiert.
          zusatzWoerter={woerter}
        />
        )}
        <div className="mt-3 flex justify-center">
          {/*
            Für ein Kind, das früher fertig ist. Nichts wird je `disabled`: Ist
            die Auswertung schon unterwegs, sagt der Handler es, statt den
            Schalter tot zu stellen.
          */}
          <button
            type="button"
            className="btn-secondary btn-umriss"
            aria-disabled={stoppSignal > 0 || undefined}
            onClick={frueherAbgeben}
          >
            {t.abgeben}
          </button>
        </div>
      </Markierung>
      {frageOffen && (
        <Modal title={t.frageTitel(wort)} onClose={weiterschreiben} initialFocus={weiterschreibenRef}>
          <div className="space-y-3">
            <p className="m-0 text-ink">{t.frage(wort)}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <button type="button" ref={weiterschreibenRef} className="btn-primary" onClick={weiterschreiben}>
                {t.weiterschreiben}
              </button>
              <button type="button" className="btn-secondary btn-umriss" onClick={abgebenBestaetigt}>
                {t.jetztAbgeben}
              </button>
            </div>
            <p className="m-0 text-sm text-ink-muted">{t.escapeZeile}</p>
          </div>
        </Modal>
      )}
    </>
  );
}
