package com.camilly.forense.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "log_acesso")
public class LogAcesso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @Column(name = "id_sessao", nullable = false, length = 100)
    private String idSessao;

    @Column(name = "ip_origem", length = 45)
    private String ipOrigem;

    @Column(name = "endpoint_acessado", length = 255)
    private String endpointAcessado;

    @Column(name = "timestamp")
    private LocalDateTime timestamp;

    private Boolean anomalia = false;

    private Boolean sucesso = true;
}
