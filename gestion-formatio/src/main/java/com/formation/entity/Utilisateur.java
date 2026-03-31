package com.formation.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entité JPA "Utilisateur". Représente le compte de connexion à l'application.
 */
@Entity
@Table(name = "utilisateur")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Utilisateur {

    /**
     * ID de l'utilisateur (auto-incrémenté)
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * @NotBlank valide que le login ne soit pas vide.
     *           unique = true empêche deux utilisateurs d'avoir le même nom de
     *           compte.
     */
    @NotBlank
    @Column(nullable = false, unique = true)
    private String login;

    /**
     * Mot de passe (devrait idéalement être stocké chiffré en production).
     */
    @NotBlank
    @Column(nullable = false)
    private String password;

    /**
     * Clé étrangère vers "Role". Définit les droits de l'utilisateur.
     * 
     * @ManyToOne indique que "Plusieurs Utilisateurs ont le même Role"
     */
    @NotNull
    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;
}
