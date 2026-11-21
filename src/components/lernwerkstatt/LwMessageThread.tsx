import { useEffect, useRef, useState } from "react";
import {
  lwMessages,
  type LwMessage,
  type LwRole,
} from "@/lib/lernwerkstatt/messages";
import { GEBIET, texte, useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";
import { istGeruestSprache } from "@/lib/typing/sprachRegister";

/**
 * ★ EN6b (19.09.2026): die Texte des Gesprächs in beiden Bedienungssprachen.
 * GEMEINSAMER TEIL - englisch nur über den Anbieter (aktiv nur auf den
 * Adressen von Tastenflow); die anderen Programme bleiben Zeichen für Zeichen
 * deutsch. Wie im Deutschen anrede-frei, wo beide Seiten lesen (Dateikopf,
 * „ANREDE"): *Please write a message first.* passt für Kind und Lehrkraft.
 */
const T = texte({
  de: {
    wirdGesendet: "Wird gesendet …",
    ersteSchreiben: "Bitte erst eine Nachricht schreiben.",
    gesendet: "Gesendet.",
    nichtGesendet:
      "Die Nachricht wurde nicht gesendet. Der Text steht noch im Feld - " +
      "bitte noch einmal senden.",
    laedt: "Nachrichten werden geladen …",
    keineMitKind: (name: string) => `Noch keine Nachrichten mit ${name}. Schreibe die erste unten.`,
    keineKind: "Noch keine Nachrichten. Du kannst hier deiner Lehrkraft schreiben.",
    lehrkraft: "Lehrkraft",
    schreiben: "Nachricht schreiben",
    anKind: (name: string) => `Nachricht an ${name} …`,
    anLehrkraft: "Nachricht an deine Lehrkraft …",
    senden: "Senden",
  },
  en: {
    wirdGesendet: "Sending …",
    ersteSchreiben: "Please write a message first.",
    gesendet: "Sent.",
    nichtGesendet:
      "The message wasn't sent. Your text is still in the box - please send it again.",
    laedt: "Loading messages …",
    keineMitKind: (name: string) => `No messages with ${name} yet. Write the first one below.`,
    keineKind: "No messages yet. You can write to your teacher here.",
    lehrkraft: "Teacher",
    schreiben: "Write a message",
    anKind: (name: string) => `Message to ${name} …`,
    anLehrkraft: "Message to your teacher …",
    senden: "Send",
  },
  // ★ E11a: anrede-frei, wo beide Seiten lesen. ★ E11a-5 (26.09.2026):
  // `keineMitKind`/`anKind` liest nur die Lehrkraft - dort „vous" (Bauplan
  // §9.1); `keineKind`/`anLehrkraft` liest nur das Kind - dort „tu". Die
  // Lehrkraft heisst nach Glossar §9.2 ohne Point médian
  // „enseignant ou enseignante".
  fr: {
    wirdGesendet: "Envoi en cours …",
    ersteSchreiben: "Il faut d'abord écrire un message.",
    gesendet: "Envoyé.",
    nichtGesendet:
      "Le message n'est pas parti. Le texte est encore dans le champ - " +
      "il suffit de l'envoyer à nouveau.",
    laedt: "Chargement des messages …",
    keineMitKind: (name: string) =>
      `Pas encore de message avec ${name}. Écrivez le premier ci-dessous.`,
    keineKind: "Pas encore de message. Ici, tu peux écrire à ton enseignant ou ton enseignante.",
    lehrkraft: "Enseignant ou enseignante",
    schreiben: "Écrire un message",
    anKind: (name: string) => `Message à ${name} …`,
    anLehrkraft: "Message à ton enseignant ou ton enseignante …",
    senden: "Envoyer",
  },
  // ★ ES-O (27.09.2026): wie „fr" - `keineMitKind`/`anKind` liest die Lehrkraft
  // (usted), `keineKind`/`anLehrkraft` das Kind (tú).
  es: {
    wirdGesendet: "Enviando …",
    ersteSchreiben: "Primero hay que escribir un mensaje.",
    gesendet: "Enviado.",
    nichtGesendet:
      "El mensaje no se envió. El texto sigue en el campo - " +
      "basta con enviarlo otra vez.",
    laedt: "Cargando los mensajes …",
    keineMitKind: (name: string) =>
      `Todavía no hay mensajes con ${name}. Escriba el primero aquí debajo.`,
    keineKind: "Todavía no hay mensajes. Aquí puedes escribir a tu docente.",
    lehrkraft: "Docente",
    schreiben: "Escribir un mensaje",
    anKind: (name: string) => `Mensaje para ${name} …`,
    anLehrkraft: "Mensaje para tu docente …",
    senden: "Enviar",
  },
  it: {
    wirdGesendet: "Invio in corso...",
    ersteSchreiben: "Prima bisogna scrivere un messaggio.",
    gesendet: "Inviato.",
    nichtGesendet:
      "Il messaggio non è stato inviato. Il testo è ancora nel campo - " +
      "basta inviarlo di nuovo.",
    laedt: "Caricamento dei messaggi...",
    keineMitKind: (name: string) =>
      `Ancora nessun messaggio con ${name}. Il primo si scrive qui sotto.`,
    keineKind: "Ancora nessun messaggio. Qui puoi scrivere all'insegnante.",
    lehrkraft: "Insegnante",
    schreiben: "Scrivi un messaggio",
    anKind: (name: string) => `Messaggio per ${name}...`,
    anLehrkraft: "Messaggio per l'insegnante...",
    senden: "Invia",
  },
  // ★ O-PL (02.10.2026): Namen nach Doppelpunkt (Glossar Regel 11); die
  // Lehrkraft als „osoba prowadząca klasę" (Regel 2), im Kindertext einmal
  // „nauczyciel lub nauczycielka".
  pl: {
    wirdGesendet: "Wysyłanie...",
    ersteSchreiben: "Najpierw napisz wiadomość.",
    gesendet: "Wysłano.",
    nichtGesendet:
      "Wiadomość nie została wysłana. Tekst jest nadal w polu - " +
      "wyślij go jeszcze raz.",
    laedt: "Wczytywanie wiadomości...",
    keineMitKind: (name: string) =>
      `Rozmowa: ${name}. Nie ma jeszcze wiadomości - pierwszą napiszesz poniżej.`,
    keineKind: "Nie ma jeszcze wiadomości. Tutaj możesz napisać do nauczyciela lub nauczycielki.",
    lehrkraft: "Osoba prowadząca klasę",
    schreiben: "Napisz wiadomość",
    anKind: (name: string) => `Wiadomość do: ${name}...`,
    anLehrkraft: "Wiadomość do osoby prowadzącej klasę...",
    senden: "Wyślij",
  },
  // ★ O-TR (02.10.2026): wo beide Seiten lesen, ohne Anrede; Kind "sen",
  // Lehrkraft "siz". Name nach Doppelpunkt oder vor "için" (eigenes Wort).
  tr: {
    wirdGesendet: "Gönderiliyor...",
    ersteSchreiben: "Önce bir mesaj yazmak gerekiyor.",
    gesendet: "Gönderildi.",
    nichtGesendet:
      "Mesaj gönderilmedi. Metin alanda duruyor - " +
      "yeniden gönderilebilir.",
    laedt: "Mesajlar açılıyor...",
    keineMitKind: (name: string) =>
      `Henüz mesaj yok. Öğrenci: ${name}. İlk mesajı aşağıya yazabilirsiniz.`,
    keineKind: "Henüz mesaj yok. Buradan öğretmenine yazabilirsin.",
    lehrkraft: "Öğretmen",
    schreiben: "Mesaj yaz",
    anKind: (name: string) => `${name} için mesaj...`,
    anLehrkraft: "Öğretmenine mesaj...",
    senden: "Gönder",
  },
  // ★ O-CS (03.10.2026): wo beide Seiten lesen, ohne Anrede; Kind "ty", Lehrkraft
  // "vy". Name nur nach Doppelpunkt (Glossar Regel 12: nie "pro ${name}"); die
  // Lehrkraft als "vyučující" in Nominativ/Mehrzahl (Regel 2).
  cs: {
    wirdGesendet: "Odesílání...",
    ersteSchreiben: "Nejdřív je potřeba napsat zprávu.",
    gesendet: "Odesláno.",
    nichtGesendet:
      "Zpráva se neodeslala. Text zůstal v poli - " +
      "lze ho odeslat znovu.",
    laedt: "Načítání zpráv...",
    keineMitKind: (name: string) =>
      `Konverzace: ${name}. Zatím tu nejsou žádné zprávy - první můžete napsat níže.`,
    keineKind: "Zatím tu nejsou žádné zprávy. Tady můžeš poslat zprávu vyučujícím.",
    lehrkraft: "Vyučující",
    schreiben: "Napsat zprávu",
    anKind: (name: string) => `Zpráva - příjemce: ${name}...`,
    anLehrkraft: "Zpráva pro vyučující...",
    senden: "Odeslat",
  },
  bg: {
    wirdGesendet: "Изпращане...",
    ersteSchreiben: "Първо трябва да се напише съобщение.",
    gesendet: "Изпратено.",
    nichtGesendet:
      "Съобщението не беше изпратено. Текстът е още в полето - " +
      "може да се изпрати отново.",
    laedt: "Зареждане на съобщенията...",
    keineMitKind: (name: string) =>
      `Разговор: ${name}. Все още няма съобщения - първото можете да напишете по-долу.`,
    keineKind: "Все още няма съобщения. Тук можеш да пишеш на учителите.",
    lehrkraft: "Учител",
    schreiben: "Напиши съобщение",
    anKind: (name: string) => `Съобщение до: ${name}...`,
    anLehrkraft: "Съобщение до учителите...",
    senden: "Изпрати",
  },
  el: {
    wirdGesendet: "Αποστολή...",
    ersteSchreiben: "Πρώτα χρειάζεται να γραφτεί ένα μήνυμα.",
    gesendet: "Στάλθηκε.",
    nichtGesendet:
      "Το μήνυμα δεν στάλθηκε. Το κείμενο είναι ακόμα στο πεδίο - " +
      "μπορεί να σταλεί ξανά.",
    laedt: "Φόρτωση μηνυμάτων...",
    keineMitKind: (name: string) =>
      `Συνομιλία: ${name}. Δεν υπάρχουν ακόμα μηνύματα - μπορείτε να γράψετε το πρώτο παρακάτω.`,
    keineKind: "Δεν υπάρχουν ακόμα μηνύματα. Εδώ μπορείς να στείλεις μήνυμα στους εκπαιδευτικούς σου.",
    lehrkraft: "Εκπαιδευτικός",
    schreiben: "Σύνταξη μηνύματος",
    anKind: (name: string) => `Μήνυμα - παραλήπτης: ${name}...`,
    anLehrkraft: "Μήνυμα για τους εκπαιδευτικούς...",
    senden: "Αποστολή",
  },
  hu: {
    wirdGesendet: "Küldés...",
    ersteSchreiben: "Előbb írni kell egy üzenetet.",
    gesendet: "Elküldve.",
    nichtGesendet:
      "Az üzenet nem ment el. A szöveg még a mezőben van - " +
      "újra el lehet küldeni.",
    laedt: "Üzenetek betöltése...",
    keineMitKind: (name: string) =>
      `Beszélgetés: ${name}. Még nincsenek üzenetek - az elsőt lent lehet megírni.`,
    keineKind: "Még nincsenek üzenetek. Itt írhatsz a tanárodnak.",
    lehrkraft: "Tanár",
    schreiben: "Üzenet írása",
    anKind: (name: string) => `Üzenet - címzett: ${name}...`,
    anLehrkraft: "Üzenet a tanárodnak...",
    senden: "Küldés",
  },
  nl: {
    wirdGesendet: "Wordt verzonden...",
    ersteSchreiben: "Schrijf eerst een bericht.",
    gesendet: "Verzonden.",
    nichtGesendet:
      "Het bericht is niet verzonden. De tekst staat nog in het veld - " +
      "verzend het nog een keer.",
    laedt: "Berichten worden geladen...",
    keineMitKind: (name: string) => `Nog geen berichten met ${name}. Schrijf hieronder het eerste.`,
    keineKind: "Nog geen berichten. Je kunt hier je leerkracht schrijven.",
    lehrkraft: "Leerkracht",
    schreiben: "Bericht schrijven",
    anKind: (name: string) => `Bericht aan ${name}...`,
    anLehrkraft: "Bericht aan je leerkracht...",
    senden: "Verzenden",
  },
  pt: {
    wirdGesendet: "A enviar...",
    ersteSchreiben: "Primeiro é preciso escrever uma mensagem.",
    gesendet: "Enviada.",
    nichtGesendet:
      "A mensagem não foi enviada. O texto continua no campo - " +
      "é possível enviá-lo outra vez.",
    laedt: "A carregar mensagens...",
    keineMitKind: (name: string) =>
      `Conversa: ${name}. Ainda não há mensagens - pode escrever a primeira aqui em baixo.`,
    keineKind: "Ainda não há mensagens. Aqui podes enviar uma mensagem a docentes.",
    lehrkraft: "Docente",
    schreiben: "Escrever mensagem",
    anKind: (name: string) => `Mensagem para: ${name}...`,
    anLehrkraft: "Mensagem para docentes...",
    senden: "Enviar",
  },
  br: {
    wirdGesendet: "Enviando...",
    ersteSchreiben: "Escreva uma mensagem primeiro.",
    gesendet: "Mensagem enviada.",
    nichtGesendet:
      "A mensagem não foi enviada. O texto continua no campo - " +
      "envie de novo.",
    laedt: "Carregando mensagens...",
    keineMitKind: (name: string) =>
      `Conversa: ${name}. Ainda não há mensagens - você pode escrever a primeira abaixo.`,
    keineKind: "Ainda não há mensagens. Aqui você pode escrever para docentes.",
    lehrkraft: "Docente",
    schreiben: "Escrever mensagem",
    anKind: (name: string) => `Mensagem para: ${name}...`,
    anLehrkraft: "Mensagem para docentes...",
    senden: "Enviar",
  },
  ro: {
    wirdGesendet: "Se trimite...",
    ersteSchreiben: "Mai întâi trebuie scris un mesaj.",
    gesendet: "Trimis.",
    nichtGesendet:
      "Mesajul nu a fost trimis. Textul a rămas în câmp - " +
      "poate fi trimis din nou.",
    laedt: "Se încarcă mesajele...",
    keineMitKind: (name: string) =>
      `Conversație: ${name}. Încă nu există mesaje - primul îl puteți scrie mai jos.`,
    keineKind: "Încă nu există mesaje. Aici poți scrie cadrelor didactice.",
    lehrkraft: "Cadru didactic",
    schreiben: "Scrieți un mesaj",
    anKind: (name: string) => `Mesaj pentru: ${name}...`,
    anLehrkraft: "Mesaj pentru cadrele didactice...",
    senden: "Trimiteți",
  },
  sv: {
    wirdGesendet: "Skickar...",
    ersteSchreiben: "Skriv ett meddelande först.",
    gesendet: "Skickat.",
    nichtGesendet:
      "Meddelandet skickades inte. Texten finns kvar i fältet - " +
      "skicka det en gång till.",
    laedt: "Läser in meddelanden...",
    keineMitKind: (name: string) => `Inga meddelanden med ${name} än. Skriv det första här nedanför.`,
    keineKind: "Inga meddelanden än. Här kan du skriva till din lärare.",
    lehrkraft: "Lärare",
    schreiben: "Skriv meddelande",
    anKind: (name: string) => `Meddelande till ${name}...`,
    anLehrkraft: "Meddelande till din lärare...",
    senden: "Skicka",
  },
  uk: {
    wirdGesendet: "Надсилання...",
    ersteSchreiben: "Спочатку потрібно написати повідомлення.",
    gesendet: "Надіслано.",
    nichtGesendet:
      "Повідомлення не надіслано. Текст залишився в полі - " +
      "його можна надіслати ще раз.",
    laedt: "Завантаження повідомлень...",
    keineMitKind: (name: string) =>
      `Розмова: ${name}. Повідомлень ще немає - перше можна написати нижче.`,
    keineKind: "Повідомлень ще немає. Тут можна написати своєму педагогу.",
    lehrkraft: "Педагог",
    schreiben: "Написати повідомлення",
    anKind: (name: string) => `Повідомлення - кому: ${name}...`,
    anLehrkraft: "Повідомлення педагогу...",
    senden: "Надіслати",
  },
});

/**
 * Zeitpunkt einer Nachricht. Deutsch wie vorher („19.09.26, 10:35"), englisch
 * mit Monatsnamen (Glossar §1.2: „19 Sept 2026, 10:35") - eine Zahlenreihe
 * mit Schrägstrichen liest eine Sprachausgabe Ziffer für Ziffer.
 */
function zeitpunkt(ms: number, sprache: BedienSprache): string {
  // ★ O-CS (03.10.2026): kein Rückfall mehr - jede Sprache hat ihren Zweig.
  const sp = sprache;
  const d = new Date(ms);
  // ★ O5 (30.10.2026): die neun nach ihrem Gebiet, mit Monatsnamen (bis dahin „19.09.26, 10:35").
  if (istGeruestSprache(sp))
    return d.toLocaleString(GEBIET[sp], {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  // ★ O-CS (03.10.2026): tschechisch "2. 10. 2026 8:05" (Intl cs-CZ, Glossar §2.10) -
  // Monat als Zahl, kein selbst gebildeter Monatsname.
  if (sp === "cs")
    return d.toLocaleString(GEBIET.cs, {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  // ★ O-TR (02.10.2026): türkisch "21 Eyl 2026 08:05" (Intl tr-TR, Glossar §2.10) -
  // keine Endung an der Uhrzeit.
  if (sp === "tr")
    return d.toLocaleString(GEBIET.tr, {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  // ★ O-PL (02.10.2026): polnisch „21 wrz 2026, 08:05" (Intl pl-PL, Glossar §2.10).
  if (sp === "pl")
    return d.toLocaleString(GEBIET.pl, {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  // ★ O-IT (02.10.2026): italienisch „19 set 2026, 10:35".
  if (sp === "it")
    return d.toLocaleString(GEBIET.it, {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  sprache = sp;
  // ★ E11a-5 (26.09.2026): französisch „19 sept. 2026, 10 h 35" (Bauplan
  // §9.1) - von Hand, weil `toLocaleString("fr-FR")` hier „10:35" liefert
  // (derselbe Befund wie `uhrzeitAusMs` in `TastenflowReiter.tsx`).
  if (sprache === "fr") {
    const tag = d.toLocaleDateString(GEBIET.fr, { day: "numeric", month: "short", year: "numeric" });
    return `${tag}, ${d.getHours()} h ${String(d.getMinutes()).padStart(2, "0")}`;
  }
  // ★ ES-O (27.09.2026): spanisch „19 sept 2026, 10:35" - vorher still österreichisch-deutsch.
  if (sprache === "es")
    return d.toLocaleString(GEBIET.es, {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  if (sprache === "en")
    return d.toLocaleString(GEBIET.en, {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  return d.toLocaleString("de-AT", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

/**
 * Ein Gespräch (chat-artig) zwischen der angemeldeten Person und EINEM Kind.
 * Wird sowohl in der Glocke (Posteingang) als auch in der Klassen-Übersicht der
 * Lehrkraft (eine Nachricht je Kind / Antworten) verwendet. Lädt die
 * Nachrichten selbst, markiert sie beim Öffnen als gelesen und schickt neue über
 * den rollen-passenden Weg (Lehrkraft → Kind, Kind → Lehrkraft).
 *
 * Bei leerem Verlauf dient das Eingabefeld zum BEGINNEN eines Gesprächs (sowohl
 * Lehrkraft als auch Kind dürfen starten). Memory: project_lernwerkstatt_unified.
 *
 * ── DER SENDEN-KNOPF (Johannes 22.08.2026, 20:30 · FOKUSZIELE-TASTENFLOW.md §0.5)
 *
 * Bis zum 28.08.2026 stand am Knopf „Senden" ein `disabled={busy || !draft.trim()}`.
 * Für ein Kind mit Blindheit war das die schlechteste aller Antworten, und zwar
 * gleich zweimal:
 *
 *  • Bei leerem Feld war der Knopf gar nicht erst im Tab-Weg. Wer sich mit der
 *    Tabulatortaste durch das Gespräch tastet, findet ihn nicht - und erfährt
 *    nirgends, dass zuerst etwas geschrieben werden muss. Das Fenster wirkt
 *    kaputt.
 *  • Beim Senden sperrte sich der Knopf im Augenblick der Betätigung selbst.
 *    Der Fokus stand darauf, fiel auf `body`, und die Braillezeile stand im
 *    Nichts - genau in der Sekunde, in der auf den Server gewartet wird und
 *    eine Rückmeldung am nötigsten wäre (Regel R5).
 *
 * Beides ist geheilt: `aria-disabled` statt `disabled` (der Knopf bleibt
 * Tabstopp und wird von der Sprachausgabe trotzdem als „nicht verfügbar"
 * gemeldet), die Sperre steckt jetzt im Handler, und JEDE Betätigung bekommt
 * eine Antwort - „Bitte erst eine Nachricht schreiben.", „Wird gesendet …",
 * „Gesendet." oder die Fehlermeldung. Eine Sperre ohne Begründung ist eine
 * halbe Sperre.
 *
 * ── WARUM DIE ANSAGEN HIER EINE LIVE-REGION SIND, KEINE SPRACHAUSGABE ──────
 * Dieser Baustein liegt in `src/components/lernwerkstatt/` und gehört ALLEN
 * vier Programmen (Tastenflow, im Griff, Punktgenau, Klangpunkte). Nur
 * Tastenflow bringt eine eigene Stimme mit (`speakUi` aus `@/lib/typing`); ein
 * Import von dort würde die Nachrichten an ein einzelnes Programm fesseln, und
 * in den anderen dreien bliebe es still. Eine höfliche Live-Region
 * (`role="status" aria-live="polite"`) spricht dagegen in allen vieren - und
 * geht genauso auf die Braillezeile. Denselben Weg geht der zweite gemeinsame
 * Baustein, `SchuelerAnmeldung.tsx`; die beiden bleiben absichtlich gleich.
 *
 * ── ANREDE ────────────────────────────────────────────────────────────────
 * Dieses Fenster benutzen BEIDE Seiten - das Kind („Du") und die Lehrkraft
 * („Sie"). Alle Ansagen sind darum bewusst anrede-frei formuliert.
 */
export function LwMessageThread({
  pupilUid,
  pupilName,
  classCode,
  onChange,
}: {
  pupilUid: string;
  pupilName: string;
  classCode: string;
  /** Nach Senden/Lesen aufrufen (z. B. Glocken-Zähler aktualisieren). */
  onChange?: () => void;
}) {
  const api = lwMessages();
  const me = api.identity();
  const myRole: LwRole = me?.role ?? "pupil";
  const { sprache } = useBedienSprache();
  const t = T[sprache];
  const [messages, setMessages] = useState<LwMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  /**
   * Die höfliche Ansage (siehe Dateikopf): „Bitte erst eine Nachricht
   * schreiben.", „Wird gesendet …", „Gesendet.". Sie steht in einer eigenen
   * Live-Region, damit sie auch dann gelesen wird, wenn sich sonst nichts
   * sichtbar ändert.
   */
  const [ansage, setAnsage] = useState("");
  /** Ging etwas schief, wird das dringlich gemeldet (`role="alert"`). */
  const [fehler, setFehler] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const composeRef = useRef<HTMLTextAreaElement>(null);

  /**
   * Fokus ins Antwortfeld, im NÄCHSTEN TAKT - nie mit `requestAnimationFrame`
   * ([[feedback_fokus_pflicht_alle_apps]]). Der Takt ist nötig, weil React die
   * neue Runde erst danach gezeichnet hat.
   */
  function fokusInsFeld() {
    window.setTimeout(() => composeRef.current?.focus(), 0);
  }

  // Fokus sofort ins Schreibfeld (Johannes 2026-07-02): wer das Gespräch
  // öffnet, will antworten. Verzögert um einen Tick, weil der umgebende
  // Modal-Dialog seinen Container-Fokus NACH den Kind-Effekten setzt —
  // der Timeout gewinnt zuverlässig.
  useEffect(() => {
    const t = window.setTimeout(() => composeRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [pupilUid]);

  async function reload(markRead: boolean) {
    const msgs = await api.listForPupil(pupilUid);
    setMessages(msgs);
    setLoaded(true);
    if (markRead) {
      await api.markRead(pupilUid, msgs);
      onChange?.();
    }
  }

  useEffect(() => {
    void reload(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pupilUid]);

  // Immer ans Ende scrollen, wenn neue Nachrichten erscheinen.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  /**
   * Senden - und zwar mit einer Antwort auf JEDE Betätigung.
   *
   * Die Sperre, die früher als `disabled` am Knopf hing, steht jetzt hier: Sie
   * verhindert dasselbe (kein leerer Versand, keine Doppel-Auslösung), nimmt
   * dem Knopf aber nicht seinen Platz im Tab-Weg und sagt vor allem, WARUM
   * gerade nichts geschieht.
   */
  async function send() {
    const text = draft.trim();
    if (busy) {
      // Es läuft schon etwas - das ist keine Fehlbedienung, sondern Warten.
      setAnsage(t.wirdGesendet);
      return;
    }
    if (!text) {
      setFehler("");
      setAnsage(t.ersteSchreiben);
      fokusInsFeld();
      return;
    }
    setFehler("");
    setAnsage(t.wirdGesendet);
    setBusy(true);
    const ok =
      myRole === "teacher"
        ? await api.sendFromTeacher({ pupilUid, pupilName, classCode, body: text })
        : await api.sendFromPupil(text);
    setBusy(false);
    if (ok) {
      setDraft("");
      setAnsage(t.gesendet);
      // Fokus zurück ins geleerte Antwortfeld: Von dort geht es weiter, und
      // das Kind hört mit derselben Bewegung, dass die Nachricht weg ist.
      fokusInsFeld();
      await reload(false);
      onChange?.();
    } else {
      // ★ Vor dem 28.08.2026 tat dieser Zweig GAR NICHTS: Der Versand
      // scheiterte still, die Nachricht blieb im Feld stehen, und niemand
      // erfuhr davon - am wenigsten jemand, der den Bildschirm nicht sieht.
      // Der Fokus bleibt bewusst auf dem Knopf: Von dort aus wird der zweite
      // Versuch unternommen, und der Text steht noch im Feld.
      setAnsage("");
      setFehler(t.nichtGesendet);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={scrollRef}
        className="max-h-[50vh] space-y-2 overflow-y-auto rounded-lg bg-surface-sunken/40 p-3"
      >
        {!loaded ? (
          <p className="text-sm text-ink-muted">{t.laedt}</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-ink-muted">
            {myRole === "teacher" ? t.keineMitKind(pupilName) : t.keineKind}
          </p>
        ) : (
          messages.map((m) => {
            const mine = m.senderRole === myRole;
            return (
              <div
                key={m.id}
                className={"flex " + (mine ? "justify-end" : "justify-start")}
              >
                <div
                  className={
                    "max-w-[85%] rounded-2xl px-3 py-2 text-sm " +
                    (mine
                      ? "bg-accent text-white"
                      : "bg-surface-raised text-ink")
                  }
                >
                  {m.subject ? (
                    <p className="m-0 font-semibold">{m.subject}</p>
                  ) : null}
                  <p className="m-0 whitespace-pre-wrap break-words">{m.body}</p>
                  <p
                    className={
                      "m-0 mt-1 text-[10px] " +
                      (mine ? "text-white/70" : "text-ink-muted")
                    }
                  >
                    {m.fromName || (m.senderRole === "teacher" ? t.lehrkraft : pupilName)}
                    {" · "}
                    {zeitpunkt(m.createdAt, sprache)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="flex items-end gap-2">
        <label htmlFor={`lw-msg-${pupilUid}`} className="sr-only">
          {t.schreiben}
        </label>
        <textarea
          id={`lw-msg-${pupilUid}`}
          ref={composeRef}
          className="min-h-[2.5rem] flex-1 resize-y rounded-lg border border-hairline bg-surface-raised px-3 py-2 text-sm text-ink"
          rows={2}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            // Strg/Cmd + Enter sendet (Enter allein erlaubt Zeilenumbrüche).
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.preventDefault();
              void send();
            }
          }}
          placeholder={myRole === "teacher" ? t.anKind(pupilName) : t.anLehrkraft}
        />
        {/*
          ★ R5 (Fokus-Pflicht, FOKUSZIELE-TASTENFLOW.md §0.5, 28.08.2026):
          `aria-disabled` statt `disabled`. Der Knopf bleibt damit Tabstopp -
          er ist auch bei leerem Feld auffindbar und sagt dann, was fehlt -,
          und er kann sich beim Senden nicht unter dem eigenen Fokus wegziehen.
          `aria-disabled:opacity-40` hält das Aussehen unverändert; die Sperre
          selbst steckt in `send()`.
        */}
        <button
          type="button"
          className="btn-primary aria-disabled:opacity-40"
          onClick={() => void send()}
          aria-disabled={busy || !draft.trim()}
        >
          {t.senden}
        </button>
      </div>

      {/* Die höfliche Ansage (Dateikopf): sie spricht in allen vier Programmen
          und geht genauso auf die Braillezeile. */}
      <p role="status" aria-live="polite" className="sr-only">
        {ansage}
      </p>
      {fehler ? (
        <p role="alert" className="m-0 rounded-lg bg-danger-soft p-2 text-sm text-ink">
          {fehler}
        </p>
      ) : null}
    </div>
  );
}
