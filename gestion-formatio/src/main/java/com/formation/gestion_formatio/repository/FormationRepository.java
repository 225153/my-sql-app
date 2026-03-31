package com.formation.gestion_formatio.repository;

import com.formation.entity.Formation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Interface Repository pour Formation.
 */
@Repository
public interface FormationRepository extends JpaRepository<Formation, Long> {
}