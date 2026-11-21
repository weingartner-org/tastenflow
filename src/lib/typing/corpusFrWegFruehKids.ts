/**
 * Korpus nur für Lernweg "fr", frühe Sprossen 9-24 - Altersstufe Kids (E8a,
 * 25./26.09.2026, Bauplan `BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md` §6,
 * Nachtlauf `NACHTLAUF-2026-09-25-FRANZÖSISCH.md` §2 Punkt 2, Fassung A2).
 *
 * ALLES NEU VERFASST - kein Wort aus den deutschen oder englischen Dateien
 * übernommen oder übertragen (Bauplan §6.2, D2). Jede Zeile ist eigenes Werk
 * auf Französisch (Ausnahme: Zeilen mit `herkunft` - Tatoeba-Originalsätze,
 * Spalte 2 = 0, mit Satznummer/Benutzername/Lizenz, höchstens ein Viertel
 * der Zeilen dieser Datei, Bauplan §6.3/§15 Falle 14).
 *
 * ZEICHENSATZ (Fassung A2, `lernweg.ts`, roher Buchstaben-Index - „Sprosse"
 * = FR_LETTER_ORDER.slice(0, n), OHNE die Umschalt-Einheit mitzuzählen,
 * genau wie `FR_T1_LETTER_END`/`FR_T2_LETTER_END` es tun):
 *   Sprosse  9 (+e):  q s d f j k l m e
 *   Sprosse 10 (+t):  … + t
 *   Sprosse 11 (+n):  … + n
 *   Sprosse 12 (+u):  … + u
 *   Sprosse 13 (+i):  … + i
 *   Sprosse 14 (+a):  … + a
 *   Sprosse 15 (+o):  … + o
 *   Sprosse 16 (+r):  … + r     (T1 komplett - `minTier: 1`)
 *   Sprosse 17 (+p):  … + p
 *   Sprosse 18 (+c):  … + c
 *   Sprosse 19 (+v):  … + v
 *   Sprosse 20 (+'):  … + ' (Elision - „hart", siehe corpus.ts)
 *   Sprosse 21 (+é):  … + é
 *   Sprosse 22 (+b):  … + b
 *   Sprosse 23 (+g):  … + g
 *   Sprosse 24 (+h):  … + h     (T2 komplett - `minTier: 2`)
 * Satzzeichen (FR_PUNCT_ORDER) liegen im heutigen Gerüst ERST hinter dem
 * kompletten Alphabet (Sprosse 34) - darum tragen ALLE Zeilen dieser Datei
 * bewusst KEIN Satzzeichen (kein Punkt, kein Komma): „ab etwa Sprosse 17
 * kurze Sätze OHNE Satzzeichen" (Auftrag E8a). Grossbuchstaben am Satzanfang
 * und bei Eigennamen sind trotzdem erlaubt (Auto-Grossschreibung, siehe
 * KERNREGEL in corpus.ts) - AUSSER bei akzentuierten Grossbuchstaben (É):
 * `LETTER_RE` in corpus.ts kennt nur `[a-zäöüß]`, ein GROSSES É fällt daher
 * nicht in den Buchstaben-Zweig und scheitert an `fitText` (kein Eintrag
 * für „É" im erlaubten Zeichensatz) - ein offener Befund, siehe
 * `BEFUND-2026-09-26-E8A-TEXTE-KINDER.md` §5. Bis das behoben ist: nie ein
 * Wort mit akzentuiertem Grossbuchstaben satzanfangs verwenden (betrifft nur
 * é in diesem Sprossenbereich, à/è liegen erst ab Sprosse 25/27).
 *
 * Weil KEINE Zeile ein inneres Satzschlusszeichen (`. ! ? …`) enthält, gibt
 * es hier keine Mehrsatz-Zeile - `_fruehfassung.mts` braucht für diese Datei
 * also (noch) keine französische Fassung (Bauplan-Auftrag Punkt 4, bedingt
 * mit „falls es Mehrsatz-Zeilen gibt" - hier: nein).
 *
 * Sprossen 9-13 sind durch die vokallose AZERTY-Grundreihe (`q s d f j k l
 * m`, kein Vokal ausser dem neu gelernten „e") zwangsläufig wortarm - dort
 * stehen echte, aber kurze Wortreihen/Wortpaare statt ganzer Sätze (Bauplan-
 * Auftrag: „Silben und Wortreihen nur in den ersten Sprossen"). Ab Sprosse
 * 14 (Artikel „un/une/la", Verb „a/aime") werden es echte, natürliche kurze
 * Sätze für 7-10-Jährige.
 *
 * Themen (Bauplan §6.4/§10.2): Schule, Tiere, Familie, Freundschaft, Spiele,
 * Feste der Frankophonie. Namen aus der ganzen Frankophonie (Bauplan §6.5
 * Regel 7) - mindestens ein Drittel der Vielfalt aus Belgien, der Schweiz,
 * Québec, Afrika und dem Maghreb (hier in den Serien-Dateien konzentriert,
 * da Kurzzeilen selten Eigennamen brauchen).
 *
 * Jede Zeile besteht `fitText` für ihre Sprosse (Wächter:
 * `tests/tastenflow-texte-fr-kinder.test.ts`). Nur anhängen (Bauplan §15
 * Falle 5) - Korpus-Anker im selben Commit (`npx tsx
 * scripts/erzeuge-korpus-anker.mts`).
 */
import type { CorpusItem } from "./corpus";

// Kein Tatoeba-Satz in dieser Datei: Sprosse 9-24 laesst durch das enge
// AZERTY-Alphabet kaum Raum fuer unveraenderte Originalsaetze - jede Zeile
// ist eigenes Werk. Ab E8b/E8c (mehr Buchstaben) wird `herkunft` gebraucht.

export const CORPUS_FR_WEG_FRUEH_KIDS: CorpusItem[] = [
  // ── Sprosse 9 (+e) - reine Wortreihen (nur q s d f j k l m e, kein Verb
  // möglich - "est" braucht ein Prädikat, das es hier noch nicht gibt).
  // NACHBESSERUNG 26.09.2026 (Lese-Abnahme des Chats): nur 7 statt 25 Zeilen -
  // mehr echte, grammatisch saubere Wortreihen gibt der Wortschatz (nur „sel"
  // und „femme", Plural, da „la"/​„une" erst ab Sprosse 14/12 kommen) nicht
  // her, ohne zu Buchstabensalat zu greifen. Klein geschrieben (keine Zeile
  // behauptet, ein Satz zu sein). Siehe BEFUND-2026-09-26-E8A-TEXTE-KINDER.md §1.
  { text: "les sels", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "des sels", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "mes sels", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "ses sels", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "les elfes", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "des elfes", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  // ── Sprosse 10 (+t) - "mets/met/jette" machen echte Sätze möglich ────────
  { text: "Elle met le sel", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Je jette le sel", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Elle jette le sel", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "le mets", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "les mets", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Je teste le sel", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Elle se jette", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Tel est le test", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Je me jette", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  // ── Sprosse 11 (+n) - "sens/sent" (riechen/fühlen), Plural-Wortreihen ────
  { text: "Je sens le sel", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Elle sent le sel", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Elle tend les tentes", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Elle entend les elfes", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "les dents", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "des dents", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "mes dents", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "ses dents", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "les tentes", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "des tentes", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "mes tentes", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "ses tentes", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  // ── Sprosse 12 (+u) - un/une/tu/que: erste unbestimmte Artikel ───────────
  { text: "Tu sens le sel", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Tu es juste", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Elle est juste", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "une lune", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "une dent", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "une tente", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "une dent et une tente", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  // ── Sprosse 13 (+i) - il/elle/je/tu mit lit/dit/suis/es/est ──────────────
  { text: "Le lutin enfile ses lunettes", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Il lit", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Elle lit", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Je lis", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Tu lis", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Il dit", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Elle dit", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Le fil est si fin", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Elle dessine une lune", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Tu finis tes dessins", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Je suis en tenue de ski", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Elle met une tunique", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "un nid", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "une ile", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "midi et minuit", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "lundi et jeudi", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "une ile et un nid", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  // ── Sprosse 14 (+a) - il/elle a, aime, un ami ────────────────────────────
  { text: "Elle a une amie", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Il a un animal", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Elle a un animal", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Salut je suis une amie", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Il a une dent malade", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Elle a la salade et le sel", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Ma tante a un animal", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Ta tante a une amie", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Elle lit la date", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Il fait une salade et sa tante a faim", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Il a une salade sale et un animal malade", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Il a un animal malade", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Elle a un jus et une salade", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Le matin il lit et il dit", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "La salade est fine", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Je sais et tu sais", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Elle a une dent de lait", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Il a faim", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Un enfant aime sa maman", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Maintenant elle a une salade", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  // ── Sprosse 15 (+o) - moto, joli, oui, moi/toi ───────────────────────────
  { text: "Elle lui donne un mot", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Elle a une moto", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Le nid est joli", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Elle est jolie", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Oui il a un domino", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Oui elle lit un mot", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Moi je lis toi tu joues", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Moussa a un domino", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Il a un mot joli", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Elle a des dominos jolis", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Oui la salade est jolie", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Il a une moto et sa tante a une moto aussi", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Malo a un animal joli", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Nous aimons le soleil et la lune", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Elle dit non elle dit oui", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Il lit tous les mots du monde", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  // ── Sprosse 16 (+r) - T1 komplett: tortue, joue, sourit, mardi ──────────
  { text: "Il dort toute la nuit", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Il dit que non", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Il sourit quand il lit", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Ils aiment leur maison", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Elle sourit", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Il rit", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Il a trois amis", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Elle a trois amies", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Karim rit et il joue", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Karine et Marie sont amies", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Omar joue au loto le mardi", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "La rue est jolie le matin", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Idris rit et ses amis rient aussi", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Noor a une amie fine", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Je ris tu ris elle rit", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Je joue tu joues on joue tous", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Alors il sait faire un jeu", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "Un ours ne dit rien", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  { text: "La terre tourne sans fin", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "fr" },
  // ── Sprosse 17 (+p) - erste Sätze ohne Satzzeichen ──────────────────────
  { text: "Elle se repose un peu", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Elle est petite mais elle est forte", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Elle apprend par le jeu", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il prend un fruit ou une eau", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Elle a une famille pleine de rires", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il met un pull tout propre pour le matin", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il perd son jouet dans la rue", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "La pluie arrose la rue", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il attend son ami parti loin", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il apporte trois pommes pour tout le monde", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Elle parle tout le temps", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Puis il prend un peu de jus", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Elle a peur du poisson", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il peut porter un pull", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  // ── Sprosse 18 (+c) - école, classe, copain ──────────────────────────────
  { text: "Il croit en son copain", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Ces enfants aiment jouer tout le temps", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il apprend un mot juste", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Elle compte trois tortues", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "La cantine sert une salade et un jus", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Sa cousine crie son nom dans la cour", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il compte ses trois pommes", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Une cousine court partout", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "La cour est pleine ce matin", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Elle compte ses copains dans la cour", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il aime jouer encore et encore", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  // ── Sprosse 19 (+v) - avec, avoir, animaux ───────────────────────────────
  { text: "Comme il court vite", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il court trop vite", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Tu me vois dans ta tente", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Elle va voir sa copine", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Olivier vit avec ses parents", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il vit une vraie aventure avec ses copains", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il devient plus fort", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Un oiseau vole vers son nid", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Sa moto avance dans la rue", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Elle veut une pomme verte", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Lucas vient avec son papa", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Florence arrive en avance", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il avoue avoir pris la pomme", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il verse le jus dans son verre", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Elle arrive avec ses trois pommes", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il trouve un mot vraiment utile", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il vit avec sa tante et son oncle", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Vive les copains et vive le jeu", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Vous et moi aimons cette voiture", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il va vite et je vais aussi", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Je te vois dans la cour", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  // ── Sprosse 20 (+') - Elision: j'ai, c'est, l'école ──────────────────────
  { text: "Il dit qu'elle est fine", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "C'est mon ami le plus poli", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "C'est la pomme la plus ronde", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "J'aime mon copain tel qu'il est", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "C'est le copain de mon papa", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Qu'il est joli ce nid", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "J'ai un pull pour la sortie", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Ne perds pas ton livre", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "C'est vrai qu'elle court vite", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "J'ai vu ma cousine ce matin", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Tu as quoi dans ton sac", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "C'est mon panier le plus utile", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "J'ai une poire juste ici", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  // ── Sprosse 21 (+é) - école, été, récré, léa ─────────────────────────────
  { text: "Il a trouvé un mot dans son livre", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Elle joue avec Léa pendant la pause", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Elle a créé un joli dessin", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il a réparé son jouet cassé", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Elle a joué au loto avec ses amis", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Léa et Léon jouent dans la cour", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il a croqué une pomme dorée", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Elle a retrouvé sa tortue perdue", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il a écouté son ami avec joie", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Elle a dessiné un soleil doré", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Léon a été le plus rapide de la course", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il a raconté un été passé au parc", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Elle a préféré le fruit doré", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Elle était contente de sa classe et de son école", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il a trouvé un joli vélo", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  // ── Sprosse 22 (+b) - copains, bon, bien, belle ──────────────────────────
  { text: "Quel beau jouet", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il avait une bonne idée pour le jeu", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Elle a un bon copain", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Coumba a un beau cadeau", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Elle a construit un beau nid", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il a un beau cartable bleu", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Sa robe bleue est belle", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Elle a bien travaillé toute la journée", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il a bu son jus tout entier", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Elle a mis ses billes dans son sac", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il construit une cabane avec ses copains", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Coumba boit un jus bien frais", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Elle a un beau sourire ce matin", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il abandonne rarement une partie", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Elle a bercé son petit lapin", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il bricole un bateau avec son cousin", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Modibo a construit un beau cabanon", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Elle a un ballon bien rond", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il a bavardé avec son voisin", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Elle a bercé sa petite cousine avant de dormir", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il boit son lait avant de jouer", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Elle a une bonne idée pour sa classe", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  // ── Sprosse 23 (+g) - jeu, gagne, grand, garçon ──────────────────────────
  { text: "Elle mange un fruit rouge", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il gagne le jeu avec ses copains", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il regarde sa tortue avancer", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Elle garde son pain pour la pause", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il grimpe sur un gros arbre", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Gabriel gagne toujours au loto", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Elle regarde le grand jardin de l'école", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il a un grand copain qui le garde", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il galope avec son grand copain", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Gabriel a gardé son grand cartable bleu", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il grandit vite cette année", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Elle a gagné une belle image", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Elle aime beaucoup lire et apprendre", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il gagne une course avec sa cousine", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Elle organise une sortie pour toute la classe", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il grimpe le grand escalier de l'école", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Elle a gardé un beau souvenir de l'été", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il partage son pain avec un grand copain", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Elle a un jardin plein de grands arbres", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il regarde son grand jardin", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  // ── Sprosse 24 (+h) - T2 komplett: hier, chat, chaque, hugo ──────────────
  { text: "Il faut manger des fruits", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Les petits chiens jouent avec Noah", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il gagne cette fois", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Hier il a gagné un beau cahier", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Chloé a un chien qui court dans la cour", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Théo cherche son chat dans la cour", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Elle a envie de retrouver ses copains", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Noah habite avec sa cousine et son chien", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il a acheté un cahier au marché", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Elle habite une jolie maison sur la colline", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Hier soir il a chanté avec toute sa famille", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Théo cache son chat sous une table", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Elle chante avec ses copains pendant la récré", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Hier elle a joué avec sa cousine", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Noah cherche son chien chaque jour", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Théo a acheté un chapeau pour l'hiver", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Noah habite loin de son école", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Il a acheté un cahier tout neuf", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
  { text: "Oh quelle histoire raconte Hugo", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "fr" },
];
