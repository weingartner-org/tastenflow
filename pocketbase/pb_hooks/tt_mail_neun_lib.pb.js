/// <reference path="../pb_data/types.d.ts" />
//
// DIE MAILS DER NEUN SPRACHEN bg el hu nl pt br ro sv uk (O4, 30.10.2026)
// ========================================================================
// Für die älteren Sprachen steht je Mail eine eigene Fassung neben dem Deutschen
// (`tt_mail_texte_lib.pb.js`). Für neun weitere wäre das neunmal derselbe Code.
// Darum hier EIN Aufbau (gleiche Spalten, gleiche Zahlen, gleiche Reihenfolge wie
// die tschechische Fassung) und je Sprache eine Datei NUR mit Texten:
// `tt_mail_neun_<xx>_lib.pb.js`. Der Wächter `tests/tastenflow-neun-mails.test.ts`
// hält die neun Dateien in Form (gleiche Schlüssel, gleiche Platzhalter).
//
// ★★★ Dieselben Vorsichtsregeln wie bei cs/pl: kein Name in der Anrede (Vokativ!),
// eingesetzte Werte nur dort, wo sie nicht gebeugt werden müssen, Zahlen mit
// Mehrzahl-Wörtern nur über `form()` (Regeln wie `Intl.PluralRules`, von Hand -
// goja hat kein Intl; der Wächter vergleicht mit dem echten `Intl`).
//
// ⚠️ Kein `Intl`, kein `toLocaleDateString`: goja hat keine Sprachdaten.
// Eine Zeile der Texte ist vertrauenswürdiger Inhalt und wird nicht maskiert; alles,
// was von aussen kommt (Name, Klasse, Link), geht durch `esc`.

var NEUN_SPRACHEN = ["bg", "el", "hu", "nl", "pt", "br", "ro", "sv", "uk"];

var KLEIN = '<p style="color:#666;font-size:12px">';
var TD = 'style="padding:6px 8px;border-bottom:1px solid #eee"';
var TD_R = 'style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right"';

/** Die Programme - Eigennamen, in jeder Sprache gleich. */
var PROGRAMM_NAMEN = {
  tippen: "Tastenflow",
};

function istNeun(sprache) {
  return NEUN_SPRACHEN.indexOf(String(sprache || "")) >= 0;
}

/** Die Texte einer der neun Sprachen - jede Sprache in ihrer eigenen Datei. */
function texte(sprache) {
  return require(`${__hooks}/tt_mail_neun_${sprache}_lib.pb.js`);
}

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pad2(n) {
  return n < 10 ? "0" + n : "" + n;
}

/** Setzt {name}-Platzhalter ein. Ein unbekannter Platzhalter bleibt stehen (der Wächter fängt ihn). */
function fill(text, werte) {
  return String(text).replace(/\{(\w+)\}/g, function (ganz, name) {
    return Object.prototype.hasOwnProperty.call(werte, name) ? String(werte[name]) : ganz;
  });
}

/** Alle neun schreiben das Dezimalkomma. */
function mailZahl(n) {
  return String(n).replace(".", ",");
}

/**
 * Die Mehrzahl-Kategorie wie `Intl.PluralRules` (Wächter: Vergleich über 0-250 und
 * Bruchzahlen). `pt` ist Portugal (nur 1 ist Einzahl), `br` Brasilien (0 und 1).
 */
function kategorie(sprache, n) {
  var ganz = n === Math.floor(n);
  var m10 = n % 10;
  var m100 = n % 100;
  if (sprache === "hu") return n === 1 ? "one" : "other";
  if (sprache === "br") return Math.floor(n) === 0 || Math.floor(n) === 1 ? "one" : "other";
  if (sprache === "ro") {
    if (!ganz) return "few";
    if (n === 1) return "one";
    return n === 0 || (m100 >= 1 && m100 <= 19) ? "few" : "other";
  }
  if (sprache === "uk") {
    if (!ganz) return "other";
    if (m10 === 1 && m100 !== 11) return "one";
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "few";
    return "many";
  }
  // bg, el, nl, pt, sv
  return n === 1 ? "one" : "other";
}

/** Eine Zahl mit ihrer Form: `formen` = { one, few?, many?, other }, `#` steht für die Zahl. */
function form(sprache, n, formen) {
  var f = formen[kategorie(sprache, n)] || formen.other;
  return f.replace("#", mailZahl(n));
}

function prozent(sprache, n) {
  return fill(texte(sprache).fmt.prozent, { n: mailZahl(n) });
}

/** Datum mit Jahr aus Tag/Monat/Jahr. */
function datumAus(T, tag, monat0, jahr) {
  return fill(T.fmt.datum, { t: tag, m: T.fmt.monate[monat0], j: jahr });
}

/** Das Datum in der Server-Uhr (wie `datumCs`). */
function datum(T, ms) {
  var d = new Date(ms);
  return datumAus(T, d.getDate(), d.getMonth(), d.getFullYear());
}

function spanneAus(T, t1, m1, t2, m2) {
  return m1 === m2
    ? fill(T.fmt.spanneGleich, { t1: t1, t2: t2, m: T.fmt.monate[m2] })
    : fill(T.fmt.spanneUeber, { t1: t1, m1: T.fmt.monate[m1], t2: t2, m2: T.fmt.monate[m2] });
}

/** Montag bis Sonntag (Server-Uhr, wie `wocheSpanneCs` in der Text-Lib). */
function wocheSpanne(T, montagMs) {
  var a = new Date(montagMs);
  var b = new Date(montagMs + 6 * 24 * 3600000 + 12 * 3600000);
  return spanneAus(T, a.getDate(), a.getMonth(), b.getDate(), b.getMonth());
}

function uhr(T, h, m) {
  return fill(T.fmt.uhr, { h: h, hh: pad2(h), mm: pad2(m) });
}

// ── 1. Wochenbericht der Selbstlernenden ───────────────────────────────────

function selbstWoche(d, sprache) {
  var T = texte(sprache);
  var W = T.woche;
  var minAbk = T.fmt.minAbk;
  var zeilen = d.zeilen || [];
  var rows = "";
  for (var i = 0; i < zeilen.length; i++) {
    var z = zeilen[i];
    rows +=
      "<tr>" +
      "<td " + TD + ">" + esc(PROGRAMM_NAMEN[z.programm] || z.name) + "</td>" +
      "<td " + TD_R + ">" + z.minuten + " " + minAbk + "</td>" +
      "<td " + TD_R + ">" + z.tage + "</td>" +
      "<td " + TD_R + ">" + z.anzahl + "</td>" +
      "</tr>";
  }
  var spanne = wocheSpanne(T, d.wocheStartMs);
  var minuten = d.minutenGesamt + " " + minAbk;
  var link = d.appUrl
    ? '<p><a href="' + esc(d.appUrl) + '/lernwerkstatt">' + W.weiter + "</a></p>"
    : "";
  return {
    subject: fill(W.betreff, { spanne: spanne, minuten: minuten }),
    html:
      '<div lang="' + T.lang + '" style="font-family:system-ui,Segoe UI,Arial,sans-serif;font-size:15px;color:#222">' +
      "<p>" + T.anredeDu + "</p>" +
      "<p>" + fill(W.titel, { spanne: spanne }) + "<br>" +
      W.zeit + " <strong>" + minuten + "</strong><br>" +
      W.tage + " <strong>" + d.tageAktiv + "</strong></p>" +
      '<table style="border-collapse:collapse;margin:12px 0">' +
      "<thead><tr>" +
      '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:left">' + W.kopfProgramm + "</th>" +
      '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">' + W.kopfZeit + "</th>" +
      '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">' + W.kopfTage + "</th>" +
      '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">' + W.kopfAufgaben + "</th>" +
      "</tr></thead><tbody>" + rows + "</tbody></table>" +
      link +
      KLEIN + W.warum + "</p>" +
      (d.fussHtml || "") +
      "</div>",
  };
}

// ── 2. Die Löschwarnung ────────────────────────────────────────────────────

function loeschWarnung(d, sprache) {
  var T = texte(sprache);
  var L = T.loesch;
  var link = d.appUrl
    ? '<p><a href="' + esc(d.appUrl) + '/lernwerkstatt">' + L.link + "</a></p>"
    : "";
  return {
    subject: L.betreff,
    html:
      '<div lang="' + T.lang + '" style="font-family:system-ui,Segoe UI,Arial,sans-serif;font-size:15px;color:#222">' +
      "<p>" + T.anredeDu + "</p>" +
      "<p>" + L.satz + "</p>" +
      "<p><strong>" + fill(L.warnung, { datum: esc(datum(T, d.loeschAmMs)) }) + "</strong> " + L.genuegt + "</p>" +
      link +
      KLEIN + L.warum + "</p>" +
      KLEIN + d.fuss + "</p>" +
      "</div>",
  };
}

// ── 3. Die Begrüssung einer neuen Lehrkraft ────────────────────────────────

function willkommen(d, sprache) {
  var T = texte(sprache);
  var W = T.willkommen;
  var basis = d.appUrl ? String(d.appUrl).replace(/\/+$/, "") : "";
  var link = function (pfad, label) {
    return basis ? '<a href="' + esc(basis + pfad) + '">' + label + "</a>" : label;
  };
  return {
    vonName: T.vonName,
    subject: W.betreff,
    html:
      '<div lang="' + T.lang + '">' +
      "<p>" + T.anredeSie + "</p>" +
      "<p>" + W.satz + "</p>" +
      "<ul>" +
      "<li>" + link("/programme/braille", W.braille) + " " + W.brailleZusatz + "</li>" +
      "<li>" + link("/programme/tastenflow", W.tastenflow) + "</li>" +
      "</ul>" +
      "<p>" + W.anmeldenVor + " " + link("/lernprogramm-passwort", W.passwortLink) + W.anmeldenNach + "</p>" +
      KLEIN + W.warum + "</p>" +
      "</div>",
  };
}

// ── 4. Ein Kind antwortet der Lehrkraft ────────────────────────────────────

function nachricht(d, sprache) {
  var T = texte(sprache);
  var N = T.nachricht;
  var wer = d.fromName || N.werUnbekannt;
  var body = esc(d.body).replace(/\n/g, "<br>");
  var link = d.appUrl
    ? '<p><a href="' + esc(d.appUrl) + '/lernwerkstatt">' + N.link + "</a></p>"
    : "";
  return {
    subject: fill(N.betreff, { wer: wer }),
    html:
      '<div lang="' + T.lang + '">' +
      "<p>" + fill(N.satz, { wer: esc(wer) }) + "</p>" +
      '<blockquote style="border-left:3px solid #ccc;margin:0;padding:0 0 0 12px;color:#333">' +
      body +
      "</blockquote>" +
      link +
      KLEIN + N.warum + "</p>" +
      "</div>",
  };
}

// ── 5. Die Sammel-Mail der Tippchallenge ───────────────────────────────────

function niveauName(niveau, sprache) {
  var t = texte(sprache).niveau;
  return Object.prototype.hasOwnProperty.call(t, niveau) ? t[niveau] : niveau;
}

function schreibprobe(d, sprache) {
  var T = texte(sprache);
  var P = T.probe;
  var F = T.fmt;
  var frei = d.modus === "frei";
  var proz = function (x) {
    return x > 0 ? fill(F.prozent, { n: mailZahl(Math.round(x * 1000) / 10) }) : "-";
  };
  // ⚠️ UTC-Getter: `d.startMs` kommt schon als naive Wanduhr der Lehrkraft (wie in der Text-Lib).
  var fmtZeit = function (ts) {
    if (!ts) return "-";
    var dt = new Date(ts);
    return (
      datumAus(T, dt.getUTCDate(), dt.getUTCMonth(), dt.getUTCFullYear()) +
      ", " + uhr(T, dt.getUTCHours(), dt.getUTCMinutes())
    );
  };
  var zeitZusatz = d.zeitLokal === false ? F.zeitzone : "";
  var zeichen = function (n) {
    return form(sprache, Number(n), F.mehrzahl.zeichen);
  };
  var reihen = d.reihen || [];
  var rows = "";
  for (var i = 0; i < reihen.length; i++) {
    var r = reihen[i];
    if (!r.da) {
      rows +=
        '<tr style="color:#999">' +
        "<td " + TD + ">-</td>" +
        "<td " + TD + ">" + esc(r.name) + "</td>" +
        '<td colspan="7" ' + TD + ">" + P.nichtDa + "</td>" +
        "</tr>";
      continue;
    }
    var rangZelle =
      r.rang === null
        ? '<span style="color:#999">-</span>'
        : "<b>" + fill(F.prozent, { n: mailZahl(r.rang) }) + "</b>";
    var wacklig = r.wacklig
      ? r.wacklig
          .map(function (w) {
            return w.zeichen + " (" + fill(F.prozent, { n: Math.round((1 - (w.quote || 0)) * 100) }) + ")";
          })
          .join(", ")
      : "";
    var hinweise = [];
    if (r.zusatz > 0) hinweise.push(fill(P.extra, { proz: fill(F.prozent, { n: mailZahl(r.zusatz) }) }));
    if (r.textZuEnde) hinweise.push(P.textZuEnde);
    if (r.frueherAbgegeben) hinweise.push(P.frueher);
    if (typeof r.korrekturen === "number") hinweise.push(P.korrekturen + " " + r.korrekturen);
    var sek = Math.round(r.vorlesenMs / 1000);
    rows +=
      "<tr>" +
      "<td " + TD_R + ">" + rangZelle + "</td>" +
      "<td " + TD + ">" + esc(r.name) + "</td>" +
      "<td " + TD_R + ">" +
      (r.gewertet ? "<b>" + mailZahl(r.wert) + "</b>" : '<span style="color:#999">-</span>') +
      "</td>" +
      "<td " + TD + ">" +
      (r.vorlesenMs > 0
        ? fill(P.vorlesenJa, { zeit: Math.floor(sek / 60) + ":" + (sek % 60 < 10 ? "0" : "") + (sek % 60) })
        : P.vorlesenNein) +
      "</td>" +
      "<td " + TD_R + ">" + r.anschlaege +
      (r.apm !== r.anschlaege ? ' <span style="color:#666">(' + r.apm + ")</span>" : "") +
      "</td>" +
      "<td " + TD_R + ">" + esc(proz(r.genau)) + "</td>" +
      "<td " + TD_R + ">" + r.zeichen + "</td>" +
      "<td " + TD_R + ">" + r.fehler + "</td>" +
      "<td " + TD + ">" + esc(wacklig || "-") +
      (!r.gewertet ? '<br><span style="color:#666;font-size:12px">' + P.zuKurz + "</span>" : "") +
      (hinweise.length ? '<br><span style="color:#666;font-size:12px">' + esc(hinweise.join(" · ")) + "</span>" : "") +
      "</td>" +
      "</tr>";
  }
  var niveau = niveauName(d.niveau, sprache);
  var schnittG = d.angetreten ? proz(d.genauSchnitt) : "-";
  var mitKlammer = reihen.some(function (x) {
    return x.da && x.apm !== x.anschlaege;
  });
  var th = function (text, rechts) {
    return (
      '<th style="padding:6px 8px;border-bottom:2px solid #ccc' + (rechts ? ";text-align:right" : "") + '">' +
      text + "</th>"
    );
  };
  var openLine = d.appUrl
    ? '<p><a href="' + esc(d.appUrl) + '/meine-klasse?app=tippen">' + P.oeffnen + "</a></p>"
    : "";
  var hundert = fill(F.prozent, { n: 100 });
  var neunzig = fill(F.prozent, { n: 90 });
  return {
    subject: d.wort + " - " + d.className + " (" + niveau + ")",
    html:
      '<div lang="' + T.lang + '">' +
      "<p>" + T.anredeSie + "</p>" +
      "<p>" +
      fill(P.ende, {
        klasse: "<b>" + esc(d.className) + "</b>",
        grund: d.alleFertig ? P.grundFertig : P.grundZeit,
      }) +
      "</p>" +
      "<p>" +
      P.labelNiveau + " <b>" + esc(niveau) + "</b> · " +
      P.labelText + " " + ((Number(d.textNr) || 0) + 1) +
      (Number(d.startZeile) > 0 ? fill(P.abZeile, { n: Number(d.startZeile) + 1 }) : "/15") +
      " · " +
      P.labelZeit + " " + d.dauerMin + " " + F.minAbk + " · " +
      P.labelStart + " " + esc(fmtZeit(d.startMs)) + zeitZusatz +
      (d.zuschlag > 0 ? " · " + P.labelZuschlag + " " + fill(F.prozent, { n: mailZahl(d.zuschlag) }) : "") +
      (frei ? " · " + fill(P.artFrei, { zeichen: zeichen(d.fehlerGewicht) }) : "") +
      "</p>" +
      "<p>" + fill(P.teilnahme, { von: fill(F.vonZahl, { a: d.angetreten, b: Number(d.anzahlKinder) || 0 }) }) +
      (d.angetreten
        ? "<br>" + P.schnittTempo + " <b>" + d.schnittA + " " + P.tempoEinheit + "</b><br>" +
          P.schnittGenau + " " + esc(schnittG)
        : "") +
      "</p>" +
      '<table style="border-collapse:collapse;font-size:14px">' +
      '<thead><tr style="text-align:left">' +
      th(P.kopfRang, true) + th(P.kopfName) + th(P.kopfWert, true) + th(P.kopfVorlesen) +
      th(P.kopfTempo, true) + th(P.kopfGenau, true) + th(P.kopfZeichen, true) +
      th(frei ? P.kopfFehlerFrei : P.kopfFehler, true) + th(P.kopfWacklig) +
      "</tr></thead><tbody>" + rows + "</tbody></table>" +
      '<p style="color:#666;font-size:13px"><b>' + P.rangTitel + "</b> " +
      fill(P.rangA, {
        zeichen: zeichen(d.fehlerGewicht),
        tempo: form(sprache, Number(d.bezugstempo), F.mehrzahl.anschlaege),
      }) +
      " <b>" + fill(P.rangB, { hundert: hundert }) + "</b> " +
      fill(P.rangC, { mind: zeichen(d.mindZeichen) }) +
      (mitKlammer ? " " + P.klammer : "") +
      "</p>" +
      '<p style="color:#666;font-size:13px"><b>' + P.vorlesenTitel + "</b> " + P.vorlesenText + "</p>" +
      KLEIN + fill(P.wackligText, { neunzig: neunzig }) + "</p>" +
      openLine +
      KLEIN + P.warum + "</p>" +
      (d.fussHtml || "") +
      "</div>",
  };
}

// ── 6. Konto-Mails (Passwort, Bestätigung, Adresswechsel) ──────────────────

function kontoMail(sprache, art, sammlung, link) {
  var T = texte(sprache);
  var t = T.konto[sammlung] && T.konto[sammlung][art];
  if (!t || !link) return null;
  return {
    subject: t.betreff,
    html:
      '<div lang="' + T.lang + '">' +
      "<p>" + (sammlung === "tt_pupils" ? T.anredeDu : T.anredeSie) + "</p>" +
      "<p>" + t.vor + "</p>" +
      '<p><a href="' + esc(link) + '">' + t.linkWort + "</a></p>" +
      (t.nach ? "<p>" + t.nach + "</p>" : "") +
      KLEIN + t.klein + "</p>" +
      "</div>",
  };
}

// ── 7. Abbestellen: dieselbe Form wie ein Eintrag von FREMDSPRACHEN ────────

// `htmlLang`: der Sprachcode der Seite - „br" wäre im HTML Bretonisch.
function abbestellen(sprache) {
  var T = texte(sprache);
  T.abbestellen.htmlLang = T.lang;
  return T.abbestellen;
}

// ── 8. Einladung als weitere Lehrkraft ─────────────────────────────────────

function einladung(d, sprache) {
  var T = texte(sprache);
  var E = T.einladung;
  var wer = d.einladerName ? esc(d.einladerName) : E.werUnbekannt;
  return {
    vonName: T.vonName,
    subject: fill(E.betreff, { klasse: d.klasseName }),
    html:
      '<div lang="' + T.lang + '">' +
      "<p>" + T.anredeSie + "</p>" +
      "<p>" + fill(E.satz, { wer: wer, klasse: "<strong>" + esc(d.klasseName) + "</strong>" }) + "</p>" +
      '<p><a href="' + esc(d.link) + '">' + E.link + "</a></p>" +
      "<p>" + E.neuesKonto + "</p>" +
      KLEIN + E.warum + "</p>" +
      "</div>",
  };
}

// ── 9. Zugangsdaten eines Kindes ───────────────────────────────────────────

function zugang(d, sprache) {
  var T = texte(sprache);
  var Z = T.zugang;
  var linkAbsatz = d.appUrl ? '<p><a href="' + esc(d.appUrl) + '">' + esc(d.appUrl) + "</a></p>" : "";
  return {
    vonName: T.vonName,
    subject: fill(Z.betreff, { name: d.name }),
    html:
      '<div lang="' + T.lang + '">' +
      "<p>" + fill(Z.titel, { name: "<strong>" + esc(d.name) + "</strong>" }) + "</p>" +
      "<p>" + Z.labelName + " <strong>" + esc(d.name) + "</strong><br>" +
      Z.labelPasswort + " <strong>" + esc(d.passwort) + "</strong><br>" +
      Z.labelCode + " <strong>" + esc(d.classCode) + "</strong></p>" +
      "<p>" + Z.satz + "</p>" +
      linkAbsatz +
      KLEIN + Z.warum + "</p>" +
      "</div>",
  };
}

// ── 10. Der Klassen-Wochenbericht ──────────────────────────────────────────
//
// `h`: die Rechnungen aus `tt_wochenziel_lib.pb.js` (hereingereicht, damit beide
// Dateien einander nicht laden): { wochenStartVerschobenMs, wienWanduhrFelder }.

function dauer(T, minuten) {
  var m = Math.round(minuten);
  if (m < 60) return fill(T.fmt.dauerMin, { m: m });
  var rest = m % 60;
  var h = Math.floor(m / 60);
  return rest ? fill(T.fmt.dauerBeide, { h: h, m: rest }) : fill(T.fmt.dauerStd, { h: h });
}

function wochenzielZelle(T, z) {
  var B = T.bericht;
  var minAbk = T.fmt.minAbk;
  if (!z.hatZiel) return B.keinZiel;
  if (z.erlassen) return B.erlassen;
  if (!z.zielwoche) return B.keineZielwoche;
  var basis = fill(B.zielZelle, {
    ist: Math.round(z.erfuelltMin) + " " + minAbk,
    soll: Math.round(z.zielMin) + " " + minAbk,
  });
  return z.offenMin <= 0 ? basis + " ✓" : basis;
}

function bericht(daten, sprache, h) {
  var T = texte(sprache);
  var B = T.bericht;
  var F = T.fmt;
  var klasse = daten.klasse;
  var zone = daten.zeitzone;
  var startMs = daten.wocheStartMs;
  var endeMs = h.wochenStartVerschobenMs(startMs, 1, zone);
  var zeilen = daten.zeilen || [];
  var a = h.wienWanduhrFelder(startMs, zone);
  var e = h.wienWanduhrFelder(endeMs - 24 * 3600000, zone);
  var spanne = spanneAus(T, a.tag, a.monat0, e.tag, e.monat0);
  var wtDatum = function (f) {
    return fill(F.wochentagDatum, { w: F.wochentage[f.wochentag], t: f.tag, m: F.monate[f.monat0] });
  };

  var aktiv = 0;
  var minutenSumme = 0;
  var zielGesamt = 0;
  var zielErreicht = 0;
  var zeilenHtml = "";
  for (var i = 0; i < zeilen.length; i++) {
    var z = zeilen[i];
    var geuebt = Math.round(z.geuebtMin);
    if (geuebt > 0 || z.tage > 0) {
      aktiv++;
      minutenSumme += geuebt;
    }
    if (z.zielwoche) {
      zielGesamt++;
      if (z.offenMin <= 0) zielErreicht++;
    }
    var nachholen =
      z.nachholenOffenMin === null || z.nachholenOffenMin === undefined || !(z.nachholenOffenMin > 0)
        ? ""
        : fill(B.nachholenZelle, { min: Math.round(z.nachholenOffenMin) + " " + F.minAbk });
    var schuljahr =
      z.schuljahrAnteil === null || z.schuljahrAnteil === undefined
        ? "-"
        : fill(F.prozent, { n: Math.round(z.schuljahrAnteil * 100) });
    zeilenHtml +=
      "<tr>" +
      "<td " + TD + ">" + esc(z.name) + "</td>" +
      "<td " + TD_R + ">" + geuebt + " " + F.minAbk + "</td>" +
      "<td " + TD_R + ">" + (z.tage || 0) + "</td>" +
      "<td " + TD_R + ">" + esc(z.treffsicherheit || "-") + "</td>" +
      "<td " + TD_R + ">" + esc(z.stufe || "-") + "</td>" +
      "<td " + TD + ">" + esc(wochenzielZelle(T, z)) + "</td>" +
      "<td " + TD_R + ">" + esc(schuljahr) + "</td>" +
      "<td " + TD_R + ">" + esc(nachholen) + "</td>" +
      "</tr>";
  }

  var v = daten.ortVon;
  var b = daten.ortBis;
  var titel = fill(B.titel, { klasse: "<b>" + esc(klasse) + "</b>" });
  var intro =
    v && b
      ? "<p>" + titel + "<br>" +
        B.zeitraum + " " + wtDatum(v) + ", " + uhr(T, v.stunde, v.minute) + " - " +
        wtDatum(b) + ", " + uhr(T, b.stunde, b.minute) + (v.lokal ? "" : F.zeitzone) + "<br>" +
        B.wochenbeginn + " " + F.wochentage[v.wochentag] + ", " + uhr(T, v.stunde, v.minute) + "</p>"
      : "<p>" + titel + "<br>" +
        B.zeitraum + " " + wtDatum(a) + ", " + uhr(T, 8, 0) + " - " +
        wtDatum(h.wienWanduhrFelder(endeMs, zone)) + ", " + uhr(T, 8, 0) + F.zeitzone + "<br>" +
        B.wochenbeginn + " " + F.wochentage[0] + ", " + uhr(T, 8, 0) + "</p>";

  var zusammenfassung =
    fill(B.geuebt, { von: fill(F.vonZahl, { a: aktiv, b: zeilen.length }) }) + "<br>" +
    fill(B.gesamt, { dauer: dauer(T, minutenSumme) });
  if (zielGesamt > 0) {
    zusammenfassung += "<br>" + fill(B.zielErfuellt, { von: fill(F.vonZahl, { a: zielErreicht, b: zielGesamt }) });
  }
  if (daten.gesperrtMs > 0) {
    var stunden = Math.round((daten.gesperrtMs / 3600000) * 10) / 10;
    zusammenfassung += "<br>" + fill(B.gesperrt, { stunden: form(sprache, stunden, F.mehrzahl.stunden) });
  }

  var linkZeile = daten.klassenLink
    ? '<p><a href="' + esc(daten.klassenLink) + '">' + fill(B.oeffnen, { klasse: esc(klasse) }) + "</a></p>"
    : "";

  return {
    subject: fill(B.betreff, { klasse: klasse, spanne: spanne }),
    html:
      '<div lang="' + T.lang + '">' +
      intro +
      "<p>" + zusammenfassung + "</p>" +
      '<table style="border-collapse:collapse;font-size:14px">' +
      '<thead><tr style="text-align:left">' +
      '<th style="padding:6px 8px;border-bottom:2px solid #ccc">' + B.kopfName + "</th>" +
      '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">' + B.kopfZeit + "</th>" +
      '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">' + B.kopfTage + "</th>" +
      '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">' + B.kopfGenau + "</th>" +
      '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">' + B.kopfStufe + "</th>" +
      '<th style="padding:6px 8px;border-bottom:2px solid #ccc">' + B.kopfZiel + "</th>" +
      '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">' + B.kopfSchuljahr + "</th>" +
      '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">' + B.kopfNachholen + "</th>" +
      "</tr></thead><tbody>" + zeilenHtml + "</tbody></table>" +
      linkZeile +
      (daten.fussHtml || "") +
      "</div>",
  };
}

// Export nur im require()-Kontext; beim Auto-Laden durch PocketBase gibt es kein `module`.
if (typeof module !== "undefined") {
  module.exports = {
    NEUN_SPRACHEN: NEUN_SPRACHEN,
    istNeun: istNeun,
    texte: texte,
    kategorie: kategorie,
    form: form,
    prozent: prozent,
    datum: function (sprache, ms) {
      return datum(texte(sprache), ms);
    },
    selbstWoche: selbstWoche,
    loeschWarnung: loeschWarnung,
    willkommen: willkommen,
    nachricht: nachricht,
    niveauName: niveauName,
    schreibprobe: schreibprobe,
    kontoMail: kontoMail,
    abbestellen: abbestellen,
    einladung: einladung,
    zugang: zugang,
    bericht: bericht,
  };
}
