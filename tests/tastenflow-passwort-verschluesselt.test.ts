/**
 * ★★★★★ KINDER-PASSWÖRTER VERSCHLÜSSELT IN DER DATENBANK (26.09.2026).
 *
 * `tt_pupils.passwordPlain` stand bis dahin im Klartext in `data.db`. Jetzt
 * `enc:v1:<AES-256-GCM>` - Schlüssel aus `TT_PASSWORT_SCHLUESSEL`.
 * Geprüft an den ECHTEN Hook-Dateien in der nachgebauten Laufzeit
 * (`tests/helfer/pbHookLaufzeit.ts`; `$security.encrypt/decrypt` dort wie
 * PocketBase: AES-256-GCM, Nonce vorne, base64).
 *
 * Was ein echtes PocketBase dazu sagt (Modell-Hooks, rohes SQL der Umstellung,
 * Realtime), steht im Bericht des Wegwerf-Laufs - das kann diese Laufzeit
 * nicht nachbauen.
 */
import { describe, expect, it } from "vitest";
import { FakeRecord, neueLaufzeit } from "./helfer/pbHookLaufzeit";

const KEY = "0123456789abcdef0123456789abcdef";
const LIB = "tt_pupils_passwort_verschluesseln_lib.pb.js";

interface Lib {
  PRAEFIX: string;
  klartext: (w: string, k?: string) => string | null;
  istVerschluesselt: (w: string, k?: string) => boolean;
  vorDemSpeichern: (app: unknown, r: FakeRecord) => string;
  anreichern: (e: unknown) => string;
}

function laufzeit(key: string | null = KEY, daten?: Record<string, FakeRecord[]>) {
  return neueLaufzeit({
    jetzt: Date.UTC(2026, 8, 26, 10),
    appUrl: "https://tastenflow.org",
    umgebung: key === null ? {} : { TT_PASSWORT_SCHLUESSEL: key },
    daten,
  });
}

function kind(werte: Record<string, unknown> = {}) {
  return new FakeRecord("tt_pupils", "P1", {
    name: "Mia",
    classCode: "3B",
    contactEmail: "eltern@example.org",
    ...werte,
  });
}

const EIGENE = new FakeRecord("tt_teachers", "T1", { email: "lehrerin@example.org" });
const CO = new FakeRecord("tt_teachers", "T2", { email: "co@example.org" });
const FREMDE = new FakeRecord("tt_teachers", "T9", { email: "fremd@example.org" });
const KLASSEN = {
  tt_classes: [
    new FakeRecord("tt_classes", "C1", { code: "3B", teacherUid: "T1" }),
    new FakeRecord("tt_classes", "C9", { code: "4A", teacherUid: "T9" }),
  ],
  tt_class_teachers: [new FakeRecord("tt_class_teachers", "X1", { classCode: "3B", teacherUid: "T2" })],
};

describe("Verschlüsseln vor dem Speichern", () => {
  it("Klartext wird enc:v1:…, entschlüsselt wieder derselbe Text", () => {
    const lz = laufzeit();
    const lib = lz.lib<Lib>(LIB);
    const r = kind({ passwordPlain: "Kiwi47" });
    expect(lib.vorDemSpeichern(lz.$app, r)).toBe("verschluesselt");
    const gespeichert = r.getString("passwordPlain");
    expect(gespeichert.startsWith("enc:v1:")).toBe(true);
    expect(gespeichert).not.toContain("Kiwi47");
    expect(lib.klartext(gespeichert)).toBe("Kiwi47");
  });

  it("ein schon verschlüsselter Wert bleibt Byte für Byte (jede andere Änderung am Kind)", () => {
    const lz = laufzeit();
    const lib = lz.lib<Lib>(LIB);
    const r = kind({ passwordPlain: "Kiwi47" });
    lib.vorDemSpeichern(lz.$app, r);
    const einmal = r.getString("passwordPlain");
    expect(lib.vorDemSpeichern(lz.$app, r)).toBe("schon-verschluesselt");
    expect(r.getString("passwordPlain")).toBe(einmal);
  });

  it("GEGENPROBE: derselbe Klartext zweimal verschlüsselt ergibt verschiedene Texte", () => {
    const lz = laufzeit();
    const lib = lz.lib<Lib>(LIB);
    const a = kind({ passwordPlain: "Kiwi47" });
    const b = kind({ passwordPlain: "Kiwi47" });
    lib.vorDemSpeichern(lz.$app, a);
    lib.vorDemSpeichern(lz.$app, b);
    expect(a.getString("passwordPlain")).not.toBe(b.getString("passwordPlain"));
  });

  it("ein Passwort, das nur so AUSSIEHT wie verschlüsselt, wird trotzdem verschlüsselt", () => {
    const lz = laufzeit();
    const lib = lz.lib<Lib>(LIB);
    const r = kind({ passwordPlain: "enc:v1:abcd" });
    expect(lib.vorDemSpeichern(lz.$app, r)).toBe("verschluesselt");
    expect(lib.klartext(r.getString("passwordPlain"))).toBe("enc:v1:abcd");
  });

  it("OHNE Schlüssel: kein Klartext in der Datenbank - Feld leer, Fehler im Protokoll", () => {
    const lz = laufzeit(null);
    const lib = lz.lib<Lib>(LIB);
    const r = kind({ passwordPlain: "Kiwi47" });
    expect(lib.vorDemSpeichern(lz.$app, r)).toBe("geleert");
    expect(r.getString("passwordPlain")).toBe("");
    expect(lz.protokoll.some((z) => z.startsWith("error") && z.includes("TT_PASSWORT_SCHLUESSEL"))).toBe(true);
  });

  it("OHNE Schlüssel bleibt ein schon verschlüsselter Wert stehen (nicht verlieren)", () => {
    const mit = laufzeit();
    const r = kind({ passwordPlain: "Kiwi47" });
    mit.lib<Lib>(LIB).vorDemSpeichern(mit.$app, r);
    const enc = r.getString("passwordPlain");
    const ohne = laufzeit(null);
    expect(ohne.lib<Lib>(LIB).vorDemSpeichern(ohne.$app, r)).toBe("ohne-schluessel-belassen");
    expect(r.getString("passwordPlain")).toBe(enc);
  });

  it("ein Schlüssel mit falscher Länge gilt als fehlend", () => {
    const lz = laufzeit("zu-kurz");
    const r = kind({ passwordPlain: "Kiwi47" });
    expect(lz.lib<Lib>(LIB).vorDemSpeichern(lz.$app, r)).toBe("geleert");
  });

  it("klartext: Alt-Zeile im Klartext kommt so zurück; falscher Schlüssel und Verfälschung ⇒ null", () => {
    const lz = laufzeit();
    const lib = lz.lib<Lib>(LIB);
    expect(lib.klartext("Kiwi47")).toBe("Kiwi47");
    expect(lib.klartext("")).toBe("");
    const r = kind({ passwordPlain: "Kiwi47" });
    lib.vorDemSpeichern(lz.$app, r);
    const enc = r.getString("passwordPlain");
    expect(lib.klartext(enc, "ffffffffffffffffffffffffffffffff")).toBeNull();
    // Ein Byte des Schlüsseltexts kippen (nicht ein base64-Zeichen - vor „==" trägt es teils nur Füllbits).
    const roh = Buffer.from(enc.slice(7), "base64");
    roh[14] ^= 0x01;
    const verfaelscht = "enc:v1:" + roh.toString("base64");
    expect(lib.klartext(verfaelscht)).toBeNull();
  });
});

describe("Antwort (onRecordEnrich): Klartext nur für die Lehrkraft der Klasse", () => {
  function antwort(auth: unknown, key: string | null = KEY) {
    const lz = laufzeit(key, KLASSEN);
    const vorbereitet = laufzeit(KEY);
    const r = kind({ passwordPlain: "Kiwi47" });
    vorbereitet.lib<Lib>(LIB).vorDemSpeichern(vorbereitet.$app, r);
    const enc = r.getString("passwordPlain");
    lz.ladeHook("tt_pupils_passwort_verschluesseln.pb.js");
    const [h] = lz.handler("onRecordEnrich", "tt_pupils");
    let weiter = false;
    h.handler({ app: lz.$app, record: r, requestInfo: { auth }, next: () => (weiter = true) });
    expect(weiter).toBe(true);
    return { r, enc, lz };
  }

  it("Eigentümerin der Klasse sieht den Klartext", () => {
    const { r } = antwort(EIGENE);
    expect(r.getString("passwordPlain")).toBe("Kiwi47");
    expect(r.versteckt.has("passwordPlain")).toBe(false);
  });
  it("Co-Lehrkraft der Klasse sieht den Klartext", () => {
    expect(antwort(CO).r.getString("passwordPlain")).toBe("Kiwi47");
  });
  it("fremde Lehrkraft: Feld versteckt", () => {
    expect(antwort(FREMDE).r.versteckt.has("passwordPlain")).toBe(true);
  });
  it("das Kind selbst: Feld versteckt", () => {
    const selbst = kind();
    expect(antwort(selbst).r.versteckt.has("passwordPlain")).toBe(true);
  });
  it("ohne Anmeldung (z. B. Realtime ohne Konto): Feld versteckt", () => {
    expect(antwort(null).r.versteckt.has("passwordPlain")).toBe(true);
  });
  it("Superuser: der Schlüsseltext unverändert (Admin-Oberfläche schreibt ihn sonst leer)", () => {
    const su = { id: "S1", collection: () => ({ name: "_superusers" }), isSuperuser: () => true };
    const { r, enc } = antwort(su);
    expect(r.getString("passwordPlain")).toBe(enc);
    expect(r.versteckt.has("passwordPlain")).toBe(false);
  });
  it("Lehrkraft, aber Schlüssel fehlt am Server: leeres Feld statt Schlüsseltext, Fehler im Protokoll", () => {
    const { r, lz } = antwort(EIGENE, null);
    expect(r.getString("passwordPlain")).toBe("");
    expect(lz.protokoll.some((z) => z.startsWith("error"))).toBe(true);
  });
});

describe("Passwort-Mail: entschlüsselt, genau einmal je echtem Wechsel", () => {
  function mitGespeichertem(passwort: string) {
    const lz = laufzeit(KEY);
    const gespeichert = kind({ passwordPlain: passwort });
    lz.lib<Lib>(LIB).vorDemSpeichern(lz.$app, gespeichert);
    lz.daten.tt_pupils = [gespeichert];
    lz.ladeHook("tt_pupils_passwort_mail.pb.js");
    return { lz, gespeichert };
  }
  function updateRequest(lz: ReturnType<typeof laufzeit>, record: FakeRecord, auth: unknown = EIGENE) {
    for (const h of lz.handler("onRecordUpdateRequest", "tt_pupils")) {
      h.handler({ app: lz.$app, record, auth, next() {} });
    }
  }

  it("Anlegen: die Mail trägt den KLARTEXT, nicht den Schlüsseltext", () => {
    const { lz, gespeichert } = mitGespeichertem("Kiwi47");
    expect(gespeichert.getString("passwordPlain").startsWith("enc:v1:")).toBe(true);
    for (const h of lz.handler("onRecordAfterCreateSuccess", "tt_pupils")) {
      h.handler({ record: gespeichert, app: lz.$app, next() {} });
    }
    expect(lz.gesendet).toHaveLength(1);
    expect(lz.gesendet[0].html).toContain("Kiwi47");
    expect(lz.gesendet[0].html).not.toContain("enc:v1:");
  });

  it("eine Änderung, die das Passwort NICHT anfasst: keine Mail", () => {
    const { lz, gespeichert } = mitGespeichertem("Kiwi47");
    const neu = kind({ passwordPlain: gespeichert.getString("passwordPlain"), tempo: "langsam" });
    updateRequest(lz, neu);
    expect(lz.gesendet).toHaveLength(0);
  });

  it("Zurücksetzen auf ein neues Passwort: genau eine Mail, mit dem neuen Klartext", () => {
    const { lz } = mitGespeichertem("Kiwi47");
    updateRequest(lz, kind({ passwordPlain: "Birne12" }));
    expect(lz.gesendet).toHaveLength(1);
    expect(lz.gesendet[0].html).toContain("Birne12");
  });

  it("Zurücksetzen auf DASSELBE Passwort: keine Mail (wie vor der Verschlüsselung)", () => {
    const { lz } = mitGespeichertem("Kiwi47");
    updateRequest(lz, kind({ passwordPlain: "Kiwi47" }));
    expect(lz.gesendet).toHaveLength(0);
  });

  it("★★★★ ein Aufruf des KINDES löst nie eine Passwort-Mail aus (Befund 26.09.: Mail mit „gefaelscht\")", () => {
    const { lz } = mitGespeichertem("Kiwi47");
    // Der Mail-Hook sieht den Aufruf VOR dem Feld-Wächter - hier also noch mit dem Text des Kindes.
    updateRequest(lz, kind({ passwordPlain: "gefaelscht" }), kind());
    expect(lz.gesendet).toHaveLength(0);
    // Gegenprobe: derselbe Aufruf von der Lehrkraft schickt die Mail.
    updateRequest(lz, kind({ passwordPlain: "gefaelscht" }), EIGENE);
    expect(lz.gesendet).toHaveLength(1);
  });

  it("Schlüsseltext nicht entschlüsselbar: KEINE Mail (lieber keine als eine mit Kauderwelsch)", () => {
    const { gespeichert } = mitGespeichertem("Kiwi47");
    const falsch = laufzeit("ffffffffffffffffffffffffffffffff");
    falsch.ladeHook("tt_pupils_passwort_mail.pb.js");
    for (const h of falsch.handler("onRecordAfterCreateSuccess", "tt_pupils")) {
      h.handler({ record: gespeichert, app: falsch.$app, next() {} });
    }
    expect(falsch.gesendet).toHaveLength(0);
    expect(falsch.protokoll.some((z) => z.startsWith("error"))).toBe(true);
  });
});

describe("Verdrahtung", () => {
  it("Modell-Hooks für Anlegen UND Ändern, Enrich, Bootstrap - alle für tt_pupils", () => {
    const lz = laufzeit();
    lz.ladeHook("tt_pupils_passwort_verschluesseln.pb.js");
    expect(lz.handler("onRecordCreate", "tt_pupils")).toHaveLength(1);
    expect(lz.handler("onRecordUpdate", "tt_pupils")).toHaveLength(1);
    expect(lz.handler("onRecordEnrich", "tt_pupils")).toHaveLength(1);
    expect(lz.handler("onBootstrap")).toHaveLength(1);
    expect(lz.registriert.filter((r) => r.art !== "onBootstrap").every((r) => r.tags.includes("tt_pupils"))).toBe(
      true,
    );
  });

  it("der Modell-Hook verschlüsselt und ruft next()", () => {
    const lz = laufzeit();
    lz.ladeHook("tt_pupils_passwort_verschluesseln.pb.js");
    for (const art of ["onRecordCreate", "onRecordUpdate"]) {
      const r = kind({ passwordPlain: "Kiwi47" });
      let weiter = false;
      lz.handler(art, "tt_pupils")[0].handler({ app: lz.$app, record: r, next: () => (weiter = true) });
      expect(weiter).toBe(true);
      expect(r.getString("passwordPlain").startsWith("enc:v1:")).toBe(true);
    }
  });
});

describe("★★★★ Selbstanmeldung: kein offenes Mail-Relais (Befund 26.09.2026)", () => {
  it("contactEmail und passwordPlain aus dem Body werden geleert", () => {
    const lz = laufzeit();
    lz.ladeHook("tt_pupils_selfsignup.pb.js");
    const r = new FakeRecord("tt_pupils", "N1", {
      selfManaged: true,
      classCode: "",
      teacherUid: "",
      name: "Fremder",
      email: "angreifer@beispiel.at",
      contactEmail: "opfer@beispiel.at",
      passwordPlain: "Beliebiger Text",
    });
    let weiter = false;
    for (const h of lz.handler("onRecordCreateRequest", "tt_pupils")) {
      h.handler({
        app: lz.$app,
        record: r,
        auth: null,
        requestInfo: () => ({ body: { password: "Angreifer123" } }),
        next: () => (weiter = true),
      });
    }
    expect(weiter).toBe(true);
    expect(r.getString("contactEmail")).toBe("");
    expect(r.getString("passwordPlain")).toBe("");
  });
});
