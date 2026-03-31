package com.formation.gestion_formatio.controller;

import com.formation.entity.Participant;
import com.formation.gestion_formatio.service.ParticipantService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Le Contrôleur qui expose les routes CRUD (Create, Read, Update, Delete) pour
 * l'entité Participant.
 * Il interagit avec le front-end via les requêtes HTTP JSON.
 */
@RestController
@RequestMapping("/api/participants")
@CrossOrigin(origins = "http://localhost:4200") // Limite les accès externes seulement à l'application Angular qui
                                                // tourne sur le port 4200.
public class ParticipantController {

    // Injection de dépendance du service traitant la logique métier des
    // Participants.
    private final ParticipantService service;

    public ParticipantController(ParticipantService service) {
        this.service = service;
    }

    /**
     * Fournit la collection complète des participants inscrits.
     */
    @GetMapping
    public ResponseEntity<List<Participant>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    /**
     * Cherche un identifiant précis en base de données.
     * Si l'Optional retourné par le Service est plein, retourne le participant (200
     * OK).
     * Sinon, retourne un code HTTP "404 Non Trouvé" pour signaler l'anomalie.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Participant> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Sauvegarde un nouveau participant en base.
     * L'annotation @Valid impose l'évaluation des règles @NotBlank et @Email
     * écrites dans la classe Entité Participant.
     */
    @PostMapping
    public ResponseEntity<Participant> create(@Valid @RequestBody Participant participant) {
        return ResponseEntity.ok(service.save(participant));
    }

    /**
     * Ecrase un ancien participant par de nouvelles informations.
     * Pour s'assurer qu'on ne crée pas de doublon, on récupère l'identifiant pour
     * l'assigner manuellement à l'objet avant la sauvegarde.
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
     * Supprime définitivement un participant suite à une vérification préalable
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
