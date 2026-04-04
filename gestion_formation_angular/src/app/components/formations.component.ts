import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormationService } from '../services/formation.service';
import { DomaineService } from '../services/domaine.service';
import { FormateurService } from '../services/formateur.service';
import { ParticipantService } from '../services/participant.service';
import { Formation } from '../models/formation.model';
import Swal from 'sweetalert2';
const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, timerProgressBar: true });

@Component({
  // 'selector' définit la balise HTML personnalisée (<app-formations>) à utiliser pour afficher ce composant
  selector: 'app-formations',
  // 'standalone: true' indique que ce composant ne nécessite pas d'être déclaré dans un NgModule global
  standalone: true,
  // 'imports' définit les modules Angular nécessaires (CommonModule pour ngIf/ngFor, FormsModule pour (ngModel))
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card shadow-sm border-0 animate__animated animate__fadeInUp">
      <div class="card-header bg-success bg-gradient text-white py-3">
        <h5 class="mb-0 fw-bold"><i class="bi bi-journal-bookmark-fill fs-4 me-2 align-middle"></i>Programmes & Formations actives</h5>
      </div>
      <div class="card-body p-4">
        <!-- Formulaire principal : lié aux propriétés de l'objet 'nouvelle' via ngModel -->
        <form #f="ngForm" (ngSubmit)="f.valid && sauvegarder()" class="row g-3 bg-light p-4 rounded-3 mb-4 shadow-sm border border-success border-opacity-25">
          <div class="col-md-3">
            <label class="form-label small fw-bold">Titre exact <span class="text-danger">*</span></label>
            <input type="text" class="form-control" [ngClass]="{'is-invalid': titre.invalid && titre.touched}" placeholder="Ex: Angular Avancé" [(ngModel)]="nouvelle.titre" name="titre" required #titre="ngModel">
          </div>
          <div class="col-md-2">
            <label class="form-label small fw-bold">Année <span class="text-danger">*</span></label>
            <input type="number" class="form-control" [ngClass]="{'is-invalid': annee.invalid && annee.touched}" [(ngModel)]="nouvelle.annee" name="annee" required min="2020" max="2100" #annee="ngModel">
            <div class="invalid-feedback">Année invalide</div>
          </div>
          <div class="col-md-2">
            <label class="form-label small fw-bold">Durée (Jours) <span class="text-danger">*</span></label>
            <input type="number" class="form-control" [ngClass]="{'is-invalid': duree.invalid && duree.touched}" [(ngModel)]="nouvelle.duree" name="duree" required min="1" #duree="ngModel">
            <div class="invalid-feedback">>0 !</div>
          </div>
          <div class="col-md-2">
            <label class="form-label small fw-bold">Budget (€) <span class="text-danger">*</span></label>
            <input type="number" class="form-control" [ngClass]="{'is-invalid': budget.invalid && budget.touched}" [(ngModel)]="nouvelle.budget" name="budget" required min="0" #budget="ngModel">
            <div class="invalid-feedback">Positif !</div>
          </div>
          <div class="col-md-3">
            <label class="form-label small fw-bold">Domaine <span class="text-danger">*</span></label>
            <select class="form-select" [ngClass]="{'is-invalid': dom.invalid && dom.touched}" [(ngModel)]="nouvelle.domaine" name="dom" required #dom="ngModel">
              <option disabled [ngValue]="null">---</option>
              <option *ngFor="let d of domaines" [ngValue]="d">{{ d.libelle }}</option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label small fw-bold">Formateur principal <span class="text-danger">*</span></label>
            <select class="form-select" [ngClass]="{'is-invalid': formateur.invalid && formateur.touched}" [(ngModel)]="nouvelle.formateur" name="for" required #formateur="ngModel">
              <option disabled [ngValue]="null">---</option>
              <option *ngFor="let f of formateurs" [ngValue]="f">{{ f.nom }} {{ f.prenom }}</option>
            </select>
          </div>
          <div class="col-md-8 d-flex align-items-end justify-content-end">
            <button type="button" class="btn btn-secondary shadow-sm px-4 me-2" *ngIf="editingId" (click)="annuler()">Annuler</button>
            <button type="submit" class="btn btn-success shadow-sm px-5" [disabled]="f.invalid"><i class="bi bi-cassette me-1"></i> {{ editingId ? 'Mettre à jour' : 'Lancer cette Formation' }}</button>
          </div>
        </form>

        <!-- Tableau d'affichage de la liste des formations avec leurs relations (participants, formateur, domaine) -->
        <div class="table-responsive">
          <table class="table table-hover align-middle border shadow-sm rounded overflow-hidden">    
            <thead class="table-light"><tr><th width="8%">Ordre</th><th>Titre de la Formation</th><th>Ressources</th><th>Affectations</th><th>Trombinoscope inscrits</th><th class="text-center">Action</th></tr></thead>
            <tbody>
              <!-- La directive *ngFor itère sur le tableau 'formations' chargé depuis le backend -->
              <tr *ngFor="let f of formations" class="animate__animated animate__fadeIn">
                <td><span class="badge bg-success rounded-circle p-2 px-3 fs-6">{{ f.id }}</span></td>
                <td>
                  <strong class="text-success fs-5">{{ f.titre }}</strong><br>
                  <!-- Interpolation (moustaches {{}}) pour afficher les données dynamiquement -->
                  <span class="badge bg-light text-dark border me-1"><i class="bi bi-calendar"></i> {{ f.annee }}</span>
                  <span class="badge bg-light text-dark border"><i class="bi bi-clock"></i> {{ f.duree }} Jours</span>
                </td>
                <td>
                   <div class="text-muted small fw-bold"><i class="bi bi-piggy-bank"></i> Budget: <span class="text-success">{{ f.budget }} €</span></div>
                </td>
                <td>
                   <div><i class="bi bi-tag text-primary me-1"></i> <small>{{ f.domaine?.libelle }}</small></div>
                   <div><i class="bi bi-person-workspace text-warning me-1"></i> <small>{{ f.formateur?.nom }} {{ f.formateur?.prenom }}</small></div>
                </td>
                <td>
                  <!-- Gestion dynamique de la sous-liste des participants liés à cette formation précise -->
                  <div class="mb-2">
                    <span class="badge bg-primary px-3 py-2 me-1 mb-1 shadow-sm rounded-pill" *ngFor="let p of f.participants">
                      <i class="bi bi-person me-1"></i> {{ p.nom }} {{ p.prenom }}
                      <a style="cursor:pointer; margin-left: 8px; font-size: 1.1em;" class="text-white" title="Retirer" (click)="retirerParticipant(f.id!, p.id!)"><i class="bi bi-x-circle-fill"></i></a>
                    </span>
                    <span *ngIf="!f.participants || f.participants.length === 0" class="text-muted fst-italic small"><i class="bi bi-emoji-frown"></i> Aucun inscrit pour le moment</span>
                  </div>
                  <!-- Mini formulaire intégré pour ajouter un participant à cette ligne (formation courante) -->
                  <div class="input-group input-group-sm mt-2 shadow-sm" style="max-width:300px">
                    <span class="input-group-text bg-light"><i class="bi bi-person-plus-fill"></i></span>
                    <select class="form-select" #partSelect>
                      <option value="" disabled selected>Inviter un candidat...</option>      
                      <!-- Charge les participants globaux pour les proposer dans la liste déroulante -->
                      <option *ngFor="let p of participants" [value]="p.id">{{ p.nom }} {{ p.prenom }}</option>
                    </select>
                    <!-- Transmission de partSelect.value (ID en string) et remise à vide après le clic -->
                    <button class="btn btn-outline-success fw-bold px-3" (click)="ajouterParticipant(f.id!, partSelect.value); partSelect.value=''">OK</button>
                  </div>
                </td>
                <td class="text-center">
                  <div class="d-flex justify-content-center">
                    <button class="btn btn-outline-warning btn-sm me-1" title="Modifier" (click)="editer(f)"><i class="bi bi-pencil-square"></i></button>
                    <button class="btn btn-outline-danger btn-sm" title="Annihiler" (click)="supprimerFormation(f.id!)"><i class="bi bi-trash-fill"></i></button>
                  </div>
                </td>
              </tr>
              <!-- Message de secours si le tableau reçu est complètement vide -->
              <tr *ngIf="formations.length === 0"><td colspan="6" class="text-center text-muted py-5"><i class="bi bi-journal-x fs-1 d-block mb-2"></i>Le catalogue tourne à vide</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class FormationsComponent implements OnInit {
  // Tableaux qui contiendront les données chargées depuis la base (vides au départ)
  formations: Formation[] = []; 
  domaines: any[] = []; 
  formateurs: any[] = []; 
  participants: any[] = [];

  // Indicateur d'état : null si on crée une nouvelle formation, contient l'ID si on modifie une existante
  editingId: number | null = null;
  
  // Objet temporaire "moule" lié au formulaire. Initialisé avec des valeurs par défaut pour assister l'utilisateur
  nouvelle: any = { titre: '', annee: new Date().getFullYear(), duree: 3, budget: 1000, domaine: null, formateur: null };

  /**
   * Le constructeur injecte les différents services nécessaires pour faire des appels HTTP vers le backend Spring.
   * L'injection de dépendances d'Angular garantit qu'on utilise une instance unique de chaque service.
   */
  constructor(
    private fSrv: FormationService, 
    private dSrv: DomaineService, 
    private formSrv: FormateurService, 
    private pSrv: ParticipantService
  ) {}

  /**
   * Événement de cycle de vie Angular : 'ngOnInit' se déclenche automatiquement
   * juste après l'initialisation du composant. On s'en sert pour charger les listes initiales.
   */
  ngOnInit() { 
    this.chargerFormations(); 
    // On charge aussi les Domaines, Formateurs et Participants pour hydrater les listes déroulantes (<select>)
    // Les catchError évitent les erreurs 403 visibles si l'utilisateur n'a pas les droits ADMIN
    this.dSrv.getAll().subscribe({ next: d => this.domaines = d, error: () => this.domaines = [] }); 
    this.formSrv.getAll().subscribe({ next: d => this.formateurs = d, error: () => this.formateurs = [] }); 
    this.pSrv.getAll().subscribe({ next: p => this.participants = p, error: () => this.participants = [] }); 
  }

  /**
   * Recharge la liste intégrale des formations (table principale de l'écran).
   * L'observable renvoyé par '.getAll()' est écouté via 'subscribe()'.
   */
  chargerFormations() { 
    this.fSrv.getAll().subscribe({ 
      next: d => this.formations = d, 
      error: e => console.error(e) 
    }); 
  }

  /**
   * Prépare le formulaire pour l'édition d'une formation existante.
   * On clone l'objet pour ne pas modifier la ligne du tableau avant la sauvegarde en base.
   */
  editer(f: Formation) {
    this.nouvelle = { ...f };
    // On doit retrouver l'objet exact dans nos listes pour que le <select> HTML s'affiche correctement
    this.nouvelle.domaine = this.domaines.find(d => d.id === f.domaine?.id) || null;
    this.nouvelle.formateur = this.formateurs.find(form => form.id === f.formateur?.id) || null;
    this.editingId = f.id!; // Verrouille le mode "Édition" sur cet ID
  }

  /**
   * Annule l'édition en cours, vide le formulaire et réinitialise les variables par défaut.
   */
  annuler() { 
    this.nouvelle = { titre: '', annee: new Date().getFullYear(), duree: 3, budget: 1000, domaine: null, formateur: null }; 
    this.editingId = null; 
  }

  /**
   * Déclenchée par l'envoi du formulaire (ngSubmit).
   * Vérifie le mode (Création vs Édition) et appelle le service concerné (POST vs PUT).
   */
  sauvegarder() {
    if (this.editingId) {
      // Mode mise à jour (PUT)
      this.fSrv.update(this.editingId, this.nouvelle).subscribe(() => { 
        this.chargerFormations(); // Rafraîchit visuellement le tableau
        this.annuler(); // Ferme le mode édition
        Toast.fire({icon:'success',title:'Mise à jour effectuée'}); // Petit popup discret
      });
    } else {
      // Mode création (POST)
      this.fSrv.create(this.nouvelle).subscribe(() => { 
        this.chargerFormations(); 
        this.annuler(); 
        Toast.fire({icon:'success',title:'Formation ouverte !'}); 
      });
    }
  }

  /**
   * Affiche une pop-up de sécurité demandant confirmation avant de contacter le backend pour effacer une donnée.
   */
  supprimerFormation(id: number) {
    Swal.fire({ title: 'Destruction de la formation?', text:'Les notes et présences disparaîtront', icon: 'warning', showCancelButton: true, confirmButtonColor: '#dc3545', confirmButtonText: 'Oui, détruire' }).then(r => {
      // Règle if(r.isConfirmed) pour s'assurer que l'utilisateur n'a pas cliqué sur annuler
      if(r.isConfirmed) this.fSrv.delete(id).subscribe(() => { 
        this.chargerFormations(); Toast.fire({icon:'success', title:'Opération terminée'}); 
      });
    });
  }

  /**
   * Action sur mesure : appelle le Endpoint custom du backend pour ajouter un participant à une session de formation.
   */
  ajouterParticipant(formationId: number, participantId: string) {        
    if (!participantId) return; // Sécurité de saisie
    // Le '+' force la conversion de la chaine string HTML vers le type number TypeScript
    this.fSrv.addParticipant(formationId, +participantId).subscribe({ 
      next: () => { this.chargerFormations(); Toast.fire({icon:'success',title:'Recruté !'}); }, 
      error: () => Swal.fire('Oups', 'Un problème est survenu', 'error') 
    });
  }

  /**
   * Inverse du recrutement, décroche une association Many-to-Many Formation<->Participant.
   */
  retirerParticipant(formationId: number, participantId: number) {   
    Swal.fire({ title: 'Révoquer?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#ffc107', confirmButtonText: 'Révoquer' }).then(r=>{  
      if(r.isConfirmed) this.fSrv.removeParticipant(formationId, participantId).subscribe({ 
        next: () => { this.chargerFormations(); Toast.fire({icon:'info',title:'Rappelé.'}); }, 
        error: () => console.error('Erreur') 
      });
    });
  }
}
