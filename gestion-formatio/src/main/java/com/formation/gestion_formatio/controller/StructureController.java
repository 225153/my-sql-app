package com.formation.gestion_formatio.controller;

import com.formation.entity.Structure;
import com.formation.gestion_formatio.service.StructureService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * API REST Controller pour "Structure".
 * Il gère la réception des requêtes web (HTTP GET, POST, etc.) venant
 * d'Angular.
 */
@RestController
@RequestMapping("/api/structures")
@CrossOrigin(origins = "http://localhost:4200") // Angular s'exécute sur le port 4200. Ceci l'autorise à lire l'API en
                                                // évitant les erreurs CORS.
public class StructureController {

    private final StructureService service;

    public StructureController(StructureService service) {
        this.service = service;
    }

    /**
     * Charge toutes les structures enregistrées
     */
    @GetMapping
    public ResponseEntity<List<Structure>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    /**
     * Appelle le service pour trouver un ID. Le .map vérifie le Null.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Structure> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Sauvegarde. La validation (@Valid) bloque toute tentative de création d'une
     * structure "vide"
     */
    @PostMapping
    public ResponseEntity<Structure> create(@Valid @RequestBody Structure structure) {
        return ResponseEntity.ok(service.save(structure));
    }

    /**
     * Met à jour en injectant l'existant ID dans les nouveaux paramètres avant
     * persistance Jpa
     */
    @PutMapping("/{id}")
    public ResponseEntity<Structure> update(@PathVariable Long id, @Valid @RequestBody Structure structureDetails) {
        return service.findById(id)
                .map(existing -> {
                    structureDetails.setId(existing.getId());
                    return ResponseEntity.ok(service.save(structureDetails));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Requête de suppression de la table "Structure"
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!service.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        service.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
