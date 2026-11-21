/**
 * ★★★★★ DIE FALSCHE GRENZ-MELDUNG (Nachtrag 19.09.2026, beim Übersetzen der
 * Mails gefunden).
 *
 * `createClass`/`addPupil` (`pbBackend.ts`) fingen JEDEN 400er des Servers
 * mit derselben festen Meldung ab - „Diesen Klassencode gibt es schon" bzw.
 * „Diesen Namen gibt es in der Klasse schon." Das stimmt nur, wenn wirklich
 * der Code/Name doppelt ist. Trifft eine Lehrkraft stattdessen die Grenze aus
 * `tt_grenzen.pb.js` (höchstens 20 Klassen je Konto, höchstens 30 Kinder je
 * Klasse), war der Code/Name FREI - die Meldung log dann glatt daneben, und
 * niemand erfuhr, dass es an der Grenze lag.
 *
 * Unterschieden wird jetzt am tatsächlichen Server-Inhalt, nicht geraten:
 * Eine echte Doppelung meldet PocketBase als `validation_not_unique` am
 * betroffenen Feld (`code` bzw. `email` - der Name ist nur über die
 * synthetische Login-Adresse eindeutig, siehe `synthEmail`); jeder andere
 * 400er bekommt die eigene Meldung des Hooks, der ihn ausgelöst hat
 * (`hookError`).
 *
 * Muster für den nachgebauten `pb`: `tests/tastenflow-lesefehler-schreibweg.test.ts`
 * (`backendMit`, `Object.create(PocketBaseTypingBackend.prototype)`).
 *
 * ★ Nachtrag 20.09.2026: der Wortlaut der Code-Doppelung-Meldung hat sich
 * geändert (Nachbesserung Auftrag Testerin Punkt 1 - sie nennt jetzt
 * ausdrücklich den Klassencode und sagt, dass der Klassenname bleiben darf).
 * Die Unterscheidung selbst (`validation_not_unique` vs. Hook-Meldung) ist
 * unverändert - nur der Test unten zeigt jetzt den NEUEN Satz.
 */
import { describe, expect, it } from "vitest";
import { ClientResponseError } from "pocketbase";
import { PocketBaseTypingBackend } from "@/lib/typing/pbBackend";

function backendMit(pb: unknown): PocketBaseTypingBackend {
  const b = Object.create(PocketBaseTypingBackend.prototype) as PocketBaseTypingBackend;
  (b as unknown as { pb: unknown }).pb = pb;
  return b;
}

/** `validation_not_unique` - wie PocketBase eine echte Feld-Doppelung meldet. */
function doppeltesFeld(feld: string) {
  return new ClientResponseError({
    status: 400,
    response: {
      message: "Failed to create record.",
      data: { [feld]: { code: "validation_not_unique", message: "Value must be unique." } },
    },
  });
}

/** Ein `throw new BadRequestError("…")` aus einem Hook - `data` bleibt leer. */
function hookMeldung(message: string) {
  return new ClientResponseError({ status: 400, response: { message, data: {} } });
}

describe("★★★★★ createClass unterscheidet Doppelung von Grenze", () => {
  it("echte Doppelung des Codes ⇒ die Klassencode-Meldung", async () => {
    const pb = {
      collection() {
        return {
          async create() {
            throw doppeltesFeld("code");
          },
        };
      },
    };
    const r = await backendMit(pb).createClass("t1", "3B", "3B");
    /*
      ★ Nachbesserung 20.09.2026 (Punkt 3): der Satz nennt jetzt ausdrücklich
      den Klassencode und sagt, dass der Klassenname bleiben darf - kein
      `codeAutoVorschlag` hier (5. Parameter weggelassen), darum kein
      Ausweich-Versuch, direkt die Absage.
    */
    expect(r).toEqual({
      ok: false,
      error:
        "Diesen Klassencode gibt es schon - bitte wählen Sie einen anderen Klassencode (der Klassenname darf gerne bleiben).",
    });
  });

  it("★★★ die 20-Klassen-Grenze (tt_grenzen.pb.js) ⇒ deren EIGENE Meldung, nicht die Klassencode-Meldung", async () => {
    const GRENZE =
      "Mehr als 20 Klassen sind je Konto nicht vorgesehen. Brauchst du wirklich mehr, melde dich bitte - dann heben wir die Grenze an.";
    const pb = {
      collection() {
        return {
          async create() {
            throw hookMeldung(GRENZE);
          },
        };
      },
    };
    const r = await backendMit(pb).createClass("t1", "Ganz neue Klasse", "NEU");
    expect(r).toEqual({ ok: false, error: GRENZE });
  });
});

describe("★★★★★ addPupil unterscheidet Doppelung vom Namen und Klassen-Stärke", () => {
  function pbFuerAddPupil(fehler: Error) {
    return {
      authStore: { record: { id: "t1" } },
      filter: (s: string) => s,
      collection(name: string) {
        if (name === "tt_classes") {
          return {
            async getFirstListItem() {
              throw new Error("keine Klasse gefunden");
            },
          };
        }
        return {
          async create() {
            throw fehler;
          },
        };
      },
    };
  }

  it("echte Doppelung des Namens (über die synthetische Adresse) ⇒ die Namens-Meldung", async () => {
    const pb = pbFuerAddPupil(doppeltesFeld("email"));
    const r = await backendMit(pb).addPupil("3B", "Anna", "pw1234", "a", "normal", 2);
    expect(r).toEqual({ ok: false, error: "Diesen Namen gibt es in der Klasse schon." });
  });

  it("★★★ die 30-Kinder-Grenze (tt_grenzen.pb.js) ⇒ deren EIGENE Meldung, nicht die Namens-Meldung", async () => {
    const GRENZE =
      "In dieser Klasse sind bereits 30 Kinder. Mehr als 30 sind je Klasse nicht vorgesehen - lege bitte eine zweite Klasse an.";
    const pb = pbFuerAddPupil(hookMeldung(GRENZE));
    const r = await backendMit(pb).addPupil("3B", "Ein 31. Kind", "pw1234", "a", "normal", 2);
    expect(r).toEqual({ ok: false, error: GRENZE });
  });
});
