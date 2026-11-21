/*
 * Ersatzteil im Paket „Tastenflow": Das Melde-Fenster der Plattform schickt
 * Meldungen an die Entwicklung der Originalplattform (Server-Regel, Mail,
 * Sammlung). Das gehört nicht ins Paket. Die Kopfzeile bindet die Bausteine
 * weiter ein - sie zeigen hier nichts an.
 *
 * Wer in einem eigenen Betrieb ein Melde-Fenster will, ersetzt diese Datei.
 */
export type MitBild = {
  bild: Blob | null;
  technik: Record<string, unknown>;
};

export function RueckmeldungKnopf(_: { sichtbar: boolean; rund?: boolean }) {
  return null;
}

export function RueckmeldungFenster(_: {
  onSchliessen: () => void;
  vorbelegt?: string;
  mitBild?: MitBild;
}) {
  return null;
}

export function MeldenKnopf() {
  return null;
}
