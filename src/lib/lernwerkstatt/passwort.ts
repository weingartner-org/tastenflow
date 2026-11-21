/**
 * Eigenes Passwort ändern — EINE Umsetzung für die ganze Lernwerkstatt.
 *
 * Alle vier Lernprogramme teilen sich dieselben Konten (`tt_teachers` /
 * `tt_pupils`, [[project_lernwerkstatt_unified]]) und denselben
 * PocketBase-authStore. Darum hängt das Ändern des Passworts an nichts
 * App-Eigenem: Es genügt die laufende Sitzung. Bis 10.08.2026 stand diese Logik
 * nur im Tastenflow-Backend; seit Johannes' Wunsch, „Passwort ändern" gehöre in
 * die Benutzerliste JEDER App, liegt sie hier und wird von beiden Backends
 * (Tastenflow/im Griff und Punktgenau/Klangpunkte) benutzt.
 *
 * ★ Die Mindestlänge hängt an der Rolle, nicht an der App: Lehrkräfte 6,
 *   Kinder 4 Zeichen (ein Kind mit Blindheit tippt jedes Zeichen einzeln).
 * Siehe [[feedback_security_first]].
 */
import type PocketBase from "pocketbase";
import { ClientResponseError, type RecordModel } from "pocketbase";

export type PasswortErgebnis =
  | { ok: true; value: true }
  | { ok: false; error: string };

/** Mindestlänge des neuen Passworts je Konto-Sammlung. */
export function minPasswortLaenge(collection: string): number {
  return collection === "tt_teachers" ? 6 : 4;
}

/**
 * Passwort des ANGEMELDETEN Kontos ändern. Danach wird die Sitzung mit dem
 * neuen Passwort frisch aufgebaut — PocketBase macht das alte Token beim
 * Passwortwechsel ungültig, und ohne diesen Schritt fiele das Kind mitten im
 * Üben aus seinem Konto.
 */
export async function changeOwnPasswordPb(
  pb: PocketBase,
  oldPassword: string,
  newPassword: string,
): Promise<PasswortErgebnis> {
  const rec = pb.authStore.record as RecordModel | null;
  if (!rec || !pb.authStore.isValid)
    return { ok: false, error: "Bitte zuerst anmelden." };
  const coll = rec.collectionName as string; // "tt_teachers" | "tt_pupils"
  const min = minPasswortLaenge(coll);
  if (newPassword.length < min)
    return {
      ok: false,
      error: `Das neue Passwort braucht mindestens ${min} Zeichen.`,
    };
  try {
    await pb.collection(coll).update(rec.id, {
      oldPassword,
      password: newPassword,
      passwordConfirm: newPassword,
      // Schüler-Selbst-Update verlangt die UNVERÄNDERTE teacherUid im Body
      // (Regel tt_pupils.updateRule) — siehe selfPupilFields.
      ...(coll === "tt_pupils" ? { teacherUid: rec.teacherUid } : {}),
    });
    try {
      await pb.collection(coll).authWithPassword(rec.email as string, newPassword);
    } catch {
      /* Passwort IST geändert; notfalls muss neu angemeldet werden. */
    }
    return { ok: true, value: true };
  } catch (e) {
    if (e instanceof ClientResponseError && e.status === 400)
      return { ok: false, error: "Das aktuelle Passwort stimmt nicht." };
    return {
      ok: false,
      error: "Passwort konnte nicht geändert werden. Ist der Server erreichbar?",
    };
  }
}
