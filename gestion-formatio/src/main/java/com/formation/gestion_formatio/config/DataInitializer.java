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

        // Créer le rôle RESPONSABLE s'il n'existe pas
        Role respRole = roleRepository.findByNom("RESPONSABLE").orElseGet(() -> {
            Role r = new Role();
            r.setNom("RESPONSABLE");
            return roleRepository.save(r);
        });

        // 2. Créer ou Mettre à jour l'utilisateur "admin"
        Optional<Utilisateur> optAdmin = utilisateurRepository.findByLogin("admin");
        if (optAdmin.isEmpty()) {
            Utilisateur adminUser = new Utilisateur();
            adminUser.setLogin("admin");
            adminUser.setPassword("admin");
            adminUser.setRole(adminRole);
            utilisateurRepository.save(adminUser);
            System.out.println("✅ Utilisateur 'admin' créé avec mdp 'admin' !");
        } else {
            Utilisateur adminUser = optAdmin.get();
            adminUser.setPassword("admin");
            utilisateurRepository.save(adminUser);
        }

        // Créer ou Mettre à jour l'utilisateur "resp"
        Optional<Utilisateur> optResp = utilisateurRepository.findByLogin("resp");
        if (optResp.isEmpty()) {
            Utilisateur respUser = new Utilisateur();
            respUser.setLogin("resp");
            respUser.setPassword("resp");
            respUser.setRole(respRole);
            utilisateurRepository.save(respUser);
            System.out.println("✅ Utilisateur 'resp' créé avec mdp 'resp' !");
        } else {
            Utilisateur respUser = optResp.get();
            respUser.setPassword("resp");
            utilisateurRepository.save(respUser);
        }
    }
}
