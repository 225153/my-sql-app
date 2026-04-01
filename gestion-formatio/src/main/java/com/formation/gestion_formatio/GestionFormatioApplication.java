package com.formation.gestion_formatio;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import com.formation.entity.Role;
import com.formation.entity.Utilisateur;
import com.formation.gestion_formatio.repository.RoleRepository;
import com.formation.gestion_formatio.repository.UtilisateurRepository;

@SpringBootApplication
@EntityScan("com.formation.entity")
@EnableJpaRepositories("com.formation.gestion_formatio.repository")
public class GestionFormatioApplication {

    public static void main(String[] args) {
        SpringApplication.run(GestionFormatioApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(UtilisateurRepository userRepository, RoleRepository roleRepository) {
        return args -> {
            Role adminRole = roleRepository.findByNom("ADMIN").orElseGet(() -> {
                Role r = new Role();
                r.setNom("ADMIN");
                return roleRepository.save(r);
            });

            Role respRole = roleRepository.findByNom("RESPONSABLE").orElseGet(() -> {
                Role r = new Role();
                r.setNom("RESPONSABLE");
                return roleRepository.save(r);
            });

            // Make sure USER role exists too
            roleRepository.findByNom("USER").orElseGet(() -> {
                Role r = new Role();
                r.setNom("USER");
                return roleRepository.save(r);
            });

            if (userRepository.findByLogin("admin").isEmpty()) {
                Utilisateur admin = new Utilisateur();
                admin.setLogin("admin");
                admin.setPassword("admin");
                admin.setRole(adminRole);
                userRepository.save(admin);
            }

            if (userRepository.findByLogin("resp").isEmpty()) {
                Utilisateur resp = new Utilisateur();
                resp.setLogin("resp");
                resp.setPassword("resp");
                resp.setRole(respRole);
                userRepository.save(resp);
            }
        };
    }
}
