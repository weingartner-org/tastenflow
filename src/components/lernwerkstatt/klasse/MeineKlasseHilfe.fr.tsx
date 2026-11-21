/**
 * ★★★ E11b (26.09.2026): DIE HILFE ZU „MEINE KLASSEN" AUF FRANZÖSISCH.
 * ===========================================================================
 * NEU AUS DER FUNKTION GESCHRIEBEN (Bauplan D4/§9.1) - nicht Satz für Satz
 * aus `MeineKlasseHilfe.tsx` übertragen: Was braucht eine Lehrkraft an dieser
 * Stelle - wie die Seite aufgebaut ist, wie der Défi abläuft, wie man ein
 * Kind verschiebt, welche Tastenwege es gibt. Sichtbar nur mit
 * `spracheGewaehlt === "fr"` (`MeineKlasseHilfe.tsx`); solange die
 * Oberfläche „fr" nicht ganz eingeschaltet ist (E11a-2), zeigt sonst jedes
 * Programm ohne aktiven Sprach-Anbieter die deutsche Fassung.
 *
 * Anrede: <strong>vous</strong> (Lehrkraft-Bereich, F9). Glossar §9.2
 * wörtlich: *Défi*, *Texte de la classe*, *Match de la classe*, *objectif de
 * la semaine*, *Mes classes*, *code de classe*. Kürzer als das Deutsche, wo
 * es geht (§9.1).
 *
 * ★ E11a-5 (26.09.2026): Die frühere „bekannte Lücke" ist geschlossen -
 * `SpaltenHilfe`/`LeistungsstufeHilfe`/`DreiWerteHilfe`
 * (`TastenflowZahlenHilfe.tsx`) haben jetzt eine eigene französische
 * Fassung, und der Schliessen-Knopf von `Modal.tsx` heisst „Fermer la
 * fenêtre" (F18, Johannes: „wer Französisch verwendet, bekommt alles in
 * Französisch").
 */
import { Modal } from "@/components/Modal";
import { RundgangMeineKlassenKnopf } from "@/components/typing/Rundgang";
import {
  DreiWerteHilfe,
  LeistungsstufeHilfe,
  SpaltenHilfe,
} from "@/components/typing/TastenflowZahlenHilfe";
import {
  EINSTIEGSFENSTER_MIN,
  PRUEFUNG_WORT_FR,
  PRUEFUNG_WORT_MEHRZAHL_FR,
} from "@/lib/typing/schreibprobe";

function Abschnitt({ titel, children }: { titel: string; children: React.ReactNode }) {
  return (
    <section className="space-y-1.5">
      <h3 className="m-0 text-base font-semibold text-ink">{titel}</h3>
      <div className="space-y-1.5 text-sm leading-relaxed text-ink">{children}</div>
    </section>
  );
}

function Taste({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-hairline bg-surface-sunken px-1.5 py-0.5 text-sm text-ink">
      {children}
    </kbd>
  );
}

export function MeineKlasseHilfeFranzoesisch({
  onClose,
  programmName,
}: {
  onClose: () => void;
  /** Le programme ouvert - il détermine quelles sections apparaissent. */
  programmName?: string;
}) {
  const tastenflow = programmName === "Tastenflow";
  const W = PRUEFUNG_WORT_FR;
  return (
    <Modal title='Aide pour "Mes classes"' onClose={onClose} size="lg">
      <div className="space-y-5">
        <RundgangMeineKlassenKnopf onStart={onClose} programmName={programmName} />
        <p className="m-0 text-sm leading-relaxed text-ink">
          C'est ici que vous travaillez avec votre classe. Classes et comptes
          se créent <strong>une seule fois</strong> - ils valent pour chaque
          programme, avec le même code de classe et le même mot de passe.
          {tastenflow && (
            <>
              {" "}
              En tant qu'enseignant ou enseignante, ouvrir Tastenflow vous
              amène toujours ici. "M'entrainer" (<Taste>Alt</Taste> +{" "}
              <Taste>U</Taste>) mène à votre propre entrainement.
            </>
          )}
        </p>

        <Abschnitt titel="Comment la page est organisée">
          <p className="m-0">
            <strong>En haut de la classe</strong> figurent son nom - avec
            plusieurs classes, dans la liste déroulante "Classe", pour en
            changer -, le nombre d'élèves et le code de classe. À droite de
            cette ligne, juste avant "Téléchargements", se trouve
            l'interrupteur <strong>"Progrès | Élèves et accès"</strong>{" "}
            - au même endroit sur les deux écrans vers lesquels il mène.
          </p>
          <p className="m-0">
            Sous <strong>"Élèves et accès"</strong>, vous créez une nouvelle
            classe, ajoutez des élèves et les déplacez, consultez les mots de
            passe et les identifiants, le code de classe et les programmes
            dont dispose la classe. Pour ajouter beaucoup d'élèves à la fois,
            utilisez, sous "Élèves", <strong>"Importer des participants
            depuis Excel"</strong> : d'abord "Télécharger le modèle
            (Excel)", puis une ligne par élève avec le nom, le mot de passe
            et - pour Tastenflow - le point de départ. Un mot de passe laissé
            vide en génère un ; un aperçu montre ce qui sera repris, et tous
            les élèves importés apparaissent ensuite sous "Imprimer les
            identifiants". Avec <strong>"Télécharger la liste des
            participants"</strong> juste à côté, vous téléchargez à tout moment un
            fichier Word avec le nom, le mot de passe et le code de classe de
            TOUS les élèves de cette classe - à imprimer.
            {!tastenflow && (
              <>
                {" "}
                Un message à tous les élèves s'écrit là avec "Message à la
                classe".
              </>
            )}
          </p>
          <p className="m-0">
            Sous <strong>"Progrès"</strong> - où vous arrivez en
            ouvrant la page - figurent les programmes de cette classe, les
            "Téléchargements", puis en dessous les statistiques de la
            classe : où en est chaque élève.
            {tastenflow && (
              <>
                {" "}
                Tout en haut, une ligne de boutons : <strong>{W}</strong>,{" "}
                <strong>Texte de la classe</strong>,{" "}
                <strong>Objectif de la semaine</strong>,{" "}
                <strong>Réglages de la classe</strong> et{" "}
                <strong>Verrouiller l'heure</strong>. Chaque bouton ouvre
                sa propre zone en dessous - une seule à la fois, et{" "}
                <Taste>Échap</Taste> la referme. "{W}" ouvre le formulaire
                avec le niveau de touches, le temps en minutes et "Lancer
                maintenant", ainsi que les {PRUEFUNG_WORT_MEHRZAHL_FR}{" "}
                passés ; "Texte de la classe" fixe un texte pour toute la
                classe (fichier à charger, un texte depuis "Mes textes" ou
                un modèle du parcours - les élèves reçoivent alors une
                fenêtre avec juste "Continuer") ; "Objectif de la semaine"
                règle les minutes par semaine ; "Verrouiller l'heure"
                fixe 60 minutes pendant lesquelles la classe continue à
                s'exercer, mais rien ne compte pour l'objectif de la semaine.
                En dessous, l'"Aperçu de la classe" (mois ou année
                scolaire, avec la barre de score et le graphique) ; à droite
                de son en-tête, "Message à la classe" - un message à tous
                les élèves, chacun le reçoit dans sa propre conversation.
              </>
            )}
          </p>
          {tastenflow && (
            <p className="m-0">
              Le bouton <strong>"Réglages de la classe"</strong> de cette
              ligne ouvre : le niveau scolaire (l'application en déduit les
              types de textes et avance chaque année scolaire ; "Adultes" ne
              progresse pas), la langue avec son verrou, le point de départ
              de la classe (il vaut aussi pour les élèves qui arrivent plus
              tard) et le Match de la classe. Ces quatre réglages valent pour
              toute la classe et sont déjà demandés à la création d'une
              classe ; pour chaque élève restent, dans sa ligne dépliée, "Par où
              commencer ?", "Écrire d'une seule main" et "La vitesse ne
              compte pas".
            </p>
          )}
          {tastenflow && (
            <p className="m-0">
              Les niveaux de <strong>"Par où commencer ?"</strong> portent le
              nom des touches : "Débutant" n'est que F et J, "Position de
              départ" toute la rangée de base. Avec{" "}
              <strong>"Premières lettres + majuscules"</strong> s'ajoutent
              les lettres suivantes les plus fréquentes ainsi que Maj.
              "Toutes les lettres", "+ ponctuation", "+ chiffres" et
              "Tout" débloquent ensuite le reste, l'un après l'autre.
            </p>
          )}
          <p className="m-0">
            Chaque bouton s'explique lui-même : l'indication apparait dès que
            le focus l'atteint avec la touche Tab. <Taste>Échap</Taste> la fait disparaitre.
          </p>
        </Abschnitt>

        {tastenflow && (
          <Abschnitt titel={`Le ${W}, étape par étape`}>
            <ol className="m-0 list-decimal space-y-1 pl-5">
              <li>
                Tout en haut des statistiques de la classe, dans la ligne des
                tâches, le bouton "{W}" ouvre le formulaire.
              </li>
              <li>
                Choisir le <strong>niveau de touches</strong> - tous les
                élèves reçoivent le même texte à ce niveau.
              </li>
              <li>
                Indiquer le <strong>temps</strong> en minutes - le champ se
                trouve juste à côté du niveau.
              </li>
              <li>
                Dire aux élèves : <em>Le temps se met à courir dès votre
                première frappe.</em> À partir du lancement, ils ont{" "}
                {EINSTIEGSFENSTER_MIN} minutes pour commencer ; le temps
                s'écoule ensuite séparément pour chaque élève.
              </li>
              <li>
                <strong>"Lancer maintenant"</strong> - le {W} commence
                aussitôt pour toute la classe.
              </li>
              <li>
                Juste après apparait par exemple{" "}
                <strong>"Prêts : 12 sur 14 - pas encore : Said, Jano"</strong>{" "}
                : pour 12 élèves, le {W} est déjà arrivé sur l'appareil. Il y
                arrive après environ une seconde. Si un élève reste longtemps
                sous "pas encore", recharger la page une fois aide en
                général.
              </li>
              <li>
                Pendant que ça tourne, vous voyez "Rendus : 3 sur 18" avec
                les noms.
              </li>
              <li>
                Ensuite, les résultats s'affichent sous le formulaire : pour
                chaque élève le rang, le <strong>score</strong>, si la
                lecture à voix haute était active, les frappes par minute, la
                précision, les caractères, les erreurs et les touches
                instables. Un e-mail récapitulatif suit également.
              </li>
            </ol>
          </Abschnitt>
        )}

        {tastenflow && (
          <>
            <Abschnitt titel="Ce que signifient les colonnes du tableau">
              <SpaltenHilfe />
            </Abschnitt>

            <Abschnitt titel="Ce que signifie le niveau">
              <LeistungsstufeHilfe />
            </Abschnitt>

            <Abschnitt titel="Les valeurs à partir desquelles construire une note">
              <DreiWerteHilfe />
            </Abschnitt>
          </>
        )}

        <Abschnitt titel="Le code de classe">
          <p className="m-0">
            Il figure en haut, à côté du nom de la classe, et vaut pour tous
            les programmes. Pour se connecter, on saisit le code de classe,
            le nom et le mot de passe ; l'appareil retient le code, ensuite
            le nom et le mot de passe suffisent.
          </p>
          <p className="m-0">
            Il est <strong>obligatoire</strong> à la création d'une classe.
            Pendant que vous tapez le nom, l'application propose un code
            adapté - "MS-Wein" devient "MSWEIN". Vous pouvez le modifier,
            mais pas le laisser vide. Il se change plus tard sous "Élèves et
            accès" avec "Modifier".
          </p>
          <p className="m-0">
            ⚠️ Si vous changez le code, tous les élèves de la classe se
            connectent désormais avec le nouveau.
          </p>
        </Abschnitt>

        <Abschnitt titel="Déplacer un élève vers une autre classe">
          <p className="m-0">
            Sous "Élèves et accès", chaque élève a{" "}
            <strong>"Déplacer vers une autre classe"</strong>. Cela ouvre
            le champ "Code de classe de la nouvelle classe". Cela
            fonctionne vers n'importe quelle classe dont vous connaissez le
            code - même la classe d'un autre enseignant ou d'une autre
            enseignante. Avant le déplacement, l'application redemande une
            confirmation.
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              L'élève se connecte ensuite avec le nouveau code de classe.
            </li>
            <li>
              Les enseignants et enseignantes de la nouvelle classe voient
              l'élève et ses progrès.
            </li>
            <li>
              {tastenflow
                ? `Les résultats des ${PRUEFUNG_WORT_MEHRZAHL_FR} passés et les messages restent avec l'ancienne classe.`
                : "Les messages restent avec l'ancienne classe."}
            </li>
          </ul>
        </Abschnitt>

        <Abschnitt titel="Raccourcis clavier de cette zone">
          <p className="m-0">
            <Taste>Alt</Taste> + <Taste>H</Taste> ouvre et ferme cette aide.{" "}
            <Taste>Alt</Taste> + <Taste>T</Taste> affiche la liste de tous
            les raccourcis. <Taste>Alt</Taste> + <Taste>U</Taste> mène à
            votre propre entrainement. <Taste>Alt</Taste> + <Taste>N</Taste>{" "}
            ouvre les messages, <Taste>Alt</Taste> + <Taste>K</Taste> le
            menu des couleurs et du contraste, et <Taste>Alt</Taste> +{" "}
            <Taste>J</Taste> le menu du compte.
          </p>
          <p className="m-0">
            La touche Tab fait défiler les onglets ; Entrée change d'onglet.
            Après un changement, le focus se trouve dans la nouvelle zone -
            une synthèse vocale continue la lecture à partir de là.
          </p>
        </Abschnitt>

        <Abschnitt titel="Pour aller plus loin">
          <p className="m-0">
            Le guide pour les enseignants et enseignantes s'ouvre en haut
            avec "Téléchargements" - vous y trouvez aussi l'affiche
            Tastenflow à imprimer et à afficher (A3), disponible pour tout le
            monde, même sans connexion.
            {tastenflow && (
              <>
                {" "}
                L'aide à l'intérieur du programme lui-même s'y atteint avec{" "}
                <Taste>Alt</Taste> + <Taste>H</Taste>.
              </>
            )}
          </p>
        </Abschnitt>
      </div>
    </Modal>
  );
}
