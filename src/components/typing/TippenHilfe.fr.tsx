/**
 * ★★★ E11b (26.09.2026): LA FENÊTRE D'AIDE POUR LES ÉLÈVES, EN FRANÇAIS.
 * ===========================================================================
 * NEU AUS DER FUNKTION GESCHRIEBEN (Bauplan D4/§9.1) - nicht Satz für Satz
 * aus `TippenHilfe.tsx` übersetzt: Was braucht ein Kind oder eine
 * selbstlernende Person an dieser Stelle, um „Tastenflow" zu verstehen.
 * Struktur (Abschnitte, `detail`-Stufen, `isAdult`/`jugend`-Fälle) folgt eng
 * der ENGLISCHEN Fassung (`TippenHilfe.en.tsx`) - beide Sprachen haben
 * denselben Grund, den „Zum Anhören: die Einführung 🎧"-Abschnitt aus dem
 * Deutschen wegzulassen: Es gibt in der französischen Bedienung keinen
 * Einführungs-Podcast (Bauplan §6.1: „Podcasts: 0", wie bei Englisch).
 *
 * ── ANREDE (F9) ─────────────────────────────────────────────────────────────
 * Immer <strong>tu</strong> - Kinder UND Selbstlernende (F9), anders als im
 * Deutschen gibt es hier keine du/Sie-Unterscheidung nach Alter. Das macht
 * diese Fassung einfacher als die deutsche: keine `isFormal`/`sie`-Rechnung.
 *
 * ── WAS BEWUSST STATISCH BLEIBT (NOCH NICHT VON „FR" ABHÄNGIG) ─────────────
 * Diese Datei hängt nur an Bausteinen, die „fr" schon wirklich kennen
 * (`layoutLetterOrder("fr")` über `FR_LETTER_ORDER`, `PRUEFUNG_WORT_FR`).
 * Was eine ANDERE Etappe noch bauen muss, bleibt in dieser Fassung bewusst
 * ALLGEMEIN statt falsch-präzise:
 *  · Abzeichen (`ABZEICHEN_FR` gibt es noch nicht, E10a) - hier ohne
 *    Eigennamen beschrieben, nicht erfunden.
 *  · Die Zahl der Lektionen/`lektionenFuer("fr")` fällt heute auf die
 *    ENGLISCHE Lektionsliste zurück (`curriculum.ts`, TODO FR E10) - darum
 *    wird hier keine Lektionszahl genannt.
 *  · Tastaturname/-hinweis: der Text beschreibt AZERTY allgemein. (★ E11a-5:
 *    `layoutTexte` kennt „fr" inzwischen - der Abschnitt könnte die Namen
 *    jetzt aus dem Code ziehen; bewusst unverändert gelassen.)
 *  · Das Plakat zum Aufhängen gibt es seit E15 auf Französisch
 *    (`tastenflow-plakat-fr.pdf`) - seit 28.09.2026 lädt der Abschnitt es
 *    (`PlakatAbschnitt`, wie `TippenHilfe.es.tsx`); vorher sagte er noch
 *    „n'existe pas encore".
 *  · ★ E11a-5: `RundgangNochmalKnopf` zeigt seit dem Einschalten (die
 *    Bedienung reicht „fr" durch) französisch - die frühere Lücke aus
 *    BEFUND-2026-09-26-E11B-HILFE.md ist zu.
 *
 * Glossar §9.2 wörtlich: *le Défi*, *rangée de base*, *l'Expédition*,
 * *la Banquise*. Nur Bindestrich, gerade Anführungszeichen, kein Point
 * médian, keine Maus-Wörter, Person zuerst.
 */
import { JawsRueckweg } from "./ScreenreaderHinweis";
import { useRef } from "react";
import {
  EINSTIEGSFENSTER_MIN,
  PRUEFUNG_WORT_FR,
  PRUEFUNG_WORT_MEHRZAHL_FR,
  layoutLetterOrder,
  skinForStufe,
  unitGlyph,
} from "@/lib/typing";
import { useFocusTrap } from "./useFocusTrap";
import { Zeichenerklaerung } from "@/lib/arbeitsblatt/Zeichenerklaerung";
import { AltText, Kbd, Section, detailFor, type TippenHilfeProps } from "./TippenHilfeTeile";
import { AltOderWahl, WeitereTasten } from "./TippenHilfeTasten";
// ★ Z4 (19.09.2026): „Rundgang noch einmal" - siehe Kopf-Doku, zeigt noch Englisch.
import { RundgangNochmalKnopf } from "./Rundgang";
import { hoehleHatWesen } from "@/lib/typing/expedition/texts";
import { downloadAdresse, groesse, handbuchInSprache, tastenflowPlakat } from "@/lib/lernwerkstatt/handbuecher";

export function TippenHilfeFranzoesisch({ open, onClose, stufe, lernweg = "fr" }: TippenHilfeProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  useFocusTrap(open, cardRef, { initialFocus: closeRef });
  if (!open) return null;

  const skin = skinForStufe(stufe);
  const isAdult = skin === "erwachsen";
  const kind = skin === "kind";
  const detail = detailFor(stufe);
  // ★ `layoutLetterOrder` kennt „fr" wirklich (FR_LETTER_ORDER, A2) - anders
  // als Lektionen oder Tastatur-Beschriftungen (siehe Kopf-Doku).
  const letters = layoutLetterOrder(lernweg);
  // ★ 28.09.2026: das Höhlenwesen (deutsche Aufnahmen) gibt es nur auf Weg „de".
  const hoehleMitWesen = hoehleHatWesen(lernweg);
  const ringWort = kind ? "niveau de jeu" : "niveau";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Aide pour Tastenflow"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        className="card my-8 w-full max-w-2xl space-y-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="m-0 text-xl font-semibold text-ink">Aide - comment marche "Tastenflow"</h2>
          <button
            ref={closeRef}
            type="button"
            className="btn-secondary btn-toggle"
            onClick={onClose}
            aria-label="Fermer l'aide"
          >
            ✕ Fermer
          </button>
        </div>

        <RundgangNochmalKnopf onStart={onClose} />

        <Section title="Écris, tout simplement">
          <p className="m-0">
            Tu n'as rien à sélectionner d'abord. Écris tout de suite - la
            première lettre va directement dans le champ. Si tu te retrouves
            ailleurs, <Kbd>Alt</Kbd> + <Kbd>E</Kbd> te ramène tout de suite au
            champ d'exercice.
          </p>
          <JawsRueckweg weg="fr" />
          {detail === 1 && (
            <p className="m-0">
              Écris toujours avec le bon doigt - le clavier en bas te montre
              quelle touche vient ensuite. Appuie deux fois vite sur{" "}
              <Kbd>Maj</Kbd> pour entendre quel doigt utiliser.
            </p>
          )}
        </Section>

        <Section title="Les signes dans le texte">
          <Zeichenerklaerung
            titel={null}
            zeichen={[
              { zeichen: "·", bedeutung: "sépare deux informations qui vont ensemble - comme une virgule." },
              { zeichen: "→", bedeutung: "ensuite, ou : ça devient ceci." },
              { zeichen: "⏱", bedeutung: "ton temps d'exercice jusqu'ici." },
              {
                zeichen: "↵",
                bedeutung:
                  "apparait à la fin d'une ligne quand ta classe a activé ce réglage - tu termines alors la ligne avec la touche Entrée.",
              },
            ]}
          />
        </Section>

        <Section title="Récolter des étoiles 🌟">
          <p className="m-0">
            Après chaque série, tu reçois <strong>de 1 à 3 étoiles</strong> -
            chacune avec son propre son.{" "}
            <strong>Peu d'erreurs compte bien plus que la vitesse :</strong>{" "}
            écrire calmement et avec soin rapporte des étoiles de façon sûre -
            se précipiter et taper beaucoup de mauvaises touches, non.
            {kind ? " Tout le monde peut gagner des étoiles !" : ""}
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Tu obtiens 3 étoiles pour une très bonne série - écrite avec
              soin et à une vitesse correcte, et <strong>soigné</strong>{" "}
              compte toujours plus que <strong>rapide</strong>. Si tu
              enchaines les bonnes séries un moment, tu peux monter d'un{" "}
              <strong>niveau de difficulté</strong> - et la récompense sonne
              alors un peu différemment.
            </p>
          )}
        </Section>

        <Section title="Récolter des badges 🏅">
          <p className="m-0">
            Pour des réussites particulières, tu gagnes des{" "}
            <strong>badges</strong> - par exemple pour une série sans la
            moindre erreur, ou pour plusieurs séries propres d'affilée.
            Quand tu gagnes un nouveau badge, tu entends son propre{" "}
            <strong>"ta-da"</strong> et son nom est annoncé.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Tous tes badges sont dans <strong>"Mes progrès"</strong>,
              juste après tes objectifs de la semaine et tes chiffres - c'est
              là aussi que tu trouves toujours ton{" "}
              <strong>prochain objectif</strong>. La plupart des badges
              récompensent le fait d'<strong>écrire avec soin</strong> et de{" "}
              <strong>persévérer</strong> - pas de se précipiter. Et quelques-uns
              sont <strong>secrets</strong> : ce qui les débloque n'est écrit
              nulle part - ils apparaissent, c'est tout.
            </p>
          )}
          {detail >= 2 && (
            <p className="m-0">
              C'est là aussi que tu trouves ton <strong>score</strong> : plus
              tu écris avec soin et régularité, plus il monte.
            </p>
          )}
          {detail >= 2 && (
            <p className="m-0">
              Plus bas, "Progrès dans le temps" (une ligne à déplier)
              montre une petite courbe.
            </p>
          )}
          <p className="m-0">
            Astuce : choisis un badge dans tes statistiques pour l'ouvrir en{" "}
            <strong>grand</strong> - avec des étincelles et des confettis.
          </p>
        </Section>

        {skin === "jugend" && (
          <Section title="Après une nouvelle touche">
            <p className="m-0">
              Une <strong>nouvelle touche</strong> est à toi dès que tu
              maitrises les précédentes - tu n'as rien à gagner pour l'avoir.
              Ça se fête, et tu continues. C'est tout.
            </p>
            <p className="m-0">
              Si tu veux, un petit jeu peut suivre : <strong>le jeu de la
              banquise</strong>. Tu le choisis toi-même - dans les{" "}
              <strong>réglages</strong> (<AltText>Alt + O</AltText>), sous{" "}
              <strong>Jeu de récompense</strong>. Par défaut, c'est{" "}
              <strong>Aucun</strong>. Ce réglage vaut pour cet appareil.
            </p>
          </Section>
        )}

        {!isAdult && (
          <Section title="Le jeu de la banquise 🐧">
            {skin === "jugend" ? (
              <>
                <p className="m-0">
                  Tu peux <strong>le lancer toi-même à tout moment</strong> -
                  avec le bouton <strong>Jouer</strong> dans la ligne sous le
                  champ d'exercice. Le manchot saute de banquise en banquise,
                  grimpe la montagne de lettres et redescend en glissant sur
                  le ventre - toujours avec les touches qui te posent le plus
                  de difficulté en ce moment. En chemin, des{" "}
                  <strong>poissons bonus</strong> sautent hors de l'eau (tape
                  leur touche à temps et tu l'as attrapé - le rater n'est
                  jamais une erreur), et dans la <strong>grotte de
                  l'écho</strong>, chaque touche n'est qu'annoncée. Le jeu ne{" "}
                  <strong>compte pas</strong> comme temps d'exercice et n'est
                  pas nécessaire pour débloquer de nouvelles touches - mais il
                  a ses propres badges.
                </p>
                <p className="m-0">
                  Après une nouvelle touche, il ne démarre{" "}
                  <strong>que</strong> si tu l'as choisi comme{" "}
                  <strong>jeu de récompense</strong> dans les réglages. Sinon,
                  rien ne t'interrompt - c'est toi qui décides quand jouer.
                </p>
              </>
            ) : (
              <>
                <p className="m-0">
                  Quand tu as une <strong>nouvelle touche</strong>, le jeu de
                  la banquise t'attend pour fêter ça : aide le manchot à
                  traverser l'eau - appuie toujours sur la touche de la
                  prochaine banquise ! Parfois, tu grimpes même ensuite la{" "}
                  <strong>montagne de lettres</strong> et tu redescends en
                  glissant sur le ventre. La nouvelle touche est déjà à toi
                  avant même de jouer - le jeu est la récompense, pas une
                  obligation.
                </p>
                <p className="m-0">
                  Tu peux aussi <strong>lancer le jeu toi-même à tout
                  moment</strong> - avec le bouton <strong>Jouer</strong> en
                  haut de ta carte d'exercice, juste à côté de l'anneau.
                  C'est la grande <strong>aventure</strong> : elle change un peu
                  chaque jour, des <strong>poissons bonus</strong>{" "}
                  sautent en chemin (appuie vite sur leur touche pour les
                  attraper), et dans la <strong>grotte de l'écho</strong>, tu
                  ne vois aucune lettre -{" "}
                  {hoehleMitWesen ? (
                    <>
                      la grotte te <strong>dit</strong> chaque touche.
                    </>
                  ) : (
                    <>
                      chaque touche sonne, et le lecteur d'écran ou la plage
                      braille te <strong>dit</strong> laquelle.
                    </>
                  )}{" "}
                  C'est juste pour le
                  plaisir et ça ne <strong>compte pas</strong> comme temps
                  d'exercice - mais il y a des badges à la clé !
                </p>
                {detail >= 2 && (
                  <p className="m-0">
                    Pas d'inquiétude : si une banquise coule ou que tu
                    glisses sur la montagne, le manchot revient à la nage
                    tout simplement - tu peux réessayer aussitôt, autant de
                    fois que tu veux. Et si tu traverses toute l'aventure
                    sans une seule éclaboussure, tu verras{" "}
                    <strong>les aurores boréales</strong> danser au-dessus de
                    l'igloo !
                  </p>
                )}
              </>
            )}
          </Section>
        )}

        <Section title="Que signifie l'anneau avec le chiffre ?">
          <p className="m-0">
            Le chiffre dans l'anneau, c'est ton <strong>{ringWort}</strong>.{" "}
            <strong>Les points, c'est ce que tu gagnes en t'exerçant :</strong>{" "}
            tu en reçois quelques-uns à chaque série, et l'anneau se remplit.
            Quand il est plein (100 points), tu montes d'un {ringWort}. C'est
            juste pour collectionner, ça ne rend <strong>pas</strong>{" "}
            l'exercice plus difficile - comme des points dans un jeu.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Ne confonds pas avec le <strong>niveau de difficulté
              (1-50)</strong> : il indique à quelle vitesse tu devrais
              écrire, et il s'ajuste à toi <strong>tout seul</strong> - il
              monte quand ça va bien et redescend quand c'est trop dur.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0">
              Et l'<strong>âge des textes</strong> décide seulement de la
              difficulté des mots et des phrases - pour aller avec ton âge.
              Dans une classe, ton enseignant ou ton enseignante le règle
              pour tout le monde ; sans classe, tu le trouves en haut dans
              les réglages ⚙. Donc trois choses différentes : le{" "}
              <em>{ringWort}</em> = les points, le{" "}
              <em>niveau de difficulté</em> = la vitesse attendue, l'
              <em>âge des textes</em> = ton âge.
            </p>
          )}
        </Section>

        <Section title={detail === 1 ? "À quelle fréquence s'exercer ?" : "Temps d'exercice et objectif de la semaine"}>
          {detail === 1 ? (
            <p className="m-0">
              Mieux vaut s'exercer <strong>un peu et souvent</strong> qu'une
              seule fois très longtemps - par exemple quelques minutes
              plusieurs jours de suite. Dans la ligne sous le champ
              d'exercice, une horloge compte combien de temps tu as écrit
              aujourd'hui ; ce même temps remplit aussi l'<strong>anneau</strong>{" "}
              qui s'y trouve - ton objectif de la semaine.
            </p>
          ) : (
            <p className="m-0">
              Avec un compte, tu peux avoir un{" "}
              <strong>objectif de la semaine</strong> : un nombre de{" "}
              <strong>minutes par semaine</strong>. Dans une classe, ton
              enseignant ou ton enseignante le règle ; sans classe, tu le
              règles toi-même dans les réglages ⚙, sous "Mon objectif de la
              semaine" - un nouvel objectif s'applique à partir du lundi
              suivant. La semaine commence <strong>le lundi à 8 h</strong> et
              se termine le lundi suivant à 8 h. Dans la ligne sous le champ
              d'exercice, ta progression s'affiche comme un{" "}
              <strong>anneau</strong>, par exemple "25 sur 60 min" - une
              fois l'objectif atteint, il est plein et coché. Parfois, il y a
              aussi des minutes manquées d'une semaine précédente à{" "}
              <strong>rattraper</strong> ; le nombre est alors indiqué à
              côté. Quand tu atteins ton objectif de la semaine, une courte
              fenêtre s'ouvre pour te féliciter - ensuite tu peux continuer à
              t'exercer quand tu veux.
            </p>
          )}
        </Section>

        <Section title="Réglages ⚙ dans l'en-tête">
          <p className="m-0">
            Tous les réglages sont derrière le bouton{" "}
            <strong>⚙ Réglages</strong> tout en haut, juste à gauche du
            bouton rond avec ton initiale : <strong>Qu'est-ce que tu
            exerces ?</strong>, <strong>Textes</strong> (âge et langue),{" "}
            <strong>Clavier</strong>, <strong>Son</strong> et{" "}
            <strong>Lecture à voix haute</strong>. Appuie une fois pour les
            ouvrir, encore une fois pour les fermer - ou utilise{" "}
            <Kbd>Alt</Kbd> + <Kbd>O</Kbd>, qui marche aussi en pleine
            écriture. Quand ils s'ouvrent, le curseur y saute directement ;
            quand ils se ferment, il revient au champ d'exercice.
          </p>
          <p className="m-0">
            En haut des réglages se trouve <strong>"Qu'est-ce que tu
            exerces ?"</strong> : les trois façons de t'exercer,{" "}
            <strong>Mon entrainement</strong>, <strong>Histoires</strong> et{" "}
            <strong>Jeux de lettres</strong>. <Kbd>Alt</Kbd> + <Kbd>B</Kbd>{" "}
            passe à la suivante, et le nouveau choix est annoncé.
          </p>
          <p className="m-0">
            Le bouton rond avec le globe, dans l'en-tête, change
            la langue de Tastenflow - boutons, menus et aussi tes textes
            d'exercice ; ensuite tu peux changer la langue des textes seule,
            sous <strong>Textes</strong>, sauf si ton enseignant ou ton
            enseignante l'a déjà réglée.
          </p>
          <p className="m-0">
            Sous <strong>Clavier</strong>, tu choisis le clavier que tu as
            vraiment devant toi : AZERTY français, AZERTY belge,
            suisse-romand ou canadien. Le clavier à l'écran et les
            indications de doigts s'y ajustent ensuite - et tu ne reçois que
            les caractères qui existent sur ce clavier. Sur AZERTY, les
            chiffres et le point demandent la touche Maj.
          </p>
          <p className="m-0">
            C'est aussi là que tu trouves <strong>"Écrire d'une seule
            main"</strong> - pour qui écrit d'une seule main :
            les majuscules et les caractères comptent alors avec n'importe
            quelle touche Maj. Dans une classe, ton enseignant ou ton
            enseignante règle cela.
          </p>
          <p className="m-0">
            Avec <strong>"Grand espacement des caractères (CVI)"</strong>,
            tout sauf le champ où tu écris (la ligne d'exercice ou la zone de
            jeu) s'assombrit pendant que tu écris ; après 5 secondes sans
            frappe, tout redevient clair. La ligne d'exercice avance à ton
            propre rythme au lieu de sauter. Tu règles toi-même l'espacement
            des caractères dans les réglages ⚙ à tout moment - dans une classe,
            ton enseignant ou ton enseignante peut aussi le régler ; c'est le
            dernier choix qui s'applique.
          </p>
          <p className="m-0">
            Avec <strong>Entrainement ciblé</strong>, tu peux choisir jusqu'à 8 touches ou caractères qui reviennent particulièrement souvent dans les séries - dans les réglages sous <strong>Qu'est-ce que tu exerces ?</strong> ou avec <Kbd>Alt</Kbd> + <Kbd>2</Kbd>. Dans une classe, c'est ton enseignant qui le règle.
          </p>
        </Section>

        <Section title="Lecture à voix haute - l'application te lit">
          <p className="m-0">
            Avec <strong>🗣 Lecture à voix haute</strong> (ou <Kbd>Alt</Kbd> +{" "}
            <Kbd>V</Kbd>), l'application te lit - pour les personnes qui
            n'utilisent pas (encore) de lecteur d'écran. En haut des réglages
            ⚙, tu choisis si les <strong>lettres</strong> (épellation), les{" "}
            <strong>mots</strong> et/ou les <strong>phrases</strong> sont lus
            à voix haute, et à quelle vitesse.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Sous <strong>"Voix"</strong>, tu peux choisir une autre voix.
              Si la langue est le <strong>français</strong>, l'application
              cherche automatiquement une voix française ; s'il n'y en a pas
              d'installée, un court guide te montre comment en ajouter une.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0">
              Ne t'inquiète pas pour ta vitesse : le{" "}
              <strong>temps de lecture est retiré du calcul</strong> -
              attendre une annonce ne ralentit pas ta vitesse.
            </p>
          )}
        </Section>

        <Section title="La mélodie en tapant 🎵">
          <p className="m-0">
            La <strong>mélodie en tapant</strong> sert à t'entrainer à un <strong>rythme de frappe régulier</strong> - et elle doit surtout être <strong>amusante</strong>. Chaque touche juste joue la note suivante d'un air ; si tu restes en rythme, un groupe se joint même à toi.
          </p>
          <p className="m-0">
            Qui tape régulièrement devient aussi plus fluide sur ses touches les plus faibles : le rythme te porte à travers les passages où tu hésiterais sinon.
          </p>
          <p className="m-0">
            Active-la avec <Kbd>Alt</Kbd> + <Kbd>6</Kbd>, dans les réglages ⚙ ou dans le menu sous le bouton rond du haut-parleur, où tu règles aussi le volume de chaque son avec des curseurs. Change le son avec <Kbd>Alt</Kbd> + <Kbd>7</Kbd> et <Kbd>Alt</Kbd> + <Kbd>8</Kbd>.
          </p>
        </Section>

        <Section title="Majuscules et ponctuation">
          <p className="m-0">
            Les textes ont besoin de <strong>majuscules</strong> - en début
            de phrase, et pour chaque nom propre. Tastenflow les met{" "}
            <strong>toujours correctement</strong>, tu ne vois donc jamais un
            mot mal écrit.
          </p>
          <p className="m-0">
            <strong>Très facile au début :</strong> écris juste la lettre en{" "}
            <strong>minuscule</strong> - la <strong>majuscule</strong>{" "}
            apparait toute seule. Tu n'as <strong>pas encore</strong> besoin
            de connaitre la touche <Kbd>Maj</Kbd> pour ça.
          </p>
          <p className="m-0">
            <strong>Bientôt</strong>, après les premières lettres, tu
            apprends à utiliser "pour de vrai" la touche <Kbd>Maj</Kbd> :
            tu la maintiens avec <strong>une</strong> main et tu écris la
            lettre avec l'<strong>autre</strong> - comme sur n'importe quel
            clavier. Ainsi, tu écriras bientôt les majuscules{" "}
            <strong>toi-même</strong>, sans l'aide automatique.
          </p>
          <div className="rounded-lg border border-hairline bg-surface-raised p-3">
            <p className="m-0">
              <strong>Important - toujours la touche Maj de la main
              OPPOSÉE :</strong> il y a deux touches Maj, une à gauche et une
              à droite. Écris la lettre avec une main et maintiens{" "}
              <Kbd>Maj</Kbd> avec l'<strong>autre</strong>. Ainsi, une seule
              main n'a jamais les deux touches à faire.
            </p>
            <p className="m-0 mt-2">
              Exemple : <strong>A</strong> majuscule (main gauche) →{" "}
              <strong>Maj de droite</strong>. <strong>K</strong> majuscule
              (main droite) → <strong>Maj de gauche</strong>.
            </p>
            <p className="m-0 mt-2">
              Tastenflow <strong>n'accepte que la bonne</strong> touche Maj.
              Si tu utilises la <strong>mauvaise</strong> touche Maj ou la{" "}
              <Kbd>Verr. Maj</Kbd>, tu obtiens une lettre en{" "}
              <strong>minuscule</strong> - ça compte comme une{" "}
              <strong>erreur de frappe</strong>, pour que tu t'exerces dès le
              début avec la bonne main.
              {" "}Sur AZERTY, la touche <Kbd>Verr. Maj</Kbd> donne des
              chiffres au lieu de "É" - une bonne raison de plus de
              préférer la vraie touche Maj.
            </p>
          </div>
          {detail >= 2 && (
            <p className="m-0 text-sm text-ink-muted">
              Astuce : appuie <strong>deux fois vite</strong> sur{" "}
              <Kbd>Maj</Kbd> pour entendre avec quel doigt la tenir.
            </p>
          )}
          <p className="m-0">
            <strong>Le point, la virgule et le point d'interrogation</strong>{" "}
            n'apparaissent qu'une fois que tu les as appris. En attendant, tu
            lis simplement la phrase <strong>sans eux</strong> - c'est
            voulu, ce n'est pas une erreur.
          </p>
        </Section>

        <Section title="Dans quel ordre viennent les lettres ?">
          <p className="m-0">
            Les nouvelles touches arrivent toujours dans le même ordre :
            d'abord la <strong>rangée de base</strong>, puis les autres
            lettres, les plus fréquentes en premier - sur AZERTY, la rangée
            de base ne contient aucune voyelle, alors le <Kbd>e</Kbd> arrive
            tout de suite après. Tu vois toujours quelle touche vient
            ensuite, tout à droite de la ligne sous le champ d'exercice :{" "}
            <strong>"Prochaine touche"</strong>.
          </p>
          <div className="flex flex-wrap gap-1" aria-hidden="true">
            {letters.map((ch) => (
              <Kbd key={ch}>{unitGlyph(ch)}</Kbd>
            ))}
          </div>
          <p className="m-0 text-sm text-ink-muted">
            Après seulement les premières lettres viennent les{" "}
            <strong>majuscules</strong> (la touche Maj) et, juste après, le{" "}
            <strong>point et la virgule</strong> : une phrase commence par une
            majuscule et se termine par un point. Puis les lettres
            restantes, dont <Kbd>^</Kbd> - la touche accent circonflexe : tu
            appuies dessus, puis sur la lettre, et les deux ensemble
            donnent "ê" ou "â". En dernier viennent le reste de la{" "}
            <strong>ponctuation</strong>, les <strong>chiffres</strong> (avec
            la touche Maj sur AZERTY) et les <strong>caractères
            spéciaux</strong>.
          </p>
        </Section>

        {detail >= 2 && (
          <Section title='Comment fonctionne "Mon entrainement"'>
            <p className="m-0">
              <strong>Il s'adapte à toi.</strong> L'application se souvient
              des touches encore fragiles et exerce justement celles-là. Une
              nouvelle touche n'arrive que lorsque tu maitrises les autres.
              Les lettres les <strong>plus fréquentes</strong> viennent en
              premier - alors après seulement quelques touches, tu écris
              déjà de <strong>vrais mots et de vraies phrases</strong>, et
              les premières <strong>histoires</strong> se débloquent tôt.
            </p>
          </Section>
        )}

        <Section title="La ligne sous le champ d'exercice">
          <p className="m-0">
            Sous le champ d'exercice se trouve une ligne étroite avec quatre
            informations : ton <strong>{ringWort}</strong>, le{" "}
            <strong>temps</strong> exercé aujourd'hui, ton{" "}
            <strong>objectif de la semaine</strong> et la{" "}
            <strong>touche suivante</strong>. Pour l'objectif de la semaine,
            l'anneau montre combien de <strong>minutes</strong> tu as
            exercées cette semaine - par exemple "25 sur 60 min" ; une{" "}
            <strong>coche</strong> signifie que l'objectif est atteint. La
            touche suivante se débloque <strong>toute seule</strong> dès que
            tu maitrises les précédentes - il suffit de continuer.
          </p>
          <p className="m-0">
            La ligne est <strong>toujours</strong> là - même pendant que tu
            écris. Ainsi rien ne saute, et tu vois à tout moment depuis
            combien de temps tu t'exerces.
          </p>
          <p className="m-0">
            <Kbd>Alt</Kbd> + <Kbd>D</Kbd> annonce ton temps d'exercice et ton
            objectif de la semaine. Les touches que tu maitrises, celles qui
            ne sont pas encore là et celle qui vient ensuite sont indiquées
            dans <strong>"Mes progrès"</strong>, sous{" "}
            <strong>"État des touches"</strong> (<Kbd>Alt</Kbd> +{" "}
            <Kbd>S</Kbd>, avec un compte).
          </p>
        </Section>

        <Section title='La bibliothèque : "Histoires et documentaires" 📖'>
          <p className="m-0">
            En plus de "Mon entrainement", il y a une autre façon de
            t'exercer : les <strong>Histoires</strong> - dans les réglages
            ⚙, sous <strong>"Qu'est-ce que tu exerces ?"</strong>. Tu y
            trouves des histoires entières et des séries documentaires - pas
            des phrases isolées, mais <strong>une histoire sur plusieurs
            séries</strong>. Chaque étape fait douze lignes ; la fois
            suivante, tu reprends exactement là où tu en étais.
          </p>
          <p className="m-0">
            Seul ce que tu peux vraiment écrire avec les touches déjà apprises
            apparait - c'est pourquoi tu vois encore des cadenas au début.
            Ils s'ouvrent tout seuls dès que tu maitrises assez de touches.
            Chaque ligne n'arrive <strong>qu'une seule fois</strong> : ce que
            tu as écrit ne revient pas en répétition.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              <strong>Le fil rouge :</strong> ce que tu as lu dans une série
              documentaire revient plus tard dans ton entrainement - comme
              une <strong>question posée autrement</strong>, puis comme un
              petit détail en plus, et enfin comme une blague qui s'y
              rapporte. Ainsi, ce que tu as appris reste, sans avoir l'air
              d'un contrôle.
            </p>
          )}
        </Section>

        <Section title="D'où viennent les textes ? 🤖">
          <p className="m-0">
            Les propres textes de l'application - phrases d'exercice,
            blagues et histoires - ont été écrits par Johannes{" "}
            <strong>avec l'aide de l'intelligence artificielle (IA)</strong>,
            puis relus et vérifiés par lui-même. Les textes d'autres sources
            sont crédités par leur nom sous "Sources et remerciements".
          </p>
          {/* ★ D1 Randfund (28.09.2026): „la créature qui murmure" gibt es auf
              Weg „fr" nicht (die Höhle spielt einen Ton) - nur der Fisch. Auf
              Weg „de" gibt es sie (`hoehleHatWesen`): dort der frühere Wortlaut. */}
          <p className="m-0">
            {hoehleMitWesen ? (
              <>
                Le poisson qui chante et la créature qui murmure dans
                l'Expédition polaire sont aussi des{" "}
                <strong>voix d'ordinateur</strong>, pas de vraies personnes.
              </>
            ) : (
              <>
                Le poisson qui chante dans l'Expédition polaire est aussi une{" "}
                <strong>voix d'ordinateur</strong>, pas une vraie personne.
              </>
            )}{" "}
            La
            lecture à voix haute (🗣) utilise la voix de lecture de ton
            appareil.
          </p>
        </Section>

        <Section title={`Le ${PRUEFUNG_WORT_FR}`}>
          <p className="m-0">
            Parfois, ton enseignant ou ton enseignante lance un{" "}
            <strong>{PRUEFUNG_WORT_FR}</strong> - pour toute la classe.{" "}
            <strong>Tout le monde reçoit le même texte</strong>, et tout le
            monde a le même temps.
          </p>
          <p className="m-0">
            <strong>Le temps ne commence qu'à ta première frappe</strong> -
            pas quand ton enseignant ou ton enseignante lance le {PRUEFUNG_WORT_FR}.
            À partir du lancement, tu as{" "}
            <strong>{EINSTIEGSFENSTER_MIN} minutes</strong> pour commencer.
          </p>
          <p className="m-0">
            <strong>Comment le reconnaitre :</strong> au-dessus du champ
            d'exercice, il est écrit <strong>{PRUEFUNG_WORT_FR}</strong>, avec
            le temps à côté, et toute la zone a un{" "}
            <strong>contour en pointillés</strong> différent. Dès que le
            temps est écoulé, les deux disparaissent.
          </p>
          <p className="m-0">
            <strong>Combien de temps reste-t-il, sans regarder :</strong>{" "}
            <Kbd>Alt</Kbd> + <Kbd>X</Kbd> te le dit. L'horloge ne parle
            d'elle-même que quelques fois ; sinon, elle reste silencieuse.
          </p>
          <p className="m-0">
            <strong>La plage braille reste calme.</strong> Le temps ne défile{" "}
            <strong>pas</strong> sur la ligne : il avance en haut, mais il ne
            s'immisce jamais dans ce que tu lis.
          </p>
          <p className="m-0">
            <strong>Parfois, le {PRUEFUNG_WORT_FR} est en "écriture
            libre".</strong> Une erreur reste alors simplement là où elle a
            été tapée - rien n'est signalé, aucun son ne la pointe. Retour
            arrière ne corrige qu'à l'intérieur de la ligne en cours ; une
            ligne terminée reste telle quelle. À la fin d'une ligne, appuie
            sur Espace après le dernier mot - ou, si la classe a
            activé "Fin de ligne avec Entrée", appuie sur Entrée à
            la place. Ce qui reste faux à la fin n'apparait qu'après coup,
            dans les résultats, comme une liste à lire.
          </p>
          <p className="m-0">
            <strong>Arrêter avant la fin :</strong> <Kbd>Échap</Kbd> te
            demande d'abord confirmation. <strong>"Continuer à écrire"</strong> (ou{" "}
            <Kbd>Échap</Kbd>) te ramène à la ligne, <strong>"Rendre"</strong>{" "}
            rend ce que tu as tapé - ce qui est écrit jusque-là est évalué. Le
            bouton <strong>"Terminé - rendre"</strong> sous le champ fait la
            même chose, sans demander.
          </p>
          <p className="m-0">
            <strong>Une fois le temps écoulé,</strong> tes résultats
            apparaissent aussitôt : frappes par minute, précision,
            caractères, erreurs, lignes et touches instables. Chaque{" "}
            {PRUEFUNG_WORT_FR} reste ensuite dans{" "}
            <strong>"Mes progrès"</strong>, sous{" "}
            <strong>{PRUEFUNG_WORT_MEHRZAHL_FR}</strong> - tu peux le
            reconsulter à tout moment.
          </p>
        </Section>

        <Section title="Match de la classe ⚔️">
          <p className="m-0">
            Dans un Match de la classe, tu fais une <strong>course de
            frappe de cinq minutes</strong> avec le reste de ta
            classe. Le Match de la classe n'existe que dans une classe, et
            seulement si ton enseignant ou ton enseignante l'autorise.
          </p>
          <p className="m-0">
            <strong>Le lancer :</strong> <Kbd>Alt</Kbd> + <Kbd>M</Kbd>, ou le
            bouton <strong>Match de la classe</strong> dans la ligne
            au-dessus du champ d'exercice - juste à côté de{" "}
            <strong>Jouer</strong>. Tous les autres reçoivent alors une
            fenêtre : <strong>"J'en suis"</strong> ou{" "}
            <strong>"Pas maintenant"</strong>. <Kbd>Échap</Kbd> te ramène à
            l'exercice, et la même invitation ne revient pas d'elle-même.
          </p>
          <p className="m-0">
            <strong>Si quelqu'un invite déjà,</strong> <Kbd>Alt</Kbd> +{" "}
            <Kbd>M</Kbd> fait réapparaitre cette invitation - un deuxième
            match ne peut démarrer qu'une fois le premier en cours. Si deux
            personnes invitent presque en même temps, c'est l'invitation
            arrivée en premier qui compte.
          </p>
          <p className="m-0">
            <strong>Quand ce n'est pas possible tout de suite :</strong> si tu
            es déjà dans un match, le bouton dit{" "}
            <strong>"Match de la classe en cours"</strong> - et{" "}
            <Kbd>Alt</Kbd> + <Kbd>M</Kbd> te dit la même chose. Les autres
            matchs de ta classe ne gênent pas : plusieurs peuvent se dérouler
            en même temps.
          </p>
          <p className="m-0">
            <strong>Chaque personne tape avec les touches déjà apprises.</strong> Si
            tu connais déjà les chiffres, tu reçois des chiffres ; si tu en
            es à la rangée de base, tu reçois la rangée de base. Les erreurs
            coutent cher - une touche fausse compte comme cinq caractères.
          </p>
          <p className="m-0">
            <strong>Où tu en es, sans regarder :</strong> tout à gauche de la
            ligne d'exercice, il y a toujours huit cellules : <strong>P2</strong>{" "}
            est ta place, suivie du temps restant. <Kbd>Alt</Kbd> +{" "}
            <Kbd>X</Kbd> te dit ta place, le temps et les trois premiers.
            Rien ne parle de lui-même - la plage braille reste calme.
          </p>
          <p className="m-0">
            <strong>Arrêter avant la fin :</strong> <Kbd>Échap</Kbd> ou le
            bouton <strong>"Quitter"</strong> te demande d'abord
            confirmation. <strong>"Continuer à écrire"</strong> (ou{" "}
            <Kbd>Échap</Kbd>) te ramène à la ligne. <strong>"Quitter"</strong>{" "}
            met fin au match seulement pour toi - les autres continuent
            d'écrire et voient ce que tu as tapé.
          </p>
          <p className="m-0">
            <strong>Le match compte dans ton temps d'exercice</strong>, et il
            peut débloquer une nouvelle touche - comme une série d'exercice
            ordinaire. <strong>Aucune place n'est enregistrée.</strong> À la
            fin, tu vois la liste : Trophée, Argent et Bronze pour les trois
            premiers, tous les autres avec leur numéro. Puis{" "}
            <strong>"Continuer à s'exercer"</strong> ou <Kbd>Échap</Kbd> te
            ramène.
          </p>
        </Section>

        <Section title="Touches importantes">
          <p className="m-0 text-sm text-ink-muted">
            <AltOderWahl>
              Sur Mac, <Kbd>Alt</Kbd> est la touche <Kbd>⌥</Kbd> (Option).
            </AltOderWahl>
          </p>
          <ul className="m-0 list-none space-y-2 p-0">
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Échap</Kbd>
              </span>
              <span>
                <strong>La touche la plus importante :</strong> elle ferme
                toute fenêtre, et ensuite le curseur est{" "}
                <strong>toujours dans le champ d'exercice</strong>. Même
                quand rien n'est ouvert, <Kbd>Échap</Kbd> t'y ramène. La seule
                exception est "Explorer le clavier" : là, <Kbd>Échap</Kbd>{" "}
                est elle-même une touche à explorer, et seul le deuxième
                appui te fait sortir.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Maj</Kbd> <Kbd>Maj</Kbd>
              </span>
              <span>Deux appuis rapides : le bon doigt est annoncé.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>E</Kbd>
              </span>
              <span>Va au champ d'exercice.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>U</Kbd>
              </span>
              <span>Va à l'exercice.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>S</Kbd>
              </span>
              <span>
                Ouvre Mes progrès (personnel enseignant : Mes classes). Seulement
                après la connexion. Appuie de nouveau pour revenir au champ
                d'exercice.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>Z</Kbd>
              </span>
              <span>Annonce sur quelle ligne tu es.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>D</Kbd>
              </span>
              <span>
                Te dit ton temps d'exercice - sur la plage braille et (avec
                la lecture à voix haute) comme une annonce.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>L</Kbd>
              </span>
              <span>Annonce à quel {ringWort} tu es.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>3</Kbd>
              </span>
              <span>
                <strong>Explorer le clavier :</strong> chaque touche que tu
                presses est annoncée et montrée en grand - d'abord le nom
                court, puis le nom complet, puis ce qu'elle fait. Ça marche
                pour toutes les touches spéciales et la ponctuation, pour les
                caractères sur AltGr (sur Mac : Option), avec comment les
                atteindre, et pour les combinaisons comme Ctrl + C. Les
                raccourcis propres de Tastenflow (<AltText>Alt + H, Alt + V …</AltText>)
                continuent à marcher. Le clavier à l'écran montre quelle
                touche a été pressée. Si la lecture à voix haute est
                désactivée, la voix reste silencieuse. Sur la plage braille,
                l'explication reste jusqu'à la touche suivante, et tu peux
                tout lire avec les touches de défilement ; à l'écran, elle
                apparait dans une fenêtre. Rien n'est écrit, rien n'est
                perdu. <Kbd>Maj</Kbd> donne le caractère du haut d'une touche et <Kbd>AltGr</Kbd> (sur Mac : <Kbd>Option</Kbd>) le troisième : tu peux ainsi essayer tous les caractères un par un.{" "}<strong>Pour sortir :</strong> <Kbd>Alt</Kbd> +{" "}
                <Kbd>3</Kbd> à nouveau, <Kbd>Échap</Kbd> deux fois - ou
                simplement recharger la page.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>4</Kbd>
              </span>
              <span>
                <strong>Trouver les touches :</strong> une touche est nommée,
                et tu la cherches. La première fois que tu la trouves, tu
                entends "Trouvé ! Appuie sur une autre touche, puis encore sur …" - seul le
                deuxième appui compte, et seulement après une autre touche entre
                les deux. Puis la touche suivante arrive. Toute
                autre touche est juste nommée. Dans la fenêtre,{" "}
                <Kbd>Alt</Kbd> + <Kbd>4</Kbd> bascule entre explorer et
                trouver. <strong>Pour sortir :</strong> comme pour explorer.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>K</Kbd>
              </span>
              <span>
                <strong>Couleurs et contraste :</strong> sept jeux de
                couleurs - clair, sombre, noir sur jaune, jaune sur bleu et
                d'autres. Chacun s'affiche déjà dans ses propres couleurs
                dans la liste, pour voir à quoi il ressemble avant de le
                choisir.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>T</Kbd>
              </span>
              <span>Ouvre ou ferme la liste des raccourcis clavier.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>N</Kbd>
              </span>
              <span>Ouvre ou ferme les messages de ton enseignant ou ton enseignante.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>+</Kbd> / <Kbd>-</Kbd>
              </span>
              <span>Agrandit / rétrécit le champ d'exercice.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>V</Kbd>
              </span>
              <span>Active ou coupe la lecture à voix haute.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>H</Kbd>
              </span>
              <span>Ouvre ou ferme cette aide.</span>
            </li>
            <WeitereTasten />
          </ul>
        </Section>

        {detail >= 3 && (
          <Section title="Comment l'application t'aide à progresser">
            <p className="m-0">
              L'application mesure chaque lettre séparément - avec quelle
              précision et à quelle vitesse tu l'écris. Elle exerce
              automatiquement celles qui en ont le plus besoin et ne
              débloque une nouvelle lettre qu'une fois les précédentes
              maitrisées. Ainsi, tu suis ton propre chemin d'apprentissage.
            </p>
            <p className="m-0">
              Le niveau de difficulté (1-50) fait en sorte que ça reste
              toujours <strong>exigeant mais faisable</strong> : quand ça va
              bien, il monte ; quand c'est trop dur, il redescend. Dans{" "}
              <strong>"Mes progrès"</strong>, tu vois tout sur ta
              progression - et comment tu t'améliores.
            </p>
          </Section>
        )}

        <Section title="S'exercer sans classe - un compte personnel 🙋">
          <p className="m-0">
            Si tu n'appartiens pas à une classe, tu crées toi-même un compte
            : ouvre le bouton rond <strong>"Compte"</strong> et coche{" "}
            <strong>"Je m'entraine de mon côté, sans classe"</strong>. Il te faut pour cela une adresse e-mail :
            c'est là qu'arrive le bilan hebdomadaire le lundi - mais
            seulement après une semaine avec de l'entrainement. Si Tastenflow
            n'est pas ouvert pendant un an entier, un
            avertissement arrive par e-mail ; si personne ne se connecte
            pendant les trois semaines suivantes, le compte est supprimé avec
            toute sa progression.
          </p>
          {/* ★ 28.09.2026 (Johannes): die anderen Apps gibt es nur auf Deutsch -
              hier stand „Ta progression compte dans les quatre programmes …". */}
        </Section>

        <PlakatAbschnitt />
      </div>
    </div>
  );
}

/**
 * ★ 28.09.2026: l'affiche à afficher - elle existe en français depuis E15
 * (`tastenflow-plakat-fr.pdf`, `handbuecher.ts`); même forme que
 * `TippenHilfe.es.tsx`.
 */
function PlakatAbschnitt() {
  const plakat = handbuchInSprache(tastenflowPlakat(), "fr");
  return (
    <Section title="Une affiche à afficher">
      <p className="m-0">
        Tu veux faire connaitre Tastenflow dans ton école ou ton
        établissement ? Voici une <strong>affiche à imprimer et à
        afficher</strong> : A3, en hauteur, avec ce que Tastenflow propose en un
        coup d'œil et un code QR vers tastenflow.org.
      </p>
      <p className="m-0">
        <a
          href={downloadAdresse(plakat)}
          download={plakat.speicherName}
          type="application/pdf"
          className="text-accent underline underline-offset-2"
        >
          Télécharger l'affiche (PDF, A3, {groesse(plakat.bytes, "fr")})
        </a>
      </p>
    </Section>
  );
}
