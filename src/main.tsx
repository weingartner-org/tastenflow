import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { useContrast, applyContrast } from "./lib/contrast";
import { aufklappBewegungEinschalten } from "./lib/aufklappBewegung";
import { detailsBewegungEinschalten } from "./lib/detailsBewegung";
import { nachladeFehlerAbfangen } from "./lib/seiteNachladen";
import "./index.css";

// Die Build-Kennung („welcher Stand laeuft?") steht seit 28.09.2026 als
// `data-build` am <html> der index.html und NICHT mehr hier: Im Code haette sie
// dem Einstiegs-Bündel bei jedem Commit einen neuen Namen gegeben - und jedem
// Bündel, das aus ihm importiert (siehe vite.config.ts, `buildKennungInsHtml`).

// Ein Tab, der vor einem Deploy offen war, lädt einmal neu, wenn eine Seite
// nicht mehr nachzuladen ist (lib/seiteNachladen.tsx).
nachladeFehlerAbfangen();

// Kontrastmodus sofort vor dem ersten Render anwenden (kein Flackern)
applyContrast(useContrast.getState().mode);

// Jede <details>-Klappzeile öffnet und schließt sichtbar (Johannes 19.09.2026).
detailsBewegungEinschalten();

// Jeder Aufklapp-Schalter (`aria-expanded`) lässt seinen Bereich aufgleiten,
// der Rest rutscht nach unten - in allen Apps (Johannes 28.09.2026).
aufklappBewegungEinschalten();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
