package com.camilly.forense.api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

import com.camilly.forense.api.model.enums.StatusCaso;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@Entity
@Table(name = "caso")
public class Caso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;

    @NotBlank(message = "O número do processo é obrigatório")
    @Column(name = "numero_processo", nullable = false, unique = true, length = 50)
    private String numeroProcesso;

    @NotBlank(message = "O titulo do processo é obrigatório")
    @Column(nullable = false, length = 200)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Enumerated(EnumType.STRING)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private StatusCaso status = StatusCaso.ABERTO;

    @Column(name = "data_abertura")
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime dataAbertura;

    @OneToMany(mappedBy = "caso")
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @JsonIgnoreProperties("caso")
    private List<UsuarioCaso> usuarios;
}
