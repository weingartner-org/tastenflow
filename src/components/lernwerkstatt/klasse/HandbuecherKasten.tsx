/**
 * Alle Lehrkraft-Downloads an EINER Stelle - hinter dem Schalter „Downloads"
 * im Kopf von „Meine Klassen" (Johannes, 07.09.2026: „Lehrerhandbuch muss auch
 * bei meine klassen downloadbar sein", gebündelt statt je Reiter).
 *
 * ★ 19.09.2026: aus „Handbücher" wurde „Downloads" (Johannes: *„unter
 * Handbücher bei den Lehrern, könnten wir Downloads nennen"*) - seit hier auch
 * das Tastenflow-Plakat zum Aufhängen steht, das kein Handbuch ist. Das Plakat
 * ist ÖFFENTLICH (`oeffentlich: true` in `handbuecher.ts`), die Handbücher
 * bleiben nur für Angemeldete; der Satz an der Überschrift sagt beides.
 *
 * ★★★ WARUM HIER UND NICHT JE PROGRAMM-REITER: „Meine Klasse" ist der Ort, an
 * dem eine Lehrkraft ihre Arbeit vorbereitet - und sie unterrichtet meist mit
 * mehr als einem Programm. Wer ein Handbuch sucht, soll nicht wissen müssen,
 * in welchem Reiter es liegt. Der Weg über die Programm-Seiten bleibt
 * daneben bestehen; er ist der Weg für jemanden, der schon IN einem Programm
 * steht.
 *
 * ⚠️ Nur für Angemeldete - und das ist hier von selbst erfüllt: In „Meine
 * Klasse" kommt nur eine angemeldete Lehrkraft. Die Regel selbst steht am
 * Server ([[feedback_handbuecher_nur_angemeldet]]).
 */
import { FilmKnopf } from "@/components/FilmKnopf";
import { HANDBUECHER } from "@/lib/lernwerkstatt/handbuecher";
import { LW_PROGRAMS, programmInSprache, type LwProgramKey } from "@/lib/lernwerkstatt/klassen";
import { HandbuchKnopf } from "@/components/lernwerkstatt/HandbuchKnopf";
import { Erklaert } from "@/components/typing/Erklaert";
import { texte, useBedienSprache } from "@/lib/bedienSprache";

/**
 * ★ EN7 (19.09.2026): die Texte des Kastens in beiden Bedienungssprachen.
 * Deutsch wortgleich wie vorher. Englisch: Handbuch ⇒ *guide* (Glossar
 * §3.13); die Knöpfe selbst (`HandbuchKnopf`) bieten in der englischen
 * Bedienung die englische Ausgabe an, wo es eine gibt. Der Satz über die
 * Apps ohne Handbuch steht unten je Sprache als JSX - die deutsche Fassung
 * bleibt so Textknoten für Textknoten, wie sie war.
 */
const KASTEN_TEXTE = texte({
  de: {
    titel: "Downloads für Lehrkräfte",
    titelHilfe:
      "Zum Herunterladen und Ausdrucken. Die Handbücher sind nur für Angemeldete erreichbar, das Plakat zum Aufhängen für alle.",
  },
  en: {
    titel: "Downloads for teachers",
    titelHilfe:
      "To download and print. The guides can only be reached when you are signed in; the poster for hanging up is open to everyone.",
  },
  // ★ E11a-5 (26.09.2026): Glossar §9.2 - „les enseignants et
  // enseignantes", kein Point médian.
  fr: {
    titel: "Téléchargements pour les enseignants et enseignantes",
    titelHilfe:
      "À télécharger et à imprimer. Les guides ne sont accessibles qu'après connexion, l'affiche à accrocher est ouverte à tout le monde.",
  },
  es: {
    titel: "Descargas para docentes",
    titelHilfe:
      "Para descargar e imprimir. Las guías solo están disponibles con la sesión iniciada; el cartel para colgar está abierto a todo el mundo.",
  },
  it: {
    titel: "Download per insegnanti",
    titelHilfe:
      "Da scaricare e stampare. Le guide sono disponibili solo dopo l'accesso; il poster da appendere è aperto a tutti.",
  },
  // ★ O-PL (02.10.2026): „Do pobrania dla nauczycieli", „podręcznik" (Glossar §2.6/§2.11).
  pl: {
    titel: "Do pobrania dla nauczycieli",
    titelHilfe:
      "Do pobrania i wydrukowania. Podręczniki są dostępne tylko po zalogowaniu, plakat do powieszenia - dla wszystkich.",
  },
  // ★ O-TR (02.10.2026): "İndirmeler", "Öğretmen kılavuzu", "afiş" (Glossar §2.6).
  tr: {
    titel: "Öğretmenler için indirmeler",
    titelHilfe:
      "İndirip yazdırmak için. Kılavuzlara yalnızca giriş yaptıktan sonra ulaşılır, sınıfa asılacak afiş herkese açıktır.",
  },
  // ★ O-CS (03.10.2026): „Ke stažení", „příručka pro vyučující", „plakát"
  // (Glossar §2.6), vyučující nur im Nominativ/Mehrzahl (Regel 2).
  cs: {
    titel: "Ke stažení pro vyučující",
    titelHilfe:
      "Ke stažení a vytištění. Příručky jsou dostupné jen po přihlášení, plakát na zeď je přístupný všem.",
  },
  bg: {
    titel: "Изтегляния за учители",
    titelHilfe:
      "За изтегляне и отпечатване. Ръководствата са достъпни само след вход, плакатът за стената е достъпен за всички.",
  },
  el: {
    titel: "Αρχεία λήψης για εκπαιδευτικούς",
    titelHilfe:
      "Για λήψη και εκτύπωση. Οι οδηγοί είναι διαθέσιμοι μόνο μετά τη σύνδεση, η αφίσα για ανάρτηση είναι διαθέσιμη για όλους.",
  },
  hu: {
    titel: "Letöltések tanároknak",
    titelHilfe:
      "Letöltéshez és nyomtatáshoz. A kézikönyvek csak bejelentkezés után érhetők el, a kifüggeszthető plakát mindenki számára.",
  },
  nl: {
    titel: "Downloads voor leerkrachten",
    titelHilfe:
      "Om te downloaden en af te drukken. De handleidingen zijn alleen bereikbaar als je bent ingelogd, de poster om op te hangen is voor iedereen beschikbaar.",
  },
  pt: {
    titel: "Transferências para docentes",
    titelHilfe:
      "Para transferir e imprimir. Os guias só estão acessíveis com sessão iniciada; o cartaz para afixar está acessível a todas as pessoas.",
  },
  br: {
    titel: "Downloads para docentes",
    titelHilfe:
      "Para baixar e imprimir. Os manuais só ficam acessíveis depois de entrar; o cartaz para pendurar está disponível para todas as pessoas.",
  },
  ro: {
    titel: "Descărcări pentru cadre didactice",
    titelHilfe:
      "De descărcat și de imprimat. Ghidurile sunt disponibile doar după conectare, afișul de pus pe perete este accesibil tuturor.",
  },
  sv: {
    titel: "Att ladda ned för lärare",
    titelHilfe:
      "Att ladda ned och skriva ut. Handböckerna går bara att nå när du är inloggad, affischen att hänga upp är öppen för alla.",
  },
  uk: {
    titel: "Завантаження для педагогів",
    titelHilfe:
      "Для завантаження і друку. Посібники доступні лише після входу, плакат на стіну доступний усім.",
  },
});

export function HandbuecherKasten({
  /**
   * Die Programme dieser Klasse. Sie bestimmen die REIHENFOLGE, nicht den
   * Umfang: Was die Klasse nutzt, steht oben - alles Übrige darunter.
   *
   * ★ Bewusst kein Filter. Eine Lehrkraft, die »Im Griff« noch nicht nutzt,
   * ist genau die, die das Handbuch dazu lesen möchte; ein Filter versteckte
   * es ausgerechnet vor ihr.
   */
  programme,
}: {
  programme: LwProgramKey[];
}) {
  const { sprache } = useBedienSprache();
  const t = KASTEN_TEXTE[sprache];
  const reihenfolge = [
    ...programme,
    ...LW_PROGRAMS.map((p) => p.key).filter((k) => !programme.includes(k)),
  ];
  // ★ 28.09.2026: ausserhalb von Deutsch nur die Handbücher von Tastenflow -
  // die anderen Apps gibt es nur auf Deutsch (`programmInSprache`).
  const sortiert = HANDBUECHER.filter((h) => programmInSprache(h.programm, sprache)).sort(
    (a, b) => reihenfolge.indexOf(a.programm) - reihenfolge.indexOf(b.programm),
  );

  // Programme, für die es (noch) kein Handbuch gibt - ehrlich benannt, statt
  // die Lehrkraft danach suchen zu lassen.
  const ohne = LW_PROGRAMS.filter(
    (p) => programmInSprache(p.key, sprache) && !HANDBUECHER.some((h) => h.programm === p.key),
  );

  return (
    <section className="rounded-xl border border-hairline p-3">
      {/* ★ E12 (19.09.2026): der Satz stand bis dahin als eigener Absatz
          darunter - jetzt an der Überschrift selbst (`Erklaert`, kein neuer
          Tabstopp). */}
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="m-0 text-base font-semibold text-ink">
          <Erklaert hilfe={t.titelHilfe}>{t.titel}</Erklaert>
        </h3>
        <FilmKnopf nr="T-L14" />
      </div>
      <ul className="m-0 mt-3 list-none space-y-2 p-0">
        {sortiert.map((h) => (
          <li key={h.datei} className="rounded-xl border border-hairline p-3">
            <HandbuchKnopf handbuch={h} />
          </li>
        ))}
      </ul>
      {ohne.length > 0 && sprache === "de" && (
        <p className="m-0 mt-3 text-sm text-ink-muted">
          Für {ohne.map((p) => p.label).join(" und ")} gibt es noch kein
          Handbuch. Die Hilfe im Programm selbst erklärt dort alle Funktionen.
        </p>
      )}
      {/* Englisch: die Namen der Apps bleiben deutsch (Glossar §2) und
          stehen in `lang="de"`, damit eine Sprachausgabe sie deutsch spricht. */}
      {ohne.length > 0 && sprache === "en" && (
        <p className="m-0 mt-3 text-sm text-ink-muted">
          There is no guide for{" "}
          {ohne.map((p, i) => (
            <span key={p.key}>
              {i > 0 ? (i === ohne.length - 1 ? " and " : ", ") : ""}
              <span lang="de">{p.label}</span>
            </span>
          ))}{" "}
          yet. The help inside each app explains all its features.
        </p>
      )}
      {/* ★ E11a-5 (26.09.2026): dasselbe auf Französisch - bis dahin stand
          hier für „fr" gar nichts (die Zeile prüfte nur „de" und „en"). */}
      {ohne.length > 0 && sprache === "fr" && (
        <p className="m-0 mt-3 text-sm text-ink-muted">
          Il n'existe pas encore de guide pour{" "}
          {ohne.map((p, i) => (
            <span key={p.key}>
              {i > 0 ? (i === ohne.length - 1 ? " et " : ", ") : ""}
              <span lang="de">{p.label}</span>
            </span>
          ))}
          . L'aide de chaque application en explique toutes les fonctions.
        </p>
      )}
      {/* ★ ES-O (27.09.2026): dasselbe auf Spanisch - sonst stand hier nichts. */}
      {ohne.length > 0 && sprache === "es" && (
        <p className="m-0 mt-3 text-sm text-ink-muted">
          Todavía no hay guía para{" "}
          {ohne.map((p, i) => (
            <span key={p.key}>
              {i > 0 ? (i === ohne.length - 1 ? " y " : ", ") : ""}
              <span lang="de">{p.label}</span>
            </span>
          ))}
          . La ayuda de cada aplicación explica todas sus funciones.
        </p>
      )}
      {/* ★ O-IT (02.10.2026): dasselbe auf Italienisch. */}
      {ohne.length > 0 && sprache === "it" && (
        <p className="m-0 mt-3 text-sm text-ink-muted">
          Non c'è ancora una guida per{" "}
          {ohne.map((p, i) => (
            <span key={p.key}>
              {i > 0 ? (i === ohne.length - 1 ? " e " : ", ") : ""}
              <span lang="de">{p.label}</span>
            </span>
          ))}
          . L'aiuto di ogni programma ne spiega tutte le funzioni.
        </p>
      )}
      {/* ★ O-PL (02.10.2026): dasselbe auf Polnisch - die Namen nach einem
          Doppelpunkt, damit sie im Nominativ bleiben (Glossar Regel 11). */}
      {ohne.length > 0 && sprache === "pl" && (
        <p className="m-0 mt-3 text-sm text-ink-muted">
          Nie ma jeszcze podręcznika do programów:{" "}
          {ohne.map((p, i) => (
            <span key={p.key}>
              {i > 0 ? (i === ohne.length - 1 ? " i " : ", ") : ""}
              <span lang="de">{p.label}</span>
            </span>
          ))}
          . Pomoc w każdym programie wyjaśnia wszystkie jego funkcje.
        </p>
      )}
      {/* ★ O-TR (02.10.2026): dasselbe auf Türkisch - die Namen nach einem
          Doppelpunkt, ohne Endung (Glossar Regel 6), Aufzählung mit "ve". */}
      {ohne.length > 0 && sprache === "tr" && (
        <p className="m-0 mt-3 text-sm text-ink-muted">
          Henüz öğretmen kılavuzu olmayan programlar:{" "}
          {ohne.map((p, i) => (
            <span key={p.key}>
              {i > 0 ? (i === ohne.length - 1 ? " ve " : ", ") : ""}
              <span lang="de">{p.label}</span>
            </span>
          ))}
          . Her programın kendi yardımı, programın tüm özelliklerini açıklar.
        </p>
      )}
      {/* ★ O-CS (03.10.2026): dasselbe auf Tschechisch - die Namen nach einem
          Doppelpunkt, damit sie nicht gebeugt werden (Glossar Regel 12). */}
      {ohne.length > 0 && sprache === "cs" && (
        <p className="m-0 mt-3 text-sm text-ink-muted">
          Programy, ke kterým zatím není příručka:{" "}
          {ohne.map((p, i) => (
            <span key={p.key}>
              {i > 0 ? (i === ohne.length - 1 ? " a " : ", ") : ""}
              <span lang="de">{p.label}</span>
            </span>
          ))}
          . Nápověda v každém programu vysvětluje všechny jeho funkce.
        </p>
      )}
    </section>
  );
}
