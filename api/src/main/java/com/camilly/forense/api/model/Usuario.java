package com.camilly.forense.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

import com.camilly.forense.api.model.enums.TipoUsuario;

@Data
@Entity
@Table(name = "usuario")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 150)
    private String nome;

    @Column(nullable = false, unique = true, length = 14)
    private String cpf;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "senha_hash", nullable = false)
    private String senhaHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_global")
    private TipoUsuario tipoGlobal = TipoUsuario.PADRAO;

    @OneToMany(mappedBy = "usuario")
    private List<UsuarioCaso> casos;
}
