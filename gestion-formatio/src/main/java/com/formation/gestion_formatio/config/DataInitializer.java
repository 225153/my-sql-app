package com.formation.gestion_formatio.config;

import com.formation.entity.Role;
import com.formation.entity.Utilisateur;
import com.formation.gestion_formatio.repository.RoleRepository;
import com.formation.gestion_formatio.repository.UtilisateurRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UtilisateurRepository utilisateurRepository;

    public DataInitializer(RoleRepository roleRepository, UtilisateurRepository utilisateurRepository) {
        this.roleRepository = roleRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Créer le rôle ADMIN s'il n'existe pas
        Role adminRole;
        // On cherche d'abord par nom (mais on n'a pas de findByNom, on va s'appuyer sur
        // l'ID 1 ou on le crée)
        long adminRoleId = 1L;
        Optional<Role> roleOpt = roleRepository.findById(adminRoleId);
        if (roleOpt.isEmpty()) {
            adminRole = new Role();
            adminRole.setNom("ADMIN");
            adminRole = roleRepository.save(adminRole);
            System.out.println("✅ Rôle ADMIN créé !");
        } else {
            adminRole = roleOpt.get();
        }

        // 2. Créer l'utilisateur "admin" s'il n'existe pas
        if (utilisateurRepository.findByLogin("admin").isEmpty()) {
            Utilisateur adminUser = new Utilisateur();
            adminUser.setLogin("admin");
            adminUser.setPassword("admin123"); // Plus tard, nous crypterons ceci
            adminUser.setRole(adminRole);
            utilisateurRepository.save(adminUser);
            System.out.println("✅ Utilisateur 'admin' créé !");
        }
    }
}
