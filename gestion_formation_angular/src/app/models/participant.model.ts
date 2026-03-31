import { Structure } from './structure.model';
import { Profil } from './profil.model';

export interface Participant {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  tel: string;
  structure?: Structure;
  profil?: Profil;
}
