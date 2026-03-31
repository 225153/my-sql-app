package com.formation.gestion_formatio.service;

import com.formation.entity.Employeur;
import com.formation.gestion_formatio.repository.EmployeurRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service pour les Employeurs des formateurs externes.
 */
@Service
public class EmployeurService {

    private final EmployeurRepository repository;

    public EmployeurService(EmployeurRepository repository) {
        this.repository = repository;
    }

    public List<Employeur> findAll() {
        return repository.findAll();
    }

    public Optional<Employeur> findById(Long id) {
        return repository.findById(id);
    }

    public Employeur save(Employeur employeur) {
        return repository.save(employeur);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
