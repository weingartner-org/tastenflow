/**
 * Lernwerkstatt-Nachrichten — gemeinsames Backend für ALLE Lernwerkstatt-Apps
 * (Tastenflow, Braille, künftige). Eine kleine Glocke wie in den Kursen:
 * Lehrkräfte schreiben aus ihrer Schüler-Übersicht an einzelne Kinder oder die
 * ganze Klasse; Kinder können in der Plattform ANTWORTEN (und auch selbst
 * beginnen). Da Lehrer-/Schüler-Konten app-übergreifend dieselben sind
 * (geteilter PocketBase-authStore `tt_pb_auth`), erscheint eine Nachricht beim
 * Kind in JEDER App. Memory: project_lernwerkstatt_unified.
 *
 * Chat-artiges Modell: ein Datensatz = eine Nachricht; das „Gespräch" mit einem
 * Kind = alle `lw_messages`-Zeilen mit dessen `pupilUid`. Lese-Stempel je Seite
 * (`readPupilAtMs`/`readTeacherAtMs`) speisen die Ungelesen-Zähler. Collection +
 * Regeln: pocketbase/setup.mjs (LW_MSG_*, adversarial getestet).
 *
 * EIGENER PocketBase-Client mit demselben authStore-Schlüssel wie die Trainer
 * (`tt_pb_auth`) → liest dieselbe Sitzung, ohne von einem einzelnen Trainer-
 * Backend abzuhängen. So bedient EINE Glocken-Komponente beide Apps.
 */
import PocketBase, { LocalAuthStore } from "pocketbase";
import type { RecordModel } from "pocketbase";
import { backendUrl } from "@/lib/adressen";

export type LwRole = "teacher" | "pupil";

export interface LwIdentity {
  id: string;
  role: LwRole;
  name: string;
  classCode: string;
  teacherUid: string;
}

export interface LwMessage {
  id: string;
  pupilUid: string;
  teacherUid: string;
  classCode: string;
  senderRole: LwRole;
  body: string;
  fromName: string;
  pupilName: string;
  subject: string;
  createdAt: number;
  readPupilAt: number;
  readTeacherAt: number;
}

/** Ein Gespräch mit genau einem Kind (chronologisch, älteste zuerst). */
export interface LwConversation {
  pupilUid: string;
  pupilName: string;
  classCode: string;
  messages: LwMessage[];
  lastAt: number;
  /** Ungelesene Nachrichten AUS SICHT der aktuell angemeldeten Person. */
  unread: number;
}

function mapMsg(rec: RecordModel): LwMessage {
  const d = (rec.data ?? {}) as Record<string, unknown>;
  return {
    id: rec.id,
    pupilUid: (rec.pupilUid as string) ?? "",
    teacherUid: (rec.teacherUid as string) ?? "",
    classCode: (rec.classCode as string) ?? "",
    senderRole: (rec.senderRole as LwRole) ?? "teacher",
    body: typeof d.body === "string" ? d.body : "",
    fromName: typeof d.fromName === "string" ? d.fromName : "",
    pupilName: typeof d.pupilName === "string" ? d.pupilName : "",
    subject: typeof d.subject === "string" ? d.subject : "",
    createdAt: (rec.createdAtMs as number) ?? 0,
    readPupilAt: (rec.readPupilAtMs as number) ?? 0,
    readTeacherAt: (rec.readTeacherAtMs as number) ?? 0,
  };
}

/** Ist diese Nachricht für die angegebene Rolle ungelesen? */
function isUnreadFor(m: LwMessage, role: LwRole): boolean {
  // Eine Nachricht ist für die Gegenseite ungelesen, bis diese sie stempelt.
  if (role === "pupil") return m.senderRole === "teacher" && m.readPupilAt === 0;
  return m.senderRole === "pupil" && m.readTeacherAt === 0;
}

/**
 * Ereignis, das nach jedem Senden/Lesen ausgelöst wird. Die Glocke hört darauf
 * und lädt sofort neu — so verschwindet der Zähler auch dann ohne Verzögerung,
 * wenn das Lesen NICHT in der Glocke selbst passiert (z. B. wenn die Lehrkraft
 * ein Gespräch aus der Schüler-Übersicht öffnet).
 */
export const LW_MESSAGES_CHANGED = "lw-messages-changed";

export class LwMessagesBackend {
  private pb: PocketBase;

  constructor() {
    const url = backendUrl();
    // GETEILTER authStore-Schlüssel mit den Trainern → eine Sitzung für alle Apps.
    this.pb = new PocketBase(url, new LocalAuthStore("tt_pb_auth"));
    this.pb.autoCancellation(false);
  }

  private notifyChanged() {
    if (typeof window !== "undefined")
      window.dispatchEvent(new Event(LW_MESSAGES_CHANGED));
  }

  /** Aktuell angemeldete Lernwerkstatt-Identität (oder null). */
  identity(): LwIdentity | null {
    const rec = this.pb.authStore.record as RecordModel | null;
    if (!rec || !this.pb.authStore.isValid) return null;
    if (rec.collectionName === "tt_teachers") {
      return {
        id: rec.id,
        role: "teacher",
        name: (rec.name as string) ?? "",
        classCode: "",
        teacherUid: rec.id,
      };
    }
    if (rec.collectionName === "tt_pupils") {
      return {
        id: rec.id,
        role: "pupil",
        name: (rec.name as string) ?? "",
        classCode: (rec.classCode as string) ?? "",
        teacherUid: (rec.teacherUid as string) ?? "",
      };
    }
    return null;
  }

  /** Alle Nachrichten EINES Gesprächs (ein Kind), älteste zuerst. */
  async listForPupil(pupilUid: string): Promise<LwMessage[]> {
    try {
      const list = await this.pb.collection("lw_messages").getFullList({
        filter: this.pb.filter("pupilUid={:p}", { p: pupilUid }),
        sort: "createdAtMs",
      });
      return list.map(mapMsg);
    } catch {
      return [];
    }
  }

  /**
   * Posteingang der aktuell angemeldeten Person als Gespräche gruppiert.
   *  • Kind: genau ein Gespräch (mit der eigenen Lehrkraft).
   *  • Lehrkraft: ein Gespräch je Kind, das ihr (über ihre Klassen) sichtbar ist.
   * Sortiert nach jüngster Aktivität.
   */
  async loadInbox(): Promise<LwConversation[]> {
    const me = this.identity();
    if (!me) return [];
    let rows: LwMessage[] = [];
    try {
      if (me.role === "pupil") {
        rows = await this.listForPupil(me.id);
      } else {
        // Lehrkraft: die listRule liefert nur Nachrichten ihrer eigenen Klassen.
        const list = await this.pb.collection("lw_messages").getFullList({
          sort: "createdAtMs",
        });
        rows = list.map(mapMsg);
      }
    } catch {
      return [];
    }
    const byPupil = new Map<string, LwMessage[]>();
    for (const m of rows) {
      const arr = byPupil.get(m.pupilUid) ?? [];
      arr.push(m);
      byPupil.set(m.pupilUid, arr);
    }
    const convos: LwConversation[] = [];
    for (const [pupilUid, msgs] of byPupil) {
      msgs.sort((a, b) => a.createdAt - b.createdAt);
      const pupilName =
        [...msgs].reverse().find((m) => m.pupilName)?.pupilName ||
        msgs.find((m) => m.senderRole === "pupil")?.fromName ||
        "Ohne Namen";
      convos.push({
        pupilUid,
        pupilName,
        classCode: msgs[msgs.length - 1]?.classCode ?? "",
        messages: msgs,
        lastAt: msgs[msgs.length - 1]?.createdAt ?? 0,
        unread: msgs.filter((m) => isUnreadFor(m, me.role)).length,
      });
    }
    convos.sort((a, b) => b.lastAt - a.lastAt);
    return convos;
  }

  /** Gesamtzahl ungelesener Nachrichten für die Glocke. */
  async unreadCount(): Promise<number> {
    const convos = await this.loadInbox();
    return convos.reduce((sum, c) => sum + c.unread, 0);
  }

  /** Lehrkraft → ein Kind. teacherUid/teacherName = die anmeldete Lehrkraft. */
  async sendFromTeacher(input: {
    pupilUid: string;
    pupilName: string;
    classCode: string;
    body: string;
    subject?: string;
  }): Promise<boolean> {
    const me = this.identity();
    if (!me || me.role !== "teacher") return false;
    const now = Date.now();
    try {
      await this.pb.collection("lw_messages").create({
        pupilUid: input.pupilUid,
        teacherUid: me.id,
        classCode: input.classCode,
        senderRole: "teacher",
        // Eigene Nachricht gilt für die Lehrkraft als gelesen.
        readTeacherAtMs: now,
        readPupilAtMs: 0,
        createdAtMs: now,
        data: {
          body: input.body,
          fromName: me.name,
          pupilName: input.pupilName,
          subject: input.subject ?? "",
        },
      });
      this.notifyChanged();
      return true;
    } catch {
      return false;
    }
  }

  /** Kind → seine Lehrkraft (Antwort oder selbst begonnen). */
  async sendFromPupil(body: string, subject?: string): Promise<boolean> {
    const me = this.identity();
    if (!me || me.role !== "pupil") return false;
    const now = Date.now();
    try {
      await this.pb.collection("lw_messages").create({
        pupilUid: me.id,
        teacherUid: me.teacherUid,
        classCode: me.classCode,
        senderRole: "pupil",
        // Eigene Nachricht gilt für das Kind als gelesen.
        readPupilAtMs: now,
        readTeacherAtMs: 0,
        createdAtMs: now,
        data: {
          body,
          fromName: me.name,
          pupilName: me.name,
          subject: subject ?? "",
        },
      });
      this.notifyChanged();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Gespräch als gelesen markieren — je Rolle nur das EIGENE Lese-Feld auf den
   * noch ungelesenen Gegen-Nachrichten. `known` erspart einen erneuten Abruf,
   * wenn die Nachrichten schon vorliegen.
   */
  async markRead(pupilUid: string, known?: LwMessage[]): Promise<void> {
    const me = this.identity();
    if (!me) return;
    const msgs = known ?? (await this.listForPupil(pupilUid));
    const now = Date.now();
    const field = me.role === "pupil" ? "readPupilAtMs" : "readTeacherAtMs";
    const todo = msgs.filter((m) => isUnreadFor(m, me.role));
    if (todo.length === 0) return;
    for (const m of todo) {
      try {
        await this.pb.collection("lw_messages").update(m.id, { [field]: now });
      } catch {
        /* best effort — Glocke bleibt notfalls auf „ungelesen" */
      }
    }
    this.notifyChanged();
  }
}

let _singleton: LwMessagesBackend | null = null;
export function lwMessages(): LwMessagesBackend {
  if (!_singleton) _singleton = new LwMessagesBackend();
  return _singleton;
}
