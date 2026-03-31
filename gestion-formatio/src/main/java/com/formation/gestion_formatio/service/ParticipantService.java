package com.formation.gestion_formatio.service;

import com.formation.entity.Participant;
import com.formation.gestion_formatio.repository.ParticipantRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Le Service gère la logique métier. Il agit comme un intermédiaire entre
 * le Contrôleur (qui reçoit les ordres) et le Repository (qui parle à la Base
 * de Données).
 * 
 * @Service indique à Spring d'instancier cette classe automatiquement.
 */
@Service
public class ParticipantService {

    // Connexion au Repository (l'interface qui génère les requêtes SQL)
    private final ParticipantRepository repository;

    public ParticipantService(ParticipantRepository repository) {
        this.repository = repository;
    }

    /**
     * Demande au repository de lire 100% de la table Participant (SELECT * FROM
     * participant)
     */
    public List<Participant> findAll() {
        return repository.findAll();
    }

    /**
     * Cherche un participant. Retourne un "Optional" pour éviter les
     * NullPointerExceptions
     * au cas où on cherche un ID qui n'existe plus.
     */
    public Optional<Participant> findById(Long id) {
        return repository.findById(id);
    }

    /**
     * Sauvegarde l'entité. Fait appel en arrière-plan à `INSERT INTO` (si nouvel
     * ID)
     * ou `UPDATE` (si l'ID est déjà en base).
     */
    public Participant save(Participant participant) {
        return repository.save(participant);
    }

    /**
     * Supprime physiquement la ligne SQL (`DELETE FROM participant WHERE id=?`).
     */
    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
