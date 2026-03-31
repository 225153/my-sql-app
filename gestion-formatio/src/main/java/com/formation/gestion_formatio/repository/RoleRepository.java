package com.formation.gestion_formatio.repository;

import com.formation.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository des Rôles. Les rôles (ex. ADMIN, USER) seront gérés via ce
 * JpaRepository.
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
}
