import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Formation } from '../models/formation.model';

/**
 * Service Angular dédié à la gestion des requêtes HTTP pour l'entité "Formation".
 * L'annotation @Injectable({ providedIn: 'root' }) signifie que ce service est un "Singleton",
 * il est instancié une seule fois pour toute l'application et peut être injecté dans n'importe quel composant.
 * 
 * Son rôle est d'agir comme un "Pont" entre le Frontend (Angular) et le Backend (Spring Boot).
 */
@Injectable({
  providedIn: 'root'
})
export class FormationService {

  // L'URL de base correspondant au @RequestMapping("/api/formations") dans le contrôleur Spring Boot
  private apiUrl = 'http://localhost:8080/api/formations';

  /**
   * Injection du module HttpClient d'Angular dans le constructeur.
   * Il fournit les méthodes de facilitation pour exécuter les requêtes (GET, POST, PUT, DELETE).
   */
  constructor(private http: HttpClient) { }

  /**
   * Récupère la liste complète des formations.
   * Retourne un "Observable" : un flux de données asynchrone type "Promesse" avancée.
   * Le composant appelant devra s'y abonner via ".subscribe()" pour déclencher la requête.
   */
  getAll(): Observable<Formation[]> {
    return this.http.get<Formation[]>(this.apiUrl);
  }

  /**
   * Récupère une formation spécifique par son identifiant unique.
   * Construit l'URL dynamiquement (ex: http://localhost:8080/api/formations/5).
   */
  getById(id: number): Observable<Formation> {
    return this.http.get<Formation>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crée une nouvelle formation en envoyant les données dans le corps (Body) de la requête HTTP POST.
   */
  create(formation: Formation): Observable<Formation> {
    return this.http.post<Formation>(this.apiUrl, formation);
  }

  /**
   * Met à jour une formation existante via une requête HTTP PUT.
   */
  update(id: number, formation: Formation): Observable<Formation> {
    return this.http.put<Formation>(`${this.apiUrl}/${id}`, formation);
  }

  /**
   * Demande au serveur de supprimer la formation ciblé via une requête HTTP DELETE.
   */
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /**
   * Méthode avancée : Appelle l'API custom pour associer (Merge) un participant à une session de formation.
   * C'est une requête vide (d'où le {}) car les variables sont passées directement dans l'URL.
   */
  addParticipant(formationId: number, participantId: number): Observable<Formation> {
    return this.http.post<Formation>(`${this.apiUrl}/${formationId}/participants/${participantId}`, {});
  }

  /**
   * Méthode avancée : Appelle l'API custom pour détacher (Unmerge) un participant d'une session de formation.
   */
  removeParticipant(formationId: number, participantId: number): Observable<Formation> {
    return this.http.delete<Formation>(`${this.apiUrl}/${formationId}/participants/${participantId}`);
  }
}
