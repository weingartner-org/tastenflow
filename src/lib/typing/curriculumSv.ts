/**
 * ★★★ DIE LEKTIONEN DES WEGES „sv" (Schwedisch) - F4-SV (29.10.2026), vorher leerer Einhängepunkt (G3c-VERTEILER).
 *
 * Die Mechanik steht in `lektionenBaukasten.ts` (seit GEN-HAUPTSPRACHE, 29.10.2026 - vorher `lektionenAusFolge.ts`); hier stehen nur die Texte. Neu auf Schwedisch geschrieben, nichts übersetzt. Begriffe
 * nach dem Glossar (`glossar/GLOSSAR-sv.md` §1, §2.1, §2.8, §2.9): *grundraden*, *grundställning*, *hemtangenterna*, *sifferraden ·
 * övre raden · nedre raden*, *lillfinger · ringfinger · långfinger · pekfinger · tumme* („vänster pekfinger"), *upphöjningarna på F
 * och J*, *Skift*, *Alt Gr*, *Mellanslag* (als Taste gross, Regel 12), *död tangent*, *lektion*. Anrede **du** für alle (Regel 1);
 * `å ä ö` sind eigene Buchstaben, nie „a mit Zeichen" (§4 Falle 1); Tastenwege statt Maus (*tryck på*, *välj*, Regel 9); keine
 * Abkürzungen (Regel 8); nur der Bindestrich `-`; gerade Anführungszeichen um Beispielwörter.
 *
 * ── DIE REGEL (wie cs) ───────────────────────────────────────────────────────────────────────────────────────────────
 * Die Tasten aller Lektionen hintereinander SIND `introOrder("sv")` (`lernweg.ts#SV_LETTER_ORDER`). Der Akut ist eine eigene Einheit
 * (Totaste, Ziel `é`, Bauplan S3/S19). Wächter: `tests/tastenflow-lektionen-sv.test.ts`.
 */
import type { Lesson } from "./curriculum";
import type { FingerId } from "./fingers";
import { heimZeichenDesWeges } from "./heimtasten";
import type { LayoutId } from "./layouts";
import { griffSaetzeAusInfo, lektionenJeTastatur, type GriffInfo, type Lage, type LektionsBauplan } from "./lektionenBaukasten";
import { lernwegDef } from "./lernweg";
import { kappeFuer } from "./sprachRegister";

// ── Namen ────────────────────────────────────────────────────────────────────

const kappe = (k: string): string => kappeFuer(k, "sv");

/** „F och J", „A, B och C" (ohne Oxford-Komma, Glossar Regel 8). */
function aufzaehlen(teile: readonly string[]): string {
  if (teile.length <= 1) return teile.join("");
  return `${teile.slice(0, -1).join(", ")} och ${teile[teile.length - 1]}`;
}
const kappen = (t: readonly string[]): string => aufzaehlen(t.map(kappe));

const FINGER: Readonly<Record<string, string>> = { kleiner: "lillfinger", ring: "ringfinger", mittel: "långfinger", zeige: "pekfinger", daumen: "tumme" };
function finger(f: FingerId): string {
  if (f === "daumen") return FINGER.daumen;
  const [art, hand] = f.split("-");
  return `${hand === "links" ? "vänster" : "höger"} ${FINGER[art]}`;
}

const RADER = ["sifferraden", "övre raden", "grundraden", "nedre raden"];

function bredvid(l: Lage): string {
  const sida = l.richtung === "links" ? "till vänster om" : "till höger om";
  const langt = l.abstand >= 3 ? "tre tangenter " : l.abstand === 2 ? "två tangenter " : "";
  return `${langt}${sida} tangenten ${kappe(l.heim ?? "")}`;
}

/** Finger och plats: „vänster pekfinger, övre raden, till höger om tangenten F". */
function plats(l: Lage, basis: string): string {
  const f = finger(l.finger);
  if (l.reihe === 2 && l.heim === basis) return `${f}, grundställning`;
  if (!l.heim) return `${f}, ${RADER[l.reihe]}`;
  if (l.reihe === 2) return `${f}, ${bredvid(l)}`;
  if (l.abstand === 0) return `${f}, ${RADER[l.reihe]}, rakt ${l.reihe === 3 ? "under" : "ovanför"} tangenten ${kappe(l.heim)}`;
  return `${f}, ${RADER[l.reihe]}, ${bredvid(l)}`;
}

/** Tecknens namn (Glossar §2.8, `SPOKEN_SV`): namnet står före tecknet. */
const TECKEN: Readonly<Record<string, string>> = {
  ".": "punkt", ",": "komma", "?": "frågetecken", "!": "utropstecken", "-": "bindestreck", ";": "semikolon", ":": "kolon",
  "\"": "citattecken", "'": "apostrof", "(": "vänster parentes", ")": "höger parentes", "%": "procent", "/": "snedstreck",
  "+": "plus", "=": "likhetstecken", "_": "understreck", "*": "stjärna", "&": "och-tecken", "<": "mindre än", ">": "större än",
  "$": "dollar", "@": "snabel-a", "#": "nummer", "[": "vänster hakparentes", "]": "höger hakparentes",
  "{": "vänster klammerparentes", "}": "höger klammerparentes", "|": "lodstreck", "\\": "omvänt snedstreck", "€": "euro",
  "´": "akut accent", "`": "grav accent", "^": "cirkumflex", "~": "tilde", "¨": "trema",
};

function namn(u: string): string {
  if (/^\p{L}$/u.test(u) || /^\d$/.test(u)) return kappe(u);
  return TECKEN[u] ? `${TECKEN[u]} (${u})` : u;
}

function griffSatz(g: GriffInfo): string {
  const n = namn(g.einheit);
  const var_ = g.lage ? plats(g.lage, g.basis) : null;
  let satz: string;
  if (g.mod) {
    const hall = g.mod === "shift" ? "håll ned Skift med andra handen" : "håll ned Alt Gr";
    satz = `${n}: ${hall} och tryck på tangenten ${kappe(g.basis)}${var_ ? ` (${var_})` : ""}.`;
  } else if (var_) {
    satz = `${n}: ${var_}.`;
  } else {
    return `${n}: platsen på det här tangentbordet är inte beskriven än.`;
  }
  if (g.tot) {
    const mal = lernwegDef("sv").totastenZiele?.[g.einheit] ?? [];
    satz += ` Det är en död tangent: den skriver ingenting förrän du trycker på nästa tangent. Först accenten, sedan bokstaven${mal.length ? ` (${mal.join(" ")})` : ""}.`;
  }
  return satz;
}

// ── Särskilda delar ──────────────────────────────────────────────────────────

function skiftDel(): string {
  return (
    "En stor bokstav skriver du genom att hålla ned Skift med andra handen: för en bokstav på vänster sida av tangentbordet " +
    "höger Skift, för en bokstav på höger sida vänster Skift. Båda Skift-tangenterna trycker du på med lillfingret."
  );
}

// ── Ordningen ────────────────────────────────────────────────────────────────

const fast = (text: string) => () => text;
const RAD = (t: readonly string[]) => `Grundraden: ${kappen(t)}`;
const VANLIGA = (t: readonly string[]) => `Vanliga bokstäver: ${kappen(t)}`;
const FLER = (t: readonly string[]) => `Fler bokstäver: ${kappen(t)}`;

const PLANER: readonly LektionsBauplan[] = [
  {
    id: "sv-grund-1", kind: "home",
    // Falle 41: tecknen på KeyF/KeyJ på huvudtangentbordet - läses först när lektionen byggs.
    get einheiten() {
      return [...heimZeichenDesWeges("sv")];
    },
    titel: RAD,
    vorspann: fast(
      "Lägg fingrarna på grundraden - det är grundställningen. På F och J känner du små upphöjningar: så hittar du rätt utan " +
        "att titta på tangentbordet. Du börjar med de här två tangenterna, med båda pekfingrarna. Varje finger går ut härifrån " +
        "och kommer tillbaka hit.",
    ),
  },
  {
    id: "sv-grund-2", kind: "home", einheiten: ["d", "k"], titel: RAD,
    vorspann: fast("Bredvid pekfingrarna kommer långfingrarna: D till vänster, K till höger. Pekfingrarna ligger kvar på upphöjningarna."),
  },
  {
    id: "sv-grund-3", kind: "home", einheiten: ["s", "l"], titel: RAD,
    vorspann: fast("Nu kommer ringfingrarna: S till vänster, L till höger. Fingrarna är lätta och avslappnade."),
  },
  {
    id: "sv-grund-4", kind: "home", einheiten: ["a", "ö"],
    titel: (t) => `Hela grundraden: ${kappen(t)}`,
    vorspann: fast(
      'Vänster lillfinger går till A, höger lillfinger till Ö, bredvid L. Ö är en egen bokstav med en egen tangent. Nu är ' +
        'grundraden klar: åtta fingrar på åtta tangenter, tummarna på Mellanslag. De första orden: "fall", "sal", "kall" och "sjö".',
    ),
  },
  {
    id: "sv-vanliga-1", kind: "letters", einheiten: ["e", "i"], titel: VANLIGA,
    vorspann: fast('E och I hör till de vanligaste bokstäverna på svenska. Med dem skriver du redan: "is", "fisk", "lek", "sked", "fika" och "eld".'),
  },
  {
    id: "sv-vanliga-2", kind: "letters", einheiten: ["ä", "r"], titel: VANLIGA,
    vorspann: fast('Ä är också en egen bokstav, bredvid Ö. Med Ä och R: "är", "där", "säl", "räka" och "fred".'),
  },
  {
    id: "sv-vanliga-3", kind: "letters", einheiten: ["t", "n"], titel: VANLIGA,
    vorspann: fast('Med T och N: "nej", "tre", "katt", "sten", "tid" och "tänder".'),
  },
  {
    id: "sv-vanliga-4", kind: "letters", einheiten: ["g", "h"], titel: VANLIGA,
    vorspann: fast('Med G och H: "hej", "glad", "hand", "gris", "dag" och "hälsning".'),
  },
  {
    id: "sv-versaler", kind: "shift", einheiten: [], enablesShift: true,
    titel: () => "Stora bokstäver med Skift",
    vorspann: fast(
      'Hittills har Tastenflow skrivit de stora bokstäverna åt dig. Nu gör din hand det själv: "Anna", "Erik", "Sara", ' +
        '"Linnea" och "Sälen". Med stor bokstav först skriver du redan en hel mening: "Jag heter Sara".',
    ),
    griffe: skiftDel,
  },
  {
    id: "sv-skiljetecken-1", kind: "punctuation", einheiten: [".", ","],
    titel: () => "Punkt och komma: . ,",
    vorspann: fast(
      'En mening börjar med stor bokstav och slutar med punkt. Kommatecknet delar upp meningen. Före de här tecknen kommer ' +
        'inget mellanslag, efter dem kommer ett. Prova: "Ja, det är Sara." och "Hej, Erik."',
    ),
  },
  {
    id: "sv-bokstaver-1", kind: "letters", einheiten: ["o", "m"], titel: FLER,
    vorspann: fast('Med O och M: "om", "mor", "sol", "mamma", "hemma" och "skola".'),
  },
  {
    id: "sv-bokstaver-2", kind: "letters", einheiten: ["v", "u"], titel: FLER,
    vorspann: fast('Med V och U: "vi", "ut", "du", "hus", "vatten" och "vinter".'),
  },
  {
    id: "sv-bokstaver-3", kind: "letters", einheiten: ["å", "p"], titel: FLER,
    vorspann: fast('Å är den tredje egna bokstaven, bredvid P. Med Å och P: "på", "år", "gå", "spår", "påse" och "åtta".'),
  },
  {
    id: "sv-bokstaver-4", kind: "letters", einheiten: ["b", "c"], titel: FLER,
    vorspann: fast('Med B och C: "bok", "bil", "boll", "bröd" och "cirkel".'),
  },
  {
    id: "sv-ovanliga", kind: "letters", einheiten: ["y", "x", "w", "z", "q"],
    titel: (t) => `Ovanligare bokstäver: ${kappen(t)}`,
    vorspann: fast('Y, X, W, Z och Q: "ny", "by", "flyga", "yxa", "taxi", "wok" och "zebra".'),
  },
  {
    id: "sv-accent", kind: "letters", einheiten: ["´"],
    titel: () => "Akut accent: ´",
    vorspann: fast(
      'Akut accent sitter på en död tangent: den skriver ingenting förrän du trycker på nästa tangent. Först accenten, sedan ' +
        'E - så blir det é: "idé", "armé" och "kafé".',
    ),
  },
  {
    id: "sv-skiljetecken-2", kind: "punctuation", einheiten: ["?", "!", "-", ":", ";", "\"", "'", "(", ")"],
    titel: (t) => `Fler skiljetecken: ${t.join(" ")}`,
    vorspann: fast(
      'Frågetecknet avslutar en fråga, utropstecknet ett utrop. Bindestrecket binder ihop delar av ord: "e-post". Parenteser ' +
        'omger en kommentar. Prova: "Vad heter du?", "Hej!" och "(tips)".',
    ),
  },
  {
    id: "sv-siffror", kind: "numbers", einheiten: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    titel: () => "Sifferraden",
    vorspann: fast("Datum, tider, priser och resultat: nu kommer siffrorna. Varje finger går uppåt i sin egen kolumn."),
  },
  {
    id: "sv-tecken-1", kind: "symbols", einheiten: ["%", "&", "/", "+", "*", "=", "_", "<", ">"],
    titel: (t) => `Tecken: ${t.join(" ")}`,
    vorspann: fast("De här tecknen behövs för räkning, procent och arbete vid datorn. Här är noggrannhet viktigare än fart."),
  },
  {
    id: "sv-tecken-2", kind: "symbols", einheiten: ["#", "@", "$", "€", "[", "]", "{", "}", "\\", "|"],
    titel: (t) => `Fler tecken: ${t.join(" ")}`,
    vorspann: fast("Tecken för e-postadresser, priser och programkod. De är svårast, därför kommer de sist."),
  },
  {
    id: "sv-texter", kind: "text", einheiten: [], corpusKinds: ["satz"],
    titel: () => "Texter",
    vorspann: fast(
      "Nu är hela tangentbordet ditt och du skriver hela texter: från Kiruna till Malmö, från Göteborg till Helsingfors, " +
        "berättelser om skolan, idrott, djur och en vanlig dag.",
    ),
  },
];

// ── Bygga per tangentbord ────────────────────────────────────────────────────

/** Die Folge der Lektions-IDs (für Wächter und Handbuch). */
export const SV_LEKTIONS_IDS: readonly string[] = PLANER.map((p) => p.id);

/** Der GESCHRIEBENE erste Absatz einer Lektion (für den Beispielwort-Wächter). */
export function svLektionsVorspannFuer(id: string, tasten: readonly string[]): string {
  return PLANER.find((p) => p.id === id)?.vorspann(tasten) ?? "";
}

const bauen = lektionenJeTastatur("sv", ["sv"], PLANER, griffSaetzeAusInfo((g: GriffInfo) => griffSatz(g)));

/** Die Lektionen des Weges „sv" auf dieser Tastatur (gecacht). */
export function svLektionenFuerLayout(layoutId: LayoutId): readonly Lesson[] {
  return bauen(layoutId);
}
