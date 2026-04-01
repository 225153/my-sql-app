package com.formation.gestion_formatio.controller;

import com.formation.entity.Role;
import com.formation.entity.Utilisateur;
import com.formation.gestion_formatio.repository.RoleRepository;
import com.formation.gestion_formatio.service.UtilisateurService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final UtilisateurService utilisateurService;
    private final RoleRepository roleRepository;

    public AuthController(UtilisateurService utilisateurService, RoleRepository roleRepository) {
        this.utilisateurService = utilisateurService;
        this.roleRepository = roleRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String login = credentials.get("login");
        String password = credentials.get("password");

        Optional<Utilisateur> userOpt = utilisateurService.findByLogin(login);

        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            Map<String, String> response = new HashMap<>();
            response.put("token", "mock-jwt-token-replace-later");
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.badRequest().body("Login ou mot de passe incorrect");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> credentials) {
        String login = credentials.get("login");
        String password = credentials.get("password");

        if (utilisateurService.findByLogin(login).isPresent()) {
            return ResponseEntity.badRequest().body("Le nom d'utilisateur est déjà pris");
        }

        Role userRole = roleRepository.findByNom("USER").orElseGet(() -> {
            Role r = new Role();
            r.setNom("USER");
            return roleRepository.save(r);
        });

        Utilisateur nvUtilisateur = new Utilisateur();
        nvUtilisateur.setLogin(login);
        nvUtilisateur.setPassword(password);
        nvUtilisateur.setRole(userRole);

        Utilisateur savedUser = utilisateurService.save(nvUtilisateur);
        return ResponseEntity.ok(savedUser);
    }
}
