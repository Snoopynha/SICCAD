package com.camilly.forense.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

import com.camilly.forense.api.model.enums.StatusEvidencia;

@Data
@Entity
@Table(name = "evidencia")
public class Evidencia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_caso", nullable = false)
    private Caso caso;

    @Column(name = "nome_original_arquivo", nullable = false, length = 255)
    private String nomeOriginalArquivo;

    @Column(name = "tamanho_bytes")
    private Long tamanhoBytes;

    @Column(name = "hash_sha256", nullable = false, length = 64)
    private String hashSha256;

    @Column(name = "caminho_arquivo", nullable = false, length = 500)
    private String caminhoArquivo;

    @Column(name = "data_upload")
    private LocalDateTime dataUpload;

    @Enumerated(EnumType.STRING)
    private StatusEvidencia status = StatusEvidencia.APREENDIDA;

    @ManyToOne
    @JoinColumn(name = "custodiante_atual")
    private Usuario custodianteAtual;
}
