/**
 * ★ E10b-2 (26.09.2026): die häufigen Buchstabenverbindungen des
 * Französischen für das Geläufigkeitsschreiben (`gelaeufigkeit.ts`) - neu
 * gewählt, nicht übertragen: die Laute, die im Französischen aus MEHREREN
 * Buchstaben bestehen (*ou, on, an, oi, ai, eau, qu, ch, gn, ill*), die
 * häufigen Endungen (*tion, ment, eur, ette, elle, ée, er, ez, ait*) und
 * Anfänge (*gr, tr, pl, br, cr*). Dieselbe Fingerfolge mehrmals kurz
 * hintereinander ist genau das, was Zehnfingerschreiben automatisiert.
 *
 * Alle Wörter klein (französische Nomen werden nicht grossgeschrieben), echte
 * Alltagswörter, neue Rechtschreibung, kein ê/â/î/ô/û/ë/ï (die Auswahl prüft
 * mit `fitText` ohne Totasten-Regel - solche Wörter fielen still heraus).
 */
import type { Verbindung } from "./gelaeufigkeit";

export const VERBINDUNGEN_FR: Verbindung[] = [
  { folge: "ou", stelle: "mitte", woerter: ["loup", "roue", "jour", "tout", "sous", "mouton", "poule", "soupe", "bouche"] },
  { folge: "on", stelle: "ende", woerter: ["bon", "son", "mon", "ballon", "maison", "mouton", "poisson", "crayon", "citron"] },
  { folge: "an", stelle: "mitte", woerter: ["dans", "maman", "grand", "enfant", "banc", "chant", "danse", "orange", "plante"] },
  { folge: "en", stelle: "mitte", woerter: ["vent", "dent", "tente", "ventre", "menton", "entrer", "pendant", "cendre"] },
  { folge: "in", stelle: "ende", woerter: ["lapin", "sapin", "matin", "jardin", "moulin", "chemin", "raisin", "dauphin"] },
  { folge: "oi", stelle: "mitte", woerter: ["roi", "soir", "noir", "voiture", "toit", "boite", "oiseau", "poire", "voisin"] },
  { folge: "ai", stelle: "mitte", woerter: ["lait", "main", "pain", "maison", "chaise", "fraise", "laine", "semaine"] },
  { folge: "eau", stelle: "ende", woerter: ["eau", "beau", "bateau", "chapeau", "oiseau", "cadeau", "rideau", "manteau", "tableau", "couteau"] },
  { folge: "qu", stelle: "anfang", woerter: ["que", "qui", "quand", "quatre", "question", "quartier", "quinze", "quel"] },
  { folge: "ch", stelle: "anfang", woerter: ["chat", "chien", "cheval", "chaise", "chemin", "chanson", "chocolat", "chose"] },
  { folge: "gn", stelle: "mitte", woerter: ["ligne", "signe", "montagne", "champignon", "campagne", "peigne", "agneau", "araignée"] },
  { folge: "ill", stelle: "mitte", woerter: ["fille", "famille", "feuille", "bille", "grille", "papillon", "chenille", "abeille"] },
  { folge: "tion", stelle: "ende", woerter: ["question", "attention", "addition", "station", "potion", "direction", "solution", "récréation"] },
  { folge: "ment", stelle: "ende", woerter: ["moment", "vraiment", "doucement", "lentement", "rapidement", "seulement", "gentiment"] },
  { folge: "eur", stelle: "ende", woerter: ["fleur", "peur", "couleur", "chaleur", "docteur", "facteur", "moteur", "odeur"] },
  { folge: "ette", stelle: "ende", woerter: ["chouette", "fourchette", "trompette", "raquette", "baguette", "assiette", "galette"] },
  { folge: "elle", stelle: "ende", woerter: ["elle", "belle", "pelle", "vaisselle", "ficelle", "poubelle", "coccinelle", "hirondelle"] },
  { folge: "ée", stelle: "ende", woerter: ["idée", "fusée", "année", "fée", "poupée", "journée", "soirée", "fumée"] },
  { folge: "er", stelle: "ende", woerter: ["manger", "jouer", "parler", "danser", "chanter", "rester", "trouver", "regarder"] },
  { folge: "ez", stelle: "ende", woerter: ["nez", "chez", "assez", "allez", "venez", "avez", "parlez"] },
  { folge: "ait", stelle: "ende", woerter: ["lait", "fait", "avait", "était", "parlait", "jouait", "souhait"] },
  { folge: "oin", stelle: "mitte", woerter: ["loin", "coin", "point", "soin", "besoin", "moins", "pointu", "témoin"] },
  { folge: "ien", stelle: "ende", woerter: ["bien", "chien", "rien", "lien", "ancien", "musicien", "magicien", "gardien"] },
  { folge: "eil", stelle: "ende", woerter: ["soleil", "réveil", "pareil", "conseil", "sommeil", "orteil", "appareil"] },
  { folge: "ph", stelle: "mitte", woerter: ["photo", "phrase", "phoque", "alphabet", "téléphone", "dauphin", "éléphant", "pharmacie"] },
  { folge: "gr", stelle: "anfang", woerter: ["grand", "gros", "gris", "grenouille", "graine", "grue", "groupe", "grimace"] },
  { folge: "tr", stelle: "anfang", woerter: ["train", "trois", "trou", "tresse", "tricot", "trompe", "travail", "tracteur"] },
  { folge: "pl", stelle: "anfang", woerter: ["plume", "pluie", "place", "plat", "plage", "planche", "plante", "plein"] },
  { folge: "br", stelle: "anfang", woerter: ["bras", "bruit", "brosse", "branche", "brique", "bravo", "brebis", "brouillard"] },
  { folge: "cr", stelle: "anfang", woerter: ["crayon", "crabe", "crème", "croix", "crocodile", "cri", "creuser", "cravate"] },
  { folge: "ss", stelle: "mitte", woerter: ["poisson", "tasse", "classe", "caisse", "coussin", "dessin", "brosse", "trousse"] },
];
