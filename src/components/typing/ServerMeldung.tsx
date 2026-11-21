/**
 * Ein Satz vom Server (oder aus dem Backend), in der Sprache der Bedienung
 * (EN2, 19.09.2026). Die Tabelle steht in `lib/typing/serverMeldungen.ts`.
 *
 * ★ Deutsch: genau der Text, als EIN Textknoten - wie vorher `{error}`.
 * ★ Englisch: der englische Satz, oder - wo die Tabelle ihn nicht kennt - der
 *   deutsche in `<span lang="de">`, damit eine Sprachausgabe ihn deutsch liest.
 */
import { useBedienSprache } from "@/lib/bedienSprache";
import { serverMeldung } from "@/lib/typing/serverMeldungen";

export function ServerMeldung({ text }: { text: string }) {
  const { sprache } = useBedienSprache();
  const m = serverMeldung(text, sprache);
  return m.lang ? <span lang={m.lang}>{m.text}</span> : <>{m.text}</>;
}
