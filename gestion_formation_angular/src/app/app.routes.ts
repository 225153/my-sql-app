import { Routes } from '@angular/router';
import { DomainesComponent } from './components/domaines.component';
import { FormationsComponent } from './components/formations.component';
import { EmployeursComponent } from './components/employeurs.component';
import { FormateursComponent } from './components/formateurs.component';
import { ParticipantsComponent } from './components/participants.component';

export const routes: Routes = [
  { path: 'domaines', component: DomainesComponent },
  { path: 'employeurs', component: EmployeursComponent },
  { path: 'formateurs', component: FormateursComponent },
  { path: 'participants', component: ParticipantsComponent },
  { path: 'formations', component: FormationsComponent },
  { path: '', redirectTo: 'formations', pathMatch: 'full' },
  { path: '**', redirectTo: 'formations' }
];
