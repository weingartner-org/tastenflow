/**
 * ★★★ O-IT (02.10.2026): DAS HILFE-FENSTER FÜR LEHRKRÄFTE, ITALIENISCH.
 * ===========================================================================
 * Aus der Funktion geschrieben, in derselben Reihenfolge wie die deutsche,
 * englische, französische und spanische Fassung (1 bis 12, samt 4a, 8a, 8b) -
 * wer eine Stelle prüft, findet sie in allen fünf. Sichtbar nur mit
 * `spracheGewaehlt === "it"` (`LehrerHilfe.tsx`).
 *
 * ── ANREDE (Glossar `recherche-italienisch-2026-10-02/GLOSSAR-it.md`) ──────────
 * Infinitiv und neutrale Formen, nie „Lei" als Dauerton (Regel 1); „alunni"
 * als Sammelwort, die einzelne „persona", „chi insegna" / „l'insegnante"
 * (Regel 2); keine Ausrufezeichen für Lehrkräfte.
 *
 * ── WAS ITALIENISCH ANDERS IST ──────────────────────────────────────────────
 *  · Die Score-Erklärung und der Kurven-Hinweis kommen aus den italienischen
 *    Konstanten (`SCORE_ERKLAERUNG_IT_INSEGNANTE`, `STEIGERUNG_HINWEIS_IT`).
 *  · Einen italienischen Weg mit eigener Reihenfolge gibt es noch nicht
 *    (Etappe F4; `WEG_GRUNDSPRACHE.it` ist bis dahin „en") - Abschnitt 4 sagt
 *    das, statt eine Reihenfolge zu beschreiben, die es nicht gibt.
 *  · Tastaturen: Italien (Windows „Italiano", Mac „Italiano - Pro"), Mac
 *    „Italiano" (QZERTY) und die Schweizer Tastatur fürs Tessin - die Fakten
 *    stehen in `layouts.ts` (nur gelesen).
 *  · Abschnitt 12: ★ IT-H (09.10.2026) die Guida gibt es auf Italienisch
 *    (`tastenflow-handbuch-it.pdf`, `HandbuchKnopf` lädt sie für „it"); das
 *    Plakat noch nicht (Bild der Oberfläche fehlt) - der Knopf lädt das
 *    englische, und der Text sagt das.
 *
 * Namen wie in der italienischen Oberfläche (*Sfida*, *Esercizio
 * personalizzato*, *Gara di classe*, *Obiettivo settimanale*, *Impostazioni
 * della classe*, *Sospendere per 1 ora*, *Le mie classi*, *Tasti incerti*,
 * *Lavoro autonomo*). Nur Bindestrich, gerade Anführungszeichen.
 */
import { BrailleTabellenPunkte } from "./ScreenreaderHinweis";
import { AltText, Kbd } from "./TippenHilfeTeile";
import { useRef } from "react";
import {
  EINSTIEGSFENSTER_MIN,
  MIND_ZEICHEN,
  PROBEN_JE_NIVEAU,
  PRUEFUNG_WORT_IT,
  PRUEFUNG_WORT_MEHRZAHL_IT,
} from "@/lib/typing/schreibprobe";
import { FEHLER_GEWICHT, FEHLER_GEWICHT_FREI } from "@/lib/typing/schreibprobeWertung";
import { SCORE_ERKLAERUNG_IT_INSEGNANTE } from "@/lib/typing/score";
import { STEIGERUNG_HINWEIS_IT } from "@/lib/typing/schreibprobeHinweise";
import { zahl } from "@/lib/bedienSprache";
import { useFocusTrap } from "./useFocusTrap";
import { DidaktikInhalt, didaktikAbschnittTitel } from "./DidaktikHinweise";
import { DreiWerteHilfe, LeistungsstufeHilfe } from "./TastenflowZahlenHilfe";
import { RundgangLehrkraftKnoepfe } from "./Rundgang";
import { HandbuchKnopf } from "@/components/lernwerkstatt/HandbuchKnopf";
import { handbuecherFuer, tastenflowPlakat } from "@/lib/lernwerkstatt/handbuecher";

/** Das Handbuch - derselbe Knopf wie in den anderen Fassungen. */
function HandbuchLaden() {
  const h = handbuecherFuer("tippen")[0];
  if (!h) throw new Error("Kein Tastenflow-Handbuch in HANDBUECHER");
  return (
    <p className="m-0">
      <HandbuchKnopf alsLink handbuch={h} />
    </p>
  );
}

/** Das Plakat - `div` statt `p` (der Knopf kann einen Fehler-Absatz zeigen). */
function PlakatLaden() {
  return (
    <div className="m-0">
      <HandbuchKnopf alsLink handbuch={tastenflowPlakat()} />
    </div>
  );
}

// ★ 18.10.2026 (Johannes: „passe mac an Wahl-taste an"): `Kbd` und `AltText` aus
//   der Kinder-Hilfe - am Mac heißt die Taste „Wahl" (Option, Opción …), im
//   Kästchen wie im Satz. Vorher stand hier ein eigenes `Kbd`, das immer „Alt" zeigte.

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-hairline bg-surface-sunken p-4">
      <h3 className="m-0 mb-1 text-lg font-semibold text-ink">{title}</h3>
      <div className="space-y-2 text-ink-soft">{children}</div>
    </section>
  );
}

export function LehrerHilfeItalienisch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  useFocusTrap(open, cardRef, { initialFocus: closeRef });
  if (!open) return null;
  const W = PRUEFUNG_WORT_IT;
  const WM = PRUEFUNG_WORT_MEHRZAHL_IT;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Aiuto per insegnanti su Tastenflow"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        className="card my-8 w-full max-w-3xl space-y-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="m-0 text-xl font-semibold text-ink">
            Aiuto per insegnanti: tutte le funzioni di "Tastenflow"
          </h2>
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
        <RundgangLehrkraftKnoepfe onStart={onClose} />

        <p className="m-0 text-ink-soft">
          "Tastenflow" ha un <strong>proprio sistema di account</strong>, del
          tutto separato dall'accesso alla piattaforma. Accedere qui non cambia
          niente nella sessione della piattaforma - e viceversa.
        </p>

        <Section title="1 · Creare classi e account">
          <p className="m-0">
            Chi insegna, aprendo Tastenflow, arriva sempre a{" "}
            <strong>"Le mie classi"</strong>; "Esercitarsi" (<Kbd>Alt</Kbd> +{" "}
            <Kbd>U</Kbd>) porta al proprio esercizio. Con{" "}
            <strong>"Alunni e accessi"</strong>, in alto a destra, si crea una
            classe - nella parte apribile{" "}
            <strong>"Creare una classe nuova"</strong>. Il{" "}
            <strong>codice classe</strong> è obbligatorio: mentre si scrive il
            nome, il programma propone un codice adatto ("5B Rossi" diventa
            "5BROSSI"); si può cambiare, per esempio in <code>5B-2</code>. Il
            codice vale per tutta la classe. Nella stessa parte si scelgono la{" "}
            <strong>classe frequentata</strong> e il{" "}
            <strong>punto di partenza</strong>, e si controllano la lingua (con il
            suo blocco) e la Gara di classe - gli stessi campi di "Impostazioni
            della classe". <strong>"Crea la classe"</strong> funziona solo quando
            tutto è completo; altrimenti una frase dice che cosa manca, e il focus
            è sul primo campo mancante.
          </p>
          <p className="m-0">
            Poi si aggiungono gli alunni con <strong>nome e password</strong>.
            Così possono accedere da <strong>qualsiasi dispositivo</strong> con{" "}
            <em>codice classe + nome + password</em>. Il dispositivo ricorda il
            codice classe, quindi dopo scrivono solo nome e password.
          </p>
          <p className="m-0">
            Più tardi si possono cambiare nome e codice della classe con{" "}
            <strong>"✏️ Modifica"</strong> - un codice nuovo vale allora per
            tutti gli alunni della classe (da quel momento accedono con quello
            nuovo).
          </p>
          <p className="m-0">
            <strong>Un'altra possibilità:</strong> chi non fa parte di nessuna
            classe può anche <strong>crearsi un account</strong> - nella finestra
            di accesso, con la casella "Mi esercito per conto mio, senza classe"
            e un indirizzo email. Per chi insegna non cambia niente: questi
            account non appartengono a nessuna classe, non compaiono in nessun
            elenco e ricevono il proprio resoconto settimanale. Nella classe
            tutto resta uguale - gli alunni li aggiunge chi insegna.
          </p>
        </Section>

        <Section title="2 · Impostazioni della classe e di ogni persona">
          <p className="m-0">
            <strong>Per tutta la classe</strong> (il pulsante "Impostazioni della
            classe" nella riga delle attività sopra la tabella, accanto a {W},
            Esercizio personalizzato, Obiettivo settimanale e Sospendere per 1
            ora - anche chiuso, il pulsante mostra già classe frequentata, lingua
            e Gara di classe):
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Classe frequentata:</strong> da qui il programma deduce i
              testi adatti all'età - il lessico, il tipo di umorismo e il tono dei
              testi di esercizio. <strong>Avanza con la classe:</strong> il
              programma ricorda l'anno scolastico in cui è stata indicata e sale
              di un livello ogni anno, senza che si debba cambiare niente. Nel
              programma l'<strong>anno scolastico inizia il primo agosto</strong>{" "}
              e finisce il 31 luglio, se in "Impostazioni della classe" non si
              sceglie un altro mese di inizio (in Italia di solito settembre):
              all'inizio dell'anno la classe passa alla classe successiva, e
              anche le statistiche dell'anno scolastico seguono questo
              calendario. Per gruppi di persone adulte c'è il livello{" "}
              <strong>"Persone adulte"</strong> - quello non avanza. Agli alunni
              di una classe non si chiede l'anno di nascita.
            </li>
            <li>
              <strong>Lingua e blocco:</strong> tedesco o inglese - e spagnolo o
              francese in una classe di quei percorsi - per le parole e i testi di
              esercizio di tutta la classe; con il blocco accanto, gli alunni non
              possono più cambiarla. Ogni persona ha nell'intestazione il
              pulsante rotondo della lingua: cambia i pulsanti e i menu, e con
              loro i testi di esercizio - con il blocco, solo i pulsanti e i menu.
            </li>
            <li>
              <strong>Punto di partenza della classe:</strong> "da dove iniziare"
              come impostazione predefinita per tutta la classe - vale anche per
              chi arriva più tardi, e aggiunge solo tasti: chi è già più avanti
              non perde niente. Quando lo si sceglie, il programma lo propone
              insieme agli alunni che sono già nella classe; se qualcuno è già più
              avanti, prima chiede di nuovo e offre tre possibilità: impostarlo
              per tutti, solo per chi non ci è ancora arrivato, oppure annullare.
              Vale appena ogni persona riapre Tastenflow; statistiche e medaglie
              restano sempre.
            </li>
            <li>
              <strong>Permettere la Gara di classe:</strong> gli alunni possono
              invitarsi a una gara di 5 minuti. In "Tempi di esercizio", nella
              riga aperta, si vede quante volte ogni persona ha partecipato per
              settimana - senza classifica né tempi.
            </li>
            <li>
              <strong>Fine della riga con Invio:</strong> se è selezionata, tutti
              gli alunni della classe finiscono ogni riga di esercizio con il
              tasto Invio - come negli esercizi classici di dattilografia, che si
              ricopiano riga per riga. Vale per "Il mio allenamento", le storie,
              l'esercizio personalizzato, i giochi di parole con righe, la {W} e
              la Gara di classe; non per gli indovinelli, le lettere mescolate, il
              dettato delle dita, il gioco della Spedizione né "Esplora i tasti".
              Predefinito: disattivata.
            </li>
          </ul>
          <p className="m-0">
            <strong>Per ogni persona</strong> (dietro la freccia della sua riga):
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Tastiera:</strong> si sceglie nelle impostazioni, in
              "Tastiera" - italiana (Windows "Italiano" o Mac "Italiano - Pro"),
              Mac "Italiano" (QZERTY) oppure svizzera, per esempio nel Canton
              Ticino. L'impostazione vale per questo dispositivo (non per
              l'account) e decide la tastiera sullo schermo, i suggerimenti per le
              dita e i caratteri che si esercitano. Sulla tastiera italiana: (1)
              le lettere <strong>à, è, ì, ò, ù</strong> hanno tasti propri, e la{" "}
              <strong>é</strong> è <Kbd>Maiusc</Kbd> + <Kbd>è</Kbd>; (2) le{" "}
              <strong>maiuscole con l'accento</strong> (À, È …) su Windows non
              hanno un tasto - per questo Tastenflow non le chiede lì, e una "E'"
              al posto di "È" non conta come errore; (3) la <strong>@</strong> è{" "}
              <Kbd>Alt Gr</Kbd> + <Kbd>ò</Kbd>, il <strong>#</strong>{" "}
              <Kbd>Alt Gr</Kbd> + <Kbd>à</Kbd>; (4) sul Mac "Italiano" (QZERTY)
              z e w sono scambiate e i numeri vanno con Maiuscole.
            </li>
            <li>
              <strong>Da dove iniziare?</strong> lo stesso elenco di punti di
              partenza che per tutta la classe (vedi sopra) - qui per una sola
              persona che ha bisogno di un'eccezione. Chi ha già esperienza salta
              le basi e inizia più avanti (per esempio solo dai numeri); per
              riportare qualcuno indietro, il programma chiede prima una
              conferma.
            </li>
            <li>
              <strong>Scrivere con una mano:</strong> toglie per questa persona la
              regola del tasto Maiusc della mano opposta - le maiuscole e i segni
              contano allora con qualsiasi tasto Maiusc.
            </li>
            <li>
              <strong>La velocità non conta:</strong> per questa persona la
              velocità non viene valutata da nessuna parte - nessun limite di
              tempo nel gioco, nessun obiettivo di velocità per le stelle, nessun
              passaggio di livello per la velocità. Per chi scrive con cura ma
              molto lentamente.
            </li>
            <li>
              <strong>Spaziatura ampia (CVI):</strong> più spazio tra ogni
              carattere quando si ricopia, in tre gradi (doppia, tripla,
              quadrupla) - per chi ha una disabilità visiva di origine cerebrale
              (CVI), quando i caratteri troppo vicini si confondono. Ogni persona
              può anche cambiare la spaziatura nelle proprie impostazioni
              (l'ingranaggio, <AltText>Alt + O</AltText>) - e qui la si può cambiare quando si vuole.
              Vale l'ultima scelta.
            </li>
          </ul>
          <p className="m-0">
            Tutto si può cambiare in qualsiasi momento - le cinque impostazioni
            della classe nel pannello "Impostazioni della classe" sopra la
            tabella, quelle di ogni persona nella sua riga aperta.
          </p>
        </Section>

        <Section title="3 · Il livello (1-50): il cuore del sistema">
          <LeistungsstufeHilfe />
          <p className="m-0">
            Il <strong>livello attuale</strong> compare nella tabella (colonna{" "}
            <strong>"Livello"</strong>) e in alto nella schermata di esercizio. Non
            serve regolare niente - solo attivare "La velocità non conta" se
            serve.
          </p>
        </Section>

        <Section title='4 · "Il mio allenamento": adattivo, secondo la frequenza delle lettere'>
          <p className="m-0">
            "Tastenflow" offre <strong>un solo</strong> percorso di esercizio,
            che ogni persona fa al proprio ritmo - e si{" "}
            <strong>adatta</strong>: il programma misura ogni tasto da solo,
            allena solo quelli che ne hanno più bisogno e sblocca un tasto nuovo
            solo quando quelli di prima sono sicuri.
          </p>
          <div className="rounded-xl border border-accent bg-accent-soft p-3">
            <p className="m-0 font-semibold text-ink">Ordine secondo la frequenza delle lettere</p>
            <ul className="m-0 mt-1 list-disc space-y-1 pl-5">
              <li>
                Dopo la riga di base arrivano prima le lettere{" "}
                <strong>più frequenti</strong> - fin dai primi tasti compaiono{" "}
                <strong>parole vere</strong>.
              </li>
              <li>
                <strong>Ogni percorso è diverso</strong> - il prossimo tasto
                dipende da ogni persona, non da un elenco fisso.
              </li>
              <li>
                <strong>Senza una fine fissa</strong> - ideale per un esercizio
                quotidiano e autonomo.
              </li>
            </ul>
          </div>
          <p className="m-0 rounded-xl border border-warning/40 bg-warning/10 p-3">
            <strong>Da tenere presente nella programmazione:</strong> il{" "}
            <strong>percorso italiano</strong>, con un proprio ordine dei tasti
            per la tastiera italiana, <strong>non c'è ancora</strong>. Con
            l'interfaccia italiana, per ora una classe segue l'ordine del
            percorso inglese.
          </p>
          <p className="m-0 rounded-xl border border-hairline bg-surface-raised p-3">
            <strong>L'ordine dipende dalla lingua della primissima
            sessione:</strong> il percorso che segue una classe dipende dalla
            lingua dell'interfaccia la prima volta che si è esercitata - tedesco,
            inglese, francese o spagnolo. Una classe che ha iniziato in tedesco o
            in inglese mantiene quell'ordine anche se poi cambia interfaccia:
            l'ordine si decide una volta sola e non cambia mai più.
          </p>
          <p className="m-0">
            <strong>Lo stesso testo per tutta la classe:</strong> i testi del
            percorso (riga di base, righe di lettere, accenti, punteggiatura,
            numeri, caratteri, testi interi) sono disponibili come{" "}
            <strong>modelli</strong> nella zona{" "}
            <strong>"Esercizio personalizzato"</strong> di "Le mie classi" - se
            ne sceglie uno, e tutta la classe esercita lo stesso testo, qualunque
            sia il livello di ogni persona (come con un file caricato, conta come
            tempo di esercizio, senza sbloccare tasti nuovi).
          </p>
        </Section>

        <Section title='4a · "Esercizio personalizzato": un solo testo per tutta la classe'>
          <p className="m-0">
            Con il pulsante <strong>"Esercizio personalizzato"</strong> della
            riga delle attività nelle statistiche della classe si assegna un testo
            che esercita tutta la classe - qualunque sia il livello di ogni
            persona. Ci sono tre strade: <strong>caricare un file</strong> (.txt
            o .docx), scegliere un testo già salvato in{" "}
            <strong>"I miei testi"</strong>, oppure usare uno dei{" "}
            <strong>modelli</strong> del percorso (vedi il punto 4).
          </p>
          <p className="m-0">
            <strong>"I miei testi"</strong> è una raccolta personale - appartiene
            all'account, non alla classe, ed è visibile solo in questo account.
            Quando si carica un file, <strong>"Salva in I miei testi"</strong>{" "}
            (attivo all'inizio) salva una copia in automatico, per poter usare
            lo stesso testo più avanti senza caricarlo di nuovo.
          </p>
          <p className="m-0">
            Se il file contiene caratteri che non si possono scrivere, il
            pannello li mostra prima dell'avvio - si decide se correggere il file
            o avviare comunque (allora quei caratteri si tolgono dalle righe e
            non contano mai come battuta obbligatoria).
          </p>
          <p className="m-0">
            <strong>"Avvia l'esercizio personalizzato":</strong> ogni persona
            riceve subito una finestra con l'annuncio dell'esercizio
            dell'insegnante - può solo premere <strong>"Avanti"</strong>, non
            rifiutarlo. Per ogni persona l'esercizio finisce da solo appena ha
            scritto il testo una volta; poi continua l'esercizio normale.{" "}
            <strong>"Concludi"</strong> lo ferma prima per tutta la classe.
          </p>
          <p className="m-0">
            L'esercizio conta come tempo di esercizio e si misura come qualsiasi
            giro, tasti incerti compresi - ma{" "}
            <strong>non sblocca nessun tasto nuovo</strong>: contano solo i tasti
            del file.
          </p>
        </Section>

        <Section title={didaktikAbschnittTitel("it")}>
          <DidaktikInhalt lang="it" />
        </Section>

        <Section title="5 · Testi con un senso fin dall'inizio">
          <p className="m-0">
            Tastenflow mostra testi veri adatti all'età{" "}
            <strong>il prima possibile</strong> - barzellette, proverbi, modi di
            dire, divulgazione e curiosità, scioglilingua, giochi di parole e
            frasi intere. Un testo compare appena le sue{" "}
            <strong>lettere</strong> sono imparate; una semplice "serie di
            lettere" è l'eccezione (solo per esercitare di proposito un tasto
            appena arrivato).
          </p>
          <p className="m-0">
            <strong>Maiuscole:</strong> l'ortografia è{" "}
            <strong>sempre corretta</strong> (maiuscola all'inizio della frase e
            nei nomi propri) - gli alunni non vedono mai una parola scritta male.
            All'inizio basta la lettera <strong>minuscola</strong>; la maiuscola
            compare da sola (per <strong>tutte le età</strong>, perché
            l'ortografia corretta conta a ogni età).
          </p>
          <p className="m-0">
            In <strong>"Il mio allenamento", il vero tasto Maiusc arriva
            presto</strong> - subito dopo le prime lettere frequenti, appena ci
            sono abbastanza parole vere da esercitare (non dopo tutto
            l'alfabeto). Da lì le maiuscole si scrivono "sul serio" con Maiusc.
            Così gli alunni imparano presto a mettere le maiuscole{" "}
            <strong>da soli</strong>, invece di dipendere a lungo dall'aiuto
            automatico.
          </p>
          <p className="m-0">
            <strong>La punteggiatura</strong> (punto, virgola, punto
            interrogativo ...) compare solo quando è imparata - prima la frase si
            mostra "senza punto né virgola". Invece un tasto di <em>lettera</em>{" "}
            o di <em>numero</em> non ancora imparato non si chiede{" "}
            <strong>mai</strong>.
          </p>
        </Section>

        <Section title="6 · Stelle, medaglie e suoni (importanti per gli alunni con disabilità visiva)">
          <p className="m-0">
            Ogni giro dà <strong>da 1 a 3 stelle</strong> secondo la precisione
            e la velocità - <strong>la precisione conta il triplo</strong>: 3
            stelle chiedono sempre circa il 96% di battute giuste (scrivere veloce
            e male non ha premio); invece un giro senza nessun errore prende di
            sicuro 2 stelle, anche alla velocità più bassa. Ogni numero di stelle
            ha il suo <strong>suono</strong>; quando qualcuno{" "}
            <strong>sale di livello</strong>, suona una festa speciale. Questi
            suoni sono la risposta principale per gli alunni con disabilità
            visiva. Il pulsante <strong>🔇</strong> toglie il suono in una classe
            silenziosa.
          </p>
          <p className="m-0">
            Ci sono inoltre delle <strong>medaglie</strong> con nomi pensati per
            l'infanzia - in famiglie, con gradi crescenti e un "prossimo
            obiettivo" che si può sempre annunciare. Solo gli alunni di 7-10 anni
            vedono i nomi degli animali; dai testi per 11-15 anni compare
            ovunque il nome neutro. Le medaglie sono le stesse - quello che si è
            ottenuto resta, anche se cambiano i testi adatti all'età. Quasi tutte
            premiano la <strong>precisione</strong> e la{" "}
            <strong>costanza</strong>; l'unica medaglia di velocità chiede il 95%
            di precisione. Una medaglia nuova porta il suo "ta-daan" con un
            annuncio, e poi compare in cima alle statistiche (per ogni persona e
            per chi insegna - la stessa vista). Ogni medaglia si può{" "}
            <strong>selezionare</strong> per aprirla in grande, con un effetto.
          </p>
          <p className="m-0">
            Il <strong>Gioco dei lastroni 🐧</strong> è il premio dopo un tasto
            nuovo in "Il mio allenamento": il pinguino attraversa un percorso
            fatto con i <strong>caratteri più incerti</strong> di ogni persona.{" "}
            <strong>Il tasto è già sbloccato prima</strong> - i progressi non
            dipendono da nessun gioco. Tentativi a volontà, senza fine partita;
            dove si chiede solo precisione non c'è{" "}
            <strong>nessuna pressione di tempo</strong> (un limite di tempo che si
            può disattivare, come chiedono le WCAG). Inoltre gli alunni di 7-15
            anni possono avviare il gioco quando vogliono con il pulsante{" "}
            <strong>Gioca</strong> - come un'"avventura del giorno" con i{" "}
            <strong>pesci bonus</strong> e la <strong>Grotta dell'eco</strong>,
            dove ogni tasto viene solo annunciato (lì il programma parla anche se
            la lettura ad alta voce è disattivata - gli alunni con e senza
            disabilità visiva giocano esattamente allo stesso modo). Un giro senza
            errori finisce con l'aurora boreale. Importante per la valutazione: il
            gioco <strong>non conta</strong> come tempo di esercizio né per
            l'obiettivo settimanale - è solo motivazione.
          </p>
          <p className="m-0">
            <strong>Due ingressi diversi al gioco - meglio non
            confonderli:</strong> il pulsante <strong>Gioca</strong> è la strada
            libera che gli alunni aprono da soli; c'è per il gruppo{" "}
            <strong>7-15 anni</strong>, non da 16 anni. La partita{" "}
            <strong>dopo un tasto nuovo</strong>, invece, arriva da sola: sempre
            a 7-10 anni, mai da 16 anni, e a 11-15 anni solo se il Gioco dei
            lastroni è scelto nelle impostazioni, in{" "}
            <strong>"Gioco premio"</strong>, al posto di{" "}
            <strong>Nessuno</strong> (il predefinito). Questa impostazione
            appartiene al <strong>dispositivo</strong>, non all'account - come la
            disposizione dei tasti. Su un computer della classe vale quindi per
            tutte le persone che ci si esercitano.
          </p>
        </Section>

        <Section title="7 · Obiettivo settimanale">
          <p className="m-0">
            Per ogni persona si impostano i <strong>minuti alla settimana</strong>{" "}
            - un semplice numero, senza ore di lezione da indicare. "Applica a
            tutta la classe" scrive lo stesso valore per tutti gli alunni della
            classe in una volta, e vale anche per chi arriva più tardi.
          </p>
          <p className="m-0">
            Una modifica vale sempre <strong>dal lunedì successivo alle
            8:00</strong> - la settimana in corso tiene l'obiettivo di prima. Una
            finestra indica la data esatta prima di salvare.
          </p>
          <p className="m-0">
            <strong>Recuperare:</strong> se "Recuperare i minuti mancanti delle
            settimane precedenti" è selezionato, tutti i minuti che mancano si
            possono recuperare in una volta.
          </p>
          <p className="m-0">
            <strong>Esonerare dall'obiettivo settimanale</strong> (per esempio
            per malattia) e <strong>Azzerare i minuti arretrati</strong> si
            regolano per ogni persona, senza cambiare il tempo di esercizio già
            fatto.
          </p>
          <p className="m-0">
            <strong>Sospendere per 1 ora:</strong> un pulsante a parte per tutta
            la classe, per 60 minuti. Gli alunni continuano a esercitarsi - il
            tempo di esercizio e le statistiche continuano a contare, ma non per
            l'obiettivo settimanale durante quell'ora. Premere di nuovo lo stesso
            pulsante riprende l'obiettivo prima.
          </p>
        </Section>

        <Section title="8 · Statistiche e progressi nel tempo (apribili per ogni persona)">
          <p className="m-0">
            Con il pulsante rotondo con la freccia
            <span aria-hidden="true"> ▸</span> davanti al nome si aprono sei righe
            che si chiudono ognuna, dall'alto in basso:{" "}
            <strong>Impostazioni</strong> (le impostazioni del punto 2, per
            quella persona), <strong>{WM}</strong> (solo se ne ha fatta almeno
            una), <strong>Tempi di esercizio</strong> (per settimana, con lo stato
            dell'obiettivo di quella settimana e - se ha giocato - il numero di
            Gare di classe, più il riepilogo di tutto l'anno scolastico),{" "}
            <strong>Tasti incerti</strong>, <strong>Medaglie</strong> e - solo se
            un valore si nota - <strong>Lavoro autonomo</strong> (vedi il punto
            9).
          </p>
          <p className="m-0">
            In alto in "Tempi di esercizio" si vede a quante Gare di classe ha
            partecipato ogni persona (contate in questa classe); premere Invio su
            una settimana apre il dettaglio di ogni sessione - giorno, ora di
            inizio e di fine, tempo netto di scrittura e che cosa si è esercitato.
          </p>
          <p className="m-0">
            I dati in breve, i progressi nel tempo, i progressi dei tasti, le
            storie e la divulgazione sono in <strong>"I miei progressi"</strong>{" "}
            di ogni persona, dove chi insegna vede esattamente la stessa vista.
          </p>
          <p className="m-0">
            <strong>Il punteggio:</strong> {SCORE_ERKLAERUNG_IT_INSEGNANTE}
          </p>
          <p className="m-0">
            <strong>Nella tabella della classe</strong> tre colonne sono
            raggruppate sotto il titolo <strong>"Esercizio"</strong>: precisione,
            battute al minuto e punteggio. Tutte e tre vengono dall'esercizio nel
            periodo scelto, e il punteggio unisce le altre due. Per questo hanno
            uno sfondo un po' più grigio e un bordo sottile; il lettore di schermo
            annuncia "Esercizio" prima del titolo della colonna. La colonna{" "}
            <strong>"{W}"</strong>, tutta a destra, resta di proposito fuori da
            quel gruppo - sotto il suo titolo "{W}": è una prova in un giorno
            preciso, non l'esercizio quotidiano.
          </p>
          <p className="m-0">
            Nella colonna <strong>"Punteggio"</strong>: chi ha scritto meno di 200
            caratteri nel periodo scelto non ha punteggio, solo un trattino -
            sotto questa soglia un solo errore farebbe perdere diversi punti.
          </p>
          <p className="m-0">
            <strong>"Scarica in Excel"</strong> è sopra la tabella, a destra di
            "Dall'inizio". Il pulsante scarica la tabella con il nome{" "}
            <strong>nomedellaclasse_data.xlsx</strong> (per esempio
            "3A_2026-09-12.xlsx") - per il periodo scelto in quel momento.
            All'inizio c'è una panoramica con link ai quattro periodi e una
            legenda che spiega ogni colonna e mostra come si calcola il punteggio.
            Seguono quattro fogli: l'anno scolastico in corso, dall'inizio, il
            mese (le ultime 4 settimane) e questa settimana. I valori sono salvati
            come numeri, per poter continuare a calcolare in Excel; dove la
            tabella mostra un trattino, lo mostra anche il file.
          </p>
          <p className="m-0">
            <strong>La panoramica della classe</strong> sopra la tabella mostra la
            classe nel suo insieme. "Mese" (le ultime 4 settimane) è già scelto;
            "Anno scolastico" è subito accanto. Una riga dà le battute al minuto,
            la precisione e gli obiettivi settimanali, ognuno con una piccola
            tendenza - per il mese rispetto alle 4 settimane precedenti, per
            l'anno scolastico le prime settimane di esercizio rispetto alle
            ultime.
          </p>
          <p className="m-0">
            <strong>La barra a punti "Punteggi nella classe"</strong> mostra un
            punto per persona. Il tasto Tab porta alla barra, e le frecce passano
            da una persona all'altra - ogni fermata viene annunciata ("Giulia, 78
            punti"). Quante persone sono sotto 50, tra 50 e 70, tra 70 e 85 e
            sopra 85 punti, e chi ha scritto troppo poco, lo dice il
            suggerimento del suo titolo.
          </p>
          <p className="m-0">
            <strong>Il grafico "Punteggio della classe nell'anno
            scolastico"</strong> mostra, per settimana, la media di chi ha scritto
            almeno 5 righe; un vuoto significa che quella settimana c'è stato
            pochissimo esercizio. Il tasto Tab porta al grafico, e le frecce
            passano da una settimana all'altra; per il lettore di schermo tutte le
            settimane sono anche in una tabella. Quando arrivano il tasto Maiusc,
            i numeri o i caratteri speciali, la curva scende per un po' - è
            normale e non c'è da preoccuparsi.
          </p>
          <p className="m-0">
            <strong>La curva:</strong> {STEIGERUNG_HINWEIS_IT}
          </p>
          <p className="m-0">
            <strong>Trasparenza:</strong> ogni persona vede esattamente gli stessi
            numeri su di sé in "I miei progressi" - chi insegna non vede mai più
            della persona stessa.
          </p>
        </Section>

        <Section title="8a · I valori su cui costruire un voto">
          <DreiWerteHilfe />
        </Section>

        <Section title={`8b · La ${W}: una prova per tutta la classe`}>
          <p className="m-0">
            Nella zona per insegnanti <strong>"Le mie classi"</strong>, in cima
            alle <strong>statistiche della classe</strong> di Tastenflow, nella
            riga delle attività, c'è il pulsante <strong>"{W}"</strong>. Apre il
            modulo con cui si lancia una prova per tutta la classe -{" "}
            <strong>tutti gli alunni ricevono lo stesso testo</strong>, qualunque
            sia il loro punto nel percorso.
          </p>
          <p className="m-0">
            <strong>Tre cose da regolare:</strong> i{" "}
            <strong>tasti usati</strong> (da "Riga di base" a "Tutti i tasti"),
            subito accanto il <strong>tipo</strong>, e il{" "}
            <strong>tempo</strong> in minuti. <strong>"Avvia ora"</strong> la fa
            partire subito.
          </p>
          <p className="m-0">
            <strong>Rigoroso</strong> (predefinito): un tasto sbagliato non fa
            andare avanti, ogni errore di battuta conta - anche se corretto
            subito. <strong>Scrittura libera</strong> assomiglia a una copiatura
            classica: gli errori restano come sono stati scritti e non vengono
            segnalati, e Backspace corregge solo dentro la riga attuale. Quello
            che si valuta si calcola solo alla fine, da quello che è ancora
            sbagliato - al massimo un errore per parola, l'ultima parola non
            finita non conta, e i punti corretti non contano affatto. Siccome un
            errore che resta non è costato tempo di scrittura, pesa di più:{" "}
            {FEHLER_GEWICHT_FREI} caratteri invece di {FEHLER_GEWICHT} (8a).
            Scegliere "Scrittura libera" quando la classe deve esercitare una
            copiatura senza che un errore blocchi la scrittura; scegliere
            "Rigoroso" per mettere alla prova la scrittura stessa.
          </p>
          <p className="m-0">
            <strong>Tre orologi da distinguere:</strong>
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              L'<strong>avvio</strong> - il momento in cui si preme "Avvia ora".
              Da lì la classe può iniziare.
            </li>
            <li>
              Il <strong>periodo per iniziare</strong>: {EINSTIEGSFENSTER_MIN}{" "}
              minuti dopo l'avvio. Fino ad allora ogni persona può ancora
              iniziare; dopo è tardi.
            </li>
            <li>
              Il <strong>tempo</strong> corre{" "}
              <strong>separatamente per ogni persona</strong>, e solo dalla sua{" "}
              <strong>prima battuta</strong>. Due persone della stessa classe
              finiscono quindi in momenti diversi - è voluto: chi prima ha bisogno
              di orientarsi non perde tempo.
            </li>
          </ul>
          <p className="m-0">
            <strong>I testi:</strong> per ogni livello di tasti ci sono{" "}
            <strong>{PROBEN_JE_NIVEAU} testi della {W}</strong> di almeno{" "}
            {zahl(MIND_ZEICHEN, "it")} caratteri ciascuno - abbastanza lunghi da
            non finire mai, nemmeno ad alta velocità. Questi testi{" "}
            <strong>non compaiono nel percorso</strong>, quindi nessuno ha potuto
            esercitarli prima. La {W} successiva con quei tasti riprende dal punto
            più lontano raggiunto la volta prima: alla riga successiva o, nei testi
            con frasi, all'inizio della frase successiva. Se un testo finisce
            durante la {W}, gli alunni continuano con il successivo senza
            interruzioni. Per ora i testi della {W} sono in tedesco, in inglese,
            in francese o in spagnolo; per scrivere in italiano si sceglie "File
            personale".
          </p>
          <p className="m-0">
            <strong>Alunni con disabilità visiva:</strong> fanno la {W} con la{" "}
            <strong>lettura ad alta voce</strong> del programma (<Kbd>Alt</Kbd> +{" "}
            <Kbd>V</Kbd>) - come nell'esercizio, senza una casella a parte. Il
            tempo che ogni persona passa ad aspettare la voce lo toglie l'orologio
            stesso della {W}; a chi non ha una disabilità visiva e si fa comunque
            leggere il testo ad alta voce si toglie lo stesso. Così il tempo della
            lettura ad alta voce è già compensato; altre misure compensative o
            adattamenti previsti nella propria scuola li decide chi insegna.
          </p>
          <p className="m-0">
            <strong>I risultati</strong> sono nel pannello aperto in "{WM}{" "}
            precedenti" - il pulsante "{W}" all'inizio della riga lo apre: per
            ogni persona il posto, il <strong>punteggio</strong>, se la lettura ad
            alta voce era attiva, la velocità, la precisione e i tasti incerti.
            Come si calcola il punteggio è spiegato al punto 8a. Appena la {W} è
            finita per <strong>tutta la classe</strong>, arriva anche un'
            <strong>email con il riepilogo</strong> e gli stessi numeri.
          </p>
          <p className="m-0">
            Ogni persona può scegliere{" "}
            <strong>"Questa volta non partecipo"</strong>. Allora continua a
            esercitarsi normalmente e compare nei risultati come{" "}
            <strong>"non ha partecipato"</strong>. Dopo, ogni persona vede le
            proprie {WM} in <strong>"I miei progressi"</strong> - gli stessi
            numeri che vede chi insegna.
          </p>
        </Section>

        <Section title="9 · Lavoro autonomo / controllo con IA (solo per chi insegna)">
          <p className="m-0">
            La colonna <strong>"Lavoro autonomo"</strong> mostra un valore da{" "}
            <strong>1 a 10</strong>. Sale con indizi che qualcosa non l'abbia
            scritto la persona stessa: <em>testo incollato</em>, cambi frequenti
            di finestra o di focus, una velocità poco credibile o una precisione
            perfetta senza un percorso di apprendimento. Questo valore lo vede
            solo <strong>chi insegna</strong>, non gli alunni. È un invito a
            guardare con più calma - mai un giudizio sulla persona.
          </p>
        </Section>

        <Section title="10 · Accessibilità">
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Contrasto e dimensione del testo:</strong> nella barra in
              alto (chiaro, scuro, alto contrasto); <Kbd>Alt</Kbd> +{" "}
              <Kbd>+</Kbd> / <Kbd>-</Kbd> ingrandisce o rimpicciolisce il campo di
              scrittura.
            </li>
            <li>
              <strong>Lettura ad alta voce</strong> con <Kbd>Alt</Kbd> +{" "}
              <Kbd>V</Kbd> - per chi non ha un lettore di schermo impostato (con
              NVDA, JAWS o VoiceOver meglio lasciarla disattivata). Si può
              scegliere se leggere <em>tasti / parole / frasi</em>, la velocità e{" "}
              <strong>quale voce</strong>. Il{" "}
              <strong>tempo di lettura si toglie dal calcolo della
              velocità</strong> - così chi ha bisogno della lettura ad alta voce
              non ci perde nelle statistiche.
            </li>
            <BrailleTabellenPunkte weg="it" />
            <li>
              <strong>Annuncio del dito:</strong> premere due volte veloce il
              tasto <Kbd>Maiusc</Kbd> annuncia il dito giusto.
            </li>
            <li>
              <strong>Gestione del focus:</strong> ogni pulsante ha una
              destinazione definita - chi lo preme sa dopo dov'è il cursore di
              scrittura. Per gli alunni che lavorano con un display braille è la
              differenza tra continuare e cercare. Tre regole da conoscere in
              classe: <Kbd>Esc</Kbd> chiude qualsiasi finestra e porta sempre{" "}
              <strong>al campo di scrittura</strong>; un cambio di vista
              (statistiche, biblioteca, accesso) arriva al{" "}
              <strong>titolo della vista nuova</strong> e lo annuncia; e{" "}
              <strong>niente sparisce da solo</strong> - anche la festa per uno
              sblocco aspetta che la persona prema "Avanti".
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>E</Kbd> salta al campo di scrittura,{" "}
              <Kbd>Alt</Kbd> + <Kbd>H</Kbd> apre l'aiuto.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>U</Kbd> passa all'esercizio,{" "}
              <Kbd>Alt</Kbd> + <Kbd>S</Kbd> a <strong>"Le mie classi"</strong>;{" "}
              <Kbd>Alt</Kbd> + <Kbd>Z</Kbd> annuncia la riga in cui si è.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>D</Kbd> dà il tempo di esercizio - sul display
              braille e (con la lettura ad alta voce) come annuncio.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>T</Kbd> apre o chiude l'
              <strong>elenco delle scorciatoie da tastiera</strong>.
            </li>
          </ul>
        </Section>

        <Section title="11 · Eliminare">
          <p className="m-0">
            Una persona o una classe intera si possono eliminare per sempre (con
            l'account, i progressi e i risultati). Non si può annullare - prima
            si chiede una conferma.
          </p>
        </Section>

        <Section title="12 · Download: la guida e il poster (PDF)">
          <p className="m-0">
            Tutto quello che dice questo aiuto, e molto di più, è nella{" "}
            <strong>guida per insegnanti</strong>: il percorso con tutte le sue
            tappe, la tastiera italiana e quella del Mac, il pannello della
            classe, la {W} passo per passo, il punteggio e i valori per una
            valutazione.
          </p>
          <HandbuchLaden />
          <p className="m-0">
            Per la parete di un'aula o della sala insegnanti c'è anche il{" "}
            <strong>poster di Tastenflow</strong> in formato A3, con un codice QR
            per tastenflow.org. È libero per tutti, senza
            accesso.
          </p>
          <PlakatLaden />
          <p className="m-0 text-sm text-ink-muted">
            Si trovano tutti e due anche in "Le mie classi", in "Download".
          </p>
        </Section>
      </div>
    </div>
  );
}
