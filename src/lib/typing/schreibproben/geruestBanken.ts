/**
 * ★ G3c-VERTEILER (25.10.2026): DIE TIPPCHALLENGE-BÄNKE DER NEUN GERÜST-WEGE AN EINER STELLE.
 *
 * Jeder Weg bg, el, hu, nl, pt, br, ro, sv, uk hat seine Datei `bank<Xx>.ts` mit je einem Lader je Niveau (`import()` der Bank-Datei
 * `texte<Niveau><Xx>.ts`, ausgeschrieben - Vite löst keinen Vorlagen-Pfad auf). Die Verteiler `schreibproben/index.ts` (`ladeTexte`,
 * `ladeWoerter`) und `schreibprobe.ts` (`niveauHatBank`) fragen hier:
 *   · hat der Weg noch KEINEN Lader ⇒ `null` ⇒ die ENGLISCHE Bank wie im Gerüst (`BANK_JE_WEG`, RÜCKFALL-EN G2-NEUN);
 *   · hat er einen ⇒ seine EIGENE Bank: Niveaus mit Lader werden angeboten, Niveaus ohne Lader NICHT (nie die englische, nie die
 *     deutsche - wie cs mit `CS_NIVEAUS_GEFUELLT`).
 * Dazu `scripts/pruefe-schreibproben.mts` (`WEGE_OHNE_EIGENE_BANK`) - das nachzuziehen ist Auftrag der RETO-Etappe der Sprache.
 */
import type { ProbenNiveau } from "../schreibprobe";
import type { Lernweg } from "../lernweg";
import type { Probentext } from "./index";
import { istGeruestSprache, type GeruestSprache } from "../sprachRegister";
import { BANK_BG } from "./bankBg";
import { BANK_EL } from "./bankEl";
import { BANK_HU } from "./bankHu";
import { BANK_NL } from "./bankNl";
import { BANK_PT } from "./bankPt";
import { BANK_BR } from "./bankBr";
import { BANK_RO } from "./bankRo";
import { BANK_SV } from "./bankSv";
import { BANK_UK } from "./bankUk";

/** Was ein Gerüst-Weg für die Tippchallenge liefert. */
export interface GeruestBank {
  /** Je Niveau ein Lader der Bank (`async () => (await import("./texteStartBg")).TEXTE`). Ein Niveau ohne Lader wird nicht angeboten. */
  texte: Readonly<Partial<Record<ProbenNiveau, () => Promise<Probentext[]>>>>;
  /** Lader der Vorlese-Wörter je Niveau (Vorbild `woerterCs.ts`) - `null`: keine (dann wird buchstabiert). */
  woerter: (() => Promise<Partial<Record<ProbenNiveau, readonly string[]>>>) | null;
}

const BANKEN: Readonly<Record<GeruestSprache, GeruestBank>> = {
  bg: BANK_BG,
  el: BANK_EL,
  hu: BANK_HU,
  nl: BANK_NL,
  pt: BANK_PT,
  br: BANK_BR,
  ro: BANK_RO,
  sv: BANK_SV,
  uk: BANK_UK,
};

/** Die eigene Bank eines Gerüst-Weges - `null`, solange sie keinen Lader hat (oder der Weg kein Gerüst-Weg ist). */
export function geruestBank(lernweg: Lernweg): GeruestBank | null {
  if (!istGeruestSprache(lernweg)) return null;
  const bank = BANKEN[lernweg];
  return Object.keys(bank.texte).length > 0 ? bank : null;
}
