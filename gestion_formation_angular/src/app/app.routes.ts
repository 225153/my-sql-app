import { Routes } from '@angular/router';
import { DomainesComponent } from './components/domaines.component';
import { FormationsComponent } from './components/formations.component';
import { EmployeursComponent } from './components/employeurs.component';
import { FormateursComponent } from './components/formateurs.component';
import { ParticipantsComponent } from './components/participants.component';
import { LoginComponent } from './components/auth/login.component';
import { AuthGuard } from './services/auth/auth.guard';
import { StatsComponent } from './components/stats/stats.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'stats', component: StatsComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN', 'RESPONSABLE'] } },
  { path: 'domaines', component: DomainesComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
  { path: 'employeurs', component: EmployeursComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
  { path: 'formateurs', component: FormateursComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN', 'USER'] } },
  { path: 'participants', component: ParticipantsComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN', 'USER'] } },
  { path: 'formations', component: FormationsComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN', 'USER'] } },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];