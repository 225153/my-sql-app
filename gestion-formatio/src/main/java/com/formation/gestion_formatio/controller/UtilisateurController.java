package com.formation.gestion_formatio.controller;

import com.formation.entity.Utilisateur;
import com.formation.gestion_formatio.service.UtilisateurService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller Rest pour "Utilisateur".
 * Expose la gestion des comptes de sécurité, et vérifie (via Spring Security)
 * si celui qui demande l'accès par API a les droits suffisants.
 */
@RestController
@RequestMapping("/api/utilisateurs")
@CrossOrigin(origins = "http://localhost:4200") // Permet les appels depuis l'Angular FrontEnd en développement (port
                                                // 4200).
public class UtilisateurController {

    private final UtilisateurService service;

    public UtilisateurController(UtilisateurService service) {
        this.service = service;
    }

    /**
     * Liste sécurisée des comptes
     * 
     * @PreAuthorize : Vérifie que le JWT Token / la session provient bien de
     *               quelqu'un ayant le rôle 'ADMIN'.
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')") // Admin only
    public ResponseEntity<List<Utilisateur>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    /**
     * Trouver un utilisateur par son ID (pour que le FrontEnd puisse par exemple
     * pré-remplir un formulaire).
     */
    @GetMapping("/{id}")
    public ResponseEntity<Utilisateur> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Sauvegarde. Reçoit le JSON de l'objet, lance la validation pour assurer qu'un
     * Login et Password sont saisis.
     */
    @PostMapping
    public ResponseEntity<Utilisateur> create(@Valid @RequestBody Utilisateur utilisateur) {
        return ResponseEntity.ok(service.save(utilisateur));
    }

    /**
     * Modifie un Utilisateur ciblé.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Utilisateur> update(@PathVariable Long id,
            @Valid @RequestBody Utilisateur utilisateurDetails) {
        return service.findById(id)
                .map(existing -> {
                    utilisateurDetails.setId(existing.getId());
                    return ResponseEntity.ok(service.save(utilisateurDetails));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Seul un compte accrédité ADMIN peut supprimer un autre Utilisateur.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Admin only
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!service.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        service.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
