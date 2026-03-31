package com.formation.gestion_formatio.service;

import com.formation.entity.Profil;
import com.formation.gestion_formatio.repository.ProfilRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service pour la couche métier des Profils.
 * Rend le Controller plus léger en absorbant les appels du Repository.
 */
@Service
public class ProfilService {

    private final ProfilRepository repository;

    public ProfilService(ProfilRepository repository) {
        this.repository = repository;
    }

    public List<Profil> findAll() {
        return repository.findAll();
    }

    public Optional<Profil> findById(Long id) {
        return repository.findById(id);
    }

    public Profil save(Profil profil) {
        return repository.save(profil); // Envoie l'entité à Hibernate pour exécution de la query
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
