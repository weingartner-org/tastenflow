/**
 * ★ SPRACHEN-9 (30.10.2026): `<html lang>` nennt für die interne Kennung „br" das echte Sprach-Tag pt-BR, nie Bretonisch.
 */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

afterEach(cleanup);

describe("<html lang> für Brasilien", () => {
  const quelle = readFileSync(resolve(__dirname, "../src/lib/bedienSprache/BedienSpracheProvider.tsx"), "utf8");
  it("der Provider übersetzt br ⇒ pt-BR, bevor er das Attribut setzt", () => {
    expect(quelle).toContain('html.setAttribute("lang", sprache === "br" ? "pt-BR" : sprache)');
    expect(quelle).not.toMatch(/html\.setAttribute\("lang", sprache\)/);
  });
  it("Gegenprobe: das Bauteil-Gegenstück htmlLang sagt dasselbe", async () => {
    const { htmlLang } = await import("../src/components/typing/htmlLang");
    expect(htmlLang("br" as never)).toBe("pt-BR");
    expect(htmlLang("pt" as never)).toBe("pt");
    render(<div lang={htmlLang("br" as never)} />);
  });
});
