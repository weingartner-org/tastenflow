/**
 * WÄCHTER: Die Tippchallenges in „Meine Klassen" und in „Meine Statistik"
 * (10.09.2026).
 *
 * Johannes, wörtlich:
 *  - *„am zeilenanfang sollen bei der Prüfung die sehenden nicht die Zeit
 *    sehen, nur für die braillezeile"*
 *  - *„es braucht eine neue spalte bei der Lehreransicht »meine Klassen« -
 *    »Tastchallenge« 3 / 82 ... die erste zahl ist die anzahl der chalenges und
 *    die zweite zahl ist der durchschnitswert der bewertung"*
 *  - *„bei jedem schüler (wen man ausklappt) sieht man dann genau an welchem
 *    Tag eine textchallenge war wie viele minuten, welches Level (tastatur),
 *    und alle 3 werte."*
 *  - *„das gleiche sehen auch die schüler in ihrer Statistik"*
 *  - *„vergiss nicht die mousover infos bei allen bereichen mitzudenken"*
 *
 * Gemessen wird an echten Ergebnissen aus `werteAus` im lokalen Speicher -
 * nicht an erfundenen Zahlen. Jede Zusicherung, die etwas „richtig" nennt,
 * hat eine Gegenprobe, die zeigt, dass der Test den Fehler sehen könnte.
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, within, cleanup, fireEvent } from "@testing-library/react";
import { TastenflowReiter } from "@/components/lernwerkstatt/klasse/TastenflowReiter";
import { SchreibprobenListe } from "@/components/typing/SchreibprobenListe";
import { SchreibprobeErgebnis } from "@/components/typing/SchreibprobeErgebnis";
import { TypingSession } from "@/components/typing/TypingSession";
import {
  HINWEIS_CHALLENGE,
  HINWEIS_TABELLE,
  PRUEFUNG_WORT,
  PRUEFUNG_WORT_MEHRZAHL,
  probenUebersicht,
  typingBackend,
  uebersichtSatz,
  werteAus,
  wertungVon,
  type Probenergebnis,
  type TypingAccount,
} from "@/lib/typing";
import { addPupil, createClass, listPupils, registerTeacher } from "@/lib/typing/account";

/** Ein echtes Ergebnis - durch dasselbe Rechenwerk wie beim Abgeben. */
function ergebnis(o: {
  zeichen: number;
  fehler: number;
  tag: number;
  minuten?: number;
  schreibMin?: number;
}): Probenergebnis {
  const beginn = new Date(2026, 8, o.tag, 10, 4).getTime();
  return werteAus({
    probeId: `sp-${o.tag}`,
    niveau: "buchstaben",
    textNr: 0,
    textTitel: "Der Igel",
    beginnMs: beginn,
    endeMs: beginn + (o.minuten ?? 5) * 60_000,
    zeitMs: (o.minuten ?? 5) * 60_000,
    zuschlagProzent: 0,
    wartezeitMs: 0,
    zeichen: o.zeichen,
    fehler: o.fehler,
    zeilen: 20,
    schreibMs: (o.schreibMin ?? 5) * 60_000,
    anschlaege: [],
    layout: "de",
    textZuEnde: false,
    frueherAbgegeben: false,
  });
}

/** Mia: drei Challenges, eine davon zu kurz für eine Wertung. */
const MIA = [
  ergebnis({ zeichen: 1072, fehler: 26, tag: 8 }),
  ergebnis({ zeichen: 818, fehler: 27, tag: 9, minuten: 8 }),
  ergebnis({ zeichen: 150, fehler: 40, tag: 10 }),
];
/** Noah: eine, sehr sicher und schnell. */
const NOAH = [ergebnis({ zeichen: 1200, fehler: 2, tag: 10, schreibMin: 4 })];

function baueKlasse(): TypingAccount[] {
  const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
  if (!t.ok) throw new Error(t.error);
  const c = createClass(t.value.id, "3b", "3B");
  if (!c.ok) throw new Error(c.error);
  for (const name of ["Mia", "Noah", "Lea"]) {
    const p = addPupil(c.value.code, name, "pw1234");
    if (!p.ok) throw new Error(p.error);
  }
  return listPupils(c.value.code);
}

let kinder: TypingAccount[] = [];
const kind = (name: string) => kinder.find((k) => k.name === name)!;

beforeEach(async () => {
  localStorage.clear();
  kinder = baueKlasse();
  const b = typingBackend();
  for (const e of MIA) await b.speichereProbenergebnis(kind("Mia"), e);
  for (const e of NOAH) await b.speichereProbenergebnis(kind("Noah"), e);
});
afterEach(cleanup);

/** Text eines Elements ohne seine (unsichtbaren) Hinweis-Kästen. */
function ohneHinweis(el: Element): string {
  const kopie = el.cloneNode(true) as HTMLElement;
  kopie.querySelectorAll('[role="tooltip"]').forEach((t) => t.remove());
  return (kopie.textContent || "").trim();
}

/** Der Hinweis, auf den ein Element mit `aria-describedby` zeigt. */
function hinweisVon(el: Element): string {
  const id = el.getAttribute("aria-describedby");
  expect(id, "kein aria-describedby - kein Hinweis").toBeTruthy();
  const kasten = document.getElementById(id!);
  expect(kasten, "der Hinweis zeigt ins Leere").toBeTruthy();
  expect(kasten!.getAttribute("role")).toBe("tooltip");
  return kasten!.textContent || "";
}

describe("★ Die Rechnung „3 / 82“", () => {
  it("zählt JEDE Challenge, mittelt nur die gewerteten", () => {
    const u = probenUebersicht(MIA);
    const gewertete = MIA.map(wertungVon).filter((w) => w.gewertet);
    expect(gewertete).toHaveLength(2);
    expect(u.anzahl).toBe(3);
    expect(u.gewertet).toBe(2);
    expect(u.schnitt).toBe(Math.round((gewertete[0].wert + gewertete[1].wert) / 2));
    // Gegenprobe: Mit der zu kurzen im Schnitt käme eine andere Zahl heraus -
    // sonst bewiese die Zusicherung oben nichts.
    const alle = MIA.map((e) => wertungVon(e).wert);
    expect(Math.round(alle.reduce((s, x) => s + x, 0) / 3)).not.toBe(u.schnitt);
  });

  it("ohne gewertete Challenge gibt es keinen Schnitt - und keine Null", () => {
    const u = probenUebersicht([MIA[2]]);
    expect(u).toEqual({ anzahl: 1, gewertet: 0, schnitt: null });
    expect(uebersichtSatz(u)).toBe(`1 ${PRUEFUNG_WORT}, noch ohne Leistungswert`);
    expect(uebersichtSatz(probenUebersicht([]))).toBe(`Noch keine ${PRUEFUNG_WORT}`);
  });
});

describe("★★★ Die Spalte in „Meine Klassen“", () => {
  async function zeige() {
    render(<TastenflowReiter pupils={kinder} onChanged={() => {}} />);
    return await screen.findByRole("table", { name: /Lernende der Klasse/ });
  }

  /** Die Zelle der Spalte „Tippchallenge" in der Zeile eines Kindes. */
  function zelle(tisch: HTMLElement, name: string): HTMLElement {
    // ⚠️ Die LETZTE Kopfzeile - seit B2 (11.09.2026) steht darüber eine
    // Gruppenzeile („Üben", „Prüfung"), deren Zellen ebenfalls
    // `columnheader` sind und jeden Spaltenindex verschöben.
    const letzte = [...tisch.querySelectorAll("thead tr")].pop() as HTMLElement;
    const koepfe = within(letzte).getAllByRole("columnheader").map(ohneHinweis);
    const i = koepfe.indexOf(PRUEFUNG_WORT);
    expect(i, "die Spalte gibt es nicht").toBeGreaterThan(-1);
    const zeile = within(tisch)
      .getAllByRole("row")
      .find((r) => within(r).queryByRole("rowheader")?.textContent?.includes(name));
    return zeile!.children[i] as HTMLElement;
  }

  it("zeigt Anzahl / Schnitt, für die Sprachausgabe als Satz", async () => {
    const tisch = await zeige();
    const u = probenUebersicht(MIA);
    await screen.findByText(`3 / ${u.schnitt}`);
    const mia = zelle(tisch, "Mia");
    expect(mia.querySelector('[aria-hidden="true"]')?.textContent).toBe(`3 / ${u.schnitt}`);
    expect(mia.textContent).toContain(uebersichtSatz(u));
    // Ein Kind ohne Challenge: ein Strich, kein „0 / 0".
    expect(zelle(tisch, "Lea").querySelector('[aria-hidden="true"]')?.textContent).toBe("-");
  });

  it("die Überschrift trägt ihren Mouseover-Hinweis", async () => {
    const tisch = await zeige();
    const kopf = within(tisch)
      .getAllByRole("columnheader")
      .find((k) => ohneHinweis(k) === PRUEFUNG_WORT)!;
    expect(hinweisVon(kopf)).toBe(HINWEIS_CHALLENGE.spalte);
  });

  it("sortiert nach dem Schnitt - ohne Challenge ans Ende", async () => {
    const tisch = await zeige();
    await screen.findByText(`3 / ${probenUebersicht(MIA).schnitt}`);
    fireEvent.click(within(tisch).getByRole("button", { name: new RegExp(`^${PRUEFUNG_WORT}`) }));
    const namen = within(tisch)
      .getAllByRole("rowheader")
      .map((z) => ohneHinweis(z).replace(/Nachricht.*$/, "").trim());
    expect(probenUebersicht(NOAH).schnitt!).toBeGreaterThan(probenUebersicht(MIA).schnitt!);
    expect(namen[0]).toMatch(/^Noah/);
    expect(namen[1]).toMatch(/^Mia/);
    expect(namen[2]).toMatch(/^Lea/);
  });

  it("aufgeklappt: je Challenge Datum, Minuten, Niveau und die drei Werte", async () => {
    await zeige();
    await screen.findByText(`3 / ${probenUebersicht(MIA).schnitt}`);
    fireEvent.click(
      screen.getByRole("button", { name: "Einstellungen und Auswertung von Mia ausklappen" }),
    );
    // ★ E4 (18.09.2026): die Tabelle liegt seither in ihrer eigenen Zeile
    // „Tippchallenges - {Anzahl}" (ein `<details>`, zu bis geöffnet) - der
    // `<summary>` hat in jsdom keine eigene Rolle, darum über den sichtbaren
    // Text geklickt.
    fireEvent.click(await screen.findByText(new RegExp(`^${PRUEFUNG_WORT_MEHRZAHL} -`)));
    const tabelle = await screen.findByRole("table", {
      name: `${PRUEFUNG_WORT_MEHRZAHL} von Mia`,
    });
    const koepfe = within(tabelle).getAllByRole("columnheader").map(ohneHinweis);
    expect(koepfe).toEqual([
      "Datum",
      "Minuten",
      "Niveau",
      "Anschläge/Min",
      "Treffsicherheit",
      "Leistungswert",
    ]);
    const zeilen = within(tabelle).getAllByRole("row").slice(1);
    expect(zeilen).toHaveLength(3);
    // Jüngste zuerst: der 10. - die zu kurze.
    const erste = [...zeilen[0].children].map((c) => ohneHinweis(c));
    expect(erste[0]).toMatch(/10\.09\.2026/);
    expect(erste[1]).toBe("5");
    expect(erste[2]).toBe("Alle Buchstaben");
    expect(erste[3]).toBe(String(MIA[2].anschlaege));
    expect(erste[4]).toBe(`${Math.round(MIA[2].genauigkeit * 100)} %`);
    expect(erste[5]).toBe("ohne Wertung");
    // Die zweite hatte 8 Minuten.
    expect(ohneHinweis(zeilen[1].children[1])).toBe("8");
    // ★★ Jeder Kopf dieser Tabelle hat einen Hinweis - bei der Lehrkraft mit
    // „Sie" (Johannes 10.09.2026).
    expect(within(tabelle).getAllByRole("columnheader").map(hinweisVon)).toEqual([
      HINWEIS_TABELLE.Sie.datum,
      HINWEIS_TABELLE.Sie.minuten,
      HINWEIS_TABELLE.Sie.niveau,
      HINWEIS_TABELLE.Sie.anschlaege,
      HINWEIS_TABELLE.Sie.treffsicherheit,
      HINWEIS_TABELLE.Sie.leistungswert,
    ]);
  });
});

describe("★★ Dasselbe in der Statistik des Kindes", () => {
  it("zeigt dieselbe Tabelle mit dem Satz darüber", async () => {
    render(<SchreibprobenListe accountId={kind("Mia").id} />);
    const tabelle = await screen.findByRole("table", {
      name: `Deine ${PRUEFUNG_WORT_MEHRZAHL}`,
    });
    expect(within(tabelle).getAllByRole("row").slice(1)).toHaveLength(3);
    expect(screen.getByText(`${uebersichtSatz(probenUebersicht(MIA))}.`)).toBeTruthy();
    // Kein Rang beim Kind - weder Spalte noch Wort.
    const koepfe = within(tabelle).getAllByRole("columnheader").map(ohneHinweis);
    expect(koepfe).not.toContain("Rang");
    // ★★ Dieselben Köpfe mit Hinweis - hier mit „du" (Johannes 10.09.2026).
    expect(within(tabelle).getAllByRole("columnheader").map(hinweisVon)).toEqual([
      HINWEIS_TABELLE.du.datum,
      HINWEIS_TABELLE.du.minuten,
      HINWEIS_TABELLE.du.niveau,
      HINWEIS_TABELLE.du.anschlaege,
      HINWEIS_TABELLE.du.treffsicherheit,
      HINWEIS_TABELLE.du.leistungswert,
    ]);
  });
});

describe("★ Mouseover-Hinweise an der Ergebnis-Karte", () => {
  it("die drei grossen Zahlen und die wackligen Tasten erklären sich", () => {
    const { container } = render(<SchreibprobeErgebnis ergebnis={MIA[0]} />);
    // ★ K1 (19.09.2026): Die Kästen hängen unter <body>; im Bauteil steht
    // ihre Marke, deren Wert die Id des Kastens ist.
    const texte = [...container.querySelectorAll("[data-hinweis-anker]")].map(
      (m) => document.getElementById(m.getAttribute("data-hinweis-anker")!)?.textContent,
    );
    for (const erwartet of [
      HINWEIS_CHALLENGE.anschlaege,
      HINWEIS_CHALLENGE.treffsicherheit,
      HINWEIS_CHALLENGE.leistungswert,
      HINWEIS_CHALLENGE.zeichen,
      HINWEIS_CHALLENGE.fehler,
      HINWEIS_CHALLENGE.wacklig,
    ]) {
      expect(texte).toContain(erwartet);
    }
  });
});

describe("★ Der Zeitstand vor der Zeile: nur für die Braillezeile", () => {
  it("steht im Tippfeld, ist in der sichtbaren Zeile aber unsichtbar - mit seiner Breite", () => {
    const PRAEFIX = "08:53   ";
    const { container } = render(
      <TypingSession
        items={["die katze"]}
        contextId="test-praefix"
        unlocked={new Set([..."die katze"])}
        shiftLearned={false}
        stufe={1 as never}
        voiceEnabled={false}
        zeilenPraefix={PRAEFIX}
        onRetry={() => {}}
      />,
    );
    const feld = container.querySelector<HTMLTextAreaElement>('[data-feld="tippen"]')!;
    // Die Braillezeile liest das Feld - dort steht der Zeitstand.
    expect(feld.value.startsWith(PRAEFIX)).toBe(true);
    // In der sichtbaren Zeile: jede Zelle des Vorspanns da, aber unsichtbar.
    const zeile = container.querySelector("[data-angabe]")!;
    const unsichtbar = zeile.querySelectorAll("span.invisible");
    expect(unsichtbar).toHaveLength(PRAEFIX.length);
    // Gegenprobe: Die Zeile selbst ist nicht unsichtbar geschaltet.
    const alleZeichen = zeile.querySelectorAll("span");
    expect(alleZeichen.length).toBeGreaterThan(PRAEFIX.length);
  });
});
