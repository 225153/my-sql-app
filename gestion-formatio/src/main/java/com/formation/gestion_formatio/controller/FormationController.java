package com.formation.gestion_formatio.controller;

import com.formation.entity.Formation;
import com.formation.entity.Participant;
import com.formation.gestion_formatio.service.FormationService;
import com.formation.gestion_formatio.service.ParticipantService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Optional;

/**
 * ContrÃ´leur REST pour la gestion des Formations (API Backend).
 * Le @RestController
 * @PreAuthorize("hasAnyRole('ADMIN', 'USER')") indique Ã  Spring Boot que cette
 * classe va intercepter des
 * requÃªtes Web et retourner les donnÃ©es en format JSON.
 * 
 * @RequestMapping dÃ©finit la route racine de base de l'URL pour ce contrÃ´leur
 *                 (ex: http://localhost:8080/api/formations).
 * @CrossOrigin autorise spÃ©cifiquement l'interface locale Angular (port 4200)
 *              Ã 
 *              communiquer avec ce serveur sans dÃ©clencher l'erreur de
 *              sÃ©curitÃ©
 *              CORS.
 */
@RestController
@PreAuthorize("hasAnyRole('ADMIN', 'USER', 'RESPONSABLE')")
@RequestMapping("/api/formations")
@CrossOrigin(origins = "http://localhost:4200")
public class FormationController {

    private final FormationService formationService;
    private final ParticipantService participantService;

    /**
     * L'injection des dÃ©pendances (les Services mÃ©tier) par le constructeur.
     * C'est une bonne pratique de Spring (inversion de contrÃ´le) qui initialise
     * automatiquement ces objets
     * pour qu'on puisse appeler leurs mÃ©thodes sans faire de `new`.
     */
    public FormationController(FormationService formationService, ParticipantService participantService) {
        this.formationService = formationService;
        this.participantService = participantService;
    }

    /**
     * Endpoint (Point d'accÃ¨s) GET global.
     * Accessible via GET -> /api/formations
     * RÃ´le : Renvoie la liste complÃ¨te de toutes les formations existant en BDD.
     */
    @GetMapping
    public ResponseEntity<List<Formation>> getAll() {
        return ResponseEntity.ok(formationService.findAll());
    }

    /**
     * Endpoint GET ciblÃ©.
     * Le paramÃ¨tre {id} dans l'URL est capturÃ© dynamiquement par le @PathVariable
     * de la mÃ©thode.
     * Exemple : GET -> /api/formations/3 remontera la formation dont la clÃ©
     * primaire est 3.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Formation> getById(@PathVariable Long id) {
        return formationService.findById(id)
                .map(ResponseEntity::ok) // Si trouvÃ©, repond "200 OK" avec la donnÃ©e.
                .orElse(ResponseEntity.notFound().build()); // Sinon, code "404 Not Found"
    }

    /**
     * Endpoint POST (CrÃ©ation).
     * 
     * @RequestBody exige que les donnÃ©es venant d'Angular soient dans le corps de
     *              la requÃªte HTTP.
     * @Valid dÃ©clenche la vÃ©rification des contraintes sur l'objet Formation (par
     *        ex, champs non nuls).
     */
    @PostMapping
    public ResponseEntity<Formation> create(@Valid @RequestBody Formation formation) {
        return ResponseEntity.ok(formationService.save(formation));
    }

    /**
     * Endpoint PUT (Modification).
     * On cherche l'Ã©lÃ©ment par son ID. S'il existe on Ã©crase ses donnÃ©es par
     * les
     * nouvelles et on sauvegarde.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Formation> update(@PathVariable Long id, @Valid @RequestBody Formation formationDetails) {
        return formationService.findById(id)
                .map(existing -> {
                    formationDetails.setId(existing.getId()); // Garde la mÃªme clÃ© primaire.
                    return ResponseEntity.ok(formationService.save(formationDetails));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Endpoint DELETE (Suppression).
     * Supprime physiquement l'enregistrement de la base de donnÃ©es aprÃ¨s
     * vÃ©rification de son existence.
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
     * Action SpÃ©cifique (Association Many-To-Many) : POST.
     * Permet Ã  Angular d'affecter ou "Inscrire" un Ã©tudiant (Participant) Ã  une
     * Formation prÃ©cise.
     * L'URL requiert les deux ID.
     */
    @PostMapping("/{id}/participants/{participantId}")
    public ResponseEntity<Formation> addParticipant(@PathVariable Long id, @PathVariable Long participantId) {
        Optional<Formation> formationOpt = formationService.findById(id);
        Optional<Participant> participantOpt = participantService.findById(participantId);

        // Si l'Ã©lÃ¨ve et la formation existent bien tous les deux.
        if (formationOpt.isPresent() && participantOpt.isPresent()) {
            Formation formation = formationOpt.get();
            formation.getParticipants().add(participantOpt.get()); // Ajoute Ã  la liste persistante Java/Hibernate
            return ResponseEntity.ok(formationService.save(formation)); // Valide la transaction vers la BDD
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Action SpÃ©cifique (DÃ©sassociation) : DELETE.
     * Retire un participant d'une session de formation. ConcrÃ¨tement, cette action
     * supprime
     * seulement la "liaison" sans supprimer dÃ©finitivement l'Ã©lÃ¨ve pour autant.
     */
    @DeleteMapping("/{id}/participants/{participantId}")
    public ResponseEntity<Formation> removeParticipant(@PathVariable Long id, @PathVariable Long participantId) {
        Optional<Formation> formationOpt = formationService.findById(id);
        Optional<Participant> participantOpt = participantService.findById(participantId);

        if (formationOpt.isPresent() && participantOpt.isPresent()) {
            Formation formation = formationOpt.get();
            // Retire l'objet Participant de la collection gÃ©rÃ©e par l'entitÃ© Formation.
            formation.getParticipants().remove(participantOpt.get());
            return ResponseEntity.ok(formationService.save(formation));
        }
        return ResponseEntity.notFound().build();
    }
}
