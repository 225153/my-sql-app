package com.formation.gestion_formatio.repository;

import com.formation.entity.Profil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Interface permettant de manipuler l'entité Profil en BD.
 */
@Repository
public interface ProfilRepository extends JpaRepository<Profil, Long> {
}
