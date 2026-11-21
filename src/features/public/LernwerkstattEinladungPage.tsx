/**
 * Der Landeplatz für die Kollegen-Einladung (14.09.2026).
 * ============================================================================
 * Johannes: „wir wollen andere kollegen in die klassen einladen … ich möchte
 * dass du erkennst ob es diese mail schon gibt, wenn nicht versendest du eine
 * freundliche kollegiale einladungsmail".
 *
 * Eine Lehrkraft trägt in „Lehrkräfte dieser Klasse" (ClassTeachers.tsx) eine
 * E-Mail-Adresse ein; kennt `tt_teachers` sie nicht, verschickt der Server
 * (tt_coteacher_lib.pb.js) eine Mail mit einem Link hierher, `?token=…`.
 * Diese Seite:
 *   1. zeigt, für welche Klasse die Einladung gilt (`.../invite-vorschau`,
 *      ohne Anmeldung - der Hook liest mit Admin-Rechten, damit kein erratener
 *      Token eine E-Mail-Adresse preisgibt),
 *   2. lässt die Person sich anmelden ODER ein Lehrkraft-Konto anlegen
 *      (dieselbe `TypingAuth`, die jedes andere Lernprogramm benutzt - kein
 *      eigenes Anmeldeformular),
 *   3. löst die Einladung ein, sobald ein Lehrkraft-Konto angemeldet ist
 *      (`.../invite-annehmen`) - von selbst, ohne einen weiteren Klick, und
 *      gibt volle Co-Lehrkraft-Rechte auf die Klasse.
 *
 * Vorbild: `apps/mathecoach` `MathecoachBeobachtungPage.tsx` (dort nur
 * Lesezugriff für Beobachter:innen, dieselbe Token-Bauart). Anders als dort
 * genügt hier EIN Client: Co-Lehrkräfte sind ein `tt_teachers`-Bordmittel im
 * selben Konto-System wie jedes andere Lernprogramm, kein zweites.
 */
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PublicHeader } from "@/components/PublicHeader";
import { RechtlichesFusszeile } from "@/components/RechtlichesFusszeile";
import { TypingAuth } from "@/components/typing/TypingAuth";
import { useTypingAuth } from "@/components/typing/useTypingAuth";
import { typingBackend } from "@/lib/typing/backend";
import { ServerMeldung } from "@/components/typing/ServerMeldung";
import { texte, useBedienSprache } from "@/lib/bedienSprache";
import { hausStartHref, mitHausName } from "@/lib/adressen";

type Vorschau = { klasseName: string; email: string; eingeloest: boolean };
type Stand = "laedt" | "bereit" | "loest-ein" | "angenommen" | "fehler";

/**
 * ★★ EN2 (19.09.2026): beide Sprachen nebeneinander. GEMEINSAME Seite (alle
 * Programme) - ohne (aktiven) Provider „de", wortgleich wie vorher. Englisch
 * nur aus Tastenflow in englischer Bedienung. Glossar §3.9 (*invitation to
 * co-teach*), §3.8 (*pupils*, *class teacher*); keine Maus-Wörter, in keiner Sprache
 * (seit 30.10.2026 auch nicht mehr im Deutschen: „wähle ... den Reiter").
 */
const T = texte({
  de: {
    ohneSchluessel: "In diesem Link fehlt der Einladungs-Schlüssel.",
    titel: "Einladung als Lehrkraft",
    moment: "Einen Moment …",
    neuerLink: "Bitte bei der Lehrkraft, die eingeladen hat, um einen neuen Link bitten.",
    schonEingeloest1: "Diese Einladung für ",
    schonEingeloest2: " ist schon eingelöst.",
    mitDemKonto: "Melde dich mit dem Konto an, mit dem du sie eingelöst hast.",
    zurLernwerkstatt: "Zur Lernwerkstatt",
    eingeladen1: "Du bist eingeladen, die Klasse ",
    eingeladen2:
      " auf der Sensorik-Lernplattform mitzuverwalten - mit denselben Rechten wie die Klassenlehrkraft: Lernende anlegen und verwalten, Fortschritt einsehen, Passwörter zurücksetzen.",
    loestEin: "Einen Moment, die Einladung wird eingelöst …",
    falscheRolle1: "Du bist gerade als ",
    unbekannt: "unbekannt",
    falscheRolle2: " angemeldet - das ist kein Lehrkraft-Konto. Für diese Einladung brauchst du eines.",
    anderesKonto: "Mit einem anderen Konto anmelden",
    anmelden1: "Melde dich mit einem Lehrkraft-Konto an, oder leg dir eines an - wähle dazu oben den Reiter ",
    anmeldenReiter: "„Lehrkraft\"",
    anmelden2: ". Danach ist die Einladung sofort eingelöst.",
    spaeter: "Später - zur Lernwerkstatt",
    erledigt: (klasse: string) => ["Erledigt - du verwaltest ", klasse, " jetzt mit."],
  },
  en: {
    ohneSchluessel: "This link is missing its invitation key.",
    titel: "Invitation to co-teach",
    moment: "Just a moment …",
    neuerLink: "Please ask the teacher who invited you for a new link.",
    schonEingeloest1: "This invitation for ",
    schonEingeloest2: " has already been accepted.",
    mitDemKonto: "Sign in with the account you accepted it with.",
    zurLernwerkstatt: "Go to Lernwerkstatt",
    eingeladen1: "You've been invited to co-teach the class ",
    eingeladen2:
      " on the Sensorik learning platform - with the same rights as the class teacher: add and manage pupils, see their progress, reset passwords.",
    loestEin: "Just a moment, accepting the invitation …",
    falscheRolle1: "You're currently signed in as ",
    unbekannt: "unknown",
    falscheRolle2: " - that isn't a teacher account. You need one for this invitation.",
    anderesKonto: "Sign in with a different account",
    anmelden1: "Sign in with a teacher account, or create one - to do so, choose ",
    anmeldenReiter: "“Teacher”",
    anmelden2: " above. The invitation is then accepted straight away.",
    spaeter: "Later - go to Lernwerkstatt",
    erledigt: (klasse: string) => ["Done - you now co-teach ", klasse, "."],
  },
  // ★ E11a: „vous" (F9, Lehrkräfte) - die deutsche Basis duzt hier, aber diese
  // Seite spricht ausdrücklich eine EINGELADENE LEHRKRAFT an (D4: aus der
  // Funktion schreiben, nicht wortgleich übersetzen).
  fr: {
    ohneSchluessel: "Il manque la clé d'invitation dans ce lien.",
    titel: "Invitation à co-enseigner",
    moment: "Un instant …",
    neuerLink: "Merci de demander un nouveau lien à l'enseignant ou l'enseignante qui vous a envoyé l'invitation.",
    schonEingeloest1: "Cette invitation pour ",
    schonEingeloest2: " est déjà acceptée.",
    mitDemKonto: "Connectez-vous avec le compte utilisé pour l'accepter.",
    zurLernwerkstatt: "Vers Lernwerkstatt",
    eingeladen1: "On vous invite à co-enseigner la classe ",
    eingeladen2:
      " sur la plateforme d'apprentissage Sensorik - avec les mêmes droits que l'enseignant ou l'enseignante titulaire : créer et gérer des élèves, consulter les progrès, réinitialiser des mots de passe.",
    loestEin: "Un instant, l'invitation est en cours d'acceptation …",
    falscheRolle1: "Compte actuellement connecté : ",
    unbekannt: "inconnu",
    falscheRolle2: " - ce n'est pas un compte enseignant. Cette invitation en demande un.",
    anderesKonto: "Se connecter avec un autre compte",
    // ★ E11a-5 (Feinschliff: nie „cliquez"): „choisissez", wie im Englischen.
    anmelden1: "Connectez-vous avec un compte enseignant, ou créez-en un - choisissez pour cela en haut ",
    anmeldenReiter: '"Enseignant ou enseignante"',
    anmelden2: ". L'invitation est ensuite acceptée aussitôt.",
    spaeter: "Plus tard - vers Lernwerkstatt",
    erledigt: (klasse: string) => ["C'est fait - vous co-enseignez ", klasse, " désormais."],
  },
  // ★ ES-O (27.09.2026): liest eine Lehrkraft - usted; nie „haga clic".
  es: {
    ohneSchluessel: "A este enlace le falta la clave de invitación.",
    titel: "Invitación para compartir una clase",
    moment: "Un momento …",
    neuerLink: "Pida un enlace nuevo a la persona docente que le envió la invitación, por favor.",
    schonEingeloest1: "Esta invitación para ",
    schonEingeloest2: " ya se ha aceptado.",
    mitDemKonto: "Inicie sesión con la cuenta con la que se aceptó.",
    zurLernwerkstatt: "Ir a Lernwerkstatt",
    eingeladen1: "Le invitan a compartir la clase ",
    eingeladen2:
      " en la plataforma de aprendizaje Sensorik - con los mismos derechos que la persona docente titular: crear y gestionar estudiantes, ver el progreso, restablecer contraseñas.",
    loestEin: "Un momento, se está aceptando la invitación …",
    falscheRolle1: "Cuenta con la sesión iniciada: ",
    unbekannt: "desconocida",
    falscheRolle2: " - no es una cuenta de docente. Esta invitación necesita una.",
    anderesKonto: "Iniciar sesión con otra cuenta",
    anmelden1: "Inicie sesión con una cuenta de docente o cree una - para ello elija arriba ",
    anmeldenReiter: '"Docente"',
    anmelden2: ". Después la invitación se acepta al instante.",
    spaeter: "Más tarde - ir a Lernwerkstatt",
    erledigt: (klasse: string) => ["Hecho - desde ahora comparte la clase ", klasse, "."],
  },
  // ★ O-IT (02.10.2026): Lehrkräfte - Infinitiv und neutrale Formen; der
  // Reiter heisst „Insegno" (Glossar §2.5).
  it: {
    ohneSchluessel: "In questo link manca la chiave dell'invito.",
    titel: "Invito come co-insegnante",
    moment: "Un momento...",
    neuerLink: "Chiedere un nuovo link all'insegnante che ha mandato l'invito.",
    schonEingeloest1: "Questo invito per ",
    schonEingeloest2: " è già stato accettato.",
    mitDemKonto: "Accedere con l'account con cui è stato accettato.",
    zurLernwerkstatt: "Vai alla Lernwerkstatt",
    eingeladen1: "C'è un invito a gestire insieme la classe ",
    eingeladen2:
      " sulla piattaforma di apprendimento Sensorik - con gli stessi diritti dell'insegnante della classe: aggiungere e gestire alunni, vedere i progressi, reimpostare le password.",
    loestEin: "Un momento, l'invito viene accettato...",
    falscheRolle1: "Account con cui è stato effettuato l'accesso: ",
    unbekannt: "sconosciuto",
    falscheRolle2: " - non è un account da insegnante. Per questo invito ne serve uno.",
    anderesKonto: "Accedi con un altro account",
    anmelden1: "Accedere con un account da insegnante oppure crearne uno - per farlo scegliere in alto ",
    anmeldenReiter: `"Insegno"`,
    anmelden2: ". Subito dopo l'invito è accettato.",
    spaeter: "Più tardi - vai alla Lernwerkstatt",
    erledigt: (klasse: string) => ["Fatto - da ora la classe ", klasse, " si gestisce insieme."],
  },
  // ★ O-PL (02.10.2026): Lehrkräfte ty-Form und unpersönlich (Glossar Regel 1),
  // „Zalogowano jako:" statt eines Partizips; der Reiter heisst „Uczę" (§2.5).
  pl: {
    ohneSchluessel: "W tym linku brakuje klucza zaproszenia.",
    titel: "Zaproszenie do wspólnego prowadzenia klasy",
    moment: "Chwileczkę...",
    neuerLink: "Poproś osobę, która wysłała zaproszenie, o nowy link.",
    schonEingeloest1: "To zaproszenie do klasy ",
    schonEingeloest2: " zostało już przyjęte.",
    mitDemKonto: "Zaloguj się kontem, którym przyjęto zaproszenie.",
    zurLernwerkstatt: "Przejdź do Lernwerkstatt",
    eingeladen1: "Masz zaproszenie do wspólnego prowadzenia klasy ",
    eingeladen2:
      " na platformie edukacyjnej Sensorik - z tymi samymi prawami co osoba prowadząca klasę: dodawanie uczniów i zarządzanie nimi, wgląd w postępy, ustawianie nowych haseł.",
    loestEin: "Chwileczkę, zaproszenie jest przyjmowane...",
    falscheRolle1: "Zalogowano jako: ",
    unbekannt: "nieznane konto",
    falscheRolle2: " - to nie jest konto dla nauczycieli. Do tego zaproszenia potrzebne jest takie konto.",
    anderesKonto: "Zaloguj się innym kontem",
    anmelden1: "Zaloguj się kontem dla nauczycieli albo załóż takie konto - wybierz w tym celu u góry ",
    anmeldenReiter: "„Uczę”",
    anmelden2: ". Zaraz potem zaproszenie jest przyjęte.",
    spaeter: "Później - przejdź do Lernwerkstatt",
    erledigt: (klasse: string) => ["Gotowe - od teraz współprowadzisz klasę ", klasse, "."],
  },
  // ★ O-TR (02.10.2026): Lehrkräfte "siz" mit -(y)In (Glossar Regel 1); der
  // Klassenname steht nach "Sınıf:" ohne Endung (Regel 6); Reiter "Öğretmen" (§2.5).
  tr: {
    ohneSchluessel: "Bu bağlantıda davet anahtarı eksik.",
    titel: "Ortak öğretmenlik daveti",
    moment: "Bir saniye...",
    neuerLink: "Davet eden öğretmenden yeni bir bağlantı isteyin.",
    schonEingeloest1: "Bu davet zaten kabul edildi. Sınıf: ",
    schonEingeloest2: ".",
    mitDemKonto: "Daveti kabul ettiğiniz hesapla giriş yapın.",
    zurLernwerkstatt: "Lernwerkstatt sayfasına git",
    eingeladen1: "Sensorik öğrenme platformunda bir sınıfı birlikte yönetmeye davet edildiniz. Sınıf: ",
    eingeladen2:
      ". Sınıf öğretmeniyle aynı haklara sahip olursunuz: öğrenci ekleme ve yönetme, ilerlemeyi görme, şifreleri sıfırlama.",
    loestEin: "Bir saniye, davet kabul ediliyor...",
    falscheRolle1: "Şu anda giriş yapılan hesap: ",
    unbekannt: "bilinmiyor",
    falscheRolle2: " - bu bir öğretmen hesabı değil. Bu davet için öğretmen hesabı gerekiyor.",
    anderesKonto: "Başka bir hesapla giriş yap",
    anmelden1: "Bir öğretmen hesabıyla giriş yapın veya yeni bir öğretmen hesabı oluşturun - bunun için yukarıda şu sekmeyi seçin: ",
    anmeldenReiter: '"Öğretmen"',
    anmelden2: ". Ardından davet hemen kabul edilir.",
    spaeter: "Daha sonra - Lernwerkstatt sayfasına git",
    erledigt: (klasse: string) => ["Tamamlandı - bu sınıfı artık birlikte yönetiyorsunuz: ", klasse, "."],
  },
  // ★ O-CS (03.10.2026): Lehrkräfte "vy" in der Mehrzahlform (Glossar Regel 1);
  // die Klasse ungebeugt hinter dem Kopfwort "třída" (Regel 12); "Přihlášený
  // účet:" statt eines Partizips über die Person (Regel 2); Reiter "Učím" (§2.5).
  cs: {
    ohneSchluessel: "V tomto odkazu chybí klíč pozvánky.",
    titel: "Pozvánka ke společné správě třídy",
    moment: "Okamžik...",
    neuerLink: "Požádejte o nový odkaz osobu, která pozvánku poslala.",
    schonEingeloest1: "Tato pozvánka do třídy ",
    schonEingeloest2: " už byla přijata.",
    mitDemKonto: "Přihlaste se účtem, kterým byla pozvánka přijata.",
    zurLernwerkstatt: "Přejít na Lernwerkstatt",
    eingeladen1: "Máte pozvánku ke společné správě třídy ",
    eingeladen2:
      " na vzdělávací platformě Sensorik - se stejnými právy jako třídní vyučující: přidávat žáky a spravovat je, sledovat pokrok, obnovovat hesla.",
    loestEin: "Okamžik, pozvánka se přijímá...",
    falscheRolle1: "Přihlášený účet: ",
    unbekannt: "neznámý",
    falscheRolle2: " - to není účet pro vyučující. Pro tuto pozvánku je účet pro vyučující potřeba.",
    anderesKonto: "Přihlásit se jiným účtem",
    anmelden1: "Přihlaste se účtem pro vyučující, nebo si ho vytvořte - nahoře k tomu vyberte kartu ",
    anmeldenReiter: "Učím",
    anmelden2: ". Pozvánka se pak hned přijme.",
    spaeter: "Později - přejít na Lernwerkstatt",
    erledigt: (klasse: string) => ["Hotovo - třídu ", klasse, " teď spravujete společně."],
  },
  bg: {
    ohneSchluessel: "В тази връзка липсва ключът на поканата.",
    titel: "Покана за съвместно управление на клас",
    moment: "Един момент...",
    neuerLink: "Поискайте нова връзка от учителя, който изпрати поканата.",
    schonEingeloest1: "Тази покана за клас ",
    schonEingeloest2: " вече е приета.",
    mitDemKonto: "Влезте с акаунта, с който е приета поканата.",
    zurLernwerkstatt: "Към Lernwerkstatt",
    eingeladen1: "Имате покана за съвместно управление на клас ",
    eingeladen2:
      " в платформата за обучение Sensorik - със същите права като учителя на класа: добавяне и управление на ученици, преглед на напредъка, нулиране на пароли.",
    loestEin: "Един момент, поканата се приема...",
    falscheRolle1: "Текущ акаунт: ",
    unbekannt: "неизвестен",
    falscheRolle2: " - това не е учителски акаунт. За тази покана е нужен учителски акаунт.",
    anderesKonto: "Влез с друг акаунт",
    anmelden1: "Влезте с учителски акаунт или създайте такъв - за това изберете горе раздела ",
    anmeldenReiter: "Преподавам",
    anmelden2: ". След това поканата се приема веднага.",
    spaeter: "По-късно - към Lernwerkstatt",
    erledigt: (klasse: string) => ["Готово - вече управлявате съвместно клас ", klasse, "."],
  },
  el: {
    ohneSchluessel: "Σε αυτόν τον σύνδεσμο λείπει το κλειδί της πρόσκλησης.",
    titel: "Πρόσκληση για κοινή διαχείριση τμήματος",
    moment: "Μια στιγμή...",
    neuerLink: "Ζητήστε νέο σύνδεσμο από το άτομο που έστειλε την πρόσκληση.",
    schonEingeloest1: "Αυτή η πρόσκληση για το τμήμα ",
    schonEingeloest2: " έχει ήδη γίνει αποδεκτή.",
    mitDemKonto: "Συνδεθείτε με τον λογαριασμό με τον οποίο έγινε η αποδοχή.",
    zurLernwerkstatt: "Μετάβαση στο Lernwerkstatt",
    eingeladen1: "Έχετε πρόσκληση για κοινή διαχείριση του τμήματος ",
    eingeladen2:
      " στην πλατφόρμα μάθησης Sensorik - με τα ίδια δικαιώματα όπως ο κύριος λογαριασμός του τμήματος: προσθήκη και διαχείριση μαθητών, προβολή της προόδου, επαναφορά κωδικών πρόσβασης.",
    loestEin: "Μια στιγμή, γίνεται αποδοχή της πρόσκλησης...",
    falscheRolle1: "Σύνδεση ως: ",
    unbekannt: "άγνωστο",
    falscheRolle2:
      " - αυτός δεν είναι λογαριασμός εκπαιδευτικού. Για αυτή την πρόσκληση χρειάζεται λογαριασμός εκπαιδευτικού.",
    anderesKonto: "Σύνδεση με άλλον λογαριασμό",
    anmelden1:
      "Συνδεθείτε με λογαριασμό εκπαιδευτικού ή δημιουργήστε έναν - για αυτό επιλέξτε επάνω την καρτέλα ",
    anmeldenReiter: "Διδάσκω",
    anmelden2: ". Η πρόσκληση γίνεται τότε αμέσως αποδεκτή.",
    spaeter: "Αργότερα - μετάβαση στο Lernwerkstatt",
    erledigt: (klasse: string) => ["Έγινε - τώρα διαχειρίζεστε από κοινού το τμήμα ", klasse, "."],
  },
  hu: {
    ohneSchluessel: "Ebből a hivatkozásból hiányzik a meghívó kulcsa.",
    titel: "Meghívó az osztály közös kezelésére",
    moment: "Egy pillanat...",
    neuerLink: "Új hivatkozást a meghívót küldő tanártól lehet kérni.",
    schonEingeloest1: "A meghívót (osztály: ",
    schonEingeloest2: ") már elfogadták.",
    mitDemKonto: "Jelentkezzen be azzal a fiókkal, amellyel a meghívót elfogadta.",
    zurLernwerkstatt: "Tovább a Lernwerkstatt oldalára",
    eingeladen1: "Meghívást kapott a következő osztály közös kezelésére: ",
    eingeladen2:
      " - a Sensorik tanulási platformon, ugyanazokkal a jogokkal, mint az osztályért felelős tanár: tanulók felvétele és kezelése, a haladás megtekintése, jelszavak visszaállítása.",
    loestEin: "Egy pillanat, a meghívó elfogadása folyamatban...",
    falscheRolle1: "Bejelentkezett fiók: ",
    unbekannt: "ismeretlen",
    falscheRolle2: " - ez nem tanári fiók. Ehhez a meghívóhoz tanári fiók szükséges.",
    anderesKonto: "Bejelentkezés másik fiókkal",
    anmelden1: "Jelentkezzen be tanári fiókkal, vagy hozzon létre egyet - ehhez válassza ki fent ezt a lapot: ",
    anmeldenReiter: "Tanítok",
    anmelden2: ". Ezután a meghívó elfogadása azonnal megtörténik.",
    spaeter: "Később - tovább a Lernwerkstatt oldalára",
    erledigt: (klasse: string) => ["Kész - az osztályt (", klasse, ") mostantól közösen kezeli."],
  },
  nl: {
    ohneSchluessel: "In deze link ontbreekt de uitnodigingscode.",
    titel: "Uitnodiging als co-leerkracht",
    moment: "Een moment...",
    neuerLink: "Vraag de leerkracht die je heeft uitgenodigd om een nieuwe link.",
    schonEingeloest1: "Deze uitnodiging voor ",
    schonEingeloest2: " is al geaccepteerd.",
    mitDemKonto: "Log in met de inloggegevens waarmee je de uitnodiging hebt geaccepteerd.",
    zurLernwerkstatt: "Naar Lernwerkstatt",
    eingeladen1: "Je bent uitgenodigd om de klas ",
    eingeladen2:
      " op het leerplatform Sensorik samen te beheren - met dezelfde rechten als de klasleerkracht: leerlingen toevoegen en beheren, voortgang bekijken, wachtwoorden opnieuw instellen.",
    loestEin: "Een moment, de uitnodiging wordt geaccepteerd...",
    falscheRolle1: "Je bent nu ingelogd als ",
    unbekannt: "onbekend",
    falscheRolle2: " - dat is geen account voor leerkrachten. Voor deze uitnodiging heb je er een nodig.",
    anderesKonto: "Inloggen met andere inloggegevens",
    anmelden1: "Log in met een account voor leerkrachten of maak er een aan - kies daarvoor bovenaan het tabblad ",
    anmeldenReiter: "\"Ik geef les\"",
    anmelden2: ". Daarna wordt de uitnodiging meteen geaccepteerd.",
    spaeter: "Later - naar Lernwerkstatt",
    erledigt: (klasse: string) => ["Klaar - je beheert ", klasse, " nu samen met de klasleerkracht."],
  },
  pt: {
    ohneSchluessel: "Nesta ligação falta a chave do convite.",
    titel: "Convite para gerir a turma em conjunto",
    moment: "Um momento...",
    neuerLink: "Peça uma nova ligação à pessoa que enviou o convite.",
    schonEingeloest1: "Este convite para a turma ",
    schonEingeloest2: " já foi aceite.",
    mitDemKonto: "Inicie sessão com a conta com que o convite foi aceite.",
    zurLernwerkstatt: "Ir para a Lernwerkstatt",
    eingeladen1: "Recebeu um convite para gerir em conjunto a turma ",
    eingeladen2:
      " na plataforma de aprendizagem Sensorik - com os mesmos direitos de quem é docente da turma: adicionar e gerir estudantes, ver os progressos, repor palavras-passe.",
    loestEin: "Um momento, a aceitar o convite...",
    falscheRolle1: "Conta com sessão iniciada: ",
    unbekannt: "desconhecida",
    falscheRolle2: " - não é uma conta de docente. Este convite precisa de uma conta de docente.",
    anderesKonto: "Iniciar sessão com outra conta",
    anmelden1: "Inicie sessão com uma conta de docente ou crie uma - para isso, selecione em cima o separador ",
    anmeldenReiter: "\"Ensino\"",
    anmelden2: ". Depois, o convite fica aceite de imediato.",
    spaeter: "Mais tarde - ir para a Lernwerkstatt",
    erledigt: (klasse: string) => ["Concluído - agora gere a turma ", klasse, " em conjunto."],
  },
  br: {
    ohneSchluessel: "Falta a chave do convite neste link.",
    titel: "Convite para gerenciar uma turma em conjunto",
    moment: "Só um momento...",
    neuerLink: "Peça um novo link à pessoa que enviou o convite.",
    schonEingeloest1: "Este convite para a turma ",
    schonEingeloest2: " já foi aceito.",
    mitDemKonto: "Entre com a conta usada para aceitar o convite.",
    zurLernwerkstatt: "Ir para a Lernwerkstatt",
    eingeladen1: "Você recebeu um convite para gerenciar em conjunto a turma ",
    eingeladen2:
      " na plataforma de aprendizagem Sensorik - com os mesmos direitos de quem dá aula nela: adicionar e gerenciar estudantes, ver o progresso e redefinir senhas.",
    loestEin: "Só um momento, o convite está sendo aceito...",
    falscheRolle1: "Conta conectada: ",
    unbekannt: "desconhecida",
    falscheRolle2: " - esta não é uma conta docente. Para este convite, você precisa de uma.",
    anderesKonto: "Entrar com outra conta",
    anmelden1: "Entre com uma conta docente ou crie uma - para isso, escolha acima a guia ",
    anmeldenReiter: "Ensino",
    anmelden2: ". Depois disso, o convite é aceito na hora.",
    spaeter: "Mais tarde - ir para a Lernwerkstatt",
    erledigt: (klasse: string) => ["Tudo certo - agora você gerencia a turma ", klasse, " em conjunto."],
  },
  ro: {
    ohneSchluessel: "În acest link lipsește cheia invitației.",
    titel: "Invitație la administrarea împreună a clasei",
    moment: "Un moment...",
    neuerLink: "Cereți un link nou persoanei care a trimis invitația.",
    schonEingeloest1: "Această invitație pentru clasa ",
    schonEingeloest2: " a fost deja acceptată.",
    mitDemKonto: "Conectați-vă cu contul cu care a fost acceptată invitația.",
    zurLernwerkstatt: "Mergeți la Lernwerkstatt",
    eingeladen1: "Aveți o invitație pentru a administra împreună clasa ",
    eingeladen2:
      " pe platforma de învățare Sensorik - cu aceleași drepturi ca ale cadrului didactic al clasei: adăugați și administrați elevi, urmăriți progresul, resetați parole.",
    loestEin: "Un moment, se acceptă invitația...",
    falscheRolle1: "Cont conectat: ",
    unbekannt: "necunoscut",
    falscheRolle2: " - acesta nu este un cont pentru cadre didactice. Pentru această invitație este nevoie de unul.",
    anderesKonto: "Conectați-vă cu alt cont",
    anmelden1: "Conectați-vă cu un cont pentru cadre didactice sau creați unul - pentru aceasta alegeți sus fila ",
    anmeldenReiter: "Predau",
    anmelden2: ". Invitația se acceptă apoi imediat.",
    spaeter: "Mai târziu - mergeți la Lernwerkstatt",
    erledigt: (klasse: string) => ["Gata - acum administrați împreună clasa ", klasse, "."],
  },
  sv: {
    ohneSchluessel: "Inbjudningsnyckeln saknas i den här länken.",
    titel: "Inbjudan att dela ansvaret för en klass",
    moment: "Ett ögonblick...",
    neuerLink: "Be den som skickade inbjudan om en ny länk.",
    schonEingeloest1: "Den här inbjudan till klassen ",
    schonEingeloest2: " har redan tagits emot.",
    mitDemKonto: "Logga in med det konto som du tog emot inbjudan med.",
    zurLernwerkstatt: "Gå till Lernwerkstatt",
    eingeladen1: "Du är inbjuden att dela ansvaret för klassen ",
    eingeladen2:
      " på lärplattformen Sensorik - med samma rättigheter som klassens lärare: lägga till och hantera elever, se framsteg, återställa lösenord.",
    loestEin: "Ett ögonblick, inbjudan tas emot...",
    falscheRolle1: "Du är inloggad som ",
    unbekannt: "okänd",
    falscheRolle2: " - det är inte ett lärarkonto. För den här inbjudan behöver du ett lärarkonto.",
    anderesKonto: "Logga in med ett annat konto",
    anmelden1: "Logga in med ett lärarkonto eller skapa ett - välj då fliken ",
    anmeldenReiter: "Jag undervisar",
    anmelden2: " högst upp. Inbjudan tas sedan emot direkt.",
    spaeter: "Senare - gå till Lernwerkstatt",
    erledigt: (klasse: string) => ["Klart - du delar nu ansvaret för klassen ", klasse, "."],
  },
  uk: {
    ohneSchluessel: "У цьому посиланні немає ключа запрошення.",
    titel: "Запрошення до спільного керування класом",
    moment: "Хвилинку...",
    neuerLink: "Попросіть нове посилання в особи, яка надіслала запрошення.",
    schonEingeloest1: "Це запрошення до класу ",
    schonEingeloest2: " уже прийнято.",
    mitDemKonto: "Увійдіть з обліковим записом, яким запрошення було прийнято.",
    zurLernwerkstatt: "Перейти до Lernwerkstatt",
    eingeladen1: "Вас запрошено до спільного керування класом ",
    eingeladen2:
      " на навчальній платформі Sensorik - з тими самими правами, що й у педагога цього класу: додавати учнів і керувати ними, переглядати поступ, скидати паролі.",
    loestEin: "Хвилинку, запрошення приймається...",
    falscheRolle1: "Обліковий запис, з яким виконано вхід: ",
    unbekannt: "невідомо",
    falscheRolle2: " - це не обліковий запис педагога. Для цього запрошення він потрібен.",
    anderesKonto: "Увійти з іншим обліковим записом",
    anmelden1: "Увійдіть з обліковим записом педагога або створіть його - для цього вгорі виберіть вкладку ",
    anmeldenReiter: "Я навчаю",
    anmelden2: ". Після цього запрошення буде прийнято одразу.",
    spaeter: "Пізніше - перейти до Lernwerkstatt",
    erledigt: (klasse: string) => ["Готово - тепер ви спільно керуєте класом ", klasse, "."],
  },
});

/** Meldungszeile: eigener Satz (Schlüssel) oder Satz vom Server (deutsch). */
type Meldung = { von: "hier"; schluessel: "ohneSchluessel" } | { von: "server"; text: string } | null;

export function LernwerkstattEinladungPage() {
  const [sp] = useSearchParams();
  const token = (sp.get("token") ?? "").trim();

  const { sprache } = useBedienSprache();
  const t = T[sprache];
  const [stand, setStand] = useState<Stand>("laedt");
  const [vorschau, setVorschau] = useState<Vorschau | null>(null);
  const [meldung, setMeldung] = useState<Meldung>(null);
  const meldungText =
    meldung === null ? null : meldung.von === "hier" ? (
      t[meldung.schluessel]
    ) : (
      <ServerMeldung text={meldung.text} />
    );
  const [klasseNachAnnahme, setKlasseNachAnnahme] = useState("");

  const account = useTypingAuth((s) => s.account);
  const logout = useTypingAuth((s) => s.logout);
  const versucht = useRef<string>("");

  // --- 1. Die Vorschau: für welche Klasse gilt der Link? --------------------
  useEffect(() => {
    if (!token) {
      setStand("fehler");
      setMeldung({ von: "hier", schluessel: "ohneSchluessel" });
      return;
    }
    let lebt = true;
    (async () => {
      const r = await typingBackend().previewCoteacherInvite(token);
      if (!lebt) return;
      if (r.ok) {
        setVorschau(r.value);
        setStand("bereit");
      } else {
        setStand("fehler");
        setMeldung({ von: "server", text: r.error });
      }
    })();
    return () => {
      lebt = false;
    };
  }, [token]);

  // --- 2./3. Sobald ein Lehrkraft-Konto angemeldet ist, einlösen ------------
  useEffect(() => {
    if (stand !== "bereit" || !vorschau || vorschau.eingeloest) return;
    if (!account || account.role !== "lehrkraft") return;
    // ⚠️ Höchstens EIN Versuch je Konto-Wechsel - sonst löste ein erneutes
    // Rendern nach einem Fehler denselben Aufruf immer wieder aus.
    if (versucht.current === account.id) return;
    versucht.current = account.id;

    setStand("loest-ein");
    (async () => {
      const r = await typingBackend().acceptCoteacherInvite(token);
      if (r.ok) {
        setKlasseNachAnnahme(r.value.klasseName || vorschau.klasseName);
        setStand("angenommen");
      } else {
        setStand("bereit");
        setMeldung({ von: "server", text: r.error });
      }
    })();
  }, [stand, vorschau, token, account]);

  const angemeldetAlsFalscheRolle = !!account && account.role !== "lehrkraft";

  return (
    <div className="min-h-screen">
      <PublicHeader konto={false} />
      <div className="mx-auto w-full max-w-md px-4 pb-12 pt-10 sm:px-6">
        <div className="card space-y-4 p-6">
          <h1 className="m-0 text-xl font-semibold text-ink">{t.titel}</h1>

          {stand === "laedt" && <p className="m-0 text-ink-muted">{t.moment}</p>}

          {stand === "fehler" && (
            <>
              <p role="alert" className="m-0 rounded-xl bg-danger-soft p-3 text-ink">
                {meldungText}
              </p>
              <p className="m-0 text-sm text-ink-muted">{t.neuerLink}</p>
            </>
          )}

          {vorschau && vorschau.eingeloest && stand !== "angenommen" && (
            <>
              <p className="m-0 text-ink">
                {t.schonEingeloest1}
                <strong>{vorschau.klasseName}</strong>
                {t.schonEingeloest2}
              </p>
              <p className="m-0 text-sm text-ink-muted">{t.mitDemKonto}</p>
              <p className="m-0 text-center text-sm">
                <Link to={hausStartHref()} className="text-accent underline underline-offset-2">
                  {mitHausName(t.zurLernwerkstatt)}
                </Link>
              </p>
            </>
          )}

          {vorschau && !vorschau.eingeloest && (stand === "bereit" || stand === "loest-ein") && (
            <>
              <p className="m-0 text-ink">
                {t.eingeladen1}
                <strong>{vorschau.klasseName}</strong>
                {t.eingeladen2}
              </p>

              {meldung && (
                <p role="alert" className="m-0 rounded-xl bg-danger-soft p-3 text-sm text-ink">
                  {meldungText}
                </p>
              )}

              {stand === "loest-ein" ? (
                <p className="m-0 text-ink-muted" role="status">
                  {t.loestEin}
                </p>
              ) : angemeldetAlsFalscheRolle ? (
                <>
                  <p className="m-0 text-ink">
                    {t.falscheRolle1}
                    <strong>{account?.name || t.unbekannt}</strong>
                    {t.falscheRolle2}
                  </p>
                  <button type="button" className="btn-secondary w-full" onClick={() => logout()}>
                    {t.anderesKonto}
                  </button>
                </>
              ) : (
                <>
                  <p className="m-0 text-ink-muted">
                    {t.anmelden1}
                    <strong>{t.anmeldenReiter}</strong>
                    {t.anmelden2}
                  </p>
                  <TypingAuth
                    onCancel={() => {
                      window.location.href = hausStartHref();
                    }}
                    abbruchText={t.spaeter}
                  />
                </>
              )}
            </>
          )}

          {stand === "angenommen" && (
            <>
              <p role="status" className="m-0 rounded-xl bg-success-soft p-3 text-ink">
                {t.erledigt(klasseNachAnnahme || vorschau?.klasseName || "")}
              </p>
              <p className="m-0 text-center text-sm">
                <Link to={hausStartHref()} className="text-accent underline underline-offset-2">
                  {mitHausName(t.zurLernwerkstatt)}
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
      <RechtlichesFusszeile />
    </div>
  );
}
