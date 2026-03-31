package com.formation.gestion_formatio.controller;

import com.formation.entity.Domaine;
import com.formation.gestion_formatio.service.DomaineService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/domaines")
@CrossOrigin(origins = "http://localhost:4200")
public class DomaineController {

    private final DomaineService service;

    public DomaineController(DomaineService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Domaine>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Domaine> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Domaine> create(@Valid @RequestBody Domaine domaine) {
        return ResponseEntity.ok(service.save(domaine));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Domaine> update(@PathVariable Long id, @Valid @RequestBody Domaine domaineDetails) {
        return service.findById(id)
                .map(existingDomaine -> {
                    domaineDetails.setId(existingDomaine.getId()); // ensure ID doesn't change
                    return ResponseEntity.ok(service.save(domaineDetails));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!service.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        service.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
