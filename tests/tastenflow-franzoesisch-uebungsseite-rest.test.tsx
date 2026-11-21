/**
 * ★★★ E11a-4 (26.09.2026): DIE RESTLICHE ÜBUNGSSEITE WIRKLICH AUF FRANZÖSISCH -
 * GERENDERT, NICHT NUR DIE TABELLE.
 *
 * Fortsetzung von E11a-2/-3 (`spracheGewaehlt` statt der oberflächen-sicheren,
 * gekappten `sprache`) für die Bauteile, die dort noch offen waren
 * (BEFUND-2026-09-26-E11A3-OBERFLAECHE-BAUTEILE.md §6): `StandZeile.tsx`,
 * `KlassenmatchLauf.tsx`/`KlassenmatchErgebnis.tsx`,
 * `KlassenEinstellungsFelder.tsx` (confirmed Tastenflow-only, nicht in
 * `apps/GEMEINSAM.md`).
 *
 * ★★★ DIE GEGENPROBE (wie immer): derselbe Aufbau in der deutschen Bedienung
 * muss viele Funde liefern - ein Fänger, der nichts liest, weil er nichts
 * findet, sähe sonst genauso grün aus.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";

vi.mock("../src/lib/typing/voice", async (importOriginal) => {
  const echt = await importOriginal<typeof import("../src/lib/typing/voice")>();
  return { ...echt, speakUi: vi.fn(), speakUiAlways: vi.fn(), speakSequence: vi.fn() };
});

import { BedienSpracheProvider, type BedienSprache } from "../src/lib/bedienSprache";
import { StandZeile } from "@/components/typing/StandZeile";
import { KlassenmatchErgebnis } from "@/components/typing/KlassenmatchErgebnis";
import { KlassenEinstellungsFelder } from "@/components/typing/KlassenEinstellungsFelder";
import { VoiceInstallHelp } from "@/components/typing/VoiceInstallHelp";
import { belohnungsAngebot } from "@/components/typing/AdaptiveTrainer";
import { bedienCopy } from "@/lib/typing/skin";
import { Einrichtung } from "@/components/typing/Einrichtung";
import { EigeneUebungAnkuendigung } from "@/components/typing/EigeneUebungAnkuendigung";
import { TypingSettings } from "@/components/typing/TypingSettings";
import { Wortspiele } from "@/components/typing/Wortspiele";
import type { TypingProgress } from "@/lib/typing";
import { resetPracticeClock } from "@/lib/typing";
import { findeDeutsch } from "./helfer/deutschFaenger";

function stelleBedienung(sprache: BedienSprache) {
  localStorage.clear();
  localStorage.setItem("tastenflow-bedienung", sprache);
}

function zeige(knoten: ReactNode) {
  return render(<BedienSpracheProvider>{knoten}</BedienSpracheProvider>);
}

beforeEach(() => {
  resetPracticeClock();
});
afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe("★★★ Stand-Zeile auf Französisch (E11a-4)", () => {
  it("wirklich Französisch: Stufe, nächste Taste, kein deutsches Wort", () => {
    stelleBedienung("fr");
    let wurzel!: HTMLElement;
    ({ container: wurzel } = zeige(
      <StandZeile stufeLabel="Niveau" level={7} nextUnit="p" shiftLearned />,
    ));
    expect(screen.getAllByText(/Prochaine touche/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Nächste Taste/)).toBeNull();
    expect(findeDeutsch(wurzel)).toEqual([]);
    const karte = wurzel.querySelector(".standzeile-leiste");
    expect(karte?.getAttribute("lang")).toBe("fr");
  });

  it("★★★ GEGENPROBE: dieselbe Zeile deutsch liefert Funde", () => {
    stelleBedienung("de");
    zeige(<StandZeile stufeLabel="Übungsstufe" level={7} nextUnit="p" shiftLearned />);
    expect(screen.getAllByText(/Nächste Taste/).length).toBeGreaterThan(0);
  });
});

describe("★★★ Klassenmatch-Ergebnis auf Französisch (E11a-4)", () => {
  const LISTE = [
    {
      platz: 1,
      wert: 92,
      stand: { pupilUid: "a", name: "Aline", punkte: 10, restMs: 0, tempo: 40, fehler: 0 } as any,
    },
    {
      platz: 2,
      wert: 80,
      stand: { pupilUid: "b", name: "Baptiste", punkte: 8, restMs: 0, tempo: 35, fehler: 1 } as any,
    },
  ];

  it("wirklich Französisch: Titel, Ehrenplatz „Trophée“, kein deutsches Wort", () => {
    stelleBedienung("fr");
    let wurzel!: HTMLElement;
    ({ container: wurzel } = zeige(
      <KlassenmatchErgebnis liste={LISTE} eigeneUid="a" onWeiter={() => {}} />,
    ));
    expect(screen.getByText("Le Match de la classe est terminé")).toBeTruthy();
    expect(screen.getByText("Trophée")).toBeTruthy();
    expect(screen.getByText("Continuer à s'exercer")).toBeTruthy();
    expect(findeDeutsch(wurzel)).toEqual([]);
    expect(wurzel.querySelector(".card")?.getAttribute("lang")).toBe("fr");
  });

  it("★★★ GEGENPROBE: dasselbe Ergebnis deutsch liefert Funde, Ehrenplatz „Pokal“", () => {
    stelleBedienung("de");
    zeige(<KlassenmatchErgebnis liste={LISTE} eigeneUid="a" onWeiter={() => {}} />);
    expect(screen.getByText("Das Klassenmatch ist vorbei")).toBeTruthy();
    expect(screen.getByText("Pokal")).toBeTruthy();
  });
});

/**
 * ★ „des"/„du" sind Deutsch UND Französisch (wie in
 * `tests/tastenflow-franzoesisch-meine-klassen.test.tsx`, E11a-3 - dort nur
 * „des", hier zusätzlich „du" als Artikel-Zusammenziehung „de" + „le", z. B.
 * „Voix du système"). Dazu: die Startniveau-Liste nennt die physische
 * Grundreihe der TASTATUR (`startPoints` → `introOrder` → `activeLayoutId()`)
 * - ohne echtes AZERTY/Schweiz-Französisch-Layout (Bauplan §3, „Nicht
 * anfassen" dieser Etappe) liest der Test die deutsche QWERTZ-Grundreihe
 * „a s d f j k l ö" mit, erkannt am „ö". Das ist eine bekannte, dokumentierte
 * Lücke der TASTATUR-Arbeit (E3), keine Rückkehr zu deutscher
 * Oberflächensprache.
 */
function ohneBekannteFranzoesischeAusnahmen(funde: string[]): string[] {
  const HOMOGRAFE = new Set(["des", "du"]);
  return funde.filter((f) => {
    if (f.includes("rangée de base")) return false; // Tastatur-Platzhalter (E3)
    const woerter = f.match(/\[([^\]]*)\]$/)?.[1]?.split(", ") ?? [];
    return woerter.some((w) => !HOMOGRAFE.has(w.toLowerCase()));
  });
}

describe("★★★ Klasseneinstellungs-Felder auf Französisch (E11a-4)", () => {
  function zeigeFelder() {
    return zeige(
      <KlassenEinstellungsFelder
        bezug="de la classe 3b"
        werte={{
          schulstufe: null,
          lang: "fr",
          langLocked: false,
          klassenmatchAus: false,
          zeilenEndeEnter: false,
        }}
        jetztMs={new Date(2026, 8, 19).getTime()}
        startniveau={{
          lernweg: "fr",
          wert: "",
          platzhalter: "Choisir",
          hinweis: "",
          srHinweis: "",
        }}
        onSchulstufe={() => {}}
        onSprache={() => {}}
        onSperre={() => {}}
        onStartniveau={() => {}}
        onKlassenmatch={() => {}}
        onZeilenEnde={() => {}}
      />,
    );
  }

  it("wirklich Französisch: Feldnamen, kein deutsches Wort", () => {
    stelleBedienung("fr");
    let wurzel!: HTMLElement;
    ({ container: wurzel } = zeigeFelder());
    expect(screen.getByText("Niveau scolaire")).toBeTruthy();
    expect(screen.getByText("Langue")).toBeTruthy();
    expect(ohneBekannteFranzoesischeAusnahmen(findeDeutsch(wurzel))).toEqual([]);
  });

  it("★★★ GEGENPROBE: dieselben Felder deutsch liefern Funde", () => {
    stelleBedienung("de");
    zeigeFelder();
    expect(screen.getByText("Schulstufe")).toBeTruthy();
    expect(screen.getByText("Sprache")).toBeTruthy();
  });
});

describe("★★★ Anleitung „Stimme installieren“ auf Französisch (E11a-4)", () => {
  it("wirklich Französisch: Titel, Fenstertext, kein deutsches Wort", () => {
    stelleBedienung("fr");
    let wurzel!: HTMLElement;
    ({ container: wurzel } = zeige(<VoiceInstallHelp open onClose={() => {}} />));
    expect(screen.getByText("Aucune voix française installée")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Fermer" })).toBeTruthy();
    expect(ohneBekannteFranzoesischeAusnahmen(findeDeutsch(wurzel))).toEqual([]);
    expect(wurzel.querySelector(".card")?.getAttribute("lang")).toBe("fr");
  });

  it("★★★ GEGENPROBE: dasselbe Fenster deutsch liefert Funde", () => {
    stelleBedienung("de");
    zeige(<VoiceInstallHelp open onClose={() => {}} />);
    expect(screen.getByText("Keine englische Stimme installiert")).toBeTruthy();
  });
});

describe("★★★ Abschluss-Karte auf Französisch: bedienCopy/belohnungsAngebot (E11a-4)", () => {
  it("bedienCopy liefert für „fr“ eine ECHTE französische Fassung, nicht die deutsche (Falle 30)", () => {
    const kind = bedienCopy("kids", "fr");
    expect(kind.progressLabel).toBe("Niveau de jeu");
    expect(kind.summaryTitle(0)).toBe("Série réussie !");

    const jugend = bedienCopy("teens", "fr");
    expect(jugend.summaryTitle(3)).toBe("Frappe impeccable.");
    expect(jugend.summaryRemark(1)).toMatch(/prochaine fois/);

    const erwachsen = bedienCopy("erwachsen", "fr");
    expect(erwachsen.textstufeLabel).toBe("Choix des textes :");
    // ★★★ Die Gegenprobe, die Falle 30 wirklich fängt: bedienCopy("fr") darf
    // NIE mit der deutschen copyFor()-Fassung übereinstimmen.
    expect(kind.progressLabel).not.toBe("Spielstufe");
    expect(erwachsen.summaryTitle(3)).not.toBe("Sauber getippt.");
  });

  it("belohnungsAngebot liefert für „fr“ eine echte Frage/einen echten Knopf-Text", () => {
    const angebot = belohnungsAngebot("fr", true);
    expect(angebot.label).toBe("🐧 En route pour la banquise !");
    expect(angebot.frage).toMatch(/banquise/);
  });
});

describe("★★★ Einrichtung auf Französisch (E11a-4)", () => {
  function zeigeEinrichtung() {
    return zeige(
      <Einrichtung
        stufe="teens"
        lang="fr"
        onLangChange={() => {}}
        startUnits={2}
        onStartUnitsChange={() => {}}
        lernweg="fr"
        onExit={() => {}}
      />,
    );
  }

  it("wirklich Französisch: Titel, Weiter-Knopf, kein deutsches Wort im ersten Schritt", () => {
    stelleBedienung("fr");
    let wurzel!: HTMLElement;
    ({ container: wurzel } = zeigeEinrichtung());
    expect(screen.getByText("Bienvenue sur Tastenflow")).toBeTruthy();
    expect(screen.getByRole("button", { name: "C'est parti" })).toBeTruthy();
    expect(ohneBekannteFranzoesischeAusnahmen(findeDeutsch(wurzel))).toEqual([]);
    expect(wurzel.querySelector("section")?.getAttribute("lang")).toBe("fr");
  });

  it("★★★ GEGENPROBE: dieselbe Einrichtung deutsch liefert Funde", () => {
    stelleBedienung("de");
    zeigeEinrichtung();
    expect(screen.getByText("Willkommen bei Tastenflow")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Los geht's" })).toBeTruthy();
  });
});

describe("★★★ Ankündigung „Eigene Übung“ auf Französisch (E11a-4)", () => {
  it("wirklich Französisch: Titel, Knopf „Continuer“, kein deutsches Wort", () => {
    stelleBedienung("fr");
    let wurzel!: HTMLElement;
    ({ container: wurzel } = zeige(
      <EigeneUebungAnkuendigung skin="kind" onWeiter={() => {}} />,
    ));
    expect(screen.getByText(/enseignant ou ton enseignante/)).toBeTruthy();
    expect(screen.getByRole("button", { name: "Continuer" })).toBeTruthy();
    expect(findeDeutsch(wurzel)).toEqual([]);
  });

  it("★★★ GEGENPROBE: dasselbe Fenster deutsch liefert Funde", () => {
    stelleBedienung("de");
    zeige(<EigeneUebungAnkuendigung skin="kind" onWeiter={() => {}} />);
    expect(screen.getByText(/deiner Lehrkraft/)).toBeTruthy();
    expect(screen.getByRole("button", { name: "Weiter" })).toBeTruthy();
  });
});

describe("★★★ Zahnrad-Einstellungen (TypingSettings) auf Französisch (E11a-4)", () => {
  function zeigeEinstellungen() {
    return zeige(
      <TypingSettings stufe="teens" lang="fr" onLangChange={() => {}} lernweg="fr" />,
    );
  }

  it("wirklich Französisch: Feldnamen und Tastatur-Namen, kein deutsches Wort", () => {
    stelleBedienung("fr");
    let wurzel!: HTMLElement;
    ({ container: wurzel } = zeigeEinstellungen());
    expect(screen.getByText("Langue")).toBeTruthy();
    // ★ E11a-5: die Tastatur-Namen sind jetzt französisch (`LAYOUT_TEXTE_FR`
    // in `layouts.ts`) - bis E11a-4 blieben sie englisch mit eigenem `lang`.
    // ★ D1 Nr. 7 (28.09.): Weg „fr" bietet nur noch französische Tastaturen an.
    expect(screen.getByRole("option", { name: "Français (France, AZERTY)" })).toBeTruthy();
    expect(screen.queryByRole("option", { name: "Allemand (Allemagne et Autriche)" })).toBeNull();
    expect(wurzel.querySelector("option[lang='en']")).toBeNull();
    expect(ohneBekannteFranzoesischeAusnahmen(findeDeutsch(wurzel))).toEqual([]);
    expect(wurzel.querySelector("[lang='fr']")).toBeTruthy();
  });

  it("★★★ GEGENPROBE: dieselben Einstellungen deutsch liefern Funde", () => {
    stelleBedienung("de");
    zeigeEinstellungen();
    expect(screen.getByText("Sprache")).toBeTruthy();
  });
});

describe("★★★ Wortspiele-Regal auf Französisch (E11a-4)", () => {
  const VOLL = [..."abcdefghijklmnopqrstuvwxyzäöüß".split(""), "⇧", ".", ","];
  function stand(introduced: string[]): () => Promise<TypingProgress> {
    return async () => ({ xp: 0, lessons: {}, letters: {}, introduced });
  }

  it("wirklich Französisch: Titel „Jeux de lettres“, kein deutsches Wort", async () => {
    stelleBedienung("fr");
    let wurzel!: HTMLElement;
    await act(async () => {
      ({ container: wurzel } = zeige(
        <Wortspiele loadFn={stand(VOLL)} stufe="kids" onWaehlen={() => {}} />,
      ));
    });
    expect(await screen.findByText("Jeux de lettres")).toBeTruthy();
    // ★ E11a-5 (26.09.2026): Seit die Namen und Hinweise der Formen echtes
    // Französisch sind („Dictée des doigts", „Des mots pour la main
    // gauche …"), steht hier der Homograf „des" - dieselbe Ausnahme wie oben.
    expect(ohneBekannteFranzoesischeAusnahmen(findeDeutsch(wurzel))).toEqual([]);
    expect(wurzel.querySelector(".card")?.getAttribute("lang")).toBe("fr");
  });

  it("★★★ GEGENPROBE: dasselbe Regal deutsch liefert Funde", async () => {
    stelleBedienung("de");
    await act(async () => {
      zeige(<Wortspiele loadFn={stand(VOLL)} stufe="kids" onWaehlen={() => {}} />);
    });
    expect(await screen.findByText("Wortspiele")).toBeTruthy();
  });
});
