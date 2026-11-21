/**
 * ★★★★ WÄCHTER: Die Übungsformen mit eigenem Bildschirm verlieren keine
 * Übezeit (02.09.2026).
 *
 * ── Warum dieser Wächter ──────────────────────────────────────────────────
 *
 * Der Zuwachs der Übezeit-Uhr wird an genau EINER Stelle abgeholt:
 * `takePracticeDelta()`, gerufen dort, wo ein Ereignis geschrieben wird. In
 * der gewohnten Übungssitzung ist das das Ende jeder getippten Zeile.
 *
 * `RaetselLauf` (Fingerdiktat, Lückentext) und
 * `BuchstabensalatLauf` schreiben KEINE Zeilen. Melden sie nichts, läuft die
 * Uhr sichtbar weiter, aber es wird nichts gespeichert: Wer ein Fingerdiktat
 * macht und danach aufhört, hätte seine Minuten verloren - und Kind- und
 * Lehrkraft-Ansicht zeigten verschiedene Übezeiten.
 *
 * Das ist kein hypothetischer Fall. Am 01.09.2026 wurde genau diese Zahl
 * repariert (gekappte Geschichte, dann das Packformat, das die Ansage-Zeit
 * wegwarf - 9 % bei einem Kind). Sie darf hier nicht wieder auslaufen.
 *
 * ⚠️ Geprüft wird das VERHALTEN (es kommt ein Ereignis je Aufgabe, mit
 * `activeMs`), nicht eine Konstante. Ein Test, der nur „der Bildschirm
 * rendert" prüft, sähe den Verlust nicht - der Bildschirm rendert ja.
 */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { RaetselLauf } from "@/components/typing/RaetselLauf";
import { BuchstabensalatLauf } from "@/components/typing/BuchstabensalatLauf";

afterEach(cleanup);

function antworte(text: string) {
  const feld = screen.getByRole("textbox") as HTMLInputElement;
  fireEvent.change(feld, { target: { value: text } });
  fireEvent.keyDown(feld, { key: "Enter" });
}

describe(`RaetselLauf meldet jede Aufgabe als Uebung`, () => {
  const aufgaben = [
    { frage: `rechter Mittelfinger`, antworten: ["k"] },
    { frage: `linker Zeigefinger`, antworten: ["f"] },
  ];

  it(`meldet eine richtige Antwort mit activeMs`, () => {
    const gemeldet: Array<Record<string, unknown>> = [];
    render(
      <RaetselLauf
        titel={`Fingerdiktat`}
        ankuendigung={`Jetzt kommt ein Fingerdiktat.`}
        aufgaben={aufgaben}
        contextId={`form:fingerdiktat`}
        onAufgabeFertig={(e) => gemeldet.push(e as unknown as Record<string, unknown>)}
        onFertig={() => {}}
        onAbbruch={() => {}}
      />,
    );
    antworte("k");
    expect(gemeldet).toHaveLength(1);
    expect(gemeldet[0].lesson).toBe(`form:fingerdiktat`);
    expect(gemeldet[0].errors).toBe(0);
    expect(gemeldet[0].chars).toBe(1);
    // Der Uhr-Zuwachs MUSS mitgeschickt werden - sonst wird er nie abgeholt.
    expect(typeof gemeldet[0].activeMs).toBe("number");
    expect(gemeldet[0].activeMs as number).toBeGreaterThanOrEqual(0);
  });

  it(`meldet auch eine Aufgabe, die aufgeloest wurde - Uebung war es trotzdem`, () => {
    const gemeldet: Array<Record<string, unknown>> = [];
    render(
      <RaetselLauf
        titel={`Fingerdiktat`}
        ankuendigung={`Jetzt kommt ein Fingerdiktat.`}
        aufgaben={aufgaben}
        contextId={`form:fingerdiktat`}
        onAufgabeFertig={(e) => gemeldet.push(e as unknown as Record<string, unknown>)}
        onFertig={() => {}}
        onAbbruch={() => {}}
      />,
    );
    antworte("z");
    expect(gemeldet).toHaveLength(0); // erster Fehlversuch: die Aufgabe laeuft noch
    antworte("z");
    expect(gemeldet).toHaveLength(1);
    expect(gemeldet[0].errors).toBe(2);
    expect(typeof gemeldet[0].activeMs).toBe("number");
  });

  it(`nennt die Antwort, statt nur die Aufloesung zu sagen`, () => {
    // Nach zwei Fehlversuchen klingt eine blosse Auskunft wie Lob.
    render(
      <RaetselLauf
        titel={`Fingerdiktat`}
        ankuendigung={`Jetzt kommt ein Fingerdiktat.`}
        aufgaben={aufgaben}
        contextId={`form:fingerdiktat`}
        onFertig={() => {}}
        onAbbruch={() => {}}
      />,
    );
    antworte("z");
    antworte("z");
    expect(screen.getByText(/Die Antwort ist: k\./)).toBeInTheDocument();
  });
});

describe(`BuchstabensalatLauf meldet jede geprueefte Eingabe`, () => {
  it(`meldet auch eine Eingabe, die nicht gezaehlt hat`, () => {
    const gemeldet: Array<Record<string, unknown>> = [];
    render(
      <BuchstabensalatLauf
        quellwort={`Weihnachtsbaum`}
        ankuendigung={`Jetzt kommt ein Buchstabensalat.`}
        contextId={`form:buchstabensalat`}
        onAufgabeFertig={(e) => gemeldet.push(e as unknown as Record<string, unknown>)}
        onFertig={() => {}}
        onAbbruch={() => {}}
      />,
    );
    antworte("Baum"); // zaehlt
    antworte("xyz"); // zaehlt nicht - war aber Uebung
    expect(gemeldet).toHaveLength(2);
    expect(gemeldet[0].lesson).toBe(`form:buchstabensalat`);
    expect(gemeldet[0].errors).toBe(0);
    expect(gemeldet[1].errors).toBe(1);
    for (const e of gemeldet) expect(typeof e.activeMs).toBe("number");
  });

  it(`zeigt das Wort so, wie das Kind es geschrieben hat`, () => {
    render(
      <BuchstabensalatLauf
        quellwort={`Weihnachtsbaum`}
        ankuendigung={`Jetzt kommt ein Buchstabensalat.`}
        contextId={`form:buchstabensalat`}
        onFertig={() => {}}
        onAbbruch={() => {}}
      />,
    );
    antworte("Baum");
    // Ein deutsches Nomen kleinzuschreiben waere falsch - und saehe aus wie
    // eine Verbesserung, die keine ist.
    expect(screen.getByRole("listitem").textContent).toBe("Baum");
  });
});
