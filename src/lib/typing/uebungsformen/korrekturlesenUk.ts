/**
 * ★ D-LERNDATEN (25.10.2026): DIE KORREKTURLESE-FÄLLE des Weges „uk" (Ukrainisch) - gefüllt aus den vorbereiteten Lerndaten.
 *
 * Quelle: iCloud `sprachen-2026-10-25/tf-fest-neu/uk/tf-fest-uk.json`, Schlüssel `unsinnSaetze` (Zuordnung: Rezept
 * Teil D). Geprüft vom unabhängigen Prüfer der PC-Sitzung: `PRUEFBERICHT.md` im selben Ordner (25.10.2026) - Urteil:
 * „Freigabefähig: ja - für den internen Einbau (hinter `?ukrainisch-lehrgang=1`). Für die öffentliche Freigabe von `/uk`: nein, noch nicht“ (Abnahme durch eine Muttersprachlerin und eine Fachperson für traumasensible Arbeit).
 * Übernommen vom Erzeuger-Skript der Etappe D-LERNDATEN im Format von `korrekturlesenCs.ts`, Eintrag für Eintrag in der Reihenfolge der
 * Quelle. Geändert wurde nur Typografie, die keine Tastatur hat (gezählt im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * ⚠️ Eine Lese-Abnahme durch eine Person mit Ukrainisch als Erstsprache steht aus (Prüfbericht; Falle 59).
 *
 * In jedem Satz steht ein falsches, echtes Wort (`falsch`), das im Satz offensichtlich nicht stimmt; `richtig` ist das gemeinte.
 * Ob der Unterschied für eine Sprachausgabe HÖRBAR ist (Johannes 02.09.2026), prüft erst ein Lautschlüssel je Sprache (F8, offen).
 *
 * Verteiler: `korrekturlesen.ts` - liest diese Datei seit G3c; leer hiess Englisch, gefüllt gilt diese Liste (`geruestRueckfall.ts`).
 * Unsichtbar, bis der Schalter `?ukrainisch-lehrgang=1` an ist (Vorgabe AUS). Wächter: `tests/tastenflow-lerndaten-uk.test.ts`
 * (Regeln je Sprache in `tests/helfer/lerndatenNeueWege.ts`).
 *
 * ⚠️ DATENBLATT (`scripts/buendel-aufteilung.ts`): nur `import type`, kein Code.
 */
import type { Korrekturfall } from "./korrekturlesen";

export const KORREKTUR_UK: readonly Korrekturfall[] = [
  { satz: "На сніданок я їм кашу з молотком.", falsch: "молотком", richtig: "молоком" },
  { satz: "Бабуся пече смачні пороги.", falsch: "пороги", richtig: "пироги" },
  { satz: "Мама купила в пекарні свіжий хлів.", falsch: "хлів", richtig: "хліб" },
  { satz: "Бджола сідає на клітку і п'є нектар.", falsch: "клітку", richtig: "квітку" },
  { satz: "Я люблю пити чай з лиманом.", falsch: "лиманом", richtig: "лимоном" },
  { satz: "Кіт тихенько спіймав миску.", falsch: "миску", richtig: "мишку" },
  { satz: "Улітку ми купаємося в теплій норі.", falsch: "норі", richtig: "морі" },
  { satz: "Рибалка спіймав у річці велику ріпу.", falsch: "ріпу", richtig: "рибу" },
  { satz: "Тато сидить у кріслі й читає галету.", falsch: "галету", richtig: "газету" },
  { satz: "На гілці весело співає пляшка.", falsch: "пляшка", richtig: "пташка" },
  { satz: "Коса дає нам смачне молоко.", falsch: "Коса", richtig: "Коза" },
  { satz: "Кінь із задоволенням їсть сито.", falsch: "сито", richtig: "сіно" },
  { satz: "На подвір'ї ґелґоче біла гумка.", falsch: "гумка", richtig: "гуска" },
  { satz: "У зоопарку живе великий сон.", falsch: "сон", richtig: "слон" },
  { satz: "Бабуся в'яже мені теплий шар.", falsch: "шар", richtig: "шарф" },
  { satz: "Перед обідом я мию руки з мулом.", falsch: "мулом", richtig: "милом" },
  { satz: "На столі стоїть ваза з китами.", falsch: "китами", richtig: "квітами" },
  { satz: "Моя сестра грає на скринці.", falsch: "скринці", richtig: "скрипці" },
  { satz: "Дівчинка гладить пухнастого коржика.", falsch: "коржика", richtig: "котика" },
  { satz: "Тато в гаражі ремонтує малину.", falsch: "малину", richtig: "машину" },
  { satz: "Ми купили на ринку свіжі коридори.", falsch: "коридори", richtig: "помідори" },
  { satz: "Над морем літають білі чашки.", falsch: "чашки", richtig: "чайки" },
  { satz: "У небі яскраво світить серце.", falsch: "серце", richtig: "сонце" },
  { satz: "Борщ варять з бураном.", falsch: "бураном", richtig: "буряком" },
  { satz: "На городі виріс великий помаранчевий карапуз.", falsch: "карапуз", richtig: "гарбуз" },
  { satz: "Дідусь п'є гарячий час.", falsch: "час", richtig: "чай" },
  { satz: "Мій брат уважно читає кригу.", falsch: "кригу", richtig: "книгу" },
  { satz: "Я чищу зуби зубною тіткою.", falsch: "тіткою", richtig: "щіткою" },
  { satz: "Великий кіт плаває в океані й пускає фонтан.", falsch: "кіт", richtig: "кит" },
  { satz: "Учитель пише на дощі.", falsch: "дощі", richtig: "дошці" },
  { satz: "На Великдень бабуся пече смачну казку.", falsch: "казку", richtig: "паску" },
  { satz: "Я сплю на м'якій пампушці.", falsch: "пампушці", richtig: "подушці" },
  { satz: "Дідусь ловить рибу дудкою.", falsch: "дудкою", richtig: "вудкою" },
  { satz: "Мама варить смачний зуб.", falsch: "зуб", richtig: "суп" },
  { satz: "Моя улюблена ягода - солодка полиця.", falsch: "полиця", richtig: "полуниця" },
  { satz: "Учні сидять за картами й слухають учительку.", falsch: "картами", richtig: "партами" },
  { satz: "Взимку я вдягаю теплу шафку.", falsch: "шафку", richtig: "шапку" },
  { satz: "На березі моря багато писку.", falsch: "писку", richtig: "піску" },
];
