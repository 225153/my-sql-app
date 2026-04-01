import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container text-center mt-5">
      <h2>Connexion au Portail</h2>
      <p class="text-muted">Connectez-vous ou choisissez un compte par défaut</p>

      <div class="row justify-content-center mt-4">
        
        <!-- Formulaire de Login / Signup (Role USER) -->
        <div class="col-md-5 mb-3">
          <div class="card shadow-sm h-100 border-secondary">
            <div class="card-body text-start">
              <h5 class="card-title text-success text-center"><i class="bi bi-person"></i> Utilisateur</h5>
              <p class="card-text small text-center">Créer un compte ou se connecter (S'inscrire si nouveau).</p>
              
              <div *ngIf="errorMessage" class="alert alert-danger p-2 small">{{ errorMessage }}</div>
              <div *ngIf="successMessage" class="alert alert-success p-2 small">{{ successMessage }}</div>

              <div class="mb-2">
                <label>Nom d'utilisateur <span class="text-danger">*</span></label>
                <input type="text" class="form-control" [(ngModel)]="username" placeholder="Saisir votre pseudo">
              </div>
              <div class="mb-3">
                <label>Mot de passe <span class="text-danger">*</span></label>
                <input type="password" class="form-control" [(ngModel)]="password" placeholder="Saisir votre mot de passe">
              </div>
              <div class="d-grid gap-2">
                <button class="btn btn-success" [title]="(!username || !password) ? 'Veuillez remplir tous les champs' : ''" [disabled]="!username || !password" (click)="customLogin()">Se connecter</button>
                <button class="btn btn-outline-success" [title]="(!username || !password) ? 'Veuillez remplir tous les champs' : ''" [disabled]="!username || !password" (click)="customSignup()">Créer un compte</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Formulaire Responsable -->
        <div class="col-md-3 mb-3">
          <div class="card shadow-sm h-100 border-primary">
            <div class="card-body text-start">
              <h5 class="card-title text-primary"><i class="bi bi-pie-chart"></i> Responsable</h5>
              <p class="card-text small">Consulter les statistiques.</p>

              <div *ngIf="respError" class="alert alert-danger p-2 small">{{ respError }}</div>

              <div class="mb-2">
                <input type="text" class="form-control form-control-sm" placeholder="Nom d'utilisateur *" [(ngModel)]="respUsername">
              </div>
              <div class="mb-3">
                <input type="password" class="form-control form-control-sm" placeholder="Mot de passe *" [(ngModel)]="respPassword">
              </div>
              <button class="btn btn-primary btn-sm w-100" [title]="(!respUsername || !respPassword) ? 'Veuillez remplir tous les champs' : ''" [disabled]="!respUsername || !respPassword" (click)="respLogin()">Se connecter</button>
            </div>
          </div>
        </div>

        <!-- Formulaire Admin -->
        <div class="col-md-3 mb-3">
          <div class="card shadow-sm h-100 border-danger">
            <div class="card-body text-start">
              <h5 class="card-title text-danger"><i class="bi bi-shield-lock"></i> Admin</h5>
              <p class="card-text small">Accès illimité.</p>

              <div *ngIf="adminError" class="alert alert-danger p-2 small">{{ adminError }}</div>

              <div class="mb-2">
                <input type="text" class="form-control form-control-sm" placeholder="Nom d'utilisateur *" [(ngModel)]="adminUsername">
              </div>
              <div class="mb-3">
                <input type="password" class="form-control form-control-sm" placeholder="Mot de passe *" [(ngModel)]="adminPassword">
              </div>
              <button class="btn btn-danger btn-sm w-100" [title]="(!adminUsername || !adminPassword) ? 'Veuillez remplir tous les champs' : ''" [disabled]="!adminUsername || !adminPassword" (click)="adminLogin()">Se connecter</button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  successMessage = '';

  respUsername = '';
  respPassword = '';
  respError = '';

  adminUsername = '';
  adminPassword = '';
  adminError = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  customLogin() {
    if (!this.username || !this.password) {
      this.errorMessage = "Veuillez remplir tous les champs.";
      return;
    }
    
    // Simulate login call to check validity
    this.http.post('http://localhost:8080/api/auth/login', { login: this.username, password: this.password })
      .subscribe({
        next: (res: any) => {
          this.authService.loginAs(this.username, this.password, 'USER'); // Set USER explicitly as mock
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.errorMessage = "Login ou mot de passe incorrect";
        }
      });
  }

  customSignup() {
    if (!this.username || !this.password) {
      this.errorMessage = "Veuillez remplir tous les champs pour vous inscrire.";
      return;
    }
    
    this.http.post('http://localhost:8080/api/auth/register', { login: this.username, password: this.password }, { responseType: 'text' })
      .subscribe({
        next: (res: any) => {
          this.successMessage = "Compte créé avec succès ! Connectez-vous.";
          this.errorMessage = '';
        },
        error: (err) => {
          this.errorMessage = "Erreur lors de l'inscription. L'utilisateur existe peut-être déjà.";
        }
      });
  }

  adminLogin() {
    if (!this.adminUsername || !this.adminPassword) {
      this.adminError = "Veuillez remplir tous les champs.";
      return;
    }
    
    this.http.post('http://localhost:8080/api/auth/login', { login: this.adminUsername, password: this.adminPassword })
      .subscribe({
        next: (res: any) => {
          this.authService.loginAs(this.adminUsername, this.adminPassword, 'ADMIN');
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.adminError = "Identifiants Admin incorrects";
        }
      });
  }

  respLogin() {
    if (!this.respUsername || !this.respPassword) {
      this.respError = "Veuillez remplir tous les champs.";
      return;
    }
    
    this.http.post('http://localhost:8080/api/auth/login', { login: this.respUsername, password: this.respPassword })
      .subscribe({
        next: (res: any) => {
          this.authService.loginAs(this.respUsername, this.respPassword, 'RESPONSABLE');
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.respError = "Identifiants Responsable incorrects";
        }
      });
  }

  fixedLogin(user: string, pass: string, role: string) {
    this.authService.loginAs(user, pass, role);
    this.router.navigate(['/']);
  }
}
