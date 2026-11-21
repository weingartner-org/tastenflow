/**
 * ★★★ WÄCHTER: „du" für alle Lernenden - „Sie" nur für Lehrkräfte (19.09.2026).
 * ===========================================================================
 * Johannes, 19.09.2026, wörtlich: *„Lehrer mit Sie ansprechen und Schüler und
 * Selbstlernende mit du"* - und auf die Nachfrage, ob auch erwachsene
 * Selbstlernende ab 16 „du" lesen sollen: *„ja"*.
 *
 * Bis dahin hing das „Sie" am ALTER (Profil `erwachsen` ab 16). Seither hängt
 * es an der ROLLE, entschieden an EINER Stelle: `anredeFuer` in
 * `src/lib/typing/skin.ts` (Bauteile lesen sie über `useAnrede()`). Der TON
 * der Erwachsenen bleibt - sachlich, ohne Jubel, ohne Maskottchen, ohne
 * Belohnungs-Spiel. Nur die Anrede wechselt.
 *
 * ★★★ WOHIN SICH DIESER WÄCHTER BEWEGT, WENN ES SCHLECHTER WIRD
 * ([[feedback_gruener_waechter_beweist_was]]):
 *  · Eine erwachsene Selbstlernende liest in Einrichtung, Rundgang, Hilfe,
 *    Merkfenster oder auf der Abschluss-Karte ein „Sie" - rot.
 *  · Eine Lehrkraft, die selbst übt, liest Rundgang, Abschluss-Karte oder
 *    Merkfenster per Du - rot.
 *  · Ein Gast, der ein Geburtsjahr ab 16 angibt, wird gesiezt - rot.
 *  · Der Erwachsenen-TON geht beim Duzen verloren (Kinder-/Jugendtext statt
 *    Erwachsenentext) - rot (Gegenprobe: die Erwachsenen-Marken unten).
 *  · Kinder- oder Jugendtexte ändern sich - rot.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

vi.mock("@/lib/typing/sound", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/typing/sound")>()),
  playBadgeSound: vi.fn(),
  playUnlockFanfare: vi.fn(),
  playKeySound: vi.fn(),
  playKeyTick: vi.fn(),
  playErrorSound: vi.fn(),
  playLineSound: vi.fn(),
  playSuccessSound: vi.fn(),
  playStarReward: vi.fn(),
  playStoryBadgeSound: vi.fn(),
}));

import { TippenTrainerPage } from "@/features/public/TippenTrainerPage";
import { TypingSession } from "@/components/typing/TypingSession";
import { TippenHilfe } from "@/components/typing/TippenHilfe";
import { uebenSchritte, rundgangSatz } from "@/components/typing/Rundgang";
import { useTypingAuth } from "@/components/typing/useTypingAuth";
import {
  UI_COPY,
  anredeFuer,
  bedienCopy,
  copyFor,
  isFormal,
  type TypingAccount,
} from "@/lib/typing";
import { addPupil, createClass, registerTeacher } from "@/lib/typing/account";
import {
  eigeneUebungAnkuendigung,
  grossschreibungFenster,
  umschaltFenster,
  wochenzielFenster,
} from "@/lib/typing/merkfensterTexte";
import { diaryText, zoneText, type PlayZone } from "@/lib/typing/expedition/texts";
import { useRundgangWunsch } from "@/lib/typing/rundgang";
import { einrichtungFertigMerken } from "@/lib/typing/einrichtung";
import { BedienSpracheProvider } from "@/lib/bedienSprache";
import { ohneBildschirmTastatur } from "./_typing-probelauf";

// ---------------------------------------------------------------------------
// Helfer
// ---------------------------------------------------------------------------

/**
 * Woran eine Sie-ANREDE erkannt wird. Bewusst über Verbformen und
 * Possessiva, nicht über das blanke Wort „Sie": Das Pronomen am Satzanfang
 * („Sie zeigt, welche Taste …" - die Tastatur; „Sie wird gezeigt …" - die
 * Folge) ist keine Anrede und bleibt erlaubt. „Ihre Bedingung" in der Hilfe
 * meint die geheimen Abzeichen („ihre"), nicht die Person.
 */
const VERBEN = (
  "haben|können|müssen|sehen|tippen|finden|melden|sind|brauchen|bekommen|kommen|steigen|" +
  "schreiben|lesen|lernen|halten|drücken|suchen|mögen|hören|prägen|schließen|klicken|" +
  "nehmen|verwechseln|schaffen|erkennen"
)
  .split("|")
  // „tippen Sie" mitten im Satz UND „Tippen Sie" am Satzanfang.
  .map((w) => `[${w[0].toUpperCase()}${w[0]}]${w.slice(1)}`)
  .join("|");
const SIE_ANREDE = new RegExp(
  `\\b(Sie (${VERBEN})\\b|(${VERBEN}) Sie\\b|Ihnen\\b|Ihr(e[mnrs]?)?\\b(?! Bedingung))`,
);
const DU_ANREDE = /\b(du|dein|deine|deinen|deinem|deiner|dir|dich)\b/i;

/** Eine Lehrkraft, die sich nach dem Stichtag angemeldet hat (kein „Was gibt's Neues"). */
function neueLehrkraft(): TypingAccount {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-09-20T10:00:00+02:00"));
  const t = registerTeacher("Herr Adam", `adam-${Math.random()}@example.org`, "geheim123");
  vi.useRealTimers();
  if (!t.ok) throw new Error(t.error);
  return t.value;
}

/**
 * Eine ERWACHSENE SELBSTLERNENDE (Jahrgang 1990): eigenes Konto, keine
 * Klasse, keine Stufe von Hand - die Stufe wächst aus dem Geburtsjahr
 * (`stufeFuer` ⇒ `erwachsen`). Angelegt über das Mock-Backend, damit
 * Spielstand und Rundgang-Merker ein echtes Konto finden.
 */
function erwachseneSelbstlernende(): TypingAccount {
  const l = neueLehrkraft();
  const c = createClass(l.id, `sl-${Math.random().toString(36).slice(2, 6)}`, `S${Math.floor(Math.random() * 9000 + 1000)}`);
  if (!c.ok) throw new Error(c.error);
  const p = addPupil(c.value.code, "Eva", "pw1234");
  if (!p.ok) throw new Error(p.error);
  return {
    ...p.value,
    classCode: undefined,
    stufe: undefined,
    geburtsjahr: 1990,
    selfManaged: true,
    email: "eva@example.org",
    verified: true,
  };
}

function zeigeUeben(state?: unknown) {
  return render(
    <BedienSpracheProvider>
      <MemoryRouter initialEntries={[{ pathname: "/", state }]}>
        <Routes>
          <Route path="/" element={<TippenTrainerPage />} />
          <Route path="*" element={<div>ANDERSWO</div>} />
        </Routes>
      </MemoryRouter>
    </BedienSpracheProvider>,
  );
}

const einrichtung = (): HTMLElement | null =>
  document.getElementById("tippen-einrichtung-titel")?.closest("section") ?? null;
const uebungsfeld = () =>
  document.querySelector<HTMLTextAreaElement>('[data-typing-field="practice"]')!;
const rundgang = () => screen.findByRole("region", { name: "Rundgang" }, { timeout: 5000 });
const zaehler = (region: HTMLElement) => region.querySelector("span")?.textContent ?? "";

/** Geht den ganzen Rundgang Schritt für Schritt durch (Eingabe = Weiter) und sammelt jeden Text. */
async function alleSchritte(region: HTMLElement): Promise<string[]> {
  const von = Number(zaehler(region).match(/von (\d+)/)?.[1] ?? "0");
  expect(von).toBeGreaterThanOrEqual(3);
  const texte: string[] = [];
  for (let nr = 1; nr <= von; nr++) {
    await waitFor(() => expect(zaehler(region)).toMatch(new RegExp(`^Rundgang ${nr} `)));
    texte.push(region.textContent ?? "");
    if (nr < von) fireEvent.keyDown(uebungsfeld(), { key: "Enter", code: "Enter" });
  }
  return texte;
}

/** Eine Runde mit einer einzigen Zeile - für Abschluss-Karte und Merkfenster. */
function runde(items: string[], stufe: "kids" | "teens" | "erwachsen") {
  render(
    <TypingSession
      items={items}
      contextId="anrede"
      unlocked={new Set(["a", "b", "c", "d"])}
      shiftLearned={false}
      stufe={stufe}
      voiceEnabled={false}
      onRetry={vi.fn()}
      zeilenPauseMs={50}
    />,
  );
  return screen.getByRole("textbox") as HTMLTextAreaElement;
}

function tippe(feld: HTMLElement, tasten: string) {
  for (const key of tasten) fireEvent.keyDown(feld, { key });
}

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  useTypingAuth.setState({ account: null });
  useRundgangWunsch.setState({ wunsch: null });
  ohneBildschirmTastatur();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  useTypingAuth.setState({ account: null });
  useRundgangWunsch.setState({ wunsch: null });
  document.body.style.overflow = "";
});

// ---------------------------------------------------------------------------
// 1 · Die Regel - an EINER Stelle
// ---------------------------------------------------------------------------

describe("Die Regel: Sie hängt an der Rolle, nicht am Alter", () => {
  it("anredeFuer: nur die Lehrkraft wird gesiezt", () => {
    expect(anredeFuer(null)).toBe("du"); // Gast
    expect(anredeFuer(undefined)).toBe("du");
    expect(anredeFuer({ role: "schueler" })).toBe("du"); // Kind einer Klasse
    expect(anredeFuer({ role: "schueler", selfManaged: true } as TypingAccount)).toBe("du"); // selbstlernend
    expect(anredeFuer({ role: "lehrkraft" })).toBe("Sie");
  });

  it("isFormal: Sie nur im Erwachsenen-Ton UND nur für die Lehrkraft", () => {
    expect(isFormal("erwachsen", "du")).toBe(false);
    expect(isFormal("erwachsen", "Sie")).toBe(true);
    // Kinder- und Jugendtexte gibt es nur per Du - auch für eine Lehrkraft.
    expect(isFormal("kind", "Sie")).toBe(false);
    expect(isFormal("jugend", "Sie")).toBe(false);
  });

  it("die Oberflächen-Texte ab 16: per Du, und der TON bleibt der der Erwachsenen", () => {
    const du = copyFor("erwachsen");
    const sie = copyFor("erwachsen", "Sie");
    expect(du.subtitle).toContain("In deinem Tempo");
    expect(du.locked).toBe("Diese Lektion ist noch gesperrt. Schließ zuerst die vorige ab.");
    expect(du.summaryRemark(3)).toBe("Deine Finger wissen, was sie tun.");
    expect(sie.subtitle).toContain("In Ihrem Tempo");
    expect(sie.summaryRemark(3)).toBe("Ihre Finger wissen, was sie tun.");
    // Ton: dieselben trockenen Worte in beiden Fassungen - und nicht die der Jugend.
    for (const n of [0, 1, 2, 3]) {
      expect(sie.summaryTitle(n)).toBe(du.summaryTitle(n));
      expect(sie.starsSpoken(n)).toBe(du.starsSpoken(n));
    }
    expect(du.xpUnit).toBe("Punkte");
    expect(du.retry).toBe("Noch einmal");
    expect(du.summaryTitle(1)).toBe("Abschnitt geschafft.");
    expect(UI_COPY.jugend.summaryTitle(1)).toBe("Runde geschafft.");
    // Englisch kennt kein Du/Sie - unverändert.
    expect(bedienCopy("erwachsen", "en", "Sie")).toBe(bedienCopy("erwachsen", "en", "du"));
  });

  it("★★ Grundmenge: kein einziger Erwachsenen-Text für Lernende trägt noch ein Sie", () => {
    const texte: [string, string][] = [];
    const c = copyFor("erwachsen");
    texte.push(["subtitle", c.subtitle], ["locked", c.locked]);
    for (const n of [0, 1, 2, 3]) texte.push([`summary ${n}`, `${c.summaryTitle(n)} ${c.summaryRemark(n)}`]);
    for (const f of [
      grossschreibungFenster("erwachsen"),
      wochenzielFenster("erwachsen"),
      eigeneUebungAnkuendigung("erwachsen"),
      umschaltFenster("großes A", "links", "erwachsen"),
    ])
      texte.push([f.titel, [f.titel, ...f.absaetze].join(" ")]);
    for (const wer of ["gast", "klassenkind", "selbstlernend"] as const)
      for (const s of uebenSchritte("de", "erwachsen", wer, "du")) texte.push([`Rundgang ${wer}`, rundgangSatz(s)]);
    const zonen: PlayZone[] = ["water", "climb", "slide", "cave", "storm", "station"];
    for (const z of zonen) {
      const d = diaryText(z, true);
      const t = zoneText(z);
      texte.push([`Tagebuch ${z}`, `${d.task} ${d.example}`], [`Zone ${z}`, t.introAdult("F", true)]);
    }
    // Grundmenge ausweisen (Regel 12) - ein leerer Lauf beweist nichts.
    console.log(`[anrede-du] geprüfte Erwachsenen-Texte: ${texte.length}`);
    expect(texte.length).toBeGreaterThan(30);
    const funde = texte.filter(([, t]) => SIE_ANREDE.test(t)).map(([w, t]) => `${w}: ${t}`);
    expect(funde, funde.join("\n")).toEqual([]);
    // Gegenprobe: das Muster findet die Sie-Fassungen der Lehrkraft.
    expect(SIE_ANREDE.test(grossschreibungFenster("erwachsen", "de", "Sie").absaetze.join(" "))).toBe(true);
    expect(SIE_ANREDE.test(copyFor("erwachsen", "Sie").summaryRemark(3))).toBe(true);
    expect(SIE_ANREDE.test(uebenSchritte("de", "erwachsen", "lehrkraft", "Sie").map(rundgangSatz).join(" "))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 2 · Erwachsene Selbstlernende (ab 16)
// ---------------------------------------------------------------------------

describe("Erwachsene Selbstlernende lesen „du“", () => {
  it("★★★ Einrichtung, Rundgang und Hilfe auf der Übungsseite - per Du, im Erwachsenen-Ton", async () => {
    const eva = erwachseneSelbstlernende();
    useTypingAuth.setState({ account: eva });
    zeigeUeben();

    // Die Einrichtung (frisches Gerät).
    await waitFor(() => expect(einrichtung()).toBeTruthy(), { timeout: 5000 });
    const einr = einrichtung()!.textContent ?? "";
    expect(einr).toContain("auf dich ein");
    expect(einr).not.toMatch(SIE_ANREDE);
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(einrichtung()).toBeNull());

    // Der Rundgang - alle Schritte.
    const region = await rundgang();
    const schritte = await alleSchritte(region);
    const alles = schritte.join(" ");
    expect(alles).toContain("Hier tippst du den Text ab");
    expect(alles).toMatch(DU_ANREDE);
    expect(alles).not.toMatch(SIE_ANREDE);
    // Der Erwachsenen-Ton ist geblieben: die Erwachsenen-Fassung des Konto-Schritts.
    expect(alles).toContain("Dein Konto");
    expect(alles).toContain("„Meine Statistik\" (Alt + S), deine Nachrichten");
    expect(alles).not.toContain("mit deinen Abzeichen");
    fireEvent.keyDown(uebungsfeld(), { key: "Escape", code: "Escape" });
    await waitFor(() => expect(screen.queryByRole("region", { name: "Rundgang" })).toBeNull());

    // Die Hilfe.
    fireEvent.click(screen.getByRole("button", { name: /^Hilfe/ }));
    const hilfe = await screen.findByRole("dialog", { name: "Hilfe zu Tastenflow" });
    const h = hilfe.textContent ?? "";
    expect(h).toContain("Tippe einfach los");
    expect(h).toContain("Du musst das Feld nicht erst auswählen");
    expect(h).not.toMatch(SIE_ANREDE);
    // Ton der Erwachsenen: kein Spiel-Abschnitt.
    expect(h).not.toContain("Eisschollen-Spiel");
  });

  it("★★★ Abschluss-Karte: „Deine Finger wissen, was sie tun.“ - trocken, per Du", async () => {
    useTypingAuth.setState({ account: erwachseneSelbstlernende() });
    const feld = runde(["ab"], "erwachsen");
    tippe(feld, "ab");
    expect(await screen.findByText("Sauber getippt.", undefined, { timeout: 3000 })).toBeTruthy();
    expect(screen.getByText("Deine Finger wissen, was sie tun.")).toBeTruthy();
    expect(screen.queryByText("Ihre Finger wissen, was sie tun.")).toBeNull();
  });

  it("★★★ Merkfenster (Grossschreibung): „Die Umschalttaste brauchst du noch nicht.“", async () => {
    useTypingAuth.setState({ account: erwachseneSelbstlernende() });
    const feld = runde(["aBcd"], "erwachsen");
    tippe(feld, "a");
    const fenster = await screen.findByRole("dialog", { name: /Gross geschrieben/ }, { timeout: 3000 });
    const text = fenster.textContent ?? "";
    expect(text).toContain("Die Umschalttaste brauchst du noch nicht.");
    // Erwachsenen-Ton: die sachliche dritte Zeile, nicht die der Kinder.
    expect(text).toContain("kommt später als eigene Taste dazu");
    expect(text).not.toMatch(SIE_ANREDE);
  });

  it("Gast mit Geburtsjahr ab 16: Rundgang per Du, im Erwachsenen-Ton", async () => {
    zeigeUeben();
    await waitFor(() => expect(einrichtung()).toBeTruthy(), { timeout: 5000 });
    // Schritt 1 → „Für wen sind die Texte?": Geburtsjahr eintragen.
    fireEvent.click(within(einrichtung()!).getByRole("button", { name: "Los geht's" }));
    const jahr = await waitFor(() => {
      const el = document.getElementById("tt-einr-jahr");
      expect(el).toBeTruthy();
      return el as HTMLInputElement;
    });
    fireEvent.change(jahr, { target: { value: "1990" } });
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(einrichtung()).toBeNull());

    const region = await rundgang();
    const alles = (await alleSchritte(region)).join(" ");
    expect(alles).toContain("Hier tippst du den Text ab");
    expect(alles).toContain("Hier meldest du dich an");
    expect(alles).not.toMatch(SIE_ANREDE);
    // Gegenprobe, dass die Stufe wirklich „ab 16" ist: die Erwachsenen-Fassung
    // der Werkzeuge nennt „Farben und Kontrast" - Kinder und Jugend nicht.
    expect(alles).toContain("Farben und Kontrast (Alt + K)");
  });
});

// ---------------------------------------------------------------------------
// 3 · Die Lehrkraft übt selbst - bleibt beim Sie
// ---------------------------------------------------------------------------

describe("Die Lehrkraft, die selbst übt, liest weiter „Sie“", () => {
  it("★★★ Rundgang auf der Übungsseite („Selbst üben“) - per Sie", async () => {
    einrichtungFertigMerken();
    useTypingAuth.setState({ account: neueLehrkraft() });
    useRundgangWunsch.setState({ wunsch: "ueben" });
    zeigeUeben({ selbstUeben: true });
    const region = await rundgang();
    const alles = (await alleSchritte(region)).join(" ");
    expect(alles).toContain("Hier tippen Sie den Text ab");
    expect(alles).toContain("Ihr Stand");
    expect(alles).toMatch(SIE_ANREDE);
    expect(alles).not.toMatch(/\b(du|dein|deine|dir)\b/);
    expect(screen.queryByText("ANDERSWO")).toBeNull();
  });

  it("★★★ Abschluss-Karte und Merkfenster mit der Textstufe „ab 16“ - per Sie", async () => {
    useTypingAuth.setState({ account: neueLehrkraft() });
    const feld = runde(["ab"], "erwachsen");
    tippe(feld, "ab");
    expect(await screen.findByText("Ihre Finger wissen, was sie tun.", undefined, { timeout: 3000 })).toBeTruthy();
    cleanup();

    useTypingAuth.setState({ account: neueLehrkraft() });
    const feld2 = runde(["aBcd"], "erwachsen");
    tippe(feld2, "a");
    const fenster = await screen.findByRole("dialog", { name: /Gross geschrieben/ }, { timeout: 3000 });
    expect(fenster.textContent).toContain("Die Umschalttaste brauchen Sie noch nicht.");
  });
});

// ---------------------------------------------------------------------------
// 4 · Kinder und Jugendliche - unverändert
// ---------------------------------------------------------------------------

describe("Kinder und Jugendliche: unverändert", () => {
  it("dieselben Texte - gleich, wer angemeldet ist", () => {
    for (const stufe of ["kids", "teens"] as const) {
      expect(copyFor(stufe, "Sie")).toBe(copyFor(stufe, "du"));
    }
    expect(copyFor("kids")).toBe(UI_COPY.kind);
    expect(copyFor("teens")).toBe(UI_COPY.jugend);
    for (const skin of ["kind", "jugend"] as const) {
      expect(grossschreibungFenster(skin, "de", "Sie")).toEqual(grossschreibungFenster(skin));
      expect(wochenzielFenster(skin, "de", "Sie")).toEqual(wochenzielFenster(skin));
      expect(eigeneUebungAnkuendigung(skin, "de", "Sie")).toEqual(eigeneUebungAnkuendigung(skin));
      for (const wer of ["gast", "klassenkind", "selbstlernend"] as const)
        expect(uebenSchritte("de", skin, wer, "Sie").map(rundgangSatz)).toEqual(
          uebenSchritte("de", skin, wer, "du").map(rundgangSatz),
        );
    }
    // Stichproben des bekannten Wortlauts.
    // ★ 29.10.2026: die Kinder-Karte wechselt ihre Titel (`rundenAbwechslung.ts`); Fassung 1 bei drei Sternen:
    expect(UI_COPY.kind.summaryTitle(3)).toBe("Drei Sterne geschafft!");
    expect(UI_COPY.kind.summaryTitle(1)).toBe("Runde geschafft!");
    expect(UI_COPY.jugend.summaryRemark(3)).toBe("Deine Finger wissen, was sie tun.");
    expect(grossschreibungFenster("kind").absaetze[2]).toBe(
      "Die Umschalttaste bekommst du später. Dann sagt dir die App Bescheid.",
    );
    expect(wochenzielFenster("jugend").absaetze[0]).toBe("Gratulation, du hast dein Wochenziel erreicht!");
  });

  it("die Hilfe für Kinder und Jugendliche bleibt per Du", () => {
    for (const stufe of ["kids", "teens"] as const) {
      render(<TippenHilfe open onClose={() => {}} stufe={stufe} />);
      const t = screen.getByRole("dialog", { name: "Hilfe zu Tastenflow" }).textContent ?? "";
      expect(t).toContain("Tippe einfach los");
      expect(t).not.toMatch(SIE_ANREDE);
      cleanup();
    }
  });

  it("die Abschluss-Karte der Kinder jubelt weiter", async () => {
    act(() => useTypingAuth.setState({ account: null }));
    const feld = runde(["ab"], "kids");
    tippe(feld, "ab");
    // ★ 29.10.2026: erste Runde auf frischem Gerät = Fassung 1 bei drei Sternen.
    expect(await screen.findByText("Drei Sterne geschafft!", undefined, { timeout: 3000 })).toBeTruthy();
  });
});
