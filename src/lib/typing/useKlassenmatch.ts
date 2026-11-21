/**
 * ★★★★★ DAS KLASSENMATCH AUS DER SICHT DES KINDES (11.09.2026).
 *
 * Der Haken beantwortet vier Fragen und sonst keine:
 *  1. **Darf dieses Kind überhaupt?** (Klassenkind, und die Lehrkraft hat das
 *     Match nicht abgeschaltet - F8.)
 *  2. **Lädt gerade jemand ein?** (F2 - und zwar jemand, dessen Einladung
 *     dieses Kind noch nicht abgelehnt hat und die es auch bekommen darf, F9.)
 *  3. **Bin ich in einem Match, und wo steht es?** (Einladung, Countdown, Lauf,
 *     Ende - {@link matchPhaseVon} rechnet das aus `startMs`/`endeMs`.)
 *  4. **Wer ist dabei, und wie stehen sie?** (Die Stand-Zeilen des Matches.)
 *
 * Angezeigt wird hier nichts - das tun `KlassenmatchEinladung`,
 * `KlassenmatchLobby`, `KlassenmatchLauf` und `KlassenmatchErgebnis`.
 *
 * ── Wehrhaft in EINE Richtung ───────────────────────────────────────────────
 * Kein Konto, keine Klasse, kein Netz, ein kaputter Wert: In jedem dieser Fälle
 * kommt „kein Match" heraus, und das Kind übt weiter. **Ein Ladefehler darf
 * einem Kind nie ein Spiel vor die Nase setzen** - und er darf einem Kind, das
 * gerade in einem Match schreibt, auch nicht die Uhr zurückstellen (darum
 * bleibt bei einer gescheiterten Nachfrage der bisherige Stand stehen, siehe
 * {@link useKlassenBeobachtung}).
 *
 * ── Was hier NICHT passiert ─────────────────────────────────────────────────
 * Nichts wird in `tt_schreibproben` geschrieben, nichts in der Statistik
 * vermerkt, kein Rang gespeichert (F10). Was das Match am Lernstand ändert -
 * Übezeit und Tastenfreischaltung -, macht `KlassenmatchLauf` über dieselben
 * Wege wie eine gewöhnliche Übungsrunde.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { TypingAccount, TypingClass } from "./account";
import { gehoertEinerKlasse } from "./account";
import { typingBackend } from "./backend";
import {
  MATCH_EINLADUNG_FRIST_MS,
  MATCH_KLASSE_NACHFRAGE_MS,
  MATCH_NACHFRAGE_MS,
  MATCH_STAND_NACHFRAGE_MS,
  MATCH_TAKT_MS,
  ausschreibungsOrdnung,
  gebundeneKinder,
  matchHinweisLaeuft,
  matchOffen,
  matchPhaseVon,
  nimmtTeil,
  offeneEinladungen,
  unentschiedenZahl,
  type Match,
  type MatchPhase,
  type MatchStand,
  type MatchStandStatus,
} from "./klassenmatch";
import { serverJetzt } from "./serverUhr";
import { speakUi } from "./voice";
import { useKlassenBeobachtung } from "./useKlassenBeobachtung";
import { useBedienSprache } from "../bedienSprache/BedienSpracheProvider";
import type { BedienSprache } from "../bedienSprache/sprache";
import { texte } from "../bedienSprache/texte";
import { serverMeldung } from "./serverMeldungen";

/**
 * ★★ DIE MELDUNGEN DES HAKENS in beiden Bedienungssprachen (EN5, 19.09.2026).
 * Deutsch wortgleich wie vorher. Sie stehen am Bildschirm (`meldung`, von der
 * Übungsseite gezeigt), im Einladungsfenster (`einladungVorsatz`) und werden
 * gesprochen. Englisch nach dem Glossar §3.7: *Class Match*, absagen ⇒ *call
 * off*, *invitation*.
 * ⚠️ `grund` beim Ausschreiben ist die Meldung des SERVERS (deutsch). Seit EN9
 * (19.09.2026) übersetzt sie `serverMeldung()` aus `serverMeldungen.ts` -
 * kennt die Tabelle einen Satz nicht, bleibt er deutsch.
 * Exportiert für den Wächter `tests/tastenflow-englisch-challenge-match.test.tsx`
 * (manche Sätze entstehen nur in Abläufen, die der Mock nicht nachstellt).
 */
export const MATCH_MELDUNGEN = texte({
  de: {
    nichtAusgeschrieben: (grund: string) =>
      `Das Klassenmatch konnte nicht ausgeschrieben werden: ${grund}`,
    nichtAusgeschriebenOhneGrund:
      "Das Klassenmatch konnte gerade nicht ausgeschrieben werden - bitte gleich noch einmal versuchen. Wenn es wieder nicht geht, sag es deiner Lehrkraft.",
    anderesKind: "Ein anderes Kind",
    schonEingeladen: (wer: string) => `${wer} hat schon eingeladen.`,
    deinsAbgesagt: "Dein Klassenmatch wurde abgesagt.",
    hostHatAbgesagt: (host: string) => `${host} hat das Klassenmatch abgesagt.`,
    abgesagt: "Das Klassenmatch wurde abgesagt.",
    niemandBeigetreten:
      "Niemand ist deinem Klassenmatch beigetreten - die Einladung ist zurückgezogen.",
  },
  en: {
    nichtAusgeschrieben: (grund: string) =>
      `The Class Match invitation couldn't be sent: ${grund}`,
    nichtAusgeschriebenOhneGrund:
      "The Class Match invitation couldn't be sent just now - please try again in a moment. If it happens again, tell your teacher.",
    anderesKind: "Someone else",
    schonEingeladen: (wer: string) => `${wer} has already sent an invitation.`,
    deinsAbgesagt: "Your Class Match has been called off.",
    hostHatAbgesagt: (host: string) => `${host} has called off the Class Match.`,
    abgesagt: "The Class Match has been called off.",
    niemandBeigetreten: "Nobody joined your Class Match - the invitation has been withdrawn.",
  },
  fr: {
    nichtAusgeschrieben: (grund: string) =>
      `Le Match de la classe n'a pas pu être lancé : ${grund}`,
    nichtAusgeschriebenOhneGrund:
      "Le Match de la classe n'a pas pu être lancé pour l'instant - réessaie dans un instant. Si ça ne marche toujours pas, dis-le à ton enseignant ou ton enseignante.",
    anderesKind: "Un autre élève",
    schonEingeladen: (wer: string) => `${wer} a déjà lancé une invitation.`,
    deinsAbgesagt: "Ton Match de la classe a été annulé.",
    hostHatAbgesagt: (host: string) => `${host} a annulé le Match de la classe.`,
    abgesagt: "Le Match de la classe a été annulé.",
    niemandBeigetreten: "Personne n'a rejoint ton Match de la classe - l'invitation est retirée.",
  },
  es: {
    nichtAusgeschrieben: (grund: string) =>
      `No se pudo iniciar la Competición de la clase: ${grund}`,
    nichtAusgeschriebenOhneGrund:
      "Ahora mismo no se pudo iniciar la Competición de la clase - vuelve a intentarlo en un momento. Si sigue sin funcionar, díselo a tu docente.",
    anderesKind: "Otra persona de tu clase",
    schonEingeladen: (wer: string) => `${wer} ya ha enviado una invitación.`,
    deinsAbgesagt: "Tu Competición de la clase se ha cancelado.",
    hostHatAbgesagt: (host: string) => `${host} ha cancelado la Competición de la clase.`,
    abgesagt: "La Competición de la clase se ha cancelado.",
    niemandBeigetreten: "Nadie se ha unido a tu Competición de la clase - la invitación se retira.",
  },
  // ★ O-IT (02.10.2026): tu; „Gara di classe", „l'insegnante" ohne Possessiv.
  it: {
    nichtAusgeschrieben: (grund: string) =>
      `Non è stato possibile proporre la Gara di classe: ${grund}`,
    nichtAusgeschriebenOhneGrund:
      "In questo momento non è stato possibile proporre la Gara di classe - riprova tra un attimo. Se ancora non funziona, dillo all'insegnante.",
    anderesKind: "Un'altra persona della tua classe",
    schonEingeladen: (wer: string) => `${wer} ha già mandato un invito.`,
    deinsAbgesagt: "La tua Gara di classe è stata annullata.",
    hostHatAbgesagt: (host: string) => `${host} ha annullato la Gara di classe.`,
    abgesagt: "La Gara di classe è stata annullata.",
    niemandBeigetreten: "Nessuno si è unito alla tua Gara di classe - l'invito è stato ritirato.",
  },
  // ★ O-PL (02.10.2026): ty; „Wyścig klasowy" gebeugt ausgeschrieben; Namen
  // als Subjekt im Präsens oder nach Doppelpunkt, nie eine gegenderte
  // Vergangenheit („odwołuje", nicht „odwołał/odwołała"); einmal „nauczyciel
  // lub nauczycielka" (Glossar Regel 2, 11).
  pl: {
    nichtAusgeschrieben: (grund: string) =>
      `Nie udało się ogłosić Wyścigu klasowego: ${grund}`,
    nichtAusgeschriebenOhneGrund:
      "Nie udało się teraz ogłosić Wyścigu klasowego - spróbuj ponownie za chwilę. Jeśli znowu nie zadziała, powiedz o tym nauczycielowi lub nauczycielce.",
    anderesKind: "Inna osoba z twojej klasy",
    schonEingeladen: (wer: string) => `Jest już zaproszenie od: ${wer}.`,
    deinsAbgesagt: "Twój Wyścig klasowy jest odwołany.",
    hostHatAbgesagt: (host: string) => `${host} odwołuje Wyścig klasowy.`,
    abgesagt: "Wyścig klasowy jest odwołany.",
    niemandBeigetreten:
      "Do twojego Wyścigu klasowego nie dołączyła żadna osoba - zaproszenie jest wycofane.",
  },
  // ★ O-TR (02.10.2026): sen; Namen nach Doppelpunkt ohne Endung ("Davet eden:
  // Ali.", "İptal eden: Ali."), Endungen nur am festen Wort ("Sınıf Maçına").
  tr: {
    nichtAusgeschrieben: (grund: string) => `Sınıf Maçı duyurulamadı: ${grund}`,
    nichtAusgeschriebenOhneGrund:
      "Sınıf Maçı şu anda duyurulamadı - birazdan tekrar dene. Yine olmazsa öğretmenine söyle.",
    anderesKind: "Sınıftan biri",
    schonEingeladen: (wer: string) => `Zaten bir davet var. Davet eden: ${wer}.`,
    deinsAbgesagt: "Sınıf Maçın iptal edildi.",
    hostHatAbgesagt: (host: string) => `Sınıf Maçı iptal edildi. İptal eden: ${host}.`,
    abgesagt: "Sınıf Maçı iptal edildi.",
    niemandBeigetreten: "Sınıf Maçına kimse katılmadı - davet geri çekildi.",
  },
  // ★ O-CS (03.10.2026): ty; „Třídní závod" gebeugt ausgeschrieben; Namen als
  // Subjekt im Präsens („Honza ruší Třídní závod.") oder nach Doppelpunkt („Zve: Honza."),
  // nie eine Vergangenheit über eine Person (Glossar Regel 2, 12).
  cs: {
    nichtAusgeschrieben: (grund: string) => `Třídní závod se nepodařilo vyhlásit: ${grund}`,
    nichtAusgeschriebenOhneGrund:
      "Třídní závod se teď nepodařilo vyhlásit - zkus to za chvíli znovu. Když to zase nepůjde, zeptej se ve třídě.",
    anderesKind: "Někdo z tvé třídy",
    schonEingeladen: (wer: string) => `Pozvánka už existuje. Zve: ${wer}.`,
    deinsAbgesagt: "Tvůj Třídní závod je zrušený.",
    hostHatAbgesagt: (host: string) => `${host} ruší Třídní závod.`,
    abgesagt: "Třídní závod je zrušený.",
    niemandBeigetreten:
      "K tvému Třídnímu závodu se nepřipojila žádná osoba - pozvánka je stažená.",
  },
  // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: {
    nichtAusgeschrieben: (grund: string) => `Състезанието в класа не можа да бъде обявено: ${grund}`,
    nichtAusgeschriebenOhneGrund:
      "Състезанието в класа в момента не можа да бъде обявено - опитай пак след малко. Ако пак не стане, попитай в класа.",
    anderesKind: "Някой от класа ти",
    schonEingeladen: (wer: string) => `Поканата вече съществува. Кани: ${wer}.`,
    deinsAbgesagt: "Твоето състезание в класа е отменено.",
    hostHatAbgesagt: (host: string) => `${host} отменя състезанието в класа.`,
    abgesagt: "Състезанието в класа е отменено.",
    niemandBeigetreten:
      "Никой не се присъедини към твоето състезание в класа - поканата е оттеглена.",
  },
  el: {
    nichtAusgeschrieben: (grund: string) => `Ο Αγώνας τμήματος δεν μπόρεσε να ανακοινωθεί: ${grund}`,
    nichtAusgeschriebenOhneGrund:
      "Ο Αγώνας τμήματος δεν μπόρεσε να ανακοινωθεί αυτή τη στιγμή - δοκίμασε ξανά σε λίγο. Αν δεν πετύχει ούτε τώρα, ρώτα στην τάξη.",
    anderesKind: "Ένα άτομο του τμήματος",
    schonEingeladen: (wer: string) => `Υπάρχει ήδη πρόσκληση. Σε προσκαλεί: ${wer}.`,
    deinsAbgesagt: "Ο Αγώνας τμήματός σου ακυρώθηκε.",
    hostHatAbgesagt: (host: string) => `Ο Αγώνας τμήματος ακυρώθηκε. Ακύρωση από: ${host}.`,
    abgesagt: "Ο Αγώνας τμήματος ακυρώθηκε.",
    niemandBeigetreten:
      "Κανένα άτομο δεν συμμετείχε στον Αγώνα τμήματός σου - η πρόσκληση αποσύρθηκε.",
  },
  hu: {
    nichtAusgeschrieben: (grund: string) => `Az osztályversenyt nem sikerült kiírni: ${grund}`,
    nichtAusgeschriebenOhneGrund:
      "Az osztályversenyt most nem sikerült kiírni - próbáld meg újra egy pillanat múlva. Ha megint nem megy, szólj a tanárodnak.",
    anderesKind: "Egy tanuló az osztályból",
    schonEingeladen: (wer: string) => `Már van meghívó. Küldője: ${wer}`,
    deinsAbgesagt: "Az osztályversenyed elmarad.",
    hostHatAbgesagt: (host: string) => `${host} lemondta az osztályversenyt.`,
    abgesagt: "Az osztályverseny elmarad.",
    niemandBeigetreten:
      "Senki sem csatlakozott az osztályversenyedhez - a meghívó visszavonva.",
  },
  nl: {
    nichtAusgeschrieben: (grund: string) => `De Klassenwedstrijd kon niet worden aangemaakt: ${grund}`,
    nichtAusgeschriebenOhneGrund:
      "De Klassenwedstrijd kon nu niet worden aangemaakt - probeer het zo meteen nog eens. Lukt het weer niet, vertel het dan aan je leerkracht.",
    anderesKind: "Iemand uit je klas",
    schonEingeladen: (wer: string) => `${wer} heeft al uitgenodigd.`,
    deinsAbgesagt: "Je Klassenwedstrijd is afgelast.",
    hostHatAbgesagt: (host: string) => `${host} heeft de Klassenwedstrijd afgelast.`,
    abgesagt: "De Klassenwedstrijd is afgelast.",
    niemandBeigetreten:
      "Niemand heeft meegedaan aan je Klassenwedstrijd - de uitnodiging is ingetrokken.",
  },
  pt: {
    nichtAusgeschrieben: (grund: string) => `Não foi possível lançar a Corrida da turma: ${grund}`,
    nichtAusgeschriebenOhneGrund:
      "Não foi possível lançar a Corrida da turma neste momento - tenta outra vez daqui a pouco. Se voltar a falhar, fala com quem te ensina.",
    anderesKind: "Alguém da turma",
    schonEingeladen: (wer: string) => `${wer} já enviou um convite.`,
    deinsAbgesagt: "A tua Corrida da turma foi cancelada.",
    hostHatAbgesagt: (host: string) => `${host} cancelou a Corrida da turma.`,
    abgesagt: "A Corrida da turma foi cancelada.",
    niemandBeigetreten:
      "Ninguém entrou na tua Corrida da turma - o convite foi retirado.",
  },
  br: {
    nichtAusgeschrieben: (grund: string) => `Não foi possível lançar a Competição da turma: ${grund}`,
    nichtAusgeschriebenOhneGrund:
      "Não foi possível lançar a Competição da turma agora - tente de novo daqui a pouco. Se não funcionar outra vez, avise quem dá aula na sua turma.",
    anderesKind: "Outra pessoa da turma",
    schonEingeladen: (wer: string) => `Já existe um convite. Quem convidou: ${wer}.`,
    deinsAbgesagt: "Sua Competição da turma foi cancelada.",
    hostHatAbgesagt: (host: string) => `${host} cancelou a Competição da turma.`,
    abgesagt: "A Competição da turma foi cancelada.",
    niemandBeigetreten:
      "Ninguém entrou na sua Competição da turma - o convite foi retirado.",
  },
  ro: {
    nichtAusgeschrieben: (grund: string) => `Întrecerea clasei nu a putut fi lansată: ${grund}`,
    nichtAusgeschriebenOhneGrund:
      "Întrecerea clasei nu a putut fi lansată acum - încearcă din nou peste puțin timp. Dacă nu merge din nou, întreabă la clasă.",
    anderesKind: "Cineva din clasa ta",
    schonEingeladen: (wer: string) => `Invitația există deja. Invită: ${wer}.`,
    deinsAbgesagt: "Întrecerea ta a fost anulată.",
    hostHatAbgesagt: (host: string) => `${host} a anulat Întrecerea clasei.`,
    abgesagt: "Întrecerea clasei a fost anulată.",
    niemandBeigetreten:
      "La Întrecerea ta nu s-a alăturat nicio persoană - invitația a fost retrasă.",
  },
  sv: {
    nichtAusgeschrieben: (grund: string) => `Klasstävlingen kunde inte skapas: ${grund}`,
    nichtAusgeschriebenOhneGrund:
      "Klasstävlingen kunde inte skapas just nu - försök igen om en stund. Går det inte då heller, berätta för läraren.",
    anderesKind: "En elev i klassen",
    schonEingeladen: (wer: string) => `${wer} har redan bjudit in.`,
    deinsAbgesagt: "Din klasstävling är inställd.",
    hostHatAbgesagt: (host: string) => `${host} har ställt in klasstävlingen.`,
    abgesagt: "Klasstävlingen är inställd.",
    niemandBeigetreten:
      "Ingen har gått med i din klasstävling - inbjudan är tillbakadragen.",
  },
  uk: {
    nichtAusgeschrieben: (grund: string) => `Не вдалося оголосити Перегони класу: ${grund}`,
    nichtAusgeschriebenOhneGrund:
      "Зараз не вдалося оголосити Перегони класу - спробуй ще раз за мить. Якщо знову не вийде, скажи педагогу.",
    anderesKind: "Хтось із класу",
    schonEingeladen: (wer: string) => `Запрошення вже є. Запрошує: ${wer}.`,
    deinsAbgesagt: "Твої Перегони класу скасовано.",
    hostHatAbgesagt: (host: string) => `${host} скасовує Перегони класу.`,
    abgesagt: "Перегони класу скасовано.",
    niemandBeigetreten:
      "До твоїх Перегонів класу ніхто не приєднався - запрошення відкликано.",
  },
});

/** Wo die abgelehnten Einladungen im Gerät liegen. */
function abgelehntSchluessel(accountId: string): string {
  return `tastenflow:klassenmatch-abgelehnt:${accountId}`;
}

/**
 * ★★ EINE ABGELEHNTE EINLADUNG KOMMT NICHT WIEDER (F2).
 *
 * *„Ein Kind, das die Einladung ablehnt, bekommt dieselbe nicht noch einmal;
 * eine zweite Einladung (anderes Match) schon."*
 *
 * Gemerkt wird im GERÄT und nicht nur im Speicher: Sonst käme dieselbe
 * Einladung nach jedem Neuladen wieder hoch - und ein Kind, das gerade übt und
 * versehentlich die Seite neu lädt, säse wieder vor dem Fenster, das es eben
 * weggeklickt hat. Gemerkt werden nur Kennungen, also keine Namen und nichts
 * über andere Kinder.
 */
function leseAbgelehnt(accountId: string): string[] {
  try {
    const roh = localStorage.getItem(abgelehntSchluessel(accountId));
    const o = roh ? JSON.parse(roh) : null;
    return Array.isArray(o) ? o.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function schreibeAbgelehnt(accountId: string, ids: readonly string[]): void {
  try {
    // Gedeckelt: Ein Gerätespeicher ist kein Archiv, und ein Match von gestern
    // gibt es längst nicht mehr (der Hook räumt nach einer Stunde auf).
    localStorage.setItem(abgelehntSchluessel(accountId), JSON.stringify(ids.slice(-40)));
  } catch {
    // Kein Speicher (privates Fenster): Dann kann dieselbe Einladung nach einem
    // Neuladen noch einmal kommen. Das ist lästig, aber es hält niemanden auf.
  }
}

/**
 * „Sarah hat …" - ohne Namen (ein alter Datensatz) steht statt eines leeren
 * Satzanfangs der Ersatz da.
 */
function nameOder(name: string, ersatz: string): string {
  return name.trim() || ersatz;
}

export interface KlassenmatchStand {
  /** Darf dieses Kind ein Match ausschreiben oder annehmen? (F1, F8, F9) */
  erlaubt: boolean;
  /**
   * Warum gerade nicht - als Beschriftung für den Schalter („Klassenmatch läuft
   * gerade", „Zwei Matches laufen"). Leer, wenn eingeladen werden darf oder es
   * den Schalter gar nicht gibt. Siehe `hinweis` im Rumpf des Hakens.
   */
  hinweis: string;
  /** Ist die Klasse schon geladen? Vorher steht der Schalter NICHT da. */
  geladen: boolean;
  /**
   * ★★★★★ Warum es NICHT losging - ein Satz, oder leer (11.09.2026 abends).
   *
   * Johannes, am Live-Stand als Sarah: „wenn ich auf Klassenmatch klicke, dann
   * passiert gar nichts". Der Server hatte abgewiesen (ein Hook-Absturz), und
   * `einladen` verschluckte das mit `.catch(() => {})`. Ein Schalter, der
   * stillschweigend nichts tut, ist genau das, was es hier nicht gibt (R-A3)
   * - darum steht der Grund jetzt HIER, wird am Bildschirm gezeigt und
   * gesprochen. Leer heisst „kein Grund".
   *
   * Seit 11.09.2026 spät steht hier auch, warum ein Match, dem dieses Kind
   * beigetreten war, doch nicht losging („Sarah hat das Klassenmatch
   * abgesagt.") - aber nur, wenn keine andere Einladung wartet; sonst sagt es
   * {@link einladungVorsatz}.
   */
  meldung: string;
  /** Die Meldung wegnehmen (nach dem Lesen, oder wenn es doch losgeht). */
  meldungLoeschen: () => void;
  /** Eine offene Einladung von jemand anderem - oder `null`. Die ÄLTESTE zuerst. */
  einladung: Match | null;
  /**
   * ★ Was eben passiert ist, als Satz VOR der Einladung - oder leer.
   * „Sarah hat schon eingeladen." (das eigene, spätere Match wurde abgesagt)
   * oder „Franz hat das Klassenmatch abgesagt." Gilt nur für GENAU die
   * Einladung, zu der er gehört; das Einladungsfenster spricht ihn mit.
   */
  einladungVorsatz: string;
  /** Das eigene Match (ausgeschrieben oder beigetreten) - oder `null`. */
  meinMatch: Match | null;
  /** Wo das eigene Match steht. */
  phase: MatchPhase;
  /** Bin ich der Gastgeber? */
  binGastgeber: boolean;
  /**
   * Die Stand-Zeilen des eigenen Matches - NUR die, die teilnehmen
   * ({@link nimmtTeil}). Eine `eingeladen`- oder `abgelehnt`-Zeile kommt hier
   * nie an: Ranking, „3 dabei" und die Platzierungsliste lesen diese Liste.
   */
  staende: MatchStand[];
  /** „Starten" geht erst, wenn ausser mir jemand dabei ist (F4). */
  kannStarten: boolean;
  /**
   * ★★★ Wie viele Kinder haben die Einladung bekommen und sich noch nicht
   * entschieden? (02.10.2026, nur beim Gastgeber sinnvoll) - Grundlage der
   * Rückfrage „3 Kinder haben sich noch nicht entschieden. Trotzdem starten?"
   * im Wartefenster.
   */
  unentschieden: number;
  /**
   * Das Einladungsfenster ist auf DIESEM Gerät aufgegangen - die eigene Zeile
   * geht auf `eingeladen`, damit die Gastgeberin weiss, wer noch überlegt.
   */
  einladungGezeigt: (matchId: string) => void;
  /**
   * ★★★ „Arne lädt gerade ein. Mitmachen oder selbst einladen?" (02.10.2026)
   *
   * Steht eine fremde Einladung offen, legt „Klassenmatch" (Schalter oder
   * Alt + M) nicht sofort ein zweites Match an, sondern fragt zuerst - hier
   * steht die Einladung, um die es geht, sonst `null`.
   */
  rueckfrage: Match | null;
  /** „Mitmachen": der offenen Einladung beitreten. */
  rueckfrageMitmachen: () => void;
  /** „Selbst einladen": die offenen fremden Einladungen absagen und selbst einladen. */
  rueckfrageSelbst: () => void;
  /** Escape: nichts tun, zurück zum Üben. */
  rueckfrageSchliessen: () => void;
  /**
   * Steht dieses Kind gerade vor der Platzierungsliste eines VORBEI-en
   * Matches? Dann ist es frei (02.10.2026): Eine neue Einladung geht über der
   * Liste auf, und „Jetzt nicht" führt dorthin zurück.
   */
  aufRangliste: boolean;
  /** Ein Match ausschreiben (F1). */
  einladen: () => void;
  /** Einer Einladung folgen (F2). */
  beitreten: (matchId: string) => void;
  /** „Jetzt nicht" - diese Einladung kommt nicht wieder (F2). */
  ablehnen: (matchId: string) => void;
  /** „Starten" beim Gastgeber (F4/F5). */
  starten: () => void;
  /** „Absagen" beim Gastgeber (F4). */
  absagen: () => void;
  /** Den eigenen Stand melden - höchstens alle {@link MATCH_TAKT_MS}. */
  standMelden: (
    werte: Pick<MatchStand, "zeichen" | "fehler" | "apm" | "wert" | "wartezeitMs">,
    status?: MatchStandStatus,
  ) => void;
  /** Fertig: die letzte Zeile schreiben und das Match schliessen (F13). */
  fertigMelden: (werte: Pick<MatchStand, "zeichen" | "fehler" | "apm" | "wert" | "wartezeitMs">) => void;
  /** „Weiter üben" nach dem Ergebnis - das Match loslassen. */
  verlassen: () => void;
  /**
   * ★★★ „Verlassen" MITTEN IM DURCHGANG (Countdown oder Lauf, 11.09.2026 abends).
   *
   * Die eigene Zeile geht mit den BISHERIGEN Zahlen auf `fertig` - die anderen
   * sehen im Ranking, was geschrieben wurde, statt einer Null. Das Match
   * selbst bleibt unangetastet, auch beim Gastgeber: Die anderen schreiben
   * weiter, und ihr Ende rechnet jedes Gerät ohnehin selbst (F13).
   */
  mittendrinVerlassen: (werte: Pick<MatchStand, "zeichen" | "fehler" | "apm" | "wert" | "wartezeitMs">) => void;
  /**
   * „Doch nicht" aus dem Wartefenster: die eigene Zeile auf `fertig` setzen und
   * das Match loslassen.
   *
   * ⚠️ Nicht dasselbe wie {@link verlassen}: Wer einfach loslässt, steht beim
   * Gastgeber weiter in der Liste, und der könnte mit einem Kind starten, das
   * gar nicht mehr da ist.
   */
  aussteigen: () => void;
}

export function useKlassenmatch(account: TypingAccount | null | undefined): KlassenmatchStand {
  /*
    ★ EN5: Die Bedienungssprache für die Meldungen und das Gesprochene. Über
    einen Ref gelesen - die Effekte unten sollen nicht neu laufen, nur weil
    jemand die Sprache umschaltet (ein Effekt, der eine Meldung setzt, setzte
    sie sonst ein zweites Mal). Ohne aktiven Sprachbereich: `speakUi(text)`
    wie vorher.
  */
  const bedien = useBedienSprache();
  const bedienRef = useRef<{ sprache: BedienSprache; bereichAktiv: boolean }>(bedien);
  bedienRef.current = bedien;
  const sag = useCallback((text: string) => {
    const b = bedienRef.current;
    if (b.bereichAktiv) speakUi(text, undefined, undefined, b.sprache);
    else speakUi(text);
  }, []);
  const istKlassenkind = gehoertEinerKlasse(account);
  const classCode = istKlassenkind ? (account?.classCode ?? "") : "";
  const accountId = account?.id ?? "";

  const [meinMatchId, setMeinMatchId] = useState<string | null>(null);
  const [abgelehnt, setAbgelehnt] = useState<string[]>([]);
  /*
    ★★★ DIE UHR DES SERVERS, nicht die des Geräts ({@link serverJetzt}).

    `startMs`/`endeMs` stehen am Server; ein Gerät, dessen Uhr fünf Sekunden
    vorgeht, sähe sonst einen Countdown von fünf statt zehn Sekunden und wäre
    fünf Sekunden zu früh fertig (Befund des Prüfers, 11.09.2026). Der Versatz
    wird ohne eine einzige zusätzliche Anfrage gemessen - aus der Antwort auf
    die eigene Stand-Zeile, die dieses Kind beim Beitreten ohnehin schreibt.
  */
  const [jetzt, setJetzt] = useState(() => serverJetzt());

  // Die abgelehnten Einladungen aus dem Gerät holen - einmal je Konto.
  useEffect(() => {
    setAbgelehnt(accountId ? leseAbgelehnt(accountId) : []);
    setMeinMatchId(null);
  }, [accountId]);

  // ── Die Klasse: hat die Lehrkraft das Match abgeschaltet? (F8) ────────────
  const klasse = useKlassenBeobachtung<TypingClass | null>(
    useMemo(
      () => ({
        aktiv: !!classCode,
        taktMs: MATCH_KLASSE_NACHFRAGE_MS,
        hole: () => typingBackend().getClass(classCode),
        beobachte: ({ einrechnen }) =>
          typingBackend().beobachteKlasse(classCode, (cls) => {
            if (cls.code === classCode) einrechnen(() => cls);
          }),
      }),
      [classCode],
    ),
  );

  /*
    ★ Ein NICHT geladener Klassen-Datensatz heisst „erlaubt", nicht „verboten".

    Das ist dieselbe Entscheidung wie bei `useKlassenRhythmus`: Ein Ladefehler
    nimmt einem Kind nie etwas weg. Wer kein Netz hat, kann ohnehin kein Match
    spielen - der Schalter führt dann ins Leere, und das ist harmloser, als
    einem Kind das Spiel wegzunehmen, weil eine Abfrage gerade scheiterte.
  */
  const erlaubtVonLehrkraft = klasse.daten?.klassenmatchAus !== true;

  // ── Die Matches der Klasse ────────────────────────────────────────────────
  const matchBeobachtung = useKlassenBeobachtung<Match[]>(
    useMemo(
      () => ({
        aktiv: !!classCode && erlaubtVonLehrkraft,
        taktMs: MATCH_NACHFRAGE_MS,
        hole: () => typingBackend().listeMatches(classCode),
        beobachte: ({ einrechnen }) =>
          typingBackend().beobachteMatches(classCode, (m) =>
            einrechnen((alt) => {
              const liste = alt ? [...alt] : [];
              const i = liste.findIndex((x) => x.id === m.id);
              if (i >= 0) liste[i] = m;
              else liste.push(m);
              return liste;
            }),
          ),
      }),
      [classCode, erlaubtVonLehrkraft],
    ),
  );
  const matches = useMemo(() => matchBeobachtung.daten ?? [], [matchBeobachtung.daten]);

  const meinMatch = useMemo(
    () => matches.find((m) => m.id === meinMatchId) ?? null,
    [matches, meinMatchId],
  );

  // ── Die Stände des EIGENEN Matches ────────────────────────────────────────
  /*
    ⚠️ Nur des eigenen. Die Stände aller offenen Matches der Klasse zu holen
    wäre die zweite Abfrage je Takt und je Kind - und niemand bräuchte sie:
    Über „darf ich eingeladen werden" (F9) entscheidet jedes Gerät für SICH,
    und dafür genügt sein eigenes Match.
  */
  const standBeobachtung = useKlassenBeobachtung<MatchStand[]>(
    useMemo(
      () => ({
        aktiv: !!meinMatchId,
        /*
          ★ Der Takt ist NICHT der Schreib-Takt (Entscheidung 11.09.2026): Die
          Zeilen der anderen kommen über das Realtime-Abo mit Filter `matchId`,
          und zwar die ZEILE selbst, nicht ein „da war was". Der Takt ist nur
          das Netz darunter - Begründung und Rechnung an
          {@link MATCH_STAND_NACHFRAGE_MS}.
        */
        taktMs: MATCH_STAND_NACHFRAGE_MS,
        hole: () => typingBackend().listeMatchStaende(meinMatchId ?? ""),
        beobachte: ({ einrechnen }) =>
          typingBackend().beobachteMatchStaende(meinMatchId ?? "", (s) =>
            einrechnen((alt) => {
              const liste = alt ? [...alt] : [];
              const i = liste.findIndex((x) => x.pupilUid === s.pupilUid);
              if (i >= 0) liste[i] = s;
              else liste.push(s);
              return liste;
            }),
          ),
      }),
      [meinMatchId],
    ),
  );
  /*
    ★★★ ZWEI LISTEN (02.10.2026): `alleZeilen` trägt auch die Zeilen auf
    `eingeladen`/`abgelehnt` - nur für die Zahl der Unentschiedenen. ALLES
    andere (Ranking, „3 dabei", Starten, die 30-Sekunden-Absage) liest
    `staende`, und dort steht nur, wer teilnimmt ({@link nimmtTeil}).
  */
  const alleZeilen = useMemo(() => standBeobachtung.daten ?? [], [standBeobachtung.daten]);
  const staende = useMemo(() => alleZeilen.filter(nimmtTeil), [alleZeilen]);

  // ── Die Uhr ───────────────────────────────────────────────────────────────
  // Sie tickt nur, solange überhaupt ein Match im Spiel ist - ein Takt, der
  // immer läuft, weckt jedes Gerät jede Sekunde für nichts.
  const relevant = !!meinMatchId || matches.some((m) => m.status === "einladung");
  useEffect(() => {
    if (!relevant) return;
    const t = window.setInterval(() => setJetzt(serverJetzt()), 500);
    return () => window.clearInterval(t);
  }, [relevant]);

  /*
    ★★★★ EIN IN DER EINLADUNG ABGESAGTES MATCH IST KEIN MATCH MEHR (11.09.2026
    spät, nachgestellt in `typing-klassenmatch-gleichzeitig.test.tsx` (d)).

    `matchPhaseVon` sagt für „abgebrochen" „fertig" - und die Seite zeigte
    darum einem Kind, das der Einladung beigetreten war, den `KlassenmatchLauf`
    mit `startMs = endeMs = 0`: Der ging sofort in die Platzierungsliste eines
    Spiels, das nie lief. Hier heisst es darum „keine", und zwar schon in DIESEM
    Rendern - ein Effekt allein käme einen Takt zu spät, und in diesem Takt
    schriebe der Lauf schon seine Null-Zeile.

    ⚠️ Nur ohne `startMs`: Ein Match, das schon lief, endet wie immer mit der
    Liste.
  */
  const abgesagtInEinladung =
    !!meinMatch && meinMatch.status === "abgebrochen" && !(meinMatch.startMs > 0);
  const phase: MatchPhase = abgesagtInEinladung ? "keine" : matchPhaseVon(meinMatch, jetzt);

  /*
    Bin ich gebunden? Gerechnet mit derselben Funktion, die auch die Einladung
    prüft - aus meinem Match und meinen Ständen. Ein fertiges Match bindet
    nicht mehr (siehe `gebundeneKinder`), ein abgesagtes auch nicht.
  */
  const binGebunden = useMemo(
    () => (meinMatch ? gebundeneKinder([meinMatch], staende, jetzt).has(accountId) : false),
    [meinMatch, staende, jetzt, accountId],
  );

  /*
    ★★★★★ AUF DER RANGLISTE IST EIN KIND FREI (02.10.2026, Klasse CSS6).

    Das Match war um 10:17:20 vorbei, um 10:18 kam die nächste Einladung - und
    die Kinder, die noch vor der Platzierungsliste sassen, bekamen sie nicht:
    `meinMatchId` stand ja noch (losgelassen wird erst bei „Weiter üben").
    Johannes: *„Ist das Match vorbei, ist das Kind frei, auch wenn die
    Rangliste noch steht."*

    ⚠️ „Vorbei" heisst hier: Die eigene letzte Zeile ist geschrieben
    (`fertig`) - oder das Ende liegt schon drei Sekunden zurück. Die Uhr allein
    reicht nicht: In der Sekunde nach dem Ende schreibt der Lauf noch seine
    angefangene Zeile fertig, und ein „Bin dabei" genau dann hängte ihn aus,
    bevor seine letzte Zeile beim Server ist.
  */
  const eigeneZeileFertig = staende.some((s) => s.pupilUid === accountId && s.status === "fertig");
  const aufRangliste =
    !!meinMatchId &&
    !!meinMatch &&
    !abgesagtInEinladung &&
    phase === "fertig" &&
    (eigeneZeileFertig || jetzt >= (meinMatch.endeMs || 0) + 3_000);
  /** Frei für eine neue Einladung oder ein eigenes Match. */
  const frei = !meinMatchId || aufRangliste;
  const freiRef = useRef(frei);
  freiRef.current = frei;

  /**
   * Die Einladung, die dieses Kind sehen soll (F2/F9): ein offenes Match in der
   * Phase „einladung", von jemand anderem, nicht abgelehnt - und nur, wenn
   * dieses Kind nicht schon in einem Match steckt.
   *
   * ★★★ Bei zwei offenen Einladungen gewinnt die ÄLTERE ({@link
   * offeneEinladungen}, geordnet mit {@link ausschreibungsOrdnung}). Bis zum
   * 11.09.2026 abends war es die jüngere („wer eben gefragt hat, wartet
   * gerade") - und genau das verteilte eine Klasse, in der zwei Kinder
   * gleichzeitig ausschrieben, auf zwei Wartefenster. Johannes: *„schau wer der
   * erste ist"*.
   */
  /**
   * ★ Eine abgelehnte Einladung, die das Kind AUSDRÜCKLICH wieder hervorgeholt
   * hat (Alt + M oder der Schalter, solange sie offen ist) - siehe `einladen`.
   * „Jetzt nicht" und „Bin dabei" nehmen die Marke wieder weg.
   */
  const [wiederGezeigt, setWiederGezeigt] = useState<string | null>(null);
  const einladung = useMemo(() => {
    if (!erlaubtVonLehrkraft || binGebunden || !frei) return null;
    const ausser = wiederGezeigt ? abgelehnt.filter((id) => id !== wiederGezeigt) : abgelehnt;
    return offeneEinladungen(matches, jetzt, accountId, ausser)[0] ?? null;
  }, [
    matches,
    jetzt,
    accountId,
    abgelehnt,
    wiederGezeigt,
    erlaubtVonLehrkraft,
    binGebunden,
    frei,
  ]);

  /** Der Satz vor einer Einladung - siehe {@link KlassenmatchStand.einladungVorsatz}. */
  const [vorsatz, setVorsatz] = useState<{ matchId: string; satz: string } | null>(null);
  const einladungVorsatz =
    vorsatz && einladung && vorsatz.matchId === einladung.id ? vorsatz.satz : "";

  /**
   * Darf dieses Kind ein Match ausschreiben? (F1)
   *
   * Nicht, wenn es in einem steckt. ⚠️ Bis 15.09.2026 kam eine zweite Grenze
   * dazu - höchstens zwei offene Matches je Klasse (F9). Johannes wollte keine
   * feste Zahl mehr: *„ich möchte dass mehr wie 2 match parallel laufen
   * können"*. Die Grenze ist ganz weg, client- UND serverseitig
   * (`tt_match.pb.js`) - übrig bleibt nur noch, ob DIESES Kind selbst gebunden
   * ist und ob die Lehrkraft das Match abgeschaltet hat (F8).
   */
  const erlaubt = istKlassenkind && erlaubtVonLehrkraft && !binGebunden && frei;

  /**
   * ★★★ WARUM GERADE NICHT? (§2.6 „läuft gerade", Entscheidung 11.09.2026)
   *
   * Leer heisst „kein Grund" - dann lädt der Schalter ein. Steht hier ein Satz,
   * bleibt der Schalter trotzdem stehen und trägt IHN als Beschriftung
   * ({@link StandZeile}); Alt + M spricht ihn aus. Ein Schalter, der ohne Grund
   * verschwindet, und ein Kürzel, das stillschweigend nichts tut, sind
   * dasselbe Versäumnis (R-A3).
   *
   * ⚠️ NICHT gesagt wird, dass die Lehrkraft das Match abgeschaltet hat oder
   * dass dieses Kind keiner Klasse angehört: Dann gibt es den Schalter gar
   * nicht, und das ist richtig so - beides sind Entscheidungen, die das Kind
   * weder trifft noch ändern kann (Begründung in `StandZeile.tsx`).
   */
  // ★ EN5: die Beschriftung in der Bedienungssprache - `matchHinweisSatz`
  // kennt beide Fassungen, die Stand-Zeile zeigt sie unverändert.
  const hinweis =
    !istKlassenkind || !erlaubtVonLehrkraft
      ? ""
      : binGebunden || !frei
        ? matchHinweisLaeuft(bedien.sprache)
        : "";

  const binGastgeber = !!meinMatch && meinMatch.hostUid === accountId;
  const kannStarten =
    binGastgeber &&
    phase === "einladung" &&
    staende.some((s) => s.pupilUid !== accountId && s.status !== "fertig");
  /** Siehe {@link KlassenmatchStand.unentschieden}. */
  const unentschieden = binGastgeber ? unentschiedenZahl(alleZeilen, accountId) : 0;

  /*
    ★★★ DIE ENTSCHEIDUNGEN GEHEN NACHEINANDER RAUS (02.10.2026).

    `eingeladen`, `dabei` und `abgelehnt` schreiben dieselbe Zeile. Drückt ein
    Kind „Bin dabei", während das `eingeladen` noch unterwegs ist, könnten sich
    die beiden am Server überholen - und die Zeile stünde am Ende wieder auf
    `eingeladen`, obwohl das Kind längst im Wartefenster sitzt. Darum hängt
    jede dieser Meldungen hinter der vorigen.
  */
  const kette = useRef<Promise<unknown>>(Promise.resolve());
  const nacheinander = useCallback(<T,>(tun: () => Promise<T>): Promise<T> => {
    const p = kette.current.then(tun, tun);
    kette.current = p.catch(() => {});
    return p;
  }, []);

  // ── Handlungen ────────────────────────────────────────────────────────────

  /** Die eigene Zeile anlegen, sobald ein Match feststeht („ich bin dabei"). */
  const meldeDabei = useCallback(
    (matchId: string) => {
      if (!account) return;
      void nacheinander(() =>
        typingBackend().schreibeMatchStand(account, matchId, {
          status: "dabei",
          zeichen: 0,
          fehler: 0,
          apm: 0,
          wert: 0,
        }),
      ).catch(() => {
        // Nicht gemeldet heisst: Der Gastgeber sieht dieses Kind (noch) nicht.
        // Der nächste Takt schreibt die Zeile.
      });
    },
    [account, nacheinander],
  );

  const [meldung, setMeldung] = useState("");
  const meldungLoeschen = useCallback(() => setMeldung(""), []);
  /**
   * ★★★★★ KEIN ZWEITES ANLEGEN, SOLANGE DAS ERSTE NOCH UNTERWEGS IST
   * (15.09.2026, Befund: Sebastian bekam „Tester lädt dich ein" zehnmal für
   * dasselbe Vorhaben).
   *
   * Alt + M hängt an `keydown` - hält ein Kind die Taste zu lang oder drückt
   * sie mehrmals schnell hintereinander, feuert JEDER Tastendruck erneut,
   * BEVOR der Server auf den ersten geantwortet und `meinMatchId` gesetzt hat
   * (das React-Rendern, das `erlaubt` neu berechnet, kommt erst danach). Ohne
   * Riegel legte jeder dieser Tastendrücke ein EIGENES `tt_matches` an - für
   * die Klasse zehn Einladungen desselben Kindes statt einer. Der Riegel ist
   * ein Ref, kein State: Er darf nicht auf den nächsten Render warten, er muss
   * schon beim zweiten Tastendruck IM SELBEN Wimpernschlag greifen.
   */
  const erstellenLaeuft = useRef(false);
  /** Ein Match anlegen - ohne Rückfrage (die steht in `einladen`). */
  const erstelle = useCallback(() => {
    if (!account || erstellenLaeuft.current) return;
    setMeldung("");
    erstellenLaeuft.current = true;
    void typingBackend()
      .erstelleMatch(account)
      .then((m) => {
        if (!m) {
          sagWarumNicht("");
          return;
        }
        setMeinMatchId(m.id);
        zuletztGeschrieben.current = { ms: 0, roh: "" };
        meldeDabei(m.id);
        matchBeobachtung.jetztNachfragen();
      })
      .catch((err: unknown) => {
        // Der Server hat abgewiesen (Lehrkraft hat abgeschaltet, dieses Kind
        // steckt schon in einem Match, oder er ist kaputt) - der Grund kommt
        // als Satz mit, sonst ein eigener.
        sagWarumNicht(err instanceof Error ? err.message : "");
      })
      .finally(() => {
        erstellenLaeuft.current = false;
      });
    function sagWarumNicht(grund: string) {
      const sprache = bedienRef.current.sprache;
      const t = MATCH_MELDUNGEN[sprache];
      const satz = grund.trim()
        ? t.nichtAusgeschrieben(serverMeldung(grund.trim(), sprache).text)
        : t.nichtAusgeschriebenOhneGrund;
      setMeldung(satz);
      sag(satz);
    }
  }, [account, meldeDabei, matchBeobachtung, sag]);

  /**
   * ★★★ Die Einladung, zu der gerade gefragt wird „Mitmachen oder selbst
   * einladen?" - als Kennung gemerkt, als Match gerechnet: Sagt die
   * Gastgeberin ab, während die Frage steht, verschwindet die Frage mit.
   */
  const [rueckfrageId, setRueckfrageId] = useState<string | null>(null);
  const rueckfrage = useMemo(() => {
    if (!rueckfrageId || !erlaubt) return null;
    return offeneEinladungen(matches, jetzt, accountId, []).find((m) => m.id === rueckfrageId) ?? null;
  }, [rueckfrageId, erlaubt, matches, jetzt, accountId]);

  const einladen = useCallback(() => {
    if (!account || !erlaubt || erstellenLaeuft.current) return;
    /*
      ★★★★ STEHT EINE FREMDE EINLADUNG OFFEN, WIRD ZUERST GEFRAGT (02.10.2026,
      ersetzt die Regel vom 11.09.2026 „kein zweites Match, solange jemand
      einlädt", nachgestellt in `typing-klassenmatch-start-rueckfrage.test.tsx`).

      Johannes: *„Arne lädt gerade ein. Mitmachen oder selbst einladen?"* -
      zwei Knöpfe. Gefragt wird auch, wenn das Kind diese Einladung schon
      abgelehnt hat: Ein ausdrückliches „Klassenmatch" ist eine neue Frage des
      Kindes. Die Älteste zuerst - um sie sammelt sich die Klasse.
      Läuft das erste Match schon (Countdown oder Lauf), gibt es keine offene
      Einladung mehr, und ein zweites entsteht ohne Frage.
    */
    const offen = offeneEinladungen(matches, jetzt, accountId, [])[0];
    if (offen) {
      setRueckfrageId(offen.id);
      return;
    }
    erstelle();
  }, [account, erlaubt, matches, jetzt, accountId, erstelle]);

  const meinMatchIdRef = useRef(meinMatchId);
  meinMatchIdRef.current = meinMatchId;
  const beitreten = useCallback(
    (matchId: string) => {
      if (!account) return;
      /*
        ★★★★★ EIN KIND, EIN MATCH - im Gerät (02.10.2026). Wer in einem
        offenen Match steckt, tritt keinem zweiten bei. ⚠️ Das Gerät weiss das
        nur, solange `meinMatchId` steht - nach einem Neuladen nicht mehr.
        Das eigentliche Netz ist darum der Server (`standSperre` in
        `tt_match_lib.pb.js`), und sein Satz kommt unten an.
      */
      if (!freiRef.current) return;
      setVorsatz(null);
      setWiederGezeigt(null);
      setRueckfrageId(null);
      setMeinMatchId(matchId);
      zuletztGeschrieben.current = { ms: 0, roh: "" };
      eingeladenGemeldet.current.add(matchId);
      void nacheinander(() =>
        typingBackend().schreibeMatchStand(
          account,
          matchId,
          { status: "dabei", zeichen: 0, fehler: 0, apm: 0, wert: 0 },
          { fehlerMelden: true },
        ),
      ).catch((err: unknown) => {
        /*
          ★★★★ NIE STILL VERSCHLUCKEN: Hat der Server mit einem eigenen Satz
          abgewiesen („Du bist schon in einem anderen Klassenmatch dabei. …"),
          sitzt das Kind sonst in einem Wartefenster, in dem es gar nicht
          steht. Es wird losgelassen, der Satz steht am Bildschirm und wird
          gesprochen. Ohne Satz (kein Netz) bleibt es wie bisher: Der Gastgeber
          sieht das Kind erst, wenn eine spätere Meldung durchkommt.
        */
        const grund = err instanceof Error ? err.message.trim() : "";
        if (!grund || meinMatchIdRef.current !== matchId) return;
        setMeinMatchId(null);
        const satz = serverMeldung(grund, bedienRef.current.sprache).text;
        setMeldung(satz);
        sag(satz);
      });
    },
    [account, nacheinander, sag],
  );

  /**
   * Bei welchen Matches hat dieses Gerät schon `eingeladen` (oder eine
   * Entscheidung) gemeldet? Ein Fenster, das neu aufgeht (Escape aus der
   * Rückfrage, Neurendern), schreibt nicht ein zweites Mal - und überschreibt
   * nie eine Entscheidung, die schon gefallen ist.
   */
  const eingeladenGemeldet = useRef(new Set<string>());
  const einladungGezeigt = useCallback(
    (matchId: string) => {
      if (!account || eingeladenGemeldet.current.has(matchId)) return;
      eingeladenGemeldet.current.add(matchId);
      void nacheinander(() =>
        typingBackend().schreibeMatchStand(account, matchId, {
          status: "eingeladen",
          zeichen: 0,
          fehler: 0,
          apm: 0,
          wert: 0,
        }),
      ).catch(() => {
        // Nicht gemeldet heisst nur: Die Gastgeberin zählt dieses Kind nicht
        // zu denen, die noch überlegen. Sie fragt dann eben nicht nach.
      });
    },
    [account, nacheinander],
  );

  const ablehnen = useCallback(
    (matchId: string) => {
      setVorsatz(null);
      setWiederGezeigt(null);
      setAbgelehnt((alt) => {
        if (alt.includes(matchId)) return alt;
        const neu = [...alt, matchId];
        if (accountId) schreibeAbgelehnt(accountId, neu);
        return neu;
      });
      /*
        ★★★ Die Absage geht seit 02.10.2026 auch an den Server (`abgelehnt`) -
        nur so zählt die Gastgeberin dieses Kind nicht mehr zu denen, die
        noch überlegen. Gemerkt bleibt sie zusätzlich im Gerät (siehe
        `leseAbgelehnt`), damit dieselbe Einladung nach dem Neuladen nicht
        wieder aufgeht.
      */
      if (!account) return;
      eingeladenGemeldet.current.add(matchId);
      void nacheinander(() =>
        typingBackend().schreibeMatchStand(account, matchId, {
          status: "abgelehnt",
          zeichen: 0,
          fehler: 0,
          apm: 0,
          wert: 0,
        }),
      ).catch(() => {});
    },
    [account, accountId, nacheinander],
  );

  const rueckfrageMitmachen = useCallback(() => {
    const m = rueckfrage;
    setRueckfrageId(null);
    if (m) beitreten(m.id);
  }, [rueckfrage, beitreten]);

  const rueckfrageSelbst = useCallback(() => {
    setRueckfrageId(null);
    if (!erlaubt) return;
    /*
      ★ ALLE offenen fremden Einladungen gelten damit als abgelehnt - sonst
      sagte Absatz (a) unten das eigene, spätere Match sofort wieder ab
      („wer zuerst da war, gewinnt"). Wer selbst einlädt, hat sich gegen die
      früheren entschieden.
    */
    for (const m of offeneEinladungen(matches, jetzt, accountId, [])) ablehnen(m.id);
    erstelle();
  }, [erlaubt, matches, jetzt, accountId, ablehnen, erstelle]);

  const rueckfrageSchliessen = useCallback(() => setRueckfrageId(null), []);

  const starten = useCallback(() => {
    if (!meinMatchId || !kannStarten) return;
    void typingBackend()
      .aktualisiereMatch(meinMatchId, "countdown")
      .then(() => matchBeobachtung.jetztNachfragen())
      .catch(() => {});
  }, [meinMatchId, kannStarten, matchBeobachtung]);

  const absagen = useCallback(() => {
    if (!meinMatchId) return;
    const id = meinMatchId;
    // ⚠️ ZUERST loslassen, dann melden: Scheitert das Schreiben (kein Netz),
    // steht das Kind sonst vor einer Lobby, die es nicht mehr verlassen kann.
    setMeinMatchId(null);
    void typingBackend()
      .aktualisiereMatch(id, "abgebrochen")
      .then(() => matchBeobachtung.jetztNachfragen())
      .catch(() => {});
  }, [meinMatchId, matchBeobachtung]);

  /*
    ★★★ DER TAKT (§2.6): alle drei Sekunden, und NUR bei Änderung.

    Der Lauf ruft `standMelden` nach jeder fertigen Zeile - das kann bei einem
    schnellen Kind öfter als alle drei Sekunden sein. Hier wird gedrosselt und
    gegen die zuletzt geschriebene Zahl verglichen: Wer eine Zeile lang
    nachdenkt, schreibt nichts, und 30 Kinder, die nachdenken, erzeugen keine
    Last.
  */
  const zuletztGeschrieben = useRef({ ms: 0, roh: "" });
  const standMelden = useCallback(
    (
      werte: Pick<MatchStand, "zeichen" | "fehler" | "apm" | "wert" | "wartezeitMs">,
      status: MatchStandStatus = "schreibt",
    ) => {
      if (!account || !meinMatchId) return;
      const roh = `${status}|${werte.zeichen}|${werte.fehler}|${Math.round(werte.apm)}`;
      const jetztMs = Date.now();
      if (roh === zuletztGeschrieben.current.roh) return;
      if (jetztMs - zuletztGeschrieben.current.ms < MATCH_TAKT_MS) return;
      zuletztGeschrieben.current = { ms: jetztMs, roh };
      void typingBackend()
        .schreibeMatchStand(account, meinMatchId, { status, ...werte })
        .catch(() => {
          // Eine verlorene Meldung heisst: Die Kugel der anderen steht drei
          // Sekunden länger still. Sie darf den Lauf nicht anhalten.
        });
    },
    [account, meinMatchId],
  );

  /**
   * ★★★ FERTIG (F13). Die Zeit läuft am Server nicht - wer als erster merkt,
   * dass `endeMs` vorbei ist, schliesst das Match. Beim Gastgeber gelingt das
   * (die updateRule lässt nur ihn), bei allen anderen scheitert es still, und
   * das ist richtig so: Der Cron des Hooks holt es spätestens in einer Minute
   * nach, und für die Anzeige rechnet ohnehin jeder Client selbst.
   */
  const fertigMelden = useCallback(
    (werte: Pick<MatchStand, "zeichen" | "fehler" | "apm" | "wert" | "wartezeitMs">) => {
      if (!account || !meinMatchId) return;
      // Die letzte Zeile geht OHNE Drossel raus - sie ist die, die zählt.
      zuletztGeschrieben.current = { ms: Date.now(), roh: `fertig|${werte.zeichen}` };
      void typingBackend()
        .schreibeMatchStand(account, meinMatchId, { status: "fertig", ...werte })
        .catch(() => {});
      /*
        ★ NUR DER GASTGEBER schickt den Abschluss (02.10.2026). Die updateRule
        lässt ohnehin nur ihn - bei allen anderen endete der Versuch mit 404 im
        Serverprotokoll, ein Eintrag je Kind und Match, für nichts. Das Netz
        für eine geschlossene Gastgeber-Seite bleibt der Cron.
      */
      if (
        meinMatch &&
        meinMatch.hostUid === accountId &&
        meinMatch.status !== "fertig" &&
        meinMatch.status !== "abgebrochen"
      ) {
        void typingBackend().aktualisiereMatch(meinMatchId, "fertig").catch(() => {});
      }
    },
    [account, accountId, meinMatchId, meinMatch],
  );

  const verlassen = useCallback(() => {
    setMeinMatchId(null);
    zuletztGeschrieben.current = { ms: 0, roh: "" };
  }, []);

  const aussteigen = useCallback(() => {
    const id = meinMatchId;
    // ⚠️ ZUERST loslassen, dann melden - wie beim Absagen: Scheitert das
    // Schreiben, steht das Kind sonst vor einem Fenster, aus dem es nicht
    // mehr hinauskommt.
    setMeinMatchId(null);
    zuletztGeschrieben.current = { ms: 0, roh: "" };
    if (!account || !id) return;
    void typingBackend()
      .schreibeMatchStand(account, id, {
        status: "fertig",
        zeichen: 0,
        fehler: 0,
        apm: 0,
        wert: 0,
      })
      .catch(() => {});
  }, [account, meinMatchId]);

  const mittendrinVerlassen = useCallback(
    (werte: Pick<MatchStand, "zeichen" | "fehler" | "apm" | "wert" | "wartezeitMs">) => {
      const id = meinMatchId;
      // ⚠️ ZUERST loslassen, dann melden - wie beim Aussteigen.
      setMeinMatchId(null);
      zuletztGeschrieben.current = { ms: 0, roh: "" };
      if (!account || !id) return;
      /*
        ★ KEIN `aktualisiereMatch`, auch nicht beim Gastgeber: „fertig" hiesse
        für alle anderen „vorbei", und „abgebrochen" nähme ihnen das Spiel. Die
        anderen kommen trotzdem zu ihrer Liste - jedes Gerät rechnet das Ende
        aus `endeMs` selbst, ihr `fertigMelden` versucht den Abschluss, und der
        Cron des Hooks schliesst das Match spätestens eine Minute danach.
      */
      void typingBackend()
        .schreibeMatchStand(account, id, { status: "fertig", ...werte })
        .catch(() => {});
    },
    [account, meinMatchId],
  );

  // ── Zwei schreiben gleichzeitig aus, und was daraus folgt (11.09.2026 spät) ─

  /*
    ★★★★★ (a) WER ZUERST DA WAR, GEWINNT. Johannes: *„schau wer der erste ist
    und wechsel das zweite ausschreibungsfenster automatisch in ein
    anfragefenster"*.

    Steht dieses Kind als Gastgeber im eigenen Wartefenster, und gibt es eine
    fremde, nicht abgelehnte Einladung, die FRÜHER kam ({@link
    ausschreibungsOrdnung}), sagt es sein Match selbst ab - genau wie
    „Absagen" - und sieht im selben Zug das Fenster der früheren Einladung.
    Jedes Gerät rechnet dieselbe Ordnung, also sagt genau eines ab.

    ⚠️ Auch eine ABGELEHNTE frühere Einladung zählt (Entscheidung Johannes,
    11.09.2026 abends: ein zweites Match erst, wenn das erste läuft) - dann
    geht ihr Fenster ausdrücklich wieder auf. Praktisch kommt das kaum vor:
    Ablehnen kann nur, wer die Einladung schon gesehen hat, und wer sie sieht,
    kann seit (b) nicht mehr ausschreiben. Kinder, die dem abgesagten Match
    schon beigetreten waren, fängt (d) auf IHREM Gerät auf.
  */
  const fruehereEinladung = useMemo(() => {
    if (!meinMatch || meinMatch.hostUid !== accountId || meinMatch.status !== "einladung") {
      return null;
    }
    /*
      ⚠️ Seit 02.10.2026 zählen ABGELEHNTE frühere Einladungen hier nicht mehr:
      Wer über „Selbst einladen" ein eigenes Match anlegt, hat die frühere
      ausdrücklich abgelehnt (`rueckfrageSelbst`) - sie darf sein Match nicht
      gleich wieder absagen. Zwei Kinder, die im selben Augenblick ausschreiben,
      haben einander nie abgelehnt; für sie gilt die Regel wie bisher.
    */
    return (
      offeneEinladungen(matches, jetzt, accountId, abgelehnt).find(
        (m) => ausschreibungsOrdnung(m, meinMatch) < 0,
      ) ?? null
    );
  }, [meinMatch, matches, jetzt, accountId, abgelehnt]);
  useEffect(() => {
    if (!fruehereEinladung) return;
    const t = MATCH_MELDUNGEN[bedienRef.current.sprache];
    setVorsatz({
      matchId: fruehereEinladung.id,
      satz: t.schonEingeladen(nameOder(fruehereEinladung.hostName, t.anderesKind)),
    });
    setWiederGezeigt(fruehereEinladung.id);
    absagen();
  }, [fruehereEinladung, absagen]);

  /*
    ★★★★★ (d) WER EINEM MATCH BEIGETRETEN WAR, DAS IN DER EINLADUNG ABGESAGT
    WURDE, wird losgelassen und bekommt EINEN Satz.

    Wartet schon eine andere Einladung (typisch nach (a): die frühere), geht
    der Satz ins Einladungsfenster und wird dort mitgesprochen - eine Stimme,
    nicht zwei. Sonst steht er als Meldung über dem Feld und wird über
    `speakUi` gesprochen (neben einem Live-Bereich immer `speakUi`, nie
    `speakUiAlways`). Das Kind wartete gerade, es tippte nicht.
  */
  useEffect(() => {
    if (!abgesagtInEinladung || !meinMatch) return;
    const host = meinMatch.hostName.trim();
    const t = MATCH_MELDUNGEN[bedienRef.current.sprache];
    const satz =
      meinMatch.hostUid === accountId
        ? t.deinsAbgesagt
        : host
          ? t.hostHatAbgesagt(host)
          : t.abgesagt;
    setMeinMatchId(null);
    zuletztGeschrieben.current = { ms: 0, roh: "" };
    const naechste = offeneEinladungen(matches, jetzt, accountId, abgelehnt).find(
      (m) => m.id !== meinMatch.id,
    );
    if (naechste) {
      setVorsatz({ matchId: naechste.id, satz });
    } else {
      setMeldung(satz);
      sag(satz);
    }
  }, [abgesagtInEinladung, meinMatch, matches, jetzt, accountId, abgelehnt, sag]);

  /*
    ★★★ (e) EIN MATCH, DAS AUS DER LISTE VERSCHWUNDEN IST (nachgestellt in
    `typing-klassenmatch-gleichzeitig.test.tsx` (e)).

    Der Hook räumt eine Stunde nach dem Anlegen auf (F10). Wer so lange vor der
    Platzierungsliste sitzen blieb, hing danach fest: `meinMatchId` gesetzt,
    das Match nirgends - der Schalter sagte für immer „läuft gerade", und
    Alt + M tat nichts mehr.

    ⚠️ Losgelassen wird NUR, wenn das Match beim letzten Sehen schon VORBEI
    war. Ein Netzfehler kommt hier seit 11.09.2026 spät gar nicht mehr an
    (`pbBackend.listeMatches` wirft, der Haken hält den Stand). Aber auch eine
    ERFOLGREICHE Antwort ohne das Match ist mitten im Lauf kein Beweis, dass es
    vorbei ist - etwa wenn die Lehrkraft das Match gerade abschaltet und die
    Liste darum leer wird. Wer dann losliesse, nähme dem Kind das Spiel für
    immer; kommt die Liste zurück, steht das Match wieder da.
  */
  const zuletztGesehen = useRef<Match | null>(null);
  useEffect(() => {
    if (meinMatch) zuletztGesehen.current = meinMatch;
  }, [meinMatch]);
  useEffect(() => {
    if (!meinMatchId || meinMatch) return;
    const gesehen = zuletztGesehen.current;
    if (!gesehen || gesehen.id !== meinMatchId) return;
    if (matchOffen(gesehen, jetzt)) return;
    setMeinMatchId(null);
    zuletztGeschrieben.current = { ms: 0, roh: "" };
  }, [meinMatchId, meinMatch, jetzt]);

  /*
    ★★★★★ (f) ALLEIN NACH 30 SEKUNDEN: DIE EINLADUNG SAGT SICH SELBST AB
    (15.09.2026).

    Johannes: *„wenn jemand ein match starten möchte und alle lehnen ab soll
    das nicht im Hintergrund weiterlaufen sondern beendet werden"* und
    *„matchanfragen die nicht beantwortet werden sollen einfach verschwinden,
    wenn gar niemand was macht nach 30 sec"*.

    Geprüft wird auf DIESEM Gerät - der Gastgeberin oder dem Gastgeber: Nur
    sie haben ihre eigene Stand-Zeile ohnehin schon geschrieben (`meldeDabei`
    in `einladen`), also genügt ihr eigener Ständestand, um zu wissen, ob
    schon jemand gefolgt ist. Steht ausser ihr niemand in den Ständen, und ist
    seit dem Anlegen {@link MATCH_EINLADUNG_FRIST_MS} vergangen, sagt dieses
    Gerät selbst ab - über denselben Weg wie der Knopf „Absagen"
    (`absagen`). Kein Warten auf den minütlichen Server-Cron nötig: Der bleibt
    nur das Netz für den Fall, dass die Seite inzwischen geschlossen wurde
    (`tt_match.pb.js`).

    ⚠️ Nicht mehr, sobald „Starten" gedrückt wurde (Phase ungleich
    „einladung") - ein laufendes Match wird davon nie berührt.
  */
  useEffect(() => {
    if (!binGastgeber || !meinMatch || phase !== "einladung") return;
    // ★ 02.10.2026: Nur wer WARTET zählt - ein Kind, das „Doch nicht" gedrückt
    // hat (`fertig`), ist nicht gefolgt. Dieselbe Regel wie der Cron am Server.
    if (staende.some((s) => s.pupilUid !== accountId && s.status !== "fertig")) return;
    if (jetzt - meinMatch.createdMs < MATCH_EINLADUNG_FRIST_MS) return;
    absagen();
    const satz = MATCH_MELDUNGEN[bedienRef.current.sprache].niemandBeigetreten;
    setMeldung(satz);
    sag(satz);
  }, [binGastgeber, meinMatch, phase, staende, accountId, jetzt, absagen, sag]);

  return {
    erlaubt,
    hinweis,
    geladen: klasse.geladen,
    meldung,
    meldungLoeschen,
    einladung,
    einladungVorsatz,
    // Ein in der Einladung abgesagtes Match ist schon in diesem Rendern keins
    // mehr - siehe `abgesagtInEinladung`.
    meinMatch: abgesagtInEinladung ? null : meinMatch,
    phase,
    binGastgeber,
    staende,
    kannStarten,
    unentschieden,
    einladungGezeigt,
    rueckfrage,
    rueckfrageMitmachen,
    rueckfrageSelbst,
    rueckfrageSchliessen,
    aufRangliste,
    einladen,
    beitreten,
    ablehnen,
    starten,
    absagen,
    standMelden,
    fertigMelden,
    verlassen,
    mittendrinVerlassen,
    aussteigen,
  };
}
