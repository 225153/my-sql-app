import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Participant } from '../models/participant.model';

/**
 * @Injectable indique que cette classe est un "Service".
 * "providedIn: 'root'" la rend disponible partout sans devoir l'importer manuellement dans un module.
 * Il sert de pont HTTP (Ajax) entre l'application Angular et le Backend Java (Spring Boot).
 */
@Injectable({
  providedIn: 'root'
})
export class ParticipantService {
  
  // L'URL de l'API de base exposée par Spring Boot
  private apiUrl = 'http://localhost:8080/api/participants';

  // Le service HttpClient d'Angular doit être injecté pour préparer les headers, les requêtes type GET, POST, etc.
  constructor(private http: HttpClient) { }

  /**
   * Observable est un type issu de RxJS. Il s'apparente à une "Promise" améliorée.
   * La requête n'est exécutée que lorsque le composant Front-End fait le `.subscribe()`.
   */
  getAll(): Observable<Participant[]> { return this.http.get<Participant[]>(this.apiUrl); }
  
  // POST envoie la copie JSON pour insérer un nouvel enregistrement
  create(participant: Participant): Observable<Participant> { return this.http.post<Participant>(this.apiUrl, participant); }
  
  // PUT met à jour les données à l'adresse ../api/participants/id
  update(id: number, participant: Participant): Observable<Participant> { return this.http.put<Participant>(`${this.apiUrl}/${id}`, participant); }
  
  // DELETE effectue la suppression
  delete(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/${id}`); }
}