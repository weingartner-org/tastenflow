/**
 * Die Sätze der Abschluss-Karte nach einer Runde - mehrere je Sternzahl
 * (29.10.2026, siehe `rundenAbwechslung.ts` für die Auswahl).
 *
 * ── REGELN FÜR JEDEN SATZ HIER ─────────────────────────────────────────────
 *  • Nie etwas gegen die Person, auch nicht beruhigend gemeint
 *    ([[feedback_nie_gegen_das_kind]]): Gelobt oder benannt wird die RUNDE und
 *    die HANDLUNG, nie das Kind. Bei einem Stern ermutigend - ohne „schade",
 *    ohne „leider", ohne „nur".
 *  • Kurz für die Braillezeile (40 Zellen): Titel höchstens 40 Zeichen, jeder
 *    Satz höchstens 60. Der Wächter `tests/tastenflow-runden-abwechslung.test.ts`
 *    misst das.
 *  • Echte Umlaute; als Strich nur der Bindestrich „-".
 *  • Kinder: warm, ein Ausrufezeichen höchstens. Jugend und Erwachsene: kein
 *    „!", kein „Super", sachlich-freundlich.
 *  • Die ERSTE Fassung einer Liste ist, wo es den Satz vorher gab, sein
 *    Wortlaut von vorher - Aufrufer ohne Nummer (und die Tests, die den
 *    bekannten Wortlaut prüfen) sehen ihn unverändert. Neu sind die Kinder-
 *    Titel für zwei und drei Sterne. Die Kinder-Karte hat weiterhin KEINE
 *    Bemerkung unter den Sternen (Entscheidung von früher): Titel, gesprochener
 *    Satz und Rat tragen die Abwechslung; eine zweite Zeile mehr zu lesen
 *    wäre für Braillezeile und einfache Sprache zu viel.
 *  • Wörter wie „Sterne" bleiben in den gesprochenen Sätzen stehen: Wer nur
 *    hört, erfährt die Zahl dort.
 */

/** Je Sternstufe (1, 2, 3) eine Liste. */
export type Stufenliste = Record<1 | 2 | 3, readonly string[]>;

// ═══ KINDER · Deutsch ═══════════════════════════════════════════════════════

export const KIND_TITEL_DE: Stufenliste = {
  1: [
    "Runde geschafft!",
    "Ein Stern ist geholt!",
    "Ein Stern - es geht weiter!",
    "Geschafft, Stern eingesammelt!",
    "Ein Stern und ein Stück weiter!",
    "Die Runde ist im Kasten!",
  ],
  2: [
    "Zwei Sterne geholt!",
    "Starke Runde - zwei Sterne!",
    "Das lief schon richtig gut!",
    "Zwei Sterne, der dritte winkt!",
    "Schöne Runde, zwei Sterne!",
    "Zwei Sterne - weiter so!",
  ],
  3: [
    "Drei Sterne geschafft!",
    "Alle drei Sterne!",
    "Das war eine Glanzrunde!",
    "Glatt durchgelaufen - drei Sterne!",
    "Die Finger flitzen - drei Sterne!",
    "Volle Sternenzahl!",
  ],
};

/** Gesprochen: die erste Fassung ist der Wortlaut von vorher. */
export const KIND_GESPROCHEN_DE: Stufenliste = {
  1: [
    "1 Stern erreicht! Weiter so!",
    "1 Stern geholt! Auf geht's!",
    "1 Stern! Die nächste Runde wartet.",
    "1 Stern erreicht! Bleib dran!",
    "1 Stern! Jede Runde hilft.",
    "1 Stern! Es geht Schritt für Schritt.",
  ],
  2: [
    "Stark! 2 Sterne erreicht!",
    "Gut gemacht! 2 Sterne!",
    "2 Sterne geholt!",
    "Schön! 2 Sterne!",
    "2 Sterne! Der dritte ist nicht weit.",
    "Starke Runde! 2 Sterne!",
  ],
  3: [
    "Super! 3 Sterne erreicht!",
    "Klasse! Alle 3 Sterne!",
    "Wow! 3 Sterne!",
    "Glanzrunde! 3 Sterne!",
    "3 Sterne! Die Finger flitzen!",
    "Toll! Alle 3 Sterne geholt!",
  ],
};

// ═══ KINDER · Englisch (britisch) ═══════════════════════════════════════════

export const KIND_TITEL_EN: Stufenliste = {
  1: [
    "Round done!",
    "One star collected!",
    "One star - and on we go!",
    "Done, star in the bag!",
    "One star and a step further!",
    "The round is in the bag!",
  ],
  2: [
    "Two stars collected!",
    "Strong round - two stars!",
    "That went really well!",
    "Two stars, the third is close!",
    "Lovely round, two stars!",
    "Two stars - keep it up!",
  ],
  3: [
    "Three stars done!",
    "All three stars!",
    "What a brilliant round!",
    "Smooth run - three stars!",
    "Fingers flying - three stars!",
    "A full set of stars!",
  ],
};

export const KIND_GESPROCHEN_EN: Stufenliste = {
  1: [
    "1 star! Keep going!",
    "1 star collected! Off we go!",
    "1 star! The next round is waiting.",
    "1 star! Keep at it!",
    "1 star! Every round helps.",
    "1 star! One step at a time.",
  ],
  2: [
    "Strong! 2 stars!",
    "Well done! 2 stars!",
    "2 stars collected!",
    "Lovely! 2 stars!",
    "2 stars! The third is not far.",
    "Strong round! 2 stars!",
  ],
  3: [
    "Great! 3 stars!",
    "Brilliant! All 3 stars!",
    "Wow! 3 stars!",
    "Brilliant round! 3 stars!",
    "3 stars! Fingers flying!",
    "Lovely! All 3 stars collected!",
  ],
};

// ═══ JUGEND (11-15) und ERWACHSENE (ab 16) · Deutsch ════════════════════════

export const JUGEND_TITEL_DE: Stufenliste = {
  1: ["Runde geschafft.", "Runde abgeschlossen.", "Ein Stern ist ein Anfang.", "Dabeigeblieben."],
  2: ["Solide Runde.", "Gute Runde.", "Fast ganz oben.", "Sicher unterwegs."],
  3: ["Sauber getippt.", "Starke Runde.", "Glatt durchgelaufen.", "Alle drei Sterne."],
};

export const ERWACHSEN_TITEL_DE: Stufenliste = {
  1: ["Abschnitt geschafft.", "Abschnitt abgeschlossen.", "Ein Stern erreicht.", "Weiter geht es."],
  2: JUGEND_TITEL_DE[2],
  3: JUGEND_TITEL_DE[3],
};

export const JUGEND_BEMERKUNG_DE: Stufenliste = {
  1: [
    "Zählt trotzdem. Beim nächsten Mal etwas ruhiger.",
    "Jede Runde festigt die Tastenwege.",
    "Die nächste Runde startet frisch.",
    "Dranbleiben zählt mehr als eine einzelne Runde.",
  ],
  2: [
    "Tempo darf, Genauigkeit muss.",
    "Der dritte Stern liegt in Reichweite.",
    "Ein ruhigerer Takt bringt oft den dritten Stern.",
    "Die Richtung stimmt.",
  ],
  3: [
    "Deine Finger wissen, was sie tun.",
    "Tempo und Genauigkeit passen zusammen.",
    "So festigt sich das Zehnfingersystem.",
    "Die Tasten sitzen.",
  ],
};

/**
 * Die Bemerkungen der Erwachsenen in beiden Anreden. Nur die erste Fassung
 * der drei Sternstufen trägt ein „deine/Ihre" - der Rest ist anredefrei, damit
 * Du- und Sie-Fassung nicht auseinanderlaufen können.
 */
export function erwachsenBemerkungDe(sie: boolean): Stufenliste {
  return {
    1: [
      "Geschafft ist geschafft, beim nächsten Mal etwas ruhiger.",
      "Jeder Abschnitt festigt die Tastenwege.",
      "Der nächste Abschnitt beginnt frisch.",
      "Dranbleiben zählt mehr als ein einzelner Abschnitt.",
    ],
    2: JUGEND_BEMERKUNG_DE[2],
    3: [
      `${sie ? "Ihre" : "Deine"} Finger wissen, was sie tun.`,
      ...JUGEND_BEMERKUNG_DE[3].slice(1),
    ],
  };
}

export const JUGEND_GESPROCHEN_DE: Stufenliste = {
  1: ["1 Stern erreicht.", "1 Stern. Runde abgeschlossen.", "1 Stern. Weiter geht es.", "1 Stern. Dranbleiben zählt."],
  2: ["2 Sterne erreicht.", "2 Sterne. Solide Runde.", "2 Sterne. Der dritte ist nah.", "2 Sterne. Sicher unterwegs."],
  3: ["3 Sterne. Sauber getippt.", "3 Sterne. Starke Runde.", "3 Sterne. Glatt durchgelaufen.", "Alle 3 Sterne."],
};

export const ERWACHSEN_GESPROCHEN_DE: Stufenliste = {
  1: ["1 Stern erreicht.", "1 Stern. Abschnitt abgeschlossen.", "1 Stern. Weiter geht es.", "1 Stern. Dranbleiben zählt."],
  2: JUGEND_GESPROCHEN_DE[2],
  3: ["3 Sterne erreicht.", "3 Sterne. Sauber getippt.", "3 Sterne. Starke Runde.", "Alle 3 Sterne erreicht."],
};

// ═══ JUGEND und ERWACHSENE · Englisch (britisch) ════════════════════════════

export const JUGEND_TITEL_EN: Stufenliste = {
  1: ["Round done.", "Round complete.", "One star is a start.", "Stuck with it."],
  2: ["Solid round.", "Good round.", "Almost at the top.", "Steady going."],
  3: ["Clean typing.", "Strong round.", "Smooth run.", "All three stars."],
};

export const ERWACHSEN_TITEL_EN: Stufenliste = {
  1: ["Section complete.", "Section finished.", "One star earned.", "On we go."],
  2: JUGEND_TITEL_EN[2],
  3: JUGEND_TITEL_EN[3],
};

export const JUGEND_BEMERKUNG_EN: Stufenliste = {
  1: [
    "It still counts. Take it a little slower next time.",
    "Every round firms up the key paths.",
    "The next round starts fresh.",
    "Sticking with it counts for more than one round.",
  ],
  2: [
    "Speed is nice, accuracy is a must.",
    "The third star is within reach.",
    "A calmer pace often brings the third star.",
    "You are heading the right way.",
  ],
  3: [
    "Your fingers know what they are doing.",
    "Speed and accuracy go together.",
    "This is how the ten-finger system settles in.",
    "The keys are sitting well.",
  ],
};

export const ERWACHSEN_BEMERKUNG_EN: Stufenliste = {
  1: [
    "You made it. Take it a little slower next time.",
    "Every section firms up the key paths.",
    "The next section starts fresh.",
    "Sticking with it counts for more than one section.",
  ],
  2: JUGEND_BEMERKUNG_EN[2],
  3: JUGEND_BEMERKUNG_EN[3],
};

export const JUGEND_GESPROCHEN_EN: Stufenliste = {
  1: ["1 star.", "1 star. Round complete.", "1 star. On we go.", "1 star. Sticking with it counts."],
  2: ["2 stars.", "2 stars. Solid round.", "2 stars. The third is close.", "2 stars. Steady going."],
  3: ["3 stars. Clean typing.", "3 stars. Strong round.", "3 stars. Smooth run.", "All 3 stars."],
};

export const ERWACHSEN_GESPROCHEN_EN: Stufenliste = {
  1: ["1 star.", "1 star. Section finished.", "1 star. On we go.", "1 star. Sticking with it counts."],
  2: JUGEND_GESPROCHEN_EN[2],
  3: ["3 stars.", "3 stars. Clean typing.", "3 stars. Strong round.", "All 3 stars."],
};

// ═══ RAT bei drei Sternen (Kinder-Rückmeldung unter der Karte) ══════════════

/**
 * Der Rat-Satz, wenn die Runde drei Sterne hatte und trotzdem noch eine Taste
 * wackelt. Vorher kam hier je nach Lage „Du bist nah dran …" oder „Schreib die
 * nächste Runde ruhiger" - neben drei Sternen ein Widerspruch. Diese Sätze
 * loben nicht noch einmal und mahnen nichts; sie sagen, dass genau so die
 * nächste Taste kommt.
 *
 * Es gibt sie nur für Deutsch und Englisch. Die anderen Sprachen bekommen bei
 * drei Sternen KEINEN Rat-Satz (statt eines, der der Karte widerspricht), bis
 * dort eigene Sätze geschrieben sind.
 */
export const RAT_DREI_STERNE: Partial<Record<"de" | "en", readonly string[]>> = {
  de: [
    "Genau so weiter - dann kommt bald die nächste Taste.",
    "Bleib bei diesem Takt, die nächste Taste kommt.",
    "Mit Runden wie dieser kommt die nächste Taste bald.",
    "Halte diesen Takt, dann ist die nächste Taste dran.",
    "So eine Runde bringt die nächste Taste näher.",
    "Das war der richtige Takt für die nächste Taste.",
  ],
  en: [
    "Just keep going - the next key will come soon.",
    "Stay with this pace, the next key is coming.",
    "With rounds like this the next key comes soon.",
    "Hold this pace and the next key is up.",
    "A round like this brings the next key closer.",
    "That was just the right pace for the next key.",
  ],
};
