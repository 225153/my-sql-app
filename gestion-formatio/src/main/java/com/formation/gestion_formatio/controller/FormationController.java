package com.formation.gestion_formatio.controller;

import com.formation.entity.Formation;
import com.formation.entity.Participant;
import com.formation.gestion_formatio.service.FormationService;
import com.formation.gestion_formatio.service.ParticipantService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Contrôleur REST pour la gestion des Formations (API Backend).
 * Le @RestController indique à Spring Boot que cette classe va intercepter des
 * requêtes Web et retourner les données en format JSON.
 * 
 * @RequestMapping définit la route racine de base de l'URL pour ce contrôleur
 *                 (ex: http://localhost:8080/api/formations).
 * @CrossOrigin autorise spécifiquement l'interface locale Angular (port 4200) à
 *              communiquer avec ce serveur sans déclencher l'erreur de sécurité
 *              CORS.
 */
@RestController
@RequestMapping("/api/formations")
@CrossOrigin(origins = "http://localhost:4200")
public class FormationController {

    private final FormationService formationService;
    private final ParticipantService participantService;

    /**
     * L'injection des dépendances (les Services métier) par le constructeur.
     * C'est une bonne pratique de Spring (inversion de contrôle) qui initialise
     * automatiquement ces objets
     * pour qu'on puisse appeler leurs méthodes sans faire de `new`.
     */
    public FormationController(FormationService formationService, ParticipantService participantService) {
        this.formationService = formationService;
        this.participantService = participantService;
    }

    /**
     * Endpoint (Point d'accès) GET global.
     * Accessible via GET -> /api/formations
     * Rôle : Renvoie la liste complète de toutes les formations existant en BDD.
     */
    @GetMapping
    public ResponseEntity<List<Formation>> getAll() {
        return ResponseEntity.ok(formationService.findAll());
    }

    /**
     * Endpoint GET ciblé.
     * Le paramètre {id} dans l'URL est capturé dynamiquement par le @PathVariable
     * de la méthode.
     * Exemple : GET -> /api/formations/3 remontera la formation dont la clé
     * primaire est 3.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Formation> getById(@PathVariable Long id) {
        return formationService.findById(id)
                .map(ResponseEntity::ok) // Si trouvé, repond "200 OK" avec la donnée.
                .orElse(ResponseEntity.notFound().build()); // Sinon, code "404 Not Found"
    }

    /**
     * Endpoint POST (Création).
     * 
     * @RequestBody exige que les données venant d'Angular soient dans le corps de
     *              la requête HTTP.
     * @Valid déclenche la vérification des contraintes sur l'objet Formation (par
     *        ex, champs non nuls).
     */
    @PostMapping
    public ResponseEntity<Formation> create(@Valid @RequestBody Formation formation) {
        return ResponseEntity.ok(formationService.save(formation));
    }

    /**
     * Endpoint PUT (Modification).
     * On cherche l'élément par son ID. S'il existe on écrase ses données par les
     * nouvelles et on sauvegarde.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Formation> update(@PathVariable Long id, @Valid @RequestBody Formation formationDetails) {
        return formationService.findById(id)
                .map(existing -> {
                    formationDetails.setId(existing.getId()); // Garde la même clé primaire.
                    return ResponseEntity.ok(formationService.save(formationDetails));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Endpoint DELETE (Suppression).
     * Supprime physiquement l'enregistrement de la base de données après
     * vérification de son existence.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!formationService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        formationService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    /**
     * Action Spécifique (Association Many-To-Many) : POST.
     * Permet à Angular d'affecter ou "Inscrire" un étudiant (Participant) à une
     * Formation précise.
     * L'URL requiert les deux ID.
     */
    @PostMapping("/{id}/participants/{participantId}")
    public ResponseEntity<Formation> addParticipant(@PathVariable Long id, @PathVariable Long participantId) {
        Optional<Formation> formationOpt = formationService.findById(id);
        Optional<Participant> participantOpt = participantService.findById(participantId);

        // Si l'élève et la formation existent bien tous les deux.
        if (formationOpt.isPresent() && participantOpt.isPresent()) {
            Formation formation = formationOpt.get();
            formation.getParticipants().add(participantOpt.get()); // Ajoute à la liste persistante Java/Hibernate
            return ResponseEntity.ok(formationService.save(formation)); // Valide la transaction vers la BDD
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Action Spécifique (Désassociation) : DELETE.
     * Retire un participant d'une session de formation. Concrètement, cette action
     * supprime
     * seulement la "liaison" sans supprimer définitivement l'élève pour autant.
     */
    @DeleteMapping("/{id}/participants/{participantId}")
    public ResponseEntity<Formation> removeParticipant(@PathVariable Long id, @PathVariable Long participantId) {
        Optional<Formation> formationOpt = formationService.findById(id);
        Optional<Participant> participantOpt = participantService.findById(participantId);

        if (formationOpt.isPresent() && participantOpt.isPresent()) {
            Formation formation = formationOpt.get();
            // Retire l'objet Participant de la collection gérée par l'entité Formation.
            formation.getParticipants().remove(participantOpt.get());
            return ResponseEntity.ok(formationService.save(formation));
        }
        return ResponseEntity.notFound().build();
    }
}
