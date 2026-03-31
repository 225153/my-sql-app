import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Formateur } from '../models/formateur.model';

/**
 * Service pour la ressource de base de données Formateurs (Professeurs / Formateurs).
 */
@Injectable({
  providedIn: 'root'
})
export class FormateurService {
  private apiUrl = 'http://localhost:8080/api/formateurs';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Formateur[]> { return this.http.get<Formateur[]>(this.apiUrl); }
  create(formateur: Formateur): Observable<Formateur> { return this.http.post<Formateur>(this.apiUrl, formateur); }
  update(id: number, formateur: Formateur): Observable<Formateur> { return this.http.put<Formateur>(`${this.apiUrl}/${id}`, formateur); }
  delete(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/${id}`); }
}