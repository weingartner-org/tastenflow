import { useRef, useState } from "react";
import { Modal } from "@/components/Modal";
import { Tipp } from "@/components/Tipp";
import { useBedienSprache } from "@/lib/bedienSprache";
import { dauerText, filmDateien, filmVon, filmeDerApp, type FilmApp, type FilmFuer } from "@/lib/filme";

/**
 * ★ Kleiner Knopf „Film ansehen (1:06)" (17.11.2026) - öffnet den Film in
 * einem Dialog. Nichts spielt von selbst (Ton aus ist der Normalfall).
 * Für Menschen mit Blindheit: „Nur anhören" (Hörfassung) und der aufklappbare
 * Sprechtext. Escape/Schließen gibt den Fokus an den Knopf zurück (`Modal`).
 * Ohne Eintrag in `filme.ts` erscheint nichts.
 */
export function FilmKnopf({ nr }: { nr: string }) {
  const film = filmVon(nr);
  // Die Filme sind deutsch gesprochen - in einer anderen Bedienungssprache gibt es keinen Knopf.
  const { sprache } = useBedienSprache();
  const [offen, setOffen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hoeren, setHoeren] = useState(false);
  const [text, setText] = useState<string | null>(null);
  if (!film || sprache !== "de") return null;
  const d = filmDateien(film);

  const ladeText = () => {
    if (text !== null) return;
    setText("Der Text wird geladen ...");
    fetch(d.txt)
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
      .then(setText)
      .catch(() => setText("Der Text ist gerade nicht erreichbar."));
  };

  return (
    <>
      <Tipp text={`Kurzer Film: ${film.titel}. Mit Untertiteln, Hörfassung und Text.`}>
        {(hinweisId) => (
          <button
            type="button"
            className="btn-secondary btn-toggle btn-umriss"
            aria-haspopup="dialog"
            aria-describedby={hinweisId}
            data-film={film.nr}
            onClick={() => setOffen(true)}
          >
            <span aria-hidden="true">▶ </span>
            Film ansehen ({dauerText(film.dauerSek)})
          </button>
        )}
      </Tipp>
      {offen && (
        <Modal title={`Film: ${film.titel}`} onClose={() => setOffen(false)} size="lg" initialFocus={videoRef}>
          <div className="space-y-3">
            <video ref={videoRef} controls preload="none" className="w-full rounded-lg bg-black" src={d.mp4}>
              <track kind="captions" srcLang="de" label="Deutsch" src={d.vtt} default />
            </video>
            <div>
              <button type="button" className="btn-secondary btn-toggle" aria-expanded={hoeren} onClick={() => setHoeren((h) => !h)}>
                Nur anhören
              </button>
              {hoeren && (
                <audio controls preload="none" className="mt-2 w-full" src={d.hoer} aria-label={`Hörfassung: ${film.titel}`} />
              )}
            </div>
            <details onToggle={(e) => e.currentTarget.open && ladeText()}>
              <summary className="cursor-pointer text-sm font-semibold text-ink">Was im Film gesagt wird</summary>
              <p className="m-0 mt-2 whitespace-pre-line text-sm leading-relaxed text-ink">{text}</p>
            </details>
          </div>
        </Modal>
      )}
    </>
  );
}

/** Abschnitt „Filme" für die Hilfe: alle Filme der App, je einer mit Titel und Knopf. */
export function FilmeListe({ app, fuer }: { app: FilmApp; fuer?: FilmFuer }) {
  const liste = filmeDerApp(app, fuer);
  if (liste.length === 0) return null;
  return (
    <ul role="list" className="m-0 list-none space-y-2 p-0">
      {liste.map((f) => (
        <li key={f.nr} className="flex flex-wrap items-center gap-2 text-sm text-ink">
          <span>{f.titel}</span>
          <FilmKnopf nr={f.nr} />
        </li>
      ))}
    </ul>
  );
}
