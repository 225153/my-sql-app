/**
 * Interface Formateur.
 * C'est l'un des piliers des formulaires Angular et des appels HTTP.
 * Elle sert de structure mémoire stricte lors de la réception des données (GET).
 */
export interface Formateur {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  tel: string;
  type: string;
  employeur?: any; // Nous pourrions typer l'employeur si nécessaire.
}
