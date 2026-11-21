/**
 * Wächter für die gemeinsame Kopfzeile aller vier Lernprogramme (09.08.2026).
 *
 * Johannes gab die Reihenfolge vor — sie ist der eigentliche Vertrag dieser
 * Datei, denn sie muss in JEDER App dieselbe sein ([[feedback_platform_parity]]):
 *
 *   Sensorik · App-Name … Hilfe · Kurztasten · Glocke · Konto · Farbe
 *
 * Dazu die zwei Dinge, die daran hängen: das Konto-Menü (Name und Klasse ganz
 * oben, darunter Statistik, Klasse, Abmelden) und der ersatzlos entfernte Link
 * „← Zur Lernwerkstatt" — er sprang mitten aus dem Üben aus dem Programm.
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AppKopfzeile, kontoZeile } from "../src/components/AppKopfzeile";
import { CONTRAST_MODES, contrastMuster, useContrast } from "../src/lib/contrast";
import { HINWEIS_EBENE, HINWEIS_EBENE_ID } from "../src/components/typing/Zeigerhinweis";

afterEach(cleanup);

const JANO = { id: "u1", name: "Jano", classCode: "5A3" };

function zeige(over: Partial<React.ComponentProps<typeof AppKopfzeile>> = {}) {
  return render(
    <MemoryRouter>
      <AppKopfzeile
        titel="Tastenflow"
        onHilfe={() => {}}
        onKurztasten={() => {}}
        account={JANO}
        onAbmelden={() => {}}
        onStatistik={() => {}}
        klasseHref="/lernwerkstatt/klasse?app=tippen"
        {...over}
      />
    </MemoryRouter>,
  );
}

describe("Kopfzeile — die Reihenfolge", () => {
  it("★ links Sensorik und der Programmname", () => {
    zeige();
    expect(
      screen.getByRole("link", { name: /Sensorik Lernplattform/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Tastenflow" })).toBeInTheDocument();
  });

  // ★ 20.09.2026: Kurztasten und Hilfe haben die Plätze getauscht (Johannes).
  // Der Test hielt vorher die umgekehrte Reihenfolge fest - beide Male war es
  // eine Vorgabe von ihm, die neue gilt. Die Reihenfolge wird hier bewusst
  // festgehalten: NEUN Seiten teilen sich diese Kopfzeile, und ihr ganzer
  // Sinn ist, dass die Schalter überall am selben Platz liegen. Verrutscht
  // einer, fällt dieser Test um, bevor es jemandem im Unterricht auffällt.
  it("★★ rechts: Kurztasten → Hilfe → Glocke → Konto → Farbe", () => {
    zeige();
    const nav = screen.getByRole("navigation", { name: "Werkzeuge" });
    const reihe = [...nav.querySelectorAll("button, select")].map(
      (el) =>
        el.getAttribute("aria-label") ??
        el.getAttribute("title") ??
        el.textContent ??
        "",
    );
    const platz = (teil: string) => reihe.findIndex((t) => t.includes(teil));
    expect(platz("Tastenkürzel")).toBeGreaterThanOrEqual(0);
    expect(platz("Tastenkürzel")).toBeLessThan(platz("Hilfe"));
    expect(platz("Hilfe")).toBeLessThan(platz("Mein Konto"));
    // Die Farbwahl steht ganz rechts, also als Letztes.
    expect(platz("Mein Konto")).toBeLessThan(reihe.length - 1);
  });

  it("ohne Anmeldung gibt es Glocke und Konto-Zeichen nicht, dafür den Konto-Kreis", () => {
    zeige({ account: null, onAnmelden: () => {} });
    expect(screen.queryByRole("button", { name: /Mein Konto/ })).toBeNull();
    // ★★ 30.08.2026: An derselben Stelle steht ein Kreis derselben Größe -
    // abgemeldet mit Männchen, angemeldet mit dem Anfangsbuchstaben. Der Knopf
    // wechselt beim An- und Abmelden also weder Form noch Breite; die Leiste
    // springt nicht mehr, und der Tab-Weg bleibt gleich lang.
    expect(screen.getByRole("button", { name: /^Konto/ })).toBeInTheDocument();
  });
});

describe("Kopfzeile — das Konto-Menü", () => {
  it("★ zeigt den ersten Buchstaben des Namens (bei Jano ein „J\")", () => {
    zeige();
    const knopf = screen.getByRole("button", { name: /Mein Konto/ });
    expect(knopf.textContent).toBe("J");
    expect(knopf.getAttribute("aria-expanded")).toBe("false");
  });

  it("★★ klappt Name und Klasse, Statistik, Klasse und Abmelden auf", () => {
    zeige();
    fireEvent.click(screen.getByRole("button", { name: /Mein Konto/ }));
    expect(screen.getByText("Jano, Klasse 5A3")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Meine Statistik" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Abmelden" })).toBeInTheDocument();
  });

  it("★ „Passwort ändern\" steht im Konto-Menü — nicht in der Statistik", () => {
    // Bis 10.08.2026 stand die Maske UNTEN IN DER STATISTIK; dort sucht sie
    // niemand (Johannes). Sie gehört zum Konto, also ins Konto-Menü.
    const onPasswort = vi.fn();
    zeige({ onPasswort });
    fireEvent.click(screen.getByRole("button", { name: /Mein Konto/ }));
    fireEvent.click(screen.getByRole("button", { name: "Passwort ändern" }));
    expect(onPasswort).toHaveBeenCalledTimes(1);
  });

  it("„Meine Klassen\" nur für Lehrkräfte — und dann ohne Statistik-Punkt", () => {
    zeige({
      account: { id: "t1", name: "Weingartner", istLehrkraft: true },
      onStatistik: undefined,
    });
    fireEvent.click(screen.getByRole("button", { name: /Mein Konto/ }));
    expect(screen.getByText("Weingartner (Lehrkraft)")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Meine Klassen" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Meine Statistik" })).toBeNull();
  });

  it("Escape schließt und gibt den Fokus an den Konto-Knopf zurück (K27)", async () => {
    vi.useFakeTimers();
    zeige();
    const knopf = screen.getByRole("button", { name: /Mein Konto/ });
    fireEvent.click(knopf);
    expect(screen.getByRole("button", { name: "Abmelden" })).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("button", { name: "Abmelden" })).toBeNull();
    // Nur den einen Fokus-Takt vorspulen — `runAllTimers` liefe in den
    // Minuten-Takt der Nachrichten-Glocke und damit ins Leere.
    vi.advanceTimersByTime(5);
    expect(document.activeElement).toBe(knopf);
    vi.useRealTimers();
  });

  it("ein Klick auf einen Punkt schließt die Liste und ruft ihn auf", () => {
    const onStatistik = vi.fn();
    zeige({ onStatistik });
    fireEvent.click(screen.getByRole("button", { name: /Mein Konto/ }));
    fireEvent.click(screen.getByRole("button", { name: "Meine Statistik" }));
    expect(onStatistik).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("button", { name: "Abmelden" })).toBeNull();
  });

  it("die Liste hängt am Konto-Knopf (aria-controls zeigt darauf)", () => {
    zeige();
    const knopf = screen.getByRole("button", { name: /Mein Konto/ });
    fireEvent.click(knopf);
    const id = knopf.getAttribute("aria-controls")!;
    const liste = document.getElementById(id)!;
    expect(within(liste).getByRole("button", { name: "Abmelden" })).toBeInTheDocument();
  });
});

/**
 * Das ⚙ ZAHNRAD in der Kopfzeile (Charge „SCHLANK", 22.08.2026).
 *
 * Vorher hatte jede App ihr eigenes: »im Griff« einen selbst gebauten Knopf im
 * `extra`-Slot ganz links, „Tastenflow" eines in einer eigenen grauen Leiste
 * UNTER der Kopfzeile. Jetzt zeichnet die Kopfzeile es — direkt links vom
 * Konto-Zeichen, in jeder App gleich.
 */
describe("Kopfzeile — das Zahnrad", () => {
  it("fehlt, solange die App keinen Einstellungs-Bereich hat", () => {
    zeige();
    expect(screen.queryByRole("button", { name: /Einstellungen/ })).toBeNull();
  });

  it("★★ steht direkt links vom Konto-Zeichen", () => {
    zeige({ onEinstellungen: () => {} });
    const nav = screen.getByRole("navigation", { name: "Werkzeuge" });
    const reihe = [...nav.querySelectorAll("button, select")].map(
      (el) => el.getAttribute("aria-label") ?? el.getAttribute("title") ?? el.textContent ?? "",
    );
    const platz = (teil: string) => reihe.findIndex((t) => t.includes(teil));
    expect(platz("Einstellungen")).toBeGreaterThanOrEqual(0);
    expect(platz("Einstellungen")).toBe(platz("Mein Konto") - 1);
  });

  it("★ nennt sein Kürzel im Namen und als aria-keyshortcuts", () => {
    zeige({ onEinstellungen: () => {} });
    const knopf = screen.getByRole("button", { name: /Einstellungen/ });
    expect(knopf.getAttribute("aria-label")).toBe("Einstellungen (Alt + O)");
    expect(knopf.getAttribute("aria-keyshortcuts")).toBe("Alt+O");
  });

  it("★ am Mac steht die Wahltaste im Namen - der ARIA-Wert bleibt Alt+O", () => {
    // `aria-keyshortcuts` erwartet den technischen Tastennamen; »im Griff«
    // reicht für die Beschriftung „Wahl + O" herein.
    zeige({ onEinstellungen: () => {}, einstellungenKuerzel: "Wahl + O" });
    const knopf = screen.getByRole("button", { name: /Einstellungen/ });
    expect(knopf.getAttribute("aria-label")).toBe("Einstellungen (Wahl + O)");
    expect(knopf.getAttribute("aria-keyshortcuts")).toBe("Alt+O");
  });

  it("★★ EIN Knopf, und sein Name hängt an keinem sichtbaren Wort", () => {
    // ★ 25.08.2026: Wird es eng, tragen Hilfe, Kurztasten, Einstellungen und
    // Anmelden nur noch ihr Zeichen (gemessen, siehe AppKopfzeile). Zwei
    // Knöpfe - einer je Breite - wären zwei Halte im Tab-Weg und zwei
    // Ansagen; es bleibt EINER.
    // ★★ 30.08.2026: Das Zahnrad trägt NIE mehr ein Wort - es ist in beiden
    // Fassungen ein runder Sinnbild-Knopf. Der Wächter prüft darum die Regel,
    // an der es wirklich hängt: Der NAME kommt aus `aria-label` und aus keinem
    // sichtbaren Text; sonst hieße der Knopf, seit das Wort weg ist, gar nichts.
    zeige({ onEinstellungen: () => {} });
    const alle = screen.getAllByRole("button", { name: /Einstellungen/ });
    expect(alle).toHaveLength(1);
    expect(alle[0].getAttribute("aria-label")).toBe("Einstellungen (Alt + O)");
    expect(alle[0].textContent).toBe("");
    // Und das Sinnbild ist ein SVG in der Textfarbe, kein Emoji: Ein `⚙` malt
    // sich in seiner eigenen Farbe und ignoriert alle sieben Kontrastmodi
    // (gemessen 30.08.2026 - „Gelb auf Blau" kam auf 2,05:1, WCAG 1.4.11
    // verlangt 3:1).
    const zeichen = alle[0].querySelector("svg")!;
    expect(zeichen).not.toBeNull();
    expect(zeichen.getAttribute("stroke")).toBe("currentColor");
    expect(zeichen.getAttribute("aria-hidden")).toBe("true");
  });

  it("★★ jeder wortlose Knopf trägt einen Hinweis, der auch bei FOKUS erscheint", () => {
    // ★ 30.08.2026: Der native `title` ist für die Tastatur taub - kein Browser
    // zeigt ihn beim Hineintabben. Seit Hilfe und Einstellungen ihr Wort
    // verloren haben, ist der Hinweis die einzige sichtbare Beschriftung.
    // Er hängt an `aria-describedby` (eine ZWEITE Auskunft), nie am Namen, und
    // der `title` ist an denselben Knöpfen ersatzlos weg - beides zusammen
    // läse eine Sprachausgabe doppelt vor.
    zeige({ onEinstellungen: () => {} });
    for (const name of [/^Hilfe in einfacher Sprache/, /^Einstellungen/, /^Mein Konto/]) {
      const knopf = screen.getByRole("button", { name });
      expect(knopf.getAttribute("title"), String(name)).toBeNull();
      const id = knopf.getAttribute("aria-describedby");
      expect(id, String(name)).toBeTruthy();
      const hinweis = document.getElementById(id!)!;
      expect(hinweis.getAttribute("role")).toBe("tooltip");
      expect(hinweis.textContent?.length).toBeGreaterThan(0);
    }
  });

  it("★ dasselbe gilt für Hilfe, Kurztasten und Anmelden", () => {
    zeige({ account: null, onAnmelden: () => {} });
    expect(
      screen.getByRole("button", { name: /^Hilfe in einfacher Sprache/ }),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: /^Kurztasten/ })).toBeTruthy();
    // ★★ 30.08.2026: Der Knopf ist ein Kreis mit Männchen und heißt nur noch
    // „Konto" (Johannes: „Konto alleine reicht") - der Name deckt beide
    // Zustände, abgemeldet wie angemeldet. Sichtbaren Text hat er keinen mehr;
    // die einzige sichtbare Auskunft ist der `Tipp`.
    expect(screen.getByRole("button", { name: /^Konto/ })).toBeTruthy();
  });

  it("★★ Aufklappbereich: aria-expanded + aria-controls, kein Dialog-Versprechen", () => {
    const onEinstellungen = vi.fn();
    zeige({
      onEinstellungen,
      einstellungenOffen: false,
      einstellungenControls: "tippen-einstellungen",
    });
    const knopf = screen.getByRole("button", { name: /Einstellungen/ });
    expect(knopf.getAttribute("aria-expanded")).toBe("false");
    expect(knopf.getAttribute("aria-controls")).toBe("tippen-einstellungen");
    expect(knopf.getAttribute("aria-haspopup")).toBeNull();
    fireEvent.click(knopf);
    expect(onEinstellungen).toHaveBeenCalledTimes(1);
    cleanup();
    zeige({ onEinstellungen, einstellungenOffen: true, einstellungenControls: "x" });
    expect(
      screen.getByRole("button", { name: /Einstellungen/ }).getAttribute("aria-expanded"),
    ).toBe("true");
  });

  it("★★ Fenster (»im Griff«): aria-haspopup=dialog statt aria-expanded", () => {
    zeige({ onEinstellungen: () => {} });
    const knopf = screen.getByRole("button", { name: /Einstellungen/ });
    expect(knopf.getAttribute("aria-haspopup")).toBe("dialog");
    expect(knopf.getAttribute("aria-expanded")).toBeNull();
    expect(knopf.getAttribute("aria-controls")).toBeNull();
  });
});

describe("kontoZeile — überall derselbe Wortlaut", () => {
  it("Kind mit Klasse, Kind ohne Klasse, Lehrkraft", () => {
    expect(kontoZeile(JANO)).toBe("Jano, Klasse 5A3");
    expect(kontoZeile({ id: "x", name: "Mia" })).toBe("Mia");
    expect(kontoZeile({ id: "y", name: "Weingartner", istLehrkraft: true })).toBe(
      "Weingartner (Lehrkraft)",
    );
  });
});

/* ═══════════════════════════════════════════════════════════════════════════
 * DIE ZWEI SCHALTER RECHTS — Farbe und Vorlesen (30.08.2026, Johannes)
 * ═══════════════════════════════════════════════════════════════════════════
 * Sie stehen als Gruppe, abgesetzt von den Türen: Hilfe, Kurztasten, Glocke,
 * Einstellungen und Konto ÖFFNEN etwas, diese beiden ÄNDERN SOFORT etwas.
 */
describe("Kopfzeile — der Farbschalter", () => {
  it("★★ ersetzt das Auswahlfeld: ein runder Knopf, der eine Liste aufklappt", () => {
    zeige();
    // Kein <select> mehr in der Werkzeug-Reihe - `ThemeToggle` selbst bleibt
    // unverändert und steckt weiter in 14 Dateien außerhalb der Kopfzeile.
    const nav = screen.getByRole("navigation", { name: "Werkzeuge" });
    expect(nav.querySelector("select")).toBeNull();
    const knopf = screen.getByRole("button", { name: /^Farben und Kontrast/ });
    expect(knopf.getAttribute("aria-expanded")).toBe("false");
    expect(knopf.getAttribute("aria-keyshortcuts")).toBe("Alt+K");
  });

  it("★★★ jeder Eintrag trägt ein Muster IN SEINEN EIGENEN FARBEN", () => {
    // Das ist der Punkt der ganzen Übung: Ein Kind mit Sehrest soll „Gelb auf
    // Blau" SEHEN und nicht aus dem Namen erraten. Die Werte kommen aus
    // derselben Palette, die der Modus später auf die Seite legt.
    zeige();
    fireEvent.click(screen.getByRole("button", { name: /^Farben und Kontrast/ }));
    for (const m of CONTRAST_MODES) {
      // Der zugängliche Name ist genau das Wort: Muster und Häkchen sind
      // `aria-hidden` und zählen nicht mit.
      const eintrag = screen.getByRole("button", { name: m.label });
      const muster = eintrag.querySelector<HTMLElement>("span[aria-hidden='true']")!;
      const soll = contrastMuster(m.id);
      expect(muster.style.backgroundColor, m.label).toBe(`rgb(${soll.grund.replace(/ /g, ", ")})`);
      expect(muster.style.color, m.label).toBe(`rgb(${soll.schrift.replace(/ /g, ", ")})`);
      // Und das Wort steht daneben - das Muster allein wäre für ein Kind mit
      // Blindheit nichts.
      expect(eintrag.textContent).toContain(m.label);
    }
  });

  it("★★ der aktive Modus ist nicht nur farblich erkennbar (aria-current)", () => {
    zeige();
    fireEvent.click(screen.getByRole("button", { name: /^Farben und Kontrast/ }));
    const hell = screen.getByRole("button", { name: /^Hell \(Standard\)/ });
    expect(hell.getAttribute("aria-current")).toBe("true");
    const dunkel = screen.getByRole("button", { name: /^Dunkel/ });
    expect(dunkel.getAttribute("aria-current")).toBeNull();
    fireEvent.click(dunkel);
    expect(useContrast.getState().mode).toBe("dunkel");
    // Zurück auf Hell, damit der nächste Test nicht im Dunkeln startet.
    useContrast.getState().setMode("hell");
  });

  it("★★ Alt + K klappt auf und wieder zu - wie Alt + J beim Konto", () => {
    zeige();
    const knopf = screen.getByRole("button", { name: /^Farben und Kontrast/ });
    fireEvent.keyDown(document, { key: "k", code: "KeyK", altKey: true });
    expect(knopf.getAttribute("aria-expanded")).toBe("true");
    fireEvent.keyDown(document, { key: "k", code: "KeyK", altKey: true });
    expect(knopf.getAttribute("aria-expanded")).toBe("false");
  });

  it("★★★ tritt zurück, wo eine Seite die Taste schon für sich beansprucht", () => {
    // ⚠️ In Klangpunkte und Punktgenau sitzt auf Alt + K noch die Kapitelwahl
    // (offen, wartet auf Johannes). Beide rufen `preventDefault()`; dieser
    // Handler hört darum am `window` - hinter allen `document`-Wächtern - und
    // lässt die Taste dann liegen. Sonst spränge Alt + K dort in die
    // Kapitelwahl UND klappte die Farben auf.
    zeige();
    const knopf = screen.getByRole("button", { name: /^Farben und Kontrast/ });
    const seite = (e: KeyboardEvent) => {
      if (e.altKey && e.code === "KeyK") e.preventDefault();
    };
    document.addEventListener("keydown", seite);
    try {
      fireEvent.keyDown(document, { key: "k", code: "KeyK", altKey: true });
      expect(knopf.getAttribute("aria-expanded")).toBe("false");
    } finally {
      document.removeEventListener("keydown", seite);
    }
  });

  it("★ schweigt, solange ein modaler Dialog offen ist", () => {
    zeige();
    const dialog = document.createElement("div");
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    document.body.appendChild(dialog);
    try {
      fireEvent.keyDown(document, { key: "k", code: "KeyK", altKey: true });
      expect(
        screen.getByRole("button", { name: /^Farben und Kontrast/ }).getAttribute("aria-expanded"),
      ).toBe("false");
    } finally {
      dialog.remove();
    }
  });
});

describe("Kopfzeile — der Vorlese-Schalter", () => {
  it("fehlt, solange die App keine Sprachausgabe hereinreicht", () => {
    zeige();
    expect(screen.queryByRole("button", { name: /^Vorlesen/ })).toBeNull();
  });

  it("★★ meldet seinen Zustand über aria-pressed und ruft den Weg der App", () => {
    // ⚠️ EIN Zustand, drei Türen: Der Knopf hält nichts selbst fest, er meldet
    // den Druck an die App (dort `useVoice`) - wie Alt + V und das Zahnrad.
    const onVorlesen = vi.fn();
    zeige({ onVorlesen, vorlesenAn: false });
    const knopf = screen.getByRole("button", { name: /^Vorlesen/ });
    expect(knopf.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(knopf);
    expect(onVorlesen).toHaveBeenCalledTimes(1);
    cleanup();
    zeige({ onVorlesen, vorlesenAn: true });
    expect(
      screen.getByRole("button", { name: /^Vorlesen/ }).getAttribute("aria-pressed"),
    ).toBe("true");
  });

  it("★★ die beiden Schalter stehen als GRUPPE hinter den Türen", () => {
    zeige({ onEinstellungen: () => {}, onVorlesen: () => {}, vorlesenAn: false });
    const nav = screen.getByRole("navigation", { name: "Werkzeuge" });
    const reihe = [...nav.querySelectorAll("button")].map(
      (el) => el.getAttribute("aria-label") ?? "",
    );
    const platz = (teil: string) => reihe.findIndex((t) => t.includes(teil));
    expect(platz("Mein Konto")).toBeLessThan(platz("Farben und Kontrast"));
    expect(platz("Farben und Kontrast")).toBe(platz("Vorlesen") - 1);
    // Dazwischen der dünne Strich - reine Optik, darum aria-hidden.
    const strich = nav.querySelector("span[aria-hidden='true'].w-px");
    expect(strich).not.toBeNull();
  });

  /**
   * ★★★★★ DER KNOPF SAGT, WAS ER TUT - nicht, wie es gerade steht
   * (07.09.2026, gemeldet von den Schülerinnen und Schülern: *„der Sprache an
   * und Sprache aus Knopf sagt immer das Gegenteilige wie er tut, das ist
   * verwirrend"*).
   *
   * Am Live-Stand nachgesehen: Bei ausgeschaltetem Vorlesen stand
   * `aria-pressed="false"` am Knopf - und daneben, als einzige sichtbare
   * Beschriftung, „Vorlesen an". Zwei Klicks weiter, im Zahnrad, heissen genau
   * dieselben zwei Wörter das Gegenteil: Dort ist „Vorlesen an" der ZUSTAND.
   * Ein Screenreader las die Kopfzeile in einem Atemzug als
   * „nicht gedrückt … Vorlesen an."
   *
   * ⚠️ Geprüft wird auf das VERB, nicht auf einen festen Satz - daran hängt
   * die ganze Entscheidung (Johannes, 07.09.2026): Ein Verb kann kein Zustand
   * sein. Und geprüft wird zusätzlich, dass die Zustandsform NICHT dasteht;
   * sonst wäre der Wächter auch mit „Vorlesen an - einschalten" grün.
   *
   * ⚠️ Gilt für alle fünf Apps, die diese Kopfzeile tragen.
   */
  it("★★★★★ beschreibt die HANDLUNG, nicht den Zustand", () => {
    const hinweisZu = (knopf: HTMLElement) =>
      document.getElementById(knopf.getAttribute("aria-describedby") ?? "")?.textContent ?? "";

    zeige({ onVorlesen: () => {}, vorlesenAn: false });
    const aus = hinweisZu(screen.getByRole("button", { name: /^Vorlesen/ }));
    expect(aus).toMatch(/einschalten/);
    expect(aus, "„Vorlesen an\" ist der Zustand - der steht schon in aria-pressed").not.toMatch(
      /Vorlesen an\b/,
    );

    cleanup();
    zeige({ onVorlesen: () => {}, vorlesenAn: true });
    const an = hinweisZu(screen.getByRole("button", { name: /^Vorlesen/ }));
    expect(an).toMatch(/ausschalten/);
    expect(an).not.toMatch(/Vorlesen aus\b/);
  });
});

/* ═══════════════════════════════════════════════════════════════════════════
 * DER HINWEIS ERSCHEINT BEI FOKUS — nicht nur beim Mauszeiger
 * ═══════════════════════════════════════════════════════════════════════════
 * Gemessen am 30.08.2026: Der native `title` ist für die Tastatur taub. Seit
 * die Knöpfe ihr Wort verloren haben, ist der Hinweis die einzige sichtbare
 * Beschriftung - erschiene er nur unter dem Mauszeiger, stünde ein Kind mit
 * Sehrest an der Tastatur vor sechs runden Knöpfen ohne Auskunft.
 */
describe("Kopfzeile — der Hinweis (Tipp)", () => {
  function hinweisVon(knopf: HTMLElement): HTMLElement {
    return document.getElementById(knopf.getAttribute("aria-describedby")!)!;
  }

  it("★★★ FOKUS zeigt ihn - nicht erst der Mauszeiger", () => {
    zeige();
    const knopf = screen.getByRole("button", { name: /^Hilfe in einfacher Sprache/ });
    const hinweis = hinweisVon(knopf);
    expect(hinweis.className).toContain("invisible");
    // ⚠️ ECHTES `focus()`, nicht `fireEvent.focus`: Der Baustein sieht nach
    // JEDEM Rendern nach, wo der Fokus wirklich steht - `focusout` bleibt aus,
    // wenn das fokussierte Element aus dem Baum genommen wird (siehe Tipp.tsx).
    // Ein bloß gefeuertes Ereignis ohne bewegten Fokus wäre also ein Test gegen
    // einen Zustand, den es im Browser nicht gibt.
    // ⚠️ In `act(...)`: Ein rohes `focus()` löst zwar das Ereignis aus, React
    // verarbeitet den Zustandswechsel aber erst in einem Mikrotakt danach - die
    // Klasse stünde beim Nachlesen noch auf dem alten Stand.
    act(() => knopf.focus());
    expect(hinweis.className).toContain("visible");
    expect(hinweis.className).not.toContain("invisible");
    act(() => knopf.blur());
    expect(hinweis.className).toContain("invisible");
  });

  it("★★ und der Mauszeiger ebenso", () => {
    zeige();
    const knopf = screen.getByRole("button", { name: /^Hilfe in einfacher Sprache/ });
    const hinweis = hinweisVon(knopf);
    fireEvent.mouseEnter(knopf.parentElement!);
    expect(hinweis.className).toContain("visible");
    fireEvent.mouseLeave(knopf.parentElement!);
    expect(hinweis.className).toContain("invisible");
  });

  it("★★ er ist eine ZWEITE Auskunft, nicht der Name", () => {
    zeige();
    const knopf = screen.getByRole("button", { name: /^Hilfe in einfacher Sprache/ });
    // Der Name bleibt beim Knopf (WCAG 2.5.3), der Hinweis hängt an
    // `aria-describedby`. Ein `aria-labelledby` würde ihn zum Namen machen.
    expect(knopf.getAttribute("aria-labelledby")).toBeNull();
    expect(knopf.getAttribute("aria-label")).toBe("Hilfe in einfacher Sprache (Alt + H)");
    expect(hinweisVon(knopf).textContent).toBe("Hilfe (Alt + H)");
  });

  it("★★ Escape schickt ihn weg - und nur ihn, solange er offen ist", () => {
    zeige();
    const knopf = screen.getByRole("button", { name: /^Hilfe in einfacher Sprache/ });
    const hinweis = hinweisVon(knopf);
    // Geschlossen fasst der Baustein Escape gar nicht an: Der Horcher hängt
    // nur, solange der Hinweis zu sehen ist. Sonst verschluckte er das Escape
    // der ganzen Seite (in Tastenflow: zurück in die Eingabezeile).
    const seite = vi.fn();
    document.addEventListener("keydown", seite);
    try {
      fireEvent.keyDown(document, { key: "Escape" });
      expect(seite).toHaveBeenCalledTimes(1);
      act(() => knopf.focus());
      expect(hinweis.className).toContain("visible");
      fireEvent.keyDown(document, { key: "Escape" });
      expect(hinweis.className).toContain("invisible");
    } finally {
      document.removeEventListener("keydown", seite);
    }
  });

  it("★ er verschiebt nichts und liegt oben: fixed unter <body>, ohne Mausfang", () => {
    zeige();
    const knopf = screen.getByRole("button", { name: /^Hilfe in einfacher Sprache/ });
    const hinweis = hinweisVon(knopf);
    // ★ K1 (19.09.2026): Bis dahin `absolute z-30` in der Kopfzeile - und
    // damit unter jedem späteren `z-30` im DOM (gemessen: die klebenden
    // Tabellenköpfe). Jetzt hängt der Kasten per Portal in der Ebene unter
    // `<body>` und steht `fixed` am Knopf; ein `fixed`-Kasten schiebt die
    // Seite auch nicht waagrecht auf (Befund 24.08.2026 an dieser Kopfzeile).
    expect(hinweis.className).toContain("fixed");
    expect(hinweis.className).not.toContain("absolute");
    expect(hinweis.parentElement?.id).toBe(HINWEIS_EBENE_ID);
    expect(knopf.parentElement!.contains(hinweis)).toBe(false);
    expect(hinweis.className).toContain("pointer-events-none");
    expect(hinweis.className).toContain(`z-[${HINWEIS_EBENE}]`);
    // Die Vorgabe bleibt rechtsbündig - das Fenster hat das letzte Wort.
    expect(hinweis.getAttribute("data-ausrichtung")).toBe("rechts");
    // Keine Bewegung, wo sie nicht vertragen wird.
    expect(hinweis.className).toContain("motion-reduce:transition-none");
  });
});

/**
 * ════════════════════════════════════════════════════════════════════════════
 * „MELDEN" - WER IHN SIEHT UND WO (Johannes, 02.09.2026)
 * ════════════════════════════════════════════════════════════════════════════
 * *„ich brauche noch einen melden schalter bei allen selbst angemeldeten
 * lernenden, nicht bei schülern, nur bei benutzern die sich selbst mit
 * mailadresse angemeldet haben, bei lehrer gibt es das ja schon. und bei den
 * selbst angemeldeten gib den schalter bitte in das menü des benutzers
 * oberhalb von abmelden."*
 *
 * Drei Konten, drei verschiedene Antworten - und die vierte ist „gar nichts".
 * Ein Wächter, weil genau das leicht wieder zusammenrutscht: Vor dem 02.09.
 * stand der Schalter bei JEDEM angemeldeten Konto, also auch bei jedem Kind
 * einer Klasse.
 */
describe("Kopfzeile - Melden: wer ihn sieht und wo", () => {
  const LEHRKRAFT = { id: "l1", name: "Frau Wein", istLehrkraft: true };
  const SELBST = { id: "s1", name: "Mara", selbstlernend: true };

  /** Die Einträge des Konto-Menüs in ihrer Reihenfolge. */
  function menueOeffnenUndLesen() {
    fireEvent.click(screen.getByRole("button", { name: /Mein Konto/ }));
    const liste = screen.getByRole("button", { name: "Abmelden" }).parentElement!;
    return [...liste.querySelectorAll("button")].map((b) => b.textContent ?? "");
  }

  it.skip("★ Lehrkraft: der Schalter steht in der Werkzeug-Reihe", () => {
    zeige({ account: LEHRKRAFT });
    const nav = screen.getByRole("navigation", { name: "Werkzeuge" });
    expect(within(nav).getByRole("button", { name: "Melden" })).toBeInTheDocument();
  });

  it("★★ Selbstlernend: nicht in der Reihe, sondern im Menü unmittelbar über Abmelden", () => {
    zeige({ account: SELBST });
    const nav = screen.getByRole("navigation", { name: "Werkzeuge" });
    // In der Reihe steht er nicht - `queryAllBy`, weil der Menü-Eintrag
    // gleich heißt und die Reihe das Menü enthält, sobald es offen ist.
    expect(
      [...nav.children].some(
        (el) => el.textContent === "Melden" || el.querySelector("button")?.textContent === "Melden",
      ),
    ).toBe(false);

    const eintraege = menueOeffnenUndLesen();
    const melden = eintraege.findIndex((t) => t.includes("Melden") && !t.includes("Abmelden"));
    const abmelden = eintraege.findIndex((t) => t === "Abmelden");
    expect(melden).toBeGreaterThanOrEqual(0);
    // „oberhalb von abmelden" - und zwar UNMITTELBAR darüber.
    expect(melden).toBe(abmelden - 1);
  });

  it("★★★ Kind einer Klasse: nirgends - weder in der Reihe noch im Menü", () => {
    zeige({ account: JANO });
    expect(screen.queryByRole("button", { name: "Melden" })).toBeNull();
    const eintraege = menueOeffnenUndLesen();
    expect(eintraege.some((t) => t.includes("Melden") && !t.includes("Abmelden"))).toBe(false);
  });

  it("abgemeldet: gar nichts", () => {
    zeige({ account: null, onAnmelden: () => {} });
    expect(screen.queryByRole("button", { name: "Melden" })).toBeNull();
  });

  // ★ Lexami (Johannes 14.11.2026: „in der kopfzeile braucht die app wieder einen melden schalter"):
  // fast alle benutzen Lexami ohne Konto - mit `meldenOhneAnmeldung` steht der Schalter auch dann da.
  it.skip("★ meldenOhneAnmeldung: abgemeldet steht er in der Reihe und öffnet das Fenster", () => {
    zeige({ account: null, onAnmelden: () => {}, meldenOhneAnmeldung: true });
    const nav = screen.getByRole("navigation", { name: "Werkzeuge" });
    fireEvent.click(within(nav).getByRole("button", { name: "Melden" }));
    expect(screen.getByRole("dialog", { name: "Änderungswunsch oder Problem melden" })).toBeInTheDocument();
  });

  it("★★★ meldenOhneAnmeldung ändert nichts für ein Kind einer Klasse", () => {
    zeige({ account: JANO, meldenOhneAnmeldung: true });
    expect(screen.queryByRole("button", { name: "Melden" })).toBeNull();
  });

  // ★ Lexami (Johannes 17.11.2026: „auch schüler brauchen einen melden schalter mit screenshot!").
  it.skip("★ meldenFuerKinder: ein Kind einer Klasse bekommt den Knopf, er meldet mit Bild (wie Alt + Umschalt + P)", () => {
    const ereignis = vi.fn();
    window.addEventListener("melden-mit-bild", ereignis);
    zeige({ account: JANO, meldenOhneAnmeldung: true, meldenFuerKinder: true });
    fireEvent.click(screen.getByRole("button", { name: "Melden" }));
    expect(ereignis).toHaveBeenCalledTimes(1);
    window.removeEventListener("melden-mit-bild", ereignis);
  });

  it("★ meldenFuerKinder: Lehrkraft und Selbstlernende behalten ihren einen Weg - kein zweiter Knopf", () => {
    zeige({ account: SELBST, meldenFuerKinder: true });
    expect(screen.queryByRole("button", { name: "Melden" })).toBeNull();
  });

  it.skip("★★ der Menü-Eintrag öffnet das Fenster - und das Menü klappt dabei zu", () => {
    zeige({ account: SELBST });
    fireEvent.click(screen.getByRole("button", { name: /Mein Konto/ }));
    fireEvent.click(screen.getByRole("button", { name: "Melden" }));
    // Das Fenster steht (es lebt an der Kopfzeile, nicht im Menü - sonst
    // verschwände es mit ihm).
    expect(
      screen.getByRole("dialog", { name: "Änderungswunsch oder Problem melden" }),
    ).toBeInTheDocument();
    // Und das Menü ist weg.
    expect(screen.queryByRole("button", { name: "Abmelden" })).toBeNull();
  });
});
