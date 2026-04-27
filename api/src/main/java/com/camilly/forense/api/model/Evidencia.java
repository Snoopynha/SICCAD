package com.camilly.forense.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

import com.camilly.forense.api.model.enums.StatusEvidencia;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@Entity
@Table(name = "evidencia")
public class Evidencia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_caso", nullable = false)
    private Caso caso;

    @Column(name = "nome_original_arquivo", nullable = false, length = 255)
    private String nomeOriginalArquivo;

    @Column(name = "tamanho_bytes")
    private Long tamanhoBytes;

    @Column(name = "hash_sha256", nullable = false, length = 64)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String hashSha256;

    @JsonIgnore
    @Column(name = "caminho_arquivo", nullable = false, length = 500)
    private String caminhoArquivo;

    @Column(name = "data_upload")
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime dataUpload;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Enumerated(EnumType.STRING)
    private StatusEvidencia status = StatusEvidencia.APREENDIDA;

    @ManyToOne
    @JoinColumn(name = "custodiante_atual")
    private Usuario custodianteAtual;
}
