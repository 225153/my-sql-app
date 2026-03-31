package com.formation.gestion_formatio.service;

import com.formation.entity.Role;
import com.formation.gestion_formatio.repository.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Logique Métier traitant la table des Rôles applicatifs.
 */
@Service
public class RoleService {

    private final RoleRepository repository;

    public RoleService(RoleRepository repository) {
        this.repository = repository;
    }

    public List<Role> findAll() {
        return repository.findAll();
    }

    public Optional<Role> findById(Long id) {
        return repository.findById(id);
    }

    public Role save(Role role) {
        return repository.save(role);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
