package com.formation.gestion_formatio.controller;

import com.formation.entity.Profil;
import com.formation.gestion_formatio.service.ProfilService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

/**
 * Controller Rest pour le nettoyage de la table "Profils".
 * Les Participants utilisent cette liste depuis le Front-End angular pour
 * s'inscrire correctement.
 */
@RestController
@PreAuthorize("hasRole('ADMIN')")
@RequestMapping("/api/profils")
@CrossOrigin(origins = "http://localhost:4200") // Permet les appels depuis le FrontEnd qui tourne en serveur Web sur
                                                // 4200.
public class ProfilController {

    private final ProfilService service;

    public ProfilController(ProfilService service) {
        this.service = service;
    }

    /**
     * Renvoie la liste complÃ¨te de tous les Profils en JSON
     */
    @GetMapping
    public ResponseEntity<List<Profil>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    /**
     * Trouver un Profil unique via son clÃ© primaire l'URL.
     * Renvoie 404 en cas d'un nombre non attribuÃ©.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Profil> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Enregistrement en POST aprÃ¨s le mapping valide au format JSON
     */
    @PostMapping
    public ResponseEntity<Profil> create(@Valid @RequestBody Profil profil) {
        return ResponseEntity.ok(service.save(profil));
    }

    /**
     * Edition manuelle du nom de profil (par exemple changer 'Developpeur' en
     * 'Manager IT').
     */
    @PutMapping("/{id}")
    public ResponseEntity<Profil> update(@PathVariable Long id, @Valid @RequestBody Profil profilDetails) {
        return service.findById(id)
                .map(existing -> {
                    profilDetails.setId(existing.getId());
                    return ResponseEntity.ok(service.save(profilDetails));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Retrait global de l'appellation Profil.
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

