import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import { Modal } from "@/components/Modal";
import { Icon } from "@/components/Icon";
import {
  lwMessages,
  LW_MESSAGES_CHANGED,
  type LwConversation,
} from "@/lib/lernwerkstatt/messages";
import { LwMessageThread } from "./LwMessageThread";
import { mehrzahl, texte, useBedienSprache } from "@/lib/bedienSprache";

/**
 * Glocken-Symbol für die LERNWERKSTATT — app-übergreifend (Tastenflow,
 * Braille …). Zeigt ungelesene Nachrichten zwischen Lehrkraft und Kind; ein
 * Der Posteingang öffnet sich. Da die Konten von Lehrkraft und Lernenden geteilt sind, bedient
 * EINE Komponente alle Apps; sie liest die Sitzung direkt aus dem gemeinsamen
 * PocketBase-authStore. Memory: project_lernwerkstatt_unified.
 *
 *  • Kind: ein Gespräch mit der eigenen Lehrkraft — lesen + antworten, und auch
 *    selbst beginnen.
 *  • Lehrkraft: Posteingang je Kind (Antworten der Kinder); Gespräche STARTEN
 *    tut die Lehrkraft aus der Klassen-Übersicht.
 *
 * `accountId` triggert ein Neuladen bei An-/Abmeldung. Fehler lassen die Glocke
 * leer, brechen aber nie die Kopfzeile.
 */
const REFRESH_MS = 60 * 1000;

/**
 * ★ EN6b (19.09.2026): die Texte der Glocke und des Fensters „Meine
 * Nachrichten" in beiden Bedienungssprachen. GEMEINSAMER TEIL - die Sprache
 * kommt aus dem Anbieter, der nur auf den Adressen von Tastenflow aktiv ist;
 * die anderen Programme bekommen „de" und damit Zeichen für Zeichen die
 * Glocke von vorher. Glossar §3.9: Nachrichten ⇒ *Messages* ★, Posteingang ⇒
 * *inbox*; §3.8: Kind (Lehrkraft-Sicht) ⇒ *pupil*.
 */
const T = texte({
  de: {
    neue: (n: number) => (n === 1 ? "1 neue Nachricht" : `${n} neue Nachrichten`),
    knopfNeu: (n: number) => `Nachrichten: ${n} neu`,
    knopf: "Nachrichten",
    mitLehrkraft: "Nachrichten mit deiner Lehrkraft",
    mitKind: (name: string) => `Nachrichten mit ${name}`,
    meine: "Meine Nachrichten",
    zurUebersicht: "← Zur Übersicht",
    keine: 'Noch keine Nachrichten. Schreibe einem Kind aus dem Bereich „Meine Klassen".',
    // ⚠️ Mit dem Punkt davor in EINEM Eintrag: vorher „· Klasse " als EIN
    // Textknoten vor dem Code - so bleibt es (Probestück, `Teil`).
    klassePunkt: "· Klasse ",
    du: "Du: ",
  },
  en: {
    neue: (n: number) =>
      mehrzahl(n, "en", { one: (z) => `${z} new message`, other: (z) => `${z} new messages` }),
    knopfNeu: (n: number) => `Messages: ${n} new`,
    knopf: "Messages",
    mitLehrkraft: "Messages with your teacher",
    mitKind: (name: string) => `Messages with ${name}`,
    meine: "My messages",
    zurUebersicht: "← Back to inbox",
    keine: "No messages yet. You can write to a pupil from “My classes”.",
    klassePunkt: "· Class ",
    du: "You: ",
  },
  // ★ E11a: „tu" für Zeilen, die sich an die lernende Person richten
  // (mitLehrkraft, du); „vous" für die Leerzeile, die eine Lehrkraft-Handlung
  // beschreibt (F9).
  fr: {
    neue: (n: number) => (n === 1 ? "1 nouveau message" : `${n} nouveaux messages`),
    knopfNeu: (n: number) => `Messages : ${n} nouveaux`,
    knopf: "Messages",
    mitLehrkraft: "Messages avec ton enseignant ou ton enseignante",
    mitKind: (name: string) => `Messages avec ${name}`,
    meine: "Mes messages",
    zurUebersicht: "← Retour à la liste",
    keine: 'Pas encore de messages. Écrivez à un élève depuis "Mes classes".',
    klassePunkt: "- Classe ",
    du: "Vous : ",
  },
  // ★ ES-O (27.09.2026): tú für das Kind (mitLehrkraft), usted für die
  // Leerzeile der Lehrkraft (keine); „Tú: " vor der eigenen Nachricht, wie in
  // spanischen Chat-Programmen üblich.
  es: {
    neue: (n: number) =>
      mehrzahl(n, "es", { one: (z) => `${z} mensaje nuevo`, other: (z) => `${z} mensajes nuevos` }),
    knopfNeu: (n: number) => `Mensajes: ${n} ${n === 1 ? "nuevo" : "nuevos"}`,
    knopf: "Mensajes",
    mitLehrkraft: "Mensajes con tu docente",
    mitKind: (name: string) => `Mensajes con ${name}`,
    meine: "Mis mensajes",
    zurUebersicht: "← Volver a la lista",
    keine: 'Todavía no hay mensajes. Puede escribir a cualquier estudiante desde "Mis clases".',
    klassePunkt: "- Clase ",
    du: "Tú: ",
  },
  // ★ O-IT (02.10.2026): „l'insegnante", nie „il tuo/la tua insegnante" (Regel 2).
  it: {
    neue: (n: number) =>
      mehrzahl(n, "it", { one: (z) => `${z} nuovo messaggio`, other: (z) => `${z} nuovi messaggi` }),
    knopfNeu: (n: number) => `Messaggi: ${n} ${n === 1 ? "nuovo" : "nuovi"}`,
    knopf: "Messaggi",
    mitLehrkraft: "Messaggi con l'insegnante",
    mitKind: (name: string) => `Messaggi con ${name}`,
    meine: "I miei messaggi",
    zurUebersicht: "← Torna all'elenco",
    keine: `Ancora nessun messaggio. Si può scrivere a ogni persona della classe da "Le mie classi".`,
    klassePunkt: "- Classe ",
    du: "Tu: ",
  },
  // ★ O-PL (02.10.2026): Mehrzahl mit allen vier Formen; Namen nach Doppelpunkt
  // (Nominativ, Glossar Regel 11).
  pl: {
    neue: (n: number) =>
      mehrzahl(n, "pl", {
        one: (z) => `${z} nowa wiadomość`,
        few: (z) => `${z} nowe wiadomości`,
        many: (z) => `${z} nowych wiadomości`,
        other: (z) => `${z} nowej wiadomości`,
      }),
    knopfNeu: (n: number) => `Wiadomości (nowe: ${n})`,
    knopf: "Wiadomości",
    mitLehrkraft: "Wiadomości z nauczycielami",
    mitKind: (name: string) => `Wiadomości: ${name}`,
    meine: "Moje wiadomości",
    zurUebersicht: "← Wróć do listy",
    keine: "Nie ma jeszcze wiadomości. Do każdej osoby z klasy możesz napisać z sekcji Moje klasy.",
    klassePunkt: "- klasa ",
    du: "Ty: ",
  },
  // ★ O-TR (02.10.2026): Kind "sen" (mitLehrkraft, du), Lehrkraft "siz" in der
  // Leerzeile; Einzahl nach der Zahl ("3 yeni mesaj"); Name vor "ile" (eigenes
  // Wort, Glossar Regel 6).
  tr: {
    neue: (n: number) => `${n} yeni mesaj`,
    knopfNeu: (n: number) => `Mesajlar: ${n} yeni`,
    knopf: "Mesajlar",
    mitLehrkraft: "Öğretmeninle mesajlar",
    mitKind: (name: string) => `${name} ile mesajlar`,
    meine: "Mesajlarım",
    zurUebersicht: "← Gelen kutusuna dön",
    keine: 'Henüz mesaj yok. "Sınıflarım" bölümünden bir öğrenciye yazabilirsiniz.',
    klassePunkt: "· Sınıf ",
    du: "Sen: ",
  },
  // ★ O-CS (03.10.2026): Mehrzahl mit allen vier Formen (Glossar §2.11); Namen nach
  // Doppelpunkt (Regel 12); "doručená pošta" (§2.5). Die Lehrkraft (Leerzeile,
  // eigene Nachrichten) "vy", das Kind sieht nur Hauptwörter.
  cs: {
    neue: (n: number) =>
      mehrzahl(n, "cs", {
        one: (z) => `${z} nová zpráva`,
        few: (z) => `${z} nové zprávy`,
        many: (z) => `${z} nové zprávy`,
        other: (z) => `${z} nových zpráv`,
      }),
    knopfNeu: (n: number) => `Zprávy (nové: ${n})`,
    knopf: "Zprávy",
    mitLehrkraft: "Zprávy s vyučujícími",
    mitKind: (name: string) => `Zprávy: ${name}`,
    meine: "Moje zprávy",
    zurUebersicht: "← Zpět do doručené pošty",
    keine: "Zatím tu nejsou žádné zprávy. Každé osobě ze třídy můžete napsat z části Moje třídy.",
    klassePunkt: "· třída ",
    du: "Vy: ",
  },
  bg: {
    neue: (n: number) =>
      mehrzahl(n, "bg", {
        one: (z) => `${z} ново съобщение`,
        other: (z) => `${z} нови съобщения`,
      }),
    knopfNeu: (n: number) => `Съобщения (нови: ${n})`,
    knopf: "Съобщения",
    mitLehrkraft: "Съобщения с учителите",
    mitKind: (name: string) => `Съобщения: ${name}`,
    meine: "Моите съобщения",
    zurUebersicht: "← Обратно към входящата поща",
    keine: "Все още няма съобщения. Можете да пишете на всеки ученик от раздела „Моите класове“.",
    klassePunkt: "· клас ",
    du: "Вие: ",
  },
  el: {
    neue: (n: number) =>
      mehrzahl(n, "el", {
        one: (z) => `${z} νέο μήνυμα`,
        other: (z) => `${z} νέα μηνύματα`,
      }),
    knopfNeu: (n: number) => `Μηνύματα (νέα: ${n})`,
    knopf: "Μηνύματα",
    mitLehrkraft: "Μηνύματα με τους εκπαιδευτικούς",
    mitKind: (name: string) => `Μηνύματα: ${name}`,
    meine: "Τα μηνύματά μου",
    zurUebersicht: "← Πίσω στα εισερχόμενα",
    keine: "Δεν υπάρχουν ακόμα μηνύματα. Μπορείτε να γράψετε σε κάθε παιδί του τμήματος από την ενότητα «Τα τμήματά μου».",
    klassePunkt: "· τμήμα ",
    du: "Εσείς: ",
  },
  hu: {
    neue: (n: number) =>
      mehrzahl(n, "hu", {
        one: (z) => `${z} új üzenet`,
        other: (z) => `${z} új üzenet`,
      }),
    knopfNeu: (n: number) => `Üzenetek (új: ${n})`,
    knopf: "Üzenetek",
    mitLehrkraft: "Üzenetek a tanároddal",
    mitKind: (name: string) => `Üzenetek: ${name}`,
    meine: "Üzeneteim",
    zurUebersicht: "← Vissza a beérkezett üzenetekhez",
    keine: "Még nincsenek üzenetek. Az „Osztályaim” részből lehet üzenetet írni egy tanulónak.",
    klassePunkt: "· osztály: ",
    du: "Te: ",
  },
  nl: {
    neue: (n: number) =>
      mehrzahl(n, "nl", { one: (z) => `${z} nieuw bericht`, other: (z) => `${z} nieuwe berichten` }),
    knopfNeu: (n: number) => `Berichten: ${n} nieuw`,
    knopf: "Berichten",
    mitLehrkraft: "Berichten met je leerkracht",
    mitKind: (name: string) => `Berichten met ${name}`,
    meine: "Mijn berichten",
    zurUebersicht: "← Terug naar het overzicht",
    keine: "Nog geen berichten. Je kunt een leerling schrijven vanuit Mijn klassen.",
    klassePunkt: "· klas ",
    du: "Jij: ",
  },
  pt: {
    neue: (n: number) =>
      mehrzahl(n, "pt", {
        one: (z) => `${z} mensagem nova`,
        other: (z) => `${z} mensagens novas`,
        many: (z) => `${z} de mensagens novas`,
      }),
    knopfNeu: (n: number) => `Mensagens (novas: ${n})`,
    knopf: "Mensagens",
    mitLehrkraft: "Mensagens com docentes",
    mitKind: (name: string) => `Mensagens: ${name}`,
    meine: "As minhas mensagens",
    zurUebersicht: "← Voltar à caixa de entrada",
    keine: "Ainda não há mensagens. Pode escrever a qualquer pessoa da turma a partir de \"As minhas turmas\".",
    klassePunkt: "· turma ",
    du: "Eu: ",
  },
  br: {
    neue: (n: number) =>
      n === 0
        ? "Nenhuma mensagem nova"
        : mehrzahl(n, "br", {
            one: (z) => `${z} mensagem nova`,
            other: (z) => `${z} mensagens novas`,
          }),
    knopfNeu: (n: number) => `Mensagens (novas: ${n})`,
    knopf: "Mensagens",
    mitLehrkraft: "Mensagens com docentes",
    mitKind: (name: string) => `Mensagens: ${name}`,
    meine: "Minhas mensagens",
    zurUebersicht: "← Voltar para a caixa de entrada",
    keine: "Ainda não há mensagens. Você pode escrever para qualquer pessoa da turma em Minhas turmas.",
    klassePunkt: "· turma ",
    du: "Você: ",
  },
  ro: {
    neue: (n: number) =>
      mehrzahl(n, "ro", {
        one: (z) => `${z} mesaj nou`,
        few: (z) => `${z} mesaje noi`,
        other: (z) => `${z} de mesaje noi`,
      }),
    knopfNeu: (n: number) => `Mesaje (noi: ${n})`,
    knopf: "Mesaje",
    mitLehrkraft: "Mesaje cu cadrele didactice",
    mitKind: (name: string) => `Mesaje: ${name}`,
    meine: "Mesajele mele",
    zurUebersicht: "← Înapoi la mesajele primite",
    keine: "Încă nu există mesaje. Puteți scrie oricărei persoane din clasă din secțiunea Clasele mele.",
    klassePunkt: "· clasa ",
    du: "Eu: ",
  },
  sv: {
    neue: (n: number) =>
      mehrzahl(n, "sv", {
        one: (z) => `${z} nytt meddelande`,
        other: (z) => `${z} nya meddelanden`,
      }),
    knopfNeu: (n: number) => `Meddelanden (nya: ${n})`,
    knopf: "Meddelanden",
    mitLehrkraft: "Meddelanden med din lärare",
    mitKind: (name: string) => `Meddelanden med ${name}`,
    meine: "Mina meddelanden",
    zurUebersicht: "← Till översikten",
    keine: "Inga meddelanden än. Du kan skriva till en elev från Mina klasser.",
    klassePunkt: "· klass ",
    du: "Du: ",
  },
  uk: {
    neue: (n: number) =>
      mehrzahl(n, "uk", {
        one: (z) => `${z} нове повідомлення`,
        few: (z) => `${z} нові повідомлення`,
        many: (z) => `${z} нових повідомлень`,
        other: (z) => `${z} нового повідомлення`,
      }),
    knopfNeu: (n: number) => `Повідомлення (нові: ${n})`,
    knopf: "Повідомлення",
    mitLehrkraft: "Повідомлення з педагогом",
    mitKind: (name: string) => `Повідомлення: ${name}`,
    meine: "Мої повідомлення",
    zurUebersicht: "← Назад до вхідних",
    keine: "Повідомлень ще немає. Написати кожній дитині з класу можна в розділі Мої класи.",
    klassePunkt: "· клас ",
    du: "Ви: ",
  },
});

/** Kurzer Zwei-Ton-Glockenklang für neue Nachrichten (WebAudio, kein Asset).
 *  Best effort: ohne vorherige Nutzer-Interaktion darf der Browser den Ton
 *  unterdrücken — das Nachrichten-Fenster öffnet dann trotzdem. */
function playMessageChime(): void {
  try {
    const Ctx =
      window.AudioContext ??
      (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    void ctx.resume?.();
    const gain = ctx.createGain();
    gain.gain.value = 0.08;
    gain.connect(ctx.destination);
    [660, 880].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.connect(gain);
      osc.start(ctx.currentTime + i * 0.16);
      osc.stop(ctx.currentTime + i * 0.16 + 0.14);
    });
    window.setTimeout(() => void ctx.close(), 700);
  } catch {
    /* Ton nicht verfügbar — Fenster öffnet trotzdem */
  }
}

export function LwMessageBell({
  accountId,
  afterClose,
  beschreibungId,
  ohneKnopf,
  onUnreadChange,
  oeffnenRef,
}: {
  accountId: string | null;
  /** Nach dem Schließen des Nachrichten-Fensters aufrufen — z. B. um den Fokus
   *  zurück ins Übungsfeld zu legen (Punktgenau: Braille-Eingabefeld). */
  afterClose?: () => void;
  /**
   * Id des sichtbaren Hinweises (`Tipp`) über der Glocke — sie gehört an
   * `aria-describedby` des Knopfes (30.08.2026).
   *
   * ★ Warum durchgereicht und nicht außen angeklebt: Der Knopf steckt tief in
   * diesem Baustein, die Kopfzeile kommt von außen nicht an ihn heran. Ein
   * `cloneElement` auf `<LwMessageBell>` träfe die Komponente statt des
   * Knopfes und liefe still ins Leere. Fehlt die Id, ändert sich nichts.
   */
  beschreibungId?: string;
  /**
   * ★ 30.08.2026 (Johannes): Die Nachrichten wohnen im KONTO-Menü, nicht mehr
   * als eigene Glocke in der Werkzeug-Reihe. `ohneKnopf` lässt den runden
   * Knopf weg - ALLES andere bleibt: die Posteingang-Abfrage, Alt + N, das
   * automatische Aufspringen beim Kind, die aria-live-Ankündigung und das
   * Fenster selbst. Der Baustein muss dafür DAUERHAFT im Baum stehen (nicht
   * im aufklappbaren Menü - das wird beim Zuklappen abgebaut).
   */
  ohneKnopf?: boolean;
  /** Meldet den Posteingang-Stand hoch - für den roten Zähler am Konto-Zeichen. */
  onUnreadChange?: (unread: number) => void;
  /** Bekommt die Öffnen-Funktion - für den Eintrag „Nachrichten" im Konto-Menü. */
  oeffnenRef?: MutableRefObject<() => void>;
}) {
  const api = lwMessages();
  const { sprache } = useBedienSprache();
  const t = T[sprache];
  const [convos, setConvos] = useState<LwConversation[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<LwConversation | null>(null);
  // aria-live-Bereich: kündigt neue ungelesene Nachrichten für Screenreader /
  // Braillezeile an. Wert wird gesetzt wenn unread 0→N steigt oder beim Start >0.
  const [announcement, setAnnouncement] = useState("");
  const prevUnreadRef = useRef<number | null>(null);

  const me = api.identity();

  const load = useCallback(() => {
    if (!accountId) {
      setConvos([]);
      return;
    }
    api
      .loadInbox()
      .then(setConvos)
      .catch(() => setConvos([]));
  }, [api, accountId]);

  useEffect(() => {
    load();
    const iv = setInterval(load, REFRESH_MS);
    // Sofort neu laden, wenn irgendwo gesendet/gelesen wurde (z. B. Lehrkraft
    // öffnet ein Gespräch aus der Klassen-Übersicht) oder das Fenster Fokus bekommt.
    window.addEventListener(LW_MESSAGES_CHANGED, load);
    window.addEventListener("focus", load);
    return () => {
      clearInterval(iv);
      window.removeEventListener(LW_MESSAGES_CHANGED, load);
      window.removeEventListener("focus", load);
    };
  }, [load]);

  // Tastenkürzel Alt+N: Nachrichten öffnen / schließen.
  const openRef = useRef(open);
  openRef.current = open;
  useEffect(() => {
    if (!accountId || !me) return;
    const onKey = (e: KeyboardEvent) => {
      if (!e.altKey || e.ctrlKey || e.metaKey || e.code !== "KeyN") return;
      // Nicht beim Tippen in einem Eingabefeld feuern (z. B. Mac: Option+N ist
      // ein Dead-Key fürs ~) — sonst reißt es mitten im Schreiben den Fokus
      // weg. Schließen geht dort mit Escape. (NVDA-Muster, 2026-07-02.)
      //
      // ★ 18.10.2026 (Kürzel einheitlich): Ausgenommen sind die Felder, in
      // denen die Kürzel ausdrücklich weiter gelten - dieselbe Ausnahme wie
      // `unsereAltTaste` in AppKopfzeile.tsx (`laesstDurch`): das Tippfeld von
      // Tastenflow (`data-typing-field="practice"`) und jedes Feld mit
      // `data-kuerzel="an"` (Mathecoach, Plus, „Tasten erkunden"). Bis dahin
      // versprach die Tastenflow-Liste „funktioniert auch direkt im
      // Schreibfeld" - und Alt + N schwieg genau dort. `preventDefault()` unten
      // verhindert das ~ der Wahltaste.
      const ziel = e.target as HTMLElement | null;
      const tag = ziel?.tagName;
      const laesstDurch =
        ziel?.dataset?.typingField === "practice" || ziel?.dataset?.kuerzel === "an";
      if ((tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") && !laesstDurch) return;
      // Liegt ein ANDERER Dialog obenauf (Hilfe, Zeichenliste …), nicht noch
      // ein Fenster darunter stapeln.
      if (
        !openRef.current &&
        document.querySelector('[role="dialog"][aria-modal="true"]')
      )
        return;
      e.preventDefault();
      if (openRef.current) closeAll();
      else setOpen(true);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId, me]);

  const unread = convos.reduce((sum, c) => sum + c.unread, 0);

  // Posteingang-Stand nach oben melden (roter Zähler am Konto-Zeichen) und
  // die Öffnen-Funktion hinterlegen (Eintrag „Nachrichten" im Konto-Menü).
  useEffect(() => {
    onUnreadChange?.(unread);
  }, [unread, onUnreadChange]);
  useEffect(() => {
    if (!oeffnenRef) return;
    oeffnenRef.current = () => setOpen(true);
    return () => {
      oeffnenRef.current = () => {};
    };
  }, [oeffnenRef]);

  // Ankündigung wenn ungelesene Nachrichten neu ankommen (oder beim Start).
  // Beim KIND zusätzlich (Johannes 2026-07-02): das Nachrichten-Fenster
  // öffnet von selbst und ein Glockenton spielt — sowohl live während des
  // Übens als auch beim späteren Öffnen der App (prev === null && unread > 0).
  useEffect(() => {
    if (unread === 0) {
      prevUnreadRef.current = 0;
      return;
    }
    const prev = prevUnreadRef.current;
    prevUnreadRef.current = unread;
    // Beim ersten Laden (prev===null) oder wenn neue Nachrichten dazukommen.
    if (prev === null || unread > prev) {
      const text = T[sprache].neue(unread);
      setAnnouncement(text);
      if (me?.role === "pupil" && !openRef.current) {
        playMessageChime();
        setOpen(true);
      }
      // Nach 4 s leeren, damit die nächste Nachricht erneut angezeigt wird.
      const t = window.setTimeout(() => setAnnouncement(""), 4000);
      return () => window.clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unread, me?.role]);

  /*
   * ★★★★★ JEDER HOOK STEHT ÜBER DEM `return null` (23.09.2026, Absturz in
   * einer 3. Klasse HAS: „Unexpected Application Error! Minified React error
   * #300").
   *
   * `me` wird bei JEDEM Zeichnen frisch aus der gespeicherten Sitzung gelesen,
   * und die gilt nur, solange ihr Ablaufdatum nicht erreicht ist. Die Kopfzeile
   * hängt die Glocke aber an ihr eigenes `account` - das bleibt stehen. Läuft
   * die Anmeldung ab, während die Seite offen ist (gemessen: Anmeldung am
   * 16.09. um 08:2x Uhr, sieben Tage gültig, abgelaufen in der nächsten
   * Wochenstunde), steht die Glocke noch im Baum, `me` ist aber `null`. Stand
   * `listeRef` unter dieser Zeile, rief React beim nächsten Zeichnen einen
   * Hook weniger auf als beim vorigen - und brach die GANZE App ab.
   * `tests/tastenflow-glocke-sitzung-ablauf.test.tsx` stellt es nach.
   */
  const listeRef = useRef<HTMLUListElement>(null);

  if (!accountId || !me) return null;
  const isPupil = me.role === "pupil";

  /**
   * ★ Nr 24 der Fokusziele (22.08.2026): „← Zur Übersicht" verschwindet mit dem
   * Gesprächsfaden - bisher setzte niemand einen Fokus, und er fiel auf `body`.
   * Ziel ist das erste Gespräch der Liste, also das erste Bedienelement des
   * Neuen (R1). `setTimeout(0)`, weil es die Liste erst nach dem Rendern gibt
   * ([[feedback_fokus_pflicht_alle_apps]]).
   *
   * ★ Nr 25 (ein Gespräch ÖFFNEN) braucht hier NICHTS: `LwMessageThread` holt
   * den Fokus beim Aufbauen selbst in sein Antwortfeld (dort seit 02.07.2026,
   * „wer das Gespräch öffnet, will antworten"). Die Bestandsaufnahme hat nur
   * diese Datei angeschaut und die Stelle darum als UNDEFINIERT geführt. Ein
   * zweiter Fokus-Aufruf von hier aus wäre genau die Doppel-Rückgabe, die R2
   * verbietet - auf der Braillezeile zwei Sprünge für einen Vorgang.
   *
   * Gemeinsamer Baustein: Der Weg bleibt innerhalb dieses Fensters, die vier
   * Programme merken davon nichts.
   *
   * (`listeRef` selbst steht oben, vor dem `return null` - siehe dort.)
   */
  function zurUebersicht() {
    setActive(null);
    window.setTimeout(() => {
      listeRef.current?.querySelector<HTMLElement>("button")?.focus();
    }, 0);
  }

  function closeAll() {
    setOpen(false);
    setActive(null);
    load();
    // Fokus-Übergabe NACH dem Modal-Unmount (dessen Cleanup stellt sonst den
    // alten Fokus wieder her und würde unsere Übergabe überschreiben).
    if (afterClose) window.setTimeout(afterClose, 0);
  }

  return (
    <>
      {/* Ankündigungen für Screenreader und Braillezeile */}
      <span
        role="status"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </span>
      {/* ★ 30.08.2026: dieselbe Bauart wie die übrigen runden Knöpfe der
          Kopfzeile - 36 px rund, Sinnbild 22 px, Rahmen in `border-hairline`.
          Mit `ohneKnopf` (Nachrichten wohnen im Konto-Menü) entfällt er ganz -
          Fenster, Abfrage und Kürzel bleiben. */}
      {!ohneKnopf && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hairline bg-surface-raised text-ink transition-colors hover:bg-surface-sunken"
          aria-label={unread > 0 ? t.knopfNeu(unread) : t.knopf}
          aria-describedby={beschreibungId}
        >
          <Icon name="bell" className="h-[22px] w-[22px]" />
          {unread > 0 ? (
            <span
              aria-hidden="true"
              className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none"
              style={{
                backgroundColor: "rgb(var(--c-danger))",
                color: "rgb(var(--c-on-accent))",
              }}
            >
              {unread > 9 ? "9+" : unread}
            </span>
          ) : null}
        </button>
      )}

      {open ? (
        <Modal
          title={
            active
              ? isPupil
                ? t.mitLehrkraft
                : t.mitKind(active.pupilName)
              : t.meine
          }
          onClose={closeAll}
          size="lg"
        >
          {active ? (
            <div className="space-y-3">
              {!isPupil ? (
                <button
                  type="button"
                  className="btn-ghost btn-toggle"
                  onClick={zurUebersicht}
                >
                  {t.zurUebersicht}
                </button>
              ) : null}
              <LwMessageThread
                pupilUid={active.pupilUid}
                pupilName={active.pupilName}
                classCode={active.classCode}
                onChange={load}
              />
            </div>
          ) : isPupil ? (
            // Kind: genau ein Gespräch (mit der eigenen Lehrkraft). Direkt zeigen.
            <LwMessageThread
              pupilUid={me.id}
              pupilName={me.name}
              classCode={me.classCode}
              onChange={load}
            />
          ) : convos.length === 0 ? (
            <p className="text-sm text-ink-muted">{t.keine}</p>
          ) : (
            <ul ref={listeRef} className="space-y-2">
              {convos.map((c) => {
                const last = c.messages[c.messages.length - 1];
                return (
                  <li key={c.pupilUid}>
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 rounded-lg border border-hairline bg-surface-raised px-3 py-2 text-left hover:bg-surface-sunken"
                      onClick={() => setActive(c)}
                    >
                      <span className="flex-1 min-w-0">
                        <span className="block font-semibold text-ink">
                          {c.pupilName}
                          {c.classCode ? (
                            <span className="font-normal text-ink-muted">
                              {" "}
                              {t.klassePunkt}
                              {c.classCode}
                            </span>
                          ) : null}
                        </span>
                        {last ? (
                          <span className="block truncate text-sm text-ink-muted">
                            {last.senderRole === "pupil" ? "" : t.du}
                            {last.body}
                          </span>
                        ) : null}
                      </span>
                      {c.unread > 0 ? (
                        <span
                          className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[11px] font-bold leading-none"
                          style={{
                            backgroundColor: "rgb(var(--c-danger))",
                            color: "rgb(var(--c-on-accent))",
                          }}
                        >
                          {c.unread > 9 ? "9+" : c.unread}
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </Modal>
      ) : null}
    </>
  );
}
