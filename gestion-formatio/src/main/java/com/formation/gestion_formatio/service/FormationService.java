package com.formation.gestion_formatio.service;

import com.formation.entity.Formation;
import com.formation.gestion_formatio.repository.FormationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Logique métier principale de l'application (Création de formation, mise à
 * jour, listes).
 */
@Service
public class FormationService {

    private final FormationRepository repository;

    public FormationService(FormationRepository repository) {
        this.repository = repository;
    }

    public List<Formation> findAll() {
        return repository.findAll();
    }

    public Optional<Formation> findById(Long id) {
        return repository.findById(id);
    }

    public Formation save(Formation formation) {
        return repository.save(formation);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
