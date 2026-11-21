/**
 * ★★★★★ WOHER DER TEXT KOMMT - Datei hochladen · Meine Texte · Vorlagen
 * (E7/E8, 19.09.2026, „Meine Klassen"-Umbau).
 *
 * Der gemeinsame Baustein für „Eigene Übung" (`EigeneUebungKasten.tsx`) UND
 * die Tippchallenge mit eigenem Text (`SchreibprobeKasten.tsx`, Niveau
 * „eigen") - beide brauchen dieselben drei Wege zu einer Vorschau
 * (`useEigenerTextUpload`), nur das eigentliche STARTEN unterscheidet sich
 * und bleibt darum in den beiden Kästen.
 *
 *  • **Datei hochladen** - wie bisher (`useEigenerTextUpload.ts`); dabei
 *    „In Meine Texte speichern" (Vorgabe an) - siehe {@link inPoolSpeichern}.
 *  • **Meine Texte** - die eigene Ablage der Lehrkraft (`meineTexte.ts`,
 *    `tt_meine_texte`) - ausschliesslich von ihr selbst lesbar/löschbar,
 *    kein Teilen (Johannes, Entwurf-Dokument §7b Frage 7).
 *  • **Vorlagen** - die sechs Text-Lektionen des Lehrgangs als Angebot
 *    (`vorlagen.ts`). Der Lehrgang selbst ist seit E7 kein eigener
 *    Übungsbildschirm mehr (siehe `trainerMode.ts`) - die Texte dahinter
 *    bleiben nützlich, nur der Weg dorthin hat sich geändert.
 *
 * ── Warum ein und dieselbe Vorschau für alle drei Wege ──────────────────────
 * Eine Pool-Zeile UND eine Vorlagen-Zeile laufen hier durch DIESELBE Kette
 * wie eine hochgeladene Datei (`verarbeiteEigenenText`) - nicht, weil sie
 * ungeglättet wären (ein Pool-Eintrag ist es beim Speichern längst), sondern
 * weil `verbietenSs` vom PANEL abhängt, nicht vom Text: Ein Text aus „Eigene
 * Übung" (ß erlaubt) kann später als Vorlage für die Tippchallenge (ß
 * verboten) gewählt werden - dort MUSS ein enthaltenes ß erneut auffallen.
 *
 * ── Slim page (Johannes, 19.09.2026) ────────────────────────────────────────
 * *„halte die Seite jetzt extrem schlank und mach keine dauerhaften
 * Erklärungen unter den Schaltern, das geht mit Mouseover"* - keine
 * Erklärungs-Absätze hier, jeder Schalter trägt seinen Hinweis über
 * {@link Tipp} (Muster `ZeitraumKopf.tsx`), nie `title`.
 */
import { useId, useState } from "react";
import type { Lang, Stufe } from "@/lib/typing/account";
import { typingBackend } from "@/lib/typing/backend";
import { verarbeiteEigenenText } from "@/lib/typing/eigenerText";
import type { MeinTextEintrag } from "@/lib/typing/meineTexte";
import { startGeschrieben } from "@/lib/typing/schreibprobe";
import type { EigenerTextUploadStand } from "@/lib/typing/useEigenerTextUpload";
import { vorlagenFuer, vorlageTitel, vorlageVorschau, type VorlageFuer } from "@/lib/typing/vorlagen";
import { SprachpaketTor } from "@/components/typing/SprachpaketTor";
import type { Lernweg } from "@/lib/typing/lernweg";
import { Modal } from "@/components/Modal";
import { Tipp } from "@/components/Tipp";
import { AnsehenKnopf, zeilenAlsTextdatei } from "./AnsehenKnopf";
import { Aufklappen } from "@/components/Aufklappen";
import { texte, useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";
import type { Teil } from "@/lib/bedienSprache/texte";

type Quelle = "upload" | "pool" | "vorlagen";

/**
 * ★ EN6b (19.09.2026): die Texte in beiden Bedienungssprachen - Deutsch
 * wortgleich wie vorher. Glossar §3.8: *My texts*, *Upload your own file (.txt
 * or .docx)*, Vorlage ⇒ *template*. Die Namen der Vorlagen sind die Namen der
 * Lektionen (`lektionTitel`, EN3) - englisch aus derselben Tabelle wie in der
 * Statistik und im Handbuch.
 */
const T = texte({
  de: {
    upload: "Datei hochladen",
    uploadTipp: "Eine eigene .txt- oder .docx-Datei hochladen.",
    pool: "Meine Texte",
    poolTipp: "Einen zuvor gespeicherten eigenen Text wiederverwenden - nur in Ihrem Konto sichtbar.",
    vorlagen: "Vorlagen",
    vorlagenTipp: "Einen vorgefertigten Text übernehmen: aus dem Lehrgang, Fremdwörter oder Programmcode.",
    gruppeLehrgang: "Aus dem Lehrgang",
    gruppeFremd: "Fremdwörterkunde",
    // ★ E8 (24.09.2026): steht nur für Klassen auf dem englischen Lehrgang
    // (Weg „en") im Baum - siehe `vorlagen.ts`, `vorlageVorschau`.
    gruppeWurzeln: "Wortstämme",
    gruppeCode: "Programmcode",
    woher: "Woher kommt der Text?",
    dateiLabel: "Eigene Datei hochladen (.txt oder .docx)",
    dateiTipp:
      "Bis zu 2 MB, .txt oder .docx - aus einer .docx-Datei wird nur der reine Text übernommen, keine Bilder oder Formatierung.",
    inPoolTipp: `Legt eine Kopie in „Meine Texte" ab - für einen späteren erneuten Start, ohne die Datei noch einmal hochzuladen.`,
    inPool: "In Meine Texte speichern",
    laedt: "Wird geladen …",
    poolFehler: "Meine Texte konnten nicht geladen werden. Bitte noch einmal versuchen.",
    poolLeer: "Noch keine eigenen Texte gespeichert - beim Hochladen anbieten lassen.",
    inVorschauTipp: "Lädt diesen Text in die Vorschau - erst der Knopf weiter unten weist ihn wirklich zu.",
    loeschenTipp: `Entfernt diesen Text endgültig aus „Meine Texte" - nach einer Rückfrage.`,
    loeschen: "Löschen",
    loeschenTitel: "Eigenen Text löschen",
    // In Stücken wie vorher im JSX: „ · Name · Rest (drei Textknoten).
    loeschenFrage: (name: string): readonly Teil[] => ["„", name, '" wirklich aus Meine Texte löschen?'],
    abbrechen: "Abbrechen",
  },
  en: {
    upload: "Upload a file",
    uploadTipp: "Upload a .txt or .docx file of your own.",
    pool: "My texts",
    poolTipp: "Reuse a text of your own that you saved earlier - only visible in your account.",
    vorlagen: "Templates",
    vorlagenTipp: "Use a ready-made text: from the course, foreign words or program code.",
    gruppeLehrgang: "From the course",
    gruppeFremd: "Foreign words",
    gruppeWurzeln: "Word roots",
    gruppeCode: "Program code",
    woher: "Where does the text come from?",
    dateiLabel: "Upload your own file (.txt or .docx)",
    dateiTipp:
      "Up to 2 MB, .txt or .docx - from a .docx file only the plain text is used, no pictures or formatting.",
    inPoolTipp:
      "Keeps a copy in “My texts” - so you can start it again later without uploading the file again.",
    inPool: "Save in My texts",
    laedt: "Loading …",
    poolFehler: "My texts couldn't be loaded. Please try again.",
    poolLeer: "No texts of your own saved yet - you'll be offered this when you upload a file.",
    inVorschauTipp: "Loads this text into the preview - only the button further down actually assigns it.",
    loeschenTipp: "Removes this text from “My texts” for good - after asking you to confirm.",
    loeschen: "Delete",
    loeschenTitel: "Delete your own text",
    loeschenFrage: (name: string): readonly Teil[] => [`Delete “${name}” from My texts for good?`],
    abbrechen: "Cancel",
  },
  fr: {
    upload: "Charger un fichier",
    uploadTipp: "Charger votre propre fichier .txt ou .docx.",
    pool: "Mes textes",
    poolTipp: "Réutiliser un texte personnel déjà enregistré - visible uniquement dans votre compte.",
    vorlagen: "Modèles",
    vorlagenTipp: "Reprendre un texte prêt à l'emploi : du parcours, des mots étrangers ou du code informatique.",
    gruppeLehrgang: "Du parcours",
    gruppeFremd: "Mots étrangers",
    gruppeWurzeln: "Racines de mots",
    gruppeCode: "Code informatique",
    woher: "D'où vient le texte ?",
    dateiLabel: "Charger votre propre fichier (.txt ou .docx)",
    dateiTipp:
      "Jusqu'à 2 Mo, .txt ou .docx - d'un fichier .docx, seul le texte brut est repris, sans images ni mise en forme.",
    inPoolTipp:
      'Enregistre une copie dans "Mes textes" - pour redémarrer plus tard sans recharger le fichier.',
    inPool: "Enregistrer dans Mes textes",
    laedt: "Chargement en cours …",
    poolFehler: "Mes textes n'ont pas pu être chargés. Merci de réessayer.",
    poolLeer: "Aucun texte enregistré pour l'instant. Au prochain chargement d'un fichier, vous pourrez l'enregistrer ici.",
    inVorschauTipp: "Charge ce texte dans l'aperçu - seul le bouton plus bas l'attribue vraiment.",
    loeschenTipp: 'Retire définitivement ce texte de "Mes textes" - après confirmation.',
    loeschen: "Supprimer",
    loeschenTitel: "Supprimer le texte personnel",
    loeschenFrage: (name: string): readonly Teil[] => [
      'Vraiment supprimer "',
      name,
      '" de Mes textes ?',
    ],
    abbrechen: "Annuler",
  },
  // ★ ES-O (27.09.2026): liest nur die Lehrkraft - usted.
  es: {
    upload: "Subir un archivo",
    uploadTipp: "Subir un archivo propio .txt o .docx.",
    pool: "Mis textos",
    poolTipp: "Volver a usar un texto propio ya guardado - solo visible en su cuenta.",
    vorlagen: "Plantillas",
    vorlagenTipp: "Tomar un texto ya preparado: del recorrido, de palabras extranjeras o de código informático.",
    gruppeLehrgang: "Del recorrido",
    gruppeFremd: "Palabras extranjeras",
    gruppeWurzeln: "Raíces de palabras",
    gruppeCode: "Código informático",
    woher: "¿De dónde viene el texto?",
    dateiLabel: "Subir un archivo propio (.txt o .docx)",
    dateiTipp:
      "Hasta 2 MB, .txt o .docx - de un archivo .docx solo se toma el texto, sin imágenes ni formato.",
    inPoolTipp:
      'Guarda una copia en "Mis textos" - para volver a iniciarlo más tarde sin subir el archivo otra vez.',
    inPool: "Guardar en Mis textos",
    laedt: "Cargando …",
    poolFehler: "No se pudieron cargar Mis textos. Vuelva a intentarlo, por favor.",
    poolLeer: "Todavía no hay ningún texto guardado. La próxima vez que suba un archivo podrá guardarlo aquí.",
    inVorschauTipp: "Carga este texto en la vista previa - solo el botón de más abajo lo asigna de verdad.",
    loeschenTipp: 'Quita este texto de "Mis textos" para siempre - tras una confirmación.',
    loeschen: "Eliminar",
    loeschenTitel: "Eliminar el texto propio",
    loeschenFrage: (name: string): readonly Teil[] => [
      '¿Eliminar de verdad "',
      name,
      '" de Mis textos?',
    ],
    abbrechen: "Cancelar",
  },
  // ★ O-IT (02.10.2026): „I miei testi", „modello" (Glossar §2.6), Lehrkraft neutral.
  it: {
    upload: "Carica un file",
    uploadTipp: "Caricare un proprio file .txt o .docx.",
    pool: "I miei testi",
    poolTipp: "Usare di nuovo un proprio testo già salvato - visibile solo in questo account.",
    vorlagen: "Modelli",
    vorlagenTipp: "Prendere un testo già pronto: dal percorso, da parole straniere o da codice informatico.",
    gruppeLehrgang: "Dal percorso",
    gruppeFremd: "Parole straniere",
    gruppeWurzeln: "Radici delle parole",
    gruppeCode: "Codice informatico",
    woher: "Da dove viene il testo?",
    dateiLabel: "Carica un proprio file (.txt o .docx)",
    dateiTipp:
      "Fino a 2 MB, .txt o .docx - da un file .docx si prende solo il testo, senza immagini né formattazione.",
    inPoolTipp:
      `Salva una copia in "I miei testi" - per avviarlo di nuovo più tardi senza caricare ancora il file.`,
    inPool: "Salva in I miei testi",
    laedt: "Caricamento in corso...",
    poolFehler: `Non è stato possibile caricare "I miei testi". Riprovare, per favore.`,
    poolLeer: "Ancora nessun testo salvato. La prossima volta che si carica un file, lo si può salvare qui.",
    inVorschauTipp: "Carica questo testo nell'anteprima - solo il pulsante qui sotto lo assegna davvero.",
    loeschenTipp: `Toglie questo testo da "I miei testi" per sempre - dopo una conferma.`,
    loeschen: "Elimina",
    loeschenTitel: "Eliminare il proprio testo",
    loeschenFrage: (name: string): readonly Teil[] => [
      'Eliminare davvero "',
      name,
      '" da I miei testi?',
    ],
    abbrechen: "Annulla",
  },
  // ★ O-PL (02.10.2026): Lehrkraft ty-Befehlsform (Glossar Regel 1), „Moje teksty"
  // (§2.6), „Prześlij" = Datei hochladen (Regel 12), „kurs" = Lehrgang (§2.2).
  pl: {
    upload: "Prześlij plik",
    uploadTipp: "Prześlij własny plik .txt lub .docx.",
    pool: "Moje teksty",
    poolTipp: "Użyj ponownie zapisanego wcześniej własnego tekstu - widać go tylko na tym koncie.",
    vorlagen: "Szablony",
    vorlagenTipp: "Weź gotowy tekst: z kursu, z wyrazów obcych albo z kodu programu.",
    gruppeLehrgang: "Z kursu",
    gruppeFremd: "Wyrazy obce",
    gruppeWurzeln: "Rdzenie słów",
    gruppeCode: "Kod programu",
    woher: "Skąd pochodzi tekst?",
    dateiLabel: "Prześlij własny plik (.txt lub .docx)",
    dateiTipp:
      "Do 2 MB, .txt lub .docx - z pliku .docx brany jest tylko sam tekst, bez obrazów i formatowania.",
    inPoolTipp:
      "Zapisuje kopię w „Moich tekstach” - żeby później uruchomić ten tekst ponownie bez przesyłania pliku.",
    inPool: "Zapisz w Moich tekstach",
    laedt: "Wczytywanie...",
    poolFehler: "Nie udało się wczytać Moich tekstów. Spróbuj jeszcze raz.",
    poolLeer: "Nie ma jeszcze zapisanych własnych tekstów. Przy następnym przesłaniu pliku można go tu zapisać.",
    inVorschauTipp: "Wczytuje ten tekst do podglądu - dopiero przycisk poniżej naprawdę go przydziela.",
    loeschenTipp: "Usuwa ten tekst z Moich tekstów na zawsze - po potwierdzeniu.",
    loeschen: "Usuń",
    loeschenTitel: "Usuń własny tekst",
    loeschenFrage: (name: string): readonly Teil[] => [
      "Naprawdę usunąć „",
      name,
      "” z Moich tekstów?",
    ],
    abbrechen: "Anuluj",
  },
  // ★ O-TR (02.10.2026): Lehrkraft siz mit -(y)In (Glossar Regel 1), "Metinlerim"
  // und "şablon" (§2.6), "Dosya yükle" (Regel 10); der Name in der Rückfrage
  // bleibt ohne Endung (Regel 6).
  tr: {
    upload: "Dosya yükle",
    uploadTipp: "Kendi .txt veya .docx dosyanızı yükleyin.",
    pool: "Metinlerim",
    poolTipp: "Daha önce kaydettiğiniz bir metni yeniden kullanın - yalnızca sizin hesabınızda görünür.",
    vorlagen: "Şablonlar",
    vorlagenTipp: "Hazır bir metin seçin: kurstan, yabancı kelimelerden veya program kodundan.",
    gruppeLehrgang: "Kurstan",
    gruppeFremd: "Yabancı kelimeler",
    gruppeWurzeln: "Kelime kökleri",
    gruppeCode: "Program kodu",
    woher: "Metin nereden gelsin?",
    dateiLabel: "Kendi dosyanızı yükleyin (.txt veya .docx)",
    dateiTipp:
      "En çok 2 MB, .txt veya .docx - .docx dosyasından yalnızca düz metin alınır, resimler ve biçimlendirme alınmaz.",
    inPoolTipp:
      "\"Metinlerim\" bölümüne bir kopya kaydeder - böylece dosyayı yeniden yüklemeden metni daha sonra tekrar başlatabilirsiniz.",
    inPool: "Metinlerime kaydet",
    laedt: "Yükleniyor...",
    poolFehler: "\"Metinlerim\" yüklenemedi. Lütfen tekrar deneyin.",
    poolLeer: "Henüz kayıtlı bir metniniz yok. Bir dosya yüklediğinizde onu buraya kaydedebilirsiniz.",
    inVorschauTipp: "Bu metni önizlemeye alır - metni sınıfa asıl veren, aşağıdaki düğmedir.",
    loeschenTipp: "Bu metni \"Metinlerim\" bölümünden kalıcı olarak siler - önce onayınız istenir.",
    loeschen: "Sil",
    loeschenTitel: "Metni sil",
    loeschenFrage: (name: string): readonly Teil[] => [
      "\"",
      name,
      "\" adlı metin \"Metinlerim\" bölümünden silinsin mi?",
    ],
    abbrechen: "İptal",
  },
  // ★ O-CS (03.10.2026): Lehrkraft vy-Mehrzahl, Knöpfe im Infinitiv (Glossar
  // Regel 1), „Moje texty" und „šablona" (§2.6), „Odstranit" (Regel 10); der
  // Name in der Rückfrage steht hinter dem Kopfwort „text" (Regel 12).
  cs: {
    upload: "Nahrát soubor",
    uploadTipp: "Nahrajte vlastní soubor .txt nebo .docx.",
    pool: "Moje texty",
    poolTipp: "Použijte znovu vlastní text, který už je uložený - vidíte ho jen ve svém účtu.",
    vorlagen: "Šablony",
    vorlagenTipp: "Převezměte hotový text: z kurzu, z cizích slov nebo z programového kódu.",
    gruppeLehrgang: "Z kurzu",
    gruppeFremd: "Cizí slova",
    gruppeWurzeln: "Slovní kořeny",
    gruppeCode: "Programový kód",
    woher: "Odkud text pochází?",
    dateiLabel: "Nahrát vlastní soubor (.txt nebo .docx)",
    dateiTipp:
      "Nejvýše 2 MB, .txt nebo .docx - ze souboru .docx se převezme jen čistý text, bez obrázků a formátování.",
    inPoolTipp:
      "Uloží kopii do Mých textů - text pak spustíte znovu bez opětovného nahrání souboru.",
    inPool: "Uložit do Mých textů",
    laedt: "Načítání...",
    poolFehler: "Moje texty se nepodařilo načíst. Zkuste to prosím znovu.",
    poolLeer: "Zatím tu není žádný uložený text. Při příštím nahrání souboru ho sem můžete uložit.",
    inVorschauTipp: "Načte tento text do náhledu - třídě ho přidělí až tlačítko níže.",
    loeschenTipp: "Trvale odstraní tento text z Mých textů - až po potvrzení.",
    loeschen: "Odstranit",
    loeschenTitel: "Odstranit vlastní text",
    loeschenFrage: (name: string): readonly Teil[] => [
      "Opravdu odstranit text „",
      name,
      "“ z Mých textů?",
    ],
    abbrechen: "Zrušit",
  },
  bg: {
    upload: "Качи файл",
    uploadTipp: "Качете собствен файл .txt или .docx.",
    pool: "Моите текстове",
    poolTipp: "Използвайте отново собствен текст, който вече е записан - виждате го само в своя акаунт.",
    vorlagen: "Шаблони",
    vorlagenTipp: "Вземете готов текст: от курса, чужди думи или програмен код.",
    gruppeLehrgang: "От курса",
    gruppeFremd: "Чужди думи",
    gruppeWurzeln: "Корени на думите",
    gruppeCode: "Програмен код",
    woher: "Откъде идва текстът?",
    dateiLabel: "Качи собствен файл (.txt или .docx)",
    dateiTipp:
      "До 2 МБ, .txt или .docx - от файл .docx се взема само чистият текст, без изображения и форматиране.",
    inPoolTipp:
      "Записва копие в „Моите текстове“ - така по-късно можете да започнете текста отново, без да качвате файла пак.",
    inPool: "Запиши в Моите текстове",
    laedt: "Зареждане...",
    poolFehler: "Моите текстове не можаха да се заредят. Опитайте отново.",
    poolLeer: "Все още няма записан текст. При следващото качване на файл можете да го запишете тук.",
    inVorschauTipp: "Зарежда този текст в прегледа - на класа го задава едва бутонът по-долу.",
    loeschenTipp: "Премахва този текст от „Моите текстове“ завинаги - след потвърждение.",
    loeschen: "Изтрий",
    loeschenTitel: "Изтриване на собствен текст",
    loeschenFrage: (name: string): readonly Teil[] => [
      "Наистина ли да се изтрие текстът „",
      name,
      "“ от Моите текстове?",
    ],
    abbrechen: "Отказ",
  },
  el: {
    upload: "Ανέβασμα αρχείου",
    uploadTipp: "Ανεβάστε δικό σας αρχείο .txt ή .docx.",
    pool: "Τα κείμενά μου",
    poolTipp: "Χρησιμοποιήστε ξανά ένα δικό σας κείμενο που είναι ήδη αποθηκευμένο - το βλέπετε μόνο στον λογαριασμό σας.",
    vorlagen: "Πρότυπα",
    vorlagenTipp: "Πάρτε ένα έτοιμο κείμενο: από το πρόγραμμα μαθημάτων, από ξένες λέξεις ή από κώδικα προγραμματισμού.",
    gruppeLehrgang: "Από το πρόγραμμα μαθημάτων",
    gruppeFremd: "Ξένες λέξεις",
    gruppeWurzeln: "Ρίζες λέξεων",
    gruppeCode: "Κώδικας προγραμματισμού",
    woher: "Από πού είναι το κείμενο;",
    dateiLabel: "Ανέβασμα δικού σας αρχείου (.txt ή .docx)",
    dateiTipp:
      "Έως 2 MB, .txt ή .docx - από ένα αρχείο .docx παίρνεται μόνο το απλό κείμενο, χωρίς εικόνες και μορφοποίηση.",
    inPoolTipp:
      "Αποθηκεύει ένα αντίγραφο στην ενότητα «Τα κείμενά μου» - έτσι ξεκινάτε το κείμενο ξανά χωρίς να ανεβάσετε πάλι το αρχείο.",
    inPool: "Αποθήκευση στα κείμενά μου",
    laedt: "Φόρτωση...",
    poolFehler: "Δεν ήταν δυνατή η φόρτωση της ενότητας «Τα κείμενά μου». Δοκιμάστε ξανά.",
    poolLeer: "Δεν υπάρχει ακόμα αποθηκευμένο κείμενο. Την επόμενη φορά που θα ανεβάσετε αρχείο, μπορείτε να το αποθηκεύσετε εδώ.",
    inVorschauTipp: "Φορτώνει αυτό το κείμενο στην προεπισκόπηση - στο τμήμα το αναθέτει μόνο το κουμπί από κάτω.",
    loeschenTipp: "Διαγράφει οριστικά αυτό το κείμενο από την ενότητα «Τα κείμενά μου» - μόνο μετά από επιβεβαίωση.",
    loeschen: "Διαγραφή",
    loeschenTitel: "Διαγραφή δικού σας κειμένου",
    loeschenFrage: (name: string): readonly Teil[] => [
      "Θέλετε σίγουρα να διαγράψετε το κείμενο «",
      name,
      "» από την ενότητα «Τα κείμενά μου»;",
    ],
    abbrechen: "Άκυρο",
  },
  hu: {
    upload: "Fájl feltöltése",
    uploadTipp: "Saját .txt vagy .docx fájl feltöltése.",
    pool: "Saját szövegeim",
    poolTipp: "Egy korábban mentett saját szöveg újbóli használata - csak ebben a fiókban látható.",
    vorlagen: "Sablonok",
    vorlagenTipp: "Kész szöveg átvétele: a tanfolyamból, idegen szavakból vagy programkódból.",
    gruppeLehrgang: "A tanfolyamból",
    gruppeFremd: "Idegen szavak",
    gruppeWurzeln: "Szótövek",
    gruppeCode: "Programkód",
    woher: "Honnan származik a szöveg?",
    dateiLabel: "Saját fájl feltöltése (.txt vagy .docx)",
    dateiTipp:
      "Legfeljebb 2 MB, .txt vagy .docx - a .docx fájlból csak a puszta szöveg kerül át, képek és formázás nélkül.",
    inPoolTipp:
      "Másolatot ment a „Saját szövegeim” közé - így a szöveg később a fájl újbóli feltöltése nélkül is elindítható.",
    inPool: "Mentés a Saját szövegeim közé",
    laedt: "Betöltés...",
    poolFehler: "A Saját szövegeim listát nem sikerült betölteni. Próbálja meg újra.",
    poolLeer: "Még nincs mentett saját szöveg. A következő fájlfeltöltéskor ide is menthető.",
    inVorschauTipp: "Betölti ezt a szöveget az előnézetbe - az osztálynak csak a lenti gomb adja ki.",
    loeschenTipp: "Véglegesen eltávolítja ezt a szöveget a Saját szövegeim közül - megerősítés után.",
    loeschen: "Törlés",
    loeschenTitel: "Saját szöveg törlése",
    loeschenFrage: (name: string): readonly Teil[] => [
      "Biztosan törli a Saját szövegeim közül? Szöveg: „",
      name,
      "”",
    ],
    abbrechen: "Mégse",
  },
  nl: {
    upload: "Bestand uploaden",
    uploadTipp: "Upload een eigen .txt- of .docx-bestand.",
    pool: "Mijn teksten",
    poolTipp: "Gebruik een eerder opgeslagen eigen tekst opnieuw - alleen zichtbaar in je account.",
    vorlagen: "Sjablonen",
    vorlagenTipp: "Neem een kant-en-klare tekst over: uit de cursus, leenwoorden of programmacode.",
    gruppeLehrgang: "Uit de cursus",
    gruppeFremd: "Leenwoorden",
    gruppeWurzeln: "Woordstammen",
    gruppeCode: "Programmacode",
    woher: "Waar komt de tekst vandaan?",
    dateiLabel: "Eigen bestand uploaden (.txt of .docx)",
    dateiTipp:
      "Tot 2 MB, .txt of .docx - uit een .docx-bestand wordt alleen de platte tekst overgenomen, zonder afbeeldingen of opmaak.",
    inPoolTipp:
      "Bewaart een kopie in Mijn teksten - om later opnieuw te starten zonder het bestand nog een keer te uploaden.",
    inPool: "Opslaan in Mijn teksten",
    laedt: "Laden...",
    poolFehler: "Mijn teksten konden niet worden geladen. Probeer het nog eens.",
    poolLeer: "Nog geen eigen teksten opgeslagen. Bij de volgende upload kun je de tekst hier bewaren.",
    inVorschauTipp: "Laadt deze tekst in het voorbeeld - pas de knop verderop wijst hem echt toe.",
    loeschenTipp: "Verwijdert deze tekst definitief uit Mijn teksten - na een bevestiging.",
    loeschen: "Verwijderen",
    loeschenTitel: "Eigen tekst verwijderen",
    loeschenFrage: (name: string): readonly Teil[] => [
      "\"",
      name,
      "\" echt verwijderen uit Mijn teksten?",
    ],
    abbrechen: "Annuleren",
  },
  pt: {
    upload: "Carregar ficheiro",
    uploadTipp: "Carregue um ficheiro próprio .txt ou .docx.",
    pool: "Os meus textos",
    poolTipp: "Volte a usar um texto próprio já guardado - só é visível na sua conta.",
    vorlagen: "Modelos",
    vorlagenTipp: "Use um texto pronto: do curso, de palavras estrangeiras ou de código de programação.",
    gruppeLehrgang: "Do curso",
    gruppeFremd: "Palavras estrangeiras",
    gruppeWurzeln: "Raízes das palavras",
    gruppeCode: "Código de programação",
    woher: "De onde vem o texto?",
    dateiLabel: "Carregar ficheiro próprio (.txt ou .docx)",
    dateiTipp:
      "Até 2 MB, .txt ou .docx - de um ficheiro .docx só se aproveita o texto simples, sem imagens nem formatação.",
    inPoolTipp:
      "Guarda uma cópia em \"Os meus textos\" - para voltar a começar mais tarde sem carregar o ficheiro outra vez.",
    inPool: "Guardar em Os meus textos",
    laedt: "A carregar...",
    poolFehler: "Não foi possível carregar Os meus textos. Tente outra vez.",
    poolLeer: "Ainda não há textos guardados. Da próxima vez que carregar um ficheiro, pode guardá-lo aqui.",
    inVorschauTipp: "Carrega este texto na pré-visualização - só o botão mais abaixo o atribui à turma.",
    loeschenTipp: "Remove este texto de \"Os meus textos\" definitivamente - depois de pedir confirmação.",
    loeschen: "Eliminar",
    loeschenTitel: "Eliminar texto próprio",
    loeschenFrage: (name: string): readonly Teil[] => [
      "Quer mesmo eliminar \"",
      name,
      "\" de Os meus textos?",
    ],
    abbrechen: "Cancelar",
  },
  br: {
    upload: "Carregar arquivo",
    uploadTipp: "Carregue um arquivo próprio .txt ou .docx.",
    pool: "Meus textos",
    poolTipp: "Use de novo um texto próprio já salvo - visível só na sua conta.",
    vorlagen: "Modelos",
    vorlagenTipp: "Use um texto pronto: do curso, de palavras estrangeiras ou de código de programação.",
    gruppeLehrgang: "Do curso",
    gruppeFremd: "Palavras estrangeiras",
    gruppeWurzeln: "Radicais das palavras",
    gruppeCode: "Código de programação",
    woher: "De onde vem o texto?",
    dateiLabel: "Carregar arquivo próprio (.txt ou .docx)",
    dateiTipp:
      "Até 2 MB, .txt ou .docx - de um arquivo .docx só o texto puro é usado, sem imagens nem formatação.",
    inPoolTipp:
      "Guarda uma cópia em Meus textos - assim você pode começar o texto de novo sem carregar o arquivo outra vez.",
    inPool: "Salvar em Meus textos",
    laedt: "Carregando...",
    poolFehler: "Não foi possível carregar Meus textos. Tente de novo.",
    poolLeer: "Ainda não há textos salvos. Na próxima vez que carregar um arquivo, você pode salvá-lo aqui.",
    inVorschauTipp: "Carrega este texto na pré-visualização - só o botão mais abaixo o atribui à turma.",
    loeschenTipp: "Remove este texto de Meus textos de forma definitiva - depois de uma confirmação.",
    loeschen: "Excluir",
    loeschenTitel: "Excluir texto próprio",
    loeschenFrage: (name: string): readonly Teil[] => [
      'Excluir mesmo o texto "',
      name,
      '" de Meus textos?',
    ],
    abbrechen: "Cancelar",
  },
  ro: {
    upload: "Încărcați un fișier",
    uploadTipp: "Încărcați un fișier propriu .txt sau .docx.",
    pool: "Textele mele",
    poolTipp: "Folosiți din nou un text propriu deja salvat - este vizibil doar în contul propriu.",
    vorlagen: "Șabloane",
    vorlagenTipp: "Preluați un text gata făcut: din curs, din cuvinte străine sau din cod de program.",
    gruppeLehrgang: "Din curs",
    gruppeFremd: "Cuvinte străine",
    gruppeWurzeln: "Rădăcini de cuvinte",
    gruppeCode: "Cod de program",
    woher: "De unde vine textul?",
    dateiLabel: "Încărcați un fișier propriu (.txt sau .docx)",
    dateiTipp:
      "Cel mult 2 MB, .txt sau .docx - dintr-un fișier .docx se preia doar textul simplu, fără imagini și formatare.",
    inPoolTipp:
      "Salvează o copie în Textele mele - textul poate fi pornit din nou fără a încărca iar fișierul.",
    inPool: "Salvați în Textele mele",
    laedt: "Se încarcă...",
    poolFehler: "Textele mele nu au putut fi încărcate. Încercați din nou.",
    poolLeer: "Aici nu există încă niciun text salvat. La următoarea încărcare a unui fișier îl puteți salva aici.",
    inVorschauTipp: "Încarcă acest text în previzualizare - abia butonul de mai jos îl atribuie clasei.",
    loeschenTipp: "Elimină definitiv acest text din Textele mele - numai după confirmare.",
    loeschen: "Ștergeți",
    loeschenTitel: "Ștergeți textul propriu",
    loeschenFrage: (name: string): readonly Teil[] => [
      "Sigur ștergeți textul „",
      name,
      "” din Textele mele?",
    ],
    abbrechen: "Anulați",
  },
  sv: {
    upload: "Ladda upp fil",
    uploadTipp: "Ladda upp en egen .txt- eller .docx-fil.",
    pool: "Mina texter",
    poolTipp: "Använd en egen text som du har sparat tidigare - den syns bara i ditt konto.",
    vorlagen: "Mallar",
    vorlagenTipp: "Använd en färdig text: från kursen, främmande ord eller programkod.",
    gruppeLehrgang: "Från kursen",
    gruppeFremd: "Främmande ord",
    gruppeWurzeln: "Ordstammar",
    gruppeCode: "Programkod",
    woher: "Var kommer texten ifrån?",
    dateiLabel: "Ladda upp en egen fil (.txt eller .docx)",
    dateiTipp:
      "Upp till 2 MB, .txt eller .docx - från en .docx-fil används bara den rena texten, inga bilder eller formatering.",
    inPoolTipp:
      "Sparar en kopia i Mina texter - så kan du börja om senare utan att ladda upp filen igen.",
    inPool: "Spara i Mina texter",
    laedt: "Läser in...",
    poolFehler: "Det gick inte att läsa in Mina texter. Försök igen.",
    poolLeer: "Inga egna texter sparade än. När du laddar upp en fil kan du spara den här.",
    inVorschauTipp: "Läser in texten i förhandsvisningen - klassen får den först med knappen längre ned.",
    loeschenTipp: "Tar bort texten från Mina texter för gott - efter en kontrollfråga.",
    loeschen: "Ta bort",
    loeschenTitel: "Ta bort egen text",
    loeschenFrage: (name: string): readonly Teil[] => [
      "Ta bort \"",
      name,
      "\" från Mina texter? Det går inte att ångra.",
    ],
    abbrechen: "Avbryt",
  },
  uk: {
    upload: "Додати файл",
    uploadTipp: "Додайте власний файл .txt або .docx.",
    pool: "Мої тексти",
    poolTipp: "Використайте знову власний збережений текст - його видно лише у вашому обліковому записі.",
    vorlagen: "Шаблони",
    vorlagenTipp: "Візьміть готовий текст: з курсу, іншомовні слова або програмний код.",
    gruppeLehrgang: "З курсу",
    gruppeFremd: "Іншомовні слова",
    gruppeWurzeln: "Корені слів",
    gruppeCode: "Програмний код",
    woher: "Звідки цей текст?",
    dateiLabel: "Додати власний файл (.txt або .docx)",
    dateiTipp:
      "До 2 МБ, .txt або .docx - з файлу .docx береться лише чистий текст, без зображень і форматування.",
    inPoolTipp:
      "Зберігає копію в Моїх текстах - потім текст можна почати знову, не додаючи файл ще раз.",
    inPool: "Зберегти в Моїх текстах",
    laedt: "Завантаження...",
    poolFehler: "Не вдалося завантажити Мої тексти. Спробуйте ще раз.",
    poolLeer: "Збережених текстів ще немає. Під час наступного додавання файлу його можна зберегти тут.",
    inVorschauTipp: "Завантажує цей текст у попередній перегляд - класу його призначає лише кнопка нижче.",
    loeschenTipp: "Остаточно видаляє цей текст із Моїх текстів - лише після підтвердження.",
    loeschen: "Видалити",
    loeschenTitel: "Видалити власний текст",
    loeschenFrage: (name: string): readonly Teil[] => [
      "Справді видалити текст «",
      name,
      "» з Моїх текстів?",
    ],
    abbrechen: "Скасувати",
  },
});

/** Die drei Wege zum Text - Name und Hinweis in der Bedienungssprache. */
function quellen(sprache: BedienSprache): { key: Quelle; label: string; tipp: string }[] {
  const t = T[sprache];
  return [
    { key: "upload", label: t.upload, tipp: t.uploadTipp },
    { key: "pool", label: t.pool, tipp: t.poolTipp },
    { key: "vorlagen", label: t.vorlagen, tipp: t.vorlagenTipp },
  ];
}

export interface EigenerTextQuelleProps {
  teacherId: string;
  /** Für welches Alter die Vorlagen-Texte gezogen werden. */
  stufe: Stufe;
  /** Sprache der Vorlagen-Texte. */
  lang: Lang;
  /**
   * ★ E8 (24.09.2026, Bauplan §6.3/§4): der Lernweg des Kindes/der Klasse -
   * `vorlagen.ts` (`vorlageVorschau`) braucht ihn, um „Word roots" (Weg „en")
   * und Fremdwörterkunde (Weg „de") auseinanderzuhalten. OPTIONAL, Vorgabe
   * „de" - wie bei `vorlageVorschau` selbst.
   */
  lernweg?: Lernweg;
  /** ß im Zeichen-Bericht melden? `true` für die Tippchallenge, `false` für „Eigene Übung". */
  verbietenSs: boolean;
  /**
   * ★ 21.09.2026: WOZU der Text gewählt wird - bestimmt, welche Vorlagen
   * dastehen (die Fremdwörterkunde gibt es für beide, aber in anderen Dateien;
   * Programmcode nur für „Eigene Übung"). Ohne Angabe: aus `verbietenSs`
   * (Tippchallenge ⇔ ß verboten), wie bisher.
   */
  fuer?: VorlageFuer;
  upload: EigenerTextUploadStand;
  /** „In Meine Texte speichern" - nur beim Hochladen sichtbar/wirksam. */
  inPoolSpeichern: boolean;
  onInPoolSpeichernChange: (an: boolean) => void;
  /**
   * Meldet, WOHER die aktuelle Vorschau kommt - der Kasten braucht das beim
   * Starten: „In Meine Texte speichern" darf nur greifen, wenn der Text
   * gerade wirklich HOCHGELADEN wurde (ein Pool- oder Vorlagen-Text landet
   * sonst ein zweites Mal in der eigenen Ablage, ohne dass die Lehrkraft das
   * Häkchen je gesehen hätte - es steht nur beim Hochladen im Baum).
   */
  onQuelleChange?: (quelle: "upload" | "pool" | "vorlagen") => void;
  /**
   * ★ L4 (19.09.2026, Johannes: *„die drei Schalter in die obere Zeile, also:
   * ‚Eigene Übung:' |Datei hochladen|...|..."*): ein Titel VORN in der Zeile
   * der drei Wege - „Eigene Übung:" (im Panel der Aufgaben-Zeile ist das die
   * Überschrift des Panels selbst, samt Fokus-Ziel). Fehlt er (Tippchallenge
   * mit eigener Datei), bleibt die Zeile genau wie vorher.
   */
  titel?: React.ReactNode;
}

export function EigenerTextQuelle({
  teacherId,
  stufe,
  lang,
  lernweg,
  verbietenSs,
  fuer = verbietenSs ? "challenge" : "uebung",
  upload,
  inPoolSpeichern,
  onInPoolSpeichernChange,
  onQuelleChange,
  titel,
}: EigenerTextQuelleProps) {
  const { sprache } = useBedienSprache();
  const t = T[sprache];
  const [quelle, setQuelle] = useState<Quelle>("upload");
  const [pool, setPool] = useState<MeinTextEintrag[] | null>(null);
  const [poolLaedt, setPoolLaedt] = useState(false);
  const [poolFehler, setPoolFehler] = useState(false);
  // ★ E12 (19.09.2026, Mouseover-/Schlank-Durchgang): Rückfrage über `Modal`
  // statt `window.confirm` - der Baustein bringt Fokus-Falle, Escape und die
  // Rückgabe des Fokus mit (Hausform, siehe `KlasseUndKinder.tsx`).
  const [loeschenFrage, setLoeschenFrage] = useState<MeinTextEintrag | null>(null);
  const dateiId = useId();
  const inPoolId = useId();

  async function ladePool() {
    setPoolLaedt(true);
    setPoolFehler(false);
    try {
      setPool(await typingBackend().listeMeineTexte(teacherId));
    } catch {
      setPoolFehler(true);
    } finally {
      setPoolLaedt(false);
    }
  }

  function wechsleQuelle(q: Quelle) {
    setQuelle(q);
    onQuelleChange?.(q);
    upload.zuruecksetzen();
    if (q === "pool" && pool === null) void ladePool();
  }

  async function waehlePoolEintrag(eintrag: MeinTextEintrag) {
    const gelesen = await typingBackend().leseMeinenText(eintrag.id);
    if (!gelesen || gelesen.zeilen.length === 0) return;
    upload.setzeVorschau(
      gelesen.dateiname,
      verarbeiteEigenenText(gelesen.zeilen.join("\n"), { verbietenSs, weg: lernweg }),
    );
  }

  async function loescheBestaetigt() {
    const eintrag = loeschenFrage;
    if (!eintrag) return;
    setLoeschenFrage(null);
    const ok = await typingBackend().loescheMeinenText(eintrag.id, teacherId);
    if (ok) setPool((p) => p?.filter((e) => e.id !== eintrag.id) ?? p);
  }

  function waehleVorlage(id: string, titel: string) {
    // ★ EN6b: `titel` kommt schon in der Bedienungssprache (siehe unten) - er
    // wird der Name der Übung, den die Klasse im Fenster liest.
    const vorschau = vorlageVorschau(id, { stufe, lang, verbietenSs, lernweg });
    if (!vorschau) return;
    upload.setzeVorschau(titel, vorschau);
  }

  const wege = (
    <div role="group" aria-label={t.woher} className="flex flex-wrap gap-1">
      {quellen(sprache).map((q) => (
        <Tipp key={q.key} text={q.tipp}>
          {(hinweisId) => (
            <button
              type="button"
              aria-pressed={quelle === q.key}
              aria-describedby={hinweisId}
              className={(quelle === q.key ? "btn-primary" : "btn-secondary") + " btn-toggle"}
              onClick={() => wechsleQuelle(q.key)}
            >
              {q.label}
            </button>
          )}
        </Tipp>
      ))}
    </div>
  );

  return (
    <div className="space-y-2">
      {/* ★ L4: Mit Titel stehen „Eigene Übung:" und die drei Wege in EINER
          Zeile; bei schmalem Fenster rutscht die Gruppe als Ganzes darunter. */}
      {titel ? (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {titel}
          {wege}
        </div>
      ) : (
        wege
      )}

      {/*
        ★ 19.09.2026: Die drei Wege klappen SICHTBAR auf und zu (Johannes:
        „der Rest rutscht nach unten und der andere kommt nach"). Beim Wechsel
        schrumpft der bisherige Bereich, während der neue wächst - alles
        darunter gleitet um den Unterschied, statt zu springen. Zugeklappt
        steht wie bisher nichts im Baum.
      */}
      <Aufklappen offen={quelle === "upload"}>
        <div className="space-y-2">
          <div>
            <label className="field-label" htmlFor={dateiId}>
              {t.dateiLabel}
            </label>
            {/* ★ K2 (19.09.2026): Tipp NIE ins `<label>` verschachteln (bricht
                `getByLabelText`, siehe Notiz am Kästchen weiter unten) - er
                umschliesst darum nur das Eingabefeld, als Geschwister des
                Labels. */}
            <Tipp text={t.dateiTipp}>
              {(hinweisId) => (
                <input
                  id={dateiId}
                  type="file"
                  accept=".txt,.docx"
                  aria-describedby={hinweisId}
                  onChange={(e) => void upload.waehleDatei(e.target.files?.[0] ?? null)}
                />
              )}
            </Tipp>
          </div>
          {/* ★ 19.09.2026: kommt mit der Vorschau und wächst mit ihr auf. */}
          <Aufklappen offen={!!upload.vorschau}>
            <div className="flex min-h-9 items-center gap-2 text-sm text-ink">
              {/*
                ★ E12: Kästchen und Beschriftung stehen als GESCHWISTER da,
                verbunden über `htmlFor`/`id` - nicht mehr das Kästchen IM
                `<label>` verschachtelt. Gemessen (19.09.2026): Ein `Tipp`
                verschachtelt im `<label>` bricht `getByLabelText` auch dann,
                wenn nur das Kästchen selbst umschlossen wird - jsdoms
                `element.labels` findet die verschachtelte Kontrolle nicht
                mehr (UEBERGABE-2026-09-10-ABEND §5 galt bisher nur für den
                Fall „ganzes Label"; hier gilt es auch fürs Kästchen).
              */}
              {/* ★ E12, Browser-Messung (700 px): das Kästchen steht ganz
                  links - „rechts" (Vorgabe) lief über den Fensterrand. */}
              <Tipp text={t.inPoolTipp} ausrichtung="links">
                {(hinweisId) => (
                  <input
                    id={inPoolId}
                    type="checkbox"
                    checked={inPoolSpeichern}
                    aria-describedby={hinweisId}
                    onChange={(e) => onInPoolSpeichernChange(e.target.checked)}
                  />
                )}
              </Tipp>
              <label htmlFor={inPoolId}>{t.inPool}</label>
            </div>
          </Aufklappen>
        </div>
      </Aufklappen>

      <Aufklappen offen={quelle === "pool"}>
        {poolLaedt ? (
          <p className="m-0 text-sm text-ink-muted">{t.laedt}</p>
        ) : poolFehler ? (
          <p role="alert" className="text-sm text-danger">
            {t.poolFehler}
          </p>
        ) : !pool || pool.length === 0 ? (
          <p className="m-0 text-sm text-ink-muted">{t.poolLeer}</p>
        ) : (
          <ul className="m-0 list-none divide-y divide-hairline p-0">
            {pool.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center gap-2 py-2">
                <Tipp text={t.inVorschauTipp} className="flex-auto">
                  {(hinweisId) => (
                    <button
                      type="button"
                      className="btn-secondary min-h-9 w-full text-left"
                      aria-describedby={hinweisId}
                      onClick={() => void waehlePoolEintrag(e)}
                    >
                      <span className="block font-semibold text-ink">{e.dateiname}</span>
                      <span className="block text-sm text-ink-muted">
                        {startGeschrieben(e.erstelltMs, sprache)}
                        {e.ersteWorte ? ` · ${e.ersteWorte}` : ""}
                      </span>
                    </button>
                  )}
                </Tipp>
                {/* 08.11.2026: der eigene Text im großen Fenster, ohne ihn erst zu wählen. */}
                <AnsehenKnopf
                  name={e.dateiname}
                  ausrichtung="rechts"
                  hole={async () => {
                    const g = await typingBackend().leseMeinenText(e.id);
                    if (!g || g.zeilen.length === 0) throw new Error("leer");
                    return zeilenAlsTextdatei(g.dateiname || e.dateiname, g.zeilen);
                  }}
                />
                <Tipp text={t.loeschenTipp} ausrichtung="rechts">
                  {(hinweisId) => (
                    <button
                      type="button"
                      className="btn-secondary min-h-9"
                      aria-describedby={hinweisId}
                      onClick={() => setLoeschenFrage(e)}
                    >
                      {t.loeschen}
                    </button>
                  )}
                </Tipp>
              </li>
            ))}
          </ul>
        )}
      </Aufklappen>

      {/*
        ★ E12 (19.09.2026): `Modal` statt `window.confirm` - Hausform, siehe
        `KlasseUndKinder.tsx`. Escape und „Abbrechen" ändern nichts.
      */}
      {loeschenFrage && (
        <Modal title={t.loeschenTitel} onClose={() => setLoeschenFrage(null)}>
          <div className="space-y-3 text-sm text-ink">
            <p className="m-0">
              {t.loeschenFrage(loeschenFrage.dateiname)}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn-secondary text-danger"
                onClick={() => void loescheBestaetigt()}
              >
                {t.loeschen}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setLoeschenFrage(null)}
              >
                {t.abbrechen}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/*
        ★ 21.09.2026: Die Vorlagen stehen in drei Gruppen. Die Lektionen bleiben
        eine Liste (ein Knopf je Zeile, wie bisher); Fremdwörter (4) und
        Programmcode (10) stehen als umbrechende Knopfreihen darunter - zwanzig
        Zeilen untereinander hätten die Vorschau und „Eigene Übung starten"
        weit aus dem Blick geschoben.
      */}
      <Aufklappen offen={quelle === "vorlagen"}>
        {/* ★ 28.09.2026: Die Vorschau einer Vorlage zieht ihre Zeilen aus dem
            Korpus der Übungssprache (`vorlageVorschau` → `corpusItemsFor`) -
            erst wenn deren Sprachpaket da ist, stehen die Knöpfe (sonst täte
            ein Klick nichts). */}
        <SprachpaketTor sprachen={[lang]}>
        <div className="space-y-3">
          {(
            [
              { art: "lektion", label: t.gruppeLehrgang },
              { art: "fremd", label: t.gruppeFremd },
              { art: "wurzeln", label: t.gruppeWurzeln },
              // ★ 27.09.2026: die Wurzel-Vorlagen des französischen („racines", seit
              // E10a) und des spanischen Weges („raices") hatten keine Gruppe und
              // erschienen nie. Nur diese zwei Wege liefern sie - für de/en bleibt
              // die Gruppe leer und wird nicht gezeigt (`if (dieser.length === 0)`).
              { art: "racines", label: t.gruppeWurzeln },
              { art: "raices", label: t.gruppeWurzeln },
              // ★ IT-S (03.10.2026): „Radici e prestiti" des italienischen Weges.
              { art: "radici", label: t.gruppeWurzeln },
              // ★ TR-S (09.10.2026): „Kökler ve alıntılar" des türkischen Weges.
              { art: "kokler", label: t.gruppeWurzeln },
              // ★ PL-W (09.10.2026): „Korzenie i zapożyczenia" des polnischen Weges.
              { art: "korzenie", label: t.gruppeWurzeln },
              // ★ CS-W (09.10.2026): „Původ slov" des tschechischen Weges.
              { art: "koreny", label: t.gruppeWurzeln },
              // ★ G3c-VERTEILER (25.10.2026): die Wurzel-Vorlagen der neun Gerüst-Wege (heute keine - die Gruppe bleibt leer und unsichtbar).
              { art: "wortherkunft", label: t.gruppeWurzeln },
              { art: "code", label: t.gruppeCode },
            ] as const
          ).map((g) => {
            const dieser = vorlagenFuer({ fuer, lang }).filter((v) => v.art === g.art);
            if (dieser.length === 0) return null;
            const knopf = (v: (typeof dieser)[number], breit: boolean) => (
              <Tipp text={t.inVorschauTipp}>
                {(hinweisId) => (
                  <button
                    type="button"
                    className={"btn-secondary min-h-9 text-left" + (breit ? " w-full" : "")}
                    aria-describedby={hinweisId}
                    onClick={() => waehleVorlage(v.id, vorlageTitel(v, sprache))}
                  >
                    <span className="block font-semibold text-ink">{vorlageTitel(v, sprache)}</span>
                  </button>
                )}
              </Tipp>
            );
            return (
              <div key={g.art} role="group" aria-label={g.label}>
                {g.art !== "lektion" && (
                  <p className="m-0 mb-1 text-sm font-semibold text-ink-muted" aria-hidden="true">
                    {g.label}
                  </p>
                )}
                {g.art === "lektion" ? (
                  <ul className="m-0 list-none divide-y divide-hairline p-0">
                    {dieser.map((v) => (
                      <li key={v.id} className="py-2">
                        {knopf(v, true)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="m-0 flex list-none flex-wrap gap-1 p-0">
                    {dieser.map((v) => (
                      <li key={v.id}>{knopf(v, false)}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
        </SprachpaketTor>
      </Aufklappen>
    </div>
  );
}
