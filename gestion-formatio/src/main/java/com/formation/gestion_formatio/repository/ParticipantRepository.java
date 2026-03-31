package com.formation.gestion_formatio.repository;

import com.formation.entity.Participant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Interface Repository de l'entite Participant.
 */
@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Long> {
}