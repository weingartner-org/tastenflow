/**
 * Ein Handbuch herunterladen - der EINE Knopf für alle Stellen (07.09.2026).
 *
 * ★★★★ Hebt heraus, was seit dem 30.08.2026 in `typing/LehrerHilfe.tsx` stand:
 * kein blanker `<a download>`, sondern erst den Datei-Ausweis holen, dann
 * laden, dann prüfen, ob wirklich ein PDF kam. Ohne das landet die Lehrkraft
 * auf einer nackten 404-Antwort - denn `/handbuecher/…` ist geschützt und
 * liefert ohne Ausweis absichtlich „Nicht gefunden"
 * (`pb_hooks/geschuetzte_inhalte.pb.js`).
 *
 * ⚠️ WARUM DIE PRÜFUNG AUF `content-type` NÖTIG IST: Ein Pfad, den keine Route
 * bedient, fällt in den SPA-Fallback - HTTP 200 und HTML
 * ([[reference_live_serving_spa_fallback]]). Ein `antwort.ok` allein hielte das
 * für einen Erfolg und speicherte der Lehrkraft eine als PDF benannte
 * HTML-Seite. Am 07.09.2026 nachgemessen: `/tastenflow-lehrerhandbuch.pdf`
 * (ohne den Ordner) gibt genau das - 200, `text/html`, 26.572 Byte.
 */
import { useState } from "react";
import { typingBackend } from "@/lib/typing/backend";
import {
  downloadAdresse,
  groesse,
  handbuchInSprache,
  type Handbuch,
} from "@/lib/lernwerkstatt/handbuecher";
import { texte, useBedienSprache } from "@/lib/bedienSprache";

/**
 * ★★ EN7 (19.09.2026): Der Knopf spricht die Bedienungssprache - und LÄDT in
 * ihr: In der englischen Bedienung von Tastenflow holt er die englische
 * Ausgabe (`handbuchInSprache`), wo es eine gibt; ein Heft, das es nur
 * deutsch gibt, sagt das in seinem Titel. Deutsch wortgleich wie vorher.
 * ⚠️ Der Knopf steht auch auf der »Im Griff«-Seite - dort gibt es keinen
 * aktiven Provider, also bleibt dort alles deutsch.
 */
const KNOPF_TEXTE = texte({
  de: {
    laedt: (titel: string) => `${titel} wird geladen …`,
    laden: (titel: string) => `${titel} herunterladen`,
    fehler:
      "Das Handbuch konnte nicht geladen werden. Bitte einmal ab- und wieder anmelden und den Knopf erneut betätigen - der Datei-Ausweis wird bei der Anmeldung ausgestellt.",
    // ★ 19.09.2026: Eine öffentliche Datei braucht keinen Ausweis - Ab- und
    // Anmelden hülfe dort nicht, der Rat wäre falsch.
    fehlerOffen:
      "Die Datei konnte nicht geladen werden. Bitte die Internetverbindung prüfen und den Knopf erneut betätigen.",
  },
  en: {
    laedt: (titel: string) => `Loading ${titel} …`,
    laden: (titel: string) => `Download ${titel}`,
    fehler:
      "The guide could not be loaded. Please sign out and back in, then press the button again - the permission to download it is issued when you sign in.",
    fehlerOffen:
      "The file could not be loaded. Please check the internet connection and press the button again.",
  },
  fr: {
    laedt: (titel: string) => `Chargement de ${titel} …`,
    laden: (titel: string) => `Télécharger ${titel}`,
    fehler:
      "Le guide n'a pas pu être chargé. Déconnectez-vous, reconnectez-vous, puis appuyez à nouveau sur le bouton - l'autorisation de téléchargement est délivrée à la connexion.",
    fehlerOffen:
      "Le fichier n'a pas pu être chargé. Vérifiez la connexion internet, puis appuyez à nouveau sur le bouton.",
  },
  es: {
    laedt: (titel: string) => `Cargando ${titel} …`,
    laden: (titel: string) => `Descargar ${titel}`,
    fehler:
      "No se pudo cargar la guía. Cierre sesión, vuelva a iniciarla y pulse otra vez el botón - el permiso de descarga se concede al iniciar sesión.",
    fehlerOffen:
      "No se pudo cargar el archivo. Compruebe la conexión a internet y pulse otra vez el botón.",
  },
  // ★ O-IT (02.10.2026): Lehrkraft-Text, neutral ohne „Lei" (Glossar Regel 1).
  it: {
    laedt: (titel: string) => `Caricamento di ${titel} in corso...`,
    laden: (titel: string) => `Scarica ${titel}`,
    fehler:
      "Non è stato possibile caricare la guida. Uscire, accedere di nuovo e premere ancora il pulsante - il permesso di scaricare viene dato all'accesso.",
    fehlerOffen:
      "Non è stato possibile caricare il file. Controllare la connessione a internet e premere ancora il pulsante.",
  },
  // ★ O-PL (02.10.2026): Titel nach Doppelpunkt (bleibt im Nominativ, Glossar Regel 11).
  pl: {
    laedt: (titel: string) => `Wczytywanie: ${titel}...`,
    laden: (titel: string) => `Pobierz: ${titel}`,
    fehler:
      "Nie udało się wczytać podręcznika. Wyloguj się, zaloguj ponownie i naciśnij przycisk jeszcze raz - pozwolenie na pobieranie jest wydawane przy logowaniu.",
    fehlerOffen:
      "Nie udało się wczytać pliku. Sprawdź połączenie z internetem i naciśnij przycisk jeszcze raz.",
  },
  // ★ O-TR (02.10.2026): Lehrkraft "siz" mit -(y)In (Glossar Regel 1); der Titel
  // steht nach dem Doppelpunkt, ohne Endung (Regel 6).
  tr: {
    laedt: (titel: string) => `İndiriliyor: ${titel}...`,
    laden: (titel: string) => `İndir: ${titel}`,
    fehler:
      "Kılavuz indirilemedi. Lütfen çıkış yapıp yeniden giriş yapın ve düğmeye tekrar basın - indirme izni giriş sırasında verilir.",
    fehlerOffen:
      "Dosya indirilemedi. Lütfen internet bağlantısını kontrol edin ve düğmeye tekrar basın.",
  },
  // ★ O-CS (03.10.2026): Lehrkraft "vy" in der Mehrzahlform (Glossar Regel 1); der
  // Titel steht nach dem Doppelpunkt, ungebeugt (Regel 12).
  cs: {
    laedt: (titel: string) => `Stahování: ${titel}...`,
    laden: (titel: string) => `Stáhnout: ${titel}`,
    fehler:
      "Příručku se nepodařilo stáhnout. Odhlaste se prosím, znovu se přihlaste a stiskněte tlačítko ještě jednou - oprávnění ke stažení se vydává při přihlášení.",
    fehlerOffen:
      "Soubor se nepodařilo stáhnout. Zkontrolujte prosím připojení k internetu a stiskněte tlačítko ještě jednou.",
  },
  bg: {
    laedt: (titel: string) => `Изтегляне: ${titel}...`,
    laden: (titel: string) => `Изтегли: ${titel}`,
    fehler:
      "Ръководството не можа да се изтегли. Излезте от акаунта, влезте отново и натиснете бутона още веднъж - разрешението за изтегляне се издава при влизане.",
    fehlerOffen:
      "Файлът не можа да се изтегли. Проверете връзката с интернет и натиснете бутона още веднъж.",
  },
  el: {
    laedt: (titel: string) => `Λήψη: ${titel}...`,
    laden: (titel: string) => `Λήψη: ${titel}`,
    fehler:
      "Δεν ήταν δυνατή η λήψη του οδηγού. Αποσυνδεθείτε, συνδεθείτε ξανά και πατήστε ξανά το κουμπί - η άδεια λήψης δίνεται κατά τη σύνδεση.",
    fehlerOffen:
      "Δεν ήταν δυνατή η λήψη του αρχείου. Ελέγξτε τη σύνδεση στο διαδίκτυο και πατήστε ξανά το κουμπί.",
  },
  hu: {
    laedt: (titel: string) => `Betöltés: ${titel}...`,
    laden: (titel: string) => `Letöltés: ${titel}`,
    fehler:
      "A kézikönyvet nem sikerült betölteni. Jelentkezzen ki, majd újra be, és nyomja meg ismét a gombot - a letöltési jogosultság bejelentkezéskor jön létre.",
    fehlerOffen:
      "A fájlt nem sikerült betölteni. Ellenőrizze az internetkapcsolatot, és nyomja meg ismét a gombot.",
  },
  nl: {
    laedt: (titel: string) => `${titel} wordt geladen...`,
    laden: (titel: string) => `${titel} downloaden`,
    fehler:
      "De handleiding kon niet worden geladen. Log uit, log opnieuw in en druk nog eens op de knop - de toestemming om te downloaden krijg je bij het inloggen.",
    fehlerOffen:
      "Het bestand kon niet worden geladen. Controleer de internetverbinding en druk nog eens op de knop.",
  },
  pt: {
    laedt: (titel: string) => `A transferir: ${titel}...`,
    laden: (titel: string) => `Transferir: ${titel}`,
    fehler:
      "Não foi possível transferir o guia. Termine a sessão, inicie sessão de novo e prima o botão outra vez - a autorização de transferência é emitida ao iniciar sessão.",
    fehlerOffen:
      "Não foi possível transferir o ficheiro. Verifique a ligação à internet e prima o botão outra vez.",
  },
  br: {
    laedt: (titel: string) => `Baixando: ${titel}...`,
    laden: (titel: string) => `Baixar: ${titel}`,
    fehler:
      "Não foi possível baixar o manual. Saia da conta, entre de novo e pressione o botão outra vez - a permissão para baixar é emitida quando você entra.",
    fehlerOffen:
      "Não foi possível baixar o arquivo. Verifique a conexão com a internet e pressione o botão outra vez.",
  },
  ro: {
    laedt: (titel: string) => `Se descarcă: ${titel}...`,
    laden: (titel: string) => `Descărcați: ${titel}`,
    fehler:
      "Ghidul nu a putut fi descărcat. Deconectați-vă, conectați-vă din nou și apăsați butonul încă o dată - permisiunea de descărcare se acordă la conectare.",
    fehlerOffen:
      "Fișierul nu a putut fi descărcat. Verificați conexiunea la internet și apăsați butonul încă o dată.",
  },
  sv: {
    laedt: (titel: string) => `Läser in ${titel}...`,
    laden: (titel: string) => `Ladda ned ${titel}`,
    fehler:
      "Det gick inte att läsa in handboken. Logga ut, logga in igen och tryck på knappen en gång till - behörigheten att ladda ned filen ges vid inloggningen.",
    fehlerOffen:
      "Det gick inte att läsa in filen. Kontrollera internetanslutningen och tryck på knappen en gång till.",
  },
  uk: {
    laedt: (titel: string) => `Завантаження: ${titel}...`,
    laden: (titel: string) => `Завантажити: ${titel}`,
    fehler:
      "Не вдалося завантажити посібник. Будь ласка, вийдіть, увійдіть знову й натисніть кнопку ще раз - дозвіл на завантаження видається під час входу.",
    fehlerOffen:
      "Не вдалося завантажити файл. Будь ласка, перевірте з'єднання з інтернетом і натисніть кнопку ще раз.",
  },
});

/**
 * Die Namen der anderen Apps bleiben deutsch (Glossar §2) - »Im Griff« steht
 * darum in `lang="de"`, damit eine Sprachausgabe ihn deutsch spricht. Nur in
 * der englischen und (★ E11a-5) französischen Bedienung; die deutsche Zeile
 * bleibt ein einziger Text.
 */
function mitDeutschemNamen(text: string) {
  return text.split(/(»Im Griff«)/).map((teil, i) =>
    teil === "»Im Griff«" ? (
      <span key={i} lang="de">
        {teil}
      </span>
    ) : (
      teil
    ),
  );
}

export function HandbuchKnopf({
  handbuch: eintrag,
  alsLink = false,
}: {
  handbuch: Handbuch;
  /** true = wie ein Verweis im Fließtext (»Im Griff«-Seite), ohne Hinweiszeile. */
  alsLink?: boolean;
}) {
  const [stand, setStand] = useState<"" | "laedt" | "fehler">("");
  const { sprache } = useBedienSprache();
  const t = KNOPF_TEXTE[sprache];
  // Der Eintrag in der Bedienungssprache - englisch mit eigener Datei, wo es eine gibt.
  const handbuch = handbuchInSprache(eintrag, sprache);

  async function laden() {
    setStand("laedt");
    try {
      // ★ 19.09.2026: Ein öffentlicher Eintrag (das Plakat) liegt offen in
      // pb_public - ohne Ausweis, damit er auch ohne Anmeldung lädt. Alle
      // anderen: erst den Ausweis, dann `/handbuecher/…` (`downloadAdresse`).
      // ★ 23.09.2026: `frisch` - vor einem Download IMMER ein neuer Ausweis.
      //   Ein Klick ist selten, ein abgelaufener Ausweis war es nicht (404 für
      //   eine Lehrerin, auch nach Ab- und Anmelden; siehe `pbBackend.ts`).
      if (!handbuch.oeffentlich) await typingBackend().inhaltsAusweisSichern({ frisch: true });
      const antwort = await fetch(downloadAdresse(handbuch));
      const typ = antwort.headers.get("content-type") ?? "";
      if (!antwort.ok || !typ.includes("pdf")) throw new Error(String(antwort.status));
      const blob = await antwort.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = handbuch.speicherName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setStand("");
    } catch {
      setStand("fehler");
    }
  }

  /*
    Kein `<li>` und kein Rahmen: Der Knopf steht an drei sehr verschiedenen
    Orten (Liste in „Meine Klasse", Fließtext auf der »Im Griff«-Seite,
    Hilfe-Fenster von Tastenflow). Die Hülle setzt der Aufrufer - `alsLink`
    entscheidet nur, ob er wie ein Verweis im Satz aussieht oder wie ein Knopf.

    ⚠️ In BEIDEN Fällen ein `<button>`: Es wird nichts geöffnet, sondern etwas
    getan (Ausweis holen, laden, prüfen). Ein `<a>` verspräche einen Ort und
    würde von Screenreadern als Verweis angesagt.
  */
  return (
    <>
      <button
        type="button"
        className={
          alsLink
            ? "text-accent underline underline-offset-2"
            : "btn-secondary btn-umriss text-left"
        }
        onClick={() => void laden()}
      >
        {sprache !== "de"
          ? mitDeutschemNamen(stand === "laedt" ? t.laedt(handbuch.titel) : t.laden(handbuch.titel))
          : stand === "laedt"
            ? t.laedt(handbuch.titel)
            : t.laden(handbuch.titel)}{" "}
        <span className="text-ink-muted">(PDF, {groesse(handbuch.bytes, sprache)})</span>
      </button>
      {!alsLink && (
        <p className="m-0 mt-1 text-sm text-ink-muted">
          {sprache !== "de" ? mitDeutschemNamen(handbuch.hinweis) : handbuch.hinweis}
        </p>
      )}
      {stand === "fehler" && (
        <p role="alert" className="m-0 mt-1 text-sm text-danger">
          {handbuch.oeffentlich ? t.fehlerOffen : t.fehler}
        </p>
      )}
    </>
  );
}
