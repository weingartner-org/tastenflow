/**
 * ★ O-TR (02.10.2026): DIE NAMEN DER STARTPUNKTE TÜRKISCH.
 *
 * Bauart wie `startpunktePl.ts`: `startPoints(sprache, lernweg)` in `letters.ts`
 * rechnet die sieben Landmarken und beschriftet sie - für "tr" bis hierher
 * englisch (`mitRueckfallEn`). `letters.ts` bleibt in Etappe O unberührt;
 * darum stehen die türkischen Namen HIER: dieselben Einheiten (`units`, `key`)
 * wie `startPoints`, nur die Beschriftung türkisch. Die Einheiten kommen aus
 * dem Weg des Kindes - auf Weg "tr" aus der eigenen Reihenfolge (F4-tr).
 *
 * Namen nach dem Glossar (`recherche-tuerkisch-2026-10-02/GLOSSAR-tr.md`
 * §2.1/§2.2): *temel konum*, *temel sıra*, *büyük harf*, *noktalama
 * işaretleri*, *sayılar*, *simgeler*. Die Grundreihe steht nach einem
 * Doppelpunkt - ohne Endung (Regel 6).
 */
import type { Lernweg } from "./lernweg";
import { startPoints, type StartPoint } from "./letters";

/** Die Grundreihe aus dem englischen Namen ("Home position (whole home row f j d k ...)"). */
function reiheAus(label: string): string {
  return /\(whole home row (.*)\)$/.exec(label)?.[1] ?? "";
}

/** Die sieben Namen je Landmarke (`key` aus `startPoints`). */
function nameTr(key: string, reihe: string): string | null {
  switch (key) {
    case "anfaenger":
      return "Yeni başlayan: sadece F ve J";
    case "start":
      return `Temel konum (bütün temel sıra: ${reihe})`;
    case "gross":
      return "İlk harfler + büyük harfler";
    case "buchstaben":
      return "Bütün harfler (büyük harflerle)";
    case "satz":
      return "+ noktalama işaretleri";
    case "zahlen":
      return "+ sayılar";
    case "alles":
      return "Hepsi (simgeler de)";
    default:
      return null;
  }
}

/** Die Startpunkte mit türkischen Namen - dieselben Einheiten wie {@link startPoints}. */
export function startPointsTr(lernweg: Lernweg): StartPoint[] {
  const en = startPoints("en", lernweg);
  const reihe = reiheAus(en.find((p) => p.key === "start")?.label ?? "");
  return en.map((p) => ({ ...p, label: nameTr(p.key, reihe) ?? p.label }));
}
