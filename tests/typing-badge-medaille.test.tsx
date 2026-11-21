/**
 * Wächter für die MEDAILLE selbst (09.08.2026).
 *
 * Befund Johannes nach dem Ausbau auf 116 Abzeichen: „die Sterne passen nicht,
 * jetzt stehen die Sterne über die Medaille." Ursache: Die Stufen-Sterne standen
 * in EINER Reihe, ein Stern je Stufe, 7,5 Einheiten auseinander. Solange keine
 * Familie mehr als vier Stufen hatte, ging das auf — „Tastenwelt" hat zwölf, und
 * zwölf Sterne sind 82 Einheiten breit auf einer 64 Einheiten breiten Medaille.
 *
 * Jetzt liegen sie auf einem BOGEN am unteren Rand, höchstens fünf, bei großen
 * Familien anteilig. Dieser Test rechnet nach, dass wirklich JEDER Stern jedes
 * Abzeichens innerhalb der Innenfläche des Medaillons liegt.
 */
import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { BADGES } from "../src/lib/typing";
import type { ContrastMode } from "../src/lib/contrast";
import {
  ALLE_METALLE,
  BadgeMedal,
  medaillenBeschreibung,
  metallTon,
  saumFarbe,
  SAUM_ZIEL,
} from "../src/components/typing/BadgeMedal";

afterEach(cleanup);

/** Mittelpunkt und Innenfläche des Medaillons (siehe BadgeMedal.tsx). */
const CX = 32;
const CY = 56;
const FACE_R = 20.5;

function sterne(id: string): Array<{ x: number; y: number }> {
  const def = BADGES.find((b) => b.id === id)!;
  const { container } = render(<BadgeMedal def={def} />);
  return [...container.querySelectorAll("text")]
    .filter((t) => t.textContent === "★")
    .map((t) => ({ x: Number(t.getAttribute("x")), y: Number(t.getAttribute("y")) }));
}

describe("Medaille — die Stufen-Sterne", () => {
  it("★ KEIN Stern verlässt die Innenfläche — bei keinem einzigen Abzeichen", () => {
    for (const def of BADGES) {
      const { container } = render(<BadgeMedal def={def} />);
      const punkte = [...container.querySelectorAll("text")]
        .filter((t) => t.textContent === "★")
        .map((t) => ({
          x: Number(t.getAttribute("x")),
          y: Number(t.getAttribute("y")),
        }));
      for (const p of punkte) {
        const abstand = Math.hypot(p.x - CX, p.y - CY);
        // 3,5 Einheiten Luft für die halbe Sternhöhe (Schriftgröße 6).
        expect(
          abstand,
          `${def.id}: Stern bei (${p.x}, ${p.y}) liegt außerhalb`,
        ).toBeLessThan(FACE_R - 3.5);
      }
      cleanup();
    }
  });

  it("höchstens fünf Sterne — auch bei der zwölfstufigen Tastenwelt", () => {
    const tastenwelt = BADGES.filter((b) => b.group === "Tastenwelt");
    expect(tastenwelt.length).toBeGreaterThanOrEqual(12);
    for (const def of tastenwelt) {
      const { container } = render(<BadgeMedal def={def} />);
      const n = [...container.querySelectorAll("text")].filter(
        (t) => t.textContent === "★",
      ).length;
      expect(n, `${def.id} hat ${n} Sterne`).toBeGreaterThanOrEqual(1);
      expect(n, `${def.id} hat ${n} Sterne`).toBeLessThanOrEqual(5);
      cleanup();
    }
  });

  it("die Sterne steigen mit der Stufe: erste Stufe einer, letzte fünf", () => {
    expect(sterne("grundstellungs-gorilla").length).toBe(1);
    expect(sterne("tastatur-krone").length).toBe(5);
  });

  it("sie liegen UNTER dem Motiv (Bogen am unteren Rand), nicht darüber", () => {
    for (const p of sterne("tastatur-krone")) expect(p.y).toBeGreaterThan(CY + 8);
  });

  it("Geheim-Abzeichen tragen keine Stufen-Sterne", () => {
    expect(sterne("nachteule").length).toBe(0);
    expect(sterne("blindflug").length).toBe(0);
  });
});

describe("Medaille — Bänder und Metalle", () => {
  it("★ jede Familie hat ein EIGENES Band — keine fällt aufs Geheim-Violett zurück", () => {
    // Bis 09.08.2026 hieß der Schlüssel der XP-Familie „Spielstufe", die Gruppe
    // aber „Stufen" — sieben Familien trugen still das falsche Band.
    const bandFuer = (id: string) => {
      const def = BADGES.find((b) => b.id === id)!;
      const { container } = render(<BadgeMedal def={def} />);
      const band = container.querySelector("path")!.getAttribute("fill");
      cleanup();
      return band;
    };
    const geheimBand = bandFuer("nachteule");
    for (const id of [
      "kletter-koala", // Stufen
      "vierteljahr-dabei", // Übungswochen
      "grundstellungs-gorilla", // Tastenwelt
      "feste-burg", // Sitzt!
      "kette-100", // Am Stück
      "zehn-minuten-abschrift", // Meisterprüfung
      "hoehlen-lauscher", // Expedition
    ]) {
      expect(bandFuer(id), `${id} trägt das Geheim-Band`).not.toBe(geheimBand);
    }
  });

  it("★ die zwanzig geheimen Schätze tragen VIELE verschiedene Werkstoffe", () => {
    // Befund Johannes 09.08.2026: „gibt es jetzt keine Farben mehr sondern nur
    // Gold?" — die Geheim-Familie war einfarbig. Jeder Schatz hat jetzt seinen
    // eigenen Stein.
    const geheim = BADGES.filter((b) => b.secret);
    const werkstoffe = new Set(
      geheim.map((def) => {
        const { container } = render(<BadgeMedal def={def} />);
        const rand = container.querySelectorAll("circle")[0].getAttribute("stroke");
        cleanup();
        return rand;
      }),
    );
    expect(werkstoffe.size).toBeGreaterThanOrEqual(8);
  });

  it("★ in großen Familien gleicht kein Werkstoff dem seines Nachbarn", () => {
    // Vorher trug die ganze Mitte Diamant — bei „Tastenwelt" acht gleiche
    // Medaillen hintereinander.
    for (const gruppe of ["Tastenwelt", "Tempo", "Fehlerfrei", "Dranbleiben"]) {
      const familie = BADGES.filter((b) => b.group === gruppe);
      const raender = familie.map((def) => {
        const { container } = render(<BadgeMedal def={def} />);
        const rand = container.querySelectorAll("circle")[0].getAttribute("stroke");
        cleanup();
        return rand;
      });
      for (let i = 1; i < raender.length; i++)
        expect(raender[i], `${gruppe}: Stufe ${i + 1} sieht aus wie ${i}`).not.toBe(
          raender[i - 1],
        );
      // … und insgesamt bunt genug.
      expect(new Set(raender).size).toBe(raender.length);
    }
  });

  it("die letzte Stufe großer Familien trägt Platin — der Rest bleibt unverändert", () => {
    const rand = (id: string) => {
      const def = BADGES.find((b) => b.id === id)!;
      const { container } = render(<BadgeMedal def={def} />);
      const stroke = container.querySelectorAll("circle")[0].getAttribute("stroke");
      cleanup();
      return stroke;
    };
    // Die jeweils LETZTE Stufe großer Familien trägt dasselbe neue Metall …
    expect(rand("einhorn-finger")).toBe(rand("tastatur-krone"));
    expect(rand("einhorn-finger")).toBe(rand("tempo-300"));
    // … und hebt sich von der Stufe darunter ab. „Diamant-Finger" behält sein
    // Diamant-Metall (kein Kind findet eine Medaille plötzlich schlechter vor).
    expect(rand("diamant-finger")).not.toBe(rand("einhorn-finger"));
    // Kleine Familien (hier vier Stufen) enden weiterhin bei Diamant.
    expect(rand("diamant-finger")).toBe(rand("eiskalte-serie"));
    // ★ Die Meisterprüfung beginnt OBEN: Als dreiköpfige Familie hätte sie sonst
    //   Bronze getragen — die drei schwersten Abzeichen der App sahen aus wie
    //   ein Einstieg (gesehen am Prüfblatt, 09.08.2026).
    expect(rand("zehn-minuten-abschrift")).not.toBe(rand("volltreffer")); // nicht Bronze
    expect(rand("goldene-tastatur")).toBe(rand("tastatur-krone")); // Platin
  });
});

/**
 * ── Das Motiv als festes Bild (22.08.2026) ─────────────────────────────────
 *
 * Bis heute stand in der Mitte ein `<text>` mit dem Emoji, und wie die
 * Medaille aussah, entschied das Gerät. Jetzt liegt dort ein `<image>` auf ein
 * Bild aus dem Motivpool. Die neue Art, still kaputtzugehen: ein Pfad, der ins
 * Leere zeigt. Die Medaille ist `aria-hidden` - ein Kind mit Blindheit merkt
 * davon nie etwas, ein sehendes erst beim Hinsehen.
 */
describe("Medaille - das Motiv als festes Bild", () => {
  const bild = (id: string, modus?: ContrastMode) => {
    const def = BADGES.find((b) => b.id === id)!;
    const { container } = render(<BadgeMedal def={def} modus={modus} />);
    const el = container.querySelector("image");
    const href = el?.getAttribute("href") ?? null;
    const filter = (el as SVGElement | null)?.style.filter ?? "";
    cleanup();
    return { href, filter };
  };

  it("★ JEDE der 116 Medaillen trägt ein Bild, das es wirklich gibt", () => {
    const kaputt: string[] = [];
    for (const def of BADGES) {
      const { container } = render(<BadgeMedal def={def} />);
      const href = container.querySelector("image")?.getAttribute("href");
      if (!href) kaputt.push(`${def.id}: gar kein Bild`);
      else if (!existsSync(join(__dirname, "..", "public", href.replace(/^\//, ""))))
        kaputt.push(`${def.id}: ${href} fehlt auf der Platte`);
      cleanup();
    }
    expect(kaputt).toEqual([]);
  });

  it("kein Emoji steht mehr als Text in der Medaille", () => {
    // Der Befund, der diese Charge ausgelöst hat: Auf älteren Schul-Rechnern
    // stand statt des Ninja ein leeres Rechteck.
    for (const def of BADGES) {
      const { container } = render(<BadgeMedal def={def} />);
      const texte = [...container.querySelectorAll("text")].map((t) => t.textContent);
      expect(texte, `${def.id} zeigt sein Emoji noch als Text`).not.toContain(def.emoji);
      cleanup();
    }
  });

  it("Hell und Dunkel bekommen das farbige Bild, die fünf Kontrastmodi die Strichzeichnung", () => {
    expect(bild("null-fehler-ninja", "hell").href).toBe("/abzeichen/fluent/color/1f977.svg");
    expect(bild("null-fehler-ninja", "dunkel").href).toBe("/abzeichen/fluent/color/1f977.svg");
    for (const m of ["sw", "ws", "sg", "gs", "gb"] as const)
      expect(bild("null-fehler-ninja", m).href, m).toBe("/abzeichen/fluent/kontrast/1f977.svg");
  });

  it("auf dunklem Grund wird die Strichzeichnung weiß, auf hellem bleibt sie schwarz", () => {
    for (const m of ["ws", "gs", "gb"] as const)
      expect(bild("null-fehler-ninja", m).filter, m).toContain("invert(1)");
    for (const m of ["sw", "sg"] as const)
      expect(bild("null-fehler-ninja", m).filter, m).not.toContain("invert");
  });

  it("ohne Kontrastmodus trägt das Motiv einen dunklen Saum", () => {
    // Kein Farbton trennt ALLE 1595 Motive vom Grund - auf Bronze verschwindet
    // ein brauner Bär, auf Smaragd ein grüner Frosch. Der Saum tut es für jedes.
    expect(bild("null-fehler-ninja", "hell").filter).toContain("drop-shadow");
    expect(bild("null-fehler-ninja", "ws").filter).not.toContain("drop-shadow");
  });

  it("★ das Motiv bleibt in der Prägefläche und stößt nicht an die Sterne", () => {
    for (const def of BADGES) {
      const { container } = render(<BadgeMedal def={def} />);
      const el = container.querySelector("image");
      if (el) {
        const x = Number(el.getAttribute("x"));
        const y = Number(el.getAttribute("y"));
        const w = Number(el.getAttribute("width"));
        // Ecke des Bildes zum Mittelpunkt: muss innerhalb der Innenfläche liegen.
        expect(Math.hypot(x + w - CX, y + w - CY), def.id).toBeLessThan(FACE_R + 1);
        // Die Sterne liegen auf einem Bogen und dürfen dem Motiv nicht ins
        // Bild ragen. Gemessen wird gegen den Innenkreis des Motivfeldes: Die
        // Ecken des Quadrats sind bei jedem Fluent-Bild leer, der Kreis darin
        // ist das, was man wirklich sieht.
        const mx = x + w / 2;
        const my = y + w / 2;
        const sterne = [...container.querySelectorAll("text")].filter(
          (t) => t.textContent === "★",
        );
        for (const s of sterne) {
          const d = Math.hypot(Number(s.getAttribute("x")) - mx, Number(s.getAttribute("y")) - my);
          expect(d, `${def.id}: Stern liegt im Motiv`).toBeGreaterThan(w / 2 + 2);
        }
      }
      cleanup();
    }
  });

  it("Geheim-Abzeichen zeigen vor dem Verdienen weiter das Fragezeichen, kein Bild", () => {
    const def = BADGES.find((b) => b.id === "nachteule")!;
    const { container } = render(<BadgeMedal def={def} secretHidden />);
    expect(container.querySelector("image")).toBe(null);
    expect([...container.querySelectorAll("text")].map((t) => t.textContent)).toContain("?");
  });

  it("im Kontrastmodus ist die ganze Medaille zweifarbig - keine Verläufe mehr", () => {
    const def = BADGES.find((b) => b.id === "makellos-meister")!;
    const hell = render(<BadgeMedal def={def} modus="hell" />).container;
    expect(hell.querySelectorAll("radialGradient").length).toBe(2);
    cleanup();
    const dunkelgrund = render(<BadgeMedal def={def} modus="gs" />).container;
    expect(dunkelgrund.querySelectorAll("radialGradient").length).toBe(0);
    // Grund und Strich des Modus „Gelb auf Schwarz" (contrast.ts).
    const scheibe = dunkelgrund.querySelectorAll("circle")[1];
    expect(scheibe.getAttribute("fill")).toBe("#000000");
    expect(scheibe.getAttribute("stroke")).toBe("#ffd600");
  });

  it("noch nicht verdient: im Kontrastmodus nur halbe Deckkraft, kein Graustich", () => {
    // `grayscale` zöge dort genau den Kontrast heraus, den der Modus herstellt.
    const def = BADGES.find((b) => b.id === "volltreffer")!;
    const hell = render(<BadgeMedal def={def} earned={false} modus="hell" />).container;
    expect(hell.querySelector("svg")!.getAttribute("style")).toContain("grayscale");
    cleanup();
    const kontrast = render(<BadgeMedal def={def} earned={false} modus="ws" />).container;
    expect(kontrast.querySelector("svg")!.getAttribute("style")).not.toContain("grayscale");
    expect(kontrast.querySelector("svg")!.getAttribute("style")).toContain("opacity");
  });
});

/**
 * ── Die Medaille in Worten (22.08.2026) ────────────────────────────────────
 *
 * Die Medaille ist `aria-hidden` - für ein Kind mit Blindheit gab es sie bis
 * heute schlicht nicht, während das sehende Kind daneben einen Ninja auf einer
 * goldenen Scheibe sah und darüber redete. Jetzt steht sie als Satz im
 * sr-only-Text. Ein Satz, der niemandem auffällt, wenn er fehlt oder falsch
 * ist - darum diese Wächter.
 */
describe("Medaille - die Bildbeschreibung", () => {
  it("★ jedes der 116 Abzeichen hat einen Satz, und keiner ist länger als 120 Zeichen", () => {
    const zulang: string[] = [];
    for (const def of BADGES) {
      const satz = medaillenBeschreibung(def);
      expect(def.bildbeschreibung.length, `${def.id} ohne Bildbeschreibung`).toBeGreaterThan(3);
      if (satz.length > 120) zulang.push(`${def.id}: ${satz.length} Zeichen`);
    }
    expect(zulang).toEqual([]);
  });

  it("Metall und Band kommen aus dem Bauplan, das Motiv aus badges.ts", () => {
    const ninja = BADGES.find((b) => b.id === "null-fehler-ninja")!;
    expect(medaillenBeschreibung(ninja)).toBe(
      "Silberne Medaille mit rotem Band, darauf ein Ninja.",
    );
  });

  it("★ jede Familie hat ein Band-WORT - keine bekommt ein Band angesagt, das sie nicht trägt", () => {
    // Dieselbe Falle wie 09.08.2026 bei den Bandfarben: Dort hieß ein
    // Schlüssel „Spielstufe", die Gruppe aber „Stufen", und eine ganze Familie
    // trug jahrelang still das falsche Band.
    const ohne = [...new Set(BADGES.map((b) => b.group))].filter(
      (g) => !medaillenBeschreibung(BADGES.find((b) => b.group === g)!).includes(" mit "),
    );
    expect(ohne).toEqual([]);
    const geheimBand = medaillenBeschreibung(BADGES.find((b) => b.group === "Geheim")!)
      .split(" mit ")[1]
      .split(" Band")[0];
    for (const g of [...new Set(BADGES.map((b) => b.group))].filter((x) => x !== "Geheim")) {
      const wort = medaillenBeschreibung(BADGES.find((b) => b.group === g)!)
        .split(" mit ")[1]
        .split(" Band")[0];
      expect(wort, `${g} fällt auf das Geheim-Band zurück`).not.toBe(geheimBand);
    }
  });

  it("Geheim-Abzeichen verraten vor dem Verdienen ihr Motiv nicht", () => {
    // Sonst wäre die Überraschung per Sprachausgabe gelüftet - und ausgerechnet
    // das Kind mit Blindheit bekäme das Rätsel verdorben.
    const eule = BADGES.find((b) => b.id === "nachteule")!;
    expect(medaillenBeschreibung(eule, true)).not.toContain("Eule");
    expect(medaillenBeschreibung(eule, true)).toContain("Fragezeichen");
  });

  it("nur einfache Bindestriche - kein Halbgeviert, kein Geviert", () => {
    // Braillezeile und Sprachausgabe geben diese Zeichen nicht als das wieder,
    // was ein sehendes Auge dort liest.
    for (const def of BADGES)
      expect(/[–—−]/.test(medaillenBeschreibung(def)), def.id).toBe(false);
  });

  it("die Sätze enden als Satz und fangen groß an", () => {
    for (const def of BADGES) {
      const satz = medaillenBeschreibung(def);
      expect(satz.endsWith("."), `${def.id}: ${satz}`).toBe(true);
      expect(satz[0], def.id).toBe(satz[0].toUpperCase());
    }
  });
});


/* ══════════════════════════════════════════════════════════════════════════
   DER SAUM MUSS AUF SEINER EIGENEN FLÄCHE ZU SEHEN SEIN
   ══════════════════════════════════════════════════════════════════════════
   Seit 26.08.2026 trägt der Saum um das Motiv die Farbe DER MEDAILLE statt
   Schwarz (Befund eines sehenden Schülers: „immer so ein schwarzer Schatten und
   so dunkles Design"). Das ist freundlicher - und zerbrechlicher: Ein schwarzer
   Saum war auf jedem Metall sichtbar, ein bronzefarbener muss es erst sein.

   Maßstab ist WCAG 1.4.11 (Nicht-Text-Kontrast, 3:1), gemessen gegen
   `faceLight` - die HELLSTE Stelle der Prägefläche. Dort ist die Trennung am
   schwersten, und genau dort steht das Motiv.

   ⚠️ Dieser Wächter ist die Bremse für die nächste Aufhellung: Wer ein Metall
   heller macht und den Saum vergisst, bekommt hier einen roten Test statt eines
   Motivs, das auf der Medaille verschwindet. */
function leuchtdichte(hex: string): number {
  const teil = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = teil.map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function verhaeltnis(a: string, b: string): number {
  const la = leuchtdichte(a);
  const lb = leuchtdichte(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

describe("Der Saum um das Motiv", () => {
  it("★★★★ ist auf JEDEM Metall sichtbar (WCAG 1.4.11, gemessen gegen faceLight)", () => {
    const schwach: string[] = [];
    for (const name of ALLE_METALLE) {
      const m = metallTon(name);
      const ton = m.saum ?? m.rimDark;
      const v = verhaeltnis(ton, m.faceLight);
      if (v < SAUM_ZIEL) schwach.push(`${name}: ${v.toFixed(2)}:1 (${ton} auf ${m.faceLight})`);
    }
    expect(schwach, `Saum zu schwach:\n  ${schwach.join("\n  ")}`).toEqual([]);
  });

  it("★★★ nimmt die Farbe der Medaille, nicht Schwarz", () => {
    // Die Gegenprobe zum Befund des Schülers: Kein Metall darf den alten
    // fast schwarzen Halo tragen.
    for (const name of ALLE_METALLE) {
      const filter = saumFarbe(metallTon(name));
      expect(filter, name).not.toContain("rgba(20,14,0");
      expect(filter, name).toContain("drop-shadow");
    }
    // Und er ist wirklich je Metall ein anderer.
    const toene = new Set(ALLE_METALLE.map((n) => saumFarbe(metallTon(n))));
    expect(toene.size).toBeGreaterThan(10);
  });

  it("★★ nur der Saum wurde nachgedunkelt - der sichtbare Rand bleibt", () => {
    // `rimDark` ist Rand UND Riffelung der Medaille. Hätte man ihn selbst
    // verschoben, sähe die ganze Medaille anders aus als entworfen.
    const gold = metallTon("gold");
    expect(gold.rimDark).toBe("#a8801a");
    expect(gold.saum).toBe("#9c7718");
    expect(gold.saum).not.toBe(gold.rimDark);
  });

  it("★★★ Gold ist wieder hell - das war der zweite Teil des Befunds", () => {
    // Am 22.08. abgedunkelt (#d9a92c → #8f6a12), am 26.08. zurückgeholt.
    // Gold trägt jedes Einzel- und jedes Geheim-Abzeichen; es entscheidet den
    // Gesamteindruck stärker als jedes andere Metall.
    const gold = metallTon("gold");
    expect(gold.face).toBe("#d9a92c");
    expect(leuchtdichte(gold.face)).toBeGreaterThan(leuchtdichte("#8f6a12"));
  });
});
