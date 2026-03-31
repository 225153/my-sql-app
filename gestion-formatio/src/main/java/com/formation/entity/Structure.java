package com.formation.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entité JPA "Structure". C'est l'établissement parent (ex: Université,
 * Entreprise partenaire).
 * Un "Participant" dépend toujours d'une Structure.
 */
@Entity
@Table(name = "structure")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Structure {

    /**
     * Clé primaire auto-générée par la BDD MySQL
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * @NotBlank valide que le libellé ne soit pas vide depuis le Java.
     *           unique = true empêche de créer deux structures avec le même nom
     *           (évite les doublons Fac de Rabat, Fac de Rabat).
     */
    @NotBlank
    @Column(nullable = false, unique = true)
    private String libelle;
}
