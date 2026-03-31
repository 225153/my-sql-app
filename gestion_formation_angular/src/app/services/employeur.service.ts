import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employeur } from '../models/employeur.model';

/**
 * Service pour interroger l'API Employeur (Entreprises).
 * S'occupe du Mapping HTTP (GET, POST...)
 */
@Injectable({
  providedIn: 'root'
})
export class EmployeurService {
  private apiUrl = 'http://localhost:8080/api/employeurs';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Employeur[]> { return this.http.get<Employeur[]>(this.apiUrl); }
  getById(id: number): Observable<Employeur> { return this.http.get<Employeur>(`${this.apiUrl}/${id}`); }
  create(employeur: Employeur): Observable<Employeur> { return this.http.post<Employeur>(this.apiUrl, employeur); }
  update(id: number, employeur: Employeur): Observable<Employeur> { return this.http.put<Employeur>(`${this.apiUrl}/${id}`, employeur); }
  delete(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/${id}`); }
}