import { useCallback, type ReactNode } from "react";

/*
 * Ersatzteil im Paket „Tastenflow": In der Plattform öffnet „Ansehen" eine
 * Datei in einem Vorschau-Fenster (Word, PDF, Excel ...). Das Fenster
 * braucht Bibliotheken für Word und PDF und gehört zu einem anderen Teil der
 * Plattform. Hier wird die Datei stattdessen heruntergeladen.
 */
export function useDateiVorschau(): {
  zeige: (name: string, hole: () => Promise<Blob>, groesse?: number) => Promise<void>;
  fenster: ReactNode;
} {
  const zeige = useCallback(async (name: string, hole: () => Promise<Blob>) => {
    const blob = await hole();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }, []);
  return { zeige, fenster: null };
}
