/**
 * WÄCHTER über den Kasten „Eigene Übung" in „Meine Klassen" (Lehrkraft,
 * 17.09.2026).
 *
 * Geprüft wird die BEDIENUNG: Datei hochladen → Vorschau (Glätten, Zeichen-
 * Bericht) → „Eigene Übung starten" (E6, 19.09.2026 umbenannt aus „Übung
 * starten") schreibt genau die erwarteten zwei Aufrufe (Text ablegen, dann
 * an die Reihe der Klasse hängen, Z1) → „Beenden" je Übung nimmt sie nach
 * einer Rückfrage aus der Reihe. Was
 * mit dem Text selbst passiert, prüft schon `typing-eigener-text.test.ts`
 * (reine Funktionen) - hier geht es nur um die Verkabelung dieses einen
 * Bauteils.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { TypingClass } from "@/lib/typing/account";
import { EigeneUebungKasten } from "@/components/lernwerkstatt/klasse/EigeneUebungKasten";

const rufe: {
  speichern: unknown[];
  starten: unknown[];
  beenden: unknown[];
  poolSpeichern: unknown[];
  poolLoeschen: unknown[];
} = { speichern: [], starten: [], beenden: [], poolSpeichern: [], poolLoeschen: [] };

/** Der Pool „Meine Texte", wie ihn `listeMeineTexte`/`leseMeinenText` liefern. */
let pool: { id: string; dateiname: string; erstelltMs: number; ersteWorte: string; zeilen: string[] }[] =
  [];

vi.mock("@/lib/typing/backend", () => ({
  typingBackend: () => ({
    speichereEigenenText: async (
      classCode: string,
      teacherId: string,
      dateiname: string,
      zeilen: string[],
    ) => {
      rufe.speichern.push({ classCode, teacherId, dateiname, zeilen });
      return "text-1";
    },
    // Z1 (19.09.2026): die Reihe statt des einen Zeigers.
    starteEigeneUebung: async (
      code: string,
      teacherId: string,
      eintrag: { textId: string; dateiname: string },
      vonAllenFertig: readonly string[] = [],
    ) => {
      rufe.starten.push({ code, teacherId, eintrag, vonAllenFertig });
      return {
        code,
        name: "4a",
        teacherId,
        createdAt: 0,
        eigeneUebungen: [{ ...eintrag, gestartetAm: 1, von: teacherId }],
      } as TypingClass;
    },
    beendeEigeneUebung: async (code: string, teacherId: string, textId: string) => {
      rufe.beenden.push({ code, teacherId, textId });
      return { code, name: "4a", teacherId, createdAt: 0, eigeneUebungen: [] } as TypingClass;
    },
    // ── Meine Texte (E8, 19.09.2026) ────────────────────────────────────────
    listeMeineTexte: async (_teacherId: string) =>
      pool.map(({ id, dateiname, erstelltMs, ersteWorte }) => ({
        id,
        dateiname,
        erstelltMs,
        ersteWorte,
      })),
    speichereMeinenText: async (teacherId: string, dateiname: string, zeilen: string[]) => {
      rufe.poolSpeichern.push({ teacherId, dateiname, zeilen });
      const id = `pool-${pool.length + 1}`;
      pool = [...pool, { id, dateiname, erstelltMs: Date.now(), ersteWorte: zeilen.join(" "), zeilen }];
      return id;
    },
    leseMeinenText: async (id: string) => {
      const eintrag = pool.find((p) => p.id === id);
      return eintrag ? { dateiname: eintrag.dateiname, zeilen: eintrag.zeilen } : null;
    },
    loescheMeinenText: async (id: string, teacherId: string) => {
      rufe.poolLoeschen.push({ id, teacherId });
      pool = pool.filter((p) => p.id !== id);
      return true;
    },
  }),
}));

function klasse(settings?: unknown): TypingClass {
  return { code: "4a", name: "4a", teacherId: "t1", createdAt: 0, settings } as TypingClass;
}

function txtDatei(name: string, inhalt: string): File {
  return new File([inhalt], name, { type: "text/plain" });
}

beforeEach(() => {
  rufe.speichern = [];
  rufe.starten = [];
  rufe.beenden = [];
  rufe.poolSpeichern = [];
  rufe.poolLoeschen = [];
  pool = [];
});

describe("EigeneUebungKasten", () => {
  it("zeigt ohne Zuweisung 'nicht zugewiesen'", () => {
    render(<EigeneUebungKasten cls={klasse()} onClassChange={vi.fn()} />);
    expect(screen.getByText(/nicht zugewiesen/)).toBeInTheDocument();
  });

  it("★ Z1: zugeklappt nennt der Kasten den Stand - auch für den alten Zeiger", () => {
    render(
      <EigeneUebungKasten
        cls={klasse({ eigeneUebung: { textId: "alt", dateiname: "alt.txt", angelegtMs: 1 } })}
        onClassChange={vi.fn()}
      />,
    );
    expect(screen.getByText(/zugewiesen: alt\.txt/)).toBeInTheDocument();
  });

  it("★★★★★ Z1: zwei laufende Übungen stehen der Reihe nach da, mit „n von m Kindern fertig“", () => {
    const cls = {
      ...klasse(),
      eigeneUebungen: [
        { textId: "a", dateiname: "herbst.txt", gestartetAm: 1_758_000_000_000, von: "t1" },
        { textId: "b", dateiname: "winter.txt", gestartetAm: 1_758_100_000_000, von: "t1" },
      ],
    } as TypingClass;
    render(
      <EigeneUebungKasten
        cls={cls}
        onClassChange={vi.fn()}
        eingebettet
        kinderFortschritt={[
          { customTextProgress: { a: { zeile: 3, fertig: true } } },
          { customTextProgress: { a: { zeile: 1 } } },
          {},
        ]}
      />,
    );
    expect(screen.getByRole("heading", { name: "Laufende Übungen, der Reihe nach" })).toBeInTheDocument();
    const eintraege = screen.getAllByRole("listitem");
    expect(eintraege).toHaveLength(2);
    expect(eintraege[0]).toHaveTextContent("„herbst.txt\"");
    expect(eintraege[0]).toHaveTextContent("1 von 3 Kindern fertig");
    expect(eintraege[1]).toHaveTextContent("„winter.txt\"");
    expect(eintraege[1]).toHaveTextContent("0 von 3 Kindern fertig");
    expect(screen.getByRole("button", { name: "Beenden „herbst.txt\"" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Beenden „winter.txt\"" })).toBeInTheDocument();
  });

  it("★★★ Z1: ohne hereingereichte Fortschritte steht keine Zahl da (keine eigene Abfrage je Kind)", () => {
    const cls = {
      ...klasse(),
      eigeneUebungen: [{ textId: "a", dateiname: "herbst.txt", gestartetAm: 1, von: "t1" }],
    } as TypingClass;
    render(<EigeneUebungKasten cls={cls} onClassChange={vi.fn()} eingebettet />);
    expect(screen.getByRole("listitem")).not.toHaveTextContent(/Kindern? fertig/);
  });

  it("★★★ Z1: läuft schon eine, hängt der Start an - und sagt es", async () => {
    const user = userEvent.setup();
    const cls = {
      ...klasse(),
      eigeneUebungen: [{ textId: "a", dateiname: "herbst.txt", gestartetAm: 1, von: "t1" }],
    } as TypingClass;
    render(
      <EigeneUebungKasten
        cls={cls}
        onClassChange={vi.fn()}
        eingebettet
        kinderFortschritt={[{ customTextProgress: { a: { zeile: 1, fertig: true } } }]}
      />,
    );
    const input = screen.getByLabelText(/Eigene Datei hochladen/) as HTMLInputElement;
    await user.upload(input, txtDatei("winter.txt", "Schnee"));
    await waitFor(() => expect(screen.getByText("Eigene Übung starten")).toBeInTheDocument());
    await user.click(screen.getByText("Eigene Übung starten"));
    await waitFor(() =>
      expect(
        screen.getByText(
          "Gestartet - die Kinder bekommen sie nach den laufenden Übungen, mit einem Fenster.",
        ),
      ).toBeInTheDocument(),
    );
    // „herbst.txt" haben alle Kinder fertig - fällt zuerst, wenn die Reihe voll ist.
    expect(rufe.starten).toEqual([
      {
        code: "4a",
        teacherId: "t1",
        eintrag: { textId: "text-1", dateiname: "winter.txt" },
        vonAllenFertig: ["a"],
      },
    ]);
  });

  it("★★★ Datei hochladen, Vorschau, 'Eigene Übung starten' - genau die zwei Aufrufe in der richtigen Reihenfolge", async () => {
    const user = userEvent.setup();
    const onClassChange = vi.fn();
    render(<EigeneUebungKasten cls={klasse()} onClassChange={onClassChange} />);

    const input = screen.getByLabelText(/Eigene Datei hochladen/) as HTMLInputElement;
    await user.upload(input, txtDatei("gedicht.txt", "Erste Zeile\nZweite Zeile"));

    await waitFor(() => expect(screen.getByText("Eigene Übung starten")).toBeInTheDocument());
    // Zwei Zeilen, kein Glätten und keine unbekannten Zeichen nötig.
    expect(screen.getByText(/2 Zeilen/)).toBeInTheDocument();
    expect(screen.queryByText(/Automatisch angepasst/)).not.toBeInTheDocument();
    expect(screen.queryByText(/liegen auf keiner Taste/)).not.toBeInTheDocument();

    await user.click(screen.getByText("Eigene Übung starten"));

    await waitFor(() => expect(onClassChange).toHaveBeenCalled());
    // E6 (19.09.2026): der Status sagt jetzt, dass die Kinder ein Fenster
    // bekommen - nicht mehr nur den Dateinamen.
    expect(screen.getByText("Gestartet - die Kinder bekommen jetzt ein Fenster.")).toBeInTheDocument();
    expect(rufe.speichern).toEqual([
      { classCode: "4a", teacherId: "t1", dateiname: "gedicht.txt", zeilen: ["Erste Zeile", "Zweite Zeile"] },
    ]);
    expect(rufe.starten).toEqual([
      {
        code: "4a",
        teacherId: "t1",
        eintrag: { textId: "text-1", dateiname: "gedicht.txt" },
        vonAllenFertig: [],
      },
    ]);
    // E8 (19.09.2026): „In Meine Texte speichern" steht auf AN - der Upload
    // landet nebenbei auch in der eigenen Ablage.
    expect(rufe.poolSpeichern).toEqual([
      { teacherId: "t1", dateiname: "gedicht.txt", zeilen: ["Erste Zeile", "Zweite Zeile"] },
    ]);
  });

  it("★★★★★ 23.09.: eine .txt vom Windows-Editor (ANSI) kommt MIT Umlauten an", async () => {
    // Ein Byte je Zeichen, wie Windows-1252 es speichert (ü = 0xFC) - bis
    // heute wurde daraus „berlegen Sie grundstzlich" (3. Klasse HAS).
    const ansi = Uint8Array.from([..."Überlegen Sie grundsätzlich\r\nNützen Sie es"].map((z) => z.charCodeAt(0)));
    const user = userEvent.setup();
    render(<EigeneUebungKasten cls={klasse()} onClassChange={vi.fn()} />);
    const input = screen.getByLabelText(/Eigene Datei hochladen/) as HTMLInputElement;
    await user.upload(input, new File([ansi], "Konzentration.txt", { type: "text/plain" }));

    await waitFor(() => expect(screen.getByText("Eigene Übung starten")).toBeInTheDocument());
    expect(screen.queryByText(/liegen auf keiner Taste/)).not.toBeInTheDocument();
    await user.click(screen.getByText("Eigene Übung starten"));
    await waitFor(() => expect(rufe.speichern).toHaveLength(1));
    expect((rufe.speichern[0] as { zeilen: string[] }).zeilen).toEqual([
      "Überlegen Sie grundsätzlich",
      "Nützen Sie es",
    ]);
  });

  it("★★★ E8: Häkchen 'In Meine Texte speichern' abwählen - kein Pool-Aufruf", async () => {
    const user = userEvent.setup();
    render(<EigeneUebungKasten cls={klasse()} onClassChange={vi.fn()} />);
    const input = screen.getByLabelText(/Eigene Datei hochladen/) as HTMLInputElement;
    await user.upload(input, txtDatei("gedicht.txt", "Erste Zeile\nZweite Zeile"));
    await waitFor(() => expect(screen.getByText("Eigene Übung starten")).toBeInTheDocument());

    await user.click(screen.getByLabelText("In Meine Texte speichern"));
    await user.click(screen.getByText("Eigene Übung starten"));

    await waitFor(() => expect(rufe.speichern).toHaveLength(1));
    expect(rufe.poolSpeichern).toEqual([]);
  });

  it("★★★★★ E8: ein Text aus 'Meine Texte' auswählen und starten legt eine KLASSEN-Kopie an", async () => {
    const user = userEvent.setup();
    const onClassChange = vi.fn();
    pool = [
      {
        id: "pool-1",
        dateiname: "altes-gedicht.txt",
        erstelltMs: 1,
        ersteWorte: "Schon vorher gespeichert",
        zeilen: ["Schon vorher gespeichert"],
      },
    ];
    render(<EigeneUebungKasten cls={klasse()} onClassChange={onClassChange} />);

    await user.click(screen.getByRole("button", { name: "Meine Texte" }));
    await user.click(await screen.findByText("altes-gedicht.txt"));

    await waitFor(() => expect(screen.getByText("Eigene Übung starten")).toBeInTheDocument());
    await user.click(screen.getByText("Eigene Übung starten"));

    await waitFor(() => expect(onClassChange).toHaveBeenCalled());
    // Die Klassen-Kopie entsteht wie beim Upload (`tt_eigene_texte`) - der
    // Pool-Eintrag selbst bleibt unberührt (kein zweiter `poolSpeichern`-Ruf).
    expect(rufe.speichern).toEqual([
      {
        classCode: "4a",
        teacherId: "t1",
        dateiname: "altes-gedicht.txt",
        zeilen: ["Schon vorher gespeichert"],
      },
    ]);
    expect(rufe.poolSpeichern).toEqual([]);
  });

  it("★★★ E12: 'Meine Texte' - Löschen fragt über ein Modal nach und ruft loescheMeinenText erst nach Bestätigung", async () => {
    const user = userEvent.setup();
    pool = [
      { id: "pool-1", dateiname: "weg-damit.txt", erstelltMs: 1, ersteWorte: "x", zeilen: ["x"] },
    ];
    render(<EigeneUebungKasten cls={klasse()} onClassChange={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Meine Texte" }));
    await screen.findByText("weg-damit.txt");
    await user.click(screen.getByRole("button", { name: "Löschen" }));

    // ★ E12 (19.09.2026): die Rückfrage ist seither ein `Modal`, kein
    // `window.confirm` mehr - erst der zweite Klick löscht wirklich.
    const dialog = await screen.findByRole("dialog", { name: "Eigenen Text löschen" });
    expect(rufe.poolLoeschen).toEqual([]);
    await user.click(within(dialog).getByRole("button", { name: "Löschen" }));

    await waitFor(() => expect(rufe.poolLoeschen).toEqual([{ id: "pool-1", teacherId: "t1" }]));
    await waitFor(() => expect(screen.queryByText("weg-damit.txt")).not.toBeInTheDocument());
  });

  it("★★★ E12: 'Meine Texte' - 'Abbrechen' im Löschen-Modal ändert nichts", async () => {
    const user = userEvent.setup();
    pool = [
      { id: "pool-1", dateiname: "bleibt.txt", erstelltMs: 1, ersteWorte: "x", zeilen: ["x"] },
    ];
    render(<EigeneUebungKasten cls={klasse()} onClassChange={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Meine Texte" }));
    await screen.findByText("bleibt.txt");
    await user.click(screen.getByRole("button", { name: "Löschen" }));

    const dialog = await screen.findByRole("dialog", { name: "Eigenen Text löschen" });
    await user.click(within(dialog).getByRole("button", { name: "Abbrechen" }));

    expect(rufe.poolLoeschen).toEqual([]);
    expect(screen.getByText("bleibt.txt")).toBeInTheDocument();
  });

  it("★★★★★ E7: eine Vorlage auswählen zeigt eine Vorschau und startet als Klassen-Kopie", async () => {
    const user = userEvent.setup();
    const onClassChange = vi.fn();
    render(<EigeneUebungKasten cls={klasse()} onClassChange={onClassChange} />);

    await user.click(screen.getByRole("button", { name: "Vorlagen" }));
    // Die sechs Text-Lektionen des Lehrgangs, siehe `vorlagen.ts`.
    await user.click(await screen.findByText("Texte: Witze zum Mitschreiben"));

    await waitFor(() => expect(screen.getByText("Eigene Übung starten")).toBeInTheDocument());
    await user.click(screen.getByText("Eigene Übung starten"));

    await waitFor(() => expect(onClassChange).toHaveBeenCalled());
    expect(rufe.speichern).toHaveLength(1);
    const gespeichert = rufe.speichern[0] as { dateiname: string; zeilen: string[] };
    expect(gespeichert.dateiname).toBe("Texte: Witze zum Mitschreiben");
    expect(gespeichert.zeilen.length).toBeGreaterThan(0);
    // Eine Vorlage landet NIE automatisch in „Meine Texte" - das Häkchen
    // gehört nur zum Hochladen.
    expect(rufe.poolSpeichern).toEqual([]);
  });

  it("meldet typografische Ersetzungen UND übrige untippbare Zeichen in der Vorschau", async () => {
    const user = userEvent.setup();
    render(<EigeneUebungKasten cls={klasse()} onClassChange={vi.fn()} />);
    const input = screen.getByLabelText(/Eigene Datei hochladen/) as HTMLInputElement;
    // „–" wird geglättet, „🙂" bleibt untippbar.
    await user.upload(input, txtDatei("mix.txt", "Ein Satz – mit Emoji 🙂"));

    await waitFor(() => expect(screen.getByText(/Automatisch angepasst/)).toBeInTheDocument());
    expect(screen.getByText(/liegen auf keiner Taste/)).toBeInTheDocument();
  });

  it("lehnt eine .pdf-Datei ab", async () => {
    render(<EigeneUebungKasten cls={klasse()} onClassChange={vi.fn()} />);
    const input = screen.getByLabelText(/Eigene Datei hochladen/) as HTMLInputElement;
    // ⚠️ NICHT `userEvent.upload` - das respektiert das `accept`-Attribut des
    // Feldes und liefert eine nicht passende Datei gar nicht erst aus (kein
    // `onChange`). Genau DIESEN Fall - eine Datei, die trotzdem ankommt, weil
    // `accept` in echten Browsern nur ein Vorschlag ist - prüft dieser Test.
    fireEvent.change(input, {
      target: { files: [new File(["%PDF-1.4"], "text.pdf", { type: "application/pdf" })] },
    });
    await waitFor(() =>
      expect(screen.getByText(/Nur \.txt- und \.docx-Dateien/)).toBeInTheDocument(),
    );
    expect(screen.queryByText(/Übung starten/)).not.toBeInTheDocument();
  });

  it("★★★ Z1: der alte Zeiger (vor dem Umbau gestartet) steht als laufende Übung da und lässt sich beenden - mit Rückfrage", async () => {
    const user = userEvent.setup();
    const onClassChange = vi.fn();
    render(
      <EigeneUebungKasten
        cls={klasse({ eigeneUebung: { textId: "alt", dateiname: "alt.txt", angelegtMs: 1 } })}
        onClassChange={onClassChange}
        eingebettet
      />,
    );
    expect(screen.getByRole("heading", { name: "Laufende Übung" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Beenden „alt.txt\"" }));

    const dialog = await screen.findByRole("dialog", { name: "Übung beenden" });
    expect(rufe.beenden).toEqual([]);
    await user.click(within(dialog).getByRole("button", { name: "Beenden" }));

    await waitFor(() => expect(onClassChange).toHaveBeenCalled());
    expect(rufe.beenden).toEqual([{ code: "4a", teacherId: "t1", textId: "alt" }]);
    expect(screen.getByText("Beendet - die Klasse übt wieder normal.")).toBeInTheDocument();
  });

  it("★★★ Z1: 'Abbrechen' in der Rückfrage beendet nichts", async () => {
    const user = userEvent.setup();
    render(
      <EigeneUebungKasten
        cls={klasse({ eigeneUebung: { textId: "alt", dateiname: "alt.txt", angelegtMs: 1 } })}
        onClassChange={vi.fn()}
        eingebettet
      />,
    );
    await user.click(screen.getByRole("button", { name: "Beenden „alt.txt\"" }));
    const dialog = await screen.findByRole("dialog", { name: "Übung beenden" });
    await user.click(within(dialog).getByRole("button", { name: "Abbrechen" }));
    expect(rufe.beenden).toEqual([]);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
