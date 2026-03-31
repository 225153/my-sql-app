package com.formation.gestion_formatio.controller;

import com.formation.entity.Utilisateur;
import com.formation.gestion_formatio.service.UtilisateurService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final UtilisateurService utilisateurService;

    public AuthController(UtilisateurService utilisateurService) {
        this.utilisateurService = utilisateurService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String login = credentials.get("login");
        String password = credentials.get("password");

        Optional<Utilisateur> userOpt = utilisateurService.findByLogin(login);

        // Basic mock verification (replace with AuthenticationManager and JwtUtils
        // later)
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            Map<String, String> response = new HashMap<>();
            response.put("token", "mock-jwt-token-replace-later"); // Replace with JWT generation
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.badRequest().body("Login ou mot de passe incorrect");
    }

    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> register(@RequestBody Utilisateur utilisateur) {
        // Here you would typically encode the password before saving
        Utilisateur savedUser = utilisateurService.save(utilisateur);
        return ResponseEntity.ok(savedUser);
    }
}
