package com.formation.gestion_formatio.controller;

import com.formation.entity.Employeur;
import com.formation.gestion_formatio.service.EmployeurService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Le Contrôleur qui expose les routes CRUD (Create, Read, Update, Delete) pour
 * l'entité Employeur.
 * Interface de communication de type API Rest avec le code front-end (Angular).
 */
@RestController
@RequestMapping("/api/employeurs")
@CrossOrigin(origins = "http://localhost:4200") // Limite les accès externes seulement au front-end sur le port 4200.
public class EmployeurController {

    // Injection de la classe contenant la logique de l'Employeur
    private final EmployeurService service;

    public EmployeurController(EmployeurService service) {
        this.service = service;
    }

    /**
     * Renvoie la liste globale de tous les employeurs inscrits en BDD
     */
    @GetMapping
    public ResponseEntity<List<Employeur>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    /**
     * Utilise l'ID fourni dans l'URL pour renvoyer un Employeur précis (ou le
     * statut "404 Non Trouvé")
     */
    @GetMapping("/{id}")
    public ResponseEntity<Employeur> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Crée un nouvel Employeur. @Valid déclenche la vérification du champs
     * NOT_BLANK sur 'nomEmployeur'.
     */
    @PostMapping
    public ResponseEntity<Employeur> create(@Valid @RequestBody Employeur employeur) {
        return ResponseEntity.ok(service.save(employeur));
    }

    /**
     * Met à jour uniquement l'employeur cible. S'il n'existe pas, retourne une
     * réponse d'erreur HTTP 404
     */
    @PutMapping("/{id}")
    public ResponseEntity<Employeur> update(@PathVariable Long id, @Valid @RequestBody Employeur employeurDetails) {
        return service.findById(id)
                .map(existing -> {
                    employeurDetails.setId(existing.getId());
                    return ResponseEntity.ok(service.save(employeurDetails));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Efface physiquement un Employeur de la BD (si seulement il n'est pas lié à un
     * formateur).
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
