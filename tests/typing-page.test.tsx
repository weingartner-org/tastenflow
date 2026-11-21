import { describe, it, expect, beforeEach } from "vitest";
import { einrichtungFertigMerken } from "../src/lib/typing/einrichtung";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TippenTrainerPage } from "../src/features/public/TippenTrainerPage";
import { ansagenMitschreiben, ohneBildschirmTastatur } from "./_typing-probelauf";
import { useTypingA11y } from "../src/lib/typing/a11y";

beforeEach(() => {
  localStorage.clear();
  // Seit 08.08.2026 steht beim ALLERERSTEN Start die Einrichtung an Stelle des
  // Trainers (Alter · Sprache · Tastatur · Ton · Podcast). Diese Tests prüfen
  // den Trainer, nicht den ersten Start — darum gilt sie hier als erledigt.
  // Der eigene Wächter dafür ist tests/typing-einrichtung.test.tsx.
  einrichtungFertigMerken();
  // ★★★ 08.09.2026 - die Bildschirm-Tastatur bleibt in dieser Datei AUS.
  //
  // Sie ist `aria-hidden`, also eine rein optische Hilfe, kostete in jsdom aber
  // den Löwenanteil der Laufzeit: Bei JEDEM Anschlag zeichnet sie rund fünfzig
  // eingefärbte Tasten neu (die nächste Taste wechselt ja), und zwar DOPPELT -
  // unsichtbare Messvorlage plus sichtbare Tastatur -, jede Taste mit einem
  // `style={{ borderColor, background }}`. jsdom schickt jede dieser Farben
  // durch seinen CSS-Parser. Im Browser ist das billig, in jsdom teuer.
  //
  // IN DIESEM ORDNER GEMESSEN (A/B im selben Prozess, Last 175):
  //     Tastatur AN : 148,5 / 56,3 ms je Anschlag
  //     Tastatur AUS: 5,3 ms je Anschlag        → 19-fach
  // CPU-Profil der reinen Tipp-Schleife mit Tastatur: 27,7 % für das Parsen von
  // CSS-Farben (`cssstyle` + `@asamuzakjp/css-color`), aber nur 2,9 % für den
  // Code, den dieser Test prüft. Ohne Tastatur fällt `cssstyle` auf 0,9 %.
  //
  // Abgeschaltet wird über denselben Schalter, den ein Kind in den
  // Einstellungen hat. Kein Test in dieser Datei fasst die Tastatur an.
  //
  // ⚠️ Nebenwirkung mit Ansage: Eine fehlerfreie Runde OHNE Tastatur verdient
  // das Abzeichen „Blindflug" (`badges.ts`). Keine Zusicherung hier baut auf
  // der Liste der verdienten Abzeichen auf.
  //
  // Volle Begründung samt Messwerten - auch, warum gefälschte Zeitgeber KEIN
  // Ausweg sind: `tests/_typing-probelauf.ts`.
  ohneBildschirmTastatur();
});

function renderPage() {
  render(
    <MemoryRouter>
      <TippenTrainerPage />
    </MemoryRouter>,
  );
}

describe("Tipptrainer-Seite", () => {
  it("zeigt Titel und startet im adaptiven Training (Mein Training)", async () => {
    renderPage();
    // `level: 1` ist seit 08.08.2026 nötig: Beim ersten Start steht zusätzlich
    // die Willkommens-Karte mit dem Einführungs-Podcast auf der Seite, deren
    // Überschrift („Willkommen bei Tastenflow", h2) sonst mit dem Seitentitel
    // um denselben Namen streitet.
    expect(
      screen.getByRole("heading", { level: 1, name: /Tastenflow/i }),
    ).toBeInTheDocument();
    // Spielstand wird asynchron geladen → auf die Überschrift warten.
    expect(
      await screen.findByRole("heading", { name: /Mein Training/i }),
    ).toBeInTheDocument();
  });

  it("wechselt auf Wortspiele", async () => {
    // ★ E7 (19.09.2026): Bis dahin prüfte dieser Test den Wechsel auf die
    // Übungsart „Lektionen" („Grundstellung: F und J") - sie ist entfallen
    // (siehe `trainerMode.ts`). Die eigentliche Zusicherung dieses Tests, der
    // Umschalt-Weg über das Zahnrad, gilt unverändert für jede verbliebene
    // Übungsart.
    renderPage();
    // Seit 22.08.2026 (Charge „SCHLANK") steht die Übungsart nicht mehr in
    // einer eigenen Leiste über der Karte, sondern als erste Gruppe im
    // Einstellungs-Bereich hinter dem Zahnrad (Alt + O). Der Umschalter selbst
    // ist unverändert ein echter Umschalt-Knopf (aria-pressed).
    fireEvent.keyDown(document, { code: "KeyO", altKey: true });
    fireEvent.click(await screen.findByRole("button", { name: /^Wortspiele$/i }));
    expect(await screen.findByRole("heading", { name: "Wortspiele" })).toBeInTheDocument();
  });

  it("tippt eine Zeile fehlerfrei durch → meldet „Geschafft.“", async () => {
    // ★ Seit 09.09.2026 geht WÄHREND DES TIPPENS nur dann etwas in den
    //   Live-Bereich, wenn „Buchstabieren" an ist - bei „aus" (Vorgabe unter
    //   Windows und in jsdom) bleibt die Braillezeile ruhig, auch am
    //   Zeilenende. Dieser Test prüft den Weg der Meldung, also schaltet er an.
    useTypingA11y.getState().setTastenAnsage("naechste");
    renderPage();
    // Das Tippfeld ist ein echtes (nur-lese) Textfeld: die ganze Zeile steht im
    // Wert, damit Braillezeilen sie samt Cursor (Punkt 7/8) anzeigen.
    const field = (await screen.findByRole("textbox")) as HTMLInputElement;
    const expected = field.value;
    expect(expected.length).toBeGreaterThan(0);
    // Die Live-Region wird bewusst „erst leeren, dann (50 ms) füllen" bespielt,
    // damit NVDA gleiche Folgemeldungen erneut vorliest → kurz warten.
    //
    // ★★★ 08.09.2026 - dieser Test war KAPUTT, nicht bloss langsam.
    //
    // GEMESSEN in diesem Ordner, am unveränderten Stand aus `git`:
    // in vier Läufen des unveränderten Standes zweimal rot (Last 3,6; die Läufe dauerten 36 s bis 103 s).
    // Die Meldung lautete `expected 'j' to contain 'Geschafft'` - im
    // Live-Bereich stand die Ansage der nächsten Taste. Zwei Gründe, beide in
    // `pushLive`:
    //
    // 1. DER ENTPRELLER SCHLUCKT DIE MELDUNG. Jede neue Ansage löscht den
    //    Zeitgeber der vorigen. Eine Übungszeile aus lauter f und j lässt den
    //    Trainer jeden nächsten Buchstaben einzeln ansagen; wer die Zeile in
    //    einer synchronen Schleife durchtippt, stapelt sie alle in EIN
    //    50-ms-Fenster - übrig bleibt nicht „Geschafft.", sondern eine andere.
    //    Kein Kind tippt so; der Entpreller ist richtig, die Schleife war es
    //    nicht. Darum bekommt der LETZTE Anschlag hier Luft.
    //
    // 2. DAS FENSTER IST WINZIG. „Geschafft." steht nur, bis der Trainer 550 ms
    //    später weiterschaltet und das erste Zeichen der nächsten Zeile ansagt.
    //    Wer den Bereich ABLIEST, muss dieses Fenster treffen. Darum wird
    //    MITGESCHRIEBEN (`MutationObserver`): Was einmal angesagt wurde, kann
    //    `waitFor` nicht mehr verpassen.
    //
    // Dieselbe Lösung steht in `apps/lernwerkstatt` - dort wurde sie zuerst
    // gefunden, an derselben Fehlermeldung.
    const ansagen = ansagenMitschreiben();
    for (let i = 0; i < expected.length; i++) {
      // Vor dem letzten Anschlag Luft lassen - siehe Grund 1.
      if (i === expected.length - 1) await new Promise((r) => setTimeout(r, 70));
      fireEvent.keyDown(field, { key: expected[i] });
    }
    await waitFor(() => expect(ansagen.texte.join(" · ")).toContain("Geschafft"));
    ansagen.stopp();
    // ⏱ 30 s statt der 5-Sekunden-Vorgabe: Dieser Test tippt eine ganze Zeile
    // durch die volle Seite. Unter Last überschreitet das die Vorgabe - und ein
    // Wächter, der von der Maschinenlast abhängt, sagt nichts über den Code aus.
  }, 30000);

  it("meldet bei falschem Anschlag „Falsch“ und rückt nicht vor", async () => {
    renderPage();
    const field = (await screen.findByRole("textbox")) as HTMLInputElement;
    const expected = field.value;
    const wrong = expected[0] === "x" ? "y" : "x";
    // Mitschreiben statt ablesen - Begründung beim Test darüber.
    const ansagen = ansagenMitschreiben();
    fireEvent.keyDown(field, { key: wrong });
    await waitFor(() => expect(ansagen.texte.join(" · ")).toMatch(/Falsch/i));
    ansagen.stopp();
  });

  /*
   * ★ E7 (19.09.2026): Die Übungsart „Lektionen" ist entfallen (siehe
   * `trainerMode.ts`). Die beiden Tests hier prüften bis dahin, WO ihr
   * Übungsbildschirm beim Wiedereinstieg landete („home-dk"/„home-fj") -
   * eine Frage, die es nicht mehr gibt. An ihre Stelle tritt die Zusage aus
   * dem Auftrag: ein Altstand mit `lastPlace.mode === "lektionen"` darf
   * keinen Fehler werfen und landet im normalen, adaptiven Training.
   */
  it("Resume: ein Altstand mit lastPlace.mode „lektionen“ landet fehlerfrei in Mein Training", async () => {
    localStorage.setItem(
      "tippen-trainer:v1",
      JSON.stringify({
        xp: 0,
        lessons: { "home-fj": { completed: true, bestStars: 3, bestCpm: 120, attempts: 1 } },
        lastPlace: { mode: "lektionen", lessonId: "home-dk" },
      }),
    );
    renderPage();
    expect(await screen.findByRole("heading", { name: /Mein Training/i })).toBeInTheDocument();
    // „Was übst du?" zeigt „Mein Training" als gedrückt, nicht keinen Knopf.
    fireEvent.keyDown(document, { code: "KeyO", altKey: true });
    expect(
      await screen.findByRole("button", { name: /^Mein Training$/i }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});

describe("Einstellungen — ein eigenes Fenster (07.09.2026)", () => {
  /*
    Johannes' Auftrag im Wortlaut: *„das einstellungefenster [soll] nicht oben
    den inhalt nach unten schieben sondern ein eigenes fester öffnen das mit
    esc und mit zurück wieder zum programm wechselt, auch oben auf Tastenflow
    kann geklickt werden um es zu schließen."*

    Vier Wege hinein und hinaus - jeder bekommt hier seinen eigenen Test.
    Vorher stand hier ein Test auf `aria-expanded` und einen gemerkten
    Auf-Zustand; beides gehört zur Aufklapp-Bauart und ist mit ihr gefallen.
  */
  it("das Zahnrad kündigt ein FENSTER an, nicht einen Aufklappbereich", async () => {
    renderPage();
    await screen.findByRole("heading", { name: /Mein Training/i });
    const zahnrad = screen.getByRole("button", { name: /Einstellungen/i });
    // ⚠️ Kein `aria-expanded` mehr: Ein Dialog wird nicht auf- und zugeklappt.
    expect(zahnrad).not.toHaveAttribute("aria-expanded");
    expect(zahnrad).toHaveAttribute("aria-haspopup", "dialog");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("Alt+O öffnet das Fenster und schließt es wieder", async () => {
    renderPage();
    await screen.findByRole("heading", { name: /Mein Training/i });

    fireEvent.keyDown(document, { code: "KeyO", altKey: true });
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    const layoutFeld = await screen.findByLabelText(/Tastatur-Layout/i);

    // …und zu — auch wenn der Fokus in einem Auswahlfeld der Einstellungen
    // steht (dort greift die Formularfeld-Sperre der übrigen Kürzel bewusst
    // NICHT).
    fireEvent.keyDown(layoutFeld, { code: "KeyO", altKey: true });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("Escape schließt das Fenster", async () => {
    renderPage();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.click(screen.getByRole("button", { name: /Einstellungen/i }));
    await screen.findByRole("dialog");

    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("der Knopf „Zurück zum Üben“ schließt das Fenster", async () => {
    // Der sichtbare Weg hinaus: Escape kennt nicht jeder, und auf einem Tablet
    // ohne Tastatur gibt es sie gar nicht.
    renderPage();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.click(screen.getByRole("button", { name: /Einstellungen/i }));
    await screen.findByRole("dialog");

    fireEvent.click(screen.getByRole("button", { name: /Zurück zum Üben/i }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("der Klick auf „Tastenflow“ oben schließt das Fenster", async () => {
    renderPage();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.click(screen.getByRole("button", { name: /Einstellungen/i }));
    await screen.findByRole("dialog");

    // Die Überschrift der Kopfzeile ist selbst der Schalter („Heimweg").
    fireEvent.click(screen.getByRole("button", { name: /^Tastenflow/i }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("startet ZU - auch wenn der alte gemerkte Zustand „offen“ sagt", async () => {
    /*
      ★★★ Der Grund, warum das Merken mit der Aufklapp-Bauart gefallen ist:
      Ein Fenster beim Start hieße, dass ein Kind mit Screenreader sich bei
      JEDEM Einstieg erst aus einem Dialog herausarbeiten muss, bevor es zur
      ersten Zeile kommt. Ein Streifen unter der Kopfzeile war harmlos, ein
      modaler Dialog ist es nicht.
    */
    localStorage.setItem("tippen-settings-open", "1");
    renderPage();
    await screen.findByRole("heading", { name: /Mein Training/i });
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("Geschichten-Hauptweg", () => {
  it("kündigt nach einer Runde die nächste Geschichte an und macht sie zur Hauptwahl", async () => {
    // Lernstand mit allen Buchstaben — dann ist die Bücherei fällig.
    localStorage.setItem(
      "tippen-trainer:v1",
      JSON.stringify({
        xp: 0,
        lessons: {},
        // Alle Buchstaben — aber OHNE die Umschalt-Einheit: sonst verlangt die
        // Gegenhand-Regel echte Umschalt-Anschläge und die Zeile wird nie fertig.
        introduced: [
          "f","j","d","k","s","l","a","ö","e","n","i","r","t",
          "h","u","c","g","m","o","b","w","z","v","p","ä","ü","x","y","q","ß",
        ],
      }),
    );
    renderPage();
    await screen.findByRole("textbox");
    // Eine ganze Runde (12 Zeilen) fehlerfrei durchtippen. Zwischen den Zeilen
    // liegen 550 ms Pause (Lob + Weiterschalten) — die muss der Test abwarten.
    for (let zeile = 0; zeile < 13; zeile++) {
      const feld = screen.queryByRole("textbox") as HTMLInputElement | null;
      if (!feld?.value) break;
      for (const ch of feld.value) fireEvent.keyDown(feld, { key: ch });
      await new Promise((r) => setTimeout(r, 700));
    }
    // Die Abschluss-Karte kündigt die Geschichte an …
    // Alle vier Profile abgedeckt: 7-9 bekommt „etwas zum Staunen", 10-12 und
    // 13-15/Erwachsene die ruhigeren Fassungen. Geprueft wird, DASS angekuendigt
    // wird - nicht der Wortlaut (der gehoert in die Profil-Tests).
    const angebot = await screen.findByRole("button", {
      name: /Jetzt kommt (eine Geschichte|etwas zum Staunen|ein Wissenstext|ein Text)|Weiter (mit deiner Geschichte|in der Geschichte|im Text)/i,
    });
    // … und sie ist die Hauptwahl: der ERSTE Tabstopp der Karte, „lieber weiter
    // üben" steht daneben.
    //
    // ★ 31.08.2026 (F1): Den FOKUS bekommt seit der Fokus-Falle der Karte ihre
    // Überschrift - das Kind soll zuerst hören, was es geschafft hat, und erst
    // danach, was als Nächstes kommt (Entscheidung Johannes). „Hauptwahl"
    // heisst darum nicht mehr „hat den Fokus", sondern „ist der erste Tabstopp":
    // EIN Tab und die Eingabetaste führen in die Geschichte.
    const karte = angebot.closest(".card") as HTMLElement;
    const ersterTabstopp = karte.querySelector(
      'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])',
    );
    expect(ersterTabstopp).toBe(angebot);
    await waitFor(() =>
      expect(document.activeElement).toBe(karte.querySelector("h3")),
    );
    expect(
      screen.getByRole("button", { name: /lieber weiter üben/i }),
    ).toBeInTheDocument();
    // 13 Zeilen à 700 ms Pause — dieser Test braucht mehr als die 5-Sekunden-Vorgabe.
    // 22.08.2026 von 25 s auf 60 s: Die reine Wartezeit ist mit gut 9 s
    // unverändert; im vollen Lauf (381 Dateien parallel) reichten 25 s aber
    // nicht mehr verlässlich, und ein Wächter, der von der Maschinenlast
    // abhängt, sagt nichts mehr aus.
    //
    // ⏱ 08.09.2026 von 60 s auf 120 s - NICHT weil der Test langsamer wäre
    // (mit ausgeschalteter Bildschirm-Tastatur ist er deutlich schneller),
    // sondern wegen der STREUUNG. Gemessen an diesem Rechner: derselbe Satz
    // Testdateien brauchte in vier Läufen hintereinander 36 s, 86 s, 103 s und
    // 86 s - Faktor 2,9, allein aus der Maschinenlast (hier arbeiten mehrere
    // Sitzungen in verschiedenen App-Ordnern gleichzeitig). Unter Last 177 fiel
    // genau dieser Test nach 61,9 s in den Zeitablauf. Bei 60 s bleibt er eine
    // tickende Bombe: Er wird rot, ohne dass jemand etwas falsch gemacht hat.
    //
    // ⚠️ Die Zahl steht bei DIESEM Test, nicht als `testTimeout` in
    // `vite.config.ts` - sonst erbte jeder der über 380 schnellen Tests
    // dieselbe Nachsicht, und ein wirklich hängender Test bliebe zwei Minuten
    // unentdeckt.
  }, 120000);
});
