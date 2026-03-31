package com.formation.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entité JPA "Formateur". Représente le professionnel qui donne la formation.
 * 
 * @Entity informe Spring Data que cette classe est mappable sur la BDD.
 * @Table précise le nom de la table créée dans MySQL.
 */
@Entity
@Table(name = "formateur")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Formateur {

    /**
     * Identifiant de la table (auto-incrémenté par la stratégie IDENTITY).
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * @NotBlank s'assure que la valeur n'est pas "null" ou vide.
     *           nullable = false impose la règle NON NULL en base de données.
     */
    @NotBlank
    @Column(nullable = false)
    private String nom;

    @NotBlank
    @Column(nullable = false)
    private String prenom;

    /**
     * @Email vérifie que la chaîne correspond au standard d'un email.
     *        unique = true empêche deux formateurs d'avoir la même adresse e-mail.
     */
    @NotBlank
    @Email
    @Column(nullable = false, unique = true)
    private String email;

    // Le téléphone n'a ni contrainte ni validation particulière.
    private String tel;

    /**
     * Le type de formateur (interne à l'entreprise ou externe/indépendant).
     */
    @NotBlank
    @Column(nullable = false)
    private String type; // 'interne' or 'externe'

    /**
     * Relation vers la table Employeur. Si le formateur est externe, il est lié à
     * une entreprise (un employeur).
     * 
     * @ManyToOne indique que "Plusieurs formateurs externes peuvent appartenir au
     *            même Employeur".
     */
    @ManyToOne
    @JoinColumn(name = "employeur_id")
    private Employeur employeur;
}
