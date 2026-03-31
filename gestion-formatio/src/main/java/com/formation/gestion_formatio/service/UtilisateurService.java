package com.formation.gestion_formatio.service;

import com.formation.entity.Utilisateur;
import com.formation.gestion_formatio.repository.UtilisateurRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service pour les Utilisateurs qui s'authentifient.
 * Peut être utilisé plus tard avec Spring Security pour la méthode de login.
 */
@Service
public class UtilisateurService {

    private final UtilisateurRepository repository;

    public UtilisateurService(UtilisateurRepository repository) {
        this.repository = repository;
    }

    public List<Utilisateur> findAll() {
        return repository.findAll();
    }

    public Optional<Utilisateur> findById(Long id) {
        return repository.findById(id);
    }

    /**
     * Recherche spécifique d'un login pour la procédure d'authentification (si on
     * veut le lier au UserDetailsService par la suite)
     */
    public Optional<Utilisateur> findByLogin(String login) {
        return repository.findByLogin(login);
    }

    public Utilisateur save(Utilisateur utilisateur) {
        return repository.save(utilisateur);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
