package com.formation.gestion_formatio.repository;

import com.formation.entity.Formateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Interface Repository dediee au Formateur.
 */
@Repository
public interface FormateurRepository extends JpaRepository<Formateur, Long> {
}