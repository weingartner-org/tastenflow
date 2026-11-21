/**
 * Die Texte des Spendenbanners, je Programm und Zielgruppe.
 * ===========================================================================
 * Johannes hat die Tastenflow-Texte am 18.09.2026 wortwörtlich vorgegeben -
 * fünf für Lehrkräfte (Sie-Form, „Ihre Klasse"), fünf für Selbstlernende ohne
 * Klasse (Du-Form, mit der Erwachsenen-Klausel „wenn du schon erwachsen
 * bist" - dieselbe Absicherung wie im bestehenden Baustein
 * `UnterstuetzenKnopf.tsx`: Ein Kind mit eigenem Konto liest den Satz einfach
 * als nicht auf sich gemünzt).
 *
 * ★★★ `{STUNDEN}` ist der einzige Platzhalter. Johannes' Vorgabe stand
 * ursprünglich mit den festen Zahlen 5/10/15/20/25 da - für den zweiten
 * Durchlauf (30/35/…) „müssen die Stunden stimmen", die Zahl wandert also
 * mit, der Satzbau bleibt. Siehe `spendenBannerTextIndex` in
 * `spendenbanner.ts` für die Zuordnung Meilenstein → Text.
 *
 * ⚠️ Bindestrich, nie Gedankenstrich (Braillezeile) - Johannes' Rohtext
 * benutzte an einer Stelle „–", hier durchgehend „-".
 */

import type { BedienSprache } from "@/lib/bedienSprache/sprache";
import { GEBIET, mehrzahl } from "@/lib/bedienSprache/texte";

export type SpendenBannerZielgruppe = "lehrkraft" | "selbstlernend";

export interface SpendenBannerTexte {
  /** Fünf Texte, Sie-Form, für eine Lehrkraft mit Klasse. */
  lehrkraft: readonly string[];
  /** Fünf Texte, Du-Form, für ein selbstlernendes Konto ohne Klasse. */
  selbstlernend: readonly string[];
}

const TASTENFLOW: SpendenBannerTexte = {
  lehrkraft: [
    "Herzlichen Glückwunsch: Ihre Klasse hat im Schnitt bereits {STUNDEN} Stunden Tastschreiben geübt - echte Tippzeit, nicht nur geöffnetes Programm. Ich hoffe, die Software hilft Ihnen im Unterricht. Software ist nie kostenlos! Für Entwicklung und Server entstehen laufend Kosten. Diese Seite wird privat weiterentwickelt, ohne Sponsor, und bleibt so lange werbefrei, solange sie Menschen wie Sie mit einem kleinen Beitrag unterstützen.",
    'Herzlichen Glückwunsch! Ihre Klasse hat gerade eine schöne Marke erreicht: im Schnitt {STUNDEN} Stunden Tastschreiben geübt - und zwar wirkliche Tippzeit, nicht einfach die Zeit mit offenem Programm. Ich hoffe sehr, die App ist Ihnen im Unterricht eine gute Hilfe. Ein Satz zur Seite dahinter: Keine Software ist kostenlos zu betreiben, Entwicklung und Server kosten laufend etwas. Ich baue diese Plattform privat und ohne Sponsor - unabhängig und ohne Werbung. Das bleibt nur möglich, wenn Menschen sie unterstützen, die etwas geben können und wollen. Über den Knopf "Unterstützen" geht das in wenigen Klicks.',
    "{STUNDEN} Stunden: So viel hat Ihre Klasse im Schnitt inzwischen mit dem Zehnfingersystem geübt - gemessen an der wirklichen Tippzeit, nicht an der Zeit mit offenem Programm. Herzlichen Glückwunsch, das ist eine echte Leistung Ihrer Klasse! Ich hoffe, die App ist Ihnen dabei eine gute Hilfe. Ganz nebenbei: Kostenlos heißt nicht umsonst gemacht, Entwicklung und Server kosten laufend etwas. Diese Seite hat bewusst keinen Sponsor - nur so bleibt sie werbefrei. Das trägt sich, wenn Menschen wie Sie etwas dazugeben.",
    "Ihre Klasse hat {STUNDEN} Stunden echte Tippzeit erreicht - herzlichen Glückwunsch! Diese Plattform ist privat entwickelt, ohne Sponsor, und bleibt nur werbefrei, wenn Menschen sie unterstützen. Entwicklung und Server kosten laufend etwas.",
    "Herzlichen Glückwunsch: Ihre Klasse übt inzwischen im Schnitt {STUNDEN} Stunden Tastschreiben - wirklich getippt, nicht nur mit offenem Programm gezählt. Ich hoffe, das hilft Ihnen im Unterricht weiter. Etwas Offenheit zur Seite dahinter: Ich entwickle diese Plattform privat, ohne Firma und ohne Sponsor dahinter. Das ist eine bewusste Entscheidung gegen Werbung - und sie trägt sich nicht von selbst, Entwicklung und Server kosten laufend etwas. Möglich ist das nur, wenn Menschen wie Sie es unterstützen.",
  ],
  selbstlernend: [
    "Herzlichen Glückwunsch: Du hast jetzt im Schnitt {STUNDEN} Stunden Tastschreiben geübt - wirkliche Tippzeit, nicht nur geöffnetes Programm. Ich hoffe, die App hilft dir gut beim Lernen. Keine Software ist kostenlos zu machen: Entwicklung und Server kosten laufend etwas. Diese Seite entsteht privat, ohne Sponsor, und bleibt so werbefrei. Wenn du schon erwachsen bist, freue ich mich, wenn du sie unterstützt.",
    'Herzlichen Glückwunsch! Du hast gerade eine schöne Marke erreicht: im Schnitt {STUNDEN} Stunden Tastschreiben geübt - und zwar wirkliche Tippzeit, nicht einfach die Zeit mit geöffnetem Programm. Ich hoffe sehr, die App ist dir dabei eine gute Hilfe. Ein Satz zur Seite dahinter: Keine Software ist kostenlos zu betreiben, Entwicklung und Server kosten laufend etwas. Ich baue diese Plattform privat und ohne Sponsor - unabhängig und ohne Werbung. Wenn du schon erwachsen bist, freue ich mich, wenn du sie unterstützt, so wie andere, die etwas geben können und wollen. Über den Knopf "Unterstützen" geht das in wenigen Klicks.',
    "{STUNDEN} Stunden: So viel hast du inzwischen mit dem Zehnfingersystem geübt - gemessen an der wirklichen Tippzeit, nicht an der Zeit mit geöffnetem Programm. Herzlichen Glückwunsch, das ist eine echte Leistung! Ich hoffe, die App ist dir dabei eine gute Hilfe. Ganz nebenbei: Kostenlos heißt nicht umsonst gemacht, Entwicklung und Server kosten laufend etwas. Diese Seite hat bewusst keinen Sponsor - nur so bleibt sie werbefrei. Wenn du schon erwachsen bist: Das trägt sich, wenn Menschen wie du etwas dazugeben.",
    'Du hast {STUNDEN} Stunden echte Tippzeit erreicht - herzlichen Glückwunsch! Diese Plattform ist privat entwickelt, ohne Sponsor, und bleibt nur werbefrei, wenn Menschen sie unterstützen. Entwicklung und Server kosten laufend etwas. Wenn du schon erwachsen bist: Vielleicht ist "Unterstützen" einen Klick wert.',
    "Herzlichen Glückwunsch: Du übst inzwischen im Schnitt {STUNDEN} Stunden Tastschreiben - wirklich getippt, nicht nur mit geöffnetem Programm gezählt. Ich hoffe, das hilft dir gut weiter. Etwas Offenheit zur Seite dahinter: Ich entwickle diese Plattform privat, ohne Firma und ohne Sponsor dahinter. Das ist eine bewusste Entscheidung gegen Werbung - und sie trägt sich nicht von selbst, Entwicklung und Server kosten laufend etwas. Wenn du schon erwachsen bist, freue ich mich, wenn du das unterstützt.",
  ],
};

/**
 * Punktgenau - dieselben fünf Bauformen, die Tätigkeit heisst hier
 * „Brailleschrift" statt „Tastschreiben" (ALL_PROGRAMS-Label: „Punktgenau -
 * Brailleschrift lernen"; „Übezeit" ist bereits Punktgenaus eigener Begriff,
 * siehe `minutenAus` in `lib/braille/wochenaufgabe.ts`).
 */
const BRAILLE: SpendenBannerTexte = {
  lehrkraft: [
    "Herzlichen Glückwunsch: Ihre Klasse hat im Schnitt bereits {STUNDEN} Stunden Brailleschrift geübt - echte Übezeit, nicht nur geöffnetes Programm. Ich hoffe, die Software hilft Ihnen im Unterricht. Software ist nie kostenlos! Für Entwicklung und Server entstehen laufend Kosten. Diese Seite wird privat weiterentwickelt, ohne Sponsor, und bleibt so lange werbefrei, solange sie Menschen wie Sie mit einem kleinen Beitrag unterstützen.",
    'Herzlichen Glückwunsch! Ihre Klasse hat gerade eine schöne Marke erreicht: im Schnitt {STUNDEN} Stunden Brailleschrift geübt - und zwar wirkliche Übezeit, nicht einfach die Zeit mit offenem Programm. Ich hoffe sehr, die App ist Ihnen im Unterricht eine gute Hilfe. Ein Satz zur Seite dahinter: Keine Software ist kostenlos zu betreiben, Entwicklung und Server kosten laufend etwas. Ich baue diese Plattform privat und ohne Sponsor - unabhängig und ohne Werbung. Das bleibt nur möglich, wenn Menschen sie unterstützen, die etwas geben können und wollen. Über den Knopf "Unterstützen" geht das in wenigen Klicks.',
    "{STUNDEN} Stunden: So viel hat Ihre Klasse im Schnitt inzwischen mit der Brailleschrift geübt - gemessen an der wirklichen Übezeit, nicht an der Zeit mit offenem Programm. Herzlichen Glückwunsch, das ist eine echte Leistung Ihrer Klasse! Ich hoffe, die App ist Ihnen dabei eine gute Hilfe. Ganz nebenbei: Kostenlos heißt nicht umsonst gemacht, Entwicklung und Server kosten laufend etwas. Diese Seite hat bewusst keinen Sponsor - nur so bleibt sie werbefrei. Das trägt sich, wenn Menschen wie Sie etwas dazugeben.",
    "Ihre Klasse hat {STUNDEN} Stunden echte Übezeit erreicht - herzlichen Glückwunsch! Diese Plattform ist privat entwickelt, ohne Sponsor, und bleibt nur werbefrei, wenn Menschen sie unterstützen. Entwicklung und Server kosten laufend etwas.",
    "Herzlichen Glückwunsch: Ihre Klasse übt inzwischen im Schnitt {STUNDEN} Stunden Brailleschrift - wirklich geübt, nicht nur mit offenem Programm gezählt. Ich hoffe, das hilft Ihnen im Unterricht weiter. Etwas Offenheit zur Seite dahinter: Ich entwickle diese Plattform privat, ohne Firma und ohne Sponsor dahinter. Das ist eine bewusste Entscheidung gegen Werbung - und sie trägt sich nicht von selbst, Entwicklung und Server kosten laufend etwas. Möglich ist das nur, wenn Menschen wie Sie es unterstützen.",
  ],
  selbstlernend: [
    "Herzlichen Glückwunsch: Du hast jetzt im Schnitt {STUNDEN} Stunden Brailleschrift geübt - wirkliche Übezeit, nicht nur geöffnetes Programm. Ich hoffe, die App hilft dir gut beim Lernen. Keine Software ist kostenlos zu machen: Entwicklung und Server kosten laufend etwas. Diese Seite entsteht privat, ohne Sponsor, und bleibt so werbefrei. Wenn du schon erwachsen bist, freue ich mich, wenn du sie unterstützt.",
    'Herzlichen Glückwunsch! Du hast gerade eine schöne Marke erreicht: im Schnitt {STUNDEN} Stunden Brailleschrift geübt - und zwar wirkliche Übezeit, nicht einfach die Zeit mit geöffnetem Programm. Ich hoffe sehr, die App ist dir dabei eine gute Hilfe. Ein Satz zur Seite dahinter: Keine Software ist kostenlos zu betreiben, Entwicklung und Server kosten laufend etwas. Ich baue diese Plattform privat und ohne Sponsor - unabhängig und ohne Werbung. Wenn du schon erwachsen bist, freue ich mich, wenn du sie unterstützt, so wie andere, die etwas geben können und wollen. Über den Knopf "Unterstützen" geht das in wenigen Klicks.',
    "{STUNDEN} Stunden: So viel hast du inzwischen mit der Brailleschrift geübt - gemessen an der wirklichen Übezeit, nicht an der Zeit mit geöffnetem Programm. Herzlichen Glückwunsch, das ist eine echte Leistung! Ich hoffe, die App ist dir dabei eine gute Hilfe. Ganz nebenbei: Kostenlos heißt nicht umsonst gemacht, Entwicklung und Server kosten laufend etwas. Diese Seite hat bewusst keinen Sponsor - nur so bleibt sie werbefrei. Wenn du schon erwachsen bist: Das trägt sich, wenn Menschen wie du etwas dazugeben.",
    'Du hast {STUNDEN} Stunden echte Übezeit erreicht - herzlichen Glückwunsch! Diese Plattform ist privat entwickelt, ohne Sponsor, und bleibt nur werbefrei, wenn Menschen sie unterstützen. Entwicklung und Server kosten laufend etwas. Wenn du schon erwachsen bist: Vielleicht ist "Unterstützen" einen Klick wert.',
    "Herzlichen Glückwunsch: Du übst inzwischen im Schnitt {STUNDEN} Stunden Brailleschrift - wirklich geübt, nicht nur mit geöffnetem Programm gezählt. Ich hoffe, das hilft dir gut weiter. Etwas Offenheit zur Seite dahinter: Ich entwickle diese Plattform privat, ohne Firma und ohne Sponsor dahinter. Das ist eine bewusste Entscheidung gegen Werbung - und sie trägt sich nicht von selbst, Entwicklung und Server kosten laufend etwas. Wenn du schon erwachsen bist, freue ich mich, wenn du das unterstützt.",
  ],
};

/**
 * »Im Griff« - dieselben fünf Bauformen, die Tätigkeit heisst hier
 * „Tastenkürzel und Computer-Wege" (etablierter Wortlaut aus
 * `ComputerTrainerPage.tsx`: „deinen Computer mit deinem eigenen Hilfsmittel
 * sicher zu bedienen - Tastenkürzel, Wege und Screenreader-Navigation").
 */
const COMPUTER: SpendenBannerTexte = {
  lehrkraft: [
    "Herzlichen Glückwunsch: Ihre Klasse hat im Schnitt bereits {STUNDEN} Stunden Tastenkürzel und Computer-Wege geübt - echte Übezeit, nicht nur geöffnetes Programm. Ich hoffe, die Software hilft Ihnen im Unterricht. Software ist nie kostenlos! Für Entwicklung und Server entstehen laufend Kosten. Diese Seite wird privat weiterentwickelt, ohne Sponsor, und bleibt so lange werbefrei, solange sie Menschen wie Sie mit einem kleinen Beitrag unterstützen.",
    'Herzlichen Glückwunsch! Ihre Klasse hat gerade eine schöne Marke erreicht: im Schnitt {STUNDEN} Stunden Tastenkürzel und Computer-Wege geübt - und zwar wirkliche Übezeit, nicht einfach die Zeit mit offenem Programm. Ich hoffe sehr, die App ist Ihnen im Unterricht eine gute Hilfe. Ein Satz zur Seite dahinter: Keine Software ist kostenlos zu betreiben, Entwicklung und Server kosten laufend etwas. Ich baue diese Plattform privat und ohne Sponsor - unabhängig und ohne Werbung. Das bleibt nur möglich, wenn Menschen sie unterstützen, die etwas geben können und wollen. Über den Knopf "Unterstützen" geht das in wenigen Klicks.',
    "{STUNDEN} Stunden: So viel hat Ihre Klasse im Schnitt inzwischen mit ihrem Hilfsmittel am Computer geübt - gemessen an der wirklichen Übezeit, nicht an der Zeit mit offenem Programm. Herzlichen Glückwunsch, das ist eine echte Leistung Ihrer Klasse! Ich hoffe, die App ist Ihnen dabei eine gute Hilfe. Ganz nebenbei: Kostenlos heißt nicht umsonst gemacht, Entwicklung und Server kosten laufend etwas. Diese Seite hat bewusst keinen Sponsor - nur so bleibt sie werbefrei. Das trägt sich, wenn Menschen wie Sie etwas dazugeben.",
    "Ihre Klasse hat {STUNDEN} Stunden echte Übezeit erreicht - herzlichen Glückwunsch! Diese Plattform ist privat entwickelt, ohne Sponsor, und bleibt nur werbefrei, wenn Menschen sie unterstützen. Entwicklung und Server kosten laufend etwas.",
    "Herzlichen Glückwunsch: Ihre Klasse übt inzwischen im Schnitt {STUNDEN} Stunden Tastenkürzel und Computer-Wege - wirklich geübt, nicht nur mit offenem Programm gezählt. Ich hoffe, das hilft Ihnen im Unterricht weiter. Etwas Offenheit zur Seite dahinter: Ich entwickle diese Plattform privat, ohne Firma und ohne Sponsor dahinter. Das ist eine bewusste Entscheidung gegen Werbung - und sie trägt sich nicht von selbst, Entwicklung und Server kosten laufend etwas. Möglich ist das nur, wenn Menschen wie Sie es unterstützen.",
  ],
  selbstlernend: [
    "Herzlichen Glückwunsch: Du hast jetzt im Schnitt {STUNDEN} Stunden Tastenkürzel und Computer-Wege geübt - wirkliche Übezeit, nicht nur geöffnetes Programm. Ich hoffe, die App hilft dir gut beim Lernen. Keine Software ist kostenlos zu machen: Entwicklung und Server kosten laufend etwas. Diese Seite entsteht privat, ohne Sponsor, und bleibt so werbefrei. Wenn du schon erwachsen bist, freue ich mich, wenn du sie unterstützt.",
    'Herzlichen Glückwunsch! Du hast gerade eine schöne Marke erreicht: im Schnitt {STUNDEN} Stunden Tastenkürzel und Computer-Wege geübt - und zwar wirkliche Übezeit, nicht einfach die Zeit mit geöffnetem Programm. Ich hoffe sehr, die App ist dir dabei eine gute Hilfe. Ein Satz zur Seite dahinter: Keine Software ist kostenlos zu betreiben, Entwicklung und Server kosten laufend etwas. Ich baue diese Plattform privat und ohne Sponsor - unabhängig und ohne Werbung. Wenn du schon erwachsen bist, freue ich mich, wenn du sie unterstützt, so wie andere, die etwas geben können und wollen. Über den Knopf "Unterstützen" geht das in wenigen Klicks.',
    "{STUNDEN} Stunden: So viel hast du inzwischen mit deinem Hilfsmittel am Computer geübt - gemessen an der wirklichen Übezeit, nicht an der Zeit mit geöffnetem Programm. Herzlichen Glückwunsch, das ist eine echte Leistung! Ich hoffe, die App ist dir dabei eine gute Hilfe. Ganz nebenbei: Kostenlos heißt nicht umsonst gemacht, Entwicklung und Server kosten laufend etwas. Diese Seite hat bewusst keinen Sponsor - nur so bleibt sie werbefrei. Wenn du schon erwachsen bist: Das trägt sich, wenn Menschen wie du etwas dazugeben.",
    'Du hast {STUNDEN} Stunden echte Übezeit erreicht - herzlichen Glückwunsch! Diese Plattform ist privat entwickelt, ohne Sponsor, und bleibt nur werbefrei, wenn Menschen sie unterstützen. Entwicklung und Server kosten laufend etwas. Wenn du schon erwachsen bist: Vielleicht ist "Unterstützen" einen Klick wert.',
    "Herzlichen Glückwunsch: Du übst inzwischen im Schnitt {STUNDEN} Stunden Tastenkürzel und Computer-Wege - wirklich geübt, nicht nur mit geöffnetem Programm gezählt. Ich hoffe, das hilft dir gut weiter. Etwas Offenheit zur Seite dahinter: Ich entwickle diese Plattform privat, ohne Firma und ohne Sponsor dahinter. Das ist eine bewusste Entscheidung gegen Werbung - und sie trägt sich nicht von selbst, Entwicklung und Server kosten laufend etwas. Wenn du schon erwachsen bist, freue ich mich, wenn du das unterstützt.",
  ],
};

/**
 * Je Programm die zehn Texte. Schlüssel = dieselben Kennungen wie in
 * `unterstuetzenFreigegeben()` (`unterstuetzen.ts`) - „tastenflow", „braille",
 * „klangpunkte", „computer".
 *
 * ⚠️ Klangpunkte fehlt hier bewusst (Johannes, 18.09.2026): Klangpunkte misst
 * bisher keine echte Übezeit (nur Sterne/Kapitel-Fortschritt) - ein Banner,
 * der „wirkliche Übezeit" verspricht, bräuchte dort erst eine eigene
 * Instrumentierung. Ohne Eintrag zeigt `SpendenBanner` für dieses Programm
 * nichts an (siehe die Prüfung `SPENDENBANNER_TEXTE[app]` dort).
 */
export const SPENDENBANNER_TEXTE: Partial<Record<string, SpendenBannerTexte>> = {
  tastenflow: TASTENFLOW,
  braille: BRAILLE,
  computer: COMPUTER,
};

/**
 * ★★ EN2 (19.09.2026): die Tastenflow-Texte in der ENGLISCHEN Bedienung.
 *
 * Übertragen, nicht Wort für Wort: Der Gedanke jedes Satzes bleibt (Glückwunsch
 * zur echten Tippzeit · Software kostet · privat, ohne Sponsor, ohne Werbung ·
 * die Bitte an Erwachsene), der Ton wird britisch-schlicht. Drei bewusste
 * Abweichungen:
 *  · Selbstlernende: kein „im Schnitt" - für EINE Person gibt es keinen
 *    Durchschnitt, im Englischen fiele das sofort auf.
 *  · „Über den Knopf … in wenigen Klicks" / „einen Klick wert" ⇒ die Knöpfe
 *    „below" - keine Maus-Wörter (Glossar §1.3), und die Beträge stehen
 *    tatsächlich direkt darunter.
 *  · Nur Tastenflow: Punktgenau und »Im Griff« haben keine englische
 *    Bedienung. Ohne Eintrag gilt die deutsche Fassung.
 */
const TASTENFLOW_EN: SpendenBannerTexte = {
  lehrkraft: [
    "Congratulations: on average, your class has already practised touch typing for {STUNDEN} hours - real typing time, not just time with the app open. I hope the software helps you in class. Software is never free! Development and servers cost money all the time. This site is developed privately, without a sponsor, and it stays free of adverts for as long as people like you support it with a small contribution.",
    "Congratulations! Your class has just reached a lovely milestone: on average {STUNDEN} hours of touch typing practice - and that's real typing time, not just time with the app open. I very much hope the app is a real help to you in class. A word about the site behind it: no software is free to run - development and servers cost money all the time. I build this platform privately and without a sponsor - independent and without adverts. That only stays possible if people who can and want to give something support it. The buttons below make it quick.",
    "{STUNDEN} hours: that's how long your class has now practised touch typing on average - measured in real typing time, not time with the app open. Congratulations, that's a real achievement for your class! I hope the app is a good help to you along the way. Just so you know: free doesn't mean it costs nothing to make - development and servers cost money all the time. This site deliberately has no sponsor - that's the only way it stays free of adverts. It works if people like you chip in.",
    "Your class has reached {STUNDEN} hours of real typing time - congratulations! This platform is developed privately, without a sponsor, and it only stays free of adverts if people support it. Development and servers cost money all the time.",
    "Congratulations: on average, your class has now practised touch typing for {STUNDEN} hours - really typed, not just counted with the app open. I hope this helps you in class. A little openness about the site behind it: I develop this platform privately, with no company and no sponsor behind it. That's a deliberate decision against adverts - and it doesn't pay for itself: development and servers cost money all the time. It's only possible if people like you support it.",
  ],
  selbstlernend: [
    "Congratulations: you've now practised touch typing for {STUNDEN} hours - real typing time, not just time with the app open. I hope the app is helping you learn. No software is free to make: development and servers cost money all the time. This site is made privately, without a sponsor, and that's how it stays free of adverts. If you're an adult, I'd be glad if you supported it.",
    "Congratulations! You've just reached a lovely milestone: {STUNDEN} hours of touch typing practice - and that's real typing time, not just time with the app open. I very much hope the app is a real help to you. A word about the site behind it: no software is free to run - development and servers cost money all the time. I build this platform privately and without a sponsor - independent and without adverts. If you're an adult, I'd be glad if you supported it, like others who can and want to give something. The buttons below make it quick.",
    "{STUNDEN} hours: that's how long you've now practised touch typing - measured in real typing time, not time with the app open. Congratulations, that's a real achievement! I hope the app is a good help to you along the way. Just so you know: free doesn't mean it costs nothing to make - development and servers cost money all the time. This site deliberately has no sponsor - that's the only way it stays free of adverts. If you're an adult: it works if people like you chip in.",
    "You've reached {STUNDEN} hours of real typing time - congratulations! This platform is developed privately, without a sponsor, and it only stays free of adverts if people support it. Development and servers cost money all the time. If you're an adult: maybe the buttons below are worth a moment.",
    "Congratulations: you've now practised touch typing for {STUNDEN} hours - really typed, not just counted with the app open. I hope this helps you along. A little openness about the site behind it: I develop this platform privately, with no company and no sponsor behind it. That's a deliberate decision against adverts - and it doesn't pay for itself: development and servers cost money all the time. If you're an adult, I'd be glad if you supported it.",
  ],
};

/** Die englischen Texte je Programm - bisher nur Tastenflow (siehe oben). */
export const SPENDENBANNER_TEXTE_EN: Partial<Record<string, SpendenBannerTexte>> = {
  tastenflow: TASTENFLOW_EN,
};

/**
 * ★★ E11a-5 (26.09.2026, Johannes F18: „natürlich muss jemand, der
 * Französisch verwendet, auch alles in Französisch bekommen - Anleitung,
 * Spendenaufruf, Impressum …"): die Tastenflow-Texte in der FRANZÖSISCHEN
 * Bedienung.
 *
 * Neu auf Französisch geschrieben, nicht übertragen - derselbe Gedanke je
 * Text (Glückwunsch zur echten Tippzeit · Software kostet · privat, ohne
 * Sponsor, ohne Werbung · die Bitte an Erwachsene), dieselben Abweichungen wie
 * im Englischen: keine Maus-Wörter (die Beträge stehen direkt darunter:
 * « ci-dessous »), und für eine einzelne Person kein Durchschnitt.
 * Lehrkräfte „vous", Selbstlernende „tu" (Bauplan §9.1). Nur Tastenflow -
 * Punktgenau und »Im Griff« haben keine französische Bedienung.
 */
const TASTENFLOW_FR: SpendenBannerTexte = {
  lehrkraft: [
    "Félicitations : votre classe a déjà pratiqué la frappe à dix doigts {STUNDEN} heures en moyenne - du vrai temps de frappe, pas seulement du temps avec l'application ouverte. J'espère que ce logiciel vous aide en classe. Un logiciel n'est jamais gratuit : le développement et les serveurs coutent de l'argent en continu. Ce site est développé à titre privé, sans sponsor, et il reste sans publicité aussi longtemps que des personnes comme vous le soutiennent par une petite contribution.",
    "Félicitations ! Votre classe vient de franchir une belle étape : {STUNDEN} heures de frappe à dix doigts en moyenne - et c'est du vrai temps de frappe, pas le temps passé avec l'application ouverte. J'espère vraiment que l'application vous est utile en classe. Un mot sur ce qu'il y a derrière : aucun logiciel ne fonctionne gratuitement, le développement et les serveurs coutent de l'argent en continu. Je construis cette plateforme à titre privé, sans sponsor - indépendante et sans publicité. Cela ne reste possible que si des personnes qui le peuvent et le veulent la soutiennent. Les boutons ci-dessous rendent cela rapide.",
    "{STUNDEN} heures : c'est le temps que votre classe a passé en moyenne à pratiquer la frappe à dix doigts - mesuré en vrai temps de frappe, pas en temps d'application ouverte. Félicitations, c'est une vraie réussite pour votre classe ! J'espère que l'application vous accompagne bien. Pour votre information : gratuit ne veut pas dire que cela ne coute rien à faire, le développement et les serveurs coutent de l'argent en continu. Ce site n'a volontairement aucun sponsor - c'est la seule façon de rester sans publicité. Cela tient si des personnes comme vous y contribuent.",
    "Votre classe a atteint {STUNDEN} heures de vrai temps de frappe - félicitations ! Cette plateforme est développée à titre privé, sans sponsor, et ne reste sans publicité que si des personnes la soutiennent. Le développement et les serveurs coutent de l'argent en continu.",
    "Félicitations : votre classe a maintenant pratiqué la frappe à dix doigts {STUNDEN} heures en moyenne - vraiment tapées, pas seulement comptées avec l'application ouverte. J'espère que cela vous aide en classe. En toute franchise, sur ce qu'il y a derrière : je développe cette plateforme à titre privé, sans entreprise et sans sponsor. C'est un choix délibéré contre la publicité - et il ne se finance pas tout seul, le développement et les serveurs coutent de l'argent en continu. Ce n'est possible que si des personnes comme vous le soutiennent.",
  ],
  selbstlernend: [
    "Félicitations : tu as maintenant pratiqué la frappe à dix doigts pendant {STUNDEN} heures - du vrai temps de frappe, pas seulement du temps avec l'application ouverte. J'espère que l'application t'aide bien à apprendre. Aucun logiciel n'est gratuit à faire : le développement et les serveurs coutent de l'argent en continu. Ce site est fait à titre privé, sans sponsor, et c'est ainsi qu'il reste sans publicité. Si tu es adulte, je serais heureux que tu le soutiennes.",
    "Félicitations ! Tu viens de franchir une belle étape : {STUNDEN} heures de frappe à dix doigts - et c'est du vrai temps de frappe, pas le temps passé avec l'application ouverte. J'espère vraiment que l'application t'est utile. Un mot sur ce qu'il y a derrière : aucun logiciel ne fonctionne gratuitement, le développement et les serveurs coutent de l'argent en continu. Je construis cette plateforme à titre privé, sans sponsor - indépendante et sans publicité. Si tu es adulte, je serais heureux que tu la soutiennes, comme d'autres qui le peuvent et le veulent. Les boutons ci-dessous rendent cela rapide.",
    "{STUNDEN} heures : c'est le temps que tu as passé à pratiquer la frappe à dix doigts - mesuré en vrai temps de frappe, pas en temps d'application ouverte. Félicitations, c'est une vraie réussite ! J'espère que l'application t'accompagne bien. Pour ton information : gratuit ne veut pas dire que cela ne coute rien à faire, le développement et les serveurs coutent de l'argent en continu. Ce site n'a volontairement aucun sponsor - c'est la seule façon de rester sans publicité. Si tu es adulte : cela tient si des personnes comme toi y contribuent.",
    "Tu as atteint {STUNDEN} heures de vrai temps de frappe - félicitations ! Cette plateforme est développée à titre privé, sans sponsor, et ne reste sans publicité que si des personnes la soutiennent. Le développement et les serveurs coutent de l'argent en continu. Si tu es adulte, les boutons ci-dessous méritent peut-être un instant d'attention.",
    "Félicitations : tu as maintenant pratiqué la frappe à dix doigts pendant {STUNDEN} heures - vraiment tapées, pas seulement comptées avec l'application ouverte. J'espère que cela t'aide à avancer. En toute franchise, sur ce qu'il y a derrière : je développe cette plateforme à titre privé, sans entreprise et sans sponsor. C'est un choix délibéré contre la publicité - et il ne se finance pas tout seul, le développement et les serveurs coutent de l'argent en continu. Si tu es adulte, je serais heureux que tu le soutiennes.",
  ],
};

/** Die französischen Texte je Programm - nur Tastenflow (siehe oben). */
export const SPENDENBANNER_TEXTE_FR: Partial<Record<string, SpendenBannerTexte>> = {
  tastenflow: TASTENFLOW_FR,
};

/**
 * ★★ ES-O (27.09.2026, Bauplan D6): die Tastenflow-Texte in der SPANISCHEN
 * Bedienung - wie bei „fr" neu geschrieben, nicht übertragen, derselbe
 * Gedanke je Text. Docentes „usted", Selbstlernende „tú" (Bauplan S9); kein
 * Maus-Wort (die Beträge stehen „aquí debajo"), für eine einzelne Person kein
 * Durchschnitt. Nur Tastenflow.
 */
const TASTENFLOW_ES: SpendenBannerTexte = {
  lehrkraft: [
    "Enhorabuena: su clase ya ha practicado mecanografía {STUNDEN} horas de media - tiempo real de escritura, no solo tiempo con el programa abierto. Espero que este programa le ayude en clase. Hacer un programa nunca sale gratis: el desarrollo y los servidores cuestan dinero de forma continua. Esta plataforma se desarrolla de forma privada, sin patrocinio, y sigue sin publicidad mientras haya personas como usted que la apoyen con una pequeña aportación.",
    "¡Enhorabuena! Su clase acaba de alcanzar una bonita meta: {STUNDEN} horas de mecanografía de media - y es tiempo real de escritura, no el tiempo con el programa abierto. Espero de verdad que la aplicación le sea útil en clase. Una palabra sobre lo que hay detrás: ningún programa funciona gratis, el desarrollo y los servidores cuestan dinero de forma continua. Construyo esta plataforma de forma privada, sin patrocinio - independiente y sin publicidad. Eso solo es posible si la apoyan personas que pueden y quieren hacerlo. Con los botones de aquí debajo es cuestión de un momento.",
    "{STUNDEN} horas: ese es el tiempo que su clase ha practicado de media la mecanografía con diez dedos - medido en tiempo real de escritura, no en tiempo con el programa abierto. Enhorabuena, es un verdadero logro de su clase. Espero que la aplicación le sea útil por mucho tiempo. Para su información: gratuito no significa que no cueste nada hacerlo, el desarrollo y los servidores cuestan dinero de forma continua. Esta plataforma no tiene patrocinio a propósito - es la única manera de seguir sin publicidad. Funciona si personas como usted contribuyen.",
    "Su clase ha alcanzado {STUNDEN} horas de tiempo real de escritura - ¡enhorabuena! Esta plataforma se desarrolla de forma privada, sin patrocinio, y solo sigue sin publicidad si hay personas que la apoyan. El desarrollo y los servidores cuestan dinero de forma continua.",
    "Enhorabuena: su clase ya practica mecanografía {STUNDEN} horas de media - escritas de verdad, no solo contadas con el programa abierto. Espero que le ayude en clase. Hablando con franqueza de lo que hay detrás: desarrollo esta plataforma de forma privada, sin empresa y sin patrocinio. Es una decisión consciente contra la publicidad - y no se financia sola, el desarrollo y los servidores cuestan dinero de forma continua. Solo es posible si personas como usted la apoyan.",
  ],
  selbstlernend: [
    "Enhorabuena: ya has practicado mecanografía durante {STUNDEN} horas - tiempo real de escritura, no solo tiempo con el programa abierto. Espero que la aplicación te ayude a aprender. Hacer un programa nunca sale gratis: el desarrollo y los servidores cuestan dinero de forma continua. Esta plataforma se hace de forma privada, sin patrocinio, y así sigue sin publicidad. Si eres una persona adulta, me alegraría que la apoyaras.",
    "¡Enhorabuena! Acabas de alcanzar una bonita meta: {STUNDEN} horas de mecanografía - y es tiempo real de escritura, no el tiempo con el programa abierto. Espero de verdad que la aplicación te sea útil. Una palabra sobre lo que hay detrás: ningún programa funciona gratis, el desarrollo y los servidores cuestan dinero de forma continua. Construyo esta plataforma de forma privada, sin patrocinio - independiente y sin publicidad. Si eres una persona adulta, me alegraría que la apoyaras, como otras personas que pueden y quieren hacerlo. Con los botones de aquí debajo es cuestión de un momento.",
    "{STUNDEN} horas: ese es el tiempo que has practicado la mecanografía con diez dedos - medido en tiempo real de escritura, no en tiempo con el programa abierto. Enhorabuena, es un verdadero logro. Espero que la aplicación te sea útil por mucho tiempo. Para tu información: gratuito no significa que no cueste nada hacerlo, el desarrollo y los servidores cuestan dinero de forma continua. Esta plataforma no tiene patrocinio a propósito - es la única manera de seguir sin publicidad. Si eres una persona adulta: funciona si personas como tú contribuyen.",
    "Has alcanzado {STUNDEN} horas de tiempo real de escritura - ¡enhorabuena! Esta plataforma se desarrolla de forma privada, sin patrocinio, y solo sigue sin publicidad si hay personas que la apoyan. El desarrollo y los servidores cuestan dinero de forma continua. Si eres una persona adulta, quizá los botones de aquí debajo merezcan un momento de atención.",
    "Enhorabuena: ya has practicado mecanografía durante {STUNDEN} horas - escritas de verdad, no solo contadas con el programa abierto. Espero que te ayude a avanzar. Hablando con franqueza de lo que hay detrás: desarrollo esta plataforma de forma privada, sin empresa y sin patrocinio. Es una decisión consciente contra la publicidad - y no se financia sola, el desarrollo y los servidores cuestan dinero de forma continua. Si eres una persona adulta, me alegraría que la apoyaras.",
  ],
};

/** ★ ES-O: die spanischen Texte je Programm - nur Tastenflow. */
export const SPENDENBANNER_TEXTE_ES: Partial<Record<string, SpendenBannerTexte>> = {
  tastenflow: TASTENFLOW_ES,
};

/**
 * ★★ O-IT (02.10.2026, Bauplan D6, I11): die Tastenflow-Texte in der
 * ITALIENISCHEN Bedienung - neu geschrieben, derselbe Gedanke je Text.
 * Lehrkräfte ohne „Lei": neutrale Sätze über „la classe" (Glossar Regel 1),
 * ohne Ausrufezeichen; Selbstlernende „tu", höchstens ein Ausrufezeichen,
 * ohne Partizip mit Geschlechtsendung („hai fatto", nie „ti sei esercitato").
 * Kein Maus-Wort (die Beträge stehen „qui sotto"). Nur Tastenflow.
 */
const TASTENFLOW_IT: SpendenBannerTexte = {
  lehrkraft: [
    "Complimenti: in media la classe ha già fatto {STUNDEN} ore di dattilografia a dieci dita - tempo reale di scrittura, non solo tempo con il programma aperto. Spero che il programma sia utile in classe. Un software non è mai gratuito: lo sviluppo e i server hanno costi continui. Questa piattaforma è sviluppata privatamente, senza sponsor, e resta senza pubblicità finché ci sono persone disposte a sostenerla con un piccolo contributo.",
    "Complimenti: la classe ha appena raggiunto un bel traguardo, in media {STUNDEN} ore di dattilografia a dieci dita - tempo reale di scrittura, non il tempo con il programma aperto. Spero davvero che l'app sia un buon aiuto in classe. Due parole su ciò che c'è dietro: nessun software funziona gratis, lo sviluppo e i server hanno costi continui. Costruisco questa piattaforma privatamente e senza sponsor - in modo indipendente e senza pubblicità. È possibile solo se la sostiene chi può e vuole farlo. Con i pulsanti qui sotto basta un momento.",
    "{STUNDEN} ore: è il tempo che in media la classe ha dedicato alla dattilografia a dieci dita - misurato come tempo reale di scrittura, non come tempo con il programma aperto. Complimenti, è un vero risultato della classe. Spero che l'app resti utile a lungo. Per completezza: gratuito non vuol dire che realizzarlo non costi nulla, lo sviluppo e i server hanno costi continui. Questa piattaforma non ha sponsor di proposito - è l'unico modo per restare senza pubblicità. Funziona se chi la usa contribuisce.",
    "La classe ha raggiunto {STUNDEN} ore di tempo reale di scrittura - complimenti. Questa piattaforma è sviluppata privatamente, senza sponsor, e resta senza pubblicità solo se ci sono persone che la sostengono. Lo sviluppo e i server hanno costi continui.",
    "Complimenti: in media la classe ha già scritto per {STUNDEN} ore con la dattilografia a dieci dita - ore scritte davvero, non solo contate con il programma aperto. Spero che sia d'aiuto in classe. Detto con franchezza: sviluppo questa piattaforma privatamente, senza azienda e senza sponsor. È una scelta consapevole contro la pubblicità - e non si finanzia da sola, lo sviluppo e i server hanno costi continui. È possibile solo grazie a chi la sostiene.",
  ],
  selbstlernend: [
    "Complimenti: hai già fatto {STUNDEN} ore di dattilografia a dieci dita - tempo reale di scrittura, non solo tempo con il programma aperto. Spero che l'app ti aiuti a imparare. Un software non è mai gratuito: lo sviluppo e i server hanno costi continui. Questa piattaforma è fatta privatamente, senza sponsor, e così resta senza pubblicità. Se sei una persona adulta, mi farebbe piacere se la sostenessi.",
    "Complimenti! Hai appena raggiunto un bel traguardo: {STUNDEN} ore di dattilografia a dieci dita - tempo reale di scrittura, non il tempo con il programma aperto. Spero davvero che l'app ti sia utile. Due parole su ciò che c'è dietro: nessun software funziona gratis, lo sviluppo e i server hanno costi continui. Costruisco questa piattaforma privatamente, senza sponsor - in modo indipendente e senza pubblicità. Se sei una persona adulta, mi farebbe piacere se la sostenessi, come altre persone che possono e vogliono farlo. Con i pulsanti qui sotto basta un momento.",
    "{STUNDEN} ore: è il tempo che hai dedicato alla dattilografia a dieci dita - misurato come tempo reale di scrittura, non come tempo con il programma aperto. Complimenti, è un vero risultato. Spero che l'app ti resti utile a lungo. Per completezza: gratuito non vuol dire che realizzarlo non costi nulla, lo sviluppo e i server hanno costi continui. Questa piattaforma non ha sponsor di proposito - è l'unico modo per restare senza pubblicità. Se sei una persona adulta: funziona se persone come te contribuiscono.",
    "Hai raggiunto {STUNDEN} ore di tempo reale di scrittura - complimenti! Questa piattaforma è sviluppata privatamente, senza sponsor, e resta senza pubblicità solo se ci sono persone che la sostengono. Lo sviluppo e i server hanno costi continui. Se sei una persona adulta, forse i pulsanti qui sotto meritano un momento di attenzione.",
    "Complimenti: hai già scritto per {STUNDEN} ore con la dattilografia a dieci dita - ore scritte davvero, non solo contate con il programma aperto. Spero che ti aiuti ad andare avanti. Detto con franchezza: sviluppo questa piattaforma privatamente, senza azienda e senza sponsor. È una scelta consapevole contro la pubblicità - e non si finanzia da sola, lo sviluppo e i server hanno costi continui. Se sei una persona adulta, mi farebbe piacere se la sostenessi.",
  ],
};

/** ★ O-IT: die italienischen Texte je Programm - nur Tastenflow. */
export const SPENDENBANNER_TEXTE_IT: Partial<Record<string, SpendenBannerTexte>> = {
  tastenflow: TASTENFLOW_IT,
};

/**
 * ★★ O-PL (02.10.2026, Bauplan D6): die Tastenflow-Texte in der POLNISCHEN
 * Bedienung - neu geschrieben, derselbe Gedanke je Text. Lehrkräfte ohne
 * „Pan/Pani" und ohne Besitzwort: Sätze über „klasa" (Glossar Regel 1/2), ohne
 * Ausrufezeichen; Selbstlernende „ty", höchstens ein Ausrufezeichen, nie eine
 * Vergangenheitsform der 2. Person (die verriete das Geschlecht).
 *
 * ⚠️ Statt `{STUNDEN}` steht hier `{GODZINY}`: Im Polnischen beugt sich das
 * Hauptwort nach der Zahl (1 godzina · 2 godziny · 5 godzin, Glossar §2.10a),
 * und die Zahl ist die ECHTE, gerundete Stundenzahl („23 godziny"). Darum setzt
 * {@link spendenBannerTextFuellen} Zahl UND Wort ein; die Sätze stellen beides
 * nur dorthin, wo es im Nominativ steht oder ein Genitiv folgt („{GODZINY}
 * prawdziwego pisania") - nie vor ein Verb oder Adjektiv, das mitbeugen müsste.
 * Kein Maus-Wort (die Beträge stehen „poniżej"). Nur Tastenflow.
 */
const TASTENFLOW_PL: SpendenBannerTexte = {
  lehrkraft: [
    "Gratulacje: średnio {GODZINY} pisania dziesięcioma palcami - tyle ma już za sobą klasa. Liczy się prawdziwy czas pisania, a nie czas z otwartym programem. Mam nadzieję, że program dobrze służy na zajęciach. Żaden program nie powstaje za darmo: rozwój i serwery stale kosztują. Ta platforma jest rozwijana prywatnie, bez sponsora, i pozostaje bez reklam tak długo, jak długo ludzie ją wspierają, choćby niewielką kwotą.",
    "Gratulacje. Klasa ma właśnie powód do świętowania: średnio {GODZINY} prawdziwego pisania dziesięcioma palcami, a nie czasu z otwartym programem. Bardzo liczę na to, że aplikacja jest dobrą pomocą na zajęciach. Kilka słów o tym, co stoi za tą stroną: żaden program nie działa za darmo, rozwój i serwery stale kosztują. Buduję tę platformę prywatnie i bez sponsora - niezależnie i bez reklam. To możliwe tylko dzięki osobom, które mogą i chcą coś dać. Przyciskami poniżej zajmie to tylko chwilę.",
    "{GODZINY} pisania dziesięcioma palcami - tyle średnio ma już za sobą klasa, licząc prawdziwy czas pisania, a nie czas z otwartym programem. Gratulacje, to prawdziwe osiągnięcie całej klasy. Mam nadzieję, że aplikacja jeszcze długo będzie pomagać. Przy okazji: bezpłatne nie znaczy, że nic nie kosztuje - rozwój i serwery stale kosztują. Ta platforma celowo nie ma sponsora - tylko dzięki temu pozostaje bez reklam. Utrzyma się, jeśli osoby, które z niej korzystają, coś do niej dołożą.",
    "Prawdziwy czas pisania w klasie: {GODZINY} - gratulacje. Ta platforma jest rozwijana prywatnie, bez sponsora, i pozostaje bez reklam tylko wtedy, gdy ludzie ją wspierają. Rozwój i serwery stale kosztują.",
    "Gratulacje: średni czas pisania dziesięcioma palcami w klasie to już {GODZINY} - liczy się tylko prawdziwe pisanie, a nie czas z otwartym programem. Mam nadzieję, że to pomaga na zajęciach. Szczerze o tym, co za tym stoi: rozwijam tę platformę prywatnie, bez firmy i bez sponsora. To świadoma decyzja przeciw reklamom - a ona sama się nie utrzyma, bo rozwój i serwery stale kosztują. Jest to możliwe tylko dzięki osobom, które ją wspierają.",
  ],
  selbstlernend: [
    "Gratulacje: twój czas pisania dziesięcioma palcami to już {GODZINY}. Liczy się tylko prawdziwe pisanie, a nie czas z otwartym programem. Mam nadzieję, że aplikacja dobrze pomaga ci w nauce. Żaden program nie powstaje za darmo: rozwój i serwery stale kosztują. Ta strona powstaje prywatnie, bez sponsora, i dlatego jest bez reklam. Jeśli jesteś osobą dorosłą, będzie mi miło, jeśli ją wesprzesz.",
    "Gratulacje! Masz właśnie powód do świętowania: na liczniku {GODZINY} prawdziwego pisania dziesięcioma palcami, a nie czasu z otwartym programem. Bardzo liczę na to, że aplikacja dobrze ci pomaga. Kilka słów o tym, co stoi za tą stroną: żaden program nie działa za darmo, rozwój i serwery stale kosztują. Buduję tę platformę prywatnie i bez sponsora - niezależnie i bez reklam. Jeśli jesteś osobą dorosłą, będzie mi miło, jeśli ją wesprzesz, tak jak inne osoby, które mogą i chcą coś dać. Przyciskami poniżej zajmie to tylko chwilę.",
    "{GODZINY} pisania dziesięcioma palcami - tyle masz już za sobą, licząc prawdziwy czas pisania, a nie czas z otwartym programem. Gratulacje, to prawdziwe osiągnięcie! Mam nadzieję, że aplikacja jeszcze długo będzie ci pomagać. Przy okazji: bezpłatne nie znaczy, że nic nie kosztuje - rozwój i serwery stale kosztują. Ta platforma celowo nie ma sponsora - tylko dzięki temu pozostaje bez reklam. Jeśli jesteś osobą dorosłą: utrzyma się, jeśli osoby takie jak ty coś do niej dołożą.",
    "Na liczniku: {GODZINY} prawdziwego pisania - gratulacje! Ta platforma jest rozwijana prywatnie, bez sponsora, i pozostaje bez reklam tylko wtedy, gdy ludzie ją wspierają. Rozwój i serwery stale kosztują. Jeśli jesteś osobą dorosłą, może przyciski poniżej są warte chwili uwagi.",
    "Gratulacje: twój czas pisania dziesięcioma palcami to już {GODZINY} - liczy się tylko prawdziwe pisanie, a nie czas z otwartym programem. Mam nadzieję, że to pomaga ci iść dalej. Szczerze o tym, co za tym stoi: rozwijam tę platformę prywatnie, bez firmy i bez sponsora. To świadoma decyzja przeciw reklamom - a ona sama się nie utrzyma, bo rozwój i serwery stale kosztują. Jeśli jesteś osobą dorosłą, będzie mi miło, jeśli ją wesprzesz.",
  ],
};

/** ★ O-PL: die polnischen Texte je Programm - nur Tastenflow. */
export const SPENDENBANNER_TEXTE_PL: Partial<Record<string, SpendenBannerTexte>> = {
  tastenflow: TASTENFLOW_PL,
};

/**
 * ★★ O-TR (02.10.2026, Bauplan D6): die Tastenflow-Texte in der TÜRKISCHEN
 * Bedienung - neu geschrieben, derselbe Gedanke je Text. Lehrkräfte "siz" mit
 * -(y)In, ohne Ausrufezeichen; Selbstlernende "sen", höchstens ein
 * Ausrufezeichen, ohne Durchschnitt (eine Person). Kein Maus-Wort (die Beträge
 * stehen "aşağıda").
 *
 * `{STUNDEN}` bleibt der Platzhalter: Nach einer Zahl steht im Türkischen die
 * Einzahl ("23 saat", Glossar Regel 5), das Wort beugt sich nicht - und KEINE
 * Endung hängt an der Zahl (Regel 6): sie gehört an "saat" ("{STUNDEN} saatlik").
 * Nur Tastenflow.
 */
const TASTENFLOW_TR: SpendenBannerTexte = {
  lehrkraft: [
    "Tebrikler: Sınıfınız ortalama {STUNDEN} saat on parmak klavye alıştırması yaptı - gerçek yazma süresi, yalnızca açık kalan program değil. Umarım program sınıfta işinize yarıyor. Hiçbir yazılım bedava değildir: Geliştirme ve sunucular sürekli masraf çıkarır. Bu site kişisel olarak, sponsor olmadan geliştiriliyor ve sizin gibi insanlar küçük bir katkıyla destek oldukça reklamsız kalacak.",
    "Tebrikler. Sınıfınız güzel bir eşiğe ulaştı: ortalama {STUNDEN} saat on parmak klavye alıştırması - üstelik gerçek yazma süresi, programın açık kaldığı süre değil. Uygulamanın sınıfta size iyi bir yardımcı olmasını içtenlikle umuyorum. Arka plan hakkında kısa bir not: Hiçbir yazılım bedava çalışmaz, geliştirme ve sunucular sürekli masraf çıkarır. Bu platformu kişisel olarak ve sponsor olmadan kuruyorum - bağımsız ve reklamsız. Bu ancak verebilecek ve vermek isteyen insanlar destek olursa mümkün kalır. Aşağıdaki düğmelerle bu birkaç saniye sürer.",
    "{STUNDEN} saat: Sınıfınızın ortalama on parmak klavye alıştırma süresi bu kadar oldu - programın açık kaldığı süreyle değil, gerçek yazma süresiyle ölçüldü. Tebrikler, bu sınıfınızın gerçek bir başarısı. Umarım uygulama bu yolda size iyi bir yardımcıdır. Bu arada: Ücretsiz olması, emek harcanmadan yapıldığı anlamına gelmez; geliştirme ve sunucular sürekli masraf çıkarır. Bu sitenin bilerek sponsoru yok - reklamsız kalmasının tek yolu bu. Sizin gibi insanlar katkıda bulundukça ayakta kalıyor.",
    "Sınıfınız {STUNDEN} saatlik gerçek yazma süresine ulaştı - tebrikler. Bu platform kişisel olarak, sponsor olmadan geliştiriliyor ve ancak insanlar destek olursa reklamsız kalabiliyor. Geliştirme ve sunucular sürekli masraf çıkarır.",
    "Tebrikler: Sınıfınız şimdiye kadar ortalama {STUNDEN} saat on parmak klavye çalıştı - gerçekten yazarak, programın açık kaldığı süre sayılmadan. Umarım bu, sınıfta işinize yarar. Arka plan hakkında açık konuşayım: Bu platformu kişisel olarak, arkasında bir şirket ve sponsor olmadan geliştiriyorum. Bu, reklama karşı bilinçli bir karar - ve kendi kendini finanse etmiyor; geliştirme ve sunucular sürekli masraf çıkarır. Bu ancak sizin gibi insanlar destek olursa mümkün.",
  ],
  selbstlernend: [
    "Tebrikler: {STUNDEN} saat on parmak klavye alıştırması yaptın - gerçek yazma süresi, yalnızca açık kalan program değil. Umarım uygulama öğrenmene iyi yardımcı oluyor. Hiçbir yazılım bedava yapılmaz: Geliştirme ve sunucular sürekli masraf çıkarır. Bu site kişisel olarak, sponsor olmadan hazırlanıyor ve böylece reklamsız kalıyor. Yetişkinsen ve destek olursan çok sevinirim.",
    "Tebrikler! Güzel bir eşiğe ulaştın: {STUNDEN} saat on parmak klavye alıştırması - üstelik gerçek yazma süresi, programın açık kaldığı süre değil. Uygulamanın sana iyi bir yardımcı olmasını içtenlikle umuyorum. Arka plan hakkında kısa bir not: Hiçbir yazılım bedava çalışmaz, geliştirme ve sunucular sürekli masraf çıkarır. Bu platformu kişisel olarak ve sponsor olmadan kuruyorum - bağımsız ve reklamsız. Yetişkinsen, verebilen ve vermek isteyen başkaları gibi destek olursan çok sevinirim. Aşağıdaki düğmelerle bu birkaç saniye sürer.",
    "{STUNDEN} saat: On parmak klavye alıştırma süren bu kadar oldu - programın açık kaldığı süreyle değil, gerçek yazma süresiyle ölçüldü. Tebrikler, bu gerçek bir başarı! Umarım uygulama bu yolda sana iyi bir yardımcıdır. Bu arada: Ücretsiz olması, emek harcanmadan yapıldığı anlamına gelmez; geliştirme ve sunucular sürekli masraf çıkarır. Bu sitenin bilerek sponsoru yok - reklamsız kalmasının tek yolu bu. Yetişkinsen: Senin gibi insanlar katkıda bulundukça ayakta kalıyor.",
    "{STUNDEN} saatlik gerçek yazma süresine ulaştın - tebrikler! Bu platform kişisel olarak, sponsor olmadan geliştiriliyor ve ancak insanlar destek olursa reklamsız kalabiliyor. Geliştirme ve sunucular sürekli masraf çıkarır. Yetişkinsen, aşağıdaki düğmeler belki bir dakikana değer.",
    "Tebrikler: Şimdiye kadar {STUNDEN} saat on parmak klavye çalıştın - gerçekten yazarak, programın açık kaldığı süre sayılmadan. Umarım bu, ilerlemene yardımcı olur. Arka plan hakkında açık konuşayım: Bu platformu kişisel olarak, arkasında bir şirket ve sponsor olmadan geliştiriyorum. Bu, reklama karşı bilinçli bir karar - ve kendi kendini finanse etmiyor; geliştirme ve sunucular sürekli masraf çıkarır. Yetişkinsen ve destek olursan çok sevinirim.",
  ],
};

/** ★ O-TR: die türkischen Texte je Programm - nur Tastenflow. */
export const SPENDENBANNER_TEXTE_TR: Partial<Record<string, SpendenBannerTexte>> = {
  tastenflow: TASTENFLOW_TR,
};

/**
 * ★★ O-CS (03.10.2026, Bauplan D6): die Tastenflow-Texte in der TSCHECHISCHEN
 * Bedienung - neu geschrieben, derselbe Gedanke je Text. Lehrkräfte "vy" in der
 * Mehrzahlform, ohne Ausrufezeichen; Selbstlernende "ty", höchstens ein
 * Ausrufezeichen, nie eine Vergangenheitsform der 2. Person (die verriete das
 * Geschlecht, Glossar Regel 2). Die Erwachsenen-Klausel ohne "dospělý/dospělá":
 * "Pokud je ti 18 let nebo víc". Kein Maus-Wort (die Beträge stehen "níže").
 *
 * Statt `{STUNDEN}` steht hier `{HODINY}`: Zahl UND gebeugtes Wort (1 hodina ·
 * 2 hodiny · 5 hodin · 1,5 hodiny, Glossar §2.11), eingesetzt von
 * {@link spendenBannerTextFuellen}. Die Sätze stellen beides nur dorthin, wo es
 * im Nominativ steht (nach Doppelpunkt, als Prädikat nach "je") oder ein Genitiv
 * folgt ("{HODINY} psaní všemi deseti") - nie als Subjekt eines Verbs, das mit
 * der Zahl mitbeugen müsste ("je/jsou"). Nur Tastenflow.
 */
const TASTENFLOW_CS: SpendenBannerTexte = {
  lehrkraft: [
    "Gratuluji. Průměrný čas psaní všemi deseti ve vaší třídě je už {HODINY} - skutečného psaní, ne jen otevřeného programu. Doufám, že vám program ve výuce dobře slouží. Žádný software nevzniká zadarmo: vývoj a servery průběžně něco stojí. Tento web vyvíjím soukromě, bez sponzora, a bez reklam zůstane tak dlouho, dokud ho budou lidé podporovat, třeba i malou částkou.",
    "Gratuluji. Vaše třída má důvod k radosti - v průměru {HODINY} skutečného psaní všemi deseti, ne času s otevřeným programem. Moc doufám, že je vám aplikace ve výuce dobrým pomocníkem. Pár slov o tom, co za tímto webem stojí: žádný software neběží zadarmo, vývoj a servery průběžně něco stojí. Tuto platformu stavím soukromě a bez sponzora - nezávisle a bez reklam. To je možné jen díky lidem, kteří mohou a chtějí něco dát. Tlačítky níže to zabere jen chvilku.",
    "{HODINY} psaní všemi deseti - tolik má vaše třída v průměru za sebou, počítáno ze skutečného času psaní, ne z času s otevřeným programem. Gratuluji, to je skutečný úspěch celé třídy. Doufám, že vám aplikace bude i dál dobře pomáhat. Mimochodem: zdarma neznamená, že to nic nestojí - vývoj a servery průběžně něco stojí. Tato platforma záměrně nemá sponzora - jen tak zůstane bez reklam. Udrží se, pokud k ní lidé, kteří ji používají, něco přidají.",
    "Skutečný čas psaní ve vaší třídě: {HODINY} - gratuluji. Tato platforma vzniká soukromě, bez sponzora, a bez reklam zůstane jen tehdy, když ji lidé podpoří. Vývoj a servery průběžně něco stojí.",
    "Gratuluji: průměrný čas psaní všemi deseti ve vaší třídě je už {HODINY} - počítá se jen skutečné psaní, ne čas s otevřeným programem. Doufám, že vám to ve výuce pomáhá. Upřímně o tom, co za tím stojí: tuto platformu vyvíjím soukromě, bez firmy a bez sponzora. Je to vědomé rozhodnutí proti reklamě - a samo se neuživí, protože vývoj a servery průběžně něco stojí. Možné je to jen díky lidem, kteří ji podporují.",
  ],
  selbstlernend: [
    "Gratuluji: tvůj čas psaní všemi deseti je už {HODINY} - počítá se jen skutečné psaní, ne čas s otevřeným programem. Doufám, že ti aplikace při učení dobře pomáhá. Žádný software nevzniká zadarmo: vývoj a servery průběžně něco stojí. Tento web vzniká soukromě, bez sponzora, a proto je bez reklam. Pokud je ti 18 let nebo víc, potěší mě, když ho podpoříš.",
    "Gratuluji! Máš důvod k radosti - na počítadle: {HODINY} skutečného psaní všemi deseti, ne času s otevřeným programem. Moc doufám, že ti aplikace dobře pomáhá. Pár slov o tom, co za tímto webem stojí: žádný software neběží zadarmo, vývoj a servery průběžně něco stojí. Tuto platformu stavím soukromě a bez sponzora - nezávisle a bez reklam. Pokud je ti 18 let nebo víc, potěší mě, když ji podpoříš, stejně jako další lidé, kteří mohou a chtějí něco dát. Tlačítky níže to zabere jen chvilku.",
    "{HODINY} psaní všemi deseti - tolik už máš za sebou, počítáno ze skutečného času psaní, ne z času s otevřeným programem. Gratuluji, to je skutečný úspěch. Doufám, že ti aplikace bude i dál dobře pomáhat. Mimochodem: zdarma neznamená, že to nic nestojí - vývoj a servery průběžně něco stojí. Tato platforma záměrně nemá sponzora - jen tak zůstane bez reklam. Pokud je ti 18 let nebo víc: udrží se, když k ní lidé jako ty něco přidají.",
    "Na počítadle: {HODINY} skutečného psaní - gratuluji! Tato platforma vzniká soukromě, bez sponzora, a bez reklam zůstane jen tehdy, když ji lidé podpoří. Vývoj a servery průběžně něco stojí. Pokud je ti 18 let nebo víc, možná ti tlačítka níže stojí za chvilku pozornosti.",
    "Gratuluji: tvůj čas psaní všemi deseti je už {HODINY} - počítá se jen skutečné psaní, ne čas s otevřeným programem. Doufám, že ti to pomáhá jít dál. Upřímně o tom, co za tím stojí: tuto platformu vyvíjím soukromě, bez firmy a bez sponzora. Je to vědomé rozhodnutí proti reklamě - a samo se neuživí, protože vývoj a servery průběžně něco stojí. Pokud je ti 18 let nebo víc, potěší mě, když ji podpoříš.",
  ],
};

/** ★ O-CS: die tschechischen Texte je Programm - nur Tastenflow. */
export const SPENDENBANNER_TEXTE_CS: Partial<Record<string, SpendenBannerTexte>> = {
  tastenflow: TASTENFLOW_CS,
};

/**
 * ★ O2-SONST (30.10.2026): die Tastenflow-Texte der neun. Statt `{STUNDEN}` steht `{STUNDEN_<XX>}` - Zahl UND gebeugtes Wort
 * (wie `{HODINY}`), eingesetzt von {@link spendenBannerTextFuellen}. Nicht von Personen mit der Sprache als Erstsprache gelesen.
 */
const TASTENFLOW_BG: SpendenBannerTexte = {
  lehrkraft: [
    "Поздравления: класът ви вече има средно {STUNDEN_BG} писане с десет пръста - истинско време за писане, а не просто отворена програма. Надявам се програмата да ви помага в часовете. Софтуерът никога не е безплатен: разработката и сървърите постоянно струват пари. Този сайт се разработва частно, без спонсор, и остава без реклами, докато хора като вас го подкрепят с малка сума.",
    "Поздравления. Класът ви току-що достигна хубав етап: средно {STUNDEN_BG} писане с десет пръста - и то истинско време за писане, а не просто време с отворена програма. Много се надявам приложението да ви е добър помощник в часовете. Няколко думи за сайта зад него: никой софтуер не работи безплатно, разработката и сървърите постоянно струват пари. Изграждам тази платформа частно и без спонсор - независимо и без реклами. Това е възможно само ако я подкрепят хора, които могат и искат да дадат нещо. С бутоните по-долу става бързо.",
    "{STUNDEN_BG}: толкова време средно се е упражнявал класът ви в писане с десет пръста - измерено по истинското време за писане, а не по времето с отворена програма. Поздравления, това е истинско постижение на целия клас. Надявам се приложението да ви помага и занапред. Между другото: безплатно не значи, че не струва нищо - разработката и сървърите постоянно струват пари. Тази платформа нарочно няма спонсор - само така остава без реклами. Тя се издържа, когато хората, които я използват, дадат нещо.",
    "Истинско време за писане в класа ви: {STUNDEN_BG} - поздравления. Тази платформа се разработва частно, без спонсор, и остава без реклами само ако хората я подкрепят. Разработката и сървърите постоянно струват пари.",
    "Поздравления: средното време за писане с десет пръста в класа ви вече е {STUNDEN_BG} - брои се само истинското писане, а не времето с отворена програма. Надявам се това да ви помага в часовете. Честно за това, което стои зад сайта: разработвам тази платформа частно, без фирма и без спонсор. Това е съзнателно решение срещу рекламите - а платформата не се издържа сама, защото разработката и сървърите постоянно струват пари. Възможно е само благодарение на хората, които я подкрепят.",
  ],
  selbstlernend: [
    "Поздравления: времето ти за писане с десет пръста вече е {STUNDEN_BG} - брои се само истинското писане, а не времето с отворена програма. Надявам се приложението да ти помага в ученето. Никой софтуер не се прави безплатно: разработката и сървърите постоянно струват пари. Този сайт се прави частно, без спонсор, и затова е без реклами. Ако си на 18 или повече години, ще се радвам, ако го подкрепиш.",
    "Поздравления! Имаш повод за радост - на брояча: {STUNDEN_BG} истинско писане с десет пръста, а не време с отворена програма. Много се надявам приложението да ти помага. Няколко думи за сайта зад него: никой софтуер не работи безплатно, разработката и сървърите постоянно струват пари. Изграждам тази платформа частно и без спонсор - независимо и без реклами. Ако си на 18 или повече години, ще се радвам, ако я подкрепиш, както други хора, които могат и искат да дадат нещо. С бутоните по-долу става бързо.",
    "{STUNDEN_BG} писане с десет пръста - толкова вече имаш зад гърба си, измерено по истинското време за писане, а не по времето с отворена програма. Поздравления, това е истинско постижение. Надявам се приложението да ти помага и занапред. Между другото: безплатно не значи, че не струва нищо - разработката и сървърите постоянно струват пари. Тази платформа нарочно няма спонсор - само така остава без реклами. Ако си на 18 или повече години: тя се издържа, когато хора като теб дадат нещо.",
    "На брояча: {STUNDEN_BG} истинско писане - поздравления! Тази платформа се прави частно, без спонсор, и остава без реклами само ако хората я подкрепят. Разработката и сървърите постоянно струват пари. Ако си на 18 или повече години, може би бутоните по-долу заслужават минутка внимание.",
    "Поздравления: времето ти за писане с десет пръста вече е {STUNDEN_BG} - брои се само истинското писане, а не времето с отворена програма. Надявам се това да ти помага да продължаваш напред. Честно за това, което стои зад сайта: разработвам тази платформа частно, без фирма и без спонсор. Това е съзнателно решение срещу рекламите - а платформата не се издържа сама, защото разработката и сървърите постоянно струват пари. Ако си на 18 или повече години, ще се радвам, ако я подкрепиш.",
  ],
};

const TASTENFLOW_EL: SpendenBannerTexte = {
  // Lehrkräfte εσείς, ohne Ausrufezeichen. {STUNDEN_EL} nur im Akkusativ oder nach Doppelpunkt
  // (ώρα/ώρες: Nominativ = Akkusativ), nie mit Artikel davor (Glossar Regel 13).
  lehrkraft: [
    "Συγχαρητήρια: το τμήμα σας έχει ήδη κατά μέσο όρο {STUNDEN_EL} εξάσκησης στη δακτυλογράφηση με δέκα δάχτυλα - πραγματικό χρόνο γραφής, όχι απλώς ανοιχτό πρόγραμμα. Ελπίζω το πρόγραμμα να σας βοηθά στην τάξη. Κανένα λογισμικό δεν γίνεται δωρεάν: η ανάπτυξη και οι διακομιστές κοστίζουν συνεχώς. Αυτή η σελίδα αναπτύσσεται ιδιωτικά, χωρίς χορηγό, και μένει χωρίς διαφημίσεις όσο τη στηρίζουν άνθρωποι σαν εσάς, έστω και με ένα μικρό ποσό.",
    "Συγχαρητήρια. Το τμήμα σας μόλις έφτασε σε ένα ωραίο ορόσημο: κατά μέσο όρο {STUNDEN_EL} πραγματικής γραφής με δέκα δάχτυλα, όχι απλώς χρόνο με ανοιχτό πρόγραμμα. Ελπίζω πολύ η εφαρμογή να είναι καλή βοήθεια στην τάξη. Λίγα λόγια για ό,τι υπάρχει πίσω από αυτή τη σελίδα: κανένα λογισμικό δεν λειτουργεί δωρεάν, η ανάπτυξη και οι διακομιστές κοστίζουν συνεχώς. Φτιάχνω αυτή την πλατφόρμα ιδιωτικά και χωρίς χορηγό - ανεξάρτητα και χωρίς διαφημίσεις. Αυτό γίνεται μόνο χάρη σε ανθρώπους που μπορούν και θέλουν να δώσουν κάτι. Με τα κουμπιά παρακάτω χρειάζεται μόνο λίγη ώρα.",
    "Χρόνος εξάσκησης στη δακτυλογράφηση με δέκα δάχτυλα: {STUNDEN_EL} κατά μέσο όρο στο τμήμα σας - μετρημένος με τον πραγματικό χρόνο γραφής, όχι με τον χρόνο που ήταν ανοιχτό το πρόγραμμα. Συγχαρητήρια, αυτό είναι πραγματική επιτυχία όλου του τμήματος. Ελπίζω η εφαρμογή να σας βοηθά και στη συνέχεια. Παρεμπιπτόντως: δωρεάν δεν σημαίνει ότι δεν κοστίζει τίποτα - η ανάπτυξη και οι διακομιστές κοστίζουν συνεχώς. Αυτή η πλατφόρμα σκόπιμα δεν έχει χορηγό - μόνο έτσι μένει χωρίς διαφημίσεις. Κρατιέται, αν άνθρωποι σαν εσάς προσφέρουν κάτι.",
    "Πραγματικός χρόνος γραφής στο τμήμα σας: {STUNDEN_EL} - συγχαρητήρια. Αυτή η πλατφόρμα αναπτύσσεται ιδιωτικά, χωρίς χορηγό, και μένει χωρίς διαφημίσεις μόνο αν τη στηρίζουν άνθρωποι. Η ανάπτυξη και οι διακομιστές κοστίζουν συνεχώς.",
    "Συγχαρητήρια: το τμήμα σας εξασκείται πλέον κατά μέσο όρο {STUNDEN_EL} στη δακτυλογράφηση με δέκα δάχτυλα - μετράει μόνο η πραγματική γραφή, όχι ο χρόνος με ανοιχτό πρόγραμμα. Ελπίζω αυτό να σας βοηθά στην τάξη. Ειλικρινά, για ό,τι υπάρχει πίσω από αυτό: αναπτύσσω αυτή την πλατφόρμα ιδιωτικά, χωρίς εταιρεία και χωρίς χορηγό. Είναι συνειδητή απόφαση κατά της διαφήμισης - και δεν κρατιέται από μόνη της, γιατί η ανάπτυξη και οι διακομιστές κοστίζουν συνεχώς. Γίνεται μόνο χάρη σε ανθρώπους σαν εσάς που τη στηρίζουν.",
  ],
  // Selbstlernende εσύ, höchstens ein Ausrufezeichen. Erwachsenen-Satz ohne Adjektiv über die Person.
  selbstlernend: [
    "Συγχαρητήρια: ο χρόνος σου στη δακτυλογράφηση με δέκα δάχτυλα είναι ήδη {STUNDEN_EL} - μετράει μόνο η πραγματική γραφή, όχι ο χρόνος με ανοιχτό πρόγραμμα. Ελπίζω η εφαρμογή να σε βοηθά καλά στη μάθηση. Κανένα λογισμικό δεν γίνεται δωρεάν: η ανάπτυξη και οι διακομιστές κοστίζουν συνεχώς. Αυτή η σελίδα φτιάχνεται ιδιωτικά, χωρίς χορηγό, και για αυτό είναι χωρίς διαφημίσεις. Αν έχεις κλείσει τα 18, θα χαρώ αν τη στηρίξεις.",
    "Συγχαρητήρια! Έχεις λόγο να χαίρεσαι - στον μετρητή: {STUNDEN_EL} πραγματικής γραφής με δέκα δάχτυλα, όχι χρόνος με ανοιχτό πρόγραμμα. Ελπίζω πολύ η εφαρμογή να σε βοηθά. Λίγα λόγια για ό,τι υπάρχει πίσω από αυτή τη σελίδα: κανένα λογισμικό δεν λειτουργεί δωρεάν, η ανάπτυξη και οι διακομιστές κοστίζουν συνεχώς. Φτιάχνω αυτή την πλατφόρμα ιδιωτικά και χωρίς χορηγό - ανεξάρτητα και χωρίς διαφημίσεις. Αν έχεις κλείσει τα 18, θα χαρώ αν τη στηρίξεις, όπως κι άλλοι άνθρωποι που μπορούν και θέλουν να δώσουν κάτι. Με τα κουμπιά παρακάτω χρειάζεται μόνο λίγη ώρα.",
    "Χρόνος εξάσκησης στη δακτυλογράφηση με δέκα δάχτυλα: {STUNDEN_EL} - μετρημένος με τον πραγματικό χρόνο γραφής, όχι με τον χρόνο που ήταν ανοιχτό το πρόγραμμα. Συγχαρητήρια, αυτό είναι πραγματική επιτυχία. Ελπίζω η εφαρμογή να σε βοηθά και στη συνέχεια. Παρεμπιπτόντως: δωρεάν δεν σημαίνει ότι δεν κοστίζει τίποτα - η ανάπτυξη και οι διακομιστές κοστίζουν συνεχώς. Αυτή η πλατφόρμα σκόπιμα δεν έχει χορηγό - μόνο έτσι μένει χωρίς διαφημίσεις. Αν έχεις κλείσει τα 18: κρατιέται, αν άνθρωποι σαν εσένα προσφέρουν κάτι.",
    "Στον μετρητή: {STUNDEN_EL} πραγματικής γραφής - συγχαρητήρια! Αυτή η πλατφόρμα αναπτύσσεται ιδιωτικά, χωρίς χορηγό, και μένει χωρίς διαφημίσεις μόνο αν τη στηρίζουν άνθρωποι. Η ανάπτυξη και οι διακομιστές κοστίζουν συνεχώς. Αν έχεις κλείσει τα 18, ίσως τα κουμπιά παρακάτω αξίζουν λίγη από την προσοχή σου.",
    "Συγχαρητήρια: ο χρόνος σου στη δακτυλογράφηση με δέκα δάχτυλα είναι ήδη {STUNDEN_EL} - μετράει μόνο η πραγματική γραφή, όχι ο χρόνος με ανοιχτό πρόγραμμα. Ελπίζω αυτό να σε βοηθά να προχωράς. Ειλικρινά, για ό,τι υπάρχει πίσω από αυτό: αναπτύσσω αυτή την πλατφόρμα ιδιωτικά, χωρίς εταιρεία και χωρίς χορηγό. Είναι συνειδητή απόφαση κατά της διαφήμισης - και δεν κρατιέται από μόνη της, γιατί η ανάπτυξη και οι διακομιστές κοστίζουν συνεχώς. Αν έχεις κλείσει τα 18, θα χαρώ αν τη στηρίξεις.",
  ],
};

const TASTENFLOW_HU: SpendenBannerTexte = {
  // Lehrkräfte ohne Anrede, ohne Ausrufezeichen. {STUNDEN_HU} nur im Nominativ
  // oder nach Doppelpunkt, nie mit Endung oder Artikel (Glossar Regel 12/13).
  lehrkraft: [
    "Gratulálok. Az osztály átlagos tízujjas gépelési ideje már {STUNDEN_HU} - valódi gépelés, nem csak nyitva hagyott program. Remélem, hogy a program jól szolgálja a tanítást. Egyetlen szoftver sem készül ingyen: a fejlesztés és a szerverek folyamatosan pénzbe kerülnek. Ezt az oldalt magánemberként, szponzor nélkül fejlesztem, és addig marad reklámmentes, amíg az emberek támogatják, akár kis összeggel is.",
    "Gratulálok. Az osztálynak oka van az örömre - átlagosan {STUNDEN_HU} valódi tízujjas gépelés, nem a nyitott program ideje. Nagyon remélem, hogy az alkalmazás jó segítség a tanításban. Néhány szó arról, mi áll az oldal mögött: egyetlen szoftver sem működik ingyen, a fejlesztés és a szerverek folyamatosan pénzbe kerülnek. Ezt a platformot magánemberként és szponzor nélkül építem - függetlenül és reklámok nélkül. Ez csak azoknak köszönhetően lehetséges, akik tudnak és szeretnének adni valamit. Az alábbi gombokkal ez csak egy pillanat.",
    "Tízujjas gépelési idő az osztályban: átlagosan {STUNDEN_HU} - a valódi gépelési időből számolva, nem abból, mennyi ideig volt nyitva a program. Gratulálok, ez az egész osztály valódi sikere. Remélem, hogy az alkalmazás a továbbiakban is jól segít. Egyébként: az ingyenes nem azt jelenti, hogy semmibe sem kerül - a fejlesztés és a szerverek folyamatosan pénzbe kerülnek. Ennek a platformnak szándékosan nincs szponzora - csak így maradhat reklámmentes. Akkor marad fenn, ha azok, akik használják, hozzátesznek valamit.",
    "Valódi gépelési idő az osztályban: {STUNDEN_HU} - gratulálok. Ezt a platformot magánemberként, szponzor nélkül fejlesztem, és csak akkor marad reklámmentes, ha az emberek támogatják. A fejlesztés és a szerverek folyamatosan pénzbe kerülnek.",
    "Gratulálok: az osztály átlagos tízujjas gépelési ideje már {STUNDEN_HU} - csak a valódi gépelés számít, nem a nyitott program ideje. Remélem, hogy ez segít a tanításban. Őszintén arról, mi áll mögötte: ezt a platformot magánemberként fejlesztem, cég és szponzor nélkül. Ez tudatos döntés a reklám ellen - és nem tartja fenn magát, mert a fejlesztés és a szerverek folyamatosan pénzbe kerülnek. Csak azoknak köszönhetően lehetséges, akik támogatják.",
  ],
  // Selbstlernende te, höchstens ein Ausrufezeichen.
  selbstlernend: [
    "Gratulálok: a tízujjas gépelési időd már {STUNDEN_HU} - csak a valódi gépelés számít, nem a nyitott program ideje. Remélem, hogy az alkalmazás jól segít a tanulásban. Egyetlen szoftver sem készül ingyen: a fejlesztés és a szerverek folyamatosan pénzbe kerülnek. Ezt az oldalt magánemberként, szponzor nélkül fejlesztem, ezért reklámmentes. Ha legalább 18 éves vagy, örülök, ha támogatod.",
    "Gratulálok! Okod van az örömre - a számláló szerint: {STUNDEN_HU} valódi tízujjas gépelés, nem a nyitott program ideje. Nagyon remélem, hogy az alkalmazás jól segít. Néhány szó arról, mi áll az oldal mögött: egyetlen szoftver sem működik ingyen, a fejlesztés és a szerverek folyamatosan pénzbe kerülnek. Ezt a platformot magánemberként és szponzor nélkül építem - függetlenül és reklámok nélkül. Ha legalább 18 éves vagy, örülök, ha támogatod, ahogy mások is, akik tudnak és szeretnének adni valamit. Az alábbi gombokkal ez csak egy pillanat.",
    "Tízujjas gépelési idő: {STUNDEN_HU} - ennyi van már mögötted, a valódi gépelési időből számolva, nem abból, mennyi ideig volt nyitva a program. Gratulálok, ez valódi siker. Remélem, hogy az alkalmazás a továbbiakban is jól segít. Egyébként: az ingyenes nem azt jelenti, hogy semmibe sem kerül - a fejlesztés és a szerverek folyamatosan pénzbe kerülnek. Ennek a platformnak szándékosan nincs szponzora - csak így maradhat reklámmentes. Ha legalább 18 éves vagy: akkor marad fenn, ha a hozzád hasonlók hozzátesznek valamit.",
    "A számláló szerint: {STUNDEN_HU} valódi gépelés - gratulálok! Ezt a platformot magánemberként, szponzor nélkül fejlesztem, és csak akkor marad reklámmentes, ha az emberek támogatják. A fejlesztés és a szerverek folyamatosan pénzbe kerülnek. Ha legalább 18 éves vagy, talán megér egy pillanatot az alábbi néhány gomb.",
    "Gratulálok: a tízujjas gépelési időd már {STUNDEN_HU} - csak a valódi gépelés számít, nem a nyitott program ideje. Remélem, hogy ez segít a továbbhaladásban. Őszintén arról, mi áll mögötte: ezt a platformot magánemberként fejlesztem, cég és szponzor nélkül. Ez tudatos döntés a reklám ellen - és nem tartja fenn magát, mert a fejlesztés és a szerverek folyamatosan pénzbe kerülnek. Ha legalább 18 éves vagy, örülök, ha támogatod.",
  ],
};

const TASTENFLOW_NL: SpendenBannerTexte = {
  lehrkraft: [
    "Gefeliciteerd: je klas heeft gemiddeld al {STUNDEN_NL} geoefend in het typen met tien vingers - echte typetijd, niet alleen tijd met het programma open. Ik hoop dat het programma je helpt in de klas. Software is nooit gratis: ontwikkeling en servers kosten doorlopend geld. Deze site wordt privé verder ontwikkeld, zonder sponsor, en blijft reclamevrij zolang mensen zoals jij hem steunen met een kleine bijdrage.",
    "Gefeliciteerd. Je klas heeft net een mooie mijlpaal bereikt: gemiddeld {STUNDEN_NL} oefenen in het typen met tien vingers - en dat is echte typetijd, niet gewoon de tijd dat het programma openstaat. Ik hoop van harte dat de app je goed helpt in de klas. Een woord over wat erachter zit: geen enkele software draait gratis, ontwikkeling en servers kosten doorlopend geld. Ik bouw dit platform privé en zonder sponsor - onafhankelijk en zonder reclame. Dat kan alleen blijven bestaan als mensen die iets kunnen en willen geven het steunen. Met de knoppen hieronder gaat dat snel.",
    "{STUNDEN_NL}: zo lang heeft je klas inmiddels gemiddeld geoefend in het typen met tien vingers - gemeten in echte typetijd, niet in de tijd dat het programma openstaat. Gefeliciteerd, dat is een echte prestatie van je klas. Ik hoop dat de app je daarbij goed helpt. Even terzijde: gratis betekent niet dat het niets kost om te maken, ontwikkeling en servers kosten doorlopend geld. Deze site heeft bewust geen sponsor - alleen zo blijft hij reclamevrij. Dat lukt als mensen zoals jij een bijdrage geven.",
    "Je klas heeft {STUNDEN_NL} echte typetijd bereikt - gefeliciteerd. Dit platform wordt privé ontwikkeld, zonder sponsor, en blijft alleen reclamevrij als mensen het steunen. Ontwikkeling en servers kosten doorlopend geld.",
    "Gefeliciteerd: je klas heeft inmiddels gemiddeld {STUNDEN_NL} geoefend in het typen met tien vingers - echt getypt, niet alleen geteld met het programma open. Ik hoop dat dit je helpt in de klas. Eerlijk over wat erachter zit: ik ontwikkel dit platform privé, zonder bedrijf en zonder sponsor. Dat is een bewuste keuze tegen reclame - en die betaalt zichzelf niet, ontwikkeling en servers kosten doorlopend geld. Dat kan alleen als mensen zoals jij het steunen.",
  ],
  selbstlernend: [
    "Gefeliciteerd: je hebt nu {STUNDEN_NL} geoefend in het typen met tien vingers - echte typetijd, niet alleen tijd met het programma open. Ik hoop dat de app je goed helpt bij het leren. Geen enkele software is gratis te maken: ontwikkeling en servers kosten doorlopend geld. Deze site wordt privé gemaakt, zonder sponsor, en blijft zo reclamevrij. Als je volwassen bent, ben ik blij als je hem steunt.",
    "Gefeliciteerd! Je hebt net een mooie mijlpaal bereikt: {STUNDEN_NL} oefenen in het typen met tien vingers - en dat is echte typetijd, niet gewoon de tijd dat het programma openstaat. Ik hoop van harte dat de app je goed helpt. Een woord over wat erachter zit: geen enkele software draait gratis, ontwikkeling en servers kosten doorlopend geld. Ik bouw dit platform privé en zonder sponsor - onafhankelijk en zonder reclame. Als je volwassen bent, ben ik blij als je het steunt, net als anderen die iets kunnen en willen geven. Met de knoppen hieronder gaat dat snel.",
    "{STUNDEN_NL}: zo lang heb je inmiddels geoefend in het typen met tien vingers - gemeten in echte typetijd, niet in de tijd dat het programma openstaat. Gefeliciteerd, dat is een echte prestatie! Ik hoop dat de app je daarbij goed helpt. Even terzijde: gratis betekent niet dat het niets kost om te maken, ontwikkeling en servers kosten doorlopend geld. Deze site heeft bewust geen sponsor - alleen zo blijft hij reclamevrij. Als je volwassen bent: dat lukt als mensen zoals jij een bijdrage geven.",
    "Je hebt {STUNDEN_NL} echte typetijd bereikt - gefeliciteerd! Dit platform wordt privé ontwikkeld, zonder sponsor, en blijft alleen reclamevrij als mensen het steunen. Ontwikkeling en servers kosten doorlopend geld. Als je volwassen bent: misschien zijn de knoppen hieronder een moment van je aandacht waard.",
    "Gefeliciteerd: je hebt inmiddels {STUNDEN_NL} geoefend in het typen met tien vingers - echt getypt, niet alleen geteld met het programma open. Ik hoop dat dit je verder helpt. Eerlijk over wat erachter zit: ik ontwikkel dit platform privé, zonder bedrijf en zonder sponsor. Dat is een bewuste keuze tegen reclame - en die betaalt zichzelf niet, ontwikkeling en servers kosten doorlopend geld. Als je volwassen bent, ben ik blij als je het steunt.",
  ],
};

const TASTENFLOW_PT: SpendenBannerTexte = {
  lehrkraft: [
    "Parabéns: a sua turma já praticou, em média, {STUNDEN_PT} de escrita com os dez dedos - tempo real de escrita, não apenas com o programa aberto. Espero que o programa ajude nas aulas. Nenhum programa é gratuito de fazer: o desenvolvimento e os servidores têm custos constantes. Este site é desenvolvido a título privado, sem patrocinador, e fica sem publicidade enquanto houver pessoas que o apoiem, mesmo com um pequeno contributo.",
    "Parabéns! A sua turma tem motivos para festejar: em média, {STUNDEN_PT} de escrita com os dez dedos - tempo real de escrita, não apenas tempo com o programa aberto. Espero sinceramente que a aplicação seja uma boa ajuda nas aulas. Uma palavra sobre o que está por trás deste site: nenhum programa funciona de graça; o desenvolvimento e os servidores têm custos constantes. Construo esta plataforma a título privado e sem patrocinador - de forma independente e sem publicidade. Isto só é possível graças às pessoas que podem e querem contribuir. Com os botões abaixo, é coisa de um instante.",
    "{STUNDEN_PT} de escrita com os dez dedos: é isto que a sua turma já tem, em média, contando o tempo real de escrita e não o tempo com o programa aberto. Parabéns, é uma verdadeira conquista de toda a turma. Espero que a aplicação continue a ser uma boa ajuda. Já agora: gratuito não quer dizer que não custe nada - o desenvolvimento e os servidores têm custos constantes. Esta plataforma não tem patrocinador de propósito: só assim fica sem publicidade. Mantém-se quando as pessoas que a usam contribuem com alguma coisa.",
    "Tempo real de escrita da sua turma: {STUNDEN_PT} - parabéns. Esta plataforma é desenvolvida a título privado, sem patrocinador, e só fica sem publicidade se houver pessoas que a apoiem. O desenvolvimento e os servidores têm custos constantes.",
    "Parabéns: a sua turma já tem, em média, {STUNDEN_PT} de escrita com os dez dedos - conta apenas a escrita real, não o tempo com o programa aberto. Espero que isto ajude nas aulas. Com franqueza, sobre o que está por trás: desenvolvo esta plataforma a título privado, sem empresa e sem patrocinador. É uma decisão consciente contra a publicidade - e não se sustenta sozinha, porque o desenvolvimento e os servidores têm custos constantes. Só é possível graças às pessoas que a apoiam.",
  ],
  selbstlernend: [
    "Parabéns: já tens {STUNDEN_PT} de escrita com os dez dedos - conta apenas a escrita real, não o tempo com o programa aberto. Espero que a aplicação te ajude a aprender. Nenhum programa é gratuito de fazer: o desenvolvimento e os servidores têm custos constantes. Este site é feito a título privado, sem patrocinador, e por isso não tem publicidade. Se tens 18 anos ou mais, fico contente se o apoiares.",
    "Parabéns! Tens motivos para festejar: {STUNDEN_PT} de escrita com os dez dedos - tempo real de escrita, não apenas tempo com o programa aberto. Espero sinceramente que a aplicação seja uma boa ajuda. Uma palavra sobre o que está por trás deste site: nenhum programa funciona de graça; o desenvolvimento e os servidores têm custos constantes. Construo esta plataforma a título privado e sem patrocinador - de forma independente e sem publicidade. Se tens 18 anos ou mais, fico contente se a apoiares, como outras pessoas que podem e querem contribuir. Com os botões abaixo, é coisa de um instante.",
    "{STUNDEN_PT} de escrita com os dez dedos: é isto que já tens, contando o tempo real de escrita e não o tempo com o programa aberto. Parabéns, é uma verdadeira conquista. Espero que a aplicação continue a ser uma boa ajuda. Já agora: gratuito não quer dizer que não custe nada - o desenvolvimento e os servidores têm custos constantes. Esta plataforma não tem patrocinador de propósito: só assim fica sem publicidade. Se tens 18 anos ou mais: ela mantém-se quando as pessoas que a usam contribuem com alguma coisa.",
    "Já tens {STUNDEN_PT} de escrita real - parabéns! Esta plataforma é desenvolvida a título privado, sem patrocinador, e só fica sem publicidade se houver pessoas que a apoiem. O desenvolvimento e os servidores têm custos constantes. Se tens 18 anos ou mais: talvez \"Apoiar o projeto\" mereça uma visita.",
    "Parabéns: já tens {STUNDEN_PT} de escrita com os dez dedos - conta apenas a escrita real, não o tempo com o programa aberto. Espero que isto te ajude. Com franqueza, sobre o que está por trás: desenvolvo esta plataforma a título privado, sem empresa e sem patrocinador. É uma decisão consciente contra a publicidade - e não se sustenta sozinha, porque o desenvolvimento e os servidores têm custos constantes. Se tens 18 anos ou mais, fico contente se a apoiares.",
  ],
};

const TASTENFLOW_BR: SpendenBannerTexte = {
  lehrkraft: [
    "Parabéns: em média, sua turma já praticou {STUNDEN_BR} de digitação com os dez dedos - tempo real de digitação, não apenas com o aplicativo aberto. Espero que o aplicativo ajude nas suas aulas. Nenhum software nasce de graça: o desenvolvimento e os servidores custam dinheiro o tempo todo. Este site é desenvolvido de forma particular, sem patrocínio, e continua sem anúncios enquanto houver quem o apoie, mesmo com uma pequena contribuição.",
    "Parabéns. Sua turma tem um bom motivo para comemorar: em média, {STUNDEN_BR} de prática de digitação com os dez dedos - tempo real de digitação, não apenas com o aplicativo aberto. Espero de verdade que o aplicativo seja uma boa ajuda nas suas aulas. Uma palavra sobre o que há por trás deste site: nenhum software funciona de graça, o desenvolvimento e os servidores custam dinheiro o tempo todo. Construo esta plataforma de forma particular e sem patrocínio - com independência e sem anúncios. Isso só é possível graças a quem pode e quer contribuir. Com os botões abaixo, leva só um instante.",
    "{STUNDEN_BR} de digitação com os dez dedos: esse é o tempo médio de prática da sua turma, medido em tempo real de digitação, não com o aplicativo aberto. Parabéns, é uma conquista de toda a turma. Espero que o aplicativo continue ajudando. A propósito: gratuito não quer dizer que não custe nada - o desenvolvimento e os servidores custam dinheiro o tempo todo. Esta plataforma não tem patrocínio de propósito - só assim continua sem anúncios. Ela se mantém se quem a usa contribuir com alguma coisa.",
    "Tempo real de digitação da sua turma: {STUNDEN_BR} - parabéns. Esta plataforma é desenvolvida de forma particular, sem patrocínio, e só continua sem anúncios se houver quem a apoie. O desenvolvimento e os servidores custam dinheiro o tempo todo.",
    "Parabéns: em média, sua turma já praticou {STUNDEN_BR} de digitação com os dez dedos - só conta a digitação real, não o tempo com o aplicativo aberto. Espero que isso ajude nas suas aulas. Com franqueza, sobre o que há por trás disso: desenvolvo esta plataforma de forma particular, sem empresa e sem patrocínio. É uma decisão consciente contra os anúncios - e ela não se paga sozinha, porque o desenvolvimento e os servidores custam dinheiro o tempo todo. Isso só é possível graças a quem a apoia.",
  ],
  selbstlernend: [
    "Parabéns: você já praticou {STUNDEN_BR} de digitação com os dez dedos - só conta a digitação real, não o tempo com o aplicativo aberto. Espero que o aplicativo ajude você a aprender. Nenhum software nasce de graça: o desenvolvimento e os servidores custam dinheiro o tempo todo. Este site é feito de forma particular, sem patrocínio, e por isso não tem anúncios. Se você tem 18 anos ou mais, seu apoio me deixaria feliz.",
    "Parabéns! Você tem um bom motivo para comemorar: {STUNDEN_BR} de prática de digitação com os dez dedos - tempo real de digitação, não apenas com o aplicativo aberto. Espero de verdade que o aplicativo seja uma boa ajuda. Uma palavra sobre o que há por trás deste site: nenhum software funciona de graça, o desenvolvimento e os servidores custam dinheiro o tempo todo. Construo esta plataforma de forma particular e sem patrocínio - com independência e sem anúncios. Se você tem 18 anos ou mais, seu apoio me deixaria feliz, como o de outras pessoas que podem e querem contribuir. Com os botões abaixo, leva só um instante.",
    "{STUNDEN_BR} de digitação com os dez dedos: esse é o seu tempo de prática até agora, medido em tempo real de digitação, não com o aplicativo aberto. Parabéns, é uma conquista de verdade. Espero que o aplicativo continue ajudando. A propósito: gratuito não quer dizer que não custe nada - o desenvolvimento e os servidores custam dinheiro o tempo todo. Esta plataforma não tem patrocínio de propósito - só assim continua sem anúncios. Se você tem 18 anos ou mais: ela se mantém se quem a usa contribuir com alguma coisa.",
    "No contador: {STUNDEN_BR} de digitação real - parabéns! Esta plataforma é desenvolvida de forma particular, sem patrocínio, e só continua sem anúncios se houver quem a apoie. O desenvolvimento e os servidores custam dinheiro o tempo todo. Se você tem 18 anos ou mais, talvez os botões abaixo mereçam um instante da sua atenção.",
    "Parabéns: você já praticou {STUNDEN_BR} de digitação com os dez dedos - só conta a digitação real, não o tempo com o aplicativo aberto. Espero que isso ajude você a seguir em frente. Com franqueza, sobre o que há por trás disso: desenvolvo esta plataforma de forma particular, sem empresa e sem patrocínio. É uma decisão consciente contra os anúncios - e ela não se paga sozinha, porque o desenvolvimento e os servidores custam dinheiro o tempo todo. Se você tem 18 anos ou mais, seu apoio me deixaria feliz.",
  ],
};

const TASTENFLOW_RO: SpendenBannerTexte = {
  lehrkraft: [
    "Felicitări: în medie, clasa are deja {STUNDEN_RO} de scriere cu zece degete - timp real de scriere, nu doar program deschis. Sper că programul vă ajută la clasă. Niciun program nu se face gratuit: dezvoltarea și serverele costă în permanență. Acest site este dezvoltat în regim privat, fără sponsor, și rămâne fără reclame atât timp cât persoane ca dumneavoastră îl susțin cu o mică contribuție.",
    "Felicitări. Clasa tocmai a atins un prag frumos: în medie {STUNDEN_RO} de scriere cu zece degete - și este timp real de scriere, nu timpul cu programul deschis. Sper din inimă că aplicația vă este de mare ajutor la clasă. Câteva cuvinte despre ce se află în spatele site-ului: niciun program nu funcționează gratuit, dezvoltarea și serverele costă în permanență. Construiesc această platformă în regim privat și fără sponsor - independent și fără reclame. Acest lucru rămâne posibil doar dacă o susțin persoane care pot și vor să dea ceva. Cu butoanele de mai jos durează doar o clipă.",
    "{STUNDEN_RO} de scriere cu zece degete: atât are clasa în medie până acum, măsurat în timp real de scriere, nu în timp cu programul deschis. Felicitări, este o reușită adevărată a clasei. Sper că aplicația vă este în continuare de ajutor. Apropo: gratuit nu înseamnă că nu costă nimic - dezvoltarea și serverele costă în permanență. Această platformă nu are sponsor în mod intenționat - doar așa rămâne fără reclame. Se susține dacă persoane ca dumneavoastră contribuie cu ceva.",
    "Timp real de scriere în clasă: {STUNDEN_RO} - felicitări. Această platformă este dezvoltată în regim privat, fără sponsor, și rămâne fără reclame doar dacă oamenii o susțin. Dezvoltarea și serverele costă în permanență.",
    "Felicitări: în medie, timpul de scriere cu zece degete al clasei este deja de {STUNDEN_RO} - se numără doar scrierea reală, nu timpul cu programul deschis. Sper că vă ajută la clasă. Sincer, despre ce se află în spate: dezvolt această platformă în regim privat, fără firmă și fără sponsor. Este o decizie conștientă împotriva reclamelor - și nu se susține singură, pentru că dezvoltarea și serverele costă în permanență. Este posibil doar datorită persoanelor care o susțin.",
  ],
  selbstlernend: [
    "Felicitări: ai deja {STUNDEN_RO} de scriere cu zece degete - se numără doar scrierea reală, nu timpul cu programul deschis. Sper că aplicația te ajută bine la învățat. Niciun program nu se face gratuit: dezvoltarea și serverele costă în permanență. Acest site se face în regim privat, fără sponsor, și de aceea este fără reclame. Dacă ai 18 ani sau mai mult, mă bucur dacă îl susții.",
    "Felicitări! Tocmai ai atins un prag frumos: {STUNDEN_RO} de scriere reală cu zece degete, nu timp cu programul deschis. Sper din inimă că aplicația te ajută. Câteva cuvinte despre ce se află în spatele site-ului: niciun program nu funcționează gratuit, dezvoltarea și serverele costă în permanență. Construiesc această platformă în regim privat și fără sponsor - independent și fără reclame. Dacă ai 18 ani sau mai mult, mă bucur dacă o susții, ca și alte persoane care pot și vor să dea ceva. Cu butoanele de mai jos durează doar o clipă.",
    "{STUNDEN_RO} de scriere cu zece degete: atât ai până acum, măsurat în timp real de scriere, nu în timp cu programul deschis. Felicitări, este o reușită adevărată! Sper că aplicația te ajută și în continuare. Apropo: gratuit nu înseamnă că nu costă nimic - dezvoltarea și serverele costă în permanență. Această platformă nu are sponsor în mod intenționat - doar așa rămâne fără reclame. Dacă ai 18 ani sau mai mult: se susține dacă persoane ca tine contribuie cu ceva.",
    "Timp real de scriere: {STUNDEN_RO} - felicitări! Această platformă este dezvoltată în regim privat, fără sponsor, și rămâne fără reclame doar dacă oamenii o susțin. Dezvoltarea și serverele costă în permanență. Dacă ai 18 ani sau mai mult, poate că butoanele de mai jos merită o clipă de atenție.",
    "Felicitări: timpul tău de scriere cu zece degete este deja de {STUNDEN_RO} - se numără doar scrierea reală, nu timpul cu programul deschis. Sper că te ajută să mergi mai departe. Sincer, despre ce se află în spate: dezvolt această platformă în regim privat, fără firmă și fără sponsor. Este o decizie conștientă împotriva reclamelor - și nu se susține singură, pentru că dezvoltarea și serverele costă în permanență. Dacă ai 18 ani sau mai mult, mă bucur dacă o susții.",
  ],
};

const TASTENFLOW_SV: SpendenBannerTexte = {
  lehrkraft: [
    "Grattis: I genomsnitt har din klass redan skrivit med alla tio fingrar i {STUNDEN_SV} - verklig skrivtid, inte bara tid med programmet öppet. Jag hoppas att programmet är till hjälp i undervisningen. Inget program är gratis: utveckling och servrar kostar pengar hela tiden. Den här webbplatsen utvecklas privat, utan sponsor, och förblir fri från reklam så länge personer som du stöder den med ett litet bidrag.",
    "Grattis. Din klass har just nått en fin milstolpe: i genomsnitt {STUNDEN_SV} med alla tio fingrar - och det är verklig skrivtid, inte bara tid med programmet öppet. Jag hoppas verkligen att programmet är till god hjälp i undervisningen. Några ord om vad som finns bakom: inget program är gratis att driva, utveckling och servrar kostar pengar hela tiden. Jag bygger den här plattformen privat och utan sponsor - oberoende och utan reklam. Det går bara så länge den får stöd av personer som kan och vill ge något. Med knapparna nedan går det snabbt.",
    "{STUNDEN_SV}: så länge har din klass nu i genomsnitt skrivit med alla tio fingrar - räknat i verklig skrivtid, inte i tid med programmet öppet. Grattis, det är en riktig prestation av klassen. Jag hoppas att programmet är till god hjälp på vägen. För kännedom: kostnadsfritt betyder inte att det inte kostar något att göra, utveckling och servrar kostar pengar hela tiden. Den här webbplatsen har medvetet ingen sponsor - bara så förblir den fri från reklam. Det håller om personer som du bidrar med något.",
    "Din klass har nått {STUNDEN_SV} verklig skrivtid - grattis. Den här plattformen utvecklas privat, utan sponsor, och förblir bara fri från reklam om den får stöd. Utveckling och servrar kostar pengar hela tiden.",
    "Grattis: I genomsnitt har din klass nu skrivit med alla tio fingrar i {STUNDEN_SV} - verkligt skrivande, inte bara tid med programmet öppet. Jag hoppas att det hjälper dig i undervisningen. Lite öppenhet om vad som finns bakom: jag utvecklar den här plattformen privat, utan företag och utan sponsor. Det är ett medvetet val mot reklam - och det bär inte sig självt, utveckling och servrar kostar pengar hela tiden. Det går bara så länge personer som du stöder den.",
  ],
  selbstlernend: [
    "Grattis: Du har nu skrivit med alla tio fingrar i {STUNDEN_SV} - verklig skrivtid, inte bara tid med programmet öppet. Jag hoppas att programmet hjälper dig att lära dig. Inget program är gratis att göra: utveckling och servrar kostar pengar hela tiden. Den här webbplatsen görs privat, utan sponsor, och är därför fri från reklam. Om du är vuxen blir jag glad om du stöder den.",
    "Grattis! Du har just nått en fin milstolpe: {STUNDEN_SV} med alla tio fingrar - och det är verklig skrivtid, inte bara tid med programmet öppet. Jag hoppas verkligen att programmet är till god hjälp. Några ord om vad som finns bakom: inget program är gratis att driva, utveckling och servrar kostar pengar hela tiden. Jag bygger den här plattformen privat och utan sponsor - oberoende och utan reklam. Om du är vuxen blir jag glad om du stöder den, liksom andra som kan och vill ge något. Med knapparna nedan går det snabbt.",
    "{STUNDEN_SV}: så länge har du nu skrivit med alla tio fingrar - räknat i verklig skrivtid, inte i tid med programmet öppet. Grattis, det är en riktig prestation! Jag hoppas att programmet är till god hjälp på vägen. För kännedom: kostnadsfritt betyder inte att det inte kostar något att göra, utveckling och servrar kostar pengar hela tiden. Den här webbplatsen har medvetet ingen sponsor - bara så förblir den fri från reklam. Om du är vuxen: det håller om personer som du bidrar med något.",
    "Du har nått {STUNDEN_SV} verklig skrivtid - grattis! Den här plattformen utvecklas privat, utan sponsor, och förblir bara fri från reklam om den får stöd. Utveckling och servrar kostar pengar hela tiden. Om du är vuxen: kanske är knapparna nedan värda en stund.",
    "Grattis: Du har nu skrivit med alla tio fingrar i {STUNDEN_SV} - verkligt skrivande, inte bara tid med programmet öppet. Jag hoppas att det hjälper dig vidare. Lite öppenhet om vad som finns bakom: jag utvecklar den här plattformen privat, utan företag och utan sponsor. Det är ett medvetet val mot reklam - och det bär inte sig självt, utveckling och servrar kostar pengar hela tiden. Om du är vuxen blir jag glad om du stöder den.",
  ],
};

const TASTENFLOW_UK: SpendenBannerTexte = {
  lehrkraft: [
    "Вітаю. Середній час друку десятипальцевим методом у вашому класі - уже {STUNDEN_UK}. Рахується лише справжній друк, а не час із відкритою програмою. Сподіваюся, програма добре допомагає вам у навчанні. Жодна програма не створюється безкоштовно: розробка й сервери постійно коштують грошей. Цей сайт я розробляю приватно, без спонсора, і він залишатиметься без реклами доти, доки люди його підтримуватимуть, хоча б невеликою сумою.",
    "Вітаю. Ваш клас має привід для радості: у середньому {STUNDEN_UK} справжнього друку десятипальцевим методом, а не часу з відкритою програмою. Дуже сподіваюся, що програма добре допомагає вам у навчанні. Кілька слів про те, що стоїть за цим сайтом: жодна програма не працює безкоштовно, розробка й сервери постійно коштують грошей. Я будую цю платформу приватно й без спонсора - незалежно й без реклами. Це можливо лише завдяки людям, які можуть і хочуть щось дати. Кнопками нижче це займе лише хвилинку.",
    "{STUNDEN_UK} друку десятипальцевим методом - стільки ваш клас у середньому вже має за плечима, якщо рахувати справжній час друку, а не час із відкритою програмою. Вітаю, це справжнє досягнення всього класу. Сподіваюся, програма й далі добре допомагатиме вам. До речі: безкоштовно не означає, що це нічого не коштує - розробка й сервери постійно коштують грошей. Ця платформа навмисно не має спонсора - лише так вона залишається без реклами. Вона втримається, якщо люди, які нею користуються, щось додадуть.",
    "Справжній час друку у вашому класі: {STUNDEN_UK} - вітаю. Ця платформа створюється приватно, без спонсора, і залишається без реклами лише тоді, коли люди її підтримують. Розробка й сервери постійно коштують грошей.",
    "Вітаю: середній час друку десятипальцевим методом у вашому класі - уже {STUNDEN_UK}. Рахується лише справжній друк, а не час із відкритою програмою. Сподіваюся, це допомагає вам у навчанні. Відверто про те, що за цим стоїть: цю платформу я розробляю приватно, без фірми й без спонсора. Це свідоме рішення проти реклами - і саме себе воно не утримає, бо розробка й сервери постійно коштують грошей. Це можливо лише завдяки людям, які її підтримують.",
  ],
  selbstlernend: [
    "Вітаю: твій час друку десятипальцевим методом - уже {STUNDEN_UK}. Рахується лише справжній друк, а не час із відкритою програмою. Сподіваюся, програма добре допомагає тобі вчитися. Жодна програма не створюється безкоштовно: розробка й сервери постійно коштують грошей. Цей сайт створюється приватно, без спонсора, і тому він без реклами. Якщо тобі 18 років або більше, мені буде приємно, якщо ти його підтримаєш.",
    "Вітаю! Маєш привід для радості: на лічильнику {STUNDEN_UK} справжнього друку десятипальцевим методом, а не часу з відкритою програмою. Дуже сподіваюся, що програма добре тобі допомагає. Кілька слів про те, що стоїть за цим сайтом: жодна програма не працює безкоштовно, розробка й сервери постійно коштують грошей. Я будую цю платформу приватно й без спонсора - незалежно й без реклами. Якщо тобі 18 років або більше, мені буде приємно, якщо ти її підтримаєш, так само як інші люди, які можуть і хочуть щось дати. Кнопками нижче це займе лише хвилинку.",
    "{STUNDEN_UK} друку десятипальцевим методом - стільки вже маєш за плечима, якщо рахувати справжній час друку, а не час із відкритою програмою. Вітаю, це справжнє досягнення. Сподіваюся, програма й далі добре тобі допомагатиме. До речі: безкоштовно не означає, що це нічого не коштує - розробка й сервери постійно коштують грошей. Ця платформа навмисно не має спонсора - лише так вона залишається без реклами. Якщо тобі 18 років або більше: вона втримається, якщо люди, як ти, щось додадуть.",
    "На лічильнику: {STUNDEN_UK} справжнього друку - вітаю! Ця платформа створюється приватно, без спонсора, і залишається без реклами лише тоді, коли люди її підтримують. Розробка й сервери постійно коштують грошей. Якщо тобі 18 років або більше, можливо, кнопки нижче варті хвилинки уваги.",
    "Вітаю: твій час друку десятипальцевим методом - уже {STUNDEN_UK}. Рахується лише справжній друк, а не час із відкритою програмою. Сподіваюся, це допомагає тобі йти далі. Відверто про те, що за цим стоїть: цю платформу я розробляю приватно, без фірми й без спонсора. Це свідоме рішення проти реклами - і саме себе воно не утримає, бо розробка й сервери постійно коштують грошей. Якщо тобі 18 років або більше, мені буде приємно, якщо ти її підтримаєш.",
  ],
};

/**
 * ★ E11a-5: je Sprache die Tabelle der übersetzten Texte - Deutsch ist die
 * Grundfassung. Tabelle statt einer Weiche auf „en" (die lieferte für „fr"
 * still Deutsch, Falle 30).
 */
const UEBERSETZTE_TEXTE: Record<
  Exclude<BedienSprache, "de">,
  Partial<Record<string, SpendenBannerTexte>>
> = {
  en: SPENDENBANNER_TEXTE_EN,
  fr: SPENDENBANNER_TEXTE_FR,
  // ★ ES-O: eigene Tabelle (bis dahin die englische). Punktgenau und »Im Griff«
  // haben keine spanische Fassung - sie fallen wie bei „fr" auf Deutsch zurück.
  es: SPENDENBANNER_TEXTE_ES,
  // ★ O-IT: eigene Tabelle; Punktgenau und »Im Griff« fallen wie bei „es" auf Deutsch.
  it: SPENDENBANNER_TEXTE_IT,
  // ★ O-PL: eigene Tabelle; Punktgenau und »Im Griff« fallen wie bei „it" auf Deutsch.
  pl: SPENDENBANNER_TEXTE_PL,
  // ★ O-TR: eigene Tabelle; Punktgenau und Im Griff fallen wie bei "pl" auf Deutsch.
  tr: SPENDENBANNER_TEXTE_TR,
  // ★ O-CS: eigene Tabelle; Punktgenau und Im Griff fallen wie bei "tr" auf Deutsch.
  cs: SPENDENBANNER_TEXTE_CS,
  bg: { ...SPENDENBANNER_TEXTE_EN, tastenflow: TASTENFLOW_BG },
  el: { ...SPENDENBANNER_TEXTE_EN, tastenflow: TASTENFLOW_EL },
  hu: { ...SPENDENBANNER_TEXTE_EN, tastenflow: TASTENFLOW_HU },
  nl: { ...SPENDENBANNER_TEXTE_EN, tastenflow: TASTENFLOW_NL },
  pt: { ...SPENDENBANNER_TEXTE_EN, tastenflow: TASTENFLOW_PT },
  br: { ...SPENDENBANNER_TEXTE_EN, tastenflow: TASTENFLOW_BR },
  ro: { ...SPENDENBANNER_TEXTE_EN, tastenflow: TASTENFLOW_RO },
  sv: { ...SPENDENBANNER_TEXTE_EN, tastenflow: TASTENFLOW_SV },
  uk: { ...SPENDENBANNER_TEXTE_EN, tastenflow: TASTENFLOW_UK },
};

/**
 * Die Texte eines Programms in der Sprache der Bedienung. Englisch oder
 * Französisch nur, wo es sie gibt - sonst (und ohne Angabe) die deutschen, wie
 * bisher.
 */
export function spendenBannerTexte(
  app: string,
  sprache: BedienSprache = "de",
): SpendenBannerTexte | undefined {
  if (sprache !== "de") {
    const uebersetzt = UEBERSETZTE_TEXTE[sprache][app];
    if (uebersetzt) return uebersetzt;
  }
  return SPENDENBANNER_TEXTE[app];
}

/** ★ O2-SONST (30.10.2026): das gebeugte Wort „Stunde(n)" der neun. */
const STUNDEN_BG = { one: (z: string) => `${z} час`, other: (z: string) => `${z} часа` };
const STUNDEN_EL = { one: (z: string) => `${z} ώρα`, other: (z: string) => `${z} ώρες` };
const STUNDEN_HU = { one: (z: string) => `${z} óra`, other: (z: string) => `${z} óra` };
const STUNDEN_NL = { one: (z: string) => `${z} uur`, other: (z: string) => `${z} uur` };
const STUNDEN_PT = {
  one: (z: string) => `${z} hora`,
  other: (z: string) => `${z} horas`,
  many: (z: string) => `${z} de horas`,
};
const STUNDEN_BR = { one: (z: string) => `${z} hora`, other: (z: string) => `${z} horas` };
const STUNDEN_RO = {
  one: (z: string) => `${z} oră`,
  few: (z: string) => `${z} ore`,
  other: (z: string) => `${z} de ore`,
};
const STUNDEN_SV = { one: (z: string) => `${z} timme`, other: (z: string) => `${z} timmar` };
const STUNDEN_UK = {
  one: (z: string) => `${z} година`,
  few: (z: string) => `${z} години`,
  many: (z: string) => `${z} годин`,
  other: (z: string) => `${z} години`,
};

/** Ersetzt `{STUNDEN}` durch die tatsächliche Zahl - der einzige Platzhalter. */
export function spendenBannerTextFuellen(vorlage: string, stundenGesamt: number): string {
  return vorlage
    .replaceAll("{STUNDEN}", String(stundenGesamt))
    .replaceAll("{GODZINY}", godzinyPl(stundenGesamt))
    .replaceAll("{HODINY}", hodinyCs(stundenGesamt))
    .replaceAll("{STUNDEN_BG}", mehrzahl(stundenGesamt, "bg", STUNDEN_BG))
    .replaceAll("{STUNDEN_EL}", mehrzahl(stundenGesamt, "el", STUNDEN_EL))
    .replaceAll("{STUNDEN_HU}", mehrzahl(stundenGesamt, "hu", STUNDEN_HU))
    .replaceAll("{STUNDEN_NL}", mehrzahl(stundenGesamt, "nl", STUNDEN_NL))
    .replaceAll("{STUNDEN_PT}", mehrzahl(stundenGesamt, "pt", STUNDEN_PT))
    .replaceAll("{STUNDEN_BR}", mehrzahl(stundenGesamt, "br", STUNDEN_BR))
    .replaceAll("{STUNDEN_RO}", mehrzahl(stundenGesamt, "ro", STUNDEN_RO))
    .replaceAll("{STUNDEN_SV}", mehrzahl(stundenGesamt, "sv", STUNDEN_SV))
    .replaceAll("{STUNDEN_UK}", mehrzahl(stundenGesamt, "uk", STUNDEN_UK));
}

/**
 * ★ O-PL (02.10.2026): `{GODZINY}` der polnischen Texte - Zahl und gebeugtes
 * Wort zusammen (Glossar §2.10a, alle vier Formen). Andere Sprachen tragen den
 * Platzhalter nicht; für sie ändert sich nichts.
 */
function godzinyPl(n: number): string {
  return mehrzahl(n, "pl", {
    one: (z) => `${z} godzina`,
    few: (z) => `${z} godziny`,
    many: (z) => `${z} godzin`,
    other: (z) => `${z} godziny`,
  });
}

/**
 * ★ O-CS (03.10.2026): `{HODINY}` der tschechischen Texte - Zahl und gebeugtes
 * Wort zusammen (Glossar §2.11, alle vier Formen; `many` = Bruchzahl "1,5 hodiny").
 * Andere Sprachen tragen den Platzhalter nicht; für sie ändert sich nichts.
 */
function hodinyCs(n: number): string {
  return mehrzahl(n, "cs", {
    one: (z) => `${z} hodina`,
    few: (z) => `${z} hodiny`,
    many: (z) => `${z} hodiny`,
    other: (z) => `${z} hodin`,
  });
}

/**
 * ★★★★★ DIE BITTE NACH EINEM JAHR (Johannes, 21.09.2026) - ein eigener Text, nicht
 * einer der Meilenstein-Texte. Johannes' Vorgabe: *„Werbefrei und kostenlos bleibt
 * unser Anspruch! Lieber Benutzer (wenn wir Namen haben, dann mit Namen), Sie haben
 * uns vor einem Jahr mit einer Spende unterstützt, und Ihre Unterstützung hat dazu
 * beigetragen, dass wir dieses Projekt weiter pflegen und online halten können. Nach
 * einem Jahr bitte ich Sie nochmals, dieses freie Projekt zu unterstützen, um es
 * weiter betreiben zu können. Herzlichen Dank! Und gutes Weitertippen!"*
 *
 * Abweichungen, bewusst:
 *  · „vor einem Jahr" ⇒ das DATUM der Spende: Der Banner erscheint erst, wenn auch
 *    geübt wurde - das kann Monate nach dem Jahrestag sein, „vor einem Jahr" wäre
 *    dann falsch.
 *  · „Lieber Benutzer" ⇒ „Guten Tag {Name}," (Lehrkraft, Sie) bzw. „Hallo {Name},"
 *    (Selbstlernende, Du): Ob jemand „Lieber" oder „Liebe" ist, wissen wir nicht,
 *    und aus einem Namen wird es nie geraten. Ohne Namen: „Guten Tag," / „Hallo,".
 *  · Der Schluss passt zum Programm („Weitertippen" gilt nur für Tastenflow).
 *  · Lehrkräfte in der Sie-Form, Selbstlernende in der Du-Form - wie alle Banner.
 */
export interface SpendenErneuerungText {
  titel: string;
  text: string;
}

const ERNEUERUNG_SCHLUSS_DE: Record<string, string> = {
  tastenflow: "Und gutes Weitertippen!",
  braille: "Und gutes Weiterüben!",
  computer: "Und gutes Weiterüben!",
};
const ERNEUERUNG_SCHLUSS_EN: Record<string, string> = {
  tastenflow: "And happy typing!",
  braille: "And happy practising!",
  computer: "And happy practising!",
};

const ERNEUERUNG_SCHLUSS_FR: Record<string, string> = {
  tastenflow: "Et bonne frappe !",
  braille: "Et bon entrainement !",
  computer: "Et bon entrainement !",
};

const ERNEUERUNG_SCHLUSS_ES: Record<string, string> = {
  tastenflow: "¡Y que sigas escribiendo con ganas!",
  braille: "¡Y que sigas practicando con ganas!",
  computer: "¡Y que sigas practicando con ganas!",
};

/** ★ O-IT: der Schluss für Selbstlernende (tu). */
const ERNEUERUNG_SCHLUSS_IT: Record<string, string> = {
  tastenflow: "E buona scrittura!",
  braille: "E buon esercizio!",
  computer: "E buon esercizio!",
};

/** ★ O-PL: der Schluss für Selbstlernende (ty). */
const ERNEUERUNG_SCHLUSS_PL: Record<string, string> = {
  tastenflow: "I miłego pisania!",
  braille: "I miłych ćwiczeń!",
  computer: "I miłych ćwiczeń!",
};

/** ★ O-PL: der Schluss für Lehrkräfte - ohne Ausrufezeichen (Glossar Regel 1). */
const ERNEUERUNG_SCHLUSS_PL_NEUTRAL: Record<string, string> = {
  tastenflow: "Powodzenia w dalszym pisaniu.",
  braille: "Powodzenia w dalszych ćwiczeniach.",
  computer: "Powodzenia w dalszych ćwiczeniach.",
};

/** ★ O-TR: der Schluss für Selbstlernende (sen) - das einzige Ausrufezeichen. */
const ERNEUERUNG_SCHLUSS_TR: Record<string, string> = {
  tastenflow: "Keyifli yazmalar!",
  braille: "İyi çalışmalar!",
  computer: "İyi çalışmalar!",
};

/** ★ O-TR: der Schluss für Lehrkräfte (siz) - ohne Ausrufezeichen (Glossar Regel 1). */
const ERNEUERUNG_SCHLUSS_TR_SIZ: Record<string, string> = {
  tastenflow: "Klavye çalışmalarınızda başarılar.",
  braille: "Çalışmalarınızda başarılar.",
  computer: "Çalışmalarınızda başarılar.",
};

/** ★ O-CS: der Schluss für Selbstlernende (ty) - das einzige Ausrufezeichen. */
const ERNEUERUNG_SCHLUSS_CS: Record<string, string> = {
  tastenflow: "Ať se ti dál dobře píše!",
  braille: "Ať se ti dál dobře cvičí!",
  computer: "Ať se ti dál dobře cvičí!",
};

/** ★ O-CS: der Schluss für Lehrkräfte (vy) - ohne Ausrufezeichen (Glossar Regel 1). */
const ERNEUERUNG_SCHLUSS_CS_VY: Record<string, string> = {
  tastenflow: "Ať se vám dál dobře píše.",
  braille: "Ať se vám dál dobře cvičí.",
  computer: "Ať se vám dál dobře cvičí.",
};

/** ★ O-IT: der Schluss für Lehrkräfte - neutral, ohne Ausrufezeichen (Glossar Regel 1). */
const ERNEUERUNG_SCHLUSS_IT_NEUTRAL: Record<string, string> = {
  tastenflow: "Buon proseguimento con la dattilografia.",
  braille: "Buon proseguimento con gli esercizi.",
  computer: "Buon proseguimento con gli esercizi.",
};

/** Der Schluss für docentes (usted) - „que siga …" statt „que sigas …". */
const ERNEUERUNG_SCHLUSS_ES_USTED: Record<string, string> = {
  tastenflow: "¡Y que siga escribiendo con ganas!",
  braille: "¡Y que siga practicando con ganas!",
  computer: "¡Y que siga practicando con ganas!",
};

/** ★ E11a-5: Trennzeichen des Datums je Sprache - Französisch wie Englisch mit Schrägstrich (Bauplan §9.1: `25/09/2026`). */
const DATUM_TRENNER: Record<BedienSprache, string> = {
  de: ".",
  en: "/",
  fr: "/",
  // ★ ES-O: Spanien und Lateinamerika schreiben das Datum TT/MM/JJJJ.
  es: "/",
  // ★ O-IT: Italien schreibt TT/MM/JJJJ (Glossar §2.10).
  it: "/",
  // ★ O-PL: Polen schreibt TT.MM.JJJJ (Glossar §2.10, „21.09.2026").
  pl: ".",
  // ★ O-TR: die Türkei schreibt TT.MM.JJJJ (Glossar §2.10, "21.09.2026").
  tr: ".",
  // ★ O-CS: im cs-Zweig nicht benutzt - dort kommt das Datum aus Intl "cs-CZ"
  // ("2. 10. 2026" mit Leerzeichen, Glossar §2.10; "02.10.2026" wäre falsch).
  cs: ".",
  bg: ".",
  el: "/",
  hu: ".",
  nl: "-",
  pt: "/",
  br: "/",
  ro: ".",
  sv: "-",
  uk: ".",
};

function datumFuer(ms: number, sprache: BedienSprache): string {
  const d = new Date(ms);
  const tt = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const t = DATUM_TRENNER[sprache];
  return `${tt}${t}${mm}${t}${d.getFullYear()}`;
}

/** ★ O2-SONST (30.10.2026): die Bitte nach einem Jahr für die neun; das Datum aus Intl (hu und sv stellen das Jahr voran). */
interface ErneuerungNeun {
  titel: string;
  lehrkraft: (a: { datum: string; name: string; app: string }) => string;
  selbst: (a: { datum: string; name: string; app: string }) => string;
}

const ERNEUERUNG_NEUN: Partial<Record<BedienSprache, ErneuerungNeun>> = {
  bg: {
    titel: "Без реклами и безплатно - така трябва да остане.",
    // Ohne Namen: in der Anrede stünde er im Vokativ (Glossar Regel 12). Lehrkraft Вие-Form, ohne Ausrufezeichen.
    lehrkraft: (a: { datum: string; name: string; app: string }) =>
      `Здравейте, на ${a.datum} от този акаунт беше направено дарение за проекта. Тази подкрепа ни помогна ` +
      `да развиваме проекта и да го поддържаме онлайн. След една година отново ви моля да подкрепите този ` +
      `свободен проект, за да може да продължи да работи. Сърдечно благодаря. ` +
      (a.app === "tastenflow"
        ? "Приятно писане и занапред."
        : a.app === "braille" || a.app === "computer"
          ? "Успешни упражнения и занапред."
          : "Всичко хубаво."),
    // Selbstlernende ти, nur Aorist (ohne Geschlecht, Glossar Regel 2).
    selbst: (a: { datum: string; name: string; app: string }) =>
      `Здравей, на ${a.datum} от теб дойде дарение за проекта. Подкрепата ти ни помогна да развиваме ` +
      `проекта и да го поддържаме онлайн. След една година отново те моля да подкрепиш този свободен ` +
      `проект, за да може да продължи да работи. Сърдечно благодаря. ` +
      (a.app === "tastenflow"
        ? "Приятно писане и занапред!"
        : a.app === "braille" || a.app === "computer"
          ? "Успешни упражнения и занапред!"
          : "Всичко хубаво!"),
  },
  el: {
    titel: "Χωρίς διαφημίσεις και δωρεάν - έτσι πρέπει να μείνει.",
    // Ohne Namen: Anrede im Vokativ und mit Artikel verriete das Geschlecht (Glossar Regel 12).
    // Lehrkraft εσείς, ohne Ausrufezeichen. Subjekt ist die Spende, keine Aussage über die Person.
    // Datum nach Doppelpunkt (Glossar Regel 13: Artikel vor Zahlen).
    lehrkraft: (a: { datum: string; name: string; app: string }) =>
      `Γεια σας.Από αυτόν τον λογαριασμό ήρθε μια δωρεά για το έργο (ημερομηνία: ${a.datum}). ` +
      `Αυτή η στήριξη μας βοήθησε να συνεχίσουμε να αναπτύσσουμε το έργο και να το κρατάμε ενεργό στο ` +
      `διαδίκτυο. Μετά από ένα χρόνο σας παρακαλώ ξανά να στηρίξετε αυτό το ελεύθερο έργο, για να μπορεί ` +
      `να συνεχίσει να λειτουργεί. Σας ευχαριστώ θερμά. ` +
      (a.app === "tastenflow"
        ? "Καλή συνέχεια στη δακτυλογράφηση."
        : a.app === "braille" || a.app === "computer"
          ? "Καλή συνέχεια στην εξάσκηση."
          : "Καλή συνέχεια."),
    // Selbstlernende εσύ, höchstens ein Ausrufezeichen.
    selbst: (a: { datum: string; name: string; app: string }) =>
      `Γεια σου. Από σένα ήρθε μια δωρεά για το έργο (ημερομηνία: ${a.datum}). Η στήριξή σου μας ` +
      `βοήθησε να συνεχίσουμε να αναπτύσσουμε το έργο και να το κρατάμε ενεργό στο διαδίκτυο. Μετά από ` +
      `ένα χρόνο σε παρακαλώ ξανά να στηρίξεις αυτό το ελεύθερο έργο, για να μπορεί να συνεχίσει να ` +
      `λειτουργεί. Σε ευχαριστώ θερμά. ` +
      (a.app === "tastenflow"
        ? "Καλή συνέχεια στο γράψιμο!"
        : a.app === "braille" || a.app === "computer"
          ? "Καλή συνέχεια στην εξάσκηση!"
          : "Καλή συνέχεια!"),
  },
  hu: {
    titel: "Reklámmentes és ingyenes - így kell maradnia.",
    // Ohne Namen (Glossar Regel 12/15: Anrede ohne Namen, kein Name mit Endung).
    // Datum nach Doppelpunkt in Klammern - keine Endung an der Zahl.
    // Lehrkraft ohne Anrede bzw. höfliche Form ohne „Ön", ohne Ausrufezeichen im Text.
    lehrkraft: (a: { datum: string; name: string; app: string }) =>
      `Jó napot kívánunk! Erről a fiókról adomány érkezett a projektnek (dátum: ${a.datum}). ` +
      `Ez a támogatás segített abban, hogy a projektet tovább fejlesszük és online tartsuk. ` +
      `Egy év elteltével ismét kérem, hogy támogassa ezt a szabad projektet, hogy tovább működhessen. ` +
      `Szívből köszönöm. ` +
      (a.app === "tastenflow"
        ? "További jó gépelést kívánok."
        : a.app === "braille" || a.app === "computer"
          ? "További jó gyakorlást kívánok."
          : "Minden jót kívánok."),
    // Selbstlernende te, höchstens ein Ausrufezeichen nach dem Gruss und eines am Schluss.
    selbst: (a: { datum: string; name: string; app: string }) =>
      `Szia! Tőled adomány érkezett a projektnek (dátum: ${a.datum}). A támogatásod segített abban, ` +
      `hogy a projektet tovább fejlesszük és online tartsuk. Egy év elteltével ismét kérlek, hogy ` +
      `támogasd ezt a szabad projektet, hogy tovább működhessen. Szívből köszönöm. ` +
      (a.app === "tastenflow"
        ? "Jó gépelést!"
        : a.app === "braille" || a.app === "computer"
          ? "Jó gyakorlást!"
          : "Minden jót!"),
  },
  nl: {
    titel: "Zonder reclame en gratis: dat blijft ons doel.",
    lehrkraft: (a: { datum: string; name: string; app: string }) =>
      `${a.name ? `Hallo ${a.name},` : "Hallo,"} op ${a.datum} heb je ons gesteund met een donatie. ` +
      `Die steun heeft eraan bijgedragen dat we dit project kunnen blijven onderhouden en online kunnen houden. ` +
      `Na een jaar vraag ik je opnieuw om dit vrije project te steunen, zodat het kan blijven bestaan. Hartelijk dank. ` +
      (a.app === "tastenflow"
        ? "En nog veel typplezier."
        : a.app === "braille" || a.app === "computer"
          ? "En nog veel oefenplezier."
          : "Het allerbeste."),
    selbst: (a: { datum: string; name: string; app: string }) =>
      `${a.name ? `Hallo ${a.name},` : "Hallo,"} op ${a.datum} heb je ons gesteund met een donatie. ` +
      `Jouw steun heeft eraan bijgedragen dat we dit project kunnen blijven onderhouden en online kunnen houden. ` +
      `Na een jaar vraag ik je opnieuw om dit vrije project te steunen, zodat het kan blijven bestaan. Hartelijk dank. ` +
      (a.app === "tastenflow"
        ? "En nog veel typplezier!"
        : a.app === "braille" || a.app === "computer"
          ? "En nog veel oefenplezier!"
          : "Het allerbeste!"),
  },
  pt: {
    titel: "Sem publicidade e gratuito: é o nosso compromisso.",
    lehrkraft: (a: { datum: string; name: string; app: string }) =>
      `${a.name ? `Bom dia, ${a.name},` : "Bom dia,"} em ${a.datum} apoiou-nos com uma doação. ` +
      `Esse apoio ajudou-nos a cuidar deste projeto e a mantê-lo disponível na internet. ` +
      `Passado um ano, volto a pedir o seu apoio a este projeto livre, para que possa continuar. ` +
      `Agradeço de coração. ` +
      (a.app === "tastenflow"
        ? "E boa escrita."
        : a.app === "braille" || a.app === "computer"
          ? "E boa prática."
          : "E boa continuação."),
    selbst: (a: { datum: string; name: string; app: string }) =>
      `${a.name ? `Olá, ${a.name},` : "Olá,"} em ${a.datum} apoiaste-nos com uma doação. ` +
      `Esse apoio ajudou-nos a cuidar deste projeto e a mantê-lo disponível na internet. ` +
      `Passado um ano, volto a pedir-te que apoies este projeto livre, para que possa continuar. ` +
      `Agradeço de coração. ` +
      (a.app === "tastenflow"
        ? "E boa escrita!"
        : a.app === "braille" || a.app === "computer"
          ? "E boa prática!"
          : "E boa continuação!"),
  },
  br: {
    titel: "Sem anúncios e de graça: assim deve continuar.",
    lehrkraft: (a: { datum: string; name: string; app: string }) =>
      `${a.name ? `Olá, ${a.name},` : "Olá,"} em ${a.datum} esta conta fez uma doação para o projeto. Esse apoio nos ajudou a continuar desenvolvendo o projeto e a mantê-lo no ar. Passado um ano, peço de novo seu apoio a este projeto livre, para que ele possa continuar funcionando. Agradeço de coração. ` +
      (a.app === "tastenflow"
        ? "Boa digitação."
        : a.app === "braille" || a.app === "computer"
          ? "Boa prática."
          : "Tudo de bom."),
    selbst: (a: { datum: string; name: string; app: string }) =>
      `${a.name ? `Olá, ${a.name},` : "Olá,"} em ${a.datum} você fez uma doação para o projeto. Seu apoio nos ajudou a continuar desenvolvendo o projeto e a mantê-lo no ar. Passado um ano, peço de novo seu apoio a este projeto livre, para que ele possa continuar funcionando. Agradeço de coração. ` +
      (a.app === "tastenflow"
        ? "Boa digitação!"
        : a.app === "braille" || a.app === "computer"
          ? "Boa prática!"
          : "Tudo de bom!"),
  },
  ro: {
    titel: "Fără reclame și gratuit - așa trebuie să rămână.",
    // Anrede ohne Namen (Glossar Regel 12 und §2.12 Mail-Anrede): a.name bleibt ungenutzt.
    lehrkraft: (a: { datum: string; name: string; app: string }) => {
      const schluss =
        a.app === "tastenflow"
          ? "Spor la scris în continuare."
          : a.app === "braille" || a.app === "computer"
            ? "Spor la exersat în continuare."
            : "Toate cele bune.";
      return (
        `Bună ziua, la data de ${a.datum} a sosit din acest cont o donație pentru proiect. Acest sprijin ne-a ajutat ` +
        `să dezvoltăm proiectul în continuare și să îl menținem online. După un an vă rog din nou să susțineți ` +
        `acest proiect liber, ca să poată funcționa în continuare. Vă mulțumesc din inimă. ${schluss}`
      );
    },
    selbst: (a: { datum: string; name: string; app: string }) => {
      const schluss =
        a.app === "tastenflow"
          ? "Spor la scris în continuare!"
          : a.app === "braille" || a.app === "computer"
            ? "Spor la exersat în continuare!"
            : "Toate cele bune!";
      return (
        `Salut, la data de ${a.datum} ai susținut proiectul cu o donație. Sprijinul tău ne-a ajutat să dezvoltăm ` +
        `proiectul în continuare și să îl menținem online. După un an te rog din nou să susții acest proiect liber, ` +
        `ca să poată funcționa în continuare. Îți mulțumesc din inimă. ${schluss}`
      );
    },
  },
  sv: {
    titel: "Utan reklam och kostnadsfritt - så ska det förbli",
    // Lehrkraft: über das Konto, ohne Ausrufezeichen (Glossar Regel 1).
    lehrkraft: (a: { datum: string; name: string; app: string }) =>
      `${a.name ? `Hej ${a.name},` : "Hej,"} den ${a.datum} kom en gåva till projektet från det här kontot. ` +
      `Stödet har hjälpt till att utveckla projektet vidare och hålla det online. Efter ett år ber jag ` +
      `dig än en gång att stödja det här fria projektet, så att det kan fortsätta. Varmt tack. ` +
      (a.app === "tastenflow"
        ? "Fortsatt lycka till med skrivandet."
        : a.app === "braille" || a.app === "computer"
          ? "Fortsatt lycka till med övandet."
          : "Allt gott."),
    selbst: (a: { datum: string; name: string; app: string }) =>
      `${a.name ? `Hej ${a.name},` : "Hej,"} den ${a.datum} gav du en gåva till projektet. ` +
      `Ditt stöd har hjälpt till att utveckla projektet vidare och hålla det online. Efter ett år ber jag ` +
      `dig än en gång att stödja det här fria projektet, så att det kan fortsätta. Varmt tack. ` +
      (a.app === "tastenflow"
        ? "Fortsatt lycka till med skrivandet!"
        : a.app === "braille" || a.app === "computer"
          ? "Fortsatt lycka till med övandet!"
          : "Allt gott!"),
  },
  uk: {
    titel: "Без реклами й безкоштовно - так має залишитися.",
    // Ohne Namen (Vokativ, Glossar Regel 12); Subjekt ist die Spende, keine Vergangenheit über die Person.
    lehrkraft: (a: { datum: string; name: string; app: string }) =>
      `Добрий день! Дата пожертви з цього облікового запису: ${a.datum}. Ця підтримка допомогла нам далі розвивати проєкт і тримати його в мережі. ` +
      `Через рік я знову прошу вас підтримати цей вільний проєкт, щоб він міг працювати далі. Щиро дякую. ` +
      (a.app === "tastenflow"
        ? "Гарного друку й далі."
        : a.app === "braille" || a.app === "computer"
          ? "Гарного тренування й далі."
          : "Усього найкращого."),
    selbst: (a: { datum: string; name: string; app: string }) =>
      `Привіт! Дата твоєї пожертви: ${a.datum}. Твоя підтримка допомогла нам далі розвивати проєкт і тримати його в мережі. ` +
      `Через рік я знову прошу тебе підтримати цей вільний проєкт, щоб він міг працювати далі. Щиро дякую. ` +
      (a.app === "tastenflow"
        ? "Гарного друку й далі!"
        : a.app === "braille" || a.app === "computer"
          ? "Гарного тренування й далі!"
          : "Усього найкращого!"),
  },
};

export function spendenBannerErneuerungText(
  app: string,
  zielgruppe: SpendenBannerZielgruppe,
  sprache: BedienSprache,
  opt: { name?: string | null; gespendetMs: number },
): SpendenErneuerungText {
  // ★ O-CS (03.10.2026): kein Rückfall mehr - jede Sprache hat ihren Zweig.
  const name = (opt.name ?? "").trim();
  const datum = datumFuer(opt.gespendetMs, sprache);
  const neun = ERNEUERUNG_NEUN[sprache];
  if (neun) {
    const a = {
      datum: new Intl.DateTimeFormat(GEBIET[sprache], { day: "2-digit", month: "2-digit", year: "numeric" }).format(
        new Date(opt.gespendetMs),
      ),
      name,
      app,
    };
    return { titel: neun.titel, text: zielgruppe === "lehrkraft" ? neun.lehrkraft(a) : neun.selbst(a) };
  }
  if (sprache === "cs") {
    // ★ O-CS (03.10.2026): OHNE Namen - ein Name in der Anrede stünde im
    // Vokativ ("Honzo"), und der wird aus einem Namen nie gebildet (Glossar
    // Regel 12). Keine Vergangenheit über die Person: Subjekt ist der Dar
    // ("přišel dar"). Lehrkraft "vy", Selbstlernende "ty".
    const titel = "Bez reklam a zdarma - tak to má zůstat.";
    const datumCs = new Intl.DateTimeFormat("cs-CZ", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }).format(new Date(opt.gespendetMs));
    if (zielgruppe === "lehrkraft") {
      const schluss = ERNEUERUNG_SCHLUSS_CS_VY[app] ?? "Ať se vám daří.";
      return {
        titel,
        text:
          `Dobrý den, dne ${datumCs} přišel z tohoto účtu dar na projekt. Tato podpora nám pomohla ` +
          `projekt dál rozvíjet a udržet ho online. Po roce vás znovu prosím o podporu tohoto ` +
          `svobodného projektu, aby mohl dál fungovat. Srdečně děkuji. ${schluss}`,
      };
    }
    const schluss = ERNEUERUNG_SCHLUSS_CS[app] ?? "Ať se ti daří!";
    return {
      titel,
      text:
        `Ahoj, dne ${datumCs} od tebe přišel dar na projekt. Tvoje podpora nám pomohla projekt dál ` +
        `rozvíjet a udržet ho online. Po roce tě znovu prosím o podporu tohoto svobodného projektu, ` +
        `aby mohl dál fungovat. Srdečně děkuji. ${schluss}`,
    };
  }
  if (sprache === "tr") {
    // ★ O-TR (02.10.2026): Lehrkraft "siz", Selbstlernende "sen". Der Name steht
    // als Anruf ohne Endung ("Merhaba Ayşe,", Glossar Regel 6), das Datum vor
    // "tarihinde" - die Endung trägt "tarih", nie die Zahl.
    const titel = "Reklamsız ve ücretsiz: Sözümüz bu.";
    const gruss = name ? `Merhaba ${name},` : "Merhaba,";
    if (zielgruppe === "lehrkraft") {
      const schluss = ERNEUERUNG_SCHLUSS_TR_SIZ[app] ?? "Çalışmalarınızda başarılar.";
      return {
        titel,
        text:
          `${gruss} ${datum} tarihinde bir bağışla bize destek oldunuz. Desteğiniz bu projeyi geliştirmeye ` +
          `ve çevrimiçi tutmaya devam etmemize yardımcı oldu. Aradan bir yıl geçti; bu özgür projenin ` +
          `çalışmaya devam edebilmesi için sizden bir kez daha destek rica ediyorum. Çok teşekkürler. ${schluss}`,
      };
    }
    const schluss = ERNEUERUNG_SCHLUSS_TR[app] ?? "İyi çalışmalar!";
    return {
      titel,
      text:
        `${gruss} ${datum} tarihinde bir bağışla bize destek oldun. Desteğin bu projeyi geliştirmeye ` +
        `ve çevrimiçi tutmaya devam etmemize yardımcı oldu. Aradan bir yıl geçti; bu özgür projenin ` +
        `çalışmaya devam edebilmesi için senden bir kez daha destek rica ediyorum. Çok teşekkürler. ${schluss}`,
    };
  }
  if (sprache === "pl") {
    // ★ O-PL (02.10.2026): OHNE Namen - ein Name in der Anrede stünde im
    // Vokativ („Anno"), und der wird aus einem Namen nie gebildet (Glossar
    // Regel 11: Namen nur im Nominativ). Lehrkraft ohne „Pan/Pani", über das
    // Konto; Selbstlernende „ty" ohne Vergangenheitsform der 2. Person.
    const titel = "Bez reklam i bezpłatnie - tak ma pozostać.";
    if (zielgruppe === "lehrkraft") {
      const schluss = ERNEUERUNG_SCHLUSS_PL_NEUTRAL[app] ?? "Wszystkiego dobrego.";
      return {
        titel,
        text:
          `Dzień dobry, w dniu ${datum} z tego konta wpłynęła darowizna na projekt. To wsparcie pomogło ` +
          `nam dalej rozwijać projekt i utrzymać go w sieci. Po roku proszę jeszcze raz o wsparcie tego ` +
          `wolnego projektu, żeby mógł dalej działać. Serdecznie dziękuję. ${schluss}`,
      };
    }
    const schluss = ERNEUERUNG_SCHLUSS_PL[app] ?? "Wszystkiego dobrego!";
    return {
      titel,
      text:
        `Cześć, w dniu ${datum} wpłynęła od ciebie darowizna na projekt. Twoje wsparcie pomogło nam dalej ` +
        `rozwijać projekt i utrzymać go w sieci. Po roku proszę cię jeszcze raz o wsparcie tego wolnego ` +
        `projektu, żeby mógł dalej działać. Serdecznie dziękuję. ${schluss}`,
    };
  }
  if (sprache === "it") {
    // ★ O-IT: Lehrkraft neutral (kein „Lei", Glossar Regel 1), Selbstlernende
    // „tu"; „Buongiorno"/„Ciao" ohne „caro/cara" - das Geschlecht wird nie aus
    // einem Namen geraten.
    const titel = "Senza pubblicità e gratuito: è il nostro impegno.";
    if (zielgruppe === "lehrkraft") {
      const schluss = ERNEUERUNG_SCHLUSS_IT_NEUTRAL[app] ?? "Buon proseguimento.";
      const gruss = name ? `Buongiorno ${name},` : "Buongiorno,";
      return {
        titel,
        text:
          `${gruss} il ${datum} da questo account è arrivata una donazione per il progetto. Questo sostegno ` +
          `ci ha aiutato a curare il progetto e a mantenerlo online. Dopo un anno chiedo ancora una volta di ` +
          `sostenere questo progetto libero, perché possa continuare. Grazie di cuore. ${schluss}`,
      };
    }
    const schluss = ERNEUERUNG_SCHLUSS_IT[app] ?? "Tanti auguri!";
    const gruss = name ? `Ciao ${name},` : "Ciao,";
    return {
      titel,
      text:
        `${gruss} il ${datum} ci hai sostenuto con una donazione. Il tuo sostegno ci ha aiutato a curare ` +
        `questo progetto e a mantenerlo online. Dopo un anno ti chiedo ancora una volta di sostenere questo ` +
        `progetto libero, perché possa continuare. Grazie di cuore. ${schluss}`,
    };
  }
  if (sprache === "fr") {
    // ★ E11a-5: wie im Deutschen je Zielgruppe - Lehrkraft „vous",
    // Selbstlernende „tu". „Bonjour" ohne „cher/chère": das Geschlecht wird
    // nie aus einem Namen geraten (derselbe Grund wie „Guten Tag" oben).
    const schluss = ERNEUERUNG_SCHLUSS_FR[app] ?? "Et bonne continuation !";
    const gruss = name ? `Bonjour ${name},` : "Bonjour,";
    const titel = "Sans publicité et gratuit : c'est notre engagement !";
    if (zielgruppe === "lehrkraft") {
      return {
        titel,
        text:
          `${gruss} vous nous avez soutenus par un don le ${datum}. Votre soutien nous a aidés à ` +
          `entretenir ce projet et à le garder en ligne. Un an plus tard, je vous demande encore une ` +
          `fois de soutenir ce projet libre pour qu'il puisse continuer. Merci beaucoup ! ${schluss}`,
      };
    }
    return {
      titel,
      text:
        `${gruss} tu nous as soutenus par un don le ${datum}. Ton soutien nous a aidés à entretenir ` +
        `ce projet et à le garder en ligne. Un an plus tard, je te demande encore une fois de ` +
        `soutenir ce projet libre pour qu'il puisse continuer. Merci beaucoup ! ${schluss}`,
    };
  }
  if (sprache === "es") {
    // ★ ES-O: wie bei „fr" - docente „usted", Selbstlernende „tú"; „Hola"
    // ohne „querido/querida" (das Geschlecht wird nie aus einem Namen geraten).
    const gruss = name ? `Hola, ${name}:` : "Hola:";
    const titel = "¡Sin publicidad y gratis: ese es nuestro compromiso!";
    if (zielgruppe === "lehrkraft") {
      const schluss = ERNEUERUNG_SCHLUSS_ES_USTED[app] ?? "¡Y que le vaya muy bien!";
      return {
        titel,
        text:
          `${gruss} el ${datum} nos apoyó con una donación. Su apoyo nos ha ayudado a mantener ` +
          `este proyecto y a tenerlo en línea. Un año después, le pido otra vez que apoye este ` +
          `proyecto libre para que pueda seguir funcionando. ¡Muchas gracias! ${schluss}`,
      };
    }
    const schluss = ERNEUERUNG_SCHLUSS_ES[app] ?? "¡Y que te vaya muy bien!";
    return {
      titel,
      text:
        `${gruss} el ${datum} nos apoyaste con una donación. Tu apoyo nos ha ayudado a mantener ` +
        `este proyecto y a tenerlo en línea. Un año después, te pido otra vez que apoyes este ` +
        `proyecto libre para que pueda seguir funcionando. ¡Muchas gracias! ${schluss}`,
    };
  }
  if (sprache === "en") {
    const schluss = ERNEUERUNG_SCHLUSS_EN[app] ?? "And all the best!";
    const gruss = name ? `Hello ${name},` : "Hello,";
    return {
      titel: "Ad-free and free of charge remains our promise!",
      text:
        `${gruss} you supported us with a donation on ${datum}, and your support has helped us keep ` +
        `maintaining this project and keep it online. After a year, I'd like to ask you once more to ` +
        `support this free project so that it can keep running. Thank you very much! ${schluss}`,
    };
  }
  const schluss = ERNEUERUNG_SCHLUSS_DE[app] ?? "Und alles Gute!";
  if (zielgruppe === "lehrkraft") {
    const gruss = name ? `Guten Tag ${name},` : "Guten Tag,";
    return {
      titel: "Werbefrei und kostenlos bleibt unser Anspruch!",
      text:
        `${gruss} Sie haben uns am ${datum} mit einer Spende unterstützt. Ihre Unterstützung hat dazu ` +
        `beigetragen, dass wir dieses Projekt weiter pflegen und online halten können. Nach einem Jahr ` +
        `bitte ich Sie noch einmal, dieses freie Projekt zu unterstützen, um es weiter betreiben zu ` +
        `können. Herzlichen Dank! ${schluss}`,
    };
  }
  const gruss = name ? `Hallo ${name},` : "Hallo,";
  return {
    titel: "Werbefrei und kostenlos bleibt unser Anspruch!",
    text:
      `${gruss} du hast uns am ${datum} mit einer Spende unterstützt. Deine Unterstützung hat dazu ` +
      `beigetragen, dass wir dieses Projekt weiter pflegen und online halten können. Nach einem Jahr ` +
      `bitte ich dich noch einmal, dieses freie Projekt zu unterstützen, um es weiter betreiben zu ` +
      `können. Herzlichen Dank! ${schluss}`,
  };
}
