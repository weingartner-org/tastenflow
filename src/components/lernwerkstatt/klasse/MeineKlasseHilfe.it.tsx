/**
 * ★★★ O-IT (02.10.2026): DIE HILFE ZU „MEINE KLASSEN" AUF ITALIENISCH.
 * ===========================================================================
 * Aus der Funktion geschrieben, nach dem Muster von `MeineKlasseHilfe.es.tsx`
 * (dieselben Abschnitte, dieselben Tatsachen) - nicht Satz für Satz aus dem
 * Deutschen übertragen. Sichtbar nur mit `spracheGewaehlt === "it"`
 * (`MeineKlasseHilfe.tsx`); jedes Programm ohne Sprach-Anbieter zeigt weiter
 * die deutsche Fassung.
 *
 * Anrede: Infinitiv und neutrale Formen, nie „Lei" (Glossar
 * `recherche-italienisch-2026-10-02/GLOSSAR-it.md`, Regel 1). „alunni" als
 * Sammelwort, die einzelne „persona", „l'insegnante" (Regel 2). Die Namen
 * der italienischen Oberfläche: *Le mie classi*, *Progressi | Alunni e
 * accessi*, *Sfida*, *Esercizio personalizzato*, *Gara di classe*, *Obiettivo
 * settimanale*, *Impostazioni della classe*, *Sospendere per 1 ora*, *codice
 * classe*. Tastenwege als Tastenwege, nie Maus-Wörter. Die Namen der
 * Startpunkte stehen in `letters.ts` (Etappe F4) - die Hilfe beschreibt sie
 * darum über ihre Tasten statt über ihren Namen.
 */
import { Modal } from "@/components/Modal";
import { RundgangMeineKlassenKnopf } from "@/components/typing/Rundgang";
import {
  DreiWerteHilfe,
  LeistungsstufeHilfe,
  SpaltenHilfe,
} from "@/components/typing/TastenflowZahlenHilfe";
import {
  EINSTIEGSFENSTER_MIN,
  PRUEFUNG_WORT_IT,
  PRUEFUNG_WORT_MEHRZAHL_IT,
} from "@/lib/typing/schreibprobe";

function Abschnitt({ titel, children }: { titel: string; children: React.ReactNode }) {
  return (
    <section className="space-y-1.5">
      <h3 className="m-0 text-base font-semibold text-ink">{titel}</h3>
      <div className="space-y-1.5 text-sm leading-relaxed text-ink">{children}</div>
    </section>
  );
}

function Taste({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-hairline bg-surface-sunken px-1.5 py-0.5 text-sm text-ink">
      {children}
    </kbd>
  );
}

export function MeineKlasseHilfeItalienisch({
  onClose,
  programmName,
}: {
  onClose: () => void;
  /** Das offene Programm - davon hängt ab, welche Abschnitte dastehen. */
  programmName?: string;
}) {
  const tastenflow = programmName === "Tastenflow";
  const W = PRUEFUNG_WORT_IT;
  return (
    <Modal title='Aiuto di "Le mie classi"' onClose={onClose} size="lg">
      <div className="space-y-5">
        <RundgangMeineKlassenKnopf onStart={onClose} programmName={programmName} />
        <p className="m-0 text-sm leading-relaxed text-ink">
          Qui si lavora con la classe. Le classi e gli account si creano{" "}
          <strong>una volta sola</strong> - valgono in tutti i programmi, con lo
          stesso codice classe e la stessa password.
          {tastenflow && (
            <>
              {" "}
              Chi insegna, aprendo Tastenflow, arriva sempre qui. "Esercitarsi"
              (<Taste>Alt</Taste> + <Taste>U</Taste>) porta al proprio
              esercizio.
            </>
          )}
        </p>

        <Abschnitt titel="Com'è fatta la pagina">
          <p className="m-0">
            <strong>In alto, nella classe,</strong> ci sono il nome - con più
            classi, nell'elenco a discesa "Classe", per passare dall'una
            all'altra -, il numero degli alunni e il codice classe. A destra di
            questa riga, subito prima di "Download", c'è il selettore{" "}
            <strong>"Progressi | Alunni e accessi"</strong> - nello stesso
            punto nelle due schermate a cui porta.
          </p>
          <p className="m-0">
            In <strong>"Alunni e accessi"</strong> si crea una classe nuova, si
            aggiungono alunni e li si sposta di classe, si vedono le password e
            i dati di accesso, il codice classe e i programmi della classe. Per
            aggiungere molte persone insieme, in "Alunni" c'è{" "}
            <strong>"Importa alunni da Excel"</strong>: prima "Scarica il
            modello (Excel)", poi una riga per persona con nome, password e -
            per Tastenflow - il punto di partenza. Se una password resta vuota,
            ne viene creata una; un'anteprima mostra che cosa verrà importato,
            e poi tutte le persone importate compaiono in "Stampa i dati di
            accesso". Con <strong>"Scarica l'elenco della classe"</strong>,
            proprio accanto, si scarica in qualsiasi momento un file Word con
            nome, password e codice classe di TUTTI gli alunni di questa classe
            - pronto da stampare.
            {!tastenflow && (
              <>
                {" "}
                Un messaggio a tutti gli alunni si scrive lì con "Messaggio alla
                classe".
              </>
            )}
          </p>
          <p className="m-0">
            In <strong>"Progressi"</strong> - dove si arriva aprendo la pagina -
            ci sono i programmi di questa classe, i "Download" e, sotto, le
            statistiche della classe: a che punto è ogni persona.
            {tastenflow && (
              <>
                {" "}
                In cima c'è una riga di pulsanti: <strong>{W}</strong>,{" "}
                <strong>Esercizio personalizzato</strong>,{" "}
                <strong>Obiettivo settimanale</strong>,{" "}
                <strong>Impostazioni della classe</strong> e{" "}
                <strong>Sospendere per 1 ora</strong>. Ogni pulsante apre una
                propria zona qui sotto - una sola alla volta, e{" "}
                <Taste>Esc</Taste> la richiude. "{W}" apre il modulo con i tasti
                usati, il tempo in minuti e "Avvia ora", oltre alle{" "}
                {PRUEFUNG_WORT_MEHRZAHL_IT} precedenti; "Esercizio
                personalizzato" assegna un testo a tutta la classe (un file
                caricato, un testo da "I miei testi" o un modello del percorso -
                gli alunni ricevono allora una finestra con solo "Avanti");
                "Obiettivo settimanale" imposta i minuti alla settimana;
                "Sospendere per 1 ora" segna 60 minuti in cui la classe continua
                a esercitarsi, ma niente conta per l'obiettivo settimanale.
                Sotto c'è la "Panoramica della classe" (mese o anno scolastico,
                con la barra a punti e il grafico); a destra del suo titolo,
                "Messaggio alla classe" - un messaggio a tutti gli alunni, che
                ogni persona riceve nella propria conversazione.
              </>
            )}
          </p>
          {tastenflow && (
            <p className="m-0">
              Il pulsante <strong>"Impostazioni della classe"</strong> di quella
              riga apre: la classe frequentata (da lì il programma deduce il
              tipo di testi, e avanza a ogni anno scolastico, che nel programma
              inizia il primo agosto se non si sceglie un altro mese; "Persone
              adulte" non avanza), la lingua con il suo blocco, il punto di
              partenza della classe (vale anche per chi arriva più tardi), la
              Gara di classe e "Fine della riga con Invio". Queste cinque
              impostazioni valgono per tutta la classe e si chiedono già quando
              si crea una classe; per ogni persona restano, nella sua riga
              aperta, "Da dove iniziare?", "Scrivere con una mano", "La velocità
              non conta" e "Spaziatura ampia (CVI)".
            </p>
          )}
          {tastenflow && (
            <p className="m-0">
              I punti di partenza di <strong>"Da dove iniziare?"</strong> vanno
              per tasti: il primo sono solo F e J, il secondo tutta la riga di
              base. Il terzo aggiunge le lettere più frequenti che seguono e il
              tasto Maiusc. Gli ultimi - tutte le lettere, punteggiatura, numeri
              e tutti i tasti - sbloccano poi il resto, uno dopo l'altro.
            </p>
          )}
          <p className="m-0">
            Ogni pulsante si spiega da solo: il suggerimento compare appena il
            focus ci arriva con il tasto Tab. <Taste>Esc</Taste> lo fa sparire.
          </p>
        </Abschnitt>

        {tastenflow && (
          <Abschnitt titel={`La ${W}, passo per passo`}>
            <ol className="m-0 list-decimal space-y-1 pl-5">
              <li>
                In cima alle statistiche della classe, nella riga delle
                attività, il pulsante "{W}" apre il modulo.
              </li>
              <li>
                Scegliere i <strong>tasti usati</strong> - tutti gli alunni
                ricevono lo stesso testo di quel livello.
              </li>
              <li>
                Indicare il <strong>tempo</strong> in minuti - il campo è subito
                accanto al livello.
              </li>
              <li>
                Dire agli alunni: <em>Il tempo parte con la prima battuta di
                ogni persona.</em> Dall'avvio hanno {EINSTIEGSFENSTER_MIN} minuti
                per iniziare; poi il tempo corre separatamente per ogni persona.
              </li>
              <li>
                <strong>"Avvia ora"</strong> - la {W} parte subito per tutta la
                classe.
              </li>
              <li>
                Subito dopo compare, per esempio,{" "}
                <strong>"Pronti: 12 su 14 - non ancora: Said, Jano"</strong>: su
                12 dispositivi la {W} è già arrivata. Arriva in circa un
                secondo. Se qualcuno resta a lungo su "non ancora", di solito
                basta ricaricare la pagina una volta.
              </li>
              <li>
                Durante la {W} si vede "Consegnate: 3 su 14" con i nomi.
              </li>
              <li>
                Alla fine i risultati compaiono sotto il modulo: per ogni persona
                il posto, il <strong>punteggio</strong>, se la lettura ad alta
                voce era attiva, le battute al minuto, la precisione, i
                caratteri, gli errori e i tasti ancora incerti. Arriva anche
                un'email con il riepilogo.
              </li>
            </ol>
          </Abschnitt>
        )}

        {tastenflow && (
          <>
            <Abschnitt titel="Che cosa significano le colonne della tabella">
              <SpaltenHilfe />
            </Abschnitt>

            <Abschnitt titel="Che cosa significa il livello">
              <LeistungsstufeHilfe />
            </Abschnitt>

            <Abschnitt titel="I valori su cui costruire un voto">
              <DreiWerteHilfe />
            </Abschnitt>
          </>
        )}

        <Abschnitt titel="Il codice classe">
          <p className="m-0">
            Compare in alto, accanto al nome della classe, e vale per tutti i
            programmi. Per accedere si scrivono il codice classe, il nome e la
            password; il dispositivo ricorda il codice, e poi bastano nome e
            password.
          </p>
          <p className="m-0">
            È <strong>obbligatorio</strong> quando si crea una classe. Mentre si
            scrive il nome, il programma propone un codice adatto - "5B Rossi"
            diventa "5BROSSI". Si può cambiare, ma non lasciare vuoto. Più tardi
            si cambia in "Alunni e accessi" con "Modificare la classe".
          </p>
          <p className="m-0">
            ⚠️ Se si cambia il codice, tutti gli alunni della classe accedono da
            quel momento con quello nuovo.
          </p>
        </Abschnitt>

        <Abschnitt titel="Spostare una persona in un'altra classe">
          <p className="m-0">
            In "Alunni e accessi" ogni persona ha{" "}
            <strong>"Sposta in un'altra classe"</strong>. Si apre così il campo
            "Codice della classe nuova". Funziona con qualsiasi classe di cui si
            conosce il codice - anche con la classe di un'altra persona che
            insegna. Prima di spostarla, il programma chiede ancora una
            conferma.
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>La persona accede poi con il nuovo codice classe.</li>
            <li>Gli insegnanti della classe nuova vedono la persona e i suoi progressi.</li>
            <li>
              {tastenflow
                ? `I risultati delle ${PRUEFUNG_WORT_MEHRZAHL_IT} precedenti e i messaggi restano nella classe precedente.`
                : "I messaggi restano nella classe precedente."}
            </li>
          </ul>
        </Abschnitt>

        <Abschnitt titel="Scorciatoie da tastiera di questa zona">
          <p className="m-0">
            <Taste>Alt</Taste> + <Taste>H</Taste> apre e chiude questo aiuto.{" "}
            <Taste>Alt</Taste> + <Taste>T</Taste> mostra l'elenco di tutte le
            scorciatoie. <Taste>Alt</Taste> + <Taste>U</Taste> porta al proprio
            esercizio. <Taste>Alt</Taste> + <Taste>N</Taste> apre i messaggi,{" "}
            <Taste>Alt</Taste> + <Taste>K</Taste> il menu di colori e contrasto,
            e <Taste>Alt</Taste> + <Taste>J</Taste> il menu dell'account.
          </p>
          <p className="m-0">
            Il tasto Tab passa da una scheda all'altra; Invio cambia scheda. Dopo
            il cambio, il focus è nella zona nuova - un lettore di schermo
            continua a leggere da lì.
          </p>
        </Abschnitt>

        <Abschnitt titel="Per saperne di più">
          <p className="m-0">
            La guida per insegnanti si apre in alto con "Download" - lì c'è anche
            il poster di Tastenflow da stampare e appendere (A3), disponibile
            per tutti, anche senza accesso.
            {tastenflow && (
              <>
                {" "}
                L'aiuto dentro il programma stesso si apre lì con{" "}
                <Taste>Alt</Taste> + <Taste>H</Taste>.
              </>
            )}
          </p>
        </Abschnitt>
      </div>
    </Modal>
  );
}
