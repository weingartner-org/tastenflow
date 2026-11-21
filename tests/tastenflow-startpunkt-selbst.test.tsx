/**
 * ★★★★★ WER SEINEN STARTPUNKT SELBST SETZEN DARF.
 *
 * Johannes am 03.09.2026 abends:
 *
 *   „Alle, die nicht einer Klasse zugeordnet sind, müssen sich das selbst in
 *    den Einstellungen einstellen können, sowie auch Tempo. Nur Schüler einer
 *    Klasse können das nicht ändern."
 *   „auch frei Übende ohne Anmeldung können das einstellen."
 *
 * Bis dahin stand im Code `account ? undefined : …` - den Startpunkt („Womit
 * anfangen?") gab es also NUR ohne Anmeldung. Ein selbstlernendes Konto
 * (eigene Anmeldung, aber keine Klasse) fiel damit in dieselbe Sperre wie ein
 * Kind, dessen Lehrkraft den Startpunkt führt - obwohl es gar keine Lehrkraft
 * hat, die es umstellen könnte. Wer schon tippen konnte, blieb bei F und J.
 *
 * ── WARUM DIE GEGENPROBE HIER DIE HÄLFTE IST ──────────────────────────────
 *
 * Ein Test, der nur zeigt, dass Selbstlernende den Schalter SEHEN, wäre auch
 * grün, wenn ihn plötzlich jeder sähe - auch das Kind einer Klasse, dessen
 * Startpunkt die Lehrkraft führt. Deshalb steht beides nebeneinander.
 */
import { describe, expect, it, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { TypingSettings } from "@/components/typing/TypingSettings";

afterEach(cleanup);

/** Die Einstellungen mit oder ohne Startpunkt-Feld aufbauen. */
function bau(mitStartpunkt: boolean) {
  return render(
    <TypingSettings lernweg="de"
      stufe={"kids" as never}
      onStufeChange={() => {}}
      lang="de"
      onLangChange={() => {}}
      startUnits={mitStartpunkt ? 3 : undefined}
      onStartUnitsChange={mitStartpunkt ? () => {} : undefined}
    />,
  );
}

describe("„Womit anfangen?“ - der Startpunkt", () => {
  it("★ steht da, wenn die Person ihn selbst setzen darf", () => {
    const { container } = bau(true);
    const feld = container.querySelector('[aria-label="Startpunkt im Lernstoff"]');
    expect(feld, "das Startpunkt-Feld muss da sein").toBeTruthy();
  });

  it("★ fehlt, wenn eine Lehrkraft ihn führt - die Gegenprobe", () => {
    // Ein Kind einer Klasse bekommt `onStartUnitsChange` nicht. Ohne diesen
    // Test wäre der obere auch grün, wenn das Feld für ALLE erschiene.
    const { container } = bau(false);
    const feld = container.querySelector('[aria-label="Startpunkt im Lernstoff"]');
    expect(feld, "ohne eigenes Recht darf es das Feld nicht geben").toBeNull();
  });
});
