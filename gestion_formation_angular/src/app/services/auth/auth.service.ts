import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Service gérant l'authentification et les rôles.
 * Simule une connexion avec rôles distincts (ADMIN, RESPONSABLE, USER)
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserRole = new BehaviorSubject<string | null>(null);
  public role$ = this.currentUserRole.asObservable();

  constructor() {}

  // Backwards compatibility for other components
  login(role: string) {
    this.loginAs(role.toLowerCase(), role.toLowerCase(), role);
  }

  // Injecting exact credentials (e.g. dynamic signup testing)
  loginAs(user: string, pass: string, role: string) {
    this.currentUserRole.next(role);
    localStorage.setItem('role', role);
    localStorage.setItem('username', user);
    localStorage.setItem('password', pass);
  }

  logout() {
    this.currentUserRole.next(null);
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('password');
  }

  getRole(): string | null {
    return this.currentUserRole.value || localStorage.getItem('role');
  }

  getUsername(): string {
    return localStorage.getItem('username') || '';
  }

  getPassword(): string {
    return localStorage.getItem('password') || '';
  }

  hasRole(role: string): boolean {
    return this.getRole() === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const currentRole = this.getRole();
    if (!currentRole) return false;
    return roles.includes(currentRole);
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  isResponsable(): boolean {
    return this.hasRole('RESPONSABLE');
  }

  isUser(): boolean {
    return this.hasRole('USER');
  }
}
