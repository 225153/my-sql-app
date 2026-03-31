package com.formation.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entité JPA "Participant". Représente la table de base de données des
 * étudiants / inscrits.
 * 
 * @Entity informe Spring Data que cette classe est mappable sur la BDD.
 * @Table précise le nom de la table créée dans MySQL.
 */
@Entity
@Table(name = "participant")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Participant {

    /**
     * Identifiant de la table (auto-incrémenté par la stratégie IDENTITY).
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * @NotBlank s'assure que la valeur n'est pas "null" ou remplie d'espaces.
     *           nullable = false impose la règle NON NULL en base de données.
     */
    @NotBlank
    @Column(nullable = false)
    private String nom;

    @NotBlank
    @Column(nullable = false)
    private String prenom;

    /**
     * @Email vérifie que la chaîne correspond au standard "texte@domaine.ext".
     *        unique = true empêche deux participants de s'inscrire avec la même
     *        adresse e-mail.
     */
    @NotBlank
    @Email
    @Column(nullable = false, unique = true)
    private String email;

    // Le téléphone n'a ni contrainte ni validation particulière, il peut être
    // laissé null.
    private String tel;

    /**
     * Relation vers la table Structure (L'endroit d'où vient ce paramètre, par ex:
     * Fac, Ecole, Entreprise).
     * 
     * @ManyToOne indique que "Plusieurs participants peuvent appartenir à la même
     *            Structure".
     */
    @NotNull
    @ManyToOne
    @JoinColumn(name = "structure_id")
    private Structure structure;

    /**
     * Relation vers la table Profil (Le métier ou l'étiquette du formateur, par ex:
     * Développeur, Chef d'équipe).
     * 
     * @ManyToOne signifie ici que le même métier/profil est partagé entre plusieurs
     *            participants.
     */
    @NotNull
    @ManyToOne
    @JoinColumn(name = "profil_id")
    private Profil profil;
}
