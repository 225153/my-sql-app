import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParticipantService } from '../services/participant.service';
import { StructureService } from '../services/structure.service';
import { ProfilService } from '../services/profil.service';
import { Participant } from '../models/participant.model';
import Swal from 'sweetalert2';

// Constante pour afficher les petites fenêtres de confirmation de durée 3 secondes.
const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, timerProgressBar: true });

/**
 * Composant de la page Participant. Réalise la liaison entre la liste des utilisateurs,
 * mais aussi leurs tables dépendantes comme "structure" et "profil".
 */
@Component({
  selector: 'app-participants',
  standalone: true, // Support Angular 17+
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card shadow-sm border-0 animate__animated animate__fadeInUp">
      <div class="card-header bg-secondary bg-gradient text-white py-3">
        <h5 class="mb-0 fw-bold"><i class="bi bi-people fs-4 me-2 align-middle"></i>Gestion des Participants</h5>
      </div>
      <div class="card-body p-4">
        
        <!-- Bloc pratique pour créer de nouvelles Structures ou Profils liés directement depuis cet écran ("One-Page Experience") -->
        <div class="row mb-4 align-items-end p-3 bg-white border rounded shadow-sm">
           <p class="small text-muted mb-2 fw-bold"><i class="bi bi-gear-fill me-1"></i> Données rapides</p>
           <div class="col-md-5">
             <div class="input-group input-group-sm">
               <!-- L'attribut [(ngModel)] capture le texte directement pour la création express -->
               <input type="text" class="form-control" placeholder="Nouvelle structure (ex: Fac de Rabat)" [(ngModel)]="nouvelleStructure">
               <button class="btn btn-outline-secondary fw-bold" (click)="addStructure()">+ AJOUTER</button>
             </div>
           </div>
           <div class="col-md-2 text-center text-muted"> <small>OU</small> </div>
           <div class="col-md-5">
             <div class="input-group input-group-sm">
               <input type="text" class="form-control" placeholder="Nouveau profil (ex: Ingénieur)" [(ngModel)]="nouveauProfil">
               <button class="btn btn-outline-secondary fw-bold" (click)="addProfil()">+ AJOUTER</button>
             </div>
           </div>
        </div>

        <!-- Formulaire de création / modification principal -->
        <form #f="ngForm" (ngSubmit)="f.valid && sauvegarder()" class="row g-3 bg-light p-4 rounded-3 mb-4 shadow-sm border">
          <div class="col-md-3">
            <label class="form-label small fw-bold">Nom <span class="text-danger">*</span></label>
            <input type="text" class="form-control" [ngClass]="{'is-invalid': nom.invalid && nom.touched}" placeholder="Nom" [(ngModel)]="nouveau.nom" name="nom" required #nom="ngModel">
          </div>
          <div class="col-md-3">
            <label class="form-label small fw-bold">Prénom <span class="text-danger">*</span></label>
            <input type="text" class="form-control" [ngClass]="{'is-invalid': prenom.invalid && prenom.touched}" placeholder="Prénom" [(ngModel)]="nouveau.prenom" name="prenom" required #prenom="ngModel">
          </div>
          <div class="col-md-6">
            <label class="form-label small fw-bold">Email <span class="text-danger">*</span></label>
            <input type="email" class="form-control" [ngClass]="{'is-invalid': email.invalid && email.touched}" placeholder="Email" [(ngModel)]="nouveau.email" name="email" required email #email="ngModel">
            <div class="invalid-feedback">Email valide requis</div>
          </div>
          <!-- Selection de la structure avec le tableau "structures" préchargé via *ngFor -->
          <div class="col-md-4">
            <label class="form-label small fw-bold">Structure <span class="text-danger">*</span></label>
            <select class="form-select" [(ngModel)]="nouveau.structure" name="stru" required #stru="ngModel" [ngClass]="{'is-invalid': stru.invalid && stru.touched}">
              <option disabled [ngValue]="null">-- Choisir --</option>      
              <option *ngFor="let s of structures" [ngValue]="s">{{ s.libelle }}</option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label small fw-bold">Profil <span class="text-danger">*</span></label>
            <select class="form-select" [(ngModel)]="nouveau.profil" name="prof" required #prof="ngModel" [ngClass]="{'is-invalid': prof.invalid && prof.touched}">
              <option disabled [ngValue]="null">-- Choisir --</option>
              <option *ngFor="let p of profils" [ngValue]="p">{{ p.libelle }}</option>
            </select>
          </div>
          <div class="col-md-4 d-flex align-items-end">
            <!-- Bouton d'action principal conditionné par la validité [disabled]="f.invalid" du formulaire -->
            <button type="submit" class="btn btn-primary w-100 shadow-sm" [disabled]="f.invalid"><i class="bi bi-person-plus-fill me-1"></i> {{ editingId ? 'Valider' : 'Inscrire' }}</button>
            <button type="button" *ngIf="editingId" class="btn btn-secondary ms-2 shadow-sm" (click)="annuler()">Annuler</button>
          </div>
        </form>

        <div class="table-responsive">
          <table class="table table-hover align-middle border shadow-sm rounded overflow-hidden">
            <thead class="table-light"><tr><th>Identité</th><th>Structure</th><th>Profil</th><th class="text-center">Actions</th></tr></thead>
            <tbody>
              <!-- Boucle itérative pour afficher le JSON retourné par ParticipantService sous forme de tableau visuel -->
              <tr *ngFor="let p of participants" class="animate__animated animate__fadeIn">
                <td>
                  <div class="fw-bold">{{ p.nom }} {{ p.prenom }}</div>
                  <div class="text-muted small"><i class="bi bi-envelope"></i> {{ p.email }}</div>
                </td>
                <td><span class="badge bg-light text-dark border"><i class="bi bi-bank me-1"></i>{{ p.structure?.libelle }}</span></td>
                <td><span class="badge bg-secondary"><i class="bi bi-person-lines-fill me-1"></i>{{ p.profil?.libelle }}</span></td>
                <td class="text-center">
                  <!-- Action Modifier & Action Supprimer -->
                  <button class="btn btn-outline-warning btn-sm me-2 rounded-circle" (click)="editer(p)"><i class="bi bi-pencil"></i></button>
                  <button class="btn btn-outline-danger btn-sm rounded-circle" (click)="supprimer(p.id!)"><i class="bi bi-trash"></i></button>
                </td>
              </tr>
              <tr *ngIf="participants.length === 0"><td colspan="4" class="text-center text-muted py-5"><i class="bi bi-people fs-1 d-block mb-2"></i>Aucun participant</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ParticipantsComponent implements OnInit {

  // Variables liées à la vue
  participants: Participant[] = []; 
  structures: any[] = []; 
  profils: any[] = [];
  
  // Modèles temporaires pour les ajouts express
  nouvelleStructure: string = ''; 
  nouveauProfil: string = '';
  editingId: number | null = null;
  
  // Modèle vierge prêt pour peupler le formulaire (inclut structure null / profil null requis pour les Foreign Keys)
  nouveau: any = { nom: '', prenom: '', email: '', tel: '000', structure: null, profil: null };

  /**
   * C'est ici, via l'injection dans le constructeur, qu'on importe 3 services distincts 
   * pour interroger nos 3 endpoints API respectifs
   */
  constructor(private pSrv: ParticipantService, private sSrv: StructureService, private profSrv: ProfilService) {}
  
  ngOnInit() { 
    this.charger();     // Charge la liste des participants
    this.chargerSP();   // Charge les dictionnaires liés (Structure & Profil)
  }
  
  charger() { 
    this.pSrv.getAll().subscribe(d => this.participants = d); 
  }   

  chargerSP() { 
    this.sSrv.getAll().subscribe(d => this.structures = d); 
    this.profSrv.getAll().subscribe(d => this.profils = d); 
  }

  /**
   * Action Express : Envoie le string en tant qu'objet JSON { libelle: "nom" } dans l'API puis actualise la vue
   */
  addStructure() { 
    if(this.nouvelleStructure){ 
      this.sSrv.create({libelle: this.nouvelleStructure}).subscribe(()=>{
        this.chargerSP(); Toast.fire({icon:'success',title:'Structure ajoutée'}); this.nouvelleStructure='';
      }); 
    } 
  }

  addProfil() { 
    if(this.nouveauProfil){ 
      this.profSrv.create({libelle: this.nouveauProfil}).subscribe(()=>{
        this.chargerSP(); Toast.fire({icon:'success',title:'Profil ajouté'}); this.nouveauProfil='';
      }); 
    } 
  }  

  /**
   * Charge le mode d'édition. Utilise le 'find' pour relier spécifiquement l'objet aux listes déroulantes (<select>).
   */
  editer(p: Participant) {
    this.nouveau = { ...p };
    this.nouveau.structure = this.structures.find(s => s.id === p.structure?.id) || null;
    this.nouveau.profil = this.profils.find(pr => pr.id === p.profil?.id) || null;
    this.editingId = p.id!;
  }
  
  annuler() { 
    this.nouveau = { nom: '', prenom: '', email: '', tel: '000', structure: null, profil: null }; 
    this.editingId = null; 
  }

  sauvegarder() {
    // Mesure de sécurité pour assurer que la relation a été sélectionnée.
    if (this.nouveau.structure && this.nouveau.profil) {
      if (this.editingId) {
        // Envoi au Backend sur l'endpoint PUT
        this.pSrv.update(this.editingId, this.nouveau).subscribe({
          next: () => { this.charger(); this.annuler(); Toast.fire({icon:'success',title:'Mise à jour réussie'}); },
          error: () => Swal.fire('Erreur', 'Modification impossible', 'error')
        });
      } else {
        // Envoi au Backend sur l'endpoint POST
        this.pSrv.create(this.nouveau).subscribe({
          next: () => { this.charger(); this.annuler(); Toast.fire({icon:'success',title:'Inscrit !'}); },
          error: () => Swal.fire('Erreur', 'Email potentiellement déjà utilisé', 'error')
        });
      }
    }
  }

  supprimer(id: number) {
    Swal.fire({ title: 'Désinscrire ce participant?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#dc3545', confirmButtonText: 'Absolument' }).then(r => {
      if(r.isConfirmed) this.pSrv.delete(id).subscribe({ 
        next: () => { this.charger(); Toast.fire({icon:'success',title:'Retiré'}); }, 
        // Gestion des erreurs métier (Ex : ce participant est assigné aux tables de relation de Formations, MySQL bloque la destruction)
        error: () => Swal.fire('Impossible', 'Membre affecté à une formation', 'error') 
      });
    });
  }
}
