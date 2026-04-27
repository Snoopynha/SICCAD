package com.camilly.forense.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

import com.camilly.forense.api.model.enums.AcaoCustodia;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@Entity
@Table(name = "historico_custodia")
public class HistoricoCustodia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_evidencia", nullable = false)
    private Evidencia evidencia;

    @ManyToOne
    @JoinColumn(name = "custodiante_anterior")
    private Usuario custodianteAnterior;

    @ManyToOne
    @JoinColumn(name = "custodiante_posterior")
    private Usuario custodiantePosterior;

    @Column(name = "data_hora")
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime dataHora;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private AcaoCustodia acao;

    @Column(columnDefinition = "TEXT")
    private String justificativa;

    @Column(name = "validacao_hash", length = 64)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String validacaoHash;

    @Column(name = "auditoria_corrente_hash", length = 64)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String auditoriaCorrenteHash;
}
