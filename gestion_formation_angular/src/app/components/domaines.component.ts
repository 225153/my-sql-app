import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomaineService } from '../services/domaine.service';
import { Domaine } from '../models/domaine.model';
import Swal from 'sweetalert2';

// Création d'une alerte personnalisée "Toast" (petite notification discrète qui s'affiche en haut à droite)
const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, timerProgressBar: true });

/**
 * Composant responsable de l'affichage et de la gestion de la page "Domaines"
 * Les attributs "standalone: true" permettent de l'utiliser sans avoir besoin de le déclarer dans un 'app.module.ts'.
 */
@Component({
  selector: 'app-domaines',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card shadow-sm border-0 animate__animated animate__fadeInUp">
      <!-- En-tête de la carte avec une couleur de fond primaire (bleue) -->
      <div class="card-header bg-primary bg-gradient text-white d-flex justify-content-between align-items-center py-3">
        <h5 class="mb-0 fw-bold"><i class="bi bi-tags fs-4 me-2 align-middle"></i>Gestion des Domaines</h5>
      </div>
      <div class="card-body p-4">
        <!-- Formulaire avec validation locale (#f="ngForm"). Si soumis et valide, il appelle sauvegarder() -->
        <form #f="ngForm" (ngSubmit)="f.valid && sauvegarder()" class="row g-3 bg-light p-3 rounded-3 mb-4 shadow-sm border">
          <div class="col-md-8">
            <label class="form-label text-secondary fw-bold small">Nom du domaine <span class="text-danger">*</span></label>
            <!-- L'attribut '[(ngModel)]' crée un lien bidirectionnel (Two-Way Binding) avec la variable 'nouveauDomaine.libelle' TS. -->
            <input type="text" class="form-control" [ngClass]="{'is-invalid': libelle.invalid && (libelle.dirty || libelle.touched)}" placeholder="Ex: Développement Web" [(ngModel)]="nouveauDomaine.libelle" name="libelle" required #libelle="ngModel">
            <div class="invalid-feedback">Le libellé est obligatoire pour le domaine.</div>
          </div>
          <div class="col-md-4 d-flex align-items-end">
            <!-- Bouton d'action dynamique : L'icône et le texte changent si on est en mode édition (editingId != null) -->
            <button type="submit" class="btn btn-success w-100 shadow-sm" [disabled]="f.invalid">
              <i class="bi" [ngClass]="editingId ? 'bi-check2-circle' : 'bi-plus-circle'"></i> {{ editingId ? 'Mettre à jour' : 'Ajouter' }}
            </button>
            <button type="button" *ngIf="editingId" class="btn btn-secondary shadow-sm ms-2" (click)="annulerEdition()">Annuler</button>
          </div>
        </form>

        <div class="table-responsive">
          <table class="table table-hover align-middle border shadow-sm rounded overflow-hidden">
            <thead class="table-light"><tr><th width="10%" class="text-center">ID</th><th>Libellé</th><th width="25%" class="text-center">Actions</th></tr></thead>
            <tbody>
              <!-- Répétition automatique (*ngFor) sur chaque domaine récupéré du backend central -->
              <tr *ngFor="let d of domaines" class="animate__animated animate__fadeIn">
                <td class="text-center"><span class="badge bg-secondary">#{{ d.id }}</span></td>
                <td class="fw-medium text-dark">{{ d.libelle }}</td>
                <td class="text-center">
                  <!-- Déclenche de l'événement TypeScript "editerDomaine" et on lui passe l'objet concerné "d" -->
                  <button class="btn btn-outline-warning btn-sm me-2 rounded-pill px-3" (click)="editerDomaine(d)"><i class="bi bi-pencil"></i> Éditer</button>
                  <button class="btn btn-outline-danger btn-sm rounded-pill px-3" (click)="supprimerDomaine(d.id!)"><i class="bi bi-trash"></i> Supp.</button>
                </td>
              </tr>
              <!-- Condition d'affichage : si le tableau est vide (taille == 0), on montre cette ligne de secours -->
              <tr *ngIf="domaines.length === 0"><td colspan="3" class="text-center text-muted py-5"><i class="bi bi-inbox fs-1 d-block mb-2"></i>Aucun domaine enregistré</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class DomainesComponent implements OnInit {
  
  // Tableau vide initial, sera rempli suite à l'appel API du service.
  domaines: Domaine[] = []; 
  // Modèle local de base pour le formulaire de saisie
  nouveauDomaine: Domaine = { libelle: '' }; 
  // Permet de suivre si l'utilisateur est en train de modifier un domaine existant (contient l'ID du domaine, ou null)
  editingId: number | null = null;
  
  /**
   * Injection automatique du DomaineService permettant la communication REST avec le Backend.
   */
  constructor(private srv: DomaineService) {}
  
  /**
   * Exécutée à la naissance du composant. On lance donc immédiatement la récupération des données de l'API.
   */
  ngOnInit() { this.chargerDomaines(); }
  
  /**
   * Méthode qui interroge et reçoit la liste des domaines en base de données.
   */
  chargerDomaines() { 
    this.srv.getAll().subscribe({ 
      next: d => this.domaines = d, 
      error: e => Toast.fire('Oops...', 'Erreur réseau', 'error') 
    }); 
  }
  
  /**
   * Bascule le composant en mode Edition. Clone les données pour éviter un changement instable dans l'UI.
   */
  editerDomaine(d: Domaine) { 
    this.nouveauDomaine = { ...d }; 
    this.editingId = d.id!; 
  }
  
  /**
   * Sors du mode Édition, puis vide les champs du formulaire.
   */
  annulerEdition() { 
    this.nouveauDomaine = { libelle: '' }; 
    this.editingId = null; 
  }
  
  /**
   * Routage de l'action de sauvegarde (Aiguille vers un Update ou vers un Create selon l'existence de "editingId").
   */
  sauvegarder() {
    if (this.editingId) {
      // Édition
      this.srv.update(this.editingId, this.nouveauDomaine).subscribe({
        next: () => { this.chargerDomaines(); this.annulerEdition(); Toast.fire({icon: 'success', title: 'Domaine mis à jour'}); },
        error: () => Swal.fire('Erreur', 'Impossible de mettre à jour', 'error')
      });
    } else {
      // Création
      this.srv.create(this.nouveauDomaine).subscribe({
        next: () => { this.chargerDomaines(); this.annulerEdition(); Toast.fire({icon: 'success', title: 'Nouveau domaine créé'}); },
        error: () => Swal.fire('Erreur', 'Impossible de créer ce domaine', 'error')
      });
    }
  }
  
  /**
   * Appel API DELETE avec un garde-fou interactif (popup) demandant la confirmation "Êtes-vous sûr".
   * Gestion d'erreur pour éviter des suppressions liées à d'autres entités étrangères.
   */
  supprimerDomaine(id: number) {
    Swal.fire({ title: 'Confirmation', text: "Suppression irréversible du domaine!", icon: 'warning', showCancelButton: true, confirmButtonColor: '#dc3545', cancelButtonColor: '#6c757d', confirmButtonText: 'Oui, supprimer!' }).then((result) => {
      if (result.isConfirmed) {
        this.srv.delete(id).subscribe({
          next: () => { this.chargerDomaines(); Toast.fire({icon: 'success', title: 'Domaine supprimé'}); },
          error: () => Swal.fire('Interdit', 'Ce domaine est déjà utilisé par une formation.', 'error')
        });
      }
    });
  }
}
