/**
 * ★★ EINE KLEINE POCKETBASE-LAUFZEIT FÜR DIE MAIL-HOOKS (EN9, 19.09.2026).
 *
 * Die Mail-Hooks (`tt_weekly_report`, `tt_selflearner_weekly`, …) bauen ihre
 * Mails in `cronAdd`-/`onRecord…`-Rückrufen, mitten zwischen `$app`-Abfragen.
 * Eine reine Render-Funktion zu prüfen sagt nichts darüber, ob der Hook sie
 * mit den richtigen Daten und der richtigen SPRACHE aufruft. Darum führt
 * diese Laufzeit die ECHTE Hook-Datei aus - wie PocketBase sie sähe
 * (goja: `cronAdd`, `$app`, `MailerMessage`, `require(`${__hooks}/…`)`) -
 * gegen eine Handvoll Datensätze im Speicher, und sammelt, was verschickt
 * würde.
 *
 * ⚠️ Nachgebaut ist nur, was die Mail-Hooks benutzen: Filter mit `=`/`!=`
 * und `&&`, Sortierung nach einem Feld, `getString`/`getBool`/`getInt`/`get`/
 * `set`/`email()`. JSON-Felder liegen - wie im echten JSVM, wo sie als
 * `types.JSONRaw` ankommen - als TEXT vor; die Hooks lesen sie über
 * `String(raw)` → `JSON.parse`. Ein Objekt dort hiesse „[object Object]", und
 * genau diese Falle hat der Wochenbericht monatelang gehabt
 * ([[reference_pocketbase_hook_scope]]).
 *
 * `lade(datei)` liefert den Quelltext einer Hook-Datei. Vorgabe: der Ordner
 * `pocketbase/pb_hooks`. Wer den Stand VOR einer Änderung ausführen will
 * (Byte-Vergleich Deutsch alt gegen neu), reicht `git show HEAD:…` herein.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createCipheriv, createDecipheriv, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const HOOK_ORDNER = resolve(process.cwd(), "pocketbase/pb_hooks");
const HOOKS_PFAD = "/pb_hooks";

export type Werte = Record<string, unknown>;

/** Ein Datensatz, wie ihn ein Hook sieht. */
export class FakeRecord {
  readonly collectionName: string;
  id: string;
  private werte: Werte;

  constructor(collection: string | { name: string }, id = "", werte: Werte = {}) {
    this.collectionName = typeof collection === "string" ? collection : collection.name;
    this.id = id || `neu${Math.random().toString(36).slice(2, 10)}`;
    this.werte = {};
    for (const [k, v] of Object.entries(werte)) this.set(k, v);
  }

  collection() {
    return { name: this.collectionName };
  }
  get(feld: string): unknown {
    return this.werte[feld];
  }
  getString(feld: string): string {
    const v = this.werte[feld];
    return v === undefined || v === null ? "" : String(v);
  }
  getBool(feld: string): boolean {
    return !!this.werte[feld];
  }
  getInt(feld: string): number {
    return Math.trunc(Number(this.werte[feld]) || 0);
  }
  /** Objekte und Listen werden - wie ein JSON-Feld - als Text abgelegt. */
  set(feld: string, wert: unknown): void {
    this.werte[feld] = wert !== null && typeof wert === "object" ? JSON.stringify(wert) : wert;
  }
  email(): string {
    return this.getString("email");
  }
  /** Wie `record.hide(feld)` - nur die Ausgabe; hier gemerkt, damit ein Test es sieht. */
  readonly versteckt = new Set<string>();
  hide(...felder: string[]): void {
    for (const f of felder) this.versteckt.add(f);
  }
}

/** Eine Mail, wie `new MailerMessage({...})` sie baut. */
export interface Mail {
  from?: { address: string; name?: string };
  to?: { address: string }[];
  subject: string;
  html: string;
  headers?: Record<string, string>;
}

function passt(rec: FakeRecord, filter: string, params: Werte): boolean {
  if (!filter.trim()) return true;
  return filter.split("&&").every((klausel) => {
    const m = /^\s*(\w+)\s*(!=|=)\s*(.+?)\s*$/.exec(klausel);
    if (!m) throw new Error(`Filter nicht nachgebaut: ${klausel}`);
    const [, feld, op, roh] = m;
    let wert: unknown;
    const p = /^\{:(\w+)\}$/.exec(roh);
    if (p) wert = params[p[1]];
    else if (roh === "true") wert = true;
    else if (roh === "false") wert = false;
    else if (/^'.*'$/.test(roh) || /^".*"$/.test(roh)) wert = roh.slice(1, -1);
    else wert = Number(roh);
    const ist = feld === "id" ? rec.id : rec.get(feld);
    const gleich =
      typeof wert === "boolean" ? !!ist === wert : String(ist ?? "") === String(wert ?? "");
    return op === "=" ? gleich : !gleich;
  });
}

export interface LaufzeitOptionen {
  /** „Jetzt" für `Date.now()` und `new Date()` im Hook. */
  jetzt: number;
  appUrl?: string;
  /** Datensätze je Sammlung. */
  daten?: Record<string, FakeRecord[]>;
  /** Quelltext einer Hook-Datei (Vorgabe: der Ordner `pocketbase/pb_hooks`). */
  lade?: (datei: string) => string;
  /** Weitere Umgebungsvariablen für `$os.getenv` (z. B. `TT_PASSWORT_SCHLUESSEL`). */
  umgebung?: Record<string, string>;
}

export interface Registrierung {
  art: string;
  name?: string;
  /** Die Sammlungen, für die der Haken gilt - leer: für alle. */
  tags: string[];
  handler: (...a: unknown[]) => unknown;
}

export function neueLaufzeit(opt: LaufzeitOptionen) {
  const lade = opt.lade ?? ((d: string) => readFileSync(resolve(HOOK_ORDNER, d), "utf8"));
  const daten: Record<string, FakeRecord[]> = {};
  for (const [k, v] of Object.entries(opt.daten ?? {})) daten[k] = [...v];
  const gesendet: Mail[] = [];
  const protokoll: string[] = [];
  const registriert: Registrierung[] = [];
  const jetzt = opt.jetzt;

  // `Date` mit fester Uhr - `new Date(ts)` bleibt echt.
  class FesteZeit extends Date {
    constructor(...a: unknown[]) {
      if (a.length === 0) super(jetzt);
      else super(...(a as [number]));
    }
    static now() {
      return jetzt;
    }
  }

  const sammlung = (name: string) => (daten[name] ??= []);

  const $app = {
    findRecordsByFilter(coll: string, filter: string, sort = "", _l = 0, _o = 0, params: Werte = {}) {
      const liste = sammlung(coll).filter((r) => passt(r, filter, params));
      if (sort) {
        const ab = sort.startsWith("-");
        const feld = sort.replace(/^[-+]/, "");
        liste.sort((a, b) => {
          const x = a.get(feld) as string | number;
          const y = b.get(feld) as string | number;
          const v = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y));
          return ab ? -v : v;
        });
      }
      return liste;
    },
    findFirstRecordByFilter(coll: string, filter: string, params: Werte = {}) {
      const r = sammlung(coll).find((x) => passt(x, filter, params));
      if (!r) throw new Error("sql: no rows in result set");
      return r;
    },
    findRecordById(coll: string, id: string) {
      const r = sammlung(coll).find((x) => x.id === id);
      if (!r) throw new Error("sql: no rows in result set");
      return r;
    },
    findCollectionByNameOrId(name: string) {
      return { name };
    },
    countRecords(coll: string) {
      return sammlung(coll).length;
    },
    save(rec: FakeRecord) {
      const l = sammlung(rec.collectionName);
      if (!l.includes(rec)) l.push(rec);
    },
    delete(rec: FakeRecord) {
      const l = sammlung(rec.collectionName);
      const i = l.indexOf(rec);
      if (i >= 0) l.splice(i, 1);
    },
    runInTransaction(fn: (tx: unknown) => void) {
      fn($app);
    },
    settings() {
      return { meta: { appURL: opt.appUrl ?? "" } };
    },
    logger() {
      const log = (stufe: string) => (...a: unknown[]) => protokoll.push(`${stufe} ${a.map(String).join(" ")}`);
      return { info: log("info"), warn: log("warn"), error: log("error"), debug: log("debug") };
    },
    newMailClient() {
      return {
        send(m: Mail) {
          gesendet.push(m);
        },
      };
    },
  };

  class MailerMessage {
    constructor(werte: Mail) {
      Object.assign(this, werte);
    }
  }
  class BadRequestError extends Error {}

  const $security = {
    hs256: (text: string, schluessel: string) => createHmac("sha256", schluessel).update(text).digest("hex"),
    equal: (a: string, b: string) =>
      a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b)),
    randomString: (n: number) => "t".repeat(n),
    // Wie PocketBase `security.Encrypt`/`Decrypt` (tools/security/encrypt.go):
    // AES-256-GCM, Schlüssel = die 32 Zeichen als Bytes, Ausgabe base64 von
    // Nonce (12) + Schlüsseltext + Tag (16). `decrypt` liefert hier Text.
    encrypt: (daten: string, schluessel: string) => {
      if (Buffer.byteLength(schluessel) !== 32) throw new Error("crypto/aes: invalid key size");
      const nonce = randomBytes(12);
      const c = createCipheriv("aes-256-gcm", Buffer.from(schluessel), nonce);
      const teil = Buffer.concat([c.update(Buffer.from(daten, "utf8")), c.final()]);
      return Buffer.concat([nonce, teil, c.getAuthTag()]).toString("base64");
    },
    decrypt: (text: string, schluessel: string) => {
      if (Buffer.byteLength(schluessel) !== 32) throw new Error("crypto/aes: invalid key size");
      const roh = Buffer.from(text, "base64");
      if (roh.length < 28) throw new Error("malformed ciphertext");
      const d = createDecipheriv("aes-256-gcm", Buffer.from(schluessel), roh.subarray(0, 12));
      d.setAuthTag(roh.subarray(roh.length - 16));
      return Buffer.concat([d.update(roh.subarray(12, roh.length - 16)), d.final()]).toString("utf8");
    },
  };
  const umgebung: Record<string, string> = {
    MAIL_ABBESTELLEN_SECRET: "geheimnis-fuer-den-test-0123456789",
    ...(opt.umgebung ?? {}),
  };
  const $os = { getenv: (k: string) => umgebung[k] ?? "" };

  const libs = new Map<string, unknown>();
  const HOOK_ARTEN = [
    "cronAdd",
    "routerAdd",
    "onRecordAfterCreateSuccess",
    "onRecordAfterUpdateSuccess",
    "onRecordCreate",
    "onRecordUpdate",
    "onRecordEnrich",
    "onBootstrap",
    "onRecordCreateRequest",
    "onRecordUpdateRequest",
    "onRecordAuthRequest",
    "onMailerSend",
    "onMailerRecordVerificationSend",
    "onMailerRecordPasswordResetSend",
    "onMailerRecordEmailChangeSend",
    "onMailerRecordOTPSend",
  ];
  const hookFunktionen = HOOK_ARTEN.map((art) => (...a: unknown[]) => {
    if (art === "cronAdd")
      registriert.push({ art, name: a[0] as string, tags: [], handler: a[2] as Registrierung["handler"] });
    else if (art === "routerAdd")
      registriert.push({ art, name: `${a[0]} ${a[1]}`, tags: [], handler: a[2] as Registrierung["handler"] });
    else registriert.push({ art, tags: a.slice(1) as string[], handler: a[0] as Registrierung["handler"] });
  });

  const GLOBALE_NAMEN = [
    ...HOOK_ARTEN,
    "$app",
    "$security",
    "$os",
    "$dbx",
    "MailerMessage",
    "Record",
    "BadRequestError",
    "Date",
    "toString",
    "__hooks",
    "require",
    "module",
    "exports",
  ];

  function fuehreAus(datei: string, mitModul: boolean): unknown {
    const code = lade(datei);
    const modul = { exports: {} as unknown };
    const werte = [
      ...hookFunktionen,
      $app,
      $security,
      $os,
      { hashExp: (o: unknown) => o },
      MailerMessage,
      FakeRecord,
      BadRequestError,
      FesteZeit,
      (v: unknown) => (Array.isArray(v) ? Buffer.from(v as number[]).toString("utf8") : String(v)),
      HOOKS_PFAD,
      verlange,
      mitModul ? modul : undefined,
      mitModul ? modul.exports : undefined,
    ];
    // eslint-disable-next-line no-new-func
    new Function(...GLOBALE_NAMEN, code)(...werte);
    return modul.exports;
  }

  function verlange(pfad: string): unknown {
    const datei = String(pfad).replace(`${HOOKS_PFAD}/`, "");
    if (!libs.has(datei)) libs.set(datei, fuehreAus(datei, true));
    return libs.get(datei);
  }

  return {
    $app,
    daten,
    gesendet,
    protokoll,
    registriert,
    MailerMessage,
    /** Eine Hook-Datei laden - wie PocketBase beim Start (ohne `module`). */
    ladeHook(datei: string) {
      fuehreAus(datei, false);
    },
    /** Eine Lib laden, wie ein Handler sie per `require` bekäme. */
    lib<T>(datei: string): T {
      return verlange(`${HOOKS_PFAD}/${datei}`) as T;
    },
    cron(name: string) {
      const r = registriert.find((x) => x.art === "cronAdd" && x.name === name);
      if (!r) throw new Error(`cron ${name} nicht registriert`);
      return () => r.handler();
    },
    /** Alle Handler einer Art (und eines Tags) - in der Reihenfolge der Registrierung. */
    handler(art: string, tag?: string) {
      return registriert.filter(
        (x) => x.art === art && (tag === undefined || x.tags.length === 0 || x.tags.includes(tag)),
      );
    },
    neueMail(werte: Mail) {
      return new MailerMessage(werte) as Mail;
    },
  };
}

export type Laufzeit = ReturnType<typeof neueLaufzeit>;
