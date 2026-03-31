package com.formation.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entité JPA "Profil". C'est l'étiquette métier d'un participant (ex: Chef de
 * projet, Développeur, Stagiaire, RH).
 * Géré sous forme de liste de référence (un participant a un profil).
 */
@Entity
@Table(name = "profil")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Profil {

    /**
     * ID de la table profil
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * @NotBlank valide que le libellé ne soit pas manquant en Java.
     *           unique = true empêche deux profils d'avoir exactement le même nom.
     */
    @NotBlank
    @Column(nullable = false, unique = true)
    private String libelle;
}
