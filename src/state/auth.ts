import { create } from "zustand";
import { getBackend, type Backend, type UserProfile } from "@/backend";
import { isStaff } from "@/lib/roles";

/**
 * Sicht-Wechsel (Phase A.1+A.2 der Admin-Oberfläche, 2026-05-26): Staff
 * (Admin/Teacher) kann in eine Studi-Vorschau wechseln, um zu prüfen, wie
 * der Kurs für Studierende aussieht.
 *
 * A.1: `user.role` wird auf "student" gewrappt — alle role-gates im
 *      Frontend reagieren automatisch.
 *
 * A.2: Zusätzlich kann ein konkretes Studi-Konto gewählt werden
 *      (`viewAsUid`). Die Studi-Sicht-Seiten lesen dann via
 *      `useViewUid()` die Daten dieses Studis (Fortschritt, Abgaben,
 *      Anwesenheit). `actualUser.uid` bleibt unverändert — Backend-
 *      Schreib-Operationen laufen weiter unter dem Admin-Konto
 *      (Sicherheits-Grenze: niemand kann versehentlich fremde Daten
 *      überschreiben). Banner kommuniziert das transparent.
 */
export type ViewAs = "actual" | "student";

interface AuthState {
  backend: Backend | null;
  /**
   * Effektive Sicht: bei `viewAs === "student"` wird die Rolle eines
   * Staff-Kontos auf "student" gewrappt. UI-Code (Layout, RequireRole,
   * Kurs-Seiten, Player) liest fast überall `user.role` — daher ist diese
   * Stelle der zentrale Eingriff.
   */
  user: UserProfile | null;
  /**
   * Tatsächlich angemeldetes Konto. Top-Bar-Toggle, Banner und Audit-
   * Logik brauchen dies, um zu wissen *wer* eingeloggt ist (vs. *als wer*
   * gerade angezeigt wird).
   */
  actualUser: UserProfile | null;
  viewAs: ViewAs;
  /**
   * Phase A.2 (2026-05-26): uid des konkreten Studi, dessen Daten in der
   * Vorschau angezeigt werden. `null` ⇒ keine Daten-Übernahme (A.1-Modus:
   * Layout-Vorschau mit eigenen Daten). Bei gesetztem `viewAsUid` wird
   * `viewAs` zwangsweise auf "student" gesetzt.
   * Lese-Hooks (Studi-Seiten) lesen via `useViewUid()` diesen uid;
   * Schreib-Hooks bleiben auf `actualUser.uid` (Sicherheit).
   */
  viewAsUid: string | null;
  status: "loading" | "ready";
  init: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refresh: () => Promise<void>;
  setViewAs: (mode: ViewAs) => void;
  setViewAsUid: (uid: string | null) => void;
}

const VIEW_AS_KEY = "sensorik.viewAs";
const VIEW_AS_UID_KEY = "sensorik.viewAsUid";

function loadViewAs(): ViewAs {
  if (typeof sessionStorage === "undefined") return "actual";
  try {
    return sessionStorage.getItem(VIEW_AS_KEY) === "student"
      ? "student"
      : "actual";
  } catch {
    return "actual";
  }
}

function persistViewAs(mode: ViewAs): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    if (mode === "actual") sessionStorage.removeItem(VIEW_AS_KEY);
    else sessionStorage.setItem(VIEW_AS_KEY, mode);
  } catch {
    // Privacy-Mode / Quota — Vorschau bleibt für die Sitzung im Memory.
  }
}

function loadViewAsUid(): string | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    return sessionStorage.getItem(VIEW_AS_UID_KEY) || null;
  } catch {
    return null;
  }
}

function persistViewAsUid(uid: string | null): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    if (!uid) sessionStorage.removeItem(VIEW_AS_UID_KEY);
    else sessionStorage.setItem(VIEW_AS_UID_KEY, uid);
  } catch {
    /* best-effort */
  }
}

function applyViewAs(
  actual: UserProfile | null,
  viewAs: ViewAs,
): UserProfile | null {
  if (!actual) return null;
  if (viewAs === "student" && isStaff(actual)) {
    return { ...actual, role: "student" };
  }
  return actual;
}

export const useAuth = create<AuthState>((set, get) => ({
  backend: null,
  user: null,
  actualUser: null,
  viewAs: loadViewAs(),
  viewAsUid: loadViewAsUid(),
  status: "loading",
  async init() {
    const backend = await getBackend();
    backend.onAuthChange((actualUser) =>
      set((s) => ({ actualUser, user: applyViewAs(actualUser, s.viewAs) })),
    );
    set({ backend, status: "ready" });
  },
  async signIn(email, password) {
    await get().backend!.signIn(email, password);
  },
  async signOut() {
    // Vorschau-Modus + Studi-Auswahl beim Abmelden zurücksetzen — sonst
    // sähe der nächste (eventuell andere) Login direkt die Vorschau-Sicht.
    persistViewAs("actual");
    persistViewAsUid(null);
    set({ viewAs: "actual", viewAsUid: null });
    await get().backend!.signOut();
  },
  async resetPassword(email) {
    await get().backend!.resetPassword(email);
  },
  async refresh() {
    const b = get().backend!;
    const u = b.currentUser();
    if (u) {
      const fresh = await b.getProfile(u.uid);
      set((s) => ({ actualUser: fresh, user: applyViewAs(fresh, s.viewAs) }));
    }
  },
  setViewAs(mode) {
    persistViewAs(mode);
    // Zurück zu "actual" räumt auch die Studi-Auswahl weg — sonst bliebe
    // viewAsUid im sessionStorage stehen und würde beim nächsten
    // Vorschau-Wechsel überraschend wieder greifen.
    if (mode === "actual") {
      persistViewAsUid(null);
      set((s) => ({
        viewAs: mode,
        viewAsUid: null,
        user: applyViewAs(s.actualUser, mode),
      }));
    } else {
      set((s) => ({ viewAs: mode, user: applyViewAs(s.actualUser, mode) }));
    }
  },
  setViewAsUid(uid) {
    persistViewAsUid(uid);
    if (uid) {
      // Konkreten Studi gewählt ⇒ zwangsweise viewAs="student".
      persistViewAs("student");
      set((s) => ({
        viewAs: "student",
        viewAsUid: uid,
        user: applyViewAs(s.actualUser, "student"),
      }));
    } else {
      set({ viewAsUid: null });
    }
  },
}));

/**
 * Phase A.2: liefert die uid, deren Daten in der aktuellen Sicht
 * angezeigt werden sollen — gleich der Studi-uid in der Vorschau, sonst
 * gleich der echten User-uid. SCHREIB-Operationen (saveLessonProgress,
 * submitExam, recordEvent, …) sollen weiter `actualUser.uid` verwenden,
 * damit niemand versehentlich fremde Daten überschreibt.
 */
export function useViewUid(): string | null {
  return useAuth((s) => s.viewAsUid ?? s.actualUser?.uid ?? null);
}
