package com.formation.gestion_formatio.controller;

import com.formation.entity.Formateur;
import com.formation.gestion_formatio.service.FormateurService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

/**
 * Le ContrÃ´leur qui expose les routes CRUD (Create, Read, Update, Delete) pour
 * l'entitÃ© Formateur.
 * Il interagit avec le front-end via les requÃªtes HTTP JSON.
 */
@RestController
@PreAuthorize("hasAnyRole('ADMIN', 'USER', 'RESPONSABLE')")
@RequestMapping("/api/formateurs")
@CrossOrigin(origins = "http://localhost:4200") // Limite les accÃ¨s externes seulement Ã  l'application Angular.
public class FormateurController {

    // Injection du service contenant la logique mÃ©tier des Formateurs.
    private final FormateurService service;

    public FormateurController(FormateurService service) {
        this.service = service;
    }

    /**
     * Renvoie la liste de tous les formateurs enregistrÃ©s.
     */
    @GetMapping
    public ResponseEntity<List<Formateur>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    /**
     * RÃ©cupÃ¨re un formateur selon son ID. Renvoie une erreur 404 s'il n'existe
     * pas.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Formateur> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Enregistre un nouveau formateur dans la base de donnÃ©es aprÃ¨s validation
     * (@Valid).
     */
    @PostMapping
    public ResponseEntity<Formateur> create(@Valid @RequestBody Formateur formateur) {
        return ResponseEntity.ok(service.save(formateur));
    }

    /**
     * Met Ã  jour les informations d'un formateur existant.
     * Si l'ID est valide, on Ã©crase son ancien contenu. Sinon on retourne 404 (non
     * trouvÃ©).
     */
    @PutMapping("/{id}")
    public ResponseEntity<Formateur> update(@PathVariable Long id, @Valid @RequestBody Formateur formateurDetails) {
        return service.findById(id)
                .map(existing -> {
                    formateurDetails.setId(existing.getId());
                    return ResponseEntity.ok(service.save(formateurDetails));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Efface un formateur de la base de donnÃ©es.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!service.findById(id).isPresent()) {
            return ResponseEntity.notFound().build(); // On ne peut pas supprimer ce qu'on ne trouve pas.
        }
        service.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
