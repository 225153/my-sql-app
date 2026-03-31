import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Structure } from '../models/structure.model';

/**
 * Service API pour la récupération de la liste de dépendance "Structure".
 */
@Injectable({
  providedIn: 'root'
})
export class StructureService {
  private apiUrl = 'http://localhost:8080/api/structures';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Structure[]> { return this.http.get<Structure[]>(this.apiUrl); }
  create(structure: Structure): Observable<Structure> { return this.http.post<Structure>(this.apiUrl, structure); }
  delete(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/${id}`); }
}