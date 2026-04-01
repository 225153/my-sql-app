import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { FormationService } from '../../services/formation.service';
import { ParticipantService } from '../../services/participant.service';
import { FormateurService } from '../../services/formateur.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="container mt-5 fade-in">
      <h2 class="mb-4 text-center text-primary fw-bold">
        <i class="bi bi-pie-chart me-2"></i> Tableau de bord : Statistiques
      </h2>
      <p class="text-center text-muted mb-5">Vue globale et analytique sur l'activité du centre de formation.</p>

      <!-- KPI Cards (Indicateurs clés) -->
      <div class="row text-center mb-5">
        <div class="col-md-3 mb-3">
          <div class="card shadow-sm border-primary h-100">
            <div class="card-body">
              <h5 class="card-title text-primary"><i class="bi bi-journal-bookmark-fill fs-3"></i></h5>
              <h2 class="display-5 fw-bold">{{ totalFormations }}</h2>
              <p class="text-muted">Formations totales</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card shadow-sm border-success h-100">
            <div class="card-body">
              <h5 class="card-title text-success"><i class="bi bi-people fs-3"></i></h5>
              <h2 class="display-5 fw-bold">{{ totalParticipants }}</h2>
              <p class="text-muted">Participants formés</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card shadow-sm border-warning h-100">
            <div class="card-body">
              <h5 class="card-title text-warning"><i class="bi bi-person-workspace fs-3"></i></h5>
              <h2 class="display-5 fw-bold">{{ totalFormateurs }}</h2>
              <p class="text-muted">Formateurs actifs</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card shadow-sm border-danger h-100">
            <div class="card-body">
              <h5 class="card-title text-danger"><i class="bi bi-cash-coin fs-3"></i></h5>
              <h2 class="display-5 fw-bold">{{ totalBudget | number:'1.0-0' }} €</h2>
              <p class="text-muted">Budget investi généré</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Graphiques -->
      <div class="row">
        <!-- Pie Chart : Formations par Domaine -->
        <div class="col-lg-6 mb-4">
          <div class="card shadow-sm h-100">
            <div class="card-header bg-white">
              <h5 class="mb-0 text-secondary"><i class="bi bi-pie-chart-fill me-2"></i> Répartition par Domaine</h5>
            </div>
            <div class="card-body d-flex justify-content-center p-4" style="height: 350px;">
              <canvas *ngIf="isDataReady" baseChart
                      [labels]="pieChartLabels"
                      [datasets]="pieChartDatasets"
                      [options]="pieChartOptions"
                      [legend]="true"
                      [type]="'pie'">
              </canvas>
              <div *ngIf="!isDataReady" class="spinner-border text-primary my-auto" role="status"></div>
            </div>
          </div>
        </div>

        <!-- Bar Chart : Formations par Année -->
        <div class="col-lg-6 mb-4">
          <div class="card shadow-sm h-100">
            <div class="card-header bg-white">
              <h5 class="mb-0 text-secondary"><i class="bi bi-bar-chart-line-fill me-2"></i> Évolution par Année</h5>
            </div>
            <div class="card-body p-4" style="height: 350px;">
              <canvas *ngIf="isDataReady" baseChart
                      [labels]="barChartLabels"
                      [datasets]="barChartDatasets"
                      [options]="barChartOptions"
                      [legend]="true"
                      [type]="'bar'">
              </canvas>
              <div *ngIf="!isDataReady" class="spinner-border text-primary my-auto" role="status"></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .fade-in { animation: fadeIn 0.5s; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class StatsComponent implements OnInit {
  isDataReady = false;

  // KPIs
  totalFormations = 0;
  totalParticipants = 0;
  totalFormateurs = 0;
  totalBudget = 0;

  // Pie Chart (Domaine)
  public pieChartOptions: ChartConfiguration['options'] = { responsive: true, maintainAspectRatio: false };
  public pieChartLabels: string[] = [];
  public pieChartDatasets = [ { data: [] as number[], backgroundColor: ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#6610f2', '#6f42c1', '#fd7e14', '#20c997'] } ];

  // Bar Chart (Années)
  public barChartOptions: ChartConfiguration['options'] = { responsive: true, maintainAspectRatio: false };
  public barChartLabels: string[] = [];
  public barChartDatasets: ChartConfiguration['data']['datasets'] = [ { data: [], label: 'Nombre de Formations', backgroundColor: '#dc3545' } ];

  constructor(
    private formationService: FormationService,
    private participantService: ParticipantService,
    private formateurService: FormateurService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats() {
    // 1. Charger les KPI basiques
    this.participantService.getAll().subscribe((res: any[]) => this.totalParticipants = res.length);
    this.formateurService.getAll().subscribe((res: any[]) => this.totalFormateurs = res.length);

    // 2. Charger les Formations et calculer les stats complexes
    this.formationService.getAll().subscribe((formations: any[]) => {
      this.totalFormations = formations.length;
      
      let domaineCounts: any = {};
      let anneesCounts: any = {};
      this.totalBudget = 0;

      formations.forEach((f: any) => {
        this.totalBudget += f.budget;

        // Stats Domaine
        let dom = f.domaine?.libelle || 'Inconnu';
        domaineCounts[dom] = (domaineCounts[dom] || 0) + 1;

        // Stats Année
        let annee = f.annee || 2024;
        anneesCounts[annee] = (anneesCounts[annee] || 0) + 1;
      });

      // Remplir le graphique Pie (Domaines)
      this.pieChartLabels = Object.keys(domaineCounts);
      this.pieChartDatasets[0].data = Object.values(domaineCounts);

      // Remplir le graphique Bar (Années) - ordonné par année
      const sortedYears = Object.keys(anneesCounts).sort();
      this.barChartLabels = sortedYears;
      this.barChartDatasets[0].data = sortedYears.map(y => anneesCounts[y]);

      this.isDataReady = true;
    });
  }
}