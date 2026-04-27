package com.camilly.forense.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

import com.camilly.forense.api.model.enums.PapelCaso;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@Entity
@Table(name = "usuarios_do_caso")
public class UsuarioCaso {
    @EmbeddedId
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UsuarioCasoId id;

    @ManyToOne
    @MapsId("idUsuario")
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @ManyToOne
    @MapsId("idCaso")
    @JoinColumn(name = "id_caso")
    @JsonIgnoreProperties("usuarios")
    private Caso caso;

    @Enumerated(EnumType.STRING)
    @Column(name = "papel_no_caso", nullable = false)
    private PapelCaso papelNoCaso;

    @Column(name = "data_atribuicao")
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime dataAtribuicao;

    @Column(nullable = false)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Boolean ativo = true;
}
