/**
 * ★★★★★ ABSTURZ „Minified React error #300" (3. Klasse HAS, 23.09.2026).
 *
 * Die Lehrkraft schickte ein Bildschirmfoto: „Unexpected Application Error!
 * Minified React error #300" - „Rendered fewer hooks than expected". Davor
 * stand bei derselben Schülerin „Dein Lernstand kann gerade nicht gespeichert
 * werden".
 *
 * Gemessen am Server: Die Schülerin hatte sich am 16.09. um 08:2x Uhr
 * angemeldet und seither nicht mehr geübt. Eine Anmeldung gilt sieben Tage -
 * sie lief also genau in der nächsten Wochenstunde ab, während die Seite
 * offen war.
 *
 * Die Nachrichten-Glocke liest die Anmeldung bei JEDEM Zeichnen frisch
 * (`lwMessages().identity()` prüft das Ablaufdatum), die Kopfzeile hängt die
 * Glocke aber an ihr eigenes, stehen gebliebenes Konto. Nach dem Ablauf stand
 * die Glocke also im Baum und kehrte mit `return null` zurück - VOR einem
 * `useRef`. React rief einen Hook weniger auf als beim vorigen Zeichnen und
 * brach die ganze App ab.
 *
 * Nachgestellt ohne Server: eine Sitzung, die in einer Minute abläuft, die
 * Uhr zwei Minuten vor, dann ein Neuladen des Posteingangs (derselbe Weg wie
 * der Takt alle paar Sekunden). Gegenprobe: mit dem `useRef` UNTER dem
 * `return null` (Stand bis 23.09.) wirft dieser Test genau Fehler #300.
 */
import { act, cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LwMessageBell } from "@/components/lernwerkstatt/LwMessageBell";
import { LW_MESSAGES_CHANGED, lwMessages } from "@/lib/lernwerkstatt/messages";

/** Ein Token, wie PocketBase es ausgibt - nur Ablaufdatum und Kennung zählen hier. */
function tokenMitAblauf(expSekunden: number): string {
  const teil = (o: object) => btoa(JSON.stringify(o));
  return `${teil({ alg: "HS256", typ: "JWT" })}.${teil({
    id: "kind-elisa",
    type: "auth",
    collectionId: "tt_pupils_id",
    exp: expSekunden,
  })}.unterschrift`;
}

async function durchlaufen() {
  await act(async () => {
    for (let i = 0; i < 5; i++) await Promise.resolve();
  });
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  localStorage.removeItem("tt_pb_auth");
});

describe("★★★★★ Glocke: die Anmeldung läuft ab, während die Seite offen ist", () => {
  it("kein Absturz - die Glocke verschwindet still", async () => {
    const start = Date.now();
    localStorage.setItem(
      "tt_pb_auth",
      JSON.stringify({
        token: tokenMitAblauf(Math.floor(start / 1000) + 60),
        record: {
          id: "kind-elisa",
          collectionName: "tt_pupils",
          name: "Elisa",
          classCode: "3CS",
          teacherUid: "lehrkraft-1",
        },
      }),
    );
    const api = lwMessages();
    // Jedes Mal eine NEUE leere Liste - wie vom Server; dieselbe Liste
    // würde React als „unverändert" überspringen und nie neu zeichnen.
    vi.spyOn(api, "loadInbox").mockImplementation(async () => []);
    expect(api.identity()?.id).toBe("kind-elisa");

    const { container } = render(<LwMessageBell accountId="kind-elisa" ohneKnopf />);
    await durchlaufen();
    // Angemeldet: der Live-Bereich der Glocke steht im Baum.
    expect(container.querySelector('[role="status"]')).not.toBeNull();

    // Zwei Minuten später - das Token ist abgelaufen.
    vi.spyOn(Date, "now").mockReturnValue(start + 120_000);
    expect(api.identity()).toBeNull();

    // Der Posteingang lädt neu (Takt, Fokus, gesendete Nachricht) ⇒ neu zeichnen.
    // Bis 23.09. warf React hier „Rendered fewer hooks than expected" (#300).
    await act(async () => {
      window.dispatchEvent(new Event(LW_MESSAGES_CHANGED));
    });
    await durchlaufen();

    expect(container.querySelector('[role="status"]')).toBeNull();
  });
});
