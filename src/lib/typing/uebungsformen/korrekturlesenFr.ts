/**
 * ★ E10b-2 (26.09.2026): „Korrekturlesen" auf Weg „fr" - in jedem Satz steht
 * ein falsches, ECHTES Wort, das man deutlich anders hört (Johannes
 * 02.09.2026: der Fehler muss hörbar sein) und das im Satz offensichtlich
 * nicht stimmt. Neu auf Französisch geschrieben, nicht übersetzt.
 *
 * ⚠️ Kein Paar, das gleich KLINGT (*mer/mère, lait/laid, verre/vert*): für
 * eine Sprachausgabe wäre der Fehler unhörbar - eine Aufgabe gegen das Kind.
 * Kein richtiges Wort mit `œ` (auf keiner Pflicht-Tastatur tippbar).
 */
import type { Korrekturfall } from "./korrekturlesen";

export const KORREKTUR_FR: readonly Korrekturfall[] = [
  { satz: "Nous habitons dans une grande raison.", falsch: "raison", richtig: "maison" },
  { satz: "Nous mangeons tous autour de la sable.", falsch: "sable", richtig: "table" },
  { satz: "Les abeilles fabriquent du ciel.", falsch: "ciel", richtig: "miel" },
  { satz: "Les oiseaux volent haut dans le miel.", falsch: "miel", richtig: "ciel" },
  { satz: "En hiver, il tombe de la beige.", falsch: "beige", richtig: "neige" },
  { satz: "Je bois mon chocolat chaud dans un col.", falsch: "col", richtig: "bol" },
  { satz: "Le chien content remue la roue.", falsch: "roue", richtig: "queue" },
  { satz: "Au zoo, la girafe tend son long clou.", falsch: "clou", richtig: "cou" },
  { satz: "Pour dessiner, je prends un rayon.", falsch: "rayon", richtig: "crayon" },
  { satz: "Mon frère joue au foot avec un salon.", falsch: "salon", richtig: "ballon" },
  { satz: "Le matin, le réveil sonne à sept beurres.", falsch: "beurres", richtig: "heures" },
  { satz: "Une semaine compte sept fours.", falsch: "fours", richtig: "jours" },
  { satz: "Une année compte douze bois.", falsch: "bois", richtig: "mois" },
  { satz: "Pour entendre la musique, on a besoin de ses genoux.", falsch: "genoux", richtig: "oreilles" },
  { satz: "La vache nous donne du thé.", falsch: "thé", richtig: "lait" },
  { satz: "Le soir, je me lave les dents avec une crosse.", falsch: "crosse", richtig: "brosse" },
  { satz: "La nuit, on voit la lune et les toiles.", falsch: "toiles", richtig: "étoiles" },
  { satz: "Le petit bateau flotte sur le sac.", falsch: "sac", richtig: "lac" },
  { satz: "Il fait froid, je mets mon bateau.", falsch: "bateau", richtig: "manteau" },
  { satz: "Au marché, on achète des pommes et des soirs.", falsch: "soirs", richtig: "poires" },
  { satz: "L'enseignante écrit la date sur le rideau.", falsch: "rideau", richtig: "tableau" },
  { satz: "Le jardinier arrose les peurs.", falsch: "peurs", richtig: "fleurs" },
  { satz: "Les pompiers éteignent le jeu.", falsch: "jeu", richtig: "feu" },
  { satz: "Le boulanger sort le pain du tour.", falsch: "tour", richtig: "four" },
  { satz: "Le train roule sur les ailes.", falsch: "ailes", richtig: "rails" },
  { satz: "Le pêcheur attrape un gros coussin.", falsch: "coussin", richtig: "poisson" },
];
