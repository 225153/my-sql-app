import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { FormationService } from '../../services/formation.service';
import { DomaineService } from '../../services/domaine.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Bulle Flottante Chatbot -->
    <div class="chatbot-container animate__animated animate__fadeInUp" [class.open]="isOpen">
      
      <!-- Bouton Bulle (quand fermé) -->
      <button class="chat-toggle-btn shadow-lg rounded-circle border-0 text-white" (click)="toggleChat()" *ngIf="!isOpen">
        <i class="bi bi-robot fs-2"></i>
      </button>

      <!-- Fenêtre de Chat (quand ouvert) -->
      <div class="chat-window card shadow-lg border-0" *ngIf="isOpen">
        <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <span class="fw-bold"><i class="bi bi-stars me-2 text-warning"></i>Assistant IA Centre</span>
          <button class="btn btn-sm btn-outline-light border-0" (click)="toggleChat()"><i class="bi bi-x-lg"></i></button>
        </div>

        <div class="card-body p-0 d-flex flex-column bg-light overflow-hidden">
          <div class="messages-container p-3 flex-grow-1 overflow-auto" #scrollMe>
            <div *ngFor="let msg of messages" [ngClass]="msg.role === 'user' ? 'text-end mb-2' : 'mb-2'">
              <div [ngClass]="msg.role === 'user' ? 'user-msg d-inline-block p-2 rounded' : 'ai-msg d-inline-block p-2 rounded bg-white shadow-sm'">
                <i class="bi bi-robot me-1" *ngIf="msg.role ==='model'"></i>
                <span style="white-space: pre-wrap;">{{ msg.text }}</span>
              </div>
            </div>
            <div *ngIf="isTyping" class="text-muted small">
              <span class="spinner-grow spinner-grow-sm"></span> L'IA réfléchit...
            </div>
          </div>

          <div class="input-container p-2 bg-white border-top">
            <div class="input-group">
              <input type="text" class="form-control border-0" [(ngModel)]="userInput" (keyup.enter)="sendMessage()" placeholder="Posez une question sur le centre...">
              <button class="btn btn-warning rounded-circle ms-1" (click)="sendMessage()" [disabled]="!userInput || isTyping">
                <i class="bi bi-send-fill text-dark"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chatbot-container { position: fixed; bottom: 20px; right: 20px; z-index: 9999; }
    .chat-toggle-btn { width: 60px; height: 60px; background: linear-gradient(135deg, #ffc107, #fd7e14); transition: transform 0.3s; }
    .chat-toggle-btn:hover { transform: scale(1.1); }
    .chat-window { width: 350px; height: 450px; border-radius: 15px; }
    .messages-container { height: 330px; }
    .user-msg { background-color: #ffc107; color: #333; }
    .ai-msg { border-left: 3px solid #ffc107; max-width: 85%; }
  `]
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  
  isOpen = false;
  isTyping = false;
  userInput = '';
  
  // Clé API injectée depuis l'environnement ou placeholder (sécurisé via .gitignore)
  private API_KEY = ''; 
  private genAI = new GoogleGenerativeAI(this.API_KEY);
  private model = this.genAI.getGenerativeModel({ model: "gemma-3-4b-it" }); // Utilisation de l'ID exact gemma-3-12b-it (modèle Instruction Tuned libre)

  messages: { role: 'user' | 'model', text: string }[] = [
    { role: 'model', text: 'Bonjour ! Je suis votre assistant IA spécialisé dans ce centre de formation. Comment puis-je vous aider aujourd\'hui ?' }
  ];

  constructor(
    private formationService: FormationService,
    private domaineService: DomaineService
  ) {}

  ngAfterViewChecked() { this.scrollToBottom(); }

  scrollToBottom(): void {
    try { this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight; } catch(err) { }
  }

  toggleChat() { this.isOpen = !this.isOpen; }

  async sendMessage() {
    if (!this.userInput.trim() || this.isTyping) return;

    const userText = this.userInput;
    this.messages.push({ role: 'user', text: userText });
    this.userInput = '';
    this.isTyping = true;

    try {
      // Étape 1 : Récupérer les données réelles du projet pour le contexte
      const formations = await this.formationService.getAll().toPromise().catch(() => []) || [];
      const domaines = await this.domaineService.getAll().toPromise().catch(() => []) || [];

      // Étape 2 : Préparer le "Prompt Système" (System Instruction)
      const systemPrompt = `
        Tu es l'assistant intelligent d'un centre de gestion de formation nommé "GestionFormation Pro".
        Voici les données actuelles du centre extraites de la base de données :
        - Domaines disponibles : ${domaines.map(d => d.libelle).join(', ')}
        - Formations proposées : ${formations.map(f => f.titre + ' (Année: ' + f.annee + ', Budget: ' + f.budget + '€)').join(' ; ')}
        
        Tes missions :
        1. Répondre poliment et de manière professionnelle aux questions.
        2. Proposer des formations basées sur les domaines si l'utilisateur est indécis.
        3. Aider à la gestion administrative en expliquant les rôles (Admin, Responsable, Utilisateur).
        4. Si une question est hors sujet du centre, recadre poliment la conversation.
        Réponds de manière concise (max 3 phrases sauf si liste demandée).
      `;

      // Étape 3 : Appel API Gemini
      const chat = this.model.startChat({
        history: [{ role: 'user', parts: [{ text: systemPrompt }] }, { role: 'model', parts: [{ text: "Compris. Je suis prêt à aider les utilisateurs avec ces données." }] }],
      });

      const result = await chat.sendMessage(userText);
      const response = await result.response;
      const text = response.text();

      this.messages.push({ role: 'model', text: text });
    } catch (error) {
      console.error(error);
      this.messages.push({ role: 'model', text: "Désolé, j'ai une petite perte de connexion avec mon cerveau IA. Vérifie ta clé API." });
    } finally {
      this.isTyping = false;
    }
  }
}