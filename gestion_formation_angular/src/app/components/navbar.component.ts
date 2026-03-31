import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3 mb-4">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center animate__animated animate__fadeInLeft" routerLink="/">
          <i class="bi bi-mortarboard fs-2 me-2 text-warning"></i>
          <span class="fw-bold fs-4">GestionFormation <span class="text-warning">Pro</span></span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse animate__animated animate__fadeInDown" id="navbarNav">
          <ul class="navbar-nav ms-auto fw-semibold">
            <li class="nav-item"><a class="nav-link px-3" routerLink="/domaines" routerLinkActive="active"><i class="bi bi-tags me-1"></i> Domaines</a></li>
            <li class="nav-item"><a class="nav-link px-3" routerLink="/employeurs" routerLinkActive="active"><i class="bi bi-buildings me-1"></i> Employeurs</a></li>
            <li class="nav-item"><a class="nav-link px-3" routerLink="/formateurs" routerLinkActive="active"><i class="bi bi-person-workspace me-1"></i> Formateurs</a></li>
            <li class="nav-item"><a class="nav-link px-3" routerLink="/participants" routerLinkActive="active"><i class="bi bi-people me-1"></i> Participants</a></li>
            <li class="nav-item ms-lg-3"><a class="nav-link btn btn-warning text-dark px-4 rounded-pill shadow-sm animate__animated animate__pulse animate__infinite animate__slower" routerLink="/formations" routerLinkActive="bg-warning text-dark"><i class="bi bi-journal-bookmark-fill me-1"></i> Formations</a></li>
          </ul>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {}
