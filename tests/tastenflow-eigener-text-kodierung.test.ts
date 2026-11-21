/**
 * ★★★★★ DIE UMLAUTE FEHLTEN (3. Klasse HAS, 23.09.2026).
 *
 * Die Lehrkraft lud „Konzentration.txt" für eine Tippchallenge hoch: *„Das
 * Programm hat dabei alle Umlaute entfernt."* Am Server stand
 * „berlegen Sie grundstzlich" - das GANZE Ü fehlte. Das ist die Spur einer
 * Datei, die Windows als „ANSI" (Windows-1252) gespeichert hat: ü ist dort
 * ein einzelnes Byte 0xFC, und das ist kein gültiges UTF-8. Die App las jede
 * `.txt` als UTF-8, machte daraus „�" (liegt auf keiner Taste) und nahm es
 * beim Start heraus.
 *
 * Nachgestellt mit dem Anfang des echten Textes, Byte für Byte so, wie der
 * Windows-Editor ihn speichert.
 */
import { describe, expect, it } from "vitest";
import {
  dekodiereTextdatei,
  entferneUntippbareZeichen,
  verarbeiteEigenenText,
} from "@/lib/typing/eigenerText";

const TEXT =
  "Konzentration\r\n\r\nÜberlegen Sie grundsätzlich, welche Arbeit den Vorrang hat. " +
  "Nützen Sie eine gut erledigte Arbeit als Ansporn. Ruhen Sie sich nicht auf Ihren \"Lorbeeren\" aus. " +
  "Stellen Sie sich 'Belohnungen' in Aussicht - größer, Maß.";

/** So speichert der Windows-Editor „ANSI": ein Byte je Zeichen (hier alles < 256). */
function alsWindows1252(text: string): Uint8Array {
  return Uint8Array.from([...text].map((z) => {
    const c = z.charCodeAt(0);
    if (c > 255) throw new Error(`nicht in Windows-1252 dieses Tests: ${z}`);
    return c;
  }));
}

function alsUtf16le(text: string, mitBom: boolean): Uint8Array {
  const bytes: number[] = mitBom ? [0xff, 0xfe] : [];
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    bytes.push(c & 0xff, c >> 8);
  }
  return Uint8Array.from(bytes);
}

describe("★★★★★ eine .txt vom Windows-Editor behält ihre Umlaute", () => {
  it("Gegenprobe: blind als UTF-8 gelesen (Stand bis 23.09.) werden die Umlaute zu „�“ und beim Start entfernt", () => {
    const alt = new TextDecoder("utf-8").decode(alsWindows1252(TEXT));
    const v = verarbeiteEigenenText(alt, { verbietenSs: true });
    expect(v.unbekannt).toContain("�");
    const gestartet = entferneUntippbareZeichen(v.zeilen, new Set(v.unbekannt));
    // Genau das stand am Server:
    expect(gestartet[1]).toBe("berlegen Sie grundstzlich, welche");
  });

  it("Windows-1252 (ANSI): alle Umlaute bleiben, nichts liegt „auf keiner Taste“", () => {
    const text = dekodiereTextdatei(alsWindows1252(TEXT));
    expect(text).toBe(TEXT);
    const v = verarbeiteEigenenText(text, { verbietenSs: false });
    expect(v.unbekannt).toEqual([]);
    expect(v.zeilen[0]).toBe("Konzentration");
    expect(v.zeilen[1]).toBe("Überlegen Sie grundsätzlich, welche");
  });

  it("UTF-8 (der Normalfall) bleibt Zeichen für Zeichen, wie er war", () => {
    expect(dekodiereTextdatei(new TextEncoder().encode(TEXT))).toBe(TEXT);
  });

  it("UTF-8 mit Kennzeichen (BOM): das Kennzeichen wird kein Zeichen der ersten Zeile", () => {
    const mitBom = Uint8Array.from([0xef, 0xbb, 0xbf, ...new TextEncoder().encode(TEXT)]);
    expect(dekodiereTextdatei(mitBom)).toBe(TEXT);
  });

  it("„Unicode“ aus dem Windows-Editor (UTF-16 LE mit Kennzeichen)", () => {
    expect(dekodiereTextdatei(alsUtf16le(TEXT, true))).toBe(TEXT);
  });

  it("ein leerer oder winziger Inhalt bricht nichts", () => {
    expect(dekodiereTextdatei(new Uint8Array())).toBe("");
    expect(dekodiereTextdatei(Uint8Array.from([0xfc]))).toBe("ü");
  });
});
