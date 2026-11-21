/**
 * ★ Die Tastatur-Erkennung als React-Wert (W2b, 28.09.2026) - EINE Erkennung
 * für die ganze Seite (Einrichtung, Vorschlag über der Übung, Rückfrage beim
 * Sprachwechsel), nicht drei Horcher nebeneinander.
 *
 * Chromium: `getLayoutMap()` beim ersten Gebrauch und bei jeder Rückkehr ins
 * Fenster (wer die Windows-Belegung umschaltet, wechselt meist das Fenster).
 * Firefox/Safari: die Regel aus echten Tastendrücken (`TastenSammler`) - der
 * Horcher hört nur zu (`passive`), er verhindert nichts und ändert nichts.
 * Nur auf SICHER Windows (`tastenErkennungMoeglich`, 28.09.2026).
 * Mac: gar nicht (`erkennungMoeglich`, Begründung in `tastaturErkennung.ts`).
 *
 * ⚠️ Der Plakat-Fund vom 28.09.2026 („der Streifen nimmt den Fokus") war
 * NICHT dieser Vorschlag, sondern das Merkfenster zur falschen Umschalttaste
 * - gemessen am Live-Stand, `BEFUND-2026-09-28-VORSCHLAG-FOKUS.md`. Dass der
 * Streifen beim Erscheinen mitten im Tippen weder den Fokus nimmt noch die
 * Übung neu aufbaut, bewacht `tests/tastenflow-vorschlag-fokus.test.tsx`.
 */
import { useEffect, useSyncExternalStore } from "react";
import { ITALIENISCHE_EIGENE_LAYOUT_IDS, TASTATUREN_DER_SPRACHE, TSCHECHISCHE_LAYOUT_IDS, TUERKISCHE_LAYOUT_IDS, layoutPlattform, type LayoutId } from "@/lib/typing/layouts";
import { GERUEST_LEHRGAENGE, geruestLehrgangProben, italienischLehrgangProbeAn, tschechischLehrgangProbeAn, tuerkischLehrgangProbeAn } from "@/lib/typing/lehrgangSchalter";
import {
  TastenSammler,
  erkenneTastatur,
  erkennungMoeglich,
  leseSystemBelegung,
  tastenErkennungMoeglich,
  type TastaturErkannt,
} from "@/lib/typing/tastaturErkennung";

let erkannt: TastaturErkannt | null = null;
let gestartet = false;
let ausSystem = false;
const hoerer = new Set<() => void>();
const sammler = { jetzt: new TastenSammler() };

function gleich(a: TastaturErkannt | null, b: TastaturErkannt | null): boolean {
  if (a === b) return true;
  if (!a || !b || a.art !== b.art) return false;
  return a.art === "app" ? a.id === (b as typeof a).id : a.name === (b as typeof a).name;
}

function setze(neu: TastaturErkannt | null) {
  if (gleich(erkannt, neu)) return;
  erkannt = neu;
  for (const h of hoerer) h();
}

function frageSystem() {
  void leseSystemBelegung().then((b) => {
    if (!b) return;
    ausSystem = true;
    const r = erkenneTastatur(b);
    if (r) setze(r);
  });
}

function onTaste(e: KeyboardEvent) {
  if (ausSystem) return;
  if (!sammler.jetzt.nimm(e)) return;
  const r = erkenneTastatur(sammler.jetzt);
  if (r) setze(r);
}

function starte() {
  if (gestartet || typeof window === "undefined") return;
  if (!erkennungMoeglich(layoutPlattform())) return;
  gestartet = true;
  frageSystem();
  // ★ Aus Tastendrücken nur auf SICHER Windows (`tastenErkennungMoeglich`) -
  // Chromebook, Linux, Android zählen bei `layoutPlattform` als „windows",
  // an ihren Belegungen ist die Regel aber nicht gemessen.
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  if (tastenErkennungMoeglich(nav.userAgent, nav.userAgentData?.platform)) {
    document.addEventListener("keydown", onTaste, { capture: true, passive: true });
  }
  window.addEventListener("focus", frageSystem);
}

/** Nur für Tests: alles vergessen und die Horcher abmelden. */
export function erkennungZuruecksetzen(): void {
  if (typeof window !== "undefined") {
    document.removeEventListener("keydown", onTaste, { capture: true });
    window.removeEventListener("focus", frageSystem);
  }
  erkannt = null;
  gestartet = false;
  ausSystem = false;
  sammler.jetzt = new TastenSammler();
  for (const h of hoerer) h();
}

function abonniere(fn: () => void) {
  hoerer.add(fn);
  return () => {
    hoerer.delete(fn);
  };
}
const lies = () => erkannt;

/**
 * ★ F3-it (02.10.2026): Die italienischen Tastaturen gibt es nur hinter `?italienisch-lehrgang=1`
 * (unsichtbar bis zur Freigabe). Eine ERKANNTE italienische Belegung darf dieses Gerät darum nicht
 * vorschlagen oder vorwählen, solange der Schalter aus ist - sonst führte der Streifen „Wir haben eine
 * andere Tastatur erkannt: Italienisch ... Übernehmen?" auch ein Kind auf Weg „de" in den versteckten
 * Teil. Die Erkennung selbst (`erkenneTastatur`) bleibt rein und kennt den Schalter nicht.
 */
function sichtbarErkannt(r: TastaturErkannt | null): TastaturErkannt | null {
  if (r?.art === "app" && ITALIENISCHE_EIGENE_LAYOUT_IDS.has(r.id) && !italienischLehrgangProbeAn()) return null;
  // ★ F3-tr (02.10.2026): ebenso die türkischen Tastaturen (`?tuerkisch-lehrgang=1`) - ein Kind mit einer türkischen
  // Tastatur auf Weg „de" bekam bisher keinen Vorschlag (die Erkennung sagte „unbekannt"); es soll auch jetzt keinen
  // in den versteckten Teil bekommen.
  if (r?.art === "app" && TUERKISCHE_LAYOUT_IDS.has(r.id) && !tuerkischLehrgangProbeAn()) return null;
  // ★ F3-cs (02.10.2026): ebenso die tschechischen Tastaturen (`?tschechisch-lehrgang=1`).
  if (r?.art === "app" && TSCHECHISCHE_LAYOUT_IDS.has(r.id) && !tschechischLehrgangProbeAn()) return null;
  // ★★★ G3b (25.10.2026): ebenso die Tastaturen der neun Gerüst-Sprachen - an der Menge der Sprache, nicht an Kennungen.
  if (r?.art === "app" && nurHinterAusgeschaltetemGeruest(r.id)) return null;
  return r;
}

/**
 * ★★★ G3b (25.10.2026): gehört die Tastatur NUR zu Gerüst-Sprachen (bg … uk), deren Schalter alle aus sind? Eine Tastatur,
 * die auch eine andere Sprache anbietet (`be`: Französisch UND Niederländisch), bleibt wie bisher sichtbar.
 */
function nurHinterAusgeschaltetemGeruest(id: LayoutId): boolean {
  const geruest = new Set<string>(GERUEST_LEHRGAENGE);
  const sprachen = (Object.keys(TASTATUREN_DER_SPRACHE) as (keyof typeof TASTATUREN_DER_SPRACHE)[]).filter((l) =>
    TASTATUREN_DER_SPRACHE[l].has(id),
  );
  if (sprachen.length === 0 || sprachen.some((l) => !geruest.has(l))) return false;
  const an = geruestLehrgangProben() as Readonly<Record<string, boolean>>;
  return !sprachen.some((l) => an[l] === true);
}

/** Die erkannte Tastatur - `null`, solange nichts sicher erkannt ist. */
export function useTastaturErkennung(): TastaturErkannt | null {
  useEffect(() => {
    starte();
  }, []);
  return sichtbarErkannt(useSyncExternalStore(abonniere, lies, lies));
}

/** Dasselbe ohne React - für Stellen, die im Augenblick einer Handlung fragen. */
export function erkannteTastatur(): TastaturErkannt | null {
  return sichtbarErkannt(erkannt);
}
