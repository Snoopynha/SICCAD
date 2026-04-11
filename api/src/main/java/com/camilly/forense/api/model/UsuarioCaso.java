package com.camilly.forense.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "usuarios_do_caso")
public class UsuarioCaso {
    @EmbeddedId
    private UsuarioCasoId id;

    @ManyToOne
    @MapsId("idUsuario")
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @ManyToOne
    @MapsId("idCaso")
    @JoinColumn(name = "id_caso")
    private Caso caso;

    @Column(name = "papel_no_caso", nullable = false)
    private String papelNoCaso;

    @Column(name = "data_atribuicao")
    private LocalDateTime dataAtribuicao;
}
