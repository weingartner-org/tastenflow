/**
 * CHARGE I4 - ENGLISCHES WISSEN, TEIL „Natur" (28.08.2026)
 *
 * ANLASS (gemessen, nicht geschätzt): Der deutsche Korpus trägt 2.482 Bausteine,
 * darunter 344 der Sorte `fakt` und 198 der Sorte `wissen`. Der englische trägt
 * 1.786 Bausteine, davon nur 125 `fakt` und 168 `wissen`. Ein englisch übendes
 * Kind bekommt im Bereich „Wissenswertes" also deutlich weniger zu lesen als ein
 * deutsches. Diese Datei schließt zusammen mit der Schwesterdatei der Charge die
 * Lücke; sie steuert 75 Zeilen aus Natur, Tieren, Pflanzen, Wetter und Klima,
 * Erde und Meer, Weltraum und menschlichem Körper bei.
 *
 * WARUM FAST ALLES AUF TIER 2 STEHT (der eigentliche Engpass): Die frühen
 * Sprossen sind im Englischen fast leer. Wer siebzehn bis zweiundzwanzig
 * Einheiten geschafft hat, kann nur `a b c d e f g h i j k l m n o r s t u w`
 * tippen - `p q v x y z` fehlen. Damit gibt es kein `you`, `they`, `day`,
 * `very`, `plant`, `space`, `up`, `deep`, `keep`, `every`, `have`, `over`,
 * `only` und kein einziges Adverb auf -ly. 71 der 75 Zeilen sind deshalb
 * bewusst so gebaut, dass sie diesen Buchstaben-Bestand einhalten; sie stehen
 * damit ALLEN höheren Ständen ebenfalls zur Verfügung. Nur vier Zeilen liegen
 * auf Tier 3, gemessen mit `minTierFor`: `Reindeer eyes` (y), `the white
 * cliffs of Dover` (v und y), `A wave carries energy` (v und y) und `The
 * deepest sea` (p und v) - dort war der Sachverhalt ohne diese Wörter nicht
 * ehrlich zu sagen.
 *
 * WAS TRUG UND WAS FEHLTE (Arbeitsvorrat für die nächste Charge):
 *  • Statt `plants` trägt `flowers`, `trees`, `roots`, `seeds`, `moss`, `fungi`.
 *  • Statt `space` trägt `the sun`, `a moon of Saturn`, `a black hole`, `Mars`.
 *  • Statt `they/their` trägt der Singular (`a robin ... its ground`) oder der
 *    Umbau in einen Passivsatz (`New blood is made inside our bones`).
 *  • Statt `people` trägt `we` und `our`; statt `day` trägt `at night`,
 *    `at dusk`, `in winter`, `each recent decade`.
 *  • Statt `keeps/keep` trägt `holds`, statt `up` trägt `out`/`aside`.
 *  • `sleeps` scheitert am `p` - `rests` trägt.
 *  • Zahlen sind Wörter: `a thousand bits of mud`, `four months`,
 *    `hundreds of miles`, `thousands of acorns`.
 *
 * WIE BELEGT WURDE (Vorgabe dieser Charge - Wissen wird DOPPELT belegt): Jede
 * Zeile der Sorten `fakt` und `wissen` wurde an ZWEI voneinander unabhängigen
 * Quellen geprüft; beide stehen mit Werk und Rubrik in `herkunft.fundstelle`,
 * samt Abrufdatum. Herangezogen wurden unter anderem: NASA, ESA, NOAA (Ocean
 * Service, Ocean Exploration, Climate.gov, Space Weather Prediction Center),
 * Met Office, Met Éireann, WMO, Royal Meteorological Society, USGS-nahe
 * Fachliteratur, Natural History Museum London, Kew, Plantlife, Woodland Trust,
 * The Wildlife Trusts, RSPB, BTO, Mammal Society, PTES, Kent Wildlife Trust,
 * Natural England, IUCN UK Peatland Programme, British Lichen Society, British
 * Antarctic Survey, Woods Hole Oceanographic Institution, UCL, UC Davis,
 * Britannica, Smithsonian, Royal Society, Nature und PNAS.
 *
 * ZAHLEN, DIE VERALTEN, STEHEN NICHT DRIN. Wo ein Rekord, ein Bestand oder ein
 * Messwert eines Jahres nötig gewesen wäre, ist die Zeile ohne Zahl formuliert
 * („much of", „hundreds of miles", „each recent decade"). Klima kommt als
 * gesicherte Naturwissenschaft vor, nie als Streitfrage und nie als Angstbild -
 * keine Zeile arbeitet mit Bedrohung.
 *
 * ★ KEINE ZEILE TRÄGT `kids` UND `erwachsen` ZUGLEICH (Nachbesserung 28.08.):
 * Die erste Fassung dieser Datei hatte 26 Zeilen für alle drei Stufen. Das hat
 * `tests/typing-altersgrenze.test.ts` gebrochen. Dort läuft eine RATSCHE: die
 * Zahl der englischen Bausteine, die gleichzeitig `kids` (7-10) und
 * `erwachsen` (ab 16) tragen, darf nur SINKEN, nie steigen (Baseline 536; mit
 * dieser Datei und ihrer Schwesterdatei waren es 587). Der Gedanke dahinter:
 * die MITTLERE Stufe teilt sich naturgemäß mit beiden Nachbarn - das ist ihr
 * Zweck -, die beiden ÄUSSEREN aber nicht. Eine Zeile, die zugleich einer
 * Siebenjährigen und einem Erwachsenen serviert wird, ist fast immer ein
 * Zeichen dafür, dass die Rahmung nicht durchdacht wurde. Wer hier anbaut,
 * wählt also von vornherein EINE der beiden Mengen - `ALLE_DREI` gibt es in
 * dieser Datei bewusst nicht mehr.
 *
 * DAS TRENNKRITERIUM, ZEILE FÜR ZEILE ANGELEGT (38 · 37):
 *  • `kids`+`teens` (38): was ein Kind zum Staunen bringt und was es selbst
 *    ansehen, anfassen oder ausprobieren kann - Haselmaus, Mehlschwalbe,
 *    Dachsbau, Seepferdchen, Krebspanzer, Sepia, Rotkehlchen, Möwentanz,
 *    Starenschwarm, Rentieraugen, Regenwurm, Feldhase, Farne, Löwenzahn,
 *    Nebel, Tau, Ebbe und Flut, Nordlicht, Mars, Kometenschweif, Enceladus,
 *    Gleichgewichtssinn, Gehörknöchelchen, Schmecken mit der Nase.
 *  • `teens`+`erwachsen` (37): alles, was einen Zusammenhang ERKLÄRT, einen
 *    Fachbegriff trägt oder Vorwissen braucht - Jetstream, Wärmeaufnahme des
 *    Ozeans, Sättigungsdampfdruck, Sturmbenennung, Nacheiszeit-Hebung
 *    Schottlands, Erdkern, Mittelozeanischer Rücken, Kreidefelsen von Dover,
 *    Cirrus, Feigenblütenstand, Brutparasitismus, Termitenbau, Mykorrhiza,
 *    Flechte, Torfkohlenstoff, Kew als Institution, Sinusknoten,
 *    Lungenoberfläche, Darmflora, Mars-Aurora ohne Magnetfeld.
 *  • Grenzfälle wurden zugunsten des KINDES entschieden, wo der Satz ohne
 *    Fachwort auskommt und ein Bild trägt (Ebbe und Flut, Nordlicht, Marsrost,
 *    Löwenzahn), und zugunsten der ÄLTEREN, wo ein Eigenname oder eine
 *    Fehlvorstellung geradegerückt wird (Bogong-Falter, Korallen als Tiere,
 *    Kew, Glockenblumen-Anteil Britanniens).
 *
 * ENTDOPPELT gegen den GESAMTEN englischen Bestand (1.786 Bausteine, inhaltlich
 * geprüft, nicht nur wörtlich): Bienen, Eulen, Schnecken, Eichhörnchen, Igel,
 * Frösche, Spechte, Füchse, Pinguine, Kamele, Fledermäuse, Seesterne, Wale,
 * Mauersegler, Oktopus, Faultier, Känguru, Schnabeltier, Qualle, schwimmendes
 * Eis, Blitze, Regenbogen, Mondrückseite, Saturnringe, Everest, Sahara,
 * Antarktis, Baumringe, Photosynthese, Knochenzahl und Geschmacksknospen sind
 * dort BEREITS vorhanden und kommen hier NICHT ein zweites Mal vor.
 *
 * Append-only an CORPUS_EN - die Registrierung in `corpus.ts` und der
 * Korpus-Anker sind Sache der Abnahme, nicht dieser Datei.
 */
import type { CorpusItem, Herkunft } from "./corpus";
import type { Stufe } from "./account";

const KIDS_TEENS: Stufe[] = ["kids", "teens"];
const TEENS_ERW: Stufe[] = ["teens", "erwachsen"];

/**
 * Selbst verfasst - aber doppelt belegt: `fundstelle` nennt die zwei
 * unabhängigen Quellen, an denen die Aussage geprüft wurde, samt Abrufdatum.
 */
const EIGEN = (q1: string, q2: string): Herkunft => ({
  quelle: "Sensorik",
  lizenz: "Eigenes Werk (selbst verfasst)",
  autor: "Sensorik-Lernplattform",
  fundstelle: `${q1} · ${q2} · abgerufen 28.08.2026`,
  // Die Fundstelle bleibt deutsch (Prüf-Vermerk je Zeile, nicht Teil von
  //  `en`) - SerienTrainer zeigt in der englischen Bedienung nur eine
  //  reine URL an, keinen Prüfsatz; siehe dortiger Kommentar (24.09.2026).
  en: {
    quelle: "Sensorik",
    lizenz: "Own work (self-written)",
    autor: "Sensorik learning platform",
  },
});

export const EN_I4_NATUR_CORPUS: CorpusItem[] = [
  // ---- Vögel und Säugetiere vor der Haustür ----
  {
    text: "In winter a robin still sings to hold its ground.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    topic: "tiere",
    herkunft: EIGEN("RSPB, Robin bird facts", "Irish Examiner, the truth about the robin redbreast"),
  },
  {
    text: "In robins the female sings in winter as well as the male.",
    kind: "fakt",
    stufen: TEENS_ERW,
    topic: "tiere",
    herkunft: EIGEN("RSPB, Robin bird facts", "BirdGuides, robins as the night-time songsters"),
  },
  {
    text: "Earthworms haul dead leaf litter down into the soil.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    topic: "tiere",
    herkunft: EIGEN("RHS, Earthworms advice page", "Darwin Online, introduction to Darwins Worms"),
  },
  {
    text: "A house martin builds its nest from a thousand bits of mud.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    topic: "tiere",
    herkunft: EIGEN("RSPB, House Martin bird facts", "BTO BirdFacts, House Martin"),
  },
  {
    text: "A house martin often uses the same nest again.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    topic: "tiere",
    herkunft: EIGEN("RSPB, House Martin bird facts", "BTO BirdFacts, House Martin"),
  },
  {
    text: "Badgers dig large homes underground called setts.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    topic: "tiere",
    herkunft: EIGEN("Woodland Trust, Badger species guide", "The Wildlife Trusts, European badger"),
  },
  {
    text: "A dormouse rests right through the cold months.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    topic: "tiere",
    herkunft: EIGEN("PTES, hazel dormouse facts and figures", "The Wildlife Trusts, hazel dormouse"),
  },
  {
    text: "The brown hare can outrun all other British mammals.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    topic: "tiere",
    herkunft: EIGEN("The Mammal Society, brown hare", "The Wildlife Trusts, brown hare"),
  },
  {
    text: "Herring gulls drum their feet so that worms come out.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    topic: "tiere",
    herkunft: EIGEN("RSPB, Herring Gull bird facts", "British Birds, foot-paddling in gulls"),
  },
  {
    text: "Starlings gather in huge clouds at dusk in winter.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    topic: "tiere",
    herkunft: EIGEN("RSPB, starling murmurations", "The Wildlife Trusts, where to see murmurations"),
  },
  {
    text: "Red kites are a common sight in Britain again.",
    kind: "fakt",
    stufen: TEENS_ERW,
    topic: "tiere",
    herkunft: EIGEN("RSPB, red kites flying high", "Natural England, red kite reintroduction in England"),
  },
  {
    text: "Bison roam an English wood once more.",
    kind: "fakt",
    stufen: TEENS_ERW,
    topic: "tiere",
    herkunft: EIGEN("Kent Wildlife Trust, Wilder Blean project", "Wildwood Trust, Blean bison blog"),
  },

  // ---- Tiere weiter draußen ----
  {
    text: "A cuckoo lets another bird raise its chick.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    topic: "tiere",
    herkunft: EIGEN("RSPB, Cuckoo bird facts", "Woodland Trust, Cuckoo species guide"),
  },
  {
    text: "Cuckoo eggs are made to look like the eggs of the host.",
    kind: "wissen",
    stufen: TEENS_ERW,
    topic: "tiere",
    herkunft: EIGEN("RSPB, Cuckoo bird facts", "Woodland Trust, Cuckoo species guide"),
  },
  {
    text: "An albatross glides for hours as the wind does the work.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    topic: "tiere",
    herkunft: EIGEN(
      "British Antarctic Survey, flight speed of the wandering albatross",
      "Britannica, albatross",
    ),
  },
  {
    text: "Some moths use the stars to steer at night.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    topic: "tiere",
    herkunft: EIGEN(
      "Nature, Bogong moths use a stellar compass",
      "Lund University, moths use stars and the magnetic field",
    ),
  },
  {
    text: "Bogong moths cross hundreds of miles to the same cold hills.",
    kind: "fakt",
    stufen: TEENS_ERW,
    topic: "tiere",
    herkunft: EIGEN(
      "Nature, Bogong moths use a stellar compass",
      "Lund University, moths use stars and the magnetic field",
    ),
  },
  {
    text: "In seahorses it is the father that carries the eggs.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    topic: "tiere",
    herkunft: EIGEN(
      "Natural History Museum, are seahorses the quirkiest fish",
      "Britannica, sea horse",
    ),
  },
  {
    text: "A crab must shed its shell in order to grow.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    topic: "tiere",
    herkunft: EIGEN(
      "NOAA Fisheries, Alaska shellfish growth research",
      "British Marine Life Study Society, moulting in crustacea",
    ),
  },
  {
    text: "A cuttlefish can change its colour in a moment.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    topic: "tiere",
    herkunft: EIGEN(
      "Max-Planck-Gesellschaft, elucidating cuttlefish camouflage",
      "National Geographic, cuttlefish change colour",
    ),
  },
  {
    text: "Coral reefs are the work of small animals, not of rock.",
    kind: "wissen",
    stufen: TEENS_ERW,
    topic: "tiere",
    herkunft: EIGEN(
      "NOAA Ocean Exploration, are corals animals or plants",
      "Woods Hole Oceanographic Institution, are corals plants, animals or rocks",
    ),
  },
  {
    text: "Termite mounds hold shafts that let the warm air out.",
    kind: "wissen",
    stufen: TEENS_ERW,
    topic: "tiere",
    herkunft: EIGEN(
      "Journal of the Royal Society Interface, termite mound architecture and climate control",
      "PNAS, termite mounds harness diurnal temperature oscillations",
    ),
  },
  {
    text: "Reindeer eyes turn from gold to blue for the winter.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    topic: "tiere",
    herkunft: EIGEN(
      "UCL News, reindeer eyes change colour with Arctic seasons",
      "Proceedings of the Royal Society B, reindeer tapetum lucidum",
    ),
  },
  {
    text: "Birds are the last of the dinosaurs.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    topic: "tiere",
    herkunft: EIGEN(
      "Natural History Museum, how dinosaurs evolved into birds",
      "Britannica, feathered dinosaur",
    ),
  },
  {
    text: "Feathers were around long before the first bird.",
    kind: "fakt",
    stufen: TEENS_ERW,
    topic: "tiere",
    herkunft: EIGEN(
      "Natural History Museum, how dinosaurs evolved into birds",
      "Britannica, feathered dinosaur",
    ),
  },
  {
    text: "More kinds of beetle are known than of most other animals.",
    kind: "fakt",
    stufen: TEENS_ERW,
    topic: "tiere",
    herkunft: EIGEN(
      "Natural History Museum, beetles in the collections",
      "Smithsonian Institution, Coleoptera fact sheet",
    ),
  },

  // ---- Pflanzen, Pilze, Boden ----
  {
    text: "Sunflower buds turn from east to west and back at night.",
    kind: "wissen",
    stufen: KIDS_TEENS,
    topic: "natur",
    herkunft: EIGEN(
      "UC Davis, how sunflowers see the sun",
      "UC Berkeley Research, how sunflowers follow the sun",
    ),
  },
  {
    text: "Oaks often grow from acorns that a bird hid and left.",
    kind: "wissen",
    stufen: KIDS_TEENS,
    topic: "natur",
    herkunft: EIGEN(
      "UC Oaks, jays plant acorns",
      "University of Illinois Extension, how jays have shaped our oak forests",
    ),
  },
  {
    text: "A single bird can hide thousands of acorns in one autumn.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    topic: "natur",
    herkunft: EIGEN(
      "UC Oaks, jays plant acorns",
      "University of Illinois Extension, how jays have shaped our oak forests",
    ),
  },
  {
    text: "Fungi thread through the soil and link the roots of trees.",
    kind: "wissen",
    stufen: TEENS_ERW,
    topic: "natur",
    herkunft: EIGEN(
      "Kew, mycorrhizal ecology and the hidden dimension of fungi",
      "Nature, soil fungal networks maintain local dominance of trees",
    ),
  },
  {
    text: "A lichen is a fungus and an alga joined as one.",
    kind: "wissen",
    stufen: TEENS_ERW,
    topic: "natur",
    herkunft: EIGEN(
      "Natural History Museum, lichen collections and research",
      "British Lichen Society, what is a lichen",
    ),
  },
  {
    text: "A bank at Kew holds seeds of wild flowers in the cold.",
    kind: "fakt",
    stufen: TEENS_ERW,
    topic: "natur",
    herkunft: EIGEN(
      "Kew, Millennium Seed Bank at Wakehurst",
      "National Geographic Kids, all about Kews Millennium Seed Bank",
    ),
  },
  {
    text: "Seeds at Kew are dried before the cold store takes them.",
    kind: "wissen",
    stufen: TEENS_ERW,
    topic: "natur",
    herkunft: EIGEN(
      "Kew, how to preserve seeds for the future",
      "BBVA Foundation award citation, Millennium Seed Bank",
    ),
  },
  {
    text: "Britain holds much of the bluebell woodland on earth.",
    kind: "fakt",
    stufen: TEENS_ERW,
    topic: "natur",
    herkunft: EIGEN("Plantlife, bluebell", "Woodland Trust, when do bluebells flower"),
  },
  {
    text: "British bogs hold more carbon than all the woodland here.",
    kind: "wissen",
    stufen: TEENS_ERW,
    topic: "natur",
    herkunft: EIGEN(
      "IUCN UK Peatland Programme, about peatlands",
      "Natural England, UK carbon storage study",
    ),
  },
  {
    text: "Bog moss can hold far more rain than it weighs.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    topic: "natur",
    herkunft: EIGEN(
      "Irish Peatland Conservation Council, sphagnum moss fact sheet",
      "Lancashire Wildlife Trust, peatlands and sphagnum",
    ),
  },
  {
    text: "A dandelion seed holds a ring of air that slows its fall.",
    kind: "wissen",
    stufen: KIDS_TEENS,
    topic: "natur",
    herkunft: EIGEN(
      "Nature, a separated vortex ring underlies the flight of the dandelion",
      "University of Edinburgh, dandelion flight research",
    ),
  },
  {
    text: "A fig is not one fruit but a case of small flowers.",
    kind: "fakt",
    stufen: TEENS_ERW,
    topic: "natur",
    herkunft: EIGEN(
      "Britannica, inflorescence",
      "Annals of Botany, inflorescence morphogenesis in Moraceae",
    ),
  },
  {
    text: "Ferns were here long before the first flower.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    topic: "natur",
    herkunft: EIGEN(
      "Natural History Museum, unfurl the secrets of ferns",
      "Field Museum, ferns past and present",
    ),
  },

  // ---- Wetter und Klima ----
  {
    text: "Fog is a cloud that has come down to the ground.",
    kind: "wissen",
    stufen: KIDS_TEENS,
    topic: "wetter",
    herkunft: EIGEN("Met Office, what is fog", "Britannica, cloud"),
  },
  {
    text: "Dew forms when the ground cools the air at night.",
    kind: "wissen",
    stufen: KIDS_TEENS,
    topic: "wetter",
    herkunft: EIGEN("Met Office, dew and frost", "NOAA National Weather Service, dew point"),
  },
  {
    text: "Cirrus clouds are made of ice, not of water.",
    kind: "fakt",
    stufen: TEENS_ERW,
    topic: "wetter",
    herkunft: EIGEN("Met Office, high clouds", "NOAA National Weather Service, cloud classification"),
  },
  {
    text: "A band of fast wind high in the air steers our weather.",
    kind: "wissen",
    stufen: TEENS_ERW,
    topic: "wetter",
    herkunft: EIGEN("NOAA Climate.gov, what is the jet stream", "Met Office, the jet stream"),
  },
  {
    text: "Warm air can hold more water than cold air can.",
    kind: "wissen",
    stufen: TEENS_ERW,
    topic: "wetter",
    herkunft: EIGEN(
      "Met Office, Peter Stott on the Clausius-Clapeyron relation",
      "PNAS, what a 190-year-old equation says about rainstorms",
    ),
  },
  {
    text: "Storms in Britain get a name so that warnings are clear.",
    kind: "wissen",
    stufen: TEENS_ERW,
    topic: "wetter",
    herkunft: EIGEN("Met Office, why names matter when weather turns wild", "Met Éireann, storm names"),
  },
  {
    text: "Britain, Ireland and the Netherlands name their storms as one.",
    kind: "fakt",
    stufen: TEENS_ERW,
    topic: "wetter",
    herkunft: EIGEN("Met Office, storm naming", "Met Éireann, storm names and the naming group"),
  },
  {
    text: "Each recent decade has been warmer than the one before.",
    kind: "fakt",
    stufen: TEENS_ERW,
    topic: "wetter",
    herkunft: EIGEN(
      "WMO, state of the global climate",
      "Met Office and UEA, HadCRUT global temperature record",
    ),
  },
  {
    text: "Some gases in the air hold heat close to the ground.",
    kind: "wissen",
    stufen: TEENS_ERW,
    topic: "wetter",
    herkunft: EIGEN("NASA Science, the ocean and climate change", "WMO, greenhouse gas bulletin"),
  },
  {
    text: "Most of the heat we add ends in the sea, not in the air.",
    kind: "wissen",
    stufen: TEENS_ERW,
    topic: "wetter",
    herkunft: EIGEN("NOAA Climate.gov, ocean heat content", "NASA Science, ocean warming indicator"),
  },
  {
    text: "The west wind off the sea makes Britain mild for the north.",
    kind: "wissen",
    stufen: TEENS_ERW,
    topic: "wetter",
    herkunft: EIGEN(
      "Royal Meteorological Society MetLink, UK climate",
      "American Scientist, the source of Europes mild climate",
    ),
  },

  // ---- Erde und Meer ----
  {
    text: "The tide rises and falls because the moon tugs at the sea.",
    kind: "wissen",
    stufen: KIDS_TEENS,
    topic: "natur",
    herkunft: EIGEN(
      "NOAA National Ocean Service, tides and water levels tutorial",
      "Smithsonian Ocean, ups and downs",
    ),
  },
  {
    text: "The longest chain of mountains on earth lies under the sea.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    topic: "natur",
    herkunft: EIGEN(
      "NOAA Ocean Service, what is the longest mountain range on earth",
      "Woods Hole Oceanographic Institution, mid-ocean ridges",
    ),
  },
  {
    text: "New sea floor is made where two great slabs draw aside.",
    kind: "wissen",
    stufen: TEENS_ERW,
    topic: "natur",
    herkunft: EIGEN(
      "NOAA Ocean Exploration, what is a mid-ocean ridge",
      "Woods Hole Oceanographic Institution, mid-ocean ridges",
    ),
  },
  {
    text: "Much of the sand on a beach is worn down rock.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    topic: "natur",
    herkunft: EIGEN(
      "NOAA Ocean Service, how does sand form",
      "US National Park Service, coastal sediments and sand colours",
    ),
  },
  {
    text: "The white cliffs of Dover are made of tiny sea life.",
    kind: "fakt",
    stufen: TEENS_ERW,
    topic: "natur",
    herkunft: EIGEN(
      "Woods Hole Oceanographic Institution and MIT, giant algal bloom and the White Cliffs",
      "American Geophysical Union, press release on coccolithophore blooms",
    ),
  },
  {
    text: "A wave carries energy, not the water itself.",
    kind: "wissen",
    stufen: TEENS_ERW,
    topic: "natur",
    herkunft: EIGEN(
      "NOAA Ocean Exploration, what causes ocean waves",
      "University of Hawaii, exploring our fluid earth: wave energy",
    ),
  },
  {
    text: "Scotland is still rising since the last ice sheet left.",
    kind: "wissen",
    stufen: TEENS_ERW,
    topic: "natur",
    herkunft: EIGEN(
      "Geophysical Journal International, glacial isostatic adjustment of the British Isles",
      "Transactions of the Royal Society of Edinburgh, review of British GIA studies",
    ),
  },
  {
    text: "The core of the earth is iron, held solid under force.",
    kind: "fakt",
    stufen: TEENS_ERW,
    topic: "natur",
    herkunft: EIGEN(
      "National Geographic Education, the earths core",
      "Scientific Reports, viscosity of iron at inner core conditions",
    ),
  },
  {
    text: "The deepest sea is deeper than Everest is tall.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    topic: "natur",
    herkunft: EIGEN(
      "NOAA Ocean Service, how deep is the Mariana Trench",
      "Woods Hole Oceanographic Institution, Challenger Deep",
    ),
  },

  // ---- Weltraum ----
  {
    text: "The northern lights glow when the sun sends out a storm.",
    kind: "wissen",
    stufen: KIDS_TEENS,
    topic: "weltall",
    herkunft: EIGEN(
      "NOAA Space Weather Prediction Center, aurora tutorial",
      "British Geological Survey, aurora and geomagnetic storms",
    ),
  },
  {
    text: "Mars looks red because its dust is full of rust.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    topic: "weltall",
    herkunft: EIGEN("ESA, why is Mars red", "NASA Science, Mars dust and iron oxides"),
  },
  {
    text: "On Mars an aurora can glow all round the world at once.",
    kind: "fakt",
    stufen: TEENS_ERW,
    topic: "weltall",
    herkunft: EIGEN(
      "NASA JPL, first visible-light auroras at Mars",
      "ESA, shining a light on the aurora of Mars",
    ),
  },
  {
    text: "A moon of Saturn hides an ocean under its ice.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    topic: "weltall",
    herkunft: EIGEN(
      "NASA Science, Cassini finds a global ocean on Enceladus",
      "ESA, Cassini proves complex chemistry in the Enceladus ocean",
    ),
  },
  {
    text: "A comet grows a long tail as it nears the sun.",
    kind: "wissen",
    stufen: KIDS_TEENS,
    topic: "weltall",
    herkunft: EIGEN("NASA Science, comets overview", "ESA, Rosetta and cometary activity"),
  },
  {
    text: "Not one beam of light can get out of a black hole.",
    kind: "fakt",
    stufen: TEENS_ERW,
    topic: "weltall",
    herkunft: EIGEN("ESA, black holes", "NASA Science, black holes overview"),
  },
  {
    text: "A blue star is hotter than a red one.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    topic: "weltall",
    herkunft: EIGEN(
      "The Schools Observatory, stellar classification",
      "BBC Sky at Night Magazine, star colours explained",
    ),
  },
  {
    text: "The moon can hide the sun, but not for long.",
    kind: "fakt",
    stufen: TEENS_ERW,
    topic: "weltall",
    herkunft: EIGEN(
      "NASA Science, total solar eclipse of 12 August 2026",
      "Royal Observatory Greenwich, the August 2026 solar eclipse",
    ),
  },

  // ---- Der menschliche Körper ----
  {
    text: "Much of what we call taste comes from the nose.",
    kind: "wissen",
    stufen: KIDS_TEENS,
    topic: "koerper",
    herkunft: EIGEN(
      "AbScent, smell, taste and flavour",
      "Physiology and Behavior, retronasal perception of odours",
    ),
  },
  {
    text: "The inner surface of the lungs is far larger than our skin.",
    kind: "fakt",
    stufen: TEENS_ERW,
    topic: "koerper",
    herkunft: EIGEN(
      "Britannica, pulmonary alveolus",
      "SUNY Cortland teaching notes, surface area of the alveoli",
    ),
  },
  {
    text: "The heart beats on its own, with no order from the brain.",
    kind: "wissen",
    stufen: TEENS_ERW,
    topic: "koerper",
    herkunft: EIGEN(
      "Pacing and Clinical Electrophysiology, review of the sinoatrial node",
      "Cleveland Clinic, how the heart conduction system works",
    ),
  },
  {
    text: "A red blood cell lasts about four months.",
    kind: "fakt",
    stufen: TEENS_ERW,
    topic: "koerper",
    herkunft: EIGEN(
      "Stanford Blood Center, how long do red blood cells live",
      "Royal Society Open Science, how do red blood cells know when to die",
    ),
  },
  {
    text: "New blood is made inside our bones.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    topic: "koerper",
    herkunft: EIGEN("Britannica, bone marrow", "Cleveland Clinic, bone marrow"),
  },
  {
    text: "Our sense of balance comes from the inner ear.",
    kind: "wissen",
    stufen: KIDS_TEENS,
    topic: "koerper",
    herkunft: EIGEN(
      "Britannica, the physiology of balance and vestibular function",
      "Cleveland Clinic, the vestibular system",
    ),
  },
  {
    text: "The smallest bones we own sit inside the ear.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    topic: "koerper",
    herkunft: EIGEN("Britannica, human ear", "Cleveland Clinic, ear anatomy"),
  },
  {
    text: "Our gut is home to more small life than we can count.",
    kind: "fakt",
    stufen: TEENS_ERW,
    topic: "koerper",
    herkunft: EIGEN(
      "Cleveland Clinic, what is your gut microbiome",
      "Nature Communications, an expanded reference map of the human gut microbiome",
    ),
  },
];
