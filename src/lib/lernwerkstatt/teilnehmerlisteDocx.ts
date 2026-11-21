/**
 * „Teilnehmerliste herunterladen" (14.09.2026, Wunsch Johannes): eine
 * schlanke Word-Datei mit Name, Passwort und Klassencode - zum Ausdrucken
 * und Austeilen, ohne den Umweg über das Druckfenster von {@link drucke}
 * (`KlasseUndKinder.tsx`), das dieselben drei Spalten zeigt, aber nur für die
 * eben angelegten Kinder gilt. Diese Liste gilt für ALLE Lernenden der
 * Klasse - Zugangsdaten, die eine Lehrkraft Wochen später noch einmal
 * braucht, nicht nur im Augenblick des Anlegens.
 *
 * Die `docx`-Bibliothek wird NUR per dynamischem `import()` geladen (siehe
 * `ausgleich/data/docx.ts`) - so bleibt sie aus dem Haupt-Bündel und lädt
 * erst, wenn eine Lehrkraft wirklich herunterlädt.
 */
import type { TypingClass } from "@/lib/typing";
import { GEBIET, mehrzahl, texte, type BedienSprache } from "@/lib/bedienSprache";
import { fremdschriftUmschreiben, istGeruestSprache } from "@/lib/typing/sprachRegister";

/**
 * ★★ DIE TEXTE DER ZUGANGSDATEN-LISTE in beiden Bedienungssprachen (EN7,
 * 19.09.2026). Deutsch wortgleich wie vorher. Englisch nach dem Glossar:
 * Zugangsdaten ⇒ *login details*, Klassencode ⇒ *class code*, Lernende einer
 * Klasse (Lehrkraft-Sicht) ⇒ *pupils* (§3.8), Lernwerkstatt bleibt ein Name
 * und wird beim ersten Mal erklärt (§2), Datum *19 September 2026* (§1.2).
 *
 * ⚠️ Exportiert, weil dieselbe Liste noch einmal als Druckfenster entsteht
 * (`drucke` in `KlasseUndKinder.tsx`) - dieselben Überschriften, dieselben
 * Spalten. EN6 nimmt die englischen Wörter von hier, statt eine zweite
 * Fassung zu schreiben ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 */
export const ZUGANGSDATEN_TEXTE = texte({
  de: {
    titel: (klasse: string) => `Zugangsdaten: Klasse ${klasse}`,
    stand: (anzahl: number, datum: string) => `${anzahl} Lernende · Stand ${datum}`,
    anmeldung: "Anmeldung in jedem Lernprogramm der Lernwerkstatt mit Klassencode, Name und Passwort.",
    name: "Name",
    passwort: "Passwort",
    klassencode: "Klassencode",
    nichtGesetzt: "noch nicht gesetzt",
    fusszeile:
      "Ändert eine Lehrkraft später ein Passwort, steht hier weiter der Stand von heute - bei Bedarf neu herunterladen.",
    dateiname: "teilnehmerliste",
  },
  en: {
    titel: (klasse: string) => `Login details: class ${klasse}`,
    stand: (anzahl: number, datum: string) =>
      `${mehrzahl(anzahl, "en", { one: (z) => `${z} pupil`, other: (z) => `${z} pupils` })} · as of ${datum}`,
    anmeldung:
      "To sign in to any of the Lernwerkstatt apps (the learning apps of Sensorik), pupils use the class code, their name and their password.",
    name: "Name",
    passwort: "Password",
    klassencode: "Class code",
    nichtGesetzt: "not set yet",
    fusszeile:
      "If a teacher changes a password later, this list still shows today's details - download it again if you need to.",
    dateiname: "class-list",
  },
  fr: {
    titel: (klasse: string) => `Identifiants : classe ${klasse}`,
    stand: (anzahl: number, datum: string) =>
      `${mehrzahl(anzahl, "fr", { one: (z) => `${z} élève`, other: (z) => `${z} élèves` })} - au ${datum}`,
    anmeldung:
      "Connexion dans chaque programme d'apprentissage de Lernwerkstatt avec le code de classe, le nom et le mot de passe.",
    name: "Nom",
    passwort: "Mot de passe",
    klassencode: "Code de classe",
    nichtGesetzt: "pas encore défini",
    fusszeile:
      "Si un enseignant ou une enseignante modifie un mot de passe plus tard, cette liste montre encore l'état d'aujourd'hui - à retélécharger si besoin.",
    dateiname: "liste-participants",
  },
  // ★ ES-O (27.09.2026): liest die Lehrkraft (und wer die Liste ausgeteilt bekommt).
  es: {
    titel: (klasse: string) => `Datos de acceso: clase ${klasse}`,
    stand: (anzahl: number, datum: string) =>
      `${mehrzahl(anzahl, "es", { one: (z) => `${z} estudiante`, other: (z) => `${z} estudiantes` })} - actualizado el ${datum}`,
    anmeldung:
      "Inicio de sesión en cada programa de aprendizaje de Lernwerkstatt con el código de clase, el nombre y la contraseña.",
    name: "Nombre",
    passwort: "Contraseña",
    klassencode: "Código de clase",
    nichtGesetzt: "todavía sin fijar",
    fusszeile:
      "Si una persona docente cambia más tarde una contraseña, esta lista sigue mostrando el estado de hoy - si hace falta, descárguela de nuevo.",
    dateiname: "lista-participantes",
  },
  it: {
    titel: (klasse: string) => `Dati di accesso: classe ${klasse}`,
    stand: (anzahl: number, datum: string) =>
      `${mehrzahl(anzahl, "it", { one: (z) => `${z} persona`, other: (z) => `${z} alunni` })} - aggiornato al ${datum}`,
    anmeldung:
      "Accesso a ogni programma di apprendimento della Lernwerkstatt con codice classe, nome e password.",
    name: "Nome",
    passwort: "Password",
    klassencode: "Codice classe",
    nichtGesetzt: "non ancora impostata",
    fusszeile:
      "Se in seguito l'insegnante cambia una password, questo elenco mostra ancora lo stato di oggi - se serve, scaricarlo di nuovo.",
    dateiname: "elenco-alunni",
  },
  // ★ O-PL (02.10.2026): „Dane logowania" (Glossar §2.5), Kinder als „osoba"
  // (vier Formen), „lista klasy" (§2.6).
  pl: {
    titel: (klasse: string) => `Dane logowania: klasa ${klasse}`,
    stand: (anzahl: number, datum: string) =>
      `${mehrzahl(anzahl, "pl", {
        one: (z) => `${z} osoba`,
        few: (z) => `${z} osoby`,
        many: (z) => `${z} osób`,
        other: (z) => `${z} osoby`,
      })} - stan na ${datum}`,
    anmeldung: "Logowanie do każdego programu Lernwerkstatt kodem klasy, imieniem i hasłem.",
    name: "Imię",
    passwort: "Hasło",
    klassencode: "Kod klasy",
    nichtGesetzt: "jeszcze nieustawione",
    fusszeile:
      "Jeśli później zostanie zmienione hasło, tutaj nadal widać stan z dzisiaj - w razie potrzeby pobierz listę ponownie.",
    dateiname: "lista-klasy",
  },
  // ★ O-TR (02.10.2026): "giriş bilgileri", "sınıf kodu", "sınıf listesi" (Glossar
  // §2.5/§2.6); Klassenname und Datum ohne Endung (Regel 6), nach der Zahl Einzahl.
  tr: {
    titel: (klasse: string) => `Giriş bilgileri - Sınıf: ${klasse}`,
    stand: (anzahl: number, datum: string) =>
      `${mehrzahl(anzahl, "tr", { one: (z) => `${z} öğrenci`, other: (z) => `${z} öğrenci` })} - ${datum} tarihli liste`,
    anmeldung: "Lernwerkstatt programlarının her birine sınıf kodu, ad ve şifre ile giriş yapılır.",
    name: "Ad",
    passwort: "Şifre",
    klassencode: "Sınıf kodu",
    nichtGesetzt: "henüz belirlenmedi",
    fusszeile:
      "Bir öğretmen daha sonra bir şifreyi değiştirirse bu liste bugünkü durumu göstermeye devam eder - gerekirse listeyi yeniden indirin.",
    dateiname: "sınıf-listesi",
  },
  // ★ O-CS (03.10.2026): „přihlašovací údaje", „kód třídy", „seznam třídy"
  // (Glossar §2.5/§2.6); Kinder als „osoba" (vier Formen, §2.11), der
  // Klassenname hinter dem Kopfwort „třída" (Regel 12), Datum im Genitiv
  // nach „ze dne" (Intl, §4 Falle 7).
  cs: {
    titel: (klasse: string) => `Přihlašovací údaje: třída ${klasse}`,
    stand: (anzahl: number, datum: string) =>
      `${mehrzahl(anzahl, "cs", {
        one: (z) => `${z} osoba`,
        few: (z) => `${z} osoby`,
        many: (z) => `${z} osoby`,
        other: (z) => `${z} osob`,
      })} - seznam ze dne ${datum}`,
    anmeldung: "Přihlášení do každého výukového programu Lernwerkstatt kódem třídy, jménem a heslem.",
    name: "Jméno",
    passwort: "Heslo",
    klassencode: "Kód třídy",
    nichtGesetzt: "zatím nenastaveno",
    fusszeile:
      "Pokud se heslo později změní, je tu dál vidět dnešní stav - v případě potřeby seznam stáhněte znovu.",
    dateiname: "seznam-třídy",
  },
  bg: {
    titel: (klasse: string) => `Данни за вход: клас ${klasse}`,
    stand: (anzahl: number, datum: string) =>
      `${mehrzahl(anzahl, "bg", {
        one: (z) => `${z} ученик`,
        other: (z) => `${z} ученици`,
      })} · актуално към ${datum}`,
    anmeldung: "Вход във всяка програма за обучение на Lernwerkstatt с код на класа, име и парола.",
    name: "Име",
    passwort: "Парола",
    klassencode: "Код на класа",
    nichtGesetzt: "още не е зададена",
    fusszeile:
      "Ако паролата бъде сменена по-късно, тук остава днешното състояние - при нужда изтеглете списъка отново.",
    dateiname: "списък-на-класа",
  },
  el: {
    titel: (klasse: string) => `Στοιχεία σύνδεσης: τμήμα ${klasse}`,
    stand: (anzahl: number, datum: string) =>
      `${mehrzahl(anzahl, "el", {
        one: (z) => `${z} άτομο`,
        other: (z) => `${z} άτομα`,
      })} - τελευταία ενημέρωση: ${datum}`,
    anmeldung: "Σύνδεση σε κάθε εφαρμογή μάθησης του Lernwerkstatt με κωδικό τμήματος, όνομα και κωδικό πρόσβασης.",
    name: "Όνομα",
    passwort: "Κωδικός πρόσβασης",
    klassencode: "Κωδικός τμήματος",
    nichtGesetzt: "δεν έχει οριστεί ακόμα",
    fusszeile:
      "Αν ο κωδικός πρόσβασης αλλάξει αργότερα, εδώ φαίνεται ακόμα η σημερινή κατάσταση - αν χρειαστεί, κατεβάστε ξανά τον κατάλογο.",
    dateiname: "κατάλογος-τμήματος",
  },
  hu: {
    titel: (klasse: string) => `Belépési adatok - osztály: ${klasse}`,
    stand: (anzahl: number, datum: string) =>
      `${mehrzahl(anzahl, "hu", {
        one: (z) => `${z} tanuló`,
        other: (z) => `${z} tanuló`,
      })} - állapot: ${datum}`,
    anmeldung: "Bejelentkezés a Lernwerkstatt minden oktatóprogramjába osztálykóddal, névvel és jelszóval.",
    name: "Név",
    passwort: "Jelszó",
    klassencode: "Osztálykód",
    nichtGesetzt: "még nincs megadva",
    fusszeile:
      "Ha egy tanár később módosít egy jelszót, itt továbbra is a mai állapot látható - szükség esetén töltse le újra a listát.",
    dateiname: "osztálynévsor",
  },
  nl: {
    titel: (klasse: string) => `Inloggegevens: klas ${klasse}`,
    stand: (anzahl: number, datum: string) =>
      `${mehrzahl(anzahl, "nl", {
        one: (z) => `${z} leerling`,
        other: (z) => `${z} leerlingen`,
      })} · laatst bijgewerkt: ${datum}`,
    anmeldung: "Inloggen in elk leerprogramma van Lernwerkstatt met klascode, naam en wachtwoord.",
    name: "Naam",
    passwort: "Wachtwoord",
    klassencode: "Klascode",
    nichtGesetzt: "nog niet ingesteld",
    fusszeile:
      "Als een leerkracht later een wachtwoord wijzigt, staat hier nog steeds de stand van vandaag - download de lijst zo nodig opnieuw.",
    dateiname: "klassenlijst",
  },
  pt: {
    titel: (klasse: string) => `Dados de acesso: turma ${klasse}`,
    stand: (anzahl: number, datum: string) =>
      `${mehrzahl(anzahl, "pt", {
        one: (z) => `${z} pessoa`,
        other: (z) => `${z} pessoas`,
      })} - lista de ${datum}`,
    anmeldung: "Início de sessão em cada programa de aprendizagem da Lernwerkstatt com o código da turma, o nome e a palavra-passe.",
    name: "Nome",
    passwort: "Palavra-passe",
    klassencode: "Código da turma",
    nichtGesetzt: "ainda não definida",
    fusszeile:
      "Se uma palavra-passe for alterada mais tarde, aqui continua a ver-se o estado de hoje - se necessário, transfira a lista outra vez.",
    dateiname: "lista-da-turma",
  },
  br: {
    titel: (klasse: string) => `Dados de acesso: turma ${klasse}`,
    // Null nie über mehrzahl (Glossar Regel 13).
    stand: (anzahl: number, datum: string) =>
      `${
        anzahl === 0
          ? "Nenhuma pessoa"
          : mehrzahl(anzahl, "br", {
              one: (z) => `${z} estudante`,
              other: (z) => `${z} estudantes`,
            })
      } - lista de ${datum}`,
    anmeldung: "Para entrar em cada aplicativo de aprendizagem da Lernwerkstatt: código da turma, nome e senha.",
    name: "Nome",
    passwort: "Senha",
    klassencode: "Código da turma",
    nichtGesetzt: "ainda não definida",
    fusszeile:
      "Se uma senha mudar depois, aqui continua aparecendo o estado de hoje - se precisar, baixe a lista de novo.",
    dateiname: "lista-da-turma",
  },
  ro: {
    titel: (klasse: string) => `Date de conectare: clasa ${klasse}`,
    stand: (anzahl: number, datum: string) =>
      `${mehrzahl(anzahl, "ro", {
        one: (z) => `${z} persoană`,
        few: (z) => `${z} persoane`,
        other: (z) => `${z} de persoane`,
      })} - situația din ${datum}`,
    anmeldung: "Conectarea în fiecare program de învățare Lernwerkstatt se face cu codul clasei, numele și parola.",
    name: "Nume",
    passwort: "Parolă",
    klassencode: "Codul clasei",
    nichtGesetzt: "încă nesetată",
    fusszeile:
      "Dacă o parolă se schimbă mai târziu, aici rămâne situația de azi - la nevoie, descărcați din nou lista.",
    dateiname: "lista-clasei",
  },
  sv: {
    titel: (klasse: string) => `Inloggningsuppgifter: klass ${klasse}`,
    stand: (anzahl: number, datum: string) =>
      `${mehrzahl(anzahl, "sv", {
        one: (z) => `${z} elev`,
        other: (z) => `${z} elever`,
      })} - senast uppdaterad: ${datum}`,
    anmeldung: "Logga in i varje lärprogram i Lernwerkstatt med klasskod, namn och lösenord.",
    name: "Namn",
    passwort: "Lösenord",
    klassencode: "Klasskod",
    nichtGesetzt: "inte angivet än",
    fusszeile:
      "Om ett lösenord ändras senare visas fortfarande dagens uppgifter här - ladda ned listan igen vid behov.",
    dateiname: "klasslista",
  },
  uk: {
    titel: (klasse: string) => `Дані для входу: клас ${klasse}`,
    stand: (anzahl: number, datum: string) =>
      `${mehrzahl(anzahl, "uk", {
        one: (z) => `${z} особа`,
        few: (z) => `${z} особи`,
        many: (z) => `${z} осіб`,
        other: (z) => `${z} особи`,
      })} - станом на ${datum}`,
    anmeldung: "Вхід у кожну навчальну програму Lernwerkstatt: код класу, ім'я та пароль.",
    name: "Ім'я",
    passwort: "Пароль",
    klassencode: "Код класу",
    nichtGesetzt: "ще не встановлено",
    fusszeile:
      "Якщо пароль згодом зміниться, тут і далі буде видно сьогоднішній стан - за потреби завантажте список знову.",
    dateiname: "список-класу",
  },
});

/** „19.09.2026" (deutsch) / „19 September 2026" (englisch) / „19 septembre 2026" (französisch, Glossar §1.2/§9.1). */
export function listenDatum(ms: number, sprache: BedienSprache = "de"): string {
  // ★ O5 (30.10.2026): die neun nach ihrem Gebiet, ausgeschrieben (bis dahin österreichisch-deutsch).
  if (istGeruestSprache(sprache))
    return new Date(ms).toLocaleDateString(GEBIET[sprache], { day: "numeric", month: "long", year: "numeric" });
  // ★ O-CS (03.10.2026): „2. října 2026" - Monat im Genitiv (Intl, Glossar §2.10).
  if (sprache === "cs")
    return new Date(ms).toLocaleDateString("cs-CZ", { day: "numeric", month: "long", year: "numeric" });
  // ★ O-TR (02.10.2026): "21 Eylül 2026" (Glossar §2.10, gemessen mit Intl).
  if (sprache === "tr")
    return new Date(ms).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
  // ★ O-PL (02.10.2026): „21 września 2026 r." (Glossar §2.7/§2.10).
  if (sprache === "pl")
    return `${new Date(ms).toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" })} r.`;
  // ★ O-IT (02.10.2026): „19 settembre 2026".
  if (sprache === "it")
    return new Date(ms).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
  if (sprache === "en")
    return new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  if (sprache === "fr")
    return new Date(ms).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  // ★ ES-O (27.09.2026): „19 de septiembre de 2026" - vorher still Deutsch.
  if (sprache === "es")
    return new Date(ms).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
  return new Date(ms).toLocaleDateString("de-AT", { day: "2-digit", month: "2-digit", year: "numeric" });
}

const INK = "1F2328";
const MUTED = "56606A";
const BORDER = "9AA4AE";
const HEAD_FILL = "EEF1F4";

/** Browser-Download eines Blobs (dieselbe Bauart wie `ausgleich/data/docx.ts`). */
function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * „teilnehmerliste-3b-14-09-2026.docx" (englisch „class-list-3b-14-09-2026.docx")
 * - echte Umlaute im Klassennamen bleiben weg.
 */
export function listenDateiname(
  klassenname: string,
  jetztMs: number,
  sprache: BedienSprache = "de",
): string {
  // ★ G2-NEUN (25.10.2026): kyrillische und griechische Buchstaben umgeschrieben („5б" ⇒ „5b") statt weggelassen.
  const schlank = fremdschriftUmschreiben(klassenname)
    .toLowerCase()
    .replace(/[äáàâ]/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const d = new Date(jetztMs);
  const tag = String(d.getDate()).padStart(2, "0");
  const monat = String(d.getMonth() + 1).padStart(2, "0");
  return `${ZUGANGSDATEN_TEXTE[sprache].dateiname}-${schlank}-${tag}-${monat}-${d.getFullYear()}.docx`;
}

/**
 * Baut die Word-Datei und löst den Download aus.
 *
 * @param cls Die Klasse (Name für den Titel, Code für die Spalte).
 * @param zeilen Name + Passwort je Lernendem, sortiert wie gewünscht -
 *   diese Funktion sortiert nicht selbst.
 * @param sprache ★ EN7: die Bedienungssprache - ohne Angabe Deutsch, genau
 *   die Datei von vorher.
 */
export async function downloadTeilnehmerliste(
  cls: Pick<TypingClass, "name" | "code">,
  zeilen: readonly { name: string; password: string }[],
  sprache: BedienSprache = "de",
): Promise<void> {
  const { Packer } = await import("docx");
  const doc = await baueTeilnehmerliste(cls, zeilen, sprache, Date.now());
  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, listenDateiname(cls.name, Date.now(), sprache));
}

/**
 * Die Word-Datei selbst (ohne Download) - getrennt, damit ein Test sie bauen
 * und lesen kann (`tests/tastenflow-englisch-hilfe-handbuch.test.tsx`).
 */
export async function baueTeilnehmerliste(
  cls: Pick<TypingClass, "name" | "code">,
  zeilen: readonly { name: string; password: string }[],
  sprache: BedienSprache,
  jetztMs: number,
) {
  const t = ZUGANGSDATEN_TEXTE[sprache];
  const {
    AlignmentType,
    BorderStyle,
    Document,
    HeadingLevel,
    Paragraph,
    ShadingType,
    Table,
    TableCell,
    TableRow,
    TextRun,
    WidthType,
  } = await import("docx");

  const randlinie = { style: BorderStyle.SINGLE, size: 4, color: BORDER } as const;
  const rahmen = { top: randlinie, bottom: randlinie, left: randlinie, right: randlinie,
    insideHorizontal: randlinie, insideVertical: randlinie } as const;

  const kopfZelle = (text: string, breite: number) =>
    new TableCell({
      width: { size: breite, type: WidthType.PERCENTAGE },
      shading: { type: ShadingType.CLEAR, fill: HEAD_FILL },
      margins: { top: 100, bottom: 100, left: 140, right: 140 },
      children: [
        new Paragraph({
          children: [new TextRun({ text, bold: true, size: 20, color: INK })],
        }),
      ],
    });
  const zelle = (text: string) =>
    new TableCell({
      margins: { top: 90, bottom: 90, left: 140, right: 140 },
      children: [new Paragraph({ children: [new TextRun({ text, size: 22, color: INK })] })],
    });

  const zeilenSortiert = zeilen; // Reihenfolge kommt vom Aufrufer.
  const tabelle = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: rahmen,
    rows: [
      new TableRow({
        tableHeader: true,
        children: [kopfZelle(t.name, 40), kopfZelle(t.passwort, 30), kopfZelle(t.klassencode, 30)],
      }),
      ...zeilenSortiert.map(
        (z) =>
          new TableRow({
            children: [zelle(z.name), zelle(z.password || t.nichtGesetzt), zelle(cls.code)],
          }),
      ),
    ],
  });

  const heute = listenDatum(jetztMs, sprache);

  return new Document({
    sections: [
      {
        properties: { page: { margin: { top: 1000, bottom: 1000, left: 1000, right: 1000 } } },
        children: [
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 80 },
            children: [
              new TextRun({ text: t.titel(cls.name), bold: true, size: 32, color: INK }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: t.stand(zeilenSortiert.length, heute),
                size: 20,
                color: MUTED,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 260 },
            children: [
              new TextRun({
                text: t.anmeldung,
                size: 22,
                color: INK,
              }),
            ],
          }),
          tabelle,
          new Paragraph({
            spacing: { before: 260 },
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: t.fusszeile,
                italics: true,
                size: 18,
                color: MUTED,
              }),
            ],
          }),
        ],
      },
    ],
  });
}
