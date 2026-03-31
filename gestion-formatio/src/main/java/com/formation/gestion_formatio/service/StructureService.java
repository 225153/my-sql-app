package com.formation.gestion_formatio.service;

import com.formation.entity.Structure;
import com.formation.gestion_formatio.repository.StructureRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service pour la Structure (Établissements / Entreprises).
 * Sépare le métier de la gestion Web (Controller).
 */
@Service
public class StructureService {

    private final StructureRepository repository;

    // L'Injection de la dépendance permet à Spring Boot de lancer le Service en
    // reliant la BDD automatiquement
    public StructureService(StructureRepository repository) {
        this.repository = repository;
    }

    public List<Structure> findAll() {
        return repository.findAll(); // Action basique = ramène tous les enregistrements
    }

    public Optional<Structure> findById(Long id) {
        return repository.findById(id);
    }

    public Structure save(Structure structure) {
        return repository.save(structure); // S'il y a un ID c'est une modif, sinon une création
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
