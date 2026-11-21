/**
 * Typen für die UEB-Build-Skripte (Node .mjs), damit der Progressionstest sie
 * typsicher importieren kann. Die Skripte selbst sind reines Node (kein TS).
 */
declare module "*/ueb-inventory.mjs" {
  export interface UebInvUnit {
    key: string; form: string; print: string; meaning: string;
    kind: string; standalone?: boolean; base?: string;
  }
  export interface UebInvLesson {
    n: number; module: 1 | 2; title: string; units: UebInvUnit[];
  }
  export const UEB_LESSONS: UebInvLesson[];
  export function allowedThrough(n: number): Set<string>;
}

declare module "*/ueb-checker.mjs" {
  export function translate(text: string): string;
  export function parseRules(): Map<string, Set<string>>;
  export function cellOfForm(form: string, rules: Map<string, Set<string>>): string | null;
  export function shortformList(): Map<string, string>;
  export function letterCells(): Map<string, string>;
  export function makeChecker(
    allowed: Set<string>,
    extra?: Map<string, string>,
  ): {
    checkWord(word: string): { ok: boolean; braille?: string; skipped?: boolean };
    checkSentence(sentence: string): { ok: boolean; bad: unknown[] };
  };
}
