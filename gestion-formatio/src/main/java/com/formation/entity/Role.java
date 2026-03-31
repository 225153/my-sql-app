package com.formation.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entité JPA "Role". Représente les droits d'accès à l'application.
 * Utilisé techniquement pour savoir si un Utilisateur est par exemple "ADMIN"
 * ou "USER".
 */
@Entity
@Table(name = "role")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Role {

    /**
     * ID du rôle dans la table de sécurité.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Le nom du compte de droit (unique=true signifie pas de rôles en double)
     */
    @NotBlank
    @Column(nullable = false, unique = true)
    private String nom;
}
