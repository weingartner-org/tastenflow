/**
 * Lexikon-Nachtrag Englisch - aus `lexicon.ts` herausgelöst (28.09.2026), Inhalt
 * unverändert. Eine reine Wortliste ohne Code, damit sie als Blatt im Sprach-
 * Datenpaket des Bündels liegt (`scripts/buendel-aufteilung.ts`): Ändert sich
 * der englische Nachtrag, lädt ein Kind mit einer anderen Sprache nichts neu.
 * ⚠️ Nur `import type` - ein Code-Import hier machte die Datei zum Nicht-Blatt.
 */

/**
 * Dasselbe für Englisch (25.09.2026). Kandidaten aus `/usr/share/dict/words`
 * (macOS, 2-5 Buchstaben, aus einem der 60 englischen Quellwörter baubar, im
 * Lexikon fehlend) - 3.630 Stück, fast alle veraltet oder obskur. Übernommen
 * nur, was ein Kind im Englischunterricht kennen kann; einzeln durchgesehen,
 * mit denselben Ausschlüssen wie oben.
 */
export const NACHTRAG_EN = [
  "ace", "acre", "actor", "adopt", "adore", "adorn", "agile", "alien", "align", "aloe",
  "altar", "alter", "amen", "ape", "arc", "arise", "armor", "atlas", "atop", "awe",
  "bake", "beet", "beret", "bleak", "bleat", "boast", "cadet", "cape", "cease",
  "chant", "chaos", "cheat", "chore", "cite", "clasp", "clip", "clips", "cone",
  "crane", "cue", "dash", "dealt", "dean", "denim", "dime", "dome", "dose", "drape",
  "drip", "earl", "edit", "elite", "ember", "emit", "enact", "epic", "erase", "erect",
  "etch", "gain", "gait", "gem", "gist", "glare", "glint", "gnat", "grant", "grate",
  "grit", "grunt", "halo", "harp", "hem", "hero", "hilt", "hone", "hop", "hue", "icon",
  "idol", "inert", "inset", "iris", "islet", "item", "kilt", "laser", "lash", "limo",
  "lint", "lisp", "loin", "lord", "lore", "mace", "malt", "mare", "marsh", "meek",
  "melon", "merit", "mesh", "mite", "moan", "moat", "mold", "molt", "moose", "mop",
  "motel", "mower", "nag", "nape", "neon", "nip", "node", "nomad", "noose", "norm",
  "oath", "omen", "omit", "onset", "opal", "opt", "oral", "orb", "orca", "ore",
  "ounce", "oust", "pact", "pal", "panel", "pants", "patio", "pea", "peal", "pearl",
  "peat", "pedal", "peel", "pelt", "peril", "pest", "petal", "pier", "pits", "plaid",
  "plait", "plea", "plead", "pleat", "plod", "plot", "pore", "pose", "prime", "prod",
  "prone", "prose", "racer", "rage", "raid", "ram", "ranch", "rant", "rash", "rasp",
  "ratio", "raw", "realm", "recap", "reign", "rein", "relic", "rend", "rid", "rig",
  "riot", "rip", "ripen", "rite", "roast", "rob", "roe", "role", "romp", "roost",
  "rouse", "rue", "rug", "rune", "rut", "saber", "sage", "saint", "sake", "salon",
  "sane", "satin", "scalp", "scan", "scare", "scone", "scorn", "scout", "scrap",
  "sear", "seek", "seep", "sect", "sepia", "sheen", "sheer", "shin", "shone", "shred",
  "shrew", "shun", "sip", "sips", "siren", "sitar", "skate", "skier", "skim", "skirt",
  "skit", "slab", "slain", "slam", "slang", "slap", "sleet", "sling", "smirk", "snag",
  "snarl", "sneer", "snort", "snout", "snug", "soar", "sober", "sofa", "sonar",
  "sonic", "spa", "spade", "spar", "spire", "spite", "spore", "stab", "stain", "steak",
  "steal", "sting", "stoic", "stole", "stomp", "stow", "strap", "strew", "suite",
  "surge", "swat", "swear", "sweat", "tab", "talc", "talon", "tamer", "tape", "taper",
  "tapir", "tarp", "tart", "teak", "teal", "tease", "teen", "teens", "tempo", "tenor",
  "terse", "thaw", "tiara", "tier", "toad", "toe", "toil", "tomb", "tome", "ton",
  "tonic", "torso", "toss", "tour", "tow", "trace", "tramp", "trash", "trek", "triad",
  "truce", "tuna", "tunic", "twin", "unite", "untie", "urge", "usage", "usher", "wad",
  "wand", "wart", "wheat", "whet", "woe", "wrath", "wrest", "writ",
] as const;
