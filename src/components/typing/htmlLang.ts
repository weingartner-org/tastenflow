import type { BedienSprache } from "@/lib/bedienSprache";

/**
 * ★ O2-COMP (30.10.2026): das `lang`-Attribut eines Bereichs in der Bedienungssprache. Die interne Kennung „br" ist KEIN
 * Sprach-Tag: als `lang="br"` hiesse sie Bretonisch, und eine Sprachausgabe läse Brasilianisch-Portugiesisch falsch aus.
 * Deutsch bekommt kein Attribut (wie bisher), alle anderen Kennungen sind schon gültige Tags.
 */
export function htmlLang(sprache: BedienSprache): string | undefined {
  if (sprache === "de") return undefined;
  return sprache === "br" ? "pt-BR" : sprache;
}
