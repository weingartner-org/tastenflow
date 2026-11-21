/**
 * WÄCHTER über den Kasten der Tippchallenge in „Meine Klassen" (Lehrkraft).
 *
 * ★★ Seit 10.09.2026 abends (Johannes): Gestartet wird nur sofort - „Jetzt
 * starten" ist der einzige Schalter, Datum und Uhrzeit stehen nicht im
 * Formular, und die Prüfungszeit steht in derselben Reihe wie das Niveau.
 * Wohin dieser Wächter sich bewegt, wenn es schlechter wird: Kommt ein
 * Datums- oder Zeitfeld zurück, ein zweiter Start-Schalter oder rutscht die
 * Prüfungszeit aus der Reihe des Niveaus, wird er rot.
 */
import { describe, expect, it, vi, beforeEach } from "vitest";
import { cleanup, render, screen, fireEvent, waitFor } from "@testing-library/react";
import type { TypingAccount, TypingClass } from "@/lib/typing/account";
import { SchreibprobeKasten } from "@/components/lernwerkstatt/klasse/SchreibprobeKasten";
import type { Probenergebnis } from "@/lib/typing/schreibprobeAuswertung";
import { HINWEIS_CHALLENGE as H } from "@/lib/typing/schreibprobeHinweise";

/** Alle Mouseover-Hinweise, die gerade im Baum stehen. */
function hinweistexte(): string[] {
  return [...document.querySelectorAll('[role="tooltip"]')].map((h) => h.textContent ?? "");
}

const rufe: Record<string, unknown[]> = { setzen: [], speichern: [], poolSpeichern: [] };
let klassenProben: Record<string, Probenergebnis[]> = {};

vi.mock("@/lib/typing/backend", () => ({
  typingBackend: () => ({
    setzeSchreibprobe: async (c: string, t: string, plan: unknown, zeiger: unknown) => {
      rufe.setzen.push({ c, t, plan, zeiger });
      return { code: c, name: "4a", teacherId: t, createdAt: 0 } as TypingClass;
    },
    leseKlassenProben: async () => klassenProben,
    // „Bereit: 12 von 14" (10.09.2026) beobachtet die Kinder, solange eine
    // Challenge läuft - hier ohne Server, also ohne Meldungen.
    beobachteKinder: () => () => {},
    listPupils: async () => [],
    // ★ Niveau „eigen" (17.09.2026): eigene Datei ablegen, bevor der Plan
    // gebaut wird.
    speichereEigenenText: async (
      classCode: string,
      teacherId: string,
      dateiname: string,
      zeilen: string[],
    ) => {
      rufe.speichern.push({ classCode, teacherId, dateiname, zeilen });
      return "text-eigen-1";
    },
    // ── Meine Texte (E8, 19.09.2026) ────────────────────────────────────────
    listeMeineTexte: async () => [],
    speichereMeinenText: async (teacherId: string, dateiname: string, zeilen: string[]) => {
      rufe.poolSpeichern.push({ teacherId, dateiname, zeilen });
      return "pool-1";
    },
    leseMeinenText: async () => null,
    loescheMeinenText: async () => false,
  }),
}));

const KINDER = [
  { id: "k1", role: "schueler", name: "Ferdi", createdAt: 0 },
  { id: "k2", role: "schueler", name: "Runa", createdAt: 0, vorlesenPruefung: true },
] as TypingAccount[];

function klasse(settings?: unknown): TypingClass {
  return { code: "4a", name: "4a", teacherId: "t1", createdAt: 0, settings } as TypingClass;
}

function zeige(cls: TypingClass) {
  const onClassChange = vi.fn();
  render(<SchreibprobeKasten cls={cls} pupils={KINDER} onClassChange={onClassChange} />);
  return onClassChange;
}

beforeEach(() => {
  rufe.setzen = [];
  rufe.speichern = [];
  rufe.poolSpeichern = [];
  klassenProben = {};
  vi.stubGlobal("confirm", () => true);
});

describe("SchreibprobeKasten", () => {
  it("A: zeigt das Formular, den nächsten Text und das Einstiegsfenster", async () => {
    zeige(klasse());
    await waitFor(() => expect(screen.getByLabelText("Tastaturniveau")).toBeTruthy());
    // Die Texte werden nachgeladen - bis dahin „Es wird nachgesehen …".
    await waitFor(() => expect(document.body.textContent).toContain("Es kommt Text 1 von 15."));
    const t = document.body.textContent ?? "";
    expect(t).toContain("10 Minuten");
    expect(t).toContain("ersten Tastendruck");
    // ★ 11.09.2026 abends (Johannes: „Die Tastenchallenge kann man einklappen
    // und ist es standardmäßig auch"): Die Überschrift umschliesst den
    // Schalter des Kastens - sie heisst wie er, und er steht beim Laden ZU.
    const schalter = screen.getByRole("button", { name: "Tippchallenge" });
    expect(screen.getByRole("heading", { name: "Tippchallenge" }).contains(schalter)).toBe(true);
    expect(schalter.getAttribute("aria-expanded")).toBe("false");
    expect(screen.getByRole("button", { name: "Jetzt starten" })).toBeTruthy();
    // Kein Bedienelement ist je `disabled`.
    expect(document.querySelectorAll("[disabled]").length).toBe(0);
  });

  it("★★ A: nur „Jetzt starten“ - kein Datum, keine Uhrzeit, kein zweiter Start-Schalter", async () => {
    zeige(klasse());
    await waitFor(() => expect(screen.getByLabelText("Tastaturniveau")).toBeTruthy());
    expect(document.querySelectorAll('input[type="date"], input[type="time"]').length).toBe(0);
    expect(screen.queryByLabelText(/Datum|Uhrzeit/)).toBeNull();
    // Genau EIN Knopf startet etwas - und nichts heisst mehr „ansetzen".
    const knoepfe = screen.getAllByRole("button").map((b) => b.textContent ?? "");
    expect(knoepfe.filter((k) => /start|ansetz/i.test(k))).toEqual(["Jetzt starten"]);
    expect(document.body.textContent ?? "").not.toMatch(/ansetz|angesetzt/i);
  });

  it("★★ A: die Prüfungszeit steht in DERSELBEN Reihe wie das Niveau", async () => {
    zeige(klasse());
    const niveau = await screen.findByLabelText("Tastaturniveau");
    const dauer = screen.getByLabelText("Prüfungszeit (Minuten)");
    const reihe = niveau.closest("[data-reihe]");
    expect(reihe, "Gegenprobe: die Reihe wurde gefunden").toBeTruthy();
    expect(dauer.closest("[data-reihe]")).toBe(reihe);
    // Und der Kasten zum Vorlesen steht NICHT mehr zwischen ihnen.
    expect(reihe!.textContent ?? "").not.toContain("Kinder mit Blindheit");
    // ★ Das Feld steht rechts - sein Hinweis dockt RECHTS an und läuft nach
    // links. Sonst ragt er (auch unsichtbar) über den Rand, und die Seite
    // wandert auf einem iPad im Hochformat seitlich (gemessen 10.09.2026).
    // ★ K1 (19.09.2026): Der Kasten hängt unter `<body>`, in der Reihe steht
    // seine Marke - über deren Id wird er gefunden.
    const hinweis = [...reihe!.querySelectorAll("[data-hinweis-anker]")]
      .map((m) => document.getElementById(m.getAttribute("data-hinweis-anker")!))
      .find((t) => t?.textContent === H.pruefungszeit);
    expect(hinweis, "Gegenprobe: der Hinweis der Prüfungszeit wurde gefunden").toBeTruthy();
    expect(hinweis!.getAttribute("data-ausrichtung")).toBe("rechts");
  });

  it("A: ★ jedes Feld des Formulars trägt seinen Mouseover-Hinweis (10.09.2026)", async () => {
    zeige(klasse());
    await waitFor(() => expect(screen.getByLabelText("Tastaturniveau")).toBeTruthy());
    const texte = hinweistexte();
    // ★ Nachbesserung E5b (11.09.2026): Der Hinweis am Niveau-Feld trägt jetzt
    // ZUSÄTZLICH die Erklärung des gewählten Niveaus (`def.erklaerung`) -
    // darum `startsWith` statt exaktem Vergleich (die schlanke Zeile ist
    // dadurch wirklich eine Zeile, kein eigener Absatz mehr darunter).
    expect(texte.some((t) => t.startsWith(H.tastaturniveau))).toBe(true);
    expect(texte).toContain(H.pruefungszeit);
    // Der Knopf bekommt seinen Hinweis auch beim Fokus - also über aria-describedby.
    // ★ D2 (Umbau 11.09.2026): Der Hinweis trägt jetzt ZUSÄTZLICH, wo es
    // weitergeht (`startSatz`/`herkunftSatz`) - beide Sätze in einem Text.
    const knopf = screen.getByRole("button", { name: "Jetzt starten" });
    const ids = (knopf.getAttribute("aria-describedby") ?? "").split(" ").filter(Boolean);
    const knopfHinweise = ids.map((id) => document.getElementById(id)?.textContent ?? "");
    expect(knopfHinweise.some((t) => t.startsWith(H.jetztStarten))).toBe(true);
    // Gegenprobe: Der Name des Feldes bleibt sauber - der Hinweis liegt UM die
    // Beschriftung, nicht in ihr.
    expect(screen.getByLabelText("Prüfungszeit (Minuten)")).toBeTruthy();
  });

  it("A: Jetzt starten startet sofort und meldet die neue Klasse", async () => {
    const onClassChange = zeige(klasse());
    await waitFor(() => expect(screen.getByLabelText("Tastaturniveau")).toBeTruthy());
    const vorher = Date.now();
    fireEvent.click(screen.getByRole("button", { name: "Jetzt starten" }));
    await waitFor(() => expect(rufe.setzen.length).toBe(1));
    const { plan, zeiger } = rufe.setzen[0] as { plan: any; zeiger: any };
    expect(plan.niveau).toBe("start");
    expect(plan.dauerMin).toBe(10);
    // ★ 0 seit dem 10.09.2026, und das ist gemessen: Wo die App vorliest, zieht
    // sie die Zeit exakt ab; ein Pauschalzuschlag wäre daneben (41 % bis 179 %
    // Streuung, `BEFUND-2026-09-10-VORLESEZEIT-GEMESSEN.md`).
    expect(plan.zuschlagProzent).toBe(0);
    expect(plan.textNr).toBe(0);
    // ★ Der Augenblick des Drückens - nicht auf die Minute abgerundet.
    expect(plan.startMs).toBeGreaterThanOrEqual(vorher);
    expect(plan.startMs).toBeLessThanOrEqual(Date.now());
    expect(plan.startZeile).toBe(0);
    // ★ Der Zeiger des Niveaus zeigt ab jetzt auf DIESE Challenge.
    expect(zeiger.start).toEqual({ textNr: 0, zeile: 0, probeId: plan.id });
    expect(onClassChange).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.getByRole("status").textContent).toContain("Gestartet"));
  });

  describe("★★★ Art - Streng / Freies Schreiben (23.09.2026)", () => {
    it("die Radiowahl ist sichtbar, Vorgabe streng - der geschriebene Plan trägt KEIN modus-Feld", async () => {
      const onClassChange = zeige(klasse());
      await waitFor(() => expect(screen.getByLabelText("Tastaturniveau")).toBeTruthy());
      const streng = screen.getByRole("radio", { name: /^Streng/ });
      const frei = screen.getByRole("radio", { name: /^Freies Schreiben/ });
      expect(streng).toBeTruthy();
      expect(frei).toBeTruthy();
      expect((streng as HTMLInputElement).checked).toBe(true);
      expect((frei as HTMLInputElement).checked).toBe(false);
      // Nichts ist je `disabled` - auch die neuen Radioknöpfe nicht.
      expect(document.querySelectorAll("[disabled]").length).toBe(0);

      fireEvent.click(screen.getByRole("button", { name: "Jetzt starten" }));
      await waitFor(() => expect(rufe.setzen.length).toBe(1));
      const { plan } = rufe.setzen[0] as { plan: Record<string, unknown> };
      expect(plan).not.toHaveProperty("modus");
      expect(onClassChange).toHaveBeenCalledTimes(1);
    });

    it("„Freies Schreiben“ wählen ⇒ der geschriebene Plan trägt modus: \"frei\"", async () => {
      zeige(klasse());
      await waitFor(() => expect(screen.getByLabelText("Tastaturniveau")).toBeTruthy());
      const frei = screen.getByRole("radio", { name: /^Freies Schreiben/ });
      fireEvent.click(frei);
      expect((frei as HTMLInputElement).checked).toBe(true);

      fireEvent.click(screen.getByRole("button", { name: "Jetzt starten" }));
      await waitFor(() => expect(rufe.setzen.length).toBe(1));
      const { plan } = rufe.setzen[0] as { plan: Record<string, unknown> };
      expect(plan.modus).toBe("frei");
    });

    it("die laufende Challenge trägt den Vermerk „Freies Schreiben“ neben dem Niveau, wenn frei", async () => {
      const plan = {
        id: "sp-frei",
        niveau: "buchstaben",
        startMs: Date.now() - 60_000,
        dauerMin: 10,
        textNr: 2,
        zuschlagProzent: 0,
        angelegtMs: Date.now(),
        modus: "frei",
      };
      zeige(klasse({ schreibprobe: plan }));
      await waitFor(() => expect(document.body.textContent).toContain("läuft"));
      // Aufklappen - der Vermerk steht im aufgeklappten Teil (die Niveau-Zeile).
      fireEvent.click(screen.getByRole("button", { name: "Tippchallenge" }));
      await waitFor(() => expect(document.body.textContent).toContain("Freies Schreiben"));
    });
  });

  it("★★★ Texte sparen: „Es geht weiter in Text 1, ab Zeile 58“ - und genau dort startet sie", async () => {
    /*
     * Johannes 10.09.2026: Die nächste Challenge beginnt an der Zeile nach der,
     * an der das weiteste Kind der letzten war. Ferdi stand in Zeile 40, Runa
     * in Zeile 57 (0-basiert 56) ⇒ weiter in Zeile 58. Die Grundreihe hat
     * keine Sätze, es zählt also die nächste Zeile.
     */
    const ergebnisBei = (zeile: number) =>
      ({
        probeId: "sp-z",
        niveau: "start",
        textNr: 0,
        textTitel: "T",
        startZeile: 0,
        endeTextNr: 0,
        endeZeile: zeile,
        beginnMs: Date.now() - 2 * 24 * 3600_000,
        endeMs: Date.now() - 2 * 24 * 3600_000 + 600_000,
        zeitMs: 600_000,
        zuschlagProzent: 0,
        wartezeitMs: 0,
        zeichen: 900,
        fehler: 10,
        zeilen: zeile,
        schreibMs: 600_000,
        anschlaege: 90,
        genauigkeit: 0.99,
        tasten: [],
        wacklig: [],
        layout: "de",
        textZuEnde: false,
        frueherAbgegeben: false,
      }) as unknown as Probenergebnis;
    klassenProben = { k1: [ergebnisBei(39)], k2: [ergebnisBei(56)] };
    zeige(
      klasse({
        schreibprobeVerbraucht: { start: [0, 1, 2] },
        schreibprobeZeiger: { start: { textNr: 0, zeile: 0, probeId: "sp-z" } },
      }),
    );
    await waitFor(() =>
      expect(document.body.textContent).toContain("Es geht weiter in Text 1, ab Zeile 58."),
    );
    // Gegenprobe: Die alte Verbrauchsliste hätte „Text 4" gesagt - der Zeiger schlägt sie.
    expect(document.body.textContent).not.toContain("Text 4");
    // Der Knopf nennt beim Fokus mit, wo es losgeht.
    const knopf = screen.getByRole("button", { name: "Jetzt starten" });
    const ids = (knopf.getAttribute("aria-describedby") ?? "").split(" ");
    expect(document.getElementById(ids[0])?.textContent).toContain("ab Zeile 58");

    fireEvent.click(knopf);
    await waitFor(() => expect(rufe.setzen.length).toBe(1));
    const { plan, zeiger } = rufe.setzen[0] as { plan: any; zeiger: any };
    expect(plan.textNr).toBe(0);
    expect(plan.startZeile).toBe(57);
    expect(zeiger.start).toEqual({ textNr: 0, zeile: 57, probeId: plan.id });
    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toContain("Text 1, ab Zeile 58"),
    );
  });

  it("A: eine Prüfungszeit ausserhalb der Grenzen speichert NICHT und sagt warum", async () => {
    zeige(klasse());
    await waitFor(() => expect(screen.getByLabelText("Tastaturniveau")).toBeTruthy());
    fireEvent.change(screen.getByLabelText("Prüfungszeit (Minuten)"), { target: { value: "99" } });
    fireEvent.click(screen.getByRole("button", { name: "Jetzt starten" }));
    await waitFor(() =>
      expect(document.body.textContent).toContain("zwischen 1 und 60 Minuten"),
    );
    expect(rufe.setzen.length).toBe(0);
  });

  it("B: läuft - Zeitstand ohne Live-Region, Abgabeliste, Absagen", async () => {
    const plan = {
      id: "sp1",
      niveau: "buchstaben",
      startMs: Date.now() - 60_000,
      dauerMin: 10,
      textNr: 2,
      zuschlagProzent: 50,
      angelegtMs: Date.now(),
    };
    const onClassChange = zeige(klasse({ schreibprobe: plan }));
    await waitFor(() => expect(document.body.textContent).toContain("läuft"));
    const t = document.body.textContent ?? "";
    expect(t).toContain("Text 3 von 15");
    expect(t).toContain("Abgegeben: 0 von 2");
    expect(t).toContain("Ferdi");
    expect(t).toContain("Gestartet");
    expect(t).toContain("Einstiegsfenster");
    // ★ D4 (Umbau 11.09.2026): kein Häkchen mehr, also auch keine Zeile
    // „Vorlesen erlaubt" mit Namen - Vorlesen ist Sache jedes Kindes selbst.
    expect(t).not.toContain("Vorlesen erlaubt");
    // ⚠️ Der laufende Zeitstand darf in KEINER Live-Region stehen.
    for (const bereich of document.querySelectorAll("[aria-live]")) {
      expect(bereich.textContent ?? "").not.toMatch(/\d+:\d\d/);
    }
    // Die Zahl selbst ist aria-hidden. ★ Seit 11.09.2026 steht vor ihr der
    // (ebenfalls stille) Pfeil des Schalters - gesucht wird darum unter ALLEN
    // stillen Elementen. Sie steht in der Zeile, also auch zugeklappt da.
    const still = [...document.querySelectorAll('[aria-hidden="true"]')].find((e) =>
      /\d+:\d\d/.test(e.textContent ?? ""),
    );
    expect(still, "die laufende Zahl steht nicht still da").toBeTruthy();
    expect(still!.closest("[data-reihe]")).toBeTruthy();
    // ★ Zugeklappt nennt die Zeile, was jetzt gilt - und der Knopf zum Absagen
    // steht in ihr, nicht im zugeklappten Teil.
    const schalter = screen.getByRole("button", { name: "Tippchallenge" });
    const teil = document.getElementById(schalter.getAttribute("aria-controls") ?? "")!;
    expect(teil.hidden).toBe(true);
    const reihe = schalter.closest("[data-reihe]")!;
    expect(reihe.textContent).toContain("läuft");
    expect(reihe.textContent).toMatch(/Bereit: 0 von 2|Abgegeben: 0 von 2/);
    const absagen = screen.getByRole("button", { name: /absagen$/ });
    expect(reihe.contains(absagen)).toBe(true);
    fireEvent.click(absagen);
    await waitFor(() => expect(rufe.setzen.length).toBe(1));
    const abgesagt = rufe.setzen[0] as { plan: unknown };
    expect(abgesagt.plan).toBe(null);
    expect(onClassChange).toHaveBeenCalled();
    // R1-R6: Nach dem Absagen steht der Fokus auf dem Schalter des Kastens -
    // er bleibt stehen, wenn der Knopf „absagen" mit der Runde verschwindet.
    await waitFor(() => expect(document.activeElement).toBe(schalter));
  });

  it("vorbei: ★ oben das Formular, darunter die Runde offen - mit Leistungswert und Vorlesen", async () => {
    const plan = {
      id: "sp2",
      niveau: "start",
      startMs: Date.now() - 3 * 24 * 3600_000,
      dauerMin: 10,
      textNr: 0,
      zuschlagProzent: 0,
      angelegtMs: 0,
    };
    klassenProben = {
      k1: [
        {
          probeId: "sp2",
          niveau: "start",
          textNr: 0,
          textTitel: "T",
          beginnMs: plan.startMs,
          endeMs: plan.startMs + 600_000,
          zeitMs: 600_000,
          zuschlagProzent: 0,
          wartezeitMs: 134_000,
          zeichen: 900,
          fehler: 30,
          zeilen: 30,
          schreibMs: 600_000,
          anschlaege: 90,
          genauigkeit: 0.968,
          tasten: [],
          wacklig: [{ zeichen: "d", dran: 12, fehler: 4, quote: 0.66, schnittMs: 400 }],
          layout: "de",
          textZuEnde: false,
          frueherAbgegeben: false,
        } as unknown as Probenergebnis,
      ],
    };
    zeige(klasse({ schreibprobe: plan }));
    /*
     * ★★★ Johannes, 10.09.2026: „wenn ich auf Tippchallenge gehe, soll man immer
     * die Seite sehen, die kommt, wenn man »neue Tippchallenge …« klickt".
     * Gemessen wird beides: Das Formular steht da, OHNE einen Knopf dorthin -
     * und die eben beendete Runde steht offen darunter, mit der ganzen Klasse.
     */
    await waitFor(() => expect(screen.getByLabelText("Tastaturniveau")).toBeTruthy());
    expect(screen.queryByRole("button", { name: /^Neue / })).toBeNull();
    await waitFor(() => expect(document.body.textContent).toContain("nicht angetreten"));
    const t = document.body.textContent ?? "";
    // ★ D3 (Umbau 11.09.2026): die Liste heisst „Vergangene Tippchallenges
    // (N)". Seit 11.09.2026 abends steht sie im aufgeklappten Teil des
    // Kastens, und der ist beim Laden ZU.
    expect(t).toContain("Vergangene");
    // ⚠️ jsdom liefert den Text eines verborgenen Teils genauso wie eines
    // offenen - erst `hidden` beweist das „zu".
    const schalter = screen.getByRole("button", { name: "Tippchallenge" });
    expect(schalter.getAttribute("aria-expanded")).toBe("false");
    expect(document.getElementById(schalter.getAttribute("aria-controls") ?? "")?.hidden).toBe(true);
    fireEvent.click(schalter);
    // ★ L3 (19.09.2026, Johannes: „die vergangenen sollen eingeklappt
    // bleiben"): Auch die eben beendete Runde steht ZU - ein Druck auf ihren
    // grossen Aufklapp-Schalter öffnet sie.
    const runde = screen
      .getAllByRole("button")
      .find((b) => b.closest("li") && b.getAttribute("aria-expanded") === "false")!;
    fireEvent.click(runde);
    expect(runde.getAttribute("aria-expanded")).toBe("true");
    expect(t).toContain("Klassenschnitt");
    expect(t).toContain("90");
    expect(t).toContain("97 %");
    expect(t).toContain("Wacklig");
    // ★ „Bei den Ergebnissen möchte ich auch diesen allgemeinen Score-Wert sehen."
    const koepfe = screen.getAllByRole("columnheader").map((k) => k.textContent ?? "");
    expect(koepfe.some((k) => k.startsWith("Leistungswert"))).toBe(true);
    expect(t).toContain("Leistungswert im Schnitt");
    // ★ „Das muss auch beim Ergebnis mitgeliefert werden, wer hat Vorlesen verwendet."
    expect(koepfe.some((k) => k.startsWith("Vorlesen"))).toBe(true);
    expect(t).toMatch(/ja, 0?2:14 abgezogen/);
    // ★ Die Köpfe der Ergebnistabelle erklären sich (10.09.2026).
    for (const erwartet of [H.rang, H.vorlesen, H.anschlaege, H.treffsicherheit, H.zeichen, H.fehler, H.wacklig]) {
      expect(hinweistexte()).toContain(erwartet);
    }
    // ★ E12 (19.09.2026): „Leistungswert" trägt seit dem Absatz-Absterben
    // unter der Tabelle EINEN Satz mehr als `H.leistungswert` allein - der
    // Zusatz, dass ein ungewertetes Ergebnis trotzdem seine Zahlen zeigt
    // (`SchreibprobeKasten.tsx`, direkt am Spaltenkopf).
    expect(hinweistexte()).toContain(
      `${H.leistungswert} Ohne Wertung bleiben die anderen Zahlen der Zeile trotzdem stehen.`,
    );
  });

  /*
   * ★★★ Johannes, 10.09.2026: „in der Tabelle der vergangenen Challenges fehlt
   * die mouseover erklärung". Die Hinweise WAREN da (Test oben) - ein
   * `overflow-x-auto` um die Tabelle schnitt sie ab. jsdom rechnet kein Layout,
   * darum prüft dieser Wächter die Ursache: Rollkasten nur bei Überbreite.
   */
  it("★★★ die Ergebnistabelle steckt nur in einem Rollkasten, wenn sie zu breit ist", async () => {
    const plan = {
      id: "sp3",
      niveau: "start",
      startMs: Date.now() - 3 * 24 * 3600_000,
      dauerMin: 10,
      textNr: 0,
      zuschlagProzent: 0,
      angelegtMs: 0,
    };
    klassenProben = {
      k1: [
        {
          probeId: "sp3",
          niveau: "start",
          textNr: 0,
          textTitel: "T",
          beginnMs: plan.startMs,
          endeMs: plan.startMs + 600_000,
          zeitMs: 600_000,
          zuschlagProzent: 0,
          wartezeitMs: 0,
          zeichen: 900,
          fehler: 30,
          zeilen: 30,
          schreibMs: 600_000,
          anschlaege: 90,
          genauigkeit: 0.968,
          tasten: [],
          wacklig: [],
          layout: "de",
          textZuEnde: false,
          frueherAbgegeben: false,
        } as unknown as Probenergebnis,
      ],
    };
    const rollkastenUm = (el: Element | null) => !!el?.closest(".overflow-x-auto");
    const kopf = () =>
      screen.getAllByRole("columnheader").find((k) => (k.textContent ?? "").startsWith("Leistungswert"))!;
    // ★ Seit 11.09.2026 abends steht die Tabelle im einklappbaren Kasten, und
    // der ist beim Laden zu - aufgeklappt wird sie erst sichtbar (und messbar).
    const klappeAuf = () => {
      fireEvent.click(screen.getByRole("button", { name: "Tippchallenge" }));
      // ★ L3 (19.09.2026): jede Runde steht zu - auch die eben beendete.
      const runde = screen
        .getAllByRole("button")
        .find((b) => b.closest("li") && b.getAttribute("aria-expanded") === "false");
      if (runde) fireEvent.click(runde);
    };

    zeige(klasse({ schreibprobe: plan }));
    await waitFor(() => expect(document.body.textContent).toContain("Klassenschnitt"));
    klappeAuf();
    expect(rollkastenUm(kopf())).toBe(false);
    cleanup();

    // Gegenprobe: dieselbe Tabelle, aber breiter als ihr Platz.
    const breite = vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(function (
      this: HTMLElement,
    ) {
      return this.tagName === "TABLE" ? 2000 : 0;
    });
    const platz = vi.spyOn(Element.prototype, "clientWidth", "get").mockImplementation(() => 600);
    try {
      zeige(klasse({ schreibprobe: plan }));
      await waitFor(() => expect(document.body.textContent).toContain("Klassenschnitt"));
      klappeAuf();
      await waitFor(() => expect(rollkastenUm(kopf())).toBe(true));
    } finally {
      breite.mockRestore();
      platz.mockRestore();
    }
  });

  it("★ eine beendete Runde OHNE Abgabe steht trotzdem da - alle „nicht angetreten“", async () => {
    // Befund beim Nachziehen des Handbuchs (10.09.2026): Die Liste entstand nur
    // aus Ergebnissen, eine Runde ohne jede Abgabe fehlte also ganz.
    const plan = {
      id: "sp-leer",
      niveau: "start",
      startMs: Date.now() - 2 * 24 * 3600_000,
      dauerMin: 10,
      textNr: 0,
      zuschlagProzent: 0,
      angelegtMs: 0,
    };
    klassenProben = {};
    zeige(klasse({ schreibprobe: plan }));
    await waitFor(() => expect(document.body.textContent).toContain("Vergangene"));
    // Siehe oben - der Text allein beweist das „zu" nicht.
    const schalter = screen.getByRole("button", { name: "Tippchallenge" });
    expect(document.getElementById(schalter.getAttribute("aria-controls") ?? "")?.hidden).toBe(true);
    const zeilen = [...document.querySelectorAll("tbody tr")].map((tr) => tr.textContent ?? "");
    expect(zeilen).toHaveLength(2);
    for (const z of zeilen) expect(z).toContain("nicht angetreten");
  });

  it("★★★ kein Zeitzuschlag, kein Häkchen mehr - Vorlesen ist Sache des Kindes (D4, 11.09.2026)", async () => {
    /*
     * Johannes, 10.09.2026: „den Zeitzuschlag … und die Häkchen unten brauchen
     * wir nicht. Blinde verwenden Vorlesen, und das muss erwähnt werden." -
     * und Johannes, 11.09.2026 nachmittags: „schaff das Häkchen ab, es
     * verwirrt nur." Der Kasten „Kinder mit Blindheit …" ist seither WEG:
     * Vorgelesen wird, wer sein eigenes Vorlesen eingeschaltet hat - wie
     * beim Üben, ohne dass die Lehrkraft etwas einstellen muss.
     */
    zeige(klasse());
    await waitFor(() => expect(screen.getByLabelText("Tastaturniveau")).toBeTruthy());
    expect(screen.queryByLabelText(/Zeitzuschlag/)).toBeNull();
    expect(document.querySelectorAll('input[type="checkbox"]').length).toBe(0);
    const t = document.body.textContent ?? "";
    expect(t).not.toContain("Vorlesen bei Prüfungen erlaubt");
    expect(t).not.toContain("Kinder mit Blindheit");
  });

  /*
   * ★★★ Johannes, 11.09.2026: „Die Tastenchallenge kann man einklappen und ist
   * es standardmäßig auch, aber auch eingeklappt kann man die drei wichtigen
   * Dinge sehen und einstellen (Niveau; Min; Starten)".
   * Wohin dieser Wächter sich bewegt, wenn es schlechter wird: Rutscht eines
   * der drei in den zugeklappten Teil, wird der Kasten zu einem `<details>`
   * (dessen `<summary>` keine Felder tragen darf) oder verlieren die Felder
   * ihren vollen Namen, wird er rot.
   */
  it("★★★ zugeklappt bleiben Niveau, Min und „Jetzt starten“ bedienbar - aufgeklappt kommt der Rest dazu", async () => {
    zeige(klasse());
    const niveau = await screen.findByRole("combobox", { name: "Tastaturniveau" });
    const dauer = screen.getByRole("spinbutton", { name: "Prüfungszeit (Minuten)" });
    const start = screen.getByRole("button", { name: "Jetzt starten" });
    const schalter = screen.getByRole("button", { name: "Tippchallenge" });
    const teil = document.getElementById(schalter.getAttribute("aria-controls") ?? "");
    expect(teil, "Gegenprobe: aria-controls zeigt auf den aufklappbaren Teil").toBeTruthy();
    expect(schalter.getAttribute("aria-expanded")).toBe("false");
    expect(teil!.hidden).toBe(true);
    // Die drei stehen AUSSERHALB des zugeklappten Teils, in der Zeile des Schalters.
    const reihe = schalter.closest("[data-reihe]")!;
    for (const el of [niveau, dauer, start]) {
      expect(teil!.contains(el)).toBe(false);
      expect(reihe.contains(el)).toBe(true);
    }
    expect(document.querySelector("details, summary")).toBeNull();
    // Sichtbar kurz, für Sprachausgaben vollständig (die Namen oben).
    expect(document.querySelector(`label[for="${niveau.id}"]`)?.textContent).toBe("Niveau");
    expect(document.querySelector(`label[for="${dauer.id}"]`)?.textContent).toBe("Min");
    // Aufklappen: Was bis dahin nur als Hinweis stand, steht jetzt da.
    fireEvent.click(schalter);
    expect(schalter.getAttribute("aria-expanded")).toBe("true");
    expect(teil!.hidden).toBe(false);
    await waitFor(() => expect(teil!.textContent).toContain("Es kommt Text 1 von 15."));
    // Die Statuszeile steht NICHT im aufklappbaren Teil - sonst schwiege sie zugeklappt.
    expect(teil!.contains(screen.getByRole("status"))).toBe(false);
    // Und wieder zu.
    fireEvent.click(schalter);
    expect(teil!.hidden).toBe(true);
  });

  it("★★ nach „Jetzt starten“ steht der Fokus auf „läuft“ in der Zeile - sichtbar, auch zugeklappt", async () => {
    /*
     * Auf der Seite kommt die gestartete Klasse erst NACH dem Speichern herein:
     * `onClassChange` lädt nach, und bis die Antwort da ist, gibt es „läuft"
     * noch gar nicht. Genau das stellt dieser Wächter nach - mit einem
     * `rerender` NACH dem Klick, nicht im selben Augenblick.
     */
    const onClassChange = vi.fn();
    const { rerender } = render(
      <SchreibprobeKasten cls={klasse()} pupils={KINDER} onClassChange={onClassChange} />,
    );
    await waitFor(() => expect(screen.getByLabelText("Tastaturniveau")).toBeTruthy());
    fireEvent.click(screen.getByRole("button", { name: "Jetzt starten" }));
    await waitFor(() => expect(rufe.setzen.length).toBe(1));
    await waitFor(() => expect(screen.getByRole("status").textContent).toContain("Gestartet"));
    const { plan } = rufe.setzen[0] as { plan: unknown };
    rerender(
      <SchreibprobeKasten
        cls={klasse({ schreibprobe: plan })}
        pupils={KINDER}
        onClassChange={onClassChange}
      />,
    );
    await waitFor(() => expect(document.activeElement?.textContent).toBe("Tippchallenge läuft"));
    const schalter = screen.getByRole("button", { name: "Tippchallenge" });
    const teil = document.getElementById(schalter.getAttribute("aria-controls") ?? "")!;
    expect(teil.hidden).toBe(true);
    expect(teil.contains(document.activeElement)).toBe(false);
  });
});

describe("★★★ Niveau 'eigen' - Tippchallenge mit eigener Datei (17.09.2026)", () => {
  it("Datei hochladen, Vorschau, 'Jetzt starten' - Text ablegen VOR dem Plan, mit eigeneDateiId", async () => {
    const onClassChange = zeige(klasse());
    await waitFor(() => expect(screen.getByLabelText("Tastaturniveau")).toBeTruthy());
    // Aufklappen - der Datei-Upload steht im aufgeklappten Teil.
    fireEvent.click(screen.getByRole("button", { name: "Tippchallenge" }));
    fireEvent.change(screen.getByLabelText("Tastaturniveau"), { target: { value: "eigen" } });

    const input = (await screen.findByLabelText(
      /Eigene Datei hochladen/,
    )) as HTMLInputElement;
    fireEvent.change(input, {
      target: { files: [new File(["Erste Zeile\nZweite Zeile"], "gedicht.txt", { type: "text/plain" })] },
    });
    await waitFor(() => expect(screen.getByText(/2 Zeilen/)).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: "Jetzt starten" }));
    await waitFor(() => expect(rufe.setzen.length).toBe(1));
    expect(onClassChange).toHaveBeenCalledTimes(1);

    // Die Datei wird ABGELEGT, bevor der Plan geschrieben wird - sonst hätte
    // der Plan eine Id, zu der (noch) keine Zeile existiert.
    expect(rufe.speichern).toEqual([
      {
        classCode: "4a",
        teacherId: "t1",
        dateiname: "gedicht.txt",
        zeilen: ["Erste Zeile", "Zweite Zeile"],
      },
    ]);
    const { plan } = rufe.setzen[0] as { plan: any };
    expect(plan.niveau).toBe("eigen");
    expect(plan.eigeneDateiId).toBe("text-eigen-1");
    expect(plan.eigeneDateiname).toBe("gedicht.txt");
    expect(plan.textNr).toBe(0);
    expect(plan.startZeile).toBe(0);
    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toContain("gedicht.txt"),
    );
    // E8 (19.09.2026): „In Meine Texte speichern" steht auf AN.
    expect(rufe.poolSpeichern).toEqual([
      { teacherId: "t1", dateiname: "gedicht.txt", zeilen: ["Erste Zeile", "Zweite Zeile"] },
    ]);
  });

  it("★ E8: 'In Meine Texte speichern' abwählen - kein Pool-Aufruf bei der Tippchallenge", async () => {
    zeige(klasse());
    await waitFor(() => expect(screen.getByLabelText("Tastaturniveau")).toBeTruthy());
    fireEvent.click(screen.getByRole("button", { name: "Tippchallenge" }));
    fireEvent.change(screen.getByLabelText("Tastaturniveau"), { target: { value: "eigen" } });
    const input = (await screen.findByLabelText(/Eigene Datei hochladen/)) as HTMLInputElement;
    fireEvent.change(input, {
      target: { files: [new File(["Erste Zeile\nZweite Zeile"], "gedicht.txt", { type: "text/plain" })] },
    });
    await waitFor(() => expect(screen.getByText(/2 Zeilen/)).toBeInTheDocument());

    fireEvent.click(screen.getByLabelText("In Meine Texte speichern"));
    fireEvent.click(screen.getByRole("button", { name: "Jetzt starten" }));

    await waitFor(() => expect(rufe.setzen.length).toBe(1));
    expect(rufe.poolSpeichern).toEqual([]);
  });

  it("ohne hochgeladene Datei speichert 'Jetzt starten' NICHTS und sagt warum", async () => {
    zeige(klasse());
    await waitFor(() => expect(screen.getByLabelText("Tastaturniveau")).toBeTruthy());
    fireEvent.change(screen.getByLabelText("Tastaturniveau"), { target: { value: "eigen" } });
    fireEvent.click(screen.getByRole("button", { name: "Jetzt starten" }));
    await waitFor(() =>
      expect(document.body.textContent).toContain("zuerst eine eigene Datei hochladen"),
    );
    expect(rufe.setzen.length).toBe(0);
    expect(rufe.speichern.length).toBe(0);
  });
});
