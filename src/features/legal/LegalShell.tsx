import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { SkipLink } from "@/lib/a11y";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { hierIstTastenflow, type Herkunft } from "@/lib/adressen";
import { texte, useBedienSprache, waehleUebersetzung } from "@/lib/bedienSprache";

/*
 * ★ EN8 (19.09.2026): Der Rahmen der Rechtstexte folgt der Bedienungssprache
 * von Tastenflow (Gruppe B in `TastenflowSprachBereich`: wer aus Tastenflow
 * kommt oder unter tastenflow.org ist). Ohne aktiven Sprach-Anbieter bleibt
 * alles Zeichen für Zeichen deutsch - die übrige Plattform merkt nichts.
 * Die Texte der Seiten selbst stehen je Sprache in einer eigenen Datei
 * (`Datenschutz.en.tsx` …), siehe dort.
 */
const T = texte({
  de: {
    markeTastenflow: "Tastenflow Lernapp",
    markePlattform: "Sensorik Lernplattform",
    anmelden: "Anmelden",
    sprungmarke: "Zum Hauptinhalt springen",
    abschnitte: "Abschnitte dieser Seite",
    // In Teilen wie vorher im JSX (`Auf dieser Seite ({n})`): gleiche Textknoten.
    aufDieserSeite: (n: number) => ["Auf dieser Seite (", n, ")"],
    zurueck: "← Zurück",
  },
  en: {
    markeTastenflow: "Tastenflow learning app",
    markePlattform: "Sensorik learning platform",
    anmelden: "Sign in",
    sprungmarke: "Skip to main content",
    abschnitte: "Sections of this page",
    aufDieserSeite: (n: number) => ["On this page (", n, ")"],
    zurueck: "← Back",
  },
  fr: {
    markeTastenflow: "Programme d'apprentissage Tastenflow",
    markePlattform: "Plateforme d'apprentissage Sensorik",
    anmelden: "Se connecter",
    sprungmarke: "Aller au contenu principal",
    abschnitte: "Sections de cette page",
    aufDieserSeite: (n: number) => ["Sur cette page (", n, ")"],
    zurueck: "← Retour",
  },
  es: {
    markeTastenflow: "Programa de aprendizaje Tastenflow",
    markePlattform: "Plataforma de aprendizaje Sensorik",
    anmelden: "Iniciar sesión",
    sprungmarke: "Ir al contenido principal",
    abschnitte: "Secciones de esta página",
    aufDieserSeite: (n: number) => ["En esta página (", n, ")"],
    zurueck: "← Volver",
  },
  it: {
    markeTastenflow: "App di apprendimento Tastenflow",
    markePlattform: "Piattaforma di apprendimento Sensorik",
    anmelden: "Accedi",
    sprungmarke: "Vai al contenuto principale",
    abschnitte: "Sezioni di questa pagina",
    aufDieserSeite: (n: number) => ["In questa pagina (", n, ")"],
    zurueck: "← Indietro",
  },
  // ★ O-PL (02.10.2026): polnisch (Glossar §2.5/§2.7: „Zaloguj się", „Platforma edukacyjna").
  pl: {
    markeTastenflow: "Aplikacja do nauki Tastenflow",
    markePlattform: "Platforma edukacyjna Sensorik",
    anmelden: "Zaloguj się",
    sprungmarke: "Przejdź do treści głównej",
    abschnitte: "Części tej strony",
    aufDieserSeite: (n: number) => ["Na tej stronie (", n, ")"],
    zurueck: "← Wstecz",
  },
  // ★ O-TR (02.10.2026): türkisch (Glossar §2.5/§2.7: "Giriş yap"; "Geri" nie allein, §4 Nr. 8).
  tr: {
    markeTastenflow: "Tastenflow öğrenme uygulaması",
    markePlattform: "Sensorik öğrenme platformu",
    anmelden: "Giriş yap",
    sprungmarke: "Ana içeriğe geç",
    abschnitte: "Bu sayfanın bölümleri",
    aufDieserSeite: (n: number) => ["Bu sayfada (", n, ")"],
    zurueck: "← Geri dön",
  },
  // ★ O-CS (03.10.2026): tschechisch (Glossar §2.5/§2.7: „Přihlásit se", Knopf „Zpět", Abschnitt = „oddíl").
  cs: {
    markeTastenflow: "Výuková aplikace Tastenflow",
    markePlattform: "Výuková platforma Sensorik",
    anmelden: "Přihlásit se",
    sprungmarke: "Přejít na hlavní obsah",
    abschnitte: "Oddíly této stránky",
    aufDieserSeite: (n: number) => ["Na této stránce (", n, ")"],
    zurueck: "← Zpět",
  },
  bg: {
    markeTastenflow: "Приложение за обучение Tastenflow",
    markePlattform: "Платформа за обучение Sensorik",
    anmelden: "Влез",
    sprungmarke: "Към основното съдържание",
    abschnitte: "Раздели на тази страница",
    aufDieserSeite: (n: number) => ["На тази страница (", n, ")"],
    zurueck: "← Обратно",
  },
  el: {
    markeTastenflow: "Εφαρμογή μάθησης Tastenflow",
    markePlattform: "Πλατφόρμα μάθησης Sensorik",
    anmelden: "Σύνδεση",
    sprungmarke: "Μετάβαση στο κύριο περιεχόμενο",
    abschnitte: "Ενότητες αυτής της σελίδας",
    aufDieserSeite: (n: number) => ["Σε αυτή τη σελίδα (", n, ")"],
    zurueck: "← Πίσω",
  },
  hu: {
    markeTastenflow: "Tastenflow tanulási alkalmazás",
    markePlattform: "Sensorik tanulási platform",
    anmelden: "Bejelentkezés",
    sprungmarke: "Ugrás a fő tartalomra",
    abschnitte: "Az oldal részei",
    aufDieserSeite: (n: number) => ["Ezen az oldalon (", n, ")"],
    zurueck: "← Vissza",
  },
  nl: {
    markeTastenflow: "Leerapp Tastenflow",
    markePlattform: "Leerplatform Sensorik",
    anmelden: "Inloggen",
    sprungmarke: "Naar de hoofdinhoud",
    abschnitte: "Delen van deze pagina",
    aufDieserSeite: (n: number) => ["Op deze pagina (", n, ")"],
    zurueck: "← Terug",
  },
  pt: {
    markeTastenflow: "Aplicação de aprendizagem Tastenflow",
    markePlattform: "Plataforma de aprendizagem Sensorik",
    anmelden: "Iniciar sessão",
    sprungmarke: "Ir para o conteúdo principal",
    abschnitte: "Secções desta página",
    aufDieserSeite: (n: number) => ["Nesta página (", n, ")"],
    zurueck: "← Voltar",
  },
  br: {
    markeTastenflow: "Aplicativo de aprendizagem Tastenflow",
    markePlattform: "Plataforma de aprendizagem Sensorik",
    anmelden: "Entrar",
    sprungmarke: "Ir para o conteúdo principal",
    abschnitte: "Seções desta página",
    aufDieserSeite: (n: number) => ["Nesta página (", n, ")"],
    zurueck: "← Voltar",
  },
  ro: {
    markeTastenflow: "Aplicația de învățare Tastenflow",
    markePlattform: "Platforma de învățare Sensorik",
    anmelden: "Conectați-vă",
    sprungmarke: "Mergeți la conținutul principal",
    abschnitte: "Secțiunile acestei pagini",
    aufDieserSeite: (n: number) => ["Pe această pagină (", n, ")"],
    zurueck: "← Înapoi",
  },
  sv: {
    markeTastenflow: "Lärappen Tastenflow",
    markePlattform: "Lärplattformen Sensorik",
    anmelden: "Logga in",
    sprungmarke: "Gå till huvudinnehållet",
    abschnitte: "Avsnitt på den här sidan",
    aufDieserSeite: (n: number) => ["På den här sidan (", n, ")"],
    zurueck: "← Tillbaka",
  },
  uk: {
    markeTastenflow: "Навчальний застосунок Tastenflow",
    markePlattform: "Навчальна платформа Sensorik",
    anmelden: "Увійти",
    sprungmarke: "Перейти до основного вмісту",
    abschnitte: "Розділи цієї сторінки",
    aufDieserSeite: (n: number) => ["На цій сторінці (", n, ")"],
    zurueck: "← Назад",
  },
});

/**
 * ★★ Der Pflichtsatz jeder englischen Rechtsseite (Auftrag EN8, Glossar §3.13):
 * Verbindlich ist die deutsche Fassung. Er steht direkt unter der Überschrift,
 * vor dem Inhaltsverzeichnis - wer die Seite liest, liest ihn zuerst.
 * Einen Sprachschalter hat diese Seite nicht (eigene Kopfleiste, keine
 * `AppKopfzeile`); der Weg zur deutschen Fassung ist der Schalter in Tastenflow.
 *
 * ⚠️ Bleibt WÖRTLICH unverändert (Wächter `tests/tastenflow-englisch-rechtstexte.test.tsx`).
 */
export const HINWEIS_DEUTSCH_VERBINDLICH =
  "This is a translation for your convenience. The German version is legally binding.";

/**
 * ★ E11b (26.09.2026): derselbe Pflichtsatz auf Französisch - ohne ihn zeigte
 * eine französische Rechtsseite (Impressum/Datenschutz/Barrierefreiheit)
 * unter der Überschrift weiterhin den ENGLISCHEN Satz, weil `sprache`
 * (oberflächen-sicher) für „fr" bis E11a-2 auf „en" abbildet - genau die
 * Falle, die `waehleUebersetzung` unten vermeidet.
 */
export const HINWEIS_DEUTSCH_VERBINDLICH_FR =
  "Ceci est une traduction fournie pour votre confort. La version allemande fait foi.";

/** ★ ES-O (27.09.2026): derselbe Pflichtsatz auf Spanisch (usted, wie „vous"). */
export const HINWEIS_DEUTSCH_VERBINDLICH_ES =
  "Esta traducción se ofrece a título informativo. Solo la versión alemana es jurídicamente vinculante.";

/** ★ O-IT (02.10.2026): derselbe Pflichtsatz auf Italienisch (Glossar §2.7). */
export const HINWEIS_DEUTSCH_VERBINDLICH_IT =
  "Questa è una traduzione di cortesia. Fa fede la versione tedesca.";

/** ★ O-PL (02.10.2026): derselbe Pflichtsatz auf Polnisch (Glossar §2.7). */
export const HINWEIS_DEUTSCH_VERBINDLICH_PL =
  "To jest tłumaczenie pomocnicze. Wiążąca jest wersja niemiecka.";

/** ★ O-TR (02.10.2026): derselbe Pflichtsatz auf Türkisch (Glossar §2.7). */
export const HINWEIS_DEUTSCH_VERBINDLICH_TR =
  "Bu metin bilgi amaçlı bir çeviridir. Geçerli olan Almanca metindir.";

/** ★ O-CS (03.10.2026): derselbe Pflichtsatz auf Tschechisch (Glossar §2.7). */
export const HINWEIS_DEUTSCH_VERBINDLICH_CS =
  "Toto je informativní překlad. Závazné je německé znění.";

/** ★ O-BG (29.10.2026): derselbe Pflichtsatz auf Bulgarisch (Glossar §2.7, wörtlich). */
export const HINWEIS_DEUTSCH_VERBINDLICH_BG =
  "Това е информативен превод. Валиден е текстът на немски език.";
/** ★ O-NL (25.10.2026): derselbe Pflichtsatz auf Niederländisch (Glossar §2.7). */
export const HINWEIS_DEUTSCH_VERBINDLICH_NL =
  "Dit is een vertaling ter informatie. De Duitse tekst is bindend.";
/** ★ O-PT (25.10.2026): derselbe Pflichtsatz auf Portugiesisch (Portugal, Glossar §2.7). */
export const HINWEIS_DEUTSCH_VERBINDLICH_PT =
  "Esta tradução é meramente informativa. Faz fé a versão alemã.";
/** ★ O-SV (25.10.2026): derselbe Pflichtsatz auf Schwedisch (Glossar §2.7). */
export const HINWEIS_DEUTSCH_VERBINDLICH_SV =
  "Detta är en översättning i informationssyfte. Den tyska versionen gäller.";
/** ★ O-UK (25.10.2026): derselbe Pflichtsatz auf Ukrainisch (Glossar §2.7, wörtlich). */
export const HINWEIS_DEUTSCH_VERBINDLICH_UK =
  "Це довідковий переклад. Юридичну силу має німецька версія.";
/** ★ O-EL (25.10.2026): derselbe Pflichtsatz auf Griechisch (Glossar §2.7). */
export const HINWEIS_DEUTSCH_VERBINDLICH_EL =
  "Αυτή είναι μια μετάφραση για ενημέρωση. Δεσμευτικό είναι το γερμανικό κείμενο.";
/** ★ O-BR (25.10.2026): derselbe Pflichtsatz auf Portugiesisch (Brasilien), wörtlich aus Glossar pt-BR §2.7. */
export const HINWEIS_DEUTSCH_VERBINDLICH_BR =
  "Esta é uma tradução para fins informativos. Vale a versão em alemão.";
/** ★ O-HU (25.10.2026): derselbe Pflichtsatz auf Ungarisch (Glossar §2.7). */
export const HINWEIS_DEUTSCH_VERBINDLICH_HU =
  "Ez tájékoztató jellegű fordítás. A német nyelvű szöveg az irányadó.";
/** ★ O-RO (25.10.2026): derselbe Pflichtsatz auf Rumänisch (Glossar §2.7). */
export const HINWEIS_DEUTSCH_VERBINDLICH_RO =
  "Aceasta este o traducere cu titlu informativ. Prevalează versiunea în limba germană.";

/** Aus einer Überschrift eine stabile Sprungmarke machen. */
function marke(text: string): string {
  const ersatz: Record<string, string> = {
    "ä": "ae",
    "ö": "oe",
    "ü": "ue",
    "ß": "ss",
  };
  // ★ SPRACHEN-9 (29.10.2026, Fund O-HILFE-UK): kyrillische und griechische Überschriften (bg, uk, el) wurden mit der
  // lateinischen Regel unten zu „abschnitt-" - jede Sprungmarke einer Seite gleich. Für sie bleiben die Buchstaben stehen
  // (in HTML eine gültige id). Eine Überschrift ohne Kyrillisch/Griechisch geht den alten Weg - deren Marken ändern sich nicht.
  if (/[\p{Script=Cyrillic}\p{Script=Greek}]/u.test(text)) {
    return (
      "abschnitt-" +
      text
        .toLocaleLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60)
    );
  }
  return (
    "abschnitt-" +
    text
      .toLowerCase()
      .replace(/[äöüß]/g, (z) => ersatz[z] ?? z)
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60)
  );
}

export function LegalShell({
  title,
  children,
  herkunft,
}: {
  title: string;
  children: ReactNode;
  /** Nur für Tests: die laufende Adresse vorgeben. */
  herkunft?: Herkunft;
}) {
  /*
   * Der Kopf-Verweis führt zur Wurzel der LAUFENDEN Adresse - und die ist auf
   * tastenflow.org die Tastenflow-App, nicht die Plattform. Das Etikett muss
   * sagen, wohin der Weg führt (Johannes 24.08.): dort „Tastenflow Lernapp",
   * sonst „Sensorik Lernplattform".
   *
   * ★ 05.09.2026: Der Name stand hier als „<sr-only>S</sr-only>ensorik", weil
   * das Braille-Logo optisch als S gemeint war. Wer sieht, las „ensorik" - die
   * Zelle wird nicht als Buchstabe gelesen. Jetzt steht der Name überall ganz
   * da, das Logo ist reine Zier (so, wie es bei Tastenflow schon war).
   */
  const tastenflow = hierIstTastenflow(herkunft);
  /*
   * ★ E11b (26.09.2026): `spracheGewaehlt` statt der oberflächen-sicheren
   * `sprache` - `T` hat seit je ein „fr" (`texte({de,en,fr})`), aber `sprache`
   * bildet „fr" bis E11a-2 auf „en" ab (`oberflaechenSprache`). Mit `sprache`
   * blieb dieses „fr" darum unerreichbar: die Kopfzeile dieser Seiten (Marke,
   * Sprungmarke, „Zurück") zeigte für eine Person, die „fr" gewählt hat,
   * bisher Englisch. Der Pflichtsatz unten (§ Pflichtsatz) hatte dieselbe
   * Falle.
   */
  const { spracheGewaehlt } = useBedienSprache();
  const t = T[spracheGewaehlt];
  const hinweisVerbindlich = waehleUebersetzung(spracheGewaehlt, {
    en: HINWEIS_DEUTSCH_VERBINDLICH,
    fr: HINWEIS_DEUTSCH_VERBINDLICH_FR,
    es: HINWEIS_DEUTSCH_VERBINDLICH_ES,
    it: HINWEIS_DEUTSCH_VERBINDLICH_IT,
    pl: HINWEIS_DEUTSCH_VERBINDLICH_PL,
    tr: HINWEIS_DEUTSCH_VERBINDLICH_TR,
    cs: HINWEIS_DEUTSCH_VERBINDLICH_CS,
    // ★ O-NL (25.10.2026)
    nl: HINWEIS_DEUTSCH_VERBINDLICH_NL,
    // ★ O-PT (25.10.2026)
    pt: HINWEIS_DEUTSCH_VERBINDLICH_PT,
    sv: HINWEIS_DEUTSCH_VERBINDLICH_SV, // ★ O-SV (25.10.2026)
    uk: HINWEIS_DEUTSCH_VERBINDLICH_UK, // ★ O-UK (25.10.2026)
    bg: HINWEIS_DEUTSCH_VERBINDLICH_BG, // ★ O-BG (29.10.2026): die Konstante allein reichte nicht - ohne diese Zeile stand der englische Satz da
    // ★ O-EL (25.10.2026)
    el: HINWEIS_DEUTSCH_VERBINDLICH_EL,
    // ★ O-BR (25.10.2026): portugiesisch (Brasilien).
    br: HINWEIS_DEUTSCH_VERBINDLICH_BR,
    // ★ O-HU (25.10.2026)
    hu: HINWEIS_DEUTSCH_VERBINDLICH_HU,
    ro: HINWEIS_DEUTSCH_VERBINDLICH_RO, // ★ O-RO (25.10.2026)
  });

  /*
   * ★ 05.09.2026 (Johannes: „das impressum und der datenschutz sind vom layout
   * sehr schmal"). Gemessen auf 1600 px: Der Text stand in 685 px, also 43 %
   * der Fläche - und die Datenschutzerklärung ist 6.428 px hoch.
   *
   * Die Breite einfach hochzudrehen wäre ein Rückschritt gewesen: Bei 1200 px
   * stünden hier Zeilen mit rund 140 Zeichen, und gerade auf dieser Plattform
   * ist die Zeilenlänge kein Geschmack, sondern Lesbarkeit. Stattdessen trägt
   * die gewonnene Fläche jetzt ein Inhaltsverzeichnis: Bei einer sechs
   * Bildschirmhöhen langen Rechtsseite ist Springen mehr wert als Scrollen.
   *
   * Die Abschnitte werden zur Laufzeit aus den `h2` gelesen - so kann keine
   * Liste veralten, wenn jemand einen Abschnitt ergänzt.
   */
  const inhalt = useRef<HTMLDivElement>(null);
  const [abschnitte, setAbschnitte] = useState<{ id: string; text: string }[]>([]);

  /*
   * Auf breiten Schirmen steht das Verzeichnis offen daneben. Auf dem Handy
   * stünde es ÜBER dem Text - bei 15 Abschnitten (Datenschutz) wäre das die
   * ganze erste Bildschirmseite, bevor ein Wort Inhalt kommt. Dort also
   * zugeklappt. Der Zustand liegt in `useState` mit `onToggle`, damit ein
   * Re-Render ihn nicht wieder überschreibt.
   */
  const [offen, setOffen] = useState(() =>
    typeof window === "undefined"
      ? true
      : window.matchMedia("(min-width: 1024px)").matches,
  );

  useEffect(() => {
    const wurzel = inhalt.current;
    if (!wurzel) return;
    const gefunden: { id: string; text: string }[] = [];
    wurzel.querySelectorAll("h2").forEach((h) => {
      const text = (h.textContent ?? "").trim();
      if (!text) return;
      if (!h.id) h.id = marke(text);
      // Sonst klebt die Überschrift beim Springen ganz oben am Rand.
      h.style.scrollMarginTop = "1.5rem";
      // Damit der Fokus auf der Überschrift landen KANN (siehe `springe`):
      // ohne tabindex nimmt sie ihn nicht an, und die Sprachausgabe läse
      // weiter an der alten Stelle.
      h.tabIndex = -1;
      gefunden.push({ id: h.id, text });
    });
    setAbschnitte(gefunden);
  }, [children]);

  /*
   * ⚠️ Gemessen 05.09.2026: Ein blosses `href="#marke"` setzt hier zwar den
   * Hash, aber die Seite springt NICHT - der Router fängt die Navigation ab.
   * Und selbst wenn sie spränge, wanderte der Fokus nicht mit: Die
   * Sprachausgabe läse weiter an der alten Stelle, während das Auge schon
   * unten ist. Deshalb beides von Hand - scrollen UND fokussieren.
   */
  function springe(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    const ziel = document.getElementById(id);
    if (!ziel) return; // Dann macht der Browser, was er kann.
    e.preventDefault();
    // ⚠️ Reihenfolge gemessen: Erst scrollen, dann fokussieren bricht das
    // weiche Scrollen ab - die Überschrift blieb 624 px unter dem Rand
    // stehen. Erst den Fokus setzen (ohne selbst zu scrollen), dann scrollen.
    ziel.focus({ preventScroll: true });
    ziel.scrollIntoView({
      // Wer Bewegung reduziert haben will, bekommt den Sprung ohne Animation.
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
    history.replaceState(null, "", `#${id}`);
  }

  return (
    <div className="min-h-screen">
      <SkipLink>{t.sprungmarke}</SkipLink>
      <header className="border-b border-hairline/70 bg-surface/80 backdrop-blur-xl">
        {/* `flex-wrap` + `min-w-0`: Auf 375 px stand die Marke zweizeilig und
            „Anmelden" wurde rechts abgeschnitten (gemessen 05.09.). */}
        <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-x-4 gap-y-2 px-2 sm:px-4 lg:px-6 py-3">
          <Link to="/" className="flex min-w-0 items-center gap-1.5 font-semibold">
            <Logo className="h-8 w-8 shrink-0" />
            {tastenflow ? (
              <span>{t.markeTastenflow}</span>
            ) : (
              <span>{t.markePlattform}</span>
            )}
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/login"
              className="text-sm text-accent underline underline-offset-2"
            >
              {t.anmelden}
            </Link>
          </div>
        </div>
      </header>

      <main id="hauptinhalt" className="mx-auto max-w-content px-4 py-10 sm:px-6">
        <h1 id="seitentitel" className="text-3xl font-semibold tracking-tight">
          {title}
        </h1>
        {hinweisVerbindlich && (
          <p className="mt-4 max-w-[75ch] rounded-lg border border-hairline/60 bg-surface-raised px-3 py-2 text-sm">
            {hinweisVerbindlich}
          </p>
        )}

        {/*
          Das Verzeichnis steht im Text-Fluss VOR dem Inhalt - wer mit der
          Tastatur oder einer Sprachausgabe kommt, findet es dort, wo es nützt.
          Auf breiten Schirmen rückt es per Grid nach rechts daneben.
        */}
        <div className="mt-8 grid gap-x-10 gap-y-6 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-start">
          {abschnitte.length >= 3 ? (
            <nav
              aria-label={t.abschnitte}
              className="order-first lg:order-last lg:sticky lg:top-6"
            >
              <details
                open={offen}
                onToggle={(e) => setOffen((e.currentTarget as HTMLDetailsElement).open)}
                className="rounded-xl border border-hairline/60 bg-surface-raised p-3"
              >
                <summary className="cursor-pointer list-none px-2 py-1 text-xs font-semibold uppercase tracking-wide text-ink-muted marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                  {t.aufDieserSeite(abschnitte.length)}
                </summary>
                <ol className="mt-2 space-y-1.5 text-sm">
                  {abschnitte.map((a) => (
                    <li key={a.id}>
                      <a
                        href={`#${a.id}`}
                        onClick={(e) => springe(e, a.id)}
                        className="block rounded px-2 py-1 text-ink-muted hover:bg-surface-sunken hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      >
                        {a.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </details>
            </nav>
          ) : null}

          {/*
            Der Fliesstext bleibt bei rund 75 Zeichen je Zeile. Der Rahmen ist
            weit, der Text schmal - dieselbe Bauart wie in den Simulationen.
          */}
          <div ref={inhalt} className="ce-content max-w-[75ch] space-y-4">
            {children}
          </div>
        </div>

        <p className="mt-10">
          <Link to="/" className="text-accent underline underline-offset-2">
            {t.zurueck}
          </Link>
        </p>
      </main>
    </div>
  );
}
