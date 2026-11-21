/**
 * ★★★ O-IT (02.10.2026): DAS HILFE-FENSTER FÜR DIE LERNENDEN, ITALIENISCH.
 * ===========================================================================
 * Aus der Funktion geschrieben, nach dem Aufbau von `TippenHilfe.es.tsx`
 * (dieselben Abschnitte, `detail`-Stufen, `isAdult`/`jugend`-Fälle) - nicht
 * Satz für Satz aus dem Deutschen übertragen. Wie Englisch, Französisch und
 * Spanisch ohne den Einführungs-Podcast (die italienische Bedienung hat keinen).
 *
 * ── ANREDE (Glossar `recherche-italienisch-2026-10-02/GLOSSAR-it.md`) ──────────
 * Immer **tu** - Kinder UND Selbstlernende (Regel 1). „l'insegnante", nie „il
 * tuo/la tua insegnante" (Regel 2). Lob ohne Adjektiv-Endung, höchstens ein
 * Ausrufezeichen je Absatz für Kinder. „senza guardare la tastiera" (Regel 4).
 *
 * ── WAS ITALIENISCH ANDERS IST ──────────────────────────────────────────────
 *  · Die Reihenfolge des italienischen Lehrgangs ist noch nicht gebaut
 *    (Etappe F4) - der Abschnitt dazu beschreibt sie darum allgemein und zeigt
 *    die Buchstaben des Weges, auf dem das Kind wirklich übt.
 *  · Tastaturen: Italien (Windows „Italiano", Mac „Italiano - Pro") und Mac
 *    „Italiano" (QZERTY), dazu die Schweizer Tastatur fürs Tessin
 *    (`layouts.ts`, nur gelesen). Die Akzentbuchstaben à è ì ò ù haben eigene
 *    Tasten, é ist Maiusc + è; die Grossbuchstaben mit Akzent gibt es unter
 *    Windows nicht (Hinweis „E'" ist kein Fehler, Bauplan I5).
 *  · Das Plakat gibt es auf Italienisch noch nicht - der Abschnitt bietet das
 *    englische an (`handbuchInSprache`).
 *
 * Tastennamen wie auf der italienischen Kappe (Glossar §2.9): Maiusc, Bloc
 * Maiusc, Invio, Backspace, barra spaziatrice, Alt Gr, Esc; Mac: Opzione.
 * Nur Bindestrich, gerade Anführungszeichen, keine Maus-Wörter.
 */
import { JawsRueckweg } from "./ScreenreaderHinweis";
import { useRef } from "react";
import {
  EINSTIEGSFENSTER_MIN,
  PRUEFUNG_WORT_IT,
  PRUEFUNG_WORT_MEHRZAHL_IT,
  layoutLetterOrder,
  skinForStufe,
  unitGlyph,
} from "@/lib/typing";
import { useFocusTrap } from "./useFocusTrap";
import { Zeichenerklaerung } from "@/lib/arbeitsblatt/Zeichenerklaerung";
import { AltText, Kbd, Section, detailFor, type TippenHilfeProps } from "./TippenHilfeTeile";
import { AltOderWahl, WeitereTasten } from "./TippenHilfeTasten";
import { RundgangNochmalKnopf } from "./Rundgang";
import { hoehleHatWesen } from "@/lib/typing/expedition/texts";
import { downloadAdresse, groesse, handbuchInSprache, tastenflowPlakat } from "@/lib/lernwerkstatt/handbuecher";

export function TippenHilfeItalienisch({ open, onClose, stufe, lernweg = "en" }: TippenHilfeProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  useFocusTrap(open, cardRef, { initialFocus: closeRef });
  if (!open) return null;

  const skin = skinForStufe(stufe);
  const isAdult = skin === "erwachsen";
  const kind = skin === "kind";
  const detail = detailFor(stufe);
  const letters = layoutLetterOrder(lernweg);
  // Das Höhlenwesen (deutsche Aufnahmen) gibt es nur auf Weg „de".
  const hoehleMitWesen = hoehleHatWesen(lernweg);
  // Dasselbe Wort wie der Ring (`UI_COPY_IT` in `skin.ts`).
  const ringWort = kind ? "livello di gioco" : "livello";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Aiuto di Tastenflow"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        className="card my-8 w-full max-w-2xl space-y-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="m-0 text-xl font-semibold text-ink">Aiuto - come funziona "Tastenflow"</h2>
          <button
            ref={closeRef}
            type="button"
            className="btn-secondary btn-toggle"
            onClick={onClose}
            aria-label="Chiudi l'aiuto"
          >
            ✕ Chiudi
          </button>
        </div>

        <RundgangNochmalKnopf onStart={onClose} />

        <Section title="Scrivi e basta">
          <p className="m-0">
            Non devi scegliere niente prima. Scrivi subito - la prima lettera va
            dritta nel campo. Se finisci da un'altra parte, <Kbd>Alt</Kbd> +{" "}
            <Kbd>E</Kbd> ti riporta subito nel campo di scrittura.
          </p>
          <JawsRueckweg weg="it" />
          {detail === 1 && (
            <p className="m-0">
              Scrivi sempre con il dito giusto - la tastiera qui sotto ti mostra
              quale tasto viene adesso. Premi due volte veloce <Kbd>Maiusc</Kbd>{" "}
              per sentire quale dito usare.
            </p>
          )}
        </Section>

        <Section title="I segni nel testo">
          <Zeichenerklaerung
            titel={null}
            zeichen={[
              { zeichen: "·", bedeutung: "separa due informazioni che vanno insieme - come una virgola." },
              { zeichen: "→", bedeutung: "poi, oppure: diventa questo." },
              { zeichen: "⏱", bedeutung: "il tuo tempo di esercizio finora." },
              {
                zeichen: "↵",
                bedeutung:
                  "compare alla fine di una riga quando la tua classe ha attivato questa impostazione - allora finisci la riga con il tasto Invio.",
              },
            ]}
          />
        </Section>

        <Section title="Prendi le stelle 🌟">
          <p className="m-0">
            Dopo ogni giro ricevi <strong>da 1 a 3 stelle</strong> - ognuna con
            il suo suono.{" "}
            <strong>Pochi errori contano molto più della velocità:</strong>{" "}
            scrivere con calma e con cura porta stelle sicure - andare di fretta
            e premere tanti tasti sbagliati, no.
            {kind ? " Tutti possono prendere le stelle!" : ""}
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Prendi 3 stelle con un giro molto buono - scritto con cura e a una
              velocità adatta, e <strong>con cura</strong> conta sempre più di{" "}
              <strong>veloce</strong>. Se metti in fila tanti giri buoni, puoi
              salire di un <strong>livello di difficoltà</strong> - e allora la
              ricompensa suona un po' diversa.
            </p>
          )}
        </Section>

        <Section title="Prendi le medaglie 🏅">
          <p className="m-0">
            Per traguardi speciali ottieni delle <strong>medaglie</strong> - per
            esempio per un giro senza nessun errore o per più giri puliti di
            fila. Quando ottieni una medaglia nuova, senti il suo{" "}
            <strong>"ta-daan"</strong> e il suo nome viene annunciato.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Tutte le tue medaglie sono in <strong>"I miei progressi"</strong>,
              subito dopo i tuoi obiettivi settimanali e i tuoi numeri - lì trovi
              sempre anche il tuo <strong>prossimo obiettivo</strong>. La maggior
              parte delle medaglie premia lo <strong>scrivere con cura</strong> e
              il <strong>non arrendersi</strong> - non la fretta. E alcune sono{" "}
              <strong>segrete</strong>: che cosa le sblocca non è scritto da
              nessuna parte - compaiono e basta.
            </p>
          )}
          {detail >= 2 && (
            <p className="m-0">
              Lì trovi anche il tuo <strong>punteggio</strong>: più cura e più
              costanza metti nello scrivere, più sale.
            </p>
          )}
          {detail >= 2 && (
            <p className="m-0">
              Più in basso, "Progressi nel tempo" (una riga che si apre) mostra
              una piccola curva.
            </p>
          )}
          <p className="m-0">
            Un consiglio: scegli una medaglia nelle tue statistiche per vederla{" "}
            <strong>in grande</strong> - con scintille e coriandoli.
          </p>
        </Section>

        {skin === "jugend" && (
          <Section title="Dopo un tasto nuovo">
            <p className="m-0">
              Un <strong>tasto nuovo</strong> è tuo appena i tasti di prima ti
              vengono sicuri - non devi vincere niente per averlo. Si festeggia e
              vai avanti. Niente di più.
            </p>
            <p className="m-0">
              Se vuoi, dopo può venire un breve gioco:{" "}
              <strong>il Gioco dei lastroni</strong>. Lo scegli tu - nelle{" "}
              <strong>impostazioni</strong> (<AltText>Alt + O</AltText>), in{" "}
              <strong>Gioco premio</strong>. All'inizio è su{" "}
              <strong>Nessuno</strong>. Questa impostazione vale per questo
              dispositivo.
            </p>
          </Section>
        )}

        {!isAdult && (
          <Section title="Il Gioco dei lastroni 🐧">
            {skin === "jugend" ? (
              <>
                <p className="m-0">
                  Puoi <strong>avviarlo tu quando vuoi</strong> - con il pulsante{" "}
                  <strong>Gioca</strong> nella riga sotto il campo di scrittura.
                  Il pinguino salta da un lastrone all'altro, sale sulla montagna
                  di lettere e scende scivolando sulla pancia - sempre con i
                  tasti che adesso ti riescono meno. Lungo la strada saltano
                  fuori dall'acqua dei <strong>pesci bonus</strong> (se premi in
                  tempo il tasto di un pesce, lo prendi; lasciarlo scappare non
                  conta mai come errore), e nella <strong>Grotta dell'eco</strong>{" "}
                  ogni tasto viene solo annunciato. Il gioco{" "}
                  <strong>non conta</strong> come tempo di esercizio e non serve
                  per sbloccare tasti nuovi - ma ha le sue medaglie.
                </p>
                <p className="m-0">
                  Dopo un tasto nuovo parte <strong>solo</strong> se l'hai scelto
                  come <strong>gioco premio</strong> nelle impostazioni.
                  Altrimenti niente ti interrompe - decidi tu quando giocare.
                </p>
              </>
            ) : (
              <>
                <p className="m-0">
                  Quando ottieni un <strong>tasto nuovo</strong>, il Gioco dei
                  lastroni ti aspetta per festeggiare: aiuta il pinguino ad
                  attraversare l'acqua - premi sempre il tasto del prossimo
                  lastrone. A volte, dopo, sali perfino sulla{" "}
                  <strong>montagna di lettere</strong> e scendi scivolando sulla
                  pancia. Il tasto nuovo è già tuo prima di giocare - il gioco è
                  un premio, non un obbligo.
                </p>
                <p className="m-0">
                  Puoi anche <strong>avviare il gioco tu quando vuoi</strong> - con
                  il pulsante <strong>Gioca</strong> in alto nella tua scheda di
                  esercizio, proprio accanto all'anello. È la grande{" "}
                  <strong>avventura</strong>: cambia un po' ogni giorno, lungo la
                  strada saltano dei <strong>pesci bonus</strong> (premi veloce il
                  loro tasto per prenderli), e nella <strong>Grotta
                  dell'eco</strong> non vedi nessuna lettera -{" "}
                  {hoehleMitWesen ? (
                    <>
                      la grotta ti <strong>dice</strong> ogni tasto.
                    </>
                  ) : (
                    <>
                      ogni tasto suona, e il lettore di schermo o il display
                      braille ti <strong>dice</strong> quale è.
                    </>
                  )}{" "}
                  È solo per divertimento e <strong>non conta</strong> come tempo
                  di esercizio - ma ci sono medaglie da prendere!
                </p>
                {detail >= 2 && (
                  <p className="m-0">
                    Non preoccuparti: se un lastrone affonda o scivoli sulla
                    montagna, il pinguino torna a nuoto e basta - puoi riprovare
                    subito, tutte le volte che vuoi. E se attraversi tutta
                    l'avventura senza cadere in acqua neanche una volta, vedrai
                    danzare <strong>l'aurora boreale</strong> sopra l'igloo!
                  </p>
                )}
              </>
            )}
          </Section>
        )}

        <Section title="Che cosa significa l'anello con il numero?">
          <p className="m-0">
            Il numero nell'anello è il tuo <strong>{ringWort}</strong>.{" "}
            <strong>I punti sono quello che guadagni esercitandoti:</strong> ne
            ricevi alcuni a ogni giro, e l'anello si riempie. Quando è pieno (100
            punti), sali di un {ringWort}. Serve solo da collezionare,{" "}
            <strong>non</strong> rende più difficile l'esercizio - come i punti
            di un gioco.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Non confonderlo con il <strong>livello di difficoltà (1-50)</strong>:
              indica a che velocità dovresti scrivere e si adatta a te{" "}
              <strong>da solo</strong> - sale quando va bene e scende quando è
              troppo difficile.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0">
              E i <strong>testi adatti all'età</strong> decidono solo quanto sono
              difficili le parole e le frasi - perché vadano bene per la tua età.
              In una classe li sceglie l'insegnante per tutto il gruppo; senza
              classe, li trovi in alto nelle impostazioni ⚙. Sono tre cose
              diverse: il <em>{ringWort}</em> = i punti, il{" "}
              <em>livello di difficoltà</em> = la velocità che ci si aspetta, i{" "}
              <em>testi adatti all'età</em> = la tua età.
            </p>
          )}
        </Section>

        <Section title={detail === 1 ? "Ogni quanto esercitarsi?" : "Tempo di esercizio e obiettivo settimanale"}>
          {detail === 1 ? (
            <p className="m-0">
              È meglio esercitarsi <strong>poco e spesso</strong> che una volta
              sola per tanto tempo - per esempio qualche minuto per più giorni di
              fila. Nella riga sotto il campo di scrittura un orologio conta
              quanto hai scritto oggi; lo stesso tempo riempie anche l'
              <strong>anello</strong> che c'è lì - il tuo obiettivo settimanale.
            </p>
          ) : (
            <p className="m-0">
              Con un account puoi avere un <strong>obiettivo settimanale</strong>:
              un numero di <strong>minuti alla settimana</strong>. In una classe
              lo sceglie l'insegnante; senza classe, lo scegli tu nelle
              impostazioni ⚙, in "Il mio obiettivo settimanale" - un obiettivo
              nuovo vale dal lunedì successivo. La settimana inizia{" "}
              <strong>il lunedì alle 8:00</strong> e finisce il lunedì dopo alle
              8:00. Nella riga sotto il campo di scrittura i tuoi progressi
              compaiono come un <strong>anello</strong>, per esempio "25 di 60
              min" - quando raggiungi l'obiettivo, è pieno e ha un segno di
              spunta. A volte ci sono anche minuti di una settimana precedente da{" "}
              <strong>recuperare</strong>; allora il numero compare accanto.
              Quando raggiungi il tuo obiettivo settimanale, si apre una breve
              finestra per festeggiare - poi puoi continuare a esercitarti quando
              vuoi.
            </p>
          )}
        </Section>

        <Section title="Impostazioni ⚙ nell'intestazione">
          <p className="m-0">
            Tutte le impostazioni sono dietro il pulsante{" "}
            <strong>⚙ Impostazioni</strong>, in cima, subito a sinistra del
            pulsante rotondo con la tua iniziale:{" "}
            <strong>Che cosa eserciti?</strong>, <strong>Testi</strong> (età e
            lingua), <strong>Tastiera</strong>, <strong>Suono</strong> e{" "}
            <strong>Lettura ad alta voce</strong>. Premilo una volta per aprire e
            ancora una volta per chiudere - oppure usa <Kbd>Alt</Kbd> +{" "}
            <Kbd>O</Kbd>, che funziona anche mentre scrivi. Quando si apre, il
            cursore salta subito lì; quando si chiude, torna nel campo di
            scrittura.
          </p>
          <p className="m-0">
            In alto nelle impostazioni c'è <strong>"Che cosa eserciti?"</strong>:
            i tre modi di esercitarsi, <strong>Il mio allenamento</strong>,{" "}
            <strong>Storie</strong> e <strong>Giochi di parole</strong>.{" "}
            <Kbd>Alt</Kbd> + <Kbd>B</Kbd> passa al successivo, e la nuova scelta
            viene annunciata.
          </p>
          <p className="m-0">
            Il pulsante rotondo con il globo, nell'intestazione, cambia la lingua
            di Tastenflow - pulsanti, menu e anche i tuoi testi di esercizio;
            dopo puoi cambiare solo la lingua dei testi, in{" "}
            <strong>Testi</strong>, a meno che l'insegnante non l'abbia già
            fissata.
          </p>
          <p className="m-0">
            In <strong>Tastiera</strong> scegli la tastiera che hai davvero
            davanti: italiana (Windows o Mac) oppure svizzera, per esempio nel
            Canton Ticino. La tastiera sullo schermo e i suggerimenti per le dita
            si adattano - e ricevi solo i caratteri che esistono su quella
            tastiera. Ecco le cose più importanti della tastiera italiana:
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              Le lettere con l'accento <strong>à, è, ì, ò, ù</strong> hanno tasti
              propri; la <strong>é</strong> si scrive con <Kbd>Maiusc</Kbd> e il
              tasto <Kbd>è</Kbd>.
            </li>
            <li>
              Le <strong>maiuscole con l'accento</strong> (À, È …) su Windows non
              hanno un tasto. Se scrivi <strong>E'</strong> al posto di{" "}
              <strong>È</strong>, va bene così - non è un errore.
            </li>
            <li>
              La <strong>@</strong> si scrive con <Kbd>Alt Gr</Kbd> +{" "}
              <Kbd>ò</Kbd>, il <strong>#</strong> con <Kbd>Alt Gr</Kbd> +{" "}
              <Kbd>à</Kbd>.
            </li>
            <li>
              Sul Mac, la tastiera "Italiano" (non "Pro") è diversa: z e w sono
              scambiate, e i numeri si scrivono con <Kbd>Maiuscole</Kbd>.
            </li>
          </ul>
          <p className="m-0">
            Lì c'è anche <strong>"Scrivere con una mano"</strong> - per chi
            scrive con una mano sola: le maiuscole e i segni contano allora con
            qualsiasi tasto Maiusc. In una classe, questo lo regola
            l'insegnante.
          </p>
          <p className="m-0">
            Con <strong>"Spaziatura (CVI)"</strong>, mentre scrivi tutto si
            scurisce tranne il campo in cui scrivi (la riga di esercizio o la
            zona di gioco); dopo 5 secondi senza premere nessun tasto, tutto
            torna chiaro. La riga di esercizio avanza al tuo ritmo invece di
            saltare. La spaziatura la cambi tu nelle impostazioni ⚙ quando vuoi -
            in una classe può cambiarla anche l'insegnante; vale l'ultima scelta.
          </p>
          <p className="m-0">
            Con <strong>Esercizio mirato</strong> puoi scegliere fino a 8 tasti o caratteri che compaiono particolarmente spesso nelle serie - nelle impostazioni, sotto <strong>Che cosa eserciti?</strong>, oppure con <Kbd>Alt</Kbd> + <Kbd>2</Kbd>. In una classe lo imposta l'insegnante.
          </p>
        </Section>

        <Section title="Lettura ad alta voce - il programma legge per te">
          <p className="m-0">
            Con <strong>🗣 Lettura ad alta voce</strong> (o <Kbd>Alt</Kbd> +{" "}
            <Kbd>V</Kbd>) il programma legge per te - per chi non usa (ancora) un
            lettore di schermo. In alto nelle impostazioni ⚙ scegli se leggere
            ad alta voce i <strong>tasti</strong> (tasto per tasto), le{" "}
            <strong>parole</strong> e/o le <strong>frasi</strong>, e a che
            velocità.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              In <strong>"Voce"</strong> puoi scegliere un'altra voce. Se la
              lingua è l'<strong>italiano</strong>, il programma cerca da solo una
              voce italiana; se non ce n'è nessuna installata, una breve guida ti
              mostra come aggiungerla.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0">
              Non preoccuparti della tua velocità: il{" "}
              <strong>tempo di lettura viene tolto</strong> - aspettare la fine di
              un annuncio non abbassa la tua velocità.
            </p>
          )}
        </Section>

        <Section title="La melodia mentre scrivi 🎵">
          <p className="m-0">
            La <strong>melodia mentre scrivi</strong> serve a esercitare un <strong>ritmo di scrittura regolare</strong> e deve soprattutto essere <strong>divertente</strong>. Ogni tasto giusto suona la nota successiva di un brano; se resti a tempo, si unisce perfino una band.
          </p>
          <p className="m-0">
            Chi scrive in modo regolare diventa più scorrevole anche sui tasti più deboli: il ritmo ti porta oltre i punti in cui altrimenti esiteresti.
          </p>
          <p className="m-0">
            Attivala con <Kbd>Alt</Kbd> + <Kbd>6</Kbd>, nelle impostazioni ⚙ o nel menu sotto il pulsante rotondo dell'altoparlante, dove regoli con i cursori anche il volume di ogni suono. Cambia il suono con <Kbd>Alt</Kbd> + <Kbd>7</Kbd> e <Kbd>Alt</Kbd> + <Kbd>8</Kbd>.
          </p>
        </Section>

        <Section title="Maiuscole e punteggiatura">
          <p className="m-0">
            I testi hanno bisogno delle <strong>maiuscole</strong> - all'inizio di
            una frase e in ogni nome proprio. Tastenflow le mette{" "}
            <strong>sempre giuste</strong>, così non vedi mai una parola scritta
            male.
          </p>
          <p className="m-0">
            <strong>Facilissimo all'inizio:</strong> scrivi la lettera{" "}
            <strong>minuscola</strong> - la <strong>maiuscola</strong> compare da
            sola. Per questo <strong>non</strong> ti serve ancora conoscere il
            tasto <Kbd>Maiusc</Kbd>.
          </p>
          <p className="m-0">
            <strong>Presto</strong>, dopo le prime lettere, impari a usare il
            tasto <Kbd>Maiusc</Kbd> "sul serio": lo tieni premuto con{" "}
            <strong>una</strong> mano e scrivi la lettera con l'
            <strong>altra</strong> - come su qualsiasi tastiera. Così presto
            scriverai le maiuscole <strong>tu</strong>, senza l'aiuto automatico.
          </p>
          <div className="rounded-lg border border-hairline bg-surface-raised p-3">
            <p className="m-0">
              <strong>Importante - sempre il tasto Maiusc della mano
              OPPOSTA:</strong> ci sono due tasti Maiusc, uno a sinistra e uno a
              destra. Scrivi la lettera con una mano e tieni <Kbd>Maiusc</Kbd> con
              l'<strong>altra</strong>. Così una mano sola non deve mai premere
              due tasti.
            </p>
            <p className="m-0 mt-2">
              Esempio: <strong>A</strong> maiuscola (mano sinistra) →{" "}
              <strong>Maiusc a destra</strong>. <strong>K</strong> maiuscola (mano
              destra) → <strong>Maiusc a sinistra</strong>.
            </p>
            <p className="m-0 mt-2">
              Se usi il tasto Maiusc della <strong>stessa</strong> mano o{" "}
              <Kbd>Bloc Maiusc</Kbd>, la lettera vale lo stesso: è scritta giusta.
              Ogni tanto Tastenflow ti dà un <strong>consiglio</strong> sul tasto
              Maiusc più comodo. L'insegnante vede nelle statistiche quante volte
              succede; non è un errore.
            </p>
          </div>
          {detail >= 2 && (
            <p className="m-0 text-sm text-ink-muted">
              Un consiglio: premi <strong>due volte veloce</strong>{" "}
              <Kbd>Maiusc</Kbd> per sentire con quale dito tenerlo.
            </p>
          )}
          <p className="m-0">
            <strong>Il punto, la virgola e il punto interrogativo</strong>{" "}
            compaiono solo quando li hai già imparati. Nel frattempo leggi la
            frase <strong>senza</strong> - è voluto, non è un errore.
          </p>
        </Section>

        <Section title="In che ordine arrivano le lettere?">
          <p className="m-0">
            I tasti nuovi arrivano sempre nello stesso ordine: prima la{" "}
            <strong>riga di base</strong>, poi le altre lettere, le più frequenti
            per prime. Vedi sempre quale tasto viene adesso, tutto a destra nella
            riga sotto il campo di scrittura: <strong>"Prossimo tasto"</strong>.
          </p>
          <div className="flex flex-wrap gap-1" aria-hidden="true">
            {letters.map((ch) => (
              <Kbd key={ch}>{unitGlyph(ch)}</Kbd>
            ))}
          </div>
          <p className="m-0 text-sm text-ink-muted">
            Dopo le prime lettere arrivano le <strong>maiuscole</strong> (il tasto
            Maiusc) e, subito dopo, il <strong>punto e la virgola</strong>: una
            frase inizia con la maiuscola e finisce con il punto. Poi le lettere
            che restano. Alla fine arrivano gli altri{" "}
            <strong>segni di punteggiatura</strong>, i <strong>numeri</strong> e i{" "}
            <strong>caratteri speciali</strong>.
          </p>
        </Section>

        {detail >= 2 && (
          <Section title='Come funziona "Il mio allenamento"'>
            <p className="m-0">
              <strong>Si adatta a te.</strong> Il programma ricorda quali tasti ti
              sfuggono ancora e allena proprio quelli. Un tasto nuovo arriva solo
              quando gli altri ti vengono sicuri. Le lettere{" "}
              <strong>più frequenti</strong> arrivano per prime - così, con pochi
              tasti, scrivi già <strong>parole e frasi vere</strong>, e le prime{" "}
              <strong>storie</strong> si sbloccano presto.
            </p>
          </Section>
        )}

        <Section title="La riga sotto il campo di scrittura">
          <p className="m-0">
            Sotto il campo di scrittura c'è una riga sottile con quattro
            informazioni: il tuo <strong>{ringWort}</strong>, il{" "}
            <strong>tempo</strong> di esercizio di oggi, il tuo{" "}
            <strong>obiettivo settimanale</strong> e il{" "}
            <strong>prossimo tasto</strong>. Per l'obiettivo settimanale, l'anello
            mostra quanti <strong>minuti</strong> di esercizio hai fatto questa
            settimana - per esempio "25 di 60 min"; un{" "}
            <strong>segno di spunta</strong> significa che hai raggiunto
            l'obiettivo. Il prossimo tasto si sblocca <strong>da solo</strong>{" "}
            appena quelli di prima ti vengono sicuri - basta continuare.
          </p>
          <p className="m-0">
            La riga c'è <strong>sempre</strong> - anche mentre scrivi. Così niente
            salta, e vedi in ogni momento da quanto tempo ti stai esercitando.
          </p>
          <p className="m-0">
            <Kbd>Alt</Kbd> + <Kbd>D</Kbd> annuncia il tuo tempo di esercizio e il
            tuo obiettivo settimanale. I tasti che sai già, quelli che non sono
            ancora arrivati e quello che viene adesso sono in{" "}
            <strong>"I miei progressi"</strong>, in{" "}
            <strong>"Stato dei tasti"</strong> (<Kbd>Alt</Kbd> + <Kbd>S</Kbd>,
            con un account).
          </p>
        </Section>

        <Section title='La biblioteca: "Storie e curiosità" 📖'>
          <p className="m-0">
            Oltre a "Il mio allenamento" c'è un altro modo di esercitarsi: le{" "}
            <strong>Storie</strong> - nelle impostazioni ⚙, in{" "}
            <strong>"Che cosa eserciti?"</strong>. Lì trovi storie intere e serie
            di divulgazione - non frasi sparse, ma{" "}
            <strong>una storia lungo più giri</strong>. Ogni passo ha dodici
            righe; la volta dopo riprendi proprio da dove avevi lasciato.
          </p>
          <p className="m-0">
            Compare solo quello che puoi davvero scrivere con i tasti che hai già
            imparato - per questo all'inizio vedi ancora dei lucchetti. Si aprono
            da soli appena conosci abbastanza tasti. Ogni riga arriva{" "}
            <strong>una volta sola</strong>: quello che hai già scritto non torna
            per essere ripetuto.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              <strong>Il filo conduttore:</strong> quello che hai letto in una
              serie di divulgazione torna più tardi nel tuo allenamento - come una{" "}
              <strong>domanda fatta in un altro modo</strong>, poi come un
              piccolo dettaglio in più e alla fine come una battuta sul tema.
              Così quello che hai imparato resta, senza sembrare un'interrogazione.
            </p>
          )}
        </Section>

        <Section title="Da dove vengono i testi? 🤖">
          <p className="m-0">
            I testi propri del programma - frasi di esercizio, battute e storie -
            li ha scritti Johannes{" "}
            <strong>con l'aiuto dell'intelligenza artificiale (IA)</strong>. I
            testi di altre fonti portano il loro nome in "Fonti e
            ringraziamenti".
          </p>
          <p className="m-0">
            {hoehleMitWesen ? (
              <>
                Il pesce che canta e la creatura che sussurra nella Spedizione
                polare sono anche loro <strong>voci sintetiche</strong>, non
                persone vere.
              </>
            ) : (
              <>
                Anche il pesce che canta nella Spedizione polare è una{" "}
                <strong>voce sintetica</strong>, non una persona vera.
              </>
            )}{" "}
            La lettura ad alta voce (🗣) usa la voce di lettura del tuo
            dispositivo.
          </p>
        </Section>

        <Section title={`La ${PRUEFUNG_WORT_IT}`}>
          <p className="m-0">
            A volte l'insegnante lancia una <strong>{PRUEFUNG_WORT_IT}</strong> -
            per tutta la classe. <strong>Tutti ricevono lo stesso testo</strong> e
            tutti hanno lo stesso tempo.
          </p>
          <p className="m-0">
            <strong>Il tempo parte solo con la tua prima battuta</strong> - non
            quando l'insegnante lancia la {PRUEFUNG_WORT_IT}. Da quando viene
            lanciata, hai <strong>{EINSTIEGSFENSTER_MIN} minuti</strong> per
            iniziare.
          </p>
          <p className="m-0">
            <strong>Come riconoscerla:</strong> sopra il campo di scrittura c'è
            scritto <strong>{PRUEFUNG_WORT_IT}</strong>, con il tempo accanto, e
            tutta la zona ha un <strong>bordo a puntini</strong> diverso. Appena
            il tempo finisce, spariscono tutti e due.
          </p>
          <p className="m-0">
            <strong>Quanto tempo resta, senza guardare:</strong> <Kbd>Alt</Kbd> +{" "}
            <Kbd>X</Kbd> te lo dice. L'orologio parla da solo solo poche volte;
            il resto del tempo sta zitto.
          </p>
          <p className="m-0">
            <strong>Il display braille resta tranquillo.</strong> Il tempo{" "}
            <strong>non</strong> scorre sul display: avanza in alto, ma non entra
            mai in quello che stai leggendo.
          </p>
          <p className="m-0">
            <strong>A volte la {PRUEFUNG_WORT_IT} è di "Scrittura
            libera".</strong> Allora un errore resta dove è stato scritto - non si
            segnala niente, nessun suono lo indica. Backspace corregge solo dentro
            la riga attuale; una riga finita resta com'è. Alla fine di una riga,
            premi la barra spaziatrice dopo l'ultima parola - oppure, se la classe
            ha attivato "Fine della riga con Invio", premi Invio. Quello che alla
            fine è ancora sbagliato compare solo dopo, nei risultati, come un
            elenco da leggere.
          </p>
          <p className="m-0">
            <strong>Fermarsi prima del tempo:</strong> <Kbd>Esc</Kbd> prima ti
            chiede una conferma. <strong>"Continua a scrivere"</strong> (o{" "}
            <Kbd>Esc</Kbd>) ti riporta alla riga; <strong>"Consegna"</strong>{" "}
            consegna quello che hai scritto - si valuta quello scritto fin lì. Il
            pulsante <strong>"Finito - consegna"</strong> sotto il campo fa lo
            stesso, senza chiedere.
          </p>
          <p className="m-0">
            <strong>Quando il tempo finisce,</strong> i tuoi risultati compaiono
            subito: battute al minuto, precisione, caratteri, errori, righe e i
            tasti ancora incerti. Dopo, ogni {PRUEFUNG_WORT_IT} resta in{" "}
            <strong>"I miei progressi"</strong>, in{" "}
            <strong>{PRUEFUNG_WORT_MEHRZAHL_IT}</strong> - puoi riguardarla quando
            vuoi.
          </p>
        </Section>

        <Section title="Gara di classe ⚔️">
          <p className="m-0">
            In una Gara di classe fai una <strong>corsa di scrittura di cinque
            minuti</strong> con il resto della tua classe. La Gara di classe
            esiste solo dentro una classe, e solo se l'insegnante la permette.
          </p>
          <p className="m-0">
            <strong>Avviarla:</strong> <Kbd>Alt</Kbd> + <Kbd>M</Kbd>, o il
            pulsante <strong>Gara di classe</strong> nella riga sopra il campo di
            scrittura - proprio accanto a <strong>Gioca</strong>. Tutte le altre
            persone ricevono allora una finestra: <strong>"Ci sono!"</strong> o{" "}
            <strong>"Non ora"</strong>. <Kbd>Esc</Kbd> ti riporta all'esercizio,
            e lo stesso invito non torna da solo.
          </p>
          <p className="m-0">
            <strong>Se qualcuno sta già invitando,</strong> <Kbd>Alt</Kbd> +{" "}
            <Kbd>M</Kbd> fa comparire di nuovo quell'invito - una seconda gara
            può partire solo quando la prima è in corso. Se due persone invitano
            quasi insieme, conta l'invito arrivato per primo.
          </p>
          <p className="m-0">
            <strong>Quando non si può subito:</strong> se sei già in una gara, il
            pulsante dice <strong>"Gara di classe in corso"</strong> - e{" "}
            <Kbd>Alt</Kbd> + <Kbd>M</Kbd> ti dice lo stesso. Le altre gare della
            tua classe non danno fastidio: ne possono correre più insieme.
          </p>
          <p className="m-0">
            <strong>Ogni persona scrive con i tasti che ha già
            imparato.</strong> Se sai già i numeri, ti toccano i numeri; se sei
            alla riga di base, ti tocca la riga di base. Gli errori costano cari -
            un tasto sbagliato conta come cinque caratteri.
          </p>
          <p className="m-0">
            <strong>Come stai andando, senza guardare:</strong> tutto a sinistra
            nella riga di esercizio ci sono sempre otto celle: <strong>P2</strong>{" "}
            è il tuo posto, seguito dal tempo che resta. <Kbd>Alt</Kbd> +{" "}
            <Kbd>X</Kbd> ti dice il tuo posto, il tempo e i primi tre posti.
            Niente parla da solo - il display braille resta tranquillo.
          </p>
          <p className="m-0">
            <strong>Fermarsi prima del tempo:</strong> <Kbd>Esc</Kbd> o il
            pulsante <strong>"Esci"</strong> prima ti chiedono una conferma.{" "}
            <strong>"Continua a scrivere"</strong> (o <Kbd>Esc</Kbd>) ti riporta
            alla riga. <strong>"Esci"</strong> finisce la gara solo per te - le
            altre persone continuano a scrivere e vedono quello che hai scritto.
          </p>
          <p className="m-0">
            <strong>La gara conta come tempo di esercizio</strong> e può sbloccare
            un tasto nuovo - come un normale giro di esercizio.{" "}
            <strong>Nessun posto viene salvato.</strong> Alla fine vedi l'elenco:
            Coppa, Argento e Bronzo per i primi tre posti, e gli altri con il loro
            numero. Poi <strong>"Continua a esercitarti"</strong> o{" "}
            <Kbd>Esc</Kbd> ti riportano indietro.
          </p>
        </Section>

        <Section title="Tasti importanti">
          <p className="m-0 text-sm text-ink-muted">
            <AltOderWahl>
              Su un Mac, <Kbd>Alt</Kbd> è il tasto <Kbd>⌥</Kbd> (Opzione).
            </AltOderWahl>
          </p>
          <ul className="m-0 list-none space-y-2 p-0">
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Esc</Kbd>
              </span>
              <span>
                <strong>Il tasto più importante:</strong> chiude qualsiasi
                finestra, e poi il cursore è{" "}
                <strong>sempre nel campo di scrittura</strong>. Anche se non c'è
                niente di aperto, <Kbd>Esc</Kbd> ti porta lì. L'unica eccezione è
                "Esplora i tasti": lì <Kbd>Esc</Kbd> è un tasto come gli altri da
                esplorare, e solo la seconda pressione ti fa uscire.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Maiusc</Kbd> <Kbd>Maiusc</Kbd>
              </span>
              <span>Due pressioni veloci: viene annunciato il dito giusto.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>E</Kbd>
              </span>
              <span>Va al campo di scrittura.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>U</Kbd>
              </span>
              <span>Va all'esercizio.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>S</Kbd>
              </span>
              <span>
                Apre I miei progressi (insegnanti: Le mie classi). Solo dopo
                l'accesso. Premilo ancora per tornare al campo di scrittura.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>Z</Kbd>
              </span>
              <span>Annuncia in quale riga sei.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>D</Kbd>
              </span>
              <span>
                Ti dice il tuo tempo di esercizio - sul display braille e (con la
                lettura ad alta voce) come annuncio.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>L</Kbd>
              </span>
              <span>Annuncia a quale {ringWort} sei.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>3</Kbd>
              </span>
              <span>
                <strong>Esplora i tasti:</strong> ogni tasto che premi viene
                annunciato e mostrato in grande - prima il nome breve, poi il nome
                completo e poi a che cosa serve. Funziona con tutti i tasti
                speciali e i segni di punteggiatura, con i caratteri di Alt Gr (su
                un Mac: Opzione), dicendo come arrivarci, e con combinazioni come
                Ctrl + C. Le scorciatoie di Tastenflow (<AltText>Alt + H, Alt + V ...</AltText>)
                continuano a funzionare. La tastiera sullo schermo mostra quale
                tasto è stato premuto. Se la lettura ad alta voce è disattivata,
                la voce resta zitta. Sul display braille la spiegazione resta fino
                al tasto successivo, e puoi leggerla tutta con i tasti di
                scorrimento; sullo schermo compare in una finestra. Non si scrive
                niente e non si perde niente. <Kbd>Maiusc</Kbd> dà il carattere in alto su un tasto e <Kbd>AltGr</Kbd> (sul Mac: <Kbd>Opzione</Kbd>) il terzo: così puoi provare tutti i caratteri uno per uno.{" "}<strong>Per uscire:</strong>{" "}
                <Kbd>Alt</Kbd> + <Kbd>3</Kbd> ancora, due volte <Kbd>Esc</Kbd> -
                oppure semplicemente ricaricare la pagina.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>4</Kbd>
              </span>
              <span>
                <strong>Trova i tasti:</strong> viene nominato un tasto e tu lo
                cerchi. La prima volta che lo trovi, senti "Ci sei! Premi un altro tasto, poi di nuovo
                ..." - conta solo la seconda pressione, e solo dopo un altro tasto
                in mezzo. Poi arriva il tasto successivo. Qualsiasi altro tasto viene solo nominato. Nella
                finestra, <Kbd>Alt</Kbd> + <Kbd>4</Kbd> passa da esplorare a
                cercare. <strong>Per uscire:</strong> come quando esplori.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>K</Kbd>
              </span>
              <span>
                <strong>Colori e contrasto:</strong> sette combinazioni di colori -
                chiaro, scuro, nero su giallo, giallo su blu e altre. Ognuna
                compare già nell'elenco con i suoi colori, per vedere com'è prima
                di sceglierla.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>T</Kbd>
              </span>
              <span>Apre o chiude l'elenco delle scorciatoie da tastiera.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>N</Kbd>
              </span>
              <span>Apre o chiude i messaggi dell'insegnante.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>+</Kbd> / <Kbd>-</Kbd>
              </span>
              <span>Ingrandisce / rimpicciolisce il campo di scrittura.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>V</Kbd>
              </span>
              <span>Attiva o disattiva la lettura ad alta voce.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>H</Kbd>
              </span>
              <span>Apre o chiude questo aiuto.</span>
            </li>
            <WeitereTasten />
          </ul>
        </Section>

        {detail >= 3 && (
          <Section title="Come il programma ti aiuta ad andare avanti">
            <p className="m-0">
              Il programma misura ogni lettera da sola - con quanta precisione e
              a che velocità la scrivi. Allena solo quelle che ne hanno più
              bisogno e sblocca una lettera nuova solo quando quelle di prima ti
              vengono sicure. Così segui il tuo percorso di apprendimento.
            </p>
            <p className="m-0">
              Il livello di difficoltà (1-50) fa sì che tutto sia sempre{" "}
              <strong>impegnativo ma possibile</strong>: se va bene, sale; se è
              troppo difficile, scende. In <strong>"I miei progressi"</strong>{" "}
              vedi tutto sui tuoi passi avanti - e come stai migliorando.
            </p>
          </Section>
        )}

        <Section title="Esercitarsi senza classe - un account personale 🙋">
          <p className="m-0">
            Se non fai parte di nessuna classe, crei tu un account: apri il
            pulsante rotondo <strong>"Account"</strong> e seleziona{" "}
            <strong>"Mi esercito per conto mio, senza classe"</strong>. Per
            questo ti serve un indirizzo email: lì arriva ogni lunedì il
            resoconto settimanale - ma solo se nella settimana hai fatto
            esercizio. Se Tastenflow non viene aperto per un anno intero, arriva
            un avviso via email; se nessuno accede nelle tre settimane dopo,
            l'account viene cancellato con tutti i suoi progressi.
          </p>
        </Section>

        <PlakatAbschnitt />
      </div>
    </div>
  );
}

/** Il poster da appendere (`handbuchInSprache`). */
function PlakatAbschnitt() {
  const plakat = handbuchInSprache(tastenflowPlakat(), "it");
  return (
    <Section title="Un poster da appendere">
      <p className="m-0">
        Vuoi far conoscere Tastenflow nella tua scuola o nel tuo centro? Ecco un{" "}
        <strong>poster da stampare e appendere</strong>: A3, verticale, con
        quello che Tastenflow offre in un colpo d'occhio e un codice QR per
        tastenflow.org.
      </p>
      <p className="m-0">
        <a
          href={downloadAdresse(plakat)}
          download={plakat.speicherName}
          type="application/pdf"
          className="text-accent underline underline-offset-2"
        >
          Scarica il poster (PDF, A3, {groesse(plakat.bytes, "it")})
        </a>
      </p>
    </Section>
  );
}
