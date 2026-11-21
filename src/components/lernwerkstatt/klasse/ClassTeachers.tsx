/**
 * Lehrkräfte einer Klasse (Eigentümer:in + Co-Lehrkräfte mit vollen Rechten).
 *
 * Stand bis 03.08. im TypingTeacherDashboard; mit „Meine Klassen" (MK-E1) ist
 * das programm-neutral geworden — die Klasse gehört allen vier Lernprogrammen
 * gemeinsam, nicht Tastenflow. Verhalten unverändert; nur der Hinweistext
 * spricht jetzt von einem Lernwerkstatt-Lehrkonto statt von Tastenflow.
 *
 * Anrede „Sie" (K21) — reine Lehrkraft-Oberfläche.
 *
 * ── KEIN `disabled` MEHR AN DEN BEIDEN KNÖPFEN (28.08.2026) ────────────────
 * Regel R5 (FOKUSZIELE-TASTENFLOW.md §0.5). „Entfernen" und „Hinzufügen"
 * trugen `disabled={busy …}` und sperrten sich damit im Augenblick der
 * Betätigung selbst: Der Fokus stand auf dem Knopf, fiel auf `body`, und die
 * Braillezeile stand im Nichts, während der Server antwortete. „Hinzufügen"
 * war außerdem bei leerem E-Mail-Feld gar nicht im Tab-Weg - wer den
 * Bildschirm nicht sieht, findet den Knopf dann nicht und erfährt auch nicht,
 * dass zuerst eine Adresse fehlt.
 *
 * Beide tragen jetzt `aria-disabled`, die Sperre steckt in den Handlern, und
 * jede aufgehaltene Betätigung nennt ihren Grund in der Meldezeile.
 *
 * ── ZWEI MELDEZEILEN, UND WARUM DAS KEIN SCHÖNHEITSFEHLER IST ─────────────
 * Bis zum 28.08.2026 stand hier EINE Zeile, die nur dann in den Baum kam,
 * wenn sie etwas zu sagen hatte (`{msg && <p role={msg.ok ? "status" :
 * "alert"} …>}`). Für den Fehlerfall ist das richtig: `role="alert"` ist
 * dringlich und wird auch dann angesagt, wenn das Element erst im selben
 * Augenblick eingehängt wird.
 *
 * Für den höflichen Fall ist es FALSCH, und genau daran wären die beiden
 * neuen Ansagen dieser Charge gescheitert („Bitte geben Sie zuerst die
 * E-Mail-Adresse der Lehrkraft ein.", „Wird gespeichert …"): Eine höfliche
 * Live-Region (`role="status"`, `aria-live="polite"`) meldet ihre Änderungen
 * nur, wenn sie VORHER schon im Baum stand. Wird sie zugleich mit ihrem Text
 * eingehängt, hört in aller Regel niemand etwas - und eine Sperre ohne
 * hörbare Begründung ist wieder eine halbe Sperre.
 *
 * Darum jetzt: die höfliche Zeile ist IMMER eingehängt (leer und `sr-only`,
 * solange nichts zu sagen ist; sichtbar, sobald sie etwas meldet), die
 * dringliche bleibt bedingt. Wer hier aufräumt, macht die beiden bitte nicht
 * wieder zu einer.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { ClassTeacher, typingBackend } from "@/lib/typing";
import { Tipp } from "@/components/Tipp";
import { Aufklappen } from "@/components/Aufklappen";
// ★ EN9: Sätze vom Server (tt_coteacher_lib.pb.js) in der Sprache der Bedienung.
import { FilmKnopf } from "@/components/FilmKnopf";
import { ServerMeldung } from "@/components/typing/ServerMeldung";
import { texte, useBedienSprache } from "@/lib/bedienSprache";

/**
 * ★ EN6b (19.09.2026): die Texte in beiden Bedienungssprachen. GEMEINSAMER
 * TEIL - englisch nur über den Anbieter (aktiv nur auf den Adressen von
 * Tastenflow). Glossar §3.8: Co-Lehrkraft ⇒ *co-teacher*, Lehrkräfte dieser
 * Klasse ⇒ *teachers of this class*; §3.14: Eigentümer:in ⇒ *owner*;
 * Lernprogramm ⇒ *app*.
 * ⚠️ Die Meldezeilen tragen eigene Sätze (schon in der Bedienungssprache) UND
 * Server-Sätze (`ServerMeldung` übersetzt) - `msg.eigen` hält sie auseinander.
 */
const T = texte({
  de: {
    wirdGespeichert: "Wird gespeichert …",
    emailZuerst: "Bitte geben Sie zuerst die E-Mail-Adresse der Lehrkraft ein.",
    eingeladen: (email: string) =>
      `Diese E-Mail hat noch kein Lehrkonto - eine Einladung ist unterwegs an ${email}. Sobald sich die Person anmeldet, hat sie volle Rechte auf diese Klasse.`,
    hinzugefuegt: "Lehrkraft hinzugefügt.",
    entfernenFrage: (name: string) => `„${name}“ aus dieser Klasse entfernen?`,
    entfernt: "Lehrkraft entfernt.",
    listeTipp:
      "Klappt die Liste der Lehrkräfte mit vollen Rechten auf und zu. Dort lassen sich weitere hinzufügen.",
    lehrkraefte: " Lehrkräfte dieser Klasse (",
    eigentuemer: "Eigentümer:in",
    sie: "(Sie)",
    entfernenTipp: (name: string) =>
      `Nimmt ${name} die Rechte auf diese Klasse - nach einer Rückfrage. Das Lehrkonto selbst bleibt bestehen.`,
    entfernen: "Entfernen",
    weitere: "Weitere Lehrkraft (E-Mail)",
    weitereTipp: "E-Mail der Lehrkraft, die diese Klasse mitverwalten soll - in allen Lernprogrammen.",
    emailBeispiel: "kollege@schule.at",
    hinzufuegenTipp:
      "Gibt der Lehrkraft mit dieser E-Mail-Adresse volle Rechte auf diese Klasse (Konten anlegen und verwalten, Fortschritt, Passwörter) - in allen Lernprogrammen. Kennt die Plattform sie noch nicht, bekommt sie eine Einladung per Mail; die Rechte gelten, sobald sie sich anmeldet oder ein Lehrkonto anlegt.",
    hinzufuegen: "Hinzufügen",
  },
  en: {
    wirdGespeichert: "Saving …",
    emailZuerst: "Please enter the teacher's email address first.",
    eingeladen: (email: string) =>
      `This email address doesn't have a teacher account yet - an invitation is on its way to ${email}. As soon as they sign in, they will have full rights to this class.`,
    hinzugefuegt: "Teacher added.",
    entfernenFrage: (name: string) => `Remove “${name}” from this class?`,
    entfernt: "Teacher removed.",
    listeTipp:
      "Opens and closes the list of teachers with full rights. You can add more teachers there.",
    lehrkraefte: " Teachers of this class (",
    eigentuemer: "Owner",
    sie: "(you)",
    entfernenTipp: (name: string) =>
      `Takes away ${name}'s rights to this class - after asking you to confirm. Their teacher account itself stays.`,
    entfernen: "Remove",
    weitere: "Another teacher (email)",
    weitereTipp: "Email address of the teacher who should help manage this class - in all the apps.",
    emailBeispiel: "colleague@school.org",
    hinzufuegenTipp:
      "Gives the teacher with this email address full rights to this class (adding and managing accounts, progress, passwords) - in all the apps. If the platform doesn't know them yet, they get an invitation by email; the rights apply as soon as they sign in or create a teacher account.",
    hinzufuegen: "Add",
  },
  fr: {
    wirdGespeichert: "Enregistrement en cours …",
    emailZuerst: "Veuillez d'abord saisir l'adresse e-mail de l'enseignant ou de l'enseignante.",
    eingeladen: (email: string) =>
      `Cette adresse e-mail n'a pas encore de compte enseignant - une invitation est en route vers ${email}. Dès que la personne se connecte, elle a tous les droits sur cette classe.`,
    hinzugefuegt: "Ajout effectué : cette personne a maintenant tous les droits sur la classe.",
    entfernenFrage: (name: string) => `Retirer "${name}" de cette classe ?`,
    entfernt: "Retrait effectué.",
    listeTipp:
      "Déplie et replie la liste du personnel enseignant qui a tous les droits sur cette classe. Vous pouvez y ajouter d'autres personnes.",
    lehrkraefte: " Personnel enseignant de cette classe (",
    eigentuemer: "Propriétaire",
    sie: "(vous)",
    entfernenTipp: (name: string) =>
      `Retire à ${name} les droits sur cette classe - après une confirmation. Le compte enseignant lui-même reste.`,
    entfernen: "Retirer",
    weitere: "Autre enseignant ou enseignante (e-mail)",
    weitereTipp: "E-mail de la personne qui doit aider à gérer cette classe - dans tous les programmes.",
    emailBeispiel: "collegue@ecole.fr",
    hinzufuegenTipp:
      "Donne à la personne qui a cette adresse e-mail tous les droits sur cette classe (créer et gérer des comptes, progrès, mots de passe) - dans tous les programmes. Si la plateforme ne la connait pas encore, elle reçoit une invitation par e-mail ; les droits s'appliquent dès qu'elle se connecte ou crée un compte enseignant.",
    hinzufuegen: "Ajouter",
  },
  // ★ ES-O (27.09.2026): liest nur die Lehrkraft - usted.
  es: {
    wirdGespeichert: "Guardando …",
    emailZuerst: "Escriba primero el correo electrónico de la otra persona docente, por favor.",
    eingeladen: (email: string) =>
      `Este correo todavía no tiene cuenta de docente - hay una invitación en camino a ${email}. En cuanto la persona inicie sesión, tendrá todos los derechos sobre esta clase.`,
    hinzugefuegt: "Hecho: esta persona tiene ahora todos los derechos sobre la clase.",
    entfernenFrage: (name: string) => `¿Quitar a "${name}" de esta clase?`,
    entfernt: "Quitado.",
    listeTipp:
      "Despliega y pliega la lista del profesorado que tiene todos los derechos sobre esta clase. Puede añadir a más personas.",
    lehrkraefte: " Profesorado de esta clase (",
    eigentuemer: "Titular de la clase",
    sie: "(usted)",
    entfernenTipp: (name: string) =>
      `Quita a ${name} los derechos sobre esta clase - tras una confirmación. La cuenta de docente se mantiene.`,
    entfernen: "Quitar",
    weitere: "Otra persona docente (correo electrónico)",
    weitereTipp: "Correo de la persona que debe ayudar a gestionar esta clase - en todos los programas.",
    emailBeispiel: "colega@escuela.es",
    hinzufuegenTipp:
      "Da a la persona con este correo todos los derechos sobre esta clase (crear y gestionar cuentas, progreso, contraseñas) - en todos los programas. Si la plataforma todavía no la conoce, recibe una invitación por correo; los derechos valen en cuanto inicie sesión o cree una cuenta de docente.",
    hinzufuegen: "Añadir",
  },
  // ★ O-IT (02.10.2026): „co-insegnante", „gestire la classe insieme" (Glossar §2.5).
  it: {
    wirdGespeichert: "Salvataggio in corso...",
    emailZuerst: "Prima scrivere l'indirizzo email dell'altra persona che insegna.",
    eingeladen: (email: string) =>
      `Questo indirizzo email non ha ancora un account da insegnante - è in arrivo un invito a ${email}. Appena la persona accede, ha tutti i diritti su questa classe.`,
    hinzugefuegt: "Fatto: questa persona ha ora tutti i diritti sulla classe.",
    entfernenFrage: (name: string) => `Togliere "${name}" da questa classe?`,
    entfernt: "Tolto.",
    listeTipp:
      "Apre e chiude l'elenco degli insegnanti che hanno tutti i diritti su questa classe. Si possono aggiungere altre persone.",
    lehrkraefte: " Insegnanti di questa classe (",
    eigentuemer: "Titolare della classe",
    sie: "(questo account)",
    entfernenTipp: (name: string) =>
      `Toglie a ${name} i diritti su questa classe - dopo una conferma. L'account da insegnante resta.`,
    entfernen: "Togli",
    weitere: "Co-insegnante (indirizzo email)",
    weitereTipp: "Indirizzo email della persona che deve gestire la classe insieme - in tutti i programmi.",
    emailBeispiel: "collega@scuola.it",
    hinzufuegenTipp:
      "Dà alla persona con questo indirizzo email tutti i diritti su questa classe (creare e gestire account, progressi, password) - in tutti i programmi. Se la piattaforma non la conosce ancora, riceve un invito via email; i diritti valgono appena accede o crea un account da insegnante.",
    hinzufuegen: "Aggiungi",
  },
  // ★ O-PL (02.10.2026): Lehrkräfte ohne Geschlecht - „osoba prowadząca",
  // „druga osoba prowadząca" (Glossar §2.5); Namen nach Doppelpunkt.
  pl: {
    wirdGespeichert: "Zapisywanie...",
    emailZuerst: "Najpierw wpisz adres e-mail drugiej osoby prowadzącej.",
    eingeladen: (email: string) =>
      `Ten adres e-mail nie ma jeszcze konta dla nauczycieli - zaproszenie jest w drodze na adres ${email}. Gdy ta osoba się zaloguje, będzie mieć pełne prawa do tej klasy.`,
    hinzugefuegt: "Gotowe: ta osoba ma teraz pełne prawa do klasy.",
    entfernenFrage: (name: string) => `Usunąć z tej klasy: ${name}?`,
    entfernt: "Usunięto.",
    listeTipp:
      "Otwiera i zamyka listę osób prowadzących klasę z pełnymi prawami. Można tam dodać kolejne osoby.",
    lehrkraefte: " Osoby prowadzące tę klasę (",
    eigentuemer: "Główna osoba prowadząca",
    sie: "(to konto)",
    entfernenTipp: (name: string) =>
      `Odbiera prawa do tej klasy (po potwierdzeniu). Osoba: ${name}. Samo konto dla nauczycieli zostaje.`,
    entfernen: "Usuń",
    weitere: "Druga osoba prowadząca (e-mail)",
    weitereTipp: "Adres e-mail osoby, która ma wspólnie prowadzić tę klasę - we wszystkich programach do nauki.",
    emailBeispiel: "imie.nazwisko@szkola.pl",
    hinzufuegenTipp:
      "Daje osobie z tym adresem e-mail pełne prawa do tej klasy (zakładanie kont i zarządzanie nimi, postępy, hasła) - we wszystkich programach do nauki. Jeśli platforma jeszcze jej nie zna, dostanie zaproszenie e-mailem; prawa obowiązują, gdy tylko się zaloguje albo założy konto dla nauczycieli.",
    hinzufuegen: "Dodaj",
  },
  // ★ O-TR (02.10.2026): Lehrkraft "siz" mit -(y)In (Glossar Regel 1);
  // Co-Lehrkraft = "öğretmen" mit tam haklar (§2.5); Entfernen = "Kaldır"
  // (Regel 10); Adresse und Name nach dem Doppelpunkt, ohne Endung (Regel 6).
  tr: {
    wirdGespeichert: "Kaydediliyor...",
    emailZuerst: "Lütfen önce öğretmenin e-posta adresini girin.",
    eingeladen: (email: string) =>
      `Bu e-posta adresinin henüz öğretmen hesabı yok - davet şu adrese gönderildi: ${email}. Bu kişi giriş yapar yapmaz bu sınıf üzerinde tam haklara sahip olur.`,
    hinzugefuegt: "Öğretmen eklendi.",
    entfernenFrage: (name: string) => `Bu sınıftan kaldırılsın mı? Öğretmen: ${name}`,
    entfernt: "Öğretmen kaldırıldı.",
    listeTipp:
      "Tam haklara sahip öğretmenlerin listesini açar ve kapatır. Oradan başka öğretmenler eklenebilir.",
    lehrkraefte: " Bu sınıfın öğretmenleri (",
    eigentuemer: "Sınıfın sahibi",
    sie: "(siz)",
    entfernenTipp: (name: string) =>
      `Bu sınıf üzerindeki hakları kaldırır (onaydan sonra). Öğretmen: ${name}. Öğretmen hesabının kendisi kalır.`,
    entfernen: "Kaldır",
    weitere: "Başka öğretmen (e-posta)",
    weitereTipp: "Bu sınıfı birlikte yönetecek öğretmenin e-posta adresi - tüm öğrenme programlarında.",
    emailBeispiel: "ad.soyad@okul.k12.tr",
    hinzufuegenTipp:
      "Bu e-posta adresine sahip öğretmene bu sınıf üzerinde tam haklar verir (hesap oluşturma ve yönetme, ilerleme, şifreler) - tüm öğrenme programlarında. Platform bu kişiyi henüz tanımıyorsa e-postayla bir davet alır; haklar, kişi giriş yaptığı veya öğretmen hesabı oluşturduğu anda geçerli olur.",
    hinzufuegen: "Ekle",
  },
  // ★ O-CS (03.10.2026): Lehrkraft "vy" in der Mehrzahlform (Glossar Regel 1);
  // Co-Lehrkraft = "další vyučující" (§2.5), nie im Genitiv/Dativ ("vyučujícího"
  // wäre männlich, Regel 2) - darum "osoba"; Entfernen = "Odstranit" (Regel 10);
  // Adresse und Name nach dem Doppelpunkt, ungebeugt (Regel 12). Eigentümer:in
  // ohne Personenwort ("vlastník" ist männlich): "Hlavní účet třídy".
  cs: {
    wirdGespeichert: "Ukládání...",
    emailZuerst: "Nejdřív prosím zadejte e-mailovou adresu.",
    eingeladen: (email: string) =>
      `Tato e-mailová adresa zatím nemá účet pro vyučující - pozvánka je na cestě, adresa: ${email}. Jakmile se tato osoba přihlásí, získá plná práva k této třídě.`,
    hinzugefuegt: "Přidání proběhlo.",
    entfernenFrage: (name: string) => `Odstranit z této třídy? Vyučující: ${name}`,
    entfernt: "Odstranění proběhlo.",
    listeTipp:
      "Otevře a zavře seznam vyučujících s plnými právy. Tam lze přidat další.",
    lehrkraefte: " Vyučující této třídy (",
    eigentuemer: "Hlavní účet třídy",
    sie: "(vy)",
    entfernenTipp: (name: string) =>
      `Odebere práva k této třídě (po potvrzení). Vyučující: ${name}. Samotný účet pro vyučující zůstane.`,
    entfernen: "Odstranit",
    weitere: "Další vyučující (e-mail)",
    weitereTipp: "E-mailová adresa osoby, která bude tuto třídu spravovat společně s vámi - ve všech výukových programech.",
    emailBeispiel: "jmeno.prijmeni@skola.cz",
    hinzufuegenTipp:
      "Dá osobě s touto e-mailovou adresou plná práva k této třídě (vytvářet a spravovat účty, pokrok, hesla) - ve všech výukových programech. Pokud ji platforma ještě nezná, dostane pozvánku e-mailem; práva platí, jakmile se přihlásí nebo si vytvoří účet pro vyučující.",
    hinzufuegen: "Přidat",
  },
  bg: {
    wirdGespeichert: "Записване...",
    emailZuerst: "Първо въведете имейл адреса.",
    eingeladen: (email: string) =>
      `Този имейл адрес все още няма учителски акаунт - изпратена е покана до ${email}. Щом този човек влезе, получава пълни права за този клас.`,
    hinzugefuegt: "Добавено.",
    entfernenFrage: (name: string) => `Да се премахне ли от този клас? Учител: ${name}`,
    entfernt: "Премахнато.",
    listeTipp:
      "Отваря и затваря списъка на учителите с пълни права. Там можете да добавите още.",
    lehrkraefte: " Учители на този клас (",
    eigentuemer: "Основен акаунт на класа",
    sie: "(вие)",
    entfernenTipp: (name: string) =>
      `Отнема правата за този клас (след потвърждение). Учител: ${name}. Самият учителски акаунт остава.`,
    entfernen: "Премахни",
    weitere: "Още един учител (имейл)",
    weitereTipp: "Имейл адрес на човека, който ще управлява този клас заедно с вас - във всички програми.",
    emailBeispiel: "ime.familiya@uchilishte.bg",
    hinzufuegenTipp:
      "Дава на човека с този имейл адрес пълни права за този клас (създаване и управление на акаунти, напредък, пароли) - във всички програми. Ако платформата още не го познава, той получава покана по имейл. Правата важат, щом влезе или създаде учителски акаунт.",
    hinzufuegen: "Добави",
  },
  el: {
    wirdGespeichert: "Αποθήκευση...",
    emailZuerst: "Γράψτε πρώτα μια διεύθυνση e-mail.",
    eingeladen: (email: string) =>
      `Αυτή η διεύθυνση e-mail δεν έχει ακόμα λογαριασμό εκπαιδευτικού - η πρόσκληση στάλθηκε, διεύθυνση: ${email}. Μόλις γίνει η σύνδεση, αυτό το άτομο αποκτά πλήρη δικαιώματα σε αυτό το τμήμα.`,
    hinzugefuegt: "Η προσθήκη ολοκληρώθηκε.",
    entfernenFrage: (name: string) => `Αφαίρεση από αυτό το τμήμα; Εκπαιδευτικός: ${name}`,
    entfernt: "Η αφαίρεση ολοκληρώθηκε.",
    listeTipp:
      "Ανοίγει και κλείνει τη λίστα των εκπαιδευτικών με πλήρη δικαιώματα. Εκεί μπορείτε να προσθέσετε κι άλλους.",
    lehrkraefte: " Εκπαιδευτικοί αυτού του τμήματος (",
    eigentuemer: "Κύριος λογαριασμός του τμήματος",
    sie: "(εσείς)",
    entfernenTipp: (name: string) =>
      `Αφαιρεί τα δικαιώματα σε αυτό το τμήμα (μετά από επιβεβαίωση). Εκπαιδευτικός: ${name}. Ο ίδιος ο λογαριασμός εκπαιδευτικού παραμένει.`,
    entfernen: "Αφαίρεση",
    weitere: "Άλλοι εκπαιδευτικοί (e-mail)",
    weitereTipp: "Η διεύθυνση e-mail του ατόμου που θα διαχειρίζεται αυτό το τμήμα μαζί σας - σε όλα τα προγράμματα μάθησης.",
    emailBeispiel: "onoma.eponymo@sxoleio.gr",
    hinzufuegenTipp:
      "Δίνει στο άτομο με αυτή τη διεύθυνση e-mail πλήρη δικαιώματα σε αυτό το τμήμα (δημιουργία και διαχείριση λογαριασμών, πρόοδος, κωδικοί πρόσβασης) - σε όλα τα προγράμματα μάθησης. Αν η πλατφόρμα δεν γνωρίζει ακόμα τη διεύθυνση, στέλνεται πρόσκληση με e-mail. Τα δικαιώματα ισχύουν μόλις γίνει σύνδεση ή δημιουργία λογαριασμού εκπαιδευτικού.",
    hinzufuegen: "Προσθήκη",
  },
  hu: {
    wirdGespeichert: "Mentés...",
    emailZuerst: "Először adja meg a tanár e-mail-címét.",
    eingeladen: (email: string) =>
      `Ehhez az e-mail-címhez még nem tartozik tanári fiók - a meghívó elment, cím: ${email}. Amint a személy bejelentkezik, teljes jogot kap ehhez az osztályhoz.`,
    hinzugefuegt: "Hozzáadva.",
    entfernenFrage: (name: string) => `Eltávolítás ebből az osztályból? Tanár: ${name}`,
    entfernt: "Eltávolítva.",
    listeTipp:
      "Megnyitja és bezárja a teljes jogú tanárok listáját. Ott további tanárok vehetők fel.",
    lehrkraefte: " Az osztály tanárai (",
    eigentuemer: "Az osztály fő fiókja",
    sie: "(saját fiók)",
    entfernenTipp: (name: string) =>
      `Elveszi a jogokat ehhez az osztályhoz (megerősítés után). Tanár: ${name}. Maga a tanári fiók megmarad.`,
    entfernen: "Eltávolítás",
    weitere: "További tanár (e-mail)",
    weitereTipp: "Annak a tanárnak az e-mail-címe, aki közösen kezeli majd ezt az osztályt - minden tanulóprogramban.",
    emailBeispiel: "nev@iskola.hu",
    hinzufuegenTipp:
      "Teljes jogot ad ehhez az osztályhoz annak a tanárnak, akinek ez az e-mail-címe (fiókok létrehozása és kezelése, haladás, jelszavak) - minden tanulóprogramban. Ha a platform még nem ismeri, e-mailben meghívót kap; a jogok attól kezdve érvényesek, hogy bejelentkezik vagy tanári fiókot hoz létre.",
    hinzufuegen: "Hozzáadás",
  },
  nl: {
    wirdGespeichert: "Wordt opgeslagen...",
    emailZuerst: "Vul eerst het e-mailadres van de leerkracht in.",
    eingeladen: (email: string) =>
      `Dit e-mailadres heeft nog geen account voor leerkrachten - er is een uitnodiging onderweg naar ${email}. Zodra deze persoon inlogt, gelden de volledige rechten op deze klas.`,
    hinzugefuegt: "Leerkracht toegevoegd.",
    entfernenFrage: (name: string) => `"${name}" uit deze klas verwijderen?`,
    entfernt: "Leerkracht verwijderd.",
    listeTipp:
      "Klapt de lijst van leerkrachten met volledige rechten open en dicht. Daar kun je er meer toevoegen.",
    lehrkraefte: " Leerkrachten van deze klas (",
    eigentuemer: "Hoofdaccount van de klas",
    sie: "(jij)",
    entfernenTipp: (name: string) =>
      `Neemt de rechten op deze klas af van ${name} - na een bevestiging. Het account voor leerkrachten zelf blijft bestaan.`,
    entfernen: "Verwijderen",
    weitere: "Andere leerkracht (e-mail)",
    weitereTipp: "E-mailadres van de leerkracht die deze klas samen met jou beheert - in alle leerprogramma's.",
    emailBeispiel: "collega@school.nl",
    hinzufuegenTipp:
      "Geeft de leerkracht met dit e-mailadres volledige rechten op deze klas (accounts aanmaken en beheren, voortgang, wachtwoorden) - in alle leerprogramma's. Kent het platform deze persoon nog niet, dan gaat er een uitnodiging per e-mail uit; de rechten gelden zodra deze persoon inlogt of een account voor leerkrachten aanmaakt.",
    hinzufuegen: "Toevoegen",
  },
  pt: {
    wirdGespeichert: "A guardar...",
    emailZuerst: "Primeiro introduza o endereço de e-mail.",
    eingeladen: (email: string) =>
      `Este endereço de e-mail ainda não tem conta docente - o convite está a caminho de ${email}. Assim que esta pessoa iniciar sessão, terá plenos direitos sobre esta turma.`,
    hinzugefuegt: "Adicionado.",
    entfernenFrage: (name: string) => `Remover ${name} desta turma?`,
    entfernt: "Removido.",
    listeTipp:
      "Abre e fecha a lista de docentes com plenos direitos. Aí é possível adicionar mais.",
    lehrkraefte: " Docentes desta turma (",
    eigentuemer: "Conta principal da turma",
    sie: "(a sua conta)",
    entfernenTipp: (name: string) =>
      `Retira a ${name} os direitos sobre esta turma - depois de pedir confirmação. A conta docente continua a existir.`,
    entfernen: "Remover",
    weitere: "Mais docentes (e-mail)",
    weitereTipp: "Endereço de e-mail da pessoa que vai gerir esta turma em conjunto - em todos os programas de aprendizagem.",
    emailBeispiel: "nome.apelido@escola.pt",
    hinzufuegenTipp:
      "Dá à pessoa com este endereço de e-mail plenos direitos sobre esta turma (criar e gerir contas, progresso, palavras-passe) - em todos os programas de aprendizagem. Se a plataforma ainda não a conhecer, recebe um convite por e-mail; os direitos passam a valer assim que iniciar sessão ou criar uma conta docente.",
    hinzufuegen: "Adicionar",
  },
  br: {
    wirdGespeichert: "Salvando...",
    emailZuerst: "Digite primeiro o endereço de e-mail.",
    eingeladen: (email: string) =>
      `Este endereço de e-mail ainda não tem conta docente - um convite está a caminho de: ${email}. Quando esta pessoa entrar, ela terá todos os direitos sobre esta turma.`,
    hinzugefuegt: "Pessoa adicionada.",
    entfernenFrage: (name: string) => `Remover desta turma? Docente: ${name}`,
    entfernt: "Pessoa removida.",
    listeTipp:
      "Abre e fecha a lista de docentes com todos os direitos. Ali é possível adicionar mais pessoas.",
    lehrkraefte: " Docentes desta turma (",
    eigentuemer: "Conta principal da turma",
    sie: "(você)",
    entfernenTipp: (name: string) =>
      `Retira os direitos sobre esta turma (depois de uma confirmação). Docente: ${name}. A conta docente em si continua existindo.`,
    entfernen: "Remover",
    weitere: "Outra pessoa docente (e-mail)",
    weitereTipp: "Endereço de e-mail da pessoa que vai gerenciar esta turma em conjunto com você - em todos os aplicativos.",
    emailBeispiel: "nome.sobrenome@escola.com.br",
    hinzufuegenTipp:
      "Dá à pessoa com este endereço de e-mail todos os direitos sobre esta turma (criar e gerenciar contas, progresso, senhas) - em todos os aplicativos. Se a plataforma ainda não conhece esta pessoa, ela recebe um convite por e-mail; os direitos valem assim que ela entrar ou criar uma conta docente.",
    hinzufuegen: "Adicionar",
  },
  ro: {
    wirdGespeichert: "Se salvează...",
    emailZuerst: "Mai întâi introduceți adresa de e-mail.",
    eingeladen: (email: string) =>
      `Această adresă de e-mail nu are încă un cont de cadru didactic - o invitație este pe drum, adresa: ${email}. Imediat ce această persoană se conectează, primește drepturi depline asupra acestei clase.`,
    hinzugefuegt: "Adăugare reușită.",
    entfernenFrage: (name: string) => `Eliminați din această clasă? Cadru didactic: ${name}`,
    entfernt: "Eliminare reușită.",
    listeTipp:
      "Deschide și închide lista cadrelor didactice cu drepturi depline. Acolo se pot adăuga și altele.",
    lehrkraefte: " Cadrele didactice ale acestei clase (",
    eigentuemer: "Contul principal al clasei",
    sie: "(dumneavoastră)",
    entfernenTipp: (name: string) =>
      `Retrage drepturile asupra acestei clase (după confirmare). Cadru didactic: ${name}. Contul de cadru didactic rămâne.`,
    entfernen: "Eliminați",
    weitere: "Alt cadru didactic (e-mail)",
    weitereTipp: "Adresa de e-mail a persoanei care va administra această clasă împreună cu dumneavoastră - în toate aplicațiile de învățare.",
    emailBeispiel: "prenume.nume@scoala.ro",
    hinzufuegenTipp:
      "Acordă persoanei cu această adresă de e-mail drepturi depline asupra acestei clase (crearea și administrarea conturilor, progres, parole) - în toate aplicațiile de învățare. Dacă platforma nu o cunoaște încă, primește o invitație prin e-mail; drepturile sunt valabile imediat ce se conectează sau își creează un cont de cadru didactic.",
    hinzufuegen: "Adăugați",
  },
  sv: {
    wirdGespeichert: "Sparar...",
    emailZuerst: "Skriv först lärarens e-postadress.",
    eingeladen: (email: string) =>
      `Den här e-postadressen har inget lärarkonto än - en inbjudan är på väg till ${email}. Så snart läraren loggar in gäller fulla rättigheter till den här klassen.`,
    hinzugefuegt: "Läraren har lagts till.",
    entfernenFrage: (name: string) => `Ta bort ${name} från den här klassen?`,
    entfernt: "Läraren har tagits bort.",
    listeTipp:
      "Öppnar och stänger listan med lärare som har fulla rättigheter. Där kan du lägga till fler.",
    lehrkraefte: " Lärare i den här klassen (",
    eigentuemer: "Ansvarig lärare för klassen",
    sie: "(du)",
    entfernenTipp: (name: string) =>
      `Tar bort rättigheterna till den här klassen från ${name} - efter en kontrollfråga. Själva lärarkontot finns kvar.`,
    entfernen: "Ta bort",
    weitere: "Fler lärare (e-post)",
    weitereTipp: "E-postadress till den lärare som ska dela ansvaret för klassen - i alla lärprogram.",
    emailBeispiel: "fornamn.efternamn@skola.se",
    hinzufuegenTipp:
      "Ger läraren med den här e-postadressen fulla rättigheter till klassen (skapa och hantera konton, framsteg, lösenord) - i alla lärprogram. Om plattformen inte känner till läraren än skickas en inbjudan via e-post; rättigheterna gäller så snart läraren loggar in eller skapar ett lärarkonto.",
    hinzufuegen: "Lägg till",
  },
  uk: {
    wirdGespeichert: "Збереження...",
    emailZuerst: "Спочатку введіть адресу електронної пошти.",
    eingeladen: (email: string) =>
      `Ця адреса електронної пошти ще не має облікового запису педагога - запрошення вже в дорозі, адреса: ${email}. Щойно ця особа ввійде, вона отримає повні права на цей клас.`,
    hinzugefuegt: "Додано.",
    entfernenFrage: (name: string) => `Видалити з цього класу? Педагог: ${name}`,
    entfernt: "Видалено.",
    listeTipp:
      "Відкриває і закриває список педагогів із повними правами. Там можна додати інших.",
    lehrkraefte: " Педагоги цього класу (",
    eigentuemer: "Головний обліковий запис класу",
    sie: "(ви)",
    entfernenTipp: (name: string) =>
      `Забирає права на цей клас (після підтвердження). Педагог: ${name}. Сам обліковий запис педагога залишається.`,
    entfernen: "Видалити",
    weitere: "Ще один педагог (електронна пошта)",
    weitereTipp: "Адреса електронної пошти особи, яка керуватиме цим класом разом із вами - у всіх навчальних програмах.",
    emailBeispiel: "imya.prizvyshche@shkola.ua",
    hinzufuegenTipp:
      "Надає особі з цією адресою електронної пошти повні права на цей клас (створювати облікові записи й керувати ними, поступ, паролі) - у всіх навчальних програмах. Якщо платформа ще не знає цю особу, вона отримає запрошення електронною поштою; права діють, щойно вона ввійде або створить обліковий запис педагога.",
    hinzufuegen: "Додати",
  },
});

export function ClassTeachers({
  classCode,
  meId,
}: {
  classCode: string;
  meId: string;
}) {
  const backend = typingBackend();
  const { sprache } = useBedienSprache();
  // `tx`, nicht `t`: Die Liste unten heisst ihre Lehrkraft schon `t`.
  const tx = T[sprache];
  const [open, setOpen] = useState(false);
  const [teachers, setTeachers] = useState<ClassTeacher[]>([]);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  /** `eigen`: ein Satz dieses Bauteils (schon übersetzt) - sonst einer vom Server. */
  const [msg, setMsg] = useState<{ ok: boolean; text: string; eigen?: boolean } | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const load = useCallback(() => {
    void backend.listClassTeachers(classCode).then(setTeachers);
  }, [backend, classCode]);
  useEffect(() => {
    load();
  }, [load]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) {
      setMsg({ ok: true, text: tx.wirdGespeichert, eigen: true });
      return;
    }
    if (!email.trim()) {
      setMsg({
        ok: true,
        text: tx.emailZuerst,
        eigen: true,
      });
      // Fokus ins Feld, im nächsten Takt (nie `requestAnimationFrame`).
      window.setTimeout(() => emailRef.current?.focus(), 0);
      return;
    }
    setBusy(true);
    setMsg(null);
    const r = await backend.addTeacherToClass(classCode, email.trim());
    setBusy(false);
    if (r.ok) {
      setTeachers(r.value.teachers);
      setEmail("");
      setMsg(
        r.value.invitedEmail
          ? {
              ok: true,
              text: tx.eingeladen(r.value.invitedEmail),
              eigen: true,
            }
          : { ok: true, text: tx.hinzugefuegt, eigen: true },
      );
    } else {
      setMsg({ ok: false, text: r.error });
    }
  };
  const remove = async (id: string, name: string) => {
    if (busy) {
      setMsg({ ok: true, text: tx.wirdGespeichert, eigen: true });
      return;
    }
    if (!window.confirm(tx.entfernenFrage(name))) return;
    setBusy(true);
    setMsg(null);
    const r = await backend.removeTeacherFromClass(classCode, id);
    setBusy(false);
    if (r.ok) {
      setTeachers(r.value);
      setMsg({ ok: true, text: tx.entfernt, eigen: true });
    } else {
      setMsg({ ok: false, text: r.error });
    }
  };

  return (
    <div className="rounded-lg border border-hairline bg-surface-sunken px-3 py-2">
      {/* `unterdruecken={open}`: Aufgeklappt stünde der Hinweis über der
          Liste, die gerade erscheint - sie sagt dann ohnehin mehr. */}
      <div className="flex flex-wrap items-center gap-2">
      <Tipp
        text={tx.listeTipp}
        ausrichtung="links"
        unterdruecken={open}
      >
        {(hinweisId) => (
          <button
            type="button"
            aria-expanded={open}
            aria-describedby={hinweisId}
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-1.5 text-sm font-semibold text-ink"
          >
            <span aria-hidden className="text-ink-muted">
              {open ? "▾" : "▸"}
            </span>
            <span aria-hidden="true">👥</span>
            {tx.lehrkraefte}
            {teachers.length})
          </button>
        )}
      </Tipp>
      <FilmKnopf nr="T-L05" />
      </div>
      {/* ★ 19.09.2026: Die Liste klappt SICHTBAR auf und zu (`Aufklappen`,
          Johannes: „der Rest rutscht nach unten und der andere kommt nach"). */}
      <Aufklappen offen={open}>
        <div className="mt-2 space-y-2">
          <ul className="m-0 list-none space-y-1 p-0">
            {teachers.map((t) => (
              <li
                key={t.id}
                className="flex flex-wrap items-center justify-between gap-2 text-sm text-ink"
              >
                <span>
                  {t.name}
                  {t.email ? (
                    <span className="text-ink-muted"> · {t.email}</span>
                  ) : null}
                  {t.owner && (
                    <span className="ml-1 rounded bg-accent-soft px-1.5 py-0.5 text-sm text-ink">
                      {tx.eigentuemer}
                    </span>
                  )}
                  {t.id === meId && (
                    <span className="ml-1 text-sm text-ink-muted">{tx.sie}</span>
                  )}
                </span>
                {/* ★ R5: `aria-disabled` statt `disabled` - siehe Dateikopf. */}
                {!t.owner && (
                  <Tipp
                    text={tx.entfernenTipp(t.name)}
                  >
                    {(hinweisId) => (
                      <button
                        type="button"
                        className="btn-ghost btn-toggle text-danger aria-disabled:opacity-40"
                        onClick={() => void remove(t.id, t.name)}
                        aria-disabled={busy}
                        aria-describedby={hinweisId}
                      >
                        {tx.entfernen}
                      </button>
                    )}
                  </Tipp>
                )}
              </li>
            ))}
          </ul>
          <form className="flex flex-wrap items-end gap-2" onSubmit={add}>
            <div className="min-w-[12rem] flex-1">
              <label className="field-label" htmlFor={`addteach-${classCode}`}>
                {tx.weitere}
              </label>
              {/* ★ K2 (19.09.2026): war ohne eigenen Hinweis - die volle
                  Erklärung steht am Knopf „Hinzufügen" daneben, hier reicht
                  der kurze Kern, auch wer nur bis zum Feld tabbt hört ihn. */}
              <Tipp text={tx.weitereTipp}>
                {(hinweisId) => (
                  <input
                    id={`addteach-${classCode}`}
                    ref={emailRef}
                    type="email"
                    className="field-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={tx.emailBeispiel}
                    autoComplete="off"
                    aria-describedby={hinweisId}
                  />
                )}
              </Tipp>
            </div>
            {/* ★ R5: `aria-disabled` statt `disabled` - siehe Dateikopf.
                ★ E12 (19.09.2026): der Absatz, was „volle Rechte" GENAU
                heisst, stand bis dahin fest unter dem Formular - jetzt hier,
                am Knopf, der genau das auslöst. */}
            <Tipp text={tx.hinzufuegenTipp}>
              {(hinweisId) => (
                <button
                  type="submit"
                  className="btn-secondary aria-disabled:opacity-40"
                  aria-disabled={busy || !email.trim()}
                  aria-describedby={hinweisId}
                >
                  {tx.hinzufuegen}
                </button>
              )}
            </Tipp>
          </form>
          {/* Die HÖFLICHE Zeile - immer im Baum (siehe Dateikopf). */}
          <p
            role="status"
            aria-live="polite"
            className={
              msg?.ok
                ? "m-0 rounded-lg bg-success-soft p-2 text-sm text-ink"
                : "sr-only"
            }
          >
            {msg?.ok ? msg.text : ""}
          </p>
          {/* Die DRINGLICHE Zeile - darf bedingt bleiben, `role="alert"` wird
              auch beim Einhängen angesagt. */}
          {msg && !msg.ok ? (
            <p
              role="alert"
              className="m-0 rounded-lg bg-danger-soft p-2 text-sm text-ink"
            >
              {msg.eigen ? msg.text : <ServerMeldung text={msg.text} />}
            </p>
          ) : null}
        </div>
      </Aufklappen>
    </div>
  );
}
