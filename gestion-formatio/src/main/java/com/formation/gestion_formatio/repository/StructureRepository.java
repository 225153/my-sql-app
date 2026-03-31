package com.formation.gestion_formatio.repository;

import com.formation.entity.Structure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Interface responsable de la persistance de l'entité Structure.
 */
@Repository
public interface StructureRepository extends JpaRepository<Structure, Long> {
}
