import { Link } from "react-router-dom";
import { SkipLink } from "@/lib/a11y";
import { TastenflowLogo } from "@/components/TastenflowLogo";

/*
 * Ersatzteil im Paket „Tastenflow": „Seite nicht gefunden" ohne die Kopfzeile
 * der Plattform (sie führt Menüs zu anderen Programmen).
 */
export function NotFound() {
  return (
    <div className="min-h-screen">
      <SkipLink />
      <main id="hauptinhalt" className="grid place-items-center px-4 py-20 text-center">
        <TastenflowLogo className="h-12 w-12" />
        <p className="mt-4 text-6xl font-bold text-accent" aria-hidden="true">
          404
        </p>
        <h1 id="seitentitel" className="mt-4 text-2xl font-semibold">
          Seite nicht gefunden
        </h1>
        <p className="mt-2 text-ink-muted">Die angeforderte Seite existiert nicht.</p>
        <Link to="/" className="btn-primary mt-6">
          Zur Startseite
        </Link>
      </main>
    </div>
  );
}
