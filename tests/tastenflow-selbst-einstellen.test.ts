/**
 * ★★★★★ WER SEINE LERN-EINSTELLUNGEN SELBST SETZEN DARF.
 *
 * Johannes am 03.09.2026 abends:
 *
 *   „Alle, die nicht einer Klasse zugeordnet sind, müssen sich das selbst in
 *    den Einstellungen einstellen können, sowie auch Tempo. Nur Schüler einer
 *    Klasse können das nicht ändern."
 *
 * Und am 04.09.2026, nachdem Lehrkräfte seit dem 03.09. selbst üben:
 *
 *   „als lehrer kann man in einstellungen kein startlevel von sich selbst
 *    einstellen und auch nicht das tempo?"
 *
 * Er hatte recht. Die Regel stand in `TippenTrainerPage` DREIMAL
 * ausgeschrieben, und zwei der drei Fassungen fragten `!account` („ist niemand
 * angemeldet?") statt nach der Klasse:
 *
 *   Geburtsjahr        `!isPupil || selfManaged`   ← richtig
 *   „Zeit lassen"      `!account  || selfManaged`  ← Lehrkräfte fielen durch
 *   „Womit anfangen?"  `!account  || selfManaged`  ← Lehrkräfte fielen durch
 *
 * Eine Lehrkraft IST angemeldet und hat trotzdem keine Lehrkraft über sich.
 * Sie landete damit in der Sperre, die für Kinder einer Klasse gedacht ist -
 * bei einem Schalter, den in ihrem Fall niemand sonst umlegen konnte.
 *
 * ── WARUM DIESER WÄCHTER DREI TEILE HAT ───────────────────────────────────
 *
 * 1. DIE REGEL selbst, für alle vier Kontoarten - und ausdrücklich mit der
 *    Gegenprobe. Ein Test, der nur zeigt, dass Lehrkräfte dürfen, wäre auch
 *    grün, wenn plötzlich JEDE Person dürfte, das Kind einer Klasse
 *    eingeschlossen.
 * 2. DER QUELLTEXT: dass es die alte Fassung nirgends mehr gibt. Die Regel
 *    war nicht falsch, weil jemand sie falsch verstanden hat, sondern weil sie
 *    mehrfach dastand. Ein Verhaltenstest deckt die Stellen ab, die er kennt;
 *    dieser Teil deckt auch die ab, die morgen jemand dazuschreibt.
 * 3. DIE SPEICHERSTELLE: dass „Zeit lassen" für Lehrkräfte nicht in
 *    `tt_pupils` geschrieben wird. Das Tor allein aufzumachen hätte nicht
 *    gereicht - der Wert wäre in einer Sammlung gelandet, in der die Lehrkraft
 *    keinen Datensatz hat, und der Aufruf wäre still im `catch` verschwunden.
 *    Der Schalter hätte sich also nicht einmal gemerkt, was er anzeigt.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { gehoertEinerKlasse } from "@/lib/typing/account";

const SEITE = "src/features/public/TippenTrainerPage.tsx";
const quelle = () => readFileSync(resolve(__dirname, "..", SEITE), "utf-8");

describe("Die Regel: wer gehört einer Klasse an?", () => {
  it("★ Gast ohne Anmeldung - keine Klasse, darf selbst", () => {
    expect(gehoertEinerKlasse(null)).toBe(false);
    expect(gehoertEinerKlasse(undefined)).toBe(false);
  });

  it("★★★ Lehrkraft, die selbst übt - keine Klasse, darf selbst", () => {
    // Genau der Fall, der am 04.09. gemeldet wurde.
    expect(gehoertEinerKlasse({ role: "lehrkraft" })).toBe(false);
  });

  it("★ Selbstlernendes Konto - eigene Anmeldung, keine Klasse, darf selbst", () => {
    expect(gehoertEinerKlasse({ role: "schueler", selfManaged: true })).toBe(false);
  });

  it("★★★ Kind einer Klasse - die Gegenprobe: darf NICHT selbst", () => {
    // Ohne diese Zeile wären alle Tests oben auch grün, wenn die Funktion
    // schlicht immer `false` zurückgäbe - also jede Sperre gefallen wäre.
    expect(gehoertEinerKlasse({ role: "schueler" })).toBe(true);
    expect(gehoertEinerKlasse({ role: "schueler", selfManaged: false })).toBe(true);
  });
});

describe("Der Quelltext: eine Regel, nicht drei", () => {
  it("★★★★ kein `!account || selfManaged` mehr auf der Trainerseite", () => {
    // Die alte, zu enge Fassung - in jeder Schreibweise, die formatiert
    // überleben könnte.
    const alt = /!account\s*\|\|\s*!!?\s*account[?.]*\.selfManaged/;
    expect(
      alt.test(quelle()),
      `${SEITE}: „!account || selfManaged“ sperrt Lehrkräfte aus. ` +
        "Die Frage lautet nicht „ist jemand angemeldet?“, sondern " +
        "„gehört diese Person einer Klasse an?“ - dafür ist gehoertEinerKlasse da.",
    ).toBe(false);
  });

  it("★★★ die drei Selbst-Einstellungen hängen alle an derselben Regel", () => {
    const q = quelle();
    for (const tor of [
      "darfZeitLassenSelbst",
      "darfStartpunktSelbst",
      "darfGeburtsjahrSelbst",
      // ★ 19.09.2026 (Johannes: „Selbstlernende sollen sich alles einstellen
      //   können" - „auch Leute ohne Anmeldung").
      "darfEinhandSelbst",
    ]) {
      const zeile = new RegExp(`const ${tor} = ([^;]+);`).exec(q)?.[1]?.trim();
      expect(zeile, `${tor} muss es geben`).toBeTruthy();
      expect(
        zeile,
        `${tor} soll aus der einen Regel folgen, nicht neu formuliert werden`,
      ).toBe("!istKlassenkind");
    }
  });
});

describe("Die Speicherstelle: wo „Zeit lassen“ landet", () => {
  it("★★★★ für Lehrkräfte NICHT in tt_pupils - sonst verschwindet der Wert", () => {
    const q = quelle();
    // `setNoTimePressure` schreibt `tt_pupils` unter der Konto-Kennung. Für
    // eine Lehrkraft gibt es dort keinen Datensatz; der Aufruf endet still im
    // `catch`. Der Zweig davor muss deshalb auf `isPupil` prüfen, nicht auf
    // `account`.
    const zweig = /if \(!isPupil \|\| !account\) \{\s*\n\s*setDeviceZeitLassen\(on\);/;
    expect(
      zweig.test(q),
      "changeZeitLassen muss für alle ausser Lernenden-Konten das Gerät merken lassen",
    ).toBe(true);

    // Und die Anzeige muss aus derselben Quelle lesen wie das Schreiben - sonst
    // zeigt der Schalter etwas anderes an, als er gespeichert hat.
    expect(
      /const zeitLassen = isPupil \? !!account\?\.noTimePressure : deviceZeitLassen;/.test(q),
      "zeitLassen muss für Lehrkräfte und Gäste aus dem Gerät kommen",
    ).toBe(true);
  });

  it("★★★★ „Einhand schreiben“ (19.09.2026): dieselbe Bauart - Gerät für alle ausser Lernenden-Konten", () => {
    const q = quelle();
    expect(
      /if \(!isPupil \|\| !account\) \{\s*\n\s*setDeviceEinhand\(on\);/.test(q),
      "changeEinhand muss für Lehrkräfte und Gäste das Gerät merken lassen",
    ).toBe(true);
    expect(
      /const einhand = isPupil \? !!account\?\.oneHand : deviceEinhand;/.test(q),
      "einhand muss für Lehrkräfte und Gäste aus dem Gerät kommen",
    ).toBe(true);
    // Und die Regel, die geübt wird, hängt an genau diesem Wert.
    expect(q).toMatch(/const enforceShiftHand = !einhand;/);
  });
});
