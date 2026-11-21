/**
 * Die Regeln für JEDE Textzeile der Tippchallenge auf den Wegen „pt", „br" und „sv" (W3, 30.10.2026) - eine Stelle, die das
 * Prüfskript `scripts/pruefe-schreibproben.mts` und die Wächter `tests/tastenflow-reto-{pt,br,sv}.test.ts` gemeinsam benutzen.
 * Vorbild: `tests/helfer/csTextRegeln.ts` und die cs-Teile des Prüfskripts. Quellen: die Glossare (§1 und die Sperrspalte
 * „PT-PT"/„pt-BR anders"), Prüfberichte Texte Charge 1, Hausregeln.
 *
 * pt und br sind ZWEI Wege und werden nie gemischt: pt ist Portugal (tu, AO1990), br ist Brasilien (você). Beide Wortlisten unten
 * sind Stichproben, kein Ersatz für die Lesung durch Menschen mit der Sprache als Erstsprache.
 */
import { layoutById, type KeyboardLayout, type LayoutId } from "../../src/lib/typing/layouts";
import { lernwegDef } from "../../src/lib/typing/lernweg";
import { gesperrtBr, istKernGesperrtBr } from "../../src/lib/typing/sperrlisteBr";
import { gesperrtPt, istKernGesperrtPt } from "../../src/lib/typing/sperrlistePt";
import { gesperrtSv, istKernGesperrtSv } from "../../src/lib/typing/sperrlisteSv";

export type W3Weg = "pt" | "br" | "sv";
export const W3_WEGE: readonly W3Weg[] = ["pt", "br", "sv"];

/** Die Tastaturen des Weges (`TASTATUREN_DER_SPRACHE`): je eine. */
export const W3_TASTATUREN: Readonly<Record<W3Weg, readonly LayoutId[]>> = { pt: ["pt"], br: ["br-abnt2"], sv: ["sv"] };

/** Totaste ⇒ der verbindende Akzent (NFD). */
const AKZENT: Readonly<Record<string, string>> = { "´": "́", "~": "̃", "^": "̂", "`": "̀" };

/** Der Vorrat des Reto: die Totasten selbst sind kein Zeichen, dafür ihre Ziele, sobald Totaste UND Grundbuchstabe gelernt sind. */
export function w3Vorrat(basis: ReadonlySet<string>, weg: W3Weg): Set<string> {
  const ziele = lernwegDef(weg).totastenZiele ?? {};
  const out = new Set(basis);
  for (const tot of Object.keys(ziele)) out.delete(tot);
  out.delete("¨");
  for (const [tot, liste] of Object.entries(ziele)) {
    if (!basis.has(tot)) continue;
    for (const z of liste) if (basis.has(z.normalize("NFD")[0])) out.add(z);
  }
  return out;
}

/** Gibt es dieses Zeichen auf DIESER Tastatur? Eigene Taste, Griff ohne Totaste, Umschalt - oder Totaste + Grundbuchstabe (auch gross). */
export function w3Tippbar(l: KeyboardLayout, c: string, weg: W3Weg): boolean {
  if (c === " ") return true;
  if (l.missing.includes(c) || (l.grossFehlt ?? []).includes(c)) return false;
  const klein = c.toLowerCase();
  const inReihe = (x: string) => l.rows.some((r) => r.keys.includes(x));
  const zugang = l.access[c];
  if (zugang) return !zugang.dead;
  if (inReihe(c)) return true;
  if (klein !== c && inReihe(klein)) return !Object.values(l.access).some((x) => x.base === klein && x.mod === "shift");
  const ziele = lernwegDef(weg).totastenZiele ?? {};
  for (const [tot, liste] of Object.entries(ziele)) {
    if (!liste.includes(klein)) continue;
    const zerlegt = klein.normalize("NFD");
    if (zerlegt[1] === AKZENT[tot] && l.access[tot]?.dead === true && inReihe(zerlegt[0])) return true;
  }
  return false;
}

/** Jedes Zeichen der Zeile, das auf einer Tastatur des Weges keinen Griff hat. */
export function w3TastaturBefunde(zeile: string, weg: W3Weg): string[] {
  const out: string[] = [];
  for (const c of new Set(zeile)) {
    for (const id of W3_TASTATUREN[weg]) {
      if (!w3Tippbar(layoutById(id), c, weg)) out.push(`„${c}" fehlt auf der Tastatur ${id}`);
    }
  }
  return out;
}

/** Wörter nur aus Portugal: im Weg „br" ein Fehler (Glossar pt-BR, Sperrspalte). */
export const NUR_PT: readonly string[] = [
  "autocarro", "autocarros", "comboio", "comboios", "telemóvel", "telemóveis", "ecrã", "ecrãs", "ficheiro", "ficheiros", "utilizador",
  "utilizadores", "equipa", "equipas", "facto", "factos", "pequeno-almoço", "casa de banho", "sumo", "sumos", "frigorífico", "passadeira",
  "tens", "estás", "queres", "podes", "sabes", "vais", "contigo", "palavra-passe", "rapariga", "raparigas", "miúdo", "miúda", "miúdos", "miúdas",
  "ténis", "fixe", "gelado", "gelados", "camião", "camiões", "económico", "económica", "género", "fenómeno", "fenómenos", "atómico", "académico",
];
/** Wörter und Formen nur aus Brasilien: im Weg „pt" ein Fehler (Glossar pt, Falle §4 Nr. 1). */
export const NUR_BR: readonly string[] = [
  "você", "vocês", "ônibus", "trem", "trens", "celular", "celulares", "tela", "telas", "arquivo", "arquivos", "usuário", "usuários", "fato", "fatos",
  "time", "times", "banheiro", "banheiros", "café da manhã", "suco", "sucos", "geladeira", "calçada", "sorvete", "sorvetes", "mouse", "garota", "garotas",
  "moleque", "rodada", "registro", "caminhão", "caminhões", "esporte", "esportes", "econômico", "econômica", "gênero", "fenômeno", "fenômenos",
  "atômico", "acadêmico", "planilha", "planilhas", "senha", "senhas", "xícara", "bonde", "pedágio", "tênis",
];
/** Hausregeln (Person zuerst, nie gegen ein Kind, keine Maus-Wörter): die Stichprobe je Sprache. */
const HAUSREGEL: Readonly<Record<W3Weg, RegExp>> = {
  pt: /(?<!\p{L})(às cegas|invisuais?|deficientes?|aleijad[ao]s?|mongol[ao]?s?|clicar|clique|cliques|retardad[ao]s?|burr[ao]s?|preguiços[ao]s?)(?!\p{L})/iu,
  br: /(?<!\p{L})(às cegas|deficientes?|aleijad[ao]s?|mongol[ao]?s?|clicar|clique|cliques|retardad[ao]s?|burr[ao]s?|preguiços[ao]s?|ceguinh[ao]s?)(?!\p{L})/iu,
  sv: /(?<!\p{L})(handikappade?|mongo|klicka|klickar|klickade|klick|musen|dum|dumma|korkade?|blindskriv\p{L}*|lytt\p{L}*)(?!\p{L})/iu,
};
/** Keine Religion, keine Politik, keine Feiertage, keine Staatssymbole im Reto. */
const THEMA: Readonly<Record<W3Weg, RegExp>> = {
  pt: /(?<!\p{L})(igrejas?|padres?|papa|missa|deus|natal|páscoa|governo|presidente|ministr[oa]s?|partidos?|eleições|salazar|bandeiras?|hino|guerras?)(?!\p{L})/iu,
  br: /(?<!\p{L})(igrejas?|padres?|papa|missa|deus|natal|páscoa|carnaval|governo|presidente|ministr[oa]s?|partidos?|eleições|bandeiras?|hino|guerras?)(?!\p{L})/iu,
  sv: /(?<!\p{L})(kyrk[ao]\p{L}*|präst\p{L}*|gud|jul|julen|påsk\p{L}*|regering\p{L}*|statsminister\p{L}*|partier|riksdag\p{L}*|valet|kung\p{L}*|flagg\p{L}*|krig\p{L}*)(?!\p{L})/iu,
};
const ERLAUBT: Readonly<Record<W3Weg, RegExp>> = {
  pt: /^[A-Za-zçáéíóúãõâêôàÇÁÉÍÓÚÃÕÂÊÔÀ0-9 .,?!:;'"«»()\-%&/+*=_<>$#|\\@[\]{}€]+$/u,
  br: /^[A-Za-zçáéíóúãõâêôàÇÁÉÍÓÚÃÕÂÊÔÀ0-9 .,?!:;'"()\-%&/+*=_<>$@#[\]{}\\|]+$/u,
  sv: /^[A-Za-zåäöéÅÄÖÉ0-9 .,?!:;'"()\-%&/+*=_<>#@$€[\]{}\\|]+$/u,
};
const TYPOGRAFISCH = /[„“”‚‘’…–—   ]/u;
const wortRegex = (w: string) => new RegExp(`(?<!\\p{L})${w}(?!\\p{L})`, "iu");
const NUR_PT_RE = NUR_PT.map((w) => [w, wortRegex(w)] as const);
const NUR_BR_RE = NUR_BR.map((w) => [w, wortRegex(w)] as const);

/** Alle Verstösse einer Prosa-Zeile (oder eines Kommentars) gegen die Regeln des Weges - leere Liste = in Ordnung. */
export function w3ZeilenFehler(zeile: string, weg: W3Weg): string[] {
  const f: string[] = [];
  if (TYPOGRAFISCH.test(zeile)) f.push("typografisches Zeichen (nur gerade Anführung, Apostroph, Bindestrich, kein U+00A0)");
  else if (!ERLAUBT[weg].test(zeile)) f.push(`Zeichen „${[...zeile].find((c) => !ERLAUBT[weg].test(c))}" ist nicht im Zeichensatz des Weges ${weg}`);
  if (/\s[,.?!:;]/.test(zeile)) f.push("Leerzeichen vor , . ? ! : ;");
  if (/\s{2,}/.test(zeile) || zeile !== zeile.trim()) f.push("doppelte oder umgebende Leerzeichen");
  if (/^\s*-\s/.test(zeile)) f.push("Dialogstrich am Anfang (wörtliche Rede mit Anführungszeichen)");
  if (/\d\.(\s|$)/.test(zeile)) f.push("Zahl mit Punkt dahinter (die Stimme läse eine Ordnungszahl)");
  const haus = HAUSREGEL[weg].exec(zeile);
  if (haus) f.push(`Hausregel-Wort „${haus[0]}"`);
  const thema = THEMA[weg].exec(zeile);
  if (thema) f.push(`Thema Religion/Politik/Feiertag/Staat: „${thema[0]}"`);
  if (weg === "br") for (const [w, re] of NUR_PT_RE) if (re.test(zeile)) f.push(`„${w}" ist Portugal - im Weg br ein Fehler`);
  if (weg === "pt") for (const [w, re] of NUR_BR_RE) if (re.test(zeile)) f.push(`„${w}" ist Brasilien - im Weg pt ein Fehler`);
  if (weg === "pt" && /(?<!\p{L})(estou|estás|está|estamos|estão|estava|estavam)\s+\p{L}+ndo(?!\p{L})/iu.test(zeile)) {
    f.push("Verlaufsform mit Gerundium ist Brasilien (Portugal: estar a + Infinitiv)");
  }
  if (weg === "br" && /(?<!\p{L})(estou|está|estamos|estão|estava|estavam)\s+a\s+\p{L}+r(?!\p{L})/iu.test(zeile)) {
    f.push("estar a + Infinitiv ist Portugal (Brasilien: Gerundium)");
  }
  if (weg !== "pt" && /[«»]/.test(zeile)) f.push("« » gehören nur zum Weg pt");
  return f;
}

/** Die Wörter der Zeile aus dem Kern der Sperrliste (gilt überall, auch in Texten). */
export function w3SperrKern(zeile: string, weg: W3Weg): string[] {
  const k = weg === "pt" ? istKernGesperrtPt : weg === "br" ? istKernGesperrtBr : istKernGesperrtSv;
  return (zeile.match(/\p{L}+/gu) ?? []).filter((w) => k(w));
}

/** Kern + Wortbasis (strengere Wächterstufe). */
export function w3SperrVoll(zeile: string, weg: W3Weg): string[] {
  const g = weg === "pt" ? gesperrtPt : weg === "br" ? gesperrtBr : gesperrtSv;
  return (zeile.match(/\p{L}+/gu) ?? []).filter((w) => g(w));
}

/** Code: die Teile von `snake_case` und `camelCase` aus dem Kern der Sperrliste. */
export function w3SperrCode(zeile: string, weg: W3Weg): string[] {
  const out: string[] = [];
  for (const w of zeile.match(/[\p{L}_]+/gu) ?? []) for (const t of w.split(/_|(?=[A-Z])/)) if (t) out.push(...w3SperrKern(t, weg));
  return out;
}

/** Der Text eines Kommentars (Zeile, die mit `#`, `//` oder `--` beginnt); sonst `null`. */
export function w3CodeKommentar(zeile: string): string | null {
  const m = /^ *(?:#|\/\/|--) ?(.*)$/.exec(zeile);
  return m ? m[1].trim() : null;
}
