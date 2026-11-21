/**
 * WÄCHTER über die SERVER-SEITE von „Meine Texte" (E8, 19.09.2026).
 *
 * Johannes' Auftrag (Entwurf-Dokument §7a, Frage 7): *„die Dateien gehören
 * aber zu den Konten und nicht zur Klasse"* - und *„‚Meine Texte' nur im
 * eigenen Konto, kein Teilen."* Anders als bei `tt_eigene_texte` (Kinder EINER
 * Klasse lesen mit, mehrere Lehrkräfte einer Klasse teilen sich die Zeile)
 * darf hier NIEMAND ausser der Eigentümer-Lehrkraft selbst etwas sehen - kein
 * Kind, keine andere Lehrkraft, nicht einmal eine Co-Lehrkraft derselben
 * Klasse.
 *
 * ⚠️ WAS DIESER WÄCHTER NICHT BEWEIST - und das ist wichtig: Er liest
 * `setup.mjs` als TEXT. Dass PocketBase die Regeln so AUSWERTET, wie sie
 * dastehen, sieht er nicht ([[reference_pocketbase_antwort_umgeht_viewrule]]).
 * Der Live-Beweis (Superuser + Impersonation) ist Sache der Abnahme nach dem
 * Deploy „Update LMS (komplett)" - siehe `tests/pocketbase-hook-scope.test.ts`.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function lies(pfad: string): string {
  return readFileSync(resolve(process.cwd(), pfad), "utf8");
}

const setup = () => lies("pocketbase/setup.mjs");

/** Nur den Abschnitt DIESER Sammlung - sonst träfen Suchen Nachbar-Sammlungen. */
function abschnittMeineTexte(s: string): string {
  const von = s.indexOf('"tt_meine_texte"');
  const bis = s.indexOf("idx_tt_mt_teacher");
  expect(von, "tt_meine_texte fehlt in setup.mjs").toBeGreaterThan(0);
  expect(bis, "idx_tt_mt_teacher fehlt (Abschnittsende)").toBeGreaterThan(von);
  return s.slice(von, bis);
}

describe("tt_meine_texte - die Textablage EINER Lehrkraft", () => {
  it("★★★★★ trägt die drei Felder aus dem Auftrag (teacherUid, dateiname, createdAtMs)", () => {
    const a = abschnittMeineTexte(setup());
    expect(a).toContain('T("teacherUid")');
    expect(a).toContain('T("dateiname")');
    expect(a).toContain('N("createdAtMs")');
  });

  it("★★★★★ alle fünf Regeln hängen an @request.auth.id = teacherUid - sonst nichts", () => {
    const a = abschnittMeineTexte(setup());
    // list/view/del: genau die Eigentümer-Regel, kein `||` daneben - eine
    // ODER-Verknüpfung wäre bereits das Teilen, das es nicht geben soll.
    for (const regel of ["list", "view", "del"]) {
      const re = new RegExp(`${regel}: ttOwnerTeacher\\("teacherUid"\\),`);
      expect(a, `${regel} ist nicht (nur) ttOwnerTeacher("teacherUid")`).toMatch(re);
    }
    // create: dieselbe Eigentümer-Regel, nur auf das BODY-Feld bezogen - die
    // Zeile existiert beim Anlegen noch nicht.
    expect(a).toContain('create: ttOwnerTeacher("@request.body.teacherUid"),');
  });

  it("★★★★★ NIEMAND ausser der Eigentümer-Lehrkraft kommt herein - keine Klasse, kein Kind", () => {
    const a = abschnittMeineTexte(setup());
    // Anders als `tt_eigene_texte`: kein classCode-Feld, keine Klassen-Regel,
    // keine Kind-Regel, keine Co-Lehrkraft.
    expect(a).not.toContain("classCode");
    expect(a).not.toContain("TT_PUPIL");
    expect(a).not.toContain("ttClassStaff");
    expect(a).not.toContain("ttCoTeacher");
    expect(a).not.toContain("ttOwnsClass");
    // Kein `||` in list/view/create/del - jede Alternative dort wäre Teilen.
    // (Die `update`-Regel trägt bewusst ein `||` - kein Teilen, sondern der
    // isset-Wächter, der `teacherUid` unveränderlich macht, siehe unten.)
    for (const regel of ["list:", "view:", "create:", "del:"]) {
      const start = a.indexOf(regel);
      expect(start, `${regel} fehlt`).toBeGreaterThanOrEqual(0);
      const zeile = a.slice(start, a.indexOf("\n", start));
      expect(zeile, `${zeile} enthält ein Oder - das wäre Teilen`).not.toContain("||");
    }
  });

  it("★★★ update ist erlaubt (anders als bei tt_eigene_texte), aber teacherUid bleibt unveränderlich", () => {
    const a = abschnittMeineTexte(setup());
    expect(a).toContain("update: `${ttOwnerTeacher(\"teacherUid\")}");
    expect(a).toContain(
      "@request.body.teacherUid:isset = false || @request.body.teacherUid = teacherUid",
    );
  });

  it("★★ liegt NACH tt_eigene_texte (dieselbe Nachbarschaft, dieselbe Bauart)", () => {
    const s = setup();
    expect(s.indexOf('"tt_eigene_texte"')).toBeGreaterThan(0);
    expect(s.indexOf('"tt_meine_texte"')).toBeGreaterThan(s.indexOf('"tt_eigene_texte"'));
  });
});
