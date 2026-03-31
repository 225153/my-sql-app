import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormateurService } from '../services/formateur.service';
import { EmployeurService } from '../services/employeur.service';
import { Formateur } from '../models/formateur.model';
import { Employeur } from '../models/employeur.model';
import Swal from 'sweetalert2';

// Un utilitaire SweetAlert qui crée des notifications pop-up ("toasts") discrètes dans un coin de l'écran. 
const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, timerProgressBar: true });

/**
 * Ce composant Angular est dédié à l'interface d'ajout, modification, de listing 
 * et de suppression pour l'entité Formateur.
 */
@Component({
  selector: 'app-formateurs',
  standalone: true, // Angular 17+ : composant ne nécessitant plus d'être déclaré dans un NgModule global.
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card shadow-sm border-0 animate__animated animate__fadeInUp">
      <div class="card-header bg-warning py-3">
        <h5 class="mb-0 fw-bold text-dark"><i class="bi bi-person-workspace fs-4 me-2 align-middle"></i>Gestion des Formateurs</h5>
      </div>
      <div class="card-body p-4">
        <!-- Formulaire de saisie lié aux valeurs de 'nouveau' via [(ngModel)]. Si #f="ngForm" est invalide (f.invalid), le bouton d'envoi sera grisé -->
        <form #f="ngForm" (ngSubmit)="f.valid && sauvegarder()" class="row g-3 bg-light p-4 rounded-3 mb-4 shadow-sm border">
          <div class="col-md-3">
            <label class="form-label text-secondary small fw-bold">Nom <span class="text-danger">*</span></label>
            <input type="text" class="form-control" [ngClass]="{'is-invalid': nom.invalid && nom.touched}" placeholder="Nom" [(ngModel)]="nouveau.nom" name="nom" required #nom="ngModel">
            <div class="invalid-feedback">Requis.</div>
          </div>
          <div class="col-md-3">
            <label class="form-label text-secondary small fw-bold">Prénom <span class="text-danger">*</span></label>
            <input type="text" class="form-control" [ngClass]="{'is-invalid': prenom.invalid && prenom.touched}" placeholder="Prénom" [(ngModel)]="nouveau.prenom" name="prenom" required #prenom="ngModel">
            <div class="invalid-feedback">Requis.</div>
          </div>
          <div class="col-md-4">
            <label class="form-label text-secondary small fw-bold">Email <span class="text-danger">*</span></label>
            <!-- L'attribut email enforce la règle text@text.ext -->
            <input type="email" class="form-control" [ngClass]="{'is-invalid': email.invalid && email.touched}" placeholder="Email pro" [(ngModel)]="nouveau.email" name="email" required email #email="ngModel">
            <div class="invalid-feedback">Un email valide est exigé.</div>
          </div>
          <div class="col-md-2">
            <label class="form-label text-secondary small fw-bold">Statut <span class="text-danger">*</span></label>
            <select class="form-select" [(ngModel)]="nouveau.type" name="type" required #type="ngModel"> 
              <option value="interne">Interne</option>
              <option value="externe">Externe</option>
            </select>
          </div>
          <!-- ngIf n'affiche cette liste de sélection QUE SI le type selectionné dans précédent select dropdown est 'externe' -->
          <div class="col-md-6" *ngIf="nouveau.type === 'externe'">
            <label class="form-label text-secondary small fw-bold">Employeur affilié <span class="text-danger">*</span></label>
            <select class="form-select" [ngClass]="{'is-invalid': empId.invalid && empId.touched}" [(ngModel)]="selectedEmployeurId" name="empId" [required]="nouveau.type === 'externe'" #empId="ngModel">
              <option [ngValue]="null" disabled>-- Sélectionner --</option>
              <option *ngFor="let e of employeurs" [value]="e.id">{{ e.nomEmployeur }}</option>
            </select>
            <div class="invalid-feedback">Veuillez choisir un employeur pour un externe.</div>
          </div>
          <div class="col-12 mt-4 d-flex justify-content-end">
            <!-- Ce bouton n'apparaît qu'en mode édition -->
            <button type="button" *ngIf="editingId" class="btn btn-secondary shadow-sm px-4 me-2" (click)="annuler()">Annuler</button>
            <button type="submit" class="btn btn-primary shadow-sm px-4" [disabled]="f.invalid">
              <i class="bi" [ngClass]="editingId ? 'bi-check2-circle' : 'bi-plus-circle'"></i> {{ editingId ? 'Enregistrer modifs' : 'Créer formateur' }}
            </button>
          </div>
        </form>

        <div class="table-responsive">
          <!-- Le tableau HTML affiche le contenu de "formateurs" retourné par l'API backend -->
          <table class="table table-hover align-middle border shadow-sm rounded overflow-hidden">
            <thead class="table-light"><tr><th>Contact</th><th>Statut</th><th>Employeur</th><th class="text-center">Actions</th></tr></thead>
            <tbody>
              <!-- La directive Angular *ngFor boucle sur l'array stocké dans la classe TypeScript -->
              <tr *ngFor="let formateur of formateurs" class="animate__animated animate__fadeIn">
                <td>
                  <div class="fw-bold">{{ formateur.nom }} {{ formateur.prenom }}</div>
                  <div class="text-muted small"><i class="bi bi-envelope me-1"></i>{{ formateur.email }}</div>
                </td>
                <td>
                  <span class="badge" [ngClass]="formateur.type === 'interne' ? 'bg-success' : 'bg-info text-dark'">
                    <i class="bi" [ngClass]="formateur.type === 'interne' ? 'bi-house-door' : 'bi-briefcase'"></i> {{ formateur.type | uppercase }}
                  </span>
                </td>
                <td>{{ formateur.employeur?.nomEmployeur || '-' }}</td>
                <td class="text-center">
                  <!-- Déclenche l'édition -->
                  <button class="btn btn-outline-warning btn-sm me-2 rounded-circle" (click)="editer(formateur)" title="Editer"><i class="bi bi-pencil"></i></button>
                  <!-- Déclenche la suppression par ID -->
                  <button class="btn btn-outline-danger btn-sm rounded-circle" (click)="supprimer(formateur.id!)" title="Supprimer"><i class="bi bi-trash"></i></button>
                </td>
              </tr>
              <!-- Condition pour gérer une interface vide -->
              <tr *ngIf="formateurs.length === 0"><td colspan="4" class="text-center text-muted py-5"><i class="bi bi-person-x fs-1 d-block mb-2"></i>Aucun formateur</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class FormateursComponent implements OnInit {

  // Tableaux (arrays) qui vont recevoir les données JSON de Spring Boot via le service
  formateurs: Formateur[] = []; 
  employeurs: Employeur[] = [];
  
  // Variables de gestion de l'affichage / formulaire
  selectedEmployeurId: number | null = null; 
  editingId: number | null = null;
  nouveau: any = { nom: '', prenom: '', email: '', tel: '000', type: 'interne' };

  /**
   * Injection des services appelant les endpoints API Backend.
   */
  constructor(private fSrv: FormateurService, private eSrv: EmployeurService) {}
  
  // Exécuté au moment où le composant est inséré dans la page
  ngOnInit() { 
    this.charger(); 
    this.eSrv.getAll().subscribe(d => this.employeurs = d); 
  }
  
  // .subscribe(...) va récupérer la requête Http asynchrone effectuée par FormateurService
  charger() { 
    this.fSrv.getAll().subscribe(d => this.formateurs = d); 
  }     

  editer(f: Formateur) {
    this.nouveau = { ...f }; // Cloner l'objet sans modifier directement l'état de l'array
    this.editingId = f.id!; 
    this.selectedEmployeurId = f.employeur ? f.employeur.id! : null;
  }
  
  annuler() { 
    this.nouveau = { nom: '', prenom: '', email: '', tel: '000', type: 'interne' }; 
    this.editingId = null; 
    this.selectedEmployeurId = null; 
  }

  // Traiter la logique de sauvegarde (PUT si edition, POST si creation)
  sauvegarder() {
    let toSave = { ...this.nouveau };
    
    // Si c'est un formateur "externe", alors il faut attacher la clé primaire de l'Employeur.
    if (this.nouveau.type === 'externe' && this.selectedEmployeurId) {
      toSave.employeur = { id: +this.selectedEmployeurId };
    } else {
      toSave.employeur = null; // Un formateur "interne" n'a pas d'employeur attribué
    }

    if (this.editingId) {
      // Édition d'un formateur existant via PUT //
      this.fSrv.update(this.editingId, toSave).subscribe({
        next: () => { this.charger(); this.annuler(); Toast.fire({icon: 'success', title: 'Mis à jour !'}); },
        error: () => Swal.fire('Erreur', 'Modification échouée', 'error')
      });
    } else {
      // Création d'un nouveau formateur via POST //
      this.fSrv.create(toSave).subscribe({
        next: () => { this.charger(); this.annuler(); Toast.fire({icon: 'success', title: 'Ajouté !'}); },
        error: () => Swal.fire('Erreur', 'Email potentiellement déjà utilisé', 'error')
      });
    }
  }

  // Gère la suppression en appelant HTTP DELETE
  supprimer(id: number) {
    Swal.fire({ title: 'Expulser le formateur?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#dc3545', confirmButtonText: 'Oui' }).then(r => {
      if(r.isConfirmed) {
        this.fSrv.delete(id).subscribe({ 
          next: () => { this.charger(); Toast.fire({icon:'success', title:'Supprimé'}); }, 
          error: () => Swal.fire('Erreur','Formateur lié à une formation.','error') 
        });
      }
    });
  }
}
