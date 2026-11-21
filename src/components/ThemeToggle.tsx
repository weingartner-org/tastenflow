import { CONTRAST_MODES, CONTRAST_NAMEN_JE_SPRACHE, useContrast, type ContrastMode } from "@/lib/contrast";
import { texte, useBedienSprache } from "@/lib/bedienSprache";
import { MenuKnopf } from "@/components/gemeinsam/MenuKnopf";

/*
 * ★ EN8 (19.09.2026): Der Schalter steht in der Kopfleiste der Rechtstexte
 * (`LegalShell`), und die folgen aus Tastenflow heraus der Bedienungssprache.
 * Ohne aktiven Sprach-Anbieter - also überall ausserhalb von Tastenflow -
 * und in deutscher Bedienung bleibt er Zeichen für Zeichen, wie er war.
 * „Farben und Kontrast" heisst im Englischen EINS (Glossar §3.10), auch wo
 * das Deutsche hier „Kontrast / Farbmodus" sagt.
 */
const T = texte({
  de: {
    name: "Kontrast / Farbmodus",
    hinweis: "Kontrast und Farbmodus der gesamten Plattform",
  },
  en: {
    name: "Colours and contrast",
    hinweis: "Colours and contrast for the whole platform",
  },
  fr: {
    name: "Couleurs et contraste",
    hinweis: "Couleurs et contraste de toute la plateforme",
  },
  es: {
    name: "Colores y contraste",
    hinweis: "Colores y contraste de toda la plataforma",
  },
  it: {
    name: "Colori e contrasto",
    hinweis: "Colori e contrasto per tutta la piattaforma",
  },
  // ★ O-PL (02.10.2026): Glossar §2.8 „Kolory i kontrast".
  pl: {
    name: "Kolory i kontrast",
    hinweis: "Kolory i kontrast całej platformy",
  },
  // ★ O-TR (02.10.2026): "karşıtlık" wie die Windows-Namen (Glossar §2.8), nicht "kontrast".
  tr: {
    name: "Renkler ve karşıtlık",
    hinweis: "Tüm platform için renkler ve karşıtlık",
  },
  // ★ O-CS (03.10.2026): "Barvy a kontrast" (Glossar §2.8).
  cs: {
    name: "Barvy a kontrast",
    hinweis: "Barvy a kontrast celé platformy",
  },
  bg: {
    name: "Цветове и контраст",
    hinweis: "Цветове и контраст на цялата платформа",
  },
  el: {
    name: "Χρώματα και αντίθεση",
    hinweis: "Χρώματα και αντίθεση για όλη την πλατφόρμα",
  },
  hu: {
    name: "Színek és kontraszt",
    hinweis: "Színek és kontraszt az egész platformon",
  },
  nl: {
    name: "Kleuren en contrast",
    hinweis: "Kleuren en contrast van het hele platform",
  },
  pt: {
    name: "Cores e contraste",
    hinweis: "Cores e contraste de toda a plataforma",
  },
  br: {
    name: "Cores e contraste",
    hinweis: "Cores e contraste de toda a plataforma",
  },
  ro: {
    name: "Culori și contrast",
    hinweis: "Culorile și contrastul întregii platforme",
  },
  sv: {
    name: "Färger och kontrast",
    hinweis: "Färger och kontrast för hela plattformen",
  },
  uk: {
    name: "Кольори й контраст",
    hinweis: "Кольори й контраст усієї платформи",
  },
});

/** Plattformweiter Kontrast-/Farbmodus-Schalter — ersetzt den Hell/Dunkel-Toggle. */
export function ThemeToggle({ className = "", symbol = false }: { className?: string; symbol?: boolean }) {
  const { mode, setMode } = useContrast();
  const { sprache } = useBedienSprache();
  const t = T[sprache];
  if (symbol)
    return (
      <span className={className}>
        <MenuKnopf
          symbol="kontrast"
          hinweis={t.name}
          name={t.name}
          ort="unten"
          groesse={36}
          eintraege={CONTRAST_MODES.map((m) => ({
            label: CONTRAST_NAMEN_JE_SPRACHE[sprache]?.[m.id] ?? m.label,
            symbol: m.id === mode ? ("haken" as const) : undefined,
            onClick: () => setMode(m.id),
          }))}
        />
      </span>
    );
  return (
    <select
      aria-label={t.name}
      title={t.hinweis}
      className={`rounded-lg border border-hairline bg-surface-raised px-2 py-1.5 text-sm text-ink ${className}`}
      value={mode}
      onChange={(e) => setMode(e.target.value as ContrastMode)}
    >
      {CONTRAST_MODES.map((m) => (
        <option key={m.id} value={m.id}>
          {CONTRAST_NAMEN_JE_SPRACHE[sprache]?.[m.id] ?? m.label}
        </option>
      ))}
    </select>
  );
}
