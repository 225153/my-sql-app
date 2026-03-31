package com.formation.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entité JPA "Employeur". Représente une entreprise ou organisme qui emploie un
 * formateur externe.
 * 
 * @Entity signale que c'est une table de base de données.
 * @Table fixe le nom de la table dans la base Mysql à "employeur".
 */
@Entity
@Table(name = "employeur")
@Data // Génère automatiquement les Getters/Setters via le composant Lombok
@NoArgsConstructor // Constructeur vide obligatoire pour JPA
@AllArgsConstructor // Constructeur avec l'ensemble des arguments
public class Employeur {

    /**
     * Un ID auto-incrémenté unique pour chaque employeur.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * @NotBlank est une validation Spring empêchant que ce champ soit null ou vide.
     *           nullable = false impose directement la règle dans le schéma MySQL
     *           (NOT NULL).
     */
    @NotBlank
    @Column(nullable = false)
    private String nomEmployeur;
}
