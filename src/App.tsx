import {   useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { useAuth } from "@/state/auth";
import { AnnounceProvider, FocusOnRouteChange } from "@/lib/a11y";
import { Spinner } from "@/components/Spinner";
import { TastenflowSprachBereich } from "@/features/public/TastenflowSprachBereich";
import {
  KLASSE_VERWALTEN_PFAD,
  MEINE_KLASSE_PFAD,
  MEINE_KLASSE_PFAD_ALT,
  
  
  meineKlasseHref,
} from "@/lib/adressen";
import { faul, vorladen } from "@/lib/seiteNachladen";
const Datenschutz = /* @__PURE__ */ faul(() => import("@/features/legal/Datenschutz").then((m) => ({ default: m.Datenschutz })));
const Impressum = /* @__PURE__ */ faul(() => import("@/features/legal/Impressum").then((m) => ({ default: m.Impressum })));
const Barrierefreiheit = /* @__PURE__ */ faul(() => import("@/features/legal/Barrierefreiheit").then((m) => ({ default: m.Barrierefreiheit })));
const NotFound = /* @__PURE__ */ faul(() => import("@/features/legal/NotFound").then((m) => ({ default: m.NotFound })));
const LernprogrammPasswortPage = /* @__PURE__ */ faul(() => import("@/features/public/LernprogrammPasswortPage").then((m) => ({ default: m.LernprogrammPasswortPage })));
const LernprogrammBestaetigenPage = /* @__PURE__ */ faul(() => import("@/features/public/LernprogrammBestaetigenPage").then((m) => ({ default: m.LernprogrammBestaetigenPage })));
const LernwerkstattEinladungPage = /* @__PURE__ */ faul(() => import("@/features/public/LernwerkstattEinladungPage").then((m) => ({ default: m.LernwerkstattEinladungPage })));
const LernwerkstattKontoPage = /* @__PURE__ */ faul(() => import("@/features/public/LernwerkstattKontoPage").then((m) => ({ default: m.LernwerkstattKontoPage })));
const TippenTrainerPage = /* @__PURE__ */ faul(() => import("@/features/public/TippenTrainerPage").then((m) => ({ default: m.TippenTrainerPage })));
const MeineKlassePage = /* @__PURE__ */ faul(() => import("@/features/public/MeineKlassePage").then((m) => ({ default: m.MeineKlassePage })));
import { TitelHinweis } from "@/components/TitelHinweis";

function Root() {
  const location = useLocation();
  return (
    // ★ EN0 (18.09.2026): Die Bedienungssprache von Tastenflow hängt HIER, einmal
    // für die ganze App - ÜBER dem `key={location.key}`, damit sie keine
    // Navigation neu aufbaut. Welche Adressen zu Tastenflow gehören (und alle
    // anderen bleiben unberührt deutsch), steht im Kopf von
    // `features/public/TastenflowSprachBereich.tsx`.
    <TastenflowSprachBereich>
      <FocusOnRouteChange />
      <div key={location.key} className="page-transition">
        <Outlet />
      </div>
    </TastenflowSprachBereich>
  );
}

/** Die Startseite des Pakets IST Tastenflow. */
function StartSeite() {
  return <TippenTrainerPage />;
}


/** Unbekannte Adresse: „Seite nicht gefunden". */
function UnbekannteSeite() {
  return <NotFound />;
}
UnbekannteSeite.vorladen = () => NotFound.vorladen();
StartSeite.vorladen = () => TippenTrainerPage.vorladen();

/**
 * Weiterleitung von einer ALT-Adresse eines Lernprogramms auf die neue.
 *
 * Am 03.08.2026 haben die Programme Adressen nach ihrem echten Namen bekommen
 * (/programme/tippen → /programme/tastenflow …). Alte Links leben aber weiter:
 * in verschickten Mails, in Moodle, in Lesezeichen der Kinder, auf Handzetteln.
 * Sie müssen alle ankommen.
 *
 * ⚠️ NICHT durch `<Navigate to="…">` ersetzen: Das verwirft `?`-Parameter und
 * `#`-Anker. Genau daran hängen aber die Arbeitsheft-Einbettungen
 * (`?level=3&bare=1`) und der Klassen-Beitritt — ohne sie landet man in einer
 * leeren App statt an der gemeinten Stelle.
 */
function AltAdresse({ nach }: { nach: string }) {
  const { search, hash } = useLocation();
  return <Navigate to={`${nach}${search}${hash}`} replace />;
}


/**
 * Die alte Adresse von „Meine Klassen" (`/lernwerkstatt/klasse`) leitet auf die
 * Adresse um, die zum Rechnernamen passt (F9, 01.09.2026).
 *
 * ⚠️ KEINE SCHLEIFE MÖGLICH: `meineKlasseHref()` liefert entweder
 * `/meine-klasse` oder `/lernwerkstatt/<programm>/klasse` - nie den Pfad,
 * unter dem diese Komponente selbst hängt. Ohne bekanntes Programm ist das
 * Ziel `/meine-klasse`, und die Route gibt es auf beiden Rechnernamen.
 */
function AlteKlassenAdresse() {
  const { search, hash } = useLocation();
  const anhang = new URLSearchParams(search);
  const ziel = meineKlasseHref(anhang.get("app"), anhang.get("klasse"));
  // Was sonst noch im Anhang stand (z. B. `reiter=`), darf nicht verloren
  // gehen - `meineKlasseHref` kennt nur die zwei Angaben, die es braucht.
  const rest = new URLSearchParams(search);
  rest.delete("app");
  rest.delete("klasse");
  const trenner = ziel.includes("?") ? "&" : "?";
  const zusatz = rest.toString() ? trenner + rest.toString() : "";
  return <Navigate to={`${ziel}${zusatz}${hash}`} replace />;
}

/**
 * Alt-Adresse → neue Adresse. Bewusst NICHT aus ALL_PROGRAMS abgeleitet: Die
 * Liste ist ein historisches Verzeichnis und muss auch dann noch stimmen, wenn
 * ein Programm später wieder umgezogen oder abgeschaltet wird.
 *
 * ⚠️ `/programme/braille` steht bewusst NICHT hier — der Pfad bleibt eine echte
 * Seite (eingefroren für die Arbeitsheft-Embeds), er wird nicht weitergeleitet.
 * Für Suchmaschinen zeigt sein canonical-Tag auf /programme/punktgenau.
 */
export const ALTE_PROGRAMM_ADRESSEN: Record<string, string> = {
  "/programme/tippen": "/programme/tastenflow",
};

const altAdressRouten = Object.entries(ALTE_PROGRAMM_ADRESSEN).map(([alt, neu]) => ({
  path: alt,
  element: <AltAdresse nach={neu} />,
}));

export const routes = [
  {
    element: <Root />,
    children: [
      { path: "/", element: <StartSeite /> },
      { path: "/lernwerkstatt", element: <Navigate to="/" replace /> },
      // Die englische Einstiegsadresse (23.09.2026): unter tastenflow.org der
      // Trainer in englischer Bedienung (`adressWahlLesen`), sonst die Startseite.
      // Die englische Link-Vorschau dazu liefert der Server (`englischHandler`).
      { path: "/en", element: <StartSeite /> },
      // Die französische Einstiegsadresse (E11c, 26.09.2026) - wie `/en`. Die
      // Bedienung wird hier nur MIT dem Schalter des französischen Lehrgangs
      // französisch (`adressWahlLesen`, Bauplan F16); die Link-Vorschau liefert
      // der Server (`franzoesischHandler`).
      { path: "/fr", element: <StartSeite /> },
      // Die spanische Einstiegsadresse (27.09.2026, wie `/fr` scharf geschaltet) -
      // wie `/en`/`/fr`. Die Bedienung wird hier nur MIT dem Schalter des
      // spanischen Lehrgangs spanisch (`adressWahlLesen`); die Link-Vorschau
      // liefert der Server (`spanischHandler`).
      { path: "/es", element: <StartSeite /> },
      // Die Einstiegsadressen der vier neuen Sprachen (10.10.2026) - wie `/es`.
      { path: "/it", element: <StartSeite /> },
      { path: "/pl", element: <StartSeite /> },
      { path: "/tr", element: <StartSeite /> },
      { path: "/cs", element: <StartSeite /> },
      // ★ G2-NEUN (25.10.2026): die Einstiegsadressen der neun Wege des Gerüsts (`/pt-br` ⇒ „br"). Ohne den Schalter
      // der Sprache (Vorgabe aus) ist das die gewöhnliche Startseite - die Bedienung wird NUR mit ihm umgestellt.
      { path: "/bg", element: <StartSeite /> },
      { path: "/el", element: <StartSeite /> },
      { path: "/hu", element: <StartSeite /> },
      { path: "/nl", element: <StartSeite /> },
      { path: "/pt", element: <StartSeite /> },
      { path: "/pt-br", element: <StartSeite /> },
      { path: "/ro", element: <StartSeite /> },
      { path: "/sv", element: <StartSeite /> },
      { path: "/uk", element: <StartSeite /> },
      { path: "/lernprogramm-passwort", element: <LernprogrammPasswortPage /> },
      // Bestätigungs-Links aus den Mails (Konto, Lehrkraft, Adresswechsel) und
      // der Kontobereich der Selbstlernenden — beides seit 09.08.2026.
      { path: "/lernprogramm-bestaetigen", element: <LernprogrammBestaetigenPage /> },
      { path: "/lernwerkstatt/konto", element: <LernwerkstattKontoPage /> },
      // Landeplatz der Kollegen-Einladung (14.09.2026) - Link aus der Mail,
      // die tt_coteacher_lib.pb.js verschickt, wenn die eingegebene E-Mail
      // noch kein tt_teachers-Konto hat.
      { path: "/lernwerkstatt-einladung", element: <LernwerkstattEinladungPage /> },
      { path: "/programme/tastenflow", element: <TippenTrainerPage /> },
      // Das Musterblatt (Etappe M5) - NUR auf dem Entwicklungsrechner.
      // ⚠️ `import.meta.env.DEV` ist beim Bauen eine Konstante: Vite ersetzt sie
      // durch `false`, und der Zweig samt Seite fällt aus dem ausgelieferten
      // Bündel heraus. Auf dem Server gibt es diesen Pfad also nicht - er läuft
      // in dieselbe „Diese Seite gibt es nicht"-Antwort wie jeder andere
      // unbekannte Pfad. Das ist Absicht: Das Musterblatt ist zum Anschauen da,
      // nicht zum Ausliefern, und der ganze Bereich ist geschlossen
      // (Bauplan §3).
      ...(import.meta.env.DEV
        ? []
        : []),
      // Alt-Adressen der Programme (bis 03.08.2026) — leiten auf die neuen
      // weiter, damit verschickte Links und Lesezeichen weiter ankommen.
      ...altAdressRouten,
      // „Meine Klassen" — EIN Lehrkraft-Bereich für alle vier Lernprogramme
      // (Bauplan Sensorik/BAUPLAN-2026-08-03-MEINE-KLASSE.md). Parameter:
      // ?app=<tippen|braille|klangpunkte|computer>&klasse=<Beitritts-Code>
      // ★ ZWEI ADRESSEN, JE NACH RECHNERNAMEN (F9, 01.09.2026)
      //   tastenflow.org  ⇒ /meine-klasse
      //   weingartner.org ⇒ /lernwerkstatt/<programm>/klasse
      // Beide zeigen DIESELBE Seite - es gibt weiterhin genau einen
      // Lehrkraft-Bereich. Nur der Weg dorthin heisst je nach Rechnernamen
      // anders. Die Wahl trifft `meineKlasseHref()` in `lib/adressen.ts`.
      { path: MEINE_KLASSE_PFAD, element: <MeineKlassePage /> },
      { path: "/lernwerkstatt/:programm/klasse", element: <MeineKlassePage /> },
      // ★ „Kinder und Zugänge" (09.09.2026, Umschalter seit E2 18.09.2026) -
      // Kinder, Passwörter, Beitritts-Code, Co-Lehrkräfte, Druckliste und die
      // Handbücher. Bis 09.09. war das der Reiter „Klasse & Konten" zwischen
      // den Programmen; jetzt ein eigener Bildschirm, erreichbar über den
      // Umschalter „Lernstand | Kinder und Zugänge" im Klassenkopf (nicht mehr
      // über einen eigenen Knopf). Warum, steht in `lib/adressen.ts`.
      // ⚠️ DIESELBE Seite, nur ein anderer Modus - eine zweite Komponente wäre
      // eine zweite Stelle für Anmeldung, Klassen- und Kinder-Laden.
      { path: KLASSE_VERWALTEN_PFAD, element: <MeineKlassePage verwalten /> },
      // Die alte, gemeinsame Adresse bleibt und LEITET UM - verschickte Links,
      // Lesezeichen und die Hilfe-Texte der anderen vier Programme kommen
      // weiter an. Anhang (`?app=`, `?klasse=`) wandert mit.
      { path: MEINE_KLASSE_PFAD_ALT, element: <AlteKlassenAdresse /> },
      // Rückwärts-Kompatibilität: altes Hörbuch-Studio (wurde als static-HTML
      // unter /hoerbuch-studio.html angeboten, Desktop-Shortcuts existieren)
      { path: "/hoerbuch-studio", element: <Navigate to="/programme/hoerbuch-studio" replace /> },
      { path: "/datenschutz", element: <Datenschutz /> },
      { path: "/impressum", element: <Impressum /> },
      { path: "/barrierefreiheit", element: <Barrierefreiheit /> },
      { path: "*", element: <UnbekannteSeite /> },
    ],
  },
];

const router = createBrowserRouter(routes);

// Die Datei der aufgerufenen Seite gleich anfordern - parallel zum Start der
// Anmeldung (`init` unten), nicht erst danach (lib/seiteNachladen.tsx).
vorladen(router.state.matches.map((m) => (m.route as { element?: unknown }).element));

export function App() {
  const init = useAuth((s) => s.init);
  const status = useAuth((s) => s.status);
  useEffect(() => {
    void init();
  }, [init]);

  if (status === "loading") {
    return (
      <div className="grid min-h-screen place-items-center">
        {/* ★ NVDA-Prüfung Lexami 15.11.2026: „Lernplattform passt nicht zu Lexami" - auf Lexami-Seiten
            (und unter lexami.org) heißt der Satz wie das Programm. */}
        <Spinner label="Tastenflow wird gestartet …" />
      </div>
    );
  }

  return (
    <AnnounceProvider>
      <RouterProvider router={router} />
      {/* Jeder `title` der Plattform als großer Hinweis aus der Mausspitze
          (Johannes 30.09.2026) - `components/TitelHinweis.tsx`. */}
      <TitelHinweis />
    </AnnounceProvider>
  );
}
