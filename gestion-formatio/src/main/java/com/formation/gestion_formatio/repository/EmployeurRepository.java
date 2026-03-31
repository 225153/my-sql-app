package com.formation.gestion_formatio.repository;

import com.formation.entity.Employeur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Interface Repository de l'entite Employeur.
 */
@Repository
public interface EmployeurRepository extends JpaRepository<Employeur, Long> {
}