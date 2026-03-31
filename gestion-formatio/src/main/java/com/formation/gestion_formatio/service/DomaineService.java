package com.formation.gestion_formatio.service;

import com.formation.entity.Domaine;
import com.formation.gestion_formatio.repository.DomaineRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DomaineService {

    private final DomaineRepository repository;

    public DomaineService(DomaineRepository repository) {
        this.repository = repository;
    }

    public List<Domaine> findAll() {
        return repository.findAll();
    }

    public Optional<Domaine> findById(Long id) {
        return repository.findById(id);
    }

    public Domaine save(Domaine domaine) {
        return repository.save(domaine);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
