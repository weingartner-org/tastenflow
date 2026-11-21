/**
 * WÄCHTER über die SERVER-SEITE des Klassenmatchs (11.09.2026, Etappe E6).
 *
 * Geprüft werden die drei Zusagen, die am Server stehen müssen und die kein
 * Bauteil-Test sehen kann:
 *
 *  1. ★★★★★ **Lehrkräfte haben KEINE Leseregel** (F10, Johannes: *„Es gibt
 *     keine Statistik; Lehrer wissen nicht, wer wie oft ein Match macht"*).
 *     Das ist die Zusage, an der die ganze Sache hängt - und sie ist nicht als
 *     Verstecken in der Oberfläche gebaut, sondern als fehlende Regel.
 *  2. Kinder lesen nur ihre EIGENE Klasse, und schreiben nur ihre EIGENE Zeile.
 *  3. Die Grenzen stehen im Hook: höchstens zwei offene Matches je Klasse,
 *     kein Match bei abgeschaltetem `klassenmatchAus`, nur erlaubte Übergänge,
 *     und die Zeiten setzt der Server.
 *
 * ⚠️ **WAS DIESER WÄCHTER NICHT BEWEIST** - und das ist wichtig: Er liest
 * `setup.mjs` und `tt_match.pb.js` als TEXT. Dass PocketBase die Regeln so
 * AUSWERTET, wie sie dastehen, sieht er nicht
 * ([[reference_pocketbase_antwort_umgeht_viewrule]] - dort umging eine Antwort
 * die viewRule, und jeder Text-Wächter hätte grün gemeldet). Muster:
 * `tests/tastenflow-kind-verschieben.test.ts` §(f).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function lies(pfad: string): string {
  return readFileSync(resolve(process.cwd(), pfad), "utf8");
}

const setup = () => lies("pocketbase/setup.mjs");
const hook = () => lies("pocketbase/pb_hooks/tt_match.pb.js");
/**
 * ★ Seit dem 11.09.2026 abends liegen Konstanten und Hilfsfunktionen in der Lib -
 * ein Handler sieht nichts aus dem Kopf seiner Datei (gemessen am Live-Server:
 * `ReferenceError: MATCH_DAUER_MIN is not defined`). Siehe
 * `tests/pocketbase-hook-scope.test.ts`.
 */
const lib = () => lies("pocketbase/pb_hooks/tt_match_lib.pb.js");
const hookUndLib = () => hook() + "\n" + lib();

// ── (a) Die Regeln ──────────────────────────────────────────────────────────

describe("(a) Die Regeln der zwei Sammlungen", () => {
  it("★★★★★ gibt Lehrkräften KEINE Leseregel auf Matches und Stände (F10)", () => {
    const s = setup();
    // Den Abschnitt der beiden Sammlungen herausschneiden - sonst träfe die
    // Suche die Lehrkraft-Regeln der Nachbar-Sammlungen.
    const von = s.indexOf('"tt_matches"');
    const bis = s.indexOf("idx_tt_ms_class");
    expect(von, "tt_matches fehlt in setup.mjs").toBeGreaterThan(0);
    expect(bis).toBeGreaterThan(von);
    const abschnitt = s.slice(von, bis);
    // Kein einziger Lehrkraft-Helfer in diesem Abschnitt.
    expect(abschnitt).not.toContain("TT_TEACHER");
    expect(abschnitt).not.toContain("ttOwnerTeacher");
    expect(abschnitt).not.toContain("ttCoTeacher");
    expect(abschnitt).not.toContain("ttClassStaff");
    expect(abschnitt).not.toContain("ttOwnsClass");
  });

  it("★★★ lässt Kinder nur ihre eigene Klasse lesen", () => {
    const s = setup();
    const regel = "${TT_PUPIL} && @request.auth.classCode = classCode";
    // Zweimal `list`, zweimal `view` - für beide Sammlungen.
    const treffer = s.split(regel).length - 1;
    expect(treffer, "die Kinder-Leseregel fehlt je Klasse").toBeGreaterThanOrEqual(4);
  });

  it("★★ lässt ein Kind nur SEINE eigene Stand-Zeile schreiben", () => {
    const s = setup();
    expect(s).toContain(
      "create: `${TT_PUPIL} && @request.auth.id = @request.body.pupilUid && @request.auth.classCode = @request.body.classCode`",
    );
    // Beim Ändern bleiben Match, Klasse und Kind, was sie sind.
    expect(s).toContain("@request.auth.id = pupilUid");
    expect(s).toContain("@request.body.matchId:isset = false || @request.body.matchId = matchId");
  });

  it("★★ lässt das Match nur seinen Gastgeber ändern - und niemanden löschen", () => {
    const s = setup();
    expect(s).toContain(
      "create: `${TT_PUPIL} && @request.auth.id = @request.body.hostUid && @request.auth.classCode = @request.body.classCode`",
    );
    expect(s).toContain("update: `${TT_PUPIL} && @request.auth.id = hostUid");
    // ⚠️ Löschen NUR über den Hook, der die Regeln umgeht (F10: was gelöscht
    // ist, kann niemand auswerten).
    const von = s.indexOf('"tt_matches"');
    const bis = s.indexOf("idx_tt_ms_class");
    const abschnitt = s.slice(von, bis);
    expect(abschnitt.split("del: null").length - 1, "beide Sammlungen brauchen del: null").toBe(2);
  });

  it("trägt das Feld `klassenmatchAus` an der Klasse - und die Kinder dürfen es lesen", () => {
    const s = setup();
    expect(s).toContain('B("klassenmatchAus")');
    // Die view-Regel der Klasse lässt das Kind seine eigene Klasse sehen.
    expect(s).toContain("(${TT_PUPIL} && @request.auth.classCode = code)");
  });

  it("hat einen eindeutigen Index je Match und Kind - eine Zeile, nicht zwei", () => {
    expect(setup()).toContain(
      "CREATE UNIQUE INDEX `idx_tt_ms_match_pupil` ON `tt_match_stand` (`matchId`, `pupilUid`)",
    );
  });
});

// ── (b) Der Hook ────────────────────────────────────────────────────────────

describe("(b) Die Grenzen und Zeiten im Hook", () => {
  it("ist syntaktisch gültig und meldet keine Route an", () => {
    const h = hook();
    // Eine Wurzelroute `"/"` wäre ein Alles-Fänger
    // ([[reference_pocketbase_wurzelroute_falle]]) - dieser Hook hat gar keine.
    expect(h).not.toMatch(/routerAdd\(/);
  });

  it("★★★ setzt den Namen des Gastgebers SELBST - nie aus dem Rumpf", () => {
    const h = hook();
    expect(h).toContain('e.record.set("hostName", String(kind.getString("name") || ""));');
    expect(h).toContain('e.record.set("hostUid", kind.id);');
  });

  /**
   * ★★★★★ DER NAME IN DER STAND-ZEILE GEHÖRT AUCH DEM SERVER (Befund des
   * Prüfers, 11.09.2026).
   *
   * `hostName` war geschützt, `name` nicht - und `name` ist das erste Feld
   * dieser Plattform, das ein Kind schreibt und ANDERE Kinder zu sehen
   * bekommen (Ranking, Wartefenster, Platzierungsliste, Alt + X). Frei
   * geschrieben hiesse: in der Liste seiner Klasse unter fremdem Namen stehen,
   * oder dort etwas hinschreiben, was kein Kind über sich lesen soll -
   * gesehen von der ganzen Klasse.
   *
   * WOHIN ER SICH BEWEGT, WENN ES SCHLECHTER WIRD: Wer den Namen wieder aus
   * dem Rumpf übernimmt, wird rot.
   */
  it("★★★★★ setzt auch den Namen in der Stand-Zeile SELBST - nie aus dem Rumpf", () => {
    const l = lib();
    expect(l).toContain('e.record.set("name", kind ? String(kind.getString("name") || "") : "");');
    // …und zwar bei BEIDEN Wegen, Anlegen wie Ändern - beide holen die Lib.
    const h = hook();
    expect(h.split("L.standVomServer(e)").length - 1, "create UND update").toBe(2);
  });

  /**
   * ★★★★★ ZU JEDER STAND-ZEILE MUSS ES DAS MATCH GEBEN (Befund des Prüfers,
   * 11.09.2026; gebaut am selben Tag).
   *
   * Die createRule prüft `pupilUid` und `classCode`, aber nicht `matchId`. Ein
   * Kind konnte darum beliebig viele Zeilen zu frei erfundenen Kennungen
   * anlegen: für niemanden sichtbar (gelesen wird nach `matchId` gefiltert) und
   * vom Cron nie aufgeräumt - der räumt Stand-Zeilen ausschliesslich über IHR
   * Match ab. Reines Wachstum in einer Datenbank, das niemand mehr findet.
   *
   * Der Preis ist EINE Abfrage je Anlegen - und angelegt wird eine Zeile einmal
   * je Kind und Match.
   */
  it("★★★★★ lässt keine Stand-Zeile zu einer erfundenen matchId anlegen", () => {
    const h = hook();
    expect(lib()).toContain("function matchMussEsGeben(e)");
    // Es muss das Match wirklich geben …
    expect(lib()).toContain('e.app.findRecordById("tt_matches", matchId)');
    // … es muss zur Klasse DIESES Kindes gehören …
    expect(lib()).toContain('String(match.getString("classCode") || "") !== meine');
    // … und es darf nicht schon vorbei sein.
    expect(lib()).toContain('status === "fertig" || status === "abgebrochen"');
    // Geprüft wird beim ANLEGEN - beim Ändern wäre es eine Abfrage alle drei
    // Sekunden und je Kind, und die Zeile ist dann längst da.
    const create = h.slice(h.indexOf('if (L.standVomServer(e)) return;'));
    expect(create).toContain("L.matchMussEsGeben(e);");
  });

  it("★★★ kennt seit 15.09.2026 KEINE Grenze mehr für offene Matches je Klasse", () => {
    // Johannes: „ich möchte dass mehr wie 2 match parallel laufen können" -
    // weder Lib noch Hook zählen die offenen Matches noch.
    expect(lib()).not.toContain("MAX_OFFENE_MATCHES");
    expect(hook()).not.toContain("MAX_OFFENE_MATCHES");
  });

  it("★★★ weist ab, wo die Lehrkraft das Match abgeschaltet hat (F8)", () => {
    const h = hook();
    expect(h).toContain('klasse.getBool("klassenmatchAus")');
    expect(h).toMatch(/ausgeschaltet/);
  });

  it("★★★ lässt nur die erlaubten Übergänge zu", () => {
    const h = lib();
    expect(h).toContain("einladung: [\"countdown\", \"abgebrochen\"]");
    expect(h).toContain("countdown: [\"laeuft\", \"fertig\", \"abgebrochen\"]");
    expect(h).toContain("laeuft: [\"fertig\", \"abgebrochen\"]");
    // Ein fertiges Match lässt sich nicht zurückdrehen.
    expect(h).toContain("fertig: []");
    expect(h).toContain("abgebrochen: []");
  });

  it("★★★★★ setzt startMs und endeMs selbst - genau beim Übergang nach countdown", () => {
    const h = hook();
    expect(lib()).toContain("const COUNTDOWN_MS = 10 * 1000;");
    expect(lib()).toContain("const MATCH_DAUER_MIN = 5;");
    expect(h).toContain('if (nachher === "countdown" && vorher === "einladung")');
    expect(h).toContain("const start = Date.now() + L.COUNTDOWN_MS;");
    expect(h).toContain('e.record.set("endeMs", start + Math.round(dauerMin * 60 * 1000));');
    // In JEDEM anderen Fall bleiben die Zeiten stehen - ein Kind gibt sich
    // weder mehr Zeit noch zieht es das Ende der anderen vor.
    expect(h).toContain('e.record.set("startMs", alt.getFloat("startMs"));');
  });

  it("★★★ räumt jede Minute auf: auslaufen, abbrechen, löschen (F10)", () => {
    const h = hook();
    expect(h).toContain('cronAdd("tt_match_aufraeumen", "* * * * *"');
    // Einladungen ohne Start - der Cron ist seit 15.09.2026 nur noch das NETZ
    // (der Gastgeber-Client sagt nach 30 s selbst ab, `useKlassenmatch`), darum
    // reicht dem Cron eine Minute Frist statt der früheren zehn.
    expect(h).toContain("const EINLADUNG_FRIST = 60 * 1000;");
    expect(h).toContain("status = 'einladung' && createdMs > 0 && createdMs < {:frist}");
    // Abgelaufene Matches schliessen.
    expect(h).toContain("endeMs > 0 && endeMs < {:jetzt}");
    // Und nach einer Stunde alles löschen - die Stand-Zeilen ZUERST.
    expect(h).toContain("const AUFRAEUMEN_NACH = 60 * 60 * 1000;");
    const loeschen = h.slice(h.indexOf("AUFRAEUMEN_NACH"));
    expect(loeschen.indexOf("tt_match_stand")).toBeLessThan(loeschen.indexOf("$app.delete(rec)"));
  });

  it("★ wiederholt die Fristen IM Cron - er sieht nichts aus dem Dateikopf", () => {
    // [[reference_pocketbase_hook_scope]]: `cronAdd` läuft in einem eigenen
    // Bereich. Eine Konstante von oben wäre dort `undefined`, und der Lauf
    // löschte entweder nichts oder alles.
    const h = hook();
    const cron = h.slice(h.indexOf('cronAdd("tt_match_aufraeumen"'));
    expect(cron).toContain("const EINLADUNG_FRIST =");
    expect(cron).toContain("const AUFRAEUMEN_NACH =");
    expect(cron).not.toContain("MAX_OFFENE_MATCHES");
  });

  it("trägt den Deploy-Hinweis im Kopf", () => {
    expect(hook()).toMatch(/Update LMS \(komplett\)/);
  });
});

// ── (c) Client und Server sagen dasselbe ────────────────────────────────────

describe("(c) Dieselben Zahlen auf beiden Seiten", () => {
  it("★★ Dauer und Countdown stimmen zwischen Hook und Client überein", async () => {
    const { MATCH_DAUER_MIN, MATCH_COUNTDOWN_MS, MATCH_AUFRAEUM_MS } = await import(
      "@/lib/typing/klassenmatch"
    );
    const h = hookUndLib();
    expect(h).toContain(`const MATCH_DAUER_MIN = ${MATCH_DAUER_MIN};`);
    expect(h).toContain(`const COUNTDOWN_MS = ${MATCH_COUNTDOWN_MS / 1000} * 1000;`);
    expect(h).toContain(`const AUFRAEUMEN_NACH = ${MATCH_AUFRAEUM_MS / 60_000} * 60 * 1000;`);
  });

  /*
    ★ Die Einladungsfrist ist seit 15.09.2026 KEINE gemeinsame Zahl mehr - der
    Client sagt nach 30 Sekunden selbst ab (`useKlassenmatch`), der Server-
    Cron ist nur das gröbere Netz darunter und tickt ohnehin nur je Minute
    (siehe Kommentar im Hook). Zwei verschiedene Zahlen sind hier also keine
    Doppelung, die auseinanderlaufen könnte, sondern zwei verschiedene Fragen.
  */
  it("★ die 30-Sekunden-Frist des Clients ist strenger als das Netz des Servers", async () => {
    const { MATCH_EINLADUNG_FRIST_MS } = await import("@/lib/typing/klassenmatch");
    expect(MATCH_EINLADUNG_FRIST_MS).toBe(30_000);
    expect(hook()).toContain("const EINLADUNG_FRIST = 60 * 1000;");
  });
});
