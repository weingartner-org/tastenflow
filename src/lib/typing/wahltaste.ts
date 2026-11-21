/**
 * ★ DIE ALT-TASTE AM MAC - in der Sprache der Bedienung (18.10.2026, Kürzel
 * einheitlich, Johannes: „beim Mac überall ‚Wahl', wenn nicht, dann mit Fußnote").
 *
 * Die Kürzel-Liste (Alt + T, `TippenTrainerPage.tsx`) und die Hilfe
 * (`TippenHilfe*.tsx`, „Wichtige Tasten") schreiben am Mac „Wahl + O" statt
 * „Alt + O" - über `altAnzeige` aus `lib/altTaste.ts`, mit dem Wort von hier.
 *
 * ⚠️ Die Wörter sind DIESELBEN wie `wahltaste` in der gemeinsamen Kopfzeile
 * (`AppKopfzeile.tsx`, je Sprache). Dort sind sie nicht ausgeführt; wer eines
 * ändert, ändert beide - sonst heißt dieselbe Taste oben anders als in der Liste.
 */
import type { BedienSprache } from "@/lib/bedienSprache";
// relativ (nicht „@/"): das Handbuch-Skript lädt diese Datei in Node.
import { istMacSystem } from "../altTaste";

/** Das Wort für die Wahltaste (⌥) - wie `wahltaste` der Kopfzeile. */
export const WAHLTASTE: Readonly<Record<BedienSprache, string>> = {
  de: "Wahl",
  en: "Option",
  fr: "Option",
  es: "Opción",
  it: "Opzione",
  pl: "Option",
  tr: "Option",
  cs: "Option",
  // ★ O2-LIB (30.10.2026): „Option" steht so auf der Taste (wie cs, pl, tr).
  bg: "Option",
  el: "Option",
  hu: "Option",
  nl: "Option",
  pt: "Option",
  br: "Option",
  ro: "Option",
  sv: "Option",
  uk: "Option",
};

/**
 * Der eine Satz, der am Mac statt der Fußnote „Alt + Taste. Auf dem Mac: …"
 * steht: Die Liste schreibt dort schon „Wahl", es bleibt nur das Zeichen ⌥ zu
 * nennen, das auf der Taste steht.
 */
export const WAHLTASTE_SATZ: Readonly<Record<BedienSprache, string>> = {
  de: "Wahl ist die Wahltaste (⌥).",
  en: "Option is the ⌥ key.",
  fr: "Option est la touche ⌥.",
  es: "Opción es la tecla ⌥.",
  it: "Opzione è il tasto ⌥.",
  pl: "Option to klawisz ⌥.",
  tr: "Option, ⌥ tuşudur.",
  cs: "Option je klávesa ⌥.",
  // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: "Option е клавишът ⌥.",
  el: "Το Option είναι το πλήκτρο ⌥.",
  hu: "Az Option a ⌥ billentyű.",
  nl: "Option is de toets ⌥.",
  pt: "Opção é a tecla ⌥.",
  br: "Option é a tecla ⌥.",
  ro: "Opțiune este tasta ⌥.",
  sv: "Alternativ är tangenten ⌥.",
  uk: "Option - це клавіша ⌥.",
};

/*
 * ★★ „WAHL" AUCH IM FLIESSTEXT (18.10.2026, Johannes: „passe mac an Wahl-taste an").
 *
 * Liste und Hilfe-Tabelle schrieben am Mac schon „Wahl + O" - aber überall, wo
 * ein Kürzel in einem SATZ steht, stand weiter „Alt": in der Hilfe „(Alt + O)",
 * in den Einstellungen „Alt und Plus, Alt und Minus", in der Ansage nach dem
 * Überspringen der Einrichtung „Mit Alt und R …", im Rundgang, in „Tasten
 * erkunden". Am Mac steht auf der Taste aber ⌥ und daneben „option" - ein Kind,
 * das „Alt" sucht, findet sie nicht.
 *
 * ⚠️ LERNSTOFF BLEIBT. Tastenflow lehrt die Tasten der Tastatur selbst (Tasten
 * erkunden, AltGr-Zeichen, Finger). Wo „Alt" die TASTE ist, die das Kind lernt,
 * wird nichts getauscht - darum gehen nur die Texte durch {@link wahlText}, die
 * ein App-Kürzel nennen, und der Ausdruck lässt die Taste AltGr in jeder
 * Schreibung stehen („AltGr", „Alt Gr", „Alt-Gr"), dazu die rechte Alt-Taste
 * („prawy Alt", „pravý Alt", „sağ Alt", „right Alt", „rechte Alt"), Wörter, in
 * denen „Alt" nur vorkommt („Altı", „Altersstufe"), „Alt-Taste"/„Alt-Code" und
 * Strg/Ctrl + Alt (Kürzel von Windows oder NVDA, keine von Tastenflow) samt
 * „Strg und Alt" / „Ctrl and Alt" (zwei Tasten, die das Kind kennenlernt).
 */
const ALT_KUERZEL =
  /(?<![\p{L}\p{N}])(?<!(?:prawy|prawym|prawego|pravý|pravým|sağ|right|Right|rechte|rechten) )(?<!(?:Strg|Ctrl) (?:\+|und|and|et|y|e|i|ve|a) )Alt(?![\p{L}\p{N}]|[ -]?Gr|-)/gu;

/**
 * Ein Satz für dieses Gerät: am Mac jedes App-Kürzel „Alt" ⇒ das Wort der
 * Sprache (`WAHLTASTE`, „Wahl", „Option" …), sonst unverändert.
 */
export function wahlText(text: string, sprache: BedienSprache, mac: boolean = istMacSystem()): string {
  if (!mac || !text.includes("Alt")) return text;
  return text.replace(ALT_KUERZEL, WAHLTASTE[sprache]);
}

/**
 * Eine ganze Text-Tabelle einer Sprache (`TEXTE[sprache]`) für dieses Gerät:
 * jede Zeichenkette über {@link wahlText}, Funktionen liefern ihr Ergebnis
 * ebenso (`(n) => \`… Alt + R …\``), Felder und Listen werden durchlaufen.
 * React-Elemente und alles andere bleiben, wie sie sind. Ohne Mac kommt
 * dieselbe Tabelle zurück (dasselbe Objekt). In Bauteilen mit `useMemo`
 * aufrufen - sonst ist die Tabelle bei jedem Zeichnen neu.
 */
export function wahlTexte<T>(tabelle: T, sprache: BedienSprache, mac: boolean = istMacSystem()): T {
  if (!mac) return tabelle;
  const um = (wert: unknown): unknown => {
    if (typeof wert === "string") return wahlText(wert, sprache, true);
    if (typeof wert === "function")
      return (...args: unknown[]) => um((wert as (...a: unknown[]) => unknown)(...args));
    if (Array.isArray(wert)) return wert.map(um);
    if (wert && typeof wert === "object" && !("$$typeof" in wert) && Object.getPrototypeOf(wert) === Object.prototype)
      return Object.fromEntries(Object.entries(wert).map(([k, v]) => [k, um(v)]));
    return wert;
  };
  return um(tabelle) as T;
}
