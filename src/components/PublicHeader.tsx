import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TastenflowLogo } from "@/components/TastenflowLogo";

/*
 * Ersatzteil im Paket „Tastenflow": die Leiste der Konto-Seiten (Anmelden,
 * Bestätigen, Passwort setzen). In der Plattform trägt sie Hilfe und
 * Konto-Menü für mehrere Programme; hier bleiben Zeichen, Name und Farbwahl.
 * Die Eigenschaften der Plattform-Leiste werden angenommen und nicht
 * ausgewertet, damit die Seiten unverändert bleiben.
 */
export function PublicHeader({
  className,
  actions,
  breite = "max-w-content",
}: {
  className?: string;
  actions?: ReactNode;
  breite?: string;
  konto?: boolean;
  kontoSchalter?: boolean;
  eigeneHilfe?: boolean;
  kompakt?: boolean;
  mitte?: ReactNode;
}) {
  return (
    <header className={`border-b border-hairline/60 px-4 py-3 sm:px-6 ${className ?? ""}`}>
      <div className={`mx-auto flex ${breite} flex-wrap items-center justify-between gap-3`}>
        <div className="flex items-center gap-1.5">
          <Link to="/" aria-label="Zur Startseite" className="shrink-0">
            <TastenflowLogo className="h-10 w-10" />
          </Link>
          <Link to="/" className="font-semibold leading-tight hover:underline underline-offset-2">
            Tastenflow
          </Link>
        </div>
        <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
          {actions}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
