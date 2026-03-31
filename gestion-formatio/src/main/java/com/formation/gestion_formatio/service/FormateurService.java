package com.formation.gestion_formatio.service;

import com.formation.entity.Formateur;
import com.formation.gestion_formatio.repository.FormateurRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service pour la couche métier des Formateurs.
 * En charge du contact avec son interface de Repository associée.
 */
@Service
public class FormateurService {

    private final FormateurRepository repository;

    public FormateurService(FormateurRepository repository) {
        this.repository = repository;
    }

    public List<Formateur> findAll() {
        return repository.findAll();
    }

    public Optional<Formateur> findById(Long id) {
        return repository.findById(id);
    }

    public Formateur save(Formateur formateur) {
        return repository.save(formateur);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
