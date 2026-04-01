import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const role = this.authService.getRole();
    const user = this.authService.getUsername();
    const pass = this.authService.getPassword();
    
    // Ignore internal auth API login/register
    if (request.url.includes('/api/auth/login') || request.url.includes('/api/auth/register')) {
        return next.handle(request);
    }

    if (request.url.includes('/api/')) {
        // Envoi du Basic Auth custom si renseigné
        let authStr = user && pass ? `${user}:${pass}` : 'user:user';

        const basicAuth = btoa(authStr);

        const cloned = request.clone({
          headers: request.headers.set('Authorization', 'Basic ' + basicAuth)   
        });
        return next.handle(cloned);
    }

    return next.handle(request);
  }
}
