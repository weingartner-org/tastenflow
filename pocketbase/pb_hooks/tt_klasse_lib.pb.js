/// <reference path="../pb_data/types.d.ts" />
//
// Klassen umstellen - am SERVER, in EINER Transaktion (10.09.2026)
// =================================================================
// Zwei Wege, die beide an VIELEN Zeilen hängen und darum nicht in den Client
// gehören:
//
//  1. EIN KIND IN EINE ANDERE KLASSE VERSCHIEBEN (Wunsch Johannes, 10.09.2026).
//     Entscheidung Johannes: in JEDE Klasse, deren Klassencode man kennt - auch
//     in die Klasse einer anderen Lehrkraft. Die Folge kennt er: Die Lehrkräfte
//     der neuen Klasse sehen das Kind und seinen Lernstand.
//
//  2. DEN KLASSENCODE ÄNDERN. Das lief bis heute im Client: erst alle Kinder
//     auf den neuen Code, dann die Klasse. Seit die updateRule von `tt_pupils`
//     einen neuen `classCode` nur noch zulässt, wenn die Lehrkraft auch in der
//     NEUEN Klasse ist, ging das so nicht mehr - die neue Klasse gab es in dem
//     Augenblick ja noch nicht. Und der alte Weg liess `tt_class_teachers`,
//     die Tippchallenge-Ergebnisse und die Lerndaten beim alten Code stehen:
//     Co-Lehrkräfte verloren die Klasse, und die Ergebnisse jeder
//     Tippchallenge verschwanden aus der Liste.
//
// ── Warum eine Transaktion ──────────────────────────────────────────────────
// Ein halb verschobenes Kind ist schlimmer als keines: Stünde das Konto schon
// in der neuen Klasse und der Lernstand noch in der alten, sähe die neue
// Lehrkraft ein Kind ohne Geschichte - und die alte weiter seinen Stand. Also
// alles oder nichts (`runInTransaction`; wirft etwas, wird zurückgerollt).
//
// ── Warum die Logik HIER und nicht in der Routen-Datei steht ────────────────
// `routerAdd`-Handler sehen nichts aus dem Kopf ihrer eigenen Datei
// ([[reference_pocketbase_hook_scope]]). Die Routen laden diese Datei darum per
// `require` - dabei wird sie ganz ausgewertet, und die Hilfsfunktionen sehen
// einander. Beim Auto-Laden als Hook gibt es kein `module` (Wächter unten).
//
// Getestet OHNE Server in `tests/tastenflow-kind-verschieben.test.ts` (mit
// einer nachgebauten App) - die Prüfungen, die Transaktion und welche Tabellen
// mitwandern.

/** Höchstens so viele Kinder je Klasse - DIESELBE Zahl wie in `tt_grenzen.pb.js`. */
var MAX_KINDER = 30;

/** Dieselbe Zeichenregel wie im Client (`CLASS_CODE_RE` in `pbBackend.ts`). */
var CODE_RE = /^[A-Z0-9.-]{2,12}$/;

/**
 * Was mit einem Kind in die neue Klasse wandert - Spalten live gemessen
 * (10.09.2026). `teacherUid` wird zur Eigentümer:in der neuen Klasse, weil die
 * Eigentümer:innen-Leseregel dieser Tabellen an `teacherUid` hängt.
 */
var MITWANDERN = [
  { name: "tt_progress", felder: ["classCode", "teacherUid"] },
  { name: "tt_events", felder: ["classCode", "teacherUid"] },
  { name: "lw_progress", felder: ["classCode", "teacherUid"] },
  { name: "lw_events", felder: ["classCode", "teacherUid"] },
];

/**
 * ★★★ Was BLEIBT, wenn ein Kind die Klasse wechselt - bewusst:
 *  • `tt_schreibproben`: die Ergebnisse der Tippchallenges der ALTEN Klasse.
 *    Sie sind dort Notengrundlage und gehören zu der Runde, in der sie
 *    geschrieben wurden.
 *  • `lw_messages`: das Gespräch mit der bisherigen Lehrkraft.
 * Die Liste steht hier, damit der Wächter prüfen kann, dass sie nie
 * versehentlich in MITWANDERN landet.
 */
var BLEIBEN = ["tt_schreibproben", "lw_messages"];

/**
 * Beim Ändern des KLASSENCODES wandert alles mit, was die Klasse über ihren
 * Code findet - hier bleibt nichts zurück, es ist ja dieselbe Klasse.
 */
var UMBENENNEN = [
  "tt_progress",
  "tt_events",
  "lw_progress",
  "lw_events",
  "tt_schreibproben",
  "lw_messages",
  // ★ 19.09.2026 (Z1-Befund): die hochgeladenen Texte der Klasse (Eigene
  // Übung, Tippchallenge mit eigener Datei). Ohne diese Zeile fanden die
  // Kinder nach einem neuen Klassencode „den zugewiesenen Text" nicht mehr -
  // die Übung hing auf „wird geladen …".
  "tt_eigene_texte",
];

/**
 * ★ G2b-2 (02.10.2026): Umschrift der Buchstaben, die NUR it, pl, tr, cs tragen -
 * SPIEGEL von `SYNTH_UMSCHRIFT` in `src/lib/typing/pbBackend.ts` (aus dem
 * Sprachregister). Alles, was Namen in de, en, fr, es schon vorher trugen
 * (ä ö ü ß, é ñ …), bleibt wie es war. `tests/tastenflow-g2b2-synth-email.test.ts`
 * hält beide Tabellen gleich.
 */
var SYNTH_UMSCHRIFT = {
  ì: "i", Ì: "i", ò: "o", Ò: "o",
  ą: "a", Ą: "a", ć: "c", Ć: "c", ę: "e", Ę: "e", ł: "l", Ł: "l", ń: "n", Ń: "n",
  ś: "s", Ś: "s", ź: "z", Ź: "z", ż: "z", Ż: "z",
  ğ: "g", Ğ: "g", ı: "i", İ: "i", ş: "s", Ş: "s",
  č: "c", Č: "c", ď: "d", Ď: "d", ě: "e", Ě: "e", ň: "n", Ň: "n", ř: "r", Ř: "r",
  š: "s", Š: "s", ť: "t", Ť: "t", ů: "u", Ů: "u", ý: "y", Ý: "y", ž: "z", Ž: "z",
  // ★ G2-NEUN (25.10.2026): die neun Sprachen des Gerüsts (hu ő ű, pt ã õ, ro ă ș ț ţ, sv å, Kyrillisch, Griechisch).
  а: "a", А: "a", б: "b", Б: "b", в: "v", В: "v", г: "h", Г: "h", д: "d", Д: "d", е: "e", Е: "e", ж: "zh", Ж: "zh",
  з: "z", З: "z", и: "y", И: "y", й: "i", Й: "i", к: "k", К: "k", л: "l", Л: "l", м: "m", М: "m", н: "n", Н: "n",
  о: "o", О: "o", п: "p", П: "p", р: "r", Р: "r", с: "s", С: "s", т: "t", Т: "t", у: "u", У: "u", ф: "f", Ф: "f",
  х: "kh", Х: "kh", ц: "ts", Ц: "ts", ч: "ch", Ч: "ch", ш: "sh", Ш: "sh", щ: "shch", Щ: "shch", ъ: "a", Ъ: "a",
  ь: "", Ь: "", ю: "iu", Ю: "iu", я: "ia", Я: "ia", α: "a", Α: "a", ά: "a", Ά: "a", β: "v", Β: "v", γ: "g", Γ: "g",
  δ: "d", Δ: "d", ε: "e", Ε: "e", έ: "e", Έ: "e", ζ: "z", Ζ: "z", η: "i", Η: "i", ή: "i", Ή: "i", θ: "th", Θ: "th",
  ι: "i", Ι: "i", ί: "i", Ί: "i", ϊ: "i", Ϊ: "i", ΐ: "i", κ: "k", Κ: "k", λ: "l", Λ: "l", μ: "m", Μ: "m", ν: "n",
  Ν: "n", ξ: "x", Ξ: "x", ο: "o", Ο: "o", ό: "o", Ό: "o", π: "p", Π: "p", ρ: "r", Ρ: "r", σ: "s", Σ: "s", ς: "s",
  τ: "t", Τ: "t", υ: "y", Υ: "y", ύ: "y", Ύ: "y", ϋ: "y", Ϋ: "y", ΰ: "y", φ: "f", Φ: "f", χ: "ch", Χ: "ch", ψ: "ps",
  Ψ: "ps", ω: "o", Ω: "o", ώ: "o", Ώ: "o", ő: "o", Ő: "o", ű: "u", Ű: "u", ã: "a", Ã: "a", õ: "o", Õ: "o", ă: "a",
  Ă: "a", ș: "s", Ș: "s", ț: "t", Ț: "t", ţ: "t", Ţ: "t", å: "a", Å: "a", ґ: "g", Ґ: "g", є: "ie", Є: "ie", і: "i",
  І: "i", ї: "i", Ї: "i",
  // ★ G3a-SCHRIFT (25.10.2026): bulgarisch ѝ (ein „и" mit Gravis), ukrainischer Apostroph U+02BC entfällt (KMU 2010).
  ѝ: "i", Ѝ: "i", "\u02BC": "",
};

/**
 * ★ G3a-SCHRIFT (25.10.2026): die Regeln der amtlichen Umschrift (Wortanfang ukrainisch є ї й ю я ⇒ ye yi y yu ya,
 * „зг" ⇒ zgh; griechisch μπ am Rand b, innen mb; αυ ευ ηυ vor stimmhaftem Laut av ev iv, sonst af ef if; ου γγ γξ γχ).
 * SPIEGEL von `SYNTH_REGELN` in `src/lib/typing/pbBackend.ts` (aus dem Sprachregister) - die erste passende gilt.
 * `tests/tastenflow-g3a-schrift-umschrift.test.ts` hält beide gleich und vergleicht die Adressen.
 */
var STIMMHAFT_EL = "αεηιουωάέήίόύώϊϋΐΰβγδζλμνρ";
var SYNTH_REGELN = [
  { folge: "є", ersatz: "ye", wo: "anfang" },
  { folge: "ї", ersatz: "yi", wo: "anfang" },
  { folge: "й", ersatz: "y", wo: "anfang" },
  { folge: "ю", ersatz: "yu", wo: "anfang" },
  { folge: "я", ersatz: "ya", wo: "anfang" },
  { folge: "зг", ersatz: "zgh" },
  { folge: "μπ", ersatz: "b", wo: "anfang" },
  { folge: "μπ", ersatz: "b", wo: "ende" },
  { folge: "μπ", ersatz: "mb" },
  { folge: "αυ", ersatz: "av", danach: STIMMHAFT_EL },
  { folge: "αυ", ersatz: "af" },
  { folge: "αύ", ersatz: "av", danach: STIMMHAFT_EL },
  { folge: "αύ", ersatz: "af" },
  { folge: "ευ", ersatz: "ev", danach: STIMMHAFT_EL },
  { folge: "ευ", ersatz: "ef" },
  { folge: "εύ", ersatz: "ev", danach: STIMMHAFT_EL },
  { folge: "εύ", ersatz: "ef" },
  { folge: "ηυ", ersatz: "iv", danach: STIMMHAFT_EL },
  { folge: "ηυ", ersatz: "if" },
  { folge: "ηύ", ersatz: "iv", danach: STIMMHAFT_EL },
  { folge: "ηύ", ersatz: "if" },
  { folge: "ου", ersatz: "ou" },
  { folge: "ού", ersatz: "ou" },
  { folge: "γγ", ersatz: "ng" },
  { folge: "γξ", ersatz: "nx" },
  { folge: "γχ", ersatz: "nch" },
];

/** Was ein Wort beendet - DIESELBE Klasse wie `WORTGRENZE` in `src/lib/typing/sprachRegister.ts` (Apostroph nicht). */
var WORTGRENZE = /[\s\-\u2010-\u2015.,;:!?()[\]\/_0-9"\u201E\u201C\u201D\u00AB\u00BB]/;

/** Wie `regelPasst` in sprachRegister.ts: die Zahl der Zeichen, die die Regel an Stelle i nimmt, sonst 0. */
function regelPasst(name, i, r) {
  var n = r.folge.length;
  if (i + n > name.length) return 0;
  if (name.substr(i, n).toLowerCase() !== r.folge) return 0;
  var vor = i > 0 ? name.charAt(i - 1) : null;
  var nach = i + n < name.length ? name.charAt(i + n) : null;
  if (r.wo === "anfang" && vor !== null && !WORTGRENZE.test(vor)) return 0;
  if (r.wo === "ende" && nach !== null && !WORTGRENZE.test(nach)) return 0;
  if (r.danach !== undefined && (nach === null || r.danach.indexOf(nach.toLowerCase()) < 0)) return 0;
  return n;
}

function umschriftNeuerSprachen(name) {
  var aus = "";
  for (var i = 0; i < name.length; i++) {
    // ★ G3a-SCHRIFT (25.10.2026): zuerst die Regeln (Wortanfang, Wortende, Zeichenfolge).
    var genommen = 0;
    for (var k = 0; k < SYNTH_REGELN.length; k++) {
      genommen = regelPasst(name, i, SYNTH_REGELN[k]);
      if (genommen) {
        aus += SYNTH_REGELN[k].ersatz;
        break;
      }
    }
    if (genommen) {
      i += genommen - 1;
      continue;
    }
    var z = name.charAt(i);
    aus += Object.prototype.hasOwnProperty.call(SYNTH_UMSCHRIFT, z) ? SYNTH_UMSCHRIFT[z] : z;
  }
  return aus;
}

/**
 * Deterministische Login-Adresse aus Klassencode und Name - ZEICHEN FÜR
 * ZEICHEN dieselbe Rechnung wie `synthEmail` in `src/lib/typing/pbBackend.ts`.
 * Weicht sie ab, findet die Anmeldung das verschobene Kind nicht mehr.
 */
function synthEmail(classCode, name) {
  var code = String(classCode || "").trim().toLowerCase();
  var slug = umschriftNeuerSprachen(String(name || "").trim())
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return code + "__" + (slug || "x") + "@tt.local";
}

/** Getrimmt und gross - wie beim Anlegen einer Klasse. */
function normCode(roh) {
  return String(roh == null ? "" : roh).trim().toUpperCase();
}

function fehler(status, text) {
  return { status: status, antwort: { error: text } };
}

function logFehler(app, was, err) {
  try {
    app.logger().error("[tt_klasse] " + was, "error", String(err));
  } catch (_) {
    /* ohne Logger: nichts zu tun */
  }
}

/** Die Klasse zu einem Code - erst genau, dann in Grossschreibung. */
function findeKlasse(app, code) {
  var roh = String(code || "").trim();
  if (!roh) return null;
  var versuche = roh === normCode(roh) ? [roh] : [roh, normCode(roh)];
  for (var i = 0; i < versuche.length; i++) {
    try {
      var k = app.findFirstRecordByFilter("tt_classes", "code = {:c}", { c: versuche[i] });
      if (k) return k;
    } catch (_) {
      /* nicht gefunden */
    }
  }
  return null;
}

/** Alle Zeilen einer Sammlung zu einem Filter - fehlt die Sammlung, keine. */
function zeilen(app, sammlung, filter, params) {
  try {
    return app.findRecordsByFilter(sammlung, filter, "", 0, 0, params) || [];
  } catch (_) {
    return [];
  }
}

/** Hat diese Zeile das Feld? (Eine Sammlung ohne die Spalte bleibt unberührt.) */
function hatFeld(rec, feld) {
  try {
    var c = rec.collection();
    return !!(c && c.fields && c.fields.getByName(feld));
  } catch (_) {
    return false;
  }
}

/**
 * ★ Klassenname nur JE KONTO eindeutig, nicht global (20.09.2026, Auftrag
 * Testerin Punkt 1 - Johannes' Testklasse: „Test" war schon vergeben, allerdings
 * nicht von ihm). GEMESSEN: eine Namensprüfung gab es davor GAR NICHT -
 * global eindeutig ist an `tt_classes` allein der Klassencode
 * (`idx_tt_class_code` in `setup.mjs`); Johannes traf in Wahrheit der Code,
 * den die Oberfläche AUS DEM NAMEN vorschlägt (`klassencodeVorschlag`,
 * „Test" → „TEST") und der bei einer anderen Lehrkraft schon vergeben war.
 * Der Code bleibt bewusst global eindeutig (Anmelde-Schlüssel der Kinder) -
 * diese Funktion prüft NUR den Namen, und NUR gegen Klassen mit demselben
 * `teacherUid` (Eigentümer:in, nicht Co-Lehrkraft). Verglichen wird ohne
 * Gross-/Kleinschreibung, dieselbe Bauart wie der Namensvergleich beim Kind
 * (`addPupil` in `account.ts`).
 *
 * `ausgenommenId` lässt eine Klasse aus dem Vergleich (für ein künftiges
 * Umbenennen - beim Anlegen gibt es noch keine Id, dort bleibt der Parameter
 * weg).
 */
function nameSchonVergeben(app, teacherUid, name, ausgenommenId) {
  var gesucht = String(name || "").trim().toLowerCase();
  var besitzer = String(teacherUid || "").trim();
  if (!gesucht || !besitzer) return false;
  var eigene = zeilen(app, "tt_classes", "teacherUid = {:t}", { t: besitzer });
  for (var i = 0; i < eigene.length; i++) {
    if (ausgenommenId && eigene[i].id === ausgenommenId) continue;
    if (String(eigene[i].getString("name") || "").trim().toLowerCase() === gesucht) return true;
  }
  return false;
}

/** Eigentümer:in ODER Co-Lehrkraft der Klasse - dasselbe wie `ttClassStaff`. */
function istStaff(app, classCode, ownerId, teacherId) {
  if (!teacherId) return false;
  if (ownerId && teacherId === ownerId) return true;
  try {
    return !!app.findFirstRecordByFilter(
      "tt_class_teachers",
      "classCode = {:c} && teacherUid = {:t}",
      { c: classCode, t: teacherId },
    );
  } catch (_) {
    return false;
  }
}

/** Nur eine angemeldete LEHRKRAFT - sonst `null`. */
function lehrkraftVon(e) {
  var auth = e.auth;
  var name = "";
  try {
    name = auth ? auth.collection().name : "";
  } catch (_) {
    name = "";
  }
  return auth && name === "tt_teachers" ? auth : null;
}

function bodyVon(e) {
  try {
    return e.requestInfo().body || {};
  } catch (_) {
    return {};
  }
}

// ── 1. Ein Kind verschieben ─────────────────────────────────────────────────

/**
 * Die Prüfungen und das Verschieben selbst - ohne `e`, damit sie sich mit
 * einer nachgebauten App prüfen lassen. Gibt `{ status, antwort }` zurück.
 *
 * Reihenfolge der Prüfungen mit Absicht:
 *  1. Darf diese Lehrkraft das Kind überhaupt anfassen? Erst DANACH wird
 *     irgendetwas über die Zielklasse gesagt - sonst liesse sich mit einem
 *     fremden Kind ausprobieren, welche Klassencodes es gibt.
 *  2. Gibt es die Zielklasse, und ist es nicht dieselbe?
 *  3. Hat die Zielklasse Platz, und ist der Name dort frei?
 */
function verschiebe(app, lehrkraftId, pupilId, zielRoh) {
  var kind = null;
  try {
    kind = pupilId ? app.findRecordById("tt_pupils", String(pupilId)) : null;
  } catch (_) {
    kind = null;
  }
  // Nicht gefunden und nicht erlaubt klingen GLEICH - ein Unterschied wäre
  // eine Auskunft darüber, welche Kennungen es gibt.
  var nichtIhres = "Dieses Kind gehört nicht zu einer Ihrer Klassen.";
  if (!kind) return fehler(403, nichtIhres);
  var bisher = kind.getString("classCode");
  if (!bisher) return fehler(403, nichtIhres);
  var bisherKlasse = findeKlasse(app, bisher);
  var bisherOwner = bisherKlasse ? bisherKlasse.getString("teacherUid") : "";
  if (!istStaff(app, bisher, bisherOwner, lehrkraftId)) return fehler(403, nichtIhres);

  var ziel = normCode(zielRoh);
  if (!ziel) return fehler(400, "Bitte den Klassencode der neuen Klasse eingeben.");
  if (ziel === normCode(bisher))
    return fehler(400, "Das Kind ist schon in der Klasse mit diesem Klassencode.");
  var zielKlasse = findeKlasse(app, ziel);
  if (!zielKlasse)
    return fehler(
      404,
      "Eine Klasse mit dem Klassencode „" + ziel + "“ gibt es nicht. Bitte den Code prüfen.",
    );
  var zielCode = zielKlasse.getString("code");
  var zielOwner = zielKlasse.getString("teacherUid");
  var name = kind.getString("name");
  var email = synthEmail(zielCode, name);

  var dort = zeilen(app, "tt_pupils", "classCode = {:c}", { c: zielCode });
  if (dort.length >= MAX_KINDER)
    return fehler(
      400,
      "In der Klasse „" + zielKlasse.getString("name") + "“ sind bereits " + dort.length +
        " Kinder. Mehr als " + MAX_KINDER + " sind je Klasse nicht vorgesehen.",
    );
  var belegt = false;
  for (var i = 0; i < dort.length; i++) {
    if (dort[i].id === kind.id) continue;
    if (
      synthEmail(zielCode, dort[i].getString("name")) === email ||
      String(dort[i].getString("email")).toLowerCase() === email
    )
      belegt = true;
  }
  if (!belegt) {
    // Die Login-Adresse ist in der ganzen Sammlung eindeutig - auch eine
    // Zeile ausserhalb der Klassenliste würde das Speichern sprengen.
    try {
      var gleich = app.findFirstRecordByFilter("tt_pupils", "email = {:m}", { m: email });
      if (gleich && gleich.id !== kind.id) belegt = true;
    } catch (_) {
      /* frei */
    }
  }
  if (belegt)
    return fehler(
      409,
      "In der neuen Klasse gibt es schon ein Kind mit dem Namen „" + name +
        "“. Ändern Sie zuerst den Namen eines der beiden Kinder.",
    );


  var mitgewandert = {};
  try {
    app.runInTransaction(function (tx) {
      var k = tx.findRecordById("tt_pupils", kind.id);
      k.set("classCode", zielCode);
      k.set("teacherUid", zielOwner);
      k.set("email", email);
      // ★★★ Wochenziel (W2, 18.09.2026, Entwurf §7g): ein verschobenes Kind
      // ist ein NEUES Kind seiner neuen Klasse - es übernimmt deren
      // Wochenziel-VORGABE ab der NÄCHSTEN Woche, nie das Ziel seiner alten
      // Klasse (dieselbe Regel wie ein frisch angelegtes Kind, siehe
      // `addPupil` in pbBackend.ts). Ohne Vorgabe (oder 0 Minuten) bleibt es
      // ohne Ziel/Zielwochen/Nachholen - wie ein neues Kind ohne Vorgabe.
      // JSON-Feld: nur über getString + JSON.parse
      // ([[reference_pocketbase_hook_scope]]).
      var wz = require(`${__hooks}/tt_wochenziel_lib.pb.js`);
      var vorgabeRoh = null;
      try {
        vorgabeRoh = JSON.parse(String(zielKlasse.getString("wochenzielVorgabe") || "null"));
      } catch (_) {
        vorgabeRoh = null;
      }
      var vorgabe = vorgabeRoh && typeof vorgabeRoh === "object" ? vorgabeRoh : {};
      var vorgabeMinuten = Number(vorgabe.minuten) > 0 ? Number(vorgabe.minuten) : 0;
      // ★ Z1 (28.09.2026): „ab nächster Woche" in der Zone des KINDES
      // (`tt_pupils.zeitzone`, ohne: Wien) - der Schlüssel wird auf SEINEM
      // Gerät gelesen, dort beginnt die Woche Montag 08:00 Ortszeit.
      var zoneKind = require(`${__hooks}/tt_zeitzone_lib.pb.js`).zeitzoneVon(k);
      k.set(
        "wochenzielVerlauf",
        vorgabeMinuten > 0
          ? [{ ab: wz.naechsteWocheKey(Date.now(), zoneKind), minuten: vorgabeMinuten }]
          : [],
      );
      k.set("goalWeeks", Array.isArray(vorgabe.wochen) ? vorgabe.wochen : []);
      k.set("goalCatchUp", !!vorgabe.nachholen);
      // ★ Die bisherige Anmeldung endet. Ein Gerät, auf dem das Kind noch
      // angemeldet ist, kennt den ALTEN Klassencode und schriebe ihn mit
      // jedem Speichern wieder in den Lernstand - die alte Klasse sähe dann
      // weiter mit. Mit dem neuen Code angemeldet stimmt alles wieder.
      if (typeof k.refreshTokenKey === "function") k.refreshTokenKey();
      tx.save(k);

      for (var t = 0; t < MITWANDERN.length; t++) {
        var tab = MITWANDERN[t];
        var reihen = zeilen(tx, tab.name, "pupilUid = {:p}", { p: kind.id });
        for (var r = 0; r < reihen.length; r++) {
          for (var f = 0; f < tab.felder.length; f++) {
            var feld = tab.felder[f];
            if (!hatFeld(reihen[r], feld)) continue;
            reihen[r].set(feld, feld === "classCode" ? zielCode : zielOwner);
          }
          tx.save(reihen[r]);
        }
        mitgewandert[tab.name] = reihen.length;
      }

    });
  } catch (err) {
    logFehler(app, "Verschieben fehlgeschlagen", err);
    return fehler(500, "Das Kind konnte nicht verschoben werden. Es ist nichts geändert.");
  }

  return {
    status: 200,
    antwort: {
      ok: true,
      pupilId: kind.id,
      zielCode: zielCode,
      zielName: zielKlasse.getString("name"),
      mitgewandert: mitgewandert,
    },
  };
}

/** Route `POST /api/tt/kind-verschieben` - Body `{ pupilId, zielCode }`. */
function kindVerschieben(e) {
  var lehrkraft = lehrkraftVon(e);
  if (!lehrkraft) return e.json(401, { error: "Bitte als Lehrkraft anmelden." });
  var body = bodyVon(e);
  var r = verschiebe(e.app, lehrkraft.id, body.pupilId, body.zielCode);
  return e.json(r.status, r.antwort);
}

// ── 2. Den Klassencode ändern ───────────────────────────────────────────────

/**
 * Klassencode (und auf Wunsch Name) einer Klasse ändern - mit allem, was an
 * dem Code hängt. Gibt `{ status, antwort }` zurück.
 *
 * Darf: Eigentümer:in ODER Co-Lehrkraft - dieselben, die `tt_classes` ändern
 * dürfen (updateRule).
 */
function aendereKlassencode(app, lehrkraftId, altRoh, neuRoh, nameRoh) {
  var cls = findeKlasse(app, altRoh);
  if (!cls) return fehler(404, "Diese Klasse gibt es nicht.");
  var altCode = cls.getString("code");
  if (!istStaff(app, altCode, cls.getString("teacherUid"), lehrkraftId))
    return fehler(403, "Diese Klasse gehört einer anderen Lehrkraft.");

  var neu = normCode(neuRoh);
  if (!neu)
    return fehler(400, "Bitte einen Klassencode eingeben - mit ihm melden sich die Kinder an.");
  if (!CODE_RE.test(neu))
    return fehler(
      400,
      "Der Klassencode darf 2 bis 12 Zeichen haben: Buchstaben, Ziffern, Punkt oder Bindestrich.",
    );
  var name = null;
  if (nameRoh !== undefined && nameRoh !== null) {
    name = String(nameRoh).trim();
    if (!name) return fehler(400, "Bitte einen Klassennamen angeben.");
    /*
      ★ Nachbesserung 20.09.2026 (Punkt 4): Diese Route kann den Namen
      MITändern, ohne dass die normale Update-Anfrage (und damit der
      `onRecordUpdateRequest`-Wächter in `tt_klasse.pb.js`) je läuft - sie
      schreibt per `tx.save()` direkt. Dieselbe je-Konto-Prüfung darum HIER,
      die eigene Klasse (`cls.id`) ausgenommen (Umbenennen auf den EIGENEN,
      unveränderten Namen bleibt erlaubt).
    */
    if (nameSchonVergeben(app, cls.getString("teacherUid"), name, cls.id))
      return fehler(400, "Diesen Klassennamen haben Sie schon vergeben. Bitte wählen Sie einen anderen Namen.");
  }
  var codeNeu = neu !== altCode;
  if (codeNeu) {
    var belegt = findeKlasse(app, neu);
    if (belegt && belegt.id !== cls.id)
      return fehler(400, "Diesen Klassencode gibt es schon, bitte einen anderen wählen.");
  }

  var endName = name !== null ? name : cls.getString("name");
  try {
    app.runInTransaction(function (tx) {
      var k = tx.findRecordById("tt_classes", cls.id);
      if (name !== null) k.set("name", name);
      if (codeNeu) k.set("code", neu);
      tx.save(k);
      if (!codeNeu) return;

      // Die Kinder: neuer Code UND neue Login-Adresse - sonst käme niemand mehr
      // hinein. Ihre Anmeldung bleibt bestehen (anders als beim Verschieben:
      // es ist dieselbe Klasse, niemand Fremdes sieht dadurch etwas).
      var kinder = zeilen(tx, "tt_pupils", "classCode = {:c}", { c: altCode });
      for (var i = 0; i < kinder.length; i++) {
        kinder[i].set("classCode", neu);
        kinder[i].set("email", synthEmail(neu, kinder[i].getString("name")));
        tx.save(kinder[i]);
      }
      // Die Co-Lehrkräfte - ohne das verlören sie die Klasse.
      var co = zeilen(tx, "tt_class_teachers", "classCode = {:c}", { c: altCode });
      for (var c = 0; c < co.length; c++) {
        co[c].set("classCode", neu);
        tx.save(co[c]);
      }
      for (var t = 0; t < UMBENENNEN.length; t++) {
        var reihen = zeilen(tx, UMBENENNEN[t], "classCode = {:c}", { c: altCode });
        for (var r = 0; r < reihen.length; r++) {
          reihen[r].set("classCode", neu);
          tx.save(reihen[r]);
        }
      }
    });
  } catch (err) {
    logFehler(app, "Klassencode ändern fehlgeschlagen", err);
    return fehler(500, "Die Klasse konnte nicht geändert werden. Es ist nichts geändert.");
  }
  return { status: 200, antwort: { ok: true, code: codeNeu ? neu : altCode, name: endName } };
}

/** Route `POST /api/tt/klassencode-aendern` - Body `{ classCode, neuerCode, name? }`. */
function klassencodeAendern(e) {
  var lehrkraft = lehrkraftVon(e);
  if (!lehrkraft) return e.json(401, { error: "Bitte als Lehrkraft anmelden." });
  var body = bodyVon(e);
  var r = aendereKlassencode(e.app, lehrkraft.id, body.classCode, body.neuerCode, body.name);
  return e.json(r.status, r.antwort);
}

// --- Export (nur im require()-Kontext; beim Auto-Laden als Hook kein `module`) -
if (typeof module !== "undefined") {
  module.exports = {
    kindVerschieben: kindVerschieben,
    klassencodeAendern: klassencodeAendern,
    verschiebe: verschiebe,
    aendereKlassencode: aendereKlassencode,
    synthEmail: synthEmail,
    SYNTH_UMSCHRIFT: SYNTH_UMSCHRIFT,
    SYNTH_REGELN: SYNTH_REGELN,
    normCode: normCode,
    nameSchonVergeben: nameSchonVergeben,
    MAX_KINDER: MAX_KINDER,
    MITWANDERN: MITWANDERN,
    BLEIBEN: BLEIBEN,
    UMBENENNEN: UMBENENNEN,
  };
}
