/**
 * Die Bedienungssprache von Tastenflow - seit 12.09.2026 gebaut, seit
 * 19.09.2026 für jeden (ohne Probe-Schalter).
 * Bauplan: `apps/tastenflow/BAUPLAN-2026-09-12-ENGLISCHE-BEDIENUNG-PROBESTUECK.md`.
 */
export {
  BEDIENUNG_SCHLUESSEL,
  WAHL_PARAMETER,
  adressWahlLesen,
  aktuelleBedienSprache,
  kontoBedienSprache,
  anfangsSprache,
  browserSprachen,
  dezimalzeichen,
  esZahlGebietAus,
  erkenneBedienSprache,
  geraetKenntTastenflow,
  gespeicherteWahl,
  istTastenflowMerker,
  wahlMerken,
  type AktiveBedienSprache,
  type BedienSprache,
} from "./sprache";
export { GEBIET, dezimal, mehrzahl, texte, zahl, zahlGebiet } from "./texte";
export { waehleUebersetzung, type Uebersetzungen } from "./uebersetzungsWahl";
export {
  BedienSpracheProvider,
  FesteBedienSprache,
  SPRACHE_GEWECHSELT,
  useBedienSprache,
  useBeimSprachSchalter,
  type BedienSpracheProviderProps,
  type BedienSpracheWert,
} from "./BedienSpracheProvider";
