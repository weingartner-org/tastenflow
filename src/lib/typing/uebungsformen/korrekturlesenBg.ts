/**
 * ★ D-LERNDATEN (25.10.2026): DIE KORREKTURLESE-FÄLLE des Weges „bg" (Bulgarisch) - gefüllt aus den vorbereiteten Lerndaten.
 *
 * Quelle: iCloud `sprachen-2026-10-25/tf-fest-neu/bg/tf-fest-bg.json`, Schlüssel `unsinnSaetze` (Zuordnung: Rezept
 * Teil D). Geprüft vom unabhängigen Prüfer der PC-Sitzung: `PRUEFBERICHT.md` im selben Ordner (25.10.2026) - Urteil:
 * „Freigabefähig: ja - 0 Verstöße bei Reihenfolge, Zeichen und Tippbarkeit, Sperrliste sauber, Mengen gehalten.“
 * Übernommen vom Erzeuger-Skript der Etappe D-LERNDATEN im Format von `korrekturlesenCs.ts`, Eintrag für Eintrag in der Reihenfolge der
 * Quelle. Geändert wurde nur Typografie, die keine Tastatur hat (gezählt im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * ⚠️ Eine Lese-Abnahme durch eine Person mit Bulgarisch als Erstsprache steht aus (Prüfbericht; Falle 59).
 *
 * In jedem Satz steht ein falsches, echtes Wort (`falsch`), das im Satz offensichtlich nicht stimmt; `richtig` ist das gemeinte.
 * Ob der Unterschied für eine Sprachausgabe HÖRBAR ist (Johannes 02.09.2026), prüft erst ein Lautschlüssel je Sprache (F8, offen).
 *
 * Verteiler: `korrekturlesen.ts` - liest diese Datei seit G3c; leer hiess Englisch, gefüllt gilt diese Liste (`geruestRueckfall.ts`).
 * Unsichtbar, bis der Schalter `?bulgarisch-lehrgang=1` an ist (Vorgabe AUS). Wächter: `tests/tastenflow-lerndaten-bg.test.ts`
 * (Regeln je Sprache in `tests/helfer/lerndatenNeueWege.ts`).
 *
 * ⚠️ DATENBLATT (`scripts/buendel-aufteilung.ts`): nur `import type`, kein Code.
 */
import type { Korrekturfall } from "./korrekturlesen";

export const KORREKTUR_BG: readonly Korrekturfall[] = [
  { satz: "Котката гони една малка мечка.", falsch: "мечка", richtig: "мишка" },
  { satz: "Пчелите правят сладък лед.", falsch: "лед", richtig: "мед" },
  { satz: "Рибата плува бързо в ракетата.", falsch: "ракетата", richtig: "реката" },
  { satz: "Мама реже хляба с нос.", falsch: "нос", richtig: "нож" },
  { satz: "Кучето гризе гост под масата.", falsch: "гост", richtig: "кост" },
  { satz: "През зимата навън пада много смях.", falsch: "смях", richtig: "сняг" },
  { satz: "Слагам си топъл шал на вратата.", falsch: "вратата", richtig: "врата" },
  { satz: "Детето чете интересна прическа.", falsch: "прическа", richtig: "приказка" },
  { satz: "Птиците пеят весело в гарата.", falsch: "гарата", richtig: "гората" },
  { satz: "Слънцето грее високо в небцето.", falsch: "небцето", richtig: "небето" },
  { satz: "Конят яде село в обора.", falsch: "село", richtig: "сено" },
  { satz: "Рибарят хвана голяма рима.", falsch: "рима", richtig: "риба" },
  { satz: "Пиша писмо на жаба.", falsch: "жаба", richtig: "баба" },
  { satz: "Вратарят хвана тортата с две ръце.", falsch: "тортата", richtig: "топката" },
  { satz: "На краката си обувам нови обици.", falsch: "обици", richtig: "обувки" },
  { satz: "Звездите свирят през нощта.", falsch: "свирят", richtig: "светят" },
  { satz: "Татко паркира козата пред къщата.", falsch: "козата", richtig: "колата" },
  { satz: "Ям супа с голяма лъжа.", falsch: "лъжа", richtig: "лъжица" },
  { satz: "Сутрин мия зъбите си с пасти.", falsch: "пасти", richtig: "паста" },
  { satz: "На рождения ден духам свещите на торбата.", falsch: "торбата", richtig: "тортата" },
  { satz: "Пожарникарите бързо гасят пазара.", falsch: "пазара", richtig: "пожара" },
  { satz: "Взимам чадър, защото вали дъб.", falsch: "дъб", richtig: "дъжд" },
  { satz: "Котката си ближе лампата.", falsch: "лампата", richtig: "лапата" },
  { satz: "Слагам цветята във вафлата.", falsch: "вафлата", richtig: "вазата" },
  { satz: "Дядо пие сутрин кофа с мляко.", falsch: "кофа", richtig: "кафе" },
  { satz: "В гората живее голям сив влак.", falsch: "влак", richtig: "вълк" },
  { satz: "Слагам учебниците в чашата.", falsch: "чашата", richtig: "чантата" },
  { satz: "Кукерите носят страшни маси.", falsch: "маси", richtig: "маски" },
  { satz: "Учениците седят на чиниите.", falsch: "чиниите", richtig: "чиновете" },
  { satz: "Щъркелът стои на един рак.", falsch: "рак", richtig: "крак" },
  { satz: "Татко цепи дърва с брада.", falsch: "брада", richtig: "брадва" },
  { satz: "Баба плете топли чорапи от вълк.", falsch: "вълк", richtig: "вълна" },
  { satz: "Кравата пасе зелена тръба на поляната.", falsch: "тръба", richtig: "трева" },
  { satz: "Пощальонът носи писма и колене.", falsch: "колене", richtig: "колети" },
  { satz: "На Великден боядисваме шарени яки.", falsch: "яки", richtig: "яйца" },
  { satz: "Моят брат свири на кутия в оркестъра.", falsch: "кутия", richtig: "китара" },
  { satz: "Сложих писмото в плаката и го пуснах в пощата.", falsch: "плаката", richtig: "плика" },
];
