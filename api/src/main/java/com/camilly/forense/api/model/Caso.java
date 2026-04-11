package com.camilly.forense.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "caso")
public class Caso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_processo", nullable = false, unique = true, length = 50)
    private String numeroProcesso;

    @Column(nullable = false, length = 200)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    private String status = "ABERTO";

    @Column(name = "data_abertura")
    private LocalDateTime dataAbertura;

    @OneToMany(mappedBy = "caso")
    private List<UsuarioCaso> usuarios;
}
