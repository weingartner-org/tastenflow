/**
 * ★★ MELDUNGEN VOM SERVER - auf Englisch, wo sie gezeigt werden
 * (EN2, 19.09.2026).
 *
 * Die Hooks (`pocketbase/pb_hooks/*`) und die Backends (`pbBackend.ts`,
 * `backend.ts`, `account.ts`, `lib/lernwerkstatt/passwort.ts`) antworten
 * DEUTSCH, und die Oberfläche zeigt ihre Sätze wörtlich („E-Mail oder
 * Passwort stimmt nicht."). Die Hooks bleiben, wie sie sind (sie gehören allen
 * Apps, und eine Sprache kennen sie nicht) - übersetzt wird HIER, beim
 * Anzeigen, über eine Tabelle: deutscher Satz ⇒ englischer Satz.
 *
 * ★★★ Was die Tabelle NICHT kennt, bleibt deutsch - und wird in der
 * englischen Bedienung mit `lang="de"` ausgezeichnet (`ServerMeldung.tsx`),
 * damit eine Sprachausgabe es wenigstens richtig ausspricht. Lieber ein
 * richtig gelesener deutscher Satz als ein geratener englischer.
 *
 * ⚠️ Wer einen Hook-Satz ÄNDERT, ändert ihn hier mit - sonst fällt er still
 * auf Deutsch zurück. Der Wächter `tests/tastenflow-englisch-einstellungen.test.tsx`
 * prüft die Sätze, die er kennt, gegen die Quelltexte.
 *
 * Stand EN2: Anmelden, Konto anlegen (Lehrkraft und selbstlernend), Passwort
 * ändern / vergessen / neu setzen, Bestätigungs-Links, Adresswechsel, Konto
 * löschen, Einladung als Co-Lehrkraft, „Melden". Die Meldungen der
 * Klassenverwaltung (Klasse anlegen, Kind verschieben …) ergänzt, wer den
 * Lehrkraft-Bereich übersetzt (EN6/EN9) - in DIESER Tabelle, nicht in einer
 * zweiten.
 *
 * Stand EN6b (19.09.2026): dazu die Sätze, die die Klassenverwaltung aus den
 * BACKENDS zeigt (`pbBackend.ts`, ohne Server `account.ts`) - Klasse anlegen,
 * ändern, löschen, Kind anlegen, Kontakt-E-Mail, Passwort zurücksetzen,
 * Co-Lehrkraft entfernen. Angezeigt über `ServerMeldung` bzw. `serverMeldung()`
 * in `KlasseUndKinder.tsx` (auch in den Gründen des Excel-Imports).
 *
 * Stand EN9 (19.09.2026): ALLE Hook-Meldungen, die die Oberfläche von
 * Tastenflow wörtlich zeigt - Kind verschieben und Klassencode ändern
 * (`tt_klasse_lib.pb.js`), Klasse anlegen (`tt_klasse.pb.js`), Co-Lehrkräfte
 * hinzufügen/entfernen (`tt_coteacher_lib.pb.js`), Klassenmatch ausschreiben
 * (`tt_match.pb.js`). Angezeigt über `ServerMeldung` (Klassenverwaltung,
 * Co-Lehrkräfte) bzw. `serverMeldung()` im Klassenmatch-Haken.
 * ⚠️ Bewusst NICHT hier: Hook-Sätze, die nie bis zur Oberfläche kommen, weil
 * `pbBackend.ts` sie verschluckt (Klassenmatch-Stand, Klassenmatch-Anzahl)
 * oder durch einen eigenen ersetzt (Selbstanmeldung in
 * `tt_pupils_selfsignup.pb.js`).
 *
 * ★ Nachtrag 19.09.2026: Die Klassen-/Kinder-Grenze aus `tt_grenzen.pb.js`
 * stand bis dahin in dieser Ausnahme - `pbBackend.ts` ersetzte JEDEN 400er
 * beim Anlegen blind durch „Diesen Klassencode/Namen gibt es schon", auch
 * wenn in Wahrheit die Grenze (20 Klassen je Konto, 30 Kinder je Klasse)
 * erreicht war und der Code/Name frei gewesen wäre. Seither unterscheidet
 * `createClass`/`addPupil` am Feld (`validation_not_unique` vs. alles
 * andere) und zeigt bei der Grenze die eigene Meldung des Hooks - die beiden
 * Sätze stehen darum jetzt unten in `MUSTER_EN` (mit der Zahl darin).
 */
import type { BedienSprache } from "../bedienSprache/sprache";

/** Feste Sätze: deutsch, wie der Server ihn schickt ⇒ britisches Englisch. */
export const SERVER_MELDUNGEN_EN: Readonly<Record<string, string>> = {
  // --- Anmelden und Konto anlegen ------------------------------------------
  "Bitte einen Namen angeben.": "Please enter a name.",
  "Bitte eine gültige E-Mail angeben.": "Please enter a valid email address.",
  "Für diese E-Mail gibt es schon ein Konto.": "There is already an account with this email address.",
  "Konto konnte nicht erstellt werden. Ist der Server erreichbar?":
    "The account couldn't be created. Please check your internet connection.",
  "E-Mail oder Passwort stimmt nicht.": "The email address or password is incorrect.",
  "Klassencode, Name oder Passwort stimmt nicht.": "The class code, name or password doesn't match.",
  "Bitte gib deinen Namen an.": "Please enter your name.",
  "Bitte gib eine gültige E-Mail-Adresse an.": "Please enter a valid email address.",
  "Mit dieser E-Mail-Adresse gibt es schon ein Konto. Melde dich an oder nimm eine andere Adresse.":
    "There's already an account with this email address. Sign in, or use a different address.",
  "Das Konto konnte nicht angelegt werden.": "The account couldn't be created.",
  "E-Mail-Adresse oder Passwort stimmt nicht.": "The email address or password is incorrect.",
  "Ein eigenes Konto braucht eine Verbindung zum Server.":
    "A personal account needs a connection to the server.",
  "Dafür braucht es eine Verbindung zum Server.": "This needs a connection to the server.",
  "Die beiden Passwörter stimmen nicht überein.": "The two passwords don't match.",
  "Die beiden neuen Passwörter stimmen nicht überein.": "The two new passwords don't match.",
  "Nicht angemeldet.": "Not signed in.",
  "Bitte zuerst anmelden.": "Please sign in first.",
  "Konto nicht gefunden.": "Account not found.",
  "Dieses Konto gibt es nicht.": "This account doesn't exist.",

  // --- Passwort ändern, vergessen, neu setzen -------------------------------
  "Der Link ist ungültig oder abgelaufen. Bitte fordere einen neuen an.":
    "This link isn't valid or has expired. Please ask for a new one.",
  "Das Passwort konnte nicht gesetzt werden. Ist der Server erreichbar?":
    "The password couldn't be set. Please check your internet connection.",
  "Der Link ist abgelaufen oder wurde schon benutzt.": "This link has expired or has already been used.",
  "Das Zurücksetzen funktioniert nur mit einem Server-Konto.":
    "Resetting only works with an account on the server.",
  "Das alte Passwort stimmt nicht.": "The old password is incorrect.",
  "Das aktuelle Passwort stimmt nicht.": "The current password is incorrect.",
  "Passwort konnte nicht geändert werden. Ist der Server erreichbar?":
    "The password couldn't be changed. Please check your internet connection.",
  "Bitte alle drei Felder ausfüllen.": "Please fill in all three fields.",

  // --- Bestätigen, Adresse ändern, Konto löschen -----------------------------
  "Dieser Link ist abgelaufen oder wurde schon benutzt. Fordere in deinem Konto einen neuen an.":
    "This link has expired or has already been used. Ask for a new one in your account.",
  "Dieser Link ist abgelaufen oder wurde schon benutzt.": "This link has expired or has already been used.",
  "Link abgelaufen oder Passwort falsch.": "The link has expired or the password is incorrect.",
  "Der Wechsel konnte nicht angestoßen werden. Ist die Adresse schon vergeben?":
    "The change couldn't be started. Is the address already in use?",
  "Das Konto konnte nicht gelöscht werden.": "The account couldn't be deleted.",
  "Das hat nicht geklappt.": "That didn't work.",
  "Das hat nicht geklappt. Bitte versuch es noch einmal.": "That didn't work. Please try again.",

  // --- Einladung als Co-Lehrkraft (tt_coteacher_lib.pb.js) -------------------
  "Kein Einladungscode übermittelt.": "No invitation code was sent.",
  "Diese Einladung gibt es nicht.": "This invitation doesn't exist.",
  "Diese Einladung wurde zurückgezogen.": "This invitation has been withdrawn.",
  "Diese Einladung ist abgelaufen. Bitte bei der Lehrkraft eine neue anfordern.":
    "This invitation has expired. Please ask the teacher for a new one.",
  "Bitte zuerst anmelden oder ein Konto anlegen.": "Please sign in or create an account first.",
  "Diese Einladung wurde bereits von einem anderen Konto eingelöst.":
    "This invitation has already been accepted by another account.",
  "Diese Klasse gibt es nicht mehr.": "This class no longer exists.",
  "Das hat gerade nicht geklappt.": "That didn't work just now.",
  "Bitte als Lehrkraft anmelden.": "Please sign in as a teacher.",

  // --- Co-Lehrkräfte hinzufügen und entfernen (tt_coteacher_lib.pb.js, EN9) ---
  "Einladung konnte nicht angelegt werden.": "The invitation couldn't be created.",
  "Kein Klassencode übermittelt.": "No class code was sent.",
  "Diese Klasse gibt es nicht.": "This class doesn't exist.",
  "Diese Klasse gehört einer anderen Lehrkraft.": "This class belongs to another teacher.",
  "Diese Lehrkraft ist bereits Eigentümer:in der Klasse.": "This teacher already owns the class.",
  "Lehrkraft konnte nicht hinzugefügt werden.": "The teacher couldn't be added.",
  "Keine Lehrkraft angegeben.": "No teacher was specified.",
  "Die Eigentümer:in lässt sich nicht entfernen. Wenn nötig, die Klasse löschen.":
    "The owner of the class can't be removed. If necessary, delete the class instead.",

  // --- Kind verschieben, Klassencode ändern (tt_klasse_lib.pb.js, EN9) --------
  // Glossar §3.8: Kind (Lehrkraft-Sicht) ⇒ *pupil*, Klassencode ⇒ *class code*.
  "Dieses Kind gehört nicht zu einer Ihrer Klassen.": "This pupil isn't in any of your classes.",
  "Bitte den Klassencode der neuen Klasse eingeben.": "Please enter the class code of the new class.",
  "Das Kind ist schon in der Klasse mit diesem Klassencode.":
    "The pupil is already in the class with this class code.",
  "Das Kind konnte nicht verschoben werden. Es ist nichts geändert.":
    "The pupil couldn't be moved. Nothing has been changed.",
  "Bitte einen Klassencode eingeben - mit ihm melden sich die Kinder an.":
    "Please enter a class code - your pupils use it to sign in.",
  "Der Klassencode darf 2 bis 12 Zeichen haben: Buchstaben, Ziffern, Punkt oder Bindestrich.":
    "A class code can have 2 to 12 characters: letters, digits, full stops or hyphens.",
  "Bitte einen Klassennamen angeben.": "Please enter a class name.",
  "Diesen Klassencode gibt es schon, bitte einen anderen wählen.":
    "This class code is already taken - please choose a different one.",
  // ★ 20.09.2026: der Klassenname ist nur JE KONTO eindeutig (tt_klasse.pb.js
  // UND account.ts, lokaler Modus) - zwei Lehrkräfte dürfen beide „Test" heissen.
  "Diesen Klassennamen haben Sie schon vergeben. Bitte wählen Sie einen anderen Namen.":
    "You've already used this class name. Please choose a different one.",
  // ★ Nachbesserung 20.09.2026 (Punkt 3): beim ANLEGEN, wenn wirklich der
  // CODE belegt ist (der Vorschlag konnte nicht ausweichen, oder die
  // Lehrkraft hatte ihn selbst getippt) - nennt ausdrücklich den Klassencode
  // und sagt, dass der Klassenname bleiben darf (`pbBackend.createClass`,
  // `account.ts createClass`).
  "Diesen Klassencode gibt es schon - bitte wählen Sie einen anderen Klassencode (der Klassenname darf gerne bleiben).":
    "This class code is already taken - please choose a different class code (the class name can stay the same).",
  "Die Klasse konnte nicht geändert werden. Es ist nichts geändert.":
    "The class couldn't be changed. Nothing has been changed.",
  // tt_klasse.pb.js (Klasse anlegen mit leerem Code) - dieselbe Aussage wie oben.
  "Bitte einen Klassencode angeben - mit ihm melden sich die Kinder an.":
    "Please enter a class code - your pupils use it to sign in.",

  // --- Klassenmatch ausschreiben (tt_match.pb.js, EN9) - liest das KIND --------
  // Steht hinter „The Class Match invitation couldn't be sent: …"
  // (`MATCH_MELDUNGEN` in useKlassenmatch.ts). Glossar §3.7: *Class Match*.
  "Ein Klassenmatch kann nur ein Kind einer Klasse ausschreiben.":
    "Only a pupil in a class can send a Class Match invitation.",
  "Ein Klassenmatch gibt es nur in einer Klasse.": "A Class Match is only possible within a class.",
  "Eure Lehrkraft hat das Klassenmatch für diese Klasse ausgeschaltet.":
    "Your teacher has switched off Class Match for this class.",
  // ★ 02.10.2026 „Ein Kind, ein Match" und Beitreten (tt_match_lib.pb.js) - liest das KIND.
  "Du hast schon ein Klassenmatch ausgeschrieben, das noch offen ist. Ein zweites geht erst, wenn es vorbei ist.":
    "You've already sent a Class Match invitation that is still open. You can start another one once it is over.",
  "Du bist schon in einem anderen Klassenmatch dabei. Ein zweites geht erst, wenn es vorbei ist.":
    "You're already taking part in another Class Match. You can join a new one once it is over.",
  "Dieses Klassenmatch ist schon vorbei.": "This Class Match is already over.",
  "Dieses Klassenmatch gibt es nicht (mehr).": "This Class Match doesn't exist (any more).",

  // --- Klassenverwaltung aus den Backends (EN6b, 19.09.2026) -----------------
  // Was „Kinder und Zugänge" und die Co-Lehrkräfte wörtlich zeigen, wenn es
  // nicht vom Hook, sondern aus `pbBackend.ts` / `account.ts` (ohne Server)
  // kommt. Glossar §3.8: Kind ⇒ *pupil*, Klassencode ⇒ *class code*,
  // Eigentümer:in ⇒ *owner* (§3.14).
  "Klasse konnte nicht angelegt werden. Ist der Server erreichbar?":
    "The class couldn't be created. Please check your internet connection.",
  "Die Klasse wurde geändert, konnte aber nicht neu gelesen werden. Bitte die Seite neu laden.":
    "The class has been changed but couldn't be read back. Please reload the page.",
  "Klasse konnte nicht gelöscht werden.": "The class couldn't be deleted.",
  "Diesen Code gibt es schon, bitte einen anderen wählen.":
    "This class code is already taken - please choose a different one.",
  "Bitte zuerst als Lehrkraft anmelden.": "Please sign in as a teacher first.",
  "Diesen Namen gibt es in der Klasse schon.": "There is already a pupil with this name in the class.",
  "Die Kontakt-E-Mail konnte nicht gespeichert werden.": "The contact email couldn't be saved.",
  "Passwort konnte nicht gesetzt werden (mindestens 4 Zeichen).":
    "The password couldn't be set (at least 4 characters).",
  "Passwort konnte nicht zurückgesetzt werden.": "The password couldn't be reset.",
  "Die Eigentümer:in lässt sich nicht entfernen.": "The owner of the class can't be removed.",

  // --- „Melden" (rueckmeldung_mail.pb.js) -----------------------------------
  "Die Meldung ist leer.": "The message is empty.",
  "Es sind schon mehrere Meldungen unterwegs. Bitte versuchen Sie es in einer Stunde noch einmal.":
    "Several messages are already on their way. Please try again in an hour.",

  // --- Allgemein (`hookError` in pbBackend.ts) ------------------------------
  "Aktion fehlgeschlagen. Ist der Server erreichbar?":
    "That didn't work. Please check your internet connection.",
};

/** Sätze mit einer Zahl darin - Muster statt fester Schlüssel. */
const MUSTER_EN: readonly [RegExp, (m: RegExpMatchArray) => string][] = [
  [/^Das Passwort braucht mindestens (\d+) Zeichen\.$/, (m) => `The password needs at least ${m[1]} characters.`],
  [
    /^Das neue Passwort braucht mindestens (\d+) Zeichen\.$/,
    (m) => `The new password needs at least ${m[1]} characters.`,
  ],
  [
    /^Das Passwort muss mindestens (\d+) Zeichen lang sein\.$/,
    (m) => `The password must be at least ${m[1]} characters long.`,
  ],
  [
    /^Aktion fehlgeschlagen \((\d+)\)\. Bitte erneut versuchen\.$/,
    (m) => `That didn't work (${m[1]}). Please try again.`,
  ],
  // --- EN9: die Sätze aus `tt_klasse_lib.pb.js` mit Code, Name und Zahl ------
  // Codes und Namen sind Eigennamen - sie bleiben, wie sie sind (Glossar §2).
  [
    /^Eine Klasse mit dem Klassencode „(.+)“ gibt es nicht\. Bitte den Code prüfen\.$/,
    (m) => `There is no class with the class code “${m[1]}”. Please check the code.`,
  ],
  [
    /^In der Klasse „(.+)“ sind bereits (\d+) Kinder\. Mehr als (\d+) sind je Klasse nicht vorgesehen\.$/,
    (m) => `The class “${m[1]}” already has ${m[2]} pupils. A class can have no more than ${m[3]}.`,
  ],
  [
    /^In der neuen Klasse gibt es schon ein Kind mit dem Namen „(.+)“\. Ändern Sie zuerst den Namen eines der beiden Kinder\.$/,
    (m) =>
      `There is already a pupil called “${m[1]}” in the new class. Please change the name of one of the two pupils first.`,
  ],
  // --- Klassen-/Kinder-Grenze (tt_grenzen.pb.js, EN9-Nachtrag 19.09.2026) ---
  [
    /^Mehr als (\d+) Klassen sind je Konto nicht vorgesehen\. Brauchst du wirklich mehr, melde dich bitte - dann heben wir die Grenze an\.$/,
    (m) =>
      `More than ${m[1]} classes aren't supported per account. If you really need more, please get in touch - we'll then raise the limit.`,
  ],
  [
    /^In dieser Klasse sind bereits (\d+) Kinder\. Mehr als (\d+) sind je Klasse nicht vorgesehen - lege bitte eine zweite Klasse an\.$/,
    (m) =>
      `This class already has ${m[1]} pupils. A class can have no more than ${m[2]} - please create a second class.`,
  ],
];

/**
 * Die englische Fassung eines Server-Satzes - oder `null`, wenn die Tabelle
 * ihn nicht kennt (dann bleibt er deutsch).
 */
export function serverMeldungEnglisch(text: string): string | null {
  const sauber = text.trim();
  const fest = SERVER_MELDUNGEN_EN[sauber];
  if (fest) return fest;
  for (const [muster, bau] of MUSTER_EN) {
    const m = sauber.match(muster);
    if (m) return bau(m);
  }
  return null;
}

/**
 * ★★ E11a-5 (26.09.2026, F18: „wer Französisch verwendet, bekommt alles in
 * Französisch"): DIESELBEN SERVER-SÄTZE AUF FRANZÖSISCH - bis dahin bekam die
 * französische Bedienung hier den DEUTSCHEN Satz, und zwar OHNE `lang="de"`
 * (die Weiche in {@link serverMeldung} prüfte nur „en", Falle 30).
 *
 * Neu aus der Funktion geschrieben, nicht übersetzt. Die Anrede folgt dem
 * deutschen Satz: wo er „du" sagt (Selbstlernende, Kinder), steht „tu"; wo er
 * „Sie" sagt oder die Klassenverwaltung spricht (Lehrkraft), „vous"; wo er
 * ohne Anrede auskommt („Bitte einen Namen angeben."), steht ein Satz ohne
 * Anrede. Glossar §9.2: élève, code de classe, Match de la classe, enseignant
 * ou enseignante. Der Wächter `tests/tastenflow-franzoesisch-alles.test.tsx`
 * verlangt für JEDEN englischen Schlüssel einen französischen.
 */
export const SERVER_MELDUNGEN_FR: Readonly<Record<string, string>> = {
  // --- Anmelden und Konto anlegen ------------------------------------------
  "Bitte einen Namen angeben.": "Il manque le nom.",
  "Bitte eine gültige E-Mail angeben.": "Il manque une adresse e-mail valide.",
  "Für diese E-Mail gibt es schon ein Konto.": "Un compte existe déjà avec cette adresse e-mail.",
  "Konto konnte nicht erstellt werden. Ist der Server erreichbar?":
    "Le compte n'a pas pu être créé. Vérifie la connexion internet.",
  "E-Mail oder Passwort stimmt nicht.": "L'adresse e-mail ou le mot de passe ne correspond pas.",
  "Klassencode, Name oder Passwort stimmt nicht.":
    "Le code de classe, le nom ou le mot de passe ne correspond pas.",
  "Bitte gib deinen Namen an.": "Indique ton nom.",
  "Bitte gib eine gültige E-Mail-Adresse an.": "Indique une adresse e-mail valide.",
  "Mit dieser E-Mail-Adresse gibt es schon ein Konto. Melde dich an oder nimm eine andere Adresse.":
    "Un compte existe déjà avec cette adresse e-mail. Connecte-toi ou choisis une autre adresse.",
  "Das Konto konnte nicht angelegt werden.": "Le compte n'a pas pu être créé.",
  "E-Mail-Adresse oder Passwort stimmt nicht.": "L'adresse e-mail ou le mot de passe ne correspond pas.",
  "Ein eigenes Konto braucht eine Verbindung zum Server.":
    "Un compte personnel a besoin d'une connexion au serveur.",
  "Dafür braucht es eine Verbindung zum Server.": "Pour cela, il faut une connexion au serveur.",
  "Die beiden Passwörter stimmen nicht überein.": "Les deux mots de passe ne sont pas identiques.",
  "Die beiden neuen Passwörter stimmen nicht überein.":
    "Les deux nouveaux mots de passe ne sont pas identiques.",
  "Nicht angemeldet.": "Pas connecté.",
  "Bitte zuerst anmelden.": "Il faut d'abord se connecter.",
  "Konto nicht gefunden.": "Compte introuvable.",
  "Dieses Konto gibt es nicht.": "Ce compte n'existe pas.",

  // --- Passwort ändern, vergessen, neu setzen -------------------------------
  "Der Link ist ungültig oder abgelaufen. Bitte fordere einen neuen an.":
    "Ce lien n'est pas valable ou a expiré. Demandes-en un nouveau.",
  "Das Passwort konnte nicht gesetzt werden. Ist der Server erreichbar?":
    "Le mot de passe n'a pas pu être enregistré. Vérifie la connexion internet.",
  "Der Link ist abgelaufen oder wurde schon benutzt.": "Ce lien a expiré ou a déjà servi.",
  "Das Zurücksetzen funktioniert nur mit einem Server-Konto.":
    "La réinitialisation ne fonctionne qu'avec un compte sur le serveur.",
  "Das alte Passwort stimmt nicht.": "L'ancien mot de passe ne correspond pas.",
  "Das aktuelle Passwort stimmt nicht.": "Le mot de passe actuel ne correspond pas.",
  "Passwort konnte nicht geändert werden. Ist der Server erreichbar?":
    "Le mot de passe n'a pas pu être changé. Vérifie la connexion internet.",
  "Bitte alle drei Felder ausfüllen.": "Il faut remplir les trois champs.",

  // --- Bestätigen, Adresse ändern, Konto löschen -----------------------------
  "Dieser Link ist abgelaufen oder wurde schon benutzt. Fordere in deinem Konto einen neuen an.":
    "Ce lien a expiré ou a déjà servi. Demandes-en un nouveau dans ton compte.",
  "Dieser Link ist abgelaufen oder wurde schon benutzt.": "Ce lien a expiré ou a déjà servi.",
  "Link abgelaufen oder Passwort falsch.": "Le lien a expiré ou le mot de passe ne correspond pas.",
  "Der Wechsel konnte nicht angestoßen werden. Ist die Adresse schon vergeben?":
    "Le changement n'a pas pu être lancé. Cette adresse est-elle déjà utilisée ?",
  "Das Konto konnte nicht gelöscht werden.": "Le compte n'a pas pu être supprimé.",
  "Das hat nicht geklappt.": "Ça n'a pas marché.",
  "Das hat nicht geklappt. Bitte versuch es noch einmal.": "Ça n'a pas marché. Essaie encore une fois.",

  // --- Einladung als Co-Lehrkraft (tt_coteacher_lib.pb.js) -------------------
  "Kein Einladungscode übermittelt.": "Aucun code d'invitation n'a été transmis.",
  "Diese Einladung gibt es nicht.": "Cette invitation n'existe pas.",
  "Diese Einladung wurde zurückgezogen.": "Cette invitation a été retirée.",
  "Diese Einladung ist abgelaufen. Bitte bei der Lehrkraft eine neue anfordern.":
    "Cette invitation a expiré. Demandez-en une nouvelle à l'enseignant ou à l'enseignante.",
  "Bitte zuerst anmelden oder ein Konto anlegen.": "Il faut d'abord se connecter ou créer un compte.",
  "Diese Einladung wurde bereits von einem anderen Konto eingelöst.":
    "Cette invitation a déjà été acceptée par un autre compte.",
  "Diese Klasse gibt es nicht mehr.": "Cette classe n'existe plus.",
  "Das hat gerade nicht geklappt.": "Ça n'a pas marché cette fois-ci.",
  "Bitte als Lehrkraft anmelden.": "Connectez-vous avec un compte enseignant.",

  // --- Co-Lehrkräfte hinzufügen und entfernen (tt_coteacher_lib.pb.js, EN9) ---
  "Einladung konnte nicht angelegt werden.": "L'invitation n'a pas pu être créée.",
  "Kein Klassencode übermittelt.": "Aucun code de classe n'a été transmis.",
  "Diese Klasse gibt es nicht.": "Cette classe n'existe pas.",
  "Diese Klasse gehört einer anderen Lehrkraft.":
    "Cette classe appartient à un autre enseignant ou une autre enseignante.",
  "Diese Lehrkraft ist bereits Eigentümer:in der Klasse.":
    "Cette personne est déjà propriétaire de la classe.",
  "Lehrkraft konnte nicht hinzugefügt werden.":
    "L'enseignant ou l'enseignante n'a pas pu être ajouté.",
  "Keine Lehrkraft angegeben.": "Aucun enseignant ni aucune enseignante n'a été indiqué.",
  "Die Eigentümer:in lässt sich nicht entfernen. Wenn nötig, die Klasse löschen.":
    "La personne propriétaire de la classe ne peut pas être retirée. Si besoin, supprimez la classe.",

  // --- Kind verschieben, Klassencode ändern (tt_klasse_lib.pb.js, EN9) --------
  "Dieses Kind gehört nicht zu einer Ihrer Klassen.": "Cet élève ne fait partie d'aucune de vos classes.",
  "Bitte den Klassencode der neuen Klasse eingeben.": "Saisissez le code de classe de la nouvelle classe.",
  "Das Kind ist schon in der Klasse mit diesem Klassencode.":
    "Cet élève est déjà dans la classe qui a ce code de classe.",
  "Das Kind konnte nicht verschoben werden. Es ist nichts geändert.":
    "L'élève n'a pas pu être déplacé. Rien n'a été modifié.",
  "Bitte einen Klassencode eingeben - mit ihm melden sich die Kinder an.":
    "Saisissez un code de classe - c'est avec ce code que les élèves se connectent.",
  "Der Klassencode darf 2 bis 12 Zeichen haben: Buchstaben, Ziffern, Punkt oder Bindestrich.":
    "Le code de classe peut compter de 2 à 12 caractères : lettres, chiffres, point ou tiret.",
  "Bitte einen Klassennamen angeben.": "Il manque le nom de la classe.",
  "Diesen Klassencode gibt es schon, bitte einen anderen wählen.":
    "Ce code de classe existe déjà - choisissez-en un autre.",
  "Diesen Klassennamen haben Sie schon vergeben. Bitte wählen Sie einen anderen Namen.":
    "Vous avez déjà une classe avec ce nom. Choisissez un autre nom.",
  "Diesen Klassencode gibt es schon - bitte wählen Sie einen anderen Klassencode (der Klassenname darf gerne bleiben).":
    "Ce code de classe existe déjà - choisissez un autre code de classe (le nom de la classe peut rester le même).",
  "Die Klasse konnte nicht geändert werden. Es ist nichts geändert.":
    "La classe n'a pas pu être modifiée. Rien n'a été modifié.",
  "Bitte einen Klassencode angeben - mit ihm melden sich die Kinder an.":
    "Saisissez un code de classe - c'est avec ce code que les élèves se connectent.",

  // --- Klassenmatch ausschreiben (tt_match.pb.js, EN9) - liest das KIND --------
  "Ein Klassenmatch kann nur ein Kind einer Klasse ausschreiben.":
    "Seul un élève d'une classe peut lancer un Match de la classe.",
  "Ein Klassenmatch gibt es nur in einer Klasse.": "Un Match de la classe n'existe que dans une classe.",
  "Eure Lehrkraft hat das Klassenmatch für diese Klasse ausgeschaltet.":
    "Ton enseignant ou ton enseignante a désactivé le Match de la classe pour cette classe.",
  // ★ 02.10.2026 „Ein Kind, ein Match" und Beitreten (tt_match_lib.pb.js) - liest das KIND.
  "Du hast schon ein Klassenmatch ausgeschrieben, das noch offen ist. Ein zweites geht erst, wenn es vorbei ist.":
    "Tu as déjà lancé un Match de la classe qui est encore ouvert. Tu pourras en lancer un autre quand il sera terminé.",
  "Du bist schon in einem anderen Klassenmatch dabei. Ein zweites geht erst, wenn es vorbei ist.":
    "Tu participes déjà à un autre Match de la classe. Tu pourras en rejoindre un nouveau quand il sera terminé.",
  "Dieses Klassenmatch ist schon vorbei.": "Ce Match de la classe est déjà terminé.",
  "Dieses Klassenmatch gibt es nicht (mehr).": "Ce Match de la classe n'existe pas (ou plus).",

  // --- Klassenverwaltung aus den Backends (EN6b, 19.09.2026) -----------------
  "Klasse konnte nicht angelegt werden. Ist der Server erreichbar?":
    "La classe n'a pas pu être créée. Vérifiez la connexion internet.",
  "Die Klasse wurde geändert, konnte aber nicht neu gelesen werden. Bitte die Seite neu laden.":
    "La classe a été modifiée, mais n'a pas pu être relue. Rechargez la page.",
  "Klasse konnte nicht gelöscht werden.": "La classe n'a pas pu être supprimée.",
  "Diesen Code gibt es schon, bitte einen anderen wählen.":
    "Ce code de classe existe déjà - choisissez-en un autre.",
  "Bitte zuerst als Lehrkraft anmelden.": "Connectez-vous d'abord avec un compte enseignant.",
  "Diesen Namen gibt es in der Klasse schon.": "Un élève porte déjà ce nom dans la classe.",
  "Die Kontakt-E-Mail konnte nicht gespeichert werden.": "L'adresse e-mail de contact n'a pas pu être enregistrée.",
  "Passwort konnte nicht gesetzt werden (mindestens 4 Zeichen).":
    "Le mot de passe n'a pas pu être enregistré (au moins 4 caractères).",
  "Passwort konnte nicht zurückgesetzt werden.": "Le mot de passe n'a pas pu être réinitialisé.",
  "Die Eigentümer:in lässt sich nicht entfernen.":
    "La personne propriétaire de la classe ne peut pas être retirée.",

  // --- „Melden" (rueckmeldung_mail.pb.js) -----------------------------------
  "Die Meldung ist leer.": "Le message est vide.",
  "Es sind schon mehrere Meldungen unterwegs. Bitte versuchen Sie es in einer Stunde noch einmal.":
    "Plusieurs messages sont déjà en route. Réessayez dans une heure.",

  // --- Allgemein (`hookError` in pbBackend.ts) ------------------------------
  "Aktion fehlgeschlagen. Ist der Server erreichbar?":
    "Ça n'a pas marché. Vérifiez la connexion internet.",
};

const MUSTER_FR: readonly [RegExp, (m: RegExpMatchArray) => string][] = [
  [/^Das Passwort braucht mindestens (\d+) Zeichen\.$/, (m) => `Le mot de passe doit compter au moins ${m[1]} caractères.`],
  [
    /^Das neue Passwort braucht mindestens (\d+) Zeichen\.$/,
    (m) => `Le nouveau mot de passe doit compter au moins ${m[1]} caractères.`,
  ],
  [
    /^Das Passwort muss mindestens (\d+) Zeichen lang sein\.$/,
    (m) => `Le mot de passe doit compter au moins ${m[1]} caractères.`,
  ],
  [
    /^Aktion fehlgeschlagen \((\d+)\)\. Bitte erneut versuchen\.$/,
    (m) => `Ça n'a pas marché (${m[1]}). Réessayez.`,
  ],
  [
    /^Eine Klasse mit dem Klassencode „(.+)“ gibt es nicht\. Bitte den Code prüfen\.$/,
    (m) => `Aucune classe n'a le code de classe "${m[1]}". Vérifiez le code.`,
  ],
  [
    /^In der Klasse „(.+)“ sind bereits (\d+) Kinder\. Mehr als (\d+) sind je Klasse nicht vorgesehen\.$/,
    (m) => `La classe "${m[1]}" compte déjà ${m[2]} élèves. Une classe ne peut pas en avoir plus de ${m[3]}.`,
  ],
  [
    /^In der neuen Klasse gibt es schon ein Kind mit dem Namen „(.+)“\. Ändern Sie zuerst den Namen eines der beiden Kinder\.$/,
    (m) =>
      `Un élève s'appelle déjà "${m[1]}" dans la nouvelle classe. Changez d'abord le nom de l'un des deux élèves.`,
  ],
  [
    /^Mehr als (\d+) Klassen sind je Konto nicht vorgesehen\. Brauchst du wirklich mehr, melde dich bitte - dann heben wir die Grenze an\.$/,
    (m) =>
      `Un compte ne peut pas avoir plus de ${m[1]} classes. Si vous en avez vraiment besoin de plus, écrivez-nous - nous relèverons la limite.`,
  ],
  [
    /^In dieser Klasse sind bereits (\d+) Kinder\. Mehr als (\d+) sind je Klasse nicht vorgesehen - lege bitte eine zweite Klasse an\.$/,
    (m) =>
      `Cette classe compte déjà ${m[1]} élèves. Une classe ne peut pas en avoir plus de ${m[2]} - créez une deuxième classe.`,
  ],
];

/**
 * ★ E11a-5: die französische Fassung eines Server-Satzes - oder `null`, wenn
 * die Tabelle ihn nicht kennt (dann bleibt er deutsch und bekommt `lang="de"`).
 */
export function serverMeldungFranzoesisch(text: string): string | null {
  const sauber = text.trim();
  const fest = SERVER_MELDUNGEN_FR[sauber];
  if (fest) return fest;
  for (const [muster, bau] of MUSTER_FR) {
    const m = sauber.match(muster);
    if (m) return bau(m);
  }
  return null;
}

/**
 * ★★ ES-O (27.09.2026, Bauplan D6): DIESELBEN SERVER-SÄTZE AUF SPANISCH - bis
 * dahin bekam die spanische Bedienung hier die ENGLISCHEN Sätze. Aus der
 * Funktion geschrieben; die Anrede folgt dem deutschen Satz (du ⇒ tú, Sie
 * und Klassenverwaltung ⇒ usted, ohne Anrede ⇒ ohne Anrede). „estudiante",
 * „docente", „el alumnado" (Bauplan S10). Der Wächter
 * `tests/tastenflow-spanisch-alles.test.tsx` verlangt für JEDEN englischen
 * Schlüssel einen spanischen.
 */
export const SERVER_MELDUNGEN_ES: Readonly<Record<string, string>> = {
  "Bitte einen Namen angeben.": "Falta el nombre.",
  "Bitte eine gültige E-Mail angeben.": "Falta un correo electrónico válido.",
  "Für diese E-Mail gibt es schon ein Konto.": "Ya existe una cuenta con este correo electrónico.",
  "Konto konnte nicht erstellt werden. Ist der Server erreichbar?":
    "No se pudo crear la cuenta. Comprueba la conexión a internet.",
  "E-Mail oder Passwort stimmt nicht.": "El correo electrónico o la contraseña no son correctos.",
  "Klassencode, Name oder Passwort stimmt nicht.": "El código de clase, el nombre o la contraseña no son correctos.",
  "Bitte gib deinen Namen an.": "Indica tu nombre.",
  "Bitte gib eine gültige E-Mail-Adresse an.": "Indica un correo electrónico válido.",
  "Mit dieser E-Mail-Adresse gibt es schon ein Konto. Melde dich an oder nimm eine andere Adresse.":
    "Ya existe una cuenta con este correo electrónico. Inicia sesión o usa otra dirección.",
  "Das Konto konnte nicht angelegt werden.": "No se pudo crear la cuenta.",
  "E-Mail-Adresse oder Passwort stimmt nicht.": "El correo electrónico o la contraseña no son correctos.",
  "Ein eigenes Konto braucht eine Verbindung zum Server.": "Una cuenta propia necesita conexión con el servidor.",
  "Dafür braucht es eine Verbindung zum Server.": "Para eso hace falta conexión con el servidor.",
  "Die beiden Passwörter stimmen nicht überein.": "Las dos contraseñas no coinciden.",
  "Die beiden neuen Passwörter stimmen nicht überein.": "Las dos contraseñas nuevas no coinciden.",
  "Nicht angemeldet.": "No has iniciado sesión.",
  "Bitte zuerst anmelden.": "Primero hay que iniciar sesión.",
  "Konto nicht gefunden.": "No se encontró la cuenta.",
  "Dieses Konto gibt es nicht.": "Esta cuenta no existe.",
  "Der Link ist ungültig oder abgelaufen. Bitte fordere einen neuen an.":
    "Este enlace no es válido o ha caducado. Pide uno nuevo.",
  "Das Passwort konnte nicht gesetzt werden. Ist der Server erreichbar?":
    "No se pudo guardar la contraseña. Comprueba la conexión a internet.",
  "Der Link ist abgelaufen oder wurde schon benutzt.": "El enlace ha caducado o ya se ha usado.",
  "Das Zurücksetzen funktioniert nur mit einem Server-Konto.":
    "El restablecimiento solo funciona con una cuenta en el servidor.",
  "Das alte Passwort stimmt nicht.": "La contraseña anterior no es correcta.",
  "Das aktuelle Passwort stimmt nicht.": "La contraseña actual no es correcta.",
  "Passwort konnte nicht geändert werden. Ist der Server erreichbar?":
    "No se pudo cambiar la contraseña. Comprueba la conexión a internet.",
  "Bitte alle drei Felder ausfüllen.": "Hay que completar los tres campos.",
  "Dieser Link ist abgelaufen oder wurde schon benutzt. Fordere in deinem Konto einen neuen an.":
    "Este enlace ha caducado o ya se ha usado. Pide uno nuevo en tu cuenta.",
  "Dieser Link ist abgelaufen oder wurde schon benutzt.": "Este enlace ha caducado o ya se ha usado.",
  "Link abgelaufen oder Passwort falsch.": "El enlace ha caducado o la contraseña no es correcta.",
  "Der Wechsel konnte nicht angestoßen werden. Ist die Adresse schon vergeben?":
    "No se pudo iniciar el cambio. ¿Ya está en uso esta dirección?",
  "Das Konto konnte nicht gelöscht werden.": "No se pudo eliminar la cuenta.",
  "Das hat nicht geklappt.": "No ha funcionado.",
  "Das hat nicht geklappt. Bitte versuch es noch einmal.": "No ha funcionado. Vuelve a intentarlo.",
  "Kein Einladungscode übermittelt.": "No se ha recibido ningún código de invitación.",
  "Diese Einladung gibt es nicht.": "Esta invitación no existe.",
  "Diese Einladung wurde zurückgezogen.": "Esta invitación se ha retirado.",
  "Diese Einladung ist abgelaufen. Bitte bei der Lehrkraft eine neue anfordern.":
    "Esta invitación ha caducado. Pida una nueva a la persona docente.",
  "Bitte zuerst anmelden oder ein Konto anlegen.": "Primero hay que iniciar sesión o crear una cuenta.",
  "Diese Einladung wurde bereits von einem anderen Konto eingelöst.":
    "Esta invitación ya la ha aceptado otra cuenta.",
  "Diese Klasse gibt es nicht mehr.": "Esta clase ya no existe.",
  "Das hat gerade nicht geklappt.": "Esta vez no ha funcionado.",
  "Bitte als Lehrkraft anmelden.": "Inicie sesión con una cuenta de docente.",
  "Einladung konnte nicht angelegt werden.": "No se pudo crear la invitación.",
  "Kein Klassencode übermittelt.": "No se ha recibido ningún código de clase.",
  "Diese Klasse gibt es nicht.": "Esta clase no existe.",
  "Diese Klasse gehört einer anderen Lehrkraft.": "Esta clase pertenece a otra persona docente.",
  "Diese Lehrkraft ist bereits Eigentümer:in der Klasse.": "Esta persona ya es propietaria de la clase.",
  "Lehrkraft konnte nicht hinzugefügt werden.": "No se pudo añadir a la persona docente.",
  "Keine Lehrkraft angegeben.": "No se ha indicado ninguna persona docente.",
  "Die Eigentümer:in lässt sich nicht entfernen. Wenn nötig, die Klasse löschen.":
    "La persona propietaria de la clase no se puede quitar. Si hace falta, elimine la clase.",
  "Dieses Kind gehört nicht zu einer Ihrer Klassen.": "Esta persona no pertenece a ninguna de sus clases.",
  "Bitte den Klassencode der neuen Klasse eingeben.": "Escriba el código de clase de la clase nueva.",
  "Das Kind ist schon in der Klasse mit diesem Klassencode.": "Ya está en la clase que tiene este código de clase.",
  "Das Kind konnte nicht verschoben werden. Es ist nichts geändert.": "No se pudo mover. No se ha cambiado nada.",
  "Bitte einen Klassencode eingeben - mit ihm melden sich die Kinder an.":
    "Escriba un código de clase - el alumnado inicia sesión con él.",
  "Der Klassencode darf 2 bis 12 Zeichen haben: Buchstaben, Ziffern, Punkt oder Bindestrich.":
    "El código de clase puede tener de 2 a 12 caracteres: letras, números, punto o guion.",
  "Bitte einen Klassennamen angeben.": "Falta el nombre de la clase.",
  "Diesen Klassencode gibt es schon, bitte einen anderen wählen.": "Este código de clase ya existe - elija otro.",
  "Diesen Klassennamen haben Sie schon vergeben. Bitte wählen Sie einen anderen Namen.":
    "Ya tiene una clase con este nombre. Elija otro nombre.",
  "Diesen Klassencode gibt es schon - bitte wählen Sie einen anderen Klassencode (der Klassenname darf gerne bleiben).":
    "Este código de clase ya existe - elija otro código de clase (el nombre de la clase puede quedarse igual).",
  "Die Klasse konnte nicht geändert werden. Es ist nichts geändert.":
    "No se pudo cambiar la clase. No se ha cambiado nada.",
  "Bitte einen Klassencode angeben - mit ihm melden sich die Kinder an.":
    "Escriba un código de clase - el alumnado inicia sesión con él.",
  "Ein Klassenmatch kann nur ein Kind einer Klasse ausschreiben.":
    "Solo alguien de una clase puede empezar una Competición de la clase.",
  "Ein Klassenmatch gibt es nur in einer Klasse.": "Una Competición de la clase solo existe dentro de una clase.",
  "Eure Lehrkraft hat das Klassenmatch für diese Klasse ausgeschaltet.":
    "Tu docente ha desactivado la Competición de la clase en esta clase.",
  // ★ 02.10.2026 „Ein Kind, ein Match" und Beitreten (tt_match_lib.pb.js) - liest das KIND.
  "Du hast schon ein Klassenmatch ausgeschrieben, das noch offen ist. Ein zweites geht erst, wenn es vorbei ist.":
    "Ya has iniciado una Competición de la clase que sigue abierta. Podrás empezar otra cuando termine.",
  "Du bist schon in einem anderen Klassenmatch dabei. Ein zweites geht erst, wenn es vorbei ist.":
    "Ya participas en otra Competición de la clase. Podrás unirte a una nueva cuando termine.",
  "Dieses Klassenmatch ist schon vorbei.": "Esta Competición de la clase ya ha terminado.",
  "Dieses Klassenmatch gibt es nicht (mehr).": "Esta Competición de la clase no existe (o ya no existe).",
  "Klasse konnte nicht angelegt werden. Ist der Server erreichbar?":
    "No se pudo crear la clase. Compruebe la conexión a internet.",
  "Die Klasse wurde geändert, konnte aber nicht neu gelesen werden. Bitte die Seite neu laden.":
    "La clase se ha cambiado, pero no se pudo volver a leer. Vuelva a cargar la página.",
  "Klasse konnte nicht gelöscht werden.": "No se pudo eliminar la clase.",
  "Diesen Code gibt es schon, bitte einen anderen wählen.": "Este código de clase ya existe - elija otro.",
  "Bitte zuerst als Lehrkraft anmelden.": "Inicie sesión primero con una cuenta de docente.",
  "Diesen Namen gibt es in der Klasse schon.": "Ya hay alguien con este nombre en la clase.",
  "Die Kontakt-E-Mail konnte nicht gespeichert werden.": "No se pudo guardar el correo de contacto.",
  "Passwort konnte nicht gesetzt werden (mindestens 4 Zeichen).":
    "No se pudo guardar la contraseña (al menos 4 caracteres).",
  "Passwort konnte nicht zurückgesetzt werden.": "No se pudo restablecer la contraseña.",
  "Die Eigentümer:in lässt sich nicht entfernen.": "La persona propietaria de la clase no se puede quitar.",
  "Die Meldung ist leer.": "El mensaje está vacío.",
  "Es sind schon mehrere Meldungen unterwegs. Bitte versuchen Sie es in einer Stunde noch einmal.":
    "Ya hay varios mensajes en camino. Vuelva a intentarlo dentro de una hora.",
  "Aktion fehlgeschlagen. Ist der Server erreichbar?": "No ha funcionado. Compruebe la conexión a internet.",
};

const MUSTER_ES: readonly [RegExp, (m: RegExpMatchArray) => string][] = [
  [/^Das Passwort braucht mindestens (\d+) Zeichen\.$/, (m) => `La contraseña debe tener al menos ${m[1]} caracteres.`],
  [
    /^Das neue Passwort braucht mindestens (\d+) Zeichen\.$/,
    (m) => `La contraseña nueva debe tener al menos ${m[1]} caracteres.`,
  ],
  [
    /^Das Passwort muss mindestens (\d+) Zeichen lang sein\.$/,
    (m) => `La contraseña debe tener al menos ${m[1]} caracteres.`,
  ],
  [
    /^Aktion fehlgeschlagen \((\d+)\)\. Bitte erneut versuchen\.$/,
    (m) => `No ha funcionado (${m[1]}). Vuelva a intentarlo.`,
  ],
  [
    /^Eine Klasse mit dem Klassencode „(.+)“ gibt es nicht\. Bitte den Code prüfen\.$/,
    (m) => `No hay ninguna clase con el código de clase "${m[1]}". Comprueba el código.`,
  ],
  [
    /^In der Klasse „(.+)“ sind bereits (\d+) Kinder\. Mehr als (\d+) sind je Klasse nicht vorgesehen\.$/,
    (m) => `La clase "${m[1]}" ya tiene ${m[2]} estudiantes. Una clase no puede tener más de ${m[3]}.`,
  ],
  [
    /^In der neuen Klasse gibt es schon ein Kind mit dem Namen „(.+)“\. Ändern Sie zuerst den Namen eines der beiden Kinder\.$/,
    (m) =>
      `En la clase nueva ya hay alguien que se llama "${m[1]}". Cambie primero el nombre de una de las dos personas.`,
  ],
  [
    /^Mehr als (\d+) Klassen sind je Konto nicht vorgesehen\. Brauchst du wirklich mehr, melde dich bitte - dann heben wir die Grenze an\.$/,
    (m) =>
      `Una cuenta no puede tener más de ${m[1]} clases. Si de verdad necesita más, escríbanos - subiremos el límite.`,
  ],
  [
    /^In dieser Klasse sind bereits (\d+) Kinder\. Mehr als (\d+) sind je Klasse nicht vorgesehen - lege bitte eine zweite Klasse an\.$/,
    (m) =>
      `Esta clase ya tiene ${m[1]} estudiantes. Una clase no puede tener más de ${m[2]} - cree una segunda clase.`,
  ],
];

/** ★ ES-O: die spanische Fassung eines Server-Satzes - oder `null` (dann bleibt er deutsch mit `lang="de"`). */
export function serverMeldungSpanisch(text: string): string | null {
  const sauber = text.trim();
  const fest = SERVER_MELDUNGEN_ES[sauber];
  if (fest) return fest;
  for (const [muster, bau] of MUSTER_ES) {
    const m = sauber.match(muster);
    if (m) return bau(m);
  }
  return null;
}

/**
 * ★★ O-IT (02.10.2026): DIESELBEN SERVER-SÄTZE AUF ITALIENISCH - bis dahin
 * bekam die italienische Bedienung hier die ENGLISCHEN Sätze. Aus der
 * Funktion geschrieben, nicht übersetzt; die Anrede folgt dem deutschen Satz
 * (du ⇒ tu, Sie und Klassenverwaltung ⇒ Infinitiv oder neutral, nie „Lei" -
 * Glossar Regel 1). „l'insegnante" (Regel 2), „codice classe", „Gara di
 * classe" (§2.3/§2.5). Der Wächter `tests/tastenflow-italienisch-alles.test.tsx`
 * verlangt für JEDEN englischen Schlüssel einen italienischen.
 */
export const SERVER_MELDUNGEN_IT: Readonly<Record<string, string>> = {
  "Bitte einen Namen angeben.": "Manca il nome.",
  "Bitte eine gültige E-Mail angeben.": "Manca un indirizzo email valido.",
  "Für diese E-Mail gibt es schon ein Konto.": "Esiste già un account con questo indirizzo email.",
  "Konto konnte nicht erstellt werden. Ist der Server erreichbar?":
    "Non è stato possibile creare l'account. Controllare la connessione a internet.",
  "E-Mail oder Passwort stimmt nicht.": "L'indirizzo email o la password non sono corretti.",
  "Klassencode, Name oder Passwort stimmt nicht.": "Il codice classe, il nome o la password non sono corretti.",
  "Bitte gib deinen Namen an.": "Scrivi il tuo nome.",
  "Bitte gib eine gültige E-Mail-Adresse an.": "Scrivi un indirizzo email valido.",
  "Mit dieser E-Mail-Adresse gibt es schon ein Konto. Melde dich an oder nimm eine andere Adresse.":
    "Esiste già un account con questo indirizzo email. Accedi oppure usa un altro indirizzo.",
  "Das Konto konnte nicht angelegt werden.": "Non è stato possibile creare l'account.",
  "E-Mail-Adresse oder Passwort stimmt nicht.": "L'indirizzo email o la password non sono corretti.",
  "Ein eigenes Konto braucht eine Verbindung zum Server.": "Un account personale ha bisogno della connessione al server.",
  "Dafür braucht es eine Verbindung zum Server.": "Per questo serve la connessione al server.",
  "Die beiden Passwörter stimmen nicht überein.": "Le due password non coincidono.",
  "Die beiden neuen Passwörter stimmen nicht überein.": "Le due password nuove non coincidono.",
  "Nicht angemeldet.": "Accesso non effettuato.",
  "Bitte zuerst anmelden.": "Prima bisogna accedere.",
  "Konto nicht gefunden.": "Account non trovato.",
  "Dieses Konto gibt es nicht.": "Questo account non esiste.",
  "Der Link ist ungültig oder abgelaufen. Bitte fordere einen neuen an.":
    "Questo link non è valido o è scaduto. Chiedine uno nuovo.",
  "Das Passwort konnte nicht gesetzt werden. Ist der Server erreichbar?":
    "Non è stato possibile salvare la password. Controllare la connessione a internet.",
  "Der Link ist abgelaufen oder wurde schon benutzt.": "Il link è scaduto o è già stato usato.",
  "Das Zurücksetzen funktioniert nur mit einem Server-Konto.":
    "La reimpostazione funziona solo con un account sul server.",
  "Das alte Passwort stimmt nicht.": "La password vecchia non è corretta.",
  "Das aktuelle Passwort stimmt nicht.": "La password attuale non è corretta.",
  "Passwort konnte nicht geändert werden. Ist der Server erreichbar?":
    "Non è stato possibile cambiare la password. Controllare la connessione a internet.",
  "Bitte alle drei Felder ausfüllen.": "Bisogna compilare tutti e tre i campi.",
  "Dieser Link ist abgelaufen oder wurde schon benutzt. Fordere in deinem Konto einen neuen an.":
    "Questo link è scaduto o è già stato usato. Chiedine uno nuovo nel tuo account.",
  "Dieser Link ist abgelaufen oder wurde schon benutzt.": "Questo link è scaduto o è già stato usato.",
  "Link abgelaufen oder Passwort falsch.": "Il link è scaduto o la password non è corretta.",
  "Der Wechsel konnte nicht angestoßen werden. Ist die Adresse schon vergeben?":
    "Non è stato possibile avviare il cambio. Questo indirizzo è forse già in uso?",
  "Das Konto konnte nicht gelöscht werden.": "Non è stato possibile eliminare l'account.",
  "Das hat nicht geklappt.": "Non ha funzionato.",
  "Das hat nicht geklappt. Bitte versuch es noch einmal.": "Non ha funzionato. Riprova.",
  "Kein Einladungscode übermittelt.": "Non è arrivato nessun codice di invito.",
  "Diese Einladung gibt es nicht.": "Questo invito non esiste.",
  "Diese Einladung wurde zurückgezogen.": "Questo invito è stato ritirato.",
  "Diese Einladung ist abgelaufen. Bitte bei der Lehrkraft eine neue anfordern.":
    "Questo invito è scaduto. Chiederne uno nuovo all'insegnante.",
  "Bitte zuerst anmelden oder ein Konto anlegen.": "Prima bisogna accedere o creare un account.",
  "Diese Einladung wurde bereits von einem anderen Konto eingelöst.":
    "Questo invito è già stato accettato da un altro account.",
  "Diese Klasse gibt es nicht mehr.": "Questa classe non esiste più.",
  "Das hat gerade nicht geklappt.": "Questa volta non ha funzionato.",
  "Bitte als Lehrkraft anmelden.": "Accedere con un account da insegnante.",
  "Einladung konnte nicht angelegt werden.": "Non è stato possibile creare l'invito.",
  "Kein Klassencode übermittelt.": "Non è arrivato nessun codice classe.",
  "Diese Klasse gibt es nicht.": "Questa classe non esiste.",
  "Diese Klasse gehört einer anderen Lehrkraft.": "Questa classe appartiene a un'altra persona che insegna.",
  "Diese Lehrkraft ist bereits Eigentümer:in der Klasse.": "Questa persona è già titolare della classe.",
  "Lehrkraft konnte nicht hinzugefügt werden.": "Non è stato possibile aggiungere la persona che insegna.",
  "Keine Lehrkraft angegeben.": "Non è stata indicata nessuna persona che insegna.",
  "Die Eigentümer:in lässt sich nicht entfernen. Wenn nötig, die Klasse löschen.":
    "Il titolare della classe non si può togliere. Se serve, eliminare la classe.",
  "Dieses Kind gehört nicht zu einer Ihrer Klassen.": "Questa persona non fa parte di nessuna delle proprie classi.",
  "Bitte den Klassencode der neuen Klasse eingeben.": "Scrivere il codice classe della classe nuova.",
  "Das Kind ist schon in der Klasse mit diesem Klassencode.": "La persona è già nella classe con questo codice classe.",
  "Das Kind konnte nicht verschoben werden. Es ist nichts geändert.":
    "Non è stato possibile spostare la persona. Non è cambiato niente.",
  "Bitte einen Klassencode eingeben - mit ihm melden sich die Kinder an.":
    "Scrivere un codice classe - gli alunni accedono con questo codice.",
  "Der Klassencode darf 2 bis 12 Zeichen haben: Buchstaben, Ziffern, Punkt oder Bindestrich.":
    "Il codice classe può avere da 2 a 12 caratteri: lettere, numeri, punto o trattino.",
  "Bitte einen Klassennamen angeben.": "Manca il nome della classe.",
  "Diesen Klassencode gibt es schon, bitte einen anderen wählen.": "Questo codice classe esiste già - sceglierne un altro.",
  "Diesen Klassennamen haben Sie schon vergeben. Bitte wählen Sie einen anderen Namen.":
    "C'è già una classe con questo nome. Scegliere un altro nome.",
  "Diesen Klassencode gibt es schon - bitte wählen Sie einen anderen Klassencode (der Klassenname darf gerne bleiben).":
    "Questo codice classe esiste già - sceglierne un altro (il nome della classe può restare uguale).",
  "Die Klasse konnte nicht geändert werden. Es ist nichts geändert.":
    "Non è stato possibile modificare la classe. Non è cambiato niente.",
  "Bitte einen Klassencode angeben - mit ihm melden sich die Kinder an.":
    "Scrivere un codice classe - gli alunni accedono con questo codice.",
  "Ein Klassenmatch kann nur ein Kind einer Klasse ausschreiben.":
    "Solo chi fa parte di una classe può lanciare una Gara di classe.",
  "Ein Klassenmatch gibt es nur in einer Klasse.": "La Gara di classe esiste solo dentro una classe.",
  "Eure Lehrkraft hat das Klassenmatch für diese Klasse ausgeschaltet.":
    "L'insegnante ha disattivato la Gara di classe per questa classe.",
  // ★ 02.10.2026 „Ein Kind, ein Match" und Beitreten (tt_match_lib.pb.js) - liest das KIND.
  "Du hast schon ein Klassenmatch ausgeschrieben, das noch offen ist. Ein zweites geht erst, wenn es vorbei ist.":
    "Hai già proposto una Gara di classe che è ancora aperta. Potrai proporne un'altra quando sarà finita.",
  "Du bist schon in einem anderen Klassenmatch dabei. Ein zweites geht erst, wenn es vorbei ist.":
    "Partecipi già a un'altra Gara di classe. Potrai unirti a una nuova quando sarà finita.",
  "Dieses Klassenmatch ist schon vorbei.": "Questa Gara di classe è già finita.",
  "Dieses Klassenmatch gibt es nicht (mehr).": "Questa Gara di classe non esiste (più).",
  "Klasse konnte nicht angelegt werden. Ist der Server erreichbar?":
    "Non è stato possibile creare la classe. Controllare la connessione a internet.",
  "Die Klasse wurde geändert, konnte aber nicht neu gelesen werden. Bitte die Seite neu laden.":
    "La classe è stata modificata, ma non è stato possibile rileggerla. Ricaricare la pagina.",
  "Klasse konnte nicht gelöscht werden.": "Non è stato possibile eliminare la classe.",
  "Diesen Code gibt es schon, bitte einen anderen wählen.": "Questo codice classe esiste già - sceglierne un altro.",
  "Bitte zuerst als Lehrkraft anmelden.": "Prima accedere con un account da insegnante.",
  "Diesen Namen gibt es in der Klasse schon.": "Nella classe c'è già qualcuno con questo nome.",
  "Die Kontakt-E-Mail konnte nicht gespeichert werden.": "Non è stato possibile salvare l'email di contatto.",
  "Passwort konnte nicht gesetzt werden (mindestens 4 Zeichen).":
    "Non è stato possibile salvare la password (almeno 4 caratteri).",
  "Passwort konnte nicht zurückgesetzt werden.": "Non è stato possibile reimpostare la password.",
  "Die Eigentümer:in lässt sich nicht entfernen.": "Il titolare della classe non si può togliere.",
  "Die Meldung ist leer.": "La segnalazione è vuota.",
  "Es sind schon mehrere Meldungen unterwegs. Bitte versuchen Sie es in einer Stunde noch einmal.":
    "Ci sono già diverse segnalazioni in arrivo. Riprovare tra un'ora.",
  "Aktion fehlgeschlagen. Ist der Server erreichbar?": "Non ha funzionato. Controllare la connessione a internet.",
};

const MUSTER_IT: readonly [RegExp, (m: RegExpMatchArray) => string][] = [
  [/^Das Passwort braucht mindestens (\d+) Zeichen\.$/, (m) => `La password deve avere almeno ${m[1]} caratteri.`],
  [
    /^Das neue Passwort braucht mindestens (\d+) Zeichen\.$/,
    (m) => `La password nuova deve avere almeno ${m[1]} caratteri.`,
  ],
  [
    /^Das Passwort muss mindestens (\d+) Zeichen lang sein\.$/,
    (m) => `La password deve avere almeno ${m[1]} caratteri.`,
  ],
  [
    /^Aktion fehlgeschlagen \((\d+)\)\. Bitte erneut versuchen\.$/,
    (m) => `Non ha funzionato (${m[1]}). Riprovare.`,
  ],
  [
    /^Eine Klasse mit dem Klassencode „(.+)\u201C gibt es nicht\. Bitte den Code prüfen\.$/,
    (m) => `Non c'è nessuna classe con il codice classe "${m[1]}". Controlla il codice.`,
  ],
  [
    /^In der Klasse „(.+)\u201C sind bereits (\d+) Kinder\. Mehr als (\d+) sind je Klasse nicht vorgesehen\.$/,
    (m) => `La classe "${m[1]}" ha già ${m[2]} alunni. Una classe non può averne più di ${m[3]}.`,
  ],
  [
    /^In der neuen Klasse gibt es schon ein Kind mit dem Namen „(.+)\u201C\. Ändern Sie zuerst den Namen eines der beiden Kinder\.$/,
    (m) =>
      `Nella classe nuova c'è già qualcuno che si chiama "${m[1]}". Prima cambiare il nome di una delle due persone.`,
  ],
  [
    /^Mehr als (\d+) Klassen sind je Konto nicht vorgesehen\. Brauchst du wirklich mehr, melde dich bitte - dann heben wir die Grenze an\.$/,
    (m) =>
      `Un account non può avere più di ${m[1]} classi. Se ne servono davvero di più, scriveteci - alzeremo il limite.`,
  ],
  [
    /^In dieser Klasse sind bereits (\d+) Kinder\. Mehr als (\d+) sind je Klasse nicht vorgesehen - lege bitte eine zweite Klasse an\.$/,
    (m) =>
      `Questa classe ha già ${m[1]} alunni. Una classe non può averne più di ${m[2]} - creare una seconda classe.`,
  ],
];

/** ★ O-IT: die italienische Fassung eines Server-Satzes - oder `null` (dann bleibt er deutsch mit `lang="de"`). */
export function serverMeldungItalienisch(text: string): string | null {
  const sauber = text.trim();
  const fest = SERVER_MELDUNGEN_IT[sauber];
  if (fest) return fest;
  for (const [muster, bau] of MUSTER_IT) {
    const m = sauber.match(muster);
    if (m) return bau(m);
  }
  return null;
}

/**
 * ★★ O-PL (02.10.2026): DIESELBEN SERVER-SÄTZE AUF POLNISCH - bis dahin bekam
 * die polnische Bedienung hier die ENGLISCHEN Sätze. Aus der Funktion
 * geschrieben, nicht übersetzt (Glossar `recherche-polnisch-2026-10-02/
 * GLOSSAR-pl.md`): ty-Befehlsform für alle, auch für Lehrkräfte (Regel 1, nie
 * „Pan/Pani"), Beschreibungen unpersönlich („Nie udało się …", „Niczego nie
 * zmieniono."); nie das Geschlecht raten - keine Vergangenheit in der 2. Person
 * (Regel 2), das Kind in der Lehrkraft-Sicht ist „osoba", die Lehrkraft
 * „osoba prowadząca klasę". „kod klasy", „konto dla nauczycieli", „Wyścig
 * klasowy", „zgłoszenie" (Zgłoś), Anführung „…” (Regel 8). Der Wächter
 * verlangt für JEDEN englischen Schlüssel einen polnischen.
 */
export const SERVER_MELDUNGEN_PL: Readonly<Record<string, string>> = {
  "Bitte einen Namen angeben.": "Wpisz imię.",
  "Bitte eine gültige E-Mail angeben.": "Wpisz poprawny adres e-mail.",
  "Für diese E-Mail gibt es schon ein Konto.": "Konto z tym adresem e-mail już istnieje.",
  "Konto konnte nicht erstellt werden. Ist der Server erreichbar?":
    "Nie udało się założyć konta. Sprawdź połączenie z internetem.",
  "E-Mail oder Passwort stimmt nicht.": "Adres e-mail lub hasło jest nieprawidłowe.",
  "Klassencode, Name oder Passwort stimmt nicht.": "Kod klasy, imię lub hasło jest nieprawidłowe.",
  "Bitte gib deinen Namen an.": "Wpisz swoje imię.",
  "Bitte gib eine gültige E-Mail-Adresse an.": "Wpisz poprawny adres e-mail.",
  "Mit dieser E-Mail-Adresse gibt es schon ein Konto. Melde dich an oder nimm eine andere Adresse.":
    "Konto z tym adresem e-mail już istnieje. Zaloguj się albo użyj innego adresu.",
  "Das Konto konnte nicht angelegt werden.": "Nie udało się założyć konta.",
  "E-Mail-Adresse oder Passwort stimmt nicht.": "Adres e-mail lub hasło jest nieprawidłowe.",
  "Ein eigenes Konto braucht eine Verbindung zum Server.": "Konto prywatne wymaga połączenia z serwerem.",
  "Dafür braucht es eine Verbindung zum Server.": "Do tego potrzebne jest połączenie z serwerem.",
  "Die beiden Passwörter stimmen nicht überein.": "Hasła nie są takie same.",
  "Die beiden neuen Passwörter stimmen nicht überein.": "Nowe hasła nie są takie same.",
  "Nicht angemeldet.": "Nie zalogowano.",
  "Bitte zuerst anmelden.": "Najpierw zaloguj się.",
  "Konto nicht gefunden.": "Nie znaleziono konta.",
  "Dieses Konto gibt es nicht.": "To konto nie istnieje.",
  "Der Link ist ungültig oder abgelaufen. Bitte fordere einen neuen an.":
    "Ten link jest nieprawidłowy lub wygasł. Poproś o nowy.",
  "Das Passwort konnte nicht gesetzt werden. Ist der Server erreichbar?":
    "Nie udało się ustawić hasła. Sprawdź połączenie z internetem.",
  "Der Link ist abgelaufen oder wurde schon benutzt.": "Link wygasł albo został już użyty.",
  "Das Zurücksetzen funktioniert nur mit einem Server-Konto.":
    "Nowe hasło można ustawić tylko dla konta na serwerze.",
  "Das alte Passwort stimmt nicht.": "Stare hasło jest nieprawidłowe.",
  "Das aktuelle Passwort stimmt nicht.": "Obecne hasło jest nieprawidłowe.",
  "Passwort konnte nicht geändert werden. Ist der Server erreichbar?":
    "Nie udało się zmienić hasła. Sprawdź połączenie z internetem.",
  "Bitte alle drei Felder ausfüllen.": "Wypełnij wszystkie trzy pola.",
  "Dieser Link ist abgelaufen oder wurde schon benutzt. Fordere in deinem Konto einen neuen an.":
    "Ten link wygasł albo został już użyty. Poproś o nowy w ustawieniach konta.",
  "Dieser Link ist abgelaufen oder wurde schon benutzt.": "Ten link wygasł albo został już użyty.",
  "Link abgelaufen oder Passwort falsch.": "Link wygasł albo hasło jest nieprawidłowe.",
  "Der Wechsel konnte nicht angestoßen werden. Ist die Adresse schon vergeben?":
    "Nie udało się rozpocząć zmiany adresu. Czy ten adres jest już zajęty?",
  "Das Konto konnte nicht gelöscht werden.": "Nie udało się usunąć konta.",
  "Das hat nicht geklappt.": "Nie udało się.",
  "Das hat nicht geklappt. Bitte versuch es noch einmal.": "Nie udało się. Spróbuj ponownie.",
  "Kein Einladungscode übermittelt.": "Nie przesłano kodu zaproszenia.",
  "Diese Einladung gibt es nicht.": "To zaproszenie nie istnieje.",
  "Diese Einladung wurde zurückgezogen.": "To zaproszenie zostało wycofane.",
  "Diese Einladung ist abgelaufen. Bitte bei der Lehrkraft eine neue anfordern.":
    "To zaproszenie wygasło. Poproś osobę prowadzącą klasę o nowe.",
  "Bitte zuerst anmelden oder ein Konto anlegen.": "Najpierw zaloguj się albo załóż konto.",
  "Diese Einladung wurde bereits von einem anderen Konto eingelöst.":
    "To zaproszenie zostało już przyjęte z innego konta.",
  "Diese Klasse gibt es nicht mehr.": "Ta klasa już nie istnieje.",
  "Das hat gerade nicht geklappt.": "Tym razem się nie udało.",
  "Bitte als Lehrkraft anmelden.": "Zaloguj się na konto dla nauczycieli.",
  "Einladung konnte nicht angelegt werden.": "Nie udało się utworzyć zaproszenia.",
  "Kein Klassencode übermittelt.": "Nie przesłano kodu klasy.",
  "Diese Klasse gibt es nicht.": "Ta klasa nie istnieje.",
  "Diese Klasse gehört einer anderen Lehrkraft.": "Tę klasę prowadzi inna osoba.",
  // „Eigentümer:in" ⇒ die Person, von deren Konto die Klasse stammt - ohne
  // Personen-Nomen („właściciel" wäre männlich, Regel 2).
  "Diese Lehrkraft ist bereits Eigentümer:in der Klasse.": "Klasa należy już do konta tej osoby.",
  "Lehrkraft konnte nicht hinzugefügt werden.": "Nie udało się dodać drugiej osoby prowadzącej.",
  "Keine Lehrkraft angegeben.": "Nie wskazano osoby prowadzącej.",
  "Die Eigentümer:in lässt sich nicht entfernen. Wenn nötig, die Klasse löschen.":
    "Nie można odłączyć osoby, do której konta należy klasa. W razie potrzeby usuń klasę.",
  "Dieses Kind gehört nicht zu einer Ihrer Klassen.": "Tej osoby nie ma w żadnej z prowadzonych klas.",
  "Bitte den Klassencode der neuen Klasse eingeben.": "Wpisz kod nowej klasy.",
  "Das Kind ist schon in der Klasse mit diesem Klassencode.": "Ta osoba jest już w klasie z tym kodem.",
  "Das Kind konnte nicht verschoben werden. Es ist nichts geändert.":
    "Nie udało się przenieść tej osoby. Niczego nie zmieniono.",
  "Bitte einen Klassencode eingeben - mit ihm melden sich die Kinder an.":
    "Wpisz kod klasy - uczniowie logują się za jego pomocą.",
  "Der Klassencode darf 2 bis 12 Zeichen haben: Buchstaben, Ziffern, Punkt oder Bindestrich.":
    "Kod klasy może mieć od 2 do 12 znaków. Dozwolone są litery, cyfry, kropka i łącznik.",
  "Bitte einen Klassennamen angeben.": "Wpisz nazwę klasy.",
  "Diesen Klassencode gibt es schon, bitte einen anderen wählen.": "Ten kod klasy jest już zajęty - wybierz inny.",
  "Diesen Klassennamen haben Sie schon vergeben. Bitte wählen Sie einen anderen Namen.":
    "Masz już klasę o tej nazwie. Wybierz inną nazwę.",
  "Diesen Klassencode gibt es schon - bitte wählen Sie einen anderen Klassencode (der Klassenname darf gerne bleiben).":
    "Ten kod klasy jest już zajęty - wybierz inny kod (nazwa klasy może zostać bez zmian).",
  "Die Klasse konnte nicht geändert werden. Es ist nichts geändert.":
    "Nie udało się zmienić klasy. Niczego nie zmieniono.",
  "Bitte einen Klassencode angeben - mit ihm melden sich die Kinder an.":
    "Wpisz kod klasy - uczniowie logują się za jego pomocą.",
  // Klassenmatch - liest das KIND. Ohne „zrobiłeś" (Regel 2), die Lehrkraft
  // unpersönlich („w ustawieniach klasy").
  "Ein Klassenmatch kann nur ein Kind einer Klasse ausschreiben.":
    "Do Wyścigu klasowego może zaprosić tylko ktoś z klasy.",
  "Ein Klassenmatch gibt es nur in einer Klasse.": "Wyścig klasowy jest możliwy tylko w klasie.",
  "Eure Lehrkraft hat das Klassenmatch für diese Klasse ausgeschaltet.":
    "W ustawieniach waszej klasy Wyścig klasowy jest wyłączony.",
  "Du hast schon ein Klassenmatch ausgeschrieben, das noch offen ist. Ein zweites geht erst, wenn es vorbei ist.":
    "Twoje zaproszenie do Wyścigu klasowego jest jeszcze otwarte. Kolejny wyścig możesz ogłosić, gdy ten się skończy.",
  "Du bist schon in einem anderen Klassenmatch dabei. Ein zweites geht erst, wenn es vorbei ist.":
    "Bierzesz już udział w innym Wyścigu klasowym. Do nowego możesz dołączyć, gdy tamten się skończy.",
  "Dieses Klassenmatch ist schon vorbei.": "Ten Wyścig klasowy już się skończył.",
  "Dieses Klassenmatch gibt es nicht (mehr).": "Ten Wyścig klasowy nie istnieje albo już się skończył.",
  "Klasse konnte nicht angelegt werden. Ist der Server erreichbar?":
    "Nie udało się utworzyć klasy. Sprawdź połączenie z internetem.",
  "Die Klasse wurde geändert, konnte aber nicht neu gelesen werden. Bitte die Seite neu laden.":
    "Zmieniono klasę, ale nie udało się jej ponownie wczytać. Odśwież stronę.",
  "Klasse konnte nicht gelöscht werden.": "Nie udało się usunąć klasy.",
  "Diesen Code gibt es schon, bitte einen anderen wählen.": "Ten kod klasy jest już zajęty - wybierz inny.",
  "Bitte zuerst als Lehrkraft anmelden.": "Najpierw zaloguj się na konto dla nauczycieli.",
  "Diesen Namen gibt es in der Klasse schon.": "W tej klasie jest już osoba o tym imieniu.",
  "Die Kontakt-E-Mail konnte nicht gespeichert werden.": "Nie udało się zapisać kontaktowego adresu e-mail.",
  "Passwort konnte nicht gesetzt werden (mindestens 4 Zeichen).":
    "Nie udało się ustawić hasła (hasło musi mieć co najmniej 4 znaki).",
  "Passwort konnte nicht zurückgesetzt werden.": "Nie udało się ustawić nowego hasła.",
  "Die Eigentümer:in lässt sich nicht entfernen.": "Nie można odłączyć osoby, do której konta należy klasa.",
  "Die Meldung ist leer.": "Zgłoszenie jest puste.",
  "Es sind schon mehrere Meldungen unterwegs. Bitte versuchen Sie es in einer Stunde noch einmal.":
    "Wysłano już kilka zgłoszeń. Spróbuj ponownie za godzinę.",
  "Aktion fehlgeschlagen. Ist der Server erreichbar?": "Nie udało się. Sprawdź połączenie z internetem.",
};

/**
 * ★ O-PL: die vier polnischen Mehrzahlformen (Glossar §2.10a) - über
 * `Intl.PluralRules("pl-PL")`, nie über `n === 1`. Eigene kleine Weiche statt
 * `mehrzahl` aus `bedienSprache/texte.ts`, damit diese Tabelle ohne die
 * Sprach- und Lernweg-Module auskommt (sie lädt sonst nur einen Typ). Die
 * GANZE Wendung steht in jeder Form („jest już 5 osób", „są już 2 osoby").
 */
function plMehrzahl(
  zahl: string,
  formen: { one: string; few: string; many: string; other: string },
): string {
  const regel = new Intl.PluralRules("pl-PL").select(Number(zahl));
  const form = regel === "one" || regel === "few" || regel === "many" ? formen[regel] : formen.other;
  return form.replace("#", zahl);
}

/** „co najmniej 1 znak · 2 znaki · 5 znaków" (Akkusativ = Nominativ, `znak` ist unbelebt). */
const znakiPl = (n: string) =>
  plMehrzahl(n, { one: "# znak", few: "# znaki", many: "# znaków", other: "# znaku" });
/** „jest już 1 osoba · są już 2 osoby · jest już 5 osób" - Verb und Nomen gehören zur Form. */
const jestOsobPl = (n: string) =>
  plMehrzahl(n, { one: "jest już # osoba", few: "są już # osoby", many: "jest już # osób", other: "jest już # osoby" });

const MUSTER_PL: readonly [RegExp, (m: RegExpMatchArray) => string][] = [
  [/^Das Passwort braucht mindestens (\d+) Zeichen\.$/, (m) => `Hasło musi mieć co najmniej ${znakiPl(m[1])}.`],
  [
    /^Das neue Passwort braucht mindestens (\d+) Zeichen\.$/,
    (m) => `Nowe hasło musi mieć co najmniej ${znakiPl(m[1])}.`,
  ],
  [
    /^Das Passwort muss mindestens (\d+) Zeichen lang sein\.$/,
    (m) => `Hasło musi mieć co najmniej ${znakiPl(m[1])}.`,
  ],
  [/^Aktion fehlgeschlagen \((\d+)\)\. Bitte erneut versuchen\.$/, (m) => `Nie udało się (${m[1]}). Spróbuj ponownie.`],
  // Codes und Namen bleiben im Nominativ, darum „z kodem „…”" und „o imieniu „…”" (Regel 11).
  [
    /^Eine Klasse mit dem Klassencode „(.+)“ gibt es nicht\. Bitte den Code prüfen\.$/,
    (m) => `Nie ma klasy z kodem „${m[1]}”. Sprawdź kod.`,
  ],
  // Die Grenze nach einem Doppelpunkt - so bleibt die Zahl in der Nominativ-Stelle (Glossar §2.10a).
  [
    /^In der Klasse „(.+)“ sind bereits (\d+) Kinder\. Mehr als (\d+) sind je Klasse nicht vorgesehen\.$/,
    (m) => `W klasie „${m[1]}” ${jestOsobPl(m[2])}. Największa liczba osób w klasie: ${m[3]}.`,
  ],
  [
    /^In der neuen Klasse gibt es schon ein Kind mit dem Namen „(.+)“\. Ändern Sie zuerst den Namen eines der beiden Kinder\.$/,
    (m) => `W nowej klasie jest już osoba o imieniu „${m[1]}”. Najpierw zmień imię jednej z tych dwóch osób.`,
  ],
  [
    /^Mehr als (\d+) Klassen sind je Konto nicht vorgesehen\. Brauchst du wirklich mehr, melde dich bitte - dann heben wir die Grenze an\.$/,
    (m) =>
      `Największa liczba klas na jednym koncie: ${m[1]}. Jeśli naprawdę potrzebujesz więcej, napisz do nas - podniesiemy limit.`,
  ],
  [
    /^In dieser Klasse sind bereits (\d+) Kinder\. Mehr als (\d+) sind je Klasse nicht vorgesehen - lege bitte eine zweite Klasse an\.$/,
    (m) => `W tej klasie ${jestOsobPl(m[1])}. Największa liczba osób w klasie: ${m[2]} - utwórz drugą klasę.`,
  ],
];

/** ★ O-PL: die polnische Fassung eines Server-Satzes - oder `null` (dann bleibt er deutsch mit `lang="de"`). */
export function serverMeldungPolnisch(text: string): string | null {
  const sauber = text.trim();
  const fest = SERVER_MELDUNGEN_PL[sauber];
  if (fest) return fest;
  for (const [muster, bau] of MUSTER_PL) {
    const m = sauber.match(muster);
    if (m) return bau(m);
  }
  return null;
}

/**
 * ★★ O-TR (02.10.2026): DIESELBEN SERVER-SÄTZE AUF TÜRKISCH - bis dahin bekam
 * die türkische Bedienung hier die ENGLISCHEN Sätze. Aus der Funktion
 * geschrieben, nicht übersetzt (Glossar `recherche-tuerkisch-2026-10-02/
 * GLOSSAR-tr.md`): wo der deutsche Satz „du" sagt (Kind, Selbstlernende), steht
 * sen („Adını yaz."); wo er „Sie" sagt oder die Klassenverwaltung spricht
 * (Lehrkraft), siz mit -(y)In („seçin", nie „seçiniz"); wo er ohne Anrede
 * auskommt, ein Satz ohne Person („Hesap oluşturulamadı."). KEINE Endung an
 * einem eingesetzten Wert (Regel 6): Code, Name und Zahl stehen nach einem
 * Doppelpunkt oder vor einem festen Wort („en az 6 karakter"); nach einer Zahl
 * Einzahl („30 öğrenci", Regel 5). „sınıf kodu", „öğretmen", „öğrenci",
 * „Sınıf Maçı", „bildirim" (Sorun bildir), Anführung gerade "..." (Regel 7).
 * Der Wächter verlangt für JEDEN englischen Schlüssel einen türkischen.
 */
export const SERVER_MELDUNGEN_TR: Readonly<Record<string, string>> = {
  "Bitte einen Namen angeben.": "Ad gerekli.",
  "Bitte eine gültige E-Mail angeben.": "Geçerli bir e-posta adresi gerekli.",
  "Für diese E-Mail gibt es schon ein Konto.": "Bu e-posta adresiyle açılmış bir hesap zaten var.",
  "Konto konnte nicht erstellt werden. Ist der Server erreichbar?":
    "Hesap oluşturulamadı. İnternet bağlantısı çalışıyor mu?",
  "E-Mail oder Passwort stimmt nicht.": "E-posta adresi veya şifre yanlış.",
  "Klassencode, Name oder Passwort stimmt nicht.": "Sınıf kodu, ad veya şifre yanlış.",
  "Bitte gib deinen Namen an.": "Adını yaz.",
  "Bitte gib eine gültige E-Mail-Adresse an.": "Geçerli bir e-posta adresi yaz.",
  "Mit dieser E-Mail-Adresse gibt es schon ein Konto. Melde dich an oder nimm eine andere Adresse.":
    "Bu e-posta adresiyle açılmış bir hesap zaten var. Giriş yap veya başka bir adres kullan.",
  "Das Konto konnte nicht angelegt werden.": "Hesap oluşturulamadı.",
  "E-Mail-Adresse oder Passwort stimmt nicht.": "E-posta adresi veya şifre yanlış.",
  "Ein eigenes Konto braucht eine Verbindung zum Server.": "Kişisel hesap için sunucu bağlantısı gerekli.",
  "Dafür braucht es eine Verbindung zum Server.": "Bunun için sunucu bağlantısı gerekli.",
  "Die beiden Passwörter stimmen nicht überein.": "İki şifre aynı değil.",
  "Die beiden neuen Passwörter stimmen nicht überein.": "İki yeni şifre aynı değil.",
  "Nicht angemeldet.": "Giriş yapılmadı.",
  "Bitte zuerst anmelden.": "Önce giriş yapmak gerekiyor.",
  "Konto nicht gefunden.": "Hesap bulunamadı.",
  "Dieses Konto gibt es nicht.": "Böyle bir hesap yok.",
  "Der Link ist ungültig oder abgelaufen. Bitte fordere einen neuen an.":
    "Bu bağlantı geçersiz veya süresi dolmuş. Yeni bir bağlantı iste.",
  "Das Passwort konnte nicht gesetzt werden. Ist der Server erreichbar?":
    "Şifre kaydedilemedi. İnternet bağlantısı çalışıyor mu?",
  "Der Link ist abgelaufen oder wurde schon benutzt.":
    "Bağlantının süresi dolmuş veya bağlantı daha önce kullanılmış.",
  "Das Zurücksetzen funktioniert nur mit einem Server-Konto.":
    "Şifre yalnızca sunucudaki bir hesap için sıfırlanabilir.",
  "Das alte Passwort stimmt nicht.": "Eski şifre yanlış.",
  "Das aktuelle Passwort stimmt nicht.": "Şu anki şifre yanlış.",
  "Passwort konnte nicht geändert werden. Ist der Server erreichbar?":
    "Şifre değiştirilemedi. İnternet bağlantısı çalışıyor mu?",
  "Bitte alle drei Felder ausfüllen.": "Üç alanın üçü de doldurulmalı.",
  "Dieser Link ist abgelaufen oder wurde schon benutzt. Fordere in deinem Konto einen neuen an.":
    "Bu bağlantının süresi dolmuş veya bağlantı daha önce kullanılmış. Hesabından yeni bir bağlantı iste.",
  "Dieser Link ist abgelaufen oder wurde schon benutzt.":
    "Bu bağlantının süresi dolmuş veya bağlantı daha önce kullanılmış.",
  "Link abgelaufen oder Passwort falsch.": "Bağlantının süresi dolmuş veya şifre yanlış.",
  "Der Wechsel konnte nicht angestoßen werden. Ist die Adresse schon vergeben?":
    "Adres değişikliği başlatılamadı. Bu adres başka bir hesapta kullanılıyor olabilir.",
  "Das Konto konnte nicht gelöscht werden.": "Hesap silinemedi.",
  "Das hat nicht geklappt.": "İşlem tamamlanamadı.",
  "Das hat nicht geklappt. Bitte versuch es noch einmal.": "İşlem tamamlanamadı. Tekrar dene.",
  // Einladung als ortak öğretmen - liest eine Lehrkraft: siz.
  "Kein Einladungscode übermittelt.": "Davet kodu gönderilmedi.",
  "Diese Einladung gibt es nicht.": "Böyle bir davet yok.",
  "Diese Einladung wurde zurückgezogen.": "Bu davet geri çekildi.",
  "Diese Einladung ist abgelaufen. Bitte bei der Lehrkraft eine neue anfordern.":
    "Bu davetin süresi dolmuş. Sınıfın öğretmeninden yeni bir davet isteyin.",
  "Bitte zuerst anmelden oder ein Konto anlegen.": "Önce giriş yapın veya bir hesap oluşturun.",
  "Diese Einladung wurde bereits von einem anderen Konto eingelöst.":
    "Bu davet başka bir hesap tarafından zaten kabul edildi.",
  "Diese Klasse gibt es nicht mehr.": "Bu sınıf artık yok.",
  "Das hat gerade nicht geklappt.": "İşlem şu anda yapılamadı.",
  "Bitte als Lehrkraft anmelden.": "Öğretmen hesabıyla giriş yapın.",
  "Einladung konnte nicht angelegt werden.": "Davet oluşturulamadı.",
  "Kein Klassencode übermittelt.": "Sınıf kodu gönderilmedi.",
  "Diese Klasse gibt es nicht.": "Böyle bir sınıf yok.",
  "Diese Klasse gehört einer anderen Lehrkraft.": "Bu sınıf başka bir öğretmene ait.",
  "Diese Lehrkraft ist bereits Eigentümer:in der Klasse.": "Bu öğretmen zaten sınıfın sahibi.",
  "Lehrkraft konnte nicht hinzugefügt werden.": "Öğretmen eklenemedi.",
  "Keine Lehrkraft angegeben.": "Öğretmen seçilmedi.",
  // Entfernen = „kaldır" (Glossar Regel 10), die Klasse löschen = „sil".
  "Die Eigentümer:in lässt sich nicht entfernen. Wenn nötig, die Klasse löschen.":
    "Sınıfın sahibi kaldırılamaz. Gerekirse sınıfı silin.",
  "Dieses Kind gehört nicht zu einer Ihrer Klassen.": "Bu öğrenci sınıflarınızın hiçbirinde değil.",
  "Bitte den Klassencode der neuen Klasse eingeben.": "Yeni sınıfın sınıf kodunu girin.",
  "Das Kind ist schon in der Klasse mit diesem Klassencode.": "Bu öğrenci zaten o sınıfta.",
  "Das Kind konnte nicht verschoben werden. Es ist nichts geändert.":
    "Öğrenci taşınamadı. Hiçbir şey değişmedi.",
  "Bitte einen Klassencode eingeben - mit ihm melden sich die Kinder an.":
    "Bir sınıf kodu girin - öğrenciler bu kodla giriş yapar.",
  "Der Klassencode darf 2 bis 12 Zeichen haben: Buchstaben, Ziffern, Punkt oder Bindestrich.":
    "Sınıf kodu 2-12 karakter uzunluğunda olabilir: harf, rakam, nokta veya kısa çizgi.",
  "Bitte einen Klassennamen angeben.": "Bir sınıf adı girin.",
  "Diesen Klassencode gibt es schon, bitte einen anderen wählen.":
    "Bu sınıf kodu zaten kullanılıyor, başka bir kod seçin.",
  "Diesen Klassennamen haben Sie schon vergeben. Bitte wählen Sie einen anderen Namen.":
    "Bu adla bir sınıfınız zaten var. Başka bir ad seçin.",
  "Diesen Klassencode gibt es schon - bitte wählen Sie einen anderen Klassencode (der Klassenname darf gerne bleiben).":
    "Bu sınıf kodu zaten kullanılıyor - başka bir sınıf kodu seçin (sınıf adı aynı kalabilir).",
  "Die Klasse konnte nicht geändert werden. Es ist nichts geändert.":
    "Sınıf değiştirilemedi. Hiçbir şey değişmedi.",
  "Bitte einen Klassencode angeben - mit ihm melden sich die Kinder an.":
    "Bir sınıf kodu girin - öğrenciler bu kodla giriş yapar.",
  // Sınıf Maçı - liest das KIND: sen; die Lehrkraft in der dritten Person,
  // ohne „öğretmeniniz" (das hiesse auch „Ihre Lehrkraft").
  "Ein Klassenmatch kann nur ein Kind einer Klasse ausschreiben.":
    "Sınıf Maçını yalnızca sınıftan biri başlatabilir.",
  "Ein Klassenmatch gibt es nur in einer Klasse.": "Sınıf Maçı yalnızca bir sınıfta yapılabilir.",
  "Eure Lehrkraft hat das Klassenmatch für diese Klasse ausgeschaltet.":
    "Bu sınıfta Sınıf Maçı öğretmen tarafından kapatıldı.",
  "Du hast schon ein Klassenmatch ausgeschrieben, das noch offen ist. Ein zweites geht erst, wenn es vorbei ist.":
    "Başlattığın Sınıf Maçı henüz bitmedi. Yenisini ancak o bitince başlatabilirsin.",
  "Du bist schon in einem anderen Klassenmatch dabei. Ein zweites geht erst, wenn es vorbei ist.":
    "Zaten başka bir Sınıf Maçındasın. Yenisine ancak o bitince katılabilirsin.",
  "Dieses Klassenmatch ist schon vorbei.": "Bu Sınıf Maçı bitti.",
  "Dieses Klassenmatch gibt es nicht (mehr).": "Bu Sınıf Maçı yok veya bitti.",
  "Klasse konnte nicht angelegt werden. Ist der Server erreichbar?":
    "Sınıf oluşturulamadı. İnternet bağlantısı çalışıyor mu?",
  "Die Klasse wurde geändert, konnte aber nicht neu gelesen werden. Bitte die Seite neu laden.":
    "Sınıf değiştirildi ama yeniden yüklenemedi. Sayfayı yenileyin.",
  "Klasse konnte nicht gelöscht werden.": "Sınıf silinemedi.",
  "Diesen Code gibt es schon, bitte einen anderen wählen.": "Bu kod zaten kullanılıyor, başka bir kod seçin.",
  "Bitte zuerst als Lehrkraft anmelden.": "Önce öğretmen hesabıyla giriş yapın.",
  "Diesen Namen gibt es in der Klasse schon.": "Sınıfta bu adla bir öğrenci zaten var.",
  "Die Kontakt-E-Mail konnte nicht gespeichert werden.": "İletişim için e-posta adresi kaydedilemedi.",
  "Passwort konnte nicht gesetzt werden (mindestens 4 Zeichen).":
    "Şifre kaydedilemedi (şifre en az 4 karakter olmalı).",
  "Passwort konnte nicht zurückgesetzt werden.": "Şifre sıfırlanamadı.",
  "Die Eigentümer:in lässt sich nicht entfernen.": "Sınıfın sahibi kaldırılamaz.",
  // „Sorun bildir" (Glossar §2.7) - die Meldung ist ein „bildirim"; der
  // deutsche Satz sagt „Sie": siz.
  "Die Meldung ist leer.": "Bildirim boş.",
  "Es sind schon mehrere Meldungen unterwegs. Bitte versuchen Sie es in einer Stunde noch einmal.":
    "Birkaç bildirim zaten gönderildi. Bir saat sonra tekrar deneyin.",
  "Aktion fehlgeschlagen. Ist der Server erreichbar?": "İşlem yapılamadı. İnternet bağlantısı çalışıyor mu?",
};

/**
 * ★ O-TR: die Sätze mit Zahl, Code oder Name. Nach einer Zahl steht die
 * Einzahl („6 karakter", „30 öğrenci", Glossar Regel 5) - darum braucht es
 * keine Mehrzahl-Weiche. Code und Name stehen hinter einem Doppelpunkt, nie
 * mit Endung (Regel 6).
 */
const MUSTER_TR: readonly [RegExp, (m: RegExpMatchArray) => string][] = [
  [/^Das Passwort braucht mindestens (\d+) Zeichen\.$/, (m) => `Şifre en az ${m[1]} karakter olmalı.`],
  [/^Das neue Passwort braucht mindestens (\d+) Zeichen\.$/, (m) => `Yeni şifre en az ${m[1]} karakter olmalı.`],
  [/^Das Passwort muss mindestens (\d+) Zeichen lang sein\.$/, (m) => `Şifre en az ${m[1]} karakter olmalı.`],
  // hookError - meist in der Klassenverwaltung, darum siz.
  [/^Aktion fehlgeschlagen \((\d+)\)\. Bitte erneut versuchen\.$/, (m) => `İşlem yapılamadı (${m[1]}). Tekrar deneyin.`],
  [
    /^Eine Klasse mit dem Klassencode „(.+)“ gibt es nicht\. Bitte den Code prüfen\.$/,
    (m) => `Şu sınıf koduyla bir sınıf bulunamadı: "${m[1]}". Kodu kontrol edin.`,
  ],
  [
    /^In der Klasse „(.+)“ sind bereits (\d+) Kinder\. Mehr als (\d+) sind je Klasse nicht vorgesehen\.$/,
    (m) => `Sınıf: "${m[1]}". Bu sınıfta zaten ${m[2]} öğrenci var. Bir sınıfta en çok ${m[3]} öğrenci olabilir.`,
  ],
  [
    /^In der neuen Klasse gibt es schon ein Kind mit dem Namen „(.+)“\. Ändern Sie zuerst den Namen eines der beiden Kinder\.$/,
    (m) => `Yeni sınıfta aynı adla bir öğrenci zaten var: "${m[1]}". Önce iki öğrenciden birinin adını değiştirin.`,
  ],
  // Der deutsche Satz duzt hier die Lehrkraft - türkisch gilt siz (Glossar Regel 1).
  [
    /^Mehr als (\d+) Klassen sind je Konto nicht vorgesehen\. Brauchst du wirklich mehr, melde dich bitte - dann heben wir die Grenze an\.$/,
    (m) =>
      `Bir hesapta en çok ${m[1]} sınıf olabilir. Gerçekten daha fazlası gerekiyorsa bize yazın - sınırı yükseltelim.`,
  ],
  [
    /^In dieser Klasse sind bereits (\d+) Kinder\. Mehr als (\d+) sind je Klasse nicht vorgesehen - lege bitte eine zweite Klasse an\.$/,
    (m) =>
      `Bu sınıfta zaten ${m[1]} öğrenci var. Bir sınıfta en çok ${m[2]} öğrenci olabilir - ikinci bir sınıf oluşturun.`,
  ],
];

/** ★ O-TR: die türkische Fassung eines Server-Satzes - oder `null` (dann bleibt er deutsch mit `lang="de"`). */
export function serverMeldungTuerkisch(text: string): string | null {
  const sauber = text.trim();
  const fest = SERVER_MELDUNGEN_TR[sauber];
  if (fest) return fest;
  for (const [muster, bau] of MUSTER_TR) {
    const m = sauber.match(muster);
    if (m) return bau(m);
  }
  return null;
}

/**
 * ★★ O-CS (03.10.2026): DIESELBEN SERVER-SÄTZE AUF TSCHECHISCH - bis dahin
 * bekam die tschechische Bedienung hier die ENGLISCHEN Sätze. Aus der Funktion
 * geschrieben, nicht übersetzt (Glossar `recherche-tschechisch-2026-10-02/
 * GLOSSAR-cs.md`): wo der deutsche Satz „du" sagt (Kind, Selbstlernende), steht
 * ty („Napiš své jméno."); wo er „Sie" sagt oder die Klassenverwaltung spricht
 * (Lehrkraft), vy in der Mehrzahlform („Zadejte kód třídy."); sonst ein Satz
 * ohne Person („Účet se nepodařilo vytvořit."). KEINE Vergangenheit in der
 * 2. Person (Regel 2), das Kind in der Lehrkraft-Sicht ist „osoba", die
 * Lehrkraft „vyučující" nur im Nominativ. Code und Name nie gebeugt: mit
 * Kopfwort („kód třídy 4B", „ve třídě 4B") oder nach einem Doppelpunkt
 * (Regel 12). Keine Anführungszeichen - die Sätze stehen oft in einem
 * Live-Bereich (Regel 7). Kein Satz endet mit Zahl und Punkt (Falle 4).
 * „Třídní závod", „Nahlásit" ⇒ „hlášení". Der Wächter verlangt für JEDEN
 * englischen Schlüssel einen tschechischen.
 */
export const SERVER_MELDUNGEN_CS: Readonly<Record<string, string>> = {
  "Bitte einen Namen angeben.": "Jméno je povinné.",
  "Bitte eine gültige E-Mail angeben.": "Je potřeba platná e-mailová adresa.",
  "Für diese E-Mail gibt es schon ein Konto.": "K této e-mailové adrese už účet existuje.",
  "Konto konnte nicht erstellt werden. Ist der Server erreichbar?":
    "Účet se nepodařilo vytvořit. Funguje připojení k internetu?",
  "E-Mail oder Passwort stimmt nicht.": "Nesprávná e-mailová adresa nebo heslo.",
  "Klassencode, Name oder Passwort stimmt nicht.": "Nesprávný kód třídy, jméno nebo heslo.",
  "Bitte gib deinen Namen an.": "Napiš své jméno.",
  "Bitte gib eine gültige E-Mail-Adresse an.": "Napiš platnou e-mailovou adresu.",
  "Mit dieser E-Mail-Adresse gibt es schon ein Konto. Melde dich an oder nimm eine andere Adresse.":
    "K této e-mailové adrese už účet existuje. Přihlas se, nebo použij jinou adresu.",
  "Das Konto konnte nicht angelegt werden.": "Účet se nepodařilo vytvořit.",
  "E-Mail-Adresse oder Passwort stimmt nicht.": "Nesprávná e-mailová adresa nebo heslo.",
  "Ein eigenes Konto braucht eine Verbindung zum Server.": "Vlastní účet potřebuje připojení k serveru.",
  "Dafür braucht es eine Verbindung zum Server.": "K tomu je potřeba připojení k serveru.",
  "Die beiden Passwörter stimmen nicht überein.": "Hesla se neshodují.",
  "Die beiden neuen Passwörter stimmen nicht überein.": "Nová hesla se neshodují.",
  // Nicht „Nejsi přihlášen" (kurzes Partizip, Regel 2) - ein Hauptwort-Satz.
  "Nicht angemeldet.": "Chybí přihlášení.",
  "Bitte zuerst anmelden.": "Nejdřív je potřeba se přihlásit.",
  "Konto nicht gefunden.": "Účet se nenašel.",
  "Dieses Konto gibt es nicht.": "Tento účet neexistuje.",
  "Der Link ist ungültig oder abgelaufen. Bitte fordere einen neuen an.":
    "Odkaz je neplatný nebo už neplatí. Požádej o nový.",
  "Das Passwort konnte nicht gesetzt werden. Ist der Server erreichbar?":
    "Heslo se nepodařilo nastavit. Funguje připojení k internetu?",
  "Der Link ist abgelaufen oder wurde schon benutzt.": "Odkaz už neplatí nebo už byl použit.",
  "Das Zurücksetzen funktioniert nur mit einem Server-Konto.":
    "Obnovit heslo jde jen u účtu na serveru.",
  "Das alte Passwort stimmt nicht.": "Staré heslo není správné.",
  "Das aktuelle Passwort stimmt nicht.": "Současné heslo není správné.",
  "Passwort konnte nicht geändert werden. Ist der Server erreichbar?":
    "Heslo se nepodařilo změnit. Funguje připojení k internetu?",
  "Bitte alle drei Felder ausfüllen.": "Je potřeba vyplnit všechna tři pole.",
  "Dieser Link ist abgelaufen oder wurde schon benutzt. Fordere in deinem Konto einen neuen an.":
    "Tento odkaz už neplatí nebo už byl použit. O nový požádej ve svém účtu.",
  "Dieser Link ist abgelaufen oder wurde schon benutzt.": "Tento odkaz už neplatí nebo už byl použit.",
  "Link abgelaufen oder Passwort falsch.": "Odkaz už neplatí nebo heslo není správné.",
  "Der Wechsel konnte nicht angestoßen werden. Ist die Adresse schon vergeben?":
    "Změnu adresy se nepodařilo zahájit. Nepoužívá tuto adresu už jiný účet?",
  "Das Konto konnte nicht gelöscht werden.": "Účet se nepodařilo odstranit.",
  "Das hat nicht geklappt.": "Nepodařilo se to.",
  "Das hat nicht geklappt. Bitte versuch es noch einmal.": "Nepodařilo se to. Zkus to znovu.",
  // Einladung als další vyučující - liest eine Lehrkraft: vy.
  "Kein Einladungscode übermittelt.": "Chybí kód pozvánky.",
  "Diese Einladung gibt es nicht.": "Tato pozvánka neexistuje.",
  "Diese Einladung wurde zurückgezogen.": "Tato pozvánka byla zrušena.",
  // „vyučující" nur im Nominativ (Glossar Regel 2) - „požádejte vyučujícího" wäre männlich.
  "Diese Einladung ist abgelaufen. Bitte bei der Lehrkraft eine neue anfordern.":
    "Tato pozvánka už neplatí. Novou pozvánku může poslat vyučující třídy.",
  "Bitte zuerst anmelden oder ein Konto anlegen.": "Nejdřív se přihlaste nebo si vytvořte účet.",
  "Diese Einladung wurde bereits von einem anderen Konto eingelöst.":
    "Tato pozvánka už byla přijata z jiného účtu.",
  "Diese Klasse gibt es nicht mehr.": "Tato třída už neexistuje.",
  "Das hat gerade nicht geklappt.": "Teď se to nepodařilo.",
  "Bitte als Lehrkraft anmelden.": "Přihlaste se účtem pro vyučující.",
  "Einladung konnte nicht angelegt werden.": "Pozvánku se nepodařilo vytvořit.",
  "Kein Klassencode übermittelt.": "Chybí kód třídy.",
  "Diese Klasse gibt es nicht.": "Tato třída neexistuje.",
  // „Eigentümer:in" ⇒ das Konto, dem die Klasse gehört - ohne Personen-Nomen
  // („vlastník" ist männlich, Regel 2).
  "Diese Klasse gehört einer anderen Lehrkraft.": "Tato třída patří k jinému účtu.",
  "Diese Lehrkraft ist bereits Eigentümer:in der Klasse.": "Tato třída už patří k účtu této osoby.",
  "Lehrkraft konnte nicht hinzugefügt werden.": "Další osobu se nepodařilo přidat ke třídě.",
  "Keine Lehrkraft angegeben.": "Není vybrána žádná osoba.",
  // Entfernen einer Person = „odebrat", die Klasse löschen = „odstranit" (Glossar Regel 10).
  "Die Eigentümer:in lässt sich nicht entfernen. Wenn nötig, die Klasse löschen.":
    "Osobu, které třída patří, nelze odebrat. V případě potřeby třídu odstraňte.",
  "Dieses Kind gehört nicht zu einer Ihrer Klassen.": "Tato osoba není v žádné z vašich tříd.",
  "Bitte den Klassencode der neuen Klasse eingeben.": "Zadejte kód nové třídy.",
  "Das Kind ist schon in der Klasse mit diesem Klassencode.": "Tato osoba už je ve třídě s tímto kódem.",
  "Das Kind konnte nicht verschoben werden. Es ist nichts geändert.":
    "Osobu se nepodařilo přesunout. Nic se nezměnilo.",
  "Bitte einen Klassencode eingeben - mit ihm melden sich die Kinder an.":
    "Zadejte kód třídy - žáci se jím přihlašují.",
  "Der Klassencode darf 2 bis 12 Zeichen haben: Buchstaben, Ziffern, Punkt oder Bindestrich.":
    "Kód třídy může mít 2-12 znaků: písmena, číslice, tečku nebo spojovník.",
  "Bitte einen Klassennamen angeben.": "Zadejte název třídy.",
  "Diesen Klassencode gibt es schon, bitte einen anderen wählen.": "Tento kód třídy už existuje. Vyberte jiný.",
  "Diesen Klassennamen haben Sie schon vergeben. Bitte wählen Sie einen anderen Namen.":
    "Třídu s tímto názvem už máte. Vyberte jiný název.",
  "Diesen Klassencode gibt es schon - bitte wählen Sie einen anderen Klassencode (der Klassenname darf gerne bleiben).":
    "Tento kód třídy už existuje - vyberte jiný kód třídy (název třídy může zůstat).",
  "Die Klasse konnte nicht geändert werden. Es ist nichts geändert.":
    "Třídu se nepodařilo změnit. Nic se nezměnilo.",
  "Bitte einen Klassencode angeben - mit ihm melden sich die Kinder an.":
    "Zadejte kód třídy - žáci se jím přihlašují.",
  // Třídní závod - liest das KIND: ty, Gegenwart und Zukunft statt
  // „vyhlásil jsi" (Regel 2); die Lehrkraft gar nicht genannt.
  "Ein Klassenmatch kann nur ein Kind einer Klasse ausschreiben.":
    "Třídní závod může vyhlásit jen někdo ze třídy.",
  "Ein Klassenmatch gibt es nur in einer Klasse.": "Třídní závod je jen ve třídě.",
  "Eure Lehrkraft hat das Klassenmatch für diese Klasse ausgeschaltet.":
    "V této třídě je Třídní závod vypnutý.",
  "Du hast schon ein Klassenmatch ausgeschrieben, das noch offen ist. Ein zweites geht erst, wenn es vorbei ist.":
    "Tvůj Třídní závod ještě neskončil. Další můžeš vyhlásit, až skončí.",
  "Du bist schon in einem anderen Klassenmatch dabei. Ein zweites geht erst, wenn es vorbei ist.":
    "Už se účastníš jiného Třídního závodu. Do dalšího se zapojíš, až ten skončí.",
  "Dieses Klassenmatch ist schon vorbei.": "Tento Třídní závod už skončil.",
  "Dieses Klassenmatch gibt es nicht (mehr).": "Tento Třídní závod neexistuje nebo už skončil.",
  "Klasse konnte nicht angelegt werden. Ist der Server erreichbar?":
    "Třídu se nepodařilo vytvořit. Funguje připojení k internetu?",
  "Die Klasse wurde geändert, konnte aber nicht neu gelesen werden. Bitte die Seite neu laden.":
    "Změna třídy se uložila, ale třídu se nepodařilo znovu načíst. Obnovte stránku.",
  "Klasse konnte nicht gelöscht werden.": "Třídu se nepodařilo odstranit.",
  "Diesen Code gibt es schon, bitte einen anderen wählen.": "Tento kód už existuje. Vyberte jiný.",
  "Bitte zuerst als Lehrkraft anmelden.": "Nejdřív se přihlaste účtem pro vyučující.",
  "Diesen Namen gibt es in der Klasse schon.": "Toto jméno už ve třídě je.",
  "Die Kontakt-E-Mail konnte nicht gespeichert werden.": "Kontaktní e-mailovou adresu se nepodařilo uložit.",
  "Passwort konnte nicht gesetzt werden (mindestens 4 Zeichen).":
    "Heslo se nepodařilo nastavit (heslo musí mít aspoň 4 znaky).",
  "Passwort konnte nicht zurückgesetzt werden.": "Heslo se nepodařilo obnovit.",
  "Die Eigentümer:in lässt sich nicht entfernen.": "Osobu, které třída patří, nelze odebrat.",
  // „Nahlásit" (Glossar §2.7) - die Meldung ist ein „hlášení"; der deutsche
  // Satz sagt „Sie": vy.
  "Die Meldung ist leer.": "Hlášení je prázdné.",
  "Es sind schon mehrere Meldungen unterwegs. Bitte versuchen Sie es in einer Stunde noch einmal.":
    "Několik hlášení už je na cestě. Zkuste to znovu za hodinu.",
  "Aktion fehlgeschlagen. Ist der Server erreichbar?": "Akce se nepodařila. Funguje připojení k internetu?",
};

/**
 * ★ O-CS: die vier tschechischen Mehrzahlformen (Glossar §2.11) - über
 * `Intl.PluralRules("cs-CZ")`, nie über `n === 1`: one = 1, few = 2-4,
 * other = 0 und 5+, many = nur Bruchzahlen. Eigene kleine Weiche wie
 * `plMehrzahl`, damit diese Tabelle ohne die Sprachmodule auskommt. Die GANZE
 * Wendung steht in jeder Form - das Verb zieht mit („je 1 osoba · jsou
 * 2 osoby · je 5 osob").
 */
function csMehrzahl(
  zahl: string,
  formen: { one: string; few: string; many: string; other: string },
): string {
  const regel = new Intl.PluralRules("cs-CZ").select(Number(zahl));
  const form = regel === "one" || regel === "few" || regel === "many" ? formen[regel] : formen.other;
  return form.replace("#", zahl);
}

/** „aspoň 1 znak · 2 znaky · 5 znaků" (Akkusativ = Nominativ, `znak` ist unbelebt). */
const znakyCs = (n: string) => csMehrzahl(n, { one: "# znak", few: "# znaky", many: "# znaku", other: "# znaků" });
/** „už je 1 osoba · už jsou 2 osoby · už je 5 osob". */
const jeOsobCs = (n: string) =>
  csMehrzahl(n, { one: "už je # osoba", few: "už jsou # osoby", many: "už je # osoby", other: "už je # osob" });
/** Akkusativ nach „mít": „nejvýš 1 osobu · 2 osoby · 30 osob". */
const osobAkkCs = (n: string) => csMehrzahl(n, { one: "# osobu", few: "# osoby", many: "# osoby", other: "# osob" });
/** Akkusativ nach „mít": „nejvýš 1 třídu · 2 třídy · 50 tříd". */
const tridAkkCs = (n: string) => csMehrzahl(n, { one: "# třídu", few: "# třídy", many: "# třídy", other: "# tříd" });

const MUSTER_CS: readonly [RegExp, (m: RegExpMatchArray) => string][] = [
  [/^Das Passwort braucht mindestens (\d+) Zeichen\.$/, (m) => `Heslo musí mít aspoň ${znakyCs(m[1])}.`],
  [/^Das neue Passwort braucht mindestens (\d+) Zeichen\.$/, (m) => `Nové heslo musí mít aspoň ${znakyCs(m[1])}.`],
  [/^Das Passwort muss mindestens (\d+) Zeichen lang sein\.$/, (m) => `Heslo musí mít aspoň ${znakyCs(m[1])}.`],
  // hookError - meist in der Klassenverwaltung, darum vy.
  [/^Aktion fehlgeschlagen \((\d+)\)\. Bitte erneut versuchen\.$/, (m) => `Akce se nepodařila (${m[1]}). Zkuste to znovu.`],
  // Code und Klassenname mit Kopfwort davor, nie gebeugt (Glossar Regel 12).
  [
    /^Eine Klasse mit dem Klassencode „(.+)“ gibt es nicht\. Bitte den Code prüfen\.$/,
    (m) => `Kód třídy ${m[1]} nepatří žádné třídě. Zkontrolujte kód.`,
  ],
  [
    /^In der Klasse „(.+)“ sind bereits (\d+) Kinder\. Mehr als (\d+) sind je Klasse nicht vorgesehen\.$/,
    (m) => `Ve třídě ${m[1]} ${jeOsobCs(m[2])}. Třída může mít nejvýš ${osobAkkCs(m[3])}.`,
  ],
  // Der Name nach einem Doppelpunkt (Glossar Regel 12).
  [
    /^In der neuen Klasse gibt es schon ein Kind mit dem Namen „(.+)“\. Ändern Sie zuerst den Namen eines der beiden Kinder\.$/,
    (m) => `V nové třídě už je osoba se stejným jménem: ${m[1]}. Nejdřív změňte jméno jedné z obou osob.`,
  ],
  // Der deutsche Satz duzt hier die Lehrkraft - tschechisch gilt vy (Glossar Regel 1).
  [
    /^Mehr als (\d+) Klassen sind je Konto nicht vorgesehen\. Brauchst du wirklich mehr, melde dich bitte - dann heben wir die Grenze an\.$/,
    (m) =>
      `Jeden účet může mít nejvýš ${tridAkkCs(m[1])}. Pokud opravdu potřebujete víc, napište nám - limit zvýšíme.`,
  ],
  [
    /^In dieser Klasse sind bereits (\d+) Kinder\. Mehr als (\d+) sind je Klasse nicht vorgesehen - lege bitte eine zweite Klasse an\.$/,
    (m) => `V této třídě ${jeOsobCs(m[1])}. Třída může mít nejvýš ${osobAkkCs(m[2])} - vytvořte druhou třídu.`,
  ],
];

/** ★ O-CS: die tschechische Fassung eines Server-Satzes - oder `null` (dann bleibt er deutsch mit `lang="de"`). */
export function serverMeldungTschechisch(text: string): string | null {
  const sauber = text.trim();
  const fest = SERVER_MELDUNGEN_CS[sauber];
  if (fest) return fest;
  for (const [muster, bau] of MUSTER_CS) {
    const m = sauber.match(muster);
    if (m) return bau(m);
  }
  return null;
}

/** ★ O2-LIB (30.10.2026): die bulgarische Fassung eines Server-Satzes - oder `null` (dann bleibt er deutsch mit `lang="de"`). */
export function serverMeldungBulgarisch(text: string): string | null {
  const sauber = text.trim();
  const fest = SERVER_MELDUNGEN_BG[sauber];
  if (fest) return fest;
  for (const [muster, bau] of MUSTER_BG) {
    const m = sauber.match(muster);
    if (m) return bau(m);
  }
  return null;
}

/**
 * ★★ O2-LIB (30.10.2026): DIESELBEN SERVER-SÄTZE AUF BULGARISCH - bis dahin bekam die bulgarische Bedienung hier die
 * ENGLISCHEN Sätze. Nach dem Glossar `recherche-bulgarisch-2026-10-25/GLOSSAR-bg.md`: wo der deutsche Satz „du" sagt
 * (Kind, Selbstlernende), steht ти („Напиши името си."); wo er „Sie" sagt oder die Klassenverwaltung spricht
 * (Lehrkraft), Вие im Imperativ auf -ете („Въведете кода на класа."); sonst ein Satz ohne Person („Акаунтът не можа да
 * бъде създаден."). Keine Vergangenheit in der 2. Person (Geschlecht), das Kind in der Lehrkraft-Sicht ist „детето"
 * (n.), die Lehrkräfte „учители" (Mehrzahl). Codes und Namen stehen mit Kopfwort („клас 4B", „код на класа 4B").
 * Keine Anführungszeichen - die Sätze stehen oft in einem Live-Bereich. Kein Satz endet mit Zahl und Punkt.
 */
export const SERVER_MELDUNGEN_BG: Readonly<Record<string, string>> = {
  "Bitte einen Namen angeben.": "Името е задължително.",
  "Bitte eine gültige E-Mail angeben.": "Необходим е валиден имейл адрес.",
  "Für diese E-Mail gibt es schon ein Konto.": "За този имейл адрес вече има акаунт.",
  "Konto konnte nicht erstellt werden. Ist der Server erreichbar?":
    "Акаунтът не можа да бъде създаден. Работи ли връзката с интернет?",
  "E-Mail oder Passwort stimmt nicht.": "Имейл адресът или паролата са неправилни.",
  "Klassencode, Name oder Passwort stimmt nicht.": "Кодът на класа, името или паролата са неправилни.",
  "Bitte gib deinen Namen an.": "Напиши името си.",
  "Bitte gib eine gültige E-Mail-Adresse an.": "Напиши валиден имейл адрес.",
  "Mit dieser E-Mail-Adresse gibt es schon ein Konto. Melde dich an oder nimm eine andere Adresse.":
    "За този имейл адрес вече има акаунт. Влез или използвай друг адрес.",
  "Das Konto konnte nicht angelegt werden.": "Акаунтът не можа да бъде създаден.",
  "E-Mail-Adresse oder Passwort stimmt nicht.": "Имейл адресът или паролата са неправилни.",
  "Ein eigenes Konto braucht eine Verbindung zum Server.": "Собственият акаунт изисква връзка със сървъра.",
  "Dafür braucht es eine Verbindung zum Server.": "За това е нужна връзка със сървъра.",
  "Die beiden Passwörter stimmen nicht überein.": "Паролите не съвпадат.",
  "Die beiden neuen Passwörter stimmen nicht überein.": "Новите пароли не съвпадат.",
  "Nicht angemeldet.": "Няма вход в акаунт.",
  "Bitte zuerst anmelden.": "Първо трябва да се влезе в акаунта.",
  "Konto nicht gefunden.": "Акаунтът не е намерен.",
  "Dieses Konto gibt es nicht.": "Този акаунт не съществува.",
  "Der Link ist ungültig oder abgelaufen. Bitte fordere einen neuen an.":
    "Връзката е невалидна или е изтекла. Поискай нова.",
  "Das Passwort konnte nicht gesetzt werden. Ist der Server erreichbar?":
    "Паролата не можа да бъде зададена. Работи ли връзката с интернет?",
  "Der Link ist abgelaufen oder wurde schon benutzt.": "Връзката е изтекла или вече е използвана.",
  "Das Zurücksetzen funktioniert nur mit einem Server-Konto.":
    "Нулирането работи само за акаунт на сървъра.",
  "Das alte Passwort stimmt nicht.": "Старата парола е неправилна.",
  "Das aktuelle Passwort stimmt nicht.": "Сегашната парола е неправилна.",
  "Passwort konnte nicht geändert werden. Ist der Server erreichbar?":
    "Паролата не можа да бъде променена. Работи ли връзката с интернет?",
  "Bitte alle drei Felder ausfüllen.": "Трябва да се попълнят и трите полета.",
  "Dieser Link ist abgelaufen oder wurde schon benutzt. Fordere in deinem Konto einen neuen an.":
    "Тази връзка е изтекла или вече е използвана. Поискай нова в акаунта си.",
  "Dieser Link ist abgelaufen oder wurde schon benutzt.": "Тази връзка е изтекла или вече е използвана.",
  "Link abgelaufen oder Passwort falsch.": "Връзката е изтекла или паролата е неправилна.",
  "Der Wechsel konnte nicht angestoßen werden. Ist die Adresse schon vergeben?":
    "Промяната не можа да бъде започната. Да не би адресът вече да се ползва от друг акаунт?",
  "Das Konto konnte nicht gelöscht werden.": "Акаунтът не можа да бъде изтрит.",
  "Das hat nicht geklappt.": "Не се получи.",
  "Das hat nicht geklappt. Bitte versuch es noch einmal.": "Не се получи. Опитай пак.",
  "Kein Einladungscode übermittelt.": "Липсва код на поканата.",
  "Diese Einladung gibt es nicht.": "Тази покана не съществува.",
  "Diese Einladung wurde zurückgezogen.": "Тази покана е оттеглена.",
  "Diese Einladung ist abgelaufen. Bitte bei der Lehrkraft eine neue anfordern.":
    "Тази покана е изтекла. Нова покана могат да изпратят учителите на класа.",
  "Bitte zuerst anmelden oder ein Konto anlegen.": "Първо влезте или създайте акаунт.",
  "Diese Einladung wurde bereits von einem anderen Konto eingelöst.":
    "Тази покана вече е приета от друг акаунт.",
  "Diese Klasse gibt es nicht mehr.": "Този клас вече не съществува.",
  "Das hat gerade nicht geklappt.": "Сега не се получи.",
  "Bitte als Lehrkraft anmelden.": "Влезте с акаунт за учители.",
  "Einladung konnte nicht angelegt werden.": "Поканата не можа да бъде създадена.",
  "Kein Klassencode übermittelt.": "Липсва код на класа.",
  "Diese Klasse gibt es nicht.": "Този клас не съществува.",
  "Diese Klasse gehört einer anderen Lehrkraft.": "Този клас принадлежи на друг акаунт.",
  "Diese Lehrkraft ist bereits Eigentümer:in der Klasse.": "Този акаунт вече е основният акаунт на класа.",
  "Lehrkraft konnte nicht hinzugefügt werden.": "Още един учител не можа да бъде добавен.",
  "Keine Lehrkraft angegeben.": "Не е посочен учител.",
  "Die Eigentümer:in lässt sich nicht entfernen. Wenn nötig, die Klasse löschen.":
    "Основният акаунт на класа не може да бъде премахнат. При нужда изтрийте класа.",
  "Dieses Kind gehört nicht zu einer Ihrer Klassen.": "Това дете не е в нито един от вашите класове.",
  "Bitte den Klassencode der neuen Klasse eingeben.": "Въведете кода на новия клас.",
  "Das Kind ist schon in der Klasse mit diesem Klassencode.": "Детето вече е в класа с този код.",
  "Das Kind konnte nicht verschoben werden. Es ist nichts geändert.":
    "Детето не можа да бъде преместено. Нищо не е променено.",
  "Bitte einen Klassencode eingeben - mit ihm melden sich die Kinder an.":
    "Въведете код на класа - с него учениците влизат.",
  "Der Klassencode darf 2 bis 12 Zeichen haben: Buchstaben, Ziffern, Punkt oder Bindestrich.":
    "Кодът на класа може да има от 2 до 12 знака: букви, цифри, точка или дефис.",
  "Bitte einen Klassennamen angeben.": "Въведете име на класа.",
  "Diesen Klassencode gibt es schon, bitte einen anderen wählen.": "Този код на класа вече съществува. Изберете друг.",
  "Diesen Klassennamen haben Sie schon vergeben. Bitte wählen Sie einen anderen Namen.":
    "Вече имате клас с това име. Изберете друго име.",
  "Diesen Klassencode gibt es schon - bitte wählen Sie einen anderen Klassencode (der Klassenname darf gerne bleiben).":
    "Този код на класа вече съществува - изберете друг код на класа (името на класа може да остане).",
  "Die Klasse konnte nicht geändert werden. Es ist nichts geändert.":
    "Класът не можа да бъде променен. Нищо не е променено.",
  "Bitte einen Klassencode angeben - mit ihm melden sich die Kinder an.":
    "Въведете код на класа - с него учениците влизат.",
  "Ein Klassenmatch kann nur ein Kind einer Klasse ausschreiben.":
    "Състезание в класа може да обяви само някой от класа.",
  "Ein Klassenmatch gibt es nur in einer Klasse.": "Състезание в класа има само в клас.",
  "Eure Lehrkraft hat das Klassenmatch für diese Klasse ausgeschaltet.":
    "В този клас Състезанието в класа е изключено.",
  "Du hast schon ein Klassenmatch ausgeschrieben, das noch offen ist. Ein zweites geht erst, wenn es vorbei ist.":
    "Твоето Състезание в класа още не е приключило. Ново можеш да обявиш, когато приключи.",
  "Du bist schon in einem anderen Klassenmatch dabei. Ein zweites geht erst, wenn es vorbei ist.":
    "Вече участваш в друго Състезание в класа. В ново можеш да се включиш, когато то приключи.",
  "Dieses Klassenmatch ist schon vorbei.": "Това Състезание в класа вече приключи.",
  "Dieses Klassenmatch gibt es nicht (mehr).": "Това Състезание в класа не съществува или вече е приключило.",
  "Klasse konnte nicht angelegt werden. Ist der Server erreichbar?":
    "Класът не можа да бъде създаден. Работи ли връзката с интернет?",
  "Die Klasse wurde geändert, konnte aber nicht neu gelesen werden. Bitte die Seite neu laden.":
    "Промяната на класа е запазена, но класът не можа да бъде зареден отново. Презаредете страницата.",
  "Klasse konnte nicht gelöscht werden.": "Класът не можа да бъде изтрит.",
  "Diesen Code gibt es schon, bitte einen anderen wählen.": "Този код вече съществува. Изберете друг.",
  "Bitte zuerst als Lehrkraft anmelden.": "Първо влезте с акаунт за учители.",
  "Diesen Namen gibt es in der Klasse schon.": "Това име вече е в класа.",
  "Die Kontakt-E-Mail konnte nicht gespeichert werden.": "Контактният имейл адрес не можа да бъде запазен.",
  "Passwort konnte nicht gesetzt werden (mindestens 4 Zeichen).":
    "Паролата не можа да бъде зададена (поне 4 знака).",
  "Passwort konnte nicht zurückgesetzt werden.": "Паролата не можа да бъде нулирана.",
  "Die Eigentümer:in lässt sich nicht entfernen.": "Основният акаунт на класа не може да бъде премахнат.",
  "Die Meldung ist leer.": "Съобщението е празно.",
  "Es sind schon mehrere Meldungen unterwegs. Bitte versuchen Sie es in einer Stunde noch einmal.":
    "Няколко съобщения вече са изпратени. Опитайте пак след един час.",
  "Aktion fehlgeschlagen. Ist der Server erreichbar?": "Действието не успя. Работи ли връзката с интернет?",
};

/** ★ O2-LIB (30.10.2026): Zahl (als Text) + Hauptwort in der Zählform - `Intl.PluralRules("bg")` kennt nur 1 = one, sonst other. */
const bgMehrzahl = (zahl: string, one: string, other: string): string =>
  (Number(zahl) === 1 ? one : other).replace("#", zahl);

/** „поне 1 знак · 5 знака" (Zählform). */
const znakBg = (n: string) => bgMehrzahl(n, "# знак", "# знака");

/** „1 дете · 30 деца". */
const decaBg = (n: string) => bgMehrzahl(n, "# дете", "# деца");

/** „1 клас · 50 класа" (Zählform). */
const klasBg = (n: string) => bgMehrzahl(n, "# клас", "# класа");

const MUSTER_BG: readonly [RegExp, (m: RegExpMatchArray) => string][] = [
  [/^Das Passwort braucht mindestens (\d+) Zeichen\.$/, (m) => `Паролата трябва да съдържа поне ${znakBg(m[1])}.`],
  [/^Das neue Passwort braucht mindestens (\d+) Zeichen\.$/, (m) => `Новата парола трябва да съдържа поне ${znakBg(m[1])}.`],
  [/^Das Passwort muss mindestens (\d+) Zeichen lang sein\.$/, (m) => `Паролата трябва да съдържа поне ${znakBg(m[1])}.`],
  // hookError - meist in der Klassenverwaltung, darum Вие.
  [/^Aktion fehlgeschlagen \((\d+)\)\. Bitte erneut versuchen\.$/, (m) => `Действието не успя (${m[1]}). Опитайте пак.`],
  // Code und Klassenname mit Kopfwort davor.
  [
    /^Eine Klasse mit dem Klassencode „(.+)“ gibt es nicht\. Bitte den Code prüfen\.$/,
    (m) => `Няма клас с код на класа ${m[1]}. Проверете кода.`,
  ],
  [
    /^In der Klasse „(.+)“ sind bereits (\d+) Kinder\. Mehr als (\d+) sind je Klasse nicht vorgesehen\.$/,
    (m) => `В клас ${m[1]} вече има ${decaBg(m[2])}. Един клас може да има най-много ${decaBg(m[3])}.`,
  ],
  // Der Name nach einem Doppelpunkt.
  [
    /^In der neuen Klasse gibt es schon ein Kind mit dem Namen „(.+)“\. Ändern Sie zuerst den Namen eines der beiden Kinder\.$/,
    (m) => `В новия клас вече има дете със същото име: ${m[1]}. Първо променете името на едно от двете деца.`,
  ],
  // Der deutsche Satz duzt hier die Lehrkraft - bulgarisch gilt Вие.
  [
    /^Mehr als (\d+) Klassen sind je Konto nicht vorgesehen\. Brauchst du wirklich mehr, melde dich bitte - dann heben wir die Grenze an\.$/,
    (m) =>
      `Един акаунт може да има най-много ${klasBg(m[1])}. Ако наистина имате нужда от повече, пишете ни - ще увеличим ограничението.`,
  ],
  [
    /^In dieser Klasse sind bereits (\d+) Kinder\. Mehr als (\d+) sind je Klasse nicht vorgesehen - lege bitte eine zweite Klasse an\.$/,
    (m) => `В този клас вече има ${decaBg(m[1])}. Един клас може да има най-много ${decaBg(m[2])} - създайте втори клас.`,
  ],
];

/** ★ O2-LIB (30.10.2026): die griechische Fassung eines Server-Satzes - oder `null` (dann bleibt er deutsch mit `lang="de"`). */
export function serverMeldungGriechisch(text: string): string | null {
  const sauber = text.trim();
  const fest = SERVER_MELDUNGEN_EL[sauber];
  if (fest) return fest;
  for (const [muster, bau] of MUSTER_EL) {
    const m = sauber.match(muster);
    if (m) return bau(m);
  }
  return null;
}

/**
 * ★★ O2-LIB (30.10.2026): DIESELBEN SERVER-SÄTZE AUF GRIECHISCH (Glossar `recherche-griechisch-2026-10-25/GLOSSAR-el.md`).
 * Aus der Funktion geschrieben, nicht Wort für Wort übersetzt: wo der deutsche Satz „du" sagt (Kind, Selbstlernende),
 * steht εσύ („Γράψε το όνομά σου."); wo er „Sie" sagt oder die Klassenverwaltung spricht (Lehrkraft), εσείς in der
 * Mehrzahlform („Γράψτε τον κωδικό τμήματος."); sonst ein Satz ohne Person („Ο λογαριασμός δεν δημιουργήθηκε.").
 * Keine Personenwörter für das Kind (Regel 2): το παιδί, το άτομο; die Lehrkraft nur als „όσοι διδάσκουν" oder
 * „λογαριασμός εκπαιδευτικού". Code und Name nie gebeugt: mit Kopfwort („κωδικός τμήματος 4B", „τμήμα 4B") oder nach
 * einem Doppelpunkt (Regel 12). Keine Anführungszeichen - die Sätze stehen oft in einem Live-Bereich (Regel 7).
 * Fragezeichen ist das Semikolon `;` (U+003B). „Αγώνας τμήματος", „Αναφορά" ⇒ die Meldung. Der Wächter verlangt für
 * JEDEN englischen Schlüssel einen griechischen.
 */
export const SERVER_MELDUNGEN_EL: Readonly<Record<string, string>> = {
  "Bitte einen Namen angeben.": "Απαιτείται όνομα.",
  "Bitte eine gültige E-Mail angeben.": "Απαιτείται έγκυρη διεύθυνση e-mail.",
  "Für diese E-Mail gibt es schon ein Konto.": "Υπάρχει ήδη λογαριασμός για αυτή τη διεύθυνση e-mail.",
  "Konto konnte nicht erstellt werden. Ist der Server erreichbar?":
    "Ο λογαριασμός δεν δημιουργήθηκε. Υπάρχει σύνδεση στο διαδίκτυο;",
  "E-Mail oder Passwort stimmt nicht.": "Λάθος διεύθυνση e-mail ή κωδικός πρόσβασης.",
  "Klassencode, Name oder Passwort stimmt nicht.": "Λάθος κωδικός τμήματος, όνομα ή κωδικός πρόσβασης.",
  "Bitte gib deinen Namen an.": "Γράψε το όνομά σου.",
  "Bitte gib eine gültige E-Mail-Adresse an.": "Γράψε μια έγκυρη διεύθυνση e-mail.",
  "Mit dieser E-Mail-Adresse gibt es schon ein Konto. Melde dich an oder nimm eine andere Adresse.":
    "Υπάρχει ήδη λογαριασμός με αυτή τη διεύθυνση e-mail. Συνδέσου ή χρησιμοποίησε άλλη διεύθυνση.",
  "Das Konto konnte nicht angelegt werden.": "Ο λογαριασμός δεν δημιουργήθηκε.",
  "E-Mail-Adresse oder Passwort stimmt nicht.": "Λάθος διεύθυνση e-mail ή κωδικός πρόσβασης.",
  "Ein eigenes Konto braucht eine Verbindung zum Server.":
    "Ένας προσωπικός λογαριασμός χρειάζεται σύνδεση με τον διακομιστή.",
  "Dafür braucht es eine Verbindung zum Server.": "Για αυτό χρειάζεται σύνδεση με τον διακομιστή.",
  "Die beiden Passwörter stimmen nicht überein.": "Οι δύο κωδικοί πρόσβασης δεν ταιριάζουν.",
  "Die beiden neuen Passwörter stimmen nicht überein.": "Οι δύο νέοι κωδικοί πρόσβασης δεν ταιριάζουν.",
  // Kein Adjektiv über die Person („συνδεδεμένος", Regel 2) - ein Satz über den Vorgang.
  "Nicht angemeldet.": "Δεν έχει γίνει σύνδεση στον λογαριασμό.",
  "Bitte zuerst anmelden.": "Πρώτα πρέπει να γίνει σύνδεση στον λογαριασμό.",
  "Konto nicht gefunden.": "Ο λογαριασμός δεν βρέθηκε.",
  "Dieses Konto gibt es nicht.": "Αυτός ο λογαριασμός δεν υπάρχει.",
  "Der Link ist ungültig oder abgelaufen. Bitte fordere einen neuen an.":
    "Ο σύνδεσμος δεν είναι έγκυρος ή έχει λήξει. Ζήτησε νέο.",
  "Das Passwort konnte nicht gesetzt werden. Ist der Server erreichbar?":
    "Ο κωδικός πρόσβασης δεν ορίστηκε. Υπάρχει σύνδεση στο διαδίκτυο;",
  "Der Link ist abgelaufen oder wurde schon benutzt.": "Ο σύνδεσμος έχει λήξει ή έχει ήδη χρησιμοποιηθεί.",
  "Das Zurücksetzen funktioniert nur mit einem Server-Konto.":
    "Η επαναφορά λειτουργεί μόνο με λογαριασμό στον διακομιστή.",
  "Das alte Passwort stimmt nicht.": "Ο παλιός κωδικός πρόσβασης δεν είναι σωστός.",
  "Das aktuelle Passwort stimmt nicht.": "Ο τρέχων κωδικός πρόσβασης δεν είναι σωστός.",
  "Passwort konnte nicht geändert werden. Ist der Server erreichbar?":
    "Ο κωδικός πρόσβασης δεν άλλαξε. Υπάρχει σύνδεση στο διαδίκτυο;",
  "Bitte alle drei Felder ausfüllen.": "Πρέπει να συμπληρωθούν και τα τρία πεδία.",
  "Dieser Link ist abgelaufen oder wurde schon benutzt. Fordere in deinem Konto einen neuen an.":
    "Αυτός ο σύνδεσμος έχει λήξει ή έχει ήδη χρησιμοποιηθεί. Ζήτησε νέο από τον λογαριασμό σου.",
  "Dieser Link ist abgelaufen oder wurde schon benutzt.": "Αυτός ο σύνδεσμος έχει λήξει ή έχει ήδη χρησιμοποιηθεί.",
  "Link abgelaufen oder Passwort falsch.": "Ο σύνδεσμος έχει λήξει ή ο κωδικός πρόσβασης είναι λάθος.",
  "Der Wechsel konnte nicht angestoßen werden. Ist die Adresse schon vergeben?":
    "Η αλλαγή δεν ξεκίνησε. Χρησιμοποιείται ήδη αυτή η διεύθυνση;",
  "Das Konto konnte nicht gelöscht werden.": "Ο λογαριασμός δεν διαγράφηκε.",
  "Das hat nicht geklappt.": "Η ενέργεια δεν ολοκληρώθηκε.",
  "Das hat nicht geklappt. Bitte versuch es noch einmal.": "Η ενέργεια δεν ολοκληρώθηκε. Δοκίμασε ξανά.",
  // Einladung zur gemeinsamen Verwaltung - liest eine Lehrkraft: εσείς oder ein Satz ohne Person.
  "Kein Einladungscode übermittelt.": "Δεν στάλθηκε κωδικός πρόσκλησης.",
  "Diese Einladung gibt es nicht.": "Αυτή η πρόσκληση δεν υπάρχει.",
  "Diese Einladung wurde zurückgezogen.": "Αυτή η πρόσκληση ανακλήθηκε.",
  // „ο εκπαιδευτικός" verriete das Geschlecht (Regel 2) - die Einladung kommt von denen, die das τμήμα unterrichten.
  "Diese Einladung ist abgelaufen. Bitte bei der Lehrkraft eine neue anfordern.":
    "Αυτή η πρόσκληση έχει λήξει. Μια νέα πρόσκληση μπορεί να ζητηθεί από όσους διδάσκουν στο τμήμα.",
  "Bitte zuerst anmelden oder ein Konto anlegen.": "Πρώτα πρέπει να γίνει σύνδεση ή δημιουργία λογαριασμού.",
  "Diese Einladung wurde bereits von einem anderen Konto eingelöst.":
    "Αυτή η πρόσκληση έχει ήδη γίνει δεκτή από άλλον λογαριασμό.",
  "Diese Klasse gibt es nicht mehr.": "Αυτό το τμήμα δεν υπάρχει πια.",
  "Das hat gerade nicht geklappt.": "Η ενέργεια δεν ολοκληρώθηκε τώρα.",
  "Bitte als Lehrkraft anmelden.": "Η σύνδεση πρέπει να γίνει με λογαριασμό εκπαιδευτικού.",
  "Einladung konnte nicht angelegt werden.": "Η πρόσκληση δεν δημιουργήθηκε.",
  "Kein Klassencode übermittelt.": "Δεν στάλθηκε κωδικός τμήματος.",
  "Diese Klasse gibt es nicht.": "Αυτό το τμήμα δεν υπάρχει.",
  // „Eigentümer:in" ⇒ der Account, dem die Klasse gehört - ohne Personenwort (Regel 2).
  "Diese Klasse gehört einer anderen Lehrkraft.": "Αυτό το τμήμα ανήκει σε άλλον λογαριασμό.",
  "Diese Lehrkraft ist bereits Eigentümer:in der Klasse.": "Το τμήμα ανήκει ήδη στον λογαριασμό αυτού του ατόμου.",
  "Lehrkraft konnte nicht hinzugefügt werden.": "Το άτομο δεν προστέθηκε στο τμήμα.",
  "Keine Lehrkraft angegeben.": "Δεν έχει επιλεγεί κανένα άτομο.",
  "Die Eigentümer:in lässt sich nicht entfernen. Wenn nötig, die Klasse löschen.":
    "Το άτομο στο οποίο ανήκει το τμήμα δεν μπορεί να αφαιρεθεί. Αν χρειάζεται, διαγράψτε το τμήμα.",
  "Dieses Kind gehört nicht zu einer Ihrer Klassen.": "Αυτό το παιδί δεν ανήκει σε κανένα από τα τμήματά σας.",
  "Bitte den Klassencode der neuen Klasse eingeben.": "Γράψτε τον κωδικό του νέου τμήματος.",
  "Das Kind ist schon in der Klasse mit diesem Klassencode.": "Το παιδί βρίσκεται ήδη στο τμήμα με αυτόν τον κωδικό.",
  "Das Kind konnte nicht verschoben werden. Es ist nichts geändert.":
    "Το παιδί δεν μετακινήθηκε. Δεν άλλαξε τίποτα.",
  "Bitte einen Klassencode eingeben - mit ihm melden sich die Kinder an.":
    "Γράψτε έναν κωδικό τμήματος - με αυτόν συνδέονται τα παιδιά.",
  "Der Klassencode darf 2 bis 12 Zeichen haben: Buchstaben, Ziffern, Punkt oder Bindestrich.":
    "Ο κωδικός τμήματος μπορεί να έχει 2-12 χαρακτήρες: γράμματα, ψηφία, τελεία ή παύλα.",
  "Bitte einen Klassennamen angeben.": "Γράψτε ένα όνομα τμήματος.",
  "Diesen Klassencode gibt es schon, bitte einen anderen wählen.": "Αυτός ο κωδικός τμήματος υπάρχει ήδη. Επιλέξτε άλλον.",
  "Diesen Klassennamen haben Sie schon vergeben. Bitte wählen Sie einen anderen Namen.":
    "Έχετε ήδη τμήμα με αυτό το όνομα. Επιλέξτε άλλο όνομα.",
  "Diesen Klassencode gibt es schon - bitte wählen Sie einen anderen Klassencode (der Klassenname darf gerne bleiben).":
    "Αυτός ο κωδικός τμήματος υπάρχει ήδη - επιλέξτε άλλον κωδικό τμήματος (το όνομα του τμήματος μπορεί να μείνει).",
  "Die Klasse konnte nicht geändert werden. Es ist nichts geändert.":
    "Η αλλαγή του τμήματος δεν έγινε. Δεν άλλαξε τίποτα.",
  "Bitte einen Klassencode angeben - mit ihm melden sich die Kinder an.":
    "Γράψτε έναν κωδικό τμήματος - με αυτόν συνδέονται τα παιδιά.",
  // Αγώνας τμήματος - liest das KIND: εσύ; die Lehrkraft wird gar nicht genannt.
  "Ein Klassenmatch kann nur ein Kind einer Klasse ausschreiben.":
    "Αγώνα τμήματος μπορεί να προκηρύξει μόνο ένα παιδί που ανήκει σε τμήμα.",
  "Ein Klassenmatch gibt es nur in einer Klasse.": "Αγώνας τμήματος γίνεται μόνο μέσα σε τμήμα.",
  "Eure Lehrkraft hat das Klassenmatch für diese Klasse ausgeschaltet.":
    "Σε αυτό το τμήμα ο Αγώνας τμήματος είναι απενεργοποιημένος.",
  "Du hast schon ein Klassenmatch ausgeschrieben, das noch offen ist. Ein zweites geht erst, wenn es vorbei ist.":
    "Ο Αγώνας τμήματος που προκήρυξες είναι ακόμα ανοιχτός. Έναν δεύτερο μπορείς να προκηρύξεις όταν τελειώσει.",
  "Du bist schon in einem anderen Klassenmatch dabei. Ein zweites geht erst, wenn es vorbei ist.":
    "Συμμετέχεις ήδη σε άλλον Αγώνα τμήματος. Σε έναν δεύτερο μπορείς να μπεις όταν τελειώσει.",
  "Dieses Klassenmatch ist schon vorbei.": "Αυτός ο Αγώνας τμήματος έχει ήδη τελειώσει.",
  "Dieses Klassenmatch gibt es nicht (mehr).": "Αυτός ο Αγώνας τμήματος δεν υπάρχει ή έχει τελειώσει.",
  "Klasse konnte nicht angelegt werden. Ist der Server erreichbar?":
    "Το τμήμα δεν δημιουργήθηκε. Υπάρχει σύνδεση στο διαδίκτυο;",
  "Die Klasse wurde geändert, konnte aber nicht neu gelesen werden. Bitte die Seite neu laden.":
    "Το τμήμα άλλαξε, αλλά δεν φορτώθηκε ξανά. Ανανεώστε τη σελίδα.",
  "Klasse konnte nicht gelöscht werden.": "Το τμήμα δεν διαγράφηκε.",
  "Diesen Code gibt es schon, bitte einen anderen wählen.": "Αυτός ο κωδικός υπάρχει ήδη. Επιλέξτε άλλον.",
  "Bitte zuerst als Lehrkraft anmelden.": "Πρώτα πρέπει να γίνει σύνδεση με λογαριασμό εκπαιδευτικού.",
  "Diesen Namen gibt es in der Klasse schon.": "Αυτό το όνομα υπάρχει ήδη στο τμήμα.",
  "Die Kontakt-E-Mail konnte nicht gespeichert werden.": "Η διεύθυνση e-mail επικοινωνίας δεν αποθηκεύτηκε.",
  "Passwort konnte nicht gesetzt werden (mindestens 4 Zeichen).":
    "Ο κωδικός πρόσβασης δεν ορίστηκε (τουλάχιστον 4 χαρακτήρες).",
  "Passwort konnte nicht zurückgesetzt werden.": "Ο κωδικός πρόσβασης δεν επαναφέρθηκε.",
  "Die Eigentümer:in lässt sich nicht entfernen.": "Το άτομο στο οποίο ανήκει το τμήμα δεν μπορεί να αφαιρεθεί.",
  // „Αναφορά" (Glossar §2.7) - der deutsche Satz sagt „Sie": εσείς.
  "Die Meldung ist leer.": "Η αναφορά είναι κενή.",
  "Es sind schon mehrere Meldungen unterwegs. Bitte versuchen Sie es in einer Stunde noch einmal.":
    "Αρκετές αναφορές έχουν ήδη σταλεί. Δοκιμάστε ξανά σε μία ώρα.",
  "Aktion fehlgeschlagen. Ist der Server erreichbar?": "Η ενέργεια δεν ολοκληρώθηκε. Υπάρχει σύνδεση στο διαδίκτυο;",
};

const MUSTER_EL: readonly [RegExp, (m: RegExpMatchArray) => string][] = [
  [/^Das Passwort braucht mindestens (\d+) Zeichen\.$/, (m) => `Ο κωδικός πρόσβασης πρέπει να έχει τουλάχιστον ${charAkkEl(m[1])}.`],
  [
    /^Das neue Passwort braucht mindestens (\d+) Zeichen\.$/,
    (m) => `Ο νέος κωδικός πρόσβασης πρέπει να έχει τουλάχιστον ${charAkkEl(m[1])}.`,
  ],
  [
    /^Das Passwort muss mindestens (\d+) Zeichen lang sein\.$/,
    (m) => `Ο κωδικός πρόσβασης πρέπει να έχει τουλάχιστον ${charAkkEl(m[1])}.`,
  ],
  // hookError - meist in der Klassenverwaltung, darum εσείς.
  [/^Aktion fehlgeschlagen \((\d+)\)\. Bitte erneut versuchen\.$/, (m) => `Η ενέργεια δεν ολοκληρώθηκε (${m[1]}). Δοκιμάστε ξανά.`],
  // Code und Klassenname mit Kopfwort davor, nie gebeugt (Glossar Regel 12).
  [
    /^Eine Klasse mit dem Klassencode „(.+)“ gibt es nicht\. Bitte den Code prüfen\.$/,
    (m) => `Δεν υπάρχει τμήμα με κωδικό τμήματος ${m[1]}. Ελέγξτε τον κωδικό.`,
  ],
  [
    /^In der Klasse „(.+)“ sind bereits (\d+) Kinder\. Mehr als (\d+) sind je Klasse nicht vorgesehen\.$/,
    (m) => `Στο τμήμα ${m[1]} ${yparxounPaidiaEl(m[2])}. Σε ένα τμήμα δεν προβλέπονται περισσότερα από ${paidiaEl(m[3])}.`,
  ],
  // Der Name nach einem Doppelpunkt (Glossar Regel 12).
  [
    /^In der neuen Klasse gibt es schon ein Kind mit dem Namen „(.+)“\. Ändern Sie zuerst den Namen eines der beiden Kinder\.$/,
    (m) => `Στο νέο τμήμα υπάρχει ήδη παιδί με το ίδιο όνομα: ${m[1]}. Αλλάξτε πρώτα το όνομα ενός από τα δύο παιδιά.`,
  ],
  // Der deutsche Satz duzt hier die Lehrkraft - griechisch gilt εσείς (Glossar Regel 1).
  [
    /^Mehr als (\d+) Klassen sind je Konto nicht vorgesehen\. Brauchst du wirklich mehr, melde dich bitte - dann heben wir die Grenze an\.$/,
    (m) =>
      `Ανά λογαριασμό δεν προβλέπονται περισσότερα από ${tmimataEl(m[1])}. Αν χρειάζεστε πράγματι περισσότερα, επικοινωνήστε μαζί μας - θα αυξήσουμε το όριο.`,
  ],
  [
    /^In dieser Klasse sind bereits (\d+) Kinder\. Mehr als (\d+) sind je Klasse nicht vorgesehen - lege bitte eine zweite Klasse an\.$/,
    (m) => `Σε αυτό το τμήμα ${yparxounPaidiaEl(m[1])}. Σε ένα τμήμα δεν προβλέπονται περισσότερα από ${paidiaEl(m[2])} - δημιουργήστε ένα δεύτερο τμήμα.`,
  ],
];

/** ★ O2-LIB: die griechische Mehrzahl (one/other, gemessen) - „#" wird durch die Zahl ersetzt. */
function elMehrzahl(zahl: string, formen: { one: string; other: string }): string {
  const regel = new Intl.PluralRules("el-GR").select(Number(zahl));
  return (regel === "one" ? formen.one : formen.other).replace("#", zahl);
}

/** „τουλάχιστον 1 χαρακτήρα · 4 χαρακτήρες" (Akkusativ). */
const charAkkEl = (n: string) => elMehrzahl(n, { one: "# χαρακτήρα", other: "# χαρακτήρες" });

/** „υπάρχει ήδη 1 παιδί · υπάρχουν ήδη 5 παιδιά" - das Verb zieht mit. */
const yparxounPaidiaEl = (n: string) =>
  elMehrzahl(n, { one: "υπάρχει ήδη # παιδί", other: "υπάρχουν ήδη # παιδιά" });

/** „περισσότερα από 1 παιδί · 30 παιδιά". */
const paidiaEl = (n: string) => elMehrzahl(n, { one: "# παιδί", other: "# παιδιά" });

/** „περισσότερα από 1 τμήμα · 50 τμήματα". */
const tmimataEl = (n: string) => elMehrzahl(n, { one: "# τμήμα", other: "# τμήματα" });

/** ★ O2-LIB (30.10.2026): die ungarische Fassung eines Server-Satzes - oder `null` (dann bleibt er deutsch mit `lang="de"`). */
export function serverMeldungUngarisch(text: string): string | null {
  const sauber = text.trim();
  const fest = SERVER_MELDUNGEN_HU[sauber];
  if (fest) return fest;
  for (const [muster, bau] of MUSTER_HU) {
    const m = sauber.match(muster);
    if (m) return bau(m);
  }
  return null;
}

/**
 * ★★ O2-LIB (30.10.2026): DIESELBEN SERVER-SÄTZE AUF UNGARISCH (Glossar `recherche-ungarisch-2026-10-25/
 * GLOSSAR-hu.md`): wo der deutsche Satz „du" sagt (Kind, Selbstlernende), steht te („Add meg a neved.");
 * wo er „Sie" sagt oder die Klassenverwaltung spricht (Lehrkraft), steht ein Satz ohne Anrede
 * („Meg kell adni az új osztály osztálykódját.") oder die höfliche Befehlsform ohne „Ön". Codes und Namen
 * bekommen nie eine Endung: sie stehen nach einem Doppelpunkt (Regel 12). Nach einer Zahl steht die
 * Einzahl (Regel 13). Keine Anführungszeichen - die Sätze stehen oft in einem Live-Bereich. Kein Satz
 * endet mit Zahl und Punkt (Falle 4).
 */
export const SERVER_MELDUNGEN_HU: Readonly<Record<string, string>> = {
  "Bitte einen Namen angeben.": "A név megadása kötelező.",
  "Bitte eine gültige E-Mail angeben.": "Érvényes e-mail-cím szükséges.",
  "Für diese E-Mail gibt es schon ein Konto.": "Ehhez az e-mail-címhez már tartozik fiók.",
  "Konto konnte nicht erstellt werden. Ist der Server erreichbar?":
    "A fiókot nem sikerült létrehozni. Működik az internetkapcsolat?",
  "E-Mail oder Passwort stimmt nicht.": "Hibás az e-mail-cím vagy a jelszó.",
  "Klassencode, Name oder Passwort stimmt nicht.": "Hibás az osztálykód, a név vagy a jelszó.",
  "Bitte gib deinen Namen an.": "Add meg a neved.",
  "Bitte gib eine gültige E-Mail-Adresse an.": "Adj meg egy érvényes e-mail-címet.",
  "Mit dieser E-Mail-Adresse gibt es schon ein Konto. Melde dich an oder nimm eine andere Adresse.":
    "Ehhez az e-mail-címhez már tartozik fiók. Jelentkezz be, vagy használj másik címet.",
  "Das Konto konnte nicht angelegt werden.": "A fiókot nem sikerült létrehozni.",
  "E-Mail-Adresse oder Passwort stimmt nicht.": "Hibás az e-mail-cím vagy a jelszó.",
  "Ein eigenes Konto braucht eine Verbindung zum Server.": "Saját fiókhoz kapcsolat kell a szerverrel.",
  "Dafür braucht es eine Verbindung zum Server.": "Ehhez kapcsolat kell a szerverrel.",
  "Die beiden Passwörter stimmen nicht überein.": "A két jelszó nem egyezik.",
  "Die beiden neuen Passwörter stimmen nicht überein.": "A két új jelszó nem egyezik.",
  "Nicht angemeldet.": "Nincs bejelentkezve.",
  "Bitte zuerst anmelden.": "Előbb be kell jelentkezni.",
  "Konto nicht gefunden.": "A fiók nem található.",
  "Dieses Konto gibt es nicht.": "Ilyen fiók nincs.",
  "Der Link ist ungültig oder abgelaufen. Bitte fordere einen neuen an.":
    "A hivatkozás érvénytelen vagy lejárt. Kérj újat.",
  "Das Passwort konnte nicht gesetzt werden. Ist der Server erreichbar?":
    "A jelszót nem sikerült beállítani. Működik az internetkapcsolat?",
  "Der Link ist abgelaufen oder wurde schon benutzt.": "A hivatkozás lejárt, vagy már felhasználták.",
  "Das Zurücksetzen funktioniert nur mit einem Server-Konto.":
    "A visszaállítás csak szerveren lévő fióknál működik.",
  "Das alte Passwort stimmt nicht.": "A régi jelszó nem helyes.",
  "Das aktuelle Passwort stimmt nicht.": "A jelenlegi jelszó nem helyes.",
  "Passwort konnte nicht geändert werden. Ist der Server erreichbar?":
    "A jelszót nem sikerült módosítani. Működik az internetkapcsolat?",
  "Bitte alle drei Felder ausfüllen.": "Mind a három mezőt ki kell tölteni.",
  "Dieser Link ist abgelaufen oder wurde schon benutzt. Fordere in deinem Konto einen neuen an.":
    "Ez a hivatkozás lejárt, vagy már felhasználták. Kérj újat a fiókodban.",
  "Dieser Link ist abgelaufen oder wurde schon benutzt.": "Ez a hivatkozás lejárt, vagy már felhasználták.",
  "Link abgelaufen oder Passwort falsch.": "A hivatkozás lejárt, vagy a jelszó nem helyes.",
  "Der Wechsel konnte nicht angestoßen werden. Ist die Adresse schon vergeben?":
    "A váltást nem sikerült elindítani. Lehet, hogy a cím már foglalt?",
  "Das Konto konnte nicht gelöscht werden.": "A fiókot nem sikerült törölni.",
  "Das hat nicht geklappt.": "Ez nem sikerült.",
  "Das hat nicht geklappt. Bitte versuch es noch einmal.": "Ez nem sikerült. Próbáld újra.",
  "Kein Einladungscode übermittelt.": "Nem érkezett meghívókód.",
  "Diese Einladung gibt es nicht.": "Ilyen meghívó nincs.",
  "Diese Einladung wurde zurückgezogen.": "Ezt a meghívót visszavonták.",
  "Diese Einladung ist abgelaufen. Bitte bei der Lehrkraft eine neue anfordern.":
    "Ez a meghívó lejárt. Újat az osztály tanárától lehet kérni.",
  "Bitte zuerst anmelden oder ein Konto anlegen.":
    "Előbb be kell jelentkezni, vagy létre kell hozni egy fiókot.",
  "Diese Einladung wurde bereits von einem anderen Konto eingelöst.":
    "Ezt a meghívót már egy másik fiók elfogadta.",
  "Diese Klasse gibt es nicht mehr.": "Ez az osztály már nem létezik.",
  "Das hat gerade nicht geklappt.": "Ez most nem sikerült.",
  "Bitte als Lehrkraft anmelden.": "Tanári fiókkal kell bejelentkezni.",
  "Einladung konnte nicht angelegt werden.": "A meghívót nem sikerült létrehozni.",
  "Kein Klassencode übermittelt.": "Nem érkezett osztálykód.",
  "Diese Klasse gibt es nicht.": "Ilyen osztály nincs.",
  "Diese Klasse gehört einer anderen Lehrkraft.": "Ez az osztály egy másik fiókhoz tartozik.",
  "Diese Lehrkraft ist bereits Eigentümer:in der Klasse.": "Ez a fiók már az osztály fő fiókja.",
  "Lehrkraft konnte nicht hinzugefügt werden.": "A további tanárt nem sikerült felvenni.",
  "Keine Lehrkraft angegeben.": "Nincs megadva tanár.",
  "Die Eigentümer:in lässt sich nicht entfernen. Wenn nötig, die Klasse löschen.":
    "Az osztály fő fiókja nem távolítható el. Szükség esetén az osztály törölhető.",
  "Dieses Kind gehört nicht zu einer Ihrer Klassen.": "Ez a tanuló egyik osztályhoz sem tartozik.",
  "Bitte den Klassencode der neuen Klasse eingeben.": "Meg kell adni az új osztály osztálykódját.",
  "Das Kind ist schon in der Klasse mit diesem Klassencode.":
    "A tanuló már abban az osztályban van, amelynek ez az osztálykódja.",
  "Das Kind konnte nicht verschoben werden. Es ist nichts geändert.":
    "A tanulót nem sikerült áthelyezni. Semmi sem változott.",
  "Bitte einen Klassencode eingeben - mit ihm melden sich die Kinder an.":
    "Meg kell adni egy osztálykódot - a tanulók ezzel jelentkeznek be.",
  "Der Klassencode darf 2 bis 12 Zeichen haben: Buchstaben, Ziffern, Punkt oder Bindestrich.":
    "Az osztálykód 2-12 karakterből állhat: betűkből, számjegyekből, pontból vagy kötőjelből.",
  "Bitte einen Klassennamen angeben.": "Meg kell adni az osztály nevét.",
  "Diesen Klassencode gibt es schon, bitte einen anderen wählen.":
    "Ez az osztálykód már létezik. Másikat kell választani.",
  "Diesen Klassennamen haben Sie schon vergeben. Bitte wählen Sie einen anderen Namen.":
    "Ilyen nevű osztály már van a fiókban. Másik nevet kell választani.",
  "Diesen Klassencode gibt es schon - bitte wählen Sie einen anderen Klassencode (der Klassenname darf gerne bleiben).":
    "Ez az osztálykód már létezik - másik osztálykódot kell választani (az osztály neve maradhat).",
  "Die Klasse konnte nicht geändert werden. Es ist nichts geändert.":
    "Az osztályt nem sikerült módosítani. Semmi sem változott.",
  "Bitte einen Klassencode angeben - mit ihm melden sich die Kinder an.":
    "Meg kell adni egy osztálykódot - a tanulók ezzel jelentkeznek be.",
  "Ein Klassenmatch kann nur ein Kind einer Klasse ausschreiben.":
    "Osztályversenyt csak az osztály tanulója hirdethet meg.",
  "Ein Klassenmatch gibt es nur in einer Klasse.": "Osztályverseny csak osztályban van.",
  "Eure Lehrkraft hat das Klassenmatch für diese Klasse ausgeschaltet.":
    "Ebben az osztályban az Osztályverseny ki van kapcsolva.",
  "Du hast schon ein Klassenmatch ausgeschrieben, das noch offen ist. Ein zweites geht erst, wenn es vorbei ist.":
    "Az általad meghirdetett Osztályverseny még nem ért véget. Újat akkor hirdethetsz, ha az véget ért.",
  "Du bist schon in einem anderen Klassenmatch dabei. Ein zweites geht erst, wenn es vorbei ist.":
    "Már részt veszel egy másik Osztályversenyen. Másikban akkor vehetsz részt, ha ez véget ért.",
  "Dieses Klassenmatch ist schon vorbei.": "Ez az Osztályverseny már véget ért.",
  "Dieses Klassenmatch gibt es nicht (mehr).": "Ez az Osztályverseny nem létezik, vagy már véget ért.",
  "Klasse konnte nicht angelegt werden. Ist der Server erreichbar?":
    "Az osztályt nem sikerült létrehozni. Működik az internetkapcsolat?",
  "Die Klasse wurde geändert, konnte aber nicht neu gelesen werden. Bitte die Seite neu laden.":
    "Az osztály módosult, de nem sikerült újra betölteni. Az oldalt újra kell tölteni.",
  "Klasse konnte nicht gelöscht werden.": "Az osztályt nem sikerült törölni.",
  "Diesen Code gibt es schon, bitte einen anderen wählen.": "Ez a kód már létezik. Másikat kell választani.",
  "Bitte zuerst als Lehrkraft anmelden.": "Előbb tanári fiókkal kell bejelentkezni.",
  "Diesen Namen gibt es in der Klasse schon.": "Ez a név már szerepel az osztályban.",
  "Die Kontakt-E-Mail konnte nicht gespeichert werden.":
    "A kapcsolattartó e-mail-címet nem sikerült elmenteni.",
  "Passwort konnte nicht gesetzt werden (mindestens 4 Zeichen).":
    "A jelszót nem sikerült beállítani (legalább 4 karakter kell).",
  "Passwort konnte nicht zurückgesetzt werden.": "A jelszót nem sikerült visszaállítani.",
  "Die Eigentümer:in lässt sich nicht entfernen.": "Az osztály fő fiókja nem távolítható el.",
  "Die Meldung ist leer.": "A bejelentés üres.",
  "Es sind schon mehrere Meldungen unterwegs. Bitte versuchen Sie es in einer Stunde noch einmal.":
    "Már több bejelentés úton van. Próbálja újra egy óra múlva.",
  "Aktion fehlgeschlagen. Ist der Server erreichbar?": "A művelet nem sikerült. Működik az internetkapcsolat?",
};

const MUSTER_HU: readonly [RegExp, (m: RegExpMatchArray) => string][] = [
  [/^Das Passwort braucht mindestens (\d+) Zeichen\.$/, (m) => `A jelszónak legalább ${m[1]} karakterből kell állnia.`],
  [
    /^Das neue Passwort braucht mindestens (\d+) Zeichen\.$/,
    (m) => `Az új jelszónak legalább ${m[1]} karakterből kell állnia.`,
  ],
  [
    /^Das Passwort muss mindestens (\d+) Zeichen lang sein\.$/,
    (m) => `A jelszónak legalább ${m[1]} karakterből kell állnia.`,
  ],
  [/^Aktion fehlgeschlagen \((\d+)\)\. Bitte erneut versuchen\.$/, (m) => `A művelet nem sikerült (${m[1]}). Próbálja újra.`],
  // Code und Klassenname nach einem Doppelpunkt, nie mit Endung (Glossar Regel 12).
  [
    /^Eine Klasse mit dem Klassencode „(.+)“ gibt es nicht\. Bitte den Code prüfen\.$/,
    (m) => `Nincs osztály ezzel az osztálykóddal: ${m[1]}. Az osztálykódot ellenőrizni kell.`,
  ],
  [
    /^In der Klasse „(.+)“ sind bereits (\d+) Kinder\. Mehr als (\d+) sind je Klasse nicht vorgesehen\.$/,
    (m) => `Osztály: ${m[1]}. Már ${m[2]} tanuló van benne; osztályonként legfeljebb ${m[3]} tanuló lehet.`,
  ],
  [
    /^In der neuen Klasse gibt es schon ein Kind mit dem Namen „(.+)“\. Ändern Sie zuerst den Namen eines der beiden Kinder\.$/,
    (m) => `Az új osztályban már van tanuló ezzel a névvel: ${m[1]}. Előbb meg kell változtatni a két tanuló egyikének a nevét.`,
  ],
  [
    /^Mehr als (\d+) Klassen sind je Konto nicht vorgesehen\. Brauchst du wirklich mehr, melde dich bitte - dann heben wir die Grenze an\.$/,
    (m) => `Fiókonként legfeljebb ${m[1]} osztály lehet. Ha tényleg több osztály kell, írjon nekünk - megemeljük a határt.`,
  ],
  [
    /^In dieser Klasse sind bereits (\d+) Kinder\. Mehr als (\d+) sind je Klasse nicht vorgesehen - lege bitte eine zweite Klasse an\.$/,
    (m) => `Ebben az osztályban már ${m[1]} tanuló van. Osztályonként legfeljebb ${m[2]} tanuló lehet - hozzon létre egy második osztályt.`,
  ],
];

/**
 * ★ O2-LIB (30.10.2026): Zahl + Hauptwort für die Server-Sätze, niederländisch (one/other; Zahl kommt als
 * Zeichenkette aus dem Muster). "#" wird durch die Zahl ersetzt.
 */
function meervoudNl(zahl: string, formen: { one: string; other: string }): string {
  const regel = new Intl.PluralRules("nl-NL").select(Number(zahl));
  return (regel === "one" ? formen.one : formen.other).replace("#", zahl);
}

/** "minstens 1 teken · 4 tekens" */
const tekensServerNl = (n: string) => meervoudNl(n, { one: "# teken", other: "# tekens" });

/** "zit al 1 leerling · zitten al 5 leerlingen" - das Verb zieht mit. */
const zittenLeerlingenNl = (n: string) =>
  meervoudNl(n, { one: "zit al # leerling", other: "zitten al # leerlingen" });

/** "hoogstens 1 leerling · 30 leerlingen" */
const leerlingenServerNl = (n: string) => meervoudNl(n, { one: "# leerling", other: "# leerlingen" });

/** "hoogstens 1 klas · 50 klassen" */
const klassenServerNl = (n: string) => meervoudNl(n, { one: "# klas", other: "# klassen" });

/**
 * ★ O2-LIB (30.10.2026): die niederländische Fassung eines Server-Satzes - oder `null` (dann bleibt er
 * deutsch mit `lang="de"`).
 */
export function serverMeldingNederlands(text: string): string | null {
  const sauber = text.trim();
  const fest = SERVER_MELDINGEN_NL[sauber];
  if (fest) return fest;
  for (const [muster, bau] of MUSTER_NL) {
    const m = sauber.match(muster);
    if (m) return bau(m);
  }
  return null;
}

/**
 * ★★ O2-LIB (30.10.2026): DIESELBEN SERVER-SÄTZE AUF NIEDERLÄNDISCH - aus der Funktion geschrieben, nicht
 * übersetzt (Glossar nl): wo der deutsche Satz "du" sagt (Kind, Selbstlernende), steht je; wo er "Sie" sagt
 * oder die Klassenverwaltung spricht (Lehrkraft), der Imperativ ohne Pronomen. Kein hij/zij, "leerkracht"
 * und "leerling", das Konto der Klasse heisst "hoofdaccount van de klas". Codes und Namen nie gebeugt: mit
 * Kopfwort ("klascode 4B", "klas 4B") oder nach einem Doppelpunkt. Keine Anführungszeichen - die Sätze
 * stehen oft in einem Live-Bereich. "Uitdaging" und "Klassenwedstrijd" gross wie ein Name.
 */
export const SERVER_MELDINGEN_NL: Readonly<Record<string, string>> = {
  "Bitte einen Namen angeben.": "Vul een naam in.",
  "Bitte eine gültige E-Mail angeben.": "Vul een geldig e-mailadres in.",
  "Für diese E-Mail gibt es schon ein Konto.": "Voor dit e-mailadres bestaat al een account.",
  "Konto konnte nicht erstellt werden. Ist der Server erreichbar?":
    "Het account kon niet worden aangemaakt. Is er een internetverbinding?",
  "E-Mail oder Passwort stimmt nicht.": "Het e-mailadres of het wachtwoord klopt niet.",
  "Klassencode, Name oder Passwort stimmt nicht.": "De klascode, de naam of het wachtwoord klopt niet.",
  "Bitte gib deinen Namen an.": "Vul je naam in.",
  "Bitte gib eine gültige E-Mail-Adresse an.": "Vul een geldig e-mailadres in.",
  "Mit dieser E-Mail-Adresse gibt es schon ein Konto. Melde dich an oder nimm eine andere Adresse.":
    "Met dit e-mailadres bestaat al een account. Log in of gebruik een ander adres.",
  "Das Konto konnte nicht angelegt werden.": "Het account kon niet worden aangemaakt.",
  "E-Mail-Adresse oder Passwort stimmt nicht.": "Het e-mailadres of het wachtwoord klopt niet.",
  "Ein eigenes Konto braucht eine Verbindung zum Server.":
    "Een eigen account heeft een verbinding met de server nodig.",
  "Dafür braucht es eine Verbindung zum Server.": "Hiervoor is een verbinding met de server nodig.",
  "Die beiden Passwörter stimmen nicht überein.": "De twee wachtwoorden zijn niet hetzelfde.",
  "Die beiden neuen Passwörter stimmen nicht überein.": "De twee nieuwe wachtwoorden zijn niet hetzelfde.",
  "Nicht angemeldet.": "Niet ingelogd.",
  "Bitte zuerst anmelden.": "Log eerst in.",
  "Konto nicht gefunden.": "Account niet gevonden.",
  "Dieses Konto gibt es nicht.": "Dit account bestaat niet.",
  "Der Link ist ungültig oder abgelaufen. Bitte fordere einen neuen an.":
    "De link is ongeldig of verlopen. Vraag een nieuwe aan.",
  "Das Passwort konnte nicht gesetzt werden. Ist der Server erreichbar?":
    "Het wachtwoord kon niet worden ingesteld. Is er een internetverbinding?",
  "Der Link ist abgelaufen oder wurde schon benutzt.": "De link is verlopen of al gebruikt.",
  "Das Zurücksetzen funktioniert nur mit einem Server-Konto.":
    "Opnieuw instellen werkt alleen met een account op de server.",
  "Das alte Passwort stimmt nicht.": "Het oude wachtwoord klopt niet.",
  "Das aktuelle Passwort stimmt nicht.": "Het huidige wachtwoord klopt niet.",
  "Passwort konnte nicht geändert werden. Ist der Server erreichbar?":
    "Het wachtwoord kon niet worden gewijzigd. Is er een internetverbinding?",
  "Bitte alle drei Felder ausfüllen.": "Vul alle drie de velden in.",
  "Dieser Link ist abgelaufen oder wurde schon benutzt. Fordere in deinem Konto einen neuen an.":
    "Deze link is verlopen of al gebruikt. Vraag in je account een nieuwe aan.",
  "Dieser Link ist abgelaufen oder wurde schon benutzt.": "Deze link is verlopen of al gebruikt.",
  "Link abgelaufen oder Passwort falsch.": "De link is verlopen of het wachtwoord klopt niet.",
  "Der Wechsel konnte nicht angestoßen werden. Ist die Adresse schon vergeben?":
    "De wijziging kon niet worden gestart. Wordt dit adres al gebruikt?",
  "Das Konto konnte nicht gelöscht werden.": "Het account kon niet worden verwijderd.",
  "Das hat nicht geklappt.": "Dat is niet gelukt.",
  "Das hat nicht geklappt. Bitte versuch es noch einmal.": "Dat is niet gelukt. Probeer het nog eens.",
  // Einladung als co-leerkracht - liest eine Lehrkraft: je.
  "Kein Einladungscode übermittelt.": "Er is geen uitnodigingscode meegestuurd.",
  "Diese Einladung gibt es nicht.": "Deze uitnodiging bestaat niet.",
  "Diese Einladung wurde zurückgezogen.": "Deze uitnodiging is ingetrokken.",
  "Diese Einladung ist abgelaufen. Bitte bei der Lehrkraft eine neue anfordern.":
    "Deze uitnodiging is verlopen. Vraag de leerkracht om een nieuwe.",
  "Bitte zuerst anmelden oder ein Konto anlegen.": "Log eerst in of maak een account aan.",
  "Diese Einladung wurde bereits von einem anderen Konto eingelöst.":
    "Deze uitnodiging is al door een ander account gebruikt.",
  "Diese Klasse gibt es nicht mehr.": "Deze klas bestaat niet meer.",
  "Das hat gerade nicht geklappt.": "Dat is net niet gelukt.",
  "Bitte als Lehrkraft anmelden.": "Log in als leerkracht.",
  "Einladung konnte nicht angelegt werden.": "De uitnodiging kon niet worden aangemaakt.",
  "Kein Klassencode übermittelt.": "Er is geen klascode meegestuurd.",
  "Diese Klasse gibt es nicht.": "Deze klas bestaat niet.",
  "Diese Klasse gehört einer anderen Lehrkraft.": "Deze klas hoort bij een andere leerkracht.",
  // "Eigentümer:in" ⇒ "hoofdaccount van de klas" (Glossar nl §2.12), ohne Personenwort.
  "Diese Lehrkraft ist bereits Eigentümer:in der Klasse.":
    "Dit account is al het hoofdaccount van de klas.",
  "Lehrkraft konnte nicht hinzugefügt werden.": "De leerkracht kon niet worden toegevoegd.",
  "Keine Lehrkraft angegeben.": "Er is geen leerkracht opgegeven.",
  "Die Eigentümer:in lässt sich nicht entfernen. Wenn nötig, die Klasse löschen.":
    "Het hoofdaccount van de klas kan niet worden verwijderd. Verwijder zo nodig de klas.",
  "Dieses Kind gehört nicht zu einer Ihrer Klassen.": "Deze leerling zit niet in een van je klassen.",
  "Bitte den Klassencode der neuen Klasse eingeben.": "Vul de klascode van de nieuwe klas in.",
  "Das Kind ist schon in der Klasse mit diesem Klassencode.":
    "Deze leerling zit al in de klas met deze klascode.",
  "Das Kind konnte nicht verschoben werden. Es ist nichts geändert.":
    "De leerling kon niet worden verplaatst. Er is niets gewijzigd.",
  "Bitte einen Klassencode eingeben - mit ihm melden sich die Kinder an.":
    "Vul een klascode in - daarmee loggen de leerlingen in.",
  "Der Klassencode darf 2 bis 12 Zeichen haben: Buchstaben, Ziffern, Punkt oder Bindestrich.":
    "De klascode mag 2 tot 12 tekens hebben: letters, cijfers, punt of koppelteken.",
  "Bitte einen Klassennamen angeben.": "Vul een naam voor de klas in.",
  "Diesen Klassencode gibt es schon, bitte einen anderen wählen.":
    "Deze klascode bestaat al. Kies een andere.",
  "Diesen Klassennamen haben Sie schon vergeben. Bitte wählen Sie einen anderen Namen.":
    "Je hebt deze klasnaam al gebruikt. Kies een andere naam.",
  "Diesen Klassencode gibt es schon - bitte wählen Sie einen anderen Klassencode (der Klassenname darf gerne bleiben).":
    "Deze klascode bestaat al - kies een andere klascode (de klasnaam mag blijven).",
  "Die Klasse konnte nicht geändert werden. Es ist nichts geändert.":
    "De klas kon niet worden gewijzigd. Er is niets gewijzigd.",
  "Bitte einen Klassencode angeben - mit ihm melden sich die Kinder an.":
    "Vul een klascode in - daarmee loggen de leerlingen in.",
  // Klassenwedstrijd - liest das KIND: je, Gegenwart; die Lehrkraft wird nicht genannt.
  "Ein Klassenmatch kann nur ein Kind einer Klasse ausschreiben.":
    "Een Klassenwedstrijd kan alleen vanuit een klas worden gestart.",
  "Ein Klassenmatch gibt es nur in einer Klasse.": "Een Klassenwedstrijd is er alleen in een klas.",
  "Eure Lehrkraft hat das Klassenmatch für diese Klasse ausgeschaltet.":
    "In deze klas is de Klassenwedstrijd uitgezet.",
  "Du hast schon ein Klassenmatch ausgeschrieben, das noch offen ist. Ein zweites geht erst, wenn es vorbei ist.":
    "Je Klassenwedstrijd is nog niet afgelopen. Een volgende kun je starten als die voorbij is.",
  "Du bist schon in einem anderen Klassenmatch dabei. Ein zweites geht erst, wenn es vorbei ist.":
    "Je doet al mee aan een andere Klassenwedstrijd. Aan een nieuwe kun je meedoen als die voorbij is.",
  "Dieses Klassenmatch ist schon vorbei.": "Deze Klassenwedstrijd is al afgelopen.",
  "Dieses Klassenmatch gibt es nicht (mehr).": "Deze Klassenwedstrijd bestaat niet of is al afgelopen.",
  "Klasse konnte nicht angelegt werden. Ist der Server erreichbar?":
    "De klas kon niet worden aangemaakt. Is er een internetverbinding?",
  "Die Klasse wurde geändert, konnte aber nicht neu gelesen werden. Bitte die Seite neu laden.":
    "De klas is gewijzigd, maar kon niet opnieuw worden geladen. Laad de pagina opnieuw.",
  "Klasse konnte nicht gelöscht werden.": "De klas kon niet worden verwijderd.",
  "Diesen Code gibt es schon, bitte einen anderen wählen.": "Deze code bestaat al. Kies een andere.",
  "Bitte zuerst als Lehrkraft anmelden.": "Log eerst in als leerkracht.",
  "Diesen Namen gibt es in der Klasse schon.": "Deze naam bestaat al in de klas.",
  "Die Kontakt-E-Mail konnte nicht gespeichert werden.":
    "Het e-mailadres voor contact kon niet worden opgeslagen.",
  "Passwort konnte nicht gesetzt werden (mindestens 4 Zeichen).":
    "Het wachtwoord kon niet worden ingesteld (minstens 4 tekens).",
  "Passwort konnte nicht zurückgesetzt werden.": "Het wachtwoord kon niet opnieuw worden ingesteld.",
  "Die Eigentümer:in lässt sich nicht entfernen.": "Het hoofdaccount van de klas kan niet worden verwijderd.",
  // Melden (Glossar nl §2.7): die Meldung; der deutsche Satz sagt "Sie": je.
  "Die Meldung ist leer.": "De melding is leeg.",
  "Es sind schon mehrere Meldungen unterwegs. Bitte versuchen Sie es in einer Stunde noch einmal.":
    "Er zijn al meerdere meldingen onderweg. Probeer het over een uur opnieuw.",
  "Aktion fehlgeschlagen. Ist der Server erreichbar?": "Dat is niet gelukt. Is er een internetverbinding?",
};

const MUSTER_NL: readonly [RegExp, (m: RegExpMatchArray) => string][] = [
  [/^Das Passwort braucht mindestens (\d+) Zeichen\.$/, (m) => `Het wachtwoord moet minstens ${tekensServerNl(m[1])} hebben.`],
  [/^Das neue Passwort braucht mindestens (\d+) Zeichen\.$/, (m) => `Het nieuwe wachtwoord moet minstens ${tekensServerNl(m[1])} hebben.`],
  [/^Das Passwort muss mindestens (\d+) Zeichen lang sein\.$/, (m) => `Het wachtwoord moet minstens ${tekensServerNl(m[1])} hebben.`],
  [/^Aktion fehlgeschlagen \((\d+)\)\. Bitte erneut versuchen\.$/, (m) => `Dat is niet gelukt (${m[1]}). Probeer het opnieuw.`],
  // Code und Klassenname mit Kopfwort davor, nie gebeugt.
  [
    /^Eine Klasse mit dem Klassencode „(.+)“ gibt es nicht\. Bitte den Code prüfen\.$/,
    (m) => `Er is geen klas met klascode ${m[1]}. Controleer de code.`,
  ],
  [
    /^In der Klasse „(.+)“ sind bereits (\d+) Kinder\. Mehr als (\d+) sind je Klasse nicht vorgesehen\.$/,
    (m) => `In klas ${m[1]} ${zittenLeerlingenNl(m[2])}. Een klas kan hoogstens ${leerlingenServerNl(m[3])} hebben.`,
  ],
  // Der Name nach einem Doppelpunkt.
  [
    /^In der neuen Klasse gibt es schon ein Kind mit dem Namen „(.+)“\. Ändern Sie zuerst den Namen eines der beiden Kinder\.$/,
    (m) => `In de nieuwe klas zit al een leerling met dezelfde naam: ${m[1]}. Wijzig eerst de naam van een van beide leerlingen.`,
  ],
  [
    /^Mehr als (\d+) Klassen sind je Konto nicht vorgesehen\. Brauchst du wirklich mehr, melde dich bitte - dann heben wir die Grenze an\.$/,
    (m) =>
      `Een account kan hoogstens ${klassenServerNl(m[1])} hebben. Heb je echt meer nodig, neem dan contact met ons op - dan verhogen we de grens.`,
  ],
  [
    /^In dieser Klasse sind bereits (\d+) Kinder\. Mehr als (\d+) sind je Klasse nicht vorgesehen - lege bitte eine zweite Klasse an\.$/,
    (m) => `In deze klas ${zittenLeerlingenNl(m[1])}. Een klas kan hoogstens ${leerlingenServerNl(m[2])} hebben - maak een tweede klas aan.`,
  ],
];

/** ★ O2-LIB (30.10.2026): a versão portuguesa (Portugal) de uma frase do servidor - ou `null` (então fica em alemão com `lang="de"`). */
export function serverMeldungPortugiesisch(text: string): string | null {
  const sauber = text.trim();
  const fest = SERVER_MELDUNGEN_PT[sauber];
  if (fest) return fest;
  for (const [muster, bau] of MUSTER_PT) {
    const m = sauber.match(muster);
    if (m) return bau(m);
  }
  return null;
}

/**
 * ★★ O2-LIB (30.10.2026): AS MESMAS FRASES DO SERVIDOR EM PORTUGUÊS (Portugal) - escritas a partir da função
 * da frase, não traduzidas palavra a palavra (Glossário pt): onde a frase alemã diz "du" (criança,
 * quem pratica sozinho) fala-se por "tu"; onde diz "Sie" ou fala a gestão da turma (docentes),
 * o tratamento sem pronome ("Introduza o código da turma."); caso contrário, uma frase sem pessoa.
 * Sem adjetivo nem particípio colado a uma pessoa (regra 2), "a pessoa" e "estudantes" para as crianças
 * vistas por quem ensina. Códigos e nomes nunca vão entre aspas e levam sempre um nome à frente
 * ("código da turma 4B", "Na turma 4B") - estas frases aparecem muitas vezes numa zona de leitura
 * em voz alta. "Corrida da turma" para o Klassenmatch, "ligação" para link, "palavra-passe".
 * O vigia exige uma frase portuguesa por cada chave inglesa.
 */
export const SERVER_MELDUNGEN_PT: Readonly<Record<string, string>> = {
  "Bitte einen Namen angeben.": "O nome é obrigatório.",
  "Bitte eine gültige E-Mail angeben.": "É preciso um endereço de e-mail válido.",
  "Für diese E-Mail gibt es schon ein Konto.": "Já existe uma conta com este endereço de e-mail.",
  "Konto konnte nicht erstellt werden. Ist der Server erreichbar?":
    "Não foi possível criar a conta. A ligação à internet está a funcionar?",
  "E-Mail oder Passwort stimmt nicht.": "O endereço de e-mail ou a palavra-passe estão incorretos.",
  "Klassencode, Name oder Passwort stimmt nicht.": "O código da turma, o nome ou a palavra-passe estão incorretos.",
  "Bitte gib deinen Namen an.": "Escreve o teu nome.",
  "Bitte gib eine gültige E-Mail-Adresse an.": "Escreve um endereço de e-mail válido.",
  "Mit dieser E-Mail-Adresse gibt es schon ein Konto. Melde dich an oder nimm eine andere Adresse.":
    "Já existe uma conta com este endereço de e-mail. Inicia sessão ou usa outro endereço.",
  "Das Konto konnte nicht angelegt werden.": "Não foi possível criar a conta.",
  "E-Mail-Adresse oder Passwort stimmt nicht.": "O endereço de e-mail ou a palavra-passe estão incorretos.",
  "Ein eigenes Konto braucht eine Verbindung zum Server.": "Uma conta pessoal precisa de ligação ao servidor.",
  "Dafür braucht es eine Verbindung zum Server.": "Para isto é preciso ligação ao servidor.",
  "Die beiden Passwörter stimmen nicht überein.": "As duas palavras-passe não coincidem.",
  "Die beiden neuen Passwörter stimmen nicht überein.": "As duas palavras-passe novas não coincidem.",
  "Nicht angemeldet.": "Sessão não iniciada.",
  "Bitte zuerst anmelden.": "Primeiro é preciso iniciar sessão.",
  "Konto nicht gefunden.": "Conta não encontrada.",
  "Dieses Konto gibt es nicht.": "Esta conta não existe.",
  "Der Link ist ungültig oder abgelaufen. Bitte fordere einen neuen an.":
    "A ligação não é válida ou já expirou. Pede uma nova.",
  "Das Passwort konnte nicht gesetzt werden. Ist der Server erreichbar?":
    "Não foi possível definir a palavra-passe. A ligação à internet está a funcionar?",
  "Der Link ist abgelaufen oder wurde schon benutzt.": "A ligação já expirou ou já foi usada.",
  "Das Zurücksetzen funktioniert nur mit einem Server-Konto.":
    "Só é possível repor a palavra-passe numa conta no servidor.",
  "Das alte Passwort stimmt nicht.": "A palavra-passe antiga está incorreta.",
  "Das aktuelle Passwort stimmt nicht.": "A palavra-passe atual está incorreta.",
  "Passwort konnte nicht geändert werden. Ist der Server erreichbar?":
    "Não foi possível alterar a palavra-passe. A ligação à internet está a funcionar?",
  "Bitte alle drei Felder ausfüllen.": "É preciso preencher os três campos.",
  "Dieser Link ist abgelaufen oder wurde schon benutzt. Fordere in deinem Konto einen neuen an.":
    "Esta ligação já expirou ou já foi usada. Pede uma nova na tua conta.",
  "Dieser Link ist abgelaufen oder wurde schon benutzt.": "Esta ligação já expirou ou já foi usada.",
  "Link abgelaufen oder Passwort falsch.": "A ligação expirou ou a palavra-passe está incorreta.",
  "Der Wechsel konnte nicht angestoßen werden. Ist die Adresse schon vergeben?":
    "Não foi possível iniciar a mudança de endereço. Outra conta já usa este endereço?",
  "Das Konto konnte nicht gelöscht werden.": "Não foi possível eliminar a conta.",
  "Das hat nicht geklappt.": "Não funcionou.",
  "Das hat nicht geklappt. Bitte versuch es noch einmal.": "Não funcionou. Tenta outra vez.",
  // Convite para mais docentes da turma - lê quem ensina: tratamento sem pronome.
  "Kein Einladungscode übermittelt.": "Falta o código do convite.",
  "Diese Einladung gibt es nicht.": "Este convite não existe.",
  "Diese Einladung wurde zurückgezogen.": "Este convite foi retirado.",
  "Diese Einladung ist abgelaufen. Bitte bei der Lehrkraft eine neue anfordern.":
    "Este convite já expirou. Quem ensina a turma pode enviar um novo.",
  "Bitte zuerst anmelden oder ein Konto anlegen.": "Inicie sessão ou crie uma conta primeiro.",
  "Diese Einladung wurde bereits von einem anderen Konto eingelöst.":
    "Este convite já foi aceite por outra conta.",
  "Diese Klasse gibt es nicht mehr.": "Esta turma já não existe.",
  "Das hat gerade nicht geklappt.": "Agora não funcionou.",
  "Bitte als Lehrkraft anmelden.": "Inicie sessão com uma conta para docentes.",
  "Einladung konnte nicht angelegt werden.": "Não foi possível criar o convite.",
  "Kein Klassencode übermittelt.": "Falta o código da turma.",
  "Diese Klasse gibt es nicht.": "Esta turma não existe.",
  // "Eigentümer:in" => a conta a que a turma pertence - sem nome de pessoa com género.
  "Diese Klasse gehört einer anderen Lehrkraft.": "Esta turma pertence a outra conta.",
  "Diese Lehrkraft ist bereits Eigentümer:in der Klasse.": "Esta turma já pertence à conta desta pessoa.",
  "Lehrkraft konnte nicht hinzugefügt werden.": "Não foi possível adicionar a pessoa à turma.",
  "Keine Lehrkraft angegeben.": "Não foi indicada nenhuma pessoa.",
  "Die Eigentümer:in lässt sich nicht entfernen. Wenn nötig, die Klasse löschen.":
    "A pessoa a quem a turma pertence não pode ser removida. Se for preciso, elimine a turma.",
  "Dieses Kind gehört nicht zu einer Ihrer Klassen.": "Esta pessoa não está em nenhuma das suas turmas.",
  "Bitte den Klassencode der neuen Klasse eingeben.": "Introduza o código da nova turma.",
  "Das Kind ist schon in der Klasse mit diesem Klassencode.": "Esta pessoa já está na turma com este código.",
  "Das Kind konnte nicht verschoben werden. Es ist nichts geändert.":
    "Não foi possível mover a pessoa. Nada foi alterado.",
  "Bitte einen Klassencode eingeben - mit ihm melden sich die Kinder an.":
    "Introduza um código da turma - é com ele que os estudantes iniciam sessão.",
  "Der Klassencode darf 2 bis 12 Zeichen haben: Buchstaben, Ziffern, Punkt oder Bindestrich.":
    "O código da turma pode ter de 2 a 12 carateres: letras, algarismos, ponto ou hífen.",
  "Bitte einen Klassennamen angeben.": "Indique um nome para a turma.",
  "Diesen Klassencode gibt es schon, bitte einen anderen wählen.": "Este código da turma já existe. Escolha outro.",
  "Diesen Klassennamen haben Sie schon vergeben. Bitte wählen Sie einen anderen Namen.":
    "Já tem uma turma com este nome. Escolha outro nome.",
  "Diesen Klassencode gibt es schon - bitte wählen Sie einen anderen Klassencode (der Klassenname darf gerne bleiben).":
    "Este código da turma já existe - escolha outro código (o nome da turma pode ficar como está).",
  "Die Klasse konnte nicht geändert werden. Es ist nichts geändert.":
    "Não foi possível alterar a turma. Nada foi alterado.",
  "Bitte einen Klassencode angeben - mit ihm melden sich die Kinder an.":
    "Introduza um código da turma - é com ele que os estudantes iniciam sessão.",
  // Corrida da turma - lê a CRIANÇA: "tu", presente e futuro em vez de pretérito sobre a pessoa; docentes não são nomeados.
  "Ein Klassenmatch kann nur ein Kind einer Klasse ausschreiben.":
    "Só quem está numa turma pode lançar uma Corrida da turma.",
  "Ein Klassenmatch gibt es nur in einer Klasse.": "A Corrida da turma só existe dentro de uma turma.",
  "Eure Lehrkraft hat das Klassenmatch für diese Klasse ausgeschaltet.":
    "Nesta turma, a Corrida da turma está desativada.",
  "Du hast schon ein Klassenmatch ausgeschrieben, das noch offen ist. Ein zweites geht erst, wenn es vorbei ist.":
    "Já lançaste uma Corrida da turma que ainda está aberta. Só podes lançar outra quando esta acabar.",
  "Du bist schon in einem anderen Klassenmatch dabei. Ein zweites geht erst, wenn es vorbei ist.":
    "Já estás noutra Corrida da turma. Só podes entrar numa nova quando essa acabar.",
  "Dieses Klassenmatch ist schon vorbei.": "Esta Corrida da turma já acabou.",
  "Dieses Klassenmatch gibt es nicht (mehr).": "Esta Corrida da turma não existe ou já acabou.",
  "Klasse konnte nicht angelegt werden. Ist der Server erreichbar?":
    "Não foi possível criar a turma. A ligação à internet está a funcionar?",
  "Die Klasse wurde geändert, konnte aber nicht neu gelesen werden. Bitte die Seite neu laden.":
    "A turma foi alterada, mas não foi possível lê-la de novo. Atualize a página.",
  "Klasse konnte nicht gelöscht werden.": "Não foi possível eliminar a turma.",
  "Diesen Code gibt es schon, bitte einen anderen wählen.": "Este código já existe. Escolha outro.",
  "Bitte zuerst als Lehrkraft anmelden.": "Primeiro inicie sessão com uma conta para docentes.",
  "Diesen Namen gibt es in der Klasse schon.": "Este nome já existe na turma.",
  "Die Kontakt-E-Mail konnte nicht gespeichert werden.": "Não foi possível guardar o e-mail de contacto.",
  "Passwort konnte nicht gesetzt werden (mindestens 4 Zeichen).":
    "Não foi possível definir a palavra-passe (mínimo de 4 carateres).",
  "Passwort konnte nicht zurückgesetzt werden.": "Não foi possível repor a palavra-passe.",
  "Die Eigentümer:in lässt sich nicht entfernen.": "A pessoa a quem a turma pertence não pode ser removida.",
  // "Comunicar" (Glossário pt §2.7) - a mensagem; a frase alemã diz "Sie": tratamento sem pronome.
  "Die Meldung ist leer.": "A mensagem está vazia.",
  "Es sind schon mehrere Meldungen unterwegs. Bitte versuchen Sie es in einer Stunde noch einmal.":
    "Já há várias mensagens a caminho. Tente outra vez dentro de uma hora.",
  "Aktion fehlgeschlagen. Ist der Server erreichbar?": "A ação falhou. A ligação à internet está a funcionar?",
};

/** ★ O2-LIB (30.10.2026): "1 caráter · 5 carateres" (pt-PT, AO90; só o 1 é singular). */
const carateresPt = (n: string) => (Number(n) === 1 ? `${n} caráter` : `${n} carateres`);

/** "há 1 pessoa · há 5 pessoas" - o verbo "há" é igual nas duas formas. */
const pessoasPt = (n: string) => (Number(n) === 1 ? `${n} pessoa` : `${n} pessoas`);

/** "no máximo 1 turma · 50 turmas". */
const turmasPt = (n: string) => (Number(n) === 1 ? `${n} turma` : `${n} turmas`);

const MUSTER_PT: readonly [RegExp, (m: RegExpMatchArray) => string][] = [
  [/^Das Passwort braucht mindestens (\d+) Zeichen\.$/, (m) => `A palavra-passe tem de ter, pelo menos, ${carateresPt(m[1])}.`],
  [
    /^Das neue Passwort braucht mindestens (\d+) Zeichen\.$/,
    (m) => `A palavra-passe nova tem de ter, pelo menos, ${carateresPt(m[1])}.`,
  ],
  [
    /^Das Passwort muss mindestens (\d+) Zeichen lang sein\.$/,
    (m) => `A palavra-passe tem de ter, pelo menos, ${carateresPt(m[1])}.`,
  ],
  // hookError - quase sempre na gestão da turma, por isso tratamento sem pronome.
  [/^Aktion fehlgeschlagen \((\d+)\)\. Bitte erneut versuchen\.$/, (m) => `A ação falhou (${m[1]}). Tente outra vez.`],
  // Código e nome da turma com um nome à frente, sem aspas e sem flexão.
  [
    /^Eine Klasse mit dem Klassencode „(.+)“ gibt es nicht\. Bitte den Code prüfen\.$/,
    (m) => `Nenhuma turma tem o código da turma ${m[1]}. Verifique o código.`,
  ],
  [
    /^In der Klasse „(.+)“ sind bereits (\d+) Kinder\. Mehr als (\d+) sind je Klasse nicht vorgesehen\.$/,
    (m) => `Na turma ${m[1]} já há ${pessoasPt(m[2])}. Uma turma pode ter, no máximo, ${pessoasPt(m[3])}.`,
  ],
  // O nome depois de dois pontos.
  [
    /^In der neuen Klasse gibt es schon ein Kind mit dem Namen „(.+)“\. Ändern Sie zuerst den Namen eines der beiden Kinder\.$/,
    (m) => `Na nova turma já existe uma pessoa com o mesmo nome: ${m[1]}. Altere primeiro o nome de uma das duas pessoas.`,
  ],
  // A frase alemã trata aqui a pessoa docente por "du" - em português vale o tratamento sem pronome.
  [
    /^Mehr als (\d+) Klassen sind je Konto nicht vorgesehen\. Brauchst du wirklich mehr, melde dich bitte - dann heben wir die Grenze an\.$/,
    (m) =>
      `Cada conta pode ter, no máximo, ${turmasPt(m[1])}. Se precisar mesmo de mais, escreva-nos - aumentamos o limite.`,
  ],
  [
    /^In dieser Klasse sind bereits (\d+) Kinder\. Mehr als (\d+) sind je Klasse nicht vorgesehen - lege bitte eine zweite Klasse an\.$/,
    (m) => `Nesta turma já há ${pessoasPt(m[1])}. Uma turma pode ter, no máximo, ${pessoasPt(m[2])} - crie uma segunda turma.`,
  ],
];

/** ★ O2-LIB (30.10.2026): die brasilianische Fassung eines Server-Satzes - oder `null` (dann bleibt er deutsch mit `lang="de"`). */
export function serverMeldungBrasilianisch(text: string): string | null {
  const sauber = text.trim();
  const fest = SERVER_MELDUNGEN_BR[sauber];
  if (fest) return fest;
  for (const [muster, bau] of MUSTER_BR) {
    const m = sauber.match(muster);
    if (m) return bau(m);
  }
  return null;
}

/**
 * ★★ O2-LIB (30.10.2026): DIESELBEN SERVER-SÄTZE AUF PORTUGIESISCH (BRASILIEN) - Glossar
 * `recherche-portugiesisch-brasilien-2026-10-25/GLOSSAR-pt-BR.md`. Aus der Funktion geschrieben,
 * nicht Wort für Wort übersetzt: você für alle (Imperativ der 3. Person: "Digite", "Informe", "Entre"),
 * "docente" und "pessoa" statt geschlechtigter Personenwörter, "estudantes" für Kinder in der
 * Lehrkraft-Sicht, "Competição da turma" für das Klassenmatch, "relato" für die Meldung. Kein Partizip
 * und kein Adjektiv am Menschen. Keine Anführungszeichen - die Sätze stehen oft in einem Live-Bereich;
 * Code und Name stehen mit Kopfwort davor oder nach einem Doppelpunkt, nie gebeugt.
 */
export const SERVER_MELDUNGEN_BR: Readonly<Record<string, string>> = {
  "Bitte einen Namen angeben.": "Informe um nome.",
  "Bitte eine gültige E-Mail angeben.": "Informe um endereço de e-mail válido.",
  "Für diese E-Mail gibt es schon ein Konto.": "Já existe uma conta com este e-mail.",
  "Konto konnte nicht erstellt werden. Ist der Server erreichbar?":
    "Não foi possível criar a conta. Verifique a conexão com a internet.",
  "E-Mail oder Passwort stimmt nicht.": "E-mail ou senha incorretos.",
  "Klassencode, Name oder Passwort stimmt nicht.": "Código da turma, nome ou senha incorretos.",
  "Bitte gib deinen Namen an.": "Digite o seu nome.",
  "Bitte gib eine gültige E-Mail-Adresse an.": "Digite um endereço de e-mail válido.",
  "Mit dieser E-Mail-Adresse gibt es schon ein Konto. Melde dich an oder nimm eine andere Adresse.":
    "Já existe uma conta com este endereço de e-mail. Entre nela ou use outro endereço.",
  "Das Konto konnte nicht angelegt werden.": "Não foi possível criar a conta.",
  "E-Mail-Adresse oder Passwort stimmt nicht.": "Endereço de e-mail ou senha incorretos.",
  "Ein eigenes Konto braucht eine Verbindung zum Server.": "Uma conta pessoal precisa de conexão com o servidor.",
  "Dafür braucht es eine Verbindung zum Server.": "Para isso, é preciso ter conexão com o servidor.",
  "Die beiden Passwörter stimmen nicht überein.": "As duas senhas não são iguais.",
  "Die beiden neuen Passwörter stimmen nicht überein.": "As duas senhas novas não são iguais.",
  "Nicht angemeldet.": "Nenhuma conta conectada.",
  "Bitte zuerst anmelden.": "Primeiro, entre na sua conta.",
  "Konto nicht gefunden.": "Conta não encontrada.",
  "Dieses Konto gibt es nicht.": "Esta conta não existe.",
  "Der Link ist ungültig oder abgelaufen. Bitte fordere einen neuen an.":
    "O link é inválido ou expirou. Peça um novo.",
  "Das Passwort konnte nicht gesetzt werden. Ist der Server erreichbar?":
    "Não foi possível definir a senha. Verifique a conexão com a internet.",
  "Der Link ist abgelaufen oder wurde schon benutzt.": "O link expirou ou já foi usado.",
  "Das Zurücksetzen funktioniert nur mit einem Server-Konto.":
    "Redefinir a senha só funciona com uma conta no servidor.",
  "Das alte Passwort stimmt nicht.": "A senha antiga não está correta.",
  "Das aktuelle Passwort stimmt nicht.": "A senha atual não está correta.",
  "Passwort konnte nicht geändert werden. Ist der Server erreichbar?":
    "Não foi possível alterar a senha. Verifique a conexão com a internet.",
  "Bitte alle drei Felder ausfüllen.": "Preencha os três campos.",
  "Dieser Link ist abgelaufen oder wurde schon benutzt. Fordere in deinem Konto einen neuen an.":
    "Este link expirou ou já foi usado. Peça um novo na sua conta.",
  "Dieser Link ist abgelaufen oder wurde schon benutzt.": "Este link expirou ou já foi usado.",
  "Link abgelaufen oder Passwort falsch.": "O link expirou ou a senha está incorreta.",
  "Der Wechsel konnte nicht angestoßen werden. Ist die Adresse schon vergeben?":
    "Não foi possível iniciar a troca. O endereço já está em uso?",
  "Das Konto konnte nicht gelöscht werden.": "Não foi possível excluir a conta.",
  "Das hat nicht geklappt.": "Não deu certo.",
  "Das hat nicht geklappt. Bitte versuch es noch einmal.": "Não deu certo. Tente de novo.",
  // Einladung als weitere Lehrkraft - liest eine Lehrkraft.
  "Kein Einladungscode übermittelt.": "Nenhum código de convite foi enviado.",
  "Diese Einladung gibt es nicht.": "Este convite não existe.",
  "Diese Einladung wurde zurückgezogen.": "Este convite foi cancelado.",
  "Diese Einladung ist abgelaufen. Bitte bei der Lehrkraft eine neue anfordern.":
    "Este convite expirou. A pessoa docente da turma pode enviar um novo.",
  "Bitte zuerst anmelden oder ein Konto anlegen.": "Primeiro, entre na sua conta ou crie uma.",
  "Diese Einladung wurde bereits von einem anderen Konto eingelöst.":
    "Este convite já foi aceito por outra conta.",
  "Diese Klasse gibt es nicht mehr.": "Esta turma não existe mais.",
  "Das hat gerade nicht geklappt.": "Isso não deu certo agora.",
  "Bitte als Lehrkraft anmelden.": "Entre com uma conta de docente.",
  "Einladung konnte nicht angelegt werden.": "Não foi possível criar o convite.",
  "Kein Klassencode übermittelt.": "Nenhum código da turma foi enviado.",
  "Diese Klasse gibt es nicht.": "Esta turma não existe.",
  "Diese Klasse gehört einer anderen Lehrkraft.": "Esta turma pertence a outra conta.",
  "Diese Lehrkraft ist bereits Eigentümer:in der Klasse.": "Esta turma já pertence à conta desta pessoa.",
  "Lehrkraft konnte nicht hinzugefügt werden.": "Não foi possível adicionar a pessoa docente.",
  "Keine Lehrkraft angegeben.": "Nenhuma pessoa docente informada.",
  "Die Eigentümer:in lässt sich nicht entfernen. Wenn nötig, die Klasse löschen.":
    "A pessoa proprietária da turma não pode ser removida. Se necessário, exclua a turma.",
  "Dieses Kind gehört nicht zu einer Ihrer Klassen.": "Esta pessoa não está em nenhuma das suas turmas.",
  "Bitte den Klassencode der neuen Klasse eingeben.": "Informe o código da nova turma.",
  "Das Kind ist schon in der Klasse mit diesem Klassencode.": "Esta pessoa já está na turma com este código.",
  "Das Kind konnte nicht verschoben werden. Es ist nichts geändert.":
    "Não foi possível mover a pessoa. Nada foi alterado.",
  "Bitte einen Klassencode eingeben - mit ihm melden sich die Kinder an.":
    "Informe um código da turma - é com ele que os estudantes entram.",
  "Der Klassencode darf 2 bis 12 Zeichen haben: Buchstaben, Ziffern, Punkt oder Bindestrich.":
    "O código da turma pode ter de 2 a 12 caracteres: letras, números, ponto ou hífen.",
  "Bitte einen Klassennamen angeben.": "Informe um nome para a turma.",
  "Diesen Klassencode gibt es schon, bitte einen anderen wählen.":
    "Este código da turma já existe. Escolha outro.",
  "Diesen Klassennamen haben Sie schon vergeben. Bitte wählen Sie einen anderen Namen.":
    "Você já usou este nome de turma. Escolha outro nome.",
  "Diesen Klassencode gibt es schon - bitte wählen Sie einen anderen Klassencode (der Klassenname darf gerne bleiben).":
    "Este código da turma já existe - escolha outro código da turma (o nome da turma pode continuar o mesmo).",
  "Die Klasse konnte nicht geändert werden. Es ist nichts geändert.":
    "Não foi possível alterar a turma. Nada foi alterado.",
  "Bitte einen Klassencode angeben - mit ihm melden sich die Kinder an.":
    "Informe um código da turma - é com ele que os estudantes entram.",
  // Competição da turma - liest das KIND: você, ohne Partizip am Kind; die Lehrkraft wird nicht genannt.
  "Ein Klassenmatch kann nur ein Kind einer Klasse ausschreiben.":
    "Só quem está em uma turma pode lançar uma Competição da turma.",
  "Ein Klassenmatch gibt es nur in einer Klasse.": "A Competição da turma só existe dentro de uma turma.",
  "Eure Lehrkraft hat das Klassenmatch für diese Klasse ausgeschaltet.":
    "Nesta turma, a Competição da turma está desativada.",
  "Du hast schon ein Klassenmatch ausgeschrieben, das noch offen ist. Ein zweites geht erst, wenn es vorbei ist.":
    "Sua Competição da turma ainda está aberta. Outra só pode ser lançada quando ela terminar.",
  "Du bist schon in einem anderen Klassenmatch dabei. Ein zweites geht erst, wenn es vorbei ist.":
    "Você já participa de outra Competição da turma. Entrar em uma nova só é possível quando ela terminar.",
  "Dieses Klassenmatch ist schon vorbei.": "Esta Competição da turma já terminou.",
  "Dieses Klassenmatch gibt es nicht (mehr).": "Esta Competição da turma não existe ou já terminou.",
  "Klasse konnte nicht angelegt werden. Ist der Server erreichbar?":
    "Não foi possível criar a turma. Verifique a conexão com a internet.",
  "Die Klasse wurde geändert, konnte aber nicht neu gelesen werden. Bitte die Seite neu laden.":
    "A turma foi alterada, mas não foi possível ler os dados de novo. Recarregue a página.",
  "Klasse konnte nicht gelöscht werden.": "Não foi possível excluir a turma.",
  "Diesen Code gibt es schon, bitte einen anderen wählen.": "Este código já existe. Escolha outro.",
  "Bitte zuerst als Lehrkraft anmelden.": "Primeiro, entre com uma conta de docente.",
  "Diesen Namen gibt es in der Klasse schon.": "Este nome já existe na turma.",
  "Die Kontakt-E-Mail konnte nicht gespeichert werden.": "Não foi possível salvar o e-mail de contato.",
  "Passwort konnte nicht gesetzt werden (mindestens 4 Zeichen).":
    "Não foi possível definir a senha (mínimo de 4 caracteres).",
  "Passwort konnte nicht zurückgesetzt werden.": "Não foi possível redefinir a senha.",
  "Die Eigentümer:in lässt sich nicht entfernen.": "A pessoa proprietária da turma não pode ser removida.",
  // Relatar (Glossar): die Meldung ist ein "relato"; der deutsche Satz sagt "Sie": você.
  "Die Meldung ist leer.": "O relato está vazio.",
  "Es sind schon mehrere Meldungen unterwegs. Bitte versuchen Sie es in einer Stunde noch einmal.":
    "Já há vários relatos a caminho. Tente de novo em uma hora.",
  "Aktion fehlgeschlagen. Ist der Server erreichbar?":
    "A ação não deu certo. Verifique a conexão com a internet.",
};

/** "pelo menos 1 caractere · 5 caracteres" - im brasilianischen Portugiesisch gilt "one" für 0 und 1. */
const caracteresServerBr = (n: string): string => (Number(n) < 2 ? `${n} caractere` : `${n} caracteres`);

/** "já há 1 estudante · 5 estudantes" (Kinder aus Lehrkraft-Sicht). */
const estudantesServerBr = (n: string): string => (Number(n) < 2 ? `${n} estudante` : `${n} estudantes`);

/** "no máximo 1 turma · 50 turmas". */
const turmasServerBr = (n: string): string => (Number(n) < 2 ? `${n} turma` : `${n} turmas`);

const MUSTER_BR: readonly [RegExp, (m: RegExpMatchArray) => string][] = [
  [/^Das Passwort braucht mindestens (\d+) Zeichen\.$/, (m) => `A senha precisa ter pelo menos ${caracteresServerBr(m[1])}.`],
  [/^Das neue Passwort braucht mindestens (\d+) Zeichen\.$/, (m) => `A senha nova precisa ter pelo menos ${caracteresServerBr(m[1])}.`],
  [/^Das Passwort muss mindestens (\d+) Zeichen lang sein\.$/, (m) => `A senha precisa ter pelo menos ${caracteresServerBr(m[1])}.`],
  // hookError - meist in der Klassenverwaltung.
  [/^Aktion fehlgeschlagen \((\d+)\)\. Bitte erneut versuchen\.$/, (m) => `A ação não deu certo (${m[1]}). Tente de novo.`],
  // Code und Klassenname mit Kopfwort davor, nie verändert.
  [
    /^Eine Klasse mit dem Klassencode „(.+)“ gibt es nicht\. Bitte den Code prüfen\.$/,
    (m) => `Não existe turma com o código da turma ${m[1]}. Verifique o código.`,
  ],
  [
    /^In der Klasse „(.+)“ sind bereits (\d+) Kinder\. Mehr als (\d+) sind je Klasse nicht vorgesehen\.$/,
    (m) => `Na turma ${m[1]} já há ${estudantesServerBr(m[2])}. Uma turma pode ter no máximo ${estudantesServerBr(m[3])}.`,
  ],
  // Der Name nach einem Doppelpunkt.
  [
    /^In der neuen Klasse gibt es schon ein Kind mit dem Namen „(.+)“\. Ändern Sie zuerst den Namen eines der beiden Kinder\.$/,
    (m) => `Na nova turma já existe uma pessoa com o mesmo nome: ${m[1]}. Primeiro altere o nome de uma das duas pessoas.`,
  ],
  // Der deutsche Satz duzt hier die Lehrkraft - você.
  [
    /^Mehr als (\d+) Klassen sind je Konto nicht vorgesehen\. Brauchst du wirklich mehr, melde dich bitte - dann heben wir die Grenze an\.$/,
    (m) =>
      `Uma conta pode ter no máximo ${turmasServerBr(m[1])}. Se você realmente precisar de mais, entre em contato - vamos aumentar o limite.`,
  ],
  [
    /^In dieser Klasse sind bereits (\d+) Kinder\. Mehr als (\d+) sind je Klasse nicht vorgesehen - lege bitte eine zweite Klasse an\.$/,
    (m) => `Esta turma já tem ${estudantesServerBr(m[1])}. Uma turma pode ter no máximo ${estudantesServerBr(m[2])} - crie uma segunda turma.`,
  ],
];

/** ★ O2-LIB (30.10.2026): die rumänische Fassung eines Server-Satzes - oder `null` (dann bleibt er deutsch mit `lang="de"`). */
export function serverMeldungRumaenisch(text: string): string | null {
  const sauber = text.trim();
  const fest = SERVER_MELDUNGEN_RO[sauber];
  if (fest) return fest;
  for (const [muster, bau] of MUSTER_RO) {
    const m = sauber.match(muster);
    if (m) return bau(m);
  }
  return null;
}

/**
 * ★★ O2-LIB (30.10.2026): DIESELBEN SERVER-SÄTZE AUF RUMÄNISCH - bis dahin bekam die rumänische
 * Bedienung hier die ENGLISCHEN Sätze. Aus der Funktion geschrieben, nicht übersetzt (Glossar
 * Rumänisch): wo der deutsche Satz „du" sagt (Kind, Selbstlernende), steht tu („Scrie-ți
 * numele."); wo er „Sie" sagt oder die Klassenverwaltung spricht (Lehrkraft), die Höflichkeitsform
 * in der Mehrzahl („Introduceți codul clasei."); sonst ein Satz ohne Person. KEIN Adjektiv und
 * kein Partizip an einer Person (Regel 2): „Lipsește conectarea" statt „Nu sunteți conectat".
 * Das Kind in der Lehrkraft-Sicht ist „persoana", die Lehrkraft „cadru didactic". Code und Name nie
 * gebeugt: mit Kopfwort („codul 4B", „clasa 4B"). Keine Anführungszeichen - die Sätze stehen oft
 * in einem Live-Bereich. Kein Satz endet mit Zahl und Punkt. „Raportați" ⇒ „raport".
 */
export const SERVER_MELDUNGEN_RO: Readonly<Record<string, string>> = {
  "Bitte einen Namen angeben.": "Numele este obligatoriu.",
  "Bitte eine gültige E-Mail angeben.": "Este nevoie de o adresă de e-mail validă.",
  "Für diese E-Mail gibt es schon ein Konto.": "Există deja un cont pentru această adresă de e-mail.",
  "Konto konnte nicht erstellt werden. Ist der Server erreichbar?":
    "Contul nu a putut fi creat. Funcționează conexiunea la internet?",
  "E-Mail oder Passwort stimmt nicht.": "Adresa de e-mail sau parola nu este corectă.",
  "Klassencode, Name oder Passwort stimmt nicht.": "Codul clasei, numele sau parola nu sunt corecte.",
  "Bitte gib deinen Namen an.": "Scrie-ți numele.",
  "Bitte gib eine gültige E-Mail-Adresse an.": "Scrie o adresă de e-mail validă.",
  "Mit dieser E-Mail-Adresse gibt es schon ein Konto. Melde dich an oder nimm eine andere Adresse.":
    "Există deja un cont cu această adresă de e-mail. Conectează-te sau folosește altă adresă.",
  "Das Konto konnte nicht angelegt werden.": "Contul nu a putut fi creat.",
  "E-Mail-Adresse oder Passwort stimmt nicht.": "Adresa de e-mail sau parola nu este corectă.",
  "Ein eigenes Konto braucht eine Verbindung zum Server.": "Un cont propriu necesită conexiune la server.",
  "Dafür braucht es eine Verbindung zum Server.": "Pentru asta este nevoie de conexiune la server.",
  "Die beiden Passwörter stimmen nicht überein.": "Cele două parole nu coincid.",
  "Die beiden neuen Passwörter stimmen nicht überein.": "Cele două parole noi nu coincid.",
  // Nicht „Nu sunteți conectat" (Adjektiv an der Person, Regel 2) - ein Satz über die Sache.
  "Nicht angemeldet.": "Lipsește conectarea.",
  "Bitte zuerst anmelden.": "Mai întâi este nevoie de conectare.",
  "Konto nicht gefunden.": "Contul nu a fost găsit.",
  "Dieses Konto gibt es nicht.": "Acest cont nu există.",
  "Der Link ist ungültig oder abgelaufen. Bitte fordere einen neuen an.":
    "Linkul nu este valid sau a expirat. Cere unul nou.",
  "Das Passwort konnte nicht gesetzt werden. Ist der Server erreichbar?":
    "Parola nu a putut fi setată. Funcționează conexiunea la internet?",
  "Der Link ist abgelaufen oder wurde schon benutzt.": "Linkul a expirat sau a fost deja folosit.",
  "Das Zurücksetzen funktioniert nur mit einem Server-Konto.":
    "Resetarea parolei funcționează doar cu un cont pe server.",
  "Das alte Passwort stimmt nicht.": "Parola veche nu este corectă.",
  "Das aktuelle Passwort stimmt nicht.": "Parola actuală nu este corectă.",
  "Passwort konnte nicht geändert werden. Ist der Server erreichbar?":
    "Parola nu a putut fi schimbată. Funcționează conexiunea la internet?",
  "Bitte alle drei Felder ausfüllen.": "Toate cele trei câmpuri trebuie completate.",
  "Dieser Link ist abgelaufen oder wurde schon benutzt. Fordere in deinem Konto einen neuen an.":
    "Acest link a expirat sau a fost deja folosit. Cere unul nou în contul tău.",
  "Dieser Link ist abgelaufen oder wurde schon benutzt.": "Acest link a expirat sau a fost deja folosit.",
  "Link abgelaufen oder Passwort falsch.": "Linkul a expirat sau parola nu este corectă.",
  "Der Wechsel konnte nicht angestoßen werden. Ist die Adresse schon vergeben?":
    "Schimbarea adresei nu a putut fi inițiată. Nu este adresa folosită deja de alt cont?",
  "Das Konto konnte nicht gelöscht werden.": "Contul nu a putut fi șters.",
  "Das hat nicht geklappt.": "Nu a mers.",
  "Das hat nicht geklappt. Bitte versuch es noch einmal.": "Nu a mers. Încearcă din nou.",
  // Einladung als alt cadru didactic - liest eine Lehrkraft: Höflichkeitsform.
  "Kein Einladungscode übermittelt.": "Lipsește codul invitației.",
  "Diese Einladung gibt es nicht.": "Această invitație nu există.",
  "Diese Einladung wurde zurückgezogen.": "Această invitație a fost retrasă.",
  "Diese Einladung ist abgelaufen. Bitte bei der Lehrkraft eine neue anfordern.":
    "Această invitație a expirat. Cereți una nouă de la cadrul didactic al clasei.",
  "Bitte zuerst anmelden oder ein Konto anlegen.": "Mai întâi conectați-vă sau creați un cont.",
  "Diese Einladung wurde bereits von einem anderen Konto eingelöst.":
    "Această invitație a fost deja acceptată de alt cont.",
  "Diese Klasse gibt es nicht mehr.": "Această clasă nu mai există.",
  "Das hat gerade nicht geklappt.": "Acum nu a mers.",
  "Bitte als Lehrkraft anmelden.": "Conectați-vă cu un cont de cadru didactic.",
  "Einladung konnte nicht angelegt werden.": "Invitația nu a putut fi creată.",
  "Kein Klassencode übermittelt.": "Lipsește codul clasei.",
  "Diese Klasse gibt es nicht.": "Această clasă nu există.",
  // „Eigentümer:in" ⇒ das Konto, dem die Klasse gehört - ohne Personenwort (Glossar: Contul principal al clasei).
  "Diese Klasse gehört einer anderen Lehrkraft.": "Această clasă aparține altui cont.",
  "Diese Lehrkraft ist bereits Eigentümer:in der Klasse.": "Clasa aparține deja contului acestei persoane.",
  "Lehrkraft konnte nicht hinzugefügt werden.": "Cadrul didactic nu a putut fi adăugat.",
  "Keine Lehrkraft angegeben.": "Nu a fost indicat niciun cadru didactic.",
  "Die Eigentümer:in lässt sich nicht entfernen. Wenn nötig, die Klasse löschen.":
    "Contul principal al clasei nu poate fi eliminat. Dacă este nevoie, ștergeți clasa.",
  "Dieses Kind gehört nicht zu einer Ihrer Klassen.": "Această persoană nu este în nicio clasă a acestui cont.",
  "Bitte den Klassencode der neuen Klasse eingeben.": "Introduceți codul noii clase.",
  "Das Kind ist schon in der Klasse mit diesem Klassencode.": "Persoana este deja în clasa cu acest cod.",
  "Das Kind konnte nicht verschoben werden. Es ist nichts geändert.":
    "Persoana nu a putut fi mutată. Nu s-a schimbat nimic.",
  "Bitte einen Klassencode eingeben - mit ihm melden sich die Kinder an.":
    "Introduceți un cod al clasei - elevii se conectează cu el.",
  "Der Klassencode darf 2 bis 12 Zeichen haben: Buchstaben, Ziffern, Punkt oder Bindestrich.":
    "Codul clasei poate avea 2-12 caractere: litere, cifre, punct sau cratimă.",
  "Bitte einen Klassennamen angeben.": "Introduceți numele clasei.",
  "Diesen Klassencode gibt es schon, bitte einen anderen wählen.": "Acest cod al clasei există deja. Alegeți altul.",
  "Diesen Klassennamen haben Sie schon vergeben. Bitte wählen Sie einen anderen Namen.":
    "Aveți deja o clasă cu acest nume. Alegeți alt nume.",
  "Diesen Klassencode gibt es schon - bitte wählen Sie einen anderen Klassencode (der Klassenname darf gerne bleiben).":
    "Acest cod al clasei există deja - alegeți alt cod al clasei (numele clasei poate rămâne).",
  "Die Klasse konnte nicht geändert werden. Es ist nichts geändert.":
    "Clasa nu a putut fi modificată. Nu s-a schimbat nimic.",
  "Bitte einen Klassencode angeben - mit ihm melden sich die Kinder an.":
    "Introduceți un cod al clasei - elevii se conectează cu el.",
  // Întrecerea clasei - liest das KIND: tu; die Lehrkraft gar nicht genannt.
  "Ein Klassenmatch kann nur ein Kind einer Klasse ausschreiben.":
    "Întrecerea clasei poate fi lansată doar de cineva din clasă.",
  "Ein Klassenmatch gibt es nur in einer Klasse.": "Întrecerea clasei există doar într-o clasă.",
  "Eure Lehrkraft hat das Klassenmatch für diese Klasse ausgeschaltet.":
    "În această clasă, Întrecerea clasei este oprită.",
  "Du hast schon ein Klassenmatch ausgeschrieben, das noch offen ist. Ein zweites geht erst, wenn es vorbei ist.":
    "Ai lansat deja o Întrecere a clasei care nu s-a încheiat. Poți lansa alta după ce se termină.",
  "Du bist schon in einem anderen Klassenmatch dabei. Ein zweites geht erst, wenn es vorbei ist.":
    "Participi deja la altă Întrecere a clasei. Te poți alătura alteia după ce se termină.",
  "Dieses Klassenmatch ist schon vorbei.": "Această Întrecere a clasei s-a încheiat deja.",
  "Dieses Klassenmatch gibt es nicht (mehr).": "Această Întrecere a clasei nu există sau s-a încheiat.",
  "Klasse konnte nicht angelegt werden. Ist der Server erreichbar?":
    "Clasa nu a putut fi creată. Funcționează conexiunea la internet?",
  "Die Klasse wurde geändert, konnte aber nicht neu gelesen werden. Bitte die Seite neu laden.":
    "Modificarea clasei a fost salvată, dar clasa nu a putut fi încărcată din nou. Reîmprospătați pagina.",
  "Klasse konnte nicht gelöscht werden.": "Clasa nu a putut fi ștearsă.",
  "Diesen Code gibt es schon, bitte einen anderen wählen.": "Acest cod există deja. Alegeți altul.",
  "Bitte zuerst als Lehrkraft anmelden.": "Mai întâi conectați-vă cu un cont de cadru didactic.",
  "Diesen Namen gibt es in der Klasse schon.": "Acest nume există deja în clasă.",
  "Die Kontakt-E-Mail konnte nicht gespeichert werden.": "Adresa de e-mail de contact nu a putut fi salvată.",
  "Passwort konnte nicht gesetzt werden (mindestens 4 Zeichen).":
    "Parola nu a putut fi setată (parola trebuie să aibă cel puțin 4 caractere).",
  "Passwort konnte nicht zurückgesetzt werden.": "Parola nu a putut fi resetată.",
  "Die Eigentümer:in lässt sich nicht entfernen.": "Contul principal al clasei nu poate fi eliminat.",
  // „Raportați" (Glossar §2.7) - die Meldung ist ein „raport"; der deutsche Satz sagt „Sie": Höflichkeitsform.
  "Die Meldung ist leer.": "Raportul este gol.",
  "Es sind schon mehrere Meldungen unterwegs. Bitte versuchen Sie es in einer Stunde noch einmal.":
    "Mai multe rapoarte sunt deja pe drum. Încercați din nou peste o oră.",
  "Aktion fehlgeschlagen. Ist der Server erreichbar?": "Acțiunea nu a reușit. Funcționează conexiunea la internet?",
};

const MUSTER_RO: readonly [RegExp, (m: RegExpMatchArray) => string][] = [
  [/^Das Passwort braucht mindestens (\d+) Zeichen\.$/, (m) => `Parola trebuie să aibă cel puțin ${caractereMeldRo(m[1])}.`],
  [/^Das neue Passwort braucht mindestens (\d+) Zeichen\.$/, (m) => `Parola nouă trebuie să aibă cel puțin ${caractereMeldRo(m[1])}.`],
  [/^Das Passwort muss mindestens (\d+) Zeichen lang sein\.$/, (m) => `Parola trebuie să aibă cel puțin ${caractereMeldRo(m[1])}.`],
  // hookError - meist in der Klassenverwaltung, darum Höflichkeitsform.
  [/^Aktion fehlgeschlagen \((\d+)\)\. Bitte erneut versuchen\.$/, (m) => `Acțiunea nu a reușit (${m[1]}). Încercați din nou.`],
  // Code und Klassenname mit Kopfwort davor, nie gebeugt (Glossar Regel 12).
  [
    /^Eine Klasse mit dem Klassencode „(.+)“ gibt es nicht\. Bitte den Code prüfen\.$/,
    (m) => `Nu există nicio clasă cu codul ${m[1]}. Verificați codul.`,
  ],
  [
    /^In der Klasse „(.+)“ sind bereits (\d+) Kinder\. Mehr als (\d+) sind je Klasse nicht vorgesehen\.$/,
    (m) => `În clasa ${m[1]} ${suntPersoaneMeldRo(m[2])}. O clasă poate avea cel mult ${persoaneMeldRo(m[3])}.`,
  ],
  // Der Name nach einem Doppelpunkt (Glossar Regel 12).
  [
    /^In der neuen Klasse gibt es schon ein Kind mit dem Namen „(.+)“\. Ändern Sie zuerst den Namen eines der beiden Kinder\.$/,
    (m) => `În noua clasă există deja o persoană cu același nume: ${m[1]}. Schimbați mai întâi numele uneia dintre cele două persoane.`,
  ],
  // Der deutsche Satz duzt hier die Lehrkraft - rumänisch gilt die Höflichkeitsform.
  [
    /^Mehr als (\d+) Klassen sind je Konto nicht vorgesehen\. Brauchst du wirklich mehr, melde dich bitte - dann heben wir die Grenze an\.$/,
    (m) =>
      `Un cont poate avea cel mult ${claseMeldRo(m[1])}. Dacă aveți într-adevăr nevoie de mai multe, scrieți-ne - vom ridica limita.`,
  ],
  [
    /^In dieser Klasse sind bereits (\d+) Kinder\. Mehr als (\d+) sind je Klasse nicht vorgesehen - lege bitte eine zweite Klasse an\.$/,
    (m) => `În această clasă ${suntPersoaneMeldRo(m[1])}. O clasă poate avea cel mult ${persoaneMeldRo(m[2])} - creați a doua clasă.`,
  ],
];

/** Rumänische Mehrzahl (one / few / other mit „de" ab 20); `#` wird durch die Zahl ersetzt. */
function mehrzahlMeldRo(zahl: string, formen: { one: string; few: string; other: string }): string {
  const regel = new Intl.PluralRules("ro-RO").select(Number(zahl));
  const form = regel === "one" || regel === "few" ? formen[regel] : formen.other;
  return form.replace("#", zahl);
}

/** „cel puțin 1 caracter · 4 caractere · 20 de caractere". */
const caractereMeldRo = (n: string) => mehrzahlMeldRo(n, { one: "# caracter", few: "# caractere", other: "# de caractere" });

/** „este deja o persoană · sunt deja 2 persoane · sunt deja 20 de persoane". */
const suntPersoaneMeldRo = (n: string) =>
  mehrzahlMeldRo(n, { one: "este deja o persoană", few: "sunt deja # persoane", other: "sunt deja # de persoane" });

/** „cel mult o persoană · 2 persoane · 30 de persoane". */
const persoaneMeldRo = (n: string) =>
  mehrzahlMeldRo(n, { one: "o persoană", few: "# persoane", other: "# de persoane" });

/** „cel mult o clasă · 2 clase · 50 de clase". */
const claseMeldRo = (n: string) => mehrzahlMeldRo(n, { one: "o clasă", few: "# clase", other: "# de clase" });

/** ★ O2-LIB (29.10.2026): „1 elev" / „30 elever" - Zahl und Hauptwort, schwedisch (die Zahl kommt als Text aus dem Muster). */
function eleverSv(n: string): string {
  return Number(n) === 1 ? `${n} elev` : `${n} elever`;
}

/** ★ O2-LIB (29.10.2026): „1 klass" / „5 klasser" - schwedisch. */
function klasserSv(n: string): string {
  return Number(n) === 1 ? `${n} klass` : `${n} klasser`;
}

/** ★ O2-LIB (29.10.2026): die schwedische Fassung eines Server-Satzes - oder `null` (dann bleibt er deutsch). */
export function serverMeldungSchwedisch(text: string): string | null {
  const sauber = text.trim();
  const fest = SERVER_MELDUNGEN_SV[sauber];
  if (fest) return fest;
  for (const [muster, bau] of MUSTER_SV) {
    const m = sauber.match(muster);
    if (m) return bau(m);
  }
  return null;
}

/**
 * ★★ O2-LIB (29.10.2026): DIESELBEN SERVER-SÄTZE AUF SCHWEDISCH. Aus dem Sinn
 * geschrieben (Glossar Schwedisch): du für alle - auch für Lärare; Eleven in der
 * Lehrkraft-Sicht, klasskod und Klasstävlingen als feste Wörter; ohne
 * Anführungszeichen (die Sätze stehen oft in einem Live-Bereich), Codes und Namen
 * nie gebeugt - mit Kopfwort davor oder nach einem Doppelpunkt. Der Wächter
 * verlangt für JEDEN englischen Schlüssel einen schwedischen.
 */
export const SERVER_MELDUNGEN_SV: Readonly<Record<string, string>> = {
  "Bitte einen Namen angeben.": "Ange ett namn.",
  "Bitte eine gültige E-Mail angeben.": "Ange en giltig e-postadress.",
  "Für diese E-Mail gibt es schon ein Konto.": "Det finns redan ett konto med den här e-postadressen.",
  "Konto konnte nicht erstellt werden. Ist der Server erreichbar?":
    "Kontot kunde inte skapas. Kontrollera din internetanslutning.",
  "E-Mail oder Passwort stimmt nicht.": "E-postadressen eller lösenordet stämmer inte.",
  "Klassencode, Name oder Passwort stimmt nicht.": "Klasskoden, namnet eller lösenordet stämmer inte.",
  "Bitte gib deinen Namen an.": "Skriv ditt namn.",
  "Bitte gib eine gültige E-Mail-Adresse an.": "Skriv en giltig e-postadress.",
  "Mit dieser E-Mail-Adresse gibt es schon ein Konto. Melde dich an oder nimm eine andere Adresse.":
    "Det finns redan ett konto med den här e-postadressen. Logga in eller använd en annan adress.",
  "Das Konto konnte nicht angelegt werden.": "Kontot kunde inte skapas.",
  "E-Mail-Adresse oder Passwort stimmt nicht.": "E-postadressen eller lösenordet stämmer inte.",
  "Ein eigenes Konto braucht eine Verbindung zum Server.": "Ett eget konto kräver anslutning till servern.",
  "Dafür braucht es eine Verbindung zum Server.": "Det här kräver anslutning till servern.",
  "Die beiden Passwörter stimmen nicht überein.": "De två lösenorden stämmer inte överens.",
  "Die beiden neuen Passwörter stimmen nicht überein.": "De två nya lösenorden stämmer inte överens.",
  "Nicht angemeldet.": "Du är inte inloggad.",
  "Bitte zuerst anmelden.": "Logga in först.",
  "Konto nicht gefunden.": "Kontot hittades inte.",
  "Dieses Konto gibt es nicht.": "Det här kontot finns inte.",
  "Der Link ist ungültig oder abgelaufen. Bitte fordere einen neuen an.":
    "Länken är ogiltig eller har gått ut. Be om en ny.",
  "Das Passwort konnte nicht gesetzt werden. Ist der Server erreichbar?":
    "Lösenordet kunde inte ställas in. Kontrollera din internetanslutning.",
  "Der Link ist abgelaufen oder wurde schon benutzt.": "Länken har gått ut eller har redan använts.",
  "Das Zurücksetzen funktioniert nur mit einem Server-Konto.":
    "Återställning fungerar bara med ett konto på servern.",
  "Das alte Passwort stimmt nicht.": "Det gamla lösenordet stämmer inte.",
  "Das aktuelle Passwort stimmt nicht.": "Det nuvarande lösenordet stämmer inte.",
  "Passwort konnte nicht geändert werden. Ist der Server erreichbar?":
    "Lösenordet kunde inte ändras. Kontrollera din internetanslutning.",
  "Bitte alle drei Felder ausfüllen.": "Fyll i alla tre fälten.",
  "Dieser Link ist abgelaufen oder wurde schon benutzt. Fordere in deinem Konto einen neuen an.":
    "Den här länken har gått ut eller har redan använts. Be om en ny i ditt konto.",
  "Dieser Link ist abgelaufen oder wurde schon benutzt.": "Den här länken har gått ut eller har redan använts.",
  "Link abgelaufen oder Passwort falsch.": "Länken har gått ut eller lösenordet är fel.",
  "Der Wechsel konnte nicht angestoßen werden. Ist die Adresse schon vergeben?":
    "Bytet kunde inte påbörjas. Används adressen redan?",
  "Das Konto konnte nicht gelöscht werden.": "Kontot kunde inte tas bort.",
  "Das hat nicht geklappt.": "Det gick inte.",
  "Das hat nicht geklappt. Bitte versuch es noch einmal.": "Det gick inte. Försök igen.",
  "Kein Einladungscode übermittelt.": "Ingen inbjudningskod skickades.",
  "Diese Einladung gibt es nicht.": "Den här inbjudan finns inte.",
  "Diese Einladung wurde zurückgezogen.": "Den här inbjudan har dragits tillbaka.",
  "Diese Einladung ist abgelaufen. Bitte bei der Lehrkraft eine neue anfordern.":
    "Den här inbjudan har gått ut. Be läraren om en ny.",
  "Bitte zuerst anmelden oder ein Konto anlegen.": "Logga in eller skapa ett konto först.",
  "Diese Einladung wurde bereits von einem anderen Konto eingelöst.":
    "Den här inbjudan har redan använts av ett annat konto.",
  "Diese Klasse gibt es nicht mehr.": "Den här klassen finns inte längre.",
  "Das hat gerade nicht geklappt.": "Det gick inte just nu.",
  "Bitte als Lehrkraft anmelden.": "Logga in som lärare.",
  "Einladung konnte nicht angelegt werden.": "Inbjudan kunde inte skapas.",
  "Kein Klassencode übermittelt.": "Ingen klasskod skickades.",
  "Diese Klasse gibt es nicht.": "Den här klassen finns inte.",
  "Diese Klasse gehört einer anderen Lehrkraft.": "Den här klassen tillhör en annan lärare.",
  "Diese Lehrkraft ist bereits Eigentümer:in der Klasse.": "Den här läraren äger redan klassen.",
  "Lehrkraft konnte nicht hinzugefügt werden.": "Läraren kunde inte läggas till.",
  "Keine Lehrkraft angegeben.": "Ingen lärare har angetts.",
  "Die Eigentümer:in lässt sich nicht entfernen. Wenn nötig, die Klasse löschen.":
    "Den som äger klassen kan inte tas bort. Ta bort klassen om det behövs.",
  "Dieses Kind gehört nicht zu einer Ihrer Klassen.": "Den här eleven går inte i någon av dina klasser.",
  "Bitte den Klassencode der neuen Klasse eingeben.": "Ange klasskoden för den nya klassen.",
  "Das Kind ist schon in der Klasse mit diesem Klassencode.":
    "Eleven går redan i klassen med den här klasskoden.",
  "Das Kind konnte nicht verschoben werden. Es ist nichts geändert.":
    "Eleven kunde inte flyttas. Ingenting har ändrats.",
  "Bitte einen Klassencode eingeben - mit ihm melden sich die Kinder an.":
    "Ange en klasskod - eleverna loggar in med den.",
  "Der Klassencode darf 2 bis 12 Zeichen haben: Buchstaben, Ziffern, Punkt oder Bindestrich.":
    "Klasskoden får ha 2-12 tecken: bokstäver, siffror, punkt eller bindestreck.",
  "Bitte einen Klassennamen angeben.": "Ange ett klassnamn.",
  "Diesen Klassencode gibt es schon, bitte einen anderen wählen.":
    "Den här klasskoden finns redan. Välj en annan.",
  "Diesen Klassennamen haben Sie schon vergeben. Bitte wählen Sie einen anderen Namen.":
    "Du har redan använt det här klassnamnet. Välj ett annat namn.",
  "Diesen Klassencode gibt es schon - bitte wählen Sie einen anderen Klassencode (der Klassenname darf gerne bleiben).":
    "Den här klasskoden finns redan - välj en annan klasskod (klassnamnet kan vara kvar).",
  "Die Klasse konnte nicht geändert werden. Es ist nichts geändert.":
    "Klassen kunde inte ändras. Ingenting har ändrats.",
  "Bitte einen Klassencode angeben - mit ihm melden sich die Kinder an.":
    "Ange en klasskod - eleverna loggar in med den.",
  "Ein Klassenmatch kann nur ein Kind einer Klasse ausschreiben.":
    "Bara en elev i en klass kan starta en Klasstävling.",
  "Ein Klassenmatch gibt es nur in einer Klasse.": "En Klasstävling finns bara i en klass.",
  "Eure Lehrkraft hat das Klassenmatch für diese Klasse ausgeschaltet.":
    "Läraren har stängt av Klasstävlingen för den här klassen.",
  "Du hast schon ein Klassenmatch ausgeschrieben, das noch offen ist. Ein zweites geht erst, wenn es vorbei ist.":
    "Du har redan startat en Klasstävling som fortfarande är öppen. Du kan starta en till när den är slut.",
  "Du bist schon in einem anderen Klassenmatch dabei. Ein zweites geht erst, wenn es vorbei ist.":
    "Du deltar redan i en annan Klasstävling. Du kan gå med i en ny när den är slut.",
  "Dieses Klassenmatch ist schon vorbei.": "Den här Klasstävlingen är redan slut.",
  "Dieses Klassenmatch gibt es nicht (mehr).": "Den här Klasstävlingen finns inte längre.",
  "Klasse konnte nicht angelegt werden. Ist der Server erreichbar?":
    "Klassen kunde inte skapas. Kontrollera din internetanslutning.",
  "Die Klasse wurde geändert, konnte aber nicht neu gelesen werden. Bitte die Seite neu laden.":
    "Klassen har ändrats men kunde inte läsas in igen. Läs in sidan på nytt.",
  "Klasse konnte nicht gelöscht werden.": "Klassen kunde inte tas bort.",
  "Diesen Code gibt es schon, bitte einen anderen wählen.": "Den här koden finns redan. Välj en annan.",
  "Bitte zuerst als Lehrkraft anmelden.": "Logga in som lärare först.",
  "Diesen Namen gibt es in der Klasse schon.": "Det finns redan en elev med det här namnet i klassen.",
  "Die Kontakt-E-Mail konnte nicht gespeichert werden.": "Kontakt-e-postadressen kunde inte sparas.",
  "Passwort konnte nicht gesetzt werden (mindestens 4 Zeichen).":
    "Lösenordet kunde inte ställas in (minst 4 tecken).",
  "Passwort konnte nicht zurückgesetzt werden.": "Lösenordet kunde inte återställas.",
  "Die Eigentümer:in lässt sich nicht entfernen.": "Den som äger klassen kan inte tas bort.",
  "Die Meldung ist leer.": "Rapporten är tom.",
  "Es sind schon mehrere Meldungen unterwegs. Bitte versuchen Sie es in einer Stunde noch einmal.":
    "Flera rapporter är redan på väg. Försök igen om en timme.",
  "Aktion fehlgeschlagen. Ist der Server erreichbar?": "Det gick inte. Kontrollera din internetanslutning.",
};

const MUSTER_SV: readonly [RegExp, (m: RegExpMatchArray) => string][] = [
  [/^Das Passwort braucht mindestens (\d+) Zeichen\.$/, (m) => `Lösenordet måste ha minst ${m[1]} tecken.`],
  [/^Das neue Passwort braucht mindestens (\d+) Zeichen\.$/, (m) => `Det nya lösenordet måste ha minst ${m[1]} tecken.`],
  [/^Das Passwort muss mindestens (\d+) Zeichen lang sein\.$/, (m) => `Lösenordet måste vara minst ${m[1]} tecken långt.`],
  [/^Aktion fehlgeschlagen \((\d+)\)\. Bitte erneut versuchen\.$/, (m) => `Det gick inte (${m[1]}). Försök igen.`],
  // Code und Klassenname mit Kopfwort davor, nie gebeugt (Glossar Regel 13).
  [
    /^Eine Klasse mit dem Klassencode „(.+)“ gibt es nicht\. Bitte den Code prüfen\.$/,
    (m) => `Det finns ingen klass med klasskoden ${m[1]}. Kontrollera koden.`,
  ],
  [
    /^In der Klasse „(.+)“ sind bereits (\d+) Kinder\. Mehr als (\d+) sind je Klasse nicht vorgesehen\.$/,
    (m) => `Klassen ${m[1]} har redan ${eleverSv(m[2])}. En klass får ha högst ${eleverSv(m[3])}.`,
  ],
  // Der Name nach einem Doppelpunkt (Glossar Regel 13).
  [
    /^In der neuen Klasse gibt es schon ein Kind mit dem Namen „(.+)“\. Ändern Sie zuerst den Namen eines der beiden Kinder\.$/,
    (m) => `I den nya klassen finns redan en elev med namnet: ${m[1]}. Ändra först namnet på en av de två eleverna.`,
  ],
  [
    /^Mehr als (\d+) Klassen sind je Konto nicht vorgesehen\. Brauchst du wirklich mehr, melde dich bitte - dann heben wir die Grenze an\.$/,
    (m) => `Mer än ${klasserSv(m[1])} per konto är inte möjligt. Behöver du verkligen fler, hör av dig - då höjs gränsen.`,
  ],
  [
    /^In dieser Klasse sind bereits (\d+) Kinder\. Mehr als (\d+) sind je Klasse nicht vorgesehen - lege bitte eine zweite Klasse an\.$/,
    (m) => `Den här klassen har redan ${eleverSv(m[1])}. En klass får ha högst ${eleverSv(m[2])} - skapa en andra klass.`,
  ],
];

/** ★ O2-LIB (30.10.2026): die ukrainische Fassung eines Server-Satzes - oder `null` (dann bleibt er deutsch mit `lang="de"`). */
export function serverMeldungUkrainisch(text: string): string | null {
  const sauber = text.trim();
  const fest = SERVER_MELDUNGEN_UK[sauber];
  if (fest) return fest;
  for (const [muster, bau] of MUSTER_UK) {
    const m = sauber.match(muster);
    if (m) return bau(m);
  }
  return null;
}

/**
 * ★★ O2-LIB (30.10.2026): DIESELBEN SERVER-SÄTZE AUF UKRAINISCH - aus der Funktion geschrieben (Glossar
 * `recherche-ukrainisch-2026-10-25/GLOSSAR-uk.md`): wo der deutsche Satz „du" sagt (Kind, Selbstlernende), steht ти
 * („Напиши своє ім'я."); wo er „Sie" sagt oder die Klassenverwaltung spricht (Lehrkraft), ви („Введіть код класу.");
 * sonst ein Satz ohne Person („Обліковий запис не вдалося створити."). KEINE Vergangenheit in der 2. Person (Regel 2),
 * das Kind in der Lehrkraft-Sicht ist „дитина", die Lehrkraft „педагог" nur im Nominativ. Code und Name nie gebeugt:
 * mit Kopfwort („код класу 4B", „у класі 4B") oder nach einem Doppelpunkt (Regel 12). Keine Anführungszeichen - die
 * Sätze stehen oft in einem Live-Bereich (Regel 7). Kein Satz endet mit Zahl und Punkt. „Перегони класу" (Klassenmatch),
 * „Повідомити" (Melden). Der Wächter verlangt für JEDEN englischen Schlüssel einen ukrainischen.
 */
export const SERVER_MELDUNGEN_UK: Readonly<Record<string, string>> = {
  "Bitte einen Namen angeben.": "Потрібно вказати ім'я.",
  "Bitte eine gültige E-Mail angeben.": "Потрібна дійсна адреса електронної пошти.",
  "Für diese E-Mail gibt es schon ein Konto.": "Для цієї адреси електронної пошти вже є обліковий запис.",
  "Konto konnte nicht erstellt werden. Ist der Server erreichbar?":
    "Обліковий запис не вдалося створити. Чи працює з'єднання з інтернетом?",
  "E-Mail oder Passwort stimmt nicht.": "Адреса електронної пошти або пароль неправильні.",
  "Klassencode, Name oder Passwort stimmt nicht.": "Код класу, ім'я або пароль неправильні.",
  "Bitte gib deinen Namen an.": "Напиши своє ім'я.",
  "Bitte gib eine gültige E-Mail-Adresse an.": "Напиши дійсну адресу електронної пошти.",
  "Mit dieser E-Mail-Adresse gibt es schon ein Konto. Melde dich an oder nimm eine andere Adresse.":
    "Для цієї адреси вже є обліковий запис. Увійди або вкажи іншу адресу.",
  "Das Konto konnte nicht angelegt werden.": "Обліковий запис не вдалося створити.",
  "E-Mail-Adresse oder Passwort stimmt nicht.": "Адреса електронної пошти або пароль неправильні.",
  "Ein eigenes Konto braucht eine Verbindung zum Server.": "Власному обліковому запису потрібне з'єднання із сервером.",
  "Dafür braucht es eine Verbindung zum Server.": "Для цього потрібне з'єднання із сервером.",
  "Die beiden Passwörter stimmen nicht überein.": "Паролі не збігаються.",
  "Die beiden neuen Passwörter stimmen nicht überein.": "Нові паролі не збігаються.",
  // Nicht „Ти не ввійшов" (Vergangenheit, Regel 2) - ein -но/-то-Satz.
  "Nicht angemeldet.": "Вхід не виконано.",
  "Bitte zuerst anmelden.": "Спочатку потрібно увійти.",
  "Konto nicht gefunden.": "Обліковий запис не знайдено.",
  "Dieses Konto gibt es nicht.": "Такого облікового запису немає.",
  "Der Link ist ungültig oder abgelaufen. Bitte fordere einen neuen an.":
    "Посилання недійсне або втратило чинність. Запроси нове.",
  "Das Passwort konnte nicht gesetzt werden. Ist der Server erreichbar?":
    "Пароль не вдалося встановити. Чи працює з'єднання з інтернетом?",
  "Der Link ist abgelaufen oder wurde schon benutzt.": "Посилання втратило чинність або вже використане.",
  "Das Zurücksetzen funktioniert nur mit einem Server-Konto.":
    "Скинути пароль можна лише для облікового запису на сервері.",
  "Das alte Passwort stimmt nicht.": "Старий пароль неправильний.",
  "Das aktuelle Passwort stimmt nicht.": "Поточний пароль неправильний.",
  "Passwort konnte nicht geändert werden. Ist der Server erreichbar?":
    "Пароль не вдалося змінити. Чи працює з'єднання з інтернетом?",
  "Bitte alle drei Felder ausfüllen.": "Потрібно заповнити всі три поля.",
  "Dieser Link ist abgelaufen oder wurde schon benutzt. Fordere in deinem Konto einen neuen an.":
    "Це посилання втратило чинність або вже використане. Запроси нове у своєму обліковому записі.",
  "Dieser Link ist abgelaufen oder wurde schon benutzt.": "Це посилання втратило чинність або вже використане.",
  "Link abgelaufen oder Passwort falsch.": "Посилання втратило чинність або пароль неправильний.",
  "Der Wechsel konnte nicht angestoßen werden. Ist die Adresse schon vergeben?":
    "Зміну адреси не вдалося розпочати. Чи цю адресу вже використовує інший обліковий запис?",
  "Das Konto konnte nicht gelöscht werden.": "Обліковий запис не вдалося видалити.",
  "Das hat nicht geklappt.": "Не вийшло.",
  "Das hat nicht geklappt. Bitte versuch es noch einmal.": "Не вийшло. Спробуй ще раз.",
  // Einladung als ще один педагог - liest eine Lehrkraft: ви.
  "Kein Einladungscode übermittelt.": "Немає коду запрошення.",
  "Diese Einladung gibt es nicht.": "Такого запрошення немає.",
  "Diese Einladung wurde zurückgezogen.": "Це запрошення скасовано.",
  "Diese Einladung ist abgelaufen. Bitte bei der Lehrkraft eine neue anfordern.":
    "Це запрошення втратило чинність. Нове запрошення може надіслати педагог класу.",
  "Bitte zuerst anmelden oder ein Konto anlegen.": "Спочатку увійдіть або створіть обліковий запис.",
  "Diese Einladung wurde bereits von einem anderen Konto eingelöst.":
    "Це запрошення вже прийнято з іншого облікового запису.",
  "Diese Klasse gibt es nicht mehr.": "Цього класу вже немає.",
  "Das hat gerade nicht geklappt.": "Зараз не вийшло.",
  "Bitte als Lehrkraft anmelden.": "Увійдіть з обліковим записом педагога.",
  "Einladung konnte nicht angelegt werden.": "Запрошення не вдалося створити.",
  "Kein Klassencode übermittelt.": "Немає коду класу.",
  "Diese Klasse gibt es nicht.": "Такого класу немає.",
  // „Eigentümer:in" ⇒ das Konto, dem die Klasse gehört - ohne Personen-Nomen mit Geschlecht (Regel 2).
  "Diese Klasse gehört einer anderen Lehrkraft.": "Цей клас належить іншому обліковому запису.",
  "Diese Lehrkraft ist bereits Eigentümer:in der Klasse.": "Цей клас уже належить цій особі.",
  "Lehrkraft konnte nicht hinzugefügt werden.": "Ще одного педагога не вдалося додати до класу.",
  "Keine Lehrkraft angegeben.": "Не вибрано жодного педагога.",
  // Eine Person aus der Klasse nehmen = „прибрати", die Klasse löschen = „видалити" (Glossar §1 Regel 10).
  "Die Eigentümer:in lässt sich nicht entfernen. Wenn nötig, die Klasse löschen.":
    "Особу, якій належить клас, прибрати не можна. За потреби видаліть клас.",
  "Dieses Kind gehört nicht zu einer Ihrer Klassen.": "Цієї дитини немає в жодному з ваших класів.",
  "Bitte den Klassencode der neuen Klasse eingeben.": "Введіть код нового класу.",
  "Das Kind ist schon in der Klasse mit diesem Klassencode.": "Ця дитина вже в класі з таким кодом.",
  "Das Kind konnte nicht verschoben werden. Es ist nichts geändert.":
    "Дитину не вдалося перемістити. Нічого не змінено.",
  "Bitte einen Klassencode eingeben - mit ihm melden sich die Kinder an.":
    "Введіть код класу - з ним учні входять до застосунку.",
  "Der Klassencode darf 2 bis 12 Zeichen haben: Buchstaben, Ziffern, Punkt oder Bindestrich.":
    "Код класу може мати від 2 до 12 знаків: літери, цифри, крапку або дефіс.",
  "Bitte einen Klassennamen angeben.": "Введіть назву класу.",
  "Diesen Klassencode gibt es schon, bitte einen anderen wählen.": "Такий код класу вже є. Виберіть інший.",
  "Diesen Klassennamen haben Sie schon vergeben. Bitte wählen Sie einen anderen Namen.":
    "Клас із такою назвою у вас уже є. Виберіть іншу назву.",
  "Diesen Klassencode gibt es schon - bitte wählen Sie einen anderen Klassencode (der Klassenname darf gerne bleiben).":
    "Такий код класу вже є - виберіть інший код класу (назва класу може залишитися).",
  "Die Klasse konnte nicht geändert werden. Es ist nichts geändert.":
    "Клас не вдалося змінити. Нічого не змінено.",
  "Bitte einen Klassencode angeben - mit ihm melden sich die Kinder an.":
    "Введіть код класу - з ним учні входять до застосунку.",
  // Перегони класу - liest das KIND: ти, Gegenwart statt Vergangenheit (Regel 2); die Lehrkraft gar nicht genannt.
  "Ein Klassenmatch kann nur ein Kind einer Klasse ausschreiben.":
    "Перегони класу може оголосити лише хтось із класу.",
  "Ein Klassenmatch gibt es nur in einer Klasse.": "Перегони класу бувають лише в класі.",
  "Eure Lehrkraft hat das Klassenmatch für diese Klasse ausgeschaltet.":
    "У цьому класі Перегони класу вимкнено.",
  "Du hast schon ein Klassenmatch ausgeschrieben, das noch offen ist. Ein zweites geht erst, wenn es vorbei ist.":
    "Твої Перегони класу ще тривають. Нові можна оголосити, коли ці закінчаться.",
  "Du bist schon in einem anderen Klassenmatch dabei. Ein zweites geht erst, wenn es vorbei ist.":
    "Ти вже береш участь в інших Перегонах класу. Приєднатися до нових можна, коли ці закінчаться.",
  "Dieses Klassenmatch ist schon vorbei.": "Ці Перегони класу вже закінчилися.",
  "Dieses Klassenmatch gibt es nicht (mehr).": "Цих Перегонів класу немає або вони вже закінчилися.",
  "Klasse konnte nicht angelegt werden. Ist der Server erreichbar?":
    "Клас не вдалося створити. Чи працює з'єднання з інтернетом?",
  "Die Klasse wurde geändert, konnte aber nicht neu gelesen werden. Bitte die Seite neu laden.":
    "Зміни в класі збережено, але клас не вдалося прочитати знову. Оновіть сторінку.",
  "Klasse konnte nicht gelöscht werden.": "Клас не вдалося видалити.",
  "Diesen Code gibt es schon, bitte einen anderen wählen.": "Такий код уже є. Виберіть інший.",
  "Bitte zuerst als Lehrkraft anmelden.": "Спочатку увійдіть з обліковим записом педагога.",
  "Diesen Namen gibt es in der Klasse schon.": "Таке ім'я в класі вже є.",
  "Die Kontakt-E-Mail konnte nicht gespeichert werden.": "Контактну адресу електронної пошти не вдалося зберегти.",
  "Passwort konnte nicht gesetzt werden (mindestens 4 Zeichen).":
    "Пароль не вдалося встановити (потрібно щонайменше 4 знаки).",
  "Passwort konnte nicht zurückgesetzt werden.": "Пароль не вдалося скинути.",
  "Die Eigentümer:in lässt sich nicht entfernen.": "Особу, якій належить клас, прибрати не можна.",
  // „Повідомити про проблему" (Glossar §2.6) - der deutsche Satz sagt „Sie": ви.
  "Die Meldung ist leer.": "Повідомлення про проблему порожнє.",
  "Es sind schon mehrere Meldungen unterwegs. Bitte versuchen Sie es in einer Stunde noch einmal.":
    "Кілька повідомлень уже в дорозі. Спробуйте ще раз за годину.",
  "Aktion fehlgeschlagen. Ist der Server erreichbar?": "Дія не вдалася. Чи працює з'єднання з інтернетом?",
};

const MUSTER_UK: readonly [RegExp, (m: RegExpMatchArray) => string][] = [
  [/^Das Passwort braucht mindestens (\d+) Zeichen\.$/, (m) => `Пароль має містити щонайменше ${znakyUk(m[1])}.`],
  [/^Das neue Passwort braucht mindestens (\d+) Zeichen\.$/, (m) => `Новий пароль має містити щонайменше ${znakyUk(m[1])}.`],
  [/^Das Passwort muss mindestens (\d+) Zeichen lang sein\.$/, (m) => `Пароль має містити щонайменше ${znakyUk(m[1])}.`],
  // hookError - meist in der Klassenverwaltung, darum ви.
  [/^Aktion fehlgeschlagen \((\d+)\)\. Bitte erneut versuchen\.$/, (m) => `Дія не вдалася (${m[1]}). Спробуйте ще раз.`],
  // Code und Klassenname mit Kopfwort davor, nie gebeugt (Glossar Regel 12).
  [
    /^Eine Klasse mit dem Klassencode „(.+)“ gibt es nicht\. Bitte den Code prüfen\.$/,
    (m) => `Код класу ${m[1]} не належить жодному класу. Перевірте код.`,
  ],
  [
    /^In der Klasse „(.+)“ sind bereits (\d+) Kinder\. Mehr als (\d+) sind je Klasse nicht vorgesehen\.$/,
    (m) => `У класі ${m[1]} вже ${dytynyUk(m[2])}. Для одного класу максимум - ${dytynyUk(m[3])}.`,
  ],
  // Der Name nach einem Doppelpunkt (Glossar Regel 12).
  [
    /^In der neuen Klasse gibt es schon ein Kind mit dem Namen „(.+)“\. Ändern Sie zuerst den Namen eines der beiden Kinder\.$/,
    (m) => `У новому класі вже є дитина з таким самим ім'ям: ${m[1]}. Спершу змініть одне з двох імен.`,
  ],
  // Der deutsche Satz duzt hier die Lehrkraft - ukrainisch gilt ви (Glossar Regel 1).
  [
    /^Mehr als (\d+) Klassen sind je Konto nicht vorgesehen\. Brauchst du wirklich mehr, melde dich bitte - dann heben wir die Grenze an\.$/,
    (m) =>
      `Для одного облікового запису максимум - ${klasyUk(m[1])}. Якщо вам справді потрібно більше, напишіть нам - ми збільшимо ліміт.`,
  ],
  [
    /^In dieser Klasse sind bereits (\d+) Kinder\. Mehr als (\d+) sind je Klasse nicht vorgesehen - lege bitte eine zweite Klasse an\.$/,
    (m) => `У цьому класі вже ${dytynyUk(m[1])}. Для одного класу максимум - ${dytynyUk(m[2])}. Створіть другий клас.`,
  ],
];

/** ★ O2-LIB (30.10.2026): die ukrainische Mehrzahl für Zahlen als Zeichenkette - one 1, 21 … · few 2-4, 22-24 … · many 0, 5-20 …. */
function ukMehrzahl(
  zahl: string,
  formen: { one: string; few: string; many: string; other: string },
): string {
  const regel = new Intl.PluralRules("uk-UA").select(Number(zahl));
  const form = regel === "one" || regel === "few" || regel === "many" ? formen[regel] : formen.other;
  return form.replace("#", zahl);
}

/** „щонайменше 1 знак · 2 знаки · 5 знаків". */
const znakyUk = (n: string) => ukMehrzahl(n, { one: "# знак", few: "# знаки", many: "# знаків", other: "# знака" });

/** „вже 1 дитина · 2 дитини · 5 дітей" (auch nach dem Gedankenstrich im Nominativ). */
const dytynyUk = (n: string) =>
  ukMehrzahl(n, { one: "# дитина", few: "# дитини", many: "# дітей", other: "# дитини" });

/** „максимум - 1 клас · 2 класи · 50 класів". */
const klasyUk = (n: string) => ukMehrzahl(n, { one: "# клас", few: "# класи", many: "# класів", other: "# класу" });

/** ★ E11a-5: je Sprache der Übersetzer - Deutsch braucht keinen. */
const UEBERSETZER: Record<Exclude<BedienSprache, "de">, (text: string) => string | null> = {
  en: serverMeldungEnglisch,
  fr: serverMeldungFranzoesisch,
  es: serverMeldungSpanisch,
  it: serverMeldungItalienisch,
  pl: serverMeldungPolnisch,
  tr: serverMeldungTuerkisch,
  // ★ O-CS (03.10.2026): die tschechischen Sätze, nicht mehr die englischen.
  cs: serverMeldungTschechisch,
  // ★ O2-LIB (30.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: serverMeldungBulgarisch,
  el: serverMeldungGriechisch,
  hu: serverMeldungUngarisch,
  nl: serverMeldingNederlands,
  pt: serverMeldungPortugiesisch,
  br: serverMeldungBrasilianisch,
  ro: serverMeldungRumaenisch,
  sv: serverMeldungSchwedisch,
  uk: serverMeldungUkrainisch,
};

/**
 * Ein Server-Satz in der Sprache der Bedienung. `lang: "de"` heisst: nicht
 * übersetzbar, er bleibt deutsch und braucht die deutsche Aussprache.
 * Ohne Angabe (oder auf Deutsch) kommt der Satz unverändert zurück.
 */
export function serverMeldung(
  text: string,
  sprache: BedienSprache = "de",
): { text: string; lang?: "de" } {
  if (sprache === "de" || !text) return { text };
  // ★ E11a-5: der Übersetzer der Bedienungssprache - bis dahin nur Englisch.
  const uebersetzt = UEBERSETZER[sprache](text);
  return uebersetzt ? { text: uebersetzt } : { text, lang: "de" };
}
