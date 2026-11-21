/**
 * ★★★ E11b (26.09.2026): LA FENÊTRE D'AIDE POUR LES ENSEIGNANTS ET
 * ENSEIGNANTES, EN FRANÇAIS.
 * ===========================================================================
 * NEU AUS DER FUNKTION GESCHRIEBEN (Bauplan D4/§9.1) - nicht Satz für Satz
 * aus `LehrerHilfe.tsx` übersetzt: Was eine Lehrkraft an dieser Stelle
 * wissen muss, um mit ihrer Klasse „Tastenflow" zu benutzen. Struktur (1 bis
 * 12, samt 4a, 8a, 8b) folgt derselben Reihenfolge wie die deutsche und die
 * englische Fassung - wer eine Stelle prüft, findet sie in allen drei.
 *
 * ── ANREDE (F9) ─────────────────────────────────────────────────────────────
 * Immer <strong>vous</strong> - Lehrkraft-Bereich.
 *
 * ── WAS BEWUSST STATISCH BLEIBT (NOCH NICHT VON „FR" ABHÄNGIG) ─────────────
 * ★ E11a-5 (26.09.2026): `LeistungsstufeHilfe`/`DreiWerteHilfe`
 * (`TastenflowZahlenHilfe.tsx`) haben jetzt eine eigene französische
 * Fassung - die frühere englische Lücke hier ist zu. Die Score-Erklärung und der Kurven-Hinweis
 * (`score.ts`/`schreibprobeHinweise.ts`) stehen HIER als eigener, neu
 * geschriebener französischer Satz - inhaltlich gleich, ohne die deutschen
 * Konstanten zu importieren, weil es dafür noch keine `_FR`-Fassung gibt
 * (kein Grund, das auf eine andere Etappe zu verschieben: es sind zwei
 * eigenständige Sätze, keine geteilte Tabelle mit fremden Aufrufstellen).
 * ★ E11a-5: Abschnitt 12 zeigt seit E15 die Knöpfe - das Handbuch gibt
 * es französisch (`tastenflow-handbuch-fr.pdf`), das Plakat vorerst nur
 * englisch (sein Titel sagt es, `handbuecher.ts`).
 * Die Lernweg-Reihenfolge (Abschnitt 4) kommt dagegen wirklich aus „fr" -
 * `LERNWEGE.fr` (`FR_LETTER_ORDER`, Fassung A2) ist seit E2a/E5 fertig.
 *
 * Glossar §9.2 wörtlich: *le Défi*, *rangée de base*, *Texte de la classe*,
 * *Match de la classe*, *objectif de la semaine*, *tableau de bord*. Nur
 * Bindestrich, gerade Anführungszeichen, kein Point médian, Person zuerst.
 */
import { BrailleTabellenPunkte } from "./ScreenreaderHinweis";
import { AltText, Kbd } from "./TippenHilfeTeile";
import { useRef } from "react";
import {
  EINSTIEGSFENSTER_MIN,
  MIND_ZEICHEN,
  PROBEN_JE_NIVEAU,
  PRUEFUNG_WORT_FR,
  PRUEFUNG_WORT_MEHRZAHL_FR,
} from "@/lib/typing/schreibprobe";
import { FEHLER_GEWICHT, FEHLER_GEWICHT_FREI } from "@/lib/typing/schreibprobeWertung";
import { zahl } from "@/lib/bedienSprache";
import { LERNWEGE } from "@/lib/typing/lernweg";
import { useFocusTrap } from "./useFocusTrap";
import { DidaktikInhalt, didaktikAbschnittTitel } from "./DidaktikHinweise";
import { DreiWerteHilfe, LeistungsstufeHilfe } from "./TastenflowZahlenHilfe";
import { RundgangLehrkraftKnoepfe } from "./Rundgang";
import { HandbuchKnopf } from "@/components/lernwerkstatt/HandbuchKnopf";
import { handbuecherFuer, tastenflowPlakat } from "@/lib/lernwerkstatt/handbuecher";

/**
 * ★ E11a-5 (26.09.2026): das Handbuch - derselbe Knopf wie in `LehrerHilfe.tsx`
 * (gemeinsamer `HandbuchKnopf`, gefunden über die EINE Liste). In der
 * französischen Bedienung lädt er `tastenflow-handbuch-fr.pdf`.
 */
function HandbuchLaden() {
  const h = handbuecherFuer("tippen")[0];
  if (!h) throw new Error("Kein Tastenflow-Handbuch in HANDBUECHER");
  return (
    <p className="m-0">
      <HandbuchKnopf alsLink handbuch={h} />
    </p>
  );
}

/** ★ E11a-5: das Plakat - `div` statt `p` (der Knopf kann einen Fehler-Absatz zeigen). */
function PlakatLaden() {
  return (
    <div className="m-0">
      <HandbuchKnopf alsLink handbuch={tastenflowPlakat()} />
    </div>
  );
}

/** Le score expliqué pour l'enseignant ou l'enseignante - un texte propre, voir la doc en tête de fichier. */
const SCORE_ERKLAERUNG_FR =
  "Le score résume la précision et la vitesse de l'élève en un chiffre de " +
  "0 à 100 ; une erreur de frappe compte comme 5 caractères, et doubler la " +
  "vitesse ne compte que 1,4 fois plus - la précision l'emporte sur la vitesse.";

/** La courbe qui ne monte pas toujours - même texte, voir la doc en tête de fichier. */
const STEIGERUNG_HINWEIS_FR =
  "Il est normal que la courbe ne fasse pas que monter. Quand de nouvelles " +
  "touches s'ajoutent, elle redescend d'abord la plupart du temps - surtout " +
  "avec la touche Maj et les chiffres.";

// ★ 18.10.2026 (Johannes: „passe mac an Wahl-taste an"): `Kbd` und `AltText` aus
//   der Kinder-Hilfe - am Mac heißt die Taste „Wahl" (Option, Opción …), im
//   Kästchen wie im Satz. Vorher stand hier ein eigenes `Kbd`, das immer „Alt" zeigte.

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-hairline bg-surface-sunken p-4">
      <h3 className="m-0 mb-1 text-lg font-semibold text-ink">{title}</h3>
      <div className="space-y-2 text-ink-soft">{children}</div>
    </section>
  );
}

export function LehrerHilfeFranzoesisch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  useFocusTrap(open, cardRef, { initialFocus: closeRef });
  if (!open) return null;
  const W = PRUEFUNG_WORT_FR;
  const WM = PRUEFUNG_WORT_MEHRZAHL_FR;
  // ★ La rangée de base d'AZERTY (Fassung A2) - pour l'explication au point 4.
  const frWeg = LERNWEGE.fr;
  const frGrundreihe = frWeg.letterOrder.slice(0, 8).map((c) => c.toUpperCase()).join(" ");
  const frNachGrundreihe = frWeg.letterOrder
    .slice(8, frWeg.lettersBeforeShift - 5)
    .map((c) => c.toUpperCase())
    .join(" ");

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Aide pour les enseignants et enseignantes sur Tastenflow"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        className="card my-8 w-full max-w-3xl space-y-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="m-0 text-xl font-semibold text-ink">
            Aide pour les enseignants et enseignantes : toutes les fonctions de "Tastenflow"
          </h2>
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
        <RundgangLehrkraftKnoepfe onStart={onClose} />

        <p className="m-0 text-ink-soft">
          "Tastenflow" a son <strong>propre système de comptes</strong>,
          entièrement séparé de la connexion à la plateforme. Se connecter
          ici ne change rien à la session de la plateforme - et
          inversement.
        </p>

        <Section title="1 · Créer des classes et des comptes">
          <p className="m-0">
            En tant qu'enseignant ou enseignante, ouvrir Tastenflow vous
            mène toujours à <strong>"Mes classes"</strong> ; "M'entrainer"
            (<Kbd>Alt</Kbd> + <Kbd>U</Kbd>) mène à votre propre
            entrainement. Avec <strong>"Élèves et accès"</strong> en haut
            à droite, vous créez une classe - dans la section dépliable{" "}
            <strong>"Créer une nouvelle classe"</strong>. Le{" "}
            <strong>code de classe</strong> est obligatoire : pendant que
            vous tapez le nom, l'application propose un code adapté
            ("CM2 Martin" devient "CM2MARTIN") ; vous pouvez le modifier, par
            exemple en <code>CM2-B</code>. Le code vaut pour toute la classe.
            Dans la même section, vous choisissez le <strong>niveau
            scolaire</strong> et le <strong>point de départ</strong>, et
            vérifiez la langue (avec son verrou) et le Match de la classe -
            les mêmes champs que sous "Réglages de la classe".{" "}
            <strong>"Créer la classe"</strong> ne fonctionne qu'une fois
            tout rempli ; sinon, une phrase indique ce qui manque, et le
            focus se trouve dans le premier champ manquant.
          </p>
          <p className="m-0">
            Vous ajoutez ensuite des élèves avec un <strong>nom et un mot de
            passe</strong>. Ils peuvent alors se connecter sur{" "}
            <strong>n'importe quel appareil</strong> avec{" "}
            <em>code de classe + nom + mot de passe</em>. L'appareil retient
            le code de classe, les élèves n'ont donc plus qu'à saisir leur
            nom et leur mot de passe.
          </p>
          <p className="m-0">
            Vous pouvez changer plus tard le nom et le code de classe avec{" "}
            <strong>"✏️ Modifier"</strong> - un nouveau code s'applique
            alors à chaque élève de la classe (ils se connectent désormais
            avec le nouveau).
          </p>
          <p className="m-0">
            <strong>Autre possibilité :</strong> toute personne qui
            n'appartient pas à une classe peut aussi{" "}
            <strong>créer elle-même un compte</strong> - dans la fenêtre de
            connexion, avec la case "Je m'entraine de mon côté, sans classe" et une
            adresse e-mail. Rien ne change pour vous : ces comptes
            n'appartiennent à aucune classe, n'apparaissent dans aucune de
            vos listes et reçoivent leur propre bilan hebdomadaire. Pour
            votre classe, tout reste comme avant - c'est vous qui ajoutez
            les élèves.
          </p>
        </Section>

        <Section title="2 · Réglages de la classe et réglages de chaque élève">
          <p className="m-0">
            <strong>Pour toute la classe</strong> (le bouton "Réglages de
            la classe" dans la ligne des tâches au-dessus du tableau, à
            côté de {W}, Texte de la classe, Objectif de la semaine et
            Verrouiller l'heure - même replié, le bouton affiche déjà
            le niveau scolaire, la langue et le Match de la classe) :
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Niveau scolaire :</strong> l'application en déduit
              l'âge des textes - le vocabulaire, le type d'humour et le ton
              des textes d'exercice. <strong>Il évolue avec la classe :</strong>{" "}
              l'application retient l'année scolaire où vous l'avez saisi et
              avance d'un niveau chaque année, sans que vous ayez rien à
              changer. Pour les groupes d'adultes, il existe le niveau{" "}
              <strong>"Adultes"</strong> - il n'avance pas. Aucune année de
              naissance n'est plus demandée pour les élèves d'une classe.
            </li>
            <li>
              <strong>Langue et verrou :</strong> allemand, anglais ou
              français pour les mots et textes d'exercice de toute la
              classe ; avec le verrou à côté, les élèves ne peuvent plus la
              changer eux-mêmes. Chaque élève a le bouton de langue rond
              dans l'en-tête : il change les boutons et les menus, et avec
              eux les textes d'exercice - avec le verrou, seulement les
              boutons et les menus.
            </li>
            <li>
              <strong>Point de départ de la classe :</strong> "où
              commencer" comme réglage par défaut pour toute la classe -
              il s'applique aussi à chaque élève qui arrive plus tard, et il
              n'ajoute jamais que des touches : un élève déjà plus avancé ne
              perd rien. Quand vous le choisissez, l'application le
              propose en même temps aux élèves déjà présents ; si certains
              sont déjà plus avancés, elle redemande d'abord et propose
              trois options : régler tout le monde, seulement ceux qui n'en
              sont pas encore là, ou annuler. Cela prend effet dès qu'un
              élève ouvre à nouveau Tastenflow ; statistiques et badges
              sont conservés dans tous les cas.
            </li>
            <li>
              <strong>Autoriser le Match de la classe :</strong> les élèves
              peuvent s'inviter mutuellement à un match de 5 minutes. Sous
              "Temps d'exercice" dans la ligne dépliée, vous voyez combien
              de fois un élève y a joué chaque semaine - ni classement, ni
              temps.
            </li>
            <li>
              <strong>Fin de ligne avec Entrée :</strong> coché,
              chaque élève de la classe termine chaque ligne d'exercice
              avec la touche Entrée - comme la frappe dans un bureau.
              S'applique à "Mon entrainement", aux histoires, au texte de
              la classe, aux jeux de lettres avec des lignes, au Défi et au
              Match de la classe ; pas aux énigmes, au jeu des lettres
              mélangées, à la dictée à une touche, au jeu de l'Expédition ni à
              "Explorer le clavier". Par défaut : désactivé.
            </li>
          </ul>
          <p className="m-0">
            <strong>Pour chaque élève</strong> (derrière la flèche de sa
            ligne) :
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Clavier :</strong> se choisit dans les réglages sous
              "Clavier" - AZERTY français, AZERTY belge, suisse-romand ou
              canadien. Le réglage s'applique à cet appareil (pas au
              compte) et détermine le clavier à l'écran, les indications de
              doigts et les caractères exercés. Sur AZERTY, les chiffres
              demandent la touche Maj, et la Verr. Maj donne des chiffres au
              lieu de É.
            </li>
            <li>
              <strong>Par où commencer ?</strong> la même liste de points de
              départ que pour toute la classe (voir plus haut) - ici pour un
              seul élève qui a besoin d'une exception. Les élèves plus
              expérimentés sautent les bases et commencent plus loin (par
              exemple seulement à partir des chiffres) ; reculer un élève
              redemande d'abord confirmation.
            </li>
            <li>
              <strong>Écrire d'une seule main :</strong> supprime pour cet
              élève la règle de la touche Maj de la main opposée - les
              majuscules et caractères comptent alors avec n'importe quelle
              touche Maj.
            </li>
            <li>
              <strong>La vitesse ne compte pas :</strong> la vitesse n'est
              jugée nulle part pour cet élève - aucune limite de temps dans
              le jeu, aucun objectif de vitesse pour les étoiles, aucune
              hausse ou baisse du niveau liée à la vitesse.
              Pour les élèves qui écrivent avec soin mais très lentement.
            </li>
            <li>
              <strong>Grand espacement des caractères (CVI) :</strong> plus
              d'espace entre chaque caractère pendant la copie, en trois
              degrés (double, triple, quadruple) - pour les élèves avec une
              déficience visuelle cérébrale (CVI), pour qui des caractères
              trop rapprochés se confondent. L'élève peut aussi changer
              l'espacement dans ses propres réglages (la roue dentée, <AltText>Alt + O</AltText>) - et vous pouvez le changer ici à tout moment. C'est le
              dernier choix qui s'applique.
            </li>
          </ul>
          <p className="m-0">
            Tout peut être changé à tout moment - les quatre réglages de la
            classe dans le panneau "Réglages de la classe" au-dessus du
            tableau, les réglages de chaque élève dans sa ligne dépliée.
          </p>
        </Section>

        <Section title="3 · Le niveau (1-50) : le cœur du système">
          <LeistungsstufeHilfe />
          <p className="m-0">
            Le <strong>niveau actuel</strong> s'affiche dans le tableau
            (colonne <strong>"Niveau"</strong>) et en haut de l'écran
            d'exercice. Vous n'avez rien à régler - juste activer "La vitesse
            ne compte pas" si besoin.
          </p>
        </Section>

        <Section title='4 · "Mon entrainement" : adaptatif, selon la fréquence des lettres'>
          <p className="m-0">
            "Tastenflow" propose <strong>un seul</strong> chemin
            d'exercice, que chaque élève suit à son propre rythme - et il{" "}
            <strong>s'adapte</strong> : l'application mesure chaque touche
            séparément, exerce automatiquement celles qui en ont le plus
            besoin et ne débloque une nouvelle touche qu'une fois les
            précédentes sûres.
          </p>
          <div className="rounded-xl border border-accent bg-accent-soft p-3">
            <p className="m-0 font-semibold text-ink">Ordre selon la fréquence des lettres</p>
            <ul className="m-0 mt-1 list-disc space-y-1 pl-5">
              <li>
                Après la rangée de base, les lettres les{" "}
                <strong>plus fréquentes</strong> viennent en premier - dès
                les premières touches, de <strong>vrais mots</strong>{" "}
                apparaissent.
              </li>
              <li>
                <strong>Chaque parcours est différent</strong> - la touche
                suivante dépend de l'élève, pas d'une liste fixe.
              </li>
              <li>
                <strong>Aucune fin fixe</strong> - idéal pour un exercice
                quotidien et autonome.
              </li>
            </ul>
          </div>
          <p className="m-0 rounded-xl border border-warning/40 bg-warning/10 p-3">
            <strong>À savoir pour votre organisation :</strong> sur AZERTY,
            la <strong>rangée de base ne contient aucune voyelle</strong> (
            <strong>{frGrundreihe}</strong>) - c'est pourquoi le{" "}
            <Kbd>e</Kbd> arrive tout de suite après, avec{" "}
            <strong>{frNachGrundreihe}</strong> et les autres lettres les
            plus fréquentes : de vraies phrases apparaissent presque tout de
            suite, et les premières histoires dès les premières touches.
          </p>
          <p className="m-0 rounded-xl border border-hairline bg-surface-raised p-3">
            <strong>L'ordre dépend de la langue de la toute première
            séance :</strong> le parcours qu'une classe suit dépend de la
            langue de l'interface la première fois qu'elle s'est exercée -
            français, allemand ou anglais. Une classe qui a commencé en
            allemand ou en anglais garde cet ordre-là, même en changeant
            ensuite d'interface : l'ordre est décidé une seule fois, et ne
            change plus jamais après.
          </p>
          <p className="m-0">
            <strong>Le même texte pour toute la classe :</strong> les textes
            du parcours (rangée de base, rangées de lettres, accents,
            ponctuation, chiffres, caractères, textes entiers) sont
            disponibles comme <strong>modèles</strong> dans la zone{" "}
            <strong>"Texte de la classe"</strong> de "Mes classes" -
            choisissez-en un, et toute la classe s'exerce sur le même texte,
            quel que soit le niveau de chaque élève (comme pour un fichier
            chargé, cela compte comme temps d'exercice, sans débloquer de
            nouvelle touche).
          </p>
        </Section>

        <Section title='4a · "Texte de la classe" : un seul texte pour toute la classe'>
          <p className="m-0">
            Avec le bouton <strong>"Texte de la classe"</strong> dans la
            ligne des tâches des statistiques de la classe, vous fixez un
            texte que toute la classe exerce - quel que soit le niveau de
            chaque élève. Trois façons d'y arriver :{" "}
            <strong>charger un fichier</strong> (.txt ou .docx), choisir un
            texte déjà enregistré dans <strong>"Mes textes"</strong>, ou
            utiliser l'un des <strong>modèles</strong> du parcours (voir le
            point 4).
          </p>
          <p className="m-0">
            <strong>"Mes textes"</strong> est votre réserve personnelle -
            elle appartient à votre compte, pas à la classe, et elle n'est
            visible que pour vous. Quand vous chargez un fichier,{" "}
            <strong>"Enregistrer dans Mes textes"</strong> (activé par
            défaut) en garde automatiquement une copie, pour pouvoir
            réutiliser le même texte plus tard sans le recharger.
          </p>
          <p className="m-0">
            Si le fichier contient des caractères qui ne peuvent pas être
            tapés, le panneau les liste avant le début - à vous de décider
            de corriger le fichier ou de commencer quand même (les
            caractères restants sont alors omis des lignes, jamais comptés
            comme frappe obligatoire).
          </p>
          <p className="m-0">
            <strong>"Lancer le texte de la classe" :</strong> chaque élève
            reçoit aussitôt une fenêtre <em>"La suite : un exercice de ton
            enseignant ou ton enseignante."</em> - il ou elle ne peut
            qu'appuyer sur <strong>"Continuer"</strong>, pas refuser.
            Pour chaque élève, l'exercice se termine tout seul dès qu'il ou
            elle a tapé le texte une fois ; ensuite, l'exercice normal
            reprend. <strong>"Terminer l'exercice"</strong> l'arrête
            avant l'heure pour toute la classe.
          </p>
          <p className="m-0">
            L'exercice compte comme temps d'exercice et est mesuré comme
            n'importe quelle série, touches instables comprises - mais il ne{" "}
            <strong>débloque aucune nouvelle touche</strong> : seules les
            touches du fichier comptent.
          </p>
        </Section>

        {/* ★ D-9 (28.09.2026): Didaktik - Sätze aus `lib/typing/didaktikHinweise.ts`. */}
        <Section title={didaktikAbschnittTitel("fr")}>
          <DidaktikInhalt lang="fr" />
        </Section>

        <Section title="5 · Des textes qui ont un sens, dès le début">
          <p className="m-0">
            Tastenflow montre de vrais textes adaptés à l'âge{" "}
            <strong>le plus tôt possible</strong> - blagues, proverbes,
            dictons, documentaires et faits, virelangues, jeux de mots et
            phrases entières. Un texte apparait dès que ses{" "}
            <strong>lettres</strong> sont apprises ; une pure "salade de
            lettres" reste l'exception (seulement pour exercer une touche
            toute nouvelle, exprès).
          </p>
          <p className="m-0">
            <strong>Majuscules :</strong> l'orthographe est{" "}
            <strong>toujours correcte</strong> (majuscule en début de
            phrase et pour les noms propres) - les élèves ne voient jamais
            un mot mal orthographié. Au début, la lettre{" "}
            <strong>minuscule</strong> suffit ; la majuscule apparait
            automatiquement (pour <strong>tous les âges</strong>, parce que
            l'orthographe correcte compte à tout âge).
          </p>
          <p className="m-0">
            Dans <strong>"Mon entrainement", la vraie touche Maj arrive
            tôt</strong> - juste après les premières lettres fréquentes, dès
            qu'il y a assez de vrais mots à exercer (pas seulement après
            tout l'alphabet). À partir de là, les majuscules s'écrivent
            "pour de vrai" avec Maj. Ainsi, les élèves apprennent
            rapidement à mettre les majuscules{" "}
            <strong>eux-mêmes</strong>, au lieu de compter longtemps sur
            l'aide automatique.
          </p>
          <p className="m-0">
            <strong>La ponctuation</strong> (point, virgule, point
            d'interrogation …) n'apparait qu'une fois apprise - avant cela,
            la phrase s'affiche "sans point ni virgule". Une touche{" "}
            <em>lettre</em> ou <em>chiffre</em> pas encore apprise, en
            revanche, n'est <strong>jamais</strong> exigée.
          </p>
        </Section>

        <Section title="6 · Étoiles, badges et sons (importants pour les élèves en situation de handicap visuel)">
          <p className="m-0">
            Chaque série donne <strong>1 à 3 étoiles</strong> selon la
            précision et la vitesse - <strong>la précision compte trois
            fois plus</strong> : 3 étoiles demandent toujours environ 96 %
            de réussite (une frappe rapide et bâclée n'est pas récompensée) ;
            une série sans la moindre erreur, en revanche, obtient 2
            étoiles à coup sûr, même à la vitesse la plus lente. Chaque
            nombre d'étoiles a son <strong>propre son</strong> ; quand un
            élève <strong>monte d'un niveau</strong>, un son de
            célébration particulier se fait entendre. Ces sons sont le
            retour principal pour les élèves avec une déficience visuelle.
            Le bouton <strong>🔇</strong> coupe le son dans une classe
            calme.
          </p>
          <p className="m-0">
            En plus, il y a des <strong>badges</strong> avec des noms
            adaptés aux enfants - en familles, avec des degrés croissants et
            un "prochain objectif" toujours annonçable. Seuls les élèves
            de 7 à 10 ans voient les noms des mascottes ; à partir de 11-15
            ans, le nom neutre apparait partout. Les badges eux-mêmes sont
            les mêmes - ce qui est gagné reste gagné, même quand l'âge des
            textes change. Presque tous récompensent la{" "}
            <strong>précision</strong> et la <strong>persévérance</strong> ;
            le seul badge de vitesse demande 95 % de précision. Un nouveau
            badge apporte son propre son "ta-da" avec une annonce, puis
            apparait tout en haut des statistiques (pour l'élève et pour
            vous - la même vue). Chaque badge peut être{" "}
            <strong>sélectionné</strong> pour s'ouvrir en grand, avec un
            effet.
          </p>
          <p className="m-0">
            Le <strong>jeu de la banquise 🐧</strong> est la récompense
            après une nouvelle touche dans "Mon entrainement" : le manchot
            traverse un parcours fait des <strong>caractères les plus
            instables</strong> de l'élève. <strong>La touche est déjà
            débloquée avant cela</strong> - la progression ne dépend
            d'aucun jeu. Autant d'essais que voulu, pas de fin de partie ;
            là où seule la précision est exigée, il n'y a{" "}
            <strong>aucune pression de temps</strong> (une limite de temps
            désactivable, comme l'exigent les WCAG). En plus, les élèves de
            7 à 15 ans peuvent lancer le jeu volontairement à tout moment
            avec le bouton <strong>Jouer</strong> - comme une "aventure du
            jour" avec des <strong>poissons bonus</strong> et la{" "}
            <strong>grotte de l'écho</strong>, où chaque touche n'est
            qu'annoncée (l'application y parle même si la lecture à voix
            haute est coupée - les élèves avec ou sans handicap visuel y
            jouent exactement de la même façon). Une série sans erreur se termine
            par les aurores boréales. Important pour votre évaluation : le
            jeu ne <strong>compte pas</strong> comme temps d'exercice ni
            pour l'objectif de la semaine - il est purement motivationnel.
          </p>
          <p className="m-0">
            <strong>Deux façons différentes d'entrer dans le jeu - à ne pas
            confondre :</strong> le bouton <strong>Jouer</strong> est la
            voie libre que les élèves déclenchent eux-mêmes ; elle existe
            pour les <strong>7-15 ans</strong>, pas à partir de 16 ans. La
            partie <strong>après une nouvelle touche</strong>, elle, arrive
            d'elle-même : toujours pour les 7-10 ans, jamais à partir de 16
            ans, et pour les 11-15 ans seulement si le jeu de la banquise
            est choisi dans les réglages, sous{" "}
            <strong>"Jeu de récompense"</strong>, à la place d'{" "}
            <strong>Aucun</strong> (réglage par défaut). Ce réglage
            appartient à l'<strong>appareil</strong>, pas au compte - comme
            la disposition du clavier. Sur un ordinateur de classe, il
            s'applique donc à toutes les personnes qui s'y exercent.
          </p>
        </Section>

        <Section title="7 · Objectif de la semaine">
          <p className="m-0">
            Pour chaque élève, vous fixez des <strong>minutes par
            semaine</strong> - un simple nombre, sans séances de cours à
            indiquer. "Appliquer à la classe" écrit
            la même valeur pour tous les élèves de la classe d'un coup, et
            elle s'applique aussi aux élèves qui arrivent plus tard.
          </p>
          <p className="m-0">
            Un changement s'applique toujours <strong>à partir du lundi
            suivant, 8 h</strong> - la semaine en cours garde son ancien
            objectif. Une fenêtre indique la date exacte avant
            d'enregistrer.
          </p>
          <p className="m-0">
            <strong>Rattraper :</strong> si "Rattraper les minutes
            manquées des semaines précédentes" est coché, toutes les
            minutes manquées peuvent être rattrapées d'un coup.
          </p>
          <p className="m-0">
            <strong>Dispenser de l'objectif de la semaine</strong> (par exemple
            en cas de maladie) et <strong>Réinitialiser les minutes en
            retard</strong>{" "}
            restent comme avant - pour chaque élève, sans changer le temps
            exercé.
          </p>
          <p className="m-0">
            <strong>Verrouiller l'heure :</strong> un bouton à part
            pour toute la classe, pour 60 minutes. Les élèves continuent à
            s'exercer - le temps d'exercice et les statistiques continuent
            à compter, mais pas pour l'objectif de la semaine pendant cette
            heure. Appuyer une seconde fois sur le même bouton lève le
            verrouillage plus tôt.
          </p>
        </Section>

        <Section title="8 · Statistiques et progression dans le temps (à déplier pour chaque élève)">
          <p className="m-0">
            Avec le bouton rond à flèche<span aria-hidden="true"> ▸</span>{" "}
            devant le nom, vous ouvrez six lignes qui se replient chacune,
            de haut en bas : <strong>Réglages</strong> (les réglages du
            point 2, pour cet élève), <strong>{WM}</strong> (seulement si
            au moins un a été fait), <strong>Temps d'exercice</strong>{" "}
            (pour chaque semaine, avec l'état de l'objectif de cette
            semaine et - s'il ou elle a joué - le nombre de Matchs de la
            classe, plus le résumé de toute l'année scolaire),{" "}
            <strong>Touches instables</strong>, <strong>Badges</strong> et -
            seulement si une valeur ressort - <strong>Autonomie</strong>{" "}
            (voir le point 9).
          </p>
          <p className="m-0">
            En haut de "Temps d'exercice", vous voyez à combien de Matchs
            de la classe l'élève a participé (comptés dans cette classe) ;
            appuyer sur Entrée sur une semaine ouvre le détail de chaque
            séance - jour, heure de début et de fin, temps de frappe pur et
            ce qui a été exercé.
          </p>
          <p className="m-0">
            Ce qui n'apparait plus séparément ici - chiffres en un coup
            d'œil, progression dans le temps, progression des touches,
            histoires et documentaires - n'est pas perdu : tout se trouve
            dans <strong>"Mes progrès"</strong> de l'élève, où vous voyez
            exactement la même vue que lui ou elle.
          </p>
          <p className="m-0">
            <strong>Le score :</strong> {SCORE_ERKLAERUNG_FR}
          </p>
          <p className="m-0">
            <strong>Dans le tableau de la classe</strong>, trois colonnes
            sont regroupées sous l'en-tête <strong>"Exercice"</strong> :
            précision, frappes/min et score. Toutes trois viennent de
            l'exercice sur la période choisie, et le score combine les
            deux autres. C'est pourquoi elles sont légèrement grisées et
            encadrées d'un trait fin ; la synthèse vocale annonce
            "Exercice" avant l'en-tête de colonne. La colonne{" "}
            <strong>"{W}"</strong>, tout à droite, se trouve
            volontairement en dehors de ce groupe - sous l'en-tête
            "Défi" : c'est un test un jour donné, pas un exercice
            quotidien.
          </p>
          <p className="m-0">
            Dans la colonne <strong>"Score"</strong> : quiconque a tapé
            moins de 200 caractères sur la période choisie n'a pas de score,
            juste un tiret - en dessous, une seule erreur de frappe ferait
            perdre plusieurs points.
          </p>
          <p className="m-0">
            <strong>"Télécharger en Excel"</strong> se trouve au-dessus du
            tableau, à droite de "Total". Le bouton télécharge
            le tableau sous le nom{" "}
            <strong>nomdeclasse_date.xlsx</strong> (par exemple
            "3a_2026-09-12.xlsx") - pour la période actuellement choisie.
            Au début se trouve un aperçu avec des liens vers les quatre
            périodes et une légende qui explique chaque colonne et montre
            comment le score est calculé. Suivent quatre feuilles : l'année
            scolaire en cours, le total, le mois (les 4 dernières
            semaines) et cette semaine. Les valeurs sont enregistrées comme
            des nombres, pour pouvoir continuer à calculer dans Excel ; là
            où le tableau affiche un tiret, le fichier affiche aussi un
            tiret.
          </p>
          <p className="m-0">
            <strong>L'aperçu de la classe</strong> au-dessus du tableau
            montre la classe dans son ensemble. "Mois" (les 4 dernières
            semaines) est présélectionné, "Année scolaire" est juste à
            côté. Une ligne donne les frappes/min, la précision et les
            objectifs de la semaine, chacun avec une petite tendance - pour
            le mois par rapport aux 4 semaines précédentes, pour l'année
            scolaire les premières semaines d'exercice comparées aux
            dernières.
          </p>
          <p className="m-0">
            <strong>La barre de points "Scores dans la classe"</strong>{" "}
            montre un point par élève. La touche Tab amène sur la barre, et
            les flèches font passer d'un élève à l'autre - chaque arrêt est
            annoncé ("Mia, 78 points"). Combien d'élèves sont en dessous
            de 50, entre 50 et 70, entre 70 et 85 et au-dessus de 85 points,
            et qui a trop peu écrit, figure dans l'indication de son
            en-tête.
          </p>
          <p className="m-0">
            <strong>Le graphique "Score de la classe sur l'année
            scolaire"</strong> montre, pour chaque semaine, la moyenne des
            élèves ayant au moins 5 lignes ; un trou signifie que la
            semaine a eu trop peu d'exercice. La touche Tab amène sur le
            graphique, et les flèches font passer d'une semaine à l'autre ;
            pour la synthèse vocale, toutes les semaines sont aussi dans un
            tableau. Quand la touche Maj, les chiffres ou les caractères
            spéciaux s'ajoutent, la courbe baisse un moment - c'est normal
            et ce n'est pas inquiétant.
          </p>
          <p className="m-0">
            <strong>La courbe :</strong> {STEIGERUNG_HINWEIS_FR}
          </p>
          <p className="m-0">
            <strong>Transparence :</strong> chaque élève voit exactement les
            mêmes chiffres sur lui-même ou elle-même sous "Mes progrès" -
            vous ne voyez jamais plus que l'élève.
          </p>
        </Section>

        <Section title="8a · Les valeurs à partir desquelles construire une note">
          <DreiWerteHilfe />
        </Section>

        <Section title={`8b · Le ${W} : un test pour toute la classe`}>
          <p className="m-0">
            Dans l'espace enseignants <strong>"Mes classes"</strong>, tout
            en haut des <strong>statistiques de la classe</strong> de
            Tastenflow, dans la ligne des tâches, se trouve le bouton{" "}
            <strong>"{W}"</strong>. Il ouvre le formulaire avec lequel
            vous lancez un test pour toute la classe -{" "}
            <strong>tous les élèves reçoivent le même texte</strong>, quel
            que soit leur niveau dans le parcours.
          </p>
          <p className="m-0">
            <strong>Trois choses à régler :</strong> le{" "}
            <strong>niveau de touches</strong> (de "Rangée de base" à
            "Toutes les touches"), juste à côté le <strong>type</strong>,
            et le <strong>temps</strong> en minutes.{" "}
            <strong>"Lancer maintenant"</strong> le démarre aussitôt.
          </p>
          <p className="m-0">
            <strong>Strict</strong> (par défaut) fonctionne comme avant :
            une touche fausse ne fait pas avancer, chaque erreur de frappe
            compte - même corrigée aussitôt. <strong>Écriture libre</strong>{" "}
            ressemble à une copie classique : les erreurs restent telles
            qu'elles ont été tapées et ne sont pas signalées, et Retour
            arrière ne corrige qu'à l'intérieur de la ligne en cours. Ce qui
            est noté n'est calculé qu'à la fin, à partir de ce qui reste
            faux - au plus une erreur par mot, le dernier mot inachevé ne
            compte pas, et les endroits corrigés ne comptent pas du tout.
            Comme une erreur laissée telle quelle n'a couté aucun temps de
            frappe, elle pèse plus lourd : {FEHLER_GEWICHT_FREI} caractères
            au lieu de {FEHLER_GEWICHT} (8a). Choisissez "Écriture libre"
            quand la classe doit s'exercer à une copie sans qu'une erreur
            ne bloque la frappe ; choisissez "Strict" pour tester la
            frappe elle-même.
          </p>
          <p className="m-0">
            <strong>Trois horloges à distinguer :</strong>
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              Le <strong>lancement</strong> - le moment où vous appuyez sur
              "Lancer maintenant". La classe peut commencer à partir de là.
            </li>
            <li>
              Le <strong>délai pour commencer</strong> :{" "}
              {EINSTIEGSFENSTER_MIN} minutes après le lancement. Jusque-là,
              un élève peut encore commencer ; au-delà, c'est trop tard.
            </li>
            <li>
              Le <strong>temps</strong> s'écoule{" "}
              <strong>séparément pour chaque élève</strong>, et seulement à
              partir de sa <strong>première frappe</strong>. Deux élèves de
              la même classe finissent donc à des moments différents -
              c'est voulu : celui ou celle qui doit d'abord se repérer ne
              perd pas de temps.
            </li>
          </ul>
          <p className="m-0">
            <strong>Les textes :</strong> pour chaque niveau de touches, il
            y a <strong>{PROBEN_JE_NIVEAU} textes de défi</strong> d'au
            moins {zahl(MIND_ZEICHEN, "fr")} caractères chacun - assez
            longs pour ne jamais s'épuiser, même à grande vitesse. Ils{" "}
            <strong>n'apparaissent pas dans le parcours</strong>, aucun
            élève n'a donc pu s'y entrainer avant. Le prochain {W} avec ce
            niveau de touches reprend à l'endroit le plus loin atteint la
            fois précédente : à la ligne suivante, ou au début de
            la phrase suivante pour les textes avec des phrases. Si un
            texte s'épuise pendant le {W}, les élèves continuent dans le
            suivant sans interruption.
          </p>
          <p className="m-0">
            <strong>Élèves en situation de handicap visuel :</strong> ils et elles font le {W} avec
            la <strong>lecture à voix haute</strong> de l'application (
            <Kbd>Alt</Kbd> + <Kbd>V</Kbd>) - comme à l'entrainement, sans
            case à cocher séparée pour vous. Le temps que passe un élève à
            attendre la voix est retiré par l'horloge du {W} elle-même ; un
            élève sans handicap visuel qui fait aussi lire le texte à voix haute a le même
            temps retiré.
          </p>
          <p className="m-0">
            <strong>Les résultats</strong> se trouvent dans le panneau
            déplié sous "{WM} passés" - le bouton "{W}" au début de la
            ligne le déplie : pour chaque élève, le rang, le{" "}
            <strong>score</strong>, si la lecture à voix haute était
            active, la vitesse, la précision et les touches instables.
            Comment le score est calculé est expliqué au point 8a. Dès que
            le {W} est terminé pour <strong>toute la classe</strong>, un{" "}
            <strong>e-mail récapitulatif</strong> avec les mêmes chiffres
            arrive aussi.
          </p>
          <p className="m-0">
            Un élève peut choisir <strong>"Je ne participe pas"</strong>.
            Il ou elle continue alors à s'exercer normalement et apparait
            dans les résultats comme <strong>"n'a pas participé"</strong>.
            Chaque élève voit ensuite ses propres {WM} sous{" "}
            <strong>"Mes progrès"</strong> - les mêmes chiffres que vous.
          </p>
        </Section>

        <Section title="9 · Autonomie / vérification IA (pour vous seulement)">
          <p className="m-0">
            La colonne <strong>"Autonomie"</strong> montre une
            valeur de <strong>1 à 10</strong>. Elle augmente avec des
            indices que quelque chose n'a pas été tapé par l'élève lui-même
            ou elle-même : <em>collage</em>, changements fréquents de
            fenêtre ou de focus, vitesse peu plausible ou précision parfaite
            sans historique d'apprentissage. Cette valeur n'est visible que
            pour <strong>vous</strong>, pas pour les élèves.
          </p>
        </Section>

        <Section title="10 · Accessibilité">
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Contraste et taille du texte :</strong> via la barre
              en haut (clair, sombre, contraste élevé) ; <Kbd>Alt</Kbd> +{" "}
              <Kbd>+</Kbd> / <Kbd>-</Kbd> agrandit ou rétrécit le champ
              d'exercice.
            </li>
            <li>
              <strong>Lecture à voix haute</strong> avec <Kbd>Alt</Kbd> +{" "}
              <Kbd>V</Kbd> - pour les élèves sans lecteur d'écran configuré
              (avec NVDA/JAWS/VoiceOver, mieux vaut la laisser coupée). Vous
              pouvez choisir si les <em>lettres / mots / phrases</em> sont
              lus, le débit et <strong>quelle voix</strong>. Le{" "}
              <strong>temps de lecture est retiré du calcul de la
              vitesse</strong> - les élèves qui ont besoin de la lecture à
              voix haute ne sont donc pas désavantagés dans les statistiques.
            </li>
            <BrailleTabellenPunkte weg="fr" />
            <li>
              <strong>Annonce du doigt :</strong> appuyer deux fois vite sur
              la touche <Kbd>Maj</Kbd> annonce le bon doigt.
            </li>
            <li>
              <strong>Gestion du focus :</strong> chaque bouton a une
              destination définie - qui appuie dessus sait ensuite où se
              trouve le curseur d'écriture. Pour les élèves qui travaillent
              avec une plage braille, c'est la différence entre continuer et
              chercher. Trois règles à remarquer en classe : <Kbd>Échap</Kbd>{" "}
              ferme toute fenêtre et ramène toujours{" "}
              <strong>au champ d'exercice</strong> ; un changement de vue
              (statistiques, bibliothèque, connexion) arrive sur le{" "}
              <strong>titre de la nouvelle vue</strong> et l'annonce ; et{" "}
              <strong>rien ne disparait de soi-même</strong> - même la
              célébration d'un déblocage attend que l'élève appuie sur
              "Continuer".
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>E</Kbd> saute au champ d'exercice,{" "}
              <Kbd>Alt</Kbd> + <Kbd>H</Kbd> ouvre l'aide.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>U</Kbd> passe à l'exercice,{" "}
              <Kbd>Alt</Kbd> + <Kbd>S</Kbd> à <strong>"Mes classes"</strong>{" "}
              (pendant l'exercice : à vos propres statistiques) ;{" "}
              <Kbd>Alt</Kbd> + <Kbd>Z</Kbd> annonce la ligne où vous êtes.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>D</Kbd> donne le temps d'exercice - sur
              la plage braille et (avec la lecture à voix haute) comme une
              annonce.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>T</Kbd> ouvre ou ferme la{" "}
              <strong>liste des raccourcis clavier</strong>.
            </li>
          </ul>
        </Section>

        <Section title="11 · Supprimer">
          <p className="m-0">
            Un ou une élève, ou toute une classe, peuvent être supprimés
            définitivement (avec leur compte, leur progression et leurs
            résultats). Cela ne peut pas être annulé - une confirmation est
            demandée d'abord.
          </p>
        </Section>

        {/* ★ E11a-5 (26.09.2026): das französische Handbuch gibt es seit
            E15 (`tastenflow-handbuch-fr.pdf`) - dieselben zwei Knöpfe wie in
            der deutschen und englischen Hilfe (`HandbuchKnopf` lädt in der
            Bedienungssprache: das Heft französisch, das Plakat vorerst
            englisch, und sein Titel sagt es). */}
        <Section title="12 · Téléchargements : le guide et l'affiche (PDF)">
          <p className="m-0">
            Tout ce que dit cette aide, et bien plus, se trouve dans le{" "}
            <strong>guide pour les enseignants et enseignantes</strong> : le
            parcours français avec toutes ses étapes, les claviers français,
            le tableau de bord, le Défi pas à pas, le score et les valeurs pour
            une évaluation.
          </p>
          <HandbuchLaden />
          <p className="m-0">
            Pour le mur d'une classe ou de la salle des enseignants, il existe
            aussi l'<strong>affiche Tastenflow</strong> au format A3, avec un
            code QR vers tastenflow.org - pour l'instant en anglais. Elle est
            libre pour tout le monde, sans connexion.
          </p>
          <PlakatLaden />
          <p className="m-0 text-sm text-ink-muted">
            Vous trouvez aussi les deux dans "Mes classes" sous
            "Téléchargements".
          </p>
        </Section>
      </div>
    </div>
  );
}
