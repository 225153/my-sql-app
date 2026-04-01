import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Gardien de route pour bloquer l'accès aux pages selon les rôles.
 */
@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const currentUserRole = this.authService.getRole();
        
        if (!currentUserRole) {
            this.router.navigate(['/login']);
            return false;
        }

        // Vérifier les données `roles` configurées dans app.routes.ts
        if (route.data['roles'] && !route.data['roles'].includes(currentUserRole) && currentUserRole !== 'ADMIN') {
            alert('Accès refusé ! Vous n\'avez pas les droits suffisants.');
            this.router.navigate(['/']);
            return false;
        }
        
        return true;
    }
}