package com.formation.gestion_formatio.controller;

import com.formation.entity.Participant;
import com.formation.gestion_formatio.service.ParticipantService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

/**
 * Le ContrÃ´leur qui expose les routes CRUD (Create, Read, Update, Delete) pour
 * l'entitÃ© Participant.
 * Il interagit avec le front-end via les requÃªtes HTTP JSON.
 */
@RestController
@PreAuthorize("hasAnyRole('ADMIN', 'USER', 'RESPONSABLE')")
@RequestMapping("/api/participants")
@CrossOrigin(origins = "http://localhost:4200") // Limite les accÃ¨s externes seulement Ã  l'application Angular qui
                                                // tourne sur le port 4200.
public class ParticipantController {

    // Injection de dÃ©pendance du service traitant la logique mÃ©tier des
    // Participants.
    private final ParticipantService service;

    public ParticipantController(ParticipantService service) {
        this.service = service;
    }

    /**
     * Fournit la collection complÃ¨te des participants inscrits.
     */
    @GetMapping
    public ResponseEntity<List<Participant>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    /**
     * Cherche un identifiant prÃ©cis en base de donnÃ©es.
     * Si l'Optional retournÃ© par le Service est plein, retourne le participant
     * (200
     * OK).
     * Sinon, retourne un code HTTP "404 Non TrouvÃ©" pour signaler l'anomalie.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Participant> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Sauvegarde un nouveau participant en base.
     * L'annotation @Valid impose l'Ã©valuation des rÃ¨gles @NotBlank et @Email
     * Ã©crites dans la classe EntitÃ© Participant.
     */
    @PostMapping
    public ResponseEntity<Participant> create(@Valid @RequestBody Participant participant) {
        return ResponseEntity.ok(service.save(participant));
    }

    /**
     * Ecrase un ancien participant par de nouvelles informations.
     * Pour s'assurer qu'on ne crÃ©e pas de doublon, on rÃ©cupÃ¨re l'identifiant
     * pour
     * l'assigner manuellement Ã  l'objet avant la sauvegarde.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Participant> update(@PathVariable Long id,
            @Valid @RequestBody Participant participantDetails) {
        return service.findById(id)
                .map(existing -> {
                    participantDetails.setId(existing.getId());
                    return ResponseEntity.ok(service.save(participantDetails));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Supprime dÃ©finitivement un participant suite Ã  une vÃ©rification prÃ©alable
     * d'existence.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!service.findById(id).isPresent()) {
            return ResponseEntity.notFound().build(); // On ne peut pas supprimer un truc qui n'existe pas.
        }
        service.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
