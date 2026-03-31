import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profil } from '../models/profil.model';

@Injectable({
  providedIn: 'root'
})
export class ProfilService {
  private apiUrl = 'http://localhost:8080/api/profils';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Profil[]> { return this.http.get<Profil[]>(this.apiUrl); }
  create(profil: Profil): Observable<Profil> { return this.http.post<Profil>(this.apiUrl, profil); }
  delete(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/${id}`); }
}