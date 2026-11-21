/**
 * `lib/seiteNachladen.tsx` (28.09.2026): Seiten werden erst beim Aufruf ihrer
 * Adresse geladen. Was sich für Menschen dabei NICHT ändern darf: der Fokus
 * landet nach dem Nachladen auf dem Seitentitel (wie bei `FocusOnRouteChange`),
 * eine schon geladene Seite stiehlt keinen Fokus, und ein alter Tab lädt bei
 * einem Nachladefehler genau EINMAL neu.
 */
import { act, render, screen } from "@testing-library/react";
import { NACHLADE_MERKER, faul, nachladeFehlerAbfangen } from "@/lib/seiteNachladen";

function Titel() {
  return <h1 id="seitentitel">Die Seite</h1>;
}

describe("faul: eine nachgeladene Seite", () => {
  it("zeigt beim Warten eine ruhige Statusanzeige und setzt danach den Fokus auf den Titel", async () => {
    let fertig: () => void = () => {};
    const Seite = faul(
      () => new Promise<{ default: typeof Titel }>((r) => (fertig = () => r({ default: Titel }))),
    );
    render(<Seite />);
    expect(screen.getByRole("status")).toHaveTextContent("Wird geladen");
    expect(document.activeElement).toBe(document.body);
    await act(async () => fertig());
    const h = await screen.findByRole("heading", { name: "Die Seite" });
    expect(document.activeElement).toBe(h);
  });

  it("eine schon geladene Seite stiehlt keinen Fokus (z. B. Reiterwechsel über ?reiter=)", async () => {
    const Seite = faul(() => Promise.resolve({ default: Titel }));
    await Seite.vorladen();
    const erst = render(<Seite />);
    await screen.findByRole("heading", { name: "Die Seite" });
    erst.unmount();
    render(
      <>
        <input aria-label="Eingabe" />
        <Seite />
      </>,
    );
    const feld = screen.getByRole("textbox", { name: "Eingabe" });
    feld.focus();
    await screen.findByRole("heading", { name: "Die Seite" });
    expect(document.activeElement).toBe(feld);
  });
});

describe("nachladeFehlerAbfangen: ein Tab von vor dem Deploy", () => {
  function fenster() {
    const horcher: Array<(e: Event) => void> = [];
    const speicher = new Map<string, string>();
    const reload = vi.fn();
    const f = {
      addEventListener: (_: string, h: (e: Event) => void) => horcher.push(h),
      sessionStorage: {
        getItem: (k: string) => speicher.get(k) ?? null,
        setItem: (k: string, v: string) => void speicher.set(k, v),
      },
      location: { reload },
    };
    const feuern = () => {
      const e = new Event("vite:preloadError", { cancelable: true });
      horcher.forEach((h) => h(e));
      return e;
    };
    return { f, feuern, reload, speicher };
  }

  it("lädt einmal neu und schluckt den Fehler dabei", () => {
    const { f, feuern, reload, speicher } = fenster();
    nachladeFehlerAbfangen(f as never, () => 1_000_000);
    const e = feuern();
    expect(reload).toHaveBeenCalledTimes(1);
    expect(e.defaultPrevented).toBe(true);
    expect(speicher.get(NACHLADE_MERKER)).toBe("1000000");
  });

  it("scheitert es nach dem Neuladen wieder, bleibt der Fehler stehen (keine Schleife)", () => {
    const { f, feuern, reload, speicher } = fenster();
    speicher.set(NACHLADE_MERKER, String(1_000_000 - 5_000));
    nachladeFehlerAbfangen(f as never, () => 1_000_000);
    const e = feuern();
    expect(reload).not.toHaveBeenCalled();
    expect(e.defaultPrevented).toBe(false);
  });

  it("ohne sessionStorage wird nie neu geladen (sonst gäbe es keinen Schutz)", () => {
    const { f, feuern, reload } = fenster();
    f.sessionStorage.setItem = () => {
      throw new Error("gesperrt");
    };
    nachladeFehlerAbfangen(f as never, () => 1_000_000);
    feuern();
    expect(reload).not.toHaveBeenCalled();
  });
});

describe("★ Scheitert das Nachladen trotzdem: Satz und Knopf statt leerem Bildschirm", () => {
  it("zeigt den Satz, setzt den Fokus darauf und bietet „Neu laden“", async () => {
    const stumm = vi.spyOn(console, "error").mockImplementation(() => {});
    const Seite = faul<typeof Titel>(() => Promise.reject(new Error("Netz weg")));
    render(<Seite />);
    const satz = await screen.findByText(/ließ sich gerade nicht laden/);
    expect(document.activeElement).toBe(satz);
    expect(screen.getByRole("button", { name: "Neu laden" })).toBeTruthy();
    expect(screen.queryByRole("alert")).toBeNull();
    stumm.mockRestore();
  });
});
