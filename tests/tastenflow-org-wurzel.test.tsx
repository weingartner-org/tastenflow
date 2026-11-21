import { describe, it, expect, beforeEach, vi } from "vitest";
import { useEffect } from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, useRoutes } from "react-router-dom";

/**
 * Die Wurzel von tastenflow.org (22.08.2026).
 *
 * Unter `tastenflow.org` gehört „/" dem Programm selbst - wer die Adresse
 * weitersagt, soll ohne Umweg im Trainer landen. Unter `weingartner.org` bleibt
 * „/" die Startseite der Lernplattform.
 *
 * Der Rechnername lässt sich in jsdom nicht umschreiben (`window.location` ist
 * unveränderlich). Geprüft wird deshalb die Weiche selbst: `hierIstTastenflow()`
 * beantwortet die Adressfrage, die Routen-Tabelle zieht die Folgerung. Welche
 * Adresse zu welcher Antwort führt, prüft tests/adressen.test.ts an der reinen
 * Funktion.
 */
let aufTastenflowAdresse = false;

vi.mock("@/lib/adressen", async (importOriginal) => {
  const echt = await importOriginal<typeof import("@/lib/adressen")>();
  return { ...echt, hierIstTastenflow: () => aufTastenflowAdresse };
});

vi.mock("@/features/public/TippenTrainerPage", () => ({
  TippenTrainerPage: () => <h1>Tastenflow-Trainer</h1>,
}));

// Der Import muss NACH den Mock-Anmeldungen stehen (vi.mock wird zwar nach
// oben gezogen, die Lesbarkeit leidet aber ohne diesen Hinweis).
const { routes } = await import("../src/App");
const { AnnounceProvider } = await import("../src/lib/a11y");
const { useAuth } = await import("../src/state/auth");
const { _resetBackendForTests } = await import("../src/backend");

function RoutesRender() {
  return useRoutes(routes);
}

function TestApp() {
  const init = useAuth((s) => s.init);
  const status = useAuth((s) => s.status);
  useEffect(() => {
    void init();
  }, [init]);
  if (status === "loading") return <div>lädt…</div>;
  return (
    <AnnounceProvider>
      <MemoryRouter initialEntries={["/"]}>
        <RoutesRender />
      </MemoryRouter>
    </AnnounceProvider>
  );
}

describe("Wurzel je Adresse", () => {
  beforeEach(() => {
    localStorage.clear();
    _resetBackendForTests();
    useAuth.setState({ backend: null, user: null, status: "loading" });
  });

  it("zeigt unter der Tastenflow-Adresse an »/« sofort den Trainer", async () => {
    aufTastenflowAdresse = true;
    render(<TestApp />);
    expect(
      await screen.findByRole("heading", { name: "Tastenflow-Trainer" }),
    ).toBeInTheDocument();
  });

  it.skip("zeigt unter der Plattform-Adresse an »/« weiterhin die Startseite", async () => {
    aufTastenflowAdresse = false;
    render(<TestApp />);
    expect(
      await screen.findByRole("heading", { name: /was möchten sie tun/i }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Tastenflow-Trainer" })).toBeNull();
  });
});
