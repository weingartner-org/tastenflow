/**
 * „Meine Statistik" — die eigene Sicht auf die eigene Auswertung. Jedes Kind sieht
 * genau die Werte, die auch die Lehrkraft über es sieht (Tempo, Treffsicherheit,
 * geübte Zeit, Tasten-Stand, schwächste Tasten). [[feedback_data_transparency]].
 *
 * Bewusst OHNE den Eigenständigkeits-/KI-Check: der ist ein Integritäts-Werkzeug
 * für die Lehrkraft. Einem Kind „Du wirkst wie geschummelt 8/10" anzuzeigen wäre
 * demotivierend und würde zugleich verraten, was den Verdacht auslöst. (Lässt
 * sich über `showSuspicion` einschalten, falls gewünscht.)
 */
import { FilmKnopf } from "@/components/FilmKnopf";
import { useEffect, useRef, useState } from "react";
import {
  TypingAccount,
  computePupilStats,
  emptyProgress,
  speakUi,
  takeFirstBadgeFocusRequest,
  typingBackend,
  zugaenglicherText,
} from "@/lib/typing";
import { PupilData, PupilStatsPanel } from "./PupilStatsPanel";
import { SchreibprobenListe } from "./SchreibprobenListe";
import type { GesperrteZeit } from "@/lib/typing/wochenziel";
import { texte, useBedienSprache } from "@/lib/bedienSprache";
import { useStatistikSchriftTasten } from "@/lib/typing/statistikSchrift";

/**
 * Die Texte von „Meine Statistik" in beiden Bedienungssprachen (EN3,
 * 19.09.2026). Deutsch wortgleich wie vorher. Glossar §3.1: *My statistics* ★,
 * *Loading …* ★. „Üben" ist hier der Weg zurück ins Tippfeld (Alt + U) - kein
 * Knopf mit diesem Namen, darum englisch klein im Satz.
 */
const SELBST_TEXTE = texte({
  de: {
    titel: "Meine Statistik",
    einleitung: "Hier siehst du, wie weit du bist und was sich zu üben lohnt.",
    laedt: "Lädt …",
    leerVor: "Sobald du ein bisschen geübt hast, erscheinen hier deine Werte. Wechsle zu ",
    leerWort: "Üben",
    leerNach: " und leg los!",
  },
  en: {
    titel: "My statistics",
    einleitung: "Here you can see how far you've got and what is worth practising.",
    laedt: "Loading …",
    leerVor: "As soon as you've done a bit of practice, your figures will appear here. Switch to ",
    leerWort: "practice",
    leerNach: " and off you go!",
  },
  fr: {
    titel: "Mes progrès",
    einleitung: "Tu vois ici où tu en es et ce qui vaut la peine d'être exercé.",
    laedt: "Chargement …",
    leerVor: "Dès que tu auras fait quelques exercices, tes chiffres apparaitront ici. Passe à ",
    leerWort: "l'exercice",
    leerNach: " et c'est parti !",
  },
  es: {
    titel: "Mi progreso",
    einleitung: "Aquí ves dónde estás y qué vale la pena practicar.",
    laedt: "Cargando …",
    leerVor: "En cuanto hayas hecho algunos ejercicios, aquí aparecerán tus cifras. Ve a ",
    leerWort: "practicar",
    leerNach: " y ¡a empezar!",
  },
  // ★ O-IT (02.10.2026): „I miei progressi" (Glossar §2.6), das Kind liest „tu".
  it: {
    titel: "I miei progressi",
    einleitung: "Qui vedi a che punto sei e che cosa vale la pena esercitare.",
    laedt: "Caricamento in corso...",
    leerVor: "Appena avrai fatto qualche esercizio, qui compariranno i tuoi numeri. Vai a ",
    leerWort: "esercitarti",
    leerNach: " e comincia!",
  },
  // ★ O-PL (02.10.2026): „Moje postępy" (Glossar §2.6), das Kind liest „ty";
  // „poćwiczysz" (Futur, vollendet) trägt kein Geschlecht.
  pl: {
    titel: "Moje postępy",
    einleitung: "Tu widzisz, jak daleko już jesteś i co warto poćwiczyć.",
    laedt: "Ładowanie...",
    leerVor: "Gdy trochę poćwiczysz, pojawią się tu twoje dane. Przejdź do ",
    leerWort: "ćwiczeń",
    leerNach: " i zaczynaj!",
  },
  // ★ O-TR (02.10.2026): "İlerlemem" (Glossar §2.6), das Kind liest sen;
  // "Açılıyor..." statt "Yükleniyor..." (Glossar Regel 10, wie `seiteNachladen.tsx`).
  tr: {
    titel: "İlerlemem",
    einleitung: "Burada ne kadar ilerlediğini ve neyi çalışmanın faydalı olacağını görürsün.",
    laedt: "Açılıyor...",
    leerVor: "Biraz çalıştıktan sonra değerlerin burada görünecek. ",
    leerWort: "Alıştırma",
    leerNach: " bölümüne geç ve başla!",
  },
  // ★ O-CS (03.10.2026): „Můj pokrok" (Glossar §2.6), das Kind liest ty;
  // „napíšeš" (Zukunft) trägt kein Geschlecht (Regel 2); ein Ausrufezeichen.
  cs: {
    titel: "Můj pokrok",
    einleitung: "Tady vidíš, jak daleko už jsi a co se vyplatí procvičit.",
    laedt: "Načítá se...",
    leerVor: "Jakmile napíšeš pár řádků, objeví se tu tvoje hodnoty. Přejdi na ",
    leerWort: "cvičení",
    leerNach: " a pusť se do toho!",
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      titel: "Моят напредък",
      einleitung: "Тук виждаш докъде стигна и какво си струва да упражняваш.",
      laedt: "Зареждане...",
      leerVor: "Щом се поупражняваш малко, тук ще се появят твоите стойности. Отиди на ",
      leerWort: "Упражнения",
      leerNach: " и започвай!",
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      titel: "Η πρόοδός μου",
      einleitung: "Εδώ βλέπεις πόσο έχεις προχωρήσει και τι αξίζει να εξασκήσεις.",
      laedt: "Φόρτωση...",
      leerVor: "Μόλις κάνεις λίγη εξάσκηση, οι τιμές σου θα εμφανιστούν εδώ. Πήγαινε στην ",
      leerWort: "Εξάσκηση",
      leerNach: " και ξεκίνα!",
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      titel: "Fejlődésem",
      einleitung: "Itt látod, hol tartasz, és mit érdemes gyakorolni.",
      laedt: "Betöltés…",
      leerVor: "Amint gyakoroltál egy kicsit, itt megjelennek az eredményeid. Lépj ide: ",
      leerWort: "Gyakorlás",
      leerNach: " - és rajta!",
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      titel: "Mijn voortgang",
      einleitung: "Hier zie je hoe ver je bent en wat de moeite waard is om te oefenen.",
      laedt: "Laden …",
      leerVor: "Zodra je een beetje hebt geoefend, verschijnen hier je resultaten. Ga naar ",
      leerWort: "Oefenen",
      leerNach: " en begin maar!",
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      titel: "Os meus progressos",
      einleitung: "Aqui vês até onde já chegaste e o que vale a pena praticar.",
      laedt: "A carregar...",
      leerVor: "Assim que praticares um pouco, os teus valores aparecem aqui. Muda para ",
      leerWort: "Praticar",
      leerNach: " e começa!",
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      titel: "Meu progresso",
      einleitung: "Aqui você vê até onde chegou e o que vale a pena praticar.",
      laedt: "Carregando...",
      leerVor: "Assim que você praticar um pouco, seus dados aparecem aqui. Vá para ",
      leerWort: "Praticar",
      leerNach: " e comece!",
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      titel: "Progresul meu",
      einleitung: "Aici vezi cât de departe ai ajuns și ce merită exersat.",
      laedt: "Se încarcă …",
      leerVor: "Imediat ce exersezi puțin, valorile tale apar aici. Treci la ",
      leerWort: "Exersare",
      leerNach: " și începe!",
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      titel: "Mina framsteg",
      einleitung: "Här ser du hur långt du har kommit och vad som är värt att öva på.",
      laedt: "Läser in...",
      leerVor: "Så snart du har övat lite visas dina värden här. Gå till ",
      leerWort: "Öva",
      leerNach: " och sätt igång!",
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      titel: "Мій поступ",
      einleitung: "Тут видно твій поступ і те, що варто потренувати.",
      laedt: "Завантаження...",
      leerVor: "Щойно ти трохи потренуєшся, тут з'являться твої показники. Перейди до розділу ",
      leerWort: "Тренування",
      leerNach: " і починай!",
    },
});

const KEINE_GESPERRTEN_ZEITEN: readonly GesperrteZeit[] = [];

/*
 * ★★ FOKUS-VORLESEN in der Statistik (Johannes 30.08.2026: „extrem wichtig,
 * Medaillen und Begleittext zu lesen").
 *
 * Die Vorlese-Schicht der App sprach hier bisher NICHTS: Sie liest Ansagen
 * und das Übungsfeld, aber kein durchwandertes Element. Ein Kind mit Sehrest,
 * das mit Tab durch seine Abzeichen geht und die App-Stimme (nicht einen
 * Screenreader) nutzt, hörte in der ganzen Statistik nur Stille.
 *
 * Jetzt liest die Stimme beim Fokussieren den zugänglichen Namen des Elements
 * (`zugaenglicherText` - OHNE aria-hidden-Teile, sonst kam der Medaillen-Name
 * doppelt, Befund Johannes am selben Abend). `speakUi` prüft selbst, ob
 * Vorlesen an ist; wer einen echten Screenreader nutzt, hat die App-Stimme
 * aus und hört nichts doppelt.
 */

export function PupilSelfStats({ account }: { account: TypingAccount }) {
  const backend = typingBackend();
  const { sprache, bereichAktiv } = useBedienSprache();
  const t = SELBST_TEXTE[sprache];
  // ★ 29.10.2026: Alt + Plus / Minus / 0 vergrößert die ganze Statistik
  // (eigene Stufe, nicht die der Übungszeile) - siehe `statistikSchrift.tsx`.
  const { wurzel: schrift, ansage: schriftAnsage } = useStatistikSchriftTasten();
  const [data, setData] = useState<PupilData | null>(null);
  const [loading, setLoading] = useState(true);
  /**
   * ★ W3a (18.09.2026): die gesperrten Zeiten DER EIGENEN Klasse - siehe
   * `wochenziel.ts` „Eine Stunde sperren". Kinder lesen das Feld über die
   * viewRule ihrer eigenen Klasse (`account.ts`); ein Selbstlernendes-Konto
   * ohne `classCode` hat keine.
   */
  const [gesperrt, setGesperrt] = useState<readonly GesperrteZeit[]>(KEINE_GESPERRTEN_ZEITEN);
  const titelRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    void (async () => {
      const [progress, events, klasse] = await Promise.all([
        backend.getProgress(account.id),
        backend.getEvents(account.id),
        account.classCode ? backend.getClass(account.classCode) : Promise.resolve(null),
      ]);
      if (!alive) return;
      setData({
        pupil: account,
        progress: progress ?? emptyProgress(),
        events,
        stats: computePupilStats(events),
      });
      setGesperrt(klasse?.gesperrteZeiten ?? KEINE_GESPERRTEN_ZEITEN);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [backend, account]);

  /**
   * ★ Der LETZTE HALT der Fokus-Rangfolge (28.08.2026, §0.5 - Rang 4).
   *
   * Beim Öffnen der Statistik geht der Fokus auf das erste Abzeichen; das
   * Abzeichen-Regal löst die Anforderung selbst ein, sobald es steht
   * (`focusStats.ts`). Es gibt aber einen Fall, in dem es gar nicht gebaut
   * wird: Wer noch nichts geübt hat, sieht statt der Auswertung nur den Satz
   * „Sobald du ein bisschen geübt hast …". Dann wäre die Anforderung nach dem
   * Laden immer noch offen - und der Fokus stünde auf `body`, eine
   * Braillezeile also im Nichts.
   *
   * Darum fragt die Statistik nach dem Laden nach, ob noch etwas offen ist,
   * und setzt den Fokus dann auf ihre eigene Überschrift. Steht das Regal,
   * hat dessen Effekt die Anforderung schon verbraucht (React arbeitet die
   * Effekte der Kinder VOR denen der Eltern ab) - hier geschieht dann nichts,
   * und es gibt keinen zweiten Fokus-Sprung.
   */
  useEffect(() => {
    if (loading) return;
    if (takeFirstBadgeFocusRequest()) titelRef.current?.focus({ preventScroll: true });
  }, [loading]);

  return (
    <div
      className="space-y-4"
      {...schrift}
      onFocus={(e) => {
        const text = zugaenglicherText(e.target as HTMLElement);
        // 300 Zeichen reichen für Name + Zustand; ganze Textblöcke (die
        // Überschrift-Karte selbst) sollen nicht als Schwall kommen.
        // ★ EN3: In Tastenflow spricht die Stimme der BEDIENUNG - der
        // vorgelesene Name ist dann englisch. Sonst genau der Aufruf von vorher.
        if (text) {
          if (bereichAktiv) speakUi(text.slice(0, 300), undefined, undefined, sprache);
          else speakUi(text.slice(0, 300));
        }
      }}
    >
      <div className="card space-y-2 p-4">
        {/* ★ Nr 2 der Fokusziele. 22.08.2026 war diese Überschrift das
            Fokus-Ziel des Ansichtswechsels; am selben Abend hat Johannes das
            geändert (§0.5): Der Fokus geht auf das erste Abzeichen. Die
            Überschrift BLEIBT trotzdem, als Anker mit `tabIndex={-1}` - sie
            ist der letzte Halt der Rangfolge (siehe Effekt oben) und zugleich
            die erste Marke für die Screenreader-Taste „h". */}
        <div className="flex flex-wrap items-center gap-2">
        <h2
          ref={titelRef}
          id="tippen-statistik-titel"
          tabIndex={-1}
          className="m-0 text-lg font-semibold text-ink outline-none"
        >
          {t.titel}
        </h2>
        <FilmKnopf nr="T-S02" />
        </div>
        <p className="m-0 text-sm text-ink-muted">{t.einleitung}</p>
        {loading ? (
          <p role="status" aria-live="polite" className="m-0 text-sm text-ink-muted">
            {t.laedt}
          </p>
        ) : data && data.stats.tasks > 0 ? (
          /*
            ★ Der Slot „tippchallenges" (C4, 11.09.2026): Bis zum Umbau stand
            `SchreibprobenListe` als eigener Kasten AUSSERHALB dieser Karte,
            hinter dem ganzen Panel. Johannes' Reihenfolge braucht sie aber
            ZWISCHEN Abzeichen und Steigerung im Verlauf (Platz 4, seit
            19.09.2026 als eine Ausklappzeile) - darum füllt diese Stelle
            jetzt den Slot, den `PupilStatsPanel` an genau dieser Position
            freilässt. Die Liste lädt weiterhin selbst und gibt `null`
            zurück, solange es keine Schreibprobe gibt.
          */
          <PupilStatsPanel
            data={data}
            showSuspicion={false}
            selfView
            gesperrt={gesperrt}
            tippchallenges={<SchreibprobenListe accountId={account.id} />}
          />
        ) : (
          <p role="status" aria-live="polite" className="m-0 text-sm text-ink-muted">
            {t.leerVor}
            <strong>{t.leerWort}</strong>
            {t.leerNach}
          </p>
        )}
      </div>
      {schriftAnsage}
    </div>
  );
}
