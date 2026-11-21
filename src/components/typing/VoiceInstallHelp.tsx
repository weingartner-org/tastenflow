/**
 * Hinweis-Fenster, wenn die Inhaltssprache umgestellt wird (Englisch oder
 * Französisch), aber KEINE passende Vorlese-Stimme auf dem Gerät installiert
 * ist. Zeigt eine kurze Schritt-für-Schritt-Anleitung — erst für Windows,
 * dann für den Mac —, wie eine Stimme hinzugefügt wird. Stimmen sind Teil
 * des Betriebssystems (Web-Speech-API), deshalb kann die App sie nicht
 * selbst installieren.
 * Siehe [[project_zehnfinger_trainer]].
 */
import { htmlLang } from "./htmlLang";
import { useEffect, useRef, type ReactNode } from "react";
import { useFocusTrap } from "./useFocusTrap";
import { useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";

/**
 * ★ DIE ANLEITUNG in allen drei Bedienungssprachen (EN1, 19.09.2026; fr seit
 * E11a-4, 26.09.2026). Deutsch Knoten für Knoten wie vorher. Englisch/
 * Französisch mit den ENGLISCHEN/FRANZÖSISCHEN Namen der Menüs: Wer die App
 * in dieser Sprache bedient, hat sehr wahrscheinlich auch Windows oder macOS
 * in ihr - und sucht genau diese Wörter (Windows 11 FR: „Heure et langue",
 * macOS FR: „Contenu énoncé"). Ohne Maus-Wörter (Glossar §1.3, „appuyer sur"
 * statt „cliquer").
 */
interface AnleitungTexte {
  name: string;
  titel: string;
  schliessenName: string;
  schliessen: string;
  einleitung: string;
  windows: ReactNode[];
  mac: ReactNode[];
  tipp: string;
}

/**
 * ★★★ ES-F8 (27.09.2026, Bauplan spanischer Lehrgang §7, Auftrag Punkt 3):
 * dieselbe Anleitung auf SPANISCH - eigene Konstante wie
 * {@link ANLEITUNG_DE_EN_FR}, weil deren Typ-Alias namentlich nur „de" | „en" |
 * „fr" nennt; {@link ANLEITUNG} unten fügt sie zusammen. Menü-Namen auf
 * Spanisch (Windows 11 ES: „Configuración" → „Hora e idioma" → „Idioma y
 * región"; macOS ES: „Ajustes del Sistema" → „Accesibilidad" → „Contenido
 * hablado"), ohne Maus-Wörter (Bauplan §7 Glossar - „pulsar" statt „hacer
 * clic"). Stimmen-Beispiele aus {@link VORZUGS_STIMMEN} in `voice.ts`:
 * Mónica/Jorge (macOS es-ES), Helena (Windows es-ES).
 */
const ANLEITUNG_ES: AnleitungTexte = {
  name: "Instalar una voz de lectura en español",
  titel: "No hay ninguna voz en español instalada",
  schliessenName: "Cerrar",
  schliessen: "✕ Cerrar",
  einleitung:
    "Los contenidos están ahora en español - pero en este dispositivo no hay ninguna voz en español instalada para leerlos en voz alta. Las voces forman parte del sistema operativo; así se añade una:",
  windows: [
    <>
      Abrir <b>Configuración</b> (tecla <b>Windows</b> + <b>I</b>).
    </>,
    <>
      Ir a <b>Hora e idioma</b> → <b>Idioma y región</b>.
    </>,
    <>
      En "Idiomas preferidos", pulsar <b>Agregar un idioma</b> y elegir{" "}
      <b>Español</b>.
    </>,
    // ★ W2b (28.09.2026, S6): „Texto a voz" ist der Name auf spanischem
    // Windows 11 (Microsoft-Support es-es, „Descargar idiomas y voces para el
    // lector inmersivo …": Establecer como mi idioma para mostrar de Windows ·
    // Texto a voz · Reconocimiento de voz · Escritura a mano). „Síntesis de
    // voz" kommt dort nicht vor - der Zusatz ist gestrichen.
    <>
      En la ventana de instalación, comprobar que la opción <b>Texto a voz</b>{" "}
      esté marcada, luego pulsar <b>Instalar</b>.
    </>,
    <>Después cerrar el navegador una vez y volver a abrirlo.</>,
  ],
  mac: [
    <>
      Abrir <b>Ajustes del Sistema</b>.
    </>,
    <>
      Ir a <b>Accesibilidad</b> → <b>Contenido hablado</b> (o{" "}
      <b>Contenido leído</b>).
    </>,
    <>
      Abrir el menú <b>Voz del sistema</b> y elegir <b>Gestionar voces …</b>
    </>,
    <>
      Buscar una voz en español (por ejemplo <b>Mónica</b> o <b>Jorge</b>),
      seleccionarla y descargarla.
    </>,
    <>Después cerrar el navegador una vez y volver a abrirlo.</>,
  ],
  tipp:
    "Consejo: una vez instalada la voz, se puede elegir arriba, en la barra de lectura, bajo \"Voz\".",
};

/**
 * ★ O-IT (02.10.2026): dieselbe Anleitung auf ITALIENISCH - Menü-Namen wie
 * auf italienischem Windows 11 („Impostazioni" → „Data/ora e lingua" →
 * „Lingua e area geografica", „Sintesi vocale") und macOS („Impostazioni di
 * Sistema" → „Accessibilità" → „Contenuto letto ad alta voce"). ⚠️ Die Namen
 * sind nicht am Gerät gemessen - offene Frage im Befund. Ohne Maus-Wörter
 * („premere"); Infinitiv wie eine Anleitung. Stimmen-Beispiele: Alice/Luca
 * (macOS it-IT).
 */
const ANLEITUNG_IT: AnleitungTexte = {
  name: "Installare una voce di lettura in italiano",
  titel: "Non è installata nessuna voce italiana",
  schliessenName: "Chiudi",
  schliessen: "✕ Chiudi",
  einleitung:
    "I contenuti ora sono in italiano - ma su questo dispositivo non è installata nessuna voce italiana per leggerli ad alta voce. Le voci fanno parte del sistema operativo; ecco come aggiungerne una:",
  windows: [
    <>
      Aprire <b>Impostazioni</b> (tasto <b>Windows</b> + <b>I</b>).
    </>,
    <>
      Andare in <b>Data/ora e lingua</b> → <b>Lingua e area geografica</b>.
    </>,
    <>
      In "Lingue preferite", premere <b>Aggiungi una lingua</b> e scegliere{" "}
      <b>Italiano</b>.
    </>,
    <>
      Nella finestra di installazione, controllare che l'opzione <b>Sintesi vocale</b>{" "}
      sia selezionata, poi premere <b>Installa</b>.
    </>,
    <>Poi chiudere il browser una volta e riaprirlo.</>,
  ],
  mac: [
    <>
      Aprire <b>Impostazioni di Sistema</b>.
    </>,
    <>
      Andare in <b>Accessibilità</b> → <b>Contenuto letto ad alta voce</b>.
    </>,
    <>
      Aprire il menu <b>Voce di sistema</b> e scegliere <b>Gestisci voci...</b>
    </>,
    <>
      Cercare una voce italiana (per esempio <b>Alice</b> o <b>Luca</b>),
      selezionarla e scaricarla.
    </>,
    <>Poi chiudere il browser una volta e riaprirlo.</>,
  ],
  tipp:
    `Consiglio: una volta installata, la voce si può scegliere in alto, nella barra di lettura, sotto "Voce".`,
};

/**
 * ★ O-PL (02.10.2026): dieselbe Anleitung auf POLNISCH - Menü-Namen wie auf
 * polnischem Windows 11 („Ustawienia" → „Czas i język" → „Język i region",
 * „Zamiana tekstu na mowę") und macOS („Ustawienia systemowe" → „Dostępność"
 * → „Treść mówiona", „Głos systemowy", „Zarządzaj głosami…"). ⚠️ Die Namen
 * sind aus eigener Kenntnis, NICHT am Gerät gemessen - offene Frage im
 * Schlussbericht. ty-Befehlsform in Schritten (Glossar Regel 1), ohne
 * Maus-Wörter (Regel 9: „wybierz", „otwórz", „przejdź do"); Tastennamen wie auf
 * der Kappe (§2.9: „klawisz z logo Windows"). Stimmen-Beispiel: Zosia (macOS pl-PL).
 */
const ANLEITUNG_PL: AnleitungTexte = {
  name: "Zainstaluj polski głos do czytania",
  titel: "Brak zainstalowanego polskiego głosu",
  schliessenName: "Zamknij",
  schliessen: "✕ Zamknij",
  einleitung:
    "Treści są teraz po polsku - ale na tym urządzeniu nie ma polskiego głosu, który mógłby czytać je na głos. Głosy są częścią systemu operacyjnego; tak można dodać głos:",
  windows: [
    <>
      Otwórz <b>Ustawienia</b> (klawisz z logo <b>Windows</b> + <b>I</b>).
    </>,
    <>
      Wybierz <b>Czas i język</b> → <b>Język i region</b>.
    </>,
    <>
      Przy „Preferowane języki” wybierz <b>Dodaj język</b>, a potem <b>Polski</b>.
    </>,
    <>
      W oknie instalacji sprawdź, czy opcja <b>Zamiana tekstu na mowę</b> jest
      zaznaczona, i wybierz <b>Zainstaluj</b>.
    </>,
    <>Potem zamknij przeglądarkę i otwórz ją ponownie.</>,
  ],
  mac: [
    <>
      Otwórz <b>Ustawienia systemowe</b>.
    </>,
    <>
      Wybierz <b>Dostępność</b> → <b>Treść mówiona</b>.
    </>,
    <>
      Otwórz menu <b>Głos systemowy</b> i wybierz <b>Zarządzaj głosami…</b>
    </>,
    <>
      Znajdź polski głos (na przykład <b>Zosia</b>), zaznacz go i pobierz.
    </>,
    <>Potem zamknij przeglądarkę i otwórz ją ponownie.</>,
  ],
  tipp:
    "Wskazówka: zainstalowany głos można wybrać u góry, na pasku czytania, w polu „Głos”.",
};

/**
 * ★ O-TR (02.10.2026): dieselbe Anleitung auf TÜRKISCH - Menü-Namen wie auf
 * türkischem Windows 11 ("Ayarlar" → "Saat ve dil" → "Dil ve bölge", "Metin
 * okuma") und macOS ("Sistem Ayarları" → "Erişilebilirlik" → "Seslendirilen
 * İçerik", "Sistem sesi", "Sesleri Yönet..."). ⚠️ Die Namen sind aus eigener
 * Kenntnis, NICHT am Gerät gemessen - offene Frage im Schlussbericht. sen-
 * Befehlsform in Schritten (Glossar Regel 1), ohne Maus-Wörter (Regel 8: "bas",
 * "seç", "aç", "git"); "okuma sesi" für die Stimme (§2.8), "ekle" statt des
 * mehrdeutigen "Yükle" im Titel (Regel 10). Stimmen-Beispiel: Yelda (macOS tr-TR).
 */
const ANLEITUNG_TR: AnleitungTexte = {
  name: "Türkçe okuma sesi ekle",
  titel: "Yüklü Türkçe okuma sesi yok",
  schliessenName: "Kapat",
  schliessen: "✕ Kapat",
  einleitung:
    "İçerikler artık Türkçe - ama bu cihazda onları sesli okuyacak Türkçe bir okuma sesi yok. Okuma sesleri işletim sisteminin parçasıdır; bir ses şöyle eklenir:",
  windows: [
    <>
      <b>Ayarlar</b> uygulamasını aç (<b>Windows</b> tuşu + <b>I</b>).
    </>,
    <>
      <b>Saat ve dil</b> → <b>Dil ve bölge</b> bölümüne git.
    </>,
    <>
      "Tercih edilen diller" altında <b>Dil ekle</b> düğmesine bas ve{" "}
      <b>Türkçe</b> seçeneğini seç.
    </>,
    <>
      Yükleme penceresinde <b>Metin okuma</b> seçeneğinin işaretli olduğunu
      kontrol et ve <b>Yükle</b> düğmesine bas.
    </>,
    <>Sonra tarayıcıyı bir kez kapatıp yeniden aç.</>,
  ],
  mac: [
    <>
      <b>Sistem Ayarları</b> uygulamasını aç.
    </>,
    <>
      <b>Erişilebilirlik</b> → <b>Seslendirilen İçerik</b> bölümüne git.
    </>,
    <>
      <b>Sistem sesi</b> menüsünü aç ve <b>Sesleri Yönet...</b> seçeneğini seç.
    </>,
    <>
      Türkçe bir ses bul (örneğin <b>Yelda</b>), işaretle ve indir.
    </>,
    <>Sonra tarayıcıyı bir kez kapatıp yeniden aç.</>,
  ],
  tipp:
    "İpucu: yüklenen ses, yukarıdaki okuma çubuğunda \"Okuma sesi\" alanından seçilebilir.",
};

/**
 * ★ O-CS (03.10.2026): dieselbe Anleitung auf TSCHECHISCH - Menü-Namen wie auf
 * tschechischem Windows 11 („Nastavení" → „Čas a jazyk" → „Jazyk a oblast",
 * „Převod textu na řeč") und macOS („Nastavení systému" → „Zpřístupnění" →
 * „Mluvený obsah", „Systémový hlas", „Spravovat hlasy..."). ⚠️ Die Namen sind
 * aus eigener Kenntnis, NICHT am Gerät gemessen - offene Frage im
 * Schlussbericht; ob Windows ab Werk eine tschechische Stimme hat, ist
 * ungemessen und steht darum nicht da. ty-Befehlsform in Schritten (Glossar
 * Regel 1), ohne Maus-Wörter (Regel 8: „vyber", „otevři", „přejdi na");
 * Tastennamen wie auf der Kappe (§2.9: „klávesa Windows"). Stimmen-Beispiel:
 * Zuzana (macOS cs-CZ, gemessen nur am Mac).
 */
const ANLEITUNG_CS: AnleitungTexte = {
  name: "Nainstalovat český hlas pro předčítání",
  titel: "Není nainstalovaný žádný český hlas",
  schliessenName: "Zavřít",
  schliessen: "✕ Zavřít",
  einleitung:
    "Obsah je teď v češtině - ale v tomto zařízení není český hlas, který by ho mohl předčítat. Hlasy jsou součástí operačního systému; hlas se přidá takto:",
  windows: [
    <>
      Otevři <b>Nastavení</b> (klávesa <b>Windows</b> + <b>I</b>).
    </>,
    <>
      Přejdi na <b>Čas a jazyk</b> → <b>Jazyk a oblast</b>.
    </>,
    <>
      U položky „Upřednostňované jazyky“ vyber <b>Přidat jazyk</b> a potom <b>Čeština</b>.
    </>,
    <>
      V okně instalace zkontroluj, že je zaškrtnutá možnost <b>Převod textu na řeč</b>,
      a vyber <b>Nainstalovat</b>.
    </>,
    <>Potom prohlížeč jednou zavři a znovu otevři.</>,
  ],
  mac: [
    <>
      Otevři <b>Nastavení systému</b>.
    </>,
    <>
      Přejdi na <b>Zpřístupnění</b> → <b>Mluvený obsah</b>.
    </>,
    <>
      Otevři nabídku <b>Systémový hlas</b> a vyber <b>Spravovat hlasy...</b>
    </>,
    <>
      Najdi český hlas (například <b>Zuzana</b>), zaškrtni ho a stáhni.
    </>,
    <>Potom prohlížeč jednou zavři a znovu otevři.</>,
  ],
  tipp: "Tip: nainstalovaný hlas se dá vybrat nahoře na liště předčítání v poli Hlas.",
};

const ANLEITUNG_DE_EN_FR: Record<"de" | "en" | "fr", AnleitungTexte> = {
  de: {
    name: "Englische Vorlese-Stimme installieren",
    titel: "Keine englische Stimme installiert",
    schliessenName: "Schließen",
    schliessen: "✕ Schließen",
    einleitung:
      "Die Inhalte sind jetzt auf Englisch - aber zum Vorlesen englischer Texte ist auf diesem Gerät keine englische Stimme installiert. Die Stimmen gehören zum Betriebssystem; so wird eine hinzugefügt:",
    windows: [
      <>
        Einstellungen öffnen (<b>Windows-Taste</b> + <b>I</b>).
      </>,
      <>
        Zu <b>Zeit und Sprache</b> → <b>Sprache und Region</b> gehen.
      </>,
      <>
        Bei „Bevorzugte Sprachen" auf <b>Sprache hinzufügen</b>,{" "}
        <b>English</b> auswählen.
      </>,
      <>
        Im Installationsfenster darauf achten, dass{" "}
        <b>Sprachausgabe / Text-to-Speech</b> mit angehakt ist, dann{" "}
        <b>Installieren</b>.
      </>,
      <>Danach den Browser einmal schließen und neu öffnen.</>,
    ],
    mac: [
      <>
        <b>Systemeinstellungen</b> öffnen.
      </>,
      <>
        Zu <b>Bedienungshilfen</b> → <b>Gesprochene Inhalte</b> gehen.
      </>,
      <>
        Beim Punkt <b>Systemstimme</b> das Menü öffnen und{" "}
        <b>Stimmen verwalten …</b> wählen.
      </>,
      <>
        Eine englische Stimme suchen (z. B. <b>Samantha</b> oder{" "}
        <b>Daniel</b>), auswählen und laden.
      </>,
      <>Danach den Browser einmal schließen und neu öffnen.</>,
    ],
    tipp:
      "Tipp: Ist die Stimme installiert, lässt sie sich oben in der Vorlese-Leiste unter „Stimme\" auswählen.",
  },
  en: {
    name: "Install an English reading voice",
    titel: "No English voice installed",
    schliessenName: "Close",
    schliessen: "✕ Close",
    einleitung:
      "The texts are now in English - but there is no English voice on this device to read them aloud. Voices are part of the operating system. This is how to add one:",
    windows: [
      <>
        Open Settings (<b>Windows key</b> + <b>I</b>).
      </>,
      <>
        Go to <b>Time &amp; language</b> → <b>Language &amp; region</b>.
      </>,
      <>
        Next to “Preferred languages”, choose <b>Add a language</b> and select{" "}
        <b>English (United Kingdom)</b>.
      </>,
      <>
        In the installation window, make sure <b>Text-to-speech</b> is ticked, then
        choose <b>Install</b>.
      </>,
      <>Then close the browser once and open it again.</>,
    ],
    mac: [
      <>
        Open <b>System Settings</b>.
      </>,
      <>
        Go to <b>Accessibility</b> → <b>Spoken Content</b>.
      </>,
      <>
        Open the <b>System voice</b> menu and choose <b>Manage Voices …</b>
      </>,
      <>
        Find an English voice (for example <b>Daniel</b> or <b>Serena</b>), select it and
        download it.
      </>,
      <>Then close the browser once and open it again.</>,
    ],
    tipp: "Tip: once the voice is installed, you can choose it in Settings under “Voice”.",
  },
  fr: {
    name: "Installer une voix de lecture française",
    titel: "Aucune voix française installée",
    schliessenName: "Fermer",
    schliessen: "✕ Fermer",
    einleitung:
      "Les contenus sont maintenant en français - mais aucune voix française n'est installée sur cet appareil pour les lire à voix haute. Les voix font partie du système d'exploitation ; voici comment en ajouter une :",
    windows: [
      <>
        Ouvrir les <b>Paramètres</b> (touche <b>Windows</b> + <b>I</b>).
      </>,
      <>
        Aller dans <b>Heure et langue</b> → <b>Langue et région</b>.
      </>,
      <>
        Sous "Langues préférées", choisir <b>Ajouter une langue</b> et
        sélectionner <b>Français</b>.
      </>,
      <>
        Dans la fenêtre d'installation, vérifier que <b>Synthèse vocale</b> est
        coché, puis choisir <b>Installer</b>.
      </>,
      <>Fermer ensuite le navigateur une fois, puis le rouvrir.</>,
    ],
    mac: [
      <>
        Ouvrir les <b>Réglages Système</b>.
      </>,
      <>
        Aller dans <b>Accessibilité</b> → <b>Contenu énoncé</b>.
      </>,
      <>
        Ouvrir le menu <b>Voix du système</b> et choisir{" "}
        <b>Gérer les voix …</b>
      </>,
      <>
        Chercher une voix française (par exemple <b>Aurélie</b> ou{" "}
        <b>Thomas</b>), la sélectionner et la télécharger.
      </>,
      <>Fermer ensuite le navigateur une fois, puis le rouvrir.</>,
    ],
    tipp:
      "Astuce : une fois la voix installée, elle est sélectionnable en haut de la barre de lecture, sous \"Voix\".",
  },
};

// ★ O2-COMP (30.10.2026): bg eigene Fassung.
// ★ O-BG: Glossar bg §2.12 („Stimme fehlt", B20) - keine lateinische Ersatzstimme, KEIN Stimmen-
// Name (voice.ts F58: bg bewusst ohne Namen). Kind = ти. Windows-11-Menünamen [G] ungeprüft;
// macOS hat keine bulgarische Oberfläche - darum dort neutral beschrieben, ohne Menünamen.
const ANLEITUNG_BG: AnleitungTexte = {
  name: "Инсталиране на български глас за четене на глас",
  titel: "Няма инсталиран български глас",
  schliessenName: "Затвори",
  schliessen: "✕ Затвори",
  einleitung:
    "Текстовете сега са на български - но на това устройство няма български глас, който да ги чете на глас. Гласовете са част от операционната система. Ето как се добавя глас:",
  windows: [
    <>
      Отвори <b>Настройки</b> (клавиш <b>Windows</b> + <b>I</b>).
    </>,
    <>
      Отиди на <b>Час и език</b> → <b>Език и регион</b>.
    </>,
    <>
      До „Предпочитани езици“ избери <b>Добавяне на език</b> и после <b>Български</b>.
    </>,
    <>
      В прозореца за инсталиране провери дали е отметнато <b>Текст към говор</b>,
      и избери <b>Инсталиране</b>.
    </>,
    <>После затвори браузъра веднъж и го отвори отново.</>,
  ],
  mac: [
    <>
      Отвори <b>системните настройки</b> на Mac.
    </>,
    <>
      Отиди на настройките за <b>достъпност</b> и там на частта за <b>изговаряне на съдържание</b>.
    </>,
    <>
      Отвори менюто за <b>системния глас</b> и избери управлението на гласовете.
    </>,
    <>
      Намери български глас, отметни го и го изтегли.
    </>,
    <>После затвори браузъра веднъж и го отвори отново.</>,
  ],
  tipp: "Съвет: инсталираният глас може да се избере горе в лентата за четене на глас, в полето Глас.",
};

// ★ O2-COMP (30.10.2026): el eigene Fassung.
// ★ O2-COMP el: εσύ wie cs. Menünamen Windows 11 / macOS griechisch nach bestem Wissen,
// NICHT gegen ein griechisches System gemessen. Kein Stimmen-Name: voice.ts nennt für „el"
// bewusst keinen (F58).
const ANLEITUNG_EL: AnleitungTexte = {
  name: "Εγκατάσταση ελληνικής φωνής για την εκφώνηση",
  titel: "Δεν είναι εγκατεστημένη ελληνική φωνή",
  schliessenName: "Κλείσιμο",
  schliessen: "✕ Κλείσιμο",
  einleitung:
    "Τα κείμενα είναι τώρα στα Ελληνικά - αλλά σε αυτή τη συσκευή δεν υπάρχει ελληνική φωνή για να τα διαβάσει δυνατά. Οι φωνές είναι μέρος του λειτουργικού συστήματος. Έτσι προσθέτεις μία:",
  windows: [
    <>
      Άνοιξε τις <b>Ρυθμίσεις</b> (πλήκτρο <b>Windows</b> + <b>I</b>).
    </>,
    <>
      Πήγαινε στο <b>Ώρα και γλώσσα</b> → <b>Γλώσσα και περιοχή</b>.
    </>,
    <>
      Δίπλα στις «Προτιμώμενες γλώσσες» επίλεξε <b>Προσθήκη γλώσσας</b> και μετά{" "}
      <b>Ελληνικά</b>.
    </>,
    <>
      Στο παράθυρο εγκατάστασης έλεγξε ότι είναι επιλεγμένη η{" "}
      <b>Μετατροπή κειμένου σε ομιλία</b>, και επίλεξε <b>Εγκατάσταση</b>.
    </>,
    <>Μετά κλείσε μία φορά το πρόγραμμα περιήγησης και άνοιξέ το ξανά.</>,
  ],
  mac: [
    <>
      Άνοιξε τις <b>Ρυθμίσεις συστήματος</b>.
    </>,
    <>
      Πήγαινε στο <b>Προσβασιμότητα</b> → <b>Εκφωνούμενο περιεχόμενο</b>.
    </>,
    <>
      Άνοιξε το μενού <b>Φωνή συστήματος</b> και επίλεξε <b>Διαχείριση φωνών...</b>
    </>,
    <>Βρες μια ελληνική φωνή, επίλεξέ την και κατέβασέ την.</>,
    <>Μετά κλείσε μία φορά το πρόγραμμα περιήγησης και άνοιξέ το ξανά.</>,
  ],
  tipp: "Συμβουλή: μια εγκατεστημένη φωνή μπορείς να τη διαλέξεις επάνω, στη γραμμή της Εκφώνησης, στο πεδίο «Φωνή».",
};

// ★ O2-COMP (30.10.2026): hu eigene Fassung.
// ★ O-HU: Menünamen nach der ungarischen Windows-11- und macOS-Oberfläche (Gépház, Idő és nyelv,
// Rendszerbeállítások, Kisegítő lehetőségek) - [G], am Gerät nachprüfen. Keine Stimmen-Namen: F58 in
// voice.ts führt für „hu" bewusst keine VORZUGS_STIMMEN. te-Form wie die Kinder-Hilfe (Glossar hu Regel 1).
const ANLEITUNG_HU: AnleitungTexte = {
  name: "Magyar felolvasó hang telepítése",
  titel: "Nincs telepítve magyar hang",
  schliessenName: "Bezárás",
  schliessen: "✕ Bezárás",
  einleitung:
    "A szövegek most magyarul vannak - de ezen az eszközön nincs magyar hang, amely felolvashatná őket. A hangok az operációs rendszer részei; így adhatsz hozzá egyet:",
  windows: [
    <>
      Nyisd meg a <b>Gépház</b> ablakot (<b>Windows</b> billentyű + <b>I</b>).
    </>,
    <>
      Lépj ide: <b>Idő és nyelv</b> → <b>Nyelv és régió</b>.
    </>,
    <>
      Az „Előnyben részesített nyelvek” résznél válaszd a <b>Nyelv hozzáadása</b> lehetőséget,
      majd a <b>Magyar</b> nyelvet. Ha a Magyar már ott van, nyisd meg a <b>Nyelvi beállítások</b> részt.
    </>,
    <>
      Ellenőrizd, hogy a <b>Szövegfelolvasás</b> be van-e jelölve, majd válaszd a{" "}
      <b>Telepítés</b> lehetőséget.
    </>,
    <>Utána zárd be egyszer a böngészőt, és nyisd meg újra.</>,
  ],
  mac: [
    <>
      Nyisd meg a <b>Rendszerbeállítások</b> ablakot.
    </>,
    <>
      Lépj ide: <b>Kisegítő lehetőségek</b> → <b>Felolvasott tartalom</b>.
    </>,
    <>
      Nyisd meg a <b>Rendszerhang</b> menüt, és válaszd a <b>Hangok kezelése...</b> lehetőséget.
    </>,
    <>Keress egy magyar hangot, jelöld be, és töltsd le.</>,
    <>Utána zárd be egyszer a böngészőt, és nyisd meg újra.</>,
  ],
  tipp: "Tipp: a telepített hangot fent, a felolvasási sávon, a Hang mezőben választhatod ki.",
};

// ★ O2-COMP (30.10.2026): nl eigene Fassung.
// ★ O-NL: keine Stimmennamen (voice.ts F58: für nl nichts gemessen). Menünamen
// Windows 11 / macOS nl aus dem Gedächtnis [G] - am Gerät nachlesen.
const ANLEITUNG_NL: AnleitungTexte = {
  name: "Een Nederlandse voorleesstem installeren",
  titel: "Er is geen Nederlandse stem geïnstalleerd",
  schliessenName: "Sluiten",
  schliessen: "✕ Sluiten",
  einleitung:
    "De teksten zijn nu in het Nederlands - maar op dit apparaat is geen Nederlandse stem die ze kan voorlezen. Stemmen horen bij het besturingssysteem. Zo voeg je er een toe:",
  windows: [
    <>
      Open <b>Instellingen</b> (<b>Windows-toets</b> + <b>I</b>).
    </>,
    <>
      Ga naar <b>Tijd en taal</b> → <b>Taal en regio</b>.
    </>,
    <>
      Kies bij "Voorkeurstalen" <b>Een taal toevoegen</b> en daarna{" "}
      <b>Nederlands (Nederland)</b> of <b>Nederlands (België)</b>.
    </>,
    <>
      Controleer in het installatievenster of <b>Tekst-naar-spraak</b> is
      aangevinkt, en kies <b>Installeren</b>.
    </>,
    <>Sluit daarna de browser één keer en open hem opnieuw.</>,
  ],
  mac: [
    <>
      Open <b>Systeeminstellingen</b>.
    </>,
    <>
      Ga naar <b>Toegankelijkheid</b> → <b>Gesproken materiaal</b>.
    </>,
    <>
      Open het menu <b>Systeemstem</b> en kies <b>Beheer stemmen...</b>
    </>,
    <>
      Zoek een Nederlandse stem, vink die aan en download hem.
    </>,
    <>Sluit daarna de browser één keer en open hem opnieuw.</>,
  ],
  tipp: "Tip: een geïnstalleerde stem kun je bovenaan in de voorleesbalk kiezen bij \"Stem\".",
};

// ★ O2-COMP (30.10.2026): pt eigene Fassung.
// ★ O2-COMP pt (29.10.2026): tu-Form (Glossar pt Regel 1); Menünamen Windows 11 / macOS pt-PT
// nach bestem Wissen [G] - am Gerät nachprüfen. In VORZUGS_STIMMEN steht keine pt-PT-Stimme,
// darum nennt der Mac-Schritt keinen Stimmennamen.
const ANLEITUNG_PT: AnleitungTexte = {
  name: "Instalar uma voz em português europeu para a leitura em voz alta",
  titel: "Não está instalada nenhuma voz em português europeu",
  schliessenName: "Fechar",
  schliessen: "✕ Fechar",
  einleitung:
    "Os textos estão agora em português - mas este dispositivo não tem nenhuma voz em português europeu para os ler em voz alta. As vozes fazem parte do sistema operativo; assim se acrescenta uma:",
  windows: [
    <>
      Abre as <b>Definições</b> (tecla <b>Windows</b> + <b>I</b>).
    </>,
    <>
      Vai a <b>Hora e idioma</b> → <b>Idioma e região</b>.
    </>,
    <>
      Em "Idiomas preferidos", escolhe <b>Adicionar um idioma</b> e depois{" "}
      <b>Português (Portugal)</b>.
    </>,
    <>
      Na janela de instalação, confirma que a opção <b>Conversão de texto em voz</b> está
      assinalada e escolhe <b>Instalar</b>.
    </>,
    <>Depois, fecha o navegador uma vez e volta a abri-lo.</>,
  ],
  mac: [
    <>
      Abre as <b>Definições do Sistema</b>.
    </>,
    <>
      Vai a <b>Acessibilidade</b> → <b>Conteúdo falado</b>.
    </>,
    <>
      Abre o menu <b>Voz do sistema</b> e escolhe <b>Gerir vozes...</b>
    </>,
    <>
      Procura uma voz em português de Portugal, seleciona-a e transfere-a.
    </>,
    <>Depois, fecha o navegador uma vez e volta a abri-lo.</>,
  ],
  tipp: "Dica: depois de instalada, a voz pode ser escolhida em cima, na barra da leitura em voz alta, no campo \"Voz\".",
};

// ★ O2-COMP (30.10.2026): br eigene Fassung.
const ANLEITUNG_BR: AnleitungTexte = {
  name: "Instalar uma voz em português do Brasil para a leitura em voz alta",
  titel: "Nenhuma voz em português do Brasil instalada",
  schliessenName: "Fechar",
  schliessen: "✕ Fechar",
  einleitung:
    "Os textos agora estão em português - mas neste dispositivo não há nenhuma voz em português do Brasil que possa lê-los em voz alta. As vozes fazem parte do sistema operacional. Para adicionar uma:",
  windows: [
    <>
      Abra as <b>Configurações</b> (<b>tecla Windows</b> + <b>I</b>).
    </>,
    <>
      Vá para <b>Hora e idioma</b> → <b>Idioma e região</b>.
    </>,
    <>
      Em Idiomas preferenciais, escolha <b>Adicionar um idioma</b> e selecione{" "}
      <b>Português (Brasil)</b>.
    </>,
    <>
      Na janela de instalação, confira se <b>Conversão de texto em fala</b> está
      marcada e escolha <b>Instalar</b>.
    </>,
    <>Depois, feche o navegador uma vez e abra de novo.</>,
  ],
  mac: [
    <>
      Abra os <b>Ajustes do Sistema</b>.
    </>,
    <>
      Vá para <b>Acessibilidade</b> → <b>Conteúdo Falado</b>.
    </>,
    <>
      Abra o menu <b>Voz do Sistema</b> e escolha <b>Gerenciar Vozes...</b>
    </>,
    <>Procure uma voz em português do Brasil, marque e baixe.</>,
    <>Depois, feche o navegador uma vez e abra de novo.</>,
  ],
  tipp: "Dica: depois de instalada, a voz pode ser escolhida no alto, na barra de leitura em voz alta, no campo Voz.",
};

// ★ O2-COMP (30.10.2026): ro eigene Fassung.
// ★ O-RO (29.10.2026): fără nume de voce - VORZUGS_STIMMEN nu are încă o listă pentru „ro”.
// Numele meniurilor Windows 11 / macOS în română [G, necitite pe dispozitiv - de verificat].
const ANLEITUNG_RO: AnleitungTexte = {
  name: "Instalați o voce românească pentru citire",
  titel: "Nu este instalată nicio voce românească",
  schliessenName: "Închideți",
  schliessen: "✕ Închideți",
  einleitung:
    "Textele sunt acum în română - dar pe acest dispozitiv nu există o voce românească care să le citească. Vocile fac parte din sistemul de operare; așa adaugi una:",
  windows: [
    <>
      Deschide <b>Setări</b> (tasta <b>Windows</b> + <b>I</b>).
    </>,
    <>
      Mergi la <b>Oră și limbă</b> → <b>Limbă și regiune</b>.
    </>,
    <>
      La „Limbi preferate” alege <b>Adăugați o limbă</b> și apoi <b>Română</b>.
    </>,
    <>
      În fereastra de instalare verifică dacă este bifată opțiunea pentru vorbire (<b>Conversie
      text în vorbire</b>), apoi alege <b>Instalare</b>.
    </>,
    <>Apoi închide o dată browserul și deschide-l din nou.</>,
  ],
  mac: [
    <>
      Deschide <b>Configurări sistem</b>.
    </>,
    <>
      Mergi la <b>Accesibilitate</b> → <b>Conținut vorbit</b>.
    </>,
    <>
      Deschide meniul <b>Voce sistem</b> și alege <b>Gestionați vocile...</b>
    </>,
    <>Caută o voce românească, bifeaz-o și descarc-o.</>,
    <>Apoi închide o dată browserul și deschide-l din nou.</>,
  ],
  tipp: "Sfat: vocea instalată se poate alege sus, în bara pentru citire cu voce tare, în câmpul Voce.",
};

// ★ O2-COMP (30.10.2026): sv eigene Fassung.
const ANLEITUNG_SV: AnleitungTexte = {
  name: "Installera en svensk röst för uppläsning",
  titel: "Ingen svensk röst är installerad",
  schliessenName: "Stäng",
  schliessen: "✕ Stäng",
  einleitung:
    "Innehållet är nu på svenska - men på den här enheten finns ingen svensk röst som kan läsa upp det. Rösterna är en del av operativsystemet. Så här lägger du till en:",
  windows: [
    <>
      Öppna <b>Inställningar</b> (<b>Windows-tangenten</b> + <b>I</b>).
    </>,
    <>
      Gå till <b>Tid och språk</b> → <b>Språk och region</b>.
    </>,
    <>
      Vid Önskade språk väljer du <b>Lägg till ett språk</b> och sedan <b>Svenska</b>.
    </>,
    <>
      Kontrollera i installationsfönstret att <b>Text till tal</b> är markerat,
      och välj sedan <b>Installera</b>.
    </>,
    <>Stäng sedan webbläsaren en gång och öppna den igen.</>,
  ],
  mac: [
    <>
      Öppna <b>Systeminställningar</b>.
    </>,
    <>
      Gå till <b>Hjälpmedel</b> → <b>Talat innehåll</b>.
    </>,
    <>
      Öppna menyn <b>Systemröst</b> och välj <b>Hantera röster...</b>
    </>,
    <>
      Leta upp en svensk röst, markera den och ladda ned den.
    </>,
    <>Stäng sedan webbläsaren en gång och öppna den igen.</>,
  ],
  tipp: "Tips: när rösten är installerad kan du välja den högst upp i fältet för uppläsning, under Röst.",
};

// ★ O2-COMP (30.10.2026): uk eigene Fassung.
// ★ O-UK: ти-Form wie cs. Windows-Menünamen nach Microsoft uk ([L] laut Glossar §2.8: „Параметри"
// für die Windows-Einstellungen); macOS-Namen ungemessen - darum der Mac-Weg eher beschreibend.
// Keine Stimme genannt: VORZUGS_STIMMEN hat für uk bewusst keine Namen (F58).
const ANLEITUNG_UK: AnleitungTexte = {
  name: "Установити український голос для читання вголос",
  titel: "Український голос не встановлено",
  schliessenName: "Закрити",
  schliessen: "✕ Закрити",
  einleitung:
    "Тексти тепер українською - але на цьому пристрої немає українського голосу, який міг би їх читати вголос. Голоси є частиною операційної системи; голос додається так:",
  windows: [
    <>
      Відкрий <b>Параметри</b> (клавіша <b>Windows</b> + <b>I</b>).
    </>,
    <>
      Перейди до <b>Час і мова</b> → <b>Мова та регіон</b>.
    </>,
    <>
      Біля пункту «Бажані мови» вибери <b>Додати мову</b>, а потім <b>Українська</b>.
    </>,
    <>
      У вікні встановлення перевір, що позначено <b>Перетворення тексту на мовлення</b>,
      і вибери <b>Установити</b>.
    </>,
    <>Потім один раз закрий браузер і знову відкрий його.</>,
  ],
  mac: [
    <>
      Відкрий <b>Системні параметри</b>.
    </>,
    <>
      Перейди до <b>Доступність</b> і відкрий розділ про озвучення вмісту.
    </>,
    <>
      Відкрий меню <b>Системний голос</b> і вибери пункт для керування голосами.
    </>,
    <>Знайди український голос, познач його і завантаж.</>,
    <>Потім один раз закрий браузер і знову відкрий його.</>,
  ],
  tipp: "Порада: встановлений голос можна вибрати вгорі на панелі читання вголос, у полі Голос.",
};

// ★ ES-F8 (27.09.2026): "es" bekommt jetzt {@link ANLEITUNG_ES} - vorher
// (ES-F2/ES-O-Vermerk) stand hier der englische Rückfall.
const ANLEITUNG: Record<BedienSprache, AnleitungTexte> = {
  ...ANLEITUNG_DE_EN_FR,
  es: ANLEITUNG_ES,
  it: ANLEITUNG_IT,
  pl: ANLEITUNG_PL, // ★ O-PL
  tr: ANLEITUNG_TR, // ★ O-TR
  cs: ANLEITUNG_CS, // ★ O-CS (03.10.2026)
  bg: ANLEITUNG_BG, // ★ O2-COMP (30.10.2026)
  el: ANLEITUNG_EL, // ★ O2-COMP (30.10.2026)
  hu: ANLEITUNG_HU, // ★ O2-COMP (30.10.2026)
  nl: ANLEITUNG_NL, // ★ O2-COMP (30.10.2026)
  pt: ANLEITUNG_PT, // ★ O2-COMP (30.10.2026)
  br: ANLEITUNG_BR, // ★ O2-COMP (30.10.2026)
  ro: ANLEITUNG_RO, // ★ O2-COMP (30.10.2026)
  sv: ANLEITUNG_SV, // ★ O2-COMP (30.10.2026)
  uk: ANLEITUNG_UK, // ★ O2-COMP (30.10.2026)
};

/** Ein Bedien-Schritt als nummerierter Eintrag. */
function Steps({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="m-0 list-decimal space-y-1 pl-5 text-ink-soft">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ol>
  );
}

function Block({
  title,
  icon,
  children,
}: {
  title: string;
  /** Dekoratives Symbol (aria-hidden) — die Überschrift selbst liest nur den Titel. */
  icon?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-hairline bg-surface-sunken p-4">
      <h3 className="m-0 mb-2 text-lg font-semibold text-ink">
        {icon && <span aria-hidden="true">{icon} </span>}
        {title}
      </h3>
      {children}
    </section>
  );
}

export function VoiceInstallHelp({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  // Anfangs-Fokus auf „Schließen", Tab im Dialog halten.
  //
  // ★ Nr 14 der Fokusziele (22.08.2026): KEIN `restoreFocus` - genau wie bei
  // `LehrerHilfe`. Vorher lief der Fokus erst zurück auf das Sprach-Auswahlfeld
  // und unmittelbar danach ins Tippfeld (die Seite holt ihn dort). Zwei Ziele
  // für einen Vorgang sind auf der Braillezeile ein Sprung zu viel; es gilt
  // R2: EIN Ziel, die Eingabezeile.
  useFocusTrap(open, cardRef, { initialFocus: closeRef });
  // ★ E11a-4 (26.09.2026): `spracheGewaehlt` statt der oberflächen-sicheren
  // `sprache` - ANLEITUNG kennt „fr" jetzt (vorher nur de/en).
  const sprache = useBedienSprache().spracheGewaehlt;
  const t = ANLEITUNG[sprache];
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t.name}
      onClick={onClose}
    >
      <div
        ref={cardRef}
        className="card my-8 w-full max-w-2xl space-y-4 p-6"
        onClick={(e) => e.stopPropagation()}
        lang={htmlLang(sprache)}
      >
        <div className="flex items-start justify-between gap-3">
          {/* ★ E7 (11.09.2026): `text-xl` statt `text-2xl`. */}
          <h2 className="m-0 text-xl font-semibold text-ink">
            {t.titel}
          </h2>
          <button
            ref={closeRef}
            type="button"
            className="btn-secondary btn-toggle"
            onClick={onClose}
            aria-label={t.schliessenName}
          >
            {t.schliessen}
          </button>
        </div>

        <p className="m-0 text-ink-soft">{t.einleitung}</p>

        <Block title="Windows" icon="🪟">
          <Steps items={t.windows} />
        </Block>

        <Block title="Mac">
          <Steps items={t.mac} />
        </Block>

        <p className="m-0 text-sm text-ink-muted">{t.tipp}</p>
      </div>
    </div>
  );
}
