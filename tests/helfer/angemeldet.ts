/**
 * Testhilfe — angemeldet oder Gast (Charge P4, 22.08.2026).
 *
 * ── Warum es sie gibt ───────────────────────────────────────────────────────
 *
 * Seit P4 bietet die Übungsseite den Herunterladen-Knopf nur Angemeldeten an
 * (Memory `feedback_handbuecher_nur_angemeldet`: Unterrichtsmaterial steht
 * angemeldeten Lehrkräften und Kindern offen). Ein Probelauf, der den Weg eines
 * KINDES nachspielt, muss also auch dessen Anmeldung nachspielen — sonst misst
 * er den Weg eines Gastes und wundert sich über den fehlenden Knopf.
 *
 * ★ Eine Zeile an einer Stelle statt derselben Zeile in jeder Datei: Wer die
 * Bedingung eines Tages ändert (etwa auf „nur Lehrkräfte"), ändert sie hier.
 */
import { useTypingAuth } from "@/components/typing/useTypingAuth";
import type { TypingAccount } from "@/lib/typing";

/** Ein Kind der Lernwerkstatt — mehr braucht die Prüfung „angemeldet?" nicht. */
export const TEST_KIND: TypingAccount = {
  id: "p4-testkind",
  role: "schueler",
  name: "Übungskind",
  createdAt: Date.UTC(2026, 7, 22),
};

/** Von jetzt an gilt: angemeldet. */
export function alsAngemeldet(konto: TypingAccount = TEST_KIND): void {
  useTypingAuth.setState({ account: konto });
}

/** Von jetzt an gilt: Gast. */
export function alsGast(): void {
  useTypingAuth.setState({ account: null });
}
