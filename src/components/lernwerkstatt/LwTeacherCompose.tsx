import { useRef, useState } from "react";
import { Modal } from "@/components/Modal";
import { Tipp } from "@/components/Tipp";
import { Icon } from "@/components/Icon";
import { lwMessages } from "@/lib/lernwerkstatt/messages";
import { LwMessageThread } from "./LwMessageThread";
import { mehrzahl, texte, useBedienSprache } from "@/lib/bedienSprache";

/**
 * Einstiegspunkte für die LEHRKRAFT, aus der Klassen-Übersicht heraus
 * Nachrichten zu schreiben (Gegenstück zur Glocke, die eingehende Antworten
 * zeigt). Zwei Knöpfe:
 *  • LwPupilMessageButton — Gespräch mit EINEM Kind (lesen + schreiben).
 *  • LwClassMessageButton — eine Nachricht an ALLE Kinder der Klasse (je Kind
 *    ein eigenes, privates Gespräch; die Kinder sehen sich gegenseitig nicht).
 * Memory: project_lernwerkstatt_unified.
 *
 * ── KEIN `disabled` MEHR (28.08.2026, FOKUSZIELE-TASTENFLOW.md §0.5) ───────
 * Hier standen zwei gesperrte Knöpfe, und beide waren aus demselben Grund
 * falsch (Regel R5):
 *
 *  • „Nachricht an die Klasse" war gesperrt, solange die Klasse leer ist. Der
 *    Knopf war damit nicht im Tab-Weg - wer den Bildschirm nicht sieht, sucht
 *    ihn vergeblich und erfährt nirgends, woran es liegt. Dazu kommt: Die
 *    Kinderliste wird von „Meine Klassen" NACHGELADEN
 *    (`MeineKlassePage.tsx`, `listPupils`), sie kann sich also ändern, während
 *    der Fokus schon auf dem Knopf steht. Eine begründete Ausnahme
 *    (`disabled-ok:`) käme darum nicht in Frage - die gilt nur für Elemente,
 *    die von ANFANG AN gesperrt sind und es nie erst unter dem Fokus werden.
 *  • „An alle senden" sperrte sich im Augenblick der Betätigung selbst; der
 *    Fokus fiel auf `body`, und die Braillezeile stand im Nichts, genau
 *    während auf den Server gewartet wird.
 *
 * Beide tragen jetzt `aria-disabled` (samt `aria-disabled:opacity-40`, damit
 * es sichtbar dasselbe bleibt), die Sperre steckt im Handler, und jede
 * Betätigung bekommt eine Antwort in einer höflichen Live-Region. Anrede
 * „Sie" (K21) - dieser Baustein ist reine Lehrkraft-Oberfläche; einzige
 * Ausnahme ist der Satz „Bitte erst eine Nachricht schreiben.", der wörtlich
 * so auch im gemeinsamen Gesprächs-Fenster steht (§0.5) und darum
 * anrede-frei bleibt.
 */

/**
 * ★ EN6b (19.09.2026): die Texte der beiden Schreib-Wege der Lehrkraft in
 * beiden Bedienungssprachen - GEMEINSAMER TEIL (auch Punktgenau und
 * Klangpunkte), englisch nur über den Anbieter; die anderen Programme bleiben
 * Zeichen für Zeichen deutsch. Glossar §3.8: *Message to the class*, Kind ⇒
 * *pupil*; im Satz an die Lehrkraft plain *you*.
 * ★ Bis 19.09.2026 stand hier „kann dir dort antworten" - Johannes: „Lehrer
 * mit Sie ansprechen und Schüler und Selbstlernende mit du". Seither „Ihnen".
 */
const T = texte({
  de: {
    kindTipp: (name: string) => `Nachrichten mit ${name} - ein privates Gespräch, ${name} kann antworten.`,
    anKind: (name: string) => `Nachricht an ${name}`,
    nachricht: "Nachricht",
    // ⚠️ Mit führendem Leerzeichen: hinter dem ✉-Zeichen stand EIN Textknoten
    // „ Nachricht" - so bleibt es, auch in der Zahl der Textknoten.
    knopfNachricht: " Nachricht",
    mitKind: (name: string) => `Nachrichten mit ${name}`,
    keineLernenden:
      "Diese Klasse hat noch keine Lernenden. Bitte legen Sie zuerst " +
      "Konten an - danach können Sie allen gemeinsam schreiben.",
    wirdGesendet: "Wird gesendet …",
    nochKeine: "Diese Klasse hat noch keine Lernenden.",
    ersteSchreiben: "Bitte erst eine Nachricht schreiben.",
    anAlle: (n: number) => `An alle ${n} Lernenden gesendet.`,
    anEinige: (ok: number, von: number) => `An ${ok} von ${von} Lernenden gesendet.`,
    klasseTipp:
      "Eine Nachricht an alle Lernenden dieser Klasse - jedes Kind bekommt sie in einem eigenen Gespräch.",
    knopfKlasse: " Nachricht an die Klasse",
    titel: (n: number) => `Nachricht an die Klasse (${n} Lernende)`,
    jedesKind:
      "Jedes Kind bekommt die Nachricht in einem eigenen, privaten Gespräch und kann Ihnen dort antworten.",
    betreff: "Betreff (optional)",
    liebeKlasse: "Liebe Klasse, …",
    schliessen: "Schließen",
    sendet: "Senden …",
    anAlleSenden: "An alle senden",
  },
  en: {
    kindTipp: (name: string) =>
      `Messages with ${name} - a private conversation; ${name} can reply.`,
    anKind: (name: string) => `Message to ${name}`,
    nachricht: "Message",
    knopfNachricht: " Message",
    mitKind: (name: string) => `Messages with ${name}`,
    keineLernenden:
      "This class has no pupils yet. Please add some pupils first - then you " +
      "can write to all of them at once.",
    wirdGesendet: "Sending …",
    nochKeine: "This class has no pupils yet.",
    ersteSchreiben: "Please write a message first.",
    anAlle: (n: number) =>
      mehrzahl(n, "en", { one: () => "Sent to the pupil.", other: (z) => `Sent to all ${z} pupils.` }),
    anEinige: (ok: number, von: number) =>
      mehrzahl(von, "en", {
        one: (z) => `Sent to ${ok} of ${z} pupil.`,
        other: (z) => `Sent to ${ok} of ${z} pupils.`,
      }),
    klasseTipp:
      "One message to all the pupils in this class - each pupil gets it in a conversation of their own.",
    knopfKlasse: " Message to the class",
    titel: (n: number) =>
      mehrzahl(n, "en", {
        one: (z) => `Message to the class (${z} pupil)`,
        other: (z) => `Message to the class (${z} pupils)`,
      }),
    jedesKind:
      "Each pupil gets the message in a private conversation of their own and can reply to you there.",
    betreff: "Subject (optional)",
    liebeKlasse: "Hello everyone, …",
    schliessen: "Close",
    sendet: "Sending …",
    anAlleSenden: "Send to all",
  },
  fr: {
    kindTipp: (name: string) => `Messages avec ${name} - une conversation privée, ${name} peut répondre.`,
    anKind: (name: string) => `Message à ${name}`,
    nachricht: "Message",
    knopfNachricht: " Message",
    mitKind: (name: string) => `Messages avec ${name}`,
    keineLernenden:
      "Cette classe n'a pas encore d'élèves. Merci de créer d'abord des " +
      "comptes - vous pourrez ensuite écrire à tout le monde à la fois.",
    wirdGesendet: "Envoi en cours …",
    nochKeine: "Cette classe n'a pas encore d'élèves.",
    ersteSchreiben: "Merci d'écrire d'abord un message.",
    anAlle: (n: number) =>
      mehrzahl(n, "fr", { one: () => "Envoyé à l'élève.", other: (z) => `Envoyé aux ${z} élèves.` }),
    anEinige: (ok: number, von: number) =>
      mehrzahl(von, "fr", {
        one: (z) => `Envoyé à ${ok} sur ${z} élève.`,
        other: (z) => `Envoyé à ${ok} sur ${z} élèves.`,
      }),
    klasseTipp:
      "Un message à tous les élèves de cette classe - chaque élève le reçoit dans sa propre conversation.",
    knopfKlasse: " Message à la classe",
    titel: (n: number) =>
      mehrzahl(n, "fr", {
        one: (z) => `Message à la classe (${z} élève)`,
        other: (z) => `Message à la classe (${z} élèves)`,
      }),
    jedesKind:
      "Chaque élève reçoit le message dans une conversation privée qui lui est propre et peut vous y répondre.",
    betreff: "Objet (facultatif)",
    liebeKlasse: "Bonjour à toutes et à tous, …",
    schliessen: "Fermer",
    sendet: "Envoi en cours …",
    anAlleSenden: "Envoyer à tous",
  },
  // ★ ES-O (27.09.2026): liest nur die Lehrkraft - usted; „estudiante" ist
  // schon geschlechtsneutral (Bauplan S10).
  es: {
    kindTipp: (name: string) => `Mensajes con ${name} - una conversación privada, ${name} puede responder.`,
    anKind: (name: string) => `Mensaje para ${name}`,
    nachricht: "Mensaje",
    knopfNachricht: " Mensaje",
    mitKind: (name: string) => `Mensajes con ${name}`,
    keineLernenden:
      "Esta clase todavía no tiene estudiantes. Cree primero las " +
      "cuentas; después podrá escribir a toda la clase a la vez.",
    wirdGesendet: "Enviando …",
    nochKeine: "Esta clase todavía no tiene estudiantes.",
    ersteSchreiben: "Escriba primero un mensaje, por favor.",
    anAlle: (n: number) =>
      mehrzahl(n, "es", { one: (z) => `Enviado a ${z} estudiante.`, other: (z) => `Enviado a los ${z} estudiantes.` }),
    anEinige: (ok: number, von: number) =>
      mehrzahl(von, "es", {
        one: (z) => `Enviado a ${ok} de ${z} estudiante.`,
        other: (z) => `Enviado a ${ok} de ${z} estudiantes.`,
      }),
    klasseTipp:
      "Un mensaje para todo el alumnado de esta clase - cada estudiante lo recibe en su propia conversación.",
    knopfKlasse: " Mensaje a la clase",
    titel: (n: number) =>
      mehrzahl(n, "es", {
        one: (z) => `Mensaje a la clase (${z} estudiante)`,
        other: (z) => `Mensaje a la clase (${z} estudiantes)`,
      }),
    jedesKind:
      "Cada estudiante recibe el mensaje en su propia conversación privada y puede responderle allí.",
    betreff: "Asunto (opcional)",
    liebeKlasse: "Hola a todo el mundo, …",
    schliessen: "Cerrar",
    sendet: "Enviando …",
    anAlleSenden: "Enviar a todos",
  },
  // ★ O-IT (02.10.2026): „alunni" als Sammelwort, die einzelne „persona" (Regel 2).
  it: {
    kindTipp: (name: string) => `Messaggi con ${name} - una conversazione privata, ${name} può rispondere.`,
    anKind: (name: string) => `Messaggio per ${name}`,
    nachricht: "Messaggio",
    knopfNachricht: " Messaggio",
    mitKind: (name: string) => `Messaggi con ${name}`,
    keineLernenden:
      "Questa classe non ha ancora alunni. Prima si creano gli " +
      "account; poi si può scrivere a tutta la classe in una volta.",
    wirdGesendet: "Invio in corso...",
    nochKeine: "Questa classe non ha ancora alunni.",
    ersteSchreiben: "Prima scrivere un messaggio.",
    anAlle: (n: number) =>
      mehrzahl(n, "it", { one: (z) => `Inviato a ${z} persona.`, other: (z) => `Inviato a tutti i ${z} alunni.` }),
    anEinige: (ok: number, von: number) => `Inviato: ${ok} su ${von}.`,
    klasseTipp:
      "Un messaggio per tutti gli alunni di questa classe - ogni persona lo riceve nella propria conversazione.",
    knopfKlasse: " Messaggio alla classe",
    titel: (n: number) =>
      mehrzahl(n, "it", {
        one: (z) => `Messaggio alla classe (${z} persona)`,
        other: (z) => `Messaggio alla classe (${z} alunni)`,
      }),
    jedesKind:
      "Ogni persona riceve il messaggio nella propria conversazione privata e può rispondere lì.",
    betreff: "Oggetto (facoltativo)",
    liebeKlasse: "Cara classe, ...",
    schliessen: "Chiudi",
    sendet: "Invio in corso...",
    anAlleSenden: "Invia a tutta la classe",
  },
  // ★ O-PL (02.10.2026): Lehrkraft ty-Form (Glossar Regel 1); Kinder als
  // „osoba"/„uczniowie", Mehrzahl mit allen vier Formen; Namen nach Doppelpunkt.
  pl: {
    kindTipp: (name: string) => `Wiadomości - prywatna rozmowa, odpowiedzieć może: ${name}.`,
    anKind: (name: string) => `Wiadomość do: ${name}`,
    nachricht: "Wiadomość",
    knopfNachricht: " Wiadomość",
    mitKind: (name: string) => `Wiadomości: ${name}`,
    keineLernenden:
      "Ta klasa nie ma jeszcze uczniów. Najpierw załóż konta - " +
      "potem możesz napisać do wszystkich naraz.",
    wirdGesendet: "Wysyłanie...",
    nochKeine: "Ta klasa nie ma jeszcze uczniów.",
    ersteSchreiben: "Najpierw napisz wiadomość.",
    anAlle: (n: number) =>
      mehrzahl(n, "pl", {
        one: (z) => `Wysłano do ${z} osoby.`,
        few: (z) => `Wysłano do wszystkich ${z} osób.`,
        many: (z) => `Wysłano do wszystkich ${z} osób.`,
        other: (z) => `Wysłano do ${z} osoby.`,
      }),
    anEinige: (ok: number, von: number) => `Wysłano: ${ok} z ${von}.`,
    klasseTipp:
      "Wiadomość do wszystkich uczniów tej klasy - każda osoba dostaje ją we własnej rozmowie.",
    knopfKlasse: " Wiadomość do klasy",
    titel: (n: number) =>
      mehrzahl(n, "pl", {
        one: (z) => `Wiadomość do klasy (${z} osoba)`,
        few: (z) => `Wiadomość do klasy (${z} osoby)`,
        many: (z) => `Wiadomość do klasy (${z} osób)`,
        other: (z) => `Wiadomość do klasy (${z} osoby)`,
      }),
    jedesKind:
      "Każda osoba dostaje wiadomość we własnej, prywatnej rozmowie i może tam odpowiedzieć.",
    betreff: "Temat (nieobowiązkowo)",
    liebeKlasse: "Droga klaso, ...",
    schliessen: "Zamknij",
    sendet: "Wysyłanie...",
    anAlleSenden: "Wyślij do wszystkich",
  },
  // ★ O-TR (02.10.2026): Lehrkraft "siz" mit -(y)In (Glossar Regel 1); Kind =
  // "öğrenci", Einzahl nach der Zahl ("12 öğrenci"); Name vor "ile"/"için".
  tr: {
    kindTipp: (name: string) => `${name} ile mesajlar - özel bir konuşma; öğrenci yanıt verebilir.`,
    anKind: (name: string) => `${name} için mesaj`,
    nachricht: "Mesaj",
    knopfNachricht: " Mesaj",
    mitKind: (name: string) => `${name} ile mesajlar`,
    keineLernenden:
      "Bu sınıfta henüz öğrenci yok. Lütfen önce hesapları oluşturun - " +
      "ardından herkese birlikte yazabilirsiniz.",
    wirdGesendet: "Gönderiliyor...",
    nochKeine: "Bu sınıfta henüz öğrenci yok.",
    ersteSchreiben: "Önce bir mesaj yazmak gerekiyor.",
    anAlle: (n: number) => `${n} öğrencinin tümüne gönderildi.`,
    anEinige: (ok: number, von: number) => `${ok} öğrenciye gönderildi (toplam ${von} öğrenci).`,
    klasseTipp:
      "Bu sınıftaki tüm öğrencilere bir mesaj - her öğrenci mesajı kendi konuşmasında alır.",
    knopfKlasse: " Sınıfa mesaj",
    titel: (n: number) => `Sınıfa mesaj (${n} öğrenci)`,
    jedesKind:
      "Her öğrenci mesajı kendi özel konuşmasında alır ve size oradan yanıt verebilir.",
    betreff: "Konu (isteğe bağlı)",
    liebeKlasse: "Sevgili öğrenciler, ...",
    schliessen: "Kapat",
    sendet: "Gönderiliyor...",
    anAlleSenden: "Herkese gönder",
  },
  // ★ O-CS (03.10.2026): Lehrkraft "vy" in der Mehrzahlform (Glossar Regel 1); ein
  // Kind = "osoba", die Klasse = "žáci" (§2.5); Mehrzahl mit vier Formen (§2.11);
  // Namen nur nach Doppelpunkt (Regel 12); Zähler mit Schrägstrich (Regel 13).
  cs: {
    kindTipp: (name: string) => `Zprávy: ${name} - soukromá konverzace s možností odpovědi.`,
    anKind: (name: string) => `Zpráva - příjemce: ${name}`,
    nachricht: "Zpráva",
    knopfNachricht: " Zpráva",
    mitKind: (name: string) => `Zprávy: ${name}`,
    keineLernenden:
      "Tato třída zatím nemá žádné žáky. Nejdřív prosím vytvořte účty - " +
      "potom můžete napsat všem najednou.",
    wirdGesendet: "Odesílání...",
    nochKeine: "Tato třída zatím nemá žádné žáky.",
    ersteSchreiben: "Nejdřív prosím napište zprávu.",
    anAlle: (n: number) =>
      mehrzahl(n, "cs", {
        one: (z) => `Odesláno: ${z} osoba.`,
        few: (z) => `Odesláno všem: ${z} osoby.`,
        many: (z) => `Odesláno všem: ${z} osoby.`,
        other: (z) => `Odesláno všem: ${z} osob.`,
      }),
    anEinige: (ok: number, von: number) => `Odesláno: ${ok}/${von}`,
    klasseTipp:
      "Zpráva všem žákům této třídy - každá osoba ji dostane ve vlastní konverzaci.",
    knopfKlasse: " Zpráva pro třídu",
    titel: (n: number) =>
      mehrzahl(n, "cs", {
        one: (z) => `Zpráva pro třídu (${z} osoba)`,
        few: (z) => `Zpráva pro třídu (${z} osoby)`,
        many: (z) => `Zpráva pro třídu (${z} osoby)`,
        other: (z) => `Zpráva pro třídu (${z} osob)`,
      }),
    jedesKind:
      "Každá osoba dostane zprávu ve vlastní soukromé konverzaci a může vám tam odpovědět.",
    betreff: "Předmět zprávy (nepovinné)",
    liebeKlasse: "Milá třído, ...",
    schliessen: "Zavřít",
    sendet: "Odesílání...",
    anAlleSenden: "Odeslat všem",
  },
  bg: {
    kindTipp: (name: string) => `Съобщения: ${name} - личен разговор с възможност за отговор.`,
    anKind: (name: string) => `Съобщение до: ${name}`,
    nachricht: "Съобщение",
    knopfNachricht: " Съобщение",
    mitKind: (name: string) => `Съобщения: ${name}`,
    keineLernenden:
      "В този клас все още няма ученици. Първо добавете ученици - " +
      "след това можете да пишете на всички наведнъж.",
    wirdGesendet: "Изпращане...",
    nochKeine: "В този клас все още няма ученици.",
    ersteSchreiben: "Първо напишете съобщение.",
    anAlle: (n: number) =>
      mehrzahl(n, "bg", {
        one: (z) => `Изпратено: ${z} ученик.`,
        other: (z) => `Изпратено до всички: ${z} ученици.`,
      }),
    anEinige: (ok: number, von: number) => `Изпратено: ${ok}/${von}`,
    klasseTipp:
      "Съобщение до всички ученици в този клас - всеки ученик го получава в отделен разговор.",
    knopfKlasse: " Съобщение до класа",
    titel: (n: number) =>
      mehrzahl(n, "bg", {
        one: (z) => `Съобщение до класа (${z} ученик)`,
        other: (z) => `Съобщение до класа (${z} ученици)`,
      }),
    jedesKind:
      "Всеки ученик получава съобщението в отделен личен разговор и може да ви отговори там.",
    betreff: "Тема (по желание)",
    liebeKlasse: "Здравейте, ...",
    schliessen: "Затвори",
    sendet: "Изпращане...",
    anAlleSenden: "Изпрати до всички",
  },
  el: {
    kindTipp: (name: string) => `Μηνύματα: ${name} - ιδιωτική συνομιλία με δυνατότητα απάντησης.`,
    anKind: (name: string) => `Μήνυμα - παραλήπτης: ${name}`,
    nachricht: "Μήνυμα",
    knopfNachricht: " Μήνυμα",
    mitKind: (name: string) => `Μηνύματα: ${name}`,
    keineLernenden:
      "Αυτό το τμήμα δεν έχει ακόμα μαθητές. Δημιουργήστε πρώτα λογαριασμούς - " +
      "μετά μπορείτε να γράψετε σε όλους μαζί.",
    wirdGesendet: "Αποστολή...",
    nochKeine: "Αυτό το τμήμα δεν έχει ακόμα μαθητές.",
    ersteSchreiben: "Γράψτε πρώτα ένα μήνυμα.",
    anAlle: (n: number) =>
      mehrzahl(n, "el", {
        one: (z) => `Στάλθηκε σε ${z} άτομο.`,
        other: (z) => `Στάλθηκε σε όλα τα άτομα: ${z}.`,
      }),
    anEinige: (ok: number, von: number) => `Στάλθηκε: ${ok} από ${von}`,
    klasseTipp:
      "Ένα μήνυμα σε όλους τους μαθητές αυτού του τμήματος - κάθε παιδί το παίρνει σε δική του συνομιλία.",
    knopfKlasse: " Μήνυμα στο τμήμα",
    titel: (n: number) =>
      mehrzahl(n, "el", {
        one: (z) => `Μήνυμα στο τμήμα (${z} άτομο)`,
        other: (z) => `Μήνυμα στο τμήμα (${z} άτομα)`,
      }),
    jedesKind:
      "Κάθε παιδί παίρνει το μήνυμα σε δική του ιδιωτική συνομιλία και μπορεί να σας απαντήσει εκεί.",
    betreff: "Θέμα (προαιρετικό)",
    liebeKlasse: "Γεια σας, ...",
    schliessen: "Κλείσιμο",
    sendet: "Αποστολή...",
    anAlleSenden: "Αποστολή σε όλους",
  },
  hu: {
    kindTipp: (name: string) => `Üzenetek: ${name} - privát beszélgetés, válaszolni is lehet.`,
    anKind: (name: string) => `Üzenet - címzett: ${name}`,
    nachricht: "Üzenet",
    knopfNachricht: " Üzenet",
    mitKind: (name: string) => `Üzenetek: ${name}`,
    keineLernenden:
      "Ebben az osztályban még nincsenek tanulók. Először hozzon létre fiókokat - " +
      "utána mindenkinek egyszerre írhat.",
    wirdGesendet: "Küldés...",
    nochKeine: "Ebben az osztályban még nincsenek tanulók.",
    ersteSchreiben: "Előbb írjon egy üzenetet.",
    anAlle: (n: number) =>
      mehrzahl(n, "hu", {
        one: (z) => `Elküldve: ${z} tanuló.`,
        other: (z) => `Elküldve mindenkinek: ${z} tanuló.`,
      }),
    anEinige: (ok: number, von: number) => `Elküldve: ${ok}/${von}`,
    klasseTipp:
      "Üzenet az osztály minden tanulójának - mindenki saját beszélgetésben kapja meg.",
    knopfKlasse: " Üzenet az osztálynak",
    titel: (n: number) =>
      mehrzahl(n, "hu", {
        one: (z) => `Üzenet az osztálynak (${z} tanuló)`,
        other: (z) => `Üzenet az osztálynak (${z} tanuló)`,
      }),
    jedesKind:
      "Minden tanuló saját, privát beszélgetésben kapja meg az üzenetet, és ott válaszolhat is.",
    betreff: "Tárgy (nem kötelező)",
    liebeKlasse: "Kedves osztály! ...",
    schliessen: "Bezárás",
    sendet: "Küldés...",
    anAlleSenden: "Küldés mindenkinek",
  },
  nl: {
    kindTipp: (name: string) => `Berichten met ${name} - een privégesprek, ${name} kan antwoorden.`,
    anKind: (name: string) => `Bericht aan ${name}`,
    nachricht: "Bericht",
    knopfNachricht: " Bericht",
    mitKind: (name: string) => `Berichten met ${name}`,
    keineLernenden:
      "Deze klas heeft nog geen leerlingen. Maak eerst accounts aan - " +
      "daarna kun je iedereen tegelijk schrijven.",
    wirdGesendet: "Wordt verzonden...",
    nochKeine: "Deze klas heeft nog geen leerlingen.",
    ersteSchreiben: "Schrijf eerst een bericht.",
    anAlle: (n: number) =>
      mehrzahl(n, "nl", {
        one: () => "Verzonden naar de leerling.",
        other: (z) => `Verzonden naar alle ${z} leerlingen.`,
      }),
    anEinige: (ok: number, von: number) =>
      mehrzahl(von, "nl", {
        one: (z) => `Verzonden naar ${ok} van ${z} leerling.`,
        other: (z) => `Verzonden naar ${ok} van de ${z} leerlingen.`,
      }),
    klasseTipp:
      "Eén bericht aan alle leerlingen van deze klas - elke leerling krijgt het in een eigen gesprek.",
    knopfKlasse: " Bericht aan de klas",
    titel: (n: number) =>
      mehrzahl(n, "nl", {
        one: (z) => `Bericht aan de klas (${z} leerling)`,
        other: (z) => `Bericht aan de klas (${z} leerlingen)`,
      }),
    jedesKind:
      "Elke leerling krijgt het bericht in een eigen privégesprek en kan je daar antwoorden.",
    betreff: "Onderwerp (optioneel)",
    liebeKlasse: "Hallo allemaal, ...",
    schliessen: "Sluiten",
    sendet: "Wordt verzonden...",
    anAlleSenden: "Naar iedereen verzenden",
  },
  pt: {
    kindTipp: (name: string) => `Mensagens: ${name} - uma conversa privada, com possibilidade de resposta.`,
    anKind: (name: string) => `Mensagem para: ${name}`,
    nachricht: "Mensagem",
    knopfNachricht: " Mensagem",
    mitKind: (name: string) => `Mensagens: ${name}`,
    keineLernenden:
      "Esta turma ainda não tem estudantes. Crie primeiro as contas - " +
      "depois poderá escrever a todas as pessoas de uma só vez.",
    wirdGesendet: "A enviar...",
    nochKeine: "Esta turma ainda não tem estudantes.",
    ersteSchreiben: "Primeiro escreva uma mensagem.",
    anAlle: (n: number) =>
      mehrzahl(n, "pt", {
        one: (z) => `Enviada a ${z} pessoa.`,
        other: (z) => `Enviada a ${z} pessoas.`,
        many: (z) => `Enviada a ${z} de pessoas.`,
      }),
    anEinige: (ok: number, von: number) => `Enviada: ${ok} de ${von}.`,
    klasseTipp:
      "Uma mensagem para todas as pessoas desta turma - cada pessoa recebe-a numa conversa própria.",
    knopfKlasse: " Mensagem para a turma",
    titel: (n: number) =>
      mehrzahl(n, "pt", {
        one: (z) => `Mensagem para a turma (${z} pessoa)`,
        other: (z) => `Mensagem para a turma (${z} pessoas)`,
        many: (z) => `Mensagem para a turma (${z} de pessoas)`,
      }),
    jedesKind:
      "Cada pessoa recebe a mensagem numa conversa própria e privada e pode responder-lhe aí.",
    betreff: "Assunto (opcional)",
    liebeKlasse: "Cara turma, ...",
    schliessen: "Fechar",
    sendet: "A enviar...",
    anAlleSenden: "Enviar a toda a turma",
  },
  br: {
    kindTipp: (name: string) => `Mensagens: ${name} - uma conversa privada, com possibilidade de resposta.`,
    anKind: (name: string) => `Mensagem para: ${name}`,
    nachricht: "Mensagem",
    knopfNachricht: " Mensagem",
    mitKind: (name: string) => `Mensagens: ${name}`,
    keineLernenden:
      "Esta turma ainda não tem estudantes. Crie as contas primeiro - " +
      "depois você pode escrever para todas as pessoas de uma vez.",
    wirdGesendet: "Enviando...",
    nochKeine: "Esta turma ainda não tem estudantes.",
    ersteSchreiben: "Escreva uma mensagem primeiro.",
    anAlle: (n: number) =>
      mehrzahl(n, "br", {
        one: (z) => `Mensagem enviada para ${z} pessoa.`,
        other: (z) => `Mensagem enviada para todas as ${z} pessoas.`,
      }),
    anEinige: (ok: number, von: number) => `Mensagens enviadas: ${ok}/${von}`,
    klasseTipp:
      "Uma mensagem para todas as pessoas desta turma - cada pessoa a recebe em uma conversa própria.",
    knopfKlasse: " Mensagem para a turma",
    titel: (n: number) =>
      n === 0
        ? "Mensagem para a turma"
        : mehrzahl(n, "br", {
            one: (z) => `Mensagem para a turma (${z} pessoa)`,
            other: (z) => `Mensagem para a turma (${z} pessoas)`,
          }),
    jedesKind:
      "Cada pessoa recebe a mensagem em uma conversa própria e privada e pode responder para você ali.",
    betreff: "Assunto (opcional)",
    liebeKlasse: "Olá, turma, ...",
    schliessen: "Fechar",
    sendet: "Enviando...",
    anAlleSenden: "Enviar para todas as pessoas",
  },
  ro: {
    kindTipp: (name: string) => `Mesaje: ${name} - conversație privată, cu posibilitate de răspuns.`,
    anKind: (name: string) => `Mesaj pentru: ${name}`,
    nachricht: "Mesaj",
    knopfNachricht: " Mesaj",
    mitKind: (name: string) => `Mesaje: ${name}`,
    keineLernenden:
      "Această clasă nu are încă elevi. Mai întâi creați conturile - " +
      "apoi puteți scrie tuturor deodată.",
    wirdGesendet: "Se trimite...",
    nochKeine: "Această clasă nu are încă elevi.",
    ersteSchreiben: "Mai întâi scrieți un mesaj.",
    anAlle: (n: number) =>
      mehrzahl(n, "ro", {
        one: (z) => `Trimis: ${z} persoană.`,
        few: (z) => `Trimis tuturor: ${z} persoane.`,
        other: (z) => `Trimis tuturor: ${z} de persoane.`,
      }),
    anEinige: (ok: number, von: number) => `Trimis: ${ok}/${von}`,
    klasseTipp:
      "Un mesaj pentru toți elevii acestei clase - fiecare persoană îl primește într-o conversație proprie.",
    knopfKlasse: " Mesaj pentru clasă",
    titel: (n: number) =>
      mehrzahl(n, "ro", {
        one: (z) => `Mesaj pentru clasă (${z} persoană)`,
        few: (z) => `Mesaj pentru clasă (${z} persoane)`,
        other: (z) => `Mesaj pentru clasă (${z} de persoane)`,
      }),
    jedesKind:
      "Fiecare persoană primește mesajul într-o conversație proprie, privată, și vă poate răspunde acolo.",
    betreff: "Subiect (opțional)",
    liebeKlasse: "Dragă clasă, ...",
    schliessen: "Închideți",
    sendet: "Se trimite...",
    anAlleSenden: "Trimiteți tuturor",
  },
  sv: {
    kindTipp: (name: string) => `Meddelanden med ${name} - ett privat samtal, ${name} kan svara.`,
    anKind: (name: string) => `Meddelande till ${name}`,
    nachricht: "Meddelande",
    knopfNachricht: " Meddelande",
    mitKind: (name: string) => `Meddelanden med ${name}`,
    keineLernenden:
      "Den här klassen har inga elever än. Lägg till elever först - " +
      "sedan kan du skriva till alla på en gång.",
    wirdGesendet: "Skickar...",
    nochKeine: "Den här klassen har inga elever än.",
    ersteSchreiben: "Skriv ett meddelande först.",
    anAlle: (n: number) =>
      mehrzahl(n, "sv", {
        one: () => "Skickat till eleven.",
        other: (z) => `Skickat till alla ${z} elever.`,
      }),
    anEinige: (ok: number, von: number) => `Skickat: ${ok}/${von}`,
    klasseTipp:
      "Ett meddelande till alla elever i klassen - varje elev får det i ett eget samtal.",
    knopfKlasse: " Meddelande till klassen",
    titel: (n: number) =>
      mehrzahl(n, "sv", {
        one: (z) => `Meddelande till klassen (${z} elev)`,
        other: (z) => `Meddelande till klassen (${z} elever)`,
      }),
    jedesKind:
      "Varje elev får meddelandet i ett eget, privat samtal och kan svara dig där.",
    betreff: "Ämnesrad (valfritt)",
    liebeKlasse: "Hej alla, ...",
    schliessen: "Stäng",
    sendet: "Skickar...",
    anAlleSenden: "Skicka till alla",
  },
  uk: {
    kindTipp: (name: string) => `Повідомлення: ${name} - приватна розмова з можливістю відповіді.`,
    anKind: (name: string) => `Повідомлення - кому: ${name}`,
    nachricht: "Повідомлення",
    knopfNachricht: " Повідомлення",
    mitKind: (name: string) => `Повідомлення: ${name}`,
    keineLernenden:
      "У цьому класі ще немає учнів. Спочатку створіть облікові записи - " +
      "потім зможете написати всім одразу.",
    wirdGesendet: "Надсилання...",
    nochKeine: "У цьому класі ще немає учнів.",
    ersteSchreiben: "Спочатку напишіть повідомлення.",
    anAlle: (n: number) =>
      mehrzahl(n, "uk", {
        one: (z) => `Надіслано: ${z} особа.`,
        few: (z) => `Надіслано всім: ${z} особи.`,
        many: (z) => `Надіслано всім: ${z} осіб.`,
        other: (z) => `Надіслано всім: ${z} особи.`,
      }),
    anEinige: (ok: number, von: number) => `Надіслано: ${ok}/${von}`,
    klasseTipp:
      "Повідомлення всім учням цього класу - кожна дитина отримає його в окремій розмові.",
    knopfKlasse: " Повідомлення класу",
    titel: (n: number) =>
      mehrzahl(n, "uk", {
        one: (z) => `Повідомлення класу (${z} особа)`,
        few: (z) => `Повідомлення класу (${z} особи)`,
        many: (z) => `Повідомлення класу (${z} осіб)`,
        other: (z) => `Повідомлення класу (${z} особи)`,
      }),
    jedesKind:
      "Кожна дитина отримає повідомлення в окремій приватній розмові й зможе вам там відповісти.",
    betreff: "Тема (необов'язково)",
    liebeKlasse: "Дорогий класе, ...",
    schliessen: "Закрити",
    sendet: "Надсилання...",
    anAlleSenden: "Надіслати всім",
  },
});

/** Glocken-Knopf bei einem Kind → öffnet das Gespräch (Verlauf + Antwortfeld).
 *  `iconOnly` zeigt nur das Glocken-Symbol (ohne Text) — für die kompakte
 *  Tabellenspalte direkt neben dem Namen. */
export function LwPupilMessageButton({
  pupilId,
  pupilName,
  classCode,
  iconOnly = false,
}: {
  pupilId: string;
  pupilName: string;
  classCode: string;
  iconOnly?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { sprache } = useBedienSprache();
  const t = T[sprache];
  return (
    <>
      {/* ★ `Tipp` statt `title` (10.09.2026): groß, sofort, auch beim Fokus. */}
      <Tipp
        text={t.kindTipp(pupilName)}
        ausrichtung="links"
      >
        {(hinweisId) => (
          <button
            type="button"
            className={
              /* ★ 11.09.2026 (`apps/tastenflow/BAUPLAN-2026-09-11-KLASSENSEITE-
                 EINHEITLICH.md`, R1-R3): 36 px, rund, mit Haarlinie - wie die
                 Sinnbild-Knöpfe der Kopfzeile. Vorher 28 px ohne Kante, die
                 kleinste Bedienhöhe der Kinderzeile (Johannes: „ich glaube es
                 gibt 5 verschiedene höhen"). `iconOnly` steht nur in den
                 Klassentabellen von „Meine Klassen". */
              iconOnly
                ? "relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hairline text-ink-soft transition-colors hover:bg-surface-sunken hover:text-ink"
                : "btn-ghost btn-toggle"
            }
            onClick={() => setOpen(true)}
            aria-label={t.anKind(pupilName)}
            aria-describedby={hinweisId}
          >
            {iconOnly
              ? <Icon name="bell" className="h-4 w-4" />
              : <><span aria-hidden="true">✉</span>{t.knopfNachricht}</>}
          </button>
        )}
      </Tipp>
      {open ? (
        <Modal
          title={t.mitKind(pupilName)}
          onClose={() => setOpen(false)}
          size="lg"
        >
          <LwMessageThread
            pupilUid={pupilId}
            pupilName={pupilName}
            classCode={classCode}
          />
        </Modal>
      ) : null}
    </>
  );
}

/** Knopf „Nachricht an die Klasse" → schreibt allen Kindern dieselbe Nachricht. */
export function LwClassMessageButton({
  classCode,
  pupils,
}: {
  classCode: string;
  pupils: { id: string; name: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  /** Höfliche Ansage im Fenster (was fehlt, was gerade läuft). */
  const [ansage, setAnsage] = useState("");
  /** Höfliche Ansage am Öffner, solange das Fenster noch zu ist. */
  const [hinweis, setHinweis] = useState("");
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const { sprache } = useBedienSprache();
  const t = T[sprache];

  /** Fokus ins Nachrichtenfeld, im nächsten Takt (nie `requestAnimationFrame`). */
  function fokusInsFeld() {
    window.setTimeout(() => bodyRef.current?.focus(), 0);
  }

  /**
   * Das Fenster öffnen - oder sagen, warum nicht. Die Sperre, die früher als
   * `disabled` am Knopf hing, steht jetzt hier.
   */
  function oeffne() {
    if (pupils.length === 0) {
      setHinweis(t.keineLernenden);
      return;
    }
    setHinweis("");
    setOpen(true);
  }

  async function sendAll() {
    const text = body.trim();
    if (busy) {
      setAnsage(t.wirdGesendet);
      return;
    }
    if (pupils.length === 0) {
      setAnsage(t.nochKeine);
      return;
    }
    if (!text) {
      setAnsage(t.ersteSchreiben);
      fokusInsFeld();
      return;
    }
    setAnsage(t.wirdGesendet);
    setBusy(true);
    setStatus(null);
    let ok = 0;
    for (const p of pupils) {
      const done = await lwMessages().sendFromTeacher({
        pupilUid: p.id,
        pupilName: p.name,
        classCode,
        body: text,
        subject: subject.trim() || undefined,
      });
      if (done) ok++;
    }
    setBusy(false);
    if (ok === pupils.length) {
      setStatus(t.anAlle(ok));
      setAnsage(t.anAlle(ok));
      setSubject("");
      setBody("");
      // Fokus zurück ins geleerte Feld - von dort geht es weiter.
      fokusInsFeld();
    } else {
      // Teilerfolg: Der Text bleibt stehen, und der Fokus bleibt auf dem
      // Knopf, von dem aus der zweite Versuch unternommen wird.
      setStatus(t.anEinige(ok, pupils.length));
      setAnsage(t.anEinige(ok, pupils.length));
    }
  }

  return (
    <>
      {/* ★ R5: `aria-disabled` statt `disabled` - siehe Dateikopf. */}
      {/* ★ `Tipp` statt `title` (10.09.2026, Johannes: „das schnelle und
          große Mouseover"). */}
      <Tipp text={t.klasseTipp}>
        {(hinweisId) => (
          <button
            type="button"
            // ⚠️ `btn-umriss` (01.09.2026): Ohne Rahmen war dieser Schalter 32 px
            // hoch und stand damit 2 px niedriger als alles andere in der
            // Lehrerübersicht (im Browser gemessen, jsdom sieht es nicht). Der
            // Rahmen macht genau diese 2 px - und lässt ihn zugleich auf dem
            // gleichfarbigen Grund als Bedienelement erkennen.
            className="btn-secondary btn-toggle btn-umriss aria-disabled:opacity-40"
            onClick={oeffne}
            aria-disabled={pupils.length === 0}
            aria-describedby={hinweisId}
          >
            <span aria-hidden="true">✉</span>
            {t.knopfKlasse}
          </button>
        )}
      </Tipp>
      <p role="status" aria-live="polite" className="sr-only">
        {hinweis}
      </p>
      {open ? (
        <Modal
          title={t.titel(pupils.length)}
          onClose={() => setOpen(false)}
          size="lg"
        >
          <div className="space-y-3">
            <p className="text-sm text-ink-muted">{t.jedesKind}</p>
            <div>
              <label className="field-label" htmlFor="lw-class-subj">
                {t.betreff}
              </label>
              <input
                id="lw-class-subj"
                type="text"
                className="w-full rounded-lg border border-hairline bg-surface-raised px-3 py-2 text-sm text-ink"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div>
              <label className="field-label" htmlFor="lw-class-body">
                {t.nachricht}
              </label>
              <textarea
                id="lw-class-body"
                ref={bodyRef}
                className="min-h-[6rem] w-full resize-y rounded-lg border border-hairline bg-surface-raised px-3 py-2 text-sm text-ink"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={t.liebeKlasse}
              />
            </div>
            {status ? (
              <p className="text-sm font-medium text-ink" role="status">
                {status}
              </p>
            ) : null}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setOpen(false)}
              >
                {t.schliessen}
              </button>
              {/* ★ R5: `aria-disabled` statt `disabled` - siehe Dateikopf. */}
              <button
                type="button"
                className="btn-primary aria-disabled:opacity-40"
                onClick={() => void sendAll()}
                aria-disabled={busy || !body.trim()}
              >
                {busy ? t.sendet : t.anAlleSenden}
              </button>
            </div>
            <p role="status" aria-live="polite" className="sr-only">
              {ansage}
            </p>
          </div>
        </Modal>
      ) : null}
    </>
  );
}
