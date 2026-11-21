/**
 * ★ E10b-2 (26.09.2026): Wortketten nach Thema für Weg „fr" - der Baustoff
 * der Form „Hand-Schwerpunkte" (`handschwerpunkte.ts` filtert daraus die
 * Wörter, die sich mit EINER Hand tippen lassen - auf der Tastatur des
 * Kindes, über `fingerForChar`).
 *
 * Französische Nomen werden nicht grossgeschrieben - wie im Englischen gibt
 * es darum nur die Schwerpunkte „links" und „rechts", nie „umschalt-*". Die
 * Themen tragen bewusst viele Wörter, die auf AZERTY einhändig sind (links:
 * *vert, cave, arbre, tasse, crabe*; rechts: *lion, loup, joli, kimono,
 * moulin, pull*), und ebenso solche für QWERTZ/QWERTY (Schweiz, Kanada).
 * Kein ê/â/ï (zwei Anschläge), neue Rechtschreibung (*flute, ognon*).
 */
import type { Wortkette } from "./wortkettenThemen";

const ALLE_STUFEN: Wortkette["stufen"] = ["kids", "teens", "erwachsen"];

export const WORTKETTEN_FR: Wortkette[] = [
  {
    thema: "Les animaux",
    woerter: ["chat", "chien", "lion", "loup", "cheval", "vache", "poule", "lapin", "souris", "crabe", "zèbre", "girafe", "mouton", "singe", "minou", "koala"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "La cuisine",
    woerter: ["tasse", "verre", "sucre", "tarte", "pain", "lait", "riz", "sel", "café", "recette", "dessert", "pomme", "poire", "kiwi", "ognon", "kilo", "melon"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "La maison",
    woerter: ["porte", "table", "chaise", "lit", "lampe", "cave", "garage", "salon", "cuisine", "tapis", "mur", "toit", "escalier", "jardin", "moulin", "grenier"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "La nature",
    woerter: ["arbre", "fleur", "herbe", "terre", "pierre", "vent", "pluie", "neige", "soleil", "lune", "étoile", "rivière", "lac", "colline", "désert", "sable"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "L'école",
    woerter: ["classe", "cahier", "crayon", "stylo", "règle", "cartable", "texte", "dictée", "lecture", "leçon", "trousse", "tableau", "papier", "livre", "ardoise", "craie"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Le corps",
    woerter: ["bras", "main", "pied", "dos", "nez", "joue", "cou", "genou", "doigt", "ventre", "dent", "bouche", "oreille", "menton", "poil", "peau"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Les vêtements",
    woerter: ["pull", "veste", "robe", "pantalon", "chemise", "bonnet", "gant", "écharpe", "manteau", "chaussette", "botte", "short", "pyjama", "kimono", "polo"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Les couleurs",
    woerter: ["vert", "verte", "gris", "bleu", "rouge", "jaune", "noir", "blanc", "rose", "violet", "orange", "marron", "beige", "doré"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Le temps",
    woerter: ["lundi", "mardi", "jeudi", "samedi", "dimanche", "matin", "soir", "midi", "nuit", "jour", "semaine", "mois", "année", "hiver", "été", "juin"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Le sport",
    woerter: ["ballon", "course", "saut", "vélo", "judo", "tennis", "rugby", "danse", "nage", "match", "équipe", "but", "filet", "piste", "pompon"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "La musique",
    woerter: ["piano", "guitare", "violon", "flute", "tambour", "chant", "chanson", "note", "rythme", "concert", "orchestre", "micro", "son", "voix"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Les petits mots",
    woerter: ["des", "ses", "est", "avec", "cet", "tes", "sur", "mon", "non", "nom", "oui", "lui", "moi", "loin", "joli", "poli", "plus", "pour", "puis", "mais"],
    stufen: ALLE_STUFEN,
  },
];
