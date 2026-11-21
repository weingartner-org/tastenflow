/**
 * Anmelde-Status des Tipptrainers (eigene Konten, getrennt von der
 * LMS-Anmeldung). Hält das aktuell angemeldete Konto. Die eigentliche Sitzung
 * (über Reloads hinweg) verwaltet das Backend selbst - lokal in localStorage,
 * auf dem Server über PocketBase. Muster vom Braille-Trainer.
 * Siehe [[project_zehnfinger_trainer]].
 *
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★★★ DIE KLASSE HAT VORRANG (B9/B11, Umbau 11.09.2026)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Johannes: *„Jede Klasse hat also nur eine Textstufe … Auch oben für die ganze
 * Klasse kann man die Sprache einstellen und ob man sie sperrt."*
 *
 * Gehört ein Konto einer Klasse an, gelten **Textstufe, Sprache und Sperre der
 * KLASSE**. Das geschieht an genau dieser Stelle - dort, wo das angemeldete
 * Konto in die App kommt - und nirgendwo sonst:
 *
 *   • `stufe`       = {@link klassenStufe} aus der Schulstufe der Klasse
 *   • `lang`        = die Sprache der Klasse (sonst die des Kindes)
 *   • `langLocked`  = die Sperre der Klasse
 *   • `geburtsjahr` = `undefined` - ein Klassenkind hat keines mehr, und ein
 *                     altes im Datensatz darf die Klassenstufe nicht
 *                     übersteuern (`stufeFuer` liest es sonst)
 *
 * ── ⚠️ WARUM HIER UND NICHT IN JEDEM LESER ────────────────────────────────
 * Die Stufe wird an mindestens sieben Stellen gelesen (`stufeFuer`,
 * `contentStufenFor`, Generator, Wortspiele, Einrichtung, Zahnrad, Kopfzeile).
 * Jede einzeln nachzuziehen hiesse sieben Regeln, die am zweiten Tag
 * auseinanderlaufen ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 * Sie alle lesen das Konto aus DIESEM Speicher - wer es hier richtig
 * hinlegt, hat sie alle.
 *
 * ── ⚠️ GERECHNET, NICHT KOPIERT ───────────────────────────────────────────
 * In den Datensatz des Kindes wird nichts geschrieben. Ein Kind, das im Mai
 * beitritt, bekommt damit sofort die Einstellungen der Klasse; und ändert die
 * Lehrkraft die Schulstufe, gilt sie beim nächsten Start für alle. **Mitten in
 * einer laufenden Sitzung wirkt eine Änderung nicht** - das ist Absicht: Es
 * gibt keinen Fall, in dem ein Kind beim Tippen die Textsorte wechseln soll,
 * und ein Realtime-Horcher dafür wäre Aufwand ohne Nutzen. Der nächste Start
 * reicht.
 *
 * ── ⚠️ EIN LADEFEHLER NIMMT NIE ETWAS WEG ─────────────────────────────────
 * Keine Klasse, kein Netz, ein kaputter Datensatz: Dann bleibt das Konto so,
 * wie es kam. Dasselbe Versprechen wie in `useKlassenRhythmus`.
 *
 * ⚠️ Das Kind darf `stufe` am Server weiterhin schreiben (Feld-Wächter
 * `tt_pupils_field_guard.pb.js` unverändert) - es wird nur nicht mehr gelesen.
 * Angeboten wird es ihm nirgends mehr (`TypingSettings`).
 */
import { create } from "zustand";
import { TypingAccount, TypingClass, gehoertEinerKlasse, rememberClassCode } from "@/lib/typing/account";
import { typingBackend } from "@/lib/typing/backend";
import { klassenStufe } from "@/lib/typing/klassenEinstellungen";
import { hatEigeneSchulstufe, startpunktMitKlasse } from "@/lib/typing/klassenEinstellungen";
import { istSitzungAbgelaufen } from "@/lib/typing/sitzung";
import { gezieltFuerKind } from "@/lib/typing/gezielt";

/**
 * Die zuletzt geladene Klasse - damit nicht jedes `update()` (Wochenziel,
 * Startpunkt, Passwort) einen neuen Netzweg auslöst. Ein Modul-Wert und kein
 * Zustand im Speicher: Er ist kein Teil dessen, was die Oberfläche anzeigt.
 */
let geladeneKlasse: { code: string; cls: TypingClass | null } | null = null;

/**
 * Den Merker leeren. Das Abmelden tut es von selbst; die Wächter brauchen es,
 * weil ein Modul-Wert zwischen zwei Testfällen stehen bliebe und der zweite
 * dann die Klasse des ersten sähe.
 */
export function vergissGeladeneKlasse(): void {
  geladeneKlasse = null;
}

/**
 * Die Klassenwerte über ein Konto legen - die EINE Stelle des Vorrangs.
 *
 * ★★★ Seit 11.09.2026 (Nacht) gehört das STARTNIVEAU DER KLASSE dazu. Johannes
 * wählte „Startniveau als Vorgabe an der Klasse speichern": Ein Kind, das der
 * Klasse beitritt - auch Monate später -, beginnt auf diesem Startniveau.
 * Die Regel steht in {@link startpunktMitKlasse} (`klassenEinstellungen.ts`):
 * ein eigener, neuerer Beschluss des Kindes gilt; sonst nimmt die Vorgabe nur
 * DAZU. Angewandt wird das Ergebnis weiter an genau einer Stelle, beim Laden
 * des Fortschritts durch das Kind (`TippenTrainerPage`, `startpunktAnwenden`) -
 * der Lernstand gehört dem Kind, hier wird nur der Wunsch gerechnet.
 *
 * ⏳ Offen (24.09.2026, Bauplan englischer Lehrgang §7): `lang` nimmt IMMER die
 * Sprache der Klasse, auch ohne `langLocked`. Eine Änderung (ungesperrt ⇒ die
 * eigene Wahl des Kindes gilt) würde bei laufenden Klassen sofort wirken - ein
 * Kind, das die Bedienung einmal auf Englisch gestellt hat, bekäme englische
 * Übungstexte. Das entscheidet Johannes; bis dahin bleibt es, wie es ist.
 */
export function mitKlassenVorrang(
  konto: TypingAccount,
  cls: TypingClass | null,
  jetztMs: number = Date.now(),
): TypingAccount {
  if (!cls) return konto;
  return {
    ...startpunktMitKlasse(konto, cls),
    // ★ 25.09.2026 (Johannes): Hat die Lehrkraft DIESEM Kind eine eigene
    // Schulstufe gegeben, gilt sie statt der der Klasse - gerechnet wie die
    // der Klasse (wächst jedes Schuljahr mit, 100 = Erwachsen).
    // ⚠️ Anders als die Klassenwerte kommt sie mit dem Konto LIVE
    // (`kontoBeobachten`): ändert die Lehrkraft sie, gilt sie ab dem nächsten
    // Textnachschub, nicht erst beim nächsten Start.
    stufe: hatEigeneSchulstufe(konto)
      ? klassenStufe(
          {
            schulstufe: konto.schulstufe,
            schulstufeSchuljahr: konto.schulstufeSchuljahr,
            // ★ D2 (28.09.2026): das Schuljahr der KLASSE - geschrieben wird
            // das Eintragsjahr ebenso (`TastenflowReiter.onSetSchulstufe`).
            settings: cls.settings,
          },
          jetztMs,
        )
      : klassenStufe(cls, jetztMs),
    lang: cls.lang ?? konto.lang,
    langLocked: !!cls.langLocked,
    // ⚠️ Ohne das `undefined` gewönne ein altes Geburtsjahr aus dem Datensatz
    // über `stufeFuer` - genau die Zahl, die ein Klassenkind nicht mehr hat.
    geburtsjahr: undefined,
    // ★ Zeilenende mit Enter (23.09.2026) - die Klasse entscheidet, siehe
    // TypingClass.zeilenEndeEnter.
    zeilenEndeEnter: !!cls.zeilenEndeEnter,
    // ★ „Gezielt üben" (13.11.2026): Vorrang hat das Feld am Kind (auch `{zeichen: []}` = aus für dieses Kind),
    // sonst gilt die Klasse; abgelaufen = nichts gesetzt (`gezielt.ts`).
    gezielt: gezieltFuerKind(konto.gezielt, cls.gezielt, new Date(jetztMs)),
  };
}

/** Gilt für dieses Konto überhaupt eine Klasse? */
function braucht(konto: TypingAccount | null): string | null {
  if (!konto || !gehoertEinerKlasse(konto) || !konto.classCode) return null;
  return konto.classCode;
}

/**
 * Die Klasse eines Kontos - aus dem Merker, sonst vom Server (und dann
 * gemerkt). `null` = keine Klasse, kein Netz, Klasse unbekannt.
 *
 * ★★ Warum es diesen Weg braucht (11.09.2026, Nacht - Startniveau der Klasse):
 * `setzeKonto` legt das Konto SOFORT ab und zieht die Klasse erst nach. Der
 * Startpunkt wird aber genau EINMAL angewandt, beim Laden des Fortschritts
 * (`TippenTrainerPage`, `loadFn`) - und der Fortschritt ist oft schneller da
 * als die Klasse. Ohne diesen Weg liefe `startpunktAnwenden` beim ersten
 * Öffnen mit dem Wert des Kontos, die Vorgabe der Klasse käme zu spät, und
 * nach jedem Neuladen gäbe es dasselbe Rennen wieder. Wer den Startpunkt
 * anwendet, holt die Klasse darum hierüber und legt sie mit
 * {@link mitKlassenVorrang} über das Konto - dieselbe eine Regel.
 *
 * ── ★★★ MIT ZEITGRENZE (11.09.2026, Nacht - Prüfbefund) ─────────────────
 * Die Übungsseite eines Klassenkindes wartet auf diese Antwort. Hängt die
 * Anfrage im Schul-WLAN, OHNE zu scheitern (die PocketBase-Bibliothek hat keine
 * eigene Zeitgrenze), stünde die Seite - vorher hing sie nur am Lernstand.
 * Nachgestellt in `tests/tastenflow-klasse-vorgaben-frist-und-anzeige.test.tsx`:
 * `getClass` antwortet nie, das Übungsfeld erschien nicht. Nach
 * {@link KLASSE_FRIST_MS} geht es darum mit `null` weiter - genau wie bei einem
 * Ladefehler: Das Konto gilt, wie es kam, und die Vorgabe der Klasse wirkt beim
 * nächsten Öffnen.
 *
 * ⚠️ Kommt die Klasse NACH der Frist doch noch, wird sie NICHT gemerkt. Die
 * Sitzung ist dann schon mit dem Wert des Kontos gestartet; ein später
 * gemerkter Wert liesse die nächste Ladung derselben Sitzung (Moduswechsel,
 * neue Runde) auf einmal einen anderen Startpunkt anwenden - mitten im Üben,
 * und genau das soll nicht geschehen (Kopf dieser Datei: „Mitten in einer
 * laufenden Sitzung wirkt eine Änderung nicht"). Die nächste Frage geht wieder
 * zum Server.
 *
 * ⚠️ Der Merker `geladeneKlasse` wird innerhalb einer Sitzung NICHT erneuert:
 * Ändert die Lehrkraft die Vorgabe (Startniveau, Schulstufe, Sprache), wirkt
 * das beim nächsten Öffnen von Tastenflow, nicht mitten in der Sitzung.
 */
export async function klasseFuer(
  konto: TypingAccount | null,
  fristMs: number = KLASSE_FRIST_MS,
): Promise<TypingClass | null> {
  const code = braucht(konto);
  if (!code) return null;
  if (geladeneKlasse?.code === code) return geladeneKlasse.cls;
  let zuSpaet = false;
  let uhr: ReturnType<typeof setTimeout> | undefined;
  const frist = new Promise<null>((fertig) => {
    uhr = setTimeout(() => {
      zuSpaet = true;
      fertig(null);
    }, fristMs);
  });
  const laden = (async () => {
    try {
      const cls = await typingBackend().getClass(code);
      // Nur einen TREFFER merken (Begründung in `setzeKonto`) - und nur, wenn
      // er noch rechtzeitig kam (Begründung oben).
      if (cls && !zuSpaet) geladeneKlasse = { code, cls };
      return cls;
    } catch {
      // Ein Ladefehler nimmt nie etwas weg - dann gilt das Konto, wie es kam.
      return null;
    }
  })();
  try {
    return await Promise.race([laden, frist]);
  } finally {
    clearTimeout(uhr);
  }
}

/**
 * So lange wartet die Übungsseite höchstens auf die Klasse (11.09.2026, Nacht).
 *
 * Warum 3 s: Die Klasse ist EIN kleiner Datensatz; im Normalfall kommt er in
 * wenigen hundert Millisekunden - 3 s sind ein Vielfaches davon und fangen
 * auch ein langsames Schul-WLAN noch ab. Länger darf es nicht sein: Das Warten
 * kommt zum Laden des Lernstands dazu, und ein Kind, das mehr als ein paar
 * Sekunden vor einer leeren Seite sitzt, drückt Tasten ins Leere oder lädt
 * neu. Verpasst wird im schlimmsten Fall nur die Vorgabe der Klasse - bis zum
 * nächsten Öffnen, nichts geht verloren.
 */
export const KLASSE_FRIST_MS = 3000;

interface TypingAuthState {
  account: TypingAccount | null;
  /**
   * ★★★★★ 23.09.2026: Die Anmeldung ist abgelaufen und wurde darum beendet -
   * mit der ROLLE, die sie hatte (Kind und Lehrkraft lesen einen anderen
   * Satz). `null`: nichts zu melden. Eine neue Anmeldung setzt es zurück.
   */
  abgelaufen: TypingAccount["role"] | null;
  /** Nach erfolgreicher Anmeldung/Registrierung (Sitzung hat das Backend schon gesetzt). */
  login: (a: TypingAccount) => void;
  /** Aktualisiert das im Store gehaltene Konto (z. B. nach Stufen-Wechsel). */
  update: (a: TypingAccount) => void;
  logout: () => void;
}

/** Wie oft nachgesehen wird, ob die Anmeldung bald endet (siehe unten). */
export const SITZUNG_PRUEFEN_MS = 30_000;
/** So lange vor dem Ende wird die Anmeldung von selbst verlängert. */
export const SITZUNG_VERLAENGERN_VOR_MS = 60 * 60_000;

export const useTypingAuth = create<TypingAuthState>((set, get) => {
  /**
   * Das Konto ablegen - mit den Werten der Klasse, sobald sie da sind.
   *
   * Erst wird gesetzt, was vorliegt (die Oberfläche wartet nie auf das Netz),
   * dann die Klasse geholt und das Konto NACHGEZOGEN. Ist die Klasse schon
   * bekannt, geschieht beides in einem Zug.
   */
  const setzeKonto = (a: TypingAccount | null) => {
    const code = braucht(a);
    if (!code) {
      set({ account: a });
      return;
    }
    if (geladeneKlasse?.code === code) {
      set({ account: mitKlassenVorrang(a!, geladeneKlasse.cls) });
      return;
    }
    set({ account: a });
    void typingBackend()
      .getClass(code)
      .then((cls) => {
        /*
          ⚠️ NUR EINEN TREFFER MERKEN (Prüfer 11.09.2026). `getClass` fängt
          jeden Fehler ab und gibt `null` zurück - kein Netz sieht hier also
          genauso aus wie „Klasse gelöscht". Wer dieses `null` in den Merker
          schreibt, hat es für die ganze Sitzung: Das Gerät eines Kindes, das
          beim Start kurz offline war, käme bis zum nächsten Neuladen nicht
          mehr an die Sprache und die Textstufe seiner Klasse, auch wenn das
          Netz eine Sekunde später wieder da ist. Ohne den Merker wird beim
          nächsten `update()` (Wochenziel, Startpunkt, Passwort) neu gefragt -
          eine Anfrage, die im Normalfall ohnehin nie fällig wird.
        */
        if (cls) geladeneKlasse = { code, cls };
        const jetzt = get().account;
        // Zwischenzeitlich abgemeldet oder Konto gewechselt? Dann nichts tun.
        if (!jetzt || jetzt.id !== a!.id) return;
        set({ account: mitKlassenVorrang(jetzt, cls) });
      })
      .catch(() => {
        // Ein Ladefehler nimmt nie etwas weg - das Konto bleibt, wie es kam.
      });
  };

  const anfang = typingBackend().currentAccount();
  // ⚠️ Der Anfangswert steht SYNCHRON bereit (davon hängt die Lehrkraft-
  // Umleitung in `TippenTrainerPage` ab). Die Klasse kommt einen Wimpernschlag
  // später nach - bis dahin gelten die Werte des Kontos.
  if (braucht(anfang)) queueMicrotask(() => setzeKonto(anfang));

  /*
   * ★ L2 (19.09.2026): das Konto FRISCH vom Server nachziehen - beim Start und
   * wenn das Fenster wieder nach vorn kommt (höchstens einmal je Minute).
   * `anfang` ist der Stand der ANMELDUNG: Was die Lehrkraft seither am Kind
   * eingestellt hat (Johannes: Zeichenabstand bei Jano, „auch nach dem
   * Aktualisieren nicht"), kam bis dahin erst nach einer neuen Anmeldung an.
   * Die Oberfläche wartet nicht darauf - erst der gemerkte Stand, dann der
   * frische, wie bei der Klasse oben. Ein Ladefehler nimmt nie etwas weg.
   */
  let zuletztAufgefrischt = 0;
  const auffrischen = () => {
    const backend = typingBackend();
    if (!backend.kontoAuffrischen || !get().account) return;
    if (Date.now() - zuletztAufgefrischt < 60_000) return;
    zuletztAufgefrischt = Date.now();
    const gefragtFuer = get().account?.id;
    void backend
      .kontoAuffrischen()
      .then((frisch) => {
        if (!frisch) return;
        const jetzt = get().account;
        // Zwischenzeitlich abgemeldet oder Konto gewechselt? Dann nichts tun.
        if (!jetzt || jetzt.id !== frisch.id) return;
        setzeKonto(frisch);
      })
      .catch((e) => {
        // ★★★★★ 23.09.2026: Der Server kennt die Anmeldung nicht mehr - das
        // ist kein Ladefehler, ab hier geht nichts mehr durch. Nur beenden,
        // wenn es noch DIESELBE Anmeldung ist (dazwischen neu angemeldet?).
        if (istSitzungAbgelaufen(e) && get().account?.id === gefragtFuer)
          sitzungAbgelaufen();
      });
  };
  if (anfang) queueMicrotask(auffrischen);

  /*
   * ★★★★★ DIE ANMELDUNG LÄUFT AB, WÄHREND DIE SEITE OFFEN IST (23.09.2026).
   *
   * Eine Anmeldung gilt sieben Tage. Eine Klasse, die einmal die Woche zur
   * selben Stunde übt, erreicht das Ende darum genau in der nächsten Stunde -
   * gemessen an einer Schülerin der 3. Klasse HAS: angemeldet am 16.09. um
   * 08:2x Uhr, am 23.09. um 08:21 Uhr lehnte der Server ab. Die App machte
   * weiter, als wäre nichts; jeder Schreibversuch wurde abgewiesen, und kurz
   * darauf stürzte die Seite ab.
   *
   * Zwei Netze:
   *  · Endet die Anmeldung in weniger als einer Stunde, wird sie VERLÄNGERT
   *    (`auffrischen` - dieselbe Anfrage wie beim Laden). Eine Stunde, nicht
   *    eine Minute: Die Uhr eines Schul-Notebooks liegt gern daneben
   *    (`serverUhr.ts`), und eine Verlängerung geht nur, solange der SERVER
   *    die Anmeldung noch annimmt.
   *  · Ist sie trotzdem abgelaufen (Gerät war zu, Netz weg), wird sie beendet -
   *    mit einem Satz, der sagt, was los ist, statt still nichts zu speichern.
   */
  const sitzungAbgelaufen = () => {
    const a = get().account;
    if (!a) return;
    beobachteKonto(null);
    typingBackend().logout();
    geladeneKlasse = null;
    set({ account: null, abgelaufen: a.role });
  };
  const pruefeSitzung = () => {
    if (!get().account) return;
    const ende = typingBackend().sitzungEndetMs?.() ?? 0;
    if (!ende) return;
    const rest = ende - Date.now();
    if (rest <= 0) sitzungAbgelaufen();
    else if (rest < SITZUNG_VERLAENGERN_VOR_MS) auffrischen();
  };
  if (typeof window !== "undefined") window.setInterval(pruefeSitzung, SITZUNG_PRUEFEN_MS);

  /*
   * ★ L2b (19.09.2026): Änderungen am eigenen Konto SOFORT übernehmen
   * (Realtime) - die Lehrkraft stellt den Zeichenabstand um, und das Gerät des
   * Kindes zeigt ihn in etwa einer Sekunde, ohne Neuladen. Genau EIN Abo, an
   * das angemeldete Konto gebunden: Konto gewechselt ⇒ umgemeldet, abgemeldet
   * ⇒ beendet (`beobachteKonto` läuft bei jedem Setzen des Kontos mit).
   */
  let abo: { id: string; beenden: () => void } | null = null;
  const beobachteKonto = (a: TypingAccount | null) => {
    if (abo && (!a || abo.id !== a.id)) {
      abo.beenden();
      abo = null;
    }
    if (!a || abo) return;
    const backend = typingBackend();
    if (!backend.kontoBeobachten) return;
    const id = a.id;
    abo = {
      id,
      beenden: backend.kontoBeobachten(id, (frisch) => {
        const jetzt = get().account;
        if (!jetzt || jetzt.id !== frisch.id) return;
        setzeKonto(frisch);
      }),
    };
  };
  if (anfang) queueMicrotask(() => beobachteKonto(get().account));
  if (typeof document !== "undefined") {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState !== "visible") return;
      // Zuerst: ist sie inzwischen abgelaufen (Deckel war zu)? Dann gibt es
      // nichts mehr aufzufrischen.
      pruefeSitzung();
      auffrischen();
    });
  }

  return {
    account: anfang,
    abgelaufen: null,
    login: (a) => {
      if (a.role === "schueler" && a.classCode) rememberClassCode(a.classCode);
      set({ abgelaufen: null });
      setzeKonto(a);
      beobachteKonto(a);
    },
    update: (a) => setzeKonto(a),
    logout: () => {
      beobachteKonto(null);
      typingBackend().logout();
      geladeneKlasse = null;
      set({ account: null, abgelaufen: null });
    },
  };
});
