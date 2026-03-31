/**
 * Interface du domaine d'activité.
 * L'id est optionnel "?" pour permettre la création de l'objet côté UI avant insertion en bdd.
 */
export interface Domaine {
  id?: number;
  libelle: string;
}
