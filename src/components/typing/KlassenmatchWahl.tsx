/**
 * ★★★ „Arne lädt gerade ein. Mitmachen oder selbst einladen?" (02.10.2026)
 *
 * Klasse CSS6, 02.10.2026: Mehrere Kinder legten Matches an, während schon
 * eines einlud - drei Matches liefen fast gleichzeitig, und die Klasse zerfiel
 * in kleine Gruppen. Johannes: *„Wer ‚Klassenmatch' drückt, während schon
 * jemand anderes einlädt, wird zuerst gefragt: Arne lädt gerade ein.
 * Mitmachen oder selbst einladen?"* - zwei Knöpfe.
 *
 * ── Zwei Wege, beide gleichwertig ───────────────────────────────────────────
 * „Mitmachen" tritt der Einladung bei (dasselbe wie „Bin dabei"). „Selbst
 * einladen" sagt die offene Einladung für dieses Kind ab und schreibt ein
 * eigenes Match aus. Kein Vorwurf, keine Wertung - beides ist in Ordnung
 * ([[feedback_nie_gegen_das_kind]]). **Escape tut nichts davon** und führt
 * zurück in die Eingabezeile.
 *
 * ── Der Fokus ───────────────────────────────────────────────────────────────
 * Auf „Mitmachen" - der Weg, um den sich die Klasse sammeln soll. Tab führt zu
 * „Selbst einladen". Nach „Mitmachen" übernimmt das Wartefenster den Fokus
 * (seine Überschrift), nach Escape die Eingabezeile.
 *
 * ⚠️ Keine Live-Region: Das Fenster ist ein Dialog (`Modal`, beschriftet über
 * die Überschrift) und wird beim Öffnen vorgelesen. Gesprochen wird die Frage
 * zusätzlich über `speakUi` - sie ist die Antwort auf einen Tastendruck des
 * Kindes, also folgt sie dem App-Vorlesen (anders als die Einladung selbst,
 * die ungefragt kommt und darum immer spricht).
 */
import { htmlLang } from "./htmlLang";
import { useEffect, useRef } from "react";
import { Modal } from "@/components/Modal";
import { speakUi } from "@/lib/typing";
import { focusPracticeField } from "@/lib/typing/focusField";
import { texte, useBedienSprache } from "@/lib/bedienSprache";

/** Die Texte der Rückfrage in allen Bedienungssprachen des Klassenmatchs. */
export const WAHL_TEXTE = texte({
  de: {
    titel: "Klassenmatch",
    frage: (host: string) => `${host} lädt gerade ein. Mitmachen oder selbst einladen?`,
    mitmachen: "Mitmachen",
    selbst: "Selbst einladen",
    escape: "Escape bringt dich zurück zum Üben.",
    anderesKind: "Ein anderes Kind",
  },
  en: {
    titel: "Class Match",
    frage: (host: string) => `${host} is sending an invitation right now. Join in or send your own?`,
    mitmachen: "Join in",
    selbst: "Send my own",
    escape: "Escape takes you back to practice.",
    anderesKind: "Someone else",
  },
  fr: {
    titel: "Match de la classe",
    frage: (host: string) =>
      `${host} lance une invitation en ce moment. Participer ou lancer la tienne ?`,
    mitmachen: "Participer",
    selbst: "Lancer la mienne",
    escape: "Échap te ramène à l'exercice.",
    anderesKind: "Un autre élève",
  },
  es: {
    titel: "Competición de la clase",
    frage: (host: string) => `${host} está enviando una invitación ahora. ¿Participar o enviar la tuya?`,
    mitmachen: "Participar",
    selbst: "Enviar la mía",
    escape: "Esc te lleva de vuelta a practicar.",
    anderesKind: "Otra persona de tu clase",
  },
  it: {
    titel: "Gara di classe",
    frage: (host: string) => `${host} sta mandando un invito proprio ora. Partecipare o mandare il tuo?`,
    mitmachen: "Partecipa",
    selbst: "Manda il mio",
    escape: "Esc ti riporta all'esercizio.",
    anderesKind: "Un'altra persona della tua classe",
  },
  // ★ O-PL (02.10.2026): Name als Subjekt im Präsens (Glossar Regel 11).
  pl: {
    titel: "Wyścig klasowy",
    frage: (host: string) =>
      `${host} właśnie zaprasza do wyścigu. Dołączyć czy wysłać własne zaproszenie?`,
    mitmachen: "Dołącz",
    selbst: "Wyślij własne zaproszenie",
    escape: "Klawisz Esc przenosi cię z powrotem do ćwiczeń.",
    anderesKind: "Inna osoba z twojej klasy",
  },
  // ★ O-TR (02.10.2026): Name ohne Endung nach Doppelpunkt ("Davet eden: Ali.",
  // Glossar §1 Regel 6); "Sınıftan biri" (§2.11).
  tr: {
    titel: "Sınıf Maçı",
    frage: (host: string) =>
      `Davet eden: ${host}. Katılmak mı istersin, yoksa kendin mi davet edersin?`,
    mitmachen: "Katıl",
    selbst: "Kendin davet et",
    escape: "Esc tuşu seni alıştırmaya geri götürür.",
    anderesKind: "Sınıftan biri",
  },
  // ★ O-CS (03.10.2026): Name als Subjekt im Präsens (Glossar Regel 12), Knöpfe
  // im Infinitiv bzw. als Hauptwort (höchstens 16 Zeichen, Regel 14).
  cs: {
    titel: "Třídní závod",
    frage: (host: string) =>
      `${host} právě zve do závodu. Přidat se, nebo poslat vlastní pozvánku?`,
    mitmachen: "Přidat se",
    selbst: "Vlastní pozvánka",
    escape: "Klávesou Esc se vrátíš ke cvičení.",
    anderesKind: "Někdo z tvé třídy",
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      titel: "Състезание в класа",
      frage: (host: string) => `${host} кани в момента. Ще се включиш ли, или ще изпратиш своя покана?`,
      mitmachen: "Включи се",
      selbst: "Изпрати покана",
      escape: "Esc те връща към упражненията.",
      anderesKind: "Някой друг",
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      titel: "Αγώνας τμήματος",
      frage: (host: string) => `Πρόσκληση από: ${host}. Θέλεις να μπεις ή να στείλεις δική σου πρόσκληση;`,
      mitmachen: "Συμμετοχή",
      selbst: "Δική μου πρόσκληση",
      escape: "Με το Esc επιστρέφεις στην εξάσκηση.",
      anderesKind: "Ένα άλλο παιδί",
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      titel: "Osztályverseny",
      frage: (host: string) => `${host} most küld meghívót. Csatlakozol, vagy saját meghívót küldesz?`,
      mitmachen: "Csatlakozás",
      selbst: "Saját meghívó",
      escape: "Az Esc billentyű visszavisz a gyakorláshoz.",
      anderesKind: "Valaki más",
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      titel: "Klassenwedstrijd",
      frage: (host: string) => `${host} nodigt nu uit. Meedoen of zelf uitnodigen?`,
      mitmachen: "Meedoen",
      selbst: "Zelf uitnodigen",
      escape: "Met Escape ga je terug naar het oefenen.",
      anderesKind: "Iemand anders",
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      titel: "Corrida da turma",
      frage: (host: string) => `${host} está a enviar um convite neste momento. Participar ou enviar o teu?`,
      mitmachen: "Participar",
      selbst: "Enviar o meu",
      escape: "Esc leva-te de volta à prática.",
      anderesKind: "Outra pessoa",
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      titel: "Competição da turma",
      frage: (host: string) => `${host} está convidando agora. Participar ou enviar o seu próprio convite?`,
      mitmachen: "Participar",
      selbst: "Enviar meu convite",
      escape: "Esc leva você de volta à prática.",
      anderesKind: "Outra pessoa",
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      titel: "Întrecerea clasei",
      frage: (host: string) => `${host} trimite chiar acum o invitație. Participi sau trimiți propria invitație?`,
      mitmachen: "Particip",
      selbst: "Invitația mea",
      escape: "Tasta Esc te duce înapoi la exersare.",
      anderesKind: "O persoană din clasă",
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      titel: "Klasstävlingen",
      frage: (host: string) => `${host} bjuder in just nu. Vill du vara med eller bjuda in själv?`,
      mitmachen: "Var med",
      selbst: "Bjud in själv",
      escape: "Escape tar dig tillbaka till övningen.",
      anderesKind: "Någon annan",
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      titel: "Перегони класу",
      frage: (host: string) => `${host} зараз запрошує. Приєднатися чи запросити самостійно?`,
      mitmachen: "Приєднатися",
      selbst: "Запросити самостійно",
      escape: "Esc повертає до тренування.",
      anderesKind: "Хтось із класу",
    },
});

export interface KlassenmatchWahlProps {
  /** Wer gerade einlädt. */
  hostName: string;
  /** „Mitmachen". */
  onMitmachen: () => void;
  /** „Selbst einladen". */
  onSelbst: () => void;
  /** Escape - nichts tun, zurück zum Üben. */
  onSchliessen: () => void;
}

export function KlassenmatchWahl({
  hostName,
  onMitmachen,
  onSelbst,
  onSchliessen,
}: KlassenmatchWahlProps) {
  const mitmachenRef = useRef<HTMLButtonElement>(null);
  const { spracheGewaehlt: sprache, bereichAktiv } = useBedienSprache();
  const t = WAHL_TEXTE[sprache];
  const satz = t.frage(hostName.trim() || t.anderesKind);

  useEffect(() => {
    if (bereichAktiv) speakUi(satz, undefined, undefined, sprache);
    else speakUi(satz);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const schliessen = () => {
    onSchliessen();
    window.setTimeout(() => focusPracticeField(), 0);
  };

  return (
    <Modal title={t.titel} onClose={schliessen} initialFocus={mitmachenRef}>
      <div className="space-y-3" lang={htmlLang(sprache)}>
        <p className="m-0 text-lg text-ink" data-match-wahl>
          {satz}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            ref={mitmachenRef}
            className="btn-primary"
            // Fokusziel: die Überschrift des Wartefensters, das gleich an
            // dieser Stelle steht (`KlassenmatchLobby` setzt ihn selbst).
            onClick={onMitmachen}
          >
            {t.mitmachen}
          </button>
          <button
            type="button"
            className="btn-ghost"
            // Fokusziel: ebenfalls das Wartefenster - das eigene, sobald der
            // Server das Match angelegt hat; scheitert es, die Eingabezeile
            // mit der Meldung darüber.
            onClick={() => {
              onSelbst();
              focusPracticeField();
            }}
          >
            {t.selbst}
          </button>
        </div>
        <p className="m-0 text-base text-ink">{t.escape}</p>
      </div>
    </Modal>
  );
}
