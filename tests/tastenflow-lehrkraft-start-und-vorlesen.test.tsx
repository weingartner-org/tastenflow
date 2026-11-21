/**
 * ★★★ WÄCHTER für zwei Wünsche - beide am 11.09.2026 umgebaut.
 *
 * 1. Johannes (10.09.2026): *„Lehrer müssen immer zuerst in der »Meine
 *    Klasse«-Seite starten, wenn sie die App starten, nicht auf Selbst
 *    üben."* Danach lag die Marke „übt selbst" im `sessionStorage` des
 *    TABS (`lib/typing/lehrkraftStart.ts`) und blieb dort auch nach einem
 *    Browser-Neustart mit wiederhergestellten Tabs stehen - Johannes
 *    (11.09.2026): *„in Selber üben lande ich immer, auch als Lehrer."*
 *
 *    ★ A6 (Umbau 11.09.2026): Die Datei `lehrkraftStart.ts` ist WEG. Die
 *    Marke hängt jetzt am VERLAUFSEINTRAG der Navigation
 *    (`navigate(pfad, { state: { selbstUeben: true } })` in
 *    `MeineKlassePage.tsx`), nicht mehr am Tab. `TippenTrainerPage.tsx`
 *    liest `useLocation().state?.selbstUeben` als Anfangswert von
 *    `umgeleitetFuer` (§ „WER SICH ALS LEHRKRAFT ANMELDET"). Dieser Wächter
 *    rendert die Seite darum wirklich, statt nur die alten Merkposten-
 *    Funktionen aufzurufen - sonst prüfte er eine Fassade, keine Wirkung.
 *
 * 2. Johannes (10.09.2026): *„Wenn ein Sehender sehend arbeitet und
 *    Vorlesen einschaltet, bekommt er ja Zeit gut geschrieben (ungerecht)."*
 *    Ohne das Häkchen „Vorlesen bei Prüfungen erlaubt" war die Stimme in
 *    der Tippchallenge stumm (`setPruefungStumm` in `lib/typing/voice.ts`).
 *
 *    ★ D4 (Umbau 11.09.2026, Johannes nachmittags): *„schaff das Häkchen
 *    ab, es verwirrt nur."* Das Häkchen und `setPruefungStumm` sind WEG;
 *    die App liest in der Tippchallenge vor, wenn das Kind sein eigenes
 *    Vorlesen eingeschaltet hat - wie beim Üben.
 *
 *    ⚠️ Nachbesserung E5b (11.09.2026): Der erste Bericht behauptete, das
 *    sei bereits durch `tests/tastenflow-schreibprobe-lauf.test.tsx`
 *    gedeckt - stimmte aber nicht, die Datei kannte „Vorlesen" gar nicht.
 *    Jetzt WIRKLICH gemessen, im Block „★★★ D4: Vorlesen in der Challenge
 *    folgt dem eigenen Schalter (11.09.2026)" derselben Datei; hier bleibt
 *    nur Teil 1 (der Startweg).
 */
import { beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { TippenTrainerPage } from "@/features/public/TippenTrainerPage";
import { useTypingAuth } from "@/components/typing/useTypingAuth";
import { registerTeacher } from "@/lib/typing/account";
import { meineKlasseHref } from "@/lib/adressen";

/** Wohin eine Lehrkraft OHNE „Selbst üben" geschickt wird - ohne die Frage
 *  danach, ob `tastenflow.org` oder `weingartner.org` gerade läuft. */
const ZIEL_MEINE_KLASSEN = meineKlasseHref("tippen").split("?")[0];

function baueLehrkraft() {
  const t = registerTeacher(`Frau Berger ${Math.random()}`, `berger${Date.now()}@example.org`, "geheim123");
  if (!t.ok) throw new Error(t.error);
  return t.value;
}

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

/**
 * Rendert `TippenTrainerPage` an der Wurzel; landet die Seite (per
 * `navigate(..., { replace: true })`) auf `ZIEL_MEINE_KLASSEN`, steht dort
 * der Ersatztext.
 */
function zeige(entry: { pathname: string; state?: unknown }) {
  render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path="/" element={<TippenTrainerPage />} />
        <Route path={ZIEL_MEINE_KLASSEN} element={<div>MEINE-KLASSEN-ERSATZ</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("Wo eine Lehrkraft beim Start landet (A6, 11.09.2026)", () => {
  it("Direktaufruf OHNE Verlaufs-State ⇒ „Meine Klassen“", async () => {
    useTypingAuth.setState({ account: baueLehrkraft() });
    zeige({ pathname: "/" });
    await waitFor(() => expect(screen.getByText("MEINE-KLASSEN-ERSATZ")).toBeTruthy());
    cleanup();
  });

  it("„Selbst üben“ (State an der Navigation) ⇒ bleibt im Üben", async () => {
    useTypingAuth.setState({ account: baueLehrkraft() });
    zeige({ pathname: "/", state: { selbstUeben: true } });
    await screen.findByRole("heading", { name: /Mein Training/i });
    expect(screen.queryByText("MEINE-KLASSEN-ERSATZ")).toBeNull();
    cleanup();
  });

  it("Neuladen desselben Eintrags (State bleibt erhalten) ⇒ bleibt im Üben", async () => {
    // ★ Ein echtes `location.reload()` gibt es in jsdom nicht - dieselbe
    // Sache liegt aber vor, sooft der Verlaufseintrag SAMT State erneut
    // gelesen wird (genau das tut der Browser bei einem Neuladen: er
    // verwirft nichts, `history.state` bleibt). Zwei unabhängige Aufbauten
    // desselben Eintrags stehen darum für „einmal geöffnet, einmal neu
    // geladen".
    const lehrkraft = baueLehrkraft();
    useTypingAuth.setState({ account: lehrkraft });
    zeige({ pathname: "/", state: { selbstUeben: true } });
    await screen.findByRole("heading", { name: /Mein Training/i });
    cleanup();

    useTypingAuth.setState({ account: lehrkraft });
    zeige({ pathname: "/", state: { selbstUeben: true } });
    await screen.findByRole("heading", { name: /Mein Training/i });
    expect(screen.queryByText("MEINE-KLASSEN-ERSATZ")).toBeNull();
    cleanup();
  });

  it("danach die Adresse neu eingegeben (kein State mehr) ⇒ wieder „Meine Klassen“", async () => {
    // Der Fall, den der Befund vom 11.09.2026 beschreibt: Wer einmal „Selbst
    // üben" gedrückt hat und DANACH die Adresse neu aufruft (neuer
    // Verlaufseintrag, kein State), darf nicht mehr im Üben landen.
    const lehrkraft = baueLehrkraft();
    useTypingAuth.setState({ account: lehrkraft });
    zeige({ pathname: "/", state: { selbstUeben: true } });
    await screen.findByRole("heading", { name: /Mein Training/i });
    cleanup();

    useTypingAuth.setState({ account: lehrkraft });
    zeige({ pathname: "/" });
    await waitFor(() => expect(screen.getByText("MEINE-KLASSEN-ERSATZ")).toBeTruthy());
    cleanup();
  });
});
