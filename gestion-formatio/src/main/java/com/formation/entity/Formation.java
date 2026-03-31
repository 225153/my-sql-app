package com.formation.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Classe Model (Entité) représentant une "Formation" dans l'application.
 * L'annotation @Entity dit à Hibernate/Spring Data que cette classe correspond
 * à une table en Base de Données.
 * L'annotation @Table(name = "formation") permet de préciser le nom exact de la
 * table MySQL générée.
 * Les annotations @Data, @NoArgsConstructor, @AllArgsConstructor viennent de
 * Lombok :
 * elles génèrent automatiquement (et de façon invisible en arrière-plan) :
 * les Getters, les Setters, toString(), et les constructeurs (avec/sans
 * arguments).
 */
@Entity
@Table(name = "formation")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Formation {

    /**
     * @Id indique que cet attribut est la Clé Primaire (Primary Key) dans la table.
     * @GeneratedValue(strategy = GenerationType.IDENTITY) s'occupe de
     *                          l'auto-incrémentation (1, 2, 3, etc.) dans MySQL.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * @NotBlank valide au niveau du Backend (Java) que le titre ne peut pas être
     *           null ni vide (seulement des espaces).
     * @Column(nullable = false) applique cette même contrainte mais directement
     *                  comme une sécurité dans la base de données (NOT NULL SQL).
     */
    @NotBlank
    @Column(nullable = false)
    private String titre;

    @NotNull
    @Column(nullable = false)
    private Integer annee;

    /**
     * Contrainte métier : La durée doit impérativement être d'au moins 1 jour.
     */
    @NotNull
    @Min(1)
    @Column(nullable = false)
    private Integer duree;

    /**
     * @Positive s'assure qu'on ne peut pas avoir de budget négatif, utile pour
     *           éviter des requêtes malveillantes ou erronées.
     */
    @NotNull
    @Positive
    @Column(nullable = false)
    private Double budget;

    /**
     * Relation de cardinalité @ManyToOne (Plusieurs à Un).
     * Plusieurs formations peuvent appartenir au même domaine (ex: "Big Data").
     * 
     * @JoinColumn définit le nom exact de la clé étrangère (Foreign Key) dans la
     *             table formation ("domaine_id").
     */
    @NotNull
    @ManyToOne
    @JoinColumn(name = "domaine_id")
    private Domaine domaine;

    /**
     * Plusieurs formations peuvent être dispensées par le même formateur.
     * C'est un principe de clé étrangère standard dans une base relationnelle.
     */
    @NotNull
    @ManyToOne
    @JoinColumn(name = "formateur_id")
    private Formateur formateur;

    /**
     * Relation de cardinalité @ManyToMany (Plusieurs à Plusieurs).
     * - Une formation peut accueillir plusieurs participants.
     * - Un participant peut s'inscrire à plusieurs formations.
     * 
     * @JoinTable va demander à Hibernate de générer une table associative
     *            intermédiaire (table de jointure).
     *            Cette table s'appellera "formation_participant" et stockera
     *            simplement un couple {formation_id, participant_id}.
     */
    @ManyToMany
    @JoinTable(name = "formation_participant", joinColumns = @JoinColumn(name = "formation_id"), inverseJoinColumns = @JoinColumn(name = "participant_id"))
    private List<Participant> participants;
}
