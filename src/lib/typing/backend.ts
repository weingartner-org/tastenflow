/**
 * Backend-Abstraktion für die Konten des Tipptrainers „Tastenflow".
 *
 * Zwei Implementierungen hinter EINER (asynchronen) Schnittstelle:
 *  • LocalTypingBackend  — localStorage, nur in diesem Browser (Dev/Tests/„ohne
 *    Konto"-Geräte). Wickelt die bestehenden synchronen Funktionen in Promises.
 *  • PocketBaseTypingBackend — zentrale Server-Datenbank, damit Schüler:innen
 *    sich von JEDEM Gerät anmelden können (siehe pbBackend.ts).
 *
 * Auswahl über `VITE_BACKEND` (wie das LMS): "pocketbase" → Server, sonst lokal.
 * Die Sitzung (wer ist angemeldet) verwaltet das Backend selbst: lokal über
 * einen localStorage-Schlüssel, bei PocketBase über dessen eigenen, vom LMS
 * getrennten authStore. Siehe [[project_zehnfinger_trainer]], [[feedback_security_first]].
 */
import type { BedienSprache } from "../bedienSprache/sprache";
import type { ProbenZeiger, SchreibprobePlan } from "./schreibprobe";
import type { EigenerTextGelesen } from "./eigenerText";
import type { MeinTextEintrag } from "./meineTexte";
import type { Lernweg } from "./lernweg";
import type { Gezielt } from "./gezielt";
import type { Match, MatchStand, MatchStatus } from "./klassenmatch";
import type { SpendenBannerZielgruppe } from "@/lib/spendenbannerTexte";
import type { SpendenBannerZustand } from "@/lib/spendenbanner";
import {
  mockAktualisiereMatch,
  mockAnfrageGezaehlt,
  mockBeobachte,
  mockErstelleMatch,
  mockListeMatches,
  mockListeStaende,
  mockSchreibeStand,
} from "./matchMock";
import { ergebnisAusJson, type Probenergebnis } from "./schreibprobeAuswertung";
import {
  ClassTeacher,
  KindVerschoben,
  KlassenEinstellungenAenderung,
  type KlassenAnlage,
  Lang,
  Result,
  movePupil as localMovePupil,
  setProbeBereit as localSetProbeBereit,
  Stufe,
  TaskEvent,
  TypingAccount,
  TypingClass,
  acceptCoteacherInvite as localAcceptCoteacherInvite,
  addClassTeacher as localAddClassTeacher,
  addPupil as localAddPupil,
  changePassword as localChangePassword,
  listClassTeachers as localListClassTeachers,
  previewCoteacherInvite as localPreviewCoteacherInvite,
  removeClassTeacher as localRemoveClassTeacher,
  setPupilPassword as localSetPupilPassword,
  createClass as localCreateClass,
  getClass as localGetClass,
  setClassPrograms as localSetClassPrograms,
  setClassKlassenmatchAus as localSetClassKlassenmatchAus,
  // ★ E3 (11.09.2026): Schulstufe, Sprache und Sperre der KLASSE.
  setClassEinstellungen as localSetClassEinstellungen,
  setClassSchreibprobe as localSetClassSchreibprobe,
  speichereProbenergebnis as localSpeichereProbenergebnis,
  leseProbenergebnisse as localLeseProbenergebnisse,
  leseKlassenProbenergebnisse as localLeseKlassenProbenergebnisse,
  speichereEigenenText as localSpeichereEigenenText,
  leseEigenenText as localLeseEigenenText,
  starteEigeneUebung as localStarteEigeneUebung,
  beendeEigeneUebung as localBeendeEigeneUebung,
  schreibeImGriffKapitel as localSchreibeImGriffKapitel,
  // ★ Meine Texte (E8, 19.09.2026).
  listeMeineTexte as localListeMeineTexte,
  speichereMeinenText as localSpeichereMeinenText,
  leseMeinenText as localLeseMeinenText,
  loescheMeinenText as localLoescheMeinenText,
  setClassWeeklyReport as localSetClassWeeklyReport,
  updateClass as localUpdateClass,
  deleteClass as localDeleteClass,
  deletePupil as localDeletePupil,
  getAccount as localGetAccount,
  getEvents as localGetEvents,
  getProgress as localGetProgress,
  listClasses as localListClasses,
  listPupils as localListPupils,
  loginPupil as localLoginPupil,
  loginTeacher as localLoginTeacher,
  recordEvent as localRecordEvent,
  recordEvents as localRecordEvents,
  registerTeacher as localRegisterTeacher,
  saveAccountProgress as localSaveProgress,
  resetGoalOverdue as localResetGoalOverdue,
  setGoalExcusedWeeks as localSetGoalExcusedWeeks,
  // ★★★ Wochenziel NEU (W2, 18.09.2026) - siehe wochenziel.ts.
  setWochenziel as localSetWochenziel,
  setKlassenWochenziel as localSetKlassenWochenziel,
  stundeSperren as localStundeSperren,
  sperreAufheben as localSperreAufheben,
  setLang as localSetLang,
  setOneHand as localSetOneHand,
  setGezielt as localSetGezielt,
  setSchulstufe as localSetSchulstufe,
  setNoTimePressure as localSetNoTimePressure,
  setZeichenabstand as localSetZeichenabstand,
  setMailWeeklyOptOut as localSetMailWeeklyOptOut,
  setSkillLevel as localSetSkillLevel,
  setStufe as localSetStufe,
  setGeburtsjahr as localSetGeburtsjahr,
  setToolProfile as localSetToolProfile,
  setStartUnits as localSetStartUnits,
  setPlusBeschluss as localSetPlusBeschluss,
  setLernweg as localSetLernweg,
  setLernwegDurchLehrkraft as localSetLernwegDurchLehrkraft,
  getSpendenbannerZustand as localGetSpendenbannerZustand,
  setSpendenbannerZustand as localSetSpendenbannerZustand,
  setGespendetAm as localSetGespendetAm,
  getNeuigkeitenStand as localGetNeuigkeitenStand,
  setNeuigkeitenGesehen as localSetNeuigkeitenGesehen,
  getRundgaengeGesehen as localGetRundgaengeGesehen,
  setRundgaengeGesehen as localSetRundgaengeGesehen,
} from "./account";
import { isoWeekKey } from "./goals";
import { TempoLevel } from "./letters";
import { PocketBaseTypingBackend } from "./pbBackend";
import { TypingProgress } from "./progress";
// ★ E9 (19.09.2026): derselbe Wochenschlüssel wie beim Wochenziel (Montag
// 08:00 Wien) - für die Klassenmatch-Anzahl im Mock-Backend, siehe
// `klassenmatchAnzahl` weiter unten.
import { wochenStart } from "./wochenrhythmus";
import { WOCHENZIEL_GRENZE } from "./wochenziel";

/**
 * Was aus einer Abgabe am Server geworden ist (27.09.2026).
 *  • „gespeichert" - neu angelegt.
 *  • „lag-schon"   - lag schon (zweiter Versuch nach verlorener Antwort,
 *                    anderes Gerät) - für das Kind dasselbe wie „gespeichert".
 *  • „netz"        - wirklich kein Netz: später nochmal.
 *  • „server"      - Serverfehler (5xx, 408, 429 …): später nochmal, die
 *                    übrige Warteschlange geht weiter (Prüfbefund S2).
 *  • „abgewiesen"  - der Server hat geantwortet und nicht angenommen (z. B.
 *                    abgelaufene Anmeldung): beim nächsten Start nochmal.
 */
export type ProbenAbgabe = "gespeichert" | "lag-schon" | "netz" | "server" | "abgewiesen";

export interface TypingBackend {
  /** Bezeichnet die Art (für Diagnose/Tests). */
  readonly kind: "local" | "pocketbase";

  // Sitzung
  /** Aktuell angemeldetes Konto (synchron aus der gespeicherten Sitzung). */
  currentAccount(): TypingAccount | null;
  /**
   * ★ L2 (19.09.2026): das angemeldete Konto FRISCH vom Server holen (und die
   * Sitzung dabei verlängern). `currentAccount` liest nur, was bei der
   * Anmeldung gespeichert wurde - was die Lehrkraft danach am Kind einstellt
   * (Zeichenabstand, Einhand, Zeit lassen, Wochenziel …), käme sonst erst
   * nach einer neuen Anmeldung an. `null`: nichts Neues (offline, abgelaufen,
   * kein Server-Konto) - dann bleibt der gemerkte Stand.
   *
   * ★★★★★ 23.09.2026: Lehnt der SERVER die Sitzung ab (abgelaufen, Passwort
   * geändert, Konto gelöscht), wirft es {@link SitzungAbgelaufenFehler} statt
   * `null` zu liefern - dann kann nichts mehr gespeichert werden, und das darf
   * nicht aussehen wie „kurz offline". Siehe `useTypingAuth`.
   */
  kontoAuffrischen?(): Promise<TypingAccount | null>;
  /**
   * ★★★★★ 23.09.2026: Wann die gespeicherte Anmeldung abläuft (ms seit
   * 1970), `0` = unbekannt oder keine. Eine Anmeldung gilt sieben Tage - wer
   * einmal die Woche zur selben Stunde übt, erreicht das Ende genau in der
   * nächsten Stunde, während die Seite offen ist.
   */
  sitzungEndetMs?(): number;
  /**
   * ★ L2b (19.09.2026): Änderungen am EIGENEN Konto sofort melden (Realtime,
   * etwa eine Sekunde) - Johannes: *„wenn ich jetzt wieder umstelle, passiert
   * bei ihm nichts"*. Gibt die Abmeldung zurück. Ohne Server (lokales
   * Backend, Tests) fehlt die Methode - dann trägt das Auffrischen allein.
   */
  kontoBeobachten?(id: string, beiAenderung: (konto: TypingAccount) => void): () => void;
  logout(): void;
  /**
   * Holt (und erneuert) den Datei-Ausweis für geschützte Inhalte - das
   * HttpOnly-Cookie `sensorik_inhalt` aus `/api/sensorik/inhalt/ausweis`.
   * Ohne ihn antwortet der Server auf `/handbuecher/...` mit 404, obwohl die
   * Lehrkraft angemeldet ist (Befund 23.08.2026: der Handbuch-Download in der
   * Tastenflow-Hilfe lief deshalb ins Leere; die LMS-Hülle `Layout.tsx` holt
   * den Ausweis zentral, die eigenständige Tastenflow-Seite muss es selbst tun).
   * Lokal (ohne Server) ist es ein No-op.
   */
  inhaltsAusweisSichern(opt?: { frisch?: boolean }): Promise<void>;

  // Lehrkraft
  registerTeacher(
    name: string,
    email: string,
    password: string,
  ): Promise<Result<TypingAccount>>;
  loginTeacher(email: string, password: string): Promise<Result<TypingAccount>>;
  /** „Passwort vergessen": Reset-Link per E-Mail an die Lehrkraft anstoßen. */
  requestTeacherPasswordReset(email: string): Promise<Result<true>>;
  /** Reset-Token aus der Mail einlösen und neues Lehrkraft-Passwort setzen. */
  confirmTeacherPasswordReset(token: string, newPassword: string): Promise<Result<true>>;

  // Klassen
  /**
   * Klasse anlegen. ★ Der Klassencode ist seit 10.09.2026 PFLICHT (Johannes):
   * Kein Backend erzeugt mehr einen von selbst; ein leerer Code wird
   * abgewiesen - auch am Server (`setup.mjs`, `tt_klasse.pb.js`).
   */
  createClass(
    teacherId: string,
    name: string,
    code: string,
    /**
     * ★★★ Die Einstellungen der Klasse gleich mit (11.09.2026, Nacht -
     * Johannes: „Alles was im Bereich ‚Einstellungen der Klasse' vorkommt muss
     * beim Erstellen einer neuen Klasse abgefragt werden"). In EINEM Aufruf
     * mit dem Anlegen - so gibt es keinen Zwischenzustand „Klasse da,
     * Einstellungen noch nicht". `startUnitsAt` stempelt das Backend selbst.
     */
    einstellungen?: KlassenAnlage,
    /**
     * ★ Nachbesserung 20.09.2026 (Johannes: „Das Programm kann ja eine Nummer
     * vergeben und damit arbeiten"). `true`, wenn `code` der aus dem Namen
     * VORGESCHLAGENE Code ist (`codeSelbst === false` in `KlasseUndKinder.tsx`) -
     * dann weicht ein belegter Code selbst aus ("TEST" → "TEST2" …), statt
     * abzusagen. Selbst getippte Codes (`true` nie gesetzt) bleiben stehen.
     */
    codeAutoVorschlag?: boolean,
  ): Promise<Result<TypingClass>>;
  listClasses(teacherId: string): Promise<TypingClass[]>;
  deleteClass(code: string, teacherId: string): Promise<Result<true>>;
  /**
   * Klasse bearbeiten: Klassenname und/oder Klassencode. Beim Code-Wechsel
   * wandert der neue Code auf alle Schüler:innen mit (Login-E-Mail inklusive)
   * - am Server in EINER Transaktion (`/api/tt/klassencode-aendern`).
   */
  updateClass(
    code: string,
    teacherId: string,
    changes: { name?: string; code?: string },
  ): Promise<Result<TypingClass>>;
  /** Wöchentlichen E-Mail-Bericht einer Klasse an-/ausschalten. */
  setClassWeeklyReport(
    code: string,
    teacherId: string,
    on: boolean,
  ): Promise<TypingClass | null>;
  /**
   * „Programme dieser Klasse" setzen (MK-E2) — reiner Anzeige-Filter für die
   * Lehrkraft-Sicht, kein Verbot für das Kind. Leere Liste = alle anzeigen.
   */
  setClassPrograms(
    code: string,
    teacherId: string,
    programs: string[],
  ): Promise<TypingClass | null>;

  // ── Schreibprobe (09.09.2026) ────────────────────────────────────────────
  /**
   * Die Schreibprobe der Klasse STARTEN (`plan`) oder ABSAGEN (`null`).
   *
   * `zeiger` wandert im selben Schreibvorgang mit (Texte sparen, 10.09.2026):
   * Plan und Zeiger sind eine Entscheidung und dürfen nicht in zwei Schritte
   * zerfallen - sonst läuft eine Challenge, während der Zeiger ihres Niveaus
   * noch auf die vorige zeigt. Die alte Verbrauchsliste bleibt unberührt.
   *
   * ★ E7a (24.09.2026): `lernweg` sagt, UNTER WELCHEM SCHLÜSSEL `zeiger` in
   * `tt_classes.settings` steht (`schreibprobeZeiger` für „de",
   * `schreibprobeZeigerEn" für „en" - siehe `zeigerSchluessel` in
   * `schreibprobe.ts`). Fehlt es (jeder Aufrufer vor E7a), gilt „de" - genau
   * der alte, unpräfigierte Schlüssel.
   */
  setzeSchreibprobe(
    code: string,
    teacherId: string,
    plan: SchreibprobePlan | null,
    zeiger: ProbenZeiger,
    lernweg?: Lernweg,
  ): Promise<TypingClass | null>;
  /**
   * Ein Ergebnis ablegen. „lag-schon" heißt: Zu dieser Probe liegt bei diesem
   * Kind schon eines - **es wird NICHT überschrieben**. Wer eine Prüfung
   * zweimal abgeben darf, hat keine geschrieben.
   *
   * ★★ 27.09.2026 (Befund Netzabbruch §3.3): Bis dahin schluckte der Server-Weg
   * JEDEN Fehler und meldete ihn wie „lag schon" - ein Kind ohne Netz verlor
   * sein Ergebnis still. Jetzt sagt die Antwort, ob das Ergebnis am Server
   * liegt („gespeichert"/„lag-schon") oder nicht („netz"/„abgewiesen"); die
   * Warteschlange im Gerät (`nachsenden.ts`) schickt es dann nach.
   */
  speichereProbenergebnis(
    pupil: TypingAccount,
    ergebnis: Probenergebnis,
    /** ★ 27.09.2026: bricht die Anfrage wirklich ab (Frist der Warteschlange). */
    signal?: AbortSignal,
  ): Promise<ProbenAbgabe>;
  /** Alle Schreibproben-Ergebnisse eines Kindes, jüngste zuerst. */
  leseProbenergebnisse(pupilId: string): Promise<Probenergebnis[]>;
  /** Alle Ergebnisse einer Klasse (Lehrkraft-Sicht): Konto-Kennung → Ergebnisse. */
  leseKlassenProben(classCode: string): Promise<Record<string, Probenergebnis[]>>;

  // ── Eigene Texte (17.09.2026) ────────────────────────────────────────────
  /**
   * Einen hochgeladenen Text ablegen - für „Eigene Übung" UND die
   * Tippchallenge mit eigener Datei. Legt IMMER eine NEUE Zeile an (kein
   * Überschreiben); gibt ihre Id zurück, `null` wenn die Lehrkraft nicht zu
   * dieser Klasse gehört.
   */
  speichereEigenenText(
    classCode: string,
    teacherId: string,
    dateiname: string,
    zeilen: string[],
  ): Promise<string | null>;
  /** Einen hochgeladenen Text lesen (Kind UND Lehrkraft - kein Geheimnis). */
  leseEigenenText(id: string): Promise<EigenerTextGelesen | null>;
  /**
   * ★★★★★ „Eigene Übung starten" (Z1, 19.09.2026): HINTEN an die Reihe der
   * Klasse hängen (`tt_classes.eigeneUebungen`, siehe `eigeneUebungReihe.ts`)
   * - bis dahin ERSETZTE ein Start die laufende Übung, und wer sie noch nicht
   * geschrieben hatte, bekam sie nie. Leert im selben Schreibvorgang den alten
   * Zeiger in `settings`. `vonAllenFertig`: Texte, die jedes Kind schon fertig
   * hat - sie fallen zuerst, wenn die Reihe voll ist (20).
   */
  starteEigeneUebung(
    code: string,
    teacherId: string,
    eintrag: { textId: string; dateiname: string },
    vonAllenFertig?: readonly string[],
  ): Promise<TypingClass | null>;
  /**
   * Eine Übung aus der Reihe nehmen (Z1, „Beenden"). Wer gerade darin
   * schreibt, darf sie fertig schreiben (`useEigeneUebung`), alle anderen
   * bekommen sie nicht mehr.
   */
  beendeEigeneUebung(code: string, teacherId: string, textId: string): Promise<TypingClass | null>;
  /**
   * ★★★ »Im Griff«: „Kapitel mit der Klasse starten" (29.09.2026) - die
   * Reihe `tt_classes.imgriffKapitel` neu schreiben. `aendern` bekommt die
   * rohe Reihe FRISCH vom Server (nicht die der Seite), damit ein Kapitel,
   * das eine Co-Lehrkraft eben gestartet hat, nicht verloren geht. `null`,
   * wenn der Server das Feld (noch) nicht kennt oder das Schreiben scheitert.
   */
  schreibeImGriffKapitel(
    code: string,
    teacherId: string,
    aendern: (roh: unknown) => unknown[],
  ): Promise<TypingClass | null>;

  // ── Meine Texte (E8, 19.09.2026) ─────────────────────────────────────────
  // Die Textablage EINER Lehrkraft - für Kinder und andere Lehrkräfte
  // unsichtbar (siehe `meineTexte.ts`). „Für die Klasse festlegen" legt wie
  // beim Upload eine NEUE `tt_eigene_texte`-Zeile an (`speichereEigenenText`)
  // - der Pool-Eintrag selbst bleibt unverändert liegen und ist wiederholt
  // verwendbar.
  /** Alle eigenen Texte der Lehrkraft, jüngste zuerst. */
  listeMeineTexte(teacherId: string): Promise<MeinTextEintrag[]>;
  /** Einen Text in die eigene Ablage legen. Gibt seine Id zurück, `null` bei Fehler. */
  speichereMeinenText(
    teacherId: string,
    dateiname: string,
    zeilen: string[],
  ): Promise<string | null>;
  /** Einen Text aus der eigenen Ablage lesen (zum Starten in einer Klasse). */
  leseMeinenText(id: string): Promise<EigenerTextGelesen | null>;
  /** Einen Text aus der eigenen Ablage löschen. `false`, wenn er nicht (mehr) da ist. */
  loescheMeinenText(id: string, teacherId: string): Promise<boolean>;

  /**
   * ★★★ N6: Eine Klasse an ihrem Code lesen - auch als Kind.
   *
   * Ohne diesen Weg rechnete die Lehrkraft-Sicht mit dem Wochenrhythmus und
   * die Kind-Sicht ohne: dieselbe Frage, zwei Antworten, keine Fehlermeldung.
   * Die Serverregel erlaubt dem Kind `view` auf die eigene Klasse seit dem
   * 02.07.2026; geschrieben wird weiterhin nur von der Lehrkraft.
   */
  getClass(code: string): Promise<TypingClass | null>;
  /**
   * ★★★ Die Klasse BEOBACHTEN (10.09.2026, Johannes: „das Fenster soll bei
   * allen Kindern schnell kommen"). Bis dahin fragte das Gerät eines Kindes
   * nur alle 45 Sekunden nach - bis zu einer Dreiviertelminute, bis die
   * gestartete Tippchallenge erschien, im Hintergrund-Tab länger.
   *
   * PocketBase-Realtime: Jede Änderung am Klassen-Datensatz kommt in etwa
   * einer Sekunde an (gemessen am 10.09.2026: der Server-Proxy puffert den
   * Ereignisstrom NICHT). Gibt die Abmeldung zurück - beim Verlassen rufen.
   * Kommt keine Verbindung zustande, passiert nichts; die Nachfrage im
   * Takt bleibt das Netz. Lokal (ohne Server) ohne Wirkung.
   */
  beobachteKlasse(code: string, beiAenderung: (cls: TypingClass) => void): () => void;
  /**
   * Die Kinder einer Klasse beobachten - für „Bereit: 12 von 14" in der Sicht
   * der Lehrkraft. Dieselbe Bauart wie {@link beobachteKlasse}.
   */
  beobachteKinder(classCode: string, beiAenderung: (kind: TypingAccount) => void): () => void;
  /**
   * Das Gerät dieses Kindes meldet: Ich kenne den Plan der Challenge
   * `probeId`. Die Zeit setzt der Server. `false` heisst nur „gerade nicht
   * gemeldet" - es hält nichts an.
   */
  meldeProbeBereit(accountId: string, probeId: string): Promise<boolean>;

  // ── Klasseneinstellungen (E3, 11.09.2026) ────────────────────────────────
  /**
   * ★★★ B8: Schulstufe (samt Eintragsjahr), Sprache und Sprachsperre der
   * KLASSE. Sie gelten für alle Kinder der Klasse - auch für die, die später
   * beitreten; gerechnet wird beim Laden (`useTypingAuth`), nichts wird in ein
   * Kind kopiert.
   *
   * Fehlt ein Feld in `aenderung`, bleibt es unverändert. Alles zusammen in
   * EINEM Aufruf: Ein Zwischenzustand aus Schulstufe ohne Eintragsjahr
   * rechnete die Textstufe der ganzen Klasse für einen Augenblick falsch.
   *
   * ⚠️ `klassenmatchAus` läuft NICHT über diesen Weg, sondern über
   * {@link setClassKlassenmatchAus} - ein Feld, ein Weg.
   */
  setClassEinstellungen(
    code: string,
    teacherId: string,
    aenderung: KlassenEinstellungenAenderung,
  ): Promise<TypingClass | null>;

  // ── Klassenmatch (11.09.2026) ────────────────────────────────────────────
  /**
   * ★★★ F8: Die Lehrkraft schaltet das Klassenmatch für ihre Klasse ab.
   *
   * Der Wert ist ein eigenes Feld an `tt_classes`, nicht Teil von `settings`
   * (Begründung in `setup.mjs:1246`: ein JSON-Feld von 2000 Bytes verliert
   * still).
   *
   * ⚠️ Das Feld heisst „Aus" und nicht „Erlaubt": Ein neues Bool-Feld ist
   * immer `false`, und die Vorgabe soll „erlaubt" sein. So braucht keine
   * bestehende Klasse eine Nachpflege.
   */
  setClassKlassenmatchAus(
    code: string,
    teacherId: string,
    aus: boolean,
  ): Promise<TypingClass | null>;
  /** Alle Matches einer Klasse (auch abgelaufene - die Phase rechnet der Client). */
  //
  // ⚠️ Scheitert die Abfrage (kein Netz), WIRFT sie - sie antwortet nicht mit
  // einer leeren Liste. Der Haken hält dann den bisherigen Stand; eine leere
  // Liste nähme einem Kind mitten im Lauf sein Match (11.09.2026 spät).
  listeMatches(classCode: string): Promise<Match[]>;
  /**
   * Ein Match ausschreiben. `hostName` und die Zeiten setzt der SERVER
   * (`tt_match.pb.js`) - ein Kind soll weder einen fremden Namen noch eine
   * längere Spielzeit eintragen können.
   */
  erstelleMatch(account: TypingAccount): Promise<Match | null>;
  /**
   * Den Zustand ändern (starten, absagen, für fertig erklären). Erlaubt ist nur
   * der Weg `einladung` → `countdown` → `laeuft` → `fertig`/`abgebrochen`; der
   * Server weist alles andere ab und setzt beim Übergang nach `countdown`
   * `startMs` und `endeMs`.
   */
  aktualisiereMatch(matchId: string, status: MatchStatus): Promise<Match | null>;
  /**
   * Die Matches der eigenen Klasse beobachten (Realtime).
   *
   * ⚠️ Gemeldet wird die GEÄNDERTE ZEILE, nicht bloss „da hat sich etwas
   * getan". Der Unterschied ist Last: Bei 30 Kindern, die alle drei Sekunden
   * ihren Stand schreiben, bekäme jedes Gerät 30 Meldungen je drei Sekunden -
   * löste jede davon eine volle Nachfrage aus, wären das 300 Abfragen je
   * Sekunde je Klasse. Die Zeile einzurechnen kostet nichts.
   */
  beobachteMatches(classCode: string, beiAenderung: (match: Match) => void): () => void;
  /** Alle Stand-Zeilen EINES Matches. */
  // ⚠️ Wie `listeMatches`: bei einem Netzfehler werfen, nie `[]` melden.
  listeMatchStaende(matchId: string): Promise<MatchStand[]>;
  /**
   * Die EIGENE Stand-Zeile schreiben (anlegen oder fortschreiben). Alle drei
   * Sekunden, und nur bei Änderung - siehe `MATCH_TAKT_MS`.
   */
  /*
    ★★★ `fehlerMelden` (02.10.2026, „Ein Kind, ein Match"): Ohne die Angabe
    meldet ein Fehlschlag wie bisher `null` (ein verlorener Takt hält keinen
    Lauf an). MIT ihr WIRFT der Aufruf, sobald der SERVER mit einem eigenen
    Satz abgewiesen hat (`Error.message` = dieser Satz, leer bei Netzfehlern) -
    beim Beitreten soll das Kind lesen, warum es nicht ging, statt still in
    einem Wartefenster zu sitzen, in dem es gar nicht steht.
  */
  schreibeMatchStand(
    account: TypingAccount,
    matchId: string,
    werte: Pick<MatchStand, "status" | "zeichen" | "fehler" | "apm" | "wert" | "wartezeitMs">,
    optionen?: { fehlerMelden?: boolean },
  ): Promise<MatchStand | null>;
  /** Die Stand-Zeilen eines Matches beobachten (Realtime) - Zeile für Zeile. */
  beobachteMatchStaende(
    matchId: string,
    beiAenderung: (stand: MatchStand) => void,
  ): () => void;
  /**
   * ★★★ E9 (19.09.2026): WIE OFT hat jedes Kind je Woche ein Klassenmatch
   * gespielt - NUR die Anzahl, kein Ranking, keine Platzierung (Johannes,
   * 18.09.: „Klassenmatch-Anzahl ja"). Dreht F10 nur für diesen einen Punkt
   * um: wer wie GUT war, bleibt der Lehrkraft weiter unzugänglich
   * (`tt_match_verlauf` selbst hat keine Leseregel - Route
   * `/api/tt/klassenmatch-anzahl`, `tt_match_anzahl.pb.js`).
   *
   * `wochenKey` ist derselbe ISO-Schlüssel wie beim Wochenziel (Montag 08:00,
   * {@link WOCHENZIEL_GRENZE}/`uebungsperioden`) - so landet ein Match in
   * genau der Woche, die „Übungszeiten" in der aufgeklappten Zeile zeigt.
   *
   * Scheitert die Abfrage (kein Netz, keine Berechtigung, Route noch nicht
   * am Server), meldet sie `null` - „unbekannt", nicht „keine Matches".
   * ★ M3 (19.09.2026): bis dahin `{}`. Seit „Übungszeiten" auch die SUMME
   * nennt („Hat noch an keinem Klassenmatch teilgenommen"), wäre `{}` bei
   * einem Fehler eine falsche Null für jedes Kind der Klasse - etwa nach
   * einem Deploy ohne „Update LMS (komplett)", wenn die Route noch fehlt.
   * Die Anzeige sagt bei `null` darum gar nichts über Klassenmatches.
   */
  klassenmatchAnzahl(classCode: string): Promise<Record<string, Record<string, number>> | null>;

  // Co-Lehrkräfte (mehrere Lehrkräfte pro Klasse, volle Rechte)
  /** Eigentümer:in + Co-Lehrkräfte einer Klasse. */
  listClassTeachers(classCode: string): Promise<ClassTeacher[]>;
  /**
   * Eine weitere Lehrkraft per E-Mail hinzufügen (volle Rechte). Kennt
   * `tt_teachers` diese E-Mail noch nicht, wird statt eines Fehlers eine
   * Einladungsmail verschickt - `invitedEmail` zeigt das an, `teachers`
   * bleibt dann unverändert.
   */
  addTeacherToClass(
    classCode: string,
    email: string,
  ): Promise<Result<{ teachers: ClassTeacher[]; invitedEmail?: string }>>;
  /** Eine Co-Lehrkraft wieder entfernen (die Eigentümer:in nicht). */
  removeTeacherFromClass(
    classCode: string,
    teacherId: string,
  ): Promise<Result<ClassTeacher[]>>;
  /** Vorschau einer Kollegen-Einladung ohne Anmeldung (Landeplatz `/lernwerkstatt-einladung`). */
  previewCoteacherInvite(
    token: string,
  ): Promise<Result<{ klasseName: string; email: string; eingeloest: boolean }>>;
  /** Einladung einlösen - braucht eine angemeldete Lehrkraft-Sitzung. */
  acceptCoteacherInvite(
    token: string,
  ): Promise<Result<{ classCode: string; klasseName: string }>>;

  // Schüler:innen
  addPupil(
    classCode: string,
    name: string,
    password: string,
    stufe: Stufe,
    tempo: TempoLevel,
    startUnits: number,
    toolProfile?: string,
    skillLevel?: string,
    /**
     * Geburtsjahr (nur die Jahreszahl, optional). Ist es gesetzt, bleibt die
     * Stufe LEER und wächst mit dem Kind mit (siehe `account.stufeFuer`).
     */
    geburtsjahr?: number,
    /**
     * Kontakt-E-Mail (optional, 14.09.2026) - ist sie gesetzt, bekommt das
     * Kind nach dem Anlegen automatisch eine Mail mit dem aktuellen Passwort
     * (server-seitig, `tt_pupils_passwort_mail.pb.js`).
     */
    contactEmail?: string,
  ): Promise<Result<TypingAccount>>;
  loginPupil(
    classCode: string,
    name: string,
    password: string,
  ): Promise<Result<TypingAccount>>;
  /**
   * SELBSTLERNENDE (09.08.2026): ein eigenes Konto ohne Klasse und ohne
   * Lehrkraft. Anmeldung mit der ECHTEN E-Mail-Adresse statt Klassencode +
   * Name — die synthetische `…@tt.local`-Adresse gibt es hier nicht, weil
   * diese Konten selbst Post bekommen (Wochenbericht, Löschwarnung).
   */
  registerPupilSelf(
    name: string,
    email: string,
    password: string,
    geburtsjahr?: number,
    /**
     * WOMIT ANFANGEN? - die Vorkenntnisse (Johannes, 01.09.2026). In einer
     * Klasse setzt die Lehrkraft sie beim Anlegen; wer sich SELBST anmeldet,
     * hat niemanden, der es für ihn tut, und gibt sie hier an.
     *
     * ⚠️ Der Server nimmt den Wert nur bei einem selbstlernenden Konto an
     * (`tt_pupils_selfsignup.pb.js`) - für ein Kind einer Klasse gilt weiter,
     * was die Lehrkraft eingetragen hat.
     */
    startUnits?: number,
    /**
     * ★ E1 (24.09.2026): ein schon feststehender Lernweg (ein Gast, der vorher
     * geübt hat). Fehlt er, wird er beim ersten Fortschritt festgelegt.
     */
    lernweg?: Lernweg,
  ): Promise<Result<TypingAccount>>;
  loginPupilSelf(email: string, password: string): Promise<Result<TypingAccount>>;
  /* ── Adresse beweisen und ändern (09.08.2026) ────────────────────────────
   * Alle über PocketBases Token-Flüsse, also mit einem Link in der Mail als
   * Beweis — dasselbe Muster wie „Passwort vergessen". Ohne Server gibt es
   * keine Mail; der lokale Rückfall sagt das ehrlich. */
  sendeKontoBestaetigung(email: string): Promise<Result<true>>;
  bestaetigeKonto(token: string): Promise<Result<true>>;
  adresseAendern(neueAdresse: string): Promise<Result<true>>;
  bestaetigeAdresse(token: string, passwort: string): Promise<Result<true>>;
  passwortAendern(
    accountId: string,
    altesPasswort: string,
    neuesPasswort: string,
  ): Promise<Result<true>>;
  /** Eigenes Konto samt Lerndaten löschen (nur Selbstlernende). */
  kontoLoeschen(accountId: string): Promise<Result<true>>;
  requestPupilPasswordReset(email: string): Promise<Result<true>>;
  confirmPupilPasswordReset(token: string, neuesPasswort: string): Promise<Result<true>>;
  sendeLehrkraftBestaetigung(email: string): Promise<Result<true>>;
  bestaetigeLehrkraft(token: string): Promise<Result<true>>;
  /**
   * Adresswechsel einer LEHRKRAFT bestätigen (04.09.2026).
   *
   * ⚠️ Eigene Methode statt eines Schalters an {@link bestaetigeAdresse}: Die
   * beiden lösen dasselbe Token in VERSCHIEDENEN Sammlungen ein
   * (`tt_pupils` bzw. `tt_teachers`). Ein Konto in der falschen Sammlung zu
   * suchen ergäbe „Link abgelaufen" - eine Fehlermeldung, die in die Irre
   * führt, weil sie nach einem Zeitproblem klingt.
   */
  bestaetigeLehrkraftAdresse(token: string, passwort: string): Promise<Result<true>>;
  listPupils(classCode: string): Promise<TypingAccount[]>;
  /**
   * ★★★ NUR für „Teilnehmerliste herunterladen" (14.09.2026, Wunsch Johannes) -
   * Name + Passwort ALLER Lernenden einer Klasse, nicht nur der eben
   * angelegten. Absichtlich eine EIGENE, engere Schnittstelle statt eines
   * Feldes an {@link TypingAccount}: `listPupils`/`mapPupil` geben das
   * Passwort nirgendwo sonst weiter, und das soll so bleiben - jede Stelle,
   * die Klassenlisten liest (Statistik, Programme, Verschieben …), soll auch
   * ohne Passwörter auskommen. Nur dieser eine, ausdrücklich angeforderte
   * Weg liest sie, und nur im Augenblick des Herunterladens.
   */
  listPupilPasswords(classCode: string): Promise<{ name: string; password: string }[]>;
  deletePupil(accountId: string): Promise<Result<true>>;
  /**
   * ★★★ Ein Kind in eine andere Klasse verschieben (10.09.2026, Wunsch
   * Johannes) - in JEDE Klasse, deren Klassencode man kennt, auch in die einer
   * anderen Lehrkraft.
   *
   * Am Server (`/api/tt/kind-verschieben`) in einer Transaktion: Konto,
   * Lernstand und Punktgenau-Stand wandern mit; die Ergebnisse der
   * Tippchallenges und die Nachrichten bleiben bei der bisherigen Klasse. Die
   * bisherige Anmeldung des Kindes endet - es meldet sich mit dem neuen Code
   * an. Wer darf, entscheidet der Server, nicht dieser Aufruf.
   */
  kindVerschieben(pupilId: string, zielCode: string): Promise<Result<KindVerschoben>>;
  setStufe(accountId: string, stufe: Stufe): Promise<TypingAccount | null>;
  /**
   * Geburtsjahr setzen (nur die Jahreszahl) oder mit `undefined` löschen. Ein
   * gültiges Jahr leert zugleich die ausdrücklich gewählte Stufe — sonst bliebe
   * sie vorrangig und das Jahr wirkungslos (`account.stufeFuer`).
   */
  setGeburtsjahr(
    accountId: string,
    geburtsjahr: number | undefined,
  ): Promise<TypingAccount | null>;
  /**
   * Vorkenntnisse setzen: ab welchen Tasten das Kind beginnt (Anzahl der
   * freigeschalteten Lern-Einheiten, benannte Stufen in `letters.startPoints()`).
   *
   * ★ Schreibt NUR das Konto. Angewandt wird der Wert beim naechsten Laden durch
   * das Kind selbst - und nur dazunehmend. Grund: Den Fortschritt darf
   * ausschliesslich das Kind schreiben (`lw_progress.update`), dieses Feld
   * ausschliesslich die Lehrkraft (`tt_pupils_field_guard`).
   */
  setStartUnits(accountId: string, startUnits: number): Promise<TypingAccount | null>;
  /**
   * Beschlüsse der Lehrkraft für Plus (23.09.2026) - dasselbe Muster wie
   * `setStartUnits`: schreibt NUR das Konto, das Kind übernimmt beim nächsten
   * Öffnen. Optional, damit Test-Doubles anderer Apps nichts nachtragen müssen.
   */
  setPlusBeschluss?(accountId: string, beschluss: unknown): Promise<TypingAccount | null>;
  /**
   * ★ E1 (24.09.2026): den Lernweg festlegen - EINMAL, beim ersten Fortschritt
   * (Bauplan englischer Lehrgang §2.2). Ein zweiter Aufruf ändert nichts; am
   * Server erzwingt das `tt_pupils_field_guard.pb.js`. Optional, damit
   * Test-Doubles anderer Apps nichts nachtragen müssen.
   */
  setLernweg?(accountId: string, lernweg: Lernweg): Promise<TypingAccount | null>;
  /**
   * ★ W2b (28.09.2026, Weg je Kind): die LEHRKRAFT stellt den Lernweg eines
   * Kindes ihrer Klasse um - auch wenn schon einer feststeht. Am Server nur für
   * Lehrkräfte DIESER Klasse (`tt_pupils_field_guard.pb.js`); das Kind selbst
   * kann ihn nach dem ersten Start nie ändern. Schreibt nur das Konto - den
   * Fortschritt parkt das Kind beim nächsten Öffnen (`wegWechsel.ts`).
   * Optional, damit Test-Doubles anderer Apps nichts nachtragen müssen.
   */
  setLernwegDurchLehrkraft?(accountId: string, lernweg: Lernweg): Promise<TypingAccount | null>;
  /** Sprache der Übungsinhalte (Deutsch/Englisch) setzen. */
  setLang(accountId: string, lang: Lang): Promise<TypingAccount | null>;
  /**
   * „Einhand schreiben" setzen: true = Umschalt-Gegenhand-Regel für dieses
   * Kind aus. Die Lehrkraft für ihre Kinder, ein Konto ohne Lehrkraft für sich
   * selbst (19.09.2026).
   */
  setOneHand(accountId: string, oneHand: boolean): Promise<TypingAccount | null>;
  /**
   * ★ „Gezielt üben" (13.11.2026) - einzelne Tasten/Zeichen (höchstens 8). `null` = nicht gesetzt. Wer es setzen darf:
   * wie {@link setOneHand} (Lehrkraft für ihr Kind, Konto ohne Lehrkraft für sich).
   */
  setGezielt(accountId: string, gezielt: Gezielt | null): Promise<TypingAccount | null>;
  /**
   * ★ 25.09.2026: die eigene Schulstufe eines Kindes (0 = wie die Klasse,
   * 1-13, 100 = Erwachsen) - gilt statt der Schulstufe der Klasse.
   */
  setSchulstufe(
    accountId: string,
    schulstufe: number,
    schulstufeSchuljahr: number,
  ): Promise<TypingAccount | null>;
  /**
   * „Zeit lassen" setzen: true = für dieses Kind zählt Tempo nirgends mehr.
   * Wer es setzen darf: wie {@link setOneHand}.
   */
  setNoTimePressure(
    accountId: string,
    noTimePressure: boolean,
  ): Promise<TypingAccount | null>;
  /**
   * „Zeichenabstand groß (CVI)" setzen: 1 = aus, 2 = doppelt, 3 = dreifach,
   * 4 = vierfach, 5 = „einfach" - siehe {@link TypingAccount.zeichenabstand}.
   * Seit 19.09.2026 setzt ihn JEDES Kind für sich selbst (auch eines einer
   * Klasse) und die Lehrkraft je Kind - wer zuletzt stellt, gilt. Ein Wert
   * ausser 1-5 bleibt ohne Wirkung (am Server wie im lokalen Backend).
   */
  setZeichenabstand(
    accountId: string,
    zeichenabstand: number,
  ): Promise<TypingAccount | null>;
  /**
   * Wochenbericht per E-Mail abbestellen (`true`) oder wieder einschalten
   * (`false`). Das selbstlernende Konto setzt es SELBST unter „Meine
   * Zugangsdaten"; derselbe Wert wird auch vom Ein-Klick-Link in der Mail
   * gesetzt (Server-Route). Siehe {@link TypingAccount.mailWeeklyOptOut}.
   */
  setMailWeeklyOptOut(
    accountId: string,
    optOut: boolean,
  ): Promise<TypingAccount | null>;
  /**
   * ★ EN9 (19.09.2026): Die Bedienungssprache am ANGEMELDETEN Konto merken
   * (`bedienSprache` an `tt_teachers`/`tt_pupils`) - danach richten sich die
   * Mails an dieses Konto. Aufgerufen, wenn jemand angemeldet die Bedienung
   * umschaltet (Sprachschalter, `TastenflowSprachBereich`). Ohne
   * Anmeldung oder ohne Server: nichts. Scheitert still.
   * Optional - das lokale Backend verschickt keine Mails.
   */
  merkeBedienSprache?(sprache: BedienSprache): Promise<void>;
  /** im Griff: Hilfsmittel-Profil des Kindes setzen. */
  setToolProfile(accountId: string, toolProfile: string): Promise<TypingAccount | null>;
  /** im Griff: Kompetenzstufe des Kindes setzen. */
  setSkillLevel(accountId: string, skillLevel: string): Promise<TypingAccount | null>;
  /**
   * ★★★ Spendenbanner (Nachbesserung 19.09.2026, `lib/spendenbanner.ts`):
   * Zustand EINES Kontos (Lehrkraft oder selbstlernendes Kind, per
   * `zielgruppe` unterschieden) lesen - unabhängig von der eigenen Sitzung,
   * damit auch von einem ZWEITEN Gerät aus derselbe Stand gilt. `accountId`
   * ist hier IMMER das Konto, das den Banner gerade selbst sieht (nie ein
   * fremdes) - siehe `SpendenBanner.tsx`.
   */
  getSpendenbannerZustand(
    accountId: string,
    zielgruppe: SpendenBannerZielgruppe,
  ): Promise<SpendenBannerZustand | null>;
  /** Spendenbanner-Zustand schreiben - `false`, wenn das Schreiben scheiterte (offline). */
  setSpendenbannerZustand(
    accountId: string,
    zielgruppe: SpendenBannerZielgruppe,
    meilensteinH: number,
    zuletztGezeigtMs: number,
  ): Promise<boolean>;
  /**
   * ★★★★★ Eine BESTÄTIGTE Spende am EIGENEN Konto merken (19.09.2026,
   * `lib/spendeBestaetigt.ts`): Feld `gespendetAm` (ms) an `tt_teachers`
   * („lehrkraft") bzw. `tt_pupils` („selbstlernend"). Danach liefert
   * `getSpendenbannerZustand` `gespendetMs`, und der Banner kommt nie wieder.
   * Nur das Datum - kein Betrag, keine Zahlungsdaten. `false`, wenn das
   * Schreiben scheiterte (abgemeldet, offline); dann bleibt der Merker am Gerät.
   */
  setGespendetAm(
    accountId: string,
    zielgruppe: SpendenBannerZielgruppe,
    gespendetMs: number,
  ): Promise<boolean>;
  /**
   * ★★ „Was gibt's Neues" (Z3, 19.09.2026, `lib/typing/neuigkeiten.ts`):
   * welche Fassung die LEHRKRAFT schon quittiert hat (`""` = noch keine) und
   * wann ihr Konto angelegt wurde - FRISCH vom Server gelesen, nicht aus dem
   * gespeicherten Konto der Sitzung: Nur so sieht ein zweites Gerät, dass das
   * Fenster schon anderswo geschlossen wurde. `null`, wenn das Lesen
   * scheiterte. `teacherId` ist immer das eigene Konto.
   */
  getNeuigkeitenStand(teacherId: string): Promise<{ gesehen: string; erstelltMs: number } | null>;
  /** Die quittierte Fassung am Konto der Lehrkraft speichern - `false`, wenn es scheiterte. */
  setNeuigkeitenGesehen(teacherId: string, fassung: string): Promise<boolean>;
  /**
   * ★★ Der Rundgang beim ersten Betreten (Z4, 19.09.2026, `lib/typing/rundgang.ts`):
   * die Schlüssel der Rundgänge, die das EIGENE Konto schon gesehen hat -
   * FRISCH vom Server gelesen, nicht aus dem gespeicherten Konto der Sitzung
   * (sonst sähe ein zweites Gerät nicht, was am ersten gesehen wurde).
   * `rolle` wählt die Sammlung (`tt_teachers` bzw. `tt_pupils`). `null`, wenn
   * das Lesen scheiterte.
   */
  getRundgaengeGesehen(
    accountId: string,
    rolle: "lehrkraft" | "schueler",
  ): Promise<string[] | null>;
  /** Die ganze Liste am eigenen Konto speichern - `false`, wenn es scheiterte. */
  setRundgaengeGesehen(
    accountId: string,
    rolle: "lehrkraft" | "schueler",
    liste: string[],
  ): Promise<boolean>;
  /**
   * Kontakt-E-Mail fürs Kind setzen/ändern (leer = wieder abschalten). Löst
   * bei jedem künftigen Zurücksetzen automatisch die Passwort-Mail aus.
   */
  setContactEmail(accountId: string, contactEmail: string): Promise<Result<true>>;
  /**
   * Überfällige Wochenziel-Einheiten eines Kindes zurücksetzen (Lehrkraft): der bis
   * jetzt aufgelaufene Rückstand wird gestrichen, ab der laufenden Woche zählt frisch
   * (Johannes 15.07.). Merkt sich die aktuelle Kalenderwoche als Stichwoche.
   */
  resetGoalOverdue(accountId: string): Promise<TypingAccount | null>;
  /**
   * Einzelne Wochen erlassen (Lehrkraft, Befund 16.09.2026 - z. B. bei
   * Krankheit): schreibt die vollständige Liste der erlassenen Wochen
   * (ISO-Kalenderwochen-Schlüssel). Eine erlassene Woche zählt nie mehr als
   * versäumt/nachzuholen; die geübte Zeit bleibt unangetastet.
   */
  setGoalExcusedWeeks(accountId: string, weeks: string[]): Promise<TypingAccount | null>;

  // ── Wochenziel NEU (W2, 18.09.2026, `wochenziel.ts`) ─────────────────────
  /**
   * ★★★ Das Wochenziel EINES Kindes setzen (die Lehrkraft; seit 19.09.2026
   * auch ein Konto ohne Lehrkraft für sich selbst, Zahnrad „Mein
   * Wochenziel"): Minuten je Woche
   * (ohne Einheiten), Ziel-Kalenderwochen, Nachholen. Gilt immer erst ab der
   * NÄCHSTEN Woche, Montag 8:00 - die laufende Woche behält ihr bisheriges
   * Ziel (siehe {@link import("./wochenziel").zielAendern}). Hat das frühere
   * `setGoal` ersetzt (W3, 18.09.2026).
   */
  setWochenziel(
    accountId: string,
    ziel: { minuten: number; wochen: string[]; nachholen: boolean },
  ): Promise<TypingAccount | null>;
  /**
   * „Für die Klasse einstellen": schreibt dieselbe Vorgabe JEDEM Kind der
   * Klasse (über {@link setWochenziel}, sequentiell) UND merkt sie an der
   * Klasse als Vorgabe für Kinder, die SPÄTER beitreten
   * ({@link TypingClass.wochenzielVorgabe}, siehe {@link addPupil}).
   */
  setKlassenWochenziel(
    classCode: string,
    ziel: { minuten: number; wochen: string[]; nachholen: boolean },
  ): Promise<{ ok: number; fehler: string[] }>;
  /**
   * „Eine Stunde sperren": 60 Minuten für die GANZE Klasse - Übung darin
   * zählt überall weiter (Übezeit, Statistik), nur nicht fürs Wochenziel.
   * Läuft schon eine Sperre, bleibt die Klasse unverändert.
   */
  stundeSperren(classCode: string): Promise<TypingClass | null>;
  /** Eine LAUFENDE Sperre vorzeitig beenden (`bisMs` = jetzt); sonst ohne Wirkung. */
  sperreAufheben(classCode: string): Promise<TypingClass | null>;

  // Passwörter
  /** Eigenes Passwort ändern (Lehrkraft oder Schüler:in): altes + neues Passwort. */
  changeOwnPassword(
    oldPassword: string,
    newPassword: string,
  ): Promise<Result<true>>;
  /** Passwort einer/eines Schüler:in zurücksetzen (Lehrkraft; ohne das alte). */
  resetPupilPassword(
    pupilId: string,
    newPassword: string,
  ): Promise<Result<true>>;

  // Fortschritt + Telemetrie
  getProgress(accountId: string): Promise<TypingProgress>;
  saveProgress(accountId: string, progress: TypingProgress): Promise<void>;
  /**
   * ★ Liefert die GANZE Ereignisliste, wie sie nach dem Schreiben im Speicher
   * liegt (28.09.2026, Serverlast). Die Wochenziel-Anzeige rechnet damit
   * weiter, statt dieselbe Zeile gleich danach noch einmal zu lesen
   * (`tippen-events-recorded`, `ereignisseGespeichert.ts`). `void` = unbekannt -
   * dann liest die Anzeige wie früher selbst nach.
   */
  recordEvent(accountId: string, event: TaskEvent): Promise<TaskEvent[] | void>;
  /**
   * ★ 27.09.2026 (Warteschlange im Gerät): mehrere geübte Zeilen auf einmal
   * nachtragen. IDEMPOTENT - eine Zeile, die schon am Server liegt (gleicher
   * Zeitstempel, gleiche Lektion), zählt nicht doppelt. Wirft bei Netz- oder
   * Serverfehlern (die Warteschlange entscheidet dann, ob nochmal).
   */
  recordEvents(
    accountId: string,
    events: readonly TaskEvent[],
    /** ★ Bricht Lesen UND Schreiben wirklich ab (Frist der Warteschlange). */
    signal?: AbortSignal,
    /** Wie bei `recordEvent`: die ganze Liste nach dem Schreiben (oder `void`). */
  ): Promise<TaskEvent[] | void>;
  getEvents(accountId: string): Promise<TaskEvent[]>;
}

// --- Lokales Backend (localStorage, ein Browser) -----------------------------
const CURRENT_KEY = "tippen-trainer:current";

class LocalTypingBackend implements TypingBackend {
  readonly kind = "local" as const;

  private setCurrent(id: string | null) {
    try {
      if (id) localStorage.setItem(CURRENT_KEY, id);
      else localStorage.removeItem(CURRENT_KEY);
    } catch {
      /* ignore */
    }
  }

  currentAccount(): TypingAccount | null {
    try {
      const id = localStorage.getItem(CURRENT_KEY);
      return id ? localGetAccount(id) : null;
    } catch {
      return null;
    }
  }

  async inhaltsAusweisSichern(_opt?: { frisch?: boolean }): Promise<void> {
    // Lokal gibt es keine geschützten Dateien und keinen Server - nichts zu tun.
  }

  logout(): void {
    this.setCurrent(null);
  }

  async registerTeacher(name: string, email: string, password: string) {
    const r = localRegisterTeacher(name, email, password);
    if (r.ok) this.setCurrent(r.value.id);
    return r;
  }

  async loginTeacher(email: string, password: string) {
    const r = localLoginTeacher(email, password);
    if (r.ok) this.setCurrent(r.value.id);
    return r;
  }

  // Im lokalen Modus gibt es keinen E-Mail-Versand. Wir tun so, als sei der Link
  // verschickt (gleiche „verrät nichts"-Antwort wie der Server), und das
  // Einlösen ist nur mit einem echten Server-Konto möglich.
  async requestTeacherPasswordReset(_email: string): Promise<Result<true>> {
    return { ok: true as const, value: true };
  }
  async confirmTeacherPasswordReset(): Promise<Result<true>> {
    return { ok: false as const, error: "Das Zurücksetzen funktioniert nur mit einem Server-Konto." };
  }

  async createClass(
    teacherId: string,
    name: string,
    code: string,
    einstellungen?: KlassenAnlage,
    codeAutoVorschlag?: boolean,
  ) {
    // ★ Dieselbe Pflicht wie am Server (10.09.2026): kein Code, keine Klasse.
    // Die Hilfsfunktion `account.createClass` erzeugt für Prüfaufbauten weiter
    // einen Code von selbst - über DIESE Schnittstelle kommt keiner mehr an.
    if (!(code ?? "").trim())
      return {
        ok: false as const,
        error: "Bitte einen Klassencode angeben - mit ihm melden sich die Kinder an.",
      };
    return localCreateClass(teacherId, name, code, einstellungen, codeAutoVorschlag);
  }
  async listClasses(teacherId: string) {
    return localListClasses(teacherId);
  }
  async deleteClass(code: string, teacherId: string) {
    return localDeleteClass(code, teacherId);
  }
  async updateClass(
    code: string,
    teacherId: string,
    changes: { name?: string; code?: string },
  ) {
    return localUpdateClass(code, teacherId, changes);
  }
  async setClassWeeklyReport(code: string, teacherId: string, on: boolean) {
    return localSetClassWeeklyReport(code, teacherId, on);
  }

  async getClass(code: string) {
    return localGetClass(code);
  }
  /** Lokal gibt es keinen Server, der etwas melden könnte - ohne Wirkung. */
  beobachteKlasse(_code: string, _beiAenderung: (cls: TypingClass) => void) {
    return () => {};
  }
  beobachteKinder(_classCode: string, _beiAenderung: (kind: TypingAccount) => void) {
    return () => {};
  }
  async meldeProbeBereit(accountId: string, probeId: string) {
    return localSetProbeBereit(accountId, probeId) !== null;
  }
  async setClassPrograms(code: string, teacherId: string, programs: string[]) {
    return localSetClassPrograms(code, teacherId, programs);
  }

  // ── Klasseneinstellungen (E3, 11.09.2026) ────────────────────────────────
  async setClassEinstellungen(
    code: string,
    teacherId: string,
    aenderung: KlassenEinstellungenAenderung,
  ) {
    return localSetClassEinstellungen(code, teacherId, aenderung);
  }

  // ── Klassenmatch: ohne Server, mit Mia und Ben (siehe matchMock.ts) ───────
  async setClassKlassenmatchAus(code: string, teacherId: string, aus: boolean) {
    return localSetClassKlassenmatchAus(code, teacherId, aus);
  }
  /*
    ★ JEDER AUFRUF HIER WÄRE AM SERVER EINE ANFRAGE - darum wird er gezählt
    ({@link mockAnfragen}). So lässt sich die Last des Klassenmatchs im Mock
    MESSEN statt behaupten; die Rechnung dazu steht in
    `klassenmatch.ts` ({@link matchAnfragenJeSekunde}), die Messung in
    `tests/typing-klassenmatch-last.test.tsx`. Die Melderunde der Abos zählt
    NICHT mit: Am Server ist das eine zugestellte Zeile, keine Frage.
  */
  async listeMatches(classCode: string) {
    mockAnfrageGezaehlt("lesen");
    return mockListeMatches(classCode);
  }
  async erstelleMatch(account: TypingAccount) {
    if (!account.classCode) return null;
    mockAnfrageGezaehlt("schreiben");
    return mockErstelleMatch(account.classCode, account.id, account.name);
  }
  async aktualisiereMatch(matchId: string, status: MatchStatus) {
    mockAnfrageGezaehlt("schreiben");
    return mockAktualisiereMatch(matchId, status);
  }
  beobachteMatches(classCode: string, beiAenderung: (match: Match) => void) {
    // Im Mock ist der „Server" der Gerätespeicher: Andere Tabs melden sich
    // über `storage`, der eigene über die Melderunde in `matchMock.ts`. Eine
    // Zeile allein kommt dort nicht an - also werden alle nachgereicht. Das
    // kostet nichts: Es ist ein Lesen aus dem Gerätespeicher, kein Netzweg.
    return mockBeobachte("matches", () => {
      for (const m of mockListeMatches(classCode)) beiAenderung(m);
    });
  }
  async listeMatchStaende(matchId: string) {
    mockAnfrageGezaehlt("lesen");
    return mockListeStaende(matchId);
  }
  async schreibeMatchStand(
    account: TypingAccount,
    matchId: string,
    werte: Pick<MatchStand, "status" | "zeichen" | "fehler" | "apm" | "wert" | "wartezeitMs">,
    optionen?: { fehlerMelden?: boolean },
  ) {
    if (!account.classCode) return null;
    mockAnfrageGezaehlt("schreiben");
    try {
      return mockSchreibeStand(matchId, account.classCode, account.id, account.name, werte);
    } catch (err) {
      // Wie am Server (`pbBackend.ts`): ohne `fehlerMelden` ein stilles `null`.
      if (optionen?.fehlerMelden) throw err;
      return null;
    }
  }
  beobachteMatchStaende(matchId: string, beiAenderung: (stand: MatchStand) => void) {
    return mockBeobachte("staende", () => {
      for (const s of mockListeStaende(matchId)) beiAenderung(s);
    });
  }
  /**
   * ★ E9: Es gibt im Mock kein Gegenstück zu `tt_match_verlauf` (das ist eine
   * reine Server-Tabelle, vom Aufräum-Cron geschrieben) - darum wird hier aus
   * dem, was der Mock ohnehin hat, GESCHÄTZT: ein FERTIGES Match zählt einmal
   * für seinen Gastgeber, in der Woche, in der es angelegt wurde. Der Mock
   * kennt nur einen echten Menschen (die zwei Mitspieler sind Bots, siehe
   * `matchMock.ts`) - für „gibt es überhaupt eine Zahl zum Anzeigen" reicht
   * das; ohne Match-Daten (oder ohne Server) meldet die Funktion `{}`.
   */
  async klassenmatchAnzahl(classCode: string) {
    const kinder: Record<string, Record<string, number>> = {};
    try {
      for (const m of mockListeMatches(classCode)) {
        if (m.status !== "fertig") continue;
        const woche = isoWeekKey(wochenStart(m.createdMs, WOCHENZIEL_GRENZE));
        const jeKind = (kinder[m.hostUid] ??= {});
        jeKind[woche] = (jeKind[woche] || 0) + 1;
      }
    } catch {
      // Ohne Mock-Daten (oder ausserhalb des Browsers) leer melden.
    }
    return kinder;
  }

  async setzeSchreibprobe(
    code: string,
    teacherId: string,
    plan: SchreibprobePlan | null,
    zeiger: ProbenZeiger,
    lernweg?: Lernweg,
  ) {
    return localSetClassSchreibprobe(code, teacherId, plan, zeiger, lernweg);
  }
  async speichereProbenergebnis(
    pupil: TypingAccount,
    ergebnis: Probenergebnis,
  ): Promise<ProbenAbgabe> {
    return localSpeichereProbenergebnis(pupil.id, ergebnis.probeId, ergebnis)
      ? "gespeichert"
      : "lag-schon";
  }
  async leseProbenergebnisse(pupilId: string) {
    return localLeseProbenergebnisse(pupilId)
      .map(ergebnisAusJson)
      .filter((e): e is Probenergebnis => e !== null);
  }
  async leseKlassenProben(classCode: string) {
    const roh = localLeseKlassenProbenergebnisse(classCode);
    const out: Record<string, Probenergebnis[]> = {};
    for (const [id, liste] of Object.entries(roh)) {
      out[id] = liste
        .map(ergebnisAusJson)
        .filter((e): e is Probenergebnis => e !== null);
    }
    return out;
  }

  async speichereEigenenText(
    classCode: string,
    teacherId: string,
    dateiname: string,
    zeilen: string[],
  ) {
    return localSpeichereEigenenText(classCode, teacherId, dateiname, zeilen);
  }
  async leseEigenenText(id: string) {
    return localLeseEigenenText(id);
  }
  async starteEigeneUebung(
    code: string,
    teacherId: string,
    eintrag: { textId: string; dateiname: string },
    vonAllenFertig?: readonly string[],
  ) {
    return localStarteEigeneUebung(code, teacherId, eintrag, vonAllenFertig);
  }
  async beendeEigeneUebung(code: string, teacherId: string, textId: string) {
    return localBeendeEigeneUebung(code, teacherId, textId);
  }
  async schreibeImGriffKapitel(
    code: string,
    teacherId: string,
    aendern: (roh: unknown) => unknown[],
  ) {
    return localSchreibeImGriffKapitel(code, teacherId, aendern);
  }

  async listeMeineTexte(teacherId: string): Promise<MeinTextEintrag[]> {
    return localListeMeineTexte(teacherId);
  }
  async speichereMeinenText(teacherId: string, dateiname: string, zeilen: string[]) {
    return localSpeichereMeinenText(teacherId, dateiname, zeilen);
  }
  async leseMeinenText(id: string) {
    return localLeseMeinenText(id);
  }
  async loescheMeinenText(id: string, teacherId: string) {
    return localLoescheMeinenText(id, teacherId);
  }

  async listClassTeachers(classCode: string) {
    return localListClassTeachers(classCode);
  }
  async addTeacherToClass(classCode: string, email: string) {
    const me = this.currentAccount();
    if (!me) return { ok: false as const, error: "Nicht angemeldet." };
    return localAddClassTeacher(classCode, email, me.id);
  }
  async removeTeacherFromClass(classCode: string, teacherId: string) {
    const me = this.currentAccount();
    if (!me) return { ok: false as const, error: "Nicht angemeldet." };
    return localRemoveClassTeacher(classCode, teacherId, me.id);
  }
  async previewCoteacherInvite(token: string) {
    return localPreviewCoteacherInvite(token);
  }
  async acceptCoteacherInvite(token: string) {
    const me = this.currentAccount();
    if (!me) return { ok: false as const, error: "Nicht angemeldet." };
    return localAcceptCoteacherInvite(token, me.id);
  }

  async addPupil(
    classCode: string,
    name: string,
    password: string,
    stufe: Stufe,
    tempo: TempoLevel,
    startUnits: number,
    _toolProfile?: string,
    _skillLevel?: string,
    geburtsjahr?: number,
    _contactEmail?: string,
  ) {
    // toolProfile/skillLevel/contactEmail werden im lokalen Mock nicht
    // persistiert (nur PB-Backend) - ohne Server geht ohnehin nie eine Mail.
    return localAddPupil(
      classCode,
      name,
      password,
      stufe,
      tempo,
      startUnits,
      geburtsjahr,
    );
  }
  async loginPupil(classCode: string, name: string, password: string) {
    const r = localLoginPupil(classCode, name, password);
    if (r.ok) this.setCurrent(r.value.id);
    return r;
  }
  /**
   * Ohne Server gibt es keine E-Mail-Konten: Der lokale Rückfall kennt nur die
   * Klassen-Anmeldung. Ehrlich absagen ist hier besser als ein Konto zu bauen,
   * das nach dem nächsten Neuladen niemand mehr findet (und das nie eine Mail
   * bekäme).
   */
  async registerPupilSelf(): Promise<Result<TypingAccount>> {
    return {
      ok: false,
      error: "Ein eigenes Konto braucht eine Verbindung zum Server.",
    };
  }
  async loginPupilSelf(): Promise<Result<TypingAccount>> {
    return {
      ok: false,
      error: "Ein eigenes Konto braucht eine Verbindung zum Server.",
    };
  }
  // Ohne Server keine Mail und kein Konto-Verwalten — ehrlich absagen statt
  // etwas zu versprechen, das niemand einlösen kann.
  private ohneServer(): Result<true> {
    return { ok: false, error: "Dafür braucht es eine Verbindung zum Server." };
  }
  async sendeKontoBestaetigung(): Promise<Result<true>> {
    return this.ohneServer();
  }
  async bestaetigeKonto(): Promise<Result<true>> {
    return this.ohneServer();
  }
  async adresseAendern(): Promise<Result<true>> {
    return this.ohneServer();
  }
  async bestaetigeAdresse(): Promise<Result<true>> {
    return this.ohneServer();
  }
  async passwortAendern(): Promise<Result<true>> {
    return this.ohneServer();
  }
  async kontoLoeschen(): Promise<Result<true>> {
    return this.ohneServer();
  }
  async requestPupilPasswordReset(): Promise<Result<true>> {
    return this.ohneServer();
  }
  async confirmPupilPasswordReset(): Promise<Result<true>> {
    return this.ohneServer();
  }
  async sendeLehrkraftBestaetigung(): Promise<Result<true>> {
    return this.ohneServer();
  }
  async bestaetigeLehrkraft(): Promise<Result<true>> {
    return this.ohneServer();
  }
  async bestaetigeLehrkraftAdresse(): Promise<Result<true>> {
    return this.ohneServer();
  }
  async listPupils(classCode: string) {
    return localListPupils(classCode);
  }
  async listPupilPasswords(classCode: string) {
    // Das lokale Gerät speichert nur den HASH (`hashSecret`), nie den
    // Klartext - anders als `tt_pupils.passwordPlain` am echten Server (der
    // Klartext-Spiegel, siehe `setup.mjs`). Ohne Server ist das Passwort
    // darum grundsätzlich nicht mehr lesbar; das sagt der leere Text, statt
    // eine falsche Zahl vorzutäuschen.
    const pupils = await localListPupils(classCode);
    return pupils.map((p) => ({ name: p.name, password: "" }));
  }
  async deletePupil(accountId: string) {
    return localDeletePupil(accountId);
  }
  async kindVerschieben(pupilId: string, zielCode: string) {
    const me = this.currentAccount();
    if (!me) return { ok: false as const, error: "Nicht angemeldet." };
    return localMovePupil(pupilId, zielCode, me.id);
  }
  async setStufe(accountId: string, stufe: Stufe) {
    return localSetStufe(accountId, stufe);
  }
  async setGeburtsjahr(accountId: string, geburtsjahr: number | undefined) {
    return localSetGeburtsjahr(accountId, geburtsjahr);
  }
  async setStartUnits(accountId: string, startUnits: number) {
    return localSetStartUnits(accountId, startUnits);
  }
  async setPlusBeschluss(accountId: string, beschluss: unknown) {
    return localSetPlusBeschluss(accountId, beschluss);
  }
  async setLernweg(accountId: string, lernweg: Lernweg) {
    return localSetLernweg(accountId, lernweg);
  }
  async setLernwegDurchLehrkraft(accountId: string, lernweg: Lernweg) {
    return localSetLernwegDurchLehrkraft(accountId, lernweg);
  }
  async setLang(accountId: string, lang: Lang) {
    return localSetLang(accountId, lang);
  }
  async setOneHand(accountId: string, oneHand: boolean) {
    return localSetOneHand(accountId, oneHand);
  }
  async setGezielt(accountId: string, gezielt: Gezielt | null) {
    return localSetGezielt(accountId, gezielt);
  }
  async setSchulstufe(accountId: string, schulstufe: number, schulstufeSchuljahr: number) {
    return localSetSchulstufe(accountId, schulstufe, schulstufeSchuljahr);
  }
  async setNoTimePressure(accountId: string, noTimePressure: boolean) {
    return localSetNoTimePressure(accountId, noTimePressure);
  }
  async setZeichenabstand(accountId: string, zeichenabstand: number) {
    return localSetZeichenabstand(accountId, zeichenabstand);
  }
  async setMailWeeklyOptOut(accountId: string, optOut: boolean) {
    return localSetMailWeeklyOptOut(accountId, optOut);
  }
  async setToolProfile(accountId: string, toolProfile: string) {
    return localSetToolProfile(accountId, toolProfile);
  }
  async setSkillLevel(accountId: string, skillLevel: string) {
    return localSetSkillLevel(accountId, skillLevel);
  }
  // `zielgruppe` betrifft nur die PocketBase-Fassung (Wahl der Collection) -
  // im lokalen Mock liegen Lehrkräfte und Kinder in DERSELBEN Kontentabelle.
  async getSpendenbannerZustand(accountId: string) {
    return localGetSpendenbannerZustand(accountId);
  }
  async setSpendenbannerZustand(
    accountId: string,
    _zielgruppe: SpendenBannerZielgruppe,
    meilensteinH: number,
    zuletztGezeigtMs: number,
  ) {
    return localSetSpendenbannerZustand(accountId, meilensteinH, zuletztGezeigtMs) != null;
  }
  async setGespendetAm(accountId: string, _zielgruppe: SpendenBannerZielgruppe, gespendetMs: number) {
    return localSetGespendetAm(accountId, gespendetMs) != null;
  }
  async getNeuigkeitenStand(teacherId: string) {
    return localGetNeuigkeitenStand(teacherId);
  }
  async setNeuigkeitenGesehen(teacherId: string, fassung: string) {
    return localSetNeuigkeitenGesehen(teacherId, fassung);
  }
  async getRundgaengeGesehen(accountId: string) {
    return localGetRundgaengeGesehen(accountId);
  }
  async setRundgaengeGesehen(accountId: string, _rolle: "lehrkraft" | "schueler", liste: string[]) {
    return localSetRundgaengeGesehen(accountId, liste);
  }
  async setContactEmail(): Promise<Result<true>> {
    // Ohne Server ginge die Passwort-Mail ohnehin nie raus - ehrlich absagen
    // statt eine Adresse zu speichern, die nie etwas bekommt.
    return this.ohneServer();
  }
  async resetGoalOverdue(accountId: string) {
    return localResetGoalOverdue(accountId, isoWeekKey(Date.now()));
  }
  async setGoalExcusedWeeks(accountId: string, weeks: string[]) {
    return localSetGoalExcusedWeeks(accountId, weeks);
  }

  // ── Wochenziel NEU (W2, 18.09.2026) ──────────────────────────────────────
  async setWochenziel(
    accountId: string,
    ziel: { minuten: number; wochen: string[]; nachholen: boolean },
  ) {
    return localSetWochenziel(accountId, ziel);
  }
  async setKlassenWochenziel(
    classCode: string,
    ziel: { minuten: number; wochen: string[]; nachholen: boolean },
  ) {
    return localSetKlassenWochenziel(classCode, ziel);
  }
  async stundeSperren(classCode: string) {
    return localStundeSperren(classCode);
  }
  async sperreAufheben(classCode: string) {
    return localSperreAufheben(classCode);
  }

  async changeOwnPassword(oldPassword: string, newPassword: string) {
    const acc = this.currentAccount();
    if (!acc) return { ok: false as const, error: "Nicht angemeldet." };
    return localChangePassword(acc.id, oldPassword, newPassword);
  }
  async resetPupilPassword(pupilId: string, newPassword: string) {
    return localSetPupilPassword(pupilId, newPassword);
  }

  async getProgress(accountId: string) {
    return localGetProgress(accountId);
  }
  async saveProgress(accountId: string, progress: TypingProgress) {
    localSaveProgress(accountId, progress);
  }
  // ★ 28.09.2026: wie am Server - die ganze Liste nach dem Schreiben zurück,
  // damit die Wochenziel-Anzeige auf beiden Wegen gleich rechnet.
  async recordEvent(accountId: string, event: TaskEvent) {
    localRecordEvent(accountId, event);
    return localGetEvents(accountId);
  }
  async recordEvents(accountId: string, events: readonly TaskEvent[]) {
    localRecordEvents(accountId, events);
    return localGetEvents(accountId);
  }
  async getEvents(accountId: string) {
    return localGetEvents(accountId);
  }
}

// --- Auswahl (Singleton) -----------------------------------------------------
let instance: TypingBackend | null = null;

export function typingBackend(): TypingBackend {
  if (instance) return instance;
  const usePb =
    (import.meta.env.VITE_BACKEND ?? "mock") === "pocketbase" &&
    typeof window !== "undefined";
  if (usePb) {
    // Synchroner Konstruktor — der PB-Client ist sofort verfügbar; Aufrufe sind
    // asynchron. (Eigener authStore in pbBackend.ts, getrennt vom LMS.)
    instance = new PocketBaseTypingBackend();
  } else {
    instance = new LocalTypingBackend();
  }
  return instance;
}

/** Test-Hilfe: Singleton zurücksetzen. */
export function _resetTypingBackend() {
  instance = null;
}
