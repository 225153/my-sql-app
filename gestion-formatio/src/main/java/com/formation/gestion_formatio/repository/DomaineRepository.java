package com.formation.gestion_formatio.repository;

import com.formation.entity.Domaine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Interface Repository pour Domaine.
 */
@Repository
public interface DomaineRepository extends JpaRepository<Domaine, Long> {
}