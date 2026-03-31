import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeurService } from '../services/employeur.service';
import { Employeur } from '../models/employeur.model';
import Swal from 'sweetalert2';

// Configurateur du "toast" (mini popup) utilisé par SweetAlert2.
const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, timerProgressBar: true });

/**
 * Interface Homme-Machine (IHM) responsable de la gestion des employeurs pour le composant Angular.
 * S'occupe d'afficher toutes les entreprises liées aux Formateurs Externes.
 */
@Component({
  selector: 'app-employeurs',
  standalone: true, // Signal qu'il fonctionne indépendamment d'un NgModule.
  imports: [CommonModule, FormsModule], // Le FormsModule prend en charge le "[(ngModel)]" dans le template HTML.
  template: `
    <div class="card shadow-sm border-0 animate__animated animate__fadeInUp">
      <div class="card-header bg-info bg-gradient text-white py-3">
        <h5 class="mb-0 fw-bold"><i class="bi bi-buildings fs-4 me-2 align-middle"></i>Gestion des Employeurs</h5>
      </div>
      <div class="card-body p-4">
        <!-- Formulaire central pour la gestion des données ; [(ngModel)] observe l'attribut 'nouvelEmployeur.nomEmployeur' -->
        <form #f="ngForm" (ngSubmit)="f.valid && sauvegarder()" class="row g-3 bg-light p-3 rounded-3 mb-4 shadow-sm border">
          <div class="col-md-8">
            <label class="form-label text-secondary fw-bold small">Nom de l'employeur / Entreprise <span class="text-danger">*</span></label>
            <input type="text" class="form-control" [ngClass]="{'is-invalid': nomEmp.invalid && (nomEmp.dirty || nomEmp.touched)}" placeholder="Ex: Capgemini, OCP..." [(ngModel)]="nouvelEmployeur.nomEmployeur" name="nomEmp" required #nomEmp="ngModel">
            <!-- Si erreur de saisie ou champ vide, ce bloc s'affiche -->
            <div class="invalid-feedback">Le nom complet de l'employeur est requis.</div>
          </div>
          <div class="col-md-4 d-flex align-items-end">
             <!-- Verrouille le bouton si le formulaire entier (f.invalid) est cassé -->
            <button type="submit" class="btn btn-success w-100 shadow-sm" [disabled]="f.invalid">
              <i class="bi" [ngClass]="editingId ? 'bi-check2-circle' : 'bi-plus-circle'"></i> {{ editingId ? 'Mettre à jour' : 'Ajouter' }}
            </button>
            <button type="button" *ngIf="editingId" class="btn btn-secondary shadow-sm ms-2" (click)="annulerEdition()">Annuler</button>
          </div>
        </form>
        <div class="table-responsive">
          <table class="table table-hover align-middle border shadow-sm rounded overflow-hidden">
            <thead class="table-light"><tr><th width="10%" class="text-center">ID</th><th>Entreprise</th><th width="25%" class="text-center">Actions</th></tr></thead>
            <tbody>
              <!-- Itère sur le tableau stocké au niveau du TypeScript puis génère une ligne pour chaque entreprise. -->
              <tr *ngFor="let e of employeurs" class="animate__animated animate__fadeIn">
                <td class="text-center"><span class="badge bg-secondary">#{{ e.id }}</span></td>
                <td class="fw-medium text-dark"><i class="bi bi-building me-2 text-primary"></i>{{ e.nomEmployeur }}</td>
                <td class="text-center">
                  <!-- Mode édtion et mode suppression -->
                  <button class="btn btn-outline-warning btn-sm me-2 rounded-pill px-3" (click)="editer(e)"><i class="bi bi-pencil"></i></button>
                  <button class="btn btn-outline-danger btn-sm rounded-pill px-3" (click)="supprimer(e.id!)"><i class="bi bi-trash"></i></button>
                </td>
              </tr>
              <!-- Message d'absence de données à afficher si l'Endpoint backend renvoie tableau vide -->
              <tr *ngIf="employeurs.length === 0"><td colspan="3" class="text-center text-muted py-5"><i class="bi bi-inbox fs-1 d-block mb-2"></i>Aucun employeur</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class EmployeursComponent implements OnInit {
  
  // Tableau de stockage lié à l'affichage HTML
  employeurs: Employeur[] = []; 
  // Entité en cours de modifications ou prête à être créée
  nouvelEmployeur: Employeur = { nomEmployeur: '' }; 
  // Jeton indiquant qu'on est en cours d'édition sur une ligne existante plutôt qu'une création
  editingId: number | null = null;
  
  // Importer le service Angular qui appellera ensuite l'API Rest Employeurs
  constructor(private service: EmployeurService) {}
  
  // Lifecycle Hook - lancé une seule fois après la première présentation du composant sur l'écran
  ngOnInit() { 
    this.charger(); 
  }
  
  charger() { 
    this.service.getAll().subscribe(d => this.employeurs = d); 
  }
  
  editer(e: Employeur) { 
    this.nouvelEmployeur = { ...e }; 
    this.editingId = e.id!; 
  }
  
  annulerEdition() { 
    this.nouvelEmployeur = { nomEmployeur: '' }; 
    this.editingId = null; 
  }
  
  sauvegarder() {
    // Si editingId est remplit, cela implique qu'on cherche à changer un objet existant (donc PUT)
    if (this.editingId) {
      this.service.update(this.editingId, this.nouvelEmployeur).subscribe({
        next: () => { this.charger(); this.annulerEdition(); Toast.fire({icon: 'success', title: 'Employeur mis à jour'}); },
        error: () => Swal.fire('Erreur', 'Impossible de mettre à jour', 'error')
      });
    } else {
    // Si editingId est vide/null, c'est l'ajout au Backend par POST !
      this.service.create(this.nouvelEmployeur).subscribe({
        next: () => { this.charger(); this.annulerEdition(); Toast.fire({icon: 'success', title: 'Employeur ajouté'}); },
        error: () => Swal.fire('Erreur', 'Impossible de créer', 'error')
      });
    }
  }
  
  // Effectue une "soft request Delete", affichera d'abord une alerte de validation.
  supprimer(id: number) {
    Swal.fire({ title: 'Supprimer ?', text: "L'employeur sera effacé.", icon: 'warning', showCancelButton: true, confirmButtonColor: '#dc3545', confirmButtonText: 'Supprimer' }).then((r) => {
      if(r.isConfirmed) {
        this.service.delete(id).subscribe({
          next: () => { this.charger(); Toast.fire({icon: 'success', title: 'Supprimé'}); },
          // Message spécifiquement relié pour les rejets liés au Contraintes de SQL ("Ne peut pas supprimer, c'est utile ailleurs !")
          error: () => Swal.fire('Hop là!', 'Cet employeur contient peut-être des formateurs.', 'error')
        });
      }
    });
  }
}
